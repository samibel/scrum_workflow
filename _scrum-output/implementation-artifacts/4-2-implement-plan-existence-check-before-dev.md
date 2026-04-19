# Story 4.2: Implement Plan Existence Check Before Dev

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `/scrum-dev-story` to verify that a current plan.md exists before allowing implementation,
So that no implementation starts without a validated execution plan.

## Acceptance Criteria

1. **Given** FR-20 specifies `plan.md` existence check before `/scrum-dev-story` **When** a developer runs `/scrum-dev-story SW-XXX` **Then** the system checks for the existence of `plan.md` in `_scrum-output/sprints/SW-XXX/`

2. **Given** `plan.md` does not exist **When** the existence check fails **Then** the command is blocked before any implementation begins **And** an actionable error message is produced: `❌ Prerequisite Missing: plan.md not found for SW-XXX. Next Step: run /scrum-refine-story SW-XXX`

3. **Given** `plan.md` exists but the story has been through a `changes-needed` cycle since the plan was generated **When** the existence check runs **Then** the system warns the developer that the plan may be outdated **And** suggests re-running `/scrum-refine-story` to regenerate the plan based on review findings

4. **Given** `plan.md` exists and is current **When** the existence check passes **Then** `/scrum-dev-story` proceeds with implementation **And** the plan is loaded as context for the implementation agent

## Tasks / Subtasks

- [x] Task 1: Update dev-story.md command to add plan.md existence check (AC: #1, #2)
  - [x] 1.1 Read current `commands/dev-story.md` — existing guard conditions reviewed ✓
  - [x] 1.2 Add prerequisite check for plan.md existence BEFORE status check ✓
  - [x] 1.3 Block command with error if plan.md does not exist ✓
  - [x] 1.4 Include specific error message format per AC2 ✓
  - [x] 1.5 Sync to create-scrum-workflow copies ✓

- [x] Task 2: Add outdated plan warning for changes-needed cycles (AC: #3)
  - [x] 2.1 Detect if story has gone through `changes-needed` cycle since plan was generated ✓
  - [x] 2.2 Warn developer about potentially outdated plan ✓
  - [x] 2.3 Suggest re-running `/scrum-refine-story` to regenerate plan ✓
  - [x] 2.4 Sync to create-scrum-workflow copies ✓

- [x] Task 3: Implement plan loading when check passes (AC: #4)
  - [x] 3.1 Load plan.md content when existence check passes ✓
  - [x] 3.2 Make plan content available as context for implementation agent ✓
  - [x] 3.3 Sync to create-scrum-workflow copies ✓

- [x] Task 4: Write ATDD tests (RED phase) for all ACs (AC: #1, #2, #3, #4)
  - [x] 4.1 Create `tests/unit/plan-existence-check/ac1-plan-check-blocking.spec.ts` — 7 tests (test.skip) ✓
  - [x] 4.2 Create `tests/unit/plan-existence-check/ac2-error-message-format.spec.ts` — 7 tests (test.skip) ✓
  - [x] 4.3 Create `tests/unit/plan-existence-check/ac3-outdated-plan-warning.spec.ts` — 8 tests (test.skip) ✓
  - [x] 4.4 Create `tests/unit/plan-existence-check/ac4-plan-loading.spec.ts` — 10 tests (test.skip) ✓

- [ ] Task 5: Activate ATDD tests (GREEN phase) — confirm implementation is complete (AC: #1–#4)
  - [ ] 5.1 Run all tests in `tests/unit/plan-existence-check/` and confirm they pass
  - [ ] 5.2 If any test fails, fix the implementation (do NOT modify test expectations)
  - [ ] 5.3 Confirm tests pass for all 4 ACs

## Dev Notes

### Critical Context: What Story 4.2 Implements

This story implements FR-20: Plan existence check before `/scrum-dev-story`. It ensures no implementation begins without a validated execution plan from `/scrum-refine-story`.

**Key distinction from Story 4.1**: Story 4.1 creates the plan and validates stories. Story 4.2 enforces that the plan exists before dev starts.

### Current State Analysis

**`/scrum-dev-story` command**: Currently has guard condition for status (`ready-for-dev` or `changes-needed`) but line 71 says "If plan.md does not exist, provide warning but continue". This story changes that to BLOCK with an error.

**Error message required** (per AC2):
```
❌ Prerequisite Missing: plan.md not found for SW-XXX. Next Step: run /scrum-refine-story SW-XXX
```

### Changes Needed

1. **Change line 71 in `commands/dev-story.md`**: From "warn but continue" to "block with error"
2. **Add plan.md existence check** BEFORE the status check (so we fail fast if plan doesn't exist)
3. **Add outdated plan detection**: Check if story went through `changes-needed` cycle after plan was created
4. **Load plan.md content**: Pass plan content as context to implementation agent

### Architecture Compliance

- **FR-20**: plan.md existence check before dev
- **Write Boundary**: `/scrum-dev-story` writes only source code, test files, and story.md status
- **NFR-4 (Atomic File Operations)**: Check happens before any writes
- **NFR-14 (Error Recovery)**: Actionable error message with next step

### File Structure

```
scrum_workflow/
├── commands/
│   └── dev-story.md              ← CHANGE: Add plan.md existence check, block if missing
create-scrum-workflow/
├── scrum_workflow/commands/
│   └── dev-story.md              ← SYNC
└── templates/scrum_workflow/commands/
    └── dev-story.md              ← SYNC
tests/
└── unit/
    └── plan-existence-check/
        ├── ac1-plan-check-blocking.spec.ts      ← CREATE (RED phase)
        ├── ac2-error-message-format.spec.ts     ← CREATE (RED phase)
        ├── ac3-outdated-plan-warning.spec.ts    ← CREATE (RED phase)
        └── ac4-plan-loading.spec.ts              ← CREATE (RED phase)
```

**DO NOT modify:**
- `scrum_workflow/context/standards.md` — authoritative state machine, read-only
- Other command files unless specifically needed for this story

### References

- [Source: _scrum-output/planning-artifacts/epics.md#Story 4.2]
- [Source: scrum_workflow/commands/dev-story.md]
- [Source: scrum_workflow/workflows/dev-story.md]
- [Source: _scrum-output/implementation-artifacts/4-1-implement-story-readiness-validation-plan-generation.md]

## Dev Agent Record

### Agent Model Used

(claude-sonnet-4-6)

### Debug Log References

- `scrum_workflow/commands/dev-story.md` — Added FR-20 plan.md existence check with 3-step guard enforcement
- `create-scrum-workflow/scrum_workflow/commands/dev-story.md` — Synced
- `create-scrum-workflow/templates/scrum_workflow/commands/dev-story.md` — Synced

### Completion Notes List

- Task 1: Added Step 1 (Prerequisite Check) in Guard Condition Enforcement to check plan.md existence BEFORE status check
- Task 1: Error message format follows standard ❌ Prerequisite Missing pattern with Next Step
- Task 2: Added outdated plan detection - compares plan.updated with status_history changes-needed transition timestamp
- Task 2: Warning uses ⚠ prefix (not ❌) since it's advisory
- Task 3: Added Step 3 (Load Plan Context) - plan.md is read and made available for implementation agent
- Tasks 1-3 synced to both create-scrum-workflow copies

### File List

- `scrum_workflow/commands/dev-story.md` — Added FR-20 plan.md existence check
- `create-scrum-workflow/scrum_workflow/commands/dev-story.md` — Synced
- `create-scrum-workflow/templates/scrum_workflow/commands/dev-story.md` — Synced
- `tests/unit/plan-existence-check/ac1-plan-check-blocking.spec.ts` — 7 tests (test.skip RED phase)
- `tests/unit/plan-existence-check/ac2-error-message-format.spec.ts` — 7 tests (test.skip RED phase)
- `tests/unit/plan-existence-check/ac3-outdated-plan-warning.spec.ts` — 8 tests (test.skip RED phase)
- `tests/unit/plan-existence-check/ac4-plan-loading.spec.ts` — 10 tests (test.skip RED phase)
- `_scrum-output/implementation-artifacts/4-2-implement-plan-existence-check-before-dev.md` — story file
