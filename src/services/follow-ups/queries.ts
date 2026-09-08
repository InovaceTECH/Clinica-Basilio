import "server-only";
import { and, asc, eq, gte, lt } from "drizzle-orm";
import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { followUps, opportunities, patients, users } from "@/db/schema";
export type FollowUpFilters = { assignedUserId?: string; date?: Date; status?: "PENDING" | "COMPLETED" | "CANCELED" };
export async function getPendingFollowUps(tenant: TenantContext, opportunityId?: string) { return getFollowUps(tenant, { status: "PENDING" }, opportunityId); }
export async function getFollowUps(tenant: TenantContext, filters: FollowUpFilters = {}, opportunityId?: string) { assertPermission(tenant, "opportunities.read"); const conditions = [eq(followUps.clinicId, tenant.clinicId)]; if (filters.status) conditions.push(eq(followUps.status, filters.status)); if (filters.assignedUserId) conditions.push(eq(followUps.assignedUserId, filters.assignedUserId)); if (filters.date) { const end = new Date(filters.date); end.setDate(end.getDate() + 1); conditions.push(gte(followUps.scheduledAt, filters.date), lt(followUps.scheduledAt, end)); } if (opportunityId) conditions.push(eq(followUps.opportunityId, opportunityId)); return db.select({ id: followUps.id, opportunityId: followUps.opportunityId, scheduledAt: followUps.scheduledAt, reason: followUps.reason, notes: followUps.notes, status: followUps.status, patientName: patients.name, assignedUserName: users.name }).from(followUps).innerJoin(opportunities, eq(followUps.opportunityId, opportunities.id)).innerJoin(patients, eq(opportunities.patientId, patients.id)).innerJoin(users, eq(followUps.assignedUserId, users.id)).where(and(...conditions)).orderBy(asc(followUps.scheduledAt)); }
export async function getClinicUsers(tenant: TenantContext) { return db.select({ id: users.id, name: users.name }).from(users).where(eq(users.clinicId, tenant.clinicId)).orderBy(asc(users.name)); }
