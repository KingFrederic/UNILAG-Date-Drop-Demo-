"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * The room behind the glass.
 *
 * Deliberately image-free: large radial "light blooms" in golden-hour tones,
 * slowly drifting, parallaxed against the pointer, with a film-grain layer on
 * top. Gradients this large band badly on cheap panels — the grain is what
 * stops it looking muddy, and it costs nothing.
 */
export function Backdrop() {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const px = useSpring(x, { stiffness: 40, damping: 20, mass: 1.2 });
  const py = useSpring(y, { stiffness: 40, damping: 20, mass: 1.2 });

  // Different travel per layer is what actually produces depth; a shared
  // offset would just slide the whole scene.
  const nearX = useTransform(px, (v) => v * 40);
  const nearY = useTransform(py, (v) => v * 28);
  const midX = useTransform(px, (v) => v * -24);
  const midY = useTransform(py, (v) => v * -18);
  const farX = useTransform(px, (v) => v * 12);
  const farY = useTransform(py, (v) => v * 9);

  React.useEffect(() => {
    if (reduceMotion) return;
    const onMove = (event: PointerEvent) => {
      // Normalised to roughly -1..1 around the viewport centre.
      x.set((event.clientX / window.innerWidth - 0.5) * 2);
      y.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, x, y]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--page-bg)]"
    >
      {/* Warm key light, upper left. */}
      <motion.div
        style={reduceMotion ? undefined : { x: nearX, y: nearY }}
        className="absolute -left-[15%] -top-[25%] h-[75vh] w-[75vw] animate-drift rounded-full opacity-70 blur-[110px] will-change-transform"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,184,78,0.55),rgba(245,184,78,0.12)_45%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(245,184,78,0.42),rgba(201,138,36,0.14)_45%,transparent_70%)]" />
      </motion.div>

      {/* Deep ember, lower right — gives the composition a second source. */}
      <motion.div
        style={reduceMotion ? undefined : { x: midX, y: midY }}
        className="absolute -bottom-[30%] -right-[10%] h-[70vh] w-[65vw] animate-drift rounded-full opacity-60 blur-[120px] will-change-transform [animation-delay:-14s]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,124,58,0.4),rgba(201,138,36,0.1)_50%,transparent_72%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(196,84,32,0.34),rgba(120,52,18,0.12)_50%,transparent_72%)]" />
      </motion.div>

      {/* Cool counter-light keeps the warm tones from reading as sepia. */}
      <motion.div
        style={reduceMotion ? undefined : { x: farX, y: farY }}
        className="absolute left-[35%] top-[35%] h-[55vh] w-[55vw] animate-drift rounded-full opacity-50 blur-[130px] will-change-transform [animation-delay:-28s]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(56,132,138,0.3),transparent_68%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(20,90,100,0.42),transparent_68%)]" />
      </motion.div>

      {/* Horizon wash: suggests a window without drawing one. */}
      <div className="absolute inset-x-0 top-0 h-[45vh] bg-[linear-gradient(180deg,rgba(255,214,150,0.28),transparent)] dark:bg-[linear-gradient(180deg,rgba(245,184,78,0.14),transparent)]" />

      {/* Vignette pushes focus to the centre and anchors the floating panels. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,rgba(0,0,0,0.35))] dark:bg-[radial-gradient(120%_90%_at_50%_0%,transparent_30%,rgba(0,0,0,0.72))]" />

      <div className="noise-layer" />
    </div>
  );
}
