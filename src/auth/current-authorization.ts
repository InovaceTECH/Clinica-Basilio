import "server-only";

import { assertPermission, type Permission } from "./authorization";
import { requireTenantContext } from "./tenant-session";

export async function requirePermission(permission: Permission) {
  const tenant = await requireTenantContext();
  assertPermission(tenant, permission);
  return tenant;
}
