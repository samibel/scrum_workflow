/**
 * ATDD Tests for AC2: Runtime Discovery and Dispatcher Integration
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.4 - Implement Extended Agent Types
 *
 * PRD References:
 * - FR-35: Extended agent types: Security Reviewer, UX Reviewer, Contract Validator
 * - FR-44: Runtime file-based extension model (agents discovered by file existence)
 * - NFR-11: No registration, build step, or restart required
 *
 * AC2: Given the agents follow the Markdown-as-Code paradigm (AD-001),
 *      When agent files are placed in scrum_workflow/agents/,
 *      Then the framework discovers them at runtime (FR-44, NFR-11)
 *        without registration, build step, or restart,
 *      And the dynamic dispatcher (Story 9.3) can select them based on story
 *        attributes (risk level and domain tags),
 *      And the dispatcher no longer logs "agent not available — skipped"
 *        for these three agents.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const AGENTS_DIR = join(process.cwd(), 'scrum_workflow', 'agents');
const SECURITY_REVIEWER = join(AGENTS_DIR, 'security-reviewer.md');
const UX_REVIEWER = join(AGENTS_DIR, 'ux-reviewer.md');
const CONTRACT_VALIDATOR = join(AGENTS_DIR, 'contract-validator.md');
const DISPATCH_RULES = join(process.cwd(), 'scrum_workflow', 'data', 'dispatch-rules.yaml');
const DISPATCHER_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'agent-dispatcher', 'SKILL.md');

// ============================================================================
// AC2: Flat File Discovery Pattern
// ============================================================================

describe('AC2: Agent Files Use Flat File Pattern', () => {
  // Test 2.1: security-reviewer.md should be a flat file (not in subdirectory)
  test('[P0] security-reviewer.md should be a flat file in agents/ (not a subdirectory)', () => {
    // File should exist as flat file: scrum_workflow/agents/security-reviewer.md
    expect(existsSync(SECURITY_REVIEWER)).toBe(true);
    // Should NOT exist as subdirectory pattern: scrum_workflow/agents/security-reviewer/agent.md
    const subdirPath = join(AGENTS_DIR, 'security-reviewer', 'agent.md');
    expect(existsSync(subdirPath)).toBe(false);
  });

  // Test 2.2: ux-reviewer.md should be a flat file (not in subdirectory)
  test('[P0] ux-reviewer.md should be a flat file in agents/ (not a subdirectory)', () => {
    expect(existsSync(UX_REVIEWER)).toBe(true);
    const subdirPath = join(AGENTS_DIR, 'ux-reviewer', 'agent.md');
    expect(existsSync(subdirPath)).toBe(false);
  });

  // Test 2.3: contract-validator.md should be a flat file (not in subdirectory)
  test('[P0] contract-validator.md should be a flat file in agents/ (not a subdirectory)', () => {
    expect(existsSync(CONTRACT_VALIDATOR)).toBe(true);
    const subdirPath = join(AGENTS_DIR, 'contract-validator', 'agent.md');
    expect(existsSync(subdirPath)).toBe(false);
  });

  // Test 2.4: File names must match the {name}.md pattern (name matches frontmatter name)
  test('[P0] Agent file names should match their frontmatter name field', () => {
    const agents = [
      { path: SECURITY_REVIEWER, expectedName: 'security-reviewer' },
      { path: UX_REVIEWER, expectedName: 'ux-reviewer' },
      { path: CONTRACT_VALIDATOR, expectedName: 'contract-validator' },
    ];

    for (const agent of agents) {
      const content = readFileSync(agent.path, 'utf8');
      const nameMatch = content.match(/^---\s*\n[\s\S]*?name:\s*(\S+)/);
      expect(nameMatch).not.toBeNull();
      expect(nameMatch![1]).toBe(agent.expectedName);
    }
  });
});

// ============================================================================
// AC2: Dispatch Rules Reference Extended Agents
// ============================================================================

describe('AC2: Dispatch Rules Reference Extended Agents', () => {
  // Test 2.5: dispatch-rules.yaml should reference security-reviewer
  test('[P0] dispatch-rules.yaml should reference security-reviewer for risk-based dispatch', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/security-reviewer/);
  });

  // Test 2.6: dispatch-rules.yaml should reference ux-reviewer
  test('[P0] dispatch-rules.yaml should reference ux-reviewer for domain-tag dispatch', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/ux-reviewer/);
  });

  // Test 2.7: dispatch-rules.yaml should reference contract-validator
  test('[P0] dispatch-rules.yaml should reference contract-validator for domain-tag dispatch', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/contract-validator/);
  });

  // Test 2.8: security-reviewer should be dispatched for high risk
  test('[P0] dispatch-rules.yaml high risk should add security-reviewer', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    const highRiskSection = content.match(/\bhigh:\s*\n[\s\S]*?description:[^\n]*/);
    expect(highRiskSection).not.toBeNull();
    expect(highRiskSection![0]).toMatch(/security-reviewer/);
  });

  // Test 2.9: security-reviewer should be dispatched for critical risk
  test('[P0] dispatch-rules.yaml critical risk should add security-reviewer', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    const criticalSection = content.match(/\bcritical:\s*\n[\s\S]*?description:[^\n]*/);
    expect(criticalSection).not.toBeNull();
    expect(criticalSection![0]).toMatch(/security-reviewer/);
  });

  // Test 2.10: ux-reviewer should be dispatched for frontend/ui/ux tags
  test('[P0] dispatch-rules.yaml should dispatch ux-reviewer for frontend/ui/ux tags', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    const uxSection = content.match(/ux_review:[\s\S]*?description:[^\n]*/);
    expect(uxSection).not.toBeNull();
    expect(uxSection![0]).toMatch(/ux-reviewer/);
    expect(uxSection![0]).toMatch(/frontend/);
    expect(uxSection![0]).toMatch(/\bui\b/);
    expect(uxSection![0]).toMatch(/\bux\b/);
  });

  // Test 2.11: contract-validator should be dispatched for api/contract/integration tags
  test('[P0] dispatch-rules.yaml should dispatch contract-validator for api/contract/integration tags', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    const contractSection = content.match(/contract_review:[\s\S]*?(?=\n\s*#|$)/);
    expect(contractSection).not.toBeNull();
    expect(contractSection![0]).toMatch(/contract-validator/);
    expect(contractSection![0]).toMatch(/\bapi\b/);
    expect(contractSection![0]).toMatch(/\bcontract\b/);
    expect(contractSection![0]).toMatch(/\bintegration\b/);
  });
});

// ============================================================================
// AC2: Agent File Discovery by Dispatcher
// ============================================================================

describe('AC2: Agent Files Are Discoverable by Dispatcher', () => {
  // Test 2.12: Dispatcher SKILL.md should validate agent file existence
  test('[P0] Dispatcher SKILL.md should validate agent file existence at agents/{name}.md', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/agents\/.*\.md|agent.*file.*exist|validate.*agent/i);
  });

  // Test 2.13: After Story 9.4, all 3 extended agents should exist (not be skipped)
  test('[P0] All 3 extended agent files should exist (dispatcher should not skip them)', () => {
    expect(existsSync(SECURITY_REVIEWER)).toBe(true);
    expect(existsSync(UX_REVIEWER)).toBe(true);
    expect(existsSync(CONTRACT_VALIDATOR)).toBe(true);
  });

  // Test 2.14: No registration step needed - files are auto-discovered
  test('[P1] Agent files should require no registration (file existence is sufficient)', () => {
    // Dispatcher checks file existence — no registration, config entry, or build step needed
    const dispatcherContent = readFileSync(DISPATCHER_SKILL, 'utf8');
    // The dispatcher should validate by checking file existence, not via a registration list
    expect(dispatcherContent).toMatch(/file.*exist|exist.*file|check.*file/i);
    // Should NOT require a manual registration step
    expect(dispatcherContent).not.toMatch(/register.*agent|add.*agent.*config/i);
  });

  // Test 2.15: Extended agents follow same pattern as core agents (architect, developer, qa)
  test('[P1] Extended agents should coexist in same directory as core agents', () => {
    // Core agents exist
    expect(existsSync(join(AGENTS_DIR, 'architect.md'))).toBe(true);
    expect(existsSync(join(AGENTS_DIR, 'developer.md'))).toBe(true);
    expect(existsSync(join(AGENTS_DIR, 'qa.md'))).toBe(true);

    // Extended agents exist alongside them
    expect(existsSync(SECURITY_REVIEWER)).toBe(true);
    expect(existsSync(UX_REVIEWER)).toBe(true);
    expect(existsSync(CONTRACT_VALIDATOR)).toBe(true);
  });
});

// ============================================================================
// AC2: Agents Active In Correct Workflow
// ============================================================================

describe('AC2: Extended Agents Active In refine-ticket', () => {
  // Test 2.16: All extended agents should declare active_in: refine-ticket
  test('[P0] All extended agents should have active_in: [refine-ticket]', () => {
    for (const agentPath of [SECURITY_REVIEWER, UX_REVIEWER, CONTRACT_VALIDATOR]) {
      const content = readFileSync(agentPath, 'utf8');
      expect(content).toMatch(/active_in:\s*\n\s*-\s*refine-ticket/);
    }
  });
});
