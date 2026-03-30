# Platform Adapter Contract

This document specifies the interface contract for platform adapters in the Scrum Workflow framework. Platform adapters enable the framework to work across multiple AI coding platforms (Claude Code, GitHub Copilot, OpenCode, Windsurf) without workflow changes.

## Adapter Contract: Two Elements

Each platform adapter consists of exactly two elements:

### 1. Instruction File

**Purpose:** Tells the AI platform where the framework lives and how to use it.

**Location:** Platform-specific directory (e.g., `.claude/instructions.md`)

**Requirements:**
- Document the `framework_path` variable and how it is resolved
- Specify how framework command files are loaded
- Contain NO workflow logic — pure metadata and path references only
- Document platform switching procedure (config change only)

**Template Structure:**
```markdown
# Scrum Workflow Framework - {Platform} Adapter

## Framework Location
The framework is located at: {framework_path}
The framework_path is set in config.yaml

## Usage
This adapter references framework command files.
Load commands from: {framework_path}/scrum_workflow/commands/{command-name}.md

## Platform Switching
To switch platforms, change the `platform` field in config.yaml.
```

### 2. Command Registration

**Purpose:** Maps slash commands to framework command files using the platform's native mechanism.

**Format:** SKILL.md files with minimal content

**Requirements:**
- YAML frontmatter: `name`, `trigger`, `description`, `framework_command`
- Body: Brief description and framework command file path
- NO workflow logic or implementation details
- Pure reference to corresponding framework command file

**Template Structure:**
```yaml
---
name: {command-name}
trigger: /{command-name}
description: {brief description}
framework_command: {framework_path}/scrum_workflow/commands/{command-name}.md
---

# {Command Display Name}

This skill registers the `{command-name}` command from the Scrum Workflow framework.

**Framework Command File:** `{framework_path}/scrum_workflow/commands/{command-name}.md`

Load the framework command file to execute this command.
```

## Framework Path Reference

**Definition:** `framework_path` is an absolute path reference in project-level `config.yaml` that points to the shared framework installation.

**Configuration:**
```yaml
# In project-root/config.yaml
framework_path: /absolute/path/to/scrum_workflow
platform: claude-code
```

**Resolution:**
1. AI platform reads `framework_path` from config
2. Adapter files reference `{framework_path}` as a variable
3. At runtime, the platform resolves the absolute path
4. Framework files are loaded via absolute path references

**Benefits:**
- Single source of truth for framework location
- Platform switching requires only config change
- No hardcoded paths in adapter files
- Copy-based versioning without breaking references

## Platform-Specific Registration

| Platform | Instruction File | Command Registration |
|---|---|---|
| **Claude Code** | `.claude/instructions.md` | Skills in `.claude/skills/` (SKILL.md format) |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Custom agents in `.github/agents/` |
| **OpenCode** | `.opencode/config` | Agent files in `.opencode/agents/` |
| **Windsurf** | `.windsurf/rules` | Rules-based configuration |

## Adapter Design Principles

### 1. Minimal Adapter Pattern

Adapters contain ONLY:
- Path references (framework_path, command file paths)
- Metadata (command names, descriptions)
- Usage instructions

Adapters MUST NOT contain:
- Workflow logic
- Agent definitions
- Orchestration code
- Implementation details

### 2. Platform Independence

All workflow logic lives in the shared framework (`scrum_workflow/`).
Adapters are thin bindings that reference framework files.

**Consequence:** Adding a new platform requires only creating a new adapter directory — no framework changes.

### 3. Pure Reference Convention

Adapter files use `{framework_path}` as a variable placeholder.
The AI platform resolves this to the absolute path at runtime.

**Example:**
```
Adapter: framework_command: {framework_path}/scrum_workflow/commands/scrum-create-ticket.md
Resolved: framework_command: /Users/user/shared/scrum_workflow/commands/scrum-create-ticket.md
```

## Platform Switching Procedure

**To switch platforms:**

1. Change `platform` field in `scrum_workflow/config.yaml`
2. No other changes required

**Example:**
```yaml
# Switch from Claude Code to GitHub Copilot
platform: github-copilot  # was: claude-code
```

**Verification:**
- No workflow files need to be modified
- No adapter file changes required
- Framework command files remain unchanged
- Only the platform field in config changes

## Adapter Contract Validation

**Validation Checklist:**

1. Instruction file exists and documents framework_path
2. Command registration files exist for all MVP commands
3. Each skill file references exactly one framework command file
4. No workflow logic in any adapter file
5. Config.yaml contains platform field with valid value
6. Platform switching requires only config.yaml change

**Automated Tests:**
- File existence tests (instruction file, skill files)
- Content validation tests (SKILL.md format, YAML frontmatter)
- Reference verification tests (framework_command field present)
- Negative tests (no workflow keywords in adapter files)

## Implementation Notes

### For Claude Code Adapter (Story 1.3)

**Files Created:**
- `.claude/instructions.md` - Adapter instruction file
- `.claude/skills/scrum-create-project-context/SKILL.md` - Command registration
- `.claude/skills/scrum-create-ticket/SKILL.md` - Command registration
- `.claude/skills/scrum-refine-ticket/SKILL.md` - Command registration
- `.claude/skills/scrum-dev-story/SKILL.md` - Command registration

**Verification:**
- All files use `{framework_path}` placeholder
- No workflow logic in any adapter file
- config.yaml already has `platform: claude-code` field (from Story 1.1)

### For Future Platform Adapters

To add a new platform (e.g., GitHub Copilot):

1. Create `.github/copilot-instructions.md` with framework_path documentation
2. Create `.github/agents/{command-name}.md` files for each command
3. Add platform value to config.yaml documentation
4. No framework changes required

## References

**Source Documents:**
- Architecture Decision Document: [Source: _scrum-output/planning-artifacts/architecture.md#Decision-6-Platform-Adapter-Contract]
- Framework Distribution: [Source: _scrum-output/planning-artifacts/architecture.md#Decision-7-Framework-Distribution-Path-Referencing]
- Three-Layer Separation: [Source: _scrum-output/planning-artifacts/architecture.md#Three-Layer-Separation]

**Related Stories:**
- Story 1.3: Platform Adapter Contract and Claude Code Adapter (implementation)
- Story 1.1: Framework directory structure with config.yaml platform field
