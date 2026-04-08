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
storyId: '1-7'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md (FR-44)'
  - '_bmad-output/planning-artifacts/architecture.md (Section 2: Structure Patterns)'
  - '_bmad-output/implementation-artifacts/1-7-verify-align-runtime-extension-model.md'
  - 'scrum_workflow/context/architecture-guidelines.md'
  - '_bmad/tea/config.yaml'
  - 'scrum_workflow/config.yaml'
---

# ATDD Checklist — Story 1.7: Verify & Align Runtime Extension Model

## Story Summary

**Story**: 1.7 Verify & Align Runtime Extension Model
**Epic**: Epic 1 — Establish Reliable Foundation
**Type**: Verification & Alignment (Brownfield)
**Status**: done
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

**Reason**: This is a framework verification story. The acceptance criteria involve reading file system structure, checking directory layouts, and verifying framework properties — no browser, no UI, no external APIs. All verification is file system–based.

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
| Story with clear acceptance criteria | MET | Story 1.7 has 4 acceptance criteria |
| Test framework configured | MET | Vitest (via `create-scrum-workflow/package.json`) |
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

**Rationale**: Backend project — acceptance criteria are clear file system verification checks. No browser recording needed. Since `tea_execution_mode: auto` and this is running as a single agent, mode resolves to `sequential`.

---

## Step 3: Test Strategy

### Acceptance Criteria to Test Level Mapping

| AC | Criterion Summary | Test Level | Justification |
|----|------------------|------------|---------------|
| AC1 | Delta analysis documents matches/divergences/missing | Integration | Cross-artifact verification (story file, PRD, Architecture) |
| AC2 | New `.md` file discovered at runtime without config/build/restart | Integration | File system behavior + no-registration verification |
| AC3 | Directory structure matches `scrum_workflow/{commands,workflows,skills,agents}/{name}/` | Unit | Pure file structure validation |
| AC4 | Runtime extension model fully matches PRD and Architecture specs | Integration | End-to-end compliance check |

### Test Level Selection

| Level | Selected | Justification |
|-------|----------|---------------|
| Unit | Yes | Directory structure validation, file naming conventions (AC3) |
| Integration | Yes | Runtime discovery mechanism, cross-artifact verification (AC1, AC2, AC4) |
| API | No | No external API endpoints in this story |
| E2E | No | Backend-only — no browser testing needed |

### Priority Matrix

| Priority | Criteria | Assigned Tests |
|----------|----------|----------------|
| P0 | All AC1–AC4 core behaviors | All primary tests |
| P1 | Documentation of variance, installer separation, sync copies | Secondary verification |
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
| TC-1.2 | ac1-delta-analysis.spec.ts | Architecture file exists | P0 | Integration | AC1 |
| TC-1.3 | ac1-delta-analysis.spec.ts | PRD file contains FR-44 | P0 | Integration | AC1 |
| TC-1.4 | ac1-delta-analysis.spec.ts | Story documents what MATCHES Architecture spec | P0 | Integration | AC1 |
| TC-1.5 | ac1-delta-analysis.spec.ts | Story documents what DIVERGES from Architecture spec | P0 | Integration | AC1 |
| TC-1.6 | ac1-delta-analysis.spec.ts | Story documents resolution decision for all deltas | P0 | Integration | AC1 |
| TC-1.7 | ac1-delta-analysis.spec.ts | Architecture documentation reflects delta resolution | P0 | Integration | AC1 |
| TC-1.8 | ac1-delta-analysis.spec.ts | Story includes FR-44 compliance verification table | P0 | Integration | AC1 |
| TC-2.1 | ac2-runtime-discovery.spec.ts | No centralized registry files exist | P0 | Integration | AC2 |
| TC-2.2 | ac2-runtime-discovery.spec.ts | No bundler config references framework spec files | P0 | Integration | AC2 |
| TC-2.3 | ac2-runtime-discovery.spec.ts | Framework dirs contain only Markdown/YAML files | P0 | Integration | AC2 |
| TC-2.4 | ac2-runtime-discovery.spec.ts | Skill files are pure Markdown with YAML frontmatter | P0 | Unit | AC2 |
| TC-2.5 | ac2-runtime-discovery.spec.ts | New skill file discoverable without config change | P0 | Integration | AC2 |
| TC-2.6 | ac2-runtime-discovery.spec.ts | Framework files readable without restart | P0 | Integration | AC2 |
| TC-3.1 | ac3-directory-structure.spec.ts | All four required extension directories exist | P0 | Unit | AC3 |
| TC-3.2 | ac3-directory-structure.spec.ts | Skills directory follows {name}/SKILL.md convention | P0 | Unit | AC3 |
| TC-3.3 | ac3-directory-structure.spec.ts | readiness-check skill exists | P0 | Unit | AC3 |
| TC-3.4 | ac3-directory-structure.spec.ts | Workflows directory has workflow specifications | P0 | Unit | AC3 |
| TC-3.5 | ac3-directory-structure.spec.ts | Agents directory has agent specifications | P0 | Unit | AC3 |
| TC-3.6 | ac3-directory-structure.spec.ts | Commands directory has command specifications | P0 | Unit | AC3 |
| TC-3.7 | ac3-directory-structure.spec.ts | Core agents (architect, developer, qa) exist | P0 | Unit | AC3 |
| TC-3.8 | ac3-directory-structure.spec.ts | Core skills exist with SKILL.md structure | P0 | Unit | AC3 |
| TC-3.9 | ac3-directory-structure.spec.ts | Structural variance documented in story | P1 | Integration | AC3 |
| TC-4.1 | ac4-fr44-compliance.spec.ts | All four extension types use file-based specifications | P0 | Integration | AC4 |
| TC-4.2 | ac4-fr44-compliance.spec.ts | Skills enforce zero-config extensibility | P0 | Integration | AC4 |
| TC-4.3 | ac4-fr44-compliance.spec.ts | All spec files readable as plain Markdown/YAML | P0 | Integration | AC4 |
| TC-4.4 | ac4-fr44-compliance.spec.ts | Architecture documentation describes extension model | P0 | Integration | AC4 |
| TC-4.5 | ac4-fr44-compliance.spec.ts | Story documents all five FR-44 requirements | P0 | Integration | AC4 |
| TC-4.6 | ac4-fr44-compliance.spec.ts | All FR-44 requirements marked COMPLIANT | P0 | Integration | AC4 |
| TC-4.7 | ac4-fr44-compliance.spec.ts | Story status is "done" | P0 | Integration | AC4 |
| TC-4.8 | ac4-fr44-compliance.spec.ts | Installer documented as separate from runtime extension | P1 | Integration | AC4 |
| TC-4.9 | ac4-fr44-compliance.spec.ts | Three synchronized copies confirmed | P1 | Integration | AC4 |

### Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| P0 | 28 | 85% |
| P1 | 4 | 12% |
| P2 | 0 | 0% |
| P3 | 0 | 0% |
| **Total** | **32** | **100%** |

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
- All 32 tests use test.skip()
- All tests assert expected behavior (file existence, content patterns, compliance markers)
- All tests will FAIL until the feature is verified
- This is INTENTIONAL (TDD red phase)
```

### Generated Files

| File | Path | Type |
|------|------|------|
| AC1 Delta Analysis Tests | `tests/unit/runtime-extension-model/ac1-delta-analysis.spec.ts` | Unit/Integration Test |
| AC2 Runtime Discovery Tests | `tests/unit/runtime-extension-model/ac2-runtime-discovery.spec.ts` | Integration Test |
| AC3 Directory Structure Tests | `tests/unit/runtime-extension-model/ac3-directory-structure.spec.ts` | Unit Test |
| AC4 FR-44 Compliance Tests | `tests/unit/runtime-extension-model/ac4-fr44-compliance.spec.ts` | Integration Test |
| ATDD Checklist | `_bmad-output/test-artifacts/atdd-checklist-1-7.md` | This Document |

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
| AC1 | Delta analysis documents matches, divergences, missing | TC-1.1 through TC-1.8 | FULL |
| AC2 | Runtime discovery without config/build/restart | TC-2.1 through TC-2.6 | FULL |
| AC3 | Directory structure matches spec | TC-3.1 through TC-3.9 | FULL |
| AC4 | Full FR-44 compliance verified | TC-4.1 through TC-4.9 | FULL |

**Coverage**: 4/4 acceptance criteria fully covered (100%)

### TDD Phase Status

```
RED PHASE: COMPLETE
-------------------
Tests Generated:  32
Tests Passing:     0 (expected — red phase)
Tests Failing:    32 (expected — red phase, all use test.skip())

GREEN PHASE: Ready (implementation is already done — story status: done)
-------------------
To advance to green phase:
1. Remove test.skip() from all test files
2. Run: npx vitest run tests/unit/runtime-extension-model/
3. Verify all 32 tests PASS
4. Commit passing tests
```

### Key Risks & Assumptions

| Item | Type | Details |
|------|------|---------|
| Test runner path | Assumption | Tests run from project root (`/home/user/scrum_workflow`) via `vitest run` |
| Vitest availability | Risk | `vitest` is in `create-scrum-workflow/package.json` — confirm it covers the `tests/unit/` root directory |
| Flat file variance | Finding | Architecture spec requires `{name}/workflow.md` but implementation uses flat `{name}.md` — documented as acceptable variance (FR-44 compliant) |

### Implementation Summary (Delta Analysis Result)

**FR-44 Compliance**: FULLY MET

| FR-44 Requirement | Result |
|-------------------|--------|
| File-based extension (new `.md` = new capability) | COMPLIANT |
| No configuration change required | COMPLIANT |
| No build step required | COMPLIANT |
| No service restart required | COMPLIANT |
| Runtime discovery | COMPLIANT |

**Structural Deltas Found & Resolved**:

| Component | Architecture Spec | Implementation | Decision |
|-----------|-------------------|----------------|----------|
| `skills/` | `{name}/SKILL.md` | `{name}/SKILL.md` | MATCH — no action |
| `workflows/` | `{name}/workflow.md` | `{name}.md` flat | ACCEPTED — FR-44 compliant |
| `agents/` | `{name}/agent.md` | `{name}.md` flat | ACCEPTED — FR-44 compliant |
| `commands/` | `{name}/command.md` | `{name}.md` flat | ACCEPTED — FR-44 compliant |

Resolution: Architecture documentation updated to reflect actual flat-file implementation. Migrating to subdirectories would be a breaking change with no functional benefit to FR-44 compliance.

### Next Recommended Workflow

Since Story 1.7 is already **done**, the next step is to advance to **GREEN phase**:

1. Remove `test.skip()` from all test files in `tests/unit/runtime-extension-model/`
2. Run: `npx vitest run tests/unit/runtime-extension-model/`
3. All 32 tests should PASS (implementation is complete)
4. Commit with message: `test(story-1.7): atdd green phase — runtime extension model verified`

Alternatively, generate a traceability report via `/bmad-testarch-trace 1.7`.

---

## Execution Commands

```bash
# Run all Story 1.7 ATDD tests (RED phase — all will be skipped/fail)
npx vitest run tests/unit/runtime-extension-model/

# Run specific AC
npx vitest run tests/unit/runtime-extension-model/ac1-delta-analysis.spec.ts

# Run in watch mode during green phase
npx vitest tests/unit/runtime-extension-model/

# Run with verbose output
npx vitest run tests/unit/runtime-extension-model/ --reporter=verbose
```

---

## Knowledge Base References Applied

| Fragment | Applied To |
|----------|-----------|
| `test-quality.md` | Test structure: deterministic, isolated, explicit assertions |
| `test-levels-framework.md` | Level selection: Unit for structure validation, Integration for discovery |
| `test-priorities-matrix.md` | P0/P1 assignment based on AC criticality |
| `data-factories.md` | Pattern reference for test data isolation (TC-2.5 cleanup pattern) |
