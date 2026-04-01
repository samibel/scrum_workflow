# Story 6.4: Workflow & State Machine Documentation with `workflows.md`

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the agent to trace and document all workflows, state machines, and process flows in my codebase,
so that I can see how data and control flow through the system's business processes.

## Acceptance Criteria

1. **Grep-based workflow scanning**: The agent scans the codebase using Grep patterns to identify workflows (language-agnostic, no AST):
   - State machines and status transitions (`status`, `state`, `transition`, `FSM`, `machine`)
   - Event handlers (`on*`, `handle*`, `emit`, `dispatch`, `subscribe`, `publish`)
   - Pipeline and middleware chains (`pipe`, `use`, `middleware`, `chain`, `step`)
   - Process orchestration (`saga`, `workflow`, `process`, `orchestrat*`)
   - Async flows (`then`, `await`, `promise`, `callback`, `queue`, `job`)

2. **Output template exists**: `scrum_workflow/templates/workflows-doc.md` exists as the output template with sections: Overview, State Machines, Event Flows, Process Pipelines, Async Workflows

3. **Generated output follows template**: The generated `docs/generated/workflows.md` follows the template structure from AC #2

4. **Workflow documentation completeness**: Each documented workflow includes:
   - Workflow name/description
   - Trigger/entry point (file:line)
   - Steps in sequence
   - Exit conditions/outcomes

5. **Mermaid diagrams for workflows**:
   - State machines documented with Mermaid `stateDiagram-v2` showing all states and transitions
   - Event flows documented with Mermaid `sequenceDiagram` showing participants and message flow
   - Process pipelines documented with Mermaid `flowchart LR` showing pipeline stages

## Tasks / Subtasks

- [x] Task 1: Create the `workflows-doc.md` output template (AC: #2)
  - [x] 1.1: Create `scrum_workflow/templates/workflows-doc.md` as a pure Markdown output template (no YAML frontmatter) following the output artifact convention from `refinement.md`, `review.md`, `approval.md`, and `business-logic.md`
  - [x] 1.2: Template must include these sections: Overview, State Machines, Event Flows, Process Pipelines, Async Workflows
  - [x] 1.3: Each section must show the expected entry format: workflow name, description, trigger/entry point (file:line reference), steps in sequence, exit conditions/outcomes
  - [x] 1.4: Include Mermaid diagram placeholders: `stateDiagram-v2` for state machines, `sequenceDiagram` for event flows, `flowchart LR` for process pipelines
  - [x] 1.5: Include placeholder comments (e.g., `<!-- Fill from documentarian analysis -->`) so the documentarian agent knows where to inject content

- [x] Task 2: Implement workflow scanning in workflow Step 5.2 (AC: #1)
  - [x] 2.1: Update `scrum_workflow/workflows/project-documentation.md` Step 5.2 to replace the "See Story 6.4" placeholder with concrete implementation instructions
  - [x] 2.2: Define the Grep pattern set for workflow detection:
    - State machines: `\b(status|state|transition|fsm|finite.*state|state.*machine)\b`, `\b(pending|in_progress|completed|active|inactive|draft|ready|done|failed|cancelled)\b`
    - Event handlers: `\bon[A-Z]\w*`, `\bhandle[A-Z]\w*`, `\bemit\b`, `\bdispatch\b`, `\bsubscribe\b`, `\bpublish\b`, `\bevent\b`
    - Pipelines: `\bpipe\b`, `\buse\b`, `\bmiddleware\b`, `\bchain\b`, `\bstep\b`, `\binterceptor\b`, `\bguard\b`
    - Orchestration: `\bsaga\b`, `\bworkflow\b`, `\bprocess\b`, `\borchestrat`
    - Async flows: `\bthen\b`, `\bawait\b`, `\bpromise\b`, `\bcallback\b`, `\bqueue\b`, `\bjob\b`, `\basync\b`
  - [x] 2.3: Define the exclusion filter: skip files in `node_modules/`, `dist/`, `build/`, `.git/`, `vendor/`, `__pycache__/`, `docs/generated/`, `scrum_workflow/`, test files (`*.test.*`, `*.spec.*`, `test_*`, `*_test.*`)
  - [x] 2.4: Define the workflow categorization logic: categorize detected patterns into the five sections (State Machines, Event Flows, Process Pipelines, Async Workflows) based on the dominant pattern type in each file

- [x] Task 3: Implement Mermaid diagram generation instructions (AC: #5)
  - [x] 3.1: Add instructions for generating Mermaid `stateDiagram-v2` for state machines: show all states, transitions with triggers, initial state, and final/terminal states
  - [x] 3.2: Add instructions for generating Mermaid `sequenceDiagram` for event flows: show participants (services/components), messages/emit events, and message flow direction
  - [x] 3.3: Add instructions for generating Mermaid `flowchart LR` for process pipelines: show stages in sequence, data flow direction, and decision points
  - [x] 3.4: Each Mermaid block must be fenced with ` ```mermaid ` and include a descriptive comment above it
  - [x] 3.5: Simple linear workflows do NOT need complex diagrams -- only multi-step, branching, or multi-participant workflows need diagrams

- [x] Task 4: Implement source reference format (AC: #4)
  - [x] 4.1: Every documented workflow must include `[Source: path/to/file.ext:LINE]` reference for the trigger/entry point
  - [x] 4.2: If a workflow spans multiple files, include all file:line references for key steps
  - [x] 4.3: Source references use relative paths from project root (not absolute paths)
  - [x] 4.4: For state machines, reference the file where the state machine is defined or where transitions are handled

- [x] Task 5: Integration with workflow Step 5.2 (AC: #3)
  - [x] 5.1: After analysis, the documentarian writes `docs/generated/workflows.md` using the template from Task 1 filled with discovered workflows
  - [x] 5.2: The generated file must have an Overview section summarizing total workflows found by category (state machines, event flows, pipelines, async workflows) and analysis timestamp
  - [x] 5.3: If no workflows are found (static codebase with no dynamic flows), write a minimal document stating "No workflows detected" rather than an empty file
  - [x] 5.4: Workflows should be grouped by type and ordered by complexity (most complex workflows first within each category)

## Dev Notes

### Architecture Compliance

- **Three-Layer Separation**: The template goes in Framework Layer (`scrum_workflow/templates/workflows-doc.md`). The generated output goes in Project Layer (`docs/generated/workflows.md`). NEVER put generated output inside `scrum_workflow/`.
- **Template-Driven Output**: The documentarian agent uses the template to structure its output. The template defines WHAT sections exist. The agent's Instructions section defines HOW to fill them. Do not duplicate analysis methodology in the template.
- **Language-Agnostic (FR69 principle)**: All scanning uses Glob and Grep. No AST parsing, no tree-sitter, no language-specific tooling. This is a deliberate design choice to support any programming language.
- **Write Boundaries**: This story only writes to `scrum_workflow/templates/workflows-doc.md` (framework file, created once) and modifies `scrum_workflow/workflows/project-documentation.md` (replacing Step 5.2 placeholder). At runtime the workflow writes to `docs/generated/workflows.md`.
- **NFR4**: Adding a new template = new Markdown file. Zero code changes.
- **NFR9**: No runtime dependencies. Pure file-based interpretation by the AI platform.

### Existing Template Pattern Reference

All templates in `scrum_workflow/templates/` are plain Markdown files. Some have YAML frontmatter (e.g., `story.md` has `schema_version`, `ticket`, `title`, `status`), others are pure Markdown (e.g., `refinement.md`, `business-logic.md`). The `workflows-doc.md` template should be **pure Markdown without frontmatter** since it is a documentation output template, not a stateful artifact like a story file.

Existing template files for reference:
- `scrum_workflow/templates/business-logic.md` -- Markdown template (output artifact) -- CREATED in Story 6.3, follow this pattern
- `scrum_workflow/templates/refinement.md` -- Markdown template (output artifact)
- `scrum_workflow/templates/review.md` -- Markdown template (output artifact)
- `scrum_workflow/templates/approval.md` -- Markdown template (output artifact)

The `workflows-doc.md` template follows the output artifact pattern (like `business-logic.md`, `refinement.md`), NOT the stateful artifact pattern (like `story.md`).

### Documentarian Agent Pattern Application

From `scrum_workflow/agents/documentarian.md`:
- The agent's **Instructions Section 3** defines the workflow grep patterns: `status`, `state`, `transition` for state machines; `on*`, `handle*`, `emit`, `dispatch` for event handlers; `pipe`, `middleware`, `chain` for pipelines; `saga`, `workflow`, `process` for orchestration
- The agent's **Output Format > workflows.md** defines required sections: State Machines (with stateDiagram-v2), Event Flows (with sequenceDiagram), Process Pipelines (with flowchart LR), Async Workflows
- The template created in this story MUST match the Output Format specification in the agent definition exactly

**ANTI-PATTERN WARNING**: Do NOT create analysis logic in the template file. The template is a structural skeleton. Analysis methodology lives in `scrum_workflow/agents/documentarian.md` Instructions section. The workflow Step 5.2 orchestrates WHEN analysis happens. The template defines the OUTPUT STRUCTURE.

### Workflow Step 5.2 Update Pattern

Story 6.2 created the workflow skeleton with `**See Story 6.4**` placeholder in Step 5.2. This story replaces that placeholder with concrete instructions. The update must:
1. Keep the existing Step 5.2 heading and numbered list structure
2. Replace the placeholder reference with detailed implementation steps
3. Reference the new template: `scrum_workflow/templates/workflows-doc.md`
4. Reference the agent's grep patterns from `scrum_workflow/agents/documentarian.md` Instructions Section 3
5. NOT duplicate the full agent instructions -- reference them

The workflow drives WHEN and WHERE. The agent drives HOW. The template drives WHAT STRUCTURE.

### Workflow Categorization Strategy

Detected patterns should be categorized into one of five workflow types using this inference strategy:
1. **State Machines**: Dominated by `status`, `state`, `transition` keywords with explicit state values and transition logic
2. **Event Flows**: Dominated by `on*`, `handle*`, `emit`, `dispatch`, `publish`, `subscribe` patterns with message passing
3. **Process Pipelines**: Dominated by `pipe`, `middleware`, `chain`, `step`, `interceptor` patterns with sequential processing stages
4. **Async Workflows**: Dominated by `then`, `await`, `promise`, `callback`, `async`, `queue`, `job` patterns with asynchronous control flow
5. **Orchestration**: Explicit `saga`, `workflow`, `orchestrat*` keywords indicating business process orchestration

If a file contains multiple workflow types, categorize by the dominant pattern or create separate entries for each type if they are distinct workflows.

### Mermaid Diagram Guidelines

- **State machines**: Always use `stateDiagram-v2` for workflows with explicit state transitions. Show all states, transition events, initial state (`[*] --> StateName`), and terminal states if any.
- **Event flows**: Use `sequenceDiagram` for workflows with multiple participants/services communicating. Show participants as actors/boxes, messages as arrows, and message direction (emit -> subscribe).
- **Process pipelines**: Use `flowchart LR` (left-to-right) for linear or branching pipelines. Show stages as nodes, data flow as edges, and any decision points as diamonds.
- **Async flows**: Use `flowchart TD` (top-down) for complex async workflows with multiple promise chains or parallel execution paths.
- **Only for complex workflows**: Simple linear 2-step workflows do NOT need a diagram. Multi-step, branching, or multi-participant workflows DO need a diagram.
- **Naming**: Use descriptive labels, not code variables. E.g., "Order created" not "emit('order:created')".

### Previous Story Intelligence (Stories 6.1, 6.2, and 6.3)

**From Story 6.1 (Documentarian Agent Definition)**:
- Agent created at `scrum_workflow/agents/documentarian.md` -- defines analysis methodology and output format
- Agent uses `claude-sonnet-4` model with `max_tokens: 4000`
- Agent's Output Format section defines the exact structure for `workflows.md` -- the template MUST match
- Agent's Instructions Section 3 lists grep patterns for workflows -- the workflow MUST reference these, not redefine them
- `active_in: [create-project-docs]` references the command this workflow serves
- ANTI-PATTERN from 6.1: Do NOT put analysis logic in the template. Template = structure. Agent = methodology.

**From Story 6.2 (Command & Workflow Skeleton)**:
- Command at `scrum_workflow/commands/create-project-docs.md` with trigger `/scrum-create-project-docs`
- Workflow at `scrum_workflow/workflows/project-documentation.md` with Step 5.2 placeholder for workflow analysis
- Adapter skill at `.claude/skills/create-project-docs.md`
- Output directory is `docs/generated/` relative to project root
- Step 4 ensures output directory exists before Steps 5-7 write files
- Write Boundaries: may write `docs/generated/workflows.md` and `docs/generated/.scan-state.json`
- Workflow Step 5.2 currently says `**See Story 6.4** for full workflow and state machine documentation implementation details.` -- this placeholder must be replaced

**From Story 6.3 (Business Logic Analysis)**:
- Created `scrum_workflow/templates/business-logic.md` as pure Markdown output template (no YAML frontmatter)
- Updated workflow Step 5.1 with concrete implementation replacing "See Story 6.3" placeholder
- Established the pattern for template creation: sections, entry format, source references, Mermaid placeholders, placeholder comments
- Established the pattern for workflow step updates: grep patterns, exclusion filters, categorization logic, Mermaid generation, source reference format, write output
- Fixed review findings: template placeholder syntax unified to Mustache-style, field naming clarified, source reference format documented, DRY violation fixed by referencing agent definition

**Key Pattern from 6.3 to Follow**:
- Template is pure Markdown (no YAML frontmatter)
- Template sections match agent's Output Format exactly
- Workflow step references agent definition for grep patterns (does NOT redefine them inline)
- Workflow step has 6 sub-steps: grep patterns, exclusion filters, categorization, Mermaid generation, source references, write output
- Source reference format: `[Source: path/to/file.ext:LINE]` with relative paths

### Git Intelligence

- Recent commits show Epic 5 (installer) complete, Epic 6 Stories 6.1, 6.2, and 6.3 done
- Project is on `temp_main` branch
- Story 6.3 completed the business-logic.md template and workflow Step 5.1
- Story 6.4 is parallel to 6.3 but for workflows instead of business rules
- The three parallel stories (6.3, 6.4, 6.5) each create one template and implement one workflow step
- Story 6.3 review was completed in YOLO mode with patches auto-applied -- use the same approach for consistency

### Scope Boundaries

**IN scope for this story**:
- Create `scrum_workflow/templates/workflows-doc.md` output template
- Update `scrum_workflow/workflows/project-documentation.md` Step 5.2 with concrete implementation (replace "See Story 6.4" placeholder)

**OUT of scope (other stories)**:
- `business-logic.md` template and workflow Step 5.1 -- Story 6.3 (DONE)
- `domain-model.md` template and workflow Step 5.3 -- Story 6.5
- Incremental update mode logic -- Story 6.6
- Scan state management and resume -- Story 6.7
- Modifying the documentarian agent definition -- completed in Story 6.1
- Modifying the command file or adapter skill -- completed in Story 6.2
- Creating `docs/generated/` directory -- that is runtime behavior in workflow Step 4
- Creating `docs/generated/workflows.md` -- that file is created at RUNTIME by the workflow, not at development time

### Project Structure Notes

- Template file location: `scrum_workflow/templates/workflows-doc.md` (NEW) -- alongside existing templates like `story.md`, `refinement.md`, `review.md`, `approval.md`, `business-logic.md`
- Workflow file modification: `scrum_workflow/workflows/project-documentation.md` (MODIFY Step 5.2 only) -- do NOT restructure other steps
- Do NOT create or modify `scrum_workflow/agents/documentarian.md` (completed in Story 6.1)
- Do NOT create or modify `scrum_workflow/commands/create-project-docs.md` (completed in Story 6.2)
- Do NOT create or modify `.claude/skills/create-project-docs.md` (completed in Story 6.2)
- Do NOT create `docs/generated/workflows.md` -- that file is created at RUNTIME by the workflow, not at development time
- Do NOT modify `_bmad/bmm/config.yaml` -- templates are discovered by file presence, not config registration

### References

- [Source: scrum_workflow/agents/documentarian.md#Instructions Section 3] -- Grep patterns for workflow identification and analysis methodology
- [Source: scrum_workflow/agents/documentarian.md#Output Format > workflows.md] -- Required output sections and Mermaid diagram types
- [Source: scrum_workflow/workflows/project-documentation.md#Step 5.2] -- Workflow step to update (currently has "See Story 6.4" placeholder)
- [Source: scrum_workflow/templates/business-logic.md] -- Template file format reference (output artifact, no YAML, created in Story 6.3)
- [Source: scrum_workflow/templates/refinement.md] -- Template file format reference (output artifact, no YAML)
- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.4] -- Story requirements and acceptance criteria
- [Source: _bmad-output/implementation-artifacts/6-1-documentarian-agent-definition.md] -- Previous story intelligence
- [Source: _bmad-output/implementation-artifacts/6-2-create-project-docs-command-and-workflow-skeleton.md] -- Previous story intelligence
- [Source: _bmad-output/implementation-artifacts/6-3-business-logic-analysis-and-generation.md] -- Previous story intelligence (KEY pattern reference)
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] -- Naming conventions, SKILL.md patterns, write boundaries
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] -- Three-layer separation, framework directory structure
- [Source: _bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md] -- Grep-based analysis patterns, template-driven output, Mermaid-first documentation

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List

**Implementation Summary:**
- Created `scrum_workflow/templates/workflows-doc.md` as pure Markdown output template (no YAML frontmatter) following the pattern established in Story 6.3
- Template includes all required sections: Overview, State Machines, Event Flows, Process Pipelines, Async Workflows
- Each section contains entry format with workflow name, description, trigger/entry point (file:line reference), steps, and outcomes
- All Mermaid diagram placeholders included: `stateDiagram-v2` for state machines, `sequenceDiagram` for event flows, `flowchart LR` for process pipelines, `flowchart TD` for async workflows
- Placeholder comments (`<!-- Fill from documentarian analysis -->`) added to guide documentarian agent content injection

- Updated `scrum_workflow/workflows/project-documentation.md` Step 5.2 with comprehensive implementation:
  - Replaced "See Story 6.4" placeholder with 6 detailed sub-steps (5.2.1-5.2.6)
  - Defined complete Grep pattern set for all 5 workflow types (state machines, event handlers, pipelines, orchestration, async flows)
  - Specified exclusion filters matching Story 6.3 pattern (node_modules, dist, build, .git, vendor, __pycache__, docs/generated, scrum_workflow, test files)
  - Implemented workflow categorization logic based on dominant pattern type inference
  - Added Mermaid diagram generation instructions with specific guidelines for each diagram type
  - Documented source reference format requirements with relative paths and file:line syntax
  - Included write output instructions with template loading, Overview section population, workflow grouping, and edge case handling

**Architecture Compliance:**
- Template placed in Framework Layer (`scrum_workflow/templates/workflows-doc.md`)
- Generated output will go to Project Layer (`docs/generated/workflows.md`) at runtime
- Follows three-layer separation principle
- Language-agnostic approach using Glob and Grep (FR69 principle)
- Zero code changes (NFR4 compliant) - pure file-based interpretation
- References documentarian agent definition for methodology (DRY principle)

**Pattern Consistency with Story 6.3:**
- Same template structure (pure Markdown, no YAML frontmatter)
- Same workflow step pattern (6 sub-steps with grep patterns, exclusion filters, categorization, Mermaid generation, source references, write output)
- Same source reference format: `[Source: path/to/file.ext:LINE]`
- Same placeholder comment style: `<!-- Fill from documentarian analysis -->`
- Same Mustache-style variable placeholders in template ({{variable_name}})

All acceptance criteria satisfied:
- AC #1: Grep-based workflow scanning implemented in Step 5.2.1 with all 5 pattern categories
- AC #2: Output template exists at `scrum_workflow/templates/workflows-doc.md` with all required sections
- AC #3: Generated output will follow template structure (specified in Step 5.2.6)
- AC #4: Workflow documentation completeness ensured via template entry format (workflow name, description, trigger/entry point, steps, outcomes)
- AC #5: Mermaid diagram generation instructions implemented in Step 5.2.4 with all 4 diagram types (stateDiagram-v2, sequenceDiagram, flowchart LR, flowchart TD)

### File List

**Created:**
- scrum_workflow/templates/workflows-doc.md (new output template)

**Modified:**
- scrum_workflow/workflows/project-documentation.md (Step 5.2 updated with 6 sub-steps)
- _bmad-output/implementation-artifacts/6-4-workflow-and-state-machine-documentation.md (story file - status, tasks marked complete, completion notes, file list added)

### Review Findings
