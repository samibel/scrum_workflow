/**
 * ATDD Tests for AC1: Five Immutable Readiness Criteria
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 4.1 - Implement Story Readiness Validation & Plan Generation
 *
 * PRD References:
 * - FR-18: Story completeness validation via /scrum-refine-story against 5 immutable criteria
 *
 * AC1: Given FR-18 specifies story completeness validation via /scrum-refine-story against 5 immutable criteria
 *      When a developer runs /scrum-refine-story SW-XXX on a story with status refined
 *      Then the system validates the story against all 5 readiness criteria
 *      And the criteria are explicitly defined in the validation skill
 *      And each criterion produces a PASS or FAIL result with explanation
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const STORY_FILE = join(process.cwd(), '_scrum-output', 'implementation-artifacts', '4-1-implement-story-readiness-validation-plan-generation.md');
const REFINE_STORY_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'refine-story.md');
const REFINE_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-story.md');
const READINESS_CHECK_SKILL_DIR = join(process.cwd(), 'scrum_workflow', 'skills', 'readiness-check');
const READINESS_CHECK_SKILL = join(READINESS_CHECK_SKILL_DIR, 'SKILL.md');

// ============================================================================
// AC1: Readiness Check Skill Exists with 5 Criteria
// ============================================================================

describe('AC1: Readiness Check Skill - 5 Immutable Criteria Defined', () => {
  // Test 1.1: readiness-check skill directory should exist
  test('[P0] skills/readiness-check/ directory should exist', () => {
    expect(existsSync(READINESS_CHECK_SKILL_DIR)).toBe(true);
  });

  // Test 1.2: readiness-check SKILL.md should exist
  test('[P0] skills/readiness-check/SKILL.md should exist', () => {
    expect(existsSync(READINESS_CHECK_SKILL)).toBe(true);
  });

  // Test 1.3: SKILL.md should define 5 immutable criteria
  test('[P0] readiness-check SKILL.md should define exactly 5 readiness criteria', () => {
    const content = readFileSync(READINESS_CHECK_SKILL, 'utf8');
    // Should have 5 criteria sections or mentions
    expect(content).toMatch(/criteria.{0,20}5|5.{0,20}criteria|five.{0,20}criteria/i);
  });

  // Test 1.4: Criterion 1 - Completeness should be defined
  test('[P0] Criterion 1 (Completeness) should be defined', () => {
    const content = readFileSync(READINESS_CHECK_SKILL, 'utf8');
    // Completeness: story has all required fields
    expect(content).toMatch(/completeness|complete|completude/i);
  });

  // Test 1.5: Criterion 2 - Refinement should be defined
  test('[P0] Criterion 2 (Refinement) should be defined', () => {
    const content = readFileSync(READINESS_CHECK_SKILL, 'utf8');
    // Refinement: story has been refined (has refinement.md)
    expect(content).toMatch(/refinement|refined/i);
  });

  // Test 1.6: Criterion 3 - Estimability should be defined
  test('[P0] Criterion 3 (Estimability) should be defined', () => {
    const content = readFileSync(READINESS_CHECK_SKILL, 'utf8');
    // Estimability: story has story points or estimation note
    expect(content).toMatch(/estimability|estimate|story points/i);
  });

  // Test 1.7: Criterion 4 - Testability should be defined
  test('[P0] Criterion 4 (Testability) should be defined', () => {
    const content = readFileSync(READINESS_CHECK_SKILL, 'utf8');
    // Testability: acceptance criteria are testable
    expect(content).toMatch(/testability|testable|testing/i);
  });

  // Test 1.8: Criterion 5 - Dependencies should be defined
  test('[P0] Criterion 5 (Dependencies) should be defined', () => {
    const content = readFileSync(READINESS_CHECK_SKILL, 'utf8');
    // Dependencies: all dependencies identified and addressed
    expect(content).toMatch(/dependenc|prior.{0,10}work/i);
  });
});

// ============================================================================
// AC1: refine-story.md invokes readiness check with 5 criteria
// ============================================================================

describe('AC1: refine-story Workflow Invokes 5-Criteria Validation', () => {
  // Test 1.9: refine-story.md should reference readiness-check skill
  test('[P0] refine-story.md should reference readiness-check skill', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    expect(content).toMatch(/readiness-check|readiness check/i);
  });

  // Test 1.10: refine-story.md should have validation step for 5 criteria
  test('[P0] refine-story.md should have step that validates 5 criteria', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    expect(content).toMatch(/validat.{0,30}5.{0,30}criteria|5.{0,30}criteria.{0,30}validat/i);
  });

  // Test 1.11: refine-story workflow should produce PASS/FAIL result per criterion
  test('[P0] refine-story workflow should produce PASS or FAIL result per criterion', () => {
    const content = readFileSync(REFINE_STORY_WORKFLOW, 'utf8');
    // Should mention PASS and FAIL outcomes
    expect(content).toMatch(/PASS.*FAIL|FAIL.*PASS|pass.*fail/i);
  });
});

// ============================================================================
// AC1: Each criterion has PASS/FAIL conditions
// ============================================================================

describe('AC1: Each Criterion Has Explicit PASS/FAIL Conditions', () => {
  // Test 1.12: Completeness criterion should have PASS condition
  test('[P1] Completeness criterion should have explicit PASS condition', () => {
    const content = readFileSync(READINESS_CHECK_SKILL, 'utf8');
    // Should define when completeness passes
    expect(content).toMatch(/complet.*pass|pass.*complet/i);
  });

  // Test 1.13: Completeness criterion should have FAIL condition
  test('[P1] Completeness criterion should have explicit FAIL condition', () => {
    const content = readFileSync(READINESS_CHECK_SKILL, 'utf8');
    // Should define when completeness fails
    expect(content).toMatch(/complet.*fail|fail.*complet/i);
  });

  // Test 1.14: Each criterion should explain why it passed or failed
  test('[P1] Each criterion should produce an explanation when validated', () => {
    const content = readFileSync(READINESS_CHECK_SKILL, 'utf8');
    // Should mention explanation or reason
    expect(content).toMatch(/explanation|reason|details|because/i);
  });
});
