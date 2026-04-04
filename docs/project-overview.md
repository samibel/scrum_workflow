# Scrum Workflow - Project Overview

**Date:** 2026-04-03
**Type:** Multi-part (CLI + Library)
**Architecture:** Markdown-as-Code Pipeline

## Executive Summary

Scrum Workflow is a spec-first, AI-assisted development framework that enables structured scrum workflows through AI coding assistants. The framework defines commands, workflows, agent roles, and templates as Markdown files that are interpreted by platforms like Claude Code, Cursor, and Windsurf. It is distributed via a Node.js CLI installer (`create-scrum-workflow`).

The framework implements a complete scrum lifecycle: story creation, multi-agent refinement (Architect/Developer/QA), validation, implementation, code review, and human approval.

## Project Classification

- **Repository Type:** Multi-part
- **Project Type(s):** CLI (installer), Library (framework)
- **Primary Language(s):** JavaScript (ES Modules), Markdown
- **Architecture Pattern:** Pipeline + Three-Layer (Framework → Adapter → State)

## Multi-Part Structure

This project consists of 2 distinct parts:

### create-scrum-workflow

- **Type:** CLI
- **Location:** `create-scrum-workflow/`
- **Purpose:** NPM installer tool that distributes the framework to target projects
- **Tech Stack:** Node.js, Commander.js ^13.0.0, fs-extra, js-yaml, @clack/prompts, picocolors

### scrum_workflow

- **Type:** Library (Markdown-as-Code)
- **Location:** `scrum_workflow/`
- **Purpose:** The framework itself - 10 commands, 14 workflows, 6 agents, 7 skills, 26 templates
- **Tech Stack:** Markdown, YAML, multi-platform AI assistant support

### How Parts Integrate

The CLI installer (`create-scrum-workflow`) copies the framework definitions (`scrum_workflow/`) into target projects and generates platform-specific skill shims that route `/scrum-*` commands to the correct workflow files. The lock file tracks integrity via SHA-256 hashes.

## Technology Stack Summary

### create-scrum-workflow Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Runtime | Node.js (ES Modules) | - |
| CLI Framework | Commander.js | ^13.0.0 |
| Prompts | @clack/prompts | ^0.9.0 |
| File System | fs-extra | ^11.0.0 |
| YAML | js-yaml | ^4.1.0 |
| Terminal | picocolors | ^1.1.0 |
| Testing | Vitest | ^3.0.0 |
| Test Mocking | memfs | ^4.0.0 |

### scrum_workflow Stack

| Category | Technology |
|----------|-----------|
| Definition Language | Markdown with YAML frontmatter |
| Configuration | YAML (config.yaml) |
| Platforms | Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Universal |
| Distribution | npm package |

## Key Features

1. **10 Slash Commands**: Complete scrum lifecycle from ticket creation to approval
2. **Multi-Agent Refinement**: Architect, Developer, and QA provide independent perspectives with cross-talk
3. **9-State Story Lifecycle**: Comprehensive status tracking with guard conditions
4. **6 Platform Support**: Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Universal
5. **Wideband Delphi Estimation**: Multi-agent story point estimation with variance detection
6. **Write Boundary Enforcement**: Strict file ownership prevents cross-command interference
7. **Inversion of Control**: Implementation agents execute plans without self-review
8. **File Integrity Tracking**: SHA-256 lock file for safe updates

## Architecture Highlights

- **Three-Layer Architecture**: Framework Layer (Markdown definitions) → Adapter Layer (platform shims) → State Layer (output files)
- **Pipeline Pattern**: Command → Workflow → Agent(s) + Template(s) → Output
- **Markdown-as-Code**: The framework's "runtime" is AI assistants interpreting structured Markdown
- **YAML-Driven Platform Registry**: Adding new platforms requires only YAML changes

## Development Overview

### Prerequisites

- Node.js (ES Modules support)
- npm
- AI coding assistant (Claude Code recommended)

### Getting Started

```bash
# Install the framework in a project
npx create-scrum-workflow install

# Or install with defaults
npx create-scrum-workflow install --yes
```

### Key Commands

#### CLI Installer (create-scrum-workflow)

- **Install:** `npm install`
- **Test:** `npm test`
- **Run:** `node bin/create-scrum-workflow.js install --yes`

#### Framework Commands (in target project)

- **Create Ticket:** `/scrum-create-ticket SW-001 [description]`
- **Refine Ticket:** `/scrum-refine-ticket SW-001`
- **Refine Story:** `/scrum-refine-story SW-001`
- **Dev Story:** `/scrum-dev-story SW-001`
- **Review Story:** `/scrum-review-story SW-001`

## Repository Structure

```
scrum_workflow/                     # Project root
├── create-scrum-workflow/          # CLI installer (Part 1)
│   ├── bin/                        # CLI entry point
│   ├── src/                        # Source code (13 modules)
│   ├── templates/                  # Framework templates to install
│   └── test/                       # Tests (unit + integration)
├── scrum_workflow/                  # Framework definitions (Part 2)
│   ├── commands/                   # 10 command definitions
│   ├── workflows/                  # 14 workflow definitions
│   ├── agents/                     # 6 agent role definitions
│   ├── templates/                  # 26 output templates
│   ├── skills/                     # 7 built-in skills
│   ├── context/                    # Framework context files
│   ├── data/                       # Reference data
│   └── config.yaml                 # Framework configuration
├── _scrum-output/                  # Generated output
├── tests/                          # Project-level test specs
└── docs/                           # Documentation
```

## Documentation Map

For detailed information, see:

- [index.md](./index.md) - Master documentation index
- [architecture-cli-installer.md](./architecture-cli-installer.md) - CLI installer architecture
- [architecture-framework.md](./architecture-framework.md) - Framework architecture
- [source-tree-analysis.md](./source-tree-analysis.md) - Annotated directory structure
- [development-guide.md](./development-guide.md) - Development workflow
- [integration-architecture.md](./integration-architecture.md) - How parts integrate

---

_Generated using BMAD Method `document-project` workflow_
