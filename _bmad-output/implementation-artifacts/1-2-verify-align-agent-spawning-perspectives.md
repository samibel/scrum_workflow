# Story 1.2: Verify & Align Agent Spawning & Perspectives

Status: review

## Story

As a developer,
I want `/scrum-refine-ticket` to spawn 3 parallel agents with isolated context matching the current PRD spec,
so that refinement produces independent, high-quality perspectives.

## Acceptance Criteria

1. **Given** the existing implementation of agent spawning in `/scrum-refine-ticket` **When** compared against the current PRD specification for FR-12 and FR-13 **Then** a delta analysis documents: what matches, what diverges, and what is missing **And** all identified deltas are resolved to match the current PRD spec

2. **Given** FR-12 specifies 3 parallel refinement agents (Architect, Developer, QA) with isolated context **When** a developer runs `/scrum-refine-ticket SW-XXX` **Then** exactly 3 agents are spawned: Architect, Developer, and QA **And** each agent receives only its relevant context per Architecture context isolation rules

3. **Given** FR-13 specifies independent perspectives covering architecture risks, implementation feasibility, and testability concerns **When** agents complete their analysis **Then** each agent produces an independent perspective covering its specific domain

4. **Given** all deltas have been resolved **When** the implementation is reviewed **Then** agent spawning and perspective generation fully match the current PRD and Architecture specifications

## Tasks / Subtasks

- [x] Task 1: Delta Analysis — Compare existing agent spawning against PRD spec (AC: #1)
  - [x] 1.1 Read and document current agent role definitions in `scrum_workflow/agents/architect.md`, `scrum_workflow/agents/developer.md`, `scrum_workflow/agents/qa.md`
  - [x] 1.2 Read and document current agent spawning logic in `scrum_workflow/workflows/refinement.md` (Steps 5, 6, 7 — Spawn Architect, Developer, QA)
  - [x] 1.3 Read and document current command definition in `scrum_workflow/commands/refine-ticket.md`
  - [x] 1.4 Compare current agent spawning against FR-12: exactly 3 agents (Architect, Developer, QA), parallel spawning, isolated context
  - [x] 1.5 Compare current agent perspectives against FR-13: architecture risks, implementation feasibility, testability concerns
  - [x] 1.6 Compare context isolation against Architecture Section 8 (Cross-Agent Communication Patterns): Architect gets story.md + domain context only, Developer gets story.md + plan.md + code context, QA gets story.md + plan.md + testing context
  - [x] 1.7 Document all deltas in a structured report section within this story file (Dev Notes)

- [x] Task 2: Verify agent role definitions match PRD expectations (AC: #2, #3)
  - [x] 2.1 Verify `architect.md` frontmatter: `name: architect`, `active_in: [refine-ticket]`, `model: claude-sonnet-4`, `max_tokens: 2000`
  - [x] 2.2 Verify `architect.md` identity/instructions cover: architectural risks, scalability, maintainability, dependencies, design patterns, security, performance, integration (per FR-13 "architecture risks")
  - [x] 2.3 Verify `developer.md` frontmatter: `name: developer`, `active_in: [refine-ticket]`, `model: claude-sonnet-4`, `max_tokens: 2000`
  - [x] 2.4 Verify `developer.md` identity/instructions cover: technical feasibility, implementation complexity, dependencies, technical debt, code quality, testing strategy, performance, documentation (per FR-13 "implementation feasibility")
  - [x] 2.5 Verify `qa.md` frontmatter: `name: qa`, `active_in: [refine-ticket]`, `model: claude-sonnet-4`, `max_tokens: 2000`
  - [x] 2.6 Verify `qa.md` identity/instructions cover: acceptance criteria, edge cases, test coverage, testability, UX, data validation, integration testing, regression risk (per FR-13 "testability concerns")
  - [x] 2.7 Verify all 3 agents produce output in standard table-based format: Findings table (# | Finding | Severity | Category), Recommendations list, Proposed Acceptance Criteria checklist — per `context/standards.md` Agent Output Format Standards

- [x] Task 3: Verify context isolation rules in workflow (AC: #2)
  - [x] 3.1 Verify Step 5 (Spawn Architect): context bundle includes story.md, context/index.md, context/architecture.md, context/{ticket-domain}.md, agents/architect.md, {discovered_documents} — and EXCLUDES developer.md, qa.md, other agent outputs
  - [x] 3.2 Verify Step 6 (Spawn Developer): context bundle includes story.md, context/index.md, context/{ticket-domain}.md, skills/{ticket-domain}/SKILL.md, agents/developer.md, {discovered_documents} — and EXCLUDES architect.md, qa.md, other agent outputs
  - [x] 3.3 Verify Step 7 (Spawn QA): context bundle includes story.md, context/index.md, context/testing.md, context/{ticket-domain}.md, skills/testing/SKILL.md, agents/qa.md, {discovered_documents} — and EXCLUDES architect.md, developer.md, other agent outputs
  - [x] 3.4 Verify Architecture Section 8 compliance: Architect receives story.md + domain context (no other agent definitions), Developer receives story.md + plan.md + code context, QA receives story.md + plan.md + testing context
  - [x] 3.5 Check for context isolation violations: ensure no step leaks one agent's output to another during initial perspective generation (Round 0)

- [x] Task 4: Verify agent configuration matches config.yaml (AC: #2)
  - [x] 4.1 Verify `config.yaml` `active_agents` array lists exactly: architect, developer, qa
  - [x] 4.2 Verify `config.yaml` `token_budgets.claude-code.sub_agent` is 2000, matching each agent's `max_tokens: 2000`
  - [x] 4.3 Verify agent `model` field in frontmatter aligns with platform configuration (claude-sonnet-4 for sub-agents)

- [x] Task 5: Verify command definition completeness (AC: #2, #3)
  - [x] 5.1 Verify `commands/refine-ticket.md` frontmatter lists `spawns_agents: [architect, developer, qa]`
  - [x] 5.2 Verify command Purpose section describes parallel spawning with isolated context
  - [x] 5.3 Verify command Output section describes 3 agent perspectives in standard table-based format
  - [x] 5.4 Verify command references workflow: `workflows/refinement.md`

- [x] Task 6: Verify perspective output format and content (AC: #3)
  - [x] 6.1 Verify each agent's Output Format section in agent definition matches `context/standards.md` Agent Output Format Standards
  - [x] 6.2 Verify Findings table columns: # | Finding | Severity | Category (exact columns per standards)
  - [x] 6.3 Verify Severity levels: Critical, Major, Minor (per standards)
  - [x] 6.4 Verify each agent has section header `## [Agent-Name] Perspective` (per standards Perspective Attribution)
  - [x] 6.5 Verify perspectives include: Findings table, Recommendations list, Proposed Acceptance Criteria checklist

- [x] Task 7: Resolve any identified deltas (AC: #1, #4)
  - [x] 7.1 For each delta identified: determine if it requires a code change or is an acceptable variance
  - [x] 7.2 Apply fixes to agent definitions, workflow, or command definition as needed
  - [x] 7.3 Verify all fixes maintain backward compatibility with existing story artifacts

- [x] Task 8: Final compliance check (AC: #4)
  - [x] 8.1 Review all modified files against FR-12, FR-13, and Architecture Section 8 patterns
  - [x] 8.2 Verify `max_tokens` on each agent matches `token_budgets.claude-code.sub_agent` from config.yaml
  - [x] 8.3 Verify no write boundary violations: `/scrum-refine-ticket` may write `refinement.md` and update `story.md` only
  - [x] 8.4 Verify error message format follows Architecture pattern: `Error: {description}` with `Fix: {action}`

## Dev Notes

### Approach: Brownfield Verification

This is a verification story, not a greenfield build. The implementation already exists (framework v1.0.0). The approach follows the same pattern as Story 1.1:
1. Read all target files to capture current state
2. Read PRD (FR-12, FR-13) and Architecture (Section 8: Cross-Agent Communication Patterns) for required state
3. Perform systematic comparison
4. Document deltas
5. Resolve any gaps found

### Key PRD Requirements to Verify

**FR-12 — 3 Parallel Refinement Agents with Isolated Context:**
- Exactly 3 agents: Architect, Developer, QA
- Agents spawned in parallel (not sequential)
- Each agent receives isolated context — no cross-contamination between agents during initial analysis
- Context isolation rules per Architecture Section 8

**FR-13 — Independent Perspectives:**
- Architect: architecture risks, scalability, security, design patterns
- Developer: implementation feasibility, complexity, dependencies, technical debt
- QA: testability, acceptance criteria clarity, edge cases, regression risk
- Each perspective is independent — generated without seeing other agents' outputs

### Architecture Context Isolation Rules (Section 8)

Per the Architecture document, context isolation is defined as:
- **Architect agent receives:** story.md + domain context (no other agent definitions)
- **Developer agent receives:** story.md + plan.md + relevant code context
- **QA agent receives:** story.md + plan.md + testing context
- **Review agent receives:** story.md + plan.md + implementation + previous reviews

**IMPORTANT DELTA TO INVESTIGATE:** The Architecture document says Developer and QA get `plan.md`, but during refinement (`/scrum-refine-ticket`), no `plan.md` exists yet — it is created by `/scrum-refine-story` which runs AFTER refinement. The workflow (Steps 5-7) correctly omits `plan.md` from refinement context bundles. Verify whether Architecture Section 8 is describing refinement context or general context isolation rules. If the latter, the workflow's omission of `plan.md` is correct for the refinement phase.

### Agent Output Format Requirements

Per `context/standards.md` (Agent Output Format Standards section):
- Standard perspective structure: `## [Agent-Name] Perspective` header
- Findings table: `| # | Finding | Severity | Category |`
- Severity values: Critical, Major, Minor
- Recommendations: numbered list
- Proposed Acceptance Criteria: checklist format `- [ ]`
- Each perspective must fit within platform's sub_agent token budget (2000 tokens for claude-code)
- Perspectives must be generated independently without seeing other agents' outputs

### Token Budget Alignment

From `config.yaml`:
- `token_budgets.claude-code.sub_agent: 2000`
- Each agent's `max_tokens: 2000` in frontmatter

From agent definitions:
- `architect.md`: `max_tokens: 2000` -- MATCHES
- `developer.md`: `max_tokens: 2000` -- MATCHES
- `qa.md`: `max_tokens: 2000` -- MATCHES

### Workflow Structure for Agent Spawning

The refinement workflow (`workflows/refinement.md`) has a 6-Phase structure:
1. Phase 1: Doc-Discovery (Step 4.5)
2. Phase 2: Initial Perspectives (Steps 5, 6, 7 — Spawn Architect, Developer, QA)
3. Phase 3: Cross-Talk Rounds (Step 7.5) — NOT in scope for this story
4. Phase 4: Estimation — NOT in scope for this story
5. Phase 5: Synthesis — NOT in scope for this story
6. Phase 6: Readiness Check — NOT in scope for this story

**Scope boundary:** This story covers Phase 2 ONLY (agent spawning and initial perspectives). Cross-talk is Story 1.3, estimation is Story 1.4.

### Relevant File Paths

| File | Purpose | Action |
|------|---------|--------|
| `scrum_workflow/agents/architect.md` | Architect agent role definition | VERIFY — role, instructions, context rules, output format |
| `scrum_workflow/agents/developer.md` | Developer agent role definition | VERIFY — role, instructions, context rules, output format |
| `scrum_workflow/agents/qa.md` | QA agent role definition | VERIFY — role, instructions, context rules, output format |
| `scrum_workflow/workflows/refinement.md` | Refinement workflow (6-phase) | VERIFY — Steps 5, 6, 7 for agent spawning and context isolation |
| `scrum_workflow/commands/refine-ticket.md` | Command definition | VERIFY — spawns_agents, purpose, output |
| `scrum_workflow/config.yaml` | Framework configuration | READ-ONLY — verify active_agents, token_budgets |
| `scrum_workflow/context/standards.md` | Agent output format standards | READ-ONLY — verify perspective format compliance |
| `scrum_workflow/skills/feedback-collection/SKILL.md` | Feedback collection skill | READ-ONLY — verify perspective presentation format |
| `scrum_workflow/skills/synthesis/SKILL.md` | Synthesis skill | READ-ONLY — verify it consumes perspective format correctly |
| `scrum_workflow/templates/refinement.md` | Refinement artifact template | READ-ONLY — verify Round 0 section matches expected perspective format |

### Critical Anti-Patterns to Avoid

- **DO NOT** modify cross-talk logic (Steps 7.5+) — that is Story 1.3
- **DO NOT** modify estimation logic — that is Story 1.4
- **DO NOT** modify synthesis logic — that is Story 1.3
- **DO NOT** modify feedback-collection skill — only verify it matches expected format
- **DO NOT** modify `story.md` template or ticket-creation workflow — that was Story 1.1
- **DO NOT** add new agent types (Security, UX, Contract Validator) — those are Phase 4 / Epic 9
- **DO NOT** change the `model` field in agents to a different model — verify current value only
- **DO NOT** modify status transition logic — only verify that `/scrum-refine-ticket` transitions `draft` -> `refinement`

### Cross-Story Dependencies

- **Story 1.1 (Ticket Creation) — DONE:** Established the `story.md` template and frontmatter. Agent spawning reads `story.md` as input — already verified and aligned.
- **Story 1.3 (Cross-Talk & Synthesis):** Depends on this story's agent perspective output. Cross-talk (Phase 3) takes Round 0 perspectives as input. This story must verify the output format is correct for cross-talk consumption.
- **Story 1.4 (Wideband Delphi Estimation):** Uses agent context from refinement. Estimation happens after perspectives and cross-talk.
- **Story 1.5 (Code Review):** Review uses a separate agent, not the 3 refinement agents. No direct dependency.
- **Epic 9 (Adaptive Workflows):** Future stories will add agent dispatch logic (FR-34) and extended agent types (FR-35). Current implementation uses fixed 3-agent set.

### Previous Story Intelligence (Story 1.1)

**Key learnings from Story 1.1:**
- The delta analysis found ZERO deltas — the codebase was already aligned with spec. This may also be the case for Story 1.2. Be prepared for a "verification confirms compliance" result.
- Story 1.1 found that pre-analysis gap notes were already resolved in the actual codebase. Always verify against the ACTUAL files, not against planning notes.
- Code review found 2 minor patches: (1) `schema_version` inconsistency in preamble text vs operational code, (2) timestamp format string `MM` vs `mm` for minutes. Look for similar inconsistencies.
- Deferred work: Step 3.1 vs Step 0.1 contradiction in ticket-creation.md (context required vs optional). Check if refinement.md has similar contradictions in context handling.

### Project Structure Notes

- Framework files live in `scrum_workflow/` — commands, workflows, skills, agents, templates, data
- Agent definitions are in `scrum_workflow/agents/` with role-based naming (architect.md, developer.md, qa.md)
- Output artifacts live in `_scrum-output/sprints/SW-XXX/`
- Temp files during refinement go to `_scrum-output/sprints/SW-XXX/temp/`
- Context files (auto-detected) live in `_scrum-output/context/`
- Framework-level standards live in `scrum_workflow/context/`

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.2 (lines 332-357)]
- [Source: _bmad-output/planning-artifacts/architecture.md — Section 8: Cross-Agent Communication Patterns (lines 186-196)]
- [Source: scrum_workflow/workflows/refinement.md — Steps 5-7 (agent spawning), Step 7.2 (temp file creation)]
- [Source: scrum_workflow/commands/refine-ticket.md — Full command definition]
- [Source: scrum_workflow/agents/architect.md — Agent role definition]
- [Source: scrum_workflow/agents/developer.md — Agent role definition]
- [Source: scrum_workflow/agents/qa.md — Agent role definition]
- [Source: scrum_workflow/config.yaml — active_agents, token_budgets]
- [Source: scrum_workflow/context/standards.md — Agent Output Format Standards (lines 486-575)]
- [Source: scrum_workflow/skills/feedback-collection/SKILL.md — Perspective presentation format]
- [Source: scrum_workflow/skills/synthesis/SKILL.md — Perspective consumption format]
- [Source: scrum_workflow/templates/refinement.md — Round 0 section template]
- [Source: _bmad-output/implementation-artifacts/1-1-verify-align-ticket-creation.md — Previous story learnings]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- 2026-04-07: All 10 target files read and verified against FR-12, FR-13, and Architecture Section 8.

### Completion Notes List

- **ZERO actionable deltas found.** The codebase is fully aligned with the PRD specification for agent spawning and perspectives, consistent with Story 1.1's findings.
- **Task 1 (Delta Analysis):** All agent definitions, workflow spawning logic, and command definition read and compared against FR-12 (3 parallel agents with isolated context) and FR-13 (independent perspectives). Full compliance confirmed.
- **Task 2 (Agent Role Definitions):** All 3 agents (architect.md, developer.md, qa.md) have correct frontmatter (name, active_in: [refine-ticket], model: claude-sonnet-4, max_tokens: 2000). Identity/Instructions sections cover all required focus areas per FR-13. Output Format sections match standards.md table-based format.
- **Task 3 (Context Isolation):** Workflow Steps 5, 6, 7 correctly isolate agent context. Each agent receives only its designated files and explicitly excludes other agent definitions and outputs. No context leakage during Round 0.
- **Task 3.4 (Architecture Section 8 Acceptable Variance):** Architecture doc says Developer/QA get plan.md, but during refinement no plan.md exists yet (it is created post-refinement by /scrum-refine-story). The workflow correctly omits plan.md. This is an acceptable variance -- Architecture Section 8 describes general context isolation, and the workflow correctly adapts for the refinement phase where plan.md does not yet exist.
- **Task 4 (Config Alignment):** config.yaml active_agents = [architect, developer, qa] (MATCHES). token_budgets.claude-code.sub_agent = 2000 (MATCHES all agent max_tokens: 2000).
- **Task 5 (Command Definition):** refine-ticket.md correctly lists spawns_agents: [architect, developer, qa], describes parallel spawning with isolated context, references workflows/refinement.md.
- **Task 6 (Output Format):** All agents use ## [Agent-Name] Perspective header, Findings table with # | Finding | Severity | Category columns, Severity levels Critical/Major/Minor, Recommendations list, Proposed Acceptance Criteria checklist. Full compliance with standards.md Agent Output Format Standards.
- **Task 7 (Resolve Deltas):** No deltas requiring code changes. Zero fixes applied.
- **Task 8 (Final Compliance):** All files verified against FR-12, FR-13, Architecture Section 8. Token budgets aligned. Write boundaries correct (/scrum-refine-ticket writes refinement.md and updates story.md only). Error message formats follow Architecture pattern.
- **Observation (out of scope):** templates/refinement.md deadlock resolution section contains German text ("Blockierende Punkte", "Vorschlag"). This is in the cross-talk section (Story 1.3 scope) and does not affect agent spawning/perspectives.

### File List

Files verified (READ-ONLY, no modifications needed):

| File | Action | Result |
|------|--------|--------|
| `scrum_workflow/agents/architect.md` | VERIFIED | Compliant with FR-12, FR-13 |
| `scrum_workflow/agents/developer.md` | VERIFIED | Compliant with FR-12, FR-13 |
| `scrum_workflow/agents/qa.md` | VERIFIED | Compliant with FR-12, FR-13 |
| `scrum_workflow/workflows/refinement.md` | VERIFIED | Steps 5-7 compliant with FR-12, context isolation correct |
| `scrum_workflow/commands/refine-ticket.md` | VERIFIED | spawns_agents, purpose, output all compliant |
| `scrum_workflow/config.yaml` | VERIFIED | active_agents and token_budgets aligned |
| `scrum_workflow/context/standards.md` | VERIFIED | Agent Output Format Standards match agent definitions |
| `scrum_workflow/skills/feedback-collection/SKILL.md` | VERIFIED | Perspective presentation format matches |
| `scrum_workflow/skills/synthesis/SKILL.md` | VERIFIED | Consumes perspective format correctly |
| `scrum_workflow/templates/refinement.md` | VERIFIED | Round 0 section matches expected perspective format |

Files modified:

| File | Action |
|------|--------|
| `_bmad-output/implementation-artifacts/1-2-verify-align-agent-spawning-perspectives.md` | UPDATED — Tasks checked, Dev Agent Record filled, status set to review |

## Change Log

- 2026-04-07: Completed systematic verification of agent spawning and perspectives against FR-12, FR-13, and Architecture Section 8. ZERO deltas found. All 8 tasks verified and completed. One acceptable variance documented (plan.md omission during refinement phase). One out-of-scope observation noted (German text in cross-talk template). Story status set to review.
