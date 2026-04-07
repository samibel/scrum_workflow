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

## Document Discovery

<!-- Documents provided by user during doc-discovery phase (Story 10.1) -->
<!-- Auto-detected context from _scrum-output/context/ is always included -->

### Auto-Detected Context

- `_scrum-output/context/index.md` (project overview)
- `_scrum-output/context/{{domain}}.md` (domain-specific context, if applicable)

### Additional Documents Provided

<!-- List of user-provided documents, or "None (user skipped)" -->

**File Paths:**
- {{file_path_or_"None provided"}}

**URLs:**
- {{url_or_"None provided"}}

## Round 0: Initial Perspectives

<!-- Agent analyses from isolated spawns, stored in temp files -->

### Architect Initial Analysis

| # | Finding | Severity | Category |
|---|---------|----------|----------|
| 1 | {{finding}} | {{severity}} | {{category}} |

**Recommendations:**
- {{recommendation_1}}

**Proposed Acceptance Criteria:**
- [ ] {{proposed_ac_1}}

### Developer Initial Analysis

| # | Finding | Severity | Category |
|---|---------|----------|----------|
| 1 | {{finding}} | {{severity}} | {{category}} |

**Recommendations:**
- {{recommendation_1}}

**Proposed Acceptance Criteria:**
- [ ] {{proposed_ac_1}}

### QA Initial Analysis

| # | Finding | Severity | Category |
|---|---------|----------|----------|
| 1 | {{finding}} | {{severity}} | {{category}} |

**Recommendations:**
- {{recommendation_1}}

**Proposed Acceptance Criteria:**
- [ ] {{proposed_ac_1}}

## Discussion Rounds

<!-- Cross-talk discussion rounds where agents see and comment on each other's perspectives -->
<!-- Progressive truncation: Round 1 (400 words), Round 2 (300 words), Round 3 (200 words) -->

### Round 1 (400 words per agent)

**Architect Comments:**
- **Agrees with:** {{agreement_1}}
- **Disagrees with:** {{disagreement_1}} (Blocker: {{yes/no}})
- **Blind spots identified:** {{blind_spot_1}}

**Developer Comments:**
- **Agrees with:** {{agreement_1}}
- **Disagrees with:** {{disagreement_1}} (Blocker: {{yes/no}})
- **Blind spots identified:** {{blind_spot_1}}

**QA Comments:**
- **Agrees with:** {{agreement_1}}
- **Disagrees with:** {{disagreement_1}} (Blocker: {{yes/no}})
- **Blind spots identified:** {{blind_spot_1}}

**Round 1 Summary:**
- Blockers: {{blocker_count}}
- Non-Blockers: {{non_blocker_count}}

### Round 2 (300 words per agent)

**Architect Comments:**
- **Agrees with:** {{agreement_1}}
- **Disagrees with:** {{disagreement_1}} (Blocker: {{yes/no}})
- **Blind spots identified:** {{blind_spot_1}}

**Developer Comments:**
- **Agrees with:** {{agreement_1}}
- **Disagrees with:** {{disagreement_1}} (Blocker: {{yes/no}})
- **Blind spots identified:** {{blind_spot_1}}

**QA Comments:**
- **Agrees with:** {{agreement_1}}
- **Disagrees with:** {{disagreement_1}} (Blocker: {{yes/no}})
- **Blind spots identified:** {{blind_spot_1}}

**Round 2 Summary:**
- Blockers: {{blocker_count}}
- Non-Blockers: {{non_blocker_count}}

### Round 3 (200 words per agent)

**Architect Comments:**
- **Agrees with:** {{agreement_1}}
- **Disagrees with:** {{disagreement_1}} (Blocker: {{yes/no}})
- **Blind spots identified:** {{blind_spot_1}}

**Developer Comments:**
- **Agrees with:** {{agreement_1}}
- **Disagrees with:** {{disagreement_1}} (Blocker: {{yes/no}})
- **Blind spots identified:** {{blind_spot_1}}

**QA Comments:**
- **Agrees with:** {{agreement_1}}
- **Disagrees with:** {{disagreement_1}} (Blocker: {{yes/no}})
- **Blind spots identified:** {{blind_spot_1}}

**Round 3 Summary:**
- Blockers: {{blocker_count}}
- Non-Blockers: {{non_blocker_count}}

### Deadlock Resolution

<!-- Only shown if blockers remain after max rounds -->

{{#if deadlock}}
⚠️ **REFINEMENT DEADLOCK after {{max_rounds}} rounds**

Blocking Issues:
{{#each blockers}}
{{@index}}. {{this.description}} [{{this.agent}}'s proposal]
{{/each}}

**Resolution Options:**
1. Accept [Agent]'s proposal
2. Provide alternative
3. Cancel and revert story to Draft

**User Decision:** {{deadlock_resolution}}
{{/if}}

### Early Consensus Exit

{{#if early_exit}}
✅ **Early Consensus Reached**

All blockers resolved. Proceeding to synthesis without further rounds.
- Rounds completed: {{rounds_completed}}
- Remaining non-blockers: {{non_blocker_count}}
{{/if}}

## Estimation

<!-- Wideband Delphi estimation (Story 10.3) -->

### Initial Estimates

| Agent | Estimate (SP) | Rationale |
|-------|---------------|-----------|
| Architect | {{architect_estimate}} | {{architect_rationale}} |
| Developer | {{developer_estimate}} | {{developer_rationale}} |
| QA | {{qa_estimate}} | {{qa_rationale}} |

**Variance:** {{variance}} points
**Threshold:** {{threshold}} points (configurable via `estimation_variance_threshold`)

### Re-Estimation (if variance > threshold)

{{#if re_estimation_needed}}
**Discussion Round:** {{re_estimation_discussion}}

| Agent | Revised Estimate (SP) | Rationale |
|-------|----------------------|-----------|
| Architect | {{architect_revised}} | {{architect_revised_rationale}} |
| Developer | {{developer_revised}} | {{developer_revised_rationale}} |
| QA | {{qa_revised}} | {{qa_revised_rationale}} |

**New Variance:** {{new_variance}} points
{{/if}}

### Final Estimate

**Median:** {{final_estimate}} SP
**Method:** Wideband Delphi
**Confidence Level:** {{confidence_level}}

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
