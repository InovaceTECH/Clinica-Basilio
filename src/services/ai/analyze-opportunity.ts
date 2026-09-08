import "server-only";

import { z } from "zod";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { aiAnalyses } from "@/db/schema";
import { getTenantOpportunityById } from "@/services/opportunities/queries";
import { getAiCommercialContext } from "@/services/commercial-config/queries";

import { getOpenRouterClient, OpenRouterError, type OpenRouterChatInput, type OpenRouterChatCompletion } from "./openrouter";
import { buildOpportunityAnalysisPrompt } from "./prompts/opportunity-analysis";
import { opportunityAnalysisResponseFormat, parseOpportunityAnalysis } from "./schemas/opportunity-analysis-schema";

type OpenRouterClient = {
  complete: (input: OpenRouterChatInput) => Promise<OpenRouterChatCompletion>;
};

type AnalyzeOpportunityOptions = {
  client?: OpenRouterClient;
};

export class OpportunityNotFoundForAnalysisError extends Error {
  constructor() {
    super("A oportunidade não pertence à clínica atual.");
    this.name = "OpportunityNotFoundForAnalysisError";
  }
}

function parseModelJson(content: string) {
  try {
    return parseOpportunityAnalysis(JSON.parse(content));
  } catch {
    throw new OpenRouterError(
      "O provedor de IA retornou uma análise em formato inválido.",
      "AI_INVALID_RESPONSE",
    );
  }
}

export async function analyzeOpportunity(
  tenant: TenantContext,
  opportunityId: string,
  { client = getOpenRouterClient() }: AnalyzeOpportunityOptions = {},
) {
  assertPermission(tenant, "opportunities.analyze");
  const parsedOpportunityId = z.uuid().safeParse(opportunityId);

  if (!parsedOpportunityId.success) {
    throw new OpportunityNotFoundForAnalysisError();
  }

  const opportunity = await getTenantOpportunityById(tenant, parsedOpportunityId.data);

  if (!opportunity) {
    throw new OpportunityNotFoundForAnalysisError();
  }
  const commercialRules = await getAiCommercialContext(tenant, opportunity.objectionCategory ?? "OTHER");

  const prompt = buildOpportunityAnalysisPrompt({
    budgetValue: Number(opportunity.budgetValue),
    commercialRules,
    firstName: opportunity.patientName,
    rawObjection: opportunity.rawObjection ?? undefined,
    treatment: opportunity.treatment,
  });
  const completion = await client.complete({
    maxTokens: 2_000,
    responseFormat: opportunityAnalysisResponseFormat,
    messages: [
      { content: prompt.system, role: "system" },
      { content: prompt.user, role: "user" },
    ],
  });
  const analysis = parseModelJson(completion.content);
  const [storedAnalysis] = await db
    .insert(aiAnalyses)
    .values({
      clinicId: tenant.clinicId,
      opportunityId: opportunity.id,
      provider: "OPENROUTER",
      model: completion.model,
      objectionCategory: analysis.objection_category,
      contextAnalysis: analysis.context_analysis,
      contactGoal: analysis.contact_goal,
      strategy: analysis.strategy,
      suggestedApproach: analysis.suggested_approach,
      suggestedMessage: analysis.suggested_message,
      nextAction: analysis.next_action,
      suggestedFollowUpDays: analysis.suggested_follow_up_days,
      promptVersion: prompt.version,
      inputTokens: completion.usage?.promptTokens ?? null,
      outputTokens: completion.usage?.completionTokens ?? null,
    })
    .returning();

  return storedAnalysis;
}
