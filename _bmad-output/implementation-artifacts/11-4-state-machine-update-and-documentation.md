# Story 11.4: State Machine Update & Documentation

Status: review

## Story

As a developer,
I want the state machine and documentation updated to reflect the new three-agent workflow,
So that users understand the new flow and commands work correctly.

## Context

This is Story 11.4 of Epic 11: Agent Pattern Split. The epic splits the monolithic dev-story workflow into three focused agents following agentic patterns from [agentic-patterns.com](https://www.agentic-patterns.com/patterns). Each agent applies a single pattern for maximum focus and enables per-step model selection.

**Epic Goal:** After this epic, the monolithic dev-story workflow is split into three focused agents:
1. **scrum-refine-story** — Validation agent using "Feature List as Immutable Contract" pattern (Story 11.1)
2. **scrum-dev-story** — Simplified implementation agent using "Inversion of Control" pattern (Story 11.2)
3. **scrum-review-story** — Review agent using "AI-Assisted Code Review / Verification" pattern (Story 11.3)

**This Story (11.4):** Updates documentation to reflect the new three-agent workflow. This is a documentation-only story that touches:
- `scrum_workflow/docs/05-state-machine.md` — Update status transitions
- `scrum_workflow/docs/04-command-reference.md` — Add entries for new commands
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Update status definitions
- `README.md` — Explain the three-agent pattern split workflow

**Story Dependency Map:**
- Stories 11.1, 11.2, and 11.3 are prerequisites (commands and workflows already created)
- This story (11.4) documents the completed workflow

## Acceptance Criteria

### AC1: State Machine Documentation Updated
**Given** Stories 11.1, 11.2, and 11.3 are complete
**When** the documentation is updated
**Then** `scrum_workflow/docs/05-state-machine.md` is updated with new status transitions:
  ```
  draft → refinement → refined → ready-for-dev → in-progress → review → approved/changes-needed
                    ↑              ↑               ↑            ↑
              /refine-ticket  /refine-story   /dev-story  /review-story
  ```
**And** the state machine includes all new statuses:
  - `refined` — Story refinement complete, awaiting validation
  - `ready-for-dev` — Story validated and ready for implementation
  - `changes-needed` — Review found issues requiring fixes
  - `approved` — Review passed, ready for final approval

### AC2: Command Reference Updated
**Given** the command reference file exists
**When** the documentation is updated
**Then** `scrum_workflow/docs/04-command-reference.md` is updated with entries for:
  - `/scrum-refine-story` — Validation command
  - `/scrum-dev-story` — Simplified implementation command
  - `/scrum-review-story` — Review command
**And** each command documentation includes:
  - Pattern reference from agentic-patterns.com
  - Status requirements and transitions
  - Recommended model selection

### AC3: Sprint Status Definitions Updated
**Given** the sprint-status.yaml file exists
**When** the documentation is updated
**Then** `sprint-status.yaml` status definitions are updated with new statuses:
  - `refined` — Story refinement complete, awaiting validation
  - `ready-for-dev` — Story validated and ready for implementation
  - `changes-needed` — Review found issues requiring fixes
  - `approved` — Review passed, ready for final approval

### AC4: README Updated
**Given** the README.md exists
**When** the documentation is updated
**Then** README.md is updated to explain the three-agent pattern split workflow
**And** the workflow diagram shows the complete flow with all four Epic 11 commands

## Tasks / Subtasks

- [x] Task 1: Update state machine documentation (AC: 1)
  - [x] 1.1 Read current `scrum_workflow/docs/05-state-machine.md`
  - [x] 1.2 Added new status values to the Status Values table
  - [x] 1.3 Updated State Transition Diagram with new states
  - [x] 1.4 Updated Guard Conditions table with new transitions
  - [x] 1.5 Added new Common Status Patterns for three-agent flow

- [x] Task 2: Update command reference documentation (AC: 2)
  - [x] 2.1 Read current `scrum_workflow/docs/04-command-reference.md`
  - [x] 2.2 Added `/scrum-refine-story` command entry with pattern reference
  - [x] 2.3 Added `/scrum-dev-story` command entry with pattern reference
  - [x] 2.4 Added `/scrum-review-story` command entry with pattern reference
  - [x] 2.5 Updated Human Approval Gate diagram

  - [x] Task 3: Update sprint-status.yaml definitions (AC: 3)
  - [x] 3.1 Read current `sprint-status.yaml`
  - [x] 3.2 Added new status definitions to STATUS DEFINITIONS comment block
  - [x] 3.3 Verified status definitions match state machine documentation

- [x] Task 4: Update README.md (AC: 4)
  - [x] 4.1 Read current `README.md`
  - [x] 4.2 Updated workflow diagram to show all four Epic 11 commands
  - [x] 4.3 Updated commands table with new commands
  - [x] 4.4 Added explanation of three-agent pattern split

## Dev Notes

### Agentic Pattern Reference

This story documents the result of applying three agentic patterns:

| Pattern | Command | Description |
|---------|---------|-------------|
| [Feature List as Immutable Contract](https://www.agentic-patterns.com/patterns/feature-list-as-immutable-contract) | `/scrum-refine-story` | Validation-only agent that checks story against immutable checklist |
| [Inversion of Control](https://www.agentic-patterns.com/patterns/inversion-of-control) | `/scrum-dev-story` | Simplified implementation agent that follows story spec without modification |
| [AI-Assisted Code Review](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification) | `/scrum-review-story` | Review-only agent with separate perspective from implementer |

### Current State Machine (Before Update)

```
draft → refinement → ready → in-dev → in-review → done
```

### New State Machine (After Update)

```
draft → refinement → refined → ready-for-dev → in-progress → review → approved/changes-needed
              ↑              ↑               ↑            ↑
        /refine-ticket  /refine-story   /dev-story  /review-story
```

### Status Value Mapping

| Old Status | New Status | Notes |
|------------|------------|-------|
| `ready` | `ready-for-dev` | More explicit naming |
| `in-dev` | `in-progress` | More standard naming |
| `in-review` | `review` | Shorter, cleaner |
| (new) | `refined` | After refinement, before validation |
| (new) | `approved` | Review passed |
| (new) | `changes-needed` | Review failed, needs fixes |

### Documentation Files to Update

| File | Changes Required |
|------|------------------|
| `scrum_workflow/docs/05-state-machine.md` | Update status values, transition diagram, guard conditions |
| `scrum_workflow/docs/04-command-reference.md` | Add entries for refine-story, dev-story, review-story |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | Update STATUS DEFINITIONS comment block |
| `README.md` | Update workflow diagram and commands table |

### Relationship to Other Epic 11 Commands

| Command | Purpose | Status Transition | Pattern |
|---------|---------|-------------------|---------|
| `/scrum-refine-ticket` | Multi-agent refinement | `draft` → `refinement` | Sub-Agent Spawning |
| `/scrum-refine-story` | Validation-only agent | `refinement` → `ready-for-dev` | Feature List as Immutable Contract |
| `/scrum-dev-story` | Implementation-only agent | `ready-for-dev` → `review` | Inversion of Control |
| `/scrum-review-story` | Review-only agent | `review` → `approved` or `changes-needed` | AI-Assisted Code Review |

### Write Boundary Rules

This workflow may write:
- `scrum_workflow/docs/05-state-machine.md` - Update state machine documentation
- `scrum_workflow/docs/04-command-reference.md` - Add new command entries
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - Update status definitions
- `README.md` - Update workflow and commands documentation

This workflow may NOT write:
- `scrum_workflow/commands/` - Command files are managed by Stories 11.1-11.3
- `scrum_workflow/workflows/` - Workflow files are managed by Stories 11.1-11.3
- `_scrum-output/sprints/` - Sprint files are not relevant to documentation

### Project Structure Notes

**Files to Update (existing):**
```
scrum_workflow/
├── docs/
│   ├── 05-state-machine.md    # UPDATE: new status values and transitions
│   └── 04-command-reference.md # UPDATE: add new command entries
_bmad-output/
└── implementation-artifacts/
    └── sprint-status.yaml      # UPDATE: status definitions
README.md                        # UPDATE: workflow and commands
```

**Files to Reference (read-only):**
- `scrum_workflow/commands/refine-story.md` - Validation command (Story 11.1)
- `scrum_workflow/commands/dev-story.md` - Implementation command (Story 11.2)
- `scrum_workflow/commands/review-story.md` - Review command (Story 11.3)
- `scrum_workflow/workflows/refine-story.md` - Validation workflow
- `scrum_workflow/workflows/dev-story.md` - Implementation workflow (if exists)
- `scrum_workflow/workflows/review-story.md` - Review workflow

### References

- [Agentic Patterns: Feature List as Immutable Contract](https://www.agentic-patterns.com/patterns/feature-list-as-immutable-contract) [Source: Epic 11 story definition]
- [Agentic Patterns: Inversion of Control](https://www.agentic-patterns.com/patterns/inversion-of-control) [Source: Epic 11 story definition]
- [Agentic Patterns: AI-Assisted Code Review / Verification](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification) [Source: Epic 11 story definition]
- [Story 11.1: Validation Agent](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/11-1-refine-story-validation-agent-feature-list-as-immutable-contract.md) [Source: sibling story]
- [Story 11.2: Implementation Agent](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/11-2-dev-story-simplified-implementation-agent-inversion-of-control.md) [Source: sibling story]
- [Story 11.3: Review Agent](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/11-3-review-story-review-agent-ai-assisted-code-review.md) [Source: sibling story]
- [Architecture Decision 3: Story File Schema & State Machine](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/planning-artifacts/architecture.md#decision-3-story-file-schema--state-machine) [Source: architecture.md]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

None required - this is a documentation-only story following established patterns.

### Completion Notes List

- **Task 1 Complete**: Updated state machine documentation with new statuses (refined, ready-for-dev, approved, changes-needed) and new guard conditions for three-agent workflow.
- **Task 2 Complete**: Updated command reference with entries for `/scrum-refine-story`, `/scrum-dev-story`, and `/scrum-review-story` commands. Each includes pattern references from agentic-patterns.com.
- **Task 3 Complete**: Updated sprint-status.yaml status definitions with new story statuses and three-agent workflow notes.
- **Task 4 Complete**: Updated README.md with three-agent workflow diagram, commands table, pattern reference table, and guard conditions for the new workflow.

### File List

- `scrum_workflow/docs/05-state-machine.md` (UPDATED)
- `scrum_workflow/docs/04-command-reference.md` (UPDATED)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (UPDATED)
- `README.md` (UPDATED)
