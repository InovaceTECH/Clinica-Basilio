import { z } from "zod";

export const MAX_IMPORT_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const importFileMetadataSchema = z.object({
  name: z.string().trim().min(1).max(255),
  size: z.number().int().positive().max(MAX_IMPORT_FILE_SIZE_BYTES),
  type: z.string().max(255),
});

export const importPreviewSchema = z.object({
  fileName: z.string(),
  sheetName: z.string(),
  headers: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())),
  totalRows: z.number().int().nonnegative(),
});

export type ImportPreview = z.infer<typeof importPreviewSchema>;
