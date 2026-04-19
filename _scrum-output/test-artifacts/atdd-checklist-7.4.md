---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests']
lastStep: 'step-04-generate-tests'
lastSaved: '2026-04-09'
workflowType: 'testarch-atdd'
inputDocuments: 
  - '_scrum-output/implementation-artifacts/7-4-implement-session-wrap-up.md'
  - '_scrum-output/tea/config.yaml'
  - 'package.json'
  - 'vitest.config.js'
---

# ATDD Checklist - Epic 7, Story 7.4: Implement Session Wrap-Up

**Date:** 2026-04-09
**Author:** Claude TEA Agent
**Primary Test Level:** Unit & Integration (Backend)

---

## Story Summary

This story implements the `/wrap-up` session command that creates session summary artifacts capturing what was accomplished during a developer session, including stories worked on, status changes, decisions made, risks identified, and pending actions for resumption.

**As a** developer
**I want** `/wrap-up` to create a session summary capturing what was accomplished and what's pending
**So that** the next session can pick up seamlessly

---

## Acceptance Criteria

1. **AC-1: Session Summary Creation**
   - Given FR-28 specifies `/wrap-up` creates a session summary artifact
   - When a developer runs `/wrap-up`
   - Then a `session-{YYYY-MM-DD}.md` artifact is created in `_scrum-output/memory/sessions/`
   - And the summary contains: stories worked on, status changes made, decisions taken, risks identified, pending actions

2. **AC-2: Frontmatter and Content Structure**
   - Given the session summary artifact
   - When it is created
   - Then it contains YAML frontmatter with: date, stories touched, session duration context
   - And the content is structured for easy scanning by `/session-start`

3. **AC-3: Collision Handling**
   - Given multiple sessions on the same day
   - When `/wrap-up` is run again
   - Then the existing session file is updated (not overwritten) with additional entries
   - Or a new file with a sequence suffix is created to prevent data loss

---

## Failing Tests Created (RED Phase)

### Unit Tests (9 tests)

**File:** `__tests__/wrap-up/ac1-session-summary-creation.test.js` (123 lines)

- ✅ **Test:** should create session-{YYYY-MM-DD}.md artifact in _scrum-output/memory/sessions/
  - **Status:** RED - Module `wrap-up-impl.js` not yet created
  - **Verifies:** Session summary file creation with correct naming convention

- ✅ **Test:** should include stories worked on in the summary
  - **Status:** RED - `createSessionSummary` function not yet implemented
  - **Verifies:** Session summary contains "## Stories Worked On" section

- ✅ **Test:** should include decisions taken in the summary
  - **Status:** RED - Implementation module missing
  - **Verifies:** Session summary contains "## Decisions Made" section

- ✅ **Test:** should include risks identified in the summary
  - **Status:** RED - Implementation module missing
  - **Verifies:** Session summary contains "## Risks Identified" section

- ✅ **Test:** should include pending actions in the summary
  - **Status:** RED - Implementation module missing
  - **Verifies:** Session summary contains "## Pending Actions" section

- ✅ **Test:** should use correct naming format session-YYYY-MM-DD.md
  - **Status:** RED - Implementation module missing
  - **Verifies:** Filename follows exact format requirement

**File:** `__tests__/wrap-up/ac2-frontmatter-and-content.test.js` (142 lines)

- ✅ **Test:** should contain YAML frontmatter
  - **Status:** RED - `createSessionSummary` not implemented
  - **Verifies:** Session file starts with `---` and contains frontmatter

- ✅ **Test:** should have date field in frontmatter
  - **Status:** RED - Implementation missing
  - **Verifies:** Frontmatter includes `date:` field

- ✅ **Test:** should have stories_touched field in frontmatter
  - **Status:** RED - Implementation missing
  - **Verifies:** Frontmatter includes `stories_touched:` field

- ✅ **Test:** should have session_duration field in frontmatter
  - **Status:** RED - Implementation missing
  - **Verifies:** Frontmatter includes `session_duration:` field

- ✅ **Test:** should have schema_version in frontmatter
  - **Status:** RED - Implementation missing
  - **Verifies:** Frontmatter includes `schema_version:` field with version number

- ✅ **Test:** should structure content with clear section headers
  - **Status:** RED - Implementation missing
  - **Verifies:** Content uses markdown `## Section` format for readability

- ✅ **Test:** should be scannable by session-start with clear structure
  - **Status:** RED - Implementation missing
  - **Verifies:** Content follows parseable markdown structure

**File:** `__tests__/wrap-up/ac3-collision-handling.test.js` (181 lines)

- ✅ **Test:** should create initial session file with base name
  - **Status:** RED - Implementation module missing
  - **Verifies:** First call creates `session-YYYY-MM-DD.md`

- ✅ **Test:** should append to existing session file when called twice same day
  - **Status:** RED - Append/collision logic not implemented
  - **Verifies:** Second call on same day appends or creates sequence file

- ✅ **Test:** should preserve data when collision occurs
  - **Status:** RED - Collision handling not implemented
  - **Verifies:** Original content not lost when collision happens

- ✅ **Test:** should create sequence suffix file when collision detected
  - **Status:** RED - Sequence suffix logic missing
  - **Verifies:** Uses pattern `session-YYYY-MM-DD-N.md` for collisions

- ✅ **Test:** should use sequence suffix pattern session-YYYY-MM-DD-N.md when needed
  - **Status:** RED - Pattern generation not implemented
  - **Verifies:** Correct naming format with numeric suffix

- ✅ **Test:** should not lose data from first wrap when second wrap collides
  - **Status:** RED - Data preservation logic missing
  - **Verifies:** Content integrity preserved across multiple calls

---

## Test Execution Summary

**Total Tests:** 18 failing tests
- **AC-1 Tests:** 6 tests (file creation, content sections)
- **AC-2 Tests:** 7 tests (frontmatter, structure, scannability)
- **AC-3 Tests:** 6 tests (collision handling, data preservation)

**Test Framework:** Vitest 4.1.3
**Test Stack:** Backend (Node.js)
**Execution Level:** Unit & Integration

---

## Data Factories Created

### Session Summary Factory

**File:** `scrum_workflow/utils/session-summary.js`

**Exports (to be implemented):**

- `gatherSessionContext(sprintsDir, sessionStartTime)` - Scan stories modified after session start
- `extractStatusChanges(stories, sessionStartTime)` - Detect status transitions
- `loadSessionDecisions(decisionsDir, sessionStartTime)` - Load decisions created in session
- `loadSessionRisks(risksDir, sessionStartTime)` - Load risks created/modified in session
- `derivePendingActions(stories, statusChanges, unresolved_risks)` - Identify next actions
- `formatSessionSummary(sessionContext, statusChanges, decisions, risks, pendingActions)` - Render markdown
- `writeSessionSummary(sessionsDir, summary)` - Create/update session file with collision handling
- `parseSessionStartTime()` - Determine session start time from environment or context
- `createSessionSummary(options)` - Orchestrator function (used by tests)

**Example Usage (Expected):**

```javascript
import { createSessionSummary } from './scrum_workflow/utils/session-summary.js';

const summary = await createSessionSummary({
  sprintsDir: '_scrum-output/sprints',
  decisionsDir: '_scrum-output/memory/decisions',
  risksDir: '_scrum-output/memory/risks',
  outputDir: '_scrum-output/memory/sessions',
  sessionStartTime: new Date('2026-04-09T10:00:00Z')
});
```

---

## Mock Requirements

### File System Mocks

**Dependency:** Node.js built-in `fs` module (readFileSync, writeFileSync, readdirSync, existsSync)

**Success Response:** File operations succeed with UTF-8 encoded markdown content

**Failure Response:** Directory not found, permission denied, file corrupted

**Notes:** Tests use real filesystem for integration testing; mocks not required for acceptance criteria validation

---

## Required Implementation Artifacts

### Core Implementation Files

**File:** `scrum_workflow/skills/wrap-up/wrap-up-impl.js`

- **Purpose:** Main implementation module for session summary creation
- **Exports:** `createSessionSummary(options)` function
- **Dependencies:** fs (Node.js), utils/session-summary.js

### Utility Module

**File:** `scrum_workflow/utils/session-summary.js`

- **Purpose:** Core business logic for session summary generation
- **Exports:** All utility functions listed above
- **Dependencies:** fs (Node.js), path (Node.js)

### Template

**File:** `scrum_workflow/templates/session-summary.md`

- **Purpose:** Markdown template for session-{YYYY-MM-DD}.md artifacts
- **Frontmatter:** date, schema_version, session_duration, stories_touched, decisions_created, risks_identified
- **Content Sections:** Stories Worked On, Status Changes, Decisions Made, Risks Identified, Pending Actions

### Command Specification

**File:** `scrum_workflow/commands/wrap-up.md`

- **Purpose:** `/wrap-up` command interface specification
- **Parameters:** None (session-level command, no ticket argument)
- **Output:** Session summary markdown artifact

### Workflow Specification

**File:** `scrum_workflow/workflows/wrap-up.md`

- **Purpose:** Step-by-step workflow for session summary creation
- **Steps:** Gather context, extract changes, load decisions/risks, derive actions, format, write

### Skill Specification

**File:** `scrum_workflow/skills/wrap-up/SKILL.md`

- **Purpose:** Declarative skill definition
- **Inputs:** sprintsDir, decisionsDir, risksDir, outputDir, sessionStartTime
- **Outputs:** session-{YYYY-MM-DD}.md artifact

---

## Implementation Checklist

### Test: should create session-{YYYY-MM-DD}.md artifact in _scrum-output/memory/sessions/

**File:** `__tests__/wrap-up/ac1-session-summary-creation.test.js`

**Tasks to make this test pass:**

- [ ] Create `scrum_workflow/utils/session-summary.js` with ESM exports
- [ ] Implement `gatherSessionContext()` to scan sprint directory
- [ ] Implement `createSessionSummary()` orchestrator function
- [ ] Create `_scrum-output/memory/sessions/` directory if missing
- [ ] Write session file with correct naming: `session-YYYY-MM-DD.md`
- [ ] Return created file path
- [ ] Run test: `npm test -- __tests__/wrap-up/ac1-session-summary-creation.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 2 hours

---

### Test: should include stories worked on in the summary

**File:** `__tests__/wrap-up/ac1-session-summary-creation.test.js`

**Tasks to make this test pass:**

- [ ] Implement `gatherSessionContext(sprintsDir, sessionStartTime)` function
- [ ] Use `readdirSync()` to scan sprint directory
- [ ] Filter stories by file modification time >= sessionStartTime
- [ ] Extract story metadata (ticket, title, status)
- [ ] Format "## Stories Worked On" section in output
- [ ] Include story list with ticket, title, and status
- [ ] Run test: `npm test -- ac1-session-summary-creation.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1.5 hours

---

### Test: should include decisions taken in the summary

**File:** `__tests__/wrap-up/ac1-session-summary-creation.test.js`

**Tasks to make this test pass:**

- [ ] Implement `loadSessionDecisions(decisionsDir, sessionStartTime)` function
- [ ] Scan `_scrum-output/memory/decisions/` for DR-*.md files
- [ ] Parse YAML frontmatter from decision records
- [ ] Filter by creation date >= sessionStartTime
- [ ] Format "## Decisions Made" section
- [ ] List decisions with decision number and summary
- [ ] Run test: `npm test -- ac1-session-summary-creation.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1.5 hours

---

### Test: should include risks identified in the summary

**File:** `__tests__/wrap-up/ac1-session-summary-creation.test.js`

**Tasks to make this test pass:**

- [ ] Implement `loadSessionRisks(risksDir, sessionStartTime)` function
- [ ] Scan `_scrum-output/memory/risks/` for RN-*.md files
- [ ] Parse YAML frontmatter for risk metadata
- [ ] Filter by creation/modification date >= sessionStartTime
- [ ] Format "## Risks Identified" section
- [ ] Include risk number, description, and severity
- [ ] Run test: `npm test -- ac1-session-summary-creation.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1.5 hours

---

### Test: should include pending actions in the summary

**File:** `__tests__/wrap-up/ac1-session-summary-creation.test.js`

**Tasks to make this test pass:**

- [ ] Implement `derivePendingActions(stories, statusChanges, unresolved_risks)` function
- [ ] Identify incomplete stories (status !== 'done')
- [ ] Identify unresolved risks from risk notes
- [ ] Create actionable next steps from incomplete items
- [ ] Format "## Pending Actions" section
- [ ] List actions by priority and category
- [ ] Run test: `npm test -- ac1-session-summary-creation.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 2 hours

---

### Test: should have date field in frontmatter

**File:** `__tests__/wrap-up/ac2-frontmatter-and-content.test.js`

**Tasks to make this test pass:**

- [ ] Implement `formatSessionSummary()` function
- [ ] Add YAML frontmatter to output
- [ ] Include `date: YYYY-MM-DD` field
- [ ] Use ISO 8601 format for date
- [ ] Validate frontmatter is properly formatted (---...---)
- [ ] Run test: `npm test -- ac2-frontmatter-and-content.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test: should have stories_touched field in frontmatter

**File:** `__tests__/wrap-up/ac2-frontmatter-and-content.test.js`

**Tasks to make this test pass:**

- [ ] Add `stories_touched:` array to frontmatter
- [ ] Include all modified story IDs as array elements
- [ ] Format as YAML array: `[SW-001, SW-002, ...]`
- [ ] Ensure all stories from gatherSessionContext are included
- [ ] Run test: `npm test -- ac2-frontmatter-and-content.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test: should have session_duration field in frontmatter

**File:** `__tests__/wrap-up/ac2-frontmatter-and-content.test.js`

**Tasks to make this test pass:**

- [ ] Calculate session duration from sessionStartTime to current time
- [ ] Add `session_duration:` field to frontmatter
- [ ] Format as human-readable string: "approximately X hours"
- [ ] Validate duration calculation logic
- [ ] Run test: `npm test -- ac2-frontmatter-and-content.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test: should have schema_version in frontmatter

**File:** `__tests__/wrap-up/ac2-frontmatter-and-content.test.js`

**Tasks to make this test pass:**

- [ ] Add `schema_version: 1.0.0` field to frontmatter
- [ ] Match schema version from architecture.md (currently 1.0.0)
- [ ] Ensure version field is present in all outputs
- [ ] Run test: `npm test -- ac2-frontmatter-and-content.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 30 minutes

---

### Test: should structure content with clear section headers

**File:** `__tests__/wrap-up/ac2-frontmatter-and-content.test.js`

**Tasks to make this test pass:**

- [ ] Format output using markdown level-2 headers: `## Section Name`
- [ ] Include all sections: Stories Worked On, Status Changes, Decisions Made, Risks Identified, Pending Actions
- [ ] Use consistent indentation for nested items
- [ ] Ensure headers are scannable by `/session-start` parser
- [ ] Run test: `npm test -- ac2-frontmatter-and-content.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1.5 hours

---

### Test: should append to existing session file when called twice same day

**File:** `__tests__/wrap-up/ac3-collision-handling.test.js`

**Tasks to make this test pass:**

- [ ] Implement collision detection in `writeSessionSummary()` function
- [ ] Check if `session-YYYY-MM-DD.md` already exists
- [ ] If exists, append new session block with timestamp separator
- [ ] Use format: `\n---\n## Session Block {timestamp}\n` for new blocks
- [ ] Preserve original content when appending
- [ ] Return path to updated file
- [ ] Run test: `npm test -- ac3-collision-handling.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 2 hours

---

### Test: should preserve data when collision occurs

**File:** `__tests__/wrap-up/ac3-collision-handling.test.js`

**Tasks to make this test pass:**

- [ ] Verify append logic does not overwrite existing content
- [ ] Check original file markers are still present after append
- [ ] Validate file integrity after multiple writes
- [ ] Test with real file I/O (not mocked)
- [ ] Run test: `npm test -- ac3-collision-handling.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test: should create sequence suffix file when collision detected

**File:** `__tests__/wrap-up/ac3-collision-handling.test.js`

**Tasks to make this test pass:**

- [ ] Implement sequence suffix pattern: `session-YYYY-MM-DD-N.md`
- [ ] If append mode is not used, create new file with suffix
- [ ] Increment N for each collision: -1, -2, -3, etc.
- [ ] Check which strategy is enabled (append vs. sequence)
- [ ] Ensure both strategies prevent data loss
- [ ] Run test: `npm test -- ac3-collision-handling.test.js`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1.5 hours

---

## Running Tests

```bash
# Run all failing tests for story 7.4
npm test -- __tests__/wrap-up/

# Run specific test file
npm test -- __tests__/wrap-up/ac1-session-summary-creation.test.js

# Run with verbose output
npm test -- __tests__/wrap-up/ --reporter=verbose

# Run with coverage
npm test -- __tests__/wrap-up/ --coverage

# Debug specific test
npm test -- __tests__/wrap-up/ac1-session-summary-creation.test.js --inspect-brk
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All 18 tests written and failing
- ✅ Test structure covers all 3 acceptance criteria
- ✅ Implementation requirements documented
- ✅ Expected behavior clearly specified in each test
- ✅ Mock requirements identified (filesystem operations)

**Verification:**

```bash
npm test -- __tests__/wrap-up/ 2>&1 | grep -E "FAIL|✓|×"
# Expected: All 18 tests marked as FAIL/RED
```

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Create `scrum_workflow/utils/session-summary.js`** - Implement all 9 utility functions
2. **Create `scrum_workflow/skills/wrap-up/wrap-up-impl.js`** - Main orchestrator function
3. **Create supporting files** - Templates, commands, workflows, skill specs
4. **Run tests one at a time:**
   - Start with AC-1 tests (file creation)
   - Then AC-2 tests (frontmatter structure)
   - Finally AC-3 tests (collision handling)
5. **Verify test execution** after each implementation task

**Key Principles:**

- One test at a time (fix AC-1 before moving to AC-2)
- Minimal implementation (don't over-engineer for future features)
- Run tests frequently (after each function implementation)
- Follow example patterns from Story 7.3 (session-context.js)

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all 18 tests pass** (green phase complete)
2. **Code review** - Check against story requirements
3. **Performance optimization** - File scanning and parsing efficiency
4. **Extract duplications** - Consolidate similar helper functions
5. **Ensure data safety** - Verify write operations are atomic
6. **Update documentation** - Add comments for complex logic

---

## Next Steps

1. **Share this checklist with dev team** for story 7.4 implementation
2. **Review all 18 failing tests** to understand expected behavior
3. **Run failing tests to confirm RED phase:**
   ```bash
   npm test -- __tests__/wrap-up/
   # Expected output: 18 tests FAIL
   ```
4. **Begin implementation in story order:**
   - Task 1: Create command/workflow specs
   - Task 2: Create utilities (session-summary.js)
   - Task 3: Create skill specification
   - Task 4: Create template
   - Task 5-6: Implement and test
5. **Work one test at a time** (red → green for each)
6. **Track progress in daily standup**
7. **When all tests pass, refactor for quality**
8. **Update story status to 'in-progress' → 'done' when complete**

---

## Notes

- **Stack Type:** Backend (Node.js, Vitest) - No browser automation needed
- **Integration Points:** Story 7.4 writes sessions; Story 7.3 reads sessions
- **No External Dependencies:** Uses only built-in Node.js `fs` and `path` modules
- **Collision Handling Strategy:** Either append mode (new session blocks in same file) OR sequence suffix (separate files)
- **Session Timing:** Determined by environment variable SCRUM_SESSION_START_TIME or file modification times
- **Reference Patterns:** Study Story 7.3 (session-context.js) for similar scanning/parsing logic

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **test-levels-framework.md** - Backend test strategy (unit + integration)
- **test-quality.md** - Test design principles (Given-When-Then structure)
- **data-factories.md** - Factory patterns for test data
- **test-priorities-matrix.md** - Risk-based test prioritization
- **ci-burn-in.md** - Test reliability and determinism

---

## Test Execution Evidence (Expected)

### Initial Test Run (RED Phase Verification)

**Command:** `npm test -- __tests__/wrap-up/`

**Expected Results:**

```
 FAIL  __tests__/wrap-up/ac1-session-summary-creation.test.js
 FAIL  __tests__/wrap-up/ac2-frontmatter-and-content.test.js
 FAIL  __tests__/wrap-up/ac3-collision-handling.test.js

Total: 18 tests
Passed: 0
Failed: 18
Status: ✅ RED phase verified
```

**Failure Reasons (Expected):**

- Module `wrap-up-impl.js` does not exist (import fails)
- Function `createSessionSummary` is not defined
- Session files not created (implementation missing)
- YAML frontmatter validation failures (content not generated)
- Collision handling logic not implemented

---

## Generated by Scrum Workflow TEA Agent

**Date:** 2026-04-09
**Story:** 7.4 (Implement Session Wrap-Up)
**Test Framework:** Vitest 4.1.3
**Test Stack:** Backend (Node.js)
**Status:** RED Phase Complete ✅
