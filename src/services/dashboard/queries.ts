import "server-only";
import { count, eq, sql } from "drizzle-orm";
import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { opportunities } from "@/db/schema";

export async function getDashboardKpis(tenant: TenantContext) {
  assertPermission(tenant, "dashboard.read");
  const [row] = await db.select({
    total: count(),
    openCount: sql<number>`count(*) filter (where ${opportunities.status} not in ('RECOVERED', 'LOST', 'DO_NOT_CONTACT'))`,
    potentialValue: sql<string>`coalesce(sum(${opportunities.budgetValue}) filter (where ${opportunities.status} not in ('RECOVERED', 'LOST', 'DO_NOT_CONTACT')), 0)`,
    recoveredCount: sql<number>`count(*) filter (where ${opportunities.status} = 'RECOVERED')`,
    recoveredValue: sql<string>`coalesce(sum(coalesce(${opportunities.finalBudgetValue}, ${opportunities.budgetValue})) filter (where ${opportunities.status} = 'RECOVERED'), 0)`,
  }).from(opportunities).where(eq(opportunities.clinicId, tenant.clinicId));
  const total = row?.total ?? 0; const recoveredCount = Number(row?.recoveredCount ?? 0);
  return { openCount: Number(row?.openCount ?? 0), potentialValue: row?.potentialValue ?? "0", recoveredCount, recoveredValue: row?.recoveredValue ?? "0", recoveryRate: total ? recoveredCount / total : 0 };
}

export async function getDashboardBreakdown(tenant: TenantContext) {
  assertPermission(tenant, "dashboard.read");
  const [objections, funnel] = await Promise.all([
    db.select({ category: opportunities.objectionCategory, count: count(), value: sql<string>`coalesce(sum(${opportunities.budgetValue}), 0)` }).from(opportunities).where(eq(opportunities.clinicId, tenant.clinicId)).groupBy(opportunities.objectionCategory).orderBy(sql`count(*) desc`),
    db.select({
      open: sql<number>`count(*) filter (where ${opportunities.status} not in ('RECOVERED', 'LOST', 'DO_NOT_CONTACT'))`,
      worked: sql<number>`count(*) filter (where ${opportunities.lastContactAt} is not null)`,
      negotiating: sql<number>`count(*) filter (where ${opportunities.status} in ('NEGOTIATING', 'RECOVERED'))`,
      recovered: sql<number>`count(*) filter (where ${opportunities.status} = 'RECOVERED')`,
      responded: sql<number>`count(*) filter (where exists (select 1 from interactions where interactions.opportunity_id = ${opportunities.id} and interactions.clinic_id = ${tenant.clinicId} and interactions.result <> 'NO_RESPONSE'))`,
    }).from(opportunities).where(eq(opportunities.clinicId, tenant.clinicId)),
  ]);
  return { objections, funnel: { open: Number(funnel[0]?.open ?? 0), worked: Number(funnel[0]?.worked ?? 0), responded: Number(funnel[0]?.responded ?? 0), negotiating: Number(funnel[0]?.negotiating ?? 0), recovered: Number(funnel[0]?.recovered ?? 0) } };
}
