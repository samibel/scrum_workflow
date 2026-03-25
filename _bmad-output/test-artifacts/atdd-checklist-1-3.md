---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests']
lastStep: 'step-04-generate-tests'
lastSaved: '2026-03-25'
inputDocuments:
  - '_bmad-output/implementation-artifacts/1-3-platform-adapter-contract-and-claude-code-adapter.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/epics.md'
  - '_bmad-output/test-artifacts/agent-definitions-validation.spec.ts'
  - 'scrum_workflow/config.yaml'
---

# ATDD Checklist for Story 1-3

## Step 1: Preflight & Context Loading

### Stack Detection
- **Detected Stack:** Backend/Infrastructure
- **Test Framework:** Jest with TypeScript
- **Project Type:** Framework infrastructure (declarative YAML/Markdown)

### Story Context
- **Story ID:** 1-3
- **Story Title:** Platform Adapter Contract and Claude Code Adapter
- **Status:** ready-for-dev
- **Epic:** Epic 1 - Framework Setup & Project Onboarding

### Prerequisites Verified
- ✅ Story approved with clear acceptance criteria
- ✅ Test framework configured (Jest + TypeScript)
- ✅ Existing test patterns available (agent-definitions-validation.spec.ts)

### Framework & Existing Patterns
- Test pattern: File System Validation Tests
- Testing focus: YAML frontmatter parsing, file existence, content validation
- Priority levels: P0 (critical), P1 (important), P2 (nice-to-have)

## Step 2: Generation Mode Selection

### Mode: AI Generation
- **Rationale:** Backend/Infrastructure project - no browser recording needed
- **Test Type:** File System Validation Tests (matching existing pattern)

## Step 3: Test Strategy

### Acceptance Criteria Mapping

| AC | Description | Test Level | Test Scenarios | Priority |
|---|---|---|---|---|
| AC1 | Skill files exist in `.claude/skills/` | File System | Verify 4 skill files exist | P0 |
| AC2 | Skill files reference framework commands | File System | Parse skill files, extract references | P0 |
| AC3 | config.yaml has platform field | File System | Verify `platform: claude-code` exists | P0 |
| AC4 | Adapter instruction file with framework_path | File System | Verify `.claude/instructions.md` exists | P0 |
| AC5 | Platform switching requires only config change | Content Analysis | Verify no hardcoded platform references | P1 |
| AC6 | No workflow logic in adapters | Content Analysis | Verify adapters contain only references | P0 |

### Test Levels Selection
- **File System Validation Tests:** All ACs (this is infrastructure validation)
- **Content Analysis Tests:** AC5, AC6 (verify no workflow logic)

### Test Priority Distribution
- **P0 (Critical):** AC1, AC2, AC3, AC4, AC6 - Adapter contract compliance
- **P1 (Important):** AC5 - Platform switching verification
- **P2 (Nice-to-have):** Additional validation (contract documentation)

### Red Phase Requirements
- All tests are designed to FAIL before implementation (TDD red phase)
- Implementation files do not exist yet:
  - `.claude/instructions.md` (to be created)
  - `.claude/skills/*.md` (to be created)
  - `scrum_workflow/context/platform-adapter-contract.md` (to be created)

### Expected Test Failures
1. `.claude/instructions.md` does not exist → FAIL
2. `.claude/skills/` directory does not exist → FAIL
3. `create-project-context.md` skill file does not exist → FAIL
4. `create-ticket.md` skill file does not exist → FAIL
5. `refine-ticket.md` skill file does not exist → FAIL
6. `dev-story.md` skill file does not exist → FAIL
7. `platform-adapter-contract.md` documentation does not exist → FAIL

## Next Steps
- Proceed to Step 4: Generate Tests
- Create failing ATDD test suite for Story 1-3
- Test file: `platform-adapter-validation.spec.ts`
