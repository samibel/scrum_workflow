# Story 7.2: `/scrum-create-architecture-docs` Command & Workflow Skeleton

Status: done

## Story

As a developer,
I want to run `/scrum-create-architecture-docs` to trigger architecture documentation generation,
so that I have a single command that orchestrates the full architecture documentation workflow.

## Acceptance Criteria

1. **Command file exists at correct location**: `scrum_workflow/commands/create-architecture-docs.md` exists in SKILL.md command format with YAML frontmatter: `trigger: /create-architecture-docs`, `requires_status: null`, `sets_status: null`, `spawns_agents: [architect-doc]`

2. **Workflow file exists at correct location**: `scrum_workflow/workflows/architecture-documentation.md` exists with the two-mode workflow: `full-scan` (default) and `update` (triggered by `--update` flag)

3. **Documentation output directory**: The workflow defines the documentation output directory as `docs/generated/` relative to project root (same directory as Epic 6 output)

4. **Agent and context loading**: The workflow loads the architect-doc agent definition and project context before starting analysis

5. **Full-scan mode orchestration**: In `full-scan` mode, the workflow orchestrates: (1) project structure scan, (2) backend analysis -> `backend-architecture.md`, (3) frontend analysis -> `frontend-architecture.md`, (4) DevOps analysis -> `devops-architecture.md`, (5) local dev environment analysis -> `local-dev-environment.md`, (6) testing analysis -> `testing-architecture.md`, (7) scan state persistence -> `.arch-scan-state.json`

6. **Update mode orchestration**: In `update` mode, the workflow orchestrates: (1) load existing `.arch-scan-state.json`, (2) identify changed files, (3) re-analyze changed areas, (4) show diff summary to user, (5) update docs upon user confirmation

7. **Project context reading**: The command reads `context/index.md` to determine project domain and tech stack

8. **Directory creation**: If `docs/generated/` does not exist, the workflow creates it

9. **Overwrite warning**: If architecture docs already exist and mode is `full-scan`, the workflow warns: "Existing architecture docs found. This will overwrite. Continue? [y/N]"

10. **Adapter skill creation**: A `.claude/skills/create-architecture-docs.md` adapter skill is created that references the framework command

## Tasks / Subtasks

- [x] Task 1: Create command file (AC: #1)
  - [x] 1.1: Create `scrum_workflow/commands/create-architecture-docs.md` with YAML frontmatter matching the SKILL.md command convention from existing commands (`create-ticket.md`, `create-project-context.md`, `dev-story.md`)
  - [x] 1.2: Frontmatter fields: `name: create-architecture-docs`, `trigger: "/scrum-create-architecture-docs"`, `requires_status: null`, `sets_status: null`, `spawns_agents: [architect-doc]`
  - [x] 1.3: Write Purpose section describing the command as the entry point for architecture documentation generation
  - [x] 1.4: Write Workflow Reference section pointing to `workflows/architecture-documentation.md`
  - [x] 1.5: Write Input section describing command usage: `/scrum-create-architecture-docs` (full scan) and `/scrum-create-architecture-docs --update` (incremental update)
  - [x] 1.6: Write Output section listing the five generated files (`backend-architecture.md`, `frontend-architecture.md`, `devops-architecture.md`, `local-dev-environment.md`, `testing-architecture.md`) plus `.arch-scan-state.json`

- [x] Task 2: Create workflow file (AC: #2, #3, #4, #5, #6, #7, #8, #9)
  - [x] 2.1: Create `scrum_workflow/workflows/architecture-documentation.md` following the established workflow file pattern from `project-context.md`, `project-documentation.md`, etc.
  - [x] 2.2: Write Prerequisites section requiring the architect-doc agent definition (`scrum_workflow/agents/architect-doc.md`) and optional project context (`context/index.md`)
  - [x] 2.3: Write Step 0 -- Mode Detection: parse command input to determine `full-scan` (default) vs `update` mode (when `--update` flag is present)
  - [x] 2.4: Write Step 1 -- Validation: check architect-doc agent exists, check project context (warn if missing, do not halt), check `docs/generated/` existence for overwrite warning in full-scan mode
  - [x] 2.5: Write Step 2 -- Agent & Context Loading: load `scrum_workflow/agents/architect-doc.md` for agent instructions, load `context/index.md` to understand project domain/tech stack
  - [x] 2.6: Write Step 3 -- Project Structure Scan: use Glob to discover source files, build file manifest for agent
  - [x] 2.7: Write Step 4 -- Full-Scan Mode: orchestrate six analysis phases referencing architect-doc agent instructions: (a) backend analysis -> `docs/generated/backend-architecture.md`, (b) frontend analysis -> `docs/generated/frontend-architecture.md`, (c) DevOps analysis -> `docs/generated/devops-architecture.md`, (d) local dev environment analysis -> `docs/generated/local-dev-environment.md`, (e) testing analysis -> `docs/generated/testing-architecture.md`
  - [x] 2.8: Write Step 5 -- Update Mode: load `.arch-scan-state.json`, identify changed files, re-analyze only changed areas, present diff summary, update docs upon user confirmation
  - [x] 2.9: Write Step 6 -- Scan State Persistence: write/update `docs/generated/.arch-scan-state.json` with scan metadata (files scanned, timestamps, hashes, status)
  - [x] 2.10: Write Step 7 -- Output directory creation: if `docs/generated/` does not exist, create it before writing any files

- [x] Task 3: Create adapter skill file (AC: #10)
  - [x] 3.1: Create `.claude/skills/create-architecture-docs.md` following exact pattern from `create-project-context.md` and `create-project-docs.md` adapter skills
  - [x] 3.2: YAML frontmatter: `name: create-architecture-docs`, `trigger: /create-architecture-docs`, `description: Generate architecture documentation for existing projects`, `framework_command: {framework_commands}/create-architecture-docs.md`
  - [x] 3.3: Body text referencing the framework command file

## Dev Notes

### Architecture Compliance

- **Three-Layer Separation**: The command file (`create-architecture-docs.md`) goes in Framework Layer (`scrum_workflow/commands/`). The workflow file (`architecture-documentation.md`) goes in Framework Layer (`scrum_workflow/workflows/`). The adapter skill (`create-architecture-docs.md`) goes in Adapter Layer (`.claude/skills/`). These three layers MUST be kept separate.
- **Command-as-Orchestrator Pattern**: The command file is WHAT (entry point, agent spawning, orchestration). The workflow file is HOW (step-by-step execution). The command references the workflow. This is the same pattern as `create-ticket.md` -> `ticket-creation.md` and `create-project-context.md` -> `project-context.md`.
- **No Project-Specific State in Framework**: The framework files (`scrum_workflow/`) never contain project-specific data. The `docs/generated/` output directory is created in the project root, NOT inside `scrum_workflow/`.
- **SKILL.md Format**: Both command and adapter files use YAML frontmatter + Markdown body. Command frontmatter has: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`. Adapter frontmatter has: `name`, `trigger`, `description`, `framework_command`.
- **Naming Convention**: kebab-case filenames (`create-architecture-docs.md`, `architecture-documentation.md`). The `scrum-` prefix is used ONLY in user-facing triggers (e.g., `/scrum-create-architecture-docs`), NOT in internal framework filenames.
- **NFR4 Compliance**: Adding a new command = new Markdown files in commands/ and workflows/ directories. Zero code changes needed.
- **NFR9 Compliance**: No runtime dependencies. Pure file-based interpretation by the AI platform.

### Existing Pattern References (MUST FOLLOW)

**Command File Pattern** -- follow exactly from `create-project-context.md` and `create-project-docs.md`:
```yaml
---
name: create-project-docs
trigger: "/scrum-create-project-docs"
requires_status: null
sets_status: null
spawns_agents: [documentarian]
---
```
Sections: Purpose, Workflow Reference, Input, Output. The `create-architecture-docs` command differs by having `spawns_agents: [architect-doc]` (it spawns the architect-doc agent).

**Workflow File Pattern** -- follow from `project-documentation.md` (Epic 6, Story 6.2):
- Title with workflow description
- Prerequisites section listing required files
- Numbered steps with clear substeps
- Each step has validation, action, and error handling
- Write Boundaries section at the end specifying what the workflow may and may not write

**Adapter Skill Pattern** -- follow exactly from `create-project-docs.md`:
```yaml
---
name: create-project-docs
trigger: /create-project-docs
description: Generate business logic documentation for existing projects
framework_command: {framework_commands}/create-project-docs.md
---
```
Body: brief description + framework command file reference. Adapter is a thin reference -- NO workflow logic in the adapter.

### Key Design Decisions from Epic & Architecture

1. **Two Modes**: `full-scan` (default) and `update` (with `--update` flag). Full-scan generates everything from scratch. Update mode is incremental (Stories 7.8 implements the full update logic, but the workflow skeleton must define the mode switching and entry points now).
2. **Output Directory**: `docs/generated/` relative to project root. NOT inside `scrum_workflow/`. NOT inside `sprints/`. This is the same directory as Epic 6 output -- architecture docs and business logic docs coexist in `docs/generated/`.
3. **Five Output Files**: `backend-architecture.md`, `frontend-architecture.md`, `devops-architecture.md`, `local-dev-environment.md`, `testing-architecture.md` -- defined by the architect-doc agent's Output Format section. The workflow orchestrates their creation but the agent defines their structure.
4. **Scan State**: `.arch-scan-state.json` in `docs/generated/` tracks what was scanned. Full details are Story 7.9's responsibility, but the workflow skeleton must reference it. This is a SEPARATE state file from Epic 6's `.scan-state.json` -- the two agents manage independent state (FR79).
5. **Single Agent, No Multi-Agent Orchestration**: The architect-doc is the only agent. The command/workflow drives the phases (scan, analyze, generate). This is simpler than the `refine-ticket` pattern which spawns 3 agents in parallel.
6. **Overwrite Safety**: In full-scan mode, if `docs/generated/` already has content, warn the user before overwriting. This is FR77-style safety for full-scan (update mode has its own diff-based safety).
7. **Context Loading**: The workflow loads `context/index.md` for project understanding. If context files don't exist, warn but proceed (same pattern as `ticket-creation.md` Step 0.1).
8. **Language-Agnostic**: The architect-doc uses Glob+Grep, not AST parsing. The workflow must NOT add any language-specific tooling (FR78).

### Scope Boundaries

**IN scope for this story (skeleton)**:
- Command file with complete YAML frontmatter and all sections
- Workflow file with all steps defined (mode detection, validation, agent loading, full-scan orchestration, update-mode orchestration, scan state, directory creation)
- Adapter skill file
- Write Boundaries section in the workflow

**OUT of scope (later stories)**:
- Output templates for the five documents (`backend-architecture.md`, `frontend-architecture.md`, `devops-architecture.md`, `local-dev-environment.md`, `testing-architecture.md`) -- Stories 7.3, 7.4, 7.5, 7.6, 7.7
- Actual analysis logic (grep patterns, Mermaid generation) -- Stories 7.3, 7.4, 7.5, 7.6, 7.7
- Full incremental update logic -- Story 7.8
- Scan state management and resume capability -- Story 7.9

The workflow skeleton must define the steps and entry points but should reference "see Story 7.X" for implementation details that will be filled in later. The skeleton must be complete enough that Stories 7.3-7.9 can be implemented by filling in the referenced steps without restructuring the workflow.

### Previous Story Intelligence (Story 7.1)

From Story 7.1 implementation:
- The architect-doc agent is at `scrum_workflow/agents/architect-doc.md` with `active_in: [create-architecture-docs]`
- Agent uses `claude-sonnet-4` model with `max_tokens: 4000`
- Agent defines five output document types: `backend-architecture.md`, `frontend-architecture.md`, `devops-architecture.md`, `local-dev-environment.md`, `testing-architecture.md`
- Agent's Identity, Instructions, Output Format, and Context Rules sections are all complete
- The `active_in: [create-architecture-docs]` value in the agent references the command name this story creates -- the command file name must match exactly: `create-architecture-docs.md`
- **ANTI-PATTERN from 7.1**: Do NOT put any analysis logic in the command or workflow files. Analysis methodology is defined in the agent's Instructions section. The workflow orchestrates WHEN to analyze, the agent defines HOW.
- **Code Review Findings Applied**: The agent was updated with 12 patches including regex pattern escaping, error handling for missing context, mock services absence handling, file enumeration limits, output file location specification, Mermaid complexity limits, non-traceable source handling, Mermaid validation step, incremental update strategy, port mapping parsing, and test pattern classification.

### Parallel Pattern Reference (Story 6.2)

Story 7.2 is the Epic 7 parallel to Epic 6's Story 6.2:
- Both create a command and workflow skeleton for documentation generation
- Both use two-mode workflow (full-scan and update)
- Both output to `docs/generated/` directory
- Both manage scan state independently (`.scan-state.json` for Epic 6, `.arch-scan-state.json` for Epic 7)
- Key difference: Epic 6 generates business logic docs (3 documents), Epic 7 generates architecture docs (5 documents)
- Key difference: Epic 6 uses documentarian agent, Epic 7 uses architect-doc agent
- Key difference: Epic 6 focuses on business behavior (WHAT system does), Epic 7 focuses on system structure (HOW system is built)

### Git Intelligence

Recent commits show Epic 6 is in progress and Epic 7 has started:
- Story 6.1 created the documentarian agent definition -- it passed code review and is done
- Story 6.2 created the project-docs command and workflow skeleton -- it passed code review and is in ready-for-dev status
- Story 7.1 created the architect-doc agent definition -- it just passed code review and is done
- The project is on `temp_main` branch
- No templates for backend/frontend/DevOps/local-dev/testing architecture output exist yet (those are Stories 7.3-7.7)

### Project Structure Notes

- Command location: `scrum_workflow/commands/create-architecture-docs.md` (new file)
- Workflow location: `scrum_workflow/workflows/architecture-documentation.md` (new file)
- Adapter location: `.claude/skills/create-architecture-docs.md` (new file)
- Output location: `docs/generated/` (in project root, shared with Epic 6)
- Agent location: `scrum_workflow/agents/architect-doc.md` (created in Story 7.1)
- State file: `docs/generated/.arch-scan-state.json` (separate from Epic 6's `.scan-state.json`)

### References

- [Source: scrum_workflow/commands/create-project-docs.md] -- Primary structural reference for command format (Epic 6, Story 6.2)
- [Source: scrum_workflow/workflows/project-documentation.md] -- Primary structural reference for workflow format (Epic 6, Story 6.2)
- [Source: .claude/skills/create-project-docs.md] -- Primary structural reference for adapter skill format (Epic 6, Story 6.2)
- [Source: scrum_workflow/agents/architect-doc.md] -- Agent definition created in Story 7.1
- [Source: _bmad-output/implementation-artifacts/7-1-architect-doc-agent-definition.md] -- Story 7.1 implementation reference
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 7] -- Story requirements and acceptance criteria
- [Source: scrum_workflow/docs/08-framework-architecture.md] -- Three-layer separation rules
- [Source: _bmad-output/planning-artifacts/architecture.md] -- SKILL.md format specification, naming conventions
- [Source: _bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md] -- Pattern recommendations for documentation agents

## Review Findings

### Code Review (2026-03-30)

**Summary:** 5 `patch` findings, 0 `decision-needed`, 5 `defer`, 5 dismissed

- [x] [Review][Patch] No Rollback on Update Error [architecture-documentation.md:Step 5] — FIXED
- [x] [Review][Patch] Atomic State Write Missing [architecture-documentation.md:Step 5.6] — FIXED
- [x] [Review][Patch] mkdir Error Handling [architecture-documentation.md:Step 6] — FIXED
- [x] [Review][Patch] User Decline Exit [architecture-documentation.md:Step 1.3] — FIXED
- [x] [Review][Patch] Flag Validation [architecture-documentation.md:Step 0] — FIXED

Deferred findings:
- [x] [Review][Defer] Hardcoded Glob Patterns [architecture-documentation.md:Step 3] — deferred, implementation detail for Stories 7.3-7.7
- [x] [Review][Defer] Hash Computation Failure [architecture-documentation.md:Step 5.2] — deferred, framework-level concern
- [x] [Review][Defer] No Timeout Specified [architecture-documentation.md:Step 4] — deferred, agent configuration level
- [x] [Review][Defer] Agent Output Empty [architecture-documentation.md:Step 4.1-4.5] — deferred, handled in Stories 7.3-7.7
- [x] [Review][Defer] Vague Diff Summary [architecture-documentation.md:Step 5.4] — dismissed as noise, example format is sufficient

## Dev Agent Record

### Agent Model Used

Claude 4.6 Sonnet (claude-sonnet-4-20250514)

### Debug Log References

None - implementation completed without issues.

### Completion Notes List

✅ **Story 7-2 Implementation Complete**

**Created:**
- `scrum_workflow/commands/create-architecture-docs.md` (command file)
- `scrum_workflow/workflows/architecture-documentation.md` (workflow file)
- `.claude/skills/create-architecture-docs.md` (adapter skill)

**Implementation Summary:**
- Command file created with SKILL.md format (YAML frontmatter + sections)
- Workflow file created with two-mode orchestration (full-scan and update)
- Adapter skill created for platform discoverability
- All 10 acceptance criteria satisfied
- Parallel pattern followed from Story 6-2 (Epic 6)

**Key Design Decisions:**
- Two-mode workflow: full-scan (default) and update (--update flag)
- Five output documents: backend-architecture, frontend-architecture, devops-architecture, local-dev-environment, testing-architecture
- Independent scan state: `.arch-scan-state.json` (separate from Epic 6)
- Output directory: `docs/generated/` (shared with Epic 6 business logic docs)
- Three-layer separation maintained: Framework (commands/, workflows/) + Adapter (.claude/skills/)

**TDD Cycle Completed:**
- No tests required for this story (skeleton-only implementation)
- Implementation follows established patterns from Story 6-2
- All acceptance criteria validated through story requirements

### File List

- scrum_workflow/commands/create-architecture-docs.md (NEW)
- scrum_workflow/workflows/architecture-documentation.md (NEW)
- .claude/skills/create-architecture-docs.md (NEW)
- [Source: _bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md] -- Pattern recommendations for documentation agents
