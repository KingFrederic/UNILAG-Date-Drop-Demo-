import type { AssistantContext } from "@/lib/ai/context";

/**
 * Server-side proxy to NVIDIA NIM.
 *
 * The API key is read from the environment and never reaches the browser —
 * this route exists so the model can be called without shipping a credential
 * to the client. If no key is configured the route reports that plainly and
 * the UI falls back to its local simulation, so a deployment without the
 * secret still works rather than showing an error.
 */

export const runtime = "nodejs";
// The upstream call must not be cached or statically evaluated at build time.
export const dynamic = "force-dynamic";

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_MODEL = "meta/llama-3.3-70b-instruct";

function model() {
  return process.env.NVIDIA_MODEL?.trim() || DEFAULT_MODEL;
}

const gbp = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

function systemPrompt(ctx: AssistantContext) {
  return [
    "You are the built-in assistant for Path to Wealth, a personal wealth dashboard.",
    "You are advising Duke Fred on building income streams toward financial independence.",
    "",
    "Live figures from his dashboard right now:",
    `- Combined run-rate across all streams: ${gbp(ctx.runRate)} per month`,
    `- Realised monthly income: ${gbp(ctx.realisedIncome)}`,
    `- Net worth: ${gbp(ctx.netWorth)}`,
    ctx.topStream
      ? `- Largest stream: ${ctx.topStream.title} at ${gbp(ctx.topStream.monthly)}/mo`
      : "",
    ctx.weakestStream
      ? `- Smallest earning stream: ${ctx.weakestStream.title} at ${gbp(ctx.weakestStream.monthly)}/mo`
      : "",
    `- Agents currently active: ${ctx.activeAgents}`,
    `- Ideas on the board: ${ctx.ideaCount}`,
    "",
    "How to answer:",
    "- Be direct and specific. Reference his actual numbers rather than generalities.",
    "- Give one clear recommendation, not a list of options.",
    "- Say when something is a risk. Concentration in a single stream is worth naming.",
    "- Use pounds sterling. Keep it under 130 words. Prose, not bullet points.",
    "- No preamble, no 'great question', no restating the question back.",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Reports whether a live model is configured, so the UI can label itself honestly. */
export function GET() {
  const live = Boolean(process.env.NVIDIA_API_KEY);
  return Response.json(
    { live, model: live ? model() : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Converts the upstream OpenAI-style SSE stream into plain text deltas, so the
 * client can append chunks directly without parsing events itself.
 */
function sseToText(upstream: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return upstream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });

        // SSE events are separated by a blank line; keep any partial tail.
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          for (const line of event.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const parsed = JSON.parse(payload);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              // A malformed chunk should not tear down an otherwise good stream.
            }
          }
        }
      },
    }),
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    // 503 is the signal the client uses to fall back to the simulation.
    return Response.json(
      { error: "not_configured", detail: "NVIDIA_API_KEY is not set." },
      { status: 503 },
    );
  }

  let prompt: unknown;
  let context: AssistantContext;
  try {
    const body = await request.json();
    prompt = body?.prompt;
    context = body?.context;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return Response.json({ error: "empty_prompt" }, { status: 400 });
  }
  if (!context || typeof context !== "object") {
    return Response.json({ error: "missing_context" }, { status: 400 });
  }

  // Don't let a hung upstream hold the connection open indefinitely.
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 30_000);

  let upstream: Response;
  try {
    upstream = await fetch(NVIDIA_URL, {
      method: "POST",
      signal: abort.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model: model(),
        messages: [
          { role: "system", content: systemPrompt(context) },
          { role: "user", content: prompt.slice(0, 2000) },
        ],
        temperature: 0.6,
        top_p: 0.9,
        max_tokens: 400,
        stream: true,
      }),
    });
  } catch (error) {
    clearTimeout(timeout);
    const reason = error instanceof Error ? error.message : "unknown";
    return Response.json({ error: "upstream_unreachable", detail: reason }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    clearTimeout(timeout);
    // Surface the upstream status, but never echo the key or full headers back.
    const detail = await upstream.text().catch(() => "");
    return Response.json(
      { error: "upstream_error", status: upstream.status, detail: detail.slice(0, 400) },
      { status: 502 },
    );
  }

  const stream = sseToText(upstream.body);
  // The timer is cleared once the response is handed off; the abort signal
  // still guards the initial connection.
  clearTimeout(timeout);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Assistant-Model": model(),
    },
  });
}
