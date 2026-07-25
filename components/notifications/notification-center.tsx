"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { selectUnreadCount, useUIStore } from "@/store/useUIStore";
import { relativeTime } from "@/lib/format";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TONE_DOT: Record<string, string> = {
  success: "bg-success",
  info: "bg-info",
  gold: "bg-gold",
  danger: "bg-danger",
};

export function NotificationCenter() {
  const notifications = useUIStore((s) => s.notifications);
  const unread = useUIStore(selectUnreadCount);
  const markAllRead = useUIStore((s) => s.markAllRead);
  const clear = useUIStore((s) => s.clearNotifications);
  const [open, setOpen] = React.useState(false);

  // Timestamps are relative, so re-render the list once a minute while open.
  const [, forceTick] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => {
    if (!open) return;
    const id = window.setInterval(forceTick, 60_000);
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) markAllRead();
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={
            unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
          }
          className="relative grid size-10 place-items-center rounded-full text-[var(--fg-muted)] transition-colors hover:bg-white/10 hover:text-[var(--fg)]"
        >
          <Bell className="size-[18px]" />
          <AnimatePresence>
            {unread > 0 ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={spring.bouncy}
                className="absolute right-1.5 top-1.5 grid min-w-[15px] place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-[#241a06]"
              >
                {unread > 9 ? "9+" : unread}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={12}
          className="glass glass-overlay z-50 w-[min(24rem,calc(100vw-2rem))] p-2 data-[state=closed]:animate-fade-out data-[state=open]:animate-pop-in"
        >
          <span className="glass-rim" aria-hidden />

          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-[13px] font-semibold">Activity</p>
            {notifications.length > 0 ? (
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-1 text-[11px] text-[var(--fg-faint)] transition-colors hover:text-[var(--fg)]"
              >
                <CheckCheck className="size-3" />
                Clear
              </button>
            ) : null}
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-3 py-8 text-center text-[13px] text-[var(--fg-faint)]">
                Nothing yet. Your agents will report in shortly.
              </p>
            ) : (
              <ul className="space-y-0.5">
                <AnimatePresence initial={false}>
                  {notifications.map((n) => (
                    <motion.li
                      key={n.id}
                      layout
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={spring.soft}
                      className="flex gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/8"
                    >
                      <span
                        className={cn(
                          "mt-1.5 size-1.5 shrink-0 rounded-full",
                          TONE_DOT[n.tone] ?? "bg-gold",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium leading-snug">
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-[12px] leading-snug text-[var(--fg-muted)]">
                          {n.body}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">
                          {relativeTime(n.timestamp)}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
