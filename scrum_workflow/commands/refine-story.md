---
name: refine-story
trigger: "/scrum-refine-story"
requires_status: refinement
sets_status: ready
pattern: feature-list-as-immutable-contract
---

## Purpose

Validate story completeness using the "Feature List as Immutable Contract" pattern. This validation-only agent checks that a story is truly ready for development by validating against an immutable checklist. The agent cannot modify story content — only set validation flags and status transitions.

## Agentic Pattern

**Pattern:** [Feature List as Immutable Contract](https://www.agentic-patterns.com/patterns/feature-list-as-immutable-contract)

**Key Principles:**
- **Immutable Requirements:** The checklist acts as an immutable contract — the agent validates against it but cannot modify it.
- **Binary Pass/Fail:** Each criterion must `passes: false → true` — agent cannot modify requirements.
- **Prevents Premature Ready:** The immutable nature prevents the agent from marking a story "ready" when it's not.

## Workflow Reference

workflows/refine-story.md

## Input

Ticket number in the format: `/scrum-refine-story SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `_scrum-output/sprints/SW-XXX/story.md` must exist with `status: refinement`

## Output

### On All Criteria PASS:
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: ready` (atomic write)
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Validation report appended with PASS status

### On Any Criterion FAIL:
- `_scrum-output/sprints/SW-XXX/story.md` -- Status remains `refinement`, failure reasons documented
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Validation report appended with FAIL status and failure reasons

## Validation Checklist (Immutable Contract)

The agent validates the story against these criteria without modification:

| # | Criterion | What to Check |
|---|----------|---------|
| 1 | Acceptance Criteria | All acceptance criteria are testable and unambiguous |
| 2 | Tasks Defined | All tasks/subtasks are clearly defined |
| 3 | Dev Notes | Dev Notes section contains necessary context |
| 4 | No Placeholders | No placeholders or TODO markers in story content |
| 5 | Dependencies | Dependencies are identified and documented |

## Status Transitions

```
refinement → ready      (via /scrum-refine-story, all criteria PASS)
refinement → refinement (via /scrum-refine-story, any criterion FAIL - status unchanged)
```

## Relationship to refine-ticket Command

**Important:** This is a validation-only command, NOT a replacement for `/scrum-refine-ticket`.

| Command | Purpose | Status Transition | Pattern |
|---------|---------|-------------------|---------|
| `/scrum-refine-ticket` | Multi-agent refinement (Architect, Dev, QA perspectives) | `draft` → `refinement` | Parallel agent spawning |
| `/scrum-refine-story` | Validation-only agent (immutable checklist) | `refinement` → `ready` | Feature List as Immutable Contract |

**Typical Workflow:**
1. User runs `/scrum-refine-ticket SW-XXX` to get multi-agent refinement
2. Status moves from `draft` → `refinement`
3. User reviews perspectives, accepts/rejects
4. User runs `/scrum-refine-story SW-XXX` to validate completeness
5. Status moves from `refined` → `ready-for-dev` (if validation passes)

## Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/story.md` - Status field only (`status: ready` or unchanged)
- `_scrum-output/sprints/SW-XXX/refinement.md` - Append validation report

This workflow may NOT write:
- `plan.md` - Managed by readiness-check
- `review-*.md` - Managed by `/scrum-dev-story`
- `approval.md` - Managed by approval workflow
- `scrum_workflow/` - Framework files are read-only during execution
- `_scrum-output/context/` - Context files are managed by `/scrum-create-project-context`
