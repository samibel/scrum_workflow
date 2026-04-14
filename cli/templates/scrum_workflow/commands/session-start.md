---
name: session-start
trigger: "/session-start"
tier: session-level
requires_status: N/A
sets_status: N/A
creates_artifact: false
read_only: true
---

## Purpose

Load and present the developer's previous session context so they can resume exactly where they left off without context loss. This is a **READ-ONLY** command: it reads from `_scrum-output/` but NEVER writes or modifies any file.

**FR-27 Compliance:** `/session-start` loads open work units, last decisions, active risks, and next steps.

**SC-14 Compliance:** Context is loaded and presented in under 60 seconds so the developer can identify the next action without prior session knowledge.

## Workflow Reference

workflows/session-start.md

## Input

No arguments required.

```
/session-start
```

- **No ticket argument** — session-level command (NOT a story-level command)
- **No prerequisites** — can be run at any time, including on first use

## Output

A structured session summary rendered to the terminal with these sections:

1. **Open Work** — All stories in `_scrum-output/sprints/` with non-terminal status (not `done` or `cancelled`)
2. **Recent Decisions** — The 5 most recent DR records from `_scrum-output/memory/decisions/`
3. **Active Risk Notes** — All RN records from `_scrum-output/memory/risks/` where `status: active`
4. **Suggested Next Steps** — One actionable command suggestion per open story based on status

### Output Format

```
## Session Context — {ISO_DATE}

### Open Work ({count} stories)

- **{ticket}** [{status}] — {title}

### Recent Decisions (last {count})

- **{drNumber}**: {decisionSummary} (ticket: {ticket}, date: {date})

### Active Risk Notes ({count} active)

- **{rnNumber}** [{severity}]: {riskDescription} — Affected: {affectedArea} (ticket: {ticket})

### Suggested Next Steps

{index}. {nextStep}

---
Context loaded. Developer can resume immediately.
```

## Performance Constraints

- **SC-13:** Context retrieval with 100+ artifacts completes in under 10 seconds
- **SC-14:** Developer can identify next action from summary in under 60 seconds
- Implementation uses `readdirSync` — NOT recursive glob — for compliance with SC-13

## Write Boundary Rules

**This command is strictly READ-ONLY** (Architecture Pattern 4 — Bounded Authority).

This command MAY ONLY read from:
- `_scrum-output/sprints/` — story.md files
- `_scrum-output/memory/decisions/` — DR-XXX.md files
- `_scrum-output/memory/risks/` — RN-XXX.md files

This command MUST NOT write to any file or directory. Violating this boundary is a Bounded Authority Violation per architecture.md Pattern 4.

## Error Handling

This command uses graceful degradation — it NEVER blocks the developer with errors when artifacts simply don't exist yet (valid for first-time use):

- If `_scrum-output/sprints/` does not exist → shows "No open stories" in summary
- If `_scrum-output/memory/decisions/` does not exist → shows "No decision records found"
- If `_scrum-output/memory/risks/` does not exist → shows "No active risk notes"
- If a story.md file has corrupt/missing frontmatter → skip it, continue with others
- If a DR or RN file has corrupt/missing frontmatter → skip it, continue with others

## Skill Reference

skills/session-start/SKILL.md — context aggregation logic
utils/session-context.js — JavaScript implementation module (ESM)

## NFR Compliance

- **NFR-2:** No external dependencies — pure `node:fs` and `node:path` only
- **NFR-3:** All reads are local file operations (offline capable)
- **NFR-4:** N/A — READ-ONLY; no writes occur
- **NFR-7:** Each loaded artifact is presented with its source file reference
- **NFR-9:** Session summary is human-readable terminal output — no binary formats
