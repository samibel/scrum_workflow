# Project Context Workflow

Two-phase workflow for the `/create-project-context` command. Phase A collects facts via shell commands (no hallucination). Phase B fills templates with collected facts and writes output files.

## Prerequisites

- Framework installed with templates in `scrum_workflow/templates/`
- Project root directory accessible

## Phase A: Analysis (Fact Collection)

Collect facts about the project using real shell commands. Do not infer or assume -- only record what is actually found.

### Step A1: Directory Structure Recognition

Run directory listing commands to identify project layout:

```bash
ls -la
ls -R --depth=2
```

Use `glob` patterns to understand the directory hierarchy. Record the top-level directories and their purposes.

### Step A2: Dependency File Detection

Check for the existence of dependency files and read their contents:

- `package.json` -- Node.js / JavaScript / TypeScript
- `requirements.txt` -- Python (pip)
- `go.mod` -- Go
- `Cargo.toml` -- Rust
- `pom.xml` -- Java (Maven)
- `build.gradle` -- Java / Kotlin (Gradle)
- `Gemfile` -- Ruby
- `composer.json` -- PHP

For each file that exists, read its contents:

```bash
cat package.json
cat requirements.txt
cat go.mod
cat Cargo.toml
cat pom.xml
cat build.gradle
cat Gemfile
cat composer.json
```

Record detected languages, frameworks, and key dependencies.

### Step A3: Infrastructure Recognition

Check for Docker and container configuration:

```bash
cat Dockerfile
cat docker-compose.yml
cat docker-compose.yaml
```

Record base images, services, ports, and volumes.

### Step A4: CI/CD Recognition

Check for CI/CD configuration files:

```bash
ls .github/workflows/
cat .github/workflows/*.yml
cat .gitlab-ci.yml
cat Jenkinsfile
cat .circleci/config.yml
```

Record CI platform, pipeline stages, triggers, and deployment targets.

### Step A5: Test Pattern Detection

Detect test files using glob patterns:

```bash
glob **/*.test.*
glob **/*.spec.*
glob **/test_*.py
glob **/*_test.go
```

Record test frameworks, test file locations, and test patterns in use.

### Step A6: Framework Detection

Infer frameworks from dependencies detected in Step A2:

| Dependency | Inferred Domain | Framework |
|---|---|---|
| `react`, `vue`, `angular`, `svelte` | frontend | React, Vue, Angular, Svelte |
| `next`, `nuxt`, `gatsby` | frontend | Next.js, Nuxt, Gatsby |
| `express`, `fastapi`, `flask`, `django` | backend | Express, FastAPI, Flask, Django |
| `spring-boot`, `rails` | backend | Spring Boot, Rails |
| `jest`, `mocha`, `pytest`, `junit` | testing | Jest, Mocha, Pytest, JUnit |
| `docker`, `kubernetes` | devops | Docker, Kubernetes |

### Step A7: Domain Classification

Determine which domains exist in the project based on evidence collected in Steps A1-A6:

- **frontend** -- Detected if: frontend framework dependencies, `src/components/`, `src/pages/`, `.tsx`/`.jsx` files
- **backend** -- Detected if: backend framework dependencies, API route files, server configuration
- **testing** -- Detected if: test files found (Step A5), test framework dependencies
- **devops** -- Detected if: Dockerfile, docker-compose, CI/CD configuration files exist
- **architecture** -- Detected if: architecture documentation exists, multiple domains detected, or significant project structure

Only domains with actual evidence are marked as detected. Skip domains with no evidence in the codebase.

## Phase B: Generation (Template-Based File Creation)

For each detected domain, load the corresponding template, fill it with facts from Phase A, and write the output file.

### Step B1: Context File Generation

For each detected domain:

1. Load template from `scrum_workflow/templates/context-{domain}.md`
2. Replace `{{variable_name}}` placeholders with facts collected in Phase A
3. Fill `<!-- Fill from Phase A analysis -->` comment sections with discovered information
4. Write filled content to `project-root/context/{domain}.md`
5. Ensure output file has valid YAML frontmatter with at minimum `domain` and `generated` fields

Templates available:

- `scrum_workflow/templates/context-index.md` -- Discovery index with agent loading map
- `scrum_workflow/templates/context-frontend.md` -- Framework, Components, State, Routing, Conventions
- `scrum_workflow/templates/context-backend.md` -- Language, Framework, API Design, Database, Conventions
- `scrum_workflow/templates/context-testing.md` -- Test Frameworks, Coverage, CI Integration, Conventions
- `scrum_workflow/templates/context-devops.md` -- CI/CD, Docker, Cloud, Deployment, Monitoring
- `scrum_workflow/templates/context-architecture.md` -- Key Decisions, Patterns, Dependencies, Constraints

### Step B2: Index Generation

Generate `context/index.md` from `scrum_workflow/templates/context-index.md`:

1. Load the index template
2. Fill the Domains section with the list of all detected domains
3. Fill the Agent Loading Map with the correct mapping:

| Agent | Loads |
|---|---|
| Orchestrator | index.md only |
| Architect | index.md, architecture.md, backend.md, frontend.md |
| Developer | index.md, {story-relevant-domain}.md |
| QA | index.md, testing.md, {story-relevant-domain}.md |

4. Fill the Project Summary with a brief description based on Phase A findings
5. Write to `project-root/context/index.md`

### Step B3: Domain Skill File Generation

For each detected domain:

1. Load skill template from `scrum_workflow/templates/skill-{domain}.md`
2. Replace `{{variable_name}}` placeholders with project-specific facts from Phase A
3. Fill instruction sections with project-specific guidelines
4. Create the target directory if it does not exist: `project-root/skills/{domain}/`
5. Write filled content to `project-root/skills/{domain}/SKILL.md`

Skill templates available:

- `scrum_workflow/templates/skill-backend.md` -- Backend specialist SKILL.md
- `scrum_workflow/templates/skill-frontend.md` -- Frontend specialist SKILL.md
- `scrum_workflow/templates/skill-testing.md` -- Testing specialist SKILL.md
- `scrum_workflow/templates/skill-devops.md` -- DevOps specialist SKILL.md
- `scrum_workflow/templates/skill-project-architect.md` -- Architecture specialist SKILL.md

### Step B4: Cross-Reference Validation

After all files are generated:

1. Read `context/index.md` and extract the list of referenced domain files
2. Verify every generated `context/{domain}.md` file is referenced in `index.md`
3. Verify no file is referenced in `index.md` that was not actually generated
4. If validation fails, update `index.md` to match the actually generated files

### Step B5: Frontmatter Validation

Validate every generated `context/*.md` file:

1. Check that YAML frontmatter exists (file starts with `---` and has a closing `---`)
2. Parse the YAML frontmatter
3. Verify `domain` field is present and matches the expected domain name
4. Verify `generated` field is present and contains a valid ISO 8601 date

## Idempotency

When the command is run again on a project that already has generated context and skill files:

- Overwrite all existing `context/*.md` files cleanly with fresh analysis results
- Overwrite all existing `skills/*/SKILL.md` files cleanly with fresh analysis results
- Do not leave stale files from domains that are no longer detected -- remove context and skill files for domains that no longer have evidence
- The command is safe to re-run at any time to refresh project context

## Validation Rules

- Every generated `context/*.md` must have valid YAML frontmatter with `domain` and `generated` fields
- `context/index.md` must reference all generated sub-files (cross-reference check)
- No sub-file without entry in `index.md`
- No empty files for domains not detected in the project
- All files must use kebab-case naming
- All YAML fields must use snake_case
- Generated skill files must follow SKILL.md format: frontmatter (`name`, `role`, `description`) + body sections (Identity, Instructions, Output Format, Context Rules)

## Output Structure

After successful execution:

```
project-root/
  context/
    index.md              <-- Always generated
    frontend.md           <-- Only if frontend detected
    backend.md            <-- Only if backend detected
    testing.md            <-- Only if tests detected
    devops.md             <-- Only if CI/Docker detected
    architecture.md       <-- Only if architectural patterns detected
  skills/
    backend/SKILL.md      <-- Only if backend detected
    frontend/SKILL.md     <-- Only if frontend detected
    testing/SKILL.md      <-- Only if tests detected
    devops/SKILL.md       <-- Only if CI/Docker detected
    project-architect/SKILL.md <-- Only if architectural patterns detected
```

## Write Boundaries

This workflow may write:

- `context/*.md`
- `skills/*/SKILL.md`

This workflow may NOT write:

- `sprints/` -- Sprint files are managed by other commands
- `story.md` -- Story files are managed by `/create-ticket`
- `refinement.md` -- Refinement files are managed by `/refine-ticket`
- `scrum_workflow/` -- Framework files are read-only during execution
