import "server-only";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { opportunities } from "@/db/schema";
import { getTenantOpportunityById } from "@/services/opportunities/queries";

import { calculatePriority } from "./calculate-priority";

export async function recalculateOpportunityPriority(
  tenant: TenantContext,
  opportunityId: string,
  now = new Date(),
) {
  assertPermission(tenant, "opportunities.read");
  const parsedOpportunityId = z.uuid().safeParse(opportunityId);

  if (!parsedOpportunityId.success) return null;

  const opportunity = await getTenantOpportunityById(tenant, parsedOpportunityId.data);

  if (!opportunity) return null;

  const priority = calculatePriority({
    budgetDate: opportunity.budgetDate,
    budgetValue: Number(opportunity.budgetValue),
    nextFollowUpAt: opportunity.nextFollowUpAt ?? undefined,
    objectionCategory: opportunity.objectionCategory ?? undefined,
  }, now);

  const [updatedOpportunity] = await db
    .update(opportunities)
    .set({
      priority: priority.priority,
      priorityScore: priority.score,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(opportunities.id, parsedOpportunityId.data),
        eq(opportunities.clinicId, tenant.clinicId),
      ),
    )
    .returning({ priority: opportunities.priority, priorityScore: opportunities.priorityScore });

  return updatedOpportunity ?? null;
}
