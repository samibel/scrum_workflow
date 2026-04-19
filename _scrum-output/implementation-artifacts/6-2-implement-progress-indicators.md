# Story 6.2: Implement Progress Indicators

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to see spinners during long operations and checkmarks when steps complete,
So that I know the CLI is working and can track progress.

## Acceptance Criteria

1. **Given** UX-DR8 specifies progress indicators: spinner for running, checkmark for complete, X mark for failed **When** a long-running operation starts (e.g., template copying, platform detection) **Then** a spinner is displayed with a descriptive message (e.g., `Copying framework files...`)

2. **Given** an operation completes successfully **When** the spinner resolves **Then** it is replaced by a checkmark: `{checkmark} {operation} complete`

3. **Given** an operation fails **When** the spinner resolves **Then** it is replaced by an X mark: `{cross mark} {operation} failed` **And** an actionable error message follows

## Tasks / Subtasks

- [x] Task 1: Create centralized progress indicator module (AC: #1, #2, #3)
  - [x] 1.1 Create `src/core/progress.js` with a `ProgressTracker` class or functions that wrap `@clack/prompts` spinner
  - [x] 1.2 Implement `start(message)` — shows spinner with descriptive message (delegates to `@clack/prompts spinner`)
  - [x] 1.3 Implement `succeed(message)` — replaces spinner with `{checkmark} {message}` using `output.success()`
  - [x] 1.4 Implement `fail(message)` — replaces spinner with `{cross mark} {message}` using `output.error()`, then caller provides actionable error details
  - [x] 1.5 Export named functions or class for all CLI modules to use
  - [x] 1.6 Handle edge case: `fail()` without prior `start()` still works (no spinner to stop, just prints error)

- [x] Task 2: Migrate installer.js spinner usage to progress module (AC: #1, #2, #3)
  - [x] 2.1 Replace `spinner()` + `s.start()` / `s.stop()` patterns in `copyFramework()` with `progress.start()` / `progress.succeed()` / `progress.fail()`
  - [x] 2.2 Replace spinner in `registerSkills()` with progress module calls
  - [x] 2.3 Replace spinner in `generateLockFile()` with progress module calls
  - [x] 2.4 Remove direct `@clack/prompts` spinner import from installer.js (replace with progress module import)
  - [x] 2.5 Keep `confirm` import from `@clack/prompts` — interactive prompts are out of scope

- [x] Task 3: Migrate update.js spinner usage to progress module (AC: #1, #2, #3)
  - [x] 3.1 Replace all 7 spinner blocks (file analysis, backup, framework update, restore, status_history migration, plan.md check, post-migration validation, lock file update) with progress module calls
  - [x] 3.2 Keep `intro()` and `outro()` imports from `@clack/prompts` — they serve structured boundary UX, not progress indication
  - [x] 3.3 Remove `spinner` from `@clack/prompts` import

- [x] Task 4: Verify consistent progress output across all commands (AC: #1, #2, #3)
  - [x] 4.1 Verify install.js command flow: config -> copyFramework -> registerSkills -> outputDirs -> lockFile -> verify -> summary all use progress module where appropriate
  - [x] 4.2 Verify update.js command flow: all long operations show spinner on start, checkmark/X on finish
  - [x] 4.3 Verify no remaining direct `spinner()` usage in src/ (only in the progress module itself)

- [x] Task 5: Write ATDD tests for progress module (AC: #1, #2, #3)
  - [x] 5.1 Test `progress.start()` creates a spinner with the given message
  - [x] 5.2 Test `progress.succeed()` calls `output.success()` with the formatted message
  - [x] 5.3 Test `progress.fail()` calls `output.error()` with the formatted message
  - [x] 5.4 Test `progress.fail()` without prior `start()` does not throw (graceful no-spinner case)
  - [x] 5.5 Test that the progress module uses `@clack/prompts` spinner internally (unit test with mock)
  - [x] 5.6 Test spinner stop messages match UX-DR8 pattern: `{operation} complete` / `{operation} failed`

- [x] Task 6: Sync to create-scrum-workflow copies (AC: #1, #2, #3)
  - [x] 6.1 Ensure `src/core/progress.js` is present in both `create-scrum-workflow/src/core/` and `create-scrum-workflow/templates/src/core/`
  - [x] 6.2 Ensure all migrated files are synced to `create-scrum-workflow/templates/` copies

## Dev Notes

### Critical Context: What Story 6.2 Implements

This story implements UX-DR8: progress indicators with spinner for running, checkmark for complete, X mark for failed. The goal is to provide a centralized progress tracking mechanism that all CLI operations use consistently.

**Current state of the codebase (post-Story 6.1):**
- `installer.js` — Uses `@clack/prompts` `spinner()` directly with `s.start()` / `s.stop()` in 3 methods: `copyFramework()`, `registerSkills()`, `generateLockFile()`
- `update.js` — Uses `@clack/prompts` `spinner()` directly in 8 spinner blocks throughout the update pipeline
- `install.js` — Does NOT use spinners directly (delegates to Installer class which does)
- `validate.js` — Does NOT use spinners (instant validation)
- `status.js` — Does NOT use spinners (instant read)

**The problem:** Each file creates its own `spinner()` instances and manually calls `s.start()` / `s.stop()`. The `s.stop()` call just prints plain text, it does NOT use the centralized `output.success()` / `output.error()` functions from Story 6.1. This means:
- No `{checkmark}` prefix on successful operations (violates UX-DR8)
- No `{cross mark}` prefix on failed operations (violates UX-DR8)
- No color coding on progress resolution messages
- Inconsistent with the output system established in Story 6.1

### The Solution: Centralized Progress Module

Create `src/core/progress.js` — a thin wrapper around `@clack/prompts` spinner that integrates with the `output.js` module from Story 6.1:

```javascript
// Internal API design:
const s = spinner()

export function start(msg) {
  s.start(msg)
}

export function succeed(msg) {
  s.stop('')                        // Stop the spinner animation (no message — output.success handles it)
  output.success(msg)               // Uses the centralized output module (green + checkmark)
}

export function fail(msg) {
  s.stop('')                        // Stop the spinner animation (no message — output.error handles it)
  output.error(msg)                 // Uses the centralized output module (red + cross mark)
}
```

**Key design decisions:**
- `@clack/prompts` `spinner()` is KEPT as the animation engine — it handles the spinning character display
- The `s.stop()` message is set to empty string `''` because we delegate the final status line to `output.success()` / `output.error()` for consistent formatting
- This creates a unified output pattern: spinner during work -> `{checkmark} green message` on success or `{cross mark} red message` on failure
- `fail()` callers are responsible for printing actionable error details AFTER calling `progress.fail()`

### Architecture Compliance

- **UX-DR8**: Spinner for running, checkmark for complete, X mark for failed — this is the PRIMARY requirement
- **UX-DR6**: Semantic colors on resolved messages (green success, red failure) — via output.js
- **UX-DR7**: Emoji prefixes on resolved messages ({checkmark}, {cross mark}) — via output.js
- **UX-DR9**: Single line per resolved message — via output.js
- **UX-DR13**: Consistent color coding — all progress goes through output.js
- **UX-DR15**: Consistent emoji prefixes — all progress goes through output.js
- **UX-DR16**: 4.5:1 contrast ratio — picocolors defaults meet this
- **UX-DR18**: Screen reader compatible — emoji + text provides redundant indication
- **NFR-2**: No external service dependency — @clack/prompts already a dependency
- **NFR-11**: Zero-config extensibility — new module is a file drop-in

### Previous Story Intelligence

**Story 6.1 (CLI Output Color & Emoji System):**
- Created `src/core/output.js` with `success()`, `warning()`, `error()`, `info()`, `step()`, `header()` functions
- All functions follow pattern: emoji prefix + picocolors color + console.log
- All 6 CLI files migrated to use output module for static text
- `@clack/prompts` `spinner()` calls were intentionally KEPT in Story 6.1 — this story (6.2) now wraps them
- ATDD test naming pattern: `ac{N}-{description}.test.js` in `test/unit/{feature}/`
- 48 ATDD tests written for Story 6.1 — follow same pattern
- Review patches in 6.1: multi-line output violated UX-DR9, unused imports — watch for these
- Template sync pattern: copy to both `create-scrum-workflow/src/` and `create-scrum-workflow/templates/src/`

**Story 5.2 (CLI Update & Migration):**
- The `create-scrum-workflow/` directory is the canonical source for CLI installer
- Templates live in `create-scrum-workflow/templates/`
- Tests use vitest (`vitest run`) as the test runner
- Test files go in `create-scrum-workflow/test/unit/`

### Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Language | JavaScript (ESM) | `"type": "module"` |
| CLI Framework | Commander.js | ^13.0.0 |
| Terminal Colors | picocolors | ^1.1.0 |
| Interactive UX | @clack/prompts | ^0.9.0 |
| Test Runner | Vitest | ^3.0.0 |
| Test Mocks | memfs | ^4.0.0 |

### File Structure

```
create-scrum-workflow/
  src/
    core/
      progress.js                <-- CREATE: centralized progress indicator module
      output.js                  <-- EXISTS: from Story 6.1 (DO NOT MODIFY)
      installer.js               <-- MODIFY: replace direct spinner() with progress module
      config-builder.js          <-- NO CHANGES (no spinner usage)
    commands/
      update.js                  <-- MODIFY: replace direct spinner() with progress module
      install.js                 <-- NO CHANGES (delegates to Installer class)
      validate.js                <-- NO CHANGES (no spinner usage)
      status.js                  <-- NO CHANGES (no spinner usage)
  templates/
    src/
      core/
        progress.js              <-- SYNC: copy of progress module
      core/                      <-- SYNC: copies of modified core files
  test/
    unit/
      progress/
        ac1-spinner-display.test.js       <-- CREATE
        ac2-checkmark-complete.test.js    <-- CREATE
        ac3-xmark-failed.test.js          <-- CREATE
```

**DO NOT modify:**
- `src/core/output.js` (Story 6.1 module — stable, do not touch)
- `src/commands/validate.js` (no spinner usage)
- `src/commands/status.js` (no spinner usage)
- `src/commands/install.js` (delegates to Installer class, no direct spinner usage)
- `src/integrity/` modules (hash/lock file — out of scope)
- `src/platform/` modules (platform registry — out of scope)
- `src/estimation/` modules (Wideband Delphi — out of scope)
- `bin/create-scrum-workflow.js` (CLI entry point — no changes needed)
- `scrum_workflow/` framework directory (Markdown specs — not CLI code)

### Dependencies

- No new dependencies required — @clack/prompts and picocolors are already installed
- Depends on Story 6.1 `output.js` module (already complete)
- This story is the SECOND in Epic 6 — depends on Story 6.1 (complete)

### Anti-Patterns to Avoid

1. **DO NOT add new npm dependencies** — @clack/prompts spinner and picocolors already provide everything needed
2. **DO NOT modify output.js** — it is stable from Story 6.1; progress.js consumes it, not modifies it
3. **DO NOT replace @clack/prompts spinner with a custom animation** — the spinner() function handles terminal animation correctly (cursor movement, cleanup, etc.)
4. **DO NOT pass multi-line messages to progress.succeed() or progress.fail()** — violates UX-DR9 (single line per message). Print detail lines with console.log BEFORE calling succeed/fail, or use output.step() for sub-items
5. **DO NOT remove @clack/prompts intro()/outro()/confirm() from files that use them** — only replace spinner() usage
6. **DO NOT add progress indicators to validate.js or status.js** — they perform instant operations that don't need spinners
7. **DO NOT create a singleton spinner that can't be reused** — the module should support sequential start/succeed/start/succeed patterns across multiple operations

### References

- [Source: _scrum-output/planning-artifacts/epics.md#Story 6.2]
- [Source: _scrum-output/planning-artifacts/ux-design-specification.md#Progress Patterns]
- [Source: create-scrum-workflow/src/core/output.js — Story 6.1 centralized output module]
- [Source: create-scrum-workflow/src/core/installer.js — current spinner usage (3 methods)]
- [Source: create-scrum-workflow/src/commands/update.js — current spinner usage (8 blocks)]
- [Source: create-scrum-workflow/package.json — dependencies (@clack/prompts ^0.9.0)]

### Git Intelligence

Recent commits show Story 6.1 completed with CLI output color & emoji system. Key files:
- `create-scrum-workflow/src/core/output.js` — centralized output module (DO NOT MODIFY)
- All 6 CLI files migrated to use output module

Code patterns from recent work:
- ESM imports throughout (`import ... from '...'`)
- Test files use `*.test.js` pattern in `test/unit/` subdirectories
- ATDD test naming: `ac{N}-{description}.test.js`
- 48 tests for Story 6.1 — follow same convention
- Review patches in 6.1: multi-line output violated UX-DR9 (enforce single-line in progress module too)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- All 34 ATDD tests pass (ac1-spinner-display, ac2-checkmark-complete, ac3-xmark-failed)
- Pre-existing test failures (6) are unrelated to this story (scrum-refine-story naming, platform-validation README)

### Completion Notes List

- Created `src/core/progress.js` — centralized progress indicator module wrapping @clack/prompts spinner with output.js integration
- Module exports: `start(msg)`, `succeed(msg)`, `fail(msg)` following UX-DR8 pattern
- Migrated all 3 spinner usages in `installer.js` (copyFramework, registerSkills, generateLockFile) to progress module
- Migrated all 8 spinner blocks in `update.js` (file analysis, backup, framework update, restore, status_history migration, plan.md check, post-migration validation, lock file update) to progress module
- Removed direct `spinner` import from both files — only `progress.js` imports `spinner` from @clack/prompts
- Kept `confirm`, `intro`, `outro` imports from @clack/prompts unchanged (interactive prompts are out of scope)
- All template copies synced: progress.js, installer.js, update.js
- No new dependencies added — uses existing @clack/prompts spinner and output.js module
- Full regression suite: 280 tests pass, 6 pre-existing failures unrelated to this story

### File List

**Created:**
- create-scrum-workflow/src/core/progress.js
- create-scrum-workflow/templates/src/core/progress.js

**Modified:**
- create-scrum-workflow/src/core/installer.js
- create-scrum-workflow/src/commands/update.js
- create-scrum-workflow/templates/src/core/installer.js
- create-scrum-workflow/templates/src/commands/update.js

**Pre-existing (ATDD tests, not modified by this story):**
- create-scrum-workflow/test/unit/progress/ac1-spinner-display.test.js
- create-scrum-workflow/test/unit/progress/ac2-checkmark-complete.test.js
- create-scrum-workflow/test/unit/progress/ac3-xmark-failed.test.js

## Change Log

- 2026-04-08: Story 6.2 implementation complete — centralized progress indicator module created, all spinner usage migrated to progress module, 34 ATDD tests passing

### Review Findings

- [x] [Review][Patch] Variable scoping bug: `planMdResult` shadowed by block-scoped redeclaration in Step 5.2 [update.js:548] -- FIXED: removed `const` keyword so outer `let` variable is correctly assigned
- [x] [Review][Patch] Dead code: `generateValidationReport()` function defined but never called [update.js:269-314] -- FIXED: removed unused function
- [x] [Review][Patch] DRY violation: identical 7-line directory scanning block duplicated in 3 functions [update.js] -- FIXED: extracted shared `findStoryDirs()` helper
- [x] [Review][Patch] Dead field: `warnings` array declared but never populated in `migrateStoryStatusHistory()` [update.js] -- FIXED: removed unused `warnings` from return type
- [x] [Review][Patch] Redundant dynamic re-import: `readdirSync`/`statSync` re-imported via `await import('node:fs')` at line 398 despite already being imported at line 1 [update.js:398] -- FIXED: added `statSync` to top-level import, removed dynamic import
- [x] [Review][Patch] UX-DR8 message pattern inconsistency: "Framework files updated complete", "User modifications restored complete", "Lock file updated complete" [update.js] -- FIXED: corrected to "Framework update complete", "User modifications restore complete", "Lock file update complete"
