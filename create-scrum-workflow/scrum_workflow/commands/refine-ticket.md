---
name: refine-ticket
trigger: "/scrum-refine-ticket"
requires_status: draft
sets_status: refinement
spawns_agents:
  - architect
  - developer
  - qa
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
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Refinement audit file containing all agent perspectives (accepted and rejected), user feedback decisions in NFR16-compliant separated section, and synthesis summary
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
