---
name: refine-ticket
trigger: "/scrum-refine-ticket"
requires_status: draft
sets_status: refinement
spawns_agents:
  - architect
  - developer
  - qa
features:
  doc_discovery: true
  discussion_rounds: true
  estimation: true
---

## Purpose

Orchestrate multi-agent refinement for a story by spawning three specialized agent perspectives (Architect, Developer, QA) in parallel. Each agent analyzes the story from their expert viewpoint with isolated context, producing focused findings on architectural risks, technical feasibility, and testability. The command updates the story status from `draft` to `refinement` and presents all three perspectives for user feedback before proceeding to synthesis.

## Workflow Reference

workflows/refinement.md

## Input

Ticket number in the format: `/scrum-refine-ticket SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `_scrum-output/sprints/SW-XXX/story.md` must exist with `status: draft`

## Output

- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: ready` (on readiness check PASS) or `status: draft` (on readiness check FAIL), `updated: <today>` (ISO 8601 format), and synthesized content from accepted perspectives using atomic write operation (NFR1 compliance)
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Refinement audit file containing all agent perspectives (accepted and rejected), user feedback decisions in NFR16-compliant separated section, discussion rounds documentation, and synthesis summary
- `_scrum-output/sprints/SW-XXX/plan.md` -- Execution plan created on readiness check PASS (subtasks, execution order, dependencies)
- Three agent perspectives displayed to the user (Architect, Developer, QA), each following the table-based output format defined in Architecture Pattern 3
- Each agent perspective includes Findings table, Recommendations, and Proposed Acceptance Criteria
- User prompted to accept or reject each perspective individually
- Accepted perspectives merged into story via direct synthesis skill invocation (not sub-agent spawning) (see `skills/synthesis/SKILL.md`)
- If all perspectives rejected, original story preserved with log entry in refinement.md
- Synthesis includes deduplication and conflict resolution applied per synthesis skill rules
- Token budget validated preventively before synthesis generation (NFR12 compliance)
- **Readiness check** validates story completeness and produces PASS/FAIL result with specific failure reasons (FR15, FR16)
- **On PASS**: story status updated to `ready`, plan.md assembled from synthesized subtasks
- **On FAIL**: story status reverted to `draft`, failure reasons documented in story.md

### Doc Discovery (Story 10.1)

Prompt user for additional documents (file paths or URLs) to include in agent context. Auto-detected context from `_scrum-output/context/` is always included.

### Discussion Rounds (Story 10.2)

Multi-round cross-talk between agents where they:
- See and comment on each other's perspectives
- Identify agreements, disagreements, and blind spots
- Classify disagreements as blockers or non-blockers
- Security issues are automatically marked as blockers
- Early exit when all blockers resolved

Progressive truncation: 400 → 300 → 200 words per round (configurable via `refinement_max_rounds` in config.yaml, default: 3)

### Estimation (Story 10.3)

Wideband Delphi estimation with variance threshold checking (default: 2 points).

## Configuration

The following settings can be configured in `config.yaml`:

- `refinement_max_rounds`: Maximum cross-talk rounds before escalation (default: 3)
- `keep_agent_temp_files`: Keep temp files after synthesis for debugging (default: false)
- `estimation_variance_threshold`: Variance threshold for re-estimation (default: 2)
- `early_exit_on_consensus`: Exit early when only non-blockers remain (default: true)
- `security_auto_blocker`: Force security issues as blockers (default: true)
