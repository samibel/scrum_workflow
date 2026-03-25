# Approval Workflow

Step-by-step workflow for human-in-the-loop approval of reviewed stories. The approval gate ensures no story ships without explicit human sign-off, provides an audit trail of approval decisions, and manages the final status transition to `done`.

## Prerequisites

- Story file exists at `sprints/SW-XXX/story.md` with `status: in-review`
- Code review file exists at `sprints/SW-XXX/review-N.md` (typically `review-1.md`)
- `scrum_workflow/templates/approval.md` exists for approval record format
- Human reviewer is available to provide explicit approval decision

## Step 1: Verify Approval Prerequisites

### Step 1.1: Verify Story File Exists

Check if `sprints/SW-XXX/story.md` exists.

**If file does not exist**, halt with error:
```
Error: Story file 'sprints/SW-XXX/story.md' not found
Fix: Ensure story exists before triggering approval
```

### Step 1.2: Verify Current Status

Read the `status` field from story.md YAML frontmatter.

**Validate frontmatter structure:** Verify YAML frontmatter is well-formed and contains status field.

**If frontmatter is missing or invalid**, halt with error:
```
Error: Story file has missing or invalid YAML frontmatter
Fix: Ensure story.md has valid YAML frontmatter with status field
```

**If status field is missing**, halt with error:
```
Error: Status field not found in story.md frontmatter
Fix: Ensure story file has valid YAML frontmatter with status field
```

**If status value is empty**, halt with error:
```
Error: Status field is empty in story.md
Fix: Ensure status field has a valid value
```

**If status is not `in-review`**, halt with error:
```
Error: Story SW-XXX is in status 'current_status', but approval requires 'in-review'
Fix: Complete code review before triggering approval
```

**Critical:** Approval requires story to be in `in-review` status after code review is complete.

### Step 1.3: Verify Review File Exists

Check if `sprints/SW-XXX/review-N.md` exists (where N is 1, 2, 3, etc.).

**If no review file exists**, halt with error:
```
Error: No review file found for SW-XXX
Fix: Run code review first: '/dev-story SW-XXX review'
```

**Detect Latest Review:** If multiple review files exist (review-1.md, review-2.md), identify the most recent review by highest N value.

## Step 2: Load and Present Review Findings

### Step 2.1: Load Review File

Read the most recent `sprints/SW-XXX/review-N.md` and extract:
- Summary table (Total, Critical, Major, Minor findings)
- Findings table with all issues
- Detailed analysis by severity level
- Recommendations and approval assessment

**Validate review file structure:** Verify expected sections exist in review file.

**If review file is missing expected sections**, halt with error:
```
Error: Review file 'review-N.md' is malformed or missing required sections
Fix: Ensure review file contains summary table and findings table
```

**Extract with null safety:** Use default values for missing fields:
- Summary table: default to `{total: 0, critical: 0, major: 0, minor: 0}` if missing
- Findings table: default to empty array if missing
- Critical findings: default to "No critical findings" if missing
- Major findings: default to "No major findings" if missing
- Minor findings: default to "No minor findings" if missing

### Step 2.2: Present Review Summary

Display the review summary to the human reviewer:

```
═══════════════════════════════════════════════════════════════
                    CODE REVIEW SUMMARY
═══════════════════════════════════════════════════════════════

Story: SW-XXX - {story_title}
Review: review-{N}.md
Date: {review_date}

FINDINGS SUMMARY:
┌─────────┬──────────┬───────┬───────┐
│  Total  │ Critical │ Major │ Minor │
├─────────┼──────────┼───────┼───────┤
│ {total} │ {critical}│ {major}│{minor}│
└─────────┴──────────┴───────┴───────┘

CRITICAL FINDINGS:
{if_critical_findings}
{list_critical_findings}
{else}
✓ No critical findings
{endif}

MAJOR FINDINGS:
{if_major_findings}
{list_major_findings}
{else}
✓ No major findings
{endif}

MINOR FINDINGS:
{if_minor_findings}
{list_minor_findings}
{else}
✓ No minor findings
{endif}

REVIEWER RECOMMENDATION: {PASS/FAIL/PASS WITH MINOR ISSUES}

═══════════════════════════════════════════════════════════════
```

### Step 2.3: Present Full Review Details

Provide option to view full review details:
- Full findings table with AC references and suggested fixes
- Detailed analysis for each severity level
- Reviewer recommendations and next steps

**Display Format:** Present review file content in readable format or reference review file path for direct viewing.

## Step 3: Request Explicit Human Approval

### Step 3.1: Present Approval Question

Ask the human reviewer for explicit approval decision with clear question:

```
═══════════════════════════════════════════════════════════════
                    APPROVAL DECISION
═══════════════════════════════════════════════════════════════

Based on the review findings above, do you approve this story?

CRITICAL: No story can be marked as DONE without explicit human approval.

Your decision will be recorded in the approval audit trail.

Approval Options:
  [1] APPROVE   - Mark story as DONE (findings are acceptable or addressed)
  [2] REJECT    - Keep story in IN-REVIEW (issues need fixing)

Enter your decision (1 or 2):
```

### Step 3.2: Capture Approval Decision

Wait for human input and validate response:
- Accept `1`, `approve`, `approved`, `yes` → APPROVE
- Accept `2`, `reject`, `rejected`, `no` → REJECT

**Input normalization:** Trim whitespace and convert to lowercase before validation.

**If input is empty or whitespace-only**, prompt again:
```
Input cannot be empty. Please enter 1 (APPROVE) or 2 (REJECT).
```

**If input is invalid**, prompt again:
```
Invalid input. Please enter 1 (APPROVE) or 2 (REJECT).
```

### Step 3.3: Capture Approval Comments (Optional)

If human approves, request optional comments:

```
Optional: Add approval comments or notes (press Enter to skip):
```

If human rejects, request rejection reason:

```
Required: Please provide rejection reason (issues to fix, concerns, etc.):
```

## Step 4: Generate Approval Record

### Step 4.1: Initialize Approval File

Detect existing approval files in sprint folder:
- Look for pattern: `sprints/SW-XXX/approval-*.md`
- If no approval files exist, create `approval-1.md`
- If approval files exist, increment to next number: `approval-N.md` where N = highest + 1

Create approval file using template from `scrum_workflow/templates/approval.md`:
- Output file: `sprints/SW-XXX/approval-N.md` (incremental N)
- Use atomic write operation: write complete content to temporary file (`.tmp` suffix), then use atomic rename operation to replace original (NFR1 compliance)
- Template ensures consistent format across all approvals

**If approval file already exists with same N**, this is a concurrent approval attempt:
```
Error: Approval already in progress for SW-XXX
Fix: Wait for existing approval to complete or resolve conflict manually
```

### Step 4.2: Populate Approval Metadata

Populate approval file with:
- Approver: Human reviewer name or identifier
- Approval date: ISO 8601 format
- Decision: APPROVED or REJECTED
- Review reference: `review-N.md` file being approved
- Comments or rejection reason

### Step 4.3: Link to Review Findings

Add reference to the review file being approved:
- Review file path
- Review date and number
- Summary of findings at time of approval

### Step 4.4: Approval Record Format

Approval file must include:
```yaml
---
schema_version: 1
ticket: "SW-XXX"
title: "{story_title}"
approval_date: "{ISO_8601_date}"
approver: "{human_name}"
decision: "APPROVED" or "REJECTED"
review_reference: "review-N.md"
---

# Approval Record for {story_title}

**Ticket:** SW-XXX
**Approver:** {human_name}
**Decision:** APPROVED or REJECTED
**Date:** {approval_date}
**Review Reference:** review-N.md

## Review Summary

{Summary table and key findings from review-N.md}

## Approval Decision

**Decision:** APPROVED or REJECTED

**Rationale:** {human comments or rejection reason}

## Next Steps

{If approved: Story marked as DONE}
{If rejected: Manual fixes and re-review instructions}
```

## Step 5: Handle Approval Decision

### Step 5.1: If Approved — Update Status to done

When human approves:
1. Update `sprints/SW-XXX/story.md` YAML frontmatter:
   - Set `status` field to `done`
   - Update `updated` field to current date (ISO 8601 format)
   - Use atomic write operation: write complete content to temporary file (`.tmp` suffix), then use atomic rename operation to replace original (NFR1 compliance)

2. Update sprint status tracking (if applicable) to `done`

3. Log approval completion:
   ```
   ✅ Story SW-XXX approved by {approver}
   Status updated: in-review → done
   Approval record: sprints/SW-XXX/approval.md
   ```

### Step 5.2: If Rejected — Keep Status in in-review

When human rejects:
1. Keep `sprints/SW-XXX/story.md` status as `in-review`
2. Document rejection reason in approval.md
3. Provide instructions for next steps:
   ```
   ⛔ Story SW-XXX rejected
   Status remains: in-review
   Rejection reason: {reason}

   Next Steps:
   1. Address issues identified in rejection reason
   2. Make code fixes as needed
   3. Re-trigger review: '/dev-story SW-XXX review'
   4. Request approval again after fixes
   ```

### Step 5.3: Verify Status Update

Confirm status was updated successfully (for approved stories):
- Re-read story.md to verify `status: done`
- If status update fails, halt with error and do NOT mark approval complete

### Step 5.4: Preserve Audit Trail

Approval decisions are permanent and create audit trail:
- Each approval cycle creates unique record: `approval-1.md`, `approval-2.md`, etc.
- Approval files are never overwritten (incremental N ensures uniqueness)
- Rejected approvals stay in sprint folder as permanent record
- Audit trail provides complete history of all approval attempts

## Step 6: Write Boundary Rules Enforcement

### Step 6.1: Allowed Write Operations

The approval workflow MAY write:
- `sprints/SW-XXX/approval.md` -- Approval record (new file or update)
- `sprints/SW-XXX/story.md` -- Status update only (in-review → done)

### Step 6.2: Prohibited Write Operations

The approval workflow MAY NOT write:
- `sprints/SW-XXX/refinement.md` -- Read-only during approval
- `sprints/SW-XXX/plan.md` -- Read-only during approval
- `sprints/SW-XXX/review-N.md` -- Read-only (review is complete)
- Code files in project directory -- No code modifications during approval
- `scrum_workflow/` -- Framework files are read-only during approval (exception: framework files may be created during initial project setup, but never modified during approval execution)

### Step 6.3: Validate Write Operations

Before each file write:
1. Check if file path is in prohibited list
2. If attempting to write prohibited file, halt with error:
   ```
   Error: Write boundary violation - approval cannot modify '{file_path}'
   Fix: Approval workflow may only write approval.md and story.md status updates.
   ```

### Step 6.4: Human Gate Enforcement

- No agent or automation can approve a story
- Only explicit human decision can mark story as DONE
- This is the final gate before story completion
- Preserves human oversight for production code

## Validation Rules

- Story status must be `in-review` before approval begins
- Review file must exist before approval can proceed
- Human must explicitly approve or reject (no default approval)
- Approval record must include all required fields (approver, date, decision, comments)
- Status transitions must follow state machine
- Atomic writes required for all file updates (NFR1 compliance)
- No automatic DONE transition without human approval (FR28)

## Error Handling

- If story file is missing or invalid, halt with actionable error
- If status is not `in-review`, halt with specific error
- If no review file exists, halt with error and suggest code review
- If human input is invalid, prompt again with clear options
- If approval file creation fails, halt with error and suggest manual intervention
- If status update fails, log error and suggest manual intervention
- If write boundary violation attempted, halt immediately with error

## Completion Detection

Approval workflow is complete when:
1. Review findings are presented to human reviewer
2. Human provides explicit approval decision (APPROVE or REJECT)
3. Approval record (approval.md) is created successfully
4. If approved: Story status is updated to `done`
5. If rejected: Story status remains `in-review` with documented reason

**Note:** This is the final workflow in the development pipeline. After approval, the story is marked as DONE and the development cycle is complete. Rejected stories return to `in-review` status for additional work and re-review.

## Re-Review Cycle

For rejected stories that undergo fixes and re-review:
1. Developer makes fixes based on rejection reason
2. Developer triggers new review: `/dev-story SW-XXX review`
3. New review file created: `review-(N+1).md` (e.g., review-2.md)
4. Approval triggered again with new review findings
5. Previous approval.md files preserved for audit trail
6. New approval.md created for current approval cycle

This cycle continues until human approves the story.
