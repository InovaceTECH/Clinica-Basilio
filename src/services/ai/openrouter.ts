import "server-only";

import { z } from "zod";

import { env } from "@/lib/env";

const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
const defaultMaxTokens = 700;
const defaultTemperature = 0.2;

const messageSchema = z.object({
  content: z.string().trim().min(1).max(20_000),
  role: z.enum(["system", "user"]),
});

export const openRouterChatInputSchema = z.object({
  maxTokens: z.number().int().min(1).max(2_000).default(defaultMaxTokens),
  messages: z.array(messageSchema).min(1).max(10),
  responseFormat: z.object({
    type: z.literal("json_schema"),
    json_schema: z.object({
      name: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/),
      strict: z.literal(true),
      schema: z.record(z.string(), z.unknown()),
    }),
  }).optional(),
  temperature: z.number().min(0).max(1).default(defaultTemperature),
});

export type OpenRouterChatInput = z.input<typeof openRouterChatInputSchema>;

const openRouterResponseSchema = z.object({
  choices: z.array(
    z.object({
      finish_reason: z.enum(["stop", "length", "content_filter", "tool_calls", "error"]).nullish(),
      message: z.object({
        content: z.string().nullable(),
      }),
    }),
  ).min(1),
  model: z.string().min(1),
  usage: z.object({
    completion_tokens: z.number().int().nonnegative().optional(),
    prompt_tokens: z.number().int().nonnegative().optional(),
    total_tokens: z.number().int().nonnegative().optional(),
  }).optional(),
});

export type OpenRouterChatCompletion = {
  content: string;
  model: string;
  usage?: {
    completionTokens?: number;
    promptTokens?: number;
    totalTokens?: number;
  };
};

export type OpenRouterErrorCode =
  | "AI_CONFIGURATION_ERROR"
  | "AI_INVALID_RESPONSE"
  | "AI_PROVIDER_ERROR"
  | "AI_RATE_LIMIT"
  | "AI_TIMEOUT";

type OpenRouterErrorDetails = {
  providerStatus?: number;
  finishReason?: string;
};

export class OpenRouterError extends Error {
  constructor(
    message: string,
    readonly code: OpenRouterErrorCode,
    readonly details: OpenRouterErrorDetails = {},
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

function providerError(status: number) {
  const code = status === 429
    ? "AI_RATE_LIMIT"
    : [401, 402, 403, 404].includes(status)
      ? "AI_CONFIGURATION_ERROR"
      : "AI_PROVIDER_ERROR";

  return new OpenRouterError(
    "O provedor de IA não pôde processar a solicitação.",
    code,
    { providerStatus: status },
  );
}

type FetchFunction = typeof fetch;

type OpenRouterClientOptions = {
  apiKey: string;
  fetchFn?: FetchFunction;
  model: string;
  timeoutMs?: number;
};

export function createOpenRouterClient({
  apiKey,
  fetchFn = fetch,
  model,
  timeoutMs = env.OPENROUTER_TIMEOUT_MS,
}: OpenRouterClientOptions) {
  return {
    async complete(input: OpenRouterChatInput): Promise<OpenRouterChatCompletion> {
      const request = openRouterChatInputSchema.parse(input);
      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), timeoutMs);

      try {
        const response = await fetchFn(openRouterUrl, {
          body: JSON.stringify({
            max_tokens: request.maxTokens,
            messages: request.messages,
            model,
            ...(request.responseFormat ? {
              response_format: request.responseFormat,
              provider: { require_parameters: true },
            } : {}),
            temperature: request.temperature,
          }),
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw providerError(response.status);
        }

        const payload: unknown = await response.json();
        // O provedor também pode reportar uma falha no corpo após enviar HTTP 200.
        const providerFailure = z.object({
          error: z.object({ code: z.number().int() }),
        }).safeParse(payload);

        if (providerFailure.success) {
          throw providerError(providerFailure.data.error.code);
        }

        const parsedResponse = openRouterResponseSchema.safeParse(payload);

        if (!parsedResponse.success) {
          throw new OpenRouterError(
            "O provedor de IA retornou uma resposta em formato inválido.",
            "AI_INVALID_RESPONSE",
          );
        }

        const choice = parsedResponse.data.choices[0];

        if (choice.finish_reason && choice.finish_reason !== "stop") {
          throw new OpenRouterError(
            "O provedor de IA não concluiu a resposta.",
            "AI_INVALID_RESPONSE",
            { finishReason: choice.finish_reason },
          );
        }

        const content = choice.message.content?.trim();

        if (!content) {
          throw new OpenRouterError(
            "O provedor de IA retornou uma resposta vazia.",
            "AI_INVALID_RESPONSE",
          );
        }

        return {
          content,
          model: parsedResponse.data.model,
          usage: parsedResponse.data.usage
            ? {
                completionTokens: parsedResponse.data.usage.completion_tokens,
                promptTokens: parsedResponse.data.usage.prompt_tokens,
                totalTokens: parsedResponse.data.usage.total_tokens,
              }
            : undefined,
        };
      } catch (error) {
        if (error instanceof OpenRouterError) {
          throw error;
        }

        if (abortController.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
          throw new OpenRouterError(
            "A solicitação à IA excedeu o tempo limite.",
            "AI_TIMEOUT",
          );
        }

        if (error instanceof SyntaxError) {
          throw new OpenRouterError(
            "O provedor de IA retornou uma resposta em formato inválido.",
            "AI_INVALID_RESPONSE",
          );
        }

        throw new OpenRouterError(
          "Não foi possível conectar ao provedor de IA.",
          "AI_PROVIDER_ERROR",
        );
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

export function getOpenRouterClient() {
  if (!env.OPENROUTER_API_KEY || !env.OPENROUTER_MODEL) {
    throw new OpenRouterError(
      "A integração de IA não está configurada.",
      "AI_CONFIGURATION_ERROR",
    );
  }

  return createOpenRouterClient({
    apiKey: env.OPENROUTER_API_KEY,
    model: env.OPENROUTER_MODEL,
  });
}
