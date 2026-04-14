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

### Check 1: Completeness

**Rule:** Story has all required structural elements.

**Validation:**
- `## Story` section exists with user story format (As a..., I want..., so that...)
- `## Acceptance Criteria` section exists
- `## Tasks / Subtasks` section exists with at least one task
- YAML frontmatter contains: `ticket` (SW-XXX), `status`, `created`, `updated`

**Failure Reason:** "Completeness: Missing [section name]"

### Check 2: Refinement

**Rule:** Story has been refined and has refinement artifact.

**Validation:**
- Story status is `refined` (not `draft`)
- `refinement.md` exists in the story's sprint directory
- Refinement contains meaningful content (not just template)

**Failure Reason:** "Refinement: Story has not been refined or refinement.md is missing/empty"

### Check 3: Estimability

**Rule:** Story has story points or explicit note about estimation challenges.

**Validation:**
- `estimation` or `story_points` field exists in YAML frontmatter or Tasks section
- OR explicit note explaining why estimation is not possible
- Tasks have estimated effort indicators

**Failure Reason:** "Estimability: Story estimation is missing or estimation challenges are not documented"

### Check 4: Testability

**Rule:** All acceptance criteria are testable and unambiguous.

**Validation:**
- Each acceptance criterion uses Given/When/Then format or specific checklist format
- Criteria are specific (not vague like "do good testing")
- Each criterion has clear expected outcomes
- No criterion contains contradictions

**Failure Reason:** "Testability: Acceptance criterion [N] is not testable/ambiguous"

### Check 5: Dependencies

**Rule:** All dependencies are identified and addressed.

**Validation:**
- `Dependencies` section exists OR dependencies mentioned in Dev Notes
- External library dependencies are listed
- Internal dependencies (other stories, modules) are identified
- Assumptions about existing infrastructure are documented

**Failure Reason:** "Dependencies: [specific issue]"

## PASS/FAIL Result

**PASS Condition:** All five checks pass.

**FAIL Condition:** Any check fails.

**Output Format:**
```markdown
## Readiness Check Result

**Status:** [PASS|FAIL]
**Checked:** [YYYY-MM-DDTHH:MM:SSZ]
**Story:** [story_title]
**Ticket:** [ticket_id]

### Validation Summary

- [x] Completeness: [PASS|FAIL]
- [x] Refinement: [PASS|FAIL]
- [x] Estimability: [PASS|FAIL]
- [x] Testability: [PASS|FAIL]
- [x] Dependencies: [PASS|FAIL]

### Failure Reasons (if any)

1. [Specific failure reason from failed check]
2. [Additional failure reasons]

### Next Steps

**[if PASS]** Story is ready for implementation. Plan.md will be assembled.
**[if FAIL]** Story status remains `refined`. Address failure reasons and re-run `/scrum-refine-story`.
```

## Plan Assembly (PASS Case Only)

When all checks PASS, assemble the execution plan:

### Plan Structure

```markdown
# Execution Plan: [story_title]

**Ticket:** [ticket_id]
**Status:** ready-for-dev
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
- Updated `story.md` status -- `ready-for-dev` on PASS, `refined` on FAIL (status unchanged)

## Error Handling

- If story.md is missing or unreadable, halt with error: "Story file not found"
- If story.md frontmatter is invalid, log specific validation error
- If plan.md cannot be written (directory missing, permission error), halt with actionable error
- If status update fails, log error and suggest manual intervention

## State Machine Compliance

**Status Transitions:**
- PASS: `refined` → `ready-for-dev`
- FAIL: `refined` → `refined` (status unchanged)

**Atomic Write Guarantee:**
- Status update uses atomic write (NFR1 compliance)
- Plan.md creation uses atomic write (NFR1 compliance)
- On FAIL, story status is preserved as `refined`

**Guard Condition Enforcement:**
- This skill is the ONLY path from `refined` to `ready-for-dev`
- No status transition bypasses this validation
- Implementation requires `status == ready-for-dev` (enforced in dev-story command)
