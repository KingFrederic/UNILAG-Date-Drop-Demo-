"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { riseChild } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface WidgetShellProps {
  title: string;
  /** Short line under the title. Keep it factual, not decorative. */
  caption?: string;
  action?: React.ReactNode;
  /** Slot for a drag handle, used on the sortable dashboard column. */
  handle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function WidgetShell({
  title,
  caption,
  action,
  handle,
  children,
  className,
  bodyClassName,
}: WidgetShellProps) {
  return (
    <motion.div variants={riseChild} className={cn("h-full", className)}>
      <GlassPanel className="flex h-full flex-col">
        <header className="flex items-start gap-3 px-5 pb-3 pt-5 sm:px-6">
          {handle}
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-semibold leading-tight tracking-tight">
              {title}
            </h2>
            {caption ? (
              <p className="mt-0.5 text-[12px] leading-tight text-[var(--fg-faint)]">
                {caption}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
        <div className={cn("flex-1 px-5 pb-5 sm:px-6 sm:pb-6", bodyClassName)}>
          {children}
        </div>
      </GlassPanel>
    </motion.div>
  );
}
