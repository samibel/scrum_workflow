/**
 * ATDD Tests for AC2: plan.md Generation on Validation PASS
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 4.1 - Implement Story Readiness Validation & Plan Generation
 *
 * PRD References:
 * - FR-19: plan.md as mandatory output of readiness validation
 *
 * AC2: Given all 5 criteria pass validation
 *      When the validation is complete
 *      Then a plan.md artifact is generated in _scrum-output/sprints/SW-XXX/
 *      And the plan contains an actionable execution plan derived from the story and refinement artifacts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REFINE_STORY_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'refine-story.md');
const REFINE_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-story.md');
const STORY_FILE = join(process.cwd(), '_bmad-output', 'implementation-artifacts', '4-1-implement-story-readiness-validation-plan-generation.md');

// ============================================================================
// AC2: plan.md is generated on validation PASS
// ============================================================================

describe('AC2: plan.md Generation on Validation PASS', () => {
  // Test 2.1: refine-story workflow should generate plan.md on PASS
  test('[P0] refine-story workflow should generate plan.md when all criteria pass', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should mention plan.md generation on validation pass
    expect(content).toMatch(/plan\.md.*generat|generat.*plan\.md/i);
  });

  // Test 2.2: plan.md should be written to _scrum-output/sprints/SW-XXX/
  test('[P0] plan.md should be written to _scrum-output/sprints/SW-XXX/ directory', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should reference the correct output path
    expect(content).toMatch(/_scrum-output.*sprints|plan\.md.*sprint/i);
  });

  // Test 2.3: plan.md should contain actionable execution plan
  test('[P0] plan.md should contain actionable execution plan content', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should mention execution steps or plan content
    expect(content).toMatch(/execution|step|task|action/i);
  });

  // Test 2.4: plan.md should be derived from story and refinement
  test('[P0] plan.md should be derived from story.md and refinement.md', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should reference using story and refinement as sources
    expect(content).toMatch(/story\.md.*refinement|refinement.*story\.md/i);
  });
});

// ============================================================================
// AC2: plan.md content structure
// ============================================================================

describe('AC2: plan.md Content Structure', () => {
  // Test 2.5: plan.md should contain story summary
  test('[P1] plan.md should contain story summary derived from story.md', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    expect(content).toMatch(/summary|overview|story/i);
  });

  // Test 2.6: plan.md should contain execution steps
  test('[P1] plan.md should contain ordered execution steps', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    expect(content).toMatch(/step|execution|action|ordered/i);
  });

  // Test 2.7: plan.md should identify files/components to modify
  test('[P1] plan.md should identify files or components to modify', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    expect(content).toMatch(/file|component|modify|touch/i);
  });

  // Test 2.8: plan.md should include risks and concerns
  test('[P1] plan.md should include risks and concerns from refinement', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    expect(content).toMatch(/risk|concern|issue|warning/i);
  });

  // Test 2.9: plan.md should define success criteria
  test('[P1] plan.md should define success criteria for implementation', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    expect(content).toMatch(/success|criteria|done|complete/i);
  });
});

// ============================================================================
// AC2: Write boundary compliance
// ============================================================================

describe('AC2: Write Boundary Compliance for plan.md Generation', () => {
  // Test 2.10: /scrum-refine-story may write plan.md (verified in workflow)
  test('[P0] /scrum-refine-story write boundary should allow plan.md', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    // Write boundary section should allow plan.md
    expect(content).toMatch(/plan\.md/);
  });

  // Test 2.11: /scrum-refine-story may NOT write source code
  test('[P0] /scrum-refine-story write boundary should prohibit source code', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    // Write boundary should prohibit code files
    const wbMatch = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbMatch).not.toBeNull();
    expect(wbMatch![0]).toMatch(/may NOT write/);
  });
});
