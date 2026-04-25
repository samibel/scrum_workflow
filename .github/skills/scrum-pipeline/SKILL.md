---
name: scrum-pipeline
description: "Scrum Workflow: Automate the story lifecycle by sequentially routing stories through create-ticket, refine-ticket, refine-story, dev-story, review-story, and approve. Use when the user says 'run pipeline', 'pipeline stories', or '/scrum-pipeline'."
---

Load and execute the framework command at `scrum_workflow/commands/pipeline.md`.

The command file contains the full workflow orchestration including:
- Data-driven routing matrix from `data/pipeline-routing.yaml`
- Input modes: single story, multi-story, epic, --to, --pending, --resume
- Sequential story processing with review loop (max 3 iterations)
- Checkpoint/resume via `.pipeline-state.json`
- Error classification: recoverable (skip + continue) vs. fatal (halt)
- Progress reporting with per-story status lines and aggregate summary
