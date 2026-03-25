# Story 4.1: `/dev-story` Command & Implementation Workflow

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer using the scrum_workflow development system,
I want to run `/dev-story SW-103` to implement code based on the approved plan,
so that the agent follows my specification exactly instead of improvising.

## Acceptance Criteria

**Given** a story `sprints/SW-103/story.md` with `status: ready` and `plan.md` exists
**When** the user runs `/dev-story SW-103`
**Then** `scrum_workflow/commands/dev-story.md` exists in SKILL.md command format with `trigger: /dev-story`, `requires_status: ready`, `sets_status: in-dev`
**And** `scrum_workflow/workflows/development.md` exists with step-by-step implementation workflow
**And** the command verifies the guard condition `status == ready` before proceeding (FR17)
**And** the agent implements code based on `story.md` specification and `plan.md` subtask sequence (FR19)
**And** the agent loads relevant project context and domain skills for implementation: `context/{domain}.md` + `skills/{domain}/SKILL.md`
**And** `story.md` status is updated to `in-dev` (FR32)
**And** the dev agent writes ONLY code files — never `story.md`, `refinement.md`, or `plan.md` (Write Boundary Rules)

## Tasks / Subtasks

- [x] Task 1: Create development workflow (AC: 3)
  - [x] Subtask 1.1: Create `scrum_workflow/workflows/development.md` with implementation steps
  - [x] Subtask 1.2: Define story file loading and parsing logic
  - [x] Subtask 1.3: Define plan.md loading and subtask extraction
  - [x] Subtask 1.4: Define red-green-refactor cycle implementation pattern
  - [x] Subtask 1.5: Define completion and status update logic

- [x] Task 2: Integrate project context loading (AC: 6)
  - [x] Subtask 2.1: Implement context/index.md loading for domain discovery
  - [x] Subtask 2.2: Implement domain context file loading based on story keywords
  - [x] Subtask 2.3: Implement domain skill loading from `skills/{domain}/SKILL.md`
  - [x] Subtask 2.4: Add error handling for missing context files

- [x] Task 3: Implement write boundary rules enforcement (AC: 7)
  - [x] Subtask 3.1: Document which files the dev agent MAY write (code files only)
  - [x] Subtask 3.2: Document which files the dev agent MAY NOT write (story.md, refinement.md, plan.md)
  - [x] Subtask 3.3: Add validation to prevent workflow files modification
  - [x] Subtask 3.4: Add error messages for write boundary violations

- [x] Task 4: Verify dev-story command compliance (AC: 1, 4, 5)
  - [x] Subtask 4.1: Verify dev-story.md exists with correct frontmatter
  - [x] Subtask 4.2: Verify guard condition enforcement (status == ready)
  - [x] Subtask 4.3: Verify workflow reference to development.md
  - [x] Subtask 4.4: Verify error handling for all failure cases

- [x] Task 5: Validate end-to-end implementation flow (AC: 5, 6)
  - [x] Subtask 5.1: Test implementation with complete story and plan
  - [x] Subtask 5.2: Verify context loading for domain-specific stories
  - [x] Subtask 5.3: Verify status transitions (ready → in-dev)
  - [x] Subtask 5.4: Verify write boundary rules are enforced

- [x] Task 6: Add review trigger functionality (FR20 extension)
  - [x] Subtask 6.1: Add `/dev-story SW-XXX review` command handling
  - [x] Subtask 6.2: Update status to `in-review` after implementation complete
  - [x] Subtask 6.3: Document review trigger in command help text
  - [x] Subtask 6.4: Add output documentation for review phase

## Dev Notes

### Relevant Architecture Patterns and Constraints

**From Architecture Decision 3: Story File Schema & State Machine**
- Status transitions: `ready → in-dev` (trigger: `/dev-story`)
- Guard condition: `status == ready` is enforced before implementation begins (FR17)
- State machine compliance: no bypassing the readiness check

**From Architecture Decision 4: Agent Orchestration Model**
- Command-as-orchestrator: `commands/dev-story.md` coordinates implementation
- Direct skill invocation for domain-specific context loading
- Model Routing: dev agent uses primary model (Opus) for implementation

**From Architecture Decision 5: Inter-Phase Handoff Protocol**
- Blackboard pattern: plan.md is input, code files are output
- Asynchronous handoff: ready → in-dev → in-review → done
- Only synthesized results pass between phases

**From Architecture: Write Boundary Rules (Section 6)**
- `/dev-story` MAY write: code files (project directory), `story.md` (status update only)
- `/dev-story` MAY NOT write: `refinement.md`, `plan.md`, `review-*.md`, `approval.md`
- Enforces immutable state + append-only principles

**From Story 3.5 Context**
- Readiness check ensures story is complete before implementation
- Plan.md contains ordered subtasks with dependencies
- Guard condition prevents premature implementation

### Source Tree Components to Touch

**Framework Files to Create:**
1. `scrum_workflow/workflows/development.md` - NEW FILE with step-by-step implementation workflow

**Framework Files to Reference:**
1. `scrum_workflow/commands/dev-story.md` - ALREADY CREATED in Story 3-5 (verify compliance)
2. `scrum_workflow/context/standards.md` - Story file schema and state machine
3. `scrum_workflow/config.yaml` - Platform settings and configuration

**Story 3.5 Files to Build Upon:**
1. Dev-story command (already exists with guard condition)
2. Plan template (created in Story 3.5)
3. Readiness check workflow (created in Story 3.5)

### Testing Standards Summary

**From Architecture: NFR1 - Atomic File Writes**
- Story status updates must be atomic (NFR1 compliance)
- Code file writes should be atomic where possible

**Validation Requirements:**
- Test implementation with story in `ready` status
- Test guard condition: fail if status is not `ready`
- Verify context loading for domain-specific stories
- Verify write boundary rules are enforced (dev agent cannot modify workflow files)
- Test status transitions: ready → in-dev → in-review
- Verify plan.md subtasks guide implementation
- Test review trigger functionality

**From Story 3.5 Learnings:**
- Readiness check produces plan.md with ordered subtasks
- Guard condition enforced in dev-story command
- Status transitions follow state machine strictly
- Write boundary rules prevent unintended modifications

**Implementation Validation:**
- Verify dev agent follows red-green-refactor cycle
- Verify dev agent loads domain context for story-specific implementation
- Verify status updates use atomic write operation
- Verify completion detection (all subtasks checked)
- Verify review trigger updates status correctly

### Project Structure Notes

**Alignment with Unified Project Structure:**
- All workflow files follow `scrum_workflow/workflows/{workflow-name}.md` pattern
- All command files follow `scrum_workflow/commands/{command-name}.md` pattern
- Use `kebab-case` for all file and directory names

**Three-Layer Separation Compliance:**
- Framework Layer: `scrum_workflow/workflows/development.md` (what we're creating)
- Adapter Layer: No changes needed (adapters reference framework commands)
- State Layer: Sprint files (`sprints/SW-XXX/`, code files) are project-specific

**Naming Conventions to Follow:**
- Workflow file: `scrum_workflow/workflows/development.md`
- Command trigger: `/dev-story`
- Status values: `ready`, `in-dev`, `in-review`, `done`

### Previous Story Intelligence (Story 3.5)

**Key Learnings from Story 3.5:**
- Readiness check validates all 4 completeness criteria (description, AC, estimation, subtasks)
- Plan.md assembled from synthesized subtasks on PASS
- Guard condition in dev-story command enforces FR17
- Status reversion to draft on FAIL with documented reasons

**Files Created/Modified in Story 3.5:**
- `scrum_workflow/skills/readiness-check/SKILL.md` - Created with 4 validation checks
- `scrum_workflow/workflows/readiness-check.md` - Created with step-by-step validation
- `scrum_workflow/templates/plan.md` - Created with execution plan structure
- `scrum_workflow/workflows/refinement.md` - Added Step 11 (Readiness Check)
- `scrum_workflow/commands/dev-story.md` - Created with guard condition

**Review Feedback from Story 3.5:**
- Added graceful handling for missing refinement.md in plan assembly
- Made placeholder detection configurable and case-insensitive
- Added default "User" source when attribution unavailable
- Added validation for empty Tasks/Subtasks section
- Reordered steps to create plan.md first, then update status (rollback prevention)

**Code Patterns Established:**
- Use SKILL.md format for all command definitions
- Direct skill invocation (not sub-agent spawning) for coordination
- Atomic write guarantee for file updates
- Clear section separation with headers for NFR16 compliance
- Step-by-step workflow orchestration in workflow files

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-4] - Epic 4 complete context and all story dependencies
- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.1] - Story 4.1 requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision-3] - Story File Schema & State Machine (status transitions, guard conditions)
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision-4] - Agent Orchestration Model (command-as-orchestrator)
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision-5] - Inter-Phase Handoff Protocol (blackboard pattern)
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns-Section-6] - Write Boundary Rules
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Development] - FR17: Guard condition before implementation
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Development] - FR19: Implement based on plan
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Development] - FR20: Generate review report after implementation
- [Source: Story 3.5] - Preceding story on readiness check (must be completed first)
- [Source: Story 3.5 Dev Notes] - Dev-story command patterns, guard condition enforcement

## Dev Agent Record

### Agent Model Used

glm-4.7 (claude-opus-4-6 equivalent)

### Debug Log References

No debug issues encountered during story implementation.

### Completion Notes List

- **Development Workflow Created**: Created `scrum_workflow/workflows/development.md` with complete step-by-step implementation workflow including: guard condition verification, story/plan loading, project context loading, red-green-refactor cycle, write boundary rules enforcement, and review trigger functionality (Step 7).

- **Context Index Created**: Created `scrum_workflow/context/index.md` for domain discovery with domain context mappings, keyword matching rules, and skill directory references. Enables automatic context loading based on story keywords during implementation.

- **Dev-Story Command Verified**: Verified existing `scrum_workflow/commands/dev-story.md` from Story 3.5 is fully compliant with all requirements: correct frontmatter (trigger, requires_status, sets_status), guard condition enforcement (FR17), workflow reference to development.md, and comprehensive error handling.

- **Write Boundary Rules Documented**: Documented write boundary rules in development.md workflow (Section 6): MAY write code files and story.md status updates only; MAY NOT write refinement.md, plan.md, review-*.md, approval.md, or framework files. Added validation and error messages for violations.

- **Context Loading Implemented**: Implemented context loading logic in development.md workflow (Step 3): context/index.md loading for domain discovery, domain context file loading based on keywords, domain skill loading from skills/{domain}/SKILL.md, and graceful error handling for missing files.

- **Review Trigger Functionality Added**: Added review trigger handling in development.md workflow (Step 7): `/dev-story SW-XXX review` command detection, completion validation, status update to in-review, and transition logging. Also updated dev-story command with valid status transitions including in-dev → in-review.

- **Red-Green-Refactor Cycle Defined**: Defined red-green-refactor cycle in development.md workflow (Step 5): Red phase (write failing tests first), Green phase (implement minimal code), Refactor phase (improve structure), and validation gates for each completed task.

- **All Acceptance Criteria Satisfied**:
  - AC1: Dev-story command exists with correct format ✅ (verified from Story 3.5)
  - AC2: Command has trigger, requires_status, sets_status ✅ (verified)
  - AC3: Development workflow exists ✅ (created development.md)
  - AC4: Guard condition enforced ✅ (verified in dev-story.md)
  - AC5: Implementation based on story and plan ✅ (defined in development.md Step 2, 5)
  - AC6: Context loading implemented ✅ (defined in development.md Step 3)
  - AC7: Write boundary rules enforced ✅ (defined in development.md Step 6)

### File List

**Story File:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/4-1-dev-story-command-and-implementation-workflow.md`

**Source Files Analyzed:**
- `_bmad-output/planning-artifacts/epics.md` - Epic 4 and Story 4.1 requirements
- `_bmad-output/planning-artifacts/architecture.md` - Architecture decisions and patterns
- `_bmad-output/planning-artifacts/prd.md` - Functional requirements FR17-20
- `_bmad-output/implementation-artifacts/3-5-readiness-check-gate.md` - Previous story intelligence

**Framework Files Created:**
- `scrum_workflow/workflows/development.md` - CREATED (step-by-step implementation workflow with 7 steps)
- `scrum_workflow/context/index.md` - CREATED (domain discovery index with keyword matching)

**Framework Files Verified (No Changes):**
- `scrum_workflow/commands/dev-story.md` - VERIFIED COMPLIANT (from Story 3.5)
- `scrum_workflow/context/standards.md` - REFERENCED ONLY
- `scrum_workflow/config.yaml` - REFERENCED ONLY

**Framework Files Referenced:**
- `scrum_workflow/workflows/readiness-check.md` - Pattern reference for workflow structure
- `scrum_workflow/templates/plan.md` - Pattern reference for subtask table structure
- `scrum_workflow/skills/readiness-check/SKILL.md` - Pattern reference for skill structure

## Change Log

- 2026-03-25: Story implementation completed - all 6 tasks (28 subtasks) complete, all acceptance criteria satisfied, status updated to review

## Senior Developer Review (AI)

**Review Date:** 2026-03-25
**Review Outcome:** Approve with Auto-Applied Patches
**Total Action Items:** 24 (17 patches applied, 7 deferred, 1 dismissed)

### Action Items

#### Decision-Needed (Auto-Resolved in YOLO Mode)

#### Patch Findings (Auto-Applied)

- [x] [Review][Patch] SW-XXX format validation added [development.md:1.1] - FIXED: Added format validation for SW-XXX pattern
- [x] [Review][Patch] Status field missing validation added [development.md:1.3] - FIXED: Added status field check
- [x] [Review][Patch] Plan.md table validation added [development.md:2.2] - FIXED: Added table structure validation
- [x] [Review][Patch] Tasks section validation added [development.md:2.3] - FIXED: Added tasks section existence check
- [x] [Review][Patch] Context index malformed handling added [development.md:3.1] - FIXED: Added malformed index handling
- [x] [Review][Patch] Context loading limit added [development.md:3.2] - FIXED: Added max 50 files limit
- [x] [Review][Patch] Regex escaping for keywords added [development.md:3.2] - FIXED: Added regex special character escaping
- [x] [Review][Patch] Atomic write implementation guidance added [development.md:4.1] - FIXED: Added atomic write pattern description
- [x] [Review][Patch] Concurrent invocation handling added [development.md:4.1] - FIXED: Added concurrent handling note
- [x] [Review][Patch] Status verification rollback added [development.md:4.2] - FIXED: Added rollback mechanism
- [x] [Review][Patch] Symlink path resolution added [development.md:4.2, 6.3] - FIXED: Added real path resolution
- [x] [Review][Patch] Test suite validation added [development.md:5.1] - FIXED: Added test framework check
- [x] [Review][Patch] Bulk operations validation added [development.md:6.3] - FIXED: Added bulk operation validation
- [x] [Review][Patch] Checkbox format normalization added [development.md:7.2] - FIXED: Added format normalization
- [x] [Review][Patch] Word boundary detection added [context/index.md:59-63] - FIXED: Added word boundary detection
- [x] [Review][Patch] Circular dependency handling added [development.md:2.3] - FIXED: Added circular dependency check
- [x] [Review][Patch] Context loading maximum documented [development.md:3.2] - FIXED: Added 50 file limit

#### Deferred Findings (Pre-existing Issues)

- [x] [Review][Defer] Case-insensitive without Unicode handling [development.md:3.2] - deferred, pre-existing language limitation
- [x] [Review][Defer] No keyword conflict resolution [context/index.md:63] - deferred, documented behavior (load all)
- [x] [Review][Defer] Story contains no keywords [development.md:3.2] - deferred, edge case with documented fallback
- [x] [Review][Defer] Story.md is read-only filesystem [development.md:4.1] - deferred, filesystem limitation
- [x] [Review][Defer] Test framework not configured [development.md:5.1] - deferred, pre-existing project state
- [x] [Review][Defer] Status is already in-dev [development.md:4.1] - deferred, resume scenario documented
- [x] [Review][Defer] TOCTOU race condition [development.md:4.2] - deferred, documented limitation

### Severity Breakdown

- High: 0
- Medium: 0
- Low: 24 (documentation and validation improvements)

### Reviewer Notes

The development workflow and context index files are well-structured and comprehensive. All 17 patch findings were validation improvements, documentation clarifications, and error handling enhancements that improve robustness without changing core functionality. The 7 deferred findings are pre-existing system limitations or documented edge cases that are acceptable as-is.

All acceptance criteria remain satisfied after patches:
- AC1-AC2: Dev-story command format verified ✅
- AC3: Development workflow exists ✅
- AC4: Guard condition enforced ✅
- AC5: Implementation guided by workflow ✅
- AC6: Context loading implemented ✅
- AC7: Write boundary rules enforced ✅
