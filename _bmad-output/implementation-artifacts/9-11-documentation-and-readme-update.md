# Story 9.11: Documentation & README Update

Status: done

## Story

As a developer,
I want the research agent documented in the README and command reference,
so that users know how to use the new research functionality.

## Acceptance Criteria

1. **README command table includes research commands**: `README.md` command table includes two new entries:
   - `/scrum-research technical <topic>` -- Generate technical research documentation using agentic patterns
   - `/scrum-research general <topic>` -- Generate general research documentation for broader topics
2. **Command reference documentation**: `scrum_workflow/docs/04-command-reference.md` includes detailed documentation for both research commands with examples
3. **Agentic patterns explained**: The documentation explains the four agentic patterns used: Plan-Then-Execute, Swarm Migration, Reflection Loop, Filesystem-Based State
4. **Frontmatter examples included**: The documentation includes examples of research output frontmatter
5. **Mode differences explained**: The documentation explains the difference between technical and general research modes
6. **Update flag documented**: The documentation explains the `--update` flag for refreshing existing research
7. **Pattern reference**: The documentation references `docs/research/technical-research-agent-patterns-2026-03-30.md` for detailed pattern information
8. **Completed Epics updated**: The README "Completed Epics" section includes Epic 9 with description (NOTE: Epic 9 is already listed, verify/update description if needed)
9. **Version and date updated**: The README version is updated and last updated date is set to current date

## Tasks / Subtasks

- [x] Task 1: Update README.md command table (AC: #1)
  - [x] 1.1: Add `/scrum-research technical <topic>` entry with description
  - [x] 1.2: Add `/scrum-research general <topic>` entry with description
  - [x] 1.3: Verify command table formatting matches existing entries
- [x] Task 2: Add research commands to command reference (AC: #2, #3, #4, #5, #6, #7)
  - [x] 2.1: Create `/scrum-research technical <topic>` section in `04-command-reference.md`
  - [x] 2.2: Create `/scrum-research general <topic>` section in `04-command-reference.md`
  - [x] 2.3: Add "Agentic Patterns Used" subsection explaining all four patterns
  - [x] 2.4: Add frontmatter example showing output schema
  - [x] 2.5: Add "Technical vs General Research" comparison section
  - [x] 2.6: Document `--update` flag usage and behavior
  - [x] 2.7: Add reference link to research patterns document
- [x] Task 3: Update README version and date (AC: #9)
  - [x] 3.1: Update version number if needed
  - [x] 3.2: Set last updated date to current date (2026-04-01)
- [x] Task 4: Verify Completed Epics section (AC: #8)
  - [x] 4.1: Verify Epic 9 is listed in Completed Epics
  - [x] 4.2: Update description if needed to reflect full scope
- [x] Task 5: Validate documentation consistency
  - [x] 5.1: Verify all command names match framework convention (scrum-research-*)
  - [x] 5.2: Verify all file paths are correct
  - [x] 5.3: Verify cross-references between documents work

## Dev Notes

### Critical Context from Previous Stories

**Story 9-1 (researcher agent) key learnings:**
- Researcher agent exists at `scrum_workflow/agents/researcher.md`
- Agent has `active_in: [research-technical, research-general]` for both research modes
- Agent uses WebSearch tool for external research (not Glob/Grep for local codebase)
- Output schemas: `technical_research` (13 sections) and `general_research` (8 sections)
- [Source: scrum_workflow/agents/researcher.md]

**Story 9-2 (research-technical command/workflow) key learnings:**
- Command exists at `scrum_workflow/commands/research-technical.md`
- Workflow exists at `scrum_workflow/workflows/research-technical.md`
- Command triggers: `/research-technical`, spawns: [researcher]
- Workflow implements Plan-Then-Execute with 6 phases
- Output directory: `docs/research/`
- Filename pattern: `technical-research-{topic-slug}-{date}.md`
- [Source: scrum_workflow/commands/research-technical.md]

**Story 9-3 (output template) key learnings:**
- Template exists at `scrum_workflow/templates/technical-research.md`
- Template includes YAML frontmatter with: type, topic, date, sources, ai_optimized, version, research_confidence
- Template defines 13 sections for technical research output
- [Source: scrum_workflow/templates/technical-research.md]

**Story 9-4 (web research/swarm migration) key learnings:**
- Workflow enhanced with WebSearch integration and Swarm Migration pattern
- Parallel subagents achieve 10x+ speedup vs sequential research
- Source verification and confidence levels included
- [Source: scrum_workflow/workflows/research-technical.md]

**Story 9-9 (installer integration) key learnings:**
- Skill registration templates created for both research modes
- Research framework files included in installer templates
- Install summary shows skill count including research skills
- [Source: _bmad-output/implementation-artifacts/9-9-installer-integration-for-research-skills.md]

### Documentation Pattern to Follow

The existing command reference (`scrum_workflow/docs/04-command-reference.md`) uses this format:

```markdown
## `/scrum-command-name`

**Brief description of what the command does.**

### Usage
```
/scrum-command-name [arguments]
```

### Prerequisites
- Required conditions

### What happens
1. Step 1
2. Step 2

### Output
- File paths created/modified

### See also
[Related documentation](link)
```

**Follow this exact format for research commands.**

### Agentic Patterns to Document

The four patterns from `docs/research/technical-research-agent-patterns-2026-03-30.md`:

1. **Plan-Then-Execute**: Separate planning from execution. Define scope first, then execute. Track progress. Supports long-running tasks.

2. **Swarm Migration**: 10x+ speedup via parallel subagents. Main agent spawns 3-5 subagents, each researching independent aspects. Results synthesized via map-reduce.

3. **Reflection Loop**: Self-critique after synthesis. Check completeness, citations, structure, clarity. Up to 2 iterations max. Outputs `research_confidence` level.

4. **Filesystem-Based State**: Persist to `docs/research/.research-state.json`. Update incrementally. Enables recovery from interruption. Supports resume capability.

### Frontmatter Example to Include

```yaml
---
type: technical_research  # or general_research
topic: "Authentication with OAuth2"
date: 2026-03-30
sources:
  - https://oauth.net/2/
  - https://datatracker.ietf.org/doc/html/rfc6749
ai_optimized: true
version: 1.0
research_confidence: high  # high | medium | low
---
```

### Technical vs General Research Comparison

| Aspect | Technical Research | General Research |
|--------|-------------------|------------------|
| Focus | Code patterns, APIs, architecture | Market, strategy, business |
| Output Type | `technical_research` | `general_research` |
| Sections | 13 technical sections | 8 business sections |
| Subagents | 3-5 parallel researchers | 2-3 parallel researchers |
| Example Topics | "React 18 concurrent features", "PostgreSQL optimization" | "AI market trends 2026", "Competitive analysis: CI/CD tools" |

### Update Flag Behavior

The `--update` flag enables incremental research updates:

```
/scrum-research technical <existing-topic> --update
```

Behavior:
1. Reads existing research document
2. Reads `.research-state.json` for last research date
3. Performs targeted web research for new information
4. Presents diff summary: "New findings: +5 sources, ~3 sections updated"
5. Requires user confirmation before applying changes
6. Updates frontmatter with new date and sources

### Files to Modify

1. **README.md** (root level):
   - Add research commands to command table
   - Verify/update Completed Epics section
   - Update version and last updated date

2. **scrum_workflow/docs/04-command-reference.md**:
   - Add `/scrum-research technical <topic>` section
   - Add `/scrum-research general <topic>` section
   - Add agentic patterns explanation
   - Add frontmatter examples
   - Add mode comparison
   - Add `--update` flag documentation

### Current README State

The README already shows Epic 9 in Completed Epics:
```
- **Epic 9:** Research Agent -- Technical & General
```

This is correct. The version shows 1.1.0 and last updated 2026-03-30.

### Project Structure Notes

- Documentation follows existing patterns in `scrum_workflow/docs/`
- Command reference uses consistent formatting across all commands
- Cross-references use relative links within docs directory
- Research patterns document is at `docs/research/technical-research-agent-patterns-2026-03-30.md`

### Anti-Patterns to Avoid

1. **Do not duplicate content**: Reference the research patterns document instead of copying all pattern details
2. **Do not invent new sections**: Follow existing command reference format exactly
3. **Do not hardcode dates**: Use current date (2026-03-30) as specified
4. **Do not modify command names**: Use exact names from skill registrations (scrum-research-technical, scrum-research-general)

### References

- [Source: README.md] -- Current README with command table and Completed Epics
- [Source: scrum_workflow/docs/04-command-reference.md] -- Command reference format to follow
- [Source: scrum_workflow/agents/researcher.md] -- Researcher agent definition with output schemas
- [Source: scrum_workflow/commands/research-technical.md] -- Technical research command
- [Source: scrum_workflow/workflows/research-technical.md] -- Technical research workflow with patterns
- [Source: scrum_workflow/templates/technical-research.md] -- Output template with frontmatter
- [Source: docs/research/technical-research-agent-patterns-2026-03-30.md] -- Primary reference for agentic patterns
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 9, Story 9.11] -- Story requirements and acceptance criteria
- [Source: _bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md] -- Previous story context
- [Source: _bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md] -- Previous story context
- [Source: _bmad-output/implementation-artifacts/9-9-installer-integration-for-research-skills.md] -- Previous story context

## Dev Agent Record

### Agent Model Used

Claude (GLM-5)

### Debug Log References

- Initial README command table already contained research commands (lines 72-73)
- Epic 9 already listed in Completed Epics section
- Added comprehensive research command documentation to command reference

### Completion Notes List

- Verified README command table already contains research commands (AC #1 ✅)
- Added `/scrum-research technical <topic>` section to command reference (AC #2 ✅)
- Added `/scrum-research general <topic>` section to command reference (AC #2 ✅)
- Documented all four agentic patterns with descriptions (AC #3 ✅)
- Added frontmatter examples for both research types (AC #4 ✅)
- Added Technical vs General Research comparison table (AC #5 ✅)
- Documented `--update` flag behavior (AC #6 ✅)
- Added reference link to research patterns document (AC #7 ✅)
- Verified Epic 9 in Completed Epics section (AC #8 ✅)
- Updated README version to 1.2.0 and date to 2026-04-01 (AC #9 ✅)

### File List

- `README.md` (modified - version and date updated)
- `scrum_workflow/docs/04-command-reference.md` (modified - added research command documentation)

## Change Log

- 2026-04-01: Added comprehensive research command documentation to command reference, updated README version and date
