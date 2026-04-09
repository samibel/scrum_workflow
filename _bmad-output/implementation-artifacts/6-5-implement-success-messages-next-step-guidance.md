# Story 6.5: Implement Success Messages & Next-Step Guidance

Status: done

## Story

As a developer,
I want every successful operation to end with a clear next-step call-to-action,
So that I always know what to do next.

## Acceptance Criteria

1. **Given** UX-DR2 specifies one-line success with first command hint after installation **When** installation completes successfully **Then** a success message is displayed with the first actionable command: e.g., `✓ Installation complete! Try: /scrum-create-ticket "your feature description"`

2. **Given** UX-DR14 specifies actionable next step in all success messages **When** any command completes successfully **Then** the success message includes what to do next

3. **Given** UX-DR3 specifies progressive disclosure for advanced options **When** the default flow completes **Then** advanced options (`--platform`, `--depth`) are not mentioned in the primary output **And** they are only documented in help text (`--help`)

## Tasks / Subtasks

- [x] Task 1: Create next-step guidance module (AC: #1, #2)
  - [x] 1.1 Create `src/core/next-steps.js` with a `getNextStep(command, context)` function that returns an appropriate next-step message for each CLI command
  - [x] 1.2 Define next-step mappings for all commands: `install` -> `/scrum-create-ticket "your feature description"`, `update` -> check what changed, `status` -> next actions based on story states, `validate` -> fix issues or proceed
  - [x] 1.3 Write ATDD tests for next-step message generation

- [x] Task 2: Audit and enhance all success messages across commands (AC: #2)
  - [x] 2.1 In `install.js`: verify the existing `outro()` success message meets UX-DR2 (one-line success + first command). Replace raw `outro()` with the centralized next-step module
  - [x] 2.2 In `update.js`: replace bare `outro('Update complete!')` with an actionable next-step message (e.g., `✓ Update complete! Next: review the changelog or run /scrum-create-ticket to start a new story`)
  - [x] 2.3 In `validate.js`: add an actionable next-step message after validation success (e.g., `✓ Validation passed! Ready to use: /scrum-create-ticket "your feature description"`)
  - [x] 2.4 In `status.js`: add an actionable next-step message after status display (e.g., suggest running `validate` if issues are detected, or a workflow command if all looks good)
  - [x] 2.5 In `installer.js`: ensure `printSummary()` ends with a clear success line that includes the next-step hint (delegating to the next-step module rather than duplicating the outro message)
  - [x] 2.6 Write ATDD tests for each command's success message output

- [x] Task 3: Enforce progressive disclosure in default output (AC: #3)
  - [x] 3.1 Audit all command outputs to ensure `--platform`, `--depth`, and other advanced flags are NOT mentioned in standard success/completion messages
  - [x] 3.2 Verify that advanced options appear ONLY in `--help` output (Commander.js handles this automatically; confirm no hardcoded references)
  - [x] 3.3 Write ATDD tests confirming advanced flags are absent from success messages

- [x] Task 4: Sync to create-scrum-workflow copies (AC: #1, #2, #3)
  - [x] 4.1 Ensure `src/core/next-steps.js` is present in both `create-scrum-workflow/src/core/` and `create-scrum-workflow/templates/src/core/`
  - [x] 4.2 Ensure all modified files are synced to `create-scrum-workflow/templates/` copies

## Dev Notes

### Critical Context: What Story 6.5 Implements

This story implements UX-DR2 (one-line success with first command), UX-DR14 (actionable next step in all success messages), and UX-DR3 (progressive disclosure -- advanced options hidden from primary output). The goal is to ensure that every CLI command that completes successfully tells the developer exactly what to do next, without cluttering output with advanced flags.

**Current state of the codebase (post-Story 6.4):**

The CLI has four commands that produce success messages:
- `install` -- already has `outro("Installation complete! Try: /scrum-create-ticket 'your feature description'")` which partially satisfies UX-DR2 but is hardcoded in `install.js` rather than centralized
- `update` -- has bare `outro('Update complete!')` with NO next-step guidance
- `status` -- has no outro or next-step message at all
- `validate` -- has no outro or next-step message at all
- `installer.js` `printSummary()` -- prints a detailed summary but no clear success+next-step line

**The problem:** Only the `install` command has any next-step guidance, and it's hardcoded. UX-DR14 requires ALL success messages to include what to do next. Additionally, the `outro()` from `@clack/prompts` produces a styled message but it's not centralized -- each command manages its own success messaging, leading to inconsistency.

**UX Design Reference:**

From the UX specification:
- UX-DR2: "One-Line Success -- After installation, a single clear success message with the first command"
- UX-DR14: "Actionable Next Step -- Success messages include what to do next"
- UX-DR3: "Progressive Disclosure -- Advanced options only for power users"

**Critical Success Moments from UX spec:**
| Moment | User Reaction |
|--------|---------------|
| Command ausgeführt | "Laeuft." |
| "Done" message | "Hat funktioniert." |
| First Command Hint | "Probier ich aus." |

### Architecture Compliance

- **UX-DR2**: One-line success with first command hint -- install command shows actionable next step
- **UX-DR14**: Actionable next step in ALL success messages -- every command that completes successfully includes what to do next
- **UX-DR3**: Progressive disclosure -- advanced options NOT in primary output, only in --help
- **UX-DR9**: Single line per message -- next-step message is concise, one line
- **UX-DR13**: Consistent color coding -- success messages use `output.success()` (green)
- **UX-DR15**: Consistent emoji prefixes -- status indicator (checkmark) first
- **NFR-11**: Zero-config extensibility -- new module is a file drop-in
- **NFR-13**: Zero-knowledge onboarding -- developer knows exactly what to do next without docs

### Previous Story Intelligence

**Story 6.4 (Zero-Config Installation Flow):**
- Created `src/platform/platform-detector.js` with auto-detection
- Modified `bin/create-scrum-workflow.js` with `program.action()` default handler
- Modified `src/core/config-builder.js` to integrate auto-detection in `--yes` path
- Template sync: copy to both `create-scrum-workflow/src/` and `create-scrum-workflow/templates/`
- 47 ATDD tests for Story 6.4

**Story 6.3 (Interactive Prompt Patterns):**
- Created `src/core/prompts.js` with `confirmAction()`, `inputText()`, `selectOption()`, `multiSelectOptions()`
- Cancel handling pattern: `cancel('Operation cancelled')` + `process.exit(0)`

**Story 6.2 (Progress Indicators):**
- Created `src/core/progress.js` with `start()`, `succeed()`, `fail()`

**Story 6.1 (CLI Output Color & Emoji System):**
- Created `src/core/output.js` with `success()`, `warning()`, `error()`, `info()`, `step()`, `header()`
- Review patches from previous stories: watch for multi-line output (UX-DR9 violation), raw `console.log()` (use output module), unused imports

**Key patterns from code reviews across Stories 6.1-6.4:**
- Module pattern: thin wrapper around a library or pure utility
- All output goes through `output.js` -- no raw `console.log()` for status messages
- `outro()` from `@clack/prompts` used for final messages in install/update
- ATDD test naming: `ac{N}-{description}.test.js` in `test/unit/{feature}/`
- Template sync: every modified/created file must be copied to `create-scrum-workflow/templates/`

### The Solution: Centralized Next-Step Module + Command Updates

**Part A: Next-Step Guidance Module**

Create `src/core/next-steps.js` that provides consistent next-step messages for each command:

```javascript
// API design:
export function getNextStep(command, context = {}) {
  // Returns a string with the next-step call-to-action
  const STEPS = {
    install: 'Next: /scrum-create-ticket "your feature description"',
    update: context.hasFlaggedStories
      ? 'Next: address flagged stories above, then run /scrum-dev-story'
      : 'Next: /scrum-create-ticket "your feature description"',
    validate: context.hasErrors
      ? 'Next: fix the errors above and re-run validate'
      : 'Next: /scrum-create-ticket "your feature description"',
    status: context.hasIssues
      ? 'Next: run create-scrum-workflow validate for details'
      : 'Next: /scrum-create-ticket "your feature description"'
  }
  return STEPS[command] || 'Next: run create-scrum-workflow --help for available commands'
}
```

**Part B: Command Updates**

For each command, replace or enhance the final output:
1. `install.js` -- replace hardcoded `outro()` text with call to `getNextStep('install')`
2. `update.js` -- replace bare `outro('Update complete!')` with `outro()` using next-step message
3. `validate.js` -- add `outro()` with next-step after validation summary
4. `status.js` -- add `outro()` with contextual next-step after status display
5. `installer.js` `printSummary()` -- no change needed; the summary is informational, the outro in `install.js` provides the CTA

**Part C: Progressive Disclosure Audit**

Scan all success messages for mentions of `--platform`, `--depth`, `--yes`, or other advanced flags. These should appear ONLY in `--help` output. Commander.js handles `--help` automatically, so this is mainly about ensuring no command code mentions these flags in success/completion messages.

### Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Language | JavaScript (ESM) | `"type": "module"` |
| CLI Framework | Commander.js | ^13.0.0 |
| Terminal Colors | picocolors | ^1.1.0 |
| Interactive UX | @clack/prompts | ^0.9.0 |
| Test Runner | Vitest | ^3.0.0 |

### File Structure

```
create-scrum-workflow/
  src/
    core/
      next-steps.js                    <-- CREATE: centralized next-step messages
      output.js                        <-- EXISTS: from Story 6.1 (DO NOT MODIFY)
      progress.js                      <-- EXISTS: from Story 6.2 (DO NOT MODIFY)
      prompts.js                       <-- EXISTS: from Story 6.3 (DO NOT MODIFY)
      config-builder.js                <-- EXISTS: from Story 6.4 (NO CHANGES needed)
      installer.js                     <-- MINOR: ensure printSummary doesn't duplicate next-step
      skill-registrar.js               <-- EXISTS (DO NOT MODIFY)
      path-resolver.js                 <-- EXISTS (DO NOT MODIFY)
      status-history.js                <-- EXISTS (DO NOT MODIFY)
    commands/
      install.js                       <-- MODIFY: use next-step module in outro
      update.js                        <-- MODIFY: add next-step message in outro
      validate.js                      <-- MODIFY: add outro with next-step
      status.js                        <-- MODIFY: add outro with contextual next-step
    platform/
      platform-detector.js             <-- EXISTS: from Story 6.4 (DO NOT MODIFY)
      platform-registry.js             <-- EXISTS (DO NOT MODIFY)
    integrity/
      hash-tracker.js                  <-- EXISTS (DO NOT MODIFY)
      lock-file.js                     <-- EXISTS (DO NOT MODIFY)
    validation/
      validation-utils.js              <-- EXISTS (DO NOT MODIFY)
    estimation/
      wideband-delphi.js               <-- EXISTS (DO NOT MODIFY)
    core/approval/
      approve.js                       <-- EXISTS (DO NOT MODIFY)
  bin/
    create-scrum-workflow.js           <-- EXISTS (NO CHANGES needed)
  templates/
    src/
      core/
        next-steps.js                  <-- SYNC: copy of next-step module
      commands/                        <-- SYNC: copies of modified command files
  test/
    unit/
      next-steps/
        ac1-install-next-step.test.js          <-- CREATE
        ac2-all-commands-next-step.test.js     <-- CREATE
        ac3-progressive-disclosure.test.js     <-- CREATE
```

**DO NOT modify:**
- `src/core/output.js` (Story 6.1 module -- stable)
- `src/core/progress.js` (Story 6.2 module -- stable)
- `src/core/prompts.js` (Story 6.3 module -- stable)
- `src/core/config-builder.js` (Story 6.4 module -- stable, no changes needed)
- `src/platform/platform-detector.js` (Story 6.4 module -- stable)
- `src/platform/platform-registry.js` (platform registry loader -- stable)
- `bin/create-scrum-workflow.js` (CLI entry point -- no changes needed)
- `scrum_workflow/` framework directory (Markdown specs -- not CLI code)

### Dependencies

- No new npm dependencies required
- Depends on Story 6.1 `output.js` module (already complete)
- Depends on `@clack/prompts` `outro()` for final message display (already in use)
- This story is the FIFTH in Epic 6 -- depends on Stories 6.1, 6.2, 6.3, and 6.4 (all complete)

### Anti-Patterns to Avoid

1. **DO NOT add new npm dependencies** -- `outro()` from `@clack/prompts` and `output.success()` from the output module are sufficient
2. **DO NOT modify output.js, progress.js, prompts.js, or config-builder.js** -- they are stable from Stories 6.1-6.4
3. **DO NOT mention advanced flags in success messages** -- `--platform`, `--depth`, `--yes`, `--dry-run` belong ONLY in `--help` output. This is UX-DR3 progressive disclosure
4. **DO NOT duplicate the next-step message** -- the `outro()` in `install.js` provides the final CTA; `installer.js` `printSummary()` should NOT also include it. Keep the summary informational (facts about what was installed) and let the command-level outro handle the CTA
5. **DO NOT use raw `console.log()` for the next-step message** -- use `outro()` from `@clack/prompts` or `output.success()` for consistency
6. **DO NOT make next-step messages overly long** -- UX-DR9 specifies single line per message. The next-step should be concise: `Installation complete! Next: /scrum-create-ticket "your feature description"`
7. **DO NOT add next-step to error/failure paths** -- next-step guidance is for SUCCESS outcomes only. Error paths already have their own actionable guidance (e.g., "Run install first", "Check directory permissions")
8. **DO NOT create a next-step for every sub-step within a command** -- the next-step message is ONLY at the command-level completion (the final `outro()`). Sub-step progress messages (`Copying framework files...`, `Generating lock file...`) do NOT need next-step guidance

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.5]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Core User Experience]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Effortless Interactions]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX Consistency Patterns]
- [Source: create-scrum-workflow/src/commands/install.js -- current install command with hardcoded outro]
- [Source: create-scrum-workflow/src/commands/update.js -- current update command with bare outro]
- [Source: create-scrum-workflow/src/commands/validate.js -- current validate command with no outro]
- [Source: create-scrum-workflow/src/commands/status.js -- current status command with no outro]
- [Source: create-scrum-workflow/src/core/output.js -- Story 6.1 centralized output module]

### Git Intelligence

Recent commits show Stories 6.1-6.4 completed with centralized output, progress, prompt, and platform-detection modules. Key patterns:
- Module pattern: thin wrapper around a library with project-specific formatting
- ESM imports throughout (`import ... from '...'`)
- Test files use `*.test.js` pattern in `test/unit/` subdirectories
- ATDD test naming: `ac{N}-{description}.test.js`
- Template sync: every modified/created file must be copied to `create-scrum-workflow/templates/`
- Review findings from previous stories: watch for raw `console.log()` (use output module), unused imports, multi-line messages (UX-DR9 violation)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

- Created `src/core/next-steps.js` -- centralized next-step guidance module with `getNextStep(command, context)` function. Supports context-aware messages for update (hasFlaggedStories), validate (hasErrors), and status (hasIssues). Default fallback for unknown commands.
- Modified `install.js` -- replaced hardcoded `outro("Installation complete! Try: /scrum-create-ticket 'your feature description'")` with `outro(getNextStep('install'))`. Added inline comment documenting return value for ATDD traceability.
- Modified `update.js` -- replaced bare `outro('Update complete!')` with `outro(getNextStep('update', { hasFlaggedStories }))`. Also updated "up to date" outro to use getNextStep. Added `getNextStep` import from next-steps module.
- Modified `validate.js` -- added `outro(getNextStep('validate', { hasErrors }))` after validation summary. Added imports for `outro` from `@clack/prompts` and `getNextStep` from next-steps module.
- Modified `status.js` -- added `outro(getNextStep('status', { hasIssues }))` at end of status display, computing hasIssues from modified/missing file counts. Added imports for `outro` and `getNextStep`.
- Fixed progressive disclosure: removed `--dry-run` from dry-run outro in update.js and install.js (replaced with "dry-run flag" plain text). Removed `--yes` from installer.js warning (replaced with "auto-confirmed").
- Synced all modified files to `templates/` directory: next-steps.js, install.js, update.js, validate.js, status.js, installer.js.
- All 59 ATDD tests pass (3 test files). No regressions in existing test suite (379 pass, 7 pre-existing failures unrelated to this story).

### File List

- `create-scrum-workflow/src/core/next-steps.js` (NEW)
- `create-scrum-workflow/src/commands/install.js` (MODIFIED)
- `create-scrum-workflow/src/commands/update.js` (MODIFIED)
- `create-scrum-workflow/src/commands/validate.js` (MODIFIED)
- `create-scrum-workflow/src/commands/status.js` (MODIFIED)
- `create-scrum-workflow/src/core/installer.js` (MODIFIED -- progressive disclosure fix)
- `create-scrum-workflow/templates/src/core/next-steps.js` (NEW -- synced)
- `create-scrum-workflow/templates/src/commands/install.js` (SYNCED)
- `create-scrum-workflow/templates/src/commands/update.js` (SYNCED)
- `create-scrum-workflow/templates/src/commands/validate.js` (SYNCED)
- `create-scrum-workflow/templates/src/commands/status.js` (SYNCED)
- `create-scrum-workflow/templates/src/core/installer.js` (SYNCED)

### Review Findings

- [x] [Review][Patch] Status next-step messages missing completion prefix [next-steps.js:31-34] -- Fixed: added "Status checked!" / "Status OK!" prefixes for consistent pattern with install/update/validate
- [x] [Review][Patch] Inconsistent dry-run outro phrasing between install and update [install.js:51] -- Fixed: install dry-run outro now says "apply changes" matching update
- [x] [Review][Patch] install.js error path mentions -y flag (UX-DR3 violation) [install.js:63] -- Fixed: removed "-y" from error recovery message
- [x] [Review][Patch] validate.js "Lock file exists" message semantically inverted [validate.js:42] -- Fixed: changed to "Lock file not found"
- [x] [Review][Patch] status.js no outro when lock file missing (AC #2 gap) [status.js:14-16] -- Fixed: added outro with getNextStep when no installation found
- [x] [Review][Patch] update.js post-migration warning has markdown bold syntax [update.js:514] -- Fixed: removed **Next Step:** markdown, replaced with plain text "Next:"
