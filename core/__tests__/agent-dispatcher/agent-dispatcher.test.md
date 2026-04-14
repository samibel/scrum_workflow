# Agent Dispatcher BDD Scenarios

## Story Reference

Story 9.3: Implement Dynamic Agent Dispatcher

## Feature: Dynamic Agent Selection Based on Story Type, Risk, and Domain Tags

### Scenario 1: Feature story with default attributes gets standard agent set (AC1)

**Given** a story has been classified with `type: feature`, `risk_level: medium`, and no domain tags
**And** `depth: standard` is set in story frontmatter
**When** the agent-dispatcher skill is invoked during `/scrum-refine-ticket`
**Then** the dispatched agent set is `[architect, developer, qa]`
**And** the dispatch_rationale explains: default set used for feature type with medium risk

### Scenario 2: Infrastructure story skips QA agent (AC1)

**Given** a story has been classified with `type: infrastructure`
**And** `depth: standard` is set in story frontmatter
**When** the agent-dispatcher skill is invoked
**Then** the dispatched agent set is `[architect, developer]` (QA skipped)
**And** the dispatch_rationale explains: infrastructure type override applied

### Scenario 3: High-risk story adds security-reviewer (AC1)

**Given** a story has been classified with `risk_level: high`
**And** `type: feature` and `depth: standard`
**When** the agent-dispatcher skill is invoked
**Then** the dispatched agent set includes `security-reviewer` (in addition to default set)
**And** if `security-reviewer.md` does not exist in `scrum_workflow/agents/`, the agent is skipped gracefully

### Scenario 4: Critical-risk story adds security-reviewer (AC1)

**Given** a story has been classified with `risk_level: critical`
**When** the agent-dispatcher skill is invoked
**Then** the dispatched agent set includes `security-reviewer`

### Scenario 5: Frontend domain tag adds ux-reviewer (AC1)

**Given** a story has `domain_tags: [frontend]` in frontmatter
**When** the agent-dispatcher skill is invoked
**Then** the dispatched agent set includes `ux-reviewer`

### Scenario 6: API domain tag adds contract-validator (AC1)

**Given** a story has `domain_tags: [api]` in frontmatter
**When** the agent-dispatcher skill is invoked
**Then** the dispatched agent set includes `contract-validator`

### Scenario 7: Multiple domain tags add multiple agents (AC1)

**Given** a story has `domain_tags: [frontend, api]` in frontmatter
**When** the agent-dispatcher skill is invoked
**Then** the dispatched agent set includes both `ux-reviewer` and `contract-validator`

### Scenario 8: Dispatch rationale is logged in refinement artifact (AC2)

**Given** the agent-dispatcher has selected an agent set
**When** refinement begins and the refinement artifact is created
**Then** `refinement.md` contains a "Dispatch Summary" section
**And** the section shows which agents were selected, why, and which were skipped

### Scenario 9: Default fallback when attributes are missing (AC3)

**Given** a story has no `type`, `risk_level`, or `domain_tags` fields
**When** the agent-dispatcher skill is invoked
**Then** the default agent set `[architect, developer, qa]` is used
**And** the dispatch_rationale includes: "Default agent set used — no specific dispatch rules matched."

### Scenario 10: Default fallback when classification is ambiguous (AC3)

**Given** the story classification returned ambiguous or invalid values
**When** the agent-dispatcher skill is invoked
**Then** the default agent set `[architect, developer, qa]` is used

### Scenario 11: Missing agent file is skipped gracefully (AC4)

**Given** the dispatch rules select `security-reviewer` agent
**And** `scrum_workflow/agents/security-reviewer.md` does not exist
**When** the dispatcher resolves the agent set
**Then** `security-reviewer` is skipped gracefully without error
**And** a note is logged: "Agent 'security-reviewer' not available — skipped (create agent file to enable)."
**And** the `skipped_agents` output includes the skipped agent with reason

### Scenario 12: Light depth short-circuits to developer only (AC1)

**Given** a story has `depth: light` in frontmatter
**And** `type: infrastructure`, `risk_level: high`, `domain_tags: [frontend]`
**When** the agent-dispatcher skill is invoked
**Then** the dispatched agent set is `[developer]` only
**And** no other dispatch rules (type, risk, domain-tag) are applied
**And** the dispatch_rationale explains: light depth short-circuit

### Scenario 13: Dispatch disabled falls back to static set (AC3)

**Given** `agent_dispatch_enabled: false` in config.yaml
**When** the agent-dispatcher skill is invoked
**Then** the static default set `[architect, developer, qa]` is used
**And** dispatch rules are not consulted

### Scenario 14: Infrastructure + high risk composites correctly (AC1)

**Given** a story has `type: infrastructure` and `risk_level: high`
**When** the agent-dispatcher skill is invoked
**Then** the base set is `[architect, developer]` (infrastructure override)
**And** `security-reviewer` is added (high risk addition)
**And** the final set is `[architect, developer, security-reviewer]` (after deduplication and validation)

### Scenario 15: Bugfix + critical + security + api tags composites correctly (AC1)

**Given** a story has `type: bugfix`, `risk_level: critical`, `domain_tags: [security, api]`
**When** the agent-dispatcher skill is invoked
**Then** the base set is `[architect, developer, qa]` (bugfix uses default)
**And** `security-reviewer` is added (critical risk)
**And** `contract-validator` is added (api tag)
**And** the final set is `[architect, developer, qa, security-reviewer, contract-validator]` (after validation)
