import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as postgresDrizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { BatchItem, BatchResponse } from "drizzle-orm/batch";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { NeonHttpQueryResultHKT } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";

import * as schema from "./schema";

const globalDatabase = globalThis as typeof globalThis & { basilicoPool?: Pool };
const localDatabase = env.DATABASE_DRIVER === "postgres"
  ? postgresDrizzle({
      client: globalDatabase.basilicoPool ??= new Pool({
        connectionString: env.DATABASE_URL,
        max: 5,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 10000,
        allowExitOnIdle: true,
      }),
      schema,
    })
  : undefined;
const neonDatabase = localDatabase ? undefined : neonDrizzle({ client: neon(env.DATABASE_URL), schema });

export const db: PgDatabase<NodePgQueryResultHKT | NeonHttpQueryResultHKT, typeof schema> = localDatabase ?? neonDatabase!;

type BatchDatabase = Pick<typeof db, "insert" | "update" | "delete" | "execute">;

// Build queries using the supplied connection so local writes share one transaction.
// Neon continues to use its atomic HTTP batch API.
export async function executeBatch<T extends readonly [BatchItem<"pg">, ...BatchItem<"pg">[]]>(
  build: (connection: BatchDatabase) => T,
): Promise<BatchResponse<T>> {
  if (localDatabase) {
    return localDatabase.transaction(async transaction => {
      const results: unknown[] = [];
      for (const query of build(transaction)) {
        results.push(await query);
      }
      return results as BatchResponse<T>;
    });
  }
  return neonDatabase!.batch(build(neonDatabase!));
}
