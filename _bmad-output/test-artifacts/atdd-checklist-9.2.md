---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-04c-aggregate
  - step-05-validate-and-complete
lastStep: step-05-validate-and-complete
lastSaved: '2025-07-21'
storyId: '9.2'
storyFile: _bmad-output/implementation-artifacts/9-2-implement-adaptive-workflow-depth-selection.md
detectedStack: backend
generationMode: AI Generation
executionMode: sequential
tddPhase: RED
inputDocuments:
  - _bmad-output/implementation-artifacts/9-2-implement-adaptive-workflow-depth-selection.md
  - _bmad/bmm/config.yaml
  - scrum_workflow/config.yaml
  - scrum_workflow/commands/create-ticket.md
  - scrum_workflow/commands/refine-ticket.md
  - scrum_workflow/templates/story.md
  - tests/unit/story-classifier/ac1-type-and-risk-classification.spec.ts
  - tests/unit/story-classifier/ac2-visible-classification-override.spec.ts
  - tests/unit/story-classifier/ac3-safe-defaults-ambiguous.spec.ts
---

# ATDD Checklist: Story 9.2 — Implement Adaptive Workflow Depth Selection

## Story Summary

**As a** developer,
**I want** the system to automatically select workflow depth (Light/Standard/Heavy) based on story risk classification,
**So that** low-risk work moves fast and high-risk work gets thorough treatment.

## TDD Red Phase Status

🔴 **TDD Phase: RED** — All 67 tests are skipped with `test.skip()` and will fail until implementation is complete.

| Test File | Tests | Status |
|-----------|-------|--------|
| `ac1-risk-to-depth-mapping.spec.ts` | 21 | 🔴 All skipped |
| `ac2-configurable-thresholds.spec.ts` | 13 | 🔴 All skipped |
| `ac3-developer-notification-override.spec.ts` | 17 | 🔴 All skipped |
| `ac4-heavy-depth-behavior.spec.ts` | 16 | 🔴 All skipped |
| **Total** | **67** | **🔴 67 skipped** |

## Acceptance Criteria Coverage

### AC1: Automatic Depth Selection Based on Risk Classification (FR-33)
**File:** `tests/unit/adaptive-depth/ac1-risk-to-depth-mapping.spec.ts` — 21 tests

| ID | Test | Priority | AC |
|----|------|----------|-----|
| 1.1 | skills/adaptive-depth-selector/ directory should exist | P0 | AC1 |
| 1.2 | skills/adaptive-depth-selector/SKILL.md should exist | P0 | AC1 |
| 1.3 | SKILL.md should have valid frontmatter (name, role, description) | P0 | AC1 |
| 1.4 | SKILL.md should declare read-only context | P0 | AC1 |
| 1.5 | SKILL.md should map risk_level: low to depth: light | P0 | AC1 |
| 1.6 | SKILL.md should map risk_level: medium to depth: standard | P0 | AC1 |
| 1.7 | SKILL.md should map risk_level: high to depth: heavy | P0 | AC1 |
| 1.8 | SKILL.md should map risk_level: critical to depth: heavy | P0 | AC1 |
| 1.9 | SKILL.md should reference valid depth values: light, standard, heavy | P0 | AC1 |
| 1.10 | SKILL.md should describe reading risk_level from story frontmatter | P0 | AC1 |
| 1.11 | SKILL.md should describe loading thresholds from config.yaml | P0 | AC1 |
| 1.12 | SKILL.md should default to standard when risk_level is missing | P0 | AC1 |
| 1.13 | SKILL.md should use hardcoded defaults when threshold config is missing | P1 | AC1 |
| 1.14 | SKILL.md should define output format with depth field | P0 | AC1 |
| 1.15 | SKILL.md should define output format with depth_source field | P0 | AC1 |
| 1.16 | SKILL.md should define output format with selection_reason field | P1 | AC1 |
| 1.17 | Story template should have depth field in YAML frontmatter | P0 | AC1 |
| 1.18 | Story template should have depth_source field in YAML frontmatter | P0 | AC1 |
| 1.19 | create-ticket.md should reference adaptive-depth-selector skill | P0 | AC1 |
| 1.20 | create-ticket.md should invoke depth selector after story classification | P0 | AC1 |
| 1.21 | create-ticket.md output should include depth with heavy as valid value | P0 | AC1 |

### AC2: Configurable Thresholds in config.yaml (FR-36)
**File:** `tests/unit/adaptive-depth/ac2-configurable-thresholds.spec.ts` — 13 tests

| ID | Test | Priority | AC |
|----|------|----------|-----|
| 2.1 | config.yaml should contain workflow_depth_thresholds section | P0 | AC2 |
| 2.2 | workflow_depth_thresholds should map low to light | P0 | AC2 |
| 2.3 | workflow_depth_thresholds should map medium to standard | P0 | AC2 |
| 2.4 | workflow_depth_thresholds should map high to heavy | P0 | AC2 |
| 2.5 | workflow_depth_thresholds should map critical to heavy | P0 | AC2 |
| 2.6 | config.yaml should have inline comments documenting each threshold | P1 | AC2 |
| 2.7 | config.yaml threshold comments should reference FR-33 or FR-36 | P1 | AC2 |
| 2.8 | config.yaml should document valid depth values in comments | P2 | AC2 |
| 2.9 | SKILL.md should reference workflow_depth_thresholds from config.yaml | P0 | AC2 |
| 2.10 | SKILL.md should describe reading thresholds from config.yaml | P0 | AC2 |
| 2.11 | SKILL.md should describe that developers can customize mappings | P1 | AC2 |
| 2.12 | create-scrum-workflow/scrum_workflow/config.yaml should have thresholds | P0 | AC2 |
| 2.13 | create-scrum-workflow/templates/.../config.yaml should have thresholds | P0 | AC2 |

### AC3: Developer Notification and depth_source Tracking (SC-12)
### AC4: Manual --depth Override Precedence (FR-3)
**File:** `tests/unit/adaptive-depth/ac3-developer-notification-override.spec.ts` — 17 tests

| ID | Test | Priority | AC |
|----|------|----------|-----|
| 3.1 | create-ticket.md should specify console message for auto-selected depth | P0 | AC3 |
| 3.2 | Console message should include the selected depth value | P1 | AC3 |
| 3.3 | Console message should include the risk level | P1 | AC3 |
| 3.4 | create-ticket.md output should include depth_source field | P0 | AC3 |
| 3.5 | depth_source should be "classifier" for automatic selection | P0 | AC3 |
| 3.6 | depth_source should be "adaptive-workflow-override" for manual flag | P0 | AC3/AC4 |
| 3.7 | Story template should have depth_source field with placeholder | P0 | AC3 |
| 3.8 | create-ticket.md input should accept --depth light\|standard\|heavy | P0 | AC4 |
| 3.9 | --depth flag should skip automatic depth selection | P0 | AC4 |
| 3.10 | create-ticket.md should document override precedence order | P0 | AC4 |
| 3.11 | Error handling should accept heavy as valid depth value | P0 | AC4 |
| 3.12 | Invalid depth error should list light, standard, and heavy | P1 | AC4 |
| 3.13 | create-ticket.md should describe classifier -> depth selector flow | P0 | AC3/AC4 |
| 3.14 | create-ticket.md should have Adaptive Depth Selection section | P0 | AC3 |
| 3.15 | Default depth should be standard when no flag and no classifier | P1 | AC3 |
| 3.16 | create-scrum-workflow/.../create-ticket.md should have depth selection | P0 | AC3/AC4 |
| 3.17 | create-scrum-workflow/templates/.../create-ticket.md sync | P0 | AC3/AC4 |

### AC1 (Heavy Depth in refine-ticket): Heavy Depth Behavior
**File:** `tests/unit/adaptive-depth/ac4-heavy-depth-behavior.spec.ts` — 16 tests

| ID | Test | Priority | AC |
|----|------|----------|-----|
| 4.1 | refine-ticket.md should include heavy in depth comparison table | P0 | AC1 |
| 4.2 | Heavy depth should use 3 agents (Architect, Developer, QA) | P0 | AC1 |
| 4.3 | Heavy depth should disable early exit on consensus | P0 | AC1 |
| 4.4 | Heavy depth should enable cross-talk with max rounds | P0 | AC1 |
| 4.5 | Heavy depth should have synthesis enabled | P1 | AC1 |
| 4.6 | Heavy depth should use Wideband Delphi estimation | P1 | AC1 |
| 4.7 | Heavy depth should require mandatory security consideration note | P0 | AC1 |
| 4.8 | Security note should be added to refinement artifact | P1 | AC1 |
| 4.9 | Security note should indicate high-risk story | P1 | AC1 |
| 4.10 | Depth detection should handle heavy value | P0 | AC1 |
| 4.11 | Default to standard when depth missing or invalid | P1 | AC1 |
| 4.12 | Reference heavy in workflow adaptation docs | P1 | AC1 |
| 4.13 | create-scrum-workflow/.../refine-ticket.md should have heavy | P0 | AC1 |
| 4.14 | create-scrum-workflow/templates/.../refine-ticket.md sync | P0 | AC1 |
| 4.15 | Synced story template should have depth field | P0 | AC1 |
| 4.16 | Synced story template should have depth_source field | P0 | AC1 |

## Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| P0 | 47 | 70.1% |
| P1 | 17 | 25.4% |
| P2 | 3 | 4.5% |
| P3 | 0 | 0.0% |
| **Total** | **67** | **100%** |

## Test Architecture

- **Test Level:** Unit (File Content Verification via `readFileSync` + regex)
- **Test Framework:** Vitest with TypeScript
- **Pattern:** Follows existing `tests/unit/story-classifier/` pattern from Story 9.1
- **Detected Stack:** Backend (Markdown-as-Code paradigm — no browser/API tests needed)
- **Generation Mode:** AI Generation (acceptance criteria are clear, standard CRUD-like scenarios)
- **Execution Mode:** Sequential

## Files Under Test

| File | Tests Covering It |
|------|-------------------|
| `scrum_workflow/skills/adaptive-depth-selector/SKILL.md` | 1.1–1.16, 2.9–2.11 |
| `scrum_workflow/config.yaml` | 2.1–2.8 |
| `scrum_workflow/commands/create-ticket.md` | 1.19–1.21, 3.1–3.15 |
| `scrum_workflow/commands/refine-ticket.md` | 4.1–4.12 |
| `scrum_workflow/templates/story.md` | 1.17–1.18, 3.7 |
| `create-scrum-workflow/scrum_workflow/config.yaml` | 2.12 |
| `create-scrum-workflow/templates/scrum_workflow/config.yaml` | 2.13 |
| `create-scrum-workflow/scrum_workflow/commands/create-ticket.md` | 3.16 |
| `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md` | 3.17 |
| `create-scrum-workflow/scrum_workflow/commands/refine-ticket.md` | 4.13 |
| `create-scrum-workflow/templates/scrum_workflow/commands/refine-ticket.md` | 4.14 |
| `create-scrum-workflow/templates/scrum_workflow/templates/story.md` | 4.15–4.16 |

## Next Steps (TDD Green Phase)

After implementing the feature (Story 9.2 tasks):

1. **Remove `test.skip()`** from all 67 tests in `tests/unit/adaptive-depth/`
2. **Run tests:** `npx vitest run tests/unit/adaptive-depth/`
3. **Verify tests PASS** (green phase)
4. If any tests fail:
   - Either fix implementation (feature bug)
   - Or fix test (test bug — regex too strict/loose)
5. **Commit passing tests** with implementation

## Implementation Guidance

### New Files to Create
- `scrum_workflow/skills/adaptive-depth-selector/SKILL.md` — Depth selection skill (read-only, threshold lookup)

### Files to Modify
- `scrum_workflow/config.yaml` — Add `workflow_depth_thresholds` section
- `scrum_workflow/commands/create-ticket.md` — Add Adaptive Depth Selection section, update `--depth` to accept `heavy`, add `depth_source` tracking
- `scrum_workflow/commands/refine-ticket.md` — Add `heavy` depth column to table, define heavy behavior
- `scrum_workflow/templates/story.md` — Add `depth` and `depth_source` fields to frontmatter

### Sync Targets (Artifact Contract)
- `create-scrum-workflow/scrum_workflow/config.yaml`
- `create-scrum-workflow/templates/scrum_workflow/config.yaml`
- `create-scrum-workflow/scrum_workflow/commands/create-ticket.md`
- `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md`
- `create-scrum-workflow/scrum_workflow/commands/refine-ticket.md`
- `create-scrum-workflow/templates/scrum_workflow/commands/refine-ticket.md`
- `create-scrum-workflow/templates/scrum_workflow/templates/story.md`

## Key Risks and Assumptions

1. **Regex patterns** in tests are designed based on expected content from the story spec — may need adjustment if implementation wording differs slightly
2. **Artifact contract sync** targets assume the `create-scrum-workflow/` directory structure exists — tests will fail at file read if sync targets don't exist
3. **Heavy depth behavior** tests verify refine-ticket.md content — assumes the depth table format is parseable by regex
4. **Story template** currently lacks `depth` and `depth_source` fields — this is the deferred gap from Story 9.1 that this story addresses

## Validation Checklist

- [x] Prerequisites satisfied (story approved with clear acceptance criteria)
- [x] Test framework configured (vitest.config.js exists)
- [x] All 4 test files created in `tests/unit/adaptive-depth/`
- [x] All tests use `test.skip()` (TDD red phase)
- [x] All tests assert expected behavior (no placeholder assertions)
- [x] All acceptance criteria covered (AC1: 21 tests, AC2: 13 tests, AC3/AC4: 17 tests, Heavy: 16 tests)
- [x] Tests follow existing pattern from `tests/unit/story-classifier/`
- [x] Test run confirms 67 skipped, 0 failed, 0 passed
- [x] ATDD checklist artifact created at `_bmad-output/test-artifacts/atdd-checklist-9.2.md`
- [ ] CLI sessions cleaned up (N/A — no browser sessions used)
- [x] Temp artifacts stored in `_bmad-output/test-artifacts/`
