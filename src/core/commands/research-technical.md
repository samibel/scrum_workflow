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
- `/research-technical <topic> --output <path>` -- Custom output location (default: `_scrum-output/memory/research/`)

Arguments:

- `<topic>` (required): The technical research topic to investigate. Can be a quoted string for multi-word topics.
- `--sources <urls...>` (optional): Specific source URLs to include in research. Space-separated list of URLs.
- `--output <path>` (optional): Custom output directory path. Defaults to `_scrum-output/memory/research/` relative to project root.
- `--update` (optional): Incremental update mode. Updates existing research document with new findings since last research date. Falls back to full research if no previous research exists.

The command reads `context/index.md` to determine project domain and tech stack for context-aware research. If `context/index.md` is missing, the command warns but does not halt -- research proceeds without project-specific context.

## Output

- `_scrum-output/memory/research/RR-XXX.md` -- Structured technical research document with YAML frontmatter
  - Naming: sequential `RR-XXX.md` format (3-digit, zero-padded, e.g., `RR-001.md`, `RR-042.md`)
  - Numbering: determined by scanning existing artifacts in `_scrum-output/memory/research/` and incrementing the highest
  - Example: `_scrum-output/memory/research/RR-001.md`

The generated document includes YAML frontmatter:

```yaml
type: technical_research
topic: {topic}
date: {date}
sources:
  - {source_urls}
tags:
  - {tag_1}
  - {tag_2}
ai_optimized: true
version: 1.0
research_confidence: high  # or medium | low
```
