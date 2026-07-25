"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Cinematic ridgeline, drawn rather than photographed.
 *
 * Three silhouette layers at decreasing opacity over a golden-hour sky, each
 * drifting at a different rate as the page scrolls. Vector keeps it crisp at
 * any width and costs a couple of kilobytes instead of a hero JPEG.
 */
export function MountainScene() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const farY = useTransform(scrollY, [0, 600], [0, 40]);
  const midY = useTransform(scrollY, [0, 600], [0, 70]);
  const nearY = useTransform(scrollY, [0, 600], [0, 110]);
  const sunY = useTransform(scrollY, [0, 600], [0, 25]);

  const still = { y: 0 };

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#2a1c46_0%,#7b3f4e_38%,#c9683a_66%,#e8a24b_100%)] dark:bg-[linear-gradient(180deg,#120b22_0%,#3d1f2e_38%,#7a3a20_70%,#b8752c_100%)]" />

      {/* Low sun, sitting just above the ridge. */}
      <motion.div
        style={reduceMotion ? still : { y: sunY }}
        className="absolute left-1/2 top-[46%] size-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,226,163,0.95),rgba(245,184,78,0.5)_45%,transparent_70%)] blur-xl"
      />

      {/* Atmospheric haze band across the ridgeline. */}
      <div className="absolute inset-x-0 top-[52%] h-32 bg-[linear-gradient(180deg,transparent,rgba(255,196,120,0.28),transparent)] blur-lg" />

      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1600 600"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Furthest ridge — lightest, most atmospheric perspective. */}
        <motion.path
          style={reduceMotion ? still : { y: farY }}
          d="M0 400 L180 300 L300 350 L430 250 L560 330 L700 240 L860 330 L1000 260 L1150 340 L1300 270 L1450 350 L1600 300 L1600 600 L0 600 Z"
          fill="rgba(255,255,255,0.10)"
        />
        {/* Middle ridge. */}
        <motion.path
          style={reduceMotion ? still : { y: midY }}
          d="M0 460 L140 380 L280 430 L420 340 L580 420 L740 350 L900 430 L1060 360 L1220 440 L1380 370 L1520 440 L1600 400 L1600 600 L0 600 Z"
          fill="rgba(40,18,30,0.55)"
        />
        {/* Nearest ridge — near-black, anchors the composition. */}
        <motion.path
          style={reduceMotion ? still : { y: nearY }}
          d="M0 540 L160 460 L320 520 L500 430 L680 510 L840 440 L1020 520 L1200 450 L1380 525 L1600 470 L1600 600 L0 600 Z"
          fill="rgba(12,8,14,0.88)"
        />
      </svg>

      {/* Legibility overlay. The headline has to win against the sky. */}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(9,9,9,0.92)_0%,rgba(9,9,9,0.72)_42%,rgba(9,9,9,0.25)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,transparent,rgba(9,9,9,0.75))]" />

      <div className="noise-layer opacity-[0.06]" />
    </div>
  );
}
