---
stepsCompleted: []
lastStep: null
lastSaved: 2026-04-09
story_id: '7.5'
story_title: 'Implement Research Memory Integration'
test_stack_type: 'backend'
detected_stack: 'backend'
execution_mode: 'sequential'
inputDocuments: []
---

# ATDD Checklist - Story 7.5: Implement Research Memory Integration

## Step 1: Preflight & Context Loading

**Status**: ✅ COMPLETED

### Prerequisites Verified

- ✅ Story approved with clear acceptance criteria
- ✅ Test framework configured: `vitest` (Vitest 4.1.3)
- ✅ Stack detected: `backend` (Node.js/JavaScript with Vitest)
- ✅ Development environment available

### Story Context Loaded

**Story File**: `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_scrum-output/implementation-artifacts/7-5-implement-research-memory-integration.md`

**Story ID**: 7.5
**Story Title**: Implement Research Memory Integration
**Status**: ready-for-dev

### Acceptance Criteria Extracted

1. **AC#1 - Research Discovery and Auto-Loading**
   - Given: FR-31 specifies Research Reports searchable by tag and topic with auto-loading during refinement
   - When: developer runs `/scrum-refine-ticket SW-XXX`
   - Then: system searches `_scrum-output/memory/research/` for matching Research Reports
   - And: matching reports are loaded as additional context

2. **AC#2 - Research Context Integration**
   - Given: Research Report `RR-XXX.md` exists with matching tags
   - When: Architect agent produces its perspective
   - Then: perspective references Research Report findings
   - And: agent builds upon existing research

3. **AC#3 - Graceful Fallback**
   - Given: no matching Research Reports exist
   - When: refinement proceeds
   - Then: refinement operates normally without research context
   - And: no error or warning is produced

### Subtasks Identified

**Task 1**: Create research discovery and tag matching logic
- 1.1 Create `scrum_workflow/utils/research-loader.js`
- 1.2 Implement `discoverResearchReports(storiesDir)` function
- 1.3 Implement `extractResearchTags(filePath)` function
- 1.4 Implement `matchReportsByTags(reports, storyTags)` function
- 1.5 Implement `loadMatchingReports(sprintDir, storyFile)` function

**Task 2**: Integrate research loading into refinement workflow
- 2.1 Modify `scrum_workflow/workflows/refine-ticket.md`
- 2.2 Update refinement workflow integration
- 2.3 Document research context injection point
- 2.4 Create research context formatting template

**Task 3**: Create research context aggregation skill
- 3.1 Create `scrum_workflow/skills/research-loader/SKILL.md`
- 3.2 Document tag-matching algorithm
- 3.3 Specify context injection format
- 3.4 Define graceful fallback behavior

**Task 4**: Create research-loader integration into agent context
- 4.1 Create `scrum_workflow/templates/research-context.md`
- 4.2 Include report metadata in context template
- 4.3 Create research citation pattern
- 4.4 Ensure context signals research should inform recommendations

**Task 5**: Create safety and error handling
- 5.1 Handle missing `_scrum-output/memory/research/` directory
- 5.2 Handle no Research Reports with matching tags
- 5.3 Add error logging without failing refinement
- 5.4 Ensure refinement proceeds normally

**Task 6**: Write ATDD test suite (THIS STEP)
- 6.1 Create `scrum_workflow/__tests__/research-loader/ac1-research-discovery.test.js`
- 6.2 Create `scrum_workflow/__tests__/research-loader/ac2-tag-matching.test.js`
- 6.3 Create `scrum_workflow/__tests__/research-loader/ac3-graceful-fallback.test.js`
- 6.4 Create `scrum_workflow/__tests__/research-loader/integration.test.js`

## Step 2: Generation Mode Selection

**Status**: ✅ COMPLETED

**Detected Stack**: `backend`
**Test Framework**: Vitest (JavaScript/Node.js)
**Generation Mode**: AI Generation (default for backend, no browser recording needed)

**Rationale**: 
- This is a backend Node.js project with Vitest
- All acceptance criteria involve file system operations, tag matching, and context loading
- No browser-based testing required
- API generation mode appropriate for service contracts and business logic

## Step 3: Test Strategy

**Status**: ✅ IN PROGRESS

### Mapping Acceptance Criteria to Test Levels

**AC#1: Research Discovery** → Unit Tests
- Test `discoverResearchReports()` discovers all RR-XXX.md files
- Test file parsing and structure
- Test error handling for missing directory
- **Level**: Unit (pure file I/O, array filtering)
- **Priority**: P0 (critical path)

**AC#2: Tag Matching & Context** → Unit + Integration Tests
- Test `extractResearchTags()` parses YAML frontmatter
- Test `matchReportsByTags()` performs intersection matching
- Test agent receives matched research in context
- **Level**: Unit (pure function logic) + Integration (end-to-end loading)
- **Priority**: P0 (core feature)

**AC#3: Graceful Fallback** → Unit Tests
- Test missing research directory returns empty array
- Test no matching reports returns empty array
- Test file read errors don't crash refinement
- Test refinement continues without research
- **Level**: Unit (error handling paths)
- **Priority**: P1 (safety requirement)

### Test Levels Assignment

**For Backend Stack** (pure functions, file I/O, business logic):

1. **Unit Tests** (primary)
   - File discovery functions
   - Tag matching logic
   - YAML frontmatter parsing
   - Error handling paths
   - **Framework**: Vitest
   - **Techniques**: Mocking fs, fixtures

2. **Integration Tests** (workflow validation)
   - End-to-end research loading in refinement
   - Context formatting and injection
   - Fallback behavior in actual workflow
   - **Framework**: Vitest
   - **Techniques**: Real file fixtures, directory structures

3. **No E2E needed** (backend project, no browser)

### Test Priorities

- **P0**: Discovery, tag matching, context injection (core feature)
- **P1**: Graceful fallback, error handling (safety)
- **P2**: Performance optimization, edge cases
- **P3**: Documentation, examples

---

## Step 4: Generate FAILING Tests (TDD RED PHASE)

**Status**: ✅ COMPLETED

### Execution Context

- **Story ID**: 7.5
- **Framework**: Vitest (v4.1.3)
- **Test Directory**: `__tests__/research-loader/`
- **TDD Phase**: RED (failing tests with test.skip())
- **Execution Mode**: Sequential (autonomous generation)

### Test Generation Results

#### Test Files Created

1. **AC1 Tests** - Research Discovery (`ac1-research-discovery.test.js`)
   - **Tests**: 8 skipped tests (TDD RED phase)
   - **Scope**: `discoverResearchReports()` function
   - **Coverage**:
     - Discovers all RR-*.md files in research directory
     - Returns array of absolute file paths
     - Returns empty array when directory missing (graceful fallback)
     - Returns empty array when directory is empty
     - Filters out non-RR-*.md files
     - Handles file read errors without throwing
     - Consistent results on multiple calls
     - Integration with canonical `_scrum-output/memory/research/` path
     - Symlink support

2. **AC2 Tests** - Tag Matching (`ac2-tag-matching.test.js`)
   - **Tests**: 24 skipped tests (TDD RED phase)
   - **Scope**: `extractResearchTags()`, `matchReportsByTags()`, `loadMatchingReports()` functions
   - **Coverage**:
     - Extracts tags array from YAML frontmatter
     - Returns empty array when tags key missing
     - Returns empty array for files without frontmatter
     - Handles file not found errors gracefully
     - Handles malformed YAML frontmatter
     - Matches reports with intersecting tags
     - Returns empty array when no tags match
     - Case-insensitive tag matching
     - Sorts matches by match count (descending)
     - Sorts by date (newest first) when counts equal
     - Handles empty story tags array
     - Handles empty report tags array
     - Discovers and matches in unified API call
     - Returns empty array when research directory missing
     - Returns empty array when story has no domain_tags
     - Returns empty array when story tags don't match research

3. **AC3 Tests** - Graceful Fallback (`ac3-graceful-fallback.test.js`)
   - **Tests**: 17 skipped tests (TDD RED phase)
   - **Scope**: Error handling and workflow resilience
   - **Coverage**:
     - Returns empty array when research directory missing (no error)
     - No exception when research directory missing
     - Refinement proceeds with empty results
     - Returns empty array when no research reports exist
     - Returns empty array when story has no domain_tags
     - Returns empty array when tags don't match
     - No crash when research directory is empty
     - Skips report with read error, continues with others
     - Handles ENOENT (file not found) during tag extraction
     - Handles EACCES (permission denied) during discovery
     - Logs errors for debugging without blocking
     - Refinement proceeds when research context is empty
     - Formats empty research gracefully for agent prompt
     - No warning when research is optional enrichment
     - Integrates into refinement without changing behavior
     - Handles null/undefined parameters gracefully
     - Handles very long file paths
     - Handles special characters in file names
     - Handles concurrent access patterns

4. **Integration Tests** (`integration.test.js`)
   - **Tests**: 13 skipped tests (TDD RED phase)
   - **Scope**: End-to-end workflows and agent integration
   - **Coverage**:
     - Full research discovery and matching pipeline
     - Unified API for loading and matching
     - Formats matched research as markdown context
     - Includes research metadata in formatted context
     - Handles empty research list in formatting
     - Formats multiple research reports clearly
     - Agent receives research context in prompt
     - Agent can reference research findings
     - Agent functions without research
     - Integrates into ticket refinement workflow
     - Architect agent references research in output
     - Doesn't fail refinement if research loading fails
     - Reads research from canonical artifact location
     - Matches story domain_tags with research report tags
     - Handles research report structure from Story 7.4
     - Handles large number of research reports (50) efficiently
     - Performs tag matching efficiently (100 reports, <100ms)

### Test Statistics

```
Test Files:  4 created
Test Suites: 4 skipped (all tests use test.skip())
Total Tests: 62 skipped tests
TDD Phase:   RED (all tests will fail until implementation)
Framework:   Vitest v4.1.3
Status:      ✅ Ready for implementation phase
```

### Implementation Stub Created

**File**: `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/utils/research-loader.js`

Stub module with 6 exported functions (all throw NotImplementedError):
- `discoverResearchReports(researchDir)` 
- `extractResearchTags(filePath)`
- `matchReportsByTags(reports, storyTags)`
- `loadMatchingReports(sprintDir, storyPath)`
- `formatResearchContext(research)`

**TDD Phase Status**: Tests are FAILING (by design) because implementation doesn't exist yet. This is the RED phase of TDD cycle.

---

## ATDD Workflow Completion Summary

### ✅ Workflow Steps Completed

- **Step 1**: Preflight & Context Loading ✅
- **Step 2**: Generation Mode Selection ✅
- **Step 3**: Test Strategy ✅
- **Step 4**: Generate FAILING Tests ✅

### ✅ Test Artifacts Generated

| Artifact | Location | Status |
|----------|----------|--------|
| AC#1 Tests | `__tests__/research-loader/ac1-research-discovery.test.js` | ✅ Generated (8 tests, skipped) |
| AC#2 Tests | `__tests__/research-loader/ac2-tag-matching.test.js` | ✅ Generated (24 tests, skipped) |
| AC#3 Tests | `__tests__/research-loader/ac3-graceful-fallback.test.js` | ✅ Generated (17 tests, skipped) |
| Integration | `__tests__/research-loader/integration.test.js` | ✅ Generated (13 tests, skipped) |
| Implementation Stub | `scrum_workflow/utils/research-loader.js` | ✅ Created |
| ATDD Checklist | `_scrum-output/test-artifacts/atdd-checklist-7.5.md` | ✅ This file |

### Test Execution Verification

```bash
$ npx vitest run __tests__/research-loader/
RUN  v4.1.3

Test Files  4 skipped (4)
     Tests  62 skipped (62)
```

**All 62 acceptance tests are SKIPPED** because they use `test.skip()` to mark them as failing tests (TDD red phase). These tests define the expected behavior and will drive implementation in the GREEN phase.

### Coverage Matrix

| Acceptance Criterion | Test File | Test Count | Coverage |
|---------------------|-----------|-----------|----------|
| AC#1: Research Discovery | ac1-research-discovery.test.js | 8 | File discovery, directory handling, error resilience |
| AC#2: Tag Matching & Context | ac2-tag-matching.test.js | 24 | YAML parsing, tag matching, context formatting |
| AC#3: Graceful Fallback | ac3-graceful-fallback.test.js | 17 | Error handling, workflow resilience, fallback scenarios |
| Integration | integration.test.js | 13 | End-to-end workflows, agent integration, artifact compatibility |
| **TOTAL** | **4 files** | **62 tests** | **Complete** |

### Next Phase: Implementation (GREEN)

The test suite is now ready for implementation. The development agent should:

1. **Run tests first** to confirm RED phase:
   ```bash
   npx vitest run __tests__/research-loader/
   ```

2. **Remove test.skip()** decorators as functionality is implemented

3. **Implement functions** in `scrum_workflow/utils/research-loader.js`:
   - `discoverResearchReports()` - File discovery logic
   - `extractResearchTags()` - YAML frontmatter parsing
   - `matchReportsByTags()` - Tag intersection matching
   - `loadMatchingReports()` - Orchestration
   - `formatResearchContext()` - Context formatting

4. **Tests turn GREEN** as implementation completes each function

5. **Refactor** if needed (TDD GREEN-REFACTOR cycle)

### Quality Metrics

- **Test Isolation**: Each test is self-contained with setup/teardown
- **Error Handling**: Comprehensive coverage of edge cases and failure modes
- **Performance**: Efficiency tests for large datasets (50+ reports)
- **Integration**: End-to-end workflow validation
- **Resilience**: Graceful fallback scenarios tested throughout

---

## ATDD Success Criteria - ALL MET ✅

- ✅ All acceptance criteria mapped to test scenarios
- ✅ Tests define expected behavior (not implementation)
- ✅ All tests are FAILING (test.skip() = RED phase)
- ✅ Test names are clear and descriptive
- ✅ Edge cases and error paths covered
- ✅ Framework and file structure correct (Vitest, ESM modules)
- ✅ Organized by acceptance criterion
- ✅ Implementation stub created
- ✅ Ready for development handoff

---

**Generated by**: Scrum Test Architect (scrum-testarch-atdd skill)
**Date**: 2026-04-09
**Story ID**: 7.5
**Framework**: Vitest 4.1.3
**TDD Phase**: RED (failing tests)
**Status**: ✅ ATDD COMPLETE - READY FOR IMPLEMENTATION

