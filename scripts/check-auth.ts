import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";

import { auth } from "../src/auth";
import { getAuthenticatedHomePath, hasPermission } from "../src/auth/authorization";
import type { AppRole } from "../src/auth/roles";
import { parseTenantContext } from "../src/auth/tenant-context";
import { db } from "../src/db";
import { accounts, clinics, sessions, users } from "../src/db/schema";
import { env } from "../src/lib/env";

async function checkAuth(role: AppRole) {
  const clinicId = randomUUID();
  const userId = randomUUID();
  const email = `auth-check-${randomUUID()}@example.invalid`;
  const password = `T3st-${randomUUID()}`;

  try {
    await db.insert(clinics).values({ id: clinicId, name: "Auth check" });
    await db.insert(users).values({
      id: userId,
      clinicId,
      name: "Auth check",
      email,
      role,
    });
    await db.insert(accounts).values({
      id: randomUUID(),
      issuer: "local:credential",
      accountId: userId,
      providerId: "credential",
      userId,
      password: await hashPassword(password),
    });

    const signUpResponse = await auth.handler(
      new Request(`${env.BETTER_AUTH_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: env.BETTER_AUTH_URL,
        },
        body: JSON.stringify({
          email: `blocked-${email}`,
          name: "Blocked sign-up",
          password,
        }),
      }),
    );

    if (signUpResponse.ok) {
      throw new Error("O cadastro público deveria estar desativado.");
    }

    const signInResponse = await auth.handler(
      new Request(`${env.BETTER_AUTH_URL}/api/auth/sign-in/email`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: env.BETTER_AUTH_URL,
        },
        body: JSON.stringify({ email, password }),
      }),
    );

    if (!signInResponse.ok) {
      throw new Error("O login de verificação falhou.");
    }

    const cookie = signInResponse.headers
      .getSetCookie()
      .map((value) => value.split(";", 1)[0])
      .join("; ");
    const sessionResponse = await auth.handler(
      new Request(`${env.BETTER_AUTH_URL}/api/auth/get-session`, {
        headers: { cookie, origin: env.BETTER_AUTH_URL },
      }),
    );
    const sessionData = (await sessionResponse.json()) as {
      user?: { id?: string; clinicId?: string; role?: string };
    } | null;

    if (
      !sessionResponse.ok ||
      sessionData?.user?.clinicId !== clinicId ||
      sessionData.user.role !== role
    ) {
      throw new Error("A sessão de verificação é inválida.");
    }

    const tenant = parseTenantContext({
      userId: sessionData.user.id,
      clinicId: sessionData.user.clinicId,
      role: sessionData.user.role,
    });
    assert.equal(getAuthenticatedHomePath(tenant), role === "MANAGER" ? "/dashboard" : "/oportunidades");
    assert.equal(hasPermission(tenant, "dashboard.read"), role === "MANAGER");
    assert.ok(hasPermission(tenant, "opportunities.read"));

    const httpUrl = process.argv.find(value => value.startsWith("--http-url="))?.slice("--http-url=".length);
    if (httpUrl) {
      const expectedPath = getAuthenticatedHomePath(tenant);
      for (const path of ["/", "/login", ...(role === "RECEPTIONIST" ? ["/dashboard"] : [])]) {
        const response: Response = await fetch(new URL(path, httpUrl), { headers: { cookie }, redirect: "manual" });
        assert.equal(response.status, 307, `Redirecionamento HTTP de ${path} para ${role}`);
        assert.equal(response.headers.get("location"), expectedPath);
        await response.body?.cancel();
      }
      const landingResponse = await fetch(new URL(expectedPath, httpUrl), { headers: { cookie }, redirect: "manual" });
      assert.equal(landingResponse.status, 200);
      await landingResponse.body?.cancel();
    }

    const signOutResponse = await auth.handler(
      new Request(`${env.BETTER_AUTH_URL}/api/auth/sign-out`, {
        method: "POST",
        headers: { cookie, origin: env.BETTER_AUTH_URL },
      }),
    );

    if (!signOutResponse.ok) {
      throw new Error("O logout de verificação falhou.");
    }

    console.log(
      `Cadastro público bloqueado; login, sessão, destino por permissão e logout validados para ${role}.`,
    );
  } finally {
    await db.delete(sessions).where(eq(sessions.userId, userId));
    await db.delete(accounts).where(eq(accounts.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
    await db.delete(clinics).where(eq(clinics.id, clinicId));
  }
}

async function main() {
  await checkAuth("MANAGER");
  await checkAuth("RECEPTIONIST");
}

void main();
