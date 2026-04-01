---
name: research-general
trigger: "/research-general"
requires_status: null
sets_status: null
spawns_agents:
  - researcher
---

## Purpose

Trigger general research on a specified topic using agentic patterns (Plan-Then-Execute, Swarm Migration, Reflection Loop) orchestrated by the researcher agent. The command conducts external web research using WebSearch (not local codebase scanning with Glob/Grep) and produces AI-optimized research documentation with structured YAML frontmatter optimized for business, market, competitive, and strategic topics.

Unlike `/research-technical` which focuses on code patterns, API references, and technology stack analysis, this command focuses on executive summaries, market analysis, competitive landscape, strategic recommendations, and risk assessment for decision-making and strategic planning.

## Workflow Reference

workflows/research-general.md

## Input

Command usage:

- `/research-general <topic>` -- Research a general topic (required argument)
  - Example: `/research-general "AI market trends 2026"`
  - Example: `/scrum-research general "competitive landscape for SaaS platforms"`
- `/research-general <topic> --sources <url1> <url2>` -- Research with specific source URLs
- `/research-general <topic> --output <path>` -- Custom output location (default: `docs/research/`)

Arguments:

- `<topic>` (required): The general research topic to investigate. Can be a quoted string for multi-word topics.
- `--sources <urls...>` (optional): Specific source URLs to include in research. Space-separated list of URLs.
- `--output <path>` (optional): Custom output directory path. Defaults to `docs/research/` relative to project root.
- `--update` (optional): Incremental update mode. Updates existing research document with new findings since last research date. Falls back to full research if no previous research exists.

The command reads `context/index.md` to determine project domain and tech stack for context-aware research. If `context/index.md` is missing, the command warns but does not halt -- research proceeds without project-specific context.

## Output

- `docs/research/general-research-{topic-slug}-{date}.md` -- Structured general research document with YAML frontmatter
  - Topic slug: kebab-case transformation of the research topic
  - Date: YYYY-MM-DD format
  - Example: `docs/research/general-research-ai-market-trends-2026-2026-03-31.md`

The generated document includes YAML frontmatter:

```yaml
type: general_research
topic: {topic}
date: {date}
sources:
  - {source_urls}
ai_optimized: true
version: 1.0
research_confidence: high  # or medium | low
```
