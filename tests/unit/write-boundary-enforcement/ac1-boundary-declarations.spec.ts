/**
 * ATDD Tests for AC1: Write Boundary Declarations in All 6 Command Files
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 3.3 - Implement Write Boundary Enforcement
 *
 * PRD References:
 * - FR-9: Write boundary enforcement per command
 *
 * AC1: Given FR-9 specifies write boundaries per command as defined in the Architecture
 *      When each command's workflow specification is reviewed
 *      Then every command explicitly declares its write boundary:
 *        /scrum-create-ticket may write story.md only
 *        /scrum-refine-ticket may write refinement.md only
 *        /scrum-refine-story may write plan.md and status in story.md only
 *        /scrum-dev-story may write source code and test files only
 *        /scrum-review-story may write review-N.md only
 *        /scrum-approve may write approval-N.md and status in story.md only
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CREATE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');
const REFINE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-ticket.md');
const REFINE_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-story.md');
const DEV_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'dev-story.md');
const REVIEW_STORY_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'review-story.md');
const APPROVE_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'approve.md');

// ============================================================================
// AC1: create-ticket.md — Write Boundary Rules section
// ============================================================================

describe('AC1: create-ticket.md — Write Boundary Rules section', () => {
  // Test 1.1: create-ticket.md exists
  test.skip('[P0] commands/create-ticket.md should exist', () => {
    expect(existsSync(CREATE_TICKET_CMD)).toBe(true);
  });

  // Test 1.2: create-ticket.md has ## Write Boundary Rules section
  test.skip('[P0] commands/create-ticket.md should have ## Write Boundary Rules section', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/## Write Boundary Rules/);
  });

  // Test 1.3: create-ticket.md declares "may write" list
  test.skip('[P0] commands/create-ticket.md should declare "This workflow may write"', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/This workflow may write/);
  });

  // Test 1.4: create-ticket.md declares "may NOT write" list
  test.skip('[P0] commands/create-ticket.md should declare "This workflow may NOT write"', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/This workflow may NOT write/);
  });

  // Test 1.5: create-ticket.md specifies story.md as allowed write target
  test.skip('[P0] commands/create-ticket.md Write Boundary should specify story.md as allowed write', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/story\.md/);
  });

  // Test 1.6: create-ticket.md specifies status: draft as the only allowed write
  test.skip('[P1] commands/create-ticket.md Write Boundary should reference status: draft', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/draft/);
  });

  // Test 1.7: create-ticket.md prohibits writing to other artifact files
  test.skip('[P0] commands/create-ticket.md Write Boundary should prohibit refinement.md, plan.md', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    // Must explicitly prohibit other lifecycle artifacts
    expect(wbSection![0]).toMatch(/refinement\.md|plan\.md/);
  });
});

// ============================================================================
// AC1: refine-ticket.md — Write Boundary Rules section
// ============================================================================

describe('AC1: refine-ticket.md — Write Boundary Rules section', () => {
  // Test 1.8: refine-ticket.md has ## Write Boundary Rules section
  test.skip('[P0] commands/refine-ticket.md should have ## Write Boundary Rules section', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/## Write Boundary Rules/);
  });

  // Test 1.9: refine-ticket.md declares "may write" list
  test.skip('[P0] commands/refine-ticket.md should declare "This workflow may write"', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/This workflow may write/);
  });

  // Test 1.10: refine-ticket.md declares "may NOT write" list
  test.skip('[P0] commands/refine-ticket.md should declare "This workflow may NOT write"', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/This workflow may NOT write/);
  });

  // Test 1.11: refine-ticket.md specifies refinement.md as allowed write target
  test.skip('[P0] commands/refine-ticket.md Write Boundary should allow writing refinement.md', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/refinement\.md/);
  });

  // Test 1.12: refine-ticket.md specifies story.md is allowed only for status and synthesis
  test.skip('[P1] commands/refine-ticket.md Write Boundary should allow story.md for status/synthesis', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/story\.md/);
  });

  // Test 1.13: refine-ticket.md prohibits plan.md
  test.skip('[P0] commands/refine-ticket.md Write Boundary should prohibit plan.md', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/plan\.md/);
  });
});

// ============================================================================
// AC1: refine-story.md — Write Boundary Rules section (fix existing bug)
// ============================================================================

describe('AC1: refine-story.md — Write Boundary Rules section (bug fix)', () => {
  // Test 1.14: refine-story.md has ## Write Boundary Rules section
  test.skip('[P0] commands/refine-story.md should have ## Write Boundary Rules section', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    expect(content).toMatch(/## Write Boundary Rules/);
  });

  // Test 1.15: refine-story.md "may write" list includes plan.md (bug fix — plan.md was incorrectly in may NOT write)
  test.skip('[P0] commands/refine-story.md Write Boundary "may write" should include plan.md (bug fix)', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    // plan.md must appear in the "may write" section (positive declaration)
    const mayWriteSection = wbSection![0].match(/This workflow may write[\s\S]*?This workflow may NOT write/);
    expect(mayWriteSection).not.toBeNull();
    expect(mayWriteSection![0]).toMatch(/plan\.md/);
  });

  // Test 1.16: refine-story.md "may NOT write" does NOT list plan.md as prohibited (bug fix)
  test.skip('[P0] commands/refine-story.md Write Boundary "may NOT write" should NOT include plan.md', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    // Find the "may NOT write" section specifically
    const mayNotWriteSection = wbSection![0].match(/This workflow may NOT write[\s\S]*/);
    expect(mayNotWriteSection).not.toBeNull();
    // plan.md should NOT appear in the prohibited list
    expect(mayNotWriteSection![0]).not.toMatch(/- `[^`]*plan\.md[^`]*` - Managed by/);
  });

  // Test 1.17: refine-story.md declares "may write" list
  test.skip('[P0] commands/refine-story.md should declare "This workflow may write"', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    expect(content).toMatch(/This workflow may write/);
  });

  // Test 1.18: refine-story.md declares "may NOT write" list
  test.skip('[P0] commands/refine-story.md should declare "This workflow may NOT write"', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    expect(content).toMatch(/This workflow may NOT write/);
  });
});

// ============================================================================
// AC1: dev-story.md — Write Boundary Rules section
// ============================================================================

describe('AC1: dev-story.md — Write Boundary Rules section', () => {
  // Test 1.19: dev-story.md has ## Write Boundary Rules section
  test.skip('[P0] commands/dev-story.md should have ## Write Boundary Rules section', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    expect(content).toMatch(/## Write Boundary Rules/);
  });

  // Test 1.20: dev-story.md declares "may write" list
  test.skip('[P0] commands/dev-story.md should declare "This workflow may write"', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    expect(content).toMatch(/This workflow may write/);
  });

  // Test 1.21: dev-story.md declares "may NOT write" list
  test.skip('[P0] commands/dev-story.md should declare "This workflow may NOT write"', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    expect(content).toMatch(/This workflow may NOT write/);
  });

  // Test 1.22: dev-story.md "may write" includes source code and test files
  test.skip('[P0] commands/dev-story.md Write Boundary should allow source code and test files', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    // Must reference source code or test files as allowed writes
    expect(wbSection![0]).toMatch(/source code|test files/i);
  });

  // Test 1.23: dev-story.md "may write" includes story.md for status field only
  test.skip('[P0] commands/dev-story.md Write Boundary should allow story.md for status field only', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/story\.md/);
    // Must reference status only (not free-form writes)
    expect(wbSection![0]).toMatch(/status/);
  });

  // Test 1.24: dev-story.md "may NOT write" prohibits plan.md, refinement.md
  test.skip('[P0] commands/dev-story.md Write Boundary should prohibit plan.md and refinement.md', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/plan\.md/);
    expect(wbSection![0]).toMatch(/refinement\.md/);
  });
});

// ============================================================================
// AC1: review-story.md — Write Boundary Rules section (verify existing)
// ============================================================================

describe('AC1: review-story.md — Write Boundary Rules section', () => {
  // Test 1.25: review-story.md has ## Write Boundary Rules section
  test.skip('[P0] commands/review-story.md should have ## Write Boundary Rules section', () => {
    const content = readFileSync(REVIEW_STORY_CMD, 'utf8');
    expect(content).toMatch(/## Write Boundary Rules/);
  });

  // Test 1.26: review-story.md declares "may write" and "may NOT write"
  test.skip('[P0] commands/review-story.md should declare may write and may NOT write lists', () => {
    const content = readFileSync(REVIEW_STORY_CMD, 'utf8');
    expect(content).toMatch(/This workflow may write/);
    expect(content).toMatch(/This workflow may NOT write/);
  });

  // Test 1.27: review-story.md specifies review-N.md as allowed write
  test.skip('[P0] commands/review-story.md Write Boundary should allow review-N.md', () => {
    const content = readFileSync(REVIEW_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/review-N\.md|review-\*\.md/);
  });

  // Test 1.28: review-story.md prohibits source code writes
  test.skip('[P0] commands/review-story.md Write Boundary should prohibit source code writes', () => {
    const content = readFileSync(REVIEW_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/[Cc]ode files|source code/i);
  });
});

// ============================================================================
// AC1: approve.md — Write Boundary Rules section (verify existing)
// ============================================================================

describe('AC1: approve.md — Write Boundary Rules section', () => {
  // Test 1.29: approve.md has ## Write Boundary Rules section
  test.skip('[P0] commands/approve.md should have ## Write Boundary Rules section', () => {
    const content = readFileSync(APPROVE_CMD, 'utf8');
    expect(content).toMatch(/## Write Boundary Rules/);
  });

  // Test 1.30: approve.md declares "may write" and "may NOT write"
  test.skip('[P0] commands/approve.md should declare may write and may NOT write lists', () => {
    const content = readFileSync(APPROVE_CMD, 'utf8');
    expect(content).toMatch(/This workflow may write/);
    expect(content).toMatch(/This workflow may NOT write/);
  });

  // Test 1.31: approve.md specifies approval-N.md as allowed write
  test.skip('[P0] commands/approve.md Write Boundary should allow approval-N.md', () => {
    const content = readFileSync(APPROVE_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/approval-N\.md|approval-\*\.md/);
  });

  // Test 1.32: approve.md specifies story.md status update as allowed write
  test.skip('[P0] commands/approve.md Write Boundary should allow story.md status update', () => {
    const content = readFileSync(APPROVE_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/story\.md/);
    expect(wbSection![0]).toMatch(/status/);
  });
});
