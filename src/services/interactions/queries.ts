import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { interactions, users } from "@/db/schema";

const recentInteractionsLimit = 5;
const interactionHistoryLimit = 100;

export async function getRecentOpportunityInteractions(
  tenant: TenantContext,
  opportunityId: string,
) {
  assertPermission(tenant, "opportunities.read");

  return db
    .select({
      id: interactions.id,
      channel: interactions.channel,
      result: interactions.result,
      notes: interactions.notes,
      createdAt: interactions.createdAt,
      userName: users.name,
    })
    .from(interactions)
    .innerJoin(users, eq(interactions.userId, users.id))
    .where(
      and(
        eq(interactions.clinicId, tenant.clinicId),
        eq(interactions.opportunityId, opportunityId),
      ),
    )
    .orderBy(desc(interactions.createdAt))
    .limit(recentInteractionsLimit);
}

export async function getOpportunityInteractionHistory(
  tenant: TenantContext,
  opportunityId: string,
) {
  assertPermission(tenant, "opportunities.read");

  return db
    .select({
      id: interactions.id,
      channel: interactions.channel,
      result: interactions.result,
      notes: interactions.notes,
      createdAt: interactions.createdAt,
      userName: users.name,
    })
    .from(interactions)
    .innerJoin(users, eq(interactions.userId, users.id))
    .where(
      and(
        eq(interactions.clinicId, tenant.clinicId),
        eq(interactions.opportunityId, opportunityId),
      ),
    )
    .orderBy(desc(interactions.createdAt))
    .limit(interactionHistoryLimit);
}
