---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04c-aggregate
  - step-05-validate-and-complete
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-08T12:00:00Z'
story_id: '2-2'
story_name: 'Implement /scrum-approve Command'
inputDocuments:
  - story: '_bmad-output/implementation-artifacts/2-2-implement-scrum-approve-command.md'
  - approval_template: 'scrum_workflow/templates/approval.md'
  - existing_test_pattern: 'create-scrum-workflow/test/atdd/story-2-1-status-history-tracking.test.js'
---

# ATDD Checklist: Story 2.2 - Implement /scrum-approve Command

## TDD Red Phase (Current)

**Status:** COMPLETE - Failing tests generated

| Test Type | Count | Status |
|-----------|-------|--------|
| Unit Tests | 26 | All skipped (test.skip) |
| Integration Tests | 4 | All skipped (test.skip) |
| Edge Case Tests | 5 | All skipped (test.skip) |
| **Total** | **35** | **All with test.skip()** |

## Test File

**Location:** `create-scrum-workflow/test/atdd/story-2-2-scrum-approve-command.test.js`

## Acceptance Criteria Coverage

### AC1: Successful Approval Flow (approved -> done)

| Test ID | Priority | Description | Status |
|---------|----------|-------------|--------|
| AC1-P0-01 | P0 | Create approval artifact on successful approval | test.skip |
| AC1-P0-02 | P0 | Include required fields in approval artifact | test.skip |
| AC1-P0-03 | P0 | Transition status to done on successful approval | test.skip |
| AC1-P0-04 | P0 | Append status_history entry with correct fields | test.skip |
| AC1-P0-05 | P0 | Update the updated field in story frontmatter | test.skip |
| AC1-P0-06 | P0 | Generate sequential approval numbers | test.skip |

**Coverage:** 6 tests covering all aspects of successful approval flow

### AC2: Invalid Status Error Handling

| Test ID | Priority | Description | Status |
|---------|----------|-------------|--------|
| AC2-P0-01 | P0 | Reject approval when status is review | test.skip |
| AC2-P0-02 | P0 | Reject approval when status is in-progress | test.skip |
| AC2-P0-03 | P0 | Reject approval when status is draft | test.skip |
| AC2-P0-04 | P0 | Reject approval when status is changes-needed | test.skip |
| AC2-P0-05 | P0 | Do not change status when approval is rejected | test.skip |
| AC2-P1-01 | P1 | Format error message according to specification | test.skip |

**Coverage:** 6 tests covering all invalid status scenarios

### AC3: Gate Enforcement (Only /scrum-approve can set done)

| Test ID | Priority | Description | Status |
|---------|----------|-------------|--------|
| AC3-P0-01 | P0 | Block other commands from transitioning to done | test.skip |
| AC3-P0-02 | P0 | Allow /scrum-approve to transition to done | test.skip |
| AC3-P0-03 | P0 | Block transition to done from non-approved status | test.skip |
| AC3-P1-01 | P1 | Provide actionable error on gate violation | test.skip |

**Coverage:** 4 tests covering gate enforcement

### AC4: Write Boundary Compliance

| Test ID | Priority | Description | Status |
|---------|----------|-------------|--------|
| AC4-P0-01 | P0 | Only write allowed files | test.skip |
| AC4-P0-02 | P0 | Do not modify refinement.md | test.skip |
| AC4-P0-03 | P0 | Do not modify plan.md | test.skip |
| AC4-P0-04 | P0 | Do not modify source code files | test.skip |
| AC4-P0-05 | P0 | Do not modify review files | test.skip |
| AC4-P1-01 | P1 | Detect all write boundary violations | test.skip |

**Coverage:** 6 tests covering write boundary compliance

### Integration Tests

| Test ID | Priority | Description | Status |
|---------|----------|-------------|--------|
| INT-P1-01 | P1 | Complete full approval workflow successfully | test.skip |
| INT-P1-02 | P1 | Include review reference in approval artifact | test.skip |
| INT-P1-03 | P1 | Capture approval reasoning in artifact | test.skip |
| INT-P2-01 | P2 | Handle approval with minimal required options | test.skip |

**Coverage:** 4 integration tests

### Edge Cases

| Test ID | Priority | Description | Status |
|---------|----------|-------------|--------|
| EDGE-P2-01 | P2 | Handle missing story file gracefully | test.skip |
| EDGE-P2-02 | P2 | Handle legacy story without status_history | test.skip |
| EDGE-P2-03 | P2 | Reject approval of already done story | test.skip |
| EDGE-P2-04 | P2 | Handle special characters in reasoning | test.skip |

**Coverage:** 5 edge case tests (includes implicit validation test from AC4)

## Test Strategy Summary

### Test Levels

| Level | Count | Rationale |
|-------|-------|-----------|
| Unit | 26 | Pure function tests for utility functions |
| Integration | 4 | End-to-end approval workflow tests |
| Edge Case | 5 | Boundary conditions and error handling |

### Priority Distribution

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 21 | Critical path tests - must pass |
| P1 | 6 | Important quality tests |
| P2 | 4 | Edge cases and robustness tests |
| **Total** | **31** | (Note: Some tests span multiple categories) |

## Utility Functions to Implement

Based on the tests, these functions need to be implemented:

1. **executeScrumApprove(ticketId, options)** - Main command executor
2. **validateApprovalStatus(story)** - Status guard validation
3. **getNextApprovalNumber(outputDir)** - Sequential numbering
4. **createApprovalArtifact(ticketId, approvalData)** - Artifact generation
5. **transitionToDone(story, ticketId, approver)** - Status transition
6. **canTransitionToDone(fromStatus, trigger)** - Gate enforcement
7. **verifyWriteBoundaryCompliance(ticketId, modifiedFiles)** - Write boundary check

## Files Referenced

| File | Purpose |
|------|---------|
| `scrum_workflow/commands/approve.md` | Command specification (to be created) |
| `scrum_workflow/templates/approval.md` | Approval artifact template (exists) |
| `_scrum-output/sprints/SW-XXX/approval-N.md` | Generated approval artifacts |
| `_scrum-output/sprints/SW-XXX/story.md` | Story file with status updates |

## Next Steps (TDD Green Phase)

After implementing the feature:

1. **Remove `test.skip()` from all test files**
   ```bash
   # Replace test.skip with test in the test file
   sed -i '' 's/test\.skip(/test(/g' create-scrum-workflow/test/atdd/story-2-2-scrum-approve-command.test.js
   ```

2. **Run tests**
   ```bash
   cd create-scrum-workflow && npm test
   ```

3. **Verify tests PASS (green phase)**
   - All 35 tests should pass
   - Focus on P0 tests first (critical path)

4. **If any tests fail:**
   - Either fix implementation (feature bug)
   - Or fix test (test bug)

5. **Commit passing tests**
   ```bash
   git add create-scrum-workflow/test/atdd/story-2-2-scrum-approve-command.test.js
   git commit -m "test(story-2.2): ATDD green phase - all tests passing"
   ```

## Implementation Guidance

### Command Specification (Task 1)

Create `scrum_workflow/commands/approve.md`:
```yaml
---
name: approve
trigger: "/scrum-approve"
requires_status: approved
sets_status: done
---
```

### Key Implementation Points

1. **Status Guard**: Only allow approval when `status: approved`
2. **Artifact Generation**: Use template from `scrum_workflow/templates/approval.md`
3. **Sequential Numbering**: Check existing approval files for next number
4. **Status History**: Append entry with `trigger: /scrum-approve`, `actor: human`
5. **Write Boundary**: Only modify `approval-N.md` and status in `story.md`

### Error Message Format

```
Status Guard Violation: Story SW-XXX has status '{current_status}'

**Details:** The story must be in 'approved' status (post-review) before it can be marked as done.

**Next Step:** Run /scrum-review-story SW-XXX to complete the review process first.
```

## Risks and Assumptions

| Risk/Assumption | Mitigation |
|-----------------|------------|
| Assumes status_history exists from Story 2.1 | Legacy story handling included in tests |
| Sequential numbering may have race conditions | File-based locking or atomic operations |
| Write boundary enforcement is file-based | Consider future database migration |

## Checklist Verification

- [x] Prerequisites satisfied (story approved, test framework configured)
- [x] Test files created correctly (35 tests with test.skip)
- [x] Checklist matches acceptance criteria (4 ACs covered)
- [x] Tests are designed to fail before implementation (all use test.skip)
- [x] CLI sessions cleaned up (no browser automation used)
- [x] Temp artifacts stored in test-artifacts/ directory

## Completion Status

**Status:** COMPLETE

The ATDD red phase is complete. All failing tests have been generated and are ready for implementation.

**Generated Files:**
- `create-scrum-workflow/test/atdd/story-2-2-scrum-approve-command.test.js` (35 tests)
- `_bmad-output/test-artifacts/atdd-checklist-2-2.md` (this file)
