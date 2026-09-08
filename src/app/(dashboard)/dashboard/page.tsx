import { redirect } from "next/navigation";

import { getAuthenticatedHomePath, hasPermission } from "@/auth/authorization";
import { requireTenantContext } from "@/auth/tenant-session";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getDashboardBreakdown, getDashboardKpis } from "@/services/dashboard/queries";

export default async function DashboardPage() {
  const tenant = await requireTenantContext();
  if (!hasPermission(tenant, "dashboard.read")) {
    redirect(getAuthenticatedHomePath(tenant));
  }
  const [kpis, breakdown] = await Promise.all([getDashboardKpis(tenant), getDashboardBreakdown(tenant)]);
  return <DashboardOverview kpis={kpis} breakdown={breakdown} />;
}
