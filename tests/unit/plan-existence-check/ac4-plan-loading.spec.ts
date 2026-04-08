/**
 * ATDD Tests for AC4: Plan Loading When Check Passes
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 4.2 - Implement Plan Existence Check Before Dev
 *
 * PRD References:
 * - FR-20: plan.md existence check
 *
 * AC4: Given plan.md exists and is current
 *      When the existence check passes
 *      Then /scrum-dev-story proceeds with implementation
 *      And the plan is loaded as context for the implementation agent
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const DEV_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'dev-story.md');
const DEV_STORY_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'dev-story.md');

// ============================================================================
// AC4: Plan Loading When Check Passes
// ============================================================================

describe('AC4: Plan Loading When Check Passes', () => {
  // Test 4.1: dev-story.md should load plan.md content when check passes
  test('[P0] dev-story.md should load plan.md content when existence check passes', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Should mention loading plan content
    expect(content).toMatch(/load.*plan|plan.*load/i);
  });

  // Test 4.2: plan.md should be made available as context
  test('[P0] plan.md should be available as context for implementation', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Context for implementation agent
    expect(content).toMatch(/context.*plan|plan.*context/i);
  });

  // Test 4.3: Command should proceed when plan exists and is current
  test('[P0] Command should proceed when plan exists and is current', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Proceed with implementation
    expect(content).toMatch(/proceed.*implementation|implementation.*proceed/i);
  });

  // Test 4.4: plan content should guide implementation
  test('[P1] plan.md content should guide implementation', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Plan as guidance
    expect(content).toMatch(/plan.*guide|follow.*plan/i);
  });
});

// ============================================================================
// AC4: Workflow Integration
// ============================================================================

describe('AC4: Workflow Integration', () => {
  // Test 4.5: workflows/dev-story.md should reference plan.md loading
  test('[P0] workflows/dev-story.md should reference plan.md loading', () => {
    const content = readFileSync(DEV_STORY_WORKFLOW, 'utf8');
    // Should load plan for context
    expect(content).toMatch(/plan\.md.*load|load.*plan\.md/i);
  });

  // Test 4.6: workflow should read plan.md file
  test('[P0] workflow should read plan.md file during execution', () => {
    const content = readFileSync(DEV_STORY_WORKFLOW, 'utf8');
    // File read operation
    expect(content).toMatch(/read.*plan\.md|plan\.md.*read/i);
  });

  // Test 4.7: plan content should be passed to implementation agent
  test('[P1] plan content should be passed to implementation agent', () => {
    const content = readFileSync(DEV_STORY_WORKFLOW, 'utf8');
    // Agent context
    expect(content).toMatch(/agent.*context|context.*agent/i);
  });
});

// ============================================================================
// AC4: Write Boundary Compliance
// ============================================================================

describe('AC4: Write Boundary Compliance', () => {
  // Test 4.8: /scrum-dev-story may read plan.md (as context)
  test('[P0] /scrum-dev-story may read plan.md (as context)', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Write boundary should mention plan.md is read-only
    expect(content).toMatch(/plan\.md.*read-only|read.*plan\.md/i);
  });

  // Test 4.9: /scrum-dev-story may NOT write plan.md
  test('[P0] /scrum-dev-story write boundary should prohibit plan.md', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Write boundary check
    const wbMatch = content.match(/## Write Boundary Rules[\s\S]*?## /);
    expect(wbMatch).not.toBeNull();
    expect(wbMatch![0]).toMatch(/may NOT write.*plan\.md|plan\.md.*may NOT write/i);
  });

  // Test 4.10: plan.md is created by /scrum-refine-story, not /scrum-dev-story
  test('[P1] plan.md is created by /scrum-refine-story (not dev-story)', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Clear provenance
    expect(content).toMatch(/created by.*\/scrum-refine-story|\/scrum-refine-story.*creates/i);
  });
});
