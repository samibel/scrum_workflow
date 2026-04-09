# Story 7.2: Implement Risk Note Extraction & Auto-Loading

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want risk notes to be automatically extracted from Architect agent perspectives and loaded during reviews,
So that identified risks are tracked and inform quality checks.

## Acceptance Criteria

1. **Given** FR-29 specifies risk notes extracted from Architect agent perspectives **When** the Architect agent produces a perspective during `/scrum-refine-ticket` **Then** identified risks are extracted as standalone `RN-XXX.md` artifacts in `_scrum-output/memory/risks/` **And** each risk note contains: risk description, severity, affected area, mitigation suggestion, source ticket

2. **Given** FR-30 specifies auto-loading of active risk notes during `/scrum-review-story` **When** a developer runs `/scrum-review-story SW-XXX` **Then** the review agent receives active risk notes relevant to the story's domain as additional context **And** relevance is determined by matching domain tags and affected areas

3. **Given** risk notes accumulate over time **When** risk notes are loaded **Then** only active (unresolved) risk notes are included **And** resolved risks are not loaded as context

## Tasks / Subtasks

- [ ] Task 1: Create `_scrum-output/memory/risks/` directory structure (AC: #1)
  - [ ] 1.1 Create the memory directory `_scrum-output/memory/risks/` (Story 7.1 created `_scrum-output/memory/`, this story adds the `risks/` subdirectory)
  - [ ] 1.2 Add `README.md` to `_scrum-output/memory/risks/` documenting the RN artifact format, numbering convention, and status lifecycle
  - [ ] 1.3 Create `scrum_workflow/templates/risk-note.md` as the canonical template for `RN-XXX.md` artifacts

- [ ] Task 2: Implement risk extraction skill (AC: #1)
  - [ ] 2.1 Create `scrum_workflow/skills/risk-extraction/SKILL.md` defining the risk extraction logic
  - [ ] 2.2 Implement risk detection: identify risk signals from Architect agent perspective content in `refinement.md`
  - [ ] 2.3 Implement sequential RN numbering: scan `_scrum-output/memory/risks/` for existing RN-XXX.md files, derive next number (zero-padded 3-digit)
  - [ ] 2.4 Implement `RN-XXX.md` artifact creation with required YAML frontmatter fields: `schema_version`, `ticket`, `risk_description`, `severity`, `affected_area`, `mitigation_suggestion`, `status`, `source_file`, `domain_tags`, `created`, `updated`
  - [ ] 2.5 Create `scrum_workflow/utils/risk-extraction.js` implementing extraction logic following same module pattern as `decision-extraction.js`

- [ ] Task 3: Integrate risk extraction into refinement workflow (AC: #1)
  - [ ] 3.1 Update `scrum_workflow/workflows/refinement.md` to invoke `risk-extraction` skill after synthesis (Step 10.6, alongside or after decision extraction)
  - [ ] 3.2 Risk extraction reads the Architect agent perspective from `refinement.md` and identifies any risks (look for risk tables, severity-classified findings, and recommendation sections from the Architect agent)
  - [ ] 3.3 For each detected risk, write a `RN-XXX.md` artifact to `_scrum-output/memory/risks/`
  - [ ] 3.4 Report extracted risk notes in the refinement completion summary

- [ ] Task 4: Implement auto-loading of active risk notes during review (AC: #2, #3)
  - [ ] 4.1 Update `scrum_workflow/workflows/review-story.md` Step 1.4 (Load Project Standards) to also load active risk notes
  - [ ] 4.2 Implement domain matching: scan `_scrum-output/memory/risks/` for RN files where `status: active` and `domain_tags` or `affected_area` matches the story domain
  - [ ] 4.3 Pass matched active risk notes as additional context to the review agent (append to context block after story.md and plan.md load)
  - [ ] 4.4 Filter out resolved risk notes (`status: resolved`) — NEVER load them as context

- [ ] Task 5: Write ATDD tests (AC: #1, #2, #3)
  - [ ] 5.1 Create `scrum_workflow/__tests__/risk-extraction/ac1-architect-risk-extraction.test.js`
  - [ ] 5.2 Create `scrum_workflow/__tests__/risk-extraction/ac2-review-risk-loading.test.js`
  - [ ] 5.3 Create `scrum_workflow/__tests__/risk-extraction/ac3-active-only-filtering.test.js`

## Dev Notes

### Critical Context: What Story 7.2 Implements

This is the SECOND story in Epic 7 (Session Memory & Decision Persistence). Story 7.1 established the memory infrastructure (`_scrum-output/memory/`) and the `decisions/` subdirectory. Story 7.2 adds the `risks/` subdirectory and implements the full risk note lifecycle.

**Epic 7 goal:** Developer resumes work across sessions. Decisions, risks, and context persist as standalone artifacts.

**What Story 7.1 built (already done — DO NOT re-implement):**
- `_scrum-output/memory/` base directory
- `_scrum-output/memory/decisions/` subdirectory with `README.md`
- `scrum_workflow/skills/decision-extraction/SKILL.md`
- `scrum_workflow/utils/decision-extraction.js` — use as implementation pattern
- `scrum_workflow/templates/decision-record.md` — use as template pattern
- Integration into `scrum_workflow/workflows/refinement.md` at Step 10.6

**What this story adds:**
- `_scrum-output/memory/risks/` subdirectory with `README.md`
- `scrum_workflow/skills/risk-extraction/SKILL.md`
- `scrum_workflow/utils/risk-extraction.js`
- `scrum_workflow/templates/risk-note.md`
- Integration into `scrum_workflow/workflows/refinement.md` (new step after 10.6)
- Integration into `scrum_workflow/workflows/review-story.md` (Step 1.4 extension)
- ATDD test suite under `scrum_workflow/__tests__/risk-extraction/`

**What this story does NOT implement** (deferred to later stories in Epic 7):
- Session start command (Story 7.3)
- Wrap-up command (Story 7.4)
- Research memory integration (Story 7.5)

### Architecture Compliance

**Artifact Naming (MUST follow exactly):**
- Risk notes: `RN-{NNN}` — 3-digit, zero-padded (RN-001, RN-002, ..., RN-099, RN-100)
- File location: `_scrum-output/memory/risks/RN-XXX.md` — NEVER in sprints/, NEVER in project root

**Output Directory Structure (from architecture.md):**
```
_scrum-output/
├── sprints/
│   └── SW-XXX/
│       ├── story.md
│       ├── refinement.md
│       ├── plan.md
│       ├── review-1.md
│       └── approval-1.md
└── memory/                  ← Created by Story 7.1
    ├── decisions/            ← Created by Story 7.1
    │   └── DR-XXX.md
    ├── sessions/             ← (created by Story 7.4)
    ├── risks/                ← THIS STORY creates this subtree
    │   └── RN-XXX.md
    └── research/             ← (created by Story 7.5)
```

**Framework Directory Structure (from architecture.md):**
- Skills use subdirectory pattern: `scrum_workflow/skills/{skill-name}/SKILL.md` (uppercase)
- Utilities live in: `scrum_workflow/utils/`
- Templates live in: `scrum_workflow/templates/`
- Workflows use flat pattern: `scrum_workflow/workflows/{name}.md`

**Write Boundary Rules (CRITICAL):**
- `risk-extraction` skill: MAY ONLY write to `_scrum-output/memory/risks/RN-XXX.md`
- Review workflow (risk loading): is READ-ONLY for risk notes (loads but never writes)
- MUST NOT modify `refinement.md`, `story.md`, `plan.md`, or any sprint artifact

**YAML Frontmatter Standard (from architecture.md):**
```yaml
---
schema_version: 1.0.0
ticket: SW-XXX
status: active
created: 2026-04-09T00:00:00Z
updated: 2026-04-09T00:00:00Z
---
```
For RN artifacts, use `status: active` on creation (not `draft` — risk notes have their own lifecycle: `active` → `resolved`).

**Actor Identity for status_history (architecture.md Pattern 5):**
- Skills use: `{name}-skill` pattern → actor: `risk-extraction-skill`

**Timestamp format:** ISO 8601 UTC — `2026-04-09T12:00:00Z`

### Technical Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| Framework | Markdown-as-Code | No database, no external deps (NFR-2, NFR-3) |
| Skill files | SKILL.md (uppercase) | In `skills/{name}/SKILL.md` subdirectory |
| Utilities | JavaScript ESM | `scrum_workflow/utils/risk-extraction.js` — mirror `decision-extraction.js` |
| Templates | Markdown with YAML frontmatter | `scrum_workflow/templates/risk-note.md` |
| Artifact output | Markdown files | `_scrum-output/memory/risks/` |
| Test framework | Vitest | `scrum_workflow/__tests__/risk-extraction/` directory |
| Numbering | Sequential scan of existing files | RN-001 to RN-999 |
| Domain matching | String-based tag matching | `domain_tags` array in frontmatter matched against story keywords |

### File Structure

```
scrum_workflow/
  skills/
    risk-extraction/
      SKILL.md                                    ← CREATE: risk extraction logic

  utils/
    risk-extraction.js                            ← CREATE: JS implementation module

  templates/
    risk-note.md                                  ← CREATE: RN-XXX.md template

  workflows/
    refinement.md                                 ← MODIFY: add risk extraction step after Step 10.6
    review-story.md                               ← MODIFY: add risk note loading in Step 1.4

  __tests__/
    risk-extraction/
      ac1-architect-risk-extraction.test.js       ← CREATE: ATDD test
      ac2-review-risk-loading.test.js             ← CREATE: ATDD test
      ac3-active-only-filtering.test.js           ← CREATE: ATDD test

_scrum-output/
  memory/
    risks/
      README.md                                   ← CREATE: documents RN naming convention
```

**DO NOT modify:**
- `scrum_workflow/skills/decision-extraction/` — stable, do not touch
- `scrum_workflow/utils/decision-extraction.js` — stable, use as reference only
- `scrum_workflow/commands/refine-ticket.md` — command spec is stable
- `scrum_workflow/commands/review-story.md` — command spec is stable (workflow handles integration)
- Any existing `_scrum-output/memory/decisions/` files
- Any existing `_scrum-output/sprints/` files
- Any source code in `create-scrum-workflow/` (this story is framework-only)
- `scrum_workflow/skills/status-guard-validation/` (stable)
- `scrum_workflow/skills/prerequisite-validation/` (stable)
- `scrum_workflow/skills/synthesis/` (stable)
- Any existing story files in `_bmad-output/implementation-artifacts/`

### Risk Extraction Logic (SKILL.md Implementation Guide)

**What the Architect agent produces (from `scrum_workflow/agents/architect.md`):**

The Architect agent outputs a `## Architect Perspective` section with:
- `### Findings` — a Markdown table with columns: `#`, `Finding`, `Severity`, `Category`
- `### Recommendations` — numbered list
- `### Proposed Acceptance Criteria` — checkbox list

**Risk signal extraction strategy:**
1. Parse the Architect agent's `### Findings` table in the stored `refinement.md`
2. Each row in the findings table IS a risk note candidate
3. Extract per row: finding text, severity (Critical/Major/Minor), category (maps to `affected_area`)
4. Also scan `### Recommendations` section for additional risk context (mitigation suggestions)
5. Severities to map: `Critical` → `critical`, `Major` → `major`, `Minor` → `minor`

**Determining domain tags:**
- Extract from the story ticket's domain area (e.g., auth, payments, API, storage)
- Parse the story title and finding category to infer domain tags
- Store as an array: `domain_tags: ["security", "authentication"]`

**Extraction Algorithm:**
1. Receive source artifact content (`refinement.md`) and ticket ID
2. Locate the `## Architect Perspective` section header
3. Parse `### Findings` table rows — each row is a risk note
4. For each row:
   a. Extract: finding text (risk description), severity, category (affected area)
   b. Find matching recommendation in `### Recommendations` (mitigation suggestion)
   c. Determine domain tags from category and story context
   d. Read `_scrum-output/memory/risks/` directory listing
   e. Find highest existing RN number (e.g., RN-003 → next is RN-004)
   f. If no RNs exist, start at RN-001
   g. Write `RN-{NNN}.md` with required YAML frontmatter + body
5. Return list of created RN files for reporting

**Sequential numbering (critical — mirrors DR numbering from Story 7.1):**
- Always scan `_scrum-output/memory/risks/` for files matching `RN-[0-9][0-9][0-9].md`
- Sort numerically, take highest, increment by 1
- Zero-pad to 3 digits: `RN-001`, `RN-042`, `RN-100`
- If multiple risks found in same refinement, create sequentially (not in parallel)
- Numbers are NEVER reused

**Active vs Resolved:**
- On creation: `status: active`
- Future resolution: `status: resolved` (done manually or by future Story 7.3/7.4 workflows)
- The `status` field is the ONLY filtering mechanism for loading active risks

### Risk Note Auto-Loading During Review

**Where to add in `workflows/review-story.md`:** Step 1.4 (Load Project Standards). After loading `context/standards.md`, add a new substep to load active risk notes.

**Domain matching algorithm (simple string matching — no external libraries):**
1. Collect story keywords: extract nouns from story title and AC text
2. Scan `_scrum-output/memory/risks/` for all `RN-[0-9][0-9][0-9].md` files
3. For each RN file:
   - Check `status` field in YAML frontmatter — if NOT `active`, skip
   - Check `domain_tags` array — if any tag appears in story keywords, include
   - Check `affected_area` field — if it appears in story keywords, include
4. Collect matched active RN files as additional review context

**Context injection into review agent:**
- Append matched risk notes after the standard context block
- Format: "Active Risk Notes (for domain context):" followed by RN content
- This gives the review agent risk awareness without changing the review workflow structure

**If no matching active risks exist:**
- Continue normally — risk loading is optional enrichment, not required
- Log: `No active risk notes matched story domain — proceeding without risk context`

### Risk Note Template

The canonical `scrum_workflow/templates/risk-note.md` should follow this structure (parallel to `decision-record.md`):

```markdown
---
schema_version: 1.0.0
ticket: "{{ticket_id}}"
risk_description: "{{one_line_risk_summary}}"
severity: "{{critical|major|minor}}"
affected_area: "{{category_from_architect_findings}}"
mitigation_suggestion: "{{recommendation_from_architect}}"
status: active
domain_tags:
  - "{{domain_tag_1}}"
  - "{{domain_tag_2}}"
source_file: "{{relative_path_to_refinement_md}}"
created: "{{iso8601_timestamp}}"
updated: "{{iso8601_timestamp}}"
---

# Risk Note: {{one_line_risk_summary}}

**Ticket:** {{ticket_id}}
**Severity:** {{critical|major|minor}}
**Status:** active
**Affected Area:** {{category_from_architect_findings}}
**Created:** {{iso8601_timestamp}}
**Source:** {{relative_path_to_refinement_md}}

## Risk Description

{{one_line_risk_summary}}

## Mitigation Suggestion

{{recommendation_from_architect}}

## Domain Tags

{{domain_tag_1}}, {{domain_tag_2}}
```

### Integration into Refinement Workflow

**Where to add in `workflows/refinement.md`:** After Step 10.6 (Decision Extraction / Phase 6a), add Step 10.7 (Risk Note Extraction / Phase 6b). This preserves the existing Step 10.6 unchanged.

```
## Step 10.7: Risk Note Extraction (Phase 6b)

After decision extraction completes (Step 10.6), invoke the risk-extraction skill to capture
Architect agent findings as persistent risk note artifacts.

### Step 10.7.1: Invoke Risk Extraction Skill

Invoke `scrum_workflow/skills/risk-extraction/SKILL.md` with:
- `source_file`: `_scrum-output/sprints/SW-XXX/refinement.md`
- `ticket`: SW-XXX

The skill locates the Architect Perspective section in refinement.md, parses the Findings table,
and creates RN-XXX.md artifacts in `_scrum-output/memory/risks/`.

### Step 10.7.2: Report Risk Extraction Results

Include extracted risks in the refinement completion summary:

If risks were found:
  "Extracted 3 risk notes: RN-001.md, RN-002.md, RN-003.md"

If no risks found:
  "No risks detected in Architect perspective"

Write boundary for this step:
- The risk-extraction skill may ONLY write to `_scrum-output/memory/risks/RN-XXX.md`
- It MUST NOT modify `refinement.md`, `story.md`, or any sprint artifact
```

### NFR Compliance Requirements

- **NFR-2 (No external dependency):** Risk extraction must be LLM-based text analysis — no external APIs, no new npm packages
- **NFR-3 (Offline capability):** All artifact writes are local file operations
- **NFR-4 (Atomic file operations):** Each `RN-XXX.md` is written as a single atomic operation; never partial writes
- **NFR-7 (Artifact Traceability):** Every RN-XXX.md must include `ticket` field linking back to source story
- **NFR-9 (Inspectability):** RN artifacts are human-readable Markdown with YAML frontmatter — no binary formats

### Error Handling Patterns (from architecture.md)

```
❌ Write Boundary Violation: risk-extraction-skill attempted to write '{file_path}'

**Details:** The risk-extraction skill may only write to _scrum-output/memory/risks/. Attempted write target is outside the allowed boundary.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```

If `_scrum-output/memory/risks/` directory does not exist during first extraction:
- Create it automatically (expected on first run)
- This is NOT an error condition

If no risks detected in Architect perspective:
- This is NOT an error
- Log: "No risks detected in Architect perspective" and continue
- Do not create any RN files

If Architect perspective section is absent from `refinement.md`:
- Log warning: "Architect Perspective section not found in refinement.md — skipping risk extraction"
- Continue without creating RN files (not a blocker)

### Previous Story Intelligence (Story 7.1)

**Story 7.1 patterns to carry forward exactly:**
- ESM imports throughout (`import ... from '...'`)
- Test files: `*.test.js` pattern in `__tests__/{feature}/` subdirectories
- ATDD test naming: `ac{N}-{description}.test.js`
- Module pattern: single responsibility, thin wrappers
- `vitest.config.js` already has `singleFork: true` — do NOT change this, it prevents race conditions in tests
- Template format: YAML frontmatter + Markdown body (mirroring `decision-record.md`)

**Story 7.1 utility structure to mirror in `risk-extraction.js`:**
- `getNextRNNumber(risksDir)` — mirrors `getNextDRNumber(decisionsDir)`
- `formatRNNumber(n)` — mirrors `formatDRNumber(n)` → zero-padded 3 digits
- `ensureRisksDirExists(risksDir)` — mirrors `ensureDecisionsDirExists(decisionsDir)`
- `detectRiskSignals(content)` — parses Architect Findings table (different from DR signal detection)
- `extractRisksFromRefinement(content, ticket, risksDir)` — mirrors `extractDecisionsFromRefinement`
- `createRNArtifact(risk, ticket, riskNum, sourceFile)` — mirrors `createDRArtifact`
- `writeRNWithBoundaryCheck(content, filePath, allowedDir)` — mirrors `writeDRWithBoundaryCheck`

**Critical lesson from Story 7.1 review:**
- YAML injection: use `escapeYaml()` helper for all interpolated YAML string values — multi-line values must collapse newlines to spaces
- `path.dirname()` over `lastIndexOf('/')` — cross-platform path handling
- Boundary check: use prohibited pattern matching (sprint paths, framework files) NOT just allowed path substring check

**Key learning from Story 7.1 completion notes:**
- The `scrum_workflow/` directory contains framework specs (Markdown), NOT executable code
- The `create-scrum-workflow/` directory contains the CLI installer (JavaScript)
- Story 7.2 touches ONLY `scrum_workflow/` framework files and `_scrum-output/memory/risks/` directory — NO `create-scrum-workflow/` changes needed

### Git Intelligence

Recent commits show Story 7.1 completing:
- `feat(story-7.1): Implement Decision Record Extraction` — established the memory pattern
- `fix(story-7.1): apply code review patches — YAML safety, cross-platform path fix` — critical fixes to carry forward
- `chore(story-7.1): add traceability matrix and quality gate decision` — traceability is important for Epic 7

Story 7.2 continues the same framework-only pattern (no CLI JavaScript changes). All work is in `scrum_workflow/` framework files.

### Project Structure Notes

**Key path distinction:**
- `scrum_workflow/` — the framework itself (Markdown specs for commands, workflows, skills, agents, templates)
- `create-scrum-workflow/` — the CLI Node.js package that installs the framework
- `_scrum-output/` — runtime output directory (inside `scrum_workflow/`)
- `_bmad-output/` — BMAD planning artifacts (separate from implementation)

**Story 7.2 only touches:**
1. `scrum_workflow/skills/risk-extraction/SKILL.md` (NEW)
2. `scrum_workflow/utils/risk-extraction.js` (NEW)
3. `scrum_workflow/templates/risk-note.md` (NEW)
4. `scrum_workflow/workflows/refinement.md` (MODIFY — add Step 10.7 after existing Step 10.6)
5. `scrum_workflow/workflows/review-story.md` (MODIFY — add risk loading in Step 1.4)
6. `scrum_workflow/_scrum-output/memory/risks/README.md` (NEW directory + file)
7. `scrum_workflow/__tests__/risk-extraction/` (NEW test files)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.2]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 7: Session Memory & Decision Persistence]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Write Boundary Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Actor Identity Patterns]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-29]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-30]
- [Source: _bmad-output/implementation-artifacts/7-1-implement-decision-record-extraction.md]
- [Source: scrum_workflow/skills/decision-extraction/SKILL.md — mirror pattern for risk-extraction]
- [Source: scrum_workflow/utils/decision-extraction.js — mirror implementation pattern]
- [Source: scrum_workflow/templates/decision-record.md — mirror template pattern]
- [Source: scrum_workflow/workflows/refinement.md#Step 10.6 — add Step 10.7 after]
- [Source: scrum_workflow/workflows/review-story.md#Step 1.4 — extend with risk loading]
- [Source: scrum_workflow/agents/architect.md — Architect output format defines extraction input]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List
