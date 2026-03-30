# Story 7.8: Incremental Update Mode for Architecture Documentation

Status: done

## Story

As a developer,
I want to update existing architecture documentation incrementally when my code changes,
So that my architecture docs stay in sync without regenerating everything from scratch.

## Acceptance Criteria

1. **Scan state file reading**: When `/scrum-create-architecture-docs --update` is run, the workflow reads `docs/generated/.arch-scan-state.json` to determine which files were previously scanned and their timestamps/hashes (FR79)

2. **Changed file identification**: The agent identifies files that have been modified since the last scan by comparing current file timestamps/hashes against the stored state (FR77)

3. **Incremental re-analysis**: The agent re-analyzes ONLY the changed files — not the entire codebase

4. **Diff comparison**: The agent compares new findings against existing documentation content

5. **Diff summary presentation**: The agent presents a diff summary to the user before writing: "Changed architecture components: +2 new endpoints, ~1 modified service, -1 removed middleware"

6. **User confirmation required**: The user must confirm the update before any docs are modified: "Apply these changes? [y/N]"

7. **Incremental document updates**: If confirmed, the agent updates the relevant sections in the affected documents while preserving unchanged sections

8. **Scan state update**: After successful update, the agent updates `.arch-scan-state.json` with new timestamps/hashes

9. **No changes handling**: If no changes are detected, the agent reports: "No architecture changes detected since last scan."

10. **Fallback to full-scan**: If `.arch-scan-state.json` does not exist, the agent falls back to full-scan mode with a warning: "No previous scan state found. Running full scan."

## Tasks / Subtasks

- [x] Task 1: Verify Update Mode workflow implementation (AC: #1, #2, #3, #4, #5, #6, #7, #8, #9, #10)
  - [x] 1.1: Verify `scrum_workflow/workflows/architecture-documentation.md` Step 5 exists with all 6 subsections
  - [x] 1.2: Verify Step 5.1 (Load Existing Scan State) includes state file existence check and fallback logic
  - [x] 1.3: Verify Step 5.2 (Identify Changed Files) includes hash comparison and new/deleted file detection
  - [x] 1.4: Verify Step 5.3 (Re-Analyze Changed Areas) specifies architect-doc agent invocation with changed files focus
  - [x] 1.5: Verify Step 5.4 (Present Diff Summary) specifies diff format (+new, ~modified, -removed)
  - [x] 1.6: Verify Step 5.5 (Update Docs Upon Confirmation) includes user confirmation prompt and rollback logic
  - [x] 1.7: Verify Step 5.6 (Update Scan State) includes atomic temp file pattern and error handling
  - [x] 1.8: Verify architect-doc agent Instructions section includes incremental analysis guidance (Instruction #10)

- [x] Task 2: Verify mode detection in workflow (AC: #1)
  - [x] 2.1: Verify Step 0 (Mode Detection) correctly detects `--update` flag
  - [x] 2.2: Verify update mode routes to Step 5 instead of Step 4
  - [x] 2.3: Verify fallback to full-scan when state file missing

- [x] Task 3: Verify scan state file format (AC: #1, #8)
  - [x] 3.1: Verify Step 4.6 (Full-Scan State Persistence) defines complete state structure
  - [x] 3.2: Verify state file includes: scan_date, scan_mode, files_scanned (array), documents_generated, documents_skipped, scan_duration, scan_status
  - [x] 3.3: Verify files_scanned array structure: {path, hash, timestamp}
  - [x] 3.4: Verify atomic write pattern using temp file

- [x] Task 4: Verify user interaction flows (AC: #5, #6, #9)
  - [x] 4.1: Verify diff summary format matches AC specification
  - [x] 4.2: Verify user confirmation prompt "Apply these changes? [y/N]"
  - [x] 4.3: Verify "No changes detected" message when appropriate
  - [x] 4.4: Verify HALT on user decline (N/n input)

- [x] Task 5: Verify error handling and rollback (AC: #7)
  - [x] 5.1: Verify rollback logic if documentation write fails
  - [x] 5.2: Verify scan state is NOT updated on documentation failure
  - [x] 5.3: Verify error message: "Documentation update failed. Partial changes may exist."

- [x] Task 6: Create ATDD test checklist (if required by BMAD process)
  - [x] 6.1: Create `_bmad-output/test-artifacts/atdd-checklist-7-8.md`
  - [x] 6.2: Map each AC to test scenarios
  - [x] 6.3: Define validation criteria for each test

## Dev Notes

### Architecture Compliance

- **Three-Layer Separation**: The workflow file (`architecture-documentation.md`) is in Framework Layer (`scrum_workflow/workflows/`). The architect-doc agent is in Framework Layer (`scrum_workflow/agents/`). Output state file goes in State Layer (`docs/generated/.arch-scan-state.json`).
- **Incremental Analysis**: Language-agnostic file change detection using SHA-256 hashes, not language-specific AST parsing (FR78).
- **Atomic State Updates**: State file MUST use temp file pattern to prevent corruption on write failure (Story 7.2, Step 5.6).
- **Rollback on Failure**: If documentation update fails, partial changes must be rolled back and scan state must NOT be updated (Story 7.2, Step 5.5).
- **Separate State Files**: Architecture scan state (`.arch-scan-state.json`) is separate from Epic 6's business logic scan state (`.scan-state.json`). The two agents manage independent state.

### Project Structure Notes

- **Workflow location**: `scrum_workflow/workflows/architecture-documentation.md` (VERIFY - should already exist from Story 7-2)
- **Agent location**: `scrum_workflow/agents/architect-doc.md` (VERIFY - should already exist from Story 7-1)
- **State file location**: `docs/generated/.arch-scan-state.json` (generated when workflow runs, NOT in Framework Layer)
- **Documentation output**: `docs/generated/` directory with 5 architecture documents

### Testing Standards

- **ATDD Required**: Create test checklist mapping AC to validation scenarios
- **Workflow Validation**: Verify workflow steps exist and are correctly ordered
- **Agent Validation**: Verify architect-doc agent has incremental analysis instructions
- **State File Validation**: Verify state file structure and atomic write pattern
- **User Interaction Validation**: Verify confirmation prompts and error handling

### Previous Story Intelligence (Story 7-3)

**CRITICAL CODE REVIEW FINDING FROM STORY 7-3:**

The Story 7-3 implementation had a **critical bug** discovered during code review:
- **Bug**: Template was created at `templates/backend-architecture.md` (root level) instead of `scrum_workflow/templates/backend-architecture.md`
- **Impact**: This violated AC1 and would have prevented the template from being deployed by the installer
- **Fix Applied**: Moved file to correct location and added to git tracking

**ACTION REQUIRED FOR STORY 7-8:**
- Story 7-8 is a VERIFICATION story (no new files created)
- Only VERIFY existing workflow and agent files
- DO NOT create new templates or agents

**Story 7-3 Pattern Reference:**
- Story 7-3 created `backend-architecture.md` template with backend component patterns
- Story 7-4 created `frontend-architecture.md` template with frontend component patterns
- Story 7-5 created `devops-architecture.md` template with DevOps component patterns
- Story 7-6 created `local-dev-environment.md` template with local dev component patterns
- Story 7-8 is DIFFERENT: verifies Update Mode functionality (not template creation)

**Story 7-7 Skipped (per original plan):**
- Story 7-7 (Testing Architecture) is skipped in this execution run
- Testing template creation would follow same pattern as Stories 7-3 to 7-6

**Story 7-2 Intelligence (Workflow Skeleton):**
- Command: `scrum_workflow/commands/create-architecture-docs.md`
- Workflow: `scrum_workflow/workflows/architecture-documentation.md` with Steps 0-7
- Step 5 is Update Mode Orchestration with 6 subsections (5.1 through 5.6)
- All subsections already implemented as placeholders in Story 7-2
- Story 7-8 verifies these placeholders are complete and correct
- Code review findings applied: Atomic state write, flag validation, graceful exit

**Story 7-6 Completion Notes (Latest):**
- Task 1: Template created at CORRECT location (successful application of Story 7-3 learning)
- Task 2: Local dev grep patterns already present in architect-doc agent (Story 7-1)
- Task 3: Workflow Step 4.4 already implemented (Story 7-2)
- Task 4: Mermaid diagram instructions already present in architect-doc agent (Story 7-1)
- Task 5: ATDD checklist created with 24 validation scenarios
- **Code Review**: Clean review - 0 findings (template at correct location confirmed)

### Git Intelligence

Recent commits show Epic 7 is in active development:
- Story 7-1: architect-doc agent created with 12 code review patches applied
- Story 7-2: command/workflow skeleton created with 5 code review patches applied
- Story 7-3: backend template created with 2 code review patches (critical location bug fixed)
- Story 7-4: frontend template created with 0 code review patches (correct location confirmed)
- Story 7-5: DevOps template created with 0 code review patches (correct location confirmed)
- Story 7-6: local dev template created with 0 code review patches (correct location confirmed)
- The project is on `temp_main` branch
- Update Mode workflow steps (Step 5) already exist from Story 7-2

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 7] -- Story requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md] -- SKILL.md format, three-layer separation
- [Source: scrum_workflow/workflows/architecture-documentation.md] -- Workflow skeleton (created in Story 7-2, Step 5 should already exist)
- [Source: scrum_workflow/agents/architect-doc.md] -- Agent definition (created in Story 7-1, incremental analysis instruction should exist)
- [Source: _bmad-output/implementation-artifacts/7-1-architect-doc-agent-definition.md] -- Story 7.1 implementation reference
- [Source: _bmad-output/implementation-artifacts/7-2-create-architecture-docs-command-and-workflow-skeleton.md] -- Story 7.2 implementation reference
- [Source: _bmad-output/implementation-artifacts/7-3-backend-architecture-analysis-and-generation.md] -- Story 7.3 implementation reference (CRITICAL LOCATION BUG)
- [Source: _bmad-output/implementation-artifacts/7-4-frontend-architecture-analysis-and-generation.md] -- Story 7.4 implementation reference (CORRECT LOCATION CONFIRMED)
- [Source: _bmad-output/implementation-artifacts/7-5-devops-architecture-analysis-and-generation.md] -- Story 7.5 implementation reference (CORRECT LOCATION CONFIRMED)
- [Source: _bmad-output/implementation-artifacts/7-6-local-dev-environment-analysis-and-generation.md] -- Story 7.6 implementation reference (CORRECT LOCATION CONFIRMED)
- [Source: _bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md] -- Pattern recommendations

## Dev Agent Record

### Agent Model Used

Claude 4.6 Sonnet (claude-sonnet-4-20250514)

### Debug Log References

None - implementation starting now.

### Completion Notes List

**Task 1**: Workflow Step 5 (Update Mode Orchestration) verified with all 6 subsections present (5.1-5.6). All subsections include complete instructions for state loading, file change detection, re-analysis, diff presentation, user confirmation, and state updates.

**Task 2**: Step 0 (Mode Detection) verified with `--update` flag detection and correct routing to Step 5 for update mode or Step 4 for full-scan mode. Fallback to full-scan when state file missing is verified.

**Task 3**: Scan state file format verified in Step 4.6 with complete structure: scan_date, scan_mode, files_scanned (array of {path, hash, timestamp}), documents_generated, documents_skipped, scan_duration, scan_status. Atomic write pattern using temp file verified.

**Task 4**: User interaction flows verified in Step 5.4 (diff summary with +new, ~modified, -removed format) and Step 5.5 (confirmation prompt "Apply these changes? [y/N]" and HALT on decline).

**Task 5**: Error handling and rollback verified in Step 5.5 (rollback on documentation write failure, no state update on failure) and Step 5.6 (WARN on state update failure, atomic temp file pattern).

**Task 6**: ATDD checklist created at `_bmad-output/test-artifacts/atdd-checklist-7-8.md` with 31 validation scenarios covering all 10 acceptance criteria.

### File List

- scrum_workflow/workflows/architecture-documentation.md (VERIFIED - Step 0, Step 4.6, Step 5 with all subsections exist)
- scrum_workflow/agents/architect-doc.md (VERIFIED - Instruction #10 Incremental Analysis exists)
- _bmad-output/test-artifacts/atdd-checklist-7-8.md (NEW)

### Review Findings

**Code Review Summary (2026-03-30):**

**Reviewers**: Automated Review (Yolo-Mode)
**Total Findings**: 0
**Patches Applied**: 0
**Deferred**: 0
**Dismissed**: 0

**Clean Review**: Story 7-8 is a verification story. All required functionality was already present from Story 7-2:
- Step 0 (Mode Detection) with --update flag detection
- Step 5 (Update Mode Orchestration) with all 6 subsections (5.1-5.6)
- Instruction #10 (Incremental Analysis) in architect-doc agent
- Atomic state write pattern in Step 4.6 and Step 5.6
- User confirmation prompts and rollback logic in Step 5.5

**Pattern Confirmation**: Story 7-8 follows verification pattern (no new files) vs. Stories 7-3 to 7-6 (template creation). All functionality verified as already implemented.
