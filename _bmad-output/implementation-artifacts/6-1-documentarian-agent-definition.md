# Story 6.1: Documentarian Agent Definition

Status: done

## Story

As a developer,
I want a dedicated documentation agent defined in SKILL.md format,
so that the agent has a clear identity, instructions, and output format for generating business logic documentation with Mermaid diagrams.

## Acceptance Criteria

1. **Agent file exists at correct location**: `scrum_workflow/agents/documentarian.md` exists alongside `architect.md`, `developer.md`, `qa.md`

2. **YAML frontmatter follows established convention**: File has valid YAML frontmatter with exactly these fields:
   - `name: documentarian`
   - `display_name: Documentarian`
   - `role:` a concise role description focused on business logic documentation
   - `active_in: [create-project-docs]`
   - `model: claude-sonnet-4`
   - `max_tokens: 4000`

3. **Identity section defines agent persona**: Describes the agent as a business logic analyst specializing in reading existing codebases and generating structured documentation with Mermaid diagrams. Focuses on business rules, workflows, and domain models -- NOT architecture, infrastructure, or API surface.

4. **Instructions section specifies analysis methodology**: Includes a numbered list covering:
   - Systematic codebase scanning via Glob and Grep (language-agnostic, no AST)
   - Business rule identification (validations, guards, conditionals with domain terms)
   - Workflow tracing (state machines, event handlers, pipelines)
   - Domain entity extraction (models, schemas, relationships)
   - Mermaid diagram generation (flowchart, stateDiagram-v2, sequenceDiagram, classDiagram, erDiagram)
   - Source reference inclusion (file:line for all documented logic)

5. **Instructions section includes grep pattern reference**: Lists concrete grep patterns the agent uses to find business logic:
   - Business rules: `validate*`, `check*`, `ensure*`, `*Policy`, `*Rule`, `*Strategy`, `*Validator`
   - Guard clauses: `throw`, `reject`, `deny`, `forbidden`, `unauthorized`
   - Workflows: `status`, `state`, `transition`, `handle*`, `on*`, `emit`, `dispatch`
   - Domain entities: `class`, `interface`, `type`, `struct`, `model`, `schema`, `entity`
   - Relationships: `hasMany`, `belongsTo`, `references`, `extends`, `implements`

6. **Output Format section defines three document types**: Each with required sections and Mermaid diagram types:
   - `business-logic.md`: Business Rules (grouped by domain area), Validation Rules, Guard Clauses -- uses `flowchart` for decision trees
   - `workflows.md`: State Machines, Event Flows, Process Pipelines -- uses `stateDiagram-v2`, `sequenceDiagram`, `flowchart LR`
   - `domain-model.md`: Core Entities, Relationships, Value Objects -- uses `classDiagram`, `erDiagram`

7. **Context Rules section specifies context loading order**: Lists files in priority order:
   - `context/index.md` -- Project context overview
   - Relevant domain context files (`context/backend.md`, `context/frontend.md`, etc.)
   - `config.yaml` -- Framework configuration for project metadata
   - Source code files discovered via Glob/Grep during analysis

8. **File follows exact structure convention**: Same section order as `architect.md`: frontmatter -> Identity -> Instructions -> Output Format -> Context Rules. No extra sections, no missing sections.

## Tasks / Subtasks

- [x] Task 1: Create agent definition file (AC: #1, #2, #8)
  - [x] 1.1: Create `scrum_workflow/agents/documentarian.md` with YAML frontmatter matching convention from `architect.md`
  - [x] 1.2: Verify frontmatter fields: name, display_name, role, active_in, model, max_tokens
- [x] Task 2: Write Identity section (AC: #3)
  - [x] 2.1: Define agent persona focused on business logic documentation (NOT architecture)
  - [x] 2.2: Emphasize language-agnostic analysis and Mermaid diagram generation
- [x] Task 3: Write Instructions section (AC: #4, #5)
  - [x] 3.1: Write numbered analysis methodology (scan, identify, trace, extract, diagram, reference)
  - [x] 3.2: Include concrete grep patterns for each analysis dimension
  - [x] 3.3: Specify exclusions (no infrastructure, no logging, no error handling plumbing)
- [x] Task 4: Write Output Format section (AC: #6)
  - [x] 4.1: Define `business-logic.md` output structure with flowchart Mermaid
  - [x] 4.2: Define `workflows.md` output structure with stateDiagram-v2 and sequenceDiagram Mermaid
  - [x] 4.3: Define `domain-model.md` output structure with classDiagram and erDiagram Mermaid
  - [x] 4.4: Each entry shows: description, file:line reference, Mermaid diagram (where applicable)
- [x] Task 5: Write Context Rules section (AC: #7)
  - [x] 5.1: Define context loading priority order
  - [x] 5.2: Specify that source code files are discovered dynamically via Glob/Grep

### Review Findings

- [x] [Review][Defer] ATDD Checklist execution commands use wrong working directory [_bmad-output/test-artifacts/atdd-checklist-6-1.md] -- deferred, pre-existing pattern across all test suites; tests work correctly when run from project root

## Dev Notes

### Architecture Compliance

- **Three-Layer Separation**: This file goes in Framework Layer (`scrum_workflow/agents/`), NOT in Adapter Layer (`.claude/skills/`)
- **SKILL.md Format**: YAML frontmatter + Markdown body with exactly 4 sections: Identity, Instructions, Output Format, Context Rules
- **Naming Convention**: kebab-case filename (`documentarian.md`), snake_case in YAML fields
- **NFR4**: Adding a new agent = new Markdown file, zero code changes. This is the entire deliverable.
- **Model Selection**: `claude-sonnet-4` is correct for a documentation agent (balanced cost/quality). `max_tokens: 4000` because documentation output is larger than refinement perspectives (which use 2000).
- **Command Prefix Convention**: The `active_in` value is `create-project-docs` (no `scrum-` prefix). Internal framework files do NOT use the prefix -- only registered skill names and user-facing triggers use the `scrum-` prefix. See architecture.md: "Internal framework file names (under `scrum_workflow/commands/`) do NOT use the prefix".

### Existing Agent Pattern Reference

All three existing agents (`architect.md`, `developer.md`, `qa.md`) follow identical structure:
```yaml
---
name: {agent_name}
display_name: {Display Name}
role: {one-line role description}
active_in:
  - {command_name}
model: claude-sonnet-4
max_tokens: 2000
---
```
Then sections: `# Identity`, `# Instructions`, `# Output Format`, `# Context Rules`

**Key differences for documentarian**:
- `active_in: [create-project-docs]` (not `refine-ticket`) -- this command does not exist yet (Story 6.2), which is fine
- `max_tokens: 4000` (not 2000) -- documentation output is larger than refinement perspectives
- Output Format is NOT the table-based perspective format (Findings/Recommendations/Proposed AC). Instead it defines three documentation output structures (`business-logic.md`, `workflows.md`, `domain-model.md`)
- Identity section focuses on codebase reading and structured documentation generation, NOT on story refinement
- Instructions section uses numbered methodology steps (scan, identify, trace, extract, diagram, reference) with concrete grep patterns, NOT the consideration-based approach used by refinement agents

**ANTI-PATTERN WARNING**: Do NOT copy the Output Format table structure from `architect.md` -- the documentarian uses document-template output structures, not the Findings/Recommendations/AC table format.

### Scope Boundaries

The documentarian agent focuses ONLY on business logic:
- **IN scope**: Business rules, validations, guard clauses, state machines, workflows, event flows, domain entities, relationships, data structures
- **OUT of scope**: Architecture (separate agent), API surface (separate agent), infrastructure, logging, error handling plumbing, deployment, CI/CD

### Research Pattern Application

From `_bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md`:
- **Grep-based language-agnostic analysis** (Pattern 3.5/3.6): Agent uses Glob+Grep, not AST parsing, to work with any language. This is a deliberate design choice per FR69 -- no tree-sitter, no AST parsers, no language-specific tooling.
- **Template-Driven Output** (Pattern 4.2): Three fixed document templates, not free-form prose. Each template has predefined sections with specific Mermaid diagram types.
- **Mermaid-First Documentation** (Pattern 4.3): Every document includes Mermaid diagrams as primary documentation tool. Exact types per document:
  - `business-logic.md` -> `flowchart` (decision trees for complex rules)
  - `workflows.md` -> `stateDiagram-v2` (state machines), `sequenceDiagram` (event flows), `flowchart LR` (pipelines)
  - `domain-model.md` -> `classDiagram` (entities + relationships), `erDiagram` (database schemas)
- **Source References** (from DocAgent): file:line traceability for all documented logic
- **Single Agent, No Orchestration Overhead** (Key design decision from epics): The documentarian is a single agent, not a multi-agent system. Orchestration is handled by the workflow (Story 6.2), not by the agent definition itself.

### Project Structure Notes

- File location: `scrum_workflow/agents/documentarian.md` (alongside existing 3 agents: `architect.md`, `developer.md`, `qa.md`)
- No other files created in this story (command, workflow, templates are Stories 6.2-6.5)
- The `active_in: [create-project-docs]` command does not exist yet -- that's Story 6.2. This is fine; agents are defined before their invoking commands (same pattern as Epic 1 where agents were defined in Story 1.2 before commands in later stories)
- Do NOT create or modify `config.yaml` -- the agent is discovered by file presence, not config registration (NFR4)
- Do NOT create adapter skills (`.claude/skills/create-project-docs/`) -- that is Story 6.2's responsibility

### References

- [Source: scrum_workflow/agents/architect.md] -- Primary structural reference for agent format
- [Source: scrum_workflow/agents/developer.md] -- Secondary format reference
- [Source: scrum_workflow/agents/qa.md] -- Secondary format reference
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 6, Story 6.1] -- Story requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md#Research Synthesis] -- Pattern recommendations
- [Source: scrum_workflow/docs/08-framework-architecture.md] -- Three-layer separation rules
- [Source: _bmad-output/planning-artifacts/architecture.md] -- SKILL.md format specification, naming conventions

## Dev Agent Record

### Agent Model Used

claude-opus-4-6 (1M context)

### Debug Log References

- ATDD test suite `documentarian-agent-definition.spec.ts` had a bug in `extractSection` helper: regex used `##` (level 2 headings) but all existing agents use `#` (level 1 headings). Fixed by rewriting `extractSection` to iterate lines and match top-level headings correctly. All 48 tests now pass.
- Pre-existing test failures (70 tests across Stories 1-1 through 1-4) are unrelated to this story -- they are path resolution issues in earlier test suites.

### Completion Notes List

- Created `scrum_workflow/agents/documentarian.md` following the exact SKILL.md convention from `architect.md`, `developer.md`, and `qa.md`
- YAML frontmatter: name=documentarian, display_name=Documentarian, role describes business logic analysis, active_in=[create-project-docs], model=claude-sonnet-4, max_tokens=4000
- Identity section: focuses on business logic analysis with Mermaid diagrams, explicitly excludes architecture/infrastructure/API, emphasizes language-agnostic Glob/Grep approach
- Instructions section: 6-step numbered methodology (scan, identify rules, trace workflows, extract entities, generate Mermaid, include source refs) with concrete grep patterns for all 5 categories and explicit exclusions
- Output Format section: defines three document types (business-logic.md, workflows.md, domain-model.md) with required sections and specific Mermaid diagram types per document
- Context Rules section: 4-item priority loading order (context/index.md, domain context files, config.yaml, dynamically discovered source code)
- Fixed `extractSection` test helper in `documentarian-agent-definition.spec.ts` and unskipped all 48 ATDD tests; all pass
- All 8 acceptance criteria verified and satisfied

### File List

- `scrum_workflow/agents/documentarian.md` (NEW) -- Documentarian agent definition in SKILL.md format
- `_bmad-output/test-artifacts/documentarian-agent-definition.spec.ts` (MODIFIED) -- Unskipped 48 ATDD tests, fixed extractSection helper regex bug, removed "will fail" comments

## Change Log

- 2026-03-30: Story 6-1 implemented -- created Documentarian agent definition with full SKILL.md format, all ATDD tests passing (48/48)
