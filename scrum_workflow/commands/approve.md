---
name: approve
trigger: "/scrum-approve"
requires_status: approved
sets_status: done
pattern: human-approval-gate
model_recommendation: "N/A - This is a human-in-the-loop command that requires explicit human approval"
---

## Purpose

Implement the mandatory human approval gate before a story can be marked as `done`. This command ensures that no story reaches completion without explicit human sign-off, providing an audit trail of approval decisions and managing the final status transition in the story lifecycle.

## Agentic Pattern

**Pattern:** [Human-in-the-Loop Approval Gate]

**Key Principles:**
- **Explicit Human Approval:** Only human approvers can mark stories as `done` - no automation
- **Audit Trail:** Every approval decision is permanently recorded
- **Status Guard:** Approval is only allowed from `approved` status (post-review)
- **Write Boundary:** Approval may only write approval artifact and story status - no code changes

## Workflow Reference

workflows/approval.md

## Input

Ticket number in the format: `/scrum-approve SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `_scrum-output/sprints/SW-XXX/story.md` must exist with `status: approved`
- **Required**: Human approver must provide explicit approval decision

## Output

### On APPROVED:
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: done`
- `_scrum-output/sprints/SW-XXX/approval-N.md` -- Approval record with APPROVED decision
- Story `status_history` -- Updated with transition entry

### On REJECTED:
- `_scrum-output/sprints/SW-XXX/story.md` -- Status remains `approved`
- `_scrum-output/sprints/SW-XXX/approval-N.md` -- Approval record with REJECTED decision
- No status transition occurs

## Status Transitions

```
approved → done         (via /scrum-approve, decision: APPROVED)
approved → approved     (via /scrum-approve, decision: REJECTED - no transition)
```

## Approval Criteria

The human approver should consider:

| # | Criterion | What to Review |
|---|----------|---------|
| 1 | Code Review Completion | Story has `approved` status (post-review) |
| 2 | Review Findings | Review findings are acceptable or addressed |
| 3 | Implementation Quality | Code meets quality standards |
| 4 | Acceptance Criteria | All acceptance criteria are satisfied |
| 5 | Test Coverage | Adequate test coverage exists |

## Error Handling

### Status Guard Violation

If story is not in `approved` status:

```
Status Guard Violation: Story SW-XXX has status '{current_status}'

**Details:** The story must be in 'approved' status (post-review) before it can be marked as done.

**Next Step:** Run /scrum-review-story SW-XXX to complete the review process first.
```

### Missing Story File

```
Error: Story file '_scrum-output/sprints/SW-XXX/story.md' not found

Fix: Ensure story exists before triggering approval
```

### Missing Review File

```
Error: No review file found for SW-XXX

Fix: Run code review first: '/scrum-review-story SW-XXX'
```

## Relationship to Other Commands

**Important:** This is the final gate in the development pipeline.

> **Authoritative lifecycle reference:** All states and valid transitions are defined in [`scrum_workflow/context/standards.md`](../context/standards.md) — Story Status State Machine section.

| Command | Purpose | Status Transition | Pattern |
|---------|---------|-------------------|---------|
| `/scrum-refine-ticket` | Multi-agent refinement | `draft` → `refinement` → `refined` | Sub-Agent Spawning |
| `/scrum-refine-story` | Validation-only agent | `refined` → `ready-for-dev` | Feature List as Immutable Contract |
| `/scrum-dev-story` | Implementation-only agent | `ready-for-dev` → `in-progress` → `review` | Inversion of Control |
| `/scrum-review-story` | Review-only agent | `review` → `approved` or `changes-needed` | AI-Assisted Code Review |
| `/scrum-approve` | Human approval gate | `approved` → `done` | Human-in-the-Loop |

**Typical Workflow:**
1. User runs `/scrum-dev-story SW-XXX` to implement
2. Status moves from `ready-for-dev` → `in-progress` → `review`
3. User runs `/scrum-review-story SW-XXX` to review
4. Status moves from `review` → `approved` or `changes-needed`
5. User runs `/scrum-approve SW-XXX` to approve
6. Status moves from `approved` → `done`

## Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/approval-N.md` - Approval record (NEW file)
- `_scrum-output/sprints/SW-XXX/story.md` - Status field only (`status: done`)
- `_scrum-output/sprints/SW-XXX/story.md` - `status_history` array (append entry)
- `_scrum-output/sprints/SW-XXX/story.md` - `updated` field

This workflow may NOT write:
- `_scrum-output/sprints/SW-XXX/refinement.md` - Read-only during approval
- `_scrum-output/sprints/SW-XXX/plan.md` - Read-only during approval
- `_scrum-output/sprints/SW-XXX/review-N.md` - Read-only (review is complete)
- Code files in project directory - No code modifications during approval
- `scrum_workflow/` - Framework files are read-only during execution

## Approval Artifact Structure

The approval artifact (`approval-N.md`) contains:

```yaml
---
schema_version: 1
ticket: SW-XXX
title: "{{story_title}}"
approval_date: 2026-04-08T10:00:00Z
approver: "{{approver_name}}"
decision: approved
review_reference: review-N.md
review_date: "{{review_date}}"
---
```

## Sequential Approval Numbering

Each approval cycle creates a new approval file:
- First approval: `approval-1.md`
- Second approval (after re-review): `approval-2.md`
- Third approval: `approval-3.md`

This provides a complete audit trail of all approval attempts.
