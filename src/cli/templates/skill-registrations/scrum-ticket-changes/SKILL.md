---
name: scrum-ticket-changes
description: "Scrum Workflow: Generate a tutorial-style Markdown that walks through every change a ticket went through during its lifecycle. Use when the user says 'ticket changes', 'ticket tutorial', 'story changelog', 'show changes for SW-XXX', or '/scrum-ticket-changes'."
---

Load and execute the framework command at `{{framework_path}}/commands/ticket-changes.md`.

The command file contains the full workflow orchestration including:
- Aggregating audit trail entries, status_history, and lifecycle artifacts
- Rendering a chapter-based tutorial (Idea → Refinement → Planning → Implementation → Verification → Review → Timeline → Lessons Learned)
- Optional Mermaid Gantt timeline of every transition and artifact event
- Single-ticket, multi-ticket, `--epic N`, `--all`, `--bundle`, and `--split` (multi-file) modes
- Multi-file output: `--split` writes one file per chapter under `_scrum-output/tutorials/SW-XXX/` plus a `README.md` landing page and optional `assets/` (Mermaid sources, per-commit diffs)
- Markdown (default) and JSON output formats
- Read-only on sprints/audit; writes only into `_scrum-output/tutorials/`
