# Decision Records

This directory stores Decision Record artifacts (`DR-XXX.md`) extracted from refinement feedback and approval reasoning.

## Naming Convention

Decision records follow a strict sequential naming convention:

- Format: `DR-{NNN}.md` where `{NNN}` is a zero-padded 3-digit number
- Examples: `DR-001.md`, `DR-042.md`, `DR-100.md`
- Sequence starts at `DR-001` and increments by 1 for each new decision record
- Numbers are **never reused** — sequential only, no gaps filled

## Numbering Algorithm

When creating a new DR artifact:
1. Scan this directory for all files matching `DR-[0-9][0-9][0-9].md`
2. Sort numerically and find the highest existing number
3. Increment by 1 (e.g., DR-003 → next is DR-004)
4. If no DRs exist, start at DR-001
5. When extracting multiple decisions in one pass, assign numbers sequentially (DR-001, then DR-002, etc.)

## Artifact Format

Each `DR-XXX.md` file contains YAML frontmatter followed by a human-readable Markdown body:

```yaml
---
schema_version: 1.0.0
ticket: "SW-XXX"
decision_summary: "One-line summary of the decision made"
date: "2026-04-09T12:00:00Z"
context: "Why this decision was made (brief paragraph)"
alternatives_considered:
  - option: "Alternative A"
    rejected_because: "Reason A was not chosen"
  - option: "Alternative B"
    rejected_because: "Reason B was not chosen"
source: "refinement"  # or "approval"
source_file: "_scrum-output/sprints/SW-XXX/refinement.md"
---
```

## Source Types

| Source | Trigger | Source File Pattern |
|--------|---------|---------------------|
| `refinement` | `/scrum-refine-ticket` | `_scrum-output/sprints/SW-XXX/refinement.md` |
| `approval` | `/scrum-approve` | `_scrum-output/sprints/SW-XXX/approval-N.md` |

## Write Boundary

The `decision-extraction` skill may ONLY write to this directory (`_scrum-output/memory/decisions/`). It must NOT modify:
- Story files (`story.md`)
- Refinement files (`refinement.md`)
- Plan files (`plan.md`)
- Approval files (`approval-N.md`)
- Any source code

## NFR Compliance

- **NFR-2**: No external dependencies — uses LLM-based text analysis only
- **NFR-3**: All writes are local file operations (offline capable)
- **NFR-4**: Each DR-XXX.md is written atomically (single operation, no partial writes)
- **NFR-7**: Every DR includes `ticket` field linking back to source story
- **NFR-9**: DR artifacts are human-readable Markdown — no binary formats
