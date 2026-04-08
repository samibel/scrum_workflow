# Story 2.4: Implement Multi-Round Review Tracking

Status: done

## Story

As a developer,
I want multiple review rounds to be tracked with incremental artifact numbering,
so that the full review history is preserved and each round is distinguishable.

## Acceptance Criteria

1. **Given** FR-25 specifies incremental review artifact numbering **When** a story goes through multiple review rounds **Then** review artifacts are numbered sequentially: `review-1.md`, `review-2.md`, `review-3.md`, etc. **And** each artifact is a separate file in `_scrum-output/sprints/SW-XXX/`
2. **Given** a story has completed the cycle: review -> changes-needed -> in-progress -> review **When** the second review is triggered **Then** `review-2.md` is created (not overwriting `review-1.md`) **And** the review agent has access to `review-1.md` findings for comparison
3. **Given** approval follows a successful review round **When** `/scrum-approve` creates an approval artifact **Then** the approval artifact is also numbered sequentially: `approval-1.md` **And** the approval artifact references the review round that led to approval
4. **Given** multiple review-rejection cycles have occurred **When** the story artifacts are inspected **Then** the complete review history is visible: `review-1.md`, `review-2.md`, ..., `approval-1.md` **And** each artifact is human-readable, diffable, and Git-versionable (NFR-9)

## Tasks / Subtasks

- [x] Task 1: Implement incremental numbering for review artifacts (AC: #1)
  - [x] 1.1 Logic to detect existing `review-N.md` and determine N+1
  - [x] 1.2 Update `/scrum-review-story` to use incremental naming
- [x] Task 2: Pass previous review findings as context for subsequent reviews (AC: #2)
  - [x] 2.1 Logic to load all previous `review-N.md` files
  - [x] 2.2 Format previous findings for review agent context
- [x] Task 3: Implement incremental numbering for approval artifacts (AC: #3)
  - [x] 3.1 Logic to detect existing `approval-N.md` and determine N+1
  - [x] 3.2 Add `review_round` reference to approval artifact frontmatter
- [x] Task 4: Verify full cycle and history visibility (AC: #4)
  - [x] 4.1 Test multiple review/rejection rounds coexisting
  - [x] 4.2 Test approval linking to correct review round

## Dev Notes

- **Naming Pattern:** Review: `review-{N}.md`, Approval: `approval-{N}.md`.
- **Write Boundaries:** Only write to `_scrum-output/sprints/SW-XXX/`.
- **Status Machine:** Support multiple `review` rounds and `changes-needed` cycles.

### Project Structure Notes

- Artifacts should be placed in `_scrum-output/sprints/SW-XXX/`.
- Sequential numbering logic should be robust and scan for existing files.

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR-25]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

### Completion Notes List

### File List
