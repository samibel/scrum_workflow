# ATDD Checklist - Story 7.9: Architecture Scan State Management & Resume Capability

**Generated**: 2026-03-30
**Story**: 7-9-architecture-scan-state-management-and-resume
**Status**: Ready for Dev

## Acceptance Criteria Test Scenarios

### AC1: State file structure

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Complete structure | State file includes all required fields | ☐ |
| scan_date field | Present and valid ISO datetime | ☐ |
| scan_mode field | Present with value "full-scan" or "update" | ☐ |
| files_scanned array | Array of {path, hash, timestamp} objects | ☐ |
| documents_generated array | Array of generated doc paths | ☐ |
| documents_skipped array | Array of skipped documents with reasons | ☐ |
| scan_duration field | Present with numeric value | ☐ |
| scan_status field | Present with value "complete" or "interrupted" | ☐ |

### AC2: Separate state files

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Architecture state file | Path: `docs/generated/.arch-scan-state.json` | ☐ |
| Business logic state file | Path: `.scan-state.json` (Epic 6) | ☐ |
| Independence comment | Workflow notes separate state files | ☐ |

### AC3: Content-based hashing

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| SHA-256 hash | Hash computed from file content | ☐ |
| Hash comparison | Used for change detection in update mode | ☐ |

### AC4: Interruption handling

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| scan_status interrupted | State can be set to "interrupted" | ☐ |
| last_completed_file | Recorded when scan interrupted | ☐ |
| State preservation | State file written on interruption | ☐ |

### AC5: Resume capability

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Read state on resume | `.arch-scan-state.json` loaded on resume | ☐ |
| Continue from last file | Resume from `last_completed_file` | ☐ |

### AC6: Incremental state updates

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| During scan updates | State updated during scan, not only at end | ☐ |
| Atomic writes | Temp file pattern for each update | ☐ |

### AC7: Skipped documents tracking

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| documents_skipped array | Tracks skipped dimensions | ☐ |
| Skip reasons | Includes reasons like "no frontend detected" | ☐ |

### AC8: Full-scan reset behavior

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Overwrite confirmation | User confirms before resetting | ☐ |
| State reset | State file reset on full-scan | ☐ |

### AC9: Valid JSON format

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Valid JSON | State file example is valid JSON | ☐ |
| Human-readable | Pretty-printed format | ☐ |

### AC10: Git ignore recommendations

| Test Scenario | Validation Criteria | Status |
|--------------|-------------------|--------|
| Local state noted | State is local, not committed | ☐ |

---

## Test Execution Summary

| AC ID | Test Count | Passed | Failed | Blocked |
|-------|------------|--------|--------|---------|
| AC1 | 8 | 0 | 0 | 0 |
| AC2 | 3 | 0 | 0 | 0 |
| AC3 | 2 | 0 | 0 | 0 |
| AC4 | 3 | 0 | 0 | 0 |
| AC5 | 2 | 0 | 0 | 0 |
| AC6 | 2 | 0 | 0 | 0 |
| AC7 | 2 | 0 | 0 | 0 |
| AC8 | 2 | 0 | 0 | 0 |
| AC9 | 2 | 0 | 0 | 0 |
| AC10 | 1 | 0 | 0 | 0 |
| **TOTAL** | **29** | **0** | **0** | **0** |

**Overall Status**: ☐ PASS / ☐ FAIL

**Notes**:
- ATDD checklist created - all test scenarios defined
- Ready for dev-story implementation
- Story 7-9 is a VERIFICATION story - state file structure already exists from Story 7-2

## TDD Red Phase: Validation Checklists Defined

✅ **ATDD Red Phase Complete for Verification Story**

- **Validation Type**: Workflow verification (not traditional code tests)
- **Total Validation Scenarios**: 29
- **All validations**: Will FAIL until implementation verified
- **Implementation Required**: Verification of existing workflow state file structure

## Implementation Guidance (Green Phase)

**Files to Verify:**
1. `scrum_workflow/workflows/architecture-documentation.md` - Step 4.6, Step 5.6

**Green Phase Trigger:**
After verification, validations will pass:
- ✅ Complete state file structure (all required fields)
- ✅ Separate state files (architecture vs. business logic)
- ✅ SHA-256 hash computation
- ✅ Atomic write pattern
- ✅ Human-readable JSON format

**Critical Pattern:**
Story 7-9 follows verification pattern from Story 7-8:
- No new files created
- Verification of existing workflow functionality
- State file structure already defined in Story 7-2

**Next: Run dev-story to verify implementation and achieve GREEN phase**
