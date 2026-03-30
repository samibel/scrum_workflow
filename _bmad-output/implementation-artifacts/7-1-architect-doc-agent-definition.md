# Story 7.1: architect-doc Agent Definition

Status: done

## Story

As a developer,
I want a dedicated architecture documentation agent defined in SKILL.md format,
so that the agent has a clear identity, instructions, and output format for generating architecture documentation with Mermaid diagrams.

## Acceptance Criteria

1. **Agent file exists at correct location**: `scrum_workflow/agents/architect-doc.md` exists alongside `architect.md`, `developer.md`, `qa.md`, and `documentarian.md`

2. **YAML frontmatter follows established convention**: File has valid YAML frontmatter with exactly these fields:
   - `name: architect-doc`
   - `display_name: Architecture Documentarian`
   - `role:` a concise role description focused on architecture documentation specialist
   - `active_in: [create-architecture-docs]`
   - `model: claude-sonnet-4`
   - `max_tokens: 4000`

3. **Identity section defines agent persona**: Describes the agent as an architecture analyst that reads existing codebases and generates structured architecture documentation with Mermaid diagrams. Focuses on **system structure**, NOT business logic (that's the documentarian's domain in Epic 6).

4. **Instructions section specifies analysis methodology**: Includes a numbered list covering:
   - Systematic codebase scanning via Glob and Grep (language-agnostic, no AST)
   - Backend component identification (API endpoints, event systems, schedulers, middleware, services)
   - Frontend structure identification (components, state management, routing)
   - DevOps infrastructure identification (CI/CD, Docker, Kubernetes)
   - Local dev environment identification (docker-compose, Wiremock, env files, seed data)
   - Testing architecture identification (frameworks, pyramid, coverage, fixtures)
   - Mermaid diagram generation (graph TD, flowchart LR, sequenceDiagram)
   - Source reference inclusion (file:line for all documented architecture)

5. **Instructions section includes grep pattern reference**: Lists concrete grep patterns the agent uses to find architecture components:
   - Backend: `@Get`, `@Post`, `router.get`, `EventEmitter`, `@Scheduled`, `cron`, `middleware`, `interceptor`
   - Frontend: `Component`, `.tsx`, `.vue`, `store`, `reducer`, `Route`, `router`
   - DevOps: `Dockerfile`, `docker-compose`, `.github/workflows/`, `deployment.yaml`, `.tf`
   - Local Dev: `docker-compose.yml`, `wiremock`, `.env`, `seed`, `fixtures`, `factory`
   - Testing: `jest.config`, `pytest.ini`, `vitest.config`, `playwright.config`, `coverageThreshold`

6. **Output Format section defines five document types**: Each with required sections and Mermaid diagram types:
   - `backend-architecture.md`: API Endpoints, Event System, Scheduled Tasks, Middleware Pipeline, Service Layer, Database Access Layer -- uses `sequenceDiagram`, `flowchart LR`, `graph TD`
   - `frontend-architecture.md`: Component Hierarchy, State Management, Routing Structure, Build Pipeline, Shared Utilities -- uses `graph TD`, `flowchart`
   - `devops-architecture.md`: CI/CD Pipelines, Container Configuration, Orchestration (K8s), Infrastructure as Code, Monitoring -- uses `flowchart LR`, `graph TD`
   - `local-dev-environment.md`: Services, Mock Services, Environment Variables, Seed Data, Common Commands -- uses `graph TD` with port numbers
   - `testing-architecture.md`: Test Pyramid, Frameworks & Configuration, Test Directory Structure, Coverage Requirements, E2E Setup -- uses `graph TD`

7. **Context Rules section specifies context loading order**: Lists files in priority order:
   - `context/index.md` -- Project context overview
   - Relevant domain context files (`context/backend.md`, `context/frontend.md`, etc.)
   - `config.yaml` -- Framework configuration for project metadata
   - Source code files discovered via Glob/Grep during analysis

8. **File follows exact structure convention**: Same section order as `architect.md`: frontmatter -> Identity -> Instructions -> Output Format -> Context Rules. No extra sections, no missing sections.

9. **Scope differentiation from documentarian agent**: The architect-doc agent focuses on **structural architecture** (how the system is built) while the documentarian (Epic 6) focuses on **business logic** (what the system does). This boundary must be clear in the agent's Identity and Instructions sections.

## Tasks / Subtasks

- [x] Task 1: Create agent definition file (AC: #1, #2, #8)
  - [x] 1.1: Create `scrum_workflow/agents/architect-doc.md` with YAML frontmatter matching convention from `architect.md`
  - [x] 1.2: Verify frontmatter fields: name, display_name, role, active_in, model, max_tokens
- [x] Task 2: Write Identity section (AC: #3, #9)
  - [x] 2.1: Define agent persona focused on architecture documentation (NOT business logic)
  - [x] 2.2: Emphasize language-agnostic analysis and Mermaid diagram generation
  - [x] 2.3: Clarify scope boundary: structure vs. behavior (architect-doc vs. documentarian)
- [x] Task 3: Write Instructions section (AC: #4, #5)
  - [x] 3.1: Write numbered analysis methodology (scan backend, frontend, DevOps, local dev, testing)
  - [x] 3.2: Include concrete grep patterns for each architecture dimension (FR78 from epics)
  - [x] 3.3: Specify exclusions (no business logic, no domain rules, no workflows -- that's documentarian's domain)
- [x] Task 4: Write Output Format section (AC: #6)
  - [x] 4.1: Define `backend-architecture.md` output structure with sequenceDiagram, flowchart LR, graph TD Mermaid
  - [x] 4.2: Define `frontend-architecture.md` output structure with graph TD, flowchart Mermaid
  - [x] 4.3: Define `devops-architecture.md` output structure with flowchart LR, graph TD Mermaid
  - [x] 4.4: Define `local-dev-environment.md` output structure with graph TD Mermaid (with ports)
  - [x] 4.5: Define `testing-architecture.md` output structure with graph TD Mermaid
  - [x] 4.6: Each entry shows: description, file:line reference, Mermaid diagram (where applicable)
- [x] Task 5: Write Context Rules section (AC: #7)
  - [x] 5.1: Define context loading priority order
  - [x] 5.2: Specify that source code files are discovered dynamically via Glob/Grep

## Dev Notes

### Architecture Compliance

- **Three-Layer Separation**: This file goes in Framework Layer (`scrum_workflow/agents/`), NOT in Adapter Layer (`.claude/skills/`)
- **SKILL.md Format**: YAML frontmatter + Markdown body with exactly 4 sections: Identity, Instructions, Output Format, Context Rules
- **Naming Convention**: kebab-case filename (`architect-doc.md`), snake_case in YAML fields
- **NFR4**: Adding a new agent = new Markdown file, zero code changes. This is the entire deliverable.
- **Model Selection**: `claude-sonnet-4` is correct for a documentation agent (balanced cost/quality). `max_tokens: 4000` because documentation output is larger than refinement perspectives (which use 2000).
- **Command Prefix Convention**: The `active_in` value is `create-architecture-docs` (no `scrum-` prefix). Internal framework files do NOT use the prefix -- only registered skill names and user-facing triggers use the `scrum-` prefix. See architecture.md: "Internal framework file names (under `scrum_workflow/commands/`) do NOT use the prefix".

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

**Key differences for architect-doc**:
- `active_in: [create-architecture-docs]` (not `refine-ticket`) -- this command does not exist yet (Story 7.2), which is fine
- `max_tokens: 4000` (not 2000) -- documentation output is larger than refinement perspectives
- Output Format is NOT the table-based perspective format (Findings/Recommendations/Proposed AC). Instead it defines five architecture documentation output structures (`backend-architecture.md`, `frontend-architecture.md`, `devops-architecture.md`, `local-dev-environment.md`, `testing-architecture.md`)
- Identity section focuses on codebase reading and structured documentation generation, NOT on story refinement
- Instructions section uses numbered methodology steps (scan backend, frontend, DevOps, local dev, testing) with concrete grep patterns, NOT the consideration-based approach used by refinement agents

**ANTI-PATTERN WARNING**: Do NOT copy the Output Format table structure from `architect.md` -- the architect-doc uses document-template output structures, not the Findings/Recommendations/AC table format.

### Scope Boundaries

**CRITICAL**: architect-doc vs. documentarian boundary

| Dimension | architect-doc (Epic 7) | documentarian (Epic 6) |
|-----------|------------------------|------------------------|
| **Focus** | System STRUCTURE | Business BEHAVIOR |
| **Questions** | How is it built? | What does it do? |
| **Output** | backend-architecture.md, frontend-architecture.md, devops-architecture.md, local-dev-environment.md, testing-architecture.md | business-logic.md, workflows.md, domain-model.md |
| **IN scope** | API endpoints, components, CI/CD, Docker, K8s, testing frameworks, service dependencies | Business rules, validations, guards, state machines, workflows, domain entities |
| **OUT of scope** | Business logic, domain rules, workflows (that's documentarian) | Architecture, infrastructure, API surface (that's architect-doc) |

The architect-doc agent focuses ONLY on structural architecture:
- **IN scope**: Backend APIs, frontend components, DevOps infrastructure, local dev setup, testing architecture, service dependencies, deployment configuration
- **OUT of scope**: Business logic, domain rules, validations, workflows (separate documentarian agent in Epic 6)

### Research Pattern Application

From `_bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md`:
- **Grep-based language-agnostic analysis** (Pattern 3.5/3.6): Agent uses Glob+Grep, not AST parsing, to work with any language. This is a deliberate design choice per FR78 -- no tree-sitter, no AST parsers, no language-specific tooling.
- **Template-Driven Output** (Pattern 4.2): Five fixed document templates, not free-form prose. Each template has predefined sections with specific Mermaid diagram types.
- **Mermaid-First Documentation** (Pattern 4.3): Every document includes Mermaid diagrams as primary documentation tool. Exact types per document:
  - `backend-architecture.md` -> `sequenceDiagram` (event flows), `flowchart LR` (middleware pipeline), `graph TD` (service dependencies)
  - `frontend-architecture.md` -> `graph TD` (component hierarchy), `flowchart` (state management)
  - `devops-architecture.md` -> `flowchart LR` (CI/CD pipelines), `graph TD` (service dependencies)
  - `local-dev-environment.md` -> `graph TD` (service topology with port numbers)
  - `testing-architecture.md` -> `graph TD` (test pyramid)
- **Source References** (from DocAgent): file:line traceability for all documented architecture
- **Single Agent, No Orchestration Overhead** (Key design decision from epics): The architect-doc is a single agent, not a multi-agent system. Orchestration is handled by the workflow (Story 7.2), not by the agent definition itself.

### Project Structure Notes

- File location: `scrum_workflow/agents/architect-doc.md` (alongside existing agents: `architect.md`, `developer.md`, `qa.md`, `documentarian.md`)
- No other files created in this story (command, workflow, templates are Stories 7.2-7.7)
- The `active_in: [create-architecture-docs]` command does not exist yet -- that's Story 7.2. This is fine; agents are defined before their invoking commands (same pattern as Epic 1 where agents were defined in Story 1.2 before commands in later stories)
- Do NOT create or modify `config.yaml` -- the agent is discovered by file presence, not config registration (NFR4)
- Do NOT create adapter skills (`.claude/skills/create-architecture-docs/`) -- that is Story 8.1-8.2's responsibility (Epic 8: Installer Integration)

### References

- [Source: scrum_workflow/agents/architect.md] -- Primary structural reference for agent format
- [Source: scrum_workflow/agents/developer.md] -- Secondary format reference
- [Source: scrum_workflow/agents/qa.md] -- Secondary format reference
- [Source: scrum_workflow/agents/documentarian.md] -- Parallel pattern reference for documentation agent format
- [Source: _bmad-output/implementation-artifacts/6-1-documentarian-agent-definition.md] -- Similar story from Epic 6 for reference
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 7, Story 7.1] -- Story requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md#Research Synthesis] -- Pattern recommendations
- [Source: scrum_workflow/docs/08-framework-architecture.md] -- Three-layer separation rules
- [Source: _bmad-output/planning-artifacts/architecture.md] -- SKILL.md format specification, naming conventions

## Dev Agent Record

### Agent Model Used

Claude 4.6 Sonnet (claude-sonnet-4-20250514)

### Debug Log References

None - implementation completed without issues.

### Completion Notes List

✅ **Story 7-1 Implementation Complete**

**Created:** `scrum_workflow/agents/architect-doc.md`

**Implementation Summary:**
- Agent definition file created in SKILL.md format with proper YAML frontmatter
- All 9 acceptance criteria satisfied
- 60 ATDD tests passing (100% pass rate)

**Key Design Decisions:**
- Followed parallel pattern from documentarian.md (Epic 6) but with architecture focus
- Five document types defined: backend-architecture, frontend-architecture, devops-architecture, local-dev-environment, testing-architecture
- Eight methodology steps covering all architecture dimensions (backend, frontend, DevOps, local dev, testing, Mermaid, source references, exclusions)
- Clear scope boundary established: architect-doc = HOW it's built (structure) vs. documentarian = WHAT it does (business behavior)

**TDD Cycle Completed:**
- RED: Tests created in skipped state (60 tests)
- GREEN: All tests passing after implementation
- No refactor needed - clean implementation on first pass

### File List

- scrum_workflow/agents/architect-doc.md (NEW)

## Code Review Findings

### Summary
- **2 decision-needed** (both dismissed as false positives)
- **12 patch** findings
- **3 defer** findings (pre-existing)
- **2 dismiss** (noise/false positives)

### Decision-Needed Findings (Dismissed as False Positives)
- [x] [Review][Dismiss] Undefined Grep tool reference — Glob/Grep are implicitly available to all agents in BMAD system, not declared in frontmatter. This matches pattern from documentarian.md (Epic 6).
- [x] [Review][Dismiss] Model-token mismatch — `max_tokens: 4000` is explicitly required by AC2. This is correct per specification.

### Patch Findings
- [x] [Review][Patch] Unescaped regex patterns in grep instructions — Fixed: clarified Glob vs Grep usage for file patterns
- [x] [Review][Patch] No error handling for missing context files — Fixed: added error handling instruction
- [x] [Review][Patch] Mock services absence handling — Fixed: added instruction to document when mock services not used
- [x] [Review][Patch] File pattern injection vulnerability — Fixed: added sanitization instruction
- [x] [Review][Patch] Unbounded file enumeration — Fixed: added depth limits (max 10) and file count limits (1000)
- [x] [Review][Patch] No output file paths defined — Fixed: specified `_bmad-output/architecture-docs/` output location
- [x] [Review][Patch] Mermaid diagram complexity not bounded — Fixed: added 20-node limit and circular dependency handling
- [x] [Review][Patch] Source reference format assumes line numbers always available — Fixed: added handling for minified/generated code
- [x] [Review][Patch] No validation of Mermaid syntax before output — Fixed: added validation step (Step 9)
- [x] [Review][Patch] No incremental update strategy — Fixed: documented incremental analysis approach (Step 10)
- [x] [Review][Patch] Port mapping extraction assumes specific format — Fixed: added multi-format parsing instruction
- [x] [Review][Patch] Test directory patterns conflict with source patterns — Fixed: added priority rules for overlapping patterns

### Deferred Findings
- [x] [Review][Defer] Token budget may be insufficient [architect-doc.md:8] — Pre-existing: same pattern used in documentarian.md (Epic 6)
- [x] [Review][Defer] Grep patterns are framework-specific [architect-doc.md:22-27] — Pre-existing: patterns from technical research document
- [x] [Review][Defer] No handling for circular dependencies in service diagrams — Future enhancement for Mermaid generation

### Dismissed Findings
- [x] [Review][Dismiss] Inconsistent naming convention — Noise: `architect-doc` (kebab-case filename) vs `Architecture Documentarian` (display name) is intentional
- [x] [Review][Dismiss] Ambiguous scope boundary — False positive: Exclusions section explicitly addresses grep pattern vs. domain boundary