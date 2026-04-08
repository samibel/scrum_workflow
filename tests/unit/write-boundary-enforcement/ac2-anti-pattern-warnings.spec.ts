/**
 * ATDD Tests for AC2: Anti-Pattern Warnings in Command Write Boundary Sections
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 3.3 - Implement Write Boundary Enforcement
 *
 * PRD References:
 * - FR-9: Write boundary enforcement per command
 *
 * AC2: Given the Markdown-as-Code paradigm where specifications are the enforcement mechanism
 *      When a command workflow is executed by an AI agent
 *      Then the workflow specification explicitly instructs the agent what it may and may not write
 *      And anti-patterns are documented in the specification:
 *        "implementation agent MUST NOT modify story.md"
 *        "review agent MUST NOT modify source code"
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
// AC2: dev-story.md — Spec Drift anti-pattern warning
// ============================================================================

describe('AC2: dev-story.md — Spec Drift anti-pattern warning', () => {
  // Test 2.1: dev-story.md contains "Spec Drift" anti-pattern name
  test.skip('[P0] commands/dev-story.md should mention "Spec Drift" anti-pattern', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    expect(content).toMatch(/Spec Drift/);
  });

  // Test 2.2: dev-story.md contains MUST NOT language for story.md modification
  test.skip('[P0] commands/dev-story.md should have MUST NOT language for story.md content modification', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    // Must explicitly instruct agent what NOT to do — Spec Drift prevention
    expect(content).toMatch(/MUST NOT.*story\.md|story\.md.*MUST NOT/i);
  });

  // Test 2.3: dev-story.md contains "Self-Fix" anti-pattern name
  test.skip('[P0] commands/dev-story.md should mention "Self-Fix" anti-pattern', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    expect(content).toMatch(/Self-Fix/);
  });

  // Test 2.4: dev-story.md MUST NOT validate its own work
  test.skip('[P1] commands/dev-story.md should warn that implementation agent MUST NOT validate its own work', () => {
    const content = readFileSync(DEV_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    // Self-Fix anti-pattern: agent validates own work
    expect(wbSection![0]).toMatch(/MUST NOT.*validat|validat.*MUST NOT/i);
  });
});

// ============================================================================
// AC2: review-story.md — Self-Fix anti-pattern warning
// ============================================================================

describe('AC2: review-story.md — Self-Fix anti-pattern warning', () => {
  // Test 2.5: review-story.md contains "Self-Fix" anti-pattern name
  test.skip('[P0] commands/review-story.md should mention "Self-Fix" anti-pattern', () => {
    const content = readFileSync(REVIEW_STORY_CMD, 'utf8');
    expect(content).toMatch(/Self-Fix/);
  });

  // Test 2.6: review-story.md contains MUST NOT modify source code language
  test.skip('[P0] commands/review-story.md should have MUST NOT modify source code language', () => {
    const content = readFileSync(REVIEW_STORY_CMD, 'utf8');
    // Must explicitly instruct review agent not to modify source code
    expect(content).toMatch(/MUST NOT.*source code|MUST NOT.*modify.*code|review.*MUST NOT.*code/i);
  });

  // Test 2.7: review-story.md write boundary section specifies read-only for code
  test.skip('[P0] commands/review-story.md Write Boundary should state review is read-only for code', () => {
    const content = readFileSync(REVIEW_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/[Rr]ead-only.*code|code.*[Rr]ead-only|review.*read-only/i);
  });
});

// ============================================================================
// AC2: approve.md — Bounded Authority Violation anti-pattern warning
// ============================================================================

describe('AC2: approve.md — Bounded Authority Violation anti-pattern warning', () => {
  // Test 2.8: approve.md contains "Bounded Authority Violation" anti-pattern name
  test.skip('[P0] commands/approve.md should mention "Bounded Authority Violation" anti-pattern', () => {
    const content = readFileSync(APPROVE_CMD, 'utf8');
    expect(content).toMatch(/Bounded Authority Violation/);
  });

  // Test 2.9: approve.md has MUST NOT language for refinement.md, plan.md, source code
  test.skip('[P0] commands/approve.md Write Boundary should have MUST NOT language for prohibited files', () => {
    const content = readFileSync(APPROVE_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    // Must have MUST NOT or explicit prohibition for at least one of these files
    expect(wbSection![0]).toMatch(/MUST NOT|prohibited|[Rr]ead-only/);
  });
});

// ============================================================================
// AC2: create-ticket.md — Status Guard Violation warning for overwriting
// ============================================================================

describe('AC2: create-ticket.md — Status Guard Violation for overwrite prevention', () => {
  // Test 2.10: create-ticket.md has MUST NOT overwrite existing story.md warning
  test.skip('[P0] commands/create-ticket.md should warn MUST NOT overwrite existing story.md', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    // Must explicitly tell agent not to overwrite existing story.md
    expect(wbSection![0]).toMatch(/MUST NOT.*overwrite|overwrite.*MUST NOT|halt.*exist/i);
  });

  // Test 2.11: create-ticket.md references halt behavior for existing story
  test.skip('[P0] commands/create-ticket.md Write Boundary should instruct to halt if story exists', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/halt|Halt|HALT/);
  });
});

// ============================================================================
// AC2: refine-ticket.md — MUST NOT modify story content anti-pattern warning
// ============================================================================

describe('AC2: refine-ticket.md — MUST NOT modify story content independently', () => {
  // Test 2.12: refine-ticket.md has MUST NOT modify story content beyond status
  test.skip('[P0] commands/refine-ticket.md should warn MUST NOT modify story content beyond status/synthesis', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/MUST NOT.*story|story.*MUST NOT/i);
  });

  // Test 2.13: refine-ticket.md warns plan.md belongs to refine-story
  test.skip('[P1] commands/refine-ticket.md Write Boundary should warn plan.md belongs to /scrum-refine-story', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    expect(wbSection![0]).toMatch(/plan\.md.*MUST NOT|MUST NOT.*plan\.md|plan\.md.*refine-story/i);
  });
});

// ============================================================================
// AC2: refine-story.md — anti-pattern warning for story content modification
// ============================================================================

describe('AC2: refine-story.md — anti-pattern warning', () => {
  // Test 2.14: refine-story.md warns MUST NOT modify story acceptance criteria
  test.skip('[P0] commands/refine-story.md should warn MUST NOT modify story acceptance criteria', () => {
    const content = readFileSync(REFINE_STORY_CMD, 'utf8');
    const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
    expect(wbSection).not.toBeNull();
    // Validation is read-only for story body — must not modify acceptance criteria
    expect(wbSection![0]).toMatch(/MUST NOT.*acceptance criteria|acceptance criteria.*MUST NOT|MUST NOT.*story content/i);
  });
});

// ============================================================================
// AC2: All 6 command files — have explicit MUST NOT instruction
// ============================================================================

describe('AC2: All command files — explicit MUST NOT anti-pattern instruction', () => {
  // Test 2.15: All 6 commands have at least one MUST NOT instruction in Write Boundary section
  test.skip('[P0] All 6 command files should have at least one MUST NOT instruction in Write Boundary Rules', () => {
    const commandFiles = [
      { name: 'create-ticket.md', path: CREATE_TICKET_CMD },
      { name: 'refine-ticket.md', path: REFINE_TICKET_CMD },
      { name: 'refine-story.md', path: REFINE_STORY_CMD },
      { name: 'dev-story.md', path: DEV_STORY_CMD },
      { name: 'review-story.md', path: REVIEW_STORY_CMD },
      { name: 'approve.md', path: APPROVE_CMD },
    ];

    for (const cmd of commandFiles) {
      const content = readFileSync(cmd.path, 'utf8');
      const wbSection = content.match(/## Write Boundary Rules[\s\S]*/);
      expect(wbSection, `${cmd.name} must have ## Write Boundary Rules section`).not.toBeNull();
      expect(wbSection![0], `${cmd.name} must have MUST NOT instruction in Write Boundary Rules`).toMatch(/MUST NOT/);
    }
  });
});
