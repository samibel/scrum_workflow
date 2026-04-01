# Refine-Story Workflow (Validation Agent)

**Pattern:** Feature List as Immutable Contract
**Goal:** Validate story completeness before development using an immutable checklist.

---

## Lean 3-Step Structure

This workflow follows a lean structure:
1. **Step 1: Load** - Load story with `status: refinement`
2. **Step 2: Validate** - Validate against immutable checklist
3. **Step 3: Set Status** - Update status based on validation result

---

## Step 1: Load Story

Load the story file and validate prerequisites.

### Step 1.1: Prerequisite Validation

Verify the story file exists:
- Check if `_scrum-output/sprints/SW-XXX/story.md` exists
- If missing, halt with error:

```
Error: File '_scrum-output/sprints/SW-XXX/story.md' not found
Fix: Run '/scrum-create-ticket SW-XXX' first to create the story file
```

### Step 1.2: Status Guard Validation

Verify story status:
- Read current status from story file YAML frontmatter
- Verify status is `refinement` (required for `/scrum-refine-story`)
- Guard condition: Story must be in `refinement` status

**On guard condition failure** (wrong status), halt with error:

```
Error: Story SW-XXX is in status 'current_status', but '/scrum-refine-story' requires 'refinement'
Fix: Stories must be in 'refinement' status to enter validation
```

### Step 1.3: Load Story Content

Read the complete story file:
- Extract YAML frontmatter (ticket, title, status, created, updated)
- Extract all sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log
- Store for validation in Step 2

---

## Step 2: Validate Against Immutable Checklist

**Critical (Pattern Constraint):** The validation agent CAN ONLY set `passes: false → true` for each criterion. The agent CANNOT modify, story content, acceptance criteria, or tasks.

### Step 2.1: Initialize Validation State

```json
{
  "validation_results": {
    "1_acceptance_criteria": {"passes": false, "notes": ""},
    "2_tasks_defined": {"passes": false, "notes": ""},
    "3_dev_notes": {"passes": false, "notes": ""},
    "4_no_placeholders": {"passes": false, "notes": ""},
    "5_dependencies": {"passes": false, "notes": ""}
  },
  "overall": "PENDING",
  "failure_reasons": []
}
```

Store as `{validation_state}`.

### Step 2.2: Criterion 1 - Acceptance Criteria

**Rule:** All acceptance criteria are testable and unambiguous.

**Validation:**
- Check `## Acceptance Criteria` section exists
- Verify each criterion uses clear Given/When/Then format or specific checklist format
- Verify criteria are specific and testable (not vague like "do the thing")
- Check each criterion has clear expected outcomes

**Pass Condition:** All criteria are testable, specific, and unambiguous.

**Failure Reason Template:** "Acceptance criteria [X] is not testable/ambiguous: [specific issue]"

**Update validation_state:**
```json
{
  "1_acceptance_criteria": {
    "passes": true|false,
    "notes": "[Specific issues if FAIL]"
  }
}
```

### Step 2.3: Criterion 2 - Tasks Defined

**Rule:** All tasks/subtasks are clearly defined.

**Validation:**
- Check `## Tasks / Subtasks` section exists
- Verify each task has a clear action verb and specific deliverable
- Verify subtasks use checkbox format (`- [ ]` or `- [x]`)
- Verify tasks are actionable (not "do stuff", "implementation", generic placeholders)

**Pass Condition:** All tasks are specific, actionable, and clearly defined.

**Failure Reason Template:** "Task [X] is not clearly defined: [specific issue]"

**Update validation_state:**
```json
{
  "2_tasks_defined": {
    "passes": true|false,
    "notes": "[Specific issues if FAIL]"
  }
}
```

### Step 2.4: Criterion 3 - Dev Notes

**Rule:** Dev Notes section contains necessary context.

**Validation:**
- Check `## Dev Notes` section exists
- Verify section contains technical context relevant to implementation
- Check for architecture requirements, previous learnings, technical specifications
- Verify context is sufficient for a developer to implement without additional clarification

**Pass Condition:** Dev Notes section exists and contains sufficient technical context.

**Failure Reason Template:** "Dev Notes section is missing or lacks sufficient context: [specific issue]"

**Update validation_state:**
```json
{
  "3_dev_notes": {
    "passes": true|false,
    "notes": "[Specific issues if FAIL]"
  }
}
```

### Step 2.5: Criterion 4 - No Placeholders

**Rule:** No placeholders or TODO markers in story content.

**Validation:**
- Scan entire story content for placeholder patterns:
  - `TODO`, `TBD`, `FIXME`, `XXX`
  - `{{placeholder}}`, `<placeholder>`
  - `...` (ellipsis as placeholder)
  - `[insert here]`, `[describe]`, `[explain]`
  - `???` (question marks as placeholder)
  - `N/A` (when used as placeholder, not as legitimate value)
  - Empty task checkboxes: `- [ ]` (unchecked subtasks indicate incomplete definition)
- Check is case-insensitive for placeholder detection
- Ignore legitimate uses in code examples or documentation

**Pass Condition:** No placeholder markers found in story content.

**Failure Reason Template:** "Placeholder found in [section]: '[specific placeholder]'"

**Update validation_state:**
```json
{
  "4_no_placeholders": {
    "passes": true|false,
    "notes": "[Specific placeholders found if FAIL]"
  }
}
```

### Step 2.6: Criterion 5 - Dependencies

**Rule:** Dependencies are identified and documented.

**Validation:**
- Check for `Dependencies` section or dependencies mentioned in Dev Notes
- Verify external library dependencies are listed
- Verify internal dependencies (other stories, modules) are identified
- Verify any assumptions about existing infrastructure are documented

**Pass Condition:** Dependencies are clearly identified and documented, OR story has no dependencies (explicit "None" statement is acceptable).

**Failure Reason Template:** "Dependencies not documented or incomplete: [specific issue]"

**Failure Reason Template:** "Dependencies not documented or incomplete: [specific issue]"

**Update validation_state:**
```json
{
  "5_dependencies": {
    "passes": true|false,
    "notes": "[Specific issues if FAIL]"
  }
}
```

### Step 2.7: Determine Overall Result

Calculate overall validation result:

```javascript
overall = all(criteria.passes === true) ? "PASS" : "FAIL"
```

Collect failure reasons:
```javascript
failure_reasons = criteria
  .filter(c => !c.passes)
  .map(c => c.notes)
  .flatten()
```

Update `{validation_state}`:
```json
{
  "overall": "PASS" | "FAIL",
  "failure_reasons": ["reason1", "reason2", ...]
}
```

---

## Step 3: Set Status

Update story status based on validation result.

### Step 3.1: Generate Validation Report

Create validation report:

```markdown
## Validation Report

**Story:** SW-XXX
**Date:** YYYY-MM-DD
**Overall:** PASS / FAIL

### Checklist Results

| # | Criterion | Status | Notes |
|---|----------|--------|-------|
| 1 | Acceptance Criteria | PASS / FAIL | [Details if FAIL] |
| 2 | Tasks Defined | PASS / FAIL | [Details if FAIL] |
| 3 | Dev Notes | PASS / FAIL | [Details if FAIL] |
| 4 | No Placeholders | PASS / FAIL | [Details if FAIL] |
| 5 | Dependencies | PASS / FAIL | [Details if FAIL] |

### Failure Reasons (if any)

- [List specific failure reasons]
```

### Step 3.2: Handle PASS Result

**If validation_state.overall == "PASS":**

1. **Update story.md status** from `refinement` to `ready`
2. **Update `updated` field** to current date (ISO 8601 format: YYYY-MM-DD)
3. **Use atomic write operation** (NFR1 compliance)
4. **Append validation report** to `_scrum-output/sprints/SW-XXX/refinement.md`

**Output success message:**
```
✅ Story SW-XXX passed validation
Status updated: refinement → ready
Story is ready for implementation
```

### Step 3.3: Handle FAIL Result

**If validation_state.overall == "FAIL":**

1. **Preserve story.md status** as `refinement` (no change)
2. **Document failure reasons** in validation report
3. **Append validation report** to `_scrum-output/sprints/SW-XXX/refinement.md`

**Output failure message:**
```
❌ Story SW-XXX failed validation
Status preserved: refinement
Failure reasons:
1. [Specific reason 1]
2. [Specific reason 2]
...
Address these issues before development
```

### Step 3.4: Append Validation Report to Refinement

**Prerequisites Check:**
- Verify `_scrum-output/sprints/SW-XXX/refinement.md` exists
- If not, create the file with standard header

**Append Operation:**
```markdown
---

## Story Validation Report

**Date:** [YYYY-MM-DD]
**Overall Result:** [PASS/FAIL]

### Checklist Results

| # | Criterion | Status | Notes |
|---|----------|--------|-------|
| 1 | Acceptance Criteria | [PASS/FAIL] | [Notes] |
| 2 | Tasks Defined | [PASS/FAIL] | [Notes] |
| 3 | Dev Notes | [PASS/FAIL] | [Notes] |
| 4 | No Placeholders | [PASS/FAIL] | [Notes] |
| 5 | Dependencies | [PASS/FAIL] | [Notes] |

### Failure Reasons (if any)

[List failure reasons, or "None - all criteria passed"]
```

### Step 3.5: Atomic Write Guarantee (NFR1)

**Critical:** All file writes must be atomic:
- Read complete file content
- Make all modifications in memory
- Write entire file in single operation
- Verify write success before proceeding

**On write failure:**
- Log error with details
- Halt with actionable error message
- Preserve original file content

---

## Write Boundaries

This workflow may write:
- `_scrum-output/sprints/SW-XXX/story.md` - Status field only (`status: ready` or unchanged)
- `_scrum-output/sprints/SW-XXX/refinement.md` - Append validation report

This workflow may NOT write:
- Story content (acceptance criteria, tasks, dev notes) - READ ONLY
- `plan.md` - Managed by readiness-check
- `review-*.md` - Managed by `/scrum-dev-story`
- `approval.md` - Managed by approval workflow
- `scrum_workflow/` - Framework files are read-only during execution
- `_scrum-output/context/` - Context files are managed by `/scrum-create-project-context`

---

## Validation Rules

- Story status must be `refinement` before validation begins
- Validation checklist is IMMUTABLE — agent cannot modify criteria
- Agent can ONLY set `passes: false → true` for each criterion
- Agent CANNOT modify story content, acceptance criteria, or tasks
- All file writes must be atomic (NFR1 compliance)
- Error messages must follow actionable pattern
