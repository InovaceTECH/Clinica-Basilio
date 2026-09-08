import "server-only";

import { and, eq } from "drizzle-orm";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { opportunities, patients, users } from "@/db/schema";
import {
  createOpportunitySchema,
  type CreateOpportunityInput,
} from "@/schemas/opportunity";
import { calculatePriority } from "@/services/priority/calculate-priority";

export class OpportunityPatientNotFoundError extends Error {
  constructor() {
    super("O paciente informado não pertence à clínica atual.");
    this.name = "OpportunityPatientNotFoundError";
  }
}

export class OpportunityResponsibleUserNotFoundError extends Error {
  constructor() {
    super("O usuário responsável informado não pertence à clínica atual.");
    this.name = "OpportunityResponsibleUserNotFoundError";
  }
}

export async function createOpportunity(
  tenant: TenantContext,
  input: CreateOpportunityInput,
) {
  assertPermission(tenant, "opportunities.read");

  const opportunity = createOpportunitySchema.parse(input);
  const priority = calculatePriority({
    budgetDate: opportunity.budgetDate,
    budgetValue: opportunity.budgetValue,
    nextFollowUpAt: opportunity.nextFollowUpAt,
    objectionCategory: opportunity.objectionCategory,
  });
  const [patient] = await db
    .select({ id: patients.id })
    .from(patients)
    .where(
      and(
        eq(patients.id, opportunity.patientId),
        eq(patients.clinicId, tenant.clinicId),
      ),
    )
    .limit(1);

  if (!patient) {
    throw new OpportunityPatientNotFoundError();
  }

  if (opportunity.responsibleUserId) {
    const [responsibleUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.id, opportunity.responsibleUserId),
          eq(users.clinicId, tenant.clinicId),
        ),
      )
      .limit(1);

    if (!responsibleUser) {
      throw new OpportunityResponsibleUserNotFoundError();
    }
  }

  const [createdOpportunity] = await db
    .insert(opportunities)
    .values({
      clinicId: tenant.clinicId,
      patientId: opportunity.patientId,
      treatment: opportunity.treatment,
      budgetValue: opportunity.budgetValue.toFixed(2),
      finalBudgetValue: opportunity.finalBudgetValue?.toFixed(2) ?? null,
      budgetDate: opportunity.budgetDate,
      professionalName: opportunity.professionalName ?? null,
      leadSource: opportunity.leadSource ?? null,
      rawObjection: opportunity.rawObjection ?? null,
      notes: opportunity.notes ?? null,
      objectionCategory: opportunity.objectionCategory ?? null,
      priorityScore: priority.score,
      priority: priority.priority,
      status: opportunity.status,
      lastContactAt: opportunity.lastContactAt ?? null,
      nextFollowUpAt: opportunity.nextFollowUpAt ?? null,
      responsibleUserId: opportunity.responsibleUserId ?? null,
    })
    .returning();

  return createdOpportunity;
}
