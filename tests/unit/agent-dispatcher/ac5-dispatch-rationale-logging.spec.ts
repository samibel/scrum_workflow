/**
 * ATDD Tests for AC5: Dispatch Rationale Logging
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.3 - Implement Dynamic Agent Dispatcher
 *
 * PRD References:
 * - FR-34: Dynamic agent dispatch based on story type, risk, and domain tags
 *
 * AC2: Given the selected agent set,
 *      When refinement begins,
 *      Then only the selected agents are spawned with their relevant context,
 *      And the agent selection rationale is logged in the refinement artifact
 *       (refinement.md) with a "Dispatch Summary" section showing which agents
 *       were selected, why, and which were skipped.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DISPATCHER_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'agent-dispatcher', 'SKILL.md');
const REFINE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-ticket.md');
const REFINEMENT_WORKFLOW = join(process.cwd(), 'scrum_workflow', 'workflows', 'refinement.md');

// ============================================================================
// AC2: Dispatch Summary in Refinement Output
// ============================================================================

describe('AC2: Dispatch Summary Section in Refinement Output', () => {
  // Test 5.1: refine-ticket.md should specify Dispatch Summary in output
  test('[P0] refine-ticket.md output should include Dispatch Summary section', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/[Dd]ispatch [Ss]ummary/);
  });

  // Test 5.2: refinement.md should add Dispatch Summary to refinement artifact
  test('[P0] refinement.md should add Dispatch Summary to refinement.md artifact', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    expect(content).toMatch(/[Dd]ispatch [Ss]ummary/);
  });

  // Test 5.3: Dispatch Summary should show which agents were selected
  test('[P0] Dispatch Summary should list selected agents', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/selected.*agent|agent.*selected|dispatched.*agent/i);
  });

  // Test 5.4: Dispatch Summary should show why agents were selected (rationale)
  test('[P0] Dispatch Summary should include agent selection rationale', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/rationale|why.*selected|reason.*select/i);
  });

  // Test 5.5: Dispatch Summary should show which agents were skipped
  test('[P0] Dispatch Summary should list skipped agents with reasons', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/skipped.*agent|agent.*skipped/i);
  });
});

// ============================================================================
// AC2: SKILL.md Rationale Output Structure
// ============================================================================

describe('AC2: Dispatcher Skill Rationale Output', () => {
  // Test 5.6: SKILL.md should define dispatch_rationale in output
  test('[P0] SKILL.md output should include dispatch_rationale field', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/dispatch_rationale/i);
  });

  // Test 5.7: SKILL.md rationale should explain type-based selection
  test('[P1] SKILL.md dispatch_rationale should explain type-based selection', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // Rationale should reference the type that determined the base set
    expect(content).toMatch(/type.*reason|type.*rationale|based on.*type/i);
  });

  // Test 5.8: SKILL.md rationale should explain risk-based additions
  test('[P1] SKILL.md dispatch_rationale should explain risk-based additions', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/risk.*reason|risk.*rationale|based on.*risk/i);
  });

  // Test 5.9: SKILL.md rationale should explain domain-tag additions
  test('[P1] SKILL.md dispatch_rationale should explain domain-tag additions', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/tag.*reason|tag.*rationale|based on.*tag|domain.*tag/i);
  });
});

// ============================================================================
// AC2: Only Selected Agents Are Spawned
// ============================================================================

describe('AC2: Only Selected Agents Spawned with Context', () => {
  // Test 5.10: refinement.md should only spawn agents from dispatcher output
  test('[P0] refinement.md should spawn only agents returned by dispatcher', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    expect(content).toMatch(/dispatched.*agent|returned.*agent|selected.*agent/i);
  });

  // Test 5.11: Each spawned agent should receive isolated context per its Context Rules
  test('[P0] refinement.md should maintain context isolation for each spawned agent', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    expect(content).toMatch(/context.*isolat|isolated.*context|context.*rule|context.*bundle/i);
  });

  // Test 5.12: refinement.md should load agent definition from agents/{name}.md
  test('[P1] refinement.md should load agent definition from scrum_workflow/agents/{name}.md', () => {
    const content = readFileSync(REFINEMENT_WORKFLOW, 'utf8');
    expect(content).toMatch(/agents\/.*\.md|agent.*definition|load.*agent/i);
  });
});

// ============================================================================
// AC2: Artifact Contract Sync
// ============================================================================

describe('AC2: Artifact Contract Sync for Dispatcher Integration', () => {
  const SYNC_REFINE_1 = join(process.cwd(), 'create-scrum-workflow', 'scrum_workflow', 'commands', 'refine-ticket.md');
  const SYNC_REFINE_2 = join(process.cwd(), 'create-scrum-workflow', 'templates', 'scrum_workflow', 'commands', 'refine-ticket.md');
  const SYNC_REFINEMENT_1 = join(process.cwd(), 'create-scrum-workflow', 'scrum_workflow', 'workflows', 'refinement.md');
  const SYNC_REFINEMENT_2 = join(process.cwd(), 'create-scrum-workflow', 'templates', 'scrum_workflow', 'workflows', 'refinement.md');

  // Test 5.13: Synced refine-ticket.md should have agent dispatch reference
  test('[P0] create-scrum-workflow/.../refine-ticket.md should reference agent-dispatcher', () => {
    const content = readFileSync(SYNC_REFINE_1, 'utf8');
    expect(content).toMatch(/agent-dispatcher|agent.*dispatch/i);
  });

  // Test 5.14: Synced template refine-ticket.md should have agent dispatch reference
  test('[P0] create-scrum-workflow/templates/.../refine-ticket.md should reference agent-dispatcher', () => {
    const content = readFileSync(SYNC_REFINE_2, 'utf8');
    expect(content).toMatch(/agent-dispatcher|agent.*dispatch/i);
  });

  // Test 5.15: Synced refinement.md should have dynamic agent spawning
  test('[P0] create-scrum-workflow/.../refinement.md should have dynamic agent spawning', () => {
    const content = readFileSync(SYNC_REFINEMENT_1, 'utf8');
    expect(content).toMatch(/agent-dispatcher|dynamic.*agent|dispatched.*agent/i);
  });

  // Test 5.16: Synced template refinement.md should have dynamic agent spawning
  test('[P0] create-scrum-workflow/templates/.../refinement.md should have dynamic agent spawning', () => {
    const content = readFileSync(SYNC_REFINEMENT_2, 'utf8');
    expect(content).toMatch(/agent-dispatcher|dynamic.*agent|dispatched.*agent/i);
  });

  // Test 5.17: Synced dispatch-rules.yaml should exist
  test('[P0] create-scrum-workflow/.../data/dispatch-rules.yaml should exist', () => {
    const syncTarget = join(process.cwd(), 'create-scrum-workflow', 'scrum_workflow', 'data', 'dispatch-rules.yaml');
    expect(existsSync(syncTarget)).toBe(true);
  });

  // Test 5.18: Synced template dispatch-rules.yaml should exist
  test('[P0] create-scrum-workflow/templates/.../data/dispatch-rules.yaml should exist', () => {
    const syncTarget = join(process.cwd(), 'create-scrum-workflow', 'templates', 'scrum_workflow', 'data', 'dispatch-rules.yaml');
    expect(existsSync(syncTarget)).toBe(true);
  });

  // Test 5.19: Synced config.yaml should have agent_dispatch_enabled
  test('[P0] create-scrum-workflow/.../config.yaml should have agent_dispatch_enabled', () => {
    const syncTarget = join(process.cwd(), 'create-scrum-workflow', 'scrum_workflow', 'config.yaml');
    const content = readFileSync(syncTarget, 'utf8');
    expect(content).toMatch(/agent_dispatch_enabled/i);
  });

  // Test 5.20: Synced template config.yaml should have agent_dispatch_enabled
  test('[P0] create-scrum-workflow/templates/.../config.yaml should have agent_dispatch_enabled', () => {
    const syncTarget = join(process.cwd(), 'create-scrum-workflow', 'templates', 'scrum_workflow', 'config.yaml');
    const content = readFileSync(syncTarget, 'utf8');
    expect(content).toMatch(/agent_dispatch_enabled/i);
  });
});
