---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-09'
story_id: '8.1'
detected_stack: 'backend'
inputDocuments:
  - '_scrum-output/implementation-artifacts/8-1-implement-post-implementation-verification.md'
  - 'scrum_workflow/package.json'
  - '_scrum-output/tea/config.yaml'
  - 'resources/knowledge/data-factories.md'
  - 'resources/knowledge/test-quality.md'
  - 'resources/knowledge/test-levels-framework.md'
  - 'resources/knowledge/test-priorities-matrix.md'
  - 'resources/knowledge/test-healing-patterns.md'
---

# ATDD Checklist: Story 8.1 - Implement Post-Implementation Verification

## 1. Preflight & Context Loading

- [x] Stack detected: `backend` (Node.js CLI)
- [x] Story context loaded: 8.1 - Implement Post-Implementation Verification
- [x] Test framework verified: Vitest
- [x] Knowledge base fragments loaded:
    - data-factories.md
    - test-quality.md
    - test-levels-framework.md
    - test-priorities-matrix.md
    - test-healing-patterns.md

## 2. Story Analysis (Inputs)

- **Goal**: Implement `/scrum-verify` command to run automated checks (test, lint, build) and generate a report.
- **Success Criteria**:
    - Command execution triggers checks.
    - `verification-report.md` generated with results.
    - Status transitions to `review` on success, stays `in-progress` on failure.
    - Write boundaries respected (only report and story status updated).
- **Constraints**:
    - Must use Vitest for tests.
    - Must update `status_history`.
    - Must use Architecture error format for failures.

## 2. Generation Mode Selection

- Chosen Mode: **AI Generation**
- Rationale: Project is `backend` (CLI tool), and acceptance criteria are clear. No browser recording needed.

## 3. Test Strategy

- [x] **AC1: Command & Workflow Definition**: Verify existence of `verify.md`, `verification.md`, and `verification-report.md` template.
- [x] **AC2: Status Guards**: Ensure command only runs on `in-progress` stories.
- [x] **AC3: PASS Flow**: Verify report content (timestamp, coverage, results) and transition to `review`.
- [x] **AC4: FAIL Flow**: Verify actionable guidance in report and status remains `in-progress`.
- [x] **AC5: Write Boundaries**: Enforce strict boundary rules (only report and story.md).

## 4. Test Generation (Failing Tests)

- [x] Created `tests/unit/verification/verification-flow.spec.ts`
- [x] Tests cover all ACs with P0/P1 priority
- [x] Pattern alignment with existing project tests (e.g., status-guard-validation)

## 5. Validation & Finalization

- [x] Verified tests fail (RED phase) via `npm test` equivalent.
- [x] Verified no regressions in existing test runner.
- [x] Checklist finalized and ready for dev.
