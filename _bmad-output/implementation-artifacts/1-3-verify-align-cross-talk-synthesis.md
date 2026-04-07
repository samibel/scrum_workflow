# Story 1.3: Verify & Align Cross-Talk & Synthesis

Status: in-progress

## Story

As a developer,
I want cross-talk and synthesis during refinement to match the current PRD spec,
so that agent perspectives are properly debated, merged, and my accept/reject decisions are tracked.

## Acceptance Criteria

1. **Given** the existing implementation of cross-talk and synthesis **When** compared against the current PRD specification for FR-14, FR-15, and FR-16 **Then** a delta analysis documents: what matches, what diverges, and what is missing **And** all identified deltas are resolved to match the current PRD spec

2. **Given** FR-14 specifies cross-talk rounds (up to 3) with blocker classification and early-exit-on-consensus **When** agents have produced their perspectives **Then** the system facilitates cross-talk rounds where agents respond to each other's findings **And** blockers are classified and tracked **And** cross-talk exits early if consensus is reached before 3 rounds

3. **Given** FR-16 specifies developer accept/reject per perspective **When** perspectives are presented to the developer **Then** the developer can accept or reject each agent perspective individually **And** decisions are tracked in the refinement artifact

4. **Given** FR-15 specifies synthesis of accepted perspectives with deduplication **When** the developer has made accept/reject decisions **Then** accepted perspectives are synthesized into a unified refinement artifact with overlapping findings deduplicated

5. **Given** all deltas have been resolved **When** the implementation is reviewed **Then** cross-talk, accept/reject, and synthesis fully match the current PRD specifications

## Tasks / Subtasks

- [ ] Task 1: Delta Analysis -- Compare existing cross-talk implementation against PRD spec (AC: #1, #2)
  - [ ] 1.1 Read and document current cross-talk logic in `scrum_workflow/workflows/refinement.md` Steps 7.4-7.5 (cross-talk state initialization, discussion rounds, blocker classification, early consensus, deadlock detection)
  - [ ] 1.2 Compare cross-talk rounds against FR-14: up to 3 rounds, blocker classification per disagreement, early-exit-on-consensus when no blockers remain
  - [ ] 1.3 Verify progressive truncation pattern: Round 1 = 400 words, Round 2 = 300 words, Round 3 = 200 words per agent
  - [ ] 1.4 Verify blocker classification logic: binary (blocker/non-blocker) per disagreement, security auto-blocker rule
  - [ ] 1.5 Verify early consensus check: exits when `blockers.length === 0` AND `early_exit_on_consensus` is true (config default: true)
  - [ ] 1.6 Verify deadlock detection: triggers after max rounds (config: `refinement_max_rounds: 3`) with user resolution options
  - [ ] 1.7 Verify config.yaml settings: `refinement_max_rounds: 3`, `early_exit_on_consensus: true`, `security_auto_blocker: true`
  - [ ] 1.8 Document all deltas in Dev Notes section

- [ ] Task 2: Delta Analysis -- Compare existing feedback collection against PRD spec (AC: #1, #3)
  - [ ] 2.1 Read and document current feedback collection in `scrum_workflow/workflows/refinement.md` Steps 8-9 (perspective presentation, user feedback collection)
  - [ ] 2.2 Read and document `scrum_workflow/skills/feedback-collection/SKILL.md` (sequential presentation, accept/reject decision, optional comment, validation, structured output)
  - [ ] 2.3 Compare against FR-16: developer can accept or reject each agent perspective individually
  - [ ] 2.4 Verify feedback decisions are tracked in refinement artifact per Architecture Section 8 pattern: `feedback-{agent-name}.md` with `accepted: true/false` and `rationale` fields
  - [ ] 2.5 Verify feedback output format matches what synthesis skill expects (User Decisions + Quality Tracking Summary in refinement.md)
  - [ ] 2.6 Document all deltas

- [ ] Task 3: Delta Analysis -- Compare existing synthesis against PRD spec (AC: #1, #4)
  - [ ] 3.1 Read and document current synthesis logic in `scrum_workflow/workflows/refinement.md` Step 10 (synthesis phase)
  - [ ] 3.2 Read and document `scrum_workflow/skills/synthesis/SKILL.md` (merge strategy, deduplication rules, conflict resolution, output assembly, context window compliance)
  - [ ] 3.3 Read and document `scrum_workflow/templates/refinement.md` (Discussion Rounds sections, Feedback Record, Synthesis Summary, Accepted Changes)
  - [ ] 3.4 Compare against FR-15: synthesis of accepted perspectives into unified refinement artifact with deduplication of overlapping findings
  - [ ] 3.5 Verify deduplication rules: overlap identification, severity escalation (highest severity wins), agent attribution preserved
  - [ ] 3.6 Verify conflict resolution: domain expertise hierarchy (Architect for architecture, Developer for feasibility, QA for testability)
  - [ ] 3.7 Verify output assembly: refined description, merged acceptance criteria, revised estimation, ordered subtask list
  - [ ] 3.8 Verify context window compliance: NFR-1 coordination max 4000 tokens, preventive token counting, consolidation strategy
  - [ ] 3.9 Document all deltas

- [ ] Task 4: Verify cross-talk template and documentation (AC: #2)
  - [ ] 4.1 Verify `scrum_workflow/templates/refinement.md` Discussion Rounds section matches workflow Steps 7.5.1-7.5.8 structure
  - [ ] 4.2 Verify deadlock resolution section: German text observed by Story 1.2 ("Blockierende Punkte", "Vorschlag") -- determine if this is intentional i18n or needs alignment with English-first standard
  - [ ] 4.3 Verify round summary format: blockers count, non-blockers count per round
  - [ ] 4.4 Verify early consensus exit section matches Step 7.5.4 logic
  - [ ] 4.5 Verify temp file write pattern: `sprints/SW-XXX/temp/round-{N}-summary.md`

- [ ] Task 5: Verify feedback-synthesis pipeline end-to-end (AC: #3, #4)
  - [ ] 5.1 Verify data flow: perspectives (Step 8) -> feedback collection (Step 9) -> synthesis (Step 10)
  - [ ] 5.2 Verify feedback-collection SKILL.md output format is compatible with synthesis SKILL.md input expectations
  - [ ] 5.3 Verify synthesis writes to both `story.md` (updated sections) and `refinement.md` (audit record) per write boundary rules
  - [ ] 5.4 Verify refinement.md Feedback Record section persists across story updates (NFR-16 compliance)
  - [ ] 5.5 Verify edge case: all perspectives rejected -> synthesis skips merge, preserves original story
  - [ ] 5.6 Verify actor identity in status_history: `actor: synthesis-skill` when synthesis updates story.md status

- [ ] Task 6: Resolve any identified deltas (AC: #1, #5)
  - [ ] 6.1 For each delta identified: determine if it requires a code change or is an acceptable variance
  - [ ] 6.2 Apply fixes to workflow, skills, or templates as needed
  - [ ] 6.3 Verify all fixes maintain backward compatibility with existing story artifacts

- [ ] Task 7: Final compliance check (AC: #5)
  - [ ] 7.1 Review all files against FR-14 (cross-talk rounds, blocker classification, early-exit-on-consensus)
  - [ ] 7.2 Review all files against FR-15 (synthesis of accepted perspectives, deduplication)
  - [ ] 7.3 Review all files against FR-16 (accept/reject per perspective, decisions tracked)
  - [ ] 7.4 Review all files against Architecture Section 8 (context isolation, feedback collection pattern)
  - [ ] 7.5 Verify no write boundary violations: `/scrum-refine-ticket` may write `refinement.md` and update `story.md` only
  - [ ] 7.6 Verify error message format follows Architecture pattern: `Error: {description}` with `Fix: {action}`

## Dev Notes

### Approach: Brownfield Verification

This is a verification story, not a greenfield build. The implementation already exists (framework v1.0.0). The approach follows the same pattern as Stories 1.1 and 1.2:
1. Read all target files to capture current state
2. Read PRD (FR-14, FR-15, FR-16) and Architecture (Section 8) for required state
3. Perform systematic comparison
4. Document deltas
5. Resolve any gaps found

### Key PRD Requirements to Verify

**FR-14 -- Cross-Talk Rounds with Blocker Classification and Early-Exit-on-Consensus:**
- Up to 3 rounds of cross-talk between agents (configurable via `refinement_max_rounds: 3`)
- Each round: agents see all other agents' perspectives and respond with agreements, disagreements, blind spots
- Progressive truncation: Round 1 = 400 words, Round 2 = 300 words, Round 3 = 200 words
- After each round: binary blocker classification per disagreement (blocker vs non-blocker)
- Security auto-blocker: any security risk automatically classified as blocker (`security_auto_blocker: true`)
- Early exit: if no blockers remain after any round AND `early_exit_on_consensus: true`, skip remaining rounds
- Deadlock: if blockers remain after max rounds, present user with resolution options (accept agent proposal, provide alternative, cancel)

**FR-15 -- Synthesis of Accepted Perspectives with Deduplication:**
- Synthesis merges only accepted perspectives (filtered by user feedback)
- Deduplication: overlapping findings consolidated, highest severity preserved, agent attribution maintained
- Conflict resolution via domain expertise hierarchy: Architect > architecture, Developer > feasibility, QA > testability
- Output: refined description, merged acceptance criteria, revised estimation, ordered subtask list
- Context window compliance: synthesis must fit within coordination budget (4000 tokens for claude-code)
- Edge case: if all perspectives rejected, skip merge and preserve original story

**FR-16 -- Developer Accept/Reject per Perspective:**
- Each of the 3 perspectives (Architect, Developer, QA) presented sequentially
- Developer provides accept/reject decision for each perspective individually
- Optional comment per decision
- Decisions tracked in refinement artifact (Feedback Record section of refinement.md)
- Architecture Section 8 pattern: structured accept/reject per perspective, `feedback-{agent-name}.md` format

### Architecture Context (Section 8: Cross-Agent Communication Patterns)

**Feedback Collection Pattern:**
- Structured accept/reject per perspective
- Format: `feedback-{agent-name}.md` with `accepted: true/false` and `rationale` fields
- IMPORTANT: Verify whether the current implementation uses individual `feedback-{agent-name}.md` files (as Architecture specifies) or embeds feedback in `refinement.md` Feedback Record section (as the workflow and skills implement). If there is a discrepancy, determine which approach is correct and document as delta.

**Write Boundaries:**
- `/scrum-refine-ticket` may write: `refinement.md` and update `story.md` only
- Synthesis skill writes: updated sections for `story.md` + complete `refinement.md`
- Actor identity for synthesis: `actor: synthesis-skill`

### Relevant File Paths

| File | Purpose | Action |
|------|---------|--------|
| `scrum_workflow/workflows/refinement.md` | Refinement workflow (6-phase), Steps 7.4-10 | VERIFY -- cross-talk, feedback, synthesis phases |
| `scrum_workflow/skills/feedback-collection/SKILL.md` | Feedback collection skill | VERIFY -- accept/reject pattern, output format |
| `scrum_workflow/skills/synthesis/SKILL.md` | Synthesis skill | VERIFY -- merge strategy, deduplication, conflict resolution, output assembly |
| `scrum_workflow/templates/refinement.md` | Refinement artifact template | VERIFY -- Discussion Rounds, Feedback Record, Synthesis Summary |
| `scrum_workflow/config.yaml` | Framework configuration | READ-ONLY -- verify refinement_max_rounds, early_exit_on_consensus, security_auto_blocker |
| `scrum_workflow/context/standards.md` | Agent output format standards | READ-ONLY -- verify perspective format compliance for cross-talk input |

### Critical Anti-Patterns to Avoid

- **DO NOT** modify agent spawning logic (Steps 5-7 initial perspectives) -- that was Story 1.2
- **DO NOT** modify estimation logic (Steps 7.6-7.11) -- that is Story 1.4
- **DO NOT** modify the `story.md` template or ticket-creation workflow -- that was Story 1.1
- **DO NOT** add new agent types (Security, UX, Contract Validator) -- those are Phase 4 / Epic 9
- **DO NOT** change `model` field in agents -- agents are out of scope, only verify workflow/skill
- **DO NOT** modify the doc-discovery phase (Steps 1-4) -- not in scope
- **DO NOT** implement cumulative quality tracking across refinements -- deferred to Phase 2

### Cross-Story Dependencies

- **Story 1.1 (Ticket Creation) -- DONE:** Established `story.md` template and frontmatter. Synthesis updates `story.md` -- must preserve all frontmatter fields.
- **Story 1.2 (Agent Spawning & Perspectives) -- DONE:** Established agent perspective output format (table-based: Findings, Recommendations, Proposed AC). Cross-talk takes Round 0 perspectives as input. Story 1.2 verified the output format is correct for cross-talk consumption. Note: Story 1.2 found and fixed duplicate step numbering in refinement.md (cross-talk prep renumbered to 7.4/7.4.1/7.4.2, Step 8 presentation renumbered to 8.1-8.3). Also observed German text in deadlock resolution section of templates/refinement.md -- this is now in scope for this story.
- **Story 1.4 (Wideband Delphi Estimation):** Estimation happens AFTER cross-talk completes but BEFORE synthesis. Cross-talk summary feeds into estimation prompt. Do not modify estimation logic.
- **Story 1.5 (Code Review):** Review uses a separate agent. No direct dependency on cross-talk/synthesis.

### Previous Story Intelligence (Story 1.2)

**Key learnings from Story 1.2:**
- One delta found and resolved: sub-step numbering misalignment in refinement.md. Cross-talk prep steps renumbered from 7.1-7.3 to 7.4/7.4.1/7.4.2, and Step 8 presentation sub-steps renumbered from 7.1-7.3 to 8.1-8.3.
- Architecture Section 8 says Developer/QA get `plan.md`, but during refinement no `plan.md` exists yet. This was documented as acceptable variance. Same pattern may apply here -- Architecture feedback format says `feedback-{agent-name}.md` files, but implementation may use embedded Feedback Record in `refinement.md`. Investigate carefully.
- German text found in cross-talk sections of `templates/refinement.md` ("Blockierende Punkte", "Vorschlag"). This was noted as out-of-scope for Story 1.2 but IS in scope for Story 1.3.
- Stories 1.1 and 1.2 both found the codebase largely aligned with spec. Be prepared for minimal deltas but verify thoroughly.
- Code review for Story 1.2 found documentation accuracy issues (story claimed zero deltas when fixes were actually made). Ensure Dev Notes accurately reflect actual work done.

### Git Intelligence

Recent commits (last 5):
- `de30f7d` feat(story-1.2): code review complete, story done
- `1a946bc` feat(story-1.2): dev verification complete, status moved to review
- `11122f4` feat(story-1.2): dev in-progress, refinement workflow updates
- `197d82e` feat(story-1.2): create story spec for agent spawning & perspectives
- `a401840` feat(story-1.1): code review complete, story done

Files modified in Story 1.2:
- `scrum_workflow/workflows/refinement.md` -- Sub-step numbering corrected
- `_bmad-output/implementation-artifacts/1-2-verify-align-agent-spawning-perspectives.md` -- Story file
- `_bmad-output/implementation-artifacts/sprint-status.yaml` -- Status updates

**Pattern:** Commit messages follow `feat(story-X.Y): description` format. Story files are updated in implementation-artifacts. Sprint status updated when story status changes.

### Config Values Relevant to This Story

From `scrum_workflow/config.yaml`:
- `refinement_max_rounds: 3` -- Maximum cross-talk rounds before deadlock
- `early_exit_on_consensus: true` -- Exit early when only non-blockers remain
- `security_auto_blocker: true` -- Auto-classify security issues as blockers
- `keep_agent_temp_files: false` -- Temp files cleaned after synthesis
- `token_budgets.claude-code.coordination: 4000` -- Synthesis must fit within this
- `token_budgets.claude-code.sub_agent: 2000` -- Per-agent cross-talk response budget

### Potential Delta: Architecture Feedback Format vs Implementation

Architecture Section 8 specifies: `feedback-{agent-name}.md` with `accepted: true/false` and `rationale` fields.

Current implementation uses: Embedded Feedback Record section in `refinement.md` with User Decisions per agent.

This may be an acceptable variance (similar to the plan.md variance in Story 1.2) -- the implementation achieves the same goal (structured accept/reject per perspective) using a different file strategy. Document findings and determine if this is a true delta requiring resolution or an acceptable implementation detail.

### Project Structure Notes

- Framework files: `scrum_workflow/` (commands, workflows, skills, agents, templates, data, context)
- Output artifacts: `_scrum-output/sprints/SW-XXX/`
- Temp files during refinement: `_scrum-output/sprints/SW-XXX/temp/`
- Framework-level standards: `scrum_workflow/context/`
- All files use kebab-case naming, YAML fields use snake_case
- Status values use lowercase-with-hyphens

### References

- [Source: _bmad-output/planning-artifacts/epics.md -- Epic 1, Story 1.3 (lines 358-388)]
- [Source: _bmad-output/planning-artifacts/prd.md -- FR-14, FR-15, FR-16 (lines 624-626)]
- [Source: _bmad-output/planning-artifacts/architecture.md -- Section 8: Cross-Agent Communication Patterns (lines 186-196)]
- [Source: scrum_workflow/workflows/refinement.md -- Steps 7.4-7.5 (cross-talk), Steps 8-9 (presentation/feedback), Step 10 (synthesis)]
- [Source: scrum_workflow/skills/feedback-collection/SKILL.md -- Complete feedback collection skill]
- [Source: scrum_workflow/skills/synthesis/SKILL.md -- Complete synthesis skill]
- [Source: scrum_workflow/templates/refinement.md -- Discussion Rounds, Feedback Record, Synthesis Summary]
- [Source: scrum_workflow/config.yaml -- refinement_max_rounds, early_exit_on_consensus, security_auto_blocker, token_budgets]
- [Source: _bmad-output/implementation-artifacts/1-2-verify-align-agent-spawning-perspectives.md -- Previous story learnings, German text observation]
- [Source: _bmad-output/implementation-artifacts/1-1-verify-align-ticket-creation.md -- Previous story learnings]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
