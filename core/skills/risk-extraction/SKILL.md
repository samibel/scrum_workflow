---
name: risk-extraction
role: "risk-note-extraction"
description: "Extracts risk notes from Architect agent perspectives in refinement artifacts, creating RN-XXX.md files in _scrum-output/memory/risks/"
actor: risk-extraction-skill
version: 1.0.0
---

# Identity

The risk-extraction skill is an analysis engine that identifies risk signals in Architect agent perspectives embedded in refinement artifacts and creates standalone Risk Note (`RN-XXX.md`) artifacts. It enables session memory and risk persistence across work sessions (Epic 7 goal).

# Instructions

## Invocation

This skill is invoked in one context:

1. **After decision extraction** — Invoked by `scrum_workflow/workflows/refinement.md` (Phase 6b) after `decision-extraction` skill runs (Step 10.7, after Step 10.6)

### Required Parameters

- `source_file`: Relative path to the source artifact (e.g., `_scrum-output/sprints/SW-XXX/refinement.md`)
- `ticket`: The story ticket ID (e.g., `SW-001`)

## Risk Signal Detection Algorithm

### What the Architect Agent Produces

The Architect agent outputs a `## Architect Perspective` section in `refinement.md` containing:

- `### Findings` — a Markdown table with columns: `#`, `Finding`, `Severity`, `Category`
- `### Recommendations` — numbered list (mitigation suggestions)
- `### Proposed Acceptance Criteria` — checkbox list (not extracted as risks)

### Extraction Strategy

1. Parse the Architect agent's `### Findings` table in the stored `refinement.md`
2. Each **row** in the Findings table is a risk note candidate
3. Extract per row: finding text (risk description), severity (Critical/Major/Minor → lowercase), category (maps to `affected_area`)
4. Also scan `### Recommendations` section for mitigation suggestions (matched by position: row 1 ↔ recommendation 1)
5. Severity mapping: `Critical` → `critical`, `Major` → `major`, `Minor` → `minor`

### Domain Tag Derivation

- Extract from the Category column of the Findings table
- Normalize category to lowercase, replace spaces with hyphens
- Also derive from the story ticket context
- Store as a YAML array: `domain_tags: ["data-integrity", "storage"]`

## Extraction Process

For each source artifact:

1. **Read** the source artifact content
2. **Locate** the `## Architect Perspective` section header
3. **Parse** the `### Findings` table — each non-header, non-separator row is a risk
4. **For each finding row**:
   a. Extract: finding text (risk description), severity (normalized lowercase), category (affected_area)
   b. Find the matching numbered recommendation in `### Recommendations` (same index as row number)
   c. Derive domain tags from category (normalize to lowercase-hyphenated)
   d. Read `_scrum-output/memory/risks/` directory listing to find highest existing RN number
   e. If no RNs exist, start at RN-001
   f. Write `RN-{NNN}.md` with required YAML frontmatter + Markdown body
5. **Return** list of created RN files for reporting

### Sequential Numbering (Critical)

- Always scan `_scrum-output/memory/risks/` for files matching `RN-[0-9][0-9][0-9].md`
- Sort numerically, take the highest number, increment by 1
- Zero-pad to 3 digits: `RN-001`, `RN-042`, `RN-100`
- When multiple risks found in one pass, assign sequentially (RN-001 then RN-002 — NOT parallel)
- Numbers are NEVER reused

## Write Boundary (CRITICAL)

This skill MAY ONLY write to: `_scrum-output/memory/risks/RN-XXX.md`

This skill MUST NOT modify:
- `story.md` — read-only
- `refinement.md` — read-only (triggered extraction, not a write target)
- `plan.md` — read-only
- `approval-N.md` — read-only
- Any source code files
- Any `scrum_workflow/` framework files

**Write Boundary Violation Error (if attempted):**
```
❌ Write Boundary Violation: risk-extraction-skill attempted to write '{file_path}'

**Details:** The risk-extraction skill may only write to _scrum-output/memory/risks/. Attempted write target is outside the allowed boundary.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```

## RN Artifact Format

Each created RN file must follow this structure exactly:

```markdown
---
schema_version: 1.0.0
ticket: "SW-XXX"
risk_description: "One-line summary of the risk"
severity: "critical"
affected_area: "Data Integrity"
mitigation_suggestion: "Use atomic file writes (write to temp, then rename)"
status: active
domain_tags:
  - "data-integrity"
  - "storage"
source_file: "_scrum-output/sprints/SW-XXX/refinement.md"
created: "2026-04-09T12:00:00Z"
updated: "2026-04-09T12:00:00Z"
---

# Risk Note: One-line summary of the risk

**Ticket:** SW-XXX
**Severity:** critical
**Status:** active
**Affected Area:** Data Integrity
**Created:** 2026-04-09T12:00:00Z
**Source:** _scrum-output/sprints/SW-XXX/refinement.md

## Risk Description

One-line summary of the risk

## Mitigation Suggestion

Use atomic file writes (write to temp, then rename)

## Domain Tags

data-integrity, storage
```

### Required YAML Frontmatter Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `schema_version` | string | Yes | Always `"1.0.0"` |
| `ticket` | string | Yes | Source story ID (NFR-7 traceability) |
| `risk_description` | string | Yes | One-line risk summary |
| `severity` | string | Yes | `critical`, `major`, or `minor` (lowercase) |
| `affected_area` | string | Yes | Category from Architect Findings table |
| `mitigation_suggestion` | string | Yes | Recommendation from Architect |
| `status` | string | Yes | Always `active` on creation |
| `domain_tags` | array | Yes | Derived from category, normalized lowercase-hyphenated |
| `source_file` | string | Yes | Relative path to triggering refinement.md |
| `created` | string | Yes | ISO 8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`) |
| `updated` | string | Yes | ISO 8601 UTC — same as created on initial write |

## Auto-Directory Creation

If `_scrum-output/memory/risks/` does not exist when the skill runs:
- **Create it automatically** — this is expected on first run
- Create `_scrum-output/memory/` parent if needed
- This is **NOT an error condition**

## No Risks Detected

If the `## Architect Perspective` section is missing from `refinement.md`:
- Log warning: `"Architect Perspective section not found in refinement.md — skipping risk extraction"`
- Continue without creating RN files — this is NOT a blocker

If the `### Findings` table has no data rows (only header):
- This is NOT an error
- Log: `"No risks detected in Architect perspective"` and continue
- Do not create any RN files

## Reporting

After extraction, report results in the refinement completion summary:

**When risks found:**
```
Extracted 3 risk notes: RN-001.md, RN-002.md, RN-003.md
```

**When no risks found:**
```
No risks detected in Architect perspective
```

## NFR Compliance

- **NFR-2 (No external dependency):** Text analysis is LLM-based — no external APIs, no additional npm packages
- **NFR-3 (Offline capability):** All artifact writes are local file operations
- **NFR-4 (Atomic file operations):** Each `RN-XXX.md` is written as a single atomic operation (never partial writes)
- **NFR-7 (Artifact Traceability):** Every RN-XXX.md includes `ticket` field linking back to source story
- **NFR-9 (Inspectability):** RN artifacts are human-readable Markdown with YAML frontmatter — no binary formats

# Context Rules

## Reads

- Source artifact (`refinement.md`) passed by invoking workflow
- `_scrum-output/memory/risks/` — directory listing to determine next RN number

## Writes

- `_scrum-output/memory/risks/RN-{NNN}.md` — the only permitted write target
- Creates `_scrum-output/memory/risks/` directory if missing (auto-create, not an error)
