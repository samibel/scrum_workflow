# Story 3.1: /refine-ticket Command & Agent Spawning

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to run `/refine-ticket SW-103` and have three agent perspectives analyze my story in parallel,
So that I get diverse expert feedback on risks, feasibility, and testability before implementation.

## Acceptance Criteria

1. **Given** a story file `sprints/SW-103/story.md` exists with `status: draft`
   **When** the user runs `/refine-ticket SW-103`
   **Then** `scrum_workflow/commands/refine-ticket.md` exists in SKILL.md command format with `trigger: /refine-ticket`, `requires_status: draft`, `sets_status: refinement`, `spawns_agents: [architect, developer, qa]`

2. **And** `scrum_workflow/workflows/refinement.md` exists with step-by-step refinement orchestration

3. **And** the command updates `story.md` status from `draft` to `refinement` (FR32)

4. **And** three sub-agents are spawned with isolated context per the Sub-Agent Spawning pattern (FR7)

5. **And** the Architect agent receives: `story.md` + `context/index.md` + `context/architecture.md` + relevant domain context + `scrum_workflow/agents/architect.md`

6. **And** the Developer agent receives: `story.md` + `context/index.md` + relevant domain context + `scrum_workflow/agents/developer.md`

7. **And** the QA agent receives: `story.md` + `context/index.md` + `context/testing.md` + relevant domain context + `scrum_workflow/agents/qa.md`

8. **And** the orchestrator (command file) reads `context/index.md` to determine which domain the ticket belongs to

## Tasks / Subtasks

- [x] Task 1: Create `/refine-ticket` command definition in SKILL.md command format (AC: 1, 3)
  - [x] 1.1: Create `scrum_workflow/commands/refine-ticket.md` with YAML frontmatter: `name: refine-ticket`, `trigger: "/refine-ticket"`, `requires_status: draft`, `sets_status: refinement`, `spawns_agents: [architect, developer, qa]` -- fields in this exact order per Architecture Pattern 2
  - [x] 1.2: Add Markdown body sections in exact order: Purpose, Workflow Reference, Input, Output -- per command SKILL.md template
  - [x] 1.3: Purpose section: describe multi-agent refinement with parallel Architect, Developer, QA perspectives
  - [x] 1.4: Workflow Reference: `workflows/refinement.md`
  - [x] 1.5: Input section: document expected input format -- ticket number (SW-XXX) with existing story.md file
  - [x] 1.6: Output section: document that the command updates `story.md` status to `refinement` and orchestrates three agent perspectives

- [x] Task 2: Create refinement workflow definition with agent spawning orchestration (AC: 2, 4, 5, 6, 7, 8)
  - [x] 2.1: Create `scrum_workflow/workflows/refinement.md` with step-by-step workflow
  - [x] 2.2: Step 1 -- Input validation: extract ticket number from user input, validate ticket format matches `SW-XXX`; check if `sprints/SW-XXX/story.md` exists; if not, return actionable error: `"File 'sprints/SW-XXX/story.md' not found. Run '/create-ticket SW-XXX' first"` (per Architecture Pattern 5)
  - [x] 2.3: Step 2 -- Story status validation: read `story.md` frontmatter, verify `status` is `draft`; if status is not `draft`, return actionable error: `"Story SW-XXX is in status 'current-status', but '/refine-ticket' requires 'draft'"` (per Architecture Pattern 5)
  - [x] 2.4: Step 3 -- Update status: update `story.md` frontmatter to set `status: refinement` and `updated: <today>` (FR32)
  - [x] 2.5: Step 4 -- Context loading: check if `context/index.md` exists; if not, return actionable error: `"Project context not found. Run '/create-project-context' first"`; if exists, read `context/index.md` to determine which domain the ticket belongs to (e.g., backend, frontend, testing, devops, architecture)
  - [x] 2.6: Step 5 -- Spawn Architect agent: create isolated agent context with inputs: (1) `sprints/SW-XXX/story.md`, (2) `context/index.md`, (3) `context/architecture.md`, (4) relevant domain context file(s) based on ticket domain (e.g., `context/backend.md` for backend tickets), (5) `scrum_workflow/agents/architect.md` as the role definition; invoke Architect agent with these inputs; collect perspective output
  - [x] 2.7: Step 6 -- Spawn Developer agent: create isolated agent context with inputs: (1) `sprints/SW-XXX/story.md`, (2) `context/index.md`, (3) relevant domain context file(s) based on ticket domain (e.g., `context/backend.md` for backend tickets), (4) project domain skill file: `skills/{domain}/SKILL.md` (e.g., `skills/backend/SKILL.md`), (5) `scrum_workflow/agents/developer.md` as the role definition; invoke Developer agent with these inputs; collect perspective output
  - [x] 2.8: Step 7 -- Spawn QA agent: create isolated agent context with inputs: (1) `sprints/SW-XXX/story.md`, (2) `context/index.md`, (3) `context/testing.md`, (4) relevant domain context file(s) based on ticket domain, (5) `skills/testing/SKILL.md` project domain skill, (6) `scrum_workflow/agents/qa.md` as the role definition; invoke QA agent with these inputs; collect perspective output
  - [x] 2.9: Step 8 -- Display perspectives: present all three agent perspectives (Architect, Developer, QA) to the user in sequential sections, each clearly labeled and attributed to its role (FR8); each perspective follows the standard table-based output format defined in Architecture Pattern 3
  - [x] 2.10: Step 9 -- Await user feedback: prompt user to accept or reject each perspective individually (FR13); wait for user responses

- [x] Task 3: Validate command and workflow against consistency rules (AC: 1-8)
  - [x] 3.1: Verify `refine-ticket.md` frontmatter field order matches Architecture Pattern 2: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`
  - [x] 3.2: Verify `refine-ticket.md` body section order: Purpose, Workflow Reference, Input, Output
  - [x] 3.3: Verify `refinement.md` uses `##` for major workflow steps, `###` for substeps
  - [x] 3.4: Verify all YAML fields use snake_case, all file references use kebab-case
  - [x] 3.5: Verify agent spawning uses correct paths: `scrum_workflow/agents/architect.md`, `scrum_workflow/agents/developer.md`, `scrum_workflow/agents/qa.md`
  - [x] 3.6: Verify context file references use correct paths: `context/index.md`, `context/architecture.md`, `context/testing.md`, `context/{domain}.md`
  - [x] 3.7: Verify domain skill references use correct paths: `skills/{domain}/SKILL.md`
  - [x] 3.8: Verify workflow Step 2.2 checks story file existence before processing
  - [x] 3.9: Verify workflow Step 2.3 validates `status: draft` guard condition before proceeding
  - [x] 3.10: Verify workflow Step 2.4 updates `story.md` status to `refinement` and sets `updated` date
  - [x] 3.11: Verify no files outside of `scrum_workflow/commands/refine-ticket.md` and `scrum_workflow/workflows/refinement.md` are created or modified (story status update happens at runtime, not during this story)
  - [x] 3.12: Verify Sub-Agent Spawning pattern: each agent receives isolated context with only relevant files, no conversation history between agents

## Dev Notes

This story creates the `/refine-ticket` command -- the multi-agent refinement phase that brings Architect, Developer, and QA perspectives to bear on a story before implementation. This is the implementation of the "team, not tool" philosophy: three distinct expert roles analyze the story in parallel, each from their specialized viewpoint. The command orchestrates agent spawning with isolated contexts per the Sub-Agent Spawning pattern, ensuring each agent operates without contamination from other agents' perspectives.

**Critical constraint:** This story creates exactly 2 new files within the existing framework. It does NOT create sprint folder artifacts, agent perspectives, or any runtime state. The command and workflow are declarative definitions that will be interpreted by the AI coding platform at runtime. The actual agent spawning happens when the AI platform executes the command.

**Architecture context:** This story implements Architecture Decision 4 (Command-as-Orchestrator) and Architecture Decision 5 (Sub-Agent Spawning pattern). The command file defines WHAT happens (spawn three agents, orchestrate refinement), while the workflow file defines HOW (step-by-step agent spawning with isolated contexts, perspective collection, user feedback). The refinement workflow is the coordination layer that synthesizes multi-agent output before passing to the readiness check (Story 3.5).

### Architecture Context

**Architecture Decision 4 (Agent Orchestration Model)** governs the structure:

- **Command file** (`commands/refine-ticket.md`) = WHAT: entry point, defines trigger (`/refine-ticket`), guard condition (`requires_status: draft`), status transition (`sets_status: refinement`), and agent spawning specification (`spawns_agents: [architect, developer, qa]`)
- **Workflow file** (`workflows/refinement.md`) = HOW: step-by-step execution detail for the refinement phase, including agent spawning with isolated contexts, perspective collection, and user feedback handling

**Architecture Decision 5 (Inter-Phase Handoff Protocol):**

- `/refine-ticket` reads `story.md` from `/create-ticket` phase and produces `refinement.md` for the readiness check phase
- The refinement file IS the handoff artifact -- it must capture all three agent perspectives in a structured, parseable format
- The workflow updates `story.md` status from `draft` to `refinement` to enforce the state machine transition

**Sub-Agent Spawning Pattern (validated by agentic-patterns.com):**

Each agent is spawned with an isolated context containing only the files relevant to its role:

| Agent | Input Context | Purpose |
|---|---|---|
| Architect | `story.md` + `context/index.md` + `context/architecture.md` + domain context + `agents/architect.md` | Identify architectural risks, affected design decisions, dependencies (FR9) |
| Developer | `story.md` + `context/index.md` + domain context + `skills/{domain}/SKILL.md` + `agents/developer.md` | Identify technical dependencies, implementation concerns, feasibility issues (FR10) |
| QA | `story.md` + `context/index.md` + `context/testing.md` + domain context + `skills/testing/SKILL.md` + `agents/qa.md` | Propose testable acceptance criteria, identify edge cases (FR11) |

**Key isolation principles:**
- Each agent receives ONLY its role definition (`agents/{role}.md`), not other agents' roles
- Each agent receives ONLY its relevant context files (no cross-contamination)
- Each agent produces output independently, without seeing other agents' perspectives
- The orchestrator (workflow) collects all perspectives and presents them sequentially

**Agent Loading Model (Architecture: Agent = Role + Skill + Context):**

Each agent's runtime behavior is composed of three layers:

```
Agent = Role (agents/*.md) + Domain Skill (project skills/) + Context (project context/)
```

| Agent | Role File | Domain Skill | Context Files |
|---|---|---|---|
| Architect | `agents/architect.md` | `skills/project-architect/SKILL.md` | `context/architecture.md` + relevant domains |
| Developer | `agents/developer.md` | `skills/{ticket-domain}/SKILL.md` | `context/{ticket-domain}.md` |
| QA | `agents/qa.md` | `skills/testing/SKILL.md` | `context/testing.md` + relevant domain |

The orchestrator (workflow) reads `context/index.md` to determine which domain the ticket belongs to, then loads the appropriate skill and context files per agent.

**Key Functional Requirements:**

| FR | Requirement | Implementation |
|---|---|---|
| FR6 | User triggers refinement for a ticket | Command input format: `/refine-ticket SW-XXX` |
| FR7 | System spawns multiple agent perspectives (Architect, Dev, QA) | Workflow Steps 5-7 spawn three agents with isolated contexts |
| FR8 | Each agent perspective displayed separately and attributed | Workflow Step 8 presents perspectives in sequential labeled sections |
| FR9 | Architect identifies risks, decisions, dependencies | Architect agent receives architecture context + role definition |
| FR10 | Dev identifies technical dependencies and feasibility | Developer agent receives domain skill + context + role definition |
| FR11 | QA proposes acceptance criteria and edge cases | QA agent receives testing context + skill + role definition |
| FR12 | Coordination mechanism merges accepted perspectives | Implemented in Story 3.3 (synthesis) -- this story only handles spawning and display |
| FR32 | Story status tracked and updated at phase transitions | Workflow Step 4 updates `status` from `draft` to `refinement` |

**NFR Compliance:**

| NFR | Requirement | Implementation |
|---|---|---|
| NFR1 | Atomic file writes | Story status update is a single frontmatter modification |
| NFR4 | Adding new agent requires only new Markdown file | Agent roster in `spawns_agents` array; new agent file in `agents/` |
| NFR8 | Standard Markdown readable without tool | Agent perspectives and refinement output are plain Markdown |
| NFR9 | No runtime dependencies | Command and workflow are pure Markdown files interpreted by AI platform |
| NFR11 | Each agent output within single context window | Isolated agent contexts keep token budget low per agent |

### Existing File State

**Files to CREATE (do not exist yet):**

1. `scrum_workflow/commands/refine-ticket.md` -- New command definition. Must follow SKILL.md command format established by `create-ticket.md` (reference implementation from Story 2.2) and `create-project-context.md` (from Story 1.5).

2. `scrum_workflow/workflows/refinement.md` -- New workflow definition. Must follow the workflow format established by `ticket-creation.md` (from Story 2.2) and `project-context.md` (from Story 1.5).

**Files to READ (reference, do not modify):**

- `scrum_workflow/commands/create-ticket.md` -- Reference for SKILL.md command format (frontmatter fields + body section order)
- `scrum_workflow/workflows/ticket-creation.md` -- Reference for workflow file structure and step formatting
- `scrum_workflow/agents/architect.md` -- Architect agent role definition (created in Epic 1)
- `scrum_workflow/agents/developer.md` -- Developer agent role definition (created in Epic 1)
- `scrum_workflow/agents/qa.md` -- QA agent role definition (created in Epic 1)
- `scrum_workflow/context/standards.md` -- Standards including state machine, write boundary rules
- `scrum_workflow/templates/refinement.md` -- Refinement output template (created in Story 1.4)

**Files to NOT modify:**

- `scrum_workflow/config.yaml` -- no changes needed
- `scrum_workflow/context/standards.md` -- no changes needed (state machine and write boundaries already documented)
- `scrum_workflow/agents/architect.md` -- no changes needed (agent role definitions are complete from Epic 1)
- `scrum_workflow/agents/developer.md` -- no changes needed
- `scrum_workflow/agents/qa.md` -- no changes needed
- Any other existing command, workflow, skill, or template files

### Project Structure Notes

- All work is within the `scrum_workflow/` framework directory
- The command file goes in `scrum_workflow/commands/refine-ticket.md` (following kebab-case naming)
- The workflow file goes in `scrum_workflow/workflows/refinement.md` (following kebab-case naming)
- Sprint folders (`sprints/SW-XXX/`) do NOT exist yet and are NOT created by this story -- they will be created at runtime when the command is executed by the AI platform
- The `commands/` directory already contains `create-project-context.md` and `create-ticket.md` as reference implementations
- The `workflows/` directory already contains `project-context.md` and `ticket-creation.md` as reference implementations
- The `agents/` directory already contains `architect.md`, `developer.md`, and `qa.md` (created in Epic 1, Story 1.2)

### Previous Story Intelligence

**From Story 2.2 (/create-ticket Command & Workflow) -- MOST RELEVANT:**

- Created `scrum_workflow/commands/create-ticket.md` and `scrum_workflow/workflows/ticket-creation.md`
- Established SKILL.md command format: frontmatter (name, trigger, requires_status, sets_status, spawns_agents) + body (Purpose, Workflow Reference, Input, Output)
- Established workflow file format: step-by-step with `##` for major steps, `###` for substeps
- **Review finding applied:** Path prefix inconsistency fixed -- all framework-internal path references now use `scrum_workflow/` prefix
- Key pattern: All file paths in workflow steps are relative to `scrum_workflow/` framework root with `scrum_workflow/` prefix
- Error messages follow actionable pattern from Architecture Pattern 5
- `/create-ticket` sets status to `draft` -- `/refine-ticket` requires `draft` as guard condition

**From Story 2.3 (Guided Mode for Vague Input) -- AGENT SPAWNING PRECEDENT:**

- Demonstrated skill invocation pattern: workflow calls `scrum_workflow/skills/guided-mode/SKILL.md` for vagueness detection
- This story extends the pattern to agent spawning: workflow spawns three agents (Architect, Developer, QA) with isolated contexts
- Key insight: Skills are capabilities (vagueness detection), agents are roles with perspectives (architectural risks)
- Both skills and agents follow SKILL.md format, but agents have `role` field defining their perspective

**From Story 2.1 (Story File Schema & Sprint Folder Conventions):**

- Documented state machine in `standards.md` -- `/refine-ticket` requires `status: draft` and sets `status: refinement`
- Documented write boundary rules: `/refine-ticket` may only write `refinement.md` and update `story.md` status, not `plan.md`, `review-*.md`, or `approval.md`
- Documented error message patterns for status validation

**From Epic 1, Story 1.2 (Agent Definitions in SKILL.md Format):**

- Created `agents/architect.md`, `agents/developer.md`, `agents/qa.md` in SKILL.md format
- Each agent has frontmatter: name, display_name, role, active_in, model, max_tokens
- Each agent has body sections: Identity, Instructions, Output Format, Context Rules
- Architect Output Format: table-based refinement perspective (Findings table + Recommendations + Proposed Acceptance Criteria)
- Developer Output Format: same table-based format with technical dependency focus
- QA Output Format: same table-based format with acceptance criteria and edge case focus

**From Epic 1, Story 1.4 (Output Templates):**

- Created `templates/refinement.md` for refinement output format
- Template defines structure for multi-agent perspective synthesis

**From Epic 1, Story 1.5 (Create Project Context Command & Workflow):**

- Established command/workflow separation pattern used throughout the framework
- Context loading pattern: check `context/index.md` exists, load domain context files based on ticket domain

**Key Patterns Established:**

- SKILL.md command format: 5 frontmatter fields (name, trigger, requires_status, sets_status, spawns_agents) in exact order + 4 body sections (Purpose, Workflow Reference, Input, Output) in exact order
- Workflow file format: step-by-step with `##` for major steps, `###` for substeps
- All file paths in workflow steps use `scrum_workflow/` prefix for framework-internal references
- Error messages follow actionable pattern: `"File 'path' not found. Run '/command' first"`, `"Story SW-XXX is in status 'current', but '/command' requires 'required'"`
- Guard condition enforcement: commands verify `status` before executing
- Write boundary compliance: each command writes only its own phase artifacts

### Naming Convention Reminders

- **Command file**: `refine-ticket.md` (kebab-case)
- **Workflow file**: `refinement.md` (kebab-case)
- **Frontmatter fields**: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents` (snake_case)
- **Status values**: `draft` (required by `/refine-ticket`), `refinement` (set by `/refine-ticket`) -- both kebab-case
- **Agent file names**: `architect.md`, `developer.md`, `qa.md` (kebab-case)
- **Agent names in spawns_agents array**: `architect`, `developer`, `qa` (kebab-case, lowercase)
- **Context file references**: `context/index.md`, `context/architecture.md`, `context/testing.md`, `context/{domain}.md` (kebab-case)
- **Domain skill references**: `skills/{domain}/SKILL.md` (kebab-case directory, uppercase SKILL.md)

### Testing Standards

**Verification Checklist:**

1. `scrum_workflow/commands/refine-ticket.md` exists and is valid SKILL.md command format
2. Frontmatter field order matches exactly: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`
3. Frontmatter values: `name: refine-ticket`, `trigger: "/refine-ticket"`, `requires_status: draft`, `sets_status: refinement`, `spawns_agents: [architect, developer, qa]`
4. Body section order matches exactly: Purpose, Workflow Reference, Input, Output
5. `scrum_workflow/workflows/refinement.md` exists with step-by-step workflow
6. Workflow covers all steps: input validation, story status validation, status update, context loading, spawn Architect, spawn Developer, spawn QA, display perspectives, await user feedback
7. Workflow Step 2.2 checks story file existence with actionable error message
8. Workflow Step 2.3 validates `status: draft` guard condition with actionable error message
9. Workflow Step 2.4 updates `story.md` status to `refinement` and sets `updated` date
10. Workflow Step 2.5 loads `context/index.md` and determines ticket domain
11. Workflow Step 2.6 spawns Architect agent with correct isolated context: story.md + index.md + architecture.md + domain context + architect.md
12. Workflow Step 2.7 spawns Developer agent with correct isolated context: story.md + index.md + domain context + domain skill + developer.md
13. Workflow Step 2.8 spawns QA agent with correct isolated context: story.md + index.md + testing.md + domain context + testing skill + qa.md
14. Workflow Step 2.9 displays all three perspectives in sequential labeled sections
15. Workflow Step 2.10 prompts for user feedback (accept/reject per perspective)
16. All YAML fields use snake_case throughout both files
17. All file names and references use kebab-case throughout both files
18. All framework-internal path references use `scrum_workflow/` prefix
19. No files other than the two new files were created or modified
20. Command file format is consistent with existing `create-ticket.md` and `create-project-context.md`
21. Workflow file format is consistent with existing `ticket-creation.md` and `project-context.md`
22. Sub-Agent Spawning pattern verified: each agent receives isolated context, no cross-contamination

**Manual Verification:**

- Parse `refine-ticket.md` YAML frontmatter -- should be valid YAML
- Verify body sections match Architecture Pattern 2 command template exactly
- Verify workflow steps are logically complete: a user providing `/refine-ticket SW-103` should trigger agent spawning, display three perspectives, and await feedback
- Verify agent spawning contexts match the Sub-Agent Spawning pattern: each agent gets only its role file and relevant context, no other agents' role files or perspectives
- Verify status validation enforces state machine transition: `draft` → `refinement` only, no skipping phases
- Verify write boundary compliance: `/refine-ticket` may only update `story.md` status and write `refinement.md` (refinement.md writing happens in Story 3.3 synthesis)
- Verify error messages follow actionable pattern from Architecture Pattern 5
- Verify no contradictions between workflow steps and state machine rules in `standards.md`

### References

- Command Definition Format: [Source: scrum_workflow/commands/create-ticket.md] (existing reference implementation from Story 2.2)
- Command Definition Format: [Source: scrum_workflow/commands/create-project-context.md] (existing reference implementation from Story 1.5)
- Workflow File Format: [Source: scrum_workflow/workflows/ticket-creation.md] (existing reference implementation from Story 2.2)
- Workflow File Format: [Source: scrum_workflow/workflows/project-context.md] (existing reference implementation from Story 1.5)
- Architect Agent: [Source: scrum_workflow/agents/architect.md] (existing agent role definition from Epic 1, Story 1.2)
- Developer Agent: [Source: scrum_workflow/agents/developer.md] (existing agent role definition from Epic 1, Story 1.2)
- QA Agent: [Source: scrum_workflow/agents/qa.md] (existing agent role definition from Epic 1, Story 1.2)
- State Machine Definition: [Source: scrum_workflow/context/standards.md#Story-Status-State-Machine]
- Write Boundary Rules: [Source: scrum_workflow/context/standards.md#Write-Boundary-Rules]
- Error & Recovery Patterns: [Source: scrum_workflow/context/standards.md#Error-Recovery-Patterns]
- Architecture Decision 4 (Agent Orchestration): [Source: _bmad-output/planning-artifacts/architecture.md#Decision-4-Agent-Orchestration-Model]
- Architecture Decision 5 (Inter-Phase Handoff): [Source: _bmad-output/planning-artifacts/architecture.md#Decision-5-Inter-Phase-Handoff-Protocol]
- Sub-Agent Spawning Pattern: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-4-Agent-Orchestration-Model]
- Agent Loading Model: [Source: _bmad-output/planning-artifacts/architecture.md#Agent-Loading-Model-Role-Skill-Context]
- Epic 3 Story 3.1 Requirements: [Source: _bmad-output/planning-artifacts/epics.md#Story-31-refine-ticket-Command-Agent-Spawning]
- FR Coverage: FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR32 [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements]
- NFR Coverage: NFR1, NFR4, NFR8, NFR9, NFR11 [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional-Requirements]

## Review Findings

### Code Review (2026-03-25)

- [x] [Review][Patch] Duplicate Step Numbering in refinement.md [scrum_workflow/workflows/refinement.md:111-165] — FIXED: Renumbered steps correctly - Step 3 is now "Update Story Status", Step 4 is "Context Loading"

**Summary:** Code review completed with 1 issue found and fixed. All acceptance criteria validated.

## Change Log

- **2026-03-25**: Implemented Story 3.1 - Created `/refine-ticket` command and refinement workflow with multi-agent spawning orchestration
  - Created `scrum_workflow/commands/refine-ticket.md` with SKILL.md command format
  - Created `scrum_workflow/workflows/refinement.md` with step-by-step agent spawning workflow
  - Implemented Architecture Decision 4 (Command-as-Orchestrator) and Architecture Decision 5 (Sub-Agent Spawning)
  - All 34 tasks and subtasks completed and validated against consistency rules
  - Story status updated: ready-for-dev → review
- **2026-03-25**: Code review completed - 1 issue found and fixed (duplicate step numbering)
  - Fixed step numbering in refinement.md workflow
  - All acceptance criteria validated
  - Story status updated: review → done

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

No debug issues encountered during story creation.

### Completion Notes List

- Story file created for Epic 3, Story 1: `/refine-ticket` command and agent spawning orchestration
- Analyzed all planning artifacts (epics.md, prd.md, architecture.md) plus project-context.md for complete context
- Analyzed previous Epic 2 stories (2.1, 2.2, 2.3) for implementation patterns and learnings
- Extracted Story 3.1 requirements from epics.md: multi-agent refinement with Architect, Developer, QA perspectives
- Mapped requirements to Architecture Decisions 4 (Command-as-Orchestrator) and 5 (Sub-Agent Spawning)
- Created comprehensive task breakdown: 3 tasks, 12 subtasks for command definition, 10 subtasks for workflow definition, 12 subtasks for validation
- Documented agent spawning contexts: Architect (architecture context), Developer (domain skill + context), QA (testing context + skill)
- Incorporated previous story learnings: SKILL.md format, workflow file format, path prefix consistency, error message patterns, guard condition enforcement
- Applied consistency rules: kebab-case files, snake_case YAML fields, table-based agent output format, write boundary compliance
- Identified files to create (2 new files), files to read (reference implementations), files to NOT modify (preserving existing framework)
- Ready for dev-story implementation with complete context and guardrails

**Implementation completed (2026-03-25):**
- Created `/scrum_workflow/commands/refine-ticket.md` with exact SKILL.md command format
  - Frontmatter fields in correct order: name, trigger, requires_status, sets_status, spawns_agents
  - Body sections in correct order: Purpose, Workflow Reference, Input, Output
  - All YAML fields use snake_case, all file references use kebab-case
- Created `/scrum_workflow/workflows/refinement.md` with comprehensive step-by-step workflow
  - 9 major workflow steps with detailed substeps
  - Input validation with actionable error messages (Architecture Pattern 5)
  - Story status validation enforcing draft → refinement state machine transition
  - Context loading with domain determination based on story keywords
  - Isolated agent spawning for Architect, Developer, QA following Sub-Agent Spawning pattern
  - Sequential perspective display with clear role attribution
  - User feedback collection for each perspective individually
- Validated all 12 consistency rules from Task 3:
  - 3.1: Frontmatter field order matches Architecture Pattern 2 ✓
  - 3.2: Body section order matches command template ✓
  - 3.3: Workflow uses ## for major steps, ### for substeps ✓
  - 3.4: YAML uses snake_case, files use kebab-case ✓
  - 3.5: Agent paths are correct (architect.md, developer.md, qa.md) ✓
  - 3.6: Context file references use correct paths ✓
  - 3.7: Domain skill references use correct paths ✓
  - 3.8: Workflow Step 1.3 checks story file existence ✓
  - 3.9: Workflow Step 2.2 validates status: draft guard condition ✓
  - 3.10: Workflow Step 3.1 updates status to refinement ✓
  - 3.11: Only 2 files created (no other files modified) ✓
  - 3.12: Sub-Agent Spawning pattern verified with isolated contexts ✓
- All acceptance criteria satisfied (AC 1-8)
- All 34 tasks and subtasks completed and validated
- Implementation follows Architecture Decisions 4 (Command-as-Orchestrator) and 5 (Sub-Agent Spawning)
- Framework integrity maintained: no modifications to existing command, workflow, agent, or context files

### File List

**Created during story creation:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/3-1-refine-ticket-command-and-agent-spawning.md` -- This story file

**Created during dev-story implementation:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/commands/refine-ticket.md` -- /refine-ticket command definition in SKILL.md format
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/workflows/refinement.md` -- Refinement workflow with agent spawning orchestration
