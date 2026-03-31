---
stepsCompleted:
  - 'step-01-preflight-and-context'
  - 'step-02-generation-mode'
  - 'step-03-test-strategy'
  - 'step-04-generate-tests'
lastStep: 'step-04-generate-tests'
lastSaved: '2026-03-30'
storyId: '9-6'
inputDocuments:
  - '_bmad-output/planning-artifacts/epics.md (Story 9.6)'
  - 'scrum_workflow/workflows/research-technical.md'
  - 'scrum_workflow/agents/researcher.md'
  - 'scrum_workflow/__tests__/research/swarm-migration.test.md'
---

# ATDD Checklist - Story 9-6: Filesystem-Based State for Long-Running Research

## Story Summary

**Story**: 9-6 Filesystem-Based State for Long-Running Research
**Epic**: Epic 9 - Research Agent
**Type**: Backend Feature
**TDD Phase**: RED (Failing Tests)

## Acceptance Criteria

| # | Criterion | Test Coverage |
|---|-----------|---------------|
| AC1 | The workflow creates `docs/research/.research-state.json` at the start of each research task | TC-01 |
| AC2 | State file tracks: `research_id`, `topic`, `start_time`, `status`, `completed_steps`, `findings`, `sources_consulted` | TC-02 |
| AC3 | State file is updated incrementally during research | TC-03, TC-10 |
| AC4 | If interrupted, `status` is set to `interrupted` and `last_completed_step` is recorded | TC-04 |
| AC5 | When run again with same topic, agent reads state file and offers to resume | TC-05 |
| AC6 | User can choose to resume or start fresh | TC-06 |
| AC7 | If resumed, agent skips already-completed steps | TC-07 |
| AC8 | State file is valid JSON and human-readable | TC-08 |
| AC9 | State file is included in `.gitignore` recommendations | TC-09 |

## Test Strategy

### Stack Detection
- **Detected Stack**: `backend`
- **Reason**: Research workflow operates on JSON state files, no browser/UI interaction required

### Test Levels Selected
| Level | Selected | Justification |
|-------|----------|---------------|
| Unit | Yes | Pure state file operations, field validation |
| Integration | Yes | Workflow step coordination, resume logic |
| API | No | No external API endpoints in this story |
| E2E | No | Backend-only feature, no browser testing |

### Generation Mode
- **Mode**: AI Generation
- **Reason**: Backend project with clear acceptance criteria, no complex UI recording needed

## Test Cases Generated

| Test ID | Description | Priority | Level | Status |
|---------|-------------|----------|-------|--------|
| TC-01 | State file creation at research start | P0 | Unit | FAILING (Red) |
| TC-02 | State file contains all required fields | P0 | Unit | FAILING (Red) |
| TC-03 | Incremental state updates during research | P0 | Integration | FAILING (Red) |
| TC-04 | Interruption sets status to interrupted | P0 | Integration | FAILING (Red) |
| TC-05 | Resume offered on re-run with same topic | P0 | Integration | FAILING (Red) |
| TC-06 | User can choose resume or fresh start | P1 | Integration | FAILING (Red) |
| TC-07 | Resume skips completed steps | P0 | Integration | FAILING (Red) |
| TC-08 | State file is valid JSON and human-readable | P1 | Unit | FAILING (Red) |
| TC-09 | State file in gitignore recommendations | P2 | Unit | FAILING (Red) |
| TC-10 | Findings and sources persisted incrementally | P1 | Integration | FAILING (Red) |

## Priority Distribution

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 6 | Critical path - must pass for MVP |
| P1 | 3 | Important for user experience |
| P2 | 1 | Nice to have |

## Output Files

| File | Path | Type |
|------|------|------|
| Acceptance Tests | `scrum_workflow/__tests__/research/filesystem-state.test.md` | Test File |
| ATDD Checklist | `scrum_workflow/__tests__/research/atdd-checklist-9-6.md` | Checklist |

## TDD Status

```
RED PHASE: Complete
-----------
Tests Generated: 10
Tests Passing: 0 (expected - red phase)
Tests Failing: 10 (expected - red phase)
Tests Skipped: 10 (test.skip for red phase)

GREEN PHASE: Pending
-----------
Implementation Required: Yes
Tests to Implement: 10
```

## Implementation Checklist

Before proceeding to GREEN phase, ensure:

- [ ] State file creation implemented in workflow Step 0
- [ ] State file schema matches TC-02 specification
- [ ] Incremental updates after each workflow step
- [ ] Interruption handling with status update
- [ ] Resume prompt on workflow startup
- [ ] Step-skipping logic for resume
- [ ] Gitignore recommendation documented

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Story 9-1 (Researcher Agent) | Complete | Agent definition exists |
| Story 9-2 (Technical Research Command) | Complete | Workflow exists |
| Story 9-3 (Output Template) | Complete | Template exists |
| Story 9-4 (Web Research Integration) | Complete | Swarm Migration pattern |
| Story 9-5 (Reflection Loop) | Complete | Quality assurance |

## Knowledge Fragments Loaded

- Core testing patterns (data-factories, component-tdd, test-quality)
- Backend test patterns (test-levels-framework, test-priorities-matrix)
- State management patterns (from existing research workflow)

## Next Steps

1. **GREEN Phase**: Implement the Filesystem-Based State feature
2. **Run Tests**: Remove `test.skip()` and verify all tests pass
3. **REFACTOR Phase**: Optimize implementation if needed
4. **Validation**: Run full integration test suite
