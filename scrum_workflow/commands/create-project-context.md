---
name: create-project-context
trigger: "/create-project-context"
requires_status: null
sets_status: null
spawns_agents: []
---

## Purpose

Analyze the project codebase to discover its tech stack, architecture, and conventions, then generate project-specific context files and domain skill files. This is Phase 0 of the workflow -- it must run before any ticket work so that agents understand the project before creating or refining stories.

## Workflow Reference

workflows/project-context.md

## Input

Project root directory (implicit from current working directory). The command reads existing framework templates from `scrum_workflow/templates/` and analyzes the codebase using shell commands to collect facts about the project.

## Output

- `context/*.md` -- Project context files with YAML frontmatter (one per detected domain, plus `index.md`)
- `skills/*/SKILL.md` -- Domain-specific skill files (one per detected domain)
