import { z } from "zod";

import { AuthorizationError } from "@/auth/authorization";
import { requirePermission } from "@/auth/current-authorization";
import { updateOpportunitySchema } from "@/schemas/opportunity";
import {
  OpportunityInvalidPhoneError,
  OpportunityNotFoundError,
  OpportunityPatientPhoneConflictError,
  updateOpportunity,
} from "@/services/opportunities/commands";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ opportunityId: string }> },
) {
  try {
    const tenant = await requirePermission("opportunities.update");
    const { opportunityId } = await params;
    const id = z.uuid().parse(opportunityId);
    const input = updateOpportunitySchema.parse(await request.json());
    await updateOpportunity(tenant, id, input);

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return Response.json(
        { message: "Você não possui permissão para editar oportunidades." },
        { status: 403 },
      );
    }

    if (error instanceof OpportunityNotFoundError) {
      return Response.json(
        { message: "A oportunidade não foi encontrada." },
        { status: 404 },
      );
    }

    if (error instanceof OpportunityPatientPhoneConflictError) {
      return Response.json(
        { message: "Este telefone já está associado a outro paciente." },
        { status: 409 },
      );
    }

    if (error instanceof OpportunityInvalidPhoneError || error instanceof z.ZodError) {
      return Response.json(
        { message: "Revise os dados informados e tente novamente." },
        { status: 400 },
      );
    }

    return Response.json(
      { message: "Não foi possível salvar as alterações. Tente novamente." },
      { status: 500 },
    );
  }
}
