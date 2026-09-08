import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";

import { parseTenantContext } from "../src/auth/tenant-context";
import { db } from "../src/db";
import { clinics, followUps, interactions, opportunities, patients, users } from "../src/db/schema";
import { createInteraction, InteractionOpportunityNotFoundError } from "../src/services/interactions/commands";
import { createFollowUp } from "../src/services/follow-ups/commands";
import { getDashboardKpis } from "../src/services/dashboard/queries";
import {
  getOpportunityInteractionHistory,
  getRecentOpportunityInteractions,
} from "../src/services/interactions/queries";
import { createOpportunity } from "../src/services/opportunities/commands";
import { createPatient } from "../src/services/patients/commands";

async function checkInteractions() {
  const clinicId = randomUUID();
  const managerId = randomUUID();
  const otherClinicId = randomUUID();
  const otherManagerId = randomUUID();

  try {
    await db.insert(clinics).values({ id: clinicId, name: "Interaction check" });
    await db.insert(users).values({
      id: managerId,
      clinicId,
      name: "Interaction manager",
      email: `interaction-${randomUUID()}@example.invalid`,
      role: "MANAGER",
    });
    await db.insert(clinics).values({ id: otherClinicId, name: "Other interaction check" });
    await db.insert(users).values({
      id: otherManagerId,
      clinicId: otherClinicId,
      name: "Other interaction manager",
      email: `other-interaction-${randomUUID()}@example.invalid`,
      role: "MANAGER",
    });
    const tenant = parseTenantContext({ clinicId, role: "MANAGER", userId: managerId });
    const otherTenant = parseTenantContext({ clinicId: otherClinicId, role: "MANAGER", userId: otherManagerId });
    const patient = await createPatient(tenant, {
      name: "Joana da Silva",
      phone: "11999999999",
    });
    const opportunity = await createOpportunity(tenant, {
      patientId: patient.id,
      treatment: "Clareamento dental",
      budgetDate: new Date("2026-09-02T00:00:00.000Z"),
      budgetValue: 1_200,
    });

    const interaction = await createInteraction(tenant, {
      opportunityId: opportunity.id,
      channel: "WHATSAPP",
      result: "REQUESTED_CALLBACK",
      notes: "Paciente pediu retorno após conversar com a família.",
    });
    const recentInteractions = await getRecentOpportunityInteractions(tenant, opportunity.id);
    const history = await getOpportunityInteractionHistory(tenant, opportunity.id);
    const otherClinicInteractions = await getRecentOpportunityInteractions(otherTenant, opportunity.id);
    const [updatedOpportunity] = await db
      .select({ lastContactAt: opportunities.lastContactAt })
      .from(opportunities)
      .where(eq(opportunities.id, opportunity.id));

    assert.equal(recentInteractions[0]?.id, interaction.id);
    assert.equal(history[0]?.id, interaction.id);
    assert.equal(recentInteractions[0]?.userName, "Interaction manager");
    assert.equal(recentInteractions[0]?.result, "REQUESTED_CALLBACK");
    assert.equal(otherClinicInteractions.length, 0);
    assert.ok(updatedOpportunity?.lastContactAt);

    const untouchedFollowUp = await createFollowUp(tenant, {
      opportunityId: opportunity.id,
      scheduledAt: new Date("2040-09-10T15:00:00Z"),
      reason: "Retorno solicitado",
    });
    await assert.rejects(createInteraction(otherTenant, {
      opportunityId: opportunity.id, channel: "PHONE", result: "CLOSED",
    }), InteractionOpportunityNotFoundError);

    for (const [result, status] of [
      ["CLOSED", "RECOVERED"],
      ["DECLINED", "LOST"],
      ["DO_NOT_CONTACT", "DO_NOT_CONTACT"],
    ] as const) {
      const terminalOpportunity = await createOpportunity(tenant, {
        patientId: patient.id,
        treatment: `Tratamento de teste ${result}`,
        budgetDate: new Date("2026-09-02T00:00:00Z"),
        budgetValue: 1_200,
        finalBudgetValue: result === "CLOSED" ? 1_000 : undefined,
      });
      for (const day of [10, 11]) {
        await createFollowUp(tenant, {
          opportunityId: terminalOpportunity.id,
          scheduledAt: new Date(`2040-09-${day}T15:00:00Z`),
          reason: "Retorno pendente",
        });
      }
      const completedAt = new Date("2026-09-01T15:00:00Z");
      await db.insert(followUps).values({
        clinicId, opportunityId: terminalOpportunity.id, assignedUserId: managerId,
        scheduledAt: completedAt, reason: "Retorno realizado", status: "COMPLETED", completedAt,
      });

      await createInteraction(tenant, {
        opportunityId: terminalOpportunity.id, channel: "PHONE", result,
      });
      // Um registro posterior sem decisão de encerramento não deve reabrir a oportunidade.
      await createInteraction(tenant, {
        opportunityId: terminalOpportunity.id, channel: "OTHER", result: "NO_RESPONSE",
      });
      const [stored] = await db.select().from(opportunities).where(eq(opportunities.id, terminalOpportunity.id));
      const followUpRows = await db.select().from(followUps).where(eq(followUps.opportunityId, terminalOpportunity.id));
      assert.equal(stored.status, status);
      assert.equal(stored.nextFollowUpAt, null);
      assert.equal(followUpRows.filter(row => row.status === "CANCELED").length, 2);
      assert.equal(followUpRows.filter(row => row.status === "PENDING").length, 0);
      assert.equal(followUpRows.find(row => row.status === "COMPLETED")?.completedAt?.toISOString(), completedAt.toISOString());
    }
    const [untouched] = await db.select().from(followUps).where(eq(followUps.id, untouchedFollowUp.id));
    assert.equal(untouched.status, "PENDING");
    const kpis = await getDashboardKpis(tenant);
    assert.equal(kpis.openCount, 1);
    assert.equal(kpis.recoveredCount, 1);
    assert.equal(Number(kpis.recoveredValue), 1_000);

    console.log("Contatos, resultados finais, cancelamento de pendências, indicadores e isolamento validados.");
  } finally {
    await db.delete(followUps).where(eq(followUps.clinicId, clinicId));
    await db.delete(interactions).where(eq(interactions.clinicId, clinicId));
    await db.delete(opportunities).where(eq(opportunities.clinicId, clinicId));
    await db.delete(patients).where(eq(patients.clinicId, clinicId));
    await db.delete(users).where(inArray(users.id, [managerId, otherManagerId]));
    await db.delete(clinics).where(inArray(clinics.id, [clinicId, otherClinicId]));
  }
}

void checkInteractions();
