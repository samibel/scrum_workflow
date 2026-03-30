---
name: create-architecture-docs
trigger: "/scrum-create-architecture-docs"
requires_status: null
sets_status: null
spawns_agents: [architect-doc]
---

## Purpose

Generate comprehensive architecture documentation for existing projects by orchestrating the architect-doc agent to analyze system structure (backend APIs, frontend components, DevOps infrastructure, local development environment, and testing architecture). This is the entry point for architecture documentation generation.

## Workflow Reference

workflows/architecture-documentation.md

## Input

- Command trigger: `/scrum-create-architecture-docs` (full scan mode)
- Command with flag: `/scrum-create-architecture-docs --update` (incremental update mode)
- Project root directory (implicit from current working directory)
- Optional: `context/index.md` for project domain and tech stack understanding

## Output

- `docs/generated/backend-architecture.md` -- Backend API endpoints, event system, scheduled tasks, middleware pipeline, service layer, database access
- `docs/generated/frontend-architecture.md` -- Component hierarchy, state management, routing structure, build pipeline, shared utilities
- `docs/generated/devops-architecture.md` -- CI/CD pipelines, container configuration, orchestration, infrastructure as code, monitoring
- `docs/generated/local-dev-environment.md` -- Services with ports, mock services, environment variables, seed data, common commands
- `docs/generated/testing-architecture.md` -- Test pyramid, frameworks & configuration, test directory structure, coverage requirements, E2E setup
- `docs/generated/.arch-scan-state.json` -- Scan state tracking (files scanned, timestamps, hashes, status)

## Modes

**Full-Scan Mode** (default): Analyzes entire codebase and generates all architecture documentation from scratch. Warns if existing docs will be overwritten.

**Update Mode** (`--update` flag): Incremental update that only re-analyzes changed files since last scan, presents diff summary, and updates docs upon user confirmation.
