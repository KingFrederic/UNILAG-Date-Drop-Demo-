"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MountainScene } from "@/components/hero/mountain-scene";
import { resolveIcon } from "@/components/icon-map";
import {
  ANNUAL_INCOME,
  CAPITAL_TARGET,
  DEPLOYED_CAPITAL,
  MONTHLY_INCOME,
  RESERVE,
  phases,
  returnScenarios,
  soloRoutes,
  thesis,
} from "@/data/blueprint";
import { playbooks } from "@/data/playbooks";
import { useWealthStore } from "@/store/useWealthStore";
import { count, currency, currencyCompact } from "@/lib/format";
import { riseChild, staggerParent } from "@/lib/motion";
import { progressOf } from "@/lib/utils";

function Figure({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
        {label}
      </p>
      <p className="tabular mt-1.5 text-[28px] font-semibold leading-none sm:text-[34px]">
        {value}
      </p>
      {sub ? (
        <p className="mt-1.5 text-[12px] text-[var(--fg-faint)]">{sub}</p>
      ) : null}
    </div>
  );
}

export default function BlueprintPage() {
  const streams = useWealthStore((s) => s.streams);
  const goals = useWealthStore((s) => s.goals);
  const netWorth = goals.find((goal) => goal.id === "net-worth")?.current ?? 0;
  const capitalProgress = progressOf(netWorth, CAPITAL_TARGET);

  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-6"
    >
      {/* ------------------------------ thesis ------------------------------ */}
      <section className="glass relative isolate overflow-hidden rounded-[var(--radius-glass)]">
        <MountainScene />

        <div className="relative px-6 pb-10 pt-12 sm:px-10 sm:pb-12 sm:pt-16 lg:px-14">
          <motion.div variants={riseChild}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-md">
              The plan, end to end
            </span>
          </motion.div>

          <motion.h1
            variants={riseChild}
            className="display-title mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.5rem)] text-white"
          >
            {thesis.title}
          </motion.h1>

          <motion.p
            variants={riseChild}
            className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base"
          >
            {thesis.standfirst}
          </motion.p>

          {/* The three-step chain, which is the whole argument. */}
          <motion.ol
            variants={riseChild}
            className="mt-10 grid gap-4 lg:grid-cols-3"
          >
            {thesis.steps.map((step, index) => (
              <li
                key={step.id}
                className="relative rounded-[var(--radius-panel)] border border-white/15 bg-black/25 p-5 backdrop-blur-md"
              >
                <div className="flex items-baseline gap-2">
                  <span className="tabular text-[11px] font-semibold text-gold">
                    0{index + 1}
                  </span>
                  <p className="text-[14px] font-semibold text-white">
                    {step.label}
                  </p>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-white/60">
                  {step.detail}
                </p>
                {index < thesis.steps.length - 1 ? (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden size-4 -translate-y-1/2 text-white/25 lg:block" />
                ) : null}
              </li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ------------------------------ the maths ------------------------------ */}
      <motion.div variants={riseChild}>
        <GlassPanel className="p-6 sm:p-8">
          <h2 className="text-[15px] font-semibold">The arithmetic</h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[var(--fg-muted)]">
            Every number below follows from the one before it. Change the return
            rate and everything downstream moves with it.
          </p>

          <div className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <Figure
              label="Earn"
              value={currencyCompact(CAPITAL_TARGET)}
              sub="across all streams, ~3 years"
            />
            <Figure
              label="Deploy"
              value={currencyCompact(DEPLOYED_CAPITAL)}
              sub={`${currencyCompact(RESERVE)} held back as reserve`}
            />
            <Figure label="At" value="20%" sub="targeted annual return" />
            <Figure
              label="Live on"
              value={`${currencyCompact(MONTHLY_INCOME)}/mo`}
              sub={`${currency(ANNUAL_INCOME)} a year`}
            />
          </div>

          <div className="mt-8 border-t border-[var(--hairline)] pt-6">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[13px] font-medium">
                Progress to the {currencyCompact(CAPITAL_TARGET)} capital target
              </p>
              <p className="tabular text-[13px] text-[var(--fg-muted)]">
                {currency(netWorth)} · {capitalProgress.toFixed(1)}%
              </p>
            </div>
            <Progress value={capitalProgress} label="Capital target progress" />
          </div>
        </GlassPanel>
      </motion.div>

      {/* --------------------------- honesty on the 20% --------------------------- */}
      <motion.div variants={riseChild}>
        <GlassPanel className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-danger/12 text-danger">
              <TriangleAlert className="size-[17px]" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold">
                The 20% is the assumption to watch
              </h2>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-[var(--fg-muted)]">
                A sustained 20% annual return is well above the long-run market
                average of roughly 7–10%. The plan is not wrong for targeting
                it, but it is the single number everything else depends on — so
                here is what the same {currencyCompact(DEPLOYED_CAPITAL)} pays at
                other rates.
              </p>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {returnScenarios.map((scenario) => {
                  const isPlan = scenario.rate === 0.2;
                  return (
                    <li
                      key={scenario.label}
                      className={
                        isPlan
                          ? "rounded-2xl border border-gold/30 bg-gold/10 p-4"
                          : "rounded-2xl border border-[var(--glass-border)] bg-white/6 p-4 dark:bg-white/4"
                      }
                    >
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
                        {scenario.label}
                      </p>
                      <p className="tabular mt-1 text-lg font-semibold">
                        {currencyCompact(scenario.monthly)}
                        <span className="text-[12px] font-normal text-[var(--fg-faint)]">
                          /mo
                        </span>
                      </p>
                      <p className="tabular mt-0.5 text-[11px] text-[var(--fg-faint)]">
                        at {(scenario.rate * 100).toFixed(0)}%
                      </p>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 text-[12px] leading-relaxed text-[var(--fg-faint)]">
                If the realistic rate is 10%, the same monthly income needs{" "}
                {currencyCompact(6_000_000)} deployed rather than{" "}
                {currencyCompact(DEPLOYED_CAPITAL)}. Decide which lever moves —
                the capital target or the income target — before relying on it.
              </p>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* ----------------------- independent routes to $5M ----------------------- */}
      <motion.div variants={riseChild}>
        <GlassPanel className="p-6 sm:p-8">
          <h2 className="text-[15px] font-semibold">
            Five independent routes to {currencyCompact(CAPITAL_TARGET)}
          </h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[var(--fg-muted)]">
            Each of these reaches the target on its own. The point is not that
            any single one is likely — it is that no one of them has to carry
            the whole plan.
          </p>

          <ul className="mt-6 space-y-2.5">
            {soloRoutes.map((route) => {
              const playbook = playbooks.find(
                (item) => item.streamId === route.streamId,
              );
              const Icon = resolveIcon(
                playbook
                  ? (
                      {
                        "digital-products": "package",
                        "shirt-production": "shirt",
                        youtube: "square-play",
                        "freelancer-agency": "briefcase",
                        saas: "cloud",
                      } as Record<string, string>
                    )[route.streamId] ?? "package"
                  : "package",
              );

              return (
                <li key={route.streamId}>
                  <Link
                    href={`/income/${route.streamId}`}
                    className="group flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--glass-border)] bg-white/6 px-4 py-3.5 transition-colors hover:bg-white/10 dark:bg-white/4 dark:hover:bg-white/7"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold">
                      <Icon className="size-[18px]" />
                    </span>

                    <div className="min-w-[140px] flex-1">
                      <p className="text-[14px] font-medium">{route.label}</p>
                      <p className="tabular text-[12px] text-[var(--fg-faint)]">
                        {route.equation}
                      </p>
                    </div>

                    <p className="min-w-[200px] flex-[2] text-[12px] leading-snug text-[var(--fg-muted)]">
                      {route.reality}
                    </p>

                    <ArrowRight className="size-4 shrink-0 text-[var(--fg-faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
            Or — most likely — a combined total across all ten streams reaching{" "}
            {currency(CAPITAL_TARGET)}. That is the version that does not
            require any single bet to come in.
          </p>
        </GlassPanel>
      </motion.div>

      {/* ------------------------------- phasing ------------------------------- */}
      <motion.div variants={riseChild}>
        <GlassPanel className="p-6 sm:p-8">
          <h2 className="text-[15px] font-semibold">Three years, three jobs</h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[var(--fg-muted)]">
            The streams do not all start at once. Each year has a different job,
            and getting them out of order is the most common way this fails.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {phases.map((phase, index) => (
              <div
                key={phase.year}
                className="rounded-[var(--radius-panel)] border border-[var(--glass-border)] bg-white/6 p-5 dark:bg-white/4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <Badge tone={index === 0 ? "gold" : "neutral"}>
                    {phase.year}
                  </Badge>
                  <p className="tabular text-[13px] font-semibold">
                    {currencyCompact(phase.target)}
                  </p>
                </div>

                <h3 className="mt-3 text-[14px] font-semibold">{phase.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                  {phase.detail}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-[var(--hairline)] pt-3">
                  {phase.milestones.map((milestone) => (
                    <li
                      key={milestone}
                      className="flex gap-2 text-[12px] text-[var(--fg-muted)]"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold" />
                      {milestone}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      {/* ------------------------------ every stream ------------------------------ */}
      <motion.div variants={riseChild}>
        <GlassPanel className="p-6 sm:p-8">
          <h2 className="text-[15px] font-semibold">
            Every stream has a playbook
          </h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[var(--fg-muted)]">
            Unit maths, three-year phasing, launch steps and platforms — open
            any stream for its full breakdown.
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {playbooks.map((playbook) => {
              // Use the stream's real title — slugified ids give "Youtube",
              // "Saas" and "Tiktok Shop", which read as typos.
              const stream = streams.find(
                (item) => item.id === playbook.streamId,
              );
              return (
                <Link
                  key={playbook.streamId}
                  href={`/income/${playbook.streamId}`}
                  className="group flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-white/6 px-4 py-3 transition-colors hover:bg-white/10 dark:bg-white/4 dark:hover:bg-white/7"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">
                      {stream?.title ?? playbook.streamId}
                    </p>
                    <p className="tabular truncate text-[11px] text-[var(--fg-faint)]">
                      {playbook.maths.unitPriceLabel ??
                        currency(playbook.maths.unitPrice)}{" "}
                      × {count(playbook.maths.unitsToTarget)}{" "}
                      {playbook.maths.unitNoun}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-[var(--fg-faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                </Link>
              );
            })}
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
