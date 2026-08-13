# Claude Commands — Agent Instructions

A mobile-first, iOS-style ("liquid glass") reference app for the user's whole
Claude Code setup: built-in commands (slash/CLI/shortcuts/hooks) plus their
personal skills, plugins, and subagents — all searchable, filterable by
practical use case, and favoritable. Fully static — no backend, no database,
no auth. Deployed on Vercel from the `main` branch on GitHub.

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

Single Next.js App Router app, no monorepo. `data/index.ts` (`allEntries`) is
the merged catalog every component renders from; it combines the two data
sources below. Every entry — regardless of source — shares one `CommandEntry`
shape with two independent axes: `kind` (its technical type) and
`practicalCategory` (what it's *for*, the primary grouping the UI shows).
The one client/server split is `components/CommandExplorer.tsx`; everything
above it in the tree is a Server Component.

| Path | Responsibility | Agent may write? |
| --- | --- | --- |
| `data/commands.ts` | Built-in Claude Code commands (slash/CLI/shortcut/config) | Yes |
| `data/skills.ts` | The user's personal skills, plugins, and subagent types | Yes |
| `data/index.ts` | Merges the two into `allEntries` — import this, not the individual files | Yes |
| `lib/types.ts` | `CommandEntry`, `EntryKind`, `PracticalCategory` shape shared by data and UI | Yes |
| `lib/useFavorites.ts` | localStorage-backed favorites store (`useSyncExternalStore`) | Yes |
| `components/CommandExplorer.tsx` | `'use client'` boundary: search, category filter, browse/favorites view | Yes |
| `components/GlassRow.tsx`, `CategoryRail.tsx`, `TabBar.tsx` | Presentational, rendered inside the client tree | Yes |
| `app/` | Routing, layout, metadata/viewport | Yes |
| `app/globals.css` | Tailwind v4 CSS-first config (no `tailwind.config.*`) plus the liquid-glass tokens (`.glass`, `.glass-strong`, `--kind-*`, light/dark) | Yes |
| `.next/`, `node_modules/` | Build output / installed deps | NEVER — regenerate with `npm run build` / `npm install` |

Adding a new command never requires touching a component — append to the
right data file with a unique `id`. Adding a new `practicalCategory` requires
updating `lib/types.ts` (`PracticalCategory`, `PRACTICAL_CATEGORY_LABELS`,
`PRACTICAL_CATEGORY_ORDER`); adding a new `kind` also needs a `KIND_LABELS`
entry and a color in `GlassRow.tsx`'s `KIND_DOT` map.

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
- **Content vs. code**: entry data belongs in `data/commands.ts` or
  `data/skills.ts`, never hardcoded in a component. Search/filter logic stays
  plain substring matching — do not add a fuzzy-search dependency for this
  dataset size.
- **Styling**: Tailwind v4 utility classes plus the `.glass` / `.glass-strong`
  liquid-glass materials defined in `app/globals.css`. Colors read from the
  CSS custom properties there (`var(--label)`, `var(--accent)`, `--kind-*`,
  etc.) so light/dark stay in one place — don't hardcode hex colors in
  components.
- **Fonts**: system stack only (`-apple-system` / `ui-monospace`) for
  authentic iOS rendering on-device — don't reintroduce a web-font import.
- **Client boundary**: keep `'use client'` scoped to `CommandExplorer.tsx`
  (and the small leaf components it renders). New interactive state goes
  there, not in `app/page.tsx`.
- **Favorites**: persisted client-side only via `lib/useFavorites.ts`
  (localStorage) — there is no account system, so favorites are per-device.
- **Responsive targets**: single column on iPhone (~390px); the row grid in
  `CommandExplorer.tsx` (`md:grid-cols-2 lg:grid-cols-3`) uses the extra
  width from iPad mini (~768px) up — don't drop those breakpoints.

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

- **Add/update a built-in command**: cross-check the current official Claude
  Code docs (commands and flags change across releases) → edit
  `data/commands.ts` → verify: `npm run build` passes and the entry shows up
  and filters correctly in the browser.
- **Refresh skills/plugins/subagents**: re-derive `data/skills.ts` from the
  user's actual current skill/plugin/subagent roster rather than hand-editing
  stale entries → verify: counts in the category rail change accordingly.
- **Add a practical category**: update `lib/types.ts` together with any
  `CATEGORY_MAP`-style assignment used when generating data → verify: the
  new category's tab count matches the entries tagged with it.
- **Release**: push to `main` → Vercel's Git integration builds a production
  deployment automatically → verify: `vercel ls` shows a `READY` deployment
  for the new commit.

## Gotchas

## Verification

Done means verified, not written:

- `npm run build` and `npm run lint` pass locally.
- Manual check: `npm run dev`, open in a browser, and confirm the search bar,
  category rail, row list, and floating tab bar stay usable at both ~390px
  (iPhone) and ~768px (iPad mini) widths, and in both light and dark.

## Project Memory

- This file outranks any stored memory. On contradiction the memory is
  wrong: fix or delete it. A memory is promoted into this file by review,
  never automatically.

## Codex Specific

- You reach these rules through `AGENTS.md`, which points here. Read this
  file in full before your first edit; nothing that binds you is hidden
  behind an import.

---

**Working if:** entry content stays confined to `data/commands.ts` and
`data/skills.ts` (never hardcoded in a component); diffs contain only the
requested changes; and `npm run build` is run before any change is reported
done.
