---
name: verify
trigger: "/scrum-verify"
requires_status: in-progress
sets_status: review
pattern: automated-verification-gate
model_recommendation: "flash"
---

## Purpose

Implement the mandatory automated verification gate (tests, lint, build) before a story can be marked as `review`. This command ensures that all automated checks pass, providing an objective quality signal and managing the status transition to `review`.

## Agentic Pattern

**Pattern:** [Automated Verification Gate]

**Key Principles:**
- **Automated Quality Signal:** Objective checks (test, lint, build) must pass before human/AI review
- **Objective Reporting:** Results are captured in a structured `verification-report.md`
- **Status Guard:** Verification is only allowed from `in-progress` status
- **Write Boundary:** Verification may only write the verification report and update story status

## Workflow Reference

workflows/verification.md

## Input

Ticket number in the format: `/scrum-verify SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number
- **Prerequisite**: The story file `_bmad-output/sprints/SW-XXX/story.md` must exist with `status: in-progress`
- **Environment**: Working directory must be a valid project with `package.json` and configured test scripts

## Output

### On PASS (All checks pass):
- `_bmad-output/sprints/SW-XXX/story.md` -- Updated with `status: review`
- `_bmad-output/sprints/SW-XXX/verification-report.md` -- Verification record with PASS results
- Story `status_history` -- Updated with transition entry (actor: verification-skill)

### On FAIL (One or more checks fail):
- `_bmad-output/sprints/SW-XXX/story.md` -- Status remains `in-progress`
- `_bmad-output/sprints/SW-XXX/verification-report.md` -- Verification record with FAIL results and actionable errors
- No status transition occurs

## Status Transitions

```
in-progress → review     (via /scrum-verify, result: PASS)
in-progress → in-progress (via /scrum-verify, result: FAIL - no transition)
```

## Verification Criteria

The automated checks include:

| Check | Command | Purpose |
|-------|---------|---------|
| Tests | `npm test` | Verify functional correctness and regressions |
| Lint | `npm run lint` | Verify code style and static analysis (if configured) |
| Build | `npm run build` | Verify compilation/bundling (if configured) |

## Error Handling

### Status Guard Violation

If story is not in `in-progress` status:

```
❌ Status Guard Violation: Story SW-XXX requires 'in-progress' but is currently '{current_status}'

**Details:** The /scrum-verify command can only execute on stories in 'in-progress' status.

**Next Step:** Ensure you have started implementation with '/scrum-dev-story SW-XXX' before running verification.
```

### Missing Story File

```
❌ Status Guard Violation: Story file '_bmad-output/sprints/SW-XXX/story.md' not found

**Details:** The /scrum-verify command requires an existing story file to process.

**Next Step:** Run '/scrum-create-ticket SW-XXX' to create the story first.
```

## Write Boundary Rules

This workflow may write:
- `_bmad-output/sprints/SW-XXX/verification-report.md` - Verification report (NEW file)
- `_bmad-output/sprints/SW-XXX/story.md` - Status field only (`status: review`), `status_history` array (append entry), and `updated` field

This workflow may NOT write:
- Source code or test files in project directory
- Refinement, plan, or review artifacts
- `scrum_workflow/` - Framework files are read-only during execution

### Anti-Pattern Warning

**Bounded Authority Violation:** The verification agent MUST NOT modify source code or tests. Verification is strictly limited to running checks and reporting results. Any write outside this boundary is a Bounded Authority Violation.

If a write boundary would be violated, halt with:
```
❌ Write Boundary Violation: /scrum-verify attempted to write '{file_path}'

**Details:** The /scrum-verify command may only write verification-report.md and story.md status/history updates. Attempted write target is outside the allowed boundary.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```
