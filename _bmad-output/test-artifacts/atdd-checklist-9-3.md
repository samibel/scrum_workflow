---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate']
lastStep: 'step-04c-aggregate'
lastSaved: '2026-03-30'
story_id: '9-3'
story_title: 'Technical Research Output Template'
inputDocuments:
  - '_bmad-output/implementation-artifacts/9-3-technical-research-output-template.md'
  - '_bmad/tea/config.yaml'
  - '_bmad/tea/testarch/tea-index.csv'
  - 'scrum_workflow/templates/business-logic.md'
  - 'scrum_workflow/agents/researcher.md'
  - 'docs/research/technical-research-agent-patterns-2026-03-30.md'
---

# ATDD Checklist: Story 9-3 - Technical Research Output Template

## Preflight & Context

- [x] Story file loaded: `_bmad-output/implementation-artifacts/9-3-technical-research-output-template.md`
- [x] Stack detected: backend (template validation, no browser tests needed)
- [x] Test framework: Jest with TypeScript (existing convention)
- [x] TEA config loaded from `_bmad/tea/config.yaml`
- [x] Reference templates loaded: business-logic.md (placeholder syntax, section structure)
- [x] Researcher agent definition loaded: scrum_workflow/agents/researcher.md (output format reference)
- [x] Research patterns document loaded: `docs/research/technical-research-agent-patterns-2026-03-30.md`
- [x] Existing test pattern referenced: researcher-agent-definition.spec.ts

## Generation Mode

- [x] Mode: AI Generation (backend project, template validation tests)
- [x] No browser recording needed

## Test Strategy

### Acceptance Criteria to Test Mapping

| AC | Description | Test Level | Priority | Test Count |
|----|-------------|------------|----------|------------|
| AC1 | Template file exists at correct location | Unit (FS validation) | P0 | 3 |
| AC2 | YAML frontmatter schema with 7 fields | Unit (content) | P0 | 9 |
| AC3 | Complete section hierarchy (13 sections) | Unit (content) | P0 | 16 |
| AC4 | Executive Summary structured for AI extraction | Unit (content) | P0/P1 | 4 |
| AC5 | H2/H3 heading structure | Unit (content) | P0 | 5 |
| AC6 | Bullet point guidance | Unit (content) | P0/P1 | 4 |
| AC7 | Source URL placeholders in References | Unit (content) | P0 | 4 |
| AC8 | Confidence level guidance | Unit (content) | P0/P1 | 4 |
| AC9 | Mermaid diagram placeholders | Unit (content) | P0/P1 | 6 |
| AC10 | Template naming convention (kebab-case) | Unit (FS validation) | P2 | 2 |
| AC11 | Placeholder syntax follows convention | Unit (content) | P0/P1 | 5 |

**Total: 62 test scenarios**

## TDD Red Phase Results

- [x] Test file generated: `_bmad-output/test-artifacts/technical-research-template.spec.ts`
- [x] All tests designed to FAIL (technical-research.md template does not exist yet)
- [x] No test.skip() used -- tests rely on file not existing for natural failure
- [x] Test structure follows established pattern from researcher-agent-definition.spec.ts

## Test Coverage Summary

- **AC1**: Template file existence, location in templates directory, kebab-case naming
- **AC2**: YAML frontmatter delimiters, 7 required fields (type, topic, date, sources, ai_optimized, version, research_confidence), field values, field order
- **AC3**: 13 required sections (Executive Summary, Table of Contents, Research Methodology, Technical Landscape, Technology Stack Analysis, Integration Patterns, Implementation Approaches, Performance & Scalability, Security Considerations, Strategic Recommendations, Implementation Roadmap, Future Outlook, References), section order, non-empty content
- **AC4**: Executive Summary section exists, 2-3 paragraph guidance, key findings placeholder, AI context optimization guidance
- **AC5**: H2 for main sections, H3 for subsections, consistent heading hierarchy, easy parsing structure
- **AC6**: Bullet point guidance, `-` syntax per Markdown, easy extraction guidance
- **AC7**: References section exists, source URL placeholders, `{{source_url}}` syntax, access date guidance
- **AC8**: Confidence level guidance in relevant sections, high/medium/low values, research_confidence field
- **AC9**: Mermaid diagram types (flowchart, sequenceDiagram, graph TD), placeholder syntax, example Mermaid code, architecture and integration pattern diagrams
- **AC10**: kebab-case filename, consistent with other templates
- **AC11**: `{{variable}}` placeholder syntax, `<!-- guidance comments -->` for fill instructions, consistent with business-logic.md pattern

## Test Execution Results (2026-03-30)

```
FAIL ./technical-research-template.spec.ts
  Story 9-3: Technical Research Output Template
    AC1: Template file exists at correct location
      ✕ P0: technical-research.md exists in templates directory (1 ms)
      ✕ P0: technical-research.md is alongside other template files (1 ms)
      ✕ P2: technical-research.md uses kebab-case naming convention (1 ms)
    AC2: YAML frontmatter schema with 7 fields
      ✕ P0: file has valid YAML frontmatter delimiters
      ✕ P0: frontmatter contains all 7 required fields
      ✕ P0: type field has placeholder value "technical_research"
      ✕ P0: topic field has {{topic}} placeholder
      ✕ P0: date field has {{date}} placeholder
      ... (all 62 tests failing)
```

**TDD Red Phase: VERIFIED** - All tests fail as expected because template does not exist

## Next Steps (TDD Green Phase)

After implementing the template at `scrum_workflow/templates/technical-research.md`:

1. Remove `test.skip()` from all test files (if any were used)
2. Run tests: `npm test`
3. Verify tests PASS (green phase)
4. If any tests fail:
   - Either fix template (implementation bug)
   - Or fix test (test bug)
5. Commit passing tests
