---
name: dev-story
trigger: "/dev-story"
requires_status: ready
sets_status: in-dev
spawns_agents: []
---

## Purpose

Implement the story following the specification and plan from the refined story file. The command verifies the guard condition (status must be `ready`), implements code based on the story specification and execution plan, and updates the story status to `in-dev` during implementation.

**FR17 Guard Condition:** No implementation can begin on a story that has not passed the readiness check. This command enforces that guard by requiring `status: ready` before execution.

## Workflow Reference

workflows/development.md

## Input

Ticket number in the format: `/dev-story SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `sprints/SW-XXX/story.md` must exist with `status: ready`
- **Plan**: The execution plan file `sprints/SW-XXX/plan.md` should exist (created by readiness check)

## Output

- `sprints/SW-XXX/story.md` -- Updated with `status: in-dev` and `updated: <today>` (ISO 8601 format)
- Implemented code changes following the plan and story specification
- Code files in the project directory (specific to story requirements)

## Guard Condition Enforcement

**FR17 Compliance:** This command enforces the readiness check guard condition:

1. **Status Verification**: Before any implementation begins, verify story status is `ready`
2. **Actionable Error on Failure**: If status is not `ready`, halt with:
   ```
   Error: Story SW-XXX is in status 'current_status', but '/dev-story' requires 'ready'
   Fix: Stories must pass readiness check before implementation. Run '/refine-ticket SW-XXX' to complete refinement and readiness check.
   ```
3. **No Bypass**: There is no flag or option to bypass this guard condition
4. **State Machine Compliance**: The only path to `in-dev` is through `ready` (refinement → ready → in-dev)

**Valid Status Transitions:**
- `draft` → `refinement` (via `/refine-ticket`)
- `refinement` → `ready` (via readiness check PASS)
- `refinement` → `draft` (via readiness check FAIL)
- `ready` → `in-dev` (via `/dev-story` - THIS COMMAND)
- `in-dev` → `in-review` (via `/dev-story review`)
- `in-review` → `done` (via human approval)

## Error Handling

- If story file does not exist, provide actionable error suggesting `/create-ticket`
- If status is not `ready`, provide actionable error suggesting `/refine-ticket`
- If plan.md does not exist, provide warning but continue (plan is guidance, not requirement)
- If story file is corrupted, provide specific validation error
