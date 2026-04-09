# Refinement Workflow

**6-Phase Structure:**

This workflow orchestrates multi-agent refinement through 6 phases:
1. **Phase 1: Doc-Discovery** - Load auto-context + prompt user for additional documents
2. **Phase 2: Agent Dispatch & Initial Perspectives** - Invoke agent-dispatcher skill for dynamic agent selection, then spawn dispatched agents in parallel with isolated context
3. **Phase 3: Cross-Talk Rounds** - Up to 3 rounds with binary blocker classification and early exit on consensus
4. **Phase 4: Estimation** - Wideband Delphi with variance handling
5. **Phase 5: Synthesis** - Merge agreed perspectives into story.md, cleanup temp files
6. **Phase 6: Readiness Check** - Validate story completeness

---

## Prerequisites

- Story file exists at `_scrum-output/sprints/SW-XXX/story.md` with `status: draft`
- Status transitions during this workflow: `draft` → `refinement` (on start) → `refined` (on completion)
- Project context exists at `_scrum-output/context/index.md`
- Agent role definitions exist at `scrum_workflow/agents/architect.md`, `scrum_workflow/agents/developer.md`, `scrum_workflow/agents/qa.md`

## Step 1: Validation

Validate prerequisites, guard conditions, and story file integrity before any processing begins.

### Step 1.1: Prerequisite Validation

Invoke `scrum_workflow/skills/prerequisite-validation/SKILL.md` to check required files:

- Check if `_scrum-output/sprints/SW-XXX/story.md` exists
- Check if `_scrum-output/context/index.md` exists
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

Check if `_scrum-output/context/index.md` exists at the project root.

**If not found**, return an actionable error:

```
Error: Project context not found. Run '/scrum-create-project-context' first
Fix: Run '/scrum-create-project-context' to generate project context files before refinement
```

**Note**: This check is redundant with prerequisite validation in Step 1.1, but is kept for defense-in-depth.

### Step 4.2: Load Project Context Index

Read `_scrum-output/context/index.md` to understand the project structure and identify which domain the ticket belongs to.

**Domain determination:** Parse the story description and acceptance criteria from `_scrum-output/sprints/SW-XXX/story.md` to identify keywords that map to domains:

- API, endpoint, service, database, backend keywords -- `backend` domain
- UI, component, page, form, frontend keywords -- `frontend` domain
- Test, coverage, assertion, testing keywords -- `testing` domain
- Deploy, CI, pipeline, Docker, devops keywords -- `devops` domain
- Architecture, pattern, design, system keywords -- `architecture` domain

Store the identified domain as `{ticket-domain}` for use in agent context loading.

### Step 4.3: Load Domain Context Files

Based on the identified `{ticket-domain}`, load the relevant domain context file:

- If `{ticket-domain}` is `backend`, load `_scrum-output/context/backend.md`
- If `{ticket-domain}` is `frontend`, load `_scrum-output/context/frontend.md`
- If `{ticket-domain}` is `testing`, load `_scrum-output/context/testing.md`
- If `{ticket-domain}` is `devops`, load `_scrum-output/context/devops.md`
- If `{ticket-domain}` is `architecture`, load `_scrum-output/context/architecture.md`
- If no specific domain is identified, load only `_scrum-output/context/index.md`

## Step 4.5: Doc-Discovery Phase

Prompt the user for additional documents to include in agent context, beyond auto-detected context.

### Step 4.5.1: Prompt User for Additional Documents

After auto-detected context is loaded, prompt the user:

```
**Document Discovery**

Auto-detected context loaded from `_scrum-output/context/`:
- context/index.md (project overview)
- context/{domain}.md (domain-specific context, if applicable)

Are there additional documents I should consider for this refinement?
Examples: Architecture docs, API specs, coding standards, external references.

Provide file paths or URLs (one per line), or type **skip** to proceed.
```

### Step 4.5.2: Collect User Input

Wait for user response. Parse input:
- Lines starting with `http://` or `https://` → URLs
- Other non-empty lines → file paths
- `skip` (case-insensitive) → proceed with auto-detected context only

**If user types "skip"**, set `{discovered_documents}` to empty array and proceed to Step 5.

### Step 4.5.3: Validate Paths

For each file path provided:
- Check if path exists using file system
- If path is relative, resolve from project root
- Collect validation errors for invalid paths

**On validation failure**, display:
```
⚠️ Document not found: {path}
Continue with remaining documents? [yes/no]
```

If user answers "no", halt and allow them to provide corrected input.

### Step 4.5.4: Fetch URLs

For each URL provided:
- Fetch content using WebFetch tool
- Validate content is accessible (HTTP 200)
- Store fetched content for agent context

**On fetch failure**, display:
```
⚠️ URL not accessible: {url} (error: {error_message})
Continue with remaining documents? [yes/no]
```

If user answers "no", halt and allow them to provide corrected input.

### Step 4.5.5: Store Discovered Documents

Store list of discovered documents for:
1. Agent context injection (Steps 5-7)
2. Refinement.md documentation (Step 10)

Store as `{discovered_documents}` array with structure:
```json
[
  {"type": "path", "value": "docs/architecture.md", "valid": true},
  {"type": "url", "value": "https://api.example.com/docs", "valid": true, "content": "..."}
]
```

## Step 4.6: Agent Dispatch

Invoke the agent-dispatcher skill to dynamically determine which agents to spawn based on story attributes.

### Step 4.6.1: Invoke Agent Dispatcher Skill

Invoke `scrum_workflow/skills/agent-dispatcher/SKILL.md` with the story frontmatter values:

- `type`: Story type from frontmatter (feature, bugfix, refactor, infrastructure)
- `risk_level`: Story risk level from frontmatter (low, medium, high, critical)
- `domain_tags`: Story domain tags array from frontmatter
- `depth`: Story depth from frontmatter (light, standard, heavy)

The dispatcher reads dispatch rules from `scrum_workflow/data/dispatch-rules.yaml` and checks agent file existence in `scrum_workflow/agents/`.

**If `agent_dispatch_enabled` is `false` in config.yaml:** Skip dispatch and use static default set `[architect, developer, qa]`.

### Step 4.6.2: Process Dispatcher Output

Receive the dispatcher's structured output:

```yaml
agents:
  - architect
  - developer
  - qa
dispatch_rationale: "Type 'feature' uses default set. Risk 'medium' — no additions. No matching domain tags."
skipped_agents: []
```

Store the dispatched agent list as `{dispatched_agents}`.
Store the dispatch rationale as `{dispatch_rationale}`.
Store the skipped agents as `{skipped_agents}`.

### Step 4.6.3: Validate Dispatched Agent Set

Verify that `{dispatched_agents}` contains at least one agent. If empty (all agents were skipped), fall back to the default set `[architect, developer, qa]` and add note: "All dispatched agents were unavailable — falling back to default set."

### Step 4.6.4: Log Dispatch Summary

Display the dispatch summary to the user:

```
📋 Agent Dispatch Summary

Dispatched Agents: [{dispatched_agents}]
Rationale: {dispatch_rationale}
{{#if skipped_agents}}
Skipped Agents:
{{#each skipped_agents}}
  - {agent}: {reason}
{{/each}}
{{/if}}
```

## Step 5: Spawn Dispatched Agents

Dynamically spawn each agent in the dispatched agent set. For each agent in `{dispatched_agents}`, load the agent definition, prepare isolated context, invoke the agent, and collect the perspective.

**Critical:** The dynamic agent spawning loop preserves context isolation — each agent ONLY receives its defined context bundle, never other agents' definitions or perspectives (until cross-talk).

### Step 5.1: Dynamic Agent Spawning Loop

For each `{agent-name}` in `{dispatched_agents}`:

1. **Load agent definition** from `scrum_workflow/agents/{agent-name}.md`
2. **Prepare isolated context bundle** per the agent's Context Rules:
   - `_scrum-output/sprints/SW-XXX/story.md` — The story being refined
   - `_scrum-output/context/index.md` — Project context overview
   - `_scrum-output/context/{ticket-domain}.md` — Domain-specific context (if identified)
   - `scrum_workflow/agents/{agent-name}.md` — The agent's own role definition
   - **{discovered_documents}** — All documents from doc-discovery phase (if any)
   - Additional context per agent type (e.g., architect gets architecture.md, qa gets testing.md)
3. **Invoke agent** with the prepared context bundle
4. **Collect perspective** as `{agent-name}_perspective`

**Isolation principle:** Each agent receives ONLY its own role definition file and relevant context. It does NOT receive other agents' role definitions or perspectives.

### Step 5.2: Store Agent Perspectives

Store all collected perspectives indexed by agent name:

```json
{
  "perspectives": {
    "{agent-name}": "{agent-name}_perspective",
    ...
  }
}
```

### Step 5.3: Create Temp Directory and Write Round 0 Analyses

Create the temp directory for storing agent analyses:

```
sprints/SW-XXX/temp/
```

**Action:**
- Check if temp directory exists
- If not, create using `mkdir -p sprints/SW-XXX/temp/`
- Store path as `{temp_dir}` for subsequent steps

After all dispatched agents complete their initial analyses, write each to a temp file:

For each `{agent-name}` in `{dispatched_agents}`:
- `sprints/SW-XXX/temp/{agent-name}-round-0.md` -- Agent's full analysis

**File Format:**
Each temp file contains the agent's complete perspective output including:
- Findings table
- Recommendations
- Proposed Acceptance Criteria
- Any additional analysis notes

### Step 5.4: Initialize Cross-Talk State

Initialize state tracking for discussion rounds:

```json
{
  "current_round": 0,
  "max_rounds": {{refinement_max_rounds}},
  "blockers": [],
  "non_blockers": [],
  "early_exit": false,
  "deadlock": false,
  "round_summaries": []
}
```

Store as `{cross_talk_state}`.

## Step 7.5: Cross-Talk Discussion Rounds

Execute iterative discussion rounds where dispatched agents see and comment on each other's perspectives.

**Note:** If only 1 agent was dispatched (e.g., light depth → developer only, or extreme override), skip cross-talk entirely and use single-perspective flow. Proceed directly to Step 7.6 for estimation (single agent estimate).

### Step 7.5.1: Round 1 - Cross-Talk (400 words per agent)

**Progressive Truncation:** Each agent gets 400 words for their response.

**For each `{agent-name}` in `{dispatched_agents}`:**

Create context bundle containing:
1. This agent's own Round 0 analysis (from temp file)
2. All other dispatched agents' Round 0 analyses (from temp files)
3. Cross-talk prompt

**Cross-Talk Prompt:**
```
You are the {agent-name} agent in a cross-talk discussion round.

Your task is to review the other agents' analyses and provide:

1. **Agreements**: Where do you AGREE with their findings?
2. **Disagreements**: Where do you DISAGREE and why?
3. **Blind Spots**: What blind spots did they identify that you missed?

Context limit: 400 words for your response.

Format your response as:
**Agrees with:** [list agreements]
**Disagrees with:** [list disagreements with reasoning]
**Blind spots identified:** [list blind spots you now see]
```

### Step 7.5.2: Binary Blocker Classification

After each round, classify all disagreements:

**For each disagreement identified:**

Prompt the relevant agent:
```
You identified a disagreement: [disagreement_description]

Does this **block** implementation? (Yes/No)

- **Yes (Blocker)**: Must be resolved before synthesis
- **No (Non-Blocker)**: Document and proceed

Consider: Can the story proceed without resolving this? Is there a workaround?
```

**Security Auto-Blocker Rule:**
If any agent identifies a security risk, automatically classify as blocker:
```
⚠️ Security issue detected: [description]
Automatically marked as BLOCKER (cannot be overridden)
```

**Store classifications in `{cross_talk_state}`:**
```json
{
  "blockers": [
    {"description": "...", "agent": "architect", "severity": "high"}
  ],
  "non_blockers": [
    {"description": "...", "agent": "developer", "severity": "low"}
  ]
}
```

### Step 7.5.3: Progress Visibility

After Round 1, display progress:

```
📊 Round 1 Complete
- Blockers: X
- Non-Blockers: Y
- Next: Round 2 (300 words per agent)
```

### Step 7.5.4: Early Consensus Check

**Check if early exit is possible:**
- If `blockers.length === 0`
- AND `early_exit_on_consensus` is `true` (default)

```
✅ Early Consensus Reached

All blockers resolved. Proceeding to synthesis without further rounds.
- Rounds completed: 1
- Remaining non-blockers: Y (documented for reference)
```

If early consensus reached, skip remaining cross-talk rounds and proceed to Step 8 (Display Agent Perspectives).

### Step 7.5.5: Round 2 - Cross-Talk (300 words per agent)

Same pattern as Round 1, but with 300-word limit per agent.

**Focus on:**
- Resolving remaining blockers
- Refining positions based on previous round feedback

### Step 7.5.6: Round 3 - Cross-Talk (200 words per agent)

Same pattern as Round 2, but with 200-word limit per agent.

**Final attempt to resolve blockers.**

### Step 7.5.7: Deadlock Detection

After Round 3 (or configured max rounds), check for remaining blockers:

**If blockers remain:**

```
⚠️ REFINEMENT DEADLOCK after 3 rounds

Blocking Issues:
1. [Blocker description] — [Agent]'s proposal
2. [Blocker description] — [Agent]'s proposal

Resolution Options:
1. Accept [Agent]'s proposal
2. Provide alternative
3. Cancel and revert story to Draft

What would you like to do?
```

**User Resolution Options:**

1. **Accept Agent's Proposal**: Choose which agent's position to adopt
2. **Provide Alternative**: User provides their own resolution
3. **Cancel**: Revert story to `draft` status for further refinement

**Store resolution in `{cross_talk_state}`:**
```json
{
  "deadlock": true,
  "deadlock_resolution": "user_choice_1",
  "resolved_blockers": [...]
}
```

### Step 7.5.8: Document Discussion Rounds

After cross-talk completes (either by consensus, deadlock resolution, or max rounds):

1. **Write round summaries to temp files:**
   - `sprints/SW-XXX/temp/round-1-summary.md`
   - `sprints/SW-XXX/temp/round-2-summary.md`
   - `sprints/SW-XXX/temp/round-3-summary.md`

2. **Update `{cross_talk_state}` with final status**

3. **Proceed to Step 7.6 for estimation**

## Step 7.6: Estimation Phase - Initial Estimates

After cross-talk discussion rounds complete, collect independent story point estimates from each dispatched agent using Wideband Delphi methodology (for 2+ agents) or single agent estimate (for 1 agent).

### Step 7.6.1: Initialize Estimation State

Initialize estimation tracking for all dispatched agents:

```json
{
  "estimates": {},
  "rationales": {},
  "variance": null,
  "threshold": {{estimation_variance_threshold}},
  "re_estimation_needed": false,
  "re_estimation_count": 0,
  "max_re_estimation_rounds": 2,
  "final_estimate": null,
  "confidence_level": null,
  "dispatched_agents": {{dispatched_agents}}
}
```

Store as `{estimation_state}`.

### Step 7.6.2: Collect Independent Estimates

**Critical:** Each agent must provide their estimate independently without seeing others' estimates. This prevents anchoring bias.

**For each `{agent-name}` in `{dispatched_agents}`:**

Spawn the agent with an estimation prompt:

```
You are the {{agent_name}} agent providing a story point estimate.

Story: {story_content}
Cross-talk findings: {cross_talk_summary}

Provide your estimate considering:
- **Architect**: Focus on architectural impact, dependencies, system design complexity
- **Developer**: Focus on implementation complexity, dependencies, library choices
- **QA**: Focus on testing strategy, edge cases, quality assurance effort

**Estimation Rules:**
- Use Fibonacci scale: 1, 2, 3, 5, 8, 13, 21
- Provide a single number (no ranges)
- Include a brief rationale (1-2 sentences)

**Format your response:**
Estimate: X SP
Rationale: [your reasoning]
```

**Collect estimates independently:**
For each `{agent-name}` in `{dispatched_agents}`:
- Store `{agent-name}_estimate` and `{agent-name}_rationale`

### Step 7.6.3: Store Initial Estimates

Update `{estimation_state}` with collected estimates from all dispatched agents:

```json
{
  "estimates": {
    "{agent-name-1}": {{agent-name-1_estimate}},
    "{agent-name-2}": {{agent-name-2_estimate}},
    ...
  },
  "rationales": {
    "{agent-name-1}": "{{agent-name-1_rationale}}",
    "{agent-name-2}": "{{agent-name-2_rationale}}",
    ...
  }
}
```

## Step 7.7: Variance Check

Calculate variance between estimates to determine if re-estimation discussion is needed.

### Step 7.7.1: Calculate Variance

Calculate the range (max - min) of the estimates across all dispatched agents:

```
all_estimates = [estimate for each agent in dispatched_agents]
variance = max(all_estimates) - min(all_estimates)
```

Store as `{variance}`.

### Step 7.7.2: Compare Against Threshold

Get threshold from config (default: 2 points):

```yaml
estimation_variance_threshold: 2
```

**If variance <= threshold:**
- Set `{re_estimation_needed}` = false
- Proceed directly to Step 7.9 (Final Estimate)

**If variance > threshold:**
- Set `{re_estimation_needed}` = true
- Proceed to Step 7.8 (Re-Estimation)

### Step 7.7.3: Display Variance Summary

Display the variance check result (for all dispatched agents):

```
📊 Estimation Variance Check

| Agent | Estimate (SP) | Rationale |
|-------|---------------|-----------|
{{#each dispatched_agents}}
| {{agent-name}} | {{agent-name_estimate}} | {{agent-name_rationale}} |
{{/each}}

**Variance:** {{variance}} points
**Threshold:** {{threshold}} points
**Status:** {{if variance <= threshold: "Within threshold" else: "Re-estimation needed"}}
```

## Step 7.8: Re-Estimation Discussion

If variance exceeds threshold, facilitate a discussion round to reach consensus.

### Step 7.8.1: Increment Re-Estimation Counter

```json
{
  "re_estimation_count": {{re_estimation_count}} + 1
}
```

### Step 7.8.2: Facilitate Estimation Discussion

Spawn each dispatched agent with visibility of all estimates for discussion:

```
You are the {{agent_name}} agent in an estimation discussion round.

**All Estimates:**
{{#each dispatched_agents}}
- {{agent-name}}: {{agent-name_estimate}} SP - "{{agent-name_rationale}}"
{{/each}}

**Variance:** {{variance}} points (threshold: {{threshold}} points)

Your task:
1. Review the other agents' estimates and rationales
2. Consider if your estimate should change based on their reasoning
3. Provide a revised estimate (or keep your original)

**Format your response:**
Revised Estimate: X SP
Rationale: [your reasoning for keeping or changing]
```

### Step 7.8.3: Collect Revised Estimates

Store revised estimates from all dispatched agents in `{estimation_state}`:

```json
{
  "revised_estimates": {
    "{agent-name-1}": {{agent-name-1_revised}},
    "{agent-name-2}": {{agent-name-2_revised}},
    ...
  },
  "revised_rationales": {
    "{agent-name-1}": "{{agent-name-1_revised_rationale}}",
    "{agent-name-2}": "{{agent-name-2_revised_rationale}}",
    ...
  }
}
```

### Step 7.8.4: Re-Check Variance

Calculate new variance with revised estimates.

**If new variance <= threshold:**
- Proceed to Step 7.9 (Final Estimate)

**If new variance > threshold AND re_estimation_count < max_re_estimation_rounds:**
- Repeat Step 7.8 with updated estimates

**If new variance > threshold AND re_estimation_count >= max_re_estimation_rounds:**
- Proceed to Step 7.8.5 (Deadlock Resolution)

### Step 7.8.5: Estimation Deadlock Resolution

If variance still exceeds threshold after max re-estimation rounds:

```
⚠️ ESTIMATION DEADLOCK after {{max_re_estimation_rounds}} rounds

Estimates still vary by {{new_variance}} points (threshold: {{threshold}})

| Agent | Final Estimate (SP) | Rationale |
|-------|---------------------|-----------|
{{#each dispatched_agents}}
| {{agent-name}} | {{agent-name_revised}} | {{agent-name_revised_rationale}} |
{{/each}}

**Resolution Options:**
1. Accept median estimate: {{median}} SP
2. Choose specific agent's estimate
3. Provide custom estimate
4. Escalate for user decision

What would you like to do?
```

**User Resolution:**
- Store user's choice in `{estimation_state.deadlock_resolution}`
- Use the resolved estimate as `{final_estimate}`

## Step 7.9: Final Estimate Calculation

Calculate the final estimate using median calculation.

### Step 7.9.1: Calculate Median

Use the latest estimates (revised if re-estimation occurred, otherwise initial) from all dispatched agents:

```
all_estimates = [estimate for each agent in dispatched_agents]
sorted_estimates = sort(all_estimates)
median = sorted_estimates[floor(length / 2)]  // Middle value for odd count, upper-middle for even count
```

**Special case:** If only 1 agent was dispatched, the single estimate is the final estimate (no Wideband Delphi needed).

Store as `{final_estimate}`.

### Step 7.9.2: Determine Confidence Level

Calculate confidence level based on variance:

| Variance | Confidence Level |
|----------|-----------------|
| 0 points | High |
| 1-2 points | Medium |
| 3+ points | Low |

Store as `{confidence_level}`.

### Step 7.9.3: Update Estimation State

```json
{
  "final_estimate": {{final_estimate}},
  "confidence_level": "{{confidence_level}}",
  "estimation_complete": true
}
```

## Step 7.10: Store Estimate in Story

Update the story.md file with the final estimate.

### Step 7.10.1: Read Current Story File

Read `_scrum-output/sprints/SW-XXX/story.md`.

### Step 7.10.2: Update YAML Frontmatter

Add/update the `estimate` field in the YAML frontmatter:

```yaml
---
schema_version: 1
ticket: "SW-XXX"
title: "{{story_title}}"
status: refined
estimate: {{final_estimate}}
confidence: {{confidence_level}}
created: "{{created_date}}"
updated: "{{current_date}}"
---
```

### Step 7.10.3: Atomic Write

Write the complete story file atomically (NFR1 compliance).

## Step 7.11: Document Estimation in Refinement

Add the estimation section to the refinement.md file.

### Step 7.11.1: Update Refinement Template Data

Prepare estimation data for the refinement.md template:

```markdown
## Estimation

### Initial Estimates

| Agent | Estimate (SP) | Rationale |
|-------|---------------|-----------|
{{#each dispatched_agents}}
| {{agent-name}} | {{agent-name_estimate}} | {{agent-name_rationale}} |
{{/each}}

**Variance:** {{variance}} points
**Threshold:** {{threshold}} points

{{#if re_estimation_needed}}
### Re-Estimation

**Discussion Round:** {{re_estimation_discussion}}

| Agent | Revised Estimate (SP) | Rationale |
|-------|----------------------|-----------|
{{#each dispatched_agents}}
| {{agent-name}} | {{agent-name_revised}} | {{agent-name_revised_rationale}} |
{{/each}}

**New Variance:** {{new_variance}} points
{{/if}}

### Final Estimate

**Median:** {{final_estimate}} SP
**Method:** {{#if single_agent}}Single Agent Estimate{{else}}Wideband Delphi{{/if}}
**Confidence Level:** {{confidence_level}}
```

### Step 7.11.2: Write to Refinement File

Append the estimation section to `_scrum-output/sprints/SW-XXX/refinement.md`.

### Step 7.11.3: Display Estimation Summary

```
✅ Estimation Complete

**Final Estimate:** {{final_estimate}} SP
**Confidence Level:** {{confidence_level}}
**Method:** {{#if single_agent}}Single Agent Estimate{{else}}Wideband Delphi (median of {{agent_count}} agent estimates){{/if}}

Estimate stored in:
- story.md (YAML frontmatter)
- refinement.md (Estimation section)
```

### Step 7.11.4: Proceed to Synthesis

After estimation is complete, proceed to Step 8 for synthesis.

## Step 8: Display Agent Perspectives

Present all dispatched agent perspectives to the user in sequential, clearly labeled sections.

### Step 8.1: Present Each Dispatched Agent's Perspective

For each `{agent-name}` in `{dispatched_agents}`, display the agent's perspective with a clear section header:

```
## {Agent-Name} Perspective

{agent-name_perspective}
```

**Presentation requirements:**
- Each perspective is displayed in a separate, clearly labeled section
- Perspectives are presented sequentially in the order they appear in `{dispatched_agents}`
- Each perspective maintains the table-based format with Findings, Recommendations, and Proposed Acceptance Criteria
- No perspective is influenced or modified by another agent's output

## Step 9: Await User Feedback

Prompt the user to review and provide feedback on each dispatched agent perspective individually.

### Step 9.1: Prompt for Each Agent's Perspective Feedback

For each `{agent-name}` in `{dispatched_agents}`, ask the user:

```
Do you accept the {Agent-Name} perspective? [accept/reject/suggest-changes]
```

Wait for user input before proceeding to the next agent.

### Step 9.2: Handle User Feedback

Collect the user's responses for each dispatched agent perspective:

- **accept**: The perspective is approved and will be included in synthesis
- **reject**: The perspective is discarded and will not be included in synthesis
- **suggest-changes**: The user provides specific feedback for refinement (handled in Story 3.3 synthesis)

Store the user's acceptance decisions for each agent as `{agent-name_accepted}` for use in the synthesis phase.

### Step 9.5: Invoke Feedback Collection Skill

**Prerequisites Check:**
- Verify feedback-collection skill exists: `scrum_workflow/skills/feedback-collection/SKILL.md`
- If prerequisites fail, halt with actionable error message

**Invocation:**
Invoke `scrum_workflow/skills/feedback-collection/SKILL.md` (direct skill invocation, not sub-agent spawning) to collect structured feedback:

- Present each dispatched agent's perspective sequentially (in order of `{dispatched_agents}`)
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

After collecting user feedback on all dispatched agent perspectives, invoke the synthesis skill to merge accepted perspectives into a coherent updated story file.

### Step 10.0: Prepare Synthesis Context

**Include in synthesis:**
- All dispatched agent perspectives (accepted and rejected)
- Cross-talk discussion rounds summary (if 2+ agents were dispatched)
- Blocker/non-blocker resolution status
- Final consensus points
- Dispatch Summary with agent selection rationale

### Step 10.1: Invoke Synthesis Skill

**Prerequisites Check:**
- Verify synthesis skill file exists: `scrum_workflow/skills/synthesis/SKILL.md`
- Validate user feedback variables are defined and contain valid boolean values
- If prerequisites fail, halt with actionable error message

**Invocation:**
Invoke `scrum_workflow/skills/synthesis/SKILL.md` (direct skill invocation, not sub-agent spawning) to merge accepted agent perspectives:

- Pass accepted perspectives based on user feedback ({agent-name_accepted} for each dispatched agent)
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

- **Dispatch Summary** section: dispatched agents, dispatch rationale, skipped agents with reasons (from `{dispatch_rationale}` and `{skipped_agents}`)
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
{{#each dispatched_agents}}
- {{agent-name}} Perspective: [accept/reject]
  - Comment: [text]
  - Timestamp: [ISO_8601]
  - User: [name]
{{/each}}

### Quality Tracking Summary
- Total Perspectives: {{dispatched_agents.length}}
- Accepted: [count]
- Rejected: [count]
- Acceptance Rate: [percentage]%
```

### Step 10.3: Update Story File

**Special Case - All Perspectives Rejected:**
If all dispatched agent perspectives were rejected by the user:
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
- Merge accepted agent perspectives into story content (based on each agent's focus area)
- For Architect agent: merge architectural findings into story description
- For QA agent: merge proposed acceptance criteria into story acceptance criteria
- For Developer agent: merge recommendations into subtasks
- For extended agents (security-reviewer, ux-reviewer, contract-validator): merge domain-specific findings
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
- Confirm refinement.md contains Discussion Rounds section with cross-talk summaries
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

### Step 10.5: Cleanup Temp Files

**Conditional Cleanup:**
After successful synthesis, clean up temp files unless `keep_agent_temp_files` is `true`.

**Default:** `keep_agent_temp_files: false` (temp files are deleted)

**Cleanup Actions:**
1. Check config for `keep_agent_temp_files` setting
2. If `false` (default):
   - Delete `sprints/SW-XXX/temp/` directory
   - Log cleanup in refinement.md: "Temp files cleaned up after synthesis"
3. If `true`:
   - Preserve temp files for debugging
   - Log in refinement.md: "Temp files preserved for debugging (keep_agent_temp_files: true)"

**Files to Clean (if cleanup enabled):**
For each `{agent-name}` in `{dispatched_agents}`:
- `sprints/SW-XXX/temp/{agent-name}-round-0.md`
And for each cross-talk round:
- `sprints/SW-XXX/temp/round-{N}-summary.md`

## Step 10.6: Decision Extraction (Phase 6a)

After synthesis writes `refinement.md` and cleanup is complete, invoke the decision-extraction skill to capture any technology, architecture, or scope decisions embedded in the refinement feedback.

### Step 10.6.1: Invoke Decision Extraction Skill

Invoke `scrum_workflow/skills/decision-extraction/SKILL.md` with:

- `source`: `refinement`
- `source_file`: `_scrum-output/sprints/SW-XXX/refinement.md`
- `ticket`: SW-XXX

The skill scans the refinement.md content for decision signal phrases (e.g., "chose X over Y", "selected because", "using X instead of Y") and creates DR-XXX.md artifacts in `_scrum-output/memory/decisions/`.

### Step 10.6.2: Report Decision Extraction Results

Include extracted decisions in the refinement completion summary:

**If decisions were found:**
```
Extracted 2 decision records: DR-001.md, DR-002.md
```

**If no decisions found:**
```
No decisions detected in refinement feedback
```

**Write boundary for this step:**
- The decision-extraction skill may ONLY write to `_scrum-output/memory/decisions/DR-XXX.md`
- It MUST NOT modify `refinement.md`, `story.md`, or any sprint artifact

## Step 11: Readiness Check Gate

After synthesis is complete and validated, run the readiness check to ensure the story is complete before allowing implementation.

### Step 11.1: Prerequisites Check

Verify readiness check components exist:
- `scrum_workflow/skills/readiness-check/SKILL.md` exists
- `scrum_workflow/workflows/readiness-check.md` exists
- Current story status is `refined` (expected from Step 10)

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
2. **Update story.md status** to `refined` (if not already set)
3. **Update `updated` field** to current date (ISO 8601)
4. **Use atomic write operation** (NFR1 compliance)

**Output success message:**
```
✅ Story SW-XXX refinement complete
Status updated: refinement → refined
Next step: Run '/scrum-refine-story SW-XXX' to validate and create execution plan
```

**Note:** The readiness check and plan.md creation are now handled by the separate `/scrum-refine-story` command, which transitions the story from `refined` → `ready-for-dev`.

### Step 11.4: Validate State Transition

After updating status:

- Verify story.md status is now `refined`
- Verify refinement.md contains all perspectives, feedback, and synthesis summary
- Verify no unintended modifications to other story sections

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
- `_scrum-output/context/` -- Context files are managed by `/scrum-create-project-context`

## Validation Rules

- Story status must be `draft` before refinement begins
- Story status must be updated to `refinement` at start, then `refined` on completion, each in a single atomic write
- All dispatched agents must be spawned with isolated contexts (no cross-contamination)
- Each agent receives only its role definition file, not other agents' role files
- Context file references must use correct paths with `scrum_workflow/` prefix for framework files
- Agent spawning must follow the dynamic agent spawning loop driven by agent-dispatcher output
- Domain determination must be based on story content keywords
- Error messages must follow actionable pattern from Architecture Pattern 5
- All YAML fields must use snake_case
- All file names and references must use kebab-case
