---
schema_version: 1.0.0
ticket: "{{ticket_id}}"
risk_description: "{{one_line_risk_summary}}"
severity: "{{critical|major|minor}}"
affected_area: "{{category_from_architect_findings}}"
mitigation_suggestion: "{{recommendation_from_architect}}"
status: active
domain_tags:
  - "{{domain_tag_1}}"
  - "{{domain_tag_2}}"
source_file: "{{relative_path_to_refinement_md}}"
created: "{{iso8601_timestamp}}"
updated: "{{iso8601_timestamp}}"
---

# Risk Note: {{one_line_risk_summary}}

**Ticket:** {{ticket_id}}
**Severity:** {{critical|major|minor}}
**Status:** active
**Affected Area:** {{category_from_architect_findings}}
**Created:** {{iso8601_timestamp}}
**Source:** {{relative_path_to_refinement_md}}

## Risk Description

{{one_line_risk_summary}}

## Mitigation Suggestion

{{recommendation_from_architect}}

## Domain Tags

{{domain_tag_1}}, {{domain_tag_2}}
