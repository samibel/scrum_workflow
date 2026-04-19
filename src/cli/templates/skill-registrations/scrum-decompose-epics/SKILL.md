---
name: scrum-decompose-epics
description: "Scrum Workflow: Decompose a completed product brief into a bounded graph of epics using the Plan-Then-Execute pattern. Use when the user says 'decompose epics', 'break down brief', or '/scrum-decompose-epics'."
---

Load and execute the framework command at `{{framework_path}}/commands/decompose-epics.md`.

The command file contains the full workflow orchestration including:
- Single epic-decomposer agent producing the full epic graph in one pass
- Deterministic epic IDs (`EP-001`, `EP-002`, …) under `_scrum-output/epics/`
- Epic index with dependency graph written to `_scrum-output/epics/index.md`
- Brief status transition from `complete` to `decomposed`
- Idempotent re-decomposition via `--force`
