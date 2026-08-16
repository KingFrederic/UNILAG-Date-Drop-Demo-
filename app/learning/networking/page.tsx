"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Dumbbell, Quote, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { resolveIcon } from "@/components/icon-map";
import {
  modules,
  networkingIntro,
  networkingRules,
  networkingTotals,
} from "@/data/networking";
import { riseChild, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function NetworkingPage() {
  const [active, setActive] = React.useState<string>(modules[0]!.id);
  const current = modules.find((m) => m.id === active) ?? modules[0]!;
  const CurrentIcon = resolveIcon(current.icon);

  return (
    <motion.div variants={staggerParent} initial="hidden" animate="show">
      <motion.div variants={riseChild} className="mb-4 px-1">
        <Link
          href="/learning"
          className="inline-flex items-center gap-1.5 text-[12px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
        >
          <ArrowLeft className="size-3.5" />
          Learning
        </Link>
      </motion.div>

      <PageHeader
        title={networkingIntro.title}
        description={networkingIntro.standfirst}
      />

      <div className="space-y-6 pb-6">
        <motion.div variants={riseChild}>
          <GlassPanel className="p-6 sm:p-8">
            <p className="max-w-3xl text-[14px] leading-relaxed text-[var(--fg-muted)]">
              {networkingIntro.premise}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--hairline)] pt-5">
              <Badge tone="gold">{networkingTotals.modules} modules</Badge>
              <Badge tone="neutral">
                {networkingTotals.scripts} verbatim scripts
              </Badge>
              <Badge tone="neutral">{networkingTotals.drills} drills</Badge>
            </div>
          </GlassPanel>
        </motion.div>

        {/* The one-page version, up front — most people will only read this. */}
        <motion.div variants={riseChild}>
          <GlassPanel className="p-6 sm:p-8">
            <h2 className="text-[15px] font-semibold">
              If you read nothing else
            </h2>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {networkingRules.map((rule, index) => (
                <li key={rule} className="flex gap-3">
                  <span className="tabular mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/12 text-[10px] font-semibold text-gold">
                    {index + 1}
                  </span>
                  <p className="text-[13px] leading-snug text-[var(--fg-muted)]">
                    {rule}
                  </p>
                </li>
              ))}
            </ol>
          </GlassPanel>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Module rail */}
          <motion.nav variants={riseChild} aria-label="Curriculum modules">
            <GlassPanel className="p-3 lg:sticky lg:top-24">
              <ul className="space-y-0.5">
                {modules.map((module) => {
                  const Icon = resolveIcon(module.icon);
                  const isActive = module.id === active;
                  return (
                    <li key={module.id}>
                      <button
                        type="button"
                        onClick={() => setActive(module.id)}
                        aria-current={isActive ? "step" : undefined}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left transition-colors",
                          isActive
                            ? "bg-gold/12 text-[var(--fg)]"
                            : "text-[var(--fg-muted)] hover:bg-white/8 hover:text-[var(--fg)]",
                        )}
                      >
                        <span
                          className={cn(
                            "tabular text-[10px] font-semibold",
                            isActive ? "text-gold" : "text-[var(--fg-faint)]",
                          )}
                        >
                          {String(module.n).padStart(2, "0")}
                        </span>
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isActive ? "text-gold" : "text-[var(--fg-faint)]",
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                          {module.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </GlassPanel>
          </motion.nav>

          {/* Module body */}
          <motion.div variants={riseChild} key={current.id}>
            <GlassPanel className="p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold/12 text-gold">
                  <CurrentIcon className="size-5" />
                </span>
                <div>
                  <p className="tabular text-[11px] font-semibold text-gold">
                    Module {String(current.n).padStart(2, "0")}
                  </p>
                  <h2 className="display-title text-[clamp(1.4rem,2.4vw,1.9rem)]">
                    {current.title}
                  </h2>
                  <p className="mt-1 text-[13px] text-[var(--fg-muted)]">
                    {current.subtitle}
                  </p>
                </div>
              </div>

              <blockquote className="mt-6 border-l-2 border-gold pl-4">
                <p className="text-[15px] font-medium leading-relaxed">
                  {current.principle}
                </p>
              </blockquote>

              <div className="mt-6 space-y-3">
                {current.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="max-w-3xl text-[13px] leading-relaxed text-[var(--fg-muted)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-7">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                  Do this
                </p>
                <ul className="space-y-2">
                  {current.tactics.map((tactic) => (
                    <li key={tactic} className="flex gap-3">
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-gold" />
                      <p className="text-[13px] leading-relaxed text-[var(--fg-muted)]">
                        {tactic}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {current.scripts ? (
                <div className="mt-7">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                    Say this
                  </p>
                  <ul className="space-y-2.5">
                    {current.scripts.map((script) => (
                      <li
                        key={script.situation}
                        className="rounded-2xl border border-[var(--glass-border)] bg-white/6 p-4 dark:bg-white/4"
                      >
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
                          {script.situation}
                        </p>
                        <div className="mt-2.5 flex gap-2.5">
                          <Quote className="mt-0.5 size-3.5 shrink-0 text-gold" />
                          <p className="text-[14px] leading-relaxed">
                            &ldquo;{script.say}&rdquo;
                          </p>
                        </div>
                        <p className="mt-2.5 border-t border-[var(--hairline)] pt-2.5 text-[12px] leading-relaxed text-[var(--fg-faint)]">
                          {script.why}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-danger/25 bg-danger/8 p-4">
                  <div className="flex items-center gap-2">
                    <TriangleAlert className="size-3.5 text-danger" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-danger">
                      How this goes wrong
                    </p>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                    {current.failure}
                  </p>
                </div>

                <div className="rounded-2xl border border-gold/25 bg-gold/8 p-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="size-3.5 text-gold" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                      Drill this week
                    </p>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed">
                    {current.drill}
                  </p>
                </div>
              </div>

              {/* Sequential paging, so the curriculum can be read straight through. */}
              <div className="mt-7 flex items-center justify-between gap-3 border-t border-[var(--hairline)] pt-5">
                <button
                  type="button"
                  disabled={current.n === 1}
                  onClick={() => setActive(modules[current.n - 2]!.id)}
                  className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-30"
                >
                  <ArrowLeft className="size-3.5" />
                  Previous
                </button>
                <span className="tabular text-[11px] text-[var(--fg-faint)]">
                  {current.n} / {modules.length}
                </span>
                <button
                  type="button"
                  disabled={current.n === modules.length}
                  onClick={() => setActive(modules[current.n]!.id)}
                  className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-30"
                >
                  Next
                  <ArrowLeft className="size-3.5 rotate-180" />
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
