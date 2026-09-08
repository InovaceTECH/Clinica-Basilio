import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { clinics } from "./clinics";
import { patients } from "./patients";
import { users } from "./users";

export const objectionCategoryEnum = pgEnum("objection_category", [
  "FINANCIAL",
  "SHARED_DECISION",
  "INDECISION",
  "COMPARISON",
  "LOW_URGENCY",
  "INSECURITY",
  "NO_RESPONSE",
  "OTHER",
]);

export const opportunityPriorityEnum = pgEnum("opportunity_priority", [
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export const opportunityStatusEnum = pgEnum("opportunity_status", [
  "NEW",
  "TO_ANALYZE",
  "CONTACT_PENDING",
  "CONTACTED",
  "WAITING_PATIENT",
  "FOLLOW_UP_SCHEDULED",
  "NEGOTIATING",
  "RECOVERED",
  "LOST",
  "DO_NOT_CONTACT",
]);

export const opportunities = pgTable(
  "opportunities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
      .notNull()
      .references(() => clinics.id, { onDelete: "restrict" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "restrict" }),
    treatment: varchar("treatment", { length: 500 }).notNull(),
    budgetValue: numeric("budget_value", { precision: 12, scale: 2 }).notNull(),
    finalBudgetValue: numeric("final_budget_value", {
      precision: 12,
      scale: 2,
    }),
    budgetDate: date("budget_date", { mode: "date" }).notNull(),
    professionalName: varchar("professional_name", { length: 160 }),
    leadSource: varchar("lead_source", { length: 100 }),
    rawObjection: text("raw_objection"),
    notes: text("notes"),
    objectionCategory: objectionCategoryEnum("objection_category"),
    priorityScore: integer("priority_score").default(0).notNull(),
    priority: opportunityPriorityEnum("priority").default("MEDIUM").notNull(),
    status: opportunityStatusEnum("status").default("NEW").notNull(),
    lastContactAt: timestamp("last_contact_at", { withTimezone: true }),
    nextFollowUpAt: timestamp("next_follow_up_at", { withTimezone: true }),
    responsibleUserId: uuid("responsible_user_id").references(() => users.id, {
      onDelete: "restrict",
    }),
    sourceFingerprint: varchar("source_fingerprint", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      "opportunities_budget_value_non_negative",
      sql`${table.budgetValue} >= 0`,
    ),
    check(
      "opportunities_final_budget_value_non_negative",
      sql`${table.finalBudgetValue} IS NULL OR ${table.finalBudgetValue} >= 0`,
    ),
    check(
      "opportunities_priority_score_range",
      sql`${table.priorityScore} BETWEEN 0 AND 100`,
    ),
    index("opportunities_clinic_id_idx").on(table.clinicId),
    index("opportunities_patient_id_idx").on(table.patientId),
    index("opportunities_clinic_status_idx").on(table.clinicId, table.status),
    index("opportunities_clinic_priority_idx").on(table.clinicId, table.priority),
    index("opportunities_clinic_budget_date_idx").on(table.clinicId, table.budgetDate),
    index("opportunities_clinic_next_follow_up_at_idx").on(
      table.clinicId,
      table.nextFollowUpAt,
    ),
    uniqueIndex("opportunities_clinic_source_fingerprint_unique").on(
      table.clinicId,
      table.sourceFingerprint,
    ),
  ],
);
