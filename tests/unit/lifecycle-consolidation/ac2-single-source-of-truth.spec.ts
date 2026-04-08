/**
 * ATDD Tests for AC2: Single Authoritative Lifecycle Definition in standards.md
 *
 * TDD Phase: RED (tests will fail until implementation is complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 3.1 - Consolidate 9-State Lifecycle Definition
 *
 * PRD References:
 * - FR-4: 9-state story lifecycle: draft, refined, ready-for-dev, in-progress,
 *          review, approved, done, changes-needed, cancelled
 *
 * AC2: Given Epic 2 introduced new transitions (review→changes-needed,
 *           changes-needed→in-progress, approved→done via /scrum-approve)
 *      When the lifecycle definition is consolidated
 *      Then all 9 states are defined in a single, authoritative location
 *      And all valid transitions are explicitly enumerated
 *      And invalid transitions are implicitly defined (anything not listed is invalid)
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const STANDARDS_FILE = join(process.cwd(), 'scrum_workflow', 'context', 'standards.md');
const STATE_MACHINE_DOC = join(process.cwd(), 'scrum_workflow', 'docs', '05-state-machine.md');
const STATUS_GUARD_SKILL = join(
  process.cwd(),
  'scrum_workflow',
  'skills',
  'status-guard-validation',
  'SKILL.md',
);

// ============================================================================
// AC2: All 9 states defined in standards.md as single authoritative location
// ============================================================================

describe('AC2: standards.md — all 9 states defined in single authoritative section', () => {
  // Test 2.1: standards.md Story Status State Machine table contains exactly 9+ rows
  // (9 from FR-4, plus refinement noted separately = minimum 9)
  test('[P0] standards.md State Machine table should contain at least 9 state rows', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    // Extract the state machine section
    expect(content).toMatch(/Story Status State Machine/i);
    // Count state rows in the table — each row should have at least one state value
    const stateValues = [
      'draft',
      'refined',
      'ready-for-dev',
      'in-progress',
      'review',
      'approved',
      'done',
      'changes-needed',
      'cancelled',
    ];
    for (const state of stateValues) {
      expect(content).toMatch(new RegExp(`\`${state}\``));
    }
  });

  // Test 2.2: standards.md is marked as the authoritative source of truth
  test('[P0] standards.md should be marked as AUTHORITATIVE SOURCE', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/authoritative|AUTHORITATIVE|single source of truth|single.*source.*truth/i);
  });

  // Test 2.3: standards.md explicitly enumerates all required transitions including Epic 2 additions
  test('[P0] standards.md should explicitly enumerate review→changes-needed transition', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/review.*changes-needed|`review`.*`changes-needed`/i);
  });

  test('[P0] standards.md should explicitly enumerate changes-needed→in-progress transition', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/changes-needed.*in-progress|`changes-needed`.*`in-progress`/i);
  });

  test('[P0] standards.md should explicitly enumerate approved→done transition', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/approved.*done|`approved`.*`done`/i);
  });

  test('[P0] standards.md should explicitly enumerate any→cancelled transition', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    expect(content).toMatch(/any.*cancelled|`any`.*`cancelled`/i);
  });

  // Test 2.4: standards.md Valid Transitions table has all 11 transitions (including all enumerated in story)
  test('[P0] standards.md Valid Transitions table should enumerate all required transitions', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    // All state-to-state transitions from the authoritative list
    const requiredTransitions: Array<[string, string]> = [
      ['draft', 'refinement'],
      ['refinement', 'refined'],
      ['refined', 'ready-for-dev'],
      ['ready-for-dev', 'in-progress'],
      ['in-progress', 'review'],
      ['review', 'approved'],
      ['review', 'changes-needed'],
      ['changes-needed', 'in-progress'],
      ['approved', 'done'],
    ];
    for (const [from, to] of requiredTransitions) {
      expect(content).toMatch(new RegExp(`${from}.*${to}`, 'i'));
    }
    // any→cancelled must also be present
    expect(content).toMatch(/any.*cancelled/i);
  });

  // Test 2.5: standards.md cancelled state is listed in the Status Values table
  test('[P0] standards.md should list cancelled in Status Values table with description', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    // cancelled must be in a table row
    expect(content).toMatch(/\| *`cancelled` *\|/);
    // Must have a description of the cancelled state
    expect(content).toMatch(/cancelled.*terminal|cancelled.*Story cancelled|Terminal.*cancelled/i);
  });

  // Test 2.6: standards.md valid status values includes 'cancelled'
  test('[P0] standards.md should include cancelled as a valid status value', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    const statusValuesSection = content.match(/### Status Values([\s\S]*?)###/i);
    if (statusValuesSection) {
      expect(statusValuesSection[1]).toMatch(/cancelled/);
    } else {
      // If section header is slightly different, check full file
      expect(content).toMatch(/`cancelled`.*Story cancelled|`cancelled`.*terminal/i);
    }
  });

  // Test 2.7: standards.md Story Status State Machine has a guard enforcement note
  test('[P1] standards.md should have guard enforcement rules for invalid transitions', () => {
    const content = readFileSync(STANDARDS_FILE, 'utf8');
    // Must state that anything not listed is invalid
    expect(content).toMatch(/invalid.*transition|Guard.*Enforcement|guard.*condition/i);
  });
});

// ============================================================================
// AC2: 05-state-machine.md reflects all Epic 2 transitions
// ============================================================================

describe('AC2: 05-state-machine.md — all Epic 2 transitions present', () => {
  // Test 2.8: 05-state-machine.md includes changes-needed→in-progress in guard conditions table
  test('[P0] docs/05-state-machine.md Guard Conditions table should include changes-needed', () => {
    const content = readFileSync(STATE_MACHINE_DOC, 'utf8');
    expect(content).toMatch(/changes-needed.*in-progress|in-progress.*changes-needed/i);
  });

  // Test 2.9: 05-state-machine.md includes review→changes-needed transition
  test('[P0] docs/05-state-machine.md should include review→changes-needed transition', () => {
    const content = readFileSync(STATE_MACHINE_DOC, 'utf8');
    expect(content).toMatch(/review.*changes-needed/i);
  });

  // Test 2.10: 05-state-machine.md Status Values table contains 'cancelled'
  test('[P0] docs/05-state-machine.md Status Values table should contain cancelled', () => {
    const content = readFileSync(STATE_MACHINE_DOC, 'utf8');
    expect(content).toMatch(/cancelled/);
  });
});

// ============================================================================
// AC2: status-guard-validation SKILL.md includes all Epic 2 transitions
// ============================================================================

describe('AC2: status-guard-validation/SKILL.md — all Epic 2 transitions present', () => {
  // Test 2.11: SKILL.md valid transitions list includes changes-needed→in-progress
  test('[P0] SKILL.md valid transitions should include changes-needed→in-progress', () => {
    const content = readFileSync(STATUS_GUARD_SKILL, 'utf8');
    expect(content).toMatch(/changes-needed.*in-progress|`changes-needed`.*`in-progress`/i);
  });

  // Test 2.12: SKILL.md valid transitions list includes review→changes-needed
  test('[P0] SKILL.md valid transitions should include review→changes-needed', () => {
    const content = readFileSync(STATUS_GUARD_SKILL, 'utf8');
    expect(content).toMatch(/review.*changes-needed|`review`.*`changes-needed`/i);
  });

  // Test 2.13: SKILL.md valid status values includes 'cancelled'
  test('[P0] SKILL.md valid status values list should include cancelled', () => {
    const content = readFileSync(STATUS_GUARD_SKILL, 'utf8');
    // Must appear in the valid status values section
    expect(content).toMatch(/\bcancelled\b/);
    expect(content).toMatch(/valid status values|Valid Status|Status Value/i);
  });
});
