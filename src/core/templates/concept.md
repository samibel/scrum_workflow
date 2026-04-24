---
schema_version: "1.0.0"
kind: "concept"
title: "{{title}}"
status: "draft"
source_problem: "{{source_problem}}"
ticket: "{{ticket}}"
area: "{{area}}"
depth: "{{depth}}"
created: "{{created}}"
updated: "{{updated}}"
---

# Concept: {{title}}

## 1. Problem Summary

{{problem_summary}}

## 2. Context

{{context}}

## 3. Analysis Graph

```mermaid
flowchart TD
    A[Problem Statement] --> B[Relevant Files]
    A --> C[Relevant Modules]
    B --> D[Current Behavior]
    C --> D
    D --> E[Constraints]
    E --> F[Possible Root Causes]
    F --> G[Solution Options]
    G --> H[Trade-off Analysis]
    H --> I[Recommended Solution]
    I --> J[Implementation Plan]
    I --> K[Test Strategy]
    I --> L[Risks]
    L --> M[Open Questions]
```

## 4. Relevant Files and Modules

{{relevant_files}}

## 5. Current Project Behavior

{{current_behavior}}

## 6. Existing Patterns Found

{{existing_patterns}}

## 7. Constraints

{{constraints}}

## 8. Possible Root Causes

{{possible_root_causes}}

## 9. Solution Options

### Option A: {{option_a_title}}

{{option_a_description}}

**Pros**

{{option_a_pros}}

**Cons**

{{option_a_cons}}

**Complexity**

{{option_a_complexity}}

**Risk**

{{option_a_risk}}

---

### Option B: {{option_b_title}}

{{option_b_description}}

**Pros**

{{option_b_pros}}

**Cons**

{{option_b_cons}}

**Complexity**

{{option_b_complexity}}

**Risk**

{{option_b_risk}}

---

### Option C (Optional): {{option_c_title}}

{{option_c_description}}

**Pros**

{{option_c_pros}}

**Cons**

{{option_c_cons}}

**Complexity**

{{option_c_complexity}}

**Risk**

{{option_c_risk}}

> Remove this Option C block when only two options are analyzed.

### Additional Options (Optional)

{{additional_options}}

## 10. Trade-off Analysis

{{tradeoff_analysis}}

## 11. Recommended Solution

{{recommended_solution}}

## 12. Implementation Plan

{{implementation_plan}}

## 13. Test Strategy

{{test_strategy}}

## 14. Risks

{{risks}}

## 15. Open Questions

{{open_questions}}

## 16. Suggested Follow-up Ticket

{{suggested_followup_ticket}}
