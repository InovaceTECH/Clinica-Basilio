import "server-only";

import type { AppRole } from "./roles";
import type { TenantContext } from "./tenant-context";

export const permissions = [
  "opportunities.read",
  "opportunities.analyze",
  "interactions.create",
  "followUps.create",
  "imports.create",
  "playbooks.read",
  "dashboard.read",
  "commercialRules.manage",
  "playbooks.manage",
  "users.manage",
  "administration.read",
] as const;

export type Permission = (typeof permissions)[number];

const receptionistPermissions: readonly Permission[] = [
  "opportunities.read",
  "opportunities.analyze",
  "interactions.create",
  "followUps.create",
  "imports.create",
  "playbooks.read",
];

const rolePermissions: Record<AppRole, ReadonlySet<Permission>> = {
  RECEPTIONIST: new Set(receptionistPermissions),
  MANAGER: new Set([
    ...receptionistPermissions,
    "dashboard.read",
    "commercialRules.manage",
    "playbooks.manage",
    "users.manage",
    "administration.read",
  ]),
};

export class AuthorizationError extends Error {
  constructor() {
    super("O usuário não possui permissão para esta operação.");
    this.name = "AuthorizationError";
  }
}

export function hasPermission(
  tenant: TenantContext,
  permission: Permission,
) {
  return rolePermissions[tenant.role].has(permission);
}

export function assertPermission(
  tenant: TenantContext,
  permission: Permission,
) {
  if (!hasPermission(tenant, permission)) {
    throw new AuthorizationError();
  }
}

export function getAuthenticatedHomePath(tenant: TenantContext) {
  return hasPermission(tenant, "dashboard.read") ? "/dashboard" : "/oportunidades";
}
