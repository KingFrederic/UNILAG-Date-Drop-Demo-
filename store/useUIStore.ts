"use client";

import { create } from "zustand";
import type { AppNotification, ChatMessage } from "@/types";
import { uid } from "@/lib/utils";

interface UIState {
  paletteOpen: boolean;
  assistantOpen: boolean;
  shortcutsOpen: boolean;
  notifications: AppNotification[];
  messages: ChatMessage[];

  setPaletteOpen: (open: boolean) => void;
  togglePalette: () => void;
  setAssistantOpen: (open: boolean) => void;
  toggleAssistant: () => void;
  setShortcutsOpen: (open: boolean) => void;

  pushNotification: (
    notification: Omit<AppNotification, "id" | "timestamp" | "read">,
  ) => void;
  markAllRead: () => void;
  clearNotifications: () => void;

  addMessage: (message: Omit<ChatMessage, "id">) => string;
  updateMessage: (id: string, patch: Partial<ChatMessage>) => void;
  resetMessages: () => void;
}

const GREETING: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "I can see your whole operation from here. Ask me to compare streams, stress-test a goal, or find the next move worth making.",
};

/** Notifications are ephemeral simulated events, so this store is not persisted. */
export const useUIStore = create<UIState>()((set) => ({
  paletteOpen: false,
  assistantOpen: false,
  shortcutsOpen: false,
  notifications: [],
  messages: [GREETING],

  setPaletteOpen: (open) => set({ paletteOpen: open }),
  togglePalette: () => set((state) => ({ paletteOpen: !state.paletteOpen })),
  setAssistantOpen: (open) => set({ assistantOpen: open }),
  toggleAssistant: () => set((state) => ({ assistantOpen: !state.assistantOpen })),
  setShortcutsOpen: (open) => set({ shortcutsOpen: open }),

  pushNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, id: uid("ntf"), timestamp: Date.now(), read: false },
        ...state.notifications,
      ].slice(0, 24),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  clearNotifications: () => set({ notifications: [] }),

  addMessage: (message) => {
    const id = uid("msg");
    set((state) => ({ messages: [...state.messages, { ...message, id }] }));
    return id;
  },

  updateMessage: (id, patch) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, ...patch } : message,
      ),
    })),

  resetMessages: () => set({ messages: [GREETING] }),
}));

export const selectUnreadCount = (state: UIState) =>
  state.notifications.filter((n) => !n.read).length;
