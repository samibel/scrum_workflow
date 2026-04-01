---
name: review-story
trigger: "/scrum-review-story"
requires_status: review
sets_status: "approved | changes-needed"
pattern: ai-assisted-code-review
model_recommendation: "Use a different model than the implementation agent (e.g., if implementation used Claude Sonnet, use Claude Opus or a different model family for review)"
---

## Purpose

Perform unbiased code review using the "AI-Assisted Code Review / Verification" pattern. This review-only agent evaluates implemented code against the story specification, acceptance criteria, and project standards. The agent uses a separate perspective from the implementation agent to catch blind spots and ensure quality.

## Agentic Pattern

**Pattern:** [AI-Assisted Code Review / Verification](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification)

**Key Principles:**
- **Separate Agent for Critique:** The reviewer is NOT the implementer — ensures unbiased perspective
- **Multi-Agent Approach:** One generates, another verifies — catches blind spots
- **Focus on Alignment:** Verify implementation matches specification, not just "looks good"
- **Quality Verification:** Check for completeness, correctness, and adherence to standards

## Workflow Reference

workflows/review-story.md

## Input

Ticket number in the format: `/scrum-review-story SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `_scrum-output/sprints/SW-XXX/story.md` must exist with `status: review`

## Output

### On APPROVED:
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: approved` (atomic write)
- `_scrum-output/sprints/SW-XXX/review-N.md` -- Review report with APPROVED verdict

### On CHANGES-NEEDED:
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: changes-needed` (atomic write)
- `_scrum-output/sprints/SW-XXX/review-N.md` -- Review report with CHANGES-NEEDED verdict and findings

## Review Criteria

The agent evaluates the implementation against these criteria:

| # | Criterion | What to Check |
|---|----------|---------|
| 1 | Specification Alignment | Code matches story specification (no extra features, no missing features) |
| 2 | Acceptance Criteria | All acceptance criteria are satisfied by implementation |
| 3 | Test Coverage | Adequate test coverage for the changes |
| 4 | Code Standards | Code follows project standards from `context/standards.md` |
| 5 | Architecture Compliance | Implementation follows architecture patterns from Dev Notes |

## Status Transitions

```
review → approved         (via /scrum-review-story, verdict: APPROVED)
review → changes-needed   (via /scrum-review-story, verdict: CHANGES-NEEDED)
```

## Severity Levels

| Severity | Definition | Examples |
|----------|------------|----------|
| **Critical** | Blocks story completion, severe defect | Security vulnerability, data corruption risk, core feature missing |
| **Major** | Impacts quality, not blocking | Architecture violation, missing error handling, incomplete feature |
| **Minor** | Style, optimization, non-essential | Naming convention violation, minor optimization, edge case |

## Relationship to Other Epic 11 Commands

**Important:** This is a review-only command that runs AFTER implementation.

| Command | Purpose | Status Transition | Pattern |
|---------|---------|-------------------|---------|
| `/scrum-refine-ticket` | Multi-agent refinement | `draft` → `refinement` | Sub-Agent Spawning |
| `/scrum-refine-story` | Validation-only agent | `refinement` → `ready-for-dev` | Feature List as Immutable Contract |
| `/scrum-dev-story` | Implementation-only agent | `ready-for-dev` → `review` | Inversion of Control |
| `/scrum-review-story` | Review-only agent | `review` → `approved` or `changes-needed` | AI-Assisted Code Review |

**Typical Workflow:**
1. User runs `/scrum-dev-story SW-XXX` to implement (one agent/model)
2. Status moves from `ready-for-dev` → `review`
3. User runs `/scrum-review-story SW-XXX` to review (different agent/model)
4. Status moves from `review` → `approved` or `changes-needed`
5. If `changes-needed`, developer addresses findings and re-runs `/scrum-review-story`

## Model Selection Recommendation

**Important:** For best results, use a DIFFERENT model than the one that implemented the story.

**Rationale:**
- Different models have different blind spots
- Reduces groupthink and confirmation bias
- Fresh perspective catches issues the implementer missed
- Example: If implementation used Claude Sonnet, review could use Claude Opus or a different model family

## Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/review-N.md` - Review report (NEW file)
- `_scrum-output/sprints/SW-XXX/story.md` - Status field only (`status: approved` or `status: changes-needed`)

This workflow may NOT write:
- `_scrum-output/sprints/SW-XXX/plan.md` - Read-only during review
- `_scrum-output/sprints/SW-XXX/refinement.md` - Read-only during review
- `_scrum-output/sprints/SW-XXX/approval.md` - Managed by approval workflow
- Code files in project directory - Review is read-only for code
- `scrum_workflow/` - Framework files are read-only during execution
