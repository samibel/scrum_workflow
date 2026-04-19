# Architecture - Scrum Workflow Framework (scrum_workflow)

**Date:** 2026-04-03
**Part:** Framework Definitions
**Type:** Markdown-as-Code Library

## Executive Summary

The scrum_workflow framework is a Markdown-driven, multi-agent scrum development framework for AI coding assistants. The entire framework is defined as structured Markdown files that are interpreted by AI platforms like Claude Code, Cursor, and Windsurf. It implements a complete scrum workflow: story creation, multi-agent refinement, validation, implementation, code review, and approval.

## Technology Stack

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| Primary Language | Markdown | N/A | Framework definitions interpreted by AI assistants |
| Configuration | YAML | 1.2 | Framework config and template frontmatter |
| Runtime Platform | Claude Code | N/A | Primary AI coding assistant platform |
| Secondary Platforms | Cursor, Windsurf, Copilot, Cline | N/A | Multi-platform support via adapter layer |
| Distribution | npm (Node.js) | ES Modules | CLI installer for framework distribution |

## Architecture Pattern

**Three-Layer Architecture** with declarative agent orchestration:

```
┌─────────────────────────────────────────────┐
│  FRAMEWORK LAYER (Markdown Definitions)      │
│  ├── Commands (triggers + routing)           │
│  ├── Workflows (step-by-step orchestration)  │
│  ├── Agents (role specifications)            │
│  ├── Templates (output file structures)      │
│  └── Skills (reusable components)            │
├─────────────────────────────────────────────┤
│  ADAPTER LAYER (Platform-Specific)           │
│  ├── Skill Shims (Claude Code, Cursor, etc.) │
│  └── Platform Adapter Contract               │
├─────────────────────────────────────────────┤
│  STATE LAYER (Output & Tracking)             │
│  ├── _scrum-output/ (generated files)        │
│  ├── Lock File (installation integrity)      │
│  └── Story Status State Machine (9 states)   │
└─────────────────────────────────────────────┘
```

### Design Patterns

1. **Command Pattern**: Commands define triggers (`/scrum-*`) and route to workflows
2. **Pipeline Pattern**: Commands → Workflows → Agents + Templates → Output
3. **Agent Pattern**: Specialized roles (Architect, Developer, QA, Researcher, Documentarian) with isolated context
4. **Template Method Pattern**: Output templates with `{{variable}}` placeholders
5. **State Machine Pattern**: 9-state story lifecycle with guard conditions
6. **Inversion of Control**: Implementation agents execute plans without self-validation or self-review
7. **Immutable Contract Pattern**: Validation agents can only set `passes: false → true`, never modify content
8. **Feature List as Immutable Contract**: Acceptance criteria cannot be weakened during validation

## Component Overview

### Commands (10)

| Command | Trigger | Purpose | Status Requirement |
|---------|---------|---------|-------------------|
| create-ticket | `/scrum-create-ticket` | Create story from natural language | None |
| refine-ticket | `/scrum-refine-ticket` | Multi-agent refinement | `draft` |
| refine-story | `/scrum-refine-story` | Validate against 5-criterion checklist | `refined` |
| dev-story | `/scrum-dev-story` | Implement story following plan | `ready-for-dev` |
| review-story | `/scrum-review-story` | AI-assisted code review | `in-progress`/`review` |
| create-project-context | `/scrum-create-project-context` | Generate project context files | None |
| create-project-docs | `/scrum-create-project-docs` | Generate business logic docs | None |
| create-architecture-docs | `/scrum-create-architecture-docs` | Generate architecture docs | None |
| research-technical | `/scrum-research-technical` | Technical research via WebSearch | None |
| research-general | `/scrum-research-general` | General/business research | None |

### Workflows (14)

| Workflow | Invoked By | Steps | Key Pattern |
|----------|-----------|-------|-------------|
| ticket-creation | create-ticket | 8 | Fibonacci estimation, guided-mode for vague input |
| refinement | refine-ticket | 6 phases | Cross-talk rounds, Wideband Delphi estimation |
| refine-story | refine-story | 3 | Feature List as Immutable Contract |
| dev-story | dev-story | 3 | Inversion of Control |
| development | (extended) | Multi-step | Red-Green-Refactor TDD cycle |
| review-story | review-story | Multi-step | 5 review criteria, severity levels |
| review | (legacy) | 8 | Superseded by review-story |
| approval | review-story | Multi-step | Human-in-the-loop with audit trail |
| readiness-check | refine-story | 4 checks | PASS/FAIL validation gate |
| project-context | create-project-context | 2 phases | Analysis + Template generation |
| project-documentation | create-project-docs | 2 modes | Initial generation or update |
| architecture-documentation | create-architecture-docs | 2 modes | Initial generation or update |
| research-technical | research-technical | 6 phases | Swarm Migration pattern |
| research-general | research-general | 6 phases | Filesystem-based state tracking |

### Agents (6)

| Agent | Active In | Focus Areas | Output Format |
|-------|-----------|-------------|---------------|
| Architect | refine-ticket | Risks, scalability, security, dependencies | Findings table + recommendations + AC |
| Developer | refine-ticket | Feasibility, complexity, code quality | Findings table + implementation notes |
| QA | refine-ticket | Testability, edge cases, error scenarios | Findings table + test recommendations |
| Researcher | research-* | Web research, information synthesis | Research findings document |
| Documentarian | create-project-docs | Business logic, process flows | Business logic document with Mermaid |
| Architect-Doc | create-architecture-docs | System structure, components | Architecture document |

### Skills (7)

| Skill | Purpose | Invoked By |
|-------|---------|-----------|
| guided-mode | Detects vague input, asks clarifying questions | ticket-creation |
| prerequisite-validation | Validates required files exist | Various workflows |
| status-guard-validation | Enforces story status state machine | All status-gated commands |
| story-validation | Validates YAML frontmatter integrity | ticket-creation, refinement |
| synthesis | Merges agent perspectives with deduplication | refinement |
| feedback-collection | Collects user feedback on agent perspectives | refinement |
| readiness-check | 4-check validation gate (PASS/FAIL) | refine-story |

### Templates (26)

**Core Templates:**
- `story.md` - Story file with YAML frontmatter (ticket, status, estimate, confidence)
- `refinement.md` - Refinement audit file
- `plan.md` - Execution plan with subtasks table
- `review.md` - Review report with severity levels
- `approval.md` - Approval record with audit trail
- `technical-research.md` - Research findings template

**Context Templates:**
- `context-index.md`, `context-backend.md`, `context-frontend.md`, `context-testing.md`, `context-devops.md`, `context-architecture.md`

**Skill Templates:**
- `skill-backend.md`, `skill-frontend.md`, `skill-testing.md`, `skill-devops.md`, `skill-project-architect.md`

**Architecture Doc Templates:**
- `backend-architecture.md`, `frontend-architecture.md`, `testing-architecture.md`, `devops-architecture.md`, `local-dev-environment.md`, etc.

## Data Architecture

No database. All state is file-based:

- **Story Files** (`_scrum-output/stories/SW-XXX.md`): YAML frontmatter + Markdown body
- **Refinement Files** (`_scrum-output/refinements/refinement-SW-XXX.md`): Multi-agent audit trail
- **Plan Files** (`_scrum-output/plans/plan-SW-XXX.md`): Execution plan with subtasks
- **Review Files** (`_scrum-output/reviews/review-SW-XXX-N.md`): Incremental review history
- **Context Files** (`_scrum-output/context/*.md`): Project domain context
- **Research Files** (`_scrum-output/research/{technical,general}/`): Research findings

### Story Status State Machine

```
draft → refinement → refined → ready-for-dev → in-progress → review → approved → done
                                              └→ changes-needed → review (loop)
```

**Guard Conditions:**
- refine-ticket requires: `draft`
- refine-story requires: `refined`
- dev-story requires: `ready-for-dev`
- review-story requires: `in-progress` or `review`

## Key Design Decisions

1. **Markdown-as-Code**: Entire framework is defined in Markdown files - the "runtime" is the AI assistant interpreting these definitions
2. **Write Boundary Enforcement**: Each command has strict file ownership - commands cannot write to files they don't own
3. **Agent Context Isolation**: Agents receive isolated context bundles during initial analysis to prevent anchoring bias
4. **Three-Agent Refinement**: Architect, Developer, and QA provide independent perspectives that are synthesized after cross-talk
5. **Wideband Delphi Estimation**: Story points are estimated by multiple agents with re-estimation on high variance (threshold: 2)
6. **Inversion of Control**: Implementation agents just execute plans - no self-validation, no self-review, no planning
7. **9-State Story Lifecycle**: Comprehensive status tracking from draft to done
8. **Platform Adapter Contract**: Two-element contract (instruction file + command registration) enables multi-platform support
9. **Token Budgets**: Coordination (4000) and sub-agent (2000) token budgets per platform

## Constraints

- **Platform-agnostic**: Must work across 6+ AI coding assistant platforms
- **Token-limited**: Agent interactions budgeted per platform (coordination: 4000, sub_agent: 2000 for Claude Code)
- **Write boundaries**: Each workflow has explicit write boundaries
- **Idempotent**: Context and skill files can be regenerated cleanly
- **Guard conditions**: Status state machine enforced at every command invocation

---

_Generated by Scrum Workflow `/scrum-create-project-docs`_
