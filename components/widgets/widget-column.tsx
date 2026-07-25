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
import { GripVertical } from "lucide-react";
import { GoalTracker } from "./goal-tracker";
import { IdeaDump } from "./idea-dump";
import { AgentsPanel } from "./agents-panel";
import { useWealthStore, type WidgetKey } from "@/store/useWealthStore";
import { cn } from "@/lib/utils";

const WIDGETS: Record<
  WidgetKey,
  { label: string; render: (handle: React.ReactNode) => React.ReactNode }
> = {
  goals: { label: "Goal Tracker", render: (h) => <GoalTracker handle={h} /> },
  ideas: { label: "Idea Dump", render: (h) => <IdeaDump handle={h} /> },
  agents: { label: "AI Agents", render: (h) => <AgentsPanel handle={h} /> },
};

function SortableWidget({ id }: { id: WidgetKey }) {
  const widget = WIDGETS[id];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const handle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      aria-label={`Reorder ${widget.label} panel`}
      className="mt-0.5 shrink-0 cursor-grab touch-none rounded-md text-[var(--fg-faint)] opacity-0 transition-all hover:text-[var(--fg)] focus-visible:opacity-100 active:cursor-grabbing group-hover/widget:opacity-100"
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group/widget relative",
        isDragging && "z-20 opacity-95 [&_.glass]:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)]",
      )}
    >
      {widget.render(handle)}
    </div>
  );
}

/** The dashboard's left column: three panels the user can reorder. */
export function WidgetColumn() {
  const order = useWealthStore((s) => s.widgetOrder);
  const setOrder = useWealthStore((s) => s.setWidgetOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = order.indexOf(active.id as WidgetKey);
    const to = order.indexOf(over.id as WidgetKey);
    if (from === -1 || to === -1) return;
    const next = order.slice();
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    setOrder(next);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {order.map((key) => (
            <SortableWidget key={key} id={key} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
