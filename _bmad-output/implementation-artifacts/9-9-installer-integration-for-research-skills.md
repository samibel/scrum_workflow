# Story 9.9: Installer Integration for Research Skills

Status: ready-for-dev

## Story

As a developer,
I want the research skills to be automatically installed when running `create-scrum-workflow install`,
so that users don't need to manually register the research commands.

## Acceptance Criteria

1. **Technical research skill template**: `create-scrum-workflow/templates/skill-registrations/scrum-research-technical/SKILL.md` exists with YAML frontmatter (`name`, `display_name`, `description`, `active_in`) and body referencing `{{framework_path}}/commands/research-technical.md`
2. **General research skill template**: `create-scrum-workflow/templates/skill-registrations/scrum-research-general/SKILL.md` exists with the same structure, referencing `{{framework_path}}/commands/research-general.md`
3. **Framework path placeholder**: Each template contains a `{{framework_path}}` placeholder that will be replaced during installation
4. **Research framework files included**: `create-scrum-workflow/templates/scrum_workflow/` includes the research agent, commands, workflows, and output templates: `agents/researcher.md`, `commands/research-technical.md`, `commands/research-general.md`, `workflows/research-technical.md`, `workflows/research-general.md`, `templates/technical-research.md`, `templates/general-research.md`
5. **Automatic skill registration**: When `create-scrum-workflow install` is run, the installer automatically copies both research skill shims to `{target}/.{platform}/skills/`
6. **Lock file tracking**: The lock file (`.scrum-workflow-lock.json`) includes both research skill registration files with SHA-256 hashes
7. **Install summary**: The install command summary shows: "X skills registered: [list including scrum-research-technical and scrum-research-general]"
8. **Package.json unchanged**: The `create-scrum-workflow/package.json` `files` array includes the new research templates (no changes needed -- `templates/` is already included)

## Tasks / Subtasks

- [ ] Task 1: Create scrum-research-technical skill registration template (AC: #1, #3)
  - [ ] 1.1: Create directory `create-scrum-workflow/templates/skill-registrations/scrum-research-technical/`
  - [ ] 1.2: Create `SKILL.md` with YAML frontmatter: `name: scrum-research-technical`, `display_name: Scrum Research Technical`, `description`, `active_in: [research-technical]`
  - [ ] 1.3: Add body content referencing `{{framework_path}}/commands/research-technical.md`
  - [ ] 1.4: Include description of workflow orchestration (Plan-Then-Execute, Swarm Migration, Reflection Loop)
- [ ] Task 2: Create scrum-research-general skill registration template (AC: #2, #3)
  - [ ] 2.1: Create directory `create-scrum-workflow/templates/skill-registrations/scrum-research-general/`
  - [ ] 2.2: Create `SKILL.md` with YAML frontmatter: `name: scrum-research-general`, `display_name: Scrum Research General`, `description`, `active_in: [research-general]`
  - [ ] 2.3: Add body content referencing `{{framework_path}}/commands/research-general.md`
  - [ ] 2.4: Include description of workflow orchestration for general research mode
- [ ] Task 3: Copy research agent definition to installer templates (AC: #4)
  - [ ] 3.1: Copy `scrum_workflow/agents/researcher.md` to `create-scrum-workflow/templates/scrum_workflow/agents/researcher.md`
  - [ ] 3.2: Verify file content is identical (verbatim copy)
- [ ] Task 4: Copy research-technical command to installer templates (AC: #4)
  - [ ] 4.1: Copy `scrum_workflow/commands/research-technical.md` to `create-scrum-workflow/templates/scrum_workflow/commands/research-technical.md`
  - [ ] 4.2: Verify file content is identical (verbatim copy)
- [ ] Task 5: Copy research-technical workflow to installer templates (AC: #4)
  - [ ] 5.1: Copy `scrum_workflow/workflows/research-technical.md` to `create-scrum-workflow/templates/scrum_workflow/workflows/research-technical.md`
  - [ ] 5.2: Verify file content is identical (verbatim copy)
- [ ] Task 6: Copy technical-research output template to installer templates (AC: #4)
  - [ ] 6.1: Copy `scrum_workflow/templates/technical-research.md` to `create-scrum-workflow/templates/scrum_workflow/templates/technical-research.md`
  - [ ] 6.2: Verify file content is identical (verbatim copy)
- [ ] Task 7: Create research-general command placeholder (AC: #4)
  - [ ] 7.1: Create `create-scrum-workflow/templates/scrum_workflow/commands/research-general.md` with SKILL.md format
  - [ ] 7.2: Include trigger `/research-general`, spawns_agents: [researcher], workflow reference to research-general.md
  - [ ] 7.3: Document input arguments and output paths
- [ ] Task 8: Create research-general workflow placeholder (AC: #4)
  - [ ] 8.1: Create `create-scrum-workflow/templates/scrum_workflow/workflows/research-general.md` with Plan-Then-Execute workflow structure
  - [ ] 8.2: Include same four patterns: Plan-Then-Execute, Swarm Migration, Reflection Loop, Filesystem-Based State
  - [ ] 8.3: Define output schema as `type: general_research` with appropriate sections
- [ ] Task 9: Create general-research output template placeholder (AC: #4)
  - [ ] 9.1: Create `create-scrum-workflow/templates/scrum_workflow/templates/general-research.md`
  - [ ] 9.2: Include YAML frontmatter with `type: general_research` and required fields
  - [ ] 9.3: Include sections: Executive Summary, Market Analysis, Competitive Landscape, Strategic Recommendations, Implementation Considerations, Risk Assessment, Future Outlook, References
- [ ] Task 10: Verify installer integration (AC: #5, #6, #7)
  - [ ] 10.1: Verify skill-registrar.js automatically discovers and registers new skill templates (no code changes needed)
  - [ ] 10.2: Verify lock file generation includes both research skill files
  - [ ] 10.3: Verify install summary includes skill count with research skill names
- [ ] Task 11: Validate and verify (AC: all)
  - [ ] 11.1: Verify all skill registration templates follow existing format (compare with scrum-create-project-docs/SKILL.md)
  - [ ] 11.2: Verify all framework files are properly copied to templates directory
  - [ ] 11.3: Verify {{framework_path}} placeholder is present in both SKILL.md files
  - [ ] 11.4: Verify no package.json changes needed (templates/ already in files array)

## Dev Notes

### Critical Context from Previous Stories

**Story 9-1 (researcher agent) key learnings:**
- Researcher agent exists at `scrum_workflow/agents/researcher.md` with complete definition
- Agent has `active_in: [research-technical, research-general]` for both research modes
- Agent uses WebSearch tool for external research (not Glob/Grep for local codebase)
- [Source: scrum_workflow/agents/researcher.md]

**Story 9-2 (research-technical command/workflow) key learnings:**
- Command exists at `scrum_workflow/commands/research-technical.md`
- Workflow exists at `scrum_workflow/workflows/research-technical.md`
- Command triggers: `/research-technical`, spawns: [researcher]
- Workflow implements Plan-Then-Execute with 6 phases
- [Source: scrum_workflow/commands/research-technical.md]
- [Source: scrum_workflow/workflows/research-technical.md]

**Story 9-3 (output template) key learnings:**
- Template exists at `scrum_workflow/templates/technical-research.md`
- Template includes YAML frontmatter with required fields
- Template defines sections for technical research output
- [Source: scrum_workflow/templates/technical-research.md]

**Story 9-4 (web research/swarm migration) key learnings:**
- Workflow enhanced with WebSearch integration and Swarm Migration pattern
- Workflow includes progress tracking and source verification
- [Source: scrum_workflow/workflows/research-technical.md]

**Stories 9-5 through 9-8 are NOT YET IMPLEMENTED:**
- Story 9-5: Reflection Loop - NOT YET DONE
- Story 9-6: Filesystem-Based State - NOT YET DONE
- Story 9-7: `/scrum-research general` Command & Workflow - NOT YET DONE
- Story 9-8: Incremental Update Mode - NOT YET DONE

**IMPORTANT**: For this story, create PLACEHOLDER files for research-general command, workflow, and general-research template. The full implementation will be done in Story 9-7.

### Installer Architecture -- Understanding the Pipeline

The installer follows this pipeline (defined in `src/core/installer.js`):

1. **resolveInstallPaths()** - Determines target paths for framework, skills, and output directories
2. **copyFramework()** - Copies `templates/scrum_workflow/` to target framework directory
3. **registerSkills()** - Discovers and processes skill registration templates
4. **createOutputDirs()** - Creates `_scrum-output` directories
5. **generateLockFile()** - Hashes all installed files and writes lock file

**Skill Registration Flow (src/core/skill-registrar.js):**

```javascript
// Discovers skill template directories
const skillNames = readdirSync(templateDir).filter((entry) => {
  return statSync(join(templateDir, entry)).isDirectory()
})

// For each platform, processes and copies skill templates
for (const skillName of skillNames) {
  const templatePath = join(templateDir, skillName, 'SKILL.md')
  const rawContent = readFileSync(templatePath, 'utf8')
  // Substitute {{framework_path}} with configured path
  const processedContent = rawContent.replaceAll('{{framework_path}}', config.frameworkPath)
  // Write to platform skills directory
}
```

**Key insight**: Adding new skill registrations is simply a matter of creating new directories under `templates/skill-registrations/`. The installer automatically discovers and processes them.

### Existing Skill Registration Templates -- Pattern to Follow

Existing skill registrations in `create-scrum-workflow/templates/skill-registrations/`:

| Skill Name | Template Location | Framework Reference |
|------------|-------------------|---------------------|
| scrum-create-project-context | skill-registrations/scrum-create-project-context/SKILL.md | commands/create-project-context.md |
| scrum-create-ticket | skill-registrations/scrum-create-ticket/SKILL.md | commands/create-ticket.md |
| scrum-dev-story | skill-registrations/scrum-dev-story/SKILL.md | commands/dev-story.md |
| scrum-refine-ticket | skill-registrations/scrum-refine-ticket/SKILL.md | commands/refine-ticket.md |
| scrum-create-project-docs | skill-registrations/scrum-create-project-docs/SKILL.md | commands/create-project-docs.md |
| scrum-create-architecture-docs | skill-registrations/scrum-create-architecture-docs/SKILL.md | commands/create-architecture-docs.md |

**Skill Registration Template Format (from scrum-create-project-docs/SKILL.md):**

```yaml
---
name: scrum-create-project-docs
description: "Scrum Workflow: Generate structured business logic documentation..."
---

Load and execute the framework command at `{{framework_path}}/commands/create-project-docs.md`.

The command file contains the full workflow orchestration including:
- Documentarian agent spawning for business logic analysis
- ...
```

### Files to Create

**Skill Registration Templates (new):**
1. `create-scrum-workflow/templates/skill-registrations/scrum-research-technical/SKILL.md`
2. `create-scrum-workflow/templates/skill-registrations/scrum-research-general/SKILL.md`

**Framework Files to Copy (existing, verbatim):**
1. `scrum_workflow/agents/researcher.md` -> `create-scrum-workflow/templates/scrum_workflow/agents/researcher.md`
2. `scrum_workflow/commands/research-technical.md` -> `create-scrum-workflow/templates/scrum_workflow/commands/research-technical.md`
3. `scrum_workflow/workflows/research-technical.md` -> `create-scrum-workflow/templates/scrum_workflow/workflows/research-technical.md`
4. `scrum_workflow/templates/technical-research.md` -> `create-scrum-workflow/templates/scrum_workflow/templates/technical-research.md`

**Framework Files to Create (placeholders for Story 9-7):**
5. `create-scrum-workflow/templates/scrum_workflow/commands/research-general.md` (placeholder)
6. `create-scrum-workflow/templates/scrum_workflow/workflows/research-general.md` (placeholder)
7. `create-scrum-workflow/templates/scrum_workflow/templates/general-research.md` (placeholder)

### Placeholder Files for Story 9-7

Since Story 9-7 (general research) is not yet implemented, create placeholder files that:
- Follow the same structure as technical research files
- Include "PLACEHOLDER" comments indicating full implementation is in Story 9-7
- Have valid SKILL.md format so the installer works correctly
- Reference the same researcher agent (already supports both modes)

### Package.json -- No Changes Needed

The `create-scrum-workflow/package.json` already includes:
```json
"files": [
  "bin/",
  "src/",
  "templates/"
]
```

The `templates/` glob already covers all new files under `templates/skill-registrations/` and `templates/scrum_workflow/`.

### Installer Behavior After This Story

After running `create-scrum-workflow install`:

1. **Framework files copied:**
   - `scrum_workflow/agents/researcher.md`
   - `scrum_workflow/commands/research-technical.md`
   - `scrum_workflow/commands/research-general.md`
   - `scrum_workflow/workflows/research-technical.md`
   - `scrum_workflow/workflows/research-general.md`
   - `scrum_workflow/templates/technical-research.md`
   - `scrum_workflow/templates/general-research.md`

2. **Skill shims registered (per platform):**
   - `.{platform}/skills/scrum-research-technical/SKILL.md`
   - `.{platform}/skills/scrum-research-general/SKILL.md`

3. **Lock file entries:**
   - Hashes for all framework files
   - Hashes for both skill registration files

4. **Install summary output:**
   ```
   Installation summary:
     Framework path:   /path/to/project/scrum_workflow
     Files copied:     N
     Skills registered: 8 skills x 1 platform(s)
     Files tracked:    M
     Lock file:        /path/to/project/.scrum-workflow-lock.json
   ```

### Project Structure Notes

- Follow existing patterns for skill registration templates
- Use verbatim copy for existing framework files (no modifications)
- Placeholder files should be valid SKILL.md format but marked as incomplete
- No changes to installer code (skill-registrar.js auto-discovers new skills)
- No changes to package.json (templates/ already in files array)

### References

- [Source: create-scrum-workflow/templates/skill-registrations/scrum-create-project-docs/SKILL.md] -- Template format to follow
- [Source: create-scrum-workflow/templates/skill-registrations/scrum-dev-story/SKILL.md] -- Template format to follow
- [Source: create-scrum-workflow/src/core/skill-registrar.js] -- Skill registration logic (auto-discovery)
- [Source: create-scrum-workflow/src/core/installer.js] -- Installer pipeline
- [Source: create-scrum-workflow/package.json] -- Package configuration (no changes needed)
- [Source: scrum_workflow/agents/researcher.md] -- Researcher agent definition to copy
- [Source: scrum_workflow/commands/research-technical.md] -- Technical research command to copy
- [Source: scrum_workflow/workflows/research-technical.md] -- Technical research workflow to copy
- [Source: scrum_workflow/templates/technical-research.md] -- Technical research template to copy
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 9, Story 9.9] -- Story requirements and acceptance criteria
- [Source: _bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md] -- Previous story context
- [Source: _bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md] -- Previous story context
- [Source: _bmad-output/implementation-artifacts/9-3-technical-research-output-template.md] -- Previous story context
- [Source: _bmad-output/implementation-artifacts/9-4-web-research-integration-and-swarm-migration-pattern.md] -- Previous story context

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
