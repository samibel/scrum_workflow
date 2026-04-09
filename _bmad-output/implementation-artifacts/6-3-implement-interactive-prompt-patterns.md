# Story 6.3: Implement Interactive Prompt Patterns

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want consistent prompt patterns for confirmations, inputs, and selections,
So that CLI interactions are predictable and intuitive.

## Acceptance Criteria

1. **Given** UX-DR10 specifies confirmation dialogs for destructive actions **When** a destructive action is about to occur (e.g., overwriting existing files) **Then** a confirmation prompt is displayed: `? This will overwrite existing files. Continue? (y/N)` **And** the default is No (safe default)

2. **Given** UX-DR11 specifies input prompts with defaults **When** information is missing and needs user input **Then** a prompt is displayed with the default value in parentheses: `? Project name: (my-project)`

3. **Given** UX-DR12 specifies selection prompts for multiple options **When** multiple options are available (e.g., platform selection in non-auto-detect mode) **Then** options are numbered: `? Select platform: (1) Claude Code, (2) Cursor, (3) Windsurf`

## Tasks / Subtasks

- [x] Task 1: Create centralized prompt module (AC: #1, #2, #3)
  - [x] 1.1 Create `src/core/prompts.js` with wrapper functions for `@clack/prompts` interactive functions: `confirmAction()`, `inputText()`, `selectOption()`, `multiSelectOptions()`
  - [x] 1.2 Implement `confirmAction(message, { defaultValue })` -- wraps `@clack/prompts` `confirm()`, enforces safe default (No for destructive actions), handles cancel via `isCancel()` + `cancel()`
  - [x] 1.3 Implement `inputText(message, { defaultValue, placeholder, validate })` -- wraps `@clack/prompts` `text()`, shows default in parentheses per UX-DR11, handles cancel
  - [x] 1.4 Implement `selectOption(message, options)` -- wraps `@clack/prompts` `select()`, displays numbered options per UX-DR12, handles cancel
  - [x] 1.5 Implement `multiSelectOptions(message, options, { initialValues })` -- wraps `@clack/prompts` `multiselect()`, handles cancel
  - [x] 1.6 All functions handle cancel consistently: call `cancel('Operation cancelled')` then `process.exit(0)` when user presses Ctrl+C or escapes
  - [x] 1.7 Export all prompt functions as named exports

- [x] Task 2: Migrate config-builder.js to use prompt module (AC: #2, #3)
  - [x] 2.1 Replace direct `text()` call for directory prompt with `inputText()`
  - [x] 2.2 Replace direct `text()` call for project name prompt with `inputText()`
  - [x] 2.3 Replace direct `multiselect()` call for platform selection with `multiSelectOptions()`
  - [x] 2.4 Replace direct `text()` call for framework path prompt with `inputText()`
  - [x] 2.5 Remove `isCancel`, `cancel`, `text`, `multiselect` imports from `@clack/prompts` (only keep `intro` since it's a boundary UX element, not a prompt pattern)
  - [x] 2.6 Remove all inline `isCancel()` / `cancel()` / `process.exit(0)` blocks (now handled by prompts.js)

- [x] Task 3: Migrate installer.js confirm to use prompt module (AC: #1)
  - [x] 3.1 Replace direct `confirm()` call in `checkExisting()` with `confirmAction()`
  - [x] 3.2 Remove `confirm`, `isCancel`, `cancel` imports from `@clack/prompts` in installer.js
  - [x] 3.3 Remove inline `isCancel()` / `cancel()` / `process.exit(0)` block (now handled by prompts.js)

- [x] Task 4: Verify no remaining direct @clack/prompts prompt usage (AC: #1, #2, #3)
  - [x] 4.1 Verify `config-builder.js` no longer imports `text`, `multiselect`, `isCancel`, `cancel` from `@clack/prompts`
  - [x] 4.2 Verify `installer.js` no longer imports `confirm`, `isCancel`, `cancel` from `@clack/prompts`
  - [x] 4.3 Verify `install.js` and `update.js` are unchanged (they only use `intro`/`outro` which are boundary UX elements, not prompt patterns)
  - [x] 4.4 Verify the only direct `@clack/prompts` interactive imports are in `src/core/prompts.js`

- [x] Task 5: Write ATDD tests for prompt module (AC: #1, #2, #3)
  - [x] 5.1 Test `confirmAction()` calls `confirm()` with correct message and default value
  - [x] 5.2 Test `confirmAction()` handles cancel (isCancel returns true) by calling `cancel()` and exiting
  - [x] 5.3 Test `inputText()` calls `text()` with message, default value, and optional validate function
  - [x] 5.4 Test `inputText()` handles cancel
  - [x] 5.5 Test `selectOption()` calls `select()` with numbered options matching UX-DR12 format
  - [x] 5.6 Test `selectOption()` handles cancel
  - [x] 5.7 Test `multiSelectOptions()` calls `multiselect()` with correct options and initialValues
  - [x] 5.8 Test `multiSelectOptions()` handles cancel
  - [x] 5.9 Test all prompt functions follow consistent cancel pattern (cancel message + exit)

- [x] Task 6: Sync to create-scrum-workflow copies (AC: #1, #2, #3)
  - [x] 6.1 Ensure `src/core/prompts.js` is present in both `create-scrum-workflow/src/core/` and `create-scrum-workflow/templates/src/core/`
  - [x] 6.2 Ensure all migrated files are synced to `create-scrum-workflow/templates/` copies

## Dev Notes

### Critical Context: What Story 6.3 Implements

This story implements UX-DR10 (confirmation dialogs), UX-DR11 (input prompts with defaults), and UX-DR12 (selection prompts for multiple options). The goal is to provide a centralized prompt module that wraps `@clack/prompts` interactive functions, similar to how Story 6.1 centralized output formatting and Story 6.2 centralized progress indicators.

**Current state of the codebase (post-Story 6.2):**

- `config-builder.js` -- Uses `@clack/prompts` `text()`, `multiselect()`, `isCancel()`, `cancel()` directly. Four interactive prompts: directory, project name, platform selection, framework path. Each prompt has an inline `isCancel()` check followed by `cancel()` + `process.exit(0)`. This repetitive cancel-handling pattern is duplicated 4 times.
- `installer.js` -- Uses `@clack/prompts` `confirm()` in `checkExisting()`. One inline `isCancel()` check + `cancel()` + `process.exit(0)`.
- `install.js` -- Uses `outro()` only. NOT interactive prompts. No changes needed.
- `update.js` -- Uses `intro()` and `outro()` only. NOT interactive prompts. No changes needed.
- `validate.js` -- Does NOT use interactive prompts.
- `status.js` -- Does NOT use interactive prompts.

**The problem:** Each file creates its own prompt instances and repeats the same cancel-handling boilerplate:
```javascript
const answer = await text({ message: '...', defaultValue: '...' })
if (isCancel(answer)) {
  cancel('Operation cancelled')
  process.exit(0)
}
```
This pattern is repeated 5 times across 2 files. Additionally, there's no consistent enforcement of UX-DR10's safe-default requirement for destructive actions.

### The Solution: Centralized Prompt Module

Create `src/core/prompts.js` -- a wrapper module around `@clack/prompts` interactive functions that:
1. Provides consistent cancel handling (centralized, no repeated boilerplate)
2. Enforces UX-DR10 safe defaults for confirmations
3. Presents all prompts in the UX-DR11 and UX-DR12 formats
4. Integrates with the `output.js` module for any status messages

```javascript
// API design:
import { confirm, text, select, multiselect, isCancel, cancel } from '@clack/prompts'

export async function confirmAction(message, { defaultValue = false } = {}) {
  const result = await confirm({ message, initialValue: defaultValue })
  if (isCancel(result)) {
    cancel('Operation cancelled')
    process.exit(0)
  }
  return result
}

export async function inputText(message, { defaultValue, placeholder, validate } = {}) {
  const result = await text({ message, defaultValue, placeholder, validate })
  if (isCancel(result)) {
    cancel('Operation cancelled')
    process.exit(0)
  }
  return result
}

export async function selectOption(message, options) {
  const result = await select({ message, options })
  if (isCancel(result)) {
    cancel('Operation cancelled')
    process.exit(0)
  }
  return result
}

export async function multiSelectOptions(message, options, { initialValues } = {}) {
  const result = await multiselect({ message, options, initialValues, required: true })
  if (isCancel(result)) {
    cancel('Operation cancelled')
    process.exit(0)
  }
  return result
}
```

**Key design decisions:**
- `@clack/prompts` `confirm()`, `text()`, `select()`, `multiselect()` are KEPT as the interactive prompt engines -- they handle terminal rendering, cursor movement, keyboard input correctly
- Cancel handling is centralized: every function checks `isCancel()` and calls `cancel()` + `process.exit(0)` -- this eliminates 5 duplicate cancel-handling blocks across the codebase
- `confirmAction()` defaults to `false` (safe default per UX-DR10) -- destructive actions require explicit Yes
- `selectOption()` provides single-selection (wraps `select()`), distinct from `multiSelectOptions()` (wraps `multiselect()`)
- `intro()` and `outro()` are NOT wrapped -- they are boundary UX elements, not prompt patterns. They remain as direct `@clack/prompts` imports in consuming files.

### Architecture Compliance

- **UX-DR10**: Confirmation dialogs for destructive actions with safe default (No) -- `confirmAction()` enforces this
- **UX-DR11**: Input prompts with defaults in parentheses -- `inputText()` wraps `text()` which renders defaults
- **UX-DR12**: Selection prompts with numbered options -- `selectOption()` wraps `select()` which renders numbered list
- **UX-DR6**: Semantic colors -- @clack/prompts applies its own color styling to prompts
- **UX-DR9**: Single line per message -- not directly applicable to interactive prompts (prompts are inherently multi-line for options)
- **UX-DR13**: Consistent color coding -- all prompts go through @clack/prompts which applies consistent styling
- **UX-DR17**: Keyboard navigation (Tab completion, arrow keys) -- @clack/prompts natively supports this
- **UX-DR18**: Screen reader compatible -- @clack/prompts renders text-based UI
- **NFR-2**: No external service dependency -- @clack/prompts already a dependency
- **NFR-11**: Zero-config extensibility -- new module is a file drop-in

### Previous Story Intelligence

**Story 6.2 (Progress Indicators):**
- Created `src/core/progress.js` as centralized wrapper around `@clack/prompts` spinner
- Module pattern: thin wrapper that delegates to @clack/prompts for rendering, uses `output.js` for result display
- ATDD test naming: `ac{N}-{description}.test.js` in `test/unit/{feature}/`
- 34 ATDD tests for Story 6.2
- Template sync pattern: copy to both `create-scrum-workflow/src/` and `create-scrum-workflow/templates/src/`
- All spinner usage migrated from direct `@clack/prompts` imports to `progress.js` module

**Story 6.1 (CLI Output Color & Emoji System):**
- Created `src/core/output.js` with `success()`, `warning()`, `error()`, `info()`, `step()`, `header()` functions
- Pattern: centralized module that wraps a library and adds project-specific formatting
- 48 ATDD tests written for Story 6.1
- Review patches in 6.1: multi-line output violated UX-DR9, unused imports -- watch for these
- All 6 CLI files migrated to use output module for static text

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
      prompts.js                 <-- CREATE: centralized prompt module
      progress.js                <-- EXISTS: from Story 6.2 (DO NOT MODIFY)
      output.js                  <-- EXISTS: from Story 6.1 (DO NOT MODIFY)
      installer.js               <-- MODIFY: replace direct confirm() with prompts module
      config-builder.js          <-- MODIFY: replace direct text()/multiselect() with prompts module
    commands/
      update.js                  <-- NO CHANGES (only uses intro/outro, not interactive prompts)
      install.js                 <-- NO CHANGES (only uses outro, not interactive prompts)
      validate.js                <-- NO CHANGES (no interactive prompts)
      status.js                  <-- NO CHANGES (no interactive prompts)
  templates/
    src/
      core/
        prompts.js               <-- SYNC: copy of prompt module
      core/                      <-- SYNC: copies of modified core files
  test/
    unit/
      prompts/
        ac1-confirmation-dialog.test.js     <-- CREATE
        ac2-input-prompt-defaults.test.js   <-- CREATE
        ac3-selection-prompt-options.test.js <-- CREATE
```

**DO NOT modify:**
- `src/core/output.js` (Story 6.1 module -- stable, do not touch)
- `src/core/progress.js` (Story 6.2 module -- stable, do not touch)
- `src/commands/update.js` (only uses intro/outro -- boundary UX, not prompt patterns)
- `src/commands/install.js` (only uses outro -- boundary UX, not prompt patterns)
- `src/commands/validate.js` (no interactive prompts)
- `src/commands/status.js` (no interactive prompts)
- `src/integrity/` modules (hash/lock file -- out of scope)
- `src/platform/` modules (platform registry -- out of scope)
- `src/estimation/` modules (Wideband Delphi -- out of scope)
- `bin/create-scrum-workflow.js` (CLI entry point -- no changes needed)
- `scrum_workflow/` framework directory (Markdown specs -- not CLI code)

### Dependencies

- No new dependencies required -- @clack/prompts already installed (^0.9.0)
- `@clack/prompts` provides: `confirm`, `text`, `select`, `multiselect`, `isCancel`, `cancel`
- Depends on Story 6.1 `output.js` module (already complete)
- Depends on Story 6.2 `progress.js` module (already complete)
- This story is the THIRD in Epic 6 -- depends on Stories 6.1 and 6.2 (both complete)

### Anti-Patterns to Avoid

1. **DO NOT add new npm dependencies** -- @clack/prompts provides all interactive prompt functionality needed
2. **DO NOT modify output.js or progress.js** -- they are stable from Stories 6.1 and 6.2; prompts.js is a sibling module, not a modifier of either
3. **DO NOT wrap intro() or outro()** -- they are boundary UX elements (visual framing), not interactive prompt patterns. They should remain as direct imports in consuming files
4. **DO NOT remove intro() from config-builder.js** -- it serves a visual framing purpose before prompts begin
5. **DO NOT add interactive prompts to update.js** -- update.js is designed to be non-interactive (all operations proceed without prompting). Only intro()/outro() are used for visual framing
6. **DO NOT change the --yes flow in config-builder.js** -- the non-interactive path (when `options.yes === true`) should remain unchanged; prompts.js functions are only called in the interactive path
7. **DO NOT create a singleton prompt state** -- each prompt function should be independently callable without shared mutable state
8. **DO NOT pass multi-line messages to cancel()** -- keep cancel messages single-line for consistency

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.3]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Interaction Patterns]
- [Source: create-scrum-workflow/src/core/output.js -- Story 6.1 centralized output module]
- [Source: create-scrum-workflow/src/core/progress.js -- Story 6.2 centralized progress module]
- [Source: create-scrum-workflow/src/core/config-builder.js -- current prompt usage (4 prompts)]
- [Source: create-scrum-workflow/src/core/installer.js -- current confirm usage (1 prompt)]
- [Source: create-scrum-workflow/package.json -- dependencies (@clack/prompts ^0.9.0)]

### Git Intelligence

Recent commits show Story 6.2 completed with centralized progress indicator module. Key patterns:
- Module pattern: thin wrapper around `@clack/prompts` that centralizes cross-cutting concerns
- ESM imports throughout (`import ... from '...'`)
- Test files use `*.test.js` pattern in `test/unit/` subdirectories
- ATDD test naming: `ac{N}-{description}.test.js`
- Template sync: every modified/created file must be copied to `create-scrum-workflow/templates/`

### @clack/prompts API Reference (version 0.9.x)

Key functions used in this story:
- `confirm({ message, initialValue })` -- yes/no prompt, returns boolean or symbol
- `text({ message, defaultValue, placeholder, validate })` -- text input, returns string or symbol
- `select({ message, options })` -- single selection from list, returns selected value or symbol
- `multiselect({ message, options, initialValues, required })` -- multi-selection, returns array or symbol
- `isCancel(value)` -- returns true if user cancelled (Ctrl+C or Escape)
- `cancel(message)` -- displays cancellation message
- `intro(message)` -- displays intro banner (NOT wrapped -- boundary UX)
- `outro(message)` -- displays outro banner (NOT wrapped -- boundary UX)

The `select()` function from @clack/prompts renders options as a navigable list with arrow keys. This satisfies UX-DR12's numbered selection pattern through native @clack/prompts rendering.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Fixed ATDD test mock issue: `vi.restoreAllMocks()` in `afterEach` was removing `process.exit` mock implementation, causing vitest's built-in exit protection to throw. Fixed by changing to `vi.clearAllMocks()` + re-applying `mockImplementation`.
- Fixed process.exit count assertion: comment in prompts.js matched `process.exit(0)` regex causing count to be 5 instead of expected 4. Changed comment wording to avoid regex match.

### Completion Notes List

- Created `src/core/prompts.js` with 4 wrapper functions: `confirmAction()`, `inputText()`, `selectOption()`, `multiSelectOptions()` -- all with centralized cancel handling
- Migrated `config-builder.js`: replaced 4 direct `@clack/prompts` calls (text x3, multiselect x1) with prompt module calls, removed 4 inline cancel-handling blocks, kept only `intro` import
- Migrated `installer.js`: replaced 1 direct `confirm()` call with `confirmAction()`, removed inline cancel-handling block, removed all `@clack/prompts` imports
- Verified no remaining direct interactive prompt imports outside `prompts.js` -- only `intro`/`outro` (boundary UX) remain in other files
- All 53 ATDD tests pass across 3 test files (ac1, ac2, ac3)
- All 162 existing tests pass (0 regressions)
- Synced all modified/created files to `create-scrum-workflow/templates/`

### File List

- create-scrum-workflow/src/core/prompts.js (NEW)
- create-scrum-workflow/src/core/config-builder.js (MODIFIED)
- create-scrum-workflow/src/core/installer.js (MODIFIED)
- create-scrum-workflow/templates/src/core/prompts.js (NEW - synced)
- create-scrum-workflow/templates/src/core/config-builder.js (MODIFIED - synced)
- create-scrum-workflow/templates/src/core/installer.js (MODIFIED - synced)
- create-scrum-workflow/test/unit/prompts/ac1-confirmation-dialog.test.js (MODIFIED - fixed mock setup)
- create-scrum-workflow/test/unit/prompts/ac2-input-prompt-defaults.test.js (MODIFIED - fixed mock setup)
- create-scrum-workflow/test/unit/prompts/ac3-selection-prompt-options.test.js (MODIFIED - fixed mock setup)

## Change Log

- 2026-04-08: Story 6.3 created -- interactive prompt patterns for confirmation, input, and selection
- 2026-04-08: Story 6.3 implemented -- centralized prompt module with 53 ATDD tests, config-builder.js and installer.js migrated
- 2026-04-08: Code review -- 3 patch findings fixed, 1 pre-existing deferred

### Review Findings

- [x] [Review][Patch] Raw console.log() bypasses output module in config-builder.js [config-builder.js:29-32, 105-108] -- replaced with output.step() for UX-DR9/DR13 compliance
- [x] [Review][Patch] Raw console.log() bypasses output module in installer.js printSummary() [installer.js:203-205] -- replaced with output.step() for UX-DR9/DR13 compliance
- [x] [Review][Patch] Inconsistent cancel message in installer.js checkExisting() [installer.js:69-70] -- replaced output.info() with cancel() from @clack/prompts for visual consistency
- [x] [Review][Defer] Singleton spinner in progress.js [progress.js:24] -- deferred, pre-existing
