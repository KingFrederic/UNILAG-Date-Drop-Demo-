"use client";

import * as React from "react";
import { Backdrop } from "./backdrop";
import { Dock } from "./dock";
import { Topbar } from "./topbar";
import { CommandPalette } from "@/components/command/command-palette";
import { ShortcutsDialog } from "@/components/command/shortcuts-dialog";
import { AssistantPanel } from "@/components/ai/assistant-panel";
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts";
import { useLiveNotifications } from "@/lib/hooks/use-live-notifications";

export function AppShell({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  useLiveNotifications();

  return (
    <>
      <Backdrop />
      <Dock />

      {/* Left padding clears the floating dock on desktop; bottom padding
          clears the mobile bar. */}
      <div className="min-h-dvh md:pl-[112px]">
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-28 sm:px-6 md:pb-12 lg:px-8">
          <Topbar />
          <main id="main">{children}</main>
        </div>
      </div>

      <CommandPalette />
      <ShortcutsDialog />
      <AssistantPanel />
    </>
  );
}
