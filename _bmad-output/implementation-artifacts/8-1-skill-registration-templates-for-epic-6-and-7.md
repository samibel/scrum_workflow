# Story 8.1: Skill Registration Templates for Epic 6 & 7

Status: done

**Epic Context:** Epic 8 integrates Epic 6 (Business Logic Documentation) and Epic 7 (Architecture Documentation) into the `create-scrum-workflow` installer, making `/scrum-create-project-docs` and `/scrum-create-architecture-docs` available as platform-discoverable commands.

**Theme:** YOLO (You Only Live Once) - straightforward, efficient implementation following established patterns

---

## Story

As a **developer using the create-scrum-workflow installer**,
I want **skill registration templates for the two new documentation commands from Epic 6 and Epic 7**,
so that **the installer can generate platform-specific skill shims automatically, making the documentation commands available across all supported AI coding platforms**.

---

## Acceptance Criteria

### AC1: Template File Creation
**Given** Epic 6 and Epic 7 command definitions are complete in `scrum_workflow/commands/`
**When** the skill registration templates are created in `create-scrum-workflow/templates/skill-registrations/`
**Then** `templates/skill-registrations/scrum-create-project-docs/SKILL.md` exists with:
- YAML frontmatter with fields: `name`, `description` (no `display_name` or `active_in` needed for skill shims)
- Body referencing `{{framework_path}}/commands/create-project-docs.md`
- `{{framework_path}}` placeholder that will be replaced during installation
- Clear description explaining the command's purpose

**And** `templates/skill-registrations/scrum-create-architecture-docs/SKILL.md` exists with:
- Same structure as the project-docs template
- Body referencing `{{framework_path}}/commands/create-architecture-docs.md`
- Clear description explaining the command's purpose

### AC2: Template Format Consistency
**Given** the four existing skill registration templates (scrum-create-project-context, scrum-create-ticket, scrum-refine-ticket, scrum-dev-story) exist
**When** the new templates are created
**Then** both new templates follow the exact same format as existing templates:
- `name` field in frontmatter uses kebab-case and matches the directory name
- No `display_name` field (skill shims don't need it)
- No `active_in` field (skill shims don't need it)
- `description` field provides clear guidance on when to use the command
- Body uses the same load-and-execute pattern: "Load and execute the framework command at..."

### AC3: Placeholder Syntax
**Given** the templates use placeholders for dynamic substitution
**When** the templates are created
**Then** both templates use the exact placeholder syntax: `{{framework_path}}`
**And** the placeholder appears in the body referencing the command path
**And** no other placeholders are used (only framework_path is needed)

### AC4: Command References
**Given** the Epic 6 command is at `scrum_workflow/commands/create-project-docs.md`
**And** the Epic 7 command is at `scrum_workflow/commands/create-architecture-docs.md`
**When** the templates are created
**Then** `scrum-create-project-docs/SKILL.md` references `{{framework_path}}/commands/create-project-docs.md`
**And** `scrum-create-architecture-docs/SKILL.md` references `{{framework_path}}/commands/create-architecture-docs.md`
**And** the references are correct relative paths from the framework root

### AC5: Description Quality
**Given** skill shims are the entry point for AI assistants to discover commands
**When** the templates are created
**Then** both templates include a `description` field that:
- Clearly states what the command does
- Mentions the trigger phrases (e.g., `/scrum-create-project-docs`)
- References the full workflow orchestration
- Indicates what the agent/spawned workflow handles

---

## Tasks / Subtasks

- [x] **Task 1: Analyze Existing Skill Registration Templates** (AC: #2)
  - [x] Subtask 1.1: Read all 4 existing templates in `create-scrum-workflow/templates/skill-registrations/`
  - [x] Subtask 1.2: Document the exact format and structure used
  - [x] Subtask 1.3: Identify any variations or inconsistencies to avoid

- [x] **Task 2: Create `scrum-create-project-docs` Template** (AC: #1, #3, #4, #5)
  - [x] Subtask 2.1: Create directory `templates/skill-registrations/scrum-create-project-docs/`
  - [x] Subtask 2.2: Create `SKILL.md` file with proper frontmatter (name, description)
  - [x] Subtask 2.3: Write body with `{{framework_path}}/commands/create-project-docs.md` reference
  - [x] Subtask 2.4: Write clear description explaining the command purpose and workflow

- [x] **Task 3: Create `scrum-create-architecture-docs` Template** (AC: #1, #3, #4, #5)
  - [x] Subtask 3.1: Create directory `templates/skill-registrations/scrum-create-architecture-docs/`
  - [x] Subtask 3.2: Create `SKILL.md` file with proper frontmatter (name, description)
  - [x] Subtask 3.3: Write body with `{{framework_path}}/commands/create-architecture-docs.md` reference
  - [x] Subtask 3.4: Write clear description explaining the command purpose and workflow

- [x] **Task 4: Validate Template Format** (AC: #2)
  - [x] Subtask 4.1: Compare both new templates against existing 4 templates
  - [x] Subtask 4.2: Verify frontmatter fields match exactly (no display_name, no active_in)
  - [x] Subtask 4.3: Verify placeholder syntax matches (`{{framework_path}}`)
  - [x] Subtask 4.4: Verify body structure and tone are consistent

---

## Dev Notes

### Architecture Patterns and Constraints

**Pattern: Skill Registration Templates**
- Location: `create-scrum-workflow/templates/skill-registrations/{skill-name}/SKILL.md`
- Purpose: Platform-agnostic templates that are copied and substituted during installation
- Substitution: `{{framework_path}}` → resolved framework path (e.g., `scrum_workflow`)
- Format: Minimal YAML frontmatter + reference body

**Pattern: Skill Shim Structure**
- Skill shims are pure references to framework command files
- No workflow logic duplicated in the shim
- Frontmatter only needs: `name`, `description`
- Body: Single paragraph explaining what command to load and execute

**Pattern: Installer Pipeline**
- `src/core/skill-registrar.js` reads template directories via `readdirSync()`
- Each directory name becomes the skill name
- Templates are automatically discovered and copied to all selected platforms
- No code changes needed to add new skills — just add a new template directory

### Source Tree Components to Touch

**Primary Files to Create:**
1. `create-scrum-workflow/templates/skill-registrations/scrum-create-project-docs/SKILL.md`
2. `create-scrum-workflow/templates/skill-registrations/scrum-create-architecture-docs/SKILL.md`

**Reference Files (READ-ONLY):**
1. `create-scrum-workflow/templates/skill-registrations/scrum-create-project-context/SKILL.md` (format reference)
2. `create-scrum-workflow/templates/skill-registrations/scrum-create-ticket/SKILL.md` (format reference)
3. `scrum_workflow/commands/create-project-docs.md` (command to reference)
4. `scrum_workflow/commands/create-architecture-docs.md` (command to reference)
5. `create-scrum-workflow/src/core/skill-registrar.js` (understand template discovery)

**DO NOT MODIFY:**
- Installer source code (`src/core/skill-registrar.js`) - already auto-discovers templates
- Platform registry (`src/platform/platform-registry.yaml`) - no changes needed
- Existing skill templates - use as reference only

### Testing Standards Summary

**Manual Verification:**
1. After creating templates, verify they match the format of existing 4 templates
2. Check YAML frontmatter is valid (can be parsed)
3. Verify `{{framework_path}}` placeholder appears exactly once per template
4. Verify command reference paths are correct

**Integration Testing:**
- Story 8.3 will add automated integration tests for these templates
- For now, manual verification is sufficient

### Project Structure Notes

**Alignment with Unified Project Structure:**
- Templates follow the established pattern in `create-scrum-workflow/templates/skill-registrations/`
- No new directories or file patterns introduced
- Maintains consistency with existing 4 skill registration templates

**Naming Conventions:**
- Directory names: `scrum-create-project-docs`, `scrum-create-architecture-docs` (kebab-case)
- SKILL.md filename: Always capitalized (matches existing pattern)
- `name` field in frontmatter: Matches directory name exactly

**Detected Conflicts or Variances:**
- None. This story follows a well-established pattern from Epic 5 (Stories 5.1-5.5)

### References

**Epic 6 Documentation Command:**
- Command definition: [Source: scrum_workflow/commands/create-project-docs.md]
- Workflow: [Source: scrum_workflow/workflows/project-documentation.md]
- Purpose: Generate business logic documentation (business rules, workflows, domain models)

**Epic 7 Architecture Documentation Command:**
- Command definition: [Source: scrum_workflow/commands/create-architecture-docs.md]
- Workflow: [Source: scrum_workflow/workflows/architecture-documentation.md]
- Purpose: Generate architecture documentation (backend, frontend, DevOps, local dev, testing)

**Epic 5 Installer Patterns:**
- Skill registration code: [Source: create-scrum-workflow/src/core/skill-registrar.js]
- Existing templates: [Source: create-scrum-workflow/templates/skill-registrations/*/SKILL.md]
- Template discovery: Uses `readdirSync()` to auto-discover all template directories

**Existing Skill Template Example:**
- Reference template: [Source: create-scrum-workflow/templates/skill-registrations/scrum-create-project-context/SKILL.md]
- Format: Frontmatter (name, description) + Body (framework command reference)

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4 (claude-opus-4-2026)

### Debug Log References

None (story creation phase)

### Completion Notes List

- Story created with comprehensive context from Epic 6 and Epic 7 command definitions
- Existing skill registration templates analyzed for format consistency
- Installer pipeline (skill-registrar.js) reviewed to understand template discovery mechanism
- No code changes needed in installer - templates are auto-discovered
- Task breakdown follows the YOLO theme: straightforward, efficient, no-nonsense
- **Implementation Complete:** Both skill registration templates created successfully following YOLO theme
- Both templates (`scrum-create-project-docs` and `scrum-create-architecture-docs`) follow exact format of existing 4 templates
- Frontmatter validated: only `name` and `description` fields (no display_name, no active_in)
- Placeholder syntax validated: `{{framework_path}}` used correctly in both templates
- Command references validated: correct relative paths to framework commands
- Description quality validated: clear purpose, trigger phrases, workflow orchestration mentioned
- Templates are ready for installer integration in Story 8-2
- **Code Review Complete:** Clean review - all acceptance criteria satisfied, no issues found

### File List

**Story File:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/8-1-skill-registration-templates-for-epic-6-and-7.md`

**Reference Files Analyzed:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/planning-artifacts/epics.md` (Epic 8, Story 8.1)
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/commands/create-project-docs.md`
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/commands/create-architecture-docs.md`
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/templates/skill-registrations/scrum-create-project-context/SKILL.md`
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/src/core/skill-registrar.js`
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/src/core/installer.js`

**Files Created:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/templates/skill-registrations/scrum-create-project-docs/SKILL.md`
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/templates/skill-registrations/scrum-create-architecture-docs/SKILL.md`
