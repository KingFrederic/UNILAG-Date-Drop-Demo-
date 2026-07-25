"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { navItems } from "@/components/layout/nav-items";
import { useUIStore } from "@/store/useUIStore";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/**
 * Global shortcuts:
 *   ⌘K / Ctrl+K  command palette
 *   ⌘J / Ctrl+J  AI assistant
 *   ⌘/           shortcut reference
 *   g then d/g/i/n/a/l/s   jump to a section
 *   ⇧D           toggle theme
 */
export function useKeyboardShortcuts() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const togglePalette = useUIStore((s) => s.togglePalette);
  const toggleAssistant = useUIStore((s) => s.toggleAssistant);
  const setShortcutsOpen = useUIStore((s) => s.setShortcutsOpen);

  // Tracks whether `g` was the previous keypress, for the two-key jumps.
  const pendingGoTo = React.useRef(false);
  const goToTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (meta && key === "k") {
        event.preventDefault();
        togglePalette();
        return;
      }
      if (meta && key === "j") {
        event.preventDefault();
        toggleAssistant();
        return;
      }
      if (meta && key === "/") {
        event.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      // Single-key shortcuts must never fire while the user is typing.
      if (meta || event.altKey || isTypingTarget(event.target)) return;

      if (event.shiftKey && key === "d") {
        event.preventDefault();
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return;
      }

      if (pendingGoTo.current) {
        const match = navItems.find((item) => item.shortcut === key);
        pendingGoTo.current = false;
        if (goToTimer.current) window.clearTimeout(goToTimer.current);
        if (match) {
          event.preventDefault();
          router.push(match.href);
        }
        return;
      }

      if (key === "g") {
        pendingGoTo.current = true;
        if (goToTimer.current) window.clearTimeout(goToTimer.current);
        // Forget the prefix if the second key never arrives.
        goToTimer.current = window.setTimeout(() => {
          pendingGoTo.current = false;
        }, 1400);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (goToTimer.current) window.clearTimeout(goToTimer.current);
    };
  }, [
    router,
    resolvedTheme,
    setTheme,
    togglePalette,
    toggleAssistant,
    setShortcutsOpen,
  ]);
}
