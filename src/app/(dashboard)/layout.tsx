import { requireTenantSession } from "@/auth/tenant-session";
import { roleLabels } from "@/auth/roles";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session, tenant } = await requireTenantSession();

  return (
    <AppShell userName={session.user.name} userRole={roleLabels[tenant.role]}>
      {children}
    </AppShell>
  );
}
