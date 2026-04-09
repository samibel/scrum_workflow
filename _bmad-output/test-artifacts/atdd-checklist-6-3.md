---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-04c-aggregate
lastStep: step-04c-aggregate
lastSaved: '2026-04-08'
inputDocuments:
  - _bmad-output/implementation-artifacts/6-3-implement-interactive-prompt-patterns.md
  - create-scrum-workflow/package.json
  - create-scrum-workflow/vitest.config.js
  - create-scrum-workflow/src/core/output.js
  - create-scrum-workflow/src/core/progress.js
  - create-scrum-workflow/src/core/config-builder.js
  - create-scrum-workflow/src/core/installer.js
---

# ATDD Checklist: Story 6.3 - Implement Interactive Prompt Patterns

## TDD Red Phase (Current)

**Status:** RED -- All 53 tests fail because `src/core/prompts.js` does not exist yet. This is intentional (TDD red phase).

- **Total Tests:** 53
- **Test Files:** 3
- **Test Level:** Unit
- **Test Framework:** Vitest ^3.0.0
- **Stack:** Backend (Node.js CLI)

## Acceptance Criteria Coverage

### AC1: Confirmation Dialogs for Destructive Actions (UX-DR10)

- **File:** `create-scrum-workflow/test/unit/prompts/ac1-confirmation-dialog.test.js`
- **Tests:** 16 (11 P0, 5 P1)
- **Coverage:**
  - confirmAction() calls confirm() with provided message
  - Default value is false (safe default per UX-DR10)
  - Allows overriding default to true
  - Returns boolean result (true/false)
  - Cancel handling: detects cancel via isCancel(), calls cancel('Operation cancelled'), calls process.exit(0)
  - No cancel/exit when user provides answer
  - Module exports verified: confirmAction
  - Imports verified: confirm, isCancel, cancel from @clack/prompts
  - Centralized process.exit pattern (4 occurrences, one per prompt function)

### AC2: Input Prompts with Defaults (UX-DR11)

- **File:** `create-scrum-workflow/test/unit/prompts/ac2-input-prompt-defaults.test.js`
- **Tests:** 17 (11 P0, 6 P1)
- **Coverage:**
  - inputText() calls text() with provided message
  - Passes defaultValue, placeholder, validate to text()
  - Returns string result
  - Works without any options
  - Cancel handling: detects cancel via isCancel(), calls cancel('Operation cancelled'), calls process.exit(0)
  - No cancel/exit when user provides input
  - Config-builder scenarios: directory prompt, project name prompt, framework path prompt with validation
  - Module exports verified: inputText
  - Imports verified: text from @clack/prompts

### AC3: Selection Prompts for Multiple Options (UX-DR12)

- **File:** `create-scrum-workflow/test/unit/prompts/ac3-selection-prompt-options.test.js`
- **Tests:** 20 (14 P0, 6 P1)
- **Coverage:**
  - selectOption() calls select() with message and options
  - Returns selected value
  - Renders options as navigable list via @clack/prompts select()
  - Works with two options
  - multiSelectOptions() calls multiselect() with message and options
  - Passes initialValues and required: true to multiselect()
  - Returns array of selected values
  - Cancel handling for selectOption(): isCancel(), cancel(), process.exit(0)
  - Cancel handling for multiSelectOptions(): isCancel(), cancel(), process.exit(0)
  - Module exports verified: selectOption, multiSelectOptions
  - Imports verified: select, multiselect from @clack/prompts
  - Consistent cancel message across all prompt functions

## Test Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| P0       | 36    | 68%        |
| P1       | 17    | 32%        |
| P2       | 0     | 0%         |
| P3       | 0     | 0%         |

## Architecture Compliance

- UX-DR10: Confirmation dialogs with safe default (No) -- confirmAction() defaults to false
- UX-DR11: Input prompts with defaults in parentheses -- inputText() wraps text() with defaultValue
- UX-DR12: Selection prompts with numbered options -- selectOption() wraps select() with options
- UX-DR6: Semantic colors via @clack/prompts native styling
- UX-DR9: Single line messages for cancel text
- UX-DR13: Consistent color coding via @clack/prompts
- UX-DR17: Keyboard navigation (arrow keys) via @clack/prompts native support
- UX-DR18: Screen reader compatible -- @clack/prompts renders text-based UI
- NFR-2: No external service dependency -- @clack/prompts already installed
- NFR-11: Zero-config extensibility -- prompts.js is a file drop-in

## Test Execution Results

```
Test Files  3 failed (3)
     Tests  53 failed (53)
  Duration  ~411ms
```

**RED phase confirmed:** All tests fail because `src/core/prompts.js` does not exist.

## Test-to-Task Traceability

| Test File | Story Tasks Covered |
|-----------|-------------------|
| ac1-confirmation-dialog.test.js | Task 1.2 (confirmAction), Task 1.6 (cancel handling), Task 3.1 (installer migration) |
| ac2-input-prompt-defaults.test.js | Task 1.3 (inputText), Task 1.6 (cancel handling), Task 2 (config-builder migration) |
| ac3-selection-prompt-options.test.js | Task 1.4 (selectOption), Task 1.5 (multiSelectOptions), Task 1.6 (cancel handling), Task 2 (config-builder migration) |

## Next Step

Implement `src/core/prompts.js` to turn tests GREEN (TDD green phase).
