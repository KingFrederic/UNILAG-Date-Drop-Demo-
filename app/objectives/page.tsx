"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  ShieldAlert,
  Route as RouteIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { resolveIcon } from "@/components/icon-map";
import { objectives, objectiveTotals } from "@/data/objectives";
import { riseChild, spring, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function ObjectivesPage() {
  const [openId, setOpenId] = React.useState<string | null>(objectives[0]?.id ?? null);

  return (
    <motion.div variants={staggerParent} initial="hidden" animate="show">
      <PageHeader
        title="Personal Objectives"
        description="The half of the plan that money does not buy. Six objectives, each with the published route and the faster door beside it."
        action={
          <Link
            href="/learning/networking"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] px-4 py-2 text-[13px] font-medium text-[var(--fg-muted)] transition-colors hover:bg-white/10 hover:text-[var(--fg)]"
          >
            The networking curriculum
            <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      <motion.p
        variants={riseChild}
        className="mb-6 max-w-3xl px-1 text-[13px] leading-relaxed text-[var(--fg-muted)]"
      >
        {objectiveTotals.count} objectives · {objectiveTotals.moves} concrete
        moves. Where a licensing rule, citizenship gate or alumni-status quirk
        decides whether a path is open at all, it is called out as a gate and
        sourced — those are the details that quietly waste years.
      </motion.p>

      <div className="space-y-3 pb-6">
        {objectives.map((objective) => {
          const Icon = resolveIcon(objective.icon);
          const open = openId === objective.id;
          const blockers = objective.gates.filter((g) => g.blocking).length;

          return (
            <motion.div key={objective.id} variants={riseChild}>
              <GlassPanel className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : objective.id)}
                  aria-expanded={open}
                  className="flex w-full items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-white/6"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold/12 text-gold">
                    <Icon className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="tabular text-[11px] font-semibold text-gold">
                        0{objective.n}
                      </span>
                      <h2 className="text-[15px] font-semibold">
                        {objective.title}
                      </h2>
                      {blockers > 0 ? (
                        <Badge tone="danger">
                          {blockers} gate{blockers > 1 ? "s" : ""}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[12px] leading-snug text-[var(--fg-muted)]">
                      {objective.outcome}
                    </p>
                  </div>

                  <ChevronDown
                    className={cn(
                      "mt-1 size-4 shrink-0 text-[var(--fg-faint)] transition-transform",
                      open && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={spring.soft}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[var(--hairline)] px-6 py-6">
                        <p className="max-w-3xl text-[13px] leading-relaxed text-[var(--fg-muted)]">
                          {objective.premise}
                        </p>

                        {/* Gates first — they decide whether any of the moves
                            below are even available. */}
                        {objective.gates.length > 0 ? (
                          <div className="mt-6">
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                              Gates
                            </p>
                            <ul className="space-y-2">
                              {objective.gates.map((gate) => (
                                <li
                                  key={gate.label}
                                  className={cn(
                                    "flex gap-3 rounded-2xl border p-4",
                                    gate.blocking
                                      ? "border-danger/25 bg-danger/8"
                                      : "border-[var(--glass-border)] bg-white/6 dark:bg-white/4",
                                  )}
                                >
                                  <ShieldAlert
                                    className={cn(
                                      "mt-0.5 size-4 shrink-0",
                                      gate.blocking
                                        ? "text-danger"
                                        : "text-[var(--fg-faint)]",
                                    )}
                                  />
                                  <div>
                                    <p className="text-[13px] font-medium">
                                      {gate.label}
                                    </p>
                                    <p className="mt-1 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                                      {gate.detail}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        <div className="mt-6">
                          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                            Moves
                          </p>
                          <ul className="space-y-2">
                            {objective.moves.map((move) => (
                              <li
                                key={move.title}
                                className="rounded-2xl border border-[var(--glass-border)] bg-white/6 p-4 dark:bg-white/4"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  {move.kind === "unconventional" ? (
                                    <Lightbulb className="size-3.5 shrink-0 text-gold" />
                                  ) : (
                                    <RouteIcon className="size-3.5 shrink-0 text-[var(--fg-faint)]" />
                                  )}
                                  <p className="text-[13px] font-medium">
                                    {move.title}
                                  </p>
                                  <Badge
                                    tone={
                                      move.kind === "unconventional"
                                        ? "gold"
                                        : "neutral"
                                    }
                                  >
                                    {move.kind === "unconventional"
                                      ? "faster door"
                                      : "published route"}
                                  </Badge>
                                  <span className="ml-auto text-[11px] text-[var(--fg-faint)]">
                                    {move.horizon}
                                  </span>
                                </div>
                                <p className="mt-2 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                                  {move.detail}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 rounded-2xl border border-gold/25 bg-gold/8 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                            Do this first
                          </p>
                          <p className="mt-1.5 text-[13px] leading-relaxed">
                            {objective.firstAction}
                          </p>
                        </div>

                        {objective.sources ? (
                          <div className="mt-5 border-t border-[var(--hairline)] pt-4">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                              Sources
                            </p>
                            <ul className="space-y-1">
                              {objective.sources.map((source) => (
                                <li key={source.url}>
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[12px] text-[var(--fg-muted)] transition-colors hover:text-gold"
                                  >
                                    {source.label}
                                    <ExternalLink className="size-3" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
