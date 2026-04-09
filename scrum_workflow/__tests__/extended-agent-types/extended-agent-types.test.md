# Extended Agent Types BDD Scenarios

## Story Reference

Story 9.4: Implement Extended Agent Types

## Feature: Security Reviewer, UX Reviewer, and Contract Validator Agent Definitions

### Scenario 1: Agent files exist with correct frontmatter (AC1)

**Given** FR-35 specifies extended agent types: Security Reviewer, UX Reviewer, Contract Validator
**When** the agent definitions are created in `scrum_workflow/agents/`
**Then** `security-reviewer.md`, `ux-reviewer.md`, and `contract-validator.md` exist as flat files
**And** each file has YAML frontmatter with `name`, `display_name`, `role`, `active_in`, `model`, `max_tokens`
**And** each file has body sections: Identity, Instructions, Output Format, Context Rules
**And** `model: claude-sonnet-4` and `max_tokens: 2000` match existing agent values

### Scenario 2: Security Reviewer agent focuses on security analysis (AC1, AC3)

**Given** a story is classified with `risk_level: high` or `risk_level: critical`
**When** the Security Reviewer agent is dispatched during `/scrum-refine-ticket`
**Then** the agent analyzes for authentication flaws, authorization gaps, data exposure, injection vulnerabilities
**And** the agent loads context: `story.md`, `context/architecture.md`, `context/standards.md`, risk notes
**And** the agent does NOT load `context/frontend.md` or `plan.md`
**And** the output follows the "## Security Reviewer Perspective" format with Findings table

### Scenario 3: UX Reviewer agent focuses on usability and accessibility (AC1, AC3)

**Given** a story has domain tags including `frontend`, `ui`, or `ux`
**When** the UX Reviewer agent is dispatched during `/scrum-refine-ticket`
**Then** the agent analyzes for usability, WCAG accessibility (contrast 4.5:1, keyboard nav, screen reader), design consistency
**And** the agent loads context: `story.md`, `context/frontend.md`, `context/standards.md`, UX design spec
**And** the agent does NOT load `context/architecture.md` or risk notes
**And** the output follows the "## UX Reviewer Perspective" format with Findings table

### Scenario 4: Contract Validator agent focuses on spec compliance (AC1, AC3)

**Given** a story has domain tags including `api`, `contract`, or `integration`
**When** the Contract Validator agent is dispatched during `/scrum-refine-ticket`
**Then** the agent validates story-to-implementation traceability, acceptance criteria coverage, API contracts
**And** the agent loads context: `story.md`, `plan.md`, `context/standards.md`, implementation source code
**And** the agent does NOT load `context/frontend.md` or risk notes
**And** the output follows the "## Contract Validator Perspective" format with Findings table

### Scenario 5: Runtime discovery without registration (AC2)

**Given** agent files are placed in `scrum_workflow/agents/` as flat `.md` files
**When** the dynamic dispatcher (Story 9.3) validates agent file existence
**Then** all three extended agents are discovered (file existence is sufficient)
**And** no registration, build step, or restart is required
**And** the dispatcher no longer logs "agent not available — skipped" for these agents

### Scenario 6: No cross-agent context contamination (AC3)

**Given** extended agents are spawned during refinement
**When** each agent loads its Context Rules
**Then** no agent references other agent definition files
**And** no agent receives other agents' perspectives until cross-talk phase
**And** context isolation is maintained per Architecture Pattern 8

### Scenario 7: Agent files synced to distribution targets (AC4)

**Given** all three agent files are created in `scrum_workflow/agents/`
**When** files are synced to distribution targets
**Then** identical copies exist at `create-scrum-workflow/scrum_workflow/agents/{agent-name}.md`
**And** identical copies exist at `create-scrum-workflow/templates/scrum_workflow/agents/{agent-name}.md`
**And** `README.md` is updated and synced to both distribution locations
**And** all 8 sync targets contain identical content to their source files

### Scenario 8: Dispatch rules already reference extended agents (AC2)

**Given** `dispatch-rules.yaml` was created in Story 9.3
**When** the extended agent files are created
**Then** `security-reviewer` is dispatched for `risk_level: high` and `risk_level: critical`
**And** `ux-reviewer` is dispatched for domain tags `frontend`, `ui`, `ux`
**And** `contract-validator` is dispatched for domain tags `api`, `contract`, `integration`
**And** no changes to `dispatch-rules.yaml` are needed
