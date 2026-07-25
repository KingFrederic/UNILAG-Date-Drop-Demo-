/**
 * Server-side NVIDIA NIM client.
 *
 * Imported only from route handlers — never from a client component — so the
 * API key stays on the server. Both the assistant and the agents go through
 * here so key handling, model selection and error shapes stay in one place.
 */

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_MODEL = "meta/llama-3.3-70b-instruct";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function hasNvidiaKey() {
  return Boolean(process.env.NVIDIA_API_KEY);
}

export function nvidiaModel() {
  return process.env.NVIDIA_MODEL?.trim() || DEFAULT_MODEL;
}

export interface NvidiaOptions {
  stream?: boolean;
  maxTokens?: number;
  temperature?: number;
  /** Abort the upstream call after this many milliseconds. */
  timeoutMs?: number;
}

export type NvidiaResult =
  | { ok: true; response: Response }
  | { ok: false; status: number; error: string; detail?: string };

export async function nvidiaChat(
  messages: ChatMessage[],
  options: NvidiaOptions = {},
): Promise<NvidiaResult> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 503, error: "not_configured" };
  }

  const {
    stream = false,
    maxTokens = 400,
    temperature = 0.6,
    timeoutMs = 30_000,
  } = options;

  // Never let a hung upstream hold the connection open indefinitely.
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), timeoutMs);

  try {
    const response = await fetch(NVIDIA_URL, {
      method: "POST",
      signal: abort.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: stream ? "text/event-stream" : "application/json",
      },
      body: JSON.stringify({
        model: nvidiaModel(),
        messages,
        temperature,
        top_p: 0.9,
        max_tokens: maxTokens,
        stream,
      }),
    });

    if (!response.ok) {
      // Surface the upstream status, but never echo the key or headers back.
      const detail = await response.text().catch(() => "");
      clearTimeout(timer);
      return {
        ok: false,
        status: 502,
        error: "upstream_error",
        detail: `${response.status}: ${detail.slice(0, 300)}`,
      };
    }

    // Streaming callers own the body; clearing the timer here is safe because
    // the abort signal already guarded connection setup.
    clearTimeout(timer);
    return { ok: true, response };
  } catch (error) {
    clearTimeout(timer);
    const detail = error instanceof Error ? error.message : "unknown";
    return { ok: false, status: 502, error: "upstream_unreachable", detail };
  }
}

/** Reads a non-streaming completion's first message. */
export async function readCompletion(response: Response): Promise<string> {
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : "";
}

/**
 * Converts the upstream OpenAI-style SSE stream into plain text deltas, so the
 * client can append chunks directly without parsing events itself.
 */
export function sseToText(upstream: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return upstream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });

        // SSE events are separated by a blank line; keep any partial tail.
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          for (const line of event.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const parsed = JSON.parse(payload);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              // A malformed chunk should not tear down an otherwise good stream.
            }
          }
        }
      },
    }),
  );
}

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export const money = (value: number) => gbp.format(value);
