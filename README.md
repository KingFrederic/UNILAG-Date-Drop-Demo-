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

**The assistant is simulated.** `lib/ai/provider.ts` implements an
`AssistantProvider` that streams a scripted reply composed from your live
figures — no API key, no network, no cost. Swapping in a real model means
replacing that one export with a client backed by a route handler; the UI is
written against the interface, not the implementation.

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
