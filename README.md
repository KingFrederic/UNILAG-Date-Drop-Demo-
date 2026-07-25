# Path to Wealth

A wealth operating system dashboard — floating glass panels over a golden-hour
backdrop, in the spirit of Apple Vision Pro, Linear and Raycast.

Track goals, ten income streams, an idea board and a set of AI agents, with a
command palette, an assistant, live notifications and state that survives a
reload.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm start            # serve the build
npm run typecheck    # tsc --noEmit
npm run lint
```

Node 20+ recommended (developed against Node 22).

Optionally, to enable the live assistant:

```bash
cp .env.example .env.local   # then fill in NVIDIA_API_KEY
```

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion ·
Zustand · Recharts · Radix UI · cmdk · dnd-kit · next-themes · lucide-react.

UI primitives in `components/ui` follow shadcn/ui conventions (`cn()` +
`cva` variants over Radix) but are written directly rather than generated.

## Layout

```
app/          routes — dashboard plus goals, income, ideas, agents, learning, settings
components/
  layout/     app shell, dock, topbar, backdrop
  hero/       hero panel, roadmap, mountain scene
  widgets/    goal tracker, idea dump, agents, income rail, charts
  ai/         assistant panel
  command/    command palette, shortcuts reference
  ui/         button, card, dialog, tooltip, progress, badge, glass panel
lib/          motion springs, formatting, hooks
store/        zustand stores (wealth state is persisted)
data/         seed data
```

## Keyboard

| Keys | Action |
| --- | --- |
| `⌘K` | Command palette |
| `⌘J` | AI assistant |
| `⌘/` | Shortcut reference |
| `⇧D` | Toggle light/dark |
| `g` then `d` `g` `i` `n` `a` `l` `s` | Jump to a section |

## Notes on the implementation

**Data is local.** Goals, streams, ideas and panel order live in Zustand and
persist to `localStorage` under `path-to-wealth:v1`. There is no backend and
nothing leaves the browser. The store is created with `skipHydration` and
rehydrated in `components/providers.tsx`, so the first client render matches
the server's. Settings → Reset restores the seed data.

**The assistant runs live or simulated.** With `NVIDIA_API_KEY` set it answers
through NVIDIA NIM; without it, `lib/ai/provider.ts` streams a scripted reply
composed from your live figures — no key, no network, no cost. See
[Assistant](#assistant) below.

### Assistant

The assistant works with or without a model key, and tells you which it's
doing:

| State | Header reads | Behaviour |
| --- | --- | --- |
| No key set | `Simulated` | Scripted replies built from your live figures. Free, offline, always works. |
| Key set, model reachable | `Live · <model>` | Streamed from NVIDIA NIM. |
| Key set, call failed | `Model unreachable · using simulation` | Falls back so you still get an answer, and says so rather than pretending. |

That third row matters: a wrong or expired key would otherwise look identical
to a working one.

Set `NVIDIA_API_KEY` (and optionally `NVIDIA_MODEL`, default
`meta/llama-3.3-70b-instruct`) in `.env.local` locally, and in your host's
environment variables for deployment.

**The key is server-side only.** It is read in `app/api/assistant/route.ts`,
which proxies the call and streams the reply back as plain text. It is never
sent to the browser and never committed — `.env*` is gitignored, and
`.env.example` carries placeholders only. Rotate any key that has been pasted
into a chat, an issue, or a log.

**No image assets.** The golden-hour backdrop and the hero ridgeline are CSS
gradients and inline SVG. Nothing to 404, nothing to license, and it scales to
any viewport. A grain overlay suppresses the banding large dark gradients
otherwise show.

**Fonts.** SF Pro is requested by name so Apple devices use the real thing;
Inter (via `next/font`) is the fallback everywhere else.

**Accessibility.** Semantic landmarks, labelled icon-only controls, visible
focus rings, Radix for dialog and tooltip focus management, and
`prefers-reduced-motion` honoured throughout — including the backdrop parallax
and every count-up.

## A note on the numbers

The goal tracker's "Monthly Income" (£3,200) and the streams' combined total
(£26,700/mo) measure different things and are labelled as such: the goal card
tracks **realised** income, while the streams rail reports a **combined
run-rate**. Editing any stream flows through the totals, the charts and the
assistant's answers immediately.
