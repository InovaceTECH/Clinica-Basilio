import { index, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { clinics } from "./clinics";
import { objectionCategoryEnum, opportunities } from "./opportunities";

export const aiAnalyses = pgTable(
  "ai_analyses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "restrict" }),
    opportunityId: uuid("opportunity_id").notNull().references(() => opportunities.id, { onDelete: "restrict" }),
    provider: varchar("provider", { length: 50 }).notNull(),
    model: varchar("model", { length: 160 }).notNull(),
    objectionCategory: objectionCategoryEnum("objection_category").notNull(),
    contextAnalysis: text("context_analysis").notNull(),
    contactGoal: text("contact_goal").notNull(),
    strategy: text("strategy").notNull(),
    suggestedApproach: text("suggested_approach").notNull(),
    suggestedMessage: text("suggested_message").notNull(),
    nextAction: text("next_action").notNull(),
    suggestedFollowUpDays: integer("suggested_follow_up_days").notNull(),
    promptVersion: varchar("prompt_version", { length: 100 }).notNull(),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("ai_analyses_clinic_opportunity_created_at_idx").on(
      table.clinicId,
      table.opportunityId,
      table.createdAt,
    ),
  ],
);
