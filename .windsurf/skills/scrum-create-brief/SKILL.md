---
name: scrum-create-brief
description: "Scrum Workflow: Transform a raw idea into a structured product brief via Iterative Multi-Agent Brainstorming plus a Reflection Loop that resolves open questions. Use when the user says 'create brief', 'capture idea', or '/scrum-create-brief'."
---

Load and execute the framework command at `scrum_workflow/commands/create-brief.md`.

The command file contains the full workflow orchestration including:
- Parallel analysis by product-strategist, architect, and qa agents
- Reflection Loop that surfaces and resolves open questions via user interview
- Brief artifact creation at `_scrum-output/briefs/PB-XXX.md`
- Status transition to `complete` once no open questions remain
