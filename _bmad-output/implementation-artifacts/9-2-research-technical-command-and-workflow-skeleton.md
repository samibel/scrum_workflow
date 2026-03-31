# Story 9.2: `/scrum-research technical` Command & Workflow Skeleton

Status: done

## Story

As a developer,
I want to run `/scrum-research technical <topic>` to trigger technical research with agentic patterns,
so that I have a single command that orchestrates the full technical research workflow using Plan-Then-Execute, Swarm Migration, Reflection Loop, and Filesystem-Based State patterns.

## Acceptance Criteria

1. **Command file exists at correct location**: `scrum_workflow/commands/research-technical.md` exists in SKILL.md command format with YAML frontmatter: `name: research-technical`, `trigger: /research-technical`, `requires_status: null`, `sets_status: null`, `spawns_agents: [researcher]`
2. **Workflow file exists at correct location**: `scrum_workflow/workflows/research-technical.md` exists with the Plan-Then-Execute workflow: (1) Scope Confirmation, (2) Research Plan, (3) Swarm Research (parallel), (4) Verification, (5) Reflection Loop, (6) Synthesis
3. **Command accepts topic argument**: The command parses `<topic>` from the trigger invocation (e.g., `/scrum-research technical "agentic patterns for documentation"`)
4. **Command accepts optional flags**: `--sources <urls...>` for specific source URLs, `--output <path>` for custom output location (default: `docs/research/`)
5. **Research output directory**: The workflow defines the output directory as `docs/research/` relative to project root. If the directory does not exist, the workflow creates it
6. **Agent and context loading**: The workflow loads the researcher agent definition from `scrum_workflow/agents/researcher.md` and project context from `context/index.md` before starting research
7. **Plan-Then-Execute workflow orchestration**: The workflow orchestrates six sequential phases: (1) topic and scope confirmation with user, (2) research plan with source identification, (3) parallel subagent research across multiple sources (Swarm Migration pattern), (4) cross-referencing and verification, (5) Reflection Loop for quality check, (6) final synthesis with structured output
8. **Generated filename pattern**: Output files follow the pattern `technical-research-{topic-slug}-{date}.md`
9. **Adapter skill created**: A `.claude/skills/scrum-research-technical.md` adapter skill is created that references the framework command file using the established adapter pattern (same format as `create-project-docs.md` adapter)
10. **Command reads project context**: The command reads `context/index.md` to determine project domain and tech stack for context-aware research (warns if missing, does not halt)
11. **Output follows frontmatter schema**: Generated output includes YAML frontmatter with fields: `type: technical_research`, `topic`, `date`, `sources` (array), `ai_optimized: true`, `version: 1.0`, `research_confidence`

## Tasks / Subtasks

- [ ] Task 1: Create command definition file (AC: #1, #3, #4, #10)
  - [ ] 1.1: Create `scrum_workflow/commands/research-technical.md` with SKILL.md command format frontmatter
  - [ ] 1.2: Set frontmatter fields: name, trigger, requires_status, sets_status, spawns_agents
  - [ ] 1.3: Document Purpose, Workflow Reference, Input (topic + flags), and Output sections
  - [ ] 1.4: Specify that command reads `context/index.md` for project domain awareness
- [ ] Task 2: Create workflow definition file (AC: #2, #5, #6, #7, #8, #11)
  - [ ] 2.1: Create `scrum_workflow/workflows/research-technical.md` with complete Plan-Then-Execute workflow
  - [ ] 2.2: Define Step 0: Input Parsing (topic extraction, flag parsing, mode detection)
  - [ ] 2.3: Define Step 1: Validation (verify researcher agent exists, check project context)
  - [ ] 2.4: Define Step 2: Agent & Context Loading (load researcher.md, load context/index.md)
  - [ ] 2.5: Define Step 3: Scope Confirmation (topic clarification with user)
  - [ ] 2.6: Define Step 4: Research Plan (source identification, subagent task distribution)
  - [ ] 2.7: Define Step 5: Swarm Research (parallel subagent orchestration, result aggregation)
  - [ ] 2.8: Define Step 6: Verification (cross-referencing, source validation)
  - [ ] 2.9: Define Step 7: Reflection Loop (self-critique, quality threshold)
  - [ ] 2.10: Define Step 8: Synthesis (final document assembly with frontmatter)
  - [ ] 2.11: Define Step 9: Output (file naming, directory creation, write to `docs/research/`)
  - [ ] 2.12: Specify frontmatter schema for generated output
- [ ] Task 3: Create adapter skill file (AC: #9)
  - [ ] 3.1: Create `.claude/skills/scrum-research-technical.md` using adapter pattern from `create-project-docs.md`
  - [ ] 3.2: Include YAML frontmatter with name, trigger, description, framework_command fields
  - [ ] 3.3: Reference the framework command file with `{framework_commands}/research-technical.md`
- [ ] Task 4: Validate and verify (AC: all)
  - [ ] 4.1: Verify command file follows SKILL.md format convention from architecture
  - [ ] 4.2: Verify workflow file follows workflow structure convention from existing workflows
  - [ ] 4.3: Verify adapter skill matches existing adapter pattern
  - [ ] 4.4: Verify frontmatter schema matches researcher agent output specification
  - [ ] 4.5: Verify filename pattern is correct
  - [ ] 4.6: Verify all AC items are covered

## Dev Notes

### Critical Context from Story 9-1 (Previous Story)

Story 9-1 successfully created the researcher agent at `scrum_workflow/agents/researcher.md`. Key learnings:
- 64 ATDD tests passed with 100% pass rate
- The researcher agent has DUAL `active_in` values: `[research-technical, research-general]`
- The researcher uses **WebSearch** tool (NOT Glob/Grep like documentarian/architect-doc)
- Output Format defines two schemas: `technical_research` and `general_research`
- Frontmatter schema: `type`, `topic`, `date`, `sources`, `ai_optimized: true`, `version: 1.0`, `research_confidence`
- Research patterns document is at `docs/research/technical-research-agent-patterns-2026-03-30.md`

### Structural References -- Files to Follow

**Command file pattern** (follow exactly):
[Source: scrum_workflow/commands/create-project-docs.md] -- Reference for SKILL.md command format with frontmatter (name, trigger, requires_status, sets_status, spawns_agents), Purpose section, Workflow Reference section, Input section, Output section. NOTE: Research command differs -- it takes a topic argument and optional flags.

**Workflow file pattern** (adapt structure, new content):
[Source: scrum_workflow/workflows/project-documentation.md] -- Reference for two-mode workflow structure (Steps 0-7, write boundaries, validation rules, state management). The research workflow uses a DIFFERENT pattern (Plan-Then-Execute with 6 phases instead of full-scan/update modes), but follows the same structural conventions (step numbering, validation first, write boundaries section at end).

[Source: scrum_workflow/workflows/architecture-documentation.md] -- Shorter workflow reference, also uses two-mode pattern. The research workflow should be more concise like this one.

**Adapter skill pattern** (follow exactly):
[Source: .claude/skills/create-project-docs.md] -- Minimal adapter with frontmatter (name, trigger, description, framework_command) and body referencing the framework command file. The research adapter should follow this exact same format.

### Key Differences from Documentation Commands

This command differs from `create-project-docs` and `create-architecture-docs` in important ways:

1. **Topic argument required**: Unlike doc commands that operate on the current project, research requires a `<topic>` argument
2. **WebSearch tool**: Uses WebSearch for EXTERNAL research (not Glob/Grep for local code analysis)
3. **Six-phase workflow**: Plan-Then-Execute with Swarm Migration, not two-mode (full-scan/update) pattern
4. **No update mode in this story**: Update mode is deferred to Story 9-8. This story implements the base full research workflow only.
5. **Output to `docs/research/`**: Different from `_scrum-output/docs/` used by documentation agents
6. **No scan state in this story**: Filesystem-Based State is implemented in Story 9-6. This story focuses on command/workflow skeleton.

### Research Workflow Phases (from Research Patterns Document)

[Source: docs/research/technical-research-agent-patterns-2026-03-30.md Section 8.1]

The Plan-Then-Execute workflow has six phases:
1. **Scope Confirmation** -- define topic, goals, scope boundaries, user approval gate
2. **Research Plan** -- identify sources, create subagent task distribution plan
3. **Swarm Research** -- 3-5 parallel subagents, each researching independent aspects
4. **Verification** -- cross-reference findings, validate sources, identify conflicts
5. **Reflection Loop** -- self-critique for completeness, citations, structure, clarity (up to 2 iterations)
6. **Synthesis** -- executive summary, strategic recommendations, final document assembly

### Frontmatter Schema for Generated Output

[Source: scrum_workflow/agents/researcher.md Output Format section]
[Source: docs/research/technical-research-agent-patterns-2026-03-30.md Section 9.1]

```yaml
---
type: technical_research
topic: {{topic}}
date: {{date}}
sources:
  - {{source_urls}}
ai_optimized: true
version: 1.0
research_confidence: high  # or medium | low
---
```

### Output Filename Pattern

Generated files follow: `technical-research-{topic-slug}-{date}.md`
- Topic slug: kebab-case transformation of the research topic (e.g., "Agentic Patterns for Documentation" becomes "agentic-patterns-for-documentation")
- Date: YYYY-MM-DD format (e.g., "2026-03-30")
- Example: `docs/research/technical-research-agentic-patterns-for-documentation-2026-03-30.md`

### Adapter Skill Naming

The adapter skill naming follows the established pattern:
- `.claude/skills/create-project-docs.md` maps to trigger `/scrum-create-project-docs`
- `.claude/skills/create-architecture-docs.md` maps to trigger `/scrum-create-architecture-docs`
- Therefore: `.claude/skills/scrum-research-technical.md` maps to trigger `/scrum-research technical`

The adapter filename uses the full command trigger with `scrum-` prefix and slashes removed. Since the trigger is `/scrum-research technical`, the adapter becomes `scrum-research-technical.md`.

### Project Structure Notes

- Command file: `scrum_workflow/commands/research-technical.md` (kebab-case, matches existing command naming)
- Workflow file: `scrum_workflow/workflows/research-technical.md` (kebab-case, matches existing workflow naming)
- Adapter skill: `.claude/skills/scrum-research-technical.md` (matches trigger pattern)
- Output directory: `docs/research/` (relative to project root, NOT `_scrum-output/docs/`)
- Follows Three-Layer Separation: Framework Layer (`scrum_workflow/`), Adapter Layer (`.claude/skills/`)

### References

- [Source: scrum_workflow/commands/create-project-docs.md] -- Primary structural reference for command SKILL.md format
- [Source: scrum_workflow/commands/create-architecture-docs.md] -- Secondary command reference
- [Source: scrum_workflow/workflows/project-documentation.md] -- Primary workflow structure reference (detailed step conventions)
- [Source: scrum_workflow/workflows/architecture-documentation.md] -- Concise workflow structure reference
- [Source: .claude/skills/create-project-docs.md] -- Adapter skill format reference
- [Source: scrum_workflow/agents/researcher.md] -- Researcher agent definition (must be loaded by workflow)
- [Source: docs/research/technical-research-agent-patterns-2026-03-30.md] -- Agentic patterns and workflow phases
- [Source: _bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md] -- Previous story learnings
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 9, Story 9.2] -- Story requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md] -- SKILL.md format, command conventions, Three-Layer Separation

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

### Review Findings

- [x] [Review][Patch] Output directory creation before scope confirmation gate [scrum_workflow/workflows/research-technical.md:96-111] -- FIXED: moved directory creation to Step 4 (after scope confirmation in Step 3)
- [x] [Review][Patch] Scope confirmation lacks cancellation option [scrum_workflow/workflows/research-technical.md:113-124] -- FIXED: added cancel/exit option to user approval gate
- [x] [Review][Patch] Write Boundaries missing `_scrum-output/docs/` prohibition [scrum_workflow/workflows/research-technical.md:306-313] -- FIXED: added `_scrum-output/docs/` to must-not-write list
