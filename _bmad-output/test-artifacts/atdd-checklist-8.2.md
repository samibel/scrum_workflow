---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-09'
story_id: '8.2'
detected_stack: 'backend'
inputDocuments:
  - '_bmad-output/implementation-artifacts/8-2-implement-policy-violation-detection.md'
  - 'scrum_workflow/package.json'
  - '_bmad/tea/config.yaml'
  - 'resources/knowledge/data-factories.md'
  - 'resources/knowledge/test-quality.md'
  - 'resources/knowledge/test-levels-framework.md'
  - 'resources/knowledge/test-priorities-matrix.md'
  - 'resources/knowledge/test-healing-patterns.md'
---

# ATDD Checklist: Story 8.2 - Implement Policy Violation Detection

## 1. Preflight & Context Loading

- [x] Stack detected: `backend` (Node.js CLI)
- [x] Story context loaded: 8.2 - Implement Policy Violation Detection
- [x] Test framework verified: Vitest
- [x] Knowledge base fragments loaded:
    - data-factories.md
    - test-quality.md
    - test-levels-framework.md
    - test-priorities-matrix.md
    - test-healing-patterns.md

## 2. Story Analysis (Inputs)

- **Goal**: Implement `/scrum-policy-check` command to detect and block policy violations with actionable error messages.
- **Success Criteria**:
    - AC1: Detect at least 3 policy violation types (No plan, No verification, Skipped phase)
    - AC2: Produce actionable error messages following Architecture error format
    - AC3: Log violations for audit trail purposes
- **Constraints**:
    - Policy check runs retrospectively (not real-time guard)
    - Write boundaries respected (only audit log, NOT story.md)
    - Error format: `Policy Violation: {type}` with `**Details:**` and `**Next Step:**`

## 2. Generation Mode Selection

- Chosen Mode: **AI Generation**
- Rationale: Project is `backend` (CLI tool), and acceptance criteria are clear. No browser recording needed.

## 3. Test Strategy

- [x] **AC1: Command & Workflow Definition**: Verify existence of `policy-check.md` command and `policy-violation.md` workflow.
- [x] **AC2: Violation Type Detection**: Test all 3 violation types:
    - No plan: story in `in-progress`+ without `plan.md`
    - No verification: story in `review`+ without `verification-report.md`
    - Skipped phase: status_history shows invalid transition sequences
- [x] **AC3: Error Message Format**: Verify Architecture error format with `**Details:**` and `**Next Step:**`
- [x] **AC4: Audit Logging**: Verify violations logged to `_scrum-output/audit/SW-XXX-policy-violations.md`
- [x] **AC5: Write Boundaries**: Enforce strict boundary rules (only audit log, NOT story.md)

## 4. Test Generation (Failing Tests)

- [x] Created `tests/unit/policy-violation/policy-violation-detection.spec.ts`
- [x] Tests cover all ACs with P0/P1 priority
- [x] Pattern alignment with existing project tests (e.g., status-guard-validation, verification)

## 5. Validation & Finalization

- [x] Verified tests fail (RED phase) via `npm test` equivalent.
- [x] Verified no regressions in existing test runner.
- [x] Checklist finalized and ready for dev.
