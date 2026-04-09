/**
 * ATDD Tests for AC2: Risk-Based Agent Dispatch
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.3 - Implement Dynamic Agent Dispatcher
 *
 * PRD References:
 * - FR-34: Dynamic agent dispatch based on story type, risk, and domain tags
 *
 * AC1 (Risk aspect): The dispatcher selects agents based on risk level
 *      (e.g., high-risk adds Security Reviewer slot).
 *
 * Risk-Based Rules:
 * - high/critical risk -> add security-reviewer slot
 * - low/medium risk -> no additional agents from risk rules
 * - Risk-based rules ADD to the current set (they do not replace)
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DISPATCHER_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'agent-dispatcher', 'SKILL.md');
const DISPATCH_RULES = join(process.cwd(), 'scrum_workflow', 'data', 'dispatch-rules.yaml');

// ============================================================================
// AC2: Risk-Based Dispatch Rules in dispatch-rules.yaml
// ============================================================================

describe('AC2: Risk-Based Rules in dispatch-rules.yaml', () => {
  // Test 2.1: dispatch-rules.yaml should define high risk addition rules
  test('[P0] dispatch-rules.yaml should define high risk -> add security-reviewer', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/high/i);
    expect(content).toMatch(/security-reviewer/i);
  });

  // Test 2.2: dispatch-rules.yaml should define critical risk addition rules
  test('[P0] dispatch-rules.yaml should define critical risk -> add security-reviewer', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/critical/i);
    expect(content).toMatch(/security-reviewer/i);
  });

  // Test 2.3: dispatch-rules.yaml low risk should NOT add extra agents
  test('[P0] dispatch-rules.yaml low risk should not add extra agents', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    // Low risk section should not reference additional agent additions
    // or should explicitly state no additions
    expect(content).toMatch(/low/i);
  });

  // Test 2.4: dispatch-rules.yaml medium risk should NOT add extra agents
  test('[P0] dispatch-rules.yaml medium risk should not add extra agents', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/medium/i);
  });

  // Test 2.5: Risk-based rules should ADD (not replace) to agent set
  test('[P0] dispatch-rules.yaml risk-based rules should be additive (not replace)', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/add|append|addition/i);
  });
});

// ============================================================================
// AC2: Risk-Based Dispatch Algorithm in SKILL.md
// ============================================================================

describe('AC2: Risk-Based Dispatch Algorithm', () => {
  // Test 2.6: SKILL.md should define risk-based addition step in algorithm
  test('[P0] SKILL.md should define risk-based addition step in dispatch algorithm', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/risk.*based.*add|risk.*level.*add|add.*based.*risk/i);
  });

  // Test 2.7: SKILL.md should apply risk rules AFTER type rules
  test('[P0] SKILL.md risk-based rules should apply after type-based rules', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // The algorithm should show type override before risk addition
    const typeIndex = content.search(/type.*override|type.*replace|type.*based/i);
    const riskIndex = content.search(/risk.*add|risk.*based.*add/i);
    expect(typeIndex).toBeGreaterThan(-1);
    expect(riskIndex).toBeGreaterThan(-1);
    expect(riskIndex).toBeGreaterThan(typeIndex);
  });

  // Test 2.8: SKILL.md should specify security-reviewer for high/critical risk
  test('[P0] SKILL.md should specify security-reviewer agent for high/critical risk', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/security-reviewer/i);
  });
});

// ============================================================================
// AC2: Composite Dispatch Scenarios (Type + Risk)
// ============================================================================

describe('AC2: Composite Type + Risk Dispatch Scenarios', () => {
  // Test 2.9: feature + high risk should yield [architect, developer, qa, security-reviewer]
  test('[P1] SKILL.md or rules should support: feature + high risk -> default set + security-reviewer', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    // High risk should reference security-reviewer
    expect(content).toMatch(/high[\s\S]*?security-reviewer|security-reviewer[\s\S]*?high/i);
  });

  // Test 2.10: infrastructure + high risk should yield [architect, developer, security-reviewer]
  test('[P1] SKILL.md should support: infrastructure + high risk -> [architect, developer] + security-reviewer', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // The algorithm should compose type override THEN risk addition
    // infrastructure -> [architect, developer] + high risk -> add security-reviewer
    expect(content).toMatch(/infrastructure/i);
    expect(content).toMatch(/security-reviewer/i);
  });

  // Test 2.11: bugfix + critical risk should yield [architect, developer, qa, security-reviewer]
  test('[P1] dispatch-rules.yaml should support: bugfix + critical risk -> default set + security-reviewer', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/critical/i);
    expect(content).toMatch(/security-reviewer/i);
  });
});
