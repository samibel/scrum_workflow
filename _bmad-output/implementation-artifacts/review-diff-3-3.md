# Code Review Diff for Story 3-3

## File 1: scrum_workflow/workflows/refinement.md

### Added: Step 10 (Synthesis Phase) at line 366

```markdown
## Step 10: Synthesis Phase

After collecting user feedback on all three perspectives, invoke the synthesis skill to merge accepted perspectives into a coherent updated story file.

### Step 10.1: Invoke Synthesis Skill

Invoke `scrum_workflow/skills/synthesis/SKILL.md` to merge accepted agent perspectives:

- Pass accepted perspectives based on user feedback ({architect_accepted}, {developer_accepted}, {qa_accepted})
- Pass original story.md for baseline
- Pass refinement template for audit file creation
- Filter perspectives: only merge accepted perspectives, preserve rejected for auditability

### Step 10.2: Create Refinement Audit File

Create `sprints/SW-XXX/refinement.md` containing:

- All agent perspectives (accepted and rejected) for auditability
- User feedback decisions (accept/reject for each perspective)
- Synthesis summary with findings counts and accepted changes
- Feedback notes with stakeholder decisions and rationale

Use template from `scrum_workflow/templates/refinement.md`.

### Step 10.3: Update Story File

Update `sprints/SW-XXX/story.md` with synthesized content:

- Merge Architect findings into story description (if accepted)
- Merge QA proposed acceptance criteria into story acceptance criteria (if accepted)
- Merge Dev recommendations into subtasks (if accepted)
- Update estimation based on complexity revealed by accepted perspectives

**Critical (NFR12)**: Ensure synthesis output fits within platform context limits by referencing `config.yaml` token budgets.

### Step 10.4: Validate Synthesis Output

Validate synthesis output:

- Confirm refinement.md contains all perspectives (accepted and rejected)
- Confirm story.md is updated with only accepted content
- Verify user feedback is recorded in refinement.md
- Verify synthesis output fits within token budget (coordination budget from config.yaml)
```

### Modified: Write Boundaries section at line 410

```markdown
## Write Boundaries

This workflow may write:

- `sprints/SW-XXX/story.md` -- Status update (`status: refinement`, `updated: <today>`) and synthesized content updates
- `sprints/SW-XXX/refinement.md` -- Refinement audit file with all perspectives and feedback record

This workflow may NOT write:
```

## File 2: scrum_workflow/commands/refine-ticket.md

### Modified: Output section at line 27

```markdown
## Output

- `sprints/SW-XXX/story.md` -- Updated with `status: refinement`, `updated: <today>`, and synthesized content from accepted perspectives
- `sprints/SW-XXX/refinement.md` -- Refinement audit file containing all agent perspectives (accepted and rejected), user feedback decisions, and synthesis summary
- Three agent perspectives displayed to the user (Architect, Developer, QA), each following the table-based output format defined in Architecture Pattern 3
- Each agent perspective includes Findings table, Recommendations, and Proposed Acceptance Criteria
- User prompted to accept or reject each perspective individually
- Accepted perspectives merged into story via synthesis skill (see `skills/synthesis/SKILL.md`)
```

## File 3: scrum_workflow/skills/synthesis/SKILL.md

### Added: Context Window Compliance (NFR12) section at line 129

```markdown
## Context Window Compliance (NFR12)

The synthesis output MUST fit within the platform's coordination token budget to prevent context window overflow.

**Token Budget Configuration:**
- Read `token_budgets.{platform}.coordination` from `scrum_workflow/config.yaml`
- Current platform: `claude-code` with coordination budget of 4000 tokens
- Warn when synthesis output approaches 80% of platform's limit (3200 tokens for claude-code)
- If synthesis would exceed budget, prioritize by severity: Critical > Major > Minor findings

**Validation Strategy:**
- Estimate output token count before generating synthesis
- If approaching limit, consolidate findings and summarize recommendations
- Preserve Critical findings in full, summarize Major and Minor as needed
- Always preserve user feedback record in refinement.md for auditability
```
