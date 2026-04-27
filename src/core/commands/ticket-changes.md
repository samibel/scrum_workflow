---
name: ticket-changes
trigger: "/scrum-ticket-changes"
requires_status: any
sets_status: none
pattern: observability
model_recommendation: "haiku"
---

## Purpose

Generate a **code-change tutorial** for a ticket (or a set of tickets): for every file the ticket touched, render a *before / after / why* block so a reader can learn what was changed in the codebase and the reasoning behind it without opening a single git diff manually.

The result is intentionally written as a **tutorial**, not a diff log. Each modified file gets:

- a short prose intro explaining the goal of the change,
- a `Before` code block showing the relevant pre-change snippet,
- an `After` code block showing the post-change snippet,
- a `Why` paragraph that combines the commit message, the relevant section of `plan.md`, and any acceptance criterion the change satisfies.

Pure lifecycle metadata (status transitions, refinement perspectives, review rounds) is **not** the focus of this command — those belong to `/scrum-audit-trail`.

## Agentic Pattern

**Pattern:** [Plan-Then-Execute] + [Observability]

**Key Principles:**
- **Code-first:** The unit of explanation is a file change (or a hunk), not a status transition.
- **Reuse, don't reinvent:** Pull diffs from git, rationale from `plan.md` / commit messages, intent from `story.md` description and acceptance criteria.
- **Read-mostly:** Only writes happen inside `_scrum-output/tutorials/` — never modify source artifacts or the working tree.
- **Idempotent:** Re-running the command on the same ticket overwrites the previous tutorial deterministically.

## Workflow Reference

workflows/ticket-changes.md

## Input

```
/scrum-ticket-changes SW-XXX
/scrum-ticket-changes SW-001 SW-002 SW-003
/scrum-ticket-changes --epic 8
/scrum-ticket-changes --all
```

- **Ticket number(s)**: One or more `SW-XXX` IDs (zero-padded, three digits).
- **`--epic N`**: Generate a tutorial for every story tagged with `epic: N` in `story.md` frontmatter.
- **`--all`**: Generate tutorials for every story directory under `_scrum-output/sprints/`.
- **Prerequisite**: At least one of `_scrum-output/sprints/SW-XXX/story.md` or commits referencing the ticket ID must exist. If neither is present the ticket is skipped with a notice.

## Options

| Option | Description |
|--------|-------------|
| `--format markdown` | Render as Markdown tutorial (default). |
| `--format json` | Emit structured JSON of the file-change model for downstream tooling. |
| `--split` | Multi-file mode: write one file per changed source file under `_scrum-output/tutorials/SW-XXX/files/`, plus a `README.md` landing page that links them all. Auxiliary assets (full raw diffs) live under `assets/diffs/`. |
| `--context-lines <N>` | Number of unchanged lines to include around each hunk in the Before/After blocks. Default: `5`. |
| `--max-hunk-lines <N>` | Hunks longer than this are summarised and the full diff moved to `assets/diffs/<short-sha>.diff` (or inlined behind a `<details>` block in single-file mode). Default: `60`. |
| `--include <glob>` | Only include files matching the glob (repeatable). |
| `--exclude <glob>` | Exclude files matching the glob (repeatable). Defaults: lock files, `dist/`, `build/`, binary assets. |
| `--bundle <name>` | When multiple tickets are requested, write a single combined file `_scrum-output/tutorials/<name>-tutorial.md` instead of one file per ticket. Mutually exclusive with `--split`. |
| `--since <ISO-date>` | Only include commits authored on or after the given ISO 8601 timestamp. |

## Output

The agent MAY create multiple files per run when the chosen mode requires it (split mode, large-diff extraction). Per-ticket tutorials always live **inside the ticket's own directory** (`_scrum-output/sprints/SW-XXX/tutorials/`), next to `story.md`, `plan.md`, etc. Cross-ticket bundles are the only exception — they aggregate multiple tickets and live under `_scrum-output/tutorials/`.

### Single Ticket — Single File (default)

```
_scrum-output/sprints/SW-XXX/tutorials/tutorial.md
```

### Single Ticket — Split (`--split`)

One file per touched source file plus a `README.md` landing page. Raw diffs are written under `assets/`:

```
_scrum-output/sprints/SW-XXX/tutorials/
├── README.md              # landing page; links to every per-file chapter and the summary
├── 00-overview.md         # goal of the ticket + why summary
├── files/
│   ├── 01-src-auth-login.ts.md
│   ├── 02-src-auth-session.ts.md
│   └── 03-tests-auth.test.ts.md
├── 99-summary.md          # files touched, lines added/removed, commit list
└── assets/
    └── diffs/
        └── <short-sha>.diff   # full raw diffs for hunks that exceeded --max-hunk-lines
```

Each `files/NN-<safe-path>.md` contains: the goal recap, then one `Before / After / Why` section per hunk in the file.

### Multiple Tickets (default)

Each ticket gets its own tutorial inside its own ticket directory — there is no shared output folder. A combined index is written at `_scrum-output/sprints/tutorials-index.md` linking to every per-ticket tutorial:

```
_scrum-output/sprints/tutorials-index.md
_scrum-output/sprints/SW-001/tutorials/tutorial.md
_scrum-output/sprints/SW-002/tutorials/tutorial.md
```

In `--split` mode, each ticket's directory uses the layout shown above and the index links to every per-ticket `README.md`.

### Bundled (`--bundle release-1`)

A bundle aggregates several tickets into one document and therefore cannot live under a single ticket directory. Bundles are the only artifact this command writes outside `sprints/`:

```
_scrum-output/tutorials/release-1-tutorial.md
```

`--bundle` is mutually exclusive with `--split` — passing both halts with an error.

## Tutorial Structure (Markdown)

Every generated tutorial follows the layout below.

1. **Frontmatter** — `ticket`, `title`, `final_status`, `generated`, `commit_count`, `files_changed`, `additions`, `deletions`.
2. **Overview** — title + the original goal taken verbatim from `story.md` description.
3. **The Why** — short paragraph synthesised from `plan.md` (when available) and acceptance criteria explaining the rationale behind the code change in plain language.
4. **Files Changed** — for each touched file, in stable path order:
   - **Heading**: `### \`<relative path>\``
   - **Goal of this change**: one sentence derived from the linked plan step or commit message.
   - For each hunk in the file:
     - **Before** — fenced code block with the language tag inferred from the file extension.
     - **After** — fenced code block with the language tag inferred from the file extension.
     - **Why** — one paragraph combining the commit subject, plan step text, and acceptance criterion (when matchable).
5. **Summary** — files-changed table (`File | + | − | Commits`), commit list (`<short-sha> <subject>`), and a one-line `Total: N files, +X / -Y lines` footer.

For binary or oversized files, replace `Before` / `After` with `_(binary file — diff omitted)_` or `_(diff truncated, see assets/diffs/<sha>.diff)_`.

### On Success

```
✓ Tutorial generated for SW-XXX

  File:    _scrum-output/sprints/SW-XXX/tutorials/tutorial.md
  Commits: 4
  Files:   7  (+218 / -42)

Next Step: Open the file or share it with stakeholders.
```

### On Error (Invalid Ticket ID)

```
❌ Invalid Ticket ID: <input>

**Format:** Ticket ID must match SW-XXX (e.g., SW-001, SW-042).

**Next Step:** Provide a valid ticket ID, or use --epic N / --all.
```

### On Error (No Code Changes Found)

```
ℹ️ Nothing to tutor for SW-XXX

No commits referencing this ticket were found and no story.md description
is available to derive a tutorial from.

**Next Step:** Make sure commit messages reference SW-XXX (subject or
trailer), then re-run this command.
```

## Data Sources

The command reads (read-only) from:

| Source | Used For |
|--------|----------|
| `git log --grep=SW-XXX` (subject + trailer) | Discover the commits that belong to the ticket. |
| `git show <sha>` / `git diff <base>..<head>` | Extract the actual hunks (Before / After). |
| `_scrum-output/sprints/SW-XXX/story.md` | Title, description, acceptance criteria for the *Why* paragraph. |
| `_scrum-output/sprints/SW-XXX/plan.md` | Per-step rationale, mapped to files via path or commit message references. |
| Commit messages (subject + body) | Per-hunk *Why* paragraph. |

If `plan.md` or `story.md` is missing, the *Why* paragraph falls back to the commit message subject only.

## Write Boundary Rules

This command MAY write multiple files per run. Per-ticket output is confined to **`_scrum-output/sprints/SW-XXX/tutorials/`** (one subdirectory per ticket, next to `story.md`/`plan.md`/etc.). The cross-ticket bundle and the multi-ticket index are the only writes that fall outside any individual ticket directory.

Allowed writes:

- `_scrum-output/sprints/SW-XXX/tutorials/tutorial.md` — overwrite per run (default single-file mode).
- `_scrum-output/sprints/SW-XXX/tutorials/**` — overwrite per run (split mode); the agent creates the `tutorials/` subdirectory plus per-file chapter files, the `README.md` landing page, the `00-overview.md`, the `99-summary.md`, and any required `assets/diffs/<sha>.diff`. Stale files from a previous run inside this `tutorials/` subdirectory MAY be removed before writing so the output is deterministic.
- `_scrum-output/sprints/tutorials-index.md` — overwrite per run when multiple tickets are requested without `--bundle`.
- `_scrum-output/tutorials/<bundle-name>-tutorial.md` — overwrite per run when `--bundle` is used (bundles aggregate tickets, so they don't fit under a single ticket directory).

This command MUST NOT:
- Write inside `_scrum-output/sprints/SW-XXX/` outside the `tutorials/` subdirectory — `story.md`, `plan.md`, `refinement.md`, `verification-report.md`, `review-*.md`, and `approval-*.md` are off-limits.
- Modify or delete any file inside `_scrum-output/audit/` or the working tree.
- Mutate `status_history` or any story frontmatter.
- Run any git command that mutates state (`commit`, `checkout`, `reset`, etc.).

## Integration Points

- **`/scrum-audit-trail`** is the lifecycle counterpart — it explains *when* status changes happened. `/scrum-ticket-changes` explains *what* changed in code and *why*.
- **`/scrum-dev-story`** is the upstream producer of the commits this command consumes; commits SHOULD reference `SW-XXX` in the subject or as a trailer for clean discovery.
- **`/scrum-refine-story`** produces the `plan.md` that supplies the *Why* paragraph.

## Error Handling

### Status Guard Violation

N/A — the command works for stories in any status.

### No Commits Reference the Ticket

Not an error in multi-ticket mode — skip the ticket and emit the `Nothing to tutor` notice. Continue with the remaining IDs.

### Git Command Failure

If a git command fails (corrupt repo, missing rev), emit a warning, omit the affected hunk or commit, and continue. Never abort the tutorial because of git issues.

### Concurrent Writes

If the target tutorial file is locked, retry up to 3 times with exponential backoff (1s, 2s, 4s). After that, halt with a clear error.
