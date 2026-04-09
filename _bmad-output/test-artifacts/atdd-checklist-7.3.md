---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-09'
story_id: '7.3'
inputDocuments:
  - '_bmad-output/implementation-artifacts/7-3-implement-session-start-context-loading.md'
  - 'scrum_workflow/utils/risk-extraction.js'
  - 'scrum_workflow/utils/decision-extraction.js'
  - 'scrum_workflow/vitest.config.js'
  - '_bmad/tea/config.yaml'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-levels-framework.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/data-factories.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-quality.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-healing-patterns.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/ci-burn-in.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-priorities-matrix.md'
---

# ATDD Checklist: Story 7.3 — Implement Session Start & Context Loading

## Step 1: Preflight & Context

**Stack Detection:** `backend` — Pure Node.js/Markdown framework. No `playwright.config.ts`, no frontend build tooling. `test_stack_type: auto` resolved to `backend`.

**Prerequisites Check:**
- [x] Story 7.3 approved with clear acceptance criteria (status: ready-for-dev)
- [x] Test framework configured: `scrum_workflow/vitest.config.js` with `singleFork: true`
- [x] Development environment available
- [x] Prior art exists: `decision-extraction.js` (Story 7.1), `risk-extraction.js` (Story 7.2)

**Config:**
- `tea_use_playwright_utils: true` (ignored — backend-only stack)
- `tea_use_pactjs_utils: false`
- `tea_execution_mode: auto` → resolved to `sequential` (single agent)
- `test_stack_type: auto` → `backend`

**Knowledge fragments loaded:**
- Core: `data-factories.md`, `test-quality.md`, `test-healing-patterns.md`
- Backend: `test-levels-framework.md`, `test-priorities-matrix.md`, `ci-burn-in.md`

## Step 2: Generation Mode

**Mode selected:** AI generation (backend stack — no browser recording needed).

## Step 3: Test Strategy

### Acceptance Criteria → Test Scenarios

**AC1: Context Loading**
- Mapped to: `ac1-context-loading.test.js`
- Test type: Unit (pure functions: `parseFrontmatter`, `scanOpenStories`, `loadRecentDecisions`, `loadActiveRisks`) + Integration (file system with real temp dirs)
- Scope: YAML parsing, open story detection, decision loading, risk loading, graceful degradation

**AC2: Session Summary Format**
- Mapped to: `ac2-session-summary-format.test.js`
- Test type: Unit (pure functions: `deriveNextSteps`, `formatSessionSummary`)
- Scope: Status-to-action mapping, summary output structure, developer can identify next action

**AC3: Retrieval Performance (SC-13)**
- Mapped to: `ac3-retrieval-performance.test.js`
- Test type: Performance/Integration (100+ mock files with timing assertions)
- Scope: 5000ms budget (2x safety margin over 10s SC-13 requirement), correct results under load

### Test Level Assignments

| Test File | Level | Justification |
|-----------|-------|---------------|
| `ac1-context-loading.test.js` | Unit + Integration | Pure functions + file system I/O |
| `ac2-session-summary-format.test.js` | Unit | Pure transformation functions |
| `ac3-retrieval-performance.test.js` | Performance/Integration | Timing + 100+ artifacts |

### Priority Distribution

- **P0 tests:** 62 (critical — must pass for story acceptance)
- **P1 tests:** 24 (important — edge cases and graceful degradation)
- **P2 tests:** 3 (nice to have — structural/NFR compliance documentation)
- **P3 tests:** 0

## Step 4: Test Generation (Sequential Mode)

### TDD Red Phase Report

All 89 tests generated with `test.skip()` — TDD RED PHASE.

**Verification:** All 3 test files fail with `ERR_MODULE_NOT_FOUND: Cannot find module '../../utils/session-context.js'` — confirms tests are correctly in red phase (module not implemented yet).

### Generated Test Files

1. `scrum_workflow/__tests__/session-start/ac1-context-loading.test.js` — 40 tests
2. `scrum_workflow/__tests__/session-start/ac2-session-summary-format.test.js` — 29 tests
3. `scrum_workflow/__tests__/session-start/ac3-retrieval-performance.test.js` — 20 tests

## Step 4C: Aggregation

**TDD Compliance Verification:**
- [x] All 89 tests use `test.skip()` (verified by grep)
- [x] No placeholder assertions (`expect(true).toBe(true)`)
- [x] All tests assert EXPECTED behavior (real data and function contracts)
- [x] All 3 test files written to disk

**Acceptance Criteria Coverage:**

| AC | Tests | Coverage |
|----|-------|----------|
| AC1 (FR-27: loads open work, decisions, risks, next steps) | 40 | Full — all 4 context types tested |
| AC2 (SC-14: developer identifies next action in <60s) | 29 | Full — `deriveNextSteps` + `formatSessionSummary` tested |
| AC3 (SC-13: 100+ artifacts in <10s) | 20 | Full — 100/150 artifact stress tests with 5s budget |

**TDD Phase:** RED (all tests will fail until `session-context.js` is implemented)

## Step 5: Validation & Completion

### Checklist Verification

- [x] Prerequisites satisfied (story approved, framework configured, prior art loaded)
- [x] Test files created correctly (3 files, correct naming: `ac{N}-{description}.test.js`)
- [x] Checklist matches acceptance criteria (AC1, AC2, AC3 each have test file)
- [x] Tests designed to FAIL before implementation (`test.skip()` throughout)
- [x] Temp artifacts stored in `_bmad-output/test-artifacts/` (not random locations)
- [x] No orphaned CLI sessions (pure unit/integration tests — no browser)

### NFR Compliance Notes

- **NFR-2:** Tests import ONLY `node:fs` and `node:path` (no external test helpers beyond vitest)
- **NFR-3:** All test file I/O uses local `_test-output/` directories
- **NFR-9:** Test outputs are human-readable Markdown assertions (not binary)

### Key Risks / Assumptions

1. `parseFrontmatter()` in `session-context.js` must handle the YAML frontmatter format of story.md, DR-XXX.md, and RN-XXX.md — all three have slightly different field sets. Tests cover all three formats.
2. `scanOpenStories()` assumes `story.md` files are DIRECTLY inside `_scrum-output/sprints/{ticket}/` — not nested deeper. AC3 performance tests validate the flat-scan architecture (no recursive glob).
3. `loadRecentDecisions()` must sort by DR number (not by `created` date) per Dev Notes — tests enforce this.
4. Performance tests use 5000ms budget (not 10000ms) to account for test environment variance.

### Next Recommended Workflow

After implementing `scrum_workflow/utils/session-context.js`:
1. Remove `test.skip()` from all 89 tests
2. Run: `cd scrum_workflow && npx vitest run __tests__/session-start/`
3. Verify GREEN phase (all tests pass)
4. If any tests fail: fix implementation (not tests) — tests encode the spec

**Generated by:** bmad-testarch-atdd skill
**Story:** 7.3 — Implement Session Start & Context Loading
**Date:** 2026-04-09
**Mode:** YOLO (autonomous)
**Total Tests Generated:** 89 (all test.skip — TDD RED PHASE)
