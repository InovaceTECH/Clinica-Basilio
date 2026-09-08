import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { inArray } from "drizzle-orm";

import { AuthorizationError } from "../src/auth/authorization";
import { parseTenantContext } from "../src/auth/tenant-context";
import { db } from "../src/db";
import { clinics, commercialRules, objectionPlaybooks, users } from "../src/db/schema";
import {
  getAiCommercialContext,
  getCommercialRules,
  getPlaybooks,
} from "../src/services/commercial-config/queries";
import { commercialConfigSchema } from "../src/schemas/commercial-config";
import { buildOpportunityAnalysisPrompt } from "../src/services/ai/prompts/opportunity-analysis";

async function checkCommercialConfig() {
  const clinicAId = randomUUID();
  const clinicBId = randomUUID();
  const managerAId = randomUUID();
  const receptionistAId = randomUUID();
  const managerBId = randomUUID();

  try {
    await db.insert(clinics).values([
      { id: clinicAId, name: "Commercial config check A" },
      { id: clinicBId, name: "Commercial config check B" },
    ]);
    await db.insert(users).values([
      { id: managerAId, clinicId: clinicAId, name: "Manager A", email: `commercial-a-${randomUUID()}@example.invalid`, role: "MANAGER" },
      { id: receptionistAId, clinicId: clinicAId, name: "Receptionist A", email: `commercial-reception-${randomUUID()}@example.invalid`, role: "RECEPTIONIST" },
      { id: managerBId, clinicId: clinicBId, name: "Manager B", email: `commercial-b-${randomUUID()}@example.invalid`, role: "MANAGER" },
    ]);
    await db.insert(commercialRules).values([
      { clinicId: clinicAId, title: "Parcelamento", content: "Parcelamento aprovado em até 10 vezes.", active: true },
      { clinicId: clinicAId, title: "Regra inativa", content: "Não deve ir para a IA.", active: false },
      { clinicId: clinicBId, title: "Regra externa", content: "Não deve vazar entre clínicas.", active: true },
    ]);
    await db.insert(objectionPlaybooks).values([
      { clinicId: clinicAId, category: "FINANCIAL", title: "Financeiro", objective: "Entender a barreira.", guidelines: "Use apenas condições aprovadas.", active: true },
      { clinicId: clinicBId, category: "FINANCIAL", title: "Externo", objective: "Não deve vazar.", guidelines: "Não deve aparecer.", active: true },
    ]);

    const managerA = parseTenantContext({ userId: managerAId, clinicId: clinicAId, role: "MANAGER" });
    const receptionistA = parseTenantContext({ userId: receptionistAId, clinicId: clinicAId, role: "RECEPTIONIST" });
    const rules = await getCommercialRules(managerA);
    const playbooks = await getPlaybooks(receptionistA);
    const aiContext = await getAiCommercialContext(managerA, "FINANCIAL");

    assert.equal(rules.length, 2);
    assert.equal(playbooks.length, 1);
    assert.match(aiContext.join("\n"), /Parcelamento aprovado/);
    assert.match(aiContext.join("\n"), /Financeiro/);
    assert.doesNotMatch(aiContext.join("\n"), /inativa|externa|vazar/i);
    await assert.rejects(getCommercialRules(receptionistA), AuthorizationError);

    const longRule = commercialConfigSchema.parse({ type: "rule", title: "Regra extensa", content: "R".repeat(4_000) });
    assert.equal(longRule.type, "rule");
    if (longRule.type !== "rule") throw new Error("Tipo de regra inválido.");
    const longPlaybook = commercialConfigSchema.parse({
      type: "playbook", category: "INDECISION", title: "T".repeat(160),
      objective: "O".repeat(2_000), guidelines: "G".repeat(4_000), suggestedQuestions: "P".repeat(4_000),
    });
    assert.equal(longPlaybook.type, "playbook");
    if (longPlaybook.type !== "playbook") throw new Error("Tipo de playbook inválido.");
    await db.insert(commercialRules).values(Array.from({ length: 21 }, () => ({
      clinicId: clinicAId, title: longRule.title, content: longRule.content, active: true,
    })));
    await db.insert(objectionPlaybooks).values({ ...longPlaybook, clinicId: clinicAId, active: true });
    const extendedContext = await getAiCommercialContext(managerA, "INDECISION");
    assert.equal(extendedContext.length, 23);
    const prompt = buildOpportunityAnalysisPrompt({
      budgetValue: 1_200, firstName: "Pessoa", treatment: "Tratamento de teste", commercialRules: extendedContext,
    });
    const serialized = JSON.parse(prompt.user.replace(/^<patient_context>\n|\n<\/patient_context>$/g, ""));
    assert.deepEqual(serialized.commercial_rules, extendedContext);
    assert.ok(extendedContext.some(entry => entry.length === 10_166));

    console.log("Regras, playbooks no tamanho máximo, mais de 20 entradas no prompt e isolamento validados sem truncar o contexto.");
  } finally {
    await db.delete(objectionPlaybooks).where(inArray(objectionPlaybooks.clinicId, [clinicAId, clinicBId]));
    await db.delete(commercialRules).where(inArray(commercialRules.clinicId, [clinicAId, clinicBId]));
    await db.delete(users).where(inArray(users.id, [managerAId, receptionistAId, managerBId]));
    await db.delete(clinics).where(inArray(clinics.id, [clinicAId, clinicBId]));
  }
}

void checkCommercialConfig();
