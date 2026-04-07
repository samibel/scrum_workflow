---
stepsCompleted:
  - 'step-01-preflight-and-context'
  - 'step-02-generation-mode'
  - 'step-03-test-strategy'
  - 'step-04-generate-tests'
  - 'step-04c-aggregate'
  - 'step-05-validate-and-complete'
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-07'
storyId: '1-7'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md (FR-44)'
  - '_bmad-output/planning-artifacts/architecture.md (Section 2: Structure Patterns)'
  - '_bmad-output/implementation-artifacts/1-7-verify-align-runtime-extension-model.md'
  - 'scrum_workflow/context/architecture-guidelines.md'
---

# ATDD Checklist - Story 1.7: Verify & Align Runtime Extension Model

## Story Summary

**Story**: 1.7 Verify & Align Runtime Extension Model
**Epic**: Epic 1 - Core Framework
**Type**: Verification & Alignment
**TDD Phase**: RED (Failing Tests)

## Acceptance Criteria

| # | Criterion | Test Coverage |
||---|-----------|---------------|
| AC1 | Delta analysis documents: what matches, what diverges, and what is missing | TC-10 |
| AC2 | New `.md` file in framework directories is discovered at runtime without config/build/restart | TC-06, TC-07, TC-08, TC-09 |
| AC3 | Directory structure matches: `scrum_workflow/{commands,workflows,skills,agents}/{name}/` | TC-01, TC-02, TC-03, TC-04, TC-05 |
| AC4 | Runtime extension model fully matches PRD and Architecture specifications | All TCs |

## Test Strategy

### Stack Detection
- **Detected Stack**: `backend`
- **Reason**: Framework verification, no browser/UI interaction required

### Test Levels Selected
| Level | Selected | Justification |
|-------|----------|---------------|
| Unit | Yes | Directory structure validation, file naming conventions |
| Integration | Yes | Runtime discovery mechanism, cross-component structure |
| API | No | No external API endpoints in this story |
| E2E | No | Backend-only verification, no browser testing |

### Generation Mode
- **Mode**: AI Generation
- **Reason**: Backend verification story with clear acceptance criteria, existing structure to validate

## Test Cases Generated

| Test ID | Description | Priority | Level | Status |
|---------|-------------|----------|-------|--------|
| TC-01 | Required directories exist | P0 | Unit | FAILING (Red) |
| TC-02 | Skills follow SKILL.md convention | P0 | Unit | FAILING (Red) |
| TC-03 | Workflows follow workflow.md convention | P0 | Unit | FAILING (Red) |
| TC-04 | Agents follow agent.md convention | P0 | Unit | FAILING (Red) |
| TC-05 | Commands follow command.md convention | P0 | Unit | FAILING (Red) |
| TC-06 | No centralized registry exists | P0 | Integration | FAILING (Red) |
| TC-07 | No build step required for extension | P0 | Integration | FAILING (Red) |
| TC-08 | Framework files are pure Markdown/YAML | P0 | Unit | FAILING (Red) |
| TC-09 | Runtime discovery works without config | P0 | Integration | FAILING (Red) |
| TC-10 | Delta analysis documents all variances | P0 | Integration | FAILING (Red) |

## Priority Distribution

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 10 | All tests are critical for FR-44 compliance |
| P1 | 0 | - |
| P2 | 0 | - |

## Output Files

| File | Path | Type |
|------|------|------|
| Acceptance Tests | `scrum_workflow/__tests__/runtime-extension/runtime-extension-model.test.md` | Test File |
| ATDD Checklist | `scrum_workflow/__tests__/runtime-extension/atdd-checklist-1-7.md` | Checklist |

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
Implementation Required: Yes (delta resolution)
Tests to Implement: 10
```

## FR-44 Requirements Summary

> Framework extends through files: a new `SKILL.md` in the skills directory is a new capability, a new agent definition is a new agent, a new workflow definition is a new workflow. No configuration change, build step, or service restart required. The framework discovers new specifications at runtime.

**Key Requirements:**
1. File-based extension (new `.md` file = new capability)
2. No configuration change required
3. No build step required
4. No service restart required
5. Runtime discovery

## Architecture Specification

```
scrum_workflow/
├── commands/
│   └── {command-name}/
│       └── command.md
├── workflows/
│   └── {workflow-name}/
│       └── workflow.md
├── skills/
│   └── {skill-name}/
│       └── SKILL.md
└── agents/
    └── {agent-name}/
        └── agent.md
```

## Current Implementation Analysis

| Component | Architecture Spec | Current Implementation | Status |
|-----------|-------------------|------------------------|--------|
| `skills/` | `{name}/SKILL.md` | `{name}/SKILL.md` | MATCH |
| `workflows/` | `{name}/workflow.md` | `{name}.md` (flat) | DIVERGENCE |
| `agents/` | `{name}/agent.md` | `{name}.md` (flat) | DIVERGENCE |
| `commands/` | `{name}/command.md` | `{name}.md` (flat) | DIVERGENCE |

## Implementation Checklist

Before proceeding to GREEN phase, ensure:

- [ ] Delta analysis complete (what matches, what diverges, what is missing)
- [ ] Decision made on resolution approach:
  - [ ] Migrate to Architecture spec structure
  - [ ] Accept current structure as documented variance
  - [ ] Hybrid approach with backward compatibility
- [ ] All deltas resolved (if migration chosen)
- [ ] Architecture updated (if accepting variance)
- [ ] Runtime discovery verified without config/build/restart
- [ ] All four extension types consistent

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Story 1.1 (Ticket Creation) | Complete | No direct dependency |
| Story 1.2 (Agent Spawning) | Complete | Verified agent definitions |
| Story 1.3 (Cross-Talk) | Complete | Verified workflow execution |
| Story 1.4 (Estimation) | Complete | Verified estimation workflow |
| Story 1.5 (Code Review) | Complete | No direct dependency |
| Story 1.6 (Installation) | Complete | Installer behavior verified separately |

## Knowledge Fragments Loaded

- Core testing patterns (data-factories, component-tdd, test-quality)
- Backend test patterns (test-levels-framework, test-priorities-matrix)
- Framework architecture patterns (from Architecture Guidelines)

## Next Steps

1. **GREEN Phase**: Resolve deltas between implementation and Architecture spec
2. **Run Tests**: Remove `test.skip()` and verify all tests pass
3. **REFACTOR Phase**: Update Architecture documentation if accepting variance
4. **Validation**: Verify runtime discovery works without config/build/restart

## Resolution Decision Framework

When evaluating whether a delta requires resolution:

**Must Resolve (Breaking):**
- Violates FR-44 core requirements (registration, build, restart)
- Causes runtime discovery failure
- Breaks existing projects

**May Accept (Non-Breaking):**
- Structural variance that doesn't affect FR-44 compliance
- Cosmetic naming differences
- Documentation-only changes

**Document as Variance:**
- Update Architecture to match implementation
- Add note explaining why variance is acceptable
- Ensure FR-44 requirements are still met

---

## Validation Summary (Step 5)

### Prerequisites Satisfied
- [x] Story approved with clear acceptance criteria
- [x] Test framework configured (Vitest)
- [x] Development environment available

### Test Files Created
- [x] `scrum_workflow/__tests__/runtime-extension/runtime-extension-model.test.md`
- [x] `scrum_workflow/__tests__/runtime-extension/atdd-checklist-1-7.md`

### TDD Red Phase Compliance
- [x] All tests use `test.skip()` (will fail until feature verified)
- [x] All tests assert expected behavior (not placeholders)
- [x] All tests marked as expected_to_fail

### Acceptance Criteria Coverage
| AC | Covered | Test Cases |
|----|---------|------------|
| AC1 | Yes | TC-10 |
| AC2 | Yes | TC-06, TC-07, TC-08, TC-09 |
| AC3 | Yes | TC-01, TC-02, TC-03, TC-04, TC-05 |
| AC4 | Yes | All TCs |

### Key Findings
1. **Skills directory** follows Architecture spec correctly (`{name}/SKILL.md`)
2. **Workflows, Agents, Commands** use flat file structure (divergence from Architecture spec)
3. **FR-44 compliance** needs verification: does flat structure still support runtime discovery without config/build/restart?

### Risks & Assumptions
- **Risk**: Flat file structure may confuse users expecting Architecture-specified structure
- **Assumption**: Runtime discovery works with both structures (needs verification)
- **Assumption**: No centralized registry exists (needs verification)

### Next Recommended Workflow
Proceed to **GREEN Phase** via `/bmad-dev-story 1.7` to:
1. Complete delta analysis
2. Resolve or document variances
3. Verify FR-44 compliance
4. Update Architecture if accepting variance
