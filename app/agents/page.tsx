"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useWealthStore, selectActiveAgents } from "@/store/useWealthStore";
import { useUIStore } from "@/store/useUIStore";
import { riseChild, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function AgentsPage() {
  const agents = useWealthStore((s) => s.agents);
  const toggleAgent = useWealthStore((s) => s.toggleAgent);
  const activeCount = useWealthStore(selectActiveAgents);
  const setAssistantOpen = useUIStore((s) => s.setAssistantOpen);

  return (
    <motion.div variants={staggerParent} initial="hidden" animate="show">
      <PageHeader
        title="AI Agents"
        description="Six operators running the parts of the business that are already written down. Agents compound process, not chaos."
        action={
          <Button variant="primary" onClick={() => setAssistantOpen(true)}>
            <Bot />
            Brief the assistant
          </Button>
        }
      />

      <motion.p
        variants={riseChild}
        className="mb-6 px-1 text-[13px] text-[var(--fg-muted)]"
      >
        <span className="font-medium text-[var(--fg)]">
          {activeCount} of {agents.length}
        </span>{" "}
        active. Pausing one is a scheduling decision, not a deletion.
      </motion.p>

      <div className="grid gap-4 pb-6 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => {
          const active = agent.status === "Active";
          return (
            <motion.div key={agent.id} variants={riseChild}>
              <GlassPanel lift className="h-full p-5">
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
                        active
                          ? "animate-pulse-dot bg-success text-success"
                          : "bg-[var(--fg-faint)]",
                      )}
                    />
                    {active ? "Active" : "Paused"}
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

                <p className="mt-4 border-t border-[var(--hairline)] pt-3 text-[11px] leading-snug text-[var(--fg-faint)]">
                  Last: {agent.lastAction}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAgent(agent.id)}
                  className="mt-4 w-full"
                >
                  {active ? "Pause agent" : "Resume agent"}
                </Button>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
