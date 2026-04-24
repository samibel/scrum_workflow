---
name: create-concept
trigger: "/scrum-create-concept"
requires_status: null
sets_status: null
spawns_agents:
  - architect
---

## Purpose

Create a technical concept document for solving a problem in an existing project. The command investigates the codebase, understands the current architecture, identifies relevant files and patterns, generates at least two solution options with trade-off analysis, and writes a structured concept Markdown file. This command is used **before** implementation and **before** ticket creation.

This command is fundamentally different from `/scrum-create-ticket`:

| | `/scrum-create-concept` | `/scrum-create-ticket` |
|---|---|---|
| Answers | "How should this be solved?" | "What should be implemented?" |
| Output | `_scrum-output/concepts/<slug>/concept.md` | `_scrum-output/sprints/SW-XXX/story.md` |
| Creates code? | No | No |
| Creates ticket? | No (optionally suggests one) | Yes |
| Modifies source? | No | No |
| Pattern | Graph-based project analysis | Spec-first story creation |

## When to Use

Use this command when the user has a problem, idea, bug, refactoring need, migration topic, architecture question, or technical improvement and wants to understand **how it should be solved** before implementation begins.

Examples:

- `"How can we add caching to MasterDataServiceImp?"`
- `"Analyze how to migrate this module from Maven to Gradle."`
- `"How should we add Apple Sign-In to the existing Supabase auth flow?"`
- `"Find the best way to improve CSV import validation."`
- `"Analyze how to introduce a new API key management system."`

## Workflow Reference

workflows/concept-creation.md

## Input

**Invocation modes:**

**Mode A — Freeform:** `/scrum-create-concept "<problem statement>" [flags]`

**Mode B — From ticket:** `/scrum-create-concept <ticket-id> "<problem statement>" [flags]`

Arguments:

- `<problem statement>` (required): Natural language description of the problem, question, or improvement to analyze
- `<ticket-id>` (optional, Mode B): Reference ticket ID in `SW-XXX` format. Links the concept to an existing story.
- `--depth light|standard|deep` (optional): Analysis depth override. Defaults to `standard`.
  - `light`: High-level overview, two options, shallow file search
  - `standard`: Full analysis, three options, targeted file search
  - `deep`: Exhaustive analysis, three or more options, broad file search with cross-cutting concern analysis
- `--area <area>` (optional): Domain focus. One of: `backend`, `frontend`, `database`, `devops`, `testing`, `architecture`. Narrows file search scope.
- `--from-ticket <ticket-id>` (optional): Load problem context from an existing story file at `_scrum-output/sprints/<ticket-id>/story.md`.
- `--output <path>` (optional): Custom output path for the concept file. Defaults to `_scrum-output/concepts/<slug>/concept.md`.
- `--json` (optional): Emit a machine-readable JSON summary to stdout after the concept file is written.
- `--dry-run` (optional): Parse inputs, plan analysis, and print what would be done — without writing any files.

## Required Behavior

The agent must:

1. **Parse and validate** the problem statement. Reject empty input with an actionable error.
2. **Inspect the existing project.** Read project context from `_scrum-output/context/index.md` if available.
3. **Search for relevant files, modules, tests, configs, docs, and workflows** using the problem statement and optional `--area` to focus the search.
4. **Identify existing project patterns**: naming conventions, architectural boundaries, dependency management, test strategy, and similar implementations already in the codebase.
5. **Build an analysis graph** (see Workflow Reference) connecting the problem to files, patterns, constraints, and solution options.
6. **Generate at least two solution options** (preferably three: minimal, balanced, robust). Each option must include description, affected files, benefits, drawbacks, complexity, risk level, and fit to existing architecture.
7. **Compare options** with an explicit trade-off analysis table.
8. **Recommend one solution** with justification grounded in the existing codebase.
9. **Create a concrete implementation plan** with step-by-step tasks a developer or coding agent can follow.
10. **Define a test strategy** covering unit, integration, regression, and edge cases.
11. **List risks** and **open questions** that require further investigation or human decision.
12. **Write the concept file** using `templates/concept.md` to `_scrum-output/concepts/<slug>/concept.md`.
13. **Suggest a follow-up ticket** as the final optional section (do not create the ticket automatically).

## Output

Primary artifact:

```
_scrum-output/concepts/<slug>/concept.md
```

The slug is derived from the problem statement:

- Convert the problem statement to lowercase
- Replace spaces and special characters with hyphens
- Truncate to 60 characters maximum
- Example: `"How can we add caching to MasterDataServiceImp?"` → `add-caching-to-masterdataserviceimp`

If `--from-ticket SW-XXX` is provided and no explicit problem statement slug is given, the slug is prefixed with the ticket ID:

- Example: `sw-042-add-caching-to-masterdataserviceimp`

## Error Handling

### Empty Problem Statement

```
❌ Missing Problem Statement: /scrum-create-concept requires a problem statement

**Details:** No problem statement was provided. A non-empty description of the problem or question is required.

**Next Step:** Re-run with a problem statement, e.g.:
  /scrum-create-concept "How can we add caching to MasterDataServiceImp?"
```

### Invalid Depth Value

```
❌ Invalid Depth Value: '--depth <value>' is not valid

**Details:** The --depth flag accepts only 'light', 'standard', or 'deep'. Received: '<value>'.

**Next Step:** Use --depth light, --depth standard, or --depth deep (or omit --depth to use the default 'standard').
```

### Concept File Already Exists

```
⚠️  Concept Already Exists: '_scrum-output/concepts/<slug>/concept.md' already exists

**Details:** A concept file for this slug already exists. Use a different problem statement or rename the existing file.

**Next Step:** Delete or rename the existing file, or use --output to specify a different output path.
```

### Referenced Ticket Not Found (--from-ticket)

```
❌ Ticket Not Found: '_scrum-output/sprints/<ticket-id>/story.md' does not exist

**Details:** The --from-ticket flag references a ticket that has no story file.

**Next Step:** Verify the ticket ID is correct or run /scrum-create-ticket first.
```

### Project Context Missing (non-fatal)

```
⚠️  Project context not found at '_scrum-output/context/index.md'. Concept analysis will proceed
    with direct codebase inspection. Quality may be lower than with full project context.
Tip: Run '/scrum-create-project-context' first for richer concept analysis.
```

## Write Boundary Rules

This command may write:

- `_scrum-output/concepts/<slug>/concept.md` — New file only. MUST NOT overwrite an existing concept file unless `--output` explicitly redirects to a new path.

This command may NOT write:

- `_scrum-output/sprints/` — Story files are managed by `/scrum-create-ticket` and the story lifecycle
- Source code files in the project directory — No implementation during concept creation
- `scrum_workflow/` — Framework files are read-only during execution
- `_scrum-output/context/` — Context files are managed by `/scrum-create-project-context`

### Anti-Pattern Warning

**No Implementation:** This command MUST NOT write source code, modify build files, change configuration, or alter any application file. If the agent begins implementing the solution, halt immediately and report the boundary violation.

**No Ticket Creation:** This command MUST NOT invoke `/scrum-create-ticket` or create a `story.md` file. The suggested follow-up ticket section is informational only.
