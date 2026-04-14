---
schema_version: 1
ticket: "{{ticket_id}}"
title: "{{story_title}}"
review_date: "{{review_date}}"
review_number: "{{review_number}}"
reviewer: "[AI Code Reviewer]"
verdict: "{{verdict}}"  # REQUIRED: Must be either "approved" or "changes-needed" - validation enforced
---

# Code Review: {{story_title}}

**Ticket:** {{ticket_id}}
**Status:** In Review
**Review Date:** {{review_date}}
**Review Number:** {{review_number}}
**Verdict:** {{verdict}}

## Summary

| Total | Critical | Major | Minor |
|-------|----------|-------|-------|
| {{total_findings}} | {{critical_count}} | {{major_count}} | {{minor_count}} |

## Review Scope

**Files Reviewed:**
{{file_list}}

**Changes Analyzed:**
{{change_summary}}

## Findings

| # | Finding | Severity | AC Reference | Suggested Fix |
|---|---------|----------|--------------|--------------|
{{findings_table_rows}}

## Detailed Analysis

### Critical Findings ({{critical_count}})

{{critical_findings_detail}}

### Major Findings ({{major_count}})

{{major_findings_detail}}

### Minor Findings ({{minor_count}})

{{minor_findings_detail}}

## Recommendations

{{recommendations}}

## Previous Findings Resolution

{{#if previous_reviews_exist}}
**Previous Review:** {{previous_review_number}} ({{previous_review_date}})

| Previous Finding | Status | Notes |
|-----------------|---------|-------|
| {{previous_finding_1}} | Resolved/Unresolved/New | {{notes}} |
| {{previous_finding_2}} | Resolved/Unresolved/New | {{notes}} |

**Summary:**
- Total previous findings: {{previous_total}}
- Resolved: {{resolved_count}}
- Unresolved: {{unresolved_count}}
- New findings: {{new_findings_count}}
{{/if}}

{{#unless previous_reviews_exist}}
*This is the first review for this story.*
{{/unless}}

## Approval Assessment

**Overall Assessment:** [PASS/FAIL - BLOCKING/PASS WITH MINOR ISSUES]

**Ready for Approval:**
- [ ] All Critical findings addressed
- [ ] All Major findings addressed or documented as acceptable risk
- [ ] Minor findings documented for future work

**Next Steps:**
{{next_steps}}
