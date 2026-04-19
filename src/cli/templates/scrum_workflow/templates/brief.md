---
schema_version: "1.0.0"
brief_id: "{{brief_id}}"
title: "{{brief_title}}"
status: captured
idea: "{{raw_idea}}"
created: "{{created_date}}"
updated: "{{updated_date}}"
status_history:
  - from: null
    to: captured
    timestamp: "{{created_date}}"
    trigger: /scrum-create-brief
    actor: human
personas: []
goals: []
non_goals: []
open_questions: []
assumptions: []
risks: []
interview_rounds: 0
---

# {{brief_title}}

## Raw Idea

{{raw_idea}}

## Problem Statement

<!-- What user pain or business gap does this address? Filled by product-strategist. -->

{{problem_statement}}

## Target Personas

<!-- Filled from product-strategist perspective. One bullet per persona with needs + constraints. -->

{{personas_section}}

## Goals

<!-- Measurable outcomes. Filled by synthesis. -->

{{goals_section}}

## Non-Goals

<!-- Explicit scope exclusions. Prevents feature creep during decomposition. -->

{{non_goals_section}}

## Key Capabilities

<!-- High-level capability list — becomes the seed for epic decomposition. -->

{{capabilities_section}}

## Assumptions

{{assumptions_section}}

## Risks

<!-- Merged from architect + qa perspectives. -->

{{risks_section}}

## Open Questions

<!-- Populated during Reflection Loop. Empty when status == complete. -->

{{open_questions_section}}

## Interview Transcript

<!-- Appended each interview round. See status_history for count. -->

{{interview_transcript}}
