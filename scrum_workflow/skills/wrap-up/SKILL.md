# Skill Definition: wrap-up

**Story:** 7.4 - Implement Session Wrap-Up

**Purpose:** Generate session summary artifacts capturing developer activity, decisions, risks, and pending work.

## Specification

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sprintsDir` | string | Yes | Path to `_scrum-output/sprints/` directory |
| `decisionsDir` | string | Yes | Path to `_scrum-output/memory/decisions/` directory |
| `risksDir` | string | Yes | Path to `_scrum-output/memory/risks/` directory |
| `outputDir` | string | Yes | Path to `_scrum-output/memory/sessions/` directory (will be created) |
| `sessionStartTime` | Date | Yes | Session start timestamp (ISO 8601 UTC) |

### Output

**Returns:** String path to created/updated session artifact

**Location:** `{outputDir}/session-{YYYY-MM-DD}.md`

**Format:** Markdown with YAML frontmatter

### Core Operations

1. **Gather Session Context**
   - Scans sprint stories for modifications since session start
   - Returns array of {ticket, title, status, lastModified}

2. **Extract Status Changes**
   - Identifies current status for each modified story
   - Returns array of {ticket, currentStatus, timestamp}

3. **Load Session Decisions**
   - Finds DR-*.md files created/modified in session window
   - Returns array of {drNumber, decisionSummary, ticket, created}

4. **Load Session Risks**
   - Finds RN-*.md files created/modified in session window
   - Returns array of {rnNumber, riskDescription, severity, ticket}

5. **Derive Pending Actions**
   - Maps incomplete stories and unresolved risks to next-step actions
   - Returns array of {type, ticket, action, priority}

6. **Format Summary**
   - Converts aggregated data into markdown with YAML frontmatter
   - Creates readable sections for easy scanning

7. **Write Artifact**
   - Saves to file system with collision handling
   - Preserves existing data if file already exists

### Implementation

**Module:** `scrum_workflow/utils/session-summary.js`

**Main Export:** `async function createSessionSummary(options)`

**Sub-functions:**
- `gatherSessionContext(sprintsDir, sessionStartTime)`
- `extractStatusChanges(stories, sessionStartTime)`
- `loadSessionDecisions(decisionsDir, sessionStartTime)`
- `loadSessionRisks(risksDir, sessionStartTime)`
- `derivePendingActions(stories, statusChanges, risks)`
- `formatSessionSummary(sessionData)`
- `writeSessionSummary(sessionsDir, summary)`
- `parseSessionStartTime(sessionsDir)`

### Dependencies

- **Node.js built-in modules only:**
  - `fs` (readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync)
  - `path` (join)

- **No external npm packages** (NFR-2 compliance)

### Error Handling

- Missing directories: Created automatically with `mkdirSync` recursive
- Unreadable files: Skipped with graceful degradation (continue with other files)
- Write failures: Retried up to 3 times before propagating error
- Collision detection: Append existing content instead of overwriting

### File I/O Boundaries

**READ from:**
- `_scrum-output/sprints/` (story.md files)
- `_scrum-output/memory/decisions/` (DR-*.md files)
- `_scrum-output/memory/risks/` (RN-*.md files)

**WRITE to:**
- `_scrum-output/memory/sessions/` ONLY (session artifacts)

**MUST NOT MODIFY:**
- story.md files
- Decision records
- Risk notes
- Any other artifact outside of sessions/

### YAML Frontmatter Schema

```yaml
---
schema_version: 1.0.0
date: 2026-04-09
session_duration: "approximately 2 hours"
stories_touched: ["SW-042", "SW-043"]
decisions_created: ["DR-008", "DR-009"]
risks_identified: ["RN-005"]
---
```

### Content Structure

Required markdown sections:

```markdown
## Stories Worked On
- **SW-042**: Build authentication module (status: in-progress)
- **SW-043**: Implement JWT validation (status: pending)

## Status Changes
- **SW-042**: Current status is `in-progress`

## Decisions Made
- **DR-008** (SW-042): Using HS256 algorithm for JWT signing

## Risks Identified
- **RN-005** [high] (SW-042): JWT expiration handling untested

## Pending Actions
### High Priority
- [SW-042] Resume work on SW-042: Build authentication module
- [SW-042] Address risk RN-005: JWT expiration handling untested

### Medium Priority
- [SW-043] Resume work on SW-043: Implement JWT validation
```

### Session Start Time Determination

1. Check `SCRUM_SESSION_START_TIME` environment variable
2. Fallback to most recent session file mtime in sessions/ directory
3. Last resort: current time

### Collision Handling

When called multiple times on same day:

- **Detection:** Check if `session-{YYYY-MM-DD}.md` exists
- **Append Mode:**
  1. Read existing file
  2. Extract original frontmatter and content
  3. Create new session block with timestamp
  4. Concatenate: frontmatter + original content + new block
  5. Write back to same file
- **Data Preservation:** Original content never deleted, always preserved

### Testing

**Test Files:**
- `__tests__/wrap-up/ac1-session-summary-creation.test.js` (6 tests)
- `__tests__/wrap-up/ac2-frontmatter-and-content.test.js` (7 tests)
- `__tests__/wrap-up/ac3-collision-handling.test.js` (6 tests)

**Test Framework:** Vitest 4.1.3

**Coverage:** All 3 acceptance criteria with 19 total tests

## Integration Points

**Story 7.3 (Session Start)** - CONSUMER
- Reads session summaries created by this skill
- Uses frontmatter to load context for next session

**Story 7.1-7.2** - SOURCE
- Provides decision and risk records loaded by this skill

## References

- [Workflow: wrap-up](../../workflows/wrap-up.md)
- [Command: /wrap-up](../../commands/wrap-up.md)
- [Utility: session-summary.js](../../utils/session-summary.js)
- [Template: session-summary.md](../../templates/session-summary.md)
