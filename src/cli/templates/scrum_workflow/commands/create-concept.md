---
name: create-concept
trigger: "/scrum-create-concept"
requires_status: null
sets_status: null
spawns_agents: []
---

## Purpose

Create a technical concept for solving a problem in an existing project. This command performs analysis and solution design before implementation.

This command **does not implement code** and **does not create a Scrum ticket directly**.

## Workflow Reference

workflows/concept-creation.md

## When to Use

Use this command when the user has a problem, idea, bug, refactoring need, migration topic, architecture question, or technical improvement and wants to understand how it should be solved before implementation.

Examples:
- `"How can we add caching to MasterDataServiceImp?"`
- `"Analyze how to migrate this module from Maven to Gradle."`
- `"How should we add Apple Sign-In to the existing Supabase auth flow?"`
- `"Find the best way to improve CSV import validation."`
- `"Analyze how to introduce a new API key management system."`

## Input

Accepted invocation forms:

- `/scrum-create-concept "<problem statement>"`
- `/scrum-create-concept SW-120 "<problem statement>"`
- `/scrum-create-concept "<problem statement>" --depth light|standard|deep`
- `/scrum-create-concept "<problem statement>" --area backend|frontend|database|devops|testing|architecture`

Supported inputs:
- **Problem statement** (required)
- **Optional ticket ID** (e.g., `SW-120`)
- **Optional area**: backend, frontend, database, DevOps, testing, architecture
- **Optional depth**: light, standard, deep
- **Optional output slug**
- **Optional flags**:
  - `--depth light|standard|deep`
  - `--area <area>`
  - `--from-ticket <ticket-id>`
  - `--output <path>`
  - `--json`
  - `--dry-run`

## Required Behavior

The agent must:

1. Parse and clarify the problem statement.
2. Inspect the existing project.
3. Search for relevant files, modules, tests, configs, docs, and workflows.
4. Identify existing project patterns.
5. Build an analysis graph.
6. Generate at least two solution options.
7. Compare options with pros, cons, complexity, risks, and architecture fit.
8. Recommend one solution.
9. Create a concrete implementation plan.
10. Define a test strategy.
11. List risks and open questions.
12. Suggest a follow-up Scrum ticket only as an optional final section.

## Analysis Graph Requirement

The concept process MUST use a graph-based analysis pattern rather than a simple linear flow.

Required graph nodes:

- Problem Statement
- Relevant Files
- Relevant Modules
- Existing Patterns
- Current Behavior
- Constraints
- Possible Root Causes
- Solution Options
- Trade-off Analysis
- Recommended Solution
- Implementation Plan
- Test Strategy
- Risks
- Open Questions

The final concept document must include a readable **Analysis Graph** section.

## Output

Create:

- `_scrum-output/concepts/<slug>/concept.md`

Where `<slug>` is derived from the problem statement or ticket ID and normalized to a filesystem-safe path segment.

## Validation Rules

1. Problem statement must not be empty.
2. Depth must be one of `light`, `standard`, `deep`.
3. Output slug must be filesystem-safe.
4. Output path must remain inside `_scrum-output/concepts`.
5. Existing concept files must not be overwritten unless an explicit project convention allows updates.
6. Concept must include all required sections from `templates/concept.md`.
7. Concept must include at least two solution options.
8. Concept must include one clear recommendation.
9. Concept must include a test strategy.
10. Concept must include risks and open questions.

## Strict Rules

- Do not implement the feature.
- Do not modify production code.
- Do not create a Scrum ticket directly.
- Do not invent architecture that does not fit the current project.
- Ground recommendations in existing codebase evidence.
- Prefer existing project patterns over new abstractions.
- State assumptions clearly.
- If confidence is low, explain why.
- If relevant files cannot be found, document the search attempt and limitation.

## Write Boundary Rules

This workflow may write:
- `_scrum-output/concepts/<slug>/concept.md` — new concept artifact

This workflow may NOT write:
- `_scrum-output/sprints/**` story lifecycle artifacts (story/refinement/plan/review/approval)
- Source code files in the project directory
- Framework files in `scrum_workflow/`

### Anti-Pattern Warning

**Premature Implementation:** `/scrum-create-concept` must remain analysis-only. If implementation code changes are attempted, halt and report a write-boundary violation.
