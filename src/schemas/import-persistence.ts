import { z } from "zod";

import { importColumnMappingSchema } from "./import-mapping";

export const commitImportSchema = z.object({
  mapping: importColumnMappingSchema,
});

export const normalizedImportRowSchema = z.object({
  patientName: z.string().trim().min(2).max(160),
  phone: z.string().trim().max(32).optional(),
  externalReference: z.string().trim().max(160).optional(),
  treatment: z.string().trim().min(2).max(500),
  budgetValue: z.number().finite().min(0).max(9_999_999_999.99),
  budgetDate: z.date(),
  rawObjection: z.string().trim().max(4_000).optional(),
  notes: z.string().trim().max(4_000).optional(),
});

export type CommitImportInput = z.infer<typeof commitImportSchema>;
export type NormalizedImportRow = z.infer<typeof normalizedImportRowSchema>;

export const importCommitResultSchema = z.object({
  importId: z.uuid(),
  totalRows: z.number().int().nonnegative(),
  importedRows: z.number().int().nonnegative(),
  skippedRows: z.number().int().nonnegative(),
  failedRows: z.number().int().nonnegative(),
  status: z.enum(["COMPLETED", "COMPLETED_WITH_ERRORS"]),
});

export type ImportCommitResult = z.infer<typeof importCommitResultSchema>;
