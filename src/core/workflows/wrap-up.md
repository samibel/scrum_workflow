# Workflow: Session Wrap-Up

## Overview

Step-by-step procedure for creating a session summary artifact that captures the developer's session activity, decisions, risks, and pending work.

## Trigger

Invoked when developer runs `/wrap-up` command at end of session.

## Session Boundary Detection

**Step 0:** Determine session start time

```
IF SCRUM_SESSION_START_TIME environment variable is set
  → Use that value (ISO 8601 UTC)
ELSE IF _scrum-output/memory/sessions/ directory exists
  → Use mtime of most recent session file
ELSE
  → Use current time as session start
```

## Workflow Steps

### Step 1: Gather Session Context

**Goal:** Identify all stories touched during this session

**Actions:**
1. Scan `_scrum-output/sprints/` directory for story.md files
2. For each story file:
   - Check file modification time (mtime)
   - If mtime >= sessionStartTime, include in list
   - Extract: ticket ID, title, current status
3. Return array of {ticket, title, status, lastModified}

**Output:** Array of story objects

### Step 2: Extract Status Changes

**Goal:** Document status transitions for stories worked on

**Actions:**
1. Iterate over stories from Step 1
2. For each story:
   - Current status is available from frontmatter
   - Note: historical transitions not tracked (status is current only)
   - Create entry: {ticket, currentStatus, timestamp}
3. Return array of status entries

**Output:** Array of status change objects

### Step 3: Load Recent Decisions

**Goal:** Capture decisions made during this session

**Actions:**
1. Scan `_scrum-output/memory/decisions/` for DR-*.md files
2. For each decision file:
   - Check file mtime
   - If mtime >= sessionStartTime, include in session summary
   - Parse frontmatter: DR number, decision summary, related ticket
3. Return array of decision objects

**Output:** Array of decision records with metadata

### Step 4: Load Session Risk Notes

**Goal:** Capture risks identified/modified during session

**Actions:**
1. Scan `_scrum-output/memory/risks/` for RN-*.md files
2. For each risk file:
   - Check file mtime
   - If mtime >= sessionStartTime, include in summary
   - Parse frontmatter: RN number, description, severity, affected area
3. Return array of risk objects

**Output:** Array of risk notes with metadata

### Step 5: Derive Pending Actions

**Goal:** Identify work that carries forward to next session

**Actions:**
1. Identify incomplete stories:
   - Status != "done" AND status != "cancelled"
   - Mark as pending: "Resume work on {ticket}: {title}"
2. Identify unresolved risks:
   - All risks from Step 4 (treated as needing follow-up)
   - Mark as pending: "Address risk {RN-XXX}: {description}"
3. Prioritize by story/risk severity
4. Return array of action objects

**Output:** Array of pending action objects

### Step 6: Format Session Summary

**Goal:** Create human-readable markdown output

**Actions:**
1. Calculate session duration:
   - `duration_ms = now - sessionStartTime`
   - Format as: "approximately X hour(s)"
2. Create YAML frontmatter:
   ```yaml
   ---
   schema_version: 1.0.0
   date: {YYYY-MM-DD}
   session_duration: "{duration}"
   stories_touched: [SW-001, SW-002, ...]
   decisions_created: [DR-001, DR-002, ...]
   risks_identified: [RN-001, RN-002, ...]
   ---
   ```
3. Create content sections:
   - ## Stories Worked On (with status)
   - ## Status Changes
   - ## Decisions Made (with references)
   - ## Risks Identified (with severity)
   - ## Pending Actions (prioritized)
4. Return formatted markdown string

**Output:** Complete markdown session summary

### Step 7: Write Session Artifact

**Goal:** Save session summary to file system

**Actions:**
1. Create sessions directory if needed:
   - Path: `_scrum-output/memory/sessions/`
   - Use `mkdir -p` with recursive: true
2. Construct filename:
   - Base: `session-{date}.md` (where date from frontmatter)
3. Check for existing file:
   - If NOT exists: Write as new file, return path
   - If exists: Append mode (preserve original frontmatter, add new session block)
4. Return path to created/updated file

**Output:** File path to session artifact

## Collision Handling (Multiple Calls Same Day)

When `/wrap-up` is called more than once on the same day:

**Detection:**
- Check if `session-{YYYY-MM-DD}.md` already exists

**Append Mode:**
- Read existing file
- Keep original YAML frontmatter unchanged
- Extract original content (after frontmatter)
- Create new session block:
  ```
  ---
  ## Session Block ({timestamp})
  {new session content}
  ```
- Concatenate: originalFrontmatter + originalContent + newSessionBlock
- Write back to same file

**Result:** Single file with multiple session blocks, timestamp-separated

## Error Handling

| Scenario | Action |
|----------|--------|
| Sessions directory creation fails | HALT with error |
| Story file unreadable | Skip that story, log warning |
| Decision/risk directory doesn't exist | Continue (empty list) |
| Write operation fails | Retry up to 3 times, then HALT |

## Completion Criteria

✅ Session summary artifact created/updated
✅ File location: `_scrum-output/memory/sessions/session-{YYYY-MM-DD}.md`
✅ Contains all session context: stories, decisions, risks, actions
✅ YAML frontmatter includes required metadata
✅ Content readable by `/session-start` command (next story)

## References

- [Command Spec](../commands/wrap-up.md)
- [Skill Definition](../skills/wrap-up/SKILL.md)
- [Utility: session-summary.js](../utils/session-summary.js)
