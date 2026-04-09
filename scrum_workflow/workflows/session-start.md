# Session-Start Workflow

**Pattern:** Context Aggregation (Read-Only)
**Goal:** Load and present the developer's session context in one structured summary.

**CRITICAL:** This workflow is READ-ONLY. It MUST NOT write to any file. See Write Boundary Rules in commands/session-start.md.

---

## Overview

The session-start workflow aggregates three sources of context from `_scrum-output/`:

1. Open stories (sprints directory)
2. Recent decision records (memory/decisions)
3. Active risk notes (memory/risks)

Then derives next-step suggestions and presents a unified summary.

---

## Step 1 — Load Open Stories

**Source:** `_scrum-output/sprints/`
**Constraint:** SC-13 — use `readdirSync` on sprints dir; do NOT recursively glob the tree

### Algorithm

1. Check if `_scrum-output/sprints/` exists
   - If NOT exists → skip, open stories list = [] (graceful degradation)
2. Call `readdirSync('_scrum-output/sprints/')` to get subdirectory entries
3. For each entry in the sprints directory:
   a. Check if `_scrum-output/sprints/{entry}/story.md` exists
   b. If NOT exists → skip this entry (no story.md = not a story sprint dir)
   c. Read `story.md` content
   d. Parse YAML frontmatter to extract: `ticket`, `status`, `title`
   e. If frontmatter is missing or unreadable → skip this entry (graceful degradation, log warning)
   f. If `status` is `done` or `cancelled` → skip (terminal status)
   g. Otherwise → add to open stories list: `{ ticket, status, title }`
4. Result: array of open story objects, all with non-terminal statuses

### Non-Terminal Statuses (included)

| Status | Meaning |
|--------|---------|
| `draft` | Story created, not yet refined |
| `refined` | Refined, not yet validated |
| `ready-for-dev` | Validated, ready to implement |
| `in-progress` | Currently being implemented |
| `review` | Implementation complete, awaiting review |
| `changes-needed` | Review requested changes |
| `approved` | Review approved, implementation may be finalizing |

### Terminal Statuses (excluded)

| Status | Meaning |
|--------|---------|
| `done` | Story fully complete and approved |
| `cancelled` | Story cancelled — no action needed |

---

## Step 2 — Load Recent Decisions

**Source:** `_scrum-output/memory/decisions/`
**Constraint:** SC-13 — read ONLY the top 5 most recent DR files (do NOT read all)

### Algorithm

1. Check if `_scrum-output/memory/decisions/` exists
   - If NOT exists → skip, decisions list = [] (graceful degradation)
2. Call `readdirSync('_scrum-output/memory/decisions/')` to get all filenames
3. Filter: keep only files matching pattern `DR-[0-9][0-9][0-9].md`
   - Skip: `README.md`, `notes.txt`, `.keep`, or any other non-DR files
4. Sort by DR number descending (highest DR number = most recent):
   - Extract number from filename: `DR-005.md` → `5`
   - Sort: `5, 4, 3, 2, 1` (descending)
5. Take the first 5 files (top 5 by recency)
6. For each of the top 5 DR files:
   a. Read file content
   b. Parse YAML frontmatter to extract: `decision_summary`, `ticket`, `created`
   c. If frontmatter unreadable → skip this file (graceful degradation)
   d. Build record: `{ drNumber, decisionSummary, ticket, date }`
      - `drNumber` = filename without `.md` extension (e.g., `DR-005`)
      - `decisionSummary` = frontmatter `decision_summary` field
      - `ticket` = frontmatter `ticket` field
      - `date` = frontmatter `created` or `date` field
7. Result: array of up to 5 decision record objects, most recent first

---

## Step 3 — Load Active Risk Notes

**Source:** `_scrum-output/memory/risks/`
**Constraint:** ALL active risk notes are returned (no limit, unlike decisions)

### Algorithm

1. Check if `_scrum-output/memory/risks/` exists
   - If NOT exists → skip, risks list = [] (graceful degradation)
2. Call `readdirSync('_scrum-output/memory/risks/')` to get all filenames
3. Filter: keep only files matching pattern `RN-[0-9][0-9][0-9].md`
   - Skip: `README.md`, `.keep`, or any other non-RN files
4. For each RN file:
   a. Read file content
   b. Parse YAML frontmatter to extract: `status`, `risk_description`, `severity`, `affected_area`, `ticket`
   c. If frontmatter unreadable → skip this file (graceful degradation)
   d. If `status` is NOT `active` → skip (resolved risks are not shown)
   e. Build record: `{ rnNumber, riskDescription, severity, affectedArea, ticket }`
      - `rnNumber` = filename without `.md` extension (e.g., `RN-001`)
5. Result: array of all active risk note objects

### Status Filtering

| RN Status | Action |
|-----------|--------|
| `active` | **Included** — developer needs to track this |
| `resolved` | **Excluded** — no longer an active concern |

---

## Step 4 — Derive Next Steps

**Input:** Open stories array from Step 1
**Output:** One actionable suggestion per open story

### Status-to-Action Mapping

| Story Status | Next Step Suggestion |
|--------------|---------------------|
| `draft` | `Refine ticket {ticket} → run /scrum-refine-ticket {ticket}` |
| `refined` | `Validate story {ticket} → run /scrum-refine-story {ticket}` |
| `ready-for-dev` | `Implement story {ticket} → run /scrum-dev-story {ticket}` |
| `in-progress` | `Continue implementation of {ticket} → run /scrum-dev-story {ticket}` |
| `review` | `Review story {ticket} → run /scrum-review-story {ticket}` |
| `changes-needed` | `Apply review feedback to {ticket} → review _scrum-output/sprints/{ticket}/review-N.md` |
| `approved` | `Story {ticket} approved — run /scrum-dev-story {ticket} to complete implementation` |

---

## Step 5 — Present Session Summary

**Input:** Results from Steps 1–4
**Output:** Structured Markdown summary rendered to terminal

### Output Template

```
## Session Context — {ISO_DATE}

### Open Work ({count} stories)

{For each open story:}
- **{ticket}** [{status}] — {title}

_(No open stories)_   ← shown when count = 0

### Recent Decisions (last {count})

{For each decision:}
- **{drNumber}**: {decisionSummary} (ticket: {ticket}, date: {date})

_(No decision records found)_   ← shown when count = 0

### Active Risk Notes ({count} active)

{For each active risk:}
- **{rnNumber}** [{severity}]: {riskDescription} — Affected: {affectedArea} (ticket: {ticket})

_(No active risk notes)_   ← shown when count = 0

### Suggested Next Steps

{index}. {nextStep}

_(No open stories — nothing pending)_   ← shown when count = 0

---
Context loaded. Developer can resume immediately.
```

### Rendering Rules

- **ISO_DATE**: Current UTC timestamp in ISO 8601 format (e.g., `2026-04-09T11:00:00Z`)
- **Empty sections**: Use italic placeholder text, do NOT omit the section header
- **Next steps numbered**: 1-based index
- **No ANSI escape codes**: Plain text only (NFR-9 Inspectability — no color codes in raw output)
- **No binary content**: Human-readable terminal text

---

## Implementation Reference

This workflow is implemented by:

- **JavaScript utility:** `scrum_workflow/utils/session-context.js`
  - `parseFrontmatter(content)` — YAML frontmatter parser (Steps 1–3)
  - `scanOpenStories(sprintsDir)` — Step 1
  - `loadRecentDecisions(decisionsDir, limit)` — Step 2
  - `loadActiveRisks(risksDir)` — Step 3
  - `deriveNextSteps(openStories)` — Step 4
  - `formatSessionSummary(openStories, recentDecisions, activeRisks, nextSteps)` — Step 5

- **Skill:** `scrum_workflow/skills/session-start/SKILL.md`

---

## Performance Notes (SC-13)

- Use `readdirSync` — NOT `glob()` — for all directory scans
- Scan only specific known subdirectories — do NOT walk the entire `_scrum-output/` tree
- For decisions: sort and slice BEFORE reading files — read only the top 5 files
- `_scrum-output/memory/sessions/` — DO NOT scan (Story 7.4 creates these; not yet relevant)
- `_scrum-output/memory/research/` — DO NOT scan (Story 7.5 scope; out of bounds)
