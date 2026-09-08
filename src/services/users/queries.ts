import "server-only";

import { and, asc, eq } from "drizzle-orm";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { users } from "@/db/schema";

const tenantUserSelection = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt,
};

export async function getTenantUserById(
  tenant: TenantContext,
  userId: string,
) {
  assertPermission(tenant, "users.manage");

  const [user] = await db
    .select(tenantUserSelection)
    .from(users)
    .where(and(eq(users.id, userId), eq(users.clinicId, tenant.clinicId)))
    .limit(1);

  return user ?? null;
}

export async function listTenantUsers(tenant: TenantContext) {
  assertPermission(tenant, "users.manage");

  return db
    .select(tenantUserSelection)
    .from(users)
    .where(eq(users.clinicId, tenant.clinicId))
    .orderBy(asc(users.name));
}
