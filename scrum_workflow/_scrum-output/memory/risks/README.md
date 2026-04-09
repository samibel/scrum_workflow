# Risk Notes Directory

This directory stores **Risk Note** (`RN-XXX.md`) artifacts extracted from Architect agent perspectives during the refinement workflow.

## Purpose

Risk notes capture identified risks from Architect agent findings and persist them across work sessions. This enables the review agent to receive risk context when reviewing stories in the same domain (Epic 7 goal: session memory & decision persistence).

## Artifact Naming Convention

Risk notes follow the naming pattern `RN-NNN.md` with zero-padded 3-digit sequential numbering:

- `RN-001.md` — First risk note
- `RN-042.md` — Forty-second risk note
- `RN-100.md` — One-hundredth risk note

**Rules:**
- Numbers are **never reused** — always take `highest existing number + 1`
- Numbers are **never recycled** when a risk is resolved — the file remains with `status: resolved`
- Gaps in numbering (e.g., RN-001, RN-005) are acceptable — always derive from highest, not count

## RN Artifact Format

Each `RN-NNN.md` file uses YAML frontmatter + Markdown body:

```markdown
---
schema_version: 1.0.0
ticket: "SW-XXX"
risk_description: "One-line summary of the risk"
severity: "critical|major|minor"
affected_area: "Category from Architect findings"
mitigation_suggestion: "Recommended mitigation from Architect"
status: active
domain_tags:
  - "domain-tag-1"
  - "domain-tag-2"
source_file: "_scrum-output/sprints/SW-XXX/refinement.md"
created: "2026-04-09T12:00:00Z"
updated: "2026-04-09T12:00:00Z"
---

# Risk Note: One-line summary of the risk

**Ticket:** SW-XXX
**Severity:** critical|major|minor
**Status:** active
**Affected Area:** Category from Architect findings
**Created:** 2026-04-09T12:00:00Z
**Source:** _scrum-output/sprints/SW-XXX/refinement.md

## Risk Description

One-line summary of the risk

## Mitigation Suggestion

Recommended mitigation from Architect

## Domain Tags

domain-tag-1, domain-tag-2
```

## Status Lifecycle

Risk notes have a two-state lifecycle:

| Status | Description |
|--------|-------------|
| `active` | Risk is unresolved — loaded as context during `/scrum-review-story` |
| `resolved` | Risk has been addressed — **never** loaded as context |

**Transition:** `active` → `resolved` (manual or via Story 7.3/7.4 workflows)

Risk notes are **never deleted** — resolved notes remain for historical traceability (NFR-7).

## YAML Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schema_version` | string | Yes | Always `"1.0.0"` |
| `ticket` | string | Yes | Source story ticket ID (NFR-7 traceability) |
| `risk_description` | string | Yes | One-line risk summary |
| `severity` | string | Yes | `critical`, `major`, or `minor` |
| `affected_area` | string | Yes | Category from Architect findings table |
| `mitigation_suggestion` | string | Yes | Recommendation from Architect |
| `status` | string | Yes | `active` or `resolved` |
| `domain_tags` | array | Yes | Domain keywords for relevance matching |
| `source_file` | string | Yes | Relative path to source refinement.md |
| `created` | string | Yes | ISO 8601 UTC timestamp |
| `updated` | string | Yes | ISO 8601 UTC timestamp |

## Source

Risk notes are extracted from the **Architect Perspective** section of `refinement.md`:
- `### Findings` table rows → each row becomes one `RN-NNN.md`
- `### Recommendations` section → mitigation suggestions

## Write Boundary

The `risk-extraction` skill **may ONLY write** to this directory (`_scrum-output/memory/risks/`).

The review workflow (`review-story.md`) is **read-only** for risk notes — it loads them as context but never writes or modifies them.
