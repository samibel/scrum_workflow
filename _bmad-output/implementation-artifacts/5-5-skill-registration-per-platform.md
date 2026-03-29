# Story 5.5: Skill Registration per Platform

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the installer to register scrum_workflow commands as skill shims in each selected platform's skill directory,
So that my AI coding assistant discovers and can invoke the framework commands.

## Acceptance Criteria

1. **Given** the framework has been copied to the target directory (Story 5.4)
   **When** the skill registration step executes for each selected platform
   **Then** `templates/skill-registrations/` contains 4 SKILL.md shim templates: `create-project-context/SKILL.md`, `create-ticket/SKILL.md`, `refine-ticket/SKILL.md`, `dev-story/SKILL.md`

2. **And** each shim template contains a `{{framework_path}}` placeholder in the body that references the framework command file

3. **And** for each selected platform, the installer copies the 4 shim directories to `{target}/.{platform}/skills/` (FR51)

4. **And** during copy, `{{framework_path}}` is replaced with the resolved framework path (e.g., `scrum_workflow`)

5. **And** each generated SKILL.md has valid YAML frontmatter with `name` matching the directory name and a `description` field

6. **And** the `name` frontmatter field uses kebab-case and matches the parent directory name per the Agent Skills specification

7. **And** if `.{platform}/skills/` already contains a skill with the same name, the installer overwrites it (idempotent)

8. **And** no workflow logic is duplicated in the shims -- they are pure references to framework command files

## Tasks / Subtasks

- [x] Task 1: Create the 4 skill shim templates in `templates/skill-registrations/` (AC: #1, #2, #5, #6, #8)
  - [x] Subtask 1.1: Remove the `.gitkeep` placeholder from `templates/skill-registrations/`
  - [x] Subtask 1.2: Create directory `templates/skill-registrations/create-project-context/`
  - [x] Subtask 1.3: Create `templates/skill-registrations/create-project-context/SKILL.md` with YAML frontmatter (`name: create-project-context`, `description`) and body containing `{{framework_path}}` placeholder referencing `{{framework_path}}/commands/create-project-context.md`
  - [x] Subtask 1.4: Create directory `templates/skill-registrations/create-ticket/`
  - [x] Subtask 1.5: Create `templates/skill-registrations/create-ticket/SKILL.md` with YAML frontmatter (`name: create-ticket`, `description`) and body containing `{{framework_path}}` placeholder referencing `{{framework_path}}/commands/create-ticket.md`
  - [x] Subtask 1.6: Create directory `templates/skill-registrations/refine-ticket/`
  - [x] Subtask 1.7: Create `templates/skill-registrations/refine-ticket/SKILL.md` with YAML frontmatter (`name: refine-ticket`, `description`) and body containing `{{framework_path}}` placeholder referencing `{{framework_path}}/commands/refine-ticket.md`
  - [x] Subtask 1.8: Create directory `templates/skill-registrations/dev-story/`
  - [x] Subtask 1.9: Create `templates/skill-registrations/dev-story/SKILL.md` with YAML frontmatter (`name: dev-story`, `description`) and body containing `{{framework_path}}` placeholder referencing `{{framework_path}}/commands/dev-story.md`
  - [x] Subtask 1.10: Verify all 4 SKILL.md files have valid YAML frontmatter parseable by `js-yaml`

- [x] Task 2: Create `src/core/skill-registrar.js` with registration logic (AC: #3, #4, #7)
  - [x] Subtask 2.1: Create the file using ES Module syntax (`import`/`export`)
  - [x] Subtask 2.2: Import `{ readFileSync, readdirSync, statSync }` from `node:fs`, `{ join }` from `node:path`, and `fse` from `fs-extra` (for `ensureDirSync`, `writeFileSync`)
  - [x] Subtask 2.3: Import `{ fileURLToPath }` from `node:url` and `{ dirname }` from `node:path` for ESM-compatible path resolution of the template directory
  - [x] Subtask 2.4: Resolve the skill templates source directory using `import.meta.url`: `join(__dirname, '..', '..', 'templates', 'skill-registrations')` -- same ESM pattern as `path-resolver.js`
  - [x] Subtask 2.5: Implement `export function registerSkills(paths, config)` that takes the resolved paths object (from `resolveInstallPaths`) and the config object
  - [x] Subtask 2.6: Inside `registerSkills`: read the list of skill template directories from the resolved `skillTemplateDir` (each subdirectory = one skill)
  - [x] Subtask 2.7: For each selected platform in `config.platforms`, look up the platform's absolute skill directory from `paths.platformDirs` (a `Map<string, string>`)
  - [x] Subtask 2.8: For each skill template directory, read the `SKILL.md` file content as a string using `readFileSync(path, 'utf8')`
  - [x] Subtask 2.9: Perform variable substitution: replace all occurrences of `{{framework_path}}` with `config.frameworkPath` (e.g., `scrum_workflow`) using `content.replaceAll('{{framework_path}}', config.frameworkPath)`
  - [x] Subtask 2.10: Compute the target path: `join(platformSkillDir, skillName, 'SKILL.md')` where `skillName` is the template directory name (e.g., `create-ticket`)
  - [x] Subtask 2.11: Ensure the target skill directory exists using `ensureDirSync(join(platformSkillDir, skillName))`
  - [x] Subtask 2.12: Write the processed content using `writeFileSync(targetPath, processedContent, 'utf8')` -- this overwrites existing files (AC #7, idempotent)
  - [x] Subtask 2.13: Return an object with `{ skillCount, platformCount }` for summary reporting (skillCount = number of skills per platform, platformCount = number of platforms processed)

- [x] Task 3: Integrate `registerSkills` into the Installer pipeline (AC: #3)
  - [x] Subtask 3.1: Import `{ registerSkills }` from `./skill-registrar.js` in `installer.js`
  - [x] Subtask 3.2: Add a `registerSkills()` method to the `Installer` class that wraps the call with a `@clack/prompts` spinner: `s.start('Registering skill shims...')`, call `registerSkills(this.paths, this.config)`, `s.stop('Skill shims registered')`
  - [x] Subtask 3.3: Add error handling with try/finally to ensure the spinner stops on failure (same pattern as `copyFramework()`)
  - [x] Subtask 3.4: Insert the `registerSkills()` call into `run()` after `copyFramework()` and before `createOutputDirs()`: `checkExisting()` -> `copyFramework()` -> `registerSkills()` -> `createOutputDirs()` -> `printSummary()`
  - [x] Subtask 3.5: Update `printSummary()` to include skill registration info: number of skills registered, platforms configured. Store the result from `registerSkills()` as `this.skillResult` for use in the summary.

- [x] Task 4: Add `skillTemplateDir` to path-resolver (AC: #3)
  - [x] Subtask 4.1: In `path-resolver.js`, add a `skillTemplateDir` field to the returned object: `join(__dirname, '..', '..', 'templates', 'skill-registrations')` -- the bundled skill template source directory inside the installer package
  - [x] Subtask 4.2: Update the JSDoc return type to include `skillTemplateDir: string`

- [x] Task 5: Validation and smoke testing (AC: #1-#8)
  - [x] Subtask 5.1: Verify `templates/skill-registrations/` contains exactly 4 subdirectories, each with a `SKILL.md` file
  - [x] Subtask 5.2: Verify each `SKILL.md` template contains `{{framework_path}}` placeholder text
  - [x] Subtask 5.3: Verify each `SKILL.md` template has valid YAML frontmatter with `name` and `description` fields
  - [x] Subtask 5.4: Run `node bin/create-scrum-workflow.js install -y -d /tmp` and verify skill directories are created at `/tmp/.claude/skills/create-project-context/SKILL.md`, `/tmp/.claude/skills/create-ticket/SKILL.md`, `/tmp/.claude/skills/refine-ticket/SKILL.md`, `/tmp/.claude/skills/dev-story/SKILL.md`
  - [x] Subtask 5.5: Verify the generated SKILL.md files contain `scrum_workflow` (not `{{framework_path}}`) -- confirming variable substitution worked
  - [x] Subtask 5.6: Verify the generated SKILL.md files have valid YAML frontmatter with `name` matching the parent directory name
  - [x] Subtask 5.7: Run the installer again on the same target with `--yes` and verify the skill files are overwritten cleanly (idempotent)
  - [x] Subtask 5.8: Verify no workflow logic is duplicated in the generated shims -- they should only contain references to the framework command files
  - [x] Subtask 5.9: Cleanup: `rm -rf /tmp/scrum_workflow /tmp/_scrum-output /tmp/.claude`

## Dev Notes

### Important: Separate Project Context

This story creates files inside `create-scrum-workflow/` (at the repository root), which is a **standalone project** completely independent from the `scrum_workflow/` framework directory. It has its own `package.json`, its own `node_modules/`, and zero shared code.

### Skill Shim Template Content

Each SKILL.md shim template follows the Agent Skills open standard (agentskills.io). The templates are lightweight wrappers that point the AI assistant to the framework's command file. They contain NO workflow logic -- only a reference.

**Template format (example for `create-ticket/SKILL.md`):**

```markdown
---
name: create-ticket
description: "Create a structured story spec from natural language input using the Scrum Workflow framework. Use when the user says 'create ticket', 'new story', or '/create-ticket'."
---

Load and execute the framework command at `{{framework_path}}/commands/create-ticket.md`.

The command file contains the full workflow orchestration including:
- Input validation and parsing
- Vagueness detection with guided mode
- Story file generation from template
- Estimation and complexity assessment
```

**All 4 skill shim descriptions (use these exact descriptions):**

1. **create-project-context**: `"Analyze the project codebase to discover tech stack, architecture, and conventions, then generate project context and domain skill files. Use when the user says 'create project context', 'analyze project', or '/create-project-context'."`

2. **create-ticket**: `"Create a structured story spec from natural language input using the Scrum Workflow framework. Use when the user says 'create ticket', 'new story', or '/create-ticket'."`

3. **refine-ticket**: `"Orchestrate multi-agent refinement for a story by spawning Architect, Developer, and QA perspectives. Use when the user says 'refine ticket', 'refine story', or '/refine-ticket'."`

4. **dev-story**: `"Implement a story following its specification and execution plan from the refined story file. Use when the user says 'dev story', 'implement story', or '/dev-story'."`

**Body content per shim (use these patterns):**

Each body should follow this structure:
```markdown
Load and execute the framework command at `{{framework_path}}/commands/{command-name}.md`.

The command file contains the full workflow orchestration including:
- {bullet 1: primary action}
- {bullet 2: secondary action}
- {bullet 3: tertiary action}
- {bullet 4: output/result action}
```

The bullet points should briefly summarize what the command does (from the actual command files), NOT duplicate the workflow logic. This ensures the AI assistant understands the purpose without loading the full command at startup (progressive disclosure per the Agent Skills spec).

### Variable Substitution Pattern

The **only** variable in the skill shim templates is `{{framework_path}}`. It gets replaced at install time with the user's configured framework directory name (default: `scrum_workflow`).

**Implementation:**
```javascript
const processedContent = rawContent.replaceAll('{{framework_path}}', config.frameworkPath)
```

This is a simple string replacement -- no template engine needed. The double-brace syntax `{{...}}` was chosen to avoid conflicts with YAML, Markdown, and JavaScript template literal syntax.

### Relevant Architecture Patterns and Constraints

**From Research: Installation Pipeline Step 6**

This story implements Step 6 of the 10-step installation pipeline:

```
Step 1: Validate Prerequisites         (future story)
Step 2: Detect Existing Installation    (partial -- Story 5.4)
Step 3: Collect User Configuration      (Story 5.3 -- config-builder.js)
Step 4: Resolve Paths                   (Story 5.4 -- path-resolver.js)
Step 5: Install Framework Source        (Story 5.4 -- installer.js - copyFramework)
Step 6: Register Skills per Platform    <-- THIS STORY
Step 7: Create Output Directories       (Story 5.4 -- installer.js - createOutputDirs)
Step 8: Generate Config                 (future story)
Step 9: Generate Manifest & Lock File   (Story 5.6)
Step 10: Report Results                 (Story 5.4 -- installer.js - printSummary)
```

**From Research: Skill Registration Pattern**

The research document defines the exact skill shim format at section "Skill Registration Pattern". Each skill registration is a lightweight SKILL.md that loads the framework command. Variable resolution happens at install time, not at runtime.

**From Research: Agent Skills Open Standard**

Required SKILL.md frontmatter fields:
- `name`: max 64 chars, lowercase+hyphens, must match parent directory name
- `description`: max 1024 chars, describes what + when to use

The `name` must use kebab-case and exactly match the parent directory name. This is enforced by all platforms that implement the Agent Skills standard.

**From Research: Platform Directory Mapping**

The `platformDirs` Map from `resolveInstallPaths()` already contains the resolved absolute paths for each platform's skill directory. For example:
- `claude-code` -> `/path/to/project/.claude/skills`
- `cursor` -> `/path/to/project/.cursor/skills`

The skill registrar simply iterates this Map and copies the processed shim files to each platform directory.

### Code Style Conventions (established by Stories 5.1-5.4)

- JavaScript ES Modules throughout (`import`/`export`, no `require`/`module.exports`)
- `node:` prefix for Node.js builtins (e.g., `node:path`, `node:fs`, `node:url`)
- File extensions required in imports (e.g., `./skill-registrar.js`)
- `picocolors` for terminal colors outside @clack/prompts flow
- `@clack/prompts` for interactive UI (spinner, confirm, log)
- `import.meta.url` + `fileURLToPath` for ESM module-relative paths (pattern from `platform-registry.js` and `path-resolver.js`)
- `fse` default import from `fs-extra`, then destructure: `const { ensureDirSync, writeFileSync } = fse`
- Async functions for command handlers; Installer class for stateful pipeline orchestration
- try/finally around spinner operations to ensure spinner stops on failure

### Critical Anti-Patterns to Avoid

1. **DO NOT duplicate workflow logic in the skill shims** -- shims are pure references to framework command files. The AI assistant loads the command file at runtime, not the shim body.
2. **DO NOT use `require()`** -- the project is `"type": "module"`, use ESM `import` everywhere.
3. **DO NOT use `__dirname`** -- it does not exist in ESM. Use `import.meta.url` with `fileURLToPath` and `dirname`/`join` for module-relative path resolution.
4. **DO NOT use a template engine** -- `String.prototype.replaceAll()` is sufficient for the single `{{framework_path}}` variable. No need for Handlebars, EJS, or any other dependency.
5. **DO NOT hardcode platform directories** -- always use `paths.platformDirs` from `resolveInstallPaths()`. The platform registry is the source of truth.
6. **DO NOT read the platform registry again** -- the Installer already loaded it in the constructor. Pass `this.paths` and `this.config` to the registrar function.
7. **DO NOT modify `config-builder.js` or `platform-registry.js`** -- these modules are complete from previous stories.
8. **DO NOT use `copySync` for skill shims** -- unlike the framework verbatim copy (Story 5.4), skill shims require variable substitution. Read the template, replace variables, then write the processed content.
9. **DO NOT import `fs-extra` with named imports** -- fs-extra v11 uses CommonJS exports. In ESM context, use `import fse from 'fs-extra'` then destructure (lesson from Story 5.4).

### Existing Code to Reuse

**From `src/core/installer.js` (Story 5.4):**

The Installer class is the pipeline orchestrator. It already has:
- Constructor that loads the platform registry and resolves paths
- `run()` method that orchestrates steps in sequence
- `copyFramework()` with spinner + try/finally error handling pattern
- `printSummary()` that can be extended with skill registration info

The `registerSkills()` method should follow the same pattern as `copyFramework()` (spinner wrapping, try/finally).

**From `src/core/path-resolver.js` (Story 5.4):**

Already computes `platformDirs` Map from config + registry. Needs one addition: `skillTemplateDir` pointing to the bundled skill templates inside the installer package.

**Current `run()` pipeline:**
```javascript
async run() {
  await this.checkExisting()
  this.copyFramework()
  this.createOutputDirs()
  this.printSummary()
}
```

**Updated `run()` pipeline after this story:**
```javascript
async run() {
  await this.checkExisting()
  this.copyFramework()
  this.registerSkills()    // <-- NEW: Step 6
  this.createOutputDirs()
  this.printSummary()
}
```

**From `src/platform/platform-registry.js` (Story 5.2):**

- `loadPlatformRegistry()` returns `Map<string, { code, display_name, category, target_dir, ... }>`
- The `target_dir` field (e.g., `.claude/skills`) is already used by `path-resolver.js` to compute `platformDirs`

### Path Resolution: skill template source dir

The skill template source directory must be resolved relative to the installer package itself (not relative to the target project). The `templates/skill-registrations/` directory is bundled inside the npm package at this path relative to `src/core/skill-registrar.js`:

```
src/core/skill-registrar.js           <-- module location
../../templates/skill-registrations/  <-- template source (two levels up)
```

Use the same ESM pattern as `path-resolver.js`:
```javascript
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const skillTemplateDir = join(__dirname, '..', '..', 'templates', 'skill-registrations')
```

Alternatively, add `skillTemplateDir` to the `resolveInstallPaths()` return value and pass `paths.skillTemplateDir` to the registrar. Either approach works; the key is that the path is resolved relative to the module file, not relative to `process.cwd()`.

### How This Story Connects to Other Stories

**Upstream (dependencies):**
- Story 5.2 (Platform Registry): Provides `loadPlatformRegistry()` with `target_dir` per platform
- Story 5.4 (Framework Copy): Provides the `Installer` class, `path-resolver.js`, and the pipeline orchestration pattern

**Downstream (dependents):**
- Story 5.6 (Lock File): Will hash all installed files including skill registrations. Every file written by `registerSkills` must be tracked in the lock file.
- Story 5.7 (Update): Will use the lock file to detect user-modified skill shims and preserve them during updates.

### File Location Summary

**Files to create (all paths relative to `create-scrum-workflow/`):**

| File | Purpose |
|------|---------|
| `src/core/skill-registrar.js` | Skill shim registration logic (read templates, substitute variables, write to platform dirs) |
| `templates/skill-registrations/create-project-context/SKILL.md` | Shim template for create-project-context command |
| `templates/skill-registrations/create-ticket/SKILL.md` | Shim template for create-ticket command |
| `templates/skill-registrations/refine-ticket/SKILL.md` | Shim template for refine-ticket command |
| `templates/skill-registrations/dev-story/SKILL.md` | Shim template for dev-story command |

**Files to modify:**

| File | Change |
|------|--------|
| `src/core/installer.js` | Add `registerSkills()` method, insert into `run()` pipeline, update `printSummary()` |
| `src/core/path-resolver.js` | Add `skillTemplateDir` to returned object |

**Files to remove:**

| File | Reason |
|------|--------|
| `templates/skill-registrations/.gitkeep` | Replaced by actual skill template directories |

### Testing Standards Summary

**Manual Verification Commands (run from `create-scrum-workflow/` directory):**

```bash
# Verify skill template files are populated
find templates/skill-registrations -name "SKILL.md" | wc -l
# Expected: 4

# Verify each template contains the placeholder
grep -r "{{framework_path}}" templates/skill-registrations/
# Expected: 4 matches (one per SKILL.md)

# Verify YAML frontmatter is parseable
node -e "
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
const files = [
  'templates/skill-registrations/create-project-context/SKILL.md',
  'templates/skill-registrations/create-ticket/SKILL.md',
  'templates/skill-registrations/refine-ticket/SKILL.md',
  'templates/skill-registrations/dev-story/SKILL.md'
];
for (const f of files) {
  const content = readFileSync(f, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  const fm = yaml.load(match[1]);
  console.log(f, '->', fm.name, '|', fm.description.substring(0, 50) + '...');
}
"

# Fresh install to temp directory (non-interactive)
node bin/create-scrum-workflow.js install -y -d /tmp

# Verify skill directories created for claude-code (default platform)
ls /tmp/.claude/skills/create-project-context/SKILL.md
ls /tmp/.claude/skills/create-ticket/SKILL.md
ls /tmp/.claude/skills/refine-ticket/SKILL.md
ls /tmp/.claude/skills/dev-story/SKILL.md
# Expected: all 4 files exist

# Verify variable substitution occurred
grep "scrum_workflow" /tmp/.claude/skills/create-ticket/SKILL.md
# Expected: contains "scrum_workflow", NOT "{{framework_path}}"

# Verify no placeholder remains
grep "{{framework_path}}" /tmp/.claude/skills/create-ticket/SKILL.md
# Expected: no output (placeholder fully replaced)

# Verify YAML frontmatter name matches directory
node -e "
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
const content = readFileSync('/tmp/.claude/skills/create-ticket/SKILL.md', 'utf8');
const match = content.match(/^---\n([\s\S]*?)\n---/);
const fm = yaml.load(match[1]);
console.log('name:', fm.name, '| expected: create-ticket | match:', fm.name === 'create-ticket');
"

# Re-run to verify idempotent overwrite
node bin/create-scrum-workflow.js install -y -d /tmp
# Expected: no errors, skill files overwritten cleanly

# Cleanup
rm -rf /tmp/scrum_workflow /tmp/_scrum-output /tmp/.claude
```

### Previous Story Intelligence

**From Story 5.4 (Framework Copy) -- done:**
- `Installer` class exists in `src/core/installer.js` with `run()`, `checkExisting()`, `copyFramework()`, `createOutputDirs()`, `printSummary()`
- `path-resolver.js` returns `{ frameworkDir, outputDirs, platformDirs, templateSourceDir }`
- `platformDirs` is already computed as `Map<string, string>` mapping platform codes to absolute skill dir paths
- `fs-extra` must be imported as default: `import fse from 'fs-extra'` then destructure (CommonJS module in ESM context)
- Spinner pattern: `const s = spinner(); s.start(...); try { ... s.stop(...) } catch (err) { s.stop(...); throw err }`
- `install.js` sets `config.yes = options.yes === true` before passing to Installer

**From Story 5.2 (Platform Registry) -- done:**
- Registry entries include `target_dir` field (e.g., `.claude/skills`, `.cursor/skills`)
- `loadPlatformRegistry()` is synchronous (uses `readFileSync`)
- Used `fileURLToPath(import.meta.url)` + `dirname` + `join` for resolving co-located files

**From Story 5.1 (Scaffolding) -- done:**
- `templates/skill-registrations/` directory exists with only a `.gitkeep` placeholder
- Project structure has `src/core/` for pipeline modules
- All imports use `.js` file extensions

### Project Structure Notes

- `src/core/skill-registrar.js` is a new module following the simple exported function pattern (like `config-builder.js`), NOT a class. The Installer class wraps the call with spinner and pipeline orchestration.
- The 4 template directories in `templates/skill-registrations/` become part of the npm package (included via the `"files": ["templates/"]` whitelist in `package.json`).
- No new directories need to be created in `src/` -- `src/core/` already exists.
- No new npm dependencies -- `readFileSync` from `node:fs`, `replaceAll` from String prototype, and `ensureDirSync`/`writeFileSync` from `fs-extra` cover all needs.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.5] -- Acceptance criteria, story definition
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-5] -- Epic context, dependency map (5.5 depends on 5.2 and 5.4; depended on by 5.6)
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Skill-Registration-Pattern] -- Skill shim format with {{framework_path}} variable, SKILL.md content structure
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#The-Agent-Skills-Open-Standard] -- Required frontmatter fields (name, description), naming constraints, progressive disclosure
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Cross-Platform-Skill-Directory-Mapping] -- Platform directory paths used by platform registry
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Architectural-Patterns-and-Design] -- System architecture showing templates/skill-registrations/ location, installation pipeline Step 6
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Component-Inventory] -- 4 skill registrations with framework_path variable resolution
- [Source: _bmad-output/implementation-artifacts/5-4-framework-verbatim-copy-pipeline.md] -- Installer class, path-resolver, spinner/try-finally pattern, fs-extra ESM import pattern
- [Source: _bmad-output/implementation-artifacts/5-2-config-driven-platform-registry.md] -- Platform registry API, target_dir field, import.meta.url ESM pattern
- [Source: _bmad-output/implementation-artifacts/5-1-project-scaffolding-and-cli-entry-point.md] -- Project structure, templates/skill-registrations/ directory exists
- [Source: _bmad-output/planning-artifacts/architecture.md] -- Skill registration pattern in target project (.claude/skills/create-ticket/SKILL.md etc.)
- [Source: create-scrum-workflow/src/core/installer.js] -- Current Installer class, run() pipeline, spinner pattern
- [Source: create-scrum-workflow/src/core/path-resolver.js] -- Current path resolver, platformDirs computation
- [Source: create-scrum-workflow/package.json] -- Dependencies, files whitelist
- [Source: scrum_workflow/commands/create-project-context.md] -- Command purpose (for shim description)
- [Source: scrum_workflow/commands/create-ticket.md] -- Command purpose (for shim description)
- [Source: scrum_workflow/commands/refine-ticket.md] -- Command purpose (for shim description)
- [Source: scrum_workflow/commands/dev-story.md] -- Command purpose (for shim description)
