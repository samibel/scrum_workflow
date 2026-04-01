---
stepsCompleted:
  - 'step-01-preflight-and-context'
  - 'step-02-generation-mode'
  - 'step-03-test-strategy'
  - 'step-04c-aggregate'
  - 'step-05-validate-and-complete'
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-30'
storyId: '6-2'
storyTitle: '/scrum-create-project-docs Command & Workflow Skeleton'
detectedStack: 'backend'
generationMode: 'ai-generation'
executionMode: 'sequential'
tddPhase: 'RED'
inputDocuments:
  - '_bmad-output/implementation-artifacts/6-2-create-project-docs-command-and-workflow-skeleton.md'
  - '_bmad/tea/config.yaml'
  - '_bmad/core/config.yaml'
  - '_bmad/tea/testarch/tea-index.csv'
  - '_bmad/tea/testarch/knowledge/data-factories.md'
  - '_bmad/tea/testarch/knowledge/test-quality.md'
  - '_bmad/tea/testarch/knowledge/test-healing-patterns.md'
  - '_bmad/tea/testarch/knowledge/test-levels-framework.md'
  - '_bmad/tea/testarch/knowledge/test-priorities-matrix.md'
  - '_bmad/tea/testarch/knowledge/component-tdd.md'
  - 'scrum_workflow/commands/create-project-context.md'
  - 'scrum_workflow/commands/create-ticket.md'
  - 'scrum_workflow/commands/dev-story.md'
  - 'scrum_workflow/workflows/project-context.md'
  - 'scrum_workflow/agents/documentarian.md'
  - '.claude/skills/create-project-context.md'
  - '.claude/skills/create-ticket.md'
---

# ATDD Checklist: Story 6-2 -- /scrum-create-project-docs Command & Workflow Skeleton

## Story Summary

**Story**: As a developer, I want to run `/scrum-create-project-docs` to trigger business logic documentation generation, so that I have a single command that orchestrates the full documentation workflow.

**Status**: ready-for-dev

## Step 1: Preflight & Context

### Stack Detection

- **Detected Stack**: `backend` (Node.js/TypeScript project with Jest)
- **Test Framework**: Jest with ts-jest (in `_bmad-output/test-artifacts/`)
- **No Playwright/Cypress**: This project uses file system validation tests
- **Pattern References**: `create-project-context-validation.spec.ts` (Story 1-5), `documentarian-agent-definition.spec.ts` (Story 6-1)

### Prerequisites Verification

- [x] Story approved with clear acceptance criteria (10 ACs identified)
- [x] Test framework configured (Jest + ts-jest in `_bmad-output/test-artifacts/package.json`)
- [x] Development environment available
- [x] Existing command/workflow/adapter patterns available for reference
- [x] Documentarian agent definition exists (Story 6-1 complete)

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

**Rationale**: Backend stack with clear acceptance criteria. All 10 ACs describe file structure/content validation (markdown file existence, YAML frontmatter fields, section structure, content patterns, workflow orchestration steps). Standard file system validation scenarios -- no browser recording needed.

## Step 3: Test Strategy

### Acceptance Criteria to Test Scenario Mapping

| AC# | Acceptance Criterion | Test Level | Priority | Scenarios |
|-----|---------------------|-----------|----------|-----------|
| AC1 | Command file exists at correct location | Unit (FS) | P0 | 18 tests: file exists, frontmatter fields (name, trigger, requires_status, sets_status, spawns_agents), field order, body sections (Purpose, Workflow Reference, Input, Output), section order, content validation |
| AC2 | Workflow file exists at correct location | Unit (FS) | P0 | 5 tests: file exists, meaningful content, full-scan mode, update mode, kebab-case |
| AC3 | Documentation output directory | Unit (FS) | P0-P2 | 3 tests: docs/generated/ reference, relative to project root, not inside scrum_workflow/ |
| AC4 | Agent and context loading | Unit (FS) | P0-P2 | 5 tests: documentarian agent reference, context/index.md reference, load order, warn if missing |
| AC5 | Full-scan mode orchestration | Unit (FS) | P0-P2 | 7 tests: structure scan, business-logic.md, workflows.md, domain-model.md, .scan-state.json, step order, default mode |
| AC6 | Update mode orchestration | Unit (FS) | P0-P2 | 7 tests: load scan state, identify changed files, re-analyze, diff summary, user confirmation, --update flag, story reference |
| AC7 | Project context reading | Unit (FS) | P0-P1 | 3 tests: context/index.md reference, domain determination, tech stack determination |
| AC8 | Directory creation | Unit (FS) | P0-P1 | 2 tests: create if not exists, before writing files |
| AC9 | Overwrite warning | Unit (FS) | P0-P2 | 3 tests: warning when exists, confirmation prompt, full-scan only |
| AC10 | Adapter skill creation | Unit (FS) | P0-P1 | 7 tests: file exists, frontmatter, name, trigger, description, framework_command, body reference |
| Cross | Structural compliance | Unit (FS) | P0-P2 | 21 tests: naming conventions, structure matching, Write Boundaries, three-layer architecture |

### Test Level Selection

- **Primary Level**: Unit (File System Validation)
- **No E2E**: Backend/file validation project, no browser-based testing needed
- **No API**: No API endpoints -- this is a markdown file validation story
- **Pattern**: Follows established pattern from `create-project-context-validation.spec.ts` and `documentarian-agent-definition.spec.ts`

### Priority Distribution

- **P0**: 39 tests (critical file structure and content validation)
- **P1**: 29 tests (detailed content quality, ordering, and convention compliance)
- **P2**: 13 tests (naming convention, markdown quality, edge cases)

### Red Phase Confirmation

All 81 tests are designed to FAIL because the command file, workflow file, and adapter skill do not exist yet. Tests use `test.skip()` to document intentional failure (TDD red phase).

## Step 4: Test Generation (Aggregate)

### TDD Red Phase Validation

- [x] All tests use `test.skip()` (TDD red phase compliant)
- [x] All tests assert expected behavior (not placeholder assertions)
- [x] No `expect(true).toBe(true)` placeholder assertions
- [x] Tests are deterministic, isolated, and focused

### Generated Test File

| File | Tests | Description |
|------|-------|-------------|
| `create-project-docs-command-workflow.spec.ts` | 81 | ATDD tests for Story 6-2 (RED PHASE) |

### Test Run Verification

```
Test Suites: 1 skipped, 0 of 1 total
Tests:       81 skipped, 81 total
Time:        0.593 s
```

All 81 tests skipped as expected (TDD RED phase confirmed).

### Acceptance Criteria Coverage

- [x] AC1: Command file exists at correct location (18 tests)
- [x] AC2: Workflow file exists at correct location (5 tests)
- [x] AC3: Documentation output directory (3 tests)
- [x] AC4: Agent and context loading (5 tests)
- [x] AC5: Full-scan mode orchestration (7 tests)
- [x] AC6: Update mode orchestration (7 tests)
- [x] AC7: Project context reading (3 tests)
- [x] AC8: Directory creation (2 tests)
- [x] AC9: Overwrite warning (3 tests)
- [x] AC10: Adapter skill creation (7 tests)
- [x] Cross-cutting: Naming/structural/three-layer compliance (21 tests)

### Fixture Needs

Minimal fixture infrastructure needed -- file system validation tests use `fs.readFileSync` and `fs.existsSync` directly. Helper functions provided inline:
- `extractFrontmatter()` -- extracts YAML frontmatter from markdown
- `extractBody()` -- extracts markdown body after frontmatter
- `extractSection()` -- extracts a specific section by ## heading from markdown body

## Step 5: Validation & Completion

### Validation Checklist

- [x] Prerequisites satisfied (story approved, test framework ready)
- [x] Test file created correctly at `_bmad-output/test-artifacts/create-project-docs-command-workflow.spec.ts`
- [x] Checklist matches all 10 acceptance criteria
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
- [x] Reference file comparison tests (structural matching against create-project-context.md)

### Completion Summary

| Metric | Value |
|--------|-------|
| Story ID | 6-2 |
| Story Title | /scrum-create-project-docs Command & Workflow Skeleton |
| Primary Test Level | Unit (File System Validation) |
| Total Tests | 81 |
| P0 Tests | 39 |
| P1 Tests | 29 |
| P2 Tests | 13 |
| Test File | `create-project-docs-command-workflow.spec.ts` |
| TDD Phase | RED (all tests skipped) |
| Execution Mode | Sequential (AI Generation) |
| Knowledge Fragments | 6 (data-factories, component-tdd, test-quality, test-healing-patterns, test-levels-framework, test-priorities-matrix) |

## Next Steps (TDD Green Phase)

After implementing the feature (3 files):

1. Remove `test.skip()` from all test functions in `create-project-docs-command-workflow.spec.ts`
2. Run tests: `cd _bmad-output/test-artifacts && npx jest create-project-docs-command-workflow.spec.ts --verbose`
3. Verify tests PASS (green phase)
4. If any tests fail:
   - Either fix implementation (feature does not meet AC)
   - Or fix test (test assertion incorrect)
5. Commit passing tests

### Implementation Guidance

**Files to create**:

1. `scrum_workflow/commands/create-project-docs.md` -- Command definition (Framework Layer)
2. `scrum_workflow/workflows/project-documentation.md` -- Workflow skeleton (Framework Layer)
3. `.claude/skills/create-project-docs.md` -- Adapter skill (Adapter Layer)

**Reference files**:
- `scrum_workflow/commands/create-project-context.md` -- Primary command pattern reference
- `scrum_workflow/commands/create-ticket.md` -- Secondary command pattern reference
- `scrum_workflow/workflows/project-context.md` -- Primary workflow pattern reference
- `.claude/skills/create-project-context.md` -- Primary adapter skill pattern reference
- `scrum_workflow/agents/documentarian.md` -- Agent definition this command spawns (Story 6-1)

**Key requirements**:
- Command: `spawns_agents: [documentarian]` (unlike other commands that have `[]`)
- Workflow: Two modes -- `full-scan` (default) and `update` (--update flag)
- Workflow: Must have Write Boundaries section permitting only `docs/generated/` writes
- Workflow: Must have Prerequisites, numbered steps, overwrite warning
- Adapter: Thin reference only -- NO workflow logic in the adapter
- Three-layer separation: command in `scrum_workflow/commands/`, workflow in `scrum_workflow/workflows/`, adapter in `.claude/skills/`

### Execution Commands

```bash
# Run all Story 6-2 tests
cd _bmad-output/test-artifacts && npx jest create-project-docs-command-workflow.spec.ts --verbose

# Run specific AC tests
cd _bmad-output/test-artifacts && npx jest create-project-docs-command-workflow.spec.ts -t "AC1"
cd _bmad-output/test-artifacts && npx jest create-project-docs-command-workflow.spec.ts -t "AC5"
cd _bmad-output/test-artifacts && npx jest create-project-docs-command-workflow.spec.ts -t "AC10"

# Run cross-cutting tests
cd _bmad-output/test-artifacts && npx jest create-project-docs-command-workflow.spec.ts -t "Cross-cutting"

# Run with watch mode during development
cd _bmad-output/test-artifacts && npx jest create-project-docs-command-workflow.spec.ts --watch
```

### Recommended Next Workflow

- **bmad-dev-story** -- Execute story 6-2 implementation using the story spec file
- After implementation passes all tests, run **bmad-testarch-trace** for traceability matrix
