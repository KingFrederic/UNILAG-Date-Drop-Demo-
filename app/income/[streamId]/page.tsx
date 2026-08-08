"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, TriangleAlert } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/widgets/sparkline";
import { KdpCatalog } from "@/components/playbook/kdp-catalog";
import { resolveIcon } from "@/components/icon-map";
import { playbookFor } from "@/data/playbooks";
import { useWealthStore } from "@/store/useWealthStore";
import { count, currency, currencyCompact } from "@/lib/format";
import { riseChild, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function StreamPlaybookPage() {
  const params = useParams<{ streamId: string }>();
  const streamId = params?.streamId ?? "";

  const streams = useWealthStore((s) => s.streams);
  const stream = streams.find((item) => item.id === streamId);
  const playbook = playbookFor(streamId);

  // A stream can exist in the store without a written playbook, and vice
  // versa; only 404 when neither knows about it.
  if (!stream && !playbook) notFound();

  const Icon = resolveIcon(stream?.icon ?? "package");
  const title =
    stream?.title ??
    streamId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const maths = playbook?.maths;
  const grossTarget = maths ? maths.unitPrice * maths.unitsToTarget : 0;

  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-6"
    >
      <motion.div variants={riseChild} className="px-1">
        <Link
          href="/income"
          className="inline-flex items-center gap-1.5 text-[12px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
        >
          <ArrowLeft className="size-3.5" />
          All income streams
        </Link>
      </motion.div>

      {/* ------------------------------ header ------------------------------ */}
      <motion.div variants={riseChild}>
        <GlassPanel className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start gap-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold/12 text-gold">
              <Icon className="size-6" />
            </span>

            <div className="min-w-[220px] flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="display-title text-[clamp(1.6rem,3vw,2.25rem)]">
                  {title}
                </h1>
                {stream ? (
                  <Badge tone="neutral">{stream.status}</Badge>
                ) : null}
              </div>
              {playbook ? (
                <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-[var(--fg-muted)]">
                  {playbook.premise}
                </p>
              ) : null}
            </div>

            {stream ? (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                  Currently
                </p>
                <p className="tabular text-2xl font-semibold">
                  {currency(stream.monthly)}
                  <span className="text-[13px] font-normal text-[var(--fg-faint)]">
                    /mo
                  </span>
                </p>
                <Sparkline
                  data={stream.history}
                  className="mt-2 h-8 w-[130px]"
                />
              </div>
            ) : null}
          </div>

          {playbook ? (
            <p className="mt-6 border-t border-[var(--hairline)] pt-5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
              {playbook.thesis}
            </p>
          ) : null}
        </GlassPanel>
      </motion.div>

      {!playbook ? (
        <motion.div variants={riseChild}>
          <GlassPanel className="p-8 text-center">
            <p className="text-[14px] text-[var(--fg-muted)]">
              No playbook written for this stream yet.
            </p>
          </GlassPanel>
        </motion.div>
      ) : (
        <>
          {/* ------------------------------ maths ------------------------------ */}
          <motion.div variants={riseChild}>
            <GlassPanel className="p-6 sm:p-8">
              <h2 className="text-[15px] font-semibold">The unit maths</h2>
              <p className="mt-1 text-[13px] text-[var(--fg-muted)]">
                What has to be true for this stream to reach its target alone.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                    Unit price
                  </p>
                  <p className="tabular mt-1 text-2xl font-semibold">
                    {maths!.unitPriceLabel ?? currency(maths!.unitPrice)}
                  </p>
                </div>
                <span className="pt-5 text-xl text-[var(--fg-faint)]">×</span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                    {maths!.unitNoun}
                  </p>
                  <p className="tabular mt-1 text-2xl font-semibold">
                    {count(maths!.unitsToTarget)}
                  </p>
                </div>
                <span className="pt-5 text-xl text-[var(--fg-faint)]">=</span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                    Gross
                  </p>
                  <p className="tabular mt-1 text-2xl font-semibold text-gold">
                    {currencyCompact(grossTarget)}
                  </p>
                </div>

                {maths!.margin ? (
                  <>
                    <span className="pt-5 text-xl text-[var(--fg-faint)]">
                      →
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                        Net at {(maths!.margin * 100).toFixed(0)}%
                      </p>
                      <p className="tabular mt-1 text-2xl font-semibold">
                        {currencyCompact(grossTarget * maths!.margin)}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>

              {maths!.note ? (
                <p className="mt-6 rounded-2xl border border-[var(--glass-border)] bg-white/6 p-4 text-[13px] leading-relaxed text-[var(--fg-muted)] dark:bg-white/4">
                  {maths!.note}
                </p>
              ) : null}
            </GlassPanel>
          </motion.div>

          {/* ------------------------------ phasing ------------------------------ */}
          <motion.div variants={riseChild}>
            <GlassPanel className="p-6 sm:p-8">
              <h2 className="text-[15px] font-semibold">Three-year phasing</h2>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {playbook.phases.map((phase, index) => (
                  <div
                    key={phase.year}
                    className="rounded-[var(--radius-panel)] border border-[var(--glass-border)] bg-white/6 p-5 dark:bg-white/4"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <Badge tone={index === 0 ? "gold" : "neutral"}>
                        {phase.year}
                      </Badge>
                      <p className="tabular text-[14px] font-semibold">
                        {currencyCompact(phase.revenue)}
                      </p>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                      {phase.focus}
                    </p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          {/* --------------------------- launch + platforms --------------------------- */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <motion.div variants={riseChild}>
              <GlassPanel className="h-full p-6 sm:p-8">
                <h2 className="text-[15px] font-semibold">How to launch it</h2>
                <ol className="mt-5 space-y-3">
                  {playbook.launchSteps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="tabular mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/15 text-[10px] font-semibold text-gold">
                        {index + 1}
                      </span>
                      <p className="text-[13px] leading-relaxed text-[var(--fg-muted)]">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </GlassPanel>
            </motion.div>

            <motion.div variants={riseChild} className="space-y-6">
              <GlassPanel className="p-6">
                <h2 className="text-[15px] font-semibold">Where to sell it</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {playbook.platforms.map((platform) => (
                    <li key={platform}>
                      <Badge tone="neutral">{platform}</Badge>
                    </li>
                  ))}
                </ul>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-danger/12 text-danger">
                    <TriangleAlert className="size-4" />
                  </span>
                  <div>
                    <h2 className="text-[14px] font-semibold">
                      What actually kills it
                    </h2>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                      {playbook.risk}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>

          {/* The digital products stream has a real catalogue behind it, so
              show it rather than leaving the plan abstract. */}
          {streamId === "digital-products" ? (
            <motion.div variants={riseChild}>
              <KdpCatalog />
            </motion.div>
          ) : null}

          {/* ---------------------------- suggestions ---------------------------- */}
          {playbook.suggestions ? (
            <motion.div variants={riseChild}>
              <GlassPanel className="p-6 sm:p-8">
                <h2 className="text-[15px] font-semibold">
                  {playbook.suggestions.heading}
                </h2>
                {/* items-start stops the row partner of a tall card (one with
                    a mockup) from being stretched to match its height. */}
                <ul className="mt-5 grid items-start gap-2.5 sm:grid-cols-2">
                  {playbook.suggestions.items.map((item) => (
                    <li
                      key={item.title}
                      className="overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-white/6 dark:bg-white/4"
                    >
                      {item.image ? (
                        // sizes must match the rendered width or Next serves
                        // too small a source and the mockup looks soft: this
                        // is one column of a two-column grid inside the panel.
                        <Image
                          src={item.image}
                          alt={item.imageAlt ?? item.title}
                          width={item.imageWidth ?? 1200}
                          height={item.imageHeight ?? 960}
                          sizes="(min-width: 640px) 600px, 100vw"
                          className="h-auto w-full border-b border-[var(--hairline)]"
                        />
                      ) : null}
                      <div className="p-4">
                        <p className="text-[13px] font-medium">{item.title}</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-[var(--fg-faint)]">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </motion.div>
          ) : null}

          {/* ------------------------------ audiences ------------------------------ */}
          {playbook.audiences ? (
            <motion.div variants={riseChild}>
              <GlassPanel className="p-6 sm:p-8">
                <h2 className="text-[15px] font-semibold">
                  Who buys first, and why
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {playbook.audiences.map((audience) => (
                    <li key={audience} className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" />
                      <p className="text-[13px] leading-relaxed text-[var(--fg-muted)]">
                        {audience}
                      </p>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </motion.div>
          ) : null}
        </>
      )}

      <motion.div variants={riseChild} className="px-1">
        <Link
          href="/blueprint"
          className={cn(
            "inline-flex items-center gap-2 text-[13px] text-[var(--fg-muted)]",
            "transition-colors hover:text-gold",
          )}
        >
          See how this fits the whole blueprint
          <ArrowLeft className="size-3.5 rotate-180" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
