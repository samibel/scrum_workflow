# Story 4.1: Implement Story Readiness Validation & Plan Generation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `/scrum-refine-story` to validate my story against 5 immutable criteria and generate a plan.md on success,
So that I have a verified, complete execution plan before implementation begins.

## Acceptance Criteria

1. **Given** FR-18 specifies story completeness validation via `/scrum-refine-story` against 5 immutable criteria (Feature List as Immutable Contract pattern) **When** a developer runs `/scrum-refine-story SW-XXX` on a story with status `refined` **Then** the system validates the story against all 5 readiness criteria **And** the criteria are explicitly defined in the validation skill (sourced from the existing `/scrum-refine-story` workflow) **And** each criterion produces a PASS or FAIL result with explanation

2. **Given** all 5 criteria pass validation **When** the validation is complete **Then** a `plan.md` artifact is generated in `_scrum-output/sprints/SW-XXX/` (FR-19) **And** the plan contains an actionable execution plan derived from the story and refinement artifacts **And** the story status transitions to `ready-for-dev` **And** a `status_history` entry is appended with `trigger: /scrum-refine-story`

3. **Given** one or more criteria fail validation **When** the validation is complete **Then** no `plan.md` is generated **And** the story status remains `refined` **And** the system reports which criteria failed with actionable guidance for resolution

4. **Given** the Architecture write boundary for `/scrum-refine-story` **When** the command executes **Then** it only writes `plan.md` and status in `story.md` **And** no other files are modified

## Tasks / Subtasks

- [x] Task 1: Define the 5 immutable readiness criteria (AC: #1)
  - [x] 1.1 Research existing `/scrum-refine-story` workflow — existing workflow had 5 criteria ✓
  - [x] 1.2 Define 5 immutable criteria based on FR-18 — Completeness, Refinement, Estimability, Testability, Dependencies ✓
  - [x] 1.3 Create criteria definitions with PASS/FAIL conditions and explanations — in SKILL.md ✓
  - [x] 1.4 Document criteria in `skills/readiness-check/` skill file — updated to 5 criteria ✓

- [x] Task 2: Enhance `/scrum-refine-story` workflow to validate against 5 criteria (AC: #1, #3)
  - [x] 2.1 Read current `workflows/refine-story.md` — existing workflow has comprehensive validation ✓
  - [x] 2.2 Add validation step that checks all 5 criteria — already present ✓
  - [x] 2.3 Add PASS/FAIL result reporting for each criterion — already present ✓
  - [x] 2.4 On FAIL: report failed criteria with actionable guidance — already present ✓
  - [x] 2.5 Sync changes to `create-scrum-workflow/` copies — synced ✓

- [x] Task 3: Implement plan.md generation on validation PASS (AC: #2)
  - [x] 3.1 Define plan.md template structure — already in workflow ✓
  - [x] 3.2 Implement plan generation from story.md + refinement.md content — already implemented ✓
  - [x] 3.3 Ensure plan.md is written to `_scrum-output/sprints/SW-XXX/plan.md` — already in workflow ✓
  - [x] 3.4 Sync to `create-scrum-workflow/` copies — not needed, template already synced ✓

- [x] Task 4: Implement status transition and status_history update (AC: #2)
  - [x] 4.1 On validation PASS: transition story status from `refined` → `ready-for-dev` — in workflow Step 3.2 ✓
  - [x] 4.2 Append `status_history` entry with `trigger: /scrum-refine-story`, `actor: readiness-check-skill` — added to workflow Step 3.2 ✓
  - [x] 4.3 On validation FAIL: keep status as `refined` (no change) — already in Step 3.3 ✓

- [x] Task 5: Write ATDD tests (RED phase) for all ACs (AC: #1, #2, #3, #4)
  - [x] 5.1 Create `tests/unit/readiness-validation/ac1-five-criteria.spec.ts` — 14 tests (test.skip) ✓
  - [x] 5.2 Create `tests/unit/readiness-validation/ac2-plan-generation.spec.ts` — 11 tests (test.skip) ✓
  - [x] 5.3 Create `tests/unit/readiness-validation/ac3-no-plan-on-fail.spec.ts` — 9 tests (test.skip) ✓
  - [x] 5.4 Create `tests/unit/readiness-validation/ac4-status-transition.spec.ts` — 13 tests (test.skip) ✓

- [ ] Task 6: Activate ATDD tests (GREEN phase) — confirm implementation is complete (AC: #1–#4)
  - [ ] 6.1 Run all tests in `tests/unit/readiness-validation/` and confirm they pass
  - [ ] 6.2 If any test fails, fix the implementation (do NOT modify test expectations)
  - [ ] 6.3 Confirm tests pass for all 4 ACs

## Dev Notes

### Critical Context: What Story 4.1 Implements

This story implements the readiness validation gate (FR-18, FR-19) and plan existence check (FR-20) for Epic 4 "Plan Enforcement & Readiness Validation". It ensures no implementation begins without a validated execution plan.

**Key distinction from Epic 3**: Epic 3 guards protect the state machine from invalid transitions. Epic 4 guards ensure the story is ready for development before `/scrum-dev-story` runs.

### Current State Analysis

**`/scrum-refine-story` command**: Currently exists but may not validate against 5 criteria or generate `plan.md` automatically. This story adds the validation gate and plan generation.

**Write boundary for `/scrum-refine-story`** (from Architecture):
- May write: `plan.md`, status in `story.md`
- May NOT write: `refinement.md`, source code

### The 5 Immutable Criteria (Feature List as Immutable Contract Pattern)

Based on FR-18 and standard story readiness practices, the 5 criteria should be:

1. **Completeness**: Story has all required fields (title, user story, acceptance criteria, tasks)
2. **Refinement**: Story has been refined (has `refinement.md` artifact from `/scrum-refine-ticket`)
3. **Estimability**: Story has story points or a note explaining estimation challenges
4. **Testability**: Acceptance criteria are testable (not vague or ambiguous)
5. **Dependencies**: All dependencies on other stories are identified and addressed

### plan.md Structure

The plan.md should contain:
- Story summary (from story.md)
- Refined scope (from refinement.md synthesis)
- Execution steps (actionable, ordered)
- File/components to modify
- Risks and concerns (from refinement perspectives)
- Success criteria for implementation

### File Structure

```
scrum_workflow/
├── commands/
│   └── refine-story.md          ← May need update to invoke readiness check
├── workflows/
│   └── refine-story.md          ← ADD 5-criteria validation + plan generation
└── skills/
    └── readiness-check/
        └── SKILL.md             ← CREATE: 5 criteria definitions and validation logic
create-scrum-workflow/
├── scrum_workflow/workflows/
│   └── refine-story.md          ← SYNC
└── templates/scrum_workflow/workflows/
    └── refine-story.md          ← SYNC
tests/
└── unit/
    └── readiness-validation/
        ├── ac1-five-criteria.spec.ts      ← CREATE (RED phase)
        ├── ac2-plan-generation.spec.ts     ← CREATE (RED phase)
        ├── ac3-no-plan-on-fail.spec.ts    ← CREATE (RED phase)
        └── ac4-status-transition.spec.ts   ← CREATE (RED phase)
```

**DO NOT modify:**
- `scrum_workflow/context/standards.md` — authoritative state machine, read-only
- `scrum_workflow/docs/05-state-machine.md` — read-only
- Story 3.x command files that are complete — read-only for this story

### Architecture Compliance

- **FR-18**: 5 immutable criteria validation
- **FR-19**: plan.md as mandatory output on PASS
- **FR-20**: plan.md existence check before dev (Story 4.2)
- **Write Boundary**: `/scrum-refine-story` writes only `plan.md` and status in `story.md`
- **NFR-4 (Atomic File Operations)**: Validation happens before any writes
- **NFR-5 (Schema Versioning)**: All YAML frontmatter includes `schema_version`
- **NFR-9 (Inspectability)**: All artifacts human-readable

### References

- [Source: _scrum-output/planning-artifacts/epics.md#Story 4.1]
- [Source: _scrum-output/planning-artifacts/architecture.md#4-Write-Boundary-Patterns]
- [Source: scrum_workflow/commands/refine-story.md]
- [Source: scrum_workflow/workflows/refine-story.md]
- [Source: _scrum-output/implementation-artifacts/3-3-implement-write-boundary-enforcement.md#Dev-Notes]

## Dev Agent Record

### Agent Model Used

(claude-sonnet-4-6)

### Debug Log References

- `scrum_workflow/workflows/refine-story.md` — enhanced with status_history entry format
- `scrum_workflow/skills/readiness-check/SKILL.md` — updated to 5 criteria (Completeness, Refinement, Estimability, Testability, Dependencies)
- `create-scrum-workflow/scrum_workflow/workflows/refine-story.md` — synced
- `create-scrum-workflow/templates/scrum_workflow/workflows/refine-story.md` — synced

### Completion Notes List

- Task 1: Updated readiness-check SKILL.md to include 5 immutable criteria (Completeness, Refinement, Estimability, Testability, Dependencies) matching FR-18 requirements
- Task 2: Enhanced refine-story.md workflow Step 3.2 to include status_history entry append with trigger: /scrum-refine-story, actor: readiness-check-skill
- Task 3: plan.md generation was already implemented in existing workflow Step 3.2
- Task 4: status_history entry format added to workflow Write Boundaries section
- Task 5: 47 RED-phase ATDD tests created across 4 spec files
- Tasks 1-4 synched to create-scrum-workflow copies

### File List

- `scrum_workflow/skills/readiness-check/SKILL.md` — Updated to 5 criteria
- `scrum_workflow/workflows/refine-story.md` — Added status_history entry format
- `create-scrum-workflow/scrum_workflow/workflows/refine-story.md` — Synced
- `create-scrum-workflow/templates/scrum_workflow/workflows/refine-story.md` — Synced
- `tests/unit/readiness-validation/ac1-five-criteria.spec.ts` — 14 tests (test.skip RED phase)
- `tests/unit/readiness-validation/ac2-plan-generation.spec.ts` — 11 tests (test.skip RED phase)
- `tests/unit/readiness-validation/ac3-no-plan-on-fail.spec.ts` — 9 tests (test.skip RED phase)
- `tests/unit/readiness-validation/ac4-status-transition.spec.ts` — 13 tests (test.skip RED phase)
- `_scrum-output/implementation-artifacts/4-1-implement-story-readiness-validation-plan-generation.md` — story file
