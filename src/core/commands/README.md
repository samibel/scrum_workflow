# Command Definitions

This directory contains slash command definitions in SKILL.md format.

## Purpose

Commands are user-invocable operations that trigger specific workflows in the scrum_workflow framework.

## Structure

Each command is defined as a Markdown file with YAML frontmatter:

```
command-name.md
├── YAML frontmatter (metadata)
└── Markdown body (command implementation)
```

## Commands

### Greenfield / Idea-to-Tickets (3)

- **create-brief.md**: Capture a raw idea into a structured product brief (Iterative Multi-Agent Brainstorming + aggressive Reflection Loop)
- **decompose-epics.md**: Decompose a completed brief into a deterministic epic graph (Plan-Then-Execute, single agent)
- **draft-stories.md**: Generate N candidate story drafts for an epic in parallel (Orchestrator-Worker)

### Story Lifecycle

- **create-project-context.md**: Analyze codebase and generate project context files
- **create-ticket.md**: Create new story tickets from specifications — supports `--from-epic EP-XXX --from-draft N` to promote a greenfield draft
- **refine-ticket.md**: Multi-agent refinement of story requirements
- **dev-story.md**: Implement story from specification

### Observability

- **audit-trail.md**: Read-only query of the append-only audit trail for a story
- **ticket-changes.md**: Generate a follow-along, retypeable code-change tutorial for a ticket — second-person prose with Open / Locate / Action / What this does / Verify per step, an auto-inferred Mermaid diagram per step (whitelist of 4 types; disable with `--no-diagrams`), and a default-on full diff appendix per file (disable with `--no-diff-appendix`). Output lives next to `story.md` under `_scrum-output/sprints/SW-XXX/tutorials/`. Supports `--split` for one file per step.

## Usage

Commands are invoked through the AI coding assistant's slash command interface, referencing the framework via platform-specific adapters.
