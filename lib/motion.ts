import type { Transition, Variants } from "framer-motion";

/**
 * Every spring in the app comes from here. Consistent physics across
 * unrelated components is most of what makes motion feel designed
 * rather than assembled.
 */
export const spring = {
  soft: { type: "spring", stiffness: 180, damping: 24, mass: 0.9 },
  snappy: { type: "spring", stiffness: 300, damping: 30, mass: 0.7 },
  gentle: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
  bouncy: { type: "spring", stiffness: 260, damping: 18, mass: 0.8 },
} satisfies Record<string, Transition>;

export const hoverLift = {
  y: -4,
  scale: 1.01,
  transition: spring.soft,
} as const;

export const tapPress = {
  scale: 0.985,
  transition: spring.snappy,
} as const;

/** Parent that staggers its children in on mount. */
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const riseChild: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring.soft,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: spring.soft },
};
