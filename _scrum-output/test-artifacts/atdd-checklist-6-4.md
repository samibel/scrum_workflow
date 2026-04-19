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
  - _scrum-output/implementation-artifacts/6-4-implement-zero-config-installation-flow.md
  - create-scrum-workflow/package.json
  - create-scrum-workflow/vitest.config.js
  - create-scrum-workflow/src/core/config-builder.js
  - create-scrum-workflow/bin/create-scrum-workflow.js
  - create-scrum-workflow/src/platform/platform-registry.yaml
---

# ATDD Checklist: Story 6.4 - Implement Zero-Config Installation Flow

## TDD Red Phase (Current)

**Status:** RED -- Tests fail because `src/platform/platform-detector.js` does not exist yet, `bin/create-scrum-workflow.js` has no default action, and `config-builder.js` does not integrate auto-detection. This is intentional (TDD red phase).

- **Total Tests:** 47
- **Test Files:** 3
- **Failing Tests:** 29 (tests that verify new behavior)
- **Passing Tests:** 18 (tests that verify existing unchanged behavior)
- **Test Level:** Unit
- **Test Framework:** Vitest ^3.0.0
- **Stack:** Backend (Node.js CLI)

## Acceptance Criteria Coverage

### AC1: Zero-Config Installation (UX-DR1)

- **File:** `create-scrum-workflow/test/unit/default-command/ac1-zero-config-install.test.js`
- **Tests:** 14 (8 failing, 6 passing)
- **Coverage:**
  - CLI entry point defines default action (`program.action()`)
  - Default action delegates to install command
  - Default action passes `yes: true` for zero-config
  - Default action sets directory to CWD
  - Default action provides default platforms array
  - Install subcommand preserved alongside default action
  - Install subcommand interactive behavior preserved
  - buildConfig with `yes:true` does not call any prompt functions
  - buildConfig with `yes:true` returns config without prompting
  - buildConfig with `yes:true` resolves directory to absolute CWD path
  - buildConfig with `yes:true` does not show directory prompt

### AC2: Platform Auto-Detection (UX-DR4)

- **File:** `create-scrum-workflow/test/unit/platform-detector/ac2-auto-detect-platform.test.js`
- **Tests:** 19 (19 failing -- module does not exist)
- **Coverage:**
  - Detects Claude Code via `.claude/` marker directory
  - Detects Cursor via `.cursor/` marker directory
  - Detects Windsurf via `.windsurf/` marker directory
  - Detects GitHub Copilot via `.github/` marker directory
  - Detects Cline via `.cline/` marker directory
  - Detects Agents Universal via `.agents/` marker directory
  - Defaults to `claude-code` when no markers found
  - Detects multiple platforms when multiple markers exist
  - Handles all six platforms simultaneously
  - Ignores non-marker directories (src, node_modules, .git)
  - Handles marker directories with files inside
  - Marker-to-code mapping verified in source
  - Uses `existsSync` for detection
  - Module exports `detectPlatforms` function
  - Imports from `node:fs` and `node:path`
  - No `console.log` in detection logic
  - NFR-14: Falls back to `claude-code` on non-existent directory
  - NFR-2: Uses only local filesystem (no network calls)

### AC3: Config-Builder Integration + CWD Default (UX-DR4, UX-DR5)

- **File:** `create-scrum-workflow/test/unit/config-builder/ac3-config-builder-integration.test.js`
- **Tests:** 14 (6 failing, 8 passing)
- **Coverage:**
  - config-builder imports `detectPlatforms` from platform-detector
  - config-builder calls `detectPlatforms` in `--yes` path
  - `--yes` path uses auto-detected platforms instead of hardcoded default
  - Passes resolved directory to `detectPlatforms`
  - Displays detection result via `output.info()` (UX-DR13)
  - Detection info message is single line (UX-DR9)
  - Uses `output.info()` not `console.log` for detection
  - Interactive path preserved (no `detectPlatforms` call)
  - Interactive path still uses `inputText` for directory
  - Interactive path still uses `multiSelectOptions` for platforms
  - Imports from platform-detector module
  - No new npm dependencies
  - Returns config with auto-detected platforms
  - Detection info appears before config summary

## Test Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| P0       | 33    | 70%        |
| P1       | 14    | 30%        |
| P2       | 0     | 0%         |
| P3       | 0     | 0%         |

## Architecture Compliance

- UX-DR1: Zero-config default -- bare `npx create-scrum-workflow` = complete installation
- UX-DR3: Progressive disclosure -- advanced options not shown in zero-config flow
- UX-DR4: Auto-detection of AI platform -- detection module checks marker directories
- UX-DR5: Default directory = CWD -- resolved to absolute path in zero-config flow
- UX-DR9: Single line per message -- detection info is single line
- UX-DR13: Consistent color coding -- uses `output.info()` for detection result
- NFR-2: No external service dependency -- detection uses local filesystem only
- NFR-8: Installability -- bare command completes in under 30 seconds
- NFR-11: Zero-config extensibility -- new module is a file drop-in
- NFR-14: Error recovery -- auto-detection failure falls back to claude-code default

## Test Execution Results

```
Test Files  3 failed (3)
     Tests  29 failed | 18 passed (47 total)
  Duration  ~800ms
```

**RED phase confirmed:** Tests fail because:
1. `src/platform/platform-detector.js` does not exist (19 failures)
2. `bin/create-scrum-workflow.js` has no default action (4 failures)
3. `src/core/config-builder.js` does not integrate auto-detection (6 failures)

## Test-to-Task Traceability

| Test File | Story Tasks Covered |
|-----------|-------------------|
| ac1-zero-config-install.test.js | Task 2.1 (default command), Task 2.2 (zero prompts), Task 2.3 (explicit subcommand preserved), Task 4.1 (verify no prompts), Task 4.3 (CWD default) |
| ac2-auto-detect-platform.test.js | Task 1.1 (detectPlatforms function), Task 1.2 (marker detection), Task 1.3 (default fallback), Task 1.5 (ATDD tests) |
| ac3-config-builder-integration.test.js | Task 3.1 (integrate auto-detection), Task 3.2 (replace hardcoded default), Task 3.3 (display detection result), Task 3.4 (preserve interactive path), Task 3.5 (ATDD tests) |

## Next Step

Implement the following to turn tests GREEN (TDD green phase):
1. Create `src/platform/platform-detector.js` with `detectPlatforms(directory)`
2. Modify `bin/create-scrum-workflow.js` to add default `program.action()`
3. Modify `src/core/config-builder.js` to integrate `detectPlatforms` in `--yes` path
4. Sync all new/modified files to `create-scrum-workflow/templates/`
