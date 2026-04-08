/**
 * ATDD Tests for AC2: Manual Status Edit Detection (FR-10)
 *
 * TDD Phase: RED (tests will fail until implementation is complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 3.2 - Implement Status Guard Validation (FR-8, FR-10, FR-11)
 *
 * PRD References:
 * - FR-10: Detection of manual status field edits (guard must compare status field against status_history)
 *
 * AC2: Given FR-10 specifies detection of manual status field edits
 *      When a guard validates a story's status
 *      Then it compares the `status` field against the last `status_history` entry
 *      And if a discrepancy is detected, a warning is surfaced indicating the status was manually edited
 *      And entries with `trigger: manual-edit` are visible to all agents and commands that read the story
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

// ============================================================================
// AC2: SKILL.md documents manual edit detection algorithm
// ============================================================================

describe('AC2: SKILL.md — Manual Edit Detection algorithm documented', () => {
  // Test 2.1: SKILL.md exists
  test.skip('[P0] status-guard-validation/SKILL.md should exist', () => {
    expect(existsSync(SKILL_FILE)).toBe(true);
  });

  // Test 2.2: SKILL.md contains a Manual Edit Detection section
  test.skip('[P0] SKILL.md should contain a "Manual Edit Detection" section', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    expect(content).toMatch(/Manual Edit Detection/i);
  });

  // Test 2.3: SKILL.md documents comparison of status field vs status_history
  test.skip('[P0] SKILL.md should document comparing status field against last status_history entry', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must describe algorithm: compare status field vs status_history last entry
    expect(content).toMatch(/status_history/);
    expect(content).toMatch(/status.*field|field.*status/i);
    // Must indicate comparison / discrepancy detection
    expect(content).toMatch(/compar|discrepancy|mismatch|detect/i);
  });

  // Test 2.4: SKILL.md documents the warning format for manual edits
  test.skip('[P0] SKILL.md should document ⚠️ Manual Edit Detected: warning format', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must include the exact warning prefix
    expect(content).toMatch(/⚠️ Manual Edit Detected:/);
  });

  // Test 2.5: SKILL.md documents that warning surfaces status field mismatch message
  test.skip('[P0] SKILL.md warning should indicate status field vs last status_history mismatch', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const manualEditSection = content.match(/Manual Edit Detection[\s\S]*?(?=\n## |\n# |$)/i);
    expect(manualEditSection).not.toBeNull();
    // The warning message must reference both the current status field and last status_history entry
    expect(manualEditSection![0]).toMatch(/status.*field|status field/i);
    expect(manualEditSection![0]).toMatch(/status_history/);
  });

  // Test 2.6: SKILL.md documents that guard still uses status field value (user intent)
  test.skip('[P0] SKILL.md should state guard evaluates current status field, not history value', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const manualEditSection = content.match(/Manual Edit Detection[\s\S]*?(?=\n## |\n# |$)/i);
    expect(manualEditSection).not.toBeNull();
    // Must state that status field takes precedence for guard evaluation
    expect(manualEditSection![0]).toMatch(
      /status.field.*takes precedence|proceed.*current.*status|use.*status.field|status.field.*evaluation|user.*intent|intentional/i,
    );
  });

  // Test 2.7: SKILL.md documents edge case: empty status_history → skip detection
  test.skip('[P1] SKILL.md should document edge case: empty status_history skips detection', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    expect(content).toMatch(/empty|status_history.*empty|no.*history|skip.*detection/i);
  });

  // Test 2.8: SKILL.md documents edge case: malformed status_history → skip detection
  test.skip('[P1] SKILL.md should document edge case: malformed status_history skips detection', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    expect(content).toMatch(/malform|invalid.*history|unable.*compar|skip.*detection/i);
  });

  // Test 2.9: SKILL.md documents that warning is non-blocking (informational only)
  test.skip('[P0] SKILL.md should state the manual edit warning is non-blocking', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const manualEditSection = content.match(/Manual Edit Detection[\s\S]*?(?=\n## |\n# |$)/i);
    expect(manualEditSection).not.toBeNull();
    // Warning must not block command execution
    expect(manualEditSection![0]).toMatch(
      /non.blocking|not.*block|informational|warning.*only|does.*not.*block/i,
    );
  });

  // Test 2.10: SKILL.md documents trigger: manual-edit visibility
  test.skip('[P1] SKILL.md should document that trigger: manual-edit entries are visible to all agents', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must mention trigger: manual-edit
    expect(content).toMatch(/trigger.*manual-edit|manual-edit.*trigger/i);
    // Must mention visibility to agents
    expect(content).toMatch(/visible|agents.*read|commands.*read/i);
  });
});

// ============================================================================
// AC2: SKILL.md output format includes manual_edit_detected field
// ============================================================================

describe('AC2: SKILL.md — Output format includes manual_edit_detected and warning fields', () => {
  // Test 2.11: SKILL.md output format includes manual_edit_detected field
  test.skip('[P0] SKILL.md Output Format should include manual_edit_detected field', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    expect(content).toMatch(/manual_edit_detected/);
  });

  // Test 2.12: SKILL.md output format includes warning field
  test.skip('[P0] SKILL.md Output Format should include warning field', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must have a warning field in the output format
    const outputSection = content.match(/Output Format[\s\S]*?(?=\n## |\n# |$)/i);
    expect(outputSection).not.toBeNull();
    expect(outputSection![0]).toMatch(/warning:/);
  });

  // Test 2.13: SKILL.md output format shows manual_edit_detected: false default
  test.skip('[P1] SKILL.md Output Format should show manual_edit_detected: false as default', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    expect(content).toMatch(/manual_edit_detected:\s*false/);
  });

  // Test 2.14: SKILL.md output format shows warning: null default
  test.skip('[P1] SKILL.md Output Format should show warning: null as default', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    expect(content).toMatch(/warning:\s*null/);
  });

  // Test 2.15: SKILL.md output format retains all original 4 fields
  test.skip('[P0] SKILL.md Output Format should retain valid, current_status, required_status, can_proceed', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const outputSection = content.match(/Output Format[\s\S]*?(?=\n## |\n# |$)/i);
    expect(outputSection).not.toBeNull();
    expect(outputSection![0]).toMatch(/valid:/);
    expect(outputSection![0]).toMatch(/current_status:/);
    expect(outputSection![0]).toMatch(/required_status:/);
    expect(outputSection![0]).toMatch(/can_proceed:/);
  });
});
