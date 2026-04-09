# Policy Violation Detection Workflow

Step-by-step workflow for the `/scrum-policy-check` command. This workflow runs retrospective governance checks to detect policy violations that occurred through manual edits, bypasses, or system gaps.

## Agentic Pattern: Policy Enforcement

**Pattern Source:** Governance and Compliance patterns

**Key Principles:**
1. **Retrospective Detection:** Policy checks run after violations occur (not real-time guards)
2. **Bypass Detection:** Catches violations that Epic 3 guards cannot prevent (manual edits, legacy stories)
3. **Audit Logging:** All violations are logged for traceability and Story 8.3 integration
4. **Actionable Guidance:** Every violation provides clear remediation steps

## Prerequisites

- Story file exists at `_scrum-output/sprints/SW-XXX/story.md`
- Story status is `in-progress` or beyond (violations not applicable to earlier stages)

## Lifecycle States Reference

The 9-state lifecycle (defined in Story 3.1):
1. `draft` - Initial story creation
2. `refined` - After refinement
3. `ready-for-dev` - Cleared for development
4. `in-progress` - Active development
5. `review` - Ready for review
6. `approved` - Approved after review
7. `done` - Completed
8. `changes-needed` - Requires changes
9. `cancelled` - Cancelled

**Valid State Transitions:**
- draft → refined
- refined → ready-for-dev
- ready-for-dev → in-progress
- in-progress → review
- review → approved (or changes-needed)
- changes-needed → in-progress
- approved → done
- Any state → cancelled (terminal)

## Step 1: Load Story and Context

### Step 1.1: Validate Ticket ID Format

Verify ticket ID matches pattern `/^SW-\d{3}$/`.

**If invalid**, halt with error:
```
❌ Invalid Ticket ID: Expected SW-XXX format
```

### Step 1.2: Verify Story File Exists

Check if `_scrum-output/sprints/SW-XXX/story.md` exists.

**If file does not exist**, halt with error:
```
❌ Story file not found: _scrum-output/sprints/SW-XXX/story.md
```

### Step 1.3: Check Story Status (Status Guard)

Read the `status` field from the story.md YAML frontmatter.

**If status is `draft`, `refined`, or `ready-for-dev`**, halt with error:
```
❌ Status Guard Violation: Story SW-XXX is in '{{current_status}}' - policy check only applies to in-progress+ stories
```

**If status is `in-progress`, `review`, `approved`, `done`, or `changes-needed`**, proceed to Step 2.

## Step 2: Detect Policy Violations

### Step 2.1: Check No Plan Violation

**Condition:** Story status is `in-progress` or beyond AND `plan.md` does not exist.

**Check:**
```
IF story.frontmatter.status IN ['in-progress', 'review', 'approved', 'done', 'changes-needed']
   AND NOT exists(_scrum-output/sprints/SW-XXX/plan.md)
THEN violation_detected = TRUE
```

**If violation detected:**
```
violation = {
  type: 'No Plan',
  detected_at: <current_iso_timestamp>,
  story_status: story.frontmatter.status,
  message: 'Story SW-XXX is in ''{{story.frontmatter.status}}'' status but plan.md does not exist.'
}
```

### Step 2.2: Check No Verification Violation

**Condition:** Story status is `review` or beyond AND `verification-report.md` does not exist.

**Check:**
```
IF story.frontmatter.status IN ['review', 'approved', 'done', 'changes-needed']
   AND NOT exists(_scrum-output/sprints/SW-XXX/verification-report.md)
THEN violation_detected = TRUE
```

**If violation detected:**
```
violation = {
  type: 'No Verification',
  detected_at: <current_iso_timestamp>,
  story_status: story.frontmatter.status,
  message: 'Story SW-XXX has reached ''{{story.frontmatter.status}}'' status but verification-report.md does not exist.'
}
```

### Step 2.3: Check Skipped Phase Violation

**Condition:** status_history entries show transitions that skip required intermediate states.

**Valid transitions (from Story 3.1):**
- draft → refined
- refined → ready-for-dev
- ready-for-dev → in-progress
- in-progress → review
- review → approved (or changes-needed)
- changes-needed → in-progress
- approved → done

**Check each status_history entry sequentially:**
```
FOR each entry IN story.frontmatter.status_history
  current_from = entry.from
  current_to = entry.to

  IF NOT is_valid_transition(current_from, current_to)
  THEN violation_detected = TRUE
```

**Valid transition check:**
```
VALID_TRANSITIONS = {
  'draft': ['refined'],
  'refined': ['ready-for-dev'],
  'ready-for-dev': ['in-progress'],
  'in-progress': ['review', 'changes-needed'],
  'review': ['approved', 'changes-needed'],
  'changes-needed': ['in-progress'],
  'approved': ['done'],
  'done': [],
  'cancelled': []
}

FUNCTION is_valid_transition(from, to):
  RETURN to IN VALID_TRANSITIONS[from]
```

**If violation detected:**
```
violation = {
  type: 'Skipped Phase',
  detected_at: <current_iso_timestamp>,
  story_status: story.frontmatter.status,
  from_status: entry.from,
  to_status: entry.to,
  message: 'Story SW-XXX transitioned from ''{{from_status}}'' to ''{{to_status}}'' without the required intermediate state.'
}
```

## Step 3: Generate Violation Report

### Step 3.1: Check for Template

Check if `scrum_workflow/templates/policy-violation-report.md` exists.

**If exists:** Use template for report structure.

**If not exists:** Use fallback format.

### Step 3.2: Create Audit Log Directory

Ensure `_scrum-output/audit/` directory exists.

```
IF NOT exists(_scrum-output/audit/)
  mkdir(_scrum-output/audit/, { recursive: true })
```

### Step 3.3: Generate Report Content

Create violation report with all detected violations:

```markdown
---
schema_version: 1
ticket: SW-XXX
generated: <current_iso_timestamp>
violations_count: <number>
---

# Policy Violation Report: SW-XXX

**Generated:** <current_iso_timestamp>
**Story Status:** <status>
**Violations Found:** <count>

## Violations

{{for each violation}}
### {{violation_number}}. {{violation.type}}

**Detected:** {{violation.detected_at}}
**Story Status:** {{violation.story_status}}

❌ Policy Violation: {{violation.type}}

**Details:** {{violation.message}}

**Next Step:** {{remediation_guidance[violation.type]}}
{{/for}}

---

## Summary

| Violation Type | Status |
|----------------|--------|
{{for each violation}} | {{violation.type}} | {{if resolved}}RESOLVED{{else}}DETECTED{{/if}} |
{{/for}}

## Remediation Guidance

| Violation Type | Remediation |
|----------------|-------------|
| No Plan | Create plan.md using '/scrum-refine-story SW-XXX' |
| No Verification | Run '/scrum-verify SW-XXX' to generate verification report |
| Skipped Phase | Review story status_history and ensure proper transitions |
```

### Step 3.4: Write Report (Atomic)

Write to `_scrum-output/audit/SW-XXX-policy-violations.md` using atomic write:
1. Write to temp file: `{reportFile}.tmp.{timestamp}`
2. Rename to target: `{reportFile}`

## Step 4: Output Results

### Step 4.1: Success with Violations

**If violations detected:**
```
⚠️ Policy Violations Detected for SW-XXX

❌ No Plan - Story is in '{{story_status}}' but plan.md does not exist.
❌ No Verification - Story has reached 'review' but verification-report.md does not exist.

Report: _scrum-output/audit/SW-XXX-policy-violations.md
```

### Step 4.2: Success with No Violations

**If no violations detected:**
```
✅ No Policy Violations Detected for SW-XXX

All governance checks passed. Story is compliant with lifecycle requirements.
```

### Step 4.3: Error Cases

**If story file read fails:**
```
❌ Error: Failed to read story file for SW-XXX
Details: <error_message>
```

**If write fails:**
```
❌ Error: Failed to write policy violation report
Details: <error_message>
```

## Write Boundary Rules (Enforced)

### Allowed Write Operations
- `_scrum-output/audit/SW-XXX-policy-violations.md` (NEW file - audit log only)

### Prohibited Write Operations
- `story.md` (read-only, no modifications)
- Source code or test files
- Any files in `scrum_workflow/` directory
- `_scrum-output/sprints/` files (only audit directory is writable)

## Error Handling

| Error Condition | Response |
|-----------------|----------|
| Invalid ticket ID format | `❌ Invalid Ticket ID: Expected SW-XXX format` |
| Story file not found | `❌ Story file not found: _scrum-output/sprints/SW-XXX/story.md` |
| Story not yet applicable | `❌ Status Guard Violation: Story SW-XXX is in '{{status}}' - policy check only applies to in-progress+ stories` |
| Read failure | `❌ Error: Failed to read story file for SW-XXX` |
| Write failure | `❌ Error: Failed to write policy violation report` |

## Audit Trail Integration

For Story 8.3 (Central Audit Trail):
- Violations are written to `_scrum-output/audit/SW-XXX-policy-violations.md`
- Each violation includes: type, timestamp, story status, message
- Report format supports later aggregation into central audit trail
- Compliance with FR-9 (Write Boundary Enforcement) ensures audit log only, no source code modification