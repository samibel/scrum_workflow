---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-09'
story_id: '8.5'
detected_stack: 'backend'
inputDocuments:
  - '_scrum-output/implementation-artifacts/8-5-implement-delivery-health-command.md'
  - 'scrum_workflow/package.json'
  - '_scrum-output/tea/config.yaml'
  - 'resources/knowledge/data-factories.md'
  - 'resources/knowledge/test-quality.md'
  - 'resources/knowledge/test-levels-framework.md'
  - 'resources/knowledge/test-priorities-matrix.md'
  - 'resources/knowledge/test-healing-patterns.md'
---

# ATDD Checklist: Story 8.5 - Implement Delivery Health Command

## 1. Preflight & Context Loading

- [x] Stack detected: `backend` (Node.js CLI)
- [x] Story context loaded: 8.5 - Implement Delivery Health Command
- [x] Test framework verified: Vitest
- [x] Knowledge base fragments loaded:
    - data-factories.md
    - test-quality.md
    - test-levels-framework.md
    - test-priorities-matrix.md
    - test-healing-patterns.md

## 2. Story Analysis (Inputs)

- **Goal**: Implement `/delivery-health` command to show policy violations, open risks, and pending approvals
- **Success Criteria**:
    - AC1: Command aggregates data from audit trails, risk notes, and approved stories
    - AC2: Policy violations displayed with severity, affected story, and recommended action
    - AC3: Open risks summarized with affected areas and mitigation status
    - AC4: Stories in `approved` status listed as pending approvals
    - AC5: Positive health status when all categories are empty
- **Constraints**:
    - Must use Vitest for tests
    - Read-only command (only reads, no writes)
    - Must respect UX-DR6 (semantic color system)
    - Must respect UX-DR7 (emoji prefixes)
    - Data Sources:
      - `_scrum-output/audit/` - policy violations from Story 8.2
      - `_scrum-output/memory/risks/` - open risk notes (RN-XXX.md)
      - `_scrum-output/sprints/SW-XXX/story.md` - stories with `approved` status

## 2. Generation Mode Selection

- Chosen Mode: **AI Generation**
- Rationale: Project is `backend` (CLI tool), and acceptance criteria are clear. No browser recording needed.

## 3. Test Strategy

- [x] **AC1: Command & Workflow Definition**: Verify `/delivery-health` scans all 3 data sources
- [x] **AC1: Data Aggregation**: Verify utility aggregates and deduplicates findings
- [x] **AC2: Policy Violations Display**: Verify severity, story, action shown per violation
- [x] **AC3: Risk Notes Aggregation**: Verify open risks filtered and displayed with severity, area, mitigation
- [x] **AC4: Pending Approvals**: Verify stories in `approved` status listed
- [x] **AC5: Healthy State**: Verify positive message when all categories are empty
- [x] **UX-DR6 Compliance**: Verify semantic color system (violations=red, risks=yellow, pending=cyan, healthy=green)
- [x] **UX-DR7 Compliance**: Verify emoji prefixes (✓ success, ⚠ warning, ❌ error, ℹ info)

## 4. Test Generation (Failing Tests)

- [x] Created `tests/unit/delivery-health/ac1-delivery-health-command.spec.ts`
    - Command & workflow definition tests
    - Data aggregation sources tests
    - Health report output structure tests
- [x] Created `tests/unit/delivery-health/ac2-policy-violation-display.spec.ts`
    - Policy violation detection integration tests
    - Severity classification tests (critical/major/minor)
    - Violation display format tests
- [x] Created `tests/unit/delivery-health/ac3-risk-notes-aggregation.spec.ts`
    - Risk notes aggregation tests
    - Risk note format compliance tests
    - Risk display format tests
- [x] Created `tests/unit/delivery-health/ac4-pending-approvals.spec.ts`
    - Pending approvals detection tests
    - Pending approvals display format tests
    - Healthy state display tests
    - Health report summary header tests
- [x] Tests cover all ACs with P0/P1 priority
- [x] Pattern alignment with existing project tests (e.g., audit-trail, policy-violation, sprint-status)

## 5. Validation & Finalization

- [x] Verified tests use `test.skip()` (RED phase - will fail until feature implemented)
- [x] Verified no regressions in existing test runner configuration
- [x] Checklist finalized and ready for dev.

## Test File Summary

| File | ACs Covered | Priority |
|------|-------------|----------|
| `ac1-delivery-health-command.spec.ts` | AC1 | P0, P1 |
| `ac2-policy-violation-display.spec.ts` | AC2 | P0, P1 |
| `ac3-risk-notes-aggregation.spec.ts` | AC3 | P0, P1 |
| `ac4-pending-approvals.spec.ts` | AC4, AC5 | P0, P1 |

## Notes

- **TDD Phase**: RED (tests written before implementation)
- **All tests use `test.skip()`** to indicate they will fail until the feature is implemented
- **Color Coding per UX-DR6**: violations=red, risks=yellow, pending=cyan, healthy=green
- **Emoji per UX-DR7**: ✓ success, ⚠ warning, ❌ error, ℹ info
- **Data Sources**: Audit trail, Risk notes, Approved stories (read-only)
- **Execution**: Story 8.5 is on branch `story_8`
