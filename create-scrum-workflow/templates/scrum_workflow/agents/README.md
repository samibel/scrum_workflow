# Agent Definitions

This directory contains agent role definitions in SKILL.md format.

## Purpose

Agent definitions specify the roles, capabilities, and behaviors of AI agents that participate in the scrum_workflow framework.

## Structure

Each agent is defined as a Markdown file with YAML frontmatter:

```
agent-name.md
├── YAML frontmatter (metadata)
└── Markdown body (role definition)
```

## Current Agents (MVP)

- **architect.md**: Handles architectural design, risk assessment, and dependency analysis
- **developer.md**: Manages technical implementation, feasibility analysis, and code changes
- **qa.md**: Performs acceptance criteria validation, edge case testing, and quality assurance

## Future Expansion

Additional agents can be added by creating new `.md` files following the SKILL.md format.
