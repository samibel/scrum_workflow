/**
 * ATDD Tests for AC1: Delta Analysis — 9-State Lifecycle vs PRD FR-4
 *
 * TDD Phase: RED (tests will fail until implementation is verified)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 3.1 - Consolidate 9-State Lifecycle Definition
 *
 * PRD References:
 * - FR-4: 9-state story lifecycle: draft, refined, ready-for-dev, in-progress,
 *          review, approved, done, changes-needed, cancelled
 *
 * AC1: Given FR-4 specifies a 9-state lifecycle
 *      When the existing state machine implementation is compared against the current PRD
 *      Then a delta analysis documents: which states exist, which transitions are defined,
 *           and what is missing
 *      And all identified deltas are resolved
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const STORY_FILE = join(
  process.cwd(),
  '_bmad-output',
  'implementation-artifacts',
  '3-1-consolidate-9-state-lifecycle-definition.md',
);

const STANDARDS_FILE = join(process.cwd(), 'scrum_workflow', 'context', 'standards.md');
const STATE_MACHINE_DOC = join(process.cwd(), 'scrum_workflow', 'docs', '05-state-machine.md');
const STATUS_GUARD_SKILL = join(
  process.cwd(),
  'scrum_workflow',
  'skills',
  'status-guard-validation',
  'SKILL.md',
);
const PRD_FILE = join(process.cwd(), '_bmad-output', 'planning-artifacts', 'prd.md');

// ============================================================================
// AC1: Delta Analysis — Story documents current vs PRD-specified lifecycle
// ============================================================================

describe('AC1: Story file contains delta analysis', () => {
  // Test 1.1: Story implementation file exists
  test('[P0] Story 3.1 implementation file should exist', () => {
    expect(existsSync(STORY_FILE)).toBe(true);
  });

  // Test 1.2: Story documents delta analysis between current implementation and PRD
  test('[P0] Story should document delta analysis between implementation and PRD FR-4', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    // Must reference FR-4
    expect(content).toMatch(/FR-4/);
    // Must use terminology indicating a comparison/delta
    expect(content).toMatch(/delta|Delta|discrepancy|gap|Gap|missing|Missing/i);
  });

  // Test 1.3: Story documents all 9 PRD-specified states
  test('[P0] Story should document all 9 FR-4 states explicitly', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/\bdraft\b/);
    expect(content).toMatch(/\brefined\b/);
    expect(content).toMatch(/\bready-for-dev\b/);
    expect(content).toMatch(/\bin-progress\b/);
    expect(content).toMatch(/\breview\b/);
    expect(content).toMatch(/\bapproved\b/);
    expect(content).toMatch(/\bdone\b/);
    expect(content).toMatch(/\bchanges-needed\b/);
    expect(content).toMatch(/\bcancelled\b/);
  });

  // Test 1.4: Story documents the refinement state discrepancy
  test('[P0] Story should document the refinement state discrepancy vs FR-4', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    // Must document that refinement is not in FR-4's 9 states
    expect(content).toMatch(/\brefinement\b/);
    expect(content).toMatch(/discrepancy|not in FR-4|internal|ephemeral|sub-state/i);
  });

  // Test 1.5: Story documents the missing 'cancelled' transition gap
  test('[P0] Story should document the missing any→cancelled transition gap', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/cancelled/);
    expect(content).toMatch(/any.*cancelled|any→cancelled|missing.*cancelled|cancelled.*missing/i);
  });

  // Test 1.6: Story documents resolutions for all identified deltas
  test('[P0] Story should document resolutions for all identified deltas', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/resolv|Resolv|resolution|Resolution/i);
    // Must reference standards.md as the resolution location
    expect(content).toMatch(/standards\.md/);
  });

  // Test 1.7: All story tasks are marked completed
  test('[P0] All story tasks should be completed (no unchecked boxes)', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    const uncheckedBoxes = (content.match(/- \[ \]/g) || []).length;
    expect(uncheckedBoxes).toBe(0);
  });
});

// ============================================================================
// AC1: standards.md contains the delta analysis as authoritative source
// ============================================================================

describe('AC1: standards.md — Story Status State Machine section contains all deltas resolved', () => {
  // Test 1.8: standards.md exists
  test('[P0] standards.md should exist', () => {
    expect(existsSync(STANDARDS_FILE)).toBe(true);
  });

  // Test 1.9: standards.md contains a Story Status State Machine section
  test('[P0] standards.md should contain Story Status State Machine section', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/Story Status State Machine/i);
  });

  // Test 1.10: standards.md lists all 9 FR-4 states in the state machine section
  test('[P0] standards.md State Machine section should list all 9 FR-4 states', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/\bdraft\b/);
    expect(content).toMatch(/\brefined\b/);
    expect(content).toMatch(/\bready-for-dev\b/);
    expect(content).toMatch(/\bin-progress\b/);
    expect(content).toMatch(/\breview\b/);
    expect(content).toMatch(/\bapproved\b/);
    expect(content).toMatch(/\bdone\b/);
    expect(content).toMatch(/\bchanges-needed\b/);
    expect(content).toMatch(/\bcancelled\b/);
  });

  // Test 1.11: standards.md documents the refinement state with its FR-4 deviation note
  test('[P1] standards.md should document refinement state with FR-4 deviation note', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/\brefinement\b/);
    // Must clarify status of refinement vs FR-4
    expect(content).toMatch(/internal|ephemeral|sub-state|sub-phase|implementation.*internal/i);
  });

  // Test 1.12: standards.md valid transitions table includes any→cancelled
  test('[P0] standards.md Valid Transitions table should include any→cancelled transition', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    // Must have 'cancelled' in the transitions table
    expect(content).toMatch(/cancelled/);
    // Must have 'any' as a from-state or explicitly enumerate any→cancelled
    expect(content).toMatch(/any.*cancelled|any →.*cancelled|`any`.*`cancelled`/i);
  });
});

// ============================================================================
// AC1: 05-state-machine.md reflects resolved delta
// ============================================================================

describe('AC1: 05-state-machine.md — contains resolved any→cancelled transition', () => {
  // Test 1.13: 05-state-machine.md exists
  test('[P0] docs/05-state-machine.md should exist', () => {
    expect(existsSync(STATE_MACHINE_DOC)).toBe(true);
  });

  // Test 1.14: 05-state-machine.md includes 'cancelled' state
  test('[P0] docs/05-state-machine.md should include cancelled state', () => {
    const content = readFileSync(STATE_MACHINE_DOC, 'utf8');
    expect(content).toMatch(/\bcancelled\b/);
  });

  // Test 1.15: 05-state-machine.md includes any→cancelled transition
  test('[P0] docs/05-state-machine.md should include any→cancelled transition', () => {
    const content = readFileSync(STATE_MACHINE_DOC, 'utf8');
    expect(content).toMatch(/any.*cancelled|any →.*cancelled|any `cancelled`/i);
  });
});

// ============================================================================
// AC1: status-guard-validation SKILL.md reflects resolved delta
// ============================================================================

describe('AC1: status-guard-validation/SKILL.md — contains resolved delta', () => {
  // Test 1.16: SKILL.md exists
  test('[P0] status-guard-validation/SKILL.md should exist', () => {
    expect(existsSync(STATUS_GUARD_SKILL)).toBe(true);
  });

  // Test 1.17: SKILL.md valid status values list includes cancelled
  test('[P0] SKILL.md valid status values should include cancelled', () => {
    const content = readFileSync(STATUS_GUARD_SKILL, 'utf8');
    expect(content).toMatch(/\bcancelled\b/);
  });

  // Test 1.18: SKILL.md valid transitions includes any→cancelled
  test('[P0] SKILL.md valid transitions should include any→cancelled', () => {
    const content = readFileSync(STATUS_GUARD_SKILL, 'utf8');
    expect(content).toMatch(/any.*cancelled|any →.*cancelled|`any`.*`cancelled`/i);
  });
});
