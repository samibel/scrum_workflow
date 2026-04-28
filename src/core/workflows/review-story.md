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
- `scrum_workflow/agents/clean-code-reviewer.md` exists for the mandatory Clean Code supplementary review (if missing, the workflow logs a warning and skips Clean Code findings — it does not halt)

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

### Step 1.4a: Load Active Risk Notes (Risk Context Enrichment)

After loading project standards, load active risk notes relevant to the story's domain as additional review context (FR-30).

**Domain Matching Algorithm:**
1. Collect story keywords from the story title and AC text (extract nouns and domain terms)
2. Scan `_scrum-output/memory/risks/` for all `RN-[0-9][0-9][0-9].md` files
3. For each RN file:
   - Parse the YAML frontmatter `status` field — if NOT `active`, **skip** (resolved risks MUST NOT be loaded — AC3 hard requirement)
   - Check `domain_tags` array — if any tag overlaps with story keywords, include
   - Check `affected_area` field (normalized to lowercase-hyphenated) — if it appears in story keywords, include
4. Collect all matched active RN files as additional context

**Context Injection:**
- Append matched risk notes after the standard context block
- Format: "Active Risk Notes (for domain context):" followed by each RN-NNN.md content
- This gives the review agent risk awareness without changing the review workflow structure

**If no matching active risks exist:**
- Log: `No active risk notes matched story domain — proceeding without risk context`
- Continue normally — risk loading is optional enrichment, not required

**Write Boundary (CRITICAL):**
- The review workflow is READ-ONLY for risk notes — it loads them as context but NEVER writes or modifies them
- NEVER create, modify, or delete any RN-NNN.md file during review

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
- Load ALL previous review files: `review-1.md`, `review-2.md`, ..., `review-(N-1).md`
- Store each review file's content as `{previous_review_X}` where X is the review number
- Extract the most recent review file: `review-(N-1).md`
- Extract previous findings and verdict from the most recent review
- Note which findings were addressed vs. new findings
- Store findings mapping to enable comparison in the new review

**Previous Review Findings Loading:**
- For each previous review, extract:
  - Verdict (approved/changes-needed)
  - Findings table with severity, AC reference, and suggested fixes
  - Review date and reviewer information
  - Any recommendations or notes

**Error Handling:**
- If a previous review file is unreadable or corrupted: log warning, skip that file, continue with others
- If verdict field is missing or invalid: treat as "changes-needed" (conservative approach)
- If no previous reviews can be loaded: log warning, proceed without comparison (degraded functionality)

**Findings Comparison Data Structure:**
```
{previous_findings} = [
  {
    review_number: X,
    verdict: "changes-needed",
    findings: [
      { id: 1, severity: "Critical", description: "...", ac_ref: "AC-3", file: "file.js:42" },
      { id: 2, severity: "Major", description: "...", ac_ref: "Task-2.1", file: "config.yaml" }
    ],
    review_date: "YYYY-MM-DD"
  }
]
```

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

### Step 3.5: Compare with Previous Review Findings (if applicable)

**Only execute this step if previous review files exist (N > 1):**

1. **Cross-reference current findings with previous findings:**
   - For each current finding, check if a similar issue existed in previous reviews
   - Identify which previous findings have been addressed (resolved)
   - Identify which previous findings persist (unresolved)
   - Identify new findings introduced in the current implementation

2. **Findings status classification:**
   - **Resolved:** Previous finding that no longer exists in current implementation
   - **Unresolved:** Previous finding that still exists in current implementation
   - **New:** Finding that did not exist in previous reviews
   - **Regression:** Issue that was fixed but has reappeared

3. **Previous findings verification checklist:**
   For each finding from the most recent previous review (review-(N-1).md):
   - [ ] Finding resolved: Issue no longer exists
   - [ ] Finding persists: Issue still exists (should be flagged in current review)
   - [ ] Finding partially addressed: Some improvement made but issue remains
   - [ ] Finding irrelevant: Code changed making finding no longer applicable

4. **Store comparison results for review report:**
   - Create findings comparison table
   - Include in review report under "Previous Findings Resolution" section
   - Highlight unresolved critical/major findings

**If N=1 (first review):**
- Skip this step
- Note in review report that this is the first review

### Step 3.6: Mandatory Clean Code & Simplification Review (Sub-Agent)

**This step always runs at the end of evaluation, regardless of story `type`, `risk_level`, or `domain_tags`.** It exists because the primary review pass (Steps 3.1–3.5) is focused on spec alignment, ACs, tests, standards, and architecture, and routinely overlooks Clean Code and Simplification concerns.

#### Step 3.6.1: Dispatch the clean-code-reviewer Agent

Invoke the `agent-dispatcher` skill with `workflow: review-story`. The dispatcher reads `data/dispatch-rules.yaml` and unconditionally appends every agent listed under `always_in_review_story` — currently `clean-code-reviewer` — to the dispatched set. The agent's `active_in` list includes `review-story`, so it loads here.

**Failure Handling:**
- If `agent-dispatcher` is unavailable, fall back to spawning `clean-code-reviewer` directly using its agent file at `scrum_workflow/agents/clean-code-reviewer.md`.
- If the agent file itself is missing, log a warning ("`clean-code-reviewer` agent unavailable — Clean Code findings skipped this run") and continue with the primary findings only. **Do NOT halt the review** — Clean Code review is a quality enhancement, not a blocker.

#### Step 3.6.2: Provide Context to the Agent

The `clean-code-reviewer` agent receives:
- The full content of every file in `story.md` File List (the review target)
- `scrum_workflow/context/standards.md` (especially the `## Best Practices` section: Readability, Simplicity, Consistency)
- All previous `review-N.md` files in the sprint folder (so it can mark Clean Code findings as resolved/persistent)

The agent is **read-only** — it MUST NOT modify any source file, `story.md`, `plan.md`, `refinement.md`, or any review file. Boundary violations halt the workflow with the standard write-boundary error.

#### Step 3.6.3: Evaluation Dimensions

The agent evaluates against these 10 dimensions (full list in `agents/clean-code-reviewer.md`):

1. Naming clarity (functions, variables, classes, files)
2. Function & method size (single-purpose, depth ≤ 3, params ≤ 4)
3. Duplication / DRY (repeated logic, magic numbers, magic strings)
4. Simplicity / KISS (no over-engineering, no unnecessary indirection)
5. YAGNI / Dead code (unused exports, speculative configurability, commented-out code)
6. Comments (WHY not WHAT, no stale or trivial comments)
7. Error handling discipline (at boundaries, not scattered defensively)
8. Cohesion & coupling (single responsibility, no feature envy)
9. Side effects & purity (localized mutations, no hidden global state)
10. Severity classification (Critical / Major / Minor) per maintainability impact

#### Step 3.6.4: Capture the Agent's Perspective

The agent returns a structured perspective with the standard format:

```
## Clean Code Reviewer Perspective

### Findings
| # | Finding | Severity | Category |
| ... |

### Recommendations
1. ...

### Proposed Acceptance Criteria
- [ ] ...
```

Store the perspective verbatim — it will be embedded as a dedicated section in `review-N.md` (see Step 5.2).

#### Step 3.6.5: Merge Clean Code Findings into the Findings Table

For each Clean Code finding:
- Append it to the master findings list with the `Category` value preserved (e.g., "Function Size", "Duplication", "Dead Code")
- Add a `(Clean Code)` suffix to the Category column to distinguish it from primary-reviewer findings, e.g., `Function Size (Clean Code)`
- Map to AC reference: if a finding relates to an AC, use that AC; otherwise use `Project Standards` as the reference
- Preserve the agent's `File:Line` precision

**Verdict Influence:**
- A `Critical` Clean Code finding (e.g., a 200-line god-function blocking maintenance, severe systemic duplication) MAY independently drive the verdict to `CHANGES-NEEDED` — apply the same rule as Critical primary findings (see Step 5.1).
- `Major` Clean Code findings count toward the "multiple Major findings" threshold for `CHANGES-NEEDED`.
- `Minor` Clean Code findings are reported and counted but do not block approval on their own.

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
- No Critical findings (primary OR Clean Code)
- Zero or few Minor findings
- All ACs satisfied
- Adequate test coverage
- Code follows standards
- No severe Clean Code violations (no god-functions, no systemic duplication, no critical over-engineering)

**CHANGES-NEEDED if:**
- Any Critical findings exist (primary OR Clean Code)
- Multiple Major findings exist (primary + Clean Code combined)
- ACs not fully satisfied
- Inadequate test coverage
- Significant standards violations
- Severe Clean Code violations that will compound maintenance cost

### Step 5.2: Create Review File

Create review file at `_scrum-output/sprints/SW-XXX/review-N.md`:

```markdown
---
schema_version: 1
ticket: SW-XXX
title: "{{story_title}}"
review_date: YYYY-MM-DDTHH:MM:SSZ
review_number: N
reviewer: review-agent
verdict: approved  # MUST be either: "approved" or "changes-needed" (validated at runtime)
---

# Code Review: {{story_title}}

**Story:** SW-XXX
**Date:** YYYY-MM-DD
**Review Number:** N
**Verdict:** approved or changes-needed (validated: must be exact string match)

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

## Clean Code Reviewer Perspective

[Verbatim perspective returned by the clean-code-reviewer sub-agent in Step 3.6, including its Findings table, Recommendations, and Proposed Acceptance Criteria. If the agent was unavailable for this run, replace with the line: "Clean Code Reviewer agent unavailable for this run — Clean Code findings skipped."]
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

**Mandatory [DOC] Finding (when verdict is CHANGES-NEEDED):**

If the verdict is CHANGES-NEEDED, always append the following as the **last row** in the Findings table, after all other findings:

| [Next #] | `**[DOC]**` AC must be re-updated after addressing all findings above — describe the state **before** and **after** this story, explain the reasoning why these changes were made. Mermaid diagrams may be used for visual clarity. | Minor | `**[DOC]**` AC | story.md | Update the `**[DOC]**` acceptance criterion to reflect the final state after all fixes are applied |

### Step 5.5: Write Verdict Rationale

Provide clear explanation of verdict:
- For APPROVED: Summary of why implementation is acceptable
- For CHANGES-NEEDED: What must be addressed before approval

## Step 6: Update Story Status

### Step 6.1: Update Status Based on Verdict

Update `_scrum-output/sprints/SW-XXX/story.md`:

**First, validate verdict:**
- Verify verdict is either "approved" or "changes-needed" (exact string match)
- If verdict is invalid: halt with error specifying required values

**If verdict is APPROVED:**
- Set `status: approved`
- Update `updated` field to current date (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ)
- Append `status_history` entry with:
  ```yaml
  - from: review
    to: approved
    timestamp: <current_time_iso8601>
    trigger: /scrum-review-story
    actor: review-agent
  ```

**If verdict is CHANGES-NEEDED:**
- Set `status: changes-needed`
- Update `updated` field to current date (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ)
- Append `status_history` entry with:
  ```yaml
  - from: review
    to: changes-needed
    timestamp: <current_time_iso8601>
    trigger: /scrum-review-story
    actor: review-agent
  ```
- **Reset `[DOC]` AC to unchecked:** Scan the `## Acceptance Criteria` section of story.md for the line containing `**[DOC]**`. If found and currently checked (`- [x]`), reset it to unchecked (`- [ ]`). This ensures the developer knows the documentation must be re-done after applying all fixes.

### Step 6.2: Handle Legacy Stories Without status_history

**For stories created before status_history was implemented:**
- Check if `status_history` field exists in story.md
- If missing: Initialize `status_history` array with the current transition entry
- If present: Append new transition entry to existing `status_history` array
- Do not modify historical status transitions (they don't exist for legacy stories)
- Use `ensureStatusHistoryExists()` utility from status-history.js for consistent handling

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
- **Verdict field MUST be set to either `approved` or `changes-needed`**
- All findings must have severity level assigned
- All findings must reference AC or Task
- All findings must include suggested fixes
- Status transitions must follow state machine
- **status_history array MUST be updated with review agent as actor**
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
