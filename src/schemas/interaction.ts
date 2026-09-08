import { z } from "zod";

export const interactionChannelSchema = z.enum([
  "WHATSAPP",
  "PHONE",
  "IN_PERSON",
  "OTHER",
]);

export const interactionResultSchema = z.enum([
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

export const createInteractionSchema = z.object({
  opportunityId: z.uuid(),
  channel: interactionChannelSchema,
  result: interactionResultSchema,
  notes: z.string().trim().max(4_000).optional().transform((value) => value || undefined),
});

export type CreateInteractionInput = z.input<typeof createInteractionSchema>;
