---
name: create-brief
trigger: "/scrum-create-brief"
requires_status: null
sets_status: complete
spawns_agents:
  - product-strategist
  - architect
  - qa
---

## Purpose

Transform a raw idea into a structured product brief using the **Iterative Multi-Agent Brainstorming** + **Reflection Loop** patterns. This is the zeroth step of the greenfield flow: the entry point for projects starting from nothing. Three specialized agents analyze the idea in parallel from distinct perspectives (product, architecture, quality), their findings are synthesized into a brief, and a Reflection Loop aggressively surfaces and resolves open questions via user interview until none remain.

## Workflow Reference

workflows/brief-creation.md

## Input

Command usage:

- `/scrum-create-brief "<raw idea>"` — Capture a new idea and produce a brief
- `/scrum-create-brief PB-XXX --resume` — Resume a partially-completed brief from its state file
- `/scrum-create-brief PB-XXX --restart` — Discard existing state and start over (requires confirmation)

Arguments:

- `<raw idea>` (required on first call): Natural language idea of any length. Can be vague — the Reflection Loop resolves vagueness.
- `PB-XXX` (required with `--resume` or `--restart`): Existing brief ID to continue or rewrite.

Auto-numbering: new briefs get the next sequential `PB-XXX` by scanning `_scrum-output/briefs/` and incrementing the highest existing.

## Output

- `_scrum-output/briefs/PB-XXX.md` — Structured product brief with YAML frontmatter (`brief_id`, `title`, `status`, `idea`, `personas`, `goals`, `non_goals`, `open_questions`, `interview_rounds`, `status_history`)
- `_scrum-output/briefs/.brief-state-PB-XXX.json` — Resume state file (auto-deleted on completion)

**Final status:** `complete` — no open questions remain, brief is ready for `/scrum-decompose-epics`.

## Status Transitions

| From | To | Trigger |
|------|-----|---------|
| — | `captured` | Raw idea received, parallel brainstorming starts |
| `captured` | `interview` | Synthesis complete, open questions identified |
| `interview` | `interview` | Next interview round (still open questions) |
| `interview` | `complete` | Zero open questions remain |
| `complete` | `decomposed` | `/scrum-decompose-epics` (set by that command) |

## Agent Dispatch

Spawns three agents in parallel with isolated context:

1. **product-strategist** — user value, personas, jobs-to-be-done, non-goals
2. **architect** — system-level risks, scalability, major technical unknowns
3. **qa** — testability of success criteria, edge cases, acceptance ambiguity

After each parallel round, the orchestrator invokes `scrum_workflow/skills/synthesis/SKILL.md` to merge perspectives into the brief.

## Reflection Loop (Aggressive)

After synthesis, the orchestrator checks `open_questions` in the brief frontmatter:

- If `open_questions` is non-empty → present questions to user, collect answers, merge into brief, increment `interview_rounds`, re-run synthesis
- If `open_questions` is empty → set status to `complete`, delete state file, exit
- Safety net: if `interview_rounds` exceeds `greenfield.brief_max_interview_rounds` (default 5), halt and ask user to force-complete or restart

## Resume Semantics

On `--resume` (or re-invocation when a state file exists):
- Load `_scrum-output/briefs/.brief-state-PB-XXX.json`
- Restore partial brief + pending questions + completed agents
- Continue from the last checkpoint (e.g., if 2 of 3 agents completed, only re-run the third)

On `--restart`: prompt user for explicit confirmation, then delete state file + brief, start fresh.

## Error Handling

### Empty Idea

```
Error: Raw idea cannot be empty. Please provide an idea.
Fix: /scrum-create-brief "your idea here"
```

### State File Exists Without --resume or --restart

```
Error: Brief PB-XXX has an in-progress state file.
Fix: Use --resume to continue, or --restart to discard and start over.
```

### Max Interview Rounds Exceeded

```
Warning: Brief PB-XXX reached max interview rounds (5). Some questions remain unresolved.
Options:
  1. /scrum-create-brief PB-XXX --resume  (continue with more rounds — requires config override)
  2. Edit PB-XXX.md manually to remove open_questions, then re-run
  3. /scrum-create-brief PB-XXX --restart  (discard and try again)
```

## Write Boundary Rules

This workflow may write:
- `_scrum-output/briefs/PB-XXX.md` — New brief or updated in-progress brief
- `_scrum-output/briefs/.brief-state-PB-XXX.json` — Resume state, auto-deleted on completion

This workflow may NOT write:
- `_scrum-output/epics/**` — Managed by `/scrum-decompose-epics`
- `_scrum-output/sprints/**` — Managed by `/scrum-create-ticket` et al.
- Source code files
- `scrum_workflow/` — Framework read-only during execution

### Anti-Pattern Warning

**Bounded Authority Violation:** This command MUST NOT modify briefs with `status: decomposed`. Once epics have been derived, the brief is frozen.

If a write boundary would be violated, halt with:

```
Write Boundary Violation: /scrum-create-brief attempted to write '{file_path}'
Fix: This command may only write _scrum-output/briefs/PB-*.md.
```
