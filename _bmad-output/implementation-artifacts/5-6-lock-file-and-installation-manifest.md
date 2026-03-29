# Story 5.6: Lock File & Installation Manifest

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the installer to generate a lock file with SHA-256 hashes for all installed files,
So that future updates can detect which files were modified by me and preserve my changes.

## Acceptance Criteria

1. **Given** framework files and skill registrations have been installed (Stories 5.4, 5.5)
   **When** the lock file generation step executes
   **Then** `src/integrity/hash-tracker.js` exists with functions to compute SHA-256 hashes for files

2. **And** `src/integrity/lock-file.js` exists with functions to read, write, and compare lock files

3. **And** `.scrum-workflow-lock.json` is written to the target project root (FR54)

4. **And** the lock file contains: `version` (installer version from package.json), `installed` (ISO 8601 timestamp), `updated` (ISO 8601 timestamp), `platforms` (array of selected platform codes), `framework_path` (resolved path), and `files` (object mapping relative file paths to `sha256:<hash>` strings)

5. **And** every installed file (framework files + skill registrations) has an entry in the `files` object

6. **And** the lock file is valid JSON and can be parsed by `JSON.parse()` without errors

7. **And** running the installer again on the same target produces identical hashes for unmodified files (NFR20)

8. **And** the lock file itself is NOT included in the hash tracking (it changes every run)

9. **And** the install command prints a summary after completion: number of files installed, platforms configured, lock file location

## Tasks / Subtasks

- [ ] Task 1: Create `src/integrity/hash-tracker.js` with SHA-256 hashing functions (AC: #1, #5, #7)
  - [ ] Subtask 1.1: Remove the `.gitkeep` placeholder from `src/integrity/`
  - [ ] Subtask 1.2: Create the file using ES Module syntax (`import`/`export`)
  - [ ] Subtask 1.3: Import `{ createHash }` from `node:crypto` and `{ readFileSync, readdirSync, statSync }` from `node:fs` and `{ join, relative }` from `node:path`
  - [ ] Subtask 1.4: Implement `export function hashFile(filePath)` that reads a file and returns its SHA-256 hex digest using `createHash('sha256').update(readFileSync(filePath)).digest('hex')`
  - [ ] Subtask 1.5: Implement `export function hashDirectory(dirPath, basePath)` that recursively walks `dirPath`, computes SHA-256 for every file, and returns an object mapping relative paths (relative to `basePath`) to `sha256:<hex>` strings. `basePath` is the project root used to compute relative keys (e.g., `scrum_workflow/agents/architect.md`).
  - [ ] Subtask 1.6: Inside `hashDirectory`, skip directories (recurse into them), only hash files. Sort entries alphabetically for deterministic output.
  - [ ] Subtask 1.7: Implement `export function hashFiles(fileEntries, basePath)` that takes an array of `{ dir, files }` entries (for skill registrations across multiple platform dirs) and returns a hash object in the same format as `hashDirectory`. Each `{ dir, files }` entry is a directory path + array of relative file paths within it.

- [ ] Task 2: Create `src/integrity/lock-file.js` with lock file management functions (AC: #2, #3, #4, #6, #8)
  - [ ] Subtask 2.1: Create the file using ES Module syntax
  - [ ] Subtask 2.2: Import `{ readFileSync, writeFileSync }` from `node:fs` and `{ join }` from `node:path`
  - [ ] Subtask 2.3: Define `const LOCK_FILE_NAME = '.scrum-workflow-lock.json'`
  - [ ] Subtask 2.4: Implement `export function writeLockFile(targetDir, lockData)` that writes `lockData` as pretty-printed JSON (2-space indent) to `join(targetDir, LOCK_FILE_NAME)`. Use `JSON.stringify(lockData, null, 2)` with a trailing newline.
  - [ ] Subtask 2.5: Implement `export function readLockFile(targetDir)` that reads and parses the lock file from `join(targetDir, LOCK_FILE_NAME)`. Return `null` if the file does not exist (catch `ENOENT` error).
  - [ ] Subtask 2.6: Implement `export function buildLockData(config, fileHashes)` that constructs the lock file data object with: `version` from the installer's `package.json`, `installed` and `updated` as ISO 8601 timestamps (`new Date().toISOString()`), `platforms` from `config.platforms`, `framework_path` from `config.frameworkPath`, and `files` from the `fileHashes` object.
  - [ ] Subtask 2.7: For reading the installer version, use `import { createRequire } from 'node:module'` then `const require = createRequire(import.meta.url)` then `const pkg = require('../../package.json')` to read `pkg.version`. This is the established ESM pattern for importing JSON.
  - [ ] Subtask 2.8: Export `LOCK_FILE_NAME` for use by other modules (status command, update command).

- [ ] Task 3: Integrate lock file generation into the Installer pipeline (AC: #3, #5, #9)
  - [ ] Subtask 3.1: Import `{ hashFile, hashDirectory }` from `../integrity/hash-tracker.js` in `installer.js`
  - [ ] Subtask 3.2: Import `{ writeLockFile, buildLockData }` from `../integrity/lock-file.js` in `installer.js`
  - [ ] Subtask 3.3: Add a `generateLockFile()` method to the `Installer` class that: (a) computes hashes for all framework files using `hashDirectory(this.paths.frameworkDir, this.config.directory)`, (b) computes hashes for all skill registration files across all platform dirs, (c) merges both hash objects into a single `fileHashes` object, (d) calls `buildLockData(this.config, fileHashes)`, (e) calls `writeLockFile(this.config.directory, lockData)`, (f) stores `lockData` as `this.lockData` for use in the summary.
  - [ ] Subtask 3.4: Wrap `generateLockFile()` in a spinner: `s.start('Generating lock file...')`, try/finally pattern, `s.stop('Lock file generated')`.
  - [ ] Subtask 3.5: For hashing skill registration files: iterate `this.paths.platformDirs` entries, for each platform's skill dir, walk it recursively and hash all files, using `this.config.directory` as the basePath so keys become relative like `.claude/skills/create-ticket/SKILL.md`.
  - [ ] Subtask 3.6: Insert `generateLockFile()` into `run()` after `createOutputDirs()` and before `printSummary()`: `checkExisting()` -> `copyFramework()` -> `registerSkills()` -> `createOutputDirs()` -> `generateLockFile()` -> `printSummary()`
  - [ ] Subtask 3.7: Update `printSummary()` to include lock file info: total file count from `this.lockData.files`, lock file location. Display as part of the summary block.

- [ ] Task 4: Validation and smoke testing (AC: #1-#9)
  - [ ] Subtask 4.1: Run `node bin/create-scrum-workflow.js install -y -d /tmp` from `create-scrum-workflow/` and verify `.scrum-workflow-lock.json` exists at `/tmp/.scrum-workflow-lock.json`
  - [ ] Subtask 4.2: Parse the lock file and verify it contains: `version` matching `package.json` version, `installed` as ISO 8601, `updated` as ISO 8601, `platforms` array containing `claude-code`, `framework_path` of `scrum_workflow`, and `files` object with entries
  - [ ] Subtask 4.3: Verify the `files` object contains entries for both framework files (e.g., `scrum_workflow/config.yaml`) and skill registrations (e.g., `.claude/skills/create-ticket/SKILL.md`)
  - [ ] Subtask 4.4: Verify every hash value matches the pattern `sha256:<64-char-hex-string>`
  - [ ] Subtask 4.5: Run the installer again on the same target with `--yes` and compare lock file hashes -- all hashes for unmodified files must be identical (idempotent, NFR20)
  - [ ] Subtask 4.6: Verify the lock file itself is NOT listed in the `files` object
  - [ ] Subtask 4.7: Verify the summary output includes the lock file location
  - [ ] Subtask 4.8: Cleanup: `rm -rf /tmp/scrum_workflow /tmp/_scrum-output /tmp/.claude /tmp/.scrum-workflow-lock.json`

## Dev Notes

### Important: Separate Project Context

This story creates files inside `create-scrum-workflow/` (at the repository root), which is a **standalone project** completely independent from the `scrum_workflow/` framework directory. It has its own `package.json`, its own `node_modules/`, and zero shared code.

### Lock File Format

The lock file follows the exact format defined in the research document. Example:

```json
{
  "version": "1.0.0",
  "installed": "2026-03-28T14:00:00.000Z",
  "updated": "2026-03-28T14:00:00.000Z",
  "platforms": ["claude-code"],
  "framework_path": "scrum_workflow",
  "files": {
    "scrum_workflow/agents/architect.md": "sha256:abc123def456...",
    "scrum_workflow/commands/create-ticket.md": "sha256:789abc012...",
    ".claude/skills/create-ticket/SKILL.md": "sha256:fed987654..."
  }
}
```

**Key design decisions:**
- File paths in the `files` object are **relative to the target project root** (not absolute). This makes the lock file portable.
- Hash values use the `sha256:` prefix for future-proofing (allows switching to a different algorithm without breaking the format).
- The `installed` timestamp is set once on first install. The `updated` timestamp changes on every install/update.

### Hashing Strategy

Use Node.js native `node:crypto` module for SHA-256 hashing. Zero additional dependencies needed.

```javascript
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

function hashFile(filePath) {
  const content = readFileSync(filePath)
  return createHash('sha256').update(content).digest('hex')
}
```

The hash is computed on the raw file bytes (Buffer), not the UTF-8 string. This ensures binary files are hashed correctly and avoids encoding-related hash differences across platforms.

### Reading package.json Version in ESM

Since the project uses `"type": "module"`, you cannot use `import pkg from '../../package.json'` directly (JSON imports require an assertion flag). The recommended ESM pattern is:

```javascript
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('../../package.json')
// pkg.version === '1.0.0'
```

This is a well-established pattern used by many ESM-first projects.

### Collecting Skill Registration File Hashes

The skill registrar writes processed SKILL.md files to platform-specific directories (e.g., `/tmp/.claude/skills/create-ticket/SKILL.md`). These files must be hashed **after** they are written (since variable substitution modifies the content). The hashing step must:

1. Iterate all platform dirs from `this.paths.platformDirs`
2. For each platform dir, recursively walk and hash all files
3. Compute relative paths from `this.config.directory` (project root)
4. Merge into the same hash object as the framework files

This means `generateLockFile()` must run **after** both `copyFramework()` and `registerSkills()` have completed.

### Installation Pipeline Position

This story implements Step 9 of the 10-step installation pipeline:

```
Step 1: Validate Prerequisites         (future story)
Step 2: Detect Existing Installation    (partial -- Story 5.4)
Step 3: Collect User Configuration      (Story 5.3 -- config-builder.js)
Step 4: Resolve Paths                   (Story 5.4 -- path-resolver.js)
Step 5: Install Framework Source        (Story 5.4 -- installer.js - copyFramework)
Step 6: Register Skills per Platform    (Story 5.5 -- skill-registrar.js)
Step 7: Create Output Directories       (Story 5.4 -- installer.js - createOutputDirs)
Step 8: Generate Config                 (future story)
Step 9: Generate Manifest & Lock File   <-- THIS STORY
Step 10: Report Results                 (Story 5.4 -- installer.js - printSummary)
```

### Code Style Conventions (established by Stories 5.1-5.5)

- JavaScript ES Modules throughout (`import`/`export`, no `require`/`module.exports`)
- `node:` prefix for Node.js builtins (e.g., `node:path`, `node:fs`, `node:crypto`)
- File extensions required in imports (e.g., `./hash-tracker.js`)
- `picocolors` for terminal colors outside @clack/prompts flow
- `@clack/prompts` for interactive UI (spinner, confirm, log)
- `import.meta.url` + `fileURLToPath` for ESM module-relative paths
- `fse` default import from `fs-extra`, then destructure: `const { ensureDirSync, writeFileSync } = fse`
- Async functions for command handlers; Installer class for stateful pipeline orchestration
- try/finally around spinner operations to ensure spinner stops on failure
- Simple exported functions for utility modules (`hash-tracker.js`, `lock-file.js`), class only for the Installer pipeline orchestrator

### Critical Anti-Patterns to Avoid

1. **DO NOT include the lock file itself in the hash tracking** -- the lock file changes every run (timestamps, potentially different hashes). Hashing it would create a chicken-and-egg problem.
2. **DO NOT use `require()`** -- the project is `"type": "module"`, use ESM `import` everywhere. The only exception is `createRequire` for reading `package.json`.
3. **DO NOT use `__dirname`** -- it does not exist in ESM. Use `import.meta.url` with `fileURLToPath` if module-relative paths are needed.
4. **DO NOT hash file content as UTF-8 strings** -- use `readFileSync(filePath)` without encoding to get a Buffer. This ensures consistent hashes across platforms regardless of line-ending normalization.
5. **DO NOT use `fs-extra` for reading files for hashing** -- use native `node:fs` `readFileSync` to get raw Buffers. `fs-extra` is for file operations (copy, ensureDir), not for reading.
6. **DO NOT import `fs-extra` with named imports** -- fs-extra v11 uses CommonJS exports. In ESM context, use `import fse from 'fs-extra'` then destructure (lesson from Story 5.4).
7. **DO NOT hardcode the installer version** -- read it from `package.json` at runtime using the `createRequire` pattern.
8. **DO NOT hash output directories** (`_scrum-output/`) -- only hash framework files and skill registration files. Output directories are empty structures created for the user.
9. **DO NOT store absolute paths in the lock file** -- all paths must be relative to the project root for portability.
10. **DO NOT modify `config-builder.js`, `platform-registry.js`, or `skill-registrar.js`** -- these modules are complete from previous stories. Only modify `installer.js` to integrate the new lock file step.

### Existing Code to Reuse

**From `src/core/installer.js` (Stories 5.4-5.5):**

The Installer class is the pipeline orchestrator. Current `run()` pipeline:
```javascript
async run() {
  await this.checkExisting()
  this.copyFramework()
  this.registerSkills()
  this.createOutputDirs()
  this.printSummary()
}
```

Updated `run()` pipeline after this story:
```javascript
async run() {
  await this.checkExisting()
  this.copyFramework()
  this.registerSkills()
  this.createOutputDirs()
  this.generateLockFile()   // <-- NEW: Step 9
  this.printSummary()
}
```

The `generateLockFile()` method follows the same spinner + try/finally pattern as `copyFramework()` and `registerSkills()`.

**From `src/core/installer.js` -- `countFiles()` helper:**

There is already a `countFiles(dir)` function that recursively counts files in a directory. The `hashDirectory` function in `hash-tracker.js` performs similar directory traversal but computes hashes instead of counting. Do NOT reuse `countFiles` for hashing -- they serve different purposes and live in different modules.

**From `src/core/path-resolver.js` (Stories 5.4-5.5):**

Returns `{ frameworkDir, outputDirs, platformDirs, templateSourceDir, skillTemplateDir }`. The `frameworkDir` and `platformDirs` are the directories that need to be hashed. No changes needed to path-resolver for this story.

**From `src/core/skill-registrar.js` (Story 5.5):**

Already writes processed skill shims to platform skill directories. The lock file step reads these written files to compute hashes. No changes needed to skill-registrar.

### How This Story Connects to Other Stories

**Upstream (dependencies):**
- Story 5.4 (Framework Copy): Provides the `Installer` class, the pipeline pattern, `paths.frameworkDir` containing copied framework files to hash
- Story 5.5 (Skill Registration): Writes skill shim files to platform dirs (`paths.platformDirs`) that must also be hashed

**Downstream (dependents):**
- Story 5.7 (Update Command): Reads the lock file, compares current file hashes against stored hashes to classify files as unchanged/user-modified/custom. Consumes `readLockFile()` and `hashFile()`.
- Story 5.8 (Status Command): Reads the lock file to display installation info and detect modified/missing files. Consumes `readLockFile()` and `hashFile()`.

### File Location Summary

**Files to create (all paths relative to `create-scrum-workflow/`):**

| File | Purpose |
|------|---------|
| `src/integrity/hash-tracker.js` | SHA-256 file hashing: `hashFile()`, `hashDirectory()` |
| `src/integrity/lock-file.js` | Lock file read/write/build: `readLockFile()`, `writeLockFile()`, `buildLockData()` |

**Files to modify:**

| File | Change |
|------|--------|
| `src/core/installer.js` | Add `generateLockFile()` method, insert into `run()` pipeline, update `printSummary()` with lock file info |

**Files to remove:**

| File | Reason |
|------|--------|
| `src/integrity/.gitkeep` | Replaced by actual module files |

### Testing Standards Summary

**Manual Verification Commands (run from `create-scrum-workflow/` directory):**

```bash
# Fresh install to temp directory (non-interactive)
node bin/create-scrum-workflow.js install -y -d /tmp

# Verify lock file exists
ls /tmp/.scrum-workflow-lock.json
# Expected: file exists

# Verify lock file is valid JSON with expected structure
node -e "
import { readFileSync } from 'node:fs';
const lock = JSON.parse(readFileSync('/tmp/.scrum-workflow-lock.json', 'utf8'));
console.log('version:', lock.version);
console.log('installed:', lock.installed);
console.log('updated:', lock.updated);
console.log('platforms:', lock.platforms);
console.log('framework_path:', lock.framework_path);
console.log('file count:', Object.keys(lock.files).length);
console.log('sample key:', Object.keys(lock.files)[0]);
console.log('sample value:', Object.values(lock.files)[0]);
"

# Verify framework files are tracked (should include scrum_workflow/ entries)
node -e "
import { readFileSync } from 'node:fs';
const lock = JSON.parse(readFileSync('/tmp/.scrum-workflow-lock.json', 'utf8'));
const fwFiles = Object.keys(lock.files).filter(k => k.startsWith('scrum_workflow/'));
console.log('Framework files tracked:', fwFiles.length);
"
# Expected: 68 framework files

# Verify skill registration files are tracked
node -e "
import { readFileSync } from 'node:fs';
const lock = JSON.parse(readFileSync('/tmp/.scrum-workflow-lock.json', 'utf8'));
const skillFiles = Object.keys(lock.files).filter(k => k.includes('/skills/'));
console.log('Skill files tracked:', skillFiles.length);
skillFiles.forEach(f => console.log(' ', f));
"
# Expected: 4 skill files (.claude/skills/create-project-context/SKILL.md, etc.)

# Verify hash format (sha256:<64-hex-chars>)
node -e "
import { readFileSync } from 'node:fs';
const lock = JSON.parse(readFileSync('/tmp/.scrum-workflow-lock.json', 'utf8'));
const values = Object.values(lock.files);
const valid = values.every(v => /^sha256:[a-f0-9]{64}$/.test(v));
console.log('All hashes valid format:', valid);
console.log('Total hashes:', values.length);
"

# Verify lock file is NOT in the files object
node -e "
import { readFileSync } from 'node:fs';
const lock = JSON.parse(readFileSync('/tmp/.scrum-workflow-lock.json', 'utf8'));
console.log('Lock file tracked:', '.scrum-workflow-lock.json' in lock.files);
"
# Expected: false

# Idempotency test: reinstall and compare hashes
cp /tmp/.scrum-workflow-lock.json /tmp/lock-before.json
node bin/create-scrum-workflow.js install -y -d /tmp
node -e "
import { readFileSync } from 'node:fs';
const before = JSON.parse(readFileSync('/tmp/lock-before.json', 'utf8'));
const after = JSON.parse(readFileSync('/tmp/.scrum-workflow-lock.json', 'utf8'));
const keys = Object.keys(before.files);
const allMatch = keys.every(k => before.files[k] === after.files[k]);
console.log('Hashes identical after reinstall:', allMatch);
console.log('Files compared:', keys.length);
"
# Expected: Hashes identical after reinstall: true

# Cleanup
rm -rf /tmp/scrum_workflow /tmp/_scrum-output /tmp/.claude /tmp/.scrum-workflow-lock.json /tmp/lock-before.json
```

### Previous Story Intelligence

**From Story 5.5 (Skill Registration) -- done:**
- `registerSkills()` writes processed SKILL.md files to each platform's skill directory
- `this.skillResult` stores `{ skillCount, platformCount }` from registration
- Skill files undergo `{{framework_path}}` substitution, so their hashes differ from the templates
- Platform dirs are accessed via `this.paths.platformDirs` (Map<string, string>)
- Spinner + try/finally error handling pattern used consistently

**From Story 5.4 (Framework Copy) -- done:**
- `Installer` class pattern: constructor loads registry + resolves paths, `run()` orchestrates steps
- `copySync` does verbatim byte-for-byte copy, so framework file hashes match template hashes
- `fs-extra` must be imported as default: `import fse from 'fs-extra'` then destructure
- `countFiles(dir)` helper exists for recursive file counting (used in `printSummary`)
- `config.yes` is explicitly set in `install.js` before passing to Installer
- Output dirs (`_scrum-output/`) are created but contain no files -- do not hash them

**From Story 5.1 (Scaffolding) -- done:**
- `src/integrity/` directory exists with `.gitkeep` placeholder
- `package.json` has `"version": "1.0.0"` -- this is the version that goes into the lock file
- Dependencies include `fs-extra`, `js-yaml`, `picocolors` -- no additional deps needed for hashing (native `node:crypto`)

### Project Structure Notes

- `src/integrity/hash-tracker.js` and `src/integrity/lock-file.js` are simple utility modules with exported functions (not classes). They follow the same pattern as `config-builder.js` and `skill-registrar.js`.
- The `src/integrity/` directory is already scaffolded from Story 5.1 -- only the `.gitkeep` needs removal.
- No new npm dependencies are required -- `node:crypto` is a Node.js builtin, and `node:fs`/`node:path`/`node:module` are already used elsewhere.
- The lock file is written to the **target project root** (`this.config.directory`), NOT inside the `scrum_workflow/` framework directory. This keeps it at the same level as `.claude/` and `_scrum-output/`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.6] -- Acceptance criteria, story definition
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-5] -- Epic context, dependency map (5.6 depends on 5.4 and 5.5; depended on by 5.7 and 5.8)
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Integrity-Update-Strategy] -- Lock file JSON format, update flow, sha256 prefix convention
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Architectural-Patterns-and-Design] -- System architecture showing src/integrity/ placement, pipeline Step 9
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Recommended-Technology-Stack] -- Node.js crypto (native) for SHA-256, zero dependency
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Component-Inventory] -- Lock file entry with all hashes, file path format
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Implementation-Approaches] -- Phase 1 step 1.7 covers lock file generation
- [Source: _bmad-output/implementation-artifacts/5-5-skill-registration-per-platform.md] -- Skill registrar API, platform dir iteration, spinner pattern
- [Source: _bmad-output/implementation-artifacts/5-4-framework-verbatim-copy-pipeline.md] -- Installer class, path-resolver, countFiles helper, fs-extra ESM import pattern
- [Source: create-scrum-workflow/src/core/installer.js] -- Current Installer class, run() pipeline, spinner pattern
- [Source: create-scrum-workflow/src/core/path-resolver.js] -- Path resolution, frameworkDir, platformDirs
- [Source: create-scrum-workflow/src/core/skill-registrar.js] -- Skill registration, writes to platform dirs
- [Source: create-scrum-workflow/package.json] -- Version field (1.0.0), dependencies, files whitelist

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
