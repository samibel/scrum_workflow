# Scrum Workflow - Source Tree Analysis

**Date:** 2026-04-03

## Overview

This project is a multi-part repository containing an AI-assisted scrum development framework (Markdown definitions) and its CLI installer tool (Node.js). The framework uses a Markdown-as-code architecture where commands, workflows, agents, templates, and skills are defined as structured Markdown files interpreted by AI coding assistants.

## Multi-Part Structure

This project is organized into 2 distinct parts:

- **create-scrum-workflow** (`create-scrum-workflow/`): NPM CLI installer tool for distributing the framework
- **scrum_workflow** (`scrum_workflow/`): The framework itself - Markdown-based scrum workflow definitions

## Complete Directory Structure

```
scrum_workflow/                          # Project root
├── .claude/                             # Claude Code configuration
│   ├── skills/                          # Installed AI agent skills (60+ skills)
│   ├── instructions.md                  # Global instructions
│   └── settings.local.json             # Local settings
├── _bmad/                               # BMAD framework (separate tooling)
├── _bmad-output/                        # BMAD output artifacts
├── _scrum-output/                       # Scrum workflow output
│   ├── context/                         # Project context files
│   ├── planning-artifacts/              # Sprint planning outputs
│   └── implementation-artifacts/        # Implementation outputs
├── create-scrum-workflow/               # PART 1: CLI Installer
│   ├── bin/                             # CLI entry point
│   │   └── create-scrum-workflow.js     # Main binary
│   ├── src/                             # Source code
│   │   ├── commands/                    # CLI commands
│   │   │   ├── install.js              # Framework installation
│   │   │   ├── update.js               # Framework update
│   │   │   ├── validate.js             # Installation validation
│   │   │   └── status.js               # Status display
│   │   ├── core/                        # Core modules
│   │   │   ├── config-builder.js       # Interactive config builder
│   │   │   ├── installer.js            # Installation orchestrator
│   │   │   ├── path-resolver.js        # Path resolution
│   │   │   └── skill-registrar.js      # Skill registration
│   │   ├── integrity/                   # File integrity
│   │   │   ├── hash-tracker.js         # SHA-256 hashing
│   │   │   └── lock-file.js            # Lock file management
│   │   ├── platform/                    # Platform adapters
│   │   │   ├── platform-registry.js    # Platform registry loader
│   │   │   └── platform-registry.yaml  # Platform definitions (6 platforms)
│   │   └── validation/                  # Validation utilities
│   │       └── validation-utils.js     # Comprehensive validation helpers
│   ├── templates/                       # Framework templates to install
│   │   └── scrum_workflow/             # Copy of framework files
│   ├── test/                            # Tests
│   │   ├── unit/                        # Unit tests
│   │   └── integration/                # Integration tests
│   ├── package.json                     # NPM package manifest
│   ├── README.md                        # Installer documentation
│   └── create-scrum-workflow-1.0.0.tgz # Packaged tarball
├── scrum_workflow/                       # PART 2: Framework Definitions
│   ├── agents/                          # Agent role definitions
│   │   ├── architect.md                # Architecture specialist
│   │   ├── developer.md                # Implementation specialist
│   │   ├── qa.md                       # Quality assurance specialist
│   │   ├── researcher.md               # Research specialist
│   │   ├── documentarian.md            # Documentation specialist
│   │   └── architect-doc.md            # Architecture documentation specialist
│   ├── commands/                        # Command definitions (10 commands)
│   │   ├── create-ticket.md            # /scrum-create-ticket
│   │   ├── refine-ticket.md            # /scrum-refine-ticket
│   │   ├── refine-story.md             # /scrum-refine-story
│   │   ├── dev-story.md                # /scrum-dev-story
│   │   ├── review-story.md             # /scrum-review-story
│   │   ├── create-project-context.md   # /scrum-create-project-context
│   │   ├── create-project-docs.md      # /scrum-create-project-docs
│   │   ├── create-architecture-docs.md # /scrum-create-architecture-docs
│   │   ├── research-technical.md       # /scrum-research-technical
│   │   └── research-general.md         # /scrum-research-general
│   ├── workflows/                       # Workflow definitions (14 workflows)
│   │   ├── ticket-creation.md          # Story creation pipeline
│   │   ├── refinement.md               # Multi-agent refinement
│   │   ├── refine-story.md             # Story validation
│   │   ├── dev-story.md                # Story implementation
│   │   ├── development.md              # TDD development cycle
│   │   ├── review-story.md             # Code review
│   │   ├── review.md                   # Extended review (legacy)
│   │   ├── approval.md                 # Human approval gate
│   │   ├── readiness-check.md          # Pre-dev validation gate
│   │   ├── project-context.md          # Context generation
│   │   ├── project-documentation.md    # Business logic docs
│   │   ├── architecture-documentation.md # Architecture docs
│   │   ├── research-technical.md       # Technical research
│   │   └── research-general.md         # General research
│   ├── templates/                       # Output templates (26 templates)
│   │   ├── story.md                    # Story file template
│   │   ├── refinement.md               # Refinement audit template
│   │   ├── plan.md                     # Execution plan template
│   │   ├── review.md                   # Review report template
│   │   ├── approval.md                 # Approval record template
│   │   ├── technical-research.md       # Research findings template
│   │   ├── context-*.md                # Context file templates (6)
│   │   ├── skill-*.md                  # Domain skill templates (5)
│   │   └── *-architecture.md           # Architecture doc templates (5)
│   ├── skills/                          # Built-in skills (7 skills)
│   │   ├── guided-mode/                # Vague input handler
│   │   ├── prerequisite-validation/    # File existence checks
│   │   ├── status-guard-validation/    # Status state machine
│   │   ├── story-validation/           # YAML frontmatter validation
│   │   ├── synthesis/                  # Perspective merging
│   │   ├── feedback-collection/        # User feedback collection
│   │   └── readiness-check/            # Pre-dev validation
│   ├── context/                         # Framework context files
│   │   ├── index.md                    # Domain keyword mappings
│   │   ├── standards.md                # Naming conventions
│   │   ├── architecture-guidelines.md  # Architecture principles
│   │   └── platform-adapter-contract.md # Multi-platform contract
│   ├── data/                            # Reference data
│   │   └── estimation-reference.yaml   # Estimation data
│   └── config.yaml                      # Framework configuration
├── tests/                               # Project-level test specs
│   └── unit/
│       └── research-update-mode/        # Research update mode specs
├── docs/                                # Documentation output
├── design-artifacts/                    # WDS design artifacts
├── .scrum-workflow-lock.json            # Installation integrity lock file
└── README.md                            # Project documentation
```

## Critical Directories

### `create-scrum-workflow/src/`

The core source code for the CLI installer tool. Contains the complete pipeline for installing, updating, validating, and reporting status of the framework.

**Purpose:** CLI installer implementation
**Contains:** 13 JavaScript modules organized by concern (commands, core, integrity, platform, validation)
**Entry Points:** `bin/create-scrum-workflow.js` (CLI binary)

### `scrum_workflow/commands/`

The 10 command definitions that form the user-facing API of the framework. Each command maps to a `/scrum-*` trigger and references a workflow.

**Purpose:** Command registry and trigger definitions
**Contains:** 10 Markdown files defining command metadata, triggers, and workflow references

### `scrum_workflow/workflows/`

The 14 workflow definitions that orchestrate the step-by-step execution logic. Workflows are invoked by commands and define the exact sequence of operations.

**Purpose:** Workflow orchestration logic
**Contains:** 14 Markdown files with numbered steps, validation rules, and branching logic

### `scrum_workflow/agents/`

The 6 agent role definitions that provide specialized perspectives during refinement and other multi-agent workflows.

**Purpose:** Agent role specifications
**Contains:** 6 Markdown files defining agent focus areas, output formats, and responsibilities

### `scrum_workflow/templates/`

The 26 output templates that define the structure of generated files (stories, refinements, plans, reviews, context files, etc.).

**Purpose:** Output file structure definitions
**Contains:** Templates with YAML frontmatter and Markdown body sections

### `scrum_workflow/skills/`

The 7 built-in reusable skills that can be invoked by workflows for common operations like validation, synthesis, and feedback collection.

**Purpose:** Reusable workflow components
**Contains:** 7 skill directories each with a SKILL.md definition

## Integration Points

### create-scrum-workflow → scrum_workflow

- **Location:** `create-scrum-workflow/templates/scrum_workflow/`
- **Type:** File copy
- **Details:** The CLI installer copies the entire `scrum_workflow/` framework structure into target projects during installation. The `templates/` directory contains the source files that get installed.

### Claude Code → scrum_workflow

- **Location:** `.claude/skills/`
- **Type:** Skill shims
- **Details:** The CLI installer generates skill shim files in `.claude/skills/` that load the corresponding framework command when triggered. This is the platform adapter layer.

## Entry Points

### create-scrum-workflow

- **Main Entry:** `bin/create-scrum-workflow.js`
- **Additional:**
  - `src/commands/install.js`: Installation pipeline
  - `src/commands/update.js`: Update pipeline
  - `src/commands/validate.js`: Validation pipeline
  - `src/commands/status.js`: Status display

### scrum_workflow

- **Entry Point:** `config.yaml` (framework configuration)
- **Bootstrap:** Commands are loaded on demand when `/scrum-*` triggers are invoked

## File Organization Patterns

- **Framework files:** All Markdown with kebab-case naming and optional YAML frontmatter
- **CLI source:** JavaScript ES modules with camelCase naming
- **Templates:** Markdown with `{{variable}}` placeholders for dynamic content
- **Output files:** Written to `_scrum-output/` with structured subdirectories
- **Lock file:** JSON with SHA-256 hashes for integrity tracking

## Configuration Files

- **`scrum_workflow/config.yaml`**: Framework configuration (platform, agents, token budgets, refinement settings)
- **`create-scrum-workflow/package.json`**: NPM package manifest with dependencies
- **`create-scrum-workflow/src/platform/platform-registry.yaml`**: Platform adapter definitions (6 platforms)
- **`.scrum-workflow-lock.json`**: Installation integrity tracking with file hashes
- **`.claude/settings.local.json`**: Claude Code local settings

---

_Generated using BMAD Method `document-project` workflow_
