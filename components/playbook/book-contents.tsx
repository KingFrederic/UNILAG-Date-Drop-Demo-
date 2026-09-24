import * as React from "react";
import {
  flattenContents,
  type CatalogContents,
  type CatalogDivision,
} from "@/data/kdp-catalog";
import { cn } from "@/lib/utils";

interface BookContentsProps {
  /** Decides numbering and section wording — see CONTENTS_STYLE. */
  division: CatalogDivision;
  contents: CatalogContents;
  className?: string;
}

/**
 * A book's table of contents, printed the way it will be bound: unnumbered
 * lead-in matter, numbered entries running across any parts, unnumbered tail.
 *
 * Dotted leaders carry the eye to the right-hand anchor, which is the one
 * thing a contents page has to get right — a list of chapter names without
 * something to line them up against is just a table.
 */
export function BookContents({
  division,
  contents,
  className,
}: BookContentsProps) {
  const rows = React.useMemo(
    () => flattenContents(division, contents),
    [division, contents],
  );

  return (
    <nav
      aria-label="Table of contents"
      className={cn("text-[12px] leading-snug", className)}
    >
      <ul className="space-y-[3px]">
        {rows.map((row, index) => {
          if (row.kind === "group") {
            return (
              <li key={`g-${index}`} className="pt-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold/85">
                  {row.label}
                </p>
                {row.note ? (
                  <p className="mt-0.5 text-[11px] text-[var(--fg-faint)]">
                    {row.note}
                  </p>
                ) : null}
              </li>
            );
          }

          const isMatter = row.kind === "front" || row.kind === "back";

          return (
            <li
              key={`${row.kind}-${index}`}
              className={cn(
                "flex items-baseline gap-2",
                row.kind === "entry" && "text-[var(--fg)]",
                isMatter && "text-[var(--fg-faint)]",
              )}
            >
              {row.kind === "entry" && row.number !== null ? (
                <span className="tabular w-4 shrink-0 text-right text-[11px] text-gold/75">
                  {row.number}
                </span>
              ) : (
                <span aria-hidden className="w-4 shrink-0" />
              )}

              <span className="min-w-0">{row.item.title}</span>

              <span
                aria-hidden
                className="mb-[3px] h-0 min-w-3 flex-1 self-end border-b border-dotted border-[var(--hairline)]"
              />

              {row.item.at ? (
                <span className="tabular shrink-0 text-[11px] text-[var(--fg-faint)]">
                  {row.item.at}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
