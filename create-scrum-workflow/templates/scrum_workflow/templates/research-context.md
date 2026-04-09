---
template_name: research-context
description: "Format matched research reports as agent context for refinement workflows"
version: 1.0.0
format: markdown
usage: "Called by research-loader skill to format research for agent consumption"
---

# Research Context Template

This template formats discovered research reports as agent context. Use this format when injecting research findings into agent prompts during refinement.

## Empty Research (No Matches)

When no research reports match the story's domain tags:

```markdown
## Research Context

No research reports match this story's domain tags. Refinement will proceed without prior research context.
```

## Single Research Report

When one research report matches:

```markdown
## Research Context

1 research report loaded based on domain tags:

### {{topic}}
- **File**: {{filename}}
- **Tags**: {{tags}}
- **Date**: {{date}}
- **Referenced by**: {{referenced-by}}

**Content Summary**: [Agents should review {{filename}} in memory/research/ for complete context]
```

## Multiple Research Reports

When multiple reports match (sorted by relevance):

```markdown
## Research Context

{{count}} research report(s) loaded based on domain tags:

### 1. {{topic}}
- **File**: {{filename}}
- **Tags**: {{tags}}
- **Date**: {{date}}
- **Referenced by**: {{referenced-by}}

### 2. {{topic}}
- **File**: {{filename}}
- **Tags**: {{tags}}
- **Date**: {{date}}
- **Referenced by**: {{referenced-by}}

### 3. {{topic}}
- **File**: {{filename}}
- **Tags**: {{tags}}
- **Date**: {{date}}
- **Referenced by**: {{referenced-by}}

**How to use this research**: Each report above contains findings relevant to this story. Agents should:
1. Consider the research findings when recommending architecture or approach
2. Reference specific research reports in recommendations when applicable
3. Build upon existing research rather than re-investigating similar topics
```

## Integration with Agent Prompts

This context should be injected into agent prompts at the research enrichment point:

```
## Story Context
[standard story context...]

## Research Context
[research-context.md output inserted here]

## Task
Please provide your perspective on this story...
```

### Agent Instructions for Using Research

Include in the prompt before requesting agent response:

```
You have access to prior research findings on related topics. 
When making recommendations, please reference the research reports 
if they inform your analysis. You may cite findings directly from 
the research context provided above.
```

## Variable Substitution

| Variable | Source | Description |
|----------|--------|-------------|
| `{{topic}}` | `topic` field from research report frontmatter | Research title |
| `{{filename}}` | Filename (e.g., RR-001.md) | For reference and artifact lookup |
| `{{tags}}` | Comma-separated `tags` array from report | Domain tags for this research |
| `{{date}}` | `date` field from report frontmatter | ISO 8601 timestamp |
| `{{referenced-by}}` | `referenced-by` array from report | Story IDs that reference this research |
| `{{count}}` | Length of matched research array | Number of reports matched |

## Output Characteristics

- **Format**: Markdown with headings and bullet points
- **Sorting**: Reports sorted by match count (descending), then by date (newest first)
- **Accessibility**: Human-readable for agents and archive visibility
- **Graceful Fallback**: Returns empty context message if no reports match
- **No Errors**: Template generation never fails (empty research is valid output)

## Example Rendered Output

```markdown
## Research Context

2 research report(s) loaded based on domain tags:

### 1. WebSocket Connection Management
- **File**: RR-001.md
- **Tags**: backend, websockets, performance
- **Date**: 2026-03-15T10:00:00Z
- **Referenced by**: SW-042, SW-050

### 2. Caching Strategies
- **File**: RR-002.md
- **Tags**: backend, cache, performance
- **Date**: 2026-04-01T10:00:00Z
- **Referenced by**: 

**How to use this research**: Each report above contains findings relevant to this story. Agents should:
1. Consider the research findings when recommending architecture or approach
2. Reference specific research reports in recommendations when applicable
3. Build upon existing research rather than re-investigating similar topics
```

## Implementation Notes

- Template is applied after research matching completes
- Output is injected into agent prompts for Architect, Engineer, and PM perspectives
- Agents are encouraged to cite research findings in their recommendations
- Research remains optional — agents can provide recommendations even without research context
