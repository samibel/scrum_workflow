# Deferred Work

## Deferred from: code review of story 1-1-verify-align-ticket-creation (2026-04-07)

- Step 3.1 of `scrum_workflow/workflows/ticket-creation.md` returns an error when project context is missing, but Step 0.1 treats context as optional and only warns. These two steps contradict each other. One should be aligned to match the other (likely Step 3.1 should warn instead of error, consistent with Step 0.1).

## Deferred from: code review of 1-8-verify-align-research-commands (2026-04-07)

- Step 0.4 appears before Step 0.3 in both `research-technical.md` and `research-general.md` workflow files. Pre-existing step ordering issue; cosmetic only, does not affect runtime behavior.

## Deferred from: code review of 1-9-verify-align-artifact-contract (2026-04-07)

- Sprint status lifecycle skip: story 1.9 moved directly from `backlog` → `review` without going through `ready-for-dev` and `in-progress` intermediate states. This is a brownfield verification story authored directly without a standard dev cycle. Pre-existing process deviation; no runtime impact.

## Deferred from: code review of 3-3-implement-write-boundary-enforcement (2026-04-08)

- `workflows/approval.md` Steps 1.x, 2.x, 4.x, 5.x, and 6.1 reference old `approval.md` artifact filename (not `approval-N.md`) and Steps 1.1-1.3 use old `Error:` prefix format. Only Step 6.3 was updated by Story 3.3 (Task 5.3). Full standardization of all approval.md workflow error messages and artifact references is deferred to a future story.
- `create-scrum-workflow/scrum_workflow/commands/dev-story.md` and `create-scrum-workflow/templates/scrum_workflow/commands/dev-story.md` have outdated guard condition content (requires_status: `ready-for-dev` only, missing `changes-needed` support added in a prior story). Write Boundary Rules section was added by this review; full guard condition alignment is pre-existing from Story 2.x and deferred.
