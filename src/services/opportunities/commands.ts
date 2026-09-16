import "server-only";

import { and, eq } from "drizzle-orm";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db, executeBatch } from "@/db";
import { opportunities, patients, users } from "@/db/schema";
import {
  createOpportunitySchema,
  type CreateOpportunityInput,
  updateOpportunitySchema,
  type UpdateOpportunityInput,
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

export class OpportunityNotFoundError extends Error {
  constructor() {
    super("A oportunidade não pertence à clínica atual.");
    this.name = "OpportunityNotFoundError";
  }
}

export class OpportunityPatientPhoneConflictError extends Error {
  constructor() {
    super("Este telefone já pertence a outro paciente da clínica.");
    this.name = "OpportunityPatientPhoneConflictError";
  }
}

export class OpportunityInvalidPhoneError extends Error {
  constructor() {
    super("Informe um telefone brasileiro válido ou deixe o campo em branco.");
    this.name = "OpportunityInvalidPhoneError";
  }
}

function normalizePhone(value: string | undefined) {
  const digits = value?.replace(/\D/g, "") ?? "";

  if (!digits) return null;
  if (/^\d{10,11}$/.test(digits)) return `+55${digits}`;
  if (/^55\d{10,11}$/.test(digits)) return `+${digits}`;

  throw new OpportunityInvalidPhoneError();
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

export async function updateOpportunity(
  tenant: TenantContext,
  opportunityId: string,
  input: UpdateOpportunityInput,
) {
  assertPermission(tenant, "opportunities.update");

  const update = updateOpportunitySchema.parse(input);
  const [existingOpportunity] = await db
    .select({
      patientId: opportunities.patientId,
      nextFollowUpAt: opportunities.nextFollowUpAt,
    })
    .from(opportunities)
    .where(
      and(
        eq(opportunities.id, opportunityId),
        eq(opportunities.clinicId, tenant.clinicId),
      ),
    )
    .limit(1);

  if (!existingOpportunity) throw new OpportunityNotFoundError();

  const phone = normalizePhone(update.patientPhone);

  if (phone) {
    const patientsWithPhone = await db
      .select({ id: patients.id })
      .from(patients)
      .where(and(eq(patients.clinicId, tenant.clinicId), eq(patients.phone, phone)))
      .limit(2);

    if (patientsWithPhone.some(patient => patient.id !== existingOpportunity.patientId)) {
      throw new OpportunityPatientPhoneConflictError();
    }
  }

  const priority = calculatePriority({
    budgetDate: update.budgetDate,
    budgetValue: update.budgetValue,
    nextFollowUpAt: existingOpportunity.nextFollowUpAt ?? undefined,
    objectionCategory: update.objectionCategory,
  });
  const now = new Date();

  await executeBatch(connection => [
    connection
      .update(patients)
      .set({
        name: update.patientName,
        phone,
        updatedAt: now,
      })
      .where(
        and(
          eq(patients.id, existingOpportunity.patientId),
          eq(patients.clinicId, tenant.clinicId),
        ),
      ),
    connection
      .update(opportunities)
      .set({
        treatment: update.treatment,
        budgetValue: update.budgetValue.toFixed(2),
        budgetDate: update.budgetDate,
        professionalName: update.professionalName ?? null,
        leadSource: update.leadSource ?? null,
        rawObjection: update.rawObjection ?? null,
        notes: update.notes ?? null,
        objectionCategory: update.objectionCategory ?? null,
        priorityScore: priority.score,
        priority: priority.priority,
        updatedAt: now,
      })
      .where(
        and(
          eq(opportunities.id, opportunityId),
          eq(opportunities.clinicId, tenant.clinicId),
        ),
      )
      .returning(),
  ] as const);

}
