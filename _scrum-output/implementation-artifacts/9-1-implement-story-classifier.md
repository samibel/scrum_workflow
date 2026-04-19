# Story 9.1: Implement Story Classifier

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the system to automatically classify stories by type and risk level at creation time,
so that the workflow depth adapts to the nature of the work.

## Acceptance Criteria

1. **Given** FR-32 specifies classification by type (feature, bugfix, refactor, infrastructure) and risk level (low, medium, high, critical), **When** a developer runs `/scrum-create-ticket`, **Then** the system analyzes the story description and assigns a `type` and `risk_level` in the YAML frontmatter, **And** classification is based on keywords, domain tags, and content analysis.

2. **Given** the classification is automatic, **When** the developer reviews the created story, **Then** the assigned type and risk_level are visible in the frontmatter, **And** the developer can override the classification manually if the system's assessment is incorrect.

3. **Given** edge cases where classification is ambiguous, **When** the classifier cannot determine a clear type or risk level, **Then** it defaults to `type: feature` and `risk_level: medium` (safe defaults), **And** a note is added suggesting the developer review the classification.

## Tasks / Subtasks

- [x] Task 1: Create classification reference data file (AC: #1)
  - [x] 1.1 Create `scrum_workflow/data/classification-rules.yaml` with keyword-to-type mappings (feature, bugfix, refactor, infrastructure)
  - [x] 1.2 Add keyword-to-risk-level mappings (low, medium, high, critical) based on domain/content signals
  - [x] 1.3 Add domain-tag-to-risk associations (e.g., `security` -> high, `ui-cosmetic` -> low)

- [x] Task 2: Create Story Classifier skill (AC: #1, #3)
  - [x] 2.1 Create `scrum_workflow/skills/story-classifier/SKILL.md` following existing skill patterns (frontmatter: name, role, description)
  - [x] 2.2 Implement Identity section: classifier that analyzes story description, domain tags, and keywords
  - [x] 2.3 Implement Instructions section: classification algorithm (keyword matching, domain-tag analysis, content heuristics)
  - [x] 2.4 Define safe defaults: `type: feature`, `risk_level: medium` when ambiguous (AC: #3)
  - [x] 2.5 Define Output Format: structured YAML result with `type`, `risk_level`, `confidence`, `classification_note`
  - [x] 2.6 Define Context Rules: reads story description + domain_tags from story frontmatter; never writes files

- [x] Task 3: Integrate classifier into create-ticket command (AC: #1, #2)
  - [x] 3.1 Update `scrum_workflow/commands/create-ticket.md` to invoke story-classifier skill after story creation
  - [x] 3.2 Ensure classifier output populates `type` and `risk_level` fields in story.md frontmatter (fields already exist in template)
  - [x] 3.3 Add `classification_confidence` field to frontmatter to indicate classifier certainty
  - [x] 3.4 When confidence is low, add a note in the story body: "Classification auto-assigned with low confidence. Please review type and risk_level."

- [x] Task 4: Support manual override (AC: #2)
  - [x] 4.1 Document in skill that developers can manually edit `type` and `risk_level` fields in story.md frontmatter
  - [x] 4.2 Manual edits are inherently supported by the Markdown-as-Code paradigm (no code change needed - developer edits YAML directly)
  - [x] 4.3 Ensure downstream commands (Story 9.2 adaptive depth) respect the frontmatter values regardless of source

- [x] Task 5: Write ATDD tests (AC: #1, #2, #3)
  - [x] 5.1 Create `scrum_workflow/__tests__/classification/story-classifier.test.md` with BDD scenarios
  - [x] 5.2 Test: description with "fix bug" keywords -> `type: bugfix`
  - [x] 5.3 Test: description with "refactor" keywords -> `type: refactor`
  - [x] 5.4 Test: description with "CI/CD", "deployment" keywords -> `type: infrastructure`
  - [x] 5.5 Test: ambiguous description -> defaults to `type: feature`, `risk_level: medium`
  - [x] 5.6 Test: security domain tag -> `risk_level: high`
  - [x] 5.7 Test: frontmatter contains `type` and `risk_level` after `/scrum-create-ticket`

## Dev Notes

### Architecture Compliance

- **Markdown-as-Code paradigm (AD-001):** The classifier is implemented as a SKILL.md specification, not as imperative code. The AI agent reads and executes the classification rules at runtime.
- **Runtime discovery (FR-44, NFR-11):** New skill directory `scrum_workflow/skills/story-classifier/SKILL.md` is auto-discovered - no registration, build step, or restart needed.
- **Write boundaries:** The classifier skill is READ-ONLY (like status-guard-validation). It returns structured results; the calling workflow (create-ticket) writes the frontmatter.
- **Token efficiency (NFR-1):** Classification uses keyword matching and rule-based heuristics, not expensive multi-agent analysis. Stays within sub_agent budget of 2000 tokens.

### Technical Requirements

- **Valid type values:** `feature`, `bugfix`, `refactor`, `infrastructure` (FR-32). Use lowercase with no hyphens.
- **Valid risk_level values:** `low`, `medium`, `high`, `critical` (FR-32). Use lowercase.
- **Story template already has `type` and `risk_level` fields** in `scrum_workflow/templates/story.md` (lines 6-7). The classifier populates these existing placeholder fields.
- **Domain tags array** is already in the story template frontmatter (line 8). The classifier reads these to inform risk assessment.
- **Safe defaults (AC #3):** `type: feature`, `risk_level: medium`. These are the most common values and the least dangerous if wrong.

### File Structure Requirements

- **New skill:** `scrum_workflow/skills/story-classifier/SKILL.md` (follows subdirectory pattern per architecture: `{skill-name}/SKILL.md`)
- **New data file:** `scrum_workflow/data/classification-rules.yaml` (YAML reference data, per existing `data/` convention)
- **Modified command:** `scrum_workflow/commands/create-ticket.md` (add classifier invocation step)
- **Do NOT modify:** `scrum_workflow/templates/story.md` (template already has `type`, `risk_level`, `domain_tags` fields)

### Library & Framework Requirements

- No new dependencies. This is a Markdown-as-Code skill executed by the AI agent at runtime.
- Reference data in YAML format (consistent with existing `data/estimation-reference.yaml` pattern).
- Tests use Vitest framework (`vitest.config.js` includes `__tests__/**/*.test.{js,ts}`). ATDD scenario docs go in `__tests__/classification/`.

### Testing Standards

- **ATDD approach:** Write BDD-style test scenarios in `.test.md` format (following existing `__tests__/research/*.test.md` pattern)
- **Integration tests:** If creating programmatic validation, use Vitest with TypeScript (`*.test.ts` in `__tests__/integration/`)
- **Test location:** `scrum_workflow/__tests__/classification/` (new subdirectory for this feature domain)
- **Coverage:** Each AC must have at least one corresponding test scenario

### Classification Algorithm Design

The classifier should use a layered approach:

1. **Keyword extraction:** Scan story description for type-indicator keywords
   - `bugfix` indicators: "fix", "bug", "defect", "broken", "regression", "patch", "hotfix"
   - `refactor` indicators: "refactor", "clean up", "restructure", "simplify", "migrate", "extract", "consolidate"
   - `infrastructure` indicators: "CI/CD", "deploy", "pipeline", "docker", "build", "infrastructure", "monitoring", "environment"
   - `feature` indicators: everything else (default)

2. **Domain tag analysis:** Map domain tags to risk levels
   - High risk: `security`, `authentication`, `payment`, `data-migration`, `breaking-change`
   - Low risk: `documentation`, `ui-cosmetic`, `typo`, `config`
   - Medium risk: default for unrecognized tags

3. **Content complexity heuristics:**
   - Multiple domain tags -> increase risk by one level
   - Story touches auth/security patterns -> force `risk_level: high` minimum
   - Description length < 50 chars -> flag as potentially under-specified

4. **Confidence scoring:**
   - High confidence: clear keyword match + domain tag alignment
   - Medium confidence: keyword match only OR domain tag only
   - Low confidence: no clear signals -> apply safe defaults + add review note

### Cross-Story Context (Epic 9)

- **Story 9.2 (Adaptive Workflow Depth)** depends on this classifier's output. The `type` and `risk_level` fields populated here drive the depth selection: low->light, medium->standard, high/critical->heavy.
- **Story 9.3 (Dynamic Agent Dispatcher)** uses `type`, `risk_level`, and `domain_tags` to select which agents to spawn during refinement.
- **Story 9.4 (Extended Agent Types)** adds Security/UX/Contract agents that the dispatcher (9.3) selects based on this classifier's output.
- **FR-36 (Configurable thresholds)** is handled in Story 9.2, not here. This story only classifies; it does not select depth.

### Anti-Pattern Prevention

- **Do NOT create a new CLI command** for classification. The classifier is a skill invoked internally by `/scrum-create-ticket`.
- **Do NOT modify the 9-state lifecycle** or add new states. Classification happens within the existing `draft` state creation.
- **Do NOT add external dependencies.** The classifier uses built-in keyword matching rules in YAML, executed by the AI agent.
- **Do NOT implement adaptive depth selection** in this story. That is Story 9.2. This story only assigns `type` and `risk_level`.
- **Do NOT create duplicate type/risk_level fields.** The story template (`templates/story.md`) already has these fields - populate them, don't add new ones.

### Project Structure Notes

- Alignment: New skill follows existing `skills/{name}/SKILL.md` subdirectory pattern (consistent with `feedback-collection`, `guided-mode`, `prerequisite-validation`, `readiness-check`, `status-guard-validation`, `story-validation`, `synthesis`)
- Alignment: New data file follows existing `data/*.yaml` pattern (consistent with `estimation-reference.yaml`)
- Alignment: Command modification follows existing command spec format with frontmatter (name, trigger, requires_status, sets_status, spawns_agents)
- No conflicts detected with existing project structure

### References

- [Source: _scrum-output/planning-artifacts/epics.md#Epic-9, Story 9.1] - Story definition with user story and BDD acceptance criteria
- [Source: _scrum-output/planning-artifacts/prd.md#FR-32] - Classification by type (feature, bugfix, refactor, infrastructure) and risk level (low, medium, high, critical)
- [Source: _scrum-output/planning-artifacts/prd.md#FR-2] - Story artifact includes type, risk_level, domain_tags in frontmatter
- [Source: _scrum-output/planning-artifacts/architecture.md#Implementation-Patterns] - Naming, structure, format patterns
- [Source: scrum_workflow/templates/story.md] - Existing template with type, risk_level, domain_tags placeholder fields
- [Source: scrum_workflow/commands/create-ticket.md] - Command spec where classifier invocation must be added
- [Source: scrum_workflow/skills/status-guard-validation/SKILL.md] - Reference pattern for read-only skill structure
- [Source: scrum_workflow/data/estimation-reference.yaml] - Reference pattern for YAML data files
- [Source: scrum_workflow/config.yaml] - Token budgets (sub_agent: 2000 for classifier)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 Thinking (claude-opus-4-6-thinking)

### Debug Log References

- All 53 unit tests in tests/unit/story-classifier/ pass (3 test files: ac1, ac2, ac3)
- No regressions introduced — pre-existing failures (24 tests in 16 files) are unrelated to story 9.1
- Artifact contract sync test (ac4-delta-report) required syncing create-ticket.md to 2 additional copies

### Completion Notes List

- Task 1: Created `scrum_workflow/data/classification-rules.yaml` with comprehensive keyword-to-type mappings (bugfix, refactor, infrastructure, feature), domain-tag-to-risk mappings (critical, high, medium, low), risk keywords, confidence scoring rules, and safe defaults section
- Task 2: Created `scrum_workflow/skills/story-classifier/SKILL.md` with frontmatter (name, role, description), Identity section, 4-phase classification algorithm (keyword extraction, domain tag analysis, content heuristics, confidence scoring), safe defaults documentation, manual override documentation, structured YAML output format, and read-only context rules
- Task 3: Updated `scrum_workflow/commands/create-ticket.md` with Story Classification section invoking story-classifier skill, Output section documenting type/risk_level/classification_confidence fields, and Low Confidence Classification Note in Error Handling
- Task 4: Manual override documented in SKILL.md — inherent to Markdown-as-Code paradigm (developers edit YAML frontmatter directly). Downstream command respect documented.
- Task 5: Created BDD test scenarios in `scrum_workflow/__tests__/classification/story-classifier.test.md` (10 scenarios covering all ACs). Unskipped all 46 previously-skipped Vitest tests in `tests/unit/story-classifier/` — all 53 tests now pass.

### File List

**New files:**
- scrum_workflow/skills/story-classifier/SKILL.md — Story classifier skill specification
- scrum_workflow/data/classification-rules.yaml — Classification reference data (keyword/type/risk mappings)
- scrum_workflow/__tests__/classification/story-classifier.test.md — BDD acceptance test scenarios

**Modified files:**
- scrum_workflow/commands/create-ticket.md — Added Story Classification section and classifier integration
- create-scrum-workflow/scrum_workflow/commands/create-ticket.md — Synced copy of create-ticket.md
- create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md — Synced copy of create-ticket.md
- tests/unit/story-classifier/ac1-type-and-risk-classification.spec.ts — Unskipped 24 tests (test.skip -> test)
- tests/unit/story-classifier/ac2-visible-classification-override.spec.ts — Unskipped 6 tests (test.skip -> test)
- tests/unit/story-classifier/ac3-safe-defaults-ambiguous.spec.ts — Unskipped 16 tests (test.skip -> test)
- _scrum-output/implementation-artifacts/9-1-implement-story-classifier.md — Tasks marked complete, status updated
- _scrum-output/implementation-artifacts/sprint-status.yaml — Story status updated to review

### Review Findings

- [x] [Review][Patch] Test file TDD phase comments stale — updated "RED" to "GREEN" in ac1, ac2, ac3 spec files [tests/unit/story-classifier/ac1*.spec.ts, ac2*.spec.ts, ac3*.spec.ts]
- [x] [Review][Patch] classification-rules.yaml defaults.note field misaligned — renamed `note` to `description`, added explicit `classification_note` field matching SKILL.md canonical text [scrum_workflow/data/classification-rules.yaml:72-76]
- [x] [Review][Defer] Story template missing `depth` and `classification_confidence` fields — deferred, pre-existing (template explicitly excluded from modification per story dev notes)

## Change Log

- 2026-04-10: Code review complete — 2 patch fixes applied (stale TDD comments, rules YAML alignment), 1 deferred (pre-existing template gap), 9 dismissed as noise. All 53 tests pass. Story status: done.
- 2026-04-10: Implemented story classifier (FR-32) — created SKILL.md, classification-rules.yaml, integrated into create-ticket.md, documented manual override, created ATDD test scenarios, unskipped and passed all 53 unit tests. Story status: review.
