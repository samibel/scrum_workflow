---
name: refine-ticket
trigger: "/scrum-refine-ticket"
requires_status: draft
sets_status: "refinement → refined"
spawns_agents: dynamic  # Determined at runtime per story type, risk, domain tags, and depth
  # Default set: [architect, developer, qa] — overridden per data/dispatch-rules.yaml
  # Light depth: [developer] only (short-circuit)
  # Infrastructure type: [architect, developer] (skip QA)
  # High/critical risk: adds security-reviewer
  # Frontend/UI/UX/OX tags: adds ux-reviewer (optional)
  # UI/UX/OX tags + needs_draft:true: adds ux-draft-agent before ux-reviewer (Reflection Loop)
  # API/contract/integration tags: adds contract-validator
features:
  doc_discovery: true   # Always enabled
  discussion_rounds: true # Disabled if depth: light
  estimation: true        # Disabled if depth: light (uses single estimate instead)
depth_conditional: true   # Workflow adapts based on story frontmatter depth field
---

## Purpose

Orchestrate dynamic multi-perspective refinement for a story. The dispatcher skill selects specialized perspectives based on story type, risk, and domain tags. Default set: Architect, Developer, QA for `depth: standard` or `depth: heavy`; Developer only for `depth: light`. Each perspective analyzes the story from an expert viewpoint with isolated context, producing focused findings on architectural risks, technical feasibility, and testability. The command updates the story status from `draft` to `refinement` and (for standard/heavy depth) presents all perspectives for user feedback before proceeding to synthesis.

**Light Depth**: Single Developer perspective. No cross-talk, no synthesis, single agent estimate. Ready for validation immediately.

**Standard Depth**: Default: three perspectives (Architect, Developer, QA) with cross-talk rounds, synthesis, and Wideband Delphi estimation. Set may vary based on dynamic dispatch rules (see below).

**Heavy Depth**: Default: three perspectives (Architect, Developer, QA) with maximum cross-talk rounds (no early exit on consensus), synthesis, Wideband Delphi estimation, and a mandatory security consideration note in the refinement artifact. Heavy depth ensures all rounds complete for maximum rigor on high-risk stories. Set may vary based on dynamic dispatch rules (see below).

## Workflow Reference

workflows/refinement.md

## Input

Ticket number in the format: `/scrum-refine-ticket SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `_scrum-output/sprints/SW-XXX/story.md` must exist with `status: draft`

### Workflow Depth Override

The refinement workflow adapts based on `depth` field in story frontmatter:

| Aspect | `depth: light` | `depth: standard` (default) | `depth: heavy` |
|--------|---------------|---------------------------|----------------|
| Agents | 1 (Developer only) | Dynamic (default: Architect, Developer, QA; varies by type/risk/domain) | Dynamic (default: Architect, Developer, QA; varies by type/risk/domain) |
| Cross-talk | Disabled | Enabled (up to N rounds, early exit on consensus) | Enabled (max rounds, NO early exit on consensus — all rounds must complete) |
| Synthesis | Disabled (single perspective = final) | Enabled | Enabled |
| Estimation | Single agent estimate | Wideband Delphi | Wideband Delphi |
| Security note | No | No | Mandatory security consideration note in refinement artifact |
| Readiness validation | 5 criteria (unchanged) | 5 criteria (unchanged) | 5 criteria (unchanged) |

**Depth Detection**: Read `depth` from story frontmatter at workflow start. If `depth` field is `heavy`, apply heavy workflow. If `depth` field is missing or invalid, treat as `standard`.

### Agent Dispatch

After depth detection, the agent-dispatcher skill (`scrum_workflow/skills/agent-dispatcher/SKILL.md`) dynamically selects the agent set based on story attributes:

1. **Depth check**: If `depth: light`, short-circuit to `[developer]` only (preserves existing light depth behavior)
2. **Type-based override**: Story `type` may replace the default agent set (e.g., `infrastructure` -> `[architect, developer]`, skip QA)
3. **Risk-based addition**: Story `risk_level` may add agents (e.g., `high`/`critical` -> add `security-reviewer`)
4. **Domain-tag addition**: Story `domain_tags` may add agents (e.g., `[frontend]`, `[ui]`, `[ux]`, or `[ox]` -> add `ux-reviewer`; `[api]` -> add `contract-validator`)
5. **Draft-flag addition** (Reflection Loop): If `domain_tags` contains `[ui]`, `[ux]`, or `[ox]` **and** the story frontmatter sets `needs_draft: true`, the dispatcher also adds `ux-draft-agent` and orders it **before** `ux-reviewer`. The draft agent generates a low-fidelity Mermaid (default) or Excalidraw (`draft_format: excalidraw`) draft that `ux-reviewer` then critiques. Without `needs_draft`, `ux-draft-agent` is not dispatched.
6. **Agent validation**: Each dispatched agent's file must exist at `scrum_workflow/agents/{name}.md`; missing agents are skipped gracefully with a logged note

**Dispatch rules** are defined in `scrum_workflow/data/dispatch-rules.yaml` and are fully configurable.

**Fallback**: If `agent_dispatch_enabled: false` in config.yaml, or if story attributes are missing/ambiguous, the default agent set `[architect, developer, qa]` is used.

The dispatched agent set and rationale are passed to the refinement workflow for agent spawning and logged in the refinement artifact's Dispatch Summary section.

**Optional OX/UX review policy:** UX/OX review is opt-in via `domain_tags`. If no UI/UX/OX-related tag is present, `ux-reviewer` is not dispatched and refinement proceeds with the remaining selected agents.

## Output

**Standard Depth (depth: standard):**
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: refined` on completion, `updated: <today>` (ISO 8601 format), and synthesized content from accepted perspectives using atomic write operation (NFR1 compliance)
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Refinement audit file containing all agent perspectives (accepted and rejected), user feedback decisions in NFR16-compliant separated section, discussion rounds documentation, synthesis summary, and **Dispatch Summary** section showing selected agents, dispatch rationale, and skipped agents with reasons
- Dispatched perspectives displayed to the user (based on dispatcher selection; default: Architect, Developer, QA), each following the table-based output format defined in Architecture Pattern 3
- Each agent perspective includes Findings table, Recommendations, and Proposed Acceptance Criteria
- User prompted to accept or reject each perspective individually
- Accepted perspectives merged into story via direct synthesis skill invocation (not sub-agent spawning) (see `skills/synthesis/SKILL.md`)
- If all perspectives rejected, original story preserved with log entry in refinement.md
- Synthesis includes deduplication and conflict resolution applied per synthesis skill rules
- Token budget validated preventively before synthesis generation (NFR12 compliance)
- Status transitions: `draft` → `refinement` (on start) → `refined` (on completion)

**Light Depth (depth: light):**
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: refined` on completion, `updated: <today>` (ISO 8601 format), and Developer perspective content using atomic write operation (NFR1 compliance)
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Refinement audit file containing Developer perspective only, and **Dispatch Summary** section showing dispatched agent (developer only via light depth short-circuit)
- Single Developer perspective displayed to the user
- Single agent estimate recorded (no Wideband Delphi)
- No cross-talk rounds, no synthesis step
- Story is ready for validation immediately after perspective acceptance
- Status transitions: `draft` → `refinement` (on start) → `refined` (on completion)

**Heavy Depth (depth: heavy):**
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: refined` on completion, `updated: <today>` (ISO 8601 format), and synthesized content from accepted perspectives using atomic write operation (NFR1 compliance)
- `_scrum-output/sprints/SW-XXX/refinement.md` -- Refinement audit file containing all agent perspectives (accepted and rejected), user feedback decisions, discussion rounds documentation (all rounds, no early exit), synthesis summary, mandatory security consideration note reminding the reviewer that this is a high-risk story, and **Dispatch Summary** section showing selected agents, dispatch rationale, and skipped agents with reasons
- Dispatched perspectives displayed to the user (based on dispatcher selection; default: Architect, Developer, QA)
- Cross-talk runs for maximum rounds (`refinement_max_rounds` from config.yaml) with NO early exit on consensus — all rounds must complete to ensure thorough review
- Wideband Delphi estimation
- Mandatory security consideration note added to the refinement artifact: "Security Consideration: This is a high-risk story. Ensure security implications are thoroughly reviewed before approval."
- Status transitions: `draft` → `refinement` (on start) → `refined` (on completion)

### Doc Discovery (Story 10.1)

Prompt user for additional documents (file paths or URLs) to include in agent context. Auto-detected context from `_scrum-output/context/` is always included.

#### Base Prompts (Always)

1. **Additional context files**: Ask for any file paths or URLs to include beyond the auto-detected `_scrum-output/context/` set. Answer may be empty.

#### Conditional UX Prompts (Only When UX Is Dispatched)

The following prompts are shown **only** when the agent dispatcher has added `ux-reviewer` to the dispatched set (i.e., `domain_tags` contain `ui`, `ux`, or `ox`). If no UX agent is dispatched, skip these prompts entirely and do not render the optional fields in `refinement.md`.

2. **Optional OX/UX board URL**: Prompt text: "Optional: paste a link to the OX/UX board for this story (e.g., Figma, Miro, design-system page). Press Enter to skip." Empty answer records `"None provided"` in the `ox_board_url` field of `refinement.md`.
3. **Optional Excalidraw draft URL**: Only shown when the story frontmatter sets `draft_format: excalidraw` **and** `needs_draft: true` (i.e., the Reflection Loop is active and the team opted into Excalidraw over the Mermaid default). Prompt text: "Optional: paste an Excalidraw URL with your low-fidelity draft. Press Enter to skip — the `ux-draft-agent` will produce a Mermaid block instead." Empty answer records `"None provided"` in the `excalidraw_draft_url` field of `refinement.md`.

The two optional prompts are the **only** sources that populate the `{{ox_board_url_or_"None provided"}}` and `{{excalidraw_draft_url_or_"None provided"}}` placeholders in `src/core/templates/refinement.md`. No other step writes those fields.

#### Using MCP + `excalidraw-diagram-skill` (Optional)

If the user wants the Excalidraw draft generated for them rather than pasting an existing URL, invoke the `excalidraw-diagram-skill` (see `scrum_workflow/skills/excalidraw-diagram-skill/SKILL.md`). The skill:

1. Checks that an Excalidraw MCP/server integration is available.
2. Either generates a new diagram (if MCP supports generation) or records the URL the user provides.
3. Returns a structured result containing the URL, title, and related story ID.
4. Falls back silently to Mermaid-only if MCP is unavailable — refinement must not block.

If MCP is not configured, continue refinement without the diagram and record `"None provided"` for the `excalidraw_draft_url` field. The `ux-draft-agent` will still produce its default Mermaid flow.

### Discussion Rounds (Story 10.2)

**Note: Discussion rounds are only enabled for `depth: standard` and `depth: heavy` stories.**

Multi-round cross-talk between agents where they:
- See and comment on each other's perspectives
- Identify agreements, disagreements, and blind spots
- Classify disagreements as blockers or non-blockers
- Security issues are automatically marked as blockers
- Early exit when all blockers resolved (**standard depth only** — heavy depth disables early exit)

Progressive truncation: 400 → 300 → 200 words per round (configurable via `refinement_max_rounds` in config.yaml, default: 3)

**For `depth: light`:** Skip discussion rounds entirely. Single Developer perspective is final.

**For `depth: heavy`:** Run all `refinement_max_rounds` rounds. Do NOT exit early on consensus. All rounds must complete to ensure maximum rigor for high-risk stories.

### Estimation (Story 10.3)

**Note: Wideband Delphi estimation is enabled for `depth: standard` and `depth: heavy` stories.**

Wideband Delphi estimation with variance threshold checking (default: 2 points).

**For `depth: light`:** Use single Developer agent estimate only. No cross-agent estimation rounds.

**For `depth: heavy`:** Use Wideband Delphi estimation (same as standard).

## Configuration

The following settings can be configured in `config.yaml`:

- `refinement_max_rounds`: Maximum cross-talk rounds before escalation (default: 3)
- `keep_agent_temp_files`: Keep temp files after synthesis for debugging (default: false)
- `estimation_variance_threshold`: Variance threshold for re-estimation (default: 2)
- `early_exit_on_consensus`: Exit early when only non-blockers remain (default: true)
- `security_auto_blocker`: Force security issues as blockers (default: true)

## Error Handling

### Story File Not Found

If the story file does not exist:

```
❌ Status Guard Violation: Story file '_scrum-output/sprints/SW-XXX/story.md' not found

**Details:** The /scrum-refine-ticket command requires an existing story file to process. No file was found at the expected path.

**Next Step:** Run '/scrum-create-ticket SW-XXX' to create the story file first, then re-run '/scrum-refine-ticket SW-XXX'.
```

### Status Guard Violation

If story is not in `draft` status:

```
❌ Status Guard Violation: Story SW-XXX requires 'draft' but is currently '{current_status}'

**Details:** The /scrum-refine-ticket command can only execute on stories in 'draft' status. This story has already progressed past the drafting phase.

**Next Step:** Check the current status and run the appropriate next command. If the story needs re-refinement, manually set status back to 'draft' first (use with caution).
```

## Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/story.md` - Status transitions (`draft` → `refinement` → `refined`) and synthesized content from accepted perspectives ONLY; MUST NOT modify story acceptance criteria independently
- `_scrum-output/sprints/SW-XXX/refinement.md` - Refinement audit file (new file)

This workflow may NOT write:
- `_scrum-output/sprints/SW-XXX/plan.md` - MUST NOT write plan.md — that belongs to `/scrum-refine-story`
- `_scrum-output/sprints/SW-XXX/review-*.md` - Managed by `/scrum-review-story`
- `_scrum-output/sprints/SW-XXX/approval-N.md` - Managed by `/scrum-approve`
- Source code files in project directory - No code changes during refinement
- `scrum_workflow/` - Framework files are read-only during execution

### Anti-Pattern Warning

**Bounded Authority Violation:** This command MUST NOT modify story.md content beyond status transitions and synthesized perspectives from accepted agent views. MUST NOT write plan.md — that belongs to `/scrum-refine-story`.

If a write boundary would be violated, halt with:
```
❌ Write Boundary Violation: /scrum-refine-ticket attempted to write '{file_path}'

**Details:** The /scrum-refine-ticket command may only write refinement.md and story.md status/synthesis updates. Attempted write target is outside the allowed boundary.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```
