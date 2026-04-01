# Review Story Workflow

Step-by-step workflow for reviewing implemented code against story specifications using the AI-Assisted Code Review pattern. The review agent evaluates implementation quality, specification alignment, and produces structured findings with severity levels and suggested fixes.

## Agentic Pattern: AI-Assisted Code Review / Verification

**Pattern Source:** [AI-Assisted Code Review / Verification](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification)

**Key Principles:**
1. **Separate Agent for Critique:** The reviewer is NOT the implementer — ensures unbiased perspective
2. **Multi-Agent Approach:** One generates, another verifies — catches blind spots
3. **Focus on Alignment:** Verify implementation matches specification, not just "looks good"
4. **Quality Verification:** Check for completeness, correctness, and adherence to standards

## Prerequisites

- Story file exists at `_scrum-output/sprints/SW-XXX/story.md` with `status: review`
- Code has been implemented (files modified/created as documented in story.md File List)
- `scrum_workflow/commands/review-story.md` exists
- Review template exists at `scrum_workflow/templates/review.md` (if missing, log warning and use default format)

## Step 1: Load Story and Context

### Step 1.1: Verify Story File Exists

Check if `_scrum-output/sprints/SW-XXX/story.md` exists.

**If file does not exist**, halt with error:
```
Error: Story file '_scrum-output/sprints/SW-XXX/story.md' not found
Fix: Ensure story exists before triggering review
```

### Step 1.2: Verify Current Status

Read the `status` field from story.md.

**If status is not `review`**, halt with error:
```
Error: Story SW-XXX is in status 'current_status', but review requires 'review'
Fix: Complete implementation and mark story as ready for review
```

### Step 1.3: Load Story Content

Read `_scrum-output/sprints/SW-XXX/story.md` completely and extract:
- Story section: User story description
- Acceptance Criteria: All AC with Given/When/Then format
- Tasks/Subtasks: Implementation task list (for reference)
- Dev Notes: Architecture patterns, constraints, technical specifications
- File List: List of files that were modified/created during implementation
- Change Log: Summary of changes made

### Step 1.4: Load Project Standards

Load project standards for review criteria:
- Read `scrum_workflow/context/standards.md` if exists
- Load domain-specific context based on story keywords
- Load architecture patterns from Dev Notes

**Error Handling:**
- If standards file does not exist, log warning and continue
- Missing standards is not fatal — general review criteria apply

### Step 1.5: Detect Existing Reviews

Scan the sprint folder for existing review files:
- Look for pattern: `_scrum-output/sprints/SW-XXX/review-*.md`
- Extract highest review number (e.g., review-2.md → N=2)
- If no review files exist, set current review number to 1

**Review Number Determination:**
- First review: N=1, output file is `review-1.md`
- Subsequent reviews: N=previous_highest+1, output file is `review-N.md`

### Step 1.6: Load Previous Review Context

If previous review files exist (N > 1):
- Load the most recent review file: `review-(N-1).md`
- Extract previous findings and verdict
- Note which findings were addressed vs. new findings

**Note:** If N=1, this is the first review and there is no previous context to load.

## Step 2: Analyze Implementation

### Step 2.1: Load Implemented Code Changes

Read all files listed in the story.md File List section:
- For each file path, read the complete content
- Identify file type and programming language
- Categorize by domain (backend, frontend, testing, configuration, etc.)

**If File List is empty or missing**, halt with error:
```
Error: No files listed in story.md File List section
Fix: Ensure implementation is complete and File List is populated
```

### Step 2.2: Analyze Code Structure

For each implemented file:
- Identify key functions, classes, and modules
- Map code elements to story requirements
- Note dependencies and integrations
- Identify test coverage (if test files exist)

### Step 2.3: Categorize Changes

Group code changes by type:
- **Core implementation:** Main functionality addressing story requirements
- **Test code:** Unit tests, integration tests, e2e tests
- **Configuration:** Config files, environment settings
- **Documentation:** README updates, inline documentation

## Step 3: Evaluate Against Specification

### Step 3.1: Specification Alignment Check

Evaluate implementation against story specification:

**Check for Missing Features:**
- Map each story requirement to implementation
- Identify any requirements without corresponding code
- Verify all Acceptance Criteria have implementation

**Check for Extra Features:**
- Identify any code not mapped to story requirements
- Flag "gold-plating" or scope creep
- Ensure implementation matches specification exactly

**Check for Correctness:**
- Verify implementation intent matches specification intent
- Check for logic errors or misunderstandings
- Validate edge cases are handled

### Step 3.2: Acceptance Criteria Verification

For each acceptance criterion:
1. Read the Given/When/Then specification
2. Find corresponding implementation in code
3. Verify the criterion is fully satisfied
4. Document any gaps or issues

**AC Verification Checklist:**
- [ ] All ACs have corresponding implementation
- [ ] Implementation matches AC intent
- [ ] Edge cases in AC are handled
- [ ] Error conditions in AC are addressed

### Step 3.3: Test Coverage Assessment

Evaluate test coverage:
- Check if unit tests exist for core functionality
- Verify integration tests for component interactions
- Assess e2e tests for critical user flows
- Identify untested code paths

**Coverage Criteria:**
- Core business logic: Must have unit tests
- Component interactions: Should have integration tests
- Critical flows: Should have e2e tests
- Edge cases: Should be tested

**If no test files exist:**
- For documentation-only stories: Note in review report that tests are not applicable
- For code changes: Flag as potential issue depending on story requirements

### Step 3.4: Code Standards Compliance

Check implementation against project standards:
- Code style and formatting
- Naming conventions
- Architecture patterns from Dev Notes
- Error handling patterns
- Security best practices

**If `context/standards.md` exists:**
- Validate against each standard defined
- Flag violations with specific standard reference

## Step 4: Generate Review Findings

### Step 4.1: Identify Issues and Assign Severity

For each identified issue, assign severity:

**Critical (Blocks Completion):**
- Security vulnerability (SQL injection, XSS, auth bypass)
- Data corruption or loss risk
- Core feature completely missing
- Breaking change to existing functionality
- Test coverage absent for critical functionality

**Major (Impacts Quality):**
- Architecture pattern violation
- Missing error handling for expected scenarios
- Incomplete feature implementation
- Performance issue impacting UX
- Missing tests for important functionality

**Minor (Style/Optimization):**
- Code style or naming violation
- Minor optimization opportunity
- Documentation improvement needed
- Edge case not handled (low impact)
- Test coverage gaps for non-critical code

### Step 4.2: Map Findings to AC and Tasks

For each finding:
1. Identify related Acceptance Criterion (AC-X)
2. If no AC, identify related Task/Subtask (Task X.Y)
3. If neither, reference general specification or standards
4. Add AC/Task reference to finding

**Reference Format:**
- AC Reference: "AC 3" or "AC 3: Given/When/Then"
- Task Reference: "Task 2.3" or "Task 2: Description"
- General: "Story Specification" or "Project Standards"

### Step 4.3: Generate Suggested Fixes

For each finding, provide actionable fix:
- **Specific guidance:** What to change and how
- **File reference:** Which file(s) to modify
- **Code example:** Pattern or snippet to follow (if applicable)
- **Reference link:** Link to standards or patterns (if applicable)

**Fix Guidelines:**
- Be prescriptive and specific
- Reference file paths and line numbers when possible
- Provide code examples for common patterns
- Link to relevant documentation

## Step 5: Produce Review Report

### Step 5.1: Determine Verdict

Based on findings:

**APPROVED if:**
- No Critical findings
- Zero or few Minor findings
- All ACs satisfied
- Adequate test coverage
- Code follows standards

**CHANGES-NEEDED if:**
- Any Critical findings exist
- Multiple Major findings exist
- ACs not fully satisfied
- Inadequate test coverage
- Significant standards violations

### Step 5.2: Create Review File

Create review file at `_scrum-output/sprints/SW-XXX/review-N.md`:

```markdown
# Review Report

**Story:** SW-XXX
**Date:** YYYY-MM-DD
**Review Number:** N
**Verdict:** APPROVED / CHANGES-NEEDED

## Summary

| Total | Critical | Major | Minor |
|-------|----------|-------|-------|
| X     | X        | X     | X     |

## Findings

| # | Finding | Severity | AC Reference | File:Line | Suggested Fix |
|---|---------|----------|--------------|-----------|---------------|
| 1 | [description] | Critical/Major/Minor | AC-X or Task-X.Y | file.ext:42 | [fix description] |

## Verdict Rationale

[Explanation of why APPROVED or CHANGES-NEEDED]

## Implementation Quality Assessment

### Specification Alignment
[How well implementation matches specification]

### Acceptance Criteria Coverage
[Which ACs are satisfied, which are not]

### Test Coverage
[Assessment of test adequacy]

### Code Quality
[Adherence to standards, patterns, best practices]
```

### Step 5.3: Populate Summary Table

Count findings by severity:
- Total: Sum of all findings
- Critical: Count of Critical findings
- Major: Count of Major findings
- Minor: Count of Minor findings

### Step 5.4: Populate Findings Table

For each finding, create row with:
- Sequential number (#)
- Description (one-line summary)
- Severity (Critical/Major/Minor)
- AC Reference (AC-X or Task-X.Y)
- File:Line (file path and line number if applicable)
- Suggested Fix (actionable fix description)

### Step 5.5: Write Verdict Rationale

Provide clear explanation of verdict:
- For APPROVED: Summary of why implementation is acceptable
- For CHANGES-NEEDED: What must be addressed before approval

## Step 6: Update Story Status

### Step 6.1: Update Status Based on Verdict

Update `_scrum-output/sprints/SW-XXX/story.md`:

**If verdict is APPROVED:**
- Set `status: approved`
- Update `updated` field to current date

**If verdict is CHANGES-NEEDED:**
- Set `status: changes-needed`
- Update `updated` field to current date

### Step 6.2: Use Atomic Write

Perform atomic write operation (NFR1 compliance):
- Write to temporary file first
- Verify write success
- Rename to target file
- Verify final state

### Step 6.3: Verify Status Update

Confirm status was updated:
- Re-read story.md to verify status field
- If update failed, halt with error

### Step 6.4: Log Completion

```
✅ Code review complete for SW-XXX
Verdict: APPROVED / CHANGES-NEEDED
Status updated: review → approved / changes-needed
Review report: _scrum-output/sprints/SW-XXX/review-N.md
```

## Write Boundary Rules Enforcement

### Allowed Write Operations

The review agent MAY write:
- `_scrum-output/sprints/SW-XXX/review-N.md` -- Review report (NEW file)
- `_scrum-output/sprints/SW-XXX/story.md` -- Status field only

### Prohibited Write Operations

The review agent MAY NOT write:
- `_scrum-output/sprints/SW-XXX/plan.md` -- Read-only
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Read-only
- `_scrum-output/sprints/SW-XXX/approval.md` -- Managed by approval workflow
- Code files in project directory -- Review is read-only for code
- `scrum_workflow/` -- Framework files are read-only

### Boundary Validation

Before each write:
1. Check if file path is in prohibited list
2. If prohibited, halt with error:
   ```
   Error: Write boundary violation - review cannot modify '{file_path}'
   Fix: Review agents may only write review-N.md and story.md status updates.
   ```

## Validation Rules

- Story status must be `review` before review begins
- Review file format must follow template structure
- All findings must have severity level assigned
- All findings must reference AC or Task
- All findings must include suggested fixes
- Status transitions must follow state machine
- Atomic writes required for all file updates (NFR1)

## Error Handling

- If story file is missing, halt with actionable error
- If status is not `review`, halt with specific error
- If File List is empty, halt with error
- If review file creation fails, halt with error
- If status update fails, halt and suggest manual intervention
- If standards file is missing, log warning and continue

## Completion Detection

Code review is complete when:
1. Review file (review-N.md) is created successfully
2. Summary table and Findings table are populated
3. All findings have severity, AC/Task reference, and suggested fix
4. Verdict is determined (APPROVED or CHANGES-NEEDED)
5. Story status is updated to `approved` or `changes-needed`

**Review History:** Each review creates a new file (review-1.md, review-2.md, etc.) to preserve history and track issue resolution across multiple review cycles.
