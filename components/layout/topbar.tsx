"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { profile } from "@/data/seed";
import { navItems } from "./nav-items";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { useUIStore } from "@/store/useUIStore";
import { spring } from "@/lib/motion";

function currentSection(pathname: string) {
  return navItems.find((item) => item.href === pathname)?.name ?? "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();
  const setPaletteOpen = useUIStore((s) => s.setPaletteOpen);
  const toggleAssistant = useUIStore((s) => s.toggleAssistant);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="sticky top-4 z-30 mb-6"
    >
      <div className="glass flex items-center gap-3 rounded-[24px] px-3 py-2.5 sm:px-4">
        <span className="glass-rim" aria-hidden />

        <div className="hidden min-w-0 shrink-0 pl-1 pr-2 sm:block">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
            Path to Wealth
          </p>
          <p className="truncate text-[13px] font-semibold leading-tight">
            {currentSection(pathname)}
          </p>
        </div>

        {/* Reads as a search field, behaves as the command palette trigger —
            which is where every query would end up anyway. */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="group flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-white/8 px-4 text-left text-[13px] text-[var(--fg-faint)] transition-colors hover:bg-white/14 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate">Search goals, streams, ideas…</span>
          <kbd className="ml-auto hidden shrink-0 rounded-md border border-[var(--glass-border)] px-1.5 py-0.5 font-sans text-[10px] tracking-wide sm:block">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={toggleAssistant}
          aria-label="Open AI assistant"
          className="grid size-10 shrink-0 place-items-center rounded-full text-gold transition-colors hover:bg-gold/12"
        >
          <Sparkles className="size-[18px]" />
        </button>

        <NotificationCenter />

        <div className="flex shrink-0 items-center gap-2.5 pl-1">
          <div className="hidden text-right lg:block">
            <p className="text-[13px] font-semibold leading-tight">
              {profile.name}
            </p>
            <p className="text-[11px] leading-tight text-[var(--fg-faint)]">
              {profile.subtitle}
            </p>
          </div>
          <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-gold-bright to-gold-deep text-[12px] font-bold text-[#241a06] shadow-[0_6px_18px_-6px_rgba(245,184,78,0.8)]">
            {profile.initials}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
