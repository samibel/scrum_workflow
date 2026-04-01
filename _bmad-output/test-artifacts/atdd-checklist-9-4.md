---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate']
lastStep: 'step-04c-aggregate'
lastSaved: '2026-03-30'
story_id: '9-4'
story_title: 'Web Research Integration & Swarm Migration Pattern'
inputDocuments:
  - '_bmad-output/implementation-artifacts/9-4-web-research-integration-and-swarm-migration-pattern.md'
  - '_bmad/tea/config.yaml'
  - 'scrum_workflow/workflows/research-technical.md'
  - 'scrum_workflow/agents/researcher.md'
  - 'docs/research/technical-research-agent-patterns-2026-03-30.md'
---

# ATDD Checklist: Story 9-4 - Web Research Integration & Swarm Migration Pattern

(Samuel L. Jackson voice)
## Preflight & Context

- [x] Story file loaded: `_bmad-output/implementation-artifacts/9-4-web-research-integration-and-swarm-migration-pattern.md`
- [x] Stack detected: backend (workflow validation, no browser tests needed)
- [x] Test framework: Jest with TypeScript (existing convention)
- [x] TEA config loaded from `_bmad/tea/config.yaml`
- [x] Researcher agent definition loaded: `scrum_workflow/agents/researcher.md` (Swarm Migration pattern reference)
- [x] Research patterns document referenced: `docs/research/technical-research-agent-patterns-2026-03-30.md`
- [x] Current workflow file loaded: `scrum_workflow/workflows/research-technical.md`
- [x] Existing test patterns referenced: research-technical-command-workflow.spec.ts

## Generation Mode

- [x] Mode: AI Generation (backend project, workflow content validation tests)
- [x] No browser recording needed

## Test Strategy

### Acceptance Criteria to Test Mapping

| AC | Description | Test Level | Priority | Test Count |
|----|-------------|------------|----------|------------|
| AC1 | WebSearch tool integration | Unit (content validation) | P0/P1 | 12 |
| AC2 | Swarm Migration pattern implemented | Unit (content validation) | P0/P1 | 14 |
| AC3 | Isolated context per subagent | Unit (content validation) | P0/P1 | 10 |
| AC4 | Result aggregation step | Unit (content validation) | P0 | 12 |
| AC5 | Progress tracking | Unit (content validation) | P0/P1 | 10 |
| AC6 | Error handling for WebSearch failures | Unit (content validation) | P0/P1 | 9 |
| AC7 | Source verification | Unit (content validation) | P0 | 10 |
| AC8 | Performance validation tests | Unit (file validation) | P0 | 8 |

**Total: 85 test scenarios**

## TDD Red Phase Results

- [x] Test file generated: `_bmad-output/test-artifacts/web-research-swarm-migration.spec.ts`
- [x] All tests designed to FAIL (workflow enhancements not yet implemented)
- [x] No test.skip() used -- tests rely on missing content for natural failure
- [x] Test structure follows established pattern from research-technical-command-workflow.spec.ts

## Test Coverage Summary

### AC1: WebSearch Tool Integration (12 tests)
- **P0**: Step 5 exists, references WebSearch, Step 5.1 uses WebSearch
- **P0**: Step 6 exists, Step 6.2 uses WebSearch from subagents
- **P0**: Step 6.1 spawns subagents that use WebSearch
- **P1**: WebSearch mentioned alongside Glob/Grep distinction

### AC2: Swarm Migration Pattern (14 tests)
- **P0**: Step 6.1 spawns 3-5 parallel subagents
- **P0**: Subagent count validation (3-5 range)
- **P0**: Parallel execution specification
- **P1**: Subagent task distribution in Step 5.2
- **P1**: Swarm Migration pattern reference
- **P1**: 10x speedup target reference

### AC3: Isolated Context Per Subagent (10 tests)
- **P0**: Isolated context structure defined
- **P0**: No shared state specification
- **P0**: Topic aspect assignment
- **P0**: Search queries per subagent
- **P1**: Research scope per subagent
- **P1**: Source categories per subagent

### AC4: Result Aggregation Step (12 tests)
- **P0**: Step 6.3 exists for result aggregation
- **P0**: Map-reduce aggregation described
- **P0**: Merging strategy for overlapping findings
- **P0**: Duplicate consolidation logic
- **P0**: Unified source list building
- **P1**: Coordinator agent role
- **P1**: Synthesis of findings

### AC5: Progress Tracking (10 tests)
- **P0**: Step 6.2 exists for subagent execution
- **P0**: Per-subagent progress reporting
- **P0**: Overall research progress indicator
- **P1**: Progress message format definition
- **P1**: User-visible progress feedback

### AC6: Error Handling (9 tests)
- **P0**: Step 5.1 has error handling for WebSearch
- **P0**: Clear error messages specification
- **P0**: Fallback guidance for no results
- **P1**: Alternative approaches on failure
- **P1**: Non-halting error handling

### AC7: Source Verification (10 tests)
- **P0**: Step 7 exists for verification
- **P0**: Cross-referencing across subagent results
- **P0**: Agreements identification
- **P0**: Conflicts identification
- **P0**: Confidence level marking
- **P0**: Source URL validation

### AC8: Performance Validation Tests (8 tests)
- **P0**: Test file exists at correct location
- **P0**: Correct filename pattern (swarm-migration.test.md)
- **P0**: Test case for parallel vs sequential timing
- **P0**: Test case for 10x speedup validation
- **P0**: Test case for result quality comparison

### Cross-cutting Tests
- Researcher agent reference validation
- Write boundaries validation

## Test Execution Results (2026-03-30)

```
FAIL ./web-research-swarm-migration.spec.ts
  Story 9-4: Web Research Integration & Swarm Migration Pattern
    AC1: WebSearch tool integration
      P0: Step 5 (Research Plan) uses WebSearch
        ✕ should have Step 5 in workflow file (1 ms)
        ✕ should reference WebSearch tool in Step 5 (1 ms)
        ✕ should identify research sources using WebSearch in Step 5.1 (1 ms)
      P0: Step 6 (Swarm Research) uses WebSearch from subagents
        ✕ should have Step 6 in workflow file (1 ms)
        ✕ should have Step 6.1 for spawning subagents (1 ms)
        ✕ should specify WebSearch usage in Step 6.2 (1 ms)
        ...
    AC2: Swarm Migration pattern implemented
      ✕ should specify 3-5 parallel subagents in Step 6.1 (1 ms)
      ✕ should validate subagent count is in 3-5 range (1 ms)
      ✕ should specify parallel execution (1 ms)
      ...
    AC8: Performance validation tests
      ✕ should have test file at correct location (1 ms)
      ✕ should be in __tests__/research/ directory (1 ms)
      ... (all 85 tests failing)
```

**TDD Red Phase: VERIFIED** - All tests fail as expected because workflow enhancements and performance test file do not exist yet

## Next Steps (TDD Green Phase)

After implementing the workflow enhancements at `scrum_workflow/workflows/research-technical.md`:

1. Enhance Step 5 with WebSearch integration:
   - Update Step 5.1 to use WebSearch for source identification
   - Add error handling for WebSearch failures
   - Add fallback guidance for no results

2. Enhance Step 6 with Swarm Migration pattern:
   - Update Step 6.1 to spawn 3-5 parallel subagents with isolated context
   - Update Step 6.2 with per-subagent WebSearch execution
   - Update Step 6.3 with detailed map-reduce aggregation logic
   - Add progress tracking at Step 6.2

3. Enhance Step 7 with source verification:
   - Add cross-referencing logic across subagent results
   - Add conflict identification
   - Add confidence level marking

4. Create performance test file:
   - Create `scrum_workflow/__tests__/research/swarm-migration.test.md`
   - Define parallel vs sequential timing test
   - Define 10x speedup validation test
   - Define result quality comparison test

5. Run tests: `npm test`
6. Verify tests PASS (green phase)
7. Commit passing tests

## Implementation Guidance

### Files to Modify
- `scrum_workflow/workflows/research-technical.md` (enhance Steps 5-7)

### Files to Create
- `scrum_workflow/__tests__/research/swarm-migration.test.md` (performance validation)

### Key Content to Add

**Step 5.1 (Identify Research Sources):**
```
Using WebSearch tool and project context:
- Identify relevant online sources for the research topic
- If `--sources` flag provided, prioritize those URLs
- Categorize sources by aspect (e.g., official docs, community resources, academic papers, case studies)
- Handle WebSearch failures with clear error messages
- Provide fallback guidance if WebSearch returns no results
```

**Step 5.2 (Create Subagent Task Distribution):**
```
Plan the distribution of research across 3-5 parallel subagents:
- Each subagent researches an independent aspect of the topic
- Define specific search queries for each subagent
- Assign source categories to subagents
- Ensure comprehensive coverage across all aspects
- Aspects: architecture patterns, frameworks, best practices, performance, security
```

**Step 6.1 (Spawn Subagents):**
```
Spawn 3-5 parallel subagents based on the research plan from Phase 2:
- Each subagent receives isolated context for its specific research aspect
- Each subagent uses WebSearch to gather information independently
- Subagents do not share state during research (isolated execution)
- Report progress as each subagent starts/completes
```

**Step 6.3 (Result Aggregation):**
```
The coordinator agent aggregates subagent results using map-reduce:
- Merge findings from all subagents
- Identify overlapping information and cross-references
- Consolidate duplicate findings
- Build unified source list from all subagents
- Identify agreements and conflicts between sources
```

## Execution Commands

```bash
# Run all ATDD tests
npm test -- web-research-swarm-migration

# Run specific test describe block
npm test -- -t "AC1: WebSearch tool integration"

# Run in verbose mode
npm test -- --verbose web-research-swarm-migration
```

## Quality Metrics

- **Total Tests**: 85
- **P0 Tests**: 52 (critical path)
- **P1 Tests**: 33 (important but not blocking)
- **P2 Tests**: 0 (nice-to-have)
- **Cross-cutting Tests**: 5
- **Estimated Effort**: 4-6 hours for workflow enhancements, 1-2 hours for performance test file

## Knowledge Fragments Applied

- `test-quality.md`: Deterministic, isolated, explicit, focused tests
- `test-levels-framework.md`: Unit-level file system and content validation
- `test-priorities-matrix.md`: P0-P3 priority assignment
- `component-tdd.md`: Red-Green-Refactor TDD cycle

## Notes for Implementation

1. **WebSearch is PRIMARY**: This story emphasizes WebSearch as the primary research tool (not Glob/Grep like other agents)

2. **Swarm Migration is key**: The 10x speedup comes from parallel subagent execution - this is the core value prop

3. **Isolation is critical**: Subagents must not share state - each has its own research scope

4. **Progress visibility**: User needs to see progress as research happens (not just at the end)

5. **Source verification**: Cross-referencing and confidence levels are part of the quality assurance

6. **Performance test**: The swarm-migration.test.md file validates the 10x speedup claim
