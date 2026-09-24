"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  ListTree,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { BookContents } from "@/components/playbook/book-contents";
import {
  KDP_WORKBOOK,
  kdpCatalog,
  kdpDivisions,
  kdpTotals,
  contentsSummary,
  titlesWithContents,
} from "@/data/kdp-catalog";
import { count } from "@/lib/format";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DIVISION_TONE = {
  Fiction: "gold",
  "Low-Content": "info",
  "Non-Fiction": "success",
} as const;

/**
 * The publishing catalogue behind the digital products stream.
 *
 * 200 titles is far too many to list flat, so categories collapse by default
 * and the division filter does the first cut. Each title carries its table of
 * contents one level deeper — same reason: an outline is worth reading for one
 * book at a time, not for twenty books at once. The source workbook is offered
 * as a download because that is where the work actually gets tracked — this
 * view is for reading the plan, not for working it.
 */
export function KdpCatalog() {
  const [division, setDivision] = React.useState<string | null>(null);
  const [openId, setOpenId] = React.useState<string | null>(null);
  // Outlines open independently, keyed by category + book number, so a reader
  // can hold two or three books' contents side by side and compare them.
  const [openContents, setOpenContents] = React.useState<Set<string>>(
    () => new Set(),
  );

  const shown = React.useMemo(
    () =>
      division
        ? kdpCatalog.filter((category) => category.division === division)
        : kdpCatalog,
    [division],
  );

  const shownTitles = shown.reduce((sum, c) => sum + c.titles.length, 0);
  const shownOutlines = titlesWithContents(shown);

  const toggleContents = React.useCallback((key: string) => {
    setOpenContents((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <GlassPanel className="p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold">
              <FileSpreadsheet className="size-[17px]" />
            </span>
            <h2 className="text-[15px] font-semibold">
              KDP publishing catalogue
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-[var(--fg-muted)]">
            {kdpTotals.categories} categories × 10 books ={" "}
            <span className="font-medium text-[var(--fg)]">
              {count(kdpTotals.titles)} titles
            </span>
            , already written and strategy-tagged. This is the concrete version
            of the {count(250_000)}-copy target — a catalogue, not one hero
            product.
          </p>
        </div>

        <a
          href={KDP_WORKBOOK}
          download
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-b from-gold-bright to-gold px-4 py-2 text-[13px] font-semibold text-[#241a06] shadow-[0_10px_30px_-8px_rgba(245,184,78,0.65)] transition-transform hover:-translate-y-0.5"
        >
          <Download className="size-4" />
          Download tracker
        </a>
      </div>

      {/* Division filter — the first useful cut across 200 rows. */}
      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setDivision(null)}
          aria-pressed={division === null}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
            division === null
              ? "bg-gold text-[#241a06]"
              : "border border-[var(--glass-border)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
          )}
        >
          All {kdpTotals.categories}
        </button>
        {kdpDivisions.map((name) => {
          const n = kdpCatalog.filter((c) => c.division === name).length;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setDivision(division === name ? null : name)}
              aria-pressed={division === name}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
                division === name
                  ? "bg-gold text-[#241a06]"
                  : "border border-[var(--glass-border)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
              )}
            >
              {name} · {n}
            </button>
          );
        })}
        <span className="ml-auto text-[11px] text-[var(--fg-faint)]">
          {count(shownTitles)} titles shown
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {shown.map((category) => {
          const open = openId === category.id;
          return (
            <li
              key={category.id}
              className="overflow-hidden rounded-[var(--radius-panel)] border border-[var(--glass-border)] bg-white/6 dark:bg-white/4"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : category.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/6"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-medium">
                      {category.category}
                    </p>
                    <Badge tone={DIVISION_TONE[category.division]}>
                      {category.division}
                    </Badge>
                    <span className="text-[11px] text-[var(--fg-faint)]">
                      {category.effort} effort
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[12px] text-[var(--fg-faint)]">
                    {category.why}
                  </p>
                </div>

                <span className="tabular shrink-0 text-[11px] text-[var(--fg-faint)]">
                  {category.titles.length}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-[var(--fg-faint)] transition-transform",
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
                    <div className="border-t border-[var(--hairline)] px-4 py-4">
                      <dl className="mb-4 grid gap-3 sm:grid-cols-3">
                        <div>
                          <dt className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                            Top-title BSR
                          </dt>
                          <dd className="mt-0.5 text-[12px]">{category.bsr}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                            Crowded above
                          </dt>
                          <dd className="mt-0.5 text-[12px]">
                            {category.reviews} reviews
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                            Production tip
                          </dt>
                          <dd className="mt-0.5 text-[12px]">{category.tip}</dd>
                        </div>
                      </dl>

                      <ol className="space-y-1.5">
                        {category.titles.map((title) => {
                          const key = `${category.id}:${title.n}`;
                          const expanded = openContents.has(key);
                          const contentsId = `kdp-${key.replace(":", "-")}-contents`;

                          return (
                            <li
                              key={title.n}
                              className="rounded-xl px-2.5 py-2 transition-colors hover:bg-white/6"
                            >
                              <div className="flex gap-3">
                                <span className="tabular mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/12 text-[10px] font-semibold text-gold">
                                  {title.n}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[13px] font-medium leading-snug">
                                    {title.title}
                                  </p>
                                  <p className="text-[11px] leading-snug text-[var(--fg-faint)]">
                                    {title.strategy}
                                  </p>
                                </div>

                                {/* A title whose outline hasn't landed
                                    renders as it did before the wiring —
                                    no dead toggle. */}
                                {title.contents ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleContents(key)}
                                    aria-expanded={expanded}
                                    aria-controls={contentsId}
                                    className={cn(
                                      "inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                                      expanded
                                        ? "border-gold/35 bg-gold/12 text-gold"
                                        : "border-[var(--glass-border)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
                                    )}
                                  >
                                    <ListTree className="size-3" />
                                    {contentsSummary(
                                      category.division,
                                      title.contents,
                                    )}
                                    <ChevronDown
                                      className={cn(
                                        "size-3 transition-transform",
                                        expanded && "rotate-180",
                                      )}
                                    />
                                  </button>
                                ) : null}
                              </div>

                              <AnimatePresence initial={false}>
                                {title.contents && expanded ? (
                                  <motion.div
                                    id={contentsId}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={spring.soft}
                                    className="overflow-hidden"
                                  >
                                    {/* Indented to the title, not to the
                                    number disc, so the outline reads as
                                    the book's own. */}
                                    <div className="ml-8 mt-2.5 rounded-r-lg border-l border-gold/25 bg-white/6 py-2.5 pl-3.5 pr-2.5 dark:bg-white/4">
                                      <BookContents
                                        division={category.division}
                                        contents={title.contents}
                                      />
                                    </div>
                                  </motion.div>
                                ) : null}
                              </AnimatePresence>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* Outlines land title by title. Say so while it is true, and stop the
          moment it isn't — this is a progress marker, not a permanent caveat. */}
      {shownOutlines > 0 && shownOutlines < shownTitles ? (
        <p className="mt-3 text-[11px] text-[var(--fg-faint)]">
          Contents wired for{" "}
          <span className="text-[var(--fg-muted)]">
            {count(shownOutlines)} of {count(shownTitles)}
          </span>{" "}
          titles shown. A title with no outline yet opens to its strategy note
          alone.
        </p>
      ) : null}
    </GlassPanel>
  );
}
