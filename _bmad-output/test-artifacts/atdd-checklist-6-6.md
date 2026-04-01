---
stepsCompleted:
  - 'step-01-preflight-and-context'
  - 'step-02-generation-mode'
lastStep: 'step-02-generation-mode'
lastSaved: '2026-03-30T01:00:00Z'
inputDocuments:
  - '_bmad-output/implementation-artifacts/6-6-incremental-update-mode.md'
  - '_bmad/tea/testarch/knowledge/test-quality.md'
  - 'scrum_workflow/workflows/project-documentation.md'
  - '_bmad/tea/config.yaml'
  - '_bmad-output/planning-artifacts/epics.md'
---

# ATDD Checklist - Story 6.6: Incremental Update Mode

## Step 1: Preflight & Context Loading

### Stack Detection
- **Detected Stack**: Backend (Node.js CLI tool)
- **Test Framework**: Vitest (configured in package.json)
- **Evidence**: `create-scrum-workflow/package.json` contains vitest in devDependencies with test scripts

### Prerequisites Status
✅ **Story approved with clear acceptance criteria**
- Story 6-6 documented in `_bmad-output/implementation-artifacts/6-6-incremental-update-mode.md`
- 7 acceptance criteria clearly defined
- All tasks/subtasks documented

✅ **Test framework configured**
- Vitest configured in `create-scrum-workflow/package.json`
- Test scripts: `"test": "vitest run"`, `"test:watch": "vitest"`

✅ **Development environment available**
- Node.js project with ESM support
- Dependencies: commander, @clack/prompts, fs-extra, js-yaml, picocolors
- Test dependencies: vitest, memfs

### Story Context Summary

**Story 6.6**: Incremental Update Mode for Business Logic Documentation Agent

**Goal**: Implement `--update` flag mode that incrementally updates existing documentation by detecting file changes since last scan.

**Key Acceptance Criteria**:
1. Update mode triggered by `--update` flag
2. Diff summary presented before writing changes
3. User confirmation required before applying updates
4. Incremental document updates (section-level diff and merge)
5. Scan state file updated after successful update
6. No changes detected handling
7. Scan state file format (JSON with hashes/timestamps)

**Affected Components**:
- Workflow file: `scrum_workflow/workflows/project-documentation.md` (MODIFY - add update mode branch)
- Output directory: `docs/generated/` (runtime generated files)
- Scan state file: `docs/generated/.scan-state.json` (runtime generated)

**Dependencies**:
- Story 6.1: Documentarian agent definition ✅ (completed)
- Story 6.2: Command & workflow skeleton ✅ (completed)
- Story 6.3: Business logic analysis ✅ (completed)
- Story 6.4: Workflow documentation ✅ (completed)
- Story 6.5: Domain model extraction ✅ (completed)

**Technical Approach**:
- Hash-based change detection (SHA-256 of file content)
- Section-level incremental updates (preserve unchanged sections)
- User confirmation flow (diff summary → y/N prompt)
- Atomic writes (temp file + rename)
- Fallback to full scan if no scan state exists

### Framework & Existing Patterns

**Current Workflow Structure** (from `scrum_workflow/workflows/project-documentation.md`):
- Step 0: Mode Detection (parse `--update` flag)
- Step 1: Validation (agent, context, output directory)
- Step 2: Agent & Context Loading
- Step 3: Project Structure Scan
- Step 4: Output Directory Creation
- Step 5: Full-Scan Mode (business logic, workflow, domain model analysis)
- Step 6: Update Mode (⚠️ **STUB - needs full implementation per Story 6.6**)
- Step 7: Scan State Persistence

**Update Mode Stub** (currently exists but incomplete):
```markdown
## Step 6: Update Mode

**Only executed when mode is `update`.**

Incrementally update existing documentation by detecting changes since the last scan.

### Step 6.1: Load Existing Scan State
### Step 6.2: Identify Changed Files
### Step 6.3: Re-Analyze Changed Areas
### Step 6.4: Present Diff Summary
### Step 6.5: Apply Updates

**See Story 6.6** for full incremental update mode implementation details.
```

### TEA Config Flags
- `tea_use_playwright_utils`: true (not relevant for backend CLI)
- `tea_use_pactjs_utils`: false
- `tea_pact_mcp`: none
- `tea_browser_automation`: auto
- `test_stack_type`: auto → detected as **backend**

### Knowledge Fragments Loaded

**Core tier** (always loaded):
- ✅ `test-quality.md` - Test quality definition of done (deterministic, isolated, explicit, focused, fast)
- ✅ `test-levels-framework.md` - Guidelines for choosing unit, integration, or E2E coverage
- ✅ `test-priorities-matrix.md` - P0–P3 criteria, coverage targets, execution ordering
- ✅ `test-healing-patterns.md` - Common failure patterns and automated fixes

**Backend tier** (backend project):
- ✅ `ci-burn-in.md` - CI and burn-in strategy for backend tests
- ✅ `error-handling.md` - Scoped exception handling, retry validation, telemetry logging

**Specialized tier** (not needed for this story):
- `contract-testing.md` - Not applicable (no microservices contracts in story 6.6)
- `feature-flags.md` - Not applicable (no feature flags in story 6.6)

### Test Strategy for Story 6.6

**Test Scope**: Acceptance tests for incremental update mode workflow

**Key Test Scenarios** (based on acceptance criteria):

1. **Update mode with file changes** (AC #1, #2, #3, #4, #5)
   - Given: Existing docs + scan state from previous full scan
   - When: Code files modified, user runs `--update`
   - Then: Changed files detected, diff summary shown, user confirms, docs updated incrementally

2. **Update mode with no changes** (AC #6)
   - Given: Existing docs + scan state
   - When: No files modified since last scan
   - Then: "No changes detected" message, no docs modified

3. **Update mode without scan state** (AC #1)
   - Given: Existing docs but no scan state file
   - When: User runs `--update`
   - Then: Warning message, fallback to full-scan mode

4. **User rejects update** (AC #3)
   - Given: Diff summary presented
   - When: User enters "n" or anything except "y/Y"
   - Then: "Update cancelled" message, no files modified

5. **Section-level incremental updates** (AC #4)
   - Given: Business logic doc with 3 sections (Overview, Business Rules, Validation Rules)
   - When: Only "Business Rules" section changed in code
   - Then: Only "Business Rules" section updated, Overview and Validation Rules preserved unchanged

**Test Level**: Integration tests (workflow orchestration level)
- **Why**: Story 6.6 is about workflow logic (mode detection, diff generation, user confirmation), not unit-level functions
- **Focus**: End-to-end flow from command invocation to document updates

**Test Framework**: Vitest (already configured)
- Use `describe()` blocks for test scenarios
- Use `it()` or `test()` for individual test cases
- Use `beforeEach()` for test setup (create mock files, scan state)
- Use `expect()` for assertions (explicit, visible in test)

**Test Quality Requirements** (from `test-quality.md`):
- ✅ Deterministic: No hard waits, no conditional flow control
- ✅ Isolated: Each test cleans up its temp files
- ✅ Explicit: All assertions visible in test bodies
- ✅ Focused: Each test validates one scenario
- ✅ Fast: Use in-memory filesystem (memfs) for file operations
- ✅ < 300 lines per test file
- ✅ < 1.5 minutes execution time

---

## Step 2: Generation Mode Selection

### Chosen Mode: AI Generation

**Decision**: Use AI Generation mode for Story 6.6.

**Justification**:
- ✅ **Backend project**: Node.js CLI tool with no browser UI interactions
- ✅ **Clear acceptance criteria**: 7 well-defined AC with explicit scenarios
- ✅ **Standard scenarios**: File system operations, hash computation, diff generation, user confirmation flow
- ✅ **Testable via Vitest**: All workflow logic can be tested with in-memory filesystem (memfs)

**Test Scenarios** (AI-generated):
1. Update mode with file changes (AC #1, #2, #3, #4, #5)
2. Update mode with no changes (AC #6)
3. Update mode without scan state (AC #1)
4. User rejects update (AC #3)
5. Section-level incremental updates (AC #4)

**Recording Mode**: SKIP - Not applicable for backend CLI tool

---

**Next Step**: Load Step 3 (Test Strategy) to design test approach.
