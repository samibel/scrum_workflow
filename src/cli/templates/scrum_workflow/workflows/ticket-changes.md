# Ticket Code-Change Tutorial Workflow

**Purpose:** Define the deterministic transformation that turns the *code changes* belonging to a ticket into a Before / After / Why tutorial under `_scrum-output/tutorials/`.

**Referenced by:** `/scrum-ticket-changes` (`commands/ticket-changes.md`).

---

## Inputs

| Input | Required? | Source |
|-------|-----------|--------|
| `ticketId` | yes (or `--all` / `--epic`) | CLI argument, validated against `^SW-\d{3}$`. |
| `options.format` | no, default `markdown` | CLI flag `--format`. |
| `options.split` | no, default `false` | CLI flag `--split`. |
| `options.contextLines` | no, default `5` | CLI flag `--context-lines`. |
| `options.maxHunkLines` | no, default `60` | CLI flag `--max-hunk-lines`. |
| `options.include[]` | no | Repeatable `--include <glob>`. |
| `options.exclude[]` | no | Repeatable `--exclude <glob>`. Defaults: `package-lock.json`, `pnpm-lock.yaml`, `dist/**`, `build/**`, `**/*.{png,jpg,jpeg,gif,pdf,zip}`. |
| `options.since` | no | ISO 8601 date string from `--since`. |
| `options.bundleName` | no | String from `--bundle`. |

---

## Resolution Rules

When the user passes `--all` or `--epic N`, expand the input list before generation:

1. `--all` → list every directory matching `_scrum-output/sprints/SW-???/`.
2. `--epic N` → for each story directory, parse `story.md` frontmatter and keep only those with `epic: N`.
3. Multiple positional `SW-XXX` arguments → use as-is, after validation.

If, after resolution, the list is empty, halt with:

```
ℹ️ No tickets matched the requested filter.
```

If both `--split` and `--bundle` are passed, halt before any file access:

```
❌ --split and --bundle are mutually exclusive.
```

---

## Per-Ticket Pipeline

For each resolved ticket the workflow runs the following deterministic steps. Steps 1–4 are reads; step 5 builds the model; step 6 renders; step 7 is the only write.

### Step 1 — Discover Commits

Run a git query to find every commit that belongs to the ticket. Match on:

1. The ticket ID anywhere in the **subject line** (e.g., `feat(SW-042): …`).
2. The ticket ID in a **trailer** (`Refs: SW-042`, `Ticket: SW-042`).
3. The ticket ID as a standalone token in the commit body.

```bash
git log --pretty=format:"%H%x00%h%x00%aI%x00%an%x00%s%x00%b%x1e" \
        --grep="\\bSW-XXX\\b" --extended-regexp \
        ${since:+--since="$since"}
```

Parse the `\x1e`-separated stream into commit records:

```ts
{ sha, shortSha, authorDate, author, subject, body }
```

If the resulting list is empty *and* `_scrum-output/sprints/SW-XXX/story.md` is also missing, skip the ticket with the `Nothing to tutor` notice. If only `story.md` is missing, continue — commits still produce a valid tutorial.

### Step 2 — Load Story Snapshot

Read `_scrum-output/sprints/SW-XXX/story.md` (best-effort):

- Parse YAML frontmatter (title, status, type, risk_level, domain_tags, epic).
- Extract description and acceptance criteria sections.

If the file is missing, set `snapshot = null` — the *Why* paragraph then falls back to commit subjects only.

### Step 3 — Load Plan Snapshot

Read `_scrum-output/sprints/SW-XXX/plan.md` (best-effort):

- Extract numbered plan steps.
- For each step, capture the step text, the bullet list of files it mentions, and any acceptance-criterion ID it references.

This snapshot becomes the lookup table for the *Why* paragraph: when a hunk's file path matches a plan step's file list, that step's text is injected as rationale.

### Step 4 — Extract Hunks Per File

For every commit from step 1, run:

```bash
git show --no-color --unified=<contextLines> --first-parent <sha>
```

Parse the unified-diff output into a list of `FileChange` records:

```ts
type Hunk = {
  oldStart: number; oldLines: number;
  newStart: number; newLines: number;
  before: string;   // joined "-" + " " context lines
  after:  string;   // joined "+" + " " context lines
  raw:    string;   // full hunk text including the @@ header
};

type FileChange = {
  path: string;
  changeType: "added" | "modified" | "deleted" | "renamed";
  oldPath?: string;
  language: string;       // inferred from file extension
  isBinary: boolean;
  additions: number;
  deletions: number;
  hunks: Hunk[];
  commits: string[];      // short SHAs that touched this file
};
```

Apply filters:

1. Drop any path matching `options.exclude[]` (defaults plus user-supplied).
2. Keep only paths matching `options.include[]` if any were supplied.
3. Mark binaries (`Binary files differ` line) — they keep an entry but no hunks.
4. Hunks longer than `options.maxHunkLines` are flagged `oversized = true`.

Aggregate `FileChange` records across all commits, keyed by path. Sort by path ascending for stable output.

### Step 5 — Build the Tutorial Model

Combine the snapshots and file changes into the structure the renderer consumes:

```ts
{
  ticket: "SW-XXX",
  title: snapshot?.frontmatter.title ?? "(unknown)",
  finalStatus: snapshot?.frontmatter.status ?? "(unknown)",
  generated: <ISO timestamp>,
  goal: snapshot?.description ?? null,
  why: deriveWhy(snapshot, plan),
  files: FileChange[],
  commits: CommitRecord[],
  totals: { filesChanged, additions, deletions }
}
```

`deriveWhy()` rules:

1. If `plan.md` exists, take the first plan step's text as the high-level rationale.
2. Otherwise, take the first commit subject of the ticket.
3. If neither exists, set `why = null` and the renderer prints `*No rationale recorded.*`.

### Step 6 — Render

#### 6a. Markdown (default)

For each `FileChange`, render:

````
### `path/to/file.ext`

**Goal of this change:** {{plan-step text or commit subject}}

#### Hunk 1 (lines {{oldStart}}–{{oldStart + oldLines - 1}} → {{newStart}}–{{newStart + newLines - 1}})

**Before**

```{{language}}
{{hunk.before}}
```

**After**

```{{language}}
{{hunk.after}}
```

**Why:** {{plan-step text + commit subject + matched AC, joined into one paragraph}}
````

For oversized hunks (`hunk.oversized === true`) in single-file mode, wrap the After block in `<details><summary>Show full hunk</summary> … </details>` and also write the full hunk to `assets/diffs/<short-sha>.diff` so the user can open it in a diff viewer. In split mode, always emit `assets/diffs/<short-sha>.diff` and link to it from the file chapter.

For binary files, replace both blocks with `_(binary file — diff omitted)_`.

The top-level document layout matches the structure documented in `commands/ticket-changes.md` (Frontmatter → Overview → The Why → Files Changed → Summary).

#### 6b. JSON (`--format json`)

Skip the rendering loop and emit the model from step 5 directly. With `--split`, write one `<safe-path>.json` per file plus a top-level `metadata.json` (same `tutorials/` subdirectory as the Markdown variant). Without `--split`, write a single `_scrum-output/sprints/SW-XXX/tutorials/tutorial.json`.

### Step 7 — Write Output

The agent MAY write multiple files per run. Per-ticket output stays inside the ticket's own directory: **`_scrum-output/sprints/SW-XXX/tutorials/`**. The cross-ticket bundle and the multi-ticket index are the only writes that fall outside any individual ticket directory. Use an atomic write pattern (`temp file → rename`) for every file to avoid partial writes.

`mkdir -p` the per-ticket `tutorials/` subdirectory on demand — the installer does **not** pre-create it because each ticket's directory is itself created lazily by `/scrum-create-ticket`.

#### 7a. Single-file mode (default)

- Single ticket: `_scrum-output/sprints/SW-XXX/tutorials/tutorial.md` (overwrite).
- Multiple tickets without `--bundle`: write each ticket's tutorial under its own `_scrum-output/sprints/SW-XXX/tutorials/tutorial.md`.
- `--bundle <name>`: concatenate per-ticket outputs into `_scrum-output/tutorials/<name>-tutorial.md`, separated by `\n---\n` rules. Bundles are the only artifact written outside `_scrum-output/sprints/`.

After every per-ticket write (single- or multi-ticket runs, no bundle), regenerate the index file `_scrum-output/sprints/tutorials-index.md` by **scanning** `_scrum-output/sprints/` for all directories that contain a `tutorials/tutorial.md` (single-file mode) or a `tutorials/README.md` (split mode) and listing them sorted by ticket ID. This keeps the index accurate even when the command was invoked for a single ticket — previously generated tutorials remain listed.

#### 7b. Split mode (`--split`)

For each ticket, materialise the model into the ticket's `tutorials/` subdirectory:

```
_scrum-output/sprints/SW-XXX/tutorials/
├── README.md              # landing page; links every file chapter and the summary
├── 00-overview.md         # Overview + The Why
├── files/
│   ├── 01-<safe-path>.md  # one file per FileChange in stable order
│   └── ...
├── 99-summary.md          # files-changed table + commit list + totals
└── assets/                # only created if at least one asset is needed
    └── diffs/<short-sha>.diff
```

Rules:

1. Before writing, the agent MAY remove the existing `_scrum-output/sprints/SW-XXX/tutorials/` directory contents to ensure a clean, deterministic re-run. It MUST NOT touch any other file inside `sprints/SW-XXX/` (story.md, plan.md, etc.) and MUST NOT touch sibling tickets.
2. `<safe-path>` is the file path with `/` replaced by `-` and any character outside `[A-Za-z0-9._-]` replaced by `_`.
3. If a `FileChange` has zero hunks (binary or pure-rename), still emit a chapter file containing the goal and the binary/rename notice.
4. The `README.md` landing page lists every chapter in order (`00-overview.md`, every `files/NN-*.md`, `99-summary.md`).
5. Per-commit raw diffs are written under `assets/diffs/<short-sha>.diff` whenever any hunk in that commit was flagged oversized; the file chapter links to them with relative paths.

For multi-ticket runs in split mode, also write `_scrum-output/sprints/tutorials-index.md` linking to each per-ticket `tutorials/README.md`.

---

## Index File Format

When multiple tickets are generated and `--bundle` is **not** used, also emit `_scrum-output/sprints/tutorials-index.md`:

```markdown
---
generated: "<ISO timestamp>"
count: <N>
---

# Code-Change Tutorials

| Ticket | Title | Files | + | − | Commits | Tutorial |
|--------|-------|-------|---|---|---------|----------|
| SW-001 | … | 7 | 218 | 42 | 4 | [SW-001/tutorials/tutorial.md](./SW-001/tutorials/tutorial.md) |
| SW-002 | … | 2 |  31 |  5 | 1 | [SW-002/tutorials/tutorial.md](./SW-002/tutorials/tutorial.md) |
```

Links are relative to `_scrum-output/sprints/`. In split mode the link target is `./SW-XXX/tutorials/README.md` instead.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid ticket ID format | Halt before any file access; print the formatted error from `commands/ticket-changes.md`. |
| Both `--split` and `--bundle` passed | Halt before any file access with: `❌ --split and --bundle are mutually exclusive.` |
| Ticket has neither commits nor `story.md` | Skip the ticket and emit the `Nothing to tutor` notice. In multi-ticket mode the run continues for the remaining IDs. |
| `_scrum-output/sprints/SW-XXX/` missing | The ticket directory is created by `/scrum-create-ticket`. If it does not exist, skip the ticket with the `Nothing to tutor` notice — do not create it from this command. |
| `_scrum-output/sprints/SW-XXX/tutorials/` missing | `mkdir -p` it on demand (it is not pre-created by the installer). In split mode also `mkdir -p` `tutorials/files/` and `tutorials/assets/diffs/` on demand. |
| `_scrum-output/tutorials/` missing (bundle mode only) | `mkdir -p` it on demand. |
| Concurrent write conflict | Retry up to 3 times with backoff 1s/2s/4s. After that, halt. |
| `git log` / `git show` fails on a single rev | Emit a warning, drop that commit from the model, and continue. Never abort the tutorial because of git issues. |
| Repository is not a git working tree | Halt with: `❌ Not a git repository — /scrum-ticket-changes needs git history to extract code changes.` |

---

## Determinism Rules

1. Files MUST be sorted by path ascending.
2. Hunks within a file MUST be sorted by `newStart` ascending.
3. Commits MUST be listed in author-date ascending order.
4. The renderer MUST NOT reorder acceptance criteria or plan steps relative to their source files.
5. Re-running the command with identical inputs and an unchanged repository MUST produce a byte-for-byte identical Markdown output, except for the `generated` timestamp in the frontmatter.

---

*This workflow is referenced by the `/scrum-ticket-changes` command.*
