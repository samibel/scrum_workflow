---
name: scrum-dev-story
description: "Scrum Workflow: Implement a story following its specification and execution plan from the refined story file. Use when the user says 'dev story', 'implement story', or '/scrum-dev-story'."
---

Load and execute the framework command at `scrum_workflow/commands/dev-story.md`.

The command file contains the full workflow orchestration including:
- Guard condition enforcement (status must be ready)
- Story specification and plan loading
- Code implementation following execution plan
- Story status transition to in-dev
