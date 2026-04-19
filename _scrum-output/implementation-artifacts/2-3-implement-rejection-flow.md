# Story 2.3: yolo

Status: done

## Story

As a developer,
I want the system to support a rejection cycle where review findings are loaded as context for re-implementation,
so that issues are caught, tracked, and addressed before delivery.

## Acceptance Criteria

1. **Given** FR-6 specifies rejection flow: `review -> changes-needed -> in-progress` **When** a review verdict is `changes-needed` (FR-24) **Then** the story status transitions to `changes-needed` **And** a `status_history` entry is appended with the review agent as actor
2. **Given** a story in `changes-needed` status **When** a developer runs `/scrum-dev-story SW-XXX` **Then** the status transitions to `in-progress` **And** previous review findings (`review-N.md`) are loaded as context for the implementation agent **And** the implementation agent can see what specific issues were flagged
3. **Given** FR-24 specifies review verdict as `approved` or `changes-needed` **When** a review is completed **Then** the review artifact contains a clear verdict field: `approved` or `changes-needed` **And** both outcomes produce a persistent `review-N.md` artifact
4. **Given** a story has been re-implemented after `changes-needed` **When** the developer triggers a new review **Then** the previous review findings are available for comparison **And** the new review can verify whether previous findings were addressed

## Tasks / Subtasks

- [x] Task 1: Update `/scrum-review-story` to handle `changes-needed` verdict (AC: #1, #3)
  - [x] 1.1 Add logic to set verdict to `changes-needed` based on finding severity
  - [x] 1.2 Update review artifact template to include verdict field
- [x] Task 2: Implement `review -> changes-needed` transition and artifact generation (AC: #1, #3)
  - [x] 2.1 Update status guard to allow `review -> changes-needed`
  - [x] 2.2 Implement `status_history` entry creation for rejection
- [x] Task 3: Update `/scrum-dev-story` to handle `changes-needed` status (AC: #2)
  - [x] 3.1 Update status guard to allow `changes-needed -> in-progress`
  - [x] 3.2 Implement status transition logic
- [x] Task 4: Implement loading of previous `review-N.md` findings as context for `dev-story` (AC: #2)
  - [x] 4.1 Create skill to discover most recent `review-N.md`
  - [x] 4.2 Inject review findings into implementation agent context
- [x] Task 5: Implement multi-round review comparison (AC: #4)
  - [x] 5.1 Update review workflow to load previous review artifacts
  - [x] 5.2 Add "Comparison with Previous Findings" section to review artifact

## Dev Notes

- **Architecture Pattern:** Follow the "Write Boundary Patterns" from `architecture.md`. Review agent only writes `review-N.md`.
- **Status Machine:** Ensure transitions strictly follow the 9-state lifecycle defined in `prd.md`.
- **Context Isolation:** When loading `review-N.md` for `dev-story`, ensure only the findings and recommendations are loaded, not the full metadata if possible, to save tokens.

### Project Structure Notes

- Artifacts should be placed in `_scrum-output/sprints/SW-XXX/`.
- Review artifacts follow naming: `review-1.md`, `review-2.md`, etc.

### References

- [Source: _scrum-output/planning-artifacts/prd.md#FR-6, FR-24]
- [Source: _scrum-output/planning-artifacts/architecture.md#Write Boundary Patterns]
- [Source: _scrum-output/planning-artifacts/epics.md#Story 2.3]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

### Completion Notes List

### File List
