import { z } from "zod";

export const opportunityStatusFilterSchema = z.enum([
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

export const opportunityPriorityFilterSchema = z.enum(["HIGH", "MEDIUM", "LOW"]);

export const objectionCategoryFilterSchema = z.enum([
  "FINANCIAL",
  "SHARED_DECISION",
  "INDECISION",
  "COMPARISON",
  "LOW_URGENCY",
  "INSECURITY",
  "NO_RESPONSE",
  "OTHER",
]);

const opportunityListFiltersSchema = z.object({
  objection: objectionCategoryFilterSchema.optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(100_000).catch(1),
  priority: opportunityPriorityFilterSchema.optional().catch(undefined),
  query: z.string().trim().max(100).catch(""),
  status: opportunityStatusFilterSchema.optional().catch(undefined),
});

export type OpportunityListFilters = z.infer<typeof opportunityListFiltersSchema>;

type SearchParameters = Record<string, string | string[] | undefined>;

export function parseOpportunityListFilters(searchParameters: SearchParameters): OpportunityListFilters {
  const firstValue = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  return opportunityListFiltersSchema.parse({
    objection: firstValue(searchParameters.objection),
    page: firstValue(searchParameters.page),
    priority: firstValue(searchParameters.priority),
    query: firstValue(searchParameters.query),
    status: firstValue(searchParameters.status),
  });
}
