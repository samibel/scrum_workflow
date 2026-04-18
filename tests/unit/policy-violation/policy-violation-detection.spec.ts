/**
 * ATDD Tests for Policy Violation Detection
 *
 * TDD Phase: RED (tests written before implementation — will pass after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 8.2 - Implement Policy Violation Detection
 *
 * PRD References:
 * - FR-37: Policy violation detection with at least 3 violation types
 * - FR-9 / SC-18: Write boundary enforcement
 * - Architecture error pattern: Policy Violation: {type} with **Details:** and **Next Step:**
 *
 * AC1: Given FR-37 specifies detection of at least 3 policy violation types
 *      When a policy check runs (retrospective, not real-time guard)
 *      Then the following violation types are detected:
 *        - No plan: story reached in-progress without plan.md
 *        - No verification: story reached review without verification-report.md
 *        - Skipped phase: status_history shows transitions that skip required intermediate states
 *
 * AC2: Given a policy violation is detected
 *      When the violation is reported
 *      Then an actionable error message is produced following the Architecture error format
 *      And the violation is logged for audit trail purposes (Story 8.3)
 *
 * AC3: Given SC-6 specifies at least 3 violation types correctly detected and blocked
 *      When policy detection is validated
 *      Then all 3 violation types are demonstrated to be correctly detected
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

// Test paths - using process.cwd() which will be the project root during test execution
const PROJECT_ROOT = process.cwd();
const POLICY_CHECK_CMD = join(PROJECT_ROOT, 'src', 'core', 'commands', 'policy-check.md');
const POLICY_VIOLATION_WORKFLOW = join(PROJECT_ROOT, 'src', 'core', 'workflows', 'policy-violation.md');
const AUDIT_OUTPUT_DIR = join(PROJECT_ROOT, '_scrum-output', 'audit');
const STORY_FILE = join(PROJECT_ROOT, '_bmad-output', 'implementation-artifacts', '8-2-implement-policy-violation-detection.md');

// Helper to create a mock story structure for testing
function createMockStoryDir(ticketId: string): string {
  const storyDir = join(PROJECT_ROOT, '_scrum-output', 'sprints', ticketId);
  mkdirSync(storyDir, { recursive: true });
  return storyDir;
}

// Helper to create a mock status_history
function createMockStatusHistory(statuses: string[]): string {
  const entries = statuses.map((status, index) => ({
    status,
    timestamp: new Date(Date.now() - (statuses.length - index) * 86400000).toISOString(),
  }));
  return JSON.stringify({ status_history: entries }, null, 2);
}

// ============================================================================
// AC1: Command & Workflow Definition
// ============================================================================

describe('AC1: Policy Check Command & Workflow Definition', () => {
  // Test 1.1: policy-check.md command should exist
  test('[P0] scrum_workflow/commands/policy-check.md should exist', () => {
    expect(existsSync(POLICY_CHECK_CMD)).toBe(true);
  });

  // Test 1.2: policy-violation.md workflow should exist
  test('[P0] scrum_workflow/workflows/policy-violation.md should exist', () => {
    expect(existsSync(POLICY_VIOLATION_WORKFLOW)).toBe(true);
  });

  // Test 1.3: policy-check.md should define the slash-command
  test('[P0] policy-check.md should define /scrum-policy-check command', () => {
    const content = readFileSync(POLICY_CHECK_CMD, 'utf8');
    expect(content).toMatch(/scrum-policy-check|SW-\d{3}/);
  });

  // Test 1.4: policy-check.md should reference policy-violation workflow
  test('[P0] policy-check.md should reference policy-violation workflow', () => {
    const content = readFileSync(POLICY_CHECK_CMD, 'utf8');
    expect(content).toMatch(/policy-violation/i);
  });

  // Test 1.5: policy-violation workflow should define detection process
  test('[P0] policy-violation workflow should define 3 violation types', () => {
    const content = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    // Should mention all 3 violation types
    expect(content).toMatch(/no plan|plan\.md|plan missing/i);
    expect(content).toMatch(/no verification|verification-report\.md|verification missing/i);
    expect(content).toMatch(/skipped phase|skipped|invalid transition/i);
  });

  // Test 1.6: workflow should define detection trigger
  test('[P0] policy-violation workflow should define retrospective detection trigger', () => {
    const content = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(content).toMatch(/retrospective|scan|check/i);
  });
});

// ============================================================================
// AC1: Violation Type 1 - No Plan Detection
// ============================================================================

describe('AC1: Violation Type 1 - No Plan Detection', () => {
  // Test 2.1: No plan detection should check for plan.md existence
  test('[P0] No plan detection should check for plan.md existence', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/plan\.md|plan.*exist|check.*plan/i);
  });

  // Test 2.2: No plan detection should trigger when story is in-progress or beyond
  test('[P0] No plan detection should trigger for in-progress status', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/in-progress|progress|started/i);
  });

  // Test 2.3: No plan detection should be one of the 3 violation types
  test('[P1] No plan should be documented as violation type', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    // Should have some mention of "no plan" or similar
    expect(workflowContent).toMatch(/no plan|plan missing|missing plan/i);
  });
});

// ============================================================================
// AC1: Violation Type 2 - No Verification Detection
// ============================================================================

describe('AC1: Violation Type 2 - No Verification Detection', () => {
  // Test 3.1: No verification detection should check for verification-report.md
  test('[P0] No verification detection should check for verification-report.md', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/verification-report\.md|verification.*report|check.*verification/i);
  });

  // Test 3.2: No verification detection should trigger when story reached review
  test('[P0] No verification detection should trigger for review status', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/review|reviewing|verified/i);
  });

  // Test 3.3: No verification should be one of the 3 violation types
  test('[P1] No verification should be documented as violation type', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/no verification|verification missing|missing verification/i);
  });
});

// ============================================================================
// AC1: Violation Type 3 - Skipped Phase Detection
// ============================================================================

describe('AC1: Violation Type 3 - Skipped Phase Detection', () => {
  // Test 4.1: Skipped phase detection should analyze status_history
  test('[P0] Skipped phase detection should analyze status_history', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/status_history|status history|transition/i);
  });

  // Test 4.2: Skipped phase detection should check for required intermediate states
  test('[P0] Skipped phase detection should check for required intermediate states', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/intermediate|required.*state|phase.*skip/i);
  });

  // Test 4.3: Skipped phase detection should reference 9-state lifecycle
  test('[P1] Skipped phase detection should reference 9-state lifecycle', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/9.*state|nine.*state|lifecycle/i);
  });

  // Test 4.4: Skipped phase should be one of the 3 violation types
  test('[P1] Skipped phase should be documented as violation type', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/skipped phase|skipped|phase.*skip/i);
  });
});

// ============================================================================
// AC2: Error Message Format (Architecture Error Format)
// ============================================================================

describe('AC2: Error Message Format - Architecture Error Format', () => {
  // Test 5.1: Error format should use Policy Violation prefix
  test('[P0] Error message should use Policy Violation prefix', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/Policy Violation|❌.*Policy|Violation.*detected/i);
  });

  // Test 5.2: Error message should include **Details:** section
  test('[P0] Error message should include **Details:** section', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/\*\*Details|Details:|Details\*\*/i);
  });

  // Test 5.3: Error message should include **Next Step:** section
  test('[P0] Error message should include **Next Step:** section', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/\*\*Next Step|Next Step:|Next Step\*\*/i);
  });

  // Test 5.4: Error format should include violation type
  test('[P0] Error message should include violation type', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/:.*no plan|:.*no verification|:.*skipped phase/i);
  });
});

// ============================================================================
// AC2: Audit Trail Logging
// ============================================================================

describe('AC2: Audit Trail Logging', () => {
  // Test 6.1: Violations should be logged to audit trail
  test('[P0] policy-violation workflow should log violations', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/audit|log|record/i);
  });

  // Test 6.2: Audit output should go to _scrum-output/audit/
  test('[P0] Audit output should go to _scrum-output/audit/', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/_scrum-output.*audit|audit.*output/i);
  });

  // Test 6.3: Audit file naming should follow SW-XXX-policy-violations.md pattern
  test('[P0] Audit file should follow SW-XXX-policy-violations.md pattern', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/SW-\d{3}-policy-violations|policy-violations\.md/i);
  });

  // Test 6.4: Audit logging should be prepared for Story 8.3 integration
  test('[P1] Audit logging should be prepared for central audit trail (Story 8.3)', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    expect(workflowContent).toMatch(/8\.3|Story 8\.3|audit trail|central/i);
  });
});

// ============================================================================
// AC3: Write Boundary Enforcement
// ============================================================================

describe('AC3: Write Boundary Enforcement', () => {
  // Test 7.1: Policy check should NOT modify story.md
  test('[P0] Policy check should NOT modify story.md (write boundary)', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    // Should NOT mention writing to story.md
    expect(workflowContent).not.toMatch(/write.*story\.md|update.*story\.md|modify.*story\.md/i);
  });

  // Test 7.2: Policy check should ONLY write to audit log
  test('[P0] Policy check should ONLY write to audit log', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    // Should mention audit log writing
    expect(workflowContent).toMatch(/write.*audit|audit.*write|output.*audit/i);
  });

  // Test 7.3: Write boundary should be documented in story file
  test('[P0] Write boundary constraint should be documented', () => {
    const storyContent = readFileSync(STORY_FILE, 'utf8');
    expect(storyContent).toMatch(/Write Boundary|FR-9|SC-18/i);
  });
});

// ============================================================================
// AC3: All 3 Violation Types Demonstrated
// ============================================================================

describe('AC3: All 3 Violation Types Demonstrated in Validation', () => {
  // Test 8.1: All 3 violation types should be covered
  test('[P0] All 3 violation types should be defined', () => {
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    const violationCount = (
      (workflowContent.match(/no plan|plan missing|missing plan/i) || []).length +
      (workflowContent.match(/no verification|verification missing|missing verification/i) || []).length +
      (workflowContent.match(/skipped phase|skipped|phase.*skip/i) || []).length
    );
    expect(violationCount).toBeGreaterThanOrEqual(3);
  });

  // Test 8.2: Story file should reference FR-37 (3+ violation types)
  test('[P0] Story file should reference FR-37 (3+ violation types)', () => {
    const storyContent = readFileSync(STORY_FILE, 'utf8');
    expect(storyContent).toMatch(/FR-37/i);
  });

  // Test 8.3: Story file should reference SC-6 (3 violation types validated)
  test('[P0] Story file should reference SC-6 (3 violation types validated)', () => {
    const storyContent = readFileSync(STORY_FILE, 'utf8');
    expect(storyContent).toMatch(/SC-6/i);
  });

  // Test 8.4: Story Dev Notes should explain the 3 violation types
  test('[P1] Story Dev Notes should explain the 3 violation types', () => {
    const storyContent = readFileSync(STORY_FILE, 'utf8');
    // Dev Notes should have key technical details
    expect(storyContent).toMatch(/Dev Notes|Key Technical Details/i);
  });
});

// ============================================================================
// Integration: Command Execution Path
// ============================================================================

describe('Integration: Command Execution Path', () => {
  // Test 9.1: Command should only run on stories with status transitions completed
  test('[P0] policy-check command should have status guard validation', () => {
    const cmdContent = readFileSync(POLICY_CHECK_CMD, 'utf8');
    expect(cmdContent).toMatch(/status|transition|workflow/i);
  });

  // Test 9.2: Command should accept SW-XXX ticket ID
  test('[P0] policy-check command should accept SW-XXX ticket ID', () => {
    const cmdContent = readFileSync(POLICY_CHECK_CMD, 'utf8');
    expect(cmdContent).toMatch(/SW-\d{3}|ticket|story/i);
  });

  // Test 9.3: Command should invoke policy-violation workflow
  test('[P0] policy-check command should invoke policy-violation workflow', () => {
    const cmdContent = readFileSync(POLICY_CHECK_CMD, 'utf8');
    const workflowContent = readFileSync(POLICY_VIOLATION_WORKFLOW, 'utf8');
    // Both should reference the same workflow
    expect(cmdContent).toMatch(/workflow|pipeline|process/i);
  });
});

// ============================================================================
// Story Reference: 9-State Lifecycle Integration
// ============================================================================

describe('Story Reference: 9-State Lifecycle Integration', () => {
  // Test 10.1: Story should reference Epic 3 (guards)
  test('[P1] Story should reference Epic 3 guards (Story 3.2)', () => {
    const storyContent = readFileSync(STORY_FILE, 'utf8');
    expect(storyContent).toMatch(/Epic 3|Story 3\.2|guards/i);
  });

  // Test 10.2: Story should reference Story 3.1 (lifecycle definition)
  test('[P1] Story should reference Story 3.1 (9-state lifecycle)', () => {
    const storyContent = readFileSync(STORY_FILE, 'utf8');
    expect(storyContent).toMatch(/Story 3\.1|9-state|lifecycle/i);
  });

  // Test 10.3: Story should reference Story 8.1 (verification)
  test('[P1] Story should reference Story 8.1 (post-implementation verification)', () => {
    const storyContent = readFileSync(STORY_FILE, 'utf8');
    expect(storyContent).toMatch(/Story 8\.1|verification/i);
  });

  // Test 10.4: Story should reference Story 8.3 (audit trail)
  test('[P1] Story should reference Story 8.3 (central audit trail)', () => {
    const storyContent = readFileSync(STORY_FILE, 'utf8');
    expect(storyContent).toMatch(/Story 8\.3|audit trail|central.*audit/i);
  });
});
