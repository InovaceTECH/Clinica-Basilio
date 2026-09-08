import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { aiAnalyses } from "@/db/schema";

const opportunityAnalysisHistoryLimit = 100;

export async function getLatestOpportunityAnalysis(
  tenant: TenantContext,
  opportunityId: string,
) {
  assertPermission(tenant, "opportunities.read");

  const [analysis] = await db
    .select()
    .from(aiAnalyses)
    .where(and(eq(aiAnalyses.clinicId, tenant.clinicId), eq(aiAnalyses.opportunityId, opportunityId)))
    .orderBy(desc(aiAnalyses.createdAt))
    .limit(1);

  return analysis ?? null;
}

export async function getOpportunityAnalysisHistory(
  tenant: TenantContext,
  opportunityId: string,
) {
  assertPermission(tenant, "opportunities.read");

  return db
    .select()
    .from(aiAnalyses)
    .where(
      and(
        eq(aiAnalyses.clinicId, tenant.clinicId),
        eq(aiAnalyses.opportunityId, opportunityId),
      ),
    )
    .orderBy(desc(aiAnalyses.createdAt))
    .limit(opportunityAnalysisHistoryLimit);
}
