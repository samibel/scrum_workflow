---
name: research-technical
trigger: "/research-technical"
requires_status: null
sets_status: null
spawns_agents:
  - researcher
---

## Purpose

Trigger technical research on a specified topic using agentic patterns (Plan-Then-Execute, Swarm Migration, Reflection Loop) orchestrated by the researcher agent. The command conducts external web research using WebSearch (not local codebase scanning with Glob/Grep) and produces AI-optimized research documentation with structured YAML frontmatter.

Unlike documentation commands (`create-project-docs`, `create-architecture-docs`) that analyze local source code, this command performs EXTERNAL research via WebSearch to gather, synthesize, and document information from online sources.

## Workflow Reference

workflows/research-technical.md

## Input

Command usage:

- `/research-technical <topic>` -- Research a technical topic (required argument)
  - Example: `/research-technical "agentic patterns for documentation"`
  - Example: `/scrum-research technical "container orchestration best practices"`
- `/research-technical <topic> --sources <url1> <url2>` -- Research with specific source URLs
- `/research-technical <topic> --output <path>` -- Custom output location (default: `docs/research/`)

Arguments:

- `<topic>` (required): The technical research topic to investigate. Can be a quoted string for multi-word topics.
- `--sources <urls...>` (optional): Specific source URLs to include in research. Space-separated list of URLs.
- `--output <path>` (optional): Custom output directory path. Defaults to `docs/research/` relative to project root.

The command reads `context/index.md` to determine project domain and tech stack for context-aware research. If `context/index.md` is missing, the command warns but does not halt -- research proceeds without project-specific context.

## Output

- `docs/research/technical-research-{topic-slug}-{date}.md` -- Structured technical research document with YAML frontmatter
  - Topic slug: kebab-case transformation of the research topic
  - Date: YYYY-MM-DD format
  - Example: `docs/research/technical-research-agentic-patterns-for-documentation-2026-03-30.md`

The generated document includes YAML frontmatter:

```yaml
type: technical_research
topic: {topic}
date: {date}
sources:
  - {source_urls}
ai_optimized: true
version: 1.0
research_confidence: high  # or medium | low
```
