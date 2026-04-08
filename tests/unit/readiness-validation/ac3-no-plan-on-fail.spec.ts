/**
 * ATDD Tests for AC3: No plan.md Generated on Validation FAIL
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 4.1 - Implement Story Readiness Validation & Plan Generation
 *
 * PRD References:
 * - FR-18: Story completeness validation
 *
 * AC3: Given one or more criteria fail validation
 *      When the validation is complete
 *      Then no plan.md is generated
 *      And the story status remains refined
 *      And the system reports which criteria failed with actionable guidance for resolution
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REFINE_STORY_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'refine-story.md');
const REFINE_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-story.md');
const STORY_FILE = join(process.cwd(), '_bmad-output', 'implementation-artifacts', '4-1-implement-story-readiness-validation-plan-generation.md');

// ============================================================================
// AC3: No plan.md on validation FAIL
// ============================================================================

describe('AC3: No plan.md Generated on Validation FAIL', () => {
  // Test 3.1: refine-story workflow should NOT generate plan.md when criteria fail
  test('[P0] refine-story workflow should NOT generate plan.md when criteria fail', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should have conditional logic: only generate plan.md on PASS, not on FAIL
    // Look for conditional pattern: if criteria fail, no plan.md
    expect(content).toMatch(/fail.*plan\.md|plan\.md.*fail/i) ||
    expect(content).toMatch(/PASS.*plan|FAIL.*no.*plan/i);
  });

  // Test 3.2: Workflow should report which criteria failed
  test('[P0] refine-story workflow should report which criteria failed', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should mention reporting failed criteria
    expect(content).toMatch(/failed.*criterion|criterion.*failed|which.*fail/i);
  });

  // Test 3.3: Failed criteria should have actionable guidance
  test('[P0] Failed criteria should include actionable guidance for resolution', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should mention guidance or next steps for fixing failures
    expect(content).toMatch(/guidance|next step|how to fix|resolution|remediation/i);
  });

  // Test 3.4: Status should remain unchanged (refined) on FAIL
  test('[P0] Story status should remain refined when criteria fail', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Status should not change when validation fails
    expect(content).toMatch(/status.*refined|refined.*status/i) ||
    expect(content).toMatch(/remain.*unchanged|do not.*change.*status|no.*transition/i);
  });
});

// ============================================================================
// AC3: Failed criteria reporting format
// ============================================================================

describe('AC3: Failed Criteria Reporting Format', () => {
  // Test 3.5: Failed criteria should list which specific criteria failed
  test('[P1] Failed criteria report should list which specific criteria failed', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should mention specific criteria in failure report
    expect(content).toMatch(/criterion.*1|criterion.*2|completeness|refinement|estimability|testability|dependenc/i);
  });

  // Test 3.6: Failure report should be human-readable
  test('[P1] Failure report should be human-readable (not just technical)', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should mention readable or understandable output
    expect(content).toMatch(/human.{0,10}readable|readable|understandable|clear/i);
  });

  // Test 3.7: Failure guidance should follow error format standard
  test('[P1] Failure guidance should follow standard error format', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Standard error format: ❌ {Error Type} with Details and Next Step
    expect(content).toMatch(/❌.*fail|fail.*❌|error.*guidance/i);
  });
});

// ============================================================================
// AC3: Validation failure does not modify story status
// ============================================================================

describe('AC3: Validation Failure Does Not Transition Story Status', () => {
  // Test 3.8: Failed validation should not write status change to story.md
  test('[P0] Failed validation should not write status change to story.md', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should show that status_history is NOT updated on FAIL
    expect(content).toMatch(/status_history.*fail|fail.*status_history|do not.*update.*status/i);
  });

  // Test 3.9: Failed validation should not create plan.md artifact
  test('[P0] Failed validation should not create any artifact except maybe a report', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should explicitly state no plan.md on fail
    expect(content).toMatch(/no.*plan\.md|plan\.md.*not.*creat|skip.*plan/i);
  });
});
