---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-08'
workflowType: 'testarch-atdd'
inputDocuments:
  - '_bmad-output/implementation-artifacts/3-1-consolidate-9-state-lifecycle-definition.md'
  - '_bmad/tea/config.yaml'
  - 'scrum_workflow/context/standards.md'
  - 'scrum_workflow/docs/05-state-machine.md'
  - 'scrum_workflow/skills/status-guard-validation/SKILL.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/data-factories.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-quality.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-healing-patterns.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-levels-framework.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-priorities-matrix.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/ci-burn-in.md'
---

# ATDD Checklist - Epic 3, Story 1: Consolidate 9-State Lifecycle Definition

**Date:** 2026-04-08
**Author:** Sami
**Primary Test Level:** Unit (File Content Verification)

---

## Generation Mode

- **Mode:** AI Generation
- **Reason:** Project stack is `backend` (Markdown-as-code CLI tool). Story is documentation/specification consolidation only — no browser or API testing needed.

---

## Story Summary

As a developer, I want a single source of truth for the 9-state story lifecycle including all valid transitions, so that every command and agent operates against the same state machine definition.

**As a** developer
**I want** a single source of truth for the 9-state lifecycle
**So that** every command and agent operates against the same state machine definition.

---

## Acceptance Criteria

1. **Given** FR-4 specifies a 9-state lifecycle (draft, refined, ready-for-dev, in-progress, review, approved, done, changes-needed, cancelled) **When** the existing state machine implementation is compared against the current PRD **Then** a delta analysis documents which states exist, which transitions are defined, and what is missing **And** all identified deltas are resolved.

2. **Given** Epic 2 introduced new transitions (review→changes-needed, changes-needed→in-progress, approved→done via /scrum-approve) **When** the lifecycle definition is consolidated **Then** all 9 states are defined in a single, authoritative location **And** all valid transitions are explicitly enumerated including: draft→refined, refined→ready-for-dev, ready-for-dev→in-progress, in-progress→review, review→approved, review→changes-needed, changes-needed→in-progress, approved→done, any→cancelled **And** invalid transitions are implicitly defined (anything not listed is invalid).

3. **Given** the consolidated lifecycle definition **When** any command or skill references state transitions **Then** it references this single source of truth **And** no command defines its own transition rules independently.

---

## Test Strategy (Step 3)

### Stack Detection

- **Detected Stack:** `backend`
- **Detection Evidence:** `vitest.config.js` present, `scrum_workflow/package.json` with vitest devDependency, no frontend framework indicators (no React/Vue/Angular, no playwright.config.ts, no vite.config.ts)
- **Test Framework:** Vitest with TypeScript

### Scenarios

| ID | Scenario | Level | Priority | Description |
|---|---|---|---|---|
| S1 | Story delta analysis documents all gaps | Unit | P0 | Verify story file contains delta analysis documenting all 9 PRD states, refinement discrepancy, and missing any→cancelled transition |
| S2 | standards.md resolves all deltas | Unit | P0 | Verify standards.md has all 9 states, all transitions including any→cancelled, and AUTHORITATIVE designation |
| S3 | 05-state-machine.md references standards.md | Unit | P0 | Verify 05-state-machine.md contains cancelled state and references standards.md as authoritative |
| S4 | status-guard-validation SKILL.md resolved | Unit | P0 | Verify SKILL.md has cancelled in valid values and any→cancelled in valid transitions |
| S5 | No command re-defines full lifecycle independently | Unit | P0 | Scan command/workflow files for standalone lifecycle re-definitions |
| S6 | standards.md is authoritative with guard note | Unit | P1 | Verify guard enforcement note and human-readability (NFR-9) |

### Test Level Selection

**Backend project** — all tests are Unit level (file content assertions). No E2E or API tests needed. Tests verify the content of Markdown/YAML specification files against acceptance criteria.

---

## Failing Tests Created (RED Phase)

### Unit Tests (47 tests across 3 files)

**File:** `tests/unit/lifecycle-consolidation/ac1-delta-analysis.spec.ts`

- Test 1.1: [P0] Story 3.1 implementation file should exist
- Test 1.2: [P0] Story should document delta analysis between implementation and PRD FR-4
- Test 1.3: [P0] Story should document all 9 FR-4 states explicitly
- Test 1.4: [P0] Story should document the refinement state discrepancy vs FR-4
- Test 1.5: [P0] Story should document the missing any→cancelled transition gap
- Test 1.6: [P0] Story should document resolutions for all identified deltas
- Test 1.7: [P0] All story tasks should be completed (no unchecked boxes)
- Test 1.8: [P0] standards.md should exist
- Test 1.9: [P0] standards.md should contain Story Status State Machine section
- Test 1.10: [P0] standards.md State Machine section should list all 9 FR-4 states
- Test 1.11: [P1] standards.md should document refinement state with FR-4 deviation note
- Test 1.12: [P0] standards.md Valid Transitions table should include any→cancelled transition
- Test 1.13: [P0] docs/05-state-machine.md should exist
- Test 1.14: [P0] docs/05-state-machine.md should include cancelled state
- Test 1.15: [P0] docs/05-state-machine.md should include any→cancelled transition
- Test 1.16: [P0] status-guard-validation/SKILL.md should exist
- Test 1.17: [P0] SKILL.md valid status values should include cancelled
- Test 1.18: [P0] SKILL.md valid transitions should include any→cancelled

**File:** `tests/unit/lifecycle-consolidation/ac2-single-source-of-truth.spec.ts`

- Test 2.1: [P0] standards.md State Machine table should contain at least 9 state rows
- Test 2.2: [P0] standards.md should be marked as AUTHORITATIVE SOURCE
- Test 2.3: [P0] standards.md should explicitly enumerate review→changes-needed transition
- Test 2.4: [P0] standards.md should explicitly enumerate changes-needed→in-progress transition
- Test 2.5: [P0] standards.md should explicitly enumerate approved→done transition
- Test 2.6: [P0] standards.md should explicitly enumerate any→cancelled transition
- Test 2.7: [P0] standards.md Valid Transitions table should enumerate all required transitions
- Test 2.8: [P0] standards.md should list cancelled in Status Values table with description
- Test 2.9: [P0] standards.md should include cancelled as a valid status value
- Test 2.10: [P1] standards.md should have guard enforcement rules for invalid transitions
- Test 2.11: [P0] docs/05-state-machine.md Guard Conditions table should include changes-needed
- Test 2.12: [P0] docs/05-state-machine.md should include review→changes-needed transition
- Test 2.13: [P0] docs/05-state-machine.md Status Values table should contain cancelled
- Test 2.14: [P0] SKILL.md valid transitions should include changes-needed→in-progress
- Test 2.15: [P0] SKILL.md valid transitions should include review→changes-needed
- Test 2.16: [P0] SKILL.md valid status values list should include cancelled

**File:** `tests/unit/lifecycle-consolidation/ac3-no-independent-definitions.spec.ts`

- Test 3.1: [P0] docs/05-state-machine.md should reference standards.md as authoritative source
- Test 3.2: [P0] docs/05-state-machine.md should NOT contain a full independent lifecycle re-definition
- Test 3.3: [P0] SKILL.md should reference standards.md as source of truth for valid transitions
- Test 3.4: [P0] SKILL.md Context Rules should list standards.md as a read source
- Test 3.5: [P0] SKILL.md valid status values should match standards.md exactly
- Test 3.6: [P0] Command files should NOT contain full standalone lifecycle re-definitions
- Test 3.7: [P0] Workflow files should NOT contain full standalone lifecycle re-definitions
- Test 3.8: [P0] dev-story command should only declare its own required/sets_status
- Test 3.9: [P0] review-story command should only declare its own required/sets_status
- Test 3.10: [P1] prerequisite-validation skill should exist (directory or SKILL.md)
- Test 3.11: [P0] standards.md Story Status State Machine section should declare itself as authoritative
- Test 3.12: [P1] standards.md should be human-readable Markdown (NFR-9 compliance)
- Test 3.13: [P1] standards.md error message templates should reference authoritative transitions

---

## Data Factories Created

N/A — This story is documentation/specification consolidation only. No runtime entities or data factories needed.

---

## Fixtures Created

N/A — Tests read file system content directly using Node.js `fs` module. No fixtures required.

---

## Mock Requirements

N/A — All tests read local Markdown/YAML files. No external services or mocking needed.

---

## Required data-testid Attributes

N/A — Backend/documentation project. No UI components.

---

## Implementation Checklist

### Test Group: AC1 — Delta Analysis (ac1-delta-analysis.spec.ts)

**Tasks to make these tests pass:**

- [ ] Complete story delta analysis tasks 1.1–1.4 (compare standards.md, 05-state-machine.md, status-guard-validation/SKILL.md against FR-4)
- [ ] Update `scrum_workflow/context/standards.md`: Add `cancelled` to the Status Values table with description and trigger
- [ ] Update `scrum_workflow/context/standards.md`: Add `any → cancelled` transition to Valid Transitions table
- [ ] Update `scrum_workflow/context/standards.md`: Document `refinement` as internal/ephemeral sub-status not in FR-4's 9 public states
- [ ] Update `scrum_workflow/docs/05-state-machine.md`: Add `cancelled` state to Status Values table
- [ ] Update `scrum_workflow/docs/05-state-machine.md`: Add `any → cancelled` to State Transition Diagram and Guard Conditions table
- [ ] Update `scrum_workflow/skills/status-guard-validation/SKILL.md`: Add `cancelled` to valid status values list
- [ ] Update `scrum_workflow/skills/status-guard-validation/SKILL.md`: Add `any → cancelled` to valid transitions list
- [ ] Mark all story tasks as complete (replace `- [ ]` with `- [x]`)
- [ ] Run test: `NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ac1-delta-analysis.spec.ts`
- [ ] All 18 AC1 tests pass (green phase)

**Estimated Effort:** 2 hours

---

### Test Group: AC2 — Single Source of Truth (ac2-single-source-of-truth.spec.ts)

**Tasks to make these tests pass:**

- [ ] Add clear "AUTHORITATIVE SOURCE" designation to the Story Status State Machine section in `standards.md`
- [ ] Ensure all 9 backtick-formatted states (`draft`, `refined`, etc.) appear in the state machine table
- [ ] Ensure `| \`cancelled\` |` row exists in Status Values table with "Story cancelled (terminal)" description
- [ ] Ensure all 11 transitions (including `review → changes-needed`, `changes-needed → in-progress`, `approved → done`, `any → cancelled`) are in the Valid Transitions table
- [ ] Add guard enforcement note: "Any transition not listed above is invalid"
- [ ] Update `05-state-machine.md` Guard Conditions table to include `changes-needed` as a from-state
- [ ] Run test: `NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ac2-single-source-of-truth.spec.ts`
- [ ] All 16 AC2 tests pass (green phase)

**Estimated Effort:** 1.5 hours

---

### Test Group: AC3 — No Independent Definitions (ac3-no-independent-definitions.spec.ts)

**Tasks to make these tests pass:**

- [ ] Update `scrum_workflow/docs/05-state-machine.md`: Add explicit note "Authoritative definition lives in `scrum_workflow/context/standards.md`"
- [ ] Update `scrum_workflow/docs/05-state-machine.md`: Remove or clearly defer duplicate transition definitions
- [ ] Update `scrum_workflow/skills/status-guard-validation/SKILL.md`: Add explicit reference to `scrum_workflow/context/standards.md` in Context Rules / Reads section
- [ ] Add `cancelled` to SKILL.md valid status values section (10 total: draft, refinement, refined, ready-for-dev, in-progress, review, approved, changes-needed, done, cancelled)
- [ ] Verify no command in `commands/*.md` independently enumerates the full lifecycle (without referencing standards.md)
- [ ] Run test: `NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ac3-no-independent-definitions.spec.ts`
- [ ] All 13 AC3 tests pass (green phase)

**Estimated Effort:** 1.5 hours

---

## Running Tests

```bash
# Run all failing tests for story 3.1
NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ --reporter=verbose

# Run specific test file
NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ac1-delta-analysis.spec.ts

NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ac2-single-source-of-truth.spec.ts

NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ac3-no-independent-definitions.spec.ts

# Run with coverage
NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ --coverage
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All 47 tests written and skipped (test.skip())
- ✅ Tests assert expected behavior for each acceptance criterion
- ✅ All tests use `test.skip()` (TDD red phase — intentionally skipped)
- ✅ Implementation checklist created
- ✅ No fixtures or factories needed (documentation-only story)

**Verification:**

- All 47 tests run and appear as "skipped" (expected in TDD red phase)
- Tests will transition from skipped → passing once implementation is complete and `test.skip()` is removed
- Tests fail due to missing/incomplete implementation in specification files, not test bugs

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test group** from implementation checklist (start with AC1)
2. **Read the test** to understand expected content in specification files
3. **Update the specification files** (standards.md, 05-state-machine.md, SKILL.md) per the checklist
4. **Remove `test.skip()`** from that test group
5. **Run the tests** to verify they now pass (green)
6. **Check off the tasks** in implementation checklist
7. **Move to next test group** and repeat

**Key Principles:**

- One test file at a time (AC1 → AC2 → AC3)
- Minimal changes (only what the tests require)
- Run tests after each file change
- Use implementation checklist as roadmap

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

After all 47 tests pass:

1. Review all three modified specification files for consistency
2. Ensure terminology is consistent across standards.md, 05-state-machine.md, and SKILL.md
3. Verify the `refinement` state documentation is clear and non-contradictory
4. Ensure error message templates in standards.md reference the new authoritative transitions list
5. Run full test suite to verify nothing else broken

---

## Next Steps

1. Share this checklist with the dev workflow
2. Run failing tests to confirm RED phase: `NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ --reporter=verbose`
3. Begin implementation using AC1 checklist first
4. Work one test group at a time (remove test.skip() as each group passes)
5. When all 47 tests pass, mark story status as `done`

---

## Knowledge Base References Applied

- **test-quality.md** — Given-When-Then test design, one assertion focus per test
- **test-levels-framework.md** — Backend project: unit tests for file content validation
- **test-priorities-matrix.md** — P0/P1 priority assignment based on acceptance criteria criticality
- **ci-burn-in.md** — Tests designed to be stable in CI (file content assertions, no flakiness)
- **data-factories.md** — N/A for this documentation-only story
- **test-healing-patterns.md** — Regex patterns used for resilient content matching (not exact string matching)

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `NODE_PATH=scrum_workflow/node_modules scrum_workflow/node_modules/.bin/vitest run tests/unit/lifecycle-consolidation/ --reporter=verbose`

**Results:**

```
 Test Files  3 skipped (3)
      Tests  47 skipped (47)
   Start at  15:40:31
   Duration  371ms
```

**Summary:**

- Total tests: 47
- Skipped: 47 (expected — TDD red phase using test.skip())
- Failing: 0 (tests are skipped, not actively failing)
- Status: ✅ RED phase verified (test.skip() pattern confirmed)

**Expected Behavior After Removing test.skip():**

Once `test.skip()` is removed and before implementation is complete, tests will fail with errors such as:
- `AssertionError: expected false to be true` (file doesn't contain expected content)
- `Error: ENOENT: no such file or directory` (for missing files)

---

## Notes

- This story modifies only Markdown specification files — no runtime code changes
- The `vitest` runner is located at `scrum_workflow/node_modules/.bin/vitest`; the `NODE_PATH` env var is required to resolve `vitest/config` from the root `vitest.config.js`
- The `refinement` state handling is nuanced: it must be documented as an internal/ephemeral sub-status that is NOT part of FR-4's 9 public states, but MUST remain in the valid status values list to avoid validation errors on stories currently in this state
- Story 3.2 ("Implement Status Guard Validation") depends on the machine-readable transitions table created by this story — the format must be consistent and machine-parseable

---

**Generated by BMad TEA Agent** - 2026-04-08
