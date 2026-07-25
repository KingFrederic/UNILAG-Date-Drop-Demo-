"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WidgetShell } from "./widget-shell";
import {
  useWealthStore,
  selectRunRate,
  runRateSeries,
} from "@/store/useWealthStore";
import { monthLabels } from "@/data/seed";
import { currency, currencyCompact } from "@/lib/format";

/** Shared glass tooltip. Recharts' default chrome would break the aesthetic. */
function GlassTooltip({
  active,
  payload,
  label,
  valueLabel,
}: {
  active?: boolean;
  payload?: Array<{ value?: number | string; name?: string; payload?: unknown }>;
  label?: string | number;
  valueLabel?: string;
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const value = typeof entry?.value === "number" ? entry.value : 0;

  return (
    <div className="glass rounded-2xl px-3.5 py-2.5">
      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
        {label ?? entry?.name}
      </p>
      <p className="tabular mt-0.5 text-[15px] font-semibold">
        {currency(value)}
        {valueLabel ? (
          <span className="ml-1 text-[11px] font-normal text-[var(--fg-faint)]">
            {valueLabel}
          </span>
        ) : null}
      </p>
    </div>
  );
}

export function RunRateChart() {
  const streams = useWealthStore((s) => s.streams);
  const runRate = useWealthStore(selectRunRate);

  const series = React.useMemo(() => runRateSeries(streams), [streams]);

  const data = React.useMemo(
    () =>
      series.map((value, index) => ({
        month: monthLabels[index] ?? `M${index + 1}`,
        value,
      })),
    [series],
  );

  const first = series[0] ?? 0;
  const last = series.at(-1) ?? 0;
  const growth = first > 0 ? ((last - first) / first) * 100 : 0;

  return (
    <WidgetShell
      title="Run-rate over 12 months"
      caption={`${currency(runRate)} per month · ${growth > 0 ? "+" : ""}${growth.toFixed(0)}% year on year`}
      bodyClassName="pt-1"
    >
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
          >
            <defs>
              <linearGradient id="runRateFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-gold)"
                  stopOpacity={0.42}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-gold)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--fg-faint)", fontSize: 11 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--fg-faint)", fontSize: 11 }}
              tickFormatter={(value: number) => currencyCompact(value)}
              width={56}
            />
            <Tooltip
              content={<GlassTooltip valueLabel="/mo" />}
              cursor={{
                stroke: "var(--color-gold)",
                strokeOpacity: 0.35,
                strokeWidth: 1,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-gold)"
              strokeWidth={2}
              fill="url(#runRateFill)"
              activeDot={{
                r: 4,
                fill: "var(--color-gold)",
                stroke: "var(--page-bg)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WidgetShell>
  );
}

/**
 * Ordered warm-to-cool so the largest slices carry the brand gold and the
 * long tail recedes, while staying distinguishable as categories.
 */
const SLICE_COLORS = [
  "#f5b84e",
  "#e79a44",
  "#d67c45",
  "#c2604c",
  "#a55a6b",
  "#7d5a8c",
  "#55609b",
  "#357a92",
  "#3e9280",
  "#8b9199",
];

export function StreamMixChart() {
  const streams = useWealthStore((s) => s.streams);
  const runRate = useWealthStore(selectRunRate);

  const data = React.useMemo(
    () =>
      streams
        .filter((stream) => stream.monthly > 0)
        .sort((a, b) => b.monthly - a.monthly)
        .map((stream) => ({ name: stream.title, value: stream.monthly })),
    [streams],
  );

  const largest = data[0];
  const concentration = largest
    ? Math.round((largest.value / Math.max(runRate, 1)) * 100)
    : 0;

  return (
    <WidgetShell
      title="Stream mix"
      caption={
        largest
          ? `${largest.name} is ${concentration}% of the total`
          : "No active streams"
      }
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative h-[188px] w-[188px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<GlassTooltip valueLabel="/mo" />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centre label sits inside the donut hole. */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="tabular text-xl font-semibold leading-none">
                {currencyCompact(runRate)}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                per month
              </p>
            </div>
          </div>
        </div>

        <ul className="grid w-full flex-1 grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-1">
          {data.map((entry, index) => (
            <li key={entry.name} className="flex items-center gap-2 text-[12px]">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: SLICE_COLORS[index % SLICE_COLORS.length],
                }}
              />
              <span className="min-w-0 flex-1 truncate text-[var(--fg-muted)]">
                {entry.name}
              </span>
              <span className="tabular shrink-0 text-[var(--fg-faint)]">
                {Math.round((entry.value / Math.max(runRate, 1)) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </WidgetShell>
  );
}
