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

## Planned Commands

- **create-project-context.md**: Analyze codebase and generate project context files
- **create-ticket.md**: Create new story tickets from specifications
- **refine-ticket.md**: Multi-agent refinement of story requirements
- **dev-story.md**: Implement story from specification

## Usage

Commands are invoked through the AI coding assistant's slash command interface, referencing the framework via platform-specific adapters.
