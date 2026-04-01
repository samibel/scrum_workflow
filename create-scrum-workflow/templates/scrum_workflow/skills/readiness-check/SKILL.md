---
name: readiness-check
role: "story-validation"
description: "Validates story completeness before implementation, producing PASS/FAIL result with specific failure reasons"
---

# Identity

The readiness-check skill is a validation gate that ensures stories are fully specified before entering the development phase. It validates that all required fields are present and properly populated, produces clear PASS/FAIL results with actionable failure reasons, and on PASS, assembles the execution plan (plan.md) that guides implementation.

# Instructions

## Validation Process

Execute the following validation checks in sequence:

### Check 1: Story Description

**Rule:** Story must have a non-empty description field.

**Validation:**
- Description exists after `## Story` section
- Description is not empty or whitespace-only
- Description is not placeholder text (configurable list: "TODO", "TBD", "Coming soon", "PLACEHOLDER")
- Check is case-insensitive for placeholder detection

**Failure Reason:** "Story description is missing, empty, or contains placeholder text."

### Check 2: Acceptance Criteria

**Rule:** Story must have at least one defined acceptance criterion.

**Validation:**
- `## Acceptance Criteria` section exists
- At least one criterion is present (in BDD Given/When/Then format or checklist format)
- Criteria are specific and testable (not "do the thing")

**Failure Reason:** "Story has no acceptance criteria or criteria are not testable."

### Check 3: Estimation

**Rule:** Story must have a positive estimation value.

**Validation:**
- `estimation` field exists in YAML frontmatter or in Estimation section
- Estimation is a positive number (integer or float)
- Estimation is not zero or negative

**Failure Reason:** "Story estimation is missing, zero, or negative."

### Check 4: Subtasks

**Rule:** Story must have at least one defined subtask.

**Validation:**
- `## Tasks / Subtasks` section exists
- Section is not empty (contains at least one task/subtask definition)
- At least one subtask with [x] or [ ] checkbox is present
- Subtasks are specific and actionable (not "do stuff", "implementation", generic placeholders)

**Failure Reason:** "Story has no subtasks, section is empty, or subtasks are not actionable."

## PASS/FAIL Result

**PASS Condition:** All four checks pass.

**FAIL Condition:** Any check fails.

**Output Format:**
```markdown
## Readiness Check Result

**Status:** [PASS|FAIL]
**Checked:** [YYYY-MM-DDTHH:MM:SSZ]
**Story:** [story_title]
**Ticket:** [ticket_id]

### Validation Summary

- [x] Description: [PASS|FAIL]
- [x] Acceptance Criteria: [PASS|FAIL]
- [x] Estimation: [PASS|FAIL]
- [x] Subtasks: [PASS|FAIL]

### Failure Reasons (if any)

1. [Specific failure reason from failed check]
2. [Additional failure reasons]

### Next Steps

**[if PASS]** Story is ready for implementation. Plan.md will be assembled.
**[if FAIL]** Story status will revert to draft. Address failure reasons and re-run refinement.
```

## Plan Assembly (PASS Case Only)

When all checks PASS, assemble the execution plan:

### Plan Structure

```markdown
# Execution Plan: [story_title]

**Ticket:** [ticket_id]
**Status:** ready
**Created:** [ISO_8601_timestamp]

## Overview

[Brief summary of what will be implemented]

## Subtasks

| # | Subtask | Description | Dependencies | Source |
|---|---------|-------------|--------------|--------|
| 1 | [task_name] | [description] | None | [Agent/User] |
| 2 | [task_name] | [description] | Subtask 1 | [Agent/User] |
```

### Assembly Logic

1. Extract subtasks from story.md `Tasks / Subtasks` section
2. Parse task hierarchy and dependencies
3. Add source attribution (which agent proposed the subtask, if available from refinement.md)
4. Order by dependency (prerequisites first)
5. If source attribution is unavailable, mark source as "User" (default)
6. Write plan.md in single atomic operation

# Context Rules

## Reads

- Story file (`story.md`) -- Validate completeness fields
- Synthesis output from refinement.md -- Extract subtasks with source attribution (if file exists)
- `scrum_workflow/config.yaml` -- Platform settings and user identifier

**Refinement.md Handling:**
- If refinement.md does not exist, log warning and proceed without subtask source attribution
- If refinement.md exists but is malformed, log specific error and proceed with story.md subtasks only
- Subtask extraction from refinement.md is optional enhancement; story.md subtasks are always used

## Writes

This skill produces:

- Readiness check result (PASS/FAIL) with specific failure reasons
- `plan.md` file (on PASS only) -- Execution plan with ordered subtasks
- Updated `story.md` status -- `ready` on PASS, `draft` on FAIL

## Error Handling

- If story.md is missing or unreadable, halt with error: "Story file not found"
- If story.md frontmatter is invalid, log specific validation error
- If plan.md cannot be written (directory missing, permission error), halt with actionable error
- If status update fails, log error and suggest manual intervention

## State Machine Compliance

**Status Transitions:**
- PASS: `refinement` → `ready`
- FAIL: `refinement` → `draft`

**Atomic Write Guarantee:**
- Status update uses atomic write (NFR1 compliance)
- Plan.md creation uses atomic write (NFR1 compliance)
- On FAIL, story status reversion preserves all content except status field

**Guard Condition Enforcement:**
- This skill is the ONLY path from `refinement` to `ready`
- No status transition bypasses this validation
- Implementation requires `status == ready` (enforced in dev-story command)
