"use client";

import * as React from "react";
import { useUIStore } from "@/store/useUIStore";
import type { AppNotification } from "@/types";

type Seed = Omit<AppNotification, "id" | "timestamp" | "read">;

/**
 * Simulated activity feed. Stands in for what would be a websocket or SSE
 * subscription against a real backend — the store contract is identical, so
 * swapping the source later touches only this file.
 */
const EVENTS: Seed[] = [
  {
    title: "Automation Engineer finished a run",
    body: "Fulfilment webhook wired to Shopify. 4 manual steps removed.",
    tone: "success",
  },
  {
    title: "YouTube crossed £4,500",
    body: "Third consecutive month of growth. Now your largest single channel.",
    tone: "gold",
  },
  {
    title: "Market Researcher flagged an opening",
    body: "Low competition in 'automation for trades'. Worth a look.",
    tone: "info",
  },
  {
    title: "Ad spend up 14%",
    body: "Financial Analyst suggests capping TikTok Shop budget this week.",
    tone: "danger",
  },
  {
    title: "Emergency fund halfway",
    body: "£5,000 of £10,000. Roughly three months of runway secured.",
    tone: "success",
  },
  {
    title: "SEO Writer published",
    body: "4 cluster articles live. First impressions expected in ~11 days.",
    tone: "info",
  },
  {
    title: "Content Creator queued 12 hooks",
    body: "Ready for review before batch filming on Sunday.",
    tone: "gold",
  },
];

export function useLiveNotifications() {
  const pushNotification = useUIStore((s) => s.pushNotification);

  React.useEffect(() => {
    let index = 0;
    let timer: number;

    const schedule = (delay: number) => {
      timer = window.setTimeout(() => {
        const event = EVENTS[index % EVENTS.length];
        if (event) pushNotification(event);
        index += 1;
        // Irregular spacing reads as live activity; a fixed interval reads
        // as a loop.
        schedule(18_000 + Math.random() * 22_000);
      }, delay);
    };

    schedule(6_000);
    return () => window.clearTimeout(timer);
  }, [pushNotification]);
}
