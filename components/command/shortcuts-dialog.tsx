"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { navItems } from "@/components/layout/nav-items";
import { useUIStore } from "@/store/useUIStore";

const GLOBAL = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["⌘", "J"], label: "Toggle AI assistant" },
  { keys: ["⌘", "/"], label: "Show this reference" },
  { keys: ["⇧", "D"], label: "Toggle light and dark" },
  { keys: ["Esc"], label: "Dismiss any overlay" },
];

function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="flex shrink-0 items-center gap-1">
      {keys.map((key) => (
        <kbd
          key={key}
          className="min-w-[24px] rounded-md border border-[var(--glass-border)] bg-white/8 px-1.5 py-1 text-center font-sans text-[11px] leading-none text-[var(--fg)]"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}

export function ShortcutsDialog() {
  const open = useUIStore((s) => s.shortcutsOpen);
  const setOpen = useUIStore((s) => s.setShortcutsOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="display-title text-2xl">
            Keyboard shortcuts
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[var(--fg-muted)]">
            Everything here is reachable without the mouse.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
              Global
            </p>
            <ul className="space-y-2">
              {GLOBAL.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-4 text-[13px]"
                >
                  <span className="text-[var(--fg-muted)]">{row.label}</span>
                  <Keys keys={row.keys} />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
              Jump to
            </p>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className="flex items-center justify-between gap-4 text-[13px]"
                >
                  <span className="text-[var(--fg-muted)]">{item.name}</span>
                  <Keys keys={["G", item.shortcut.toUpperCase()]} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
