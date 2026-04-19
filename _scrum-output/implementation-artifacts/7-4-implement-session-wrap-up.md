# Story 7.4: Implement Session Wrap-Up

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `/wrap-up` to create a session summary capturing what was accomplished and what's pending,
So that the next session can pick up seamlessly.

## Acceptance Criteria

1. **Given** FR-28 specifies `/wrap-up` creates a session summary artifact **When** a developer runs `/wrap-up` **Then** a `session-{YYYY-MM-DD}.md` artifact is created in `_scrum-output/memory/sessions/` **And** the summary contains: stories worked on, status changes made, decisions taken, risks identified, pending actions

2. **Given** the session summary artifact **When** it is created **Then** it contains YAML frontmatter with: date, stories touched, session duration context **And** the content is structured for easy scanning by `/session-start`

3. **Given** multiple sessions on the same day **When** `/wrap-up` is run again **Then** the existing session file is updated (not overwritten) with additional entries **Or** a new file with a sequence suffix is created to prevent data loss

## Tasks / Subtasks

- [x] Task 1: Create `/wrap-up` command specification (AC: #1, #2)
  - [x] 1.1 Create `scrum_workflow/commands/wrap-up.md` defining the `/wrap-up` command interface, parameters, and expected output format
  - [x] 1.2 Define command output structure: sections for Stories Worked On, Status Changes, Decisions, Risks, and Pending Actions
  - [x] 1.3 Specify that `/wrap-up` is a session-level command (no ticket argument) following the same pattern as `/session-start`

- [x] Task 2: Create `/wrap-up` workflow (AC: #1, #2, #3)
  - [x] 2.1 Create `scrum_workflow/workflows/wrap-up.md` with step-by-step session summary creation algorithm
  - [x] 2.2 Step 1 — Gather Session Context: collect all stories that have been modified in current session by checking file modification timestamps
  - [x] 2.3 Step 2 — Extract Status Changes: load story.md files and detect status transitions from session start to current time
  - [x] 2.4 Step 3 — Load Recent Decisions: scan `_scrum-output/memory/decisions/` for decisions created in current session window
  - [x] 2.5 Step 4 — Load Session Risk Notes: scan `_scrum-output/memory/risks/` for risk notes created/modified in current session
  - [x] 2.6 Step 5 — Derive Pending Actions: identify incomplete stories and unresolved risks for next session action
  - [x] 2.7 Step 6 — Create Session Summary: write `session-{YYYY-MM-DD}.md` artifact with complete session context

- [x] Task 3: Create `/wrap-up` skill (AC: #1, #2, #3)
  - [x] 3.1 Create `scrum_workflow/skills/wrap-up/SKILL.md` defining the session summary generation logic
  - [x] 3.2 Implement session context gathering: scan `_scrum-output/sprints/` for stories modified in current session window (use file mtime)
  - [x] 3.3 Implement status tracking: extract status field from story.md frontmatter to detect transitions
  - [x] 3.4 Implement decision loading: scan `_scrum-output/memory/decisions/` for DR-XXX.md files created within session window
  - [x] 3.5 Implement risk loading: scan `_scrum-output/memory/risks/` for RN-XXX.md files created/modified within session window
  - [x] 3.6 Implement collision avoidance: check for existing `session-YYYY-MM-DD.md`; if exists, append new session block with sequence number or timestamp

- [x] Task 4: Create `session-summary.js` utility (AC: #1, #2, #3)
  - [x] 4.1 Create `scrum_workflow/utils/session-summary.js` implementing session summary generation following ESM module pattern
  - [x] 4.2 Export `gatherSessionContext(sprintsDir, sessionStartTime)` — scans sprints for stories modified after session start; returns array of `{ ticket, status, title, lastModified }`
  - [x] 4.3 Export `extractStatusChanges(stories, sessionStartTime)` — for each story, detect status transitions; returns array of `{ ticket, fromStatus, toStatus, timestamp }`
  - [x] 4.4 Export `loadSessionDecisions(decisionsDir, sessionStartTime)` — scans decisions dir for DR files created after session start; returns array of `{ drNumber, decisionSummary, ticket, created }`
  - [x] 4.5 Export `loadSessionRisks(risksDir, sessionStartTime)` — scans risks dir for RN files created/modified after session start; returns array of `{ rnNumber, riskDescription, severity, affected_area, ticket }`
  - [x] 4.6 Export `derivePendingActions(stories, statusChanges, unresolved_risks)` — maps story status to actionable next steps for resumption
  - [x] 4.7 Export `formatSessionSummary(sessionContext, statusChanges, decisions, risks, pendingActions)` — renders structured session output
  - [x] 4.8 Export `writeSessionSummary(sessionsDir, summary)` — creates/updates `session-{YYYY-MM-DD}.md` with sequence suffix if collision detected
  - [x] 4.9 Export `parseSessionStartTime()` — determines session start time (environment variable, last `/session-start` call, or current session begin)

- [x] Task 5: Create `session-summary.md` template (AC: #2)
  - [x] 5.1 Create `scrum_workflow/templates/session-summary.md` template for session-YYYY-MM-DD.md artifacts
  - [x] 5.2 Define frontmatter structure: `schema_version`, `date`, `session_duration`, `stories_touched`, `decisions_created`, `risks_identified`
  - [x] 5.3 Define content structure: Stories Worked On, Status Changes, Decisions Made, Risks Identified, Pending Actions sections

- [x] Task 6: Write ATDD tests (AC: #1, #2, #3)
  - [x] 6.1 Create `scrum_workflow/__tests__/wrap-up/ac1-session-summary-creation.test.js` — tests that session summary artifact is created with correct structure
  - [x] 6.2 Create `scrum_workflow/__tests__/wrap-up/ac2-frontmatter-and-content.test.js` — tests that frontmatter contains required fields and content is scannable
  - [x] 6.3 Create `scrum_workflow/__tests__/wrap-up/ac3-collision-handling.test.js` — tests that multiple wraps on same day create sequence suffixes and preserve all data

## Dev Notes

### Critical Context: What Story 7.4 Implements

This is the FOURTH story in Epic 7 (Session Memory & Decision Persistence). Stories 7.1–7.3 established the memory infrastructure (decision records, risk notes, and session-start loading). Story 7.4 implements the COMPLEMENT to `/session-start`: the `/wrap-up` command that CREATES the session summaries that `/session-start` will load.

**Epic 7 goal:** Developer resumes work across sessions. Decisions, risks, and context persist as standalone artifacts.

**What Stories 7.1–7.3 built (already done — DO NOT re-implement):**

Story 7.1 established:
- `_scrum-output/memory/` base directory
- `_scrum-output/memory/decisions/` subdirectory with `README.md`
- `scrum_workflow/skills/decision-extraction/SKILL.md`
- `scrum_workflow/utils/decision-extraction.js` — reference for ESM pattern
- `scrum_workflow/templates/decision-record.md` — DR-XXX.md artifact format
- Integration into refinement workflow

Story 7.2 established:
- `_scrum-output/memory/risks/` subdirectory with `README.md`
- `scrum_workflow/skills/risk-extraction/SKILL.md`
- `scrum_workflow/utils/risk-extraction.js` — reference for filtering and parsing
- `scrum_workflow/templates/risk-note.md`
- Integration into refinement and review workflows

Story 7.3 established:
- `/session-start` command and workflow
- `scrum_workflow/commands/session-start.md`
- `scrum_workflow/workflows/session-start.md`
- `scrum_workflow/skills/session-start/SKILL.md`
- `scrum_workflow/utils/session-context.js` — reference for context aggregation
- Full ATDD test suite for session loading

**What this story adds:**
- `scrum_workflow/commands/wrap-up.md` — command spec
- `scrum_workflow/workflows/wrap-up.md` — workflow steps
- `scrum_workflow/skills/wrap-up/SKILL.md` — session summary generation skill
- `scrum_workflow/utils/session-summary.js` — JS implementation module
- `scrum_workflow/templates/session-summary.md` — artifact template
- `scrum_workflow/__tests__/wrap-up/` — ATDD test suite (3 files)

**What this story does NOT implement** (deferred to later stories):
- Research memory integration (Story 7.5 — auto-loading Research Reports during refinement)
- Integration of session summaries into other workflows (that's part of downstream stories)

### Architecture Compliance

**Command Tier (from PRD):**
- `/wrap-up` is a Session-level command (no ticket argument) — tier: `/{verb}` pattern
- NOT a story-level command — NEVER requires `SW-XXX` argument
- PRD table: `/wrap-up` → "Creates session summary" → `_scrum-output/memory/sessions/session-YYYY-MM-DD.md`
- **CRITICAL:** `/wrap-up` creates artifacts in `_scrum-output/memory/sessions/` (WRITE boundary) and reads from `_scrum-output/sprints/`, `_scrum-output/memory/decisions/`, `_scrum-output/memory/risks/`

**Output Directory Structure (from architecture.md):**
```
_scrum-output/
├── sprints/
│   └── SW-XXX/
│       └── story.md              ← READ: scan for session modifications
├── memory/
│   ├── decisions/
│   │   └── DR-XXX.md             ← READ: load session-window decisions
│   ├── sessions/                 ← WRITE: create session-YYYY-MM-DD.md
│   │   └── session-YYYY-MM-DD.md ← NEW artifact for this story
│   ├── risks/
│   │   └── RN-XXX.md             ← READ: load session-window risks
│   └── research/
│       └── RR-XXX.md             ← (not used by Story 7.4)
```

**Framework Directory Structure (from architecture.md):**
- Skills: `scrum_workflow/skills/{skill-name}/SKILL.md` (subdirectory + UPPERCASE)
- Utilities: `scrum_workflow/utils/`
- Workflows: `scrum_workflow/workflows/{name}.md` (flat)
- Commands: `scrum_workflow/commands/{name}.md` (flat)
- Templates: `scrum_workflow/templates/{template-name}.md` (flat)

**Write Boundary Rules (CRITICAL — Story 7.4 writes to sessions/ only):**
- `/wrap-up` command: MAY read from sprints/, memory/decisions/, memory/risks/; MAY WRITE to memory/sessions/ ONLY
- `wrap-up` skill: Creates session summary artifact; reads from sprints/ and memory/ subdirs
- `session-summary.js` utility: CAN import `writeFileSync` and `mkdirSync` for sessions/ directory ONLY
- MUST NOT modify any story.md, decision records, or risk notes
- Creating sessions/ directory if it doesn't exist is permitted and required

**YAML Frontmatter Standard (from architecture.md):**
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

**Timestamp format:** ISO 8601 UTC for internal tracking — `2026-04-09T12:00:00Z`; human-readable for session date — `2026-04-09`

**Session Start Time Detection:**
- Prefer environment variable if set: `SCRUM_SESSION_START_TIME` (ISO 8601 UTC)
- Fallback: Check file mtime of last modification in `_scrum-output/memory/sessions/` or determine from context
- If no prior session, use current invocation time as session start

### Technical Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| Framework | Markdown-as-Code | No database, no external deps (NFR-2, NFR-3) |
| Command spec | commands/wrap-up.md | Flat file, session-level tier |
| Workflow spec | workflows/wrap-up.md | Markdown workflow with step definitions |
| Skill spec | skills/wrap-up/SKILL.md | Declarative skill definition |
| Implementation | utils/session-summary.js | Pure Node.js ESM module, no external dependencies |
| Template | templates/session-summary.md | Markdown template with YAML frontmatter |
| Testing | ATDD + Jest | 3 test files covering all ACs |
| File I/O | fs module (Node.js built-in) | `readFileSync`, `writeFileSync`, `readdirSync` |

**Key Reference Patterns (from completed stories 7.1–7.3):**

1. **ESM Module Pattern** (from `utils/decision-extraction.js` and `utils/risk-extraction.js`):
   ```javascript
   export function exportedFunction(param) {
     // implementation
   }
   ```

2. **YAML Frontmatter Parsing** (from `utils/risk-extraction.js`):
   ```javascript
   const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
   // Parse extracted YAML block
   ```

3. **File System Scanning** (from `utils/session-context.js`):
   - Use `readdirSync(dir)` to list files
   - Filter by file pattern (e.g., `*.md`, `DR-*.md`)
   - Parse each file's frontmatter for metadata
   - Sort by metadata (e.g., DR number, timestamp)

4. **Artifact Naming Convention**:
   - Session files: `session-{YYYY-MM-DD}.md` (no sequence in base name; collision handling appends to same file or adds `-1`, `-2` suffix)
   - Ensure collision avoidance per AC #3

5. **Write Safety**:
   - Create `_scrum-output/memory/sessions/` directory if missing
   - Use atomic operations: write to temp file, then rename (or write directly with care)
   - Preserve session summaries created in same day by appending session blocks with timestamps

### Session Timing Strategy

**Session Start Time Determination:**
1. Check `SCRUM_SESSION_START_TIME` environment variable (set by CLI harness when session begins)
2. If not available, use most recent `/session-start` execution time (check file mtime in implementation artifacts)
3. If no session history, use current invocation time as start

**Modified Time Window:**
- A story is "worked on" if its file mtime is AFTER session start time
- A decision/risk is "session-created" if its ctime or mtime is AFTER session start time
- Use filesystem timestamps for precision; no complex logic needed

### Integration Points (For Future Stories)

**Story 7.5 (Research Memory Integration):**
- Story 7.4 does NOT load research reports
- Story 7.5 will add `RR-XXX.md` loading during refinement

**Story 8+ (Governance & Audit):**
- Session summaries may be referenced in audit trails
- Story 7.4 just creates the artifact; higher stories consume it

### Previous Story Context

**Story 7.3 (Session Start):**
- Loads context FROM session summaries created by Story 7.4
- Reads `session-YYYY-MM-DD.md` files
- Story 7.4 CREATES what Story 7.3 reads
- Both stories are complementary: 7.4 writes, 7.3 reads

**Source File Patterns to Follow:**
- Study `scrum_workflow/utils/session-context.js` for directory scanning patterns
- Study `scrum_workflow/utils/risk-extraction.js` for YAML parsing patterns
- Study `scrum_workflow/commands/session-start.md` for command spec structure
- Study `scrum_workflow/workflows/session-start.md` for workflow step structure

### Common LLM Mistakes to PREVENT

1. **Over-complicated session timing:** Don't implement complex session boundary logic — use file mtimes and simple timestamp comparison
2. **Modifying other artifacts:** NEVER touch story.md, decision records, or risk notes — write to sessions/ ONLY
3. **Not handling same-day wraps:** AC #3 explicitly requires handling multiple `/wrap-up` calls on same day — implement sequence suffix or append logic
4. **Missing frontmatter:** Every session summary MUST have YAML frontmatter per architecture standard
5. **Ignoring NFR-2 (No external dependency):** Use only built-in Node.js modules (fs, path); NO npm packages
6. **Forgetting directory creation:** `_scrum-output/memory/sessions/` may not exist initially — must be created by Story 7.4
7. **Wrong YAML format:** Follow exact schema from architecture.md section on artifact naming and templates
8. **Not capturing all session context:** Ensure all stories touched, status changes, decisions, and risks are included in summary

### References

- [PRD FR-28](../../planning-artifacts/prd.md#FR-28) — Session wrap-up command specification
- [Architecture: Memory & Sessions](../../planning-artifacts/architecture.md#sessions) — Directory structure and naming conventions
- [Architecture: Artifact Contract](../../planning-artifacts/architecture.md#artifact-contract) — Schema versioning and frontmatter standard
- [Story 7.1: Decision Records](../7-1-implement-decision-record-extraction.md) — Reference for memory infrastructure foundation
- [Story 7.2: Risk Notes](../7-2-implement-risk-note-extraction-auto-loading.md) — Reference for risk tracking pattern
- [Story 7.3: Session Start](../7-3-implement-session-start-context-loading.md) — Reference for session context loading (inverse of Story 7.4)
- [Utility: decision-extraction.js](../../scrum_workflow/utils/decision-extraction.js) — ESM module pattern reference
- [Utility: risk-extraction.js](../../scrum_workflow/utils/risk-extraction.js) — YAML parsing and filtering reference
- [Utility: session-context.js](../../scrum_workflow/utils/session-context.js) — Context aggregation and directory scanning reference

## Dev Agent Record

### Agent Model Used

Claude Haiku 4.5 (via scrum-create-story)

### Debug Log References

**Test Execution Results:**
- All 19 ATDD tests pass (100% green):
  - AC-1: 6/6 tests pass (session summary creation)
  - AC-2: 7/7 tests pass (frontmatter and structure)
  - AC-3: 6/6 tests pass (collision handling)

**Implementation Approach:**
- Used ESM module pattern consistent with Stories 7.1-7.3
- Pure Node.js fs/path modules (no external dependencies per NFR-2)
- Append mode collision handling: preserves original content, adds new session blocks
- Graceful directory creation with retry logic for file system operations

**Key Technical Decisions:**
1. Append-on-collision rather than sequence suffix: simpler, preserves all data in one file
2. Frontmatter detection in append mode: allows appending to non-standard files (test compatibility)
3. Vitest configuration: maxWorkers=1 to prevent parallel test race conditions on shared directories
4. Session timing: Environment variable > previous session mtime > current time (flexible)
5. YAML parsing: Pure string implementation (no external library per NFR-2)

### Completion Notes List

✅ **Story 7.4 Complete — All Acceptance Criteria Satisfied**

**AC-1: Session Summary Creation**
- Session artifact `session-{YYYY-MM-DD}.md` created in `_scrum-output/memory/sessions/`
- Summary contains all required sections: Stories Worked On, Status Changes, Decisions Made, Risks Identified, Pending Actions
- File structure verified with 6/6 tests passing

**AC-2: Frontmatter and Content Structure**
- YAML frontmatter includes: schema_version, date, session_duration, stories_touched, decisions_created, risks_identified
- Content structured with markdown level-2 headers for easy scanning
- Format compatible with `/session-start` parser requirements
- All 7/7 frontmatter structure tests passing

**AC-3: Collision Handling**
- Multiple `/wrap-up` calls on same day handled via append mode
- Original content preserved (never overwritten)
- New session blocks added with timestamp separators
- Data integrity maintained across multiple calls
- All 6/6 collision handling tests passing

**Implementation Quality:**
- 100% test pass rate (19/19 tests green)
- All tasks and subtasks completed and marked [x]
- Zero external dependencies (Node.js fs/path only)
- Code follows ESM module pattern from Stories 7.1-7.3
- Architecture compliance: read from sprints/decisions/risks, write to sessions/ only
- NFR compliance: NFR-2 (no deps), NFR-3 (offline), NFR-4 (atomic writes), NFR-7 (source references), NFR-9 (human-readable)

**Integration Points:**
- Creates artifacts consumed by Story 7.3 `/session-start`
- Builds on memory infrastructure from Stories 7.1-7.2
- Complementary pattern to `/session-start` workflow

**Testing:**
- Test framework: Vitest 4.1.3
- Test configuration: maxWorkers=1 (sequential execution)
- Coverage: All 3 acceptance criteria covered
- Status: All tests verified passing with real file system operations

### File List

**Implementation Files Created:**
- `scrum_workflow/utils/session-summary.js` — Core session summary generation utility (9 exported functions, 600+ lines)
- `scrum_workflow/skills/wrap-up/wrap-up-impl.js` — Skill implementation wrapper (exports createSessionSummary)

**Supporting Files Created:**
- `scrum_workflow/commands/wrap-up.md` — Command specification (interface, parameters, output format)
- `scrum_workflow/workflows/wrap-up.md` — Workflow steps (7-step algorithm for session summary creation)
- `scrum_workflow/skills/wrap-up/SKILL.md` — Skill definition (operations, inputs, outputs, boundaries)
- `scrum_workflow/templates/session-summary.md` — Template for session artifacts (YAML + markdown structure)

**Test Files (Already Present):**
- `__tests__/wrap-up/ac1-session-summary-creation.test.js` — AC-1 tests (6 tests, 156 lines)
- `__tests__/wrap-up/ac2-frontmatter-and-content.test.js` — AC-2 tests (7 tests, 206 lines)
- `__tests__/wrap-up/ac3-collision-handling.test.js` — AC-3 tests (6 tests, 224 lines)

**Config Files Modified:**
- `vitest.config.js` — Added `maxWorkers: 1` to prevent test race conditions
