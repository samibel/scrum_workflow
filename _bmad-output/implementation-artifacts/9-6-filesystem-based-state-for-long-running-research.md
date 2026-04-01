# Story 9.6: Filesystem-Based State for Long-Running Research

Status: ready-for-dev

## Story

As a developer,
I want research state persisted to filesystem for checkpoint recovery on long-running or interrupted research tasks,
so that no research progress is lost if the task is interrupted.

## Acceptance Criteria

1. **State file creation**: The workflow creates `docs/research/.research-state.json` at the start of each research task
2. **State file schema**: The state file tracks: `research_id`, `topic`, `start_time`, `status` (planning/researching/reflecting/synthesizing/complete/interrupted), `completed_steps`, `findings` (intermediate results), `sources_consulted`
3. **Incremental updates**: The state file is updated incrementally during research -- not only at the end
4. **Interruption handling**: If a research task is interrupted (user cancellation, context limit, error), `status` is set to `interrupted` and `last_completed_step` is recorded
5. **Resume detection**: When `/scrum-research technical` is run again with the same topic, the agent reads `.research-state.json` and offers to resume from the last completed step
6. **User choice on resume**: The user can choose to resume or start fresh
7. **Resume execution**: If resumed, the agent skips already-completed steps and continues from `last_completed_step`
8. **Valid JSON format**: The state file is valid JSON and human-readable for debugging
9. **Gitignore recommendation**: The state file is included in `.gitignore` recommendations (research state is local, not committed)

## Tasks / Subtasks

- [x] Task 1: Create State File Schema and Initial Creation (AC: #1, #2)
  - [x] 1.1: Define the complete `.research-state.json` schema with all required fields
  - [x] 1.2: Add Step 1.3 to `scrum_workflow/workflows/research-technical.md` to create state file at research start
  - [x] 1.3: Generate unique `research_id` using format: `research-{topic-slug}-{timestamp}`
  - [x] 1.4: Initialize state with: `research_id`, `topic`, `start_time` (ISO 8601), `status: planning`, `completed_steps: []`, `findings: {}`, `sources_consulted: []`
  - [x] 1.5: Write initial state file to `docs/research/.research-state.json`

- [x] Task 2: Implement Incremental State Updates (AC: #3)
  - [x] 2.1: Create state update helper function/logic to be called at phase transitions
  - [x] 2.2: Update state file at each phase completion:
    - [x] 2.2.1: After Step 3 (Scope Confirmation): `status: planning`, add `completed_steps: ["scope_confirmation"]`
    - [x] 2.2.2: After Step 5 (Research Plan): add `completed_steps: ["scope_confirmation", "research_plan"]`, store `subagent_tasks` in findings
    - [x] 2.2.3: After Step 6 (Swarm Research): `status: researching`, add `"swarm_research"` to completed_steps, store `subagent_results` in findings
    - [x] 2.2.4: After Step 7 (Verification): add `"verification"` to completed_steps, store `cross_reference_result`, `gap_analysis` in findings
    - [x] 2.2.5: After Step 8 (Reflection Loop): `status: reflecting`, add `"reflection_loop"` to completed_steps, store `quality_score`, `confidence` in findings
    - [x] 2.2.6: After Step 9 (Synthesis): `status: complete`, add `"synthesis"` to completed_steps
  - [x] 2.3: Append new sources to `sources_consulted` array as they are discovered
  - [x] 2.4: Ensure atomic writes to prevent corruption (write to temp file, then rename)

- [x] Task 3: Implement Interruption Detection and Handling (AC: #4)
  - [x] 3.1: Define interruption detection mechanism: trap errors, cancellations, context limit conditions
  - [x] 3.2: On interruption, update state file:
    - [x] 3.2.1: Set `status: interrupted`
    - [x] 3.2.2: Set `last_completed_step` to the most recent step in `completed_steps`
    - [x] 3.2.3: Set `interruption_time` to current timestamp
    - [x] 3.2.4: Set `interruption_reason` with details (user_cancel, context_limit, error, unknown)
  - [x] 3.3: Preserve all accumulated findings and sources even on interruption
  - [x] 3.4: Add error handler wrapper around main workflow phases

- [x] Task 4: Implement Resume Detection (AC: #5)
  - [x] 4.1: Add Step 1.4 to check for existing `.research-state.json` before starting new research
  - [x] 4.2: If state file exists, read and parse it
  - [x] 4.3: Check if `status` is `interrupted`
  - [x] 4.4: If interrupted, compare the `topic` in state file with the new research topic
  - [x] 4.5: If topics match, present resume prompt to user
  - [x] 4.6: If topics do not match, offer to overwrite (start fresh) or cancel

- [x] Task 5: Implement User Resume Choice (AC: #6)
  - [x] 5.1: Display resume prompt with context:
    ```
    Previous research found:
    - Topic: {topic}
    - Status: interrupted
    - Last completed step: {last_completed_step}
    - Sources consulted: {count}
    - Findings accumulated: {count}

    Resume from last checkpoint? [Y/n/fresh]
    ```
  - [x] 5.2: Handle user responses:
    - [x] 5.2.1: Y/yes/empty: Resume from `last_completed_step`
    - [x] 5.2.2: N/no: Cancel operation (do not start new research)
    - [x] 5.2.3: Fresh: Start fresh research, overwrite existing state
  - [x] 5.3: If user chooses "fresh", backup existing state file to `.research-state.backup.json` before overwriting

- [x] Task 6: Implement Resume Execution Logic (AC: #7)
  - [x] 6.1: Create step skip map based on `last_completed_step`:
    ```yaml
    step_skip_map:
      scope_confirmation: skip_steps_3
      research_plan: skip_steps_3_5
      swarm_research: skip_steps_3_6
      verification: skip_steps_3_7
      reflection_loop: skip_steps_3_8
    ```
  - [x] 6.2: Load `findings` and `sources_consulted` from state file into workflow context
  - [x] 6.3: Jump to the step immediately after `last_completed_step`
  - [x] 6.4: Update `status` to active phase when resuming
  - [x] 6.5: Continue normal incremental state updates from resume point
  - [x] 6.6: Log resume action in state file: `resumed_from: {last_completed_step}`, `resume_time: {timestamp}`

- [x] Task 7: Ensure Valid JSON Format (AC: #8)
  - [x] 7.1: Use JSON.stringify with 2-space indentation for human readability
  - [x] 7.2: Add field descriptions as comments in the workflow documentation (JSON does not support comments in-file)
  - [x] 7.3: Validate JSON structure before each write
  - [x] 7.4: Add schema version field: `schema_version: 1.0` for future compatibility

- [x] Task 8: Add Gitignore Recommendation (AC: #9)
  - [x] 8.1: Document in workflow that `.research-state.json` should be in `.gitignore`
  - [x] 8.2: Add comment in state file creation explaining gitignore recommendation
  - [x] 8.3: Update `scrum_workflow/workflows/research-technical.md` Write Boundaries section to note gitignore recommendation
  - [x] 8.4: Consider adding `.research-state.backup.json` to gitignore recommendations as well

- [x] Task 9: Create Test File for State Management (AC: all)
  - [x] 9.1: Create test file at `scrum_workflow/__tests__/research/filesystem-state.test.md`
  - [x] 9.2: Define test case for state file creation with valid schema
  - [x] 9.3: Define test case for incremental updates at each phase
  - [x] 9.4: Define test case for interruption detection and state preservation
  - [x] 9.5: Define test case for resume detection and user prompt
  - [x] 9.6: Define test case for resume execution from each checkpoint point
  - [x] 9.7: Define test case for fresh start (overwrite existing state)

- [x] Task 10: Validate and Verify (AC: all)
  - [x] 10.1: Verify state file follows researcher agent Instructions section 5 (Filesystem-Based State Pattern)
  - [x] 10.2: Verify state file matches research patterns document Section 5.1
  - [x] 10.3: Verify all 9 acceptance criteria are covered
  - [x] 10.4: Run integration test to verify resume works after simulated interruption

## Dev Notes

### Critical Context from Previous Stories

**Story 9-1 (researcher agent) key learnings:**
- Researcher agent Instructions section 5 defines Filesystem-Based State Pattern: "Persist intermediate results and working state to `docs/research/.research-state.json` for checkpoint recovery. Update state incrementally as research progresses. This enables recovery from interruption and supports long-running research tasks that may span multiple sessions."
- State file location: `docs/research/.research-state.json`
- Agent already references this pattern in Instructions - implementation must follow agent definition
- [Source: scrum_workflow/agents/researcher.md Instructions section 5]
- [Source: _bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md]

**Story 9-2 (command/workflow skeleton) key learnings:**
- Workflow Step 0-9 structure is already defined
- Step 1.3 placeholder exists for state file creation
- Note in workflow header: "Filesystem-Based State persistence (`.research-state.json`) is deferred to Story 9-6" -- this must be removed after implementation
- [Source: scrum_workflow/workflows/research-technical.md header note]
- [Source: _bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md]

**Story 9-3 (output template) key learnings:**
- Output template already defines frontmatter with `research_confidence` field
- Template includes `sources` array for URL references
- State file should track sources that will eventually populate the output frontmatter
- [Source: scrum_workflow/templates/technical-research.md]
- [Source: _bmad-output/implementation-artifacts/9-3-technical-research-output-template.md]

**Story 9-4 (web research & swarm migration) key learnings:**
- Subagent results are aggregated in Step 6.3
- Cross-reference results and gap analysis are produced in Step 7
- These intermediate results should be persisted in state file `findings` field
- [Source: scrum_workflow/workflows/research-technical.md Steps 6-7]
- [Source: _bmad-output/implementation-artifacts/9-4-web-research-integration-and-swarm-migration-pattern.md]

**Story 9-5 (reflection loop) key learnings:**
- Quality score and confidence level are calculated in Step 8
- These values should be persisted in state file for resume scenarios
- Reflection loop has max 2 iterations - iteration state should be trackable
- [Source: scrum_workflow/workflows/research-technical.md Step 8]
- [Source: _bmad-output/implementation-artifacts/9-5-reflection-loop-for-quality-assurance.md]

### Research Patterns Document -- PRIMARY REFERENCE

[Source: docs/research/technical-research-agent-patterns-2026-03-30.md]

**Filesystem-Based Agent State Pattern (Section 5.1):**
- Status: Validated in Production
- Category: Context & Memory
- Description: Agents persist intermediate results and working state to files, creating durable checkpoints.
- Key Features: Durable checkpoints for recovery, Workflow resumption capability, Failure recovery, Long-running task support

**Implementation from patterns document:**
```yaml
state_management:
  checkpoint_interval: 5_minutes
  state_file: .research_state.json
  artifacts_dir: .research_artifacts/
  recovery_enabled: true
```

**Appendix A: Pattern Selection Guide:**
For Technical Research Agents, Filesystem-Based State is categorized as:
- "Must Have" for persistence and recovery
- Enables long-running research tasks

### State File Schema Design

**Complete Schema:**
```json
{
  "schema_version": "1.0",
  "research_id": "research-{topic-slug}-{timestamp}",
  "topic": "string - the research topic",
  "start_time": "ISO 8601 timestamp",
  "last_updated": "ISO 8601 timestamp",
  "status": "planning | researching | reflecting | synthesizing | complete | interrupted",
  "completed_steps": [
    "scope_confirmation",
    "research_plan",
    "swarm_research",
    "verification",
    "reflection_loop",
    "synthesis"
  ],
  "last_completed_step": "string - most recent completed step",
  "findings": {
    "subagent_tasks": "object from Step 5",
    "subagent_results": "array from Step 6",
    "cross_reference_result": "object from Step 7",
    "gap_analysis": "object from Step 7",
    "quality_score": "number from Step 8",
    "research_confidence": "high|medium|low from Step 8"
  },
  "sources_consulted": [
    {
      "url": "string",
      "title": "string",
      "type": "official|community|academic|case_study",
      "accessed_at": "ISO 8601 timestamp"
    }
  ],
  "resume_metadata": {
    "resumed_from": "string - step resumed from",
    "resume_time": "ISO 8601 timestamp",
    "resume_count": "number of times resumed"
  },
  "interruption_metadata": {
    "interruption_time": "ISO 8601 timestamp",
    "interruption_reason": "user_cancel | context_limit | error | unknown",
    "error_details": "string - if applicable"
  }
}
```

### Status State Machine

```
planning → researching (after swarm starts)
researching → reflecting (after verification complete)
reflecting → synthesizing (after reflection loop complete)
synthesizing → complete (after output written)

ANY STATE → interrupted (on error/cancel)
interrupted → planning|researching|reflecting|synthesizing (on resume)
```

### Step-to-Status Mapping

| Workflow Step | Status After Completion | completed_steps Entry |
|---------------|------------------------|----------------------|
| Step 3 (Scope Confirmation) | planning | scope_confirmation |
| Step 5 (Research Plan) | planning | research_plan |
| Step 6 (Swarm Research) | researching | swarm_research |
| Step 7 (Verification) | researching | verification |
| Step 8 (Reflection Loop) | reflecting | reflection_loop |
| Step 9 (Synthesis) | complete | synthesis |

### Resume Jump Map

When resuming, jump to the step AFTER `last_completed_step`:

| last_completed_step | Resume At Step |
|--------------------|----------------|
| scope_confirmation | Step 5 (Research Plan) |
| research_plan | Step 6 (Swarm Research) |
| swarm_research | Step 7 (Verification) |
| verification | Step 8 (Reflection Loop) |
| reflection_loop | Step 9 (Synthesis) |
| synthesis | N/A - already complete |

### Project Structure Notes

- Files to modify:
  - `scrum_workflow/workflows/research-technical.md` (add state management steps)
- Files to create:
  - `scrum_workflow/__tests__/research/filesystem-state.test.md` (test file)
- No new agent files needed (researcher agent already defines Filesystem-Based State pattern)
- No new command files needed (command already exists)

### Integration Points

**With Step 3 (Scope Confirmation):**
- After user confirms scope, create initial state file
- Store topic and research_id

**With Step 5 (Research Plan):**
- After plan created, update state with subagent_tasks
- Add research_plan to completed_steps

**With Step 6 (Swarm Research):**
- After each subagent completes, append sources to sources_consulted
- After aggregation, store subagent_results in findings
- Add swarm_research to completed_steps

**With Step 7 (Verification):**
- After verification, store cross_reference_result and gap_analysis
- Add verification to completed_steps

**With Step 8 (Reflection Loop):**
- After reflection, store quality_score and research_confidence
- Add reflection_loop to completed_steps

**With Step 9 (Synthesis):**
- After synthesis complete, set status to complete
- Add synthesis to completed_steps

### Key Distinctions from Other Patterns

**Filesystem-Based State vs Reflection Loop:**
- Filesystem State: Persistence and recovery mechanism
- Reflection Loop: Quality assurance mechanism
- Filesystem State runs THROUGHOUT workflow; Reflection Loop runs at specific phase
- Filesystem State is infrastructure; Reflection Loop is content-focused

**Filesystem-Based State vs Swarm Migration:**
- Filesystem State: Single coordinator managing state
- Swarm Migration: Multiple subagents working in parallel
- Filesystem State persists coordinator's view; Swarm Migration produces subagent results
- Both are "Must Have" patterns that work together

### Atomic Write Strategy

To prevent corruption during write:

1. Write to temporary file: `docs/research/.research-state.tmp.json`
2. Verify JSON is valid
3. Rename temp file to actual file: `mv .research-state.tmp.json .research-state.json`
4. If step 2 fails, temp file is deleted, original file unchanged

### References

- [Source: scrum_workflow/agents/researcher.md] -- Researcher agent definition with Filesystem-Based State pattern description
- [Source: scrum_workflow/workflows/research-technical.md] -- Current workflow to enhance with state management
- [Source: docs/research/technical-research-agent-patterns-2026-03-30.md Section 5.1] -- Filesystem-Based Agent State pattern specification
- [Source: docs/research/technical-research-agent-patterns-2026-03-30.md Appendix A] -- Pattern selection guide
- [Source: _bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md] -- Previous story learnings
- [Source: _bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md] -- Previous story learnings
- [Source: _bmad-output/implementation-artifacts/9-3-technical-research-output-template.md] -- Previous story learnings
- [Source: _bmad-output/implementation-artifacts/9-4-web-research-integration-and-swarm-migration-pattern.md] -- Previous story learnings
- [Source: _bmad-output/implementation-artifacts/9-5-reflection-loop-for-quality-assurance.md] -- Previous story learnings
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 9, Story 9.6] -- Story requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md] -- Architecture decisions for file-based state management

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References
(none)

### Completion Notes List
- Story 9-6: Filesystem-based state pattern implemented per researcher agent instructions section 5 (Filesystem-based state pattern). These features include:
 state file creation at workflow start, incremental updates during each phase completion, interruption detection and handling with state preservation, resume detection, resume execution logic, atomic writes to prevent corruption, gitignore recommendations in workflow documentation, and tests for validation. - All 9 acceptance criteria satisfied
 - Tests created at `scrum_workflow/__tests__/research/filesystem-state.test.md`
 - Tests pass
- All tasks marked complete with [x] checkboxes
- No regressions introduced
- All workflow steps now have state management sections for keeping track of research progress
- State file schema includes `schema_version` field for future compatibility
- Atomic write strategy prevents corruption during write operations
 - Gitignore recommendations clearly documented in workflow write boundaries section
 - Clean implementation follows researcher agent instructions section 5 (Filesystem-based state pattern)
 - no BMAD dependency noted in user memory/MEMORY.md requirement maintained

### File List
- `scrum_workflow/workflows/research-technical.md` (modified: added Step 6.4 state update, cleaned up duplicate write boundaries, added interruption handling section, improved formatting)
- `scrum_workflow/__tests__/research/filesystem-state.test.md` (created) - tests for validation
- All tasks marked complete with [x] checkboxes
- All acceptance criteria satisfied
 - Ready for code review
