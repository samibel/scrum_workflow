# Story 9.2: Implement Adaptive Workflow Depth Selection

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the system to automatically select workflow depth (Light/Standard/Heavy) based on story risk classification,
so that low-risk work moves fast and high-risk work gets thorough treatment.

## Acceptance Criteria

1. **Given** FR-33 specifies automatic workflow depth selection based on risk classification, **When** a story has been classified by the story-classifier (Story 9.1), **Then** the system selects workflow depth: `light` for `risk_level: low`, `standard` for `risk_level: medium`, `heavy` for `risk_level: high` or `critical`, **And** the selected `depth` is stored in the `story.md` YAML frontmatter.

2. **Given** FR-36 specifies configurable risk thresholds in `config.yaml`, **When** the depth selection runs, **Then** the risk-to-depth mapping thresholds are read from `config.yaml` under a `workflow_depth_thresholds` section, **And** the thresholds can be customized by the developer (e.g., mapping `medium` risk to `light` depth for teams preferring faster cycles).

3. **Given** SC-12 specifies process bypass rate = 0 (adaptive workflow depth works), **When** depth is automatically selected, **Then** the developer is informed of the selected depth via a console message (e.g., "Depth auto-selected: heavy (risk: high)"), **And** the developer can override it via `--depth` flag, **And** the `depth_source` field in frontmatter records whether selection was automatic (`classifier`) or manual (`adaptive-workflow-override`).

4. **Given** the developer wants to override the automatic classification, **When** the developer provides a `--depth light|standard|heavy` flag explicitly during ticket creation, **Then** the manual override takes precedence over automatic classification, **And** a `depth_source: adaptive-workflow-override` field is set in the frontmatter, **And** the override mechanism accepts: `--depth light`, `--depth standard`, or `--depth heavy`.

## Tasks / Subtasks

- [x] Task 1: Add configurable depth thresholds to `config.yaml` (AC: #2)
  - [x] 1.1 Add `workflow_depth_thresholds` section to `scrum_workflow/config.yaml` with default mapping: `low: light`, `medium: standard`, `high: heavy`, `critical: heavy`
  - [x] 1.2 Add inline YAML comments documenting each threshold and customization options
  - [x] 1.3 Sync config changes to `create-scrum-workflow/scrum_workflow/config.yaml` and `create-scrum-workflow/templates/scrum_workflow/config.yaml` (artifact contract)

- [x] Task 2: Create Adaptive Depth Selector skill (AC: #1, #2)
  - [x] 2.1 Create `scrum_workflow/skills/adaptive-depth-selector/SKILL.md` following existing skill pattern (frontmatter: name, role, description)
  - [x] 2.2 Implement Identity section: read-only skill that reads `risk_level` from story frontmatter and `workflow_depth_thresholds` from config.yaml, returns selected depth
  - [x] 2.3 Implement Instructions section: threshold lookup algorithm — read risk_level, load thresholds from config, map to depth value
  - [x] 2.4 Define fallback: if risk_level is missing or invalid, default to `standard` (safe default); if thresholds config is missing, use hardcoded defaults
  - [x] 2.5 Define Output Format: structured YAML result with `depth`, `depth_source`, `selection_reason`
  - [x] 2.6 Define Context Rules: reads story `risk_level` from frontmatter + `workflow_depth_thresholds` from config.yaml; never writes files

- [x] Task 3: Integrate depth selector into create-ticket command (AC: #1, #3, #4)
  - [x] 3.1 Update `scrum_workflow/commands/create-ticket.md`: after Story Classification section, add Adaptive Depth Selection section that invokes the adaptive-depth-selector skill
  - [x] 3.2 Integration flow: classifier runs first -> populates risk_level -> depth selector reads risk_level -> returns depth
  - [x] 3.3 Add `--depth` override logic: if `--depth` flag is provided by developer, skip depth selector, use flag value, set `depth_source: adaptive-workflow-override`
  - [x] 3.4 If no `--depth` flag, run depth selector, set `depth_source: classifier`
  - [x] 3.5 Update Output section: add `depth_source` field to frontmatter spec, expand `depth` valid values to include `heavy`
  - [x] 3.6 Update error handling: expand invalid depth error to accept `light`, `standard`, or `heavy` (currently only `light` or `standard`)
  - [x] 3.7 Add console output: inform developer of auto-selected depth (e.g., "Depth auto-selected: heavy (risk: high)")
  - [x] 3.8 Sync create-ticket.md to `create-scrum-workflow/scrum_workflow/commands/create-ticket.md` and `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md`

- [x] Task 4: Add `heavy` depth support to refine-ticket command (AC: #1)
  - [x] 4.1 Update `scrum_workflow/commands/refine-ticket.md`: add `heavy` to the depth table alongside `light` and `standard`
  - [x] 4.2 Define `heavy` depth behavior: 3 agents (Architect, Developer, QA) + max cross-talk rounds (use `refinement_max_rounds` from config, no early exit on consensus) + synthesis + Wideband Delphi + mandatory security check note in refinement artifact
  - [x] 4.3 Update depth detection logic: if `depth` field is `heavy`, apply heavy workflow; if missing or invalid, default to `standard`
  - [x] 4.4 Sync refine-ticket.md to `create-scrum-workflow/` copies

- [x] Task 5: Update story template with `depth` and `depth_source` fields (AC: #1, #3)
  - [x] 5.1 Add `depth: "{{depth}}"` field to `scrum_workflow/templates/story.md` frontmatter (after `risk_level`, before `domain_tags`)
  - [x] 5.2 Add `depth_source: "{{depth_source}}"` field to template frontmatter (after `depth`)
  - [x] 5.3 Sync template to `create-scrum-workflow/templates/scrum_workflow/templates/story.md`

- [x] Task 6: Write ATDD tests (AC: #1, #2, #3, #4)
  - [x] 6.1 Create `tests/unit/adaptive-depth/ac1-risk-to-depth-mapping.spec.ts` — tests for low->light, medium->standard, high->heavy, critical->heavy mappings
  - [x] 6.2 Create `tests/unit/adaptive-depth/ac2-configurable-thresholds.spec.ts` — tests for custom threshold overrides in config.yaml
  - [x] 6.3 Create `tests/unit/adaptive-depth/ac3-developer-notification-override.spec.ts` — tests for depth_source field, console output, and manual override precedence
  - [x] 6.4 Create `tests/unit/adaptive-depth/ac4-heavy-depth-behavior.spec.ts` — tests for heavy depth in refine-ticket, valid depth values include heavy
  - [x] 6.5 Create BDD scenario doc: `scrum_workflow/__tests__/adaptive-depth/adaptive-depth-selector.test.md`

## Dev Notes

### Architecture Compliance

- **Markdown-as-Code paradigm (AD-001):** The adaptive depth selector is implemented as a SKILL.md specification, not imperative code. The AI agent reads and executes the threshold lookup at runtime.
- **Runtime discovery (FR-44, NFR-11):** New skill directory `scrum_workflow/skills/adaptive-depth-selector/SKILL.md` is auto-discovered — no registration, build step, or restart needed.
- **Write boundaries:** The depth selector skill is READ-ONLY (same pattern as story-classifier and status-guard-validation). It returns structured results; the calling workflow (create-ticket) writes the frontmatter.
- **Token efficiency (NFR-1):** Depth selection uses simple threshold lookup from config.yaml — minimal token usage, well within sub_agent budget of 2000 tokens.

### Technical Requirements

- **Valid depth values:** `light`, `standard`, `heavy` (expanding from current `light`/`standard` — FR-33 adds `heavy`). Use lowercase.
- **Valid depth_source values:** `classifier` (auto-selected by adaptive depth), `adaptive-workflow-override` (developer used --depth flag), `default` (no classifier, no flag — legacy fallback).
- **Default risk-to-depth mapping (FR-33):**
  - `low` -> `light`
  - `medium` -> `standard`
  - `high` -> `heavy`
  - `critical` -> `heavy`
- **Configurable thresholds (FR-36):** Stored in `config.yaml` under `workflow_depth_thresholds`. Developers can remap any risk_level to any depth.
- **Override precedence:** `--depth` flag > adaptive depth selector > default (`standard`).
- **Story frontmatter fields:** `depth` (the selected depth value) and `depth_source` (how it was determined).

### Heavy Depth Definition

The `heavy` depth is a new workflow depth that provides maximum rigor for high-risk stories:

| Aspect | Light | Standard | Heavy |
|--------|-------|----------|-------|
| Agents | 1 (Developer only) | 3 (Architect, Developer, QA) | 3 (Architect, Developer, QA) |
| Cross-talk | Disabled | Enabled (up to N rounds, early exit) | Enabled (max rounds, NO early exit) |
| Synthesis | Disabled | Enabled | Enabled |
| Estimation | Single agent | Wideband Delphi | Wideband Delphi |
| Security note | No | No | Mandatory note in refinement artifact |
| Readiness validation | 5 criteria (unchanged) | 5 criteria (unchanged) | 5 criteria (unchanged) |

**Key difference from standard:** Heavy disables `early_exit_on_consensus` for cross-talk, ensuring all rounds complete. A mandatory security consideration note is added to the refinement artifact reminding the reviewer that this is a high-risk story.

**Note:** Story 9.3 (Dynamic Agent Dispatcher) will later enhance heavy depth by dispatching specialized agents (Security Reviewer, etc.). This story only adds the depth value and selection mechanism.

### File Structure Requirements

**New files:**
- `scrum_workflow/skills/adaptive-depth-selector/SKILL.md` — Depth selection skill (follows `{skill-name}/SKILL.md` subdirectory pattern)

**Modified files:**
- `scrum_workflow/config.yaml` — Add `workflow_depth_thresholds` section
- `scrum_workflow/commands/create-ticket.md` — Add Adaptive Depth Selection section after Story Classification, expand valid depth values to include `heavy`
- `scrum_workflow/commands/refine-ticket.md` — Add `heavy` depth behavior column, update depth detection
- `scrum_workflow/templates/story.md` — Add `depth` and `depth_source` fields to frontmatter (addresses deferred gap from Story 9.1 review)

**Sync targets (artifact contract):**
- `create-scrum-workflow/scrum_workflow/config.yaml`
- `create-scrum-workflow/templates/scrum_workflow/config.yaml`
- `create-scrum-workflow/scrum_workflow/commands/create-ticket.md`
- `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md`
- `create-scrum-workflow/scrum_workflow/commands/refine-ticket.md`
- `create-scrum-workflow/templates/scrum_workflow/commands/refine-ticket.md`
- `create-scrum-workflow/templates/scrum_workflow/templates/story.md`

**Do NOT modify:**
- `scrum_workflow/skills/story-classifier/SKILL.md` — Classifier is complete (Story 9.1)
- `scrum_workflow/data/classification-rules.yaml` — Classification rules are complete (Story 9.1)

### Library & Framework Requirements

- No new dependencies. This is a Markdown-as-Code skill executed by the AI agent at runtime.
- Config thresholds in YAML format (consistent with existing `config.yaml` patterns).
- Tests use Vitest framework (`vitest.config.js`). ATDD spec files go in `tests/unit/adaptive-depth/`. BDD scenario docs go in `scrum_workflow/__tests__/adaptive-depth/`.

### Testing Standards

- **ATDD approach:** Write test specs in `tests/unit/adaptive-depth/ac{N}-*.spec.ts` with `test.skip` initially (RED phase), then unskip after implementation (GREEN phase).
- **BDD scenarios:** Write `.test.md` scenarios in `scrum_workflow/__tests__/adaptive-depth/` (following existing `__tests__/classification/` pattern from Story 9.1).
- **Test data patterns:** Use the existing story-classifier test patterns as reference — they test YAML frontmatter fields and skill output structure.
- **Coverage:** Each AC must have at least one corresponding test file.

### Previous Story Intelligence (Story 9.1)

**Learnings from Story 9.1 implementation:**
- Story classifier created at `scrum_workflow/skills/story-classifier/SKILL.md` with 4-phase algorithm (keyword extraction, domain tag analysis, content heuristics, confidence scoring).
- Classification rules stored in `scrum_workflow/data/classification-rules.yaml`.
- Classifier integrated into `scrum_workflow/commands/create-ticket.md` under "Story Classification" section — the adaptive depth section should go AFTER this section.
- **Review finding (deferred):** "Story template missing `depth` and `classification_confidence` fields" — Task 5 of this story addresses the `depth` field gap. The `classification_confidence` field addition remains optional (not in scope).
- **Critical pattern:** The classifier is read-only and returns structured results. The calling workflow writes frontmatter. Follow the same pattern for the depth selector.
- **Artifact contract sync:** Story 9.1 had to sync `create-ticket.md` to 2 additional copies in `create-scrum-workflow/`. The same sync is required for this story.
- **Test pattern:** 53 unit tests across 3 spec files (ac1, ac2, ac3) + BDD scenario doc. Follow the same naming convention (`ac{N}-*.spec.ts`).
- Story 9.1 completion notes: "Unskipped all 46 previously-skipped Vitest tests" — tests are written with `test.skip` first, then unskipped when implementation is complete.

**Files created by Story 9.1 (do not recreate):**
- `scrum_workflow/skills/story-classifier/SKILL.md`
- `scrum_workflow/data/classification-rules.yaml`
- `scrum_workflow/__tests__/classification/story-classifier.test.md`

### Cross-Story Context (Epic 9)

- **Story 9.1 (Story Classifier):** DONE. Provides `type` and `risk_level` in story frontmatter. This story's depth selector reads `risk_level` from the classifier's output.
- **Story 9.3 (Dynamic Agent Dispatcher):** NEXT. Will use `depth`, `type`, `risk_level`, and `domain_tags` to select which agents to spawn. Story 9.2 stores the `depth` value that 9.3 will consume.
- **Story 9.4 (Extended Agent Types):** Creates Security/UX/Contract agents. The `heavy` depth defined here will later trigger extended agent selection in 9.3.
- **Story 5.1 (Manual Workflow Depth Override):** DONE. Already implemented `--depth light/standard` flag and light/standard branching in refine-ticket. This story EXTENDS the mechanism to add `heavy` and automatic selection.

### Anti-Pattern Prevention

- **Do NOT create a new CLI command** for depth selection. The depth selector is a skill invoked internally by `/scrum-create-ticket` after the classifier.
- **Do NOT modify the story-classifier skill.** Classification (Story 9.1) and depth selection (this story) are separate concerns. The classifier outputs risk_level; the depth selector reads risk_level.
- **Do NOT implement dynamic agent dispatch** in this story. Agent selection based on depth/type/domain_tags is Story 9.3. This story only selects and stores the depth value.
- **Do NOT break existing `--depth light/standard` behavior.** The manual override mechanism from Story 5.1 must continue working. This story adds `heavy` as a third valid value and automatic selection as an enhancement.
- **Do NOT modify the 9-state lifecycle** or add new states. Depth selection happens within the existing `draft` state creation.
- **Do NOT hardcode thresholds.** Risk-to-depth mapping must be configurable in `config.yaml` (FR-36). Hardcoded defaults are only fallback when config section is missing.

### Config.yaml Addition Specification

Add the following section to `scrum_workflow/config.yaml` (after `security_auto_blocker: true`, before `framework_version`):

```yaml
# Adaptive workflow depth thresholds (FR-33, FR-36)
# Maps story risk_level (from story-classifier) to workflow depth
# Customize these to adjust process rigor per risk level
# Valid depth values: light, standard, heavy
workflow_depth_thresholds:
  low: light          # Low-risk stories get lightweight process
  medium: standard    # Medium-risk stories get full standard process
  high: heavy         # High-risk stories get maximum rigor
  critical: heavy     # Critical-risk stories get maximum rigor
```

### Project Structure Notes

- Alignment: New skill follows existing `skills/{name}/SKILL.md` subdirectory pattern (consistent with `story-classifier`, `feedback-collection`, `guided-mode`, `prerequisite-validation`, `readiness-check`, `status-guard-validation`, `story-validation`, `synthesis`)
- Alignment: Config addition follows existing `config.yaml` pattern (YAML with comments, flat key-value or shallow nested)
- Alignment: Command modification follows existing command spec format with frontmatter (name, trigger, requires_status, sets_status, spawns_agents)
- Addresses deferred gap from Story 9.1 code review: adds `depth` field to story template
- No conflicts detected with existing project structure

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-9, Story 9.2] — Story definition with user story and BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#FR-33] — Automatic workflow depth selection based on risk classification
- [Source: _bmad-output/planning-artifacts/prd.md#FR-36] — Configurable risk thresholds in config.yaml
- [Source: _bmad-output/planning-artifacts/prd.md#FR-3] — Manual depth override (`--depth light/standard`, extended to `heavy`)
- [Source: _bmad-output/planning-artifacts/prd.md#SC-12] — Process bypass rate = 0 (adaptive workflow depth works)
- [Source: _bmad-output/planning-artifacts/prd.md#UJ-5] — High-risk story gets extended treatment user journey
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns] — Naming, structure, format, write boundary patterns
- [Source: scrum_workflow/config.yaml] — Framework config where thresholds will be added
- [Source: scrum_workflow/commands/create-ticket.md] — Command where depth selection will be integrated (after Story Classification section)
- [Source: scrum_workflow/commands/refine-ticket.md] — Command where heavy depth behavior will be defined
- [Source: scrum_workflow/templates/story.md] — Template where depth and depth_source fields will be added
- [Source: scrum_workflow/skills/story-classifier/SKILL.md] — Upstream classifier that provides risk_level (DO NOT MODIFY)
- [Source: scrum_workflow/data/classification-rules.yaml] — Classification rules (DO NOT MODIFY)
- [Source: _bmad-output/implementation-artifacts/9-1-implement-story-classifier.md] — Previous story learnings and patterns
- [Source: _bmad-output/implementation-artifacts/5-1-implement-manual-workflow-depth-override.md] — Existing depth override implementation

## Dev Agent Record

### Agent Model Used

Claude Opus 4 (claude-opus-4-6-thinking)

### Debug Log References

No debug issues encountered. All 67 ATDD tests passed on first implementation with one minor fix (adjusted Input section wording to avoid regex pattern conflict in test 1.20).

### Completion Notes List

- Task 1: Added `workflow_depth_thresholds` section to `scrum_workflow/config.yaml` with FR-33/FR-36 references, inline comments, and default mapping (low: light, medium: standard, high: heavy, critical: heavy). Synced to both create-scrum-workflow config copies.
- Task 2: Created `scrum_workflow/skills/adaptive-depth-selector/SKILL.md` as a read-only skill following the story-classifier pattern. Includes Identity, Instructions (3-step threshold lookup algorithm), Output Format (depth, depth_source, selection_reason), fallback behavior, and Context Rules.
- Task 3: Integrated adaptive-depth-selector into `scrum_workflow/commands/create-ticket.md`. Added "Adaptive Depth Selection" section after Story Classification. Updated Input to accept `--depth light|standard|heavy`. Added override precedence logic, console notification format, depth_source field to Output, and expanded invalid depth error handling. Synced to both create-scrum-workflow copies.
- Task 4: Added heavy depth support to `scrum_workflow/commands/refine-ticket.md`. Updated depth table with heavy column (3 agents, max rounds with NO early exit, synthesis, Wideband Delphi, mandatory security note). Updated Discussion Rounds and Estimation sections for heavy depth behavior. Synced to both create-scrum-workflow copies.
- Task 5: Added `depth: "{{depth}}"` and `depth_source: "{{depth_source}}"` fields to `scrum_workflow/templates/story.md` frontmatter after `risk_level`. Synced to `create-scrum-workflow/templates/scrum_workflow/templates/story.md`.
- Task 6: Unskipped all 67 previously-skipped ATDD tests across 4 spec files (ac1: 21 tests, ac2: 13 tests, ac3: 17 tests, ac4: 16 tests). All 67 tests pass. Created BDD scenario doc with 10 scenarios at `scrum_workflow/__tests__/adaptive-depth/adaptive-depth-selector.test.md`.
- Full regression suite: 16 pre-existing failed test files (unchanged), 0 new regressions. 593 tests pass (up from 525).

### File List

**New files:**
- `scrum_workflow/skills/adaptive-depth-selector/SKILL.md` — Adaptive depth selector skill specification
- `scrum_workflow/__tests__/adaptive-depth/adaptive-depth-selector.test.md` — BDD scenario documentation

**Modified files:**
- `scrum_workflow/config.yaml` — Added `workflow_depth_thresholds` section (FR-33, FR-36)
- `scrum_workflow/commands/create-ticket.md` — Added Adaptive Depth Selection section, updated Input/Output/Error Handling for `heavy` depth and `depth_source`
- `scrum_workflow/commands/refine-ticket.md` — Added heavy depth column to depth table, updated Purpose/Discussion/Estimation sections, added Heavy Depth output section
- `scrum_workflow/templates/story.md` — Added `depth` and `depth_source` fields to YAML frontmatter
- `tests/unit/adaptive-depth/ac1-risk-to-depth-mapping.spec.ts` — Unskipped 21 tests (test.skip -> test)
- `tests/unit/adaptive-depth/ac2-configurable-thresholds.spec.ts` — Unskipped 13 tests (test.skip -> test)
- `tests/unit/adaptive-depth/ac3-developer-notification-override.spec.ts` — Unskipped 17 tests (test.skip -> test)
- `tests/unit/adaptive-depth/ac4-heavy-depth-behavior.spec.ts` — Unskipped 16 tests (test.skip -> test)

**Synced files (artifact contract):**
- `create-scrum-workflow/scrum_workflow/config.yaml` — Synced workflow_depth_thresholds
- `create-scrum-workflow/templates/scrum_workflow/config.yaml` — Synced workflow_depth_thresholds
- `create-scrum-workflow/scrum_workflow/commands/create-ticket.md` — Synced full create-ticket.md
- `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md` — Synced full create-ticket.md
- `create-scrum-workflow/scrum_workflow/commands/refine-ticket.md` — Synced full refine-ticket.md
- `create-scrum-workflow/templates/scrum_workflow/commands/refine-ticket.md` — Synced full refine-ticket.md
- `create-scrum-workflow/templates/scrum_workflow/templates/story.md` — Added depth and depth_source fields

## Change Log

- Implemented adaptive workflow depth selection (FR-33, FR-36) — automatic risk-to-depth mapping with configurable thresholds, --depth heavy support, and depth_source tracking. Unskipped all 67 ATDD tests. (Date: 2025-07-11)
- Code review completed. 1 patch applied (stale TDD Phase comments updated from RED to GREEN in 4 test files). 1 pre-existing issue deferred (story template sync drift in create-scrum-workflow/templates). All 67 story tests pass. Story marked done. (Date: 2025-07-11)
