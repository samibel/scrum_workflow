# Story 2.2: Implement `/scrum-approve` Command

Status: done

## Story

As a developer,
I want to approve a completed story via `/scrum-approve`, creating an approval artifact as a mandatory human gate before `done`,
so that no story reaches `done` without explicit human approval.

## Acceptance Criteria

1. **Given** FR-5 specifies `/scrum-approve` as mandatory gate before `done` **When** a developer runs `/scrum-approve SW-XXX` on a story with status `approved` (post-review) **Then** an `approval-N.md` artifact is created in `_scrum-output/sprints/SW-XXX/` **And** the artifact contains: approval timestamp, approver identity, approval reasoning/notes **And** the story status transitions to `done` **And** a `status_history` entry is appended with `trigger: /scrum-approve`, `actor: human`
2. **Given** the story is not in a valid status for approval **When** a developer runs `/scrum-approve SW-XXX` **Then** the system produces an actionable error message indicating the current status and required status **And** the story status remains unchanged
3. **Given** SC-3 specifies no story reaches `done` without explicit `/scrum-approve` **When** any other command attempts to transition a story to `done` **Then** the transition is blocked **And** only `/scrum-approve` can set status to `done`
4. **Given** the Architecture specifies write boundaries **When** `/scrum-approve` executes **Then** it only writes `approval-N.md` and status in `story.md` **And** no other files are modified

## Tasks / Subtasks

- [x] Task 1: Create `/scrum-approve` command specification (AC: #1, #2, #4)
  - [x] 1.1 Create `scrum_workflow/commands/approve.md` with command frontmatter
  - [x] 1.2 Define command trigger: `/scrum-approve`
  - [x] 1.3 Set `requires_status: approved`
  - [x] 1.4 Set `sets_status: done`
- [x] Task 2: Implement status guard validation (AC: #2, #3)
  - [x] 2.1 Check story status before allowing approval
  - [x] 2.2 Produce actionable error if status is not `approved`
- [x] Task 3: Implement approval artifact generation (AC: #1, #4)
  - [x] 3.1 Load approval template from `scrum_workflow/templates/approval.md`
  - [x] 3.2 Generate sequential approval number
  - [x] 3.3 Write artifact to `_scrum-output/sprints/SW-XXX/approval-N.md`
- [x] Task 4: Implement status transition to `done` (AC: #1)
  - [x] 4.1 Update `story.md` status field to `done`
  - [x] 4.2 Append `status_history` entry with `actor: human`
- [x] Task 5: Enforce write boundary compliance (AC: #4)
  - [x] 5.1 Verify command only writes allowed files

## Dev Notes

- **Architecture Pattern:** 9-State Lifecycle (approved -> done)
- **Write Boundary:** May only write `approval-N.md` and status in `story.md`. [Source: architecture.md#Write Boundary Patterns]
- **Status History:** Every transition MUST append to `status_history` with `trigger` and `actor` fields. [Source: architecture.md#Format Patterns]
- **Actor Identity:** Approval is a human action -> `actor: human`. [Source: architecture.md#Actor Identity Patterns]
- **ID Format:** Use `SW-XXX` for ticket IDs.

### Project Structure Notes

- Command spec should be in `scrum_workflow/commands/approve.md`
- Implementation should follow existing patterns in `create-scrum-workflow/src/core/`

### References

- [Source: planning-artifacts/prd.md#FR-5]
- [Source: planning-artifacts/architecture.md#4. Write Boundary Patterns]
- [Source: planning-artifacts/epics.md#Story 2.2]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-exp (CLI Agent)

### Debug Log References

N/A

### Completion Notes List

- **Implementation Completed**: Core logic for `/scrum-approve` implemented in `create-scrum-workflow/src/core/approval/approve.js`.
- **Command Specification**: Created `scrum_workflow/commands/approve.md`.
- **Bug Fixed**: Fixed a syntax error in regular expressions in `approve.js` (un-escaped forward slashes in 'N/A' strings).
- **Verification**: All 30 ATDD tests in `create-scrum-workflow/test/atdd/story-2-2-scrum-approve-command.test.js` are PASSING.
- **Accepted**: All code review issues addressed and fixed (YOLO mode).
- **Status Update**: Story moved from `review` to `done`.

### File List

- `create-scrum-workflow/src/core/approval/approve.js`
- `scrum_workflow/commands/approve.md`
- `create-scrum-workflow/test/atdd/story-2-2-scrum-approve-command.test.js`
- `_bmad-output/implementation-artifacts/2-2-implement-scrum-approve-command.md`
- `_bmad-output/test-artifacts/atdd-checklist-2.2.md`
