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

## Planned Workflows

- **project-context.md**: Two-phase codebase analysis and context generation
- **concept-creation.md**: Graph-based technical concept creation from repository evidence
- **ticket-creation.md**: Story generation from user requirements
- **refinement.md**: Multi-agent perspective gathering and synthesis
- **readiness-check.md**: Story completeness validation before implementation
- **development.md**: Implementation from story specification
- **review.md**: Code review with structured findings
- **approval.md**: Human approval gate and story completion

## Design Principles

- Workflows are declarative (specify WHAT, not HOW)
- Each step is atomic and independently executable
- Error states are explicit with recovery paths
- Progress is tracked through status updates
