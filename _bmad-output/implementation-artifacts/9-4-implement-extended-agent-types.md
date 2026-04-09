# Story 9.4: Implement Extended Agent Types

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want Security Reviewer, UX Reviewer, and Contract Validator agents available for specialized stories,
so that domain-specific expertise is applied where needed during refinement.

## Acceptance Criteria

1. **Given** FR-35 specifies extended agent types: Security Reviewer, UX Reviewer, Contract Validator, **When** the agent definitions are created, **Then** three new agent specifications exist in `scrum_workflow/agents/`:
   - `security-reviewer.md` — reviews security-tagged stories for vulnerabilities, auth issues, data exposure
   - `ux-reviewer.md` — reviews frontend-tagged stories for usability, accessibility, design consistency
   - `contract-validator.md` — post-implementation validation that code matches story spec
   **And** each agent file follows the established frontmatter schema (`name`, `display_name`, `role`, `active_in`, `model`, `max_tokens`) and body structure (`Identity`, `Instructions`, `Output Format`, `Context Rules`).

2. **Given** the agents follow the Markdown-as-Code paradigm (AD-001), **When** agent files are placed in `scrum_workflow/agents/`, **Then** the framework discovers them at runtime (FR-44, NFR-11) without registration, build step, or restart, **And** the dynamic dispatcher (Story 9.3) can select them based on story attributes (risk level and domain tags), **And** the dispatcher no longer logs "agent not available — skipped" for these three agents.

3. **Given** the context isolation rules from Architecture (Pattern 8), **When** extended agents are spawned during refinement, **Then** each agent receives only its relevant context:
   - Security Reviewer: `story.md` + relevant code + security-related risk notes + `context/architecture.md`
   - UX Reviewer: `story.md` + relevant code + UX design requirements + `context/frontend.md`
   - Contract Validator: `story.md` + `plan.md` + implementation code + `context/standards.md`
   **And** no agent receives other agent definitions or other agents' perspectives (until cross-talk phase).

4. **Given** the agent files are synced to distribution targets, **When** all files are created, **Then** identical copies exist at:
   - `create-scrum-workflow/scrum_workflow/agents/{agent-name}.md`
   - `create-scrum-workflow/templates/scrum_workflow/agents/{agent-name}.md`
   **And** the `scrum_workflow/agents/README.md` is updated to include the three new agents.

## Tasks / Subtasks

- [x] Task 1: Create Security Reviewer agent definition (AC: #1, #3)
  - [x] 1.1 Create `scrum_workflow/agents/security-reviewer.md` with frontmatter: `name: security-reviewer`, `display_name: Security Reviewer`, `role: You are an expert security reviewer focused on vulnerabilities, authentication issues, and data exposure risks`, `active_in: [refine-ticket]`, `model: claude-sonnet-4`, `max_tokens: 2000`
  - [x] 1.2 Write Identity section: Security-focused agent that analyzes stories for authentication flaws, authorization gaps, data exposure, injection vulnerabilities, and security anti-patterns
  - [x] 1.3 Write Instructions section covering: authentication/authorization review, input validation, data exposure checks, dependency vulnerability awareness, encryption/hashing standards, OWASP-aligned checks, security-specific severity classification
  - [x] 1.4 Write Output Format section: "## Security Reviewer Perspective" with Findings table (Finding, Severity, Category), Recommendations, Proposed Acceptance Criteria — matching existing agent output pattern
  - [x] 1.5 Write Context Rules section: `story.md`, `context/index.md`, `context/architecture.md`, `context/standards.md`, relevant domain context, `_scrum-output/memory/risks/` (security-related risk notes)

- [x] Task 2: Create UX Reviewer agent definition (AC: #1, #3)
  - [x] 2.1 Create `scrum_workflow/agents/ux-reviewer.md` with frontmatter: `name: ux-reviewer`, `display_name: UX Reviewer`, `role: You are an expert UX reviewer focused on usability, accessibility, and design consistency`, `active_in: [refine-ticket]`, `model: claude-sonnet-4`, `max_tokens: 2000`
  - [x] 2.2 Write Identity section: UX-focused agent that analyzes stories for usability issues, accessibility compliance, design consistency, interaction patterns, and user experience anti-patterns
  - [x] 2.3 Write Instructions section covering: usability heuristics, accessibility (WCAG compliance, UX-DR16 contrast ratio 4.5:1, UX-DR17 keyboard navigation, UX-DR18 screen reader compatibility), design consistency with existing UX patterns (UX-DR6 through UX-DR15), interaction flow analysis, progressive disclosure (UX-DR3), responsive/adaptive layout
  - [x] 2.4 Write Output Format section: "## UX Reviewer Perspective" with Findings table, Recommendations, Proposed Acceptance Criteria — matching existing agent output pattern
  - [x] 2.5 Write Context Rules section: `story.md`, `context/index.md`, `context/frontend.md`, `context/standards.md`, UX design specification reference, relevant domain context

- [x] Task 3: Create Contract Validator agent definition (AC: #1, #3)
  - [x] 3.1 Create `scrum_workflow/agents/contract-validator.md` with frontmatter: `name: contract-validator`, `display_name: Contract Validator`, `role: You are an expert contract validator focused on verifying that implementation matches story specifications and API contracts`, `active_in: [refine-ticket]`, `model: claude-sonnet-4`, `max_tokens: 2000`
  - [x] 3.2 Write Identity section: Spec-compliance agent that validates code implements the story requirements completely and correctly, verifying API contracts, data schemas, and acceptance criteria are fully satisfied
  - [x] 3.3 Write Instructions section covering: story-to-implementation traceability, acceptance criteria coverage check, API contract verification (endpoint patterns, data contracts from Architecture), schema compliance, artifact contract compliance (FR-46), write boundary compliance (FR-9), naming convention adherence
  - [x] 3.4 Write Output Format section: "## Contract Validator Perspective" with Findings table, Recommendations, Proposed Acceptance Criteria — matching existing agent output pattern
  - [x] 3.5 Write Context Rules section: `story.md`, `plan.md`, `context/index.md`, `context/standards.md`, implementation source code, relevant domain context

- [x] Task 4: Update agents README (AC: #4)
  - [x] 4.1 Update `scrum_workflow/agents/README.md`: add Security Reviewer, UX Reviewer, Contract Validator to agent list with descriptions
  - [x] 4.2 Update "Current Agents (MVP)" section to "Core Agents" and add "Extended Agents (Phase 4)" section
  - [x] 4.3 Sync README to `create-scrum-workflow/scrum_workflow/agents/README.md` and `create-scrum-workflow/templates/scrum_workflow/agents/README.md`

- [x] Task 5: Sync agent files to distribution targets (AC: #4)
  - [x] 5.1 Copy `security-reviewer.md` to `create-scrum-workflow/scrum_workflow/agents/security-reviewer.md`
  - [x] 5.2 Copy `security-reviewer.md` to `create-scrum-workflow/templates/scrum_workflow/agents/security-reviewer.md`
  - [x] 5.3 Copy `ux-reviewer.md` to `create-scrum-workflow/scrum_workflow/agents/ux-reviewer.md`
  - [x] 5.4 Copy `ux-reviewer.md` to `create-scrum-workflow/templates/scrum_workflow/agents/ux-reviewer.md`
  - [x] 5.5 Copy `contract-validator.md` to `create-scrum-workflow/scrum_workflow/agents/contract-validator.md`
  - [x] 5.6 Copy `contract-validator.md` to `create-scrum-workflow/templates/scrum_workflow/agents/contract-validator.md`

- [x] Task 6: Write ATDD tests (AC: #1, #2, #3, #4)
  - [x] 6.1 Create `tests/unit/extended-agent-types/ac1-agent-file-structure.spec.ts` — tests that all 3 agent files exist, have correct frontmatter schema (name, display_name, role, active_in, model, max_tokens), have all 4 required body sections (Identity, Instructions, Output Format, Context Rules)
  - [x] 6.2 Create `tests/unit/extended-agent-types/ac2-runtime-discovery.spec.ts` — tests that agent files are in `scrum_workflow/agents/` (flat file pattern), file names match dispatch-rules.yaml references (`security-reviewer`, `ux-reviewer`, `contract-validator`), dispatcher no longer needs to skip these agents
  - [x] 6.3 Create `tests/unit/extended-agent-types/ac3-context-isolation.spec.ts` — tests that each agent's Context Rules section loads only its defined context, no agent references other agent definitions, security-reviewer loads risk notes, ux-reviewer loads frontend context, contract-validator loads plan.md + source code
  - [x] 6.4 Create `tests/unit/extended-agent-types/ac4-sync-targets.spec.ts` — tests that all 3 agent files exist in both `create-scrum-workflow/scrum_workflow/agents/` and `create-scrum-workflow/templates/scrum_workflow/agents/`, content matches source files, README.md is updated in all 3 locations
  - [x] 6.5 Create BDD scenario doc: `scrum_workflow/__tests__/extended-agent-types/extended-agent-types.test.md`

## Dev Notes

### Architecture Compliance

- **Markdown-as-Code paradigm (AD-001):** All three agents are `.md` files with structured sections. The AI platform reads and executes them at runtime. No imperative code is involved.
- **Flat file structure for agents:** Agents use `scrum_workflow/agents/{name}.md` (flat files, NOT subdirectories). This is different from skills which use `scrum_workflow/skills/{name}/SKILL.md` subdirectory pattern. Follow existing `architect.md`, `developer.md`, `qa.md` patterns exactly.
- **Runtime discovery (FR-44, NFR-11):** New agent files are auto-discovered by the framework. No registration, build step, or restart required. The agent-dispatcher skill (Story 9.3) validates agent file existence at dispatch time via `scrum_workflow/agents/{name}.md` path check.
- **Context isolation (Architecture Pattern 8):** Each agent receives ONLY its defined context bundle. Never load other agent definitions. Never share agent perspectives until cross-talk phase.
- **Token efficiency (NFR-1):** Each agent has `max_tokens: 2000` (matching existing agents, within sub_agent budget per config.yaml).
- **Write boundaries:** Agents participating in `/scrum-refine-ticket` produce perspectives only. They do NOT write any files. The refinement workflow collects their output.

### Technical Requirements

- **Agent frontmatter schema** (match existing architect.md / developer.md / qa.md exactly):
  ```yaml
  ---
  name: {agent-name}           # lowercase with hyphens, matches filename
  display_name: {Display Name}  # Human-readable name
  role: {one-line role description}
  active_in:
    - refine-ticket             # All extended agents participate in refinement
  model: claude-sonnet-4        # Same model as existing agents
  max_tokens: 2000              # Same token budget as existing agents
  ---
  ```
- **Agent body sections** (4 required sections in this order):
  1. `# Identity` — What the agent is and its focus area
  2. `# Instructions` — Numbered analysis checklist (8 items, matching existing agents)
  3. `# Output Format` — Perspective heading + Findings table + Recommendations + Proposed Acceptance Criteria
  4. `# Context Rules` — Ordered list of context files to load
- **Output Format pattern** (match existing agents exactly):
  ```markdown
  ## {Agent Display Name} Perspective

  ### Findings

  | # | Finding | Severity | Category |
  |---|---------|----------|----------|
  | 1 | Example finding | Critical | Category |

  ### Recommendations

  1. Recommendation text

  ### Proposed Acceptance Criteria

  - [ ] Criterion text
  ```
- **Agent names must match dispatch-rules.yaml references:** `security-reviewer`, `ux-reviewer`, `contract-validator`. The dispatcher already references these exact names (Story 9.3). File names must be `{name}.md`.

### Dispatch Integration Details

The agent-dispatcher skill (Story 9.3) already has rules that reference these agents:
- **Risk-based:** `high`/`critical` risk -> adds `security-reviewer` (from `dispatch-rules.yaml` risk_based_additions)
- **Domain-tag-based:** `frontend`/`ui`/`ux` tags -> adds `ux-reviewer` (from `dispatch-rules.yaml` domain_tag_additions.ux_review)
- **Domain-tag-based:** `api`/`contract`/`integration` tags -> adds `contract-validator` (from `dispatch-rules.yaml` domain_tag_additions.contract_review)

Currently, when these agents are dispatched but their files don't exist, the dispatcher logs "Agent '{name}' not available — skipped (create agent file to enable)." After this story, these agents will be available and dispatched successfully.

**No changes to dispatch-rules.yaml or agent-dispatcher SKILL.md are needed.** The rules already exist. This story only creates the agent files they reference.

### Security Reviewer Specifics

- Focus areas: Authentication/authorization, input validation, data exposure, injection vulnerabilities, dependency vulnerabilities, encryption/hashing, OWASP-aligned checks
- Context loads: story.md, context/index.md, context/architecture.md (for security architecture patterns), context/standards.md, security-related risk notes from `_scrum-output/memory/risks/`
- Severity categories: Vulnerability, Authentication, Authorization, Data Exposure, Input Validation, Dependency Risk
- Dispatched when: `risk_level: high` or `risk_level: critical`

### UX Reviewer Specifics

- Focus areas: Usability heuristics, accessibility (WCAG, UX-DR16 contrast 4.5:1, UX-DR17 keyboard nav, UX-DR18 screen reader), design consistency (UX-DR6 through UX-DR15), interaction patterns, progressive disclosure (UX-DR3), responsive layout
- Context loads: story.md, context/index.md, context/frontend.md (for frontend patterns), context/standards.md, UX design specification
- Severity categories: Usability, Accessibility, Consistency, Interaction, Layout
- Dispatched when: domain_tags include `frontend`, `ui`, or `ux`

### Contract Validator Specifics

- Focus areas: Story-to-implementation traceability, acceptance criteria coverage, API contract verification, schema compliance, artifact contract compliance (FR-46), write boundary compliance (FR-9), naming convention adherence
- Context loads: story.md, plan.md, context/index.md, context/standards.md, implementation source code
- Severity categories: Contract Violation, Missing Implementation, Schema Mismatch, Naming Violation, Write Boundary Violation
- Dispatched when: domain_tags include `api`, `contract`, or `integration`

### File Structure Requirements

**New files:**
- `scrum_workflow/agents/security-reviewer.md` — Security Reviewer agent definition
- `scrum_workflow/agents/ux-reviewer.md` — UX Reviewer agent definition
- `scrum_workflow/agents/contract-validator.md` — Contract Validator agent definition
- `scrum_workflow/__tests__/extended-agent-types/extended-agent-types.test.md` — BDD scenario documentation

**Modified files:**
- `scrum_workflow/agents/README.md` — Add extended agents to agent listing

**Sync targets (artifact contract — 8 files):**
- `create-scrum-workflow/scrum_workflow/agents/security-reviewer.md`
- `create-scrum-workflow/templates/scrum_workflow/agents/security-reviewer.md`
- `create-scrum-workflow/scrum_workflow/agents/ux-reviewer.md`
- `create-scrum-workflow/templates/scrum_workflow/agents/ux-reviewer.md`
- `create-scrum-workflow/scrum_workflow/agents/contract-validator.md`
- `create-scrum-workflow/templates/scrum_workflow/agents/contract-validator.md`
- `create-scrum-workflow/scrum_workflow/agents/README.md`
- `create-scrum-workflow/templates/scrum_workflow/agents/README.md`

**Do NOT modify:**
- `scrum_workflow/agents/architect.md` — Existing agent, unchanged
- `scrum_workflow/agents/developer.md` — Existing agent, unchanged
- `scrum_workflow/agents/qa.md` — Existing agent, unchanged
- `scrum_workflow/skills/agent-dispatcher/SKILL.md` — Dispatcher already references these agents, no changes needed
- `scrum_workflow/data/dispatch-rules.yaml` — Rules already reference these agents, no changes needed
- `scrum_workflow/commands/refine-ticket.md` — Command already supports dynamic dispatch, no changes needed
- `scrum_workflow/workflows/refinement.md` — Workflow already supports dynamic agent loop, no changes needed
- `scrum_workflow/config.yaml` — No new config entries needed
- `scrum_workflow/skills/story-classifier/SKILL.md` — Classifier is complete (Story 9.1)
- `scrum_workflow/skills/adaptive-depth-selector/SKILL.md` — Depth selector is complete (Story 9.2)

### Library & Framework Requirements

- No new dependencies. This is pure Markdown-as-Code — agent definitions are `.md` files read by the AI platform at runtime.
- Tests use Vitest framework (`vitest.config.js`). ATDD spec files go in `tests/unit/extended-agent-types/`. BDD scenario docs go in `scrum_workflow/__tests__/extended-agent-types/`.

### Testing Standards

- **ATDD approach:** Write test specs in `tests/unit/extended-agent-types/ac{N}-*.spec.ts` with `test.skip` initially (RED phase), then unskip after implementation (GREEN phase).
- **BDD scenarios:** Write `.test.md` scenarios in `scrum_workflow/__tests__/extended-agent-types/` following existing `__tests__/agent-dispatcher/` and `__tests__/classification/` patterns.
- **Test data patterns:** Tests verify file existence, frontmatter fields, body section presence, context rules content, and sync target consistency. Follow the agent-dispatcher test patterns (ac4 tests agent file existence).
- **Coverage:** Each AC must have at least one corresponding test file.
- **Regression awareness:** 697 tests currently pass (as of Story 9.3 completion). 15 pre-existing failed test files remain. Ensure zero new regressions.

### Previous Story Intelligence (Story 9.3)

**Critical learnings from Story 9.3 (Dynamic Agent Dispatcher):**
- Dispatcher already references `security-reviewer`, `ux-reviewer`, `contract-validator` in dispatch-rules.yaml. These are the exact file names to create.
- Dispatcher validates agent file existence via `scrum_workflow/agents/{name}.md` path. Creating the files is sufficient for discovery.
- Story 9.3 had 8 sync targets. This story has 8 sync targets (3 agents x 2 locations + README x 2 locations).
- Story 9.3 review fixed hardcoded agent references — ensure new agents don't introduce any hardcoded references in existing files.
- 102 ATDD tests + BDD doc pattern established in 9.3 — follow same test naming and structure.
- Story 9.3 ended with 697 passing tests.

**Learnings from Story 9.2 (Adaptive Depth Selection):**
- Review finding (deferred): Story template sync drift in create-scrum-workflow/templates — verify sync targets are up to date.
- Critical pattern: Skills/agents are read-only specifications. The calling workflow uses their output.

**Learnings from Story 9.1 (Story Classifier):**
- Classifier provides `type`, `risk_level`, `domain_tags` in frontmatter. These are the inputs the dispatcher uses to select extended agents.
- 53 unit tests pattern established.

### Cross-Story Context (Epic 9)

- **Story 9.1 (Story Classifier):** DONE. Provides `type`, `risk_level`, `domain_tags` in story frontmatter. These attributes drive dispatcher selection of extended agents.
- **Story 9.2 (Adaptive Depth Selection):** DONE. Provides `depth` in story frontmatter. Light depth short-circuits to `[developer]` only — extended agents are never dispatched for light depth.
- **Story 9.3 (Dynamic Agent Dispatcher):** DONE. Dispatch rules and skill already reference these three agents. Creating the agent files completes the dispatch chain. After this story, the full adaptive workflow pipeline is operational: classify -> select depth -> dispatch agents (including extended types).
- **This is the FINAL story in Epic 9.** Completing this story means the full Adaptive Workflows & Intelligence epic is complete.

### Anti-Pattern Prevention

- **Do NOT create agent files as subdirectories.** Agents use flat file pattern: `scrum_workflow/agents/{name}.md`. NOT `scrum_workflow/agents/{name}/agent.md`. (Note: The epics.md mentions `security-reviewer/agent.md` but this contradicts the Architecture structure pattern which specifies flat files for agents. Follow the Architecture and existing agent patterns.)
- **Do NOT modify existing agent files** (architect.md, developer.md, qa.md). These are complete and unchanged.
- **Do NOT modify dispatch-rules.yaml.** Rules already reference the three extended agent names. No changes needed.
- **Do NOT modify agent-dispatcher SKILL.md.** The dispatcher already handles these agents via its generic file-existence check.
- **Do NOT modify refinement.md or refine-ticket.md.** The dynamic agent loop from Story 9.3 already handles variable agent counts including extended agents.
- **Do NOT add new config entries.** The `agent_dispatch_enabled` flag from Story 9.3 controls all dispatch behavior.
- **Do NOT use different model or max_tokens values.** All agents use `model: claude-sonnet-4` and `max_tokens: 2000` for consistency.
- **Do NOT create perspectives that reference other agents.** Each agent's Output Format must be self-contained. Cross-agent awareness happens only during cross-talk phase, managed by the refinement workflow.
- **Do NOT skip the sync step.** All agent files MUST be synced to both `create-scrum-workflow/scrum_workflow/agents/` and `create-scrum-workflow/templates/scrum_workflow/agents/`. Missing syncs were flagged in Story 9.2 review.

### Project Structure Notes

- Alignment: New agent files follow existing flat file pattern in `scrum_workflow/agents/` (consistent with `architect.md`, `developer.md`, `qa.md`, `documentarian.md`, `researcher.md`)
- Alignment: Agent frontmatter schema matches existing agents exactly (name, display_name, role, active_in, model, max_tokens)
- Alignment: Output Format matches existing perspective pattern (Findings table, Recommendations, Proposed Acceptance Criteria)
- Alignment: Context Rules follow existing context loading pattern (story.md first, then context files, then domain-specific)
- Note: epics.md references `security-reviewer/agent.md` (subdirectory pattern) but Architecture and all existing agents use flat file pattern `{name}.md`. Use flat file pattern.
- No conflicts detected with existing project structure

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-9, Story 9.4] — Story definition with user story and BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#FR-35] — Extended agent types: Security Reviewer, UX Reviewer, Contract Validator
- [Source: _bmad-output/planning-artifacts/prd.md#FR-34] — Dynamic agent dispatch (Story 9.3, provides dispatch integration)
- [Source: _bmad-output/planning-artifacts/prd.md#FR-44] — Runtime file-based extension model (agents discovered by file existence)
- [Source: _bmad-output/planning-artifacts/prd.md#FR-12] — Refinement agents with isolated context
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns] — Agent naming (flat file `{name}.md`), structure patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Cross-Agent-Communication-Patterns] — Context isolation per agent type
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR6-to-UX-DR20] — UX design requirements referenced by UX Reviewer agent
- [Source: scrum_workflow/agents/architect.md] — Existing agent pattern reference (frontmatter schema + body structure)
- [Source: scrum_workflow/agents/developer.md] — Existing agent pattern reference
- [Source: scrum_workflow/agents/qa.md] — Existing agent pattern reference
- [Source: scrum_workflow/agents/README.md] — Agent directory README to update
- [Source: scrum_workflow/data/dispatch-rules.yaml] — Dispatch rules already referencing extended agents (DO NOT MODIFY)
- [Source: scrum_workflow/skills/agent-dispatcher/SKILL.md] — Dispatcher skill that validates agent file existence (DO NOT MODIFY)
- [Source: _bmad-output/implementation-artifacts/9-3-implement-dynamic-agent-dispatcher.md] — Previous story learnings, dispatch integration details, test patterns
- [Source: _bmad-output/implementation-artifacts/9-2-implement-adaptive-workflow-depth-selection.md] — Depth selection context, sync drift warning
- [Source: _bmad-output/implementation-artifacts/9-1-implement-story-classifier.md] — Classification context, provides frontmatter fields for dispatch

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 Thinking (claude-opus-4-6-thinking)

### Debug Log References

- Fixed 3 regex patterns in ac2-runtime-discovery.spec.ts (tests 2.8, 2.9, 2.10) that used lazy lookaheads (`[\s\S]*?(?=\n\s*\w+:|$)`) which stopped too early in YAML sections. Replaced with `[\s\S]*?description:[^\n]*` to capture full YAML section blocks.
- Updated Story 9.3 test ac4-fallback-and-missing-agents.spec.ts test 4.11 to expect agent files exist (they were created by this story, reversing the pre-Story-9.4 assertion).

### Completion Notes List

- ✅ Task 1: Created security-reviewer.md with full frontmatter (name, display_name, role, active_in, model, max_tokens) and 4 body sections (Identity, Instructions, Output Format, Context Rules). 8 numbered instruction items covering authentication, input validation, data exposure, encryption, dependency vulnerabilities, security anti-patterns, OWASP alignment, severity classification.
- ✅ Task 2: Created ux-reviewer.md with full frontmatter and 4 body sections. Instructions reference WCAG compliance, UX-DR16 contrast 4.5:1, UX-DR17 keyboard navigation, UX-DR18 screen reader, UX-DR6 through UX-DR15 design consistency, UX-DR3 progressive disclosure.
- ✅ Task 3: Created contract-validator.md with full frontmatter and 4 body sections. Instructions cover story-to-implementation traceability, AC coverage, API contract verification, schema compliance, FR-46 artifact contract, FR-9 write boundaries, naming conventions.
- ✅ Task 4: Updated README.md — renamed "Current Agents (MVP)" to "Core Agents", added "Extended Agents (Phase 4)" section with all 3 new agents described.
- ✅ Task 5: Synced all 8 distribution targets (3 agents × 2 locations + README × 2 locations). All files identical to source.
- ✅ Task 6: Unskipped all 105 ATDD tests across 4 test files, fixed 3 regex patterns in ac2, created BDD scenario doc with 8 scenarios. All 105 tests pass. Updated 1 Story 9.3 test (test 4.11) to reflect new agent existence. Full regression suite: 802 passed, 15 pre-existing failures, 0 new regressions.
- Epic 9 (Adaptive Workflows & Intelligence) is now complete: Stories 9.1 (classifier), 9.2 (depth selector), 9.3 (dispatcher), and 9.4 (extended agents) all done.

### File List

New files:
- scrum_workflow/agents/security-reviewer.md
- scrum_workflow/agents/ux-reviewer.md
- scrum_workflow/agents/contract-validator.md
- scrum_workflow/__tests__/extended-agent-types/extended-agent-types.test.md
- create-scrum-workflow/scrum_workflow/agents/security-reviewer.md (sync)
- create-scrum-workflow/scrum_workflow/agents/ux-reviewer.md (sync)
- create-scrum-workflow/scrum_workflow/agents/contract-validator.md (sync)
- create-scrum-workflow/templates/scrum_workflow/agents/security-reviewer.md (sync)
- create-scrum-workflow/templates/scrum_workflow/agents/ux-reviewer.md (sync)
- create-scrum-workflow/templates/scrum_workflow/agents/contract-validator.md (sync)

Modified files:
- scrum_workflow/agents/README.md
- create-scrum-workflow/scrum_workflow/agents/README.md (sync)
- create-scrum-workflow/templates/scrum_workflow/agents/README.md (sync)
- tests/unit/extended-agent-types/ac1-agent-file-structure.spec.ts (unskipped tests)
- tests/unit/extended-agent-types/ac2-runtime-discovery.spec.ts (unskipped tests, fixed 3 regex patterns)
- tests/unit/extended-agent-types/ac3-context-isolation.spec.ts (unskipped tests)
- tests/unit/extended-agent-types/ac4-sync-targets.spec.ts (unskipped tests)
- tests/unit/agent-dispatcher/ac4-fallback-and-missing-agents.spec.ts (updated test 4.11 for agent existence)

### Review Findings

- [x] [Review][Patch] README.md misleading "in SKILL.md format" — changed to "as Markdown files with YAML frontmatter" [scrum_workflow/agents/README.md:3] — fixed, synced to 2 distribution targets
- [x] [Review][Patch] Stale TDD Phase comments "RED (tests skipped)" — updated to "GREEN (tests active — implementation complete)" [tests/unit/extended-agent-types/ac{1-4}-*.spec.ts:4] — fixed in all 4 test files
- [x] [Review][Defer] dispatch-rules.yaml stale "Until then" comment referencing Story 9.4 as future [scrum_workflow/data/dispatch-rules.yaml:135-136] — deferred, pre-existing (DO NOT MODIFY per story scope)

### Change Log

- 2025-07-15: Story 9.4 implementation complete — Created 3 extended agent definitions (security-reviewer, ux-reviewer, contract-validator), updated README, synced to 8 distribution targets, unskipped and passed 105 ATDD tests, created BDD scenario doc. Updated 1 Story 9.3 test for compatibility. Zero regressions. Epic 9 complete.
