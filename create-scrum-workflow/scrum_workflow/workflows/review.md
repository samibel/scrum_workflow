# Code Review Workflow

Step-by-step workflow for reviewing implemented code against story specifications and acceptance criteria. The review workflow analyzes code changes, evaluates implementation quality, and produces structured findings with severity levels and suggested fixes.

## Prerequisites

- Story file exists at `_scrum-output/sprints/SW-XXX/story.md` with `status: in-dev` or `status: in-review`
- Code has been implemented (git changes exist or files modified/created)
- `scrum_workflow/commands/scrum-dev-story.md` exists with review trigger functionality
- Review template exists at `scrum_workflow/templates/review.md`

## Step 1: Detect Review Trigger

### Step 1.1: Verify Review Command

Check if command includes `review` trigger:
- Input format: `/scrum-dev-story SW-XXX review`
- Trigger indicates code review is requested

**If review trigger not detected**, halt with error:
```
Error: Review trigger not found. Use '/scrum-dev-story SW-XXX review' to trigger code review.
Fix: Append 'review' to the dev-story command.
```

### Step 1.2: Verify Story File Exists

Check if `_scrum-output/sprints/SW-XXX/story.md` exists.

**If file does not exist**, halt with error:
```
Error: Story file '_scrum-output/sprints/SW-XXX/story.md' not found
Fix: Ensure story exists before triggering review
```

### Step 1.3: Verify Current Status

Read the `status` field from story.md YAML frontmatter.

**If status is not `in-dev` or `in-review`**, halt with error:
```
Error: Story SW-XXX is in status 'current_status', but code review requires 'in-dev' or 'in-review'
Fix: Complete implementation before triggering review
```

**Note:** Reviews can be triggered multiple times from `in-review` status for incremental reviews.

## Step 2: Load Story and Plan Context

### Step 2.1: Load Story File

Read `_scrum-output/sprints/SW-XXX/story.md` completely and extract:
- Story section: User story description
- Acceptance Criteria: BDD Given/When/Then criteria
- Tasks/Subtasks: Implementation task list (for finding reference)
- Dev Notes: Architecture patterns and constraints

### Step 2.2: Load Plan File

Read `_scrum-output/sprints/SW-XXX/plan.md` if it exists and extract:
- Subtasks table with dependencies
- Acceptance criteria summary
- Story context and overview

**If plan.md does not exist**, issue warning but continue:
```
Warning: Plan file '_scrum-output/sprints/SW-XXX/plan.md' not found
Review will proceed using story.md only
```

### Step 2.3: Detect Existing Reviews

Scan the sprint folder for existing review files:
- Look for pattern: `_scrum-output/sprints/SW-XXX/review-*.md`
- Extract highest review number (e.g., review-3.md → N=3)
- If no review files exist, set current review number to 1

**Review Number Determination:**
- First review: N=1, output file is `review-1.md`
- Subsequent reviews: N=previous_highest+1, output file is `review-N.md`

### Step 2.4: Load Previous Review Context

If previous review files exist (N > 1):
- Load the most recent review file: `review-(N-1).md`
- Extract findings from previous review
- Check for unresolved findings that should be re-verified

## Step 3: Detect and Analyze Code Changes

### Step 3.1: Detect Code Changes

Identify implemented code changes using one or more methods:
- **Git diff:** `git diff HEAD` for uncommitted changes, or `git diff base_branch...HEAD` for committed changes
- **File comparison:** Compare current directory state against baseline
- **Sprint folder scan:** Detect new/modified files in project directory

**Change Detection Methods:**
- Added files: New files created since baseline
- Modified files: Existing files with changes
- Deleted files: Files removed (rare, requires investigation)

### Step 3.2: Load Changed Files

For each changed file:
- Read complete file content for analysis
- Extract file type and programming language
- Identify domain context (backend, frontend, testing, etc.)

**Exclude Files from Review:**
- Configuration files (unless story-specific)
- Test files (review tests separately if required)
- Generated files (node_modules, build artifacts, etc.)
- Documentation files (unless acceptance criteria require)

### Step 3.3: Load Domain Context

Based on changed files and story keywords, load relevant domain context:
- Read `scrum_workflow/context/{domain}.md` for domain-specific patterns
- Read `scrum_workflow/skills/{domain}/SKILL.md` for domain review guidelines

**Error Handling:**
- If domain context file does not exist, log warning and continue
- Missing domain context is not a fatal error (general review patterns apply)

## Step 4: Evaluate Implementation Against Specification

### Step 4.1: Compare Implementation to Story Specification

Analyze code changes against story.md specification:
- **Specification Coverage:** Does implementation address story requirements?
- **Completeness:** Are all story requirements implemented?
- **Correctness:** Does implementation match specification intent?

**Evaluation Criteria:**
- Story description: Does code solve the stated problem?
- Acceptance criteria: Each AC must have corresponding implementation
- Dev Notes constraints: Architecture patterns, conventions followed?

### Step 4.2: Compare Implementation to Acceptance Criteria

For each acceptance criterion in story.md:
1. Identify corresponding code implementation
2. Verify criterion is satisfied by implementation
3. Document if criterion is missing, incomplete, or incorrect

**Finding Generation for AC Violations:**
- If AC has no implementation: Create finding with severity based on AC importance
- If AC implementation is incomplete: Create finding with suggested completion
- If AC implementation is incorrect: Create finding with correction suggestion

### Step 4.3: Compare Implementation to Plan Subtasks

If plan.md exists with subtasks table:
1. For each subtask, verify implementation exists
2. Check if subtask dependencies are satisfied
3. Validate subtask completion status

**Finding Generation for Subtask Issues:**
- Missing subtask implementation: Create finding referencing subtask
- Incomplete subtask: Create finding with completion guidance
- Subtask violates constraints: Create finding with correction

## Step 5: Generate Review Findings

### Step 5.1: Identify Issues and Assign Severity

Scan code changes for issues and assign severity levels:

**Severity Level Guidelines:**

**Critical:** Blocks story completion or introduces severe defect
- Security vulnerability (e.g., SQL injection, XSS, authentication bypass)
- Data corruption or loss risk
- Complete failure to implement core requirement
- Breaking change to existing functionality

**Major:** Impacts quality or maintainability but not blocking
- Violation of architecture pattern or coding standard
- Missing error handling for expected failure scenarios
- Performance issue that impacts user experience
- Incomplete implementation of non-critical requirement

**Minor:** Style, optimization, or non-essential improvements
- Code style or naming convention violation
- Minor optimization opportunity
- Documentation improvement needed
- Edge case not handled (but low impact)

### Step 5.2: Map Findings to Acceptance Criteria or Subtasks

For each identified issue:
1. Find related acceptance criterion in story.md
2. If no AC found, find related subtask in Tasks/Subtasks
3. If neither found, reference general story requirements

**Finding Reference Format:**
- AC Reference: "AC 3" or "Given/When/Then text"
- Subtask Reference: "Task 2.3" or subtask description
- General Reference: "Story specification" or "Architecture compliance"

### Step 5.3: Generate Suggested Fixes

For each finding, provide actionable suggested fix:
- **Specific fix:** Concrete code change or implementation approach
- **File reference:** Which file(s) need modification
- **Example:** Code snippet or pattern to follow (if applicable)

**Suggested Fix Guidelines:**
- Be prescriptive: Tell developer exactly what to change
- Reference files and line numbers when possible
- Provide code examples for common patterns
- Link to domain context or standards for guidance

## Step 6: Create Review Report

### Step 6.1: Initialize Review File

Create review file using template from `scrum_workflow/templates/review.md`:
- Output file: `_scrum-output/sprints/SW-XXX/review-N.md` (N from Step 2.3)
- Use atomic write operation (NFR1 compliance)
- Template ensures consistent format across all reviews

### Step 6.2: Generate Summary Table

Count findings by severity and populate Summary table:
- Total findings: Sum of all findings
- Critical: Count of Critical severity findings
- Major: Count of Major severity findings
- Minor: Count of Minor severity findings

**Summary Table Format:**
```
| Total | Critical | Major | Minor |
|-------|----------|-------|-------|
| 15    | 2        | 8     | 5     |
```

### Step 6.3: Populate Findings Table

For each identified issue, create a row in the Findings table:
- Finding #: Sequential number (1, 2, 3, ...)
- Finding: One-line description of the issue
- Severity: Critical, Major, or Minor
- AC Reference: Related acceptance criterion or subtask
- Suggested Fix: Actionable fix description

**Findings Table Format:**
```
| # | Finding | Severity | AC Reference | Suggested Fix |
|---|---------|----------|--------------|--------------|
| 1 | [description] | Critical | AC 3 | [fix description] |
```

### Step 6.4: Add Review Metadata

Add review metadata to review file:
- Review date: ISO 8601 format
- Reviewer: [AI Code Reviewer] or identifier
- Review scope: Files reviewed, changes analyzed
- Review context: Story ID, specification version

## Step 7: Update Story Status

### Step 7.1: Update Status to in-review

Update `_scrum-output/sprints/SW-XXX/story.md` YAML frontmatter:
- Set `status` field to `in-review`
- Update `updated` field to current date (ISO 8601 format)
- Use atomic write operation (NFR1 compliance)

### Step 7.2: Verify Status Update

Confirm status was updated successfully:
- Re-read story.md to verify `status: in-review`
- If status update fails, halt with error and do NOT mark review complete

### Step 7.3: Log Review Transition

```
✅ Code review complete for SW-XXX
Status updated: in-dev → in-review
Review findings: _scrum-output/sprints/SW-XXX/review-N.md
```

## Step 8: Write Boundary Rules Enforcement

### Step 8.1: Allowed Write Operations

The review agent MAY write:
- `_scrum-output/sprints/SW-XXX/review-N.md` -- Review findings report
- `_scrum-output/sprints/SW-XXX/story.md` -- Status update only (in-review)

### Step 8.2: Prohibited Write Operations

The review agent MAY NOT write:
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Read-only during review
- `_scrum-output/sprints/SW-XXX/plan.md` -- Read-only during review
- `_scrum-output/sprints/SW-XXX/approval.md` -- Managed by approval workflow
- Code files in project directory -- Review is read-only for code
- `scrum_workflow/` -- Framework files are read-only during review

### Step 8.3: Validate Write Operations

Before each file write:
1. Check if file path is in prohibited list
2. If attempting to write prohibited file, halt with error:
   ```
   Error: Write boundary violation - review cannot modify '{file_path}'
   Fix: Review agents may only write review-N.md and story.md status updates.
   ```

### Step 8.4: Review-Only Access

- Code review is a read-only analysis of implemented code
- No code modifications during review phase
- Findings document issues; developers implement fixes
- Preserves separation between review and implementation

## Validation Rules

- Story status must be `in-dev` or `in-review` before review begins
- Review file format must follow template structure
- All findings must have severity level assigned
- All findings must reference AC or subtask
- All findings must include suggested fixes
- Status transitions must follow state machine
- Atomic writes required for all file updates (NFR1 compliance)

## Error Handling

- If story file is missing or invalid, halt with actionable error
- If status is not `in-dev` or `in-review`, halt with specific error
- If no code changes detected, halt with error:
  ```
  Error: No code changes detected for review
  Fix: Ensure implementation is complete before triggering review
  ```
- If review file creation fails, halt with error and suggest manual intervention
- If status update fails, log error and suggest manual intervention
- If domain context or skills are missing, log warning and continue

## Completion Detection

Code review is complete when:
1. Review file (review-N.md) is created successfully
2. Summary table and Findings table are populated
3. All findings have severity, AC reference, and suggested fix
4. Story status is updated to `in-review`

**Note:** First review creates `review-1.md`. Subsequent reviews increment N (`review-2.md`, `review-3.md`, etc.) to preserve review history and track issue resolution.
