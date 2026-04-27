# Workflow Definitions

This directory contains step-by-step workflow execution details.

## Purpose

Workflows define the detailed execution steps for each command, including initialization, processing, and completion phases.

## Structure

Each workflow is defined as a Markdown file with detailed execution steps:

```
workflow-name.md
├── Overview
├── Prerequisites
├── Step-by-step execution
└── Error handling
```

## Workflows

### Greenfield (pre-ticket)

- **brief-creation.md**: Raw-idea capture + parallel brainstorming + aggressive Reflection Loop until no open questions remain (`/scrum-create-brief`)
- **epic-decomposition.md**: Plan-Then-Execute decomposition of a brief into a bounded epic graph (`/scrum-decompose-epics`)
- **story-drafting.md**: Orchestrator-Worker parallel story drafting for one epic (`/scrum-draft-stories`)

### Story Lifecycle

- **project-context.md**: Two-phase codebase analysis and context generation
- **ticket-creation.md**: Story generation from user requirements (supports `--from-epic --from-draft` to promote a greenfield draft)
- **refinement.md**: Multi-agent perspective gathering and synthesis
- **readiness-check.md**: Story completeness validation before implementation
- **development.md**: Implementation from story specification
- **review.md**: Code review with structured findings
- **approval.md**: Human approval gate and story completion

### Observability

- **audit.md**: Append-only audit trail of every transition, action, and artifact event (`/scrum-audit-trail`)
- **ticket-changes.md**: Follow-along, retypeable code-change tutorial with auto-Mermaid diagrams and a default-on full diff appendix per file (`/scrum-ticket-changes`)

## Design Principles

- Workflows are declarative (specify WHAT, not HOW)
- Each step is atomic and independently executable
- Error states are explicit with recovery paths
- Progress is tracked through status updates
