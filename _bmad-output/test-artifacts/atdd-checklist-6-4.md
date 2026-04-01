---
stepsCompleted: ['step-01-preflight-and-context']
lastStep: 'step-01-preflight-and-context'
lastSaved: '2026-03-30'
workflowType: 'testarch-atdd'
inputDocuments:
  - '_bmad/tea/testarch/knowledge/test-quality.md'
  - '_bmad/tea/testarch/knowledge/test-healing-patterns.md'
  - '_bmad/tea/testarch/knowledge/data-factories.md'
  - '_bmad/tea/testarch/knowledge/component-tdd.md'
  - '_bmad-output/implementation-artifacts/6-4-workflow-and-state-machine-documentation.md'
  - '_bmad/tea/config.yaml'
---

# ATDD Checklist - Epic 6, Story 6-4: Workflow & State Machine Documentation with `workflows.md`

**Date:** 2026-03-30
**Author:** Sami (Auto-generated in YOLO mode)
**Primary Test Level:** Documentation Validation Tests

---

## Story Summary

Story 6-4 implements workflow and state machine documentation generation for the business logic documentation agent. The agent will scan codebases for workflows, state machines, event flows, process pipelines, and async workflows, then generate comprehensive documentation with Mermaid diagrams.

**As a** developer
**I want** the agent to trace and document all workflows, state machines, and process flows in my codebase
**So that** I can see how data and control flow through the system's business processes

---

## Acceptance Criteria

1. **Grep-based workflow scanning**: The agent scans the codebase using Grep patterns to identify workflows (language-agnostic, no AST):
   - State machines and status transitions (`status`, `state`, `transition`, `FSM`, `machine`)
   - Event handlers (`on*`, `handle*`, `emit`, `dispatch`, `subscribe`, `publish`)
   - Pipeline and middleware chains (`pipe`, `use`, `middleware`, `chain`, `step`)
   - Process orchestration (`saga`, `workflow`, `process`, `orchestrat*`)
   - Async flows (`then`, `await`, `promise`, `callback`, `queue`, `job`)

2. **Output template exists**: `scrum_workflow/templates/workflows-doc.md` exists as the output template with sections: Overview, State Machines, Event Flows, Process Pipelines, Async Workflows

3. **Generated output follows template**: The generated `docs/generated/workflows.md` follows the template structure from AC #2

4. **Workflow documentation completeness**: Each documented workflow includes:
   - Workflow name/description
   - Trigger/entry point (file:line)
   - Steps in sequence
   - Exit conditions/outcomes

5. **Mermaid diagrams for workflows**:
   - State machines documented with Mermaid `stateDiagram-v2` showing all states and transitions
   - Event flows documented with Mermaid `sequenceDiagram` showing participants and message flow
   - Process pipelines documented with Mermaid `flowchart LR` showing pipeline stages

---

## Test Strategy for Documentation Story

This is a **documentation/template generation story**, not a typical feature with user-facing functionality. The testing approach focuses on:

1. **File existence validation**: Verify required template files are created
2. **Template structure validation**: Verify template follows required sections
3. **Content validation**: Verify generated output matches template structure
4. **Integration validation**: Verify workflow step updates are correct

**Test Stack Type:** Documentation Validation (special case)
**Test Framework:** File-based validation with structured assertions

---

## Test Categories

### 1. Template File Creation Tests

**Test:** TC-6-4-001: workflows-doc.md template exists
- **File:** `tests/docs/template-existence.test.ts`
- **Status:** RED - File not yet created
- **Verifies:** AC #2 - Template file exists with correct sections
- **Expected failure:** File `scrum_workflow/templates/workflows-doc.md` does not exist

### 2. Template Structure Tests

**Test:** TC-6-4-002: Template has required sections
- **File:** `tests/docs/template-structure.test.ts`
- **Status:** RED - Template not created yet
- **Verifies:** AC #2 - All required sections present
- **Required sections:**
  - Overview
  - State Machines
  - Event Flows
  - Process Pipelines
  - Async Workflows

### 3. Template Format Tests

**Test:** TC-6-4-003: Template is pure Markdown without YAML frontmatter
- **File:** `tests/docs/template-format.test.ts`
- **Status:** RED - Template not created yet
- **Verifies:** Template follows output artifact pattern (no YAML, pure Markdown)
- **Reference:** Story 6-3 pattern for business-logic.md

### 4. Mermaid Placeholder Tests

**Test:** TC-6-4-004: Template includes Mermaid diagram placeholders
- **File:** `tests/docs/template-mermaid.test.ts`
- **Status:** RED - Template not created yet
- **Verifies:** AC #5 - Mermaid placeholders for all diagram types
- **Required placeholders:**
  - `stateDiagram-v2` for state machines
  - `sequenceDiagram` for event flows
  - `flowchart LR` for process pipelines

### 5. Placeholder Comment Tests

**Test:** TC-6-4-005: Template has placeholder comments for content injection
- **File:** `tests/docs/template-placeholders.test.ts`
- **Status:** RED - Template not created yet
- **Verifies:** Template has `<!-- Fill from documentarian analysis -->` style comments

### 6. Workflow Step Update Tests

**Test:** TC-6-4-006: Step 5.2 updated with concrete implementation
- **File:** `tests/docs/workflow-update.test.ts`
- **Status:** RED - "See Story 6.4" placeholder still present
- **Verifies:** AC #1, #3 - Workflow Step 5.2 has concrete implementation
- **File to modify:** `scrum_workflow/workflows/project-documentation.md`

### 7. Grep Pattern Definition Tests

**Test:** TC-6-4-007: Grep patterns defined for workflow detection
- **File:** `tests/docs/grep-patterns.test.ts`
- **Status:** RED - Patterns not yet documented in workflow step
- **Verifies:** AC #1 - All required grep patterns documented
- **Required patterns:**
  - State machines: `\b(status|state|transition|fsm|finite.*state|state.*machine)\b`
  - Event handlers: `\bon[A-Z]\w*`, `\bhandle[A-Z]\w*`, `\bemit\b`, `\bdispatch\b`
  - Pipelines: `\bpipe\b`, `\buse\b`, `\bmiddleware\b`, `\bchain\b`
  - Orchestration: `\bsaga\b`, `\bworkflow\b`, `\bprocess\b`, `\borchestrat`
  - Async flows: `\bthen\b`, `\bawait\b`, `\bpromise\b`, `\bqueue\b`, `\bjob\b`

### 8. Exclusion Filter Tests

**Test:** TC-6-4-008: Exclusion filter defined in workflow step
- **File:** `tests/docs/exclusion-filters.test.ts`
- **Status:** RED - Filters not yet documented
- **Verifies:** AC #1 - Files excluded from scan
- **Required exclusions:** `node_modules/`, `dist/`, `build/`, `.git/`, `vendor/`, `__pycache__/`, `docs/generated/`, `scrum_workflow/`, test files

### 9. Categorization Logic Tests

**Test:** TC-6-4-009: Workflow categorization logic defined
- **File:** `tests/docs/categorization.test.ts`
- **Status:** RED - Logic not yet documented
- **Verifies:** AC #1 - Workflows categorized into 5 types
- **Categories:** State Machines, Event Flows, Process Pipelines, Async Workflows, Orchestration

### 10. Mermaid Generation Instructions Tests

**Test:** TC-6-4-010: Mermaid diagram generation instructions complete
- **File:** `tests/docs/mermaid-instructions.test.ts`
- **Status:** RED - Instructions not yet documented
- **Verifies:** AC #5 - All Mermaid diagram types have generation instructions
- **Required:**
  - stateDiagram-v2 generation (states, transitions, initial, terminal)
  - sequenceDiagram generation (participants, messages, direction)
  - flowchart LR generation (stages, data flow, decisions)

### 11. Source Reference Format Tests

**Test:** TC-6-4-011: Source reference format defined and applied
- **File:** `tests/docs/source-references.test.ts`
- **Status:** RED - Format not yet documented
- **Verifies:** AC #4 - Every workflow includes `[Source: path/to/file.ext:LINE]`
- **Format:** Relative paths from project root, file:line references

### 12. Integration with Documentarian Agent Tests

**Test:** TC-6-4-012: Template matches agent Output Format specification
- **File:** `tests/docs/agent-integration.test.ts`
- **Status:** RED - Verification not yet possible
- **Verifies:** Template structure matches `scrum_workflow/agents/documentarian.md` Output Format > workflows.md section

### 13. Write Boundaries Tests

**Test:** TC-6-4-013: Write boundaries respected
- **File:** `tests/docs/write-boundaries.test.ts`
- **Status:** RED - Files not yet created
- **Verifies:** Story 6-4 only writes to:
  - `scrum_workflow/templates/workflows-doc.md` (create)
  - `scrum_workflow/workflows/project-documentation.md` (modify Step 5.2 only)
  - Does NOT write to: agent definition, command file, adapter skill

---

## Implementation Checklist

### Test TC-6-4-001: Create workflows-doc.md template

**File:** `scrum_workflow/templates/workflows-doc.md`

**Tasks to make this test pass:**

- [ ] Create `scrum_workflow/templates/workflows-doc.md` as pure Markdown file (no YAML frontmatter)
- [ ] Add Overview section with summary and analysis timestamp placeholder
- [ ] Add State Machines section with stateDiagram-v2 placeholder
- [ ] Add Event Flows section with sequenceDiagram placeholder
- [ ] Add Process Pipelines section with flowchart LR placeholder
- [ ] Add Async Workflows section with flowchart TD placeholder
- [ ] Add placeholder comments: `<!-- Fill from documentarian analysis -->`
- [ ] Follow business-logic.md pattern from Story 6.3
- [ ] Verify file exists at correct location
- [ ] Run test: `npm test -- tests/docs/template-existence.test.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test TC-6-4-002: Template has all required sections

**File:** `scrum_workflow/templates/workflows-doc.md`

**Tasks to make this test pass:**

- [ ] Verify Overview section exists with heading `## Overview`
- [ ] Verify State Machines section exists with heading `## State Machines`
- [ ] Verify Event Flows section exists with heading `## Event Flows`
- [ ] Verify Process Pipelines section exists with heading `## Process Pipelines`
- [ ] Verify Async Workflows section exists with heading `## Async Workflows`
- [ ] Add entry format placeholders in each section
- [ ] Add Mermaid diagram placeholders in appropriate sections
- [ ] Run test: `npm test -- tests/docs/template-structure.test.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test TC-6-4-003: Template is pure Markdown (no YAML frontmatter)

**File:** `scrum_workflow/templates/workflows-doc.md`

**Tasks to make this test pass:**

- [ ] Verify file starts with heading `# Workflows & State Machines` (not `---`)
- [ ] Verify no YAML frontmatter present
- [ ] Follow output artifact pattern (not stateful artifact pattern)
- [ ] Reference Story 6.3's business-logic.md as example
- [ ] Run test: `npm test -- tests/docs/template-format.test.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.25 hours

---

### Test TC-6-4-006: Update workflow Step 5.2 with concrete implementation

**File:** `scrum_workflow/workflows/project-documentation.md`

**Tasks to make this test pass:**

- [ ] Locate Step 5.2 with "**See Story 6.4**" placeholder
- [ ] Replace placeholder with concrete implementation steps
- [ ] Add grep pattern definitions (reference agent definition, don't redefine)
- [ ] Add exclusion filter documentation
- [ ] Add categorization logic documentation
- [ ] Add Mermaid generation instructions
- [ ] Add source reference format documentation
- [ ] Add output write instructions
- [ ] Follow Story 6.3 pattern for Step 5.1 update
- [ ] Run test: `npm test -- tests/docs/workflow-update.test.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test TC-6-4-012: Template matches agent Output Format

**File:** `scrum_workflow/templates/workflows-doc.md` + `scrum_workflow/agents/documentarian.md`

**Tasks to make this test pass:**

- [ ] Read `scrum_workflow/agents/documentarian.md` Output Format > workflows.md section
- [ ] Verify template sections match agent specification exactly
- [ ] Verify Mermaid diagram types match
- [ ] Verify entry format matches
- [ ] Document any discrepancies in test
- [ ] Align template with agent specification
- [ ] Run test: `npm test -- tests/docs/agent-integration.test.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

## Running Tests

```bash
# Run all failing tests for this story
npm test -- tests/docs/

# Run specific test file
npm test -- tests/docs/template-existence.test.ts

# Run tests in watch mode
npm test -- tests/docs/ -- --watch

# Run tests with coverage
npm test -- tests/docs/ -- --coverage
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests written and failing
- ✅ Test checklist created with all acceptance criteria mapped to tests
- ✅ Implementation checklist created with tasks for each test
- ✅ Test strategy documented for documentation story

**Verification:**

- 13 test cases documented covering all acceptance criteria
- Each test has expected failure reason documented
- Implementation tasks defined for each failing test
- Effort estimates provided

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with TC-6-4-001 to create template file)
2. **Read the test requirements** to understand expected behavior
3. **Implement minimal code** to make that specific test pass
4. **Run the test** to verify it now passes (green)
5. **Check off the task** in implementation checklist
6. **Move to next test** and repeat

**Key Principles:**

- One test at a time (don't try to fix all at once)
- Minimal implementation (don't over-engineer)
- Run tests frequently (immediate feedback)
- Use implementation checklist as roadmap

**Progress Tracking:**

- Check off tasks as you complete them
- Share progress in daily standup

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all tests pass** (green phase complete)
2. **Review template for quality** (clarity, completeness, consistency)
3. **Extract duplications** (follow business-logic.md pattern)
4. **Optimize structure** (ensure template is clean and well-organized)
5. **Ensure tests still pass** after each refactor
6. **Update documentation** (if any patterns change)

**Key Principles:**

- Tests provide safety net (refactor with confidence)
- Make small refactors (easier to debug if tests fail)
- Run tests after each change
- Don't change test behavior (only implementation)

**Completion:**

- All tests pass
- Template quality meets team standards
- Template follows established patterns
- Ready for code review and story approval

---

## Next Steps

1. **Share this checklist** with the dev workflow (manual handoff)
2. **Review this checklist** with team in standup or planning
3. **Begin implementation** using implementation checklist as guide
4. **Work one test at a time** (red → green for each)
5. **Share progress** in daily standup
6. **When all tests pass**, refactor template for quality
7. **When refactoring complete**, manually update story status to 'done' in sprint-status.yaml

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **test-quality.md** - Test design principles (Given-When-Then, one assertion per test, determinism, isolation)
- **test-healing-patterns.md** - Common failure patterns and automated fixes
- **data-factories.md** - Factory patterns for test data (adapted for documentation validation)
- **component-tdd.md** - TDD workflow principles (red-green-refactor cycle)

See `tea-index.csv` for complete knowledge fragment mapping.

---

## Notes

- This is a **documentation story** requiring specialized test approach
- Tests validate file existence, structure, format, and content compliance
- No traditional E2E/API tests needed - this is framework-level work
- Integration tests verify workflow and agent alignment
- Reference Story 6.3 pattern for business-logic.md template as model
- Template must be pure Markdown (no YAML frontmatter) - output artifact pattern
- Workflow Step 5.2 update should reference agent definition, not duplicate logic

---

## Contact

**Questions or Issues?**

- Ask in team standup
- Tag @TEA Agent in Slack/Discord
- Refer to `./bmm/docs/tea-README.md` for workflow documentation
- Consult `./bmm/testarch/knowledge` for testing best practices

---

**Generated by BMad TEA Agent** - 2026-03-30 (YOLO Mode: Auto-generated without user confirmation)
