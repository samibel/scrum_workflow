---
name: create-ticket
trigger: "/scrum-create-ticket"
requires_status: null
sets_status: draft
spawns_agents: []
---

## Purpose

Create a structured story file from a natural language idea using a spec-first approach. The command takes a ticket number and description, evaluates input quality, loads project context, generates a structured story with acceptance criteria, produces an initial estimation, and writes the complete story file to the sprint folder. This is the entry point to the story lifecycle state machine -- no development begins until a spec exists.

## Workflow Reference

workflows/ticket-creation.md

## Input

Ticket number and natural language description in the format: `/scrum-create-ticket SW-XXX "description of the feature or change"`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Description**: Natural language string describing the feature, change, or requirement

## Output

- `_scrum-output/sprints/SW-XXX/story.md` -- Structured story file with valid YAML frontmatter (`schema_version: "1.0.0"`, `ticket: SW-XXX`, `title: "<generated title>"`, `status: draft`, `type: <inferred>`, `risk_level: <assigned>`, `domain_tags: <array>`, `estimation: <calculated>`, `created: <ISO 8601 UTC>`, `updated: <ISO 8601 UTC>`, `status_history: [{from: null, to: draft, timestamp: <ISO 8601 UTC>, trigger: /scrum-create-ticket, actor: human}]`) and a Markdown body containing a generated description, acceptance criteria in Given/When/Then format, and subtasks

## Error Handling

### Status Guard Violation

If story file already exists for the ticket number:

```
❌ Status Guard Violation: Story file '_scrum-output/sprints/SW-XXX/story.md' already exists

**Details:** The /scrum-create-ticket command can only create new stories. A story file for this ticket number already exists and cannot be overwritten.

**Next Step:** Delete the existing story file first, or use a different ticket number. If you want to continue working on SW-XXX, use the appropriate command for its current status.
```

## Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/story.md` - New file only (`status: draft`); MUST NOT overwrite an existing story.md — halt with Status Guard Violation if the story file already exists

This workflow may NOT write:
- `_scrum-output/sprints/SW-XXX/refinement.md` - Managed by `/scrum-refine-ticket`
- `_scrum-output/sprints/SW-XXX/plan.md` - Managed by `/scrum-refine-story`
- `_scrum-output/sprints/SW-XXX/review-*.md` - Managed by `/scrum-review-story`
- `_scrum-output/sprints/SW-XXX/approval-N.md` - Managed by `/scrum-approve`
- Source code files in project directory - No code creation during ticket creation
- `scrum_workflow/` - Framework files are read-only during execution

### Anti-Pattern Warning

**Bounded Authority Violation:** This command MUST NOT overwrite an existing story.md. If a story file already exists for the given ticket number, halt immediately and report the violation to the user.

If a write boundary would be violated, halt with:
```
❌ Write Boundary Violation: /scrum-create-ticket attempted to write '{file_path}'

**Details:** The /scrum-create-ticket command may only create new story files. Attempted write target is outside the allowed boundary.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```
