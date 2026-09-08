import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { and, eq, inArray } from "drizzle-orm";

import { parseTenantContext } from "../src/auth/tenant-context";
import { db } from "../src/db";
import { clinics, opportunities, patients, users } from "../src/db/schema";
import { createOpportunity } from "../src/services/opportunities/commands";
import {
  getTenantOpportunities,
  getTenantOpportunityById,
} from "../src/services/opportunities/queries";
import { createPatient } from "../src/services/patients/commands";
import { recalculateOpportunityPriority } from "../src/services/priority/recalculate-priority";

async function checkOpportunities() {
  const clinicAId = randomUUID();
  const clinicBId = randomUUID();
  const managerAId = randomUUID();
  const managerBId = randomUUID();

  try {
    await db.insert(clinics).values([
      { id: clinicAId, name: "Opportunity check A" },
      { id: clinicBId, name: "Opportunity check B" },
    ]);
    await db.insert(users).values([
      {
        id: managerAId,
        clinicId: clinicAId,
        name: "Manager A",
        email: `opportunities-a-${randomUUID()}@example.invalid`,
        role: "MANAGER",
      },
      {
        id: managerBId,
        clinicId: clinicBId,
        name: "Manager B",
        email: `opportunities-b-${randomUUID()}@example.invalid`,
        role: "MANAGER",
      },
    ]);

    const tenantA = parseTenantContext({
      userId: managerAId,
      clinicId: clinicAId,
      role: "MANAGER",
    });
    const tenantB = parseTenantContext({
      userId: managerBId,
      clinicId: clinicBId,
      role: "MANAGER",
    });

    const patientA = await createPatient(tenantA, {
      name: "Paciente de teste",
      phone: "11999999999",
      externalReference: `crm-${randomUUID()}`,
    });
    const opportunityA = await createOpportunity(tenantA, {
      patientId: patientA.id,
      treatment: "Avaliação comercial",
      budgetValue: 1200,
      finalBudgetValue: 1100,
      budgetDate: new Date("2026-08-20T00:00:00.000Z"),
      professionalName: "Profissional de teste",
      leadSource: "Indicação",
      status: "FOLLOW_UP_SCHEDULED",
      nextFollowUpAt: new Date("2026-08-30T12:00:00.000Z"),
      responsibleUserId: managerAId,
    });
    const patientB = await createPatient(tenantA, {
      name: "Paciente para filtro",
      phone: "11888888888",
      externalReference: `crm-${randomUUID()}`,
    });
    await createOpportunity(tenantA, {
      patientId: patientB.id,
      treatment: "Implante unitário",
      budgetValue: 5400,
      budgetDate: new Date("2026-08-21T00:00:00.000Z"),
      objectionCategory: "FINANCIAL",
      nextFollowUpAt: new Date("2020-01-01T00:00:00.000Z"),
      priority: "HIGH",
      priorityScore: 90,
      status: "CONTACT_PENDING",
    });

    const ownOpportunity = await getTenantOpportunityById(tenantA, opportunityA.id);
    const foreignOpportunity = await getTenantOpportunityById(
      tenantB,
      opportunityA.id,
    );
    const filteredList = await getTenantOpportunities(tenantA, {
      page: 1,
      priority: "HIGH",
      query: "Implante",
    });
    const foreignList = await getTenantOpportunities(tenantB, {
      page: 1,
      query: "",
    });
    const outOfRangePage = await getTenantOpportunities(tenantA, {
      page: 999,
      query: "",
    });
    const recalculatedPriority = await recalculateOpportunityPriority(
      tenantA,
      opportunityA.id,
      new Date("2026-09-01T12:00:00.000Z"),
    );
    const foreignRecalculation = await recalculateOpportunityPriority(
      tenantB,
      opportunityA.id,
      new Date("2026-09-01T12:00:00.000Z"),
    );
    const [storedOpportunity] = await db
      .select({ clinicId: opportunities.clinicId })
      .from(opportunities)
      .where(
        and(
          eq(opportunities.id, opportunityA.id),
          eq(opportunities.clinicId, clinicAId),
        ),
      );

    assert.equal(ownOpportunity?.id, opportunityA.id);
    assert.equal(ownOpportunity?.budgetValue, "1200.00");
    assert.equal(ownOpportunity?.status, "FOLLOW_UP_SCHEDULED");
    assert.equal(ownOpportunity?.patientName, "Paciente de teste");
    assert.equal(ownOpportunity?.patientPhone, "11999999999");
    assert.equal(foreignOpportunity, null);
    assert.equal(filteredList.total, 1);
    assert.equal(filteredList.items[0]?.patientName, "Paciente para filtro");
    assert.equal(filteredList.items[0]?.priority, "HIGH");
    assert.equal(foreignList.total, 0);
    assert.equal(outOfRangePage.page, 1);
    assert.equal(outOfRangePage.items.length, 2);
    assert.deepEqual(recalculatedPriority, { priority: "MEDIUM", priorityScore: 51 });
    assert.equal(foreignRecalculation, null);
    assert.equal(storedOpportunity?.clinicId, clinicAId);

    console.log(
      "Criação, filtros, paginação e isolamento de oportunidades validados.",
    );
  } finally {
    await db.delete(opportunities).where(
      inArray(
        opportunities.clinicId,
        [clinicAId, clinicBId],
      ),
    );
    await db
      .delete(patients)
      .where(inArray(patients.clinicId, [clinicAId, clinicBId]));
    await db.delete(users).where(inArray(users.id, [managerAId, managerBId]));
    await db
      .delete(clinics)
      .where(inArray(clinics.id, [clinicAId, clinicBId]));
  }
}

void checkOpportunities();
