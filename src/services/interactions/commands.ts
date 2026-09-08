import "server-only";

import { and, eq } from "drizzle-orm";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { followUps, interactions, opportunities } from "@/db/schema";
import {
  createInteractionSchema,
  type CreateInteractionInput,
} from "@/schemas/interaction";

export class InteractionOpportunityNotFoundError extends Error {
  constructor() {
    super("A oportunidade informada não pertence à clínica atual.");
    this.name = "InteractionOpportunityNotFoundError";
  }
}

export async function createInteraction(
  tenant: TenantContext,
  input: CreateInteractionInput,
) {
  assertPermission(tenant, "interactions.create");

  const interaction = createInteractionSchema.parse(input);

  const [opportunity] = await db
    .select({ id: opportunities.id })
    .from(opportunities)
    .where(
      and(
        eq(opportunities.id, interaction.opportunityId),
        eq(opportunities.clinicId, tenant.clinicId),
      ),
    )
    .limit(1);

  if (!opportunity) {
    throw new InteractionOpportunityNotFoundError();
  }

  const contactedAt = new Date();
  const terminalStatus = interaction.result === "CLOSED"
    ? "RECOVERED"
    : interaction.result === "DECLINED"
      ? "LOST"
      : interaction.result === "DO_NOT_CONTACT"
        ? "DO_NOT_CONTACT"
        : undefined;
  const [createdInteractions] = await db.batch([
    db
      .insert(interactions)
      .values({
        clinicId: tenant.clinicId,
        opportunityId: opportunity.id,
        userId: tenant.userId,
        channel: interaction.channel,
        result: interaction.result,
        notes: interaction.notes ?? null,
        createdAt: contactedAt,
      })
      .returning(),
    db
      .update(opportunities)
      .set({
        lastContactAt: contactedAt,
        updatedAt: contactedAt,
        ...(terminalStatus ? { status: terminalStatus, nextFollowUpAt: null } : {}),
      })
      .where(
        and(
          eq(opportunities.id, opportunity.id),
          eq(opportunities.clinicId, tenant.clinicId),
        ),
      ),
    ...(terminalStatus ? [
      db
        .update(followUps)
        .set({ status: "CANCELED", updatedAt: contactedAt })
        .where(and(
          eq(followUps.clinicId, tenant.clinicId),
          eq(followUps.opportunityId, opportunity.id),
          eq(followUps.status, "PENDING"),
        )),
    ] : []),
  ]);

  return createdInteractions[0]!;
}
