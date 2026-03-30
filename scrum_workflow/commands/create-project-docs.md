---
name: create-project-docs
trigger: "/scrum-create-project-docs"
requires_status: null
sets_status: null
spawns_agents:
  - documentarian
---

## Purpose

Generate structured business logic documentation for an existing codebase by orchestrating the documentarian agent. The command triggers a full documentation workflow that scans source code, identifies business rules, workflows, state machines, and domain entities, then produces structured Markdown documents with Mermaid diagrams and source references.

Two modes are supported:
- **Full scan** (default): Analyzes the entire codebase and generates all documentation from scratch
- **Update** (`--update` flag): Incrementally updates existing documentation based on files that changed since the last scan

## Workflow Reference

workflows/project-documentation.md

## Input

Command usage:

- `/scrum-create-project-docs` -- Full scan mode (default). Analyzes the entire codebase and generates complete documentation
- `/scrum-create-project-docs --update` -- Update mode. Loads existing scan state, identifies changed files, and updates only affected documentation sections

No ticket number or other arguments are required. The command operates on the current project root directory.

## Output

- `docs/generated/business-logic.md` -- Business rules, validation logic, and guard clauses with Mermaid flowchart diagrams
- `docs/generated/workflows.md` -- State machines, event flows, and processing pipelines with Mermaid stateDiagram-v2, sequenceDiagram, and flowchart LR diagrams
- `docs/generated/domain-model.md` -- Core entities, relationships, and value objects with Mermaid classDiagram and erDiagram diagrams
- `docs/generated/.scan-state.json` -- Scan metadata tracking files scanned, timestamps, and hashes for incremental updates
