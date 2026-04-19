---
stepsCompleted: ['step-01-preflight-and-context']
lastStep: 'step-01-preflight-and-context'
lastSaved: '2026-04-08'
workflowType: 'testarch-atdd'
inputDocuments: ['_scrum-output/implementation-artifacts/2-2-implement-scrum-approve-command.md', 'planning-artifacts/prd.md', 'planning-artifacts/architecture.md']
---

# ATDD Checklist - Epic 2, Story 2.2: Implement `/scrum-approve` Command

**Date:** 2026-04-08
**Author:** Sami
**Primary Test Level:** Backend/CLI Logic

---

## Story Summary

Implement the `/scrum-approve` command as a mandatory human gate before a story reaches the `done` status. This ensures explicit approval is recorded and tracked in the story's history.

**As a** developer
**I want** to approve a completed story via `/scrum-approve`
**So that** no story reaches `done` without explicit human approval.

---

## Acceptance Criteria

1. **Given** FR-5 specifies `/scrum-approve` as mandatory gate before `done` **When** a developer runs `/scrum-approve SW-XXX` on a story with status `approved` (post-review) **Then** an `approval-N.md` artifact is created in `_scrum-output/sprints/SW-XXX/` **And** the artifact contains: approval timestamp, approver identity, approval reasoning/notes **And** the story status transitions to `done` **And** a `status_history` entry is appended with `trigger: /scrum-approve`, `actor: human`
2. **Given** the story is not in a valid status for approval **When** a developer runs `/scrum-approve SW-XXX` **Then** the system produces an actionable error message indicating the current status and required status **And** the story status remains unchanged
3. **Given** SC-3 specifies no story reaches `done` without explicit `/scrum-approve` **When** any other command attempts to transition a story to `done` **Then** the transition is blocked **And** only `/scrum-approve` can set status to `done`
4. **Given** the Architecture specifies write boundaries **When** `/scrum-approve` executes **Then** it only writes `approval-N.md` and status in `story.md` **And** no other files are modified

---

## Failing Tests Created (RED Phase)

### Backend/CLI Tests (4 tests)

**File:** `tests/unit/approve/approve-command.spec.ts` (0 lines - file to be created)

- ✅ **Test:** Successful approval creates artifact and updates status
  - **Status:** RED - Command not implemented
  - **Verifies:** AC1: Correct artifact generation and status transition to 'done'
- ✅ **Test:** Approval fails for invalid story status
  - **Status:** RED - Command not implemented
  - **Verifies:** AC2: Error handling when story is not in 'approved' status
- ✅ **Test:** Only /scrum-approve can transition to done
  - **Status:** RED - Logic not implemented
  - **Verifies:** AC3: Enforcement of mandatory approval gate
- ✅ **Test:** Write boundary compliance
  - **Status:** RED - Command not implemented
  - **Verifies:** AC4: Command only modifies allowed files

---

## Data Factories Created

### Story Factory

**File:** `tests/support/factories/story.factory.ts`

**Exports:**

- `createStory(overrides?)` - Create single story with optional overrides

**Example Usage:**

```typescript
const story = createStory({ status: 'approved', id: 'SW-123' });
```

---

## Required data-testid Attributes

*N/A for CLI command*

---

## Implementation Checklist

### Test: Successful approval creates artifact and updates status

**File:** `tests/unit/approve/approve-command.spec.ts`

**Tasks to make this test pass:**

- [ ] Implement `/scrum-approve` command logic
- [ ] Implement approval artifact generation using template
- [ ] Implement `status_history` appending logic
- [ ] Run test: `npm test tests/unit/approve/approve-command.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 2 hours

---

## Running Tests

```bash
# Run all tests for this story
npm test tests/unit/approve/

# Run specific test file
npx vitest tests/unit/approve/approve-command.spec.ts
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests defined and ready for implementation
- ✅ Story context loaded and analyzed
- ✅ Implementation checklist created

**Verification:**

- Tests are mapped to ACs
- Checklist provides clear roadmap for implementation

---

## Knowledge Base References Applied

- **test-quality.md** - Test design principles applied to command validation
- **test-levels-framework.md** - Selected Backend/CLI level for logic validation
- **data-factories.md** - Story factory pattern defined for test setup
- **test-priorities-matrix.md** - P0 priority assigned to core approval logic

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `npm test tests/unit/approve/`

**Results:**

```
FAIL  tests/unit/approve/approve-command.spec.ts [ tests/unit/approve/approve-command.spec.ts ]
Error: Command '/scrum-approve' not found
```

**Summary:**

- Total tests: 4
- Passing: 0 (expected)
- Failing: 4 (expected)
- Status: ✅ RED phase verified

---

**Generated by Scrum Workflow TEA Agent** - 2026-04-08
