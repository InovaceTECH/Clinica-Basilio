import { z } from "zod";

const priorityInputSchema = z.object({
  budgetDate: z.coerce.date(),
  budgetValue: z.coerce.number().finite().min(0),
  hasPositiveInteraction: z.boolean().default(false),
  nextFollowUpAt: z.coerce.date().optional(),
  objectionCategory: z.enum([
    "FINANCIAL",
    "SHARED_DECISION",
    "INDECISION",
    "COMPARISON",
    "LOW_URGENCY",
    "INSECURITY",
    "NO_RESPONSE",
    "OTHER",
  ]).optional(),
});

export type PriorityInput = z.input<typeof priorityInputSchema>;

export type PriorityResult = {
  score: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
};

function daysBetween(start: Date, end: Date) {
  return Math.floor((end.getTime() - start.getTime()) / 86_400_000);
}

function scoreRecency(budgetDate: Date, now: Date) {
  const days = Math.max(0, daysBetween(budgetDate, now));

  if (days <= 7) return 30;
  if (days <= 30) return 20;
  if (days <= 90) return 10;
  return 5;
}

function scoreBudgetValue(budgetValue: number) {
  if (budgetValue >= 10_000) return 25;
  if (budgetValue >= 5_000) return 20;
  if (budgetValue >= 2_000) return 12;
  return 6;
}

function scoreFollowUp(nextFollowUpAt: Date | undefined, now: Date) {
  if (!nextFollowUpAt) return 6;

  const days = daysBetween(now, nextFollowUpAt);

  if (days < 0) return 25;
  if (days <= 3) return 20;
  if (days <= 7) return 12;
  return 4;
}

function scoreObjection(category: z.output<typeof priorityInputSchema>["objectionCategory"]) {
  switch (category) {
    case "FINANCIAL":
    case "SHARED_DECISION":
    case "INDECISION":
    case "COMPARISON":
      return 10;
    case "INSECURITY":
      return 8;
    case "NO_RESPONSE":
      return 6;
    case "LOW_URGENCY":
    case "OTHER":
      return 4;
    default:
      return 0;
  }
}

export function calculatePriority(input: PriorityInput, now = new Date()): PriorityResult {
  const opportunity = priorityInputSchema.parse(input);
  const score = Math.min(
    100,
    scoreRecency(opportunity.budgetDate, now) +
      scoreBudgetValue(opportunity.budgetValue) +
      scoreFollowUp(opportunity.nextFollowUpAt, now) +
      scoreObjection(opportunity.objectionCategory) +
      (opportunity.hasPositiveInteraction ? 10 : 0),
  );

  return {
    priority: score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW",
    score,
  };
}
