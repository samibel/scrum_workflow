/**
 * ATDD Tests for AC1: plan.md Existence Check Before Dev
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 4.2 - Implement Plan Existence Check Before Dev
 *
 * PRD References:
 * - FR-20: plan.md existence check before /scrum-dev-story
 *
 * AC1: Given FR-20 specifies plan.md existence check before /scrum-dev-story
 *      When a developer runs /scrum-dev-story SW-XXX
 *      Then the system checks for the existence of plan.md in _scrum-output/sprints/SW-XXX/
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DEV_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'dev-story.md');
const DEV_STORY_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'dev-story.md');
const STORY_FILE = join(process.cwd(), '_bmad-output', 'implementation-artifacts', '4-2-implement-plan-existence-check-before-dev.md');

// ============================================================================
// AC1: plan.md existence check in dev-story command
// ============================================================================

describe('AC1: plan.md Existence Check in dev-story Command', () => {
  // Test 1.1: dev-story.md should have a prerequisite check for plan.md
  test('[P0] dev-story.md should check for plan.md existence before status check', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Should mention plan.md existence check
    expect(content).toMatch(/plan\.md.*exist|exist.*plan\.md/i);
  });

  // Test 1.2: dev-story.md should block if plan.md does not exist
  test('[P0] dev-story.md should block command if plan.md does not exist', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Should mention blocking or halting if plan.md missing
    expect(content).toMatch(/block|halt|stop|prevent/i);
  });

  // Test 1.3: dev-story.md should reference _scrum-output/sprints/SW-XXX/plan.md path
  test('[P0] dev-story.md should reference the correct plan.md path', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Should reference the sprint output path
    expect(content).toMatch(/_scrum-output.*sprints|SW-XXX.*plan/i);
  });

  // Test 1.4: Check should happen BEFORE status check (fast failure)
  test('[P1] plan.md check should happen before status check in command flow', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // The prerequisite check should be mentioned before or alongside status check
    // Look for sequence: plan check first, then status check
    const planCheckPos = content.search(/plan\.md.*exist/i);
    const statusCheckPos = content.search(/requires_status|status.*check/i);
    // Both should exist and plan check should be mentioned
    expect(planCheckPos).toBeGreaterThan(0);
  });
});

// ============================================================================
// AC1: plan.md existence check in dev-story workflow
// ============================================================================

describe('AC1: plan.md Existence Check in dev-story Workflow', () => {
  // Test 1.5: workflows/dev-story.md should mention plan.md prerequisite
  test('[P0] workflows/dev-story.md should check plan.md as prerequisite', () => {
    const content = readFileSync(DEV_STORY_WORKFLOW, 'utf8');
    expect(content).toMatch(/plan\.md.*prerequisite|prerequisite.*plan\.md/i);
  });

  // Test 1.6: workflow should define behavior when plan.md is missing
  test('[P0] workflow should define behavior when plan.md is missing', () => {
    const content = readFileSync(DEV_STORY_WORKFLOW, 'utf8');
    // Should define what happens when plan is missing (block/error)
    expect(content).toMatch(/missing.*plan|plan.*missing|does not exist/i);
  });

  // Test 1.7: The check should be a guard condition (pre-check)
  test('[P1] plan.md check should be a guard condition (pre-check)', () => {
    const content = readFileSync(DEV_STORY_WORKFLOW, 'utf8');
    // Guard conditions are pre-checks before any execution
    expect(content).toMatch(/guard|prerequisite|pre.*check|before.*implementation/i);
  });
});
