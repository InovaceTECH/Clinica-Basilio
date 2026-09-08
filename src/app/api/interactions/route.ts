import { z } from "zod";

import { AuthorizationError } from "@/auth/authorization";
import { requirePermission } from "@/auth/current-authorization";
import { createInteractionSchema } from "@/schemas/interaction";
import {
  createInteraction,
  InteractionOpportunityNotFoundError,
} from "@/services/interactions/commands";

export async function POST(request: Request) {
  try {
    const tenant = await requirePermission("interactions.create");
    const interaction = await createInteraction(
      tenant,
      createInteractionSchema.parse(await request.json()),
    );

    return Response.json(interaction, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return Response.json({ message: "Você não possui permissão para registrar contatos." }, { status: 403 });
    }

    if (error instanceof InteractionOpportunityNotFoundError) {
      return Response.json({ message: "A oportunidade solicitada não foi encontrada." }, { status: 404 });
    }

    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return Response.json({ message: "Revise os campos obrigatórios do contato." }, { status: 400 });
    }

    return Response.json({ message: "Não foi possível registrar o contato. Tente novamente." }, { status: 500 });
  }
}
