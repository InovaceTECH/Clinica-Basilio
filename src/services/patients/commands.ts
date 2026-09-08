import "server-only";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { patients } from "@/db/schema";
import {
  createPatientSchema,
  type CreatePatientInput,
} from "@/schemas/patient";

export async function createPatient(
  tenant: TenantContext,
  input: CreatePatientInput,
) {
  assertPermission(tenant, "opportunities.read");

  const patient = createPatientSchema.parse(input);
  const [createdPatient] = await db
    .insert(patients)
    .values({
      clinicId: tenant.clinicId,
      name: patient.name,
      phone: patient.phone ?? null,
      externalReference: patient.externalReference ?? null,
    })
    .returning();

  return createdPatient;
}
