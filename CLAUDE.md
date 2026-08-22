# Claude Commands — Agent Instructions

A mobile-first, iOS-style ("liquid glass") reference app cataloging four
terminal coding agents — Claude Code (built-in commands plus the user's
personal skills/plugins/subagents), OpenAI's Codex CLI, Google's Gemini CLI,
and Moonshot's Kimi Code CLI — switchable via a top-left source menu. Within
the active source,
entries are searchable and filterable along two independent axes (practical
use case, and type: Commands/Skills/Plugins/Subagents), and favoritable.
Fully static — no backend, no database, no auth. Deployed on Vercel from the
`main` branch on GitHub.

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
the merged catalog every component renders from; it combines the five data
files below and stamps a `source` tag onto each entry at the merge point
(the per-source files themselves are typed `SourcelessEntry[]` — `source`
omitted — so existing entries never needed hand-editing when the axis was
added). Every entry shares one `CommandEntry` shape with **three**
independent classification axes: `source` (`claude`/`codex`/`gemini`/`kimi`
— a single-select catalog switcher with no "all" aggregate, driven by the
top-left `SourceMenu`, not a filter rail), `practicalCategory` (what it's
*for* — Session & Context, Finance & Valuation, etc.), and `kind` (its
granular technical type — slash/cli/shortcut/config/skill/plugin/subagent),
which `KIND_TO_TYPE_GROUP` collapses into the coarser `TypeGroup` the type
rail filters on (Commands/Skills/Plugins/Subagents). `CommandExplorer.tsx`
filters by `source` first, then category/type/search apply within that
catalog — switching source resets category/type to "all" since the sets
differ per catalog. The one client/server split is
`components/CommandExplorer.tsx`; everything above it in the tree is a
Server Component.

| Path | Responsibility | Agent may write? |
| --- | --- | --- |
| `data/commands.ts` | Built-in Claude Code commands (slash/CLI/shortcut/config) | Yes |
| `data/skills.ts` | The user's personal Claude skills, plugins, and subagent types | Yes |
| `data/codexCommands.ts` | OpenAI Codex CLI slash commands + a curated top-30 of its official plugins | Yes |
| `data/geminiCommands.ts` | Google Gemini CLI slash commands + a curated 30 of its official extensions | Yes |
| `data/kimiCommands.ts` | Kimi Code CLI slash commands + its full plugin marketplace | Yes |
| `data/index.ts` | Merges all five into `allEntries`, tagging each with its `source` — import this, not the individual files | Yes |
| `lib/types.ts` | `CommandEntry`, `SourcelessEntry`, `EntryKind`, `PracticalCategory`, `TypeGroup`, `Source` shape shared by data and UI | Yes |
| `lib/useFavorites.ts` | localStorage-backed favorites store (`useSyncExternalStore`) | Yes |
| `components/CommandExplorer.tsx` | `'use client'` boundary: source filter, search, both filter rails, browse/favorites view | Yes |
| `components/GlassRow.tsx`, `CategoryRail.tsx`, `TypeRail.tsx`, `SourceMenu.tsx`, `TabBar.tsx` | Presentational, rendered inside the client tree | Yes |
| `app/` | Routing, layout, metadata/viewport | Yes |
| `app/globals.css` | Tailwind v4 CSS-first config (no `tailwind.config.*`) plus the liquid-glass tokens (`.glass`, `.glass-strong`, `.glass-header`, `--kind-*`, light/dark) | Yes |
| `.next/`, `node_modules/` | Build output / installed deps | NEVER — regenerate with `npm run build` / `npm install` |

Adding a new command never requires touching a component — append to the
right data file with a unique, **source-prefixed** `id` (e.g.
`codex-slash-review`, `kimi-plugin-superpowers`). The prefix is required, not
stylistic: `lib/useFavorites.ts` keys favorites by raw `id` in one flat
`localStorage` set with no source namespacing, and `entry.id` is the React
list `key` — two sources both having a `/review` command would otherwise
collide. Adding a new `practicalCategory` requires updating `lib/types.ts`
(`PracticalCategory`, `PRACTICAL_CATEGORY_LABELS`, `PRACTICAL_CATEGORY_ORDER`)
— categories are shared across every source, so keep labels source-agnostic
(`meta` is "Meta", not "Claude Code Meta"; `deploy` is "Deploy & Infra", not
"Deploy & Vercel" — it now also holds GCP, Cloudflare, and Netlify entries).
Adding a new `kind` needs a `KIND_LABELS` entry, a color in `GlassRow.tsx`'s
`KIND_DOT` map, and a `KIND_TO_TYPE_GROUP` entry mapping it to one of the
four existing type groups (that set is meant to stay fixed — a genuinely new
type group also needs `TYPE_GROUP_LABELS` and `TYPE_GROUP_ORDER`; note
Gemini's "extensions" are filed under `kind: "plugin"` rather than getting
their own kind, so they share the Plugins group). Adding a source needs a new
per-source data file, a tag in `data/index.ts`, and an entry in `Source`,
`SOURCE_LABELS`, and `SOURCE_ORDER` — no component changes, since
`SourceMenu` iterates `SOURCE_ORDER`.

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
  components. Any full-bleed sticky/fixed bar (nav bars, headers) needs an
  opaque background of its own — use `.glass-header`, not `.glass`/
  `.glass-strong` (those have a border on all four sides, wrong for an
  edge-to-edge bar) and never leave a sticky wrapper transparent between its
  children, or scrolled content bleeds through illegibly.
- **Fonts**: system stack only (`-apple-system` / `ui-monospace`) for
  authentic iOS rendering on-device — don't reintroduce a web-font import.
- **Client boundary**: keep `'use client'` scoped to `CommandExplorer.tsx`
  (and the small leaf components it renders). New interactive state goes
  there, not in `app/page.tsx`.
- **Favorites**: persisted client-side only via `lib/useFavorites.ts`
  (localStorage) — there is no account system, so favorites are per-device.
- **Responsive targets**: single column on iPhone (~390px); the row grid in
  `CommandExplorer.tsx` (`md:grid-cols-2`) tops out at 2 columns from iPad
  mini (~768px) up — don't add a 3-column breakpoint back.

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
  stale entries → verify: counts in both the category rail and the type
  rail change accordingly.
- **Refresh Codex/Gemini/Kimi commands or plugins**: re-check the tool's own
  current docs — Codex: `learn.chatgpt.com/docs/developer-commands?surface=cli`;
  Gemini: `docs/reference/commands.md` in `github.com/google-gemini/gemini-cli`;
  Kimi: `moonshotai.github.io/kimi-cli/en/reference/slash-commands.html`.
  Plugin/extension lists come from `github.com/openai/plugins`, the
  `github.com/gemini-cli-extensions` org, and
  `github.com/MoonshotAI/kimi-code/blob/main/plugins/marketplace.json` — read
  the raw file or GitHub API directly, **not** a webpage summary, which has
  been observed to hallucinate entries that do not exist → edit the matching
  `data/*Commands.ts`, keeping the source-prefixed `id` convention → verify:
  `npm run build` passes and the entries show up under the correct source in
  the browser.
- **Add a practical category**: update `lib/types.ts` together with any
  `CATEGORY_MAP`-style assignment used when generating data → verify: the
  new category's tab count matches the entries tagged with it.
- **Release**: push to `main` → Vercel's Git integration builds a production
  deployment automatically → verify: `vercel ls` shows a `READY` deployment
  for the new commit.

## Gotchas

- In any rule declaring both `backdrop-filter` and `-webkit-backdrop-filter`,
  put the `-webkit-` one first and the standard one last. The build's CSS
  minifier once deduped them and kept only the last declaration — with the
  standard property listed first, it silently dropped `backdrop-filter`
  everywhere, so every glass surface rendered as flat translucent color with
  no actual blur. Verify after touching this CSS: inspect a `.glass*` element
  in devtools and confirm `backdrop-filter` (not just the `-webkit-` one)
  shows a non-`none` computed value.

## Verification

Done means verified, not written:

- `npm run build` and `npm run lint` pass locally.
- Manual check: `npm run dev`, open in a browser, and confirm the search bar,
  both filter rails (category and type), row list, and floating tab bar stay
  usable at both ~390px (iPhone) and ~768px (iPad mini) widths, and in both
  light and dark.

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
