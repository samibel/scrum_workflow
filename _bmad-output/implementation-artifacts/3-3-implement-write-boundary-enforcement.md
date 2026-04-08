# Story 3.3: Implement Write Boundary Enforcement

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want each command to be constrained to writing only its defined artifacts,
So that agents cannot accidentally modify files outside their scope.

## Acceptance Criteria

1. **Given** FR-9 specifies write boundaries per command as defined in the Architecture **When** each command's workflow specification is reviewed **Then** every command explicitly declares its write boundary: `/scrum-create-ticket` may write `story.md` only; `/scrum-refine-ticket` may write `refinement.md` only; `/scrum-refine-story` may write `plan.md` and status in `story.md` only; `/scrum-dev-story` may write source code and test files only; `/scrum-review-story` may write `review-N.md` only; `/scrum-approve` may write `approval-N.md` and status in `story.md` only; `/scrum-verify` may write `verification-report.md` only

2. **Given** the Markdown-as-Code paradigm where specifications are the enforcement mechanism **When** a command workflow is executed by an AI agent **Then** the workflow specification explicitly instructs the agent what it may and may not write **And** anti-patterns are documented in the specification: "implementation agent MUST NOT modify story.md", "review agent MUST NOT modify source code"

3. **Given** the Architecture specifies write boundary anti-patterns (Spec Drift, Self-Fix, Bounded Authority Violation) **When** write boundaries are enforced **Then** each command workflow includes explicit anti-pattern warnings **And** the agent is instructed to halt and report if it detects a write boundary would be violated

## Tasks / Subtasks

- [x] Task 1: Add Write Boundary Rules section to `commands/create-ticket.md` (AC: #1, #2, #3)
  - [x] 1.1 Add `## Write Boundary Rules` section at the end of `scrum_workflow/commands/create-ticket.md`
  - [x] 1.2 Declare "may write": `_scrum-output/sprints/SW-XXX/story.md` (new file only, `status: draft`)
  - [x] 1.3 Declare "may NOT write": `refinement.md`, `plan.md`, `review-*.md`, `approval-N.md`, source code files, `scrum_workflow/`
  - [x] 1.4 Add anti-pattern warning: "MUST NOT overwrite existing story.md — halt with Status Guard Violation if story already exists"
  - [x] 1.5 Sync identical section to `create-scrum-workflow/scrum_workflow/commands/create-ticket.md`
  - [x] 1.6 Sync identical section to `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md`

- [x] Task 2: Add Write Boundary Rules section to `commands/refine-ticket.md` (AC: #1, #2, #3)
  - [x] 2.1 Add `## Write Boundary Rules` section at the end of `scrum_workflow/commands/refine-ticket.md`
  - [x] 2.2 Declare "may write": `_scrum-output/sprints/SW-XXX/story.md` (status update and synthesized content only), `_scrum-output/sprints/SW-XXX/refinement.md` (new file)
  - [x] 2.3 Declare "may NOT write": `plan.md`, `review-*.md`, `approval-N.md`, source code files, `scrum_workflow/`
  - [x] 2.4 Add anti-pattern warning: "MUST NOT modify story content beyond status and synthesized perspectives; MUST NOT write plan.md — that belongs to /scrum-refine-story"

- [x] Task 3: Add Write Boundary Rules section to `commands/dev-story.md` (AC: #1, #2, #3)
  - [x] 3.1 Add `## Write Boundary Rules` section at the end of `scrum_workflow/commands/dev-story.md`
  - [x] 3.2 Declare "may write": source code files and test files (per plan.md guidance), `_scrum-output/sprints/SW-XXX/story.md` (status field only: `status: in-progress`)
  - [x] 3.3 Declare "may NOT write": `_scrum-output/sprints/SW-XXX/plan.md` (read-only), `_scrum-output/sprints/SW-XXX/refinement.md` (read-only), `_scrum-output/sprints/SW-XXX/review-*.md`, `_scrum-output/sprints/SW-XXX/approval-N.md`, `scrum_workflow/`
  - [x] 3.4 Add anti-pattern warnings: "Spec Drift: implementation agent MUST NOT modify story.md content (only status field)", "Self-Fix: implementation agent MUST NOT validate its own work — validation is done by separate commands"

- [x] Task 4: Fix Write Boundary Rules section in `commands/refine-story.md` (AC: #1, #2)
  - [x] 4.1 Read current `scrum_workflow/commands/refine-story.md` Write Boundary Rules section
  - [x] 4.2 Fix "may NOT write" list: remove `plan.md` from the prohibited list (it IS written on PASS, per the Output section and `workflows/refine-story.md`)
  - [x] 4.3 Update "may write" list to include `_scrum-output/sprints/SW-XXX/plan.md` (created on validation PASS)
  - [x] 4.4 Add anti-pattern warning: "MUST NOT modify story acceptance criteria or task content — validation is read-only for story body"
  - [x] 4.5 Sync corrected section to `create-scrum-workflow/scrum_workflow/commands/refine-story.md`
  - [x] 4.6 Sync corrected section to `create-scrum-workflow/templates/scrum_workflow/commands/refine-story.md`

- [x] Task 5: Verify and enhance existing Write Boundary sections (AC: #2, #3)
  - [x] 5.1 Verify `commands/review-story.md` Write Boundary section matches architecture table and add anti-pattern warnings if missing: "Self-Fix: review agent MUST NOT modify source code — review is read-only for code"
  - [x] 5.2 Verify `commands/approve.md` Write Boundary section matches architecture table and add anti-pattern warnings if missing: "Bounded Authority Violation: approval agent MUST NOT modify refinement.md, plan.md, or source code"
  - [x] 5.3 Update the error format in `workflows/approval.md` Step 6.3 to use the Architecture-standard error format: `❌ Write Boundary Violation: {description}` with `**Details:**` and `**Next Step:**` (currently uses non-standard "Error:" prefix)

- [x] Task 6: Write ATDD tests (RED phase) for all 3 ACs (AC: #1, #2, #3)
  - [x] 6.1 Create `tests/unit/write-boundary-enforcement/ac1-boundary-declarations.spec.ts` — verify all 6 command files have `## Write Boundary Rules` section with "may write" and "may NOT write" lists
  - [x] 6.2 Create `tests/unit/write-boundary-enforcement/ac2-anti-pattern-warnings.spec.ts` — verify key commands include explicit anti-pattern language: "MUST NOT modify", "Spec Drift", "Self-Fix", or equivalent
  - [x] 6.3 Create `tests/unit/write-boundary-enforcement/ac3-halt-on-violation.spec.ts` — verify commands instruct agent to halt and report on write boundary violation; verify `❌ Write Boundary Violation:` format in workflow files that have runtime enforcement

- [x] Task 7: Activate ATDD tests (GREEN phase) — confirm implementation is complete (AC: #1–#3)
  - [x] 7.1 Run all tests in `tests/unit/write-boundary-enforcement/` and confirm they pass
  - [x] 7.2 If any test fails, fix the command or workflow file (do NOT modify the test expectations)
  - [x] 7.3 Confirm tests pass for all 3 ACs

## Dev Notes

### Critical Context: What Story 3.3 Implements

This story adds **explicit write boundary declarations** to command files that are currently missing them, and fixes one incorrect write boundary in `commands/refine-story.md`. It is the third story in Epic 3 ("Lifecycle Guards & Write Boundaries") and directly implements FR-9.

**Paradigm reminder**: This is Markdown-as-Code. The specification IS the enforcement. There is no runtime write-boundary check — the instruction to the AI agent in the specification file is the enforcement mechanism. Adding `## Write Boundary Rules` to a command file tells the AI agent reading that command what it may and may not do.

**This story is documentation/specification work only** — same paradigm as Stories 3.1 and 3.2. No JavaScript runtime code changes. All changes are to Markdown specification files.

### Current State of Write Boundaries (CRITICAL GAP ANALYSIS)

**Commands WITH Write Boundary sections (existing):**
| Command File | Section Present | Issues |
|-------------|-----------------|--------|
| `commands/approve.md` | ✅ Yes | Verify anti-pattern warnings |
| `commands/refine-story.md` | ✅ Yes (BUGGY) | plan.md listed as "may NOT write" but Output section + workflow BOTH say it IS written on PASS |
| `commands/review-story.md` | ✅ Yes | Verify anti-pattern warnings |

**Commands MISSING Write Boundary sections (must add):**
| Command File | Status |
|-------------|--------|
| `commands/create-ticket.md` | ❌ Missing — must add |
| `commands/dev-story.md` | ❌ Missing — must add |
| `commands/refine-ticket.md` | ❌ Missing — must add |

**Note:** `/scrum-verify` command does NOT exist yet (Phase 3 planned feature). Do NOT create this command. The AC mentions it but since the command file doesn't exist, skip the verify command — only handle the 6 existing commands.

### Architecture Write Boundary Table (AUTHORITATIVE — from `_bmad-output/planning-artifacts/architecture.md` §4)

This is the definitive specification to match:

| Phase/Command | May Write | May NOT Write |
|----------------|----------|------------------|
| `/scrum-create-ticket` | `story.md`, `status: draft` | All other files |
| `/scrum-refine-ticket` | `refinement.md` | `story.md`, source code, `plan.md` |
| `/scrum-refine-story` | `plan.md`, status in `story.md` | `refinement.md`, source code |
| `/scrum-dev-story` | Source code, test files | `story.md`, `plan.md`, `refinement.md` |
| `/scrum-review-story` | `review-N.md` | Source code, `story.md` |
| `/scrum-approve` | `approval-N.md`, status in `story.md` | Source code, `refinement.md` |
| `/scrum-verify` | `verification-report.md` | Source code, `story.md` |

**Important discrepancy to resolve for `/scrum-refine-ticket`:** The architecture table says refine-ticket may NOT write `story.md`, but the actual workflow (`workflows/refinement.md`) shows it updates `story.md` status from `draft` → `refinement` → `refined` and appends synthesized content. The command Output section also lists `story.md` as an output. **Resolution**: The command file implementation should follow the workflow file behavior (it DOES write story.md for status/synthesis) rather than the strict architecture table. Document this precisely: "may write `story.md` for status transitions and synthesized content ONLY; may NOT write story.md acceptance criteria independently".

**Discrepancy with `/scrum-refine-story`:** Current `commands/refine-story.md` has `plan.md` in "may NOT write" list — this is WRONG. Both the Output section (lines 36-38) and `workflows/refine-story.md` (lines 345-348) confirm `plan.md` IS written on validation PASS. Fix this bug.

### Anti-Pattern Warning Language (from Architecture — CRITICAL)

The Architecture defines three named anti-patterns that MUST appear in the write boundary sections:

| Anti-Pattern Name | Definition | Command Where Warning Belongs |
|-------------------|-----------|-------------------------------|
| **Spec Drift** | Implementation agent modifies `story.md` content | `commands/dev-story.md` |
| **Self-Fix** | Review agent modifies source code | `commands/review-story.md` |
| **Bounded Authority Violation** | Agent writes outside defined boundary (general) | All commands, especially `commands/approve.md` |

Each command's Write Boundary section should include at minimum an explicit "MUST NOT" instruction for its highest-risk violation.

### Standard Error Format for Write Boundary Violations (from Story 3.2)

When a write boundary violation is detected, use the Architecture error format:
```
❌ Write Boundary Violation: {command} attempted to write '{file_path}'

**Details:** The {command} command is not permitted to write to this file. Allowed write targets are: {list}.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```

**Note:** The `workflows/approval.md` Step 6.3 currently uses a non-standard `Error:` prefix (not `❌ Write Boundary Violation:`). Update it to use the standard format. This is consistent with the pattern established by Story 3.2 for status guard errors.

### File Structure (CRITICAL)

```
scrum_workflow/
├── commands/
│   ├── create-ticket.md         ← ADD Write Boundary Rules section
│   ├── dev-story.md             ← ADD Write Boundary Rules section
│   ├── refine-ticket.md         ← ADD Write Boundary Rules section
│   ├── refine-story.md          ← FIX Write Boundary Rules section (plan.md bug)
│   ├── review-story.md          ← VERIFY + enhance anti-pattern warnings
│   └── approve.md               ← VERIFY + enhance anti-pattern warnings
└── workflows/
    └── approval.md              ← UPDATE Step 6.3 error format to standard ❌ format
create-scrum-workflow/
├── scrum_workflow/commands/
│   ├── create-ticket.md         ← SYNC (keep in sync with primary)
│   └── refine-story.md          ← SYNC (keep in sync with primary)
└── templates/scrum_workflow/commands/
    ├── create-ticket.md         ← SYNC (keep in sync with primary)
    └── refine-story.md          ← SYNC (keep in sync with primary)
tests/
└── unit/
    └── write-boundary-enforcement/
        ├── ac1-boundary-declarations.spec.ts   ← CREATE (RED phase)
        ├── ac2-anti-pattern-warnings.spec.ts   ← CREATE (RED phase)
        └── ac3-halt-on-violation.spec.ts       ← CREATE (RED phase)
```

**DO NOT modify:**
- `scrum_workflow/context/standards.md` — complete from Story 3.1, read-only
- `scrum_workflow/docs/05-state-machine.md` — complete from Story 3.1, read-only
- `scrum_workflow/skills/status-guard-validation/SKILL.md` — complete from Story 3.2, read-only
- `scrum_workflow/utils/*.js` — no runtime changes (Markdown-as-Code paradigm)
- Test files once created (tests define the spec; if they fail, fix the command file, not the test)

### Synchronized Copy Rule (from Story 3.2 Dev Notes)

Files modified in `scrum_workflow/commands/` must be synced to their copies in:
1. `create-scrum-workflow/scrum_workflow/commands/` (if file exists there)
2. `create-scrum-workflow/templates/scrum_workflow/commands/` (if file exists there)

**Story 3.2 learned**: `create-ticket.md` and `review-story.md` required sync; failing to sync caused artifact-contract test failures. Apply same discipline here.

Confirmed copies exist (per filesystem check):
- `create-scrum-workflow/scrum_workflow/commands/create-ticket.md` ← sync
- `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md` ← sync
- `create-scrum-workflow/scrum_workflow/commands/refine-story.md` ← sync
- `create-scrum-workflow/templates/scrum_workflow/commands/refine-story.md` ← sync

Note: `dev-story.md` and `refine-ticket.md` exist in create-scrum-workflow but may not need sync (check if their copies are referenced by artifact-contract tests before syncing).

### Testing Pattern (Follow Story 3.2 approach — ATDD file content verification)

Tests are ATDD-style file content verification using Vitest + TypeScript. Pattern from `tests/unit/status-guard-validation/`:

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

const CMD_FILE = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');

describe('AC1: Write boundary declarations in command files', () => {
  test.skip('create-ticket.md has Write Boundary Rules section', () => {
    const content = readFileSync(CMD_FILE, 'utf8');
    expect(content).toMatch(/## Write Boundary Rules/);
    expect(content).toMatch(/This workflow may write/);
    expect(content).toMatch(/This workflow may NOT write/);
  });
});
```

**Create tests FIRST (Task 6 before Task 7).** Write spec files with `test.skip()`, then implement changes (Tasks 1–5), then activate tests (Task 7).

- Tests use `readFileSync` to load Markdown files and `expect(content).toMatch(regex)` to assert content
- Tests start as `test.skip()` (RED phase), then converted to `test()` (GREEN phase) after implementation
- Each AC gets its own spec file: `ac1-*.spec.ts`, `ac2-*.spec.ts`, `ac3-*.spec.ts`
- Test file location: `tests/unit/write-boundary-enforcement/`

### Previous Story Intelligence (Stories 3.1 and 3.2)

**From Story 3.1:**
- `scrum_workflow/context/standards.md` is the authoritative state machine — do NOT modify
- All commands reference `standards.md` for valid transitions — do NOT re-define lifecycle in this story
- This story is specification-only work — no runtime JS files

**From Story 3.2:**
- Error format established: `❌ {Error Type}: {description}` with `**Details:**` and `**Next Step:**`
- The Write Boundary Violation error type should follow same pattern: `❌ Write Boundary Violation: {description}`
- Synchronized copies in `create-scrum-workflow/` are enforced by `tests/unit/artifact-contract/` tests — failure to sync will cause test failures
- Story 3.2 completion note: `commands/dev-story.md` already had standard error format. For this story, dev-story.md is MISSING the Write Boundary Rules section entirely — add it.
- Status guards check BEFORE file writes; write boundary violations should also be caught BEFORE the write occurs

### Git Context (Recent Work Patterns)

Most recent commit: `test(story-3.2): add traceability report — GATE PASS` (74/74 tests passing, story 3.2 advanced to review)

Story 3.2 modified these files (informational — some are now READ-ONLY for this story):
- `scrum_workflow/skills/status-guard-validation/SKILL.md` (read-only for 3.3)
- `scrum_workflow/commands/approve.md` — verify write boundary section, add anti-pattern warnings
- `scrum_workflow/commands/review-story.md` — verify write boundary section, add anti-pattern warnings
- `scrum_workflow/commands/refine-ticket.md` — ADD write boundary section (3.2 only added Error Handling)
- `scrum_workflow/commands/refine-story.md` — FIX write boundary section bug (3.2 only added Error Handling)
- `scrum_workflow/commands/create-ticket.md` — ADD write boundary section (3.2 only added Error Handling)

### Architecture Compliance

- **Markdown-as-Code paradigm**: All changes are Markdown file updates only — no `.js` files touched
- **FR-9**: Write boundary enforcement per command — the Write Boundary Rules section in each command file IS the enforcement
- **Write Boundary error format**: `❌ Write Boundary Violation:` with `**Details:**` and `**Next Step:**` (consistent with Story 3.2 patterns)
- **NFR-9 (Inspectability)**: All write boundary violations must be human-readable without tooling
- **NFR-14 (Error Recovery)**: Every error must suggest the next action
- **NFR-4 (Atomic File Operations)**: Document that write boundary checks happen BEFORE any file write (guard-first pattern, same as status guards)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3]
- [Source: _bmad-output/planning-artifacts/architecture.md#4-Write-Boundary-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#7-Error-Message-Patterns]
- [Source: scrum_workflow/commands/create-ticket.md]
- [Source: scrum_workflow/commands/dev-story.md]
- [Source: scrum_workflow/commands/refine-ticket.md]
- [Source: scrum_workflow/commands/refine-story.md]
- [Source: scrum_workflow/commands/review-story.md]
- [Source: scrum_workflow/commands/approve.md]
- [Source: scrum_workflow/workflows/approval.md#Step-6-Write-Boundary-Rules]
- [Source: _bmad-output/implementation-artifacts/3-2-implement-status-guard-validation.md#Dev-Notes]
- [Source: _bmad-output/implementation-artifacts/3-1-consolidate-9-state-lifecycle-definition.md#Dev-Notes]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None

### Completion Notes List

- All 6 command files verified to have complete `## Write Boundary Rules` sections with "may write", "may NOT write", and Anti-Pattern Warning subsections
- Tasks 1–5 were already implemented in a prior session (the command files already contained complete Write Boundary sections): create-ticket.md, refine-ticket.md, dev-story.md had sections added; refine-story.md bug fixed (plan.md moved from prohibited to allowed); review-story.md and approve.md Anti-Pattern Warnings added; workflows/approval.md Step 6.3 already used standard `❌ Write Boundary Violation:` format
- Task 6: ATDD tests existed as `test.skip()` files — activated by converting all 64 tests from `test.skip(` to `test(` in 3 spec files
- Task 7: All 64 tests confirmed passing (64/64 GREEN)
- Also synced `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md` and both copies of `create-scrum-workflow/scrum_workflow/commands/review-story.md` and `create-scrum-workflow/templates/scrum_workflow/commands/review-story.md` to resolve artifact-contract sync test failures
- Full regression suite: 268 tests pass; 5 pre-existing parse-error failures in `research-update-mode` and `review-story` spec files (unrelated to this story, present before any changes)

### File List

- `tests/unit/write-boundary-enforcement/ac1-boundary-declarations.spec.ts` — activated (test.skip → test, 32 tests)
- `tests/unit/write-boundary-enforcement/ac2-anti-pattern-warnings.spec.ts` — activated (test.skip → test, 15 tests)
- `tests/unit/write-boundary-enforcement/ac3-halt-on-violation.spec.ts` — activated (test.skip → test, 17 tests)
- `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md` — synced with primary (added Write Boundary Rules section)
- `create-scrum-workflow/scrum_workflow/commands/review-story.md` — synced with primary (added Anti-Pattern Warning)
- `create-scrum-workflow/templates/scrum_workflow/commands/review-story.md` — synced with primary (added Anti-Pattern Warning)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — status updated to review

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-08 | Story created — ready-for-dev | claude-sonnet-4-6 |
| 2026-04-08 | All 64 ATDD tests activated and passing; sync copies updated; story marked review | claude-sonnet-4-6 |
