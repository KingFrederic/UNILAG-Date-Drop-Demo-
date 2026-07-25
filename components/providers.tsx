"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useWealthStore } from "@/store/useWealthStore";

/**
 * The wealth store is created with skipHydration, so persisted state is
 * applied here — after the first client render has already matched the
 * server's. Without this, localStorage values would land mid-hydration and
 * React would report a mismatch.
 */
function StoreHydration() {
  React.useEffect(() => {
    void useWealthStore.persist.rehydrate();
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={250} skipDelayDuration={400}>
        <StoreHydration />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
