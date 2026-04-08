# Multi-Round Review Tracking - Acceptance Tests

**Test Type**: ATDD Failing Acceptance Tests (TDD Red Phase)
**Story**: 2.4 Implement Multi-Round Review Tracking
**Date**: 2026-04-08
**Status**: FAILING (TDD Red Phase - Expected)

---

## Test Objective

Validate that the Multi-Round Review Tracking feature correctly:
1. Numbers review artifacts sequentially (review-1.md, review-2.md, etc.)
2. Preserves previous review files when new reviews are created
3. Numbers approval artifacts sequentially (approval-1.md, etc.)
4. Links approval artifacts to their corresponding review round

---

## Acceptance Criteria Under Test

From Story 2.4:

1. **AC1**: Review artifacts are numbered sequentially: `review-1.md`, `review-2.md`, `review-3.md`, etc. Each artifact is a separate file in `_scrum-output/sprints/SW-XXX/`

2. **AC2**: After a story goes through the cycle: review -> changes-needed -> in-progress -> review, the second review creates `review-2.md` (not overwriting `review-1.md`). The review agent has access to `review-1.md` findings for comparison.

3. **AC3**: Approval artifacts are also numbered sequentially: `approval-1.md`. The approval artifact references the review round that led to approval.

4. **AC4**: Multiple review-rejection cycles result in complete review history visible: `review-1.md`, `review-2.md`, ..., `approval-1.md`. Each artifact is human-readable, diffable, and Git-versionable.

---

## Test Cases

### TC-01: First Review Creates review-1.md

**Description**: Verify that the first review creates `review-1.md` with correct naming.

**Preconditions**:
- Clean state: No existing `review-*.md` files in sprint folder
- Story status is `review`
- Review command invoked: `/scrum-review-story SW-001`

**Steps**:
1. Invoke `/scrum-review-story SW-001`
2. Check for existence of `_scrum-output/sprints/SW-001/review-1.md`

**Expected Result**:
```yaml
---
schema_version: 1.0.0
ticket: SW-001
review_date: 2026-04-08T10:00:00Z
reviewer: review-agent
review_round: 1
verdict: approved | changes-needed
---
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-01: First review creates review-1.md', async () => {
  const reviewFile = '_scrum-output/sprints/SW-001/review-1.md';
  await expect(fs.exists(reviewFile)).resolves.toBe(true);

  const content = await fs.readFile(reviewFile, 'utf8');
  const frontmatter = parseYamlFrontmatter(content);

  expect(frontmatter.review_round).toBe(1);
  expect(frontmatter.ticket).toBe('SW-001');
  expect(frontmatter.schema_version).toBe('1.0.0');
  expect(['approved', 'changes-needed']).toContain(frontmatter.verdict);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-02: Second Review Creates review-2.md (Not Overwriting)

**Description**: Verify that after a changes-needed cycle, the second review creates `review-2.md` without overwriting `review-1.md`.

**Preconditions**:
- `review-1.md` exists with verdict: changes-needed
- Story went through: review -> changes-needed -> in-progress -> review
- Review command invoked again: `/scrum-review-story SW-001`

**Steps**:
1. Verify `review-1.md` exists
2. Invoke second `/scrum-review-story SW-001`
3. Verify `review-2.md` is created
4. Verify `review-1.md` still exists and is unchanged

**Expected Result**:
```
_scurm-output/sprints/SW-001/
  ├── review-1.md   (unchanged)
  └── review-2.md   (new file)
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-02: Second review creates review-2.md (not overwriting review-1.md)', async () => {
  // Setup: First review exists
  await createReview('SW-001', 1, 'changes-needed');

  // Verify review-1.md exists
  const review1Path = '_scrum-output/sprints/SW-001/review-1.md';
  await expect(fs.exists(review1Path)).resolves.toBe(true);
  const review1Content = await fs.readFile(review1Path, 'utf8');

  // Simulate second review
  await runSecondReview('SW-001');

  // Verify review-2.md created
  const review2Path = '_scrum-output/sprints/SW-001/review-2.md';
  await expect(fs.exists(review2Path)).resolves.toBe(true);

  // Verify review-1.md unchanged
  const review1ContentAfter = await fs.readFile(review1Path, 'utf8');
  expect(review1ContentAfter).toBe(review1Content);

  // Verify review-2.md has correct round number
  const review2Frontmatter = parseYamlFrontmatter(await fs.readFile(review2Path, 'utf8'));
  expect(review2Frontmatter.review_round).toBe(2);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-03: Review Agent Has Access to Previous Review Findings

**Description**: Verify that when running a second review, the review agent receives findings from `review-1.md` for comparison.

**Preconditions**:
- `review-1.md` exists with specific findings
- Second review is being triggered

**Steps**:
1. Create `review-1.md` with specific findings
2. Trigger second review
3. Verify the review context includes previous findings

**Expected Result**:
The review agent context should include:
- Contents of `review-1.md`
- Previous findings for comparison
- Ability to verify if issues from round 1 were resolved

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-03: Review agent has access to previous review findings', async () => {
  // Setup: Create review-1.md with specific findings
  const findings = [
    { severity: 'major', description: 'Missing error handling in X function' },
    { severity: 'minor', description: 'Variable naming inconsistent' }
  ];
  await createReview('SW-001', 1, 'changes-needed', findings);

  // Trigger second review and capture context
  const reviewContext = await getReviewContext('SW-001');

  // Verify previous review is loaded
  expect(reviewContext.previousReviews).toBeDefined();
  expect(reviewContext.previousReviews.length).toBe(1);
  expect(reviewContext.previousReviews[0].review_round).toBe(1);
  expect(reviewContext.previousReviews[0].findings).toEqual(findings);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-04: First Approval Creates approval-1.md

**Description**: Verify that `/scrum-approve` creates `approval-1.md` with correct numbering.

**Preconditions**:
- `review-1.md` exists with verdict: approved
- Story status is `approved`
- Approval command invoked: `/scrum-approve SW-001`

**Steps**:
1. Create `review-1.md` with approved verdict
2. Invoke `/scrum-approve SW-001`
3. Check for existence of `_scrum-output/sprints/SW-001/approval-1.md`

**Expected Result**:
```yaml
---
schema_version: 1.0.0
ticket: SW-001
approval_date: 2026-04-08T10:00:00Z
approver: human
approval_round: 1
based_on_review: 1
---
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-04: First approval creates approval-1.md', async () => {
  // Setup: Create approved review
  await createReview('SW-001', 1, 'approved');

  // Run approval
  await runApproval('SW-001');

  // Verify approval-1.md created
  const approvalPath = '_scrum-output/sprints/SW-001/approval-1.md';
  await expect(fs.exists(approvalPath)).resolves.toBe(true);

  const content = await fs.readFile(approvalPath, 'utf8');
  const frontmatter = parseYamlFrontmatter(content);

  expect(frontmatter.approval_round).toBe(1);
  expect(frontmatter.based_on_review).toBe(1);
  expect(frontmatter.ticket).toBe('SW-001');
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-05: Approval References Correct Review Round

**Description**: Verify that the approval artifact references the review round that led to approval.

**Preconditions**:
- Multiple reviews exist (review-1.md, review-2.md)
- review-2.md has verdict: approved
- Approval is triggered

**Steps**:
1. Create review-1.md (changes-needed)
2. Create review-2.md (approved)
3. Run approval
4. Verify `based_on_review` field references review-2

**Expected Result**:
```yaml
---
approval_round: 1
based_on_review: 2  # References the review that led to approval
---
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-05: Approval references correct review round', async () => {
  // Setup: Multiple reviews
  await createReview('SW-001', 1, 'changes-needed');
  await createReview('SW-001', 2, 'approved');

  // Run approval
  await runApproval('SW-001');

  // Verify based_on_review references review-2
  const approvalPath = '_scrum-output/sprints/SW-001/approval-1.md';
  const content = await fs.readFile(approvalPath, 'utf8');
  const frontmatter = parseYamlFrontmatter(content);

  expect(frontmatter.based_on_review).toBe(2);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-06: Complete Review History Preservation

**Description**: Verify that multiple review-rejection cycles result in complete review history.

**Preconditions**:
- Story went through: review-1 -> changes-needed -> review-2 -> changes-needed -> review-3 -> approval

**Steps**:
1. Create review-1.md (changes-needed)
2. Create review-2.md (changes-needed)
3. Create review-3.md (approved)
4. Create approval-1.md
5. Verify all files exist and are readable

**Expected Result**:
```
_scurm-output/sprints/SW-001/
  ├── review-1.md   (preserved)
  ├── review-2.md   (preserved)
  ├── review-3.md   (preserved)
  └── approval-1.md (references review-3)
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-06: Complete review history preservation', async () => {
  // Setup: Multiple review cycles
  await createReview('SW-001', 1, 'changes-needed');
  await createReview('SW-001', 2, 'changes-needed');
  await createReview('SW-001', 3, 'approved');
  await runApproval('SW-001');

  // Verify all files exist
  await expect(fs.exists('_scrum-output/sprints/SW-001/review-1.md')).resolves.toBe(true);
  await expect(fs.exists('_scrum-output/sprints/SW-001/review-2.md')).resolves.toBe(true);
  await expect(fs.exists('_scrum-output/sprints/SW-001/review-3.md')).resolves.toBe(true);
  await expect(fs.exists('_scrum-output/sprints/SW-001/approval-1.md')).resolves.toBe(true);

  // Verify approval references review-3
  const approval = parseYamlFrontmatter(
    await fs.readFile('_scrum-output/sprints/SW-001/approval-1.md', 'utf8')
  );
  expect(approval.based_on_review).toBe(3);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-07: Artifacts Are Human-Readable Markdown

**Description**: Verify that all review and approval artifacts are human-readable Markdown, diffable, and Git-versionable.

**Preconditions**:
- Review and approval artifacts exist

**Steps**:
1. Read review-1.md
2. Verify it's valid Markdown with YAML frontmatter
3. Verify it's multi-line (diffable)
4. Verify it contains readable content

**Expected Result**:
- Valid YAML frontmatter at the top
- Markdown body with findings
- Multi-line format (Git-diffable)

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-07: Artifacts are human-readable Markdown', async () => {
  await createReview('SW-001', 1, 'changes-needed', [
    { severity: 'major', description: 'Test finding' }
  ]);

  const content = await fs.readFile('_scrum-output/sprints/SW-001/review-1.md', 'utf8');

  // Verify YAML frontmatter
  expect(content).toMatch(/^---\n/);
  expect(content).toMatch(/---\n/);

  // Verify multi-line (diffable)
  expect(content).toContain('\n');

  // Verify human-readable content
  expect(content).toContain('verdict:');
  expect(content).toContain('review_round:');
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-08: Sequential Numbering Never Skips

**Description**: Verify that review numbering is always sequential and never skips numbers.

**Preconditions**:
- No reviews exist

**Steps**:
1. Create first review -> should be review-1.md
2. Create second review -> should be review-2.md
3. Verify no review-0.md or review-3.md was created

**Expected Result**:
- First review: review-1.md (not review-0.md)
- Second review: review-2.md (not review-3.md)

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-08: Sequential numbering never skips', async () => {
  // First review
  await createReview('SW-001', 1, 'changes-needed');

  // Verify only review-1.md exists
  const files = await fs.readdir('_scrum-output/sprints/SW-001');
  const reviewFiles = files.filter(f => f.match(/^review-\d+\.md$/));
  expect(reviewFiles).toEqual(['review-1.md']);

  // Second review
  await createReview('SW-001', 2, 'approved');

  // Verify only review-1.md and review-2.md exist
  const filesAfter = await fs.readdir('_scrum-output/sprints/SW-001');
  const reviewFilesAfter = filesAfter.filter(f => f.match(/^review-\d+\.md$/));
  expect(reviewFilesAfter.sort()).toEqual(['review-1.md', 'review-2.md']);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-09: Get Next Review Number Function

**Description**: Verify the helper function correctly determines the next review number.

**Preconditions**:
- Various states of existing reviews

**Steps**:
1. Test with no existing reviews -> should return 1
2. Test with review-1.md -> should return 2
3. Test with review-1.md, review-2.md -> should return 3

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-09: getNextReviewNumber returns correct values', async () => {
  const { getNextReviewNumber } = await import('../../commands/review-story.js');

  // No reviews -> should return 1
  fs.emptyDirSync('_scrum-output/sprints/SW-001');
  expect(getNextReviewNumber('_scrum-output/sprints/SW-001')).toBe(1);

  // review-1.md exists -> should return 2
  fs.writeFileSync('_scrum-output/sprints/SW-001/review-1.md', '');
  expect(getNextReviewNumber('_scrum-output/sprints/SW-001')).toBe(2);

  // review-1.md and review-2.md exist -> should return 3
  fs.writeFileSync('_scrum-output/sprints/SW-001/review-2.md', '');
  expect(getNextReviewNumber('_scrum-output/sprints/SW-001')).toBe(3);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-10: Get Next Approval Number Function

**Description**: Verify the helper function correctly determines the next approval number.

**Preconditions**:
- Various states of existing approvals

**Steps**:
1. Test with no existing approvals -> should return 1
2. Test with approval-1.md -> should return 2

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-10: getNextApprovalNumber returns correct values', async () => {
  const { getNextApprovalNumber } = await import('../../commands/approve.js');

  // No approvals -> should return 1
  fs.emptyDirSync('_scrum-output/sprints/SW-001');
  expect(getNextApprovalNumber('_scrum-output/sprints/SW-001')).toBe(1);

  // approval-1.md exists -> should return 2
  fs.writeFileSync('_scrum-output/sprints/SW-001/approval-1.md', '');
  expect(getNextApprovalNumber('_scrum-output/sprints/SW-001')).toBe(2);
});
```

**Status**: FAILING (TDD Red Phase)

---

## ATDD Checklist

| AC # | Description | Test Case | Status |
|------|-------------|-----------|--------|
| AC1 | Sequential review numbering (review-1.md, review-2.md, etc.) | TC-01, TC-02, TC-08, TC-09 | FAILING (Red) |
| AC2 | Previous reviews preserved, review agent has access | TC-02, TC-03 | FAILING (Red) |
| AC3 | Sequential approval numbering with review reference | TC-04, TC-05, TC-10 | FAILING (Red) |
| AC4 | Complete review history, human-readable artifacts | TC-06, TC-07 | FAILING (Red) |

---

## Implementation Notes

1. **Review Numbering Pattern**: `review-{N}.md` where N starts at 1
2. **Approval Numbering Pattern**: `approval-{N}.md` where N starts at 1
3. **Approval-Review Linking**: Approval artifact must include `based_on_review` field
4. **Write Boundaries**: New files only, never overwrite existing

---

## TDD Red Phase Summary

All tests in this file are marked with `test.skip()` indicating they are failing tests in the TDD red phase. These tests define the expected behavior for the Multi-Round Review Tracking feature (Story 2.4).

**Next Steps (TDD Green Phase)**:
1. Implement `getNextReviewNumber()` function in review-story.md
2. Implement `getNextApprovalNumber()` function in approve.md
3. Add `review_round` field to review template
4. Add `approval_round` and `based_on_review` fields to approval template
5. Implement previous review loading in review workflow

**Run Tests**: `npx vitest run scrum_workflow/__tests__/multi-round-review/`
