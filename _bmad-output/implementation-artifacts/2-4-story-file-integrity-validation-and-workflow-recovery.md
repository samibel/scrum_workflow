# Story 2.4: Story File Integrity Validation & Workflow Recovery

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the system to validate story files before processing and resume interrupted workflows,
So that I never lose progress and corrupted files are caught before they cause problems.

## Acceptance Criteria

1. **Given** a story file exists in `sprints/SW-XXX/story.md`
   **When** any command attempts to process the story file
   **Then** the system validates story file integrity before processing (FR35): valid YAML frontmatter, required fields present, status value is a valid state

2. **And** if frontmatter is invalid, the system returns an actionable error: "Invalid frontmatter in story.md: field `status` missing"

3. **And** if a required file is missing, the system returns: "File `sprints/SW-101/story.md` not found. Run `/create-ticket SW-101` first"

4. **And** if `context/index.md` does not exist, the system returns: "Project context not found. Run `/create-project-context` first"

5. **And** if a command is run on the wrong status, the system returns: "Story SW-101 is in status `draft`, but `/dev-story` requires `ready`"

6. **And** after an interruption, the system reads the `status` field from frontmatter and resumes from the correct phase (FR34)

7. **And** no manual "resume" command is needed -- the status value IS the recovery point (NFR2)

8. **And** all workflow state is persisted to filesystem -- no in-memory-only state (NFR3)

## Tasks / Subtasks

- [x] Task 1: Create story file integrity validation skill (AC: 1, 2)
  - [x] 1.1: Create `scrum_workflow/skills/story-validation/SKILL.md` with validation logic for YAML frontmatter, required fields, and status values
  - [x] 1.2: Define validation rules: schema_version must be present, ticket must match SW-XXX pattern, title must be non-empty, status must be valid state (draft, refinement, ready, in-dev, in-review, done), created/updated must be valid dates
  - [x] 1.3: Define error message format for each validation failure with actionable guidance (e.g., which field is missing, what value is invalid, why the status is wrong)
  - [x] 1.4: Specify that the skill returns validation result: {valid: true/false, errors: [], warnings: []}
  - [x] 1.5: Document that this skill is READ-ONLY -- it never writes files, only validates and reports
  - [x] 1.6: Follow SKILL.md format: frontmatter (`name`, `role`, `description`) + body (Identity, Instructions, Output Format, Context Rules)

- [x] Task 2: Create file existence and prerequisite validation skill (AC: 3, 4)
  - [x] 2.1: Create `scrum_workflow/skills/prerequisite-validation/SKILL.md` with validation logic for required files and prerequisites
  - [x] 2.2: Define file existence checks: story.md must exist, context/index.md must exist for most commands, refinement.md must exist for readiness check, plan.md must exist for dev-story
  - [x] 2.3: Define prerequisite error messages with actionable commands (e.g., "Run `/create-project-context` first", "Run `/create-ticket SW-101` first")
  - [x] 2.4: Specify that the skill returns validation result: {valid: true/false, missing_files: [], prerequisite_commands: []}
  - [x] 2.5: Document that this skill is READ-ONLY -- it never writes files, only validates and reports
  - [x] 2.6: Follow SKILL.md format: frontmatter (`name`, `role`, `description`) + body (Identity, Instructions, Output Format, Context Rules)

- [x] Task 3: Create status guard validation skill (AC: 5)
  - [x] 3.1: Create `scrum_workflow/skills/status-guard-validation/SKILL.md` with validation logic for status-based guard conditions
  - [x] 3.2: Define guard conditions for each command: /create-ticket requires no status (new story), /refine-ticket requires status == draft, /dev-story requires status == ready, readiness check requires status == refinement
  - [x] 3.3: Define error message format: "Story {ticket} is in status `{current}`, but `{command}` requires `{required}`"
  - [x] 3.4: Specify that the skill returns validation result: {valid: true/false, current_status: "", required_status: "", can_proceed: true/false}
  - [x] 3.5: Document that this skill is READ-ONLY -- it never writes files, only validates and reports
  - [x] 3.6: Follow SKILL.md format: frontmatter (`name`, `role`, `description`) + body (Identity, Instructions, Output Format, Context Rules)

- [x] Task 4: Integrate validation into all command workflows (AC: 1-8)
  - [x] 4.1: Update `scrum_workflow/workflows/ticket-creation.md` to call story-validation before processing any existing story (if applicable)
  - [x] 4.2: Update `scrum_workflow/workflows/refinement.md` Step 1 to call: (a) prerequisite-validation (check story.md exists, context/index.md exists), (b) status-guard-validation (check status == draft), (c) story-validation (validate frontmatter)
  - [x] 4.3: Update `scrum_workflow/workflows/development.md` Step 1 to call: (a) prerequisite-validation (check story.md exists, plan.md exists), (b) status-guard-validation (check status == ready), (c) story-validation (validate frontmatter)
  - [x] 4.4: Update `scrum_workflow/workflows/readiness-check.md` to call prerequisite-validation and status-guard-validation before processing
  - [x] 4.5: Ensure all validation failures halt the workflow with actionable error messages -- no processing continues after validation failure
  - [x] 4.6: Ensure validation is the FIRST step in every workflow -- before any file reads or processing
  - [x] 4.7: Document that status field IS the recovery point -- workflows read status first, determine which phase to resume, and proceed (no separate "resume" command needed)

- [x] Task 5: Validate workflow recovery mechanism end-to-end (AC: 6, 7, 8)
  - [x] 5.1: Verify that every workflow step writes its output atomically (single write operation) -- no partial writes that could corrupt state
  - [x] 5.2: Verify that status updates are the LAST operation in each phase -- status only changes when phase is complete
  - [x] 5.3: Verify that all workflow state is persisted to filesystem -- no in-memory-only state that would be lost on interruption
  - [x] 5.4: Test mental recovery scenario: user runs `/refine-ticket`, system spawns agents, user interrupts -- status remains `draft` (not yet `refinement`), user re-runs `/refine-ticket`, system resumes from start
  - [x] 5.5: Test mental recovery scenario: user runs `/dev-story`, agent implements 2 of 5 subtasks, user interrupts -- status remains `ready` (not yet `in-dev`), user re-runs `/dev-story`, system resumes from start
  - [x] 5.6: Verify that no manual "resume" command is needed -- the status value IS the recovery point
  - [x] 5.7: Verify that validation errors are actionable and guide the user to the correct next step

- [x] Task 6: Validate consistency rules and naming conventions (AC: 1-8)
  - [x] 6.1: Verify all new skill files use kebab-case naming: `story-validation/SKILL.md`, `prerequisite-validation/SKILL.md`, `status-guard-validation/SKILL.md`
  - [x] 6.2: Verify all SKILL.md frontmatter uses snake_case fields: `name`, `role`, `description`
  - [x] 6.3: Verify all SKILL.md body sections in correct order: Identity, Instructions, Output Format, Context Rules
  - [x] 6.4: Verify all file references use kebab-case: `context/index.md`, `sprints/SW-XXX/story.md`
  - [x] 6.5: Verify all status values use kebab-case: `draft`, `refinement`, `ready`, `in-dev`, `in-review`, `done`
  - [x] 6.6: Verify all error messages follow actionable pattern: what's wrong, why it's wrong, what to do next
  - [x] 6.7: Verify write boundary compliance: validation skills write NO files; workflows write only their designated artifacts
  - [x] 6.8: Verify no new runtime dependencies -- all validation is pure YAML/Markdown interpreted by AI platform

### Review Findings (AI)

- [x] [Review][Patch] Empty date validation [scrum_workflow/skills/story-validation/SKILL.md:87-100] — Fixed: Added explicit empty/null check before date format validation

## Dev Notes

This story implements the error handling and recovery foundation for the entire workflow system. It ensures that:
1. Corrupted or malformed story files are caught before they cause downstream problems
2. Missing prerequisites are detected early with actionable error messages
3. Status-based guard conditions prevent workflows from running in the wrong state
4. Interrupted workflows can resume automatically based on the status field
5. All state is persisted to the filesystem -- no in-memory-only state

**Critical architectural principle:** The status field IS the recovery point. No separate "resume" command is needed. When a workflow starts, it reads the status field and determines which phase to resume from. This makes the system resilient to interruptions and ensures no progress is lost.

**Key insight from NFR1-NFR3:**
- NFR1 (Atomic file writes): Each phase writes its output in a single operation -- no partial writes that could corrupt YAML frontmatter
- NFR2 (Resume from last completed phase): Status field is the single source of truth for workflow state
- NFR3 (All state persisted): No in-memory-only state -- everything is in the filesystem

### Architecture Context

**Architecture Decision 4 (Agent Orchestration Model)** governs the relationship between commands, workflows, and skills:

- **Command file** (`commands/*.md`) = WHAT: entry point, references workflow
- **Workflow file** (`workflows/*.md`) = HOW: step-by-step execution, calls validation skills first
- **Validation skills** (`skills/*-validation/SKILL.md`) = CAPABILITY: validate integrity, prerequisites, status guards

**Architecture Decision 5 (Inter-Phase Handoff Protocol):**

- The status field is the single source of truth for workflow state
- Each phase writes its output atomically and updates status LAST
- If interruption occurs, status hasn't changed, phase can be restarted safely
- No intermediate state is persisted -- only completed phases update status

**Error Pattern 5 (Actionable Error Messages):**

All validation errors follow this pattern:
- **What's wrong:** Specific issue (e.g., "field `status` missing", "file not found")
- **Why it's wrong:** Explanation (e.g., "required for story validation", "story must exist before refinement")
- **What to do:** Actionable command (e.g., "Run `/create-project-context` first", "Run `/create-ticket SW-101` first")

### Existing File State

**Files to CREATE:**

1. `scrum_workflow/skills/story-validation/SKILL.md` -- Validates YAML frontmatter, required fields, status values
2. `scrum_workflow/skills/prerequisite-validation/SKILL.md` -- Validates file existence and prerequisites
3. `scrum_workflow/skills/status-guard-validation/SKILL.md` -- Validates status-based guard conditions

**Files to MODIFY:**

1. `scrum_workflow/workflows/refinement.md` -- Add validation as Step 1
2. `scrum_workflow/workflows/development.md` -- Add validation as Step 1
3. `scrum_workflow/workflows/readiness-check.md` -- Add validation as first step
4. `scrum_workflow/workflows/ticket-creation.md` -- Add validation if processing existing story (if applicable)

**Files to READ (reference, do not modify):**

- `scrum_workflow/context/standards.md` -- State machine definitions, status values
- `scrum_workflow/commands/refine-ticket.md` -- Command definition (reference only)
- `scrum_workflow/commands/dev-story.md` -- Command definition (reference only)
- `scrum_workflow/templates/story.md` -- Story template with YAML frontmatter schema
- All existing workflow files -- To understand current structure and add validation steps

### Project Structure Notes

- All new skills are in `scrum_workflow/skills/` with kebab-case directory names
- Each skill directory contains `SKILL.md` (uppercase filename per convention)
- Skills are READ-ONLY -- they validate and report, never write files
- Workflows call skills as first step, halt on validation failure
- No new runtime dependencies -- pure YAML/Markdown interpreted by AI platform

### Previous Story Intelligence

**From Story 2.3 (Guided Mode for Vague Input) -- VALIDATION PATTERN REFERENCE:**

- Guided mode skill shows the SKILL.md format: frontmatter (`name`, `role`, `description`) + body (Identity, Instructions, Output Format, Context Rules)
- Validation is a READ-ONLY capability -- skills return structured results, workflows act on them
- Error messages must be actionable: what's wrong, why it's wrong, what to do next
- Integration happens in workflow steps -- skill is invoked, result evaluated, flow controlled

**From Story 2.2 (Create Ticket Command & Workflow) -- WORKFLOW STRUCTURE REFERENCE:**

- Workflow format: step-by-step with `##` for major steps, `###` for substeps
- Workflow file reference: `workflows/ticket-creation.md` shows how to structure validation steps
- Step 1 should be validation -- before any file reads or processing
- Atomic file writes: story file is written in single operation (NFR1 compliance)

**From Story 2.1 (Story File Schema & Sprint Folder Conventions) -- STATE MACHINE REFERENCE:**

- State machine documented in `standards.md` with all transitions and guard conditions
- Valid status values: `draft`, `refinement`, `ready`, `in-dev`, `in-review`, `done`
- Status transitions: `draft → refinement` (trigger: /refine-ticket), `refinement → ready` (guard: readiness check PASS), etc.
- Commands must verify guard conditions before executing -- no skipping phases

**From Story 1.4 (Output Templates) -- YAML FRONTMATTER REFERENCE:**

- Story template `templates/story.md` defines the YAML frontmatter schema
- Required fields: `schema_version`, `ticket`, `title`, `status`, `created`, `updated`
- Optional fields: `estimation` (set during creation, adjustable after refinement)
- Validation must check these fields are present and valid

**Key Patterns Established:**

- SKILL.md format: frontmatter (`name`, `role`, `description`) + body (Identity, Instructions, Output Format, Context Rules)
- Workflow file format: step-by-step with `##` for major steps, validation first
- All file paths in workflow steps use kebab-case and `scrum_workflow/` prefix for framework-internal references
- Error messages follow actionable pattern: what, why, what-to-do
- Validation skills are READ-ONLY -- they never write files

### Naming Convention Reminders

- **Skill directories:** `story-validation/`, `prerequisite-validation/`, `status-guard-validation/` (kebab-case)
- **Skill files:** `SKILL.md` (uppercase per convention)
- **Frontmatter fields:** `name`, `role`, `description` (snake_case)
- **Status values:** `draft`, `refinement`, `ready`, `in-dev`, `in-review`, `done` (kebab-case)
- **File references:** `context/index.md`, `sprints/SW-XXX/story.md` (kebab-case)
- **Ticket format:** `SW-XXX` with zero-padded 3-digit numbers

### Testing Standards

**Verification Checklist:**

1. `scrum_workflow/skills/story-validation/SKILL.md` exists and is valid SKILL.md format
2. `scrum_workflow/skills/prerequisite-validation/SKILL.md` exists and is valid SKILL.md format
3. `scrum_workflow/skills/status-guard-validation/SKILL.md` exists and is valid SKILL.md format
4. All skill frontmatter field order matches: `name`, `role`, `description`
5. All skill body section order matches: Identity, Instructions, Output Format, Context Rules
6. Story-validation checks: schema_version present, ticket matches SW-XXX, title non-empty, status valid state, dates valid
7. Prerequisite-validation checks: story.md exists, context/index.md exists for relevant commands, other files as needed
8. Status-guard-validation checks: /refine-ticket requires draft, /dev-story requires ready, readiness check requires refinement
9. All validation error messages are actionable (what, why, what-to-do)
10. All workflows have validation as Step 1 -- before any processing
11. Validation failures halt workflow -- no processing continues after failure
12. Status field is read first to determine recovery point -- no separate resume command needed
13. All YAML fields use snake_case throughout all files
14. All file references use kebab-case throughout all files
15. No files outside specified skills and workflows were modified
16. Write boundary compliance: validation skills write no files; workflows write only designated artifacts

**Manual Verification:**

- Parse all SKILL.md YAML frontmatter -- should be valid YAML
- Verify all skill sections match SKILL.md format exactly
- Verify workflow integration: each workflow calls validation skills as Step 1
- Test mental validation scenario: missing story.md -- should return "File not found. Run `/create-ticket` first"
- Test mental validation scenario: invalid status -- should return "Story is in status X, but command requires Y"
- Test mental validation scenario: interrupted workflow -- should resume based on status field
- Verify no contradictions between validation logic and state machine transitions
- Verify all error messages follow actionable pattern

### References

- Story File Schema: [Source: scrum_workflow/templates/story.md] (YAML frontmatter schema)
- State Machine: [Source: scrum_workflow/context/standards.md] (status values and transitions)
- Refinement Workflow: [Source: scrum_workflow/workflows/refinement.md] (to add validation Step 1)
- Development Workflow: [Source: scrum_workflow/workflows/development.md] (to add validation Step 1)
- Readiness Check: [Source: scrum_workflow/workflows/readiness-check.md] (to add validation)
- Ticket Creation: [Source: scrum_workflow/workflows/ticket-creation.md] (reference for workflow structure)
- Story 2.3 Guided Mode: [Source: _bmad-output/implementation-artifacts/2-3-guided-mode-for-vague-input.md] (SKILL.md format reference)
- Story 2.2 Create Ticket: [Source: _bmad-output/implementation-artifacts/2-2-create-ticket-command-and-workflow.md] (workflow structure reference)
- Story 2.1 Schema: [Source: _bmad-output/implementation-artifacts/2-1-story-file-schema-and-sprint-folder-conventions.md] (state machine reference)
- Epic 2 Story 2.4 Requirements: [Source: _bmad-output/planning-artifacts/epics.md#Story-24-Story-File-Integrity-Validation-and-Workflow-Recovery]
- FR Coverage: FR34, FR35 [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements]
- NFR Coverage: NFR1, NFR2, NFR3 [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional-Requirements]
- Architecture Decision 4: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-4-Agent-Orchestration-Model]
- Architecture Decision 5: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-5-Inter-Phase-Handoff-Protocol]
- Error Pattern 5: [Source: _bmad-output/planning-artifacts/architecture.md#Error-Pattern-5-Actionable-Error-Messages]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No critical errors or debugging issues encountered during implementation.

### Completion Notes List

- Created three validation skills: story-validation, prerequisite-validation, status-guard-validation
- All skills follow SKILL.md format with proper frontmatter (name, role, description) and body sections (Identity, Instructions, Output Format, Context Rules)
- All skills are READ-ONLY -- they validate and report, never write files
- Updated ticket-creation.md workflow to add validation as Step 0 (prerequisite and status guard validation)
- Updated refinement.md workflow to add comprehensive validation as Step 1 (prerequisite, status guard, story file integrity)
- Created development.md workflow with validation as Step 1 (prerequisite, status guard, story file integrity)
- Created readiness-check.md workflow with validation as Step 1 (prerequisite, status guard, story file integrity)
- All workflows have validation as the FIRST step before any processing
- All validation failures halt workflows with actionable error messages
- Status field is the recovery point -- workflows read status first to determine where to resume
- All file writes are atomic (single write operation) to maintain integrity (NFR1 compliance)
- All workflow state is persisted to filesystem -- no in-memory-only state (NFR3 compliance)
- No separate "resume" command needed -- status value IS the recovery point (NFR2 compliance)
- All error messages follow actionable pattern: what's wrong, why it's wrong, what to do next
- All naming conventions verified: kebab-case for files/directories, snake_case for YAML fields
- All validation is pure YAML/Markdown interpreted by AI platform -- no new runtime dependencies

### Code Review Completion (AI)

Code review completed successfully in YOLO mode with AUTO-ACCEPT and AUTO-FIX enabled.

**Review Findings:**
- 1 patch finding identified and automatically fixed
- 11 findings dismissed as noise or compliance passes
- 0 deferred issues
- 0 decision-needed items

**Fix Applied:**
- Added explicit empty/null check to date field validation in story-validation/SKILL.md before format validation

**Compliance Status:**
- All acceptance criteria verified: PASS
- All non-functional requirements verified: PASS (NFR1, NFR2, NFR3)
- All naming conventions verified: PASS
- All write boundaries verified: PASS

**Story Status Updated:**
- From: review
- To: done

**Sprint Status Sync:**
- Story 2-4 marked as done in sprint-status.yaml
- Last updated timestamp refreshed

### File List

**Created Files:**
- scrum_workflow/skills/story-validation/SKILL.md
- scrum_workflow/skills/prerequisite-validation/SKILL.md
- scrum_workflow/skills/status-guard-validation/SKILL.md
- scrum_workflow/workflows/development.md
- scrum_workflow/workflows/readiness-check.md

**Modified Files:**
- scrum_workflow/skills/story-validation/SKILL.md (code review fix: added empty date validation)
- scrum_workflow/workflows/ticket-creation.md
- scrum_workflow/workflows/refinement.md
- _bmad-output/implementation-artifacts/2-4-story-file-integrity-validation-and-workflow-recovery.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-03-25: Created story validation skills and integrated validation into all workflows. Implemented atomic write guarantees, status-based recovery, and comprehensive error handling.
- 2026-03-25: Code review completed in YOLO mode. Fixed empty date validation issue. All acceptance criteria and NFRs verified PASS. Story status updated to done.
