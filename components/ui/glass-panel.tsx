"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

/**
 * Writes pointer position into --mx/--my so the CSS sheen can track the
 * cursor. Done with custom properties rather than React state — a state
 * update per pointermove would re-render the whole panel subtree.
 */
export function useGlassReflection<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);

  const onPointerMove = React.useCallback((event: React.PointerEvent<T>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

  return { ref, onPointerMove };
}

// motion's children type also admits MotionValue, which we never render.
interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  /** Adds the pointer-tracked specular sheen. */
  reflective?: boolean;
  /** Adds the masked gradient rim light. */
  rim?: boolean;
  /** Lifts the panel on hover. */
  lift?: boolean;
  inset?: boolean;
  as?: "div" | "section" | "article" | "aside";
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      children,
      reflective = true,
      rim = true,
      lift = false,
      inset = false,
      ...props
    },
    forwardedRef,
  ) => {
    const { ref, onPointerMove } = useGlassReflection<HTMLDivElement>();
    const reduceMotion = useReducedMotion();

    React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement);

    return (
      <motion.div
        ref={ref}
        onPointerMove={reflective ? onPointerMove : undefined}
        whileHover={lift && !reduceMotion ? { y: -4, scale: 1.008 } : undefined}
        transition={spring.soft}
        className={cn(
          "glass group/glass overflow-hidden",
          inset && "rounded-[var(--radius-panel)]",
          className,
        )}
        {...props}
      >
        {rim ? <span className="glass-rim" aria-hidden /> : null}
        {reflective ? <span className="glass-sheen" aria-hidden /> : null}
        {/* Children come after the decorative layers so they paint on top
            without needing z-index on every panel. */}
        {children}
      </motion.div>
    );
  },
);
GlassPanel.displayName = "GlassPanel";
