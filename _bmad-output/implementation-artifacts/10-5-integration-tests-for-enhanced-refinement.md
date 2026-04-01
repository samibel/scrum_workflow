# Story 10.5: Integration Tests for Enhanced Refinement

status: in-progress

## Story

As a developer,
I want test coverage that verifies the enhanced refinement workflow works correctly,
so that I have confidence the new phases integrate properly.

## Acceptance Criteria

1. **AC1: Doc-Discovery Phase Tests** - Tests verify doc-discovery phase prompts user and accepts paths/URLs/skip
2. **AC2: Doc-Discovery Validation Tests** - Tests verify doc-discovery phase validates paths and fetches URLs
3. **AC3: Initial Perspectives Tests** - Tests verify initial perspectives are spawned in parallel with isolated context
4. **AC4: Temp File Creation Tests** - Tests verify each agent writes analysis to `sprints/SW-XXX/temp/{role}-round-0.md`
5. **AC5: Progressive Truncation Tests** - Tests verify cross-talk rounds use progressive truncation (400->300->200 words)
6. **AC6: Binary Blocker Classification Tests** - Tests verify binary blocker classification: each disagreement classified as blocker/non-blocker
7. **AC7: Security Auto-Blocker Tests** - Tests verify security auto-blocker: security issues forced as blockers regardless of agent classification
8. **AC8: Early Consensus Exit Tests** - Tests verify early consensus exit: workflow exits early when only non-blockers remain
9. **AC9: Deadlock UX Tests** - Tests verify deadlock UX: after max rounds with blockers, user sees resolution options
10. **AC10: Temp File Cleanup Tests** - Tests verify temp file cleanup: temp directory removed after synthesis (when `keep_agent_temp_files: false`)
11. **AC11: Temp File Preservation Tests** - Tests verify temp file preservation: temp directory kept when `keep_agent_temp_files: true`
12. **AC12: Estimation Collection Tests** - Tests verify estimation phase collects independent estimates from all agents
13. **AC13: Variance Threshold Tests** - Tests verify variance threshold triggers re-estimation discussion
14. **AC14: Median Calculation Tests** - Tests verify final estimate uses median calculation
15. **AC15: Refinement Sections Tests** - Tests verify `refinement.md` includes all new sections: Document Discovery, Discussion Rounds, Estimation
16. **AC16: Story Frontmatter Tests** - Tests verify `story.md` frontmatter includes estimation with points and confidence
17. **AC17: Gitignore Pattern Tests** - Tests verify `.gitignore` includes `sprints/*/temp/` pattern
18. **AC18: Test Suite Execution** - Running `npm test` passes all integration tests including the new refinement tests

## Tasks / Subtasks

- [ ] Task 1: Create test file structure (AC: #18)
  - [ ] 1.1: Create `create-scrum-workflow/test/integration/refinement-enhanced.test.js`
  - [ ] 1.2: Set up vitest test scaffolding with describe/test structure
  - [ ] 1.3: Import necessary mocking utilities (vi, fs mocks)
  - [ ] 1.4: Define mock configurations and test fixtures

- [ ] Task 2: Implement Doc-Discovery Phase Tests (AC: #1, #2)
  - [ ] 2.1: Test doc-discovery prompts user for additional documents
  - [ ] 2.2: Test doc-discovery accepts file paths
  - [ ] 2.3: Test doc-discovery accepts URLs
  - [ ] 2.4: Test doc-discovery accepts "skip" to proceed without additional docs
  - [ ] 2.5: Test doc-discovery validates paths exist
  - [ ] 2.6: Test doc-discovery fetches and validates URL content
  - [ ] 2.7: Test doc-discovery handles invalid paths gracefully
  - [ ] 2.8: Test doc-discovery handles unreachable URLs gracefully

- [ ] Task 3: Implement Initial Perspectives Tests (AC: #3, #4)
  - [ ] 3.1: Test all three agents spawn in parallel
  - [ ] 3.2: Test each agent receives isolated context (no cross-contamination)
  - [ ] 3.3: Test architect receives architecture.md context
  - [ ] 3.4: Test developer receives domain-specific context
  - [ ] 3.5: Test QA receives testing.md context
  - [ ] 3.6: Test temp directory is created at `sprints/SW-XXX/temp/`
  - [ ] 3.7: Test `architect-round-0.md` is written
  - [ ] 3.8: Test `developer-round-0.md` is written
  - [ ] 3.9: Test `qa-round-0.md` is written

- [ ] Task 4: Implement Cross-Talk Discussion Tests (AC: #5, #6, #7, #8, #9)
  - [ ] 4.1: Test Round 1 uses 400-word limit per agent
  - [ ] 4.2: Test Round 2 uses 300-word limit per agent
  - [ ] 4.3: Test Round 3 uses 200-word limit per agent
  - [ ] 4.4: Test binary blocker classification prompt is shown
  - [ ] 4.5: Test disagreements can be classified as blockers
  - [ ] 4.6: Test disagreements can be classified as non-blockers
  - [ ] 4.7: Test security issues are auto-classified as blockers
  - [ ] 4.8: Test security auto-blocker cannot be overridden
  - [ ] 4.9: Test early exit when only non-blockers remain
  - [ ] 4.10: Test workflow continues when blockers remain
  - [ ] 4.11: Test deadlock UX shown after max rounds
  - [ ] 4.12: Test deadlock resolution options are presented
  - [ ] 4.13: Test round summary files are created

- [ ] Task 5: Implement Temp File Management Tests (AC: #10, #11)
  - [ ] 5.1: Test temp directory removed when `keep_agent_temp_files: false`
  - [ ] 5.2: Test temp directory preserved when `keep_agent_temp_files: true`
  - [ ] 5.3: Test cleanup happens after synthesis
  - [ ] 5.4: Test cleanup includes all round files

- [ ] Task 6: Implement Estimation Phase Tests (AC: #12, #13, #14)
  - [ ] 6.1: Test all three agents provide independent estimates
  - [ ] 6.2: Test agents cannot see others' estimates during initial estimation
  - [ ] 6.3: Test Fibonacci scale values are used (1, 2, 3, 5, 8, 13, 21)
  - [ ] 6.4: Test confidence levels are collected (high/medium/low)
  - [ ] 6.5: Test variance calculation is correct
  - [ ] 6.6: Test re-estimation triggered when variance > threshold
  - [ ] 6.7: Test no re-estimation when variance <= threshold
  - [ ] 6.8: Test median calculation for final estimate
  - [ ] 6.9: Test confidence aggregation (lowest of three)

- [ ] Task 7: Implement Output File Tests (AC: #15, #16, #17)
  - [ ] 7.1: Test `refinement.md` includes Document Discovery section
  - [ ] 7.2: Test `refinement.md` includes Discussion Rounds section
  - [ ] 7.3: Test `refinement.md` includes Blocker Resolution section
  - [ ] 7.4: Test `refinement.md` includes Estimation section
  - [ ] 7.5: Test `story.md` frontmatter includes `estimate` field
  - [ ] 7.6: Test `story.md` frontmatter includes `confidence` field
  - [ ] 7.7: Test `.gitignore` includes `sprints/*/temp/` pattern

- [ ] Task 8: Final validation and test execution (AC: #18)
  - [ ] 8.1: Run `npm test` and verify all tests pass
  - [ ] 8.2: Verify test coverage is adequate
  - [ ] 8.3: Update sprint-status.yaml on completion

## Dev Notes

### Critical Context from Previous Stories

**Story 10.4 (Updated Refinement Workflow)**: This story consolidated all enhanced refinement features:
- 6-phase workflow structure (Doc-Discovery, Initial Perspectives, Cross-Talk, Estimation, Synthesis, Readiness Check)
- Configuration options in `config.yaml` under `refinement:` section
- Temp file structure at `sprints/SW-XXX/temp/`
- Progressive truncation (400->300->200 words)
- Binary blocker classification with security auto-blocker
- Early consensus exit mechanism
- Deadlock UX with resolution options
- Wideband Delphi estimation with variance handling

**Story 10.1 (Doc-Discovery)**: Implemented doc-discovery phase in Step 4.5:
- User prompt for additional documents
- Path validation and URL fetching
- Storage of discovered documents for agent context

**Story 10.2 (Cross-Talk)**: Implemented cross-talk discussion rounds:
- Temp directory creation and Round 0 analyses storage
- Cross-talk rounds with progressive truncation
- Binary blocker classification
- Security auto-blocker
- Early consensus exit
- Deadlock detection and UX

**Story 10.3 (Estimation)**: Implemented Wideband Delphi estimation:
- Initial estimates collection
- Variance check
- Re-estimation discussion
- Final estimate calculation (median)
- Confidence aggregation

### Testing Patterns to Follow

Based on `create-scrum-workflow/test/integration/research.test.js`:

1. **Test Structure**: Use vitest with `describe`, `test`, `expect` pattern
2. **Mocking**: Use `vi.mock()` for fs modules and external dependencies
3. **AC Grouping**: Group tests by Acceptance Criteria in describe blocks
4. **Priority Markers**: Use `[P0]`, `[P1]`, `[P2]` to indicate test priority
5. **Skip Meta-Tests**: Use `test.skip` for meta-tests that verify test file existence
6. **Mock Data**: Define mock templates, configs, and state objects at the top

### Test File Location

Create the test file at:
```
create-scrum-workflow/test/integration/refinement-enhanced.test.js
```

This follows the existing pattern where integration tests for workflow features are placed in `create-scrum-workflow/test/integration/`.

### Key Test Scenarios

**Doc-Discovery Tests:**
- User provides valid file paths
- User provides valid URLs
- User provides invalid paths (error handling)
- User provides unreachable URLs (error handling)
- User types "skip" (proceed without additional docs)

**Cross-Talk Tests:**
- Round 0 creates temp files for all agents
- Round 1 uses 400-word truncation
- Round 2 uses 300-word truncation
- Round 3 uses 200-word truncation
- Blockers are correctly classified
- Security issues auto-block
- Early exit on consensus
- Deadlock UX after max rounds

**Estimation Tests:**
- Independent estimates from all agents
- Variance calculation correctness
- Re-estimation trigger logic
- Median calculation
- Confidence aggregation (lowest wins)

**Cleanup Tests:**
- Temp files removed when config is false
- Temp files preserved when config is true

### Configuration Values to Test

From `scrum_workflow/config.yaml`:
```yaml
refinement:
  max_discussion_rounds: 3
  keep_agent_temp_files: false
  estimation_variance_threshold: 2
  early_exit_on_consensus: true
  security_auto_blocker: true
```

### Files to Modify/Create

1. **CREATE**: `create-scrum-workflow/test/integration/refinement-enhanced.test.js` - Main test file

### Anti-Patterns to Avoid

1. **Do NOT test implementation details**: Test behavior, not internal functions
2. **Do NOT mock everything**: Only mock external dependencies (fs, http)
3. **Do NOT create flaky tests**: Ensure tests are deterministic
4. **Do NOT skip priority tests**: All [P0] and [P1] tests must be implemented
5. **Do NOT test workflow logic directly**: Test the outcomes and side effects

### Architecture Compliance

- Follow vitest patterns from existing integration tests
- Use mock fixtures for workflow state
- Test against workflow specification, not implementation
- Ensure tests can run in isolation without real workflow execution
- Verify file system interactions are properly mocked

### References

- [Source: scrum_workflow/workflows/refinement.md] -- Complete workflow specification
- [Source: scrum_workflow/commands/refine-ticket.md] -- Command definition
- [Source: scrum_workflow/config.yaml] -- Configuration options
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 10, Story 10.5] -- Story requirements
- [Source: _bmad-output/implementation-artifacts/10-4-updated-refinement-workflow.md] -- Previous story (workflow update)
- [Source: create-scrum-workflow/test/integration/research.test.js] -- Test pattern reference
- [Source: docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md] -- Research basis

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

- `create-scrum-workflow/test/integration/refinement-enhanced.test.js` (created - main test file)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified - status update)
