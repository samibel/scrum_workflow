# Agent Definitions

This directory contains agent role definitions as Markdown files with YAML frontmatter.

## Purpose

Agent definitions specify the roles, capabilities, and behaviors of AI agents that participate in the scrum_workflow framework.

## Structure

Each agent is defined as a Markdown file with YAML frontmatter:

```
agent-name.md
├── YAML frontmatter (metadata)
└── Markdown body (role definition)
```

## Core Agents

- **architect.md**: Handles architectural design, risk assessment, and dependency analysis
- **developer.md**: Manages technical implementation, feasibility analysis, and code changes
- **qa.md**: Performs acceptance criteria validation, edge case testing, and quality assurance

## Extended Agents (Phase 4)

- **security-reviewer.md**: Reviews security-tagged stories for vulnerabilities, authentication issues, and data exposure risks. Dispatched for high/critical risk stories.
- **ux-reviewer.md**: Reviews frontend-tagged stories for usability, accessibility (WCAG), and design consistency. Dispatched for frontend/ui/ux domain tags.
- **contract-validator.md**: Post-implementation validation that code matches story specifications and API contracts. Dispatched for api/contract/integration domain tags.

## Future Expansion

Additional agents can be added by creating new `.md` files following the established agent format with YAML frontmatter and the four required body sections (Identity, Instructions, Output Format, Context Rules).
