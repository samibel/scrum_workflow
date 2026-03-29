# scrum_workflow Standards and Conventions

## Overview

This document defines the coding standards, naming conventions, and file structure patterns used throughout the scrum_workflow framework. Following these standards ensures consistency and maintainability across the framework.

## Naming Conventions

### File and Directory Naming

**All files and directories MUST use `kebab-case`:**

- **Examples**: `create-ticket.md`, `architecture-guidelines.md`, `scrum_workflow/`
- **Rules**:
  - All lowercase letters
  - Words separated by hyphens (`-`)
  - No spaces in filenames
  - No camelCase or PascalCase
  - No underscores except in YAML field names

**Rationale**: kebab-case is the standard convention for YAML and Markdown files, ensuring readability and cross-platform compatibility.

### YAML Field Naming

**All YAML fields MUST use `snake_case`:**

- **Examples**: `schema_version`, `active_agents`, `token_budgets`, `framework_version`
- **Rules**:
  - All lowercase letters
  - Words separated by underscores (`_`)
  - No hyphens in field names
  - Consistent across all YAML files (config, frontmatter, data files)

**Rationale**: snake_case is the standard convention for YAML and follows common practice in configuration files.

### Status Values

**Status values MUST use `kebab-case`:**

- **Epic Status**: `backlog`, `in-progress`, `done`
- **Sprint Tracking Status** (sprint-status.yaml): `backlog`, `ready-for-dev`, `in-progress`, `review`, `done`
- **Story File Status** (story.md frontmatter): `draft`, `refinement`, `ready`, `in-dev`, `in-review`, `done` (see [Story Status State Machine](#story-status-state-machine))
- **Retrospective Status**: `optional`, `done`

**Rationale**: Consistent with file naming conventions and YAML field naming.

### Ticket Format

**Ticket format: `SW-XXX` where XXX is zero-padded 3-digit number:**

- **Examples**: `SW-001`, `SW-042`, `SW-103`
- **Rules**:
  - Prefix `SW-` (scrum_workflow)
  - Three-digit number with leading zeros
  - Sequential numbering starting from 001

## File Format Standards

### YAML File Conventions

**Structure Rules:**

1. **Comments**: Use `#` for comments, place above the field being documented
2. **String Values**: Use quotes for strings with special characters
3. **Dates**: Use ISO 8601 format (`YYYY-MM-DD`)
4. **Arrays**: Use dash (`-`) prefix for array items
5. **Indentation**: Use 2 spaces for indentation (no tabs)
6. **Line Length**: Keep lines under 100 characters when practical

**Example:**

```yaml
# Configuration field with documentation
field_name: "value with special chars"
another_field: another_value

# Array example
items:
  - first_item
  - second_item
  - third_item

# Date example
created_date: 2026-03-25
```

### Markdown File Conventions

**Structure Rules:**

1. **Headings**:
   - Single `#` for document title
   - `##` for major sections
   - `###` for subsections
   - No heading level deeper than `####`

2. **Lists**:
   - Use `-` for unordered lists
   - Use numbered lists (`1.`, `2.`) for ordered sequences
   - Indent nested lists with 2 spaces

3. **Code Blocks**:
   - Use triple backticks (```) with language identifier
   - Specify language for syntax highlighting (yaml, markdown, etc.)

4. **Emphasis**:
   - Use `**bold**` for strong emphasis
   - Use `*italic*` for mild emphasis
   - Avoid underlining (not standard in Markdown)

5. **Links**:
   - Use `[text](url)` format for links
   - Use descriptive link text

**Example:**

```markdown
# Document Title

## Major Section

Description of the major section.

### Subsection

- First item
- Second item
  - Nested item
- Third item

## Code Example

\`\`\`yaml
field_name: value
\`\`\`
```

### SKILL.md Format

**Structure:**

1. **YAML Frontmatter**: Metadata about the skill/command
2. **Markdown Body**: Description and implementation details

**Frontmatter Fields:**

```yaml
---
name: skill-name
description: Brief description
version: 1.0.0
author: Framework Team
---
```

**Body Structure:**

```markdown
# Skill Name

Brief description of what this skill does.

## Usage

How to use this skill.

## Implementation

Implementation details and logic.
```

## File Structure Patterns

### Directory Organization

**Framework Root (`scrum_workflow/`):**

```
scrum_workflow/
├── agents/              # Agent role definitions
├── commands/            # Slash command definitions
├── workflows/           # Step-by-step execution details
├── skills/              # Workflow skills and capabilities
├── templates/           # Output templates
├── context/             # Framework-level standards
├── data/                # Reference data (YAML)
└── config.yaml          # Default configuration
```

**Project Structure:**

```
project-root/
├── scrum_workflow/      # Framework (shared)
├── .claude/             # Claude Code adapter
├── .github/             # GitHub Copilot adapter
├── sprints/             # Sprint state (project-specific)
└── config.yaml          # Configuration overrides
```

### File Placement Rules

1. **Agent definitions**: Place in `agents/` with `kebab-case.md` naming
2. **Command definitions**: Place in `commands/` with `kebab-case.md` naming
3. **Workflow definitions**: Place in `workflows/` with `kebab-case.md` naming
4. **Skill definitions**: Place in `skills/<skill-category>/SKILL.md`
5. **Templates**: Place in `templates/` with `kebab-case.md` naming
6. **Context files**: Place in `context/` with `kebab-case.md` naming
7. **Data files**: Place in `data/` with `kebab-case.yaml` naming

## Error and Recovery Patterns

### Status-Based Recovery

**Principle**: Use status values to track and recover from errors

1. **Error Detection**: Identify failures through status checks
2. **Status Update**: Mark items with appropriate error status
3. **Recovery**: Use status to determine recovery actions
4. **Verification**: Confirm recovery before proceeding

**Example:**

```yaml
story_status: in-progress
last_task: "create-configuration"
error_detected: true
error_message: "Invalid YAML syntax"
recovery_action: "fix-syntax-and-retry"
```

### Actionable Error Messages

**Principle**: Error messages should provide clear next steps

1. **What Happened**: Clear description of the error
2. **Why It Happened**: Root cause when available
3. **How to Fix**: Specific recovery steps
4. **Prevention**: How to avoid similar errors

**Example:**

```
Error: Invalid YAML syntax in config.yaml at line 15
Issue: Unterminated string value
Fix: Add closing quote or remove newlines within the string
Prevention: Use YAML block scalar (|) for multi-line strings
```

## Code Quality Standards

### Documentation Requirements

1. **All YAML fields**: Document with inline comments
2. **Complex logic**: Explain in Markdown documentation
3. **Configuration options**: Document purpose, default, and valid values
4. **Workflow steps**: Document purpose and expected outcomes

### Consistency Requirements

1. **Naming**: Follow kebab-case (files) and snake_case (YAML) conventions
2. **Formatting**: Consistent indentation and spacing
3. **Structure**: Follow defined file structure patterns
4. **Documentation**: Document all non-obvious implementations

### Testing Standards

1. **Manual Testing**: Verify all YAML files are valid
2. **Structure Verification**: Confirm directory structure matches specification
3. **Naming Compliance**: Check all files follow naming conventions
4. **Integration Testing**: Verify framework works with target platform

## Version Control Standards

### Commit Messages

**Format**: `<type>: <description>`

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Examples**:
- `feat: add create-ticket command`
- `fix: correct YAML syntax in config`
- `docs: update architecture guidelines`

### File Tracking

1. **Framework Files**: Track all framework files in version control
2. **Generated Files**: Exclude generated files from version control
3. **Configuration**: Track default config, but allow project overrides
4. **Documentation**: Track all documentation files

## Story Status State Machine

### Status Values

The story status state machine defines the lifecycle of a story from creation to completion. There are exactly **6 valid status values**:

| Status | Set By | Guard | Meaning |
|---|---|---|---|
| `draft` | /scrum-create-ticket | -- | Story created, not yet refined |
| `refinement` | /scrum-refine-ticket | status == draft | Multi-agent refinement in progress |
| `ready` | Readiness check | PASS result | Spec approved, implementation allowed |
| `in-dev` | /scrum-dev-story | status == ready (FR17) | Implementation in progress |
| `in-review` | /scrum-dev-story review | status == in-dev | Single review pass (MVP) |
| `done` | User approval | explicit sign-off (FR28) | Human approval complete |

### Valid Transitions

All transitions are explicit and guarded. No implicit status changes are permitted.

| From | To | Trigger | Guard Condition |
|---|---|---|---|
| `draft` | `refinement` | /scrum-refine-ticket | status == draft |
| `refinement` | `ready` | Readiness check | Readiness check result == PASS |
| `refinement` | `draft` | Readiness check | Readiness check result == FAIL |
| `ready` | `in-dev` | /scrum-dev-story | status == ready |
| `in-dev` | `in-review` | /scrum-dev-story review | status == in-dev |
| `in-review` | `done` | User approval | Explicit user sign-off (FR28) |

### State Transition Diagram

```
                          FAIL
                   ┌──────────────┐
                   │              │
                   ▼              │
               ┌───────┐    ┌────────────┐    ┌───────┐    ┌────────┐    ┌───────────┐    ┌──────┐
               │ draft │───▶│ refinement │───▶│ ready │───▶│ in-dev │───▶│ in-review │───▶│ done │
               └───────┘    └────────────┘    └───────┘    └────────┘    └───────────┘    └──────┘
                  /scrum-      PASS via          /scrum-      /scrum-        User
                  refine-      readiness         dev-story    dev-story      approval
                  ticket       check                          review
                               check                                        (FR28)
```

### Guard Enforcement Rules

Commands **MUST** verify guard conditions before executing any status transition. A command that receives a story in an unexpected status **MUST** reject the operation with an actionable error message.

**Enforcement principles:**

1. **Pre-check required**: Every command checks current status before modifying it
2. **No skipping phases**: Transitions only follow the defined paths above
3. **Atomic transitions**: Status is updated only after the operation succeeds
4. **Recovery via status**: On interruption, the current `status` field in frontmatter determines where to resume

### Error Message Templates

Commands **MUST** use actionable error messages following these templates when guard conditions fail:

| Situation | Error Message Pattern |
|---|---|
| Wrong status | `"Story SW-XXX is in status 'current', but '/command' requires 'required'"` |
| Missing file | `"File 'sprints/SW-XXX/story.md' not found. Run '/scrum-create-ticket SW-XXX' first"` |
| Invalid frontmatter | `"Invalid frontmatter in story.md: field 'status' missing"` |
| Interrupted workflow | Recovery: read `status` from frontmatter, resume from that phase |

**Examples:**

```
Error: Story SW-042 is in status 'draft', but '/scrum-dev-story' requires 'ready'
Fix: Run '/scrum-refine-ticket SW-042' to refine the story, then pass readiness check

Error: File 'sprints/SW-101/story.md' not found. Run '/scrum-create-ticket SW-101' first
Fix: Create the story file before attempting refinement

Error: Invalid frontmatter in story.md: field 'status' missing
Fix: Ensure the story file has valid YAML frontmatter with all required fields
```

## Sprint Folder Conventions

### Folder Naming

Sprint ticket folders use the pattern `sprints/SW-XXX/` where `XXX` is a zero-padded 3-digit ticket number.

**Rules:**

- **Prefix**: `SW-` (scrum_workflow project key)
- **Number**: 3-digit, zero-padded (e.g., `001`, `042`, `103`)
- **Location**: All ticket folders reside under the `sprints/` directory at project root
- **Naming**: kebab-case consistent with all other directory naming conventions

**Examples:**

```
sprints/
├── SW-001/
├── SW-002/
├── SW-042/
└── SW-103/
```

### Allowed Files Per Ticket Folder

Each ticket folder `sprints/SW-XXX/` may contain the following files:

| File | Purpose | Created By | Write Boundary |
|---|---|---|---|
| `story.md` | Story definition with YAML frontmatter and acceptance criteria | /scrum-create-ticket | /scrum-create-ticket, /scrum-refine-ticket (update), Readiness check (status), Approval (status -> done) |
| `refinement.md` | Multi-agent refinement feedback and analysis | /scrum-refine-ticket | /scrum-refine-ticket only |
| `plan.md` | Implementation plan generated from readiness check | Readiness check | Readiness check only |
| `review-N.md` | Code review findings (N = review number, e.g., `review-1.md`) | /scrum-dev-story | /scrum-dev-story only |
| `approval.md` | Human approval record and sign-off | Approval workflow | Approval workflow only |

### Write Boundary Rules

Each command has strict write boundaries. A command may only create or modify files it owns:

| Command | May Write | May NOT Write |
|---|---|---|
| /scrum-create-ticket | `story.md` | `refinement.md`, `plan.md`, `review-*.md`, `approval.md` |
| /scrum-refine-ticket | `refinement.md`, `story.md` (update) | `plan.md`, `review-*.md`, `approval.md` |
| Readiness check | `plan.md`, `story.md` (status update) | `refinement.md`, `review-*.md`, `approval.md` |
| /scrum-dev-story | Code files, `review-1.md` | `story.md`, `refinement.md`, `plan.md`, `approval.md` |
| Approval | `approval.md`, `story.md` (status -> done) | `refinement.md`, `plan.md`, `review-*.md` |

### Markdown-Only Constraint

**All story artifacts MUST be standard Markdown readable without the tool (FR33).**

- Files use `.md` extension and follow standard Markdown syntax
- YAML frontmatter follows standard YAML conventions (parseable by any YAML parser)
- No proprietary formats, binary files, or tool-specific encoding
- Any developer can read and understand story artifacts using any text editor or Markdown viewer
- This ensures portability and prevents vendor lock-in

## Schema Versioning

### Purpose

The `schema_version` field in story file YAML frontmatter enables backwards-compatible evolution of the story file format. It is always the **first field** in the frontmatter block.

**Current version:** `schema_version: 1`

### Backwards-Compatibility Rules

1. **New fields are ALWAYS optional**: Any field added in future versions must have a sensible default value documented in this section
2. **Old files MUST work without migration**: A story file created with `schema_version: 1` must be fully functional with any future version of the workflow tooling (NFR15)
3. **No field removal**: Once a field is part of the schema, it cannot be removed in future versions
4. **No field renaming**: Field names are permanent once introduced
5. **No type changes**: A field's value type cannot change between versions

### Version Bump Criteria

The `schema_version` number is incremented **only** when the structure of the schema changes:

- **Does increment**: Adding a new required section to the Markdown body, changing frontmatter field ordering requirements
- **Does NOT increment**: Adding a new optional field with a default value, adding documentation, fixing typos

### Field Defaults for Version 1

| Field | Required | Default (if absent) | Notes |
|---|---|---|---|
| `schema_version` | Yes | `1` | First field in frontmatter |
| `ticket` | Yes | -- | No default, must be provided |
| `title` | Yes | -- | No default, must be provided |
| `status` | Yes | `draft` | Initial status for new stories |
| `estimation` | No | `null` | Optional estimation value |
| `created` | Yes | Current date (ISO 8601) | Set at creation time |
| `updated` | Yes | Current date (ISO 8601) | Updated on every modification |

## Agent Output Format Standards

### Multi-Agent Refinement Perspective Format

All agent perspectives in the refinement workflow MUST follow the standard table-based output format defined below. This format ensures consistent parsing, counting, filtering, and synthesis by the coordinator.

### Standard Perspective Structure

Each agent perspective MUST include:

```
## [Agent-Name] Perspective

### Findings

| # | Finding | Severity | Category |
|---|---------|----------|----------|
| 1 | [Finding description] | [Severity level] | [Category] |
| 2 | [Finding description] | [Severity level] | [Category] |
| ... | ... | ... | ... |

### Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
...
[Recommendation N]

### Proposed Acceptance Criteria

- [ ] [Acceptance criterion 1]
- [ ] [Acceptance criterion 2]
...
- [ ] [Acceptance criterion N]
```

### Table Column Definitions

The Findings table MUST use these exact columns:

| Column | Description | Valid Values |
|---|---|---|
| `#` | Sequential finding number | Integer (1, 2, 3, ...) |
| `Finding` | Description of the finding | Clear, concise text |
| `Severity` | Priority level | Critical, Major, Minor |
| `Category` | Type of finding | Context-dependent (e.g., Security, Architecture, Performance, Dependency, Coverage, Clarity) |

### Agent-Specific Focus Areas

Each agent MUST focus on their area of expertise:

**Architect Agent:**
- Architectural risks and scalability concerns
- Design patterns and system integration
- Security and performance implications
- Dependencies and maintainability
- Affected design decisions

**Developer Agent:**
- Technical feasibility and implementation complexity
- Library dependencies and external services
- Code quality and technical debt
- Testing strategy and documentation needs
- Implementation concerns

**QA Agent:**
- Acceptance criteria clarity and testability
- Edge cases and error scenarios
- Test coverage and testing tools
- Integration testing and regression risk
- User experience and data validation

### Context Window Compliance

Each agent's output MUST fit within a single LLM context window of the target platform (NFR11).

**Token Budget Configuration:**
- Platform-specific budgets are defined in `config.yaml` under `token_budgets`
- Each agent's `max_tokens` field in frontmatter MUST be set according to the platform's `sub_agent` budget
- Current configuration: `max_tokens: 2000` (for claude-code platform)

### Perspective Attribution

Each perspective MUST be:
- Clearly attributed to its role with `## [Agent-Name] Perspective` header
- Displayed separately from other perspectives (no merging)
- Presented sequentially in the refinement workflow
- Generated independently without seeing other agents' outputs

## Best Practices

1. **Readability**: Prioritize human readability over cleverness
2. **Simplicity**: Keep implementations simple and straightforward
3. **Consistency**: Follow established patterns and conventions
4. **Documentation**: Document anything that isn't self-explanatory
5. **Testing**: Verify all changes before committing
6. **Review**: Have changes reviewed before merging
7. **Version Control**: Commit frequently with clear messages
