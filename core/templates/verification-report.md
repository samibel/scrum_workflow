---
schema_version: 1
ticket: {{ticket_id}}
title: "{{story_title}}"
verification_date: {{verification_date}}
verdict: {{verdict}}
---

# Verification Report: {{story_title}}

**Ticket:** {{ticket_id}}
**Verification Date:** {{verification_date}}
**Overall Verdict:** {{verdict}}

## Summary

| Check | Result | Command |
|-------|--------|---------|
| Tests | {{test_result}} | `npm test` |
| Lint  | {{lint_result}} | `npm run lint` |
| Build | {{build_result}} | `npm run build` |

## Test Results

- **Total Tests:** {{test_total}}
- **Passed:** {{test_passed}}
- **Failed:** {{test_failed}}
- **Coverage:** {{test_coverage}}

## Actionable Guidance

{{actionable_guidance}}

## Detailed Output

<details>
<summary>Test Output</summary>

```
{{test_output}}
```

</details>

<details>
<summary>Lint Output</summary>

```
{{lint_output}}
```

</details>

<details>
<summary>Build Output</summary>

```
{{build_output}}
```

</details>
