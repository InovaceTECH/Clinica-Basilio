import { z } from "zod";

export const commercialConfigLimits = {
  title: 160,
  content: 4_000,
  objective: 2_000,
  guidelines: 4_000,
  suggestedQuestions: 4_000,
} as const;

const titleSchema = z.string().trim().min(2).max(commercialConfigLimits.title);
export const commercialConfigSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("rule"),
    title: titleSchema,
    content: z.string().trim().min(2).max(commercialConfigLimits.content),
  }),
  z.object({
    type: z.literal("playbook"),
    category: z.enum(["FINANCIAL", "SHARED_DECISION", "INDECISION", "COMPARISON", "LOW_URGENCY", "INSECURITY", "NO_RESPONSE", "OTHER"]),
    title: titleSchema,
    objective: z.string().trim().min(2).max(commercialConfigLimits.objective),
    guidelines: z.string().trim().min(2).max(commercialConfigLimits.guidelines),
    suggestedQuestions: z.string().trim().max(commercialConfigLimits.suggestedQuestions).optional(),
  }),
]);

// O contexto também recebe o playbook concatenado com ": ", ". " e ". ".
export const commercialContextEntrySchema = z.string().trim().min(1).max(Math.max(
  commercialConfigLimits.content,
  commercialConfigLimits.title + commercialConfigLimits.objective
    + commercialConfigLimits.guidelines + commercialConfigLimits.suggestedQuestions + 6,
));
