---
name: research-loader
role: "research-memory-integration"
description: "Discovers and loads Research Reports based on domain tag matching, providing prior research context to refinement agents"
actor: research-loader-skill
version: 1.0.0
---

# Identity

The research-loader skill is a discovery and context enrichment engine that finds relevant Research Reports from the memory artifacts and makes them available to refinement agents. It enables research memory integration into the refinement workflow (Epic 7 goal) by automatically loading prior research findings based on domain tag matching.

# Instructions

## Invocation

This skill is invoked in the refinement workflow context:

1. **During refinement session initialization** — Called by `scrum_workflow/workflows/refine-ticket.md` before agent perspectives are generated
2. **Parameters passed by workflow**: `storyPath`, `sprintDir` or similar context identifying the current story

### Required Parameters

- `sprintDir`: Path to sprint directory (or parent containing sprints/ and memory/)
- `storyPath`: Path to story.md file being refined

## Research Discovery Algorithm

### Step 1: Discover Research Reports

Scan `_scrum-output/memory/research/` directory for all files matching pattern `RR-[0-9][0-9][0-9].md`

- Returns array of absolute file paths
- Returns empty array if directory missing (graceful fallback)
- Continues on file read errors (no crash on access issues)

### Step 2: Extract Story Domain Tags

Parse story.md frontmatter to extract `domain_tags` array:

```yaml
---
title: "Story Title"
domain_tags: ["backend", "performance", "websockets"]
---
```

- Returns empty array if `domain_tags` key missing
- Safe fallback for stories without domain tags (no error)

### Step 3: Extract Report Tags

For each discovered Research Report, parse YAML frontmatter to extract `tags` array:

```yaml
---
topic: "WebSocket Performance Research"
tags: ["backend", "websockets", "performance"]
date: "2026-04-01T10:00:00Z"
referenced-by: ["SW-001", "SW-042"]
---
```

- Returns empty array if `tags` key missing
- Handles malformed YAML gracefully (no crash)
- Extracts metadata: topic, date, referenced-by for context enrichment

### Step 4: Tag Matching (Intersection)

For story domain_tags and report tags:

**Matching Rule:** `report.tags ∩ story.domain_tags`

- Find reports with at least 1 tag in common
- Case-insensitive comparison (e.g., "Backend" matches "backend")
- Returns all matching reports, sorted by:
  1. Match count (descending) — most relevant first
  2. Date (newest first) — most recent research first
- Returns empty array if no matches (graceful fallback)

### Example

```javascript
// Story domain_tags: ["backend", "performance", "cache"]
// RR-001 tags: ["backend", "websockets", "performance"]  → MATCH (2 tags)
// RR-002 tags: ["backend", "performance", "cache"]       → MATCH (3 tags, sorted first)
// RR-003 tags: ["frontend", "ui"]                         → NO MATCH

// Result order: [RR-002 (3 matches), RR-001 (2 matches)]
```

## Write Boundary (CRITICAL)

This skill READS ONLY from:
- `_scrum-output/memory/research/RR-*.md` — Research Report artifacts
- Story metadata (`domain_tags` from story.md)

This skill MUST NOT write or modify any files.

This skill MUST NOT:
- Create, modify, or delete Research Reports
- Modify story.md files
- Write to any other directories

## Context Formatting

After discovery and matching, research reports are formatted as Markdown context:

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

```

### Empty Research Handling

When no research reports match:

```markdown
## Research Context

No matching research reports found for this story's domain tags.
```

This formatted context is injected into agent prompts as optional enrichment.

## Error Handling & Resilience

### Missing Research Directory

If `_scrum-output/memory/research/` does not exist:
- **Behavior**: Return empty array, proceed with refinement
- **Error Logged**: Yes (console.error for debugging)
- **Refinement Blocked**: No — research is optional enrichment
- **User Impact**: None — refinement continues normally

### Missing Story Domain Tags

If story has no `domain_tags`:
- **Behavior**: Return empty matches (no tag search possible)
- **Error Logged**: No (expected scenario)
- **Refinement Blocked**: No
- **User Impact**: None — refinement continues, no research loaded

### File Read Errors

If individual research report file cannot be read:
- **Behavior**: Skip that report, continue with others
- **Error Logged**: Yes (console.error with file path)
- **Refinement Blocked**: No
- **User Impact**: Some research may be unavailable, but refinement proceeds

### Graceful Fallback Guarantees

- Refinement **always proceeds** even if research loading fails
- Research is **optional enrichment only**
- No error conditions cause workflow to halt
- All error cases result in continuing with available research (or none)

## NFR Compliance

- **NFR-2 (No external dependency):** Uses only fs and path (built-in Node.js modules)
- **NFR-3 (Offline capability):** All operations are local file I/O
- **NFR-4 (Atomic file operations):** Reads only; no writes
- **NFR-7 (Artifact Traceability):** Research reports reference stories via `referenced-by` field
- **NFR-9 (Inspectability):** All artifacts are human-readable Markdown with YAML frontmatter

## Integration Points

### Invoked By

- `scrum_workflow/workflows/refine-ticket.md` — Before agent perspective generation
- Context injection point: research reports passed to agent prompt context

### Data Flow

```
Story (domain_tags) 
    ↓
discoverResearchReports() → [RR-001.md, RR-002.md, ...]
    ↓
extractResearchTags() for each report
    ↓
matchReportsByTags() → [matched RR-*.md files sorted]
    ↓
formatResearchContext() → Markdown context for agent
    ↓
Agent receives research context in prompt
    ↓
Agent references research in output recommendations
```

## Reference Implementation

Module: `scrum_workflow/utils/research-loader.js`

Exported functions:
- `discoverResearchReports(researchDir)` — Find all RR-*.md files
- `extractResearchTags(filePath)` — Parse tags from report frontmatter
- `matchReportsByTags(reports, storyTags)` — Intersection matching and sorting
- `loadMatchingReports(sprintDir, storyPath)` — Orchestrate full discovery → matching pipeline
- `formatResearchContext(research)` — Format matched research as agent context
- `extractStoryDomainTags(content)` — Parse domain_tags from story frontmatter (internal)
- `extractReportMetadata(filePath)` — Parse full metadata from report (internal)

# Context Rules

## Reads

- `_scrum-output/memory/research/RR-*.md` — Research Report artifacts
- Story metadata from story.md (domain_tags field)
- Research Report metadata from YAML frontmatter (tags, topic, date, referenced-by)

## Writes

- **None** — research-loader is read-only

## Boundary

- **Reads only** from `_scrum-output/memory/research/` and story context
- **No writes** to any files
- **No modifications** to artifact structure
- **Optional enrichment** — never blocks refinement if research unavailable
