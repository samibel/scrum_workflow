---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy']
lastStep: 'step-03-test-strategy'
lastSaved: '2025-05-14'
workflowType: 'testarch-atdd'
inputDocuments:
  - _scrum-output/implementation-artifacts/2-4-implement-multi-round-review-tracking.md
  - scrum_workflow/config.yaml
  - scrum_workflow/package.json
  - .agents/skills/scrum-testarch-atdd/resources/knowledge/data-factories.md
  - .agents/skills/scrum-testarch-atdd/resources/knowledge/test-quality.md
  - .agents/skills/scrum-testarch-atdd/resources/knowledge/test-healing-patterns.md
  - .agents/skills/scrum-testarch-atdd/resources/knowledge/test-levels-framework.md
  - .agents/skills/scrum-testarch-atdd/resources/knowledge/test-priorities-matrix.md
  - .agents/skills/scrum-testarch-atdd/resources/knowledge/risk-governance.md
  - .agents/skills/scrum-testarch-atdd/resources/knowledge/error-handling.md
  - .agents/skills/scrum-testarch-atdd/resources/knowledge/ci-burn-in.md
---

# ATDD Checklist - Epic 2, Story 2.4: Implement Multi-Round Review Tracking

**Date:** 2025-05-14
**Author:** Gemini CLI
**Primary Test Level:** Integration / API (CLI Logic)

---

## Story Summary

Implement incremental numbering for review and approval artifacts (`review-1.md`, `review-2.md`, `approval-1.md`) to preserve full review history in `_scrum-output/sprints/SW-XXX/`. Ensure subsequent reviews have access to previous findings for comparison.

**As a** developer
**I want** multiple review rounds to be tracked with incremental artifact numbering
**So that** the full review history is preserved and each round is distinguishable.

---

## Acceptance Criteria & Test Scenarios

### AC 1: Incremental Review Artifact Numbering
- **Scenario 1.1 (P0):** First review for a story creates `review-1.md`.
- **Scenario 1.2 (P0):** Second review for the same story creates `review-2.md`.
- **Scenario 1.3 (P1):** Review artifacts are stored in the correct sprint-specific directory `_scrum-output/sprints/SW-XXX/`.

### AC 2: Non-destructive History & Context Access
- **Scenario 2.1 (P0):** Triggering a second review does NOT overwrite or delete `review-1.md`.
- **Scenario 2.2 (P1):** The review agent is provided with the content of `review-1.md` when performing the second review.

### AC 3: Incremental Approval Numbering & Referencing
- **Scenario 3.1 (P0):** First approval for a story creates `approval-1.md`.
- **Scenario 3.2 (P1):** The approval artifact includes a reference to the specific review round (e.g., `review_round: 2`) in its frontmatter.

### AC 4: Complete History Visibility
- **Scenario 4.1 (P2):** After multiple rounds, all artifacts (`review-1.md`, `review-2.md`, `approval-1.md`) are present and readable.
- **Scenario 4.2 (P2):** Artifacts are valid Markdown and follow the defined naming pattern.

---

## Test Level Mapping

| Scenario | Level | Priority | Reason |
|----------|-------|----------|--------|
| 1.1, 1.2, 1.3 | Integration | P0 | Core business logic for file naming and persistence. |
| 2.1 | Integration | P0 | Ensures no data loss during cycles. |
| 2.2 | Integration | P1 | Verifies context propagation to AI agents. |
| 3.1, 3.2 | Integration | P0 | Core logic for approval persistence. |
| 4.1, 4.2 | Integration | P2 | Verification of final state and formatting. |

---

## Failing Tests Created (RED Phase)

### E2E Tests (0 tests)
*Not applicable for this backend CLI logic story.*

### Integration / API Tests (4 tests)

**File:** `scrum_workflow/__tests__/integration/multi-round-review.test.ts` (Planned)

- ⏳ **Test:** should create review-1.md on first review
  - **Status:** RED - Not implemented
  - **Verifies:** Sequential numbering starts at 1 and creates a new file.
- ⏳ **Test:** should create review-2.md without overwriting review-1.md
  - **Status:** RED - Not implemented
  - **Verifies:** Incremental logic correctly detects existing files and preserves history.
- ⏳ **Test:** should provide previous review findings as context
  - **Status:** RED - Not implemented
  - **Verifies:** Review agent receives content of review-1.md when generating review-2.md.
- ⏳ **Test:** should create approval-1.md referencing the correct review round
  - **Status:** RED - Not implemented
  - **Verifies:** Approvals are also numbered and linked to their preceding review.

### Component Tests (0 tests)
*Not applicable for this backend CLI logic story.*

---

## Data Factories Created

### Story Artifact Factory

**File:** `scrum_workflow/__tests__/factories/artifact.factory.ts` (Planned)

**Exports:**

- `createReviewArtifact(overrides?)` - Create a mock review artifact file
- `createApprovalArtifact(overrides?)` - Create a mock approval artifact file

---

## Fixtures Created

### Sprint Context Fixtures

**File:** `scrum_workflow/__tests__/fixtures/sprint.fixture.ts` (Planned)

**Fixtures:**

- `temporarySprintDir` - Provides a clean `_scrum-output/sprints/SW-TEST` directory for each test
  - **Setup:** Creates the directory structure
  - **Provides:** Path to the temporary sprint directory
  - **Cleanup:** Deletes the temporary directory

---

## Mock Requirements

### Review Agent Mock
**Service:** Internal Review Logic
**Mock Requirement:** Capture the context passed to the review agent to verify `review-1.md` content is included.

---

## Required data-testid Attributes
*Not applicable for backend CLI logic.*

---

## Implementation Checklist

### Test: should create review-1.md on first review
**File:** `scrum_workflow/__tests__/integration/multi-round-review.test.ts`
**Tasks to make this test pass:**
- [ ] Implement `ArtifactManager.getNextReviewPath(storyId)`
- [ ] Update `ReviewCommand` to use `ArtifactManager` for file naming
- [ ] Run test: `npm test scrum_workflow/__tests__/integration/multi-round-review.test.ts`
- [ ] ✅ Test passes (green phase)
**Estimated Effort:** 1 hour

### Test: should create review-2.md without overwriting review-1.md
**File:** `scrum_workflow/__tests__/integration/multi-round-review.test.ts`
**Tasks to make this test pass:**
- [ ] Refine `ArtifactManager` regex to correctly parse `review-(\d+).md`
- [ ] Ensure `ArtifactManager` finds the highest N and returns N+1
- [ ] Run test: `npm test scrum_workflow/__tests__/integration/multi-round-review.test.ts`
- [ ] ✅ Test passes (green phase)
**Estimated Effort:** 1 hour

---

## Running Tests

```bash
# Run all tests
npm test

# Run specific integration test
npm test scrum_workflow/__tests__/integration/multi-round-review.test.ts
```

---

## Red-Green-Refactor Workflow
*(Standard Process - See template for details)*

---

## Knowledge Base References Applied
- **data-factories.md**
- **test-quality.md**
- **test-levels-framework.md**
- **test-priorities-matrix.md**

---

## Test Execution Evidence
*To be populated after test creation.*

---

## Notes
- Focus on `ArtifactManager` utility as the core of this implementation.
- Ensure file system operations are mocked or use a safe temporary directory.

---

**Generated by Scrum Workflow TEA Agent** - 2025-05-14
