---
name: scrum-refine-story
description: "Scrum Workflow: Validate story completeness using the Feature List as Immutable Contract pattern. Use when the user says 'refine story', 'validate story', or '/scrum-refine-story'."
---

Load and execute the framework command at `scrum_workflow/commands/refine-story.md`.

The command file contains the full workflow orchestration including:
- Validation against immutable 5-criterion checklist
- Status guard enforcement (status must be refined)
- Execution plan creation on validation PASS
- Story status transition to ready-for-dev
