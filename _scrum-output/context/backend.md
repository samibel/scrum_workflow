---
domain: backend
generated: "2026-04-19T00:00:00Z"
---

# Backend Context

## Language

- **Name**: JavaScript (Node.js)
- **Version**: ES Modules (`"type": "module"`)
- **Also present**: TypeScript (for test specs only)

## Framework

- **Name**: Commander.js (CLI framework)
- **Version**: ^13.0.0
- **Purpose**: CLI installer tool (`create-scrum-workflow`) -- not a web server/API backend

## API Design

- **Style**: CLI interface (not REST/gRPC)
- **Commands**: install, update, validate, status
- **Base Path**: `bin/create-scrum-workflow.js`

## Database

- **Type**: None (file-based operations only)
- **ORM**: None
- **Migration Tool**: None (uses lock file `.scrum-workflow-lock.json` for integrity tracking)

## Conventions

- ES modules throughout (`import`/`export` syntax)
- File operations via `fs-extra` (not native `fs`)
- Interactive prompts via `@clack/prompts`
- YAML parsing via `js-yaml` for config and lock files
- Integrity tracking via SHA-256 hashes in lock file
- Source code in `create-scrum-workflow/src/` with subdirectories: `commands/`, `core/`, `integrity/`, `platform/`, `validation/`
