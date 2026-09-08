import "server-only";

import { and, eq } from "drizzle-orm";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { patients } from "@/db/schema";

const patientSelection = {
  id: patients.id,
  name: patients.name,
  phone: patients.phone,
  externalReference: patients.externalReference,
  createdAt: patients.createdAt,
};

export async function getTenantPatientById(
  tenant: TenantContext,
  patientId: string,
) {
  assertPermission(tenant, "opportunities.read");

  const [patient] = await db
    .select(patientSelection)
    .from(patients)
    .where(and(eq(patients.id, patientId), eq(patients.clinicId, tenant.clinicId)))
    .limit(1);

  return patient ?? null;
}
