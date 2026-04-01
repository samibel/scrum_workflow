# Story 10.3: Estimation Phase (Wideband Delphi)


Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want each agent to provide an independent story point estimate with confidence level,
so that we get a collaborative estimation that surfaces uncertainty and drives discussion.

## Acceptance Criteria

**Given** the cross-talk discussion from Story 10.2 is complete (or user has resolved disagreements)
**When** the estimation phase begins
**Then** each agent provides an **independent estimate** without seeing others' estimates:
  - Story points (Fibonacci: 1, 2, 3, 5, 8, etc.)
  - Architect: Focuses on architectural impact, dependencies, and system design
  - Developer: Focuses on implementation complexity, dependencies, library choices
  - QA: Focuses on testing strategy, edge cases, quality assurance

**And** after discussion, the final estimate is calculated using median calculation
**And** the final estimate is stored in the story.md YAML frontmatter
**And** if variance exceeds threshold (configurable via `estimation_variance_threshold`),  agents discuss estimates to reach consensus
**And** the discussion is documented in `refinement.md` under "## Estimation" section
**And** if variance still exceeds threshold after max rounds, the user is prompted for resolution options
**And** if user cannot resolve within max rounds, the system presents a deadlock warning and**And** documentation includes the blockers and unresolved disagreements

### Technical Requirements

- **Wideband Delphi Pattern**: Implement estimation using the Wideband Delphi / Planning Poker methodology
- **Independent Estimates**: Each agent (Architect, Developer, QA) provides their estimate independently without seeing others' estimates
- **Variance Threshold**: If estimates differ by more than 2 points, a re-estimation discussion is triggered. This is configurable via `estimation_variance_threshold` in `config.yaml` (default: 2 points)
    - **Consensus Building**: Final estimate is calculated as median of all estimates

- **Configurable Threshold**: Threshold stored in `config.yaml` as `estimation_variance_threshold` (default: 2 points)

### Architecture Compliance

- **No new files**: All implementation uses existing files
- **Modify existing files**:
  - `scrum_workflow/commands/refine-ticket.md` (add estimation phase invocation after estimation)
  - `scrum_workflow/workflows/refinement.md` (add estimation steps after cross-talk)
  - `scrum_workflow/templates/refinement.md` (add Estimation section)
          - `_bmad-output/implementation-artifacts/sprint-status.yaml` (status tracking only)

### File Structure Requirements

```
scrum_workflow/
├── commands/
│   └── refine-ticket.md
├── workflows/
│   └── refinement.md
├── templates/
│   └── refinement.md
_bmad-output/
└── implementation-artifacts/
    └── sprint-status.yaml
```

### Testing Requirements

- **Manual Testing**:
  1. Run `/scrum-refine-ticket SW-XXX` on a test story
  2. Verify initial estimates are collected from all agents
  3. Verify variance calculation works correctly
  4. If variance > threshold, verify re-estimation discussion
  5. Verify final estimate is calculated as median
  6. Verify final estimate is stored in story.md
  7. Verify estimation section is added to refinement.md

### References

- [Source: scrum_workflow/workflows/refinement.md] -- Estimation phase integration point
- [Source: scrum_workflow/templates/refinement.md] -- Estimation section template
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 10, Story 10.3] -- Story requirements
- [Source: docs/research/multi-agent-consensus-patterns-refinement-2026-03-31.md] -- Research basis for enhanced refinement

## Dev Notes

### Implementation Notes

- **Independent Estimates**: Each agent must provide their estimate independently without seeing others' estimates. This prevents anchoring bias.
- **Variance Threshold**: If estimates differ by more than 2 points, a re-estimation discussion is triggered. This is configurable via `estimation_variance_threshold` in `config.yaml`.
- **Final Estimate Calculation**: The final estimate is the median of all estimates after discussion. Median is more robust than average against outliers.
- **Story Points**: Use Fibonacci scale (1, 2, 3, 5, 8, 13, 21) for story point estimates. This provides a range that indicates complexity
- **Configuration**: All estimation settings are configurable in `config.yaml` with sensible defaults.

### Critical Context from Previous Stories

- **Story 10.1**: Doc-discovery phase - provides additional context for agents
- **Story 10.2**: Cross-talk discussion rounds - agents discuss findings before estimation

### Integration with Existing Refinement Workflow

The estimation phase integrates into the existing refinement workflow as follows:

1. **After Cross-Talk** (Step 7.5.8 in refinement.md): Estimation phase begins
2 2. **Initial Estimates**: Each agent provides estimate independently
        3. **Variance Check**: If variance > threshold, trigger re-estimation discussion
    4. **Final Estimate**: Calculate median of all estimates
    5. **Storage**: Store final estimate in story.md and refinement.md
6. **Documentation**: Add estimation section to refinement.md

### Estimation Phase Workflow Steps

1. **Step 7.6: Initial Estimates** - Collect independent estimates from all agents
    2. **Step 7.7: Variance Check** - Check if variance exceeds threshold
    3. **Step 7.8: Re-Estimation** - If variance > threshold, trigger discussion
    4. **Step 7.9: Final Estimate** - Calculate median of all estimates
    5. **Step 7.10: Store Estimate** - Update story.md with final estimate
    6. **Step 7.11: Document Estimation** - Add estimation section to refinement.md

### Configuration Options

```yaml
# In config.yaml
refinement_max_rounds: 3              # Max cross-talk rounds
keep_agent_temp_files: false        # Keep temp files for debugging
estimation_variance_threshold: 2     # Re-estimation threshold (points)
early_exit_on_consensus: true      # Exit early on consensus
security_auto_blocker: true        # Force security issues as blockers
```

### Developer Agent Guardrails

- **Do NOT create new estimation algorithms** - Use standard Wideband Delphi method
- **Do NOT modify agent definitions** - Agents provide estimates using existing output format
- **Do NOT create new configuration files** - Use existing config.yaml
- **Do NOT skip variance check** - Always check variance threshold
- **Do NOT store estimates in separate files** - All estimates stored in refinement.md and story.md
