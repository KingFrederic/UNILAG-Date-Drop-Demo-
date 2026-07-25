"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { resolveIcon } from "@/components/icon-map";
import { useWealthStore } from "@/store/useWealthStore";
import { riseChild, staggerParent } from "@/lib/motion";

export default function LearningPage() {
  const tracks = useWealthStore((s) => s.tracks);
  const totalHours = tracks.reduce((sum, track) => sum + track.hours, 0);
  const average =
    tracks.length > 0
      ? tracks.reduce((sum, track) => sum + track.progress, 0) / tracks.length
      : 0;

  return (
    <motion.div variants={staggerParent} initial="hidden" animate="show">
      <PageHeader
        title="Learning"
        description="Skills are the only asset that compounds before you have capital. These four are the ones currently paying rent."
      />

      <div className="space-y-6 pb-6">
        <motion.div variants={riseChild}>
          <GlassPanel className="flex flex-wrap items-center gap-8 p-6 sm:p-8">
            <ProgressRing value={average} size={92} stroke={6}>
              <span className="tabular text-lg font-semibold">
                {Math.round(average)}%
              </span>
            </ProgressRing>

            <div className="min-w-[180px] flex-1">
              <h2 className="text-[15px] font-semibold">Across all tracks</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                {totalHours} hours invested across {tracks.length} tracks. The
                one nearest completion is usually the one worth finishing first
                — partial skills don&apos;t compound.
              </p>
            </div>
          </GlassPanel>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tracks.map((track) => {
            const Icon = resolveIcon(track.icon);
            return (
              <motion.div key={track.id} variants={riseChild}>
                <GlassPanel lift className="h-full p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold/12 text-gold">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[15px] font-semibold leading-tight">
                        {track.title}
                      </h2>
                      <p className="mt-0.5 text-[12px] text-[var(--fg-faint)]">
                        {track.provider} · {track.hours}h
                      </p>
                    </div>
                    <span className="tabular text-[13px] font-medium text-[var(--fg-muted)]">
                      {track.progress}%
                    </span>
                  </div>

                  <Progress
                    value={track.progress}
                    className="mt-4"
                    label={`${track.title} progress`}
                  />
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
