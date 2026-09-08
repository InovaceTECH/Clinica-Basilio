import assert from "node:assert/strict";
import { mock } from "node:test";

import { env } from "../src/lib/env";
import {
  createOpenRouterClient,
  OpenRouterError,
} from "../src/services/ai/openrouter";
import { opportunityAnalysisResponseFormat } from "../src/services/ai/schemas/opportunity-analysis-schema";

async function checkOpenRouter() {
  let request: Request | undefined;
  const client = createOpenRouterClient({
    apiKey: "test-key",
    model: "openai/gpt-4.1-mini",
    fetchFn: async (input, init) => {
      request = new Request(input, init);
      return Response.json({
        choices: [{ message: { content: "Resposta controlada" } }],
        model: "openai/gpt-4.1-mini",
        usage: {
          completion_tokens: 5,
          prompt_tokens: 4,
          total_tokens: 9,
        },
      });
    },
  });

  const completion = await client.complete({
    maxTokens: 2_000,
    responseFormat: opportunityAnalysisResponseFormat,
    messages: [
      { role: "system", content: "Você é um assistente comercial." },
      { role: "user", content: "Teste controlado." },
    ],
  });

  assert.equal(request?.url, "https://openrouter.ai/api/v1/chat/completions");
  assert.equal(request?.method, "POST");
  assert.equal(request?.headers.get("Authorization"), "Bearer test-key");
  const body = await request?.json();
  assert.equal(body.model, "openai/gpt-4.1-mini");
  assert.equal(body.max_tokens, 2_000);
  assert.deepEqual(body.response_format, opportunityAnalysisResponseFormat);
  assert.deepEqual(body.provider, { require_parameters: true });
  assert.deepEqual(completion, {
    content: "Resposta controlada",
    model: "openai/gpt-4.1-mini",
    usage: { completionTokens: 5, promptTokens: 4, totalTokens: 9 },
  });

  const invalidResponseClient = createOpenRouterClient({
    apiKey: "test-key",
    model: "openai/gpt-4.1-mini",
    fetchFn: async () => Response.json({ choices: [] }),
  });

  await assert.rejects(
    invalidResponseClient.complete({ messages: [{ role: "user", content: "Teste." }] }),
    (error: unknown) => error instanceof OpenRouterError && error.code === "AI_INVALID_RESPONSE",
  );

  const input = { messages: [{ role: "user" as const, content: "Teste." }] };
  const validPayload = {
    choices: [{ finish_reason: "stop", message: { content: "Resposta controlada" } }],
    model: "test-model",
  };

  for (const [status, code] of [
    [401, "AI_CONFIGURATION_ERROR"],
    [402, "AI_CONFIGURATION_ERROR"],
    [403, "AI_CONFIGURATION_ERROR"],
    [404, "AI_CONFIGURATION_ERROR"],
    [429, "AI_RATE_LIMIT"],
    [502, "AI_PROVIDER_ERROR"],
    [503, "AI_PROVIDER_ERROR"],
  ] as const) {
    const errorClient = createOpenRouterClient({
      apiKey: "test-key",
      model: "test-model",
      fetchFn: async () => Response.json({ error: { message: "private-provider-detail" } }, { status }),
    });
    await assert.rejects(errorClient.complete(input), (error: unknown) => {
      assert(error instanceof OpenRouterError);
      assert.equal(error.code, code);
      assert.equal(error.details.providerStatus, status);
      assert(!error.message.includes("private-provider-detail"));
      assert(!JSON.stringify(error).includes("test-key"));
      return true;
    });
  }

  for (const response of [
    new Response("<html>Invalid upstream body</html>"),
    Response.json({ ...validPayload, choices: [{ message: { content: null } }] }),
    Response.json({ ...validPayload, choices: [{ message: { content: "   " } }] }),
    Response.json({ ...validPayload, choices: [{ finish_reason: "length", message: { content: "{}" } }] }),
  ]) {
    const invalidClient = createOpenRouterClient({
      apiKey: "test-key",
      model: "test-model",
      fetchFn: async () => response,
    });
    await assert.rejects(invalidClient.complete(input),
      (error: unknown) => error instanceof OpenRouterError && error.code === "AI_INVALID_RESPONSE");
  }

  const embeddedErrorClient = createOpenRouterClient({
    apiKey: "test-key",
    model: "test-model",
    fetchFn: async () => Response.json({ error: { code: 429, message: "private-provider-detail" } }),
  });
  await assert.rejects(embeddedErrorClient.complete(input),
    (error: unknown) => error instanceof OpenRouterError && error.code === "AI_RATE_LIMIT");

  const networkErrorClient = createOpenRouterClient({
    apiKey: "test-key",
    model: "test-model",
    fetchFn: async () => { throw new TypeError("private-network-detail"); },
  });
  await assert.rejects(networkErrorClient.complete(input),
    (error: unknown) => error instanceof OpenRouterError && error.code === "AI_PROVIDER_ERROR");

  mock.timers.enable({ apis: ["setTimeout"] });
  try {
    let signal: AbortSignal | null | undefined;
    let resolveResponse!: (response: Response) => void;
    const delayedClient = createOpenRouterClient({
      apiKey: "test-key",
      model: "test-model",
      fetchFn: async (_input, init) => new Promise<Response>((resolve, reject) => {
        resolveResponse = resolve;
        signal = init?.signal;
        signal?.addEventListener("abort", () => reject(signal?.reason), { once: true });
      }),
    });
    const delayedCompletion = delayedClient.complete(input);
    // No padrão de 60s, uma resposta após 16s ainda deve ser aceita.
    mock.timers.tick(Math.min(16_000, env.OPENROUTER_TIMEOUT_MS - 1));
    assert.equal(signal?.aborted, false);
    resolveResponse(Response.json(validPayload));
    assert.equal((await delayedCompletion).content, "Resposta controlada");
    mock.timers.tick(env.OPENROUTER_TIMEOUT_MS);
    assert.equal(signal?.aborted, false, "O timer deve ser limpo após sucesso.");

    const timedOutCompletion = delayedClient.complete(input);
    const timeoutAssertion = assert.rejects(timedOutCompletion,
      (error: unknown) => error instanceof OpenRouterError && error.code === "AI_TIMEOUT");
    mock.timers.tick(env.OPENROUTER_TIMEOUT_MS);
    await timeoutAssertion;

    // O timeout também deve cobrir a leitura do corpo, mesmo após os headers.
    const slowBodyClient = createOpenRouterClient({
      apiKey: "test-key",
      model: "test-model",
      timeoutMs: 50,
      fetchFn: async (_input, init) => new Response(new ReadableStream({
        start(controller) {
          init?.signal?.addEventListener("abort", () => controller.error(init.signal?.reason), { once: true });
        },
      })),
    });
    const slowBodyAssertion = assert.rejects(slowBodyClient.complete(input),
      (error: unknown) => error instanceof OpenRouterError && error.code === "AI_TIMEOUT");
    await Promise.resolve();
    mock.timers.tick(50);
    await slowBodyAssertion;
  } finally {
    mock.timers.reset();
  }

  console.log("OpenRouter validado: structured output, resposta após 16s, timeouts, limites, falhas e privacidade.");
}

void checkOpenRouter();
