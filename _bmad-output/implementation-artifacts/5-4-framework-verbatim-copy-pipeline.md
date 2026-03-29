# Story 5.4: Framework Verbatim Copy Pipeline

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the installer to copy the entire scrum_workflow framework directory verbatim to my project,
So that I get a complete, self-contained framework installation without any file transformation.

## Acceptance Criteria

1. **Given** the user has completed configuration prompts from Story 5.3
   **When** the install command executes the framework copy step
   **Then** `src/core/installer.js` exists with the main `Installer` class orchestrating the pipeline

2. **And** `src/core/path-resolver.js` exists resolving all target paths from config + platform registry

3. **And** the complete `templates/scrum_workflow/` directory tree is copied verbatim to `{target}/{framework_path}/` (FR50)

4. **And** the `templates/scrum_workflow/` directory inside the installer package contains all framework files: agents (4), commands (5), workflows (8), skills (8), context (4), templates (16), data (2), docs (19), config.yaml (1), totalling 68 files across 9 subdirectories (agents, commands, context, data, docs, skills, templates, workflows, plus root config.yaml)

5. **And** no file content is modified during copy -- byte-for-byte identical to source (verbatim copy principle)

6. **And** the target directory is created if it does not exist

7. **And** output directories are created: `{target}/_scrum-output/planning-artifacts/`, `{target}/_scrum-output/implementation-artifacts/`

8. **And** if the target `{framework_path}/` directory already exists, the installer warns and asks for confirmation before overwriting (unless `--yes` is passed)

9. **And** progress is displayed during copy using `@clack/prompts` spinner

## Tasks / Subtasks

- [x] Task 1: Populate `templates/scrum_workflow/` with all framework files (AC: #4)
  - [x] Subtask 1.1: Remove the `.gitkeep` placeholder from `templates/scrum_workflow/`
  - [x] Subtask 1.2: Copy the entire `scrum_workflow/` directory from the project root into `create-scrum-workflow/templates/scrum_workflow/` using a recursive copy (e.g., `cp -R`), excluding `.DS_Store` and `.gitkeep` files
  - [x] Subtask 1.3: Verify the copy by comparing file counts: `find templates/scrum_workflow -type f | wc -l` should equal 68
  - [x] Subtask 1.4: Verify no `.DS_Store` or `.gitkeep` files were included

- [x] Task 2: Create `src/core/path-resolver.js` (AC: #2)
  - [x] Subtask 2.1: Create the file using ES Module syntax (`import`/`export`)
  - [x] Subtask 2.2: Import `{ join }` from `node:path`
  - [x] Subtask 2.3: Implement `export function resolveInstallPaths(config, registry)` that takes the config object from `buildConfig()` and the platform registry Map
  - [x] Subtask 2.4: Compute `frameworkDir`: `join(config.directory, config.frameworkPath)` -- the target directory where the framework gets copied to (e.g., `/path/to/project/scrum_workflow`)
  - [x] Subtask 2.5: Compute `outputDirs`: array of output directories to create: `join(config.directory, '_scrum-output', 'planning-artifacts')` and `join(config.directory, '_scrum-output', 'implementation-artifacts')`
  - [x] Subtask 2.6: Compute `platformDirs`: for each platform in `config.platforms`, look up the platform in `registry` and compute the absolute path: `join(config.directory, entry.target_dir)` -- store as `Map<string, string>` mapping platform code to absolute skill dir path
  - [x] Subtask 2.7: Compute `templateSourceDir`: use `import.meta.url` + `fileURLToPath` + `dirname`/`join` to resolve `../../templates/scrum_workflow` relative to the module file (the bundled framework template directory inside the installer package)
  - [x] Subtask 2.8: Return object: `{ frameworkDir, outputDirs, platformDirs, templateSourceDir }`

- [x] Task 3: Create `src/core/installer.js` with the `Installer` class (AC: #1, #3, #5, #6, #7, #8, #9)
  - [x] Subtask 3.1: Create the file using ES Module syntax
  - [x] Subtask 3.2: Import dependencies: `{ copySync, ensureDirSync, existsSync }` from `fs-extra`, `{ spinner, confirm, log }` from `@clack/prompts`, `{ isCancel, cancel }` from `@clack/prompts`, `{ resolveInstallPaths }` from `./path-resolver.js`, `{ loadPlatformRegistry }` from `../platform/platform-registry.js`
  - [x] Subtask 3.3: Implement `export class Installer` with constructor receiving the config object from `buildConfig()`
  - [x] Subtask 3.4: In the constructor, call `loadPlatformRegistry()` to get the registry and `resolveInstallPaths(config, registry)` to get all resolved paths. Store both as instance properties.
  - [x] Subtask 3.5: Implement `async run()` as the main pipeline method that orchestrates all steps in sequence: `checkExisting()` -> `copyFramework()` -> `createOutputDirs()` -> `printSummary()`
  - [x] Subtask 3.6: Implement `async checkExisting()`: if `existsSync(this.paths.frameworkDir)` is true AND `this.config.yes` is NOT true, prompt with `confirm({ message: 'Framework directory already exists. Overwrite?' })`. If cancelled or declined, call `cancel('Installation cancelled')` and `process.exit(0)`. If `--yes` is set, log a warning and proceed without prompting.
  - [x] Subtask 3.7: Implement `copyFramework()`: use `@clack/prompts` `spinner()` to show progress (`s.start('Copying framework files...')`), call `copySync(this.paths.templateSourceDir, this.paths.frameworkDir)` from `fs-extra` (this does a recursive, verbatim byte-for-byte copy), then `s.stop('Framework files copied')`.
  - [x] Subtask 3.8: Implement `createOutputDirs()`: iterate `this.paths.outputDirs` and call `ensureDirSync(dir)` for each. Log with `log.info()` after creation.
  - [x] Subtask 3.9: Implement `printSummary()`: use `log.success()` to display summary -- framework path, number of files copied (count files in `this.paths.frameworkDir` recursively), output directories created.

- [x] Task 4: Wire `Installer` into the install command (AC: #1)
  - [x] Subtask 4.1: Update `src/commands/install.js` to import `{ Installer }` from `../core/installer.js`
  - [x] Subtask 4.2: Replace the placeholder `outro('Ready to install...')` with: create an `Installer` instance passing the config, then call `await installer.run()`
  - [x] Subtask 4.3: After `installer.run()`, call `outro('Installation complete!')` to display the @clack/prompts outro banner
  - [x] Subtask 4.4: Keep the `log.success('Configuration complete')` line from Story 5.3, but remove the `log.info(JSON.stringify(config, ...))` debug line -- the installer summary replaces it

- [x] Task 5: Validation and smoke testing (AC: #1-#9)
  - [x] Subtask 5.1: Verify `templates/scrum_workflow/` contains the full framework file tree (68 files, 9 subdirectories)
  - [x] Subtask 5.2: Run `node bin/create-scrum-workflow.js install -y -d /tmp` from `create-scrum-workflow/` and verify: framework directory created at `/tmp/scrum_workflow/`, output directories created at `/tmp/_scrum-output/planning-artifacts/` and `/tmp/_scrum-output/implementation-artifacts/`
  - [x] Subtask 5.3: Compare a sample file (`diff templates/scrum_workflow/config.yaml /tmp/scrum_workflow/config.yaml`) to verify verbatim copy
  - [x] Subtask 5.4: Run again on the same target (without `--yes`) and verify the overwrite confirmation prompt appears
  - [x] Subtask 5.5: Run with `--yes` on existing target and verify it overwrites without prompting
  - [x] Subtask 5.6: Verify spinner output appears during copy
  - [x] Subtask 5.7: Count files in the copied target: `find /tmp/scrum_workflow -type f | wc -l` should match the template count

## Dev Notes

### Important: Separate Project Context

This story creates files inside `create-scrum-workflow/` (at the repository root), which is a **standalone project** completely independent from the `scrum_workflow/` framework directory. It has its own `package.json`, its own `node_modules/`, and zero shared code.

### Critical: Populating templates/scrum_workflow/

The `templates/scrum_workflow/` directory inside the installer package must contain the **ACTUAL framework files** from the `scrum_workflow/` directory at the project root. These are the files that get copied verbatim to the target project during installation. Currently only a `.gitkeep` placeholder exists. The dev agent must copy all 68 framework files (excluding `.DS_Store` and `.gitkeep`) into this template directory.

**Complete file inventory (68 files from `scrum_workflow/`):**

```
agents/architect.md
agents/developer.md
agents/qa.md
agents/README.md
commands/create-project-context.md
commands/create-ticket.md
commands/dev-story.md
commands/README.md
commands/refine-ticket.md
config.yaml
context/architecture-guidelines.md
context/index.md
context/platform-adapter-contract.md
context/standards.md
data/estimation-reference.yaml
data/README.md
docs/00-index.md
docs/01-installation.md
docs/02-quick-start.md
docs/03-workflow-overview.md
docs/04-command-reference.md
docs/05-state-machine.md
docs/06-phase-details.md
docs/07-write-boundary-rules.md
docs/08-framework-architecture.md
docs/09-examples.md
docs/10-checklist.md
docs/11-anti-patterns.md
docs/12-implementation-patterns.md
docs/13-error-recovery.md
docs/14-extension-points.md
docs/15-best-practices.md
docs/16-troubleshooting.md
docs/17-appendix.md
docs/workflow-guide-old.md
skills/feedback-collection/SKILL.md
skills/guided-mode/SKILL.md
skills/prerequisite-validation/SKILL.md
skills/readiness-check/SKILL.md
skills/README.md
skills/status-guard-validation/SKILL.md
skills/story-validation/SKILL.md
skills/synthesis/SKILL.md
templates/approval.md
templates/context-architecture.md
templates/context-backend.md
templates/context-devops.md
templates/context-frontend.md
templates/context-index.md
templates/context-testing.md
templates/plan.md
templates/README.md
templates/refinement.md
templates/review.md
templates/skill-backend.md
templates/skill-devops.md
templates/skill-frontend.md
templates/skill-project-architect.md
templates/skill-testing.md
templates/story.md
workflows/approval.md
workflows/development.md
workflows/project-context.md
workflows/readiness-check.md
workflows/README.md
workflows/refinement.md
workflows/review.md
workflows/ticket-creation.md
```

**Note on file count discrepancy:** The epic AC mentions "51 framework files" based on the original research estimate. The actual framework now has 68 files (the `docs/` directory with 19 files and some additional README files were added after the research was conducted). Copy ALL 68 files -- the verbatim copy principle means the entire directory tree is replicated exactly.

### Relevant Architecture Patterns and Constraints

**From Research: Installation Pipeline Steps 4-7**

The Installer class implements steps 4-7 of the 10-step installation pipeline:

```
Step 1: Validate Prerequisites         (future story)
Step 2: Detect Existing Installation    (partial -- overwrite check in this story)
Step 3: Collect User Configuration      (Story 5.3 -- config-builder.js)
Step 4: Resolve Paths                   <-- THIS STORY (path-resolver.js)
Step 5: Install Framework Source        <-- THIS STORY (installer.js - copyFramework)
Step 6: Register Skills per Platform    (Story 5.5 -- not this story)
Step 7: Create Output Directories       <-- THIS STORY (installer.js - createOutputDirs)
Step 8: Generate Config                 (future story)
Step 9: Generate Manifest & Lock File   (Story 5.6)
Step 10: Report Results                 <-- THIS STORY (installer.js - printSummary)
```

**From Research: fs-extra for Recursive Copy**

The research recommends `fs-extra` for file operations. `copySync(src, dest)` performs a recursive, verbatim directory copy. It preserves directory structure and file contents byte-for-byte. It creates the destination directory if it does not exist. It overwrites existing files silently (the overwrite check is done BEFORE calling `copySync`).

Key `fs-extra` functions for this story:
- `copySync(src, dest)` -- recursive directory copy
- `ensureDirSync(dir)` -- create directory and all parents (like `mkdir -p`)
- `existsSync(path)` -- check if path exists (re-exported from `node:fs`)

`fs-extra` is already installed (listed in `package.json` dependencies from Story 5.1).

**From Research: @clack/prompts Spinner and Confirm**

The `@clack/prompts` API provides:
- `spinner()` returns an object with `.start(message)` and `.stop(message)` methods for showing progress
- `confirm({ message })` returns a `Promise<boolean | symbol>` -- true for yes, false for no, symbol for cancel

### Code Style Conventions (established by Stories 5.1-5.3)

- JavaScript ES Modules throughout (`import`/`export`, no `require`/`module.exports`)
- `node:` prefix for Node.js builtins (e.g., `node:path`, `node:fs`)
- File extensions required in imports (e.g., `./path-resolver.js`)
- `picocolors` for terminal colors outside @clack/prompts flow
- `@clack/prompts` for interactive UI (spinner, confirm, log)
- `import.meta.url` + `fileURLToPath` for ESM module-relative paths (pattern from `platform-registry.js`)
- Async functions for command handlers; classes allowed for stateful pipeline orchestration (Installer is the first class in the project)

### Critical Anti-Patterns to Avoid

1. **DO NOT modify file contents during copy** -- this is a VERBATIM copy pipeline. No template engines, no variable substitution, no string replacement. Every file must be byte-for-byte identical after copy. Variable substitution for skill registration shims is Story 5.5, not this story.
2. **DO NOT use `require()`** -- the project is `"type": "module"`, use ESM `import` everywhere.
3. **DO NOT use `__dirname`** -- it does not exist in ESM. Use `import.meta.url` with `fileURLToPath` and `dirname`/`join` for module-relative path resolution (same pattern as `platform-registry.js`).
4. **DO NOT use native `node:fs` for recursive copy** -- use `fs-extra`'s `copySync` which handles recursive directory copy correctly. Native `fs.cpSync` exists in Node 16.7+ but `fs-extra` is already the project's dependency for this purpose.
5. **DO NOT hardcode the framework directory name** -- always use `config.frameworkPath` (default: `'scrum_workflow'`) so users can customize it.
6. **DO NOT forget to check `isCancel()` after `confirm()` prompt** -- if the user presses Ctrl+C, the return value is a symbol, not a boolean.
7. **DO NOT create the Installer as a plain function** -- use a class because it manages state (config, paths, registry) across multiple pipeline steps. This follows the reference architecture pattern (`Installer` class in `core/installer.js`).
8. **DO NOT put skill registration logic in this story** -- Story 5.5 handles copying skill shims to `.{platform}/skills/`. This story only copies the framework directory and creates output directories.
9. **DO NOT include `.DS_Store` or `.gitkeep` files in `templates/scrum_workflow/`** -- these are development artifacts, not framework content.

### Existing Code to Reuse

**From `src/core/config-builder.js` (Story 5.3):**

The config object returned by `buildConfig()` has this shape:
```javascript
{
  directory: '/absolute/path/to/project',  // Always absolute
  projectName: 'my-project',               // String, non-empty
  platforms: ['claude-code'],               // Array of platform code strings, min 1
  frameworkPath: 'scrum_workflow'           // Directory name (no slashes)
}
```

**From `src/platform/platform-registry.js` (Story 5.2):**

```javascript
import { loadPlatformRegistry } from '../platform/platform-registry.js'
```

- `loadPlatformRegistry()` returns `Map<string, { code, display_name, category, target_dir, ... }>`
- Each Map value has: `code`, `display_name`, `category`, `target_dir`, `skill_format`, plus optional fields
- `getPlatform(registry, code)` returns a single platform entry or `undefined`

**From `src/commands/install.js` (Story 5.3):**

The current install handler calls `buildConfig()` and displays a placeholder outro. Replace the placeholder with the Installer pipeline.

### Path Resolution: template source dir

The path-resolver must resolve the template source directory relative to the installer package itself (not relative to the target project). The `templates/scrum_workflow/` directory is bundled inside the npm package at this path relative to `src/core/path-resolver.js`:

```
src/core/path-resolver.js  <-- module location
../../templates/scrum_workflow/  <-- template source (two levels up)
```

Use the same ESM pattern as `platform-registry.js`:
```javascript
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const templateSourceDir = join(__dirname, '..', '..', 'templates', 'scrum_workflow')
```

### How This Story Connects to Other Stories

**Upstream (dependencies):**
- Story 5.1 (Scaffolding): Provides `package.json`, `bin/create-scrum-workflow.js`, `src/commands/install.js`, directory structure
- Story 5.2 (Platform Registry): Provides `loadPlatformRegistry()` for path resolution
- Story 5.3 (Config Prompts): Provides `buildConfig()` returning the normalized config object

**Downstream (dependents):**
- Story 5.5 (Skill Registration): Consumes `Installer` pipeline, adds skill shim copy step after framework copy. Will call `resolveInstallPaths` for platform skill directories.
- Story 5.6 (Lock File): Consumes `Installer` pipeline, adds lock file generation step after all files are copied. Will hash all files in `paths.frameworkDir`.
- Story 5.7 (Update): Extends `Installer` for update flow with backup/restore.

### File Location Summary

**Files to create (all paths relative to `create-scrum-workflow/`):**

| File | Purpose |
|------|---------|
| `src/core/installer.js` | Main Installer class orchestrating the copy pipeline |
| `src/core/path-resolver.js` | Resolves all target paths from config + registry |
| `templates/scrum_workflow/**` | 68 framework files copied from project root `scrum_workflow/` |

**Files to modify:**

| File | Change |
|------|--------|
| `src/commands/install.js` | Replace placeholder with Installer pipeline call |

**Files to remove:**

| File | Reason |
|------|--------|
| `templates/scrum_workflow/.gitkeep` | Replaced by actual framework content |

### Testing Standards Summary

**Manual Verification Commands (run from `create-scrum-workflow/` directory):**

```bash
# Verify template files are populated
find templates/scrum_workflow -type f | wc -l
# Expected: 68

# Fresh install to temp directory (non-interactive)
node bin/create-scrum-workflow.js install -y -d /tmp

# Verify framework was copied
ls /tmp/scrum_workflow/
# Expected: agents/ commands/ config.yaml context/ data/ docs/ skills/ templates/ workflows/

# Verify file count matches
find /tmp/scrum_workflow -type f | wc -l
# Expected: 68

# Verify verbatim copy (byte-for-byte)
diff templates/scrum_workflow/config.yaml /tmp/scrum_workflow/config.yaml
# Expected: no output (files identical)

# Verify output directories created
ls -d /tmp/_scrum-output/planning-artifacts /tmp/_scrum-output/implementation-artifacts
# Expected: both directories exist

# Test overwrite prompt (interactive mode)
node bin/create-scrum-workflow.js install -d /tmp
# Expected: prompts appear, then overwrite confirmation since /tmp/scrum_workflow already exists

# Test overwrite with --yes
node bin/create-scrum-workflow.js install -y -d /tmp
# Expected: no overwrite prompt, copies proceed silently

# Cleanup
rm -rf /tmp/scrum_workflow /tmp/_scrum-output
```

### Previous Story Intelligence

**From Story 5.3 (Config Prompts) -- dev-complete:**
- `config-builder.js` is a simple exported async function (not a class)
- `install.js` currently calls `buildConfig(options)` then logs a placeholder message
- `@clack/prompts` provides `intro`, `outro`, `log.info`, `log.success` -- this story adds `spinner`, `confirm`
- `isCancel()` must be checked after every interactive prompt (confirm is a prompt)
- All imports use ESM syntax with `.js` extensions and `node:` prefix for builtins

**From Story 5.2 (Platform Registry) -- done:**
- `loadPlatformRegistry()` is synchronous (uses `readFileSync`)
- Uses `fileURLToPath(import.meta.url)` + `dirname` + `join` for resolving co-located YAML -- reuse this exact pattern in `path-resolver.js` for resolving `templates/scrum_workflow/`
- Registry returns Map entries with `target_dir` field (e.g., `.claude/skills`) used for computing platform skill directories

**From Story 5.1 (Scaffolding) -- done:**
- `fs-extra` v11 is installed in `node_modules/` -- provides `copySync`, `ensureDirSync`
- `templates/scrum_workflow/` directory exists with only a `.gitkeep` placeholder
- `templates/skill-registrations/` also exists with only a `.gitkeep` (used by Story 5.5, not this story)

### Project Structure Notes

- `src/core/installer.js` is the first class-based module in the project -- all previous modules use simple exported functions. The Installer class is justified because it manages shared state (config, paths, registry) across a multi-step pipeline.
- `src/core/path-resolver.js` follows the simple exported function pattern (like `config-builder.js`).
- No new directories need to be created -- `src/core/` and `templates/scrum_workflow/` already exist from Story 5.1.
- The `templates/scrum_workflow/` directory is part of the npm package (listed in `package.json` `"files"` whitelist under `"templates/"`).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.4] -- Acceptance criteria, story definition
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-5] -- Epic context, dependency map (5.4 depends on 5.1, 5.2, 5.3; depended on by 5.5, 5.6)
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Architectural-Patterns-and-Design] -- System architecture, installer.js and path-resolver.js placement, installation pipeline steps 4-7
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Component-Inventory] -- 51-file count (updated to 68 actual), component categories
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Technology-Stack-Analysis] -- fs-extra for recursive copy, @clack/prompts spinner
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Implementation-Approaches] -- Phase 1 step 1.4 covers verbatim copy
- [Source: _bmad-output/implementation-artifacts/5-3-interactive-user-configuration-prompts.md] -- Config object shape, ESM patterns, @clack/prompts API
- [Source: _bmad-output/implementation-artifacts/5-2-config-driven-platform-registry.md] -- Platform registry API, import.meta.url pattern for ESM path resolution
- [Source: _bmad-output/implementation-artifacts/5-1-project-scaffolding-and-cli-entry-point.md] -- Project structure, fs-extra dependency, templates/ directory
- [Source: create-scrum-workflow/package.json] -- Dependencies (fs-extra, @clack/prompts, js-yaml, picocolors), files whitelist
- [Source: create-scrum-workflow/src/core/config-builder.js] -- Config object shape, ESM import patterns
- [Source: create-scrum-workflow/src/platform/platform-registry.js] -- import.meta.url ESM pattern for module-relative file access

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

None required -- all smoke tests passed on first run after one ESM import fix.

### Completion Notes List

- fs-extra v11 uses CommonJS exports; in ESM context, must use `import fse from 'fs-extra'` then destructure, not named imports
- The `config` object from `buildConfig()` does not include the `yes` flag from Commander options; `install.js` now explicitly sets `config.yes = options.yes === true` before passing to Installer
- All 68 framework files copied verbatim (byte-for-byte verified with diff)
- Spinner, warn, confirm, and summary output all verified working

### File List

- `create-scrum-workflow/src/core/installer.js` (created)
- `create-scrum-workflow/src/core/path-resolver.js` (created)
- `create-scrum-workflow/src/commands/install.js` (modified)
- `create-scrum-workflow/templates/scrum_workflow/**` (68 files copied from `scrum_workflow/`)
- `create-scrum-workflow/templates/scrum_workflow/.gitkeep` (removed)

### Review Findings

- [x] [Review][Patch] Import ordering: fs-extra destructuring placed between import statements [installer.js:1-8] -- FIXED: moved destructuring after all imports
- [x] [Review][Patch] No error handling around copySync leaves spinner dangling on failure [installer.js:67-72] -- FIXED: wrapped in try/finally to ensure spinner stops
- [x] [Review][Defer] Invalid platform code silently ignored in path-resolver.js [path-resolver.js:25] -- deferred, low risk since config comes from constrained multiselect
- [x] [Review][Defer] templateSourceDir not validated for existence before copySync [path-resolver.js:30] -- deferred, relevant to Story 5.9 npm distribution
- [x] [Review][Defer] Overwrite is additive (does not remove stale files from previous install) [installer.js:70] -- deferred, by design for Story 5.7 update flow
