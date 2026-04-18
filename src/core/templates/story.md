---
schema_version: "1.0.0"
ticket: "{{ticket_id}}"
title: "{{story_title}}"
status: draft
type: "{{story_type}}"
risk_level: "{{risk_level}}"
depth: "{{depth}}"
depth_source: "{{depth_source}}"
domain_tags: {{domain_tags}}
parent_epic: {{parent_epic}}
epic_index: {{epic_index}}
estimation: null
created: "{{created_date}}"
updated: "{{updated_date}}"
status_history:
  - from: null
    to: draft
    timestamp: "{{created_date}}"
    trigger: /scrum-create-ticket
    actor: human
---

# {{story_title}}

## Description

<!-- Fill with story description from ticket creation -->

{{story_description}}

## Acceptance Criteria

<!-- Fill with acceptance criteria - use Given/When/Then format -->

- [ ] {{acceptance_criterion_1}}
- [ ] {{acceptance_criterion_2}}
- [ ] **[DOC]** Document changes: describe the state **before** and **after** this story, explain the reasoning why these changes were made. Mermaid diagrams may be used for visual clarity.

## Subtasks

<!-- Fill with implementation subtasks -->

- [ ] {{subtask_1}}
- [ ] {{subtask_2}}
