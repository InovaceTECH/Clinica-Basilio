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

const analysisTextSchema = z.string().trim().min(8).max(1_000);

export const opportunityAnalysisSchema = z.object({
  objection_category: objectionCategorySchema,
  context_analysis: analysisTextSchema,
  contact_goal: analysisTextSchema,
  strategy: analysisTextSchema,
  suggested_approach: analysisTextSchema,
  suggested_message: z.string().trim().min(8).max(1_500),
  next_action: analysisTextSchema,
  suggested_follow_up_days: z.number().int().min(1).max(30),
}).strict();

export type OpportunityAnalysis = z.infer<typeof opportunityAnalysisSchema>;

export const opportunityAnalysisResponseFormat = {
  type: "json_schema",
  json_schema: {
    name: "opportunity_analysis",
    strict: true,
    schema: z.toJSONSchema(opportunityAnalysisSchema),
  },
} as const;

export function parseOpportunityAnalysis(value: unknown): OpportunityAnalysis {
  return opportunityAnalysisSchema.parse(value);
}
