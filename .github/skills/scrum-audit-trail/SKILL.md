---
name: scrum-audit-trail
description: "Scrum Workflow: Query and display the complete audit trail for a story with all transitions, agent actions, and artifact creation events. Use when the user says 'show audit trail', 'audit log', or '/scrum-audit-trail'."
---

Load and execute the framework command at `scrum_workflow/commands/audit-trail.md`.

The command file contains the full workflow orchestration including:
- Append-only audit trail with all story events
- Event types: transitions, agent actions, artifact creations
- Complete traceability from draft to done
- Event filtering and querying capabilities
