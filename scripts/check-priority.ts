import assert from "node:assert/strict";

import { calculatePriority } from "../src/services/priority/calculate-priority";

const now = new Date("2026-09-01T12:00:00.000Z");

const highPriority = calculatePriority({
  budgetDate: new Date("2026-08-30T00:00:00.000Z"),
  budgetValue: 12_000,
  hasPositiveInteraction: true,
  nextFollowUpAt: new Date("2026-08-31T12:00:00.000Z"),
  objectionCategory: "FINANCIAL",
}, now);
const mediumPriority = calculatePriority({
  budgetDate: new Date("2026-08-20T00:00:00.000Z"),
  budgetValue: 3_000,
  objectionCategory: "FINANCIAL",
}, now);
const lowPriority = calculatePriority({
  budgetDate: new Date("2026-03-01T00:00:00.000Z"),
  budgetValue: 900,
  nextFollowUpAt: new Date("2026-10-01T12:00:00.000Z"),
  objectionCategory: "LOW_URGENCY",
}, now);

assert.deepEqual(highPriority, { priority: "HIGH", score: 100 });
assert.deepEqual(mediumPriority, { priority: "MEDIUM", score: 48 });
assert.deepEqual(lowPriority, { priority: "LOW", score: 19 });
assert.throws(() => calculatePriority({
  budgetDate: now,
  budgetValue: -1,
}, now));

console.log("Score determinístico de prioridade validado em cenários alto, médio e baixo.");
