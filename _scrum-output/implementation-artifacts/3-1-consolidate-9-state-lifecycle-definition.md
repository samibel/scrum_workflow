# Story 3.1: Consolidate 9-State Lifecycle Definition

Status: review

## Story

As a developer,
I want a single source of truth for the 9-state story lifecycle including all valid transitions,
So that every command and agent operates against the same state machine definition.

## Acceptance Criteria

1. **Given** FR-4 specifies a 9-state lifecycle: draft, refined, ready-for-dev, in-progress, review, approved, done, changes-needed, cancelled **When** the existing state machine implementation is compared against the current PRD **Then** a delta analysis documents: which states exist, which transitions are defined, and what is missing **And** all identified deltas are resolved

2. **Given** Epic 2 introduced new transitions (review → changes-needed, changes-needed → in-progress, approved → done via /scrum-approve) **When** the lifecycle definition is consolidated **Then** all 9 states are defined in a single, authoritative location **And** all valid transitions are explicitly enumerated including: draft → refined, refined → ready-for-dev, ready-for-dev → in-progress, in-progress → review, review → approved, review → changes-needed, changes-needed → in-progress, approved → done, any → cancelled **And** invalid transitions are implicitly defined (anything not listed is invalid)

3. **Given** the consolidated lifecycle definition **When** any command or skill references state transitions **Then** it references this single source of truth **And** no command defines its own transition rules independently

## Tasks / Subtasks

- [x] Task 1: Delta analysis — document current vs PRD-specified lifecycle (AC: #1)
  - [x] 1.1 Compare all 9 PRD states against `scrum_workflow/context/standards.md` Story Status State Machine section
  - [x] 1.2 Compare all 9 PRD states against `scrum_workflow/docs/05-state-machine.md`
  - [x] 1.3 Compare all 9 PRD states against `scrum_workflow/skills/status-guard-validation/SKILL.md`
  - [x] 1.4 Document gaps: the `refinement` intermediate state (not in FR-4), missing `any → cancelled` transition, `cancelled` state not in transition table of `standards.md`
- [x] Task 2: Update `scrum_workflow/context/standards.md` as single authoritative source of truth (AC: #2, #3)
  - [x] 2.1 Update the "Story Status State Machine" section to list exactly 9 states per FR-4 (remove `refinement` from the 9-state count, OR reconcile its presence with the PRD)
  - [x] 2.2 Add explicit `any → cancelled` transition to the Valid Transitions table in `standards.md`
  - [x] 2.3 Add `cancelled` to the Status Values table with trigger and guard
  - [x] 2.4 Add a clear "AUTHORITATIVE SOURCE" header or note stating this is the single source of truth
- [x] Task 3: Update `scrum_workflow/docs/05-state-machine.md` to reference `standards.md` (AC: #3)
  - [x] 3.1 Remove or clearly defer duplicate transition definitions in `docs/05-state-machine.md`
  - [x] 3.2 Add `any → cancelled` to State Transition Diagram and Guard Conditions table
  - [x] 3.3 Add explicit note: "Authoritative definition lives in `scrum_workflow/context/standards.md`"
- [x] Task 4: Update `scrum_workflow/skills/status-guard-validation/SKILL.md` to reference `standards.md` (AC: #3)
  - [x] 4.1 Add `any → cancelled` to the Valid Transitions list
  - [x] 4.2 Add reference to `scrum_workflow/context/standards.md` as the source of truth for valid transitions
  - [x] 4.3 Ensure the Valid status values list matches exactly the 9 states in `standards.md`
- [x] Task 5: Verify no command defines its own independent transition rules (AC: #3)
  - [x] 5.1 Audit `scrum_workflow/commands/*.md` — each command must only declare its required/sets status, not re-enumerate the full lifecycle
  - [x] 5.2 Audit `scrum_workflow/workflows/*.md` — any inline lifecycle definitions should reference `standards.md`
  - [x] 5.3 Confirm `scrum_workflow/skills/prerequisite-validation/SKILL.md` references `standards.md` for guard conditions

## Dev Notes

### Critical Delta Found — Must Resolve

**The `refinement` state discrepancy:**
- FR-4 lists 9 states: `draft, refined, ready-for-dev, in-progress, review, approved, done, changes-needed, cancelled`
- Current `standards.md` Story Status State Machine table has 9 rows but includes `refinement` as a distinct status and the architecture.md lists `cancelled` as a valid status value
- Current `docs/05-state-machine.md` also includes the `refinement` state
- Resolution approach: The `refinement` state was introduced in Epic 1 for tracking the multi-agent refinement process. It is a sub-phase of `draft → refined`. The developer must decide: either add `refinement` as a 10th state with proper documentation noting the deviation from FR-4, OR treat `refinement` as an internal agent-only state that is not surfaced in the 9-state public lifecycle. **The safest approach per the PRD is to keep the 9 stated states in the authoritative definition and note `refinement` as an internal/ephemeral sub-status.**

**The `cancelled` transition gap:**
- `standards.md` lists `cancelled` in valid status values but the Valid Transitions table does NOT include `any → cancelled`
- `status-guard-validation/SKILL.md` lists `cancelled` in valid values but no transition definition
- Architecture.md lists `cancelled` as a valid status value
- Must add: `any → cancelled | (manual decision) | Explicit user cancellation` to the transitions table

### Authoritative Source of Truth: `scrum_workflow/context/standards.md`

This is the primary document that all commands, workflows, and skills MUST reference. Do NOT create a new file for the lifecycle definition — consolidate into the existing `standards.md` "Story Status State Machine" section.

### Files to Modify (Write Boundaries for Story 3.1)

This story is about **documentation and specification consolidation only**. No source code or runtime utilities change.

| File | Action | Scope |
|------|--------|-------|
| `scrum_workflow/context/standards.md` | Update | Story Status State Machine section — add `cancelled` transition, mark as authoritative |
| `scrum_workflow/docs/05-state-machine.md` | Update | Add `any → cancelled`, add reference to `standards.md` |
| `scrum_workflow/skills/status-guard-validation/SKILL.md` | Update | Add `any → cancelled` transition, reference `standards.md` |

**DO NOT modify:**
- `scrum_workflow/utils/*.js` — no runtime changes in this story
- `scrum_workflow/commands/*.md` — commands may define their own required/sets_status in frontmatter; that is acceptable per architecture. Only inline full lifecycle re-definitions should be removed
- `scrum_workflow/workflows/*.md` — workflows should not be refactored in this story

### The 9 States (Per FR-4 — This is the Authoritative List)

| # | Status | Description |
|---|--------|-------------|
| 1 | `draft` | Story created, not yet refined |
| 2 | `refined` | Refinement complete, awaiting validation |
| 3 | `ready-for-dev` | Validated and ready for implementation |
| 4 | `in-progress` | Development in progress |
| 5 | `review` | Implementation complete, awaiting review |
| 6 | `approved` | Review passed, awaiting human sign-off |
| 7 | `done` | Story complete with human approval (terminal) |
| 8 | `changes-needed` | Review found issues requiring fixes |
| 9 | `cancelled` | Story cancelled (terminal, from any state) |

**Note on `refinement`:** The current implementation uses `refinement` as a transitional sub-state during `/scrum-refine-ticket` execution. This is not in FR-4's 9 states. The authoritative definition should clarify: `refinement` is an implementation-internal state used only during the agent spawning process of `/scrum-refine-ticket`. It MUST be listed in `standards.md` valid status values to prevent validation errors on stories currently in this state.

### All Valid Transitions (Authoritative — Must Be in standards.md)

| From | To | Trigger | Guard |
|------|----|---------|-------|
| `draft` | `refinement` | `/scrum-refine-ticket` | status == draft |
| `refinement` | `refined` | `/scrum-refine-ticket` completion | refinement agents complete |
| `refined` | `ready-for-dev` | `/scrum-refine-story` | all 5 validation criteria PASS |
| `refined` | `refined` | `/scrum-refine-story` | any validation criterion FAIL (unchanged) |
| `ready-for-dev` | `in-progress` | `/scrum-dev-story` | status == ready-for-dev |
| `in-progress` | `review` | `/scrum-dev-story review` | status == in-progress |
| `review` | `approved` | `/scrum-review-story` | verdict == APPROVED |
| `review` | `changes-needed` | `/scrum-review-story` | verdict == CHANGES-NEEDED |
| `changes-needed` | `in-progress` | `/scrum-dev-story` | status == changes-needed |
| `approved` | `done` | `/scrum-approve` | explicit user sign-off |
| `any` | `cancelled` | manual decision | explicit user cancellation |

### Architecture Compliance

- **Markdown-as-Code paradigm**: Changes are Markdown file updates only — no external processes, no database
- **Single source of truth**: `scrum_workflow/context/standards.md` is the designated authoritative location per the Architecture document's "Enforcement Guidelines" section
- **Status value format**: All status values MUST use `kebab-case` (e.g., `changes-needed`, `ready-for-dev`)
- **Error format**: When guard violations are displayed, use the standard error format from Architecture: `❌ Status Guard Violation: {description}` with `**Details:**` and `**Next Step:**`
- **Write Boundaries**: This story modifies only Markdown specification files — `standards.md`, `docs/05-state-machine.md`, `skills/status-guard-validation/SKILL.md`
- **NFR-9 (Inspectability)**: Resulting consolidated definition must be human-readable without any tooling
- **NFR-14 (Error Recovery)**: Actionable error messages must reference the authoritative transitions list

### Previous Story Intelligence (from Epic 2)

From Story 2.3 (Rejection Flow) and 2.4 (Multi-Round Review Tracking):
- The `changes-needed → in-progress` and `review → changes-needed` transitions were successfully implemented
- Review and approval artifacts use sequential numbering: `review-N.md`, `approval-N.md`
- Status history entries MUST include `actor` field (e.g., `actor: synthesis-skill`)
- All status transitions use atomic write pattern in `utils/status_history.js`
- The `changes-needed` state is fully wired into `dev-story`, `review-story`, and `approve` commands

### What Story 3.2 Depends On (Critical for correctness)

Story 3.2 ("Implement Status Guard Validation") will consume the authoritative transitions list created in this story. The format MUST be:
- Machine-readable table in `standards.md` with consistent column structure
- Clear guard conditions expressed in a way the guard skill can interpret
- The `any → cancelled` transition must be explicitly enumerated (not implicit)

### Testing Approach

This story produces only specification/documentation changes. Testing is verification-based:
1. Read `standards.md` and confirm: exactly 9+ states in the table (9 from FR-4, plus `refinement` noted separately), all transitions enumerated, `any → cancelled` present
2. Read `docs/05-state-machine.md` and confirm: references `standards.md` as authoritative, no conflicting transition definitions
3. Read `skills/status-guard-validation/SKILL.md` and confirm: references `standards.md`, includes `any → cancelled`
4. Grep all `commands/*.md` and `workflows/*.md` for inline lifecycle re-definitions (there should be none after this story)

### Project Structure Context

```
scrum_workflow/
├── context/
│   └── standards.md          ← PRIMARY: Story Status State Machine section (single source of truth)
├── docs/
│   └── 05-state-machine.md   ← SECONDARY: References standards.md, adds diagrams
├── skills/
│   └── status-guard-validation/
│       └── SKILL.md           ← CONSUMER: References standards.md for valid transitions
└── commands/
    └── *.md                   ← CONSUMERS: Declare required/sets_status only
```

### References

- [Source: _scrum-output/planning-artifacts/prd.md#FR-4]
- [Source: _scrum-output/planning-artifacts/epics.md#Story 3.1]
- [Source: _scrum-output/planning-artifacts/architecture.md#Status Value Format]
- [Source: scrum_workflow/context/standards.md#Story Status State Machine]
- [Source: scrum_workflow/docs/05-state-machine.md]
- [Source: scrum_workflow/skills/status-guard-validation/SKILL.md]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — implementation proceeded without errors or blockers.

### Completion Notes List

- **Delta Analysis (Task 1):** Confirmed all 3 target files were audited against FR-4's 9-state lifecycle. Key gaps documented: (a) `refinement` sub-state exists in implementation but is not an FR-4 official state; (b) `any → cancelled` transition was missing from transition tables; (c) `cancelled` state was referenced in valid status values but not in the Valid Transitions table of `standards.md`.
- **Task 2 — standards.md:** File already contained the AUTHORITATIVE SOURCE designation, all 9 FR-4 states, the `refinement` implementation-internal note, the `cancelled` status row, and the `any → cancelled` transition in the Valid Transitions table. All subtasks verified complete.
- **Task 3 — docs/05-state-machine.md:** File already referenced `standards.md` as authoritative source at the top, included `cancelled` state in Status Values table, `any → cancelled` in Guard Conditions table, and `cancelled` transitions in the mermaid diagram. All subtasks verified complete.
- **Task 4 — skills/status-guard-validation/SKILL.md:** File already referenced `standards.md` as authoritative, listed all 10 status values (9 FR-4 + `refinement`), and included `any → cancelled` in Valid Transitions. All subtasks verified complete.
- **Task 5 — Audit:** Identified that `approve.md` and `dev-story.md` contained full lifecycle reference tables without referencing `standards.md` as the authority. Added explicit `standards.md` references to both files. Added `standards.md` reference to `skills/prerequisite-validation/SKILL.md` Context Rules → Reads section.
- **Tests:** All 47 ATDD tests converted from RED phase (`test.skip()`) to GREEN phase (`test()`) — all 47 pass. Tests verify all 3 ACs across all modified files.

### File List

- `_scrum-output/implementation-artifacts/3-1-consolidate-9-state-lifecycle-definition.md` — Story file (tasks, status, dev record updated)
- `scrum_workflow/commands/approve.md` — Added `standards.md` reference in Relationship to Other Commands section
- `scrum_workflow/commands/dev-story.md` — Added `standards.md` reference in Valid Status Transitions heading
- `scrum_workflow/skills/prerequisite-validation/SKILL.md` — Added `standards.md` reference in Context Rules → Reads section
- `tests/unit/lifecycle-consolidation/ac1-delta-analysis.spec.ts` — Converted from `test.skip()` to `test()` (RED → GREEN)
- `tests/unit/lifecycle-consolidation/ac2-single-source-of-truth.spec.ts` — Converted from `test.skip()` to `test()` (RED → GREEN)
- `tests/unit/lifecycle-consolidation/ac3-no-independent-definitions.spec.ts` — Converted from `test.skip()` to `test()` (RED → GREEN)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-08 | Audited and verified all 3 target files (standards.md, 05-state-machine.md, status-guard-validation/SKILL.md) already contain the complete 9-state lifecycle definition with `any → cancelled` and AUTHORITATIVE SOURCE designation | claude-sonnet-4-6 |
| 2026-04-08 | Added `standards.md` reference to `approve.md` and `dev-story.md` command files that contained full lifecycle reference tables without citing the authoritative source | claude-sonnet-4-6 |
| 2026-04-08 | Added `standards.md` reference to `skills/prerequisite-validation/SKILL.md` Context Rules → Reads section | claude-sonnet-4-6 |
| 2026-04-08 | Activated 47 ATDD tests (converted from `test.skip()` to `test()`) — all 47 pass, confirming all 3 ACs satisfied | claude-sonnet-4-6 |
| 2026-04-08 | Fixed all 11 code review issues: removed duplicate transition list from dev-story.md; fixed `cancelled` guard wording ("any non-terminal state") in both standards.md and status-guard-validation/SKILL.md; improved `refinement` Guard column wording in standards.md; added `any → cancelled` prose note to 05-state-machine.md; removed Guard Conditions duplicate table from 05-state-machine.md; fixed approve.md reference formatting; removed cosmetic-only reference from prerequisite-validation/SKILL.md; added Human (manual) write boundary row to standards.md | claude-sonnet-4-6 |
