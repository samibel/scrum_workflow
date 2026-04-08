---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-08'
workflowType: 'testarch-atdd'
inputDocuments:
  - '_bmad-output/implementation-artifacts/3-3-implement-write-boundary-enforcement.md'
  - 'scrum_workflow/commands/create-ticket.md'
  - 'scrum_workflow/commands/dev-story.md'
  - 'scrum_workflow/commands/refine-ticket.md'
  - 'scrum_workflow/commands/refine-story.md'
  - 'scrum_workflow/commands/review-story.md'
  - 'scrum_workflow/commands/approve.md'
  - 'scrum_workflow/workflows/approval.md'
  - '_bmad/tea/config.yaml'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/data-factories.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-quality.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/test-healing-patterns.md'
  - '.claude/skills/bmad-testarch-atdd/resources/knowledge/component-tdd.md'
---

# ATDD Checklist - Epic 3, Story 3.3: Implement Write Boundary Enforcement

**Date:** 2026-04-08
**Author:** Sami
**Primary Test Level:** Unit (File Content Verification)

---

## Step 1: Preflight & Context Loading

### Stack Detection

- `test_stack_type: auto` in config → scanned project root
- No `playwright.config.*` or browser test indicators
- No `pyproject.toml`, `pom.xml`, `go.mod` etc. (backend runtime)
- Project uses **TypeScript + Vitest** for unit tests
- **Detected stack: backend** (file-content verification unit tests, no browser automation)

### Prerequisites

- ✅ Story 3.3 is `ready-for-dev`
- ✅ Test framework: Vitest (confirmed from `package.json` + `vitest.config.js`)
- ✅ Development environment available
- ✅ Existing test pattern: `tests/unit/status-guard-validation/` (Story 3.2 reference)
- ✅ Test directory `tests/unit/write-boundary-enforcement/` exists (empty)

### TEA Config Flags

- `tea_use_playwright_utils: true` — **not applicable** (backend stack)
- `tea_use_pactjs_utils: false`
- `tea_pact_mcp: none`
- `tea_browser_automation: auto` — **not applicable** (backend stack)
- `test_stack_type: auto` → resolved to `backend`

### Knowledge Base Loaded

Core (always): `data-factories.md`, `component-tdd.md`, `test-quality.md`, `test-healing-patterns.md`
Backend patterns: `test-levels-framework.md`, `test-priorities-matrix.md`, `ci-burn-in.md`
Note: No selector/timing/Playwright Utils fragments loaded (backend stack).

---

## Step 2: Generation Mode

**Selected mode:** AI Generation

**Rationale:** Backend stack detected. No browser recording needed. Story is specification-only work (Markdown-as-Code). Acceptance criteria are clear and map directly to file-content verification tests.

---

## Step 3: Test Strategy

### Acceptance Criteria to Test Scenarios Mapping

**AC1** — Write boundary declarations in all 6 command files:

| Command File | Test Scenarios |
|---|---|
| `create-ticket.md` | Has `## Write Boundary Rules`; has `may write`; has `may NOT write`; story.md declared; draft status referenced; other artifacts prohibited |
| `refine-ticket.md` | Has `## Write Boundary Rules`; refinement.md allowed; story.md for status/synthesis; plan.md prohibited |
| `refine-story.md` | Has `## Write Boundary Rules`; plan.md in "may write" (bug fix); plan.md NOT in "may NOT write" (bug fix) |
| `dev-story.md` | Has `## Write Boundary Rules`; source code allowed; story.md for status only; plan.md and refinement.md prohibited |
| `review-story.md` | Has `## Write Boundary Rules`; review-N.md allowed; source code prohibited |
| `approve.md` | Has `## Write Boundary Rules`; approval-N.md allowed; story.md status allowed |

**AC2** — Anti-pattern warnings with MUST NOT language:

| Anti-Pattern | Command | Test Scenarios |
|---|---|---|
| Spec Drift | `dev-story.md` | "Spec Drift" text; MUST NOT modify story.md content |
| Self-Fix | `dev-story.md` | "Self-Fix" text; MUST NOT validate own work |
| Self-Fix | `review-story.md` | "Self-Fix" text; MUST NOT modify source code; read-only for code |
| Bounded Authority Violation | `approve.md` | "Bounded Authority Violation" text; MUST NOT or Read-only language |
| Overwrite Prevention | `create-ticket.md` | MUST NOT overwrite; halt if story exists |
| Story Content | `refine-ticket.md` | MUST NOT modify story content; plan.md belongs to /scrum-refine-story |
| Story Criteria | `refine-story.md` | MUST NOT modify acceptance criteria |
| All 6 commands | All | At least one MUST NOT instruction in Write Boundary section |

**AC3** — Halt-and-report on write boundary violation + standard error format:

| Item | Test Scenarios |
|---|---|
| All 6 command files | Halt instruction in Write Boundary Rules section |
| `create-ticket.md` | Halt + report language |
| `dev-story.md` | Halt + report violation to user language |
| `workflows/approval.md` Step 6.3 | Uses `❌ Write Boundary Violation:` (not plain `Error:`) |
| `workflows/approval.md` Step 6.3 | Includes `**Details:**` section |
| `workflows/approval.md` Step 6.3 | Includes `**Next Step:**` section |
| `workflows/approval.md` Step 6.3 | References `{file_path}` in error message |
| Named anti-patterns | Spec Drift in dev-story.md; Self-Fix in review-story.md; Bounded Authority Violation in approve.md |

### Test Levels

All tests: **Unit** (file content verification with `readFileSync`)

No E2E, API, or integration tests needed — this is pure Markdown-as-Code (spec enforcement via text content).

### Priority Assignment

- **P0**: All structural presence tests (Write Boundary Rules section exists, may write/may NOT write declared)
- **P0**: All anti-pattern name tests (Spec Drift, Self-Fix, Bounded Authority Violation)
- **P0**: All error format tests (❌ Write Boundary Violation:, Details:, Next Step:)
- **P1**: Content detail tests (specific file paths in prohibited lists, synthesis language)

### TDD Red Phase Requirements

All 64 tests use `test.skip()` — intentional RED phase. Tests assert expected behavior that does not yet exist in the files.

---

## Step 4: Generate Tests (Sequential Mode)

**Execution Mode:** Sequential (backend unit tests, no parallelization needed)

**TDD Red Phase Status:**

```
🔴 TDD RED PHASE: Failing Tests Generated

✅ Both worker tasks completed:
- Unit Tests (AC1): Generated with test.skip()
- Unit Tests (AC2): Generated with test.skip()
- Unit Tests (AC3): Generated with test.skip()

📋 All tests assert EXPECTED behavior
📋 All tests will be SKIPPED until implementation complete
📋 This is INTENTIONAL (TDD red phase)
```

---

## Failing Tests Created (RED Phase)

### Unit Tests — 64 tests (all skipped)

#### File: `tests/unit/write-boundary-enforcement/ac1-boundary-declarations.spec.ts`

Tests verify Write Boundary Rules sections exist with proper "may write" / "may NOT write" declarations in all 6 command files.

- ✅ **[P0] commands/create-ticket.md should exist** — RED: file exists but no Write Boundary section yet
- ✅ **[P0] commands/create-ticket.md should have ## Write Boundary Rules section** — RED: section missing
- ✅ **[P0] commands/create-ticket.md should declare "This workflow may write"** — RED: phrase missing
- ✅ **[P0] commands/create-ticket.md should declare "This workflow may NOT write"** — RED: phrase missing
- ✅ **[P0] commands/create-ticket.md Write Boundary should specify story.md as allowed write** — RED: section missing
- ✅ **[P1] commands/create-ticket.md Write Boundary should reference status: draft** — RED: section missing
- ✅ **[P0] commands/create-ticket.md Write Boundary should prohibit refinement.md, plan.md** — RED: section missing
- ✅ **[P0] commands/refine-ticket.md should have ## Write Boundary Rules section** — RED: section missing
- ✅ **[P0] commands/refine-ticket.md should declare "This workflow may write"** — RED: phrase missing
- ✅ **[P0] commands/refine-ticket.md should declare "This workflow may NOT write"** — RED: phrase missing
- ✅ **[P0] commands/refine-ticket.md Write Boundary should allow writing refinement.md** — RED: section missing
- ✅ **[P1] commands/refine-ticket.md Write Boundary should allow story.md for status/synthesis** — RED: section missing
- ✅ **[P0] commands/refine-ticket.md Write Boundary should prohibit plan.md** — RED: section missing
- ✅ **[P0] commands/refine-story.md should have ## Write Boundary Rules section** — RED: section exists but buggy
- ✅ **[P0] commands/refine-story.md Write Boundary "may write" should include plan.md (bug fix)** — RED: plan.md in "may NOT write"
- ✅ **[P0] commands/refine-story.md Write Boundary "may NOT write" should NOT include plan.md** — RED: plan.md incorrectly prohibited
- ✅ **[P0] commands/refine-story.md should declare "This workflow may write"** — RED: phrase missing
- ✅ **[P0] commands/refine-story.md should declare "This workflow may NOT write"** — RED: phrase missing
- ✅ **[P0] commands/dev-story.md should have ## Write Boundary Rules section** — RED: section missing
- ✅ **[P0] commands/dev-story.md should declare "This workflow may write"** — RED: phrase missing
- ✅ **[P0] commands/dev-story.md should declare "This workflow may NOT write"** — RED: phrase missing
- ✅ **[P0] commands/dev-story.md Write Boundary should allow source code and test files** — RED: section missing
- ✅ **[P0] commands/dev-story.md Write Boundary should allow story.md for status field only** — RED: section missing
- ✅ **[P0] commands/dev-story.md Write Boundary should prohibit plan.md and refinement.md** — RED: section missing
- ✅ **[P0] commands/review-story.md should have ## Write Boundary Rules section** — RED: section exists (verify anti-patterns)
- ✅ **[P0] commands/review-story.md should declare may write and may NOT write lists** — RED: phrases need to match pattern
- ✅ **[P0] commands/review-story.md Write Boundary should allow review-N.md** — RED: verify existing content
- ✅ **[P0] commands/review-story.md Write Boundary should prohibit source code writes** — RED: verify existing content
- ✅ **[P0] commands/approve.md should have ## Write Boundary Rules section** — RED: section exists (verify anti-patterns)
- ✅ **[P0] commands/approve.md should declare may write and may NOT write lists** — RED: phrases need to match pattern
- ✅ **[P0] commands/approve.md Write Boundary should allow approval-N.md** — RED: verify existing content
- ✅ **[P0] commands/approve.md Write Boundary should allow story.md status update** — RED: verify existing content

#### File: `tests/unit/write-boundary-enforcement/ac2-anti-pattern-warnings.spec.ts`

Tests verify anti-pattern warning language (MUST NOT, named anti-patterns) in Write Boundary sections.

- ✅ **[P0] dev-story.md should mention "Spec Drift" anti-pattern** — RED: not yet added
- ✅ **[P0] dev-story.md should have MUST NOT language for story.md content modification** — RED: not yet added
- ✅ **[P0] dev-story.md should mention "Self-Fix" anti-pattern** — RED: not yet added
- ✅ **[P1] dev-story.md should warn that implementation agent MUST NOT validate its own work** — RED: not yet added
- ✅ **[P0] review-story.md should mention "Self-Fix" anti-pattern** — RED: not yet added
- ✅ **[P0] review-story.md should have MUST NOT modify source code language** — RED: not yet added
- ✅ **[P0] review-story.md Write Boundary should state review is read-only for code** — RED: verify existing content
- ✅ **[P0] approve.md should mention "Bounded Authority Violation" anti-pattern** — RED: not yet added
- ✅ **[P0] approve.md Write Boundary should have MUST NOT language for prohibited files** — RED: verify existing content
- ✅ **[P0] create-ticket.md should warn MUST NOT overwrite existing story.md** — RED: not yet added
- ✅ **[P0] create-ticket.md Write Boundary should instruct to halt if story exists** — RED: not yet added
- ✅ **[P0] refine-ticket.md should warn MUST NOT modify story content beyond status/synthesis** — RED: not yet added
- ✅ **[P1] refine-ticket.md Write Boundary should warn plan.md belongs to /scrum-refine-story** — RED: not yet added
- ✅ **[P0] refine-story.md should warn MUST NOT modify story acceptance criteria** — RED: not yet added
- ✅ **[P0] All 6 command files should have at least one MUST NOT instruction in Write Boundary Rules** — RED: 3 files missing section

#### File: `tests/unit/write-boundary-enforcement/ac3-halt-on-violation.spec.ts`

Tests verify halt-and-report instructions and standard error format (❌ Write Boundary Violation:).

- ✅ **[P0] create-ticket.md Write Boundary should instruct agent to halt on violation** — RED: section missing
- ✅ **[P0] create-ticket.md Write Boundary should instruct agent to report violation** — RED: section missing
- ✅ **[P0] refine-ticket.md Write Boundary should instruct agent to halt on violation** — RED: section missing
- ✅ **[P0] dev-story.md Write Boundary should instruct agent to halt on violation** — RED: section missing
- ✅ **[P0] dev-story.md Write Boundary should instruct agent to report violation to user** — RED: section missing
- ✅ **[P0] review-story.md Write Boundary should instruct agent to halt on violation** — RED: verify existing
- ✅ **[P0] approve.md Write Boundary should instruct agent to halt on violation** — RED: verify existing
- ✅ **[P0] refine-story.md Write Boundary should instruct agent to halt on violation** — RED: verify existing / add
- ✅ **[P0] workflows/approval.md Step 6.3 should use ❌ Write Boundary Violation: prefix** — RED: currently uses plain "Error:"
- ✅ **[P0] workflows/approval.md Step 6.3 should NOT use plain "Error: Write boundary violation" format** — RED: currently uses old format
- ✅ **[P0] workflows/approval.md Write Boundary Violation error should include **Details:**** — RED: not in current format
- ✅ **[P0] workflows/approval.md Write Boundary Violation error should include **Next Step:**** — RED: not in current format
- ✅ **[P0] workflows/approval.md Write Boundary Violation error should reference the file_path** — RED: current format incomplete
- ✅ **[P0] "Spec Drift" anti-pattern should appear in commands/dev-story.md** — RED: not yet added
- ✅ **[P0] "Self-Fix" anti-pattern should appear in commands/review-story.md** — RED: not yet added
- ✅ **[P0] "Bounded Authority Violation" anti-pattern should appear in commands/approve.md** — RED: not yet added
- ✅ **[P0] All 6 command files should have Write Boundary Rules with halt instruction** — RED: 3 files missing section

---

## Data Factories Created

N/A — This is specification-only work (Markdown-as-Code). No runtime data factories needed. Tests use `readFileSync` directly.

---

## Fixtures Created

N/A — No fixtures needed. Tests are pure file-content verification.

---

## Mock Requirements

N/A — Tests read static Markdown files. No external services or mocks required.

---

## Implementation Checklist

### Make AC1 tests pass:

- [ ] Add `## Write Boundary Rules` section to `scrum_workflow/commands/create-ticket.md`
  - [ ] Include: `This workflow may write` list with story.md (new file only, status: draft)
  - [ ] Include: `This workflow may NOT write` list with refinement.md, plan.md, review-*.md, approval-N.md, source code, scrum_workflow/
  - [ ] Sync to `create-scrum-workflow/scrum_workflow/commands/create-ticket.md`
  - [ ] Sync to `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md`
- [ ] Add `## Write Boundary Rules` section to `scrum_workflow/commands/refine-ticket.md`
  - [ ] Include: `This workflow may write` list with refinement.md (new file) and story.md (status/synthesis only)
  - [ ] Include: `This workflow may NOT write` list with plan.md, review-*.md, approval-N.md, source code, scrum_workflow/
- [ ] Fix `## Write Boundary Rules` in `scrum_workflow/commands/refine-story.md`
  - [ ] Move plan.md from "may NOT write" to "may write" list
  - [ ] Sync to `create-scrum-workflow/scrum_workflow/commands/refine-story.md`
  - [ ] Sync to `create-scrum-workflow/templates/scrum_workflow/commands/refine-story.md`
- [ ] Add `## Write Boundary Rules` section to `scrum_workflow/commands/dev-story.md`
  - [ ] Include: `This workflow may write` list with source code, test files, story.md (status: in-progress only)
  - [ ] Include: `This workflow may NOT write` list with plan.md (read-only), refinement.md (read-only), review-*.md, approval-N.md, scrum_workflow/
- [ ] Verify `scrum_workflow/commands/review-story.md` Write Boundary section matches AC1 requirements
- [ ] Verify `scrum_workflow/commands/approve.md` Write Boundary section matches AC1 requirements

### Make AC2 tests pass:

- [ ] Add Spec Drift and Self-Fix anti-pattern warnings to `commands/dev-story.md` Write Boundary section
- [ ] Add Self-Fix anti-pattern warning to `commands/review-story.md` Write Boundary section
- [ ] Add Bounded Authority Violation anti-pattern warning to `commands/approve.md` Write Boundary section
- [ ] Add halt-on-overwrite warning to `commands/create-ticket.md` Write Boundary section
- [ ] Add MUST NOT modify story content beyond status/synthesis to `commands/refine-ticket.md` Write Boundary
- [ ] Add MUST NOT modify acceptance criteria warning to `commands/refine-story.md` Write Boundary section
- [ ] Verify all 6 commands have at least one MUST NOT instruction

### Make AC3 tests pass:

- [ ] Add halt-and-report instruction to all new Write Boundary sections (create-ticket, refine-ticket, dev-story)
- [ ] Update `scrum_workflow/workflows/approval.md` Step 6.3 to use `❌ Write Boundary Violation:` format
  - [ ] Replace `Error: Write boundary violation - approval cannot modify '{file_path}'` with standard format
  - [ ] Add `**Details:**` section
  - [ ] Add `**Next Step:**` section
- [ ] Verify review-story.md, approve.md, refine-story.md have halt instructions in Write Boundary sections

---

## Running Tests

```bash
# Run all write-boundary-enforcement tests for story 3.3
npx vitest run tests/unit/write-boundary-enforcement/

# Run specific AC file
npx vitest run tests/unit/write-boundary-enforcement/ac1-boundary-declarations.spec.ts

# Run all tests including previously passing
npx vitest run
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All 64 tests written and skipped (test.skip())
- ✅ Tests assert EXPECTED behavior (not placeholders)
- ✅ No fixtures or factories needed for this story
- ✅ Implementation checklist created

**Verification:**

```
 RUN  v4.1.3 /home/user/scrum_workflow

 Test Files  3 skipped (3)
      Tests  64 skipped (64)
   Start at  16:56:25
   Duration  223ms
```

- All 64 tests skip as expected (RED phase)
- Tests fail due to missing implementation, not test bugs

---

### GREEN Phase (DEV Agent - Next Steps)

1. Pick one failing test from implementation checklist (start with P0)
2. Read the test to understand expected behavior
3. Implement minimal markdown change to make that specific test pass
4. Convert `test.skip(` to `test(` in the specific test
5. Run test → verify it passes (green)
6. Move to next test and repeat

**Key Principle:** If a test fails after removing `test.skip()`, fix the command/workflow file — do NOT modify the test expectation.

---

## Notes

- This is Markdown-as-Code: the specification IS the enforcement. No runtime JS changes.
- Tests follow the exact same pattern as `tests/unit/status-guard-validation/` (Story 3.2)
- The `refine-story.md` bug (plan.md in "may NOT write") is specifically tested in AC1 tests 1.15 and 1.16
- The `workflows/approval.md` Step 6.3 error format update is tested in AC3 tests 3.9-3.13
- `create-scrum-workflow/` sync tests are covered by existing `tests/unit/artifact-contract/` tests — not duplicated here

---

**Generated by BMAD TEA Agent (bmad-testarch-atdd)** - 2026-04-08
