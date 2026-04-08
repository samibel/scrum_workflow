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
