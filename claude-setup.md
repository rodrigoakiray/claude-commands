# claude-setup.md — agent instruction kit

Source kit for creating a project's `CLAUDE.md`. Copy the blocks below into a new
project, fill them in, delete what does not apply. Each project gets its own
independent file — nothing here is shared or imported at runtime.

**Primary target: Claude Code. Secondary target: Codex.** `CLAUDE.md` holds every
rule; `AGENTS.md` is a pointer that routes Codex and other AGENTS.md-aware tools to
it. One file with rules means one file that can drift.

**The rule that decides what belongs in the file.** `CLAUDE.md` is loaded in full on
every message — it is prompt text you pay for continuously, not documentation. So for
every line: *would removing this cause the agent to make a mistake?* If no, cut it.
Anything the agent can derive from the code (directory listings, dependency lists,
architecture overviews) is pure cost. Pitfalls, rationale, and conventions that differ
from tool defaults are what earn their place.

**Budget: under 200 lines.** Longer files consume context and measurably reduce
adherence — the model starts ignoring rules rather than obeying more of them. For
reference, Anthropic's own public `CLAUDE.md` files run 44, 66, and 111 lines, and
none of them uses "IMPORTANT" or "YOU MUST". If you find yourself reaching for
emphasis, the file is probably too long and the rule is getting lost in noise.

Two hard ceilings, whichever binds first: 200 lines (Claude Code adherence) and
32 KiB (Codex truncates the instruction chain there, silently).

---

## 1. Setup

1. Copy the block in **§2** into the new project as `CLAUDE.md`.
2. Copy the block in **§3** into the same directory as `AGENTS.md`.
3. Replace the `## Architecture` section with one profile from **§4**.
4. Replace the `## Commands` section with one block from **§5**, then *run every
   command you wrote*. A wrong command is worse than no command — the agent trusts it
   and burns a cycle failing.
5. Fill every `<angle-bracket>` placeholder. Delete any section this project cannot
   justify; an empty section is structure the agent still pays to skim.
6. Run the checks in **§7**.

The `<!-- HTML comments -->` in the template are stripped before the file enters
context, so they cost nothing at runtime. Keep them as fill-in guidance for the next
person, or delete them — either is fine. Everything outside a comment is billed.

---

## 2. `CLAUDE.md` template

Copy everything between the fences.

~~~~markdown
# <Project> — Agent Instructions

<!-- FILL: 2-4 sentences. What this project does, who or what consumes its output,
     and the one thing a newcomer gets wrong about it. Not a feature list — the
     README already has one, and the agent can read it. -->
<What this project is, who consumes it, and the non-obvious thing about it.>

`CLAUDE.md` is the single source of truth for every coding agent in this repo.
`AGENTS.md` only routes other tools here and carries no rules of its own.

## Behavior Baseline

Biases caution over speed. For trivial tasks, use judgment and skip the ceremony.

- **State assumptions before implementing.** If several readings of the request are
  possible, present them rather than silently picking one. If something is unclear,
  stop and name what is confusing.
- **Write the minimum code that solves the stated problem.** No speculative
  abstraction, no configurability nobody asked for, no handling for states that
  cannot occur. If 200 lines could be 50, rewrite it.
- **Touch only what the request traces to.** Match surrounding style even where you
  would choose differently. Remove the imports and helpers *your* change orphaned;
  report pre-existing dead code instead of deleting it.
- **Convert the task into a verifiable goal before starting.** "Fix the bug" becomes
  "write a failing test that reproduces it, then make it pass." For multi-step work,
  state the plan as `step → verify:` pairs and loop until every verify passes.

## Architecture

<!-- FILL: replace this whole section with one profile from claude-setup.md §4.
     Keep only truths that span files. A fresh session gets the file tree from one
     Glob; what it cannot guess is which layer owns a fix, what is generated, and
     where data actually lives when the folder names mislead. -->

| Path | Responsibility | Agent may write? |
| --- | --- | --- |
| `<src/...>` | <what lives here> | Yes |
| `<generated/>` | <generated artifacts> | NEVER — regenerate with `<command>` |
| `.env` | Secrets, gitignored | NEVER |

<The one-way flow: the real entry point, what depends on what, and the layer where a
defect gets fixed when several could plausibly host it.>

## Commands

<!-- FILL: replace with one block from claude-setup.md §5. Include only what the
     agent cannot derive from the manifest. The single-test invocation is mandatory —
     agents guess it wrong more than anything else, then fall back to running the
     whole suite, which is slow enough to change how they work. -->

```sh
<install>
<run>
<test, whole suite>
<test, ONE test — the invocation agents get wrong>
<lint>
<typecheck>
```

<Any command with a precondition, e.g. "integration tests need Docker running".>

## Conventions That Differ From Defaults

<!-- FILL: deltas only. If the model would already do it unprompted, cut the line.
     Naming an authority ("follow Clean Code") hands the decision back to the model —
     write the decision itself. -->

- **Package manager**: `<the one command>`. Using another is an error, not a choice.
- **Imports**: <e.g. absolute from `src/`; never relative beyond one level>
- **Errors**: <e.g. return Result types; never throw across a module boundary>
- **Formatting**: enforced by `<command>`, never by hand and never in review
- **Commits**: Conventional Commits — `<type>(<scope>): <subject>`. Scopes in use:
  <list>. `feat` → MINOR, `fix` → PATCH, `!` before the colon → breaking change.
- **Branches**: `<pattern>`; <what must be green before a PR can merge>

```<lang>
<two lines showing the convention that prose alone leaves ambiguous>
```

## Boundaries & Data Security

<!-- FILL: every rule as a trigger — when X fires, do Y. Every prohibition names its
     replacement, or the agent is left guessing what to do instead. Delete any rule
     that cannot fire in this repo; carrying dead rules teaches the agent that this
     section is boilerplate to skim. -->

- Never edit `<generated path>` — change `<source>`, then run `<regenerate command>`.
- Never write to `<immutable input path>` — write derived output to `<path>` instead.
- Secrets live in `.env` only. Never print, log, commit, or paste a secret value.
  When a new key is needed, add its name to `.env.example` with an empty value.
- Before writing a new script, search `<scripts dir>` for one that already does it
  and extend that instead of adding a near-duplicate.
- Ask first: schema changes, new dependencies, removing public API, rerunning
  anything that spends paid API credits, and any destructive git operation.
- If more than <N> files would change, stop and present the plan before editing.

## Workflows

- **Bugfix**: write the failing test → confirm it fails for the right reason →
  implement → verify: `<test command>` and `<lint command>` pass.
- **Recovering from a failed script**: read the full error and trace → fix the script
  → verify: rerun it (if it spends paid credits, confirm with the user first) →
  record what you learned in the file that owns that procedure → verify: the next run
  of the same task does not repeat the failure.
- **<Release / migration>**: <steps> → verify: <the gate that blocks it>.

## Gotchas

<!-- Starts EMPTY and grows from incidents, never from doctrine. One line per failure
     that actually happened, phrased so it fires at the moment it matters. Delete a
     line once its underlying cause is fixed — a stale gotcha is pure cost. -->

## Verification

Done means verified, not written:

- Tests live in `<path>`; run a single one with `<literal invocation>`.
- `<test command>`, `<lint command>`, and `<typecheck command>` pass locally.
- <The project-specific check no test suite covers: golden-file diff, bundle size
  limit, smoke URL, row-count reconciliation.>

## Project Memory

- Architectural decisions live in `docs/adr/` as `NNNN-imperative-phrase.md`. Read
  the relevant record before any choice that outlives today's task. Never edit an
  accepted record — write a new one that supersedes it and link both ways.
- This file outranks any stored memory. On contradiction the memory is wrong: fix or
  delete it. A memory is promoted into this file by review, never automatically.

## Claude Code Specific

<!-- Claude-only mechanics, isolated here. The rules themselves stay in the sections
     above so that every tool receives them identically. Delete what this repo does
     not use — an aspirational list here is cost with no return. -->

- **Hooks** (`.claude/settings.json`): <the guardrail that has been violated for real
  and now deserves deterministic enforcement, e.g. a PreToolUse deny on `<path>`>.
  This file is context, not configuration; prose cannot guarantee anything, a hook can.
- **Skills** (`.claude/skills/<name>/SKILL.md`): <procedure moved out of Workflows
  once it outgrew about five steps>.
- **Subagents** (`.claude/agents/<name>.md`): <role, with its tool list narrowed to
  that role's actual limits>.
- **Path-scoped rules** (`.claude/rules/*.md`, `paths:` frontmatter): <rule that
  applies to one path only>. Keep to 3-5 short files — unlike this file, they are
  re-injected on every tool result.

## Codex Specific

- You reach these rules through `AGENTS.md`, which instructs you to open this file.
  Read it in full before your first edit.
- `@path` imports are not expanded for you. Every rule you must obey is inline here;
  nothing that binds you is hidden behind an import or a linked file.

## META — how a rule gets added here

When corrected, ask what single line would have prevented the mistake and add exactly
that line — not the paragraph around it, not the principle it belongs to. Start with
the trigger, name the replacement, and keep it concrete enough that someone with no
context could apply it. Ask before writing to this file. Prune any rule whose signal
below has stopped moving.

---

**Working if:** diffs contain only requested changes; the agent runs the right
commands without asking; clarifying questions arrive before implementation rather
than after a rewrite; and Gotchas grows from real incidents.
~~~~

---

## 3. `AGENTS.md` pointer

Copy into the same directory. Keep it under 12 non-blank lines — the moment it holds
a rule that is not a hard safety rail, the repo has two rulebooks.

The mirror block is optional and deliberate. Use it only if you have observed Codex
skipping the pointer, and only for actions whose consequences cannot be undone.

~~~~markdown
# Agent Instructions

Read `CLAUDE.md` in this directory and follow it in full before making any edit. It
is the single source of truth for all agents here; this file carries no rules of its
own. Every section applies to you except `## Claude Code Specific`.

<!-- MIRROR of CLAUDE.md § Boundaries. Do not edit here — edit CLAUDE.md and re-copy.
     Only irreversible-action guardrails may appear below. -->

- Never write to `<immutable input path>`.
- Never commit or print the contents of `.env`.
- Never run `<destructive command>` without explicit confirmation.
~~~~

**In a monorepo**, every directory with its own `CLAUDE.md` needs its own `AGENTS.md`
beside it. Codex reads AGENTS.md files along the path to its working directory, so a
package without one sees only the root rules — and if you launch Codex from the repo
root, it may not read the package file at all. Launch it from inside the package.

---

## 4. Architecture profiles

Pick one. Replace the whole `## Architecture` section of the template with it.

### Profile A — WAT (Workflows / Agents / Tools)

For automation projects where an agent orchestrates deterministic scripts. The split
exists because accuracy compounds badly: five chained steps at 90% each land at 59%.
Moving execution into scripts leaves the agent doing only what it is good at.

~~~~markdown
## Architecture

Three layers, and the agent occupies exactly one of them. `workflows/` says what to
do, `tools/` does it, and you decide which tool runs when. Read the workflow before
acting; do not perform by hand what a tool already does.

| Path | Responsibility | Agent may write? |
| --- | --- | --- |
| `workflows/` | Markdown SOPs: objective, inputs, tools, outputs, edge cases | Ask first — these are instructions, not scratch |
| `tools/` | Python scripts doing the actual work: APIs, transforms, file and DB operations | Yes |
| `.tmp/` | Intermediates and scraped data. Disposable, regenerated on demand | Yes |
| `.env` | API keys and credentials | NEVER |
| `credentials.json`, `token.json` | OAuth, gitignored | NEVER |

Deliverables go to <cloud destination> where the user can reach them. Local files are
processing artifacts; anything in `.tmp/` can be deleted without loss.
~~~~

### Profile B — Python `src/` layout (library, analysis, data)

Follows the PyPA `src/` layout: the package is importable only once installed, so the
in-development copy cannot silently shadow the installed one.

~~~~markdown
## Architecture

Importable code lives in `src/<pkg>/` and is installed in editable mode; nothing
imports from the repo root. Notebooks import from the package — logic that outlives
one exploration moves into `src/`.

| Path | Responsibility | Agent may write? |
| --- | --- | --- |
| `src/<pkg>/` | The importable package. All reusable logic | Yes |
| `tests/` | pytest suite, mirrors the package layout | Yes |
| `data/raw/` | Original immutable input | NEVER — read only, write to `data/interim/` |
| `data/interim/`, `data/processed/` | Derived data, regenerable | Yes |
| `notebooks/` | `NN-initials-short-description.ipynb`, numbered for order | Yes |
| `.env` | Secrets, gitignored | NEVER |

<Which module is the real entry point, and where a defect gets fixed when the
pipeline stage and the transform both look like candidates.>
~~~~

### Profile C — Node / TypeScript monorepo

~~~~markdown
## Architecture

`apps/` holds deployables, `packages/` holds what they share. Internal dependencies
use the `workspace:*` protocol, never a version range. Run tasks through the task
runner rather than a raw package command inside a directory, or the cache is bypassed
and dependent packages are not rebuilt.

| Path | Responsibility | Agent may write? |
| --- | --- | --- |
| `apps/<app>/` | Deployable applications | Yes |
| `packages/<pkg>/` | Shared libraries, config, UI | Yes |
| `<packages/*/dist>` | Build output | NEVER — rerun `<build command>` |
| `.env` | Secrets, gitignored | NEVER |

A change that touches a shared package affects every app that consumes it; check
consumers before changing an exported signature.
~~~~

### Profile D — Static web / dashboard

~~~~markdown
## Architecture

A static page with no build step: <entry file> loads <data file> and renders it.
Verification is visual — open the page and look, because nothing here is covered by a
test runner.

| Path | Responsibility | Agent may write? |
| --- | --- | --- |
| `<index.html>` | Page shell, inline styles and script | Yes |
| `<data/*.json / *.parquet>` | Generated payload | NEVER by hand — rerun `<generator>` |
| `<scripts/>` | The generator that produces the payload | Yes |

Everything is self-contained: no external CDN, no remote fonts, no network calls at
render time. Adding an external dependency is a decision to raise first.
~~~~

---

## 5. Command blocks

Pick one, then run every command before committing the file.

### Python (uv)

~~~~markdown
## Commands

```sh
uv sync                              # install, including dev extras
uv run <entrypoint>                  # run
uv run pytest                        # whole suite
uv run pytest tests/test_x.py::test_y -x   # ONE test — use this while iterating
uv run ruff check --fix .            # lint
uv run ruff format .                 # format
uv run mypy src/                     # typecheck
```

<Preconditions: which commands need `.env` populated or a service running.>
~~~~

### Node / TypeScript (pnpm)

~~~~markdown
## Commands

```sh
pnpm install                         # install
pnpm dev                             # run locally
pnpm test                            # whole suite
pnpm vitest run path/to/file.test.ts -t "case name"   # ONE test
pnpm lint                            # lint
pnpm tsc --noEmit                    # typecheck
pnpm build                           # build
```

<In a monorepo, add `--filter <pkg>` and say which package is the usual target.>
~~~~

### Static web / dashboard

~~~~markdown
## Commands

```sh
python -m http.server 8000           # serve — file:// breaks fetch and modules
python scripts/<generate>.py         # regenerate the data payload
```

There is no test runner. Verification is: regenerate the payload, reload the page,
and confirm <the specific thing that must render>.
~~~~

---

## 6. Where content goes when it does not belong in `CLAUDE.md`

Most of what you are tempted to add belongs somewhere cheaper. Route before writing.

| The content is… | Home | Why |
| --- | --- | --- |
| Something that must always hold, mechanically | Hook in `.claude/settings.json` | Prose can be ignored; a `PreToolUse` deny cannot |
| A multi-step procedure used occasionally | `.claude/skills/<name>/SKILL.md` | Loads only when triggered |
| Guidance for one path only | `.claude/rules/*.md` with `paths:` frontmatter | Other paths do not pay for it |
| An architectural decision and its rationale | `docs/adr/NNNN-*.md` | Read on demand, not on every message |
| Long or fast-changing reference material | A linked file, referenced in prose | Keeps the always-on file small |
| Personal, not team | `CLAUDE.local.md` (gitignored) | Not everyone's context |
| A learned session fact, not a reviewed rule | Auto memory | Memory defers to `CLAUDE.md` |
| An unenforceable convention that applies repo-wide | **Root `CLAUDE.md`** | This is what is left |

Two traps worth knowing:

- **`@import` does not shrink the file.** Imported files load in full at launch, so
  the context cost is identical — and Codex never expands them at all. Use imports
  for organization or for Claude-only material, never for rules Codex must obey.
- **`.claude/rules/` is not free.** Those files are re-injected on every tool result,
  while `CLAUDE.md` sits once in the cached prefix. A rule file that seems cheap
  because it is short is multiplied by every tool call in the session.

---

## 7. Verification

Run these once after setting up a project, and again whenever the file grows.

1. **Mechanical audit** — from the project root:
   `python C:\Users\Usuario\.claude\skills\claude-md-creator\scripts\audit_claude_md.py .`
   Expect 0 FAIL. A FAIL on placeholders means step 5 of the setup is unfinished.
2. **Budget** — `CLAUDE.md` at or under 200 lines and under 32 KiB.
3. **Claude Code sees it** — run `/context` and confirm `CLAUDE.md` appears under
   *Memory files*.
4. **Codex sees it** — in a fresh session:
   `codex --ask-for-approval never "Summarize the project instructions you loaded."`
   The answer must name `CLAUDE.md`. If it does not, escalate in this order: tighten
   the pointer so it is the first thing in `AGENTS.md`; then add the marked mirror
   block from §3, limited to irreversible actions.
5. **Deletion test** — read the file line by line. Every line must name a mistake it
   prevents. If you cannot say what breaks without it, it goes.

---

## 8. Maintenance

A good instruction file is grown from failures, not authored from doctrine. Rules
derived from real incidents are grounded in this project; rules derived from
principle are generic and compete for the same budget.

- **After each correction**, add the one line that would have prevented it, at the
  narrowest scope that fits. A correction that happened inside a skill belongs in
  that skill's file, not the root.
- **Prune when** the target mistake stops occurring, a gotcha's underlying bug is
  fixed, or two lines say the same thing in different words. Accumulated one-liners
  converge; a periodic dedupe pass is worth scheduling.
- **Review once per model generation.** New models internalize behaviors that older
  rules were written to correct, and those rules become pure cost. For each line in
  Behavior Baseline, ask whether you have actually seen this model make that mistake.
  If you cannot recall an instance, it is a deletion candidate.
- **Watch the signals**, not the line count. A rule cluster whose working-if signal
  never moves is the next thing to delete.

One caveat worth carrying: a controlled study found that agent instruction files
written by LLMs slightly *reduced* task success while raising inference cost over
20%, whereas human-written ones helped modestly. These files compensate for missing
documentation — they are not a free improvement layered on top of a well-documented
repo. Keep this one thin and let it earn its length.
