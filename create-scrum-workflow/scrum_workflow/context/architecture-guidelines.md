# scrum_workflow Architecture Guidelines

## Overview

The scrum_workflow framework is a **declarative agent orchestration framework** designed to help development teams manage their workflow through AI coding assistants. The framework is built as pure YAML and Markdown files that are interpreted by AI coding assistants at runtime, with no compiled code or build steps.

## SDK/Framework Pattern

The framework implements the **SDK/Framework Pattern**, treating the scrum_workflow directory as an independent, tool-agnostic module. This design enables:

- **Tool Independence**: The framework logic is separated from specific AI coding assistant implementations
- **Version Control**: The framework can be versioned independently via copy-based updates
- **Reusability**: The same framework can be shared across multiple projects
- **Maintainability**: Updates to the framework can be distributed by copying new versions

## Three-Layer Separation

The framework architecture is organized into three distinct layers:

### 1. Framework Layer (`scrum_workflow/`)

The shared, tool-agnostic framework containing:
- **Agent definitions**: Role specifications for architect, developer, and qa agents
- **Commands**: Slash command definitions for workflow operations
- **Workflows**: Step-by-step execution details for each command
- **Skills**: Reusable workflow skills and capabilities
- **Templates**: Output templates for all workflow phases
- **Data**: Reference data in YAML format
- **Context**: Framework-level standards and guidelines
- **Default configuration**: Platform settings and token budgets

**Critical Principle**: The framework layer contains NO project-specific state. All sprint state lives in the project, not in the shared framework. This enables the framework to be versioned independently.

### 2. Adapter Layer (`.claude/`, `.github/`, etc.)

Per-project tool-specific bindings that reference the shared framework:
- **Platform adapters**: Tool-specific implementations of framework commands
- **Configuration**: Project-specific configuration overrides
- **Bindings**: Integration points between the framework and AI coding assistants

The adapter layer is responsible for:
- Translating framework commands to platform-specific operations
- Managing project-specific configuration and overrides
- Providing tool-specific implementations of framework interfaces

### 3. State Layer (`sprints/`, config.yaml override)

Per-project sprint data and configuration overrides:
- **Sprint data**: Story files, refinement records, review findings
- **Configuration overrides**: Project-specific settings that override defaults
- **Execution state**: Current status of stories, tasks, and workflows

The state layer contains:
- All project-specific data and state
- Sprint tracking and story status
- Configuration overrides specific to the project

## Declarative Agent Orchestration

The framework follows a **declarative approach** to agent orchestration:

- **YAML/Markdown declares WHAT**: Framework files specify what should be done
- **Platform determines HOW**: Each AI coding assistant platform determines implementation
- **Runtime interpretation**: AI assistants interpret framework files at runtime
- **No compilation**: Pure text files that can be read and understood by humans and AI

This approach enables:
- **Transparency**: All workflow logic is visible and editable
- **Flexibility**: Easy to modify and extend without recompilation
- **Portability**: Framework can work across different AI coding platforms
- **Maintainability**: Simple text files that can be version controlled

## Platform Abstraction

The framework provides **platform abstraction** through adapters:

1. **Framework Interface**: Common command and workflow definitions
2. **Platform Adapters**: Tool-specific implementations
3. **Configuration**: Platform-specific settings and token budgets

Benefits:
- **Multi-platform support**: Same framework works with different AI coding assistants
- **Consistent experience**: Similar workflow across different tools
- **Platform optimization**: Each adapter can leverage platform-specific features

## Framework Distribution

The framework uses **copy-based distribution**:

1. **Framework Path**: Projects reference the framework via a path
2. **Copy-Based Updates**: New versions are copied to update
3. **Version Tracking**: Framework version tracked in config.yaml
4. **Independent Updates**: Framework can be updated without affecting project state

Advantages:
- **Simplicity**: No package managers or build tools required
- **Transparency**: All framework code is visible and editable
- **Control**: Projects control when to update the framework
- **Isolation**: Framework updates don't affect project state

## Architecture Principles

1. **Separation of Concerns**: Clear boundaries between framework, adapter, and state layers
2. **Declarative Specification**: YAML and Markdown declare what, not how
3. **Tool Agnosticism**: Framework is independent of specific AI coding assistants
4. **Zero Dependencies**: No external packages or build tools required
5. **Convention Over Configuration**: Sensible defaults with minimal required configuration
6. **Copy-Based Distribution**: Simple file copying for framework updates
7. **Framework Independence**: No project-specific state in framework layer
