---
name: refine-ticket
trigger: "/scrum-refine-ticket"
requires_status: draft
sets_status: "refinement → refined"
spawns_agents:
  - architect      # Only if depth: standard
  - developer      # Always
  - qa             # Only if depth: standard
features:
  doc_discovery: true   # Always enabled
  discussion_rounds: true # Disabled if depth: light
  estimation: true        # Disabled if depth: light (uses single estimate instead)
depth_conditional: true   # Workflow adapts based on story frontmatter depth field
---

## Purpose

Orchestrate multi-agent refinement for a story by spawning specialized agent perspectives (Architect, Developer, QA for `depth: standard`; Developer only for `depth: light`). Each agent analyzes the story from their expert viewpoint with isolated context, producing focused findings on architectural risks, technical feasibility, and testability. The command updates the story status from `draft` to `refinement` and (for standard depth) presents all perspectives for user feedback before proceeding to synthesis.

**Light Depth**: Single Developer perspective. No cross-talk, no synthesis, single agent estimate. Ready for validation immediately.

**Standard Depth**: Three perspectives (Architect, Developer, QA) with cross-talk rounds, synthesis, and Wideband Delphi estimation.

## Workflow Reference

workflows/refinement.md

## Input

Ticket number in the format: `/scrum-refine-ticket SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `_scrum-output/sprints/SW-XXX/story.md` must exist with `status: draft`

### Workflow Depth Override

The refinement workflow adapts based on `depth` field in story frontmatter:

| Aspect | `depth: light` | `depth: standard` (default) |
|--------|---------------|---------------------------|
| Agents | 1 (Developer only) | 3 (Architect, Developer, QA) |
| Cross-talk | Disabled | Enabled (up to 3 rounds) |
| Synthesis | Disabled (single perspective = final) | Enabled |
| Estimation | Single agent estimate | Wideband Delphi |

**Detection**: Read `depth` from story frontmatter at workflow start. If `depth` field is missing or invalid, treat as `standard`.

## Output

**Standard Depth (depth: standard):**
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: refined` on completion, `updated: <today>` (ISO 8601 format), and synthesized content from accepted perspectives using atomic write operation (NFR1 compliance)
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Refinement audit file containing all agent perspectives (accepted and rejected), user feedback decisions in NFR16-compliant separated section, discussion rounds documentation, and synthesis summary
- Three agent perspectives displayed to the user (Architect, Developer, QA), each following the table-based output format defined in Architecture Pattern 3
- Each agent perspective includes Findings table, Recommendations, and Proposed Acceptance Criteria
- User prompted to accept or reject each perspective individually
- Accepted perspectives merged into story via direct synthesis skill invocation (not sub-agent spawning) (see `skills/synthesis/SKILL.md`)
- If all perspectives rejected, original story preserved with log entry in refinement.md
- Synthesis includes deduplication and conflict resolution applied per synthesis skill rules
- Token budget validated preventively before synthesis generation (NFR12 compliance)
- Status transitions: `draft` → `refinement` (on start) → `refined` (on completion)

**Light Depth (depth: light):**
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: refined` on completion, `updated: <today>` (ISO 8601 format), and Developer perspective content using atomic write operation (NFR1 compliance)
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Refinement audit file containing Developer perspective only
- Single Developer perspective displayed to the user
- Single agent estimate recorded (no Wideband Delphi)
- No cross-talk rounds, no synthesis step
- Story is ready for validation immediately after perspective acceptance
- Status transitions: `draft` → `refinement` (on start) → `refined` (on completion)

### Doc Discovery (Story 10.1)

Prompt user for additional documents (file paths or URLs) to include in agent context. Auto-detected context from `_scrum-output/context/` is always included.

### Discussion Rounds (Story 10.2)

**Note: Discussion rounds are only enabled for `depth: standard` stories.**

Multi-round cross-talk between agents where they:
- See and comment on each other's perspectives
- Identify agreements, disagreements, and blind spots
- Classify disagreements as blockers or non-blockers
- Security issues are automatically marked as blockers
- Early exit when all blockers resolved

Progressive truncation: 400 → 300 → 200 words per round (configurable via `refinement_max_rounds` in config.yaml, default: 3)

**For `depth: light`:** Skip discussion rounds entirely. Single Developer perspective is final.

### Estimation (Story 10.3)

**Note: Wideband Delphi estimation is only enabled for `depth: standard` stories.**

Wideband Delphi estimation with variance threshold checking (default: 2 points).

**For `depth: light`:** Use single Developer agent estimate only. No cross-agent estimation rounds.

## Configuration

The following settings can be configured in `config.yaml`:

- `refinement_max_rounds`: Maximum cross-talk rounds before escalation (default: 3)
- `keep_agent_temp_files`: Keep temp files after synthesis for debugging (default: false)
- `estimation_variance_threshold`: Variance threshold for re-estimation (default: 2)
- `early_exit_on_consensus`: Exit early when only non-blockers remain (default: true)
- `security_auto_blocker`: Force security issues as blockers (default: true)

## Error Handling

### Story File Not Found

If the story file does not exist:

```
❌ Status Guard Violation: Story file '_scrum-output/sprints/SW-XXX/story.md' not found

**Details:** The /scrum-refine-ticket command requires an existing story file to process. No file was found at the expected path.

**Next Step:** Run '/scrum-create-ticket SW-XXX' to create the story file first, then re-run '/scrum-refine-ticket SW-XXX'.
```

### Status Guard Violation

If story is not in `draft` status:

```
❌ Status Guard Violation: Story SW-XXX requires 'draft' but is currently '{current_status}'

**Details:** The /scrum-refine-ticket command can only execute on stories in 'draft' status. This story has already progressed past the drafting phase.

**Next Step:** Check the current status and run the appropriate next command. If the story needs re-refinement, manually set status back to 'draft' first (use with caution).
```

## Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/story.md` - Status transitions (`draft` → `refinement` → `refined`) and synthesized content from accepted perspectives ONLY; MUST NOT modify story acceptance criteria independently
- `_scrum-output/sprints/SW-XXX/refinement.md` - Refinement audit file (new file)

This workflow may NOT write:
- `_scrum-output/sprints/SW-XXX/plan.md` - MUST NOT write plan.md — that belongs to `/scrum-refine-story`
- `_scrum-output/sprints/SW-XXX/review-*.md` - Managed by `/scrum-review-story`
- `_scrum-output/sprints/SW-XXX/approval-N.md` - Managed by `/scrum-approve`
- Source code files in project directory - No code changes during refinement
- `scrum_workflow/` - Framework files are read-only during execution

### Anti-Pattern Warning

**Bounded Authority Violation:** This command MUST NOT modify story.md content beyond status transitions and synthesized perspectives from accepted agent views. MUST NOT write plan.md — that belongs to `/scrum-refine-story`.

If a write boundary would be violated, halt with:
```
❌ Write Boundary Violation: /scrum-refine-ticket attempted to write '{file_path}'

**Details:** The /scrum-refine-ticket command may only write refinement.md and story.md status/synthesis updates. Attempted write target is outside the allowed boundary.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```
