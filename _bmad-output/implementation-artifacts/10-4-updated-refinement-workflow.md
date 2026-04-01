# Story 10.4: Updated Refinement Workflow

Status: in-progress

## Story

As a developer,
I want the refinement workflow to orchestrate doc-discovery, cross-talk, and estimation in sequence,
so that the `/scrum-refine-ticket` command produces better refinement outcomes through collaborative agent discussion.

## Acceptance Criteria

1. **Workflow Structure Update**: `scrum_workflow/workflows/refinement.md` is updated with the new 6-phase structure:
   - **Phase 1: Doc-Discovery** -- Load auto-context + prompt user for additional docs
   - **Phase 2: Initial Perspectives** -- Spawn 3 agents in parallel with isolated context, write to temp files
   - **Phase 3: Cross-Talk Rounds** -- Up to 3 rounds with binary blocker classification, early exit on consensus
   - **Phase 4: Estimation** -- Wideband Delphi with variance handling
   - **Phase 5: Synthesis** -- Merge agreed perspectives into story.md, cleanup temp files
   - **Phase 6: Readiness Check** -- Validate story completeness (existing behavior)

2. **Command Frontmatter Update**: `scrum_workflow/commands/refine-ticket.md` frontmatter includes:
   ```yaml
   features:
     doc_discovery: true
     discussion_rounds: 3
     estimation: true
     consensus_required: true
     temp_file_cleanup: true
   ```

3. **Configuration Support**: `config.yaml` supports the following refinement configuration:
   ```yaml
   refinement:
     max_discussion_rounds: 3           # Max cross-talk rounds before escalation
     keep_agent_temp_files: false       # Auto-cleanup temp files after synthesis
     estimation_variance_threshold: 2   # Points variance triggering re-estimation
     early_exit_on_consensus: true      # Exit early if only non-blockers remain
     security_auto_blocker: true        # Force security issues as blockers
   ```

4. **Temp File Structure**: Temp files are stored in `sprints/SW-XXX/temp/` directory:
   ```
   sprints/SW-101/
   ├── temp/
   │   ├── architect-round-0.md
   │   ├── developer-round-0.md
   │   ├── qa-round-0.md
   │   ├── round-1-summary.md
   │   ├── round-2-summary.md
   │   └── round-3-summary.md
   ```

5. **Progressive Truncation**: Cross-talk rounds use progressive truncation (400->300->200 words)

6. **Binary Blocker Classification**: Each disagreement classified as blocker/non-blocker

7. **Security Auto-Blocker**: Security issues forced as blockers regardless of agent classification

8. **Early Consensus Exit**: Workflow exits early when only non-blockers remain

9. **Deadlock UX**: After max rounds with blockers, user sees resolution options

10. **Temp File Cleanup**: Temp directory removed after synthesis (when `keep_agent_temp_files: false`)

11. **Estimation Phase**: Collects independent estimates from all agents with variance handling

12. **Refinement Documentation**: `refinement.md` includes all new sections: Document Discovery, Discussion Rounds, Estimation

13. **Story Frontmatter**: `story.md` frontmatter includes estimation with points and confidence

14. **Git Ignore**: `.gitignore` includes `sprints/*/temp/` pattern

## Tasks / Subtasks

- [x] Task 1: Update `scrum_workflow/workflows/refinement.md` workflow structure (AC: #1)
  - [x] 1.1: Reorganize workflow steps into 6 clear phases with phase headers
  - [x] 1.2: Ensure Phase 1 (Doc-Discovery) is Step 4.5
  - [x] 1.3: Ensure Phase 2 (Initial Perspectives) covers Steps 5-7 with temp file creation (Step 7.1-7.3)
  - [x] 1.4: Ensure Phase 3 (Cross-Talk Rounds) is Step 7.5 with all sub-steps
  - [x] 1.5: Ensure Phase 4 (Estimation) is Steps 7.6-7.11
  - [x] 1.6: Ensure Phase 5 (Synthesis) is Step 10 with temp file cleanup (Step 10.5)
  - [x] 1.7: Ensure Phase 6 (Readiness Check) is Step 11 (existing behavior)
  - [x] 1.8: Add workflow phase summary at the top of the file

- [ ] Task 2: Update `scrum_workflow/commands/refine-ticket.md` frontmatter (AC: #2)
  - [ ] 2.1: Add `features` section to frontmatter with all required flags
  - [ ] 2.2: Update Features section to document all 6 phases
  - [ ] 2.3: Add Configuration section documenting all new config options

- [ ] Task 3: Update `scrum_workflow/config.yaml` with refinement settings (AC: #3)
  - [ ] 3.1: Add `refinement:` section with all 5 configuration options
  - [ ] 3.2: Add comments explaining each configuration option
  - [ ] 3.3: Use sensible defaults matching the acceptance criteria

- [ ] Task 4: Verify temp file structure and cleanup (AC: #4, #5, #10)
  - [ ] 4.1: Verify temp directory creation in Step 7.1
  - [ ] 4.2: Verify temp files are created for Round 0 analyses
  - [ ] 4.3: Verify temp file cleanup in Step 10.5
  - [ ] 4.4: Verify cleanup is conditional on `keep_agent_temp_files` setting

- [ ] Task 5: Verify progressive truncation (AC: #5)
  - [ ] 5.1: Verify Round 1 uses 400 words per agent (Step 7.5.1)
  - [ ] 5.2: Verify Round 2 uses 300 words per agent (Step 7.5.5)
  - [ ] 5.3: Verify Round 3 uses 200 words per agent (Step 7.5.6)

- [ ] Task 6: Verify binary blocker classification and security auto-blocker (AC: #6, #7)
  - [ ] 6.1: Verify blocker/non-blocker classification in Step 7.5.2
  - [ ] 6.2: Verify security auto-blocker rule in Step 7.5.2

- [ ] Task 7: Verify early consensus exit and deadlock UX (AC: #8, #9)
  - [ ] 7.1: Verify early exit check in Step 7.5.4
  - [ ] 7.2: Verify deadlock detection in Step 7.5.7
  - [ ] 7.3: Verify user resolution options are presented

- [ ] Task 8: Verify estimation phase integration (AC: #11, #12, #13)
  - [ ] 8.1: Verify Step 7.6 collects independent estimates
  - [ ] 8.2: Verify Step 7.7 calculates variance
  - [ ] 8.3: Verify Step 7.8 handles re-estimation
  - [ ] 8.4: Verify Step 7.9 calculates final median estimate
  - [ ] 8.5: Verify Step 7.10 stores estimate in story.md
  - [ ] 8.6: Verify Step 7.11 documents estimation in refinement.md

- [ ] Task 9: Update `.gitignore` pattern (AC: #14)
  - [ ] 9.1: Add `sprints/*/temp/` pattern to project `.gitignore`
  - [ ] 9.2: Verify pattern excludes temp directories from version control

- [ ] Task 10: Update `scrum_workflow/templates/refinement.md` if needed (AC: #12)
  - [ ] 10.1: Verify template includes Document Discovery section
  - [ ] 10.2: Verify template includes Discussion Rounds section
  - [ ] 10.3: Verify template includes Estimation section

- [ ] Task 11: Final validation and testing
  - [ ] 11.1: Run `npm test` to verify all integration tests pass
  - [ ] 11.2: Manually test refinement workflow with a sample story

## Dev Notes

### Critical Context from Previous Stories

**Story 10.1 (Doc-Discovery)**: Implemented doc-discovery phase in Step 4.5 of the refinement workflow. The workflow already includes:
- Step 4.5.1-4.5.5: Doc-discovery phase implementation
- User prompt for additional documents
- Path validation and URL fetching
- Storage of discovered documents for agent context

**Story 10.2 (Cross-Talk Discussion Rounds)**: Implemented cross-talk discussion rounds. The workflow already includes:
- Step 7.1-7.3: Temp directory creation and Round 0 analyses storage
- Step 7.5.1-7.5.7: Cross-talk rounds with progressive truncation
- Binary blocker classification (Step 7.5.2)
- Security auto-blocker (Step 7.5.2)
- Early consensus exit (Step 7.5.4)
- Deadlock detection and UX (Step 7.5.7)

**Story 10.3 (Estimation Phase)**: Implemented Wideband Delphi estimation. The workflow already includes:
- Step 7.6: Initial estimates collection
- Step 7.7: Variance check
- Step 7.8: Re-estimation discussion
- Step 7.9: Final estimate calculation (median)
- Step 7.10: Store estimate in story.md
- Step 7.11: Document estimation in refinement.md

### What Story 10.4 Actually Does

This story is primarily a **consolidation and documentation story**. The individual features (doc-discovery, cross-talk, estimation) have already been implemented in Stories 10.1-10.3. This story:

1. **Reorganizes the workflow** into clear 6-phase structure with phase headers
2. **Updates command frontmatter** to declare all features
3. **Adds configuration support** to config.yaml for all refinement settings
4. **Adds .gitignore pattern** for temp directories
5. **Validates the complete workflow** works end-to-end

### Architecture Compliance

- **No new workflow logic needed**: All logic is already in place from Stories 10.1-10.3
- **Modify existing files**:
  - `scrum_workflow/workflows/refinement.md` (add phase headers, reorganize)
  - `scrum_workflow/commands/refine-ticket.md` (add features to frontmatter)
  - `scrum_workflow/config.yaml` (add refinement configuration section)
  - `.gitignore` (add temp directory pattern)
  - `scrum_workflow/templates/refinement.md` (verify sections exist)

### Current Workflow Step Mapping

The existing workflow already has all the steps needed. The task is to add phase headers and verify organization:

| Phase | Steps | Status |
|-------|-------|--------|
| Phase 1: Doc-Discovery | Step 4.5 | Already implemented (Story 10.1) |
| Phase 2: Initial Perspectives | Steps 5-7.3 | Already implemented (Story 10.2) |
| Phase 3: Cross-Talk Rounds | Step 7.5 | Already implemented (Story 10.2) |
| Phase 4: Estimation | Steps 7.6-7.11 | Already implemented (Story 10.3) |
| Phase 5: Synthesis | Step 10 | Already exists (includes temp cleanup in 10.5) |
| Phase 6: Readiness Check | Step 11 | Already exists |

### Configuration Options to Add

Add to `scrum_workflow/config.yaml`:

```yaml
# Refinement configuration (Epic 10 - Enhanced Refinement)
refinement:
  max_discussion_rounds: 3           # Max cross-talk rounds before escalation
  keep_agent_temp_files: false       # Auto-cleanup temp files after synthesis
  estimation_variance_threshold: 2   # Points variance triggering re-estimation
  early_exit_on_consensus: true      # Exit early if only non-blockers remain
  security_auto_blocker: true        # Force security issues as blockers
```

### Command Frontmatter to Add

Update `scrum_workflow/commands/refine-ticket.md` frontmatter to include:

```yaml
features:
  doc_discovery: true
  discussion_rounds: 3
  estimation: true
  consensus_required: true
  temp_file_cleanup: true
```

### Anti-Patterns to Avoid

1. **Do NOT rewrite existing workflow steps**: The logic is already correct from Stories 10.1-10.3
2. **Do NOT change step numbering**: Keep existing step numbers intact
3. **Do NOT modify agent definitions**: Agents remain unchanged
4. **Do NOT add new workflow logic**: This is organization/documentation only
5. **Do NOT skip validation**: Verify all pieces work together end-to-end

### Testing Considerations

1. **Verify 6-phase structure**: Ensure phase headers are clear and steps are correctly grouped
2. **Verify config options**: Ensure config.yaml settings are respected by the workflow
3. **Verify temp file cleanup**: Test with `keep_agent_temp_files: true` and `false`
4. **Verify .gitignore**: Test that temp directories are excluded from git
5. **Run full refinement**: Test complete workflow end-to-end

### References

- [Source: scrum_workflow/workflows/refinement.md] -- Current workflow with all steps
- [Source: scrum_workflow/commands/refine-ticket.md] -- Current command definition
- [Source: scrum_workflow/config.yaml] -- Current configuration
- [Source: scrum_workflow/templates/refinement.md] -- Current refinement template
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 10, Story 10.4] -- Story requirements
- [Source: _bmad-output/implementation-artifacts/10-1-doc-discovery-phase-for-refinement.md] -- Previous story (doc-discovery)
- [Source: _bmad-output/implementation-artifacts/10-2-cross-talk-discussion-rounds.md] -- Previous story (cross-talk)
- [Source: _bmad-output/implementation-artifacts/10-3-estimation-phase-wideband-delphi.md] -- Previous story (estimation)
- [Source: docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md] -- Research basis for enhanced refinement

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

- `scrum_workflow/workflows/refinement.md` (modified - add phase headers, reorganize)
- `scrum_workflow/commands/refine-ticket.md` (modified - add features to frontmatter)
- `scrum_workflow/config.yaml` (modified - add refinement configuration section)
- `.gitignore` (modified - add temp directory pattern)
- `scrum_workflow/templates/refinement.md` (verified - ensure sections exist)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified - status update)
