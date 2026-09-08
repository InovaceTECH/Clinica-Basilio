import { cookies } from "next/headers";

import { hasPermission } from "@/auth/authorization";
import { roleLabels } from "@/auth/roles";
import { requireTenantSession } from "@/auth/tenant-session";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [{ session, tenant }, cookieStore] = await Promise.all([
    requireTenantSession(),
    cookies(),
  ]);

  // A barra lateral guarda seu estado em cookie; ler no servidor evita que ela
  // apareça aberta e feche logo depois da hidratação.
  const defaultSidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <AppShell
      canManageSettings={hasPermission(tenant, "administration.read")}
      canViewDashboard={hasPermission(tenant, "dashboard.read")}
      defaultSidebarOpen={defaultSidebarOpen}
      userName={session.user.name}
      userRole={roleLabels[tenant.role]}
    >
      {children}
    </AppShell>
  );
}
