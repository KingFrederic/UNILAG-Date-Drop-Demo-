"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
  duration?: number;
  className?: string;
}

/**
 * Counts up to `value` when scrolled into view, and re-animates from the
 * previous value whenever it changes — so editing a goal reads as movement
 * rather than a jump cut. Writes to the DOM node directly to avoid a React
 * render on every animation frame.
 *
 * The rendered text is always the final value: that keeps SSR and the first
 * client render identical (and leaves a real figure for anyone without
 * JavaScript). The count-up starts from 0 in an effect, after hydration.
 */
export function AnimatedNumber({
  value,
  format,
  duration = 1.1,
  className,
}: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const previous = React.useRef<number | null>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduceMotion) {
      node.textContent = format(value);
      previous.current = value;
      return;
    }

    // Hold the server-rendered text until the element is actually on screen,
    // otherwise the count-up happens where nobody sees it.
    if (!inView && previous.current === null) return;

    const from = previous.current ?? 0;
    previous.current = value;
    if (from === value) return;

    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });

    return () => controls.stop();
  }, [value, inView, duration, format, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
