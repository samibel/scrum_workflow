# Refinement Workflow

Step-by-step workflow for the `/scrum-refine-ticket` command. Orchestrates multi-agent refinement by spawning three specialized agent perspectives (Architect, Developer, QA) with isolated contexts, collecting their analysis, and presenting perspectives for user feedback. The workflow updates the story status from `draft` to `refinement` as part of the state machine transition.

## Prerequisites

- Story file exists at `_scrum-output/sprints/SW-XXX/story.md` with `status: draft`
- Project context exists at `context/index.md`
- Agent role definitions exist at `scrum_workflow/agents/architect.md`, `scrum_workflow/agents/developer.md`, `scrum_workflow/agents/qa.md`

## Step 1: Validation

Validate prerequisites, guard conditions, and story file integrity before any processing begins.

### Step 1.1: Prerequisite Validation

Invoke `scrum_workflow/skills/prerequisite-validation/SKILL.md` to check required files:

- Check if `_scrum-output/sprints/SW-XXX/story.md` exists
- Check if `context/index.md` exists
- Collect any missing file errors

**On prerequisite failure** (story file missing), halt with error:

```
Error: File '_scrum-output/sprints/SW-XXX/story.md' not found
Fix: Run '/scrum-create-ticket SW-XXX' first to create the story file
```

**On prerequisite failure** (context missing), halt with error:

```
Error: Project context not found
Fix: Run '/scrum-create-project-context' first to generate project context files
```

### Step 1.2: Status Guard Validation

Invoke `scrum_workflow/skills/status-guard-validation/SKILL.md` to check story status:

- Read current status from story file YAML frontmatter
- Verify status is `draft` (required for `/scrum-refine-ticket`)
- Guard condition: Story must be in `draft` status

**On guard condition failure** (wrong status), halt with error:

```
Error: Story SW-XXX is in status 'current_status', but '/scrum-refine-ticket' requires 'draft'
Fix: Stories must be in 'draft' status to enter refinement
```

### Step 1.3: Story File Integrity Validation

Invoke `scrum_workflow/skills/story-validation/SKILL.md` to validate story file structure:

- Validate YAML frontmatter is present and well-formed
- Validate all required fields are present (schema_version, ticket, title, status, created, updated)
- Validate ticket format (SW-XXX pattern)
- Validate status value is one of the valid states
- Validate date fields (created, updated) are in ISO 8601 format

**On validation failure** (corrupted frontmatter), halt with error:

```
Error: Invalid frontmatter in story.md: field 'status' missing
Fix: Ensure the story file has valid YAML frontmatter with all required fields
```

### Step 1.4: Update Status to Refinement

After all validation passes, update the story file status from `draft` to `refinement`:

- Read the complete story file
- Update the `status` field in YAML frontmatter to `refinement`
- Update the `updated` field to current date
- Write the complete file atomically (single write operation)

**Critical (NFR1)**: The entire file must be written atomically to maintain integrity.

### Step 1.5: Validation Halt

If any validation fails, halt the workflow immediately. Do not proceed to agent spawning or any subsequent steps.

## Step 2: Input Parsing

Parse and validate the user input to extract the ticket number.

### Step 2.1: Extract Ticket Number

Extract the ticket number (e.g., `SW-103`) from the user input.

**Expected input format:** `/scrum-refine-ticket SW-XXX`

### Step 2.2: Validate Ticket Format

Validate that the ticket number matches the `SW-XXX` format where XXX is a zero-padded 3-digit number.

**Validation rules:**

- Prefix must be `SW-`
- Number must be exactly 3 digits with leading zeros (e.g., `001`, `042`, `103`)
- Valid range: `SW-001` through `SW-999`

**On invalid format**, return an actionable error:

```
Error: Invalid ticket format '<input>'. Expected format: SW-XXX (e.g., SW-001, SW-103)
Fix: Provide a ticket number in the format SW-XXX where XXX is a zero-padded 3-digit number
```

## Step 3: Update Story Status

Update the story file to reflect the transition to the refinement phase.

### Step 3.1: Update Status to Refinement

Update the YAML frontmatter in `_scrum-output/sprints/SW-XXX/story.md`:

- Set `status: refinement`
- Set `updated: <today>` (ISO 8601 format: YYYY-MM-DD)

**Critical (NFR1):** The status update must be an atomic write operation to maintain file consistency.

## Step 4: Context Loading

Load project context to determine the ticket domain and prepare domain-specific context for agent spawning.

### Step 4.1: Check for Project Context

Check if `context/index.md` exists at the project root.

**If not found**, return an actionable error:

```
Error: Project context not found. Run '/scrum-create-project-context' first
Fix: Run '/scrum-create-project-context' to generate project context files before refinement
```

**Note**: This check is redundant with prerequisite validation in Step 1.1, but is kept for defense-in-depth.

### Step 4.2: Load Project Context Index

Read `context/index.md` to understand the project structure and identify which domain the ticket belongs to.

**Domain determination:** Parse the story description and acceptance criteria from `_scrum-output/sprints/SW-XXX/story.md` to identify keywords that map to domains:

- API, endpoint, service, database, backend keywords -- `backend` domain
- UI, component, page, form, frontend keywords -- `frontend` domain
- Test, coverage, assertion, testing keywords -- `testing` domain
- Deploy, CI, pipeline, Docker, devops keywords -- `devops` domain
- Architecture, pattern, design, system keywords -- `architecture` domain

Store the identified domain as `{ticket-domain}` for use in agent context loading.

### Step 4.3: Load Domain Context Files

Based on the identified `{ticket-domain}`, load the relevant domain context file:

- If `{ticket-domain}` is `backend`, load `context/backend.md`
- If `{ticket-domain}` is `frontend`, load `context/frontend.md`
- If `{ticket-domain}` is `testing`, load `context/testing.md`
- If `{ticket-domain}` is `devops`, load `context/devops.md`
- If `{ticket-domain}` is `architecture`, load `context/architecture.md`
- If no specific domain is identified, load only `context/index.md`

## Step 5: Spawn Architect Agent

Create an isolated agent context and invoke the Architect agent with architecture-focused inputs.

### Step 4.1: Prepare Architect Agent Context

Create an isolated context bundle containing:

1. `_scrum-output/sprints/SW-XXX/story.md` -- The story being refined
2. `context/index.md` -- Project context overview
3. `context/architecture.md` -- System architecture documentation
4. `context/{ticket-domain}.md` -- Domain-specific context (if identified)
5. `scrum_workflow/agents/architect.md` -- Architect agent role definition

**Isolation principle:** The Architect agent receives ONLY these files. It does NOT receive:
- Other agent role definitions (`developer.md`, `qa.md`)
- Other agents' perspectives or outputs
- Conversation history from other agents

### Step 4.2: Invoke Architect Agent

Invoke the Architect agent with the prepared context bundle. The agent analyzes the story from an architectural perspective, focusing on:

- Architectural risks and scalability concerns
- Design patterns and system integration
- Security and performance implications
- Dependencies and maintainability

### Step 4.3: Collect Architect Perspective

Collect the Architect agent's output in the standard table-based format:

- Findings table with columns: #, Finding, Severity, Category
- Recommendations list
- Proposed Acceptance Criteria

Store the output as `{architect_perspective}` for presentation in Step 8.

## Step 6: Spawn Developer Agent

Create an isolated agent context and invoke the Developer agent with technical implementation inputs.

### Step 5.1: Prepare Developer Agent Context

Create an isolated context bundle containing:

1. `_scrum-output/sprints/SW-XXX/story.md` -- The story being refined
2. `context/index.md` -- Project context overview
3. `context/{ticket-domain}.md` -- Domain-specific context (if identified)
4. `skills/{ticket-domain}/SKILL.md` -- Domain-specific skill patterns (e.g., `skills/backend/SKILL.md`)
5. `scrum_workflow/agents/developer.md` -- Developer agent role definition

**Isolation principle:** The Developer agent receives ONLY these files. It does NOT receive:
- Other agent role definitions (`architect.md`, `qa.md`)
- Other agents' perspectives or outputs
- Architecture-specific context unless `{ticket-domain}` is `architecture`
- Conversation history from other agents

### Step 5.2: Invoke Developer Agent

Invoke the Developer agent with the prepared context bundle. The agent analyzes the story from a technical implementation perspective, focusing on:

- Technical feasibility and implementation complexity
- Library dependencies and external services
- Code quality and technical debt
- Testing strategy and documentation needs

### Step 5.3: Collect Developer Perspective

Collect the Developer agent's output in the standard table-based format:

- Findings table with columns: #, Finding, Severity, Category
- Recommendations list
- Proposed Acceptance Criteria

Store the output as `{developer_perspective}` for presentation in Step 8.

## Step 7: Spawn QA Agent

Create an isolated agent context and invoke the QA agent with testing and quality inputs.

### Step 6.1: Prepare QA Agent Context

Create an isolated context bundle containing:

1. `_scrum-output/sprints/SW-XXX/story.md` -- The story being refined
2. `context/index.md` -- Project context overview
3. `context/testing.md` -- Testing standards and practices
4. `context/{ticket-domain}.md` -- Domain-specific context (if identified)
5. `skills/testing/SKILL.md` -- QA-specific skill patterns
6. `scrum_workflow/agents/qa.md` -- QA agent role definition

**Isolation principle:** The QA agent receives ONLY these files. It does NOT receive:
- Other agent role definitions (`architect.md`, `developer.md`)
- Other agents' perspectives or outputs
- Conversation history from other agents

### Step 6.2: Invoke QA Agent

Invoke the QA agent with the prepared context bundle. The agent analyzes the story from a quality assurance perspective, focusing on:

- Acceptance criteria clarity and testability
- Edge cases and error scenarios
- Test coverage and testing tools
- Integration testing and regression risk

### Step 6.3: Collect QA Perspective

Collect the QA agent's output in the standard table-based format:

- Findings table with columns: #, Finding, Severity, Category
- Recommendations list
- Proposed Acceptance Criteria

Store the output as `{qa_perspective}` for presentation in Step 8.

## Step 8: Display Agent Perspectives

Present all three agent perspectives to the user in sequential, clearly labeled sections.

### Step 7.1: Present Architect Perspective

Display the Architect agent's perspective with a clear section header:

```
## Architect Perspective

{architect_perspective}
```

### Step 7.2: Present Developer Perspective

Display the Developer agent's perspective with a clear section header:

```
## Developer Perspective

{developer_perspective}
```

### Step 7.3: Present QA Perspective

Display the QA agent's perspective with a clear section header:

```
## QA Perspective

{qa_perspective}
```

**Presentation requirements:**
- Each perspective is displayed in a separate, clearly labeled section
- Perspectives are presented sequentially (Architect, then Developer, then QA)
- Each perspective maintains the table-based format with Findings, Recommendations, and Proposed Acceptance Criteria
- No perspective is influenced or modified by another agent's output

## Step 9: Await User Feedback

Prompt the user to review and provide feedback on each agent perspective individually.

### Step 9.1: Prompt for Architect Perspective Feedback

Ask the user:

```
Do you accept the Architect perspective? [accept/reject/suggest-changes]
```

Wait for user input before proceeding.

### Step 9.2: Prompt for Developer Perspective Feedback

Ask the user:

```
Do you accept the Developer perspective? [accept/reject/suggest-changes]
```

Wait for user input before proceeding.

### Step 9.3: Prompt for QA Perspective Feedback

Ask the user:

```
Do you accept the QA perspective? [accept/reject/suggest-changes]
```

Wait for user input before proceeding.

### Step 9.4: Handle User Feedback

Collect the user's responses for each perspective:

- **accept**: The perspective is approved and will be included in synthesis
- **reject**: The perspective is discarded and will not be included in synthesis
- **suggest-changes**: The user provides specific feedback for refinement (handled in Story 3.3 synthesis)

Store the user's acceptance decisions for each perspective as `{architect_accepted}`, `{developer_accepted}`, `{qa_accepted}` for use in the synthesis phase (Story 3.3).

### Step 9.5: Invoke Feedback Collection Skill

**Prerequisites Check:**
- Verify feedback-collection skill exists: `scrum_workflow/skills/feedback-collection/SKILL.md`
- If prerequisites fail, halt with actionable error message

**Invocation:**
Invoke `scrum_workflow/skills/feedback-collection/SKILL.md` (direct skill invocation, not sub-agent spawning) to collect structured feedback:

- Present each perspective sequentially (Architect, then Developer, then QA)
- Collect accept/reject decision for each perspective
- Collect optional user comment for each decision
- Record timestamp in ISO 8601 format
- Record user identifier from config.yaml

**Output Storage:**
Store the structured feedback output as `{feedback_data}` for insertion into refinement.md Feedback Record section.

**Error Handling:**
- If feedback-collection skill file is missing or unreadable, halt with error: "Feedback collection skill not found at scrum_workflow/skills/feedback-collection/SKILL.md"
- If user provides invalid decision format, prompt again with clear options
- If collection is interrupted, preserve collected feedback and allow resumption

## Step 10: Synthesis Phase

After collecting user feedback on all three perspectives, invoke the synthesis skill to merge accepted perspectives into a coherent updated story file.

### Step 10.1: Invoke Synthesis Skill

**Prerequisites Check:**
- Verify synthesis skill file exists: `scrum_workflow/skills/synthesis/SKILL.md`
- Validate user feedback variables are defined and contain valid boolean values
- If prerequisites fail, halt with actionable error message

**Invocation:**
Invoke `scrum_workflow/skills/synthesis/SKILL.md` (direct skill invocation, not sub-agent spawning) to merge accepted agent perspectives:

- Pass accepted perspectives based on user feedback ({architect_accepted}, {developer_accepted}, {qa_accepted})
- Pass original story.md for baseline
- Pass refinement template for audit file creation
- Filter perspectives: only merge accepted perspectives, preserve rejected for auditability

**Error Handling:**
- If synthesis skill file is missing or unreadable, halt with error: "Synthesis skill not found at scrum_workflow/skills/synthesis/SKILL.md"
- If user feedback variables are undefined or invalid, halt with error: "Invalid user feedback format. Expected accept/reject for each perspective"

### Step 10.2: Create Refinement Audit File

**Prerequisites Check:**
- Verify refinement template exists: `scrum_workflow/templates/refinement.md`
- Verify target directory exists: `_scrum-output/sprints/SW-XXX/`, create if missing
- If prerequisites fail, halt with actionable error message

**File Creation:**
Create `_scrum-output/sprints/SW-XXX/refinement.md` containing:

- All agent perspectives (accepted and rejected) for auditability
- **Feedback Record Section** (NFR16 compliance): User decisions with timestamps, comments, and quality tracking summary (from {feedback_data})
- Synthesis summary with findings counts and accepted changes
- Feedback notes with stakeholder decisions and rationale

Use template from `scrum_workflow/templates/refinement.md`.

**Feedback Data Insertion:**
Insert the structured feedback data from Step 9.5 into the Feedback Record section:
- User Decisions subsection: agent name, decision, comment, timestamp, user
- Quality Tracking Summary subsection: acceptance rate, collection date, statistics

**NFR16 Compliance:**
Ensure feedback section is clearly separated from user-editable content using distinct section header:
```markdown
## Feedback Record

[System-generated feedback data - preserved across story updates]

### User Decisions
- Architect Perspective: [accept/reject]
  - Comment: [text]
  - Timestamp: [ISO_8601]
  - User: [name]
[... Developer and QA sections ...]

### Quality Tracking Summary
- Total Perspectives: 3
- Accepted: [count]
- Rejected: [count]
- Acceptance Rate: [percentage]%
```

**NFR16 Compliance:**
Ensure feedback section is clearly separated from user-editable content using distinct section header:
```markdown
## Feedback Record

[This section contains system-generated feedback data and is not user-editable]

### User Decisions
- Architect Perspective: [accept/reject]
- Developer Perspective: [accept/reject]
- QA Perspective: [accept/reject]

### Synthesis Summary
[...]
```

### Step 10.3: Update Story File

**Special Case - All Perspectives Rejected:**
If all three perspectives were rejected by the user:
- Skip story.md content updates
- Preserve original story.md without modifications
- Log in refinement.md: "All perspectives rejected - original story preserved"
- Proceed to Step 10.4 for validation

**Validation Before Update:**
- Verify story.md still exists at `_scrum-output/sprints/SW-XXX/story.md`
- Create backup of current story.md for rollback capability
- Verify synthesis skill provides merge logic (validate skill has merge implementation)
- Verify deduplication rules are applied (check synthesis skill output for consolidated findings)
- Verify conflict resolution is applied (check synthesis skill output for resolved conflicts)

**Atomic Update (NFR1 Compliance):**
Update `_scrum-output/sprints/SW-XXX/story.md` with synthesized content using atomic write operation:

- Read complete story.md file
- Merge Architect findings into story description (if accepted)
- Merge QA proposed acceptance criteria into story acceptance criteria (if accepted)
- Merge Dev recommendations into subtasks (if accepted)
- Update estimation based on complexity revealed by accepted perspectives
- Update `updated` field with current date in ISO 8601 format (validate format before writing)
- Write entire file in single atomic operation

**Merge Implementation:**
The synthesis skill (invoked in Step 10.1) is responsible for:
- Applying deduplication rules to consolidate overlapping findings
- Applying conflict resolution hierarchy (Architect > Dev > QA for domain conflicts)
- Producing merged content sections ready for story.md insertion

**Critical (NFR12)**: Ensure synthesis output fits within platform context limits by referencing `config.yaml` token budgets.

### Step 10.4: Validate Synthesis Output

**Validation Checklist:**
- Confirm refinement.md contains all perspectives (accepted and rejected)
- Confirm story.md is updated with only accepted content
- Verify user feedback is recorded in refinement.md with proper NFR16 separation
- Verify synthesis output fits within token budget (coordination budget from config.yaml)
- Verify timestamp format is valid ISO 8601 in story.md `updated` field
- Verify deduplication was applied (no duplicate findings in story.md)
- Verify conflict resolution was applied (no contradictory recommendations)

**Rollback on Failure:**
If any validation check fails after story.md was updated:
- Restore story.md from backup created in Step 10.3
- Log validation failure in refinement.md
- Halt with actionable error message describing which validation failed

**Token Budget Validation (NFR12):**
- Verify synthesis output size is within platform's coordination token budget
- If budget exceeded but synthesis was already generated, log warning in refinement.md
- Note: Preventive budget checking should happen during synthesis generation, not post-validation

## Step 11: Readiness Check Gate

After synthesis is complete and validated, run the readiness check to ensure the story is complete before allowing implementation.

### Step 11.1: Prerequisites Check

Verify readiness check components exist:
- `scrum_workflow/skills/readiness-check/SKILL.md` exists
- `scrum_workflow/workflows/readiness-check.md` exists
- Current story status is `refinement` (expected from Step 10)

**If prerequisites fail**, halt with error:
```
Error: Readiness check prerequisites not met
Fix: Ensure readiness-check skill and workflow exist
```

### Step 11.2: Invoke Readiness Check

Invoke `scrum_workflow/skills/readiness-check/SKILL.md` (direct skill invocation, not sub-agent spawning) to validate story completeness:

- Validates: description present, acceptance criteria defined, estimation set, subtasks listed
- Produces PASS/FAIL result with specific failure reasons
- On PASS: assembles plan.md from synthesized subtasks

**Error Handling:**
- If readiness-check skill file is missing or unreadable, halt with error: "Readiness check skill not found"
- If validation fails for unexpected reasons, log error and suggest manual investigation

### Step 11.3: Handle PASS Result

**If readiness check returns PASS:**

1. **Verify plan.md was created** at `_scrum-output/sprints/SW-XXX/plan.md`
2. **Update story.md status** from `refinement` to `ready`
3. **Update `updated` field** to current date (ISO 8601)
4. **Use atomic write operation** (NFR1 compliance)

**Output success message:**
```
✅ Story SW-XXX passed readiness check
Status updated: refinement → ready
Plan created: _scrum-output/sprints/SW-XXX/plan.md
Story is ready for implementation
```

### Step 11.4: Handle FAIL Result

**If readiness check returns FAIL:**

1. **Document failure reasons** in story.md
   - Add `## Readiness Check Failure` section after Tasks/Subtasks
   - List all specific failure reasons from readiness check output
   - Include timestamp of failed check

2. **Update story.md status** from `refinement` to `draft`
3. **Update `updated` field** to current date (ISO 8601)
4. **Use atomic write operation** (NFR1 compliance)

**Output failure message:**
```
❌ Story SW-XXX failed readiness check
Status reverted: refinement → draft
Failure reasons:
1. [Specific reason 1]
2. [Specific reason 2]
...
Address these issues and re-run refinement
```

**Critical:** Stories that fail readiness check CANNOT proceed to implementation. The user must address the failure reasons and re-run refinement before the story can be marked `ready`.

### Step 11.5: Validate State Transition

After handling PASS or FAIL result:

**For PASS:**
- Verify story.md status is now `ready`
- Verify plan.md exists and contains subtasks
- Verify no unintended modifications to other story sections

**For FAIL:**
- Verify story.md status is now `draft`
- Verify failure reasons are documented
- Verify refinement.md is preserved (no modifications)

**On validation failure:**
- Restore from backup if available
- Log validation failure
- Halt with actionable error message

## Write Boundaries

This workflow may write:

- `_scrum-output/sprints/SW-XXX/story.md` -- Status update (`status: refinement`, `updated: <today>`) and synthesized content updates
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Refinement audit file with all perspectives and feedback record
- `_scrum-output/sprints/SW-XXX/plan.md` -- Execution plan (on readiness check PASS only)

This workflow may NOT write:

- `plan.md` -- Managed by readiness check
- `review-*.md` -- Managed by `/scrum-dev-story`
- `approval.md` -- Managed by approval workflow
- `scrum_workflow/` -- Framework files are read-only during execution
- `context/` -- Context files are managed by `/scrum-create-project-context`

## Validation Rules

- Story status must be `draft` before refinement begins
- Story status must be updated to `refinement` in a single atomic write
- All three agents must be spawned with isolated contexts (no cross-contamination)
- Each agent receives only its role definition file, not other agents' role files
- Context file references must use correct paths with `scrum_workflow/` prefix for framework files
- Agent spawning must follow the Sub-Agent Spawning pattern (isolated contexts, independent output)
- Domain determination must be based on story content keywords
- Error messages must follow actionable pattern from Architecture Pattern 5
- All YAML fields must use snake_case
- All file names and references must use kebab-case
