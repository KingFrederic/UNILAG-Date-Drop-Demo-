"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Keyboard, Monitor, Moon, RotateCcw, Sun } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/seed";
import { useWealthStore } from "@/store/useWealthStore";
import { useUIStore } from "@/store/useUIStore";
import { riseChild, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] px-6 py-5 first:border-t-0">
      <div className="min-w-[200px] flex-1">
        <p className="text-[14px] font-medium">{title}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--fg-muted)]">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const reset = useWealthStore((s) => s.reset);
  const setShortcutsOpen = useUIStore((s) => s.setShortcutsOpen);
  const [confirmingReset, setConfirmingReset] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <motion.div variants={staggerParent} initial="hidden" animate="show">
      <PageHeader
        title="Settings"
        description="Appearance, shortcuts and stored data. Everything here lives in this browser only."
      />

      <div className="max-w-3xl space-y-6 pb-6">
        <motion.div variants={riseChild}>
          <GlassPanel>
            <div className="px-6 pb-2 pt-6">
              <h2 className="text-[15px] font-semibold">Profile</h2>
            </div>
            <Row
              title={profile.name}
              description={profile.subtitle}
            >
              <div className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-gold-bright to-gold-deep text-[14px] font-bold text-[#241a06]">
                {profile.initials}
              </div>
            </Row>
          </GlassPanel>
        </motion.div>

        <motion.div variants={riseChild}>
          <GlassPanel>
            <div className="px-6 pb-2 pt-6">
              <h2 className="text-[15px] font-semibold">Appearance</h2>
            </div>

            <Row
              title="Theme"
              description="Glass, shadows and the backdrop all adapt. System follows your device."
            >
              <div className="flex items-center gap-1 rounded-full border border-[var(--glass-border)] p-1">
                {THEMES.map((option) => {
                  const Icon = option.icon;
                  const active = mounted && theme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
                        active
                          ? "bg-gold text-[#241a06]"
                          : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                      )}
                    >
                      <Icon className="size-3.5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </Row>

            <Row
              title="Keyboard shortcuts"
              description="Every view and overlay is reachable without a mouse."
            >
              <Button variant="outline" onClick={() => setShortcutsOpen(true)}>
                <Keyboard />
                View shortcuts
              </Button>
            </Row>
          </GlassPanel>
        </motion.div>

        <motion.div variants={riseChild}>
          <GlassPanel>
            <div className="px-6 pb-2 pt-6">
              <h2 className="text-[15px] font-semibold">Data</h2>
            </div>

            <Row
              title="Local storage"
              description="Goals, streams, ideas and panel order are saved in this browser. Nothing is sent anywhere."
            >
              <span className="text-[12px] text-[var(--fg-faint)]">
                path-to-wealth:v1
              </span>
            </Row>

            <Row
              title="Reset everything"
              description="Restores the original figures and panel order. This cannot be undone."
            >
              {confirmingReset ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setConfirmingReset(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      reset();
                      setConfirmingReset(false);
                    }}
                  >
                    Confirm reset
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setConfirmingReset(true)}
                >
                  <RotateCcw />
                  Reset data
                </Button>
              )}
            </Row>
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}
