/**
 * Assistant provider contract.
 *
 * The shipped implementation is a local simulation — no API key, no network,
 * no cost. It is written against this interface so a real model can replace
 * it by swapping the export below for a route-handler-backed client, without
 * the UI changing at all.
 */
export interface AssistantContext {
  runRate: number;
  realisedIncome: number;
  netWorth: number;
  topStream: { title: string; monthly: number } | null;
  weakestStream: { title: string; monthly: number } | null;
  activeAgents: number;
  ideaCount: number;
}

export interface AssistantProvider {
  /** Yields the reply in chunks so the UI can render it as it arrives. */
  stream(prompt: string, context: AssistantContext): AsyncGenerator<string>;
}

const currency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

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

export const assistant: AssistantProvider = new SimulatedProvider();
