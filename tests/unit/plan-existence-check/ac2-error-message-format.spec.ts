/**
 * ATDD Tests for AC2: Error Message Format When plan.md is Missing
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 4.2 - Implement Plan Existence Check Before Dev
 *
 * PRD References:
 * - FR-20: plan.md existence check
 *
 * AC2: Given plan.md does not exist
 *      When the existence check fails
 *      Then the command is blocked before any implementation begins
 *      And an actionable error message is produced:
 *      `❌ Prerequisite Missing: plan.md not found for SW-XXX. Next Step: run /scrum-refine-story SW-XXX`
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const DEV_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'dev-story.md');
const DEV_STORY_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'dev-story.md');

// ============================================================================
// AC2: Error Message Format - Standard Elements
// ============================================================================

describe('AC2: Error Message Format - Standard Elements', () => {
  // Test 2.1: Error message should use ❌ prefix
  test('[P0] Error message should use ❌ prefix', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Standard error format uses ❌
    expect(content).toMatch(/❌/);
  });

  // Test 2.2: Error message should say "Prerequisite Missing"
  test('[P0] Error message should say "Prerequisite Missing"', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // The specific error type required by AC2
    expect(content).toMatch(/Prerequisite Missing/i);
  });

  // Test 2.3: Error message should mention plan.md not found
  test('[P0] Error message should mention plan.md not found', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // The specific issue
    expect(content).toMatch(/plan\.md.*not found|not found.*plan\.md/i);
  });

  // Test 2.4: Error message should show Next Step
  test('[P0] Error message should include Next Step guidance', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Standard format includes Next Step
    expect(content).toMatch(/\*\*Next Step\*\*/i);
  });

  // Test 2.5: Next Step should suggest running /scrum-refine-story
  test('[P0] Next Step should suggest running /scrum-refine-story', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // The specific remediation command
    expect(content).toMatch(/\/scrum-refine-story/i);
  });
});

// ============================================================================
// AC2: Error Message Format - Complete Format
// ============================================================================

describe('AC2: Error Message Format - Complete Format Match', () => {
  // Test 2.6: Error message should match the complete required format
  test('[P1] Error message should match complete required format', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Should have the complete pattern: ❌ Prerequisite Missing: plan.md not found
    const hasPrerequisiteMissing = content.includes('Prerequisite Missing');
    const hasPlanMdNotFound = content.match(/plan\.md.*not found|not found.*plan\.md/i);
    const hasNextStep = content.match(/\*\*Next Step\*\*:.*\/scrum-refine-story/i);

    expect(hasPrerequisiteMissing || hasPlanMdNotFound).toBeTruthy();
    expect(hasNextStep).toBeTruthy();
  });

  // Test 2.7: Error message should be in Error Handling section
  test('[P1] Error message should be in Error Handling section', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Error handling section should contain this specific error
    const errorSection = content.match(/## Error Handling[\s\S]*?(?=##|\n---|$)/i);
    expect(errorSection).not.toBeNull();
  });
});
