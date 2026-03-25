# Story 1.6: Workflow Skill Definitions

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the three framework-level workflow skills (guided-mode, synthesis, readiness-check) defined as SKILL.md files,
So that downstream commands in Epics 2-3 can reference reusable, well-defined skill specifications for vague-input handling, perspective merging, and story completeness validation.

## Acceptance Criteria

1. **Given** the framework directory structure from Story 1.1 exists with `scrum_workflow/skills/` containing only `.gitkeep` and `README.md`
   **When** the workflow skill definitions are created
   **Then** `scrum_workflow/skills/guided-mode/SKILL.md` exists in SKILL.md format defining how to clarify vague tickets

2. **And** `scrum_workflow/skills/synthesis/SKILL.md` exists in SKILL.md format defining how to merge agent perspectives into a coherent updated story

3. **And** `scrum_workflow/skills/readiness-check/SKILL.md` exists in SKILL.md format defining how to validate story completeness before implementation

4. **And** each SKILL.md file has YAML frontmatter with fields: `name`, `role`, `description`

5. **And** each SKILL.md file has Markdown body with sections in this exact order: Identity, Instructions, Output Format, Context Rules

6. **And** the `guided-mode` skill defines: vagueness detection criteria, targeted follow-up question generation, context-aware questioning using `context/*.md`, and the threshold for when guided mode triggers vs. direct creation (FR3)

7. **And** the `synthesis` skill defines: how to merge only accepted perspectives, how to produce refined description + acceptance criteria + estimation + subtasks, deduplication of overlapping findings, and conflict resolution between agent recommendations (FR12)

8. **And** the `readiness-check` skill defines: completeness validation criteria (description present, acceptance criteria defined, estimation set, subtasks listed), PASS/FAIL result format with specific failure reasons, status transition logic (`refinement` to `ready` on PASS, `refinement` to `draft` on FAIL), and `plan.md` assembly from synthesized subtasks on PASS (FR15, FR16, FR17)

9. **And** all files use kebab-case naming for directories and filenames, snake_case for YAML fields

10. **And** the `.gitkeep` file in `scrum_workflow/skills/` is removed after skill directories are created

## Tasks / Subtasks

- [x] Create guided-mode workflow skill (AC: 1, 4, 5, 6, 9)
  - [x] Create directory `scrum_workflow/skills/guided-mode/`
  - [x] Create `scrum_workflow/skills/guided-mode/SKILL.md` with YAML frontmatter: `name: guided-mode`, `role: "vague-input-clarification"`, `description: "Detects vague or incomplete ticket input and asks targeted follow-up questions to gather sufficient context"`
  - [x] Identity section: define the skill as a context-aware input clarification engine that prevents low-quality story creation
  - [x] Instructions section: define vagueness detection criteria (input length threshold, missing elements like user role/problem/scope, ambiguous terms), question generation strategy (who/what/where/why/how framework), context-awareness (load `context/index.md` to reference existing project architecture, APIs, domains), and exit condition (sufficient detail gathered or user explicitly confirms)
  - [x] Output Format section: define structured output as a list of clarifying questions with rationale, grouped by category (scope, technical, user-impact)
  - [x] Context Rules section: specify which files the skill reads (`context/index.md`, `context/{relevant-domain}.md`) and that it never writes files directly -- it returns questions to the orchestrating command

- [x] Create synthesis workflow skill (AC: 2, 4, 5, 7, 9)
  - [x] Create directory `scrum_workflow/skills/synthesis/`
  - [x] Create `scrum_workflow/skills/synthesis/SKILL.md` with YAML frontmatter: `name: synthesis`, `role: "perspective-merging"`, `description: "Merges accepted agent perspectives into a coherent updated story file with refined description, acceptance criteria, estimation, and subtasks"`
  - [x] Identity section: define the skill as a coordination engine that synthesizes multi-agent output into a single coherent story specification
  - [x] Instructions section: define merge strategy (process only accepted perspectives, skip rejected), deduplication rules (same finding from multiple agents consolidated with highest severity), conflict resolution (when agents disagree, prioritize Architect on architecture, Dev on feasibility, QA on testability), output assembly (refined description incorporating accepted insights, acceptance criteria list merged from QA proposals and existing criteria, updated estimation based on Dev feasibility assessment, subtask list from all accepted recommendations ordered by dependency)
  - [x] Output Format section: define the exact structure of the updated story sections that the synthesis produces -- updated Description, merged Acceptance Criteria checklist, revised Estimation with justification, ordered Subtask list with dependency annotations
  - [x] Context Rules section: specify inputs (accepted perspectives from `refinement.md`, original `story.md`, feedback decisions) and outputs (updated sections for `story.md`, complete `refinement.md` with all perspectives and feedback record)

- [x] Create readiness-check workflow skill (AC: 3, 4, 5, 8, 9)
  - [x] Create directory `scrum_workflow/skills/readiness-check/`
  - [x] Create `scrum_workflow/skills/readiness-check/SKILL.md` with YAML frontmatter: `name: readiness-check`, `role: "story-completeness-validation"`, `description: "Validates story completeness before implementation begins, producing PASS/FAIL result with specific reasons"`
  - [x] Identity section: define the skill as a plan-then-execute gate that ensures no incomplete specification enters the development phase
  - [x] Instructions section: define validation checklist (description present and non-trivial, acceptance criteria defined with at least one testable criterion, estimation set and non-null, subtasks listed with at least one subtask, no unresolved critical findings from refinement), PASS logic (all criteria met -- assemble `plan.md` from subtasks and update status `refinement` to `ready`), FAIL logic (any criterion unmet -- document specific failures, revert status `refinement` to `draft`, list what needs to be fixed), `plan.md` assembly (ordered subtask sequence from synthesized story, context files list for dev agent, dependency annotations)
  - [x] Output Format section: define PASS/FAIL result structure with: overall result, per-criterion pass/fail detail, failure reasons (if FAIL), and `plan.md` content (if PASS)
  - [x] Context Rules section: specify inputs (`story.md` with status `refinement`, `refinement.md` with synthesized perspectives) and outputs (`plan.md` on PASS, `story.md` status update, PASS/FAIL report)

- [x] Clean up placeholder files (AC: 10)
  - [x] Remove `scrum_workflow/skills/.gitkeep` after skill directories are created
  - [x] Preserve `scrum_workflow/skills/README.md` if it exists

## Dev Notes

This story completes the framework foundation by creating the three workflow skills that the architecture specifies under `scrum_workflow/skills/`. These are **framework-level workflow skills** (generic, shared across projects) as opposed to the **domain skills** (project-specific, generated by `/create-project-context` in `project-root/skills/`). This distinction is documented in Architecture Decision 2.

After this story, the framework directory is fully populated with all structural components: agents (1.2), commands (1.5), workflows (1.5), templates (1.4), context standards (1.1), data (1.4), and now skills (1.6). Epics 2-4 implement the actual command workflows that reference these skill definitions.

### Architecture Context

**Two Types of Skills (Architecture Decision 2):**

| Type | Location | Generated By | Purpose |
|---|---|---|---|
| Workflow Skills | `scrum_workflow/skills/` (framework) | Framework author | Generic, shared across projects |
| Domain Skills | `project-root/skills/` (project) | `/create-project-context` | Project-specific, generated from codebase |

This story creates the Workflow Skills. Domain Skills are generated at runtime by `/create-project-context` (Story 1.5).

**Skills Referenced by Architecture:**

| Skill | Referenced By | Architecture Source |
|---|---|---|
| `guided-mode/SKILL.md` | `/create-ticket` command (Epic 2, Story 2.3) | FR3: vague input detection |
| `synthesis/SKILL.md` | `/refine-ticket` command (Epic 3, Story 3.3) | FR12: merge accepted perspectives |
| `readiness-check/SKILL.md` | Readiness check workflow (Epic 3, Story 3.5) | FR15-17: plan-then-execute gate |

**SKILL.md Format (Architecture Pattern 2 -- Workflow Skill Variant):**

The agent SKILL.md format uses `name`, `display_name`, `role`, `active_in`, `model`, `max_tokens` in frontmatter. Workflow skills use a simpler variant: `name`, `role`, `description` in frontmatter, since skills are not agents and don't need display names, model routing, or activation phase binding.

Body sections remain identical: Identity, Instructions, Output Format, Context Rules -- in that exact order.

**Complete Framework Directory After This Story:**

```
scrum_workflow/
├── config.yaml                     (Story 1.1)
├── agents/                         (Story 1.2)
│   ├── architect.md
│   ├── developer.md
│   └── qa.md
├── commands/                       (Story 1.5)
│   └── create-project-context.md
├── workflows/                      (Story 1.5)
│   └── project-context.md
├── skills/                         (THIS STORY)
│   ├── guided-mode/SKILL.md
│   ├── synthesis/SKILL.md
│   └── readiness-check/SKILL.md
├── templates/                      (Story 1.4)
│   └── [16 template files]
├── context/                        (Story 1.1)
│   ├── architecture-guidelines.md
│   └── standards.md
└── data/                           (Story 1.4)
    └── estimation-reference.yaml
```

**Guided-Mode Skill Technical Details (FR3):**

The guided-mode skill is invoked by `/create-ticket` when input is detected as vague. Vagueness criteria from the architecture:
- Input is too short (fewer than ~20 words)
- Missing key elements: who (user role), what (specific action), where (which part of the system), why (business value)
- Contains ambiguous terms without specificity ("improve", "fix", "update" without scope)

Questions should be context-aware using `context/index.md` to reference the actual project structure. For example, if a project has a backend and frontend, the skill should ask which domain is affected.

**Synthesis Skill Technical Details (FR12):**

The synthesis skill is invoked by the `/refine-ticket` command after the user provides feedback on agent perspectives. Key behaviors:
- Process ONLY accepted perspectives -- rejected perspectives are stored in `refinement.md` for audit but not merged
- Deduplicate overlapping findings from multiple agents (same issue raised by both Architect and Dev)
- Resolve conflicts using domain expertise hierarchy: Architect wins on architecture decisions, Dev wins on feasibility, QA wins on testability
- Produce a coherent story update, not a concatenation of agent outputs
- Must not exceed the target platform's context limits (NFR12)

**Readiness-Check Skill Technical Details (FR15-17):**

The readiness-check skill is embedded in the refinement workflow, running automatically after synthesis. Key behaviors:
- Validates completeness: description present, acceptance criteria defined, estimation set, subtasks listed
- On PASS: assembles `plan.md` from subtasks and sets status to `ready`
- On FAIL: reverts status to `draft` with specific failure reasons
- `plan.md` format follows `scrum_workflow/templates/plan.md` template (created in Story 1.4)
- No implementation can begin without PASS (FR17)

### Project Structure Notes

- Story 1.1 created `scrum_workflow/skills/` with `.gitkeep` placeholder and `README.md`
- Story 1.2 established the SKILL.md format for agents -- workflow skills use a simplified frontmatter variant
- Story 1.4 created the `plan.md` template that the readiness-check skill references for `plan.md` assembly
- Story 1.5 created `scrum_workflow/commands/create-project-context.md` -- the pattern for command files is established
- The `skills/` directory currently has NO actual skill files -- only placeholder files
- Do NOT create domain skills here -- those are generated at runtime by `/create-project-context`
- Do NOT modify any existing framework files (agents, commands, templates, config)

### Previous Story Intelligence

**From Story 1.1 (Framework Directory Structure):**
- Directory structure established: `scrum_workflow/skills/` exists with `.gitkeep` and `README.md`
- Kebab-case files, snake_case YAML fields, convention-over-configuration
- Zero runtime dependencies -- pure YAML/Markdown

**From Story 1.2 (Agent Definitions):**
- SKILL.md format established: frontmatter + 4 body sections (Identity, Instructions, Output Format, Context Rules)
- Agent frontmatter fields: `name`, `display_name`, `role`, `active_in`, `model`, `max_tokens`
- Workflow skill frontmatter is simpler: `name`, `role`, `description` (no display_name, model, active_in, max_tokens)
- Table-based output format for findings -- synthesis skill must understand this format to merge perspectives

**From Story 1.3 (Platform Adapter Contract):**
- Path consistency is critical -- ensure all file references use consistent path patterns
- No workflow logic in adapters -- skills are framework-level, not adapter-level

**From Story 1.4 (Output Templates):**
- Templates define exact schema for output files: `refinement.md`, `plan.md` are directly relevant
- `plan.md` template sections: Execution Plan (ordered subtask sequence), Context Files, Dependencies
- `refinement.md` template sections: Agent Perspectives (table-based), Feedback Record (dedicated section per NFR16)
- Synthesis skill output must conform to the `refinement.md` template structure
- Readiness-check `plan.md` output must conform to the `plan.md` template structure

**From Story 1.5 (/create-project-context):**
- SKILL.md command format established -- workflow skills follow a different frontmatter variant
- Two types of skills distinction confirmed: workflow skills (framework) vs. domain skills (project)
- Path resolution approach: references within framework files use relative paths from framework root

**Key Learnings from Previous Stories:**
- SKILL.md format is strict: field order and section order must match exactly
- Path consistency between files is critical (Story 1.3 review caught inconsistencies)
- Templates define structure; runtime commands fill in values
- `.gitkeep` files should be removed after actual content is created (Story 1.4 pattern)
- README.md files should be preserved for documentation

### Testing Standards

**Verification Checklist:**
1. `scrum_workflow/skills/guided-mode/SKILL.md` exists with correct SKILL.md format
2. `scrum_workflow/skills/synthesis/SKILL.md` exists with correct SKILL.md format
3. `scrum_workflow/skills/readiness-check/SKILL.md` exists with correct SKILL.md format
4. Each skill has YAML frontmatter with exactly 3 fields: `name`, `role`, `description`
5. Each skill body has exactly 4 sections in order: Identity, Instructions, Output Format, Context Rules
6. Guided-mode skill defines vagueness detection criteria and question generation
7. Synthesis skill defines perspective merging with deduplication and conflict resolution
8. Readiness-check skill defines completeness criteria with PASS/FAIL logic
9. All files use kebab-case naming (directories and filenames)
10. All YAML fields use snake_case naming
11. `.gitkeep` removed from `scrum_workflow/skills/`
12. `README.md` preserved in `scrum_workflow/skills/`
13. No domain skill files created (those are runtime-generated)
14. No existing framework files modified

**Manual Testing:**
- Verify each SKILL.md parses as valid YAML frontmatter + Markdown
- Verify frontmatter field order matches: `name`, `role`, `description`
- Verify body section order matches: Identity, Instructions, Output Format, Context Rules
- Verify guided-mode references `context/index.md` in Context Rules
- Verify synthesis references `refinement.md` template structure in Output Format
- Verify readiness-check references `plan.md` template structure in Output Format
- Verify no cross-references to non-existent files

### References

**Source Documents:**
- Workflow Skills: [Source: _bmad-output/planning-artifacts/architecture.md#Complete-Framework-Directory-Structure]
- Two Types of Skills: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-2-Context-File-Structure]
- Guided Mode (FR3): [Source: _bmad-output/planning-artifacts/epics.md#Story-23-Guided-Mode-for-Vague-Input]
- Synthesis (FR12): [Source: _bmad-output/planning-artifacts/epics.md#Story-33-Perspective-Synthesis-Story-Update]
- Readiness Check (FR15-17): [Source: _bmad-output/planning-artifacts/epics.md#Story-35-Readiness-Check-Gate]
- SKILL.md Structure Patterns: [Source: _bmad-output/planning-artifacts/architecture.md#2-SKILL-md-Structure-Patterns]
- Write Boundary Rules: [Source: _bmad-output/planning-artifacts/architecture.md#6-Write-Boundary-Rules]
- Agent Output Format: [Source: _bmad-output/planning-artifacts/architecture.md#3-Agent-Output-Format]
- Complete Framework Structure: [Source: _bmad-output/planning-artifacts/architecture.md#Complete-Framework-Directory-Structure]

**Related Stories:**
- Story 1.1: Created `scrum_workflow/skills/` directory with placeholders
- Story 1.2: Established SKILL.md format (agent variant)
- Story 1.4: Created `refinement.md` and `plan.md` templates that skills reference
- Story 2.3: `/create-ticket` guided mode will USE the `guided-mode/SKILL.md` created here
- Story 3.3: `/refine-ticket` synthesis will USE the `synthesis/SKILL.md` created here
- Story 3.5: Readiness check workflow will USE the `readiness-check/SKILL.md` created here

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No debug issues encountered. All three SKILL.md files created and validated in a single pass.

### Completion Notes List

- Created `guided-mode/SKILL.md` -- context-aware vague input clarification skill with vagueness detection criteria (length threshold, missing elements, ambiguous terms), question generation using who/what/where/why/how framework, context-aware questioning via `context/index.md`, and trigger threshold logic (AC 1, 4, 5, 6, 9)
- Created `synthesis/SKILL.md` -- perspective merging skill with accept/reject filtering, deduplication rules (highest severity wins), conflict resolution hierarchy (Architect on architecture, Dev on feasibility, QA on testability), and output assembly for refined description, merged AC, revised estimation, ordered subtasks (AC 2, 4, 5, 7, 9)
- Created `readiness-check/SKILL.md` -- story completeness validation gate with 5-criterion checklist, PASS logic (assemble plan.md, status refinement->ready), FAIL logic (document failures, status refinement->draft), and plan.md assembly following template structure (AC 3, 4, 5, 8, 9)
- Removed `.gitkeep` placeholder from `scrum_workflow/skills/`, preserved `README.md` (AC 10)
- All files validated: correct YAML frontmatter (3 fields: name, role, description), correct body section order (Identity, Instructions, Output Format, Context Rules), kebab-case naming, snake_case YAML fields

### Change Log

- 2026-03-25: Created three workflow skill definitions (guided-mode, synthesis, readiness-check) and removed .gitkeep placeholder

### File List

- `scrum_workflow/skills/guided-mode/SKILL.md` (new)
- `scrum_workflow/skills/synthesis/SKILL.md` (new)
- `scrum_workflow/skills/readiness-check/SKILL.md` (new)
- `scrum_workflow/skills/.gitkeep` (deleted)
