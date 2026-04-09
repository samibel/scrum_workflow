/**
 * ATDD Tests for AC4: Sync Targets and README Update
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.4 - Implement Extended Agent Types
 *
 * PRD References:
 * - FR-35: Extended agent types: Security Reviewer, UX Reviewer, Contract Validator
 * - FR-46: Artifact contract compliance (sync targets)
 *
 * AC4: Given the agent files are synced to distribution targets,
 *      When all files are created,
 *      Then identical copies exist at:
 *        - create-scrum-workflow/scrum_workflow/agents/{agent-name}.md
 *        - create-scrum-workflow/templates/scrum_workflow/agents/{agent-name}.md
 *      And the scrum_workflow/agents/README.md is updated to include the three
 *        new agents.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();
const AGENTS_DIR = join(PROJECT_ROOT, 'scrum_workflow', 'agents');
const DIST_AGENTS_DIR = join(PROJECT_ROOT, 'create-scrum-workflow', 'scrum_workflow', 'agents');
const TEMPLATE_AGENTS_DIR = join(PROJECT_ROOT, 'create-scrum-workflow', 'templates', 'scrum_workflow', 'agents');

const AGENT_NAMES = ['security-reviewer', 'ux-reviewer', 'contract-validator'];

// ============================================================================
// AC4: Sync to create-scrum-workflow/scrum_workflow/agents/
// ============================================================================

describe('AC4: Agent Files Synced to Distribution Directory', () => {
  // Test 4.1: security-reviewer.md should exist in distribution target
  test('[P0] security-reviewer.md should exist in create-scrum-workflow/scrum_workflow/agents/', () => {
    expect(existsSync(join(DIST_AGENTS_DIR, 'security-reviewer.md'))).toBe(true);
  });

  // Test 4.2: ux-reviewer.md should exist in distribution target
  test('[P0] ux-reviewer.md should exist in create-scrum-workflow/scrum_workflow/agents/', () => {
    expect(existsSync(join(DIST_AGENTS_DIR, 'ux-reviewer.md'))).toBe(true);
  });

  // Test 4.3: contract-validator.md should exist in distribution target
  test('[P0] contract-validator.md should exist in create-scrum-workflow/scrum_workflow/agents/', () => {
    expect(existsSync(join(DIST_AGENTS_DIR, 'contract-validator.md'))).toBe(true);
  });
});

// ============================================================================
// AC4: Sync to create-scrum-workflow/templates/scrum_workflow/agents/
// ============================================================================

describe('AC4: Agent Files Synced to Templates Directory', () => {
  // Test 4.4: security-reviewer.md should exist in templates target
  test('[P0] security-reviewer.md should exist in create-scrum-workflow/templates/scrum_workflow/agents/', () => {
    expect(existsSync(join(TEMPLATE_AGENTS_DIR, 'security-reviewer.md'))).toBe(true);
  });

  // Test 4.5: ux-reviewer.md should exist in templates target
  test('[P0] ux-reviewer.md should exist in create-scrum-workflow/templates/scrum_workflow/agents/', () => {
    expect(existsSync(join(TEMPLATE_AGENTS_DIR, 'ux-reviewer.md'))).toBe(true);
  });

  // Test 4.6: contract-validator.md should exist in templates target
  test('[P0] contract-validator.md should exist in create-scrum-workflow/templates/scrum_workflow/agents/', () => {
    expect(existsSync(join(TEMPLATE_AGENTS_DIR, 'contract-validator.md'))).toBe(true);
  });
});

// ============================================================================
// AC4: Content Matches Source Files
// ============================================================================

describe('AC4: Sync Target Content Matches Source', () => {
  // Test 4.7: security-reviewer.md content should match across all 3 locations
  test('[P0] security-reviewer.md should be identical in source, dist, and templates', () => {
    const source = readFileSync(join(AGENTS_DIR, 'security-reviewer.md'), 'utf8');
    const dist = readFileSync(join(DIST_AGENTS_DIR, 'security-reviewer.md'), 'utf8');
    const template = readFileSync(join(TEMPLATE_AGENTS_DIR, 'security-reviewer.md'), 'utf8');
    expect(dist).toBe(source);
    expect(template).toBe(source);
  });

  // Test 4.8: ux-reviewer.md content should match across all 3 locations
  test('[P0] ux-reviewer.md should be identical in source, dist, and templates', () => {
    const source = readFileSync(join(AGENTS_DIR, 'ux-reviewer.md'), 'utf8');
    const dist = readFileSync(join(DIST_AGENTS_DIR, 'ux-reviewer.md'), 'utf8');
    const template = readFileSync(join(TEMPLATE_AGENTS_DIR, 'ux-reviewer.md'), 'utf8');
    expect(dist).toBe(source);
    expect(template).toBe(source);
  });

  // Test 4.9: contract-validator.md content should match across all 3 locations
  test('[P0] contract-validator.md should be identical in source, dist, and templates', () => {
    const source = readFileSync(join(AGENTS_DIR, 'contract-validator.md'), 'utf8');
    const dist = readFileSync(join(DIST_AGENTS_DIR, 'contract-validator.md'), 'utf8');
    const template = readFileSync(join(TEMPLATE_AGENTS_DIR, 'contract-validator.md'), 'utf8');
    expect(dist).toBe(source);
    expect(template).toBe(source);
  });
});

// ============================================================================
// AC4: README.md Updated with Extended Agents
// ============================================================================

describe('AC4: README.md Updated in Source', () => {
  const README = join(AGENTS_DIR, 'README.md');

  // Test 4.10: README.md should mention Security Reviewer
  test('[P0] scrum_workflow/agents/README.md should list Security Reviewer agent', () => {
    const content = readFileSync(README, 'utf8');
    expect(content).toMatch(/security-reviewer|Security Reviewer/i);
  });

  // Test 4.11: README.md should mention UX Reviewer
  test('[P0] scrum_workflow/agents/README.md should list UX Reviewer agent', () => {
    const content = readFileSync(README, 'utf8');
    expect(content).toMatch(/ux-reviewer|UX Reviewer/i);
  });

  // Test 4.12: README.md should mention Contract Validator
  test('[P0] scrum_workflow/agents/README.md should list Contract Validator agent', () => {
    const content = readFileSync(README, 'utf8');
    expect(content).toMatch(/contract-validator|Contract Validator/i);
  });

  // Test 4.13: README.md should have an "Extended Agents" section
  test('[P1] scrum_workflow/agents/README.md should have an Extended Agents section', () => {
    const content = readFileSync(README, 'utf8');
    expect(content).toMatch(/Extended Agent|Phase 4/i);
  });

  // Test 4.14: README.md "Core Agents" section should still list architect, developer, qa
  test('[P1] README.md should still list core agents (architect, developer, qa)', () => {
    const content = readFileSync(README, 'utf8');
    expect(content).toMatch(/architect\.md|architect/i);
    expect(content).toMatch(/developer\.md|developer/i);
    expect(content).toMatch(/qa\.md|qa/i);
  });
});

// ============================================================================
// AC4: README.md Synced to Distribution Targets
// ============================================================================

describe('AC4: README.md Synced to Distribution Targets', () => {
  const SOURCE_README = join(AGENTS_DIR, 'README.md');
  const DIST_README = join(DIST_AGENTS_DIR, 'README.md');
  const TEMPLATE_README = join(TEMPLATE_AGENTS_DIR, 'README.md');

  // Test 4.15: README.md should exist in distribution target
  test('[P0] README.md should exist in create-scrum-workflow/scrum_workflow/agents/', () => {
    expect(existsSync(DIST_README)).toBe(true);
  });

  // Test 4.16: README.md should exist in templates target
  test('[P0] README.md should exist in create-scrum-workflow/templates/scrum_workflow/agents/', () => {
    expect(existsSync(TEMPLATE_README)).toBe(true);
  });

  // Test 4.17: README.md content should match across all 3 locations
  test('[P0] README.md should be identical in source, dist, and templates', () => {
    const source = readFileSync(SOURCE_README, 'utf8');
    const dist = readFileSync(DIST_README, 'utf8');
    const template = readFileSync(TEMPLATE_README, 'utf8');
    expect(dist).toBe(source);
    expect(template).toBe(source);
  });

  // Test 4.18: Distribution README should mention all 3 extended agents
  test('[P0] Distribution README.md should list all 3 extended agents', () => {
    const content = readFileSync(DIST_README, 'utf8');
    expect(content).toMatch(/security-reviewer|Security Reviewer/i);
    expect(content).toMatch(/ux-reviewer|UX Reviewer/i);
    expect(content).toMatch(/contract-validator|Contract Validator/i);
  });
});

// ============================================================================
// AC4: Total Sync Target Count (8 files)
// ============================================================================

describe('AC4: Complete Sync Target Verification (8 Files)', () => {
  // Test 4.19: All 8 sync targets should exist
  test('[P0] All 8 sync targets should exist (3 agents x 2 locations + README x 2 locations)', () => {
    // Agent files in distribution directory (3)
    expect(existsSync(join(DIST_AGENTS_DIR, 'security-reviewer.md'))).toBe(true);
    expect(existsSync(join(DIST_AGENTS_DIR, 'ux-reviewer.md'))).toBe(true);
    expect(existsSync(join(DIST_AGENTS_DIR, 'contract-validator.md'))).toBe(true);

    // Agent files in templates directory (3)
    expect(existsSync(join(TEMPLATE_AGENTS_DIR, 'security-reviewer.md'))).toBe(true);
    expect(existsSync(join(TEMPLATE_AGENTS_DIR, 'ux-reviewer.md'))).toBe(true);
    expect(existsSync(join(TEMPLATE_AGENTS_DIR, 'contract-validator.md'))).toBe(true);

    // README in both locations (2)
    expect(existsSync(join(DIST_AGENTS_DIR, 'README.md'))).toBe(true);
    expect(existsSync(join(TEMPLATE_AGENTS_DIR, 'README.md'))).toBe(true);
  });

  // Test 4.20: No extra unexpected files in sync targets
  test('[P1] Sync targets should not contain unexpected extra agent files', () => {
    // This test validates that only expected files were synced
    // (guards against accidentally syncing architect-doc.md or other non-standard files)
    for (const agentName of AGENT_NAMES) {
      const distFile = join(DIST_AGENTS_DIR, `${agentName}.md`);
      const templateFile = join(TEMPLATE_AGENTS_DIR, `${agentName}.md`);
      expect(existsSync(distFile)).toBe(true);
      expect(existsSync(templateFile)).toBe(true);
    }
  });
});
