---
name: dev-story
trigger: "/scrum-dev-story"
requires_status: ready-for-dev
sets_status: in-progress
spawns_agents: []
---

## Purpose

Implement the story following the specification and plan from the refined story file. The command verifies the guard condition (status must be `ready-for-dev`), implements code based on the story specification and execution plan, and updates the story status to `in-progress` during implementation.

**FR17 Guard Condition:** No implementation can begin on a story that has not passed the readiness check. This command enforces that guard by requiring `status: ready-for-dev` before execution.

## Workflow Reference

workflows/dev-story.md

**Extended Reference:** workflows/development.md (detailed Red-Green-Refactor cycle for reference)

## Input

Ticket number in the format: `/scrum-dev-story SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `_scrum-output/sprints/SW-XXX/story.md` must exist with `status: ready-for-dev`
- **Plan**: The execution plan file `_scrum-output/sprints/SW-XXX/plan.md` should exist (created by `/scrum-refine-story`)

## Output

- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: in-progress` and `updated: <today>` (ISO 8601 format)
- Implemented code changes following the plan and story specification
- Code files in the project directory (specific to story requirements)

## Guard Condition Enforcement

**FR17 Compliance:** This command enforces the readiness check guard condition:

1. **Status Verification**: Before any implementation begins, verify story status is `ready-for-dev`
2. **Actionable Error on Failure**: If status is not `ready-for-dev`, halt with:
   ```
   Error: Story SW-XXX is in status 'current_status', but '/scrum-dev-story' requires 'ready-for-dev'
   Fix: Stories must pass validation before implementation. Run '/scrum-refine-ticket SW-XXX' then '/scrum-refine-story SW-XXX' to complete refinement and validation.
   ```
3. **No Bypass**: There is no flag or option to bypass this guard condition
4. **State Machine Compliance**: The only path to `in-progress` is through `ready-for-dev` (refined → ready-for-dev → in-progress)

**Valid Status Transitions:**
- `draft` → `refinement` (via `/scrum-refine-ticket`)
- `refinement` → `refined` (via `/scrum-refine-ticket` completion)
- `refined` → `ready-for-dev` (via `/scrum-refine-story` PASS)
- `ready-for-dev` → `in-progress` (via `/scrum-dev-story` - THIS COMMAND)
- `in-progress` → `review` (via `/scrum-dev-story review`)
- `review` → `approved` (via `/scrum-review-story` APPROVED)
- `review` → `changes-needed` (via `/scrum-review-story` CHANGES-NEEDED)
- `changes-needed` → `in-progress` (via `/scrum-dev-story` fix findings)
- `approved` → `done` (via human approval)

## Error Handling

- If story file does not exist, provide actionable error suggesting `/scrum-create-ticket`
- If status is not `ready-for-dev`, provide actionable error suggesting `/scrum-refine-story`
- If plan.md does not exist, provide warning but continue (plan is guidance, not requirement)
- If story file is corrupted, provide specific validation error
