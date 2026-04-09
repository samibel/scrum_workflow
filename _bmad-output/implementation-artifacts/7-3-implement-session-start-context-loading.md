# Story 7.3: Implement Session Start & Context Loading

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `/session-start` to load my previous session context including open work, decisions, and risks,
So that I can resume exactly where I left off without context loss.

## Acceptance Criteria

1. **Given** FR-27 specifies `/session-start` loads open work units, last decisions, active risks, and next steps **When** a developer runs `/session-start` **Then** the system loads and presents: open stories with current status and pending actions, recent decision records (from `_scrum-output/memory/decisions/`), active risk notes (from `_scrum-output/memory/risks/`), and suggested next steps based on story statuses

2. **Given** SC-14 specifies "exactly where I left off" in under 60 seconds **When** session context is loaded **Then** the developer can identify the next action within the presented summary **And** no prior session knowledge is required

3. **Given** SC-13 specifies retrieval performance with 100+ artifacts **When** session start searches for context across a large `_scrum-output/` directory **Then** the search completes in under 10 seconds

## Tasks / Subtasks

- [ ] Task 1: Create `session-start` command specification (AC: #1, #2)
  - [ ] 1.1 Create `scrum_workflow/commands/session-start.md` defining the `/session-start` command interface, parameters, and expected output format
  - [ ] 1.2 Define command output structure: sections for Open Work, Recent Decisions, Active Risks, and Next Steps
  - [ ] 1.3 Specify performance constraint: context load must complete in under 10 seconds (SC-13) and summary presented in under 60 seconds (SC-14)

- [ ] Task 2: Create `session-start` workflow (AC: #1, #2, #3)
  - [ ] 2.1 Create `scrum_workflow/workflows/session-start.md` with step-by-step context loading algorithm
  - [ ] 2.2 Step 1 — Load Open Stories: scan `_scrum-output/sprints/` for all `SW-XXX/story.md` files with status NOT `done` or `cancelled`; extract: ticket ID, status, title, last action
  - [ ] 2.3 Step 2 — Load Recent Decisions: scan `_scrum-output/memory/decisions/` for the 5 most recent `DR-XXX.md` files (by DR number, highest first); extract: DR number, decision_summary, ticket, date
  - [ ] 2.4 Step 3 — Load Active Risk Notes: scan `_scrum-output/memory/risks/` for all `RN-XXX.md` files where `status: active`; extract: RN number, risk_description, severity, affected_area, ticket
  - [ ] 2.5 Step 4 — Derive Next Steps: generate next-action suggestions based on open story statuses (see next-step derivation logic in Dev Notes)
  - [ ] 2.6 Step 5 — Present Summary: render the session context in structured output format (see output template in Dev Notes)

- [ ] Task 3: Create `session-start` skill (AC: #1, #3)
  - [ ] 3.1 Create `scrum_workflow/skills/session-start/SKILL.md` defining the context aggregation logic
  - [ ] 3.2 Implement open work scanning: directory listing of `_scrum-output/sprints/` — NEVER recursive glob of entire output tree (SC-13 performance constraint)
  - [ ] 3.3 Implement YAML frontmatter parsing for story.md, DR-XXX.md, and RN-XXX.md files — pure string parsing, NO external YAML library (NFR-2)
  - [ ] 3.4 Implement active-only filtering for risk notes: check `status` field in frontmatter — `active` included, `resolved` excluded
  - [ ] 3.5 Implement recency sort for decision records: parse DR number from filename, sort descending, take top 5

- [ ] Task 4: Create `session-context.js` utility (AC: #1, #2, #3)
  - [ ] 4.1 Create `scrum_workflow/utils/session-context.js` implementing the context aggregation logic following the same ESM module pattern as `decision-extraction.js` and `risk-extraction.js`
  - [ ] 4.2 Export `scanOpenStories(sprintsDir)` — scans `_scrum-output/sprints/` for non-terminal story files; returns array of `{ ticket, status, title }`
  - [ ] 4.3 Export `loadRecentDecisions(decisionsDir, limit = 5)` — scans decisions dir, returns most recent N DR records; returns array of `{ drNumber, decisionSummary, ticket, date }`
  - [ ] 4.4 Export `loadActiveRisks(risksDir)` — reuses pattern from `risk-extraction.js` `filterActiveRiskNotes()`; returns array of `{ rnNumber, riskDescription, severity, affectedArea, ticket }`
  - [ ] 4.5 Export `deriveNextSteps(openStories)` — maps story status to actionable suggestions (see status-to-action mapping in Dev Notes)
  - [ ] 4.6 Export `formatSessionSummary(openStories, recentDecisions, activeRisks, nextSteps)` — renders the structured session output
  - [ ] 4.7 Export `parseFrontmatter(content)` — pure string YAML frontmatter parser (mirrors approach in `risk-extraction.js` `parseRNFrontmatter()`)

- [ ] Task 5: Write ATDD tests (AC: #1, #2, #3)
  - [ ] 5.1 Create `scrum_workflow/__tests__/session-start/ac1-context-loading.test.js` — tests that open stories, decisions, and risks are correctly loaded and aggregated
  - [ ] 5.2 Create `scrum_workflow/__tests__/session-start/ac2-session-summary-format.test.js` — tests that summary output contains all required sections and developer can identify next action
  - [ ] 5.3 Create `scrum_workflow/__tests__/session-start/ac3-retrieval-performance.test.js` — tests with 100+ mock artifacts that scan completes within time budget

## Dev Notes

### Critical Context: What Story 7.3 Implements

This is the THIRD story in Epic 7 (Session Memory & Decision Persistence). Story 7.1 established the memory infrastructure and decision records. Story 7.2 added risk note extraction and auto-loading. Story 7.3 implements the developer-facing session resume command `/session-start`.

**Epic 7 goal:** Developer resumes work across sessions. Decisions, risks, and context persist as standalone artifacts.

**What Stories 7.1 and 7.2 built (already done — DO NOT re-implement):**

Story 7.1 established:
- `_scrum-output/memory/` base directory
- `_scrum-output/memory/decisions/` subdirectory with `README.md`
- `scrum_workflow/skills/decision-extraction/SKILL.md`
- `scrum_workflow/utils/decision-extraction.js` — use as ESM module pattern reference
- `scrum_workflow/templates/decision-record.md` — DR-XXX.md artifact format
- Integration into `scrum_workflow/workflows/refinement.md` at Step 10.6

Story 7.2 established:
- `_scrum-output/memory/risks/` subdirectory with `README.md`
- `scrum_workflow/skills/risk-extraction/SKILL.md`
- `scrum_workflow/utils/risk-extraction.js` — use `filterActiveRiskNotes()` and `parseRNFrontmatter()` as reference
- `scrum_workflow/templates/risk-note.md`
- Integration into `scrum_workflow/workflows/refinement.md` (Step 10.7)
- Integration into `scrum_workflow/workflows/review-story.md` (Step 1.4a)

**What this story adds:**
- `scrum_workflow/commands/session-start.md` — command spec
- `scrum_workflow/workflows/session-start.md` — workflow steps
- `scrum_workflow/skills/session-start/SKILL.md` — context aggregation skill
- `scrum_workflow/utils/session-context.js` — JS implementation module
- `scrum_workflow/__tests__/session-start/` — ATDD test suite (3 files)

**What this story does NOT implement** (deferred to later stories in Epic 7):
- Session wrap-up command (Story 7.4 — `/wrap-up` creates `session-YYYY-MM-DD.md`)
- Research memory integration (Story 7.5 — auto-loading Research Reports)
- Loading of previous session summaries from `_scrum-output/memory/sessions/` (Story 7.4 creates these; Story 7.3 only loads decisions and risks from Story 7.1/7.2 artifacts)

### Architecture Compliance

**Command Tier (from PRD):**
- `/session-start` is a Session-level command (no ticket argument) — tier: `/{verb}` pattern
- NOT a story-level command — NEVER requires `SW-XXX` argument
- PRD table: `/session-start` → "Loads context" → "(no artifact created)"
- **CRITICAL:** `/session-start` does NOT write any new artifact — it is READ-ONLY across all directories

**Output Directory Structure (from architecture.md):**
```
_scrum-output/
├── sprints/
│   └── SW-XXX/
│       └── story.md        ← READ: scan for open stories
├── memory/
│   ├── decisions/
│   │   └── DR-XXX.md       ← READ: load recent 5
│   ├── sessions/           ← (created by Story 7.4, not yet exists)
│   ├── risks/
│   │   └── RN-XXX.md       ← READ: load active only
│   └── research/           ← (created by Story 7.5, ignore)
```

**Framework Directory Structure (from architecture.md):**
- Skills: `scrum_workflow/skills/{skill-name}/SKILL.md` (subdirectory + UPPERCASE)
- Utilities: `scrum_workflow/utils/`
- Workflows: `scrum_workflow/workflows/{name}.md` (flat)
- Commands: `scrum_workflow/commands/{name}.md` (flat)

**Write Boundary Rules (CRITICAL — Story 7.3 is READ-ONLY):**
- `/session-start` command: MAY ONLY read from `_scrum-output/`; MUST NOT write any files
- `session-start` skill: READ-ONLY — never creates files, never modifies story.md or any artifact
- `session-context.js` utility: MUST NOT import `writeFileSync` or `mkdirSync` — READ-ONLY module
- Violating this boundary would cause "Bounded Authority Violation" per architecture.md Pattern 4

**YAML Frontmatter Standard (from architecture.md):**
```yaml
---
schema_version: 1.0.0
ticket: SW-XXX
status: draft
created: 2026-04-09T00:00:00Z
updated: 2026-04-09T00:00:00Z
---
```

**Timestamp format:** ISO 8601 UTC — `2026-04-09T12:00:00Z`

**Actor Identity — N/A for this story:** Session-start is read-only and creates no `status_history` entries. No actor field needed.

### Technical Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| Framework | Markdown-as-Code | No database, no external deps (NFR-2, NFR-3) |
| Command spec | commands/session-start.md | Flat file, session-level tier |
| Workflow | workflows/session-start.md | Flat file |
| Skill file | skills/session-start/SKILL.md | Subdirectory + UPPERCASE |
| Utility | JavaScript ESM | `session-context.js` — mirrors `risk-extraction.js` module pattern |
| YAML parsing | Pure string parsing | `parseFrontmatter()` — no external YAML library (NFR-2) |
| File scanning | `readdirSync` + filename filtering | No recursive glob (SC-13 performance) |
| Test framework | Vitest | `scrum_workflow/__tests__/session-start/` directory |
| Node imports | `node:fs`, `node:path` | ESM — `import { readFileSync, readdirSync, existsSync } from 'node:fs'` |

### File Structure

```
scrum_workflow/
  commands/
    session-start.md                                ← CREATE: /session-start command spec

  workflows/
    session-start.md                                ← CREATE: step-by-step workflow

  skills/
    session-start/
      SKILL.md                                      ← CREATE: context aggregation skill

  utils/
    session-context.js                              ← CREATE: JS implementation module

  __tests__/
    session-start/
      ac1-context-loading.test.js                   ← CREATE: ATDD test
      ac2-session-summary-format.test.js            ← CREATE: ATDD test
      ac3-retrieval-performance.test.js             ← CREATE: ATDD test

_scrum-output/
  memory/
    decisions/                                      ← READ ONLY (exists from Story 7.1)
    risks/                                          ← READ ONLY (exists from Story 7.2)
```

**DO NOT modify:**
- `scrum_workflow/utils/decision-extraction.js` — stable, use as reference only
- `scrum_workflow/utils/risk-extraction.js` — stable, reuse `parseRNFrontmatter()` pattern
- `scrum_workflow/skills/decision-extraction/` — stable, do not touch
- `scrum_workflow/skills/risk-extraction/` — stable, do not touch
- `scrum_workflow/workflows/refinement.md` — stable (modified by 7.1 and 7.2)
- `scrum_workflow/workflows/review-story.md` — stable (modified by 7.2)
- Any existing `_scrum-output/memory/decisions/` files
- Any existing `_scrum-output/memory/risks/` files
- Any existing `_scrum-output/sprints/` files
- Any existing story files in `_bmad-output/implementation-artifacts/`
- `create-scrum-workflow/` — CLI installer is NOT modified by this story

### session-context.js Module Design

**Module exports (ESM pattern — mirrors risk-extraction.js):**

```javascript
// READ-ONLY — no writeFileSync, no mkdirSync

export function parseFrontmatter(content)
// Parses YAML frontmatter block (between --- delimiters)
// Returns object with key-value pairs
// Pure string implementation — no external YAML library (NFR-2)
// Mirror of parseRNFrontmatter() from risk-extraction.js

export function scanOpenStories(sprintsDir)
// Scans _scrum-output/sprints/ for story.md files with non-terminal status
// Terminal statuses: 'done', 'cancelled'
// Returns: [{ ticket: 'SW-001', status: 'in-progress', title: '...' }, ...]
// Uses readdirSync on sprintsDir — NOT recursive glob (SC-13 performance)

export function loadRecentDecisions(decisionsDir, limit = 5)
// Scans decisionsDir for DR-[0-9][0-9][0-9].md files
// Sorts by DR number descending, takes first `limit` files
// Reads each file, parses frontmatter
// Returns: [{ drNumber: 'DR-005', decisionSummary: '...', ticket: 'SW-010', date: '...' }, ...]

export function loadActiveRisks(risksDir)
// Scans risksDir for RN-[0-9][0-9][0-9].md files
// Reads frontmatter — includes ONLY files where status === 'active'
// Returns: [{ rnNumber: 'RN-001', riskDescription: '...', severity: '...', affectedArea: '...', ticket: '...' }, ...]

export function deriveNextSteps(openStories)
// Maps story status to actionable next-step suggestions
// Returns: string[] of next-step messages
// See status-to-action mapping below

export function formatSessionSummary(openStories, recentDecisions, activeRisks, nextSteps)
// Renders structured session summary as a string
// Returns: formatted multi-section string ready for display
```

**Status-to-action mapping for `deriveNextSteps()`:**

| Story Status | Next Step Suggestion |
|--------------|---------------------|
| `draft` | "Refine ticket {ticket} → run `/scrum-refine-ticket {ticket}`" |
| `refined` | "Validate story {ticket} → run `/scrum-refine-story {ticket}`" |
| `ready-for-dev` | "Implement story {ticket} → run `/scrum-dev-story {ticket}`" |
| `in-progress` | "Continue implementation of {ticket} → run `/scrum-dev-story {ticket}`" |
| `review` | "Review story {ticket} → run `/scrum-review-story {ticket}`" |
| `changes-needed` | "Apply review feedback to {ticket} → review `_scrum-output/sprints/{ticket}/review-N.md`" |
| `approved` | "Story {ticket} approved — run `/scrum-dev-story {ticket}` to complete implementation" |

**`formatSessionSummary()` output template:**

```
## Session Context — {ISO_DATE}

### Open Work ({count} stories)

{For each open story:}
- **{ticket}** [{status}] — {title}

### Recent Decisions (last {count})

{For each decision:}
- **{drNumber}**: {decisionSummary} (ticket: {ticket}, date: {date})

### Active Risk Notes ({count} active)

{For each active risk:}
- **{rnNumber}** [{severity}]: {riskDescription} — Affected: {affectedArea} (ticket: {ticket})

### Suggested Next Steps

{For each next step:}
{index}. {nextStep}

---
Context loaded. Developer can resume immediately.
```

### YAML Frontmatter Parsing (Critical — NFR-2)

`parseFrontmatter()` must be a pure string implementation — NO external YAML library. Mirror the `parseRNFrontmatter()` approach from `risk-extraction.js`:

1. Find opening `---` delimiter on line 1
2. Find closing `---` delimiter
3. Extract lines between delimiters
4. For each line: split on first `:` to get key/value
5. Trim whitespace from key and value
6. Strip surrounding quotes from values (single or double)
7. Return `{}` if no frontmatter found (not an error)

**Known edge cases from Story 7.1/7.2 review:**
- Multi-line values: handle `context: "line1\nline2"` by collapsing to single string
- Array values (like `domain_tags:`): for session-context.js, only scalar fields are needed (status, title, ticket, decision_summary, risk_description, severity, affected_area, date) — skip array parsing

### Performance Requirements (SC-13, SC-14)

**SC-13: Retrieval with 100+ artifacts completes in under 10 seconds**
- Use `readdirSync` NOT `glob()` — no recursive filesystem traversal
- Scan only specific subdirectories: `_scrum-output/sprints/`, `_scrum-output/memory/decisions/`, `_scrum-output/memory/risks/`
- Read only files matching exact patterns: `story.md`, `DR-[0-9][0-9][0-9].md`, `RN-[0-9][0-9][0-9].md`
- For decisions: read only top 5 by number — do NOT read all DR files
- Do NOT scan `_scrum-output/memory/sessions/` or `_scrum-output/memory/research/` — these are out of scope for Story 7.3

**SC-14: Developer can identify next action within presented summary, in under 60 seconds**
- `/session-start` is a simple command — NO multi-agent refinement pipeline
- Target: respond within 30 seconds (NFR-6 simple command budget)
- All context loading is synchronous file reads — no async complexity needed

**AC3 test approach:** Create 100+ mock artifact files in `_test-output/` using `beforeEach`, run `scanOpenStories()`, `loadRecentDecisions()`, and `loadActiveRisks()` with performance timing — assert completion within 5000ms (2x safety margin over 10s requirement since test env may be slower).

### Error Handling Patterns (from architecture.md)

```
❌ {Error Type}: {Brief description}

**Details:** {More context about what went wrong}

**Next Step:** {Actionable guidance for resolution}
```

**Graceful degradation (NO hard errors for missing directories):**
- If `_scrum-output/sprints/` does not exist → return empty open stories list (no error)
- If `_scrum-output/memory/decisions/` does not exist → return empty decisions list (no error)
- If `_scrum-output/memory/risks/` does not exist → return empty risks list (no error)
- If a story.md file has no readable frontmatter → skip it (log warning, continue)
- If a DR or RN file has no readable frontmatter → skip it (log warning, continue)

**Why graceful degradation:** `/session-start` is designed for first-time use too. Empty state is valid. Never block the user with errors when artifacts simply don't exist yet.

### NFR Compliance Requirements

- **NFR-2 (No external dependency):** `session-context.js` must use ONLY `node:fs` and `node:path` — no `js-yaml`, no `gray-matter`, no new npm packages
- **NFR-3 (Offline capability):** All context loading is local file reads — no network calls
- **NFR-4 (Atomic file operations):** N/A — this story is READ-ONLY; no writes occur
- **NFR-7 (Artifact Traceability):** Each loaded artifact is presented with its source file reference
- **NFR-9 (Inspectability):** Session summary is human-readable terminal output — no binary formats

### Previous Story Intelligence (Stories 7.1 and 7.2)

**Carry forward from Story 7.1/7.2:**
- ESM imports throughout (`import ... from '...'`)
- Test files: `*.test.js` pattern in `__tests__/{feature}/` subdirectories
- ATDD test naming: `ac{N}-{description}.test.js`
- Module pattern: single responsibility, thin wrappers, pure functions
- `vitest.config.js` already has `singleFork: true` — do NOT change this
- All file reads use `readFileSync` (not async) — consistent with existing utilities
- `existsSync` guard before `readdirSync` — prevents crashes if directory missing

**Story 7.1 lessons (carry forward):**
- YAML injection: use `escapeYaml()` pattern — BUT for 7.3, we are READ-ONLY, so this only applies in formatted output if interpolating user data
- `path.dirname()` over string splitting — cross-platform path handling
- Use `join()` for all path construction

**Story 7.2 lessons (carry forward):**
- Empty domain_tag false-positive: when matching, always filter empty/whitespace strings before comparing
- Unused parameter bug: never add parameters that aren't used in the function body
- `writeRNWithBoundaryCheck` pattern: Story 7.3 does NOT need a write boundary check (read-only), but if any utility function is tempted to write, add explicit prohibition

**Story 7.2 completion note — reuse `parseRNFrontmatter()` pattern:**
Story 7.2's `parseRNFrontmatter()` in `risk-extraction.js` is a pure string parser that handles the YAML frontmatter format. Story 7.3's `parseFrontmatter()` should follow the exact same approach — this avoids introducing a new YAML dependency and maintains NFR-2 compliance.

### Git Intelligence

Recent commits (most relevant to Story 7.3):
- `fix(story-7.2): apply code review patches — empty domain tag false positive and unused param`
- `feat(story-7.2): Implement Risk Note Extraction & Auto-Loading`
- `feat(story-7.1): Implement Decision Record Extraction`
- `fix(story-7.1): apply code review patches — YAML safety, cross-platform path fix`

Story 7.3 continues the same framework-only pattern: all work in `scrum_workflow/` framework files. No `create-scrum-workflow/` CLI installer changes needed.

### Key Path Distinction

- `scrum_workflow/` — the framework itself (Markdown specs for commands, workflows, skills, agents, templates, and JS utilities)
- `create-scrum-workflow/` — the CLI Node.js package that installs the framework — **NEVER touch this for Story 7.3**
- `_scrum-output/` — runtime output directory (inside `scrum_workflow/`) — **READ-ONLY for Story 7.3**
- `_bmad-output/` — BMAD planning artifacts — separate from implementation

### Story 7.3 Touches EXACTLY These Files

**New files to create:**
1. `scrum_workflow/commands/session-start.md` (NEW — command spec)
2. `scrum_workflow/workflows/session-start.md` (NEW — workflow steps)
3. `scrum_workflow/skills/session-start/SKILL.md` (NEW — skill spec)
4. `scrum_workflow/utils/session-context.js` (NEW — JS utility)
5. `scrum_workflow/__tests__/session-start/ac1-context-loading.test.js` (NEW — ATDD)
6. `scrum_workflow/__tests__/session-start/ac2-session-summary-format.test.js` (NEW — ATDD)
7. `scrum_workflow/__tests__/session-start/ac3-retrieval-performance.test.js` (NEW — ATDD)

**No existing files are modified** — Story 7.3 is entirely additive. All Memory infrastructure from Stories 7.1 and 7.2 is consumed read-only.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.3]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 7: Session Memory & Decision Persistence]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-27]
- [Source: _bmad-output/planning-artifacts/prd.md#SC-13]
- [Source: _bmad-output/planning-artifacts/prd.md#SC-14]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR-2, NFR-3, NFR-6]
- [Source: _bmad-output/planning-artifacts/architecture.md#Write Boundary Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns]
- [Source: _bmad-output/implementation-artifacts/7-1-implement-decision-record-extraction.md]
- [Source: _bmad-output/implementation-artifacts/7-2-implement-risk-note-extraction-auto-loading.md]
- [Source: scrum_workflow/utils/risk-extraction.js — mirror parseRNFrontmatter() and filterActiveRiskNotes()]
- [Source: scrum_workflow/utils/decision-extraction.js — ESM module pattern reference]
- [Source: scrum_workflow/skills/risk-extraction/SKILL.md — skill spec format reference]
- [Source: scrum_workflow/templates/risk-note.md — RN artifact format for reading]
- [Source: scrum_workflow/templates/decision-record.md — DR artifact format for reading]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None

### Completion Notes List

_To be filled in by dev agent after implementation_

### File List

_To be filled in by dev agent after implementation_

## Change Log

- 2026-04-09: Story 7.3 created — Implement Session Start & Context Loading (claude-sonnet-4-6)
