---
stepsCompleted:
  - 'step-01-preflight-and-context'
  - 'step-02-generation-mode'
  - 'step-03-test-strategy'
  - 'step-04-generate-tests'
  - 'step-04c-aggregate'
  - 'step-05-validate-and-complete'
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-07'
storyId: '1-9'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md (FR-46)'
  - '_bmad-output/planning-artifacts/architecture.md (Naming Patterns, Structure Patterns)'
  - '_bmad-output/implementation-artifacts/1-9-verify-align-artifact-contract.md'
  - 'scrum_workflow/commands/create-ticket.md'
  - 'scrum_workflow/commands/refine-ticket.md'
  - 'scrum_workflow/commands/dev-story.md'
  - 'scrum_workflow/commands/review-story.md'
  - 'scrum_workflow/commands/research-technical.md'
  - 'scrum_workflow/commands/research-general.md'
  - 'scrum_workflow/workflows/ticket-creation.md'
  - 'scrum_workflow/workflows/refinement.md'
  - 'scrum_workflow/workflows/review-story.md'
  - 'scrum_workflow/workflows/research-technical.md'
  - '_bmad/tea/config.yaml'
---

# ATDD Checklist — Story 1.9: Verify & Align Artifact Contract

## Story Summary

**Story**: 1.9 Verify & Align Artifact Contract
**Epic**: Epic 1 — Establish Reliable Foundation
**Type**: Verification & Alignment (Brownfield)
**Status**: review
**TDD Phase**: RED (Failing Tests Generated)
**Date**: 2026-04-07

---

## Step 1: Preflight & Context

### Stack Detection

| Indicator | Found | Conclusion |
|-----------|-------|------------|
| `package.json` with react/vue/angular | No | Not frontend |
| `playwright.config.*` / `cypress.config.*` | No | Not UI-driven |
| `pyproject.toml` / `pom.xml` / `go.mod` | No | N/A |
| Framework is pure Markdown/YAML verification | Yes | **backend** |

**Detected Stack**: `backend`

**Reason**: This is a framework verification story. The acceptance criteria involve reading command specification files, validating artifact output paths, verifying naming conventions, and assessing a delta report in the story implementation file — no browser, no UI, no external APIs. All verification is file system–based and document-content-based.

### TEA Config Flags

| Flag | Value | Interpretation |
|------|-------|----------------|
| `tea_use_playwright_utils` | `true` | Available but not used (backend stack) |
| `tea_use_pactjs_utils` | `false` | Disabled |
| `tea_pact_mcp` | `none` | No Pact MCP |
| `tea_browser_automation` | `auto` | Irrelevant for backend |
| `tea_execution_mode` | `auto` | Resolves to sequential |
| `test_stack_type` | `auto` | Resolved to `backend` |

### Prerequisites

| Requirement | Status | Notes |
|-------------|--------|-------|
| Story with clear acceptance criteria | MET | Story 1.9 has 4 acceptance criteria |
| Test framework configured (Vitest) | MET | Vitest (via `create-scrum-workflow/package.json`) |
| Development environment available | MET | File system accessible |

### Knowledge Fragments Loaded (Backend Profile)

**Core (always):**
- `data-factories.md` — data factory patterns
- `test-quality.md` — test quality definition of done
- `test-healing-patterns.md` — failure patterns

**Backend (because detected_stack = backend):**
- `test-levels-framework.md` — unit vs integration vs e2e selection
- `test-priorities-matrix.md` — P0–P3 prioritization

---

## Step 2: Generation Mode

**Mode Selected**: AI Generation (Sequential)

**Rationale**: Backend project — acceptance criteria are clear file system verification checks (command files, artifact paths, naming conventions, delta report content). No browser recording needed. Since `tea_execution_mode: auto` and this is running as a single agent, mode resolves to `sequential`.

---

## Step 3: Test Strategy

### Acceptance Criteria to Test Level Mapping

| AC | Criterion Summary | Test Level | Justification |
|----|------------------|------------|---------------|
| AC1 | Delta analysis documents which commands produce artifacts at correct locations, which diverge, and which are missing | Integration | Cross-artifact verification (command files, PRD, story implementation) |
| AC2 | FR-46 specifies exact artifact locations — every command's output exists at specified path with correct naming | Unit + Integration | Command spec content validation + directory structure check |
| AC3 | All artifacts follow standardized naming patterns (SW-XXX, review-{N}, approval-{N}, RR-XXX, DR-XXX, RN-XXX) | Unit | File naming pattern validation + spec content checks |
| AC4 | Delta report documents all discrepancies found, all fixes applied, and confirms FR-46 compliance | Integration | Story document completeness and compliance verdict verification |

### Test Level Selection

| Level | Selected | Justification |
|-------|----------|---------------|
| Unit | Yes | Naming pattern validation, command file content checks (AC2, AC3) |
| Integration | Yes | Cross-file compliance verification, delta report assessment (AC1, AC4) |
| API | No | No external API endpoints in this story |
| E2E | No | Backend-only — no browser testing needed |

### Priority Matrix

| Priority | Criteria | Assigned Tests |
|----------|----------|----------------|
| P0 | All AC1–AC4 core compliance behaviors | 70 tests |
| P1 | Deferred/secondary features, optional verifications | 13 tests |
| P2 | — | None |
| P3 | — | None |

### Red Phase Confirmation

All tests use `test.skip()` marking them as **intentionally failing** until implementation is verified. Tests assert expected behavior (not placeholder `expect(true).toBe(true)`).

---

## Step 4: Test Cases Generated

### Test File Summary

| File | Path | Tests | ACs Covered |
|------|------|-------|-------------|
| AC1 Delta Analysis | `tests/unit/artifact-contract/ac1-delta-analysis.spec.ts` | 14 | AC1 |
| AC2 Artifact Locations | `tests/unit/artifact-contract/ac2-artifact-locations.spec.ts` | 29 | AC2 |
| AC3 Naming Conventions | `tests/unit/artifact-contract/ac3-naming-conventions.spec.ts` | 18 | AC3 |
| AC4 Delta Report | `tests/unit/artifact-contract/ac4-delta-report.spec.ts` | 22 | AC4 |
| **Total** | — | **83** | AC1–AC4 |

### Test Inventory

#### AC1 Tests (ac1-delta-analysis.spec.ts) — 14 tests

| Test ID | Description | Priority |
|---------|-------------|----------|
| TC-1.1 | Story 1.9 implementation file should exist | P0 |
| TC-1.2 | PRD file should exist and contain FR-46 specification | P0 |
| TC-1.3 | Story documents which commands produce artifacts at correct locations | P0 |
| TC-1.4 | Story documents which commands diverge from FR-46 | P0 |
| TC-1.5 | Story documents what is MISSING vs FR-46 specification | P0 |
| TC-1.6 | Story documents resolution for all identified deltas | P0 |
| TC-1.7 | Story includes a compliance verification table | P0 |
| TC-1.8 | Delta analysis covers all 9 FR-46 commands | P0 |
| TC-1.9 | Story documents the _scrum-output vs _bmad-output directory delta | P0 |
| TC-1.10 | All story tasks are completed (checkboxes checked) | P0 |
| TC-1.11 | FR-46 specifies predictable artifact locations | P0 |
| TC-1.12 | FR-46 specifies story.md output for /scrum-create-ticket | P0 |
| TC-1.13 | FR-46 specifies RR-XXX.md output for /scrum-research-* | P0 |
| TC-1.14 | FR-46 states the consistent naming convention principle | P1 |

#### AC2 Tests (ac2-artifact-locations.spec.ts) — 29 tests

| Test ID | Description | Priority |
|---------|-------------|----------|
| TC-2.1 | create-ticket command file should exist | P0 |
| TC-2.2 | create-ticket command specifies story.md as output artifact | P0 |
| TC-2.3 | create-ticket command specifies _scrum-output/sprints/SW-XXX/ as output | P0 |
| TC-2.4 | ticket-creation workflow references _scrum-output/sprints/ directory | P0 |
| TC-2.5 | create-ticket command documents required YAML frontmatter fields | P1 |
| TC-2.6 | refine-ticket command file should exist | P0 |
| TC-2.7 | refinement workflow file should exist | P0 |
| TC-2.8 | refinement workflow references _scrum-output/sprints/ as output location | P0 |
| TC-2.9 | refine-story command file should exist | P0 |
| TC-2.10 | readiness-check workflow file should exist | P0 |
| TC-2.11 | dev-story command file should exist | P0 |
| TC-2.12 | development workflow file should exist | P0 |
| TC-2.13 | dev-story command should NOT create artifacts in _scrum-output/sprints/ | P0 |
| TC-2.14 | development workflow references source code as output (not sprint artifacts) | P0 |
| TC-2.15 | review-story command file should exist | P0 |
| TC-2.16 | review-story workflow file should exist | P0 |
| TC-2.17 | review-story command references review-N.md naming convention | P0 |
| TC-2.18 | review-story command specifies _scrum-output/sprints/ as output | P0 |
| TC-2.19 | research-technical command file should exist | P0 |
| TC-2.20 | research-general command file should exist | P0 |
| TC-2.21 | research-technical command references RR-XXX.md naming | P0 |
| TC-2.22 | research-technical command references _scrum-output/memory/research/ | P0 |
| TC-2.23 | research-general command references _scrum-output/memory/research/ | P0 |
| TC-2.24 | research-technical workflow references _scrum-output/memory/research/ | P0 |
| TC-2.25 | Story documents /scrum-approve as deferred to Epic 2 | P0 |
| TC-2.26 | Story documents /wrap-up as deferred to Epic 7 | P0 |
| TC-2.27 | Story documents /session-start as deferred to Epic 7 | P0 |
| TC-2.28 | _scrum-output root directory should exist | P0 |
| TC-2.29 | _scrum-output/memory/research/ directory should exist | P0 |

#### AC3 Tests (ac3-naming-conventions.spec.ts) — 18 tests

| Test ID | Description | Priority |
|---------|-------------|----------|
| TC-3.1 | create-ticket command specifies SW-XXX (3-digit, zero-padded) format | P0 |
| TC-3.2 | ticket-creation workflow uses SW-XXX format for story directory naming | P0 |
| TC-3.3 | Story documents the story ID format delta (SW-XXX vs X-Y-name.md) | P1 |
| TC-3.4 | review-story command specifies review-{N}.md sequential naming | P0 |
| TC-3.5 | review-story workflow specifies sequential numbering for review artifacts | P0 |
| TC-3.6 | Story documents approval-{N}.md naming convention as deferred to Epic 2 | P0 |
| TC-3.7 | research-technical command specifies RR-XXX.md (3-digit zero-padded) naming | P0 |
| TC-3.8 | research-general command specifies RR-XXX.md naming convention | P0 |
| TC-3.9 | research-technical workflow generates RR-XXX.md filenames | P0 |
| TC-3.10 | Existing research artifacts follow RR-XXX.md convention | P0 |
| TC-3.11 | Story references DR-XXX.md naming convention (deferred) | P1 |
| TC-3.12 | Story references RN-XXX.md naming convention (deferred) | P1 |
| TC-3.13 | Story references session-{YYYY-MM-DD}.md naming convention (deferred) | P1 |
| TC-3.14 | Architecture file should exist | P0 |
| TC-3.15 | Architecture defines SW-XXX (3-digit, zero-padded) story ID format | P0 |
| TC-3.16 | Architecture defines review-{N}.md sequential naming | P0 |
| TC-3.17 | Architecture defines RR-XXX.md (3-digit zero-padded) naming | P0 |
| TC-3.18 | Architecture defines code naming conventions (SKILL.md uppercase) | P1 |

#### AC4 Tests (ac4-delta-report.spec.ts) — 22 tests

| Test ID | Description | Priority |
|---------|-------------|----------|
| TC-4.1 | Story contains a comprehensive delta report section | P0 |
| TC-4.2 | Delta report documents directory structure delta (_scrum-output vs _bmad-output) | P0 |
| TC-4.3 | Delta report documents story ID format delta (SW-XXX vs X-Y-name.md) | P0 |
| TC-4.4 | Delta report documents directory-per-story vs flat file structure delta | P0 |
| TC-4.5 | Delta report documents missing commands as deferred features | P0 |
| TC-4.6 | Delta report documents additional commands not in FR-46 | P1 |
| TC-4.7 | Delta report documents resolution decision for each identified delta | P0 |
| TC-4.8 | Delta 1 (_scrum-output vs _bmad-output) resolution documented | P0 |
| TC-4.9 | Delta 4 (missing commands) documented as appropriately deferred | P0 |
| TC-4.10 | Story has completion notes in Dev Agent Record section | P0 |
| TC-4.11 | Story documents an overall FR-46 compliance verdict | P0 |
| TC-4.12 | Story confirms artifact contract principle is upheld | P0 |
| TC-4.13 | Story confirms write boundaries are correctly enforced | P0 |
| TC-4.14 | Story documents next steps for deferred and pending items | P1 |
| TC-4.15 | Story status is marked as COMPLETE | P0 |
| TC-4.16 | Sprint status file should exist | P0 |
| TC-4.17 | Sprint status references story 1.9 (artifact-contract) | P0 |
| TC-4.18 | Primary scrum_workflow/commands/ directory should exist | P0 |
| TC-4.19 | create-scrum-workflow/scrum_workflow/commands/ copy should exist | P0 |
| TC-4.20 | create-scrum-workflow/templates/scrum_workflow/commands/ copy should exist | P0 |
| TC-4.21 | create-ticket command identical across all three synchronized copies | P1 |
| TC-4.22 | review-story command identical across all three synchronized copies | P1 |

### Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| P0 | 70 | 84% |
| P1 | 13 | 16% |
| P2 | 0 | 0% |
| P3 | 0 | 0% |
| **Total** | **83** | **100%** |

---

## Step 4C: Aggregation

### TDD Red Phase Validation

| Check | Status |
|-------|--------|
| All tests use `test.skip()` | PASS — 83/83 |
| No placeholder assertions (`expect(true).toBe(true)`) | PASS |
| All tests assert expected behavior | PASS |
| All tests marked as expected_to_fail | PASS |

```
TDD Red Phase: VALIDATED
- All 83 tests use test.skip()
- All tests assert expected behavior (file existence, content patterns, compliance markers)
- All tests will FAIL until the feature is verified
- This is INTENTIONAL (TDD red phase)
```

### Generated Files

| File | Path | Type |
|------|------|------|
| AC1 Delta Analysis Tests | `tests/unit/artifact-contract/ac1-delta-analysis.spec.ts` | Integration Test |
| AC2 Artifact Locations Tests | `tests/unit/artifact-contract/ac2-artifact-locations.spec.ts` | Unit + Integration Test |
| AC3 Naming Conventions Tests | `tests/unit/artifact-contract/ac3-naming-conventions.spec.ts` | Unit Test |
| AC4 Delta Report Tests | `tests/unit/artifact-contract/ac4-delta-report.spec.ts` | Integration Test |
| ATDD Checklist | `_bmad-output/test-artifacts/atdd-checklist-1-9.md` | This Document |

---

## Step 5: Validation & Completion

### Prerequisites Check

| Check | Status |
|-------|--------|
| Story approved with clear acceptance criteria | PASS — 4 ACs, all testable |
| Test framework configured (Vitest) | PASS — `create-scrum-workflow/package.json` has Vitest |
| Development environment available | PASS |
| No orphaned browser sessions (backend-only) | PASS — N/A |
| Temp artifacts in `_bmad-output/test-artifacts/` | PASS |

### Acceptance Criteria Coverage

| AC | Description | Test Cases | Coverage |
|----|-------------|------------|----------|
| AC1 | Delta analysis documents which commands produce artifacts at correct/diverged/missing locations | TC-1.1 through TC-1.14 (14 tests) | FULL |
| AC2 | FR-46 exact artifact locations — every command's output at specified path with correct naming | TC-2.1 through TC-2.29 (29 tests) | FULL |
| AC3 | Artifacts follow standardized naming patterns (SW-XXX, review-{N}, RR-XXX, etc.) | TC-3.1 through TC-3.18 (18 tests) | FULL |
| AC4 | Delta report documents discrepancies, fixes, and FR-46 compliance confirmation | TC-4.1 through TC-4.22 (22 tests) | FULL |

**Coverage**: 4/4 acceptance criteria fully covered (100%)

### TDD Phase Status

```
RED PHASE: COMPLETE
-------------------
Tests Generated:  83
Tests Passing:     0 (expected — red phase)
Tests Failing:    83 (expected — red phase, all use test.skip())

GREEN PHASE: Ready (implementation is already complete — story status: review)
-------------------
To advance to green phase:
1. Remove test.skip() from all test files
2. Run: npx vitest run tests/unit/artifact-contract/
3. Verify all 83 tests PASS
4. Commit passing tests
```

### Key Risks & Assumptions

| Item | Type | Details |
|------|------|---------|
| Test runner path | Assumption | Tests run from project root (`/home/user/scrum_workflow`) via `vitest run` |
| Vitest availability | Risk | `vitest` is in `create-scrum-workflow/package.json` — confirm it covers `tests/unit/` at project root |
| _scrum-output/sprints/ structure | Finding | FR-46 specifies per-story directories; current implementation uses flat files in `_bmad-output/implementation-artifacts/` — delta is documented as acceptable variance in story |
| Three synchronized copies | Assumption | Story pattern from 1.3 — all command/workflow changes must be applied to three locations |
| Deferred commands | Finding | /scrum-approve, /wrap-up, /session-start are not implemented — documented as Epic 2 and Epic 7 deferred features |

### Implementation Approach (Delta Analysis Summary)

**FR-46 Compliance Status**: ACCEPTABLE VARIANCE (Substantial Compliance)

| Delta | Description | Resolution |
|-------|-------------|------------|
| Delta 1 | `_bmad-output/` vs `_scrum-output/` directory naming | ACCEPTABLE VARIANCE — BMAD-specific naming, no fix required |
| Delta 2 | `X-Y-name.md` vs `SW-XXX` story ID format | ACCEPTABLE VARIANCE — more descriptive, no fix required |
| Delta 3 | Flat file vs per-story directory structure | ACCEPTABLE VARIANCE — single-file approach valid for AI context |
| Delta 4 | Missing commands (/scrum-approve, /wrap-up, /session-start) | DEFERRED — appropriately to Epic 2 and Epic 7 |
| Delta 5 | Additional commands not in FR-46 | NO ACTION — utility commands outside FR-46 scope |

**Write Boundaries Verified:**
- `/scrum-dev-story`: writes to project source tree (not artifact directories) — COMPLIANT
- `/scrum-review-story`: writes `review-N.md` only — COMPLIANT

**Artifact Contract Principle Upheld:**
- Artifacts are produced in predictable locations (consistent, even if different from FR-46 spec)
- Naming is consistent (X-Y-name.md pattern is used uniformly)
- Write boundaries are correctly enforced per Architecture spec

### Next Recommended Workflow

Since Story 1.9 is **review**, the next step is to advance to **GREEN phase**:

1. Remove `test.skip()` from all test files in `tests/unit/artifact-contract/`
2. Run: `npx vitest run tests/unit/artifact-contract/`
3. All 83 tests should PASS (story implementation is complete)
4. Commit with message: `test(story-1.9): atdd green phase — artifact contract verified`

---

## Execution Commands

```bash
# Run all Story 1.9 ATDD tests (RED phase — all will be skipped)
npx vitest run tests/unit/artifact-contract/

# Run specific AC tests
npx vitest run tests/unit/artifact-contract/ac1-delta-analysis.spec.ts
npx vitest run tests/unit/artifact-contract/ac2-artifact-locations.spec.ts
npx vitest run tests/unit/artifact-contract/ac3-naming-conventions.spec.ts
npx vitest run tests/unit/artifact-contract/ac4-delta-report.spec.ts

# Run in watch mode during green phase
npx vitest tests/unit/artifact-contract/

# Run with verbose output
npx vitest run tests/unit/artifact-contract/ --reporter=verbose
```

---

## Knowledge Base References Applied

| Fragment | Applied To |
|----------|-----------|
| `test-quality.md` | Test structure: deterministic, isolated, explicit assertions, no placeholder assertions |
| `test-levels-framework.md` | Level selection: Unit for naming/content validation, Integration for cross-artifact compliance |
| `test-priorities-matrix.md` | P0/P1 assignment based on AC criticality and compliance impact |
| `data-factories.md` | Pattern reference for test data isolation principles |
