# Scrum Framework - Claude Code Adapter

## Framework Location

The Scrum framework is located at: `{framework_path}`

The `framework_path` is set in `scrum_workflow/config.yaml` at the project root.

**Note:** `{framework_path}` is a variable placeholder. When using this framework, replace it with the actual absolute path to your framework installation.

Example:
```yaml
# In project-root/config.yaml
framework_path: /Users/username/shared/scrum_workflow
```

## Usage

This adapter contains only references to framework command files. When you invoke a slash command, load the corresponding command file from:

```
{framework_commands}/{command-name}.md
```

All business logic, agent definitions, and templates live in the shared framework.
This adapter contains only references — no logic.

## Platform Switching

To switch platforms, change the `platform` field in `scrum_workflow/config.yaml`.

**Valid platform values:**
- `claude-code` - Anthropic Claude Code (current)
- `github-copilot` - GitHub Copilot
- `opencode` - OpenCode
- `windsurf` - Windsurf

No file changes required — the adapter pattern ensures platform independence.

## Adapter Contract

This adapter follows the minimal adapter pattern:

1. **Instruction File** (this file): Tells the AI platform where the framework lives and how to use it
2. **Command Registration** (`.claude/skills/*.md`): Maps slash commands to framework command files

**Key Principle:** Adapters are pure references pointing to framework command files. No business logic is duplicated in adapter files.

All command logic lives in the shared framework.

This is where workflow logic lives in the framework.

## Registered Commands

The following slash commands are registered via skill files in `.claude/skills/`:

- `/create-project-context` - Analyze codebase and generate project context
- `/create-ticket` - Create structured story from natural language
- `/refine-ticket` - Multi-agent refinement with Architect/Dev/QA perspectives
- `/dev-story` - Implement story following specification

Each skill file references the corresponding framework command file at:
```
{framework_commands}/{command-name}.md
```
