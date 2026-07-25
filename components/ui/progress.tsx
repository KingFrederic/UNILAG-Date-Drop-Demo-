"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

const ACCENTS = {
  gold: "from-gold-bright to-gold",
  success: "from-success to-[#22c55e]",
  info: "from-info to-[#3b82f6]",
  danger: "from-danger to-[#dc2626]",
} as const;

export type ProgressAccent = keyof typeof ACCENTS;

interface ProgressProps {
  value: number;
  accent?: ProgressAccent;
  className?: string;
  label?: string;
  /** Adds a travelling highlight along the filled portion. */
  shimmer?: boolean;
}

export function Progress({
  value,
  accent = "gold",
  className,
  label,
  shimmer = true,
}: ProgressProps) {
  const reduceMotion = useReducedMotion();
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[var(--track)]",
        className,
      )}
    >
      <motion.div
        className={cn(
          "relative h-full rounded-full bg-gradient-to-r",
          ACCENTS[accent],
        )}
        initial={reduceMotion ? false : { width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ ...spring.gentle, delay: reduceMotion ? 0 : 0.15 }}
      >
        {shimmer && !reduceMotion ? (
          <span className="absolute inset-y-0 -inset-x-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent" />
        ) : null}
      </motion.div>
    </div>
  );
}

/** Thin ring version, used where a bar would be too heavy. */
export function ProgressRing({
  value,
  size = 56,
  stroke = 4,
  accent = "gold",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  accent?: ProgressAccent;
  children?: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const pct = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const colors: Record<ProgressAccent, string> = {
    gold: "var(--color-gold)",
    success: "var(--color-success)",
    info: "var(--color-info)",
    danger: "var(--color-danger)",
  };

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--track)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[accent]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
          transition={{ ...spring.gentle, delay: reduceMotion ? 0 : 0.2 }}
        />
      </svg>
      <div className="absolute grid place-items-center">{children}</div>
    </div>
  );
}
