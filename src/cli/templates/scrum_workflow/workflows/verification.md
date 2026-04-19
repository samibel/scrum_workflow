# Verification Workflow

Step-by-step workflow for the `/scrum-verify` command. This workflow runs automated checks (tests, lint, build) to validate implementation quality before a story moves to the `review` stage.

## Agentic Pattern: Automated Verification Gate

**Pattern Source:** [Automated Verification Gate](https://www.agentic-patterns.com/patterns/automated-verification-gate)

**Key Principles:**
1. **Objective Quality Signal:** Use automated tools to provide unbiased validation
2. **Mandatory Pre-requisite:** Verification must pass before human/AI review can begin
3. **Structured Reporting:** Results are captured in a standardized format for auditability
4. **Status Guarding:** Enforce lifecycle transitions based on check results

## Prerequisites

- Story file exists at `_scrum-output/sprints/SW-XXX/story.md` with `status: in-progress`
- Implementation is complete or in-progress
- Project has a valid `package.json` with `test` script
- Verification report template exists at `scrum_workflow/templates/verification-report.md`

## Step 1: Load Story and Context

### Step 1.1: Verify Story File Exists

Check if `_scrum-output/sprints/SW-XXX/story.md` exists.

**If file does not exist**, halt with error:
```
❌ Status Guard Violation: Story file '_scrum-output/sprints/SW-XXX/story.md' not found
Fix: Ensure story exists before triggering verification
```

### Step 1.2: Verify Current Status (Status Guard)

Read the `status` field from the story.md YAML frontmatter.

**If status is not `in-progress`**, halt with error:
```
❌ Status Guard Violation: Story SW-XXX requires 'in-progress' but is currently '{current_status}'
Fix: Start implementation with '/scrum-dev-story SW-XXX' before running verification.
```

## Step 2: Execute Automated Checks

### Step 2.1: Run Tests

Execute `npm test` using `child_process`.
- Capture `stdout` and `stderr`
- Record exit code
- Parse output for:
  - Total tests
  - Passed tests
  - Failed tests
  - Coverage percentage (if available in output)

### Step 2.2: Run Lint (Optional)

Check if `lint` script exists in `package.json`.
**If exists:** Execute `npm run lint`.
- Capture `stdout` and `stderr`
- Record exit code

### Step 2.3: Run Build (Optional)

Check if `build` script exists in `package.json`.
**If exists:** Execute `npm run build`.
- Capture `stdout` and `stderr`
- Record exit code

## Step 3: Generate Verification Report

### Step 3.1: Analyze Results

Determine overall result:
- **PASS:** All executed checks returned exit code 0
- **FAIL:** One or more checks returned a non-zero exit code

### Step 3.2: Populate Template

Use `scrum_workflow/templates/verification-report.md` to create the report.
- Fill in ticket ID, title, timestamp
- List result for each check (PASS/FAIL)
- Include summary of test results (X/Y passed)
- Include coverage summary if available
- Append full output/errors for failed checks to provide actionable guidance

### Step 3.3: Write Report

Write the report to `_scrum-output/sprints/SW-XXX/verification-report.md`.
- Use atomic write operation
- Ensure directory exists

## Step 4: Update Story Status

### Step 4.1: Handle PASS Result

**If all checks passed:**
1. Update `status` to `review` in `story.md`
2. Update `updated` field to current timestamp
3. Append `status_history` entry:
   ```yaml
   - from: in-progress
     to: review
     timestamp: <current_iso_timestamp>
     trigger: /scrum-verify
     actor: verification-skill
   ```
4. Output success message to CLI

### Step 4.2: Handle FAIL Result

**If any check failed:**
1. Keep `status` as `in-progress` in `story.md` (no change)
2. Update `updated` field to current timestamp
3. Output failure message to CLI with summary of failed checks and pointer to the report

## Write Boundary Rules

### Allowed Write Operations
- `_scrum-output/sprints/SW-XXX/verification-report.md` (NEW file)
- `_scrum-output/sprints/SW-XXX/story.md` (Status, updated, and status_history only)

### Prohibited Write Operations
- Source code or test files
- Any other files in `_scrum-output` or `scrum_workflow`

## Error Handling

- **Command failure:** If a check command fails to execute (e.g., `npm` not found), report as FAIL with system error details.
- **Template missing:** If `verification-report.md` template is missing, use a fallback internal format.
- **Write failure:** If writing the report or updating the story fails, report error and halt.
