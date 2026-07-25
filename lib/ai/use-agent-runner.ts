"use client";

import * as React from "react";
import { useWealthStore } from "@/store/useWealthStore";
import { getAgentMode, runAgent, type AgentReport } from "./agents";
import { useAssistantContext } from "./use-assistant-context";
import type { Agent } from "@/types";

/**
 * Shared agent execution: tracks which agents are mid-run, writes findings
 * back to the store, and reports whether a live model is configured.
 *
 * Used by both the dashboard widget and the agents page so a run started in
 * one is reflected in the other.
 */
export function useAgentRunner() {
  const agents = useWealthStore((s) => s.agents);
  const reportAgent = useWealthStore((s) => s.reportAgent);
  const context = useAssistantContext();

  const [mode, setMode] = React.useState<{
    /** A key is configured on the server. */
    live: boolean;
    model: string | null;
    /** Key configured, but the last run fell back to a scripted line. */
    degraded: boolean;
  }>({ live: false, model: null, degraded: false });
  const [runningIds, setRunningIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    let cancelled = false;
    void getAgentMode().then((next) => {
      if (!cancelled) setMode({ ...next, degraded: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const markRunning = React.useCallback((id: string, running: boolean) => {
    setRunningIds((prev) => {
      const next = new Set(prev);
      if (running) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const run = React.useCallback(
    async (agent: Agent, seed = 0): Promise<AgentReport | null> => {
      if (agent.status !== "Active") return null;
      markRunning(agent.id, true);
      try {
        const report = await runAgent(agent, context, seed);
        reportAgent(agent.id, report.finding, report.live);
        // A configured key that still falls back means the model is
        // unreachable — say that rather than keep advertising it as live.
        setMode((prev) =>
          prev.live ? { ...prev, degraded: !report.live } : prev,
        );
        return report;
      } finally {
        markRunning(agent.id, false);
      }
    },
    [context, reportAgent, markRunning],
  );

  const runAll = React.useCallback(async () => {
    const active = agents.filter((agent) => agent.status === "Active");
    // Sequential rather than parallel: six concurrent completions is a burst
    // of upstream load for no perceptible gain, and staggering them reads
    // better in the UI.
    for (const [index, agent] of active.entries()) {
      await run(agent, index);
    }
  }, [agents, run]);

  return { mode, runningIds, run, runAll };
}
