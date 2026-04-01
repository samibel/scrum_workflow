# Story 11.1: scrum-refine-story — Validation Agent (Feature List as Immutable Contract)

Status: review

## Story

As a developer,
I want a dedicated validation agent that checks story completeness before implementation,
So that only truly ready stories enter development and I can choose a different model for validation.

## Context

This is Story 11.1 of Epic 11: Agent Pattern Split. The epic splits the monolithic dev-story workflow into three focused agents following agentic patterns from [agentic-patterns.com](https://www.agentic-patterns.com/patterns). Each agent applies a single pattern for maximum focus and This enables per-step model selection.

**Epic Goal:** After this epic, the monolithic dev-story workflow is split into three focused agents:
1. **scrum-refine-story** — Validation agent using "Feature List as Immutable Contract" pattern (THIS STORY)
2. **scrum-dev-story** — Simplified implementation agent using "Inversion of Control" pattern (Story 11.2)
3. **scrum-review-story** — Review agent using "AI-Assisted Code Review / Verification" pattern (Story 11.3)

**Story Dependency Map:**
- Stories 11.1, 11.2, and 11.3 can be worked in **parallel** (no dependencies)
- All three stories should be completed together for full workflow

## Acceptance Criteria

### AC1: Command File Created
**Given** a story file exists with `status: refined`
**When** the user runs `/scrum-refine-story SW-XXX`
**Then** `scrum_workflow/commands/refine-story.md` exists in SKILL.md command format with:
- `trigger: /refine-story`
- `requires_status: refined`
- `sets_status: ready-for-dev`

### AC2: Workflow File Created
**Given** the command file exists
**When** the workflow is created
**Then** `scrum_workflow/workflows/refine-story.md` exists with validation workflow containing:
- Load story with `status: refined`
- Validate against immutable checklist
- Set status: `ready-for-dev` or keep `refined`

### AC3: Immutable Checklist Validation
**Given** the validation workflow runs
**When** the agent validates the story
**Then** the agent validates the story against an immutable checklist:
- All acceptance criteria are testable and unambiguous
- All tasks/subtasks are clearly defined
- Dev Notes section contains necessary context
- No placeholders or TODO markers in story content
- Dependencies are identified and documented

### AC4: Validation Report with Pass/Fail
**Given** the validation completes
**When** the agent produces output
**Then** the agent produces a validation report with `passes: true/false` for each criterion

### AC5: No Story Content Modification
**Given** the validation agent runs
**When** the agent processes the story
**Then** the agent **MAY NOT** modify story content — only set validation flags

### AC6: Status Update on All Pass
**Given** ALL criteria pass
**When** the agent completes validation
**Then** `story.md` status is updated to `ready-for-dev`

### AC7: Status Preserved on Any Fail
**Given** ANY criterion fails
**When** the agent completes validation
**Then** `story.md` status remains `refined` with failure reasons documented

### AC8: Validation Report Appended
**Given** validation completes (pass or fail)
**When** the report is generated
**Then** the validation report is appended to `sprints/SW-XXX/refinement.md`

### AC9: Lean Workflow
**Given** the validation workflow
**When** executed
**Then** the workflow is lean: Load → Validate → Set Status (no planning, no implementation)

## Tasks / Subtasks

- [x] Task 1: Create command file `scrum_workflow/commands/refine-story.md` (AC: 1)
  - [x] 1.1 Create SKILL.md format file with YAML frontmatter
  - [x] 1.2 Define trigger as `/refine-story`
  - [x] 1.3 Set `requires_status: refined`
  - [x] 1.4 Set `sets_status: ready-for-dev`
  - [x] 1.5 Add purpose description and input/output sections

- [x] Task 2: Create workflow file `scrum_workflow/workflows/refine-story.md` (AC: 2, 9)
  - [x] 2.1 Define lean 3-step workflow: Load → Validate → Set Status
  - [x] 2.2 Implement story loading step
  - [x] 2.3 Implement validation step with immutable checklist
  - [x] 2.4 Implement status update step

- [x] Task 3: Implement immutable checklist (AC: 3, 4)
  - [x] 3.1 Define checklist items for story completeness
  - [x] 3.2 Implement pass/fail evaluation for each item
  - [x] 3.3 Create validation report format

- [x] Task 4: Implement status transitions (AC: 6, 7)
  - [x] 4.1 Implement status update to `ready-for-dev` on all pass
  - [x] 4.2 Implement status preservation with failure documentation on any fail
  - [x] 4.3 Ensure atomic write operations (NFR1)

- [x] Task 5: Update refinement.md (AC: 8)
  - [x] 5.1 Append validation report to refinement.md
  - [x] 5.2 Include timestamp and pass/fail status

## Dev Notes

### Agentic Pattern: Feature List as Immutable Contract

**Pattern Source:** [Feature List as Immutable Contract](https://www.agentic-patterns.com/patterns/feature-list-as-immutable-contract)

**Key Principles:**
1. **Immutable Requirements:** The checklist acts as an immutable contract — the agent validates against it but cannot modify it.
2. **Binary Pass/Fail:** Each criterion must `passes: false → true` — agent cannot modify requirements.
3. **Prevents Premature Ready:** The immutable nature prevents the agent from marking a story "ready" when it's not.

**How This Applies:**
- The validation agent reads the story file with `status: refined`
- The agent validates against a predefined checklist (immutable contract)
- The agent CAN ONLY set `passes: false → true` for each criterion
- The agent CANNOT modify, story content, acceptance criteria, or tasks
- If all criteria pass: status updates to `ready-for-dev`
- If any criterion fails: status remains `refined`, failure documented

### Relationship to Existing refine-ticket Command

**Important:** This is a NEW command, NOT a replacement for `refine-ticket`.

| Command | Purpose | Status Transition | Pattern |
|---------|---------|-------------------|---------|
| `/scrum-refine-ticket` | Multi-agent refinement (Architect, Dev, QA perspectives) | `draft` → `refinement` | Parallel agent spawning |
| `/scrum-refine-story` | Validation-only agent (immutable checklist) | `refined` → `ready-for-dev` | Feature List as Immutable Contract |

**Workflow:**
1. User runs `/scrum-refine-ticket SW-XXX` to get multi-agent refinement
2. Status moves from `draft` → `refinement`
3. User reviews perspectives, accepts/rejects
4. User runs `/scrum-refine-story SW-XXX` to validate completeness
5. Status moves from `refinement` → `ready-for-dev` (if validation passes)

### Project Structure Notes

**Files to Create:**
```
scrum_workflow/
├── commands/
│   └── refine-story.md         # NEW: validation command
└── workflows/
    └── refine-story.md         # NEW: validation workflow
```

**Existing Files to Reference:**
- `scrum_workflow/commands/refine-ticket.md` - Existing refinement command (for reference)
- `scrum_workflow/workflows/refinement.md` - Existing refinement workflow (for reference)
- `scrum_workflow/skills/readiness-check/SKILL.md` - Existing readiness check skill (for checklist inspiration)
- `scrum_workflow/context/standards.md` - Project standards (for validation)

### Immutable Checklist Items

The validation agent checks these criteria:

| # | Criterion | What to Check |
|---|----------|---------|
| 1 | Acceptance Criteria | All acceptance criteria are testable and unambiguous |
| 2 | Tasks Defined | All tasks/subtasks are clearly defined |
| 3 | Dev Notes | Dev Notes section contains necessary context |
| 4 | No Placeholders | No placeholders or TODO markers in story content |
| 5 | Dependencies | Dependencies are identified and documented |

### Validation Report Format

```markdown
## Validation Report

**Story:** SW-XXX
**Date:** YYYY-MM-DD
**Overall:** PASS / FAIL

### Checklist Results

| # | Criterion | Status | Notes |
|---|----------|--------|-------|
| 1 | Acceptance Criteria | PASS / FAIL | [Details if FAIL] |
| 2 | Tasks Defined | PASS / FAIL | [Details if FAIL] |
| 3 | Dev Notes | PASS / FAIL | [Details if FAIL] |
| 4 | No Placeholders | PASS / FAIL | [Details if FAIL] |
| 5 | Dependencies | PASS / FAIL | [Details if FAIL] |

### Failure Reasons (if any)
- [List specific failure reasons]
```

### State Machine Impact

This story introduces a new status value `refined` which fits between `refinement` and `ready-for-dev`:

**Updated State Transitions:**
```
refinement → ready-for-dev  (via /scrum-refine-story, all criteria PASS)
refinement → refinement   (via /scrum-refine-story, any criterion FAIL - status unchanged)
```

**Note:** Story 11.4 will update the state machine documentation to reflect this new flow.

### References

- [Agentic Patterns: Feature List as Immutable Contract](https://www.agentic-patterns.com/patterns/feature-list-as-immutable-contract) [Source: Epic 11 story definition]
- [Architecture Decision 3: Story File Schema & State Machine](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/planning-artifacts/architecture.md#decision-3-story-file-schema--state-machine) [Source: architecture.md]
- [scrum_workflow/commands/refine-ticket.md](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/commands/refine-ticket.md) [Source: existing implementation]
- [scrum_workflow/workflows/refinement.md](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/workflows/refinement.md) [Source: existing implementation]
- [scrum_workflow/skills/readiness-check/SKILL.md](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/skills/readiness-check/SKILL.md) [Source: existing skill]

### Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/story.md` - Status field only (`status: ready-for-dev` or unchanged)
- `_scrum-output/sprints/SW-XXX/refinement.md` - Append validation report

This workflow may NOT write
- `plan.md` - Managed by readiness-check
- `review-*.md` - Managed by `/scrum-dev-story`
- `approval.md` - Managed by approval workflow
- `scrum_workflow/` - Framework files are read-only during execution
- `_scrum-output/context/` - Context files are managed by `/scrum-create-project-context`

## Dev Agent Record

### Agent Model Used

Claude (claude-3-5-sonnet-20241022)

### Debug Log References

None required - implementation was straightforward.

### Completion Notes List

- Created `scrum_workflow/commands/refine-story.md` with SKILL.md format containing YAML frontmatter,- trigger `/scrum-refine-story`, requires_status: `refined`, sets_status: `ready-for-dev`
- Created `scrum_workflow/workflows/refine-story.md` with lean 3-step workflow (Load → Validate → Set Status)
- Implemented 5-criterion immutable checklist validation
- Implemented status transitions (PASS → ready-for-dev, FAIL → refined with documentation)
- Implemented validation report appending to refinement.md
- Applied "Feature List as Immutable Contract" agentic pattern

### File List

- scrum_workflow/commands/refine-story.md (NEW)
- scrum_workflow/workflows/refine-story.md (NEW)
