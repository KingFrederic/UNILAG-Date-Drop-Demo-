"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "./sparkline";
import { resolveIcon } from "@/components/icon-map";
import { useWealthStore, selectRunRate } from "@/store/useWealthStore";
import { currency } from "@/lib/format";
import { riseChild, staggerParent } from "@/lib/motion";
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

/** Month-over-month change, used for the delta chip. */
function trend(history: number[]) {
  const last = history.at(-1) ?? 0;
  const previous = history.at(-2) ?? 0;
  if (previous === 0) return last > 0 ? 100 : 0;
  return ((last - previous) / previous) * 100;
}

export function IncomeStreams() {
  const streams = useWealthStore((s) => s.streams);
  const runRate = useWealthStore(selectRunRate);
  const railRef = React.useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = React.useState({ left: false, right: true });

  const syncArrows = React.useCallback(() => {
    const node = railRef.current;
    if (!node) return;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    setCanScroll({
      left: scrollLeft > 8,
      right: scrollLeft + clientWidth < scrollWidth - 8,
    });
  }, []);

  React.useEffect(() => {
    syncArrows();
    const node = railRef.current;
    if (!node) return;
    const observer = new ResizeObserver(syncArrows);
    observer.observe(node);
    return () => observer.disconnect();
  }, [syncArrows]);

  const nudge = (direction: 1 | -1) => {
    railRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <motion.section variants={riseChild}>
      <div className="mb-4 flex items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">
            Income Streams
          </h2>
          <p className="mt-0.5 text-[12px] text-[var(--fg-faint)]">
            {streams.length} streams · {currency(runRate)} combined run-rate
          </p>
        </div>

        <div className="hidden gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={!canScroll.left}
            aria-label="Scroll streams left"
            className="grid size-8 place-items-center rounded-full border border-[var(--glass-border)] text-[var(--fg-muted)] transition-all hover:bg-white/10 hover:text-[var(--fg)] disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={!canScroll.right}
            aria-label="Scroll streams right"
            className="grid size-8 place-items-center rounded-full border border-[var(--glass-border)] text-[var(--fg-muted)] transition-all hover:bg-white/10 hover:text-[var(--fg)] disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <motion.div
        ref={railRef}
        variants={staggerParent}
        onScroll={syncArrows}
        className="no-scrollbar rail-mask -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2"
      >
        {streams.map((stream) => {
          const Icon = resolveIcon(stream.icon);
          const delta = trend(stream.history);
          const dormant = stream.monthly === 0;

          return (
            // Driven by the parent's stagger rather than whileInView: cards
            // scrolled past the right edge of the rail never intersect the
            // viewport, so a scroll-triggered reveal would leave them blank.
            <motion.div
              key={stream.id}
              variants={riseChild}
              className="w-[248px] shrink-0 snap-start"
            >
              <Link
                href={`/income/${stream.id}`}
                aria-label={`${stream.title} launch playbook`}
                className="block h-full"
              >
                <GlassPanel
                  lift
                  className="h-full rounded-[var(--radius-panel)] p-4"
                >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl",
                      dormant
                        ? "bg-black/5 text-[var(--fg-faint)] dark:bg-white/8"
                        : "bg-gold/12 text-gold",
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </span>
                  <Badge tone={STATUS_TONE[stream.status]}>
                    {stream.status}
                  </Badge>
                </div>

                <p className="mt-3.5 text-[13px] font-medium">{stream.title}</p>

                <div className="mt-1 flex items-baseline gap-2">
                  <p className="tabular text-xl font-semibold">
                    {currency(stream.monthly)}
                  </p>
                  <span className="text-[11px] text-[var(--fg-faint)]">/mo</span>
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <Sparkline
                    data={stream.history}
                    className="h-8 w-[130px]"
                    stroke={
                      dormant ? "var(--color-info)" : "var(--color-gold)"
                    }
                  />
                  <span
                    className={cn(
                      "tabular text-[11px] font-medium",
                      delta > 0
                        ? "text-success"
                        : delta < 0
                          ? "text-danger"
                          : "text-[var(--fg-faint)]",
                    )}
                  >
                    {delta > 0 ? "+" : ""}
                    {delta.toFixed(1)}%
                  </span>
                </div>
                </GlassPanel>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
