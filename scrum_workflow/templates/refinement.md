---
schema_version: 1
ticket: "{{ticket_id}}"
title: "{{story_title}}"
refinement_date: "{{refinement_date}}"
agents:
  - architect
  - developer
  - qa
---

# Refinement: {{story_title}}

## Architect Perspective

### Findings

| # | Finding | Severity | Category |
|---|---------|----------|----------|
| 1 | {{finding}} | {{severity}} | {{category}} |

### Recommendations

- {{recommendation_1}}

### Proposed Acceptance Criteria

- [ ] {{proposed_ac_1}}

## Developer Perspective

### Findings

| # | Finding | Severity | Category |
|---|---------|----------|----------|
| 1 | {{finding}} | {{severity}} | {{category}} |

### Recommendations

- {{recommendation_1}}

### Proposed Acceptance Criteria

- [ ] {{proposed_ac_1}}

## QA Perspective

### Findings

| # | Finding | Severity | Category |
|---|---------|----------|----------|
| 1 | {{finding}} | {{severity}} | {{category}} |

### Recommendations

- {{recommendation_1}}

### Proposed Acceptance Criteria

- [ ] {{proposed_ac_1}}

## Feedback Record

<!-- Dedicated section for tracking refinement feedback per NFR16 -->
<!-- This section contains system-generated feedback data and is preserved across story updates -->

### User Decisions

<!-- Individual feedback decisions for each agent perspective -->

- **Architect Perspective**: {accept|reject}
  - Comment: {user_comment_or_"None"}
  - Timestamp: {ISO_8601_timestamp}
  - User: {user_name}

- **Developer Perspective**: {accept|reject}
  - Comment: {user_comment_or_"None"}
  - Timestamp: {ISO_8601_timestamp}
  - User: {user_name}

- **QA Perspective**: {accept|reject}
  - Comment: {user_comment_or_"None"}
  - Timestamp: {ISO_8601_timestamp}
  - User: {user_name}

### Quality Tracking Summary

<!-- Summary statistics for quality tracking over time (FR14) -->

- **Total Perspectives**: 3
- **Accepted**: {count}
- **Rejected**: {count}
- **Acceptance Rate**: {percentage}%
- **Collection Date**: {ISO_8601_date}
- **User**: {user_name}

### Synthesis Summary

<!-- Fill after all agent perspectives are collected -->

- **Total Findings**: {{total_findings}}
- **Critical**: {{critical_count}}
- **Major**: {{major_count}}
- **Minor**: {{minor_count}}

### Accepted Changes

- {{accepted_change_1}}

### Deferred Items

- {{deferred_item_1}}

### Feedback Notes

<!-- Record stakeholder feedback and decisions made during refinement -->

- {{feedback_note_1}}
