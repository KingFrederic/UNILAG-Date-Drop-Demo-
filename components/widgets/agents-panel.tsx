"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Play } from "lucide-react";
import { WidgetShell } from "./widget-shell";
import { useWealthStore, selectActiveAgents } from "@/store/useWealthStore";
import { useUIStore } from "@/store/useUIStore";
import { useAgentRunner } from "@/lib/ai/use-agent-runner";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Agent } from "@/types";

function AgentRow({
  agent,
  index,
  onRun,
  running,
}: {
  agent: Agent;
  index: number;
  onRun: (agent: Agent, seed: number) => void;
  running: boolean;
}) {
  const toggleAgent = useWealthStore((s) => s.toggleAgent);
  const active = agent.status === "Active";

  return (
    <motion.li layout transition={spring.soft}>
      <div className="group/agent flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-white/6 px-3 py-2.5 transition-colors hover:bg-white/10 dark:bg-white/4 dark:hover:bg-white/7">
        <button
          type="button"
          onClick={() => toggleAgent(agent.id)}
          aria-pressed={active}
          aria-label={`${agent.name}, ${active ? "active" : "paused"}. Toggle.`}
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
            active
              ? "bg-gold/12 text-gold"
              : "bg-black/5 text-[var(--fg-faint)] dark:bg-white/8",
          )}
        >
          <Bot className="size-[17px]" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{agent.name}</p>
          <div className="h-4 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={running ? "running" : agent.lastAction}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="truncate text-[11px] text-[var(--fg-faint)]"
              >
                {running ? "Working…" : agent.lastAction}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRun(agent, index)}
          disabled={running || !active}
          aria-label={`Run ${agent.name}`}
          className="grid size-7 shrink-0 place-items-center rounded-full text-[var(--fg-faint)] opacity-0 transition-all hover:bg-white/10 hover:text-[var(--fg)] focus-visible:opacity-100 disabled:opacity-30 group-hover/agent:opacity-100"
        >
          {running ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Play className="size-3.5" />
          )}
        </button>

        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            running
              ? "bg-gold"
              : active
                ? "animate-pulse-dot bg-success text-success"
                : "bg-[var(--fg-faint)]",
          )}
        />
      </div>
    </motion.li>
  );
}

export function AgentsPanel({ handle }: { handle?: React.ReactNode }) {
  const agents = useWealthStore((s) => s.agents);
  const activeCount = useWealthStore(selectActiveAgents);
  const pushNotification = useUIStore((s) => s.pushNotification);
  const { mode, runningIds, run, runAll } = useAgentRunner();

  const handleRun = React.useCallback(
    async (agent: Agent, seed: number) => {
      const report = await run(agent, seed);
      if (report) {
        pushNotification({
          title: `${agent.name} reported`,
          body: report.finding,
          tone: report.live ? "success" : "info",
        });
      }
    },
    [run, pushNotification],
  );

  const busy = runningIds.size > 0;

  return (
    <WidgetShell
      title="AI Agents"
      caption={
        !mode.live
          ? `${activeCount} of ${agents.length} running · simulated`
          : mode.degraded
            ? `${activeCount} of ${agents.length} running · model unreachable`
            : `${activeCount} of ${agents.length} running · powered by ${mode.model?.split("/").pop() ?? "the model"}`
      }
      handle={handle}
      action={
        <button
          type="button"
          onClick={() => void runAll()}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--fg-muted)] transition-colors hover:bg-white/10 hover:text-[var(--fg)] disabled:opacity-40"
        >
          {busy ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Play className="size-3" />
          )}
          Run all
        </button>
      }
    >
      <ul className="space-y-1.5">
        {agents.map((agent, index) => (
          <AgentRow
            key={agent.id}
            agent={agent}
            index={index}
            onRun={handleRun}
            running={runningIds.has(agent.id)}
          />
        ))}
      </ul>
    </WidgetShell>
  );
}
