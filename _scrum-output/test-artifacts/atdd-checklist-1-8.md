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
storyId: '1-8'
inputDocuments:
  - '_scrum-output/planning-artifacts/prd.md (FR-45, FR-46)'
  - '_scrum-output/implementation-artifacts/1-8-verify-align-research-commands.md'
  - 'scrum_workflow/commands/research-technical.md'
  - 'scrum_workflow/commands/research-general.md'
  - 'scrum_workflow/workflows/research-technical.md'
  - 'scrum_workflow/agents/researcher.md'
  - '_scrum-output/tea/config.yaml'
---

# ATDD Checklist — Story 1.8: Verify & Align Research Commands

## Story Summary

**Story**: 1.8 Verify & Align Research Commands
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

**Reason**: This is a framework verification story. The acceptance criteria involve reading file system structure, checking output artifact locations, verifying command files, and validating YAML frontmatter — no browser, no UI, no external APIs. All verification is file system–based.

### TEA Config Flags

| Flag | Value | Interpretation |
|------|-------|----------------|
| `tea_use_playwright_utils` | `true` | Available but not used (backend stack) |
| `tea_use_pactjs_utils` | `false` | Disabled |
| `tea_pact_mcp` | `none` | No Pact MCP |
| `tea_browser_automation` | `auto` | Irrelevant for backend |
| `tea_execution_mode` | `auto` | Will resolve to sequential |
| `test_stack_type` | `auto` | Resolved to `backend` |

### Prerequisites

| Requirement | Status | Notes |
|-------------|--------|-------|
| Story with clear acceptance criteria | MET | Story 1.8 has 3 acceptance criteria |
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

**Rationale**: Backend project — acceptance criteria are clear file system verification checks (command files, artifact naming, frontmatter structure, directory paths). No browser recording needed. Since `tea_execution_mode: auto` and this is running as a single agent, mode resolves to `sequential`.

---

## Step 3: Test Strategy

### Acceptance Criteria to Test Level Mapping

| AC | Criterion Summary | Test Level | Justification |
|----|------------------|------------|---------------|
| AC1 | Delta analysis documents matches/divergences/missing vs FR-45 | Integration | Cross-artifact verification (command files, PRD, story) |
| AC2 | Research commands produce RR-XXX.md in `_scrum-output/memory/research/` with topic, tags, date | Unit + Integration | File structure + artifact content validation |
| AC3 | Implementation fully matches FR-45 Phase 1 spec | Integration | End-to-end compliance check across all components |

### Test Level Selection

| Level | Selected | Justification |
|-------|----------|---------------|
| Unit | Yes | Artifact naming validation, frontmatter field checks (AC2) |
| Integration | Yes | Cross-file verification, compliance checks (AC1, AC2, AC3) |
| API | No | No external API endpoints in this story |
| E2E | No | Backend-only — no browser testing needed |

### Priority Matrix

| Priority | Criteria | Assigned Tests |
|----------|----------|----------------|
| P0 | All AC1–AC3 core behaviors | 39 tests |
| P1 | Phase 2 deferred features, optional frontmatter fields | 4 tests |
| P2 | — | None |
| P3 | — | None |

### Red Phase Confirmation

All tests use `test.skip()` marking them as **intentionally failing** until implementation is verified. Tests assert expected behavior (not placeholder `expect(true).toBe(true)`).

---

## Step 4: Test Cases Generated

### Test Inventory

| Test ID | File | Description | Priority | Level | AC Coverage |
|---------|------|-------------|----------|-------|-------------|
| TC-1.1 | ac1-delta-analysis.spec.ts | Story implementation file exists | P0 | Integration | AC1 |
| TC-1.2 | ac1-delta-analysis.spec.ts | PRD contains FR-45 with RR-XXX.md and correct path | P0 | Integration | AC1 |
| TC-1.3 | ac1-delta-analysis.spec.ts | Story documents what MATCHES FR-45 spec | P0 | Integration | AC1 |
| TC-1.4 | ac1-delta-analysis.spec.ts | Story documents what DIVERGES from FR-45 spec | P0 | Integration | AC1 |
| TC-1.5 | ac1-delta-analysis.spec.ts | Story documents what is MISSING vs FR-45 spec | P0 | Integration | AC1 |
| TC-1.6 | ac1-delta-analysis.spec.ts | Story documents resolution for all deltas | P0 | Integration | AC1 |
| TC-1.7 | ac1-delta-analysis.spec.ts | Story includes delta analysis table | P0 | Integration | AC1 |
| TC-1.8 | ac1-delta-analysis.spec.ts | Command files reference correct output location | P0 | Integration | AC1 |
| TC-1.9 | ac1-delta-analysis.spec.ts | Command files reference RR-XXX.md convention | P0 | Integration | AC1 |
| TC-2.1 | ac2-artifact-output.spec.ts | Output directory exists at correct path | P0 | Unit | AC2 |
| TC-2.2 | ac2-artifact-output.spec.ts | research-technical command has correct default output | P0 | Unit | AC2 |
| TC-2.3 | ac2-artifact-output.spec.ts | research-general command has correct default output | P0 | Unit | AC2 |
| TC-2.4 | ac2-artifact-output.spec.ts | research-technical workflow references correct path | P0 | Unit | AC2 |
| TC-2.5 | ac2-artifact-output.spec.ts | Output directory contains at least one RR-XXX.md | P0 | Integration | AC2 |
| TC-2.6 | ac2-artifact-output.spec.ts | All artifacts follow RR-XXX.md naming convention | P0 | Unit | AC2 |
| TC-2.7 | ac2-artifact-output.spec.ts | Sequential numbering starts from RR-001.md | P0 | Unit | AC2 |
| TC-2.8 | ac2-artifact-output.spec.ts | Workflow implements sequential ID generation logic | P0 | Integration | AC2 |
| TC-2.9 | ac2-artifact-output.spec.ts | Workflow generates RR-XXX.md filenames (not old format) | P0 | Unit | AC2 |
| TC-2.10 | ac2-artifact-output.spec.ts | Sample artifact has YAML frontmatter delimiters | P0 | Unit | AC2 |
| TC-2.11 | ac2-artifact-output.spec.ts | Frontmatter contains `topic` field | P0 | Unit | AC2 |
| TC-2.12 | ac2-artifact-output.spec.ts | Frontmatter contains `tags` field | P0 | Unit | AC2 |
| TC-2.13 | ac2-artifact-output.spec.ts | Frontmatter contains `date` field | P0 | Unit | AC2 |
| TC-2.14 | ac2-artifact-output.spec.ts | Frontmatter `date` is in YYYY-MM-DD format | P0 | Unit | AC2 |
| TC-2.15 | ac2-artifact-output.spec.ts | Frontmatter `type` has valid value | P0 | Unit | AC2 |
| TC-2.16 | ac2-artifact-output.spec.ts | Frontmatter contains `sources` field | P1 | Unit | AC2 |
| TC-2.17 | ac2-artifact-output.spec.ts | Researcher agent references correct output path | P0 | Integration | AC2 |
| TC-2.18 | ac2-artifact-output.spec.ts | Artifact file exists and is readable (persistence check) | P0 | Integration | AC2 |
| TC-2.19 | ac2-artifact-output.spec.ts | Output directory is inside _scrum-output/ | P0 | Unit | AC2 |
| TC-2.20 | ac2-artifact-output.spec.ts | Artifacts discoverable by listing directory | P0 | Unit | AC2 |
| TC-3.1 | ac3-fr45-compliance.spec.ts | Both research command files exist | P0 | Integration | AC3 |
| TC-3.2 | ac3-fr45-compliance.spec.ts | research-technical specifies RR-XXX.md output | P0 | Integration | AC3 |
| TC-3.3 | ac3-fr45-compliance.spec.ts | research-general specifies RR-XXX.md output | P0 | Integration | AC3 |
| TC-3.4 | ac3-fr45-compliance.spec.ts | research-technical workflow uses updated output location | P0 | Integration | AC3 |
| TC-3.5 | ac3-fr45-compliance.spec.ts | Researcher agent references updated output path | P0 | Integration | AC3 |
| TC-3.6 | ac3-fr45-compliance.spec.ts | Story documents FR-45 compliance | P0 | Integration | AC3 |
| TC-3.7 | ac3-fr45-compliance.spec.ts | Story documents all 6 FR-45 Phase 1 requirements | P0 | Integration | AC3 |
| TC-3.8 | ac3-fr45-compliance.spec.ts | Story explicitly defers Phase 2 features to Epic 7 | P0 | Integration | AC3 |
| TC-3.9 | ac3-fr45-compliance.spec.ts | Sample artifact does NOT contain `referenced-by` field | P1 | Unit | AC3 |
| TC-3.10 | ac3-fr45-compliance.spec.ts | Commands do NOT implement auto-loading | P1 | Unit | AC3 |
| TC-3.11 | ac3-fr45-compliance.spec.ts | Commands do NOT implement ticket referencing | P1 | Unit | AC3 |
| TC-3.12 | ac3-fr45-compliance.spec.ts | FR-46 artifact contract is documented in PRD | P0 | Integration | AC3 |
| TC-3.13 | ac3-fr45-compliance.spec.ts | Story 1.8 references FR-46 artifact contract | P0 | Integration | AC3 |
| TC-3.14 | ac3-fr45-compliance.spec.ts | Story has completion notes | P0 | Integration | AC3 |

### Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| P0 | 39 | 91% |
| P1 | 4 | 9% |
| P2 | 0 | 0% |
| P3 | 0 | 0% |
| **Total** | **43** | **100%** |

---

## Step 4C: Aggregation

### TDD Red Phase Validation

| Check | Status |
|-------|--------|
| All tests use `test.skip()` | PASS |
| No placeholder assertions (`expect(true).toBe(true)`) | PASS |
| All tests assert expected behavior | PASS |
| All tests marked as expected_to_fail | PASS |

```
TDD Red Phase: VALIDATED
- All 43 tests use test.skip()
- All tests assert expected behavior (file existence, content patterns, compliance markers)
- All tests will FAIL until the feature is verified
- This is INTENTIONAL (TDD red phase)
```

### Generated Files

| File | Path | Type |
|------|------|------|
| AC1 Delta Analysis Tests | `tests/unit/research-commands/ac1-delta-analysis.spec.ts` | Integration Test |
| AC2 Artifact Output Tests | `tests/unit/research-commands/ac2-artifact-output.spec.ts` | Unit + Integration Test |
| AC3 FR-45 Compliance Tests | `tests/unit/research-commands/ac3-fr45-compliance.spec.ts` | Integration Test |
| ATDD Checklist | `_scrum-output/test-artifacts/atdd-checklist-1-8.md` | This Document |

---

## Step 5: Validation & Completion

### Prerequisites Check

| Check | Status |
|-------|--------|
| Story approved with clear acceptance criteria | PASS — 3 ACs, all testable |
| Test framework configured (Vitest) | PASS — `create-scrum-workflow/package.json` has Vitest |
| Development environment available | PASS |
| No orphaned browser sessions (backend-only) | PASS — N/A |
| Temp artifacts in `_scrum-output/test-artifacts/` | PASS |

### Acceptance Criteria Coverage

| AC | Description | Test Cases | Coverage |
|----|-------------|------------|----------|
| AC1 | Delta analysis documents matches, divergences, missing | TC-1.1 through TC-1.9 | FULL |
| AC2 | RR-XXX.md artifacts in `_scrum-output/memory/research/` with topic, tags, date | TC-2.1 through TC-2.20 | FULL |
| AC3 | Implementation fully matches FR-45 Phase 1 spec | TC-3.1 through TC-3.14 | FULL |

**Coverage**: 3/3 acceptance criteria fully covered (100%)

### TDD Phase Status

```
RED PHASE: COMPLETE
-------------------
Tests Generated:  43
Tests Passing:     0 (expected — red phase)
Tests Failing:    43 (expected — red phase, all use test.skip())

GREEN PHASE: Ready (implementation is already complete — story status: review)
-------------------
To advance to green phase:
1. Remove test.skip() from all test files
2. Run: npx vitest run tests/unit/research-commands/
3. Verify all 43 tests PASS
4. Commit passing tests
```

### Key Risks & Assumptions

| Item | Type | Details |
|------|------|---------|
| Test runner path | Assumption | Tests run from project root (`/home/user/scrum_workflow`) via `vitest run` |
| Vitest availability | Risk | `vitest` is in `create-scrum-workflow/package.json` — confirm it covers the `tests/unit/` root directory |
| Old `docs/research/` path | Finding | Command files still reference `docs/research/` as default — delta resolved in story implementation |
| State file path | Finding | `researcher.md` references `docs/research/.research-state.json` — should be updated to `_scrum-output/memory/research/` |

### Implementation Summary (Delta Analysis Result)

**FR-45 Phase 1 Compliance**: TARGETED

| FR-45 Requirement | Pre-Story State | Post-Story Target |
|-------------------|-----------------|-------------------|
| Persistent artifacts | Partially met (docs/research/) | COMPLIANT (_scrum-output/memory/research/) |
| RR-XXX.md naming | NOT MET (topic-date format) | COMPLIANT (RR-001.md, RR-002.md...) |
| tags field in frontmatter | NOT MET (missing tags) | COMPLIANT (tags: array) |
| Output location correct | NOT MET (docs/research/) | COMPLIANT (_scrum-output/memory/research/) |
| Session survival | Partially met | COMPLIANT (file-based in correct dir) |
| Discoverability | Partially met | COMPLIANT (RR-XXX.md in correct dir) |

**Deltas Identified (from story):**

| Aspect | Before | After | Severity |
|--------|--------|-------|----------|
| Output Location | `docs/research/` | `_scrum-output/memory/research/` | Critical |
| Naming Convention | `technical-research-{topic}-{date}.md` | `RR-XXX.md` (sequential) | Critical |
| Frontmatter - Tags | Missing | Added `tags` field | Major |
| Sequential Numbering | Not implemented | Implemented `RR-001.md`, `RR-002.md`, etc. | Critical |
| Phase 2 Features | N/A | Explicitly documented as deferred | Informational |

**Phase 2 Features (Deferred to Epic 7)**:

| Feature | Decision |
|---------|----------|
| `referenced-by` field | DEFERRED to Epic 7 |
| Automatic loading by refinement agents | DEFERRED to Epic 7 |
| Ticket referencing integration | DEFERRED to Epic 7 |

### Next Recommended Workflow

Since Story 1.8 is **review**, the next step is to advance to **GREEN phase**:

1. Remove `test.skip()` from all test files in `tests/unit/research-commands/`
2. Run: `npx vitest run tests/unit/research-commands/`
3. All 43 tests should PASS (implementation is complete)
4. Commit with message: `test(story-1.8): atdd green phase — research commands verified`

Alternatively, generate a traceability report via `/scrum-testarch-trace 1.8`.

---

## Execution Commands

```bash
# Run all Story 1.8 ATDD tests (RED phase — all will be skipped/fail)
npx vitest run tests/unit/research-commands/

# Run specific AC
npx vitest run tests/unit/research-commands/ac1-delta-analysis.spec.ts
npx vitest run tests/unit/research-commands/ac2-artifact-output.spec.ts
npx vitest run tests/unit/research-commands/ac3-fr45-compliance.spec.ts

# Run in watch mode during green phase
npx vitest tests/unit/research-commands/

# Run with verbose output
npx vitest run tests/unit/research-commands/ --reporter=verbose
```

---

## Knowledge Base References Applied

| Fragment | Applied To |
|----------|-----------|
| `test-quality.md` | Test structure: deterministic, isolated, explicit assertions |
| `test-levels-framework.md` | Level selection: Unit for file/naming validation, Integration for compliance checks |
| `test-priorities-matrix.md` | P0/P1 assignment based on AC criticality |
| `data-factories.md` | Pattern reference for test data isolation |
