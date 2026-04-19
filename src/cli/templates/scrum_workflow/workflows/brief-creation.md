# Brief Creation Workflow

Step-by-step workflow for the `/scrum-create-brief` command. Transforms a raw idea into a structured product brief via Iterative Multi-Agent Brainstorming + Reflection Loop. Terminates when no open questions remain (`status: complete`).

## Prerequisites

- Framework installed with templates in `scrum_workflow/templates/`
- `scrum_workflow/agents/{product-strategist,architect,qa}.md` exist
- `scrum_workflow/skills/synthesis/SKILL.md` exists (reused)
- `scrum_workflow/skills/prerequisite-validation/SKILL.md` exists (reused)
- Project context at `_scrum-output/context/index.md` is **optional** — greenfield projects may have none

## Step 0: Input & State Resolution

### Step 0.1: Parse Invocation Mode

Determine invocation mode from arguments:

- **New brief**: `"<raw idea>"` (string argument, no `PB-XXX` prefix)
- **Resume**: `PB-XXX --resume`
- **Restart**: `PB-XXX --restart`

### Step 0.2: Auto-Number New Briefs

If mode is "new brief":

- Scan `_scrum-output/briefs/` for existing `PB-*.md` files
- Assign the next sequential ID: `PB-<max+1 zero-padded 3 digits>` (first is `PB-001`)

### Step 0.3: State File Check

- **New brief**: No state file expected. If one exists with the assigned ID → halt with collision error.
- **Resume**: Load `_scrum-output/briefs/.brief-state-PB-XXX.json`. If missing → error, tell user to run without `--resume`.
- **Restart**: Confirm with user, delete state file + brief file, then treat as new brief with the same ID.

### Step 0.4: Validate Raw Idea (new brief only)

- Must be non-empty, non-whitespace
- Minimum 1 non-whitespace character

On empty: halt with `Error: Raw idea cannot be empty. Provide an idea as argument.`

## Step 1: Initial Capture

### Step 1.1: Create Brief File

If mode is "new brief":

- Load `scrum_workflow/templates/brief.md`
- Fill frontmatter: `brief_id`, `title: <derived from idea>`, `status: captured`, `idea`, `created`, `updated`, `interview_rounds: 0`
- Title derivation: take first 5-8 words of idea, title-case
- Write atomically (temp + rename) to `_scrum-output/briefs/PB-XXX.md`

### Step 1.2: Initialize State File

Write `_scrum-output/briefs/.brief-state-PB-XXX.json`:

```json
{
  "brief_id": "PB-XXX",
  "current_phase": "brainstorm",
  "current_round": 1,
  "agents_completed": [],
  "pending_questions": [],
  "started_at": "<ISO 8601>"
}
```

## Step 2: Parallel Brainstorming

Spawn three agents in parallel with isolated context. Agents are configurable via `config.yaml` → `greenfield.brief_brainstorm_agents` (default: `[product-strategist, architect, qa]`).

### Step 2.1: Load Agent Definitions

For each agent in the configured list:

- Load `scrum_workflow/agents/<agent>.md`
- Prepare isolated context: raw idea + (if exists) `_scrum-output/context/index.md`

### Step 2.2: Spawn Agents in Parallel

Each agent produces a structured perspective document (temp file in `.brief-state-PB-XXX.json` staging area or memory) matching its defined Output Format.

### Step 2.3: Update State on Each Agent Completion

As each agent completes, update `agents_completed` in the state file. This enables resume if the workflow is interrupted mid-round.

### Step 2.4: Wait for All Agents

Proceed only after all configured agents have returned perspectives.

## Step 3: Synthesis

### Step 3.1: Invoke Synthesis Skill

Load `scrum_workflow/skills/synthesis/SKILL.md` and apply it to the three perspectives:

- Merge personas, goals, non-goals (deduplicate)
- Collect all open questions into `open_questions` array
- Collect all assumptions into `assumptions`
- Collect all risks into `risks`

### Step 3.2: Write Merged Brief

Update `_scrum-output/briefs/PB-XXX.md`:

- Fill body sections: Problem Statement, Target Personas, Goals, Non-Goals, Key Capabilities, Assumptions, Risks, Open Questions
- Update frontmatter: `status: interview` (temporarily — may become `complete` in Step 4)
- Update `updated` timestamp
- Atomic write

## Step 4: Reflection Loop (Aggressive Interview)

### Step 4.1: Check Open Questions

Read `open_questions` from brief frontmatter:

- **If empty** → skip to Step 5 (brief is complete)
- **If non-empty** → enter interview round

### Step 4.2: Check Safety Limit

If `interview_rounds >= greenfield.brief_max_interview_rounds` (default 5):

- Halt with warning showing user 3 options (force-complete manually, continue with override, restart)
- Exit workflow

### Step 4.3: Conduct Interview Round

1. Present `open_questions` to the user, grouped by category (Product, Architecture, Quality)
2. Collect answers (user may type "/skip" to skip an individual question — unskipped questions remain `open`)
3. Append to "Interview Transcript" section of brief with round number + date
4. Merge answers into relevant brief sections (goals, personas, assumptions) via a second synthesis pass
5. Re-evaluate open questions: some may be resolved by answers, new ones may emerge
6. Increment `interview_rounds` in frontmatter
7. Update state file `current_round`

### Step 4.4: Loop or Exit

Return to Step 4.1 (check open questions again). Loop until empty or safety limit.

## Step 5: Finalization

### Step 5.1: Set Status to Complete

Update brief frontmatter: `status: complete`, add to `status_history`.

### Step 5.2: Delete State File

Remove `_scrum-output/briefs/.brief-state-PB-XXX.json`.

### Step 5.3: Print Next Step

Output to user:

```
Brief PB-XXX complete (X interview rounds, Y open questions resolved).
Next: /scrum-decompose-epics PB-XXX
```

## Interruption Recovery

At any step 2-4, if the workflow is interrupted (Ctrl-C, crash, network error):

- The most recent atomic write is the last consistent state
- The state file tracks which agents/rounds completed
- On re-invocation with `--resume`, the workflow resumes from `current_phase` in the state file:
  - `brainstorm` → re-spawn only agents not in `agents_completed`
  - `synthesis` → re-run synthesis on already-collected perspectives
  - `interview` → re-present `pending_questions` to user

## Write Boundaries Enforced

This workflow writes ONLY:
- `_scrum-output/briefs/PB-XXX.md`
- `_scrum-output/briefs/.brief-state-PB-XXX.json` (deleted on completion)

Any attempted write outside these paths halts with a Write Boundary Violation.
