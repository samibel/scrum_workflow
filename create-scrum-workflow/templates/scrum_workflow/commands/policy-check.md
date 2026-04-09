# Policy Check Command

Command for detecting policy violations in story lifecycle governance.

## Usage

```
/scrum-policy-check SW-XXX
```

## Description

Runs retrospective governance checks to detect policy violations that occurred through manual edits, bypasses, or system gaps. This complements Epic 3's real-time transition guards which prevent violations during command execution.

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `SW-XXX` | Story ticket ID (3-digit, zero-padded) | Yes |

## Prerequisites

- Story file exists at `_scrum-output/sprints/SW-XXX/story.md`
- Story has been moved beyond `draft` status

## Policy Violation Types

### 1. No Plan Violation

**Detection:** Story is `in-progress` or beyond without `plan.md`

**Expected Location:** `_scrum-output/sprints/SW-XXX/plan.md`

**Error Message:**
```
❌ Policy Violation: No Plan

**Details:** Story SW-XXX is in '{{current_status}}' status but plan.md does not exist.

**Next Step:** Create plan.md using '/scrum-refine-story SW-XXX' before proceeding with implementation.
```

### 2. No Verification Violation

**Detection:** Story has reached `review` status without `verification-report.md`

**Expected Location:** `_scrum-output/sprints/SW-XXX/verification-report.md`

**Error Message:**
```
❌ Policy Violation: No Verification

**Details:** Story SW-XXX has reached 'review' status but verification-report.md does not exist.

**Next Step:** Run '/scrum-verify SW-XXX' to generate the verification report.
```

### 3. Skipped Phase Violation

**Detection:** status_history shows transitions that skip required intermediate states

**Required Lifecycle Sequence:** draft → refined → ready-for-dev → in-progress → review → approved → done

**Error Message:**
```
❌ Policy Violation: Skipped Phase

**Details:** Story SW-XXX transitioned from '{{from_status}}' to '{{to_status}}' without the required intermediate state.

**Next Step:** Ensure all lifecycle phases are followed. Review the story status history.
```

## Output

Policy violations are logged to:
```
_scrum-output/audit/SW-XXX-policy-violations.md
```

## Write Boundary Rules

### Allowed Write Operations
- `_scrum-output/audit/SW-XXX-policy-violations.md` (NEW file - audit log only)

### Prohibited Write Operations
- `story.md` (read-only, no modifications)
- Source code or test files
- Any files in `scrum_workflow/` directory

## Status Guard

- Command can run on stories with status: `in-progress`, `review`, `approved`, `done`
- Command cannot run on `draft`, `refined`, or `ready-for-dev` status (violations not yet applicable)

## Error Handling

| Error Condition | Response |
|-----------------|----------|
| Invalid ticket ID format | `❌ Invalid Ticket ID: Expected SW-XXX format` |
| Story file not found | `❌ Story file not found: _scrum-output/sprints/SW-XXX/story.md` |
| Story not yet applicable | `❌ Status Guard Violation: Story SW-XXX is in '{{status}}' - policy check only applies to in-progress+ stories` |

## Audit Trail Integration

Violations detected by this command are written to the audit log for Story 8.3 (Central Audit Trail) integration. Each violation entry includes:
- Violation type
- Detection timestamp
- Story status at detection
- Remediation guidance