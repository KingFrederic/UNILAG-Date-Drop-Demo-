import type { AssistantContext } from "@/lib/ai/context";
import {
  hasNvidiaKey,
  money,
  nvidiaChat,
  nvidiaModel,
  sseToText,
} from "@/lib/ai/nvidia";

/**
 * Server-side proxy to NVIDIA NIM for the conversational assistant.
 *
 * The API key is read from the environment and never reaches the browser.
 * If no key is configured the route says so plainly and the UI falls back to
 * its local simulation, so a deployment without the secret still works.
 */

export const runtime = "nodejs";
// The upstream call must not be cached or statically evaluated at build time.
export const dynamic = "force-dynamic";

function systemPrompt(ctx: AssistantContext) {
  return [
    "You are the built-in assistant for Path to Wealth, a personal wealth dashboard.",
    "You are advising Duke Fred on building income streams toward financial independence.",
    "",
    "Live figures from his dashboard right now:",
    `- Combined run-rate across all streams: ${money(ctx.runRate)} per month`,
    `- Realised monthly income: ${money(ctx.realisedIncome)}`,
    `- Net worth: ${money(ctx.netWorth)}`,
    ctx.topStream
      ? `- Largest stream: ${ctx.topStream.title} at ${money(ctx.topStream.monthly)}/mo`
      : "",
    ctx.weakestStream
      ? `- Smallest earning stream: ${ctx.weakestStream.title} at ${money(ctx.weakestStream.monthly)}/mo`
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
  const live = hasNvidiaKey();
  return Response.json(
    { live, model: live ? nvidiaModel() : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
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

  const result = await nvidiaChat(
    [
      { role: "system", content: systemPrompt(context) },
      { role: "user", content: prompt.slice(0, 2000) },
    ],
    { stream: true, maxTokens: 400 },
  );

  if (!result.ok) {
    // 503 (not_configured) is the signal the client uses to fall back.
    return Response.json(
      { error: result.error, detail: result.detail },
      { status: result.status },
    );
  }

  if (!result.response.body) {
    return Response.json({ error: "empty_upstream_body" }, { status: 502 });
  }

  return new Response(sseToText(result.response.body), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Assistant-Model": nvidiaModel(),
    },
  });
}
