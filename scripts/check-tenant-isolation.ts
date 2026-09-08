import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { inArray } from "drizzle-orm";

import {
  assertPermission,
  AuthorizationError,
  hasPermission,
} from "../src/auth/authorization";
import {
  InvalidTenantSessionError,
  parseTenantContext,
} from "../src/auth/tenant-context";
import { db } from "../src/db";
import { clinics, users } from "../src/db/schema";
import {
  getTenantUserById,
  listTenantUsers,
} from "../src/services/users/queries";

async function checkTenantIsolation() {
  const clinicAId = randomUUID();
  const clinicBId = randomUUID();
  const userAId = randomUUID();
  const userBId = randomUUID();

  try {
    await db.insert(clinics).values([
      { id: clinicAId, name: "Tenant check A" },
      { id: clinicBId, name: "Tenant check B" },
    ]);
    await db.insert(users).values([
      {
        id: userAId,
        clinicId: clinicAId,
        name: "Manager A",
        email: `tenant-a-${randomUUID()}@example.invalid`,
        role: "MANAGER",
      },
      {
        id: userBId,
        clinicId: clinicBId,
        name: "Manager B",
        email: `tenant-b-${randomUUID()}@example.invalid`,
        role: "MANAGER",
      },
    ]);

    const tenantA = parseTenantContext({
      userId: userAId,
      clinicId: clinicAId,
      role: "MANAGER",
    });
    const receptionistA = parseTenantContext({
      userId: userAId,
      clinicId: clinicAId,
      role: "RECEPTIONIST",
    });

    const ownUser = await getTenantUserById(tenantA, userAId);
    const foreignUser = await getTenantUserById(tenantA, userBId);
    const tenantUsers = await listTenantUsers(tenantA);

    assert.equal(ownUser?.id, userAId);
    assert.equal(foreignUser, null);
    assert.deepEqual(
      tenantUsers.map((user) => user.id),
      [userAId],
    );
    assert.equal(hasPermission(receptionistA, "users.manage"), false);
    assert.throws(
      () => assertPermission(receptionistA, "users.manage"),
      AuthorizationError,
    );
    assert.throws(
      () =>
        parseTenantContext({
          userId: userAId,
          clinicId: "clinic-id-enviado-pelo-frontend",
          role: "MANAGER",
        }),
      InvalidTenantSessionError,
    );

    console.log(
      "Isolamento entre clínicas e autorização por role validados.",
    );
  } finally {
    await db.delete(users).where(inArray(users.id, [userAId, userBId]));
    await db
      .delete(clinics)
      .where(inArray(clinics.id, [clinicAId, clinicBId]));
  }
}

void checkTenantIsolation();
