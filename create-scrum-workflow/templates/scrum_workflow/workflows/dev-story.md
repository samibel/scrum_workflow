# Dev-Story Workflow (Implementation Agent)

**Pattern:** Inversion of Control
**Goal:** Execute story implementation following a pre-validated plan with lean, execution-only workflow.

---

## Lean 3-Step Structure

This workflow follows a lean structure:
1. **Step 1: Load** - Load story with `status: ready` and plan.md
2. **Step 2: Execute** - Implement each step from plan.md
3. **Step 3: Update Status** - Set status to `in-progress` on completion

---

## Step 1: Load Story and Plan

Load the story file and implementation plan.

### Step 1.1: Prerequisite Validation
Verify the story file exists:
- Check if `_scrum-output/sprints/SW-XXX/story.md` exists
- If missing, halt with error:

```
Error: File '_scrum-output/sprints/SW-XXX/story.md' not found
Fix: Run '/scrum-create-ticket SW-XXX' first to create type story file
```

### Step 1.2: Status Guard Validation
Verify story status:
- Read current status from story file YAML frontmatter
- Verify status is `ready-for-dev` (required for `/scrum-dev-story`)
- Guard condition: Story must be in `ready-for-dev` status

**On guard condition failure** (wrong status), halt with error:

```
Error: Story SW-XXX is in status 'current_status', but '/scrum-dev-story' requires 'ready'
Fix: Run '/scrum-refine-story SW-XXX' to validate the story before development
```

### Step 1.3: Load Story Content
Read the complete story file:
- Extract YAML frontmatter (ticket, title, status, created, updated)
- Extract all sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes
 Dev Agent Record, File List, Change Log
- Store for context during implementation

### Step 1.4: Load Implementation Plan
Load the plan.md file (created by validation agent in Story 11.1).
- Check if `_scrum-output/sprints/SW-XXX/plan.md` exists
- If missing, halt with error:

```
Error: Implementation plan not found at '_scrum-output/sprints/SW-XXX/plan.md'
Fix: Run '/scrum-refine-story SW-XXX' first to validate the story and create the implementation plan
```

- Read plan.md content
- Extract subtasks and execution order
- Store as `{implementation_plan}` for Step 2

### Step 1.5: Update Status to in-progress
Before execution begins, update the story status.

- Read the complete story.md file
- Update `status` field to `in-progress`
- Update `updated` field to current date (ISO 8601 format: YYYY-MM-DD)
- Write the entire file in single atomic operation (NFR1 compliance)

- Store the original status as `{original_status}` for rollback capability

---

## Step 2: Execute Implementation
Execute each subtask from plan.md sequentially. No planning, no validation, no review.

**Critical (Inversion of Control Pattern constraint):**
- The agent receives a plan and JUST executes it, making code changes as directed
- No self-validation of agent does not validate its own work
- no self-review: agent does not review its own code
- no planning: agent does not create or modify the plan
- Direct output: implementation results go directly to code files (not synthesized reports)

### Step 2.1: Load Project Context
Load project standards and conventions before implementation:
- Load `_scrum-output/context/index.md` (if exists)
- Load domain-specific context file based on story domain (e.g., `_scrum-output/context/backend.md`)
- Load `scrum_workflow/context/standards.md` for coding conventions
- Load `scrum_workflow/context/architecture-guidelines.md` for architecture patterns

### Step 2.2: Execute Subtasks Sequentially
For each subtask in `{implementation_plan}`:
1. **Read subtask details** from plan.md
2. **Make code changes** following subtask specification
3. **Write code files** using atomic write operations (NFR1 compliance)
4. **Follow project conventions** from standards.md and architecture-guidelines.md
5. **Verify no unauthorized write operations** (write boundaries)

### Step 2.3: Track Progress
After each subtask:
- Log completion in implementation progress
- Note any issues encountered and blockers
- Update File list with new/modified files

### Step 2.4: Optional Test Generation
If story has `tests: true` flag in YAML frontmatter:
- Generate tests following project testing patterns
- Load `_scrum-output/context/testing.md` for testing conventions
- Test output written to appropriate locations
- Run tests to verify correctness

### Step 2.5: Continue Until Complete
Repeat Step 2.2 until all subtasks in `{implementation_plan}` are complete.
- Proceed to Step 3 when done

---

## Step 3: Update Status on Completion
Update story status and `in-progress` and notify user.

### Step 3.1: Verify All subtasks complete
- Re-scan plan.md to confirm all subtasks are executed
- Verify all code files were written successfully
- Confirm no partial writes or file corruption

### Step 3.2: Update story status
- Read complete story.md file
- Update `status` field to `in-progress`
- Update `updated` field to current date (ISO 8601 format: YYYY-MM-DD)
- Write entire file in single atomic operation (NFR1 compliance)

### Step 3.3: Notify user
Display completion summary:

```
✅ Story SW-XXX implementation complete
Status: ready-for-dev → in-progress
Files modified: [count] files
Tests run: [yes/no]

Next step: Run '/scrum-review-story SW-XXX' for code review
```

---

## Write Boundaries
This workflow may write:

- Code files (following plan.md execution guidance)
- `_scrum-output/sprints/SW-XXX/story.md` - Status field only (`status: in-progress`, `updated: <date>)

This workflow may NOT write

- `_scrum-output/sprints/SW-XXX/plan.md` - Read-only (created by validation agent)
- `_scrum-output/sprints/SW-XXX/refinement.md` - Read-only (created by refinement workflow)
- `_scrum-output/sprints/SW-XXX/review-*.md` - Managed by `/scrum-review-story`
- `_scrum-output/sprints/SW-XXX/approval.md` - Managed by approval workflow
- `scrum_workflow/` - Framework files are read-only during execution
- `_scrum-output/context/` - Context files are read-only during execution

---

## Inversion of Control Pattern Rules
The workflow enforces the Inversion of Control pattern through strict rules:

### 1. No Self-Validation
The agent does NOT validate its own work. Validation happens in separate commands:
- `/scrum-refine-ticket` for multi-agent refinement
- `/scrum-refine-story` for validation-only checks

**Rule:** The implementation agent reads plan.md and executes. It does not NOT validate, acceptance criteria, or check if tests pass.
- If code review is needed, user runs `/scrum-review-story` separately
- Self-validation would create feedback loops and reduce quality

### 2. No Self-Review
The agent does not review its own code. Code review happens in separate commands:
- `/scrum-review-story` for AI-assisted code review

**Rule:** The implementation agent writes code and moves on. It does not perform its review of the code.
- No "let me review my changes" prompts
- No "check if this follows best practices" self-checks
- No synthesized code review reports

**Why:** Review requires fresh context and different perspective. Implementation and self-review in the same context window leads to blind spots.

### 3. No Planning
The agent does not create or modify the implementation plan. Planning happens in separate commands.
- `/scrum-refine-ticket` for initial refinement and synthesis
- `/scrum-refine-story` for validation and plan creation

**Rule:** The implementation agent reads plan.md and executes each step. The agent does not:
- Rewrite the plan
- Generate alternative approaches
- Modify execution order
- Add/remove tasks
- Plan.md is read-only input (created by validation agent)

**Why:** Planning in a isolated context window allows for focused analysis without implementation bias. Implementation executes the plan without second-guessing.

### 4. Direct Output
Implementation output goes directly to code files, not synthesized reports.
- No "Implementation Summary" document
- No "Changes Made" report
- No "Technical Decisions" log

**Rule:** Changes are written directly to code files. The user sees actual code, not a summary.
- Code is the primary artifact
- Diff shows actual implementation
- Commit messages capture what changed

**Why:** Direct file output is simpler and faster. Users can review actual code changes using their preferred tools (git diff, IDE, code review).

### 5. Atomic Status Updates
All status updates are atomic (NFR1 compliance)
- Status updates use single write operations
- No partial writes that could corrupt file state
- Status field updated in single atomic operation with `updated` field

**Why:** Atomic writes ensure file integrity. If a process is interrupted, the file is either completely updated or not changed at all, preventing partial state that could cause confusion.

---

## Validation Rules
- Story status must be `ready-for-dev` before implementation begins
- Plan.md must exist before implementation can proceed
- All file writes must be atomic (NFR1 compliance)
- Write boundaries must be strictly enforced
- Error messages must follow actionable pattern from standards.md
