---
schema_version: 1
ticket: "{{ticket_id}}"
title: "{{story_title}}"
review_date: "{{review_date}}"
review_number: "{{review_number}}"
reviewer: "[AI Code Reviewer]"
---

# Code Review: {{story_title}}

**Ticket:** {{ticket_id}}
**Status:** In Review
**Review Date:** {{review_date}}
**Review Number:** {{review_number}}

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

## Approval Assessment

**Overall Assessment:** [PASS/FAIL - BLOCKING/PASS WITH MINOR ISSUES]

**Ready for Approval:**
- [ ] All Critical findings addressed
- [ ] All Major findings addressed or documented as acceptable risk
- [ ] Minor findings documented for future work

**Next Steps:**
{{next_steps}}
