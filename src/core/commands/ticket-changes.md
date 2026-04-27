---
name: ticket-changes
trigger: "/scrum-ticket-changes"
requires_status: any
sets_status: none
pattern: observability
model_recommendation: "haiku"
---

## Purpose

Generate a tutorial-style Markdown document that walks through every change a ticket (or a set of tickets) went through during its lifecycle. The command aggregates audit trail entries, status transitions, and lifecycle artifacts (refinement, plan, verification, review, approval) into a chronological, narrative tutorial that newcomers and stakeholders can read top-to-bottom.

The result is intentionally written as a **tutorial**, not a raw log: each phase is introduced with context, the reasoning behind transitions is summarized, and the final output explains *what* happened, *why* it happened, and *what was learned*.

## Agentic Pattern

**Pattern:** [Plan-Then-Execute] + [Observability & Audit]

**Key Principles:**
- **Aggregate, don't reinvent:** Reuse the existing audit trail (`/scrum-audit-trail`), `status_history`, and lifecycle artifacts as the single source of truth.
- **Narrative over log:** Convert raw events into chapters with prose, headings, and a Mermaid timeline so the output reads as a tutorial.
- **Read-mostly:** Only writes happen inside `_scrum-output/tutorials/` — never modify the source artifacts.
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
- **Prerequisite**: At least one of `_scrum-output/sprints/SW-XXX/story.md` or `_scrum-output/audit/SW-XXX-audit.md` must exist for each requested ticket.

## Options

| Option | Description |
|--------|-------------|
| `--format markdown` | Render as Markdown tutorial (default). |
| `--format json` | Emit structured JSON for downstream tooling. |
| `--split` | Multi-file mode: write each chapter as its own file under `_scrum-output/tutorials/SW-XXX/`, plus a `README.md` landing page. The agent MAY also emit auxiliary asset files (Mermaid sources, extracted diffs) under `assets/`. |
| `--include-diffs` | Embed git diffs of files changed by `/scrum-dev-story` cycles. In `--split` mode, large diffs MAY be written to dedicated files under `assets/diffs/` and linked from the implementation chapter. |
| `--no-timeline` | Skip the Mermaid Gantt/timeline chapter. |
| `--bundle <name>` | When multiple tickets are requested, write a single combined file `_scrum-output/tutorials/<name>-tutorial.md` instead of one file per ticket. Mutually exclusive with `--split`. |
| `--since <ISO-date>` | Only include audit entries on or after the given ISO 8601 timestamp. |

## Output

The agent MAY create multiple files per run when the chosen mode requires it (split mode, multi-ticket runs, asset extraction). All writes are confined to `_scrum-output/tutorials/`.

### Single Ticket — Single File (default)

```
_scrum-output/tutorials/SW-XXX-tutorial.md
```

### Single Ticket — Split (`--split`)

One file per chapter plus a `README.md` landing page. Auxiliary assets (Mermaid sources, extracted diffs) live under `assets/`:

```
_scrum-output/tutorials/SW-XXX/
├── README.md              # landing page; links to every chapter in order
├── 01-the-idea.md
├── 02-refinement.md
├── 03-planning.md
├── 04-implementation.md
├── 05-verification.md
├── 06-review-approval.md
├── 07-timeline.md
├── 08-lessons.md
└── assets/                # created on demand
    ├── timeline.mmd       # raw Mermaid source for chapter 7
    └── diffs/             # one file per commit when --include-diffs is set
        └── <short-sha>.diff
```

Chapters whose source data is missing MUST still produce a file containing the `*No data recorded for this phase.*` placeholder so the per-chapter file count is stable across runs.

### Multiple Tickets (default)

One tutorial per ticket in `_scrum-output/tutorials/`, plus an index file:

```
_scrum-output/tutorials/index.md
_scrum-output/tutorials/SW-001-tutorial.md
_scrum-output/tutorials/SW-002-tutorial.md
```

### Multiple Tickets — Split (`--split`)

Each ticket gets its own subdirectory (same layout as the single-ticket split mode), and a top-level `index.md` links to every per-ticket `README.md`:

```
_scrum-output/tutorials/
├── index.md
├── SW-001/
│   ├── README.md
│   ├── 01-the-idea.md
│   └── ...
└── SW-002/
    ├── README.md
    └── ...
```

### Bundled (`--bundle release-1`)

```
_scrum-output/tutorials/release-1-tutorial.md
```

`--bundle` is mutually exclusive with `--split` — if both are passed, halt with a clear error.

### Tutorial Structure

Each generated tutorial follows the template defined in `workflows/ticket-changes.md` and contains the following chapters in order:

1. **Frontmatter** — `ticket`, `title`, `final_status`, `generated`, `entry_count`.
2. **Chapter 1 — The Idea** — title, description, acceptance criteria from `story.md`.
3. **Chapter 2 — Refinement** — distilled multi-agent perspectives from `refinement.md`.
4. **Chapter 3 — Planning** — execution plan highlights from `plan.md`.
5. **Chapter 4 — Implementation** — what changed during `dev-story` cycles, plus optional git diffs (`--include-diffs`).
6. **Chapter 5 — Verification** — pass/fail summary from `verification-report.md`.
7. **Chapter 6 — Review & Approval** — review and approval rounds from `review-N.md` / `approval-N.md`.
8. **Chapter 7 — Timeline** — Mermaid Gantt chart of every transition and artifact event.
9. **Chapter 8 — Lessons Learned** — bullet summary of risks raised, decisions taken, and follow-ups.

### On Success

```
✓ Tutorial generated for SW-XXX

  File:    _scrum-output/tutorials/SW-XXX-tutorial.md
  Events:  12 audit entries
  Chapters: 8

Next Step: Open the file or share it with stakeholders.
```

### On Error (Invalid Ticket ID)

```
❌ Invalid Ticket ID: <input>

**Format:** Ticket ID must match SW-XXX (e.g., SW-001, SW-042).

**Next Step:** Provide a valid ticket ID, or use --epic N / --all.
```

### On Error (No Data Available)

```
ℹ️ Nothing to tutor for SW-XXX

No story.md or audit trail was found. The story has not produced any
recorded events yet.

**Next Step:** Run /scrum-create-ticket SW-XXX, then re-run this command
once events have been recorded.
```

## Data Sources

The command reads (read-only) from:

| Source | Used For |
|--------|----------|
| `_scrum-output/sprints/SW-XXX/story.md` | Title, description, acceptance criteria, frontmatter, `status_history`. |
| `_scrum-output/audit/SW-XXX-audit.md` | Full chronological list of transitions, actions, and artifact events. |
| `_scrum-output/sprints/SW-XXX/refinement.md` | Refinement perspectives summary. |
| `_scrum-output/sprints/SW-XXX/plan.md` | Execution plan highlights. |
| `_scrum-output/sprints/SW-XXX/verification-report.md` | Verification summary. |
| `_scrum-output/sprints/SW-XXX/review-*.md` | Review round summaries. |
| `_scrum-output/sprints/SW-XXX/approval-*.md` | Approval round summaries. |
| `git log` (optional, with `--include-diffs`) | Embedded code diffs scoped to the ticket. |

Missing sources are tolerated — chapters whose source file is absent are rendered with `*No data recorded for this phase.*` so the tutorial remains complete.

## Write Boundary Rules

This command MAY write multiple files per run, all confined to `_scrum-output/tutorials/`:

- `_scrum-output/tutorials/SW-XXX-tutorial.md` — overwrite per run (default single-file mode).
- `_scrum-output/tutorials/SW-XXX/**` — overwrite per run (split mode); the agent creates the directory plus chapter files, the `README.md` landing page, and any required `assets/` files (Mermaid sources, per-commit diffs). Stale files from a previous run inside this subdirectory MAY be removed before writing so the output is deterministic.
- `_scrum-output/tutorials/index.md` — overwrite per run when multiple tickets are requested.
- `_scrum-output/tutorials/<bundle-name>-tutorial.md` — overwrite per run when `--bundle` is used.

This command MUST NOT:
- Write outside `_scrum-output/tutorials/`.
- Modify or delete any file inside `_scrum-output/sprints/`.
- Modify or delete any file inside `_scrum-output/audit/`.
- Mutate `status_history` or any story frontmatter.

## Integration Points

- **`/scrum-audit-trail`** is the primary upstream producer of events consumed here.
- **`/scrum-sprint-status`** complements this command by showing live status, while `/scrum-ticket-changes` produces the historical narrative.
- **`/scrum-delivery-health`** can link to generated tutorials for governance reporting.

## Error Handling

### Status Guard Violation

N/A — the command works for stories in any status, including `draft` and `cancelled`.

### Missing Source Files

Not an error. Each chapter falls back to a `*No data recorded for this phase.*` placeholder so the tutorial remains complete and valid Markdown.

### Concurrent Writes

If the target tutorial file is locked by another process, retry up to 3 times with exponential backoff (1s, 2s, 4s). After that, halt with a clear error.
