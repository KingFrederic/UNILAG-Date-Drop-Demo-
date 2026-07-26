"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/widgets/sparkline";
import { RunRateChart, StreamMixChart } from "@/components/widgets/charts";
import { resolveIcon } from "@/components/icon-map";
import { useWealthStore, selectRunRate } from "@/store/useWealthStore";
import { currency } from "@/lib/format";
import { riseChild, spring, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { StreamStatus } from "@/types";

const STATUS_TONE: Record<StreamStatus, "neutral" | "gold" | "success" | "info"> =
  {
    Active: "success",
    Growing: "gold",
    Building: "info",
    Planning: "neutral",
    Passive: "neutral",
  };

type SortKey = "monthly" | "growth" | "name";

function growthOf(history: number[]) {
  const first = history.find((value) => value > 0) ?? 0;
  const last = history.at(-1) ?? 0;
  if (first === 0) return 0;
  return ((last - first) / first) * 100;
}

export default function IncomePage() {
  const streams = useWealthStore((s) => s.streams);
  const runRate = useWealthStore(selectRunRate);
  const updateStream = useWealthStore((s) => s.updateStream);
  const [sort, setSort] = React.useState<SortKey>("monthly");

  const sorted = React.useMemo(() => {
    const copy = streams.slice();
    if (sort === "monthly") return copy.sort((a, b) => b.monthly - a.monthly);
    if (sort === "growth")
      return copy.sort((a, b) => growthOf(b.history) - growthOf(a.history));
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  }, [streams, sort]);

  const sortOptions: Array<{ key: SortKey; label: string }> = [
    { key: "monthly", label: "Revenue" },
    { key: "growth", label: "Growth" },
    { key: "name", label: "Name" },
  ];

  return (
    <motion.div variants={staggerParent} initial="hidden" animate="show">
      <PageHeader
        title="Income"
        description="Ten streams, one run-rate. Concentration is the risk worth watching here, not the total."
        action={
          <div className="flex items-center gap-1 rounded-full border border-[var(--glass-border)] p-1">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                aria-pressed={sort === option.key}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
                  sort === option.key
                    ? "bg-gold text-[#241a06]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="space-y-6 pb-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <RunRateChart />
          <StreamMixChart />
        </div>

        <motion.div variants={riseChild}>
          <GlassPanel className="overflow-hidden">
            <div className="flex items-end justify-between gap-4 px-6 pb-4 pt-6">
              <div>
                <h2 className="text-[15px] font-semibold">All streams</h2>
                <p className="mt-0.5 text-[12px] text-[var(--fg-faint)]">
                  Adjust a monthly figure to see it flow through every total
                </p>
              </div>
              <p className="tabular text-[13px] text-[var(--fg-muted)]">
                {currency(runRate)}/mo
              </p>
            </div>

            <ul>
              {sorted.map((stream) => {
                const Icon = resolveIcon(stream.icon);
                const growth = growthOf(stream.history);
                const share = (stream.monthly / Math.max(runRate, 1)) * 100;

                return (
                  <motion.li
                    key={stream.id}
                    layout
                    transition={spring.soft}
                    className="flex flex-wrap items-center gap-4 border-t border-[var(--hairline)] px-6 py-4 transition-colors hover:bg-white/6 dark:hover:bg-white/4"
                  >
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl",
                        stream.monthly === 0
                          ? "bg-black/5 text-[var(--fg-faint)] dark:bg-white/8"
                          : "bg-gold/12 text-gold",
                      )}
                    >
                      <Icon className="size-[18px]" />
                    </span>

                    <div className="min-w-[130px] flex-1">
                      <Link
                        href={`/income/${stream.id}`}
                        className="text-[14px] font-medium transition-colors hover:text-gold"
                      >
                        {stream.title}
                      </Link>
                      <p className="tabular text-[11px] text-[var(--fg-faint)]">
                        {share.toFixed(1)}% of run-rate ·{" "}
                        <Link
                          href={`/income/${stream.id}`}
                          className="transition-colors hover:text-gold"
                        >
                          playbook
                        </Link>
                      </p>
                    </div>

                    <Sparkline
                      data={stream.history}
                      className="hidden h-8 w-[110px] sm:block"
                    />

                    <span
                      className={cn(
                        "tabular hidden w-16 text-right text-[12px] font-medium md:block",
                        growth > 0 ? "text-success" : "text-[var(--fg-faint)]",
                      )}
                    >
                      {growth > 0 ? "+" : ""}
                      {growth.toFixed(0)}%
                    </span>

                    <Badge tone={STATUS_TONE[stream.status]}>
                      {stream.status}
                    </Badge>

                    <label className="flex items-center gap-1.5">
                      <span className="sr-only">
                        {stream.title} monthly revenue
                      </span>
                      <span className="text-[13px] text-[var(--fg-faint)]">
                        $
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={stream.monthly}
                        onChange={(event) =>
                          updateStream(stream.id, {
                            monthly: Math.max(0, Number(event.target.value) || 0),
                          })
                        }
                        className="tabular h-9 w-24 rounded-xl border border-[var(--glass-border)] bg-white/8 px-2.5 text-right text-[13px] outline-none transition-colors focus-visible:border-gold dark:bg-white/5"
                      />
                    </label>
                  </motion.li>
                );
              })}
            </ul>
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}
