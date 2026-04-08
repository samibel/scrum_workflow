---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-08'
workflowType: 'testarch-atdd'
inputDocuments:
  - '_bmad-output/implementation-artifacts/2-3-implement-rejection-flow.md'
  - '_bmad/tea/config.yaml'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/data-factories.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/component-tdd.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/test-quality.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/test-healing-patterns.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/test-levels-framework.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/test-priorities-matrix.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/ci-burn-in.md'
---

# ATDD Checklist - Epic 2, Story 3: Implement Rejection Flow

**Date:** 2026-04-08
**Author:** Sami
**Primary Test Level:** Integration / API

---

## Generation Mode

- **Mode:** AI Generation
- **Reason:** Project stack is `backend` (CLI tool). No browser recording required.

---

## Story Summary

As a developer, I want the system to support a rejection cycle where review findings are loaded as context for re-implementation, so that issues are caught, tracked, and addressed before delivery.

**As a** developer
**I want** a rejection cycle for review findings
**So that** issues are caught, tracked, and addressed before delivery.

---

## Acceptance Criteria

1. **Given** FR-6 specifies rejection flow: `review -> changes-needed -> in-progress` **When** a review verdict is `changes-needed` (FR-24) **Then** the story status transitions to `changes-needed` **And** a `status_history` entry is appended with the review agent as actor
2. **Given** a story in `changes-needed` status **When** a developer runs `/scrum-dev-story SW-XXX` **Then** the status transitions to `in-progress` **And** previous review findings (`review-N.md`) are loaded as context for the implementation agent **And** the implementation agent can see what specific issues were flagged
3. **Given** FR-24 specifies review verdict as `approved` or `changes-needed` **When** a review is completed **Then** the review artifact contains a clear verdict field: `approved` or `changes-needed` **And** both outcomes produce a persistent `review-N.md` artifact
4. **Given** a story has been re-implemented after `changes-needed` **When** the developer triggers a new review **Then** the previous review findings are available for comparison **And** the new review can verify whether previous findings were addressed

---

## Test Strategy (Step 3)

### Scenarios

| ID | Scenario | Level | Priority | Description |
|---|---|---|---|---|
| S1 | Review verdict `changes-needed` updates status | Integration | P0 | Call review service with `changes-needed`. Verify status becomes `changes-needed` and history is updated. |
| S2 | Dev starts story in `changes-needed` | Integration | P0 | Run `/scrum-dev-story` for `changes-needed` story. Verify transition to `in-progress` and review context loading. |
| S3 | Review artifact contains verdict | Integration | P1 | Generate review. Verify MD contains `verdict: approved|changes-needed`. |
| S4 | Multi-round review comparison | Integration | P2 | Start 2nd review. Verify 1st review is loaded as context. |

---

## Failing Tests Created (RED Phase)

### Integration Tests (8 tests)

**File:** `tests/unit/rejection-flow/rejection-flow.spec.ts`

- Test 1.1: Story status transitions to 'changes-needed' on rejection (P0)
- Test 1.2: status_history entry is appended with actor (P0)
- Test 2.1: status transitions from 'changes-needed' to 'in-progress' (P0)
- Test 2.2: previous review findings are loaded as context (P0)
- Test 3.1: review artifact template contains clear verdict field (P1)
- Test 3.2: both approved and changes-needed verdicts persist to review-N.md (P1)
- Test 4.1: previous review findings are available for comparison (P2)
- Test 4.2: new review can verify whether previous findings were addressed (P2)

---

## Data Factories Created

- Using existing `_scrum-output/sprints/SW-203/story.md` for status validation.
- Mocking review artifacts `review-N.md` for context loading tests.

---

## Next Steps

1. **Workflow Complete.**
2. Proceed to implementation phase.
3. Run tests during GREEN phase to verify implementation.

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **data-factories.md** - Factory patterns for test data generation
- **component-tdd.md** - TDD cycle for components/features
- **test-quality.md** - Test design principles
- **test-healing-patterns.md** - Resilience in testing
- **test-levels-framework.md** - Selection of appropriate test levels
- **test-priorities-matrix.md** - Risk-based prioritization
- **ci-burn-in.md** - Reliability in CI execution

---

**Generated by BMad TEA Agent** - 2026-04-08
