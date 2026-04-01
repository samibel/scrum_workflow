# Story 10.1: Doc-Discovery Phase for Refinement

Status: done

## Story

As a developer,
I want the refinement command to explicitly ask for additional documents before starting agent analysis,
so that agents consider all relevant project context (architecture docs, API specs, standards) during refinement.

## Acceptance Criteria

1. **Doc-discovery prompt appears**: When `/scrum-refine-ticket SW-XXX` runs, the command first loads auto-detected context from `_scrum-output/context/`, then prompts the user: "**Document Discovery** — Are there additional documents I should consider for this refinement? Examples: Architecture docs, API specs, coding standards, external references. Provide paths or URLs, or type **skip** to proceed."

2. **Path validation**: If the user provides file paths, the command validates each path exists before proceeding

3. **URL fetching**: If the user provides URLs, the command fetches and validates content is accessible

4. **Agent context integration**: All discovered documents are added to the agent context for all three agents (Architect, Developer, QA)

5. **Refinement documentation**: Discovered documents are listed in `refinement.md` under a new "## Document Discovery" section

6. **Skip option**: If user types "skip", the command proceeds with only auto-detected context from `_scrum-output/context/`

7. **Pre-agent phase**: The doc-discovery phase completes before any agents are spawned

## Tasks / Subtasks

- [x] Task 1: Update refine-ticket command (AC: #1, #7)
  - [x] 1.1: Add doc-discovery phase before agent spawning in `scrum_workflow/commands/refine-ticket.md`
  - [x] 1.2: Add doc-discovery prompt text with examples and skip option
  - [x] 1.3: Ensure doc-discovery runs after status update but before context loading

- [x] Task 2: Update refinement workflow (AC: #2, #3, #4, #7)
  - [x] 2.1: Add "Step 4.5: Doc-Discovery Phase" section to `scrum_workflow/workflows/refinement.md`
  - [x] 2.2: Implement path validation logic for file paths
  - [x] 2.3: Implement URL fetching logic with accessibility check
  - [x] 2.4: Add discovered documents to agent context bundles (all three agents)
  - [x] 2.5: Store discovered documents list for refinement.md inclusion

- [x] Task 3: Update refinement template (AC: #5)
  - [x] 3.1: Add "## Document Discovery" section to `scrum_workflow/templates/refinement.md`
  - [x] 3.2: Add template placeholders for discovered paths and URLs

- [x] Task 4: Update command frontmatter
  - [x] 4.1: Add `doc_discovery: true` to `scrum_workflow/commands/refine-ticket.md` frontmatter features

- [x] Task 5: Validation
  - [x] 5.1: Verify doc-discovery prompts before agents spawn
  - [x] 5.2: Verify path validation works for valid and invalid paths
  - [x] 5.3: Verify skip option proceeds with auto-detected context only
  - [x] 5.4: Verify discovered docs appear in all three agent contexts

## Dev Notes

### Critical Context from Existing Refinement Workflow

The current refinement workflow (`scrum_workflow/workflows/refinement.md`) has these phases:
1. Step 1: Validation (prerequisites, status guard, file integrity)
2. Step 2: Input Parsing (ticket number extraction)
3. Step 3: Update Story Status
4. Step 4: Context Loading (auto-detected from `_scrum-output/context/`)
5. Step 5-7: Agent Spawning (Architect, Developer, QA)
6. Step 8-9: Display and Feedback
7. Step 10: Synthesis
8. Step 11: Readiness Check

**Doc-discovery should be inserted between Step 4 (Context Loading) and Step 5 (Agent Spawning).**

### Current Context Loading Behavior

From `scrum_workflow/workflows/refinement.md` Step 4:
- Loads `_scrum-output/context/index.md`
- Determines domain from story content keywords
- Loads domain-specific context from `_scrum-output/context/{domain}.md`

**This behavior should remain unchanged.** Doc-discovery is additive - it prompts for additional documents beyond auto-detected context.

### Agent Context Bundle Structure

Each agent currently receives:
1. `_scrum-output/sprints/SW-XXX/story.md`
2. `_scrum-output/context/index.md`
3. Domain-specific context (e.g., `_scrum-output/context/backend.md`)
4. Agent role definition (e.g., `scrum_workflow/agents/architect.md`)

**After doc-discovery, each agent should also receive:**
5. All discovered documents from doc-discovery phase

### Implementation Pattern

Follow the existing workflow step pattern from `scrum_workflow/workflows/refinement.md`:

```markdown
## Step 4.5: Doc-Discovery Phase

### Step 4.5.1: Prompt User for Additional Documents

After auto-detected context is loaded, prompt the user:

"""
**Document Discovery**

Auto-detected context loaded from `_scrum-output/context/`:
- context/index.md (project overview)
- context/{domain}.md (domain-specific context)

Are there additional documents I should consider for this refinement?
Examples: Architecture docs, API specs, coding standards, external references.

Provide file paths or URLs (one per line), or type **skip** to proceed.
"""

### Step 4.5.2: Collect User Input

Wait for user response. Parse input:
- Lines starting with `http://` or `https://` → URLs
- Other lines → file paths
- `skip` → proceed with auto-detected context only

### Step 4.5.3: Validate Paths

For each file path provided:
- Check if path exists using file system
- If path is relative, resolve from project root
- Collect validation errors for invalid paths

**On validation failure**, display:
"""
⚠️ Document not found: {path}
Continue with remaining documents? [yes/no]
"""

### Step 4.5.4: Fetch URLs

For each URL provided:
- Fetch content using WebFetch or equivalent
- Validate content is accessible (HTTP 200)
- Store fetched content for agent context

**On fetch failure**, display:
"""
⚠️ URL not accessible: {url} (status: {status})
Continue with remaining documents? [yes/no]
"""

### Step 4.5.5: Store Discovered Documents

Store list of discovered documents for:
1. Agent context injection (Step 5-7)
2. Refinement.md documentation (Step 10)

Store as `{discovered_documents}` array with structure:
```json
[
  {"type": "path", "value": "docs/architecture.md", "valid": true},
  {"type": "url", "value": "https://api.example.com/docs", "valid": true}
]
```
```

### Files to Modify

1. **scrum_workflow/commands/refine-ticket.md**:
   - Add doc-discovery phase description
   - Update frontmatter with `doc_discovery: true`

2. **scrum_workflow/workflows/refinement.md**:
   - Add Step 4.5: Doc-Discovery Phase
   - Update agent context bundles to include discovered documents
   - Pass discovered documents to refinement.md creation

3. **scrum_workflow/templates/refinement.md**:
   - Add "## Document Discovery" section

### Command Frontmatter Update

Add to `scrum_workflow/commands/refine-ticket.md`:
```yaml
features:
  doc_discovery: true
```

### Anti-Patterns to Avoid

1. **Do not skip auto-detected context**: Doc-discovery is additive, not replacement
2. **Do not block on invalid documents**: Allow user to continue with remaining valid documents
3. **Do not fetch URLs synchronously**: Consider timeout handling for slow URLs
4. **Do not modify agent role definitions**: Agents remain unchanged

### Testing Considerations

Manual testing scenarios:
1. Skip doc-discovery → agents receive only auto-detected context
2. Provide valid paths → agents receive auto-detected + discovered documents
3. Provide invalid path → warning shown, continue option
4. Provide URL → fetch and include in agent context
5. Provide inaccessible URL → warning shown, continue option

### References

- [Source: scrum_workflow/workflows/refinement.md] -- Current refinement workflow structure
- [Source: scrum_workflow/commands/refine-ticket.md] -- Current command definition
- [Source: scrum_workflow/templates/refinement.md] -- Current refinement template
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 10, Story 10.1] -- Story requirements and acceptance criteria
- [Source: docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md] -- Research basis for enhanced refinement

## Dev Agent Record

### Agent Model Used

Claude (GLM-5)

### Debug Log References

- None

### Completion Notes List

- Added `doc_discovery: true` feature flag to refine-ticket command frontmatter
- Added Step 4.5: Doc-Discovery Phase to refinement workflow between context loading and agent spawning
- Implemented doc-discovery prompt with skip option
- Implemented path validation and URL fetching logic
- Updated all three agent context bundles (Architect, Developer, QA) to include discovered documents
- Added Document Discovery section to refinement template with auto-detected and additional documents subsections

### File List

- `scrum_workflow/commands/refine-ticket.md` (modified - added doc_discovery feature flag)
- `scrum_workflow/workflows/refinement.md` (modified - added Step 4.5: Doc-Discovery Phase, updated agent context bundles)
- `scrum_workflow/templates/refinement.md` (modified - added Document Discovery section)

## Change Log

- 2026-04-01: Implemented doc-discovery phase for refinement workflow
