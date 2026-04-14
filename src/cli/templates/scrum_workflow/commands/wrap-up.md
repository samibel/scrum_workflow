# Command: /wrap-up

## Overview

Creates a session summary artifact capturing what was accomplished during the current developer session, including stories worked on, status changes, decisions made, risks identified, and pending actions for the next session.

## Type

Session-level command (no ticket argument required)

## Signature

```
/wrap-up
```

## Parameters

None. This is a session-level command that operates on the current session context.

## Output

Creates a markdown artifact: `_scrum-output/memory/sessions/session-{YYYY-MM-DD}.md`

## Output Structure

The session summary artifact contains:

1. **YAML Frontmatter** with metadata:
   - `schema_version`: Artifact schema version (1.0.0)
   - `date`: Session date in ISO format (YYYY-MM-DD)
   - `session_duration`: Human-readable duration ("approximately X hours")
   - `stories_touched`: Array of story IDs modified in session
   - `decisions_created`: Array of decision record IDs (DR-XXX)
   - `risks_identified`: Array of risk note IDs (RN-XXX)

2. **Content Sections** (markdown level 2 headers):
   - `## Stories Worked On` - List of stories with status
   - `## Status Changes` - Current status of each story
   - `## Decisions Made` - Decisions recorded during session
   - `## Risks Identified` - Risk notes created/modified in session
   - `## Pending Actions` - Incomplete stories and unresolved risks

## Session Timing

Session boundaries are determined by:

1. **Environment Variable** (highest priority): `SCRUM_SESSION_START_TIME` (ISO 8601 UTC)
2. **Previous Session** (fallback): Most recent modification time in `_scrum-output/memory/sessions/`
3. **Current Time** (last resort): If no prior session exists

## Collision Handling

When `/wrap-up` is called multiple times on the same day:

**Mode: Append**
- Subsequent calls append a new "Session Block" section to the existing file
- Original YAML frontmatter is preserved
- Original content is maintained above new session blocks
- New blocks separated by `---` markdown dividers and timestamps

## Example

```bash
$ /wrap-up
→ Created session artifact: _scrum-output/memory/sessions/session-2026-04-09.md
  Stories touched: 3
  Decisions made: 2
  Risks identified: 1
  Pending actions: 5
```

## Related

- **Story 7.4**: Implement Session Wrap-Up
- **Story 7.3**: Session Start (reads session summaries created by this command)
- **Story 7.1-7.2**: Decision and risk extraction (provides decision/risk context)
