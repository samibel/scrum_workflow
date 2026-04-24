# Concept Creation Workflow

Step-by-step workflow for the `/scrum-create-concept` command. Transforms a problem statement into a structured technical concept document by researching the existing codebase, building an analysis graph, generating solution options, and writing a Markdown artifact. The workflow never writes source code, never creates a story, and never modifies the project outside `_scrum-output/concepts/`.

## Prerequisites

- Framework installed with templates in `scrum_workflow/templates/`
- Project context at `_scrum-output/context/index.md` — optional but recommended (warn if missing, do not halt)
- Architect agent available at `scrum_workflow/agents/architect.md`

## Phase 1: Input Parsing

Parse and validate all inputs before any file operations.

### Step 1.1: Extract Problem Statement

Parse the problem statement from the command invocation:

- **Mode A:** `/scrum-create-concept "<problem statement>"` — extract problem statement directly
- **Mode B:** `/scrum-create-concept <ticket-id> "<problem statement>"` — extract ticket ID and problem statement

Problem statement may be quoted or unquoted. Strip surrounding quotes if present.

**If no problem statement is provided**, halt immediately:

```
❌ Missing Problem Statement: /scrum-create-concept requires a problem statement
Fix: /scrum-create-concept "Describe the problem you want to analyze"
```

**If the problem statement is empty or whitespace-only**, halt with the same error.

### Step 1.2: Parse Optional Flags

Extract and store the following flags:

| Flag | Default | Validation |
|------|---------|------------|
| `--depth` | `standard` | Must be `light`, `standard`, or `deep`. Halt on invalid value. |
| `--area` | null | Normalize to lowercase. Must be one of: `backend`, `frontend`, `database`, `devops`, `testing`, `architecture`. Warn and ignore if unrecognized. |
| `--from-ticket` | null | Must match `SW-\d{3}` pattern. Validate that `_scrum-output/sprints/<id>/story.md` exists. |
| `--output` | null | Custom output path. If provided, use verbatim (no slug derivation). |
| `--json` | false | Boolean flag. |
| `--dry-run` | false | Boolean flag. If set, skip all file writes and print planned actions. |

### Step 1.3: Derive Output Slug and Path

If `--output` is NOT provided:

1. Convert problem statement to lowercase
2. Replace all non-alphanumeric characters (spaces, punctuation, special chars) with hyphens
3. Collapse consecutive hyphens into a single hyphen
4. Strip leading and trailing hyphens
5. Truncate to 60 characters (truncate at the last hyphen boundary within the limit)
6. If `--from-ticket` or Mode B ticket ID is present, prefix the slug with the lowercased ticket ID: `<ticket-id>-<slug>` (e.g., `sw-042-add-caching-to-masterdataserviceimp`)

Set output path: `_scrum-output/concepts/<slug>/concept.md`

### Step 1.4: Guard — Concept File Must Not Exist

Check if the output path already exists.

If it does, warn the user and halt:

```
⚠️  Concept Already Exists: '<output path>' already exists
Fix: Delete or rename the existing file, or use --output <new-path> to write to a different location.
```

Do not overwrite existing concept files.

### Step 1.5: Handle --dry-run

If `--dry-run` is set:

1. Print a summary of what would happen: parsed inputs, derived slug, output path, planned depth
2. Print the analysis graph nodes that would be built (see Phase 3)
3. Print the list of file patterns that would be searched (see Phase 2)
4. Halt without writing any files

---

## Phase 2: Project Research

Collect evidence from the existing codebase before proposing any solutions. The quality of the concept depends entirely on the quality of the research phase.

### Step 2.1: Load Project Context

Check if `_scrum-output/context/index.md` exists.

**If found:** Read the index to understand the project's tech stack, architecture overview, domain boundaries, and naming conventions. Load relevant domain context files (`backend.md`, `frontend.md`, `architecture.md`, etc.) based on `--area` and problem statement keywords.

**If missing:** Warn the user but continue:

```
⚠️  Project context not found at '_scrum-output/context/index.md'.
    Concept analysis will proceed with direct codebase inspection.
Tip: Run '/scrum-create-project-context' first for richer concept analysis.
```

### Step 2.2: Load Ticket Context (if --from-ticket)

If `--from-ticket <ticket-id>` is provided:

1. Read `_scrum-output/sprints/<ticket-id>/story.md`
2. Extract title, description, domain_tags, type, risk_level, and acceptance criteria
3. Use these as additional context for the problem statement — they enrich but do not replace the user-provided problem statement

### Step 2.3: Keyword Extraction

Extract search keywords from the problem statement and ticket context (if loaded):

- Proper nouns: class names, method names, service names, module names (e.g., `MasterDataServiceImp`, `CsvImportValidator`)
- Technical terms: patterns, frameworks, libraries, infrastructure concepts (e.g., `caching`, `Redis`, `OAuth`)
- Action words: the type of change (e.g., `migrate`, `refactor`, `add`, `replace`, `extract`)

### Step 2.4: File and Module Search

Search the project for relevant files using the extracted keywords. Vary search strategy by depth:

**light depth:**

- Search for files matching class/service names in the problem statement
- Limit to the most directly relevant 5–10 files

**standard depth:**

- Search for files matching all extracted keywords (class names, method names, package names)
- Include test files for matched classes
- Include configuration files relevant to the area
- Examine build files (pom.xml, build.gradle, package.json) for existing dependencies
- Limit to 10–20 most relevant files

**deep depth:**

- All searches from standard depth
- Broaden to related modules, parent/child classes, utility classes
- Search for existing similar implementations (e.g., other caching usages in the codebase)
- Review documentation files (README, ADRs, existing concepts)
- Examine CI/CD and deployment config if relevant
- No file limit — document all found files

For each found file, record:

- File path
- Relevance reason (why it is relevant to the problem)
- Key lines or excerpts that inform the analysis

### Step 2.5: Pattern Identification

After file search, synthesize observed patterns across the codebase:

- **Naming conventions**: How are classes, methods, files, and packages named?
- **Architectural patterns**: Layering (controller/service/repository), dependency injection, event-driven, modular, etc.
- **Existing similar implementations**: Are there other services, modules, or features that solve a similar problem? What approach did they use?
- **Dependency management**: What libraries/frameworks are already in use that could be leveraged?
- **Test conventions**: What test frameworks, naming patterns, and test levels exist?
- **Configuration conventions**: How is external configuration managed (env vars, YAML, properties, etc.)?

Document each pattern with evidence (file path + line reference where possible).

---

## Phase 3: Analysis Graph Construction

Build an internal analysis graph connecting the problem to the solution space. This graph is not stored as a separate file — it is embedded in the concept document as a Mermaid diagram.

### Graph Nodes

Populate each node with evidence gathered in Phase 2:

| Node | Content |
|------|---------|
| **Problem Statement** | Refined problem statement (from user input + ticket context) |
| **Relevant Files** | Directly impacted files identified in Phase 2 |
| **Relevant Modules** | Modules/packages/services touched by the problem |
| **Existing Patterns** | Patterns found in Phase 2 that constrain or inform the solution |
| **Current Behavior** | How the system behaves today without the change |
| **Constraints** | Technical, architectural, business, and team constraints |
| **Possible Root Causes** | If the problem is a bug or degradation, list possible root causes |
| **Solution Options** | Options generated in Phase 4 |
| **Trade-offs** | Comparison matrix from Phase 4 |
| **Recommended Solution** | Selected option from Phase 5 |
| **Implementation Steps** | Step-by-step plan from Phase 6 |
| **Test Strategy** | Test plan from Phase 7 |
| **Risks** | Identified risks from Phase 5 |
| **Open Questions** | Unknowns requiring human decision or further research |

### Graph Edges

Connect nodes directionally:

```
Problem Statement → Relevant Files
Problem Statement → Relevant Modules
Relevant Files → Current Behavior
Relevant Modules → Current Behavior
Current Behavior → Constraints
Existing Patterns → Constraints
Constraints → Solution Options
Solution Options → Trade-offs
Trade-offs → Recommended Solution
Recommended Solution → Implementation Steps
Recommended Solution → Test Strategy
Recommended Solution → Risks
Risks → Open Questions
```

---

## Phase 4: Solution Exploration

Generate solution options grounded in the existing codebase. Do not invent architecture that contradicts existing project conventions.

### Step 4.1: Generate Options

Generate at least two options. For `standard` and `deep` depth, prefer three:

- **Option A — Minimal:** Smallest change that solves the immediate problem. Lowest risk, lowest scope.
- **Option B — Balanced:** Adequate solution that fits existing patterns and provides good long-term maintainability.
- **Option C — Robust:** Comprehensive solution for maximum flexibility and performance, at higher complexity cost.

For `light` depth, two options (A and B) are sufficient.

### Step 4.2: Document Each Option

For each option, document:

| Field | Description |
|-------|-------------|
| `title` | Short descriptive name for the option |
| `description` | What this option does and how it works |
| `affected_files` | Files that would need to be created or modified |
| `new_dependencies` | Libraries or infrastructure components not currently in the project |
| `benefits` | What this option achieves |
| `drawbacks` | What this option sacrifices or introduces as technical debt |
| `complexity` | `low`, `medium`, or `high` |
| `risk_level` | `low`, `medium`, `high`, or `critical` |
| `fit_to_existing_architecture` | How well this option aligns with observed patterns (high/medium/low fit) |

### Step 4.3: Trade-off Analysis

Build a comparison table across all options:

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Implementation Effort | | | |
| Risk to Existing System | | | |
| Fit to Existing Patterns | | | |
| Testability | | | |
| Long-term Maintainability | | | |
| Performance Impact | | | |
| Reversibility | | | |

---

## Phase 5: Recommendation

Select one option as the recommended solution.

### Step 5.1: Recommendation Criteria

The recommendation must be grounded in the existing codebase. Prefer options that:

1. Align with existing architectural patterns found in Phase 2
2. Reuse existing dependencies rather than introducing new ones
3. Minimize blast radius on unrelated modules
4. Are consistent with the project's observed risk tolerance and test coverage

### Step 5.2: Recommendation Justification

Document:

- **Why this option is selected**: Specific reasons tied to observed patterns, constraints, and project conventions
- **Why other options were not selected**: One-sentence rejection reason per rejected option
- **Expected impact**: What the system gains
- **Implementation complexity**: Honest assessment of effort
- **Testing impact**: What new tests are needed

### Step 5.3: Risk Identification

List all risks associated with the recommended solution:

- Technical risks (regression potential, performance impact)
- Architectural risks (violation of boundaries, coupling introduction)
- Operational risks (deployment complexity, rollback difficulty)
- Team risks (knowledge gaps, onboarding cost)

For each risk, assign a severity (`low`, `medium`, `high`) and suggest a mitigation.

---

## Phase 6: Implementation Plan

Create a step-by-step implementation plan concrete enough for a developer or coding agent to execute.

### Step 6.1: Plan Structure

Each step must specify:

- **Action**: What to do
- **Target file(s)**: Which file(s) to create or modify
- **Notes**: Any important constraints or context

**Example:**

```
1. Add dependency: include `spring-boot-starter-cache` in `pom.xml`
2. Create configuration class: `CacheConfig.java` in `src/main/java/.../config/`
3. Annotate service method: add `@Cacheable("masterData")` to `MasterDataServiceImp.findAll()`
4. Add unit test: `MasterDataServiceImpTest` — verify cache hit on second call
5. Add integration test: verify cache invalidation on data mutation
6. Update documentation: add caching section to `_scrum-output/docs/backend.md`
7. Verify: run `./mvnw test` and confirm no regressions
```

### Step 6.2: Dependency on Existing State

If the plan depends on the current status of specific files or configurations, note this explicitly as a precondition.

---

## Phase 7: Test Strategy

Define how the recommended solution should be tested.

### Step 7.1: Test Levels

Document tests for each level applicable to the solution:

| Level | Description |
|-------|-------------|
| **Unit tests** | Isolate the changed component. Mock external dependencies. |
| **Integration tests** | Verify the component interacts correctly with its neighbors. |
| **Regression tests** | Confirm that existing behavior is unchanged. Run the existing test suite. |
| **Edge cases** | Boundary conditions, null inputs, concurrent calls, cache eviction, etc. |
| **Manual verification** | Steps a developer can follow to confirm the feature works end-to-end. |
| **Load/performance tests** | If the change has a performance dimension (e.g., caching, query optimization), define a basic benchmark. |

### Step 7.2: Existing Test Coverage

Note what tests already exist for the affected files and whether they provide adequate regression coverage.

---

## Phase 8: Concept File Creation

Render the concept using the template and write it to the output path.

### Step 8.1: Load Template

Read `scrum_workflow/templates/concept.md`.

### Step 8.2: Fill Template

Replace all `{{placeholder}}` tokens with content produced in Phases 1–7.

**YAML frontmatter fields:**

| Field | Value |
|-------|-------|
| `schema_version` | `"1.0.0"` |
| `kind` | `"concept"` |
| `title` | Derived from problem statement (short descriptive phrase) |
| `status` | `"draft"` |
| `source_problem` | Full problem statement text |
| `ticket` | Ticket ID from `--from-ticket` or Mode B, or `null` |
| `area` | Value from `--area`, or `null` |
| `depth` | Selected depth value |
| `created` | Current UTC timestamp (ISO 8601) |
| `updated` | Same as `created` on initial creation |

### Step 8.3: Write Concept File (Atomic)

1. Create the directory `_scrum-output/concepts/<slug>/` if it does not exist
2. Write `concept.md` in a single atomic write operation
3. Do not write partial files

### Step 8.4: --dry-run Short-Circuit

If `--dry-run` is active, skip Step 8.3. Print the template filled with all content to stdout instead.

---

## Phase 9: Final Summary

After successful file creation, print a summary to the user.

### Step 9.1: Human-Readable Summary

```
✅ Concept Created

Title:       <concept title>
Output:      _scrum-output/concepts/<slug>/concept.md
Depth:       <depth>
Recommended: <option title>

Next suggested action:
  Review the concept and, when ready, run:
  /scrum-create-ticket SW-XXX "<concept title>"
```

### Step 9.2: JSON Output (--json)

If `--json` is active, also emit a JSON object to stdout:

```json
{
  "status": "created",
  "title": "<concept title>",
  "slug": "<slug>",
  "output_path": "_scrum-output/concepts/<slug>/concept.md",
  "depth": "<depth>",
  "recommended_option": "<option title>",
  "options_count": 3,
  "risks_count": <n>,
  "open_questions_count": <n>
}
```

---

## Write Boundaries

This workflow may write:

- `_scrum-output/concepts/<slug>/concept.md` — New file only; never overwrite

This workflow may NOT write:

- `_scrum-output/sprints/` — Story files are exclusively managed by the story lifecycle commands
- Any source code file in the project directory
- Any build, config, or infrastructure file
- `scrum_workflow/` — Framework files are read-only during execution
- `_scrum-output/context/` — Context files are managed by `/scrum-create-project-context`

## Validation Rules

- Problem statement must not be empty or whitespace-only
- Depth must be one of: `light`, `standard`, `deep`
- Output slug must be filesystem-safe (alphanumeric and hyphens only, no path separators)
- Output path must be inside `_scrum-output/concepts/`
- Concept file must not be written if one already exists at the target path
- Rendered concept must include all required sections from the template
- Concept must contain at least two solution options
- Concept must contain exactly one recommendation
- Concept must include a test strategy section
- Concept must include risks and open questions sections
- All YAML frontmatter fields must use snake_case
- All timestamps must use ISO 8601 UTC format (e.g., `2026-04-06T10:00:00Z`)
- `schema_version` must be `"1.0.0"`
- `kind` must be `"concept"`
- `status` must be `"draft"` on creation
