"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { IdeaDump } from "@/components/widgets/idea-dump";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useWealthStore } from "@/store/useWealthStore";
import { riseChild, staggerParent } from "@/lib/motion";
import type { Idea } from "@/types";

const STAGE_COPY: Record<Idea["stage"], string> = {
  Spark: "Written down, nothing committed. Cheap to keep, cheap to drop.",
  Exploring: "Being tested. Should either earn or be killed within weeks.",
  Committed: "Has your time and money. Treat additions here as expensive.",
};

const STAGES: Idea["stage"][] = ["Committed", "Exploring", "Spark"];

export default function IdeasPage() {
  const ideas = useWealthStore((s) => s.ideas);

  return (
    <motion.div variants={staggerParent} initial="hidden" animate="show">
      <PageHeader
        title="Ideas"
        description="Capture is free, commitment is not. The board exists so you can say no to nine of these on purpose."
      />

      <div className="grid gap-6 pb-6 lg:grid-cols-[1fr_1fr]">
        <IdeaDump />

        <motion.div variants={riseChild} className="space-y-6">
          {STAGES.map((stage) => {
            const inStage = ideas.filter((idea) => idea.stage === stage);
            return (
              <GlassPanel key={stage} className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-[15px] font-semibold">{stage}</h2>
                  <span className="tabular text-[13px] text-[var(--fg-faint)]">
                    {inStage.length}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-[var(--fg-faint)]">
                  {STAGE_COPY[stage]}
                </p>

                {inStage.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {inStage.map((idea) => (
                      <li
                        key={idea.id}
                        className="rounded-2xl border border-[var(--glass-border)] bg-white/6 px-3.5 py-2.5 dark:bg-white/4"
                      >
                        <p className="text-[13px] font-medium">{idea.title}</p>
                        {idea.note ? (
                          <p className="mt-0.5 text-[11px] text-[var(--fg-faint)]">
                            {idea.note}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-[12px] text-[var(--fg-faint)]">
                    Nothing at this stage.
                  </p>
                )}
              </GlassPanel>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
