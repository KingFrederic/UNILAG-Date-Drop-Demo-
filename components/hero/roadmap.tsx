"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { RoadmapStage } from "@/types";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RoadmapProps {
  stages: RoadmapStage[];
}

export function Roadmap({ stages }: RoadmapProps) {
  const reduceMotion = useReducedMotion();
  const completed = stages.filter((stage) => stage.complete).length;
  const activeIndex = Math.min(completed, stages.length - 1);
  // The connecting line should stop at the current marker, not the end.
  const fill =
    stages.length > 1 ? (activeIndex / (stages.length - 1)) * 100 : 0;

  return (
    <div className="relative">
      {/* Track sits behind the markers, inset by half a marker on each side. */}
      <div className="absolute left-0 right-0 top-[13px] hidden h-px sm:block">
        <div className="mx-[6%] h-full bg-white/15">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-bright to-gold"
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: fill / 100 }}
            style={{ transformOrigin: "left" }}
            transition={{ ...spring.gentle, delay: 0.4 }}
          />
        </div>
      </div>

      <ol className="relative grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        {stages.map((stage, index) => {
          const isCurrent = index === activeIndex && !stage.complete;
          return (
            <motion.li
              key={stage.id}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.soft, delay: 0.15 + index * 0.07 }}
              className="flex flex-col items-center px-1 text-center"
            >
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full border text-[11px] font-semibold transition-colors",
                  stage.complete &&
                    "border-transparent bg-gradient-to-b from-gold-bright to-gold text-[#241a06]",
                  isCurrent &&
                    "border-gold bg-gold/15 text-gold shadow-[0_0_0_5px_rgba(245,184,78,0.14)]",
                  !stage.complete &&
                    !isCurrent &&
                    "border-white/25 bg-black/30 text-white/45",
                )}
              >
                {stage.complete ? (
                  <Check className="size-3.5" strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </span>

              <p
                className={cn(
                  "mt-2.5 text-[12px] font-medium leading-tight",
                  stage.complete || isCurrent ? "text-white" : "text-white/50",
                )}
              >
                {stage.label}
              </p>
              <p className="mt-1 hidden text-[11px] leading-snug text-white/40 lg:block">
                {stage.detail}
              </p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
