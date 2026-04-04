# Development Guide - Scrum Workflow

**Date:** 2026-04-03

## Prerequisites

- **Node.js** with ES Modules support
- **npm** package manager
- **AI Coding Assistant** (Claude Code recommended, or Cursor/Windsurf/Copilot/Cline)
- **Git** for version control

## Setup

### CLI Installer Development

```bash
cd create-scrum-workflow
npm install
```

### Framework Development

The framework requires no build step. Markdown files in `scrum_workflow/` are the source of truth.

```bash
# Clone the repository
git clone <repo-url>
cd scrum_workflow

# Install CLI dependencies (for testing the installer)
cd create-scrum-workflow && npm install && cd ..
```

## Run Locally

### CLI Installer

```bash
cd create-scrum-workflow

# Run with interactive prompts
node bin/create-scrum-workflow.js install

# Run with defaults (non-interactive)
node bin/create-scrum-workflow.js install --yes

# Check status
node bin/create-scrum-workflow.js status

# Validate installation
node bin/create-scrum-workflow.js validate

# Update framework
node bin/create-scrum-workflow.js update
```

### Framework Commands (in target project)

```bash
# Create a new story
/scrum-create-ticket SW-001 User login with email and password

# Refine with multi-agent analysis
/scrum-refine-ticket SW-001

# Validate story completeness
/scrum-refine-story SW-001

# Implement the story
/scrum-dev-story SW-001

# Review implementation
/scrum-review-story SW-001

# Generate project context
/scrum-create-project-context

# Generate business logic docs
/scrum-create-project-docs

# Generate architecture docs
/scrum-create-architecture-docs

# Run research
/scrum-research-technical [topic]
/scrum-research-general [topic]
```

## Build Process

### CLI Installer

```bash
cd create-scrum-workflow

# Create distributable tarball
npm pack
# Produces: create-scrum-workflow-1.0.0.tgz

# Test the tarball globally
npm install -g create-scrum-workflow-1.0.0.tgz
create-scrum-workflow install --yes
```

### Framework

No build step required. Markdown files are consumed directly by AI assistants.

## Testing

### CLI Installer Tests

```bash
cd create-scrum-workflow

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Test locations
# test/unit/                    - Unit tests (validation, platform config)
# test/integration/             - Integration tests (installer, skills, platforms)
```

### Project-Level Tests

```bash
# TypeScript specs for research update mode
ls tests/unit/research-update-mode/
# ac2-targeted-web-research.spec.ts
# ac3-diff-comparison.spec.ts
# ac4-diff-summary-presentation.spec.ts
# ac5-user-confirmation.spec.ts
# ac6-incremental-document-updates.spec.ts
# ac7-research-state-update.spec.ts
# ac8-no-new-findings-handling.spec.ts
# cc-workflow-structure.spec.ts
# research-update-mode.spec.ts
# sff-state-file-structure.spec.ts
```

### Markdown-Based Tests

```bash
# Scenario-based tests in scrum_workflow
ls scrum_workflow/__tests__/research/
# filesystem-state.test.md
# reflection-loop.test.md
# swarm-migration.test.md
```

## Project Structure Conventions

### File Naming

- **Kebab-case** for all file names: `my-file.md`, `create-ticket.md`
- **snake_case** for YAML fields: `project_name`, `created_at`
- **PascalCase** for template variables: `{{ProjectName}}` (where applicable)
- **SW-XXX** format for story ticket identifiers

### Directory Organization

```
scrum_workflow/
├── commands/          # /scrum-* command triggers and routing
├── workflows/         # Step-by-step orchestration logic
├── agents/            # Agent role specifications
├── templates/         # Output file structure definitions
├── skills/            # Reusable workflow components
├── context/           # Domain context and standards
├── data/              # Reference data files
└── config.yaml        # Framework configuration
```

### Write Boundaries

Each command has strict file ownership:

| Command | May Write To | May NOT Write To |
|---------|-------------|-----------------|
| create-ticket | `_scrum-output/stories/` | Everything else |
| refine-ticket | `_scrum-output/refinements/`, story files | Templates, commands |
| refine-story | `_scrum-output/plans/`, story status | Story content |
| dev-story | Code files, story status | Plans, reviews |
| review-story | `_scrum-output/reviews/` | Code files, stories |
| create-project-context | `_scrum-output/context/`, `_scrum-output/skills/` | Sprint files |

## Adding New Commands

1. Create `scrum_workflow/commands/my-command.md` with trigger and workflow reference
2. Create `scrum_workflow/workflows/my-workflow.md` with step-by-step logic
3. Add any needed templates in `scrum_workflow/templates/`
4. Update `context/standards.md` with write boundaries

## Adding New Platforms

1. Edit `create-scrum-workflow/src/platform/platform-registry.yaml`
2. Add platform entry with: code, display_name, category, target_dir, skill_format
3. No code changes required - the registry is YAML-driven

## Debugging

### Framework Issues

- Check `_scrum-output/` for generated files
- Check `.scrum-workflow-lock.json` for installation integrity
- Run `validate` command: `node bin/create-scrum-workflow.js validate`

### CLI Installer Issues

- Use `--dry-run` flag with install to preview changes
- Check `.scrum-workflow-lock.json` for file hash mismatches
- Run `status` command for color-coded integrity report

---

_Generated using BMAD Method `document-project` workflow_
