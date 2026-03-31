---
stepsCompleted:
  - 'step-01-validate-prerequisites'
  - 'step-02-design-epics'
  - 'step-03-create-stories'
  - 'step-04-final-validation'
inputDocuments:
  - 'prd.md'
  - 'architecture.md'
  - 'research/technical-agentic-patterns-research-2026-03-24.md'
  - 'prd-validation-report.md'
  - 'research/technical-bmad-install-script-analysis-research-2026-03-27.md'
  - 'research/multi-agent-consensus-patterns-refinement-2026-03-31.md'
---

# scrum_workflow - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for scrum_workflow, decomposing the requirements from the PRD, and Architecture requirements into implementable stories.

**Story Parallelization Principle:** Stories within an epic are designed to be worked on **in parallel by default**, like a real Scrum team. Dependencies between stories exist only when explicitly documented — they are the exception, not the rule.

## Requirements Inventory

### Functional Requirements

FR1: User can create a new ticket by providing a ticket number and a natural language idea
FR2: System generates a structured story file (YAML frontmatter + Markdown) from the user's input
FR3: System detects vague or incomplete input and enters guided mode, asking follow-up questions to clarify the ticket
FR4: System generates an initial story estimation based on the ticket description
FR5: System creates the story file in the sprint folder structure (`sprints/SW-XXX/story.md`)
FR6: User can trigger refinement for a specific ticket
FR7: System spawns multiple agent perspectives (Architect, Dev, QA) that analyze the story in parallel
FR8: Each agent perspective is displayed separately and visibly attributed to its role
FR9: Architect agent identifies architectural risks, affected decisions, and dependencies
FR10: Dev agent identifies technical dependencies, implementation concerns, and feasibility issues
FR11: QA agent proposes testable acceptance criteria and identifies edge cases
FR12: System provides a coordination mechanism that merges accepted agent perspectives into a coherent updated story file with refined description, acceptance criteria, estimation, and subtasks
FR13: User can accept or reject each agent perspective individually via lightweight feedback
FR14: System records which perspectives were accepted/rejected for quality tracking
FR15: System validates story completeness before implementation begins (plan-then-execute gate)
FR16: Readiness check produces a clear PASS/FAIL result with reasons for failure
FR17: No implementation can begin on a story that has not passed the readiness check
FR18: User can trigger implementation of a specific ticket
FR19: System implements code based on the approved plan and story specification
FR20: System generates a review report documenting findings after implementation
FR21: User can trigger a review for an implemented ticket
FR22: Review agent can read and analyze the implemented code changes in the context of the story specification
FR23: Review agent evaluates implementation against the story specification and acceptance criteria
FR24: Review findings are documented in a separate review file (`review-N.md`) within the ticket folder
FR25: Review findings include specific issues, their severity, and suggested fixes
FR26: Each review finding references the specific acceptance criterion or subtask it relates to
FR27: User can approve a reviewed story as DONE via a human approval gate
FR28: No story can be marked as DONE without explicit human approval
FR29: Approval is recorded in a separate approval file within the ticket folder
FR30: Each ticket has its own folder containing all related artifacts (story, refinement, plan, reviews, approval)
FR31: Story files use YAML frontmatter for metadata (ticket number, title, status, estimation)
FR32: Story status is tracked in the frontmatter and updated at each phase transition
FR33: All story artifacts are standard Markdown, readable without the tool
FR34: System can detect and resume an interrupted workflow from the last completed phase
FR35: System validates story file integrity before processing
FR36: System provides a documented platform abstraction layer with defined interface contracts
FR37: Workflow configuration specifies the target platform (GitHub Copilot, Windsurf, OpenCode)
FR38: Changing the target platform requires only a configuration change, not workflow changes
FR39: System is installed by copying files into the project directory
FR40: System configuration is stored in a single YAML file
FR41: Agent roles are defined in separate Markdown files and are extensible by adding new files

**Deferred (Phase 2):**
FR42: Follow-up tickets reference the original ticket and include failure context from previous review iterations
FR43: User can check the status of any ticket or get a sprint overview
FR44: System automatically creates a follow-up ticket when review loop exhausts max iterations
FR45: User can cancel a ticket in progress
FR46: User can reject a refinement and provide additional context for re-refinement
FR47: UX agent provides user flow and edge case perspectives during refinement
FR48: Review loop repeats up to 3 iterations (Dev → Review → Fix) with exit condition: findings = 0

**Business Logic Documentation (Epic 6):**
FR60: User can generate comprehensive business logic documentation for any existing project by running a single command
FR61: System scans codebase and identifies business rules, validations, guard clauses, and decision logic
FR62: System scans codebase and identifies workflows, state machines, event handlers, and process flows
FR63: System scans codebase and identifies domain entities, relationships, and data structures
FR64: Each generated document includes Mermaid diagrams (flowchart, stateDiagram-v2, sequenceDiagram, classDiagram, erDiagram)
FR65: System can incrementally update existing documentation by comparing current code against previously documented state
FR66: Update mode shows a diff summary of what changed before writing, requiring user confirmation
FR67: System maintains a scan state file to track what was documented and enable incremental updates
FR68: Generated documentation includes source code references (file:line) for traceability
FR69: Documentation agent is language-agnostic — works with any programming language via grep-based analysis

**Architecture Documentation (Epic 7):**
FR70: User can generate comprehensive architecture documentation for any existing project by running a single command
FR71: System scans codebase and documents backend architecture (API endpoints, event systems, schedulers, message queues, middleware, services)
FR72: System scans codebase and documents frontend architecture (component hierarchy, state management, routing, build pipeline)
FR73: System scans codebase and documents DevOps architecture (CI/CD pipelines, Docker, Kubernetes, cloud infrastructure, monitoring)
FR74: System scans codebase and documents local development environment (docker-compose services, Wiremock stubs, env files, seed data, local ports)
FR75: System scans codebase and documents testing architecture (test pyramid, frameworks, coverage config, E2E setup, fixture patterns)
FR76: Each generated architecture document includes Mermaid diagrams (graph TD, flowchart LR, sequenceDiagram)
FR77: System can incrementally update existing architecture docs by comparing current code against previously documented state
FR78: Architecture documentation agent is language-agnostic — works with any programming language via grep-based analysis
FR79: Architecture scan state is managed independently from business logic scan state (separate .arch-scan-state.json)

**Technical Research Agent (Epic 9):**
FR80: User can run `/scrum-research technical <topic>` to generate comprehensive technical research documentation for any specified topic
FR81: System performs web research using WebSearch tool to gather information from multiple sources
FR82: System applies Plan-Then-Execute pattern for structured research workflow
FR83: System uses Swarm Migration pattern for parallel subagent research across multiple sources (10x+ speedup)
FR84: System applies Reflection Loop for self-critique and content quality improvement
FR85: System persists research state to filesystem for checkpoint recovery on long-running tasks
FR86: System generates AI-optimized output with structured frontmatter schema
FR87: System supports incremental update mode to refresh existing research with new findings
FR88: User can run `/scrum-research general <topic>` for broader research beyond technical topics
FR89: Both research modes output to `docs/research/` directory with dated filenames
FR90: Research agent is integrated into npm installer and available after `create-scrum-workflow install`

**Enhanced Refinement (Epic 10):**
FR91: Refinement command prompts user for additional documents (project docs, architecture, rules) before starting agent analysis
FR92: Refinement implements Cross-Talk Discussion Rounds where agents see and comment on each other's perspectives
FR93: Cross-talk continues until consensus (≥80% agreement) or max rounds (3) reached, then escalates to user
FR94: Each agent provides independent story point estimate with confidence level (Wideband Delphi pattern)
FR95: Estimation variance > 2 points triggers re-estimation discussion round
FR96: Final estimate uses median of agent estimates with documented confidence level

**Installer (Epic 5):**
FR49: User can install scrum_workflow into any project by running a single CLI command
FR50: Installer copies all framework files verbatim to the target project directory
FR51: Installer registers skill shims in platform-specific skill directories based on user selection
FR52: Installer supports multiple AI coding platforms via a config-driven platform registry (YAML)
FR53: Adding support for a new platform requires only a YAML entry — no code changes
FR54: Installer generates a lock file with SHA-256 hashes for all installed files
FR55: User can update an existing installation while preserving user-modified files
FR56: Update command detects user-modified files via hash comparison and backs them up before overwriting
FR57: User can check installation status showing version, platforms, and file counts
FR58: Installer supports non-interactive mode via CLI flags for automation
FR59: Installer is a standalone Node.js CLI with zero BMAD dependency

### NonFunctional Requirements

NFR1: Story file writes must be atomic — no partial writes that corrupt the YAML frontmatter or Markdown content
NFR2: System resumes from the last completed phase after interruption, without data loss or duplicate processing
NFR3: All workflow state is persisted to filesystem — no in-memory-only state that would be lost on crash
NFR4: Adding a new agent role requires only creating a new Markdown file in the `agents/` directory — no code changes
NFR5: Switching target platform requires changing only `config.yaml` — no workflow file modifications
NFR6: Workflow updates (new version of the tool) must not break existing story files in `sprints/`
NFR7: All configuration follows convention-over-configuration — all required fields have documented default values, minimal required config
NFR8: All artifacts (stories, refinements, reviews, approvals) are standard Markdown readable by any text editor or renderer
NFR9: No runtime dependencies — the tool is pure configuration files interpreted by the AI coding assistant
NFR10: Sprint folder structure is a standard git-friendly directory layout
NFR11: Each agent perspective in refinement must produce output within a single LLM context window of the target platform
NFR12: The coordination mechanism must synthesize agent perspectives without exceeding the target platform's context limits
NFR13: Story files remain concise enough that the dev agent can load story + plan within context limits for implementation
NFR14: System documents the context window budget per platform in `config.yaml` and warns when a story file or refinement output approaches 80% of the platform's limit
NFR15: Story file schema must be backwards-compatible — new fields are always optional with sensible defaults. Old story files must work with new workflow versions without migration
NFR16: Feedback data (accepted/rejected perspectives) is stored in a dedicated section of the refinement file, separate from user-editable content

### Additional Requirements

- **Starter Template:** Architecture specifies using v2 layout with PRD-scoped content — reuse proven folder organization from `opencode-scrum-workflow-v2/scrum_workflow/`, rewrite content to match MVP scope (3 agents, 3 MVP commands)
- **Phase 0: `/scrum-create-project-context` command** — Architecture adds a new Phase 0 not in PRD: codebase analysis + context/skills generation before any ticket work. Two-phase approach (Analysis via shell commands → Generation via templates)
- **SDK/Framework Pattern with Three-Layer Separation:** Framework Layer (`scrum_workflow/`), Adapter Layer (`.claude/`, `.github/`, etc.), State Layer (`sprints/`, project `config.yaml`)
- **SKILL.md format** for all agent definitions and command definitions — YAML frontmatter (name, role, model, active_in, max_tokens) + Markdown body (Identity, Instructions, Output Format, Context Rules)
- **Story file YAML schema with state machine:** `schema_version`, `ticket`, `title`, `status`, `estimation`, `created`, `updated` — status transitions: draft → refinement → ready → in-dev → in-review → done
- **Command-as-orchestrator model:** Each command file IS the orchestrator for its phase — no separate orchestrator agent
- **Model routing:** Coordination logic uses primary model (Opus), sub-agents can use lighter models (Sonnet) — configured per agent in SKILL.md frontmatter
- **Blackboard pattern for inter-phase handoff:** Phases communicate exclusively through files in the sprint folder
- **Platform adapter contract:** Minimal adapter per platform providing instruction file + command registration — no logic in adapters
- **Framework distribution via `framework_path`** in project-level `config.yaml` — absolute path reference to shared framework
- **CSV format eliminated** — no justified use case for MVP; YAML lists and Markdown tables replace CSV
- **Context file sharded structure:** `context/index.md` as discovery index + domain-specific sub-files (`frontend.md`, `backend.md`, `testing.md`, `devops.md`, `architecture.md`)
- **Agent loading model:** Agent = Role (`agents/*.md`) + Domain Skill (project `skills/`) + Context (project `context/`)
- **Two types of skills:** Workflow Skills (framework, generic) vs. Domain Skills (project-specific, generated by `/scrum-create-project-context`)
- **6 consistency rule categories:** Naming patterns (kebab-case files, snake_case YAML), SKILL.md structure patterns, agent output format (table-based), Markdown/YAML conventions, error & recovery patterns (status-based recovery), write boundary rules (each phase owns its artifacts)
- **Implementation sequence from Architecture:** (1) Framework templates → (2) /create-project-context → (3) Story schema + state machine → (4) /create-ticket → (5) Agent definitions → (6) /refine-ticket → (7) Readiness check → (8) /dev-story → (9) Approval gate → (10) Platform adapters
- **Agentic patterns validated by research:** All 10 patterns from agentic-patterns.com verified and architecturally sound. Key finding: 3-agent MVP and 3-iteration review cap are empirically optimal
- **Token cost optimization:** Model routing (Opus for coordination, Sonnet for sub-agents) reduces token costs 40-60%
- **Sprint folder IS the observability layer** — every phase produces a persistent, inspectable file. No additional tracing infrastructure needed for MVP

### UX Design Requirements

No UX Design document exists for this project. UX Design requirements are not applicable.

### Installer NFRs

NFR17: Installer must complete a fresh installation in under 5 seconds
NFR18: Installer npm package size must be under 500 KB
NFR19: Installer has zero runtime dependency on BMAD — completely standalone codebase
NFR20: Lock file enables idempotent reinstallation — running install twice produces identical results
NFR21: User-modified files must be 100% preserved during updates via backup/restore mechanism

### FR Coverage Map

FR1: Epic 2 - User creates ticket with natural language idea
FR2: Epic 2 - System generates structured story file from input
FR3: Epic 2 - System enters guided mode for vague input
FR4: Epic 2 - System generates initial story estimation
FR5: Epic 2 - Story file created in sprint folder structure
FR6: Epic 3 - User triggers refinement for a ticket
FR7: Epic 3 - System spawns parallel agent perspectives (Architect, Dev, QA)
FR8: Epic 3 - Each agent perspective displayed separately and attributed
FR9: Epic 3 - Architect identifies risks, decisions, dependencies
FR10: Epic 3 - Dev identifies technical dependencies and feasibility
FR11: Epic 3 - QA proposes acceptance criteria and edge cases
FR12: Epic 3 - Coordination mechanism merges accepted perspectives
FR13: Epic 3 - User accepts/rejects each perspective individually
FR14: Epic 3 - System records feedback for quality tracking
FR15: Epic 3 - System validates story completeness (readiness gate)
FR16: Epic 3 - Readiness check produces PASS/FAIL with reasons
FR17: Epic 3 - No implementation without readiness check pass
FR18: Epic 4 - User triggers implementation of a ticket
FR19: Epic 4 - System implements code based on plan and spec
FR20: Epic 4 - System generates review report after implementation
FR21: Epic 4 - User triggers review for implemented ticket
FR22: Epic 4 - Review agent reads and analyzes code changes
FR23: Epic 4 - Review evaluates against spec and acceptance criteria
FR24: Epic 4 - Review findings in separate review file
FR25: Epic 4 - Review findings include severity and suggested fixes
FR26: Epic 4 - Each finding references specific AC or subtask
FR27: Epic 4 - User approves reviewed story as DONE
FR28: Epic 4 - No story marked DONE without human approval
FR29: Epic 4 - Approval recorded in approval file
FR30: Epic 2 - Each ticket has own folder with all artifacts
FR31: Epic 2 - Story files use YAML frontmatter for metadata
FR32: Epic 2 - Story status tracked and updated at phase transitions
FR33: Epic 2 - All artifacts are standard Markdown
FR34: Epic 2 - System detects and resumes interrupted workflows
FR35: Epic 2 - System validates story file integrity
FR36: Epic 1 - Documented platform abstraction layer with interface contracts
FR37: Epic 1 - Config specifies target platform
FR38: Epic 1 - Platform change requires only config change
FR39: Epic 1 - System installed by copying files
FR40: Epic 1 - Configuration stored in single YAML file
FR41: Epic 1 - Agent roles in separate Markdown files, extensible
FR49: Epic 5 - User installs scrum_workflow via single CLI command
FR50: Epic 5 - Installer copies all framework files verbatim
FR51: Epic 5 - Installer registers skill shims per platform
FR52: Epic 5 - Multiple AI platform support via config-driven registry
FR53: Epic 5 - New platform = YAML entry, zero code changes
FR54: Epic 5 - Lock file with SHA-256 hashes for integrity tracking
FR55: Epic 5 - Update existing installation preserving user modifications
FR56: Epic 5 - Update detects modified files via hash comparison + backup/restore
FR57: Epic 5 - Status command shows installation info
FR58: Epic 5 - Non-interactive mode via CLI flags
FR59: Epic 5 - Standalone CLI with zero BMAD dependency
FR60: Epic 6 - User generates business logic docs via single command
FR61: Epic 6 - System identifies business rules, validations, guards
FR62: Epic 6 - System identifies workflows, state machines, events
FR63: Epic 6 - System identifies domain entities and relationships
FR64: Epic 6 - Generated docs include Mermaid diagrams
FR65: Epic 6 - Incremental update mode compares code vs. existing docs
FR66: Epic 6 - Update mode shows diff and requires user confirmation
FR67: Epic 6 - Scan state file tracks documentation state
FR68: Epic 6 - Source code references (file:line) in docs
FR69: Epic 6 - Language-agnostic via grep-based analysis
FR70: Epic 7 - User generates architecture docs via single command
FR71: Epic 7 - System documents backend architecture (API, events, schedulers)
FR72: Epic 7 - System documents frontend architecture (components, state, routing)
FR73: Epic 7 - System documents DevOps architecture (CI/CD, Docker, K8s)
FR74: Epic 7 - System documents local dev environment (Wiremock, compose, env)
FR75: Epic 7 - System documents testing architecture (pyramid, frameworks, coverage)
FR76: Epic 7 - Generated docs include Mermaid diagrams
FR77: Epic 7 - Incremental update mode for architecture docs
FR78: Epic 7 - Language-agnostic via grep-based analysis
FR79: Epic 7 - Independent scan state (.arch-scan-state.json)
FR80: Epic 9 - User runs /scrum-research technical for technical research
FR81: Epic 9 - System performs web research using WebSearch tool
FR82: Epic 9 - Plan-Then-Execute pattern for structured research
FR83: Epic 9 - Swarm Migration pattern for parallel research (10x+ speedup)
FR84: Epic 9 - Reflection Loop for quality improvement
FR85: Epic 9 - Filesystem-based state for checkpoint recovery
FR86: Epic 9 - AI-optimized output with structured frontmatter
FR87: Epic 9 - Incremental update mode for research refresh
FR88: Epic 9 - /scrum-research general for broader research
FR89: Epic 9 - Research output to docs/research/ directory
FR90: Epic 9 - Research agent integrated into npm installer
FR91: Epic 10 - Refinement prompts for additional documents
FR92: Epic 10 - Cross-talk discussion rounds between agents
FR93: Epic 10 - Consensus detection with human escalation
FR94: Epic 10 - Independent agent estimation (Wideband Delphi)
FR95: Epic 10 - Estimation variance triggers re-estimation
FR96: Epic 10 - Final estimate uses median with confidence

## Epic List

### Epic 1: Framework Setup & Project Onboarding
After this epic, the user can install the framework, configure it for their platform, and run `/scrum-create-project-context` to analyze their codebase — so agents understand the project before any ticket work begins.
**FRs covered:** FR36, FR37, FR38, FR39, FR40, FR41
**Architecture requirements:** Phase 0 `/scrum-create-project-context`, SDK/Framework Pattern, Three-Layer Separation, SKILL.md format, Adapter Contract, Framework Distribution, config.yaml, Context Templates

### Epic 2: Spec-First Ticket Creation
After this epic, the user can create structured tickets from natural language ideas — with guided mode for vague input. Story files are created in the correct schema with state machine, sprint folder structure, and error recovery.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR30, FR31, FR32, FR33, FR34, FR35
**Architecture requirements:** Story Schema with State Machine, Sprint Folder Structure, Naming Conventions, Markdown/YAML Conventions, Error/Recovery Patterns

### Epic 3: Multi-Agent Story Refinement
After this epic, the user can refine tickets through parallel Architect/Dev/QA perspectives, accept or reject each perspective individually, and receive an updated story file with refined description, acceptance criteria, estimation, and subtasks.
**FRs covered:** FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14
**Architecture requirements:** Agent Definitions (SKILL.md), Agent Loading Model (Role + Skill + Context), Agent Output Format (Table-based), Model Routing, Sub-Agent Spawning, Synthesis Skill

### Epic 4: Development, Review & Approval
After this epic, the user can complete the full workflow cycle: readiness check validates the story, implementation follows the plan, code review evaluates against acceptance criteria, and human approval marks the story as DONE.
**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29
**Architecture requirements:** Plan-Then-Execute Gate, Blackboard Handoff, Write Boundary Rules, Review Format, Approval Record, Inter-Phase Handoff Protocol

### Epic 5: `create-scrum-workflow` — Standalone Local Installer
After this epic, the user can install the scrum_workflow framework into any project by running a single CLI command (`node bin/create-scrum-workflow.js install`), update existing installations safely, and check installation status — across any supported AI coding platform.
**FRs covered:** FR49, FR50, FR51, FR52, FR53, FR54, FR55, FR56, FR57, FR58, FR59
**Research basis:** `_bmad-output/planning-artifacts/research/technical-bmad-install-script-analysis-research-2026-03-27.md`
**Architecture patterns:** Config-driven platform registry, verbatim copy pipeline, SHA-256 lock file integrity, backup/restore on update
**Constraint:** Zero BMAD dependency — standalone project, own codebase, no shared code (NFR19)

### Epic 6: Business Logic Documentation Agent
After this epic, the user can run `/scrum-create-project-docs` to generate comprehensive business logic documentation for any existing project — including Mermaid diagrams — and incrementally update docs as the codebase evolves.
**FRs covered:** FR60, FR61, FR62, FR63, FR64, FR65, FR66, FR67, FR68, FR69
**Research basis:** `_bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md`
**Architecture patterns:** Two-Mode Scan (full + update), Template-Driven Output, Grep-based language-agnostic analysis, Reflection Pattern for update diffs, Scan State Management
**Key design decisions:** Single agent (no multi-agent overhead), Mermaid-first documentation, business logic focus only (architecture is a separate agent)

### Epic 7: Architecture Documentation Agent
After this epic, the user can run `/scrum-create-architecture-docs` to generate comprehensive architecture documentation for any existing project — covering backend, frontend, DevOps, local dev environment, and testing — with inline Mermaid diagrams, and incrementally update docs as the codebase evolves.
**FRs covered:** FR70, FR71, FR72, FR73, FR74, FR75, FR76, FR77, FR78, FR79
**Research basis:** `_bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md`
**Architecture patterns:** Two-Mode Scan (full + update), Template-Driven Output, Grep-based language-agnostic analysis, Multi-Stage Pipeline Pattern, Scan State Management (independent from Epic 6)
**Key design decisions:** Single agent (no multi-agent overhead), Mermaid-first documentation, architecture structure focus only (business logic is Epic 6), separate scan state from business logic agent

### Epic 8: Installer Integration — Epic 6 & 7 Documentation Skills
After this epic, the `create-scrum-workflow` installer installs all documentation skills from Epic 6 and Epic 7 — making `/scrum-create-project-docs` and `/scrum-create-architecture-docs` available as platform-discoverable commands alongside the original four skills.
**FRs covered:** (Integration FRs for Epic 6/7 skills into installer)
**Architecture patterns:** Template-based skill registration, automatic skill discovery, lock file integrity tracking

### Epic 9: Research Agent — Technical & General
After this epic, the user can run `/scrum-research technical <topic>` and `/scrum-research general <topic>` to generate comprehensive research documentation using agentic patterns (Plan-Then-Execute, Swarm Migration, Reflection Loop, Filesystem-Based State). The agent performs web research, generates AI-optimized output with structured frontmatter, and supports incremental updates. Research output is saved to `docs/research/` and the agent is fully integrated into the npm installer.
**FRs covered:** FR80, FR81, FR82, FR83, FR84, FR85, FR86, FR87, FR88, FR89, FR90
**Research basis:** `docs/research/technical-research-agent-patterns-2026-03-30.md`
**Architecture patterns:** Plan-Then-Execute Workflow, Swarm Migration Pattern (parallel research), Reflection Loop (quality assurance), Filesystem-Based Agent State (checkpoints), Structured Output Specification (AI-optimized frontmatter), Code-Over-API Pattern (token optimization via WebSearch)
**Key design decisions:** Single agent (`researcher`) with two workflow modes (technical/general), research state persisted to `.research-state.json`, output follows same frontmatter schema as source research document, automatic installer integration via template registration

### Epic 10: Enhanced Refinement — Doc-Discovery, Cross-Talk & Estimation
After this epic, the `/scrum-refine-ticket` command is enhanced with: (1) **Doc-Discovery Phase** for user-provided additional context, (2) **Cross-Talk Discussion Rounds** using Multi-Agent Debate pattern where Architect, Developer, and QA agents see and comment on each other's perspectives until consensus or human escalation, (3) **Estimation Phase** using Wideband Delphi / Planning Poker for collaborative story point estimation with variance detection.
**FRs covered:** FR91, FR92, FR93, FR94, FR95, FR96
**Research basis:** `docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md`
**Architecture patterns:** Opponent Processor / Multi-Agent Debate Pattern, BMAD Cross-Talk Pattern (uncorrelated context windows), Wideband Delphi / Planning Poker, Max Rounds with Deadlock Detection, Context Budget Enforcement (400 words per spawn)
**Key design decisions:** Max 3 discussion rounds before human escalation, 80% consensus threshold, 2-point estimation variance triggers re-estimation, doc-discovery is optional (user can skip)

## Epic 1: Framework Setup & Project Onboarding

After this epic, the user can install the framework, configure it for their platform, and run `/scrum-create-project-context` to analyze their codebase — so agents understand the project before any ticket work begins.

### Story 1.1: Framework Directory Structure & Default Configuration

As a developer,
I want to install the scrum_workflow framework by copying files into my environment,
So that I have a working framework foundation with default configuration ready for customization.

**Acceptance Criteria:**

**Given** a fresh environment without scrum_workflow installed
**When** the framework files are copied into the target location
**Then** the following directory structure exists: `scrum_workflow/` with subdirectories `agents/`, `commands/`, `workflows/`, `skills/`, `templates/`, `context/`, `data/`
**And** `scrum_workflow/config.yaml` exists with all required fields (`platform`, `active_agents`, `token_budgets`) having documented default values
**And** `scrum_workflow/context/architecture-guidelines.md` and `scrum_workflow/context/standards.md` exist with framework-level conventions
**And** all files use kebab-case naming and all YAML fields use snake_case naming per the consistency rules
**And** `config.yaml` follows convention-over-configuration — minimal required fields, sensible defaults for everything else (NFR7)
**And** the framework has zero runtime dependencies — pure YAML and Markdown files only (NFR9)

### Story 1.2: Agent Definitions in SKILL.md Format

As a developer,
I want the three MVP agent roles (Architect, Developer, QA) defined as SKILL.md files,
So that the refinement phase can spawn agents with distinct perspectives.

**Acceptance Criteria:**

**Given** the framework directory structure from Story 1.1 exists
**When** the agent definition files are created
**Then** `scrum_workflow/agents/architect.md`, `developer.md`, and `qa.md` exist in SKILL.md format
**And** each file has YAML frontmatter with fields in this exact order: `name`, `display_name`, `role`, `active_in`, `model`, `max_tokens`
**And** each file has Markdown body with sections in this exact order: Identity, Instructions, Output Format, Context Rules
**And** the Architect agent's Output Format uses the table-based refinement perspective format (Findings table + Recommendations + Proposed Acceptance Criteria)
**And** the Dev agent's Output Format uses the same table-based format with technical dependency focus
**And** the QA agent's Output Format uses the same table-based format with acceptance criteria and edge case focus
**And** adding a 4th agent requires only creating a new Markdown file in `agents/` — no other changes needed (NFR4)

### Story 1.3: Platform Adapter Contract & Claude Code Adapter

As a developer,
I want a documented platform abstraction layer and a working Claude Code adapter,
So that I can use the workflow on Claude Code today and switch platforms later with only a config change.

**Acceptance Criteria:**

**Given** the framework with agents and config from Stories 1.1-1.2 exists
**When** the platform adapter is set up for Claude Code
**Then** `.claude/skills/` contains skill registration files for each MVP command (`create-project-context`, `create-ticket`, `refine-ticket`, `dev-story`)
**And** each skill registration file references the corresponding `scrum_workflow/commands/*.md` file — no workflow logic duplicated in the adapter
**And** `config.yaml` contains a `platform` field set to `claude-code`
**And** the adapter instruction file tells the AI platform where the framework lives via `framework_path` and how to use it
**And** changing `platform` in `config.yaml` is the only change needed to target a different platform (FR38, NFR5)
**And** no adapter file contains workflow logic — adapters are pure references to framework files

### Story 1.4: Output Templates for All Workflow Phases

As a developer,
I want standardized output templates for every workflow artifact,
So that all commands produce consistent, schema-compliant files.

**Acceptance Criteria:**

**Given** the framework directory structure exists
**When** the templates are created in `scrum_workflow/templates/`
**Then** the following templates exist: `story.md`, `refinement.md`, `plan.md`, `review.md`, `approval.md`
**And** `story.md` template includes YAML frontmatter with fields: `schema_version`, `ticket`, `title`, `status`, `estimation`, `created`, `updated`
**And** the following context templates exist: `context-index.md`, `context-frontend.md`, `context-backend.md`, `context-testing.md`, `context-devops.md`, `context-architecture.md`
**And** the following skill templates exist: `skill-backend.md`, `skill-frontend.md`, `skill-testing.md`, `skill-devops.md`, `skill-project-architect.md`
**And** all templates use the documented Markdown conventions (single `#` title, `##` sections, `###` subsections, `-` for lists)
**And** all YAML frontmatter in templates follows the documented conventions (quoted strings with special chars, explicit `null`, ISO 8601 dates)
**And** `estimation-reference.yaml` exists in `scrum_workflow/data/` with estimation guidance for story creation (FR4)

### Story 1.5: `/scrum-create-project-context` Command & Workflow

As a developer,
I want to run `/scrum-create-project-context` to automatically analyze my codebase,
So that agents understand my project's tech stack, architecture, and conventions before any ticket work begins.

**Acceptance Criteria:**

**Given** the framework is installed with templates from Story 1.4
**When** the user runs `/scrum-create-project-context` in a project
**Then** `scrum_workflow/commands/create-project-context.md` exists in SKILL.md command format with frontmatter: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`
**And** `scrum_workflow/workflows/project-context.md` exists with the two-phase workflow (Phase A: Analysis via shell commands, Phase B: Generation via templates)
**And** Phase A collects facts via shell commands: directory structure, dependency files (`package.json`, `requirements.txt`, etc.), Docker/CI config, test patterns
**And** Phase B fills context templates with collected facts and writes to `project-root/context/*.md`
**And** `context/index.md` is generated as discovery index with agent loading map (which agent loads which domain files)
**And** domain skill files are generated in `project-root/skills/*/SKILL.md` for each detected domain
**And** only context files for detected domains are generated — no empty files for missing domains
**And** every generated `context/*.md` has valid YAML frontmatter
**And** `index.md` references all generated sub-files (cross-reference validation)
**And** running the command again overwrites cleanly (idempotent, MVP behavior)

## Epic 2: Spec-First Ticket Creation

After this epic, the user can create structured tickets from natural language ideas — with guided mode for vague input. Story files are created in the correct schema with state machine, sprint folder structure, and error recovery.

### Story 2.1: Story File Schema & Sprint Folder Conventions

As a developer,
I want a defined story file schema with a status state machine and standardized sprint folder conventions,
So that all commands produce consistent, parseable story artifacts with reliable phase transitions.

**Acceptance Criteria:**

**Given** the framework from Epic 1 is installed and `templates/story.md` exists from Story 1.4
**When** the story file schema conventions and state machine guards are finalized
**Then** the state machine is documented in `scrum_workflow/context/standards.md` with all transitions and guard conditions: `draft → refinement` (trigger: /refine-ticket), `refinement → ready` (guard: readiness check PASS), `refinement → draft` (guard: readiness check FAIL), `ready → in-dev` (guard: status == ready, trigger: /dev-story), `in-dev → in-review` (trigger: /dev-story review), `in-review → done` (guard: explicit user approval)
**And** the sprint folder convention `sprints/SW-XXX/` with zero-padded 3-digit ticket numbers is documented
**And** each ticket folder can contain: `story.md`, `refinement.md`, `plan.md`, `review-N.md`, `approval.md` (FR30)
**And** all story artifacts are standard Markdown readable without the tool (FR33)
**And** `schema_version` field enables backwards-compatible evolution — new fields are always optional with sensible defaults (NFR15)
**And** commands must verify guard conditions before executing — no skipping phases

### Story 2.2: `/scrum-create-ticket` Command & Workflow

As a developer,
I want to run `/scrum-create-ticket SW-103 "User authentication with OAuth2 support"` and get a structured story file,
So that I can turn a natural language idea into a formal specification without prompt engineering.

**Acceptance Criteria:**

**Given** the framework is installed and project context exists from `/scrum-create-project-context`
**When** the user runs `/scrum-create-ticket SW-103 "User authentication with OAuth2 support"`
**Then** `scrum_workflow/commands/create-ticket.md` exists in SKILL.md command format with `trigger: /create-ticket`, `requires_status: null`, `sets_status: draft`
**And** `scrum_workflow/workflows/ticket-creation.md` exists with step-by-step creation workflow
**And** the command creates `sprints/SW-103/story.md` with valid YAML frontmatter (`schema_version: 1`, `ticket: SW-103`, `status: draft`, `created: <today>`)
**And** the story body contains a structured description generated from the user's input
**And** the system generates an initial estimation based on the ticket description using `data/estimation-reference.yaml` (FR4)
**And** the command reads `context/index.md` to load relevant project context for better story generation
**And** the complete story file is written in a single write operation — no partial writes that could corrupt frontmatter (NFR1)
**And** the status is set to `draft` upon creation (FR32)

### Story 2.3: Guided Mode for Vague Input

As a developer,
I want the system to ask clarifying questions when my input is too vague,
So that I get a high-quality story file even when I don't know exactly how to describe what I need.

**Acceptance Criteria:**

**Given** the `/scrum-create-ticket` command from Story 2.2 is functional
**When** the user runs `/scrum-create-ticket SW-104 "dark mode"`
**Then** the system detects the input is vague or incomplete (FR3)
**And** `scrum_workflow/skills/guided-mode/SKILL.md` exists defining how to clarify vague tickets
**And** the system enters guided mode and asks targeted follow-up questions (e.g., "Who is this for?", "What problem does it solve?", "Where in the app should this appear?")
**And** the system waits for user responses before generating the story file
**And** after sufficient context is gathered, the system generates a structured story file as in Story 2.2
**And** the guided mode questions are context-aware — informed by the project context from `context/*.md` (e.g., "Which of your existing API endpoints should this integrate with?")
**And** if the input is already detailed enough, guided mode is NOT triggered — the story is created directly

### Story 2.4: Story File Integrity Validation & Workflow Recovery

As a developer,
I want the system to validate story files before processing and resume interrupted workflows,
So that I never lose progress and corrupted files are caught before they cause problems.

**Acceptance Criteria:**

**Given** a story file exists in `sprints/SW-XXX/story.md`
**When** any command attempts to process the story file
**Then** the system validates story file integrity before processing (FR35): valid YAML frontmatter, required fields present, status value is a valid state
**And** if frontmatter is invalid, the system returns an actionable error: "Invalid frontmatter in story.md: field `status` missing"
**And** if a required file is missing, the system returns: "File `sprints/SW-101/story.md` not found. Run `/scrum-create-ticket SW-101` first"
**And** if `context/index.md` does not exist, the system returns: "Project context not found. Run `/scrum-create-project-context` first"
**And** if a command is run on the wrong status, the system returns: "Story SW-101 is in status `draft`, but `/scrum-dev-story` requires `ready`"
**And** after an interruption, the system reads the `status` field from frontmatter and resumes from the correct phase (FR34)
**And** no manual "resume" command is needed — the status value IS the recovery point (NFR2)
**And** all workflow state is persisted to filesystem — no in-memory-only state (NFR3)

## Epic 3: Multi-Agent Story Refinement

After this epic, the user can refine tickets through parallel Architect/Dev/QA perspectives, accept or reject each perspective individually, and receive an updated story file with refined description, acceptance criteria, estimation, and subtasks.

### Story 3.1: `/scrum-refine-ticket` Command & Agent Spawning

As a developer,
I want to run `/scrum-refine-ticket SW-103` and have three agent perspectives analyze my story in parallel,
So that I get diverse expert feedback on risks, feasibility, and testability before implementation.

**Acceptance Criteria:**

**Given** a story file `sprints/SW-103/story.md` exists with `status: draft`
**When** the user runs `/scrum-refine-ticket SW-103`
**Then** `scrum_workflow/commands/refine-ticket.md` exists in SKILL.md command format with `trigger: /refine-ticket`, `requires_status: draft`, `sets_status: refinement`, `spawns_agents: [architect, developer, qa]`
**And** `scrum_workflow/workflows/refinement.md` exists with step-by-step refinement orchestration
**And** the command updates `story.md` status from `draft` to `refinement` (FR32)
**And** three sub-agents are spawned with isolated context per the Sub-Agent Spawning pattern (FR7)
**And** the Architect agent receives: `story.md` + `context/index.md` + `context/architecture.md` + relevant domain context + `skills/project-architect/SKILL.md`
**And** the Developer agent receives: `story.md` + `context/index.md` + relevant domain context + `skills/{ticket-domain}/SKILL.md`
**And** the QA agent receives: `story.md` + `context/index.md` + `context/testing.md` + relevant domain context + `skills/testing/SKILL.md`
**And** the orchestrator (command file) reads `context/index.md` to determine which domain the ticket belongs to

### Story 3.2: Agent Perspectives with Distinct Output

As a developer,
I want each agent's perspective displayed separately and clearly attributed to its role,
So that I can see what the Architect said vs. what QA said and evaluate each perspective independently.

**Acceptance Criteria:**

**Given** three agents have been spawned for `/scrum-refine-ticket SW-103`
**When** each agent completes its analysis
**Then** the Architect perspective identifies architectural risks, affected design decisions, and dependencies (FR9)
**And** the Developer perspective identifies technical dependencies, implementation concerns, and feasibility issues (FR10)
**And** the QA perspective proposes testable acceptance criteria and identifies edge cases (FR11)
**And** each perspective is displayed separately and visibly attributed to its role (FR8)
**And** each perspective follows the standard table-based output format: `## [Agent-Name] Perspective` with Findings table (columns: #, Finding, Severity, Category), Recommendations list, and Proposed Acceptance Criteria checklist
**And** each agent's output fits within a single LLM context window of the target platform (NFR11)

### Story 3.3: Perspective Synthesis & Story Update

As a developer,
I want accepted agent perspectives merged into a coherent updated story file,
So that my story has refined description, acceptance criteria, estimation, and subtasks ready for implementation.

**Acceptance Criteria:**

**Given** all three agent perspectives have been generated and displayed
**When** the user has accepted or rejected individual perspectives
**Then** `scrum_workflow/skills/synthesis/SKILL.md` exists defining how to merge agent perspectives (FR12)
**And** the coordination mechanism merges only accepted perspectives into the updated `story.md`
**And** the updated story file contains: refined description, acceptance criteria (from QA + user edits), updated estimation, and subtasks
**And** `sprints/SW-103/refinement.md` is created containing all agent perspectives (accepted and rejected) for auditability
**And** the synthesis does not exceed the target platform's context limits (NFR12)

### Story 3.4: Lightweight Feedback & Quality Tracking

As a developer,
I want to accept or reject each agent perspective individually and have my feedback recorded,
So that the system can track refinement quality over time and improve agent perspectives.

**Acceptance Criteria:**

**Given** agent perspectives have been displayed for `/scrum-refine-ticket SW-103`
**When** the user provides feedback on each perspective
**Then** the user can accept or reject each agent perspective individually via a simple prompt (FR13)
**And** feedback data (accepted/rejected per perspective) is recorded in a dedicated section of `refinement.md`, separate from user-editable content (FR14, NFR16)
**And** the feedback section includes: agent name, accept/reject decision, and optional user comment
**And** feedback data is preserved even if the story file is later updated
**And** after feedback is collected, the synthesis process (Story 3.3) uses only accepted perspectives

### Story 3.5: Readiness Check Gate

As a developer,
I want the system to validate that my story is complete before implementation begins,
So that no half-baked story enters the development phase.

**Acceptance Criteria:**

**Given** a story has been refined and perspectives synthesized (`status: refinement`)
**When** the readiness check runs (embedded in refinement workflow)
**Then** `scrum_workflow/workflows/readiness-check.md` exists with validation logic
**And** `scrum_workflow/skills/readiness-check/SKILL.md` exists defining completeness criteria (FR15)
**And** the check validates: description present, acceptance criteria defined, estimation set, subtasks listed
**And** the check produces a clear PASS/FAIL result with specific reasons for failure (FR16)
**And** on PASS: `plan.md` is assembled from the already-synthesized subtasks and execution plan (from Story 3.3), and `story.md` status is updated to `ready`
**And** on FAIL: `story.md` status reverts to `draft` with failure reasons documented, allowing re-refinement
**And** no implementation can begin on a story that has not passed the readiness check (FR17)

## Epic 4: Development, Review & Approval

After this epic, the user can complete the full workflow cycle: implementation follows the plan, code review evaluates against acceptance criteria, and human approval marks the story as DONE. This completes the end-to-end MVP workflow from `/scrum-create-project-context` through to `approval.md`.

### Story 4.1: `/scrum-dev-story` Command & Implementation Workflow

As a developer,
I want to run `/scrum-dev-story SW-103` to implement code based on the approved plan,
So that the agent follows my specification exactly instead of improvising.

**Acceptance Criteria:**

**Given** a story `sprints/SW-103/story.md` with `status: ready` and `plan.md` exists
**When** the user runs `/scrum-dev-story SW-103`
**Then** `scrum_workflow/commands/dev-story.md` exists in SKILL.md command format with `trigger: /dev-story`, `requires_status: ready`, `sets_status: in-dev`
**And** `scrum_workflow/workflows/development.md` exists with step-by-step implementation workflow
**And** the command verifies the guard condition `status == ready` before proceeding (FR17)
**And** the agent implements code based on `story.md` specification and `plan.md` subtask sequence (FR19)
**And** the agent loads relevant project context and domain skills for implementation: `context/{domain}.md` + `skills/{domain}/SKILL.md`
**And** `story.md` status is updated to `in-dev` (FR32)
**And** the dev agent writes ONLY code files — never `story.md`, `refinement.md`, or `plan.md` (Write Boundary Rules)

### Story 4.2: Code Review with Structured Findings

As a developer,
I want to trigger a review that evaluates my implementation against the story specification,
So that I get specific, actionable findings tied to acceptance criteria before approval.

**Acceptance Criteria:**

**Given** a story with `status: in-dev` and code has been implemented
**When** the user runs `/scrum-dev-story SW-103 review`
**Then** `scrum_workflow/workflows/review.md` exists with the single-pass review workflow (MVP — no loop)
**And** the review agent reads and analyzes implemented code changes in the context of `story.md` and `plan.md` (FR22)
**And** the review evaluates implementation against the story specification and acceptance criteria (FR23)
**And** the system generates a review report documenting findings after implementation (FR20)
**And** review findings are documented in `sprints/SW-103/review-1.md` (FR24)
**And** the review file follows the standard format: Summary table (Total, Critical, Major, Minor) + Findings table (columns: #, Finding, Severity, AC Reference, Suggested Fix)
**And** each finding includes specific issues, their severity, and suggested fixes (FR25)
**And** each finding references the specific acceptance criterion or subtask it relates to (FR26)
**And** if a review is triggered again after manual fixes, a new file `review-N.md` is created with N incremented (e.g., `review-2.md`) — previous review files are preserved
**And** `story.md` status is updated to `in-review` (FR32)
**And** the review agent writes ONLY `review-N.md` — never `story.md`, `refinement.md`, or `plan.md` (Write Boundary Rules)

### Story 4.3: Human Approval Gate & Story Completion

As a developer,
I want to explicitly approve a reviewed story as DONE,
So that no story ships without my sign-off and there is a clear audit trail.

**Acceptance Criteria:**

**Given** a story with `status: in-review` and `review-1.md` exists
**When** the user reviews the findings and makes an approval decision
**Then** `scrum_workflow/workflows/approval.md` exists with the human sign-off workflow
**And** the system presents review findings and asks for explicit approval
**And** no story can be marked as DONE without explicit human approval (FR28)
**And** if user approves: approval is recorded in `sprints/SW-103/approval.md` with approver, date, decision, and any comments (FR29)
**And** if user approves: `story.md` status is updated from `in-review` to `done` (FR32)
**And** if user does not approve: story remains in `in-review` status — user can manually fix issues and re-trigger `/scrum-dev-story SW-103 review` to generate a new `review-N.md`
**And** the approval workflow writes ONLY `approval.md` and `story.md` status — no other sprint files (Write Boundary Rules)
**And** the complete ticket folder now contains the full audit trail: `story.md`, `refinement.md`, `plan.md`, `review-N.md`, `approval.md` — completing the end-to-end MVP workflow

## Epic 5: `create-scrum-workflow` — Standalone Local Installer

After this epic, the user can install the scrum_workflow framework into any project by running a single CLI command, update existing installations safely while preserving user modifications, and check installation status — across any supported AI coding platform. This is a **separate project** (`create-scrum-workflow/`) with its own `package.json`, completely independent from BMAD.

**Story Dependency Map:**
- Stories 5.1 and 5.2 can be worked in **parallel** (no dependencies)
- Story 5.3 depends on 5.1
- Story 5.4 depends on 5.1 and 5.2
- Story 5.5 depends on 5.2 and 5.4
- Story 5.6 depends on 5.4 and 5.5
- Story 5.7 depends on 5.6
- Story 5.8 depends on 5.6
- Story 5.9 is **optional** (Phase 3) and depends on 5.1-5.8

### Story 5.1: Project Scaffolding & CLI Entry Point

As a developer,
I want a Node.js CLI project with commander-based command dispatch,
So that I have a working CLI skeleton that can parse commands and flags before any installer logic is added.

**Acceptance Criteria:**

**Given** an empty directory for the `create-scrum-workflow` project
**When** the project is scaffolded
**Then** `package.json` exists with `"name": "create-scrum-workflow"`, `"type": "module"`, and `"bin"` entry pointing to `bin/create-scrum-workflow.js`
**And** `bin/create-scrum-workflow.js` exists with `#!/usr/bin/env node` shebang and commander program setup
**And** three commands are registered: `install`, `update`, `status` — each with `--help` output
**And** the `install` command accepts flags: `-d, --directory <path>` (default: `.`), `-p, --platforms <platforms...>` (default: `['claude-code']`), `-y, --yes` (accept all defaults)
**And** the `update` command accepts flag: `-d, --directory <path>` (default: `.`)
**And** the `status` command accepts flag: `-d, --directory <path>` (default: `.`)
**And** running `node bin/create-scrum-workflow.js --help` prints usage information without errors
**And** running `node bin/create-scrum-workflow.js install --help` prints install-specific options
**And** the project uses JavaScript ES Modules throughout — no CommonJS, no build step (FR59, NFR19)
**And** `package.json` lists dependencies: `commander`, `@clack/prompts`, `fs-extra`, `js-yaml`, `picocolors`
**And** `.gitignore` includes `node_modules/`

### Story 5.2: Config-Driven Platform Registry

As a developer,
I want all supported AI coding platforms defined in a single YAML file,
So that adding a new platform requires only a YAML entry and zero code changes.

**Acceptance Criteria:**

**Given** the project scaffolding from Story 5.1 exists
**When** the platform registry is created
**Then** `src/platform/platform-registry.yaml` exists with entries for at least: `claude-code`, `cursor`, `windsurf`, `github-copilot`, `cline`, `agents-universal`
**And** each platform entry contains: `display_name`, `category` (cli/ide/universal), `target_dir` (e.g., `.claude/skills`), `skill_format: skill-md`
**And** `src/platform/platform-registry.js` exists with a function to load and parse the registry
**And** the registry loader returns a Map of platform objects keyed by platform code
**And** adding a new platform requires only adding a YAML entry — zero JavaScript changes (FR53)
**And** the registry includes `fallback_scan` arrays where applicable (e.g., Cursor scans `.claude/skills/` as fallback)
**And** `claude-code` is marked as `preferred: true` and `cross_compat_scan: true` since other platforms scan `.claude/skills/` (FR52)

### Story 5.3: Interactive User Configuration Prompts

As a developer,
I want the installer to collect project name, platform selection, and user preferences through interactive prompts,
So that the installation is customized to my project without requiring manual config file editing.

**Acceptance Criteria:**

**Given** the CLI skeleton from Story 5.1 and platform registry from Story 5.2 exist
**When** the user runs `node bin/create-scrum-workflow.js install`
**Then** `src/core/config-builder.js` exists with prompt logic using `@clack/prompts`
**And** the user is prompted for: target directory (default: `.`), project name (default: directory name), platform selection (multi-select from registry, default: `claude-code`), and framework path name (default: `scrum_workflow`)
**And** all prompts have sensible defaults that can be accepted by pressing Enter
**And** when `--yes` flag is passed, all defaults are accepted without prompts (FR58)
**And** the config builder returns a normalized config object with all resolved values
**And** invalid directory paths produce a clear error message and re-prompt
**And** at least one platform must be selected — empty selection shows a validation error

### Story 5.4: Framework Verbatim Copy Pipeline

As a developer,
I want the installer to copy the entire scrum_workflow framework directory verbatim to my project,
So that I get a complete, self-contained framework installation without any file transformation.

**Acceptance Criteria:**

**Given** the user has completed configuration prompts from Story 5.3
**When** the install command executes the framework copy step
**Then** `src/core/installer.js` exists with the main `Installer` class orchestrating the pipeline
**And** `src/core/path-resolver.js` exists resolving all target paths from config + platform registry
**And** the complete `templates/scrum_workflow/` directory tree is copied verbatim to `{target}/{framework_path}/` (FR50)
**And** the `templates/scrum_workflow/` directory inside the installer package contains all 51 framework files: agents (3), commands (4), workflows (7), skills (7), context (4), templates (16), data (1), config.yaml (1), and remaining framework files
**And** no file content is modified during copy — byte-for-byte identical to source (verbatim copy principle)
**And** the target directory is created if it does not exist
**And** output directories are created: `{target}/_bmad-output/planning-artifacts/`, `{target}/_bmad-output/implementation-artifacts/`
**And** if the target `{framework_path}/` directory already exists, the installer warns and asks for confirmation before overwriting (unless `--yes` is passed)
**And** progress is displayed during copy using `@clack/prompts` spinner

### Story 5.5: Skill Registration per Platform

As a developer,
I want the installer to register scrum_workflow commands as skill shims in each selected platform's skill directory,
So that my AI coding assistant discovers and can invoke the framework commands.

**Acceptance Criteria:**

**Given** the framework has been copied to the target directory (Story 5.4)
**When** the skill registration step executes for each selected platform
**Then** `templates/skill-registrations/` contains 4 SKILL.md shim templates: `create-project-context/SKILL.md`, `create-ticket/SKILL.md`, `refine-ticket/SKILL.md`, `dev-story/SKILL.md`
**And** each shim template contains a `{{framework_path}}` placeholder in the body that references the framework command file
**And** for each selected platform, the installer copies the 4 shim directories to `{target}/.{platform}/skills/` (FR51)
**And** during copy, `{{framework_path}}` is replaced with the resolved framework path (e.g., `scrum_workflow`)
**And** each generated SKILL.md has valid YAML frontmatter with `name` matching the directory name and a `description` field
**And** the `name` frontmatter field uses kebab-case and matches the parent directory name per the Agent Skills specification
**And** if `.{platform}/skills/` already contains a skill with the same name, the installer overwrites it (idempotent)
**And** no workflow logic is duplicated in the shims — they are pure references to framework command files

### Story 5.6: Lock File & Installation Manifest

As a developer,
I want the installer to generate a lock file with SHA-256 hashes for all installed files,
So that future updates can detect which files were modified by me and preserve my changes.

**Acceptance Criteria:**

**Given** framework files and skill registrations have been installed (Stories 5.4, 5.5)
**When** the lock file generation step executes
**Then** `src/integrity/hash-tracker.js` exists with functions to compute SHA-256 hashes for files
**And** `src/integrity/lock-file.js` exists with functions to read, write, and compare lock files
**And** `.scrum-workflow-lock.json` is written to the target project root (FR54)
**And** the lock file contains: `version` (installer version from package.json), `installed` (ISO 8601 timestamp), `updated` (ISO 8601 timestamp), `platforms` (array of selected platform codes), `framework_path` (resolved path), and `files` (object mapping relative file paths to `sha256:<hash>` strings)
**And** every installed file (framework files + skill registrations) has an entry in the `files` object
**And** the lock file is valid JSON and can be parsed by `JSON.parse()` without errors
**And** running the installer again on the same target produces identical hashes for unmodified files (NFR20)
**And** the lock file itself is NOT included in the hash tracking (it changes every run)
**And** the install command prints a summary after completion: number of files installed, platforms configured, lock file location

### Story 5.7: Update Command with Backup/Restore

As a developer,
I want to update an existing scrum_workflow installation while preserving files I've manually modified,
So that I get the latest framework version without losing my customizations.

**Acceptance Criteria:**

**Given** a project with an existing installation and `.scrum-workflow-lock.json` from Story 5.6
**When** the user runs `node bin/create-scrum-workflow.js update`
**Then** `src/commands/update.js` exists with the update pipeline
**And** the command reads `.scrum-workflow-lock.json` and computes current SHA-256 hashes for all tracked files
**And** files are classified into three categories: **unchanged** (current hash matches lock file hash), **user-modified** (current hash differs from lock file hash), **custom** (exists in target but not in lock file) (FR56)
**And** user-modified files are backed up to a temporary directory before overwriting
**And** unchanged files are overwritten with the new version from the installer package
**And** custom files (not tracked by lock file) are left untouched
**And** after overwriting, user-modified files are restored from backup to their original locations (FR55)
**And** the lock file is updated with new hashes for all files (including restored user-modified files with their user hashes)
**And** the `updated` timestamp in the lock file is set to the current time
**And** the update command prints a summary: files updated, files preserved (user-modified), files unchanged
**And** if no `.scrum-workflow-lock.json` exists, the command exits with: "No existing installation found. Run `install` first."
**And** if all files are unchanged, the command prints: "Installation is up to date. No changes needed."

### Story 5.8: Status Command & Diagnostics

As a developer,
I want to check the status of my scrum_workflow installation,
So that I can see which version is installed, which platforms are configured, and how many files are tracked.

**Acceptance Criteria:**

**Given** a project with an existing installation and `.scrum-workflow-lock.json`
**When** the user runs `node bin/create-scrum-workflow.js status`
**Then** `src/commands/status.js` exists with the status display logic
**And** the output shows: installer version (from lock file), installation date, last update date, configured platforms, framework path, total file count
**And** the command computes current hashes and reports: files unchanged, files modified by user, files missing (FR57)
**And** modified files are listed by name so the user knows which files they've customized
**And** missing files are listed as warnings
**And** if no `.scrum-workflow-lock.json` exists, the command prints: "No scrum_workflow installation found in this directory."
**And** the output uses colored terminal output via `picocolors` for readability

### Story 5.9: npm Distribution & CI/CD Pipeline *(Optional — Phase 3)*

As a developer,
I want the installer published to npm so anyone can run `npx create-scrum-workflow`,
So that the framework is easily discoverable and installable with zero setup.

**Acceptance Criteria:**

**Given** the local installer from Stories 5.1-5.8 is complete and tested
**When** the project is prepared for npm distribution
**Then** `package.json` has `"files"` whitelist including only: `bin/`, `src/`, `templates/`
**And** running `npm pack --dry-run` shows no sensitive files (`.env`, credentials, test fixtures)
**And** the package size is under 500 KB (NFR18)
**And** `README.md` exists with: installation instructions, usage examples for all three commands, platform support table, and update workflow documentation
**And** `.github/workflows/release.yml` exists with a CI pipeline that runs tests and publishes to npm on tagged releases
**And** users can invoke via `npx create-scrum-workflow` or `npm create scrum-workflow`
**And** `npx create-scrum-workflow@latest` always fetches the newest version (documented in README to avoid stale npx cache)

## Epic 6: Business Logic Documentation Agent

After this epic, the user can run `/scrum-create-project-docs` to generate comprehensive business logic documentation for any existing project — with inline Mermaid diagrams — and incrementally update docs as the codebase evolves. The agent is language-agnostic and works with any programming language through grep-based code analysis.

**Story Dependency Map:**
- Story 6.1 has no dependencies (agent definition)
- Story 6.2 depends on 6.1 (command + workflow skeleton)
- Stories 6.3, 6.4, and 6.5 depend on 6.2 and can be worked in **parallel** (three independent analysis dimensions)
- Story 6.6 depends on 6.3, 6.4, and 6.5 (update mode needs all three doc types to exist)
- Story 6.7 depends on 6.2 (state management is used by both modes)

### Story 6.1: `documentarian` Agent Definition

As a developer,
I want a dedicated documentation agent defined in SKILL.md format,
So that the agent has a clear identity, instructions, and output format for generating business logic documentation.

**Acceptance Criteria:**

**Given** the `scrum_workflow/agents/` directory exists with `architect.md`, `developer.md`, `qa.md`
**When** the documentarian agent is created
**Then** `scrum_workflow/agents/documentarian.md` exists in SKILL.md format with YAML frontmatter: `name: documentarian`, `display_name: Documentarian`, `role: Business logic documentation specialist`, `active_in: [create-project-docs]`, `model: claude-sonnet-4`, `max_tokens: 4000`
**And** the Identity section defines the agent as a business logic analyst that reads existing codebases and generates structured documentation with Mermaid diagrams
**And** the Instructions section specifies the agent must: (1) scan codebase systematically, (2) identify business rules/validations/guards, (3) trace workflows and state machines, (4) extract domain entities and relationships, (5) generate documentation with inline Mermaid diagrams, (6) include source references (file:line) for all documented logic
**And** the Instructions section specifies the agent is language-agnostic — uses Glob and Grep patterns to find business logic in any language (FR69)
**And** the Output Format section defines the three document types: `business-logic.md`, `workflows.md`, `domain-model.md` — each with required sections and Mermaid diagram types (FR64)
**And** the Context Rules section specifies the agent reads `context/index.md` to understand the project domain before scanning
**And** the agent definition follows the exact same structure as `architect.md` (frontmatter + Identity + Instructions + Output Format + Context Rules)

### Story 6.2: `/scrum-create-project-docs` Command & Workflow Skeleton

As a developer,
I want to run `/scrum-create-project-docs` to trigger business logic documentation generation,
So that I have a single command that orchestrates the full documentation workflow.

**Acceptance Criteria:**

**Given** the documentarian agent from Story 6.1 exists
**When** the command and workflow are created
**Then** `scrum_workflow/commands/create-project-docs.md` exists in SKILL.md command format with `trigger: /create-project-docs`, `requires_status: null`, `sets_status: null`, `spawns_agents: [documentarian]`
**And** `scrum_workflow/workflows/project-documentation.md` exists with the two-mode workflow: `full-scan` (default) and `update` (triggered by `--update` flag)
**And** the workflow defines the documentation output directory as `docs/generated/` relative to project root
**And** the workflow loads the documentarian agent definition and project context before starting analysis
**And** in `full-scan` mode, the workflow orchestrates: (1) project structure scan, (2) business logic analysis → `business-logic.md`, (3) workflow analysis → `workflows.md`, (4) domain model analysis → `domain-model.md`, (5) scan state persistence → `.scan-state.json`
**And** in `update` mode, the workflow orchestrates: (1) load existing `.scan-state.json`, (2) identify changed files, (3) re-analyze changed areas, (4) show diff summary to user, (5) update docs upon user confirmation
**And** the command reads `context/index.md` to determine project domain and tech stack
**And** if `docs/generated/` does not exist, the workflow creates it
**And** if `docs/generated/` already exists and mode is `full-scan`, the workflow warns: "Existing docs found. This will overwrite. Continue? [y/N]"
**And** a `.claude/skills/create-project-docs.md` adapter skill is created that references the framework command

### Story 6.3: Business Logic Analysis & `business-logic.md` Generation

As a developer,
I want the agent to identify and document all business rules, validations, and decision logic in my codebase,
So that I have a comprehensive reference of what the system enforces and why.

**Acceptance Criteria:**

**Given** the `/scrum-create-project-docs` command from Story 6.2 is functional
**When** the agent runs business logic analysis
**Then** the agent scans the codebase using Grep patterns to identify business rules (FR61):
  - Conditional logic with domain terms (`if/else`, `switch/case`, `match`)
  - Validation functions (`validate*`, `check*`, `ensure*`, `assert*`, `is_valid*`)
  - Guard clauses (`throw`, `reject`, `deny`, `forbidden`, `unauthorized`, `abort`)
  - Policy/Rule/Strategy patterns (`*Policy`, `*Rule`, `*Strategy`, `*Validator`)
  - Constants and enums with business meaning (`MAX_*`, `MIN_*`, `ALLOWED_*`, `STATUS_*`)
**And** `scrum_workflow/templates/business-logic.md` exists as the output template with sections: Overview, Business Rules (grouped by domain area), Validation Rules, Guard Clauses & Access Control, Business Constants & Configuration
**And** the generated `docs/generated/business-logic.md` follows the template structure
**And** each documented rule includes: (1) rule name/description, (2) where it's enforced (file:line reference), (3) what it enforces (plain language), (4) a Mermaid `flowchart` showing the decision tree for complex rules (FR64, FR68)
**And** rules are grouped by domain area (e.g., "Authentication", "Billing", "Permissions") based on file paths and context
**And** the agent does NOT document infrastructure logic (logging, error handling, database queries) — only business-domain logic

### Story 6.4: Workflow & State Machine Documentation with `workflows.md`

As a developer,
I want the agent to trace and document all workflows, state machines, and process flows in my codebase,
So that I can see how data and control flow through the system's business processes.

**Acceptance Criteria:**

**Given** the `/scrum-create-project-docs` command from Story 6.2 is functional
**When** the agent runs workflow analysis
**Then** the agent scans the codebase using Grep patterns to identify workflows (FR62):
  - State machines and status transitions (`status`, `state`, `transition`, `FSM`, `machine`)
  - Event handlers (`on*`, `handle*`, `emit`, `dispatch`, `subscribe`, `publish`)
  - Pipeline and middleware chains (`pipe`, `use`, `middleware`, `chain`, `step`)
  - Process orchestration (`saga`, `workflow`, `process`, `orchestrat*`)
  - Async flows (`then`, `await`, `promise`, `callback`, `queue`, `job`)
**And** `scrum_workflow/templates/workflows-doc.md` exists as the output template with sections: Overview, State Machines, Event Flows, Process Pipelines, Async Workflows
**And** the generated `docs/generated/workflows.md` follows the template structure
**And** each documented workflow includes: (1) workflow name/description, (2) trigger/entry point (file:line), (3) steps in sequence, (4) exit conditions/outcomes (FR68)
**And** state machines are documented with a Mermaid `stateDiagram-v2` showing all states and transitions (FR64)
**And** event flows are documented with a Mermaid `sequenceDiagram` showing participants and message flow (FR64)
**And** process pipelines are documented with a Mermaid `flowchart LR` showing the pipeline stages (FR64)

### Story 6.5: Domain Model Extraction & `domain-model.md` Generation

As a developer,
I want the agent to extract and document all domain entities, their relationships, and data structures,
So that I have a clear picture of the system's domain model with visual diagrams.

**Acceptance Criteria:**

**Given** the `/scrum-create-project-docs` command from Story 6.2 is functional
**When** the agent runs domain model analysis
**Then** the agent scans the codebase using Grep patterns to identify domain entities (FR63):
  - Model/Entity/Schema definitions (`class`, `interface`, `type`, `struct`, `model`, `schema`, `entity`)
  - Relationships (`hasMany`, `belongsTo`, `references`, `extends`, `implements`, `association`)
  - Data transfer objects (`*DTO`, `*Request`, `*Response`, `*Payload`)
  - Enums and value objects with domain meaning
  - Database schema definitions (migrations, ORM models)
**And** `scrum_workflow/templates/domain-model.md` exists as the output template with sections: Overview, Core Entities, Entity Relationships, Value Objects & Enums, Data Flow Structures
**And** the generated `docs/generated/domain-model.md` follows the template structure
**And** each documented entity includes: (1) entity name, (2) location (file:line), (3) key attributes/fields, (4) relationships to other entities (FR68)
**And** the overall domain model is visualized with a Mermaid `classDiagram` showing entities and their relationships (FR64)
**And** if database schemas are detected, an `erDiagram` is included showing table relationships (FR64)
**And** entities are grouped by bounded context / domain area based on directory structure and naming

### Story 6.6: Incremental Update Mode

As a developer,
I want to update existing documentation incrementally when my code changes,
So that my docs stay in sync without regenerating everything from scratch.

**Acceptance Criteria:**

**Given** `docs/generated/` exists with `business-logic.md`, `workflows.md`, `domain-model.md`, and `.scan-state.json` from a previous full scan
**When** the user runs `/scrum-create-project-docs --update`
**Then** the agent reads `.scan-state.json` to determine which files were previously scanned and their timestamps/hashes (FR67)
**And** the agent identifies files that have been modified since the last scan by comparing current file timestamps/hashes against the stored state (FR65)
**And** the agent re-analyzes ONLY the changed files — not the entire codebase
**And** the agent compares new findings against existing documentation content
**And** the agent presents a **diff summary** to the user before writing: "Changed business rules: +3 new, ~2 modified, -1 removed" (FR66)
**And** the user must confirm the update before any docs are modified: "Apply these changes? [y/N]"
**And** if confirmed, the agent updates the relevant sections in the affected documents while preserving unchanged sections
**And** the agent updates `.scan-state.json` with new timestamps/hashes after successful update
**And** if no changes are detected, the agent reports: "No business logic changes detected since last scan."
**And** if `.scan-state.json` does not exist, the agent falls back to full-scan mode with a warning: "No previous scan state found. Running full scan."

### Story 6.7: Scan State Management & Resume Capability

As a developer,
I want the system to track what has been documented and enable resumption of interrupted scans,
So that I never lose progress on large codebase documentation.

**Acceptance Criteria:**

**Given** the `/scrum-create-project-docs` workflow from Story 6.2 is functional
**When** a scan is executed (full or update)
**Then** `docs/generated/.scan-state.json` is created/updated with: `scan_date`, `scan_mode` (full/update), `files_scanned` (array of `{path, hash, timestamp}`), `documents_generated` (array of doc paths), `scan_duration`, `scan_status` (complete/interrupted) (FR67)
**And** the hash for each file is computed from file content to detect modifications reliably
**And** if a scan is interrupted (e.g., user cancels, context window limit reached), `scan_status` is set to `interrupted` and `last_completed_file` is recorded
**And** when a scan resumes after interruption, the agent reads `.scan-state.json` and continues from `last_completed_file` — skipping already-processed files
**And** the state file is updated incrementally during the scan — not only at the end — so progress is never lost
**And** running a `full-scan` when a previous scan exists resets the state file (after user confirmation per Story 6.2)
**And** the state file is valid JSON and human-readable for debugging
**And** the state file is included in `.gitignore` recommendations (scan state is local, not committed)

## Epic 7: Architecture Documentation Agent

After this epic, the user can run `/scrum-create-architecture-docs` to generate comprehensive architecture documentation for any existing project — covering backend, frontend, DevOps, local dev environment, and testing — with inline Mermaid diagrams, and incrementally update docs as the codebase evolves. The agent is language-agnostic and complements the business logic documentarian (Epic 6) by focusing on **structural** rather than **behavioral** aspects.

**Story Dependency Map:**
- Story 7.1 has no dependencies (agent definition)
- Story 7.2 depends on 7.1 (command + workflow skeleton)
- Stories 7.3, 7.4, 7.5, 7.6, and 7.7 depend on 7.2 and can be worked in **parallel** (five independent analysis dimensions)
- Story 7.8 depends on 7.3-7.7 (update mode needs all five doc types to exist)
- Story 7.9 depends on 7.2 (state management is used by both modes)

### Story 7.1: `architect-doc` Agent Definition

As a developer,
I want a dedicated architecture documentation agent defined in SKILL.md format,
So that the agent has a clear identity, instructions, and output format for generating architecture documentation with Mermaid diagrams.

**Acceptance Criteria:**

**Given** the `scrum_workflow/agents/` directory exists with `architect.md`, `developer.md`, `qa.md`, `documentarian.md`
**When** the architect-doc agent is created
**Then** `scrum_workflow/agents/architect-doc.md` exists in SKILL.md format with YAML frontmatter: `name: architect-doc`, `display_name: Architecture Documentarian`, `role: Architecture documentation specialist`, `active_in: [create-architecture-docs]`, `model: claude-sonnet-4`, `max_tokens: 4000`
**And** the Identity section defines the agent as an architecture analyst that reads existing codebases and generates structured architecture documentation with Mermaid diagrams — focusing on system structure, not business logic
**And** the Instructions section specifies the agent must: (1) scan codebase systematically via Glob and Grep, (2) identify backend components (API endpoints, event systems, schedulers, middleware, services), (3) identify frontend structure (components, state management, routing), (4) identify DevOps infrastructure (CI/CD, Docker, Kubernetes), (5) identify local dev environment (docker-compose, Wiremock, env files, seed data), (6) identify testing architecture (frameworks, pyramid, coverage, fixtures), (7) generate documentation with inline Mermaid diagrams, (8) include source references (file:line)
**And** the Instructions section includes concrete grep patterns for each architecture dimension (FR78):
  - Backend: `@Get`, `@Post`, `router.get`, `EventEmitter`, `@Scheduled`, `cron`, `middleware`, `interceptor`
  - Frontend: `Component`, `.tsx`, `.vue`, `store`, `reducer`, `Route`, `router`
  - DevOps: `Dockerfile`, `docker-compose`, `.github/workflows/`, `deployment.yaml`, `.tf`
  - Local Dev: `docker-compose.yml`, `wiremock`, `.env`, `seed`, `fixtures`, `factory`
  - Testing: `jest.config`, `pytest.ini`, `vitest.config`, `playwright.config`, `coverageThreshold`
**And** the Output Format section defines five document types with required sections and Mermaid diagram types (FR76)
**And** the Context Rules section specifies context loading order: `context/index.md`, domain context files, `config.yaml`, source code discovered via Glob/Grep
**And** the file follows the exact same structure as `architect.md`: frontmatter -> Identity -> Instructions -> Output Format -> Context Rules

### Story 7.2: `/scrum-create-architecture-docs` Command & Workflow Skeleton

As a developer,
I want to run `/scrum-create-architecture-docs` to trigger architecture documentation generation,
So that I have a single command that orchestrates the full architecture documentation workflow.

**Acceptance Criteria:**

**Given** the architect-doc agent from Story 7.1 exists
**When** the command and workflow are created
**Then** `scrum_workflow/commands/create-architecture-docs.md` exists in SKILL.md command format with `trigger: /create-architecture-docs`, `requires_status: null`, `sets_status: null`, `spawns_agents: [architect-doc]`
**And** `scrum_workflow/workflows/architecture-documentation.md` exists with the two-mode workflow: `full-scan` (default) and `update` (triggered by `--update` flag)
**And** the workflow defines the documentation output directory as `docs/generated/` relative to project root (same directory as Epic 6 output)
**And** the workflow loads the architect-doc agent definition and project context before starting analysis
**And** in `full-scan` mode, the workflow orchestrates: (1) project structure scan, (2) backend analysis -> `backend-architecture.md`, (3) frontend analysis -> `frontend-architecture.md`, (4) DevOps analysis -> `devops-architecture.md`, (5) local dev environment analysis -> `local-dev-environment.md`, (6) testing analysis -> `testing-architecture.md`, (7) scan state persistence -> `.arch-scan-state.json`
**And** in `update` mode, the workflow orchestrates: (1) load existing `.arch-scan-state.json`, (2) identify changed files, (3) re-analyze changed areas, (4) show diff summary to user, (5) update docs upon user confirmation
**And** the command reads `context/index.md` to determine project domain and tech stack
**And** if `docs/generated/` does not exist, the workflow creates it
**And** if architecture docs already exist and mode is `full-scan`, the workflow warns: "Existing architecture docs found. This will overwrite. Continue? [y/N]"
**And** a `.claude/skills/create-architecture-docs.md` adapter skill is created that references the framework command

### Story 7.3: Backend Architecture Analysis & `backend-architecture.md` Generation

As a developer,
I want the agent to identify and document all backend architectural components,
So that I have a comprehensive reference of APIs, events, schedulers, middleware, and service structure.

**Acceptance Criteria:**

**Given** the `/scrum-create-architecture-docs` command from Story 7.2 is functional
**When** the agent runs backend architecture analysis
**Then** the agent scans the codebase using Grep patterns to identify backend components (FR71):
  - API endpoints and route definitions (`@Get`, `@Post`, `@Put`, `@Delete`, `router.get`, `router.post`, `app.use`, `@RequestMapping`, `@Controller`)
  - Event systems (`EventEmitter`, `@EventHandler`, `emit`, `on`, `subscribe`, `publish`, `queue`, `topic`, `exchange`, `channel`)
  - Schedulers and cron jobs (`@Scheduled`, `cron`, `setInterval`, `agenda`, `bull`, `schedule`)
  - Middleware and interceptors (`middleware`, `interceptor`, `guard`, `filter`, `pipe`, `@UseGuards`, `@UseInterceptors`)
  - Service layer (`@Service`, `@Injectable`, `@Component`, `Provider`, `Repository`)
  - Database access (`@Entity`, `@Table`, `Schema`, `migration`, `sequelize`, `prisma`, `typeorm`)
**And** `scrum_workflow/templates/backend-architecture.md` exists as the output template with sections: Overview, API Endpoints (grouped by resource/domain), Event System, Scheduled Tasks, Middleware Pipeline, Service Layer, Database Access Layer
**And** the generated `docs/generated/backend-architecture.md` follows the template structure
**And** API endpoints are documented with: HTTP method, path, controller/handler file:line, request/response types if discoverable
**And** event flows are documented with a Mermaid `sequenceDiagram` showing publishers and subscribers (FR76)
**And** the middleware pipeline is documented with a Mermaid `flowchart LR` showing the request processing chain (FR76)
**And** the service layer is documented with a Mermaid `graph TD` showing service dependencies (FR76)

### Story 7.4: Frontend Architecture Analysis & `frontend-architecture.md` Generation

As a developer,
I want the agent to identify and document all frontend architectural components,
So that I have a clear picture of component hierarchy, state management, and routing structure.

**Acceptance Criteria:**

**Given** the `/scrum-create-architecture-docs` command from Story 7.2 is functional
**When** the agent runs frontend architecture analysis
**Then** the agent scans the codebase using Grep patterns to identify frontend components (FR72):
  - Component definitions (`.tsx`, `.jsx`, `.vue`, `.svelte` files, `Component`, `FC`, `defineComponent`)
  - State management (`store`, `reducer`, `action`, `selector`, `signal`, `atom`, `createStore`, `createSlice`, `Vuex`, `Pinia`, `Zustand`)
  - Routing (`Route`, `Router`, `path`, `navigate`, `Link`, `useRouter`, `createBrowserRouter`)
  - Build pipeline (`webpack.config`, `vite.config`, `next.config`, `tsconfig.json`, `babel.config`)
  - Shared utilities and hooks (`use*`, `utils/`, `helpers/`, `hooks/`, `composables/`)
**And** `scrum_workflow/templates/frontend-architecture.md` exists as the output template with sections: Overview, Component Hierarchy, State Management, Routing Structure, Build Pipeline, Shared Utilities
**And** the generated `docs/generated/frontend-architecture.md` follows the template structure
**And** the component hierarchy is documented with a Mermaid `graph TD` showing parent-child component relationships (FR76)
**And** state management is documented with a Mermaid `flowchart` showing store structure and data flow (FR76)
**And** routing is documented with a table listing all routes, their components, and guards/middleware
**And** if no frontend is detected (no `.tsx`, `.jsx`, `.vue`, `.svelte` files), the document is skipped with a note in the scan state

### Story 7.5: DevOps Architecture Analysis & `devops-architecture.md` Generation

As a developer,
I want the agent to identify and document all DevOps infrastructure and CI/CD pipelines,
So that I understand the deployment pipeline, container setup, and infrastructure configuration.

**Acceptance Criteria:**

**Given** the `/scrum-create-architecture-docs` command from Story 7.2 is functional
**When** the agent runs DevOps architecture analysis
**Then** the agent scans the codebase using Grep patterns to identify DevOps components (FR73):
  - CI/CD pipelines (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml`)
  - Container configuration (`Dockerfile`, `docker-compose.yml`, `docker-compose.yaml`, `.dockerignore`)
  - Kubernetes (`deployment.yaml`, `service.yaml`, `ingress.yaml`, `configmap.yaml`, `kustomization.yaml`, `helm/`)
  - Infrastructure as Code (`.tf` files, `Pulumi.yaml`, `cloudformation.yaml`, `cdk.json`)
  - Monitoring and observability (`prometheus.yml`, `grafana/`, `datadog.yaml`, `sentry.properties`)
**And** `scrum_workflow/templates/devops-architecture.md` exists as the output template with sections: Overview, CI/CD Pipelines, Container Configuration, Orchestration (K8s), Infrastructure as Code, Monitoring & Observability
**And** the generated `docs/generated/devops-architecture.md` follows the template structure
**And** CI/CD pipelines are documented with a Mermaid `flowchart LR` showing pipeline stages (build -> test -> deploy) (FR76)
**And** container setup is documented with a Mermaid `graph TD` showing service dependencies from docker-compose (FR76)
**And** each documented component includes file:line references for traceability
**And** if no DevOps configuration is detected, the document is skipped with a note in the scan state

### Story 7.6: Local Dev Environment Analysis & `local-dev-environment.md` Generation

As a developer,
I want the agent to document the complete local development environment setup,
So that new team members can get the project running locally within minutes.

**Acceptance Criteria:**

**Given** the `/scrum-create-architecture-docs` command from Story 7.2 is functional
**When** the agent runs local dev environment analysis
**Then** the agent scans the codebase using Grep patterns to identify local dev components (FR74):
  - Docker Compose services (`docker-compose.yml`, `docker-compose.override.yml`, `docker-compose.local.yml`)
  - Mock services (`wiremock`, `__files/`, `mappings/`, `mockserver`, `prism`, `json-server`)
  - Environment files (`.env`, `.env.local`, `.env.example`, `.env.development`, `.env.test`)
  - Seed and fixture data (`seed.*`, `fixtures/`, `factory.*`, `testdata/`, `__fixtures__/`)
  - Local tooling (`Makefile`, `justfile`, `Taskfile.yml`, `scripts/`)
  - Port mappings and service URLs (extracted from docker-compose ports, .env files)
**And** `scrum_workflow/templates/local-dev-environment.md` exists as the output template with sections: Overview, Prerequisites, Services (with ports and URLs), Mock Services, Environment Variables, Seed Data, Common Commands
**And** the generated `docs/generated/local-dev-environment.md` follows the template structure
**And** services are documented with a Mermaid `graph TD` showing local service topology with port numbers (FR76)
**And** environment variables are documented in a table: variable name, source file, description/purpose, example value
**And** common commands are listed (start, stop, reset, seed) with exact shell commands
**And** if no local dev configuration is detected (no docker-compose, no .env), the document is skipped with a note in the scan state

### Story 7.7: Testing Architecture Analysis & `testing-architecture.md` Generation

As a developer,
I want the agent to document the testing architecture, frameworks, and coverage configuration,
So that I understand how tests are organized and what testing standards the project follows.

**Acceptance Criteria:**

**Given** the `/scrum-create-architecture-docs` command from Story 7.2 is functional
**When** the agent runs testing architecture analysis
**Then** the agent scans the codebase using Grep patterns to identify testing components (FR75):
  - Test frameworks and config (`jest.config.*`, `vitest.config.*`, `pytest.ini`, `pyproject.toml [tool.pytest]`, `playwright.config.*`, `cypress.config.*`, `.mocharc.*`)
  - Test directories and patterns (`__tests__/`, `test/`, `spec/`, `tests/`, `*.test.*`, `*.spec.*`, `test_*`)
  - Coverage configuration (`coverageThreshold`, `--cov`, `coverage/`, `.nycrc`, `istanbul`)
  - E2E test setup (`playwright`, `cypress`, `selenium`, `puppeteer`, `testcontainers`)
  - Test utilities (`fixtures/`, `helpers/`, `factories/`, `mocks/`, `stubs/`, `__mocks__/`)
  - Contract tests (`pact`, `consumer`, `provider`, `contract`)
**And** `scrum_workflow/templates/testing-architecture.md` exists as the output template with sections: Overview, Test Pyramid (unit/integration/E2E split), Frameworks & Configuration, Test Directory Structure, Coverage Requirements, E2E Setup, Test Utilities & Fixtures
**And** the generated `docs/generated/testing-architecture.md` follows the template structure
**And** the test pyramid is documented with a Mermaid `graph TD` or description showing the balance of unit/integration/E2E tests (FR76)
**And** test frameworks are documented with: framework name, config file location (file:line), test directory patterns, run commands
**And** coverage thresholds are extracted and documented if configured
**And** if no test configuration is detected, the document is skipped with a note in the scan state

### Story 7.8: Incremental Update Mode

As a developer,
I want to update existing architecture documentation incrementally when my code changes,
So that my architecture docs stay in sync without regenerating everything from scratch.

**Acceptance Criteria:**

**Given** `docs/generated/` exists with architecture docs and `.arch-scan-state.json` from a previous full scan
**When** the user runs `/scrum-create-architecture-docs --update`
**Then** the agent reads `.arch-scan-state.json` to determine which files were previously scanned and their timestamps/hashes (FR79)
**And** the agent identifies files that have been modified since the last scan by comparing current file timestamps/hashes against the stored state (FR77)
**And** the agent re-analyzes ONLY the changed files — not the entire codebase
**And** the agent compares new findings against existing documentation content
**And** the agent presents a **diff summary** to the user before writing: "Changed architecture components: +2 new endpoints, ~1 modified service, -1 removed middleware"
**And** the user must confirm the update before any docs are modified: "Apply these changes? [y/N]"
**And** if confirmed, the agent updates the relevant sections in the affected documents while preserving unchanged sections
**And** the agent updates `.arch-scan-state.json` with new timestamps/hashes after successful update
**And** if no changes are detected, the agent reports: "No architecture changes detected since last scan."
**And** if `.arch-scan-state.json` does not exist, the agent falls back to full-scan mode with a warning: "No previous scan state found. Running full scan."

### Story 7.9: Architecture Scan State Management & Resume Capability

As a developer,
I want the system to track what architecture has been documented and enable resumption of interrupted scans,
So that I never lose progress on large codebase documentation.

**Acceptance Criteria:**

**Given** the `/scrum-create-architecture-docs` workflow from Story 7.2 is functional
**When** a scan is executed (full or update)
**Then** `docs/generated/.arch-scan-state.json` is created/updated with: `scan_date`, `scan_mode` (full/update), `files_scanned` (array of `{path, hash, timestamp}`), `documents_generated` (array of doc paths), `documents_skipped` (array with skip reasons), `scan_duration`, `scan_status` (complete/interrupted) (FR79)
**And** the state file is separate from Epic 6's `.scan-state.json` — the two agents manage independent state
**And** the hash for each file is computed from file content to detect modifications reliably
**And** if a scan is interrupted, `scan_status` is set to `interrupted` and `last_completed_file` is recorded
**And** when a scan resumes after interruption, the agent reads `.arch-scan-state.json` and continues from `last_completed_file`
**And** the state file is updated incrementally during the scan — not only at the end — so progress is never lost
**And** `documents_skipped` tracks which architecture dimensions were skipped due to no detected components (e.g., "frontend-architecture.md: no frontend detected")
**And** running a `full-scan` when a previous scan exists resets the state file (after user confirmation per Story 7.2)
**And** the state file is valid JSON and human-readable for debugging
**And** the state file is included in `.gitignore` recommendations (scan state is local, not committed)

## Epic 8: Installer Integration — Epic 6 & 7 Documentation Skills

After this epic, the `create-scrum-workflow` installer installs all documentation skills from Epic 6 and Epic 7 — making `/scrum-create-project-docs` and `/scrum-create-architecture-docs` available as platform-discoverable commands alongside the original four skills. This epic should be started **only after** Epic 6 and Epic 7 are both complete.

**Story Dependency Map:**
- Story 8.1 has no dependencies (template creation)
- Story 8.2 depends on 8.1 (installer needs templates first)
- Story 8.3 depends on 8.2 (tests need installer changes)
- Story 8.4 depends on 8.2 (validation needs installer changes)
- Stories 8.1 and 8.2 can be worked in **parallel** with Epic 6/7 finalization if templates are known in advance

### Story 8.1: Skill Registration Templates for Epic 6 & 7

As a developer,
I want skill registration templates for the two new documentation commands,
So that the installer can generate platform-specific skill shims for these commands.

**Acceptance Criteria:**

**Given** Epic 6 and Epic 7 command definitions are complete
**When** the skill registration templates are created
**Then** `templates/skill-registrations/scrum-create-project-docs/SKILL.md` exists with: YAML frontmatter (`name`, `display_name`, `description`, `active_in`) and body referencing `{{framework_path}}/commands/create-project-docs.md`
**And** `templates/skill-registrations/scrum-create-architecture-docs/SKILL.md` exists with the same structure, referencing `{{framework_path}}/commands/create-architecture-docs.md`
**And** each template contains a `{{framework_path}}` placeholder that will be replaced during installation
**And** both templates follow the exact same format as the existing four skill shims (create-project-context, create-ticket, refine-ticket, dev-story)
**And** the `name` field in frontmatter uses kebab-case and matches the directory name (`scrum-create-project-docs`, `scrum-create-architecture-docs`)
**And** each template includes a clear `description` field explaining what the command does

### Story 8.2: Installer Pipeline Update for New Skills

As a developer,
I want the installer to copy and register the new documentation skill shims,
So that users can invoke `/scrum-create-project-docs` and `/scrum-create-architecture-docs` after installation.

**Acceptance Criteria:**

**Given** the skill registration templates from Story 8.1 exist
**When** the install command executes the skill registration step
**Then** `src/core/skill-registrar.js` is updated to include the two new skill shims in the copy pipeline
**And** `src/core/installer.js` orchestrates the skill registration for all six skills (original 4 + 2 new)
**And** for each selected platform, the installer copies the 6 skill shim directories to `{target}/.{platform}/skills/`
**And** during copy, `{{framework_path}}` is replaced with the resolved framework path (e.g., `scrum_workflow`) for all 6 skills
**And** all 6 generated SKILL.md files have valid YAML frontmatter with `name` matching the directory name
**And** the install command prints a summary showing: "6 skills registered: [list of all 6 skills]"
**And** if a platform's `skills/` directory already contains any of the 6 skills, they are overwritten (idempotent behavior)
**And** the lock file (`.scrum-workflow-lock.json`) includes all 6 skill registration files in the `files` object with SHA-256 hashes

### Story 8.3: Integration Tests for Epic 6/7 Skills

As a developer,
I want test coverage that verifies the new documentation skills are installed correctly,
So that I have confidence the installer works for all six skills.

**Acceptance Criteria:**

**Given** the installer pipeline from Story 8.2 is updated
**When** the integration test suite runs
**Then** `create-scrum-workflow/test/integration/installer.test.js` (or equivalent test file) includes test cases for both new skills
**And** tests verify that after installation, both `scrum-create-project-docs.md` and `scrum-create-architecture-docs.md` exist in each selected platform's skills directory
**And** tests verify that the `{{framework_path}}` placeholder is correctly replaced in both new skill files
**And** tests verify that the lock file contains entries for all 6 skill registration files
**And** tests verify that the install command summary shows all 6 skills
**And** running `npm test` passes all integration tests including the new Epic 6/7 skill tests

### Story 8.4: Platform Registry Validation for New Skills

As a developer,
I want validation that all six skills work across all supported platforms,
So that users can use the documentation commands regardless of their AI coding platform.

**Acceptance Criteria:**

**Given** the installer from Story 8.2 and tests from Story 8.3 are in place
**When** platform validation is executed
**Then** a validation test or manual verification confirms that skill shims are created for all platforms in the registry: `claude-code`, `cursor`, `windsurf`, `github-copilot`, `cline`, `agents-universal`
**And** for each platform, the skill directory path matches the `target_dir` from `platform-registry.yaml`
**And** the skill format (`skill-md`) is consistent across all platforms for the 6 skills
**And** platforms with `fallback_scan` (e.g., Cursor scanning `.claude/skills/`) can discover the skills even if not installed to their primary directory
**And** a validation report documents which platforms successfully recognize which skills (e.g., "Claude Code: all 6 skills | Cursor: all 6 skills (via .claude fallback)")
**And** any platform-specific quirks or limitations are documented in the installer README

## Epic 9: Research Agent — Technical & General

After this epic, the user can run `/scrum-research technical <topic>` and `/scrum-research general <topic>` to generate comprehensive research documentation using validated agentic patterns. The agent performs web research via WebSearch, applies Plan-Then-Execute and Swarm Migration patterns for parallel processing, uses Reflection Loop for quality assurance, persists state for long-running tasks, and generates AI-optimized output with structured frontmatter. Both modes support incremental updates and are fully integrated into the npm installer.

**Story Dependency Map:**
- Story 9.1 has no dependencies (agent definition)
- Stories 9.2, 9.3, and 9.4 depend on 9.1 (can be parallelized)
- Stories 9.5, 9.6, and 9.7 depend on 9.2-9.4 (can be parallelized)
- Story 9.8 depends on 9.2 (update mode needs base workflow)
- Story 9.9 depends on 9.2-9.8 (installer integration needs both modes)
- Story 9.10 depends on 9.9 (tests need installer integration)
- Story 9.11 has no dependencies (documentation, can run parallel)

### Story 9.1: `researcher` Agent Definition

As a developer,
I want a dedicated research agent defined in SKILL.md format that can handle both technical and general research,
So that the agent has a clear identity, instructions, and output format for generating AI-optimized research documentation.

**Acceptance Criteria:**

**Given** the `scrum_workflow/agents/` directory exists with `architect.md`, `developer.md`, `qa.md`, `documentarian.md`, `architect-doc.md`
**When** the researcher agent is created
**Then** `scrum_workflow/agents/researcher.md` exists in SKILL.md format with YAML frontmatter: `name: researcher`, `display_name: Researcher`, `role: Technical research specialist`, `active_in: [research-technical, research-general]`, `model: claude-sonnet-4`, `max_tokens: 4000`
**And** the Identity section defines the agent as a research analyst that performs web research, applies agentic patterns (Plan-Then-Execute, Swarm Migration, Reflection Loop), and generates AI-optimized documentation with structured frontmatter
**And** the Instructions section specifies the agent must reference the research patterns document at `docs/research/technical-research-agent-patterns-2026-03-30.md` for implementation guidance
**And** the Instructions section specifies the agent must use WebSearch tool for online research and support both technical and general research modes
**And** the Instructions section includes the four core patterns: (1) Plan-Then-Execute for workflow structure, (2) Swarm Migration for parallel subagent research, (3) Reflection Loop for quality assurance, (4) Filesystem-Based State for checkpoint recovery
**And** the Output Format section defines two output schemas: `technical_research` (with code patterns, API references, architecture diagrams) and `general_research` (with executive summary, market analysis, strategic recommendations)
**And** the Output Format section specifies the frontmatter schema: `type`, `topic`, `date`, `sources`, `ai_optimized: true`, `version: 1.0`, `research_confidence`
**And** the Context Rules section specifies the agent loads `context/index.md` to understand project context before research
**And** the agent definition follows the exact same structure as other agents: frontmatter → Identity → Instructions → Output Format → Context Rules

### Story 9.2: `/scrum-research technical` Command & Workflow Skeleton

As a developer,
I want to run `/scrum-research technical <topic>` to trigger technical research with agentic patterns,
So that I have a single command that orchestrates the full technical research workflow.

**Acceptance Criteria:**

**Given** the researcher agent from Story 9.1 exists
**When** the command and workflow are created
**Then** `scrum_workflow/commands/research-technical.md` exists in SKILL.md command format with `trigger: /research-technical`, `requires_status: null`, `sets_status: null`, `spawns_agents: [researcher]`
**And** `scrum_workflow/workflows/research-technical.md` exists with the Plan-Then-Execute workflow: (1) Scope Confirmation, (2) Research Plan, (3) Swarm Research (parallel), (4) Verification, (5) Reflection Loop, (6) Synthesis
**And** the workflow defines the research output directory as `docs/research/` relative to project root
**And** the workflow loads the researcher agent definition and project context before starting research
**And** the workflow orchestrates: (1) topic and scope confirmation with user, (2) research plan with source identification, (3) parallel subagent research across multiple sources (Swarm Migration pattern), (4) cross-referencing and verification, (5) Reflection Loop for quality check, (6) final synthesis with structured output
**And** the command accepts optional flags: `--sources <urls...>` for specific sources, `--output <path>` for custom output location (default: `docs/research/`)
**And** the command reads `context/index.md` to determine project domain and tech stack for context-aware research
**And** if `docs/research/` does not exist, the workflow creates it
**And** the generated filename follows the pattern: `technical-research-{topic-slug}-{date}.md`
**And** a `.claude/skills/scrum-research-technical.md` adapter skill is created that references the framework command

### Story 9.3: Technical Research Output Template

As a developer,
I want a standardized output template for technical research documents,
So that all technical research outputs follow a consistent, AI-optimized format.

**Acceptance Criteria:**

**Given** the `/scrum-research technical` command from Story 9.2 exists
**When** the output template is created
**Then** `scrum_workflow/templates/technical-research.md` exists as the output template with sections matching the schema from `docs/research/technical-research-agent-patterns-2026-03-30.md`
**And** the template includes YAML frontmatter with fields: `type: technical_research`, `topic`, `date`, `sources` (array of URLs), `ai_optimized: true`, `version: 1.0`, `research_confidence`
**And** the template body includes sections: Executive Summary, Table of Contents, Research Methodology, Technical Landscape, Technology Stack Analysis, Integration Patterns, Implementation Approaches, Performance & Scalability, Security Considerations, Strategic Recommendations, Implementation Roadmap, Future Outlook, References
**And** the Executive Summary is structured for AI context extraction (2-3 paragraphs with key findings)
**And** all sections use H2/H3 headings for easy parsing
**And** bullet points are used for easy extraction
**And** source URLs are included for verification
**And** confidence levels are included for uncertain claims
**And** Mermaid diagrams are included where applicable (flowcharts for architecture, sequence diagrams for integration patterns)

### Story 9.4: Web Research Integration & Swarm Migration Pattern

As a developer,
I want the researcher agent to perform web research using WebSearch and apply the Swarm Migration pattern for parallel processing,
So that research is comprehensive and fast (10x+ speedup).

**Acceptance Criteria:**

**Given** the `/scrum-research technical` command and workflow from Story 9.2 exist
**When** the web research integration is implemented
**Then** the researcher agent uses the WebSearch tool to gather information from multiple online sources
**And** the workflow implements the Swarm Migration pattern: main researcher spawns 3-5 parallel subagents, each researching independent aspects or sources of the topic
**And** each subagent receives isolated context and research scope (e.g., one for architecture patterns, one for frameworks, one for best practices)
**And** the workflow includes a result aggregation step that synthesizes findings from all subagents (map-reduce style)
**And** the workflow tracks parallel research progress and reports progress to user
**And** if WebSearch fails or returns no results, the agent provides a clear error message and suggests alternative approaches
**And** the workflow includes source verification: cross-reference findings across multiple sources, identify conflicting information, mark uncertain claims with confidence levels
**And** the parallel research achieves approximately 10x speedup compared to sequential research (validated through testing)

### Story 9.5: Reflection Loop for Quality Assurance

As a developer,
I want the researcher agent to apply the Reflection Loop pattern for self-critique and iterative improvement,
So that research output quality is high and consistent.

**Acceptance Criteria:**

**Given** the web research integration from Story 9.4 exists
**When** the Reflection Loop is implemented
**Then** the workflow includes a reflection step after initial research synthesis
**And** the reflection step performs: content completeness check, citation validation, structure consistency, clarity assessment, gap identification
**And** the agent critiques its own output against quality criteria from the research patterns document
**And** if quality threshold is not met, the agent performs targeted improvement: research missing information, refine unclear sections, strengthen weak claims, add more sources
**And** the reflection loop runs up to 2 iterations to avoid infinite loops
**And** the final output includes a `research_confidence` field in frontmatter (high/medium/low) based on reflection results
**And** if confidence is low, the agent provides specific reasons and suggests areas for further research

### Story 9.6: Filesystem-Based State for Long-Running Research

As a developer,
I want research state persisted to filesystem for checkpoint recovery on long-running or interrupted research tasks,
So that no research progress is lost if the task is interrupted.

**Acceptance Criteria:**

**Given** the `/scrum-research technical` workflow from Story 9.2 exists
**When** filesystem-based state is implemented
**Then** the workflow creates `docs/research/.research-state.json` at the start of each research task
**And** the state file tracks: `research_id`, `topic`, `start_time`, `status` (planning/researching/reflecting/synthesizing/complete/interrupted), `completed_steps`, `findings` (intermediate results), `sources_consulted`
**And** the state file is updated incrementally during research — not only at the end
**And** if a research task is interrupted (user cancellation, context limit, error), `status` is set to `interrupted` and `last_completed_step` is recorded
**And** when `/scrum-research technical` is run again with the same topic, the agent reads `.research-state.json` and offers to resume from the last completed step
**And** the user can choose to resume or start fresh
**And** if resumed, the agent skips already-completed steps and continues from `last_completed_step`
**And** the state file is valid JSON and human-readable for debugging
**And** the state file is included in `.gitignore` recommendations (research state is local, not committed)

### Story 9.7: `/scrum-research general` Command & Workflow

As a developer,
I want to run `/scrum-research general <topic>` for broader research beyond technical topics,
So that I can research business, market, competitive, and strategic topics using the same agentic patterns.

**Acceptance Criteria:**

**Given** the researcher agent from Story 9.1 exists
**When** the general research command and workflow are created
**Then** `scrum_workflow/commands/research-general.md` exists in SKILL.md command format with `trigger: /research-general`, `requires_status: null`, `sets_status: null`, `spawns_agents: [researcher]`
**And** `scrum_workflow/workflows/research-general.md` exists with the same Plan-Then-Execute workflow structure as technical research
**And** the workflow uses the same four patterns: Plan-Then-Execute, Swarm Migration, Reflection Loop, Filesystem-Based State
**And** the output schema is `type: general_research` with sections optimized for non-technical topics: Executive Summary, Market Analysis, Competitive Landscape, Strategic Recommendations, Implementation Considerations, Risk Assessment, Future Outlook
**And** the workflow uses the same state file `docs/research/.research-state.json` (technical and general research share state management)
**And** the generated filename follows the pattern: `general-research-{topic-slug}-{date}.md`
**And** a `.claude/skills/scrum-research-general.md` adapter skill is created that references the framework command
**And** Stories 9.3-9.6 (output template, web research, reflection loop, state management) are reused for general research — no duplicate implementation needed

### Story 9.8: Incremental Update Mode for Research

As a developer,
I want to update existing research documents with new findings without regenerating from scratch,
So that my research stays current as new information becomes available.

**Acceptance Criteria:**

**Given** `docs/research/` contains existing research documents and `.research-state.json` from previous research
**When** the user runs `/scrum-research technical <existing-topic> --update` or `/scrum-research general <existing-topic> --update`
**Then** the agent reads the existing research document identified by topic
**And** the agent reads `.research-state.json` to determine when the research was last conducted
**And** the agent performs targeted web research for new information since the last research date
**And** the agent compares new findings against existing document content
**And** the agent presents a diff summary to the user before writing: "New findings: +5 sources, ~3 sections updated"
**And** the user must confirm the update before any changes are made
**And** if confirmed, the agent updates relevant sections while preserving unchanged content
**And** the agent updates the `sources` array in frontmatter with new source URLs
**And** the agent updates the `date` field in frontmatter to current date
**And** the agent updates `.research-state.json` with new timestamps and sources after successful update
**And** if no new findings are detected, the agent reports: "No new information found since last research."
**And** if the existing research document is not found, the agent falls back to full research mode with a warning

### Story 9.9: Installer Integration for Research Skills

As a developer,
I want the research skills to be automatically installed when running `create-scrum-workflow install`,
So that users don't need to manually register the research commands.

**Acceptance Criteria:**

**Given** the research agent and workflows from Stories 9.1-9.8 are complete
**When** the installer integration is implemented
**Then** `create-scrum-workflow/templates/skill-registrations/scrum-research-technical/SKILL.md` exists with: YAML frontmatter (`name: scrum-research-technical`, `display_name`, `description`, `active_in`) and body referencing `{{framework_path}}/commands/research-technical.md`
**And** `create-scrum-workflow/templates/skill-registrations/scrum-research-general/SKILL.md` exists with the same structure, referencing `{{framework_path}}/commands/research-general.md`
**And** each template contains a `{{framework_path}}` placeholder that will be replaced during installation
**And** `create-scrum-workflow/templates/scrum_workflow/` includes the research agent, commands, workflows, and output templates: `agents/researcher.md`, `commands/research-technical.md`, `commands/research-general.md`, `workflows/research-technical.md`, `workflows/research-general.md`, `templates/technical-research.md`, `templates/general-research.md`
**And** when `create-scrum-workflow install` is run, the installer automatically copies both research skill shims to `{target}/.{platform}/skills/`
**And** the lock file (`.scrum-workflow-lock.json`) includes both research skill registration files with SHA-256 hashes
**And** the install command summary shows: "8 skills registered: [list including scrum-research-technical and scrum-research-general]"
**And** the `create-scrum-workflow/package.json` `files` array includes the new research templates (no changes needed — `templates/` is already included)

### Story 9.10: Integration Tests for Research Agent

As a developer,
I want test coverage that verifies the research agent works correctly across both modes and installer integration,
So that I have confidence the research functionality is production-ready.

**Acceptance Criteria:**

**Given** the installer integration from Story 9.9 is complete
**When** the integration test suite runs
**Then** `create-scrum-workflow/test/integration/research.test.js` (or equivalent test file) includes test cases for both research modes
**And** tests verify that after installation, both `scrum-research-technical.md` and `scrum-research-general.md` exist in each selected platform's skills directory
**And** tests verify that the `{{framework_path}}` placeholder is correctly replaced in both research skill files
**And** tests verify that the lock file contains entries for both research skill registration files
**And** tests verify the research agent can be invoked via the skill shims
**And** tests verify WebSearch tool is used correctly (may mock for testing)
**And** tests verify output files are created in `docs/research/` with correct naming pattern
**And** tests verify the frontmatter schema is valid for both technical and general research
**And** tests verify state file (`docs/research/.research-state.json`) is created and updated correctly
**And** tests verify interrupted research can be resumed
**And** tests verify update mode correctly identifies and applies new findings
**And** running `npm test` passes all integration tests including the new research agent tests

### Story 9.11: Documentation & README Update

As a developer,
I want the research agent documented in the README and command reference,
So that users know how to use the new research functionality.

**Acceptance Criteria:**

**Given** the research agent from Stories 9.1-9.10 is complete and tested
**When** the documentation is updated
**Then** `README.md` command table includes two new entries:
   - `/scrum-research technical <topic>` — Generate technical research documentation using agentic patterns
   - `/scrum-research general <topic>` — Generate general research documentation for broader topics
**And** `scrum_workflow/docs/04-command-reference.md` includes detailed documentation for both research commands with examples
**And** the documentation explains the four agentic patterns used: Plan-Then-Execute, Swarm Migration, Reflection Loop, Filesystem-Based State
**And** the documentation includes examples of research output frontmatter
**And** the documentation explains the difference between technical and general research modes
**And** the documentation explains the `--update` flag for refreshing existing research
**And** the documentation references `docs/research/technical-research-agent-patterns-2026-03-30.md` for detailed pattern information
**And** the README "Completed Epics" section includes Epic 9 with description
**And** the README version is updated and last updated date is set to current date

## Epic 10: Enhanced Refinement — Doc-Discovery, Cross-Talk & Estimation

After this epic, the `/scrum-refine-ticket` command is enhanced with: (1) **Doc-Discovery Phase** where the user can provide additional project documents before refinement, (2) **Cross-Talk Discussion Rounds** where Architect, Developer, and QA agents see and comment on each other's perspectives until consensus or escalation, (3) **Estimation Phase** using Wideband Delphi / Planning Poker for collaborative story point estimation. This transforms refinement from isolated parallel perspectives into a collaborative discussion that surfaces blind spots and builds consensus.

**Research basis:** `docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md`

**Architecture patterns:**
- **Opponent Processor / Multi-Agent Debate Pattern**: Agents with uncorrelated context windows debate each other's positions to surface blind spots
- **BMAD Cross-Talk Pattern**: Spawn agents with each other's responses as context for genuine multi-perspective discussion
- **Wideband Delphi / Planning Poker**: Independent estimation followed by discussion and re-estimation
- **Filesystem-Based State Pattern**: Temp files in `sprints/SW-XXX/temp/` preserve agent analyses for recovery and audit
- **Binary Blocker Resolution**: Simple blocker/non-blocker classification instead of complex weighting matrices
- **Progressive Context Truncation**: 400→300→200 words per round to force convergence

**Story Dependency Map:**
- Story 10.1 has no dependencies (doc-discovery is additive)
- Story 10.2 depends on 10.1 (cross-talk needs doc-discovery context)
- Story 10.3 depends on 10.2 (estimation needs discussion complete)
- Story 10.4 depends on 10.1-10.3 (workflow update needs all phases)
- Story 10.5 depends on 10.4 (tests need updated workflow)
- Story 10.6 depends on 10.4 (documentation needs updated workflow)

**Key design decisions (from Party Mode refinement):**
- **Max 3 discussion rounds** (configurable) before human escalation — Round 3 is safety net if user can't decide earlier
- **Binary Blocker Classification**: Each disagreement classified as blocker (must resolve) or non-blocker (document and proceed)
- **Security Auto-Blocker**: Any security-identified issue is forced as blocker, cannot be marked non-blocker
- **Early Consensus Exit**: If all blockers resolved and only non-blockers remain, exit early without further rounds
- **Progressive Truncation**: Round 1: 400 words, Round 2: 300 words, Round 3: 200 words — forces convergence
- **Temp Files**: Stored in `sprints/SW-XXX/temp/`, auto-cleaned after synthesis (configurable)
- **Estimation variance threshold**: 2 points triggers re-estimation discussion
- **Doc-discovery is optional** — user can skip with default context

### Story 10.1: Doc-Discovery Phase for Refinement

As a developer,
I want the refinement command to explicitly ask for additional documents before starting agent analysis,
So that agents consider all relevant project context (architecture docs, API specs, standards) during refinement.

**Acceptance Criteria:**

**Given** the user runs `/scrum-refine-ticket SW-XXX`
**When** the command starts
**Then** the command first loads auto-detected context from `_scrum-output/context/` (existing behavior)
**And** the command prompts the user: "**Document Discovery** — Are there additional documents I should consider for this refinement? Examples: Architecture docs, API specs, coding standards, external references. Provide paths or URLs, or type **skip** to proceed."
**And** if the user provides paths, the command validates each path exists before proceeding
**And** if the user provides URLs, the command fetches and validates content is accessible
**And** all discovered documents are added to the agent context for all three agents (Architect, Developer, QA)
**And** discovered documents are listed in `refinement.md` under a new "## Document Discovery" section
**And** if user types "skip", the command proceeds with only auto-detected context from `_scrum-output/context/`
**And** the doc-discovery phase completes before any agents are spawned

### Story 10.2: Cross-Talk Discussion Rounds

As a developer,
I want the Architect, Developer, and QA agents to see and comment on each other's perspectives,
So that blind spots are surfaced and agents build toward consensus instead of working in isolation.

**Acceptance Criteria:**

**Given** the doc-discovery phase from Story 10.1 is complete
**When** the cross-talk phase begins
**Then** the workflow spawns all three agents in **parallel with isolated context** (Round 0: initial perspectives)
**And** each agent receives: story.md + discovered documents + their role-specific instructions ONLY
**And** each agent writes their full analysis to a **temp file** in `sprints/SW-XXX/temp/`:
  - `temp/architect-round-0.md`
  - `temp/developer-round-0.md`
  - `temp/qa-round-0.md`
**And** after Round 0 completes, the workflow spawns **Round 1 cross-talk** with **Progressive Truncation**:
  - Round 1 context budget: 400 words per agent spawn
  - Round 2 context budget: 300 words per agent spawn
  - Round 3 context budget: 200 words per agent spawn
**And** each cross-talk spawn prompt asks: "Comment on: (1) Where you AGREE, (2) Where you DISAGREE and why, (3) Blind spots they identified that you missed"
**And** after each round, the workflow performs **Binary Blocker Classification**:
  - For each disagreement, ask agent: "Does this **block** implementation? (Yes/No)"
  - **Blockers**: Must be resolved before synthesis
  - **Non-Blockers**: Document and proceed (noted concerns)
**And** **Security Issues are Auto-Blockers**: Any agent-identified security risk is forced as blocker, cannot be marked non-blocker
**And** **Early Consensus Exit**: If all blockers resolved and only non-blockers remain → proceed to synthesis without further rounds
**And** **Progress Visibility**: After each round, show: "Round N complete. X blockers, Y non-blockers remaining."
**And** if blockers remain after Round 3, **Deadlock UX** presents:
  ```
  ⚠️ REFINEMENT DEADLOCK nach 3 Runden

  Blockierende Punkte:
  1. [Agent] {Issue} - {Agent Position}

  [1] {Agent}'s Vorschlag übernehmen
  [2] Alternative eingeben
  [3] Abbrechen und Story zurück zu Draft
  ```
**And** all cross-talk rounds are documented in `refinement.md` under "## Discussion Rounds"
**And** temp files are **auto-cleaned** after synthesis (configurable via `keep_agent_temp_files: false`)
**And** the max rounds is configurable in `config.yaml` with default `refinement_max_rounds: 3`

### Story 10.3: Estimation Phase (Wideband Delphi)

As a developer,
I want each agent to provide an independent story point estimate with confidence level,
So that we get a collaborative estimation that surfaces uncertainty and drives discussion.

**Acceptance Criteria:**

**Given** the cross-talk discussion from Story 10.2 is complete (or user has resolved disagreements)
**When** the estimation phase begins
**Then** each agent provides an **independent estimate** without seeing others' estimates:
  - Story points (Fibonacci: 1, 2, 3, 5, 8, 13, 21)
  - Confidence level (high/medium/low)
  - Brief reasoning (1-2 sentences)
**And** all three estimates are **revealed simultaneously** to the user
**And** the workflow calculates variance: `max_estimate - min_estimate`
**And** if variance ≤ 2 points, the final estimate is the **median** of the three values
**And** if variance > 2 points, the workflow shows: "**Estimation variance is {variance} points.** [Agent estimates shown]. Discussing..."
**And** for high variance, agents discuss differences in a single round and provide **revised estimates**
**And** after re-estimation, final estimate is the median of revised values
**And** **Confidence Aggregation**: Final confidence is the **lowest** of the three agent confidences (conservative approach)
**And** the final estimate and confidence are written to `story.md` frontmatter: `estimation: {points: X, confidence: high|medium|low, method: wideband-delphi}`
**And** the estimation process is documented in `refinement.md` under "## Estimation"
**And** estimation table shows: Agent | Points | Confidence | Reasoning

### Story 10.4: Updated Refinement Workflow

As a developer,
I want the refinement workflow to orchestrate doc-discovery, cross-talk, and estimation in sequence,
So that the `/scrum-refine-ticket` command produces better refinement outcomes through collaborative agent discussion.

**Acceptance Criteria:**

**Given** Stories 10.1-10.3 are implemented
**When** the workflow is updated
**Then** `scrum_workflow/workflows/refinement.md` is updated with the new 6-phase structure:
  1. **Phase 1: Doc-Discovery** — Load auto-context + prompt user for additional docs
  2. **Phase 2: Initial Perspectives** — Spawn 3 agents in parallel with isolated context, write to temp files
  3. **Phase 3: Cross-Talk Rounds** — Up to 3 rounds with binary blocker classification, early exit on consensus
  4. **Phase 4: Estimation** — Wideband Delphi with variance handling
  5. **Phase 5: Synthesis** — Merge agreed perspectives into story.md, cleanup temp files
  6. **Phase 6: Readiness Check** — Validate story completeness (existing behavior)
**And** `scrum_workflow/commands/refine-ticket.md` frontmatter is updated with:
  ```yaml
  features:
    doc_discovery: true
    discussion_rounds: 3
    estimation: true
    consensus_required: true
    temp_file_cleanup: true
  ```
**And** `config.yaml` supports the following refinement configuration:
  ```yaml
  refinement:
    max_discussion_rounds: 3           # Max cross-talk rounds before escalation
    keep_agent_temp_files: false       # Auto-cleanup temp files after synthesis
    estimation_variance_threshold: 2   # Points variance triggering re-estimation
    early_exit_on_consensus: true      # Exit early if only non-blockers remain
    security_auto_blocker: true        # Force security issues as blockers
  ```
**And** temp files are stored in `sprints/SW-XXX/temp/` directory structure:
  ```
  sprints/SW-101/
  ├── temp/
  │   ├── architect-round-0.md
  │   ├── developer-round-0.md
  │   ├── qa-round-0.md
  │   └── discussion-round-N.md
  ├── refinement.md
  └── story.md
  ```
**And** `.gitignore` includes pattern: `sprints/*/temp/` (temp files are local, not committed)
**And** `refinement.md` template is updated with new sections: "## Document Discovery", "## Discussion Rounds", "## Estimation"
**And** the existing synthesis and readiness check behavior is preserved

### Story 10.5: Integration Tests for Enhanced Refinement

As a developer,
I want test coverage that verifies the enhanced refinement workflow works correctly,
So that I have confidence the new phases integrate properly.

**Acceptance Criteria:**

**Given** the updated workflow from Story 10.4 is complete
**When** the integration test suite runs
**Then** tests verify doc-discovery phase prompts user and accepts paths/URLs/skip
**And** tests verify doc-discovery phase validates paths and fetches URLs
**And** tests verify initial perspectives are spawned in parallel with isolated context
**And** tests verify each agent writes analysis to `sprints/SW-XXX/temp/{role}-round-0.md`
**And** tests verify cross-talk rounds use progressive truncation (400→300→200 words)
**And** tests verify **binary blocker classification**: each disagreement classified as blocker/non-blocker
**And** tests verify **security auto-blocker**: security issues forced as blockers regardless of agent classification
**And** tests verify **early consensus exit**: workflow exits early when only non-blockers remain
**And** tests verify **deadlock UX**: after max rounds with blockers, user sees resolution options
**And** tests verify **temp file cleanup**: temp directory removed after synthesis (when `keep_agent_temp_files: false`)
**And** tests verify **temp file preservation**: temp directory kept when `keep_agent_temp_files: true`
**And** tests verify estimation phase collects independent estimates from all agents
**And** tests verify variance threshold triggers re-estimation discussion
**And** tests verify final estimate uses median calculation
**And** tests verify `refinement.md` includes all new sections: Document Discovery, Discussion Rounds, Estimation
**And** tests verify `story.md` frontmatter includes estimation with points and confidence
**And** tests verify `.gitignore` includes `sprints/*/temp/` pattern
**And** running `npm test` passes all integration tests including the new refinement tests

### Story 10.6: Documentation & Command Reference Update

As a developer,
I want the enhanced refinement workflow documented in the command reference,
So that users understand the new phases and configuration options.

**Acceptance Criteria:**

**Given** the enhanced refinement from Stories 10.1-10.5 is complete and tested
**When** the documentation is updated
**Then** `scrum_workflow/docs/04-command-reference.md` is updated with detailed documentation for `/scrum-refine-ticket`:
  - Explains the 6-phase workflow: Doc-Discovery → Initial Perspectives → Cross-Talk → Estimation → Synthesis → Readiness Check
  - Explains doc-discovery phase and how to provide additional documents
  - Explains cross-talk rounds with **binary blocker classification** (blocker vs non-blocker)
  - Explains **security auto-blocker** behavior
  - Explains **early consensus exit** mechanism
  - Explains **deadlock UX** options after max rounds
  - Explains estimation phase (Wideband Delphi) with confidence aggregation
  - Documents all configuration options in `config.yaml`:
    ```yaml
    refinement:
      max_discussion_rounds: 3           # Max cross-talk rounds
      keep_agent_temp_files: false       # Auto-cleanup temp files
      estimation_variance_threshold: 2   # Points variance for re-estimation
      early_exit_on_consensus: true      # Exit early if only non-blockers
      security_auto_blocker: true        # Force security as blocker
    ```
**And** `scrum_workflow/docs/05-state-machine.md` is updated to show the refinement phase internal states:
  - draft → refinement (on /refine-ticket)
  - refinement internal states: doc-discovery → perspectives → cross-talk-N → estimation → synthesis → readiness-check
  - refinement → ready (on readiness PASS)
  - refinement → draft (on readiness FAIL or user abort)
**And** documentation references the research basis: `docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md`
**And** documentation explains temp file location: `sprints/SW-XXX/temp/` and `.gitignore` pattern
**And** README.md is updated to mention enhanced refinement features in the feature list
**And** the documentation includes example `refinement.md` output showing all new sections:
  - ## Document Discovery
  - ## Discussion Rounds (with Round 0, Round 1, Round 2 summaries)
  - ## Blocker Resolution (resolved vs escalated)
  - ## Estimation (with Wideband Delphi table)

## Epic 11: Agent Pattern Split — Separate Commands for Refine, Dev & Review

After this epic, the monolithic dev-story workflow is split into three focused agents following agentic patterns from [agentic-patterns.com](https://www.agentic-patterns.com/patterns). Each agent applies a single pattern for maximum focus and allows per-step model selection.

**Architecture Decision:** Split the current `dev-story` command (10 steps with planning, implementation, and review) into three separate commands:
1. **scrum-refine-story** — Validation agent using "Feature List as Immutable Contract" pattern
2. **scrum-dev-story** — Simplified implementation agent using "Inversion of Control" pattern
3. **scrum-review-story** — Review agent using "AI-Assisted Code Review / Verification" pattern

**Story Dependency Map:**
- Stories 11.1, 11.2, and 11.3 can be worked in **parallel** (no dependencies)
- All three stories should be completed together for full workflow

### Story 11.1: scrum-refine-story — Validation Agent (Feature List as Immutable Contract)

As a developer,
I want a dedicated validation agent that checks story completeness before implementation,
So that only truly ready stories enter development and I can choose a different model for validation.

**Agentic Pattern:** [Feature List as Immutable Contract](https://www.agentic-patterns.com/patterns/feature-list-as-immutable-contract)
- Agent validates story against an immutable checklist
- Agent MAY only set `passes: false → true` — cannot modify requirements
- Prevents premature "ready" declaration

**Acceptance Criteria:**

**Given** a story file exists with `status: refined`
**When** the user runs `/scrum-refine-story SW-103`
**Then** `scrum_workflow/commands/refine-story.md` exists in SKILL.md command format with `trigger: /refine-story`, `requires_status: refined`, `sets_status: ready-for-dev`
**And** `scrum_workflow/workflows/refine-story.md` exists with validation workflow
**And** the agent validates the story against an immutable checklist:
  - All acceptance criteria are testable and unambiguous
  - All tasks/subtasks are clearly defined
  - Dev Notes section contains necessary context
  - No placeholders or TODO markers in story content
  - Dependencies are identified and documented
**And** the agent produces a validation report with `passes: true/false` for each criterion
**And** the agent **MAY NOT** modify story content — only set validation flags
**And** if ALL criteria pass: `story.md` status is updated to `ready-for-dev`
**And** if ANY criterion fails: `story.md` status remains `refined` with failure reasons documented
**And** the validation report is appended to `sprints/SW-103/refinement.md`
**And** the workflow is lean: Load → Validate → Set Status (no planning, no implementation)

### Story 11.2: scrum-dev-story — Simplified Implementation Agent (Inversion of Control)

As a developer,
I want a focused implementation agent that only executes code without self-review or planning overhead,
So that the agent can be more efficient and I can choose a different model for implementation.

**Agentic Pattern:** [Inversion of Control](https://www.agentic-patterns.com/patterns/inversion-of-control)
- Human sets policy (the story spec)
- Agent owns execution strategy within guardrails
- No micromanagement — clear objective, autonomous execution

**Acceptance Criteria:**

**Given** a story file exists with `status: ready-for-dev`
**When** the user runs `/scrum-dev-story SW-103`
**Then** `scrum_workflow/commands/dev-story.md` is updated with simplified workflow: `trigger: /dev-story`, `requires_status: ready-for-dev`, `sets_status: review`
**And** `scrum_workflow/workflows/development.md` is simplified to 4 steps:
  1. **Load Story** — Read `story.md` with `status: ready-for-dev`
  2. **Implement** — Write code following TDD (Red-Green-Refactor)
  3. **Validate** — Run tests, confirm all pass
  4. **Set Status** — Update to `review`
**And** the agent implements ONLY what is specified in the story file (guardrails)
**And** the agent owns execution strategy — no prescribed step-by-step from workflow
**And** the agent does NOT perform self-review (removed from workflow)
**And** the agent does NOT create review reports (handled by separate agent)
**And** the agent writes ONLY code files and `story.md` status field
**And** if tests fail: agent fixes and retries (up to 3 attempts, then HALT)
**And** the previous 10-step workflow is archived in `scrum_workflow/workflows/archive/development-v1.md`

### Story 11.3: scrum-review-story — Review Agent (AI-Assisted Code Review)

As a developer,
I want a dedicated review agent that evaluates implemented code against the story specification,
So that I get unbiased review from a different perspective and can choose a different model for review.

**Agentic Pattern:** [AI-Assisted Code Review / Verification](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification)
- Separate agent for critique (not the implementer)
- Multi-agent approach: one generates, another verifies
- Focus on alignment with specification and quality

**Acceptance Criteria:**

**Given** a story file exists with `status: review`
**When** the user runs `/scrum-review-story SW-103`
**Then** `scrum_workflow/commands/review-story.md` exists in SKILL.md command format with `trigger: /review-story`, `requires_status: review`, `sets_status: approved|changes-needed`
**And** `scrum_workflow/workflows/review-story.md` exists with review workflow
**And** the agent reads implemented code changes in context of `story.md` and acceptance criteria
**And** the agent evaluates:
  - Code matches story specification (no extra features, no missing features)
  - All acceptance criteria are satisfied
  - Test coverage is adequate for the changes
  - Code follows project standards from `context/standards.md`
**And** the agent produces a review report in `sprints/SW-103/review-N.md`:
  - Summary table (Total findings, by severity)
  - Findings table (ID, Description, Severity, AC Reference, File:Line, Suggested Fix)
  - Verdict: APPROVED or CHANGES-NEEDED
**And** if verdict is APPROVED: `story.md` status is updated to `approved`
**And** if verdict is CHANGES-NEEDED: `story.md` status is updated to `changes-needed`
**And** the agent writes ONLY `review-N.md` and `story.md` status field
**And** the review agent should ideally use a different model than the implementation agent (documented in SKILL.md frontmatter recommendation)

### Story 11.4: State Machine Update & Documentation

As a developer,
I want the state machine and documentation updated to reflect the new three-agent workflow,
So that users understand the new flow and commands work correctly.

**Acceptance Criteria:**

**Given** Stories 11.1, 11.2, and 11.3 are complete
**When** the documentation is updated
**Then** `scrum_workflow/docs/05-state-machine.md` is updated with new status transitions:
  ```
  draft → refinement → refined → ready-for-dev → in-progress → review → approved/changes-needed
                    ↑              ↑               ↑            ↑
              /refine-ticket  /refine-story   /dev-story  /review-story
  ```
**And** `scrum_workflow/docs/04-command-reference.md` is updated with entries for:
  - `/scrum-refine-story` — Validation command
  - `/scrum-dev-story` — Simplified implementation command
  - `/scrum-review-story` — Review command
**And** each command documentation includes:
  - Pattern reference from agentic-patterns.com
  - Status requirements and transitions
  - Recommended model selection
**And** `sprint-status.yaml` status definitions are updated with new statuses:
  - `refined` — Story refinement complete, awaiting validation
  - `ready-for-dev` — Story validated and ready for implementation
  - `changes-needed` — Review found issues requiring fixes
**And** README.md is updated to explain the three-agent pattern split workflow

## Epic 12: Status-basierte Ordnerstruktur für scrum-output

### Overview

**Problem:** Die aktuelle Output-Struktur ist unübersichtlich. Entwickler sehen nicht auf einen Blick, welche Stories in welchem Status sind und wo die zugehörigen ACs liegen.

**Lösung:** Status-basierte Ordnerstruktur mit Story-Bundles und Sprint-Board Übersicht.

**Output-Ordner:** `scrum-output/` (NICHT `_bmad-output/`)

### Zielstruktur

```
scrum-output/
├── sprint-board.md              # Visuelle Übersicht aller Stories
├── sprint-status.yaml           # Machine-readable Status
│
├── backlog/                     # 📥 Neu, nicht priorisiert
│   └── {story-id}/
│       ├── story.md
│       ├── ac.md
│       └── tests/
│
├── ready/                       # 📋 Priorisiert, bereit für Dev
│   └── {story-id}/
│
├── in-progress/                 # 🔄 Aktiv in Entwicklung
│   └── {story-id}/
│
├── review/                      # 👀 Wartet auf Review/Approval
│   └── {story-id}/
│
└── done/                        # ✅ Abgeschlossen
    └── {story-id}/
```

### Stories

| Story | Titel | SP | Priorität |
|-------|-------|-----|-----------|
| 12-1 | Ordnerstruktur definieren | 1 | High |
| 12-2 | Sprint Board & Status-File | 2 | High |
| 12-3 | Command-Integration (create, refine, dev) | 3 | High |
| 12-4 | Workflow-Integration (review, approval) | 2 | High |

**Gesamt: 8 Story Points**

---

### Story 12.1: Ordnerstruktur definieren

As a developer,
I want a clear folder structure with status-based directories,
So that I can easily see which stories are in which status.

**Acceptance Criteria:**

**Given** the scrum-output folder exists
**When** the folder structure is created
**Then** the following directories exist:
- `scrum-output/backlog/`
- `scrum-output/ready/`
- `scrum-output/in-progress/`
- `scrum-output/review/`
- `scrum-output/done/`
**And** each status directory contains story bundles with:
- `story.md` — Story specification
- `ac.md` — Acceptance criteria
- `tests/` — Test artifacts
**And** the structure is documented in `scrum_workflow/docs/07-output-structure.md`

---

### Story 12.2: Sprint Board & Status-File

As a developer,
I want a sprint board overview and machine-readable status file,
So that I can quickly see all stories and their status at a glance.

**Acceptance Criteria:**

**Given** the folder structure from Story 12.1 exists
**When** the sprint board is generated
**Then** `scrum-output/sprint-board.md` exists with:
- Table of all stories grouped by status
- Links to each story folder
- Count per status column
**And** `scrum-output/sprint-status.yaml` exists with:
- Story ID, title, status, path for each story
- Last updated timestamp
**And** `/scrum-status` command displays the sprint board
**And** the sprint board is auto-updated when stories change status

---

### Story 12.3: Command-Integration (create, refine, dev)

As a developer,
I want commands to create and move stories between status folders,
So that the workflow is automated and consistent.

**Acceptance Criteria:**

**Given** the folder structure from Story 12.1 exists
**When** `/scrum-create-ticket` is executed
**Then** the story bundle is created in `scrum-output/backlog/{story-id}/`
**And** `sprint-status.yaml` is updated with status `backlog`
**And** `sprint-board.md` is regenerated

**When** `/scrum-refine-ticket` completes successfully
**Then** the story bundle is moved to `scrum-output/ready/{story-id}/`
**And** `sprint-status.yaml` is updated with status `ready`
**And** `sprint-board.md` is regenerated

**When** `/scrum-dev-story` starts
**Then** the story bundle is moved to `scrum-output/in-progress/{story-id}/`
**And** `sprint-status.yaml` is updated with status `in-progress`
**And** `sprint-board.md` is regenerated

---

### Story 12.4: Workflow-Integration (review, approval)

As a developer,
I want the review and approval workflows to update story status and location,
So that the sprint board always reflects the current state.

**Acceptance Criteria:**

**Given** a story is in `in-progress/` with completed implementation
**When** the review workflow starts
**Then** the story bundle is moved to `scrum-output/review/{story-id}/`
**And** `sprint-status.yaml` is updated with status `review`
**And** `sprint-board.md` is regenerated

**When** the approval workflow completes with APPROVED
**Then** the story bundle is moved to `scrum-output/done/{story-id}/`
**And** `sprint-status.yaml` is updated with status `done`
**And** `sprint-board.md` is regenerated

**When** the review workflow returns CHANGES-NEEDED
**Then** the story bundle is moved back to `scrum-output/in-progress/{story-id}/`
**And** `sprint-status.yaml` is updated with status `in-progress`
**And** `sprint-board.md` is regenerated
