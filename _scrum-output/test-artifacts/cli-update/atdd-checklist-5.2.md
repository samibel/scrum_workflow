---
stepsCompleted:
  - step-01-preflight-and-context
lastStep: step-01-preflight-and-context
lastSaved: '2026-04-08T22:44:30.000Z'
inputDocuments:
  - _scrum-output/implementation-artifacts/5-2-implement-cli-update-migration-command.md
  - create-scrum-workflow/src/commands/update.js
  - create-scrum-workflow/src/integrity/lock-file.js
  - .claude/skills/scrum-testarch-atdd/resources/tea-index.csv
---

# ATDD Checklist - Story 5.2: CLI Update & Migration Command

**Status:** RED (Tests Written - Implementation Pending)
**Test Framework:** Vitest with TypeScript
**Test Location:** `tests/unit/cli-update/`
**Story:** 5.2 - Implement CLI Update & Migration Command
**Date:** 2026-04-08

---

## Execution Summary

### Stack Detection
- **Detected Stack:** `backend` (Node.js project with Vitest)
- **Test Stack Type:** `backend` (JavaScript/TypeScript with Vitest)
- **Test Framework:** Vitest v4.1.3

### Prerequisites Verification
- **Story Approved:** YES (Status: ready-for-dev)
- **Test Framework Configured:** YES (vitest.config.js exists)
- **Development Environment:** AVAILABLE

### Test Execution Results

| Metric | Count |
|--------|-------|
| Total Tests | 55 |
| Passed | 31 |
| Failed | 24 |
| Pass Rate | 56% |

### Status by Acceptance Criteria

| AC | Description | Tests | Passed | Failed | Status |
|----|-------------|-------|--------|--------|--------|
| AC1 | Version Detection & Breaking Changes | 11 | 6 | 5 | RED |
| AC2 | status_history Migration & plan.md Warning | 13 | 7 | 6 | RED |
| AC3 | User Modification Preservation | 19 | 17 | 2 | GREEN |
| AC4 | Post-Migration Validation | 12 | 1 | 11 | RED |

---

## AC1: Version Detection & Breaking Changes (5 FAILING)

### Failing Tests (Need Implementation)

1. **[P0] breaking-changes.md should exist**
   - File does not exist at `create-scrum-workflow/breaking-changes.md`

2. **[P0] breaking-changes.md should document status_history field**
   - File missing - cannot document

3. **[P0] breaking-changes.md should document plan.md check**
   - File missing - cannot document

4. **[P0] Story 5.2 should mention version migration path**
   - Story file does not reference v1.2.0 → v1.3.0 version path

5. **[P1] update.js should support --dry-run option**
   - Current update.js has dryRun option but pattern not matching

### Passing Tests (Implementation Exists)

6. [P0] update.js should import package.json for version detection
7. [P0] update.js should detect installed version from lock file
8. [P0] Story 5.2 should mention version detection
9. [P0] update.js should support --dry-run option
10. [P0] Story 5.2 should reference breaking-changes documentation

---

## AC2: status_history Migration & plan.md Warning (6 FAILING)

### Failing Tests (Need Implementation)

1. **[P0] update.js should scan story.md files for missing status_history**
   - No status_history migration logic in current update.js

2. **[P0] update.js should add retroactive status_history entry**
   - Missing migration entry structure (from: null, to: current_status, trigger, actor)

3. **[P0] status_history migration entry should use actor: system**
   - Migration logic not implemented

4. **[P0] status_history migration entry should use trigger: "migrated-from-v1.2.0"**
   - Migration trigger not implemented

5. **[P0] Warning should suggest running /scrum-refine-story**
   - Missing plan.md warning with suggestion

6. **[P0] Missing plan.md should be a warning, not a migration blocker**
   - plan.md check not implemented

### Passing Tests (Implementation Exists)

7. [P0] update.js should check for plan.md existence
8. [P0] update.js should flag stories at ready-for-dev without plan.md
9. [P0] update.js should backup files before migration
10. [P0] Story 5.2 should mention status_history migration
11. [P0] Story 5.2 should mention plan.md warning
12. [P0] Story 5.2 should document retroactive entry structure

---

## AC3: User Modification Preservation (2 FAILING)

### Failing Tests (Minor Issues)

1. **[P0] update.js should preserve custom agents**
   - Pattern not matching - agents preservation is implicit

2. **[P0] Update report should list any manual actions required**
   - Current implementation doesn't explicitly mention manual actions

### Passing Tests (Implementation Exists)

17 tests passing including:
- Lock file mechanism exists
- Backup/restore functionality works
- User-modified files are tracked
- Update report is generated

---

## AC4: Post-Migration Validation (11 FAILING)

### Failing Tests (Need Implementation)

1. **[P0] update.js should validate YAML frontmatter is parseable**
   - No YAML validation in current implementation

2. **[P0] update.js should report YAML parsing failures**
   - No YAML validation error handling

3. **[P0] update.js should validate status_history array consistency**
   - No status_history validation

4. **[P0] status_history entries should have required fields**
   - No status_history validation logic

5. **[P0] update.js should check each status_history entry has required fields**
   - No status_history validation

6. **[P0] update.js should generate a validation report**
   - No post-migration validation report

7. **[P0] Validation report should confirm success when validation passes**
   - No validation logic

8. **[P0] Validation report should list remaining issues**
   - No validation logic

9. **[P0] Validation report should provide actionable guidance**
   - No validation logic

10. **[P0] Story 5.2 should mention YAML frontmatter validation**
    - Story doesn't mention post-migration YAML validation

11. **[P0] Story 5.2 should mention validation report with actionable guidance**
    - Story doesn't mention actionable guidance in validation

---

## Next Steps

### Required Implementations (RED Phase - Do Not Proceed to Green Until):

1. **Create `create-scrum-workflow/breaking-changes.md`** with:
   - v1.2.0 → v1.3.0 migration path
   - status_history field addition as breaking change
   - plan.md check requirement as breaking change

2. **Extend `update.js`** with:
   - status_history migration logic for story.md files
   - plan.md warning for ready-for-dev stories
   - YAML frontmatter validation
   - Post-migration validation report

3. **Update Story 5.2** to reference breaking-changes.md and version migration path

### Files to Modify:

| File | Action |
|------|--------|
| `create-scrum-workflow/breaking-changes.md` | CREATE |
| `create-scrum-workflow/src/commands/update.js` | MODIFY |
| `_scrum-output/implementation-artifacts/5-2-implement-cli-update-migration-command.md` | MODIFY |

### TDD Cycle Status:

- [x] **RED** - Tests written, implementation incomplete (current state)
- [ ] **GREEN** - Implementation passes tests
- [ ] **REFACTOR** - Clean up implementation

---

## Test Files Created

| File | AC Coverage |
|------|-------------|
| `ac1-version-detection-and-breaking-changes.spec.ts` | AC1 |
| `ac2-status-history-migration-and-plan-md-warning.spec.ts` | AC2 |
| `ac3-user-modification-preservation.spec.ts` | AC3 |
| `ac4-post-migration-validation.spec.ts` | AC4 |

---

**Generated by:** scrum-testarch-atdd workflow
**Mode:** yolo (auto-approved)
