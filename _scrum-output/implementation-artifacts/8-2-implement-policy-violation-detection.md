# Story 8.2: Implement Policy Violation Detection

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the system to detect and block policy violations with actionable error messages,
so that governance rules are enforced across the entire story lifecycle.

## Acceptance Criteria

1. **Given** FR-37 specifies detection of at least 3 policy violation types **When** a policy check runs (retrospective, not real-time guard) **Then** the following violation types are detected:
   - No plan: story reached `in-progress` without `plan.md`
   - No verification: story reached `review` without `verification-report.md`
   - Skipped phase: status_history shows transitions that skip required intermediate states

2. **Given** a policy violation is detected **When** the violation is reported **Then** an actionable error message is produced following the Architecture error format **And** the violation is logged for audit trail purposes (Story 8.3)

3. **Given** SC-6 specifies at least 3 violation types correctly detected and blocked **When** policy detection is validated **Then** all 3 violation types are demonstrated to be correctly detected

## Tasks / Subtasks

- [x] Task 1: Define policy violation detection command and workflow (AC: #1, #2)
  - [x] 1.1 Create `scrum_workflow/commands/policy-check.md` to define the slash-command
  - [x] 1.2 Create `scrum_workflow/workflows/policy-violation.md` to define the detection process
  - [x] 1.3 Add status guard validation: ensure command only runs on stories with status transitions completed

- [x] Task 2: Implement violation type detection (AC: #1)
  - [x] 2.1 Implement "No plan" detection: check if `plan.md` exists when story is `in-progress` or beyond
  - [x] 2.2 Implement "No verification" detection: check if `verification-report.md` exists when story reached `review`
  - [x] 2.3 Implement "Skipped phase" detection: analyze status_history for invalid transition sequences

- [x] Task 3: Implement violation reporting and logging (AC: #2)
  - [x] 3.1 Produce actionable error messages following Architecture error format
  - [x] 3.2 Log violations to audit trail location for Story 8.3 integration
  - [x] 3.3 Ensure write boundaries are respected (only audit log, no source code or story.md modification)

- [x] Task 4: Validation and Tests (AC: #1, #2, #3)
  - [x] 4.1 Create ATDD tests in `tests/unit/policy-violation/`
  - [x] 4.2 Verify all 3 violation types are correctly detected
  - [x] 4.3 Verify error message format and audit logging

## Dev Notes

### Critical Context: Policy Violation Detection (Retrospective Governance)

This story implements retrospective governance checks that complement Epic 3's real-time transition guards. While guards prevent violations during command execution, policy detection catches violations that occurred through manual edits, bypasses, or system gaps.

**Key Technical Details:**
- **Detection Trigger:** Policy check runs as a retrospective scan, not a real-time guard. Can be triggered via `/scrum-policy-check SW-XXX` or as part of sprint observability commands.
- **Violation Types:**
  1. No plan: story in `in-progress`+ without `plan.md` in `_scrum-output/sprints/SW-XXX/`
  2. No verification: story in `review`+ without `verification-report.md` in `_scrum-output/sprints/SW-XXX/`
  3. Skipped phase: status_history entries show transitions violating the 9-state lifecycle (e.g., draft -> in-progress without refined/ready-for-dev)
- **Audit Logging:** Violations are logged to `_scrum-output/audit/SW-XXX-policy-violations.md` (prepares for Story 8.3 central audit trail)

**Relationship to Epic 3 Guards:**
- Epic 3 guards (Story 3.2) prevent invalid transitions at execution time
- Policy violation detection catches bypasses via manual edits or legacy stories
- Both mechanisms use the same 9-state lifecycle definition from Story 3.1

### Architecture Compliance

- **FR-37**: Policy violation detection with at least 3 violation types
- **FR-9 / SC-18**: Write boundary enforcement — policy-check may write audit log only, NOT story.md
- **Write Boundary**: `/scrum-policy-check` writes policy-violation report only (prepares for Story 8.3)
- **Error Format**: Follow Architecture error pattern: `❌ Policy Violation: {type}` with `**Details:**` and `**Next Step:**`
- **Status History Pattern**: Leverage existing status_history structure for skipped-phase detection

### Project Structure Notes

- **Commands**: `scrum_workflow/commands/policy-check.md`
- **Workflows**: `scrum_workflow/workflows/policy-violation.md`
- **Output**: `_scrum-output/audit/SW-XXX-policy-violations.md` (audit directory, not sprints directory)
- **Tests**: `tests/unit/policy-violation/` or `scrum_workflow/__tests__/policy-violation.test.ts`

### Previous Story Intelligence (from Story 8.1)

**Learnings from Story 8.1 (Implement Post-Implementation Verification):**

1. **Pre-existing files**: Command, workflow, template, and utility files were pre-created. Check for existing files before creating new ones.

2. **Path resolution**: Use `fileURLToPath(import.meta.url)` for reliable test location tracking instead of `process.cwd()`.

3. **Template injection**: Escape `{{` and `}}` in replacement values to prevent template injection attacks.

4. **Atomic file writes**: Write to temp file then rename to prevent corrupt state on abort.

5. **Test output parsing**: Vitest format parsing is fragile — add defensive fallback when regex fails.

6. **Coverage regex**: Wrong reporter silently returns N/A — use same defensive fallback approach.

7. **Path traversal**: Sanitize ticket ID with format validation `/^SW-\d{3}$/` before using in file paths.

8. **Timeout handling**: `execSync` has no timeout — add explicit timeout (300s suggested) to prevent indefinite hangs.

9. **Non-atomic status updates**: Re-read file before status update, use try/catch with ENOENT handling.

10. **Workflow paths**: Earlier verification workflow had wrong directory `_scrum-output` — should be `_scrum-output`.

### References

- [Source: _scrum-output/planning-artifacts/epics.md#Story 8.2]
- [Source: _scrum-output/planning-artifacts/prd.md#FR-37]
- [Source: _scrum-output/planning-artifacts/architecture.md#Pattern 4. Write Boundary Patterns]
- [Source: _scrum-output/planning-artifacts/architecture.md#Pattern 7. Error Message Patterns]
- [Source: _scrum-output/implementation-artifacts/8-1-implement-post-implementation-verification.md]
- [Source: scrum_workflow/utils/verify.js] (reference for file scanning patterns)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-20250514

### Debug Log References

- Story 8.1 lessons applied: template injection prevention, atomic file writes, path traversal sanitization, timeout handling, non-atomic status updates

### Completion Notes List

- ✅ Created `scrum_workflow/commands/policy-check.md` defining /scrum-policy-check command with 3 violation types, status guards, error handling, and audit trail integration
- ✅ Created `scrum_workflow/workflows/policy-violation.md` defining detection workflow with all 3 violation types (No Plan, No Verification, Skipped Phase), valid transition checks, and atomic report writing
- ✅ Created `scrum_workflow/utils/policy.js` with utility functions for violation detection and report generation
- ✅ All 38 ATDD tests pass for policy violation detection
- ✅ Write boundaries respected: only `_scrum-output/audit/SW-XXX-policy-violations.md` is written (no story.md modification)

### File List

- `scrum_workflow/commands/policy-check.md` (NEW)
- `scrum_workflow/workflows/policy-violation.md` (NEW)
- `scrum_workflow/utils/policy.js` (NEW)
- `_scrum-output/implementation-artifacts/8-2-implement-policy-violation-detection.md` (modified - tasks completed)

