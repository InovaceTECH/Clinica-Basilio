import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { clinics } from "./clinics";
import { users } from "./users";

export const importStatusEnum = pgEnum("import_status", [
  "PROCESSING",
  "COMPLETED",
  "COMPLETED_WITH_ERRORS",
  "FAILED",
]);

export const importRowStatusEnum = pgEnum("import_row_status", [
  "IMPORTED",
  "SKIPPED",
  "FAILED",
]);

export const imports = pgTable(
  "imports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
      .notNull()
      .references(() => clinics.id, { onDelete: "restrict" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    sheetName: varchar("sheet_name", { length: 255 }).notNull(),
    columnMapping: jsonb("column_mapping").notNull(),
    totalRows: integer("total_rows").notNull(),
    importedRows: integer("imported_rows").default(0).notNull(),
    skippedRows: integer("skipped_rows").default(0).notNull(),
    failedRows: integer("failed_rows").default(0).notNull(),
    status: importStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("imports_clinic_created_at_idx").on(table.clinicId, table.createdAt),
    index("imports_user_id_idx").on(table.userId),
    index("imports_clinic_status_idx").on(table.clinicId, table.status),
  ],
);

export const importRows = pgTable(
  "import_rows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    importId: uuid("import_id")
      .notNull()
      .references(() => imports.id, { onDelete: "restrict" }),
    clinicId: uuid("clinic_id")
      .notNull()
      .references(() => clinics.id, { onDelete: "restrict" }),
    rowNumber: integer("row_number").notNull(),
    status: importRowStatusEnum("status").notNull(),
    sourceFingerprint: varchar("source_fingerprint", { length: 64 }),
    errorCode: varchar("error_code", { length: 80 }),
    errorMessage: varchar("error_message", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("import_rows_import_id_idx").on(table.importId),
    index("import_rows_clinic_status_idx").on(table.clinicId, table.status),
  ],
);
