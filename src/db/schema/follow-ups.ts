import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { clinics } from "./clinics";
import { opportunities } from "./opportunities";
import { users } from "./users";

export const followUpStatusEnum = pgEnum("follow_up_status", ["PENDING", "COMPLETED", "CANCELED"]);
export const followUps = pgTable("follow_ups", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "restrict" }),
  opportunityId: uuid("opportunity_id").notNull().references(() => opportunities.id, { onDelete: "restrict" }),
  assignedUserId: uuid("assigned_user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  reason: text("reason").notNull(),
  notes: text("notes"),
  status: followUpStatusEnum("status").default("PENDING").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("follow_ups_clinic_scheduled_at_idx").on(table.clinicId, table.scheduledAt),
  index("follow_ups_clinic_opportunity_status_idx").on(table.clinicId, table.opportunityId, table.status),
]);
