"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import {
  assistant,
  getAssistantMode,
  wasLastReplyLive,
} from "@/lib/ai/provider";
import { useAssistantContext } from "@/lib/ai/use-assistant-context";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Which stream should I double down on?",
  "What's blocking financial freedom?",
  "Where are my agents wasting effort?",
  "What should I build next?",
];

export function AssistantPanel() {
  const open = useUIStore((s) => s.assistantOpen);
  const setOpen = useUIStore((s) => s.setAssistantOpen);
  const messages = useUIStore((s) => s.messages);
  const addMessage = useUIStore((s) => s.addMessage);
  const updateMessage = useUIStore((s) => s.updateMessage);

  const context = useAssistantContext();

  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [mode, setMode] = React.useState<{
    live: boolean;
    model: string | null;
    /** Key configured, but the last call fell back to the simulation. */
    degraded: boolean;
  }>({ live: false, model: null, degraded: false });
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Checked once the panel is first opened, so the header can say whether
  // answers are coming from a real model or the local simulation.
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void getAssistantMode().then((next) => {
      if (!cancelled) setMode({ ...next, degraded: false });
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = React.useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed || busy) return;

      setBusy(true);
      setInput("");
      addMessage({ role: "user", content: trimmed });
      const replyId = addMessage({
        role: "assistant",
        content: "",
        streaming: true,
      });

      let buffer = "";
      for await (const token of assistant.stream(trimmed, context)) {
        buffer += token;
        updateMessage(replyId, { content: buffer });
      }
      updateMessage(replyId, { streaming: false });
      // If a key is configured but the reply came from the simulation, say so
      // rather than leaving the header claiming a live model.
      setMode((prev) =>
        prev.live ? { ...prev, degraded: !wasLastReplyLive() } : prev,
      );
      setBusy(false);
    },
    [addMessage, updateMessage, context, busy],
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          key="assistant"
          role="dialog"
          aria-label="AI assistant"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={spring.soft}
          className="glass glass-overlay fixed bottom-24 right-4 z-40 flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col md:bottom-6 md:right-6"
        >
          <span className="glass-rim" aria-hidden />

          <header className="flex items-center gap-2.5 border-b border-[var(--hairline)] px-5 py-4">
            <span className="grid size-7 place-items-center rounded-full bg-gold/15 text-gold">
              <Sparkles className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-tight">Assistant</p>
              <p className="truncate text-[11px] leading-tight text-[var(--fg-faint)]">
                {!mode.live ? (
                  "Simulated · reads your live dashboard"
                ) : mode.degraded ? (
                  <>
                    <span className="text-danger">Model unreachable</span>
                    {" · using simulation"}
                  </>
                ) : (
                  <>
                    <span className="text-success">Live</span>
                    {mode.model ? ` · ${mode.model.split("/").pop()}` : null}
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="grid size-7 place-items-center rounded-full text-[var(--fg-muted)] transition-colors hover:bg-white/10 hover:text-[var(--fg)]"
            >
              <X className="size-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                  message.role === "user"
                    ? "ml-auto bg-gold/18 text-[var(--fg)]"
                    : "bg-white/8 text-[var(--fg-muted)] dark:bg-white/6",
                )}
              >
                {message.content}
                {message.streaming ? (
                  <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-gold" />
                ) : null}
              </div>
            ))}

            {messages.length <= 1 ? (
              <div className="space-y-1.5 pt-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void send(suggestion)}
                    className="block w-full rounded-2xl border border-[var(--glass-border)] px-3.5 py-2 text-left text-[12px] text-[var(--fg-muted)] transition-colors hover:bg-white/10 hover:text-[var(--fg)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-[var(--hairline)] p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your money…"
              aria-label="Message the assistant"
              className="h-9 min-w-0 flex-1 rounded-full bg-white/8 px-4 text-[13px] outline-none placeholder:text-[var(--fg-faint)] focus-visible:ring-1 focus-visible:ring-gold dark:bg-white/5"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-b from-gold-bright to-gold text-[#241a06] transition-opacity disabled:opacity-40"
            >
              <ArrowUp className="size-4" />
            </button>
          </form>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
