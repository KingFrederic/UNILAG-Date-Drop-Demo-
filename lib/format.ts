const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function currency(value: number) {
  return gbp.format(value);
}

const COMPACT_UNITS = [
  { limit: 1e9, suffix: "B" },
  { limit: 1e6, suffix: "M" },
  { limit: 1e3, suffix: "K" },
] as const;

/**
 * £1.2M / £85K — for figures that would otherwise overflow their card.
 *
 * Computed arithmetically rather than via Intl's `notation: "compact"`,
 * because the implementations genuinely disagree: for 85000 Node's ICU
 * produces "£85.0k" while Chrome produces "£85K". Server and client must
 * agree or hydration fails, so this does the rounding itself.
 */
export function currencyCompact(value: number) {
  const abs = Math.abs(value);
  if (abs < 1000) return gbp.format(value);

  const sign = value < 0 ? "-" : "";
  for (const unit of COMPACT_UNITS) {
    if (abs < unit.limit) continue;
    const scaled = abs / unit.limit;
    // One decimal below 100 (£26.7K), whole numbers above (£850K).
    const text =
      scaled < 100
        ? scaled.toFixed(1).replace(/\.0$/, "")
        : String(Math.round(scaled));
    return `${sign}£${text}${unit.suffix}`;
  }
  return gbp.format(value);
}

export function percent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function relativeTime(timestamp: number, now = Date.now()) {
  const seconds = Math.round((now - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
