---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-05-validate-and-complete
lastStep: step-05-validate-and-complete
lastSaved: '2025-07-14'
storyId: '9.3'
storyTitle: Implement Dynamic Agent Dispatcher
tddPhase: RED
totalTests: 102
totalFiles: 6
inputDocuments:
  - _scrum-output/implementation-artifacts/9-3-implement-dynamic-agent-dispatcher.md
  - _scrum-output/bmm/config.yaml
  - vitest.config.js
  - tests/unit/story-classifier/ac1-type-and-risk-classification.spec.ts
  - tests/unit/adaptive-depth/ac1-risk-to-depth-mapping.spec.ts
---

# ATDD Checklist — Story 9.3: Implement Dynamic Agent Dispatcher

## Summary

| Metric | Value |
|--------|-------|
| Story | 9.3 - Implement Dynamic Agent Dispatcher |
| PRD Reference | FR-34 |
| TDD Phase | RED (all tests skipped) |
| Test Files | 6 |
| Total Tests | 102 |
| Skipped (RED) | 102 |
| Passing | 0 |
| Failing | 0 |
| Regressions | 0 (593 existing tests still pass) |

## Preflight

- [x] Story approved with clear acceptance criteria (4 ACs)
- [x] Test framework configured (vitest.config.js)
- [x] Existing test patterns analyzed (story-classifier, adaptive-depth)
- [x] Stack detected: frontend (unit file content verification pattern)
- [x] Generation mode: AI Generation (no browser recording needed)

## Test Strategy

### AC-to-Test Mapping

| AC | Test File | Tests | Priority Mix |
|----|-----------|-------|-------------|
| AC1: Type-based dispatch rules & skill structure | `ac1-type-based-dispatch.spec.ts` | 28 | 22 P0, 4 P1, 2 P1 |
| AC1 (risk aspect): Risk-based additions | `ac2-risk-based-dispatch.spec.ts` | 11 | 8 P0, 3 P1 |
| AC1 (tag aspect): Domain-tag additions | `ac3-domain-tag-dispatch.spec.ts` | 15 | 11 P0, 4 P1 |
| AC3+AC4: Fallback defaults & missing agents | `ac4-fallback-and-missing-agents.spec.ts` | 20 | 14 P0, 6 P1 |
| AC2: Dispatch rationale logging & sync | `ac5-dispatch-rationale-logging.spec.ts` | 20 | 14 P0, 6 P1 |
| Cross-cutting: Light depth short-circuit | `ac6-light-depth-shortcircuit.spec.ts` | 8 | 6 P0, 2 P1 |

### Coverage by Acceptance Criteria

- [x] **AC1** (FR-34 dispatch based on type, risk, domain tags): 54 tests across ac1, ac2, ac3
  - Type-based override: infrastructure -> [architect, developer] (skip QA)
  - Risk-based addition: high/critical -> add security-reviewer
  - Domain-tag addition: frontend/ui/ux -> add ux-reviewer; api/contract/integration -> add contract-validator
  - Dispatch rules in configurable `dispatch-rules.yaml`
  - Config flag `agent_dispatch_enabled`
  - Integration into refine-ticket.md

- [x] **AC2** (Rationale logged in refinement artifact): 20 tests in ac5
  - Dispatch Summary section in refinement output
  - Selected agents listed with rationale
  - Skipped agents listed with reasons
  - Artifact contract sync (8 sync targets)

- [x] **AC3** (Default agent set fallback): 7 tests in ac4
  - Default set [architect, developer, qa] when no rules match
  - Default set when story attributes missing
  - Logged note: "Default agent set used"

- [x] **AC4** (Missing agent file graceful skip): 7 tests in ac4
  - Agent file existence validation
  - Graceful skip without error
  - Logged note: "Agent '{name}' not available — skipped"
  - Extended agents (security-reviewer, ux-reviewer, contract-validator) not yet created (Story 9.4)

- [x] **Cross-cutting: Light depth short-circuit**: 8 tests in ac6
  - depth: light -> return [developer] immediately
  - Short-circuit skips all other rules
  - Backward compatibility with Story 9.2 behavior

## Test Files Created

### 1. `tests/unit/agent-dispatcher/ac1-type-based-dispatch.spec.ts` (28 tests)
- AC1: Agent Dispatcher Skill Structure (4 tests)
- AC1: Dispatch Rules Data File (7 tests)
- AC1: Dispatch Algorithm Definition (8 tests)
- AC1: Dispatcher Output Format (3 tests)
- AC1: refine-ticket.md Integrates Agent Dispatcher (4 tests)
- AC1: Config.yaml Agent Dispatch Flag (2 tests)

### 2. `tests/unit/agent-dispatcher/ac2-risk-based-dispatch.spec.ts` (11 tests)
- AC2: Risk-Based Rules in dispatch-rules.yaml (5 tests)
- AC2: Risk-Based Dispatch Algorithm (3 tests)
- AC2: Composite Type + Risk Dispatch Scenarios (3 tests)

### 3. `tests/unit/agent-dispatcher/ac3-domain-tag-dispatch.spec.ts` (15 tests)
- AC3: Domain-Tag Rules in dispatch-rules.yaml (7 tests)
- AC3: Domain-Tag Dispatch Algorithm (4 tests)
- AC3: Composite Domain-Tag Dispatch Scenarios (4 tests)

### 4. `tests/unit/agent-dispatcher/ac4-fallback-and-missing-agents.spec.ts` (20 tests)
- AC3: Default Agent Set When No Rules Match (5 tests)
- AC4: Graceful Skip When Agent File Missing (7 tests)
- AC3/AC4: Refinement Workflow Dynamic Agent Spawning (6 tests)
- AC3: Dispatch Disabled Falls Back to Static Selection (2 tests)

### 5. `tests/unit/agent-dispatcher/ac5-dispatch-rationale-logging.spec.ts` (20 tests)
- AC2: Dispatch Summary Section in Refinement Output (5 tests)
- AC2: Dispatcher Skill Rationale Output (4 tests)
- AC2: Only Selected Agents Spawned with Context (3 tests)
- AC2: Artifact Contract Sync for Dispatcher Integration (8 tests)

### 6. `tests/unit/agent-dispatcher/ac6-light-depth-shortcircuit.spec.ts` (8 tests)
- AC6: Light Depth Short-Circuit in Dispatcher (4 tests)
- AC6: Light Depth Backward Compatibility (4 tests)

## Validation

- [x] All 102 tests use `test.skip()` (TDD RED phase)
- [x] All tests follow existing vitest + readFileSync + regex pattern
- [x] All tests follow existing naming convention: `ac{N}-{description}.spec.ts`
- [x] Test directory follows convention: `tests/unit/agent-dispatcher/`
- [x] Zero regressions: 593 existing tests still pass
- [x] 16 pre-existing failed test files remain unchanged (unrelated)
- [x] Each AC has at least one corresponding test file
- [x] Priority labels (P0/P1/P2) assigned per risk and business impact
- [x] JSDoc header includes story reference, PRD reference, and AC description

## Risks & Assumptions

1. **Extended agent files don't exist yet** — Tests for AC4 (missing agents) reference security-reviewer, ux-reviewer, contract-validator which are created in Story 9.4. Tests validate the dispatcher handles their absence gracefully.
2. **File content verification pattern** — Tests verify markdown/YAML content using regex, not runtime behavior. This is consistent with Stories 9.1 and 9.2.
3. **Artifact contract sync** — 8 sync targets in `create-scrum-workflow/` must be updated. Tests verify sync targets have dispatcher references.

## Next Steps

1. **Implementation**: Create `scrum_workflow/skills/agent-dispatcher/SKILL.md` and `scrum_workflow/data/dispatch-rules.yaml`
2. **GREEN phase**: Remove `test.skip()` from tests as implementation progresses
3. **Artifact sync**: Update all 8 sync targets in `create-scrum-workflow/`
