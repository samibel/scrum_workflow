---
schema_version: 1.0.0
ticket: "{{ticket_id}}"
decision_summary: "{{one_line_summary}}"
date: "{{iso8601_timestamp}}"
context: "{{why_this_decision}}"
alternatives_considered:
  - option: "{{alternative_1}}"
    rejected_because: "{{rationale_1}}"
  - option: "{{alternative_2}}"
    rejected_because: "{{rationale_2}}"
source: "{{refinement|approval}}"
source_file: "{{relative_path_to_source}}"
---

# Decision Record: {{one_line_summary}}

**Ticket:** {{ticket_id}}
**Date:** {{iso8601_timestamp}}
**Source:** {{relative_path_to_source}}

## Decision

{{one_line_summary}}

## Context

{{why_this_decision}}

## Alternatives Considered

| Option | Reason Not Chosen |
|--------|------------------|
| {{alternative_1}} | {{rationale_1}} |
| {{alternative_2}} | {{rationale_2}} |

## Consequences

{{positive_and_negative_consequences}}
