import type { AssistantContext } from "@/lib/ai/context";
import {
  hasNvidiaKey,
  money,
  nvidiaChat,
  nvidiaModel,
  readCompletion,
} from "@/lib/ai/nvidia";

/**
 * Runs a single agent against the live dashboard and returns one concrete
 * finding. Non-streaming: the output is a single short line, so streaming it
 * would add latency and complexity for no visible benefit.
 *
 * Same contract as the assistant route — the key stays server-side, and a
 * missing key returns 503 so the client can fall back to scripted output.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** What each agent is actually looking at, so findings differ by specialism. */
const BRIEFS: Record<string, string> = {
  "market-researcher":
    "You find demand before anything gets built. You look at niches, competitors and timing.",
  "content-creator":
    "You turn one idea into many pieces of content. You look at hooks, formats and distribution.",
  "business-strategist":
    "You pressure-test the plan. You look at offer, pricing, sequencing and what to stop doing.",
  "seo-writer":
    "You build compounding organic traffic. You look at keyword clusters, intent and publishing cadence.",
  "automation-engineer":
    "You remove the operator from the loop. You look at repeated manual steps and where they can be wired together.",
  "financial-analyst":
    "You watch margin rather than vanity revenue. You look at cost, concentration and cash conversion.",
};

function agentPrompt(name: string, role: string, id: string, ctx: AssistantContext) {
  return [
    `You are ${name}, an autonomous agent working inside Duke Fred's wealth dashboard.`,
    `Your remit: ${role}.`,
    BRIEFS[id] ?? "",
    "",
    "Current state of his operation:",
    `- Combined run-rate: ${money(ctx.runRate)}/month across his income streams`,
    `- Realised monthly income: ${money(ctx.realisedIncome)}`,
    `- Net worth: ${money(ctx.netWorth)}`,
    ctx.topStream
      ? `- Largest stream: ${ctx.topStream.title} at ${money(ctx.topStream.monthly)}/mo`
      : "",
    ctx.weakestStream
      ? `- Smallest earning stream: ${ctx.weakestStream.title} at ${money(ctx.weakestStream.monthly)}/mo`
      : "",
    `- ${ctx.activeAgents} agents active, ${ctx.ideaCount} ideas on the board`,
    "",
    "Report exactly one finding or action from your specialism, in your own lane.",
    "Rules: one sentence, under 14 words, present tense, concrete and specific.",
    "Reference a real number or stream name where it helps. No preamble, no quotes,",
    "no trailing full stop, no restating your job title.",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Trims model output down to the single short line the UI expects. */
function tidy(text: string) {
  const firstLine = text.split("\n").find((line) => line.trim().length > 0) ?? "";
  return firstLine
    .trim()
    .replace(/^["'`]|["'`]$/g, "")
    .replace(/\.$/, "")
    .slice(0, 120);
}

export function GET() {
  const live = hasNvidiaKey();
  return Response.json(
    { live, model: live ? nvidiaModel() : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  let id: unknown;
  let name: unknown;
  let role: unknown;
  let context: AssistantContext;

  try {
    const body = await request.json();
    id = body?.id;
    name = body?.name;
    role = body?.role;
    context = body?.context;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof id !== "string" || typeof name !== "string" || typeof role !== "string") {
    return Response.json({ error: "missing_agent" }, { status: 400 });
  }
  if (!context || typeof context !== "object") {
    return Response.json({ error: "missing_context" }, { status: 400 });
  }

  const result = await nvidiaChat(
    [
      { role: "system", content: agentPrompt(name, role, id, context) },
      { role: "user", content: "Report your current finding." },
    ],
    // Short output, slightly higher temperature so six agents don't converge
    // on the same phrasing.
    { maxTokens: 60, temperature: 0.85, timeoutMs: 20_000 },
  );

  if (!result.ok) {
    return Response.json(
      { error: result.error, detail: result.detail },
      { status: result.status },
    );
  }

  const finding = tidy(await readCompletion(result.response));
  if (!finding) {
    return Response.json({ error: "empty_completion" }, { status: 502 });
  }

  return Response.json(
    { id, finding, live: true, model: nvidiaModel() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
