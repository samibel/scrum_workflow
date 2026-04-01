# Story 4.2: Code Review with Structured Findings

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to trigger a review that evaluates my implementation against the story specification,
So that I get specific, actionable findings tied to acceptance criteria before approval.

## Acceptance Criteria

**Given** a story with `status: in-dev` and code has been implemented
**When** the user runs `/dev-story SW-103 review`
**Then** `scrum_workflow/workflows/review.md` exists with the single-pass review workflow (MVP — no loop)
**And** the review agent reads and analyzes implemented code changes in the context of `story.md` and `plan.md` (FR22)
**And** the review evaluates implementation against the story specification and acceptance criteria (FR23)
**And** the system generates a review report documenting findings after implementation (FR20)
**And** review findings are documented in `sprints/SW-103/review-1.md` (FR24)
**And** the review file follows the standard format: Summary table (Total, Critical, Major, Minor) + Findings table (columns: #, Finding, Severity, AC Reference, Suggested Fix)
**And** each finding includes specific issues, their severity, and suggested fixes (FR25)
**And** each finding references the specific acceptance criterion or subtask it relates to (FR26)
**And** if a review is triggered again after manual fixes, a new file `review-N.md` is created with N incremented (e.g., `review-2.md`) — previous review files are preserved
**And** `story.md` status is updated to `in-review` (FR32)
**And** the review agent writes ONLY `review-N.md` — never `story.md`, `refinement.md`, or `plan.md` (Write Boundary Rules)

## Tasks / Subtasks

- [x] Task 1: Create review workflow (AC: 1)
  - [x] Subtask 1.1: Create `scrum_workflow/workflows/review.md` with single-pass review workflow
  - [x] Subtask 1.2: Define review trigger detection (`/dev-story SW-XXX review`)
  - [x] Subtask 1.3: Define story and plan file loading logic
  - [x] Subtask 1.4: Define code change detection and analysis steps
  - [x] Subtask 1.5: Define review report generation logic

- [x] Task 2: Implement review agent context loading (AC: 2, 3)
  - [x] Subtask 2.1: Load story.md for specification context
  - [x] Subtask 2.2: Load plan.md for subtask reference
  - [x] Subtask 2.3: Detect code changes (git diff or file comparison)
  - [x] Subtask 2.4: Load project context for domain-specific review

- [x] Task 3: Create review file template and format (AC: 5, 6, 7, 8)
  - [x] Subtask 3.1: Create `scrum_workflow/templates/review.md` template
  - [x] Subtask 3.2: Define Summary table format (Total, Critical, Major, Minor)
  - [x] Subtask 3.3: Define Findings table format (columns: #, Finding, Severity, AC Reference, Suggested Fix)
  - [x] Subtask 3.4: Define severity levels (Critical, Major, Minor) with guidelines

- [x] Task 4: Implement finding generation and mapping (AC: 9, 10)
  - [x] Subtask 4.1: Define issue detection logic (code vs specification)
  - [x] Subtask 4.2: Define severity assignment criteria
  - [x] Subtask 4.3: Implement AC/subtask reference mapping
  - [x] Subtask 4.4: Generate suggested fixes for each finding

- [x] Task 5: Implement incremental review tracking (AC: 11)
  - [x] Subtask 5.1: Detect existing review files (review-1.md, review-2.md, etc.)
  - [x] Subtask 5.2: Increment review number for new reviews
  - [x] Subtask 5.3: Preserve previous review files (no overwriting)
  - [x] Subtask 5.4: Link to previous reviews in findings (if applicable)

- [x] Task 6: Implement write boundary rules for review (AC: 13)
  - [x] Subtask 6.1: Document review-only permissions (review-N.md only)
  - [x] Subtask 6.2: Add validation to prevent story.md modification
  - [x] Subtask 6.3: Add validation to prevent refinement.md modification
  - [x] Subtask 6.4: Add validation to prevent plan.md modification

- [x] Task 7: Implement status transition and validation (AC: 12)
  - [x] Subtask 7.1: Update story.md status to `in-review` after review
  - [x] Subtask 7.2: Validate review trigger prerequisites (status must be `in-dev` or `in-review`)
  - [x] Subtask 7.3: Handle review trigger on `in-review` status (incremental review)
  - [x] Subtask 7.4: Document status transition (in-dev → in-review → done/approval)

- [x] Task 8: Validate end-to-end review workflow (AC: 2-10)
  - [x] Subtask 8.1: Test review with complete implementation
  - [x] Subtask 8.2: Verify review against story specification
  - [x] Subtask 8.3: Verify finding format compliance
  - [x] Subtask 8.4: Verify AC/subtask reference accuracy

## Dev Notes

### Relevant Architecture Patterns and Constraints

**From Architecture Decision 3: Story File Schema & State Machine**
- Status transitions: `in-dev → in-review` (trigger: `/dev-story review`)
- Review can be triggered from `in-dev` or `in-review` status
- State machine compliance: review files accumulate (review-1.md, review-2.md, etc.)

**From Architecture Decision 4: Agent Orchestration Model**
- Command-as-orchestrator: `commands/dev-story.md` coordinates review trigger
- Review agent uses primary model (Opus) for thorough code analysis
- Model Routing: review benefits from higher context limits for comprehensive analysis

**From Architecture Decision 5: Inter-Phase Handoff Protocol**
- Blackboard pattern: code changes + story.md + plan.md are inputs, review-N.md is output
- Asynchronous handoff: in-dev → in-review → done (after approval)
- Only synthesized results (review findings) pass to next phase

**From Architecture: Write Boundary Rules (Section 6)**
- `/dev-story review` MAY write: `sprints/SW-XXX/review-N.md`, `story.md` (status update only)
- `/dev-story review` MAY NOT write: `refinement.md`, `plan.md`, `approval.md`, code files
- Enforces review-only access — no code modifications during review

**From Story 4.1 Context**
- Dev-story command has review trigger: `/dev-story SW-XXX review`
- Development workflow produces implemented code
- Story status transitions to `in-review` after implementation complete
- Review agent must not modify implementation code

### Source Tree Components to Touch

**Framework Files to Create:**
1. `scrum_workflow/workflows/review.md` - NEW FILE with single-pass review workflow
2. `scrum_workflow/templates/review.md` - NEW FILE template for review output format

**Framework Files to Reference:**
1. `scrum_workflow/commands/dev-story.md` - ALREADY CREATED in Story 4.1 (review trigger)
2. `scrum_workflow/context/standards.md` - Story file schema and state machine
3. `scrum_workflow/config.yaml` - Platform settings and configuration

**Story 4.1 Files to Build Upon:**
1. Dev-story command review trigger (already exists with `/dev-story SW-XXX review`)
2. Development workflow (creates implemented code for review)
3. Write boundary rules (review agent must follow)

### Testing Standards Summary

**From Architecture: NFR1 - Atomic File Writes**
- Review file writes must be atomic (NFR1 compliance)
- Status updates must be atomic (single write operation)

**Validation Requirements:**
- Test review trigger with story in `in-dev` status
- Test review trigger with story in `in-review` status (incremental review)
- Verify review agent reads story.md and plan.md correctly
- Verify review evaluates against specification and acceptance criteria
- Verify review file format compliance (Summary table + Findings table)
- Verify finding severity assignment follows guidelines
- Verify AC/subtask reference mapping is accurate
- Test incremental review tracking (review-1.md → review-2.md)
- Verify write boundary rules are enforced (review-only access)

**From Story 4.1 Learnings:**
- Development workflow produces implemented code for review
- Status transitions follow state machine strictly
- Write boundary rules prevent unintended modifications
- Atomic write patterns for file updates

**Review Validation:**
- Verify review agent detects code changes correctly
- Verify review agent evaluates against story specification
- Verify review agent evaluates against acceptance criteria
- Verify review findings include specific issues
- Verify review findings include severity levels
- Verify review findings include suggested fixes
- Verify each finding references specific AC or subtask
- Verify status update to `in-review` after review
- Verify incremental review file creation (review-N.md)

### Project Structure Notes

**Alignment with Unified Project Structure:**
- All workflow files follow `scrum_workflow/workflows/{workflow-name}.md` pattern
- All template files follow `scrum_workflow/templates/{template-name}.md` pattern
- Use `kebab-case` for all file and directory names

**Three-Layer Separation Compliance:**
- Framework Layer: `scrum_workflow/workflows/review.md` (what we're creating)
- Adapter Layer: No changes needed (adapters reference framework commands)
- State Layer: Sprint files (`sprints/SW-XXX/review-N.md`, story.md status) are project-specific

**Naming Conventions to Follow:**
- Workflow file: `scrum_workflow/workflows/review.md`
- Template file: `scrum_workflow/templates/review.md`
- Review output: `sprints/SW-XXX/review-N.md` (incremental N)
- Status values: `in-dev`, `in-review`, `done`

### Previous Story Intelligence (Story 4.1)

**Key Learnings from Story 4.1:**
- Development workflow creates implemented code following red-green-refactor cycle
- Context loading enables domain-specific implementation guidance
- Write boundary rules prevent modification of workflow files
- Status transitions follow state machine with guard conditions
- Atomic write guarantee prevents file corruption

**Files Created/Modified in Story 4.1:**
- `scrum_workflow/workflows/development.md` - Created with implementation workflow
- `scrum_workflow/context/index.md` - Created for domain discovery
- `scrum_workflow/commands/dev-story.md` - VERIFIED COMPLIANT (from Story 3.5)
- Review trigger functionality added to dev-story command

**Review Feedback from Story 4.1:**
- Added SW-XXX format validation
- Added status field validation
- Added plan.md table validation
- Added tasks section validation
- Added context index malformed handling
- Added context loading limit (max 50 files)
- Added regex escaping for keywords
- Added atomic write implementation guidance
- Added concurrent invocation handling
- Added status verification rollback
- Added symlink path resolution
- Added test suite validation
- Added bulk operations validation
- Added checkbox format normalization
- Added word boundary detection

**Code Patterns Established:**
- Use SKILL.md format for all command definitions
- Direct skill invocation (not sub-agent spawning) for coordination
- Atomic write guarantee for file updates
- Clear section separation with headers for NFR16 compliance
- Step-by-step workflow orchestration in workflow files
- Write boundary rules enforcement with validation

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-4] - Epic 4 complete context and all story dependencies
- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.2] - Story 4.2 requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision-3] - Story File Schema & State Machine (status transitions, guard conditions)
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision-4] - Agent Orchestration Model (command-as-orchestrator)
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision-5] - Inter-Phase Handoff Protocol (blackboard pattern)
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns-Section-6] - Write Boundary Rules
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Development] - FR20: Generate review report after implementation
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Development] - FR22: Review agent reads and analyzes code changes
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Development] - FR23: Review evaluates against specification
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Development] - FR24: Review findings documented in review-N.md
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Development] - FR25: Review findings include severity and suggested fixes
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Development] - FR26: Each finding references AC or subtask
- [Source: Story 4.1] - Preceding story on implementation workflow (must be completed first)
- [Source: Story 4.1 Dev Notes] - Development workflow patterns, review trigger functionality

## Dev Agent Record

### Agent Model Used

glm-4.7 (claude-opus-4-6 equivalent)

### Debug Log References

No debug issues encountered during story implementation.

### Completion Notes List

- **Review Workflow Created**: Created `scrum_workflow/workflows/review.md` with complete single-pass review workflow including: review trigger detection, story/plan loading, code change detection, implementation evaluation against specification and AC, finding generation with severity assignment, AC/subtask mapping, suggested fixes, incremental review tracking, status transitions, and write boundary rules enforcement.

- **Review Template Created**: Created `scrum_workflow/templates/review.md` with standard format: Summary table (Total, Critical, Major, Minor), Findings table (columns: #, Finding, Severity, AC Reference, Suggested Fix), detailed analysis sections, recommendations, and approval assessment.

- **Review Trigger Detection Implemented**: Defined review trigger detection for `/dev-story SW-XXX review` command format with validation for correct trigger syntax and prerequisites (status must be `in-dev` or `in-review`).

- **Code Change Detection Implemented**: Defined multiple methods for detecting code changes: git diff (committed and uncommitted), file comparison, and sprint folder scan. Excluded configuration files, test files, generated files, and documentation from review scope.

- **Context Loading Implemented**: Implemented context loading for review agent: story.md for specification, plan.md for subtask reference, domain context files for domain-specific review guidelines, and project context for coding standards.

- **Finding Generation Implemented**: Defined comprehensive finding generation logic: issue detection (code vs specification), severity assignment (Critical/Major/Minor with guidelines), AC/subtask reference mapping, and suggested fix generation with prescriptive guidance.

- **Incremental Review Tracking Implemented**: Implemented incremental review file tracking: detection of existing review files (review-1.md, review-2.md, etc.), review number incrementing, preservation of previous review files, and linking to previous reviews.

- **Write Boundary Rules Enforced**: Documented review-only write permissions: MAY write review-N.md and story.md status only, MAY NOT write refinement.md, plan.md, approval.md, or code files. Added validation and error messages for violations.

- **Status Transition Implemented**: Implemented status transition logic: update to `in-review` after review, validation of review trigger prerequisites, handling of incremental reviews from `in-review` status, and documentation of state machine transitions.

- **All Acceptance Criteria Satisfied**:
  - AC1: Review workflow exists ✅ (created review.md)
  - AC2: Review agent reads code changes in context ✅ (defined context loading)
  - AC3: Review evaluates against specification ✅ (defined evaluation logic)
  - AC4: Review evaluates against acceptance criteria ✅ (defined AC validation)
  - AC5: Review report generated ✅ (defined report generation)
  - AC6: Review findings in review-1.md ✅ (defined incremental file creation)
  - AC7: Review file standard format ✅ (created template with tables)
  - AC8: Severity levels and suggested fixes ✅ (defined in workflow)
  - AC9: AC/subtask reference mapping ✅ (implemented mapping logic)
  - AC10: Finding references to AC/subtask ✅ (implemented reference format)
  - AC11: Incremental review files ✅ (implemented tracking)
  - AC12: Status updated to in-review ✅ (defined transition)
  - AC13: Write boundary rules ✅ (enforced in workflow)

### File List

**Story File:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/4-2-code-review-with-structured-findings.md`

**Source Files Analyzed:**
- `_bmad-output/planning-artifacts/epics.md` - Epic 4 and Story 4.2 requirements
- `_bmad-output/planning-artifacts/architecture.md` - Architecture decisions and patterns
- `_bmad-output/planning-artifacts/prd.md` - Functional requirements FR20-26
- `_bmad-output/implementation-artifacts/4-1-dev-story-command-and-implementation-workflow.md` - Previous story intelligence

**Framework Files Created:**
- `scrum_workflow/workflows/review.md` - CREATED (single-pass review workflow with 8 steps)
- `scrum_workflow/templates/review.md` - CREATED (review output format template)

**Framework Files Verified (No Changes):**
- `scrum_workflow/commands/dev-story.md` - VERIFIED COMPLIANT (review trigger exists from Story 4.1)
- `scrum_workflow/context/standards.md` - REFERENCED ONLY (state machine)
- `scrum_workflow/config.yaml` - REFERENCED ONLY (platform settings)

## Change Log

- 2026-03-25: Story implementation completed - all 8 tasks (28 subtasks) complete, all acceptance criteria satisfied, status updated to review
