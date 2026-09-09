import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";

import { db, executeBatch } from "../src/db";
import { clinics } from "../src/db/schema";

async function checkBatch() {
  const firstId = randomUUID();
  const secondId = randomUUID();
  try {
    const [first, second] = await executeBatch(connection => [
      connection.insert(clinics).values({ id: firstId, name: "Batch test A" }).returning(),
      connection.insert(clinics).values({ id: secondId, name: "Batch test B" }).returning(),
    ] as const);
    assert.equal(first[0]?.id, firstId);
    assert.equal(second[0]?.id, secondId);
    await db.delete(clinics).where(inArray(clinics.id, [firstId, secondId]));

    // A failure in the second statement must roll back the first statement.
    await assert.rejects(executeBatch(connection => [
      connection.insert(clinics).values({ id: firstId, name: "Rollback test" }),
      connection.insert(clinics).values({ id: firstId, name: "Duplicate primary key" }),
    ] as const));
    const remaining = await db.select({ id: clinics.id }).from(clinics).where(eq(clinics.id, firstId));
    assert.equal(remaining.length, 0);
    console.log("Batch: resultados ordenados e rollback integral validados.");
  } finally {
    await db.delete(clinics).where(inArray(clinics.id, [firstId, secondId]));
  }
}

void checkBatch();
