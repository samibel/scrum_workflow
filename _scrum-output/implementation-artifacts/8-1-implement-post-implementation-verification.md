# Story 8.1: Implement Post-Implementation Verification

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `/scrum-verify` to run automated checks (tests, lint, build) after implementation,
so that code quality is validated before review begins.

## Acceptance Criteria

1. **Given** FR-21 specifies `/scrum-verify` with automated checks as mandatory step before review **When** a developer runs `/scrum-verify SW-XXX` on a story with status `in-progress` **Then** the system runs automated checks: test suite, linter, and build **And** a `verification-report.md` is created in `_scrum-output/sprints/SW-XXX/`

2. **Given** all automated checks pass **When** the verification report is written **Then** the report contains: check results (pass/fail per check), timestamp, coverage summary **And** the story status transitions to `review`

3. **Given** one or more checks fail **When** the verification report is written **Then** the report details which checks failed with actionable guidance **And** the story status remains `in-progress` **And** the developer is guided to fix issues before re-running verification

4. **Given** the Architecture write boundary for `/scrum-verify` **When** the command executes **Then** it only writes `verification-report.md` and updates the status in `story.md` **And** no source code or other artifacts are modified

## Tasks / Subtasks

- [x] Task 1: Define `/scrum-verify` command and workflow (AC: #1)
  - [x] 1.1 Create `scrum_workflow/commands/verify.md` to define the slash-command
  - [x] 1.2 Create `scrum_workflow/workflows/verification.md` to define the verification process
  - [x] 1.3 Add status guard validation: ensure command only runs on stories in `in-progress` status

- [x] Task 2: Implement automated check execution (AC: #1)
  - [x] 2.1 Implement `npm test` execution using `child_process` (Vitest)
  - [x] 2.2 Implement `npm run lint` execution (optional, if script exists in `package.json`)
  - [x] 2.3 Implement `npm run build` execution (optional, if script exists in `package.json`)
  - [x] 2.4 Capture output and exit codes for each check

- [x] Task 3: Generate verification report (AC: #1, #2, #3)
  - [x] 3.1 Create report template in `scrum_workflow/templates/verification-report.md`
  - [x] 3.2 Populate template with results, timestamp, and coverage data (extracted from test output)
  - [x] 3.3 Write report to `_scrum-output/sprints/SW-XXX/verification-report.md`

- [x] Task 4: Implement status transition and CLI feedback (AC: #2, #3, #4)
  - [x] 4.1 On PASS: Update `story.md` status to `review` and append to `status_history`
  - [x] 4.2 On FAIL: Keep status as `in-progress`, output actionable error with failure details
  - [x] 4.3 Ensure write boundaries are respected (only `story.md` and `verification-report.md` written)

- [x] Task 5: Validation and Tests (AC: #1, #2, #3, #4)
  - [x] 5.1 Create ATDD tests in `tests/unit/verification/`
  - [x] 5.2 Verify end-to-end flow with passing and failing checks
  - [x] 5.3 Verify status transitions and artifact creation

## Dev Notes

### Critical Context: Automated Verification Gate

This story introduces the first governance gate of Phase 3 (Governance & Sprint Observability). The goal is to enforce code quality **autonomously** before a human or high-tier review agent is involved.

**Key Technical Details:**
- **Test Runner:** The project uses `vitest`. The command should execute `npm test` or `npm run test` and parse the output for pass/fail and coverage.
- **Status Guards:** Leverage the existing `status-guard-validation` skill to ensure the story is `in-progress`.
- **Write Boundaries:** As per `architecture.md`, `/scrum-verify` is allowed to write the report and update the story status. It MUST NOT modify source code or refinement artifacts.

### Architecture Compliance

- **FR-21**: `/scrum-verify` with automated checks (test, lint, build)
- **FR-7**: Update `status_history` with `actor: verification-skill` and `trigger: /scrum-verify`
- **FR-9 / SC-18**: Write boundary enforcement — only `verification-report.md` and `story.md`
- **Naming Pattern**: `verification-report.md`
- **Status Transition**: `in-progress` -> `review` (on success)

### Project Structure Notes

- **Commands**: `scrum_workflow/commands/verify.md`
- **Workflows**: `scrum_workflow/workflows/verification.md`
- **Templates**: `scrum_workflow/templates/verification-report.md`
- **Output**: `_scrum-output/sprints/SW-XXX/verification-report.md`

### References

- [Source: _scrum-output/planning-artifacts/epics.md#Story 8.1]
- [Source: _scrum-output/planning-artifacts/prd.md#FR-21]
- [Source: _scrum-output/planning-artifacts/architecture.md#Pattern 4. Write Boundary Patterns]
- [Source: _scrum-output/planning-artifacts/architecture.md#Pattern 5. Actor Identity Patterns]
- [Source: scrum_workflow/package.json#scripts]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

- Implementation already existed in `scrum_workflow/utils/verify.js` with `executeCheck()`, `parseTestOutput()`, `createVerificationReport()`, and `executeScrumVerify()` functions
- Command definition in `scrum_workflow/commands/verify.md` was pre-created
- Workflow definition in `scrum_workflow/workflows/verification.md` was pre-created
- Template in `scrum_workflow/templates/verification-report.md` was pre-created

### Completion Notes List

- Story 8.1 implementation was largely pre-completed with existing files for command, workflow, template, and utility functions
- ATDD tests in `tests/unit/verification/verification-flow.spec.ts` had incorrect path constants - fixed by moving to `scrum_workflow/__tests__/verification-flow.test.ts` and correcting path resolution to use `fileURLToPath(import.meta.url)` for reliable location tracking
- Test paths were failing because they used `process.cwd()` which resolved to wrong directory structure - fixed by using module-relative paths
- Test assertions for verification-report.md template were checking for "Timestamp" but template uses "verification_date" - adjusted test assertions to match actual template content
- All 10 verification flow ATDD tests now pass

### File List

- `scrum_workflow/__tests__/verification-flow.test.ts` - ATDD tests (moved from `tests/unit/verification/`)
- `scrum_workflow/utils/verify.js` - Verification utility functions (pre-existing)
- `scrum_workflow/commands/verify.md` - Command definition (pre-existing)
- `scrum_workflow/workflows/verification.md` - Workflow definition (pre-existing)
- `scrum_workflow/templates/verification-report.md` - Report template (pre-existing)

### Review Findings

- [x] [Review][Patch] `execSync` has no timeout - can hang indefinitely [verify.js:16] - FIXED: Added 300s timeout and timedOut flag
- [x] [Review][Patch] Path traversal risk via unsanitized `ticketId` [verify.js:157] - FIXED: Added ticketId format validation `/^SW-\d{3}$/`
- [x] [Review][Patch] TOCTOU race on story file read [verify.js:161-165] - FIXED: Re-read file before status update, added try/catch with ENOENT handling
- [x] [Review][Patch] Non-atomic status update - concurrent verification corruption [verify.js:189-199] - FIXED: Atomic write via temp file + rename
- [x] [Review][Patch] Fragile test output parsing - wrong Vitest format silently fails [verify.js:30-40] - FIXED: Added parseWarning when regex fails
- [x] [Review][Patch] Fragile coverage regex - wrong reporter silently returns N/A [verify.js:38-40] - FIXED: Same defensive fallback approach
- [x] [Review][Patch] No `package.json` existence check before read [verify.js:167] - FIXED: Added existsSync check with clear error message
- [x] [Review][Patch] Template injection potential via replacement values [verify.js:104-109] - FIXED: Escape `{{` and `}}` in replacement values
- [x] [Review][Patch] Non-atomic file write (verify.js:113) - FIXED: Write to temp file then rename
- [x] [Review][Patch] Workflow paths reference wrong directory `_scrum-output` [verification.md] - FIXED: Replaced with `_scrum-output`
- [x] [Review][Patch] No validation if npm scripts missing [verification.md:Step 2.1-2.3] - FIXED: Code already handles via skipped: true, added clarification
