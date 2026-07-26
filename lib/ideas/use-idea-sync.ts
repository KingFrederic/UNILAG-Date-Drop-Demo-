"use client";

import * as React from "react";
import { useWealthStore } from "@/store/useWealthStore";
import type { Idea } from "@/types";

/**
 * Keeps the idea board in step with the backend when one is configured, and
 * silently stays local when it is not.
 *
 * The store remains the single source of truth for rendering, so the UI is
 * optimistic: every action updates local state immediately and then writes
 * through. A failed write does not roll the UI back — losing a captured idea
 * because the network blipped is worse than a row that syncs on next load.
 */
export type IdeaBackend = "checking" | "remote" | "local";

export function useIdeaSync() {
  const ideas = useWealthStore((s) => s.ideas);
  const addIdeaLocal = useWealthStore((s) => s.addIdea);
  const removeIdeaLocal = useWealthStore((s) => s.removeIdea);
  const cycleStageLocal = useWealthStore((s) => s.cycleIdeaStage);
  const reorderLocal = useWealthStore((s) => s.reorderIdeas);
  const replaceIdeas = useWealthStore((s) => s.replaceIdeas);

  const [backend, setBackend] = React.useState<IdeaBackend>("checking");

  // Hydrate from the backend once on mount.
  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/ideas", { cache: "no-store" });
        if (!response.ok) throw new Error("read failed");
        const data = await response.json();

        if (cancelled) return;
        if (!data?.configured) {
          setBackend("local");
          return;
        }

        setBackend("remote");
        // An empty remote board on first run means "not seeded yet" rather
        // than "deliberately empty", so keep whatever is local in that case.
        if (Array.isArray(data.ideas) && data.ideas.length > 0) {
          replaceIdeas(data.ideas as Idea[]);
        }
      } catch {
        if (!cancelled) setBackend("local");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [replaceIdeas]);

  const remote = backend === "remote";

  const add = React.useCallback(
    async (title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      if (!remote) {
        addIdeaLocal(trimmed);
        return;
      }

      try {
        const response = await fetch("/api/ideas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: trimmed, position: 0 }),
        });
        const data = await response.json();
        if (response.ok && data?.idea) {
          // Use the row the database created so the id matches on both sides.
          replaceIdeas([data.idea as Idea, ...ideas]);
          return;
        }
      } catch {
        // fall through
      }
      addIdeaLocal(trimmed);
    },
    [remote, addIdeaLocal, replaceIdeas, ideas],
  );

  const remove = React.useCallback(
    async (id: string) => {
      removeIdeaLocal(id);
      if (!remote) return;
      try {
        await fetch(`/api/ideas?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch {
        // Local state already reflects the deletion.
      }
    },
    [remote, removeIdeaLocal],
  );

  const cycleStage = React.useCallback(
    async (id: string) => {
      cycleStageLocal(id);
      if (!remote) return;
      // Read the post-update stage straight from the store so the write
      // matches what the user can see.
      const next = useWealthStore.getState().ideas.find((idea) => idea.id === id);
      if (!next) return;
      try {
        await fetch("/api/ideas", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, patch: { stage: next.stage } }),
        });
      } catch {
        // Local state already reflects the change.
      }
    },
    [remote, cycleStageLocal],
  );

  const reorder = React.useCallback(
    async (from: number, to: number) => {
      reorderLocal(from, to);
      if (!remote) return;
      const ordered = useWealthStore.getState().ideas;
      try {
        // Positions are only meaningful relative to each other, so rewrite
        // the whole board rather than trying to patch a range.
        await Promise.all(
          ordered.map((idea, index) =>
            fetch("/api/ideas", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: idea.id, patch: { position: index } }),
            }),
          ),
        );
      } catch {
        // Order is correct locally; it will resync on next load.
      }
    },
    [remote, reorderLocal],
  );

  return { ideas, backend, add, remove, cycleStage, reorder };
}
