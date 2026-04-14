---
name: scrum-create-project-docs
description: "Scrum Workflow: Generate structured business logic documentation (business rules, workflows, domain models) by analyzing the codebase. Use when the user says 'create project docs', 'generate business logic docs', or '/scrum-create-project-docs'."
---

Load and execute the framework command at `scrum_workflow/commands/create-project-docs.md`.

The command file contains the full workflow orchestration including:
- Documentarian agent spawning for business logic analysis
- Full-scan and incremental update modes
- Business rules, workflows, and domain model documentation generation
- Mermaid diagram generation for visualizing business logic
