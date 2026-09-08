import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { clinics } from "./clinics";

export const patients = pgTable(
  "patients",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
      .notNull()
      .references(() => clinics.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 32 }),
    externalReference: varchar("external_reference", { length: 160 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("patients_clinic_id_idx").on(table.clinicId),
    index("patients_clinic_phone_idx").on(table.clinicId, table.phone),
    uniqueIndex("patients_clinic_external_reference_unique").on(
      table.clinicId,
      table.externalReference,
    ),
  ],
);
