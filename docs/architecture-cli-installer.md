# Architecture - CLI Installer (create-scrum-workflow)

**Date:** 2026-04-03
**Part:** CLI Installer
**Type:** CLI Tool

## Executive Summary

The CLI installer is a Node.js command-line tool that distributes the scrum_workflow framework to target projects. It handles installation, updates, validation, and status reporting across 6 AI coding assistant platforms. The architecture follows a pipeline pattern where commands flow through core modules, integrity tracking, and platform-specific adapters.

## Technology Stack

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| Runtime | Node.js | ES Modules | Modern JavaScript with import/export syntax |
| CLI Framework | Commander.js | ^13.0.0 | Industry-standard CLI argument parsing and command routing |
| Interactive Prompts | @clack/prompts | ^0.9.0 | Modern, accessible CLI prompts with cancel support |
| File Operations | fs-extra | ^11.0.0 | Promise-based file system with atomic operations |
| YAML Parsing | js-yaml | ^4.1.0 | Platform registry configuration parsing |
| Terminal Colors | picocolors | ^1.1.0 | Lightweight terminal color output |
| Testing | Vitest | ^3.0.0 | Fast Vite-native test framework |
| Test Mocking | memfs | ^4.0.0 | In-memory file system for isolated testing |

## Architecture Pattern

**Pipeline Architecture** with layered separation:

```
User Input → Commander.js → Command Handler → Core Modules → Output
                                   ↓
                            Integrity Layer (SHA-256 hashes)
                                   ↓
                            Platform Registry (YAML-driven)
                                   ↓
                            File System (copy/hash/verify)
```

### Design Patterns

1. **Command Pattern**: Each CLI command (install, update, validate, status) is a separate module with a single async function entry point
2. **Template Method Pattern**: The Installer class defines the installation skeleton (check → copy → register → lock → verify → summarize)
3. **Registry Pattern**: Platform support is YAML-driven - adding new platforms requires no code changes, only YAML configuration
4. **Strategy Pattern**: Platform-specific behavior (skill formats, target directories) configured through the registry
5. **Lock File Pattern**: SHA-256 hash tracking enables update-safe installation with user modification detection

## Component Overview

### Commands Layer (`src/commands/`)

Four commands handling the user-facing operations:

| Command | Purpose | Key Operations |
|---------|---------|---------------|
| `install.js` | Framework installation | Interactive config → copy templates → register skills → create lock file |
| `update.js` | Framework update | Read lock → classify changes → backup user mods → overwrite → restore → re-lock |
| `validate.js` | Installation validation | 6-check validation pipeline (lock file, integrity, skills, placeholders, commands, dirs) |
| `status.js` | Status display | Read lock → compare hashes → color-coded output (unchanged/modified/missing) |

### Core Layer (`src/core/`)

| Module | Purpose |
|--------|---------|
| `config-builder.js` | Interactive or default configuration collection |
| `installer.js` | Main orchestrator class with 8-step pipeline |
| `path-resolver.js` | Resolves all installation paths from config and registry |
| `skill-registrar.js` | Registers skill shims with `{{framework_path}}` substitution |

### Integrity Layer (`src/integrity/`)

| Module | Purpose |
|--------|---------|
| `hash-tracker.js` | SHA-256 file and directory hashing |
| `lock-file.js` | Lock file CRUD and data structure building |

### Platform Layer (`src/platform/`)

| Module | Purpose |
|--------|---------|
| `platform-registry.js` | Loads and queries platform definitions from YAML |
| `platform-registry.yaml` | Platform definitions for 6 platforms |

**Supported Platforms:**

| Platform | Category | Preferred |
|----------|----------|-----------|
| claude-code | CLI | Yes |
| cursor | IDE | No |
| windsurf | IDE | No |
| github-copilot | IDE | No |
| cline | CLI | No |
| agents-universal | Universal | No |

### Validation Layer (`src/validation/`)

| Module | Purpose |
|--------|---------|
| `validation-utils.js` | 14 validation helper functions for platform config, skill verification, and report generation |

## Data Architecture

No database. The installer uses file-based data management:

- **Lock File** (`.scrum-workflow-lock.json`): JSON file tracking installation metadata, file hashes, and platform information
- **Platform Registry** (`platform-registry.yaml`): YAML file defining platform configurations
- **Skill Templates**: Markdown files with `{{framework_path}}` placeholder substitution

## Source Tree

```
create-scrum-workflow/
├── bin/
│   └── create-scrum-workflow.js     # CLI entry point
├── src/
│   ├── commands/                     # 4 command handlers
│   ├── core/                         # 4 core modules
│   ├── integrity/                    # 2 integrity modules
│   ├── platform/                     # Platform registry (JS + YAML)
│   └── validation/                   # Validation utilities
├── templates/                        # Framework files to install
├── test/
│   ├── unit/                         # Unit tests
│   └── integration/                  # Integration tests
├── package.json                      # NPM manifest
└── README.md                         # Documentation
```

## Development Workflow

### Prerequisites

- Node.js (ES Modules support required)
- npm

### Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run locally
node bin/create-scrum-workflow.js install --yes
```

### Build/Packaging

```bash
# Create tarball
npm pack
```

## Testing Strategy

- **Framework**: Vitest ^3.0.0
- **Unit Tests**: `test/unit/` - validation utilities, platform config parsing
- **Integration Tests**: `test/integration/` - installer pipeline, skill registration, platform validation
- **Mocking**: memfs ^4.0.0 for file system isolation
- **Coverage**: Unit tests cover validation report generation, platform registry parsing, skill list validation. Integration tests cover full installation pipeline, cross-platform skill creation.

## Key Design Decisions

1. **YAML-driven platform registry**: New platforms can be added without code changes, only YAML configuration
2. **Lock file with SHA-256 hashes**: Enables safe updates that preserve user modifications
3. **Template-based skill registration**: Skill shims are generated from templates with path substitution
4. **Interactive + non-interactive modes**: `--yes` flag enables CI/CD-friendly non-interactive installation
5. **6-check validation pipeline**: Comprehensive installation verification covering integrity, completeness, and format

---

_Generated by Scrum Workflow `/scrum-create-project-docs`_
