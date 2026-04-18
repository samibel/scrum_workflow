---
name: decompose-epics
trigger: "/scrum-decompose-epics"
requires_status: complete
sets_status: decomposed
spawns_agents:
  - epic-decomposer
---

## Purpose

Decompose a completed product brief into a bounded graph of epics using the **Plan-Then-Execute** pattern. A single planning agent reads the full brief, commits to an epic structure upfront, and emits all epic artifacts deterministically in one pass. This prevents decomposition drift — the failure mode where epics overlap or leave capabilities unassigned.

## Workflow Reference

workflows/epic-decomposition.md

## Input

Command usage:

- `/scrum-decompose-epics PB-XXX` — Decompose the specified brief
- `/scrum-decompose-epics PB-XXX --force` — Re-decompose a brief already in `decomposed` status (discards existing epics)

Arguments:

- `PB-XXX` (required): Brief ID to decompose. Must exist at `_scrum-output/briefs/PB-XXX.md` with `status: complete`.

## Output

- `_scrum-output/epics/index.md` — Epic index with dependency graph (Mermaid)
- `_scrum-output/epics/EP-XXX/epic.md` — One file per epic (typically 3-8 epics)
- `_scrum-output/briefs/PB-XXX.md` — Updated with `status: decomposed` (status field only)

Epic IDs auto-number `EP-001`, `EP-002`, ... within `_scrum-output/epics/`.

## Status Transitions

| Artifact | From | To | Trigger |
|----------|------|-----|---------|
| Brief | `complete` | `decomposed` | on success |
| Epic | — | `planned` | each new epic |

## Agent Dispatch

Spawns **one** `epic-decomposer` agent. No parallel sub-agents — the Plan-Then-Execute pattern requires single-agent commitment to the full plan. This is intentional: parallel decomposition produces inconsistent epic boundaries.

## Idempotency

The command is idempotent under `--force`: running it twice produces the same epic structure from the same brief (given deterministic model sampling). Without `--force`, re-invocation on an already-decomposed brief halts with an error.

## Error Handling

### Brief Not Found

```
Error: Brief '_scrum-output/briefs/PB-XXX.md' not found.
Fix: Run '/scrum-create-brief "your idea"' first.
```

### Brief Not Complete

```
Error: Brief PB-XXX has status '{status}', expected 'complete'.
Fix: Run '/scrum-create-brief PB-XXX --resume' to finish the brief (resolve open questions) first.
```

### Brief Already Decomposed

```
Error: Brief PB-XXX is already decomposed (epics exist at _scrum-output/epics/).
Fix: Use --force to re-decompose (existing epics will be archived), or continue with existing epics.
```

## Write Boundary Rules

This workflow may write:
- `_scrum-output/epics/index.md` — Epic index (new file, or overwrite with `--force`)
- `_scrum-output/epics/EP-XXX/epic.md` — New epic files
- `_scrum-output/briefs/PB-XXX.md` — **Status field only** (`complete` → `decomposed`)

This workflow may NOT write:
- Brief body content (brief body is immutable after `status: complete`)
- `_scrum-output/sprints/**` — Managed by `/scrum-create-ticket`
- `_scrum-output/epics/EP-XXX/draft-stories.md` — Managed by `/scrum-draft-stories`
- `_scrum-output/epics/EP-XXX/.draft-state.json` — Managed by `/scrum-draft-stories`

### Anti-Pattern Warning

**Bounded Authority Violation:** This command MUST NOT modify brief body content. Only the `status` frontmatter field may be updated. If forced to modify brief content, halt and report.
