# Epic Decomposition Workflow

Step-by-step workflow for the `/scrum-decompose-epics` command. Transforms a completed brief into a bounded epic graph via the Plan-Then-Execute pattern. Single-agent, deterministic, idempotent under `--force`.

## Prerequisites

- Brief exists at `_scrum-output/briefs/PB-XXX.md` with `status: complete`
- `scrum_workflow/agents/epic-decomposer.md` exists
- `scrum_workflow/data/epic-decomposition-rules.yaml` exists
- `scrum_workflow/templates/{epic,epic-index}.md` exist

## Step 0: Validation

### Step 0.1: Parse Arguments

- Extract `PB-XXX` (required)
- Detect `--force` flag

### Step 0.2: Brief Existence Check

If `_scrum-output/briefs/PB-XXX.md` does not exist:

```
Error: Brief '_scrum-output/briefs/PB-XXX.md' not found.
Fix: Run '/scrum-create-brief "your idea"' first.
```

### Step 0.3: Brief Status Check

Read brief frontmatter. Must have `status: complete`.

- If `status != complete`:

```
Error: Brief PB-XXX has status '{status}', expected 'complete'.
Fix: Run '/scrum-create-brief PB-XXX --resume' to resolve open questions first.
```

### Step 0.4: Re-Decomposition Check

Check if `_scrum-output/epics/` contains any files referencing `PB-XXX` as `parent_brief`:

- If yes AND no `--force` flag: halt with "already decomposed" error
- If yes AND `--force` flag: archive existing epics to `_scrum-output/epics/.archive/<timestamp>/`, then proceed

## Step 1: Load Inputs

### Step 1.1: Load Brief

Read full `_scrum-output/briefs/PB-XXX.md` including body sections.

### Step 1.2: Load Decomposition Rules

Load `scrum_workflow/data/epic-decomposition-rules.yaml`:
- `size.target_story_count`, `size.min_story_count`, `size.max_story_count`, `size.max_epics_per_brief`
- `clustering_rules` (sorted by weight)
- `ordering.priority_categories`

### Step 1.3: Load Templates

- `scrum_workflow/templates/epic.md`
- `scrum_workflow/templates/epic-index.md`

### Step 1.4: Load Project Context (Optional)

If `_scrum-output/context/index.md` exists, load it to inform `domain_tags`. If absent (pure greenfield), skip.

## Step 2: Plan Epic Graph (Plan-Then-Execute)

### Step 2.1: Spawn Epic Decomposer Agent

Invoke the `epic-decomposer` agent with:
- Full brief content
- Decomposition rules
- Project context (if present)

The agent produces, in a **single pass**:

1. **Epic list**: 3 to `max_epics_per_brief` epics with title, id, capability-cluster mapping, story_count_estimate, domain_tags, dependencies
2. **Dependency graph**: Mermaid `graph TD` diagram
3. **Rationale**: Paragraph explaining decomposition choices
4. **Per-epic body content**: Purpose, user value, scope (in/out), epic-level acceptance criteria, capability breakdown, dependencies, success metrics

### Step 2.2: Validate Plan

Check agent output for:
- Epic count ≤ `max_epics_per_brief`
- All capabilities from brief are assigned to exactly one epic (no overlap, no orphans)
- Each epic has ≥2 epic-level AC (if `output.require_epic_acceptance_criteria: true`)
- Each epic has explicit non-goals (if `output.require_non_goals: true`)

On validation failure: halt, report which constraint was violated, do NOT write any files.

## Step 3: Emit Artifacts (Execute)

### Step 3.1: Auto-Number Epic IDs

Scan existing `_scrum-output/epics/EP-*/` directories and assign sequential IDs starting from next available (first run: `EP-001`).

### Step 3.2: Write Epic Files

For each epic in the plan:

- Fill `scrum_workflow/templates/epic.md` with agent output
- Set `epic_id`, `parent_brief: PB-XXX`, `epic_index: "N/total"`, `status: planned`, `created`, `updated`, `status_history`
- Write atomically to `_scrum-output/epics/EP-XXX/epic.md`

### Step 3.3: Write Epic Index

Fill `scrum_workflow/templates/epic-index.md`:
- `parent_brief: PB-XXX`
- `epic_count: N`
- `epics: [...]` — one entry per epic (id, title, status, story_count_estimate)
- Dependency graph section: insert Mermaid graph from agent output
- Write atomically to `_scrum-output/epics/index.md`

### Step 3.4: Update Brief Status

Update `_scrum-output/briefs/PB-XXX.md` frontmatter **only**:
- Set `status: decomposed`
- Update `updated` timestamp
- Append `status_history` entry
- **Do not touch brief body content** (immutable after completion)

## Step 4: Output

### Step 4.1: Print Summary

```
Decomposed PB-XXX into N epic(s):
  EP-001: <title> (~<n> stories)
  EP-002: <title> (~<n> stories)
  ...
Next: /scrum-draft-stories EP-001
```

## Idempotency & Atomicity

- **Idempotent**: Running twice on the same brief with `--force` produces the same epic count and same IDs (if no new briefs intervened) with best-effort deterministic content.
- **Atomic at the file level**: Each epic file is written atomically (temp + rename). Index is written last; if index write fails, epic files remain but are discoverable via directory scan.
- **No intermediate state file**: Decomposition is a single pass — no resume needed. A crash mid-write leaves some epic files written but no index; re-run with `--force` to retry.

## Write Boundaries Enforced

This workflow writes ONLY:
- `_scrum-output/epics/index.md`
- `_scrum-output/epics/EP-XXX/epic.md` (one per epic)
- `_scrum-output/briefs/PB-XXX.md` (status field only)
- `_scrum-output/epics/.archive/**` (only under `--force`)

Any attempted write outside these paths halts with a Write Boundary Violation.
