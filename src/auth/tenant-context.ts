import "server-only";

import { z } from "zod";

import type { AuthSession } from "./index";
import { appRoleSchema } from "./roles";

const tenantContextSchema = z.object({
  userId: z.uuid(),
  clinicId: z.uuid(),
  role: appRoleSchema,
});

export type TenantContext = Readonly<z.infer<typeof tenantContextSchema>>;

export class InvalidTenantSessionError extends Error {
  constructor() {
    super("A sessão autenticada não possui um tenant válido.");
    this.name = "InvalidTenantSessionError";
  }
}

export function parseTenantContext(input: unknown): TenantContext {
  const result = tenantContextSchema.safeParse(input);

  if (!result.success) {
    throw new InvalidTenantSessionError();
  }

  return Object.freeze(result.data);
}

export function getTenantContextFromSession(
  session: AuthSession,
): TenantContext {
  return parseTenantContext({
    userId: session.user.id,
    clinicId: session.user.clinicId,
    role: session.user.role,
  });
}
