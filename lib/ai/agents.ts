import type { AssistantContext } from "./context";

export interface AgentReport {
  finding: string;
  /** True when the line came from the model rather than the fallback. */
  live: boolean;
}

/**
 * Per-agent fallback lines, used when no key is configured or the upstream
 * fails. Scoped to each agent's specialism so the panel still reads as six
 * distinct operators rather than one generic ticker.
 */
const FALLBACKS: Record<string, string[]> = {
  "market-researcher": [
    "Scanned 41 niches; three show demand with thin competition",
    "Automation for trades looks underserved this quarter",
    "Competitor pricing drifted up 8% — room to reposition",
  ],
  "content-creator": [
    "Drafted 12 hooks for the next YouTube batch",
    "Short-form retention peaks at 7 seconds — front-load the payoff",
    "Repurposed one long video into nine clips",
  ],
  "business-strategist": [
    "Rebuilt the offer ladder; middle tier was doing no work",
    "Two streams share a single failure point — worth splitting",
    "Recommend pausing the weakest stream rather than half-funding it",
  ],
  "seo-writer": [
    "Published 4 cluster articles; impressions expected in ~11 days",
    "Found 60 low-difficulty keywords with commercial intent",
    "Internal linking gap is capping three ranking pages",
  ],
  "automation-engineer": [
    "Wired fulfilment to Shopify; removed 4 manual steps",
    "Nightly reconciliation now runs without supervision",
    "Two workflows still need a human — both are documentable",
  ],
  "financial-analyst": [
    "Ad spend up 14% — capping the TikTok budget this week",
    "Largest stream is 22% of run-rate; concentration worth watching",
    "Margin is healthy but cash conversion lags by 30 days",
  ],
};

function fallbackFor(id: string, seed: number) {
  const lines = FALLBACKS[id];
  if (!lines || lines.length === 0) return "Standing by for the next run";
  return lines[seed % lines.length] ?? lines[0]!;
}

/**
 * Runs one agent. Falls back to a scoped scripted line when no key is
 * configured (503) or the upstream fails, so the panel always reports
 * something — and the caller can tell which happened via `live`.
 */
export async function runAgent(
  agent: { id: string; name: string; role: string },
  context: AssistantContext,
  seed = 0,
): Promise<AgentReport> {
  try {
    const response = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: agent.id,
        name: agent.name,
        role: agent.role,
        context,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (typeof data?.finding === "string" && data.finding.trim()) {
        return { finding: data.finding.trim(), live: true };
      }
    }
  } catch {
    // Network failure — fall through to the scripted line.
  }

  return { finding: fallbackFor(agent.id, seed), live: false };
}

/** Whether a live model is configured for the agents. */
export async function getAgentMode(): Promise<{
  live: boolean;
  model: string | null;
}> {
  try {
    const response = await fetch("/api/agents", { cache: "no-store" });
    if (!response.ok) return { live: false, model: null };
    return await response.json();
  } catch {
    return { live: false, model: null };
  }
}
