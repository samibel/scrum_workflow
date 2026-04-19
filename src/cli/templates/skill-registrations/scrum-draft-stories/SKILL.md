---
name: scrum-draft-stories
description: "Scrum Workflow: Generate candidate story drafts for an epic using the Orchestrator-Worker pattern with N parallel subagents. Use when the user says 'draft stories', 'generate story candidates', or '/scrum-draft-stories'."
---

Load and execute the framework command at `{{framework_path}}/commands/draft-stories.md`.

The command file contains the full workflow orchestration including:
- Orchestrator reading the epic's capability breakdown
- Parallel architect, developer, and qa subagents drafting one story candidate each
- Aggregated output at `_scrum-output/epics/EP-XXX/draft-stories.md`
- Epic status transition from `planned` to `drafted`
- Resume/restart support via `--resume` and `--restart`
