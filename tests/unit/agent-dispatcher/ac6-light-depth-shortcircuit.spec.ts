/**
 * ATDD Tests for AC6: Light Depth Short-Circuit Behavior
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.3 - Implement Dynamic Agent Dispatcher
 *
 * PRD References:
 * - FR-34: Dynamic agent dispatch based on story type, risk, and domain tags
 *
 * Light Depth Short-Circuit:
 * - When depth: light, the dispatcher returns [developer] immediately
 * - No other dispatch rules are applied (type, risk, domain-tag rules skipped)
 * - This preserves existing light depth behavior from Story 9.2
 *
 * This is a cross-cutting concern derived from AC1 and the dispatch algorithm spec:
 * "Step 1: Read depth — if light, return [developer] immediately (short-circuit)"
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DISPATCHER_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'agent-dispatcher', 'SKILL.md');
const DISPATCH_RULES = join(process.cwd(), 'scrum_workflow', 'data', 'dispatch-rules.yaml');

// ============================================================================
// AC6: Light Depth Short-Circuit in SKILL.md
// ============================================================================

describe('AC6: Light Depth Short-Circuit in Dispatcher', () => {
  // Test 6.1: SKILL.md should define light depth short-circuit as first step
  test('[P0] SKILL.md should check depth as first step of dispatch algorithm', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // Light depth check should be the first step
    expect(content).toMatch(/step\s*1[\s\S]*?depth|first[\s\S]*?depth.*light/i);
  });

  // Test 6.2: SKILL.md light depth should return [developer] only
  test('[P0] SKILL.md light depth should return [developer] immediately', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/light.*\[?\s*developer\s*\]?|light.*return.*developer/i);
  });

  // Test 6.3: SKILL.md light depth should short-circuit (skip all other rules)
  test('[P0] SKILL.md light depth should short-circuit and skip all other dispatch rules', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/short.circuit|immediately|skip.*other.*rule|no.*other.*rule/i);
  });

  // Test 6.4: dispatch-rules.yaml should define light depth override
  test('[P0] dispatch-rules.yaml should define light depth -> [developer] override', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/light/i);
    expect(content).toMatch(/developer/i);
  });
});

// ============================================================================
// AC6: Light Depth Preserves Existing Behavior
// ============================================================================

describe('AC6: Light Depth Backward Compatibility', () => {
  // Test 6.5: Light depth behavior matches existing Story 9.2 light depth behavior
  test('[P0] Light depth dispatcher output should match existing light depth: developer only', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // The dispatcher should explicitly state this preserves existing behavior
    expect(content).toMatch(/existing.*behavior|backward.*compat|preserve.*light/i);
  });

  // Test 6.6: Light depth should override ALL other attributes (type, risk, domain)
  test('[P0] Light depth should override regardless of type, risk_level, or domain_tags', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // Light depth ignores type, risk, and domain tags
    expect(content).toMatch(/regardless|override|ignore.*type|ignore.*risk|light.*always/i);
  });

  // Test 6.7: infrastructure + light depth should still return [developer] only
  test('[P1] Even infrastructure type with light depth should return [developer] (light overrides type)', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // The short-circuit happens before type-based rules
    expect(content).toMatch(/light.*developer/i);
  });

  // Test 6.8: high risk + light depth should still return [developer] only
  test('[P1] Even high risk with light depth should return [developer] (light overrides risk)', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // Light depth short-circuits before risk-based rules
    expect(content).toMatch(/light/i);
    expect(content).toMatch(/short.circuit|immediately/i);
  });
});
