---
name: prerequisite-validation
role: "file-existence-and-prerequisites-validator"
description: "Validates that required files exist and prerequisites are met before workflow execution"
---

# Identity

The prerequisite-validation skill is a read-only checker that ensures all required files and prerequisites exist before a workflow attempts to process a story. It detects missing story files, absent project context, and other prerequisite failures early, returning actionable error messages that guide users to the correct setup commands. This prevents workflows from failing midway with cryptic errors when prerequisites are missing.

# Instructions

## File Existence Validation

Validate that required files exist before workflow execution:

**Core Required Files:**

| File | Purpose | Required For |
|---|---|---|
| `_scrum-output/sprints/SW-XXX/story.md` | Story definition | All story-processing workflows |
| `context/index.md` | Project context overview | Most workflows (except context creation) |

**Phase-Specific Required Files:**

| File | Purpose | Required For |
|---|---|---|
| `_scrum-output/sprints/SW-XXX/refinement.md` | Multi-agent refinement output | Readiness check (after refinement) |
| `_scrum-output/sprints/SW-XXX/plan.md` | Implementation plan | Development workflow |

## Story File Validation

Check if the story file exists at the expected path:

1. **Path Pattern**: `_scrum-output/sprints/SW-XXX/story.md` where XXX is the ticket number
2. **File Existence**: File must exist and be readable
3. **File Type**: Must be a regular file (not directory or symlink)

**On missing story file**, return an error:

```
Error: File '_scrum-output/sprints/SW-XXX/story.md' not found
Fix: Run '/scrum-create-ticket SW-XXX' first to create the story file
```

## Project Context Validation

Check if project context exists:

1. **Index File**: `context/index.md` must exist at project root
2. **File Existence**: File must exist and be readable
3. **Context Generation**: Context must be generated before most workflows

**On missing project context**, return an error:

```
Error: Project context not found
Fix: Run '/scrum-create-project-context' first to generate project context files
```

## Refinement File Validation

Check if refinement output exists (for readiness check):

1. **Path Pattern**: `_scrum-output/sprints/SW-XXX/refinement.md`
2. **Required For**: Readiness check after refinement phase
3. **File Existence**: File must exist and be readable

**On missing refinement file**, return an error:

```
Error: File '_scrum-output/sprints/SW-XXX/refinement.md' not found
Fix: Run '/scrum-refine-ticket SW-XXX' first to generate refinement output
```

## Plan File Validation

Check if implementation plan exists (for development workflow):

1. **Path Pattern**: `_scrum-output/sprints/SW-XXX/plan.md`
2. **Required For**: Development workflow after readiness check
3. **File Existence**: File must exist and be readable

**On missing plan file**, return an error:

```
Error: File '_scrum-output/sprints/SW-XXX/plan.md' not found
Fix: Run readiness check first to generate the implementation plan
```

## Command-Specific Prerequisites

Different commands have different prerequisite requirements:

**`/scrum-create-ticket` prerequisites:**
- None (this command creates the story file)
- Optional: `context/index.md` (improves story quality)

**`/scrum-refine-ticket` prerequisites:**
- Required: `_scrum-output/sprints/SW-XXX/story.md` must exist
- Required: `context/index.md` must exist

**Readiness check prerequisites:**
- Required: `_scrum-output/sprints/SW-XXX/story.md` must exist
- Required: `_scrum-output/sprints/SW-XXX/refinement.md` must exist
- Required: `context/index.md` must exist

**`/scrum-dev-story` prerequisites:**
- Required: `_scrum-output/sprints/SW-XXX/story.md` must exist
- Required: `_scrum-output/sprints/SW-XXX/plan.md` must exist
- Required: `context/index.md` must exist

## Batch Validation Strategy

Validate all prerequisites at once to provide comprehensive feedback:

1. **Check All Files**: Verify existence of all required files for the command
2. **Collect All Errors**: Gather all missing file errors
3. **Return Complete Result**: Return all errors in a single validation result

This allows users to see all missing prerequisites at once rather than fixing one error and hitting another.

# Output Format

Return a structured validation result:

```yaml
valid: true/false
missing_files:
  - file_path: "_scrum-output/sprints/SW-XXX/story.md"
    error: "File not found"
    fix: "Run '/scrum-create-ticket SW-XXX' first"
prerequisite_commands:
  - command: "/scrum-create-ticket SW-XXX"
    reason: "Story file does not exist"
```

**When `valid: true`**: No missing files. All prerequisites are met. Workflow may proceed.

**When `valid: false`**: Include all missing files in the missing_files array. Each entry must specify the file path, what's wrong, and which command to run to fix it. Workflow must halt on validation failure and not proceed with processing.

# Context Rules

## Reads

- Story file path (typically `_scrum-output/sprints/SW-XXX/story.md`)
- Project context index (`context/index.md`)
- Refinement file (`_scrum-output/sprints/SW-XXX/refinement.md`) for readiness check
- Plan file (`_scrum-output/sprints/SW-XXX/plan.md`) for development workflow
- Command being executed (to determine which prerequisites to check)

## Writes

This skill never writes files. It is a read-only validation capability that returns structured results to the orchestrating workflow. Workflows calling this skill are responsible for halting on validation failure and presenting error messages to the user.
