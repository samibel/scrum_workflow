---
stepsCompleted:
  - 'step-01-preflight-and-context'
  - 'step-02-generation-mode'
  - 'step-03-test-strategy'
  - 'step-04c-aggregate'
  - 'step-05-validate-and-complete'
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-30'
storyId: '7-1'
storyTitle: 'architect-doc Agent Definition'
detectedStack: 'backend'
generationMode: 'ai-generation'
executionMode: 'sequential'
tddPhase: 'RED'
inputDocuments:
  - '_bmad-output/implementation-artifacts/7-1-architect-doc-agent-definition.md'
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
  - 'scrum_workflow/agents/documentarian.md'
  - '_bmad-output/test-artifacts/atdd-checklist-6-1.md'
  - '_bmad-output/test-artifacts/documentarian-agent-definition.spec.ts'
---

# ATDD Checklist: Story 7-1 -- architect-doc Agent Definition

## Story Summary

**Story**: As a developer, I want a dedicated architecture documentation agent defined in SKILL.md format, so that the agent has a clear identity, instructions, and output format for generating architecture documentation with Mermaid diagrams.

**Status**: ready-for-dev

## Step 1: Preflight & Context

### Stack Detection

- **Detected Stack**: `backend` (Node.js/TypeScript project with Jest)
- **Test Framework**: Jest with ts-jest (in `_bmad-output/test-artifacts/`)
- **No Playwright/Cypress**: This project uses file system validation tests
- **Pattern Reference**: `agent-definitions-validation.spec.ts` (Story 1-2), `documentarian-agent-definition.spec.ts` (Story 6-1)

### Prerequisites Verification

- [x] Story approved with clear acceptance criteria (9 ACs identified)
- [x] Test framework configured (Jest + ts-jest in `_bmad-output/test-artifacts/package.json`)
- [x] Development environment available
- [x] Existing agent patterns available for reference (architect.md, developer.md, qa.md, documentarian.md)

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

### Parallel Pattern Reference

Story 7-1 is a parallel to Story 6-1 (documentarian agent):
- Both create a documentation agent definition file
- Both use SKILL.md format with 4 sections
- Both define grep patterns for codebase scanning
- Both output to documentation templates (not refinement perspectives)
- Key difference: architect-doc focuses on **system structure** while documentarian focuses on **business behavior**

## Step 2: Generation Mode

**Mode Selected**: AI Generation

**Rationale**: Backend stack with clear acceptance criteria. All 9 ACs describe file structure/content validation (markdown file existence, YAML frontmatter fields, section structure, content patterns, scope boundaries). Standard file system validation scenarios -- no browser recording needed.

## Step 3: Test Strategy

### Acceptance Criteria to Test Scenario Mapping

| AC# | Acceptance Criterion | Test Level | Priority | Scenarios |
|-----|---------------------|-----------|----------|-----------|
| AC1 | Agent file exists at correct location | Unit (FS) | P0 | 3 tests: file exists, alongside other agents, kebab-case naming |
| AC2 | YAML frontmatter follows convention | Unit (FS) | P0 | 7 tests: delimiters, all fields, name, display_name, active_in, model, max_tokens |
| AC3 | Identity section defines persona | Unit (FS) | P0 | 5 tests: section exists, architecture focus, Mermaid mention, codebase analysis, NOT business logic |
| AC4 | Instructions methodology | Unit (FS) | P0 | 8 tests: section exists, numbered steps, Glob/Grep, backend/frontend/DevOps/local/testing, Mermaid, source refs |
| AC5 | Grep pattern reference | Unit (FS) | P0 | 5 tests: section exists, backend patterns, frontend patterns, DevOps patterns, testing patterns |
| AC6 | Five document types | Unit (FS) | P0 | 8 tests: section exists, 5 doc types, Mermaid types per doc, no table format |
| AC7 | Context loading order | Unit (FS) | P0 | 5 tests: section exists, index.md, domain context, config.yaml, Glob/Grep discovery |
| AC8 | Exact structure convention | Unit (FS) | P0 | 7 tests: section order, exactly 4 sections, non-empty content, field order, role description, structure match, valid markdown |
| AC9 | Scope differentiation from documentarian | Unit (FS) | P0 | 4 tests: structure vs behavior focus, different output docs, different grep patterns, boundary clarity |

### Test Level Selection

- **Primary Level**: Unit (File System Validation)
- **No E2E**: Backend/file validation project, no browser-based testing needed
- **No API**: No API endpoints -- this is a markdown file validation story
- **Pattern**: Follows established pattern from `documentarian-agent-definition.spec.ts` (Story 6-1)

### Priority Distribution

- **P0**: 52 tests (critical file structure and content validation)
- **P1**: 8 tests (detailed content quality and convention compliance)
- **P2**: 2 tests (naming convention, markdown quality)

### Red Phase Confirmation

All 62 tests are designed to FAIL because `architect-doc.md` does not exist yet. Tests use `test.skip()` to document intentional failure (TDD red phase).

## Step 4: Test Generation (Aggregate)

### TDD Red Phase Validation

- [x] All tests use `test.skip()` (TDD red phase compliant)
- [x] All tests assert expected behavior (not placeholder assertions)
- [x] No `expect(true).toBe(true)` placeholder assertions
- [x] Tests are deterministic, isolated, and focused

### Generated Test File

| File | Tests | Description |
|------|-------|-------------|
| `architect-doc-agent-definition.spec.ts` | 62 | ATDD tests for Story 7-1 (RED PHASE) |

### Test Run Verification

```
Test Suites: 1 skipped, 0 of 1 total
Tests:       62 skipped, 62 total
Time:        ~0.7 s
```

All 62 tests skipped as expected (TDD RED phase confirmed).

### Acceptance Criteria Coverage

- [x] AC1: Agent file exists at correct location (3 tests)
- [x] AC2: YAML frontmatter follows established convention (7 tests)
- [x] AC3: Identity section defines agent persona (5 tests)
- [x] AC4: Instructions section specifies analysis methodology (8 tests)
- [x] AC5: Instructions section includes grep pattern reference (5 tests)
- [x] AC6: Output Format section defines five document types (8 tests)
- [x] AC7: Context Rules section specifies context loading order (5 tests)
- [x] AC8: File follows exact structure convention (7 tests)
- [x] AC9: Scope differentiation from documentarian agent (14 tests)

### Fixture Needs

Minimal fixture infrastructure needed -- file system validation tests use `fs.readFileSync` and `fs.existsSync` directly. Helper functions provided inline (same as Story 6-1):
- `extractFrontmatter()` -- extracts YAML frontmatter from markdown
- `extractBody()` -- extracts markdown body after frontmatter
- `extractSection()` -- extracts a specific section from markdown body

## Step 5: Validation & Completion

### Validation Checklist

- [x] Prerequisites satisfied (story approved, test framework ready)
- [x] Test file created correctly at `_bmad-output/test-artifacts/architect-doc-agent-definition.spec.ts`
- [x] Checklist matches all 9 acceptance criteria
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
| Story ID | 7-1 |
| Story Title | architect-doc Agent Definition |
| Primary Test Level | Unit (File System Validation) |
| Total Tests | 62 |
| P0 Tests | 52 |
| P1 Tests | 8 |
| P2 Tests | 2 |
| Test File | `architect-doc-agent-definition.spec.ts` |
| TDD Phase | RED (all tests skipped) |
| Execution Mode | Sequential (AI Generation) |
| Knowledge Fragments | 6 (data-factories, component-tdd, test-quality, test-healing-patterns, test-levels-framework, test-priorities-matrix) |

## Next Steps (TDD Green Phase)

After implementing the feature (`scrum_workflow/agents/architect-doc.md`):

1. Remove `test.skip()` from all test functions in `architect-doc-agent-definition.spec.ts`
2. Run tests: `cd _bmad-output/test-artifacts && npx jest architect-doc-agent-definition.spec.ts --verbose`
3. Verify tests PASS (green phase)
4. If any tests fail:
   - Either fix implementation (feature does not meet AC)
   - Or fix test (test assertion incorrect)
5. Commit passing tests

### Implementation Guidance

**File to create**: `scrum_workflow/agents/architect-doc.md`

**Reference files**:
- `scrum_workflow/agents/architect.md` -- Primary structural reference
- `scrum_workflow/agents/developer.md` -- Secondary format reference
- `scrum_workflow/agents/qa.md` -- Secondary format reference
- `scrum_workflow/agents/documentarian.md` -- Parallel pattern reference (Epic 6)

**Key differences from existing agents**:
- `active_in: [create-architecture-docs]` (not `refine-ticket`)
- `max_tokens: 4000` (not 2000) -- documentation output is larger
- Output Format uses document-template structures (5 architecture docs), NOT the table-based perspective format
- Identity focuses on **system structure** documentation, NOT story refinement
- Instructions use numbered methodology with grep patterns for 5 architecture dimensions (backend, frontend, DevOps, local dev, testing)
- **Critical boundary**: architect-doc = HOW it's built (structure); documentarian = WHAT it does (business logic)

### Execution Commands

```bash
# Run all Story 7-1 tests
cd _bmad-output/test-artifacts && npx jest architect-doc-agent-definition.spec.ts --verbose

# Run specific AC tests
cd _bmad-output/test-artifacts && npx jest architect-doc-agent-definition.spec.ts -t "AC1"
cd _bmad-output/test-artifacts && npx jest architect-doc-agent-definition.spec.ts -t "AC2"

# Run with watch mode during development
cd _bmad-output/test-artifacts && npx jest architect-doc-agent-definition.spec.ts --watch
```

### Recommended Next Workflow

- **bmad-dev-story** -- Execute story 7-1 implementation using the story spec file
- After implementation passes all tests, run **bmad-testarch-trace** for traceability matrix
