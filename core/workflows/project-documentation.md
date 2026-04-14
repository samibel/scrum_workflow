# Project Documentation Workflow

Two-mode workflow for the `/scrum-create-project-docs` command. Full-scan mode analyzes the entire codebase and generates complete business logic documentation. Update mode incrementally refreshes documentation for files that changed since the last scan.

## Prerequisites

- Documentarian agent definition exists at `scrum_workflow/agents/documentarian.md`
- Project context generated via `/scrum-create-project-context` (optional but recommended -- `context/index.md` provides project domain and tech stack awareness)

## Step 0: Mode Detection

Parse the command input to determine the execution mode and route to the appropriate workflow branch.

### Step 0.1: Parse Command Arguments

Check if the `--update` flag is present in the command invocation.

- **If `--update` is present**: Set mode to `update`
- **If `--update` is not present**: Set mode to `full-scan` (default)

Store the resolved mode for use in subsequent steps.

**Validation:** Only accept valid mode values: "full", "update", "resume". If any other value is detected, halt with error: `Error: Invalid scan mode '{mode}'. Valid modes are: full, update, resume.`

### Step 0.2: Route to Appropriate Workflow Branch

Based on the detected mode, route to the appropriate workflow steps:

- **If mode is `update`**: After completing Steps 1-4 (validation, loading, scanning, directory creation), GOTO Step 6 (Update Mode)
- **If mode is `full-scan`**: After completing Steps 1-4 (validation, loading, scanning, directory creation), GOTO Step 5 (Full-Scan Mode)

**Workflow Branching Diagram**:

```
Step 0: Mode Detection
    |
    v
Steps 1-4: Shared (Validation, Loading, Scanning, Directory Creation)
    |
    +---> [mode == "update"] ---> Step 6: Update Mode (incremental)
    |                                      |
    |                                      v
    |                                   Step 7: Scan State Update
    |                                      |
    |                                      v
    |                                   EXIT
    |
    +---> [mode == "full-scan"] ---> Step 5: Full-Scan Mode (complete analysis)
                                          |
                                          v
                                       Step 7: Scan State Persistence
                                          |
                                          v
                                       EXIT
```

Both branches (update and full-scan) converge to separate scan state persistence steps:
- Update mode: Step 6.7 (update existing scan state)
- Full-scan mode: Step 7 (create new scan state)

## Step 1: Validation

Validate prerequisites and safety conditions before any analysis begins.

### Step 1.1: Check for Existing Scan State (Resumption Detection)

Check if `_scrum-output/docs/.scan-state.json` exists from a previous scan.

**If scan state exists**, read the file and check `scan_status`:

**If `scan_status` is "interrupted"**:
- Print message: "Resuming scan from last completed file: {last_completed_file}"
- Set mode to "resume" (not "full" or "update")
- Skip all files in `files_scanned` array (already processed)
- Continue analysis from file after `last_completed_file`
- GOTO Step 2 (validation continues with resume mode)

**If `scan_status` is "complete"** and mode is `full-scan`:
- Print warning: "Existing scan state found (dated {scan_date}). Full scan will reset the state. Continue? [y/N]"
- Wait for user input
- If user confirms (y/Y): Delete existing state file and proceed with full scan
- If user rejects (anything else): Exit cleanly with message "Full scan cancelled. Existing state preserved."

**If scan state does not exist**:
- Proceed with normal full-scan mode
- GOTO Step 1.2

### Step 1.2: Validate Documentarian Agent

Check if `scrum_workflow/agents/documentarian.md` exists.

**If agent file does not exist**, halt with error:

```
Error: Documentarian agent definition not found at 'scrum_workflow/agents/documentarian.md'
Fix: Ensure the Scrum framework is properly installed with all agent definitions
```

### Step 1.3: Check Project Context

Check if `context/index.md` exists at the project root.

**If context does not exist**, warn but continue:

```
Warning: Project context not found at 'context/index.md'. Documentation will proceed without project domain awareness.
Tip: Run '/scrum-create-project-context' first for better documentation quality -- the documentarian uses project context to understand your tech stack and domain.
```

### Step 1.4: Check Output Directory (Full-Scan Overwrite Warning)

**Only in `full-scan` mode**: Check if `_scrum-output/docs/` already exists and contains files.

**If directory exists and contains files**, warn the user:

```
Warning: Existing docs found in '_scrum-output/docs/'. This will overwrite all existing documentation.
Continue? [y/N]
```

- **If user confirms (y/Y)**: Proceed to Step 2
- **If user declines or no response (N/n/empty)**: Halt with message: "Documentation generation cancelled. Existing docs preserved."

**In `update` mode**: Skip this check (update mode preserves existing docs and only modifies changed sections).

### Step 1.5: Validate Scan State (Update Mode Only)

**Only in `update` mode**: Check if the scan state file exists at `_scrum-output/docs/`.

**If scan state does not exist**, halt with error:

```
Error: No scan state found. Cannot run update mode without a previous full scan.
Fix: Run '/scrum-create-project-docs' (without --update) first to perform a full scan
```

## Step 2: Agent and Context Loading

Load the documentarian agent definition and available project context to inform the analysis.

### Step 2.1: Initialize Scan State

**Only in `full-scan` or `resume` mode**: Initialize a new scan state object with empty `files_scanned` array.

```json
{
  "_comment": "Tracks scan progress for incremental updates and resumption. Local file — not committed to git.",
  "scan_date": null,
  "scan_mode": "full",
  "files_scanned": [],
  "documents_generated": [],
  "scan_duration": 0,
  "scan_status": "in_progress"
}
```

This initial state will be updated incrementally after each analysis step. Store this state in memory for updates during the scan.

**In `update` mode**: Skip this step (scan state will be loaded in Step 6.1).

### Step 2.2: Load Documentarian Agent

Read `scrum_workflow/agents/documentarian.md` to load:

- Agent identity and role description
- Analysis methodology (Instructions section)
- Output format specifications for the three document types
- Context loading rules

The workflow orchestrates WHEN analysis happens. The agent definition specifies HOW analysis is performed. Do not duplicate analysis methodology in this workflow.

### Step 2.3: Load Project Context

Read `context/index.md` to understand:

- Project domain and technology stack
- Detected domains (backend, frontend, testing, devops, architecture)
- Agent loading map for relevant context files

Based on the index, load relevant domain context files (`context/backend.md`, `context/frontend.md`, etc.) to provide the documentarian with project-specific awareness.

**If context files are missing** (as warned in Step 1.2), proceed with agent defaults only.

## Step 3: Project Structure Scan

Discover source files and build a file manifest for the documentarian agent.

### Step 3.1: Discover Source Files

**Standard Exclusion List** (applied to all analysis steps):
- **Excluded directories:** `node_modules/`, `dist/`, `build/`, `.git/`, `vendor/`, `__pycache__/`, `_scrum-output/docs/`, `scrum_workflow/`
- **Excluded test files:** `*.test.*`, `*.spec.*`, `test_*`, `*_test.*`

This exclusion list is applied consistently in Steps 5.1 (Business Logic), 5.2 (Workflows), and 5.3 (Domain Model) to avoid false positives and redundant documentation of infrastructure code.

Use Glob patterns to discover all source files in the project:

- Discover files by language: `**/*.ts`, `**/*.js`, `**/*.py`, `**/*.go`, `**/*.java`, `**/*.rs`, `**/*.rb`, `**/*.php`, `**/*.cs`, `**/*.kt`, `**/*.swift`, etc.
- Exclude non-source directories: `node_modules/`, `dist/`, `build/`, `.git/`, `vendor/`, `__pycache__/`, `.next/`, `coverage/`
- Exclude generated and framework files: `_scrum-output/docs/`, `scrum_workflow/`

### Step 3.2: Build File Manifest

Compile the discovered files into a structured manifest:

- Total file count
- Files grouped by directory/module
- File types and language distribution

This manifest is passed to the documentarian agent as input for analysis phases.

## Step 4: Output Directory Creation

Ensure the output directory exists before writing any files.

### Step 4.1: Create Output Directory

If `_scrum-output/docs/` does not exist, create it (including the parent `docs/` directory if needed).

This step must be completed before any file writes in Steps 5, 6, or 7.

## Step 5: Full-Scan Mode

**Only executed when mode is `full-scan` or `resume`.**

Orchestrate the three analysis phases following the documentarian agent's methodology and output format specifications. Each phase scans the codebase for a specific category of business logic and produces one output document.

**Critical**: After each analysis step, update the scan state file incrementally to preserve progress if interrupted.

### Step 5.1: Business Logic Analysis

Invoke the documentarian agent's business rule identification methodology (defined in `scrum_workflow/agents/documentarian.md` Instructions Section 2) to scan the codebase for business rules, validations, and guard clauses. Use `scrum_workflow/templates/business-logic.md` as the structural template for the output document.

#### 5.1.1: Grep-Based Business Rule Scanning

Scan all source files from the file manifest (Step 3) using the documentarian agent's grep patterns for business rule identification (defined in `scrum_workflow/agents/documentarian.md` Instructions Section 2). These patterns are language-agnostic and work with any directory structure.

The grep patterns include conditional logic with domain terms, validation functions, guard clauses, policy/rule/strategy patterns, and business constants. Refer to the agent definition for the complete pattern set.

#### 5.1.2: Exclusion Filters

Apply the standard exclusion list from Step 3.1 to avoid false positives.

Additionally, follow the documentarian agent's exclusion list: do not document infrastructure logic (logging, error handling plumbing, database queries, deployment configuration, CI/CD pipelines, or API surface details). Only document business-domain logic -- rules, validations, guards, and constants that enforce business policy.

#### 5.1.3: Domain Area Grouping

Group discovered rules by domain area using the following inference strategy (project-agnostic, works with any directory structure):

1. **Path-based inference**: Extract domain area from directory structure (e.g., `src/auth/` -> "Authentication", `src/billing/` -> "Billing", `lib/permissions/` -> "Permissions", `src/payments/` -> "Payments")
2. **File-name inference**: Use file name when path is flat (e.g., `auth.ts` -> "Authentication", `billing-rules.py` -> "Billing")
3. **Fallback**: Use the top-level directory name as the domain area if no semantic match
4. **Ungrouped**: Rules that cannot be categorized go in an "Other / Uncategorized" section

#### 5.1.4: Mermaid Flowchart Generation

For rules with branching or multi-branch decision logic (if/else chains, switch/case, guard sequences with 3+ branches), generate a Mermaid `flowchart TD` diagram showing the decision tree. Use `flowchart LR` only for purely sequential/linear decisions.

Simple single-condition rules (e.g., `if (!user) throw`) do NOT need a diagram.

Each Mermaid diagram must be in a fenced code block with ` ```mermaid ` language tag and include a descriptive comment above it explaining the decision being modeled. Use descriptive node labels, not code variables (e.g., "User authenticated?" not "if (user)").

#### 5.1.5: Source Reference Format

Every documented rule must include a source reference in the format `[Source: path/to/file.ext:LINE]` using relative paths from the project root (not absolute paths). If a rule spans multiple files, include all file:line references.

#### 5.1.6: Write Output

1. Load the template from `scrum_workflow/templates/business-logic.md`
2. Fill the template sections with discovered rules, following the template structure
3. Populate the Overview section with total rules found, domain areas detected, and analysis timestamp
4. Write the filled document to `_scrum-output/docs/business-logic.md`
5. If no business logic is found (empty codebase or pure infrastructure project), write a minimal document stating "No business logic detected" with the analysis timestamp rather than an empty file

#### 5.1.7: Incremental State Update (Business Logic Complete)

**After business logic analysis completes**, update the scan state file incrementally to preserve progress:

1. **Compute hashes for all scanned files**: For each file in the business logic scan, compute SHA-256 hash of file content. Handle errors gracefully: if file cannot be read, log warning and skip the file.
2. **Update files_scanned array**: Append entries with format:
   ```json
   {
     "path": "src/auth/service.ts",
     "hash": "sha256:a1b2c3d4e5f6...",
     "timestamp": "2026-03-30T12:34:50Z"
   }
   ```
3. **Update last_completed_file**: Set to the last file processed in business logic analysis
4. **Write state atomically**: Use temp file pattern (write to `.scan-state.json.tmp`, verify JSON, rename to `.scan-state.json`)
5. **Handle failure**: If state write fails, print warning but continue (documentation is more important than state)

This incremental write ensures that if the scan is interrupted during workflow or domain model analysis, progress from business logic analysis is preserved.

### Step 5.2: Workflow Analysis

Invoke the documentarian agent's workflow tracing methodology (defined in `scrum_workflow/agents/documentarian.md` Instructions Section 3) to scan the codebase for workflows, state machines, event flows, and processing pipelines. Use `scrum_workflow/templates/workflows-doc.md` as the structural template for the output document.

#### 5.2.1: Grep-Based Workflow Scanning

Scan all source files from the file manifest (Step 3) using the documentarian agent's grep patterns for workflow identification (defined in `scrum_workflow/agents/documentarian.md` Instructions Section 3). These patterns are language-agnostic and work with any directory structure.

The grep patterns include:
- **State machines**: `\b(status|state|transition|fsm|finite.*state|state.*machine)\b`, `\b(pending|in_progress|completed|active|inactive|draft|ready|done|failed|cancelled)\b`
- **Event handlers**: `\bon[A-Z]\w*`, `\bhandle[A-Z]\w*`, `\bemit\b`, `\bdispatch\b`, `\bsubscribe\b`, `\bpublish\b`, `\bevent\b`
- **Pipelines**: `\bpipe\b`, `\buse\b`, `\bmiddleware\b`, `\bchain\b`, `\bstep\b`, `\binterceptor\b`, `\bguard\b`
- **Orchestration**: `\bsaga\b`, `\bworkflow\b`, `\bprocess\b`, `\borchestrat`
- **Async flows**: `\bthen\b`, `\bawait\b`, `\bpromise\b`, `\bcallback\b`, `\bqueue\b`, `\bjob\b`, `\basync\b`

Refer to the agent definition for the complete pattern set and analysis methodology.

#### 5.2.2: Exclusion Filters

Apply the standard exclusion list from Step 3.1 to avoid false positives.

#### 5.2.3: Workflow Categorization

Categorize detected patterns into one of five workflow types using this inference strategy:

1. **State Machines**: Dominated by `status`, `state`, `transition` keywords with explicit state values and transition logic
2. **Event Flows**: Dominated by `on*`, `handle*`, `emit`, `dispatch`, `publish`, `subscribe` patterns with message passing
3. **Process Pipelines**: Dominated by `pipe`, `middleware`, `chain`, `step`, `interceptor` patterns with sequential processing stages
4. **Async Workflows**: Dominated by `then`, `await`, `promise`, `callback`, `async`, `queue`, `job` patterns with asynchronous control flow
5. **Orchestration**: Explicit `saga`, `workflow`, `orchestrat*` keywords indicating business process orchestration

If a file contains multiple workflow types, categorize by the dominant pattern or create separate entries for each type if they are distinct workflows.

#### 5.2.4: Mermaid Diagram Generation

Generate Mermaid diagrams for each workflow type based on complexity:

- **State machines**: Use `stateDiagram-v2` for workflows with explicit state transitions. Show all states, transition events, initial state (`[*] --> StateName`), and terminal states if any.
- **Event flows**: Use `sequenceDiagram` for workflows with multiple participants/services communicating. Show participants as actors, messages as arrows, and message direction (emit -> subscribe).
- **Process pipelines**: Use `flowchart LR` (left-to-right) for linear or branching pipelines. Show stages as nodes, data flow as edges, and any decision points as diamonds.
- **Async flows**: Use `flowchart TD` (top-down) for complex async workflows with multiple promise chains or parallel execution paths.

Only for complex workflows: Simple linear 2-step workflows do NOT need a diagram. Multi-step, branching, or multi-participant workflows DO need a diagram.

Each Mermaid diagram must be in a fenced code block with ` ```mermaid ` language tag and include a descriptive comment above it explaining the workflow being modeled. Use descriptive labels, not code variables (e.g., "Order created" not "emit('order:created')").

#### 5.2.5: Source Reference Format

Every documented workflow must include a source reference in the format `[Source: path/to/file.ext:LINE]` using relative paths from the project root (not absolute paths). If a workflow spans multiple files, include all file:line references for key steps.

For state machines, reference the file where the state machine is defined or where transitions are handled.

#### 5.2.6: Write Output

1. Load the template from `scrum_workflow/templates/workflows-doc.md`
2. Fill the template sections with discovered workflows, following the template structure
3. Populate the Overview section with total workflows found by category (state machines, event flows, pipelines, async workflows) and analysis timestamp
4. Group workflows by type and order by complexity (most complex workflows first within each category)
5. Write the filled document to `_scrum-output/docs/workflows.md`
6. If no workflows are found (static codebase with no dynamic flows), write a minimal document stating "No workflows detected" with the analysis timestamp rather than an empty file

#### 5.2.7: Incremental State Update (Workflow Analysis Complete)

**After workflow analysis completes**, update the scan state file incrementally to preserve progress:

1. **Compute hashes for all scanned files**: For each file in the workflow scan, compute SHA-256 hash of file content
2. **Update files_scanned array**: Append new entries (merge with existing from business logic analysis)
3. **Update last_completed_file**: Set to the last file processed in workflow analysis
4. **Write state atomically**: Use temp file pattern (write to `.scan-state.json.tmp`, verify JSON, rename to `.scan-state.json`)
5. **Handle failure**: If state write fails, print warning but continue

This incremental write ensures that if the scan is interrupted during domain model analysis, progress from business logic and workflow analysis is preserved.

### Step 5.3: Domain Model Analysis

Invoke the documentarian agent's domain entity extraction methodology (defined in `scrum_workflow/agents/documentarian.md` Instructions Section 4) to scan the codebase for domain entities, relationships, value objects, and data structures. Use `scrum_workflow/templates/domain-model.md` as the structural template for the output document.

#### 5.3.1: Grep-Based Domain Entity Scanning

Scan all source files from the file manifest (Step 3) using the documentarian agent's grep patterns for domain entity identification (defined in `scrum_workflow/agents/documentarian.md` Instructions Section 4). These patterns are language-agnostic and work with any directory structure.

The grep patterns include:
- **Class/interface/type definitions**: `\bclass\s+\w+`, `\binterface\s+\w+`, `\btype\s+\w+`, `\bstruct\s+\w+`
- **Entity/model/schema keywords**: `\b(Entity|Model|Schema|DTO|Request|Response|Payload)\b`, `\b@Entity\b`, `\b@Table\b`
- **Relationship keywords**: `\b(hasMany|belongsTo|hasManyThrough|belongsToMany|references|extends|implements|association)\b`, `\b@(OneToMany|ManyToOne|ManyToMany|OneToOne)\b`
- **Enums**: `\benum\s+\w+`, `\bEnum\s+\w+`
- **Database migrations**: `\bcreateTable\b`, `\baddColumn\b`, `\bmigration\b`, `\bschema\.`

Refer to the agent definition for the complete pattern set and analysis methodology.

#### 5.3.2: Exclusion Filters

Apply the standard exclusion list from Step 3.1 to avoid false positives.

#### 5.3.3: Entity Categorization

Categorize detected patterns into one of four entity categories using this inference strategy:

1. **Core Entities**: Domain objects with business meaning (User, Order, Product, Account) -- typically classes/interfaces with attributes and business logic
2. **Entity Relationships**: Foreign keys, associations, inheritance hierarchies -- defined by relationship keywords and type extensions
3. **Value Objects & Enums**: Immutable value types, enumerations, domain constants -- typically enums, sealed classes, or final classes
4. **Data Flow Structures**: DTOs, requests, responses, payloads -- data transfer objects with minimal logic, primarily used for API boundaries

If an entity spans multiple categories, categorize by its primary purpose. Core entities are the main domain objects. DTOs are for data movement. Value objects represent domain concepts with no identity.

#### 5.3.4: Mermaid Diagram Generation

Generate Mermaid diagrams for the domain model based on the detected entities and relationships:

- **Class diagrams**: Always use `classDiagram` for the overall domain model. Show entities as classes with their attributes/methods. Use relationship types: ` inheritance, `*>` composition, `-->` association/dependency.
- **ER diagrams**: Use `erDiagram` when database schemas are detected (migrations, ORM entities). Show tables with columns and data types. Use `||--o{` for one-to-many, `||--||` for one-to-one relationships.

Group entities by bounded context if the codebase has clear domain boundaries (e.g., authentication, billing). Use subgraphs or nested classes where Mermaid syntax supports it. Show relationship direction and multiplicity where discoverable (one-to-one, one-to-many, many-to-many).

For very small codebases (< 5 entities), a simple list may suffice. For larger codebases, diagrams provide significant value.

Each Mermaid diagram must be in a fenced code block with ` ```mermaid ` language tag and include a descriptive comment above it explaining the domain model being visualized. Use descriptive entity names, not necessarily code class names if they're overly technical (e.g., "UserAccount" not just "User" if that clarifies domain role).

#### 5.3.5: Source Reference Format

Every documented entity must include a source reference in the format `[Source: path/to/file.ext:LINE]` using relative paths from the project root (not absolute paths). Use the following conventions:
- Single line: `[Source: src/models/User.ts:42]`
- Ranges: `[Source: src/models/User.ts:42-58]`
- Multiple files: `[Source: src/models/User.ts:42, src/entities/User.ts:15-30]`

If an entity spans multiple files, include all file:line references for key attributes and relationships. For entities with primary definition in one file and relationships in another, reference the primary definition file and note the relationship files separately.

For entities with primary definition in one file and relationships in another, reference the primary definition file and note the relationship files separately.

#### 5.3.6: Bounded Context Grouping

Group entities by bounded context/domain area based on directory structure and naming patterns (e.g., "Authentication", "Billing", "Permissions"). Use the following inference strategy:

1. **Path-based inference**: Extract bounded context from directory structure (e.g., `src/auth/` -> "Authentication", `src/billing/` -> "Billing", `lib/permissions/` -> "Permissions")
2. **File-name inference**: Use file name when path is flat (e.g., `user.ts` -> "User Management", `payment.ts` -> "Payments")
3. **Fallback**: Use the top-level directory name as the bounded context if no semantic match
4. **Ungrouped**: Entities that cannot be categorized go in an "Other / Uncategorized" section

#### 5.3.7: Write Output

1. Load the template from `scrum_workflow/templates/domain-model.md`
2. Fill the template sections with discovered entities, following the template structure
3. Populate the Overview section with total entities found by category (core entities, value objects, enums, DTOs) and analysis timestamp
4. Group entities by bounded context where appropriate
5. **Conditional section**: If database schemas are detected (migrations, ORM entities, schema definitions), fill the Database Schema section with table definitions and ER diagrams. If no schemas detected, omit the entire Database Schema section from the output.
6. Write the filled document to `_scrum-output/docs/domain-model.md`
7. If no entities are found (unlikely for any non-trivial codebase), write a minimal document stating "No domain entities detected" with the analysis timestamp rather than an empty file

#### 5.3.8: Incremental State Update (Domain Model Complete)

**After domain model analysis completes**, update the scan state file incrementally to preserve progress:

1. **Compute hashes for all scanned files**: For each file in the domain model scan, compute SHA-256 hash of file content
2. **Update files_scanned array**: Append new entries (merge with existing from business logic and workflow analysis)
3. **Update last_completed_file**: Set to the last file processed in domain model analysis
4. **Write state atomically**: Use temp file pattern (write to `.scan-state.json.tmp`, verify JSON, rename to `.scan-state.json`)
5. **Handle failure**: If state write fails, print warning but continue

This is the final incremental state update before the final scan state is written in Step 7.

## Step 6: Update Mode

**Only executed when mode is `update`.**

Incrementally update existing documentation by detecting changes since the last scan.

### Step 6.1: Load Existing Scan State

Read `_scrum-output/docs/.scan-state.json` to load the previous scan state.

**If the file does not exist**, print warning and fallback to full-scan mode:

```
Warning: No previous scan state found at '_scrum-output/docs/.scan-state.json'. Running full scan.
```

Then GOTO Step 5 (Full-Scan Mode).

**If the file exists**, parse the JSON and extract:

- `scan_date`: ISO 8601 timestamp of last scan
- `scan_mode`: Mode used for previous scan ("full" or "update")
- `files_scanned`: Array of objects with `path`, `hash`, and `timestamp` for each file
- `documents_generated`: Array of generated document paths
- `scan_duration`: Duration of previous scan in seconds
- `scan_status`: Status of previous scan ("complete" or "interrupted")

**If the JSON is invalid or corrupted**, halt with error:

```
Error: Scan state file is corrupted or invalid. Run '/scrum-create-project-docs' (without --update) first to perform a full scan and regenerate scan state.
```

### Step 6.2: Identify Changed Files

Compare the current file manifest (from Step 3.2) against the stored `files_scanned` array from the scan state to detect what has changed since the last scan.

#### 6.2.1: Hash Computation Implementation

For each file in the current manifest, compute the current hash using the same method as full-scan mode:

**Hash Computation Algorithm:**
1. **Read file content**: Use Read tool to get file content as text (utf-8 encoding)
2. **Compute SHA-256**: Hash the file content bytes (not metadata like mtime, permissions, or file size)
3. **Format hash**: Convert to 64-character hex string and prefix with `sha256:` (format: `sha256:a1b2c3d4e5f6...`)
4. **Handle errors**: If file cannot be read (permission denied, file not found, encoding error), log warning and skip file with message: `Warning: Cannot compute hash for file 'path/to/file': ERROR_TYPE. Skipping file.`

**Hash Computation Pseudocode:**
```python
def compute_file_hash(file_path: str) -> str:
    try:
        content = read_file(file_path)  # Read as UTF-8 text
        hash_bytes = sha256(content.encode('utf-8')).digest()
        hash_hex = hash_bytes.hex()
        return f"sha256:{hash_hex}"
    except FileNotFoundError:
        log_warning(f"File not found: {file_path}")
        return None
    except PermissionError:
        log_warning(f"Permission denied: {file_path}")
        return None
    except Exception as e:
        log_warning(f"Cannot read file {file_path}: {e}")
        return None
```

**Critical**: Hash computation MUST be consistent between full-scan mode and update mode. The same file MUST produce the same hash in both modes.

#### 6.2.2: Hash Comparison and Categorization

For each file in the current manifest:

1. **Check if file is in scan state**: Look for matching `path` in `files_scanned` array from scan state
2. **Compute current hash**: Calculate SHA-256 hash of current file content using algorithm above
3. **Compare hashes**: Compare current hash against stored hash from scan state

Categorize each file into one of four lists:

- **`changed_files`**: Files present in both current manifest AND scan state, but with different hashes (content modified)
- **`new_files`**: Files present in current manifest BUT NOT in scan state (newly created or previously excluded)
- **`deleted_files`**: Files present in scan state BUT NOT in current manifest (removed or now excluded)
- **`unchanged_files`**: Files present in both with matching hashes (no content changes)

**Categorization Logic:**
```python
changed_files = []
new_files = []
deleted_files = []
unchanged_files = []

# Check for changed and unchanged files
for file_path, current_hash in current_manifest.items():
    if file_path in scan_state_files:
        stored_hash = scan_state_files[file_path].hash
        if current_hash != stored_hash:
            changed_files.append(file_path)
        else:
            unchanged_files.append(file_path)
    else:
        new_files.append(file_path)

# Check for deleted files
for file_path in scan_state_files.keys():
    if file_path not in current_manifest:
        deleted_files.append(file_path)
```

#### 6.2.3: No Changes Detected Handling

**If ALL three change lists are empty** (changed_files, new_files, deleted_files are all empty):

```
No business logic changes detected since last scan.
Documentation is up to date. Exiting.
```

Then EXIT successfully without modifying any files or scan state. This is a success case — the codebase is unchanged since the last scan.

### Step 6.3: Re-Analyze Changed Areas

For each file in `changed_files` and `new_files`, determine which documentation sections are affected by re-running targeted analysis.

#### 6.3.1: Load Existing Documentation

Load the three existing documentation files as baseline:

- `_scrum-output/docs/business-logic.md` (if exists)
- `_scrum-output/docs/workflows.md` (if exists)
- `_scrum-output/docs/domain-model.md` (if exists)

**If a documentation file is missing**, print warning but continue:

```
Warning: Document '_scrum-output/docs/DOCUMENT.md' not found. Will regenerate from scratch.
```

#### 6.3.2: Targeted Business Rule Analysis

For each changed/new file, run the documentarian agent's business rule identification methodology (from Instructions Section 2) using grep patterns:

- Scan for business rules, validations, guard clauses, policy/rule/strategy patterns
- Extract new findings with source references `[Source: path/to/file.ext:LINE]`
- Group by domain area using path-based inference
- Generate Mermaid flowcharts for complex rules (3+ branches)

Apply the standard exclusion list from Step 3.1.

#### 6.3.3: Targeted Workflow Analysis

For each changed/new file, run the documentarian agent's workflow tracing methodology (from Instructions Section 3) using grep patterns:

- Scan for state machines, event handlers, pipelines, orchestration, async flows
- Extract new workflow definitions with source references
- Categorize into workflow types (state machines, event flows, process pipelines, async workflows, orchestration)
- Generate appropriate Mermaid diagrams (stateDiagram-v2, sequenceDiagram, flowchart LR/TD)

#### 6.3.4: Targeted Domain Entity Analysis

For each changed/new file, run the documentarian agent's domain entity extraction methodology (from Instructions Section 4) using grep patterns:

- Scan for class/interface/type definitions, entities, relationships, DTOs, enums
- Extract new entity definitions with attributes and relationships
- Categorize into entity types (core entities, relationships, value objects & enums, data flow structures)
- Generate Mermaid classDiagram or erDiagram as appropriate

#### 6.3.5: Merge Findings with Existing Documentation

For each document type, merge the new findings with existing documentation using section-level diff and merge. This preserves unchanged sections verbatim while updating only the sections that changed.

**Merge Strategy:**
- **Preserve unchanged sections**: Keep existing content for rules/workflows/entities from unchanged files
- **Update changed sections**: Replace existing content for rules/workflows/entities from changed files with new findings
- **Add new sections**: Insert new rules/workflows/entities from new files
- **Remove deleted sections**: Remove rules/workflows/entities from deleted files

**Section-Level Merge Implementation:**

1. **Parse existing document into sections**: Use Markdown headers (`##`, `###`) as delimiters to split the document into sections
2. **Build section index**: Create a map of section titles to section content for fast lookup
3. **Identify changed sections**: For each section, check if any findings in that section reference files in `changed_files` or `new_files`
4. **Mark sections for update**: Sections with findings from changed/new files are marked for replacement
5. **Mark sections for deletion**: Sections with all findings from `deleted_files` are marked for removal
6. **Mark sections for preservation**: Sections with no findings from changed/new/deleted files are preserved verbatim
7. **Generate new section content**: For sections marked for update, generate new content using template structure
8. **Reassemble document**: Merge preserved sections with updated/new sections, maintaining section order

**Merge Pseudocode:**
```python
def merge_document_sections(
    existing_doc: str,
    new_findings: List[Finding],
    changed_files: List[str],
    new_files: List[str],
    deleted_files: List[str]
) -> str:
    # Parse existing document into sections
    existing_sections = parse_document_sections(existing_doc)
    updated_sections = {}

    for section_title, section_content in existing_sections.items():
        # Extract source references from section
        section_files = extract_source_files(section_content)

        # Determine section fate
        if all(f in deleted_files for f in section_files):
            # Section entirely from deleted files -> remove
            continue
        elif any(f in changed_files or f in new_files for f in section_files):
            # Section has changed/new files -> update
            updated_sections[section_title] = generate_section_content(
                section_title,
                new_findings,
                changed_files + new_files
            )
        else:
            # Section unchanged -> preserve verbatim
            updated_sections[section_title] = section_content

    # Add entirely new sections (not in existing doc)
    new_section_titles = identify_new_sections(new_findings, existing_sections.keys())
    for section_title in new_section_titles:
        updated_sections[section_title] = generate_section_content(
            section_title,
            new_findings,
            changed_files + new_files
        )

    # Reassemble document preserving order
    return reassemble_document(existing_sections.keys(), updated_sections)
```

**Section Update Logic by Document Type:**

For `business-logic.md`:
- **Business Rules section**: Update rules from changed/new files, remove rules from deleted files, preserve unchanged rules
- **Validation Rules section**: Update validations from changed/new files, remove validations from deleted files, preserve unchanged validations
- **Guard Clauses & Access Control section**: Update guards from changed/new files, remove guards from deleted files, preserve unchanged guards
- **Business Constants & Configuration section**: Update constants from changed/new files, remove constants from deleted files, preserve unchanged constants

For `workflows.md`:
- **State Machines section**: Update state machines from changed/new files, remove state machines from deleted files, preserve unchanged state machines
- **Event Flows section**: Update event flows from changed/new files, remove event flows from deleted files, preserve unchanged event flows
- **Process Pipelines section**: Update pipelines from changed/new files, remove pipelines from deleted files, preserve unchanged pipelines
- **Async Workflows section**: Update async workflows from changed/new files, remove async workflows from deleted files, preserve unchanged async workflows

For `domain-model.md`:
- **Core Entities section**: Update entities from changed/new files, remove entities from deleted files, preserve unchanged entities
- **Entity Relationships section**: Update relationships from changed/new files, remove relationships from deleted files, preserve unchanged relationships
- **Value Objects & Enums section**: Update value objects from changed/new files, remove value objects from deleted files, preserve unchanged value objects
- **Data Flow Structures section**: Update DTOs from changed/new files, remove DTOs from deleted files, preserve unchanged DTOs

**Preservation Guarantees:**
- **Unchanged sections are preserved verbatim**: Formatting, ordering, comments, and structure are maintained exactly as in the existing document
- **Section order is preserved**: New sections are inserted at appropriate positions, existing sections maintain their relative order
- **Manual edits are preserved**: Any manual edits to formatting, comments, or structure in unchanged sections are retained
- **Source references are updated**: All source references (file:line) are updated to reflect current file locations

**Deletion Handling:**
For findings from deleted files:
- Remove entire finding entries (rules/workflows/entities) that reference deleted files
- Update source references by removing deleted file references
- If a section becomes empty after removal, remove the entire section header
- If a subsection becomes empty after removal, remove the subsection but preserve parent section

### Step 6.4: Present Diff Summary

Display a clear, actionable summary of proposed documentation changes to the user BEFORE any files are modified. This enables the user to understand what will change before confirming the update.

#### 6.4.1: Load Existing Documentation for Comparison

Load each existing documentation file to establish a baseline for comparison:

- `_scrum-output/docs/business-logic.md` (if exists)
- `_scrum-output/docs/workflows.md` (if exists)
- `_scrum-output/docs/domain-model.md` (if exists)

**If a documentation file is missing**, print warning but continue:

```
Warning: Document '_scrum-output/docs/DOCUMENT.md' not found. Will regenerate from scratch.
Changes for this document will be counted as additions.
```

#### 6.4.2: Parse Existing Documentation into Sections

For each existing document, parse it into sections to enable granular comparison:

**Parsing Strategy:**
- Use Markdown headers (`##`, `###`) as section delimiters
- Extract section content between headers
- Preserve section order and nesting level
- Track section titles for matching against new findings

**Parsing Pseudocode:**
```python
def parse_document_sections(doc_content: str) -> Dict[str, Section]:
    sections = {}
    current_section = None
    current_content = []

    for line in doc_content.split('\n'):
        if line.startswith('##'):
            # Save previous section
            if current_section:
                sections[current_section] = '\n'.join(current_content)
            # Start new section
            current_section = line.strip()
            current_content = []
        else:
            current_content.append(line)

    # Save last section
    if current_section:
        sections[current_section] = '\n'.join(current_content)

    return sections
```

**Section Types by Document:**
- `business-logic.md`: "## Business Rules", "## Validation Rules", "## Guard Clauses & Access Control", "## Business Constants & Configuration"
- `workflows.md`: "## State Machines", "## Event Flows", "## Process Pipelines", "## Async Workflows"
- `domain-model.md`: "## Core Entities", "## Entity Relationships", "## Value Objects & Enums", "## Data Flow Structures"

#### 6.4.3: Compare New Findings Against Existing Sections

For each document type, compare new findings from Step 6.3 against existing sections:

**Comparison Logic:**

1. **Additions (+N new)**: Count findings in new scan that are NOT present in existing docs
   - New rule/workflow/entity names not found in existing sections
   - New sections that didn't exist before
   - New source references (file:line combinations) for existing rules/workflows/entities

2. **Modifications (~N modified)**: Count findings that exist in both but have different content
   - Existing rule/workflow/entity with changed description or business context
   - Existing rule/workflow/entity with updated source references (file:line changed)
   - Existing rule/workflow/entity with changed or added Mermaid diagrams

3. **Deletions (-N removed)**: Count findings in existing docs that are NOT found in new scan
   - Existing rules/workflows/entities that reference deleted files (from `deleted_files` list)
   - Existing rules/workflows/entities not found in changed/new files
   - Entire sections that become empty after removal

**Comparison Implementation:**

For business logic:
```python
def compare_business_rules(existing_sections: Dict, new_findings: List[Rule]) -> DiffCounts:
    existing_rules = extract_rule_names(existing_sections["## Business Rules"])
    new_rules = [rule.name for rule in new_findings]

    additions = len(set(new_rules) - set(existing_rules))
    deletions = len(set(existing_rules) - set(new_rules))
    modifications = count_modified_rules(existing_sections, new_findings)

    return DiffCounts(additions, modifications, deletions)
```

For workflows:
```python
def compare_workflows(existing_sections: Dict, new_findings: List[Workflow]) -> DiffCounts:
    existing_workflows = extract_workflow_names(existing_sections)
    new_workflows = [wf.name for wf in new_findings]

    additions = len(set(new_workflows) - set(existing_workflows))
    deletions = len(set(existing_workflows) - set(new_workflows))
    modifications = count_modified_workflows(existing_sections, new_findings)

    return DiffCounts(additions, modifications, deletions)
```

For domain entities:
```python
def compare_entities(existing_sections: Dict, new_findings: List[Entity]) -> DiffCounts:
    existing_entities = extract_entity_names(existing_sections)
    new_entities = [entity.name for entity in new_findings]

    additions = len(set(new_entities) - set(existing_entities))
    deletions = len(set(existing_entities) - set(new_entities))
    modifications = count_modified_entities(existing_sections, new_findings)

    return DiffCounts(additions, modifications, deletions)
```

#### 6.4.4: Format Diff Summary

Print the diff summary in this format:

```
Documentation changes detected since last scan:

Business Logic Documentation (_scrum-output/docs/business-logic.md):
  +X new business rules
  ~X modified business rules
  -X removed business rules

Workflow Documentation (_scrum-output/docs/workflows.md):
  +X new workflows
  ~X modified workflows
  -X removed workflows

Domain Model Documentation (_scrum-output/docs/domain-model.md):
  +X new entities
  ~X modified entities
  -X removed entities

Total: +X new, ~X modified, -X removed across 3 documents

Review the changes above. You will be asked to confirm before any files are modified.
```

**Formatting Rules:**
- Use `+` symbol for additions (green in colorized terminals)
- Use `~` symbol for modifications (yellow in colorized terminals)
- Use `-` symbol for deletions (red in colorized terminals)
- Align counts vertically for readability
- Show zero counts explicitly (e.g., `+0 new workflows`) rather than omitting
- Group by document type with clear section headers

**If there are no changes for a document type**, show that explicitly:

```
Business Logic Documentation (_scrum-output/docs/business-logic.md):
  No changes detected
```

**If a document file is missing** (will be regenerated), show:

```
Business Logic Documentation (_scrum-output/docs/business-logic.md):
  Document not found. Will regenerate from scratch.
  +X business rules will be documented
```

#### 6.4.5: Diff Summary Validation

Before presenting the diff summary to the user, validate the counts:

- **Total changes across all documents must be non-zero**: If all counts are zero (no additions, modifications, or deletions), GOTO Step 6.2.3 "No Changes Detected Handling" and exit
- **Counts must be non-negative**: Negative counts indicate a bug in comparison logic
- **Additions + deletions + modifications must equal total findings**: Verify arithmetic consistency
- **Deleted files must be reflected in deletions**: Ensure findings from `deleted_files` are counted as deletions

If validation fails, halt with error:

```
Error: Diff summary validation failed. Counts are inconsistent.
Additions: X, Modifications: Y, Deletions: Z, Total Findings: W
Fix: Review comparison logic in Step 6.4.3
```

### Step 6.5: User Confirmation

Prompt the user to confirm or reject the proposed changes.

Print prompt:

```
Apply these changes? [y/N]
```

**Wait for user input.**

- **If user enters "y" or "Y"**: Proceed to Step 6.6 (Apply Updates)
- **If user enters anything else** (including "n", "N", empty, or any other input): Halt with message:

```
Update cancelled. No files modified. Existing docs preserved.
```

Then EXIT successfully.

**Important**: The default is NO (safe default). Only explicit "y" or "Y" proceeds with the update.

### Step 6.6: Apply Updates

**Only executed if user confirmed with "y" or "Y" in Step 6.5.**

Update the affected documentation files with the new analysis results using atomic writes to prevent corruption.

#### 6.6.1: Update Documents Incrementally

For each document type that has changes:

1. **Load existing document content** (or use template if document doesn't exist)
2. **Apply section-level merge** using the strategy from Step 6.3.5
3. **Preserve unchanged sections** verbatim (formatting, ordering, etc.)
4. **Update changed sections** with new findings
5. **Add new sections** for new findings
6. **Remove deleted sections** for findings from deleted files
7. **Update source references** to reflect new file:line locations

#### 6.6.2: Atomic Write Pattern

For each document file, use atomic writes to prevent corruption if the workflow is interrupted during the write operation. Atomic writes ensure that either the entire file is written successfully or no changes are made at all.

**Atomic Write Algorithm:**

1. **Generate temp file path**: Create a temporary file path by appending `.tmp` to the target path
   - Example: `_scrum-output/docs/business-logic.md` → `_scrum-output/docs/business-logic.md.tmp`

2. **Clean up existing temp file**: If a temp file already exists from a previous interrupted run, delete it first to prevent rename conflicts
   - Check if `_scrum-output/docs/DOCUMENT.md.tmp` exists
   - If exists, delete it before proceeding

3. **Write to temp file**: Write the updated document content to the temporary file path
   - Use Write tool to write content to temp file path
   - Ensure content is valid Markdown (properly formatted, non-empty)

4. **Verify temp file**: After writing, verify the temp file is valid
   - Check file exists at temp path
   - Check file is non-empty (size > 0 bytes)
   - Check file contains valid Markdown (has headers, proper formatting)
   - If verification fails, delete temp file and halt with error

5. **Atomic rename**: Rename the temp file to the actual target path (atomic operation on most filesystems)
   - Use Bash tool with `mv` command or equivalent atomic rename operation
   - On POSIX-compliant filesystems, `mv` is atomic when source and destination are on the same filesystem
   - This ensures the file content is updated atomically — readers see either the old file or the new file, never a partially written file

6. **Handle rename failure**: If the rename operation fails, delete the temp file and halt with error
   - Check if rename succeeded by verifying target file exists and temp file no longer exists
   - If rename failed: delete temp file, halt with error message

7. **Continue to next document**: Only proceed to the next document after successful rename of the current document

**Atomic Write Pseudocode:**
```python
def atomic_write(file_path: str, content: str) -> None:
    temp_path = f"{file_path}.tmp"

    try:
        # Clean up existing temp file if present
        if file_exists(temp_path):
            delete_file(temp_path)

        # Write to temp file
        write_file(temp_path, content)

        # Verify temp file
        if not file_exists(temp_path):
            raise IOError("Temp file was not created")
        if get_file_size(temp_path) == 0:
            raise IOError("Temp file is empty")
        if not is_valid_markdown(read_file(temp_path)):
            raise IOError("Temp file contains invalid Markdown")

        # Atomic rename
        rename_file(temp_path, file_path)

        # Verify rename succeeded
        if not file_exists(file_path):
            raise IOError("Target file does not exist after rename")
        if file_exists(temp_path):
            raise IOError("Temp file still exists after rename")

    except Exception as e:
        # Clean up temp file on any error
        if file_exists(temp_path):
            delete_file(temp_path)
        raise IOError(f"Cannot write document '{file_path}': {e}")
```

**Error Handling:**

If any step fails during the atomic write process:

```
Error: Cannot write document '_scrum-output/docs/DOCUMENT.md': OPERATION_FAILED
Update aborted. Partial changes may exist. Check file permissions and disk space.
Details: {specific error details}
```

**Transaction Semantics:**

The atomic write pattern provides transaction-like semantics for document updates:

- **All-or-nothing**: Either all documents are updated successfully (commit) or no documents are modified (rollback)
- **No partial corruption**: A reader will never see a partially written document — they see either the complete old document or the complete new document
- **Rollback on failure**: If any document update fails, previously updated documents are NOT rolled back (they were successfully committed), but the workflow halts immediately to prevent further updates

**Failure Scenarios:**

| Scenario | Behavior | Recovery |
|---|---|---|
| Disk full during temp write | Temp file write fails, no changes made to target file | Free disk space and retry |
| Permission denied on temp file | Temp file write fails, error message "Permission denied" | Check directory permissions |
| Permission denied on target rename | Rename fails, temp file deleted, error message | Check target file permissions |
| Power loss during write | Either temp file exists (incomplete) or target file unchanged | Delete temp file and retry |
| Process killed during write | Either temp file exists (incomplete) or target file unchanged | Delete temp file and retry |

**Benefits of Atomic Writes:**

1. **Data integrity**: Prevents partially written or corrupted documents
2. **Recoverability**: Interruptions during write leave either the old document or a temp file (which can be deleted)
3. **Consistency**: Readers always see a consistent document state, never a partially written state
4. **Debugging**: Temp files from failed writes can be inspected for debugging (before cleanup)

#### 6.6.3: Handle Deleted Files

For files in `deleted_files` list:

- Remove all findings (rules/workflows/entities) that reference the deleted file
- Update source references by removing the deleted file references
- If a section becomes empty after removal, remove the entire section

### Step 6.7: Update Scan State

**Only executed if all documents were successfully updated in Step 6.6.**

Update `_scrum-output/docs/.scan-state.json` with new scan metadata.

#### 6.7.1: Generate New Scan State

Create updated scan state object:

```json
{
  "scan_date": "CURRENT_TIMESTAMP_ISO_8601",
  "scan_mode": "update",
  "files_scanned": [
    // Merge unchanged_files (kept old hash and timestamp) + changed_files + new_files (new hash and timestamp)
    // Exclude deleted_files
  ],
  "documents_generated": [
    "_scrum-output/docs/business-logic.md",
    "_scrum-output/docs/workflows.md",
    "_scrum-output/docs/domain-model.md"
  ],
  "scan_duration": UPDATE_DURATION_SECONDS,
  "scan_status": "complete"
}
```

Where:
- `CURRENT_TIMESTAMP_ISO_8601`: Current time in ISO 8601 format (e.g., "2026-03-30T12:34:56Z")
- `files_scanned`: Array combining unchanged files (preserved from old state) + changed files (new hash) + new files (new hash)
- `UPDATE_DURATION_SECONDS`: Time taken for update mode execution (must be non-negative)
- `scan_status`: Always "complete" for successful update

**Validation:** Ensure `files_scanned` array is non-empty and `scan_duration` is non-negative before writing scan state.

#### 6.7.2: Atomic Scan State Write

Use atomic write pattern for scan state file:

1. **Write to temp file**: Write scan state to `_scrum-output/docs/.scan-state.json.tmp`
2. **Verify temp file**: Ensure temp file is valid JSON
3. **Atomic rename**: Rename temp file to `_scrum-output/docs/.scan-state.json`
4. **Handle failure**: If rename fails, print warning but continue:

```
Warning: Could not update scan state file. Update was successful but scan state is stale.
Fix: Check file permissions for '_scrum-output/docs/.scan-state.json'.
```

The documentation update is still successful even if scan state update fails (non-critical).

#### 6.7.3: Print Success Message

After successful scan state update, print:

```
Documentation updated successfully.
- Updated X business rules
- Updated X workflows
- Updated X entities
Scan state updated. Next update will analyze only files changed since this scan.
```

### Step 6.8: Error Handling and Rollback

If any error occurs during document update (Step 6.6) or scan state update (Step 6.7):

1. **Halt immediately**: Stop processing any further documents
2. **Rollback partial changes**: If temp files exist, delete them
3. **Do not update scan state**: Scan state is NOT updated on failure to maintain consistency
4. **Print error message**: Clear error message explaining what failed and why
5. **Exit with error status**: Indicate failure to caller

**Error scenarios**:

| Situation | Error Message | Error Type |
|---|---|---|
| Document read fails | `Error: Cannot read document '_scrum-output/docs/DOCUMENT.md': PERMISSION_DENIED` | Critical - Halt |
| Document write fails | `Error: Cannot write document '_scrum-output/docs/DOCUMENT.md': DISK_FULL. Free space and retry.` | Critical - Halt |
| Scan state read fails | `Error: Cannot read scan state '_scrum-output/docs/.scan-state.json': PERMISSION_DENIED` | Critical - Halt |
| Scan state write fails | `Warning: Could not update scan state file. Update was successful but scan state is stale.` | Non-critical - Continue |
| Hash computation fails | `Warning: Cannot compute hash for file 'path/to/file': PERMISSION_DENIED. Skipping file.` | Non-critical - Continue |
| User rejects update | `Update cancelled. No files modified. Existing docs preserved.` | User decision - Exit |

**Error Handling Policy:** Critical errors halt the workflow immediately. Non-critical errors log warnings and continue where possible.

## Step 7: Scan State Persistence

**Only executed when mode is `full-scan`.**

Write the scan state file after successful full-scan documentation generation.

**Note:** This is the FINAL scan state write after all analysis steps complete. During the scan, incremental state updates are written after each analysis step (see Step 5.1.7, 5.2.7, 5.3.8) to preserve progress if interrupted.

### Step 7.1: Generate Scan State

Create `_scrum-output/docs/.scan-state.json` with complete scan metadata:

```json
{
  "_comment": "Tracks scan progress for incremental updates and resumption. Local file — not committed to git.",
  "scan_date": "2026-03-30T12:34:56Z",
  "scan_mode": "full",
  "files_scanned": [
    {
      "path": "src/auth/service.ts",
      "hash": "sha256:a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd",
      "timestamp": "2026-03-30T12:34:50Z"
    },
    {
      "path": "src/billing/invoice.ts",
      "hash": "sha256:9f8e7d6c5b4a3210fedcba9876543210fedcba9876543210fedcba9876543210",
      "timestamp": "2026-03-30T12:34:52Z"
    }
  ],
  "documents_generated": [
    "_scrum-output/docs/business-logic.md",
    "_scrum-output/docs/workflows.md",
    "_scrum-output/docs/domain-model.md"
  ],
  "scan_duration": 45.2,
  "scan_status": "complete"
}
```

**Field descriptions**:
- `_comment`: Human-readable explanation of file purpose
- `scan_date`: ISO 8601 timestamp when scan completed
- `scan_mode`: Execution mode — "full", "update", or "resume"
- `files_scanned`: Array of all files processed (with hashes and timestamps)
- `documents_generated`: Array of document file paths created/updated
- `scan_duration`: Time taken for scan (in seconds)
- `scan_status`: "complete" (finished normally) or "interrupted" (stopped early)
- `last_completed_file`: Last file processed before interruption. ONLY present when `scan_status` is "interrupted". Omitted when `scan_status` is "complete".

Compute SHA-256 hash for each file in the file manifest (from Step 3.2) to enable change detection in update mode. Hash computation MUST use file content (not metadata like mtime) for reliability.

**Hash Computation Implementation:**
- Read file content as text (utf-8 encoding)
- Compute SHA-256 hash of content bytes
- Convert hash to 64-character hex string
- Prefix with `sha256:` for clarity (format: `sha256:a1b2c3d4e5f6...`)
- Handle errors gracefully: if file cannot be read (permission denied, file not found), log warning and skip file

### Step 7.2: Atomic Scan State Write

Use atomic write pattern to prevent corruption:

1. **Clean up any existing temp file**: If `.scan-state.json.tmp` exists from a previous interrupted run, delete it first to prevent rename conflicts.
2. **Write to temp file**: Write scan state to `_scrum-output/docs/.scan-state.json.tmp`
3. **Verify temp file**: Ensure temp file is valid JSON and non-empty
4. **Atomic rename**: Rename temp file to `_scrum-output/docs/.scan-state.json`
5. **Handle failure**: If rename fails, delete temp file and halt with error:

```
Error: Cannot write scan state file '_scrum-output/docs/.scan-state.json': OPERATION_FAILED
Documentation was generated successfully but scan state is stale. Check file permissions and disk space.
```

**Note**: The documentation generation is still successful even if scan state write fails (non-critical for initial scan, but update mode requires scan state).

### Step 7.3: Print Completion Summary

After successful scan state write, print:

```
Full scan complete.
Generated 3 documents:
- _scrum-output/docs/business-logic.md (X business rules)
- _scrum-output/docs/workflows.md (X workflows)
- _scrum-output/docs/domain-model.md (X entities)
Scan state saved. Next run can use --update flag for incremental updates.
```

### Step 7.4: Update .gitignore (First Run Only)

Check if `.gitignore` exists in project root.

**If `.gitignore` does not exist**, create it with:
```
# Scan state files (local, not committed)
_scrum-output/docs/.scan-state.json
_scrum-output/docs/.arch-scan-state.json
```

**If `.gitignore` exists**, check if scan state entries are present:
- If entries are NOT present, append them to the file
- If entries ARE present, skip this step

After updating (or if already present), print:
```
Added scan state files to .gitignore (scan state is local, not committed to git)
```

**Rationale**: Scan state files are local development artifacts that should not be committed to version control. File hashes change with every code change, which would cause constant merge conflicts. State can be regenerated by running a full scan.

## Write Boundaries

This workflow may write:

- `_scrum-output/docs/business-logic.md`
- `_scrum-output/docs/workflows.md`
- `_scrum-output/docs/domain-model.md`
- `_scrum-output/docs/.scan-state.json`

This workflow may NOT write to `scrum_workflow/`, `_scrum-output/sprints/`, `context/`, or `.claude/skills/`:

- `scrum_workflow/` -- Framework files are read-only during execution
- `_scrum-output/sprints/` -- Sprint files are managed by other commands
- `context/` -- Context files are managed by `/scrum-create-project-context`
- `.claude/skills/` -- Adapter skills are static, not modified at runtime

## Interruption Detection and Recovery

The workflow supports graceful interruption and resumption to prevent loss of progress on large codebase scans.

### Interruption Types

| Interruption Type | Detection Method | Recovery Action |
|---|---|---|
| User cancellation (Ctrl+C) | Catch SIGINT signal | Set status to "interrupted", record last_completed_file, write state file, exit cleanly |
| Context window limit | Token count exceeds limit | Set status to "interrupted", record current file, write state file |
| Unexpected error | Try-catch around analysis steps | Set status to "interrupted", record last successful file, write state file |
| System crash | No detection (crash is immediate) | On next run, state file will have "interrupted" status from last write |

### Interruption Handling Steps

When an interruption is detected during any analysis step:

1. **Set scan_status**: Change to "interrupted"
2. **Record progress**: Set `last_completed_file` to the last successfully processed file
3. **Write state file**: Use atomic write pattern to preserve progress up to last incremental state update
4. **Print message**: "Scan interrupted. Progress saved. Resume by running command again."
5. **Exit cleanly**: Ensure all temp files are cleaned up

### Resumption Flow

When a scan is resumed after interruption:

1. **Load state file**: Read `.scan-state.json`
2. **Check status**: If `scan_status: interrupted`, proceed with resumption
3. **Identify resume point**: Read `last_completed_file` to know where to continue
4. **Skip processed files**: All files in `files_scanned` array are skipped (already analyzed)
5. **Continue from next file**: Start analysis from file after `last_completed_file`
6. **Update status**: When scan completes, change `scan_status` from "interrupted" to "complete"
7. **Clean up**: Remove `last_completed_file` field (only needed for interrupted scans)

**Example**:
```
Original scan (interrupted):
- Processed: src/auth/service.ts, src/billing/invoice.ts
- Interrupted while processing: src/orders/controller.ts
- State file: scan_status=interrupted, last_completed_file=src/billing/invoice.ts

Resumed scan:
- Skips: src/auth/service.ts, src/billing/invoice.ts (already in files_scanned)
- Continues from: src/orders/controller.ts (file after last_completed_file)
- Completes remaining files
- State file: scan_status=complete, last_completed_file removed
```

## Validation Rules

- Every generated `_scrum-output/docs/*.md` file must contain valid Markdown with properly formatted Mermaid code blocks
- All documented elements must include source references in `file:line` format
- `.scan-state.json` must contain valid JSON with all required fields
- Output directory must be `_scrum-output/docs/` relative to project root -- never inside `scrum_workflow/`
- All filenames must use kebab-case
- All JSON fields must use snake_case
