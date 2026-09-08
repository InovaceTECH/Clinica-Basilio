import { z } from "zod";
export const followUpStatusSchema = z.enum(["PENDING", "COMPLETED", "CANCELED"]);
const optionalNotes = z.string().trim().max(4000).optional().transform((value) => value || undefined);
const scheduledAtSchema = z.union([z.date(), z.iso.datetime({ offset: true }).transform(value => new Date(value))]);
export const followUpFiltersSchema = z.object({
  assignedUserId: z.preprocess(value => value === "" ? undefined : value, z.uuid().optional()),
  date: z.preprocess(value => value === "" ? undefined : value, z.iso.date().optional()),
  status: z.preprocess(value => value === "" ? undefined : value, followUpStatusSchema.optional()),
});
export const createFollowUpSchema = z.object({ opportunityId: z.uuid(), scheduledAt: scheduledAtSchema, reason: z.string().trim().min(2).max(1000), notes: optionalNotes });
export const updateFollowUpSchema = z.object({ scheduledAt: scheduledAtSchema, reason: z.string().trim().min(2).max(1000), notes: optionalNotes });
export type CreateFollowUpInput = z.input<typeof createFollowUpSchema>;
export type UpdateFollowUpInput = z.input<typeof updateFollowUpSchema>;
