import type { AssistantContext, AssistantProvider } from "./context";

export type { AssistantContext, AssistantProvider };

const currency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

/* ----------------------------- simulation ------------------------------ */

function composeReply(prompt: string, ctx: AssistantContext): string {
  const q = prompt.toLowerCase();

  if (/(stream|income|revenue|earn)/.test(q)) {
    const top = ctx.topStream;
    const weak = ctx.weakestStream;
    return [
      `Across ten streams you're running at ${currency(ctx.runRate)} a month.`,
      top
        ? `${top.title} is carrying the most at ${currency(top.monthly)} — that's ${Math.round((top.monthly / Math.max(ctx.runRate, 1)) * 100)}% of the total, which is more concentration than it looks.`
        : "",
      weak
        ? `${weak.title} is the one to either fund properly or cut; half-running it is the expensive option.`
        : "",
      "If you want resilience, the next move is a second stream at the same scale as your largest, not five more small ones.",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (/(goal|target|net worth|freedom|retire)/.test(q)) {
    return [
      `Realised income sits at ${currency(ctx.realisedIncome)} and net worth at ${currency(ctx.netWorth)}.`,
      "The gap between your run-rate and your realised figure is the whole game — that's revenue you've built but haven't yet converted into take-home.",
      "Closing it is usually a margin and collection problem, not a growth problem. I'd look there before launching anything new.",
    ].join(" ");
  }

  if (/(agent|automat|delegate)/.test(q)) {
    return [
      `You have ${ctx.activeAgents} agents active.`,
      "The honest read: agents compound only where the process is already written down. Where it isn't, they generate work rather than remove it.",
      "Pick the one process you repeat weekly, document it once, and point an agent at that.",
    ].join(" ");
  }

  if (/(idea|next|start|build|launch)/.test(q)) {
    return [
      `There are ${ctx.ideaCount} ideas on the board, which is more than anyone can act on.`,
      "The filter I'd use: which one reaches its first pound fastest using a skill you already have? Everything else is a bet on learning speed.",
      "Commit to one for ninety days and let the rest sit.",
    ].join(" ");
  }

  return [
    `Here's where things stand: ${currency(ctx.runRate)} monthly run-rate across your streams, ${currency(ctx.realisedIncome)} realised, and ${ctx.activeAgents} agents running.`,
    "Ask me about a specific stream, a goal, or what to build next and I'll give you a straighter answer.",
  ].join(" ");
}

/** Splits on whitespace but keeps it, so the stream reproduces the text exactly. */
function tokenise(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [text];
}

class SimulatedProvider implements AssistantProvider {
  async *stream(prompt: string, context: AssistantContext) {
    const reply = composeReply(prompt, context);
    // A short lead-in before the first token reads as "thinking".
    await new Promise((resolve) => setTimeout(resolve, 320));
    for (const token of tokenise(reply)) {
      await new Promise((resolve) => setTimeout(resolve, 14 + Math.random() * 26));
      yield token;
    }
  }
}

export const simulatedAssistant: AssistantProvider = new SimulatedProvider();

/* -------------------------------- live --------------------------------- */

/**
 * Calls the model through /api/assistant, which holds the credential
 * server-side. Falls back to the simulation when no key is configured (503),
 * when the upstream is unreachable, or when the response arrives empty — so
 * the assistant always answers rather than surfacing an error.
 *
 * Fallback only happens if nothing was emitted yet. A stream that fails
 * part-way keeps what it produced instead of replaying a different answer.
 */
let lastReplyLive = false;

/**
 * Whether the most recent reply actually came from the model. A configured
 * key that cannot reach the upstream would otherwise leave the UI claiming
 * "Live" while quietly serving the simulation — which hides a broken key.
 */
export function wasLastReplyLive() {
  return lastReplyLive;
}

class HybridProvider implements AssistantProvider {
  async *stream(prompt: string, context: AssistantContext) {
    let emitted = false;

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          if (text) {
            emitted = true;
            yield text;
          }
        }

        const tail = decoder.decode();
        if (tail) {
          emitted = true;
          yield tail;
        }
      }
    } catch {
      // Network failure — fall through to the simulation below.
    }

    lastReplyLive = emitted;

    if (!emitted) {
      yield* simulatedAssistant.stream(prompt, context);
    }
  }
}

export const assistant: AssistantProvider = new HybridProvider();

/** Whether a live model is configured, for labelling the UI honestly. */
export async function getAssistantMode(): Promise<{
  live: boolean;
  model: string | null;
}> {
  try {
    const response = await fetch("/api/assistant", { cache: "no-store" });
    if (!response.ok) return { live: false, model: null };
    return await response.json();
  } catch {
    return { live: false, model: null };
  }
}
