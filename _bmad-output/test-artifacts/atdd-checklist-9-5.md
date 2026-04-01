# ATDD Checklist for Story 9-5: Reflection Loop for Quality Assurance

**Story:** 9-5 - Reflection Loop for Quality Assurance
**Status:** backlog
**Date:** 2026-03-30
**Test Type:** Acceptance Test-Driven Development (ATDD)

---

## Story Summary

**As a developer,**
**I want the researcher agent to apply the Reflection Loop pattern for self-critique and iterative improvement,**
**So that research output quality is high and consistent.**

---

## Acceptance Criteria Breakdown

### AC1: Reflection Step After Initial Research Synthesis

**Given** the web research integration from Story 9.4 exists
**When** the Reflection Loop is implemented
**Then** the workflow includes a reflection step after initial research synthesis

| Test ID | Test Scenario | Priority | Status |
|---------|---------------|----------|--------|
| AC1-001 | Workflow file contains Phase 5 - Reflection Loop step definition | P0 | PENDING |
| AC1-002 | Reflection step is positioned after Phase 4 (Verification) | P0 | PENDING |
| AC1-003 | Reflection step is positioned before Phase 6 (Synthesis) | P0 | PENDING |
| AC1-004 | Researcher agent definition references reflection methodology | P1 | PENDING |
| AC1-005 | Workflow progress tracker shows Phase 5 status | P1 | PENDING |

### AC2: Reflection Performs Five Quality Checks

**When** the reflection step runs
**Then** it performs: content completeness check, citation validation, structure consistency, clarity assessment, gap identification

| Test ID | Test Scenario | Priority | Status |
|---------|---------------|----------|--------|
| AC2-001 | Completeness check evaluates all research aspects covered | P0 | PENDING |
| AC2-002 | Citation validation verifies all claims have source references | P0 | PENDING |
| AC2-003 | Structure consistency validates output format compliance | P0 | PENDING |
| AC2-004 | Clarity assessment evaluates writing quality and actionability | P1 | PENDING |
| AC2-005 | Gap identification detects missing research areas | P0 | PENDING |
| AC2-006 | All five checks are documented in workflow step | P0 | PENDING |
| AC2-007 | Each check produces a pass/fail/score result | P1 | PENDING |

### AC3: Self-Critique Against Quality Criteria

**When** reflection runs
**Then** the agent critiques its own output against quality criteria from the research patterns document

| Test ID | Test Scenario | Priority | Status |
|---------|---------------|----------|--------|
| AC3-001 | Quality criteria loaded from research patterns document | P0 | PENDING |
| AC3-002 | Critique evaluates confidence level assignment accuracy | P0 | PENDING |
| AC3-003 | Critique checks for high/medium/low confidence justification | P1 | PENDING |
| AC3-004 | Critique validates source diversity across categories | P1 | PENDING |
| AC3-005 | Quality criteria reference document exists and is accessible | P0 | PENDING |

### AC4: Targeted Improvement When Quality Threshold Not Met

**If** quality threshold is not met
**Then** the agent performs targeted improvement: research missing information, refine unclear sections, strengthen weak claims, add more sources

| Test ID | Test Scenario | Priority | Status |
|---------|---------------|----------|--------|
| AC4-001 | Missing information triggers targeted WebSearch | P0 | PENDING |
| AC4-002 | Unclear sections flagged for refinement | P1 | PENDING |
| AC4-003 | Weak claims identified and strengthened | P1 | PENDING |
| AC4-004 | Additional sources added for low-confidence claims | P0 | PENDING |
| AC4-005 | Improvement actions are documented | P1 | PENDING |
| AC4-006 | Improvement targets specific gaps, not full re-research | P1 | PENDING |

### AC5: Maximum 2 Iterations to Prevent Infinite Loops

**When** the reflection loop runs
**Then** it runs up to 2 iterations to avoid infinite loops

| Test ID | Test Scenario | Priority | Status |
|---------|---------------|----------|--------|
| AC5-001 | Loop counter tracks current iteration | P0 | PENDING |
| AC5-002 | Loop terminates after 2 iterations maximum | P0 | PENDING |
| AC5-003 | Early exit when quality threshold met | P0 | PENDING |
| AC5-004 | Iteration limit documented in workflow | P1 | PENDING |
| AC5-005 | No infinite loop possible under any condition | P0 | PENDING |

### AC6: research_confidence Field in Frontmatter

**When** final output is generated
**Then** the output includes a `research_confidence` field in frontmatter (high/medium/low) based on reflection results

| Test ID | Test Scenario | Priority | Status |
|---------|---------------|----------|--------|
| AC6-001 | Frontmatter includes research_confidence field | P0 | PENDING |
| AC6-002 | Confidence value is one of: high, medium, low | P0 | PENDING |
| AC6-003 | High confidence when all quality checks pass | P0 | PENDING |
| AC6-004 | Medium confidence when some checks fail but recoverable | P1 | PENDING |
| AC6-005 | Low confidence when significant gaps remain | P0 | PENDING |
| AC6-006 | Template file updated to include research_confidence | P0 | PENDING |

### AC7: Low Confidence Output Includes Reasons and Suggestions

**If** confidence is low
**Then** the agent provides specific reasons and suggests areas for further research

| Test ID | Test Scenario | Priority | Status |
|---------|---------------|----------|--------|
| AC7-001 | Low confidence output includes specific reason list | P0 | PENDING |
| AC7-002 | Low confidence output includes suggested research areas | P0 | PENDING |
| AC7-003 | Reasons are actionable and specific (not generic) | P1 | PENDING |
| AC7-004 | Suggestions reference specific gaps identified | P1 | PENDING |
| AC7-005 | Low confidence section formatted in output document | P1 | PENDING |

---

## Test Coverage Summary

| Acceptance Criteria | Test Count | P0 Tests | P1 Tests | P2 Tests | P3 Tests |
|---------------------|------------|----------|----------|----------|----------|
| AC1: Reflection Step | 5 | 3 | 2 | 0 | 0 |
| AC2: Five Quality Checks | 7 | 4 | 3 | 0 | 0 |
| AC3: Self-Critique | 5 | 3 | 2 | 0 | 0 |
| AC4: Targeted Improvement | 6 | 2 | 4 | 0 | 0 |
| AC5: Max 2 Iterations | 5 | 4 | 1 | 0 | 0 |
| AC6: research_confidence Field | 6 | 4 | 2 | 0 | 0 |
| AC7: Low Confidence Output | 5 | 2 | 3 | 0 | 0 |
| **TOTAL** | **39** | **22** | **17** | **0** | **0** |

---

## Knowledge Fragments Applied

- **test-quality.md**: Deterministic, isolated, explicit, focused tests under 300 lines each
- **test-priorities-matrix.md**: P0/P1 priority assignment based on risk
- **probability-impact.md**: Risk scoring for gap prioritization
- **risk-governance.md**: Gate decision criteria

---

## Implementation Checklist

### Phase 1: Workflow Enhancement
- [ ] Add detailed Step 8 (Phase 5 - Reflection Loop) to research-technical.md
- [ ] Define five quality check criteria explicitly
- [ ] Define iteration limit (max 2) and early exit conditions
- [ ] Define targeted improvement actions

### Phase 2: Template Update
- [ ] Update technical-research.md template with research_confidence field
- [ ] Add low confidence reasons section to template
- [ ] Add suggested research areas section to template

### Phase 3: Researcher Agent Update
- [ ] Add reflection methodology to researcher.md agent definition
- [ ] Define quality criteria reference
- [ ] Define self-critique process

### Phase 4: Test Implementation
- [ ] Create reflection-loop-quality-assurance.spec.ts
- [ ] Implement all 39 test scenarios
- [ ] Run tests in RED phase (expect failures)
- [ ] Implement reflection loop logic
- [ ] Run tests in GREEN phase (expect passes)

---

## Dependencies

- **Story 9-4**: Web Research Integration & Swarm Migration Pattern (must be complete)
- **Research Patterns Document**: `docs/research/technical-research-agent-patterns-2026-03-30.md`

---

## Quality Gate Criteria

For Story 9-5 to pass quality gate:

- [ ] All P0 tests passing (22 tests)
- [ ] All P1 tests passing (17 tests)
- [ ] Workflow file updated with Phase 5 reflection step
- [ ] Template file includes research_confidence field
- [ ] Researcher agent references reflection methodology
- [ ] No infinite loop possible in reflection iteration

**Gate Decision:** PENDING (tests not yet implemented)
