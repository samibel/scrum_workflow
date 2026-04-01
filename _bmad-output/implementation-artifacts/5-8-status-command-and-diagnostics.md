# Story 5.8: Status Command & Diagnostics

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to check the status of my scrum_workflow installation,
So that I can see which version is installed, which platforms are configured, and how many files are tracked.

## Acceptance Criteria

1. **Given** a project with an existing installation and `.scrum-workflow-lock.json`
   **When** the user runs `node bin/create-scrum-workflow.js status`
   **Then** `src/commands/status.js` exists with the status display logic

2. **And** the output shows: installer version (from lock file), installation date, last update date, configured platforms, framework path, total file count

3. **And** the command computes current hashes and reports: files unchanged, files modified by user, files missing (FR57)

4. **And** modified files are listed by name so the user knows which files they've customized

5. **And** missing files are listed as warnings

6. **And** if no `.scrum-workflow-lock.json` exists, the command prints: "No scrum_workflow installation found in this directory."

7. **And** the output uses colored terminal output via `picocolors` for readability

## Tasks / Subtasks

- [x] Task 1: Replace the placeholder in `src/commands/status.js` with the full status command (AC: #1, #2, #6, #7)
  - [x] Subtask 1.1: Import dependencies: `{ readLockFile }` from `../integrity/lock-file.js`, `{ hashFile }` from `../integrity/hash-tracker.js`, `{ existsSync }` from `node:fs`, `{ join, resolve }` from `node:path`, `pc` from `picocolors`
  - [x] Subtask 1.2: Implement `export async function status(options)` that: (a) resolves the target directory from `options.directory` using `resolve(options.directory)`, (b) reads the lock file using `readLockFile(targetDir)`, (c) if lock file is null, print "No scrum_workflow installation found in this directory." using `console.log(pc.yellow(...))` and return early
  - [x] Subtask 1.3: Print installation info header using `picocolors`: version (`pc.bold(lockData.version)`), installation date (`lockData.installed`), last update date (`lockData.updated`), configured platforms (`lockData.platforms.join(', ')`), framework path (`lockData.framework_path`), total file count (`Object.keys(lockData.files).length`)

- [x] Task 2: Implement file integrity analysis (AC: #3, #4, #5)
  - [x] Subtask 2.1: Iterate all entries in `lockData.files`. For each relative path, compute the absolute path (`join(targetDir, relPath)`). Check if the file exists using `existsSync(absPath)`.
  - [x] Subtask 2.2: For existing files, compute `hashFile(absPath)` and compare against stored hash. Remember: `hashFile()` returns raw hex (no prefix), lock file stores `sha256:<hex>`. Compare as `storedHash === \`sha256:${currentHash}\``.
  - [x] Subtask 2.3: Classify into three arrays: `unchanged` (hash matches), `modified` (hash differs), `missing` (file does not exist on disk).
  - [x] Subtask 2.4: Print file integrity summary: unchanged count (`pc.green(...)`), modified count (`pc.yellow(...)`), missing count (`pc.red(...)`).
  - [x] Subtask 2.5: If `modified.length > 0`, list each modified file name using `pc.yellow(relPath)`.
  - [x] Subtask 2.6: If `missing.length > 0`, list each missing file as a warning using `pc.red(relPath)`.

- [x] Task 3: Validation and smoke testing (AC: #1-#7)
  - [x] Subtask 3.1: Fresh install to temp dir: `node bin/create-scrum-workflow.js install -y -d /tmp/test-status`
  - [x] Subtask 3.2: Run status: `node bin/create-scrum-workflow.js status -d /tmp/test-status` -- verify all fields displayed, 0 modified, 0 missing
  - [x] Subtask 3.3: Modify a file: `echo "# Custom" >> /tmp/test-status/scrum_workflow/config.yaml`
  - [x] Subtask 3.4: Run status again -- verify config.yaml listed as modified
  - [x] Subtask 3.5: Delete a file: `rm /tmp/test-status/scrum_workflow/agents/architect.md`
  - [x] Subtask 3.6: Run status again -- verify architect.md listed as missing warning
  - [x] Subtask 3.7: Test no installation: `rm /tmp/test-status/.scrum-workflow-lock.json && node bin/create-scrum-workflow.js status -d /tmp/test-status` -- verify "No scrum_workflow installation found" message
  - [x] Subtask 3.8: Cleanup: `rm -rf /tmp/test-status`

## Dev Notes

### Important: Separate Project Context

This story modifies files inside `create-scrum-workflow/` (at the repository root), which is a **standalone project** completely independent from the `scrum_workflow/` framework directory. It has its own `package.json`, its own `node_modules/`, and zero shared code.

### Status Command Design: Simple Console Output with picocolors

The status command is a **read-only diagnostic tool**. Unlike `install` and `update`, it does NOT use `@clack/prompts` (no `intro`, `outro`, `spinner`, `log`). Instead, it uses plain `console.log()` with `picocolors` for colored output. Rationale:

- Status is a quick info dump, not an interactive workflow
- No spinners needed -- hashing is fast for the ~70 tracked files
- No `intro`/`outro` chrome needed for a single-shot display command
- `picocolors` is already a dependency and provides lightweight coloring
- This matches the pattern in the current placeholder (which already imports `pc from 'picocolors'`)

### Output Format

The status command should produce output similar to:

```
scrum_workflow Installation Status
==================================

  Version:      1.0.0
  Installed:    2026-03-28T14:00:00.000Z
  Last Updated: 2026-03-28T15:30:00.000Z
  Platforms:    claude-code
  Framework:    scrum_workflow
  Files:        72 tracked

File Integrity
==============

  Unchanged:    70
  Modified:      1
  Missing:       1

Modified files:
  scrum_workflow/config.yaml

Missing files (warning):
  scrum_workflow/agents/architect.md
```

Colors:
- Title/labels: `pc.bold()`
- Values: default (no color)
- Unchanged count: `pc.green()`
- Modified count and modified file names: `pc.yellow()`
- Missing count and missing file names: `pc.red()`
- "No installation found" message: `pc.yellow()`

### Hash Comparison Logic

The lock file stores hashes in `sha256:<64-hex>` format. The `hashFile()` function from `hash-tracker.js` returns **raw hex** (no prefix). When comparing:

```javascript
const currentHash = hashFile(absolutePath)                     // e.g., "abc123def456..."
const storedHash = lockData.files[relativePath]                // e.g., "sha256:abc123def456..."
const isModified = storedHash !== `sha256:${currentHash}`
```

Always add the `sha256:` prefix to the computed hash before comparing. This is the same pattern used in `update.js` (line 74).

### Reusing Existing Modules

**From `src/integrity/lock-file.js` (Story 5.6 -- DONE):**
- `readLockFile(targetDir)` -- returns parsed lock data object or `null` if no lock file exists
- Lock data structure: `{ version, installed, updated, platforms, framework_path, files }`
- `files` is an object mapping relative paths to `sha256:<hex>` strings

**From `src/integrity/hash-tracker.js` (Story 5.6 -- DONE):**
- `hashFile(filePath)` -- returns raw SHA-256 hex digest for a single file (no `sha256:` prefix)

These are the ONLY two modules needed. The status command does NOT need `writeLockFile`, `buildLockData`, `hashDirectory`, `resolveInstallPaths`, `loadPlatformRegistry`, `registerSkills`, or any `@clack/prompts` imports.

### DO NOT Create New Utility Modules

All the building blocks already exist. The status command is a simple composition of `readLockFile()` + `hashFile()` + `picocolors` formatting. All logic lives in `src/commands/status.js`.

### Code Style Conventions (established by Stories 5.1-5.7)

- JavaScript ES Modules throughout (`import`/`export`, no `require`/`module.exports`)
- `node:` prefix for Node.js builtins (e.g., `node:path`, `node:fs`)
- File extensions required in imports (e.g., `../integrity/lock-file.js`)
- `picocolors` imported as `pc` -- default import: `import pc from 'picocolors'`
- Simple exported async function for command handlers (not classes)
- No semicolons (consistent with all existing source files)
- `const` over `let` where possible
- Template literals for string interpolation

### Critical Anti-Patterns to Avoid

1. **DO NOT use `@clack/prompts`** -- the status command is a simple info display, not an interactive workflow. No `intro`, `outro`, `spinner`, or `log` needed. Use `console.log()` with `picocolors`.
2. **DO NOT use `require()`** -- the project is `"type": "module"`, use ESM `import` everywhere.
3. **DO NOT use `__dirname`** -- it does not exist in ESM. Not needed for status command anyway (all paths come from the lock file + `options.directory`).
4. **DO NOT hash file content as UTF-8 strings** -- `hashFile()` already handles this correctly by reading raw Buffers.
5. **DO NOT import more modules than needed** -- the status command only needs `readLockFile`, `hashFile`, `existsSync`, `join`, `resolve`, and `pc`. Keep imports minimal.
6. **DO NOT modify any existing utility modules** -- `hash-tracker.js`, `lock-file.js` are complete. Only replace the placeholder in `src/commands/status.js`.
7. **DO NOT modify `bin/create-scrum-workflow.js`** -- it already registers the `status` command with `-d, --directory <path>` option.
8. **DO NOT use `hashDirectory()`** -- the status command hashes files one at a time from the lock file's `files` list (not by walking directories). This ensures it only checks files that were originally tracked, not new files the user may have added.
9. **DO NOT write or modify the lock file** -- the status command is read-only. It reads the lock file and computes hashes for comparison, but never writes.
10. **DO NOT use `process.exit()`** -- return early from the function instead. The CLI framework handles process termination.

### How This Story Connects to Other Stories

**Upstream (dependencies):**
- Story 5.6 (Lock File): Provides `readLockFile()` and `hashFile()` -- the two modules consumed by the status command. Also defines the lock file format that status reads.

**Downstream (dependents):**
- Story 5.9 (npm Distribution -- Optional): May reference the status command in README documentation.

**Parallel (independent):**
- Story 5.7 (Update Command): Also reads the lock file and computes hashes, but for backup/restore purposes. The update and status commands are independent siblings -- both depend on 5.6 but not on each other. The file classification logic (unchanged/modified/missing) in status is similar to update's Step 2, but simpler: status only reads and displays, never writes.

### File Location Summary

**Files to modify (all paths relative to `create-scrum-workflow/`):**

| File | Change |
|------|--------|
| `src/commands/status.js` | Replace placeholder with full status display logic |

**Files NOT to modify:**

| File | Reason |
|------|--------|
| `src/integrity/hash-tracker.js` | Complete from Story 5.6 -- used as-is |
| `src/integrity/lock-file.js` | Complete from Story 5.6 -- used as-is |
| `src/core/installer.js` | Separate pipeline for `install` command -- not relevant |
| `src/commands/update.js` | Separate pipeline for `update` command -- not relevant |
| `bin/create-scrum-workflow.js` | Already wires `status` command -- no changes needed |

### Testing Standards Summary

**Manual Verification Commands (run from `create-scrum-workflow/` directory):**

```bash
# Step 1: Fresh install to temp directory
node bin/create-scrum-workflow.js install -y -d /tmp/test-status

# Step 2: Run status on clean install (all files unchanged)
node bin/create-scrum-workflow.js status -d /tmp/test-status
# Expected: version 1.0.0, 0 modified, 0 missing, all unchanged

# Step 3: Modify a file
echo "# Custom config addition" >> /tmp/test-status/scrum_workflow/config.yaml

# Step 4: Run status -- verify modified file detected
node bin/create-scrum-workflow.js status -d /tmp/test-status
# Expected: config.yaml listed as modified

# Step 5: Delete a file
rm /tmp/test-status/scrum_workflow/agents/architect.md

# Step 6: Run status -- verify missing file detected
node bin/create-scrum-workflow.js status -d /tmp/test-status
# Expected: agents/architect.md listed as missing warning

# Step 7: Test no lock file
rm /tmp/test-status/.scrum-workflow-lock.json
node bin/create-scrum-workflow.js status -d /tmp/test-status
# Expected: "No scrum_workflow installation found in this directory."

# Cleanup
rm -rf /tmp/test-status
```

### Previous Story Intelligence

**From Story 5.7 (Update Command) -- ready-for-dev:**
- File classification logic is similar: iterate `lockData.files`, check existence, compare hashes
- Hash comparison pattern: `storedHash === \`sha256:${currentHash}\`` (line 74 of update.js)
- Lock file config reconstruction pattern: `{ directory: targetDir, frameworkPath: lockData.framework_path, platforms: lockData.platforms }` (but status command does NOT need this -- it reads directly from lock data)
- Update command uses `@clack/prompts` for spinners and intro/outro -- status command should NOT follow this pattern (use `console.log` + `picocolors` instead for simpler output)

**From Story 5.6 (Lock File) -- ready-for-dev:**
- `hashFile()` returns raw hex string (no `sha256:` prefix)
- Lock file `files` object uses `sha256:` prefix in values
- `readLockFile()` returns `null` if file does not exist (catches `ENOENT`)
- Lock file paths are relative to project root (portable)

**From Story 5.4 (Framework Copy) -- done:**
- `picocolors` imported as: `import pc from 'picocolors'` (already in the placeholder)
- `fs-extra` is NOT needed for the status command (read-only, no file operations)

### Project Structure Notes

- The status command (`src/commands/status.js`) is the simplest of the three commands: read-only, no spinners, no interactive UI
- The current file is a 6-line placeholder that already imports `picocolors` -- replace entirely
- The CLI entry point already wires `status` with the `-d, --directory <path>` option
- No new npm dependencies are required
- The command will work with any valid `.scrum-workflow-lock.json` regardless of which version of the installer created it

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.8] -- Acceptance criteria, story definition
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-5] -- Epic context, dependency map (5.8 depends on 5.6; no downstream story deps except optional 5.9)
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Phase-2-Step-2.3] -- Status command: show installed version, platforms, component count
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Architectural-Patterns-and-Design] -- System architecture showing src/commands/status.js placement
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#CLI-Entry-Point] -- Commander status command registration
- [Source: _bmad-output/implementation-artifacts/5-6-lock-file-and-installation-manifest.md] -- Lock file format, hash-tracker API, lock-file API
- [Source: _bmad-output/implementation-artifacts/5-7-update-command-with-backup-restore.md] -- File classification pattern (unchanged/modified/missing), hash comparison logic
- [Source: create-scrum-workflow/src/commands/status.js] -- Current placeholder (to be replaced)
- [Source: create-scrum-workflow/src/commands/update.js] -- Reference for file classification logic (lines 57-85)
- [Source: create-scrum-workflow/src/integrity/hash-tracker.js] -- hashFile() implementation
- [Source: create-scrum-workflow/src/integrity/lock-file.js] -- readLockFile() implementation, lock data structure
- [Source: create-scrum-workflow/bin/create-scrum-workflow.js] -- CLI wiring (already registers status command with -d flag)
- [Source: create-scrum-workflow/package.json] -- Dependencies (picocolors ^1.1.0), version (1.0.0)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

None required -- all validation passed on first attempt.

### Completion Notes List

- Replaced 6-line placeholder in `src/commands/status.js` with full status command (~73 lines)
- Uses `readLockFile()` from `lock-file.js` and `hashFile()` from `hash-tracker.js` as specified
- Uses `console.log()` + `picocolors` (no `@clack/prompts`) for non-interactive diagnostic output
- Hash comparison uses `sha256:` prefix pattern: `storedHash === \`sha256:${currentHash}\``
- All 7 acceptance criteria verified through manual smoke testing
- Zero BMAD references in the implementation
- No existing files modified other than `src/commands/status.js`
- No new dependencies added

### File List

- `create-scrum-workflow/src/commands/status.js` -- Full status command implementation (replaced placeholder)
