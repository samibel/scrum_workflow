# Story 9.1: researcher Agent Definition

Status: done

## Story

As a developer,
I want a dedicated research agent defined in SKILL.md format that can handle both technical and general research,
so that the agent has a clear identity, instructions, and output format for generating AI-optimized research documentation.

## Acceptance Criteria
1. **Agent file exists at correct location**: `scrum_workflow/agents/researcher.md` exists alongside `architect.md`, `developer.md`, `qa.md`, `documentarian.md`, `architect-doc.md`
2. **YAML frontmatter follows established convention**: File has valid YAML frontmatter with exactly these fields:
   - `name: researcher`
   - `display_name: Researcher`
   - `role:` Technical research specialist focused on web research and agentic patterns
   - `active_in: [research-technical, research-general]`
   - `model: claude-sonnet-4`
   - `max_tokens: 4000`
3. **Identity section defines agent persona**: Describes the agent as a research analyst that performs web research, applies agentic patterns (Plan-Then-Execute, Swarm Migration, Reflection Loop), and generates AI-optimized documentation with structured frontmatter
4. **Instructions section references research patterns document**: Explicitly references `docs/research/technical-research-agent-patterns-2026-03-30.md` for implementation guidance
5. **Instructions section specifies WebSearch tool usage**: Agent must use WebSearch tool for online research and support both technical and general research modes
6. **Instructions section includes four core patterns**: (1) Plan-Then-Execute for workflow structure, (2) Swarm Migration for parallel subagent research, (3) Reflection Loop for quality assurance, (4) Filesystem-Based State for checkpoint recovery
7. **Output Format section defines two output schemas**:
   - `technical_research`: Code patterns, API references, architecture diagrams, technical landscape
   - `general_research`: Executive summary, market analysis, strategic recommendations
8. **Output Format section specifies frontmatter schema**: `type`, `topic`, `date`, `sources`, `ai_optimized: true`, `version: 1.0`, `research_confidence`
9. **Context Rules section specifies context loading**: Agent loads `context/index.md` to understand project context before research
10. **File follows exact structure convention**: Same section order as other agents: frontmatter -> Identity -> Instructions -> Output Format -> Context Rules

## Tasks / Subtasks

- [x] Task 1: Create agent definition file (AC: #1, #2, #10)
  - [x] 1.1: Create `scrum_workflow/agents/researcher.md` with YAML frontmatter matching convention from `architect.md`
  - [x] 1.2: Verify frontmatter fields: name, display_name, role, active_in (with two values), model, max_tokens
- [x] Task 2: Write Identity section (AC: #3)
  - [x] 2.1: Define agent persona as research analyst for web research and AI-optimized documentation
- [x] Task 3: Write Instructions section (AC: #4, #5, #6)
  - [x] 3.1: Reference the research patterns document for `docs/research/technical-research-agent-patterns-2026-03-30.md`
  - [x] 3.2: Specify WebSearch tool usage for both technical and general research
  - [x] 3.3: Include four core agentic patterns with implementation details
- [x] Task 4: Write Output Format section (AC: #7, #8)
  - [x] 4.1: Define technical_research output schema with sections
  - [x] 4.2: Define general_research output schema with sections
  - [x] 4.3: Specify frontmatter schema fields `type`, `topic`, `date`, `sources`, `ai_optimized`, `version`, `research_confidence`
- [x] Task 5: Write Context Rules section (AC: #9)
  - [x] 5.1: Specify loading `context/index.md` for understand project context
- [x] Task 6: Verify and validate (AC: #10)
  - [x] 6.1: Run frontmatter validation against established schema
  - [x] 6.2: Verify section order matches architect.md exactly
  - [x] 6.3: Verify no extra or missing sections
  - [x] 6.4: Verify content matches epics acceptance criteria

## Dev Notes

[Source: scrum_workflow/agents/architect.md] -- Primary structural reference for agent format
[Source: scrum_workflow/agents/documentarian.md] -- Reference for documentation agent with max_tokens: 4000
[Source: scrum_workflow/agents/architect-doc.md] -- Reference for documentation agent pattern
[Source: _bmad-output/planning-artifacts/epics.md#Epic 9, Story 9.1] -- Story requirements and acceptance criteria
[Source: docs/research/technical-research-agent-patterns-2026-03-30.md] -- PRIMARY REFERENCE for all agentic patterns and output structure
[Source: _bmad-output/planning-artifacts/architecture.md] -- SKILL.md format specification, naming conventions

### Critical Implementation Notes

1. **Dual active_in Values**: This is the FIRST agent with two `active_in` values. Ensure the YAML array syntax is correct:
   ```yaml
   active_in:
     - research-technical
     - research-general
   ```
2. **Research Patterns Reference**: The Instructions section MUST include an explicit reference to `docs/research/technical-research-agent-patterns-2026-03-30.md`. This is the source document for all agentic patterns used by this agent.
3. **WebSearch Tool**: Unlike documentarian and architect-doc which use Glob/Grep for LOCAL analysis, the researcher uses WebSearch for EXTERNAL research. This is a critical distinction.
4. **Output Format is NOT table-based**: Unlike architect/dev/qa agents which use the Findings/Recommendations/Proposed AC table format, the researcher generates full research documents with structured frontmatter.
5. **AI-Optimized Output**: The frontmatter MUST include `ai_optimized: true`. This indicates the output is structured for AI consumption (H2/H3 headings, bullet points, source URLs, confidence levels).
6. **Parallel Research Guidance**: Based on the Swarm Migration pattern validated by research, each subagent should research a independent topic aspect with isolated context. Then results are synthesized via map-reduce. For technical research, 3-5 parallel subagents are recommended; for general research, 2-3 may suffice.

### Researcher vs. Documentarian/Architect-Doc: Key Distinction
[Source: scrum_workflow/agents/architect-doc.md] -- Analysis shows important differences:
- **Documentarian**: scans LOCAL code with Glob/Grep, generates 3 doc types (business-logic, workflows, domain-model) -- single `active_in` value
- **Architect-Doc**: scans LOCAL code with Glob/Grep, generates 5 doc types (backend/frontend/devops/local-dev/testing architecture) -- single `active_in` value
- **Researcher**: performs EXTERNAL web research via WebSearch, generates 2 output types (technical_research OR general_research) -- DUAL `active_in` values

### Lessons from Story 7-1 (Previous Agent Definition)
The Story 7-1 (architect-doc agent definition) completed successfully with these learnings:
- Followed the exact same pattern as documentarian.md (Epic 6)
-- same frontmatter fields, same section structure
- 60 ATDD tests passed with 100% pass rate
- Code review found 12 patch findings, all addressed -- clean agent definition is the reference
- Key insight: agent definition files should be thorough and include edge cases, error handling, and security considerations upfront

### Research Agent Implementation Guidance
[Source: docs/research/technical-research-agent-patterns-2026-03-30.md]
The primary reference document defines:
- **Plan-Then-Execute Pattern**: Separate planning from execution. Define scope first, then execute. Track progress. Supports long-running tasks.
- **Swarm Migration Pattern**: 10x+ speedup via parallel subagents. Main agent spawns 3-5 subagents, each researching independent aspects.
- **Reflection Loop**: Self-critique after synthesis. Check completeness, citations, structure, clarity. Up to 2 iterations max.
- **Filesystem-Based State**: Persist to `docs/research/.research-state.json`. Update incrementally. Enables recovery from interruption.
- **Structured Output**: YAML frontmatter with `ai_optimized: true`. Use H2/H3 headings, bullet points, source URLs, confidence levels.

Include Mermaid diagrams where applicable (e.g., `flowchart` for research workflow, `sequenceDiagram` for integration patterns).

### Frontmatter Schema (from research patterns document)
```yaml
---
type: technical_research  # or general_research
topic: {{topic}}
date: {{date}}
sources:
  - {{source_urls}}
ai_optimized: true
version: 1.0
stepsCompleted: [1,2,3,4,5,6]
research_confidence: high  # or medium | low
---
```

### Output Templates Structure
[Source: docs/research/technical-research-agent-patterns-2026-03-30.md Section 9]
Technical research output should include:
- Executive Summary (2-3 paragraphs for AI context extraction)
- Table of Contents
- Research Methodology
- Technical Landscape
- Technology Stack Analysis
- Integration Patterns
- Implementation Approaches
- Performance & Scalability
- Security Considerations
- Strategic Recommendations
- Implementation Roadmap
- Future Outlook
- References

General research output should include:
- Executive Summary (2-3 paragraphs)
- Market Analysis
- Competitive Landscape
- Strategic Recommendations
- Implementation Considerations
- Risk Assessment
- Future Outlook
- References

### Agent Workflow (from research patterns document Section 8.1)
1. Scope Confirmation -- define topic, goals, scope boundaries
2. Technical Overview -- technology stack, languages, frameworks
3. Integration Patterns -- API design, communication protocols
4. Architectural Patterns -- system architecture, design principles
5. Implementation Research -- best practices, framework comparisons
6. Research Synthesis -- executive summary, strategic recommendations, final document assembly

### Project Structure Notes
- Output file: `scrum_workflow/agents/researcher.md`
- Alignment with existing agent file structure (kebab-case naming, SKILL.md format)
- Follows Three-Layer Separation: Framework Layer (`scrum_workflow/`)
- No conflicts detected

### References
- [Source: scrum_workflow/agents/architect.md] -- Primary structural reference for agent format
- [Source: scrum_workflow/agents/documentarian.md] -- Reference for documentation agent with max_tokens: 4000
- [Source: scrum_workflow/agents/architect-doc.md] -- Reference for documentation agent pattern
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 9, Story 9.1] -- Story requirements and acceptance criteria
- [Source: docs/research/technical-research-agent-patterns-2026-03-30.md] -- PRIMARY REFERENCE for all agentic patterns and output structure
- [Source: _bmad-output/planning-artifacts/architecture.md] -- SKILL.md format specification, naming conventions

## Dev Agent Record
_This section will be populated by the dev agent during implementation._

### Agent Model Used
Claude (GLM-5.1)

### Debug Log References
- All 64 ATDD tests pass with 100% pass rate
- No regressions introduced in existing test suites

### Completion Notes List
- Created `scrum_workflow/agents/researcher.md` with complete agent definition following SKILL.md format
- YAML frontmatter includes all required fields: name (researcher), display_name (Researcher), role, active_in (dual values: research-technical, research-general), model (claude-sonnet-4), max_tokens (4000)
- Identity section defines research analyst persona for web research, agentic patterns, and AI-optimized documentation
- Instructions section references `docs/research/technical-research-agent-patterns-2026-03-30.md` as primary pattern source
- Instructions specify WebSearch as primary tool (not Glob/Grep), differentiating from documentarian and architect-doc agents
- Four core agentic patterns included: Plan-Then-Execute, Swarm Migration, Reflection Loop, Filesystem-Based State
- Output Format defines two schemas: technical_research (13 required sections) and general_research (8 required sections)
- Output Format specifies frontmatter schema with all 7 fields: type, topic, date, sources, ai_optimized, version, research_confidence
- Context Rules specify loading order: context/index.md first, then research patterns doc, config.yaml, previous research, dynamic sources
- Section order matches architect.md exactly: Identity -> Instructions -> Output Format -> Context Rules

### File List
- `scrum_workflow/agents/researcher.md` (new)

### Review Findings

- [x] [Review][Patch] Context Rules missing error handling for missing files [researcher.md:110-118] -- Added "if missing, proceed without it" conditionals and Error Handling note matching architect-doc.md convention. FIXED.
- [x] [Review][Patch] "Each entry includes" block placement ambiguity [researcher.md:64-66] -- Moved the "Each entry includes" description to precede the section list for clarity. FIXED.
- [x] [Review][Defer] Installer template missing docs/research/ directory -- deferred to Story 9.9 (installer integration). Pre-existing gap not caused by this change.

### Review Findings (Code Review Pass 2)

- [x] [Review][Patch] Missing trailing newline at end of file [researcher.md:118] -- Added trailing newline to match convention from architect.md and documentarian.md. FIXED.
- [x] [Review][Patch] Context Rules entries 3-5 missing inline "if missing" conditionals [researcher.md:114-116] -- Added "(if missing, proceed without it)" to entries 3 and 4 for consistency with entries 1 and 2. FIXED.
