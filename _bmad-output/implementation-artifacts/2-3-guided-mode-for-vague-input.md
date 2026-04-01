# Story 2.3: Guided Mode for Vague Input

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the system to ask clarifying questions when my input is too vague,
So that I get a high-quality story file even when I don't know exactly how to describe what I need.

## Acceptance Criteria

1. **Given** the `/create-ticket` command from Story 2.2 is functional
   **When** the user runs `/create-ticket SW-104 "dark mode"`
   **Then** the system detects the input is vague or incomplete (FR3)

2. **And** `scrum_workflow/skills/guided-mode/SKILL.md` exists defining how to clarify vague tickets

3. **And** the system enters guided mode and asks targeted follow-up questions (e.g., "Who is this for?", "What problem does it solve?", "Where in the app should this appear?")

4. **And** the system waits for user responses before generating the story file

5. **And** after sufficient context is gathered, the system generates a structured story file as in Story 2.2

6. **And** the guided mode questions are context-aware -- informed by the project context from `context/*.md` (e.g., "Which of your existing API endpoints should this integrate with?")

7. **And** if the input is already detailed enough, guided mode is NOT triggered -- the story is created directly

## Tasks / Subtasks

- [x] Task 1: Verify and enhance `scrum_workflow/skills/guided-mode/SKILL.md` for full FR3 compliance (AC: 2, 3, 6)
  - [x] 1.1: Read and audit the existing `scrum_workflow/skills/guided-mode/SKILL.md` against all acceptance criteria -- it already exists from Story 1.6 with vagueness detection criteria, trigger threshold, question generation strategy, and context-aware questioning
  - [x] 1.2: Verify that the vagueness detection criteria cover all three trigger conditions: input length threshold (~20 words), missing key elements (who/what/where/why), and ambiguous terms ("improve", "fix", "update", "refactor", "better")
  - [x] 1.3: Verify the trigger threshold logic: guided mode triggers when ANY condition is met (length, 2+ missing elements, or ambiguous terms)
  - [x] 1.4: Verify the question generation strategy uses the who/what/where/why/how framework with three categories: Scope Questions, Technical Questions, User-Impact Questions
  - [x] 1.5: Verify context-aware questioning section references `context/index.md` and `context/{relevant-domain}.md` for project-specific questions
  - [x] 1.6: Verify exit condition is documented: all four key elements addressed, or user confirms completeness, or sufficient detail gathered
  - [x] 1.7: Verify the output format returns structured questions grouped by category with rationale
  - [x] 1.8: If any gaps found, enhance the SKILL.md file to fully satisfy AC 2, 3, and 6. Preserve existing SKILL.md format: frontmatter (`name`, `role`, `description`) + body (Identity, Instructions, Output Format, Context Rules)

- [x] Task 2: Enhance `scrum_workflow/workflows/ticket-creation.md` to integrate guided mode conversation loop (AC: 1, 3, 4, 5, 7)
  - [x] 2.1: Read the existing `scrum_workflow/workflows/ticket-creation.md` -- it already has Step 2 (Vagueness Check) with substeps 2.1 (Invoke Guided Mode Skill), 2.2 (Handle Vague Input), and 2.3 (Handle Detailed Input)
  - [x] 2.2: Verify Step 2.1 correctly invokes `scrum_workflow/skills/guided-mode/SKILL.md` and evaluates input against all three vagueness criteria
  - [x] 2.3: Verify Step 2.2 specifies a conversation loop: present questions, collect responses, merge enriched description -- NOT a single-pass question dump
  - [x] 2.4: Enhance Step 2.2 if needed to clearly specify the iterative conversation flow: (a) present clarifying questions from guided mode, (b) wait for user responses, (c) evaluate whether sufficient detail has been gathered, (d) if not sufficient, generate follow-up questions informed by previous answers, (e) repeat until exit condition met
  - [x] 2.5: Verify Step 2.3 specifies the bypass condition: if input is sufficiently detailed, skip guided mode entirely and proceed to Step 3
  - [x] 2.6: Verify that after guided mode completes, the enriched description is passed to Step 3 (Context Loading) and Step 4 (Story Generation) -- ensuring the final story file is generated using all gathered context
  - [x] 2.7: Verify the generated story file after guided mode has the same quality and format as a story created from detailed input (AC 5) -- same YAML frontmatter, same Given/When/Then acceptance criteria, same subtask format

- [x] Task 3: Validate guided mode integration end-to-end against consistency rules (AC: 1-7)
  - [x] 3.1: Verify `guided-mode/SKILL.md` frontmatter field order matches SKILL.md format: `name`, `role`, `description`
  - [x] 3.2: Verify `guided-mode/SKILL.md` body section order: Identity, Instructions, Output Format, Context Rules
  - [x] 3.3: Verify all YAML fields use snake_case throughout both files
  - [x] 3.4: Verify all file references use kebab-case throughout both files
  - [x] 3.5: Verify `ticket-creation.md` guided mode path reference: `scrum_workflow/skills/guided-mode/SKILL.md`
  - [x] 3.6: Verify context file references use correct paths: `context/index.md`, `context/{relevant-domain}.md`
  - [x] 3.7: Verify write boundary compliance: guided mode skill writes NO files directly; the `/create-ticket` workflow manages all file creation
  - [x] 3.8: Verify no files outside `scrum_workflow/skills/guided-mode/SKILL.md` and `scrum_workflow/workflows/ticket-creation.md` are created or modified
  - [x] 3.9: Test the bypass condition mentally: input "User authentication with OAuth2 support for the login page, replacing the current basic auth, so that enterprise SSO providers can integrate" should NOT trigger guided mode (detailed, all key elements present, no ambiguous terms)
  - [x] 3.10: Test the trigger condition mentally: input "dark mode" should trigger guided mode (below 20 words, missing who/where/why, no technical specificity)

## Dev Notes

This story ensures that the guided mode feature -- already partially implemented in Stories 1.6 and 2.2 -- works as a cohesive, context-aware conversation loop within the `/create-ticket` workflow. The guided-mode SKILL.md was created in Story 1.6; the ticket-creation workflow was created in Story 2.2 with basic guided mode integration in Step 2. This story verifies correctness, enhances the conversation loop, and ensures end-to-end integration.

**Critical constraint:** This story modifies at most 2 existing files within the framework. It does NOT create any new files, sprint folders, or runtime state. The guided mode skill and workflow step are declarative definitions interpreted by the AI coding platform at runtime.

### Architecture Context

**Architecture Decision 4 (Agent Orchestration Model)** governs the relationship between command, workflow, and skill:

- **Command file** (`commands/create-ticket.md`) = WHAT: entry point, references the workflow. Already created in Story 2.2. Do NOT modify.
- **Workflow file** (`workflows/ticket-creation.md`) = HOW: step-by-step execution. Step 2 handles vagueness check. May need enhancement for conversation loop.
- **Skill file** (`skills/guided-mode/SKILL.md`) = CAPABILITY: vagueness detection and question generation. Already created in Story 1.6. May need enhancement for full FR3 compliance.

**Architecture Decision 5 (Inter-Phase Handoff Protocol):**

- The guided mode conversation loop happens WITHIN the `/create-ticket` phase -- it is not a separate phase
- The enriched description from guided mode feeds directly into story generation (Step 4) within the same workflow
- No intermediate files are created during guided mode -- the conversation is transient until the final story file is written atomically

**Key Functional Requirements:**

| FR | Requirement | Implementation |
|---|---|---|
| FR3 | System detects vague input and enters guided mode | Workflow Step 2 invokes `skills/guided-mode/SKILL.md` for vagueness evaluation |
| FR1 | User provides ticket number + natural language idea | Command input format from Story 2.2 (unchanged) |
| FR2 | System generates structured story file | Story generation in Steps 4-7 (unchanged) -- same quality whether guided mode was used or not |

**NFR Compliance:**

| NFR | Requirement | Implementation |
|---|---|---|
| NFR1 | Atomic file writes | Only the final story file is written, not intermediate guided mode state |
| NFR9 | No runtime dependencies | Guided mode is a pure Markdown skill file interpreted by the AI platform |
| NFR11 | Agent output within context window | Guided mode questions and responses must fit within platform context limits |

### Existing File State

**Files to potentially MODIFY (already exist):**

1. `scrum_workflow/skills/guided-mode/SKILL.md` -- Created in Story 1.6. Currently has: frontmatter (`name: guided-mode`, `role: "vague-input-clarification"`, `description`), Identity section, Instructions section (with Vagueness Detection Criteria, Trigger Threshold, Question Generation Strategy, Context-Aware Questioning, Exit Condition subsections), Output Format section, Context Rules section. May need enhancement for conversation loop specification.

2. `scrum_workflow/workflows/ticket-creation.md` -- Created in Story 2.2. Currently has 8 steps. Step 2 (Vagueness Check) has substeps 2.1 (invoke guided mode skill), 2.2 (handle vague input: present questions, collect responses, merge description), 2.3 (handle detailed input: skip). May need enhancement to specify iterative conversation loop in Step 2.2.

**Files to READ (reference, do not modify):**

- `scrum_workflow/commands/create-ticket.md` -- Command definition from Story 2.2. DO NOT MODIFY. References `workflows/ticket-creation.md`.
- `scrum_workflow/context/standards.md` -- Standards including naming conventions, state machine, sprint folder conventions
- `scrum_workflow/templates/story.md` -- Story template filled at runtime
- `scrum_workflow/data/estimation-reference.yaml` -- Estimation data used in workflow Step 5

**Files to NOT modify:**

- `scrum_workflow/commands/create-ticket.md` -- No changes needed (command definition is complete from Story 2.2)
- `scrum_workflow/config.yaml` -- No changes needed
- `scrum_workflow/templates/story.md` -- No changes needed
- `scrum_workflow/data/estimation-reference.yaml` -- No changes needed
- Any agent definitions in `scrum_workflow/agents/` -- No changes needed
- Any other workflow, skill, or template files

### Project Structure Notes

- All work is within the `scrum_workflow/` framework directory
- The guided mode skill is at `scrum_workflow/skills/guided-mode/SKILL.md` (existing file, ~110 lines)
- The ticket creation workflow is at `scrum_workflow/workflows/ticket-creation.md` (existing file, ~258 lines)
- Sprint folders (`sprints/SW-XXX/`) do NOT exist yet -- they are created at runtime by the workflow
- The `skills/guided-mode/` directory already exists with `SKILL.md` as the only file
- No new directories or files need to be created

### Previous Story Intelligence

**From Story 2.2 (/create-ticket Command & Workflow) -- MOST RELEVANT:**

- Created `scrum_workflow/commands/create-ticket.md` and `scrum_workflow/workflows/ticket-creation.md`
- Ticket creation workflow has 8 steps: input parsing, vagueness check, context loading, story generation, estimation, folder creation, file creation, confirmation
- Step 2 (Vagueness Check) already integrates guided mode: invokes `scrum_workflow/skills/guided-mode/SKILL.md`, handles vague input by presenting questions and collecting responses, handles detailed input by bypassing
- **Review finding applied:** Path prefix inconsistency fixed -- all framework-internal path references now use `scrum_workflow/` prefix
- Step 2.2 (Handle Vague Input) specifies: (1) Present clarifying questions, (2) Collect user responses, (3) Merge original description with clarified information, (4) Continue to Step 3 with enriched description
- **Key pattern:** The workflow treats guided mode as a sub-step within ticket creation, not a separate phase

**From Story 1.6 (Workflow Skill Definitions) -- SKILL FORMAT REFERENCE:**

- Created `skills/guided-mode/SKILL.md` with vagueness detection criteria, trigger threshold, and question generation strategy
- SKILL.md format is strict: field order and section order must match exactly
- Guided mode skill has frontmatter: `name: guided-mode`, `role: "vague-input-clarification"`, `description: "Detects vague or incomplete ticket input..."`
- Context Rules section specifies reads (`context/index.md`, `context/{relevant-domain}.md`) and writes (none -- skill returns questions to orchestrating command)

**From Story 2.1 (Story File Schema & Sprint Folder Conventions):**

- Documented state machine in `standards.md` -- `/create-ticket` sets status to `draft`
- Write boundary rules: `/create-ticket` may only write `story.md`, not `refinement.md`, `plan.md`, `review-*.md`, or `approval.md`
- Sprint folder convention: `sprints/SW-XXX/` with zero-padded 3-digit ticket numbers

**From Story 1.4 (Output Templates):**

- Created `templates/story.md` with correct YAML frontmatter and `{{variable}}` placeholder syntax
- Created `data/estimation-reference.yaml` with Modified Fibonacci scale (1, 2, 3, 5, 8, 13)

**Key Patterns Established:**

- SKILL.md format: frontmatter (`name`, `role`, `description`) + body (Identity, Instructions, Output Format, Context Rules)
- Workflow file format: step-by-step with `##` for major steps, `###` for substeps
- All file paths in workflow steps are relative to `scrum_workflow/` framework root with `scrum_workflow/` prefix
- Error messages follow actionable pattern from Architecture Pattern 5
- Write boundary compliance: guided mode skill writes NO files directly

### Naming Convention Reminders

- **Skill file**: `skills/guided-mode/SKILL.md` (kebab-case directory, uppercase SKILL.md per convention)
- **Workflow file**: `ticket-creation.md` (kebab-case)
- **Frontmatter fields**: `name`, `role`, `description` (snake_case)
- **Context file references**: `context/index.md`, `context/{relevant-domain}.md` (kebab-case)
- **Status values**: `draft` (set by `/create-ticket` -- unchanged by this story)

### Testing Standards

**Verification Checklist:**

1. `scrum_workflow/skills/guided-mode/SKILL.md` exists and is valid SKILL.md format
2. Frontmatter field order matches: `name`, `role`, `description`
3. Body section order matches: Identity, Instructions, Output Format, Context Rules
4. Vagueness detection criteria cover all three trigger conditions (length, missing elements, ambiguous terms)
5. Trigger threshold uses OR logic: any single condition triggers guided mode
6. Question generation uses who/what/where/why/how framework with three categories
7. Context-aware questioning references `context/index.md` and domain context files
8. Exit condition documented: all key elements addressed, user confirms, or sufficient detail gathered
9. `scrum_workflow/workflows/ticket-creation.md` Step 2 correctly invokes guided mode skill
10. Step 2.2 specifies iterative conversation loop (not single-pass question dump)
11. Step 2.3 specifies bypass condition for detailed input
12. Generated story after guided mode has identical format to story from detailed input
13. All YAML fields use snake_case throughout both files
14. All file references use kebab-case throughout both files
15. No files outside `skills/guided-mode/SKILL.md` and `workflows/ticket-creation.md` were modified
16. Write boundary compliance: guided mode writes no files; `/create-ticket` workflow writes only `story.md`

**Manual Verification:**

- Parse `SKILL.md` YAML frontmatter -- should be valid YAML
- Verify body sections match SKILL.md format exactly
- Verify workflow Step 2 integration references correct skill path: `scrum_workflow/skills/guided-mode/SKILL.md`
- Trace through workflow with vague input "dark mode": should trigger guided mode, ask questions, enrich description, then proceed through Steps 3-8 to produce a complete story file
- Trace through workflow with detailed input: should bypass guided mode entirely, proceed directly to Step 3
- Verify no contradictions between guided mode exit condition and workflow Step 2 flow control

### References

- Guided Mode Skill: [Source: scrum_workflow/skills/guided-mode/SKILL.md] (existing implementation from Story 1.6)
- Ticket Creation Workflow: [Source: scrum_workflow/workflows/ticket-creation.md] (existing implementation from Story 2.2)
- Command Definition: [Source: scrum_workflow/commands/create-ticket.md] (reference only, do not modify)
- Standards Document: [Source: scrum_workflow/context/standards.md] (naming conventions, state machine)
- Story Template: [Source: scrum_workflow/templates/story.md] (template filled at runtime)
- Estimation Reference: [Source: scrum_workflow/data/estimation-reference.yaml] (estimation data)
- Architecture Decision 4 (Agent Orchestration): [Source: _bmad-output/planning-artifacts/architecture.md#Decision-4-Agent-Orchestration-Model]
- Architecture Decision 5 (Inter-Phase Handoff): [Source: _bmad-output/planning-artifacts/architecture.md#Decision-5-Inter-Phase-Handoff-Protocol]
- Epic 2 Story 2.3 Requirements: [Source: _bmad-output/planning-artifacts/epics.md#Story-23-Guided-Mode-for-Vague-Input]
- FR Coverage: FR1, FR2, FR3 [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements]
- NFR Coverage: NFR1, NFR9, NFR11 [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional-Requirements]
- PRD Journey 3 (Onboarding): [Source: _bmad-output/planning-artifacts/prd.md#Journey-3-Sami-First-Time-Setup-Onboarding]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

**Code Review Completed (2026-03-25):**

Code review completed with all findings resolved:

**Review Summary:**
- 0 decision-needed findings
- 3 patches applied
- 1 deferred (race condition in concurrent story creation - pre-existing architecture limitation)
- 4 dismissed as noise

**Patches Applied:**

1. **Empty Input Validation**: Added Step 1.1a to validate that the ticket description is non-empty before processing. Previously, an empty description would incorrectly trigger guided mode. Now returns an actionable error asking for non-empty input.

2. **Missing Domain Context File Handling**: Enhanced Step 3.3 to gracefully handle missing domain context files. Previously, missing domain files could cause runtime errors. Now logs a warning and continues with available context.

3. **Guided Mode Escape Mechanism**: Enhanced Step 2.2 to add escape commands (/skip, cancel, abort) allowing users to exit the guided mode conversation loop at any time and proceed with current input. Previously, users could get stuck in the loop if unable to answer questions.

**Files Modified:**
- `scrum_workflow/workflows/ticket-creation.md` - Applied 3 patches
- Story file status updated: review → done
- Sprint status synced: 2-3-guided-mode-for-vague-input → done

**Task 3 Validation Results:**

All 10 validation subtasks completed successfully:

1. **SKILL.md Format Compliance (3.1-3.2)**: Verified frontmatter field order (name, role, description) and body section order (Identity, Instructions, Output Format, Context Rules) match SKILL.md format specification exactly.

2. **Naming Convention Compliance (3.3-3.4)**: Verified all YAML fields use snake_case (name, role, description, schema_version, ticket, title, status, estimation, created, updated) and all file references use kebab-case (context/index.md, context/backend.md, context/frontend.md, context/testing.md, context/devops.md, context/architecture.md, scrum_workflow/skills/guided-mode/SKILL.md, scrum_workflow/templates/story.md, sprints/SW-XXX/story.md).

3. **Path Reference Verification (3.5-3.6)**: Confirmed `ticket-creation.md` references correct guided mode skill path (`scrum_workflow/skills/guided-mode/SKILL.md`) and context file references use correct paths (`context/index.md`, `context/{relevant-domain}.md`).

4. **Write Boundary Compliance (3.7-3.8)**: Verified guided mode skill writes NO files directly (line 107-109 of SKILL.md explicitly states this). Confirmed only two files were potentially modified: `scrum_workflow/skills/guided-mode/SKILL.md` and `scrum_workflow/workflows/ticket-creation.md`. No other framework files were modified.

5. **Mental Testing (3.9-3.10)**: Tested bypass condition with detailed OAuth2 input (26 words, all key elements present, no ambiguous terms) - correctly bypasses guided mode. Tested trigger condition with vague "dark mode" input (2 words, missing 3 of 4 key elements) - correctly triggers guided mode.

**Summary**: The guided mode integration is fully compliant with all acceptance criteria. The existing implementations from Stories 1.6 and 2.2 already satisfy all requirements without needing any modifications. The workflow correctly implements an iterative conversation loop in Step 2.2, the guided mode skill provides comprehensive vagueness detection and context-aware question generation, and the integration ensures high-quality story creation whether from detailed input or guided mode enrichment.

### Change Log

### 2026-03-25

**Task 3: Validate guided mode integration end-to-end against consistency rules**

- Verified SKILL.md format compliance (frontmatter and body section order)
- Verified naming convention compliance (snake_case for YAML, kebab-case for files)
- Verified path references (guided mode skill path, context file paths)
- Verified write boundary compliance (guided mode writes no files directly)
- Performed mental testing of trigger and bypass conditions
- Result: All validation checks passed. No modifications needed to existing files from Stories 1.6 and 2.2.

## Review Findings

### Code Review Results (2026-03-25)

**Summary**: 0 decision-needed, 3 patches, 1 deferred, 4 dismissed as noise.

### Patch Findings (Unchecked - To be fixed)

- [x] [Review][Patch] Add empty input validation before guided mode processing [scrum_workflow/workflows/ticket-creation.md:Step-1.1] — FIXED
- [x] [Review][Patch] Add graceful handling for missing domain context files [scrum_workflow/workflows/ticket-creation.md:Step-3.3] — FIXED
- [x] [Review][Patch] Add "/skip" or "cancel" option to guided mode loop [scrum_workflow/workflows/ticket-creation.md:Step-2.2] — FIXED

### Deferred Findings (Checked - Pre-existing issues)

- [x] [Review][Defer] Document race condition in concurrent story creation [scrum_workflow/workflows/ticket-creation.md:Steps-0.2,6.2,7.3] — deferred, pre-existing. File-based systems inherently have race conditions between existence check and write. This is a known limitation of the architecture, not introduced by this story.

### Dismissed Findings (Noise)

- Dismissed: Incomplete exit condition documentation (sufficiently documented)
- Dismissed: Missing ambiguous terms examples (current examples are sufficient)
- Dismissed: Validation order inconsistency (order is correct)
- Dismissed: Multi-language input assumption (project is English-focused)

## File List
