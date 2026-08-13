# Claude Commands — Agent Instructions

A mobile-first reference app for looking up Claude Code commands: slash
commands, CLI flags, keyboard shortcuts, and hooks/permission-mode config.
Fully static — no backend, no database, no auth. All content lives in one
typed data file; the UI is a search/filter over it. Deployed on Vercel from
the `main` branch on GitHub.

`CLAUDE.md` is the single source of truth for every coding agent in this repo.
`AGENTS.md` only routes other tools here and carries no rules of its own
(beyond the Next.js compatibility block it hosts, which regenerates itself).

## Behavior Baseline

Biases caution over speed. For trivial tasks, use judgment and skip the ceremony.

- **State assumptions before implementing.** If several readings of the request are
  possible, present them rather than silently picking one.
- **Write the minimum code that solves the stated problem.** This app has no
  backend, no auth, and no fuzzy-search library on purpose — don't reintroduce
  that complexity without a stated reason.
- **Touch only what the request traces to.** Match surrounding style even where you
  would choose differently.
- **Convert the task into a verifiable goal before starting.** For content
  changes: `npm run build` passes and the entry renders/filters correctly.

## Architecture

Single Next.js App Router app, no monorepo. `data/commands.ts` is the only
source of content — every other file renders it. The one client/server split
in the app is `components/CommandExplorer.tsx`; everything above it in the
tree is a Server Component.

| Path | Responsibility | Agent may write? |
| --- | --- | --- |
| `data/commands.ts` | The full command catalog (source of truth) | Yes |
| `lib/types.ts` | `Command` / `CommandCategory` shape shared by data and UI | Yes |
| `components/CommandExplorer.tsx` | `'use client'` boundary: search + category filter state | Yes |
| `components/CommandCard.tsx`, `CategoryTabs.tsx` | Presentational, rendered inside the client tree | Yes |
| `app/` | Routing, layout, metadata/viewport | Yes |
| `app/globals.css` | Tailwind v4 CSS-first config (no `tailwind.config.*`) and theme tokens | Yes |
| `.next/`, `node_modules/` | Build output / installed deps | NEVER — regenerate with `npm run build` / `npm install` |

Adding a new command never requires touching a component — append to
`data/commands.ts` with a unique `id`. Adding a new *category* requires
updating `lib/types.ts` (`CommandCategory`, `CATEGORY_LABELS`) and the
`CATEGORIES` list in `components/CategoryTabs.tsx` together.

## Commands

```sh
npm install                          # install
npm run dev                          # run locally
npm run build                        # production build — also type-checks
npm run lint                         # eslint
npx tsc --noEmit                     # typecheck only, no build
```

There is no test suite. `npm run build` is the correctness gate: it fails on
type errors and on any invalid static export.

## Conventions That Differ From Defaults

- **Package manager**: `npm`. Using another lockfile format is an error.
- **Content vs. code**: command data belongs in `data/commands.ts`, never
  hardcoded in a component. Search/filter logic stays plain substring
  matching — do not add a fuzzy-search dependency for this dataset size.
- **Styling**: Tailwind v4 utility classes only; theme tokens live in
  `app/globals.css` under `@theme inline`. No component-level CSS files.
- **Client boundary**: keep `'use client'` scoped to `CommandExplorer.tsx`.
  New interactive state goes there, not in `app/page.tsx`.
- **Responsive targets**: layout must stay usable at iPhone widths (~390px)
  and iPad mini widths (~768px) — the grid breakpoints in
  `CommandExplorer.tsx` (`md:`, `lg:`) encode this; don't remove them.

## Boundaries & Data Security

- Never add a database, auth provider, or server-side secret to this project
  — it's static by design. If a future feature genuinely needs one, raise it
  first; it changes the Vercel deploy story.
- Never hand-edit the `<!-- BEGIN:nextjs-agent-rules -->` block in
  `AGENTS.md` — `next dev`/`next build` regenerate it on every run.
- Ask first: adding new npm dependencies, changing the deploy target away
  from Vercel, promoting a deploy to production (`vercel --prod`), and any
  destructive git operation.

## Workflows

- **Add/update a command**: cross-check the current official Claude Code
  docs (commands and flags change across releases) → edit
  `data/commands.ts` → verify: `npm run build` passes and the entry shows up
  and filters correctly in the browser.
- **Add a category**: update `lib/types.ts` and `CategoryTabs.tsx` together →
  verify: the new tab's count matches the entries tagged with it.
- **Release**: push to `main` → Vercel's Git integration builds a production
  deployment automatically → verify: `vercel ls` shows a `READY` deployment
  for the new commit.

## Gotchas

## Verification

Done means verified, not written:

- `npm run build` and `npm run lint` pass locally.
- Manual responsive check: `npm run dev`, open in a browser, and confirm the
  search bar, category tabs, and card grid stay usable at both ~390px
  (iPhone) and ~768px (iPad mini) widths.

## Project Memory

- This file outranks any stored memory. On contradiction the memory is
  wrong: fix or delete it. A memory is promoted into this file by review,
  never automatically.

## Codex Specific

- You reach these rules through `AGENTS.md`, which points here. Read this
  file in full before your first edit; nothing that binds you is hidden
  behind an import.

---

**Working if:** `data/commands.ts` stays the only place command content
lives; diffs contain only the requested changes; and `npm run build` is run
before any change is reported done.
