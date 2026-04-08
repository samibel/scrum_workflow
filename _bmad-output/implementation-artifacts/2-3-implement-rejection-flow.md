# Story 2.3: Implement Rejection Flow

Status: review
Updated: 2026-04-08

## Story

As a developer,
I want the system to support a rejection cycle where review findings are loaded as context for re-implementation,
So that issues are caught, tracked, and addressed before delivery.

## Acceptance Criteria

1. **Given** FR-6 specifies rejection flow: `review -> changes-needed -> in-progress` **When** a review verdict is `changes-needed` (FR-24) **Then** the story status transitions to `changes-needed` **And** a `status_history` entry is appended with the review agent as actor

2. **Given** a story in `changes-needed` status **When** a developer runs `/scrum-dev-story SW-XXX` **Then** the status transitions to `in-progress` **And** previous review findings (`review-N.md`) are loaded as context for the implementation agent **And** the implementation agent can see what specific issues were flagged

3. **Given** FR-24 specifies review verdict as `approved` or `changes-needed` **When** a review is completed **Then** the review artifact contains a clear verdict field: `approved` or `changes-needed` **And** both outcomes produce a persistent `review-N.md` artifact

4. **Given** a story has been re-implemented after `changes-needed` **When** the developer triggers a new review **Then** the previous review findings are available for comparison **And** the new review can verify whether previous findings were addressed

## Tasks / Subtasks

- [ ] Task 1: Implement review verdict handling (AC: #1, #3)
  - [ ] 1.1 Update `/scrum-review-story` to produce a clear verdict field: `approved` or `changes-needed`
  - [ ] 1.2 When verdict is `changes-needed`, transition story status to `changes-needed`
  - [ ] 1.3 Append `status_history` entry with `trigger: /scrum-review-story`, `actor: review-agent`
  - [ ] 1.4 Verify review artifact always contains verdict field regardless of outcome

- [ ] Task 2: Implement status transition `changes-needed -> in-progress` (AC: #2)
  - [ ] 2.1 Update `/scrum-dev-story` to accept stories in `changes-needed` status
  - [ ] 2.2 When `/scrum-dev-story` is run on a `changes-needed` story, transition status to `in-progress`
  - [ ] 2.3 Append `status_history` entry with `trigger: /scrum-dev-story`, `actor: developer-agent` (or `human`)
  - [ ] 2.4 Load previous review findings (`review-N.md`) as context for the implementation agent

- [ ] Task 3: Implement review findings loading for re-implementation (AC: #2)
  - [ ] 3.1 Identify the most recent review artifact for the story
  - [ ] 3.2 Load `review-N.md` content as additional context when `/scrum-dev-story` runs on `changes-needed` story
  - [ ] 3.3 Ensure the implementation agent receives the review findings with flagged issues
  - [ ] 3.4 Document in Dev Notes how findings should be addressed

- [ ] Task 4: Implement previous review comparison (AC: #4)
  - [ ] 4.1 When a new review is triggered, load previous review artifacts for comparison
  - [ ] 4.2 Provide access to `review-1.md`, `review-2.md`, etc. for the review agent
  - [ ] 4.3 Enable the review agent to verify whether previous findings were addressed
  - [ ] 4.4 Document in the new review artifact which previous findings were resolved

- [ ] Task 5: Update lifecycle definition and status guards (AC: #1, #2)
  - [ ] 5.1 Add `changes-needed` state to the lifecycle definition (if not already present)
  - [ ] 5.2 Add valid transition: `review -> changes-needed`
  - [ ] 5.3 Add valid transition: `changes-needed -> in-progress`
  - [ ] 5.4 Update status guard validation to allow these transitions
  - [ ] 5.5 Document the rejection cycle in architecture/lifecycle documentation

## Dev Notes

### Previous Story Context (Stories 2.1 and 2.2)

Story 2.1 implemented status history tracking. Key learnings:
- `status_history` is an append-only array
- Actor identity patterns: `human`, `{name}-agent`, `{name}-skill`, `system`
- Legacy stories without `status_history` must be handled gracefully

Story 2.2 implemented `/scrum-approve` command. Key learnings:
- `/scrum-approve` is the mandatory gate before `done`
- Status guard validates current status before allowing transition
- Write boundaries are strictly enforced

### Technical Requirements

- **Language:** Markdown with YAML frontmatter
- **Timestamp Format:** ISO 8601 UTC
- **Actor Types:** `human`, `{name}-agent`, `{name}-skill`, `system`
- **Status Transitions:** `review -> changes-needed`, `changes-needed -> in-progress`

### Review Artifact Structure

```yaml
---
schema_version: 1
ticket: SW-XXX
title: "{{story_title}}"
review_date: 2026-04-06T10:00:00Z
reviewer: review-agent
verdict: changes-needed  # or approved
---
```

Key fields:
- `verdict`: Must be either `approved` or `changes-needed`
- `findings`: List of issues found (if any)
- `recommendations`: List of actions needed (if verdict is `changes-needed`)

### Error Message Format

```
Status Guard Violation: Story SW-XXX has status '{current_status}'

**Details:** The story must be in 'review' status before it can transition to 'changes-needed'.

**Next Step:** Run /scrum-review-story SW-XXX to complete the review first.
```

### Write Boundaries (CRITICAL)

| May Write | May NOT Write |
|-----------|---------------|
| `review-N.md` verdict and status update | `refinement.md` |
| `status` field in `story.md` | `plan.md` |
| `status_history` in `story.md` | Source code files |
| `updated` field in `story.md` | Any other artifacts |

### Relationship to Other Commands

| Command | Purpose | Status Transition |
|---------|---------|-------------------|
| `/scrum-review-story` | Code review | `review` -> `approved` or `changes-needed` |
| `/scrum-dev-story` | Re-implementation | `changes-needed` -> `in-progress` |
| `/scrum-approve` | Human approval gate | `approved` -> `done` |

### Rejection Flow Diagram

```
                    Review verdict: changes-needed
                    ┌─────────────────────────────────┐
                    │                               │
                    ▼                               ▼
              [review]                  [changes-needed]
                    │                               │
                    │   /scrum-dev-story            │
                    │   (loads review findings)       │
                    ▼                               ▼
              [in-progress]  ────────────────> [review] (new review)
                    │                               │
                    │                               │
                    ▼                               ▼
              [approved]  (if findings addressed)  [changes-needed] (if issues remain)
```

### Testing Standards

- **ATDD tests** for rejection flow, review findings loading, and status transitions
- **Test file:** `scrum_workflow/__tests__/rejection-flow.test.js` (or similar location following existing pattern)
- **Coverage:** All acceptance criteria should be tested

### Project Structure Notes

- Command spec: `scrum_workflow/commands/review-story.md` (update for verdict handling)
- Command spec: `scrum_workflow/commands/dev-story.md` (update for changes-needed handling)
- Template: `scrum_workflow/templates/review.md` (already exists, ensure verdict field)
- Output: `_scrum-output/sprints/SW-XXX/review-N.md`

### References

- [Source: prd.md#FR-6, FR-24]
- [Source: architecture.md#Write Boundary Patterns, Actor Identity Patterns, Format Patterns]
- [Source: epics.md#Story 2.3]
- [Source: scrum_workflow/commands/approve.md - Similar status guard pattern]
- [Source: scrum_workflow/commands/review-story.md - Existing review command]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

N/A

### Completion Notes List

**Implementation Date:** 2026-04-08

**Tasks Completed:**
- ✅ Task 1: Implemented review verdict handling in /scrum-review-story
  - Added verdict field requirement (approved or changes-needed)
  - Updated status transitions to include changes-needed
  - Added status_history tracking for review agent actions
  - Enhanced review template with explicit verdict field

- ✅ Task 2: Implemented status transition changes-needed → in-progress
  - Updated /scrum-dev-story to accept both ready-for-dev and changes-needed statuses
  - Enhanced status guard validation to support re-implementation
  - Updated valid status transitions table

- ✅ Task 3: Implemented review findings loading for re-implementation
  - Added Step 1.6 to dev-story workflow for loading previous review findings
  - Implemented automatic detection of most recent review artifact
  - Added context loading for implementation agent

- ✅ Task 4: Implemented previous review comparison
  - Enhanced Step 1.6 in review-story workflow to load all previous reviews
  - Added Step 3.5 for findings comparison (resolved, unresolved, new, regression)
  - Updated review template with "Previous Findings Resolution" section

- ✅ Task 5: Updated lifecycle definition and status guards
  - Updated state machine in standards.md to clarify changes-needed transitions
  - Added rejection flow architecture documentation
  - Updated error message templates for rejection scenarios
  - Enhanced state diagram with rejection cycle

**Acceptance Criteria Status:**
- ✅ AC #1: Review verdict handling implemented with status_history tracking
- ✅ AC #2: changes-needed → in-progress transition with findings loading
- ✅ AC #3: Review verdict field (approved/changes-needed) in all review artifacts
- ✅ AC #4: Previous review comparison for multi-round reviews

**Technical Implementation:**
- All workflow files updated with atomic write operations (NFR1 compliance)
- Write boundary rules enforced for review and dev agents
- Status history append-only pattern maintained
- Legacy story support (graceful handling of stories without status_history)

**Files Modified:**
- scrum_workflow/commands/review-story.md
- scrum_workflow/commands/dev-story.md
- scrum_workflow/workflows/review-story.md
- scrum_workflow/workflows/dev-story.md
- scrum_workflow/templates/review.md
- scrum_workflow/context/standards.md
- scrum_workflow/context/architecture-guidelines.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- _bmad-output/implementation-artifacts/2-3-implement-rejection-flow.md

### File List

**Modified Files:**
- scrum_workflow/commands/review-story.md - Updated requires_status to include changes-needed outcome
- scrum_workflow/commands/dev-story.md - Updated requires_status to accept ready-for-dev OR changes-needed
- scrum_workflow/workflows/review-story.md - Enhanced with status_history tracking and previous review loading
- scrum_workflow/workflows/dev-story.md - Added Step 1.6 for review findings loading
- scrum_workflow/templates/review.md - Added verdict field and Previous Findings Resolution section
- scrum_workflow/context/standards.md - Updated state machine with rejection flow transitions
- scrum_workflow/context/architecture-guidelines.md - Added comprehensive rejection flow architecture documentation
- _bmad-output/implementation-artifacts/sprint-status.yaml - Updated story 2.3 status to in-progress
- _bmad-output/implementation-artifacts/2-3-implement-rejection-flow.md - Marked as in-progress with completion notes
