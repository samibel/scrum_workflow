---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests (TDD red phase)
  - step-04c-aggregate
  - step-05-validate-and-complete

lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-08T00:00:00Z'
story_id: '2-4'
story_name: 'Implement Multi-Round Review Tracking'
execution_mode: 'sequential'
detected_stack: 'backend'
---

# ATDD Checklist: Story 2.4 - Multi-Round Review Tracking

## TDD Red Phase (Current)

**Status**: FAILING (TDD Red Phase - Expected)

All tests generated with `test.skip()` - they will fail until the feature is implemented.

## Acceptance Criteria Coverage

| AC # | Description | Test Coverage | Status |
|------|-------------|---------------|--------|
| AC1 | Sequential review numbering (`review-1.md`, `review-2.md`, etc.) | TC-01, TC-02, TC-08, TC-09 | Covered |
| AC2 | Previous reviews preserved, review agent has access to previous findings | TC-02, TC-03 | Covered |
| AC3 | Sequential approval numbering with `based_on_review` reference | TC-04, TC-05, TC-10 | Covered |
| AC4 | Complete review history, human-readable/diffable artifacts | TC-06, TC-07 | Covered |

## Test Summary

- **Total Tests**: 10
- **API/Unit Tests**: 10 (backend-focused)
- **E2E Tests**: 0 (not applicable for backend)
- **All tests**: Marked with `test.skip()` (TDD red phase)

## Generated Test Files

| File | Description | Tests |
|------|-------------|-------|
| `scrum_workflow/__tests__/multi-round-review/multi-round-review-tracking.test.md` | Main ATDD test file | 10 |

## Test Cases by Priority

### P1 - Critical (Must Pass)

| Test ID | Description | AC Coverage |
|---------|-------------|-------------|
| TC-01 | First review creates review-1.md | AC1 |
| TC-02 | Second review creates review-2.md (not overwriting) | AC1, AC2 |
| TC-04 | First approval creates approval-1.md | AC3 |
| TC-05 | Approval references correct review round | AC3 |
| TC-06 | Complete review history preservation | AC4 |

### P2 - Important

| Test ID | Description | AC Coverage |
|---------|-------------|-------------|
| TC-03 | Review agent has access to previous review findings | AC2 |
| TC-07 | Artifacts are human-readable Markdown | AC4 |
| TC-08 | Sequential numbering never skips | AC1 |

### P3 - Helper Functions

| Test ID | Description | AC Coverage |
|---------|-------------|-------------|
| TC-09 | getNextReviewNumber function | AC1 |
| TC-10 | getNextApprovalNumber function | AC3 |

## Input Documents

- Story file: `_scrum-output/implementation-artifacts/2-4-implement-multi-round-review-tracking.md`
- Sprint status: `_scrum-output/implementation-artifacts/sprint-status.yaml`
- Review command: `scrum_workflow/commands/review-story.md`
- Review workflow: `scrum_workflow/workflows/review-story.md`
- Review template: `scrum_workflow/templates/review.md`

## Implementation Guidance

### Files to Modify

1. **`scrum_workflow/commands/review-story.md`**
   - Add `getNextReviewNumber()` function
   - Update review artifact creation to use sequential numbering

2. **`scrum_workflow/commands/approve.md`** (to be created or updated)
   - Add `getNextApprovalNumber()` function
   - Update approval artifact creation to use sequential numbering
   - Add `based_on_review` field

3. **`scrum_workflow/workflows/review-story.md`**
   - Add step to load previous reviews
   - Pass previous findings to review agent context

4. **`scrum_workflow/templates/review.md`**
   - Add `review_round: N` field

5. **`scrum_workflow/templates/approval.md`** (to be created or updated)
   - Add `approval_round: N` field
   - Add `based_on_review: N` field

### Key Implementation Logic

```javascript
// Pseudocode for getNextReviewNumber
function getNextReviewNumber(sprintFolder) {
  const existingReviews = glob(`${sprintFolder}/review-*.md`);
  if (!existingReviews.length) return 1;

  const numbers = existingReviews
    .map(f => parseInt(f.match(/review-(\d+)\.md$/)[1], 10));
  return Math.max(...numbers) + 1;
}

// Similar for getNextApprovalNumber
function getNextApprovalNumber(sprintFolder) {
  const existingApprovals = glob(`${sprintFolder}/approval-*.md`);
  if (!existingApprovals.length) return 1;

  const numbers = existingApprovals
    .map(f => parseInt(f.match(/approval-(\d+)\.md$/)[1], 10));
  return Math.max(...numbers) + 1;
}
```

### Write Boundary Rules (Critical)

| May Write | May NOT Write |
|-----------|---------------|
| `review-N.md` (new files only) | Previous `review-N.md` files (read-only) |
| `approval-N.md` (new files only) | Previous `approval-N.md` files (read-only) |
| Status in `story.md` | `refinement.md`, `plan.md` |

## Next Steps (TDD Green Phase)

After implementing the feature:

1. Remove `test.skip()` from all test files
2. Run tests: `npx vitest run scrum_workflow/__tests__/multi-round-review/`
3. Verify tests PASS (green phase)
4. If any tests fail:
   - Either fix implementation (feature bug)
   - Or fix test (test bug)
5. Commit passing tests

## Validation Checklist

- [x] Prerequisites satisfied (story has clear acceptance criteria)
- [x] Test files created correctly
- [x] Checklist matches acceptance criteria (all 4 ACs covered)
- [x] Tests are designed to fail before implementation (all use test.skip())
- [x] All tests are in markdown format (project convention)
- [x] No duplicate coverage across test cases

## Performance Metrics

- Execution Mode: Sequential (backend project)
- Test Generation: Single agent
- Total Tests Generated: 10
- Estimated Implementation Time: 1-2 hours

---

*Generated by scrum-testarch-atdd workflow on 2026-04-08*
