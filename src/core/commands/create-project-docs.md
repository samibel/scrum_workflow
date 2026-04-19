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
- `/scrum-create-project-docs --with-excalidraw` -- Full scan plus an **optional** Excalidraw diagram step (see below). Combinable with `--update`.

No ticket number is required. The command operates on the current project root directory.

### Visual Diagrams (Optional)

**Mermaid is always the default** for embedded diagrams in the generated documentation. Nothing changes for existing users: without any flag, output is identical to before.

If the project is domain-heavy and the user wants a polished whiteboard-style diagram (e.g., a high-level domain model or workflow overview) alongside the Mermaid embeds, the command can invoke the `excalidraw-diagram-skill` (see `scrum_workflow/skills/excalidraw-diagram-skill/SKILL.md`). Opt-in triggers:

- CLI flag `--with-excalidraw`, or
- Interactive confirmation prompt shown only when the command detects a domain-heavy codebase; the default answer is **No**.

On opt-in, the command:

1. Calls `excalidraw-diagram-skill` once per top-level doc section (`domain-model`, `workflows`) that the user approves.
2. Appends an `## External Diagram` subsection to the affected doc with the returned Excalidraw URL, title, and a one-line caption.
3. Leaves the Mermaid block in place as the primary, in-repo representation. The Excalidraw link is supplementary, not a replacement.

If the Excalidraw MCP integration is not configured or the skill returns no URL, the command falls back to Mermaid-only, logs a note to the command output (`Excalidraw unavailable — continuing with Mermaid only.`), and does not fail. **The opt-in path must never block or change default output.**

## Output

- `_scrum-output/docs/business-logic.md` -- Business rules, validation logic, and guard clauses with Mermaid flowchart diagrams
- `_scrum-output/docs/workflows.md` -- State machines, event flows, and processing pipelines with Mermaid stateDiagram-v2, sequenceDiagram, and flowchart LR diagrams
- `_scrum-output/docs/domain-model.md` -- Core entities, relationships, and value objects with Mermaid classDiagram and erDiagram diagrams
- `_scrum-output/docs/.scan-state.json` -- Scan metadata tracking files scanned, timestamps, and hashes for incremental updates

When `--with-excalidraw` is active and the skill succeeds, the affected files above also gain an `## External Diagram` subsection linking to the Excalidraw URL. No new files are produced.

## Usage Examples

```
/scrum-create-project-docs                        # Default: Mermaid-only, no prompts
/scrum-create-project-docs --update               # Incremental update, Mermaid-only
/scrum-create-project-docs --with-excalidraw      # Opt into supplementary Excalidraw links
/scrum-create-project-docs --update --with-excalidraw
```
