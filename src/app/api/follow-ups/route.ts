import { z } from "zod";
import { AuthorizationError } from "@/auth/authorization";
import { requirePermission } from "@/auth/current-authorization";
import { createFollowUpSchema } from "@/schemas/follow-up";
import { createFollowUp, FollowUpNotFoundError } from "@/services/follow-ups/commands";
export async function POST(request: Request) { try { const tenant = await requirePermission("followUps.create"); return Response.json(await createFollowUp(tenant, createFollowUpSchema.parse(await request.json())), { status: 201 }); } catch (error) { if (error instanceof AuthorizationError) return Response.json({ message: "Você não possui permissão para criar follow-ups." }, { status: 403 }); if (error instanceof FollowUpNotFoundError) return Response.json({ message: "A oportunidade solicitada não foi encontrada." }, { status: 404 }); if (error instanceof z.ZodError || error instanceof SyntaxError) return Response.json({ message: "Revise os campos do follow-up." }, { status: 400 }); return Response.json({ message: "Não foi possível criar o follow-up." }, { status: 500 }); } }
