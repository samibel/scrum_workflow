/**
 * ATDD Tests for AC4: Authoritative Transitions from standards.md
 *
 * TDD Phase: RED (tests will fail until implementation is complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 3.2 - Implement Status Guard Validation (FR-8, FR-10, FR-11)
 *
 * PRD References:
 * - FR-8: Block invalid state transitions (guard must use authoritative transitions list)
 *
 * AC4: Given the 9-state lifecycle from Story 3.1
 *      When the guard validates a transition
 *      Then it checks the requested transition against the authoritative valid transitions list
 *           in `scrum_workflow/context/standards.md`
 *      And only transitions explicitly defined as valid are permitted
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SKILL_FILE = join(
  process.cwd(),
  'scrum_workflow',
  'skills',
  'status-guard-validation',
  'SKILL.md',
);

const STANDARDS_FILE = join(process.cwd(), 'scrum_workflow', 'context', 'standards.md');

// ============================================================================
// AC4: SKILL.md references standards.md as authoritative source for transitions
// ============================================================================

describe('AC4: SKILL.md — References standards.md as authoritative transitions source', () => {
  // Test 4.1: SKILL.md exists
  test('[P0] status-guard-validation/SKILL.md should exist', () => {
    expect(existsSync(SKILL_FILE)).toBe(true);
  });

  // Test 4.2: standards.md exists (authoritative source must be present)
  test('[P0] scrum_workflow/context/standards.md should exist', () => {
    expect(existsSync(STANDARDS_FILE)).toBe(true);
  });

  // Test 4.3: SKILL.md explicitly references standards.md as the authoritative source
  test('[P0] SKILL.md should explicitly reference standards.md as the authoritative transitions source', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must reference standards.md by name
    expect(content).toMatch(/standards\.md/);
    // Must indicate it is the authoritative source
    expect(content).toMatch(/authoritative|source of truth/i);
  });

  // Test 4.4: SKILL.md does NOT re-define transitions independently (must reference, not duplicate)
  test('[P0] SKILL.md should reference standards.md for transitions, not re-define them independently', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must have explicit reference to standards.md in context of transitions
    expect(content).toMatch(/standards\.md.*transitions|transitions.*standards\.md/i);
    // The transitions list should reference the file, not be a standalone inline duplicate
    // (i.e., the Valid Transitions section should reference standards.md)
    const transitionsSection = content.match(/Valid transitions[\s\S]*?(?=\n## |\n# |$)/i);
    if (transitionsSection) {
      expect(transitionsSection![0]).toMatch(/standards\.md/);
    }
  });

  // Test 4.5: SKILL.md states only explicitly defined transitions are permitted
  test('[P0] SKILL.md should state only explicitly defined transitions are permitted', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must have language about only defined/valid transitions being allowed
    expect(content).toMatch(
      /only.*defined.*valid|explicitly defined|not.*listed.*invalid|transitions.*not.*listed/i,
    );
  });

  // Test 4.6: SKILL.md lists all 9 lifecycle states (from Story 3.1)
  test('[P0] SKILL.md valid status values should include all 9 states', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
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

  // Test 4.7: SKILL.md includes any→cancelled transition (cross-check with Story 3.1)
  test('[P0] SKILL.md should include any→cancelled transition', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    expect(content).toMatch(/any.*cancelled|any →.*cancelled|`any`.*`cancelled`/i);
  });

  // Test 4.8: SKILL.md documents that invalid transitions (not in list) are blocked
  test('[P0] SKILL.md should state that transitions not in the list are blocked', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    expect(content).toMatch(/invalid.*transition|blocked|not.*listed.*above|not.*in.*list/i);
  });

  // Test 4.9: SKILL.md includes refinement as implementation-internal sub-state
  test('[P1] SKILL.md should document refinement as implementation-internal sub-state', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // refinement is a valid status value for validation purposes (implementation-internal)
    expect(content).toMatch(/\brefinement\b/);
    expect(content).toMatch(/internal|sub-state|sub-phase|implementation.*internal/i);
  });

  // Test 4.10: SKILL.md states guard checks requested transition against standards.md list
  test('[P0] SKILL.md should state the guard checks requested transitions against standards.md', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must explicitly say the guard checks/validates against standards.md
    expect(content).toMatch(/checks.*standards\.md|validates.*standards\.md|enforces.*standards\.md/i);
  });
});

// ============================================================================
// AC4: standards.md contains the authoritative transitions list
// ============================================================================

describe('AC4: standards.md — Contains the authoritative valid transitions list', () => {
  // Test 4.11: standards.md contains Story Status State Machine section
  test('[P0] standards.md should contain Story Status State Machine section', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/Story Status State Machine/i);
  });

  // Test 4.12: standards.md contains Valid Transitions table
  test('[P0] standards.md should contain a Valid Transitions table or section', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/Valid Transitions|valid transitions/i);
  });

  // Test 4.13: standards.md valid transitions include all 9 states
  test('[P0] standards.md Valid Transitions should cover all 9 lifecycle states', () => {
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

  // Test 4.14: standards.md includes any→cancelled transition
  test('[P0] standards.md Valid Transitions should include any→cancelled', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/any.*cancelled|any →.*cancelled|`any`.*`cancelled`/i);
  });
});
