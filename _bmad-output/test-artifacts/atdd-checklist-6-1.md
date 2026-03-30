---
stepsCompleted:
  - 'step-01-preflight-and-context'
  - 'step-02-generation-mode'
  - 'step-03-test-strategy'
  - 'step-04c-aggregate'
  - 'step-05-validate-and-complete'
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-30'
storyId: '6-1'
storyTitle: 'Documentarian Agent Definition'
detectedStack: 'backend'
generationMode: 'ai-generation'
executionMode: 'sequential'
tddPhase: 'RED'
inputDocuments:
  - '_bmad-output/implementation-artifacts/6-1-documentarian-agent-definition.md'
  - '_bmad/tea/config.yaml'
  - '_bmad/core/config.yaml'
  - '_bmad/tea/testarch/tea-index.csv'
  - '_bmad/tea/testarch/knowledge/data-factories.md'
  - '_bmad/tea/testarch/knowledge/test-quality.md'
  - '_bmad/tea/testarch/knowledge/test-healing-patterns.md'
  - '_bmad/tea/testarch/knowledge/test-levels-framework.md'
  - '_bmad/tea/testarch/knowledge/test-priorities-matrix.md'
  - '_bmad/tea/testarch/knowledge/component-tdd.md'
  - 'scrum_workflow/agents/architect.md'
  - 'scrum_workflow/agents/developer.md'
  - 'scrum_workflow/agents/qa.md'
---

# ATDD Checklist: Story 6-1 -- Documentarian Agent Definition

## Story Summary

**Story**: As a developer, I want a dedicated documentation agent defined in SKILL.md format, so that the agent has a clear identity, instructions, and output format for generating business logic documentation with Mermaid diagrams.

**Status**: ready-for-dev

## Step 1: Preflight & Context

### Stack Detection

- **Detected Stack**: `backend` (Node.js/TypeScript project with Jest)
- **Test Framework**: Jest with ts-jest (in `_bmad-output/test-artifacts/`)
- **No Playwright/Cypress**: This project uses file system validation tests
- **Pattern Reference**: `agent-definitions-validation.spec.ts` (Story 1-2)

### Prerequisites Verification

- [x] Story approved with clear acceptance criteria (8 ACs identified)
- [x] Test framework configured (Jest + ts-jest in `_bmad-output/test-artifacts/package.json`)
- [x] Development environment available
- [x] Existing agent patterns available for reference (architect.md, developer.md, qa.md)

### TEA Config Flags

- `tea_use_playwright_utils`: true (not applicable -- backend file validation)
- `tea_use_pactjs_utils`: false
- `tea_pact_mcp`: none
- `tea_browser_automation`: auto (not applicable -- no browser tests)
- `test_stack_type`: auto -> resolved to `backend`

### Knowledge Fragments Loaded

**Core (always):**
- `data-factories.md` -- N/A for file validation, pattern noted
- `component-tdd.md` -- Red-Green-Refactor TDD cycle applied
- `test-quality.md` -- Deterministic, isolated, explicit tests
- `test-healing-patterns.md` -- Failure pattern awareness

**Backend patterns:**
- `test-levels-framework.md` -- Unit-level file system validation selected
- `test-priorities-matrix.md` -- P0-P3 priority assignment applied

## Step 2: Generation Mode

**Mode Selected**: AI Generation

**Rationale**: Backend stack with clear acceptance criteria. All 8 ACs describe file structure/content validation (markdown file existence, YAML frontmatter fields, section structure, content patterns). Standard file system validation scenarios -- no browser recording needed.

## Step 3: Test Strategy

### Acceptance Criteria to Test Scenario Mapping

| AC# | Acceptance Criterion | Test Level | Priority | Scenarios |
|-----|---------------------|-----------|----------|-----------|
| AC1 | Agent file exists at correct location | Unit (FS) | P0 | 3 tests: file exists, alongside other agents, kebab-case naming |
| AC2 | YAML frontmatter follows convention | Unit (FS) | P0 | 7 tests: delimiters, all fields, name, display_name, active_in, model, max_tokens |
| AC3 | Identity section defines persona | Unit (FS) | P0 | 5 tests: section exists, business logic focus, Mermaid mention, codebase analysis, NOT architecture |
| AC4 | Instructions methodology | Unit (FS) | P0 | 7 tests: section exists, numbered steps, Glob/Grep, business rules, workflows, entities, Mermaid types |
| AC5 | Grep pattern reference | Unit (FS) | P0 | 6 tests: business rules, guard clauses, workflows, entities, relationships, file:line |
| AC6 | Three document types | Unit (FS) | P0 | 8 tests: section exists, business-logic.md, workflows.md, domain-model.md, flowchart, stateDiagram, classDiagram, no table format |
| AC7 | Context loading order | Unit (FS) | P0 | 5 tests: section exists, index.md, domain context, config.yaml, Glob/Grep discovery |
| AC8 | Exact structure convention | Unit (FS) | P0 | 7 tests: section order, exactly 4 sections, non-empty content, field order, role description, structure match, valid markdown |

### Test Level Selection

- **Primary Level**: Unit (File System Validation)
- **No E2E**: Backend/file validation project, no browser-based testing needed
- **No API**: No API endpoints -- this is a markdown file validation story
- **Pattern**: Follows established pattern from `agent-definitions-validation.spec.ts` (Story 1-2)

### Priority Distribution

- **P0**: 36 tests (critical file structure and content validation)
- **P1**: 10 tests (detailed content quality and convention compliance)
- **P2**: 2 tests (naming convention, markdown quality)

### Red Phase Confirmation

All 48 tests are designed to FAIL because `documentarian.md` does not exist yet. Tests use `test.skip()` to document intentional failure (TDD red phase).

## Step 4: Test Generation (Aggregate)

### TDD Red Phase Validation

- [x] All tests use `test.skip()` (TDD red phase compliant)
- [x] All tests assert expected behavior (not placeholder assertions)
- [x] No `expect(true).toBe(true)` placeholder assertions
- [x] Tests are deterministic, isolated, and focused

### Generated Test File

| File | Tests | Description |
|------|-------|-------------|
| `documentarian-agent-definition.spec.ts` | 48 | ATDD tests for Story 6-1 (RED PHASE) |

### Test Run Verification

```
Test Suites: 1 skipped, 0 of 1 total
Tests:       48 skipped, 48 total
Time:        0.653 s
```

All 48 tests skipped as expected (TDD RED phase confirmed).

### Acceptance Criteria Coverage

- [x] AC1: Agent file exists at correct location (3 tests)
- [x] AC2: YAML frontmatter follows established convention (7 tests)
- [x] AC3: Identity section defines agent persona (5 tests)
- [x] AC4: Instructions section specifies analysis methodology (7 tests)
- [x] AC5: Instructions section includes grep pattern reference (6 tests)
- [x] AC6: Output Format section defines three document types (8 tests)
- [x] AC7: Context Rules section specifies context loading order (5 tests)
- [x] AC8: File follows exact structure convention (7 tests)

### Fixture Needs

Minimal fixture infrastructure needed -- file system validation tests use `fs.readFileSync` and `fs.existsSync` directly. Helper functions provided inline:
- `extractFrontmatter()` -- extracts YAML frontmatter from markdown
- `extractBody()` -- extracts markdown body after frontmatter
- `extractSection()` -- extracts a specific section from markdown body

## Step 5: Validation & Completion

### Validation Checklist

- [x] Prerequisites satisfied (story approved, test framework ready)
- [x] Test file created correctly at `_bmad-output/test-artifacts/documentarian-agent-definition.spec.ts`
- [x] Checklist matches all 8 acceptance criteria
- [x] Tests designed to fail before implementation (all use `test.skip()`)
- [x] No orphaned CLI sessions (no browser automation used)
- [x] Temp artifacts stored in `_bmad-output/test-artifacts/`

### Quality Validation

- [x] Tests are readable (clear describe/test structure with AC references)
- [x] Tests are maintainable (helper functions for content extraction)
- [x] Tests are isolated (no shared state between tests)
- [x] Tests are deterministic (file system reads are deterministic)
- [x] Tests are focused (one assertion per test where practical)
- [x] Test names include priority tags [P0/P1/P2]
- [x] Knowledge fragment patterns applied (test-quality, test-levels, test-priorities)

### Completion Summary

| Metric | Value |
|--------|-------|
| Story ID | 6-1 |
| Story Title | Documentarian Agent Definition |
| Primary Test Level | Unit (File System Validation) |
| Total Tests | 48 |
| P0 Tests | 36 |
| P1 Tests | 10 |
| P2 Tests | 2 |
| Test File | `documentarian-agent-definition.spec.ts` |
| TDD Phase | RED (all tests skipped) |
| Execution Mode | Sequential (AI Generation) |
| Knowledge Fragments | 6 (data-factories, component-tdd, test-quality, test-healing-patterns, test-levels-framework, test-priorities-matrix) |

## Next Steps (TDD Green Phase)

After implementing the feature (`scrum_workflow/agents/documentarian.md`):

1. Remove `test.skip()` from all test functions in `documentarian-agent-definition.spec.ts`
2. Run tests: `cd _bmad-output/test-artifacts && npx jest documentarian-agent-definition.spec.ts --verbose`
3. Verify tests PASS (green phase)
4. If any tests fail:
   - Either fix implementation (feature does not meet AC)
   - Or fix test (test assertion incorrect)
5. Commit passing tests

### Implementation Guidance

**File to create**: `scrum_workflow/agents/documentarian.md`

**Reference files**:
- `scrum_workflow/agents/architect.md` -- Primary structural reference
- `scrum_workflow/agents/developer.md` -- Secondary format reference
- `scrum_workflow/agents/qa.md` -- Secondary format reference

**Key differences from existing agents**:
- `active_in: [create-project-docs]` (not `refine-ticket`)
- `max_tokens: 4000` (not 2000) -- documentation output is larger
- Output Format uses document-template structures, NOT the table-based perspective format
- Identity focuses on codebase reading and documentation, NOT story refinement
- Instructions use numbered methodology with grep patterns, NOT consideration-based approach

### Execution Commands

```bash
# Run all Story 6-1 tests
cd _bmad-output/test-artifacts && npx jest documentarian-agent-definition.spec.ts --verbose

# Run specific AC tests
cd _bmad-output/test-artifacts && npx jest documentarian-agent-definition.spec.ts -t "AC1"
cd _bmad-output/test-artifacts && npx jest documentarian-agent-definition.spec.ts -t "AC2"

# Run with watch mode during development
cd _bmad-output/test-artifacts && npx jest documentarian-agent-definition.spec.ts --watch
```

### Recommended Next Workflow

- **bmad-dev-story** -- Execute story 6-1 implementation using the story spec file
- After implementation passes all tests, run **bmad-testarch-trace** for traceability matrix
