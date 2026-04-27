---
name: scrum-ticket-changes
description: "Scrum Workflow: Generate a Before/After/Why code-change tutorial for a ticket — extracts the diffs from git, pairs them with the rationale from plan.md and commit messages, and renders one section per touched file. Use when the user says 'ticket changes', 'code change tutorial', 'before after for SW-XXX', 'explain the changes in SW-XXX', or '/scrum-ticket-changes'."
---

Load and execute the framework command at `{{framework_path}}/commands/ticket-changes.md`.

The command file contains the full workflow orchestration including:
- Discovering ticket commits via `git log --grep=SW-XXX` (subject + trailers)
- Extracting hunks per file with configurable context (`--context-lines`, `--max-hunk-lines`, `--include`, `--exclude`)
- Rendering per-file Before / After / Why sections — Why is synthesised from plan.md steps and commit messages
- Single-ticket, multi-ticket, `--epic N`, `--all`, `--bundle`, and `--split` (multi-file) modes
- Multi-file output: `--split` writes one chapter per touched source file under `_scrum-output/tutorials/SW-XXX/files/` plus a `README.md` landing page, an overview, a summary, and `assets/diffs/<sha>.diff` for oversized hunks
- Markdown (default) and JSON output formats
- Read-only on sprints/git; writes only into `_scrum-output/tutorials/`
