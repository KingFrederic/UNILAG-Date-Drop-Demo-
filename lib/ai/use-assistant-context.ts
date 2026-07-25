"use client";

import * as React from "react";
import {
  selectActiveAgents,
  selectRunRate,
  useWealthStore,
} from "@/store/useWealthStore";
import type { AssistantContext } from "./context";

/**
 * Builds the live dashboard snapshot sent to the model. Shared by the
 * assistant and the agents so both reason over exactly the same numbers.
 */
export function useAssistantContext(): AssistantContext {
  const streams = useWealthStore((s) => s.streams);
  const goals = useWealthStore((s) => s.goals);
  const ideas = useWealthStore((s) => s.ideas);
  const runRate = useWealthStore(selectRunRate);
  const activeAgents = useWealthStore(selectActiveAgents);

  return React.useMemo(() => {
    const ranked = [...streams].sort((a, b) => b.monthly - a.monthly);
    const top = ranked[0];
    const weakest = ranked.filter((stream) => stream.monthly > 0).at(-1);

    return {
      runRate,
      realisedIncome: goals.find((goal) => goal.id === "monthly-income")?.current ?? 0,
      netWorth: goals.find((goal) => goal.id === "net-worth")?.current ?? 0,
      topStream: top ? { title: top.title, monthly: top.monthly } : null,
      weakestStream: weakest
        ? { title: weakest.title, monthly: weakest.monthly }
        : null,
      activeAgents,
      ideaCount: ideas.length,
    };
  }, [streams, goals, ideas, runRate, activeAgents]);
}
