---
name: dev-story
trigger: "/scrum-dev-story"
requires_status: "ready-for-dev | changes-needed"
sets_status: in-progress
spawns_agents: []
---

## Purpose

Implement the story following the specification and plan from the refined story file. The command verifies the guard condition (status must be `ready-for-dev` or `changes-needed`), implements code based on the story specification and execution plan, and updates the story status to `in-progress` during implementation.

**FR17 Guard Condition:** No implementation can begin on a story that has not passed the readiness check. This command enforces that guard by requiring `status: ready-for-dev` for new stories or `status: changes-needed` for re-implementation.

## Workflow Reference

workflows/dev-story.md

**Extended Reference:** workflows/development.md (detailed Red-Green-Refactor cycle for reference)

## Input

Ticket number in the format: `/scrum-dev-story SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `_scrum-output/sprints/SW-XXX/story.md` must exist with `status: ready-for-dev` OR `status: changes-needed`
- **Plan**: The execution plan file `_scrum-output/sprints/SW-XXX/plan.md` should exist (created by `/scrum-refine-story`)
- **For re-implementation**: When status is `changes-needed`, previous review findings will be loaded as context

## Output

- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: in-progress` and `updated: <today>` (ISO 8601 format)
- Implemented code changes following the plan and story specification
- Code files in the project directory (specific to story requirements)

## Guard Condition Enforcement

**FR17 Compliance:** This command enforces the readiness check guard condition:

1. **Status Verification**: Before any implementation begins, verify story status is `ready-for-dev` OR `changes-needed`
2. **Actionable Error on Failure**: If status is not `ready-for-dev` or `changes-needed`, halt with:
   ```
   ❌ Status Guard Violation: Story SW-XXX requires 'ready-for-dev' or 'changes-needed' but is currently '{current_status}'

   **Details:** The /scrum-dev-story command can only execute on stories in 'ready-for-dev' or 'changes-needed' status. This story is not yet ready for implementation.

   **Next Step:** Run '/scrum-refine-ticket SW-XXX' and '/scrum-refine-story SW-XXX' to complete refinement and validation before starting development. If the story was rejected after review, run '/scrum-review-story SW-XXX' to complete the review first.
   ```
3. **No Bypass**: There is no flag or option to bypass this guard condition
4. **State Machine Compliance**: The paths to `in-progress` are:
   - Initial implementation: `refined → ready-for-dev → in-progress`
   - Re-implementation after rejection: `review → changes-needed → in-progress`

**Valid Status Transitions** — see the authoritative list in [`scrum_workflow/context/standards.md`](../context/standards.md) — Story Status State Machine section. All valid states, transitions, and guard conditions are defined there.

## Error Handling

### Story File Not Found

If the story file does not exist:

```
❌ Status Guard Violation: Story file '_scrum-output/sprints/SW-XXX/story.md' not found

**Details:** The /scrum-dev-story command requires an existing story file to process. No file was found at the expected path.

**Next Step:** Run '/scrum-create-ticket SW-XXX' to create the story file first, then complete refinement and validation before running '/scrum-dev-story SW-XXX'.
```

- If status is not `ready-for-dev` or `changes-needed`, the Guard Condition Enforcement block above handles the error
- If plan.md does not exist, provide warning but continue (plan is guidance, not requirement)
- If story file is corrupted, provide specific validation error

## Write Boundary Rules

This workflow may write:
- Source code files and test files in the project directory (per plan.md guidance)
- `_scrum-output/sprints/SW-XXX/story.md` - Status field only (`status: in-progress` or `status: review`); MUST NOT modify story content

This workflow may NOT write:
- `_scrum-output/sprints/SW-XXX/plan.md` - Read-only during implementation (created by `/scrum-refine-story`)
- `_scrum-output/sprints/SW-XXX/refinement.md` - Read-only during implementation
- `_scrum-output/sprints/SW-XXX/review-*.md` - Managed by `/scrum-review-story`
- `_scrum-output/sprints/SW-XXX/approval-N.md` - Managed by `/scrum-approve`
- `scrum_workflow/` - Framework files are read-only during execution

### Anti-Pattern Warnings

**Spec Drift:** The implementation agent MUST NOT modify story.md content (only the status field). Modifying acceptance criteria, tasks, or other story body content during implementation is a Spec Drift violation — halt and report to the user.

**Self-Fix:** The implementation agent MUST NOT validate its own work. Validation is performed by separate commands (`/scrum-review-story`, `/scrum-refine-story`). Self-validation bypasses the multi-agent quality gate.

If a write boundary would be violated, halt with:
```
❌ Write Boundary Violation: /scrum-dev-story attempted to write '{file_path}'

**Details:** The /scrum-dev-story command may only write source code, test files, and story.md status updates. Attempted write target is outside the allowed boundary.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```
