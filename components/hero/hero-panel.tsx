"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { MountainScene } from "./mountain-scene";
import { Roadmap } from "./roadmap";
import { Button } from "@/components/ui/button";
import { heroCopy } from "@/data/seed";
import { useWealthStore, selectRunRate } from "@/store/useWealthStore";
import { useUIStore } from "@/store/useUIStore";
import { currency } from "@/lib/format";
import { riseChild, staggerParent } from "@/lib/motion";

export function HeroPanel() {
  const roadmap = useWealthStore((s) => s.roadmap);
  const advanceRoadmap = useWealthStore((s) => s.advanceRoadmap);
  const runRate = useWealthStore(selectRunRate);
  const setAssistantOpen = useUIStore((s) => s.setAssistantOpen);

  const completed = roadmap.filter((stage) => stage.complete).length;
  const nextStage = roadmap.find((stage) => !stage.complete);

  return (
    <section className="glass relative isolate overflow-hidden rounded-[var(--radius-glass)]">
      <MountainScene />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="relative px-6 pb-8 pt-12 sm:px-10 sm:pb-10 sm:pt-16 lg:px-14 lg:pb-12 lg:pt-20"
      >
        <motion.div variants={riseChild} className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-md">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-gold text-gold" />
            Stage {Math.min(completed + 1, roadmap.length)} of {roadmap.length}
            {nextStage ? ` · ${nextStage.label}` : " · Complete"}
          </span>
        </motion.div>

        <motion.h1
          variants={riseChild}
          className="display-title mt-6 max-w-4xl text-[clamp(2.25rem,5.2vw,4.25rem)] text-white"
        >
          {heroCopy.title}
        </motion.h1>

        <motion.p
          variants={riseChild}
          className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base"
        >
          {heroCopy.subtitle}
        </motion.p>

        <motion.div
          variants={riseChild}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => setAssistantOpen(true)}
          >
            <Compass />
            View Blueprint
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={advanceRoadmap}
            disabled={!nextStage}
            className="border-white/25 bg-white/10 text-white hover:bg-white/20"
          >
            {nextStage ? "Continue Journey" : "Journey Complete"}
            <ArrowRight />
          </Button>

          <div className="ml-auto hidden text-right sm:block">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              Combined run-rate
            </p>
            <p className="tabular text-2xl font-semibold text-white">
              {currency(runRate)}
              <span className="ml-1 text-[13px] font-normal text-white/50">
                /mo
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={riseChild}
          className="mt-12 border-t border-white/12 pt-8"
        >
          <Roadmap stages={roadmap} />
        </motion.div>
      </motion.div>
    </section>
  );
}
