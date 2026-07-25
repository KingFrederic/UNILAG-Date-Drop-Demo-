"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bot, Loader2, Play } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useWealthStore, selectActiveAgents } from "@/store/useWealthStore";
import { useUIStore } from "@/store/useUIStore";
import { useAgentRunner } from "@/lib/ai/use-agent-runner";
import { relativeTime } from "@/lib/format";
import { riseChild, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function AgentsPage() {
  const agents = useWealthStore((s) => s.agents);
  const toggleAgent = useWealthStore((s) => s.toggleAgent);
  const activeCount = useWealthStore(selectActiveAgents);
  const setAssistantOpen = useUIStore((s) => s.setAssistantOpen);
  const { mode, runningIds, run, runAll } = useAgentRunner();

  const busy = runningIds.size > 0;

  return (
    <motion.div variants={staggerParent} initial="hidden" animate="show">
      <PageHeader
        title="AI Agents"
        description="Six operators running the parts of the business that are already written down. Agents compound process, not chaos."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              onClick={() => void runAll()}
              disabled={busy}
            >
              {busy ? <Loader2 className="animate-spin" /> : <Play />}
              {busy ? "Running…" : "Run all agents"}
            </Button>
            <Button variant="outline" onClick={() => setAssistantOpen(true)}>
              <Bot />
              Brief the assistant
            </Button>
          </div>
        }
      />

      <motion.div
        variants={riseChild}
        className="mb-6 flex flex-wrap items-center gap-2 px-1 text-[13px] text-[var(--fg-muted)]"
      >
        <span>
          <span className="font-medium text-[var(--fg)]">
            {activeCount} of {agents.length}
          </span>{" "}
          active.
        </span>
        <Badge
          tone={!mode.live ? "neutral" : mode.degraded ? "danger" : "success"}
        >
          {!mode.live
            ? "Simulated"
            : mode.degraded
              ? "Model unreachable"
              : `Live · ${mode.model?.split("/").pop() ?? "model"}`}
        </Badge>
        <span className="text-[var(--fg-faint)]">
          {!mode.live
            ? "Set NVIDIA_API_KEY to have agents reason over your live figures."
            : mode.degraded
              ? "Key is configured but the model could not be reached — showing scripted findings."
              : "Findings are generated against your live figures."}
        </span>
      </motion.div>

      <div className="grid gap-4 pb-6 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent, index) => {
          const active = agent.status === "Active";
          const running = runningIds.has(agent.id);

          return (
            <motion.div key={agent.id} variants={riseChild}>
              <GlassPanel lift className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "grid size-11 place-items-center rounded-2xl transition-colors",
                      active
                        ? "bg-gold/12 text-gold"
                        : "bg-black/5 text-[var(--fg-faint)] dark:bg-white/8",
                    )}
                  >
                    <Bot className="size-5" />
                  </span>
                  <Badge tone={active ? "success" : "neutral"}>
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        running
                          ? "bg-gold"
                          : active
                            ? "animate-pulse-dot bg-success text-success"
                            : "bg-[var(--fg-faint)]",
                      )}
                    />
                    {running ? "Working" : active ? "Active" : "Paused"}
                  </Badge>
                </div>

                <h2 className="mt-4 text-[15px] font-semibold">{agent.name}</h2>
                <p className="mt-1 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                  {agent.role}
                </p>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                      Load
                    </span>
                    <span className="tabular text-[12px] text-[var(--fg-muted)]">
                      {active ? `${agent.load}%` : "idle"}
                    </span>
                  </div>
                  <Progress
                    value={active ? agent.load : 0}
                    accent={agent.load > 85 ? "danger" : "gold"}
                    label={`${agent.name} load`}
                    shimmer={active}
                  />
                </div>

                <div className="mt-4 flex-1 border-t border-[var(--hairline)] pt-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                      Latest finding
                    </span>
                    {agent.lastActionLive ? (
                      <span className="text-[9px] uppercase tracking-wider text-success">
                        live
                      </span>
                    ) : null}
                    {agent.lastRunAt ? (
                      <span className="ml-auto text-[10px] text-[var(--fg-faint)]">
                        {relativeTime(agent.lastRunAt)}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[12px] leading-snug text-[var(--fg-muted)]">
                    {running ? "Working…" : agent.lastAction}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void run(agent, index)}
                    disabled={!active || running}
                    className="flex-1"
                  >
                    {running ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Play />
                    )}
                    Run
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAgent(agent.id)}
                    className="flex-1"
                  >
                    {active ? "Pause" : "Resume"}
                  </Button>
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
