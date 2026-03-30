# Story 8.2: Installer Pipeline Update for New Skills

Status: done

**Epic Context:** Epic 8 integrates Epic 6 (Business Logic Documentation) and Epic 7 (Architecture Documentation) into the `create-scrum-workflow` installer, making `/scrum-create-project-docs` and `/scrum-create-architecture-docs` available as platform-discoverable commands.

**Theme:** YOLO (You Only Live Once) - straightforward, efficient implementation following established patterns

---

## Story

As a **developer using the create-scrum-workflow installer**,
I want **the installer to copy and register the new documentation skill shims**,
so that **after installation, I can invoke `/scrum-create-project-docs` and `/scrum-create-architecture-docs` commands from my AI coding platform**.

---

## Acceptance Criteria

### AC1: Auto-Discovery of New Skill Templates
**Given** Story 8.1 created two new skill registration templates in `create-scrum-workflow/templates/skill-registrations/`
**And** the installer's `skill-registrar.js` uses `readdirSync()` to auto-discover template directories
**When** the install command executes the skill registration step
**Then** all 6 skill templates are automatically discovered (4 original + 2 new)
**And** no code changes are required in `skill-registrar.js` to support the new skills
**And** the installer reports the correct skill count (6 skills)

### AC2: Skill Shim Copy to Platform Directories
**Given** the install command is running with platforms selected (e.g., claude-code, cursor)
**When** the skill registration step executes
**Then** for each selected platform, all 6 skill shim directories are copied to `{target}/.{platform}/skills/`
**And** the 6 skills are: scrum-create-project-context, scrum-create-ticket, scrum-refine-ticket, scrum-dev-story, scrum-create-project-docs, scrum-create-architecture-docs
**And** each skill directory contains a `SKILL.md` file

### AC3: Framework Path Placeholder Substitution
**Given** each skill template contains the `{{framework_path}}` placeholder
**When** the installer copies skill shims to platform directories
**Then** `{{framework_path}}` is replaced with the resolved framework path (e.g., `scrum_workflow`) for all 6 skills
**And** the substitution is performed by the existing `replaceAll('{{framework_path}}', config.frameworkPath)` in `skill-registrar.js`
**And** no code changes are needed to support substitution for the new skills

### AC4: Valid YAML Frontmatter in Generated Skills
**Given** the installer generates skill shims by copying and substituting templates
**When** the skill registration step completes
**Then** all 6 generated SKILL.md files have valid YAML frontmatter
**And** the `name` field in frontmatter matches the directory name for all 6 skills
**And** the frontmatter contains only `name` and `description` fields (no display_name, no active_in)

### AC5: Lock File Includes All 6 Skill Files
**Given** the installer generates a lock file at the end of installation
**When** the lock file generation step executes
**Then** the lock file includes SHA-256 hashes for all 6 skill registration files
**And** the lock file's `files` object contains entries for all platform skill directories
**And** no code changes are needed in `installer.js` - the existing `hashDirectory()` call already hashes all files recursively

### AC6: Install Summary Shows All 6 Skills
**Given** the installer prints a summary after successful installation
**When** the installation completes
**Then** the summary shows "Skills registered: 6 skills x N platform(s)"
**And** the summary lists all 6 skill names or shows the correct count
**And** no code changes are needed - the existing `skillResult.skillCount` already reports the discovered skill count

---

## Tasks / Subtasks

- [x] **Task 1: Verify Auto-Discovery Mechanism** (AC: #1)
  - [x] Subtask 1.1: Review `src/core/skill-registrar.js` to confirm `readdirSync()` auto-discovers all template directories
  - [x] Subtask 1.2: Verify no hardcoded skill list exists that would need updating
  - [x] Subtask 1.3: Confirm the 2 new templates from Story 8.1 are in the correct directory structure

- [x] **Task 2: Verify Skill Copy Pipeline** (AC: #2)
  - [x] Subtask 2.1: Test installation with a single platform (e.g., claude-code)
  - [x] Subtask 2.2: Verify all 6 skill directories are created in `.claude/skills/`
  - [x] Subtask 2.3: Verify each skill directory contains a `SKILL.md` file with substituted content

- [x] **Task 3: Verify Framework Path Substitution** (AC: #3, #4)
  - [x] Subtask 3.1: Inspect generated skill files to confirm `{{framework_path}}` is replaced
  - [x] Subtask 3.2: Verify the substituted path matches the configured framework path
  - [x] Subtask 3.3: Validate YAML frontmatter in all 6 generated skill files

- [x] **Task 4: Verify Lock File Generation** (AC: #5)
  - [x] Subtask 4.1: Run installation and check the generated `.scrum-workflow-lock.json`
  - [x] Subtask 4.2: Verify the lock file contains entries for all 6 skill files
  - [x] Subtask 4.3: Verify SHA-256 hashes are present for each skill file

- [x] **Task 5: Verify Install Summary** (AC: #6)
  - [x] Subtask 5.1: Run installation and observe the final summary output
  - [x] Subtask 5.2: Verify the summary shows "6 skills" in the skill count
  - [x] Subtask 5.3: Confirm all 6 skill names are discoverable by the AI platform

- [x] **Task 6: Multi-Platform Verification** (AC: #2)
  - [x] Subtask 6.1: Test installation with multiple platforms selected
  - [x] Subtask 6.2: Verify all 6 skills are copied to all selected platform directories
  - [x] Subtask 6.3: Confirm lock file tracks skill files for all platforms

- [x] **Task 7: Idempotency and Overwrite** (AC: #2, #4)
  - [x] Subtask 7.1: Run installation twice on the same target
  - [x] Subtask 7.2: Verify existing skill shims are overwritten correctly
  - [x] Subtask 7.3: Confirm all 6 skills remain functional after re-installation

---

## Dev Notes

### Architecture Patterns and Constraints

**Pattern: Auto-Discovery via `readdirSync()`**
- Location: `create-scrum-workflow/src/core/skill-registrar.js`
- Purpose: Automatically discover all skill template directories without hardcoded lists
- Implementation: `const skillNames = readdirSync(templateDir).filter(...)` discovers all subdirectories
- Benefit: Adding new skills requires only creating template directories - zero code changes

**Pattern: Template Substitution**
- Placeholder: `{{framework_path}}` in skill template files
- Substitution: `rawContent.replaceAll('{{framework_path}}', config.frameworkPath)` in skill-registrar.js
- Result: Framework-specific paths in generated skill shims (e.g., `scrum_workflow/commands/create-project-docs.md`)

**Pattern: Recursive Hashing for Lock Files**
- Location: `create-scrum-workflow/src/core/installer.js`, method `generateLockFile()`
- Implementation: `hashDirectory()` recursively computes SHA-256 hashes for all files
- Benefit: New skill files are automatically included in lock file - no code changes needed

**Pattern: Skill Registration Pipeline**
- Step 1: Discover template directories via `readdirSync()`
- Step 2: For each platform, copy template directories to platform skill directory
- Step 3: Substitute `{{framework_path}}` placeholder in each SKILL.md
- Step 4: Return count of discovered skills and platforms for summary

### Source Tree Components to Touch

**PRIMARY FILES (READ-ONLY - Verification Only):**
1. `create-scrum-workflow/src/core/skill-registrar.js` - verify auto-discovery works
2. `create-scrum-workflow/src/core/installer.js` - verify lock file generation and summary
3. `create-scrum-workflow/src/integrity/hash-tracker.js` - understand recursive hashing
4. `create-scrum-workflow/src/integrity/lock-file.js` - understand lock file structure

**REFERENCE FILES (Story 8.1 Outputs):**
1. `create-scrum-workflow/templates/skill-registrations/scrum-create-project-docs/SKILL.md` - new template
2. `create-scrum-workflow/templates/skill-registrations/scrum-create-architecture-docs/SKILL.md` - new template
3. `create-scrum-workflow/templates/skill-registrations/scrum-create-project-context/SKILL.md` - existing template reference
4. `create-scrum-workflow/templates/skill-registrations/scrum-create-ticket/SKILL.md` - existing template reference
5. `create-scrum-workflow/templates/skill-registrations/scrum-refine-ticket/SKILL.md` - existing template reference
6. `create-scrum-workflow/templates/skill-registrations/scrum-dev-story/SKILL.md` - existing template reference

**GENERATED FILES (For Verification):**
1. `.scrum-workflow-lock.json` - verify all 6 skill files are tracked
2. `.claude/skills/scrum-create-project-docs/SKILL.md` - verify generated skill shim
3. `.claude/skills/scrum-create-architecture-docs/SKILL.md` - verify generated skill shim

**DO NOT MODIFY:**
- Installer source code - designed to be auto-discovery based
- Platform registry - no changes needed
- Existing skill templates - use as reference only

### Testing Standards Summary

**Manual Verification Steps:**
1. Run `node bin/create-scrum-workflow.js install --yes` with default platform
2. Verify all 6 skill directories exist in `.claude/skills/`
3. Open each skill file and verify `{{framework_path}}` is substituted
4. Check `.scrum-workflow-lock.json` contains entries for all 6 skill files
5. Verify install summary shows "6 skills"

**Multi-Platform Testing:**
1. Run installation with multiple platforms: `--platforms claude-code cursor`
2. Verify all 6 skills exist in both `.claude/skills/` and `.cursor/skills/` (or platform-specific paths)
3. Check lock file tracks skill files for all platforms

**Idempotency Testing:**
1. Run installation twice on same target directory
2. Verify second run overwrites skill shims correctly
3. Confirm no duplicate or stale skill directories remain

**YAML Validation:**
1. Parse each generated SKILL.md frontmatter
2. Verify `name` field matches directory name
3. Verify `description` field is present and valid

### Project Structure Notes

**Alignment with Unified Project Structure:**
- No new source files needed - installer is already auto-discovery based
- Templates follow established pattern in `templates/skill-registrations/`
- Generated skill shims follow platform-specific conventions (`.claude/skills/`, etc.)

**Naming Conventions:**
- Skill template directories: kebab-case (e.g., `scrum-create-project-docs`)
- SKILL.md filename: Always capitalized
- `name` frontmatter field: Matches directory name exactly

**Detected Conflicts or Variances:**
- None. This story is primarily verification that the auto-discovery mechanism works correctly.
- The installer was designed from Epic 5 to support auto-discovery, so adding new skills requires zero code changes.

### References

**Epic 5 Installer Implementation:**
- Auto-discovery code: [Source: create-scrum-workflow/src/core/skill-registrar.js#L21-L24]
- Template substitution: [Source: create-scrum-workflow/src/core/skill-registrar.js#L38-L39]
- Recursive hashing: [Source: create-scrum-workflow/src/core/installer.js#L122-L131]
- Install summary: [Source: create-scrum-workflow/src/core/installer.js#L155-L169]

**Story 8.1 Outputs:**
- Project-docs template: [Source: create-scrum-workflow/templates/skill-registrations/scrum-create-project-docs/SKILL.md]
- Architecture-docs template: [Source: create-scrum-workflow/templates/skill-registrations/scrum-create-architecture-docs/SKILL.md]
- Story 8.1 completion notes: [Source: _bmad-output/implementation-artifacts/8-1-skill-registration-templates-for-epic-6-and-7.md#L206-L211]

**Epic 6 & 7 Commands:**
- Project-docs command: [Source: scrum_workflow/commands/create-project-docs.md]
- Architecture-docs command: [Source: scrum_workflow/commands/create-architecture-docs.md]

**Previous Story (8-1) Analysis:**
- Dev Notes from 8-1: [Source: _bmad-output/implementation-artifacts/8-1-skill-registration-templates-for-epic-6-and-7.md#L98-L137]

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4 (claude-opus-4-2026)

### Debug Log References

None (story creation phase)

### Completion Notes List

- Story created with comprehensive analysis of installer auto-discovery mechanism
- Key finding: Installer code is already designed to auto-discover skill templates via `readdirSync()`
- NO CODE CHANGES NEEDED - the two new templates from Story 8.1 will be automatically picked up
- Task breakdown focuses on verification and testing rather than code modification
- YOLO theme applied: straightforward verification tasks, no unnecessary complexity
- All 6 skills (4 original + 2 new) will be automatically:
  - Discovered by `skill-registrar.js`
  - Copied to all selected platform directories
  - Substituted with correct framework path
  - Included in lock file with SHA-256 hashes
  - Reported in install summary

### Implementation Results (Step 3)

✅ **ALL ACCEPTANCE CRITERIA VERIFIED**

**AC1: Auto-Discovery** - Confirmed `readdirSync()` automatically discovers all 6 template directories without code changes
**AC2: Skill Copy** - Verified all 6 skills copied to `.claude/skills/` for each selected platform
**AC3: Framework Substitution** - Confirmed `{{framework_path}}` replaced with `scrum_workflow` in all generated skills
**AC4: Valid YAML** - Validated all 6 generated SKILL.md files have proper frontmatter with `name` and `description` fields
**AC5: Lock File** - Verified `.scrum-workflow-lock.json` contains SHA-256 hashes for all 6 skill files
**AC6: Install Summary** - Confirmed installation reports "Skills registered: 6 skills x N platform(s)"

**Multi-Platform Testing:** Successfully tested with claude-code + cursor platforms - all 6 skills installed to both platforms
**Idempotency Testing:** Ran installation twice - second run correctly overwrote existing skills, all 6 skills remained functional

**Key Finding:** The installer architecture from Epic 5 was perfectly designed for extensibility - adding new skills requires ZERO code changes!

### File List

**Story File:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/8-2-yolo.md`

**Reference Files Analyzed:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/planning-artifacts/epics.md` (Epic 8, Story 8.2)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/8-1-skill-registration-templates-for-epic-6-and-7.md` (Previous story)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/src/core/skill-registrar.js`
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/src/core/installer.js`
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/src/integrity/hash-tracker.js`
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/src/integrity/lock-file.js`

**Generated/Modified Files:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/.claude/skills/scrum-create-project-context/SKILL.md` (verified)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/.claude/skills/scrum-create-ticket/SKILL.md` (verified)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/.claude/skills/scrum-refine-ticket/SKILL.md` (verified)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/.claude/skills/scrum-dev-story/SKILL.md` (verified)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/.claude/skills/scrum-create-project-docs/SKILL.md` (verified NEW)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/.claude/skills/scrum-create-architecture-docs/SKILL.md` (verified NEW)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/.scrum-workflow-lock.json` (verified contains all 6 skills)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/.cursor/skills/` (verified all 6 skills in multi-platform test)
