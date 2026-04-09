/**
 * ATDD Tests for AC4: Fallback Defaults and Missing Agent Handling
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.3 - Implement Dynamic Agent Dispatcher
 *
 * PRD References:
 * - FR-34: Dynamic agent dispatch based on story type, risk, and domain tags
 * - FR-44: Runtime file-based extension model (agents discovered by file existence)
 *
 * AC3: Given the dispatcher cannot determine an appropriate agent set or classification
 *      is ambiguous,
 *      When dispatch rules yield no match or story attributes are missing,
 *      Then the default agent set is used (Architect, Developer, QA),
 *      And a note is logged: "Default agent set used — no specific dispatch rules matched."
 *
 * AC4: Given a dispatched agent type has no corresponding agent file in
 *      scrum_workflow/agents/,
 *      When the dispatcher resolves the agent set,
 *      Then that agent slot is skipped gracefully without error,
 *      And a note is logged: "Agent '{agent-name}' not available — skipped
 *       (create agent file to enable)."
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DISPATCHER_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'agent-dispatcher', 'SKILL.md');
const DISPATCH_RULES = join(process.cwd(), 'scrum_workflow', 'data', 'dispatch-rules.yaml');
const AGENTS_DIR = join(process.cwd(), 'scrum_workflow', 'agents');
const REFINEMENT_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'refinement.md');

// ============================================================================
// AC3: Default Agent Set Fallback
// ============================================================================

describe('AC3: Default Agent Set When No Rules Match', () => {
  // Test 4.1: SKILL.md should define default/fallback agent set
  test('[P0] SKILL.md should define default fallback agent set [architect, developer, qa]', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/default.*agent.*set|fallback.*agent|default.*set/i);
    expect(content).toMatch(/architect/i);
    expect(content).toMatch(/developer/i);
    expect(content).toMatch(/qa/i);
  });

  // Test 4.2: SKILL.md should specify when default set is used (missing attributes)
  test('[P0] SKILL.md should use default set when story attributes are missing', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/missing.*attribute|attribute.*missing|no.*attribute/i);
  });

  // Test 4.3: SKILL.md should specify when default set is used (no rules match)
  test('[P0] SKILL.md should use default set when no dispatch rules match', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/no.*match|no.*rule.*match|rule.*not.*match/i);
  });

  // Test 4.4: SKILL.md should log a note when default set is used
  test('[P0] SKILL.md should log note: "Default agent set used" when falling back', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/[Dd]efault agent set used|default.*set.*used/i);
  });

  // Test 4.5: dispatch-rules.yaml should define the default set explicitly
  test('[P0] dispatch-rules.yaml should explicitly define default agent set', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/default/i);
    expect(content).toMatch(/architect/i);
    expect(content).toMatch(/developer/i);
    expect(content).toMatch(/qa/i);
  });
});

// ============================================================================
// AC4: Missing Agent File Graceful Skip
// ============================================================================

describe('AC4: Graceful Skip When Agent File Missing', () => {
  // Test 4.6: SKILL.md should define agent file validation step
  test('[P0] SKILL.md should define agent file existence validation step', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/validate.*agent.*file|agent.*file.*exist|check.*agent.*exist/i);
  });

  // Test 4.7: SKILL.md should check agent files in scrum_workflow/agents/{name}.md
  test('[P0] SKILL.md should check for agent files at scrum_workflow/agents/{name}.md', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/agents\/.*\.md|agents.*directory/i);
  });

  // Test 4.8: SKILL.md should skip missing agents gracefully (no error)
  test('[P0] SKILL.md should skip missing agents gracefully without error', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/skip.*graceful|graceful.*skip|without.*error/i);
  });

  // Test 4.9: SKILL.md should log note for skipped agents with expected format
  test('[P0] SKILL.md should log: "Agent \'{name}\' not available — skipped" for missing agents', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/not available.*skipped|agent.*not.*available/i);
  });

  // Test 4.10: Existing core agents should have their files present
  test('[P0] Core agents (architect, developer, qa) should have agent files', () => {
    expect(existsSync(join(AGENTS_DIR, 'architect.md'))).toBe(true);
    expect(existsSync(join(AGENTS_DIR, 'developer.md'))).toBe(true);
    expect(existsSync(join(AGENTS_DIR, 'qa.md'))).toBe(true);
  });

  // Test 4.11: Extended agents (security-reviewer, ux-reviewer, contract-validator)
  // now exist (created in Story 9.4)
  test('[P1] Extended agent files should exist (created in Story 9.4)', () => {
    // These agents are referenced in dispatch rules and were created in Story 9.4
    // The dispatcher discovers them via file existence
    expect(existsSync(join(AGENTS_DIR, 'security-reviewer.md'))).toBe(true);
    expect(existsSync(join(AGENTS_DIR, 'ux-reviewer.md'))).toBe(true);
    expect(existsSync(join(AGENTS_DIR, 'contract-validator.md'))).toBe(true);
  });

  // Test 4.12: SKILL.md should include skipped agents in output skipped_agents array
  test('[P0] SKILL.md skipped agents should appear in skipped_agents output with reasons', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/skipped_agents/i);
  });
});

// ============================================================================
// AC3/AC4: Refinement Workflow Integration
// ============================================================================

describe('AC3/AC4: Refinement Workflow Dynamic Agent Spawning', () => {
  // Test 4.13: refinement.md should have a dispatch step (Step 4.6)
  test('[P0] refinement.md should have an Agent Dispatch step', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    expect(content).toMatch(/agent.*dispatch/i);
  });

  // Test 4.14: refinement.md should invoke agent-dispatcher skill
  test('[P0] refinement.md should invoke agent-dispatcher skill', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    expect(content).toMatch(/agent-dispatcher/i);
  });

  // Test 4.15: refinement.md should replace hardcoded agent spawning with dynamic loop
  test('[P0] refinement.md should use dynamic agent spawning loop (not hardcoded Steps 5-7)', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    // Should reference dynamic or dispatched agents for spawning
    expect(content).toMatch(/dynamic.*agent|dispatched.*agent|for each.*agent|agent.*loop/i);
  });

  // Test 4.16: refinement.md should handle variable agent count in cross-talk
  test('[P1] refinement.md cross-talk should work with variable agent count', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    expect(content).toMatch(/dispatched.*agent|variable.*agent|dynamic.*agent/i);
  });

  // Test 4.17: refinement.md should handle single agent (skip cross-talk)
  test('[P1] refinement.md should skip cross-talk when only 1 agent dispatched', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    expect(content).toMatch(/single.*agent|1.*agent.*skip|skip.*cross.*talk/i);
  });

  // Test 4.18: refinement.md estimation should support variable agent count
  test('[P1] refinement.md estimation should support 2+ agents with Wideband Delphi', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    expect(content).toMatch(/wideband.*delphi|estimation/i);
  });
});

// ============================================================================
// AC3: Dispatch When agent_dispatch_enabled is false
// ============================================================================

describe('AC3: Dispatch Disabled Falls Back to Static Selection', () => {
  // Test 4.19: SKILL.md or refine-ticket.md should respect agent_dispatch_enabled flag
  test('[P0] Dispatcher should respect agent_dispatch_enabled config flag', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/agent_dispatch_enabled|dispatch.*enabled|enabled.*dispatch/i);
  });

  // Test 4.20: When dispatch disabled, static default set should be used
  test('[P0] When agent_dispatch_enabled is false, static default set [architect, developer, qa] used', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/disabled|false|static.*default|fallback/i);
  });
});
