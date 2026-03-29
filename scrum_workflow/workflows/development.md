# Development Workflow

Step-by-step workflow for implementing stories based on approved specifications and execution plans. The development workflow follows red-green-refactor cycle, loads project context, enforces write boundary rules, and produces implemented code with story status updates.

## Prerequisites

- Story identifier matches `SW-XXX` format (where XXX is 3-digit number: `SW-001`, `SW-042`, `SW-103`)
- Story file exists at `sprints/SW-XXX/story.md` with `status: ready`
- Execution plan exists at `sprints/SW-XXX/plan.md` (created by readiness check)
- Story has passed readiness check (all 4 criteria validated)
- `scrum_workflow/commands/dev-story.md` exists with guard condition enforcement

## Step 1: Verify Guard Condition

### Step 1.1: Verify Story File Exists

Check if `sprints/SW-XXX/story.md` exists.

**Validate story identifier format:** `SW-XXX` where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`).

**If file does not exist**, halt with error:
```
Error: Story file 'sprints/SW-XXX/story.md' not found
Fix: Create story using /scrum-create-ticket command
```

**If identifier format is invalid**, halt with error:
```
Error: Invalid story identifier format. Expected 'SW-XXX' (e.g., SW-001).
Fix: Use correct story identifier format with 3-digit number.
```

### Step 1.2: Verify Current Status (FR17 Guard Condition)

Read the `status` field from story.md YAML frontmatter.

**If status is not `ready`**, halt with error:
```
Error: Story SW-XXX is in status 'current_status', but '/scrum-dev-story' requires 'ready'
Fix: Stories must pass readiness check before implementation. Run '/scrum-refine-ticket SW-XXX' to complete refinement and readiness check.
```

**Critical:** There is NO flag or option to bypass this guard condition. The only path to `in-dev` is through `ready` (refinement → ready → in-dev).

### Step 1.3: Validate Frontmatter Structure

Verify YAML frontmatter is well-formed and contains expected fields:
- `schema_version`
- `ticket`
- `title`
- `status` (must be `ready`)
- `created`
- `updated`

**If status field is missing**, halt with error:
```
Error: Status field not found in story.md frontmatter
Fix: Ensure story file has valid YAML frontmatter with status field
```

**If frontmatter is invalid**, halt with error:
```
Error: Invalid frontmatter in story.md: [specific_error]
Fix: Ensure story file has valid YAML frontmatter with all required fields
```

## Step 2: Load Story and Plan

### Step 2.1: Load Story File

Read `sprints/SW-XXX/story.md` completely and extract:
- Story section: User story description
- Acceptance Criteria: BDD Given/When/Then criteria
- Tasks/Subtasks: Implementation task list
- Dev Notes: Architecture patterns, constraints, technical requirements

### Step 2.2: Load Plan File

Read `sprints/SW-XXX/plan.md` and extract:
- Subtasks table with dependencies
- Implementation order (prerequisites first)
- Acceptance criteria summary
- Story context and overview

**Validate plan.md table structure:** Verify subtasks table has expected columns (Task, Subtask, Description, Dependencies, Source or equivalent).

**If plan.md does not exist**, issue warning but continue:
```
Warning: Plan file 'sprints/SW-XXX/plan.md' not found
Continuing with story.md task list only
```

**If plan.md table is malformed**, issue warning and use story.md tasks only:
```
Warning: Plan file subtasks table is malformed or missing columns
Continuing with story.md task list only
```

### Step 2.3: Parse Task Dependencies

Parse the subtasks table to understand:
- Task order (which tasks must complete first)
- Dependencies between tasks
- Source attribution (which agent/user proposed each task)

**Validate Tasks section exists:** If story.md has no Tasks/Subtasks section or it is empty, halt with error:
```
Error: No tasks found in story.md - cannot implement without task specification
Fix: Add Tasks/Subtasks section to story.md before running /scrum-dev-story
```

**Dependency Resolution:**
- Tasks with no dependencies: execute first
- Tasks with dependencies: execute after prerequisites complete
- Maintain ordering from plan.md subtask table
- Handle circular dependencies by halting with error

## Step 3: Load Project Context

### Step 3.1: Load Context Index

Read `scrum_workflow/context/index.md` if it exists for domain discovery:
- Parse domain listing and file mappings
- Extract available domain contexts
- Identify relevant skill directories

**If context/index.md does not exist**, skip domain-specific context loading and use general project context only.

**If context/index.md is malformed**, log warning and continue with general project context only:
```
Warning: Context index file is malformed - using general context only
```

### Step 3.2: Load Domain Context

Based on story keywords and requirements, load relevant domain context files:
- Read `scrum_workflow/context/{domain}.md` for domain-specific patterns
- Extract domain architecture patterns, conventions, and best practices
- Load coding standards specific to the domain

**Domain Discovery:**
- Analyze story title and description for domain keywords
- Match keywords against available domain contexts
- Load all matching domain context files (maximum 50 files to prevent unbounded loading)

**Keyword Matching:**
- Case-insensitive matching with word boundary detection
- Escape regex special characters in keywords before matching
- Partial word matching supported (e.g., "convention" matches "conventions")

**Error Handling:**
- If specified domain context file does not exist, log warning and continue
- Missing domain context is not a fatal error (general context applies)

### Step 3.3: Load Domain Skills

Load domain-specific skills from `scrum_workflow/skills/{domain}/SKILL.md`:
- Read skill definition for implementation patterns
- Extract domain-specific coding conventions
- Load testing patterns and validation rules

**Error Handling:**
- If specified domain skill does not exist, log warning and continue
- Missing domain skill is not a fatal error (general implementation patterns apply)

### Step 3.4: Load Project Standards

Read `scrum_workflow/context/standards.md` for:
- File naming conventions (kebab-case)
- YAML field naming (snake_case)
- Status value conventions
- Markdown formatting standards

## Step 4: Update Story Status to in-dev

### Step 4.1: Update Status Field

Update `sprints/SW-XXX/story.md` YAML frontmatter:
- Set `status` field to `in-dev`
- Update `updated` field to current date (ISO 8601 format)
- Use atomic write operation: write to temporary file, then rename (NFR1 compliance)

**Atomic Write Implementation:** Write complete content to temporary file (`.tmp` suffix), then use atomic rename operation to replace original. This ensures no partial corruption if write fails midway.

**Concurrent Invocation Handling:** If another process has already updated status to `in-dev`, log info and continue (resuming implementation rather than starting fresh).

### Step 4.2: Verify Status Update

Confirm status was updated successfully:
- Re-read story.md to verify `status: in-dev`
- Resolve symlinks to real paths before verification to prevent bypass
- If status update failed, rollback to previous status and halt with error
- If verification read fails, halt with error and suggest manual intervention

**Rollback Mechanism:** If status update succeeds but any subsequent step fails, revert story status to `ready` and log failure reason for manual recovery.

### Step 4.3: Log Status Transition

```
🚀 Story SW-XXX status updated: ready → in-dev
Beginning implementation...
```

## Step 5: Implement Following Red-Green-Refactor Cycle

### Step 5.1: Red Phase - Write Failing Tests

For each task/subtask in plan.md order:
1. Write FAILING tests first for the functionality
2. Confirm tests fail before implementation
3. This validates test correctness

**Test Types:**
- Unit tests for business logic and core functionality
- Integration tests for component interactions
- End-to-end tests for critical user flows (when story demands)
- Edge case tests for error handling

**Test Suite Validation:** Verify test framework is configured and test suite is non-empty before running tests. If no tests exist, log warning:
```
Warning: No test framework configured or test suite is empty
Proceeding without test coverage - consider adding tests
```

### Step 5.2: Green Phase - Implement Minimal Code

1. Implement MINIMAL code to make tests pass
2. Run tests to confirm they now pass
3. Handle error conditions and edge cases as specified in task/subtask

**Implementation Principles:**
- Follow story.md specification exactly
- Follow plan.md subtask sequence
- Implement ONLY what is specified in tasks/subtasks
- Load domain context and skills for guidance
- Follow architecture patterns from Dev Notes

### Step 5.3: Refactor Phase - Improve Structure

1. Improve code structure while keeping tests green
2. Ensure code follows architecture patterns and coding standards
3. Apply domain-specific patterns from loaded context
4. Maintain test coverage throughout refactoring

### Step 5.4: Validate Implementation

For each completed task/subtask:
1. Verify ALL tests pass (no regressions)
2. Confirm implementation matches task specification exactly
3. Validate acceptance criteria are satisfied
4. Document technical decisions in implementation notes

**Critical:** NEVER mark a task complete unless ALL validation gates pass.

## Step 6: Enforce Write Boundary Rules

### Step 6.1: Allowed Write Operations

The dev agent MAY write:
- Code files in the project directory (language-specific source files)
- `sprints/SW-XXX/story.md` (status update only in YAML frontmatter)
- Test files for implemented functionality
- Configuration files required by the story

### Step 6.2: Prohibited Write Operations

The dev agent MAY NOT write:
- `sprints/SW-XXX/refinement.md` -- Read-only during development
- `sprints/SW-XXX/plan.md` -- Read-only during development
- `sprints/SW-XXX/review-*.md` -- Managed by code review workflow
- `sprints/SW-XXX/approval.md` -- Managed by approval workflow
- `scrum_workflow/` -- Framework files are read-only during execution

### Step 6.3: Validate Write Operations

Before each file write:
1. Resolve file path to real path (follow symlinks) before boundary check
2. Check if resolved file path is in prohibited list
3. If attempting to write prohibited file, halt with error:
   ```
   Error: Write boundary violation - cannot modify '{file_path}'
   Fix: Dev agents may only write code files. Workflow files are immutable during development.
   ```
4. Log all write operations for audit trail

**Bulk Operations:** For multi-file operations (e.g., batch writes, moves), validate ALL file paths before ANY operation begins. Abort entire batch if ANY file violates boundary rules.

### Step 6.4: Immutable State Enforcement

- Story specification sections are immutable
- Refinement outputs are immutable
- Plan.md is immutable during development
- Only synthesized results (code files) pass to next phase

## Step 7: Handle Review Trigger (FR20 Extension)

### Step 7.1: Detect Review Command

Check if command includes `review` trigger:
- Input format: `/scrum-dev-story SW-XXX review`
- Trigger indicates implementation is complete and ready for review

### Step 7.2: Validate Completion

Before transitioning to review:
1. Verify ALL tasks/subtasks are marked complete [x] (normalize checkbox formats: [x], [X], [done] → complete)
2. Verify ALL tests pass (no regressions)
3. Verify ALL acceptance criteria are satisfied
4. Verify File List is complete
5. Verify Tasks/Subtasks section exists and is not empty

**If any validation fails**, halt with error:
```
Error: Story not ready for review - incomplete tasks or failing tests
Fix: Complete all tasks and ensure tests pass before triggering review
```

### Step 7.3: Update Status to in-review

Update `sprints/SW-XXX/story.md` YAML frontmatter:
- Set `status` field to `in-review`
- Update `updated` field to current date (ISO 8601 format)
- Use atomic write operation (NFR1 compliance)

### Step 7.4: Log Review Transition

```
✅ Story SW-XXX implementation complete
Status updated: in-dev → in-review
Ready for code review
```

## Write Boundaries

This workflow may write:

- `sprints/SW-XXX/story.md` -- Status updates (in-dev, in-review) only
- Code files in project directory -- Implementation outputs
- Test files -- Validation and regression tests

This workflow may NOT write:

- `sprints/SW-XXX/refinement.md` -- Read-only during development
- `sprints/SW-XXX/plan.md` -- Read-only during development
- `sprints/SW-XXX/review-*.md` -- Managed by code review workflow
- `sprints/SW-XXX/approval.md` -- Managed by approval workflow
- `scrum_workflow/` -- Framework files are read-only during execution

## Validation Rules

- Story status must be `ready` before development begins (FR17 guard condition)
- All four readiness checks must have passed (description, AC, estimation, subtasks)
- Tests must exist and pass for all implemented functionality
- No regressions in existing test suite
- Write boundary rules must be enforced (no workflow file modification)
- Status transitions must follow state machine (no bypassing)
- Atomic writes required for all file updates (NFR1 compliance)

## Error Handling

- If story file is missing or invalid, halt with actionable error
- If status is not `ready`, halt with specific error suggesting refinement
- If plan.md is missing, issue warning and continue with story.md tasks
- If domain context or skills are missing, log warning and continue
- If write boundary violation attempted, halt immediately with error
- If test failures occur, halt and fix before continuing
- If status update fails, log error and suggest manual intervention

## Completion Detection

Story implementation is complete when:
1. ALL tasks/subtasks are marked complete [x]
2. ALL acceptance criteria are satisfied
3. ALL tests pass (no regressions)
4. File List includes all changed files
5. Story status transitions to `in-review` (via review trigger)

**Note:** Regular `/scrum-dev-story SW-XXX` updates status to `in-dev` and begins implementation. `/scrum-dev-story SW-XXX review` updates status to `in-review` after implementation is complete.
