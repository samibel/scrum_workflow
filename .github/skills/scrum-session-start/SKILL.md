---
name: scrum-session-start
description: "Scrum Workflow: Resume your previous session by loading context, open work units, last decisions, active risks, and next steps. Use when the user says 'resume session', 'session start', or '/session-start'."
---

Load and execute the framework command at `scrum_workflow/commands/session-start.md`.

The command file contains the full workflow orchestration including:
- Load developer's previous session context
- Display open work units and last decisions
- Show active risks and next steps
- Enable resume exactly where left off (under 60 seconds)
- Read-only operation: no file modifications
