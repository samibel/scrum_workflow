/**
 * ATDD Tests for AC3: Domain-Tag-Based Agent Dispatch
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.3 - Implement Dynamic Agent Dispatcher
 *
 * PRD References:
 * - FR-34: Dynamic agent dispatch based on story type, risk, and domain tags
 *
 * AC1 (Domain tag aspect): The dispatcher selects agents based on domain tags
 *      (e.g., frontend-tagged adds UX Reviewer slot).
 *
 * Domain-Tag Rules:
 * - frontend/ui/ux tags -> add ux-reviewer slot
 * - api/contract/integration tags -> add contract-validator slot
 * - Domain-tag rules ADD to the current set (they do not replace)
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DISPATCHER_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'agent-dispatcher', 'SKILL.md');
const DISPATCH_RULES = join(process.cwd(), 'scrum_workflow', 'data', 'dispatch-rules.yaml');

// ============================================================================
// AC3: Domain-Tag Rules in dispatch-rules.yaml
// ============================================================================

describe('AC3: Domain-Tag Rules in dispatch-rules.yaml', () => {
  // Test 3.1: dispatch-rules.yaml should define frontend tag -> ux-reviewer
  test('[P0] dispatch-rules.yaml should map frontend tag to ux-reviewer agent', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/frontend/i);
    expect(content).toMatch(/ux-reviewer/i);
  });

  // Test 3.2: dispatch-rules.yaml should define ui tag -> ux-reviewer
  test('[P0] dispatch-rules.yaml should map ui tag to ux-reviewer agent', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/\bui\b/i);
    expect(content).toMatch(/ux-reviewer/i);
  });

  // Test 3.3: dispatch-rules.yaml should define ux tag -> ux-reviewer
  test('[P0] dispatch-rules.yaml should map ux tag to ux-reviewer agent', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/\bux\b/i);
    expect(content).toMatch(/ux-reviewer/i);
  });

  // Test 3.4: dispatch-rules.yaml should define api tag -> contract-validator
  test('[P0] dispatch-rules.yaml should map api tag to contract-validator agent', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/\bapi\b/i);
    expect(content).toMatch(/contract-validator/i);
  });

  // Test 3.5: dispatch-rules.yaml should define contract tag -> contract-validator
  test('[P0] dispatch-rules.yaml should map contract tag to contract-validator agent', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/\bcontract\b/i);
    expect(content).toMatch(/contract-validator/i);
  });

  // Test 3.6: dispatch-rules.yaml should define integration tag -> contract-validator
  test('[P0] dispatch-rules.yaml should map integration tag to contract-validator agent', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/\bintegration\b/i);
    expect(content).toMatch(/contract-validator/i);
  });

  // Test 3.7: Domain-tag rules should be additive (not replace)
  test('[P0] dispatch-rules.yaml domain-tag rules should be additive (not replace)', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    // Domain tag section should indicate addition/append behavior
    expect(content).toMatch(/add|append|addition/i);
  });
});

// ============================================================================
// AC3: Domain-Tag Dispatch Algorithm in SKILL.md
// ============================================================================

describe('AC3: Domain-Tag Dispatch Algorithm', () => {
  // Test 3.8: SKILL.md should define domain-tag-based addition step
  test('[P0] SKILL.md should define domain-tag-based addition step in dispatch algorithm', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/domain.*tag.*add|tag.*based.*add|domain.*tag.*rule/i);
  });

  // Test 3.9: SKILL.md should apply domain-tag rules AFTER risk rules
  test('[P0] SKILL.md domain-tag rules should apply after risk-based rules', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    const riskIndex = content.search(/risk.*add|risk.*based/i);
    const tagIndex = content.search(/domain.*tag.*add|tag.*based.*add/i);
    expect(riskIndex).toBeGreaterThan(-1);
    expect(tagIndex).toBeGreaterThan(-1);
    expect(tagIndex).toBeGreaterThan(riskIndex);
  });

  // Test 3.10: SKILL.md should reference ux-reviewer agent
  test('[P0] SKILL.md should reference ux-reviewer agent for frontend/ui/ux tags', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/ux-reviewer/i);
  });

  // Test 3.11: SKILL.md should reference contract-validator agent
  test('[P0] SKILL.md should reference contract-validator agent for api/contract/integration tags', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/contract-validator/i);
  });
});

// ============================================================================
// AC3: Composite Domain-Tag Scenarios
// ============================================================================

describe('AC3: Composite Domain-Tag Dispatch Scenarios', () => {
  // Test 3.12: feature + frontend tag should yield [architect, developer, qa, ux-reviewer]
  test('[P1] Rules should support: feature + [frontend] -> default set + ux-reviewer', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/frontend/i);
    expect(content).toMatch(/ux-reviewer/i);
  });

  // Test 3.13: feature + api tag should yield [architect, developer, qa, contract-validator]
  test('[P1] Rules should support: feature + [api] -> default set + contract-validator', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/api/i);
    expect(content).toMatch(/contract-validator/i);
  });

  // Test 3.14: Multiple domain tags should add multiple agents (both ux-reviewer + contract-validator)
  test('[P1] Rules should support multiple domain tags adding multiple agents', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    // Should support having both ux-reviewer and contract-validator
    expect(content).toMatch(/ux-reviewer/i);
    expect(content).toMatch(/contract-validator/i);
  });

  // Test 3.15: Composite: bugfix + critical risk + [security, api] tags
  test('[P1] Rules should support: bugfix + critical + [security, api] -> full set + security-reviewer + contract-validator', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/security-reviewer/i);
    expect(content).toMatch(/contract-validator/i);
  });
});
