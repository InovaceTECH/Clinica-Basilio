import { randomUUID } from "node:crypto";

import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../src/db";
import { accounts, clinics, users } from "../src/db/schema";

const bootstrapSchema = z.object({
  AUTH_BOOTSTRAP_CLINIC_NAME: z.string().trim().min(2).max(160),
  AUTH_BOOTSTRAP_USER_NAME: z.string().trim().min(2).max(160),
  AUTH_BOOTSTRAP_EMAIL: z.email().transform((email) => email.toLowerCase()),
  AUTH_BOOTSTRAP_PASSWORD: z.string().min(10).max(128),
});

async function bootstrapManager() {
  const input = bootstrapSchema.safeParse(process.env);

  if (!input.success) {
    throw new Error(
      "Defina AUTH_BOOTSTRAP_CLINIC_NAME, AUTH_BOOTSTRAP_USER_NAME, AUTH_BOOTSTRAP_EMAIL e AUTH_BOOTSTRAP_PASSWORD.",
    );
  }

  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.data.AUTH_BOOTSTRAP_EMAIL))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Já existe um usuário com o e-mail informado.");
  }

  const clinicId = randomUUID();
  const userId = randomUUID();
  const passwordHash = await hashPassword(input.data.AUTH_BOOTSTRAP_PASSWORD);

  try {
    await db.insert(clinics).values({
      id: clinicId,
      name: input.data.AUTH_BOOTSTRAP_CLINIC_NAME,
    });
    await db.insert(users).values({
      id: userId,
      clinicId,
      name: input.data.AUTH_BOOTSTRAP_USER_NAME,
      email: input.data.AUTH_BOOTSTRAP_EMAIL,
      role: "MANAGER",
    });
    await db.insert(accounts).values({
      id: randomUUID(),
      issuer: "local:credential",
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
    });
  } catch {
    await db.delete(users).where(eq(users.id, userId));
    await db.delete(clinics).where(eq(clinics.id, clinicId));
    throw new Error("Não foi possível criar o gestor inicial.");
  }

  console.log("Clínica e gestor inicial criados com sucesso.");
}

void bootstrapManager();
