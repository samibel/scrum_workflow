---
name: scrum-approve
description: "Scrum Workflow: Implement the mandatory human approval gate before a story reaches 'done' status. Use when the user says 'approve story', 'sign off', or '/scrum-approve'."
---

Load and execute the framework command at `scrum_workflow/commands/approve.md`.

The command file contains the full workflow orchestration including:
- Human approval gate that requires explicit sign-off
- Audit trail of approval decisions
- Status transition from approved → done
- Approval artifact creation with decision record
