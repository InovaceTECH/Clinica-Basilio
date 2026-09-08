import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { and, eq, inArray } from "drizzle-orm";

import { parseTenantContext } from "../src/auth/tenant-context";
import { db } from "../src/db";
import { aiAnalyses, clinics, opportunities, patients, users } from "../src/db/schema";
import { analyzeOpportunity } from "../src/services/ai/analyze-opportunity";
import { OpenRouterError } from "../src/services/ai/openrouter";
import { opportunityAnalysisResponseFormat } from "../src/services/ai/schemas/opportunity-analysis-schema";
import {
  getLatestOpportunityAnalysis,
  getOpportunityAnalysisHistory,
} from "../src/services/ai/queries";
import { createOpportunity } from "../src/services/opportunities/commands";
import { createPatient } from "../src/services/patients/commands";

async function checkAiAnalysis() {
  const clinicId = randomUUID();
  const managerId = randomUUID();

  try {
    await db.insert(clinics).values({ id: clinicId, name: "AI analysis check" });
    await db.insert(users).values({
      id: managerId,
      clinicId,
      name: "AI manager",
      email: `ai-${randomUUID()}@example.invalid`,
      role: "MANAGER",
    });
    const tenant = parseTenantContext({ clinicId, role: "MANAGER", userId: managerId });
    const patient = await createPatient(tenant, {
      name: "Ana da Silva",
      externalReference: `crm-${randomUUID()}`,
      phone: "11999999999",
    });
    const opportunity = await createOpportunity(tenant, {
      patientId: patient.id,
      treatment: "Implante unitário",
      budgetDate: new Date("2026-09-02T00:00:00.000Z"),
      budgetValue: 4_500,
      notes: "Informação clínica confidencial que não é necessária para a abordagem comercial.",
      rawObjection: "Está caro neste momento.",
    });
    const stored = await analyzeOpportunity(tenant, opportunity.id, {
      client: {
        async complete(input) {
          assert.deepEqual(input.responseFormat, opportunityAnalysisResponseFormat);
          assert.equal(input.maxTokens, 2_000);
          assert.doesNotMatch(
            input.messages[1]?.content ?? "",
            /Informação clínica confidencial/,
          );
          return {
            content: JSON.stringify({
              objection_category: "FINANCIAL",
              context_analysis: "A principal barreira parece estar relacionada ao valor do orçamento.",
              contact_goal: "Entender se a dificuldade está no valor total ou na forma de pagamento.",
              strategy: "Retomar o contato de modo consultivo e sem pressão comercial.",
              suggested_approach: "Perguntar se existe alguma condição já disponível que ajudaria na decisão.",
              suggested_message: "Olá, Ana! Posso entender melhor qual parte do orçamento ficou mais difícil?",
              next_action: "Registrar a resposta e consultar apenas condições comerciais já cadastradas.",
              suggested_follow_up_days: 3,
            }),
            model: "openrouter/free",
            usage: { completionTokens: 120, promptTokens: 280, totalTokens: 400 },
          };
        },
      },
    });
    const [persisted] = await db
      .select()
      .from(aiAnalyses)
      .where(and(eq(aiAnalyses.id, stored.id), eq(aiAnalyses.clinicId, clinicId)));

    assert.equal(persisted?.opportunityId, opportunity.id);
    assert.equal(persisted?.promptVersion, "OPPORTUNITY_ANALYSIS_V1");
    assert.equal(persisted?.objectionCategory, "FINANCIAL");
    assert.equal(persisted?.inputTokens, 280);
    assert.equal(persisted?.outputTokens, 120);

    const latest = await getLatestOpportunityAnalysis(tenant, opportunity.id);
    const history = await getOpportunityAnalysisHistory(tenant, opportunity.id);
    assert.equal(latest?.id, stored.id);
    assert.equal(history[0]?.id, stored.id);

    for (const content of ["{", '{"objection_category":"FINANCIAL"}']) {
      await assert.rejects(analyzeOpportunity(tenant, opportunity.id, {
        client: { async complete() { return { content, model: "test-model" }; } },
      }), (error: unknown) => error instanceof OpenRouterError && error.code === "AI_INVALID_RESPONSE");
    }
    assert.equal((await getOpportunityAnalysisHistory(tenant, opportunity.id)).length, history.length,
      "Uma resposta inválida não deve ser persistida.");

    console.log("Análise validada, isolada por clínica e persistida sem chamada externa.");
  } finally {
    await db.delete(aiAnalyses).where(eq(aiAnalyses.clinicId, clinicId));
    await db.delete(opportunities).where(eq(opportunities.clinicId, clinicId));
    await db.delete(patients).where(eq(patients.clinicId, clinicId));
    await db.delete(users).where(inArray(users.id, [managerId]));
    await db.delete(clinics).where(inArray(clinics.id, [clinicId]));
  }
}

void checkAiAnalysis();
