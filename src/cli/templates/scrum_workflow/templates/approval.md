---
schema_version: 1
ticket: "{{ticket_id}}"
title: "{{story_title}}"
approval_date: "{{approval_date}}"
approver: "{{approver_name}}"
decision: "{{decision}}"
review_reference: "{{review_file}}"
review_date: "{{review_date}}"
---

# Approval Record for {{story_title}}

**Ticket:** {{ticket_id}}
**Approver:** {{approver_name}}
**Decision:** {{decision}}
**Date:** {{approval_date}}
**Review Reference:** {{review_file}}

## Review Summary

**Review File:** {{review_file}}
**Review Date:** {{review_date}}

### Findings Summary

| Total | Critical | Major | Minor |
|-------|----------|-------|-------|
| {{total_findings | 0}} | {{critical_count | 0}} | {{major_count | 0}} | {{minor_count | 0}} |

### Key Findings

{{key_findings_summary | "No findings provided"}}

## Approval Decision

**Decision:** {{decision}}

### Rationale

{{approval_rationale}}

### Conditions (if applicable)

{{approval_conditions | "None specified"}}

## Audit Trail

**Approval Timestamp:** {{approval_timestamp | "N/A"}}
**Approval Session:** {{session_identifier | "N/A"}}
**Reviewer Access:** {{access_method | "N/A"}}

## Next Steps

{{next_steps}}

---

*This approval record is part of the permanent audit trail for story {{ticket_id}}.*
