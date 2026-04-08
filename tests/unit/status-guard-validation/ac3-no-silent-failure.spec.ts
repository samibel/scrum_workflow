/**
 * ATDD Tests for AC3: No Silent Inconsistent State (FR-11)
 *
 * TDD Phase: RED (tests will fail until implementation is complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 3.2 - Implement Status Guard Validation (FR-8, FR-10, FR-11)
 *
 * PRD References:
 * - FR-11: No silent inconsistent state — any error during status validation must produce an
 *           actionable error message, and no command must leave the story in an inconsistent state
 *
 * AC3: Given FR-11 specifies no silent inconsistent state
 *      When any error occurs during status validation
 *      Then an actionable error message is produced with:
 *        what was attempted, what failed, and the suggested next step
 *      And no command leaves the story in an inconsistent state
 *        (status field and status_history always agree after command execution)
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

// create-scrum-workflow/ sync copy paths
const SYNC_DEV_STORY_CMD = join(
  process.cwd(),
  'create-scrum-workflow',
  'scrum_workflow',
  'commands',
  'dev-story.md',
);
const SYNC_REVIEW_STORY_CMD = join(
  process.cwd(),
  'create-scrum-workflow',
  'scrum_workflow',
  'commands',
  'review-story.md',
);
const SYNC_REFINE_TICKET_CMD = join(
  process.cwd(),
  'create-scrum-workflow',
  'scrum_workflow',
  'commands',
  'refine-ticket.md',
);
const SYNC_REFINE_STORY_CMD = join(
  process.cwd(),
  'create-scrum-workflow',
  'scrum_workflow',
  'commands',
  'refine-story.md',
);

// ============================================================================
// AC3: SKILL.md documents no-silent-failure policy
// ============================================================================

describe('AC3: SKILL.md — No silent failure policy', () => {
  // Test 3.1: SKILL.md exists
  test('[P0] status-guard-validation/SKILL.md should exist', () => {
    expect(existsSync(SKILL_FILE)).toBe(true);
  });

  // Test 3.2: All 6 guard failures produce error with Details + Next Step (not silent)
  test('[P0] SKILL.md should include **Details:** in every guard failure (no silent failures)', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const detailsCount = (content.match(/\*\*Details:\*\*/g) || []).length;
    // All 6 command guards must have **Details:** section
    expect(detailsCount).toBeGreaterThanOrEqual(6);
  });

  // Test 3.3: All 6 guard failures include **Next Step:** (actionable)
  test('[P0] SKILL.md should include **Next Step:** in every guard failure (actionable messages)', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    const nextStepCount = (content.match(/\*\*Next Step:\*\*/g) || []).length;
    // All 6 command guards must have **Next Step:** section
    expect(nextStepCount).toBeGreaterThanOrEqual(6);
  });

  // Test 3.4: SKILL.md references atomic write / guard-before-write policy
  test('[P0] SKILL.md should state that guard checks occur BEFORE any file writes', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must indicate that guard runs before write / file changes
    expect(content).toMatch(/before.*write|guard.*before|atomic|no.*write|halt.*before/i);
  });

  // Test 3.5: SKILL.md states no silent errors policy
  test('[P0] SKILL.md should state that no command leaves story in inconsistent state', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must have language about no silent failure / consistent state
    expect(content).toMatch(
      /no silent|actionable|inconsistent state|status.*history.*agree|consistent|always agree/i,
    );
  });

  // Test 3.6: Each error message references what was attempted (command / action)
  test('[P0] SKILL.md guard errors should reference the command that was attempted', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // At least one error format must reference the specific command (e.g., /scrum-dev-story)
    expect(content).toMatch(/\/scrum-\w+/);
  });

  // Test 3.7: Each error message references what failed (current vs required status)
  test('[P0] SKILL.md guard errors should identify what failed: current status vs required status', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Error must mention current status and required status
    expect(content).toMatch(/current.*status|required.*status/i);
    // Should reference both in context of failure
    expect(content).toMatch(/currently.*but.*requires|requires.*currently/i);
  });

  // Test 3.8: Skill is read-only — never writes files (so cannot introduce inconsistency)
  test('[P0] SKILL.md should declare the skill never writes files (read-only validation)', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Must state that this skill is read-only / never writes
    expect(content).toMatch(/never writes|read.only|does not write|no writes|Writes[\s\S]*?never/i);
  });
});

// ============================================================================
// AC3: Command files produce actionable errors (not silent failures)
// ============================================================================

describe('AC3: Command files — actionable error messages with Next Step', () => {
  // Test 3.9: dev-story.md includes **Next Step:** or equivalent actionable guidance
  test('[P0] commands/dev-story.md guard error should include actionable next step', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    expect(content).toMatch(/\*\*Next Step:\*\*|next step|run.*\/scrum-/i);
  });

  // Test 3.10: approve.md includes actionable next step in error handling
  test('[P0] commands/approve.md error handling should include actionable next step', () => {
    const content = readFileSync(APPROVE_CMD, 'utf8');
    expect(content).toMatch(/\*\*Next Step:\*\*|next step|run.*\/scrum-/i);
  });

  // Test 3.11: review-story.md includes actionable next step
  test('[P0] commands/review-story.md guard error should include actionable next step', () => {
    const content = readFileSync(REVIEW_STORY_CMD, 'utf8');
    expect(content).toMatch(/\*\*Next Step:\*\*|next step|run.*\/scrum-/i);
  });

  // Test 3.12: refine-ticket.md includes actionable next step
  test('[P0] commands/refine-ticket.md guard error should include actionable next step', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/\*\*Next Step:\*\*|next step|run.*\/scrum-/i);
  });

  // Test 3.13: refine-story.md includes actionable next step
  test('[P0] commands/refine-story.md guard error should include actionable next step', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    expect(content).toMatch(/\*\*Next Step:\*\*|next step|run.*\/scrum-/i);
  });

  // Test 3.14: create-ticket.md includes actionable next step
  test('[P0] commands/create-ticket.md guard error should include actionable next step', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/\*\*Next Step:\*\*|next step|run.*\/scrum-/i);
  });
});

// ============================================================================
// AC3: No old-style "Error:" prefix / silent plain errors remain
// ============================================================================

describe('AC3: SKILL.md and command files — old silent error format eliminated', () => {
  // Test 3.15: SKILL.md does not use plain "Error:" prefix for guard failures
  test('[P1] SKILL.md should NOT use plain "Error:" prefix for guard failures', () => {
    const content = readFileSync(SKILL_FILE, 'utf8');
    // Old pattern that was silent (just text, no actionable structure)
    expect(content).not.toMatch(/^Error: Story/m);
    expect(content).not.toMatch(/^Fix: /m);
  });

  // Test 3.16: dev-story.md does not use old silent Error: prefix for guard condition
  test('[P1] commands/dev-story.md should NOT use plain "Error:" prefix for guard violations', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Should not have old-style Error: without the ❌ prefix
    const guardSection = content.match(/Guard Condition[\s\S]*?(?=\n## |\n# |$)/i);
    if (guardSection) {
      expect(guardSection[0]).not.toMatch(/^Error:/m);
    }
  });
});

// ============================================================================
// AC3: Sync-copy verification — primary and create-scrum-workflow/ copies match
// ============================================================================

describe('AC3: Sync-copy verification — create-scrum-workflow/ copies match primary error format', () => {
  // Test 3.17: create-scrum-workflow/dev-story.md uses ❌ Status Guard Violation: format
  test('[P0] create-scrum-workflow/commands/dev-story.md should use ❌ Status Guard Violation: format', () => {
    const primary = readFileSync(DEV_STORY_CMD, 'utf8');
    const sync = readFileSync(SYNC_DEV_STORY_CMD, 'utf8');
    // Both must contain the standard error prefix
    expect(primary).toMatch(/❌ Status Guard Violation:/);
    expect(sync).toMatch(/❌ Status Guard Violation:/);
    // Both must contain **Details:** and **Next Step:**
    expect(sync).toMatch(/\*\*Details:\*\*/);
    expect(sync).toMatch(/\*\*Next Step:\*\*/);
  });

  // Test 3.18: create-scrum-workflow/review-story.md uses ❌ Status Guard Violation: format
  test('[P0] create-scrum-workflow/commands/review-story.md should use ❌ Status Guard Violation: format', () => {
    const primary = readFileSync(REVIEW_STORY_CMD, 'utf8');
    const sync = readFileSync(SYNC_REVIEW_STORY_CMD, 'utf8');
    expect(primary).toMatch(/❌ Status Guard Violation:/);
    expect(sync).toMatch(/❌ Status Guard Violation:/);
    expect(sync).toMatch(/\*\*Details:\*\*/);
    expect(sync).toMatch(/\*\*Next Step:\*\*/);
  });

  // Test 3.19: create-scrum-workflow/refine-ticket.md uses ❌ Status Guard Violation: format
  test('[P0] create-scrum-workflow/commands/refine-ticket.md should use ❌ Status Guard Violation: format', () => {
    const primary = readFileSync(REFINE_TICKET_CMD, 'utf8');
    const sync = readFileSync(SYNC_REFINE_TICKET_CMD, 'utf8');
    expect(primary).toMatch(/❌ Status Guard Violation:/);
    expect(sync).toMatch(/❌ Status Guard Violation:/);
    expect(sync).toMatch(/\*\*Details:\*\*/);
    expect(sync).toMatch(/\*\*Next Step:\*\*/);
  });

  // Test 3.20: create-scrum-workflow/refine-story.md uses ❌ Status Guard Violation: format
  test('[P0] create-scrum-workflow/commands/refine-story.md should use ❌ Status Guard Violation: format', () => {
    const primary = readFileSync(REFINE_STORY_CMD, 'utf8');
    const sync = readFileSync(SYNC_REFINE_STORY_CMD, 'utf8');
    expect(primary).toMatch(/❌ Status Guard Violation:/);
    expect(sync).toMatch(/❌ Status Guard Violation:/);
    expect(sync).toMatch(/\*\*Details:\*\*/);
    expect(sync).toMatch(/\*\*Next Step:\*\*/);
  });
});

// ============================================================================
// AC3: create-scrum-workflow/ sync copies contain standard error format strings
// ============================================================================

describe('AC3: create-scrum-workflow/ sync copies — standard error format present', () => {
  // Test 3.21: create-scrum-workflow/dev-story.md Story File Not Found block present
  test('[P0] create-scrum-workflow/commands/dev-story.md should contain Story File Not Found error block', () => {
    const content = readFileSync(SYNC_DEV_STORY_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation: Story file.*not found/);
    expect(content).toMatch(/\*\*Details:\*\*/);
    expect(content).toMatch(/\*\*Next Step:\*\*/);
  });

  // Test 3.22: create-scrum-workflow/review-story.md Story File Not Found block present
  test('[P0] create-scrum-workflow/commands/review-story.md should contain Story File Not Found error block', () => {
    const content = readFileSync(SYNC_REVIEW_STORY_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation: Story file.*not found/);
    expect(content).toMatch(/\*\*Details:\*\*/);
    expect(content).toMatch(/\*\*Next Step:\*\*/);
  });

  // Test 3.23: create-scrum-workflow/refine-ticket.md Story File Not Found block present
  test('[P0] create-scrum-workflow/commands/refine-ticket.md should contain Story File Not Found error block', () => {
    const content = readFileSync(SYNC_REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation: Story file.*not found/);
    expect(content).toMatch(/\*\*Details:\*\*/);
    expect(content).toMatch(/\*\*Next Step:\*\*/);
  });

  // Test 3.24: create-scrum-workflow/refine-story.md Story File Not Found block present
  test('[P0] create-scrum-workflow/commands/refine-story.md should contain Story File Not Found error block', () => {
    const content = readFileSync(SYNC_REFINE_STORY_CMD, 'utf8');
    expect(content).toMatch(/❌ Status Guard Violation: Story file.*not found/);
    expect(content).toMatch(/\*\*Details:\*\*/);
    expect(content).toMatch(/\*\*Next Step:\*\*/);
  });
});
