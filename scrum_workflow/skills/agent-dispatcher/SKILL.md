---
name: agent-dispatcher
role: "dynamic-agent-selector"
description: "Reads story frontmatter (type, risk_level, domain_tags, depth) and dispatch rules from data/dispatch-rules.yaml to dynamically select the appropriate set of agents for refinement during /scrum-refine-ticket"
---

# Identity

The agent-dispatcher skill is a read-only skill that reads the story's `type`, `risk_level`, `domain_tags`, and `depth` from the story YAML frontmatter and dispatch rules from `scrum_workflow/data/dispatch-rules.yaml`, then returns the selected agent set with dispatch rationale. It is invoked internally by the `/scrum-refine-ticket` command after depth detection but before agent spawning. The dispatcher never writes files directly. The calling workflow (refinement.md) is responsible for using the dispatcher results to decide which agents to spawn.

This skill implements FR-34: dynamic agent dispatch based on story type, risk, and domain tags during `/scrum-refine-ticket`.

**Valid story type values:** `feature`, `bugfix`, `refactor`, `infrastructure`
**Valid risk_level values:** `low`, `medium`, `high`, `critical`
**Valid depth values:** `light`, `standard`, `heavy`

# Instructions

## Dispatch Algorithm

The dispatcher uses a layered rule composition approach. Rules are applied in a specific order: light depth short-circuit, then default set, then type-based override (replaces), then risk-based addition (appends), then domain-tag-based addition (appends), then deduplication, then agent file validation.

### Step 1: Check Depth — Light Depth Short-Circuit

Read the `depth` field from the story frontmatter. If `depth` is `light`, return `[developer]` immediately. This short-circuits all other dispatch rules — no type-based, risk-based, or domain-tag-based rules are applied. This preserves existing light depth behavior from Story 9.2 where light depth means developer-only review.

**Light depth always returns `[developer]` regardless of type, risk_level, or domain_tags.** Even an infrastructure type with high risk and frontend domain tags at light depth returns `[developer]` only.

Also check if `agent_dispatch_enabled` is `false` in `scrum_workflow/config.yaml`. If dispatch is disabled or the flag is set to `false`, skip all dispatch logic and return the static default agent set `[architect, developer, qa]` with rationale: "Agent dispatch disabled — using static default set."

### Step 2: Start with Default Agent Set

Load the `default_agents` from `scrum_workflow/data/dispatch-rules.yaml`. The default agent set is `[architect, developer, qa]`. This is the starting point for all non-light dispatches.

### Step 3: Apply Type-Based Override (Replaces Default Set)

Read the story `type` from frontmatter (one of: feature, bugfix, refactor, infrastructure). Look up the type in the `type_based_overrides` section of dispatch-rules.yaml:

- If a matching type override exists, **replace** the current agent set with the override's agent list
- If no matching type override exists, keep the default agent set unchanged
- Example: `infrastructure` type -> replace default set with `[architect, developer]` (skip QA)

Type-based rules REPLACE the default set entirely. They do not add to it.

### Step 4: Apply Risk-Based Additions (Appends to Current Set)

Read the story `risk_level` from frontmatter. Look up the risk_level in the `risk_based_additions` section of dispatch-rules.yaml:

- If the risk level has `add_agents` entries, **add** those agents to the current set
- If the risk level has an empty `add_agents` list, no agents are added
- Example: `high` risk -> add `security-reviewer` to the current set
- Example: `critical` risk -> add `security-reviewer` to the current set

Risk-based rules ADD to the current set based on risk_level. They do not replace.

### Step 5: Apply Domain-Tag-Based Additions (Appends to Current Set)

Read the story `domain_tags` array from frontmatter. For each domain tag, check all entries in the `domain_tag_additions` section of dispatch-rules.yaml:

- If a domain tag matches any tag in a rule's `tags` array, add that rule's `add_agent` to the current set
- Multiple domain tags can trigger multiple additions
- Example: `[frontend]` tag -> add `ux-reviewer`; `[api]` tag -> add `contract-validator`
- Example: `[frontend, api]` tags -> add both `ux-reviewer` and `contract-validator`

Domain-tag-based rules ADD to the current set based on matching domain_tags. They do not replace.

### Step 6: Deduplicate Agent List

Remove any duplicate entries from the agent list. Each agent should appear at most once in the final dispatched set.

### Step 7: Validate Agent File Existence

For each agent in the resolved set, verify that the agent definition file exists at `scrum_workflow/agents/{agent-name}.md`:

- If the file exists, keep the agent in the dispatched set
- If the file does NOT exist, skip that agent gracefully without error and add a note to `skipped_agents`: "Agent '{agent-name}' not available — skipped (create agent file to enable)."

This validation ensures the dispatcher handles missing agents gracefully. Extended agents like `security-reviewer`, `ux-reviewer`, and `contract-validator` are created in Story 9.4. Until then, these agent slots are skipped with logged notes.

## Fallback Behavior

### When Story Attributes Are Missing

If the story's `type`, `risk_level`, or `domain_tags` fields are missing, empty, or contain invalid values, the dispatcher uses the default agent set `[architect, developer, qa]`. When no rules match due to missing attributes, the dispatch_rationale includes: "Default agent set used — no specific dispatch rules matched."

### When No Rules Match

If no type-based, risk-based, or domain-tag-based rules produce any changes to the default set, the default agent set `[architect, developer, qa]` is returned with the note: "Default agent set used — no specific dispatch rules matched."

### When Dispatch Rules File Is Missing

If `scrum_workflow/data/dispatch-rules.yaml` cannot be found or read, the dispatcher falls back to the hardcoded default set `[architect, developer, qa]` with rationale: "Dispatch rules file not found — using hardcoded default set."

# Output Format

Return a structured YAML result to the calling workflow:

```yaml
agents:
  - architect
  - developer
  - qa
dispatch_rationale: "Type 'feature' uses default set [architect, developer, qa]. Risk 'medium' — no additional agents. No matching domain tags."
skipped_agents:
  - agent: security-reviewer
    reason: "Agent 'security-reviewer' not available — skipped (create agent file to enable)."
```

**Field descriptions:**
- `agents:` The final list of agents to spawn during refinement, after all rules are applied and missing agents are removed
- `dispatch_rationale:` A human-readable explanation of the dispatch decision, including which rules were applied based on type, risk, and domain tags. Used for the Dispatch Summary section in refinement.md
- `skipped_agents:` An array of agents that were selected by rules but skipped because their agent definition file does not exist. Each entry includes the agent name and the reason for skipping

# Context Rules

## Reads

- Story `type` field from the story YAML frontmatter (populated by story-classifier, Story 9.1)
- Story `risk_level` field from the story YAML frontmatter (populated by story-classifier, Story 9.1)
- Story `domain_tags` array from the story YAML frontmatter (populated by story-classifier, Story 9.1)
- Story `depth` field from the story YAML frontmatter (populated by adaptive-depth-selector, Story 9.2)
- Dispatch rules: `scrum_workflow/data/dispatch-rules.yaml`
- Agent file existence check: `scrum_workflow/agents/{agent-name}.md`
- Config flag: `agent_dispatch_enabled` from `scrum_workflow/config.yaml`
- This skill is a read-only dispatcher. It does not write files. It returns structured results to the calling workflow.

## Writes

This skill never writes files. It is a read-only dispatch capability that returns structured results to the orchestrating workflow (`/scrum-refine-ticket` via `workflows/refinement.md`). The calling workflow is responsible for using the dispatched agent set to spawn agents and for logging the dispatch rationale in the refinement artifact.
