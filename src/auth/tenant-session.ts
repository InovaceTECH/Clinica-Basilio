import "server-only";

import { requireSession } from "./session";
import { getTenantContextFromSession } from "./tenant-context";

export async function requireTenantSession() {
  const session = await requireSession();

  return {
    session,
    tenant: getTenantContextFromSession(session),
  } as const;
}

export async function requireTenantContext() {
  return (await requireTenantSession()).tenant;
}

export async function requireClinicId() {
  return (await requireTenantContext()).clinicId;
}
