---
name: scrum-create-project-context
description: "Scrum Workflow: Analyze the project codebase to discover tech stack, architecture, and conventions, then generate project context and domain skill files. Use when the user says 'create project context', 'analyze project', or '/scrum-create-project-context'."
---

Load and execute the framework command at `scrum_workflow/commands/create-project-context.md`.

The command file contains the full workflow orchestration including:
- Codebase analysis to discover tech stack and conventions
- Project context file generation with YAML frontmatter
- Domain-specific skill file creation
- Index file assembly for cross-referencing context
