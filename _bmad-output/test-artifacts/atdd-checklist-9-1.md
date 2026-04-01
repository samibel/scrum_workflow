---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate']
lastStep: 'step-04c-aggregate'
lastSaved: '2026-03-30'
story_id: '9-1'
story_title: 'researcher Agent Definition'
inputDocuments:
  - '_bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md'
  - '_bmad/tea/config.yaml'
  - '_bmad/tea/testarch/tea-index.csv'
  - 'scrum_workflow/agents/architect.md'
  - 'scrum_workflow/agents/documentarian.md'
  - 'scrum_workflow/agents/architect-doc.md'
  - 'docs/research/technical-research-agent-patterns-2026-03-30.md'
  - '_bmad-output/test-artifacts/architect-doc-agent-definition.spec.ts'
---

# ATDD Checklist: Story 9-1 - researcher Agent Definition

## Preflight & Context

- [x] Story file loaded: `_bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md`
- [x] Stack detected: backend (no frontend manifests, project is a CLI/tool framework)
- [x] Test framework: Jest with TypeScript (existing convention)
- [x] TEA config loaded from `_bmad/tea/config.yaml`
- [x] Reference agents loaded: architect.md, documentarian.md, architect-doc.md
- [x] Research patterns document loaded: `docs/research/technical-research-agent-patterns-2026-03-30.md`
- [x] Existing test pattern referenced: `architect-doc-agent-definition.spec.ts`

## Generation Mode

- [x] Mode: AI Generation (backend project, file validation tests)
- [x] No browser recording needed

## Test Strategy

### Acceptance Criteria to Test Mapping

| AC | Description | Test Level | Priority | Test Count |
|----|-------------|------------|----------|------------|
| AC1 | Agent file exists at correct location | Unit (FS validation) | P0/P2 | 3 |
| AC2 | YAML frontmatter follows convention | Unit (FS validation) | P0 | 8 |
| AC3 | Identity section defines persona | Unit (content) | P0/P1 | 5 |
| AC4 | Instructions reference research patterns | Unit (content) | P0/P1 | 4 |
| AC5 | Instructions specify WebSearch usage | Unit (content) | P0/P1/P2 | 5 |
| AC6 | Instructions include four core patterns | Unit (content) | P0/P1 | 8 |
| AC7 | Output Format defines two schemas | Unit (content) | P0/P1 | 8 |
| AC8 | Output Format specifies frontmatter schema | Unit (content) | P0 | 7 |
| AC9 | Context Rules specifies loading | Unit (content) | P0/P1/P2 | 5 |
| AC10 | File follows exact structure convention | Unit (FS validation) | P0/P1/P2 | 12 |

**Total: 65 test scenarios**

## TDD Red Phase Results

- [x] Test file generated: `_bmad-output/test-artifacts/researcher-agent-definition.spec.ts`
- [x] All tests designed to FAIL (researcher.md does not exist yet)
- [x] No test.skip() used -- tests rely on file not existing for natural failure
- [x] Test structure follows established pattern from architect-doc-agent-definition.spec.ts

## Test Coverage Summary

- **AC1**: File existence, naming convention, directory co-location
- **AC2**: YAML delimiters, required fields, exact field values, dual active_in values
- **AC3**: Section existence, research analyst description, web research, agentic patterns, AI-optimized docs
- **AC4**: Section existence, patterns document path reference, implementation guidance reference
- **AC5**: WebSearch tool mention, online research specification, dual mode support, tool differentiation
- **AC6**: Four core patterns present (Plan-Then-Execute, Swarm Migration, Reflection Loop, Filesystem-Based State), with implementation details
- **AC7**: Two output schemas (technical_research, general_research), content types, no table format
- **AC8**: Seven frontmatter schema fields (type, topic, date, sources, ai_optimized, version, research_confidence)
- **AC9**: Section existence, context/index.md loading, project context understanding, loading order
- **AC10**: Section order, section count, non-empty content, frontmatter field order, structural convention match, differentiation from other agents
