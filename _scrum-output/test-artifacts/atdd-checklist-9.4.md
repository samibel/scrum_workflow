---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-05-validate-and-complete
lastStep: step-05-validate-and-complete
lastSaved: '2025-07-15'
storyId: '9.4'
storyTitle: Implement Extended Agent Types
tddPhase: RED
totalTests: 105
totalFiles: 4
inputDocuments:
  - _scrum-output/implementation-artifacts/9-4-implement-extended-agent-types.md
  - _scrum-output/bmm/config.yaml
  - vitest.config.js
  - scrum_workflow/agents/architect.md
  - scrum_workflow/data/dispatch-rules.yaml
  - scrum_workflow/skills/agent-dispatcher/SKILL.md
  - scrum_workflow/agents/README.md
  - tests/unit/agent-dispatcher/ac1-type-based-dispatch.spec.ts
  - tests/unit/agent-dispatcher/ac4-fallback-and-missing-agents.spec.ts
---

# ATDD Checklist — Story 9.4: Implement Extended Agent Types

## Summary

| Metric | Value |
|--------|-------|
| Story | 9.4 - Implement Extended Agent Types |
| PRD Reference | FR-35 |
| TDD Phase | RED (all tests skipped) |
| Test Files | 4 |
| Total Tests | 105 |
| Skipped (RED) | 105 |
| Passing | 0 |
| Failing | 0 |
| Regressions | 0 (697 existing tests baseline) |

## Preflight

- [x] Story approved with clear acceptance criteria (4 ACs)
- [x] Test framework configured (vitest.config.js)
- [x] Existing test patterns analyzed (story-classifier, adaptive-depth, agent-dispatcher)
- [x] Stack detected: frontend (unit file content verification pattern)
- [x] Generation mode: AI Generation (no browser recording needed — Markdown-as-Code agents)

## Test Strategy

### AC-to-Test Mapping

| AC | Test File | Tests | Priority Mix |
|----|-----------|-------|-------------|
| AC1: Agent file structure & frontmatter schema | `ac1-agent-file-structure.spec.ts` | 44 | 35 P0, 9 P1 |
| AC2: Runtime discovery & dispatcher integration | `ac2-runtime-discovery.spec.ts` | 16 | 12 P0, 4 P1 |
| AC3: Context isolation per agent | `ac3-context-isolation.spec.ts` | 25 | 17 P0, 8 P1 |
| AC4: Sync targets & README update | `ac4-sync-targets.spec.ts` | 20 | 17 P0, 3 P1 |

### Coverage by Acceptance Criteria

- [x] **AC1** (FR-35 agent file structure): 44 tests in ac1
  - File existence: 3 agents x 1 test = 3 tests
  - Frontmatter schema: 3 agents x 6 fields = 18 tests
  - Body sections: 3 agents (4 sections + output format details) = 20 tests
  - Consistency with existing agents: 3 tests

- [x] **AC2** (FR-44, NFR-11 runtime discovery): 16 tests in ac2
  - Flat file pattern (not subdirectory): 3 tests
  - File name matches frontmatter name: 1 test
  - Dispatch rules reference all 3 agents: 7 tests
  - Dispatcher file validation: 3 tests
  - Active_in workflow: 1 test
  - Coexistence with core agents: 1 test

- [x] **AC3** (Architecture Pattern 8, context isolation): 25 tests in ac3
  - Security Reviewer context: 7 tests (loads arch, risk notes; no frontend)
  - UX Reviewer context: 7 tests (loads frontend; no arch, no risks)
  - Contract Validator context: 7 tests (loads plan.md, standards; no frontend, no risks)
  - No cross-agent references: 4 tests

- [x] **AC4** (FR-46 artifact contract sync): 20 tests in ac4
  - Distribution directory sync: 3 tests
  - Templates directory sync: 3 tests
  - Content matches source: 3 tests
  - README updated with extended agents: 5 tests
  - README synced to targets: 3 tests
  - Complete sync target verification: 2 tests
  - README content in dist: 1 test

## Test Files Created

### 1. `tests/unit/extended-agent-types/ac1-agent-file-structure.spec.ts` (44 tests)
- AC1: Extended Agent Files Exist (3 tests)
- AC1: Security Reviewer Frontmatter (6 tests)
- AC1: UX Reviewer Frontmatter (6 tests)
- AC1: Contract Validator Frontmatter (6 tests)
- AC1: Security Reviewer Body Sections (10 tests)
- AC1: UX Reviewer Body Sections (5 tests)
- AC1: Contract Validator Body Sections (5 tests)
- AC1: Frontmatter Schema Consistency with Existing Agents (3 tests)

### 2. `tests/unit/extended-agent-types/ac2-runtime-discovery.spec.ts` (16 tests)
- AC2: Agent Files Use Flat File Pattern (4 tests)
- AC2: Dispatch Rules Reference Extended Agents (7 tests)
- AC2: Agent Files Are Discoverable by Dispatcher (4 tests)
- AC2: Extended Agents Active In refine-ticket (1 test)

### 3. `tests/unit/extended-agent-types/ac3-context-isolation.spec.ts` (25 tests)
- AC3: Security Reviewer Context Isolation (7 tests)
- AC3: UX Reviewer Context Isolation (7 tests)
- AC3: Contract Validator Context Isolation (7 tests)
- AC3: No Cross-Agent References in Context Rules (4 tests)

### 4. `tests/unit/extended-agent-types/ac4-sync-targets.spec.ts` (20 tests)
- AC4: Agent Files Synced to Distribution Directory (3 tests)
- AC4: Agent Files Synced to Templates Directory (3 tests)
- AC4: Sync Target Content Matches Source (3 tests)
- AC4: README.md Updated in Source (5 tests)
- AC4: README.md Synced to Distribution Targets (4 tests)
- AC4: Complete Sync Target Verification (2 tests)

## Validation

- [x] All 85 tests use `test.skip()` (TDD RED phase)
- [x] All tests follow existing vitest + readFileSync + regex pattern
- [x] All tests follow existing naming convention: `ac{N}-{description}.spec.ts`
- [x] Test directory follows convention: `tests/unit/extended-agent-types/`
- [x] Zero regressions: 697 existing tests baseline maintained
- [x] Each AC has at least one corresponding test file
- [x] Priority labels (P0/P1) assigned per risk and business impact
- [x] JSDoc header includes story reference, PRD reference, and AC description

## Risks & Assumptions

1. **Extended agent files don't exist yet** — All tests reference files that will be created during implementation. This is the expected TDD RED state.
2. **File content verification pattern** — Tests verify markdown/YAML content using regex, not runtime behavior. Consistent with Stories 9.1, 9.2, and 9.3.
3. **Sync targets existence** — Tests assume `create-scrum-workflow/` directories exist. If not present, sync target tests will fail with file not found (expected in RED phase).
4. **Dispatch rules already reference extended agents** — Tests 2.5-2.11 validate dispatch-rules.yaml which already exists from Story 9.3. These tests verify existing references and will pass once `test.skip()` is removed (they should be GREEN-ready).
5. **README update scope** — Tests validate that README.md is updated with new agent listings. The exact section naming ("Extended Agents" / "Phase 4") is flexible.

## Next Steps

1. **Implementation**: Create 3 agent files in `scrum_workflow/agents/` following `architect.md` pattern
2. **GREEN phase**: Remove `test.skip()` from tests as implementation progresses
3. **README update**: Update `scrum_workflow/agents/README.md` with extended agents section
4. **Artifact sync**: Sync all files to 8 distribution targets in `create-scrum-workflow/`
5. **Verify**: Run full test suite to ensure zero regressions
