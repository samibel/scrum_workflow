# Concept Creation Workflow

## Goal

Create a technical concept for solving a given problem in an existing project.

## Phase 1: Input Parsing

Extract:
- problem statement
- optional ticket ID
- optional area
- requested depth
- output preferences

Validate:
- problem statement is not empty
- depth is one of `light`, `standard`, `deep`
- area is optional but normalized if provided

## Phase 2: Project Research

Search the repository for:
- relevant source files
- tests
- configs
- existing docs
- existing workflows
- architectural boundaries
- naming conventions
- similar implementations
- existing patterns

The agent should collect evidence before proposing solutions.

## Phase 3: Analysis Graph Construction

Build a graph with these nodes:
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

The graph does not need to be stored as JSON unless the project already supports that. It must be represented in the final Markdown document.

### Graph Edge Consistency

Represent relationships consistently in the concept output:

- Problem Statement → Relevant Files
- Problem Statement → Relevant Modules
- Relevant Files + Relevant Modules → Current Behavior
- Current Behavior → Constraints
- Constraints → Possible Root Causes
- Possible Root Causes → Solution Options
- Solution Options → Trade-off Analysis
- Trade-off Analysis → Recommended Solution
- Recommended Solution → Implementation Plan
- Recommended Solution → Test Strategy
- Recommended Solution → Risks
- Risks → Open Questions


## Phase 4: Solution Exploration

Generate at least two options.

For each option include:
- description
- affected files/modules
- benefits
- drawbacks
- complexity
- risk level
- fit to existing architecture

Prefer three options when useful:
- minimal solution
- balanced solution
- robust/long-term solution

### Option Count by Depth

- `light`: exactly 2 options (Option A and Option B)
- `standard`: at least 2 options, prefer 3 options when they add meaningful trade-off clarity
- `deep`: at least 3 options; include additional options when justified

## Phase 5: Recommendation

Choose the best option.

The recommendation must explain:
- why this option fits the existing project
- why other options were not selected
- expected impact
- implementation complexity
- testing impact

## Phase 6: Implementation Plan

Create a concrete step-by-step plan that is implementation-ready for a developer or coding agent.

Example structure:
1. Add or update configuration layer.
2. Add missing dependency (if needed).
3. Update target service/module behavior.
4. Add or update unit tests.
5. Add or update integration tests.
6. Update documentation.
7. Verify using existing test suite.

## Phase 7: Test Strategy

Define:
- unit tests
- integration tests
- regression tests
- edge cases
- manual verification steps
- load/performance tests if relevant

## Phase 8: Concept File Creation

Render the concept using `templates/concept.md`.

### Template Rendering Rules

- Always render Option A and Option B.
- Render Option C only when a third option is part of the analysis.
- For `deep` analysis with more than three options, append additional option blocks (Option D, Option E, ...) under the same "Solution Options" section.
- Remove unused option placeholders; do not leave empty template fields in the final concept artifact.

Write to:
- `_scrum-output/concepts/<slug>/concept.md`

Never overwrite an existing concept file unless the project already defines a safe overwrite/update convention.

## Phase 9: Final Summary

After creating the concept, print:
- concept title
- output path
- recommended solution
- next suggested action

If `--json` is used, return a machine-readable result.

## Guardrails

- Analysis only: no implementation code changes.
- No direct ticket creation.
- Keep output path bounded to `_scrum-output/concepts/`.
- Ground conclusions in observed codebase evidence and clearly list assumptions.
