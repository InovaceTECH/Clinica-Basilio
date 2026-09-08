import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { clinics } from "./clinics";
import { opportunities } from "./opportunities";
import { users } from "./users";

export const interactionChannelEnum = pgEnum("interaction_channel", [
  "WHATSAPP",
  "PHONE",
  "IN_PERSON",
  "OTHER",
]);

export const interactionResultEnum = pgEnum("interaction_result", [
  "NO_RESPONSE",
  "REQUESTED_CALLBACK",
  "STILL_THINKING",
  "INTERESTED",
  "NEGOTIATING",
  "RETURN_SCHEDULED",
  "PROCEDURE_SCHEDULED",
  "CLOSED",
  "DECLINED",
  "DO_NOT_CONTACT",
]);

export const interactions = pgTable(
  "interactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
      .notNull()
      .references(() => clinics.id, { onDelete: "restrict" }),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "restrict" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    channel: interactionChannelEnum("channel").notNull(),
    result: interactionResultEnum("result").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("interactions_clinic_opportunity_created_at_idx").on(
      table.clinicId,
      table.opportunityId,
      table.createdAt,
    ),
  ],
);
