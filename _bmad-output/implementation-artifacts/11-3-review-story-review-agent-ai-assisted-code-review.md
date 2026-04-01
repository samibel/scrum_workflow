# Story 11.3: scrum-review-story — Review Agent (AI-Assisted Code Review)

Status: approved

## Story

As a developer,
I want a dedicated review agent that evaluates implemented code against the story specification,
So that I get unbiased review from a different perspective and can choose a different model for review.

## Context

This is Story 11.3 of Epic 11: Agent Pattern Split. The epic splits the monolithic dev-story workflow into three focused agents following agentic patterns from [agentic-patterns.com](https://www.agentic-patterns.com/patterns). Each agent applies a single pattern for maximum focus and enables per-step model selection.

**Epic Goal:** After this epic, the monolithic dev-story workflow is split into three focused agents:
1. **scrum-refine-story** — Validation agent using "Feature List as Immutable Contract" pattern (Story 11.1)
2. **scrum-dev-story** — Simplified implementation agent using "Inversion of Control" pattern (Story 11.2)
3. **scrum-review-story** — Review agent using "AI-Assisted Code Review / Verification" pattern (THIS STORY)

**Story Dependency Map:**
- Stories 11.1, 11.2, and 11.3 can be worked in **parallel** (no dependencies)
- All three stories should be completed together for full workflow

## Acceptance Criteria

### AC1: Command File Created
**Given** a story file exists with `status: review`
**When** the user runs `/scrum-review-story SW-XXX`
**Then** `scrum_workflow/commands/review-story.md` exists in SKILL.md command format with:
- `trigger: /scrum-review-story`
- `requires_status: review`
- `sets_status: approved | changes-needed`

### AC2: Workflow File Created
**Given** the command file exists
**When** the workflow is created
**Then** `scrum_workflow/workflows/review-story.md` exists with review workflow containing:
- Load story with `status: review`
- Load implemented code changes
- Evaluate against story specification and acceptance criteria
- Produce review report with verdict
- Set status: `approved` or `changes-needed`

### AC3: Multi-Agent Verification Pattern Applied
**Given** the review workflow runs
**When** the agent evaluates implementation
**Then** the agent follows the AI-Assisted Code Review pattern:
- Separate agent for critique (NOT the implementer)
- Multi-agent approach: one generates, another verifies
- Focus on alignment with specification and quality

### AC4: Specification Alignment Check
**Given** the review agent reads implemented code
**When** evaluating against specification
**Then** the agent evaluates:
- Code matches story specification (no extra features, no missing features)
- All acceptance criteria are satisfied
- Test coverage is adequate for the changes
- Code follows project standards from `context/standards.md`

### AC5: Review Report Generated
**Given** evaluation completes
**When** the agent produces output
**Then** the agent produces a review report in `sprints/SW-XXX/review-N.md`:
- Summary table (Total findings, by severity)
- Findings table (ID, Description, Severity, AC Reference, File:Line, Suggested Fix)
- Verdict: APPROVED or CHANGES-NEEDED

### AC6: Status Update on Approval
**Given** verdict is APPROVED
**When** the agent completes review
**Then** `story.md` status is updated to `approved`

### AC7: Status Update on Changes Needed
**Given** verdict is CHANGES-NEEDED
**When** the agent completes review
**Then** `story.md` status is updated to `changes-needed`

### AC8: Write Boundaries Enforced
**Given** the review workflow
**When** writing files
**Then** the agent writes ONLY:
- `review-N.md` (review report)
- `story.md` (status field only)

### AC9: Different Model Recommendation
**Given** the SKILL.md frontmatter
**When** the command is defined
**Then** the review agent includes a recommendation to use a different model than the implementation agent (documented in SKILL.md frontmatter)

## Tasks / Subtasks

- [x] Task 1: Create command file `scrum_workflow/commands/review-story.md` (AC: 1, 9)
  - [x] 1.1 Create SKILL.md format file with YAML frontmatter
  - [x] 1.2 Define trigger as `/scrum-review-story`
  - [x] 1.3 Set `requires_status: review`
  - [x] 1.4 Set `sets_status: approved | changes-needed`
  - [x] 1.5 Add model recommendation for using different model than implementer
  - [x] 1.6 Add purpose description emphasizing unbiased external review

- [x] Task 2: Create workflow file `scrum_workflow/workflows/review-story.md` (AC: 2, 3, 4)
  - [x] 2.1 Define review workflow steps: Load → Analyze → Evaluate → Report → Set Status
  - [x] 2.2 Implement story loading with status validation
  - [x] 2.3 Implement code change detection and loading
  - [x] 2.4 Implement specification alignment evaluation
  - [x] 2.5 Implement acceptance criteria verification
  - [x] 2.6 Implement test coverage assessment

- [x] Task 3: Implement review report generation (AC: 5)
  - [x] 3.1 Create summary table with finding counts by severity
  - [x] 3.2 Create findings table with all required columns
  - [x] 3.3 Implement severity assignment (Critical, Major, Minor)
  - [x] 3.4 Implement AC reference mapping for each finding
  - [x] 3.5 Implement suggested fix generation
  - [x] 3.6 Implement verdict determination logic

- [x] Task 4: Implement status transitions (AC: 6, 7)
  - [x] 4.1 Implement status update to `approved` on APPROVED verdict
  - [x] 4.2 Implement status update to `changes-needed` on CHANGES-NEEDED verdict
  - [x] 4.3 Ensure atomic write operations (NFR1)

- [x] Task 5: Implement write boundaries (AC: 8)
  - [x] 5.1 Define allowed writes: review-N.md, story.md (status only)
  - [x] 5.2 Define read-only files: plan.md, refinement.md, code files
  - [x] 5.3 Implement boundary validation

## Dev Notes

### Agentic Pattern: AI-Assisted Code Review / Verification

**Pattern Source:** [AI-Assisted Code Review / Verification](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification)

**Key Principles:**
1. **Separate Agent for Critique:** The reviewer is NOT the implementer — ensures unbiased perspective
2. **Multi-Agent Approach:** One generates, another verifies — catches blind spots
3. **Focus on Alignment:** Verify implementation matches specification, not just "looks good"
4. **Quality Verification:** Check for completeness, correctness, and adherence to standards

**How This Applies:**
- User runs `/scrum-dev-story SW-XXX` to implement (one agent/model)
- User runs `/scrum-review-story SW-XXX` to review (different agent/model)
- The review agent reads story.md + implemented code
- The review agent evaluates against acceptance criteria and standards
- The review agent produces findings with severity and suggested fixes
- The review agent sets verdict: APPROVED or CHANGES-NEEDED
- Different model for review reduces blind spots and groupthink

### Relationship to Other Epic 11 Commands

| Command | Purpose | Status Transition | Pattern |
|---------|---------|-------------------|---------|
| `/scrum-refine-ticket` | Multi-agent refinement | `draft` → `refinement` | Sub-Agent Spawning |
| `/scrum-refine-story` | Validation-only agent | `refinement` → `ready-for-dev` | Feature List as Immutable Contract |
| `/scrum-dev-story` | Implementation-only agent | `ready-for-dev` → `review` | Inversion of Control |
| `/scrum-review-story` | Review-only agent | `review` → `approved` or `changes-needed` | AI-Assisted Code Review |

### Full Workflow After Epic 11

```
draft → refinement → refined → ready-for-dev → in-progress → review → approved/changes-needed
              ↑              ↑               ↑            ↑
        /refine-ticket  /refine-story   /dev-story  /review-story
```

### Review Severity Levels

| Severity | Definition | Examples |
|----------|------------|----------|
| **Critical** | Blocks story completion, severe defect | Security vulnerability, data corruption risk, core feature missing |
| **Major** | Impacts quality, not blocking | Architecture violation, missing error handling, incomplete feature |
| **Minor** | Style, optimization, non-essential | Naming convention violation, minor optimization, edge case |

### Review Report Format

```markdown
## Review Report

**Story:** SW-XXX
**Date:** YYYY-MM-DD
**Review Number:** N
**Verdict:** APPROVED / CHANGES-NEEDED

### Summary

| Total | Critical | Major | Minor |
|-------|----------|-------|-------|
| X     | X        | X     | X     |

### Findings

| # | Finding | Severity | AC Reference | File:Line | Suggested Fix |
|---|---------|----------|--------------|-----------|---------------|
| 1 | [description] | Critical/Major/Minor | AC-X | file.ext:42 | [fix] |

### Verdict Rationale
[Explanation of why APPROVED or CHANGES-NEEDED]
```

### Project Structure Notes

**Files to Create:**
```
scrum_workflow/
├── commands/
│   └── review-story.md         # NEW: review command
└── workflows/
    └── review-story.md         # NEW: review workflow
```

**Existing Files to Reference:**
- `scrum_workflow/commands/refine-story.md` - Validation command (Story 11.1) - for format reference
- `scrum_workflow/workflows/review.md` - Existing review workflow - for content reference
- `scrum_workflow/templates/review.md` - Review template - for report format
- `scrum_workflow/workflows/development.md` - Dev workflow - to understand what comes before
- `scrum_workflow/context/standards.md` - Project standards (for review criteria)

### Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/review-N.md` - Review report (NEW file)
- `_scrum-output/sprints/SW-XXX/story.md` - Status field only (`status: approved` or `status: changes-needed`)

This workflow may NOT write:
- `_scrum-output/sprints/SW-XXX/plan.md` - Read-only during review
- `_scrum-output/sprints/SW-XXX/refinement.md` - Read-only during review
- `_scrum-output/sprints/SW-XXX/approval.md` - Managed by approval workflow
- Code files in project directory - Review is read-only for code
- `scrum_workflow/` - Framework files are read-only during execution

### Model Selection Recommendation

**Important:** The review agent should ideally use a DIFFERENT model than the implementation agent. This is documented in the SKILL.md frontmatter recommendation.

**Rationale:**
- Different models have different blind spots
- Reduces groupthink and confirmation bias
- Fresh perspective catches issues the implementer missed
- Example: If implementation used Claude Sonnet, review could use Claude Opus or a different model family

### State Machine Impact

This story introduces two new status values: `approved` and `changes-needed`:

**Updated State Transitions:**
```
review → approved      (via /scrum-review-story, verdict: APPROVED)
review → changes-needed (via /scrum-review-story, verdict: CHANGES-NEEDED)
```

**Note:** Story 11.4 will update the state machine documentation to reflect this new flow.

### References

- [Agentic Patterns: AI-Assisted Code Review / Verification](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification) [Source: Epic 11 story definition]
- [Architecture Decision 3: Story File Schema & State Machine](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/planning-artifacts/architecture.md#decision-3-story-file-schema--state-machine) [Source: architecture.md]
- [PRD: Review Requirements FR21-26](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/planning-artifacts/prd.md) [Source: prd.md]
- [scrum_workflow/workflows/review.md](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/workflows/review.md) [Source: existing review workflow]
- [scrum_workflow/templates/review.md](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/templates/review.md) [Source: review template]
- [Story 11.1: Validation Agent](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/11-1-refine-story-validation-agent-feature-list-as-immutable-contract.md) [Source: sibling story]
- [Story 11.2: Implementation Agent](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/11-2-dev-story-simplified-implementation-agent-inversion-of-control.md) [Source: sibling story]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

None required - implementation will follow established patterns from Stories 11.1 and 11.2.

### Completion Notes List

- Created `scrum_workflow/commands/review-story.md` with SKILL.md format
- Created `scrum_workflow/workflows/review-story.md` with 6-step review workflow
- Implemented AI-Assisted Code Review pattern (separate agent, multi-agent verification)
- Implemented severity-based findings with AC reference mapping
- Implemented verdict determination (APPROVED / CHANGES-NEEDED)
- Implemented status transitions (review → approved or changes-needed)
- Implemented write boundaries (review-N.md + story.md status only)
- Added model selection recommendation in SKILL.md frontmatter
- All 5 tasks and 17 subtasks completed successfully
- Workflow follows established patterns from refine-story.md (Story 11.1) and review.md
- Write boundary rules clearly enforced in both command and workflow files
- Severity levels defined: Critical (blocks), Major (quality impact), Minor (style/optimization)

### Review Findings

**Review Date:** 2026-04-01
**Review Mode:** YOLO (auto-approve, auto-fix)

#### Patched Issues (Auto-fixed)

- [x] [Review][Patch] Missing error handling for missing template file [scrum_workflow/workflows/review-story.md:20-21] — Added warning log guidance for missing template
- [x] [Review][Patch] N > 1 vs N >= 2 clarity issue [scrum_workflow/workflows/review-story.md:78] — Clarified logic: N=1 means first review, no previous context
- [x] [Review][Patch] Test coverage guidance for non-test stories [scrum_workflow/workflows/review-story.md:161-162] — Added guidance for documentation-only stories

#### Deferred Issues (Pre-existing)

- [x] [Review][Defer] Inconsistent prerequisite status vs existing review.md — deferred, pre-existing. Story 11.4 will address state machine documentation
- [x] [Review][Defer] Missing deprecation note for existing review.md — deferred, pre-existing. Requires broader Epic 11 migration discussion

### File List

- scrum_workflow/commands/review-story.md (NEW)
- scrum_workflow/workflows/review-story.md (NEW)
