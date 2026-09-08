import { z } from "zod";

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .transform((value) => value || undefined);

export const createPatientSchema = z.object({
  name: z.string().trim().min(2).max(160),
  phone: optionalText(32),
  externalReference: optionalText(160),
});

export type CreatePatientInput = z.input<typeof createPatientSchema>;
