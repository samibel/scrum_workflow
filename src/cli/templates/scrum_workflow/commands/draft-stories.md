---
name: draft-stories
trigger: "/scrum-draft-stories"
requires_status: planned
sets_status: drafted
spawns_agents:
  - architect
  - developer
  - qa
---

## Purpose

Generate candidate story drafts for a single epic using the **Orchestrator-Worker** pattern. The orchestrator reads an epic's capability breakdown, spawns N parallel subagents (one per story candidate), and aggregates their outputs into a single `draft-stories.md` file. Drafts are **candidates only** — users promote selected ones to tickets via `/scrum-create-ticket ... --from-epic ... --from-draft N`. No automatic ticket creation.

## Workflow Reference

workflows/story-drafting.md

## Input

Command usage:

- `/scrum-draft-stories EP-XXX` — Generate draft stories for the specified epic
- `/scrum-draft-stories EP-XXX --resume` — Resume after partial failure (only missing subagents re-run)
- `/scrum-draft-stories EP-XXX --restart` — Discard existing drafts and regenerate (requires confirmation)

Arguments:

- `EP-XXX` (required): Epic ID. Must exist at `_scrum-output/epics/EP-XXX/epic.md` with `status: planned` (or `drafted` for re-runs).

## Output

- `_scrum-output/epics/EP-XXX/draft-stories.md` — Aggregated drafts with YAML frontmatter listing each draft
- `_scrum-output/epics/EP-XXX/.draft-state.json` — Resume state (auto-deleted on completion)
- `_scrum-output/epics/EP-XXX/epic.md` — Updated with `status: drafted` (status field only)

Each draft in `draft-stories.md` has:
- `index` (1-based, stable across re-runs)
- `title` — short descriptive title
- `sw_id_suggestion` — suggested SW-XXX (next available, not yet reserved)
- `type`, `risk_level`, `domain_tags` — pre-classified via `story-classifier` skill
- Candidate description + acceptance criteria

## Orchestrator-Worker Pattern

1. **Orchestrator** reads `epic.md` → extracts capability breakdown → decides N (number of drafts, target = `epic.story_count_estimate`)
2. **Orchestrator** spawns N subagents in parallel (bounded by `greenfield.max_parallel_story_drafters`, default 5)
3. **Each subagent** is assigned one capability, operates in isolation, returns one draft
4. **Orchestrator** aggregates via map-reduce: sorts by index, merges into `draft-stories.md`, classifies each via `story-classifier`
5. **Orchestrator** updates epic status to `drafted`, deletes state file

## Resume Semantics

State file tracks `subagents_completed` and `subagents_pending`:
- On re-invocation with `--resume`, only pending subagents are re-spawned
- Completed drafts are preserved in their stable positions
- State file deleted on successful completion

On partial failure (e.g., 3 of 5 subagents succeed), the partial `draft-stories.md` is written with completed drafts, and the state file lists the missing ones. Re-run with `--resume` to complete.

## Subagent Selection

Subagents reuse existing refinement agents (`architect`, `developer`, `qa`) with a "draft mode" prompt. This is distinct from the brief-brainstorming agent set — at the story level, developer perspective is valuable (implementation feasibility).

## Error Handling

### Epic Not Found

```
Error: Epic '_scrum-output/epics/EP-XXX/epic.md' not found.
Fix: Run '/scrum-decompose-epics PB-XXX' to create epics first.
```

### Epic Wrong Status

```
Error: Epic EP-XXX has status '{status}', expected 'planned' (or 'drafted' with --restart).
Fix: If drafts already exist, use --resume or --restart.
```

### State File Exists Without Flag

```
Error: Epic EP-XXX has an in-progress draft-state file.
Fix: Use --resume to continue, or --restart to discard and regenerate.
```

## Write Boundary Rules

This workflow may write:
- `_scrum-output/epics/EP-XXX/draft-stories.md` — Aggregated drafts
- `_scrum-output/epics/EP-XXX/.draft-state.json` — Resume state
- `_scrum-output/epics/EP-XXX/epic.md` — **Status field only** (`planned` → `drafted`)

This workflow may NOT write:
- Epic body content (epic body is immutable after decomposition)
- `_scrum-output/sprints/**` — Stories are created only via `/scrum-create-ticket --from-epic`
- Other epics' files

### Anti-Pattern Warning

**Bounded Authority Violation:** This command MUST NOT create `story.md` files. Drafts are candidates; ticket creation is a separate human-gated step.
