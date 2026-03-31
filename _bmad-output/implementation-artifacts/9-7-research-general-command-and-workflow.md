# Story 9.7: `/scrum-research general` Command & Workflow

Status: ready-for-dev

## Story

As a developer,
I want to run `/scrum-research general <topic>` for broader research beyond technical topics,
so that I can research business, market, competitive, and strategic topics using the same agentic patterns.

## Acceptance Criteria

1. **Command file exists at correct location**: `scrum_workflow/commands/research-general.md` exists in SKILL.md command format with YAML frontmatter: `name: research-general`, `trigger: /research-general`, `requires_status: null`, `sets_status: null`, `spawns_agents: [researcher]`
2. **Workflow file exists at correct location**: `scrum_workflow/workflows/research-general.md` exists with the same Plan-Then-Execute workflow structure as technical research (Scope Confirmation, Research Plan, Swarm Research, Verification, Reflection Loop, Synthesis)
3. **Workflow uses same four patterns**: Plan-Then-Execute, Swarm Migration, Reflection Loop, Filesystem-Based State -- same patterns as technical research
4. **Output schema is type: general_research**: Output uses the general_research output format with sections optimized for non-technical topics: Executive Summary, Market Analysis, Competitive Landscape, Strategic Recommendations, Implementation Considerations, Risk Assessment, Future Outlook, References
5. **Same state file as technical research**: The workflow uses the same state file `docs/research/.research-state.json` -- technical and general research share state management
6. **Generated filename pattern**: Output files follow the pattern `general-research-{topic-slug}-{date}.md`
7. **Adapter skill created**: A `.claude/skills/scrum-research-general.md` adapter skill is created that references the framework command file
8. **Reuses Stories 9.3-9.6**: Output template, web research integration, reflection loop, and state management from Stories 9.3-9.6 are reused for general research -- no duplicate implementation needed

## Tasks / Subtasks

- [ ] Task 1: Create command definition file (AC: #1)
  - [ ] 1.1: Create `scrum_workflow/commands/research-general.md` with SKILL.md command format frontmatter
  - [ ] 1.2: Set frontmatter fields: name (research-general), trigger (/research-general), requires_status (null), sets_status (null), spawns_agents ([researcher])
  - [ ] 1.3: Document Purpose section explaining general research for business/market/strategic topics
  - [ ] 1.4: Document Workflow Reference to `workflows/research-general.md`
  - [ ] 1.5: Document Input section with topic argument and optional flags (--sources, --output)
  - [ ] 1.6: Document Output section with filename pattern and frontmatter schema
- [ ] Task 2: Create workflow definition file (AC: #2, #3, #4, #5, #6)
  - [ ] 2.1: Create `scrum_workflow/workflows/research-general.md` based on `research-technical.md` structure
  - [ ] 2.2: Adapt Step 0 (Input Parsing) for general research topic extraction
  - [ ] 2.3: Adapt Step 1-2 (Validation, Agent Loading) -- same as technical research
  - [ ] 2.4: Adapt Step 3 (Scope Confirmation) with general research scope format
  - [ ] 2.5: Adapt Step 4 (Output Directory Creation) -- same as technical research
  - [ ] 2.6: Adapt Step 5 (Research Plan) with 2-3 subagents for general research (vs 3-5 for technical)
  - [ ] 2.7: Adapt Step 6 (Swarm Research) with general research subagent templates (Market Analysis, Competitive Landscape, Strategic Recommendations)
  - [ ] 2.8: Adapt Step 7 (Verification) -- same cross-referencing logic as technical research
  - [ ] 2.9: Adapt Step 8 (Reflection Loop) -- same as technical research
  - [ ] 2.10: Adapt Step 9 (Synthesis) with general_research output schema (8 sections instead of 13)
  - [ ] 2.11: Specify frontmatter schema with `type: general_research`
  - [ ] 2.12: Specify same state file path `docs/research/.research-state.json`
  - [ ] 2.13: Define Write Boundaries section (same as technical research)
- [ ] Task 3: Create adapter skill file (AC: #7)
  - [ ] 3.1: Create `.claude/skills/scrum-research-general.md` using adapter pattern from `scrum-research-technical.md`
  - [ ] 3.2: Include YAML frontmatter with name, trigger, description, framework_command fields
  - [ ] 3.3: Reference the framework command file with `{framework_commands}/research-general.md`
- [ ] Task 4: Validate and verify (AC: all)
  - [ ] 4.1: Verify command file follows SKILL.md format convention
  - [ ] 4.2: Verify workflow file follows same structure as research-technical.md
  - [ ] 4.3: Verify adapter skill matches existing adapter pattern
  - [ ] 4.4: Verify frontmatter schema uses `type: general_research`
  - [ ] 4.5: Verify filename pattern is `general-research-{topic-slug}-{date}.md`
  - [ ] 4.6: Verify all AC items are covered

## Dev Notes

### Critical Context from Previous Stories

**Story 9-1 (researcher agent) key learnings:**
- Researcher agent has DUAL `active_in` values: `[research-technical, research-general]` -- this command uses the second value
- Output Format defines `general_research` schema with 8 required sections (vs 13 for technical)
- General research focuses on: Executive Summary, Market Analysis, Competitive Landscape, Strategic Recommendations, Implementation Considerations, Risk Assessment, Future Outlook, References
- Swarm Migration for general research: 2-3 subagents (vs 3-5 for technical)
- [Source: scrum_workflow/agents/researcher.md Output Format section]
- [Source: _bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md]

**Story 9-2 (technical research command/workflow) key learnings:**
- Command file pattern with frontmatter fields: name, trigger, requires_status, sets_status, spawns_agents
- Workflow follows 6-phase Plan-Then-Execute structure
- Write Boundaries: only write to `docs/research/` directory
- Adapter skill naming: `scrum-research-{mode}.md` pattern
- [Source: scrum_workflow/commands/research-technical.md]
- [Source: scrum_workflow/workflows/research-technical.md]
- [Source: _bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md]

**Story 9-3 (output template) key learnings:**
- Technical research template at `scrum_workflow/templates/technical-research.md`
- General research should have corresponding template at `scrum_workflow/templates/general-research.md`
- Both templates share frontmatter schema with `ai_optimized: true` field
- [Source: scrum_workflow/templates/technical-research.md]

**Story 9-4 (web research integration) key learnings:**
- WebSearch tool integration for external research
- Swarm Migration pattern with parallel subagents
- Progress tracking format and error handling
- All patterns are REUSABLE for general research -- no new implementation needed
- [Source: scrum_workflow/workflows/research-technical.md Steps 5-7]
- [Source: _bmad-output/implementation-artifacts/9-4-web-research-integration-and-swarm-migration-pattern.md]

### Key Differences: Technical vs General Research

| Aspect | Technical Research | General Research |
|--------|-------------------|------------------|
| **Subagent count** | 3-5 parallel subagents | 2-3 parallel subagents |
| **Subagent focus** | Architecture, Frameworks, Best Practices, Performance, Security | Market Analysis, Competitive Landscape, Strategic Recommendations |
| **Output type** | `technical_research` | `general_research` |
| **Output sections** | 13 sections (Technical Landscape, Technology Stack, etc.) | 8 sections (Market Analysis, Competitive Landscape, etc.) |
| **Filename pattern** | `technical-research-{topic-slug}-{date}.md` | `general-research-{topic-slug}-{date}.md` |
| **State file** | Same (`docs/research/.research-state.json`) | Same (`docs/research/.research-state.json`) |

### General Research Subagent Task Distribution

For general research, spawn 2-3 parallel subagents with these templates:

| Subagent | Research Aspect | Search Query Pattern | Source Categories |
|----------|-----------------|---------------------|-------------------|
| Subagent 1 | Market Analysis | "{topic} market size growth trends analysis" | Market reports, industry analysis |
| Subagent 2 | Competitive Landscape | "{topic} competitors comparison alternatives" | Company websites, review sites |
| Subagent 3 | Strategic Recommendations | "{topic} best practices strategy implementation" | Consulting reports, case studies |

### Frontmatter Schema for General Research Output

```yaml
---
type: general_research
topic: {topic}
date: {date}
sources:
  - {source_url_1}
  - {source_url_2}
ai_optimized: true
version: 1.0
research_confidence: high  # or medium | low
---
```

### General Research Output Sections (8 Required)

From the researcher agent Output Format section:

1. **Executive Summary** (2-3 paragraphs): High-level overview with key findings and implications
2. **Market Analysis**: Market size, growth trends, segment analysis
3. **Competitive Landscape**: Key players, positioning, strengths/weaknesses
4. **Strategic Recommendations**: Actionable insights with rationale and priority
5. **Implementation Considerations**: Resource requirements, timeline, dependencies
6. **Risk Assessment**: Identified risks with probability and impact evaluation
7. **Future Outlook**: Trends, projections, strategic opportunities
8. **References**: All sources with URLs and access dates

### Structural References -- Files to Follow

**Command file pattern** (follow exactly, adapt for general):
[Source: scrum_workflow/commands/research-technical.md] -- Copy structure, change:
- `name: research-general`
- `trigger: /research-general`
- Purpose section: "general research for business, market, competitive, and strategic topics"
- Output filename: `general-research-{topic-slug}-{date}.md`

**Workflow file pattern** (adapt structure, same phases):
[Source: scrum_workflow/workflows/research-technical.md] -- Copy structure, adapt:
- Subagent task distribution: 2-3 subagents instead of 3-5
- Subagent focus areas: Market Analysis, Competitive Landscape, Strategic Recommendations
- Synthesis step: 8 sections instead of 13
- Frontmatter type: `general_research`

**Adapter skill pattern** (follow exactly):
[Source: .claude/skills/scrum-research-technical.md] -- Copy structure, change:
- `name: scrum-research-general`
- `trigger: /scrum-research general`
- `description: Conduct general research on business/market/strategic topics`
- `framework_command: {framework_commands}/research-general.md`

### Reuse from Stories 9.3-9.6

This story does NOT need to re-implement:
- **Story 9-3**: Output template structure (researcher agent already defines general_research format)
- **Story 9-4**: WebSearch integration and Swarm Migration pattern (same implementation)
- **Story 9-5**: Reflection Loop pattern (same implementation)
- **Story 9-6**: Filesystem-Based State pattern (same state file path)

The general research workflow reuses all patterns from technical research with only these changes:
1. Fewer subagents (2-3 vs 3-5)
2. Different subagent focus areas (market/competitive/strategic)
3. Different output sections (8 vs 13)
4. Different output type (`general_research` vs `technical_research`)
5. Different filename pattern (`general-research-*` vs `technical-research-*`)

### Project Structure Notes

- Command file: `scrum_workflow/commands/research-general.md` (kebab-case, matches existing command naming)
- Workflow file: `scrum_workflow/workflows/research-general.md` (kebab-case, matches existing workflow naming)
- Adapter skill: `.claude/skills/scrum-research-general.md` (matches trigger pattern)
- Output directory: `docs/research/` (same as technical research)
- State file: `docs/research/.research-state.json` (shared with technical research)
- Follows Three-Layer Separation: Framework Layer (`scrum_workflow/`), Adapter Layer (`.claude/skills/`)
- No conflicts detected

### References

- [Source: scrum_workflow/commands/research-technical.md] -- Primary structural reference for command SKILL.md format
- [Source: scrum_workflow/workflows/research-technical.md] -- Primary structural reference for workflow structure
- [Source: .claude/skills/scrum-research-technical.md] -- Adapter skill format reference
- [Source: scrum_workflow/agents/researcher.md] -- Researcher agent with general_research output format
- [Source: docs/research/technical-research-agent-patterns-2026-03-30.md] -- Agentic patterns (reused for general research)
- [Source: _bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md] -- Previous story learnings
- [Source: _bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md] -- Previous story learnings
- [Source: _bmad-output/implementation-artifacts/9-4-web-research-integration-and-swarm-migration-pattern.md] -- Previous story learnings
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 9, Story 9.7] -- Story requirements and acceptance criteria

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
