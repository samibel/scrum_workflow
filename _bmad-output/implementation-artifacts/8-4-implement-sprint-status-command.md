# Story 8.4: Implement Sprint Status Command

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `/sprint-status` to show all stories with their current status, age, and pending actions,
so that I have sprint-level visibility at a glance.

## Acceptance Criteria

1. **Given** FR-39 specifies `/sprint-status` listing all stories with current status, age, and pending actions
   **When** a developer runs `/sprint-status`
   **Then** the system scans `_scrum-output/sprints/` for all story directories
   **And** displays a summary table with: story ID, title, current status, age (days since creation), pending action (next required command)

2. **Given** stories in various states
   **When** the summary is displayed
   **Then** stories are sorted by status priority (blocked/changes-needed first, then in-progress, then others)
   **And** stories requiring action are highlighted

3. **Given** no stories exist
   **When** `/sprint-status` is run
   **Then** a helpful message is displayed: "No stories found. Start with /scrum-create-ticket"

## Tasks / Subtasks

- [x] Task 1: Create sprint-status command definition (AC: #1, #2, #3)
  - [x] 1.1 Create `scrum_workflow/commands/sprint-status.md` defining the `/sprint-status` slash-command
  - [x] 1.2 Define command interface: no arguments required, optional `--epic` filter flag
  - [x] 1.3 Define status guard: command works from any story status

- [x] Task 2: Implement story directory scanning (AC: #1)
  - [x] 2.1 Scan `_scrum-output/sprints/` for all story directories (format: `SW-XXX/`)
  - [x] 2.2 Extract story metadata from `story.md` YAML frontmatter (ticket, title, status, created, updated)
  - [x] 2.3 Calculate story age in days from `created` timestamp
  - [x] 2.4 Determine pending action based on current status

- [x] Task 3: Implement status priority sorting (AC: #2)
  - [x] 3.1 Define priority order: changes-needed > blocked > in-progress > review > approved > refined > ready-for-dev > draft > done > cancelled
  - [x] 3.2 Sort stories by priority (highest priority first)
  - [x] 3.3 Highlight stories requiring action (changes-needed, in-progress, review, approved)

- [x] Task 4: Implement output formatting (AC: #2, #3)
  - [x] 4.1 Format table with columns: Story ID | Title | Status | Age | Pending Action
  - [x] 4.2 Apply color coding: changes-needed=red, in-progress=yellow, review=cyan, approved=green, done=green, others=default
  - [x] 4.3 Show empty state message when no stories found
  - [x] 4.4 Add `--epic` filter to show only stories from specific epic (e.g., `--epic 8` shows epic 8 stories only)

- [x] Task 5: Implement pending action determination logic (AC: #1)
  - [x] 5.1 Map status to next required command: draft->refine, refined->refine-story, ready-for-dev->dev-story, in-progress->verify, review->approve, approved->approve (final)
  - [x] 5.2 Handle special cases: changes-needed->dev-story (retry), cancelled->N/A, done->N/A
  - [x] 5.3 Show "Action needed" for stories in transitional states

- [x] Task 6: Validation and Tests (AC: #1, #2, #3)
  - [x] 6.1 Create ATDD tests in `tests/unit/sprint-status/`
  - [x] 6.2 Verify story scanning and metadata extraction
  - [x] 6.3 Verify status priority sorting
  - [x] 6.4 Verify output formatting and color coding
  - [x] 6.5 Verify empty state handling

## Dev Notes

### Critical Context: Sprint Status Command (FR-39)

This story implements `/sprint-status` for sprint-level visibility. It scans all story directories and displays a summary table with status, age, and pending actions.

**Key Technical Details:**
- **Command**: `/sprint-status` (no required arguments)
- **Optional Flag**: `--epic N` to filter by epic number
- **Scan Location**: `_scrum-output/sprints/` for all `SW-XXX/` directories
- **Table Columns**: Story ID | Title | Status | Age (days) | Pending Action
- **Sorting**: Status priority (changes-needed > in-progress > others)
- **Color Coding**: Semantic colors per UX-DR6 (changes-needed=red, in-progress=yellow, etc.)
- **Empty State**: "No stories found. Start with /scrum-create-ticket"

**Status Priority Order (highest to lowest):**
1. changes-needed (requires immediate attention)
2. blocked (if implemented)
3. in-progress (actively being worked)
4. review (awaiting review)
5. approved (awaiting approval)
6. refined (awaiting plan)
7. ready-for-dev (awaiting implementation)
8. draft (initial state)
9. done (completed)
10. cancelled (cancelled)

**Pending Action Mapping:**
| Status | Next Command |
|--------|--------------|
| draft | /scrum-refine-ticket |
| refined | /scrum-refine-story |
| ready-for-dev | /scrum-dev-story |
| in-progress | /scrum-verify |
| review | /scrum-approve |
| approved | /scrum-approve (final) |
| changes-needed | /scrum-dev-story (retry) |
| done | N/A |
| cancelled | N/A |

**Age Calculation:**
- Calculate days since `created` timestamp in YAML frontmatter
- Display as integer days (e.g., "3d", "14d")
- Handle missing `created` field gracefully (show "?" or "unknown")

### Architecture Compliance

- **FR-39**: Sprint observability via `/sprint-status` listing all stories with current status, age, and pending actions
- **NFR-9**: All output is human-readable (terminal table format)
- **UX-DR6**: Semantic color system - changes-needed=red, in-progress=yellow, review=cyan, approved=green
- **UX-DR7**: Emoji prefixes - ✓ for success, ⚠ for warning, ❌ for error, ℹ for info
- **UX-DR9**: Single line per message - table rows are single lines with emoji prefix
- **Write Boundary**: `/sprint-status` is read-only - only reads `_scrum-output/sprints/` directories and displays, no writes

### Project Structure Notes

- **Command**: `scrum_workflow/commands/sprint-status.md`
- **Utility** (optional): `scrum_workflow/utils/sprint-status.js` if logic complex
- **Tests**: `tests/unit/sprint-status/` or `scrum_workflow/__tests__/sprint-status.test.ts`
- **Source Directory**: `_scrum-output/sprints/` (note: this is the output directory, NOT `_bmad-output`)

### Previous Story Intelligence (from Stories 8.2 and 8.3)

**Learnings from Story 8.3 (Central Audit Trail):**

1. **Pre-existing files**: Check for existing files before creating new ones - many files are pre-created.

2. **Path resolution**: Use `fileURLToPath(import.meta.url)` for reliable test location tracking instead of `process.cwd()`.

3. **Template injection**: Escape `{{` and `}}` in replacement values to prevent template injection attacks.

4. **Atomic file writes**: Write to temp file then rename to prevent corrupt state on abort.

5. **Path traversal**: Sanitize ticket ID with format validation `/^SW-\d{3}$/` before using in file paths.

6. **Audit directory**: Uses `_scrum-output/audit/` - same root directory as sprints (`_scrum-output/`)

7. **Status integration**: Story 8.3 integrates with status_history for transition events - can reuse for age calculation.

8. **Output format**: Markdown tables are human-readable but consider terminal table formatting with colors for `/sprint-status` command output.

**Learnings from Story 8.2 (Policy Violation Detection):**

1. **Pre-existing files**: Many files are pre-created. Check for existing files before creating new ones.

2. **Template injection**: Escape `{{` and `}}` in replacement values to prevent template injection attacks.

3. **Timeout handling**: `execSync` has no timeout - add explicit timeout (300s suggested) to prevent indefinite hangs.

4. **Workflow paths**: Use correct directory `_scrum-output` (NOT `_bmad-output`)

5. **Non-atomic status updates**: Re-read file before status update, use try/catch with ENOENT handling.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 8.4]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-39]
- [Source: _bmad-output/planning-artifacts/architecture.md#Pattern 1. Naming Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Pattern 5. Actor Identity Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Pattern 6. Timestamp & ID Patterns]
- [Source: _bmad-output/implementation-artifacts/8-2-implement-policy-violation-detection.md]
- [Source: _bmad-output/implementation-artifacts/8-3-implement-central-audit-trail.md]
- [Source: scrum_workflow/commands/policy-check.md] (reference for command structure)
- [Source: scrum_workflow/commands/audit-trail.md] (reference for read-only command pattern)
- [Source: scrum_workflow/utils/audit.js] (reference for directory scanning patterns)

## Dev Agent Record

### Implementation Plan

Implemented `/sprint-status` command with full sprint observability as specified in FR-39.

### Implementation Notes

**Completed:**
- Created command definition: `scrum_workflow/commands/sprint-status.md`
- Created utility module: `scrum_workflow/utils/sprint-status.js`
- Created ATDD tests: `tests/unit/sprint-status/sprint-status.test.js` (22 tests, all passing)

**Key Technical Decisions:**
- Used `fileURLToPath(import.meta.url)` for reliable test location tracking
- Added `isNaN` check in `calculateAgeInDays` to properly handle invalid date strings
- Status priority order: changes-needed(1) > blocked(2) > in-progress(3) > review(4) > approved(5) > refined(6) > ready-for-dev(7) > draft(8) > done(9) > cancelled(10)
- Color mapping: changes-needed=red, in-progress=yellow, review=cyan, approved=green, done=green

**Test Results:**
- 22 tests passing for sprint-status module
- All acceptance criteria covered: AC1 (story scanning), AC2 (priority sorting), AC3 (empty state)

### Debug Log

2026-04-09: Initial implementation completed. All 22 unit tests passing.

### Completion Notes

Story 8.4 implementation complete. Sprint status command provides sprint-level visibility by scanning all story directories and displaying a summary table with status, age, and pending actions. Read-only operation with no writes.

## File List

- `scrum_workflow/commands/sprint-status.md` (NEW - command definition)
- `scrum_workflow/utils/sprint-status.js` (NEW - utility module)
- `create-scrum-workflow/src/utils/sprint-status.js` (NEW - copy for test framework)
- `create-scrum-workflow/test/unit/sprint-status/sprint-status.test.js` (NEW - ATDD tests)
- `tests/unit/sprint-status/sprint-status.test.js` (NEW - reference tests)

## Change Log

- 2026-04-09: Initial implementation of `/sprint-status` command
