import { z } from "zod";

import { AuthorizationError } from "@/auth/authorization";
import { requirePermission } from "@/auth/current-authorization";
import { env } from "@/lib/env";
import {
  analyzeOpportunity,
  OpportunityNotFoundForAnalysisError,
} from "@/services/ai/analyze-opportunity";
import { OpenRouterError, type OpenRouterErrorCode } from "@/services/ai/openrouter";

export const maxDuration = 120;

const aiErrorResponses: Record<OpenRouterErrorCode, { message: string; status: number }> = {
  AI_CONFIGURATION_ERROR: {
    message: "A integração de IA está indisponível. Peça ao responsável para verificar a configuração e os limites de uso.",
    status: 503,
  },
  AI_TIMEOUT: {
    message: "A análise demorou mais que o esperado. Tente novamente em alguns instantes.",
    status: 504,
  },
  AI_RATE_LIMIT: {
    message: "O limite de solicitações de IA foi atingido. Aguarde um pouco e tente novamente.",
    status: 429,
  },
  AI_INVALID_RESPONSE: {
    message: "A IA não retornou uma análise válida. Tente novamente em alguns instantes.",
    status: 502,
  },
  AI_PROVIDER_ERROR: {
    message: "Não foi possível gerar a análise agora. Tente novamente em alguns instantes.",
    status: 502,
  },
};

const analyzeRequestSchema = z.object({
  opportunityId: z.uuid(),
});

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const tenant = await requirePermission("opportunities.analyze");
    const body = analyzeRequestSchema.parse(await request.json());
    const analysis = await analyzeOpportunity(tenant, body.opportunityId);

    return Response.json(analysis, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return Response.json({ message: "Você não possui permissão para analisar oportunidades." }, { status: 403 });
    }

    if (error instanceof OpportunityNotFoundForAnalysisError) {
      return Response.json({ message: "A oportunidade solicitada não foi encontrada." }, { status: 404 });
    }

    if (error instanceof OpenRouterError) {
      console.error("[ai/analyze] Falha na análise", {
        code: error.code,
        model: env.OPENROUTER_MODEL,
        durationMs: Date.now() - startedAt,
        providerStatus: error.details.providerStatus,
        finishReason: error.details.finishReason,
      });
      const { message, status } = aiErrorResponses[error.code];
      return Response.json({ message }, { status });
    }

    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return Response.json({ message: "A oportunidade informada é inválida." }, { status: 400 });
    }

    return Response.json({ message: "Não foi possível gerar a análise agora. Tente novamente em alguns instantes." }, { status: 500 });
  }
}
