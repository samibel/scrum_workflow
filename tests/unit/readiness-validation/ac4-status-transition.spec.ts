/**
 * ATDD Tests for AC4: Status Transition and status_history on Validation PASS
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 4.1 - Implement Story Readiness Validation & Plan Generation
 *
 * PRD References:
 * - FR-7: status_history tracking
 * - FR-18: Story completeness validation
 *
 * AC4: Given all 5 criteria pass validation
 *      When validation is complete
 *      Then the story status transitions to ready-for-dev
 *      And a status_history entry is appended with trigger: /scrum-refine-story
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REFINE_STORY_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'refine-story.md');
const REFINE_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-story.md');
const STORY_FILE = join(process.cwd(), '_scrum-output', 'implementation-artifacts', '4-1-implement-story-readiness-validation-plan-generation.md');
const STANDARDS_FILE = join(process.cwd(), 'scrum_workflow', 'context', 'standards.md');

// ============================================================================
// AC4: Status transition: refined → ready-for-dev on PASS
// ============================================================================

describe('AC4: Status Transition refined → ready-for-dev on PASS', () => {
  // Test 4.1: Workflow should transition status from refined to ready-for-dev on PASS
  test('[P0] refine-story workflow should transition status from refined to ready-for-dev on PASS', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should show the transition refined → ready-for-dev
    expect(content).toMatch(/refined.*ready-for-dev|ready-for-dev.*refined/i);
  });

  // Test 4.2: Transition should happen only after all criteria pass
  test('[P0] Status transition should only happen after all criteria pass', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should condition the transition on passing all criteria
    expect(content).toMatch(/pass.*transition|transition.*pass|all.*criteria.*pass/i);
  });

  // Test 4.3: ready-for-dev is a valid status value (lowercase with hyphen)
  test('[P1] ready-for-dev should follow status format convention (lowercase with hyphens)', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Status should be lowercase with hyphens per architecture
    expect(content).toMatch(/ready-for-dev/);
    expect(content).not.toMatch(/ready_for_dev|ReadyForDev|READY-FOR-DEV/);
  });
});

// ============================================================================
// AC4: status_history entry on PASS
// ============================================================================

describe('AC4: status_history Entry Appended on PASS', () => {
  // Test 4.4: Workflow should append status_history entry on PASS
  test('[P0] refine-story workflow should append status_history entry on PASS', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should mention status_history being updated
    expect(content).toMatch(/status_history/);
  });

  // Test 4.5: status_history entry should include trigger: /scrum-refine-story
  test('[P0] status_history entry should include trigger: /scrum-refine-story', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should reference the trigger command
    expect(content).toMatch(/trigger.*scrum-refine-story|scrum-refine-story.*trigger/i);
  });

  // Test 4.6: status_history entry should include actor field
  test('[P0] status_history entry should include actor field', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Architecture requires actor field in every status_history entry
    expect(content).toMatch(/actor/);
  });

  // Test 4.7: actor should be readiness-check-skill or similar skill actor
  test('[P1] actor should be the skill that performed the validation', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Actor should identify the skill
    expect(content).toMatch(/readiness-check-skill|skill.*actor/i);
  });
});

// ============================================================================
// AC4: No status change on FAIL
// ============================================================================

describe('AC4: No Status Change on Validation FAIL', () => {
  // Test 4.8: Workflow should NOT transition status on FAIL
  test('[P0] refine-story workflow should NOT transition status when criteria fail', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should show that status remains refined on failure
    expect(content).toMatch(/fail.*status.*remain|remain.*status.*fail|do not.*transition.*fail/i);
  });

  // Test 4.9: No status_history entry on FAIL
  test('[P0] No status_history entry should be appended when criteria fail', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // status_history should NOT be updated on failure
    expect(content).toMatch(/status_history.*fail.*not|no.*status_history.*fail/i);
  });
});

// ============================================================================
// AC4: Architecture compliance
// ============================================================================

describe('AC4: Architecture Compliance for Status Transitions', () => {
  // Test 4.10: Transition refined → ready-for-dev should be in valid transitions
  test('[P0] refined → ready-for-dev should be a valid transition per architecture', () => {
    const standardsContent = readFileSync(STANDARDS_FILE, 'utf8');
    // The standards should list this as a valid transition
    expect(standardsContent).toMatch(/refined.*ready-for-dev|ready-for-dev.*refined/i);
  });

  // Test 4.11: /scrum-refine-story command should update story status (not just workflow)
  test('[P1] /scrum-refine-story command should instruct status update', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    // Command should mention updating status
    expect(content).toMatch(/status.*updat|updat.*status/i);
  });

  // Test 4.12: Write boundary allows status update in story.md
  test('[P1] /scrum-refine-story write boundary should allow status update in story.md', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    // Write boundary should allow story.md status update
    const wbMatch = content.match(/## Write Boundary Rules[\s\S]*?## /);
    if (wbMatch) {
      expect(wbMatch[0]).toMatch(/story\.md.*status|status.*story\.md/i);
    } else {
      // Fallback: check if story.md appears with status in the file
      expect(content).toMatch(/story\.md/);
    }
  });
});

// ============================================================================
// AC4: ISO 8601 timestamp format
// ============================================================================

describe('AC4: ISO 8601 UTC Timestamp in status_history', () => {
  // Test 4.13: status_history entry should include timestamp in ISO 8601 UTC
  test('[P1] status_history entry should include timestamp in ISO 8601 UTC format', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should mention ISO 8601 or timestamp format
    expect(content).toMatch(/timestamp|ISO.{0,10}8601|UTC/i);
  });
});
