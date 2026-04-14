---
name: feedback-collection
role: "perspective-feedback"
description: "Collects user feedback on each agent perspective individually during refinement, recording accept/reject decisions with optional comments"
---

# Identity

The feedback-collection skill is a lightweight interaction layer that gathers user decisions on each agent perspective during the refinement process. It presents each perspective (Architect, Developer, QA) sequentially, prompts for a simple accept/reject decision, allows optional comments, and records all feedback in a structured format for synthesis filtering and quality tracking.

# Instructions

## Feedback Collection Process

Execute sequential feedback collection following these steps:

### Step 1: Present Perspective

For each agent perspective (in order: Architect, Developer, QA):

1. Display the perspective header clearly
2. Show the Findings table (if present)
3. Show Recommendations (if present)
4. Show Proposed Acceptance Criteria (if present)

### Step 2: Collect Decision

Ask the user a simple yes/no question:

```
Do you accept the {Agent Name} perspective? [accept/reject]
Optional comment (press Enter to skip):
```

Wait for user input before proceeding to the next perspective.

### Step 3: Validate Input

Validate the user's decision:
- Accept: "accept", "yes", "y", "a" (case-insensitive) - extensible defaults
- Reject: "reject", "no", "n", "r" (case-insensitive) - extensible defaults
- If invalid input, prompt again with clear options: "Invalid input. Please enter 'accept' or 'reject' (or a/y/n/r)"

### Step 4: Record Feedback

Store the feedback with the following structure:

```yaml
- agent: {architect|developer|qa}
  decision: {accept|reject}
  comment: {user_comment_or_empty_string}
  timestamp: {ISO_8601_timestamp}  # Generate using current datetime in ISO 8601 format
  user: {user_identifier_from_config}
```

## Feedback Output Format

Produce feedback data in the format expected by the synthesis skill:

```markdown
### User Decisions

- **Architect Perspective**: {accept|reject}
  - Comment: {user_comment_or_"None"}
  - Timestamp: {ISO_8601}
  - User: {user_name}

- **Developer Perspective**: {accept|reject}
  - Comment: {user_comment_or_"None"}
  - Timestamp: {ISO_8601}
  - User: {user_name}

- **QA Perspective**: {accept|reject}
  - Comment: {user_comment_or_"None"}
  - Timestamp: {ISO_8601}
  - User: {user_name}

### Quality Tracking Summary

- **Total Perspectives**: 3
- **Accepted**: {count}
- **Rejected**: {count}
- **Acceptance Rate**: {percentage}%
- **Collection Date**: {ISO_8601_date}
```

# Context Rules

## Reads

- Agent perspectives from refinement workflow -- The three perspective outputs (Architect, Developer, QA)
- `scrum_workflow/config.yaml` -- User identifier and platform settings

## Writes

This skill produces:

- Structured feedback data for insertion into `refinement.md` Feedback Record section
- Feedback summary statistics for quality tracking

## Error Handling

- If user provides invalid decision format, prompt again with examples
- If user skips optional comment, record as "None"
- If feedback collection is interrupted, preserve collected feedback and allow resumption
- If perspective is missing (e.g., agent failed), log error and continue with remaining perspectives

## Quality Tracking

Record the following metadata for each refinement cycle:

- Per-agent acceptance rate (calculated per refinement instance)
- User comment frequency (percentage of decisions with comments)
- Collection timestamp (ISO 8601 format)

**Note:** Cumulative tracking across multiple refinements (acceptance rate trends over time) is deferred to Phase 2. Current implementation provides per-refinement statistics stored in the refinement.md Feedback Record section, which satisfies AC4 (persistence across story updates).

This metadata supports FR14 (quality tracking over time) and enables future improvements to agent perspective quality.
