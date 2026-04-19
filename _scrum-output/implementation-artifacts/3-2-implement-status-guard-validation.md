# Story 3.2: Implement Status Guard Validation

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the system to block invalid state transitions with actionable error messages and detect manual status edits,
So that I am protected from mistakes and the state machine integrity is maintained.

## Acceptance Criteria

1. **Given** FR-8 specifies blocking invalid state transitions with actionable error messages **When** a developer runs a command that would cause an invalid transition (e.g., `/scrum-dev-story` on a `draft` story) **Then** the command is blocked before any file writes occur **And** the error message includes: current status, required status, and the next valid command to run **And** the error follows the Architecture error format: `❌ Status Guard Violation: {description}` with `**Details:**` and `**Next Step:**`

2. **Given** FR-10 specifies detection of manual status field edits **When** a guard validates a story's status **Then** it compares the `status` field against the last `status_history` entry **And** if a discrepancy is detected, a warning is surfaced indicating the status was manually edited **And** entries with `trigger: manual-edit` are visible to all agents and commands that read the story

3. **Given** FR-11 specifies no silent inconsistent state **When** any error occurs during status validation **Then** an actionable error message is produced with: what was attempted, what failed, and the suggested next step **And** no command leaves the story in an inconsistent state (status field and status_history always agree after command execution)

4. **Given** the 9-state lifecycle from Story 3.1 **When** the guard validates a transition **Then** it checks the requested transition against the authoritative valid transitions list in `scrum_workflow/context/standards.md` **And** only transitions explicitly defined as valid are permitted

## Tasks / Subtasks

- [x] Task 1: Implement Architecture-standard error format in status-guard-validation skill (AC: #1, #3)
  - [x] 1.1 Update `scrum_workflow/skills/status-guard-validation/SKILL.md` to use the standard error format: `❌ Status Guard Violation: {description}` with `**Details:**` and `**Next Step:**` sections for ALL guard failure cases
  - [x] 1.2 Update the `create-ticket` guard error to use the standard format
  - [x] 1.3 Update the `refine-ticket` guard error to use the standard format
  - [x] 1.4 Update the `refine-story` guard error to use the standard format
  - [x] 1.5 Update the `dev-story` guard error to use the standard format (must include both `ready-for-dev` and `changes-needed` as valid statuses per existing implementation)
  - [x] 1.6 Update the `review-story` guard error to use the standard format
  - [x] 1.7 Update the `approve` guard error to use the standard format

- [x] Task 2: Implement manual status edit detection (AC: #2, #3)
  - [x] 2.1 Add a "Manual Edit Detection" section to `scrum_workflow/skills/status-guard-validation/SKILL.md` that describes the detection algorithm: compare `status` field value against the `to` field of the last `status_history` entry
  - [x] 2.2 Define the discrepancy resolution: if `status` field != last `status_history[].to` → emit a warning in the format: `⚠️ Manual Edit Detected: status field ('X') does not match last status_history entry ('Y')`
  - [x] 2.3 Document that the guard should surface the warning AND still enforce the current `status` field value (not the history value) for command eligibility — because the user's manual edit is intentional
  - [x] 2.4 Document that manual edits do NOT add a `status_history` entry automatically — a `trigger: manual-edit` entry is optional and informational only (the system cannot enforce it without a write hook)

- [x] Task 3: Update Output Format to include manual-edit detection result (AC: #2, #3)
  - [x] 3.1 Extend the structured YAML output format of the skill to include a `manual_edit_detected` field and `warning` field:
    ```yaml
    valid: true/false
    current_status: "draft"
    required_status: "draft"
    can_proceed: true/false
    manual_edit_detected: false
    warning: null
    ```
  - [x] 3.2 When a discrepancy is detected, set `manual_edit_detected: true` and populate `warning` with the human-readable warning message

- [x] Task 4: Update all command files to use the Architecture-standard error format (AC: #1)
  - [x] 4.1 Update `scrum_workflow/commands/dev-story.md` to use the `❌ Status Guard Violation:` format in its Guard Condition Enforcement section
  - [x] 4.2 Update `scrum_workflow/commands/approve.md` to use the `❌ Status Guard Violation:` format in its Error Handling section (it already uses the prefix but verify format)
  - [x] 4.3 Update `scrum_workflow/commands/review-story.md` to use the `❌ Status Guard Violation:` format if not already present
  - [x] 4.4 Audit remaining command files (`refine-ticket.md`, `refine-story.md`, `create-ticket.md`) and update their error messages to use the standard format

- [x] Task 5: Write ATDD tests (RED phase) that validate all 4 ACs (AC: #1, #2, #3, #4)
  - [x] 5.1 Create `tests/unit/status-guard-validation/ac1-standard-error-format.spec.ts` — verify SKILL.md uses `❌ Status Guard Violation:` format for all 6 command guard failures, and that `**Details:**` and `**Next Step:**` are present
  - [x] 5.2 Create `tests/unit/status-guard-validation/ac2-manual-edit-detection.spec.ts` — verify SKILL.md documents the manual edit detection algorithm and the `manual_edit_detected` output field
  - [x] 5.3 Create `tests/unit/status-guard-validation/ac3-no-silent-failure.spec.ts` — verify SKILL.md states no silent failures and all errors produce actionable messages
  - [x] 5.4 Create `tests/unit/status-guard-validation/ac4-authoritative-transitions.spec.ts` — verify SKILL.md explicitly references `scrum_workflow/context/standards.md` for the authoritative transitions list

- [x] Task 6: Activate ATDD tests (GREEN phase) — confirm implementation is complete (AC: #1–#4)
  - [x] 6.1 Run all tests in `tests/unit/status-guard-validation/` and confirm they pass
  - [x] 6.2 If any test fails, fix the SKILL.md or command file (do NOT modify the test expectations)
  - [x] 6.3 Confirm tests pass for all 4 ACs

## Dev Notes

### Critical Context: What Story 3.2 Implements

This story upgrades the **existing** `status-guard-validation` skill to meet the Architecture-standard error format (FR-8), adds manual status edit detection (FR-10), and eliminates silent failures (FR-11). The skill already exists and has correct guard logic — this story adds:
1. Standardized error formatting across all 6 command guards
2. Manual edit detection algorithm (compare `status` vs. `status_history[-1].to`)
3. Explicit output field for manual edit flag (`manual_edit_detected`)

**This story is documentation/specification work only** — same paradigm as Story 3.1. No JavaScript runtime code changes. All changes are to Markdown specification files.

### Architecture-Standard Error Format (CRITICAL — from `_scrum-output/planning-artifacts/architecture.md` §7)

All error messages MUST use this exact format:
```
❌ {Error Type}: {Brief description}

**Details:** {More context about what went wrong}

**Next Step:** {Actionable guidance for resolution}
```

**Error Category for this story:** `Status Guard Violation`

**Example conforming error:**
```
❌ Status Guard Violation: Story SW-042 requires 'ready-for-dev' but is currently 'draft'

**Details:** The /scrum-dev-story command can only execute on stories in 'ready-for-dev' or 'changes-needed' status. This story is still in the drafting phase.

**Next Step:** Run '/scrum-refine-ticket SW-042' to begin refinement, then '/scrum-refine-story SW-042' to validate and promote to 'ready-for-dev'.
```

### File Structure (CRITICAL — from Story 3.1 Dev Notes)

```
scrum_workflow/
├── skills/
│   └── status-guard-validation/
│       └── SKILL.md           ← PRIMARY target — update error formats + add manual edit detection
├── commands/
│   ├── dev-story.md           ← Update Guard Condition Enforcement section error format
│   ├── approve.md             ← Verify/update error format (already partially compliant)
│   ├── review-story.md        ← Update error format
│   ├── refine-ticket.md       ← Update error format
│   ├── refine-story.md        ← Update error format
│   └── create-ticket.md       ← Update error format
└── context/
    └── standards.md           ← READ-ONLY — do NOT modify (authoritative source from Story 3.1)
```

**DO NOT modify:**
- `scrum_workflow/context/standards.md` — complete from Story 3.1, read-only for this story
- `scrum_workflow/docs/05-state-machine.md` — complete from Story 3.1, read-only for this story
- `scrum_workflow/utils/*.js` — no runtime changes (Markdown-as-Code paradigm)
- Test files once created (tests define the spec; if they fail, fix the SKILL.md, not the test)

### The 6 Guard Commands (Existing — must be updated to standard error format)

Current error format in SKILL.md is inconsistent (plain `Error:` prefix). Must replace all with `❌ Status Guard Violation:`:

| Command | Required Status | Current Error Prefix | Target |
|---------|----------------|----------------------|--------|
| `/scrum-create-ticket` | Story must NOT exist | `Error:` | `❌ Status Guard Violation:` |
| `/scrum-refine-ticket` | `draft` | `Error:` | `❌ Status Guard Violation:` |
| `/scrum-refine-story` | `refined` | `Error:` | `❌ Status Guard Violation:` |
| `/scrum-dev-story` | `ready-for-dev` OR `changes-needed` | `Error:` | `❌ Status Guard Violation:` |
| `/scrum-review-story` | `review` | `Error:` | `❌ Status Guard Violation:` |
| Approval (`/scrum-approve`) | `approved` | `Error:` | `❌ Status Guard Violation:` |

**Note:** The `/scrum-dev-story` guard must accept BOTH `ready-for-dev` AND `changes-needed` as valid statuses. This is already documented in the existing skill and in `commands/dev-story.md` (`requires_status: "ready-for-dev | changes-needed"`). Preserve this dual-guard behavior.

### Manual Edit Detection Algorithm (FR-10 — New in this Story)

**Algorithm** (document in SKILL.md under new section "Manual Edit Detection"):

```
1. Read story YAML frontmatter
2. Extract current: status_field = frontmatter.status
3. Extract last history: last_entry = frontmatter.status_history[-1]
4. Compare: if status_field != last_entry.to → manual edit detected
5. Emit warning: ⚠️ Manual Edit Detected: status field ('[status_field]') does not match
   last status_history entry ('[last_entry.to]'). The story's status was manually edited
   outside of a command. Proceeding with current status field value for guard evaluation.
6. Guard evaluation still uses status_field (user's intent takes precedence)
```

**Edge cases to document:**
- If `status_history` is empty → no comparison possible, skip detection (treat as no discrepancy)
- If `status_history` is present but malformed → skip detection, log as unable to compare
- The warning does NOT block the command — it is informational only
- A `trigger: manual-edit` entry in `status_history` is visible to agents but not auto-generated

### Output Format Changes (Add to existing SKILL.md Output Format section)

Current output:
```yaml
valid: true/false
current_status: "draft"
required_status: "draft"
can_proceed: true/false
```

New output (add two fields):
```yaml
valid: true/false
current_status: "draft"
required_status: "draft"
can_proceed: true/false
manual_edit_detected: false
warning: null  # or string warning message if manual_edit_detected is true
```

### Architecture Compliance

- **Markdown-as-Code paradigm**: All changes are Markdown file updates only — no `.js` files touched
- **Single source of truth**: `scrum_workflow/context/standards.md` is read-only in this story; the guard skill REFERENCES it, not duplicates it
- **Status value format**: All status values MUST use `kebab-case` per `scrum_workflow/context/standards.md`
- **Error format**: Standard error format defined in `_scrum-output/planning-artifacts/architecture.md` §7: `❌ {Error Type}: {description}` with `**Details:**` and `**Next Step:**`
- **Write Boundaries**: This story modifies only: `scrum_workflow/skills/status-guard-validation/SKILL.md` and `scrum_workflow/commands/*.md`
- **NFR-9 (Inspectability)**: All guard errors must be human-readable without any tooling
- **NFR-14 (Error Recovery)**: Every actionable error message must suggest the next command to run

### Previous Story Intelligence (Story 3.1)

From Story 3.1 (now in `review` status):
- `scrum_workflow/context/standards.md` is the authoritative source. **Do NOT re-define transitions** in the guard skill — only REFERENCE `standards.md`
- The `status-guard-validation/SKILL.md` already has the correct transitions list referencing `standards.md`. Do NOT create a new file — extend the existing one
- The `any → cancelled` transition must use the exact guard wording: "explicit user cancellation from any non-terminal state"
- The `refinement` sub-state IS a valid status value (implementation-internal, listed to prevent validation errors) — include it in valid status values
- Story 3.1 audit found that `approve.md` and `dev-story.md` had inline lifecycle tables; they were updated to reference `standards.md`. Preserve those references in your command file updates
- All status transitions use atomic write: status field is only updated AFTER the operation succeeds (guard checks BEFORE any file write)
- `status_history` entries MUST include `actor` field (e.g., `actor: synthesis-skill`, `actor: human`, `actor: status-guard-validation-skill`)

### Testing Pattern (Follow Story 3.1 approach)

Tests are ATDD-style file content verification using Vitest + TypeScript. Pattern from `tests/unit/lifecycle-consolidation/`:
- Tests use `readFileSync` to load Markdown files and `expect(content).toMatch(regex)` to assert content
- Tests start as `test.skip()` (RED phase), then converted to `test()` (GREEN phase) after implementation
- Each AC gets its own spec file: `ac1-*.spec.ts`, `ac2-*.spec.ts`, etc.
- Test file location: `tests/unit/status-guard-validation/`
- Tests verify that SKILL.md and command files contain the required content

**Create tests FIRST (Task 5 before Task 6).** Write the spec file with `test.skip()`, then implement the changes (Tasks 1–4), then activate tests (Task 6).

### What Story 3.3 Depends On (Critical)

Story 3.3 ("Implement Write Boundary Enforcement") will add explicit write boundary declarations to ALL command workflow files. The guard error format standardized in this story (3.2) must be in place BEFORE story 3.3 is implemented, because 3.3's write boundary anti-pattern warnings will use the same `❌ {Error Type}:` format convention.

### Project Structure Context

```
scrum_workflow/
├── context/
│   └── standards.md          ← READ-ONLY: authoritative state machine (completed in 3.1)
├── docs/
│   └── 05-state-machine.md   ← READ-ONLY: references standards.md (completed in 3.1)
├── skills/
│   └── status-guard-validation/
│       └── SKILL.md          ← PRIMARY TARGET: update error formats + manual edit detection
└── commands/
    ├── dev-story.md           ← Update error format
    ├── approve.md             ← Verify/update error format
    ├── review-story.md        ← Update error format
    ├── refine-ticket.md       ← Update error format
    ├── refine-story.md        ← Update error format
    └── create-ticket.md      ← Update error format
```

### References

- [Source: _scrum-output/planning-artifacts/epics.md#Story 3.2]
- [Source: _scrum-output/planning-artifacts/prd.md#FR-8, FR-10, FR-11]
- [Source: _scrum-output/planning-artifacts/architecture.md#7-Error-Message-Patterns]
- [Source: _scrum-output/planning-artifacts/architecture.md#4-Write-Boundary-Patterns]
- [Source: scrum_workflow/context/standards.md#Story-Status-State-Machine]
- [Source: scrum_workflow/skills/status-guard-validation/SKILL.md]
- [Source: _scrum-output/implementation-artifacts/3-1-consolidate-9-state-lifecycle-definition.md#Dev-Notes]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — implementation completed without errors.

### Completion Notes List

- SKILL.md was already partially updated prior to this session (standard error format and manual edit detection were pre-implemented). Verified all 6 guard conditions use `❌ Status Guard Violation:` format with `**Details:**` and `**Next Step:**` sections.
- `commands/dev-story.md` already had the standard error format — no changes needed.
- `commands/approve.md` had old `Status Guard Violation:` prefix (missing `❌`) and plain `Error:` prefixes — updated all three error cases to use `❌ Status Guard Violation:` format with Details + Next Step.
- `commands/review-story.md` had no Error Handling section — added one with standard format.
- `commands/refine-ticket.md` had no Error Handling section — added one with standard format.
- `commands/refine-story.md` had no Error Handling section — added one with standard format.
- `commands/create-ticket.md` had no Error Handling section — added one with standard format.
- Synchronized copies in `create-scrum-workflow/` updated to match primary for create-ticket.md and review-story.md (artifact-contract test requirement).
- All 4 ATDD spec files activated from `test.skip()` to `test()` — 66/66 tests pass.
- Pre-existing failures in `tests/unit/research-update-mode/` and `tests/unit/review-story/ac4-ac5` are due to syntax errors in test files from a different story — not caused by this story's changes.

### File List

- `scrum_workflow/skills/status-guard-validation/SKILL.md` (pre-implemented, verified)
- `scrum_workflow/commands/approve.md` (updated — standard error format for all 3 error cases)
- `scrum_workflow/commands/review-story.md` (updated — added Error Handling section)
- `scrum_workflow/commands/refine-ticket.md` (updated — added Error Handling section)
- `scrum_workflow/commands/refine-story.md` (updated — added Error Handling section)
- `scrum_workflow/commands/create-ticket.md` (updated — added Error Handling section)
- `create-scrum-workflow/scrum_workflow/commands/create-ticket.md` (synchronized copy updated)
- `create-scrum-workflow/scrum_workflow/commands/review-story.md` (synchronized copy updated)
- `create-scrum-workflow/templates/scrum_workflow/commands/create-ticket.md` (synchronized copy updated)
- `create-scrum-workflow/templates/scrum_workflow/commands/review-story.md` (synchronized copy updated)
- `tests/unit/status-guard-validation/ac1-standard-error-format.spec.ts` (activated: test.skip → test)
- `tests/unit/status-guard-validation/ac2-manual-edit-detection.spec.ts` (activated: test.skip → test)
- `tests/unit/status-guard-validation/ac3-no-silent-failure.spec.ts` (activated: test.skip → test)
- `tests/unit/status-guard-validation/ac4-authoritative-transitions.spec.ts` (activated: test.skip → test)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-08 | Story created — ready-for-dev | claude-sonnet-4-6 |
| 2026-04-08 | Implementation complete — all 6 command files updated to use standard error format, 66 ATDD tests passing, status set to review | claude-sonnet-4-6 |
