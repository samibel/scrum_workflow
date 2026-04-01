---
stepsCompleted:
  - 'step-01-preflight-and-context'
  - 'step-02-generation-mode'
  - 'step-03-test-strategy'
  - 'step-04c-aggregate'
  - 'step-05-validate-and-complete'
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-30'
storyId: '6-3'
storyTitle: 'Business Logic Analysis & business-logic.md Generation'
detectedStack: 'backend'
generationMode: 'ai-generation'
executionMode: 'sequential'
tddPhase: 'RED'
inputDocuments:
  - '_bmad-output/implementation-artifacts/6-3-business-logic-analysis-and-generation.md'
  - '_bmad/tea/config.yaml'
  - '_bmad/core/config.yaml'
  - '_bmad/tea/testarch/tea-index.csv'
  - '_bmad/tea/testarch/knowledge/data-factories.md'
  - '_bmad/tea/testarch/knowledge/test-quality.md'
  - '_bmad/tea/testarch/knowledge/test-healing-patterns.md'
  - '_bmad/tea/testarch/knowledge/test-levels-framework.md'
  - '_bmad/tea/testarch/knowledge/test-priorities-matrix.md'
  - '_bmad/tea/testarch/knowledge/component-tdd.md'
  - 'scrum_workflow/templates/refinement.md'
  - 'scrum_workflow/templates/review.md'
  - 'scrum_workflow/templates/approval.md'
  - 'scrum_workflow/agents/documentarian.md'
  - 'scrum_workflow/workflows/project-documentation.md'
---

# ATDD Checklist: Story 6-3 -- Business Logic Analysis & business-logic.md Generation

## Story Summary

**Story**: As a developer, I want the agent to identify and document all business rules, validations, and decision logic in my codebase, so that I have a comprehensive reference of what the system enforces and why.

**Status**: ready-for-dev

## Step 1: Preflight & Context

### Stack Detection

- **Detected Stack**: `backend` (Node.js/TypeScript project with Jest)
- **Test Framework**: Jest with ts-jest (in `_bmad-output/test-artifacts/`)
- **No Playwright/Cypress**: This project uses file system validation tests
- **Pattern References**: `documentarian-agent-definition.spec.ts` (Story 6-1), `create-project-docs-command-workflow.spec.ts` (Story 6-2)

### Prerequisites Verification

- [x] Story approved with clear acceptance criteria (6 ACs identified)
- [x] Test framework configured (Jest + ts-jest in `_bmad-output/test-artifacts/package.json`)
- [x] Development environment available
- [x] Existing template patterns available for reference (`refinement.md`, `review.md`, `approval.md`)
- [x] Documentarian agent definition exists (Story 6-1 complete)
- [x] Workflow skeleton exists with Step 5.1 placeholder (Story 6-2 complete)

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

**Rationale**: Backend stack with clear acceptance criteria. All 6 ACs describe file structure/content validation (template file existence, sections, workflow step content, grep patterns, domain grouping, exclusions). Standard file system validation scenarios -- no browser recording needed.

## Step 3: Test Strategy

### Acceptance Criteria to Test Scenario Mapping

| AC# | Acceptance Criterion | Test Level | Priority | Scenarios |
|-----|---------------------|-----------|----------|-----------|
| AC1 | Grep-based business logic scanning | Unit (FS) | P0-P2 | 10 tests: placeholder removed, grep patterns for conditionals, validations, guards, policies, constants, agent reference, exclusion filters, test file exclusion, template reference |
| AC2 | Output template exists with correct sections | Unit (FS) | P0-P2 | 8 tests: file exists, Overview section, Business Rules section, Validation Rules section, Guard Clauses section, Business Constants section, no frontmatter, valid markdown |
| AC3 | Generated output follows template structure | Unit (FS) | P0-P2 | 7 tests: output path reference, domain area grouping, placeholder comments, agent Output Format match, template reference in workflow, summary placeholders, empty codebase handling |
| AC4 | Rule documentation completeness | Unit (FS) | P0-P2 | 9 tests: rule name/description, file:line reference, plain language explanation, Mermaid flowchart placeholder, fenced code block, workflow Mermaid mention, workflow source ref format, complex rules only, relative paths |
| AC5 | Domain area grouping | Unit (FS) | P0-P2 | 8 tests: template domain area, workflow domain grouping, path-based inference, domain examples, fallback strategy, domain area placeholder, file-name inference, project-agnostic |
| AC6 | Exclusion of non-business logic | Unit (FS) | P0-P2 | 6 tests: infrastructure exclusion, logging exclusion, error handling exclusion, database exclusion, agent exclusion reference, agent exclusion completeness |
| Cross | Structural compliance | Unit (FS) | P0-P2 | 10 tests: framework layer, kebab-case, scope boundary (Steps 5.2/5.3 unchanged), no generated files at dev time, anti-pattern check, heading structure, Write Boundaries, agent unmodified, output artifact pattern, command unmodified |

### Test Level Selection

- **Primary Level**: Unit (File System Validation)
- **No E2E**: Backend/file validation project, no browser-based testing needed
- **No API**: No API endpoints -- this is a markdown file validation story
- **Pattern**: Follows established pattern from `documentarian-agent-definition.spec.ts` and `create-project-docs-command-workflow.spec.ts`

### Priority Distribution

- **P0**: 27 tests (critical file existence, section structure, grep patterns, exclusions)
- **P1**: 20 tests (detailed content quality, agent references, domain grouping logic)
- **P2**: 11 tests (naming conventions, edge cases, secondary strategies)

### Red Phase Confirmation

All 58 tests are designed to FAIL because the template file does not exist yet and the workflow Step 5.1 has not been updated. Tests use `test.skip()` to document intentional failure (TDD red phase).

## Step 4: Test Generation (Aggregate)

### TDD Red Phase Validation

- [x] All tests use `test.skip()` (TDD red phase compliant)
- [x] All tests assert expected behavior (not placeholder assertions)
- [x] No `expect(true).toBe(true)` placeholder assertions
- [x] Tests are deterministic, isolated, and focused

### Generated Test File

| File | Tests | Description |
|------|-------|-------------|
| `business-logic-analysis-generation.spec.ts` | 58 | ATDD tests for Story 6-3 (RED PHASE) |

### Test Run Verification

```
Test Suites: 1 skipped, 0 of 1 total
Tests:       58 skipped, 58 total
Time:        0.651 s
```

All 58 tests skipped as expected (TDD RED phase confirmed).

### Acceptance Criteria Coverage

- [x] AC1: Grep-based business logic scanning (10 tests)
- [x] AC2: Output template exists with correct sections (8 tests)
- [x] AC3: Generated output follows template structure (7 tests)
- [x] AC4: Rule documentation completeness (9 tests)
- [x] AC5: Domain area grouping (8 tests)
- [x] AC6: Exclusion of non-business logic (6 tests)
- [x] Cross-cutting: Structural/convention compliance (10 tests)

### Fixture Needs

Minimal fixture infrastructure needed -- file system validation tests use `fs.readFileSync` and `fs.existsSync` directly. Helper functions provided inline:
- `extractFrontmatter()` -- extracts YAML frontmatter from markdown
- `extractBody()` -- extracts markdown body after frontmatter
- `getContent()` -- reads full file content
- `extractSection()` -- extracts a specific section by heading level
- `extractWorkflowStep()` -- extracts a workflow step section by heading

## Step 5: Validation & Completion

### Validation Checklist

- [x] Prerequisites satisfied (story approved, test framework ready)
- [x] Test file created correctly at `_bmad-output/test-artifacts/business-logic-analysis-generation.spec.ts`
- [x] Checklist matches all 6 acceptance criteria
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
- [x] Knowledge fragment patterns applied (test-quality, test-levels, test-priorities, component-tdd)
- [x] Reference to prior story tests for structural consistency (6-1, 6-2)

### Completion Summary

| Metric | Value |
|--------|-------|
| Story ID | 6-3 |
| Story Title | Business Logic Analysis & business-logic.md Generation |
| Primary Test Level | Unit (File System Validation) |
| Total Tests | 58 |
| P0 Tests | 27 |
| P1 Tests | 20 |
| P2 Tests | 11 |
| Test File | `business-logic-analysis-generation.spec.ts` |
| TDD Phase | RED (all tests skipped) |
| Execution Mode | Sequential (AI Generation) |
| Knowledge Fragments | 6 (data-factories, component-tdd, test-quality, test-healing-patterns, test-levels-framework, test-priorities-matrix) |

## Next Steps (TDD Green Phase)

After implementing the feature (2 file changes):

1. Remove `test.skip()` from all test functions in `business-logic-analysis-generation.spec.ts`
2. Run tests: `cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts --verbose`
3. Verify tests PASS (green phase)
4. If any tests fail:
   - Either fix implementation (feature does not meet AC)
   - Or fix test (test assertion incorrect)
5. Commit passing tests

### Implementation Guidance

**Files to create/modify**:

1. `scrum_workflow/templates/business-logic.md` (NEW) -- Output template with sections: Overview, Business Rules (grouped by domain area), Validation Rules, Guard Clauses & Access Control, Business Constants & Configuration
2. `scrum_workflow/workflows/project-documentation.md` (MODIFY Step 5.1 only) -- Replace "See Story 6.3" placeholder with concrete implementation instructions including grep patterns, exclusion filters, domain area grouping, Mermaid generation, and source references

**Reference files**:
- `scrum_workflow/agents/documentarian.md` -- Agent's Output Format specification (template MUST match) and grep patterns (workflow MUST reference, not redefine)
- `scrum_workflow/templates/refinement.md` -- Output artifact template pattern reference
- `scrum_workflow/templates/review.md` -- Output artifact template pattern reference
- `_bmad-output/implementation-artifacts/6-3-business-logic-analysis-and-generation.md` -- Full story spec with task breakdown

**Key requirements**:
- Template is pure Markdown (no YAML frontmatter) -- output artifact pattern
- Template = structural skeleton. Agent = methodology. Workflow = orchestration (when/where)
- Anti-pattern: Do NOT put analysis logic in the template
- Three-layer separation: template in `scrum_workflow/templates/`, workflow in `scrum_workflow/workflows/`
- Scope boundary: Only modify Step 5.1; Steps 5.2 and 5.3 keep their "See Story 6.4" / "See Story 6.5" placeholders
- Do NOT create `docs/generated/business-logic.md` -- that is runtime output, not dev-time
- Do NOT modify the documentarian agent definition (completed in Story 6.1)

### Execution Commands

```bash
# Run all Story 6-3 tests
cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts --verbose

# Run specific AC tests
cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts -t "AC1"
cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts -t "AC2"
cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts -t "AC3"
cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts -t "AC4"
cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts -t "AC5"
cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts -t "AC6"

# Run cross-cutting tests
cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts -t "Cross-cutting"

# Run with watch mode during development
cd _bmad-output/test-artifacts && npx jest business-logic-analysis-generation.spec.ts --watch
```

### Recommended Next Workflow

- **bmad-dev-story** -- Execute story 6-3 implementation using the story spec file
- After implementation passes all tests, run **bmad-testarch-trace** for traceability matrix
