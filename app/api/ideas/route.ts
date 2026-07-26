import type { Idea } from "@/types";

/**
 * Idea board persistence, backed by Supabase.
 *
 * Talks to PostgREST directly rather than pulling in @supabase/supabase-js —
 * this is four verbs against one table, and the SDK would be a dependency and
 * a bundle cost for no gain. The credential stays server-side, so no Supabase
 * key is shipped to the browser at all.
 *
 * When the environment is not configured every verb reports `configured:
 * false` and the client keeps using localStorage, so the board works either
 * way.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER = "duke-fred";

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_KEY;
  return url && key ? { url, key } : null;
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

interface Row {
  id: string;
  title: string;
  note: string | null;
  stage: Idea["stage"];
  position: number;
}

const toIdea = (row: Row): Idea => ({
  id: row.id,
  title: row.title,
  note: row.note ?? undefined,
  stage: row.stage,
});

const notConfigured = () =>
  Response.json(
    { configured: false, ideas: [] },
    { headers: { "Cache-Control": "no-store" } },
  );

export async function GET() {
  const cfg = config();
  if (!cfg) return notConfigured();

  const response = await fetch(
    `${cfg.url}/rest/v1/ideas?owner=eq.${OWNER}&order=position.asc,created_at.desc&select=id,title,note,stage,position`,
    { headers: headers(cfg.key), cache: "no-store" },
  ).catch(() => null);

  if (!response?.ok) {
    const detail = response ? await response.text().catch(() => "") : "unreachable";
    return Response.json(
      { configured: true, error: "read_failed", detail: detail.slice(0, 300) },
      { status: 502 },
    );
  }

  const rows = (await response.json()) as Row[];
  return Response.json(
    { configured: true, ideas: rows.map(toIdea) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const cfg = config();
  if (!cfg) return notConfigured();

  let title: unknown;
  let note: unknown;
  let position: unknown;
  try {
    const body = await request.json();
    title = body?.title;
    note = body?.note;
    position = body?.position;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof title !== "string" || !title.trim()) {
    return Response.json({ error: "empty_title" }, { status: 400 });
  }

  const response = await fetch(`${cfg.url}/rest/v1/ideas`, {
    method: "POST",
    headers: headers(cfg.key, { Prefer: "return=representation" }),
    body: JSON.stringify({
      owner: OWNER,
      title: title.trim().slice(0, 200),
      note: typeof note === "string" && note.trim() ? note.trim() : null,
      position: typeof position === "number" ? position : 0,
    }),
  }).catch(() => null);

  if (!response?.ok) {
    const detail = response ? await response.text().catch(() => "") : "unreachable";
    return Response.json(
      { configured: true, error: "create_failed", detail: detail.slice(0, 300) },
      { status: 502 },
    );
  }

  const [row] = (await response.json()) as Row[];
  if (!row) {
    return Response.json({ error: "empty_insert" }, { status: 502 });
  }
  return Response.json({ configured: true, idea: toIdea(row) });
}

export async function PATCH(request: Request) {
  const cfg = config();
  if (!cfg) return notConfigured();

  let id: unknown;
  let patch: Record<string, unknown>;
  try {
    const body = await request.json();
    id = body?.id;
    patch = body?.patch ?? {};
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof id !== "string") {
    return Response.json({ error: "missing_id" }, { status: 400 });
  }

  // Only these columns may be written from the client.
  const allowed: Record<string, unknown> = {};
  if (typeof patch.stage === "string") allowed.stage = patch.stage;
  if (typeof patch.position === "number") allowed.position = patch.position;
  if (typeof patch.title === "string") allowed.title = patch.title.slice(0, 200);
  if (Object.keys(allowed).length === 0) {
    return Response.json({ error: "nothing_to_update" }, { status: 400 });
  }

  const response = await fetch(
    `${cfg.url}/rest/v1/ideas?id=eq.${encodeURIComponent(id)}&owner=eq.${OWNER}`,
    {
      method: "PATCH",
      headers: headers(cfg.key),
      body: JSON.stringify(allowed),
    },
  ).catch(() => null);

  if (!response?.ok) {
    return Response.json({ configured: true, error: "update_failed" }, { status: 502 });
  }
  return Response.json({ configured: true, ok: true });
}

export async function DELETE(request: Request) {
  const cfg = config();
  if (!cfg) return notConfigured();

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "missing_id" }, { status: 400 });

  const response = await fetch(
    `${cfg.url}/rest/v1/ideas?id=eq.${encodeURIComponent(id)}&owner=eq.${OWNER}`,
    { method: "DELETE", headers: headers(cfg.key) },
  ).catch(() => null);

  if (!response?.ok) {
    return Response.json({ configured: true, error: "delete_failed" }, { status: 502 });
  }
  return Response.json({ configured: true, ok: true });
}
