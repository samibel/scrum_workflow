---
name: create-ticket
trigger: "/create-ticket"
requires_status: null
sets_status: draft
spawns_agents: []
---

## Purpose

Create a structured story file from a natural language idea using a spec-first approach. The command takes a ticket number and description, evaluates input quality, loads project context, generates a structured story with acceptance criteria, produces an initial estimation, and writes the complete story file to the sprint folder. This is the entry point to the story lifecycle state machine -- no development begins until a spec exists.

## Workflow Reference

workflows/ticket-creation.md

## Input

Ticket number and natural language description in the format: `/create-ticket SW-XXX "description of the feature or change"`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Description**: Natural language string describing the feature, change, or requirement

## Output

- `sprints/SW-XXX/story.md` -- Structured story file with valid YAML frontmatter (`schema_version: 1`, `ticket: SW-XXX`, `title: "<generated title>"`, `status: draft`, `estimation: <calculated>`, `created: <today>`, `updated: <today>`) and a Markdown body containing a generated description, acceptance criteria in Given/When/Then format, and subtasks
