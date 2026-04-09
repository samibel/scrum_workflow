---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-09'
story_id: '8.4'
detected_stack: 'backend'
inputDocuments:
  - '_bmad-output/implementation-artifacts/8-4-implement-sprint-status-command.md'
  - 'scrum_workflow/package.json'
  - '_bmad/tea/config.yaml'
  - 'resources/knowledge/data-factories.md'
  - 'resources/knowledge/test-quality.md'
  - 'resources/knowledge/test-levels-framework.md'
  - 'resources/knowledge/test-priorities-matrix.md'
  - 'resources/knowledge/test-healing-patterns.md'
---

# ATDD Checklist: Story 8.4 - Implement Sprint Status Command

## 1. Preflight & Context Loading

- [x] Stack detected: `backend` (Node.js CLI)
- [x] Story context loaded: 8.4 - Implement Sprint Status Command
- [x] Test framework verified: Vitest
- [x] Knowledge base fragments loaded:
    - data-factories.md
    - test-quality.md
    - test-levels-framework.md
    - test-priorities-matrix.md
    - test-healing-patterns.md

## 2. Story Analysis (Inputs)

- **Goal**: Implement `/sprint-status` command to show all stories with their current status, age, and pending actions
- **Success Criteria**:
    - AC1: Command scans `_scrum-output/sprints/` for story directories and displays summary table
    - AC2: Stories sorted by status priority, stories requiring action highlighted
    - AC3: Empty state message when no stories found
- **Constraints**:
    - Must use Vitest for tests
    - Read-only command (only reads, no writes)
    - Must respect UX-DR6 (semantic color system)

## 2. Generation Mode Selection

- Chosen Mode: **AI Generation**
- Rationale: Project is `backend` (CLI tool), and acceptance criteria are clear. No browser recording needed.

## 3. Test Strategy

- [x] **AC1: Story Directory Scanning**: Verify `/sprint-status` scans `_scrum-output/sprints/` for story directories
- [x] **AC2: Status Priority Sorting**: Verify stories sorted by priority (changes-needed > blocked > in-progress > ...)
- [x] **AC3: Empty State Handling**: Verify empty state message when no stories found
- [x] **AC4: Table Columns**: Story ID | Title | Status | Age (days) | Pending Action
- [x] **AC5: Color Coding**: Semantic colors per UX-DR6
- [x] **AC6: --epic Filter**: Optional filter flag to show only specific epic stories

## 4. Test Generation (Failing Tests)

- [x] Created `tests/unit/sprint-status/ac1-sprint-status-command.spec.ts`
- [x] Created `tests/unit/sprint-status/ac2-status-sorting.spec.ts`
- [x] Created `tests/unit/sprint-status/ac3-empty-state.spec.ts`
- [x] Created `tests/unit/sprint-status/ac4-table-formatting.spec.ts`
- [x] Created `tests/unit/sprint-status/ac5-epic-filter.spec.ts`
- [x] Tests cover all ACs with P0/P1 priority
- [x] Pattern alignment with existing project tests (e.g., audit-trail, status-guard-validation)

## 5. Validation & Finalization

- [x] Verified tests fail (RED phase) via `npm test` equivalent.
- [x] Verified no regressions in existing test runner.
- [x] Checklist finalized and ready for dev.
