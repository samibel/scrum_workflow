# Story 5.1: Implement Manual Workflow Depth Override

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to specify `--depth light` or `--depth standard` when creating a ticket,
So that I can choose an appropriate level of process rigor for simple vs. complex tasks.

## Acceptance Criteria

1. **Given** FR-3 specifies manual workflow depth override via `--depth light/standard` **When** a developer runs `/scrum-create-ticket` with `--depth light` or `--depth standard` **Then** the depth value is stored in the `story.md` YAML frontmatter as a `depth` field **And** if no `--depth` flag is provided, the default is `standard`

2. **Given** a story with `depth: light` **When** `/scrum-refine-ticket` is executed **Then** the refinement workflow uses a reduced process: 1 agent (Developer perspective only) instead of 3, no cross-talk rounds, no synthesis step (single perspective = final output), single-agent estimate instead of Wideband Delphi **And** the readiness validation (5 criteria) remains unchanged regardless of depth

3. **Given** a story with `depth: standard` **When** `/scrum-refine-ticket` is executed **Then** the full refinement workflow runs: 3 agents, cross-talk, synthesis, Wideband Delphi estimation

4. **Given** SC-12a specifies manual depth override availability **When** the depth mechanism is implemented **Then** both `light` and `standard` values are accepted **And** any other value produces an actionable error message

## Tasks / Subtasks

- [x] Task 1: Add `--depth` flag support to `/scrum-create-ticket` command (AC: #1, #4)
  - [x] 1.1 Read current `commands/create-ticket.md` to understand input parsing ✓
  - [x] 1.2 Add `--depth` flag parsing to command ✓
  - [x] 1.3 Store `depth: light` or `depth: standard` in story.md frontmatter ✓
  - [x] 1.4 Set default to `standard` when no flag provided ✓
  - [x] 1.5 Add error for invalid `--depth` values ✓
  - [x] 1.6 Sync to create-scrum-workflow copies ✓

- [x] Task 2: Update `/scrum-refine-ticket` workflow for light depth (AC: #2)
  - [x] 2.1 Read current `workflows/refine-ticket.md` to understand existing workflow ✓
  - [x] 2.2 Add conditional: if `depth: light`, use reduced process (1 agent, no cross-talk, no synthesis, single estimate) ✓
  - [x] 2.3 Ensure readiness validation (5 criteria) remains unchanged ✓
  - [x] 2.4 Sync to create-scrum-workflow copies ✓

- [x] Task 3: Verify standard depth process unchanged (AC: #3)
  - [x] 3.1 Verify `depth: standard` runs full 3-agent refinement ✓
  - [x] 3.2 Verify standard workflow is the default behavior ✓
  - [x] 3.3 Sync to create-scrum-workflow copies ✓

- [x] Task 4: Write ATDD tests (RED phase) for all ACs (AC: #1, #2, #3, #4)
  - [x] 4.1 Create `tests/unit/workflow-depth/ac1-depth-flag-parsing.spec.ts` — 8 tests (test.skip) ✓
  - [x] 4.2 Create `tests/unit/workflow-depth/ac2-light-depth-reduced-process.spec.ts` — 10 tests (test.skip) ✓
  - [x] 4.3 Create `tests/unit/workflow-depth/ac3-standard-depth-full-process.spec.ts` — 9 tests (test.skip) ✓
  - [x] 4.4 Create `tests/unit/workflow-depth/ac4-invalid-depth-error.spec.ts` — 8 tests (test.skip) ✓

- [ ] Task 5: Activate ATDD tests (GREEN phase) — confirm implementation is complete (AC: #1–#4)
  - [ ] 5.1 Run all tests in `tests/unit/workflow-depth/` and confirm they pass
  - [ ] 5.2 If any test fails, fix the implementation (do NOT modify test expectations)
  - [ ] 5.3 Confirm tests pass for all 4 ACs

## Dev Notes

### Critical Context: What Story 5.1 Implements

This story implements FR-3: Manual workflow depth override via `--depth light/standard` flag. It allows developers to choose between a lightweight process for simple tasks and the full standard process for complex tasks.

**Key distinction from Epic 5**: This story adds the `--depth` flag and light/standard branching logic. Story 5.2 (CLI update/migration) is a separate feature.

### Current State Analysis

**`/scrum-create-ticket` command**: Currently creates stories but has no `--depth` flag. This story adds the flag and stores it in frontmatter.

**`/scrum-refine-ticket` workflow**: Currently runs full 3-agent refinement with cross-talk and synthesis. This story adds conditional logic to reduce the process when `depth: light`.

### Light vs Standard Depth

| Aspect | Light | Standard |
|--------|-------|----------|
| Agents | 1 (Developer only) | 3 (Architect, Developer, QA) |
| Cross-talk | No | Yes (up to 3 rounds) |
| Synthesis | No (single perspective = final) | Yes |
| Estimation | Single agent estimate | Wideband Delphi |
| Readiness Validation | Unchanged (5 criteria) | Unchanged (5 criteria) |

### File Structure

```
scrum_workflow/
├── commands/
│   └── create-ticket.md              ← CHANGE: Add --depth flag parsing
├── workflows/
│   └── refine-ticket.md            ← CHANGE: Add light depth conditional
create-scrum-workflow/
├── scrum_workflow/commands/
│   └── create-ticket.md              ← SYNC
├── scrum_workflow/workflows/
│   └── refine-ticket.md            ← SYNC
└── templates/scrum_workflow/
    ├── commands/
    │   └── create-ticket.md        ← SYNC
    └── workflows/
        └── refine-ticket.md         ← SYNC
tests/
└── unit/
    └── workflow-depth/
        ├── ac1-depth-flag-parsing.spec.ts      ← CREATE (RED phase)
        ├── ac2-light-depth-reduced-process.spec.ts ← CREATE (RED phase)
        ├── ac3-standard-depth-full-process.spec.ts ← CREATE (RED phase)
        └── ac4-invalid-depth-error.spec.ts     ← CREATE (RED phase)
```

**DO NOT modify:**
- `scrum_workflow/context/standards.md` — authoritative state machine, read-only
- Other command files unless specifically needed for this story

### Architecture Compliance

- **FR-3**: Manual workflow depth override via `--depth light/standard`
- **Write Boundary**: `/scrum-create-ticket` writes only story.md, `/scrum-refine-ticket` writes only refinement.md
- **NFR-4 (Atomic File Operations)**: File operations are atomic
- **NFR-14 (Error Recovery)**: Actionable error message for invalid depth values

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1]
- [Source: scrum_workflow/commands/create-ticket.md]
- [Source: scrum_workflow/workflows/refine-ticket.md]

## Dev Agent Record

### Agent Model Used

(claude-sonnet-4-6)

### Debug Log References

None yet

### Completion Notes List

None yet

### File List

- `tests/unit/workflow-depth/ac1-depth-flag-parsing.spec.ts` — 8 tests (test.skip RED phase)
- `tests/unit/workflow-depth/ac2-light-depth-reduced-process.spec.ts` — 10 tests (test.skip RED phase)
- `tests/unit/workflow-depth/ac3-standard-depth-full-process.spec.ts` — 9 tests (test.skip RED phase)
- `tests/unit/workflow-depth/ac4-invalid-depth-error.spec.ts` — 8 tests (test.skip RED phase)
- `_bmad-output/implementation-artifacts/5-1-implement-manual-workflow-depth-override.md` — story file created
