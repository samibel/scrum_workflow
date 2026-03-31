---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate']
lastStep: 'step-04c-aggregate'
lastSaved: '2026-03-30'
story_id: '9-2'
story_title: '/scrum-research technical Command & Workflow Skeleton'
inputDocuments:
  - '_bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md'
  - '_bmad/tea/config.yaml'
  - '_bmad/tea/testarch/tea-index.csv'
  - 'scrum_workflow/agents/researcher.md'
  - 'scrum_workflow/commands/create-project-docs.md'
  - 'scrum_workflow/workflows/architecture-documentation.md'
  - '.claude/skills/create-project-docs.md'
  - '_bmad-output/test-artifacts/create-project-docs-command-workflow.spec.ts'
  - '_bmad-output/test-artifacts/atdd-checklist-9-1.md'
---

# ATDD Checklist: Story 9-2 - /scrum-research technical Command & Workflow Skeleton

## Preflight & Context

- [x] Story file loaded: `_bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md`
- [x] Stack detected: backend (no frontend manifests, project is a CLI/tool framework)
- [x] Test framework: Jest with TypeScript (existing convention)
- [x] TEA config loaded from `_bmad/tea/config.yaml`
- [x] Reference command loaded: `create-project-docs.md` (SKILL.md command format)
- [x] Reference workflow loaded: `architecture-documentation.md` (workflow structure)
- [x] Reference adapter loaded: `create-project-docs.md` (adapter skill pattern)
- [x] Researcher agent loaded: `agents/researcher.md` (dependency from Story 9-1)
- [x] Existing test pattern referenced: `create-project-docs-command-workflow.spec.ts`

## Generation Mode

- [x] Mode: AI Generation (backend project, file validation tests)
- [x] No browser recording needed

## Test Strategy

### Acceptance Criteria to Test Mapping

| AC | Description | Test Level | Priority | Test Count |
|----|-------------|------------|----------|------------|
| AC1 | Command file exists at correct location with SKILL.md format | Unit (FS validation) | P0/P1/P2 | 20 |
| AC2 | Workflow file exists with Plan-Then-Execute workflow | Unit (FS validation) | P0/P2 | 5 |
| AC3 | Command accepts topic argument | Unit (content) | P0/P1/P2 | 4 |
| AC4 | Command accepts optional flags | Unit (content) | P0/P1/P2 | 5 |
| AC5 | Research output directory (docs/research/) | Unit (content) | P0/P1 | 3 |
| AC6 | Agent and context loading | Unit (content) | P0/P1/P2 | 5 |
| AC7 | Plan-Then-Execute workflow with six phases | Unit (content) | P0/P1/P2 | 10 |
| AC8 | Generated filename pattern | Unit (content) | P0/P1/P2 | 3 |
| AC9 | Adapter skill creation | Unit (FS validation) | P0/P1 | 7 |
| AC10 | Command reads project context | Unit (content) | P0/P1/P2 | 4 |
| AC11 | Output follows frontmatter schema | Unit (content) | P0/P1 | 5 |
| Cross | Command structural compliance | Unit (FS validation) | P0/P1/P2 | 6 |
| Cross | Workflow structural compliance | Unit (FS validation) | P0/P1/P2 | 12 |
| Cross | Adapter skill structural compliance | Unit (FS validation) | P0/P1/P2 | 4 |
| Cross | Three-layer architecture compliance | Unit (FS validation) | P0/P1 | 6 |
| Cross | Research command differentiation | Unit (content) | P0/P1/P2 | 7 |
| Cross | Researcher agent compatibility | Unit (FS validation) | P0/P1 | 3 |

**Total: 104 test scenarios**

### Priority Distribution

- **P0 (Critical):** 46 tests -- File existence, frontmatter format, required content
- **P1 (High):** 42 tests -- Structural compliance, ordering, content completeness
- **P2 (Medium):** 16 tests -- Naming conventions, edge cases, deferred features

## TDD Red Phase Results

- [x] Test file generated: `_bmad-output/test-artifacts/research-technical-command-workflow.spec.ts`
- [x] All tests designed to FAIL (files do not exist yet)
- [x] All tests use test.skip() -- TDD red phase compliant
- [x] No placeholder assertions (expect(true).toBe(true)) used
- [x] Test structure follows established pattern from create-project-docs-command-workflow.spec.ts

## Key Differentiators from Story 6-2 Tests

Story 9-2 differs from Story 6-2 (create-project-docs) in important ways reflected in the tests:

1. **Topic argument**: AC3 tests verify `<topic>` argument parsing (doc commands have no arguments)
2. **Optional flags**: AC4 tests verify `--sources` and `--output` flags (doc commands only have `--update`)
3. **Output directory**: AC5 tests verify `docs/research/` (not `_scrum-output/docs/` or `docs/generated/`)
4. **WebSearch vs Glob/Grep**: Cross-cutting tests verify research uses WebSearch, not local scanning
5. **Six-phase workflow**: AC7 tests verify Plan-Then-Execute phases (not full-scan/update modes)
6. **Frontmatter schema**: AC11 tests verify research-specific frontmatter (ai_optimized, research_confidence)
7. **No update mode**: Cross-cutting tests verify update mode is absent (deferred to Story 9-8)
8. **Filename pattern**: AC8 tests verify `technical-research-{topic-slug}-{date}.md` pattern
9. **Adapter naming**: Tests verify adapter is named `scrum-research-technical.md` (matches `/scrum-research technical` trigger)

## Test Coverage Summary

- **AC1**: File existence, frontmatter fields, body sections (Purpose, Workflow Reference, Input, Output), section order, content validation
- **AC2**: Workflow file existence, meaningful content, Plan-Then-Execute phases, kebab-case naming
- **AC3**: Topic argument in Input section, example invocation, workflow topic parsing, required argument
- **AC4**: --sources and --output flags, URL list format, default path, workflow flag parsing
- **AC5**: docs/research/ directory reference, project root relative, directory creation
- **AC6**: Researcher agent reference, context/index.md loading, loading order, warning on missing
- **AC7**: Six sequential phases (Scope Confirmation, Research Plan, Swarm Research, Verification, Reflection Loop, Synthesis), phase ordering, user approval gate, parallel subagents, iteration limits
- **AC8**: Filename pattern, kebab-case topic slug, YYYY-MM-DD date format
- **AC9**: Adapter skill existence, frontmatter (name, trigger, description, framework_command), body reference
- **AC10**: context/index.md reference, project domain, tech stack, warning on missing
- **AC11**: Frontmatter schema fields, ai_optimized=true, version=1.0, research_confidence levels
- **Cross-cutting**: Command/workflow/adapter structural compliance, three-layer separation, research differentiation from doc commands, researcher agent compatibility

## Next Steps (TDD Green Phase)

After implementing the feature:

1. Remove `test.skip()` from all test functions
2. Run tests: `npx jest research-technical-command-workflow.spec.ts`
3. Verify all tests PASS (green phase)
4. If any tests fail:
   - Either fix implementation (feature bug)
   - Or fix test (test bug)
5. Commit passing tests

## Files to Implement

1. `scrum_workflow/commands/research-technical.md` -- Command definition in SKILL.md format
2. `scrum_workflow/workflows/research-technical.md` -- Plan-Then-Execute workflow with six phases
3. `.claude/skills/scrum-research-technical.md` -- Adapter skill referencing framework command
