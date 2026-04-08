# Story 2.1: Implement Status History Tracking

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want every status transition to be tracked in an append-only `status_history` array,
so that I have a complete, tamper-visible audit trail for every story.

## Acceptance Criteria

1. **FR-7 compliance**: Every slash-command that changes a story's status MUST append a new entry to the `status_history` array.
2. **Entry format**: Entries MUST include `from`, `to`, `timestamp` (ISO 8601 UTC), `trigger` (command name), and `actor`.
3. **Actor patterns**: `actor` MUST follow patterns: `human`, `{name}-agent`, `{name}-skill`, or `system`.
4. **Append-only**: Existing entries MUST NEVER be modified or deleted.
5. **Legacy support**: Stories lacking the field MUST be handled gracefully; the field should be created on the first transition after upgrade.
6. **Manual edit detection**: Discrepancies between `status` and the last `status_history` entry MUST be detectable, using `trigger: manual-edit` for visibility.

## Tasks / Subtasks

- [x] Task 1: Implement status_history append mechanism (AC: #1, #2, #4)
  - [x] 1.1 Create core utility for appending history entries
  - [x] 1.2 Integrate with status-changing commands
- [x] Task 2: Implement actor identity resolution (AC: #3)
  - [x] 2.1 Map triggers to correct actor types (human vs agent vs skill)
- [x] Task 3: Handle legacy stories (AC: #5)
  - [x] 3.1 Implement auto-initialization of array if missing
- [x] Task 4: Implement manual edit detection (AC: #6)
  - [x] 4.1 Create validator to compare status vs history
- [x] Task 5: Write ATDD tests (AC: All)
  - [x] 5.1 Test all valid transitions and history recording
  - [x] 5.2 Test legacy migration and manual edit detection

## Dev Notes

- **Timestamp Format**: ISO 8601 UTC (e.g., `2026-04-06T10:00:00Z`) [Source: architecture.md#6. Timestamp & ID Patterns]
- **Actor Identity**: human, {name}-agent, {name}-skill, system [Source: architecture.md#5. Actor Identity Patterns]
- **Storage**: Append-only array in YAML frontmatter [Source: architecture.md#3. Format Patterns]

### Project Structure Notes

- Alignment with unified project structure: Stories in `_bmad-output/implementation-artifacts/` or `_scrum-output/sprints/SW-XXX/` depending on implementation context.
- For this story, focus on the core logic and integration into the `create-scrum-workflow` package.

### References

- [Source: prd.md#FR-7, FR-10]
- [Source: architecture.md#Implementation Patterns & Consistency Rules]
- [Source: epics.md#Epic 2: Story Approval & Lifecycle Completion]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-exp (CLI Agent)

### Debug Log References

### Completion Notes List

### File List
