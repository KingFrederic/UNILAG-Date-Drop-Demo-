"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
}

/**
 * Hand-rolled rather than a Recharts instance: a card rail can hold a dozen
 * of these, and ten Recharts responsive containers on one row is a lot of
 * layout work for a 32px-tall decoration.
 */
export function Sparkline({
  data,
  width = 120,
  height = 34,
  className,
  stroke = "var(--color-gold)",
}: SparklineProps) {
  const reduceMotion = useReducedMotion();
  const gradientId = React.useId();

  const { line, area } = React.useMemo(() => {
    if (data.length === 0) return { line: "", area: "" };
    const max = Math.max(...data);
    const min = Math.min(...data);
    const span = max - min || 1;
    const step = data.length > 1 ? width / (data.length - 1) : width;

    const points = data.map((value, index) => {
      const x = index * step;
      // Inset by 2px top and bottom so the stroke isn't clipped.
      const y = height - 2 - ((value - min) / span) * (height - 4);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    return {
      line: `M${points.join(" L")}`,
      area: `M0,${height} L${points.join(" L")} L${width},${height} Z`,
    };
  }, [data, width, height]);

  if (!line) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <motion.path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
