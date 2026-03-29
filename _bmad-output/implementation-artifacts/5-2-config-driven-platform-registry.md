# Story 5.2: Config-Driven Platform Registry

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want all supported AI coding platforms defined in a single YAML file,
So that adding a new platform requires only a YAML entry and zero code changes.

## Acceptance Criteria

1. **Given** the project scaffolding from Story 5.1 exists
   **When** the platform registry is created
   **Then** `src/platform/platform-registry.yaml` exists with entries for at least: `claude-code`, `cursor`, `windsurf`, `github-copilot`, `cline`, `agents-universal`

2. **And** each platform entry contains: `display_name`, `category` (cli/ide/universal), `target_dir` (e.g., `.claude/skills`), `skill_format: skill-md`

3. **And** `src/platform/platform-registry.js` exists with a function to load and parse the registry

4. **And** the registry loader returns a Map of platform objects keyed by platform code

5. **And** adding a new platform requires only adding a YAML entry — zero JavaScript changes (FR53)

6. **And** the registry includes `fallback_scan` arrays where applicable (e.g., Cursor scans `.claude/skills/` as fallback)

7. **And** `claude-code` is marked as `preferred: true` and `cross_compat_scan: true` since other platforms scan `.claude/skills/` (FR52)

## Tasks / Subtasks

- [x] Task 1: Create `src/platform/platform-registry.yaml` (AC: #1, #2, #6, #7)
  - [x] Subtask 1.1: Remove the `.gitkeep` placeholder from `src/platform/`
  - [x] Subtask 1.2: Create `platform-registry.yaml` with a top-level `platforms:` key
  - [x] Subtask 1.3: Add `claude-code` entry with `display_name: Claude Code`, `category: cli`, `target_dir: .claude/skills`, `skill_format: skill-md`, `preferred: true`, `cross_compat_scan: true`
  - [x] Subtask 1.4: Add `cursor` entry with `display_name: Cursor`, `category: ide`, `target_dir: .cursor/skills`, `skill_format: skill-md`, `fallback_scan: [.claude/skills, .agents/skills]`
  - [x] Subtask 1.5: Add `windsurf` entry with `display_name: Windsurf`, `category: ide`, `target_dir: .windsurf/skills`, `skill_format: skill-md`, `fallback_scan: [.claude/skills, .agents/skills]`
  - [x] Subtask 1.6: Add `github-copilot` entry with `display_name: GitHub Copilot`, `category: ide`, `target_dir: .github/skills`, `skill_format: skill-md`
  - [x] Subtask 1.7: Add `cline` entry with `display_name: Cline`, `category: ide`, `target_dir: .cline/skills`, `skill_format: skill-md`, `fallback_scan: [.claude/skills]`
  - [x] Subtask 1.8: Add `agents-universal` entry with `display_name: Universal (.agents/)`, `category: universal`, `target_dir: .agents/skills`, `skill_format: skill-md`, `note: Cross-platform convention, scanned by Cursor, Windsurf, Codex`

- [x] Task 2: Create `src/platform/platform-registry.js` (AC: #3, #4, #5)
  - [x] Subtask 2.1: Create the file using ES Module syntax (`import`/`export`)
  - [x] Subtask 2.2: Import `js-yaml` and `fs` (from `node:fs`) — use the `node:` protocol prefix for Node builtins
  - [x] Subtask 2.3: Import `url` from `node:url` and `path` from `node:path` to resolve the YAML file path relative to the module location using `import.meta.url`
  - [x] Subtask 2.4: Implement `loadPlatformRegistry()` function that reads `platform-registry.yaml` from the same directory using `new URL('./platform-registry.yaml', import.meta.url)` to resolve the path
  - [x] Subtask 2.5: Parse YAML content with `yaml.load()` from `js-yaml`
  - [x] Subtask 2.6: Convert the parsed `platforms` object into a `Map<string, object>` keyed by platform code (e.g., `'claude-code'` -> `{ display_name: 'Claude Code', ... }`)
  - [x] Subtask 2.7: Ensure each Map value includes the platform `code` property (the key itself) so consumers don't need to track it separately
  - [x] Subtask 2.8: Export `loadPlatformRegistry` as the primary named export

- [x] Task 3: Add convenience query helpers (AC: #5)
  - [x] Subtask 3.1: Add `getPlatform(registry, code)` — returns a single platform entry or `undefined`
  - [x] Subtask 3.2: Add `getPreferredPlatform(registry)` — returns the entry with `preferred: true` (claude-code)
  - [x] Subtask 3.3: Add `getPlatformsByCategory(registry, category)` — filters by category (`cli`, `ide`, `universal`)
  - [x] Subtask 3.4: Add `getPlatformCodes(registry)` — returns array of all platform code strings (useful for CLI validation and prompt choices)
  - [x] Subtask 3.5: Export all helpers as named exports from the same file

- [x] Task 4: Validation and smoke testing (AC: #1-#7)
  - [x] Subtask 4.1: Verify `platform-registry.yaml` parses without errors: `node -e "import('./src/platform/platform-registry.js').then(m => m.loadPlatformRegistry()).then(r => console.log(r))"`
  - [x] Subtask 4.2: Verify the Map has exactly 6 entries (claude-code, cursor, windsurf, github-copilot, cline, agents-universal)
  - [x] Subtask 4.3: Verify `claude-code` has `preferred: true` and `cross_compat_scan: true`
  - [x] Subtask 4.4: Verify `cursor` and `windsurf` have `fallback_scan` arrays containing `.claude/skills`
  - [x] Subtask 4.5: Verify all entries have the required fields: `display_name`, `category`, `target_dir`, `skill_format`
  - [x] Subtask 4.6: Add a new test platform entry to YAML, call `loadPlatformRegistry()` again, verify it appears in the Map without any JS changes — then remove the test entry

## Dev Notes

### Important: Separate Project Context

This story creates files inside `create-scrum-workflow/` (at the repository root), which is a **standalone project** completely independent from the `scrum_workflow/` framework directory. It has its own `package.json`, its own `node_modules/`, and zero shared code.

### Relevant Architecture Patterns and Constraints

**From Research: Config-Driven Platform Registry Design**

The research document provides the exact YAML structure to implement. The key architectural insight is that a single config-driven setup class + one YAML config per platform can achieve 22+ platform support with zero platform-specific code. Story 5.2 implements this pattern for scrum_workflow.

**Exact YAML structure from the research document:**

```yaml
platforms:
  claude-code:
    display_name: Claude Code
    category: cli
    target_dir: .claude/skills
    skill_format: skill-md
    preferred: true
    cross_compat_scan: true

  cursor:
    display_name: Cursor
    category: ide
    target_dir: .cursor/skills
    skill_format: skill-md
    fallback_scan: [.claude/skills, .agents/skills]

  windsurf:
    display_name: Windsurf
    category: ide
    target_dir: .windsurf/skills
    skill_format: skill-md
    fallback_scan: [.claude/skills, .agents/skills]

  github-copilot:
    display_name: GitHub Copilot
    category: ide
    target_dir: .github/skills
    skill_format: skill-md

  cline:
    display_name: Cline
    category: ide
    target_dir: .cline/skills
    skill_format: skill-md
    fallback_scan: [.claude/skills]

  agents-universal:
    display_name: Universal (.agents/)
    category: universal
    target_dir: .agents/skills
    skill_format: skill-md
    note: Cross-platform convention, scanned by Cursor, Windsurf, Codex
```

**From Research: Cross-Platform Compatibility Table**

| Platform | Primary Dir | Also Scans (Compat) |
|----------|------------|---------------------|
| Claude Code | `.claude/skills/` | `~/.claude/skills/`, plugins |
| Cursor | `.cursor/skills/` | `.claude/skills/`, `.codex/skills/` |
| Windsurf | `.windsurf/skills/` | `.agents/skills/`, `.claude/skills/` |
| GitHub Copilot | `.github/skills/` | `AGENTS.md`, `.github/instructions/` |
| Cline | `.cline/skills/` | `.clinerules/skills/`, `.claude/skills/` |

Key insight: `.claude/skills/` is scanned by Windsurf, Cursor, and Cline as fallback. Installing there alone covers 4+ platforms automatically.

**Code Style Conventions (from Story 5.1 implementation):**

- JavaScript ES Modules throughout (`import`/`export`, no `require`/`module.exports`)
- `picocolors` for terminal output (not chalk)
- Async functions for command handlers
- `node:` prefix for Node.js builtins (e.g., `node:fs`, `node:path`, `node:url`)
- File extensions required in imports (e.g., `./platform-registry.js`)

**Dependency: `js-yaml` is already installed** (listed in `package.json` dependencies from Story 5.1). No new dependencies needed.

### Critical Anti-Patterns to Avoid

1. **DO NOT hardcode platform paths in JavaScript** — all platform data must come from YAML only. The entire point of this story is zero-code extensibility.
2. **DO NOT use `require()`** — the project is `"type": "module"`, use ESM `import` everywhere.
3. **DO NOT use `__dirname`** — it does not exist in ESM. Use `import.meta.url` with `new URL()` to resolve paths relative to the module file.
4. **DO NOT add new npm dependencies** — `js-yaml` and `node:fs` are already available.
5. **DO NOT create a class** for the registry loader. Keep it as simple exported functions. Classes add unnecessary abstraction for what is just "read YAML, return Map".
6. **DO NOT import `fs-extra`** for reading the YAML file — use native `node:fs` `readFileSync`. `fs-extra` is for recursive directory copy operations in later stories.
7. **DO NOT use `yaml.load()` with untrusted input without schema** — in this case the YAML is bundled with the package, so `yaml.load()` with default schema is fine. Do NOT use `yaml.safeLoad()` (deprecated in js-yaml v4+).

### File Location Summary

**Files to create (all paths relative to `create-scrum-workflow/`):**

| File | Purpose |
|------|---------|
| `src/platform/platform-registry.yaml` | Platform definitions in YAML |
| `src/platform/platform-registry.js` | Loader function + query helpers |

**Files to remove:**

| File | Reason |
|------|--------|
| `src/platform/.gitkeep` | Replaced by actual content |

**Existing files NOT modified** — this story adds new files only, no changes to existing code.

### How This Story Connects to Downstream Stories

- **Story 5.3 (Interactive Prompts):** Will import `loadPlatformRegistry()` and `getPlatformCodes()` to populate the platform multi-select prompt with platform display names and codes.
- **Story 5.4 (Framework Copy):** Will import `getPlatform()` to look up `target_dir` for each selected platform when resolving installation paths.
- **Story 5.5 (Skill Registration):** Will iterate over selected platforms using the registry to determine where to copy skill shims (`.{platform}/skills/`).

### Testing Standards Summary

**Manual Verification Commands (run from `create-scrum-workflow/` directory):**

```bash
# Verify YAML parses correctly
node -e "import('js-yaml').then(y => { const fs = require('node:fs'); console.log(y.load(fs.readFileSync('src/platform/platform-registry.yaml', 'utf8'))) })"

# Verify module loads and returns Map
node -e "import('./src/platform/platform-registry.js').then(m => m.loadPlatformRegistry()).then(r => { console.log('Size:', r.size); console.log('Keys:', [...r.keys()]); console.log('Claude:', r.get('claude-code')) })"

# Verify preferred platform
node -e "import('./src/platform/platform-registry.js').then(m => m.loadPlatformRegistry().then(r => console.log('Preferred:', m.getPreferredPlatform(r))))"
```

**Acceptance Verification Checklist:**

- `platform-registry.yaml` contains 6 platform entries under `platforms:` key
- Each entry has `display_name`, `category`, `target_dir`, `skill_format`
- `claude-code` has `preferred: true` and `cross_compat_scan: true`
- `cursor` has `fallback_scan` containing `.claude/skills`
- `windsurf` has `fallback_scan` containing `.claude/skills`
- `cline` has `fallback_scan` containing `.claude/skills`
- `loadPlatformRegistry()` returns a Map with 6 entries
- Map keys are platform code strings
- Map values include the `code` property
- Adding a YAML entry and reloading shows the new platform (zero JS changes)
- All imports use ESM syntax and `.js` extensions
- No `__dirname` usage — only `import.meta.url`

### Previous Story Intelligence (Story 5.1)

Story 5.1 scaffolded the project successfully. Key learnings:
- The `src/platform/` directory exists with a `.gitkeep` placeholder
- `js-yaml` v4.1.0+ is installed (check: `yaml.load()` not `yaml.safeLoad()`)
- All existing code uses `import`/`export` ESM syntax
- Command handlers are simple async functions (not classes)
- `picocolors` imported as default: `import pc from 'picocolors'`
- The project root is `create-scrum-workflow/` at the repository root level

### Project Structure Notes

- Files go in `create-scrum-workflow/src/platform/` (already exists from 5.1 scaffolding)
- The `.gitkeep` in `src/platform/` should be removed since real files are being added
- No conflicts with existing code — this story adds new files only
- Naming convention follows the research document: `platform-registry.yaml` and `platform-registry.js` (kebab-case)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-5.2] — Acceptance criteria, story definition
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-5] — Epic context, story dependency map (5.2 has no dependencies, is depended on by 5.4 and 5.5)
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Config-Driven-Platform-Registry] — Exact YAML structure, platform table, cross-compatibility data
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Cross-Platform-Skill-Directory-Mapping] — Authoritative platform directory paths and fallback scan paths
- [Source: _bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md#Architectural-Patterns-and-Design] — System architecture showing `platform/` module location
- [Source: _bmad-output/implementation-artifacts/5-1-project-scaffolding-and-cli-entry-point.md] — Previous story, code patterns, project structure

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

No debug issues encountered. All verifications passed on first run.

### Completion Notes List

- Removed `src/platform/.gitkeep` placeholder (replaced by real files)
- Created `platform-registry.yaml` with 6 platform entries matching the research document spec exactly
- Created `platform-registry.js` with ES Module exports: `loadPlatformRegistry`, `getPlatform`, `getPreferredPlatform`, `getPlatformsByCategory`, `getPlatformCodes`
- Used `import.meta.url` + `fileURLToPath` + `dirname`/`join` from `node:path` for ESM-compatible path resolution
- Used `readFileSync` from `node:fs` (not `fs-extra`) per story constraints
- Used `yaml.load()` from `js-yaml` v4+ (not deprecated `safeLoad`)
- No new dependencies added -- `js-yaml` was already in `package.json` from Story 5.1
- Zero-code extensibility verified: added a test platform entry to YAML, confirmed it appeared in the Map without any JS changes, then removed the test entry
- All 7 acceptance criteria verified through automated smoke tests

### File List

- `create-scrum-workflow/src/platform/platform-registry.yaml` (created)
- `create-scrum-workflow/src/platform/platform-registry.js` (created)
- `create-scrum-workflow/src/platform/.gitkeep` (removed)
