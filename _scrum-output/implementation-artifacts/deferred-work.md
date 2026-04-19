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

## Deferred from: code review of 6-3-implement-interactive-prompt-patterns (2026-04-08)

- Singleton spinner instance in `progress.js` line 24 (`const s = spinner()`). Calling `progress.start()` while a spinner is already running could cause visual issues. Pre-existing from Story 6.2 -- not introduced by Story 6.3.

## Deferred from: code review of 6-4-implement-zero-config-installation-flow (2026-04-08)

- `.github` marker directory is too broad for `github-copilot` detection in `platform-detector.js`. Most git repos have `.github/` for CI workflows and issue templates, causing false positives. The platform-registry.yaml specifies `target_dir: .github/skills`, so detection should ideally check for `.github/skills/` or `.github/copilot/` instead. Pre-existing design decision from story spec -- deferred to a future refinement.

## Deferred from: code review of 9-2-implement-adaptive-workflow-depth-selection (2025-07-11)

- `create-scrum-workflow/templates/scrum_workflow/templates/story.md` is missing fields present in `scrum_workflow/templates/story.md`: `type`, `risk_level`, `domain_tags`, `status_history`, and has `schema_version: 1` instead of `"1.0.0"`. Story 9.2 correctly synced its own additions (`depth`, `depth_source`), but the other field gaps are pre-existing from earlier stories (9.1, 2.1, etc.). Full template sync should be addressed in a future story or maintenance task.
