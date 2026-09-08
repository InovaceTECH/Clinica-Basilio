import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";

import { parseTenantContext } from "../src/auth/tenant-context";
import { db } from "../src/db";
import { clinics, followUps, opportunities, patients, users } from "../src/db/schema";
import {
  closeFollowUp,
  createFollowUp,
  FollowUpNotFoundError,
  updateFollowUp,
} from "../src/services/follow-ups/commands";
import { getFollowUps, getPendingFollowUps } from "../src/services/follow-ups/queries";
import { createOpportunity } from "../src/services/opportunities/commands";
import { createPatient } from "../src/services/patients/commands";
import { createFollowUpSchema, followUpFiltersSchema, updateFollowUpSchema } from "../src/schemas/follow-up";

async function checkFollowUps() {
  const clinicAId = randomUUID();
  const clinicBId = randomUUID();
  const managerAId = randomUUID();
  const managerBId = randomUUID();

  for (const status of ["PENDING", "COMPLETED", "CANCELED"] as const) {
    const filters = followUpFiltersSchema.parse({ assignedUserId: "", date: "", status });
    assert.equal(filters.assignedUserId, undefined);
    assert.equal(filters.date, undefined);
    assert.equal(filters.status, status);
  }
  assert.equal(followUpFiltersSchema.parse({ assignedUserId: managerAId, date: "2026-09-12" }).date, "2026-09-12");
  assert.equal(followUpFiltersSchema.safeParse({ assignedUserId: "inválido" }).success, false);
  assert.equal(followUpFiltersSchema.safeParse({ date: "2026-02-30" }).success, false);
  for (const scheduledAt of ["2026-09-12T10:00:00-03:00", "2026-09-12T13:00:00Z"]) {
    assert.equal(updateFollowUpSchema.parse({ scheduledAt, reason: "Retorno" }).scheduledAt.toISOString(), "2026-09-12T13:00:00.000Z");
  }
  assert.equal(createFollowUpSchema.safeParse({ opportunityId: randomUUID(), scheduledAt: "2026-09-12T10:00", reason: "Retorno" }).success, false);
  assert.equal(updateFollowUpSchema.safeParse({ scheduledAt: "2026-09-12T10:00", reason: "Retorno" }).success, false);

  try {
    await db.insert(clinics).values([
      { id: clinicAId, name: "Follow-up check A" },
      { id: clinicBId, name: "Follow-up check B" },
    ]);
    await db.insert(users).values([
      { id: managerAId, clinicId: clinicAId, name: "Manager A", email: `follow-up-a-${randomUUID()}@example.invalid`, role: "MANAGER" },
      { id: managerBId, clinicId: clinicBId, name: "Manager B", email: `follow-up-b-${randomUUID()}@example.invalid`, role: "MANAGER" },
    ]);
    const tenantA = parseTenantContext({ userId: managerAId, clinicId: clinicAId, role: "MANAGER" });
    const tenantB = parseTenantContext({ userId: managerBId, clinicId: clinicBId, role: "MANAGER" });
    const patient = await createPatient(tenantA, { name: "Paciente follow-up", phone: "11999999999" });
    const opportunity = await createOpportunity(tenantA, {
      patientId: patient.id,
      treatment: "Avaliação comercial",
      budgetDate: new Date("2026-09-01T00:00:00.000Z"),
      budgetValue: 1_200,
    });

    const first = await createFollowUp(tenantA, {
      opportunityId: opportunity.id,
      scheduledAt: "2026-09-11T07:00:00-03:00",
      reason: "Retornar após avaliação da proposta.",
    });
    assert.equal(first.scheduledAt.toISOString(), "2026-09-11T10:00:00.000Z");
    const updated = await updateFollowUp(tenantA, first.id, {
      scheduledAt: new Date("2026-09-12T10:00:00.000Z"),
      reason: "Retorno reagendado.",
    });
    const second = await createFollowUp(tenantA, {
      opportunityId: opportunity.id,
      scheduledAt: new Date("2026-09-13T10:00:00.000Z"),
      reason: "Confirmar decisão.",
    });
    const boundary = await createFollowUp(tenantA, {
      opportunityId: opportunity.id,
      scheduledAt: new Date("2026-09-13T00:00:00.000Z"),
      reason: "Retorno à meia-noite para teste.",
    });
    const pendingForDay = await getFollowUps(tenantA, {
      date: new Date("2026-09-12T00:00:00.000Z"),
      status: "PENDING",
    });
    const pending = await getPendingFollowUps(tenantA, opportunity.id);
    const [afterCreate] = await db.select({ nextFollowUpAt: opportunities.nextFollowUpAt, status: opportunities.status }).from(opportunities).where(eq(opportunities.id, opportunity.id));

    assert.equal(updated.id, first.id);
    assert.deepEqual(pendingForDay.map((item) => item.id), [first.id]);
    assert.equal(pending.length, 3);
    assert.equal(afterCreate?.status, "FOLLOW_UP_SCHEDULED");
    assert.equal(afterCreate?.nextFollowUpAt?.toISOString(), "2026-09-13T00:00:00.000Z");
    await assert.rejects(
      createFollowUp(tenantB, { opportunityId: opportunity.id, scheduledAt: new Date("2026-09-14T10:00:00.000Z"), reason: "Acesso externo." }),
      FollowUpNotFoundError,
    );

    await closeFollowUp(tenantA, first.id, "COMPLETED");
    await closeFollowUp(tenantA, boundary.id, "CANCELED");
    await closeFollowUp(tenantA, second.id, "COMPLETED");
    const [afterClosing] = await db.select({ nextFollowUpAt: opportunities.nextFollowUpAt, status: opportunities.status }).from(opportunities).where(eq(opportunities.id, opportunity.id));

    assert.equal(afterClosing?.nextFollowUpAt, null);
    assert.equal(afterClosing?.status, "CONTACTED");
    console.log("Criação, atualização, conclusão, filtros por data e isolamento de follow-ups validados.");
  } finally {
    await db.delete(followUps).where(inArray(followUps.clinicId, [clinicAId, clinicBId]));
    await db.delete(opportunities).where(inArray(opportunities.clinicId, [clinicAId, clinicBId]));
    await db.delete(patients).where(inArray(patients.clinicId, [clinicAId, clinicBId]));
    await db.delete(users).where(inArray(users.id, [managerAId, managerBId]));
    await db.delete(clinics).where(inArray(clinics.id, [clinicAId, clinicBId]));
  }
}

void checkFollowUps();
