"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { WidgetShell } from "./widget-shell";
import { useWealthStore, selectActiveAgents } from "@/store/useWealthStore";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Rotating status lines, so the panel reads as running rather than static. */
const TICKER = [
  "indexing competitor pricing",
  "drafting next week's hooks",
  "reconciling Stripe payouts",
  "testing a new landing headline",
  "clustering keyword opportunities",
  "auditing abandoned checkouts",
  "summarising 34 support threads",
  "rebalancing ad budgets",
];

function useTicker(seed: number, active: boolean) {
  const [index, setIndex] = React.useState(seed % TICKER.length);

  React.useEffect(() => {
    if (!active) return;
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % TICKER.length),
      // Stagger per agent so the panel doesn't flip in unison.
      5200 + seed * 900,
    );
    return () => window.clearInterval(id);
  }, [seed, active]);

  return TICKER[index] ?? TICKER[0]!;
}

function AgentRow({
  id,
  name,
  role,
  status,
  load,
  index,
}: {
  id: string;
  name: string;
  role: string;
  status: string;
  load: number;
  index: number;
}) {
  const toggleAgent = useWealthStore((s) => s.toggleAgent);
  const active = status === "Active";
  const line = useTicker(index, active);

  return (
    <motion.li layout transition={spring.soft}>
      <button
        type="button"
        onClick={() => toggleAgent(id)}
        aria-pressed={active}
        aria-label={`${name}, ${active ? "active" : "idle"}. Toggle.`}
        className="group/agent flex w-full items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-white/6 px-3 py-2.5 text-left transition-colors hover:bg-white/10 dark:bg-white/4 dark:hover:bg-white/7"
      >
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
            active
              ? "bg-gold/12 text-gold"
              : "bg-black/5 text-[var(--fg-faint)] dark:bg-white/8",
          )}
        >
          <Bot className="size-[17px]" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{name}</p>
          <div className="h-4 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active ? line : "idle"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="truncate text-[11px] text-[var(--fg-faint)]"
              >
                {active ? line : role}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Load meter: four bars, filled proportionally. */}
          <span className="hidden items-end gap-[2px] sm:flex" aria-hidden>
            {[0, 1, 2, 3].map((bar) => (
              <span
                key={bar}
                className={cn(
                  "w-[3px] rounded-full transition-colors",
                  bar === 0 && "h-1.5",
                  bar === 1 && "h-2.5",
                  bar === 2 && "h-3.5",
                  bar === 3 && "h-[18px]",
                  active && load > bar * 25
                    ? "bg-gold"
                    : "bg-[var(--track)]",
                )}
              />
            ))}
          </span>
          <span
            className={cn(
              "size-1.5 rounded-full",
              active
                ? "animate-pulse-dot bg-success text-success"
                : "bg-[var(--fg-faint)]",
            )}
          />
        </div>
      </button>
    </motion.li>
  );
}

export function AgentsPanel({ handle }: { handle?: React.ReactNode }) {
  const agents = useWealthStore((s) => s.agents);
  const activeCount = useWealthStore(selectActiveAgents);

  return (
    <WidgetShell
      title="AI Agents"
      caption={`${activeCount} of ${agents.length} running · tap to pause`}
      handle={handle}
    >
      <ul className="space-y-1.5">
        {agents.map((agent, index) => (
          <AgentRow
            key={agent.id}
            id={agent.id}
            name={agent.name}
            role={agent.role}
            status={agent.status}
            load={agent.load}
            index={index}
          />
        ))}
      </ul>
    </WidgetShell>
  );
}
