import { z } from "zod";

export const objectionCategorySchema = z.enum([
  "FINANCIAL",
  "SHARED_DECISION",
  "INDECISION",
  "COMPARISON",
  "LOW_URGENCY",
  "INSECURITY",
  "NO_RESPONSE",
  "OTHER",
]);

export const opportunityPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW"]);

export const opportunityStatusSchema = z.enum([
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

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .transform((value) => value || undefined);

const optionalDate = z.coerce.date().optional();

export const createOpportunitySchema = z.object({
  patientId: z.uuid(),
  treatment: z.string().trim().min(2).max(500),
  budgetValue: z.coerce.number().finite().min(0).max(9_999_999_999.99),
  finalBudgetValue: z.coerce
    .number()
    .finite()
    .min(0)
    .max(9_999_999_999.99)
    .optional(),
  budgetDate: z.coerce.date(),
  professionalName: optionalText(160),
  leadSource: optionalText(100),
  rawObjection: optionalText(4_000),
  notes: optionalText(4_000),
  objectionCategory: objectionCategorySchema.optional(),
  priorityScore: z.coerce.number().int().min(0).max(100).default(0),
  priority: opportunityPrioritySchema.default("MEDIUM"),
  status: opportunityStatusSchema.default("NEW"),
  lastContactAt: optionalDate,
  nextFollowUpAt: optionalDate,
  responsibleUserId: z.uuid().optional(),
});

export type CreateOpportunityInput = z.input<typeof createOpportunitySchema>;
