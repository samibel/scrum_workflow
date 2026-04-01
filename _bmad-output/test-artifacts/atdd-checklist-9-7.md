---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-05-validate-and-complete
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-30T18:45:14Z

# ATDD Checklist for Story 9-7: /scrum-research general` Command & Workflow

## Story Information

- **Story ID**: 9-7
- **Title**: /scrum-research general Command & Workflow
- **Status**: ready-for-dev

## Acceptance Criteria

| AC# | Description | Priority | Test Coverage |
|-----|-------------|----------|---------------|
| AC1 | Command file exists at correct location | P0 | 8 tests |
| AC2 | Workflow file exists at correct location | P0 | 5 tests |
| AC3 | Workflow uses same four patterns | P0 | 5 tests |
| AC4 | Output schema is type: general_research | P0 | 8 tests |
| AC5 | Same state file as technical research | P0 | 3 tests |
| AC6 | Generated filename pattern | P0 | 3 tests |
| AC7 | Adapter skill created | P0 | 7 tests |
| AC8 | Reuses Stories 9.3-9.6 patterns | P0 | 12 tests |

## Test Files

- `research-general-command-workflow.spec.ts` - 98 tests (TDD red phase)

## Test Strategy

- **Test Level**: File System Validation (Infrastructure/Framework)
- **Test Framework**: Jest with TypeScript
- **TDD Phase**: RED (tests will fail because files do not exist yet)

## Key Differences from Technical Research

- Subagent count: 2-3 (vs 3-5 for technical)
- Output sections: 8 (vs 13 for technical)
- Output type: `general_research` (vs `technical_research`)
- Filename pattern: `general-research-*` (vs `technical-research-*`)

- State file: Same (`.research-state.json`)

