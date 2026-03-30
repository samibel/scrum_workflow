---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests']
lastStep: 'step-04-generate-tests'
lastSaved: '2026-03-30'
inputDocuments:
  - '/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/7-7-testing-architecture-analysis-and-generation.md'
  - '/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/test-artifacts/package.json'
  - '/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad/tea/testarch/tea-index.csv'
---

# ATDD Checklist for Story 7.7: Testing Architecture Analysis

**Story**: Testing Architecture Analysis & `testing-architecture.md` Generation
**Epic**: 7 - Architecture Documentation Agent
**Generated**: 2026-03-30

---

## Step 1: Preflight & Context Loading - COMPLETED ✓

### Stack Detection Result
**Detected Stack**: `backend`
**Rationale**: This is a Python/TypeScript CLI tool project with Jest test configuration in `_bmad-output/test-artifacts/package.json`. The project is primarily a developer tool framework without frontend UI components.

### Test Framework Configuration
**Framework**: Jest
**Config File**: `_bmad-output/test-artifacts/package.json` (lines 18-30)
**Test Pattern**: `**/*.spec.ts`
**Test Environment**: Node

### Prerequisites Verification
- [x] Story approved with clear acceptance criteria (8 ACs documented)
- [x] Test framework configured (Jest with TypeScript support)
- [x] Development environment available (Node.js, npm)

### Story Context Loaded
- Story: 7.7 - Testing Architecture Analysis & Generation
- Epic: 7 - Architecture Documentation Agent
- Status: ready-for-dev
- Tasks: 5 main tasks with subtasks

### Key Requirements
1. Template creation at `scrum_workflow/templates/testing-architecture.md`
2. Verify grep patterns in `architect-doc.md` agent
3. Verify workflow Step 4.5 in `architecture-documentation.md`
4. Mermaid diagram for test pyramid
5. Source references with file:line format
6. Skip condition for no testing detected

### Previous Story Intelligence Applied
- Story 7-3 bug: Template must be at `scrum_workflow/templates/`, NOT root `templates/`
- Stories 7-4, 7-5, 7-6: Pattern confirmed successful
- Stories 7-1, 7-2: Agent and workflow should already have testing patterns

---

## Step 2: Generation Mode Selection - COMPLETED ✓

### Mode: AI Generation

**Rationale**:
- Backend stack (CLI tool/framework project)
- Clear acceptance criteria with 8 well-defined requirements
- Standard validation scenarios (file existence, grep patterns, content checks)
- No UI interactions requiring browser recording
- All testable via file system operations and content analysis

**Skipped**: Recording mode (only for complex frontend/fullstack UI interactions)

---

## Step 3: Test Strategy - COMPLETED ✓

### Test Level Selection (Backend Stack)

**All tests will be Unit/Integration level** - file system operations, grep validation, and content analysis

### Acceptance Criteria Mapping

| AC | Description | Test Level | Priority | Test Type |
|---|---|---|---|---|
| AC1 | Template file exists at correct location | Unit | P0 | File system validation |
| AC2 | Grep patterns for testing components | Integration | P0 | Pattern validation |
| AC3 | Testing architecture analysis orchestration in workflow | Integration | P0 | Workflow validation |
| AC4 | Test pyramid documentation with Mermaid | Unit | P1 | Content validation |
| AC5 | Test frameworks documentation | Integration | P1 | Content structure validation |
| AC6 | Coverage thresholds documentation | Integration | P1 | Content extraction validation |
| AC7 | Source references (file:line) | Integration | P1 | Reference format validation |
| AC8 | No testing handling | Integration | P2 | Skip logic validation |

### Test Prioritization (Risk-Based)

**P0 (Critical)** - Must pass for story completion:
- AC1: Template location (critical bug prevention from Story 7-3)
- AC2: Grep patterns (core functionality)
- AC3: Workflow orchestration (integration point)

**P1 (High)** - Important for quality:
- AC4: Mermaid diagram syntax (documentation quality)
- AC5: Framework documentation structure (usability)
- AC6: Coverage extraction (feature completeness)
- AC7: Source references (traceability)

**P2 (Medium)** - Edge cases:
- AC8: Skip condition (error handling)

### Red Phase Requirements

All tests designed to **FAIL** before implementation:
- Template file doesn't exist yet
- Grep patterns may be missing
- Workflow step may not be implemented
- Mermaid syntax not validated
- Content structures not created

---

## Step 4: Test Generation - COMPLETED ✓

### Execution Mode: Sequential (Backend Stack Adaptation

**Rationale**: This is a backend project with file-system-based tests, not API/E2E tests. The standard subagent workflow was adapted for direct test generation.

### Test File Generated

**File**: `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/test-artifacts/testing-architecture-validation.spec.ts`

**Test Statistics**:
- Total Test Suites: 8 (one per acceptance criterion)
- Total Test Cases: 41
- All tests marked with `.skip()` for TDD Red Phase
- Coverage: All 8 acceptance criteria mapped to tests

### Test Organization

```
describe('Story 7.7: Testing Architecture Analysis')
├── AC1: Template file exists at correct location (9 tests)
├── AC2: Grep patterns for testing components (6 tests)
├── AC3: Testing architecture analysis orchestration (5 tests)
├── AC4: Test pyramid documentation with Mermaid (4 tests)
├── AC5: Test frameworks documentation (5 tests)
├── AC6: Coverage thresholds documentation (4 tests)
├── AC7: Source references (4 tests)
└── AC8: No testing handling (4 tests)
```

### TDD Red Phase Confirmation

✅ **All tests created with `.skip()`**
✅ **Tests will FAIL until Story 7.7 is implemented**
✅ **Test run executed**: 41 skipped tests (expected)
✅ **Ready for implementation phase**

### Test Execution Results

```bash
cd /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/test-artifacts
npm test -- testing-architecture-validation.spec.ts

Result:
- Test Suites: 1 skipped, 0 of 1 total
- Tests: 41 skipped, 41 total
- Time: 0.684s
```

### Next Steps

To proceed with implementation:
1. Remove `.skip()` from AC1 tests and implement template creation
2. Remove `.skip()` from AC2 tests and verify grep patterns
3. Continue through all ACs in priority order (P0 → P1 → P2)

---

## Acceptance Criterion 1: Template file exists at correct location

**Requirement**: `scrum_workflow/templates/testing-architecture.md` exists with required sections: Overview, Test Pyramid (unit/integration/E2E split), Frameworks & Configuration, Test Directory Structure, Coverage Requirements, E2E Setup, Test Utilities & Fixtures

**Test Scenarios**:
1. Verify file exists at path `scrum_workflow/templates/testing-architecture.md`
2. Verify file does NOT exist at path `templates/testing-architecture.md` ( Story 7-3 bug)
3. Verify template contains Overview section with purpose description
4. Verify template contains Test Pyramid section with graph TD placeholder
5. Verify template contains Frameworks & Configuration section with table structure
6. Verify template contains Test Directory Structure section
7. Verify template contains Coverage Requirements section with table structure
8. Verify template contains E2E Setup section with table structure
9. Verify template contains Test Utilities & Fixtures section with table structure

**Validation Criteria**:
- [ ] File exists at correct framework path
- [ ] File does NOT exist at root templates path
- [ ] All 8 required sections present in template
- [ ] Each section has appropriate table/placeholder structure

---

## Acceptance Criterion 2: Grep patterns for testing components

**Requirement**: The architect-doc agent Instructions section includes grep patterns to identify testing components (FR75)

**Test Scenarios**:
1. Verify architect-doc agent has test framework config patterns: `jest.config.*`, `vitest.config.*`, `pytest.ini`, `pyproject.toml [tool.pytest]`, `playwright.config.*`, `cypress.config.*`, `.mocharc.*`
2. Verify agent has test directory patterns: `__tests__/`, `test/`, `spec/`, `tests/`, `*.test.*`, `*.spec.*`, `test_*`
3. Verify agent has coverage configuration patterns: `coverageThreshold`, `--cov`, `coverage/`, `.nycrc`, `istanbul`
4. Verify agent has E2E test setup patterns: `playwright`, `cypress`, `selenium`, `puppeteer`, `testcontainers`
5. Verify agent has test utility patterns: `fixtures/`, `helpers/`, `factories/`, `mocks/`, `stubs/`, `__mocks__/`
6. Verify agent has contract test patterns: `pact`, `consumer`, `provider`, `contract`

**Validation Criteria**:
- [ ] All 6 pattern categories present in agent Instructions section
- [ ] Patterns are language-agnostic (work with Jest, Vitest, Pytest, etc.)
- [ ] Patterns include Glob patterns for file discovery (*.test.*, *.spec.*)
- [ ] Patterns include Grep patterns for config content search

---

## Acceptance Criterion 3: Testing architecture analysis orchestration in workflow

**Requirement**: The `architecture-documentation.md` workflow Step 4.5 (Testing Architecture Analysis) invokes the architect-doc agent with testing-specific instructions to generate `docs/generated/testing-architecture.md`

**Test Scenarios**:
1. Verify workflow file contains Step 4.5: Testing Architecture Analysis
2. Verify step instructs to invoke architect-doc agent with testing context
3. Verify step specifies output path: `docs/generated/testing-architecture.md`
4. Verify step includes instruction to extract file:line references
5. Verify step includes instruction to skip if no testing detected

**Validation Criteria**:
- [ ] Step 4.5 exists in architecture-documentation.md
- [ ] Step invokes architect-doc agent with testing-specific instructions
- [ ] Step specifies correct output path
- [ ] Step handles file:line reference extraction
- [ ] Step handles skip condition when no testing detected

---

## Acceptance Criterion 4: Test pyramid documentation with Mermaid

**Requirement**: The test pyramid is documented with a Mermaid `graph TD` or description showing the balance of unit/integration/E2E tests (FR76)

**Test Scenarios**:
1. Verify architect-doc agent Output Format specifies test pyramid visualization
2. Verify agent uses `graph TD` Mermaid syntax for test pyramid
3. Verify template contains placeholder or example of test pyramid diagram
4. Verify diagram shows three levels: unit, integration, E2E

**Validation Criteria**:
- [ ] Agent Output Format includes test pyramid with Mermaid diagram
- [ ] Mermaid syntax uses `graph TD` format
- [ ] Template has appropriate placeholder for test pyramid
- [ ] Diagram structure represents testing pyramid (unit/integration/E2E)

---

## Acceptance Criterion 5: Test frameworks documentation

**Requirement**: Test frameworks are documented with: framework name, config file location (file:line), test directory patterns, run commands

**Test Scenarios**:
1. Verify template Frameworks & Configuration section has table with columns: Framework, Config File (file:line), Test Directory Patterns, Run Commands
2. Verify agent instructions specify how to extract framework name from config files
3. Verify agent instructions specify how to locate config file with file:line
4. Verify agent instructions specify how to identify test directory patterns
5. Verify agent instructions specify how to determine run commands from config

**Validation Criteria**:
- [ ] Template table structure matches AC requirements
- [ ] Agent instructions cover framework name extraction
- [ ] Agent instructions cover config file location with file:line
- [ ] Agent instructions cover test directory pattern identification
- [ ] Agent instructions cover run command determination

---

## Acceptance Criterion 6: Coverage thresholds documentation

**Requirement**: Coverage thresholds are extracted and documented if configured

**Test Scenarios**:
1. Verify template Coverage Requirements section has table with columns: Coverage Type, Threshold (if configured), Config Location
2. Verify agent instructions specify how to extract coverageThreshold from config files
3. Verify agent instructions specify how to handle missing coverage configuration
4. Verify agent instructions specify coverage types to document (statements, branches, functions, lines)

**Validation Criteria**:
- [ ] Template table structure for coverage is present
- [ ] Agent instructions cover coverage threshold extraction
- [ ] Agent instructions handle missing configuration gracefully
- [ ] Agent instructions specify relevant coverage types

---

## Acceptance Criterion 7: Source references

**Requirement**: All documented components include `file:line` references for traceability

**Test Scenarios**:
1. Verify architect-doc agent Context Rules specify file:line reference requirement
2. Verify agent instructions specify how to extract line numbers from Grep results
3. Verify template examples show file:line format in all tables
4. Verify agent instructions specify handling for generated/minified code without line numbers

**Validation Criteria**:
- [ ] Agent Context Rules include file:line reference requirement
- [ ] Agent instructions cover line number extraction from Grep
- [ ] Template tables include file:line columns
- [ ] Agent instructions handle edge cases (generated code, minified files)

---

## Acceptance Criterion 8: No testing handling

**Requirement**: If no test configuration is detected, the document is skipped with a note in the scan state

**Test Scenarios**:
1. Verify workflow Step 4.5 includes skip condition check
2. Verify agent instructions specify how to detect absence of testing
3. Verify agent instructions specify what to note in scan state when skipped
4. Verify scan state structure includes documents_skipped array (from Story 7-9)

**Validation Criteria**:
- [ ] Workflow step includes skip condition logic
- [ ] Agent instructions define "no testing detected" criteria
- [ ] Scan state tracking includes skip reason
- [ ] Skip note format matches other skipped documents (frontend, local dev, etc.)

---

## Summary

**Total Acceptance Criteria**: 8
**Total Test Scenarios**: 36
**Total Validation Criteria**: 52

**Test Coverage**: All ACs have multiple test scenarios with clear validation criteria
**Language-Agnostic**: Patterns tested across multiple frameworks (Jest, Vitest, Pytest, Playwright, Cypress)
**Mermaid Validation**: Diagram syntax validation included
**File Location Validation**: Explicit tests for correct template location ( Story 7-3 bug prevention)

**Execution Notes**:
- Run validation after Task 1 (template creation) to verify correct location
- Run validation after Task 2 (agent verification) to confirm patterns exist
- Run validation after Task 3 (workflow verification) to confirm orchestration
- Create ATDD checklist as Task 5 (as specified in story tasks)
