---
name: status-guard-validation
role: "status-based-guard-condition-validator"
description: "Validates that story status matches required guard conditions before command execution"
---

# Identity

The status-guard-validation skill enforces the story status state machine by ensuring commands only execute when the story is in the correct state. It prevents workflows from running in the wrong status (e.g., running `/scrum-dev-story` on a `draft` story), which would violate the state machine transitions defined in the standards. This maintains workflow integrity and prevents users from skipping phases or executing commands out of order.

# Instructions

## State Machine Guard Conditions

Each command has a specific required status. The command may only execute when the story's current status matches the required status:

| Command | Required Status | Guard Condition |
|---|---|---|
| `/scrum-create-ticket` | No status (new story) | Story file must not exist |
| `/scrum-refine-ticket` | `draft` | Story must be in `draft` status |
| `/scrum-refine-story` | `refined` | Story must be in `refined` status |
| `/scrum-dev-story` | `ready-for-dev` | Story must be in `ready-for-dev` status |
| `/scrum-review-story` | `review` | Story must be in `review` status |
| Approval | `approved` | Story must be in `approved` status |

## Status Value Validation

Read the current `status` field from the story file's YAML frontmatter and validate it against the command's required status.

**Authoritative source:** All valid states and transitions are defined in [`scrum_workflow/context/standards.md`](../../context/standards.md) — Story Status State Machine section. This skill reads and enforces that definition.

**Valid status values** (per `scrum_workflow/context/standards.md`):
- `draft` -- Story created, not yet refined
- `refinement` -- Multi-agent refinement in progress (implementation-internal sub-state)
- `refined` -- Refinement complete, awaiting validation
- `ready-for-dev` -- Validated and ready for implementation
- `in-progress` -- Implementation in progress
- `review` -- Code review requested
- `approved` -- Review passed, awaiting human sign-off
- `changes-needed` -- Review found issues, changes required
- `done` -- Story completed and approved (terminal)
- `cancelled` -- Story cancelled by explicit user decision (terminal, from any state)

## Guard Condition Checks

### Create Ticket Command (`/scrum-create-ticket`)

**Guard condition**: Story file must NOT exist

**Rationale**: Creating a new story requires a fresh ticket number. If the story file already exists, the user may have made an error or need to delete the existing file first.

**On guard condition failure**, return an error:

```
Error: Story file '_scrum-output/sprints/SW-XXX/story.md' already exists
Fix: Delete the existing story file first, or use a different ticket number
```

### Refine Ticket Command (`/scrum-refine-ticket`)

**Guard condition**: Story status must be `draft`

**Rationale**: Refinement is the first phase after story creation. Only stories in `draft` status can enter refinement. Stories that have already been refined, approved, or developed should not be refined again.

**On guard condition failure**, return an error:

```
Error: Story SW-XXX is in status 'current_status', but '/scrum-refine-ticket' requires 'draft'
Fix: Ensure the story is in draft status before running refinement
```

### Refine Story Command (`/scrum-refine-story`)

**Guard condition**: Story status must be `refined`

**Rationale**: The validation agent evaluates whether the refinement output is sufficient to proceed to development. It can only run after refinement is complete and the story has been marked as `refined`.

**On guard condition failure**, return an error:

```
Error: Story SW-XXX is in status 'current_status', but '/scrum-refine-story' requires 'refined'
Fix: Run '/scrum-refine-ticket SW-XXX' first to complete refinement
```

### Dev Story Command (`/scrum-dev-story`)

**Guard condition**: Story status must be `ready-for-dev` (or `changes-needed` for re-implementation after review)

**Rationale**: Development can only begin after the story has been refined and passed the validation check. This ensures the spec is complete and approved before implementation starts.

**On guard condition failure**, return an error:

```
Error: Story SW-XXX is in status 'current_status', but '/scrum-dev-story' requires 'ready-for-dev'
Fix: Run '/scrum-refine-ticket SW-XXX' and '/scrum-refine-story SW-XXX' to complete refinement and validation before starting development
```

### Review Story Command (`/scrum-review-story`)

**Guard condition**: Story status must be `review`

**Rationale**: Code review is the phase after implementation completes. It can only run when development is finished and the story has been submitted for review.

**On guard condition failure**, return an error:

```
Error: Story SW-XXX is in status 'current_status', but '/scrum-review-story' requires 'review'
Fix: Complete implementation first and run '/scrum-dev-story SW-XXX review' to submit for review
```

### Approval Command

**Guard condition**: Story status must be `approved`

**Rationale**: Human approval is the final phase after code review passes. It can only run when the review is complete and the story is awaiting sign-off.

**On guard condition failure**, return an error:

```
Error: Story SW-XXX is in status 'current_status', but approval requires 'approved'
Fix: Complete code review first by running '/scrum-review-story SW-XXX'
```

## Status Transition Validation

Ensure that status transitions only follow the defined state machine paths. The authoritative transitions list is maintained in [`scrum_workflow/context/standards.md`](../../context/standards.md) — Valid Transitions table.

**Valid transitions** (per `scrum_workflow/context/standards.md`):
- `draft` → `refinement` (via `/scrum-refine-ticket`)
- `refinement` → `refined` (via `/scrum-refine-ticket` completion)
- `refined` → `ready-for-dev` (via `/scrum-refine-story` PASS)
- `refined` → `refined` (via `/scrum-refine-story` FAIL, status unchanged)
- `ready-for-dev` → `in-progress` (via `/scrum-dev-story`)
- `in-progress` → `review` (via `/scrum-dev-story review`)
- `review` → `approved` (via `/scrum-review-story` APPROVED)
- `review` → `changes-needed` (via `/scrum-review-story` CHANGES-NEEDED)
- `changes-needed` → `in-progress` (via `/scrum-dev-story` fix findings)
- `approved` → `done` (via `/scrum-approve` with explicit user sign-off)
- `any` → `cancelled` (via manual decision, explicit user cancellation)

**Invalid transitions:**
- Any transition not listed above (e.g., `draft` → `ready-for-dev` skipping refinement)
- Skipping phases (e.g., running `/scrum-dev-story` on a `draft` story)

## Current Status Detection

Read the current status from the story file's YAML frontmatter:

1. **Parse YAML Frontmatter**: Extract the `status` field value
2. **Validate Status Value**: Confirm it's one of the valid status values
3. **Compare to Required**: Check if current status matches the command's required status
4. **Return Result**: Indicate whether the guard condition is satisfied

# Output Format

Return a structured validation result:

```yaml
valid: true/false
current_status: "draft"
required_status: "draft"
can_proceed: true/false
```

**When `valid: true` and `can_proceed: true`**: Current status matches required status. Workflow may proceed.

**When `valid: false` and `can_proceed: false`**: Current status does not match required status. Workflow must halt with an actionable error message explaining the mismatch and which command to run first.

# Context Rules

## Reads

- Story file (typically `_scrum-output/sprints/SW-XXX/story.md`) to read current status from YAML frontmatter
- State machine definitions: `scrum_workflow/context/standards.md`
- Command being executed (to determine required status)

## Writes

This skill never writes files. It is a read-only validation capability that returns structured results to the orchestrating workflow. Workflows calling this skill are responsible for halting on validation failure and presenting error messages to the user.
