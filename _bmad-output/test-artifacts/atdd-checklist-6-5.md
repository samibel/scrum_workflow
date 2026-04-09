---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-04c-aggregate
  - step-05-validate-and-complete
lastStep: step-05-validate-and-complete
lastSaved: '2026-04-08'
inputDocuments:
  - _bmad-output/implementation-artifacts/6-5-implement-success-messages-next-step-guidance.md
  - create-scrum-workflow/package.json
  - create-scrum-workflow/vitest.config.js
  - create-scrum-workflow/src/core/output.js
  - create-scrum-workflow/src/core/progress.js
  - create-scrum-workflow/src/commands/install.js
  - create-scrum-workflow/src/commands/update.js
  - create-scrum-workflow/src/commands/validate.js
  - create-scrum-workflow/src/commands/status.js
  - create-scrum-workflow/src/core/installer.js
  - create-scrum-workflow/src/core/config-builder.js
  - create-scrum-workflow/bin/create-scrum-workflow.js
---

# ATDD Checklist: Story 6.5 - Implement Success Messages & Next-Step Guidance

## TDD Red Phase (Current)

**Status:** RED -- Tests fail because `src/core/next-steps.js` does not exist yet, commands do not import or use the next-step module, and `validate.js`/`status.js` lack outro messages. This is intentional (TDD red phase).

- **Total Tests:** 59
- **Test Files:** 3
- **Failing Tests:** 34 (tests that verify new behavior)
- **Passing Tests:** 25 (tests that verify existing unchanged behavior)
- **Test Level:** Unit (File Content Verification)
- **Test Framework:** Vitest ^4.1.3
- **Stack:** Backend (Node.js CLI)
- **Execution Mode:** AI Generation (sequential -- backend stack, no browser tests needed)

## Acceptance Criteria Coverage

### AC1: Install Success Message with First Command Hint (UX-DR2)

- **File:** `tests/unit/success-messages-next-steps/ac1-install-success-next-step.spec.ts`
- **Tests:** 17 (12 failing, 5 passing)
- **Coverage:**
  - next-steps.js module exists with getNextStep function
  - getNextStep accepts command string and optional context parameter
  - getNextStep returns a string value
  - next-steps.js defines step mappings for all commands (install, update, validate, status)
  - install.js imports and calls getNextStep for 'install'
  - install.js success message references scrum-create-ticket
  - install.js uses outro() for final success message (not raw console.log)
  - install.js success message is single line (UX-DR9)
  - Template sync: next-steps.js and install.js in templates directory

### AC2: All Commands Include Actionable Next Step (UX-DR14)

- **File:** `tests/unit/success-messages-next-steps/ac2-all-commands-next-step.spec.ts`
- **Tests:** 25 (16 failing, 9 passing)
- **Coverage:**
  - update.js imports and calls getNextStep for 'update'
  - update.js includes actionable guidance (not bare "Update complete!")
  - update.js suggests concrete next action (scrum-create-ticket or review)
  - update.js uses outro() for final success message
  - validate.js imports and calls getNextStep for 'validate'
  - validate.js outputs next-step after successful validation
  - validate.js provides contextual next-step based on errors vs success
  - status.js imports and calls getNextStep for 'status'
  - status.js outputs next-step after status display
  - status.js provides contextual next-step based on detected issues
  - next-steps.js install step mentions scrum-create-ticket
  - next-steps.js supports context-aware messages for update, validate, status
  - next-steps.js has default fallback for unknown commands
  - All four commands import from next-steps module
  - All commands use output.success() or outro() consistently
  - No command uses bare console.log for success messages
  - Template sync for update.js, validate.js, status.js

### AC3: Progressive Disclosure -- Advanced Options Hidden (UX-DR3)

- **File:** `tests/unit/success-messages-next-steps/ac3-progressive-disclosure.spec.ts`
- **Tests:** 17 (6 failing, 11 passing)
- **Coverage:**
  - install.js success path does not mention --platform or --depth
  - update.js success path does not mention --platform or --dry-run
  - validate.js success path does not mention --platform or --depth
  - status.js success path does not mention --platform or --depth
  - next-steps.js does not mention --platform, --depth, --yes, or --dry-run
  - config-builder.js --yes output does not mention --platform or --depth
  - installer.js printSummary does not mention --platform, --depth, or --yes
  - CLI entry point uses Commander.js for help
  - CLI entry point defines --platform and --depth as Commander options

## Test Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| P0       | 35    | 59%        |
| P1       | 24    | 41%        |
| P2       | 0     | 0%         |
| P3       | 0     | 0%         |

## Architecture Compliance

- UX-DR2: One-line success with first command hint -- install command shows actionable next step
- UX-DR3: Progressive disclosure -- advanced options NOT in primary output, only in --help
- UX-DR9: Single line per message -- success messages are concise
- UX-DR13: Consistent color coding -- success messages use output.success() (green)
- UX-DR14: Actionable next step in ALL success messages -- every command includes what to do next
- UX-DR15: Consistent emoji prefixes -- status indicator (checkmark) first
- NFR-11: Zero-config extensibility -- next-steps module is a file drop-in
- NFR-13: Zero-knowledge onboarding -- developer knows exactly what to do next without docs

## Test Execution Results

```
Test Files  3 failed (3)
     Tests  34 failed | 25 passed (59 total)
  Duration  ~37ms
```

**RED phase confirmed:** Tests fail because:
1. `src/core/next-steps.js` does not exist (12 failures in AC1)
2. Commands don't import next-steps module yet (16 failures in AC2)
3. Progressive disclosure checks depend on next-steps.js existing (6 failures in AC3)

## Test-to-Task Traceability

| Test File | Story Tasks Covered |
|-----------|-------------------|
| ac1-install-success-next-step.spec.ts | Task 1.1 (create next-steps.js), Task 1.2 (define step mappings), Task 1.3 (ATDD tests), Task 2.1 (install.js uses next-step), Task 2.5 (installer.js summary check), Task 4.1 (template sync next-steps.js), Task 4.2 (sync modified files) |
| ac2-all-commands-next-step.spec.ts | Task 2.1 (install.js next-step), Task 2.2 (update.js next-step), Task 2.3 (validate.js next-step), Task 2.4 (status.js next-step), Task 2.5 (installer.js summary), Task 2.6 (ATDD tests for each command) |
| ac3-progressive-disclosure.spec.ts | Task 3.1 (audit advanced flag mentions), Task 3.2 (verify only in --help), Task 3.3 (ATDD tests for progressive disclosure) |

## Next Step

Implement the following to turn tests GREEN (TDD green phase):
1. Create `src/core/next-steps.js` with `getNextStep(command, context)` function
2. Modify `src/commands/install.js` to import and use getNextStep for 'install'
3. Modify `src/commands/update.js` to import and use getNextStep for 'update'
4. Modify `src/commands/validate.js` to import and use getNextStep for 'validate'
5. Modify `src/commands/status.js` to import and use getNextStep for 'status'
6. Sync all new/modified files to `create-scrum-workflow/templates/`
