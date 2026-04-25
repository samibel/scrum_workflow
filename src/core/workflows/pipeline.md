# Pipeline Workflow (Sequential Orchestrator)

**Pattern:** Sequential Orchestrator with Data-Driven Routing
**Goal:** Automate the story lifecycle by routing stories through commands based on a YAML routing matrix.

---

## Lean 3-Step Structure

This workflow follows a lean structure:
1. **Step 1: Load** — Parse input, load routing matrix, collect and pre-validate stories
2. **Step 2: Execute** — Route each story through commands until stop condition
3. **Step 3: Report** — Display progress summary and write checkpoint

---

## Step 1: Load and Validate

### Step 1.1: Load Routing Matrix (Fatal Prerequisite)

Load the data-driven routing matrix before any processing:

1. **Read** `data/pipeline-routing.yaml`
2. **Validate** YAML structure: `routing_matrix`, `review_loop`, `terminal_statuses`, `human_gate_statuses`, `valid_stop_points`, `pending_filter`, `error_classification`
3. **Store** as `{routing_matrix}` for Step 2

**On missing or invalid file** — HALT (fatal error):
```
❌ Fatal Error: Pipeline routing matrix not found or invalid

**Details:** The /scrum-pipeline command requires 'data/pipeline-routing.yaml'. File not found or YAML parse error.
**Pipeline halted.** 0 stories processed.
**Next Step:** Verify framework installation. File should exist at 'scrum_workflow/data/pipeline-routing.yaml'.
```

### Step 1.2: Parse Input Arguments

Parse the invocation to determine input mode and flags:

**Input Modes** (mutually exclusive):
| Mode | Detection | Example |
|------|-----------|---------|
| Single story | One `SW-XXX` argument | `/scrum-pipeline SW-006` |
| Multi-story | Multiple `SW-XXX` arguments | `/scrum-pipeline SW-006 SW-007` |
| Epic | One `EP-XXX` argument | `/scrum-pipeline EP-001` |
| Pending | `--pending` flag | `/scrum-pipeline --pending` |
| Resume | `--resume` flag | `/scrum-pipeline --resume` |

**Optional Flags:**
| Flag | Applies To | Effect |
|------|-----------|--------|
| `--to <status>` | All modes except resume | Stop each story at specified status |

**Validation:**
1. Validate ticket IDs match `^SW-\d{3}$`
2. Validate epic IDs match `^EP-\d{3}$`
3. Validate `--to` value is in `{routing_matrix}.valid_stop_points`: `refined`, `ready-for-dev`, `review`, `approved`
4. Validate `--pending` is not combined with explicit story/epic IDs
5. Store parsed input as `{input_mode}`, `{story_ids}`, `{to_status}`, `{flags}`

**On validation failure** — HALT with actionable error (see commands/pipeline.md for templates).

### Step 1.3: Collect Stories

Based on `{input_mode}`, collect the list of stories to process:

#### Mode: Single / Multi-Story
- Use the provided `{story_ids}` list directly
- Preserve input order

#### Mode: Epic (ST-07)
1. Check if `_scrum-output/epics/EP-XXX/draft-stories.md` exists
2. **On missing file** — HALT:
   ```
   ❌ Epic Mode Error: draft-stories.md not found for EP-XXX
   **Next Step:** Erst '/scrum-draft-stories EP-XXX' ausfuehren
   ```
3. Read YAML frontmatter, extract all `sw_id_suggestion` entries
4. For each suggested story ID:
   - Check if `_scrum-output/sprints/SW-XXX/story.md` exists
   - If not: mark for auto-creation in Step 2
5. Store as `{story_ids}` with `{needs_creation}` flags

#### Mode: Pending (ST-09)
1. Scan all directories in `_scrum-output/sprints/`
2. For each `story.md` file:
   - Read YAML frontmatter `status` field
   - Include if status is in `{routing_matrix}.pending_filter.include_statuses`
   - Exclude if status is in `{routing_matrix}.pending_filter.exclude_statuses`
3. Sort by ticket number ascending (deterministic processing)
4. Store as `{story_ids}`

#### Mode: Resume (ST-10)
1. Check if `_scrum-output/.pipeline-state.json` exists
2. **On missing file** — HALT:
   ```
   ❌ Resume Error: No checkpoint file found
   **Details:** No .pipeline-state.json exists at '_scrum-output/.pipeline-state.json'.
   **Next Step:** Run '/scrum-pipeline' without --resume to start a new pipeline run.
   ```
3. Load checkpoint: extract `stories` array, `current_index`, `summary`
4. Filter to stories with `result == "pending"`
5. Store as `{story_ids}` with prior context from checkpoint

### Step 1.4: Pre-Validate All Stories (ST-13 — Fail-Fast)

Before executing any transitions, validate all collected stories:

```
For each story_id in {story_ids}:
  1. If story needs creation (epic mode) → skip validation, will be created in Step 2
  2. Check _scrum-output/sprints/SW-XXX/story.md exists
  3. Read YAML frontmatter
  4. Validate frontmatter has required 'status' field
  5. Validate YAML is well-formed

  On validation failure:
    → Flag story as "recoverable_error" with reason
    → Story will be skipped during processing
    → Continue validating remaining stories
```

Store results as `{validated_stories}` — each entry has:
```json
{
  "ticket": "SW-XXX",
  "valid": true|false,
  "current_status": "draft|refined|...",
  "error": null|"reason",
  "needs_creation": false|true
}
```

**Important:** Do NOT halt on per-story validation failures. Flag and continue. Only halt on fatal framework errors.

### Step 1.5: Initialize Pipeline State

Create the runtime state object:

```json
{
  "pipeline_id": "{generated_uuid}",
  "started_at": "{current_ISO8601_UTC}",
  "updated_at": "{current_ISO8601_UTC}",
  "input_mode": "{input_mode}",
  "to_status": "{to_status|null}",
  "total_stories": "{count}",
  "stories": [],
  "current_index": 0,
  "summary": {
    "completed": 0,
    "human_gate": 0,
    "blocked": 0,
    "skipped": 0,
    "errored": 0
  }
}
```

Store as `{pipeline_state}`.

---

## Step 2: Execute Routing Loop

Process each story sequentially. For each story in `{validated_stories}`:

### Step 2.1: Story Pre-Check

```
1. If story.valid == false:
   → Emit: ⚠️ [N/total] SW-XXX — Skipped: {story.error}
   → Set result = "error"
   → Increment summary.errored
   → Continue to next story

2. If story.needs_creation == true (epic mode):
   → Execute Step 2.2 (Auto-Create)

3. Read current status from story.md
```

### Step 2.2: Auto-Create Story (Epic Mode Only)

When a story from `draft-stories.md` does not yet exist:

1. Invoke `/scrum-create-ticket` with title and description from draft entry
2. **On success**: Set `current_status = "draft"`, continue routing
3. **On failure**: Log recoverable error, skip story, continue to next
   ```
   ⚠️ [N/total] SW-XXX — Skipped: Failed to create story from epic draft
   ```

### Step 2.3: Routing Loop (Core Logic — ST-05)

For the current story, repeat until a stop condition is met:

```
Initialize:
  review_iteration_count = 0
  status_chain = [current_status]

Loop:
  1. Read current_status from story.md YAML frontmatter

  2. Look up current_status in {routing_matrix}.routing_matrix:
     → Find entry where entry.current_status == current_status

  3. Check action:
     a. action == "stop" (human gate):
        → Emit: [N/total] SW-XXX {status_chain} ● Human Gate
        → Set result = "human_gate"
        → Increment summary.human_gate
        → BREAK (next story)

     b. action == "skip" (terminal/ephemeral):
        → Emit: [N/total] SW-XXX {status_chain} ○
        → Set result = "skipped"
        → Increment summary.skipped
        → BREAK (next story)

     c. action == "route":
        → Proceed to step 4

  4. Check --to stop condition:
     If {to_status} is set AND current_status == {to_status}:
        → Emit: [N/total] SW-XXX {status_chain} ✓ (stopped at --to)
        → Set result = "completed"
        → Increment summary.completed
        → BREAK (next story)

  5. Check review loop limit (ST-06):
     If current_status == "changes-needed":
        → Increment review_iteration_count
        → If review_iteration_count > {routing_matrix}.review_loop.max_iterations:
           → Emit: [N/total] SW-XXX {status_chain} ✗ Blocked (max review loops)
           → Set result = "blocked"
           → Increment summary.blocked
           → BREAK (next story)

  6. Execute the mapped command:
     → If entry.command_args is defined:
        Invoke {entry.next_command} SW-XXX {entry.command_args}
     → Else:
        Invoke {entry.next_command} SW-XXX
     → Wait for command completion

  7. Read new status from story.md:
     → If new_status != expected target AND new_status != "changes-needed":
        → Log warning: unexpected status after command
     → Append new_status to status_chain

  8. Check if story reached terminal or gate status after command:
     → If new_status in {routing_matrix}.human_gate_statuses:
        → Emit: [N/total] SW-XXX {status_chain} ● Human Gate
        → Set result = "human_gate"
        → Increment summary.human_gate
        → BREAK

     → If new_status in {routing_matrix}.terminal_statuses:
        → Emit: [N/total] SW-XXX {status_chain} ○
        → Set result = "skipped"
        → Increment summary.skipped
        → BREAK

  9. Continue loop (next routing step for same story)

On error during command execution (recoverable):
  → Emit: ⚠️ [N/total] SW-XXX {status_chain} ✗ Error: {error_description}
  → Set result = "error"
  → Increment summary.errored
  → BREAK (next story)
```

### Step 2.4: Update Checkpoint After Each Story (ST-10)

After processing each story (regardless of outcome):

1. Append story result to `{pipeline_state}.stories`:
   ```json
   {
     "ticket": "SW-XXX",
     "status_before": "{original_status}",
     "status_after": "{final_status}",
     "result": "{completed|human_gate|blocked|skipped|error}",
     "review_iteration_count": N,
     "error": null|"{error_description}"
   }
   ```
2. Increment `{pipeline_state}.current_index`
3. Update `{pipeline_state}.updated_at`
4. Write `{pipeline_state}` to `_scrum-output/.pipeline-state.json` (atomic write)

### Step 2.5: Emit Progress Line (ST-11)

After each story completes, emit a compact progress line:

```
[N/total] SW-XXX  status_before → status1 → status2 → ... → status_final  <symbol>
```

Symbol mapping (from `{routing_matrix}.progress_symbols`):
- `✓` — completed successfully (reached --to target or approved)
- `✗` — error or blocked
- `●` — human gate (approved, awaiting /scrum-approve)
- `○` — skipped (done, cancelled, or already at target)

### Step 2.6: Repeat for All Stories

Continue Step 2.1 through Step 2.5 for each story in `{validated_stories}` until all stories are processed.

---

## Step 3: Report and Finalize

### Step 3.1: Generate Summary (ST-11)

After all stories are processed, display the aggregate summary:

```
Pipeline abgeschlossen:
  ✓ Fertig:          {summary.completed}
  ● Human Gate:      {summary.human_gate}  ({list of gated story IDs})
  ✗ Blockiert:       {summary.blocked}  ({list of blocked story IDs with reasons})
  ○ Uebersprungen:   {summary.skipped}
  ✗ Fehler:          {summary.errored}  ({list of errored story IDs with descriptions})
```

### Step 3.2: Finalize Checkpoint

Update `{pipeline_state}` with final state:
1. Set all remaining "pending" stories as "skipped" (if pipeline was halted by fatal error)
2. Write final `_scrum-output/.pipeline-state.json`
3. Include total processing time

### Step 3.3: Cleanup (Optional)

If all stories completed successfully (no pending entries):
- The `.pipeline-state.json` can be retained for audit purposes
- It is NOT auto-deleted — user may reference it or use `--resume` if re-running

---

## Write Boundaries

This workflow may write:
- `_scrum-output/.pipeline-state.json` — checkpoint/resume state (owned by pipeline)

This workflow delegates writes to (each within their own boundaries):
- `/scrum-create-ticket` → `_scrum-output/sprints/SW-XXX/story.md`
- `/scrum-refine-ticket` → `_scrum-output/sprints/SW-XXX/refinement.md`, `story.md`
- `/scrum-refine-story` → `_scrum-output/sprints/SW-XXX/plan.md`, `story.md`
- `/scrum-dev-story` → Source code files, `story.md`
- `/scrum-review-story` → `_scrum-output/sprints/SW-XXX/review-N.md`, `story.md`

This workflow may NOT write:
- `story.md` — status updates delegated to sub-commands
- `refinement.md`, `plan.md`, `review-*.md`, `approval.md` — managed by respective commands
- `scrum_workflow/` — framework files are read-only during execution
- `_scrum-output/context/` — context files managed by `/scrum-create-project-context`
- Source code files — delegated to `/scrum-dev-story`

---

## Error Handling

### Recoverable Errors (Per-Story)

| Situation | Behavior |
|-----------|----------|
| Story.md not found (non-epic mode) | Skip story with warning, continue |
| Malformed YAML frontmatter | Skip story with warning, continue |
| Missing `status` field | Skip story with warning, continue |
| Unexpected status not in routing matrix | Skip story with warning, continue |
| Sub-command execution failure | Skip story with error, continue |
| Story creation failure (epic mode) | Skip story with error, continue |
| Review loop exceeds max iterations | Mark as blocked, continue |

### Fatal Errors (Framework)

| Situation | Behavior |
|-----------|----------|
| Missing `pipeline-routing.yaml` | HALT immediately |
| Invalid routing matrix YAML | HALT immediately |
| Missing skill files for required commands | HALT immediately |
| File system write failure (checkpoint) | HALT immediately |
| Invalid input arguments | HALT immediately |

### Error Recovery

- **Recoverable errors** are included in the final summary with story IDs and descriptions
- **Fatal errors** cause immediate halt; checkpoint is written before halt for `--resume`
- Users can fix issues and re-run with `--resume` to continue from last checkpoint

---

## Sequential Orchestrator Pattern Rules

### 1. Delegation Only
The pipeline orchestrates by delegating to existing commands. It does NOT implement any command logic itself. Each command runs in its own context with its own write boundaries.

### 2. Read-Route-Delegate Cycle
```
Read status → Look up routing matrix → Delegate to command → Read new status → Repeat
```

### 3. No Direct Status Manipulation
The pipeline MUST NOT update story.md status fields. All transitions are performed by the delegated commands. The pipeline only reads status to determine routing.

### 4. Data-Driven Routing
All routing decisions come from `pipeline-routing.yaml`. The pipeline does not contain hardcoded status-to-command mappings. This allows the routing to be modified without changing the workflow.

### 5. Error Isolation
Per-story errors are isolated. A failure in one story does not affect other stories. Only framework-level errors halt the entire pipeline.

---

## Validation Rules

- Routing matrix must be loaded and valid before any processing
- All input arguments must be validated before processing begins
- All stories must be pre-validated (fail-fast) before any transitions execute
- Checkpoint file must be updated after each story (atomic write)
- Review loop counter must be tracked per-story, not globally
- `--pending` and explicit input are mutually exclusive
- `--to` values must match `valid_stop_points` in routing matrix
