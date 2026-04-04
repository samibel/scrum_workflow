```md
# PROJECT_REFERENCE.md

# Dynamic Scrum Intelligence Framework

**Spec-First • Plan-First • Multi-Agent • Memory-Driven • Human-Governed**

---

# 1. Purpose

This document defines the **operational reference** for the Dynamic Scrum Intelligence Framework.

It explains:

- how the system works
- how agents should behave
- how workflows are executed
- how artifacts are created and validated
- how memory is used
- how humans interact with the system

This file is intended for:

- developers
- contributors
- AI agents
- integrators

---

# 2. Core Concept

The system is a **delivery orchestration framework**, not a simple AI assistant.

It coordinates:

- structured work units
- specialized agents
- controlled execution phases
- persistent project memory
- human approvals

## Core Rule

> No work progresses without structure, context, and validation.

---

# 3. Execution Model (High-Level)

Every work item follows this controlled lifecycle:

```text
INTAKE → REFINEMENT → PLAN → APPROVAL → EXECUTION → VERIFICATION → REVIEW → HUMAN GATE → MEMORY UPDATE
```

## Key Constraints

- No execution without specification
- No execution without plan
- No transition without required artifacts
- No completion without human approval
- No knowledge lost between steps

---

# 4. Work Units

The system operates on **Work Units**, not just stories.

## Supported Work Units (MVP)

- `story`
- `implementation-plan`
- `review`
- `decision`
- `risk`

## Extended Work Units (later)

- `architecture`
- `epic`
- `release-check`
- `debug-investigation`
- `research`

## Work Unit Structure

Each Work Unit contains:

- id
- type
- state
- required artifacts
- related artifacts
- linked decisions
- linked risks
- history / transitions

---

# 5. States and Transitions

Example lifecycle for a `story`:

```text
draft
→ refined
→ planned
→ approved-for-execution
→ in-progress
→ verification
→ review
→ human-approval
→ done
```

## Transition Rules

Transitions are allowed only if:

- required artifacts exist
- validation passes
- required agents have executed
- required approvals exist

---

# 6. Artifacts

Artifacts are the **source of truth**, not chat messages.

## Required Artifacts (MVP)

### story_spec
- problem description
- acceptance criteria
- constraints
- impacted components

### implementation_plan
- step-by-step plan
- affected components
- test strategy
- risks
- non-goals

### verification_report
- what was tested
- results
- failures (if any)

### review_report
- findings
- issues
- risk assessment
- recommendations

### decision_record
- decision
- alternatives
- reasoning
- impact

### risk_note
- risk description
- severity
- affected areas
- mitigation

## Artifact Rule

> If an artifact is missing, the work is not complete.

---

# 7. Agent System

Agents are specialized roles with **bounded authority**.

## Core Agents (MVP)

- Story Classifier
- Planner Agent
- Implementer Agent
- Verification Agent
- Reviewer Agent (QA/Security)
- Memory Agent
- Dispatcher

## Agent Responsibilities

### Story Classifier
- identifies type and risk
- selects required capabilities

### Planner Agent
- creates implementation_plan
- defines scope and boundaries

### Implementer Agent
- writes code
- follows plan strictly
- does not modify spec

### Verification Agent
- tests implementation
- produces verification_report

### Reviewer Agent
- evaluates quality
- produces review_report

### Memory Agent
- stores decisions
- updates knowledge

### Dispatcher
- orchestrates flow
- activates correct agents

## Agent Rules

Each agent must:

- respect phase boundaries
- only read allowed context
- only write allowed artifacts
- never bypass approvals
- never modify artifacts outside responsibility

---

# 8. Capability System

Capabilities define **expertise**, not roles.

## Example Capabilities

- backend.spring-boot
- api-design
- security.auth
- qa.test-strategy
- devops.azure
- architecture.hexagonal

## Capability Usage

- Work Units trigger capabilities
- Dispatcher selects agents based on capabilities
- Agents use capabilities to perform tasks

---

# 9. Dispatcher Logic

The Dispatcher is the **central orchestrator**.

## Responsibilities

- route work to correct agents
- enforce phase sequence
- load relevant context
- split complex work
- enforce approvals
- trigger validations

## Example Flow

1. classify story
2. select capabilities
3. trigger planner
4. wait for approval
5. trigger implementer
6. trigger verification
7. trigger reviewers
8. request human approval
9. update memory

---

# 10. Control Layer

The Control Layer enforces system discipline.

## It prevents

- execution without plan
- skipping phases
- unauthorized writes
- missing validations
- hidden behavior

## It detects

- policy violations
- incomplete artifacts
- missing approvals
- wrong context usage

## Rule

> The system must be auditable at all times.

---

# 11. Memory System

Memory ensures **continuity across sessions**.

## Persistent Memory

- decisions
- risks
- architecture knowledge
- review patterns
- lessons learned

## Session Memory

- current work
- active phase
- unresolved issues
- pending approvals

## Agent Scratch Memory

Short-lived:

- temporary findings
- progress tracking
- unresolved checks

## Memory Rule

> Memory must support continuity, not replace governance.

---

# 12. Human Role

Humans are the **final authority**.

## Humans decide:

- approval
- rejection
- escalation
- risk acceptance
- override

## AI assists with:

- analysis
- planning
- implementation
- verification
- review
- memory

## Final Rule

> AI supports delivery. Humans own decisions.

---

# 13. Command Philosophy

Commands represent **real work moments**, not internal technical abstractions.

## Examples

- `/intake`
- `/refine`
- `/plan`
- `/execute`
- `/verify`
- `/review`
- `/capture-decision`
- `/risk-check`
- `/debug-issue`
- `/wrap-up`

## Command Rule

> Commands should help users work naturally while the system structures the result.

---

# 14. Runtime Philosophy

The framework should be **host-neutral**.

It should support multiple environments via adapters.

## Examples

- Claude Code
- Cursor
- GitHub Copilot
- Windsurf
- OpenCode

## Rule

> The core framework must not depend on a single AI runtime.

---

# 15. Implementation Priorities

## Highest Priority

1. formal story lifecycle
2. planner + implementer + reviewer flow
3. bounded authority
4. plan enforcement
5. human gate
6. decision memory
7. dispatcher

## Later Priority

1. advanced vault integration
2. debug-investigation work units
3. more agent packs
4. advanced control observability
5. broader runtime adapters

---

# 16. Final Operational Definition

> Dynamic Scrum Intelligence Framework is a governed AI delivery framework that transforms software work into structured, reviewable, memory-backed execution flows using specialized agents, explicit artifacts, and human-controlled approvals.
```

