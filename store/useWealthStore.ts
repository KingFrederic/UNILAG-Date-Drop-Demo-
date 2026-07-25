"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  agents as seedAgents,
  goals as seedGoals,
  ideas as seedIdeas,
  incomeStreams as seedStreams,
  learningTracks as seedTracks,
  roadmap as seedRoadmap,
} from "@/data/seed";
import type {
  Agent,
  Goal,
  Idea,
  IncomeStream,
  LearningTrack,
  RoadmapStage,
} from "@/types";
import { uid } from "@/lib/utils";

/** Dashboard widget keys, in their default vertical order. */
export const WIDGET_KEYS = ["goals", "ideas", "agents"] as const;
export type WidgetKey = (typeof WIDGET_KEYS)[number];

interface WealthState {
  goals: Goal[];
  streams: IncomeStream[];
  ideas: Idea[];
  agents: Agent[];
  tracks: LearningTrack[];
  roadmap: RoadmapStage[];
  widgetOrder: WidgetKey[];

  updateGoal: (id: string, patch: Partial<Pick<Goal, "current" | "goal">>) => void;
  updateStream: (
    id: string,
    patch: Partial<Pick<IncomeStream, "monthly" | "status">>,
  ) => void;
  addIdea: (title: string) => void;
  removeIdea: (id: string) => void;
  cycleIdeaStage: (id: string) => void;
  reorderIdeas: (from: number, to: number) => void;
  setWidgetOrder: (order: WidgetKey[]) => void;
  toggleAgent: (id: string) => void;
  reportAgent: (id: string, finding: string, live: boolean) => void;
  advanceRoadmap: () => void;
  reset: () => void;
}

const IDEA_STAGES: Idea["stage"][] = ["Spark", "Exploring", "Committed"];

function move<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice();
  const [item] = next.splice(from, 1);
  if (item === undefined) return list;
  next.splice(to, 0, item);
  return next;
}

const initial = {
  goals: seedGoals,
  streams: seedStreams,
  ideas: seedIdeas,
  agents: seedAgents,
  tracks: seedTracks,
  roadmap: seedRoadmap,
  widgetOrder: [...WIDGET_KEYS] as WidgetKey[],
};

export const useWealthStore = create<WealthState>()(
  persist(
    (set) => ({
      ...initial,

      updateGoal: (id, patch) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...patch } : goal,
          ),
        })),

      updateStream: (id, patch) =>
        set((state) => ({
          streams: state.streams.map((stream) =>
            stream.id === id ? { ...stream, ...patch } : stream,
          ),
        })),

      addIdea: (title) =>
        set((state) => ({
          ideas: [
            { id: uid("idea"), title: title.trim(), stage: "Spark" },
            ...state.ideas,
          ],
        })),

      removeIdea: (id) =>
        set((state) => ({ ideas: state.ideas.filter((idea) => idea.id !== id) })),

      cycleIdeaStage: (id) =>
        set((state) => ({
          ideas: state.ideas.map((idea) => {
            if (idea.id !== id) return idea;
            const index = IDEA_STAGES.indexOf(idea.stage);
            const nextStage = IDEA_STAGES[(index + 1) % IDEA_STAGES.length];
            return nextStage ? { ...idea, stage: nextStage } : idea;
          }),
        })),

      reorderIdeas: (from, to) =>
        set((state) => ({ ideas: move(state.ideas, from, to) })),

      setWidgetOrder: (order) => set({ widgetOrder: order }),

      toggleAgent: (id) =>
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === id
              ? { ...agent, status: agent.status === "Active" ? "Idle" : "Active" }
              : agent,
          ),
        })),

      reportAgent: (id, finding, live) =>
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === id
              ? {
                  ...agent,
                  lastAction: finding,
                  lastRunAt: Date.now(),
                  lastActionLive: live,
                }
              : agent,
          ),
        })),

      advanceRoadmap: () =>
        set((state) => {
          const index = state.roadmap.findIndex((stage) => !stage.complete);
          if (index === -1) return state;
          return {
            roadmap: state.roadmap.map((stage, i) =>
              i === index ? { ...stage, complete: true } : stage,
            ),
          };
        }),

      reset: () => set({ ...initial }),
    }),
    {
      name: "path-to-wealth:v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      /**
       * Rehydration is deferred to StoreHydration so the first client render
       * matches the server render. Without this, localStorage values would be
       * applied during store creation and trip a hydration mismatch.
       */
      skipHydration: true,
    },
  ),
);

/* ------------------------------- selectors ------------------------------ */

export const selectRunRate = (state: WealthState) =>
  state.streams.reduce((total, stream) => total + stream.monthly, 0);

export const selectActiveStreams = (state: WealthState) =>
  state.streams.filter((stream) => stream.monthly > 0).length;

export const selectActiveAgents = (state: WealthState) =>
  state.agents.filter((agent) => agent.status === "Active").length;

/**
 * Combined monthly totals across every stream, for the area chart.
 *
 * Deliberately a plain helper rather than a store selector: it builds a new
 * array on every call, and zustand compares selector results by reference, so
 * using it as a selector re-renders forever.  Call it inside a useMemo keyed
 * on `streams`.
 */
export function runRateSeries(streams: IncomeStream[]): number[] {
  const months = streams[0]?.history.length ?? 0;
  return Array.from({ length: months }, (_, monthIndex) =>
    streams.reduce((total, stream) => total + (stream.history[monthIndex] ?? 0), 0),
  );
}
