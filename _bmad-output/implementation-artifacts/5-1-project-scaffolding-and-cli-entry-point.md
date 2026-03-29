# Story 5.1: Project Scaffolding & CLI Entry Point

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a Node.js CLI project with commander-based command dispatch,
So that I have a working CLI skeleton that can parse commands and flags before any installer logic is added.

## Acceptance Criteria

**Given** an empty directory for the `create-scrum-workflow` project
**When** the project is scaffolded
**Then** `package.json` exists with `"name": "create-scrum-workflow"`, `"type": "module"`, and `"bin"` entry pointing to `bin/create-scrum-workflow.js`
**And** `bin/create-scrum-workflow.js` exists with `#!/usr/bin/env node` shebang and commander program setup
**And** three commands are registered: `install`, `update`, `status` — each with `--help` output
**And** the `install` command accepts flags: `-d, --directory <path>` (default: `.`), `-p, --platforms <platforms...>` (default: `['claude-code']`), `-y, --yes` (accept all defaults)
**And** the `update` command accepts flag: `-d, --directory <path>` (default: `.`)
**And** the `status` command accepts flag: `-d, --directory <path>` (default: `.`)
**And** running `node bin/create-scrum-workflow.js --help` prints usage information without errors
**And** running `node bin/create-scrum-workflow.js install --help` prints install-specific options
**And** the project uses JavaScript ES Modules throughout — no CommonJS, no build step (FR59, NFR19)
**And** `package.json` lists dependencies: `commander`, `@clack/prompts`, `fs-extra`, `js-yaml`, `picocolors`
**And** `.gitignore` includes `node_modules/`

## Tasks / Subtasks

- [ ] Task 1: Initialize project directory and package.json
  - [ ] Subtask 1.1: Create `create-scrum-workflow/` directory at project root level (sibling to `scrum_workflow/`)
  - [ ] Subtask 1.2: Create `package.json` with `"name": "create-scrum-workflow"`, `"version": "1.0.0"`, `"type": "module"`, `"description": "Install the Scrum Workflow AI-assisted development framework"`, and `"bin": { "create-scrum-workflow": "bin/create-scrum-workflow.js" }`
  - [ ] Subtask 1.3: Add `"files"` whitelist: `["bin/", "src/", "templates/"]` for future npm publish safety
  - [ ] Subtask 1.4: Add `"scripts"`: `"test": "vitest run"`, `"test:watch": "vitest"`
  - [ ] Subtask 1.5: Add `"keywords"`: `["ai", "scrum", "workflow", "agent-skills", "claude-code", "cursor", "windsurf"]`

- [ ] Task 2: Install npm dependencies
  - [ ] Subtask 2.1: Install production dependencies: `commander`, `@clack/prompts`, `fs-extra`, `js-yaml`, `picocolors`
  - [ ] Subtask 2.2: Install dev dependencies: `vitest`, `memfs`
  - [ ] Subtask 2.3: Verify `package-lock.json` is generated and `node_modules/` exists

- [ ] Task 3: Create directory structure
  - [ ] Subtask 3.1: Create `bin/` directory
  - [ ] Subtask 3.2: Create `src/` directory with subdirectories: `src/commands/`, `src/core/`, `src/platform/`, `src/integrity/`
  - [ ] Subtask 3.3: Create `templates/` directory with subdirectories: `templates/scrum_workflow/`, `templates/skill-registrations/`
  - [ ] Subtask 3.4: Create `.gitignore` with `node_modules/` entry

- [ ] Task 4: Create CLI entry point (bin/create-scrum-workflow.js)
  - [ ] Subtask 4.1: Create `bin/create-scrum-workflow.js` with `#!/usr/bin/env node` shebang on first line
  - [ ] Subtask 4.2: Import `{ program }` from `commander`
  - [ ] Subtask 4.3: Configure program with `.name('create-scrum-workflow')`, `.description('Install the Scrum Workflow framework into your project')`, `.version('1.0.0')`
  - [ ] Subtask 4.4: Register `install` command with options: `-d, --directory <path>` (default: `.`), `-p, --platforms <platforms...>` (default: `['claude-code']`), `-y, --yes` (accept all defaults)
  - [ ] Subtask 4.5: Register `update` command with option: `-d, --directory <path>` (default: `.`)
  - [ ] Subtask 4.6: Register `status` command with option: `-d, --directory <path>` (default: `.`)
  - [ ] Subtask 4.7: Wire each command's `.action()` to its respective handler import from `src/commands/`
  - [ ] Subtask 4.8: Call `program.parse()` at the end of the file

- [ ] Task 5: Create placeholder command handlers
  - [ ] Subtask 5.1: Create `src/commands/install.js` exporting an `install(options)` async function that logs "Install command — not yet implemented" with picocolors and exits cleanly
  - [ ] Subtask 5.2: Create `src/commands/update.js` exporting an `update(options)` async function that logs "Update command — not yet implemented" with picocolors and exits cleanly
  - [ ] Subtask 5.3: Create `src/commands/status.js` exporting a `status(options)` async function that logs "Status command — not yet implemented" with picocolors and exits cleanly
  - [ ] Subtask 5.4: Each handler must receive the commander options object and log the received options for debugging

- [ ] Task 6: Set file permissions and verify CLI
  - [ ] Subtask 6.1: Set executable permission on `bin/create-scrum-workflow.js` (`chmod +x`)
  - [ ] Subtask 6.2: Verify `node bin/create-scrum-workflow.js --help` prints usage information without errors
  - [ ] Subtask 6.3: Verify `node bin/create-scrum-workflow.js --version` prints `1.0.0`
  - [ ] Subtask 6.4: Verify `node bin/create-scrum-workflow.js install --help` prints install-specific options including all three flags
  - [ ] Subtask 6.5: Verify `node bin/create-scrum-workflow.js update --help` prints update-specific options
  - [ ] Subtask 6.6: Verify `node bin/create-scrum-workflow.js status --help` prints status-specific options
  - [ ] Subtask 6.7: Verify `node bin/create-scrum-workflow.js install` executes the placeholder handler and exits cleanly
  - [ ] Subtask 6.8: Verify `node bin/create-scrum-workflow.js install -d /tmp -p claude-code cursor -y` passes options correctly to the handler

## Dev Notes

### Important: Separate Project

This story creates a **separate project** (`create-scrum-workflow/`) that is **completely independent** from the existing `scrum_workflow/` framework directory. It has its own `package.json`, its own `node_modules/`, and zero shared code. The project directory should be created at the repository root level, as a sibling to `scrum_workflow/`.

### Relevant Architecture Patterns and Constraints

**From Research: Recommended Architecture**
- Entry point: `bin/create-scrum-workflow.js` with shebang + commander setup
- Three commands: `install`, `update`, `status`
- JavaScript ES Modules throughout (`"type": "module"`) — no CommonJS, no build step
- Commander v13 for CLI parsing (de facto standard, 25M+ weekly downloads)
- Picocolors for terminal colors (14x smaller than chalk, same API)

**From Research: Project File Structure**

```
create-scrum-workflow/
  bin/
    create-scrum-workflow.js       # Entry point (shebang + commander)
  src/
    commands/
      install.js                   # Fresh installation pipeline (placeholder for now)
      update.js                    # Update existing installation (placeholder for now)
      status.js                    # Show installation status (placeholder for now)
    core/                          # Future: installer.js, config-builder.js, path-resolver.js, manifest.js
    platform/                      # Future: platform-registry.yaml, platform-setup.js
    integrity/                     # Future: hash-tracker.js, lock-file.js
  templates/
    scrum_workflow/                 # Future: complete framework source (verbatim copy)
    skill-registrations/           # Future: skill registration shims
  package.json
  .gitignore
```

**From Research: Entry Point Reference Code**

```javascript
#!/usr/bin/env node
import { program } from 'commander'
import { install } from '../src/commands/install.js'
import { update } from '../src/commands/update.js'
import { status } from '../src/commands/status.js'

program
  .name('create-scrum-workflow')
  .description('Install the Scrum Workflow framework into your project')
  .version('1.0.0')

program
  .command('install')
  .description('Install scrum_workflow into current or specified directory')
  .option('-d, --directory <path>', 'Target project directory', '.')
  .option('-p, --platforms <platforms...>', 'Target platforms', ['claude-code'])
  .option('-y, --yes', 'Accept all defaults')
  .action(install)

program
  .command('update')
  .description('Update existing scrum_workflow installation')
  .option('-d, --directory <path>', 'Target project directory', '.')
  .action(update)

program
  .command('status')
  .description('Show installation status')
  .option('-d, --directory <path>', 'Target project directory', '.')
  .action(status)

program.parse()
```

**From Research: Package.json Reference**

```json
{
  "name": "create-scrum-workflow",
  "version": "1.0.0",
  "type": "module",
  "description": "Install the Scrum Workflow AI-assisted development framework",
  "bin": {
    "create-scrum-workflow": "bin/create-scrum-workflow.js"
  },
  "files": [
    "bin/",
    "src/",
    "templates/"
  ],
  "keywords": ["ai", "scrum", "workflow", "agent-skills", "claude-code", "cursor", "windsurf"],
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

**FR/NFR Traceability:**
- FR49: User installs scrum_workflow via single CLI command — this story creates the CLI entry point
- FR58: Non-interactive mode via CLI flags — `--yes` flag registered on `install` command
- FR59: Standalone CLI with zero external dependency — separate project, own package.json
- NFR19: Zero runtime dependency on external tools — standalone codebase, no external imports

### Source Tree Components to Touch

**Files to Create (all inside new `create-scrum-workflow/` directory):**
1. `package.json` — Project manifest with ESM configuration and bin entry
2. `.gitignore` — Exclude node_modules/
3. `bin/create-scrum-workflow.js` — CLI entry point with shebang and commander setup
4. `src/commands/install.js` — Placeholder install command handler
5. `src/commands/update.js` — Placeholder update command handler
6. `src/commands/status.js` — Placeholder status command handler

**Directories to Create:**
1. `bin/`
2. `src/commands/`
3. `src/core/` (empty, for future stories)
4. `src/platform/` (empty, for future stories)
5. `src/integrity/` (empty, for future stories)
6. `templates/scrum_workflow/` (empty, for Story 5.4)
7. `templates/skill-registrations/` (empty, for Story 5.5)

**No existing files modified** — this is a greenfield scaffolding story.

### Testing Standards Summary

**Validation Requirements:**
- `node bin/create-scrum-workflow.js --help` prints usage without errors (exit code 0)
- `node bin/create-scrum-workflow.js --version` prints `1.0.0`
- `node bin/create-scrum-workflow.js install --help` shows all three flags (-d, -p, -y)
- `node bin/create-scrum-workflow.js update --help` shows -d flag
- `node bin/create-scrum-workflow.js status --help` shows -d flag
- `node bin/create-scrum-workflow.js install` runs placeholder handler and exits cleanly
- `node bin/create-scrum-workflow.js install -d /tmp -p claude-code cursor -y` passes options correctly
- `package.json` contains all required fields: name, version, type, bin, files, dependencies
- All `.js` files use ESM syntax (import/export) — no `require()` or `module.exports`
- `.gitignore` contains `node_modules/`

**Known Pitfalls (from research):**
- Missing shebang line (`#!/usr/bin/env node`) causes "permission denied" errors
- ESM/CJS confusion: `"type": "module"` must be set in package.json; all imports must use `.js` extension
- File permissions: `bin/create-scrum-workflow.js` must be executable (`chmod +x`)
- Commander variadic options (`<platforms...>`) need proper default array handling

### Story Dependencies

- **No dependencies** — Story 5.1 has no prerequisites and can be worked in parallel with Story 5.2
- **Downstream dependencies:** Stories 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9 all depend on this scaffolding

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-5] — Epic 5 complete context, story dependency map, and all story definitions
- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.1] — Story 5.1 acceptance criteria
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md] — Complete architectural blueprint, technology stack, entry point reference code, package.json reference, directory structure, testing strategy
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Installer] — FR49 (single CLI command), FR58 (non-interactive mode), FR59 (standalone CLI)
- [Source: _bmad-output/planning-artifacts/prd.md#NFR-Installer] — NFR17 (install < 5s), NFR18 (package < 500KB), NFR19 (zero external dependency)
- [Source: _bmad-output/planning-artifacts/epics.md#FR-Coverage-Map] — FR49-FR59 coverage for Epic 5
