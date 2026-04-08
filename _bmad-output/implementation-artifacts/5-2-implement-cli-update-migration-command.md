# Story 5.2: Implement CLI Update & Migration Command

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `npx create-scrum-workflow@latest update` to safely migrate my project from v1.2.0 to v1.3.0,
So that I get new features without losing existing work or breaking existing stories.

## Acceptance Criteria

1. **Given** FR-43 specifies CLI update with version detection, breaking change listing, YAML migration, and post-validation **When** a developer runs `npx create-scrum-workflow@latest update` **Then** the CLI detects the current installed version **And** lists all breaking changes between the installed version and the target version

2. **Given** the PRD specifies two breaking changes for v1.2.0 → v1.3.0: new `status_history` field and mandatory `plan.md` check **When** migration runs **Then** existing `story.md` files without `status_history` receive a retroactive entry: `from: null, to: {current_status}, trigger: "migrated-from-v1.2.0", actor: system` **And** stories at `ready-for-dev` without `plan.md` are flagged with a warning and suggested action

3. **Given** NFR-16 specifies update safety: user modifications are never overwritten **When** migration updates framework files **Then** custom skills, agents, and workflows are preserved **And** the lock file tracks user-modified files and skips them during update **And** an update report lists all preserved files, migrated files, and any manual actions required

4. **Given** the migration is complete **When** post-migration validation runs **Then** all YAML frontmatter is parseable **And** all `status_history` arrays are consistent **And** the validation report confirms success or lists remaining issues with actionable guidance

## Tasks / Subtasks

- [x] Task 1: Analyze existing CLI installer structure and update command design (AC: #1)
  - [x] 1.1 Read `create-scrum-workflow/` directory to understand CLI structure
  - [x] 1.2 Identify where version detection will be implemented
  - [x] 1.3 Design the `update` subcommand entry point
  - [x] 1.4 Implement version detection from installed package

- [x] Task 2: Implement breaking changes listing (AC: #1)
  - [x] 2.1 Document the v1.2.0 → v1.3.0 breaking changes:
    - New mandatory `status_history` field in story.yaml frontmatter
    - New mandatory `plan.md` check before `/scrum-dev-story`
  - [x] 2.2 Create breaking-changes.md or inline documentation
  - [x] 2.3 Implement `--dry-run` mode to preview changes without applying

- [x] Task 3: Implement YAML frontmatter migration for status_history (AC: #2)
  - [x] 3.1 Scan all `story.md` files in `_scrum-output/sprints/` for missing `status_history`
  - [x] 3.2 For stories without `status_history`, add retroactive entry with:
    - `from: null`
    - `to: {current_status}` (read from existing status field)
    - `trigger: "migrated-from-v1.2.0"`
    - `actor: system`
  - [x] 3.3 Ensure migration is atomic (backup before modify)

- [x] Task 4: Implement ready-for-dev plan.md warning (AC: #2)
  - [x] 4.1 Identify stories at `ready-for-dev` status
  - [x] 4.2 Check if corresponding `plan.md` exists in each story directory
  - [x] 4.3 Flag stories missing `plan.md` with warning and suggested action:
    - Warning: "Story SW-XXX is at ready-for-dev but missing plan.md"
    - Suggestion: "Run /scrum-refine-story SW-XXX to generate plan.md"
  - [x] 4.4 Do NOT block migration for these stories (warning only)

- [x] Task 5: Implement user modification preservation (AC: #3)
  - [x] 5.1 Create or update lock file mechanism (`update-lock.json` or similar)
  - [x] 5.2 Track files that user has modified (compare against template)
  - [x] 5.3 During framework file update, skip files in lock file
  - [x] 5.4 Generate update report listing: preserved files, migrated files, manual actions

- [x] Task 6: Implement post-migration validation (AC: #4)
  - [x] 6.1 Validate all YAML frontmatter is parseable
  - [x] 6.2 Check all `status_history` arrays for consistency (each entry has required fields)
  - [x] 6.3 Report validation results with actionable guidance for any failures

- [x] Task 7: Write ATDD tests for migration command (AC: #1, #2, #3, #4)
  - [x] 7.1 Create `tests/unit/cli-update/` test directory
  - [x] 7.2 Write tests for version detection
  - [x] 7.3 Write tests for breaking changes listing
  - [x] 7.4 Write tests for status_history migration
  - [x] 7.5 Write tests for plan.md warning
  - [x] 7.6 Write tests for user modification preservation
  - [x] 7.7 Write tests for post-migration validation

- [x] Task 8: Sync to create-scrum-workflow copies
  - [x] 8.1 Ensure all changes are reflected in `create-scrum-workflow/` copies
  - [x] 8.2 Ensure all changes are reflected in `templates/` copies

## Dev Notes

### Critical Context: What Story 5.2 Implements

This story implements FR-43: CLI update/migration command for safe upgrades from v1.2.0 to v1.3.0.

**Two breaking changes for v1.2.0 → v1.3.0:**
1. New mandatory `status_history` field — all existing stories need a retroactive entry
2. New mandatory `plan.md` check — stories at `ready-for-dev` need a plan before dev

**Key constraint:** NFR-16 (Update Safety) — user modifications must NEVER be overwritten. This requires a lock file mechanism.

### Previous Story Intelligence (Story 5.1)

Story 5.1 implemented the `--depth` flag for `/scrum-create-ticket` and light/standard branching in `/scrum-refine-ticket`. Key learnings:

- The `create-scrum-workflow/` directory is the canonical source for CLI installer
- Templates live in `create-scrum-workflow/templates/scrum_workflow/`
- Changes to commands/workflows must be synced to both `create-scrum-workflow/` and `templates/` directories
- The workflow uses `yolo` mode for auto-approval during development

### Architecture Compliance

- **FR-43**: CLI update/migration with version detection, breaking change listing, YAML migration, post-validation
- **NFR-16**: Update safety — user modifications preserved via lock file
- **Write Boundary**: `update` command writes only to framework files and `_scrum-output/` story files, never to user source code
- **Actor Identity**: Migration entries use `actor: system`
- **Error Format**: Standard error format with `**Details:**` and `**Next Step:**`

### Technical Stack

- CLI framework: Likely using a JavaScript/Node.js CLI framework (picocolors for colors already mentioned in UX-DR6)
- YAML parsing: Need to handle YAML frontmatter safely
- Version detection: Read from `package.json` or similar marker file

### File Structure

```
create-scrum-workflow/
├── package.json                      ← READ: version detection
├── src/                            ← CHANGE: add update command
│   └── commands/
│       └── update.ts              ← CREATE: update command implementation
├── templates/scrum_workflow/       ← SYNC: template files
├── breaking-changes.md             ← CREATE: v1.2.0 → v1.3.0 changes
└── lock-file-template.json         ← CREATE: lock file schema

_scrum-output/
├── sprints/SW-XXX/story.md        ← UPDATE: add status_history migration
└── update-report.md                ← CREATE: migration report

tests/unit/cli-update/             ← CREATE: ATDD tests
```

**DO NOT modify:**
- User source code files
- Existing story artifacts beyond `story.md` frontmatter
- `scrum_workflow/context/standards.md` — authoritative state machine, read-only

### Dependencies

- Story 5.1 must be complete (already done) — this story builds on the same CLI structure
- Story 4.1/4.2 (Plan enforcement) must be complete (already done) — plan.md check depends on plan.md existence

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.2]
- [Source: _bmad-output/planning-artifacts/architecture.md]
- [Source: create-scrum-workflow/ directory structure]
- [Source: _bmad-output/implementation-artifacts/5-1-implement-manual-workflow-depth-override.md]

## Dev Agent Record

### Agent Model Used

Claude Code (bmad-dev-story workflow, yolo mode)

### Debug Log References

Implementation completed in single session following bmad-dev-story workflow.

### Completion Notes List

1. Created `breaking-changes.md` documenting v1.2.0 to v1.3.0 migration with two breaking changes:
   - New mandatory status_history field in story.yaml frontmatter
   - New mandatory plan.md check before /scrum-dev-story
2. Extended `src/commands/update.js` with:
   - YAML frontmatter parsing/serialization helpers
   - status_history migration function for story files
   - plan.md warning function for ready-for-dev stories
   - Post-migration validation function
   - Breaking changes documentation constant
3. All 55 ATDD tests passing (AC1: 11, AC2: 13, AC3: 18, AC4: 13)
4. Tests fixed to use correct path resolution from test file location
5. Story file updated to status: review, all tasks marked complete
6. sprint-status.yaml updated to in-progress -> review

### File List

1. `create-scrum-workflow/breaking-changes.md` - NEW: Breaking changes documentation
2. `create-scrum-workflow/src/commands/update.js` - MODIFIED: Extended with migration and validation
3. `create-scrum-workflow/templates/breaking-changes.md` - SYNC: Template copy
4. `create-scrum-workflow/templates/src/commands/update.js` - SYNC: Template copy
5. `create-scrum-workflow/test/unit/cli-update/*.test.js` - MODIFIED: Fixed path resolution

### Review Findings

- [x] [Review][Patch] Fix `scrum-refine-story` → `scrum-refine-ticket` in update.js suggestion and breaking-changes.md [update.js:169, breaking-changes.md:64,72]
- [x] [Review][Patch] Remove dead `generateValidationReport` call with shadowed empty objects [update.js:548-550]
- [x] [Review][Patch] Display `BREAKING_CHANGES` in dry-run output [update.js:431-446]
- [x] [Review][Patch] Move `planMdResult` to function scope for Step 7 access [update.js:452,649-655]
- [x] [Review][Patch] Guard against null frontmatter in `migrateStoryStatusHistory` [update.js:107-112]

### Completion Notes