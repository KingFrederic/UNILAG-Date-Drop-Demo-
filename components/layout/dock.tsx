"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { navItems } from "./nav-items";
import { resolveIcon } from "@/components/icon-map";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // The resolved theme is unknown during SSR, so render a stable placeholder
  // until mount rather than guessing and flipping.
  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={
            mounted
              ? `Switch to ${isDark ? "light" : "dark"} mode`
              : "Toggle colour theme"
          }
          className="grid size-11 place-items-center rounded-2xl text-[var(--fg-muted)] transition-colors duration-300 hover:bg-white/10 hover:text-[var(--fg)]"
        >
          {mounted ? (
            <motion.span
              key={isDark ? "dark" : "light"}
              initial={{ rotate: -70, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={spring.snappy}
              className="grid place-items-center"
            >
              {isDark ? (
                <Moon className="size-[18px]" />
              ) : (
                <Sun className="size-[18px]" />
              )}
            </motion.span>
          ) : (
            <span className="size-[18px]" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">Toggle theme</TooltipContent>
    </Tooltip>
  );
}

export function Dock() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: floating vertical rail, centred against the viewport. */}
      <nav
        aria-label="Primary"
        className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      >
        <div className="glass flex w-20 flex-col items-center gap-1 rounded-[32px] px-3 py-5">
          <span className="glass-rim" aria-hidden />

          {navItems.map((item) => {
            const Icon = resolveIcon(item.icon);
            const active = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.name}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative grid size-11 place-items-center rounded-2xl transition-colors duration-300",
                      active
                        ? "text-[#241a06]"
                        : "text-[var(--fg-muted)] hover:bg-white/10 hover:text-[var(--fg)]",
                    )}
                  >
                    {active ? (
                      // layoutId lets the pill physically travel between items.
                      <motion.span
                        layoutId="dock-active"
                        transition={spring.snappy}
                        className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold-bright to-gold shadow-[0_8px_22px_-6px_rgba(245,184,78,0.75)]"
                      />
                    ) : null}
                    <Icon className="relative size-[18px]" strokeWidth={2} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.name}
                  <kbd className="ml-2 text-[10px] text-[var(--fg-faint)]">
                    g {item.shortcut}
                  </kbd>
                </TooltipContent>
              </Tooltip>
            );
          })}

          <span className="my-2 h-px w-8 hairline" />
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile: the same rail laid on its side, pinned to the bottom. */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-3 bottom-3 z-40 md:hidden"
      >
        <div className="glass flex items-center justify-between rounded-[26px] px-2 py-2">
          <span className="glass-rim" aria-hidden />
          {navItems.map((item) => {
            const Icon = resolveIcon(item.icon);
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.name}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative grid size-10 flex-1 place-items-center rounded-2xl transition-colors",
                  active ? "text-[#241a06]" : "text-[var(--fg-muted)]",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="dock-active-mobile"
                    transition={spring.snappy}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold-bright to-gold"
                  />
                ) : null}
                <Icon className="relative size-[17px]" />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
