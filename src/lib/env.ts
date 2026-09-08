import "server-only";

import { z } from "zod";

const optionalSecretSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .trim()
    .regex(/^postgres(?:ql)?:\/\//, "DATABASE_URL deve ser uma URL PostgreSQL."),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  OPENROUTER_API_KEY: optionalSecretSchema,
  OPENROUTER_MODEL: optionalSecretSchema,
  OPENROUTER_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(90_000).default(60_000),
});

const parsedEnv = serverEnvSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
  OPENROUTER_TIMEOUT_MS: process.env.OPENROUTER_TIMEOUT_MS,
});

if (!parsedEnv.success) {
  throw new Error("Variáveis de ambiente do servidor inválidas.");
}

export const env = Object.freeze(parsedEnv.data);
