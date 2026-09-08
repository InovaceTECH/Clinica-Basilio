import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { followUps, opportunities } from "@/db/schema";
import { createFollowUpSchema, type CreateFollowUpInput, updateFollowUpSchema, type UpdateFollowUpInput } from "@/schemas/follow-up";

export class FollowUpNotFoundError extends Error { constructor() { super("O follow-up solicitado não foi encontrado."); } }

async function opportunityFor(tenant: TenantContext, opportunityId: string) {
  const [opportunity] = await db.select({ id: opportunities.id }).from(opportunities).where(and(eq(opportunities.id, opportunityId), eq(opportunities.clinicId, tenant.clinicId))).limit(1);
  if (!opportunity) throw new FollowUpNotFoundError();
  return opportunity;
}
export async function createFollowUp(tenant: TenantContext, input: CreateFollowUpInput) {
  assertPermission(tenant, "followUps.create"); const followUp = createFollowUpSchema.parse(input); const opportunity = await opportunityFor(tenant, followUp.opportunityId); const now = new Date();
  const [created] = await db.batch([
    db.insert(followUps).values({ clinicId: tenant.clinicId, opportunityId: opportunity.id, assignedUserId: tenant.userId, scheduledAt: followUp.scheduledAt, reason: followUp.reason, notes: followUp.notes ?? null, createdAt: now, updatedAt: now }).returning(),
    db.update(opportunities).set({ nextFollowUpAt: followUp.scheduledAt, status: "FOLLOW_UP_SCHEDULED", updatedAt: now }).where(and(eq(opportunities.id, opportunity.id), eq(opportunities.clinicId, tenant.clinicId))),
  ]); return created[0]!;
}
export async function updateFollowUp(tenant: TenantContext, id: string, input: UpdateFollowUpInput) {
  assertPermission(tenant, "followUps.create"); const value = updateFollowUpSchema.parse(input); const now = new Date();
  const [updated] = await db.update(followUps).set({ ...value, notes: value.notes ?? null, updatedAt: now }).where(and(eq(followUps.id, id), eq(followUps.clinicId, tenant.clinicId), eq(followUps.status, "PENDING"))).returning();
  if (!updated) throw new FollowUpNotFoundError();
  await db.update(opportunities).set({ nextFollowUpAt: updated.scheduledAt, updatedAt: now }).where(and(eq(opportunities.id, updated.opportunityId), eq(opportunities.clinicId, tenant.clinicId))); return updated;
}
export async function closeFollowUp(tenant: TenantContext, id: string, status: "COMPLETED" | "CANCELED") {
  assertPermission(tenant, "followUps.create"); const now = new Date(); const [updated] = await db.update(followUps).set({ status, completedAt: status === "COMPLETED" ? now : null, updatedAt: now }).where(and(eq(followUps.id, id), eq(followUps.clinicId, tenant.clinicId), eq(followUps.status, "PENDING"))).returning(); if (!updated) throw new FollowUpNotFoundError();
  const [next] = await db.select({ scheduledAt: followUps.scheduledAt }).from(followUps).where(and(eq(followUps.clinicId, tenant.clinicId), eq(followUps.opportunityId, updated.opportunityId), eq(followUps.status, "PENDING"))).orderBy(asc(followUps.scheduledAt)).limit(1);
  await db.update(opportunities).set({ nextFollowUpAt: next?.scheduledAt ?? null, status: next ? "FOLLOW_UP_SCHEDULED" : "CONTACTED", updatedAt: now }).where(and(eq(opportunities.id, updated.opportunityId), eq(opportunities.clinicId, tenant.clinicId))); return updated;
}
