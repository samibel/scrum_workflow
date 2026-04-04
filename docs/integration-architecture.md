# Integration Architecture

**Date:** 2026-04-03

## Overview

The scrum_workflow project consists of two distinct parts that integrate through a file-copy distribution model. This document describes how the CLI installer and the framework definitions work together.

## Parts

| Part | Type | Root Path | Purpose |
|------|------|-----------|---------|
| CLI Installer | CLI | `create-scrum-workflow/` | Distributes the framework to target projects |
| Framework Definitions | Library | `scrum_workflow/` | Markdown-based scrum workflow definitions |

## Integration Points

### 1. Template Copy Pipeline

**From:** CLI Installer (`create-scrum-workflow/`)
**To:** Target Project
**Type:** File Copy with Transformation

The CLI installer copies the entire framework definition structure from `create-scrum-workflow/templates/scrum_workflow/` into the target project's configured framework path (default: `scrum_workflow/`).

**Flow:**
```
templates/scrum_workflow/  →  [Installer.copyFramework()]  →  target/scrum_workflow/
```

**Files copied:**
- All `.md` files (commands, workflows, agents, templates, skills, context)
- `config.yaml`
- `data/` directory

### 2. Skill Registration Pipeline

**From:** CLI Installer
**To:** Platform-specific skill directories
**Type:** Template Substitution

The installer generates skill shim files for each selected platform. Each shim loads the corresponding framework command when triggered.

**Flow:**
```
skill-template.md  →  [SkillRegistrar.registerSkills()]  →  .claude/skills/scrum-*/SKILL.md
                                        ↓
                              {{framework_path}} substitution
```

**Transformation:**
- Reads skill templates from `templates/skills/`
- Substitutes `{{framework_path}}` with the configured framework path
- Writes to platform-specific directories (e.g., `.claude/skills/` for Claude Code)

### 3. Lock File Integrity Bridge

**From:** CLI Installer
**To:** Installation State
**Type:** SHA-256 Hash Tracking

The installer creates a lock file (`.scrum-workflow-lock.json`) that tracks every installed file with SHA-256 hashes. This enables:
- Safe updates that preserve user modifications
- Integrity validation
- Status reporting (unchanged/modified/missing files)

**Flow:**
```
Installed Files  →  [HashTracker.hashDirectory()]  →  .scrum-workflow-lock.json
                                              ↓
                              { "files": { "path": "sha256:..." } }
```

### 4. Configuration Bridge

**From:** Framework Definitions
**To:** CLI Installer
**Type:** YAML Configuration

The framework's `config.yaml` defines settings that the installer respects:
- `platform`: Determines which platform shims to generate
- `active_agents`: Controls which agent roles are available
- `token_budgets`: Sets context limits for agent interactions

### 5. Output Directory Structure

**From:** CLI Installer
**To:** Target Project
**Type:** Directory Creation

The installer creates the output directory structure that workflows write to:

```
_scrum-output/
├── context/              # Project context files
├── planning-artifacts/   # Sprint planning outputs
├── implementation-artifacts/  # Implementation outputs
├── stories/              # Story files (SW-XXX.md)
├── refinements/          # Refinement audit files
├── plans/                # Execution plans
├── reviews/              # Code review reports
├── docs/                 # Generated documentation
└── research/             # Research findings
    ├── technical/
    └── general/
```

## Data Flow Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT REPOSITORY                      │
│                                                               │
│  ┌──────────────────┐      ┌──────────────────────────┐      │
│  │  create-scrum-   │      │     scrum_workflow/       │      │
│  │  workflow/       │      │  ┌─────────────────┐     │      │
│  │  ┌──────────┐   │      │  │  commands/ (10)  │     │      │
│  │  │ bin/     │   │      │  │  workflows/ (14) │     │      │
│  │  │ src/     │   │─────▶│  │  agents/ (6)     │     │      │
│  │  │ test/    │   │ copy │  │  templates/ (26) │     │      │
│  │  └──────────┘   │      │  │  skills/ (7)     │     │      │
│  └──────────────────┘      │  │  context/ (4)    │     │      │
│                            │  └─────────────────┘     │      │
│                            └──────────────────────────┘      │
└───────────────────────────────────────────────────────────────┘
                              │
                              │ npx create-scrum-workflow install
                              ▼
┌───────────────────────────────────────────────────────────────┐
│                     TARGET PROJECT                            │
│                                                               │
│  ┌──────────────────┐      ┌──────────────────────────┐      │
│  │  .claude/skills/ │      │     scrum_workflow/       │      │
│  │  (skill shims)   │─────▶│  (copied framework)      │      │
│  │  scrum-*/SKILL.md│ load │  Interpreted by AI agent  │      │
│  └──────────────────┘      └──────────┬───────────────┘      │
│                                       │                      │
│                                       ▼                      │
│                            ┌──────────────────────┐          │
│                            │   _scrum-output/     │          │
│                            │   (generated files)  │          │
│                            └──────────────────────┘          │
│                                                               │
│  ┌──────────────────────────────────────────────────┐        │
│  │  .scrum-workflow-lock.json (integrity tracking)   │        │
│  └──────────────────────────────────────────────────┘        │
└───────────────────────────────────────────────────────────────┘
```

## Shared Dependencies

| Resource | Used By | Purpose |
|----------|---------|---------|
| `scrum_workflow/config.yaml` | Framework (runtime), Installer (reference) | Platform, agent, and budget configuration |
| `create-scrum-workflow/templates/` | Installer (source) | Framework files to copy during installation |
| `.scrum-workflow-lock.json` | Installer (create/update/validate/status) | Installation integrity tracking |
| `.claude/skills/` | AI assistant (runtime) | Skill shims that route to framework commands |

---

_Generated using BMAD Method `document-project` workflow_
