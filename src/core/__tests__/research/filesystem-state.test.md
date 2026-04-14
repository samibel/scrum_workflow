# Filesystem-Based State for Long-Running Research - Acceptance Tests

**Test Type**: ATDD Failing Acceptance Tests (TDD Red Phase)
**Story**: 9-6 Filesystem-Based State for Long-Running Research
**Date**: 2026-03-30
**Status**: FAILING (TDD Red Phase - Expected)

---

## Test Objective

Validate that the Filesystem-Based State pattern correctly persists research state to `_scrum-output/memory/research/.research-state.json`, enables checkpoint recovery on interruption, and allows resuming from the last completed step.

## Acceptance Criteria Under Test

From Story 9-6:

1. AC1: The workflow creates `_scrum-output/memory/research/.research-state.json` at the start of each research task
2. AC2: The state file tracks: `research_id`, `topic`, `start_time`, `status`, `completed_steps`, `findings`, `sources_consulted`
3. AC3: The state file is updated incrementally during research -- not only at the end
4. AC4: If interrupted, `status` is set to `interrupted` and `last_completed_step` is recorded
5. AC5: When run again with same topic, agent reads `.research-state.json` and offers to resume
6. AC6: User can choose to resume or start fresh
7. AC7: If resumed, agent skips already-completed steps and continues from `last_completed_step`
8. AC8: The state file is valid JSON and human-readable
9. AC9: The state file is included in `.gitignore` recommendations

---

## Test Cases

### TC-01: State File Creation at Research Start

**Description**: Verify that `.research-state.json` is created when research begins.

**Preconditions**:
- Clean state: No existing `.research-state.json` file
- Research command invoked: `/scrum-research technical "test topic"`

**Steps**:
1. Invoke `/scrum-research technical "test topic"`
2. Check for existence of `_scrum-output/memory/research/.research-state.json` immediately after Step 0 (Input Parsing)

**Expected Result**:
```json
{
  "research_id": "<uuid>",
  "topic": "test topic",
  "start_time": "<ISO-8601-timestamp>",
  "status": "planning",
  "completed_steps": ["step-0-input-parsing"],
  "findings": [],
  "sources_consulted": [],
  "last_completed_step": "step-0-input-parsing"
}
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-01: State file created at research start', async () => {
  const stateFile = '_scrum-output/memory/research/.research-state.json';
  await expect(fs.exists(stateFile)).resolves.toBe(true);

  const state = JSON.parse(await fs.readFile(stateFile, 'utf8'));
  expect(state.research_id).toBeDefined();
  expect(state.topic).toBe('test topic');
  expect(state.start_time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  expect(state.status).toBe('planning');
  expect(state.completed_steps).toContain('step-0-input-parsing');
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-02: State File Contains All Required Fields

**Description**: Verify that the state file includes all required fields per the acceptance criteria.

**Preconditions**:
- Research in progress with state file created

**Steps**:
1. Read `_scrum-output/memory/research/.research-state.json`
2. Verify all required fields are present and have correct types

**Expected Result**:
```json
{
  "research_id": "string",
  "topic": "string",
  "start_time": "ISO-8601 string",
  "status": "planning|researching|reflecting|synthesizing|complete|interrupted",
  "completed_steps": ["string"],
  "findings": ["object"],
  "sources_consulted": ["string"],
  "last_completed_step": "string|null"
}
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-02: State file contains all required fields', async () => {
  const state = JSON.parse(await fs.readFile('_scrum-output/memory/research/.research-state.json', 'utf8'));

  // Required fields per AC2
  expect(typeof state.research_id).toBe('string');
  expect(typeof state.topic).toBe('string');
  expect(typeof state.start_time).toBe('string');
  expect(['planning', 'researching', 'reflecting', 'synthesizing', 'complete', 'interrupted']).toContain(state.status);
  expect(Array.isArray(state.completed_steps)).toBe(true);
  expect(Array.isArray(state.findings)).toBe(true);
  expect(Array.isArray(state.sources_consulted)).toBe(true);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-03: Incremental State Updates During Research

**Description**: Verify that the state file is updated incrementally as research progresses, not only at the end.

**Preconditions**:
- Research workflow in progress
- State file exists from Step 0

**Steps**:
1. Record state after Step 1 (Validation)
2. Record state after Step 2 (Agent & Context Loading)
3. Record state after Step 3 (Scope Confirmation)
4. Verify each step updates `completed_steps` and `last_completed_step`

**Expected Result**:
```javascript
// After Step 1
{
  "completed_steps": ["step-0-input-parsing", "step-1-validation"],
  "last_completed_step": "step-1-validation",
  "status": "planning"
}

// After Step 2
{
  "completed_steps": ["step-0-input-parsing", "step-1-validation", "step-2-agent-context-loading"],
  "last_completed_step": "step-2-agent-context-loading",
  "status": "planning"
}
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-03: State updated incrementally during research', async () => {
  // Simulate stepping through workflow
  const states = [];

  // Capture state after each step
  for (const step of ['step-1', 'step-2', 'step-3']) {
    await workflow.advanceToStep(step);
    const state = JSON.parse(await fs.readFile('_scrum-output/memory/research/.research-state.json', 'utf8'));
    states.push(state);
  }

  // Verify incremental updates
  expect(states[0].completed_steps.length).toBeLessThan(states[1].completed_steps.length);
  expect(states[1].completed_steps.length).toBeLessThan(states[2].completed_steps.length);

  // Verify last_completed_step updates
  expect(states[0].last_completed_step).not.toBe(states[1].last_completed_step);
  expect(states[1].last_completed_step).not.toBe(states[2].last_completed_step);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-04: Interruption Sets Status to Interrupted

**Description**: Verify that when research is interrupted (user cancellation, context limit, error), the status is set to `interrupted` and `last_completed_step` is recorded.

**Preconditions**:
- Research in progress at Step 5 or later
- Interruption triggered (simulated)

**Steps**:
1. Start research on a topic
2. Simulate interruption at Step 5 (Phase 2 - Research Plan)
3. Read state file and verify interruption handling

**Expected Result**:
```json
{
  "status": "interrupted",
  "last_completed_step": "step-4-output-directory-creation",
  "completed_steps": ["step-0", "step-1", "step-2", "step-3", "step-4"],
  "interruption_reason": "user_cancelled|context_limit|error",
  "interruption_time": "<ISO-8601-timestamp>"
}
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-04: Interruption sets status to interrupted', async () => {
  // Start research
  await workflow.start('test topic');

  // Simulate interruption
  await workflow.simulateInterruption('user_cancelled');

  const state = JSON.parse(await fs.readFile('_scrum-output/memory/research/.research-state.json', 'utf8'));

  expect(state.status).toBe('interrupted');
  expect(state.last_completed_step).toBeDefined();
  expect(state.last_completed_step).not.toBeNull();
  expect(state.completed_steps.length).toBeGreaterThan(0);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-05: Resume Offered on Re-run with Same Topic

**Description**: Verify that when `/scrum-research technical` is run again with the same topic, the agent reads `.research-state.json` and offers to resume.

**Preconditions**:
- Previous research was interrupted
- `.research-state.json` exists with `status: "interrupted"`
- Topic matches previous research

**Steps**:
1. Run `/scrum-research technical "test topic"` (same topic as interrupted research)
2. Verify agent reads state file
3. Verify agent prompts user with resume option

**Expected Result**:
```
Previous research found for "test topic":
- Status: interrupted
- Last completed step: step-4-output-directory-creation
- Started: 2026-03-30T10:00:00Z

Would you like to:
[R] Resume from last completed step
[F] Start fresh (discard previous progress)
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-05: Resume offered on re-run with same topic', async () => {
  // Setup: Create interrupted state
  await fs.writeFile('_scrum-output/memory/research/.research-state.json', JSON.stringify({
    research_id: 'test-123',
    topic: 'test topic',
    status: 'interrupted',
    last_completed_step: 'step-4-output-directory-creation'
  }));

  // Run research with same topic
  const prompt = await workflow.start('test topic');

  // Verify resume prompt offered
  expect(prompt).toContain('Resume from last completed step');
  expect(prompt).toContain('Start fresh');
  expect(prompt).toContain('Previous research found');
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-06: User Can Choose Resume or Fresh Start

**Description**: Verify that the user can choose to resume or start fresh, and the workflow respects the choice.

**Preconditions**:
- Interrupted research state exists
- Resume prompt displayed

**Steps**:
1. Test option [R] Resume
2. Test option [F] Start fresh
3. Verify correct behavior for each

**Expected Result for [R] Resume**:
```json
{
  "status": "researching",
  "completed_steps": ["step-0", "step-1", "step-2", "step-3", "step-4", "step-5"],
  "resumed_from": "step-4-output-directory-creation"
}
```

**Expected Result for [F] Fresh**:
```json
{
  "research_id": "<new-uuid>",
  "status": "planning",
  "completed_steps": ["step-0-input-parsing"],
  "previous_research_id": "test-123"
}
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-06: User can choose resume or fresh start', async () => {
  // Setup interrupted state
  await setupInterruptedState('test topic');

  // Test Resume option
  await workflow.selectOption('R');
  let state = JSON.parse(await fs.readFile('_scrum-output/memory/research/.research-state.json', 'utf8'));
  expect(state.resumed_from).toBeDefined();
  expect(state.status).not.toBe('interrupted');

  // Reset and test Fresh option
  await setupInterruptedState('test topic');
  await workflow.selectOption('F');
  state = JSON.parse(await fs.readFile('_scrum-output/memory/research/.research-state.json', 'utf8'));
  expect(state.research_id).not.toBe('test-123');
  expect(state.completed_steps).toEqual(['step-0-input-parsing']);
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-07: Resume Skips Completed Steps

**Description**: Verify that when resumed, the agent skips already-completed steps and continues from `last_completed_step`.

**Preconditions**:
- Research interrupted at Step 5
- User chooses to resume

**Steps**:
1. Resume research from Step 5
2. Verify Steps 0-4 are NOT re-executed
3. Verify Step 5 is the first step executed after resume

**Expected Result**:
```
Resuming research from: step-4-output-directory-creation
Skipping completed steps: step-0, step-1, step-2, step-3, step-4
Continuing with: step-5-research-plan
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-07: Resume skips completed steps', async () => {
  // Setup interrupted state at step 4
  await setupInterruptedState('test topic', 'step-4-output-directory-creation');

  // Resume and capture execution log
  const executionLog = await workflow.resume();

  // Verify steps 0-4 were skipped
  expect(executionLog.skippedSteps).toContain('step-0-input-parsing');
  expect(executionLog.skippedSteps).toContain('step-1-validation');
  expect(executionLog.skippedSteps).toContain('step-2-agent-context-loading');
  expect(executionLog.skippedSteps).toContain('step-3-scope-confirmation');
  expect(executionLog.skippedSteps).toContain('step-4-output-directory-creation');

  // Verify step 5 was first executed
  expect(executionLog.firstExecutedStep).toBe('step-5-research-plan');
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-08: State File is Valid JSON and Human-Readable

**Description**: Verify that the state file is valid JSON and formatted for human readability.

**Preconditions**:
- State file exists from research in progress

**Steps**:
1. Read the state file
2. Parse as JSON (should not throw)
3. Verify formatting includes indentation (human-readable)

**Expected Result**:
```json
{
  "research_id": "550e8400-e29b-41d4-a716-446655440000",
  "topic": "test topic",
  "start_time": "2026-03-30T10:00:00.000Z",
  "status": "researching",
  "completed_steps": [
    "step-0-input-parsing",
    "step-1-validation"
  ],
  "findings": [],
  "sources_consulted": [],
  "last_completed_step": "step-1-validation"
}
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-08: State file is valid JSON and human-readable', async () => {
  const content = await fs.readFile('_scrum-output/memory/research/.research-state.json', 'utf8');

  // Should parse without error
  let state;
  expect(() => { state = JSON.parse(content); }).not.toThrow();

  // Should be formatted with indentation (human-readable)
  expect(content).toContain('\n'); // Multi-line
  expect(content).toContain('  '); // Indented

  // Round-trip should produce identical output
  const reparsed = JSON.stringify(state, null, 2);
  expect(content.trim()).toBe(reparsed.trim());
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-09: State File in Gitignore Recommendations

**Description**: Verify that `.research-state.json` is included in `.gitignore` recommendations.

**Preconditions**:
- Research workflow documentation exists

**Steps**:
1. Check workflow documentation for `.gitignore` recommendations
2. Verify `_scrum-output/memory/research/.research-state.json` or pattern is included

**Expected Result**:
```gitignore
# Research state (local, not committed)
_scrum-output/memory/research/.research-state.json
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-09: State file in gitignore recommendations', async () => {
  // Check workflow documentation
  const workflowDoc = await fs.readFile('scrum_workflow/workflows/research-technical.md', 'utf8');

  // Should mention gitignore
  expect(workflowDoc.toLowerCase()).toContain('gitignore');

  // Should recommend excluding state file
  expect(workflowDoc).toContain('.research-state.json');
});
```

**Status**: FAILING (TDD Red Phase)

---

### TC-10: Findings and Sources Persisted Incrementally

**Description**: Verify that `findings` and `sources_consulted` arrays are updated incrementally during the Swarm Research phase.

**Preconditions**:
- Research in Phase 3 (Swarm Research)
- Multiple subagents have completed

**Steps**:
1. Capture state after Subagent 1 completes
2. Capture state after Subagent 2 completes
3. Verify findings and sources arrays grow incrementally

**Expected Result**:
```javascript
// After Subagent 1
{
  "findings": [{ "subagent": "1", "aspect": "architecture", "finding": "..." }],
  "sources_consulted": ["https://source1.com", "https://source2.com"]
}

// After Subagent 2
{
  "findings": [
    { "subagent": "1", "aspect": "architecture", "finding": "..." },
    { "subagent": "2", "aspect": "frameworks", "finding": "..." }
  ],
  "sources_consulted": ["https://source1.com", "https://source2.com", "https://source3.com"]
}
```

**Assertion**:
```javascript
// FAILING TEST - Feature not yet implemented
test.skip('TC-10: Findings and sources persisted incrementally', async () => {
  await workflow.start('test topic');
  await workflow.advanceToPhase('swarm-research');

  // Capture state after first subagent
  await workflow.completeSubagent(1);
  const state1 = JSON.parse(await fs.readFile('_scrum-output/memory/research/.research-state.json', 'utf8'));

  // Capture state after second subagent
  await workflow.completeSubagent(2);
  const state2 = JSON.parse(await fs.readFile('_scrum-output/memory/research/.research-state.json', 'utf8'));

  // Verify incremental growth
  expect(state2.findings.length).toBeGreaterThan(state1.findings.length);
  expect(state2.sources_consulted.length).toBeGreaterThan(state1.sources_consulted.length);
});
```

**Status**: FAILING (TDD Red Phase)

---

## State File Schema Reference

```typescript
interface ResearchState {
  research_id: string;           // UUID v4
  topic: string;                 // Research topic
  start_time: string;            // ISO-8601 timestamp
  status: 'planning' | 'researching' | 'reflecting' | 'synthesizing' | 'complete' | 'interrupted';
  completed_steps: string[];     // Array of completed step IDs
  findings: Finding[];           // Intermediate research findings
  sources_consulted: string[];   // URLs of sources consulted
  last_completed_step: string | null;  // Most recent completed step
  interruption_reason?: string;  // Only when status === 'interrupted'
  interruption_time?: string;    // Only when status === 'interrupted'
  resumed_from?: string;         // Only when research was resumed
  previous_research_id?: string; // Only when fresh start from previous
}

interface Finding {
  subagent: string;
  aspect: string;
  finding: string;
  confidence: 'high' | 'medium' | 'low';
  sources: string[];
}
```

---

## ATDD Checklist

| AC # | Description | Test Case | Status |
|------|-------------|-----------|--------|
| AC1 | State file created at research start | TC-01 | FAILING (Red) |
| AC2 | State file contains all required fields | TC-02 | FAILING (Red) |
| AC3 | State updated incrementally | TC-03, TC-10 | FAILING (Red) |
| AC4 | Interruption sets status to interrupted | TC-04 | FAILING (Red) |
| AC5 | Resume offered on re-run | TC-05 | FAILING (Red) |
| AC6 | User can choose resume or fresh | TC-06 | FAILING (Red) |
| AC7 | Resume skips completed steps | TC-07 | FAILING (Red) |
| AC8 | State file is valid JSON and readable | TC-08 | FAILING (Red) |
| AC9 | State file in gitignore recommendations | TC-09 | FAILING (Red) |

---

## Implementation Notes

1. **State File Location**: `_scrum-output/memory/research/.research-state.json`
2. **Update Frequency**: After each workflow step completes
3. **Interruption Handling**: Try/catch around workflow steps, set status on error/cancel
4. **Resume Logic**: Check for existing state file on startup, compare topic, offer resume
5. **Step Tracking**: Use step IDs matching workflow step names (e.g., `step-0-input-parsing`)

---

## TDD Red Phase Summary

All tests in this file are marked with `test.skip()` indicating they are failing tests in the TDD red phase. These tests define the expected behavior for the Filesystem-Based State feature (Story 9-6).

**Next Steps (TDD Green Phase)**:
1. Implement state file creation in Step 0 of research workflow
2. Add incremental state updates after each workflow step
3. Implement interruption handling with status update
4. Add resume prompt logic on workflow startup
5. Implement step-skipping logic for resume
6. Update workflow documentation with gitignore recommendations

**Run Tests**: `npx jest scrum_workflow/__tests__/research/filesystem-state.test.md --passWithNoTests`
