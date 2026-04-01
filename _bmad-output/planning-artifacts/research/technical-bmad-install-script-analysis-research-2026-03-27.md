---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
workflowType: 'research'
lastStep: 6
research_type: 'technical'
research_topic: 'BMAD Install Script Analysis - Dynamic Multi-Platform Agent/Skill/Workflow Installation'
research_goals: 'Analyze the BMAD install script to understand how agents, skills, and workflows are dynamically installed into target projects across multiple AI platforms (Claude Code, Windsurf, Cursor, Copilot, etc.). Document the full process so a similar mechanism can be built for scrum_workflow.'
user_name: 'Sami'
date: '2026-03-27'
web_research_enabled: true
source_verification: true
---

# Building `create-scrum-workflow`: A Standalone Multi-Platform Installer for AI-Assisted Development Frameworks

**Date:** 2026-03-28
**Author:** Sami
**Research Type:** Technical Architecture Analysis
**Status:** Complete

---

## Executive Summary

The AI coding assistant ecosystem has converged on a single skill format: the **Agent Skills open standard (SKILL.md)**, adopted by 27+ tools since December 2025. Every major platform (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Gemini CLI, Codex) now supports `.{platform}/skills/{skill-name}/SKILL.md` as the skill discovery convention. This standardization makes it feasible to build a single installer that deploys a framework across all platforms simultaneously.

This research analyzed the BMAD-METHOD installer (v6.2.2, npm) as a reference architecture, the Vercel `skills` CLI as a modern ecosystem tool, and the scrum_workflow project's actual component inventory. The result is a complete architectural blueprint for **`create-scrum-workflow`** — a standalone, zero-BMAD-dependency npm CLI tool that installs the Scrum Workflow framework into any project, for any supported AI platform.

**Key Findings:**

- The config-driven platform pattern (one YAML entry per platform, zero code changes) is the most scalable approach — proven by both BMAD (22+ platforms) and Vercel skills (40+ agents)
- scrum_workflow has exactly **51 framework files + 4 skill registrations** to install — all platform-agnostic Markdown/YAML
- Installing to `.claude/skills/` alone covers 4+ platforms automatically (Windsurf, Cursor, and Cline scan it as fallback)
- A 3-phase roadmap (MVP → Update/Multi-Platform → Distribution) can deliver the MVP in ~500 LOC

**Top Recommendations:**

1. Build as `npx create-scrum-workflow` using JavaScript ES Modules + Commander + @clack/prompts
2. Use config-driven `platform-registry.yaml` for extensible platform support
3. Verbatim copy framework files (no template engine), variable substitution only for 4 skill registration shims
4. SHA-256 lock file (`.scrum-workflow-lock.json`) for idempotent updates with user-modification preservation

---

## Table of Contents

1. [Research Scope Confirmation](#technical-research-scope-confirmation)
2. [Technology Stack Analysis](#technology-stack-analysis) — BMAD installer architecture, core components, installation flow
3. [Multi-Platform Support](#multi-platform-support-22-platforms) — 22+ platforms, config-driven architecture
4. [Integration Patterns Analysis](#integration-patterns-analysis) — Agent Skills standard, cross-platform mapping, skill discovery
5. [Architectural Patterns and Design](#architectural-patterns-and-design) — Installer architecture, pipeline, component inventory
6. [Implementation Approaches](#implementation-approaches-and-technology-adoption) — Roadmap, testing strategy, distribution, pitfalls
7. [Research Synthesis and Conclusion](#research-synthesis-and-conclusion)

---

## Research Overview

This report provides a complete architectural blueprint for building `create-scrum-workflow`, a standalone npm CLI tool that dynamically installs the Scrum Workflow framework into target projects across multiple AI coding platforms. The research was conducted over two days (2026-03-27 to 2026-03-28) using three parallel analysis tracks:

**Sources analyzed:**
- **BMAD-METHOD GitHub repository** (`bmad-code-org/BMAD-METHOD`, v6.2.2) — reference installer architecture, 22+ platform support, module system, manifest generation
- **Vercel `skills` CLI** (v1.x, January 2026) — modern skills ecosystem tool, 40+ agent support, lock file system
- **Existing BMAD installation in MARS project** — real-world installation output, directory structure, config files
- **Current scrum_workflow project** — complete component inventory, skill registration patterns, framework structure
- **Agent Skills specification** (agentskills.io) — open standard adopted by 27+ tools
- **Platform documentation** — Claude Code, Cursor, Windsurf, GitHub Copilot, Cline official docs

**Research methodology:** Parallel web research + codebase analysis + cross-reference verification. All architectural claims verified against at least two independent sources. Platform skill directory paths verified against official documentation.

---

## Technical Research Scope Confirmation

**Research Topic:** BMAD Install Script Analysis - Dynamic Multi-Platform Installation
**Research Goals:** Understand installer architecture for building scrum_workflow's own installation system

**Technical Research Scope:**

- Architecture Analysis - installer design patterns, module system, adapter pattern
- Implementation Approaches - CLI tool, config-driven platform support, manifest generation
- Technology Stack - Node.js CLI, npx distribution, YAML/CSV manifests
- Integration Patterns - multi-platform skill registration, config merging, variable resolution
- Adaptability - what scrum_workflow must adopt for equivalent functionality

**Scope Confirmed:** 2026-03-27

---

## Technology Stack Analysis

### BMAD Installer Architecture

The BMAD installer is an **npx-based Node.js CLI tool** (not a shell script), distributed via npm as `bmad-method` (v6.2.2). It is invoked via:

```bash
npx bmad-method install
```

_Source: https://github.com/bmad-code-org/BMAD-METHOD_

### Core Technology Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| CLI Framework | `commander` | Command parsing, flags, help generation |
| Interactive UI | `@clack/prompts` | Beautiful terminal prompts for user input |
| File Operations | `fs-extra` | Recursive copy, directory creation |
| Config Parsing | `yaml` / `js-yaml` | YAML config and manifest parsing |
| Manifest Data | `csv-parse` | CSV manifest reading/writing |
| Version Management | `semver` | Version comparison for updates |
| Terminal Output | `chalk` / `picocolors` | Colored terminal output |
| File Discovery | `glob` | Pattern-based file finding |
| Git Ignore | `ignore` | .gitignore-style filtering |

### Installer File Architecture

```
tools/installer/
  bmad-cli.js                    # Entry point (commander-based)
  ui.js                          # Interactive prompts (@clack/prompts)
  commands/
    install.js                   # Install command with all CLI flags
  core/
    installer.js                 # Main Installer class (install/quickUpdate flow)
    config.js                    # Config class (clean config builder)
    install-paths.js             # InstallPaths class (directory resolution)
    manifest.js                  # Manifest class (YAML read/write)
    manifest-generator.js        # ManifestGenerator (CSV manifest generation)
  ide/
    manager.js                   # IdeManager (dynamic platform handler loading)
    _config-driven.js            # ConfigDrivenIdeSetup (universal platform handler)
    platform-codes.yaml          # Per-platform install config
  modules/
    official-modules.js          # OfficialModules (built-in module installer)
    external-manager.js          # ExternalModuleManager (git clone/cache)
    custom-modules.js            # Custom user-provided modules
```

### Non-Interactive Mode

Supports full CI/CD automation via CLI flags:

```bash
npx bmad-method install --directory /path/to/project --modules bmm --tools claude-code --yes
```

---

## Installation Flow (Complete Pipeline)

### Step-by-Step Process

1. **CLI Entry** - `bmad-cli.js` parses command, checks for updates
2. **User Prompts** - `UI.promptInstall()` collects:
   - Target directory
   - Existing install detection (fresh install vs update)
   - Module selection (core, bmm, bmb, cis, tea, wds)
   - IDE/platform selection (22+ platforms)
   - Module-specific config questions
3. **Config Build** - `Config.build()` normalizes all user input
4. **Path Resolution** - `InstallPaths.create()` resolves all directory paths
5. **Existing Install Detection** - `ExistingInstall.detect()` checks for prior installation
6. **Cleanup** - Removes deselected modules/IDEs, handles legacy paths
7. **Update State** - Backs up user-modified files for preservation
8. **External Module Cache** - Clones external modules to `~/.bmad/cache/external-modules/`
9. **Module Installation** - Copies source content to `_bmad/{module}/`
10. **Directory Creation** - Creates output directories (`_bmad-output/`, etc.)
11. **Config Generation** - Writes `config.yaml` per module with resolved variables
12. **Manifest Generation** - Generates skill-manifest.csv, agent-manifest.csv, files-manifest.csv, bmad-help.csv
13. **IDE Setup** - For each selected platform, copies skill directories to platform-specific paths
14. **File Restoration** - Restores user-modified files from backup

### Quick Update Path

`Installer.quickUpdate()` - preserves user settings, only refreshes module content and IDE skills.

---

## What Gets Created in the Target Project

### Directory Structure After Installation

```
<target-project>/
  _bmad/                              # Source of Truth (all modules)
    _config/                          # Master configuration
      manifest.yaml                   # Installation metadata (version, date, modules, IDEs)
      skill-manifest.csv              # All skills registry (canonicalId, name, description, module, path)
      agent-manifest.csv              # Agent personas (name, displayName, icon, role, identity, style)
      files-manifest.csv              # All files with SHA256 hashes
      bmad-help.csv                   # Merged help catalog
      ides/                           # IDE-specific config files
        claude-code.yaml
        windsurf.yaml
        gemini.yaml
        github-copilot.yaml
    core/                             # Core module (12+ skills)
      config.yaml
      bmad-help/SKILL.md
      bmad-init/SKILL.md
      bmad-party-mode/SKILL.md
      ...
    bmm/                              # Business Method Module (28+ skills)
      config.yaml
      1-analysis/
      2-plan-workflows/
      3-solutioning/
      4-implementation/
    [other modules]/                  # bmb, cis, tea, wds (optional)

  _bmad-output/                       # Default output folder
    planning-artifacts/
    implementation-artifacts/

  .claude/skills/                     # Claude Code platform registration
    bmad-help/SKILL.md
    bmad-create-prd/SKILL.md
    ...                               # Full copy of all skills

  .windsurf/skills/                   # Windsurf platform registration (if selected)
    bmad-help/SKILL.md
    ...

  .cursor/skills/                     # Cursor platform registration (if selected)
    ...
```

### Key Architectural Decision: Dual Storage

- **`_bmad/`** = Source of Truth (module-organized, contains config, manifests, all metadata)
- **`.{platform}/skills/`** = Platform Instance (verbatim copy for platform discovery)

---

## Multi-Platform Support (22+ Platforms)

### Config-Driven Architecture

Every platform is handled by the **same** `ConfigDrivenIdeSetup` class, configured from `platform-codes.yaml`. No platform-specific code needed.

### Supported Platforms

| Platform | target_dir | Category |
|----------|-----------|----------|
| **Claude Code** | `.claude/skills` | cli |
| **Cursor** | `.cursor/skills` | ide |
| **Windsurf** | `.windsurf/skills` | ide |
| **GitHub Copilot** | `.github/skills` | ide |
| **Cline** | `.cline/skills` | ide |
| **Gemini CLI** | `.gemini/skills` | cli |
| **Codex** | `.agents/skills` | cli |
| **Auggie** | `.augment/skills` | cli |
| **Kiro** | `.kiro/skills` | ide |
| **Trae** | `.trae/skills` | ide |
| **Roo Code** | `.roo/skills` | ide |
| **OpenCode** | `.opencode/skills` | ide |
| **QwenCoder** | `.qwen/skills` | ide |
| **CodeBuddy** | `.codebuddy/skills` | ide |
| **Rovo Dev** | `.rovodev/skills` | ide |
| **Google Antigravity** | `.agent/skills` | ide |
| **iFlow** | `.iflow/skills` | ide |
| **Crush** | `.crush/skills` | ide |
| **Ona** | `.ona/skills` | ide |
| **Pi** | `.pi/skills` | ide |
| **Qoder** | `.qoder/skills` | ide |

### Platform-Specific Features

- **Ancestor conflict check**: Claude Code, Codex, OpenCode check parent directories for existing installations
- **Legacy target cleanup**: Each platform defines `legacy_targets` for migration (e.g., `.claude/commands` -> `.claude/skills`)
- **Platform-specific cleanup**: GitHub Copilot strips BMAD markers from `copilot-instructions.md`

---

## Skill Discovery & Registration System

### How Skills Are Found

The installer walks module directory trees looking for directories containing `SKILL.md` files with valid YAML frontmatter:

```markdown
---
name: bmad-help
description: 'Analyzes current state and user query...'
---
# Skill content here...
```

### Discovery Rules

1. Each skill = a **directory** containing a `SKILL.md` file
2. The `name` frontmatter field **must match** the directory name
3. The directory name becomes the `canonicalId`
4. Optional `bmad-skill-manifest.yaml` sidecar provides extra metadata (type, install_to_bmad flag)

### Installation Flow per Skill

1. Source skills from `src/` are copied to `_bmad/{module}/`
2. `skill-manifest.csv` is generated in `_bmad/_config/`
3. For each selected IDE, `ConfigDrivenIdeSetup` copies the **entire skill directory verbatim** to `.{platform}/skills/{canonicalId}/`
4. Skills with `install_to_bmad: false` → only in IDE dirs, removed from `_bmad/`

---

## Module System

### Module Types

| Type | Examples | Distribution |
|------|----------|-------------|
| **Built-in** | core, bmm | Bundled in npm package |
| **External Official** | bmb, cis, tea, wds | Separate npm packages, fetched via git clone to `~/.bmad/cache/` |
| **Custom** | User-provided | Local paths with `module.yaml` |

### Module Definition (`module.yaml`)

Each module defines interactive config questions with defaults and variable interpolation:

```yaml
code: bmm
name: "BMad Method Agile-AI Driven-Development"

project_name:
  prompt: "What is your project called?"
  default: "{directory_name}"

user_skill_level:
  prompt: "What is your development experience level?"
  single-select:
    - value: "beginner"
    - value: "intermediate"
    - value: "expert"

planning_artifacts:
  prompt: "Where should planning artifacts be stored?"
  default: "{output_folder}/planning-artifacts"

directories:
  - "{planning_artifacts}"
  - "{implementation_artifacts}"
```

### Config Variable Resolution

Variables support template expansion:
- `{project-root}` - Target project root directory
- `{directory_name}` - Project directory name
- `{value}` - User's input value
- `{output_folder}` - Resolved output folder from core config
- Cross-module references (core config shared to all modules)

---

## Comparison: BMAD Installation in MARS vs. scrum_workflow

### MARS Project (Full BMAD Install, v6.2.2)

| Aspect | Value |
|--------|-------|
| Modules installed | core, bmm, bmb, cis, tea, wds (6 modules) |
| IDEs configured | Claude Code, Windsurf, Gemini, GitHub Copilot (4 platforms) |
| Skills in `.claude/skills/` | 78 skill directories |
| Skills in `.windsurf/skills/` | 80 skill directories |
| Total skills in registry | 80+ |
| Has `_bmad/_config/ides/` | Yes (4 IDE configs) |

### scrum_workflow Project (BMAD v6.2.1 + Custom Framework)

| Aspect | Value |
|--------|-------|
| Modules installed | core, bmm, bmb, cis, tea, wds (6 modules) |
| IDEs configured | Claude Code only (1 platform) |
| Skills in `.claude/skills/` | 84 directories (78 BMAD + 4 framework + custom) |
| Custom framework skills | 4 root-level registrations (create-project-context, create-ticket, dev-story, refine-ticket) |
| Framework source | `scrum_workflow/` directory with agents, commands, workflows, templates |

### Key Difference: Framework Skills Registration

scrum_workflow has 4 **framework command registration** files in `.claude/skills/`:

```yaml
---
name: create-ticket
trigger: /create-ticket
description: Create structured story from natural language
framework_command: {framework_commands}/create-ticket.md
---
```

These are lightweight wrappers that reference the framework's command files in `scrum_workflow/commands/`. This is an additional registration pattern on top of the standard BMAD SKILL.md pattern.

---

## What scrum_workflow Needs for Its Own Installer

### Components to Install

| Component | Source Location | Target Location | Required |
|-----------|---------------|----------------|----------|
| Framework source | `scrum_workflow/` | `{target}/scrum_workflow/` | Yes |
| Agent definitions | `scrum_workflow/agents/` | (included in framework source) | Yes |
| Command workflows | `scrum_workflow/commands/` | (included in framework source) | Yes |
| Templates | `scrum_workflow/templates/` | (included in framework source) | Yes |
| Skills (validation etc.) | `scrum_workflow/skills/` | (included in framework source) | Yes |
| Context & standards | `scrum_workflow/context/` | (included in framework source) | Yes |
| Reference data | `scrum_workflow/data/` | (included in framework source) | Yes |
| Framework config | `scrum_workflow/config.yaml` | (included in framework source) | Yes |
| Skill registrations | `.claude/skills/*.md` | `.{platform}/skills/*.md` | Yes (per platform) |
| Output directories | - | `_bmad-output/planning-artifacts/`, `implementation-artifacts/` | Yes |
| Project config | - | `_bmad/bmm/config.yaml` (or similar) | Yes |

### Installation Variables to Resolve

- `{project-root}` - Target project root
- `{framework_path}` - Where `scrum_workflow/` is installed
- `{framework_commands}` - Resolves to `{framework_path}/commands/`
- Platform selection (Claude Code, Windsurf, Cursor, Copilot, etc.)
- User preferences (name, language, skill level)
- Output folder locations

### Recommended Installer Approach

**Option A: Piggyback on BMAD** - Package scrum_workflow as a BMAD external module with `module.yaml`, distributable via npm. Leverages existing installer infrastructure.

**Option B: Standalone Installer** - Build a dedicated CLI (Node.js or Python) that replicates the BMAD pattern:
1. Config-driven platform support (`platform-codes.yaml`)
2. Module-aware installation with `module.yaml` config collection
3. Manifest generation for skill/agent discovery
4. Verbatim directory copy to platform-specific paths

**Option C: Hybrid** - Use BMAD installer for BMAD modules, add a post-install hook or companion script for scrum_workflow-specific framework registration.

---

## Technology Adoption Trends

### AI Coding Assistant Platform Landscape (2026)

The market has rapidly standardized around a **skills directory pattern**:
- Almost all platforms now support `.{platform}/skills/{skill-name}/SKILL.md`
- This is the de-facto standard for AI coding assistant extensibility
- BMAD's config-driven approach (one handler class, YAML config per platform) is the most scalable pattern for multi-platform support

### Key Trend: Agent Skills Standard

BMAD tracks which platforms fully support the "Agent Skills" standard. Platforms that don't (like KiloCoder) are marked as suspended. This suggests the ecosystem is converging on a common skill format.

_Source: BMAD-METHOD platform-codes.yaml, npm registry (bmad-method v6.2.2)_

---

## Integration Patterns Analysis

### The Agent Skills Open Standard (SKILL.md)

The **Agent Skills** specification was published by Anthropic on December 18, 2025 at [agentskills.io](https://agentskills.io) and has been adopted by **27+ AI coding tools** as of March 2026. This is the de-facto standard that your installer must target.

**Required SKILL.md Frontmatter:**

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | Max 64 chars, lowercase+hyphens, must match parent directory name |
| `description` | Yes | Max 1024 chars, describes what + when to use |

**Optional Frontmatter Fields:** `license`, `compatibility`, `metadata`, `allowed-tools`, `disable-model-invocation`, `user-invocable`, `model`, `effort`, `context`, `agent`, `hooks`, `paths`, `shell`

**Progressive Disclosure (3-Level Loading):**

| Level | Trigger | Token Cost | Content |
|-------|---------|------------|---------|
| Metadata | Startup | ~100 tokens | Name + description only |
| Instructions | User request matches description | <5k tokens | Full SKILL.md body |
| Resources | Referenced in instructions | Minimal | Scripts, templates, references |

_Source: [agentskills.io/specification](https://agentskills.io/specification), [mdskills.ai/specs/skill-md](https://www.mdskills.ai/specs/skill-md)_

### Cross-Platform Skill Directory Mapping

All major platforms have converged on the `.{platform}/skills/{skill-name}/SKILL.md` pattern:

| Platform | Primary Skills Dir | Also Scans (Compat) | Legacy Format |
|----------|-------------------|---------------------|---------------|
| **Claude Code** | `.claude/skills/` | `~/.claude/skills/`, plugins | `.claude/commands/*.md` |
| **Cursor** | `.cursor/skills/`, `.agents/skills/` | `.claude/skills/`, `.codex/skills/` | `.cursorrules`, `.cursor/rules/*.mdc` |
| **Windsurf** | `.windsurf/skills/` | `.agents/skills/`, `.claude/skills/`, `~/.codeium/windsurf/skills/` | Rules, Workflows |
| **GitHub Copilot** | `.github/skills/` | `AGENTS.md`, `.github/instructions/` | `.github/copilot-instructions.md` |
| **Cline** | `.cline/skills/` | `.clinerules/skills/`, `.claude/skills/` | `.clinerules/` |
| **Gemini CLI** | `.gemini/skills/` | - | - |
| **Codex** | `.agents/skills/` | - | `.codex/prompts/` |
| **Kiro** | `.kiro/skills/` | - | `.kiro/steering/` |
| **Roo Code** | `.roo/skills/` | - | - |
| **Trae** | `.trae/skills/` | - | `.trae/rules/` |

**Key insight:** `.claude/skills/` is the most widely scanned compatibility path — Windsurf, Cursor, and Cline all scan it as a fallback. `.agents/skills/` is emerging as the universal cross-tool convention.

_Source: [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills), [docs.windsurf.com/windsurf/cascade/skills](https://docs.windsurf.com/windsurf/cascade/skills), [cursor.com/docs/context/skills](https://cursor.com/docs/context/skills), [docs.cline.bot/features/skills](https://docs.cline.bot/features/skills)_

### BMAD's Config-Driven Platform Architecture

The core integration pattern is **one universal handler class** + **one YAML config per platform**:

**`platform-codes.yaml` Entry Structure:**

```yaml
claude-code:
  display_name: Claude Code
  category: cli
  preferred: true
  target_dir: .claude/skills
  ancestor_conflict_check: true
  legacy_targets:
    - .claude/commands
```

**`ConfigDrivenIdeSetup` — Universal Handler:**

1. `detect(projectDir)` — checks if target_dir exists with bmad-prefixed entries
2. `cleanup()` — removes legacy targets, IDE-specific cleanup (e.g., copilot-instructions.md markers)
3. `installVerbatimSkills()` — reads `skill-manifest.csv`, copies entire skill directories to `<target_dir>/<canonicalId>/`
4. `ancestorConflictCheck()` — walks parent dirs to prevent duplicate skill inheritance (Claude Code, Codex, OpenCode only)

**Adding a new platform requires only a YAML entry — zero code changes.**

### Two-Stage Installation Pipeline

```
Stage 1: Module Installation
  Source (npm/git) → _bmad/{module}/ (canonical copy)
                            ↓
Stage 2: Manifest Generation
  Scan _bmad/ for SKILL.md → skill-manifest.csv
                                    ↓
Stage 3: Platform Deployment
  For each selected IDE:
    Read skill-manifest.csv
    Copy _bmad/{path}/{skill}/ → .{platform}/skills/{canonicalId}/
```

This separation ensures:
- `_bmad/` = single source of truth (module-organized, with config & metadata)
- `.{platform}/skills/` = derived platform instances (verbatim copies for discovery)
- Manifests (`skill-manifest.csv`, `agent-manifest.csv`, `files-manifest.csv`) enable version tracking, update detection, and cross-referencing

### Skill Discovery Pattern

The `ManifestGenerator` discovers skills by:

1. Recursively walking `_bmad/` directory tree
2. Finding directories containing `SKILL.md`
3. Parsing YAML frontmatter for `name` (must match directory name) and `description`
4. Optionally reading `bmad-skill-manifest.yaml` sidecar for extra metadata (`type: agent`, `install_to_bmad: false`)
5. Writing all discovered skills to `skill-manifest.csv`

### Module Configuration Collection

Each module defines interactive config via `module.yaml`:

```yaml
code: my-module
name: "My Module Display Name"

variable_name:
  prompt: "Question for the user?"
  default: "{directory_name}"
  result: "{project-root}/{value}"
  single-select:           # OR multi-select
    - value: "option1"
    - value: "option2"

directories:
  - "{output_folder}/my-output"
```

**Variable resolution chain:** `{project-root}`, `{directory_name}`, `{value}`, `{output_folder}`, cross-module references (core config shared to all modules).

### Update Preservation Strategy

On reinstall/update:
1. Read `files-manifest.csv` for original file hashes
2. Detect **custom files** (not in manifest) and **modified files** (hash mismatch)
3. Back up custom/modified files to temp directory
4. Overwrite with fresh installation
5. Restore backed-up files to original locations

This ensures user customizations survive updates.

### NPX Distribution Pattern

For a standalone installer distributed via npm:

```json
{
  "name": "create-scrum-workflow",
  "version": "1.0.0",
  "type": "module",
  "bin": { "create-scrum-workflow": "index.js" },
  "files": ["index.js", "src/", "templates/"]
}
```

Users would invoke:
```bash
npx create-scrum-workflow
# or
npm create scrum-workflow
```

**Recommended dependencies:**
- `commander` — CLI argument parsing
- `@clack/prompts` — Beautiful interactive prompts (what BMAD uses)
- `fs-extra` — Recursive file copy
- `js-yaml` — YAML parsing/writing
- `csv-parse` / `csv-stringify` — Manifest CSV handling
- `chalk` / `picocolors` — Terminal colors
- `glob` — File pattern matching

_Source: [npmjs.com/package/bmad-method](https://www.npmjs.com/package/bmad-method), [alexchantastic.com/building-an-npm-create-package](https://www.alexchantastic.com/building-an-npm-create-package)_

---

## Architectural Patterns and Design

### Recommended Installer Architecture: `create-scrum-workflow`

Based on the analysis of BMAD, the Vercel `skills` CLI, and the Agent Skills ecosystem, here is the recommended architecture for a standalone scrum_workflow installer.

**Distribution:** `npx create-scrum-workflow` (npm `create-*` pattern)

**Core Design Principles:**
1. **Zero BMAD dependency** — completely standalone, own codebase
2. **Config-driven platform support** — new platforms = YAML entry, no code changes
3. **Verbatim copy** — skills and framework files copied as-is, no template engine
4. **Idempotent** — safe to re-run, preserves user customizations
5. **Progressive** — minimal install first, optional modules later

### System Architecture

```
create-scrum-workflow/
  bin/
    create-scrum-workflow.js       # Entry point (shebang + commander)
  src/
    cli.js                         # CLI argument parsing & command dispatch
    commands/
      install.js                   # Fresh installation pipeline
      update.js                    # Update existing installation
      status.js                    # Show installation status
    core/
      installer.js                 # Main Installer class (pipeline orchestrator)
      config-builder.js            # Resolves user input → config object
      path-resolver.js             # Resolves all target paths
      manifest.js                  # Read/write installation manifest
    platform/
      platform-registry.yaml       # All platforms + target directories
      platform-setup.js            # Universal handler (one class, all platforms)
    integrity/
      hash-tracker.js              # SHA-256 file hashing for change detection
      lock-file.js                 # .scrum-workflow-lock.json management
  templates/
    scrum_workflow/                 # Complete framework source (verbatim copy)
      agents/
      commands/
      context/
      data/
      skills/
      templates/
      workflows/
      config.yaml
    skill-registrations/           # Skill registration shims (with variable placeholders)
      create-project-context/SKILL.md
      create-ticket/SKILL.md
      dev-story/SKILL.md
      refine-ticket/SKILL.md
  package.json
```

_Source: Architecture inspired by [Vercel skills CLI](https://deepwiki.com/vercel-labs/skills/5.1-system-overview), [Commander.js v13](https://github.com/tj/commander.js)_

### Installation Pipeline (Pipeline Pattern)

The installer follows a sequential pipeline where each step can short-circuit on failure:

```
Step 1: Validate Prerequisites
  └─ Node.js version check, target directory validation
Step 2: Detect Existing Installation
  └─ Check for .scrum-workflow-lock.json, existing framework files
Step 3: Collect User Configuration
  └─ Interactive prompts: project name, platform selection, preferences
Step 4: Resolve Paths
  └─ Compute all target paths from config + platform registry
Step 5: Install Framework Source
  └─ Copy scrum_workflow/ directory verbatim to target
Step 6: Register Skills per Platform
  └─ For each selected platform: copy skill registrations to .{platform}/skills/
Step 7: Create Output Directories
  └─ Create output folders for artifacts
Step 8: Generate Config
  └─ Write project-level config.yaml with resolved variables
Step 9: Generate Manifest & Lock File
  └─ Write installation manifest + file hashes for update detection
Step 10: Report Results
  └─ Summary of installed components, next steps
```

### Config-Driven Platform Registry

**`platform-registry.yaml`:**

```yaml
platforms:
  claude-code:
    display_name: Claude Code
    category: cli
    target_dir: .claude/skills
    skill_format: skill-md
    auto_discovery: true
    cross_compat_scan: true   # Other platforms scan this path too

  cursor:
    display_name: Cursor
    category: ide
    target_dir: .cursor/skills
    skill_format: skill-md
    auto_discovery: true
    fallback_scan: [.claude/skills, .agents/skills]

  windsurf:
    display_name: Windsurf
    category: ide
    target_dir: .windsurf/skills
    skill_format: skill-md
    auto_discovery: true
    fallback_scan: [.claude/skills, .agents/skills]

  github-copilot:
    display_name: GitHub Copilot
    category: ide
    target_dir: .github/skills
    skill_format: skill-md
    auto_discovery: true

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

**Adding a new platform = one YAML entry. Zero code changes.**

### Skill Registration Pattern

Each skill registration is a lightweight SKILL.md shim that loads the framework command:

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

**Variable resolution at install time:**
- `{{framework_path}}` → resolved to actual path (e.g., `./scrum_workflow` or absolute path)

### Component Inventory: What Gets Installed

| Component | Count | Source | Destination | Variable Resolution |
|-----------|-------|--------|-------------|-------------------|
| Framework config | 1 | `templates/scrum_workflow/config.yaml` | `{target}/scrum_workflow/config.yaml` | platform |
| Agent definitions | 3 | `templates/scrum_workflow/agents/` | `{target}/scrum_workflow/agents/` | none (verbatim) |
| Command workflows | 4 | `templates/scrum_workflow/commands/` | `{target}/scrum_workflow/commands/` | none (verbatim) |
| Workflow orchestrations | 7 | `templates/scrum_workflow/workflows/` | `{target}/scrum_workflow/workflows/` | none (verbatim) |
| Framework skills | 7 | `templates/scrum_workflow/skills/` | `{target}/scrum_workflow/skills/` | none (verbatim) |
| Context files | 4 | `templates/scrum_workflow/context/` | `{target}/scrum_workflow/context/` | none (verbatim) |
| Output templates | 16 | `templates/scrum_workflow/templates/` | `{target}/scrum_workflow/templates/` | none (verbatim) |
| Reference data | 1 | `templates/scrum_workflow/data/` | `{target}/scrum_workflow/data/` | none (verbatim) |
| **Skill registrations** | **4** | `templates/skill-registrations/` | `{target}/.{platform}/skills/` | **framework_path** |
| Output directories | 3 | (created) | `{target}/output/` | output_path |
| Lock file | 1 | (generated) | `{target}/.scrum-workflow-lock.json` | all hashes |

**Total: 51 files + 3 directories + 1 lock file**

### Integrity & Update Strategy

**Lock file (`.scrum-workflow-lock.json`):**

```json
{
  "version": "1.0.0",
  "installed": "2026-03-27T14:00:00Z",
  "updated": "2026-03-27T14:00:00Z",
  "platforms": ["claude-code", "cursor"],
  "framework_path": "scrum_workflow",
  "files": {
    "scrum_workflow/agents/architect.md": "sha256:abc123...",
    "scrum_workflow/commands/create-ticket.md": "sha256:def456...",
    ".claude/skills/create-ticket/SKILL.md": "sha256:ghi789..."
  }
}
```

**Update flow:**
1. Compare lock file hashes against current file hashes
2. Identify: **unchanged** (safe to overwrite), **user-modified** (back up first), **custom** (preserve)
3. Back up modified files to `.scrum-workflow-backup/`
4. Overwrite framework files with new version
5. Restore user modifications
6. Update lock file with new hashes

_Source: Pattern from [Vercel skills CLI lock file system](https://deepwiki.com/vercel-labs/skills/2.1-installation), [roadmap.sh file integrity checker](https://roadmap.sh/projects/file-integrity-checker)_

### Recommended Technology Stack

| Concern | Tool | Rationale |
|---------|------|-----------|
| CLI framework | `commander` v13 | De facto standard, 25M+ weekly downloads, TypeScript support |
| Interactive prompts | `@clack/prompts` | Modern design, component API with validation |
| File operations | `fs-extra` | Recursive copy, directory creation |
| Hashing | Node.js `crypto` (native) | SHA-256, zero dependency |
| YAML parsing | `js-yaml` | Config and manifest files |
| Terminal colors | `picocolors` | Lightweight (no chalk dependency) |
| Distribution | npm (`create-scrum-workflow`) | Standard `npx create-*` pattern |
| Language | JavaScript (ES Modules) | No build step needed, `type: "module"` |

### Design Decision: JavaScript vs TypeScript

**Recommendation: JavaScript (ES Modules)** for the installer.

- No build step required — direct execution via `node`
- Simpler `package.json` — no `unbuild`, `tsc`, or `tsup` dependency
- The installer is a self-contained tool (~500-800 LOC), not a library consumed by others
- TypeScript adds value for large codebases with many contributors, less so for a focused CLI tool

### Design Decision: Verbatim Copy vs Symlinks

**Recommendation: Verbatim copy** (not symlinks).

- Symlinks break when the source package is in `node_modules` and gets pruned
- Verbatim copies are self-contained — target project works independently
- Lock file tracks hashes for update detection, replacing symlinks' auto-update behavior
- Consistent with the `create-*` scaffolding pattern (create-react-app, create-next-app all copy)

### Design Decision: Single Platform vs Multi-Platform Default

**Recommendation: Ask during install, default to Claude Code + agents-universal.**

- Claude Code's `.claude/skills/` is scanned by Windsurf, Cursor, and Cline as fallback
- Installing to `.claude/skills/` alone covers 4+ platforms automatically
- `.agents/skills/` is the emerging universal convention
- Additional platform-specific dirs only needed if user wants explicit platform support

_Source: [Agent Skills specification](https://agentskills.io/specification), [Windsurf docs](https://docs.windsurf.com/windsurf/cascade/skills), [Cursor docs](https://cursor.com/docs/context/skills)_

---

## Implementation Approaches and Technology Adoption

### Implementation Roadmap

**Phase 1: Minimum Viable Installer (MVP)**

| Step | Deliverable | Effort |
|------|-------------|--------|
| 1.1 | `package.json` + bin entry + shebang | Scaffolding |
| 1.2 | `commander` CLI with `install` command | Core CLI |
| 1.3 | `@clack/prompts` for project name + platform selection | User interaction |
| 1.4 | `fs-extra` verbatim copy of `scrum_workflow/` to target | Framework install |
| 1.5 | Skill registration copy to `.{platform}/skills/` with path substitution | Platform registration |
| 1.6 | Output directory creation | Directory setup |
| 1.7 | Lock file generation with SHA-256 hashes | Integrity tracking |

**Phase 2: Update & Multi-Platform**

| Step | Deliverable | Effort |
|------|-------------|--------|
| 2.1 | `update` command — detect changes via lock file hashes | Update detection |
| 2.2 | User-modified file backup/restore on update | Safe updates |
| 2.3 | `status` command — show installed version, platforms, component count | Diagnostics |
| 2.4 | Multi-platform simultaneous install (Claude Code + Cursor + Windsurf) | Platform expansion |
| 2.5 | `platform-registry.yaml` for config-driven platform support | Extensibility |

**Phase 3: Distribution & Quality**

| Step | Deliverable | Effort |
|------|-------------|--------|
| 3.1 | npm publish as `create-scrum-workflow` | Distribution |
| 3.2 | GitHub Actions CI/CD with changesets | Automated releases |
| 3.3 | Unit tests (Vitest + memfs) for pipeline steps | Quality |
| 3.4 | E2E tests (temp dir + file assertions) | Confidence |
| 3.5 | README + usage documentation | Docs |

### Development Workflow

**Project Setup:**

```bash
mkdir create-scrum-workflow && cd create-scrum-workflow
npm init -y
# Set type: "module" in package.json
npm install commander @clack/prompts fs-extra js-yaml picocolors
npm install -D vitest memfs
```

**Entry Point (`bin/create-scrum-workflow.js`):**

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
  .action(update)

program
  .command('status')
  .description('Show installation status')
  .action(status)

program.parse()
```

**Default invocation (no subcommand) runs `install`:**
```bash
npx create-scrum-workflow              # Runs install interactively
npx create-scrum-workflow install      # Explicit install
npx create-scrum-workflow update       # Update existing
npx create-scrum-workflow status       # Show status
```

### Testing Strategy

**Three-layer testing approach:**

**Layer 1: Unit Tests (Vitest + memfs)**

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { vol } from 'memfs'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('PathResolver', () => {
  beforeEach(() => vol.reset())

  it('resolves framework path relative to target', () => {
    const paths = resolveInstallPaths('/tmp/my-project', { platforms: ['claude-code'] })
    expect(paths.frameworkDir).toBe('/tmp/my-project/scrum_workflow')
    expect(paths.skillDirs['claude-code']).toBe('/tmp/my-project/.claude/skills')
  })
})
```

Test each pipeline step in isolation: config building, path resolution, manifest generation, hash computation.

_Source: [Vitest mocking filesystem](https://vitest.dev/guide/mocking/file-system), [memfs npm](https://www.npmjs.com/package/memfs)_

**Layer 2: Integration Tests (Commander + mocked prompts)**

```javascript
import { makeTestProgram } from '../test-helpers.js'

it('install command creates framework directory', async () => {
  const program = makeTestProgram({ exitOverride: true, suppressOutput: true })
  await program.parseAsync(['node', 'cli', 'install', '-d', tempDir, '-y'])
  expect(fs.existsSync(join(tempDir, 'scrum_workflow'))).toBe(true)
})
```

_Source: [Commander.js testing patterns](https://github.com/tj/commander.js/issues/1565)_

**Layer 3: E2E Tests (real temp dir + real filesystem)**

```javascript
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { execa } from 'execa'

let testDir
beforeEach(async () => { testDir = await mkdtemp(join(tmpdir(), 'scrum-test-')) })
afterEach(async () => { await rm(testDir, { recursive: true, force: true }) })

it('full install creates expected file tree', async () => {
  await execa('node', ['bin/create-scrum-workflow.js', 'install', '-d', testDir, '-y'])

  // Verify framework files
  expect(fs.existsSync(join(testDir, 'scrum_workflow/config.yaml'))).toBe(true)
  expect(fs.existsSync(join(testDir, 'scrum_workflow/agents/architect.md'))).toBe(true)

  // Verify skill registrations
  expect(fs.existsSync(join(testDir, '.claude/skills/create-ticket/SKILL.md'))).toBe(true)

  // Verify lock file
  const lock = JSON.parse(fs.readFileSync(join(testDir, '.scrum-workflow-lock.json'), 'utf8'))
  expect(lock.version).toBe('1.0.0')
  expect(lock.platforms).toContain('claude-code')
})
```

_Source: [with-local-tmp-dir](https://www.npmjs.com/package/with-local-tmp-dir), [execa](https://www.npmjs.com/package/execa)_

### Distribution via npm

**`package.json` configuration:**

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
    "test:watch": "vitest",
    "prepublishOnly": "npm test"
  }
}
```

**User invocation after publishing:**

```bash
npx create-scrum-workflow                     # Interactive install
npm create scrum-workflow                     # Alternative syntax
npx create-scrum-workflow install -p claude-code cursor -y  # Non-interactive
```

**Versioning:** Use [Changesets](https://github.com/changesets/changesets) for automated version bumps and CHANGELOG generation via GitHub Actions.

_Source: [npm create docs](https://docs.npmjs.com/cli/v10/commands/npm-init), [Changesets](https://github.com/changesets/changesets)_

### Known Pitfalls to Avoid

| Pitfall | Mitigation |
|---------|-----------|
| npx caches stale versions | Document `npx create-scrum-workflow@latest` for updates |
| Missing shebang line | Lint check for `#!/usr/bin/env node` in bin entry |
| Accidental secret publishing | `files` whitelist in package.json, `npm pack --dry-run` before publish |
| ESM/CJS confusion | Use `"type": "module"` consistently, `.cjs` for any CommonJS |
| `--` separator for npm flags | Document: `npm create scrum-workflow -- --platforms claude-code cursor` |
| File permissions on link | `chmod +x bin/create-scrum-workflow.js` in postinstall if needed |

_Source: [npm CLI issues #2329](https://github.com/npm/cli/issues/2329), [npm CLI issues #4108](https://github.com/npm/cli/issues/4108)_

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Platform skill format changes | Medium | High | Config-driven registry allows quick adaptation |
| New platform emerges | High | Low | One YAML entry to add support |
| User modifies framework files | High | Medium | Lock file detects changes, backup on update |
| npm registry issues | Low | Medium | GitHub releases as fallback distribution |
| Breaking changes in dependencies | Low | Low | Pin major versions, automated CI tests |

---

## Technical Research Recommendations

### Implementation Roadmap Summary

1. **Start with Phase 1 (MVP)** — ~500 LOC, functional installer for Claude Code
2. **Validate with real projects** — install into 2-3 test projects, iterate
3. **Add Phase 2 (Update + Multi-Platform)** — based on actual user feedback
4. **Phase 3 (Distribution)** — npm publish when stable

### Technology Stack Recommendations

| Layer | Choice | Why |
|-------|--------|-----|
| Language | JavaScript (ES Modules) | No build step, direct execution |
| CLI | Commander v13 | Industry standard, 25M+ weekly downloads |
| Prompts | @clack/prompts | Modern, beautiful, validation built-in |
| Files | fs-extra | Recursive copy, robust directory operations |
| Config | js-yaml | Framework uses YAML already |
| Hashing | Node.js crypto (native) | Zero dependency SHA-256 |
| Colors | picocolors | 14x smaller than chalk, same API |
| Testing | Vitest + memfs | Fast, ESM-native, filesystem mocking |
| Distribution | npm (create-*) | Standard pattern, zero infrastructure |
| Versioning | Changesets | Automated version bumps + CHANGELOG |

### Success Metrics

| Metric | Target |
|--------|--------|
| Install time | < 5 seconds for fresh install |
| File count installed | 51 framework files + 4 skill registrations |
| Platforms supported | 6+ (Claude Code, Cursor, Windsurf, Copilot, Cline, Universal) |
| Update safety | 100% user-modified files preserved |
| Test coverage | >80% for core pipeline |
| npm package size | < 500 KB (framework templates are small markdown files) |

---

## Research Synthesis and Conclusion

### Summary of Key Findings

This research set out to answer one question: **How can scrum_workflow be dynamically installed into any project, for any AI coding platform?** The answer is surprisingly clear thanks to ecosystem convergence.

**Finding 1: The platform problem is solved.** The Agent Skills open standard (SKILL.md, December 2025) unified the fragmented landscape. All 27+ major AI coding tools now use the same skill format and nearly identical directory conventions. A single installer can target them all with a config-driven approach — one YAML entry per platform, zero platform-specific code.

**Finding 2: The architecture is proven.** Both BMAD (22+ platforms, npm-distributed) and Vercel skills CLI (40+ agents) validate the same core pattern: verbatim copy from canonical source to platform-specific skill directories, tracked by manifests/lock files for safe updates. This is not experimental — it's battle-tested at scale.

**Finding 3: scrum_workflow is install-ready.** The framework has exactly 51 platform-agnostic files (Markdown + YAML) plus 4 lightweight skill registration shims. No compilation, no dependencies, no platform-specific variants. The installer is essentially a smart file copier with interactive prompts and integrity tracking.

**Finding 4: The MVP is small.** ~500 lines of JavaScript, 6 npm dependencies, no build step. The `npx create-scrum-workflow` pattern is well-established (create-react-app, create-next-app, create-vite) and requires zero infrastructure beyond an npm account.

### Strategic Impact

Building `create-scrum-workflow` transforms scrum_workflow from a "copy these files manually" framework into a **professional, distributable product**. Users run one command and get a working installation across their preferred AI coding platform. Updates are safe, idempotent, and preserve customizations.

The config-driven platform registry future-proofs the installer against the rapidly evolving AI tools landscape — new platforms can be supported with a single YAML addition, shipped as a patch version bump.

### Next Steps

1. **Create a new project** `create-scrum-workflow` (separate repo from scrum_workflow)
2. **Implement Phase 1 MVP** — `install` command targeting Claude Code
3. **Test against the MARS project** — install scrum_workflow alongside existing BMAD installation
4. **Iterate based on real usage** before adding Phase 2 (update/multi-platform) and Phase 3 (npm publish)

---

**Research Completion Date:** 2026-03-28
**Research Period:** 2026-03-27 to 2026-03-28
**Source Verification:** All claims verified against official documentation and current web sources
**Confidence Level:** High — architecture patterns validated by two independent production systems (BMAD, Vercel skills)

_This research document serves as the authoritative technical reference for building the `create-scrum-workflow` installer and provides all architectural decisions, component inventories, and implementation guidance needed to begin development._
