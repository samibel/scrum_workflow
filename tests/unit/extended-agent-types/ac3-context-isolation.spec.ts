/**
 * ATDD Tests for AC3: Context Isolation per Agent
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.4 - Implement Extended Agent Types
 *
 * PRD References:
 * - FR-35: Extended agent types: Security Reviewer, UX Reviewer, Contract Validator
 * - FR-12: Refinement agents with isolated context
 * - Architecture Pattern 8: Context isolation per agent type
 *
 * AC3: Given the context isolation rules from Architecture (Pattern 8),
 *      When extended agents are spawned during refinement,
 *      Then each agent receives only its relevant context:
 *        - Security Reviewer: story.md + relevant code + security-related risk notes
 *          + context/architecture.md
 *        - UX Reviewer: story.md + relevant code + UX design requirements
 *          + context/frontend.md
 *        - Contract Validator: story.md + plan.md + implementation code
 *          + context/standards.md
 *      And no agent receives other agent definitions or other agents' perspectives
 *        (until cross-talk phase).
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const AGENTS_DIR = join(process.cwd(), 'scrum_workflow', 'agents');
const SECURITY_REVIEWER = join(AGENTS_DIR, 'security-reviewer.md');
const UX_REVIEWER = join(AGENTS_DIR, 'ux-reviewer.md');
const CONTRACT_VALIDATOR = join(AGENTS_DIR, 'contract-validator.md');

// ============================================================================
// AC3: Security Reviewer Context Rules
// ============================================================================

describe('AC3: Security Reviewer Context Isolation', () => {
  // Test 3.1: Security Reviewer should load story.md
  test('[P0] security-reviewer.md Context Rules should load story.md', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/story\.md/);
  });

  // Test 3.2: Security Reviewer should load context/architecture.md
  test('[P0] security-reviewer.md Context Rules should load context/architecture.md', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/context\/architecture\.md/);
  });

  // Test 3.3: Security Reviewer should load context/standards.md
  test('[P0] security-reviewer.md Context Rules should load context/standards.md', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/context\/standards\.md/);
  });

  // Test 3.4: Security Reviewer should load context/index.md
  test('[P1] security-reviewer.md Context Rules should load context/index.md', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/context\/index\.md/);
  });

  // Test 3.5: Security Reviewer should reference security-related risk notes
  test('[P0] security-reviewer.md Context Rules should reference security-related risk notes', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/risk|_scrum-output\/memory\/risks/i);
  });

  // Test 3.6: Security Reviewer should NOT reference context/frontend.md
  test('[P0] security-reviewer.md Context Rules should NOT load context/frontend.md', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).not.toMatch(/context\/frontend\.md/);
  });

  // Test 3.7: Security Reviewer should NOT reference plan.md specifically
  test('[P1] security-reviewer.md Context Rules should NOT specifically load plan.md', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    // Should not have plan.md as a primary context item (that's for contract-validator)
    expect(contextSection![0]).not.toMatch(/^\s*\d+\.\s*`plan\.md`/m);
  });
});

// ============================================================================
// AC3: UX Reviewer Context Rules
// ============================================================================

describe('AC3: UX Reviewer Context Isolation', () => {
  // Test 3.8: UX Reviewer should load story.md
  test('[P0] ux-reviewer.md Context Rules should load story.md', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/story\.md/);
  });

  // Test 3.9: UX Reviewer should load context/frontend.md
  test('[P0] ux-reviewer.md Context Rules should load context/frontend.md', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/context\/frontend\.md/);
  });

  // Test 3.10: UX Reviewer should load context/standards.md
  test('[P0] ux-reviewer.md Context Rules should load context/standards.md', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/context\/standards\.md/);
  });

  // Test 3.11: UX Reviewer should load context/index.md
  test('[P1] ux-reviewer.md Context Rules should load context/index.md', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/context\/index\.md/);
  });

  // Test 3.12: UX Reviewer should reference UX design specification
  test('[P1] ux-reviewer.md Context Rules should reference UX design specification', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/ux.*design|design.*spec/i);
  });

  // Test 3.13: UX Reviewer should NOT reference context/architecture.md
  test('[P0] ux-reviewer.md Context Rules should NOT load context/architecture.md', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).not.toMatch(/context\/architecture\.md/);
  });

  // Test 3.14: UX Reviewer should NOT reference risk notes directory
  test('[P1] ux-reviewer.md Context Rules should NOT load _scrum-output/memory/risks/', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).not.toMatch(/_scrum-output\/memory\/risks/);
  });
});

// ============================================================================
// AC3: Contract Validator Context Rules
// ============================================================================

describe('AC3: Contract Validator Context Isolation', () => {
  // Test 3.15: Contract Validator should load story.md
  test('[P0] contract-validator.md Context Rules should load story.md', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/story\.md/);
  });

  // Test 3.16: Contract Validator should load plan.md
  test('[P0] contract-validator.md Context Rules should load plan.md', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/plan\.md/);
  });

  // Test 3.17: Contract Validator should load context/standards.md
  test('[P0] contract-validator.md Context Rules should load context/standards.md', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/context\/standards\.md/);
  });

  // Test 3.18: Contract Validator should load context/index.md
  test('[P1] contract-validator.md Context Rules should load context/index.md', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/context\/index\.md/);
  });

  // Test 3.19: Contract Validator should reference implementation source code
  test('[P0] contract-validator.md Context Rules should reference implementation source code', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).toMatch(/implementation.*source|source.*code|implementation.*code/i);
  });

  // Test 3.20: Contract Validator should NOT reference context/frontend.md
  test('[P0] contract-validator.md Context Rules should NOT load context/frontend.md', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).not.toMatch(/context\/frontend\.md/);
  });

  // Test 3.21: Contract Validator should NOT reference risk notes
  test('[P1] contract-validator.md Context Rules should NOT load _scrum-output/memory/risks/', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    const contextSection = content.match(/# Context Rules[\s\S]*/);
    expect(contextSection).not.toBeNull();
    expect(contextSection![0]).not.toMatch(/_scrum-output\/memory\/risks/);
  });
});

// ============================================================================
// AC3: No Cross-Agent References
// ============================================================================

describe('AC3: No Cross-Agent References in Context Rules', () => {
  // Test 3.22: Security Reviewer should not reference other agent definitions
  test('[P0] security-reviewer.md should not reference other agent definition files', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    // Should not reference ux-reviewer.md or contract-validator.md
    expect(content).not.toMatch(/ux-reviewer\.md/);
    expect(content).not.toMatch(/contract-validator\.md/);
    // Should not reference agents/ directory as a context source
    expect(content).not.toMatch(/load.*agents\/|context.*agents\//i);
  });

  // Test 3.23: UX Reviewer should not reference other agent definitions
  test('[P0] ux-reviewer.md should not reference other agent definition files', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).not.toMatch(/security-reviewer\.md/);
    expect(content).not.toMatch(/contract-validator\.md/);
    expect(content).not.toMatch(/load.*agents\/|context.*agents\//i);
  });

  // Test 3.24: Contract Validator should not reference other agent definitions
  test('[P0] contract-validator.md should not reference other agent definition files', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).not.toMatch(/security-reviewer\.md/);
    expect(content).not.toMatch(/ux-reviewer\.md/);
    expect(content).not.toMatch(/load.*agents\/|context.*agents\//i);
  });

  // Test 3.25: No agent should reference other agents' perspectives
  test('[P0] No extended agent should reference other agents\' perspectives', () => {
    for (const agentPath of [SECURITY_REVIEWER, UX_REVIEWER, CONTRACT_VALIDATOR]) {
      const content = readFileSync(agentPath, 'utf8');
      // No agent should mention loading other agents' perspective outputs
      expect(content).not.toMatch(/other.*agent.*perspective|load.*perspective.*from/i);
    }
  });
});
