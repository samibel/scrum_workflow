# create-scrum-workflow

CLI installer for the Scrum Workflow AI-assisted development framework.

## Quick Start

```bash
cd create-scrum-workflow
npm install
node bin/create-scrum-workflow.js install -y
```

This installs the framework into the current directory using all defaults (Claude Code platform, `scrum_workflow/` framework path).

## Installation

The CLI is not yet published to npm. Install and run it locally:

```bash
git clone <repo-url>
cd create-scrum-workflow
npm install
```

Then invoke it directly:

```bash
node bin/create-scrum-workflow.js <command> [options]
```

Or link it globally for convenience:

```bash
npm link
create-scrum-workflow <command> [options]
```

## Commands

### `install`

Install the Scrum Workflow framework into a target project.

```bash
create-scrum-workflow install [options]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-d, --directory <path>` | Target project directory | `.` (current directory) |
| `-p, --platforms <platforms...>` | One or more target platforms | `claude-code` |
| `-y, --yes` | Accept all defaults, skip interactive prompts | off |

**Interactive mode** (default) prompts for:

1. Target project directory
2. Project name
3. Platform selection (multi-select)
4. Framework directory name

**Non-interactive mode** (`-y`) uses resolved defaults and skips all prompts.

Examples:

```bash
# Interactive install in current directory
create-scrum-workflow install

# Non-interactive install into a specific project for two platforms
create-scrum-workflow install -d /path/to/project -p claude-code cursor -y

# Install for all platforms
create-scrum-workflow install -p claude-code cursor windsurf github-copilot cline agents-universal -y
```

If the framework directory already exists, the installer prompts for confirmation before overwriting (or overwrites automatically with `-y`).

### `update`

Update an existing installation to the latest framework files while preserving any files you have modified.

```bash
create-scrum-workflow update [options]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-d, --directory <path>` | Target project directory | `.` |

The update pipeline:

1. Reads the lock file to discover tracked files and their original hashes
2. Classifies each file as **unchanged**, **user-modified**, or **missing**
3. Backs up user-modified files to a temp directory
4. Overwrites all tracked files from the latest installer templates
5. Restores user-modified files from backup (your changes are preserved)
6. Regenerates the lock file with new hashes
7. Prints a summary of what was updated vs. preserved

If the installation is already up to date, the command exits early with no changes.

Example:

```bash
create-scrum-workflow update -d /path/to/project
```

### `status`

Display the current installation status and file integrity report.

```bash
create-scrum-workflow status [options]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-d, --directory <path>` | Target project directory | `.` |

Output includes:

- Installer version, install date, last update date
- Selected platforms and framework path
- Total tracked file count
- File integrity breakdown: unchanged, modified, missing
- List of modified and missing files (if any)

Example:

```bash
create-scrum-workflow status
```

## Supported Platforms

| Platform | Code | Skill Directory | Category |
|----------|------|-----------------|----------|
| Claude Code | `claude-code` | `.claude/skills/` | CLI |
| Cursor | `cursor` | `.cursor/skills/` | IDE |
| Windsurf | `windsurf` | `.windsurf/skills/` | IDE |
| GitHub Copilot | `github-copilot` | `.github/skills/` | IDE |
| Cline | `cline` | `.cline/skills/` | IDE |
| Universal (.agents/) | `agents-universal` | `.agents/skills/` | Universal |

Claude Code is the default and recommended platform. Cursor, Windsurf, and Cline also scan `.claude/skills/` as a fallback, so installing to Claude Code alone covers multiple platforms.

## What Gets Installed

The installer copies the following into your project:

- **`scrum_workflow/`** -- The complete framework directory (agents, commands, workflows, skills, templates, context, data, docs, and config). All files are platform-agnostic Markdown and YAML.
- **`.<platform>/skills/scrum-*/`** -- Four skill registration shims placed in each selected platform's skill directory. These are thin entry points that load the corresponding command from the framework directory.
- **`_scrum-output/`** -- Two output directories for artifacts generated during workflow execution:
  - `planning-artifacts/` -- Refinement outputs, plans, approvals
  - `implementation-artifacts/` -- Development outputs, reviews
- **`.scrum-workflow-lock.json`** -- Lock file at the project root (see below)

## Skill Commands

Four skills are registered as platform-discoverable commands with the `scrum-` prefix:

| Skill | Trigger | What It Does |
|-------|---------|--------------|
| `scrum-create-project-context` | "create project context" | Analyzes the codebase to discover tech stack, architecture, and conventions. Generates project context files and domain-specific skill files. |
| `scrum-create-ticket` | "create ticket", "new story" | Creates a structured story spec from natural language input. Includes vagueness detection, guided mode, estimation, and complexity assessment. |
| `scrum-refine-ticket` | "refine ticket", "refine story" | Orchestrates multi-agent refinement by spawning Architect, Developer, and QA perspectives. Synthesizes feedback and generates an execution plan. |
| `scrum-dev-story` | "dev story", "implement story" | Implements a story following its refined specification and execution plan. Enforces guard conditions (story must be in ready status). |

Each skill shim is a `SKILL.md` file that delegates to the full command file inside the framework directory.

## Lock File

The installer generates `.scrum-workflow-lock.json` at the project root. It records:

- Installer version
- Install and last-update timestamps
- Selected platforms and framework path
- SHA-256 hash of every installed file

The lock file enables the `update` command to detect which files you have modified (so it can preserve them) and which files are unchanged or missing. It also lets `status` report file integrity without needing the original templates.

## Project Structure

```
create-scrum-workflow/
  bin/
    create-scrum-workflow.js        # CLI entry point (Commander)
  src/
    commands/
      install.js                    # install command handler
      update.js                     # update command handler
      status.js                     # status command handler
    core/
      config-builder.js             # Interactive/non-interactive config collection
      installer.js                  # Installation pipeline orchestrator
      path-resolver.js              # Resolves all target paths from config
      skill-registrar.js            # Copies and templates skill shims
    integrity/
      hash-tracker.js               # SHA-256 file and directory hashing
      lock-file.js                  # Lock file read/write/build
    platform/
      platform-registry.js          # YAML registry loader
      platform-registry.yaml        # Platform definitions (zero-code extensibility)
  templates/
    scrum_workflow/                  # Framework files copied verbatim to target
      agents/                       # Agent persona definitions
      commands/                     # Command orchestration files
      config.yaml                   # Framework configuration
      context/                      # Architecture guidelines and standards
      data/                         # Estimation reference data
      docs/                         # Framework documentation (18 files)
      skills/                       # Internal framework skills (7 skills)
      templates/                    # Story, plan, and review templates
      workflows/                    # Workflow definitions (7 workflows)
    skill-registrations/            # Skill shim templates ({{framework_path}} substitution)
      scrum-create-project-context/
      scrum-create-ticket/
      scrum-dev-story/
      scrum-refine-ticket/
  package.json
```
