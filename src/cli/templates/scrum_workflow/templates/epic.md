---
schema_version: "1.0.0"
epic_id: "{{epic_id}}"
parent_brief: "{{parent_brief_id}}"
title: "{{epic_title}}"
status: planned
epic_index: "{{epic_index}}"
story_count_estimate: {{story_count_estimate}}
domain_tags: {{domain_tags}}
created: "{{created_date}}"
updated: "{{updated_date}}"
status_history:
  - from: null
    to: planned
    timestamp: "{{created_date}}"
    trigger: /scrum-decompose-epics
    actor: ai
---

# {{epic_title}}

## Purpose

{{epic_purpose}}

## User Value

<!-- Why does this epic exist from a user's perspective? -->

{{user_value}}

## Scope

### In-Scope

{{in_scope}}

### Out-of-Scope

{{out_of_scope}}

## Acceptance Criteria (Epic-Level)

<!-- High-level Given/When/Then for the epic as a whole. Individual stories inherit and refine these. -->

{{epic_acceptance_criteria}}

## Capability Breakdown

<!-- The capabilities this epic delivers. Each becomes 1+ story. -->

{{capability_breakdown}}

## Dependencies

<!-- Other epics or external systems this epic depends on. -->

{{dependencies}}

## Success Metrics

{{success_metrics}}
