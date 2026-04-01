# Architecture Documentation Workflow

Two-mode workflow for the `/scrum-create-architecture-docs` command. Orchestrates the architect-doc agent to analyze system structure and generate architecture documentation.

## Prerequisites

- **Required**: `scrum_workflow/agents/architect-doc.md` -- architect-doc agent definition (must exist)
- **Optional**: `_scrum-output/context/index.md` -- Project context for domain/tech stack understanding (warn if missing, do not halt)
- **Agent Active-In**: The architect-doc agent has `active_in: [create-architecture-docs]` matching this command name

## Step 0: Mode Detection

Parse and validate command input to determine execution mode:

**Validation**: Check for invalid flag combinations:
- If both `--update` and other conflicting flags are present: **HALT** with error "Invalid flag combination. Use either --update or no flags."
- If unknown flags are present: **WARN** "Unknown flag(s) detected: {flags}. Proceeding with available flags."

**Mode Determination**:
- **Full-Scan Mode** (default): Used when command is invoked without `--update` flag
  - Triggers comprehensive codebase analysis
  - Generates all five architecture documents from scratch
  - Warns if existing documentation will be overwritten

- **Update Mode**: Used when `--update` flag is present in command input
  - Triggers incremental analysis of changed files only
  - Loads previous scan state and identifies modifications
  - Presents diff summary for user confirmation before updating

## Step 1: Validation

### 1.1: Verify Agent Existence

Check that `scrum_workflow/agents/architect-doc.md` exists:

```bash
test -f scrum_workflow/agents/architect-doc.md
```

If file does not exist:
- **HALT** with error: "architect-doc agent not found. Please run Story 7-1 first."

### 1.2: Check Project Context

Check if `_scrum-output/context/index.md` exists:

```bash
test -f _scrum-output/context/index.md
```

- If exists: Load for project domain and tech stack understanding
- If missing: **WARN** "No project context found (_scrum-output/context/index.md). Analysis will proceed without domain-specific context." and continue

### 1.3: Check Existing Documentation (Full-Scan Only)

In full-scan mode only, check if `_scrum-output/docs/` directory contains existing architecture docs:

```bash
test -d _scrum-output/docs
ls _scrum-output/docs/*.md 2>/dev/null | grep -E "backend-architecture|frontend-architecture|devops-architecture|local-dev-environment|testing-architecture"
```

If architecture documentation files already exist in `_scrum-output/docs/`:
- **WARN** with overwrite prompt: "Existing architecture docs found. This will overwrite. Continue? [y/N]"
- If user confirms (Y/y): Proceed with full-scan
- If user declines (N/n): **EXIT gracefully** with message: "Documentation generation cancelled by user. No changes made."

Skip this check in update mode (update mode has its own diff-based safety).

## Step 2: Agent & Context Loading

### 2.1: Load Architect-Doc Agent

Load the architect-doc agent definition from `scrum_workflow/agents/architect-doc.md`:
- Read agent's Identity, Instructions, Output Format, and Context Rules sections
- Extract grep patterns for each architecture dimension (backend, frontend, DevOps, local dev, testing)
- Extract Mermaid diagram types for each document
- Extract output template structures

### 2.2: Load Project Context (if available)

If `_scrum-output/context/index.md` exists:
- Load to understand project domain areas (backend, frontend, DevOps, testing, architecture)
- Extract tech stack information (languages, frameworks, tools)
- Use context to prioritize which architecture dimensions are relevant

## Step 3: Project Structure Scan

Discover source files using Glob patterns:

```bash
# Backend files
glob "src/**/*.ts" "src/**/*.js" "app/**/*.go" "**/*.java" "**/*.py"
# Frontend files
glob "src/**/*.tsx" "src/**/*.jsx" "components/**/*.vue" "*.svelte"
# DevOps files
glob "Dockerfile" "docker-compose*.yml" ".github/workflows/*.yml" "k8s/*.yaml" "*.tf"
# Testing files
glob "**/*.test.*" "**/*.spec.*" "test_*.py" "**/*_test.go"
```

Build file manifest for agent with:
- File paths
- File types (backend/frontend/DevOps/testing)
- Relative paths from project root

## Step 4: Full-Scan Mode Orchestration

In full-scan mode, orchestrate five analysis phases sequentially:

### 4.1: Backend Architecture Analysis

Invoke architect-doc agent with backend analysis instructions:
- Use grep patterns for API endpoints, event systems, schedulers, middleware, services
- Generate `_scrum-output/docs/backend-architecture.md` with:
  - API Endpoints (grouped by resource/domain)
  - Event System (with `sequenceDiagram`)
  - Scheduled Tasks
  - Middleware Pipeline (with `flowchart LR`)
  - Service Layer (with `graph TD`)
  - Database Access Layer

### 4.2: Frontend Architecture Analysis

Invoke architect-doc agent with frontend analysis instructions:
- Use grep patterns for components, state management, routing
- Generate `_scrum-output/docs/frontend-architecture.md` with:
  - Component Hierarchy (with `graph TD`)
  - State Management (with `flowchart`)
  - Routing Structure
  - Build Pipeline
  - Shared Utilities

### 4.3: DevOps Architecture Analysis

Invoke architect-doc agent with DevOps analysis instructions:
- Use grep patterns for CI/CD, Docker, Kubernetes, IaC
- Generate `_scrum-output/docs/devops-architecture.md` with:
  - CI/CD Pipelines (with `flowchart LR`)
  - Container Configuration
  - Orchestration (K8s)
  - Infrastructure as Code
  - Monitoring & Observability

### 4.4: Local Dev Environment Analysis

Invoke architect-doc agent with local dev analysis instructions:
- Use grep patterns for docker-compose, Wiremock, env files, seed data
- Generate `_scrum-output/docs/local-dev-environment.md` with:
  - Services with ports (with `graph TD`)
  - Mock Services
  - Environment Variables
  - Seed Data
  - Common Commands

### Step 4.5: Testing Architecture Analysis

Invoke architect-doc agent with testing analysis instructions:
- Use grep patterns for test frameworks, directories, coverage
- Generate `_scrum-output/docs/testing-architecture.md` with:
  - Test Pyramid (with `graph TD`)
  - Frameworks & Configuration
  - Test Directory Structure
  - Coverage Requirements
  - E2E Setup
- Extract source references in file:line format from all discovered testing components
- if no testing framework or configuration is detected after scanning, skip this step and note in scan state as `documents_skipped: ["_scrum-output/docs/testing-architecture.md"]`

### 4.6: Scan State Persistence

Write/update `_scrum-output/docs/.arch-scan-state.json` atomically using temp file pattern:
```bash
# Write to temp file first, then move to target for atomicity
cat > _scrum-output/docs/.arch-scan-state.tmp <<EOF
{
  "scan_date": "2026-03-30T12:00:00.000Z",
  "scan_mode": "full-scan",
  "files_scanned": [
    {"path": "src/backend/api.ts", "hash": "sha256:...", "timestamp": "..."},
    ...
  ],
  "documents_generated": [
    "_scrum-output/docs/backend-architecture.md",
    "_scrum-output/docs/frontend-architecture.md",
    "_scrum-output/docs/devops-architecture.md",
    "_scrum-output/docs/local-dev-environment.md",
    "_scrum-output/docs/testing-architecture.md"
  ],
  "documents_skipped": [],
  "scan_duration_seconds": 45,
  "scan_status": "complete"
}
EOF
mv _scrum-output/docs/.arch-scan-state.tmp _scrum-output/docs/.arch-scan-state.json
```

If write fails: **WARN** "Failed to write scan state. Next scan will run full-scan mode." and continue (state is optional for next run).

This is a separate state file from Epic 6's `.scan-state.json` -- the two agents manage independent state.

## Step 5: Update Mode Orchestration

In update mode (triggered by `--update` flag):

### 5.1: Load Existing Scan State

Load `_scrum-output/docs/.arch-scan-state.json`:
- Verify state file exists
- Extract `files_scanned` array with previous file hashes and timestamps
- Extract `documents_generated` list

If state file does not exist:
- **WARN** "No previous scan state found. Running full scan."
- **FALLBACK** to full-scan mode (go to Step 4)

### 5.2: Identify Changed Files

For each file in previous `files_scanned`:
- Compute current file hash (SHA-256 of content)
- Compare with stored hash
- Mark files where hashes differ as "changed"
- Detect new files (not in previous scan)
- Detect deleted files (in previous scan but no longer exist)

### 5.3: Re-Analyze Changed Areas

Invoke architect-doc agent to re-analyze only changed files:
- Focus analysis on files marked as "changed" or "new"
- Skip unchanged files to optimize performance
- For each architecture dimension, identify which documents need updates

### 5.4: Present Diff Summary

Present summary to user before writing:
```
Changed architecture components:
+2 new API endpoints
~1 modified service dependency
-1 removed middleware component

Apply these changes? [y/N]
```

### 5.5: Update Docs Upon Confirmation

- If user confirms (Y/y): Update relevant sections in affected documents while preserving unchanged sections
- If user declines (N/n): **HALT** without modifications
- If no changes detected: Report "No architecture changes detected since last scan."

### 5.6: Update Scan State

Update `_scrum-output/docs/.arch-scan-state.json` atomically using temp file pattern:
```bash
# Write to temp file first, then move to target for atomicity
cat > _scrum-output/docs/.arch-scan-state.tmp <<EOF
{
  "scan_date": "...",
  "scan_mode": "update",
  "files_scanned": [...],
  "documents_generated": [...],
  ...
}
EOF
mv _scrum-output/docs/.arch-scan-state.tmp _scrum-output/docs/.arch-scan-state.json
```

If state update fails: **WARN** "Failed to update scan state. Next incremental scan may re-analyze all files." and continue (documentation was already updated successfully).

If any documentation write fails in Step 5.5:
- **ROLLBACK** any partially written documentation files
- **DO NOT update** scan state
- **ERROR** "Documentation update failed. Partial changes may exist. Please review _scrum-output/docs/ manually."

## Step 6: Output Directory Creation

Before writing any documentation files:
- Check if `_scrum-output/docs/` directory exists
- If directory does not exist, create it:

```bash
mkdir -p _scrum-output/docs
```

If directory creation fails:
- **HALT** with error: "Cannot create output directory '_scrum-output/docs/'. Check permissions."
- Do not proceed with documentation generation

All architecture documentation files are written to this directory.

## Write Boundaries

**This workflow MAY write:**
- All files under `_scrum-output/docs/` directory
- `_scrum-output/docs/.arch-scan-state.json` scan state file

**This workflow MUST NOT write:**
- Any files outside `_scrum-output/docs/`
- Any files in `scrum_workflow/` directory
- Any project source files
- Any configuration files

The workflow orchestrates analysis but the architect-doc agent defines the document structure and content.
