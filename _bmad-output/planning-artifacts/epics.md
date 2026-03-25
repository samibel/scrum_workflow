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
- **Phase 0: `/create-project-context` command** — Architecture adds a new Phase 0 not in PRD: codebase analysis + context/skills generation before any ticket work. Two-phase approach (Analysis via shell commands → Generation via templates)
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
- **Two types of skills:** Workflow Skills (framework, generic) vs. Domain Skills (project-specific, generated by `/create-project-context`)
- **6 consistency rule categories:** Naming patterns (kebab-case files, snake_case YAML), SKILL.md structure patterns, agent output format (table-based), Markdown/YAML conventions, error & recovery patterns (status-based recovery), write boundary rules (each phase owns its artifacts)
- **Implementation sequence from Architecture:** (1) Framework templates → (2) /create-project-context → (3) Story schema + state machine → (4) /create-ticket → (5) Agent definitions → (6) /refine-ticket → (7) Readiness check → (8) /dev-story → (9) Approval gate → (10) Platform adapters
- **Agentic patterns validated by research:** All 10 patterns from agentic-patterns.com verified and architecturally sound. Key finding: 3-agent MVP and 3-iteration review cap are empirically optimal
- **Token cost optimization:** Model routing (Opus for coordination, Sonnet for sub-agents) reduces token costs 40-60%
- **Sprint folder IS the observability layer** — every phase produces a persistent, inspectable file. No additional tracing infrastructure needed for MVP

### UX Design Requirements

No UX Design document exists for this project. UX Design requirements are not applicable.

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

## Epic List

### Epic 1: Framework Setup & Project Onboarding
After this epic, the user can install the framework, configure it for their platform, and run `/create-project-context` to analyze their codebase — so agents understand the project before any ticket work begins.
**FRs covered:** FR36, FR37, FR38, FR39, FR40, FR41
**Architecture requirements:** Phase 0 `/create-project-context`, SDK/Framework Pattern, Three-Layer Separation, SKILL.md format, Adapter Contract, Framework Distribution, config.yaml, Context Templates

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

## Epic 1: Framework Setup & Project Onboarding

After this epic, the user can install the framework, configure it for their platform, and run `/create-project-context` to analyze their codebase — so agents understand the project before any ticket work begins.

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

### Story 1.5: `/create-project-context` Command & Workflow

As a developer,
I want to run `/create-project-context` to automatically analyze my codebase,
So that agents understand my project's tech stack, architecture, and conventions before any ticket work begins.

**Acceptance Criteria:**

**Given** the framework is installed with templates from Story 1.4
**When** the user runs `/create-project-context` in a project
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

### Story 2.2: `/create-ticket` Command & Workflow

As a developer,
I want to run `/create-ticket SW-103 "User authentication with OAuth2 support"` and get a structured story file,
So that I can turn a natural language idea into a formal specification without prompt engineering.

**Acceptance Criteria:**

**Given** the framework is installed and project context exists from `/create-project-context`
**When** the user runs `/create-ticket SW-103 "User authentication with OAuth2 support"`
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

**Given** the `/create-ticket` command from Story 2.2 is functional
**When** the user runs `/create-ticket SW-104 "dark mode"`
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
**And** if a required file is missing, the system returns: "File `sprints/SW-101/story.md` not found. Run `/create-ticket SW-101` first"
**And** if `context/index.md` does not exist, the system returns: "Project context not found. Run `/create-project-context` first"
**And** if a command is run on the wrong status, the system returns: "Story SW-101 is in status `draft`, but `/dev-story` requires `ready`"
**And** after an interruption, the system reads the `status` field from frontmatter and resumes from the correct phase (FR34)
**And** no manual "resume" command is needed — the status value IS the recovery point (NFR2)
**And** all workflow state is persisted to filesystem — no in-memory-only state (NFR3)

## Epic 3: Multi-Agent Story Refinement

After this epic, the user can refine tickets through parallel Architect/Dev/QA perspectives, accept or reject each perspective individually, and receive an updated story file with refined description, acceptance criteria, estimation, and subtasks.

### Story 3.1: `/refine-ticket` Command & Agent Spawning

As a developer,
I want to run `/refine-ticket SW-103` and have three agent perspectives analyze my story in parallel,
So that I get diverse expert feedback on risks, feasibility, and testability before implementation.

**Acceptance Criteria:**

**Given** a story file `sprints/SW-103/story.md` exists with `status: draft`
**When** the user runs `/refine-ticket SW-103`
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

**Given** three agents have been spawned for `/refine-ticket SW-103`
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

**Given** agent perspectives have been displayed for `/refine-ticket SW-103`
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

After this epic, the user can complete the full workflow cycle: implementation follows the plan, code review evaluates against acceptance criteria, and human approval marks the story as DONE. This completes the end-to-end MVP workflow from `/create-project-context` through to `approval.md`.

### Story 4.1: `/dev-story` Command & Implementation Workflow

As a developer,
I want to run `/dev-story SW-103` to implement code based on the approved plan,
So that the agent follows my specification exactly instead of improvising.

**Acceptance Criteria:**

**Given** a story `sprints/SW-103/story.md` with `status: ready` and `plan.md` exists
**When** the user runs `/dev-story SW-103`
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
**When** the user runs `/dev-story SW-103 review`
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
**And** if user does not approve: story remains in `in-review` status — user can manually fix issues and re-trigger `/dev-story SW-103 review` to generate a new `review-N.md`
**And** the approval workflow writes ONLY `approval.md` and `story.md` status — no other sprint files (Write Boundary Rules)
**And** the complete ticket folder now contains the full audit trail: `story.md`, `refinement.md`, `plan.md`, `review-N.md`, `approval.md` — completing the end-to-end MVP workflow
