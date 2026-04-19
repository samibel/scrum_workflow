---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-04c-aggregate
  - step-05-validate-and-complete
lastStep: step-05-validate-and-complete
lastSaved: '2025-07-24'
workflowType: testarch-atdd
inputDocuments:
  - _scrum-output/implementation-artifacts/9-1-implement-story-classifier.md
  - scrum_workflow/templates/story.md
  - scrum_workflow/commands/create-ticket.md
  - scrum_workflow/skills/status-guard-validation/SKILL.md
  - scrum_workflow/data/estimation-reference.yaml
  - _scrum-output/bmm/config.yaml
  - vitest.config.js
---

# ATDD Checklist - Epic 9, Story 9.1: Implement Story Classifier

**Date:** 2025-07-24
**Author:** Sami
**Primary Test Level:** Unit (File Content Verification)

---

## Story Summary

Implement an automatic story classifier that assigns `type` and `risk_level` to stories at creation time, adapting downstream workflow depth to the nature of the work.

**As a** developer
**I want** the system to automatically classify stories by type and risk level at creation time
**So that** the workflow depth adapts to the nature of the work

---

## Acceptance Criteria

1. **AC1:** Given FR-32 specifies classification by type (feature, bugfix, refactor, infrastructure) and risk level (low, medium, high, critical), When a developer runs `/scrum-create-ticket`, Then the system analyzes the story description and assigns a `type` and `risk_level` in the YAML frontmatter, And classification is based on keywords, domain tags, and content analysis.

2. **AC2:** Given the classification is automatic, When the developer reviews the created story, Then the assigned type and risk_level are visible in the frontmatter, And the developer can override the classification manually if the system's assessment is incorrect.

3. **AC3:** Given edge cases where classification is ambiguous, When the classifier cannot determine a clear type or risk level, Then it defaults to `type: feature` and `risk_level: medium` (safe defaults), And a note is added suggesting the developer review the classification.

---

## Failing Tests Created (RED Phase)

### Unit Tests - AC1 (24 tests)

**File:** `tests/unit/story-classifier/ac1-type-and-risk-classification.spec.ts`

- **Test 1.1:** `[P0] skills/story-classifier/ directory should exist`
  - **Status:** RED (skipped) - Skill directory does not exist yet
  - **Verifies:** AC1 - Story classifier skill structure exists

- **Test 1.2:** `[P0] skills/story-classifier/SKILL.md should exist`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - Classifier skill file exists

- **Test 1.3:** `[P0] SKILL.md should have valid frontmatter (name, role, description)`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - Skill follows standard frontmatter pattern

- **Test 1.4:** `[P0] data/classification-rules.yaml should exist`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC1 - Classification reference data exists

- **Test 1.5:** `[P0] classification-rules.yaml should define keyword-to-type mappings`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC1 - Type classification keywords defined

- **Test 1.6:** `[P0] classification-rules.yaml should list bugfix indicator keywords`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC1 - Bugfix keywords: fix, bug, defect, etc.

- **Test 1.7:** `[P0] classification-rules.yaml should list refactor indicator keywords`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC1 - Refactor keywords: refactor, clean up, etc.

- **Test 1.8:** `[P0] classification-rules.yaml should list infrastructure indicator keywords`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC1 - Infrastructure keywords: CI/CD, deploy, etc.

- **Test 1.9:** `[P0] classification-rules.yaml should define keyword-to-risk-level mappings`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC1 - Risk level mappings: low, medium, high, critical

- **Test 1.10:** `[P0] classification-rules.yaml should map domain tags to risk levels`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC1 - Domain-tag-to-risk associations (security->high, etc.)

- **Test 1.11:** `[P0] SKILL.md should define keyword extraction analysis`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - Classification algorithm step 1

- **Test 1.12:** `[P0] SKILL.md should define domain tag analysis`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - Classification algorithm step 2

- **Test 1.13:** `[P1] SKILL.md should define content complexity heuristics`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - Classification algorithm step 3

- **Test 1.14:** `[P0] SKILL.md should reference classification-rules.yaml data file`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - Skill references data file

- **Test 1.15:** `[P0] SKILL.md should define structured output with type and risk_level`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - Output format includes type and risk_level

- **Test 1.16:** `[P1] SKILL.md should define confidence field in output`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - Output includes confidence scoring

- **Test 1.17:** `[P0] create-ticket.md should reference story-classifier skill`
  - **Status:** RED (skipped) - create-ticket.md not yet updated
  - **Verifies:** AC1 - Command invokes classifier

- **Test 1.18:** `[P0] create-ticket.md should invoke classifier during story creation workflow`
  - **Status:** RED (skipped) - create-ticket.md not yet updated
  - **Verifies:** AC1 - Classifier integration in workflow

- **Test 1.19:** `[P0] create-ticket.md output should include type field populated by classifier`
  - **Status:** RED (skipped) - create-ticket.md not yet updated
  - **Verifies:** AC1 - Type field in output specification

- **Test 1.20:** `[P0] create-ticket.md output should include risk_level field populated by classifier`
  - **Status:** RED (skipped) - create-ticket.md not yet updated
  - **Verifies:** AC1 - risk_level field in output specification

- **Test 1.21:** `[P1] create-ticket.md output should include classification_confidence field`
  - **Status:** RED (skipped) - create-ticket.md not yet updated
  - **Verifies:** AC1 - classification_confidence in output

- **Test 1.22:** `[P0] Classification should use exactly 4 type values: feature, bugfix, refactor, infrastructure`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - FR-32 valid type values

- **Test 1.23:** `[P0] Classification should use exactly 4 risk_level values: low, medium, high, critical`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - FR-32 valid risk_level values

- **Test 1.24:** `[P1] SKILL.md should declare read-only context (never writes files)`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC1 - Architecture compliance (read-only skill)

### Unit Tests - AC2 (13 tests)

**File:** `tests/unit/story-classifier/ac2-visible-classification-override.spec.ts`

- **Test 2.1:** `[P0] Story template should have type field in YAML frontmatter`
  - **Status:** GREEN (passing) - Template already has this field
  - **Verifies:** AC2 - Type visible in frontmatter

- **Test 2.2:** `[P0] Story template should have risk_level field in YAML frontmatter`
  - **Status:** GREEN (passing) - Template already has this field
  - **Verifies:** AC2 - risk_level visible in frontmatter

- **Test 2.3:** `[P0] Story template should have domain_tags field in YAML frontmatter`
  - **Status:** GREEN (passing) - Template already has this field
  - **Verifies:** AC2 - domain_tags visible in frontmatter

- **Test 2.4:** `[P0] create-ticket.md output should specify type is populated by classifier`
  - **Status:** RED (skipped) - create-ticket.md not yet updated
  - **Verifies:** AC2 - Type documented as classifier-populated

- **Test 2.5:** `[P0] create-ticket.md output should specify risk_level is populated by classifier`
  - **Status:** RED (skipped) - create-ticket.md not yet updated
  - **Verifies:** AC2 - risk_level documented as classifier-populated

- **Test 2.6:** `[P1] create-ticket.md output should include classification_confidence field`
  - **Status:** RED (skipped) - create-ticket.md not yet updated
  - **Verifies:** AC2 - classification_confidence in output

- **Test 2.7:** `[P0] SKILL.md should document manual override capability for type`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC2 - Manual override documented

- **Test 2.8:** `[P0] SKILL.md should document manual override capability for risk_level`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC2 - Manual override for risk_level

- **Test 2.9:** `[P1] Story template type field should use placeholder indicating it will be populated`
  - **Status:** GREEN (passing) - Template uses `{{story_type}}` placeholder
  - **Verifies:** AC2 - Type is editable via frontmatter

- **Test 2.10:** `[P1] Story template risk_level field should use placeholder indicating it will be populated`
  - **Status:** GREEN (passing) - Template uses `{{risk_level}}` placeholder
  - **Verifies:** AC2 - risk_level is editable via frontmatter

- **Test 2.11:** `[P1] SKILL.md should note downstream commands respect frontmatter values regardless of source`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC2 - Downstream compatibility with manual edits

- **Test 2.12:** `[P0] Story template should have exactly one type field (no duplicates)`
  - **Status:** GREEN (passing) - Template has exactly one type field
  - **Verifies:** AC2 - No duplicate fields (anti-pattern prevention)

- **Test 2.13:** `[P0] Story template should have exactly one risk_level field (no duplicates)`
  - **Status:** GREEN (passing) - Template has exactly one risk_level field
  - **Verifies:** AC2 - No duplicate fields (anti-pattern prevention)

### Unit Tests - AC3 (16 tests)

**File:** `tests/unit/story-classifier/ac3-safe-defaults-ambiguous.spec.ts`

- **Test 3.1:** `[P0] SKILL.md should define safe default type as "feature"`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Safe default type

- **Test 3.2:** `[P0] SKILL.md should define safe default risk_level as "medium"`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Safe default risk_level

- **Test 3.3:** `[P0] SKILL.md should define when safe defaults are applied`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Ambiguous case handling

- **Test 3.4:** `[P0] SKILL.md should define high confidence: clear keyword match + domain tag alignment`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Confidence scoring (high)

- **Test 3.5:** `[P1] SKILL.md should define medium confidence: keyword OR domain tag only`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Confidence scoring (medium)

- **Test 3.6:** `[P0] SKILL.md should define low confidence: no clear signals -> safe defaults`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Confidence scoring (low) triggers defaults

- **Test 3.7:** `[P1] SKILL.md output format should include classification_note field`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Output includes classification_note

- **Test 3.8:** `[P0] SKILL.md should specify review note added when confidence is low`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Review note for low confidence

- **Test 3.9:** `[P0] create-ticket.md should add review note in story body for low confidence`
  - **Status:** RED (skipped) - create-ticket.md not yet updated
  - **Verifies:** AC3 - Review note integration in workflow

- **Test 3.10:** `[P1] Review note should contain "Classification auto-assigned with low confidence"`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Review note text format

- **Test 3.11:** `[P1] classification-rules.yaml should define fallback defaults`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC3 - Rules file supports defaults

- **Test 3.12:** `[P1] classification-rules.yaml should identify feature as default type`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC3 - Feature is default in rules

- **Test 3.13:** `[P1] classification-rules.yaml should identify medium as default risk_level`
  - **Status:** RED (skipped) - Data file not yet created
  - **Verifies:** AC3 - Medium is default in rules

- **Test 3.14:** `[P2] SKILL.md should handle multiple domain tags by increasing risk level`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Edge case: multiple tags increase risk

- **Test 3.15:** `[P2] SKILL.md should force minimum risk_level: high for auth/security patterns`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Edge case: security forces high risk

- **Test 3.16:** `[P2] SKILL.md should flag descriptions shorter than 50 chars as under-specified`
  - **Status:** RED (skipped) - SKILL.md not yet created
  - **Verifies:** AC3 - Edge case: short description flagging

---

## Data Factories Created

N/A - This story uses file content verification (Markdown-as-Code paradigm). No data factories are needed for unit-level file content assertions.

---

## Fixtures Created

N/A - Tests use direct `readFileSync` + regex assertions. No test fixtures required.

---

## Mock Requirements

N/A - Tests verify static file content. No external services to mock.

---

## Required data-testid Attributes

N/A - This is a backend/Markdown-as-Code story with no UI components.

---

## Implementation Checklist

### Test Group 1: AC1 - Classifier Skill & Rules (Tests 1.1-1.24)

**File:** `tests/unit/story-classifier/ac1-type-and-risk-classification.spec.ts`

**Tasks to make these tests pass:**

- [ ] Create `scrum_workflow/skills/story-classifier/SKILL.md` with frontmatter (name, role, description)
- [ ] Implement Identity section: classifier that analyzes description, domain tags, keywords
- [ ] Implement Instructions section: keyword extraction, domain tag analysis, content heuristics
- [ ] Define Output Format: structured YAML with type, risk_level, confidence, classification_note
- [ ] Define Context Rules: reads story description + domain_tags; never writes files
- [ ] Create `scrum_workflow/data/classification-rules.yaml` with keyword-to-type mappings
- [ ] Add keyword-to-risk-level mappings in classification-rules.yaml
- [ ] Add domain-tag-to-risk associations in classification-rules.yaml
- [ ] Update `scrum_workflow/commands/create-ticket.md` to invoke story-classifier skill
- [ ] Add classification_confidence field to create-ticket.md output spec
- [ ] Remove `test.skip()` from all AC1 tests
- [ ] Run tests: `npx vitest run tests/unit/story-classifier/ac1-type-and-risk-classification.spec.ts`
- [ ] All AC1 tests pass (green phase)

**Estimated Effort:** 2-3 hours

---

### Test Group 2: AC2 - Visible Classification & Override (Tests 2.1-2.13)

**File:** `tests/unit/story-classifier/ac2-visible-classification-override.spec.ts`

**Tasks to make remaining skipped tests pass:**

- [ ] Ensure create-ticket.md output section explicitly documents type is classifier-populated
- [ ] Ensure create-ticket.md output section explicitly documents risk_level is classifier-populated
- [ ] Add classification_confidence to create-ticket.md output specification
- [ ] Document manual override capability in SKILL.md (developers edit YAML directly)
- [ ] Document downstream command compatibility in SKILL.md
- [ ] Remove `test.skip()` from skipped AC2 tests
- [ ] Run tests: `npx vitest run tests/unit/story-classifier/ac2-visible-classification-override.spec.ts`
- [ ] All AC2 tests pass (green phase)

**Estimated Effort:** 1 hour

---

### Test Group 3: AC3 - Safe Defaults & Confidence (Tests 3.1-3.16)

**File:** `tests/unit/story-classifier/ac3-safe-defaults-ambiguous.spec.ts`

**Tasks to make these tests pass:**

- [ ] Define safe defaults in SKILL.md: type: feature, risk_level: medium
- [ ] Define confidence scoring levels in SKILL.md (high, medium, low)
- [ ] Define when defaults are applied (low confidence / ambiguous)
- [ ] Specify review note text for low confidence classification
- [ ] Add review note integration in create-ticket.md for low confidence
- [ ] Add default/fallback section in classification-rules.yaml
- [ ] Implement content heuristics: multiple tags, auth/security, short descriptions
- [ ] Remove `test.skip()` from all AC3 tests
- [ ] Run tests: `npx vitest run tests/unit/story-classifier/ac3-safe-defaults-ambiguous.spec.ts`
- [ ] All AC3 tests pass (green phase)

**Estimated Effort:** 2 hours

---

## Running Tests

```bash
# Run all failing tests for story 9.1
npx vitest run tests/unit/story-classifier/ --reporter=verbose

# Run specific AC1 test file
npx vitest run tests/unit/story-classifier/ac1-type-and-risk-classification.spec.ts

# Run specific AC2 test file
npx vitest run tests/unit/story-classifier/ac2-visible-classification-override.spec.ts

# Run specific AC3 test file
npx vitest run tests/unit/story-classifier/ac3-safe-defaults-ambiguous.spec.ts

# Run all project tests
npx vitest run
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete)

**TEA Agent Responsibilities:**

- All 53 tests written (46 skipped via test.skip(), 7 passing pre-existing checks)
- Tests organized per AC in separate files following project conventions
- Implementation checklist created with clear tasks per test group
- No fixtures or factories needed (file content verification pattern)

**Verification:**

- All `test.skip()` tests are intentionally RED (feature not implemented)
- 7 GREEN tests verify pre-existing template fields (AC2 partial coverage)
- Failure messages are clear: tests will fail when `test.skip()` is removed and files don't exist or lack expected content

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Start with AC1 (Task 1-2):** Create classification-rules.yaml and story-classifier/SKILL.md
2. **Then AC1 (Task 3):** Update create-ticket.md to invoke classifier
3. **Then AC2:** Ensure manual override is documented
4. **Then AC3:** Ensure safe defaults and confidence scoring are defined
5. **Remove test.skip()** from each test group after implementation
6. **Run tests** to verify green phase

**Key Principles:**

- One test group at a time (AC1 first, then AC2, then AC3)
- Create files per story dev notes (SKILL.md, classification-rules.yaml, modify create-ticket.md)
- Run tests frequently after each file creation/modification

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. Verify all 53 tests pass (no more test.skip())
2. Review SKILL.md for clarity and completeness
3. Review classification-rules.yaml for comprehensive keyword coverage
4. Ensure create-ticket.md integration is clean
5. Verify no anti-patterns (per story dev notes)
6. Update story status to done in sprint-status.yaml

---

## Next Steps

1. **Share this checklist and failing tests** with the dev workflow
2. **Review this checklist** with team in standup or planning
3. **Run failing tests** to confirm RED phase: `npx vitest run tests/unit/story-classifier/ --reporter=verbose`
4. **Begin implementation** using implementation checklist as guide
5. **Work one test group at a time** (AC1 -> AC2 -> AC3)
6. **When all tests pass**, refactor for quality
7. **When refactoring complete**, update story status to 'done' in sprint-status.yaml

---

## Knowledge Base References Applied

- **component-tdd.md** - TDD red-green-refactor methodology
- **test-quality.md** - Test design principles (Given-When-Then, determinism, isolation)
- **data-factories.md** - Factory patterns (not needed for this story but consulted)
- **test-levels-framework.md** - Test level selection (Unit level chosen for file content verification)
- **test-priorities-matrix.md** - Priority assignment P0-P2

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `npx vitest run tests/unit/story-classifier/ --reporter=verbose`

**Results:**

```
 Test Files  1 passed | 2 skipped (3)
      Tests  7 passed | 46 skipped (53)
   Start at  11:59:33
   Duration  173ms
```

**Summary:**

- Total tests: 53
- Passing: 7 (pre-existing template field checks in AC2)
- Skipped (RED): 46 (feature not implemented yet - TDD red phase)
- Status: RED phase verified

**Expected Failures When test.skip() Removed:**

- AC1 tests: `ENOENT: no such file or directory` for SKILL.md and classification-rules.yaml
- AC1 tests: Regex match failures on create-ticket.md (missing classifier references)
- AC2 tests: Regex match failures on create-ticket.md and missing SKILL.md
- AC3 tests: `ENOENT: no such file or directory` for SKILL.md and classification-rules.yaml

---

## Notes

- This story follows the **Markdown-as-Code paradigm** (AD-001). The classifier is a SKILL.md specification, not imperative code. Tests verify file content/structure.
- The story template (`scrum_workflow/templates/story.md`) already has `type`, `risk_level`, and `domain_tags` fields. The classifier populates these existing fields.
- Story 9.2 (Adaptive Workflow Depth) depends on this classifier's output. The type and risk_level fields populated here drive depth selection.
- No new dependencies are required. This is a pure Markdown-as-Code implementation.

---

**Generated by Scrum Workflow TEA Agent** - 2025-07-24
