# Story 5.3: Interactive User Configuration Prompts

Status: dev-complete

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the installer to collect project name, platform selection, and user preferences through interactive prompts,
So that the installation is customized to my project without requiring manual config file editing.

## Acceptance Criteria

1. **Given** the CLI skeleton from Story 5.1 and platform registry from Story 5.2 exist
   **When** the user runs `node bin/create-scrum-workflow.js install`
   **Then** `src/core/config-builder.js` exists with prompt logic using `@clack/prompts`

2. **And** the user is prompted for: target directory (default: `.`), project name (default: directory name), platform selection (multi-select from registry, default: `claude-code`), and framework path name (default: `scrum_workflow`)

3. **And** all prompts have sensible defaults that can be accepted by pressing Enter

4. **And** when `--yes` flag is passed, all defaults are accepted without prompts (FR58)

5. **And** the config builder returns a normalized config object with all resolved values

6. **And** invalid directory paths produce a clear error message and re-prompt

7. **And** at least one platform must be selected -- empty selection shows a validation error

## Tasks / Subtasks

- [x] Task 1: Create `src/core/config-builder.js` with `buildConfig(options)` function (AC: #1, #2, #3, #5)
  - [x] Subtask 1.1: Remove the `.gitkeep` placeholder from `src/core/`
  - [x] Subtask 1.2: Create the file using ES Module syntax (`import`/`export`)
  - [x] Subtask 1.3: Import `{ text, multiselect, intro, outro, log, isCancel, cancel }` from `@clack/prompts`
  - [x] Subtask 1.4: Import `{ resolve, basename }` from `node:path` and `{ existsSync }` from `node:fs`
  - [x] Subtask 1.5: Import `{ loadPlatformRegistry, getPlatformCodes }` from `../platform/platform-registry.js`
  - [x] Subtask 1.6: Implement `export async function buildConfig(options)` that takes the commander options object (`{ directory, platforms, yes }`)
  - [x] Subtask 1.7: Call `intro('create-scrum-workflow')` at the start to display the @clack/prompts intro banner

- [x] Task 2: Implement target directory prompt (AC: #2, #3, #6)
  - [x] Subtask 2.1: Resolve `options.directory` to an absolute path using `resolve()`
  - [x] Subtask 2.2: If `--yes` flag is NOT set, prompt with `text()` for target directory -- `message: 'Target project directory'`, `defaultValue: resolvedDir`, `placeholder: resolvedDir`
  - [x] Subtask 2.3: Add `validate` function on the text prompt: check `existsSync(value)` -- return `'Directory does not exist'` if invalid, `undefined` if valid
  - [x] Subtask 2.4: After prompt, resolve the entered value to absolute path
  - [x] Subtask 2.5: Handle `isCancel()` on the return value -- if cancelled, call `cancel('Installation cancelled')` and `process.exit(0)`

- [x] Task 3: Implement project name prompt (AC: #2, #3)
  - [x] Subtask 3.1: Derive default project name from `basename(resolvedDirectory)`
  - [x] Subtask 3.2: If `--yes` flag is NOT set, prompt with `text()` for project name -- `message: 'Project name'`, `defaultValue: defaultName`, `placeholder: defaultName`
  - [x] Subtask 3.3: Add `validate` function: return `'Project name is required'` if empty/whitespace, `undefined` if valid
  - [x] Subtask 3.4: Handle `isCancel()` -- cancel and exit if user cancels

- [x] Task 4: Implement platform multi-select prompt (AC: #2, #3, #7)
  - [x] Subtask 4.1: Call `loadPlatformRegistry()` to get the platform Map
  - [x] Subtask 4.2: Build the `options` array for `multiselect()` from registry entries: `{ value: code, label: entry.display_name, hint: entry.target_dir }` for each platform
  - [x] Subtask 4.3: If `--yes` flag is NOT set, prompt with `multiselect()` -- `message: 'Select target platforms'`, `required: true` (enforces AC #7), `initialValues: ['claude-code']`
  - [x] Subtask 4.4: If `--yes` flag IS set, use `options.platforms` from CLI flags (default: `['claude-code']`)
  - [x] Subtask 4.5: Handle `isCancel()` -- cancel and exit if user cancels

- [x] Task 5: Implement framework path name prompt (AC: #2, #3)
  - [x] Subtask 5.1: If `--yes` flag is NOT set, prompt with `text()` for framework path -- `message: 'Framework directory name'`, `defaultValue: 'scrum_workflow'`, `placeholder: 'scrum_workflow'`
  - [x] Subtask 5.2: Add `validate` function: return `'Framework path is required'` if empty/whitespace, check no path separators (`/` or `\`) in value -- return `'Must be a directory name, not a path'` if separators found, `undefined` if valid
  - [x] Subtask 5.3: Handle `isCancel()` -- cancel and exit if user cancels

- [x] Task 6: Build and return normalized config object (AC: #5)
  - [x] Subtask 6.1: Assemble the config object with resolved values: `{ directory: <absolutePath>, projectName: <string>, platforms: <string[]>, frameworkPath: <string> }`
  - [x] Subtask 6.2: Log a summary using `log.info()` showing the resolved config values
  - [x] Subtask 6.3: Return the config object

- [x] Task 7: Implement `--yes` non-interactive bypass (AC: #4)
  - [x] Subtask 7.1: At the top of `buildConfig()`, check `options.yes === true`
  - [x] Subtask 7.2: If `--yes`, skip all prompts -- use resolved defaults directly: `directory: resolve(options.directory)`, `projectName: basename(resolve(options.directory))`, `platforms: options.platforms` (from CLI, defaults to `['claude-code']`), `frameworkPath: 'scrum_workflow'`
  - [x] Subtask 7.3: Still log the resolved config via `log.info()` so the user sees what was selected
  - [x] Subtask 7.4: Return the config object without any interactive prompts

- [x] Task 8: Wire `buildConfig` into install command (AC: #1)
  - [x] Subtask 8.1: Update `src/commands/install.js` to import `{ buildConfig }` from `../core/config-builder.js`
  - [x] Subtask 8.2: Replace the placeholder implementation with: `const config = await buildConfig(options)`
  - [x] Subtask 8.3: After buildConfig, log `log.success('Configuration complete')` and log the config object for debugging (temporary until Story 5.4 adds the installer pipeline)
  - [x] Subtask 8.4: Call `outro('Ready to install (pipeline not yet implemented)')` as a temporary closing message

- [x] Task 9: Validation and smoke testing (AC: #1-#7)
  - [x] Subtask 9.1: Run `node bin/create-scrum-workflow.js install` and verify all 4 prompts appear in order with correct defaults
  - [x] Subtask 9.2: Accept all defaults and verify the config object is logged with correct values
  - [x] Subtask 9.3: Run `node bin/create-scrum-workflow.js install -y` and verify no prompts appear, defaults are used
  - [x] Subtask 9.4: Run `node bin/create-scrum-workflow.js install -d /nonexistent` and verify the directory validation error appears
  - [x] Subtask 9.5: Verify Ctrl+C cancellation produces clean exit (not a stack trace)
  - [x] Subtask 9.6: Verify the returned config object contains all 4 fields: `directory`, `projectName`, `platforms`, `frameworkPath`
  - [x] Subtask 9.7: Verify platform multi-select shows all 6 platforms from the registry with display names

## Dev Notes

### Important: Separate Project Context

This story creates files inside `create-scrum-workflow/` (at the repository root), which is a **standalone project** completely independent from the `scrum_workflow/` framework directory. It has its own `package.json`, its own `node_modules/`, and zero shared code.

### Relevant Architecture Patterns and Constraints

**From Research: Config Builder Role in Pipeline**

The config-builder sits at Step 3 of the 10-step installation pipeline. It receives raw CLI options from commander and produces a clean, normalized config object that downstream steps (path-resolver, installer, lock-file) consume. It is the only component that interacts with the user via prompts.

```
Step 1: Validate Prerequisites
Step 2: Detect Existing Installation
Step 3: Collect User Configuration  <-- THIS STORY (config-builder.js)
Step 4: Resolve Paths               <-- Story 5.4 (path-resolver.js)
...
```

**From Research: @clack/prompts Component API**

The installed `@clack/prompts` v0.9.x provides these components used by this story:

- `intro(title)` -- Display an intro banner
- `text({ message, defaultValue, placeholder, validate })` -- Text input with validation
- `multiselect({ message, options, initialValues, required })` -- Multi-select with checkboxes
- `log.info(message)` / `log.success(message)` -- Styled log messages
- `outro(message)` -- Display an outro banner
- `isCancel(value)` -- Check if user pressed Ctrl+C
- `cancel(message)` -- Display cancellation message

Every prompt returns a `Promise<string | symbol>`. The symbol case means the user cancelled (Ctrl+C). Always check `isCancel()` on every prompt result.

**Code Style Conventions (established by Stories 5.1 and 5.2):**

- JavaScript ES Modules throughout (`import`/`export`, no `require`/`module.exports`)
- `picocolors` for terminal colors (but `@clack/prompts` handles its own styling -- use `log.*` methods inside the prompt flow, `picocolors` only if needed outside clack)
- Async functions for command handlers (not classes)
- `node:` prefix for Node.js builtins (e.g., `node:fs`, `node:path`)
- File extensions required in imports (e.g., `../platform/platform-registry.js`)
- Simple exported functions preferred over classes

**Dependency: `@clack/prompts` is already installed** (listed in `package.json` dependencies from Story 5.1). No new dependencies needed.

### Critical Anti-Patterns to Avoid

1. **DO NOT use `inquirer` or `prompts`** -- the project uses `@clack/prompts` exclusively. It is already installed.
2. **DO NOT use `require()`** -- the project is `"type": "module"`, use ESM `import` everywhere.
3. **DO NOT use `__dirname`** -- it does not exist in ESM. Use `import.meta.url` if you need module-relative paths (not needed in config-builder since it does not load co-located files).
4. **DO NOT create a class** for the config builder. Keep it as a simple exported async function. Classes add unnecessary abstraction. Follow the pattern from `platform-registry.js`.
5. **DO NOT prompt for directory when `--yes` is passed** -- all prompts must be skipped entirely in non-interactive mode.
6. **DO NOT validate directory in `--yes` mode** -- the directory validation (existsSync) runs only during interactive prompts via the `validate` callback. In `--yes` mode, trust the CLI input (validation can happen in Story 5.4's installer pipeline).
7. **DO NOT import `fs-extra`** -- use native `node:fs` for `existsSync`. `fs-extra` is for recursive directory copy in later stories.
8. **DO NOT hardcode platform names** -- always load them from `loadPlatformRegistry()` to maintain zero-code extensibility.
9. **DO NOT forget to check `isCancel()` after EVERY prompt** -- if the user presses Ctrl+C, the return value is a symbol, not a string. Unchecked cancellation causes cryptic type errors downstream.

### Existing Code to Reuse

**From `src/platform/platform-registry.js` (Story 5.2):**

```javascript
import { loadPlatformRegistry, getPlatformCodes } from '../platform/platform-registry.js'
```

- `loadPlatformRegistry()` returns `Map<string, { code, display_name, category, target_dir, ... }>`
- `getPlatformCodes(registry)` returns `string[]` of all platform codes

Use these to dynamically build the multiselect options. Do NOT hardcode the platform list.

**From `src/commands/install.js` (Story 5.1):**

The current install handler is a placeholder that logs "not yet implemented". Replace the body but keep the same function signature: `export async function install(options)`.

The `options` parameter comes from commander and contains: `{ directory: string, platforms: string[], yes: boolean }`.

### Config Object Shape

The `buildConfig` function must return an object matching this shape:

```javascript
{
  directory: '/absolute/path/to/project',  // Always absolute
  projectName: 'my-project',               // String, non-empty
  platforms: ['claude-code'],               // Array of platform code strings, min 1
  frameworkPath: 'scrum_workflow'           // Directory name (no slashes)
}
```

This config object will be consumed by:
- **Story 5.4:** `path-resolver.js` uses `directory`, `platforms`, `frameworkPath` to compute all target paths
- **Story 5.5:** Skill registration uses `platforms` to determine which platform skill directories to populate
- **Story 5.6:** Lock file uses all fields for the installation manifest

### File Location Summary

**Files to create (all paths relative to `create-scrum-workflow/`):**

| File | Purpose |
|------|---------|
| `src/core/config-builder.js` | Interactive prompts + config object builder |

**Files to modify:**

| File | Change |
|------|--------|
| `src/commands/install.js` | Replace placeholder with `buildConfig()` call |

**Files to remove:**

| File | Reason |
|------|--------|
| `src/core/.gitkeep` | Replaced by actual content |

### How This Story Connects to Downstream Stories

- **Story 5.4 (Framework Copy):** Consumes `config.directory`, `config.frameworkPath` to determine where to copy framework files. Will import `buildConfig` from this module as part of the install pipeline.
- **Story 5.5 (Skill Registration):** Consumes `config.platforms` to iterate selected platforms and copy skill shims to the correct directories.
- **Story 5.6 (Lock File):** Consumes the entire config object to record installation metadata.

### Testing Standards Summary

**Manual Verification Commands (run from `create-scrum-workflow/` directory):**

```bash
# Interactive mode -- verify all 4 prompts appear
node bin/create-scrum-workflow.js install

# Non-interactive mode -- verify zero prompts, defaults used
node bin/create-scrum-workflow.js install -y

# Non-interactive with custom directory
node bin/create-scrum-workflow.js install -y -d /tmp

# Verify invalid directory shows validation error (interactive)
node bin/create-scrum-workflow.js install
# Then enter "/nonexistent/path" at the directory prompt

# Verify platforms from CLI flag in non-interactive mode
node bin/create-scrum-workflow.js install -y -p claude-code cursor windsurf

# Verify Ctrl+C produces clean exit
node bin/create-scrum-workflow.js install
# Then press Ctrl+C at any prompt
```

**Acceptance Verification Checklist:**

- `src/core/config-builder.js` exists and exports `buildConfig`
- Running `install` shows 4 prompts: directory, project name, platforms, framework path
- All prompts have correct defaults (`.` -> resolved, basename, `claude-code`, `scrum_workflow`)
- Pressing Enter through all prompts uses defaults
- `--yes` flag skips all prompts entirely
- Invalid directory path shows error and re-prompts (does not crash)
- Platform multi-select shows all 6 platforms from registry
- Platform multi-select requires at least 1 selection (`required: true`)
- Ctrl+C at any prompt produces clean "Installation cancelled" message
- Config object has all 4 fields with correct types
- `install.js` calls `buildConfig(options)` instead of the old placeholder
- All imports use ESM syntax and `.js` extensions
- No `require()`, no `__dirname`, no class definitions
- `src/core/.gitkeep` is removed

### Previous Story Intelligence

**From Story 5.1 (Scaffolding):**
- `src/core/` directory exists with a `.gitkeep` placeholder
- `@clack/prompts` v0.9.x is installed in `node_modules/`
- Command handlers are simple async functions receiving commander options
- `install.js` handler receives `options` with `{ directory, platforms, yes }` properties
- `picocolors` imported as default: `import pc from 'picocolors'`

**From Story 5.2 (Platform Registry):**
- `loadPlatformRegistry()` returns a `Map<string, object>` keyed by platform code
- Each Map value has: `code`, `display_name`, `category`, `target_dir`, `skill_format`, plus optional fields
- `getPlatformCodes(registry)` returns `string[]` of all codes -- useful for validation
- Uses `import.meta.url` + `fileURLToPath` + `dirname`/`join` for ESM path resolution
- `readFileSync` from `node:fs` (not `fs-extra`) for reading bundled files
- Zero-code extensibility verified: adding a YAML entry makes it appear in the Map

### Project Structure Notes

- New file goes in `create-scrum-workflow/src/core/config-builder.js`
- The `.gitkeep` in `src/core/` should be removed since a real file is being added
- Modified file: `create-scrum-workflow/src/commands/install.js` (replace placeholder body)
- No new directories created -- `src/core/` already exists from Story 5.1
- Naming convention: kebab-case file names matching the research document

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.3] -- Acceptance criteria, story definition
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-5] -- Epic context, dependency map (5.3 depends on 5.1; depended on by 5.4)
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Architectural-Patterns-and-Design] -- System architecture, config-builder.js placement, installation pipeline steps
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Technology-Stack-Analysis] -- @clack/prompts as interactive UI component
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Implementation-Approaches] -- Phase 1 step 1.3 covers @clack/prompts for user interaction
- [Source: _bmad-output/implementation-artifacts/5-1-project-scaffolding-and-cli-entry-point.md] -- CLI skeleton, commander options, install handler signature
- [Source: _bmad-output/implementation-artifacts/5-2-config-driven-platform-registry.md] -- Platform registry API, code conventions, ESM patterns
- [Source: create-scrum-workflow/node_modules/@clack/prompts/dist/index.d.ts] -- Actual @clack/prompts API: text, multiselect, isCancel, intro, outro, log, cancel

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

N/A

### Completion Notes List

- Created `src/core/config-builder.js` with full interactive prompt flow using `@clack/prompts`
- Implements 4 prompts: target directory, project name, platform multi-select, framework path name
- All prompts have sensible defaults (`.` resolved to cwd, basename for project name, `claude-code` for platform, `scrum_workflow` for framework path)
- `--yes` flag bypasses all prompts and uses defaults directly
- Directory validation via `existsSync()` with re-prompt on invalid path
- Platform options loaded dynamically from registry (all 6 platforms)
- `isCancel()` checked after every prompt for clean Ctrl+C handling
- Framework path validates no path separators allowed
- Returns normalized config object: `{ directory, projectName, platforms, frameworkPath }`
- Wired `buildConfig` into `install.js`, replacing the placeholder implementation
- Removed `.gitkeep` from `src/core/`
- All imports use ESM syntax with `.js` extensions and `node:` prefix for builtins
- Note: imported `loadPlatformRegistry` only (not `getPlatformCodes`) since the multiselect options are built directly from registry iteration -- `getPlatformCodes` was not needed

### File List

- `create-scrum-workflow/src/core/config-builder.js` (created)
- `create-scrum-workflow/src/commands/install.js` (modified)
- `create-scrum-workflow/src/core/.gitkeep` (deleted)
