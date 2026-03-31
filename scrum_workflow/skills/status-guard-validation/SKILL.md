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
| Readiness check | `refinement` | Story must be in `refinement` status |
| `/scrum-dev-story` | `ready` | Story must be in `ready` status |
| Code review | `in-dev` | Story must be in `in-dev` status |
| Approval | `in-review` | Story must be in `in-review` status |

## Status Value Validation

Read the current `status` field from the story file's YAML frontmatter and validate it against the command's required status:

**Valid status values:**
- `draft` -- Story created, not yet refined
- `refinement` -- Multi-agent refinement in progress
- `ready` -- Spec approved, implementation allowed
- `in-dev` -- Implementation in progress
- `in-review` -- Code review in progress
- `done` -- Story completed and approved

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

### Readiness Check Command

**Guard condition**: Story status must be `refinement`

**Rationale**: The readiness check evaluates whether the refinement output is sufficient to proceed to development. It can only run after refinement is complete.

**On guard condition failure**, return an error:

```
Error: Story SW-XXX is in status 'current_status', but readiness check requires 'refinement'
Fix: Run '/scrum-refine-ticket SW-XXX' first to complete refinement
```

### Dev Story Command (`/scrum-dev-story`)

**Guard condition**: Story status must be `ready`

**Rationale**: Development can only begin after the story has been refined and passed the readiness check. This ensures the spec is complete and approved before implementation starts.

**On guard condition failure**, return an error:

```
Error: Story SW-XXX is in status 'current_status', but '/scrum-dev-story' requires 'ready'
Fix: Run '/scrum-refine-ticket SW-XXX' and pass readiness check before starting development
```

### Code Review Command

**Guard condition**: Story status must be `in-dev`

**Rationale**: Code review is the phase after implementation completes. It can only run when development is finished but the story is not yet approved.

**On guard condition failure**, return an error:

```
Error: Story SW-XXX is in status 'current_status', but code review requires 'in-dev'
Fix: Complete implementation first before running code review
```

### Approval Command

**Guard condition**: Story status must be `in-review`

**Rationale**: Human approval is the final phase after code review. It can only run when the review is complete and the story is awaiting sign-off.

**On guard condition failure**, return an error:

```
Error: Story SW-XXX is in status 'current_status', but approval requires 'in-review'
Fix: Complete code review first before requesting approval
```

## Status Transition Validation

Ensure that status transitions only follow the defined state machine paths:

**Valid transitions:**
- `draft` → `refinement` (via `/scrum-refine-ticket`)
- `refinement` → `ready` (via readiness check PASS)
- `refinement` → `draft` (via readiness check FAIL)
- `ready` → `in-dev` (via `/scrum-dev-story`)
- `in-dev` → `in-review` (via code review)
- `in-review` → `done` (via approval)

**Invalid transitions:**
- Any transition not listed above (e.g., `draft` → `ready` skipping refinement)
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
