---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests']
lastStep: 'step-04-generate-tests'
lastSaved: '2026-03-25'
storyId: '1-1'
storyTitle: 'Framework Directory Structure & Default Configuration'
detectedStack: 'infrastructure'
testGenerationStatus: 'complete'
inputDocuments:
  - /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/1-1-framework-directory-structure-and-default-configuration.md
  - /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad/tea/testarch/knowledge/data-factories.md
  - /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad/tea/testarch/knowledge/component-tdd.md
  - /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad/tea/testarch/knowledge/test-quality.md
  - /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad/tea/testarch/knowledge/test-healing-patterns.md
outputFiles:
  - /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/test-artifacts/framework-structure-validation.spec.ts
  - /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/test-artifacts/package.json
  - /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/test-artifacts/ATDD-SUMMARY-1-1.md
  - /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/test-artifacts/atdd-checklist-1-1.md
---

# ATDD Test Strategy for Story 1-1: Framework Directory Structure & Default Configuration

## Story Context

**Story ID:** 1-1
**Title:** Framework Directory Structure & Default Configuration
**Status:** ready-for-dev
**Type:** Infrastructure/Framework Setup

This story creates the foundational directory structure and configuration files for the scrum_workflow framework. Unlike typical application stories, this story involves creating static files (YAML configuration, Markdown documentation) rather than implementing business logic or UI functionality.

## Test Strategy Overview

**Test Level:** File System Validation Tests
**Test Framework:** Node.js with filesystem testing (using `fs` module and test runners like Jest/Vitest)
**Test Type:** Infrastructure validation tests (not traditional unit/integration/E2E tests)

Since this story creates framework infrastructure rather than application code, the "acceptance tests" are file system validation scripts that verify:
1. Directory structure exists
2. Files are created with correct content
3. YAML files are valid and parseable
4. Naming conventions are followed

## Mapped Acceptance Criteria to Test Scenarios

### AC1: Directory Structure Verification

**Acceptance Criterion:**
> Given a fresh environment without scrum_workflow installed
> When the framework files are copied into the target location
> Then the following directory structure exists: `scrum_workflow/` with subdirectories `agents/`, `commands/`, `workflows/`, `skills/`, `templates/`, `context/`, `data/`

**Test Scenarios:**
- **P0:** Verify all 8 required directories exist
- **P1:** Verify directories are empty (content created in subsequent stories)
- **P1:** Verify directory permissions are readable
- **P2:** Verify directories use kebab-case naming

### AC2: Configuration File Validation

**Acceptance Criterion:**
> And `scrum_workflow/config.yaml` exists with all required fields (`platform`, `active_agents`, `token_budgets`) having documented default values

**Test Scenarios:**
- **P0:** Verify `config.yaml` file exists
- **P0:** Verify YAML is valid and parseable
- **P0:** Verify required field `platform` exists
- **P0:** Verify required field `active_agents` exists and is an array
- **P0:** Verify required field `token_budgets` exists
- **P1:** Verify default value for `platform` is `claude-code`
- **P1:** Verify `active_agents` contains MVP agents: architect, developer, qa
- **P1:** Verify `token_budgets` contains platform-specific limits
- **P2:** Verify inline documentation exists in YAML comments
- **P2:** Verify all YAML field names use snake_case

### AC3: Framework Context Files

**Acceptance Criterion:**
> And `scrum_workflow/context/architecture-guidelines.md` and `scrum_workflow/context/standards.md` exist with framework-level conventions

**Test Scenarios:**
- **P0:** Verify `architecture-guidelines.md` exists
- **P0:** Verify `standards.md` exists
- **P1:** Verify `architecture-guidelines.md` contains SDK/Framework pattern documentation
- **P1:** Verify `architecture-guidelines.md` contains Three-Layer Separation documentation
- **P1:** Verify `standards.md` contains naming conventions (kebab-case, snake_case)
- **P2:** Verify files are valid Markdown
- **P2:** Verify files have proper heading structure (single `#` title)

### AC4: Naming Convention Compliance

**Acceptance Criterion:**
> And all files use kebab-case naming and all YAML fields use snake_case naming per the consistency rules

**Test Scenarios:**
- **P0:** Verify all directories use kebab-case
- **P0:** Verify all created files use kebab-case
- **P0:** Verify all YAML fields in config.yaml use snake_case
- **P1:** Verify no camelCase or PascalCase in filenames
- **P1:** Verify no spaces in filenames
- **P2:** Verify consistency across all files

### AC5: Convention-over-Configuration

**Acceptance Criterion:**
> And `config.yaml` follows convention-over-configuration — minimal required fields, sensible defaults for everything else (NFR7)

**Test Scenarios:**
- **P0:** Verify minimal required fields in config.yaml
- **P1:** Verify all fields have default values documented
- **P1:** Verify config.yaml is shallow-override compatible
- **P2:** Verify optional fields have sensible defaults

### AC6: Zero Runtime Dependencies

**Acceptance Criterion:**
> And the framework has zero runtime dependencies — pure YAML and Markdown files only (NFR9)

**Test Scenarios:**
- **P0:** Verify no non-YAML/non-Markdown files in framework
- **P0:** Verify no package.json, requirements.txt, or similar dependency files
- **P0:** Verify no build scripts or compiled code
- **P1:** Verify all files are human-readable text
- **P2:** Verify framework can be distributed via simple file copy

## Test Priority Matrix

| Priority | Test Count | Description |
|----------|------------|-------------|
| **P0** | 15 tests | Critical: File existence, YAML validity, required fields, directory structure |
| **P1** | 12 tests | High: Default values, documentation content, naming conventions |
| **P2** | 8 tests | Medium: Inline comments, Markdown structure, consistency checks |

**Total: 35 test scenarios**

## Red Phase Design

All tests are designed to **FAIL BEFORE IMPLEMENTATION** (TDD red phase):

1. **Before implementation:** Tests will fail because directories and files don't exist
2. **After implementation:** Tests will pass when framework structure is created correctly

### Example Test Structure (Red Phase):

```javascript
// This test FAILS before implementation (directories don't exist)
test('framework root directory exists', () => {
  expect(fs.existsSync('scrum_workflow')).toBe(true);
});

// This test FAILS before implementation (config.yaml doesn't exist)
test('config.yaml exists and is valid YAML', () => {
  const configPath = 'scrum_workflow/config.yaml';
  expect(fs.existsSync(configPath)).toBe(true);

  const content = fs.readFileSync(configPath, 'utf8');
  expect(() => yaml.parse(content)).not.toThrow();
});

// This test FAILS before implementation (required fields missing)
test('config.yaml has required field: platform', () => {
  const config = yaml.parse(fs.readFileSync('scrum_workflow/config.yaml', 'utf8'));
  expect(config).toHaveProperty('platform');
  expect(typeof config.platform).toBe('string');
});
```

## Test Execution Strategy

**Test Framework:** Node.js with Jest/Vitest
**Test Location:** `tests/framework/structure-validation.spec.ts`
**Execution Order:** Run before framework implementation (red phase), then after (green phase)

**Workflow:**
1. **Red Phase:** Run tests → All fail (framework doesn't exist)
2. **Implementation:** Create framework structure per story requirements
3. **Green Phase:** Run tests → All pass (structure verified)
4. **Refactor:** Clean up implementation if needed (tests stay green)

## Risk Assessment

**High Risk Areas:**
- YAML parsing errors (syntax issues)
- Missing required configuration fields
- Incorrect directory structure
- Naming convention violations

**Mitigation:**
- Comprehensive file existence checks
- YAML parsing validation
- Schema validation for configuration
- Automated naming convention checks

## Test Generation Results

✅ **Test Generation Complete**

### Generated Files
1. **framework-structure-validation.spec.ts** - 35 test cases covering all 6 acceptance criteria
2. **package.json** - Jest test framework configuration
3. **ATDD-SUMMARY-1-1.md** - Complete test generation summary
4. **atdd-checklist-1-1.md** - This checklist (updated with completion status)

### Test Statistics
- Total Tests: 35
- P0 (Critical): 15 tests
- P1 (High): 12 tests
- P2 (Medium): 8 tests
- Test Framework: Jest with TypeScript
- Test Type: File System Validation Tests

### TDD Red Phase Status
All tests are **FAILING tests** (designed to fail before implementation):
- File existence checks fail when framework doesn't exist
- YAML parsing fails when config.yaml doesn't exist
- Content validation fails when files are empty

After Story 1-1 implementation, all tests should pass.

## Execution Instructions

```bash
# Install dependencies
cd /Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/test-artifacts
npm install

# Run tests (before implementation - RED phase)
npm test
# Expected: All tests FAIL

# Run tests (after implementation - GREEN phase)
npm test
# Expected: All tests PASS
```

## Next Steps

1. Review generated tests in `framework-structure-validation.spec.ts`
2. Implement Story 1-1 per requirements
3. Run tests to verify implementation (GREEN phase)
4. Proceed to Story 1-2 with validated framework foundation
