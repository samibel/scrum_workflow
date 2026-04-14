---
name: audit-trail
trigger: "/scrum-audit-trail"
requires_status: any
sets_status: none
pattern: observability
model_recommendation: "haiku"
---

## Purpose

Query and display the central audit trail for a story. The audit trail records all transitions, agent actions, and artifact creation events, providing complete traceability from draft to done.

## Agentic Pattern

**Pattern:** [Observability & Audit]

**Key Principles:**
- **Audit Trail:** Append-only record of all story events
- **Event Types:** `transition` (status changes), `action` (agent/skill executions), `artifact` (file creations)
- **Query & Display:** Read-only operation that retrieves and formats audit trail entries
- **Write Boundary:** This command reads only; writes are handled by integrated commands during normal workflow

## Workflow Reference

workflows/audit.md

## Input

Ticket number in the format: `/scrum-audit-trail SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number
- **Prerequisite**: The audit trail file `_scrum-output/audit/SW-XXX-audit.md` may exist (created automatically by integrated commands)

## Output

### On Success (Audit Trail Exists):

```
# Audit Trail: SW-XXX

**Story Status:** in-progress
**Total Events:** 12

## Timeline

| Timestamp | Event Type | Actor | Details |
|-----------|------------|-------|---------|
| 2026-04-09T10:00:00Z | transition | human | draft → refined |
| 2026-04-09T10:05:00Z | artifact | refine-ticket | refinement.md created |
| 2026-04-09T10:10:00Z | transition | architect-agent | refined → ready-for-dev |
...
```

### On Success (Audit Trail Empty/New):

```
# Audit Trail: SW-XXX

**Story Status:** draft
**Total Events:** 0

No audit entries yet. Events will be recorded as the story progresses through its lifecycle.
```

### On Error (Invalid Ticket ID):

```
❌ Invalid Ticket ID: SW-XXX

**Format:** Ticket ID must match SW-XXX pattern (e.g., SW-001, SW-042, SW-123)

**Next Step:** Provide a valid ticket ID to query its audit trail.
```

### On Error (Audit Trail Not Found):

```
ℹ️ No audit trail found for SW-XXX

**Status:** This story has no recorded events yet.

**What gets recorded:**
- Status transitions (draft → refined → ready-for-dev → ...)
- Artifact creation (refinement.md, plan.md, verification-report.md, ...)
- Agent actions (refinement, review, approval, ...)

**Next Step:** Events are recorded automatically as you work on the story.
```

## Query Options

### Event Type Filter

`/scrum-audit-trail SW-XXX --type transition`

Filters to show only transition events.

### Actor Filter

`/scrum-audit-trail SW-XXX --actor human`

Filters to show only events by a specific actor type (human, architect-agent, dev-agent, system).

### Summary Mode

`/scrum-audit-trail SW-XXX --summary`

Shows only the summary without full timeline.

## Event Types

| Event Type | Description | Example |
|------------|-------------|---------|
| `transition` | Status change | draft → refined |
| `action` | Agent/skill execution | refinement-complete, review-started |
| `artifact` | File creation | refinement.md created |

## Write Boundary Rules

This workflow is READ ONLY:
- May read `_scrum-output/audit/SW-XXX-audit.md`
- May read `_scrum-output/sprints/SW-XXX/story.md` for status
- May NOT write any files

Audit entries are written automatically by integrated commands during normal workflow execution.

## Write Boundary Rules (Audit Entry Writers)

Integrated commands that write audit entries MAY write:
- `_scrum-output/audit/SW-XXX-audit.md` - Append new audit entries only

Integrated commands MUST NOT:
- Modify or delete existing audit entries
- Write to story.md or other story files (write boundaries defined by those commands)

## Integration Points

The following commands automatically record audit entries:

| Command | Event Type | Details |
|---------|------------|---------|
| `/scrum-refine-ticket` | artifact | refinement.md created |
| `/scrum-refine-story` | artifact | plan.md created |
| `/scrum-verify` | artifact | verification-report.md created |
| `/scrum-review-story` | artifact | review-N.md created |
| `/scrum-approve` | artifact | approval-N.md created |
| All commands | transition | Status changes via status_history integration |

## Error Handling

### Status Guard Violation

N/A - Audit trail query works for stories in any status.

### Missing Audit File

Not an error - simply indicates no events have been recorded yet. Display informative message.
