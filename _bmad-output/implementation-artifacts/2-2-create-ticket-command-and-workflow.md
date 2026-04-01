# Story 2.2: /create-ticket Command & Workflow

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to run `/create-ticket SW-103 "User authentication with OAuth2 support"` and get a structured story file,
So that I can turn a natural language idea into a formal specification without prompt engineering.

## Acceptance Criteria

1. **Given** the framework is installed and project context exists from `/create-project-context`
   **When** the user runs `/create-ticket SW-103 "User authentication with OAuth2 support"`
   **Then** `scrum_workflow/commands/create-ticket.md` exists in SKILL.md command format with `trigger: /create-ticket`, `requires_status: null`, `sets_status: draft`

2. **And** `scrum_workflow/workflows/ticket-creation.md` exists with step-by-step creation workflow

3. **And** the command creates `sprints/SW-103/story.md` with valid YAML frontmatter (`schema_version: 1`, `ticket: SW-103`, `status: draft`, `created: <today>`)

4. **And** the story body contains a structured description generated from the user's input

5. **And** the system generates an initial estimation based on the ticket description using `data/estimation-reference.yaml` (FR4)

6. **And** the command reads `context/index.md` to load relevant project context for better story generation

7. **And** the complete story file is written in a single write operation -- no partial writes that could corrupt frontmatter (NFR1)

8. **And** the status is set to `draft` upon creation (FR32)

## Tasks / Subtasks

- [x] Task 1: Create `/create-ticket` command definition in SKILL.md format (AC: 1)
  - [x] 1.1: Create `scrum_workflow/commands/create-ticket.md` with YAML frontmatter: `name: create-ticket`, `trigger: "/create-ticket"`, `requires_status: null`, `sets_status: draft`, `spawns_agents: []` -- fields in this exact order per Architecture Pattern 2
  - [x] 1.2: Add Markdown body sections in exact order: Purpose, Workflow Reference, Input, Output -- per command SKILL.md template
  - [x] 1.3: Purpose section: describe spec-first ticket creation from natural language input
  - [x] 1.4: Workflow Reference: `workflows/ticket-creation.md`
  - [x] 1.5: Input section: document expected input format -- ticket number (SW-XXX) + natural language description string
  - [x] 1.6: Output section: document that the command creates `sprints/SW-XXX/story.md` with valid frontmatter and status `draft`

- [x] Task 2: Create ticket-creation workflow definition (AC: 2, 3, 4, 5, 6, 7, 8)
  - [x] 2.1: Create `scrum_workflow/workflows/ticket-creation.md` with step-by-step workflow
  - [x] 2.2: Step 1 -- Input parsing: extract ticket number and description from user input, validate ticket format matches `SW-XXX` (zero-padded 3-digit); if invalid format, return actionable error per Architecture Pattern 5: `"Invalid ticket format 'input'. Expected format: SW-XXX (e.g., SW-001, SW-103)"`
  - [x] 2.3: Step 2 -- Vagueness check: invoke `skills/guided-mode/SKILL.md` to evaluate input quality; if input is too vague, enter guided mode before proceeding (FR3); if input is detailed enough, skip guided mode
  - [x] 2.4: Step 3 -- Context loading: check if `context/index.md` exists; if not, return actionable error: `"Project context not found. Run '/create-project-context' first"` (per Architecture Pattern 5); if exists, read `context/index.md` to load project context, then load relevant domain context files based on keywords in description
  - [x] 2.5: Step 4 -- Story generation: generate structured description from user input enriched with project context; produce acceptance criteria in Given/When/Then format
  - [x] 2.6: Step 5 -- Estimation: use `data/estimation-reference.yaml` to generate initial story point estimate based on complexity factors (FR4)
  - [x] 2.7: Step 6 -- Sprint folder creation: create `sprints/SW-XXX/` directory if it does not exist; if `sprints/SW-XXX/story.md` already exists, return actionable error: `"Story file 'sprints/SW-XXX/story.md' already exists. To re-create, delete the existing file first"`
  - [x] 2.8: Step 7 -- Story file creation: fill `templates/story.md` template with generated content; set frontmatter fields: `schema_version: 1`, `ticket: SW-XXX`, `title: "<generated title>"`, `status: draft`, `estimation: <calculated>`, `created: <today>`, `updated: <today>`; write complete file in single operation (NFR1)
  - [x] 2.9: Step 8 -- Confirmation: display created story summary to user with file path and status

- [x] Task 3: Validate command and workflow against consistency rules (AC: 1-8)
  - [x] 3.1: Verify `create-ticket.md` frontmatter field order matches Architecture Pattern 2: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`
  - [x] 3.2: Verify `create-ticket.md` body section order: Purpose, Workflow Reference, Input, Output
  - [x] 3.3: Verify `ticket-creation.md` uses `##` for major workflow steps, `###` for substeps
  - [x] 3.4: Verify all YAML fields use snake_case, all file references use kebab-case
  - [x] 3.5: Verify ticket format references `SW-XXX` consistently throughout both files
  - [x] 3.6: Verify guided mode integration references correct path: `skills/guided-mode/SKILL.md`
  - [x] 3.7: Verify estimation reference path: `data/estimation-reference.yaml`
  - [x] 3.8: Verify template reference path: `templates/story.md`
  - [x] 3.9: Verify no files outside of `scrum_workflow/commands/create-ticket.md` and `scrum_workflow/workflows/ticket-creation.md` are created or modified

## Dev Notes

This story creates the first ticket-creation command and its workflow -- the entry point for the entire Scrum Workflow lifecycle. It transforms a user's natural language idea into a structured story file conforming to the schema defined in Story 2.1. This is the implementation of the "spec-first" philosophy: no code begins until a spec exists.

**Critical constraint:** This story creates exactly 2 new files within the existing framework. It does NOT create sprint folders, story files, or any runtime state. The command and workflow are declarative definitions that will be interpreted by the AI coding platform at runtime.

### Architecture Context

**Architecture Decision 4 (Agent Orchestration Model)** governs the structure:

- **Command file** (`commands/create-ticket.md`) = WHAT: entry point, defines trigger, status transitions, and high-level behavior
- **Workflow file** (`workflows/ticket-creation.md`) = HOW: step-by-step execution detail for the ticket creation phase

**Architecture Decision 3 (Story File Schema & State Machine):**

- `/create-ticket` is the ONLY command that sets status to `draft` -- it is the entry point to the state machine
- The generated `story.md` must have exactly these frontmatter fields in this order: `schema_version`, `ticket`, `title`, `status`, `estimation`, `created`, `updated`
- `requires_status: null` means this command can run without any pre-existing story file

**Architecture Decision 5 (Inter-Phase Handoff Protocol):**

- `/create-ticket` produces `story.md` which becomes input for `/refine-ticket`
- The story file IS the handoff artifact -- it must be self-contained and parseable

**Key Functional Requirements:**

| FR | Requirement | Implementation |
|---|---|---|
| FR1 | User provides ticket number + natural language idea | Command input format: `/create-ticket SW-XXX "description"` |
| FR2 | System generates structured story file (YAML + Markdown) | Workflow fills `templates/story.md` with generated content |
| FR3 | System detects vague input and enters guided mode | Workflow invokes `skills/guided-mode/SKILL.md` for vagueness check |
| FR4 | System generates initial estimation | Workflow uses `data/estimation-reference.yaml` for estimation |
| FR5 | Story file created in sprint folder structure | Workflow creates `sprints/SW-XXX/story.md` |
| FR32 | Story status tracked and updated at phase transitions | Status set to `draft` upon creation |

**NFR Compliance:**

| NFR | Requirement | Implementation |
|---|---|---|
| NFR1 | Atomic file writes | Workflow specifies single write operation for complete story file |
| NFR7 | Convention-over-configuration | Story template has sensible defaults for all optional fields |
| NFR8 | Standard Markdown readable without tool | Generated story.md is plain Markdown with YAML frontmatter |
| NFR9 | No runtime dependencies | Command and workflow are pure Markdown files interpreted by AI platform |

### Existing File State

**Files to CREATE (do not exist yet):**

1. `scrum_workflow/commands/create-ticket.md` -- New command definition. Must follow SKILL.md command format established by `create-project-context.md` (existing reference implementation in `scrum_workflow/commands/create-project-context.md`)

2. `scrum_workflow/workflows/ticket-creation.md` -- New workflow definition. Must follow the workflow format established by `project-context.md` (existing reference implementation in `scrum_workflow/workflows/project-context.md`)

**Files to READ (reference, do not modify):**

- `scrum_workflow/commands/create-project-context.md` -- Reference for SKILL.md command format (frontmatter fields + body section order)
- `scrum_workflow/workflows/project-context.md` -- Reference for workflow file structure and step formatting
- `scrum_workflow/templates/story.md` -- The template that `/create-ticket` will fill at runtime
- `scrum_workflow/data/estimation-reference.yaml` -- Estimation reference data used in the workflow
- `scrum_workflow/skills/guided-mode/SKILL.md` -- Guided mode skill invoked by the workflow for vague input
- `scrum_workflow/context/standards.md` -- Standards including state machine, sprint folder conventions, schema versioning

**Files to NOT modify:**

- `scrum_workflow/config.yaml` -- no changes needed
- `scrum_workflow/context/standards.md` -- no changes needed (state machine and folder conventions already documented in Story 2.1)
- `scrum_workflow/templates/story.md` -- no changes needed (already correct from Story 1.4, verified in Story 2.1)
- `scrum_workflow/data/estimation-reference.yaml` -- no changes (already created in Story 1.4)
- `scrum_workflow/skills/guided-mode/SKILL.md` -- no changes (already created in Story 1.6)
- Any agent definitions in `scrum_workflow/agents/` -- no changes needed
- Any other existing files

### Project Structure Notes

- All work is within the `scrum_workflow/` framework directory
- The command file goes in `scrum_workflow/commands/create-ticket.md` (following kebab-case naming)
- The workflow file goes in `scrum_workflow/workflows/ticket-creation.md` (following kebab-case naming)
- Sprint folders (`sprints/SW-XXX/`) do NOT exist yet and are NOT created by this story -- they will be created at runtime when the command is executed by the AI platform
- The `commands/` directory already contains `create-project-context.md` as a reference implementation
- The `workflows/` directory already contains `project-context.md` as a reference implementation

### Previous Story Intelligence

**From Story 2.1 (Story File Schema & Sprint Folder Conventions) -- MOST RELEVANT:**

- Documented the complete state machine in `standards.md` -- `/create-ticket` sets status to `draft`
- Documented sprint folder convention `sprints/SW-XXX/` with zero-padded 3-digit ticket numbers
- Documented allowed files per ticket folder and write boundary rules
- Documented schema versioning rules -- `schema_version: 1` is current
- Verified `templates/story.md` has correct field order: `schema_version`, `ticket`, `title`, `status`, `estimation`, `created`, `updated`
- **Review finding applied:** Clarified "Sprint Tracking Status" vs "Story File Status" distinction in `standards.md`
- **Deferred findings:** No handling for ticket numbers exceeding SW-999; no concurrent status transition protection

**From Story 1.5 (Create Project Context Command & Workflow) -- FORMAT REFERENCE:**

- Established the pattern for command definition files: SKILL.md format with frontmatter (`name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`) + body (Purpose, Workflow Reference, Input, Output)
- Established the pattern for workflow files: two-phase structure with clear step numbering
- Context file generation follows `context/index.md` as discovery index

**From Story 1.4 (Output Templates):**

- Created `templates/story.md` with correct YAML frontmatter and `{{variable}}` placeholder syntax
- Created `data/estimation-reference.yaml` with Modified Fibonacci scale (1, 2, 3, 5, 8, 13) and complexity factors
- Templates use `<!-- Fill ... -->` comment placeholders in body sections

**From Story 1.6 (Workflow Skill Definitions):**

- Created `skills/guided-mode/SKILL.md` with vagueness detection criteria, trigger threshold, and question generation strategy
- Created `skills/synthesis/SKILL.md` for perspective merging (used by `/refine-ticket`, not by `/create-ticket`)
- SKILL.md format is strict: field order and section order must match exactly

**Key Patterns Established:**

- Command files use SKILL.md command template (5 frontmatter fields, 4 body sections)
- Workflow files use step-by-step format with clear phase separation
- All file paths in workflow steps are relative to `scrum_workflow/` framework root
- No `.gitkeep` files needed -- directories have actual content
- Error messages follow actionable pattern from Architecture Pattern 5

### Naming Convention Reminders

- **Command file**: `create-ticket.md` (kebab-case)
- **Workflow file**: `ticket-creation.md` (kebab-case)
- **Frontmatter fields**: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents` (snake_case)
- **Status values**: `draft` (kebab-case)
- **Ticket format**: `SW-XXX` with zero-padded 3-digit numbers
- **Sprint folders**: `sprints/SW-XXX/` (kebab-case)
- **Template references**: `templates/story.md`, `data/estimation-reference.yaml` (kebab-case)

### Testing Standards

**Verification Checklist:**

1. `scrum_workflow/commands/create-ticket.md` exists and is valid SKILL.md command format
2. Frontmatter field order matches exactly: `name`, `trigger`, `requires_status`, `sets_status`, `spawns_agents`
3. Frontmatter values: `name: create-ticket`, `trigger: "/create-ticket"`, `requires_status: null`, `sets_status: draft`, `spawns_agents: []`
4. Body section order matches exactly: Purpose, Workflow Reference, Input, Output
5. `scrum_workflow/workflows/ticket-creation.md` exists with step-by-step workflow
6. Workflow covers all 8 steps: input parsing, vagueness check, context loading, story generation, estimation, folder creation, file creation, confirmation
7. Workflow references correct paths: `skills/guided-mode/SKILL.md`, `data/estimation-reference.yaml`, `templates/story.md`, `context/index.md`
8. Workflow specifies `sprints/SW-XXX/story.md` as output path with correct ticket format
9. Workflow specifies frontmatter fields in correct order: `schema_version`, `ticket`, `title`, `status`, `estimation`, `created`, `updated`
10. Workflow specifies `status: draft` as the initial status
11. Workflow specifies single write operation for atomic story file creation (NFR1)
12. All YAML fields use snake_case throughout both files
13. All file names and references use kebab-case throughout both files
14. No files other than the two new files were created or modified
15. Command file format is consistent with existing `create-project-context.md`
16. Workflow file format is consistent with existing `project-context.md`

**Manual Verification:**

- Parse `create-ticket.md` YAML frontmatter -- should be valid YAML
- Verify body sections match Architecture Pattern 2 command template exactly
- Verify workflow steps are logically complete: a user providing input should get a complete story file
- Verify guided mode integration references match `skills/guided-mode/SKILL.md` trigger criteria
- Verify estimation integration references match `data/estimation-reference.yaml` structure
- Verify no contradictions between workflow steps and state machine rules in `standards.md`
- Verify write boundary compliance: `/create-ticket` may only write `story.md`, not `refinement.md`, `plan.md`, `review-*.md`, or `approval.md`

### References

- Command Definition Format: [Source: scrum_workflow/commands/create-project-context.md] (existing reference implementation)
- Workflow File Format: [Source: scrum_workflow/workflows/project-context.md] (existing reference implementation)
- Story Template: [Source: scrum_workflow/templates/story.md] (template to fill at runtime)
- Estimation Reference: [Source: scrum_workflow/data/estimation-reference.yaml] (estimation data)
- Guided Mode Skill: [Source: scrum_workflow/skills/guided-mode/SKILL.md] (vagueness detection)
- State Machine Definition: [Source: scrum_workflow/context/standards.md#Story-Status-State-Machine]
- Sprint Folder Conventions: [Source: scrum_workflow/context/standards.md#Sprint-Folder-Conventions]
- Write Boundary Rules: [Source: scrum_workflow/context/standards.md#Write-Boundary-Rules]
- Architecture Decision 3 (Story Schema): [Source: _bmad-output/planning-artifacts/architecture.md#Decision-3-Story-File-Schema-State-Machine]
- Architecture Decision 4 (Agent Orchestration): [Source: _bmad-output/planning-artifacts/architecture.md#Decision-4-Agent-Orchestration-Model]
- Architecture Decision 5 (Inter-Phase Handoff): [Source: _bmad-output/planning-artifacts/architecture.md#Decision-5-Inter-Phase-Handoff-Protocol]
- Epic 2 Story 2.2 Requirements: [Source: _bmad-output/planning-artifacts/epics.md#Story-22-create-ticket-Command-Workflow]
- FR Coverage: FR1, FR2, FR3, FR4, FR5, FR32 [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements]
- NFR Coverage: NFR1, NFR7, NFR8, NFR9 [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional-Requirements]

### Review Findings

- [x] [Review][Patch] Path prefix inconsistency in workflow step references — `ticket-creation.md` used bare paths (`data/estimation-reference.yaml`, `templates/story.md`, `skills/guided-mode/SKILL.md`) in workflow steps while the reference implementation (`project-context.md`) consistently uses the `scrum_workflow/` prefix for framework-internal paths. Fixed: added `scrum_workflow/` prefix to 3 framework-internal path references in Steps 2.1, 5.1, and 7.1. [scrum_workflow/workflows/ticket-creation.md:44,133,181]
- [x] [Review][Dismiss] SW-000 not explicitly excluded in validation rules — Step 1.2 text says "Valid range: SW-001 through SW-999" which is explicit enough; dismissed as noise.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

No debug issues encountered during implementation.

### Completion Notes List

- Task 1: Created `scrum_workflow/commands/create-ticket.md` with SKILL.md command format matching the reference implementation (`create-project-context.md`). Frontmatter has exactly 5 fields in correct order: name, trigger, requires_status, sets_status, spawns_agents. Body has 4 sections in correct order: Purpose, Workflow Reference, Input, Output. The command sets `sets_status: draft` as the entry point to the story lifecycle state machine.
- Task 2: Created `scrum_workflow/workflows/ticket-creation.md` with 8 sequential workflow steps covering the complete ticket creation lifecycle: input parsing with SW-XXX format validation, vagueness check via `skills/guided-mode/SKILL.md`, context loading from `context/index.md` with domain-specific file loading, story generation with Given/When/Then acceptance criteria, estimation using `data/estimation-reference.yaml` Modified Fibonacci scale, sprint folder creation with duplicate detection, atomic story file creation using `templates/story.md`, and user confirmation with next steps. All error messages follow the actionable pattern from Architecture Pattern 5. Write boundaries and validation rules documented.
- Task 3: All 9 validation subtasks passed. Verified frontmatter field order, body section order, heading levels (## for steps, ### for substeps), snake_case YAML fields, kebab-case file references, consistent SW-XXX ticket format, correct paths for guided-mode/estimation-reference/story template, and that only the 2 specified files were created. Frontmatter structure diff against reference implementation showed zero differences.

### Implementation Plan

Implemented exactly 2 new declarative Markdown files within the existing `scrum_workflow/` framework directory. No runtime state, sprint folders, or story files were created -- those are produced at runtime when the AI platform executes the command. Both files follow established patterns from Story 1.5 (create-project-context command and project-context workflow).

### File List

- `scrum_workflow/commands/create-ticket.md` (NEW) -- /create-ticket command definition in SKILL.md format
- `scrum_workflow/workflows/ticket-creation.md` (NEW) -- Ticket creation workflow with 8 steps

### Change Log

- 2026-03-25: Created /create-ticket command definition and ticket-creation workflow (Story 2.2 implementation)
