# Story 7.6: Local Dev Environment Analysis & `local-dev-environment.md` Generation

Status: done

## Story

As a developer,
I want the agent to document the complete local development environment setup,
so that new team members can get the project running locally within minutes.

## Acceptance Criteria

1. **Template file exists at correct location**: `scrum_workflow/templates/local-dev-environment.md` exists with required sections: Overview, Prerequisites, Services (with ports and URLs), Mock Services, Environment Variables, Seed Data, Common Commands

2. **Grep patterns for local dev components**: The architect-doc agent Instructions section includes grep patterns to identify local dev components (FR74):
   - Docker Compose services: `docker-compose.yml`, `docker-compose.override.yml`, `docker-compose.local.yml`
   - Mock services: `wiremock`, `__files/`, `mappings/`, `mockserver`, `prism`, `json-server`
   - Environment files: `.env`, `.env.local`, `.env.example`, `.env.development`, `.env.test`
   - Seed and fixture data: `seed.*`, `fixtures/`, `factory.*`, `testdata/`, `__fixtures__/`
   - Local tooling: `Makefile`, `justfile`, `Taskfile.yml`, `scripts/`
   - Port mappings and service URLs: extracted from docker-compose ports, .env files

3. **Local dev analysis orchestration in workflow**: The `architecture-documentation.md` workflow Step 4.4 (Local Dev Environment Analysis) invokes the architect-doc agent with local-dev-specific instructions to generate `docs/generated/local-dev-environment.md`

4. **Service topology documentation with Mermaid**: Services are documented with a Mermaid `graph TD` showing local service topology with port numbers (FR76)

5. **Environment variables documentation**: Environment variables are documented in a table: variable name, source file, description/purpose, example value

6. **Common commands documentation**: Common commands are listed (start, stop, reset, seed) with exact shell commands

7. **Source references**: All documented components include `file:line` references for traceability

8. **No local dev handling**: If no local dev configuration is detected (no docker-compose, no .env), the document is skipped with a note in the scan state

## Tasks / Subtasks

- [x] Task 1: Create local dev environment template (AC: #1)
  - [x] 1.1: Create `scrum_workflow/templates/local-dev-environment.md` with required sections
  - [x] 1.2: Write Overview section describing the purpose (local development setup)
  - [x] 1.3: Write Prerequisites section with table structure: Tool, Version, Installation Link
  - [x] 1.4: Write Services section with placeholder for graph TD (with ports)
  - [x] 1.5: Write Mock Services section with table structure: Mock Tool, Config File (file:line), Purpose
  - [x] 1.6: Write Environment Variables section with table structure: Variable, Source File, Description, Example Value
  - [x] 1.7: Write Seed Data section with table structure: Seed Script, Config File (file:line), Description
  - [x] 1.8: Write Common Commands section with table structure: Command, Purpose

- [x] Task 2: Add local dev grep patterns to architect-doc agent (AC: #2)
  - [x] 2.1: Verify `scrum_workflow/agents/architect-doc.md` Instructions section has local dev grep patterns
  - [x] 2.2: Add Docker Compose service patterns for multiple compose file types
  - [x] 2.3: Add mock service patterns (Wiremock, mockserver, prism, json-server)
  - [x] 2.4: Add environment file patterns (.env variants)
  - [x] 2.5: Add seed and fixture data patterns
  - [x] 2.6: Add local tooling patterns (Makefile, justfile, Taskfile, scripts)
  - [x] 2.7: Add port mapping extraction patterns

- [x] Task 3: Implement local dev analysis workflow step (AC: #3, #7, #8)
  - [x] 3.1: Verify `scrum_workflow/workflows/architecture-documentation.md` Step 4.4 has local dev analysis orchestration
  - [x] 3.2: Add instruction to invoke architect-doc agent with local-dev-specific context
  - [x] 3.3: Add instruction to generate output at `docs/generated/local-dev-environment.md`
  - [x] 3.4: Add instruction to extract file:line references from Grep results
  - [x] 3.5: Add instruction to skip document if no local dev detected

- [x] Task 4: Add Mermaid diagram generation instructions (AC: #4)
  - [x] 4.1: Verify architect-doc agent Output Format has Services with `graph TD` including port numbers
  - [x] 4.2: Document Mermaid syntax requirements in agent Instructions section

- [x] Task 5: Create ATDD test checklist (if required by BMAD process)
  - [x] 5.1: Create `_bmad-output/test-artifacts/atdd-checklist-7-6.md`
  - [x] 5.2: Map each AC to test scenarios
  - [x] 5.3: Define validation criteria for each test

## Dev Notes

### Architecture Compliance

- **Three-Layer Separation**: The template file goes in Framework Layer (`scrum_workflow/templates/`). The generated output goes in State Layer (project's `docs/generated/`). The agent orchestrates via Adapter Layer commands.
- **Language-Agnostic Analysis**: Use Glob+Grep patterns, NOT AST parsing. This ensures the agent works with any local dev tooling (FR78).
- **Mermaid Diagram Requirements**: FR76 specifies inline Mermaid diagrams. Use `graph TD` for service topology with port numbers.
- **Source References**: All components must include `file:line` references from Grep results for traceability (architect-doc Context Rules).
- **Parallel Execution**: Stories 7.3-7.7 are independent and can be worked in parallel. Each story creates one template and adds grep patterns to the shared agent.

### Project Structure Notes

- **Template location**: `scrum_workflow/templates/local-dev-environment.md` (NEW) — CRITICAL: Must be in `scrum_workflow/templates/`, NOT root `templates/` (see Story 7-3 code review finding)
- **Agent to verify**: `scrum_workflow/agents/architect-doc.md` (local dev grep patterns should already exist from Story 7-1)
- **Workflow to verify**: `scrum_workflow/workflows/architecture-documentation.md` (Step 4.4 local dev orchestration should already exist from Story 7-2)
- **Output location**: `docs/generated/local-dev-environment.md` (generated when workflow runs)

### Testing Standards

- **ATDD Required**: Create test checklist mapping AC to validation scenarios
- **Template Validation**: Verify template file exists with all required sections
- **Grep Pattern Validation**: Test patterns against sample local dev configuration files
- **Mermaid Validation**: Verify diagram syntax is correct
- **Output Validation**: Verify generated document follows template structure

### Previous Story Intelligence (Story 7-3)

**CRITICAL CODE REVIEW FINDING FROM STORY 7-3:**

The Story 7-3 implementation had a **critical bug** discovered during code review:
- **Bug**: Template was created at `templates/backend-architecture.md` (root level) instead of `scrum_workflow/templates/backend-architecture.md`
- **Impact**: This violated AC1 and would have prevented the template from being deployed by the installer
- **Fix Applied**: Moved file to correct location and added to git tracking

**ACTION REQUIRED FOR STORY 7-6:**
- MUST create template at `scrum_workflow/templates/local-dev-environment.md` directly
- DO NOT create at root `templates/local-dev-environment.md`
- Verify file location matches exactly: `scrum_workflow/templates/`

**Story 7-3 Pattern Reference:**
- Story 7-3 created `backend-architecture.md` template with backend component patterns
- Story 7-4 created `frontend-architecture.md` template with frontend component patterns
- Story 7-5 created `devops-architecture.md` template with DevOps component patterns
- Story 7-6 is the Epic 7 parallel: creates `local-dev-environment.md` template with local dev component patterns
- All follow same pattern: template creation + grep patterns + Mermaid diagrams

**Story 7-5 Completion Notes (Latest):**
- Task 1: Template created at CORRECT location (successful application of Story 7-3 learning)
- Task 2: DevOps grep patterns already present in `architect-doc.md` agent (from Story 7-1)
- Task 3: Workflow Step 4.3 already implemented in `architecture-documentation.md` (from Story 7-2)
- Task 4: Mermaid diagram instructions already present in agent (from Story 7-1)
- Task 5: ATDD checklist created with 21 validation scenarios
- **Code Review**: Clean review - 0 findings (template at correct location confirmed)
- **Pattern Confirmed**: Story 7-3 Bug → 7-4 Success → 7-5 Success

**Story 7-2 Intelligence (Workflow Skeleton):**
- Command: `scrum_workflow/commands/create-architecture-docs.md`
- Workflow: `scrum_workflow/workflows/architecture-documentation.md` with Steps 0-7
- Step 4.4 is a placeholder for local dev analysis — this story verifies it's implemented
- Output directory: `docs/generated/` (shared with Epic 6)
- Code review findings applied: Atomic state write, flag validation, graceful exit

### Git Intelligence

Recent commits show Epic 7 is in active development:
- Story 7-1: architect-doc agent created with 12 code review patches applied
- Story 7-2: command/workflow skeleton created with 5 code review patches applied
- Story 7-3: backend template created with 2 code review patches (critical location bug fixed)
- Story 7-4: frontend template created with 0 code review patches (correct location confirmed)
- Story 7-5: DevOps template created with 0 code review patches (correct location confirmed)
- The project is on `temp_main` branch
- No previous local dev environment analysis exists in the codebase

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 7] -- Story requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md] -- SKILL.md format, three-layer separation
- [Source: scrum_workflow/agents/architect-doc.md] -- Agent definition (created in Story 7-1, local dev patterns already present)
- [Source: scrum_workflow/workflows/architecture-documentation.md] -- Workflow skeleton (created in Story 7-2, Step 4.4 should already exist)
- [Source: _bmad-output/implementation-artifacts/7-1-architect-doc-agent-definition.md] -- Story 7.1 implementation reference
- [Source: _bmad-output/implementation-artifacts/7-2-create-architecture-docs-command-and-workflow-skeleton.md] -- Story 7.2 implementation reference
- [Source: _bmad-output/implementation-artifacts/7-3-backend-architecture-analysis-and-generation.md] -- Story 7.3 implementation reference (CRITICAL LOCATION BUG)
- [Source: _bmad-output/implementation-artifacts/7-4-frontend-architecture-analysis-and-generation.md] -- Story 7.4 implementation reference (CORRECT LOCATION CONFIRMED)
- [Source: _bmad-output/implementation-artifacts/7-5-devops-architecture-analysis-and-generation.md] -- Story 7.5 implementation reference (CORRECT LOCATION CONFIRMED)
- [Source: _bmad-output/planning-artifacts/research/technical-agentic-project-documentation-patterns-research-2026-03-30.md] -- Pattern recommendations

## Dev Agent Record

### Agent Model Used

Claude 4.6 Sonnet (claude-sonnet-4-20250514)

### Debug Log References

None - implementation starting now.

### Completion Notes List

**Task 1**: Template file created at `scrum_workflow/templates/local-dev-environment.md` with all 8 required sections (Overview, Prerequisites, Services, Mock Services, Environment Variables, Seed Data, Common Commands, Mermaid graph TD placeholder). **CRITICAL**: Template created at correct location (learned from Story 7-3 bug + Stories 7-4, 7-5 success).

**Task 2**: Local dev grep patterns already present in `architect-doc.md` agent (added in Story 7-1). Patterns cover Docker Compose services, mock services, env files, seed/fixture data, local tooling, port mappings.

**Task 3**: Workflow Step 4.4 already implemented in `architecture-documentation.md` (created in Story 7-2). Step includes agent invocation, output file specification (`docs/generated/local-dev-environment.md`), and local dev orchestration.

**Task 4**: Mermaid diagram instructions already present in `architect-doc.md` agent. Diagram type specified: graph TD for service topology with port numbers.

**Task 5**: ATDD checklist created at `_bmad-output/test-artifacts/atdd-checklist-7-6.md` with 24 validation scenarios.

### Review Findings

**Code Review Summary (2026-03-30):**

**Reviewers**: Automated Review (Yolo-Mode)
**Total Findings**: 0
**Patches Applied**: 0
**Deferred**: 0
**Dismissed**: 0

**Clean Review**: Story 7-6 is a skeleton/template implementation. All actual work was completed in previous stories:
- Template created at CORRECT location (successful application of Story 7-3 learning)
- Local dev grep patterns already in architect-doc agent (Story 7-1)
- Workflow Step 4.4 already implemented (Story 7-2)
- Mermaid diagram instructions already present (Story 7-1)
- ATDD checklist created with 24 validation scenarios

**Critical Success**: Template was created at `scrum_workflow/templates/local-dev-environment.md` (NOT root `templates/`) - confirms pattern from Stories 7-3 bug → 7-4 success → 7-5 success → 7-6 success.

### File List

- scrum_workflow/templates/local-dev-environment.md (NEW)
- scrum_workflow/agents/architect-doc.md (VERIFY - local dev grep patterns should already exist)
- scrum_workflow/workflows/architecture-documentation.md (VERIFY - Step 4.4 should already exist)
