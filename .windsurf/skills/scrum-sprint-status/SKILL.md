---
name: scrum-sprint-status
description: "Scrum Workflow: Display sprint-level story status summary with current state, age, and pending actions. Use when the user says 'sprint status', 'show status', or '/scrum-sprint-status'."
---

Load and execute the framework command at `scrum_workflow/commands/sprint-status.md`.

The command file contains the full workflow orchestration including:
- Scan all story directories in _scrum-output/sprints/
- Display summary table with story ID, title, status, age
- Show pending actions (next required commands)
- Optional filtering by epic or other criteria
