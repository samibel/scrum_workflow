# Story Drafting Workflow

Step-by-step workflow for the `/scrum-draft-stories` command. Generates candidate story drafts for a single epic via the Orchestrator-Worker pattern (N parallel subagents). Produces `draft-stories.md` — users promote individual drafts to tickets via `/scrum-create-ticket --from-epic --from-draft`.

## Prerequisites

- Epic exists at `_scrum-output/epics/EP-XXX/epic.md` with `status: planned` (or `drafted` for `--restart`)
- Parent brief exists (referenced by epic frontmatter `parent_brief`)
- Agents `architect`, `developer`, `qa` exist
- Skills `story-classifier`, `agent-dispatcher` exist

## Step 0: Validation & State Resolution

### Step 0.1: Parse Arguments

- Extract `EP-XXX` (required)
- Detect `--resume` or `--restart` flags (mutually exclusive)

### Step 0.2: Epic Existence Check

If `_scrum-output/epics/EP-XXX/epic.md` does not exist:

```
Error: Epic '_scrum-output/epics/EP-XXX/epic.md' not found.
Fix: Run '/scrum-decompose-epics PB-XXX' to create epics first.
```

### Step 0.3: Epic Status Check

Read epic frontmatter `status`:

- `planned` and no state file: proceed (new drafting run)
- `planned` and state file exists but no flag: halt with "resume/restart required" error
- `drafting` (interrupted): halt with "state file exists" error unless `--resume` or `--restart`
- `drafted` and `--restart`: confirm with user, archive existing `draft-stories.md` to `.archive/`, delete state file, proceed
- `drafted` without `--restart`: halt with "already drafted" error
- Any other status (`in-progress`, `complete`): halt (epic is past drafting phase)

### Step 0.4: State File Resolution

- **New run**: no state file expected
- **Resume**: load `_scrum-output/epics/EP-XXX/.draft-state.json`; error if missing
- **Restart**: delete state file + draft-stories.md, start fresh

## Step 1: Load Inputs

### Step 1.1: Load Epic

Read full `_scrum-output/epics/EP-XXX/epic.md`, especially the Capability Breakdown section.

### Step 1.2: Load Parent Brief (Optional Context)

Read `_scrum-output/briefs/<parent_brief>.md` for personas and goals context. Don't fail if missing — warn and continue.

### Step 1.3: Load Templates & Config

- `scrum_workflow/templates/draft-stories.md`
- `scrum_workflow/config.yaml` → `greenfield.max_parallel_story_drafters` (default 5)

## Step 2: Orchestrate Subagent Spawn

### Step 2.1: Determine N

Let N = `epic.story_count_estimate`. Every capability in the epic gets its own draft — N is **not** capped by the parallelism budget.

`greenfield.max_parallel_story_drafters` governs **concurrency only**: the orchestrator processes the N subagents in batches of size `max_parallel_story_drafters` (e.g. N=12 with budget 5 runs as 5 + 5 + 2). Completed batches update `.draft-state.json` before the next batch spawns, so interruption resume still works.

### Step 2.2: Assign Capabilities

Split the epic's capability breakdown into N slices (one per subagent). Each slice has an index 1..N. Slices map 1:1 to capabilities; do not merge or drop capabilities to hit the concurrency budget.

### Step 2.3: Initialize State File

Write `_scrum-output/epics/EP-XXX/.draft-state.json`:

```json
{
  "epic_id": "EP-XXX",
  "total_drafts": N,
  "subagents_completed": [],
  "subagents_pending": [1, 2, ..., N],
  "subagents_failed": [],
  "started_at": "<ISO 8601>"
}
```

### Step 2.4: Update Epic Status

Update `_scrum-output/epics/EP-XXX/epic.md` frontmatter: `status: drafting`, append `status_history`. Atomic write.

### Step 2.5: Spawn Subagents in Parallel (Batched)

Iterate `subagents_pending` in chunks of `max_parallel_story_drafters`. For each chunk, spawn all its subagents in parallel and wait for the chunk to complete before starting the next one. On resume, only unfinished indices are chunked.

For each spawned subagent:

- Select agent role (rotate through `architect`, `developer`, `qa` to diversify perspective)
- Invoke agent with: epic content + assigned capability slice + brief context
- Agent returns: draft title, description, candidate acceptance criteria, suggested story points

### Step 2.6: Update State on Each Completion

As each subagent returns:

- Move index from `subagents_pending` → `subagents_completed`
- Store the draft result in memory (aggregated in Step 3)
- Atomic rewrite of `.draft-state.json`

If a subagent fails (crash, timeout, invalid output):

- Move index to `subagents_failed` with error reason
- Do NOT abort the whole run — continue with other subagents

### Step 2.7: Wait for All Subagents

Proceed after all subagents have returned or failed. If any failed and not running `--resume`, advise user to re-run with `--resume` to retry failed ones.

## Step 3: Aggregate & Classify

### Step 3.1: Classify Each Draft

For each completed draft, invoke `scrum_workflow/skills/story-classifier/SKILL.md` with the draft description + domain tags. Collect `type`, `risk_level`, `classification_confidence`.

### Step 3.2: Suggest SW-XXX IDs

Scan `_scrum-output/sprints/` for existing `SW-*` directories. Starting from the next available number, assign sequential suggestions to completed drafts (sorted by index). These are suggestions only — users may override when running `/scrum-create-ticket`.

### Step 3.3: Fill Template

Load `scrum_workflow/templates/draft-stories.md`. For each completed draft (sorted by index):

- Append a section with: index, title, suggested SW-XXX, type, risk_level, domain_tags, description, candidate acceptance criteria
- Populate frontmatter `drafts` array

### Step 3.4: Atomic Write

Write `_scrum-output/epics/EP-XXX/draft-stories.md` atomically.

## Step 4: Finalize

### Step 4.1: Update Epic Status

If no failures: update epic frontmatter `status: drafted`, append `status_history`, atomic write.

If any failures: leave epic at `status: drafting`, preserve state file, print failure summary with re-run instructions.

### Step 4.2: Delete State File (on success)

Remove `_scrum-output/epics/EP-XXX/.draft-state.json` only if all subagents succeeded.

### Step 4.3: Print Summary

```
Drafted N candidate stories for EP-XXX (K failed, retry with --resume).
Review: _scrum-output/epics/EP-XXX/draft-stories.md
Next: /scrum-create-ticket SW-XXX --from-epic EP-XXX --from-draft 1
```

## Resume Semantics

On re-invocation with `--resume`:

- Read `.draft-state.json`
- Preserve all entries in `subagents_completed` (their drafts remain in `draft-stories.md`)
- Re-spawn only `subagents_pending` + `subagents_failed`
- Merge new completions into existing draft-stories.md (preserve index ordering)

## Write Boundaries Enforced

This workflow writes ONLY:
- `_scrum-output/epics/EP-XXX/draft-stories.md`
- `_scrum-output/epics/EP-XXX/.draft-state.json` (deleted on success)
- `_scrum-output/epics/EP-XXX/epic.md` (status field only)
- `_scrum-output/epics/EP-XXX/.archive/**` (only under `--restart`)

Any attempted write outside these paths halts with a Write Boundary Violation.

**Critical:** This workflow MUST NOT create `_scrum-output/sprints/SW-*/story.md`. Ticket creation is human-gated via `/scrum-create-ticket`.
