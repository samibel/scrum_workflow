/**
 * ATDD Tests for AC1: Architecture-Standard Error Format in Status Guard Validation
 *
 * TDD Phase: RED (tests will fail until implementation is complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 3.2 - Implement Status Guard Validation (FR-8, FR-10, FR-11)
 *
 * PRD References:
 * - FR-8: Block invalid state transitions with actionable error messages
 *
 * AC1: Given FR-8 specifies blocking invalid state transitions with actionable error messages
 *      When a developer runs a command that would cause an invalid transition
 *      Then the command is blocked before any file writes occur
 *      And the error message includes: current status, required status, and the next valid command to run
 *      And the error follows the Architecture error format:
 *        ❌ Status Guard Violation: {description}
 *        with **Details:** and **Next Step:**
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

const DEV_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'dev-story.md');
const APPROVE_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'approve.md');
const REVIEW_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'review-story.md');
const REFINE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-ticket.md');
const REFINE_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-story.md');
const CREATE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');

// ============================================================================
// AC1: SKILL.md uses standard error format for all 6 guard failures
// ============================================================================

describe('AC1: SKILL.md — Architecture-standard error format for all guard failures', () => {
  // Test 1.1: SKILL.md exists
  test('[P0] status-guard-validation/SKILL.md should exist', () => {
    expect(existsSync(SKILL_FILE)).toBe(true);
  });

  // Test 1.2: SKILL.md uses ❌ Status Guard Violation: prefix format
  test('[P0] SKILL.md should use ❌ Status Guard Violation: prefix for all guard errors', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must use the standard error prefix for guard failures
    expect(content).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.3: SKILL.md create-ticket guard uses standard format
  test('[P0] SKILL.md create-ticket guard error should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // The create-ticket guard failure must use standard prefix
    const createTicketSection = content.match(/Create Ticket Command[\s\S]*?(?=###|\n## )/i);
    expect(createTicketSection).not.toBeNull();
    expect(createTicketSection![0]).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.4: SKILL.md refine-ticket guard uses standard format
  test('[P0] SKILL.md refine-ticket guard error should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const refineTicketSection = content.match(/Refine Ticket Command[\s\S]*?(?=###|\n## )/i);
    expect(refineTicketSection).not.toBeNull();
    expect(refineTicketSection![0]).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.5: SKILL.md refine-story guard uses standard format
  test('[P0] SKILL.md refine-story guard error should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const refineStorySection = content.match(/Refine Story Command[\s\S]*?(?=###|\n## )/i);
    expect(refineStorySection).not.toBeNull();
    expect(refineStorySection![0]).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.6: SKILL.md dev-story guard uses standard format (must accept ready-for-dev AND changes-needed)
  test('[P0] SKILL.md dev-story guard error should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const devStorySection = content.match(/Dev Story Command[\s\S]*?(?=###|\n## )/i);
    expect(devStorySection).not.toBeNull();
    expect(devStorySection![0]).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.7: SKILL.md dev-story guard preserves dual-status (ready-for-dev AND changes-needed)
  test('[P0] SKILL.md dev-story guard should accept both ready-for-dev and changes-needed', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const devStorySection = content.match(/Dev Story Command[\s\S]*?(?=###|\n## )/i);
    expect(devStorySection).not.toBeNull();
    // Must reference both statuses
    expect(devStorySection![0]).toMatch(/ready-for-dev/);
    expect(devStorySection![0]).toMatch(/changes-needed/);
  });

  // Test 1.8: SKILL.md review-story guard uses standard format
  test('[P0] SKILL.md review-story guard error should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const reviewStorySection = content.match(/Review Story Command[\s\S]*?(?=###|\n## )/i);
    expect(reviewStorySection).not.toBeNull();
    expect(reviewStorySection![0]).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.9: SKILL.md approval guard uses standard format
  test('[P0] SKILL.md approval guard error should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const approvalSection = content.match(/Approval Command[\s\S]*?(?=###|\n## |\n# )/i);
    expect(approvalSection).not.toBeNull();
    expect(approvalSection![0]).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.10: SKILL.md error format includes **Details:** in all guard failures
  test('[P0] SKILL.md guard errors should include **Details:** section', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // At least one **Details:** section must be present
    expect(content).toMatch(/\*\*Details:\*\*/);
    // Count occurrences — should have at least 6 (one per guard)
    const detailsCount = (content.match(/\*\*Details:\*\*/g) || []).length;
    expect(detailsCount).toBeGreaterThanOrEqual(6);
  });

  // Test 1.11: SKILL.md error format includes **Next Step:** in all guard failures
  test('[P0] SKILL.md guard errors should include **Next Step:** section', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // At least one **Next Step:** section must be present
    expect(content).toMatch(/\*\*Next Step:\*\*/);
    // Count occurrences — should have at least 6 (one per guard)
    const nextStepCount = (content.match(/\*\*Next Step:\*\*/g) || []).length;
    expect(nextStepCount).toBeGreaterThanOrEqual(6);
  });

  // Test 1.12: SKILL.md old error format (plain "Error:") is not used
  test('[P1] SKILL.md should NOT use plain Error: prefix for guard failures', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Old format should be gone
    expect(content).not.toMatch(/^Error: Story/m);
    expect(content).not.toMatch(/^Fix: /m);
  });
});

// ============================================================================
// AC1: Command files use Architecture-standard error format
// ============================================================================

describe('AC1: dev-story.md — standard error format in Guard Condition Enforcement', () => {
  // Test 1.13: dev-story.md exists
  test('[P0] commands/dev-story.md should exist', () => {
    expect(existsSync(DEV_STORY_CMD)).toBe(true);
  });

  // Test 1.14: dev-story.md Guard Condition Enforcement uses standard format
  test('[P0] commands/dev-story.md Guard Condition Enforcement should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.15: dev-story.md references both valid statuses
  test('[P0] commands/dev-story.md should reference both ready-for-dev and changes-needed as valid statuses', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    expect(content).toMatch(/ready-for-dev/);
    expect(content).toMatch(/changes-needed/);
  });
});

describe('AC1: approve.md — standard error format in Error Handling', () => {
  // Test 1.16: approve.md exists
  test('[P0] commands/approve.md should exist', () => {
    expect(existsSync(APPROVE_CMD)).toBe(true);
  });

  // Test 1.17: approve.md uses standard error format
  test('[P0] commands/approve.md Error Handling should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(APPROVE_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation:/);
  });
});

describe('AC1: review-story.md — standard error format', () => {
  // Test 1.18: review-story.md uses standard error format
  test('[P0] commands/review-story.md should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(REVIEW_STORY_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation:/);
  });
});

describe('AC1: refine-ticket.md, refine-story.md, create-ticket.md — standard error format', () => {
  // Test 1.19: refine-ticket.md uses standard error format
  test('[P0] commands/refine-ticket.md should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.20: refine-story.md uses standard error format
  test('[P0] commands/refine-story.md should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation:/);
  });

  // Test 1.21: create-ticket.md uses standard error format
  test('[P0] commands/create-ticket.md should use ❌ Status Guard Violation: format', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation:/);
  });
});
