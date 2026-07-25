"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { WidgetShell } from "./widget-shell";
import { Badge } from "@/components/ui/badge";
import { useWealthStore } from "@/store/useWealthStore";
import { cn } from "@/lib/utils";
import type { Idea } from "@/types";

const STAGE_TONE = {
  Spark: "neutral",
  Exploring: "info",
  Committed: "gold",
} as const;

function SortableIdea({ idea }: { idea: Idea }) {
  const removeIdea = useWealthStore((s) => s.removeIdea);
  const cycleStage = useWealthStore((s) => s.cycleIdeaStage);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: idea.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group/idea flex items-center gap-2.5 rounded-2xl border border-[var(--glass-border)] bg-white/6 px-3 py-2.5 dark:bg-white/4",
        isDragging
          ? "z-10 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] opacity-95"
          : "transition-colors hover:bg-white/10 dark:hover:bg-white/7",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${idea.title}`}
        className="shrink-0 cursor-grab touch-none text-[var(--fg-faint)] transition-colors hover:text-[var(--fg)] active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">{idea.title}</p>
        {idea.note ? (
          <p className="truncate text-[11px] text-[var(--fg-faint)]">
            {idea.note}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => cycleStage(idea.id)}
        aria-label={`Change stage of ${idea.title}, currently ${idea.stage}`}
      >
        <Badge tone={STAGE_TONE[idea.stage]}>{idea.stage}</Badge>
      </button>

      <button
        type="button"
        onClick={() => removeIdea(idea.id)}
        aria-label={`Delete ${idea.title}`}
        className="grid size-7 shrink-0 place-items-center rounded-full text-[var(--fg-faint)] opacity-0 transition-all hover:bg-danger/15 hover:text-danger focus-visible:opacity-100 group-hover/idea:opacity-100"
      >
        <Trash2 className="size-3.5" />
      </button>
    </li>
  );
}

export function IdeaDump({ handle }: { handle?: React.ReactNode }) {
  const ideas = useWealthStore((s) => s.ideas);
  const addIdea = useWealthStore((s) => s.addIdea);
  const reorderIdeas = useWealthStore((s) => s.reorderIdeas);
  const [draft, setDraft] = React.useState("");

  const sensors = useSensors(
    // A small activation distance keeps click-to-delete working on the row.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = ideas.findIndex((idea) => idea.id === active.id);
    const to = ideas.findIndex((idea) => idea.id === over.id);
    if (from === -1 || to === -1) return;
    reorderIdeas(from, to);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    addIdea(draft);
    setDraft("");
  };

  return (
    <WidgetShell
      title="Idea Dump"
      caption={`${ideas.length} in the queue · drag to prioritise`}
      handle={handle}
    >
      <form onSubmit={submit} className="mb-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Capture an idea…"
          aria-label="New idea"
          className="h-10 min-w-0 flex-1 rounded-full border border-[var(--glass-border)] bg-white/8 px-4 text-[13px] outline-none transition-colors placeholder:text-[var(--fg-faint)] focus-visible:border-gold dark:bg-white/5"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Add idea"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-b from-gold-bright to-gold text-[#241a06] transition-opacity disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={ideas.map((idea) => idea.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-1.5">
            {ideas.map((idea) => (
              <SortableIdea key={idea.id} idea={idea} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {ideas.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-[var(--fg-faint)]">
          Empty board. The next stream starts as a line of text.
        </p>
      ) : null}
    </WidgetShell>
  );
}
