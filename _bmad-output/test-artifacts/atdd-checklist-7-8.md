# ATDD Checklist - Story 7.8: Incremental Update Mode

**Generated**: 2026-03-30
**Story**: 7-8-incremental-update-mode
**Status**: Ready for Dev

## Acceptance Criteria Test Scenarios

### AC1: Scan state file reading

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| State file exists | `.arch-scan-state.json` is loaded when present | ☐ |
| Files extracted | `files_scanned` array with hashes/timestamps extracted | ☐ |
| Documents list extracted | `documents_generated` list extracted | ☐ |
| Fallback on missing state | Falls back to full-scan with warning when state file missing | ☐ |

### AC2: Changed file identification

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Hash comparison | Current file hash (SHA-256) compared with stored hash | ☐ |
| Changed files marked | Files with different hashes marked as "changed" | ☐ |
| New files detected | Files not in previous scan detected as "new" | ☐ |
| Deleted files detected | Files in previous scan but no longer existing detected | ☐ |

### AC3: Incremental re-analysis

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Only changed files analyzed | architect-doc agent invoked with changed files only | ☐ |
| Unchanged files skipped | Files without hash changes skipped for performance | ☐ |
| Document update identification | Each architecture dimension identifies affected documents | ☐ |

### AC4: Diff comparison

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| New findings compared | New findings compared against existing docs | ☐ |
| Removed findings detected | Deleted components detected in existing docs | ☐ |
| Modified findings detected | Changed components detected in existing docs | ☐ |

### AC5: Diff summary presentation

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Diff format | Summary shows: +new, ~modified, -removed | ☐ |
| Component counts | Summary shows counts for each type | ☐ |
| Examples provided | Examples like "+2 new endpoints, ~1 service, -1 middleware" | ☐ |

### AC6: User confirmation required

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Confirmation prompt | Prompt "Apply these changes? [y/N]" displayed | ☐ |
| Halt on decline | Workflow HALTs without modifications if user declines (N/n) | ☐ |
| Proceed on accept | Workflow proceeds with updates if user confirms (Y/y) | ☐ |

### AC7: Incremental document updates

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Affected sections only | Only relevant sections updated in affected documents | ☐ |
| Unchanged sections preserved | Sections without changes remain intact | ☐ |
| Multiple documents | All affected documents updated correctly | ☐ |

### AC8: Scan state update

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| State updated | `.arch-scan-state.json` updated after successful documentation update | ☐ |
| Timestamps updated | New timestamps and hashes written to state file | ☐ |
| Scan mode recorded | `scan_mode: "update"` recorded in state file | ☐ |

### AC9: No changes handling

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| No changes message | "No architecture changes detected since last scan." reported | ☐ |
| No state update | State file not modified when no changes detected | ☐ |

### AC10: Fallback to full-scan

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Missing state file | Falls back to full-scan when `.arch-scan-state.json` missing | ☐ |
| Warning displayed | "No previous scan state found. Running full scan." warning shown | ☐ |
| Full-scan executed | Workflow proceeds to Step 4 (Full-Scan Mode) | ☐ |

---

## Test Execution Summary

| AC ID | Test Count | Passed | Failed | Blocked |
|-------|------------|--------|--------|---------|
| AC1 | 4 | 0 | 0 | 0 |
| AC2 | 4 | 0 | 0 | 0 |
| AC3 | 3 | 0 | 0 | 0 |
| AC4 | 3 | 0 | 0 | 0 |
| AC5 | 3 | 0 | 0 | 0 |
| AC6 | 3 | 0 | 0 | 0 |
| AC7 | 3 | 0 | 0 | 0 |
| AC8 | 3 | 0 | 0 | 0 |
| AC9 | 2 | 0 | 0 | 0 |
| AC10 | 3 | 0 | 0 | 0 |
| **TOTAL** | **31** | **0** | **0** | **0** |

**Overall Status**: ☐ PASS / ☐ FAIL

**Notes**:
- ATDD checklist created - all test scenarios defined
- Ready for dev-story implementation
- Tests will be executed during dev-story workflow
- Story 7-8 is a VERIFICATION story - all functionality already exists from Story 7-2

## TDD Red Phase: Validation Checklists Defined

✅ **ATDD Red Phase Complete for Verification Story**

- **Validation Type**: Workflow and agent verification (not traditional code tests)
- **Total Validation Scenarios**: 31
- **All validations**: Will FAIL until implementation verified
- **Implementation Required**: Verification of existing workflow and agent files

## Implementation Guidance (Green Phase)

**Files to Verify:**
1. `scrum_workflow/workflows/architecture-documentation.md` - Step 0, Step 5 (all 6 subsections)
2. `scrum_workflow/agents/architect-doc.md` - Instruction #10 (Incremental Analysis)

**Green Phase Trigger:**
After verification, validations will pass:
- ✅ Mode detection for `--update` flag
- ✅ Update Mode orchestration steps (5.1-5.6)
- ✅ State file format and atomic write pattern
- ✅ User confirmation prompts
- ✅ Rollback logic on failure

**Critical Pattern:**
Story 7-8 is different from Stories 7-3 to 7-6:
- Stories 7-3 to 7-6: Template creation (new files)
- Story 7-8: Verification of existing workflow and agent
- NO new files created - only verification of existing functionality

**Next: Run dev-story to verify implementation and achieve GREEN phase**
