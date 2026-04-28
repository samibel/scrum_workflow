---
name: scrum-ticket-changes
description: "Scrum Workflow: Generate a follow-along, step-by-step coding tutorial for a ticket — the reader can re-implement the change by reading the document and typing the snippets into their editor. Pulls commits from git, weaves in plan.md rationale, and renders prose with Open / Locate / Action / What this does / Verify per step. Use when the user says 'ticket changes', 'tutorial for SW-XXX', 'walkthrough', 'follow-along', 'rebuild SW-XXX', or '/scrum-ticket-changes'."
---

Load and execute the framework command at `{{framework_path}}/commands/ticket-changes.md`.

The command file contains the full workflow orchestration including:
- Discovering ticket commits via `git log --grep=SW-XXX` (subject + trailers)
- Extracting hunks per file with configurable context (`--context-lines`, `--max-hunk-lines`, `--include`, `--exclude`)
- Grouping the raw changes into ordered tutorial **steps** (one per logical change, plan-step-aligned when possible)
- Rendering each step in second-person prose: Goal → Open / Create file → Locate → imperative Action sentence → typeable code snippet(s) → "What this does" paragraph → optional Mermaid diagram → Verify checkpoint
- Auto-derived Introduction (What you'll build / Why / Prerequisites / What you'll learn) and Reference (files touched table, commit list, totals)
- Mermaid diagrams **on by default** — one per step, picked deterministically from a 4-type whitelist (flowchart for routing/control flow, sequence for cross-service calls, stateDiagram for status/lifecycle code, classDiagram for OOP structure). Disable with `--no-diagrams`. Steps without a whitelist match get no diagram (never invented to fill the slot).
- Full diff appendix **on by default** — at the end of every tutorial, one collapsible `<details>` block per touched file with the complete Before / After / Why so the reader has a full reference without re-walking the steps. Disable with `--no-diff-appendix`. In split mode the appendix is its own file at `100-appendix-diffs.md`.
- Single-ticket, multi-ticket, `--epic N`, `--all`, `--bundle`, and `--split` (one file per step) modes
- Output paths under the ticket directory: `_scrum-output/sprints/SW-XXX/tutorials/{tutorial.md,README.md,00-introduction.md,steps/NN-<slug>.md,98-recap.md,99-reference.md,assets/diffs/*.diff}`
- Markdown (default) and JSON output formats
- Read-only on sprints/git; writes only into the ticket's `tutorials/` subdirectory (plus `_scrum-output/tutorials/<bundle>.md` for cross-ticket bundles)
