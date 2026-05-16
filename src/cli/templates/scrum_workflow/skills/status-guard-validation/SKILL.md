---
name: status-guard-validation
role: "status-based-guard-condition-validator"
description: "Validates that story status matches required guard conditions before command execution"
---

# Identity

The status-guard-validation skill enforces the story status state machine by ensuring commands only execute when the story is in the correct state. It prevents workflows from running in the wrong status (e.g., running `/scrum-dev-story` on a `draft` story), which would violate the state machine transitions defined in the standards. This maintains workflow integrity and prevents users from skipping phases or executing commands out of order.

**No silent failures:** Every guard condition check produces an actionable error message. No command leaves the story in an inconsistent state — the status field and status_history always agree after command execution. Guard checks occur BEFORE any file writes, ensuring atomic state transitions.

# Instructions

## State Machine Guard Conditions

Each command has a specific required status. The command may only execute when the story's current status matches the required status:

| Command | Required Status | Guard Condition |
|---|---|---|
| `/scrum-create-ticket` | No status (new story) | Story file must not exist |
| `/scrum-refine-ticket` | `draft` | Story must be in `draft` status |
| `/scrum-refine-story` | `refined` | Story must be in `refined` status |
| `/scrum-dev-story` | `ready-for-dev` OR `changes-needed` | Story must be in `ready-for-dev` or `changes-needed` status |
| `/scrum-verify` | `in-progress` | Story must be in `in-progress` status; on PASS it may transition to `review` only when the verification report guard below passes |
| `/scrum-review-story` | `review` | Story must be in `review` status |
| `/scrum-approve` | `approved` | Story must be in `approved` status |

## Status Value Validation

Read the current `status` field from the story file's YAML frontmatter and validate it against the command's required status.

**Authoritative source:** All valid states and transitions are defined in [`scrum_workflow/context/standards.md`](../../context/standards.md) — Story Status State Machine section. This skill reads and enforces that definition. The guard checks all requested transitions against `scrum_workflow/context/standards.md` and only transitions explicitly defined as valid are permitted. Any transition not listed in `standards.md` is invalid and must be blocked.

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
- `cancelled` -- Story cancelled by explicit user decision (terminal, from any non-terminal state)

## Guard Condition Checks

### Create Ticket Command (`/scrum-create-ticket`)

**Guard condition**: Story file must NOT exist

**Rationale**: Creating a new story requires a fresh ticket number. If the story file already exists, the user may have made an error or need to delete the existing file first.

**On guard condition failure**, return an error:

```
❌ Status Guard Violation: Story file '_scrum-output/sprints/SW-XXX/story.md' already exists

**Details:** The /scrum-create-ticket command can only create new stories. A story file for this ticket number already exists and cannot be overwritten.

**Next Step:** Delete the existing story file first, or use a different ticket number. If you want to continue working on SW-XXX, use the appropriate command for its current status.
```

### Refine Ticket Command (`/scrum-refine-ticket`)

**Guard condition**: Story status must be `draft`

**Rationale**: Refinement is the first phase after story creation. Only stories in `draft` status can enter refinement. Stories that have already been refined, approved, or developed should not be refined again.

**On guard condition failure**, return an error:

```
❌ Status Guard Violation: Story SW-XXX requires 'draft' but is currently '{current_status}'

**Details:** The /scrum-refine-ticket command can only execute on stories in 'draft' status. This story has already progressed past the drafting phase.

**Next Step:** Check the current status and run the appropriate next command. If the story needs re-refinement, manually set status back to 'draft' first (use with caution).
```

### Refine Story Command (`/scrum-refine-story`)

**Guard condition**: Story status must be `refined`

**Rationale**: The validation agent evaluates whether the refinement output is sufficient to proceed to development. It can only run after refinement is complete and the story has been marked as `refined`.

**On guard condition failure**, return an error:

```
❌ Status Guard Violation: Story SW-XXX requires 'refined' but is currently '{current_status}'

**Details:** The /scrum-refine-story command can only execute on stories in 'refined' status. The story must first complete the refinement phase.

**Next Step:** Run '/scrum-refine-ticket SW-XXX' first to complete refinement, then re-run '/scrum-refine-story SW-XXX' once the story reaches 'refined' status.
```

### Dev Story Command (`/scrum-dev-story`)

**Guard condition**: Story status must be `ready-for-dev` (or `changes-needed` for re-implementation after review)

**Rationale**: Development can only begin after the story has been refined and passed the validation check. This ensures the spec is complete and approved before implementation starts. Both `ready-for-dev` and `changes-needed` are valid entry points because `changes-needed` represents stories returned from review for re-implementation.

**On guard condition failure**, return an error:

```
❌ Status Guard Violation: Story SW-XXX requires 'ready-for-dev' or 'changes-needed' but is currently '{current_status}'

**Details:** The /scrum-dev-story command can only execute on stories in 'ready-for-dev' or 'changes-needed' status. This story is not yet ready for implementation.

**Next Step:** Run '/scrum-refine-ticket SW-XXX' and '/scrum-refine-story SW-XXX' to complete refinement and validation before starting development. If the story was rejected after review, run '/scrum-review-story SW-XXX' to complete the review first.
```

### Verify Command (`/scrum-verify`)

**Guard condition**: Story status must be `in-progress`

**Rationale**: Verification is the mandatory automated quality gate after implementation and before review. Only stories with implementation in progress can be verified and submitted for review.

**On guard condition failure**, return an error:

```
❌ Status Guard Violation: Story SW-XXX requires 'in-progress' but is currently '{current_status}'

**Details:** The /scrum-verify command can only execute on stories in 'in-progress' status.

**Next Step:** Ensure implementation has started with '/scrum-dev-story SW-XXX', then run '/scrum-verify SW-XXX' once the implementation is ready for automated checks.
```

### Review Story Command (`/scrum-review-story`)

**Guard condition**: Story status must be `review`

**Rationale**: Code review is the phase after implementation completes. It can only run when development is finished and the story has been submitted for review.

**On guard condition failure**, return an error:

```
❌ Status Guard Violation: Story SW-XXX requires 'review' but is currently '{current_status}'

**Details:** The /scrum-review-story command can only execute on stories in 'review' status. The story must first complete implementation.

**Next Step:** Complete implementation first. Run '/scrum-dev-story SW-XXX' to implement the story and submit it for review. The status will automatically move to 'review' when implementation is complete.
```

### `/scrum-approve`

**Guard condition**: Story must be in `approved` status — reject if not approved

**Rationale**: Human approval is the final phase after code review passes. It can only run when the review is complete and the story is awaiting sign-off. The guard fires when the story's current status IS NOT `approved`.

**On guard condition failure**, return an error:

```
❌ Status Guard Violation: Story SW-XXX requires 'approved' but is currently '{current_status}'

**Details:** The /scrum-approve command can only execute on stories in 'approved' status (post-review). The story must first pass code review before human approval.

**Next Step:** Complete code review first by running '/scrum-review-story SW-XXX'. If the review result is APPROVED, the story will move to 'approved' status and human sign-off can proceed.
```

## Status Transition Validation

Ensure that status transitions only follow the defined state machine paths. The guard checks all requested transitions against the authoritative transitions list in [`scrum_workflow/context/standards.md`](../../context/standards.md) — Valid Transitions table. Only transitions explicitly defined as valid are permitted. Any transition not listed in `standards.md` is blocked as invalid.

**Valid transitions** (per `scrum_workflow/context/standards.md`):
- `draft` → `refinement` (via `/scrum-refine-ticket`)
- `refinement` → `refined` (via `/scrum-refine-ticket` completion)
- `refined` → `ready-for-dev` (via `/scrum-refine-story` PASS)
- `refined` → `refined` (via `/scrum-refine-story` FAIL, status unchanged)
- `ready-for-dev` → `in-progress` (via `/scrum-dev-story`)
- `in-progress` → `review` (via `/scrum-verify` PASS; requires a valid `verification-report.md` gate)
- `review` → `approved` (via `/scrum-review-story` APPROVED)
- `review` → `changes-needed` (via `/scrum-review-story` CHANGES-NEEDED)
- `changes-needed` → `in-progress` (via `/scrum-dev-story` fix findings)
- `approved` → `done` (via `/scrum-approve` with explicit user sign-off)
- `any` → `cancelled` (via manual decision, explicit user cancellation from any non-terminal state)

**Additional guard for every transition to `review`:** Any requested status transition whose target status is `review` is valid only when the story's sprint folder contains `_scrum-output/sprints/SW-XXX/verification-report.md` and the report satisfies the verification report contract below. This guard applies to `in-progress` → `review` and to any future transition that targets `review`; no workflow may bypass it by writing `status: review` directly.

### Verification Report Gate for `in-progress` → `review`

The `in-progress` → `review` transition is only valid after successful `/scrum-verify SW-XXX` execution. Before allowing the transition, read `_scrum-output/sprints/SW-XXX/verification-report.md` from the same sprint folder as the story and validate its YAML frontmatter. Do not introduce or require a JSON Schema for this contract; JSON Schema validation is out of scope for EP-002.

**Required `verification-report.md` convention:**

```markdown
---
schema_version: "1"
ticket: SW-XXX
status: passed
verified_at: 2026-05-16T12:34:56Z
tools:
  - name: test
    command: npm test
    exit_code: 0
    summary: All tests passed
---

# Verification Report

Optional human-readable details may follow the frontmatter.
```

**Required frontmatter fields:**

- `schema_version` — present and non-empty
- `ticket` — exactly matches the story ticket ID (`SW-XXX`)
- `status` — either `passed` or `failed`; only `passed` permits transition to `review`
- `verified_at` — present and non-empty (ISO 8601 UTC timestamp recommended)
- `tools` — non-empty list; each item contains `name`, `command`, `exit_code`, and `summary`

**Blocking conditions:**

- `verification-report.md` is missing from the story sprint folder
- YAML frontmatter is missing, malformed, or not parseable
- `ticket` does not exactly match the story ticket ID
- `status` is missing, not `passed`, or uses any value other than `passed`/`failed`
- `tools` is missing, empty, not a list, or any tool entry is missing `name`, `command`, `exit_code`, or `summary`
- Any tool has a non-successful `exit_code` (anything other than integer `0`)

**On verification report gate failure**, hard-halt with this standardized error block before any status write:

```
❌ Status Guard Violation: Cannot transition Story SW-XXX from 'in-progress' to 'review'

**Details:** The transition to 'review' requires a valid `_scrum-output/sprints/SW-XXX/verification-report.md` with parseable YAML frontmatter, matching `ticket: SW-XXX`, `status: passed`, and successful tool results (`exit_code: 0` for every tool). Failure reason: {failure_reason}.

**Next Step:**
1. Run `/scrum-verify SW-XXX`.
2. Fix any failed checks reported in `verification-report.md`.
3. Run `/scrum-verify SW-XXX` again, then retry the transition after verification passes.
```

**Invalid transitions:**
- Any transition not listed above (e.g., `draft` → `ready-for-dev` skipping refinement)
- Skipping phases (e.g., running `/scrum-dev-story` on a `draft` story)
- These invalid transitions are blocked before any file writes occur

## Current Status Detection

Read the current status from the story file's YAML frontmatter:

1. **Parse YAML Frontmatter**: Extract the `status` field value
2. **Validate Status Value**: Confirm it's one of the valid status values
3. **Compare to Required**: Check if current status matches the command's required status
4. **Return Result**: Indicate whether the guard condition is satisfied

## Manual Edit Detection

When a guard validates a story's status, it also detects whether the `status` field was manually edited outside of a command. This implements FR-10.

**Detection Algorithm:**

1. Read story YAML frontmatter
2. Extract current status field: `status_field = frontmatter.status`
3. Extract last history entry: `last_entry = frontmatter.status_history[-1]`
4. Compare: if `[status_field] != [last_entry.to]` → manual edit detected
5. Emit warning: `⚠️ Manual Edit Detected: status field ('[status_field]') does not match last status_history entry ('[last_entry.to]'). The story's status was manually edited outside of a command. Proceeding with current status field value for guard evaluation.`
6. Guard evaluation still uses `[status_field]` — the user's manual edit is intentional and the current status field value takes precedence for guard evaluation

**Edge Cases:**

- If `status_history` is empty → no comparison possible, skip detection (treat as no discrepancy)
- If `status_history` is present but malformed or invalid → skip detection and set `warning: "Unable to compare: status_history malformed"` in the output
- The warning is non-blocking and informational only — it does not block the command from executing
- A `trigger: manual-edit` entry in `status_history` is optional and informational only; it is visible to all agents and commands that read the story, but the system does not auto-generate it (no write hook exists)

# Output Format

Return a structured validation result:

```yaml
valid: true/false
current_status: "draft"
required_status: "draft"
can_proceed: true/false
manual_edit_detected: false
warning: null
```

**When `valid: true` and `can_proceed: true`**: Current status matches required status. Workflow may proceed.

**When `valid: false` and `can_proceed: false`**: Current status does not match required status. Workflow must halt with an actionable error message explaining the mismatch and which command to run first.

**When `manual_edit_detected: true`**: The `warning` field is populated with the human-readable warning message: `⚠️ Manual Edit Detected: status field ('[status_field]') does not match last status_history entry ('[last_entry.to]').`. The guard still evaluates using the current `[status_field]` value.

# Context Rules

## Reads

- Story file (typically `_scrum-output/sprints/SW-XXX/story.md`) to read current status from YAML frontmatter
- Verification report (typically `_scrum-output/sprints/SW-XXX/verification-report.md`) when validating any transition to `review`
- State machine definitions: `scrum_workflow/context/standards.md`
- Command being executed (to determine required status)

## Writes

This skill never writes files. It is a read-only validation capability that returns structured results to the orchestrating workflow. Workflows calling this skill are responsible for halting on validation failure and presenting error messages to the user.
