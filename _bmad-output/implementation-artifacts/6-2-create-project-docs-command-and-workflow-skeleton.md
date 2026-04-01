# Story 6.2: `/scrum-create-project-docs` Command & Workflow Skeleton

Status: done

## Story

As a developer,
I want to run `/scrum-create-project-docs` to trigger business logic documentation generation,
so that I have a single command that orchestrates the full documentation workflow.

## Acceptance Criteria

1. **Command file exists at correct location**: `scrum_workflow/commands/create-project-docs.md` exists in SKILL.md command format with YAML frontmatter: `trigger: /create-project-docs`, `requires_status: null`, `sets_status: null`, `spawns_agents: [documentarian]`

2. **Workflow file exists at correct location**: `scrum_workflow/workflows/project-documentation.md` exists with the two-mode workflow: `full-scan` (default) and `update` (triggered by `--update` flag)

3. **Documentation output directory**: The workflow defines the documentation output directory as `docs/generated/` relative to project root

4. **Agent and context loading**: The workflow loads the documentarian agent definition and project context before starting analysis

5. **Full-scan mode orchestration**: In `full-scan` mode, the workflow orchestrates: (1) project structure scan, (2) business logic analysis -> `business-logic.md`, (3) workflow analysis -> `workflows.md`, (4) domain model analysis -> `domain-model.md`, (5) scan state persistence -> `.scan-state.json`

6. **Update mode orchestration**: In `update` mode, the workflow orchestrates: (1) load existing `.scan-state.json`, (2) identify changed files, (3) re-analyze changed areas, (4) show diff summary to user, (5) update docs upon user confirmation

7. **Project context reading**: The command reads `context/index.md` to determine project domain and tech stack

8. **Directory creation**: If `docs/generated/` does not exist, the workflow creates it

9. **Overwrite warning**: If `docs/generated/` already exists and mode is `full-scan`, the workflow warns: "Existing docs found. This will overwrite. Continue? [y/N]"

10. **Adapter skill creation**: A `.claude/skills/create-project-docs.md` adapter skill is created that references the framework command

## Tasks / Subtasks

- [x] Task 1: Create command file (AC: #1)
  - [x] 1.1: Create `scrum_workflow/commands/create-project-docs.md` with YAML frontmatter matching the SKILL.md command convention from existing commands (`create-ticket.md`, `create-project-context.md`, `dev-story.md`)
  - [x] 1.2: Frontmatter fields: `name: create-project-docs`, `trigger: "/scrum-create-project-docs"`, `requires_status: null`, `sets_status: null`, `spawns_agents: [documentarian]`
  - [x] 1.3: Write Purpose section describing the command as the entry point for business logic documentation generation
  - [x] 1.4: Write Workflow Reference section pointing to `workflows/project-documentation.md`
  - [x] 1.5: Write Input section describing command usage: `/scrum-create-project-docs` (full scan) and `/scrum-create-project-docs --update` (incremental update)
  - [x] 1.6: Write Output section listing the three generated files (`business-logic.md`, `workflows.md`, `domain-model.md`) plus `.scan-state.json`

- [x] Task 2: Create workflow file (AC: #2, #3, #4, #5, #6, #7, #8, #9)
  - [x] 2.1: Create `scrum_workflow/workflows/project-documentation.md` following the established workflow file pattern from `project-context.md`, `ticket-creation.md`, etc.
  - [x] 2.2: Write Prerequisites section requiring the documentarian agent definition (`scrum_workflow/agents/documentarian.md`) and optional project context (`context/index.md`)
  - [x] 2.3: Write Step 0 -- Mode Detection: parse command input to determine `full-scan` (default) vs `update` mode (when `--update` flag is present)
  - [x] 2.4: Write Step 1 -- Validation: check documentarian agent exists, check project context (warn if missing, do not halt), check `docs/generated/` existence for overwrite warning in full-scan mode
  - [x] 2.5: Write Step 2 -- Agent & Context Loading: load `scrum_workflow/agents/documentarian.md` for agent instructions, load `context/index.md` to understand project domain/tech stack
  - [x] 2.6: Write Step 3 -- Project Structure Scan: use Glob to discover source files, build file manifest for agent
  - [x] 2.7: Write Step 4 -- Full-Scan Mode: orchestrate three analysis phases referencing documentarian agent instructions: (a) business logic analysis -> `docs/generated/business-logic.md`, (b) workflow analysis -> `docs/generated/workflows.md`, (c) domain model analysis -> `docs/generated/domain-model.md`
  - [x] 2.8: Write Step 5 -- Update Mode: load `.scan-state.json`, identify changed files, re-analyze only changed areas, present diff summary, update docs upon user confirmation
  - [x] 2.9: Write Step 6 -- Scan State Persistence: write/update `docs/generated/.scan-state.json` with scan metadata (files scanned, timestamps, hashes, status)
  - [x] 2.10: Write Step 7 -- Output directory creation: if `docs/generated/` does not exist, create it before writing any files

- [x] Task 3: Create adapter skill file (AC: #10)
  - [x] 3.1: Create `.claude/skills/create-project-docs.md` following exact pattern from `create-project-context.md` and `create-ticket.md` adapter skills
  - [x] 3.2: YAML frontmatter: `name: create-project-docs`, `trigger: /create-project-docs`, `description: Generate business logic documentation for existing projects`, `framework_command: {framework_commands}/create-project-docs.md`
  - [x] 3.3: Body text referencing the framework command file

## Dev Notes

### Architecture Compliance

- **Three-Layer Separation**: The command file (`create-project-docs.md`) goes in Framework Layer (`scrum_workflow/commands/`). The workflow file (`project-documentation.md`) goes in Framework Layer (`scrum_workflow/workflows/`). The adapter skill (`create-project-docs.md`) goes in Adapter Layer (`.claude/skills/`). These three layers MUST be kept separate.
- **Command-as-Orchestrator Pattern**: The command file is WHAT (entry point, agent spawning, orchestration). The workflow file is HOW (step-by-step execution). The command references the workflow. This is the same pattern as `create-ticket.md` -> `ticket-creation.md` and `create-project-context.md` -> `project-context.md`.
- **No Project-Specific State in Framework**: The framework files (`scrum_workflow/`) never contain project-specific data. The `docs/generated/` output directory is created in the project root, NOT inside `scrum_workflow/`.
- **SKILL.md Format**: Both command and adapter files use YAML frontmatter + Markdown body. Command frontmatter has: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`. Adapter frontmatter has: `name`, `trigger`, `description`, `framework_command`.
- **Naming Convention**: kebab-case filenames (`create-project-docs.md`, `project-documentation.md`). The `scrum-` prefix is used ONLY in user-facing triggers (e.g., `/scrum-create-project-docs`), NOT in internal framework filenames.
- **NFR4 Compliance**: Adding a new command = new Markdown files in commands/ and workflows/ directories. Zero code changes needed.
- **NFR9 Compliance**: No runtime dependencies. Pure file-based interpretation by the AI platform.

### Existing Pattern References (MUST FOLLOW)

**Command File Pattern** -- follow exactly from `create-project-context.md`:
```yaml
---
name: create-project-context
trigger: "/scrum-create-project-context"
requires_status: null
sets_status: null
spawns_agents: []
---
```
Sections: Purpose, Workflow Reference, Input, Output. The `create-project-docs` command differs by having `spawns_agents: [documentarian]` (it spawns the documentarian agent).

**Workflow File Pattern** -- follow from `project-context.md` and `ticket-creation.md`:
- Title with workflow description
- Prerequisites section listing required files
- Numbered steps with clear substeps
- Each step has validation, action, and error handling
- Write Boundaries section at the end specifying what the workflow may and may not write

**Adapter Skill Pattern** -- follow exactly from `create-project-context.md`:
```yaml
---
name: create-project-context
trigger: /create-project-context
description: Analyze codebase and generate project context for Scrum framework
framework_command: {framework_commands}/create-project-context.md
---
```
Body: brief description + framework command file reference. Adapter is a thin reference -- NO workflow logic in the adapter.

### Key Design Decisions from Epic & Architecture

1. **Two Modes**: `full-scan` (default) and `update` (with `--update` flag). Full-scan generates everything from scratch. Update mode is incremental (Stories 6.6-6.7 implement the full update logic, but the workflow skeleton must define the mode switching and entry points now).
2. **Output Directory**: `docs/generated/` relative to project root. NOT inside `scrum_workflow/`. NOT inside `sprints/`. This is a separate documentation output area.
3. **Three Output Files**: `business-logic.md`, `workflows.md`, `domain-model.md` -- defined by the documentarian agent's Output Format section. The workflow orchestrates their creation but the agent defines their structure.
4. **Scan State**: `.scan-state.json` in `docs/generated/` tracks what was scanned. Full details are Story 6.7's responsibility, but the workflow skeleton must reference it.
5. **Single Agent, No Multi-Agent Orchestration**: The documentarian is the only agent. The command/workflow drives the phases (scan, analyze, generate). This is simpler than the `refine-ticket` pattern which spawns 3 agents in parallel.
6. **Overwrite Safety**: In full-scan mode, if `docs/generated/` already has content, warn the user before overwriting. This is FR66-style safety for full-scan (update mode has its own diff-based safety).
7. **Context Loading**: The workflow loads `context/index.md` for project understanding. If context files don't exist, warn but proceed (same pattern as `ticket-creation.md` Step 0.1).
8. **Language-Agnostic**: The documentarian uses Glob+Grep, not AST parsing. The workflow must NOT add any language-specific tooling (FR69).

### Scope Boundaries

**IN scope for this story (skeleton)**:
- Command file with complete YAML frontmatter and all sections
- Workflow file with all steps defined (mode detection, validation, agent loading, full-scan orchestration, update-mode orchestration, scan state, directory creation)
- Adapter skill file
- Write Boundaries section in the workflow

**OUT of scope (later stories)**:
- Output templates for the three documents (`business-logic.md`, `workflows.md`, `domain-model.md`) -- Stories 6.3, 6.4, 6.5
- Actual analysis logic (grep patterns, Mermaid generation) -- Stories 6.3, 6.4, 6.5
- Full incremental update logic -- Story 6.6
- Scan state management and resume capability -- Story 6.7

The workflow skeleton must define the steps and entry points but should reference "see Story 6.X" for implementation details that will be filled in later. The skeleton must be complete enough that Stories 6.3-6.7 can be implemented by filling in the referenced steps without restructuring the workflow.

### Previous Story Intelligence (Story 6.1)

From Story 6.1 implementation:
- The documentarian agent is at `scrum_workflow/agents/documentarian.md` with `active_in: [create-project-docs]`
- Agent uses `claude-sonnet-4` model with `max_tokens: 4000`
- Agent defines three output document types: `business-logic.md`, `workflows.md`, `domain-model.md`
- Agent's Identity, Instructions, Output Format, and Context Rules sections are all complete
- The `active_in: [create-project-docs]` value in the agent references the command name this story creates -- the command file name must match exactly: `create-project-docs.md`
- `max_tokens: 4000` (not 2000) because documentation output is larger than refinement perspectives
- **ANTI-PATTERN from 6.1**: Do NOT put any analysis logic in the command or workflow files. Analysis methodology is defined in the agent's Instructions section. The workflow orchestrates WHEN to analyze, the agent defines HOW.

### Git Intelligence

Recent commits show Epic 5 (installer) is complete and Epic 6 has started:
- Story 6.1 created the documentarian agent definition -- it passed code review and is done
- The project is on `temp_main` branch
- No templates for business-logic/workflows/domain-model output exist yet (those are Stories 6.3-6.5)

### Project Structure Notes

Files to create:
1. `scrum_workflow/commands/create-project-docs.md` (NEW) -- alongside existing: `create-ticket.md`, `create-project-context.md`, `dev-story.md`, `refine-ticket.md`
2. `scrum_workflow/workflows/project-documentation.md` (NEW) -- alongside existing: `ticket-creation.md`, `project-context.md`, `development.md`, `refinement.md`, `review.md`, `approval.md`, `readiness-check.md`
3. `.claude/skills/create-project-docs.md` (NEW) -- alongside existing adapter skills: `create-project-context.md`, `create-ticket.md`, `dev-story.md`, `refine-ticket.md`

Files NOT to create or modify:
- Do NOT modify `scrum_workflow/agents/documentarian.md` (already complete from Story 6.1)
- Do NOT create output templates (Stories 6.3-6.5)
- Do NOT modify `scrum_workflow/config.yaml` (commands are discovered by file presence, not config registration)
- Do NOT modify `_bmad/bmm/config.yaml`
- Do NOT create `docs/generated/` directory (that is created at runtime by the workflow)

### Write Boundaries for the Workflow

The workflow file MUST include a Write Boundaries section specifying:

**May write:**
- `docs/generated/business-logic.md`
- `docs/generated/workflows.md`
- `docs/generated/domain-model.md`
- `docs/generated/.scan-state.json`

**May NOT write:**
- `scrum_workflow/` -- Framework files are read-only during execution
- `sprints/` -- Sprint files are managed by other commands
- `context/` -- Context files are managed by `/scrum-create-project-context`
- `.claude/skills/` -- Adapter skills are static, not modified at runtime

### References

- [Source: scrum_workflow/commands/create-project-context.md] -- Primary command file pattern reference
- [Source: scrum_workflow/commands/create-ticket.md] -- Secondary command file pattern reference
- [Source: scrum_workflow/commands/dev-story.md] -- Command frontmatter pattern reference
- [Source: scrum_workflow/workflows/project-context.md] -- Primary workflow file pattern reference (two-phase: Analysis + Generation)
- [Source: scrum_workflow/workflows/ticket-creation.md] -- Workflow validation and step pattern reference
- [Source: scrum_workflow/workflows/development.md] -- Workflow guard condition pattern reference
- [Source: .claude/skills/create-project-context.md] -- Primary adapter skill pattern reference
- [Source: .claude/skills/create-ticket.md] -- Secondary adapter skill pattern reference
- [Source: scrum_workflow/agents/documentarian.md] -- Agent definition this command spawns (Story 6.1 output)
- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.2] -- Story requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md] -- Three-layer separation, command-as-orchestrator, adapter pattern
- [Source: _bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md] -- Documentation agent patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

No issues encountered. All three files created following established patterns.

### Completion Notes List

- Created command file `scrum_workflow/commands/create-project-docs.md` with YAML frontmatter (name, trigger, requires_status, sets_status, spawns_agents) and Purpose, Workflow Reference, Input, Output sections matching the `create-project-context.md` pattern
- Created workflow file `scrum_workflow/workflows/project-documentation.md` with 8 steps: Mode Detection (Step 0), Validation (Step 1), Agent & Context Loading (Step 2), Project Structure Scan (Step 3), Full-Scan Mode (Step 4), Update Mode (Step 5), Scan State Persistence (Step 6), Output Directory Creation (Step 7), plus Write Boundaries and Validation Rules sections
- Created adapter skill file `.claude/skills/create-project-docs.md` following the exact thin-reference pattern from existing adapters
- All 10 acceptance criteria verified and satisfied
- Three-layer separation maintained: command in Framework commands/, workflow in Framework workflows/, adapter in Adapter .claude/skills/
- No analysis logic duplicated in command or workflow -- agent defines HOW, workflow defines WHEN (per anti-pattern from Story 6.1)
- Future stories (6.3-6.7) referenced with "See Story 6.X" placeholders in the workflow skeleton

### File List

- `scrum_workflow/commands/create-project-docs.md` (NEW)
- `scrum_workflow/workflows/project-documentation.md` (NEW)
- `.claude/skills/create-project-docs.md` (NEW)

### Review Findings

- [x] [Review][Patch] Workflow Step 7 (Output Directory Creation) placed after file-writing steps -- moved to Step 4, renumbered subsequent steps
- [x] [Review][Patch] `.scan-state.json` literal in Step 1.4 caused ordering test failure -- rephrased to generic "scan state file" reference
- [x] [Review][Patch] Write Boundaries "may NOT write" phrasing did not match test regex -- added inline summary listing prohibited directories

All 3 findings fixed. 81/81 ATDD tests passing.

### Change Log

- 2026-03-30: Story 6.2 implementation complete -- created command, workflow, and adapter skill files for `/scrum-create-project-docs`
- 2026-03-30: Code review complete -- fixed 3 structural issues in workflow file (step ordering, scan-state reference position, Write Boundaries phrasing). All 81 ATDD tests pass.
