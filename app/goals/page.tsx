"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { GoalTracker } from "@/components/widgets/goal-tracker";
import { StatStrip } from "@/components/widgets/stat-strip";
import { RunRateChart } from "@/components/widgets/charts";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Roadmap } from "@/components/hero/roadmap";
import { useWealthStore, selectRunRate } from "@/store/useWealthStore";
import { currency } from "@/lib/format";
import { riseChild, staggerParent } from "@/lib/motion";
import { progressOf } from "@/lib/utils";

export default function GoalsPage() {
  const goals = useWealthStore((s) => s.goals);
  const roadmap = useWealthStore((s) => s.roadmap);
  const runRate = useWealthStore(selectRunRate);

  const income = goals.find((goal) => goal.id === "monthly-income");
  const gap = income ? Math.max(income.goal - income.current, 0) : 0;
  const monthsAtRunRate = runRate > 0 ? gap / runRate : 0;

  return (
    <motion.div variants={staggerParent} initial="hidden" animate="show">
      <PageHeader
        title="Goals"
        description="Three numbers decide whether work becomes optional. Everything else is a means to move them."
      />

      <div className="space-y-6 pb-6">
        <StatStrip />

        <motion.div variants={riseChild}>
          <GlassPanel className="p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-[15px] font-semibold">Journey</h2>
                <p className="mt-0.5 text-[12px] text-[var(--fg-faint)]">
                  {roadmap.filter((stage) => stage.complete).length} of{" "}
                  {roadmap.length} stages complete
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                  Income gap
                </p>
                <p className="tabular text-xl font-semibold">{currency(gap)}</p>
              </div>
            </div>

            {/* The roadmap is drawn for a dark hero, so it needs a dark bed
                to sit on when used on a light page. */}
            <div className="rounded-[var(--radius-panel)] bg-[#0d0b12]/85 p-6">
              <Roadmap stages={roadmap} />
            </div>

            <p className="mt-5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
              At the current combined run-rate of {currency(runRate)} a month,
              the remaining income gap represents roughly{" "}
              <span className="font-medium text-[var(--fg)]">
                {monthsAtRunRate < 1
                  ? "less than a month"
                  : `${monthsAtRunRate.toFixed(1)} months`}
              </span>{" "}
              of production — the work is converting that run-rate into realised
              take-home.
            </p>
          </GlassPanel>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <GoalTracker />
          <RunRateChart />
        </div>

        <motion.div variants={riseChild}>
          <GlassPanel className="p-6 sm:p-8">
            <h2 className="text-[15px] font-semibold">Progress detail</h2>
            <ul className="mt-5 space-y-5">
              {goals.map((goal) => {
                const pct = progressOf(goal.current, goal.goal);
                return (
                  <li key={goal.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-[14px] font-medium">{goal.title}</p>
                      <p className="tabular text-[13px] text-[var(--fg-muted)]">
                        {currency(goal.current)} of {currency(goal.goal)} ·{" "}
                        <span className="text-[var(--fg)]">
                          {pct.toFixed(1)}%
                        </span>
                      </p>
                    </div>
                    <p className="mt-1 text-[12px] text-[var(--fg-faint)]">
                      {currency(Math.max(goal.goal - goal.current, 0))} remaining
                      · {goal.cadence}
                    </p>
                  </li>
                );
              })}
            </ul>
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}
