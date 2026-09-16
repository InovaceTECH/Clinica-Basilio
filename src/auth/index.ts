import "server-only";

import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/lib/env";

export const auth = betterAuth({
  appName: "Clínica Basilico",
  baseURL: env.BETTER_AUTH_URL,
  // O Next.js pode ocupar portas diferentes durante o desenvolvimento local.
  // Mantemos apenas origens loopback explícitas além da URL configurada.
  trustedOrigins: [
    env.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3010",
  ],
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
  },
  user: {
    additionalFields: {
      clinicId: {
        type: "string",
        required: true,
        input: false,
      },
      role: {
        type: ["MANAGER", "RECEPTIONIST"],
        required: true,
        input: false,
      },
    },
  },
  advanced: {
    cookiePrefix: "clinica_basilico",
    database: {
      generateId: "uuid",
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
