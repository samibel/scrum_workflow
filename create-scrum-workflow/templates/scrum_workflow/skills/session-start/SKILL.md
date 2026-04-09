---
name: session-start
role: "session-context-aggregation"
description: "Aggregates session context from _scrum-output/ — open stories, recent decisions, and active risks — then presents a structured summary so the developer can resume immediately"
actor: session-start-skill
version: 1.0.0
read_only: true
---

# Identity

The session-start skill is a read-only context aggregation engine that loads the developer's session state from persistent artifacts in `_scrum-output/`. It enables seamless session resume by presenting open work, recent decisions, active risks, and actionable next steps in a single structured summary.

**Story 7.3:** This skill is the developer-facing layer of Epic 7 (Session Memory & Decision Persistence). Stories 7.1 and 7.2 built the artifact infrastructure that this skill reads.

# Instructions

## Invocation

This skill is invoked by a single context:

1. **Developer session start** — Triggered when the developer runs `/session-start` to resume work

### Required Parameters

None — this is a session-level command with no ticket argument.

### Read-Only Constraint (CRITICAL)

This skill MUST NOT write to any file. It is strictly READ-ONLY.

- NEVER call `writeFileSync`, `mkdirSync`, or any write operation
- NEVER modify `story.md` or any artifact in `_scrum-output/`
- NEVER create new files in any directory
- Violation = Bounded Authority Violation (Architecture Pattern 4)

## Context Aggregation Algorithm

### Phase 1: Scan Open Stories

**Target:** `_scrum-output/sprints/`

1. Verify directory exists (return empty list if not — graceful degradation)
2. Use `readdirSync` to list sprint subdirectories (SC-13: no recursive glob)
3. For each subdirectory, check for `story.md`
4. Parse YAML frontmatter using pure string parser (`parseFrontmatter`)
5. Include ONLY stories with non-terminal status (exclude `done`, `cancelled`)
6. Return: `[{ ticket, status, title }]`

**Skip rules (graceful degradation):**
- Sprint dir has no `story.md` → skip
- `story.md` has no parseable frontmatter → skip (log warning)
- `story.md` has terminal status → skip

### Phase 2: Load Recent Decisions

**Target:** `_scrum-output/memory/decisions/`

1. Verify directory exists (return empty list if not — graceful degradation)
2. Use `readdirSync` to list files (SC-13: no recursive glob)
3. Filter to `DR-[0-9][0-9][0-9].md` files only (skip README, etc.)
4. Sort by DR number descending (highest = most recent)
5. Take only the first 5 files (SC-13: do NOT read all DR files)
6. Parse frontmatter of each; extract: `decision_summary`, `ticket`, `created`
7. Return: `[{ drNumber, decisionSummary, ticket, date }]`

**Performance note:** Sorting happens BEFORE file reads. Only 5 files are ever read regardless of how many DRs exist. This ensures SC-13 compliance at 100+ artifacts.

### Phase 3: Load Active Risks

**Target:** `_scrum-output/memory/risks/`

1. Verify directory exists (return empty list if not — graceful degradation)
2. Use `readdirSync` to list files
3. Filter to `RN-[0-9][0-9][0-9].md` files only
4. For each RN file, parse frontmatter; check `status` field
5. Include ONLY files where `status === 'active'` (exclude `resolved`)
6. Return: `[{ rnNumber, riskDescription, severity, affectedArea, ticket }]`

**No limit applied to active risks** — all active risks are shown (unlike decisions which are limited to 5).

### Phase 4: Derive Next Steps

**Input:** Open stories from Phase 1

Map each story's status to a command suggestion:

| Status | Suggestion |
|--------|-----------|
| `draft` | `Refine ticket {ticket} → run /scrum-refine-ticket {ticket}` |
| `refined` | `Validate story {ticket} → run /scrum-refine-story {ticket}` |
| `ready-for-dev` | `Implement story {ticket} → run /scrum-dev-story {ticket}` |
| `in-progress` | `Continue implementation of {ticket} → run /scrum-dev-story {ticket}` |
| `review` | `Review story {ticket} → run /scrum-review-story {ticket}` |
| `changes-needed` | `Apply review feedback to {ticket} → review _scrum-output/sprints/{ticket}/review-N.md` |
| `approved` | `Story {ticket} approved — run /scrum-dev-story {ticket} to complete implementation` |

### Phase 5: Present Summary

Render the session summary using the structured template from `workflows/session-start.md`.

All four sections must appear even if empty (show italic placeholder text for empty sections).

## YAML Frontmatter Parsing

`parseFrontmatter()` is a pure string implementation — NO external YAML library (NFR-2).

**Parsing rules:**
1. Content must start with `---` on line 1
2. Find the closing `---` delimiter
3. Extract lines between delimiters
4. For each line: split on first `:` → key (left) / value (right)
5. Trim whitespace from key and value
6. Strip surrounding double or single quotes from scalar values
7. Return `{}` if no frontmatter found (not an error — graceful degradation)

**Fields extracted per artifact type:**

| Artifact | Fields Extracted |
|----------|-----------------|
| `story.md` | `ticket`, `status`, `title` |
| `DR-XXX.md` | `decision_summary`, `ticket`, `created` |
| `RN-XXX.md` | `status`, `risk_description`, `severity`, `affected_area`, `ticket` |

**Skip array values** — only scalar fields are needed. Array values (e.g., `domain_tags:`) are not required for session context.

## Implementation Files

| File | Role |
|------|------|
| `scrum_workflow/utils/session-context.js` | JavaScript ESM module — all context aggregation logic |
| `scrum_workflow/workflows/session-start.md` | Step-by-step workflow specification |
| `scrum_workflow/commands/session-start.md` | Command interface and output format spec |
| `scrum_workflow/__tests__/session-start/` | ATDD test suite (3 files) |

## Directories NOT Scanned (Scope Boundary)

- `_scrum-output/memory/sessions/` — Created by Story 7.4 (`/wrap-up`); not yet in scope
- `_scrum-output/memory/research/` — Created by Story 7.5; not yet in scope

## NFR Compliance

| NFR | Compliance |
|-----|-----------|
| NFR-2 | No external deps — only `node:fs` and `node:path` |
| NFR-3 | All reads are local file operations (offline capable) |
| NFR-4 | N/A — READ-ONLY; no atomic writes needed |
| NFR-7 | Each artifact reference includes source file path |
| NFR-9 | Plain text terminal output — no binary or ANSI codes |

## Error Handling Pattern

```
❌ {Error Type}: {Brief description}

**Details:** {More context about what went wrong}

**Next Step:** {Actionable guidance for resolution}
```

**Graceful degradation takes priority** — missing directories or unparseable files are silently skipped. Only system-level errors (e.g., permission denied on an existing file) warrant an error message.
