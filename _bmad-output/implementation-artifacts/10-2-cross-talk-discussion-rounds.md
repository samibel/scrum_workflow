# Story 10.2: Cross-Talk Discussion Rounds

<!--
DO NOT edit this section manually - managed by dev-story workflow
-->

Status: in-progress

## Story

<!--
UPDATE the section with story details, acceptance criteria, tasks, and dev notes
-->

As a developer,
I want the Architect, Developer, and QA agents to see and comment on each other's perspectives,
so that blind spots are surfaced and agents build toward consensus instead of working in isolation.

## Acceptance Criteria

<!-- Critical: Story file status must must be updated manually -->
1. **Round 0 initial perspectives**: Workflow spawns all three agents in parallel with isolated context; each agent receives story.md + discovered documents + their role-specific instructions only

2. **temp file creation**: Each agent writes their full analysis to a temp file in `sprints/SW-XXX/temp/`:
          - `temp/architect-round-0.md`
          - `temp/developer-round-0.md`
          - `temp/qa-round-0.md`
3. **Progressive truncation**: After Round 0, cross-talk rounds use progressive context budgets:
          - Round 1: 400 words per agent spawn
          - Round 2: 300 words per agent spawn
          - Round 3: 200 words per agent spawn
4. **Cross-talk prompt**: Each cross-talk spawn asks: "Comment on: (1) where you AGree with their findings, (2) Where you disagree and why, (3) Blind spots they identified that you missed"
5. **Binary blocker classification**: After each round, for each disagreement, ask agent: "Does this **block** implementation? (Yes/no)"
          - **Blockers**: Must be resolved before synthesis
          - **Non-Blockers**: Document and proceed (cannot be resolved)
6. **Security auto-blocker**: Any agent-identified security risk is forced as blocker, cannot be marked non-blocker
7. **Early consensus exit**: If all blockers resolved and only non-blockers remain, proceed to synthesis without further rounds
8. **Progress visibility**: After each round, show: "Round N complete. X blockers, Y non-blockers remaining."
9. **Deadlock UX**: If blockers remain after Round 3, present resolution options to user:
        ```
        ⚠️ REFINEMENT DEADLOCK nach 3 rounds
        Blockierende Punkte:
        1. [Agent]'s Vorschlag übernehmen
        2. Alternative eingeben
        3. Abbrechen und Story zurück zu Draft
        ```
10. **Documentation**: All cross-talk rounds documented in `refinement.md` under "## Discussion Rounds"
11. **temp file cleanup**: Temp files are auto-cleaned after synthesis (configurable via `keep_agent_temp_files: false`)
12. **configurable max rounds**: Max cross-talk rounds before escalation (configurable in `config.yaml` with default `refinement_max_rounds: 3`)

## Dev Notes

<!--
Update this section with implementation details, learnings, and context
-->

- Agent spawning pattern: Three agents in parallel with isolated context (Sub-agent spawning)
- Progressive truncation: 400 → 300 → 200 words per round
- Binary blocker classification: blocker vs non-blocker
- Security auto-blocker: Security issues forced as blockers
- Early consensus exit mechanism
- Max rounds configurable (default 3)
    - Default max rounds: 3 (config.yaml: `refinement_max_rounds`)
    - Default `keep_agent_temp_files: false`
    - Default `estimation_variance_threshold: 2`
    - Default `early_exit_on_consensus: true`
    - Default `security_auto_blocker: true`
    - Default temp file location: `sprints/SW-XXX/temp/`
            - Auto-cleaned after synthesis unless `keep_agent_temp_files: false`)

### Anti-Patterns to avoid
1. **Do not duplicate context bundles**: Each agent receives only story.md + discovered documents + their role-specific instructions ONLY. - Other agents' role files
    - Architecture-specific context (if story is about architecture)
    - Domain-specific context (if identified)
    - QA-specific context from context/testing context or skill
    - Discovered documents from doc-discovery phase (if any)

### Testing Requirements
- Manual testing via `/scrum-refine-ticket SW-XXX` (replace with actual story ID)
- Run `/scrum-dev-story SW-XXX` after implementation
- Test verify temp files are created in `sprints/SW-XXX/temp/` directory
- Test verify temp files contain expected content
- Test verify temp file cleanup with configurable setting
- Test verify early consensus exit mechanism
- Test verify early consensus exit with only non-blockers remaining
- Test verify deadlock UX after max rounds
- Test verify temp file cleanup with `keep_agent_temp_files: false` setting
- Test verify estimation phase works with Wideband Delphi method
- Test verify `refinement.md` includes new sections after synthesis
- Test verify `.gitignore` pattern is applied
- Test verify `sprint-status.yaml` story status is updated from `ready-for-dev`
- Test verify `refinement.md` includes all new sections (Discussion rounds, estimation)
- Test verify `scrum_workflow/commands/refine-ticket.md` frontmatter is updated with `discussion_rounds: true`
- Test verify `scrum_workflow/workflows/refinement.md` is updated to include cross-talk steps
- Test verify `scrum_workflow/templates/refinement.md` includes the new sections (Discussion rounds, estimation)
- Test verify `scrum_workflow/workflows/refinement.md` accurately reflects the requirements
- Test verify `scrum_workflow/workflows/refinement.md` references the new steps in Step 4.5, 5.6, 5.5. 5.5, 6.7 correctly
- test verify `scrum_workflow/workflows/refinement.md` Step 4.5-5 mentions temp file creation and cleanup pattern
- test verify `scrum_workflow/workflows/refinement.md` Step 4.5.3 mentions "doc-discovery phase"
- test verify `scrum_workflow/workflows/refinement.md` Step 6.3-S spawn loop
- test verify `scrum_workflow/workflows/refinement.md` Step 5-8.3 correctly handles the blocker/non-blocker resolution
- test verify `scrum_workflow/agents/architect.md`, `scrum_workflow/agents/developer.md`, and `scrum_workflow/agents/qa.md` agent definitions remain unchanged
- test verify the agent pattern: multi-Agent debate (Opponent processor), multi-agent debate pattern

### References

- [Source: scrum_workflow/workflows/refinement.md] -- Current refinement workflow structure
- [Source: scrum_workflow/templates/refinement.md] -- Current refinement template
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 10] -- Story requirements
    - [Source: _bmad-output/implementation-artifacts/10-1-doc-discovery-phase-for-refinement.md] -- Previous story (doc-discovery implemented)
    - Files modified: scrum_workflow/commands/refine-ticket.md, scrum_workflow/workflows/refinement.md, scrum_workflow/templates/refinement.md
    - scrum_workflow/agents/architect.md, scrum_workflow/agents/developer.md, scrum_workflow/agents/qa.md

## Tasks/Subtasks

<!-- Check tasks as you works on them -->
- [ ] 1. Update refine-ticket.md command frontmatter with `discussion_rounds: true`
- - [x] 2. Update refinement workflow with cross-talk steps
  - [x] 2.1 Add Step 7.5 for cross-talk initialization (create temp dir, write Round 0 analyses)
  - [x] 2.2 Update Step 7.5.2-5 for cross-talk discussion rounds
  - [x] 2.3 Implement Round 1 (400 words per agent)
  - [x] 2.4 Implement Round 2 (300 words per agent)
            - Progressive truncation: 400 → 300 → 200 words
            - Cross-talk prompt for each round
            - Binary blocker classification after each round
            - Deadlock handling after max rounds
  - [ ] 3. Update refinement template with Discussion rounds and estimation sections
  - [x] 3. Add Step 10.4: Document discussion rounds in refinement.md
  - [x] 3.5 Add temp file cleanup step after synthesis
  - [x] 4. Update config.yaml with new refinement settings
    - refinement_max_rounds: 3
    - keep_agent_temp_files: false
    - estimation_variance_threshold: 2
    - early_exit_on_consensus: true
    - security_auto_blocker: true
- [ ] 5. Run integration tests (manual or automated)
- [ ] 6. Update story file status to "review"
- [ ] 7. Update sprint status to "review"

## File List
<!-- List all files created, modified, or deleted during this story implementation -->
- scrum_workflow/commands/refine-ticket.md (modified)
- scrum_workflow/workflows/refinement.md (modified)
- scrum_workflow/templates/refinement.md (modified)
- _bmad-output/implementation-artifacts/sprint-status.yaml (modified)
- _bmad-output/implementation-artifacts/10-2-cross-talk-discussion-rounds.md (modified)

