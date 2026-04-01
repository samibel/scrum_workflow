# Story 10.6: Documentation & Command Reference Update

Status: review

## Story

As a developer,
I want the enhanced refinement workflow documented in the command reference,
so that users understand the new phases and configuration options.

## Acceptance Criteria

1. **Command Reference Update**: `scrum_workflow/docs/04-command-reference.md` is updated with detailed documentation for `/scrum-refine-ticket`:
   - Explains the 6-phase workflow: Doc-Discovery → Initial Perspectives → Cross-Talk → Estimation → Synthesis → Readiness Check
   - Explains doc-discovery phase and how to provide additional documents
   - Explains cross-talk rounds with **binary blocker classification** (blocker vs non-blocker)
   - Explains **security auto-blocker** behavior
   - Explains **early consensus exit** mechanism
   - Explains **deadlock UX** options after max rounds
   - Explains estimation phase (Wideband Delphi) with confidence aggregation

2. **Configuration Documentation**: All configuration options in `config.yaml` are documented:
   ```yaml
   refinement:
     max_discussion_rounds: 3           # Max cross-talk rounds
     keep_agent_temp_files: false       # Auto-cleanup temp files
     estimation_variance_threshold: 2   # Points variance for re-estimation
     early_exit_on_consensus: true      # Exit early if only non-blockers
     security_auto_blocker: true        # Force security as blocker
   ```

3. **State Machine Update**: `scrum_workflow/docs/05-state-machine.md` is updated to show the refinement phase internal states:
   - draft → refinement (on /refine-ticket)
   - refinement internal states: doc-discovery → perspectives → cross-talk-N → estimation → synthesis → readiness-check
   - refinement → ready (on readiness PASS)
   - refinement → draft (on readiness FAIL or user abort)

4. **Research Reference**: Documentation references the research basis: `docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md`

5. **Temp File Documentation**: Documentation explains temp file location: `sprints/SW-XXX/temp/` and `.gitignore` pattern

6. **README Update**: README.md is updated to mention enhanced refinement features in the feature list

7. **Example Output**: Documentation includes example `refinement.md` output showing all new sections:
   - ## Document Discovery
   - ## Discussion Rounds (with Round 0, Round 1, Round 2 summaries)
   - ## Blocker Resolution (resolved vs escalated)
   - ## Estimation (with Wideband Delphi table)

## Tasks / Subtasks

- [x] Task 1: Update `scrum_workflow/docs/04-command-reference.md` (AC: #1, #2, #4, #5, #7) **COMPLETED**
  - [x] 1.1: Update `/scrum-refine-ticket` section with 6-phase workflow explanation **completed**
  - [x] 1.2: Add doc-discovery phase documentation **completed**
    - [x] 1.3: Add cross-talk rounds documentation with binary blocker classification **completed**
    - [x] 1.4: Add security auto-blocker documentation **completed**
    - [x] 1.5: Add early consensus exit documentation **completed**
    - [x] 1.6: Add deadlock UX documentation **completed**
    - [x] 1.7: Add estimation phase documentation (Wideband Delphi) **completed**
    - [x] 1.8: Add configuration options table **completed**
    - [x] 1.9: Add research basis reference **completed**
    - [x] 1.10: Add temp file location and .gitignore documentation **completed**
    - [x] 1.11: Add example refinement.md output **completed**

- [ ] Task 2: Update `scrum_workflow/docs/05-state-machine.md` (AC: #3)
  - [ ] 2.1: Add refinement phase internal states section
  - [ ] 2.2: Update state diagram to show refinement sub-states
  - [ ] 2.3: Add guard conditions for refinement phases
  - [ ] 2.4: Document early exit and deadlock transitions

- [ ] Task 3: Update `README.md` (AC: #6)
  - [ ] 3.1: Add enhanced refinement features to Features section
  - [ ] 3.2: Update Completed Epics section with Epic 10

- [ ] Task 4: Final validation
  - [ ] 4.1: Verify all documentation is accurate and complete
  - [ ] 4.2: Verify documentation matches implemented workflow behavior
  - [ ] 4.3: Update sprint-status.yaml to review status

## Dev Notes

### Critical Context from Previous Stories

**Story 10.4 (Updated Refinement Workflow)**: This story consolidated all enhanced refinement features:
- 6-phase workflow structure (Doc-Discovery, Initial Perspectives, Cross-Talk, Estimation, Synthesis, Readiness Check)
- Configuration options in `config.yaml` under `refinement:` section
- Temp file structure at `sprints/SW-XXX/temp/`
- Progressive truncation (400→300→200 words)
- Binary blocker classification with security auto-blocker
- Early consensus exit mechanism
- Deadlock UX with resolution options
- Wideband Delphi estimation with variance handling

**Story 10.5 (Integration Tests)**: This story added test coverage for the enhanced refinement workflow. Tests verify:
- Doc-discovery phase behavior
- Cross-talk rounds with progressive truncation
- Binary blocker classification
- Security auto-blocker
- Early consensus exit
- Deadlock UX
- Temp file management
- Estimation phase

### Architecture Patterns Used

From `docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md`:
- **Opponent Processor / Multi-Agent Debate Pattern**: Agents with uncorrelated context windows debate each other's positions
- **BMAD Cross-Talk Pattern**: Spawn agents with each other's responses as context
- **Wideband Delphi / Planning Poker**: Independent estimation followed by discussion and re-estimation
- **Filesystem-Based State Pattern**: Temp files in `sprints/SW-XXX/temp/` preserve agent analyses
- **Binary Blocker Resolution**: Simple blocker/non-blocker classification
- **Progressive Context Truncation**: 400→300→200 words per round to force convergence

### Documentation Files to Modify

1. **`scrum_workflow/docs/04-command-reference.md`**: Main command reference documentation
   - Currently has basic `/scrum-refine-ticket` documentation (lines 33-63)
   - Needs expansion to include all 6 phases and configuration options

2. **`scrum_workflow/docs/05-state-machine.md`**: State machine documentation
   - Currently shows basic refinement state (lines 1-141)
   - Needs update to show refinement phase internal states

3. **`README.md`**: Main project readme
   - Currently at version 1.2.0 (lines 1-234)
   - Needs enhanced refinement features in Features section
   - Needs Epic 10 in Completed Epics section

### Configuration Options to Document

From `scrum_workflow/config.yaml`:
```yaml
refinement:
  max_discussion_rounds: 3           # Max cross-talk rounds before escalation
  keep_agent_temp_files: false       # Auto-cleanup temp files after synthesis
  estimation_variance_threshold: 2   # Points variance triggering re-estimation
  early_exit_on_consensus: true      # Exit early if only non-blockers remain
  security_auto_blocker: true        # Force security issues as blockers
```

### 6-Phase Workflow to Document

1. **Phase 1: Doc-Discovery**
   - Loads auto-context from `_scrum-output/context/`
   - Prompts user for additional documents (paths or URLs)
   - Validates paths and fetches URLs
   - Stores discovered documents for agent context

2. **Phase 2: Initial Perspectives (Round 0)**
   - Spawns 3 agents in parallel with isolated context
   - Each agent writes analysis to temp files
   - Each agent receives: story.md + discovered documents + role-specific instructions ONLY

3. **Phase 3: Cross-Talk Rounds (up to 3)**
   - Round 1: 400 words per agent
   - Round 2: 300 words per agent
   - Round 3: 200 words per agent
   - Binary blocker classification (blocker vs non-blocker)
   - Security auto-blocker (security issues forced as blockers)
   - Early exit when only non-blockers remain
   - Deadlock UX after max rounds with blockers

4. **Phase 4: Estimation (Wideband Delphi)**
   - Independent estimates from all agents
   - Variance check (threshold: 2 points)
   - Re-estimation discussion if high variance
   - Final estimate = median of estimates
   - Confidence = lowest of three confidences

5. **Phase 5: Synthesis**
   - Merge agreed perspectives into story.md
   - Document blocker resolution
   - Cleanup temp files (configurable)

6. **Phase 6: Readiness Check**
   - Validate story completeness (existing behavior)
   - PASS → ready, FAIL → draft

### Example refinement.md Structure to Document

```markdown
# Refinement: SW-XXX

## Document Discovery
- Auto-detected: context/architecture.md, context/backend.md
- User-provided: docs/api-spec.md, https://example.com/standards

## Initial Perspectives (Round 0)
### Architect Analysis
[Summary]

### Developer Analysis
[Summary]

### QA Analysis
[Summary]

## Discussion Rounds
### Round 1 Summary
- Agreements: [...]
- Disagreements: [...]
- Blockers: 1 | Non-blockers: 2

### Round 2 Summary
- Agreements: [...]
- Disagreements: [...]
- Blockers: 0 | Non-blockers: 1

## Blocker Resolution
- Resolved: [Issue 1] - [Resolution]
- Escalated: None

## Estimation
| Agent | Points | Confidence | Reasoning |
|-------|--------|------------|-----------|
| Architect | 5 | high | Clear requirements, known patterns |
| Developer | 3 | medium | Some complexity in edge cases |
| QA | 5 | high | Test coverage straightforward |

**Final Estimate**: 5 points (median)
**Confidence**: medium (lowest)
**Method**: wideband-delphi
```

### Project Structure Notes

- All documentation files use standard Markdown format
- Command reference follows the established pattern of sections: Usage, Prerequisites, What happens, Output, See also
- State machine documentation uses Mermaid diagrams
- README follows the established section structure

### Anti-Patterns to Avoid

1. **Do NOT duplicate information**: Link to existing documentation where appropriate
2. **Do NOT document features not yet implemented**: Only document what is in Story 10.4
3. **Do NOT break existing documentation structure**: Follow established patterns
4. **Do NOT add new documentation files**: Update existing files only

### References

- [Source: scrum_workflow/workflows/refinement.md] -- Complete workflow specification
- [Source: scrum_workflow/commands/refine-ticket.md] -- Command definition
- [Source: scrum_workflow/config.yaml] -- Configuration options
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 10, Story 10.6] -- Story requirements
- [Source: _bmad-output/implementation-artifacts/10-4-updated-refinement-workflow.md] -- Previous story (workflow update)
- [Source: docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md] -- Research basis
- [Source: scrum_workflow/docs/04-command-reference.md] -- Current command reference (to be updated)
- [Source: scrum_workflow/docs/05-state-machine.md] -- Current state machine doc (to be updated)
- [Source: README.md] -- Current readme (to be updated)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

- `scrum_workflow/docs/04-command-reference.md` (modified - enhanced refinement documentation)
- `scrum_workflow/docs/05-state-machine.md` (modified - refinement internal states)
- `README.md` (modified - features and completed epics)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified - status update)
