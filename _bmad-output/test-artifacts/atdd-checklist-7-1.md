---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-09'
story_id: '7.1'
inputDocuments:
  - _bmad-output/implementation-artifacts/7-1-implement-decision-record-extraction.md
  - _bmad/tea/config.yaml
  - .claude/skills/bmad-testarch-atdd/resources/knowledge/data-factories.md
  - .claude/skills/bmad-testarch-atdd/resources/knowledge/test-levels-framework.md
  - .claude/skills/bmad-testarch-atdd/resources/knowledge/test-priorities-matrix.md
  - .claude/skills/bmad-testarch-atdd/resources/knowledge/test-quality.md
  - .claude/skills/bmad-testarch-atdd/resources/knowledge/test-healing-patterns.md
  - .claude/skills/bmad-testarch-atdd/resources/knowledge/component-tdd.md
  - .claude/skills/bmad-testarch-atdd/resources/knowledge/ci-burn-in.md
---

# ATDD Checklist: Story 7.1 — Implement Decision Record Extraction

## Story Summary

**Story:** 7.1 — Implement Decision Record Extraction
**Status:** ready-for-dev
**Stack:** Backend (Node.js / Vitest)
**TDD Phase:** RED (failing tests generated)

As a developer, I want decisions to be automatically extracted from refinement feedback and approval reasoning as standalone artifacts, so that key decisions persist across sessions and inform future work.

---

## Step 1: Preflight & Context

### Stack Detection

- `test_stack_type`: auto → **detected as `backend`**
- Indicators: `vitest.config.js`, `package.json` (scrum_workflow), Vitest v3, ESM modules
- No frontend indicators (no `playwright.config.*`, no React/Vue/Angular dependencies)
- **`detected_stack`: `backend`**

### Prerequisites Verification

- [x] Story 7.1 has clear acceptance criteria (AC1, AC2, AC3) — approved
- [x] Test framework: `scrum_workflow/vitest.config.js` configured (`__tests__/**/*.test.{js,ts}`)
- [x] Test framework: Vitest v3.2.4 installed
- [x] No Playwright config needed (backend stack)

### TEA Config Flags

| Flag | Value | Applied |
|------|-------|---------|
| `tea_use_playwright_utils` | true | API-only profile (backend) |
| `tea_use_pactjs_utils` | false | Skipped |
| `tea_pact_mcp` | none | Skipped |
| `tea_browser_automation` | auto | N/A (backend) |
| `test_stack_type` | auto → backend | Backend test levels applied |

### Loaded Knowledge Fragments

- `data-factories.md` — factory patterns for test data
- `component-tdd.md` — TDD cycle guidance
- `test-quality.md` — test quality principles
- `test-healing-patterns.md` — resilient test design
- `test-levels-framework.md` — backend: unit + integration levels
- `test-priorities-matrix.md` — P0-P3 risk-based prioritization
- `ci-burn-in.md` — CI pipeline considerations

---

## Step 2: Generation Mode

**Mode selected:** AI Generation (backend stack — no browser recording needed)

Acceptance criteria are clear. All scenarios involve file system operations, sequential numbering, and LLM-based signal detection — standard backend unit and integration patterns.

---

## Step 3: Test Strategy

### Acceptance Criteria Mapping

| AC | Description | Test Level | Priority | Test Count |
|----|-------------|------------|----------|------------|
| AC1 | Refinement produces DR-XXX.md in decisions/ with naming convention | Unit + Integration | P0 | 18 tests |
| AC2 | Approval reasoning triggers decision record extraction | Unit + Integration | P0 | 11 tests |
| AC3 | DR artifact has YAML frontmatter with required fields, human-readable, diffable | Unit | P0 | 22 tests |

**Total planned tests:** 51 tests (all `test.skip()` — TDD RED phase)

### Test Level Selection (Backend)

- **Unit** (`7.1-UNIT-*`): Sequential numbering logic (`getNextDRNumber`), decision signal detection (`detectDecisionSignals`), DR filename formatting (`formatDRNumber`), artifact format validation, write boundary enforcement
- **Integration** (`7.1-INT-*`): Full extraction from refinement (`extractDecisionsFromRefinement`), full extraction from approval (`extractDecisionsFromApproval`), directory auto-creation, sequential numbering across sources, workflow integration
- **No E2E** — pure backend/file system story

### Test Priorities

- **P0**: DR creation pipeline, sequential numbering, required frontmatter fields (business-critical)
- **P1**: No-decision detection (graceful), approval variant handling
- **P2**: Signal filtering (anti-patterns: task descriptions, bug reports)

---

## Step 4: TDD RED Phase — Failing Tests Generated

### Test Files Created

| File | Tests | Level | AC Coverage |
|------|-------|-------|-------------|
| `scrum_workflow/__tests__/decision-extraction/ac1-refinement-decision-extraction.test.js` | 18 | Unit + Integration | AC1 |
| `scrum_workflow/__tests__/decision-extraction/ac2-approval-decision-extraction.test.js` | 11 | Unit + Integration | AC2 |
| `scrum_workflow/__tests__/decision-extraction/ac3-dr-artifact-format.test.js` | 22 | Unit | AC3 |

**Total:** 51 tests, 0 fixtures, 0 data factories (file system operations only)

### TDD RED Phase Verification

```
Test Files  3 skipped (3)
     Tests  51 skipped (51)
  Start at  09:10:45
  Duration  384ms
```

All 51 tests skipped (`test.skip()`) — correct TDD RED phase behavior.
Tests assert EXPECTED behavior that is not yet implemented.

### Execution Mode

- `tea_execution_mode`: auto → **`sequential`** (no subagent/agent-team capability in this context)
- API tests and integration tests generated sequentially

---

## Step 5: Acceptance Criteria Coverage

### AC1: Refinement Decision Record Extraction

- [x] Sequential numbering unit tests (UNIT-001 to UNIT-005): empty dir, increment, gap handling, zero-padding, auto-create
- [x] Decision signal detection unit tests (UNIT-006 to UNIT-011): "chose X over Y", "selected because", "using X instead of Y", no signals, anti-patterns
- [x] Integration tests (INT-001 to INT-005): create DR-001, create DR-002 with existing DR-001, multiple decisions in one refinement, no decisions graceful, auto-create directory
- [x] Write boundary enforcement (UNIT-012, UNIT-013): reject invalid paths, allow valid paths

### AC2: Approval Decision Record Extraction

- [x] Decision signal detection from approval (UNIT-020 to UNIT-022): "approved because X chosen over Y", "use X over Y", no signals
- [x] DR artifact creation from approval (INT-010 to INT-015): DR-001 creation, source=approval field, cross-source sequencing with DR-001 from refinement, no-decision graceful, changes-needed approval, ticket reference
- [x] Workflow integration (INT-016, INT-017): completion summary with DR references, "No decisions detected" message

### AC3: DR Artifact Format Compliance

- [x] Required YAML frontmatter fields (UNIT-030 to UNIT-038): schema_version, ticket, decision_summary, date (ISO 8601), context, alternatives_considered, source, source_file
- [x] File naming (UNIT-039 to UNIT-042): DR-NNN.md pattern, zero-padding, correct directory
- [x] Human-readable format (UNIT-043 to UNIT-046): valid Markdown, frontmatter delimiters, headings, alternatives table
- [x] YAML validity (UNIT-047 to UNIT-048): parseable frontmatter, array structure
- [x] NFR compliance (UNIT-050 to UNIT-052): atomic writes, file size limit, unique sequential filenames

---

## Implementation Guidance (GREEN Phase)

### Files to Implement

1. **`scrum_workflow/skills/decision-extraction/SKILL.md`** — Core extraction skill (LLM-based decision detection)
2. **`scrum_workflow/templates/decision-record.md`** — DR artifact template
3. **`scrum_workflow/utils/decision-extraction.js`** — Utility functions: `getNextDRNumber`, `formatDRNumber`, `detectDecisionSignals`, `createDRArtifact`, `writeDRWithBoundaryCheck`, `extractDecisionsFromRefinement`, `extractDecisionsFromApproval`, `ensureDecisionsDirExists`
4. **`scrum_workflow/workflows/refinement.md`** — Add Phase 6a decision extraction
5. **`scrum_workflow/workflows/approval.md`** — Add decision extraction phase
6. **`scrum_workflow/_scrum-output/memory/decisions/README.md`** — Directory documentation

### Green Phase Checklist

After implementing Story 7.1:

1. Remove `test.skip()` from all 51 tests
2. Run: `cd scrum_workflow && npm test`
3. Verify all 51 tests PASS
4. If tests fail: fix implementation (not the tests)
5. Commit passing tests

### Run Commands

```bash
# Run all decision-extraction tests
cd /home/user/scrum_workflow/scrum_workflow
npx vitest run __tests__/decision-extraction/

# Run specific test file
npx vitest run __tests__/decision-extraction/ac1-refinement-decision-extraction.test.js

# Run in watch mode during development
npx vitest __tests__/decision-extraction/
```

---

## Quality Validation

- [x] All 51 tests use `test.skip()` (TDD red phase compliant)
- [x] Tests assert EXPECTED behavior (not placeholder `expect(true).toBe(true)`)
- [x] Tests follow Given-When-Then structure with clear comments
- [x] Tests have descriptive names with story ID + test ID prefix (`7.1-UNIT-001`)
- [x] Tests are isolated (each uses `beforeEach`/`afterEach` with `_test-output/` temp dirs)
- [x] Tests have auto-cleanup in `afterEach`
- [x] No test interdependencies
- [x] Priority tags included `[P0]`, `[P1]`, `[P2]`
- [x] Factory functions provided for test data
- [x] ESM imports used throughout (`import ... from 'vitest'`)
- [x] Node.js `fs` module used (no external deps — NFR-2)

---

## Key Risks and Assumptions

| Risk | Impact | Mitigation |
|------|--------|------------|
| Decision signal detection accuracy (LLM-based) | High | Tests define clear signal patterns; SKILL.md will document exact phrases |
| `getNextDRNumber` race condition if parallel extractions | Medium | NFR-4: sequential-only; story spec says "sequential, not parallel" |
| `_scrum-output/memory/decisions/` directory missing on first run | Low | UNIT-005 and INT-005 cover auto-creation; not an error condition |
| DR sequencing across refinement+approval sources | Medium | INT-012 explicitly tests this cross-source scenario |

---

## Completion Summary

- **Story:** 7.1 — Implement Decision Record Extraction
- **Stack:** Backend (Vitest)
- **Primary test level:** Unit + Integration
- **Test files:** 3
- **Total tests:** 51 (all `test.skip()` — TDD RED phase)
  - AC1 tests: 18 (refinement extraction)
  - AC2 tests: 11 (approval extraction)
  - AC3 tests: 22 (artifact format compliance)
- **Data factories:** Inline factory functions in each test file
- **Fixtures:** Inline `beforeEach`/`afterEach` using `_test-output/` temp dirs
- **Output file:** `_bmad-output/test-artifacts/atdd-checklist-7-1.md`
- **RED phase verified:** 51/51 tests skipped as expected

**Next workflow:** Implementation (DEV agent — Story 7.1 tasks)
