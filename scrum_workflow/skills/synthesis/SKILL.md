---
name: synthesis
role: "perspective-merging"
description: "Merges accepted agent perspectives into a coherent updated story file with refined description, acceptance criteria, estimation, and subtasks"
---

# Identity

The synthesis skill is a coordination engine that synthesizes multi-agent output into a single coherent story specification. It takes the individual perspectives produced by the Architect, Developer, and QA agents during refinement, applies user feedback decisions (accept/reject), and produces a unified, deduplicated, conflict-resolved update to the story file. The result is a refined story that incorporates the best insights from all accepted perspectives without redundancy or contradiction.

# Instructions

## Merge Strategy

Process agent perspectives following these rules:

1. **Read Feedback from Refinement**: Load `refinement.md` and extract user decisions from the Feedback Record section. Parse each agent's decision (accept/reject) from the User Decisions subsection.

**Error Handling:**
- If refinement.md does not exist, halt with error: "Refinement file not found"
- If Feedback Record section is missing or malformed, log warning and proceed with all perspectives accepted (fallback behavior)
- Validate section exists before parsing to prevent unhandled exceptions
2. **Accept/Reject Filtering**: Process only perspectives that the user has explicitly accepted based on the feedback data. Rejected perspectives are preserved in `refinement.md` for audit purposes but are not merged into the story.
3. **Edge Case - All Rejected**: If all three perspectives are rejected, skip all merge operations and preserve the original story without modifications. Log in refinement.md: "All perspectives rejected - original story preserved".
4. **Perspective Sources**: Each agent perspective contains Findings (table-based), Recommendations (list), and Proposed Acceptance Criteria (checklist). Process all three sections from each accepted perspective.

**Feedback Parsing Logic:**
```markdown
## Feedback Record

### User Decisions
- **Architect Perspective**: accept
  - Comment: [text]
  - Timestamp: [ISO_8601]

[Parse decision value: "accept" or "reject"]
```

**Timestamp Validation:**
- Validate ISO 8601 format before parsing
- If timestamp is invalid or missing, log warning and use current datetime as fallback
- Supported formats: ISO 8601 (YYYY-MM-DDTHH:MM:SSZ or YYYY-MM-DDTHH:MM:SS+TZ:TZ)

## Deduplication Rules

When multiple agents raise the same or overlapping finding:

1. **Identify Overlap**: Two findings overlap when they address the same underlying issue, even if worded differently (e.g., Architect flags "missing authentication" and QA flags "no auth test coverage" -- both relate to authentication gaps).
2. **Consolidate**: Merge overlapping findings into a single entry that captures the full scope.
3. **Severity Selection**: Use the highest severity assigned by any agent. If Architect rates an issue as "Critical" and Developer rates it as "Major", the consolidated finding is "Critical".
4. **Attribution**: Note which agents originally raised the finding for traceability.

## Conflict Resolution

When agents provide contradictory recommendations, resolve using domain expertise hierarchy:

| Conflict Domain | Priority Agent | Rationale |
|---|---|---|
| Architecture decisions | Architect | System design is the Architect's core expertise |
| Implementation feasibility | Developer | The Developer best understands what is buildable within constraints |
| Testability and quality | QA | QA specializes in validation and test coverage concerns |
| Cross-cutting concerns | Architect | Architecture-level decisions take precedence for system-wide issues |

When the conflict does not clearly fall into one domain, include both recommendations with a note explaining the trade-off and let the user decide during feedback.

## Output Assembly

Produce the following updated story sections from accepted and synthesized perspectives:

1. **Refined Description**: Incorporate accepted insights into a clearer, more specific story description. Do not simply concatenate agent outputs -- rewrite for coherence.
2. **Merged Acceptance Criteria**: Combine existing acceptance criteria with accepted proposals from agents:
   - Preserve all original acceptance criteria unless explicitly superseded
   - Add new criteria from accepted agent proposals
   - Deduplicate criteria that test the same behavior
   - Ensure every criterion is testable (has a clear pass/fail condition)
3. **Revised Estimation**: Update the estimation based on the Developer's feasibility assessment:
   - Include justification for any estimation change
   - Reference specific findings that impact effort (e.g., "additional auth layer adds complexity")
4. **Ordered Subtask List**: Compile subtasks from all accepted recommendations:
   - Order by dependency (prerequisites first)
   - Add dependency annotations where subtasks depend on each other
   - Include source attribution (which agent proposed each subtask)

# Output Format

The synthesis produces updated sections for the story file following this structure:

```markdown
## Description

[Refined story description incorporating accepted insights]

## Acceptance Criteria

- [ ] [Criterion 1 -- preserved or updated from original]
- [ ] [Criterion 2 -- new from agent proposal, source: Architect]
- [ ] [Criterion 3 -- merged from overlapping QA and Dev proposals]

## Estimation

**Estimate**: [Updated estimate]
**Justification**: [Explanation of estimate, referencing specific findings that impact effort]
**Previous Estimate**: [Original estimate for comparison]

## Subtasks

| # | Subtask | Description | Dependencies | Source |
|---|---------|-------------|--------------|--------|
| 1 | [Subtask name] | [What needs to be done] | None | [Agent] |
| 2 | [Subtask name] | [What needs to be done] | Subtask 1 | [Agent] |
```

The synthesis also updates the `refinement.md` Feedback Record section:

```markdown
## Feedback Record

### User Decisions
- **Architect Perspective**: {accept|reject}
  - Comment: {text}
  - Timestamp: {ISO_8601}
  - User: {name}

- **Developer Perspective**: {accept|reject}
  - Comment: {text}
  - Timestamp: {ISO_8601}
  - User: {name}

- **QA Perspective**: {accept|reject}
  - Comment: {text}
  - Timestamp: {ISO_8601}
  - User: {name}

### Quality Tracking Summary
- **Total Perspectives**: 3
- **Accepted**: {count}
- **Rejected**: {count}
- **Acceptance Rate**: {percentage}%
- **Collection Date**: {ISO_8601_date}
- **User**: {user_name}

### Synthesis Summary

- **Total Findings**: [count]
- **Critical**: [count]
- **Major**: [count]
- **Minor**: [count]

### Accepted Changes

- [Description of accepted change and its impact]

### Deferred Items

- [Description of deferred item and reason for deferral]

### Feedback Notes

- [Stakeholder decisions and rationale]
```

**Quality Tracking Export Format (for future analysis):**
The feedback data can be exported in CSV format for trend analysis:
```csv
agent,decision,comment,timestamp,user,ticket_id
architect,accept,"Good insights",2026-03-25T10:30:00Z,Sami,SW-103
developer,reject,"Too complex",2026-03-25T10:31:00Z,Sami,SW-103
qa,accept,"",2026-03-25T10:32:00Z,Sami,SW-103
```

# Context Rules

## Reads

- `refinement.md` (Feedback Record section) -- User decisions (accept/reject) for each agent perspective with timestamps and comments
- Agent perspectives from refinement workflow -- The perspective tables, recommendations, and proposed acceptance criteria
- Original `story.md` -- The current story file with existing description, acceptance criteria, estimation, and subtasks
- `scrum_workflow/config.yaml` -- Token budget configuration for context window compliance (NFR12) and user identifier

**Feedback Data Structure:**
The synthesis skill reads feedback from refinement.md in this format:
```markdown
### User Decisions
- **Architect Perspective**: {accept|reject}
  - Comment: {text}
  - Timestamp: {ISO_8601}
  - User: {name}
```

## Writes

This skill produces:

- Updated sections for `story.md` -- Refined description, merged acceptance criteria, revised estimation, ordered subtask list
- Complete `refinement.md` with all perspectives and feedback record -- Preserving both accepted and rejected perspectives with the synthesis summary and feedback notes

**Atomic Write Guarantee (AC4 Compliance):**
- The Feedback Record section in refinement.md is preserved as an atomic unit during story updates
- When updating story.md, the refinement.md feedback section remains intact
- Feedback data survives story.md updates because it lives in a separate file (refinement.md)

## Context Window Compliance (NFR12)

The synthesis output MUST fit within the platform's coordination token budget to prevent context window overflow.

**Token Budget Configuration:**
- Read `token_budgets.{platform}.coordination` from `scrum_workflow/config.yaml`
- If config.yaml is missing or token_budgets section doesn't exist, use default budget of 4000 tokens and log warning
- Validate platform identifier: if platform not recognized, default to `claude-code` budget and log warning
- Current platform: `claude-code` with coordination budget of 4000 tokens
- Warn when synthesis output approaches 80% of platform's limit (3200 tokens for claude-code)
- If synthesis would exceed budget, prioritize by severity: Critical > Major > Minor findings

**Preventive Token Counting:**
- BEFORE generating synthesis, estimate output token count based on:
  - Number of accepted perspectives
  - Average finding length (200 tokens per finding)
  - Number of recommendations and proposed criteria
- If estimated count exceeds 80% of budget, apply consolidation strategy BEFORE generation
- Preventive check ensures synthesis never exceeds budget (not reactive)

**Consolidation Strategy (when approaching limit):**
- Preserve Critical findings in full (highest priority)
- Summarize Major findings to 2-3 sentences each
- Consolidate Minor findings into grouped summary by category
- Consolidate recommendations into bullet points without detailed explanations
- Always preserve user feedback record in refinement.md for auditability (exempt from consolidation)

**Validation Strategy:**
- Estimate output token count before generating synthesis
- If approaching limit, consolidate findings and summarize recommendations
- Preserve Critical findings in full, summarize Major and Minor as needed
- Always preserve user feedback record in refinement.md for auditability
