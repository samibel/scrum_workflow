---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-08'
workflowType: 'testarch-atdd'
inputDocuments:
  - '_bmad-output/implementation-artifacts/3-2-implement-status-guard-validation.md'
  - '_bmad/tea/config.yaml'
  - 'scrum_workflow/skills/status-guard-validation/SKILL.md'
  - 'scrum_workflow/context/standards.md'
  - 'tests/unit/lifecycle-consolidation/ac1-delta-analysis.spec.ts'
---

# ATDD Checklist - Epic 3, Story 3.2: Implement Status Guard Validation

**Date:** 2026-04-08
**Author:** Sami
**Primary Test Level:** Unit (File Content Verification)
**Story ID:** 3.2
**TDD Phase:** RED

---

## Step 1: Preflight & Context

### Stack Detection

- `test_stack_type: auto` → **Detected stack: `backend`**
  - Project has `package.json` with `vitest` (no Playwright/Cypress browser config)
  - No `playwright.config.*`, `cypress.config.*`, `vite.config.*`, or `webpack.config.*`
  - Backend unit test paradigm: Vitest + TypeScript + `readFileSync` content assertions

### Prerequisites

- ✅ Story 3.2 approved and `ready-for-dev`
- ✅ Test framework: Vitest (`vitest.config.js` present, `include: tests/**/*.spec.ts`)
- ✅ Test directory: `tests/unit/` with existing patterns in `lifecycle-consolidation/`
- ✅ Story has 4 clear, testable acceptance criteria
- ✅ Existing pattern: `tests/unit/status-guard-validation/ac1-standard-error-format.spec.ts` (already created)

### TEA Config Flags

- `tea_use_playwright_utils: true` (not applicable — backend stack detected)
- `tea_use_pactjs_utils: false`
- `tea_pact_mcp: none`
- `tea_browser_automation: auto` (not applicable — backend stack)
- `test_stack_type: auto` → resolved to `backend`

### Knowledge Fragments Loaded (Core — Backend)

- `data-factories.md` (core)
- `test-quality.md` (core)
- `test-healing-patterns.md` (core)
- `test-levels-framework.md` (backend)
- `test-priorities-matrix.md` (backend)
- `ci-burn-in.md` (backend)

---

## Step 2: Generation Mode

**Mode selected: AI Generation**

Rationale: Backend stack detected. No browser interactions. Acceptance criteria are clear and target Markdown file content verification. AI generation from story AC + existing test patterns is appropriate.

---

## Step 3: Test Strategy

### Acceptance Criteria → Test Scenario Mapping

| AC | Description | Test Level | Priority | Spec File |
|----|-------------|------------|----------|-----------|
| AC1 | Architecture-standard error format (`❌ Status Guard Violation:` with `**Details:**` and `**Next Step:**`) for all 6 guards | Unit / File Content | P0 | `ac1-standard-error-format.spec.ts` |
| AC2 | Manual status edit detection — compare `status` vs `status_history[-1].to`, emit warning, output `manual_edit_detected` + `warning` fields | Unit / File Content | P0 | `ac2-manual-edit-detection.spec.ts` |
| AC3 | No silent inconsistent state — all errors produce actionable messages with what was attempted, what failed, and next step | Unit / File Content | P0 | `ac3-no-silent-failure.spec.ts` |
| AC4 | Guard checks requested transition against authoritative list in `standards.md`; only explicitly defined transitions permitted | Unit / File Content | P0 | `ac4-authoritative-transitions.spec.ts` |

### Test Level Rationale

This story is **Markdown-as-Code** (same paradigm as Story 3.1). All implementation changes are to Markdown specification files (`SKILL.md`, `commands/*.md`). The correct test level is **Unit / File Content Verification**: tests use `readFileSync` to load Markdown files and `expect(content).toMatch(regex)` to assert that required content is present.

- No E2E tests needed (no browser UI)
- No API contract tests (no runtime service)
- No integration tests (Markdown files, not services)

### Negative / Edge Cases

- AC1: Old `Error:` prefix should be gone (negative match)
- AC2: Empty `status_history` edge case documented; malformed history edge case documented
- AC2: `manual_edit_detected: false` and `warning: null` default values present
- AC3: Guard errors must reference what was attempted, what failed, next step (structured check)
- AC4: `refinement` sub-state noted as implementation-internal (not in FR-4 but valid for validation)

---

## Step 4: Failing Tests Generated (RED Phase)

### Unit Tests (66 tests total across 4 files)

#### AC1: `tests/unit/status-guard-validation/ac1-standard-error-format.spec.ts`

Tests already existed. Covers:

- SKILL.md exists and uses `❌ Status Guard Violation:` prefix
- All 6 command guards (create-ticket, refine-ticket, refine-story, dev-story, review-story, approval) use standard format
- `dev-story` guard accepts both `ready-for-dev` AND `changes-needed`
- `**Details:**` present in ≥ 6 guard failures
- `**Next Step:**` present in ≥ 6 guard failures
- Old `Error:` prefix absent
- Command files (dev-story.md, approve.md, review-story.md, refine-ticket.md, refine-story.md, create-ticket.md) use standard format

**Tests in this file:** 21 tests (all `test.skip()`)

#### AC2: `tests/unit/status-guard-validation/ac2-manual-edit-detection.spec.ts`

- **Status:** RED — tests will fail until SKILL.md is updated with Manual Edit Detection section and output format fields
- **Tests:** 15 tests (all `test.skip()`)

Key assertions:
- `Manual Edit Detection` section exists in SKILL.md
- `⚠️ Manual Edit Detected:` warning format documented
- `status_history` comparison algorithm documented
- Guard still uses `status` field (user intent), not history value
- Empty/malformed `status_history` edge cases documented
- Warning is non-blocking (informational only)
- `trigger: manual-edit` entries documented as visible to agents
- Output format includes `manual_edit_detected:` field
- Output format includes `warning:` field
- Defaults: `manual_edit_detected: false`, `warning: null`
- All 4 original output fields retained

#### AC3: `tests/unit/status-guard-validation/ac3-no-silent-failure.spec.ts`

- **Status:** RED — tests will fail until SKILL.md and command files use structured, actionable error format
- **Tests:** 16 tests (all `test.skip()`)

Key assertions:
- `**Details:**` in ≥ 6 guard failures (no silent failures)
- `**Next Step:**` in ≥ 6 guard failures (actionable)
- Guard checks occur BEFORE any file writes
- No command leaves story in inconsistent state
- Errors reference: what was attempted (command), what failed (status mismatch), next step
- Skill is read-only (never writes files)
- All 6 command files include actionable next step
- Old `Error:` prefix eliminated

#### AC4: `tests/unit/status-guard-validation/ac4-authoritative-transitions.spec.ts`

- **Status:** RED — tests will fail until SKILL.md references standards.md as authoritative source and is updated accordingly
- **Tests:** 14 tests (all `test.skip()`)

Key assertions:
- SKILL.md explicitly references `standards.md` as authoritative source
- SKILL.md does not re-define transitions independently
- Only explicitly defined transitions are permitted
- All 9 lifecycle states listed in SKILL.md
- `any→cancelled` transition included
- `refinement` documented as implementation-internal sub-state
- Guard described as checking against `standards.md` list
- `standards.md` has Story Status State Machine + Valid Transitions table
- `standards.md` covers all 9 states and `any→cancelled`

---

## Step 4C: Aggregation

### TDD Red Phase Compliance

- ✅ All tests use `test.skip()` (RED phase)
- ✅ All tests assert EXPECTED behavior (not placeholder assertions)
- ✅ No `expect(true).toBe(true)` placeholders
- ✅ All tests will fail until implementation is complete

### Test Run Result (RED Phase Verification)

```
 Test Files  4 skipped (4)
      Tests  66 skipped (66)
   Start at  16:18:14
   Duration  403ms
```

All 66 tests correctly skipped (RED phase confirmed).

### Files Generated

| File | Tests | Status |
|------|-------|--------|
| `tests/unit/status-guard-validation/ac1-standard-error-format.spec.ts` | 21 | Pre-existing, verified RED |
| `tests/unit/status-guard-validation/ac2-manual-edit-detection.spec.ts` | 15 | Created, RED |
| `tests/unit/status-guard-validation/ac3-no-silent-failure.spec.ts` | 16 | Created, RED |
| `tests/unit/status-guard-validation/ac4-authoritative-transitions.spec.ts` | 14 | Created, RED |

**Total: 66 tests, all `test.skip()`, all RED phase**

### Fixture Needs

None. This is Markdown file content verification — no test data factories or fixtures needed. Tests use `readFileSync` directly.

---

## Story Summary

**As a** developer,
**I want** the system to block invalid state transitions with actionable error messages and detect manual status edits,
**So that** I am protected from mistakes and the state machine integrity is maintained.

**Implementation type:** Markdown-as-Code (specification updates only — no JavaScript changes)

**Primary targets:**
- `scrum_workflow/skills/status-guard-validation/SKILL.md` — Add standard error format to all 6 guards + Manual Edit Detection section + updated output format
- `scrum_workflow/commands/*.md` (6 files) — Update guard error format to `❌ Status Guard Violation:` with `**Details:**` and `**Next Step:**`

---

## Acceptance Criteria

1. **AC1 (FR-8):** Guard errors use `❌ Status Guard Violation: {description}` format with `**Details:**` and `**Next Step:**` for all 6 command guards. `dev-story` guard accepts both `ready-for-dev` and `changes-needed`.

2. **AC2 (FR-10):** SKILL.md documents Manual Edit Detection algorithm: compare `status` field vs `status_history[-1].to`; emit `⚠️ Manual Edit Detected:` warning; guard still uses `status` field; output includes `manual_edit_detected` and `warning` fields.

3. **AC3 (FR-11):** All guard errors are actionable (what attempted, what failed, next step). Guard checks BEFORE any file write. Skill is read-only. No silent failures.

4. **AC4:** Guard explicitly references `standards.md` as the authoritative transitions source. Only explicitly defined transitions are permitted.

---

## Implementation Checklist (for DEV Agent)

### Task 1: Update SKILL.md — Standard Error Format (AC1, AC3)

- [ ] Replace `Error: Story file ... already exists` + `Fix:` pattern with `❌ Status Guard Violation:` + `**Details:**` + `**Next Step:**` for create-ticket guard
- [ ] Replace `Error: Story SW-XXX is in status...` for refine-ticket guard
- [ ] Replace `Error: Story SW-XXX is in status...` for refine-story guard
- [ ] Replace `Error: Story SW-XXX is in status...` for dev-story guard (preserve dual `ready-for-dev` / `changes-needed`)
- [ ] Replace `Error: Story SW-XXX is in status...` for review-story guard
- [ ] Replace `Error: Story SW-XXX is in status...` for approval guard
- [ ] Verify `**Details:**` appears ≥ 6 times
- [ ] Verify `**Next Step:**` appears ≥ 6 times
- [ ] Add statement: guard checks occur BEFORE any file writes
- [ ] Add statement: skill is read-only (never writes files)

### Task 2: Update SKILL.md — Manual Edit Detection (AC2)

- [ ] Add new `## Manual Edit Detection` section to SKILL.md
- [ ] Document algorithm: read `status` field, read `status_history[-1].to`, compare
- [ ] Document warning format: `⚠️ Manual Edit Detected: status field ('X') does not match last status_history entry ('Y')`
- [ ] State guard still evaluates current `status` field (user intent takes precedence)
- [ ] Document edge case: empty `status_history` → skip detection
- [ ] Document edge case: malformed `status_history` → skip detection
- [ ] State warning is non-blocking (informational only)
- [ ] Document `trigger: manual-edit` visibility to all agents

### Task 3: Update SKILL.md — Output Format (AC2)

- [ ] Extend output YAML to include `manual_edit_detected: false` (default)
- [ ] Extend output YAML to include `warning: null` (default, or string when detected)
- [ ] Retain all 4 original fields: `valid`, `current_status`, `required_status`, `can_proceed`

### Task 4: Update Command Files (AC1)

- [ ] `commands/dev-story.md` — Update Guard Condition Enforcement error to `❌ Status Guard Violation:` format
- [ ] `commands/approve.md` — Verify/update error to `❌ Status Guard Violation:` format
- [ ] `commands/review-story.md` — Update error to `❌ Status Guard Violation:` format
- [ ] `commands/refine-ticket.md` — Update error to `❌ Status Guard Violation:` format
- [ ] `commands/refine-story.md` — Update error to `❌ Status Guard Violation:` format
- [ ] `commands/create-ticket.md` — Update error to `❌ Status Guard Violation:` format

### Task 5: Activate Tests (GREEN Phase)

- [ ] Run `npx vitest run tests/unit/status-guard-validation/` — confirm all 66 tests pass
- [ ] If any fail, fix the SKILL.md or command file (do NOT modify test expectations)
- [ ] Remove `test.skip()` from all 4 spec files once implementation is complete

---

## Running Tests

```bash
# Run all status-guard-validation tests (RED phase — all should be skipped)
npx vitest run tests/unit/status-guard-validation/

# Run specific spec file
npx vitest run tests/unit/status-guard-validation/ac2-manual-edit-detection.spec.ts

# Run in watch mode during development
npx vitest tests/unit/status-guard-validation/

# Run all unit tests
npx vitest run tests/unit/
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

- ✅ All 4 spec files created
- ✅ All 66 tests use `test.skip()` (documented failing tests)
- ✅ Tests assert expected behavior — not placeholder assertions
- ✅ RED phase verified: `Tests 66 skipped (66)`
- ✅ No fixtures or factories needed (pure file content verification)

### GREEN Phase (DEV Agent — Next Steps)

1. Pick one failing AC from implementation checklist (start with AC1/Task 1)
2. Update the target Markdown file (`SKILL.md` or command file)
3. Remove `test.skip()` from the corresponding spec file
4. Run: `npx vitest run tests/unit/status-guard-validation/`
5. Verify tests pass (green)
6. Move to next AC

### REFACTOR Phase (After All Tests Pass)

1. Verify all 66 tests pass (green phase complete)
2. Review SKILL.md and command files for consistency
3. Ensure no duplication across command files
4. Run all tests to confirm still green
5. Update story status to `done`

---

## Knowledge Base References Applied

- `test-quality.md` — Given-When-Then structure, atomic test design, determinism
- `test-levels-framework.md` — Unit test level selected for file content verification
- `test-priorities-matrix.md` — P0/P1 priority assignment
- `data-factories.md` — No factories needed (static file content tests)
- `test-healing-patterns.md` — Regex patterns for flexible content matching

---

## Next Steps

1. Share this checklist with DEV agent for Story 3.2 implementation
2. DEV agent implements Tasks 1–4 (update SKILL.md and 6 command files)
3. DEV agent activates tests (Task 5): removes `test.skip()` and runs suite
4. All 66 tests should pass (GREEN phase)
5. Update story 3.2 status to `done` after green phase confirmed

---

**Generated by BMad TEA Agent (bmad-testarch-atdd)** — 2026-04-08
