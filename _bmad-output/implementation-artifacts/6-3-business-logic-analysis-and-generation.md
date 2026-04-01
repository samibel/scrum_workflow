# Story 6.3: Business Logic Analysis & `business-logic.md` Generation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the agent to identify and document all business rules, validations, and decision logic in my codebase,
so that I have a comprehensive reference of what the system enforces and why.

## Acceptance Criteria

1. **Grep-based business logic scanning**: The agent scans the codebase using Grep patterns to identify business rules (language-agnostic, no AST):
   - Conditional logic with domain terms (`if/else`, `switch/case`, `match`)
   - Validation functions (`validate*`, `check*`, `ensure*`, `assert*`, `is_valid*`)
   - Guard clauses (`throw`, `reject`, `deny`, `forbidden`, `unauthorized`, `abort`)
   - Policy/Rule/Strategy patterns (`*Policy`, `*Rule`, `*Strategy`, `*Validator`)
   - Constants and enums with business meaning (`MAX_*`, `MIN_*`, `ALLOWED_*`, `STATUS_*`)

2. **Output template exists**: `scrum_workflow/templates/business-logic.md` exists as the output template with sections: Overview, Business Rules (grouped by domain area), Validation Rules, Guard Clauses & Access Control, Business Constants & Configuration

3. **Generated output follows template**: The generated `docs/generated/business-logic.md` follows the template structure from AC #2

4. **Rule documentation completeness**: Each documented rule includes:
   - Rule name/description
   - Where it is enforced (file:line reference)
   - What it enforces (plain language)
   - A Mermaid `flowchart` showing the decision tree for complex rules

5. **Domain area grouping**: Rules are grouped by domain area (e.g., "Authentication", "Billing", "Permissions") based on file paths and context

6. **Exclusion of non-business logic**: The agent does NOT document infrastructure logic (logging, error handling, database queries) -- only business-domain logic

## Tasks / Subtasks

- [x] Task 1: Create the `business-logic.md` output template (AC: #2)
  - [x] 1.1: Create `scrum_workflow/templates/business-logic.md` as a pure Markdown output template (no YAML frontmatter) following the output artifact convention from `refinement.md`, `review.md`, `approval.md`
  - [x] 1.2: Template must include these sections: Overview, Business Rules (grouped by domain area), Validation Rules, Guard Clauses & Access Control, Business Constants & Configuration
  - [x] 1.3: Each section must show the expected entry format: rule name, description, file:line reference, plain-language explanation, and Mermaid `flowchart` placeholder for complex rules
  - [x] 1.4: Include placeholder comments (e.g., `<!-- Fill from documentarian analysis -->`) so the documentarian agent knows where to inject content

- [x] Task 2: Implement business logic scanning in workflow Step 5.1 (AC: #1, #6)
  - [x] 2.1: Update `scrum_workflow/workflows/project-documentation.md` Step 5.1 to replace the "See Story 6.3" placeholder with concrete implementation instructions
  - [x] 2.2: Define the Grep pattern set for business rule detection:
    - Conditional logic: `if\s.*\b(user|account|order|payment|permission|role|status|limit|quota|threshold)\b`, `switch.*case`, `match\s`
    - Validations: `validate`, `check`, `ensure`, `assert`, `is_valid`, `isValid`
    - Guards: `throw`, `reject`, `deny`, `forbidden`, `unauthorized`, `abort`
    - Patterns: `Policy`, `Rule`, `Strategy`, `Validator`
    - Constants: `MAX_`, `MIN_`, `ALLOWED_`, `STATUS_`, `LIMIT_`
  - [x] 2.3: Define the exclusion filter: skip files in `node_modules/`, `dist/`, `build/`, `.git/`, `vendor/`, `__pycache__/`, `docs/generated/`, `scrum_workflow/`, test files (`*.test.*`, `*.spec.*`, `test_*`, `*_test.*`)
  - [x] 2.4: Define the domain-area grouping logic: infer domain area from file path (e.g., `src/auth/` -> "Authentication", `src/billing/` -> "Billing") and fall back to directory name when no semantic match

- [x] Task 3: Implement Mermaid diagram generation instructions (AC: #4)
  - [x] 3.1: Add instructions for generating Mermaid `flowchart` diagrams for rules with branching/decision logic (if/else chains, switch/case, guard sequences)
  - [x] 3.2: Simple single-condition rules do NOT need a diagram -- only multi-branch or complex decision trees
  - [x] 3.3: Each Mermaid block must be fenced with ` ```mermaid ` and include a descriptive comment above it

- [x] Task 4: Implement source reference format (AC: #4)
  - [x] 4.1: Every documented rule must include `[Source: path/to/file.ext:LINE]` reference
  - [x] 4.2: If a rule spans multiple files, include all file:line references
  - [x] 4.3: Source references use relative paths from project root (not absolute paths)

- [x] Task 5: Integration with workflow Step 5.1 (AC: #3)
  - [x] 5.1: After analysis, the documentarian writes `docs/generated/business-logic.md` using the template from Task 1 filled with discovered rules
  - [x] 5.2: The generated file must have an Overview section summarizing total rules found, domain areas detected, and analysis timestamp
  - [x] 5.3: If no business logic is found (empty codebase or pure infrastructure), write a minimal document stating "No business logic detected" rather than an empty file

## Dev Notes

### Architecture Compliance

- **Three-Layer Separation**: The template goes in Framework Layer (`scrum_workflow/templates/business-logic.md`). The generated output goes in Project Layer (`docs/generated/business-logic.md`). NEVER put generated output inside `scrum_workflow/`.
- **Template-Driven Output**: The documentarian agent uses the template to structure its output. The template defines WHAT sections exist. The agent's Instructions section defines HOW to fill them. Do not duplicate analysis methodology in the template.
- **Language-Agnostic (FR69 principle)**: All scanning uses Glob and Grep. No AST parsing, no tree-sitter, no language-specific tooling. This is a deliberate design choice to support any programming language.
- **Write Boundaries**: This story only writes to `scrum_workflow/templates/business-logic.md` (framework file, created once) and modifies `scrum_workflow/workflows/project-documentation.md` (replacing Step 5.1 placeholder). At runtime the workflow writes to `docs/generated/business-logic.md`.
- **NFR4**: Adding a new template = new Markdown file. Zero code changes.
- **NFR9**: No runtime dependencies. Pure file-based interpretation by the AI platform.

### Existing Template Pattern Reference

All templates in `scrum_workflow/templates/` are plain Markdown files. Some have YAML frontmatter (e.g., `story.md` has `schema_version`, `ticket`, `title`, `status`), others are pure Markdown (e.g., `refinement.md`). The `business-logic.md` template should be **pure Markdown without frontmatter** since it is a documentation output template, not a stateful artifact like a story file.

Existing template files for reference:
- `scrum_workflow/templates/story.md` -- YAML frontmatter + sections (stateful artifact)
- `scrum_workflow/templates/refinement.md` -- Markdown template (output artifact)
- `scrum_workflow/templates/review.md` -- Markdown template (output artifact)
- `scrum_workflow/templates/approval.md` -- Markdown template (output artifact)

The `business-logic.md` template follows the output artifact pattern (like `refinement.md`, `review.md`), NOT the stateful artifact pattern (like `story.md`).

### Documentarian Agent Pattern Application

From `scrum_workflow/agents/documentarian.md`:
- The agent's **Instructions Section 2** defines the business rule grep patterns: `validate*`, `check*`, `ensure*`, `*Policy`, `*Rule`, `*Strategy`, `*Validator` for rules; `throw`, `reject`, `deny`, `forbidden`, `unauthorized` for guards
- The agent's **Output Format > business-logic.md** defines required sections: Business Rules (grouped by domain area), Validation Rules, Guard Clauses -- each with description, file:line, and `flowchart` Mermaid for complex rules
- The agent explicitly **excludes** infrastructure code, logging, error handling plumbing, deployment, CI/CD, API surface
- The template created in this story MUST match the Output Format specification in the agent definition exactly

**ANTI-PATTERN WARNING**: Do NOT create analysis logic in the template file. The template is a structural skeleton. Analysis methodology lives in `scrum_workflow/agents/documentarian.md` Instructions section. The workflow Step 5.1 orchestrates WHEN analysis happens. The template defines the OUTPUT STRUCTURE.

### Workflow Step 5.1 Update Pattern

Story 6.2 created the workflow skeleton with `**See Story 6.3**` placeholder in Step 5.1. This story replaces that placeholder with concrete instructions. The update must:
1. Keep the existing Step 5.1 heading and numbered list structure
2. Replace the placeholder reference with detailed implementation steps
3. Reference the new template: `scrum_workflow/templates/business-logic.md`
4. Reference the agent's grep patterns from `scrum_workflow/agents/documentarian.md` Instructions Section 2
5. NOT duplicate the full agent instructions -- reference them

The workflow drives WHEN and WHERE. The agent drives HOW. The template drives WHAT STRUCTURE.

### Domain Area Grouping Strategy

Rules should be grouped by domain area using this inference strategy:
1. **Path-based inference**: Extract domain area from directory structure (e.g., `src/auth/` -> "Authentication", `src/payments/` -> "Payments", `lib/permissions/` -> "Permissions")
2. **File-name inference**: Use file name when path is flat (e.g., `auth.ts` -> "Authentication", `billing-rules.py` -> "Billing")
3. **Fallback**: Use the top-level directory name as the domain area if no semantic match
4. **Ungrouped**: Rules that cannot be categorized go in an "Other / Uncategorized" section

This grouping is project-agnostic and works with any directory structure.

### Mermaid Diagram Guidelines

- **Only for complex rules**: Single-condition validations (e.g., `if (!user) throw`) do NOT need a diagram. Multi-branch decision trees, cascading guards, and rules with 3+ branches DO need a diagram.
- **Diagram type**: Always `flowchart TD` (top-down) for decision trees. Use `flowchart LR` only if the decision is purely sequential/linear.
- **Naming**: Use descriptive node labels, not code variables. E.g., "User authenticated?" not "if (user)".
- **Format**: Each diagram in a fenced code block with ` ```mermaid ` language tag.

### Previous Story Intelligence (Stories 6.1 and 6.2)

**From Story 6.1 (Documentarian Agent Definition)**:
- Agent created at `scrum_workflow/agents/documentarian.md` -- defines analysis methodology and output format
- Agent uses `claude-sonnet-4` model with `max_tokens: 4000`
- Agent's Output Format section defines the exact structure for `business-logic.md` -- the template MUST match
- Agent's Instructions Section 2 lists grep patterns for business rules -- the workflow MUST reference these, not redefine them
- `active_in: [create-project-docs]` references the command this workflow serves
- ANTI-PATTERN from 6.1: Do NOT put analysis logic in the template. Template = structure. Agent = methodology.

**From Story 6.2 (Command & Workflow Skeleton)**:
- Command at `scrum_workflow/commands/create-project-docs.md` with trigger `/scrum-create-project-docs`
- Workflow at `scrum_workflow/workflows/project-documentation.md` with Step 5.1 placeholder for business logic analysis
- Adapter skill at `.claude/skills/create-project-docs.md`
- Output directory is `docs/generated/` relative to project root
- Step 4 ensures output directory exists before Steps 5-7 write files
- Write Boundaries: may write `docs/generated/business-logic.md` and `docs/generated/.scan-state.json`
- Workflow Step 5.1 currently says `**See Story 6.3** for full business logic analysis implementation details.` -- this placeholder must be replaced
- All three review findings from 6.2 were fixed (step ordering, scan-state reference, Write Boundaries phrasing)

### Git Intelligence

- Recent commits show Epic 5 (installer) complete, Epic 6 Stories 6.1 and 6.2 done
- Project is on `temp_main` branch
- No output templates for business-logic/workflows/domain-model exist yet (this story creates the first one)
- The three parallel stories (6.3, 6.4, 6.5) each create one template and implement one workflow step

### Scope Boundaries

**IN scope for this story**:
- Create `scrum_workflow/templates/business-logic.md` output template
- Update `scrum_workflow/workflows/project-documentation.md` Step 5.1 with concrete implementation (replace "See Story 6.3" placeholder)

**OUT of scope (other stories)**:
- `workflows.md` template and workflow Step 5.2 -- Story 6.4
- `domain-model.md` template and workflow Step 5.3 -- Story 6.5
- Incremental update mode logic -- Story 6.6
- Scan state management and resume -- Story 6.7
- Modifying the documentarian agent definition -- completed in Story 6.1
- Modifying the command file or adapter skill -- completed in Story 6.2
- Creating `docs/generated/` directory -- that is runtime behavior in workflow Step 4

### Project Structure Notes

- Template file location: `scrum_workflow/templates/business-logic.md` (NEW) -- alongside existing templates like `story.md`, `refinement.md`, `review.md`, `approval.md`
- Workflow file modification: `scrum_workflow/workflows/project-documentation.md` (MODIFY Step 5.1 only) -- do NOT restructure other steps
- Do NOT create or modify `scrum_workflow/agents/documentarian.md` (completed in Story 6.1)
- Do NOT create or modify `scrum_workflow/commands/create-project-docs.md` (completed in Story 6.2)
- Do NOT create or modify `.claude/skills/create-project-docs.md` (completed in Story 6.2)
- Do NOT create `docs/generated/business-logic.md` -- that file is created at RUNTIME by the workflow, not at development time
- Do NOT modify `_bmad/bmm/config.yaml` -- templates are discovered by file presence, not config registration

### References

- [Source: scrum_workflow/agents/documentarian.md#Instructions] -- Grep patterns for business rule identification and analysis methodology
- [Source: scrum_workflow/agents/documentarian.md#Output Format > business-logic.md] -- Required output sections and Mermaid diagram types
- [Source: scrum_workflow/workflows/project-documentation.md#Step 5.1] -- Workflow step to update (currently has "See Story 6.3" placeholder)
- [Source: scrum_workflow/templates/story.md] -- Template file format reference (stateful artifact with YAML)
- [Source: scrum_workflow/templates/refinement.md] -- Template file format reference (output artifact, no YAML)
- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.3] -- Story requirements and acceptance criteria
- [Source: _bmad-output/implementation-artifacts/6-1-documentarian-agent-definition.md] -- Previous story intelligence
- [Source: _bmad-output/implementation-artifacts/6-2-create-project-docs-command-and-workflow-skeleton.md] -- Previous story intelligence
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] -- Naming conventions, SKILL.md patterns, write boundaries
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] -- Three-layer separation, framework directory structure
- [Source: _bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md] -- Grep-based analysis patterns, template-driven output, Mermaid-first documentation

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Fixed test path resolution bug in `business-logic-analysis-generation.spec.ts`: changed `join(process.cwd(), '..')` to `resolve(__dirname, '..', '..')` to match the working pattern from `create-project-docs-command-workflow.spec.ts`

### Completion Notes List

- Created `scrum_workflow/templates/business-logic.md` as pure Markdown output template (no YAML frontmatter) with all required sections: Overview, Business Rules (grouped by domain area), Validation Rules, Guard Clauses & Access Control, Business Constants & Configuration. Each section includes entry format with rule name, description, file:line source reference, plain-language explanation, and Mermaid flowchart placeholder for complex rules. Placeholder comments included for documentarian agent injection.
- Updated `scrum_workflow/workflows/project-documentation.md` Step 5.1 to replace "See Story 6.3" placeholder with concrete implementation. Step 5.1 now has 6 sub-steps: 5.1.1 (Grep-based scanning with all pattern categories), 5.1.2 (exclusion filters for directories and test files plus agent exclusion reference), 5.1.3 (domain area grouping with path-based, file-name, fallback, and uncategorized strategies), 5.1.4 (Mermaid flowchart generation for complex multi-branch rules), 5.1.5 (source reference format with relative paths), 5.1.6 (write output using template, including empty-codebase handling).
- Fixed test infrastructure bug: path resolution in ATDD spec file used `process.cwd()` which only goes one level up, changed to `resolve(__dirname, '..', '..')` to correctly reach project root.
- All 58 ATDD tests pass (unskipped from RED phase). No regressions in existing test suites.

### Change Log

- 2026-03-30: Story 6.3 implementation complete. Created business-logic.md template, updated workflow Step 5.1 with concrete implementation, fixed ATDD test path resolution. All 58 tests green.
- 2026-03-30: Story 6.3 code review complete (YOLO mode). All 4 deferred findings carried forward, 4 patches auto-applied: template placeholder syntax unified, "Enforces" renamed to "Business Context", source reference format documented, workflow DRY violation fixed by referencing agent definition.

### File List

- `scrum_workflow/templates/business-logic.md` (NEW) -- Business logic output template
- `scrum_workflow/workflows/project-documentation.md` (MODIFIED) -- Step 5.1 replaced placeholder with concrete implementation
- `_bmad-output/test-artifacts/business-logic-analysis-generation.spec.ts` (MODIFIED) -- Unskipped tests, fixed path resolution bug
- `_bmad-output/implementation-artifacts/6-3-business-logic-analysis-and-generation.md` (MODIFIED) -- Story status and task completion tracking

### Review Findings

- [x] [Review][Defer] Workflow adds `abort` guard pattern not in agent definition [scrum_workflow/workflows/project-documentation.md:163] -- deferred, pre-existing spec inconsistency between Story 6.1 agent and Story 6.3 AC#1
- [x] [Review][Defer] Template has 5 sections vs agent's 3 Required Sections [scrum_workflow/templates/business-logic.md] -- deferred, pre-existing spec inconsistency between agent Output Format and Story 6.3 AC#2
- [x] [Review][Defer] Template section name mismatch "Guard Clauses & Access Control" vs agent's "Guard Clauses" [scrum_workflow/templates/business-logic.md] -- deferred, pre-existing naming divergence
- [x] [Review][Defer] `LIMIT_` constant pattern in workflow not explicitly in story AC [scrum_workflow/workflows/project-documentation.md:165] -- deferred, minor undocumented addition
- [x] [Review][Patch] Template placeholder syntax inconsistency -- FIXED, unified to Mustache-style {{variable}} for all placeholders
- [x] [Review][Patch] "Enforces" field redundancy in template -- FIXED, renamed to "Business Context" for clarity
- [x] [Review][Patch] No validation for source reference format -- FIXED, added inline documentation for LINE-N-N ranges and multi-file references
- [x] [Review][Patch] Workflow defines grep patterns inline (DRY violation) -- FIXED, replaced inline patterns with reference to agent definition
