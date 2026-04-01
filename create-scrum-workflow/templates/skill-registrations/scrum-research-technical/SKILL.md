---
name: scrum-research-technical
description: "Scrum Workflow: Conduct technical research on a specified topic using agentic patterns with Plan-Then-Execute workflow. Use when the user says 'research technical', 'technical research', or '/scrum-research technical'."
---

Load and execute the framework command at `{{framework_path}}/commands/research-technical.md`.

The command file contains the full workflow orchestration including:
- WebSearch-based external research (not local codebase scanning)
- Plan-Then-Execute methodology with 6 phases
- Swarm Migration pattern for parallel subagent research
- Reflection Loop for quality assurance
- Filesystem-Based State for checkpoint recovery
- Update mode for incremental research updates (--update flag)
