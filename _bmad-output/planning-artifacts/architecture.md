---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
lastStep: 8
status: 'complete'
completedAt: '2026-03-24'
inputDocuments:
  - 'prd.md'
  - 'prd-validation-report.md'
  - 'research/technical-agentic-patterns-research-2026-03-24.md'
workflowType: 'architecture'
project_name: 'scrum_workflow'
user_name: 'Sami'
date: '2026-03-24'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
48 FRs in 10 Capability Areas: Ticket Creation (FR1-5), Multi-Agent Refinement (FR6-14), Readiness Check (FR15-17), Development (FR18-20), Review (FR21-26), Approval (FR27-29), Story File Management (FR30-33), Error Handling (FR34-35), Platform Abstraction (FR36-38), Configuration (FR39-41). Additionally 6 deferred FRs for Phase 2 (FR42-48).

Architecturally critical FRs:
- FR7-14: Multi-agent parallel execution with distinct perspectives — drives agent orchestration architecture
- FR15-17: Readiness gate — enforces Plan-Then-Execute boundary
- FR30-33: Story file format as integration contract — YAML frontmatter state machine
- FR34-35: Interruption recovery — requires filesystem-based checkpointing
- FR36-38: Platform abstraction layer — documented interface contracts decoupling workflow from tool

**Non-Functional Requirements:**
16 NFRs across 6 categories: Reliability (NFR1-3), Maintainability (NFR4-7), Portability (NFR8-10), Context Efficiency (NFR11-14), Schema Compatibility (NFR15), Data Integrity (NFR16).

Architecture-driving NFRs:
- NFR1: Atomic file writes — no partial YAML corruption
- NFR4: New agent = new Markdown file, no code changes — plugin architecture
- NFR5: Platform switch = config change only — realized through adapter pattern
- NFR9: No runtime dependencies — pure file-based interpretation
- NFR11-14: Context window budgets per platform — bounded agent execution
- NFR15: Backwards-compatible schema — additive-only YAML changes

**Scale & Complexity:**

- Primary domain: Developer Tool — CLI/IDE-integrated, file-based
- Complexity level: Medium — multi-agent coordination without infrastructure
- Estimated architectural components: 9 (config, agents, commands, workflows, skills, templates, data, sprint-state, platform-adapters)

### Architectural Paradigm: Declarative Agent Orchestration Framework

The system is a **Declarative Agent Orchestration Framework** — YAML/Markdown declares WHAT happens (which agents run, in what sequence, with what inputs), the AI coding platform determines HOW (model selection, execution, tool invocation). This is not merely "no compiled code" as a constraint — it is the defining architectural paradigm. The framework is interpreted, not executed.

### Architectural Core Principle: SDK/Framework Pattern

`scrum_workflow/` is an **independent, self-contained, tool-agnostic framework** — comparable to an SDK that projects integrate. This is the foundational architectural decision that shapes all other choices.

**Three-Layer Separation:**

| Layer | Location | Ownership | Content |
|---|---|---|---|
| **Framework Layer** | `scrum_workflow/` (shared, external) | Framework maintainer | Agent definitions, commands, workflows, skills, templates, data, default config |
| **Adapter Layer** | `.claude/`, `.github/`, `.opencode/`, `.windsurf/` (per project) | Project | Thin tool-specific bindings that reference the shared framework |
| **State Layer** | `sprints/`, `config.yaml` override (per project) | Project | Project-specific sprint data, story files, project config overrides |

**Key Properties:**
- Framework has **no project-specific state** — no `sprints/`, no `index.yaml`
- Sprint state lives **in the project**, not in the shared framework
- Config exists at **two levels**: framework defaults + project override (shallow override — project `config.yaml` in project root overrides framework `config.yaml` field by field)
- Framework is versioned **independently** via copy-based updates — updates do not touch project state (NFR6 by design)
- Adding a new tool = creating a new adapter directory, no framework changes

### Technical Constraints & Dependencies

- **Declarative, not imperative** — system is pure YAML/CSV/Markdown interpreted by AI assistants at runtime; no build step, no compiled code
- **Platform-dependent execution** — relies on host platform's agent spawning, slash commands, and file access capabilities
- **Context window limits** — each agent output must fit within target platform's context budget
- **File I/O as only state mechanism** — no database, no API, no in-memory state
- **Framework independence** — `scrum_workflow/` must function as a standalone module with no external dependencies beyond the AI coding assistant

### Cross-Cutting Concerns Identified

1. **Platform Abstraction via Adapter Pattern** — every tool interaction goes through a thin adapter layer; the framework never references tool-specific APIs directly
2. **Context Window Management** — agent prompts, story files, and phase outputs must respect per-platform token budgets
3. **Schema Versioning** — YAML frontmatter must remain backwards-compatible across framework versions (NFR15)
4. **State Consistency** — YAML status field as state machine is the single authority for phase transitions
5. **Agent Isolation** — each agent operates in isolated context with only the files relevant to its role
6. **Framework Versioning** — `scrum_workflow/` as independent module uses copy-based versioning (FR39); git submodules are over-engineering for a file-based tool
7. **Two-Level Configuration** — MVP uses shallow override: project `config.yaml` (in project root, next to `sprints/`) overrides framework `config.yaml` field by field. Platform, token budgets, and agent selection are overridable; workflow step definitions are not
8. **Testability & Observability** — the sprint folder IS the observability layer (every phase produces a persistent, inspectable file). Testing dimensions: schema validation (deterministic), state machine transitions (deterministic), agent output quality (LLM-as-Judge or human review), end-to-end workflow (integration via real stories)

## Starter Template Evaluation

### Primary Technology Domain

Declarative Agent Orchestration Framework — pure YAML + Markdown, no compiled code, no runtime dependencies. Traditional starter templates (Next.js, Vite, etc.) do not apply. The "starter" is the file/folder structure and format conventions themselves.

### Starter Options Considered

| Option | Description | Verdict |
|---|---|---|
| **v2 structure as-is** | 9 agents, 7 commands, project-specific skills (spring-boot, vue) | Too broad — scope exceeds PRD MVP |
| **v2 layout, fresh content** | Reuse proven folder organization, rewrite content to PRD scope | Selected |
| **PRD structure from scratch** | Build entirely from PRD file structure diagram | Unnecessary — v2 layout already validates the concept |

### Selected Starter: v2 Layout with PRD-Scoped Content

**Rationale for Selection:**
The v2 implementation (`opencode-scrum-workflow-v2/scrum_workflow/`) validates the folder organization through real usage. The folder names and hierarchy (`agents/`, `commands/`, `workflows/`, `skills/`, `context/`) are proven. However, the content must be rewritten to match the PRD's MVP scope (3 agents, not 9; 3 MVP commands, not 7; no project-specific skills).

**Framework Structure:**

```
scrum_workflow/                     ← Shared, tool-agnostic framework
├── config.yaml                     ← Central system config (platform, token budgets, active agents)
├── agents/                         ← Agent definitions (SKILL.md format)
│   ├── architect.md                ← MVP: architectural risks, dependencies
│   ├── developer.md                ← MVP: technical feasibility, implementation
│   └── qa.md                       ← MVP: acceptance criteria, edge cases
├── commands/                       ← Slash command definitions (SKILL.md format)
│   ├── create-ticket.md            ← MVP: spec-first ticket creation
│   ├── refine-ticket.md            ← MVP: multi-agent refinement
│   └── dev-story.md                ← MVP: implementation + single review
├── workflows/                      ← Workflow orchestration definitions
├── templates/                      ← Story template, review checklist
├── skills/                         ← Reusable skill definitions
└── context/                        ← Framework-level architecture guidelines, ADRs, standards
```

**Architectural Decisions Established:**

**File Formats:**
- YAML — configuration, frontmatter metadata
- Markdown — agent definitions, commands, workflows, stories, all human-readable content
- CSV eliminated — no justified use case for MVP; YAML lists and Markdown tables serve the same purpose with fewer formats to parse

**Agent Definition Format:**
SKILL.md standard — YAML frontmatter (machine-readable metadata: name, role, model, active_in) + Markdown body (system prompt, context rules). Enables cross-platform compatibility and structured orchestration.

**Configuration Architecture:**
- `config.yaml` — central system configuration (platform, token budgets, active agents list)
- Agent/command frontmatter — per-file metadata (name, role, model routing, activation phases)
- Convention: file exists in `agents/` = available; listed in `config.yaml` `active_agents` = active
- Validation rule: every agent in `active_agents` must have a corresponding file in `agents/`

**Project-Side Structure (per project, not in shared framework):**

```
project-root/
├── .claude/                        ← Claude Code adapter (references scrum_workflow/)
├── .github/                        ← GitHub Copilot adapter
├── .opencode/                      ← OpenCode adapter
├── context/                        ← Generated by /create-project-context
│   ├── index.md                    ← Discovery index with agent loading map
│   ├── frontend.md                 ← (if detected)
│   ├── backend.md                  ← (if detected)
│   ├── testing.md                  ← (if detected)
│   ├── devops.md                   ← (if detected)
│   └── architecture.md             ← (if detected)
├── config.yaml                     ← Project-level config override (shallow merge)
└── sprints/                        ← Project-specific sprint state
    └── SW-XXX/
        ├── story.md
        ├── refinement.md
        ├── plan.md
        ├── review-N.md
        └── approval.md
```

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Project Context Discovery as Phase 0
2. Context file structure (index + sub-files)
3. Story file YAML schema & state machine
4. Agent orchestration model
5. Inter-phase handoff protocol

**Important Decisions (Shape Architecture):**
6. Platform adapter contract
7. Framework distribution & path referencing

**Deferred Decisions (Post-MVP):**
- Delta-update mechanism for project context (`/update-project-context`)
- `context_files` array per phase (Phase 2 explicit loading)
- `index.yaml` sprint index
- Cross-story dependency detection
- Relative paths / environment variables for framework path

### Decision 1: Project Context Discovery (Phase 0)

**Decision:** Add `/create-project-context` as the first command in the workflow — before any ticket work begins. This is a new Phase 0 not explicitly in the PRD but architecturally required to solve the context-mismatch problem identified in PRD Journey 4.

**Workflow Sequence (Updated):**
```
/create-project-context → /create-ticket → /refine-ticket → /dev-story → approve
```

**Pattern Composition:**

| Pattern | Role |
|---|---|
| Agent-Powered Codebase Q&A / Onboarding | Agent scans codebase, recognizes stack, maps structure |
| Shell Command Contextualization | Agent uses real shell commands to gather facts — no hallucination |
| Structured Output Specification | Templates define schema, agent fills in facts |
| Agent-Assisted Scaffolding | Agent generates context/ directory with index + sub-files |

**Generation Method — Two-Phase Approach:**

Phase A (Analysis): Agent executes shell commands to collect facts:
- `glob` / `ls` → directory structure recognition
- `cat package.json`, `requirements.txt`, `go.mod` → dependency detection
- `cat docker-compose.yml`, `Dockerfile` → infrastructure recognition
- `glob **/*.test.*`, `**/*.spec.*` → test pattern detection
- `cat .github/workflows/*.yml` → CI/CD recognition

Phase B (Generation): Agent fills templates with collected facts:
- Load domain-specific template from `scrum_workflow/templates/context-{domain}.md`
- Fill with facts from Phase A
- Write to `project-root/context/{domain}.md`
- Generate `context/index.md` as discovery index from all sub-files

**Validation Rules:**
- Every generated `context/*.md` must have valid YAML frontmatter
- `index.md` must reference all sub-files (cross-reference check)
- No sub-file without entry in `index.md`

**MVP Behavior:** Idempotent — running again overwrites cleanly. No delta-update mechanism until Phase 2.

### Decision 2: Context File Structure

**Decision:** Sharded context with index-based discovery, not a single monolithic file.

**Structure (per project):**
```
project-root/
├── context/
│   ├── index.md              ← Discovery index: domains, summaries, agent loading map
│   ├── frontend.md           ← Framework, components, state, routing, conventions
│   ├── backend.md            ← Language, framework, API, DB, conventions
│   ├── testing.md            ← Test frameworks, coverage, CI integration
│   ├── devops.md             ← CI/CD, Docker, cloud, deployment
│   └── architecture.md       ← Key decisions, patterns, dependencies
```

**Pattern:** Progressive Tool Discovery + Curated File Context Window

**Rationale:**
- Each agent loads only its relevant domain files — not everything
- Token budget per agent stays low (~500-800 tokens per sub-file vs. 3000+ for monolith)
- Initial context consumption reduced by 70-90% (Progressive Tool Discovery evidence)
- Adaptive: `/create-project-context` generates only files for detected domains — no empty files for missing domains

**Agent Context Loading Map (defined in index.md):**

| Agent | Loads |
|---|---|
| Orchestrator | index.md only |
| Architect | index.md, architecture.md, backend.md, frontend.md |
| Developer | index.md, {story-relevant-domain}.md |
| QA | index.md, testing.md, {story-relevant-domain}.md |

**Framework Templates:**
```
scrum_workflow/
├── templates/
│   ├── context-index.md
│   ├── context-frontend.md
│   ├── context-backend.md
│   ├── context-testing.md
│   ├── context-devops.md
│   └── context-architecture.md
```

### Decision 3: Story File Schema & State Machine

**Decision:** YAML frontmatter with explicit `schema_version` and status-as-state-machine.

**MVP Schema:**
```yaml
---
schema_version: 1
ticket: SW-101
title: "OAuth2 Login"
status: draft
estimation: 3
created: 2026-03-24
updated: 2026-03-24
---
```

**Note:** `estimation` is set during story creation (FR4) and may be adjusted after refinement.

**State Machine with Guard Conditions:**

```
draft → refinement                     (trigger: /refine-ticket)
refinement → ready                     (guard: readiness check PASS)
refinement → draft                     (guard: readiness check FAIL)
ready → in-dev                         (guard: status == ready, trigger: /dev-story)
in-dev → in-review                     (trigger: /dev-story review)
in-review → done                       (guard: explicit user approval, FR28)
```

| Status | Set By | Guard | Meaning |
|---|---|---|---|
| `draft` | /create-ticket | — | Story created, not yet refined |
| `refinement` | /refine-ticket | status == draft | Multi-agent refinement in progress |
| `ready` | Readiness check | PASS result | Spec approved, implementation allowed |
| `in-dev` | /dev-story | status == ready (FR17) | Implementation in progress |
| `in-review` | /dev-story review | status == in-dev | Single review pass (MVP) |
| `done` | User approval | explicit sign-off (FR28) | Human approval complete |

**Validation Rules:**
- Status transitions must follow the state machine — no skipping phases
- Commands must verify guard conditions before executing
- `schema_version` enables backwards-compatible evolution (NFR15)
- New fields are always optional with documented defaults
- Refinement feedback (accept/reject per perspective) stored in `refinement.md` (NFR16), not in story frontmatter

### Decision 4: Agent Orchestration Model

**Decision:** Command-as-orchestrator with command/workflow separation.

**Architecture:**
- **Command file** (`commands/*.md`) = WHAT: entry point, orchestration logic (which agents to spawn, what context to give each, how to synthesize results, status updates)
- **Workflow file** (`workflows/*.md`) = HOW: step-by-step execution detail for complex phases
- Command references its workflow file for detailed steps

```
commands/refine-ticket.md    ← WHAT: spawn Architect, Dev, QA; synthesize; update status
workflows/refinement.md      ← HOW: step-by-step refinement phase execution
```

**No separate orchestrator agent** — each command IS the orchestrator for its phase. Sub-agents (Architect, Dev, QA) are spawned with isolated context per the Sub-Agent Spawning pattern.

**Model Routing:**
- Coordination logic (in command files): executed by the platform's primary model (e.g., Opus)
- Sub-agent perspectives: can use lighter models (e.g., Sonnet) — configured per agent in SKILL.md frontmatter `model` field
- Project-level override in `config.yaml` for cost control

### Decision 5: Inter-Phase Handoff Protocol

**Decision:** Blackboard pattern — phases communicate exclusively through files in the sprint folder.

**Handoff Chain:**

| From | To | Artifact | Content |
|---|---|---|---|
| /create-ticket | /refine-ticket | `story.md` | YAML frontmatter + story description |
| /refine-ticket | Readiness Check | `story.md` (updated) + `refinement.md` | Updated story + agent perspectives |
| Readiness Check | /dev-story | `plan.md` | Execution plan with subtasks |
| /dev-story | Review | Code changes + `review-1.md` | Findings with severity and fixes |
| Review (pass) | Approval | `approval.md` | Sign-off record |

**Properties:**
- Asynchronous: each phase writes files, next phase reads them
- Auditable: every handoff is a persistent file
- Resumable: any phase can restart by re-reading input files
- Human-inspectable: standard Markdown, readable without the tool

**Rule:** Only synthesized results pass between phases — never full conversation history (Discrete Phase Separation).

### Decision 6: Platform Adapter Contract

**Decision:** Minimal adapter — each tool directory provides exactly two things:

1. **Instruction file** — tells the AI platform where the framework lives and how to use it
2. **Command registration** — maps slash commands to framework command files using the platform's native mechanism

**Platform-Specific Registration:**

| Platform | Instruction File | Command Registration |
|---|---|---|
| Claude Code | `.claude/` instructions or CLAUDE.md | Skills in `.claude/skills/` (SKILL.md format) |
| GitHub Copilot | `.github/copilot-instructions.md` | Custom agents in `.github/agents/` |
| OpenCode | `.opencode/` config | Agent files in `.opencode/agents/` |
| Windsurf | `.windsurf/` rules | Rules-based configuration |

**No logic in adapters.** All workflow logic lives in the shared framework. Adapters are pure references pointing to the same framework command files.

### Decision 7: Framework Distribution & Path Referencing

**Decision:** Absolute path reference via `framework_path` in project-level `config.yaml`.

**Mechanism:**
```yaml
# project-root/config.yaml
framework_path: /Users/sami/shared/scrum_workflow
platform: claude-code
```

Adapter instruction files reference `framework_path` to locate framework files. The AI platform follows these references to load agent definitions, command files, and templates.

**Versioning:** Copy-based. Framework maintainer updates the shared directory. Projects pick up changes on next command invocation — no migration, no deployment (FR39, NFR6).

### Decision Impact Analysis

**Implementation Sequence:**
1. Framework templates (`scrum_workflow/templates/context-*.md`) — needed first
2. `/create-project-context` command + workflow — depends on templates
3. Story file schema + state machine — foundation for all other commands
4. `/create-ticket` command + workflow — first ticket workflow command
5. Agent definitions (Architect, Dev, QA) in SKILL.md format — needed for refinement
6. `/refine-ticket` command + workflow — depends on agents
7. Readiness check (embedded in refinement workflow) — gates dev phase
8. `/dev-story` command + workflow — implementation + single review
9. Approval gate — human sign-off
10. Platform adapters — thin wiring to connect framework to tools

**Cross-Component Dependencies:**
- All commands depend on: config.yaml, story schema, context/ files
- /refine-ticket depends on: agent definitions, /create-ticket output
- /dev-story depends on: readiness check, /refine-ticket output
- Platform adapters depend on: all framework files being in place

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**6 conflict areas identified** where AI agents could make inconsistent choices. Rules below ensure all agents produce compatible, parseable artifacts.

### 1. Naming Patterns

| Element | Convention | Example |
|---|---|---|
| Files (all) | `kebab-case.md` | `create-ticket.md`, `refine-ticket.md` |
| Directories | `kebab-case/` | `scrum_workflow/`, `context/` |
| YAML fields | `snake_case` | `schema_version`, `context_files`, `max_tokens` |
| Status values | `kebab-case` | `draft`, `in-dev`, `in-review` |
| Ticket format | `SW-XXX` | `SW-101`, `SW-042` — numeric, zero-padded to 3 digits |
| Agent names | `kebab-case` (filename = ID) | `architect.md` → agent ID: `architect` |
| Command names | `kebab-case` with slash | `/create-ticket`, `/refine-ticket` |

**Rule:** `kebab-case` for files/commands (Markdown/URL standard). `snake_case` for YAML fields (YAML community standard). No mixing within a domain.

### 2. SKILL.md Structure Patterns

**Agent Definition Template:**
```yaml
---
name: architect
display_name: "Architect"
role: "architectural-risks, dependencies, design-decisions"
active_in: [refine-ticket]
model: sonnet
max_tokens: 2000
---

## Identity
[Who is this agent, what is their perspective]

## Instructions
[What the agent does, step by step]

## Output Format
[Exact structure of expected output]

## Context Rules
[Which files this agent reads]
```

**Command Definition Template:**
```yaml
---
name: create-ticket
trigger: "/create-ticket"
requires_status: null
sets_status: draft
spawns_agents: []
---

## Purpose
[What this command does]

## Workflow Reference
workflows/{workflow-file}.md

## Input
[What the command expects as input]

## Output
[Which files are created/modified]
```

**Rule:** Sections in exactly this order. Frontmatter fields in exactly this order. No agent may add or rename sections.

### 3. Agent Output Format

**Refinement Perspective — Standard Format:**
```markdown
## [Agent-Name] Perspective

### Findings
| # | Finding | Severity | Category |
|---|---|---|---|
| 1 | Token refresh needs session management | high | architecture |
| 2 | Auth library v3 compatibility unknown | medium | dependency |

### Recommendations
- [Concrete, actionable recommendations]

### Proposed Acceptance Criteria
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]
```

**Review Finding — Standard Format:**
```markdown
## Review Findings

### Summary
| Total | Critical | Major | Minor |
|---|---|---|---|
| 3 | 0 | 2 | 1 |

### Findings
| # | Finding | Severity | AC Reference | Suggested Fix |
|---|---|---|---|---|
| 1 | Missing error handling in auth flow | major | AC-3 | Add try/catch in auth.service |
```

**Rule:** Table-based format for all findings and acceptance criteria. Enables consistent parsing, counting, filtering, and synthesis by the coordinator.

### 4. Markdown & YAML Conventions

**Markdown:**
- `#` = document title (once per file only)
- `##` = main sections
- `###` = subsections
- Lists: `-` (not `*` or `+`)
- Code blocks: always with language tag (` ```yaml `, ` ```markdown `)
- Tables: always with header row and separator

**YAML Frontmatter:**
- Strings with special characters: quoted (`title: "OAuth2 Login"`)
- Simple strings: unquoted (`status: draft`)
- Arrays: multiline with `-` when >2 items, inline `[]` when ≤2
- Null: explicit `null`, never empty fields
- Dates: ISO 8601 (`2026-03-24`)
- Field order: as defined in template — never reorder

**Good Example:**
```yaml
---
schema_version: 1
ticket: SW-101
title: "OAuth2 Login"
status: draft
estimation: 3
created: 2026-03-24
---
```

**Anti-Pattern:**
```yaml
---
title: OAuth2 Login    # Not quoted with special chars
Status: Draft          # Wrong casing
estimation:            # Empty instead of null
ticket: sw-101         # Wrong format
---
```

### 5. Error & Recovery Patterns

| Situation | Behavior |
|---|---|
| Command on wrong status | Error: "Story SW-101 is in status `draft`, but `/dev-story` requires `ready`" |
| Required file missing | Error: "File `sprints/SW-101/story.md` not found. Run `/create-ticket SW-101` first" |
| Invalid frontmatter | Error: "Invalid frontmatter in story.md: field `status` missing" |
| Interrupted workflow | Recovery: read last `status` from frontmatter, resume from that phase |
| Agent output exceeds token limit | Warning in output, save anyway, inform user |

**Principle:** Errors are **informative and actionable**. Never "Error occurred" — always what went wrong, where, and what the user should do.

**Recovery Pattern:** The `status` value in frontmatter IS the recovery point. On interruption:
1. Read `status` from `story.md`
2. Status determines which phase runs next
3. No manual "resume" needed — just run the next command

### 6. Write Boundary Rules

**FORBIDDEN: Agent writes to files owned by other phases.**

| Command | May Write | May NOT Write |
|---|---|---|
| /create-ticket | `story.md` | `refinement.md`, `plan.md`, `review-*.md` |
| /refine-ticket | `refinement.md`, `story.md` (update) | `plan.md`, `review-*.md` |
| Readiness check | `plan.md`, `story.md` (status update) | `refinement.md`, `review-*.md` |
| /dev-story | Code files, `review-1.md` | `story.md`, `refinement.md`, `plan.md` |
| Approval | `approval.md`, `story.md` (status → done) | All other sprint files |

**Principle:** Each command writes ONLY its own phase artifacts. This enforces Immutable State + Append-Only — no agent overwrites another phase's work.

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow naming conventions exactly as defined (no "close enough")
- Use the SKILL.md section order without modification
- Produce output in the standard table-based format
- Validate frontmatter before writing (status transition, required fields)
- Never write to files outside their phase boundary

**Pattern Verification:**
- Readiness check validates story.md frontmatter against schema
- Commands verify `status` guard condition before executing
- Agent output format is enforced by the Output Format section in each agent's SKILL.md

## Project Structure & Boundaries

### Complete Framework Directory Structure

```
scrum_workflow/                              ← Shared, tool-agnostic framework
├── config.yaml                              ← Default config (platform, token budgets, active agents)
│
├── agents/                                  ← Agent role definitions (SKILL.md format)
│   ├── architect.md                         ← FR9: architectural risks, dependencies
│   ├── developer.md                         ← FR10: technical feasibility, implementation
│   └── qa.md                                ← FR11: acceptance criteria, edge cases
│
├── commands/                                ← Slash command definitions (SKILL.md format)
│   ├── create-project-context.md            ← Phase 0: codebase analysis + context/skills generation
│   ├── create-ticket.md                     ← FR1-5: spec-first ticket creation + guided mode
│   ├── refine-ticket.md                     ← FR6-14: multi-agent refinement orchestration
│   └── dev-story.md                         ← FR18-26: implementation + single review
│
├── workflows/                               ← Step-by-step execution details
│   ├── project-context.md                   ← Two-phase analysis + generation workflow
│   ├── ticket-creation.md                   ← Guided mode logic, story generation
│   ├── refinement.md                        ← Agent spawning, synthesis, feedback
│   ├── readiness-check.md                   ← FR15-17: plan-then-execute gate
│   ├── development.md                       ← Implementation from plan
│   ├── review.md                            ← Single review pass (MVP)
│   └── approval.md                          ← FR27-29: human sign-off
│
├── skills/                                  ← Workflow skills (generic, shared)
│   ├── guided-mode/SKILL.md                 ← How to clarify vague tickets (FR3)
│   ├── synthesis/SKILL.md                   ← How to merge agent perspectives (FR12)
│   └── readiness-check/SKILL.md             ← How to validate story completeness (FR15-16)
│
├── templates/                               ← All output templates
│   ├── context-index.md                     ← Template for context/index.md
│   ├── context-frontend.md                  ← Template for context/frontend.md
│   ├── context-backend.md                   ← Template for context/backend.md
│   ├── context-testing.md                   ← Template for context/testing.md
│   ├── context-devops.md                    ← Template for context/devops.md
│   ├── context-architecture.md              ← Template for context/architecture.md
│   ├── skill-backend.md                     ← Template for project skill: backend
│   ├── skill-frontend.md                    ← Template for project skill: frontend
│   ├── skill-testing.md                     ← Template for project skill: testing
│   ├── skill-devops.md                      ← Template for project skill: devops
│   ├── skill-project-architect.md           ← Template for project skill: architecture
│   ├── story.md                             ← FR30-33: story file template (YAML + Markdown)
│   ├── refinement.md                        ← Refinement output template
│   ├── plan.md                              ← Execution plan template
│   ├── review.md                            ← Review findings template
│   └── approval.md                          ← Approval record template
│
├── context/                                 ← Framework-level standards and guidelines
│   ├── architecture-guidelines.md           ← Framework architecture principles
│   └── standards.md                         ← Coding/naming/format standards
│
└── data/                                    ← Reference data (YAML format)
    └── estimation-reference.yaml            ← FR4: estimation guidance for story creation
```

### Complete Project-Side Structure

```
project-root/
├── context/                                 ← Generated by /create-project-context (FACTS)
│   ├── index.md                             ← Discovery index + agent loading map
│   ├── frontend.md                          ← (if detected)
│   ├── backend.md                           ← (if detected)
│   ├── testing.md                           ← (if detected)
│   ├── devops.md                            ← (if detected)
│   └── architecture.md                      ← (if detected)
│
├── skills/                                  ← Generated by /create-project-context (HOW TO WORK)
│   ├── backend/SKILL.md                     ← "You work with FastAPI + PostgreSQL..."
│   ├── frontend/SKILL.md                    ← "You work with React 18 + Zustand..."
│   ├── testing/SKILL.md                     ← "Use pytest for backend, Vitest for frontend..."
│   ├── devops/SKILL.md                      ← "CI via GitHub Actions, deploy to AWS ECS..."
│   └── project-architect/SKILL.md           ← "Monorepo, REST API, JWT auth..."
│
├── config.yaml                              ← Project-level override
│
├── sprints/                                 ← FR30: all stories, historized
│   ├── SW-101/
│   │   ├── story.md                         ← Created by /create-ticket
│   │   ├── refinement.md                    ← Created by /refine-ticket
│   │   ├── plan.md                          ← Created by readiness check
│   │   ├── review-1.md                      ← Created by /dev-story review
│   │   └── approval.md                      ← Created by user approval
│   └── SW-102/
│       └── ...
│
├── .claude/                                 ← Claude Code adapter
│   └── skills/                              ← Commands registered as skills
│       ├── create-project-context/SKILL.md
│       ├── create-ticket/SKILL.md
│       ├── refine-ticket/SKILL.md
│       └── dev-story/SKILL.md
│
├── .github/                                 ← GitHub Copilot adapter
│   ├── copilot-instructions.md
│   └── agents/
│
├── .opencode/                               ← OpenCode adapter
│   └── agents/
│
└── .windsurf/                               ← Windsurf adapter
    └── rules/
```

### Two Types of Skills

| Type | Location | Generated By | Purpose |
|---|---|---|---|
| **Workflow Skills** | `scrum_workflow/skills/` (framework) | Framework author | HOW the workflow works (generic, shared across projects) |
| **Domain Skills** | `project-root/skills/` (project) | `/create-project-context` | HOW to work in THIS project (specific, generated from codebase analysis) |

### Agent Loading Model: Role + Skill + Context

Each agent is composed of three layers at runtime:

```
Agent = Role (agents/*.md) + Domain Skill (project skills/) + Context (project context/)
```

| Agent | Role File | Domain Skill | Context Files |
|---|---|---|---|
| Architect | `agents/architect.md` | `skills/project-architect/SKILL.md` | `context/architecture.md` + relevant domains |
| Developer | `agents/developer.md` | `skills/{ticket-domain}/SKILL.md` | `context/{ticket-domain}.md` |
| QA | `agents/qa.md` | `skills/testing/SKILL.md` | `context/testing.md` + relevant domain |

The orchestrator (command file) reads `context/index.md` to determine which domain the ticket belongs to, then loads the appropriate skill and context files per agent.

### Architectural Boundaries

**Layer Boundaries (Three-Layer Separation):**

| Boundary | Rule | Violation Example |
|---|---|---|
| Framework → Project | Framework NEVER reads from project `sprints/`, `context/`, or `skills/` | Agent definition referencing `sprints/SW-101/story.md` |
| Project → Framework | Project adapter ONLY references framework files, never copies them | Duplicating `architect.md` into `.claude/agents/` |
| State → Framework | Sprint files NEVER modify framework files | `/dev-story` editing `scrum_workflow/templates/story.md` |

**Phase Boundaries (Write Rules):**

| Phase | Reads | Writes |
|---|---|---|
| /create-project-context | Project codebase (scan) | `context/*.md`, `skills/*/SKILL.md` |
| /create-ticket | `context/index.md`, relevant `context/*.md` | `sprints/SW-XXX/story.md` |
| /refine-ticket | `story.md`, relevant `context/*.md`, relevant `skills/` | `refinement.md`, `story.md` (update) |
| Readiness check | `story.md`, `refinement.md` | `plan.md`, `story.md` (status) |
| /dev-story | `story.md`, `plan.md`, relevant `context/*.md`, relevant `skills/` | Code files, `review-1.md` |
| Approval | `review-1.md` | `approval.md`, `story.md` (status → done) |

### Requirements to Structure Mapping

| FR Category | Framework Location | Project Location |
|---|---|---|
| Phase 0: Context | `commands/create-project-context.md`, `workflows/project-context.md`, `templates/context-*.md`, `templates/skill-*.md` | `context/*.md`, `skills/*/SKILL.md` |
| FR1-5: Creation | `commands/create-ticket.md`, `workflows/ticket-creation.md`, `templates/story.md`, `skills/guided-mode/` | `sprints/SW-XXX/story.md` |
| FR6-14: Refinement | `commands/refine-ticket.md`, `workflows/refinement.md`, `agents/*.md`, `skills/synthesis/` | `sprints/SW-XXX/refinement.md` |
| FR15-17: Readiness | `workflows/readiness-check.md`, `skills/readiness-check/` | `sprints/SW-XXX/plan.md` |
| FR18-26: Dev+Review | `commands/dev-story.md`, `workflows/development.md`, `workflows/review.md` | Code changes, `sprints/SW-XXX/review-1.md` |
| FR27-29: Approval | `workflows/approval.md`, `templates/approval.md` | `sprints/SW-XXX/approval.md` |
| FR36-38: Abstraction | `config.yaml` | `.claude/`, `.github/`, `.opencode/`, `.windsurf/` |

### Data Flow

```
User Input
    ↓
[Adapter Layer] → resolves framework_path → loads command
    ↓
[Command] → reads config.yaml (merged) → reads context/index.md
    ↓                                     → determines ticket domain
    ↓
[Workflow] → spawns agents with:
    │         Role (agents/*.md)
    │         + Domain Skill (project skills/{domain}/SKILL.md)
    │         + Context (project context/{domain}.md)
    ↓
[Agents] → read story files → produce structured output
    ↓
[Command] → synthesizes via skills/synthesis/ → writes to sprints/SW-XXX/
    ↓
[Frontmatter] → status updated → next phase unlocked
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All 7 core decisions form a coherent chain: SDK/Framework Pattern (D1-D2) → State Machine (D3) → Command-as-Orchestrator (D4) → Blackboard Handoff (D5) → Adapter Contract (D6) → Path Reference (D7). No contradictions found.

**Pattern Consistency:**
- Naming: kebab-case files, snake_case YAML — applied consistently across agents, commands, workflows, templates
- Format: SKILL.md with YAML frontmatter — used for agents AND commands
- Output: Table-based structured format — used for refinement perspectives AND review findings
- Write boundaries: Each phase owns its artifacts — enforced by Phase Boundaries table

**Structure Alignment:**
Framework structure (7 directories) maps directly to architectural decisions. Project structure (context/, skills/, sprints/, adapters) implements the Three-Layer Separation. No structural orphans.

### Requirements Coverage ✅

**Functional Requirements:**
All 41 MVP FRs (FR1-41) have explicit architectural support through the Requirements to Structure Mapping table. Each FR maps to specific framework files (commands, workflows, templates, agents, skills) and project files (sprint artifacts).

**Non-Functional Requirements:**
All 16 NFRs addressed:
- NFR1-3 (Reliability): Filesystem-Based Agent State + Status Recovery
- NFR4-7 (Maintainability): SKILL.md plugin architecture + Two-Level Config + Schema Versioning
- NFR8-10 (Portability): Standard Markdown + No Dependencies + Git-friendly structure
- NFR11-14 (Context Efficiency): Sharded Context + Progressive Discovery + Agent Loading Map
- NFR15 (Schema Compat): `schema_version` field + additive-only changes
- NFR16 (Data Integrity): Write Boundary Rules + feedback stored in separate file

**Deferred FRs (Phase 2):**
FR42-48 are architecturally accommodated: State Machine is extensible (new status values), Schema supports new optional fields, Agent roster can grow (NFR4).

### Implementation Readiness ✅

**Decision Completeness:**
- 7 core decisions documented with rationale
- 13 agentic patterns referenced and mapped to workflow phases
- All decisions include concrete examples

**Structure Completeness:**
- Complete framework tree: 7 directories, all files listed with FR mapping
- Complete project tree: context/, skills/, sprints/, 4 adapter directories
- All integration points defined in Data Flow diagram

**Pattern Completeness:**
- 6 consistency rule categories with concrete examples and anti-patterns
- SKILL.md templates for agents AND commands
- Agent output format standardized with table structures
- Error & Recovery patterns with actionable messages

### Gap Analysis Results

**No critical gaps found.**

**Minor gaps (non-blocking):**
1. Token budget enforcement mechanism (NFR14 80% warning) — deferred to implementation, manual check in MVP. Priority Phase 2 enhancement
2. `context/index.md` agent loading map format — defined by template at implementation time
3. Phase 2 FR architecture details — intentionally deferred per PRD scope rules

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (48 FRs, 16 NFRs, 4 Journeys)
- [x] Scale and complexity assessed (Medium — multi-agent, no infrastructure)
- [x] Technical constraints identified (declarative, file-based, platform-dependent)
- [x] Cross-cutting concerns mapped (8 concerns)

**✅ Architectural Decisions**
- [x] 7 core decisions documented with rationale
- [x] Technology stack specified (YAML + Markdown, SKILL.md format)
- [x] 13 agentic patterns mapped to workflow phases
- [x] Platform abstraction fully designed (adapter contract)

**✅ Implementation Patterns**
- [x] Naming conventions established (kebab-case files, snake_case YAML)
- [x] Structure patterns defined (SKILL.md templates for agents + commands)
- [x] Agent output format standardized (table-based)
- [x] Error & recovery patterns documented (status-based recovery)
- [x] Write boundary rules enforced per phase

**✅ Project Structure**
- [x] Complete framework directory structure (7 directories)
- [x] Complete project-side structure (context/, skills/, sprints/, adapters)
- [x] Two types of skills defined (workflow vs. domain)
- [x] Agent loading model specified (Role + Skill + Context)
- [x] Architectural boundaries defined (3 layers, 6 phase boundaries)
- [x] Requirements to structure mapping complete (all FRs)
- [x] Data flow documented end-to-end

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — all requirements covered, no critical gaps, coherent decisions

**Key Strengths:**
- SDK/Framework pattern enables true platform independence
- Agent Loading Model (Role + Skill + Context) solves the generalist-vs-specialist problem — a novel composition not found in the referenced agentic patterns
- Sharded context with Progressive Discovery optimizes token usage by 70-90%
- Write Boundary Rules prevent cross-phase contamination
- Two-Phase Context Generation (Analysis → Templated Generation) eliminates hallucination
- Architecture is structurally testable without additional infrastructure

**Areas for Future Enhancement (Phase 2+):**
- Automated token budget enforcement with 80% warning (priority Phase 2)
- Delta-update for project context (`/update-project-context`)
- `index.yaml` sprint index for `/status` command
- Review loop (3 iterations) extending the state machine
- 4th agent (UX) extending the agent roster

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries (Three-Layer Separation)
- Respect phase write boundaries (each phase owns its artifacts)
- Refer to this document for all architectural questions

**Implementation Sequence:**
1. Framework templates (context-*.md, skill-*.md, story.md, etc.)
2. `/create-project-context` command + workflow
3. Story file schema + state machine validation
4. `/create-ticket` command + workflow
5. Agent definitions (Architect, Dev, QA) in SKILL.md format
6. `/refine-ticket` command + workflow
7. Readiness check workflow
8. `/dev-story` command + workflow (implementation + single review)
9. Approval gate workflow
10. Platform adapters (Claude Code, GitHub Copilot, OpenCode, Windsurf)
