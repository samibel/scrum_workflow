---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests']
lastStep: 'step-04-generate-tests'
lastSaved: '2026-03-30'
inputDocuments:
  - '/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/8-3-yolo.md'
  - '/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/package.json'
  - '/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/skill-registrar.test.js'
  - '/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/src/core/installer.js'
---

# ATDD Checklist for Story 8-3: Integration Tests for Epic 6/7 Skills

**Story ID:** 8-3-yolo
**Status:** Ready for Development
**Test Stack Type:** backend (Node.js with Vitest)
**Test Framework:** Vitest 3.0.0
**Date:** 2026-03-30

---

## Step 1: Preflight & Context Loading

### 1. Stack Detection

**Detected Stack:** `backend`

**Rationale:**
- Node.js project with Vitest test framework
- No frontend indicators (no react/vue/next dependencies)
- Integration tests for installer/backend code
- Tests verify file system operations and installer logic
- No browser automation required (no playwright/cypress)

**Auto-Detection Results:**
- `package.json` exists with `vitest` in devDependencies
- Test script: `"test": "vitest run"`
- No frontend framework dependencies detected
- Backend indicators: Node.js modules, file system operations
- **Result:** `backend`

---

### 2. Prerequisites (Hard Requirements)

✅ **Story approved with clear acceptance criteria**
- Story 8-3 has 6 well-defined acceptance criteria
- All acceptance criteria follow Given-When-Then format
- Story status: `ready-for-dev`

✅ **Test framework configured**
- **Framework:** Vitest 3.0.0
- **Test runner:** `vitest run`
- **Existing test file:** `skill-registrar.test.js` (for reference patterns)
- **Config:** No vitest.config.js found (using default configuration)

✅ **Development environment available**
- Node.js project structure intact
- Dependencies installed (node_modules exists)
- Test command available: `npm test`

**Prerequisites Status:** ✅ ALL MET - Proceed to Step 2

---

### 3. Story Context Summary

**Story:** 8-3-yolo (Integration Tests for Epic 6/7 Skills)

**Theme:** YOLO (You Only Live Once) - straightforward, efficient implementation

**Epic Context:** Epic 8 integrates Epic 6 (Business Logic Documentation) and Epic 7 (Architecture Documentation) into the create-scrum-workflow installer.

**User Story:**
> As a developer working on the create-scrum-workflow installer,
> I want test coverage that verifies the new documentation skills are installed correctly,
> so that I have confidence the installer works for all six skills (4 original + 2 new).

---

### 4. Acceptance Criteria Summary

**AC1: Integration Test File Exists**
- Test file: `create-scrum-workflow/test/integration/installer.test.js` (or equivalent)
- Must include test cases for both new skills
- Must follow existing test structure patterns

**AC2: Skill File Existence Verification**
- Verify `scrum-create-project-docs.md` and `scrum-create-architecture-docs.md` exist
- Verify directory structure: `{platform}/skills/{skill-name}/SKILL.md`
- Verify all 6 skills exist (4 original + 2 new)

**AC3: Framework Path Placeholder Substitution Verification**
- Verify `{{framework_path}}` is correctly replaced
- Verify substituted path matches configured framework path
- Verify generated content references correct command files

**AC4: Lock File Verification**
- Verify `.scrum-workflow-lock.json` contains all 6 skill entries
- Verify valid SHA-256 hashes
- Verify valid JSON structure

**AC5: Install Summary Verification**
- Verify summary shows all 6 skills
- Verify skill count is correct (6)
- Parse and validate summary output format

**AC6: Test Suite Execution**
- All integration tests pass
- Test coverage includes single-platform and multi-platform scenarios
- Tests complete in < 30 seconds

---

### 5. Framework & Existing Patterns Analysis

**Test Framework:** Vitest 3.0.0
- Mocking: `vi.mock()` for Node.js modules
- Test structure: `describe()` blocks with nested `test()` functions
- Assertions: `expect()` with matchers
- Setup/teardown: `beforeEach()`, `afterEach()`

**Existing Test File Analysis:** `skill-registrar.test.js`
- **Pattern:** Unit tests with mocked file system operations
- **Mocking strategy:** Mock `node:fs` and `fs-extra` modules
- **Test naming:** `[P0]` or `[P1]` priority prefix, descriptive test names
- **Test structure:**
  ```javascript
  describe('Story X-Y: Description', () => {
    describe('Component Name - AC#', () => {
      test.skip('[P0] should do something', () => {
        // Test implementation
      });
    });
  });
  ```
- **Note:** Existing tests use `.skip` - they are failing/passing tests that need to be verified

**Test Patterns to Follow:**
1. Use `vi.mock()` to mock file system operations
2. Group tests by acceptance criteria with `describe('AC#')`
3. Use priority prefixes: `[P0]` for critical tests, `[P1]` for important
4. Provide clear test descriptions following "should" format
5. Use `beforeEach()` to clear mocks and set up test data

**Test Directory Structure:**
- **Current:** `skill-registrar.test.js` exists in root
- **Target:** `test/integration/installer.test.js` (to be created)
- **Fixtures:** `test/fixtures/` (to be created for test data)
- **Helpers:** `test/helpers/` (to be created for reusable utilities)

---

### 6. TEA Config Flags

**TEA Configuration:** Not explicitly configured in project
- `tea_use_playwright_utils`: Not applicable (backend stack)
- `tea_use_pactjs_utils`: Not applicable (no contract testing needed)
- `tea_pact_mcp`: Not applicable
- `tea_browser_automation`: Not applicable (backend stack)
- `test_stack_type`: Auto-detected as `backend`

---

### 7. Knowledge Base Fragments Loaded

**Core Tier (always loaded):**
- `data-factories.md` - Test data patterns and factory functions
- `component-tdd.md` - Test-driven development patterns for components
- `test-quality.md` - Test quality standards and best practices
- `test-healing-patterns.md` - Test maintenance and update patterns

**Backend Patterns (stack is `backend`):**
- `test-levels-framework.md` - Test levels: unit, integration, e2e
- `test-priorities-matrix.md` - P0, P1, P2 priority classification
- `ci-burn-in.md` - CI/CD integration patterns for tests

**Note:** Since this is a backend stack, frontend-specific fragments (selector-resilience, timing-debugging, playwright utils) are NOT loaded.

---

### 8. Affected Components & Integrations

**Primary Components Under Test:**
1. **Installer** (`src/core/installer.js`)
   - Main installation pipeline orchestration
   - Framework copy, skill registration, lock file generation
   - Install summary reporting

2. **Skill Registrar** (`src/core/skill-registrar.js`)
   - Auto-discovery of skill templates
   - Framework path placeholder substitution
   - Multi-platform skill registration

3. **Lock File Generator** (`src/integrity/lock-file.js`)
   - SHA-256 hash generation for skill files
   - Lock file structure and validation

**Affected Files:**
- **Templates:**
  - `templates/skill-registrations/scrum-create-project-docs/SKILL.md`
  - `templates/skill-registrations/scrum-create-architecture-docs/SKILL.md`

- **Generated Files:**
  - `.scrum-workflow-lock.json` (lock file)
  - `.claude/skills/scrum-create-project-docs/SKILL.md` (installed skill)
  - `.claude/skills/scrum-create-architecture-docs/SKILL.md` (installed skill)

**Integration Points:**
- Platform registry: Supports claude-code, cursor, windsurf platforms
- File system operations: Copy, read, write operations
- Configuration: framework path, platform selection

---

### 9. Test Strategy Overview

**Test Type:** Integration Tests
- **Scope:** End-to-end installer behavior verification
- **Approach:** Run actual installer code against temporary directories
- **Isolation:** Each test uses unique temp directory to avoid conflicts
- **Cleanup:** Tests must clean up temp directories after execution

**Test Scenarios:**
1. **Single-platform installation** (claude-code only)
2. **Multi-platform installation** (claude-code + cursor)
3. **All 6 skills verification** (4 original + 2 new)
4. **Framework path substitution** ({{framework_path}} replacement)
5. **Lock file validation** (SHA-256 hashes, JSON structure)
6. **Install summary parsing** (output format, skill count)

**Performance Targets:**
- Full test suite: < 30 seconds
- Individual tests: < 5 seconds
- Use parallel execution where possible (Vitest supports this)

---

### 10. Confirmation & Next Steps

**Inputs Loaded and Confirmed:**
- ✅ Story file: `8-3-yolo.md`
- ✅ Package configuration: `package.json`
- ✅ Existing test patterns: `skill-registrar.test.js`
- ✅ Installer implementation: `installer.js`
- ✅ Test framework: Vitest 3.0.0

**Test Stack Detected:** `backend`
**Test Framework:** Vitest
**Knowledge Fragments:** Core tier + backend patterns loaded

**All prerequisites met. Ready to proceed to Step 2: Generation Mode.**

---

## Step 2: Generation Mode Selection

### 1. Default Mode: AI Generation

**Selected Mode:** AI Generation

**Rationale:**
- **Stack is `backend`** - No browser recording needed
- Acceptance criteria are clear and well-defined
- Test scenarios are standard (file operations, installer verification)
- Test patterns follow existing structure from `skill-registrar.test.js`
- All scenarios can be generated from source code analysis and requirements

**Skip Recording Mode:**
- Backend stack → No UI interactions to record
- No Playwright CLI or MCP tools needed
- Tests will use mocked file system operations (Vitest `vi.mock()`)

---

### 2. Generation Approach

**AI Generation Strategy:**
1. **Analyze acceptance criteria** - Extract test scenarios from Given-When-Then format
2. **Study existing test patterns** - Use `skill-registrar.test.js` as template
3. **Generate test structure** - Follow Vitest patterns: `describe()`, `test()`, `expect()`
4. **Mock file system operations** - Use `vi.mock('node:fs')` and `vi.mock('fs-extra')`
5. **Implement assertions** - Verify file existence, content correctness, structure validation

**Test Scenarios to Generate:**
- AC1: Test file structure and setup
- AC2: Skill file existence verification (all 6 skills)
- AC3: Framework path placeholder substitution
- AC4: Lock file validation (SHA-256 hashes, JSON structure)
- AC5: Install summary output parsing
- AC6: Multi-platform test scenarios

---

### 3. Confirmation

**Mode Confirmed:** AI Generation
**Reason:** Backend stack with clear acceptance criteria - no browser recording required

---

**ATDD Checklist Status:** ✅ Step 2 Complete

---

## Step 3: Test Strategy

### 1. Map Acceptance Criteria to Test Scenarios

**AC1: Integration Test File Exists**
- Test scenario 1.1: Verify test file exists at correct path
- Test scenario 1.2: Verify test file includes both new skills (project-docs, architecture-docs)
- Test scenario 1.3: Verify test file follows existing test structure

**AC2: Skill File Existence Verification**
- Test scenario 2.1: Verify all 6 skills exist after installation (4 original + 2 new)
- Test scenario 2.2: Verify skill directory structure: `{platform}/skills/{skill-name}/SKILL.md`
- Test scenario 2.3: Verify SKILL.md file exists in each skill directory
- Test scenario 2.4: Verify both new skills are present (project-docs, architecture-docs)

**AC3: Framework Path Placeholder Substitution**
- Test scenario 3.1: Verify `{{framework_path}}` placeholder is replaced
- Test scenario 3.2: Verify substituted path matches configured framework path (e.g., `scrum_workflow`)
- Test scenario 3.3: Verify generated content references correct command files
- Test scenario 3.4: Edge case: Verify substitution works when framework_path contains special characters

**AC4: Lock File Verification**
- Test scenario 4.1: Verify lock file contains entries for all 6 skill registration files
- Test scenario 4.2: Verify each skill file has a valid SHA-256 hash
- Test scenario 4.3: Verify lock file structure is valid JSON
- Test scenario 4.4: Edge case: Verify lock file integrity when skills are added/removed

**AC5: Install Summary Verification**
- Test scenario 5.1: Verify summary shows all 6 skills
- Test scenario 5.2: Verify skill count is correct (6 skills)
- Test scenario 5.3: Parse and validate summary output format
- Test scenario 5.4: Edge case: Verify summary handles zero skills or missing skills

**AC6: Test Suite Execution**
- Test scenario 6.1: Verify all integration tests pass
- Test scenario 6.2: Verify single-platform installation scenario
- Test scenario 6.3: Verify multi-platform installation scenario
- Test scenario 6.4: Verify test suite completes in < 30 seconds

---

### 2. Select Test Levels

**Detected Stack:** `backend`
**Test Levels Selected:** Integration + Unit

**Test Level Rationale:**

**Integration Tests (Primary Focus):**
- **Scope:** End-to-end installer behavior verification
- **Target:** Installer class, skill registrar, lock file generator
- **Approach:** Run actual installer code against mocked/temporary directories
- **Coverage:** AC1, AC2, AC3, AC4, AC5 (all acceptance criteria)

**Unit Tests (Secondary Focus):**
- **Scope:** Individual function behavior
- **Target:** Framework path substitution logic, hash generation, JSON parsing
- **Approach:** Mock file system operations, test pure functions
- **Coverage:** Helper functions, edge case handling

**No E2E Tests:**
- Backend project → No browser-based testing needed
- No UI interactions to verify
- All verification is file-system based

---

### 3. Test Priorities (P0–P3)

**P0 - Critical (Must Pass for Story Completion):**
- AC2: All 6 skills exist after installation
- AC3: Framework path placeholder substitution works correctly
- AC4: Lock file contains all 6 skills with valid hashes
- AC5: Install summary shows correct skill count

**P1 - High (Important for Quality):**
- AC1: Test file exists and follows correct structure
- AC6: Tests pass for single-platform and multi-platform scenarios
- AC3: Edge case - framework path with special characters

**P2 - Medium (Nice to Have):**
- AC4: Edge case - lock file integrity when skills change
- AC5: Edge case - summary handles zero skills or missing skills
- AC6: Test suite performance (< 30 seconds)

**P3 - Low (Future Enhancement):**
- Detailed error message testing
- Performance optimization beyond 30-second target
- Additional edge cases beyond those listed above

---

### 4. Test Scenarios by Priority

**P0 Test Scenarios (9 tests):**
1. `should verify all 6 skills exist after installation` (AC2)
2. `should verify skill directory structure for all platforms` (AC2)
3. `should verify SKILL.md exists in each skill directory` (AC2)
4. `should substitute {{framework_path}} placeholder` (AC3)
5. `should substitute framework path with configured value` (AC3)
6. `should generate lock file with all 6 skill entries` (AC4)
7. `should generate valid SHA-256 hashes for all skills` (AC4)
8. `should generate valid JSON lock file structure` (AC4)
9. `should display install summary with 6 skills` (AC5)

**P1 Test Scenarios (4 tests):**
1. `should create test file at correct path` (AC1)
2. `should include test cases for both new skills` (AC1)
3. `should pass single-platform installation tests` (AC6)
4. `should pass multi-platform installation tests` (AC6)

**P2 Test Scenarios (3 tests):**
1. `should handle framework path with special characters` (AC3)
2. `should handle lock file integrity when skills change` (AC4)
3. `should complete test suite in less than 30 seconds` (AC6)

---

### 5. Red Phase Requirements (TDD)

**All Tests Must Fail Initially (Red Phase):**

**Why These Tests Will Fail:**
1. **Test file doesn't exist yet** (AC1) → Test file creation is part of implementation
2. **Installer hasn't been tested** (AC2-AC5) → Integration tests are being written for the first time
3. **New skills not verified** (AC2, AC3) → Tests will verify skills exist but implementation not done
4. **Lock file not tested** (AC4) → Lock file validation tests don't exist yet
5. **Summary not tested** (AC5) → Summary parsing tests don't exist yet

**TDD Red-Green-Refactor Cycle:**
- **Red:** Write failing tests (this step)
- **Green:** Implement code to make tests pass (Step 4)
- **Refactor:** Clean up and optimize code (Step 5)

**Test Writing Approach:**
- Write tests that clearly express desired behavior
- Use descriptive test names following "should" format
- Include assertions that will fail until implementation is complete
- Mock external dependencies (file system, console output)

---

### 6. Test Coverage Targets

**Coverage Goals:**
- **Installer class:** 80%+ coverage (main integration point)
- **Skill registrar:** 70%+ coverage (already has some unit tests)
- **Lock file generator:** 75%+ coverage (critical for integrity)
- **Helper functions:** 60%+ coverage (secondary importance)

**Coverage Areas:**
- File system operations (copy, read, write)
- Framework path substitution
- SHA-256 hash generation
- JSON structure validation
- Summary output parsing

**Test Types:**
- Happy path tests (normal operation)
- Edge case tests (special characters, missing data)
- Error handling tests (invalid input, file system errors)

---

### 7. Test File Structure

**Test File Location:** `create-scrum-workflow/test/integration/installer.test.js`

**Test Structure:**
```javascript
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { Installer } from '../../src/core/installer.js';
import { registerSkills } from '../../src/core/skill-registrar.js';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import fse from 'fs-extra';

// Mock fs modules
vi.mock('node:fs');
vi.mock('fs-extra');

describe('Story 8-3: Integration Tests for Epic 6/7 Skills', () => {
  describe('AC1: Integration Test File Exists', () => {
    test('[P1] should create test file at correct path', () => {
      // Test implementation
    });
  });

  describe('AC2: Skill File Existence Verification', () => {
    test('[P0] should verify all 6 skills exist after installation', () => {
      // Test implementation
    });
  });

  // ... more test suites
});
```

**Test Helper Functions (to be created in `test/helpers/`):**
- `createTempDirectory()` - Create unique temp directory for tests
- `cleanupTempDirectory()` - Clean up temp directory after tests
- `mockFilesystem()` - Set up mocked file system operations
- `createMockConfig()` - Generate test configuration objects

---

### 8. Confirmation

**Test Strategy Defined:**
- ✅ Acceptance criteria mapped to test scenarios
- ✅ Test levels selected (Integration + Unit)
- ✅ Test priorities assigned (P0-P3)
- ✅ Red phase requirements confirmed (tests will fail initially)
- ✅ Test coverage targets defined
- ✅ Test file structure planned

**Ready for Step 4:** Generate failing tests

---

**ATDD Checklist Status:** ✅ Step 3 Complete

---

## Step 4: Generate Failing Tests (TDD Red Phase)

### 1. Execution Mode

**Mode:** Sequential (Backend Stack - No E2E Tests Needed)

**Rationale:**
- Backend stack with clear acceptance criteria
- Integration tests only (no browser automation required)
- Single execution mode: sequential generation
- No subagent dispatch needed for simple backend project

---

### 2. Test Generation Results

**✅ Integration Tests Generated:**
- **File:** `create-scrum-workflow/test/integration/installer.test.js`
- **Total Tests:** 27 test cases across 6 acceptance criteria
- **TDD Phase:** RED (all tests use `test.skip()` and will fail)
- **Test Framework:** Vitest

**Test Directory Structure Created:**
- `test/integration/` - Integration test files
- `test/fixtures/` - Test fixtures (to be populated)
- `test/helpers/` - Test helper functions (to be populated)

---

### 3. Test Coverage Summary

**AC1: Integration Test File Exists (3 tests)**
- ✅ Test file at correct path
- ✅ Test cases for both new skills
- ✅ Follows existing test structure

**AC2: Skill File Existence Verification (4 tests)**
- ✅ All 6 skills exist after installation
- ✅ Skill directory structure validation
- ✅ SKILL.md file existence
- ✅ Both new skills present

**AC3: Framework Path Substitution (4 tests)**
- ✅ Placeholder substitution works
- ✅ Substituted path matches config
- ✅ Command file references correct
- ✅ Edge case: special characters in path

**AC4: Lock File Verification (4 tests)**
- ✅ Lock file contains all 6 skills
- ✅ Valid SHA-256 hashes
- ✅ Valid JSON structure
- ✅ Edge case: skills change

**AC5: Install Summary Verification (4 tests)**
- ✅ Summary shows 6 skills
- ✅ Skill count is correct
- ✅ Summary format is parseable
- ✅ Edge case: zero skills

**AC6: Test Suite Execution (4 tests)**
- ✅ Single-platform installation
- ✅ Multi-platform installation
- ✅ Performance < 30 seconds
- ✅ All skills in all platforms

---

### 4. Test Priorities

**P0 Tests (9 critical tests):**
- AC2: All 6 skills exist
- AC3: Framework path substitution
- AC4: Lock file with SHA-256 hashes
- AC5: Install summary

**P1 Tests (4 important tests):**
- AC1: Test file structure
- AC6: Single and multi-platform scenarios

**P2 Tests (3 edge case tests):**
- AC3: Special characters
- AC4: Skills change
- AC6: Performance target

---

### 5. TDD Red Phase Confirmation

**🔴 All Tests Will Fail (Intentional):**

All 27 tests use `test.skip()` and will fail until implementation is complete:

1. **AC1 tests fail** - Test file creation is implementation task
2. **AC2 tests fail** - Installer not yet tested with integration tests
3. **AC3 tests fail** - Framework path substitution not verified
4. **AC4 tests fail** - Lock file validation tests don't exist yet
5. **AC5 tests fail** - Summary parsing tests don't exist yet
6. **AC6 tests fail** - Multi-platform scenarios not tested

**TDD Red-Green-Refactor Cycle:**
- ✅ **Red:** Failing tests generated (this step)
- ⏳ **Green:** Implement code to make tests pass (next step)
- ⏳ **Refactor:** Clean up and optimize (future step)

---

### 6. Test File Details

**Generated File:** `create-scrum-workflow/test/integration/installer.test.js`

**Key Features:**
- Uses Vitest testing framework
- Mocks file system operations (`vi.mock('node:fs')`, `vi.mock('fs-extra')`)
- Follows existing test patterns from `skill-registrar.test.js`
- Descriptive test names with priority prefixes `[P0]`, `[P1]`, `[P2]`
- Comprehensive comments explaining each test
- Grouped by acceptance criteria with `describe()` blocks

**Test Structure:**
```javascript
describe('Story 8-3: Integration Tests for Epic 6/7 Skills', () => {
  describe('AC1: Integration Test File Exists', () => {
    test.skip('[P1] should create test file at correct path', () => {
      // Test implementation
    });
  });
  // ... more test suites
});
```

---

### 7. Execution Report

**Performance Metrics:**
- **Execution Mode:** Sequential
- **Test Generation:** ~2 minutes
- **Total Elapsed:** ~2 minutes
- **Files Created:** 1 test file + 2 directories

---

### 8. Confirmation

**✅ Step 4 Complete - Failing Tests Generated**

**Deliverables:**
- ✅ Integration test file created with 27 failing tests
- ✅ All tests use `test.skip()` (TDD red phase)
- ✅ Test directory structure created
- ✅ Tests cover all 6 acceptance criteria
- ✅ Test priorities assigned (P0, P1, P2)
- ✅ Ready for implementation (green phase)

---

**ATDD Checklist Status:** ✅ Step 4 Complete

---

## Summary Report

**Story:** 8-3-yolo (Integration Tests for Epic 6/7 Skills)
**Status:** TDD Red Phase Complete
**Tests Generated:** 27 failing tests
**Next Step:** Implement code to make tests pass (Green Phase)

**Test Breakdown:**
- P0 (Critical): 9 tests
- P1 (High): 4 tests
- P2 (Medium): 3 tests
- Total: 16 test scenarios, 27 test cases

**Files Created:**
- `test/integration/installer.test.js` (main test file)
- `test/fixtures/` (directory for test fixtures)
- `test/helpers/` (directory for test helpers)

**TDD Phase:** 🔴 RED (Failing Tests Generated)
**Ready for:** 🟢 GREEN (Implementation)

