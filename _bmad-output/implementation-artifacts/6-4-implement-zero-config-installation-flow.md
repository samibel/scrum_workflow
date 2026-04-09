# Story 6.4: Implement Zero-Config Installation Flow

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `npx create-scrum-workflow` without any flags to complete a full installation,
So that I don't need to make any decisions during setup.

## Acceptance Criteria

1. **Given** UX-DR1 specifies zero-config default: no flags = complete installation **When** a developer runs `npx create-scrum-workflow` without any flags **Then** the installation completes without any prompts or decisions required

2. **Given** UX-DR4 specifies auto-detection of AI platform **When** the CLI runs in a project directory **Then** the AI platform is automatically detected (Claude Code, Cursor, Windsurf, etc.) **And** the detection result is displayed as info: `ℹ Auto-detected platform: claude-code`

3. **Given** UX-DR5 specifies current working directory as default **When** no target directory is specified **Then** the framework is installed in the current working directory **And** no directory prompt is shown

## Tasks / Subtasks

- [x] Task 1: Create platform auto-detection module (AC: #2)
  - [x] 1.1 Create `src/platform/platform-detector.js` with `detectPlatforms(directory)` function
  - [x] 1.2 Implement detection by checking for marker directories from the platform registry: `.claude/` -> claude-code, `.cursor/` -> cursor, `.windsurf/` -> windsurf, `.github/` -> github-copilot, `.cline/` -> cline, `.agents/` -> agents-universal
  - [x] 1.3 If exactly one platform detected, return that platform code. If multiple detected, return all. If none detected, default to `claude-code` (the preferred platform per registry)
  - [x] 1.4 Display detection result via `output.info()` -- e.g., `ℹ Auto-detected platform: claude-code` or `ℹ Auto-detected platforms: claude-code, cursor`
  - [x] 1.5 Write ATDD tests for detection logic

- [x] Task 2: Add default command to CLI entry point (AC: #1, #3)
  - [x] 2.1 Modify `bin/create-scrum-workflow.js` to make `install` the default command when no subcommand is provided
  - [x] 2.2 When running bare `npx create-scrum-workflow` (no subcommand, no flags), the install command executes with `--yes` behavior: zero prompts, all defaults
  - [x] 2.3 When running `npx create-scrum-workflow install` (explicit subcommand), current behavior preserved (interactive prompts unless `--yes`)
  - [x] 2.4 Write ATDD tests for default command routing

- [x] Task 3: Integrate platform auto-detection into config-builder (AC: #2, #3)
  - [x] 3.1 In `config-builder.js`, when `options.yes === true`: call `detectPlatforms(directory)` to auto-detect instead of using hardcoded `['claude-code']` default
  - [x] 3.2 Replace the hardcoded `options.platforms` default value in `bin/create-scrum-workflow.js` -- the `--platforms` option default should remain `['claude-code']` but the `--yes` flow uses auto-detection
  - [x] 3.3 Display auto-detection result before the configuration summary in the `--yes` path
  - [x] 3.4 Ensure the interactive path (no `--yes`) continues to use the platform selection prompt from `prompts.js`
  - [x] 3.5 Write ATDD tests for config-builder integration with auto-detection

- [x] Task 4: Verify zero-config end-to-end flow (AC: #1, #2, #3)
  - [x] 4.1 Verify `npx create-scrum-workflow` (no args) completes without any prompts
  - [x] 4.2 Verify auto-detection message is displayed during zero-config run
  - [x] 4.3 Verify CWD is used as default directory without any directory prompt
  - [x] 4.4 Verify `npx create-scrum-workflow install` (explicit subcommand) still shows interactive prompts
  - [x] 4.5 Verify `npx create-scrum-workflow install --yes` behaves same as bare command

- [x] Task 5: Sync to create-scrum-workflow copies (AC: #1, #2, #3)
  - [x] 5.1 Ensure `src/platform/platform-detector.js` is present in both `create-scrum-workflow/src/platform/` and `create-scrum-workflow/templates/src/platform/`
  - [x] 5.2 Ensure all modified files are synced to `create-scrum-workflow/templates/` copies

## Dev Notes

### Critical Context: What Story 6.4 Implements

This story implements UX-DR1 (zero-config default), UX-DR4 (auto-detection of AI platform), and UX-DR5 (current working directory as default). The goal is to make `npx create-scrum-workflow` without any flags "just work" -- zero decisions, zero prompts, instant installation.

**Current state of the codebase (post-Story 6.3):**

The CLI currently has these user-facing invocation patterns:
- `npx create-scrum-workflow install` -- interactive prompts for directory, project name, platforms, framework path
- `npx create-scrum-workflow install --yes` -- non-interactive, uses defaults (directory=CWD, platforms=['claude-code'], frameworkPath='scrum_workflow')
- `npx create-scrum-workflow install --dry-run` -- preview without changes
- `npx create-scrum-workflow install -d <path>` -- custom directory
- `npx create-scrum-workflow install -p <platforms...>` -- custom platforms
- Other subcommands: `update`, `status`, `validate`

**The problem:** Running bare `npx create-scrum-workflow` (no subcommand) currently shows Commander.js help text. The PRD and UX spec say this should be the primary, zero-config installation path. The developer should not need to know the `install` subcommand or `--yes` flag exists.

**Additionally:** The `--yes` flow always uses hardcoded `['claude-code']` as the default platform, even if the project already uses Cursor or Windsurf. Auto-detection would make the zero-config path smarter.

### The Solution: Default Command + Platform Auto-Detection

**Part A: Default Command**
Make `install --yes` the implicit default when no subcommand is provided. When the user types `npx create-scrum-workflow`, it should be equivalent to `npx create-scrum-workflow install --yes`.

Commander.js approach: Add a default action on the program that delegates to `install({ directory: '.', platforms: ['claude-code'], yes: true })`. The explicit `install` subcommand continues to work as-is (interactive by default).

**Part B: Platform Auto-Detection**
Create `src/platform/platform-detector.js` that checks for marker directories in the project root:

| Marker Directory | Platform Code |
|-----------------|---------------|
| `.claude/` | `claude-code` |
| `.cursor/` | `cursor` |
| `.windsurf/` | `windsurf` |
| `.github/` | `github-copilot` |
| `.cline/` | `cline` |
| `.agents/` | `agents-universal` |

Detection logic:
1. Check each marker directory for existence using `existsSync()`
2. If exactly one found: return that platform (most common case)
3. If multiple found: return all detected platforms
4. If none found: default to `claude-code` (preferred platform per registry)

```javascript
// API design:
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const PLATFORM_MARKERS = {
  '.claude': 'claude-code',
  '.cursor': 'cursor',
  '.windsurf': 'windsurf',
  '.github': 'github-copilot',
  '.cline': 'cline',
  '.agents': 'agents-universal'
}

export function detectPlatforms(directory) {
  const detected = []
  for (const [marker, code] of Object.entries(PLATFORM_MARKERS)) {
    if (existsSync(join(directory, marker))) {
      detected.push(code)
    }
  }
  if (detected.length === 0) {
    return ['claude-code']
  }
  return detected
}
```

### Architecture Compliance

- **UX-DR1**: Zero-config default -- bare `npx create-scrum-workflow` = complete installation
- **UX-DR4**: Auto-detection of AI platform -- detection module checks marker directories
- **UX-DR5**: Default directory = CWD -- already works in `--yes` mode, now exposed as default
- **UX-DR3**: Progressive disclosure -- advanced options (`--platform`, `--depth`) only for power users, not shown in zero-config flow
- **UX-DR9**: Single line per message -- auto-detection info displayed as single line
- **UX-DR13**: Consistent color coding -- uses `output.info()` for detection result
- **NFR-2**: No external service dependency -- detection uses local filesystem only
- **NFR-8**: Installability -- `npx create-scrum-workflow` completes in under 30 seconds
- **NFR-11**: Zero-config extensibility -- new module is a file drop-in
- **NFR-14**: Error recovery -- auto-detection failure falls back to claude-code default

### Previous Story Intelligence

**Story 6.3 (Interactive Prompt Patterns):**
- Created `src/core/prompts.js` with `confirmAction()`, `inputText()`, `selectOption()`, `multiSelectOptions()`
- Cancel handling pattern: `cancel('Operation cancelled')` + `process.exit(0)`
- ATDD test naming: `ac{N}-{description}.test.js` in `test/unit/{feature}/`
- Template sync: copy to both `create-scrum-workflow/src/` and `create-scrum-workflow/templates/`
- 53 ATDD tests for Story 6.3

**Story 6.2 (Progress Indicators):**
- Created `src/core/progress.js` with `start()`, `succeed()`, `fail()` wrapper functions
- Module pattern: thin wrapper that delegates to `@clack/prompts`
- Template sync pattern same as above

**Story 6.1 (CLI Output Color & Emoji System):**
- Created `src/core/output.js` with `success()`, `warning()`, `error()`, `info()`, `step()`, `header()`
- 48 ATDD tests for Story 6.1
- Review patches: watch for multi-line output (violates UX-DR9) and unused imports

**Story 5.2 (CLI Update & Migration):**
- The `create-scrum-workflow/` directory is the canonical source for CLI installer
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
    platform/
      platform-detector.js         <-- CREATE: auto-detection module
      platform-registry.js         <-- EXISTS: load platform registry (DO NOT MODIFY)
      platform-registry.yaml       <-- EXISTS: platform definitions (DO NOT MODIFY)
    core/
      prompts.js                   <-- EXISTS: from Story 6.3 (DO NOT MODIFY)
      progress.js                  <-- EXISTS: from Story 6.2 (DO NOT MODIFY)
      output.js                    <-- EXISTS: from Story 6.1 (DO NOT MODIFY)
      config-builder.js            <-- MODIFY: integrate auto-detection in --yes path
      installer.js                 <-- NO CHANGES (installer pipeline unchanged)
    commands/
      install.js                   <-- NO CHANGES (install command unchanged)
      update.js                    <-- NO CHANGES
      validate.js                  <-- NO CHANGES
      status.js                    <-- NO CHANGES
  bin/
    create-scrum-workflow.js       <-- MODIFY: add default command action
  templates/
    src/
      platform/
        platform-detector.js       <-- SYNC: copy of detection module
      core/                        <-- SYNC: copies of modified core files
  test/
    unit/
      platform-detector/
        ac2-auto-detect-platform.test.js  <-- CREATE
      default-command/
        ac1-zero-config-install.test.js   <-- CREATE
      config-builder/
        ac3-config-builder-integration.test.js <-- CREATE
```

**DO NOT modify:**
- `src/core/output.js` (Story 6.1 module -- stable)
- `src/core/progress.js` (Story 6.2 module -- stable)
- `src/core/prompts.js` (Story 6.3 module -- stable)
- `src/core/installer.js` (installer pipeline -- not affected by this story)
- `src/commands/install.js` (install command logic -- not affected, only routing changes)
- `src/platform/platform-registry.js` (platform registry loader -- stable)
- `src/platform/platform-registry.yaml` (platform definitions -- stable)
- `src/integrity/` modules (hash/lock file -- out of scope)
- `src/estimation/` modules (Wideband Delphi -- out of scope)
- `scrum_workflow/` framework directory (Markdown specs -- not CLI code)

### Dependencies

- No new npm dependencies required -- all functionality uses built-in `node:fs` `existsSync()`
- Commander.js default action is a built-in feature
- Depends on Story 6.1 `output.js` module (already complete)
- This story is the FOURTH in Epic 6 -- depends on Stories 6.1, 6.2, and 6.3 (all complete)

### Anti-Patterns to Avoid

1. **DO NOT add new npm dependencies** -- `existsSync()` and Commander.js default action are sufficient
2. **DO NOT modify installer.js** -- the installer pipeline (copyFramework, registerSkills, etc.) is not affected by zero-config; the change is in how we get TO the installer, not what the installer does
3. **DO NOT modify prompts.js, progress.js, or output.js** -- they are stable from Stories 6.1-6.3
4. **DO NOT change the interactive install behavior** -- `npx create-scrum-workflow install` must continue to show interactive prompts. Only the bare `npx create-scrum-workflow` (no subcommand) triggers zero-config
5. **DO NOT make platform detection network-dependent** -- detection is purely local filesystem checks (NFR-2)
6. **DO NOT hardcode platform markers in config-builder.js** -- platform-detector.js owns detection logic, config-builder.js calls it
7. **DO NOT change the --platforms CLI option default** -- the Commander option default of `['claude-code']` is a safety net; auto-detection overrides it in the zero-config path
8. **DO NOT add console.log for detection result** -- use `output.info()` for consistency with Story 6.1 patterns

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.4]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Core User Experience]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Effortless Interactions]
- [Source: create-scrum-workflow/bin/create-scrum-workflow.js -- current CLI entry point]
- [Source: create-scrum-workflow/src/core/config-builder.js -- current --yes flow]
- [Source: create-scrum-workflow/src/platform/platform-registry.yaml -- platform definitions with marker dirs]
- [Source: create-scrum-workflow/src/core/output.js -- Story 6.1 centralized output module]

### Git Intelligence

Recent commits show Stories 6.1-6.3 completed with centralized output, progress, and prompt modules. Key patterns:
- Module pattern: thin wrapper around a library with project-specific formatting
- ESM imports throughout (`import ... from '...'`)
- Test files use `*.test.js` pattern in `test/unit/` subdirectories
- ATDD test naming: `ac{N}-{description}.test.js`
- Template sync: every modified/created file must be copied to `create-scrum-workflow/templates/`
- Review findings from previous stories: watch for raw `console.log()` (use output module), unused imports, multi-line messages (UX-DR9 violation)

### Commander.js Default Action Pattern

Commander.js supports making a command the default action when no subcommand matches. The recommended approach for our use case:

```javascript
// In bin/create-scrum-workflow.js
program
  .action(() => {
    // No subcommand provided -- run install with zero-config defaults
    return install({ directory: '.', platforms: ['claude-code'], yes: true })
  })
```

This fires when the user types just `npx create-scrum-workflow` with no subcommand. The explicit `install` subcommand continues to work with its own options and interactive behavior.

Important: The `program.action()` must come BEFORE the subcommand definitions in the file, or be set after parsing. Testing with Commander.js may require constructing the program programmatically.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No issues encountered. All tests passed on first implementation run.

### Completion Notes List

- Created `src/platform/platform-detector.js` with `detectPlatforms(directory)` function that checks 6 marker directories (`.claude`, `.cursor`, `.windsurf`, `.github`, `.cline`, `.agents`) and falls back to `claude-code` when none found. Pure function -- no console.log, no external dependencies, uses only `node:fs` and `node:path`.
- Modified `bin/create-scrum-workflow.js` to add `program.action()` default handler that delegates to `install({ directory: '.', platforms: ['claude-code'], yes: true })`. Explicit `install` subcommand unchanged (interactive by default).
- Modified `src/core/config-builder.js` to import `detectPlatforms` and use it in the `--yes` path. Auto-detection replaces the hardcoded `options.platforms` default. Interactive path untouched. Auto-detection result displayed via `output.info()` before config summary.
- Synced `platform-detector.js` to `templates/src/platform/` and `config-builder.js` to `templates/src/core/`.
- 47 ATDD tests all pass: 19 for platform-detector (AC2), 14 for default-command (AC1/AC3), 14 for config-builder integration (AC2/AC3).
- No regressions introduced in existing test suite (7 pre-existing failures from other stories remain unchanged).

### File List

- `create-scrum-workflow/src/platform/platform-detector.js` -- CREATED: platform auto-detection module
- `create-scrum-workflow/bin/create-scrum-workflow.js` -- MODIFIED: added default command action
- `create-scrum-workflow/src/core/config-builder.js` -- MODIFIED: integrated auto-detection in --yes path
- `create-scrum-workflow/templates/src/platform/platform-detector.js` -- CREATED: synced copy
- `create-scrum-workflow/templates/src/core/config-builder.js` -- MODIFIED: synced copy
- `create-scrum-workflow/test/unit/platform-detector/ac2-auto-detect-platform.test.js` -- EXISTS: 19 ATDD tests (pre-created)
- `create-scrum-workflow/test/unit/default-command/ac1-zero-config-install.test.js` -- EXISTS: 14 ATDD tests (pre-created)
- `create-scrum-workflow/test/unit/config-builder/ac3-config-builder-integration.test.js` -- EXISTS: 14 ATDD tests (pre-created)

## Change Log

- 2026-04-08: Story 6.4 created -- zero-config installation flow with platform auto-detection
- 2026-04-08: Story 6.4 implementation complete -- all 5 tasks done, 47 tests passing, templates synced
- 2026-04-08: Code review -- 1 patch fixed (clarifying comment on default action platforms fallback), 1 deferred (.github marker broadness), 3 dismissed

## Review Findings

- [x] [Review][Patch] Clarify that `platforms` parameter in default action is a fallback overridden by auto-detection [`bin/create-scrum-workflow.js:14`] -- fixed: added clarifying comment
- [x] [Review][Defer] `.github` marker directory is too broad for `github-copilot` detection (false positives in repos with GitHub Actions) [`src/platform/platform-detector.js:28`] -- deferred, pre-existing design from spec
