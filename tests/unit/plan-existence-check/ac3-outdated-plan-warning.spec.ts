/**
 * ATDD Tests for AC3: Outdated Plan Warning After changes-needed Cycle
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 4.2 - Implement Plan Existence Check Before Dev
 *
 * PRD References:
 * - FR-20: plan.md existence check
 *
 * AC3: Given plan.md exists but the story has been through a changes-needed cycle
 *      since the plan was generated
 *      When the existence check runs
 *      Then the system warns the developer that the plan may be outdated
 *      And suggests re-running /scrum-refine-story to regenerate the plan
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const DEV_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'dev-story.md');
const DEV_STORY_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'dev-story.md');

// ============================================================================
// AC3: Outdated Plan Detection
// ============================================================================

describe('AC3: Outdated Plan Detection', () => {
  // Test 3.1: dev-story.md should detect changes-needed cycle
  test('[P0] dev-story.md should detect if story went through changes-needed cycle', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Should mention changes-needed cycle detection
    expect(content).toMatch(/changes-needed.*cycle|cycle.*changes-needed/i);
  });

  // Test 3.2: Should check if plan was generated before changes-needed transition
  test('[P0] dev-story.md should check if plan was generated before changes-needed', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Should compare plan timestamp with changes-needed transition
    expect(content).toMatch(/plan.*changes-needed|changes-needed.*plan/i);
  });

  // Test 3.3: Should warn about potentially outdated plan
  test('[P0] dev-story.md should warn about potentially outdated plan', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Warning language
    expect(content).toMatch(/warn|outdated|stale|may be outdated/i);
  });
});

// ============================================================================
// AC3: Warning Message Format
// ============================================================================

describe('AC3: Warning Message Format', () => {
  // Test 3.4: Warning should suggest re-running /scrum-refine-story
  test('[P0] Warning should suggest re-running /scrum-refine-story', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // The remediation suggestion
    expect(content).toMatch(/\/scrum-refine-story.*regenerate|regenerate.*\/scrum-refine-story/i);
  });

  // Test 3.5: Warning should use ⚠ prefix (standard warning format)
  test('[P1] Warning should use ⚠ prefix', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Standard warning format uses ⚠
    expect(content).toMatch(/⚠/);
  });

  // Test 3.6: Warning should mention review findings
  test('[P1] Warning should mention that review findings may have changed scope', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Context for why plan might be outdated
    expect(content).toMatch(/review.*findings|findings.*review/i);
  });
});

// ============================================================================
// AC3: Behavior After Warning
// ============================================================================

describe('AC3: Behavior After Warning', () => {
  // Test 3.7: After warning, command should still proceed (not block)
  test('[P1] After warning, command should still proceed (not hard block)', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Warning is advisory, not a hard block
    // Should have "warn but continue" or similar pattern
    expect(content).toMatch(/warn.*proceed|proceed.*warn/i);
  });

  // Test 3.8: Warning should be distinguishable from error
  test('[P1] Warning should be distinguishable from error (not ❌)', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Warning uses ⚠ not ❌
    const errorMatches = content.match(/❌.*Prerequisite Missing.*plan\.md.*not found/gi);
    // The plan outdated warning should NOT use the error pattern
    if (errorMatches) {
      // Make sure there's a separate warning pattern
      expect(content).toMatch(/⚠.*plan.*outdated|outdated.*plan/i);
    } else {
      // Just check warning exists
      expect(content).toMatch(/⚠/);
    }
  });
});
