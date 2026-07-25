"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  useWealthStore,
  selectActiveAgents,
  selectActiveStreams,
  selectRunRate,
} from "@/store/useWealthStore";
import { currency, currencyCompact } from "@/lib/format";
import { riseChild, staggerParent } from "@/lib/motion";

const plain = (value: number) => String(Math.round(value));

export function StatStrip() {
  const runRate = useWealthStore(selectRunRate);
  const activeStreams = useWealthStore(selectActiveStreams);
  const activeAgents = useWealthStore(selectActiveAgents);
  const goals = useWealthStore((s) => s.goals);
  const netWorth = goals.find((goal) => goal.id === "net-worth")?.current ?? 0;

  const stats = [
    {
      label: "Combined run-rate",
      value: runRate,
      format: currency,
      hint: "across every stream",
    },
    {
      label: "Net worth",
      value: netWorth,
      format: currencyCompact,
      hint: "assets less liabilities",
    },
    {
      label: "Earning streams",
      value: activeStreams,
      format: plain,
      hint: "of 10 built",
    },
    {
      label: "Agents running",
      value: activeAgents,
      format: plain,
      hint: "working right now",
    },
  ];

  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={riseChild}>
          <GlassPanel lift className="h-full rounded-[var(--radius-panel)] p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
              {stat.label}
            </p>
            <p className="tabular mt-2 text-2xl font-semibold sm:text-[28px]">
              <AnimatedNumber value={stat.value} format={stat.format} />
            </p>
            <p className="mt-1 text-[11px] text-[var(--fg-faint)]">{stat.hint}</p>
          </GlassPanel>
        </motion.div>
      ))}
    </motion.div>
  );
}
