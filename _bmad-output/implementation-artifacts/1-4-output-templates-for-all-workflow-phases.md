# Story 1.4: Output Templates for All Workflow Phases

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want standardized output templates for every workflow artifact,
So that all commands produce consistent, schema-compliant files.

## Acceptance Criteria

1. **Given** the framework directory structure exists
   **When** the templates are created in `scrum_workflow/templates/`
   **Then** the following workflow templates exist: `story.md`, `refinement.md`, `plan.md`, `review.md`, `approval.md`

2. **And** `story.md` template includes YAML frontmatter with fields: `schema_version`, `ticket`, `title`, `status`, `estimation`, `created`, `updated`

3. **And** the following context templates exist: `context-index.md`, `context-frontend.md`, `context-backend.md`, `context-testing.md`, `context-devops.md`, `context-architecture.md`

4. **And** the following skill templates exist: `skill-backend.md`, `skill-frontend.md`, `skill-testing.md`, `skill-devops.md`, `skill-project-architect.md`

5. **And** all templates use the documented Markdown conventions (single `#` title, `##` sections, `###` subsections, `-` for lists)

6. **And** all YAML frontmatter in templates follows the documented conventions (quoted strings with special chars, explicit `null`, ISO 8601 dates)

7. **And** `estimation-reference.yaml` exists in `scrum_workflow/data/` with estimation guidance for story creation (FR4)

## Tasks / Subtasks

- [x] Create workflow output templates (AC: 1, 2, 5, 6)
  - [x] Create `scrum_workflow/templates/story.md` with YAML frontmatter schema (`schema_version: 1`, `ticket`, `title`, `status: draft`, `estimation: null`, `created`, `updated`) and Markdown body sections (Description, Acceptance Criteria, Subtasks)
  - [x] Create `scrum_workflow/templates/refinement.md` with sections: Agent Perspectives (Architect, Developer, QA each using table-based format), Feedback Record (dedicated section per NFR16)
  - [x] Create `scrum_workflow/templates/plan.md` with sections: Execution Plan (ordered subtask sequence), Context Files (which files dev agent loads), Dependencies
  - [x] Create `scrum_workflow/templates/review.md` with sections: Summary table (Total, Critical, Major, Minor), Findings table (columns: #, Finding, Severity, AC Reference, Suggested Fix)
  - [x] Create `scrum_workflow/templates/approval.md` with sections: Decision (approved/rejected), Approver, Date, Comments, Review References
- [x] Create context templates for /create-project-context (AC: 3, 5, 6)
  - [x] Create `scrum_workflow/templates/context-index.md` with discovery index structure: domains list, agent loading map table, generated date
  - [x] Create `scrum_workflow/templates/context-frontend.md` with sections: Framework, Components, State Management, Routing, Conventions
  - [x] Create `scrum_workflow/templates/context-backend.md` with sections: Language, Framework, API Design, Database, Conventions
  - [x] Create `scrum_workflow/templates/context-testing.md` with sections: Test Frameworks, Coverage Strategy, CI Integration, Conventions
  - [x] Create `scrum_workflow/templates/context-devops.md` with sections: CI/CD, Docker, Cloud, Deployment, Monitoring
  - [x] Create `scrum_workflow/templates/context-architecture.md` with sections: Key Decisions, Patterns, Dependencies, Constraints
- [x] Create skill templates for /create-project-context (AC: 4, 5, 6)
  - [x] Create `scrum_workflow/templates/skill-backend.md` in SKILL.md format with frontmatter (name, role, description) and sections: Identity, Instructions, Output Format, Context Rules
  - [x] Create `scrum_workflow/templates/skill-frontend.md` in SKILL.md format following same structure
  - [x] Create `scrum_workflow/templates/skill-testing.md` in SKILL.md format following same structure
  - [x] Create `scrum_workflow/templates/skill-devops.md` in SKILL.md format following same structure
  - [x] Create `scrum_workflow/templates/skill-project-architect.md` in SKILL.md format following same structure
- [x] Create estimation reference data file (AC: 7)
  - [x] Create `scrum_workflow/data/estimation-reference.yaml` with story point scale, complexity factors, and estimation guidance
- [x] Remove placeholder files (cleanup)
  - [x] Remove `scrum_workflow/templates/.gitkeep` after templates are created
  - [x] Remove `scrum_workflow/data/.gitkeep` after data file is created
  - [x] Keep `scrum_workflow/templates/README.md` as documentation

## Dev Notes

This story creates all output templates that downstream commands depend on. The `/create-project-context` command (Story 1.5) uses context and skill templates. The `/create-ticket` command (Epic 2) uses the story template. The `/refine-ticket` command (Epic 3) uses the refinement template. The `/dev-story` command (Epic 4) uses the plan, review, and approval templates. This is the last "foundational" story before the framework begins executing actual workflows.

### Architecture Context

**Template Purpose in the Framework** (from Architecture):
- Templates define the **exact schema** for all workflow output files
- `/create-project-context` fills context templates with facts collected from shell commands and writes to `project-root/context/*.md`
- `/create-ticket` fills the story template to create `sprints/SW-XXX/story.md`
- Readiness check generates `plan.md` from the plan template
- Review generates `review-N.md` from the review template
- Approval generates `approval.md` from the approval template

**Story File Schema (Architecture Decision 3):**
The story template must implement the MVP schema exactly:
```yaml
---
schema_version: 1
ticket: SW-XXX
title: "Story Title"
status: draft
estimation: null
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**State Machine** (story status transitions):
- `draft` -> `refinement` (trigger: /refine-ticket)
- `refinement` -> `ready` (guard: readiness check PASS)
- `refinement` -> `draft` (guard: readiness check FAIL)
- `ready` -> `in-dev` (guard: status == ready, trigger: /dev-story)
- `in-dev` -> `in-review` (trigger: /dev-story review)
- `in-review` -> `done` (guard: explicit user approval, FR28)

**Agent Output Format (Architecture Pattern 3):**
All agent refinement perspectives use table-based format:
- `## [Agent-Name] Perspective` header
- Findings table: columns `#`, `Finding`, `Severity`, `Category`
- Recommendations list
- Proposed Acceptance Criteria checklist

**Review Findings Format (Architecture Pattern 3):**
- Summary table: columns `Total`, `Critical`, `Major`, `Minor`
- Findings table: columns `#`, `Finding`, `Severity`, `AC Reference`, `Suggested Fix`

**Context File Structure (Architecture Decision 2):**
- Sharded context with index-based discovery
- Each agent loads only its relevant domain files
- `index.md` contains agent loading map
- Only files for detected domains are generated (no empty files)

**Agent Loading Map** (defined in context-index.md template):
| Agent | Loads |
|---|---|
| Orchestrator | index.md only |
| Architect | index.md, architecture.md, backend.md, frontend.md |
| Developer | index.md, {story-relevant-domain}.md |
| QA | index.md, testing.md, {story-relevant-domain}.md |

**Skill Templates** (Architecture):
- Skills are project-specific, generated by `/create-project-context`
- Each skill follows SKILL.md format: YAML frontmatter + Identity/Instructions/Output Format/Context Rules
- Skills provide domain-specific expertise (e.g., "You work with FastAPI + PostgreSQL...")
- Template defines the skeleton; `/create-project-context` fills in project-specific facts

**Estimation Reference** (FR4):
- Used by `/create-ticket` to generate initial story estimation
- Must define story point scale and complexity factors
- Architecture does not prescribe exact scale — implement a practical reference

### Project Structure Notes

**Alignment with Previous Stories (1.1-1.3):**
- Story 1.1 created `scrum_workflow/templates/` directory with README.md and .gitkeep
- Story 1.1 created `scrum_workflow/data/` directory with README.md and .gitkeep
- Story 1.2 created agent definitions establishing SKILL.md format conventions
- Story 1.3 created the Claude Code adapter layer
- This story populates templates/ and data/ with actual content

**Files to Create:**
```
scrum_workflow/
├── templates/
│   ├── story.md                  ← Story file template (FR30-33)
│   ├── refinement.md             ← Refinement output template
│   ├── plan.md                   ← Execution plan template
│   ├── review.md                 ← Review findings template
│   ├── approval.md               ← Approval record template
│   ├── context-index.md          ← Template for context/index.md
│   ├── context-frontend.md       ← Template for context/frontend.md
│   ├── context-backend.md        ← Template for context/backend.md
│   ├── context-testing.md        ← Template for context/testing.md
│   ├── context-devops.md         ← Template for context/devops.md
│   ├── context-architecture.md   ← Template for context/architecture.md
│   ├── skill-backend.md          ← Template for project skill: backend
│   ├── skill-frontend.md         ← Template for project skill: frontend
│   ├── skill-testing.md          ← Template for project skill: testing
│   ├── skill-devops.md           ← Template for project skill: devops
│   └── skill-project-architect.md ← Template for project skill: architecture
├── data/
│   └── estimation-reference.yaml ← FR4: estimation guidance
└── [existing files unchanged]
```

**Detected Conflicts or Variances:**
- `scrum_workflow/templates/README.md` already exists and documents the expected structure -- keep it
- `.gitkeep` files in `templates/` and `data/` should be removed after real files are added

### Technical Requirements

**File Format Standards:**
- All template files: Markdown format
- All YAML frontmatter: snake_case fields, quoted strings with special chars, explicit `null` for empty values, ISO 8601 dates
- File naming: kebab-case (story.md, context-index.md, skill-backend.md)
- Heading hierarchy: `#` document title, `##` sections, `###` subsections
- Lists: `-` prefix (not `*` or `+`)
- Code blocks: always with language tag

**Template Variable Convention:**
- Use `{{variable_name}}` for values that `/create-project-context` or other commands fill in at runtime
- Use placeholder comments like `<!-- Fill from Phase A analysis -->` to guide the generation agent
- Keep templates concise -- they define structure, not content

**Schema Version:**
- Story template MUST include `schema_version: 1` in frontmatter
- This enables backwards-compatible evolution per NFR15
- New fields are always optional with sensible defaults

**Estimation Reference Format:**
- YAML format (not CSV -- CSV was eliminated per Architecture)
- Must be parseable by AI agents without special tooling
- Include story point scale (1, 2, 3, 5, 8, 13) with descriptions
- Include complexity factors the agent should consider

**Validation Rules:**
- Every template must have valid YAML frontmatter (where applicable)
- Story template frontmatter must include all 7 required fields
- Context templates must include YAML frontmatter with at minimum `domain` and `generated` fields
- Skill templates must follow SKILL.md format exactly (name, role in frontmatter; Identity, Instructions, Output Format, Context Rules in body)
- Refinement template must have a dedicated feedback section separate from perspectives (NFR16)

### Testing Standards

**Verification Checklist:**
1. All 16 template files exist in `scrum_workflow/templates/`
2. `estimation-reference.yaml` exists in `scrum_workflow/data/`
3. `story.md` template has correct 7-field YAML frontmatter
4. All templates follow Markdown conventions (heading hierarchy, list format)
5. All YAML frontmatter uses snake_case field names
6. Refinement template has dedicated feedback section (NFR16)
7. Review template has table-based findings format matching architecture spec
8. Context templates have YAML frontmatter with `domain` field
9. Skill templates follow SKILL.md format (frontmatter fields + 4 body sections)
10. `estimation-reference.yaml` is valid YAML with story point scale
11. `.gitkeep` files removed from `templates/` and `data/`

**Manual Testing:**
- Verify each template can be parsed as valid Markdown
- Verify YAML frontmatter in all templates is valid YAML
- Verify story template frontmatter matches the schema from Architecture Decision 3
- Verify agent output format in refinement template matches Architecture Pattern 3
- Verify review findings format in review template matches Architecture Pattern 3

### Previous Story Intelligence

**From Story 1.1 (Framework Directory Structure):**
- Created `scrum_workflow/templates/` with README.md and .gitkeep placeholder
- Created `scrum_workflow/data/` with README.md and .gitkeep placeholder
- Established kebab-case file naming and snake_case YAML field conventions
- Framework is pure YAML/Markdown with zero runtime dependencies
- `config.yaml` established at `scrum_workflow/config.yaml`

**From Story 1.2 (Agent Definitions):**
- SKILL.md format established: YAML frontmatter (`name`, `display_name`, `role`, `active_in`, `model`, `max_tokens`) + Markdown body (Identity, Instructions, Output Format, Context Rules)
- Table-based refinement perspective format: Findings table + Recommendations + Proposed AC
- Three MVP agents: architect.md, developer.md, qa.md

**From Story 1.3 (Platform Adapter Contract):**
- Claude Code adapter created in `.claude/` with skill registration files
- Adapter contract: instruction file + command registration, no workflow logic
- Platform switching via config.yaml `platform` field only
- `framework_path` in project config.yaml for absolute path references
- Review found path inconsistency issues -- ensure template references use consistent paths

**Key Learnings:**
- All framework files are declarative YAML/Markdown -- no compiled code
- SKILL.md format is the standard for agents, commands, and skills
- Table-based output format enables consistent parsing and synthesis
- Templates define structure; runtime commands fill in values
- Previous stories established conventions this story must follow exactly

### References

**Source Documents:**
- Story File Schema & State Machine: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-3-Story-File-Schema-State-Machine]
- Context File Structure: [Source: _bmad-output/planning-artifacts/architecture.md#Decision-2-Context-File-Structure]
- Agent Output Format: [Source: _bmad-output/planning-artifacts/architecture.md#3-Agent-Output-Format]
- Review Finding Format: [Source: _bmad-output/planning-artifacts/architecture.md#3-Agent-Output-Format]
- SKILL.md Structure Patterns: [Source: _bmad-output/planning-artifacts/architecture.md#2-SKILL-md-Structure-Patterns]
- Markdown & YAML Conventions: [Source: _bmad-output/planning-artifacts/architecture.md#4-Markdown-YAML-Conventions]
- Complete Framework Directory Structure: [Source: _bmad-output/planning-artifacts/architecture.md#Complete-Framework-Directory-Structure]
- Epic 1 Story 1.4: [Source: _bmad-output/planning-artifacts/epics.md#Story-14-Output-Templates-for-All-Workflow-Phases]
- FR4 Story Estimation: [Source: _bmad-output/planning-artifacts/epics.md#FR4]
- FR30-33 Story File Management: [Source: _bmad-output/planning-artifacts/epics.md#FR30-FR33]
- NFR15 Schema Compatibility: [Source: _bmad-output/planning-artifacts/epics.md#NFR15]
- NFR16 Feedback Data Integrity: [Source: _bmad-output/planning-artifacts/epics.md#NFR16]
- Standards & Conventions: [Source: scrum_workflow/context/standards.md]

**Related Stories:**
- Story 1.1: Created templates/ and data/ directories (foundation)
- Story 1.2: Established SKILL.md format and table-based output conventions
- Story 1.3: Created Claude Code adapter referencing framework commands
- Story 1.5: Will use context and skill templates for /create-project-context
- Story 2.1: Will use story template schema and state machine
- Story 2.2: Will use story template for /create-ticket
- Story 3.2: Will use refinement template for agent perspectives
- Story 4.2: Will use review template for structured findings
- Story 4.3: Will use approval template for human sign-off

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context) (via bmad-dev-story skill)

### Debug Log References

None - implementation completed without errors.

### Completion Notes List

- Story creation completed successfully on 2026-03-25
- All 16 template files specified with exact content requirements
- Estimation reference data file specified with YAML format
- Template schemas extracted from Architecture Decisions 2, 3, and Implementation Patterns 2, 3
- SKILL.md format conventions carried forward from Story 1.2
- Table-based output formats specified for refinement and review templates
- Context template structure matches Architecture Decision 2 sharded context design
- Skill template structure follows established SKILL.md format from Story 1.2
- Previous story learnings incorporated (path consistency, naming conventions)
- Implementation completed on 2026-03-25
- All 16 template files created in `scrum_workflow/templates/` with valid YAML frontmatter and Markdown structure
- `estimation-reference.yaml` created in `scrum_workflow/data/` with story point scale (1,2,3,5,8,13), complexity factors, and estimation guidelines
- story.md template includes all 7 required frontmatter fields (schema_version: 1, ticket, title, status: draft, estimation: null, created, updated)
- All templates follow Markdown conventions: `#` title, `##` sections, `###` subsections, `-` for lists
- All YAML frontmatter uses snake_case field names and quoted strings with special chars
- refinement.md includes dedicated Feedback Record section per NFR16
- review.md includes Summary table (Total, Critical, Major, Minor) and Findings table with AC Reference column
- Context templates include `domain` and `generated` frontmatter fields
- Skill templates follow SKILL.md format: frontmatter (name, role, description) + body (Identity, Instructions, Output Format, Context Rules)
- Fixed review.md YAML frontmatter: unquoted `review_number` template variable caused parsing error
- `.gitkeep` files removed from templates/ and data/
- `README.md` preserved in templates/ as documentation
- All validations passed via Python validation script (YAML parsing, field checks, structure verification)

### Implementation Plan

1. Created 5 workflow templates (story.md, refinement.md, plan.md, review.md, approval.md) with schema-compliant YAML frontmatter and Markdown structure
2. Created 6 context templates (context-index.md, context-frontend.md, context-backend.md, context-testing.md, context-devops.md, context-architecture.md) with domain/generated frontmatter
3. Created 5 skill templates (skill-backend.md, skill-frontend.md, skill-testing.md, skill-devops.md, skill-project-architect.md) following SKILL.md format
4. Created estimation-reference.yaml with Modified Fibonacci scale, complexity factors, and estimation guidelines
5. Removed .gitkeep placeholders; kept README.md documentation
6. Validated all files pass YAML parsing, field presence, and convention checks

### File List

**Story File:**
- `_bmad-output/implementation-artifacts/1-4-output-templates-for-all-workflow-phases.md`

**Files Created:**
- `scrum_workflow/templates/story.md` - Story file template with YAML frontmatter schema
- `scrum_workflow/templates/refinement.md` - Refinement output template with agent perspectives and feedback
- `scrum_workflow/templates/plan.md` - Execution plan template
- `scrum_workflow/templates/review.md` - Review findings template with table-based format
- `scrum_workflow/templates/approval.md` - Approval record template
- `scrum_workflow/templates/context-index.md` - Context discovery index template
- `scrum_workflow/templates/context-frontend.md` - Frontend context template
- `scrum_workflow/templates/context-backend.md` - Backend context template
- `scrum_workflow/templates/context-testing.md` - Testing context template
- `scrum_workflow/templates/context-devops.md` - DevOps context template
- `scrum_workflow/templates/context-architecture.md` - Architecture context template
- `scrum_workflow/templates/skill-backend.md` - Backend skill template
- `scrum_workflow/templates/skill-frontend.md` - Frontend skill template
- `scrum_workflow/templates/skill-testing.md` - Testing skill template
- `scrum_workflow/templates/skill-devops.md` - DevOps skill template
- `scrum_workflow/templates/skill-project-architect.md` - Architecture skill template
- `scrum_workflow/data/estimation-reference.yaml` - Story point estimation guidance

**Files Removed:**
- `scrum_workflow/templates/.gitkeep` - Placeholder no longer needed
- `scrum_workflow/data/.gitkeep` - Placeholder no longer needed

**Files Unchanged:**
- `scrum_workflow/templates/README.md` - Documentation kept as specified

### Change Log

- 2026-03-25: Created all 16 template files and estimation-reference.yaml; removed .gitkeep placeholders; all acceptance criteria satisfied
