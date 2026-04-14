---
name: decision-extraction
role: "decision-record-extraction"
description: "Extracts decision records from refinement and approval artifacts, creating DR-XXX.md files in _scrum-output/memory/decisions/"
actor: decision-extraction-skill
version: 1.0.0
---

# Identity

The decision-extraction skill is an analysis engine that identifies explicit decision signals in refinement and approval artifacts and creates standalone Decision Record (`DR-XXX.md`) artifacts. It enables session memory and decision persistence across work sessions (Epic 7 goal).

# Instructions

## Invocation

This skill is invoked in two contexts:

1. **After refinement synthesis** — Invoked by `scrum_workflow/workflows/refinement.md` (Phase 6a) after `refinement.md` is written
2. **After approval record creation** — Invoked by `scrum_workflow/workflows/approval.md` after `approval-N.md` is written

### Required Parameters

- `source`: Either `refinement` or `approval` — indicates which artifact triggered extraction
- `source_file`: Relative path to the source artifact (e.g., `_scrum-output/sprints/SW-XXX/refinement.md`)
- `ticket`: The story ticket ID (e.g., `SW-001`)

## Decision Detection Algorithm

### What Counts as a Decision

A decision is an **explicit choice between alternatives where the rationale is documented**. Signal phrases include:

- `"We chose X over Y because..."` — explicit choice with rationale
- `"Using X instead of Y"` — substitution with implied preference
- `"X was selected because..."` — selection with documented reason
- `"Approved because X chosen over Y"` — approval-embedded decision
- `"X was preferred over Y"` — preference statement
- `"Decided to use X"` — explicit decision statement
- `"X rejected because..."` — rejection with rationale implies a choice was made

**Technology choices:** Framework, library, pattern, approach selection
**Architecture selections:** Pattern choice, structural decision
**Scope decisions:** What's in/out, phased vs all-at-once

### What Does NOT Count as a Decision

- Simple task descriptions: `"Task 1: Create the directory structure"`
- Status updates: `"Status: implementation complete"`
- Bug descriptions without alternatives: `"Bug: numbering returns 0 when dir is empty"`
- Implementation steps without rationale: `"Step 2: Write the file to disk"`

## Extraction Process

For each source artifact:

1. **Read** the source artifact content
2. **Scan** line-by-line for decision signal phrases (see patterns above)
3. **For each detected decision**:
   a. Extract: decision text, alternatives mentioned, rationale context
   b. Read `_scrum-output/memory/decisions/` directory listing
   c. Find highest existing DR number (e.g., `DR-003.md` → next is `DR-004`)
   d. If no DRs exist, start at `DR-001`
   e. Write `DR-{NNN}.md` with required YAML frontmatter + Markdown body
4. **Return** list of created DR files for reporting

### Sequential Numbering (Critical)

- Always scan `_scrum-output/memory/decisions/` for files matching `DR-[0-9][0-9][0-9].md`
- Sort numerically, take the highest number, increment by 1
- Zero-pad to 3 digits: `DR-001`, `DR-042`, `DR-100`
- When multiple decisions found in one pass, assign sequentially (DR-001 then DR-002 — NOT parallel)
- Numbers are NEVER reused

## Write Boundary (CRITICAL)

This skill MAY ONLY write to: `_scrum-output/memory/decisions/DR-XXX.md`

This skill MUST NOT modify:
- `story.md` — read-only
- `refinement.md` — read-only during extraction
- `plan.md` — read-only
- `approval-N.md` — read-only (it triggered extraction, not a write target)
- Any source code files
- Any `scrum_workflow/` framework files

**Write Boundary Violation Error (if attempted):**
```
❌ Write Boundary Violation: decision-extraction-skill attempted to write '{file_path}'

**Details:** The decision-extraction skill may only write to _scrum-output/memory/decisions/. Attempted write target is outside the allowed boundary.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```

## DR Artifact Format

Each created DR file must follow this structure exactly:

```markdown
---
schema_version: 1.0.0
ticket: "SW-XXX"
decision_summary: "One-line summary of the decision made"
date: "2026-04-09T12:00:00Z"
context: "Why this decision was made"
alternatives_considered:
  - option: "Alternative A"
    rejected_because: "Reason A was not chosen"
  - option: "Alternative B"
    rejected_because: "Reason B was not chosen"
source: refinement
source_file: _scrum-output/sprints/SW-XXX/refinement.md
---

# Decision Record: {decision_summary}

**Ticket:** SW-XXX
**Date:** 2026-04-09T12:00:00Z
**Source:** _scrum-output/sprints/SW-XXX/refinement.md

## Decision

{decision_summary}

## Context

{context}

## Alternatives Considered

| Option | Reason Not Chosen |
|--------|------------------|
| Alternative A | Reason A was not chosen |
| Alternative B | Reason B was not chosen |

## Consequences

{positive_and_negative_consequences}
```

### Required YAML Frontmatter Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `schema_version` | string | Yes | Always `"1.0.0"` |
| `ticket` | string | Yes | Source story ID (NFR-7 traceability) |
| `decision_summary` | string | Yes | One-line summary |
| `date` | string | Yes | ISO 8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`) |
| `context` | string | Yes | Why decision was made |
| `alternatives_considered` | array | Yes | May be empty array `[]` if no explicit alternatives |
| `source` | string | Yes | Either `refinement` or `approval` |
| `source_file` | string | Yes | Relative path to triggering artifact |

## Auto-Directory Creation

If `_scrum-output/memory/decisions/` does not exist when the skill runs:
- **Create it automatically** — this is expected on first run
- Create `_scrum-output/memory/` parent if needed
- This is **NOT an error condition**

## Reporting

After extraction, report results in the invoking workflow's completion summary:

**When decisions found:**
```
Extracted 2 decision records: DR-001.md, DR-002.md
```

**When no decisions found:**
```
No decisions detected in refinement feedback
```
or
```
No decisions detected in approval reasoning
```

## NFR Compliance

- **NFR-2 (No external dependency):** Text analysis is LLM-based — no external APIs, no additional npm packages
- **NFR-3 (Offline capability):** All artifact writes are local file operations
- **NFR-4 (Atomic file operations):** Each `DR-XXX.md` is written as a single atomic operation (never partial writes)
- **NFR-7 (Artifact Traceability):** Every DR-XXX.md includes `ticket` field linking back to source story
- **NFR-9 (Inspectability):** DR artifacts are human-readable Markdown with YAML frontmatter — no binary formats

# Context Rules

## Reads

- Source artifact passed by invoking workflow (`refinement.md` or `approval-N.md`)
- `_scrum-output/memory/decisions/` — directory listing to determine next DR number

## Writes

- `_scrum-output/memory/decisions/DR-{NNN}.md` — the only permitted write target
- Creates `_scrum-output/memory/decisions/` directory if missing (auto-create, not an error)
