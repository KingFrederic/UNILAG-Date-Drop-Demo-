"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Keyboard,
  Moon,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { navItems } from "@/components/layout/nav-items";
import { resolveIcon } from "@/components/icon-map";
import { useUIStore } from "@/store/useUIStore";
import { useWealthStore } from "@/store/useWealthStore";
import { currency } from "@/lib/format";

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] text-[var(--fg-muted)] outline-none transition-colors data-[selected=true]:bg-white/12 data-[selected=true]:text-[var(--fg)]";

export function CommandPalette() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const open = useUIStore((s) => s.paletteOpen);
  const setOpen = useUIStore((s) => s.setPaletteOpen);
  const setAssistantOpen = useUIStore((s) => s.setAssistantOpen);
  const setShortcutsOpen = useUIStore((s) => s.setShortcutsOpen);

  const streams = useWealthStore((s) => s.streams);
  const goals = useWealthStore((s) => s.goals);
  const ideas = useWealthStore((s) => s.ideas);
  const reset = useWealthStore((s) => s.reset);

  const run = React.useCallback(
    (action: () => void) => {
      setOpen(false);
      // Let the close animation start before navigating away.
      window.setTimeout(action, 60);
    },
    [setOpen],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        bare
        showClose={false}
        className="max-w-xl overflow-hidden p-0"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>

        <Command
          loop
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-[var(--fg-faint)]"
        >
          <div className="flex items-center gap-3 border-b border-[var(--hairline)] px-5">
            <Search className="size-4 shrink-0 text-[var(--fg-faint)]" />
            <Command.Input
              autoFocus
              placeholder="Search or jump to…"
              className="h-14 w-full bg-transparent text-[15px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)]"
            />
            <kbd className="hidden shrink-0 rounded-md border border-[var(--glass-border)] px-1.5 py-0.5 text-[10px] text-[var(--fg-faint)] sm:block">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-10 text-center text-[13px] text-[var(--fg-faint)]">
              Nothing matches that.
            </Command.Empty>

            <Command.Group heading="Navigate">
              {navItems.map((item) => {
                const Icon = resolveIcon(item.icon);
                return (
                  <Command.Item
                    key={item.href}
                    value={`go ${item.name}`}
                    onSelect={() => run(() => router.push(item.href))}
                    className={itemClass}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    <kbd className="text-[10px] text-[var(--fg-faint)]">
                      g {item.shortcut}
                    </kbd>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading="Income streams">
              {streams.map((stream) => {
                const Icon = resolveIcon(stream.icon);
                return (
                  <Command.Item
                    key={stream.id}
                    value={`stream ${stream.title} ${stream.status}`}
                    onSelect={() => run(() => router.push("/income"))}
                    className={itemClass}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1">{stream.title}</span>
                    <span className="tabular text-[12px] text-[var(--fg-faint)]">
                      {currency(stream.monthly)}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading="Goals">
              {goals.map((goal) => (
                <Command.Item
                  key={goal.id}
                  value={`goal ${goal.title}`}
                  onSelect={() => run(() => router.push("/goals"))}
                  className={itemClass}
                >
                  <ArrowUpRight className="size-4 shrink-0" />
                  <span className="flex-1">{goal.title}</span>
                  <span className="tabular text-[12px] text-[var(--fg-faint)]">
                    {currency(goal.current)} / {currency(goal.goal)}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Ideas">
              {ideas.slice(0, 6).map((idea) => (
                <Command.Item
                  key={idea.id}
                  value={`idea ${idea.title}`}
                  onSelect={() => run(() => router.push("/ideas"))}
                  className={itemClass}
                >
                  <Sparkles className="size-4 shrink-0" />
                  <span className="flex-1">{idea.title}</span>
                  <span className="text-[11px] text-[var(--fg-faint)]">
                    {idea.stage}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions">
              <Command.Item
                value="ask the assistant ai"
                onSelect={() => run(() => setAssistantOpen(true))}
                className={itemClass}
              >
                <Sparkles className="size-4 shrink-0" />
                <span className="flex-1">Ask the assistant</span>
                <kbd className="text-[10px] text-[var(--fg-faint)]">⌘J</kbd>
              </Command.Item>
              <Command.Item
                value="toggle theme dark light"
                onSelect={() =>
                  run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
                }
                className={itemClass}
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="size-4 shrink-0" />
                ) : (
                  <Moon className="size-4 shrink-0" />
                )}
                <span className="flex-1">
                  Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode
                </span>
                <kbd className="text-[10px] text-[var(--fg-faint)]">⇧D</kbd>
              </Command.Item>
              <Command.Item
                value="keyboard shortcuts help"
                onSelect={() => run(() => setShortcutsOpen(true))}
                className={itemClass}
              >
                <Keyboard className="size-4 shrink-0" />
                <span className="flex-1">Keyboard shortcuts</span>
                <kbd className="text-[10px] text-[var(--fg-faint)]">⌘/</kbd>
              </Command.Item>
              <Command.Item
                value="reset demo data"
                onSelect={() => run(reset)}
                className={itemClass}
              >
                <RotateCcw className="size-4 shrink-0" />
                <span className="flex-1">Reset all data</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
