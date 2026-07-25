"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { WidgetShell } from "./widget-shell";
import { resolveIcon } from "@/components/icon-map";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWealthStore } from "@/store/useWealthStore";
import { currency, currencyCompact, percent } from "@/lib/format";
import { progressOf } from "@/lib/utils";
import { spring, staggerParent } from "@/lib/motion";
import type { Goal } from "@/types";

function EditGoalDialog({
  goal,
  onClose,
}: {
  goal: Goal | null;
  onClose: () => void;
}) {
  const updateGoal = useWealthStore((s) => s.updateGoal);
  const [current, setCurrent] = React.useState("");
  const [target, setTarget] = React.useState("");

  React.useEffect(() => {
    if (!goal) return;
    setCurrent(String(goal.current));
    setTarget(String(goal.goal));
  }, [goal]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!goal) return;
    const nextCurrent = Number(current);
    const nextTarget = Number(target);
    updateGoal(goal.id, {
      current: Number.isFinite(nextCurrent) ? Math.max(0, nextCurrent) : goal.current,
      goal: Number.isFinite(nextTarget) && nextTarget > 0 ? nextTarget : goal.goal,
    });
    onClose();
  };

  const field =
    "h-11 w-full rounded-2xl border border-[var(--glass-border)] bg-white/8 px-4 text-[15px] tabular outline-none transition-colors focus-visible:border-gold dark:bg-white/5";

  return (
    <Dialog open={Boolean(goal)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="display-title text-2xl">
            {goal?.title ?? "Goal"}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[var(--fg-muted)]">
            Numbers update everywhere immediately and are saved to this browser.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
              Current
            </span>
            <input
              type="number"
              min={0}
              step={100}
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
              Target
            </span>
            <input
              type="number"
              min={1}
              step={100}
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className={field}
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GoalTracker({ handle }: { handle?: React.ReactNode }) {
  const goals = useWealthStore((s) => s.goals);
  const [editing, setEditing] = React.useState<Goal | null>(null);

  return (
    <>
      <WidgetShell
        title="Goal Tracker"
        caption="Where you are against where you said you'd be"
        handle={handle}
      >
        <motion.ul
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {goals.map((goal) => {
            const Icon = resolveIcon(goal.icon);
            const pct = progressOf(goal.current, goal.goal);
            // Six-figure targets overflow the card, so compact them.
            const format = goal.goal >= 100_000 ? currencyCompact : currency;

            return (
              <motion.li
                key={goal.id}
                layout
                transition={spring.soft}
                className="group/goal rounded-[var(--radius-panel)] border border-[var(--glass-border)] bg-white/6 p-4 transition-colors hover:bg-white/10 dark:bg-white/4 dark:hover:bg-white/7"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold">
                    <Icon className="size-[17px]" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">
                      {goal.title}
                    </p>
                    <p className="text-[11px] text-[var(--fg-faint)]">
                      {goal.cadence}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditing(goal)}
                    aria-label={`Edit ${goal.title}`}
                    className="grid size-7 shrink-0 place-items-center rounded-full text-[var(--fg-faint)] opacity-0 transition-all hover:bg-white/10 hover:text-[var(--fg)] focus-visible:opacity-100 group-hover/goal:opacity-100"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>

                <div className="mt-3.5 flex items-baseline justify-between gap-2">
                  <p className="tabular text-2xl font-semibold">
                    <AnimatedNumber value={goal.current} format={format} />
                  </p>
                  <p className="tabular text-[12px] text-[var(--fg-faint)]">
                    of {format(goal.goal)}
                  </p>
                </div>

                <div className="mt-2.5 flex items-center gap-3">
                  <Progress
                    value={pct}
                    accent={goal.accent}
                    label={`${goal.title} progress`}
                  />
                  <span className="tabular w-10 shrink-0 text-right text-[12px] font-medium text-[var(--fg-muted)]">
                    {percent(pct)}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </WidgetShell>

      <EditGoalDialog goal={editing} onClose={() => setEditing(null)} />
    </>
  );
}
