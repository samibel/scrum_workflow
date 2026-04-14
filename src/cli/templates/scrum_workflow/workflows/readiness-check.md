# Readiness Check Workflow

Step-by-step workflow for validating story completeness before implementation. The readiness check is the gate between refinement and development, ensuring that stories are fully specified before entering the implementation phase.

## Prerequisites

- Story file exists at `_scrum-output/sprints/SW-XXX/story.md` with `status: refined`
- Refinement completed with synthesis (from Story 3.3)
- `scrum_workflow/skills/readiness-check/SKILL.md` exists

## Step 1: Validate Story File

### Step 1.1: Verify Story File Exists

Check if `_scrum-output/sprints/SW-XXX/story.md` exists.

**If file does not exist**, halt with error:
```
Error: Story file '_scrum-output/sprints/SW-XXX/story.md' not found
Fix: Ensure refinement has completed and story file exists
```

### Step 1.2: Verify Current Status

Read the `status` field from story.md YAML frontmatter.

**If status is not `refined`**, halt with error:
```
Error: Story SW-XXX is in status 'current_status', but readiness check requires 'refinement'
Fix: Complete refinement process before running readiness check
```

### Step 1.3: Validate Frontmatter Structure

Verify YAML frontmatter is well-formed and contains expected fields:
- `schema_version`
- `ticket`
- `title`
- `status` (must be `refined`)
- `created`
- `updated`

**If frontmatter is invalid**, halt with error:
```
Error: Invalid frontmatter in story.md: [specific_error]
Fix: Ensure story file has valid YAML frontmatter with all required fields
```

## Step 2: Invoke Readiness Check Skill

### Step 2.1: Prerequisites Check

Verify readiness-check skill exists:
- `scrum_workflow/skills/readiness-check/SKILL.md`

**If skill does not exist**, halt with error:
```
Error: Readiness check skill not found at scrum_workflow/skills/readiness-check/SKILL.md
Fix: Ensure readiness-check skill is installed
```

### Step 2.2: Invoke Skill

Invoke `scrum_workflow/skills/readiness-check/SKILL.md` (direct skill invocation, not sub-agent spawning) to validate story completeness:

- Pass story.md path for validation
- Pass refinement.md path for subtask extraction
- Request PASS/FAIL result with specific failure reasons

**Skill Output:**
The skill produces:
- Validation result: PASS or FAIL
- Validation summary with check-by-check results
- Failure reasons (if any)
- Plan.md content (if PASS)

## Step 3: Handle Validation Result

### Step 3.1: PASS Case - Assemble Plan and Update Status

**If validation result is PASS:**

1. **Create plan.md** from skill output FIRST
   - Write to `_scrum-output/sprints/SW-XXX/plan.md`
   - Create directory if missing
   - Use atomic write operation (NFR1 compliance)

2. **Verify plan.md was created successfully**
   - If plan.md creation failed, halt with error and do NOT update story status
   - This prevents inconsistent state (story marked ready-for-dev but no plan exists)

3. **Update story.md status** to `ready-for-dev` ONLY after plan.md is verified
   - Update `status` field in YAML frontmatter
   - Update `updated` field to current date (ISO 8601)
   - Use atomic write operation (NFR1 compliance)

4. **Log success:**
```
✅ Story SW-XXX passed readiness check
Status updated: refined → ready-for-dev
Plan created: _scrum-output/sprints/SW-XXX/plan.md
Story is ready-for-dev
```

### Step 3.2: FAIL Case - Revert Status and Document Reasons

**If validation result is FAIL:**

1. **Document failure reasons** in story.md
   - Add `## Readiness Check Failure` section
   - List all specific failure reasons from skill output
   - Include timestamp of failed check

2. **Update story.md status** to `refined` (preserve for re-validation)
   - Update `status` field in YAML frontmatter to `refined`
   - Update `updated` field to current date (ISO 8601)
   - Use atomic write operation

3. **Log failure:**
```
❌ Story SW-XXX failed readiness check
Status preserved: refined (fix issues and re-run /scrum-refine-story)
Failure reasons:
1. [Specific reason 1]
2. [Specific reason 2]
...
Address these issues and re-run refinement
```

## Write Boundaries

This workflow may write:

- `_scrum-output/sprints/SW-XXX/plan.md` -- Execution plan (on PASS only)
- `_scrum-output/sprints/SW-XXX/story.md` -- Status update (ready-for-dev on PASS, refined on FAIL) and failure reasons section (on FAIL)

This workflow may NOT write:

- `refinement.md` -- Read-only for this workflow
- `review-*.md` -- Managed by `/scrum-dev-story`
- `approval.md` -- Managed by approval workflow
- `scrum_workflow/` -- Framework files are read-only during execution

## Validation Rules

- Story status must be `refined` before readiness check begins
- All four validation checks must pass for PASS result
- Any single check failure results in FAIL result
- Status transitions must follow state machine (no bypassing)
- Atomic writes required for all file updates (NFR1 compliance)

## Error Handling

- If skill invocation fails, halt with actionable error
- If plan.md creation fails (directory missing), create directory and retry
- If status update fails, log error and suggest manual intervention
- On any failure, preserve story.md content (atomic write pattern)
