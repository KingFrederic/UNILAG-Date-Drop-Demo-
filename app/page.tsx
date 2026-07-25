"use client";

import { motion } from "framer-motion";
import { Group, Panel, Separator } from "react-resizable-panels";
import { HeroPanel } from "@/components/hero/hero-panel";
import { StatStrip } from "@/components/widgets/stat-strip";
import { WidgetColumn } from "@/components/widgets/widget-column";
import { IncomeStreams } from "@/components/widgets/income-streams";
import { RunRateChart, StreamMixChart } from "@/components/widgets/charts";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { staggerParent } from "@/lib/motion";

function AnalyticsColumn() {
  return (
    <div className="space-y-6">
      <RunRateChart />
      <StreamMixChart />
    </div>
  );
}

export default function DashboardPage() {
  // False on the server and first paint, so the stacked layout below is what
  // hydration compares against. The resizable split appears after mount.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-6"
    >
      <HeroPanel />

      <StatStrip />

      <IncomeStreams />

      {isDesktop ? (
        <Group
          orientation="horizontal"
          className="items-stretch"
          style={{ gap: 0 }}
        >
          <Panel defaultSize="42%" minSize="28%" className="pr-3">
            <WidgetColumn />
          </Panel>

          <Separator className="group/sep mx-1 w-2 cursor-col-resize">
            <span className="mx-auto block h-full w-px rounded-full bg-[var(--hairline)] transition-colors group-hover/sep:bg-gold/60 group-data-[state=drag]/sep:bg-gold" />
          </Separator>

          <Panel minSize="34%" className="pl-3">
            <AnalyticsColumn />
          </Panel>
        </Group>
      ) : (
        <div className="space-y-6">
          <WidgetColumn />
          <AnalyticsColumn />
        </div>
      )}
    </motion.div>
  );
}
