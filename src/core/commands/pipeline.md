---
name: pipeline
trigger: "/scrum-pipeline"
requires_status: "*"
sets_status: "varies per story"
pattern: "sequential-orchestrator"
---

## Purpose

Automate the story lifecycle by sequentially routing stories through the status chain: `create-ticket` -> `refine-ticket` -> `refine-story` -> `dev-story` -> `review-story` -> `approve`. The pipeline reads a story's current status, consults the data-driven routing matrix (`data/pipeline-routing.yaml`) to determine the next command, executes it, and advances to the next step until a human gate (`approved`) or a configurable `--to` stop-point is reached.

**Agentic Pattern:** Sequential Orchestrator — the pipeline reads a routing matrix and delegates to existing commands without modifying their behavior or write boundaries.

## Workflow Reference

workflows/pipeline.md

## Input

### Input Formats

```
/scrum-pipeline SW-XXX                     # Single story
/scrum-pipeline SW-XXX SW-YYY              # Multiple stories (sequential, input order preserved)
/scrum-pipeline EP-XXX                     # All stories from an epic's draft-stories.md
/scrum-pipeline EP-XXX --to ready-for-dev  # Stop each story at specified status
/scrum-pipeline --pending                  # All non-done/non-approved stories
/scrum-pipeline --resume                   # Resume from .pipeline-state.json checkpoint
```

### Input Validation

| Input | Pattern | Validation |
|-------|---------|------------|
| Ticket ID | `SW-XXX` | Regex `^SW-\d{3}$` — zero-padded 3-digit number |
| Epic ID | `EP-XXX` | Regex `^EP-\d{3}$` — zero-padded 3-digit number |
| `--to` value | Status name | Must be one of: `refined`, `ready-for-dev`, `review`, `approved` |
| `--pending` | Flag | Mutually exclusive with explicit story/epic input |
| `--resume` | Flag | Reads `.pipeline-state.json` for continuation |

**On invalid input**, halt with:
```
❌ Input Validation Error: '{input}' is not a valid {type}

**Details:** Expected format: {expected_format}
**Valid values:** {valid_values_if_applicable}

**Next Step:** Correct the input and re-run the command.
```

### Mutually Exclusive Flags

- `--pending` cannot be combined with explicit story IDs or epic IDs
- If both are provided:
```
❌ Input Validation Error: '--pending' cannot be combined with explicit story or epic input

**Details:** The --pending flag scans all sprint folders automatically. Providing explicit IDs alongside --pending creates ambiguity.

**Next Step:** Use either '--pending' alone or provide explicit story/epic IDs, not both.
```

## Output

### Per-Story Progress (During Execution)

```
[N/total] SW-XXX <status-chain> <symbol>
```

Where:
- `N/total` — current story number / total stories
- `SW-XXX` — ticket ID
- `<status-chain>` — sequence of statuses traversed (e.g., `draft → refined → ready-for-dev`)
- `<symbol>` — `✓` success, `✗` error, `●` human gate, `○` skipped

### Final Summary

```
Pipeline abgeschlossen:
  ✓ Fertig:          X
  ● Human Gate:      Y  (SW-XXX, SW-YYY)
  ✗ Blockiert:       Z  (SW-XXX: reason)
  ○ Uebersprungen:   W
  ✗ Fehler:          V  (SW-XXX: error description)
```

### Checkpoint File (if applicable)

`.pipeline-state.json` — written to `_scrum-output/` directory, tracks pipeline progress for `--resume`.

## Guard Conditions

### Step 1: Fatal Prerequisites (Fail-Fast)

Before processing any story, validate framework prerequisites:

1. **Routing Matrix Existence**: Check `data/pipeline-routing.yaml` exists and is valid YAML
2. **On missing/invalid routing matrix**: HALT immediately (fatal error):
```
❌ Fatal Error: Pipeline routing matrix not found or invalid

**Details:** The /scrum-pipeline command requires 'data/pipeline-routing.yaml' to determine status routing. This file was not found or contains invalid YAML.

**Next Step:** Verify the framework installation is complete. The routing matrix should exist at 'scrum_workflow/data/pipeline-routing.yaml'.
```

### Step 2: Input Parsing and Validation

Parse and validate all input arguments before any processing begins.

### Step 3: Story Collection and Pre-Validation

Collect all stories to process based on input mode, then validate ALL stories before executing any transitions:

1. **Single story**: Validate `_scrum-output/sprints/SW-XXX/story.md` exists and has valid YAML
2. **Multiple stories**: Validate each story file
3. **Epic mode**: Load `_scrum-output/epics/EP-XXX/draft-stories.md`, validate existence
4. **--pending**: Scan all `_scrum-output/sprints/*/story.md` files, filter by status
5. **--resume**: Load `.pipeline-state.json`, validate checkpoint integrity

**Fail-fast**: If any story has malformed YAML or missing `status` field, that story is flagged as recoverable error and will be skipped during processing. Other stories proceed normally.

## Status Transitions

The pipeline delegates status transitions to existing commands. It does NOT perform transitions directly.

```
Pipeline reads current status
  → Looks up routing matrix
  → Invokes the mapped command
  → Command performs the actual transition
  → Pipeline reads new status
  → Repeats until stop condition
```

### Stop Conditions (per story)

1. Story reaches `approved` status (human gate)
2. Story reaches `--to` target status (early stop)
3. Story reaches `done` status (skip)
4. Recoverable error occurs (skip + continue)
5. Review loop exceeds max iterations (blocked)

## Error Classification

| Error Type | Behavior | Examples |
|---|---|---|
| **Recoverable (per-story)** | Log error, skip story, continue to next | Missing story.md, wrong status, malformed YAML, missing status field, story creation failure in epic mode |
| **Fatal (framework)** | Halt entire pipeline immediately | Missing routing matrix, missing skill files, invalid routing matrix format, file system write failure |

### Recoverable Error Template
```
⚠️ [N/total] SW-XXX — Skipped: {error_description}
```

### Fatal Error Template
```
❌ Fatal Error: {error_description}

**Details:** {details}
**Pipeline halted.** {processed_count} stories processed before halt.
**Next Step:** {recovery_guidance}
```

## Epic Mode

When input is an epic ID (`EP-XXX`):

1. Load `_scrum-output/epics/EP-XXX/draft-stories.md`
2. Read `sw_id_suggestion` entries from YAML frontmatter
3. For each suggested story ID:
   - Check if `_scrum-output/sprints/SW-XXX/story.md` exists
   - If not: invoke `/scrum-create-ticket` to create it (with title and description from draft)
   - If creation fails: log recoverable error, continue to next
4. Route each successfully-resolved story through the pipeline

### Missing draft-stories.md
```
❌ Epic Mode Error: draft-stories.md not found for EP-XXX

**Details:** The /scrum-pipeline command in epic mode requires '_scrum-output/epics/EP-XXX/draft-stories.md' to identify stories.

**Next Step:** Erst '/scrum-draft-stories EP-XXX' ausfuehren
```

## Review Loop

When a story receives `changes-needed` from `/scrum-review-story`:

1. Increment per-story `review_iteration_count`
2. If count <= `review_loop.max_iterations` (from routing YAML, default 3):
   - Route back through `/scrum-dev-story` -> `/scrum-review-story`
3. If count > max_iterations:
   - Story remains in `changes-needed` status
   - Report as **blocked** in pipeline summary
   - Pipeline advances to next story

## Checkpoint/Resume

### `.pipeline-state.json` Structure

```json
{
  "pipeline_id": "uuid",
  "started_at": "ISO8601",
  "updated_at": "ISO8601",
  "input_mode": "single|multi|epic|pending",
  "to_status": "target_status|null",
  "stories": [
    {
      "ticket": "SW-XXX",
      "status_before": "draft",
      "status_after": "ready-for-dev",
      "result": "completed|skipped|blocked|error|pending",
      "review_iteration_count": 0,
      "error": null
    }
  ],
  "current_index": 3,
  "summary": {
    "completed": 2,
    "human_gate": 1,
    "blocked": 0,
    "skipped": 0,
    "errored": 0
  }
}
```

### Resume Behavior

1. Load `.pipeline-state.json`
2. Skip stories with `result != "pending"`
3. Resume from `current_index`
4. Merge results into existing summary

## Write Boundary Rules

### This command may write:
- `.pipeline-state.json` in `_scrum-output/` (checkpoint file)

### This command delegates writes to:
- `/scrum-create-ticket` — creates `story.md`
- `/scrum-refine-ticket` — creates `refinement.md`, updates `story.md`
- `/scrum-refine-story` — creates `plan.md`, updates `story.md`
- `/scrum-dev-story` — creates code files, updates `story.md`
- `/scrum-review-story` — creates `review-N.md`, updates `story.md`

### This command may NOT write:
- `story.md` — status transitions are delegated to sub-commands
- `refinement.md`, `plan.md`, `review-*.md`, `approval.md` — managed by respective commands
- `scrum_workflow/` — framework files are read-only during execution
- Source code files — code changes are delegated to `/scrum-dev-story`

### Anti-Pattern Warnings

**Direct Status Manipulation:** The pipeline MUST NOT update story status directly. All status transitions are performed by delegated commands. The pipeline only reads status to determine the next routing step.

**Write Boundary Inheritance:** Each delegated command operates within its own write boundaries. The pipeline does not extend or override those boundaries.

If a write boundary would be violated, halt with:
```
❌ Write Boundary Violation: /scrum-pipeline attempted to write '{file_path}'

**Details:** The /scrum-pipeline command may only write the checkpoint file (.pipeline-state.json). All other writes are delegated to sub-commands within their own write boundaries.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```

## Relationship to Other Commands

| Command | Role in Pipeline |
|---------|-----------------|
| `/scrum-create-ticket` | Creates story from description (epic mode auto-create) |
| `/scrum-refine-ticket` | Multi-agent refinement (draft → refined) |
| `/scrum-refine-story` | Validation gate (refined → ready-for-dev) |
| `/scrum-dev-story` | Implementation (ready-for-dev → in-progress) and review trigger (in-progress → review via `command_args: "review"`) |
| `/scrum-review-story` | Code review (review → approved or changes-needed) |
| `/scrum-approve` | NOT invoked by pipeline — human gate |
