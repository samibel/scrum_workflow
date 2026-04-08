---
stepsCompleted: ['step-01-preflight-and-context']
lastStep: 'step-02-generation-mode'
lastSaved: 2026-04-08T18:56:47+0800
---
# ATDD Checklist: Story 2.3 - Implement Rejection Flow

**Story**: 2.3 - Implement Rejection Flow
**Date**: 2026-04-08
**status**: FAILING (TDD Red phase)

**yolo mode**: Auto-approved

---

## Input Documents
- Story file: /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/2-3-implement-rejection-flow.md
- Architecture doc: /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/architecture.md
- Knowledge fragments: data-factories.md, component-tdd.md, test-quality.md, test-healing-patterns.md

---

## Acceptance Criteria Under Test

1. **Given** FR-6 specifies rejection flow: `review -> changes-needed -> in-progress` **When** a review verdict is `changes-needed` (FR-24) **Then** the story status transitions to `changes-needed` **And** a `status_history` entry is appended with the review agent as actor

2. **Given** a story in `changes-needed` status **When** a developer runs `/scrum-dev-story SW-XXX` **Then** the status transitions to `in-progress` **And** previous review findings (`review-N.md`) are loaded as context for the implementation agent **And** the implementation agent can see what specific issues were flagged
3. **Given** FR-24 specifies review verdict as `approved` or `changes-needed` **When** a review is completed **Then** the review artifact contains a clear verdict field: `approved` or `changes-needed` **And** both outcomes produce a persistent `review-N.md` artifact
4. **Given** a story has been re-implemented after `changes-needed` **When** a developer triggers a new review **Then** the previous review findings are available for comparison **And** the new review can verify whether previous findings were addressed
5. **Given** a story has been re-implemented after `changes-needed` **When** a developer runs `/scrum-dev-story SW-XXX` **Then** the status transitions to `in-progress` **And** previous review findings (`review-N.md`) are loaded as context for the implementation agent **And** the implementation agent receives the review findings with flagged issues clearly.

6. **Given** a story has been re-implemented after `changes-needed` **When** a developer runs `/scrum-dev-story SW-XXX` **Then** the status transitions to `in-progress` **And** previous review findings are available for comparison
**And** the new review can verify whether previous findings were addressed
7. **Given** a story has been re-implemented after `changes-needed` **When** a new review is triggered **Then** the previous review findings are loaded for comparison
**And** the new review can verify whether previous findings were addressed.
8. **Given** FR-6 specifies rejection flow: `review -> changes-needed -> in-progress` **When** a story is in `changes-needed` status **Then** a `status_history` entry is appended with `trigger: /scrum-review-story` and `actor: review-agent`
2. **Given** FR-24 specifies review verdict as `approved` or `changes-needed` **When** a review is completed **Then** the review artifact contains a clear verdict field: `approved` or `changes-needed` **And** both outcomes produce a persistent `review-N.md` artifact
3. **Given** a story in `changes-needed` status **When** a developer runs `/scrum-dev-story SW-XXX` **Then** the status transitions to `in-progress` **And** previous review findings (`review-N.md`) are loaded as context for the implementation agent **And** the implementation agent can see what specific issues were flagged
4. **Given** a story has been re-implemented after `changes-needed` **When** a developer triggers a new review **Then** the previous review findings are available for comparison
**And** the new review can verify whether previous findings were addressed

5. **Given** a story has been re-implemented after `changes-needed` **When** a new review is triggered **Then** the previous review findings are loaded for comparison
**And** the new review can verify whether previous findings were addressed.
6. **Given** a story has been re-implemented after `changes-needed`**When** a developer triggers a new review **Then** the previous review findings are available for comparison
**And** the new review can verify whether previous findings were addressed
7. **Given** a story has been re-implemented after `changes-needed`**When** a developer triggers a new review **Then** the previous review findings are loaded for comparison
**And** the new review can verify whether previous findings were addressed
8. **Given** a story has been re-implemented after `changes-needed` **When** a new review is triggered (not first review) **Then** the review agent loads the previous review findings for comparison
** and** the new review documents which previous findings were addressed

9. **Given** a story has been re-implemented after `changes-needed` **When** a developer runs `/scrum-dev-story` on a story with `changes-needed` status **Then** an error is thrown because status is not `changes-needed` (actionable error required)
10. **Given** a story has `changes-needed` status **When** `/scrum-dev-story` is executed on **Then** the status transitions to `in-progress` **And** the `status_history` entry is appended with `trigger: /scrum-dev-story` and `actor: developer-agent` (or `human`)
11. **Given** a story with `changes-needed` status **When** `/scrum-dev-story SW-XXX` is executed **Then** previous review findings are loaded as context for the implementation agent

**Technical Requirements:**
- **Language:** Markdown with YAML frontmatter
- **Timestamp Format:** ISO 8601 UTC
- **Actor Types:** `human`, `{name}-agent`, `{name}-skill`, `system`
- **Status Transitions:** `review -> changes-needed`, `changes-needed -> in-progress`
