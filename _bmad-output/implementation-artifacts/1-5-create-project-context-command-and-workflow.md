# Story 1.5: /create-project-context Command & Workflow

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to run `/create-project-context` to automatically analyze my codebase,
So that agents understand my project's tech stack, architecture, and conventions before any ticket work begins.

## Acceptance Criteria

1. **Given** the framework is installed with templates from Story 1.4
   **When** the user runs `/create-project-context` in a project
   **Then** `scrum_workflow/commands/create-project-context.md` exists in SKILL.md command format with frontmatter: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`

2. **And** `scrum_workflow/workflows/project-context.md` exists with the two-phase workflow (Phase A: Analysis via shell commands, Phase B: Generation via templates)

3. **And** Phase A collects facts via shell commands: directory structure, dependency files (`package.json`, `requirements.txt`, etc.), Docker/CI config, test patterns

4. **And** Phase B fills context templates with collected facts and writes to `project-root/context/*.md`

5. **And** `context/index.md` is generated as discovery index with agent loading map (which agent loads which domain files)

6. **And** domain skill files are generated in `project-root/skills/*/SKILL.md` for each detected domain

7. **And** only context files for detected domains are generated -- no empty files for missing domains

8. **And** every generated `context/*.md` has valid YAML frontmatter

9. **And** `index.md` references all generated sub-files (cross-reference validation)

10. **And** running the command again overwrites cleanly (idempotent, MVP behavior)

## Tasks / Subtasks

- [x] Create `/create-project-context` command definition (AC: 1)
  - [x] Create `scrum_workflow/commands/create-project-context.md` in SKILL.md command format
  - [x] Frontmatter fields in exact order: `name: create-project-context`, `trigger: "/create-project-context"`, `requires_status: null`, `sets_status: null`, `spawns_agents: []`
  - [x] Markdown body sections in exact order: Purpose, Workflow Reference, Input, Output
  - [x] Purpose: analyze codebase and generate project-specific context and skill files
  - [x] Workflow Reference: `workflows/project-context.md`
  - [x] Input: project root directory (implicit from current working directory)
  - [x] Output: `context/*.md` and `skills/*/SKILL.md` in project root
- [x] Create project context workflow (AC: 2, 3, 4, 5, 6, 7, 8, 9, 10)
  - [x] Create `scrum_workflow/workflows/project-context.md` with two-phase workflow
  - [x] Phase A (Analysis) -- fact collection via shell commands:
    - [x] Directory structure recognition: `ls` / glob patterns to identify project layout
    - [x] Dependency detection: read `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml`, `build.gradle`, `Gemfile`, `composer.json` (whichever exist)
    - [x] Infrastructure recognition: read `Dockerfile`, `docker-compose.yml`, `docker-compose.yaml`
    - [x] CI/CD recognition: read `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`
    - [x] Test pattern detection: glob `**/*.test.*`, `**/*.spec.*`, `**/test_*.py`, `**/*_test.go`
    - [x] Framework detection: infer from dependencies (e.g., `react` = frontend, `fastapi` = backend, `express` = backend)
    - [x] Domain classification: determine which domains exist (frontend, backend, testing, devops, architecture)
  - [x] Phase B (Generation) -- template-based file creation:
    - [x] For each detected domain, load template from `scrum_workflow/templates/context-{domain}.md`
    - [x] Fill template variables with facts from Phase A
    - [x] Write filled content to `project-root/context/{domain}.md`
    - [x] Generate `context/index.md` from `scrum_workflow/templates/context-index.md` with all detected domains and agent loading map
    - [x] For each detected domain, load template from `scrum_workflow/templates/skill-{domain}.md`
    - [x] Fill skill template with project-specific facts and write to `project-root/skills/{domain}/SKILL.md`
    - [x] Ensure `index.md` references every generated sub-file (cross-reference validation)
  - [x] Idempotency: overwrite existing context and skill files cleanly when run again
  - [x] Validation: every generated `context/*.md` must have valid YAML frontmatter with at minimum `domain` and `generated` fields
  - [x] Only generate files for detected domains -- skip domains with no evidence in codebase

## Dev Notes

This is the last story in Epic 1 and the first command that actually executes a workflow. All previous stories built the foundation: directory structure (1.1), agent definitions (1.2), platform adapter (1.3), and templates (1.4). This story brings it together by creating the first executable command + workflow pair.

`/create-project-context` is Phase 0 in the architecture -- it must run before any ticket work. The output (context/ and skills/ directories) feeds into all subsequent commands: `/create-ticket` reads context for story generation, `/refine-ticket` loads domain-specific context and skills per agent, `/dev-story` loads context for implementation.

### Architecture Context

**Phase 0 Decision (Architecture Decision 1):**
- `/create-project-context` is a new Phase 0 not in PRD but architecturally required to solve context-mismatch (PRD Journey 4)
- Two-phase approach: Phase A collects facts via shell commands (no hallucination), Phase B fills templates with facts
- This is the only command that writes to `context/` and `skills/` -- all other commands only read from them

**Command-as-Orchestrator Pattern (Architecture Decision 4):**
- The command file (`commands/create-project-context.md`) IS the orchestrator
- It references `workflows/project-context.md` for detailed step-by-step execution
- No separate orchestrator agent needed
- `spawns_agents: []` because this command does not use sub-agents -- it runs as a single orchestrator

**Context File Structure (Architecture Decision 2):**
- Sharded context with index-based discovery
- Each agent loads only its relevant domain files
- `index.md` contains agent loading map defining which agent loads which files
- Only files for detected domains are generated -- no empty files for missing domains
- Token budget per agent stays low (~500-800 tokens per sub-file)

**Agent Loading Map (from Architecture):**

| Agent | Loads |
|---|---|
| Orchestrator | index.md only |
| Architect | index.md, architecture.md, backend.md, frontend.md |
| Developer | index.md, {story-relevant-domain}.md |
| QA | index.md, testing.md, {story-relevant-domain}.md |

**Two Types of Skills (Architecture):**

| Type | Location | Generated By | Purpose |
|---|---|---|---|
| Workflow Skills | `scrum_workflow/skills/` (framework) | Framework author | Generic, shared across projects |
| Domain Skills | `project-root/skills/` (project) | `/create-project-context` | Project-specific, generated from codebase |

**Write Boundaries:**
- `/create-project-context` may write: `context/*.md`, `skills/*/SKILL.md`
- `/create-project-context` may NOT write: `sprints/`, `story.md`, `refinement.md`, or any framework files

**Three-Layer Separation:**
- Framework Layer (`scrum_workflow/`): contains templates -- read-only during this command
- Adapter Layer (`.claude/`): not touched by this command
- State Layer (`context/`, `skills/`): this is what gets generated

### SKILL.md Command Format (Exact Pattern)

The command file MUST follow this exact SKILL.md command format from Architecture Pattern 2:

```yaml
---
name: create-project-context
trigger: "/create-project-context"
requires_status: null
sets_status: null
spawns_agents: []
---

## Purpose
[What this command does]

## Workflow Reference
workflows/project-context.md

## Input
[What the command expects]

## Output
[Which files are created/modified]
```

**Field order matters.** Sections in exactly this order. No agent may add or rename sections.

### Phase A Shell Commands (Architecture Decision 1)

The workflow must specify these exact shell command patterns for fact collection:

- `glob` / `ls` -- directory structure recognition
- `cat package.json`, `requirements.txt`, `go.mod` -- dependency detection
- `cat docker-compose.yml`, `Dockerfile` -- infrastructure recognition
- `glob **/*.test.*`, `**/*.spec.*` -- test pattern detection
- `cat .github/workflows/*.yml` -- CI/CD recognition

The agent uses REAL shell commands to gather facts -- no hallucination. This is Shell Command Contextualization pattern from the architecture.

### Phase B Template Usage

Templates already exist from Story 1.4:

**Context templates** (in `scrum_workflow/templates/`):
- `context-index.md` -- discovery index with agent loading map
- `context-frontend.md` -- Framework, Components, State, Routing, Conventions
- `context-backend.md` -- Language, Framework, API Design, Database, Conventions
- `context-testing.md` -- Test Frameworks, Coverage, CI Integration, Conventions
- `context-devops.md` -- CI/CD, Docker, Cloud, Deployment, Monitoring
- `context-architecture.md` -- Key Decisions, Patterns, Dependencies, Constraints

**Skill templates** (in `scrum_workflow/templates/`):
- `skill-backend.md` -- SKILL.md format for backend specialist
- `skill-frontend.md` -- SKILL.md format for frontend specialist
- `skill-testing.md` -- SKILL.md format for testing specialist
- `skill-devops.md` -- SKILL.md format for DevOps specialist
- `skill-project-architect.md` -- SKILL.md format for project architect

Each template has `{{variable_name}}` placeholders and `<!-- Fill from Phase A analysis -->` comments. Phase B replaces these with actual facts.

### Validation Rules

- Every generated `context/*.md` must have valid YAML frontmatter with `domain` and `generated` fields
- `context/index.md` must reference all generated sub-files (cross-reference check)
- No sub-file without entry in `index.md`
- No empty files for domains not detected in the project
- All files must use kebab-case naming
- All YAML fields must use snake_case
- Generated skill files must follow SKILL.md format: frontmatter (`name`, `role`, `description`) + body sections (Identity, Instructions, Output Format, Context Rules)

### Naming & Format Conventions

- File naming: kebab-case (`create-project-context.md`, `project-context.md`)
- YAML fields: snake_case (`requires_status`, `spawns_agents`)
- Heading hierarchy: `#` title, `##` sections, `###` subsections
- Lists: `-` prefix (not `*` or `+`)
- Code blocks: always with language tag
- Strings with special chars: quoted in YAML
- Null values: explicit `null`
- Dates: ISO 8601

### Output Directory Structure

After running `/create-project-context`, the project should have:

```
project-root/
├── context/
│   ├── index.md              ← Always generated
│   ├── frontend.md           ← Only if frontend detected
│   ├── backend.md            ← Only if backend detected
│   ├── testing.md            ← Only if tests detected
│   ├── devops.md             ← Only if CI/Docker detected
│   └── architecture.md       ← Only if architectural patterns detected
└── skills/
    ├── backend/SKILL.md      ← Only if backend detected
    ├── frontend/SKILL.md     ← Only if frontend detected
    ├── testing/SKILL.md      ← Only if tests detected
    ├── devops/SKILL.md       ← Only if CI/Docker detected
    └── project-architect/SKILL.md ← Only if architectural patterns detected
```

### Project Structure Notes

- Story 1.1 created `scrum_workflow/commands/` with README.md placeholder
- Story 1.1 created `scrum_workflow/workflows/` with README.md placeholder
- Story 1.4 created all 11 context and skill templates in `scrum_workflow/templates/`
- The `commands/` and `workflows/` directories currently only contain README.md files -- this story creates the first actual command and workflow files
- Story 1.3 created the Claude Code adapter in `.claude/` -- this command should already be registered there as `create-project-context` skill
- Do NOT modify framework templates when running the command -- templates are read-only references
- Output goes to project-root `context/` and `skills/` directories (State Layer), never into `scrum_workflow/` (Framework Layer)

### Previous Story Intelligence

**From Story 1.1 (Framework Directory Structure):**
- Directory structure established: `scrum_workflow/` with `agents/`, `commands/`, `workflows/`, `skills/`, `templates/`, `context/`, `data/`
- `config.yaml` with platform, active_agents, token_budgets, framework_version
- Kebab-case files, snake_case YAML, convention-over-configuration
- Zero runtime dependencies -- pure YAML/Markdown

**From Story 1.2 (Agent Definitions):**
- SKILL.md format established for agents: frontmatter (`name`, `display_name`, `role`, `active_in`, `model`, `max_tokens`) + body (Identity, Instructions, Output Format, Context Rules)
- Three MVP agents: architect.md, developer.md, qa.md
- Table-based output format for findings

**From Story 1.3 (Platform Adapter Contract):**
- Claude Code adapter in `.claude/` with skill registration files
- `framework_path` in project config.yaml for path references
- Review found path inconsistency issues -- ensure template references use consistent paths
- No workflow logic in adapters

**From Story 1.4 (Output Templates):**
- All 16 templates created in `scrum_workflow/templates/`
- Context templates have `domain` and `generated` frontmatter fields
- Skill templates follow SKILL.md format with frontmatter + 4 body sections
- Templates use `{{variable_name}}` for runtime replacement
- `.gitkeep` files removed, README.md preserved

**Key Learnings from Previous Stories:**
- Path consistency is critical -- Story 1.3 review caught inconsistencies
- SKILL.md format is strict: field order and section order must match exactly
- Templates define structure; runtime commands fill in values
- All framework files are declarative -- no compiled code
- Convention-over-configuration: defaults for everything, minimal required fields

### Testing Standards

**Verification Checklist:**
1. `scrum_workflow/commands/create-project-context.md` exists with correct SKILL.md command format
2. Command frontmatter has all 5 fields in correct order: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`
3. Command body has all 4 sections in correct order: Purpose, Workflow Reference, Input, Output
4. `scrum_workflow/workflows/project-context.md` exists with two-phase workflow
5. Workflow Phase A specifies shell commands for: directory structure, dependencies, Docker/CI, test patterns
6. Workflow Phase B specifies template filling and file generation for context/ and skills/
7. Workflow includes domain detection logic (only generate files for detected domains)
8. Workflow includes idempotency behavior (overwrite cleanly on re-run)
9. Workflow includes validation rules (YAML frontmatter, cross-reference check)
10. All files use kebab-case naming and snake_case YAML fields
11. No workflow logic leaks into adapter layer

**Manual Testing:**
- Verify command file parses as valid YAML frontmatter + Markdown
- Verify workflow covers both Phase A and Phase B completely
- Verify all context template references match actual template filenames from Story 1.4
- Verify all skill template references match actual template filenames from Story 1.4
- Verify the agent loading map in the workflow matches Architecture Decision 2

### References

**Source Documents:**
- Phase 0 /create-project-context: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-1-Project-Context-Discovery-Phase-0]
- Context File Structure: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-2-Context-File-Structure]
- Command-as-Orchestrator: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-4-Agent-Orchestration-Model]
- SKILL.md Command Format: [Source: _bmad-output/planning-artifacts/architecture.md#2-SKILL-md-Structure-Patterns]
- Shell Command Contextualization: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-1-Project-Context-Discovery-Phase-0]
- Agent Loading Map: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-2-Context-File-Structure]
- Two Types of Skills: [Source: _bmad-output/planning-artifacts/architecture.md#Two-Types-of-Skills]
- Write Boundary Rules: [Source: _bmad-output/planning-artifacts/architecture.md#6-Write-Boundary-Rules]
- Three-Layer Separation: [Source: _bmad-output/planning-artifacts/architecture.md#Architectural-Core-Principle-SDK-Framework-Pattern]
- Complete Framework Structure: [Source: _bmad-output/planning-artifacts/architecture.md#Complete-Framework-Directory-Structure]
- Epic 1 Story 1.5: [Source: _bmad-output/planning-artifacts/epics.md#Story-15-create-project-context-Command-Workflow]
- Naming Patterns: [Source: _bmad-output/planning-artifacts/architecture.md#1-Naming-Patterns]
- Markdown & YAML Conventions: [Source: _bmad-output/planning-artifacts/architecture.md#4-Markdown-YAML-Conventions]

**Related Stories:**
- Story 1.1: Created framework directory structure (foundation for commands/ and workflows/)
- Story 1.2: Established SKILL.md format (used by command definition)
- Story 1.3: Created Claude Code adapter (command should already be registered)
- Story 1.4: Created all context and skill templates (input for Phase B generation)
- Story 2.1: Will use the context generated by this command for story creation
- Story 2.2: `/create-ticket` reads `context/index.md` for story generation
- Story 3.1: `/refine-ticket` loads domain-specific context and skills per agent

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Tests initially failed on file existence due to relative path resolution from test-artifacts directory. Fixed by using `path.resolve(__dirname, '..', '..')` to resolve paths relative to project root.
- Pre-existing test failures in `framework-structure-validation.spec.ts` (same CWD issue) and `agent-definitions-validation.spec.ts` (TypeScript regex flag issue) are not caused by this story's changes.

### Implementation Plan

- Task 1: Created command definition file following exact SKILL.md command format with 5 frontmatter fields in specified order and 4 body sections in specified order.
- Task 2: Created two-phase workflow file covering Phase A (7 analysis steps using shell commands) and Phase B (5 generation steps using templates). Includes idempotency, validation rules, cross-reference validation, write boundaries, and domain-conditional generation.
- Testing: Created 43 ATDD tests covering all 10 acceptance criteria, naming conventions, and structural validation. All tests pass.

### Completion Notes List

- Created `scrum_workflow/commands/create-project-context.md` with SKILL.md command format: 5 frontmatter fields (name, trigger, requires_status, sets_status, spawns_agents) and 4 body sections (Purpose, Workflow Reference, Input, Output)
- Created `scrum_workflow/workflows/project-context.md` with comprehensive two-phase workflow: Phase A (7 analysis steps: directory structure, dependency detection, infrastructure recognition, CI/CD recognition, test pattern detection, framework detection, domain classification) and Phase B (5 generation steps: context file generation, index generation, skill file generation, cross-reference validation, frontmatter validation)
- Workflow includes idempotency behavior (clean overwrite on re-run), write boundary enforcement, validation rules (YAML frontmatter, cross-reference), and domain-conditional generation (only detected domains)
- All template references match actual template filenames from Story 1.4
- Agent loading map in workflow matches Architecture Decision 2
- 43 ATDD tests pass with zero regressions

### Change Log

- 2026-03-25: Story 1-5 implementation complete. Created command definition and workflow files. Added 43 ATDD validation tests.

### Review Findings

- [x] [Review][Patch] Missing tsconfig.json in test-artifacts causes ts-jest TS151001 warning [_bmad-output/test-artifacts/tsconfig.json] -- fixed: added tsconfig.json with esModuleInterop enabled
- [x] [Review][Dismiss] Silent early-return guard pattern in tests -- dismissed, first test in each describe block already enforces existence via expect()

### File List

- scrum_workflow/commands/create-project-context.md (new)
- scrum_workflow/workflows/project-context.md (new)
- _bmad-output/test-artifacts/create-project-context-validation.spec.ts (new)
- _bmad-output/test-artifacts/tsconfig.json (new, added during code review)
