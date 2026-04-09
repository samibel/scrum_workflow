/**
 * ATDD Tests for AC4: Heavy Depth Behavior in refine-ticket
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.2 - Implement Adaptive Workflow Depth Selection
 *
 * PRD References:
 * - FR-33: Automatic workflow depth selection — heavy depth for high/critical risk
 *
 * AC1 (Heavy Depth): The system selects heavy for risk_level: high or critical,
 *      And the refine-ticket command supports heavy as a third depth option
 *      alongside light and standard.
 *
 * Heavy Depth Definition:
 * - 3 Agents (Architect, Developer, QA) — same as standard
 * - Cross-talk: max rounds, NO early exit on consensus
 * - Synthesis: Enabled
 * - Estimation: Wideband Delphi
 * - Security note: Mandatory note in refinement artifact
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REFINE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-ticket.md');
const STORY_TEMPLATE = join(process.cwd(), 'scrum_workflow', 'templates', 'story.md');

// ============================================================================
// AC4: refine-ticket.md Supports Heavy Depth
// ============================================================================

describe('AC4: refine-ticket.md Heavy Depth Support', () => {
  // Test 4.1: refine-ticket.md should include heavy in the depth table
  test('[P0] refine-ticket.md should include heavy depth in the depth comparison table', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    // The depth table should now have light, standard, AND heavy columns
    expect(content).toMatch(/heavy/i);
  });

  // Test 4.2: refine-ticket.md heavy depth should specify 3 agents
  test('[P0] refine-ticket.md heavy depth should use 3 agents (Architect, Developer, QA)', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    // Heavy depth should have 3 agents like standard
    expect(content).toMatch(/heavy[\s\S]*?3.*agent|heavy[\s\S]*?[Aa]rchitect.*[Dd]eveloper.*QA/i);
  });

  // Test 4.3: refine-ticket.md heavy depth should disable early exit on consensus
  test('[P0] refine-ticket.md heavy depth should disable early exit on consensus', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    // Heavy disables early_exit_on_consensus — all rounds must complete
    expect(content).toMatch(/heavy[\s\S]*?[Nn]o early exit|heavy[\s\S]*?max.*round|heavy[\s\S]*?all.*round/i);
  });

  // Test 4.4: refine-ticket.md heavy depth should enable cross-talk at max rounds
  test('[P0] refine-ticket.md heavy depth should enable cross-talk with max rounds', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    // Heavy should have cross-talk enabled at max rounds
    expect(content).toMatch(/heavy[\s\S]*?[Ee]nabled.*max.*round|heavy[\s\S]*?cross.*talk.*max/i);
  });

  // Test 4.5: refine-ticket.md heavy depth should enable synthesis
  test('[P1] refine-ticket.md heavy depth should have synthesis enabled', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    // Heavy should have synthesis enabled (same as standard)
    expect(content).toMatch(/heavy[\s\S]*?[Ss]ynthesis.*[Ee]nabled/i);
  });

  // Test 4.6: refine-ticket.md heavy depth should use Wideband Delphi estimation
  test('[P1] refine-ticket.md heavy depth should use Wideband Delphi estimation', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/heavy[\s\S]*?[Ww]ideband [Dd]elphi/i);
  });
});

// ============================================================================
// AC4: Mandatory Security Note for Heavy Depth
// ============================================================================

describe('AC4: Mandatory Security Note in Heavy Depth', () => {
  // Test 4.7: refine-ticket.md should specify mandatory security note for heavy depth
  test('[P0] refine-ticket.md heavy depth should require mandatory security consideration note', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/heavy[\s\S]*?[Mm]andatory.*security.*note|heavy[\s\S]*?security.*consider/i);
  });

  // Test 4.8: Security note should be added to refinement artifact
  test('[P1] refine-ticket.md should add security note to refinement artifact for heavy depth', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/security.*note.*refinement|refinement.*artifact.*security/i);
  });

  // Test 4.9: Security note should indicate this is a high-risk story
  test('[P1] Security note should remind reviewer this is a high-risk story', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/high.risk.*story|high.risk.*review/i);
  });
});

// ============================================================================
// AC4: Depth Detection Logic Updated
// ============================================================================

describe('AC4: Updated Depth Detection in refine-ticket', () => {
  // Test 4.10: refine-ticket.md should detect heavy depth from frontmatter
  test('[P0] refine-ticket.md depth detection should handle heavy value', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    // Detection logic should mention heavy as a valid depth
    expect(content).toMatch(/depth.*heavy|heavy.*depth/i);
  });

  // Test 4.11: refine-ticket.md should still default to standard if depth missing/invalid
  test('[P1] refine-ticket.md should default to standard when depth field is missing or invalid', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/missing.*standard|invalid.*standard|default.*standard/i);
  });

  // Test 4.12: refine-ticket.md frontmatter should list heavy in spawns_agents or features
  test('[P1] refine-ticket.md should reference heavy in workflow adaptation documentation', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    // Should have documentation about the three depth modes
    expect(content).toMatch(/light.*standard.*heavy|three.*depth|heavy.*depth/i);
  });
});

// ============================================================================
// AC4: refine-ticket.md Sync to create-scrum-workflow Copies
// ============================================================================

describe('AC4: refine-ticket.md Artifact Contract Sync', () => {
  const SYNC_TARGET_1 = join(process.cwd(), 'create-scrum-workflow', 'scrum_workflow', 'commands', 'refine-ticket.md');
  const SYNC_TARGET_2 = join(process.cwd(), 'create-scrum-workflow', 'templates', 'scrum_workflow', 'commands', 'refine-ticket.md');

  // Test 4.13: create-scrum-workflow/.../refine-ticket.md should have heavy depth
  test('[P0] create-scrum-workflow/scrum_workflow/commands/refine-ticket.md should have heavy depth', () => {
    const content = readFileSync(SYNC_TARGET_1, 'utf8');
    expect(content).toMatch(/heavy/i);
  });

  // Test 4.14: create-scrum-workflow/templates/.../refine-ticket.md should have heavy depth
  test('[P0] create-scrum-workflow/templates/.../refine-ticket.md should have heavy depth', () => {
    const content = readFileSync(SYNC_TARGET_2, 'utf8');
    expect(content).toMatch(/heavy/i);
  });
});

// ============================================================================
// AC4: Story Template Sync (depth and depth_source fields)
// ============================================================================

describe('AC4: Story Template Sync to create-scrum-workflow', () => {
  const SYNC_TEMPLATE = join(process.cwd(), 'create-scrum-workflow', 'templates', 'scrum_workflow', 'templates', 'story.md');

  // Test 4.15: synced story template should have depth field
  test('[P0] create-scrum-workflow/.../templates/story.md should have depth field', () => {
    const content = readFileSync(SYNC_TEMPLATE, 'utf8');
    expect(content).toMatch(/depth:/);
  });

  // Test 4.16: synced story template should have depth_source field
  test('[P0] create-scrum-workflow/.../templates/story.md should have depth_source field', () => {
    const content = readFileSync(SYNC_TEMPLATE, 'utf8');
    expect(content).toMatch(/depth_source:/);
  });
});
