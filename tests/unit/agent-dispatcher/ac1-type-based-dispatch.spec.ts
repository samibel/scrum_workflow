/**
 * ATDD Tests for AC1: Type-Based Agent Dispatch
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.3 - Implement Dynamic Agent Dispatcher
 *
 * PRD References:
 * - FR-34: Dynamic agent dispatch based on story type, risk, and domain tags
 *
 * AC1: Given FR-34 specifies dynamic agent dispatch based on story type, risk, and domain tags,
 *      When /scrum-refine-ticket is triggered for a story,
 *      Then the dispatcher selects agents based on: story type (e.g., infrastructure stories
 *       get Architect + Developer, skip QA), risk level, and domain tags,
 *      And the dispatch rules are defined in a configurable data file
 *       scrum_workflow/data/dispatch-rules.yaml.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DISPATCHER_SKILL_DIR = join(process.cwd(), 'scrum_workflow', 'skills', 'agent-dispatcher');
const DISPATCHER_SKILL = join(DISPATCHER_SKILL_DIR, 'SKILL.md');
const DISPATCH_RULES = join(process.cwd(), 'scrum_workflow', 'data', 'dispatch-rules.yaml');
const REFINE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'refine-ticket.md');
const CONFIG_FILE = join(process.cwd(), 'scrum_workflow', 'config.yaml');

// ============================================================================
// AC1: Agent Dispatcher Skill Directory & File Existence
// ============================================================================

describe('AC1: Agent Dispatcher Skill Structure', () => {
  // Test 1.1: agent-dispatcher skill directory should exist
  test('[P0] skills/agent-dispatcher/ directory should exist', () => {
    expect(existsSync(DISPATCHER_SKILL_DIR)).toBe(true);
  });

  // Test 1.2: agent-dispatcher SKILL.md should exist
  test('[P0] skills/agent-dispatcher/SKILL.md should exist', () => {
    expect(existsSync(DISPATCHER_SKILL)).toBe(true);
  });

  // Test 1.3: SKILL.md should have valid frontmatter with name, role, description
  test('[P0] SKILL.md should have valid frontmatter (name, role, description)', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // Frontmatter should include name field
    expect(content).toMatch(/^---\s*\n[\s\S]*?name:\s*agent-dispatcher/);
    // Frontmatter should include role field
    expect(content).toMatch(/role:/);
    // Frontmatter should include description field
    expect(content).toMatch(/description:/);
  });

  // Test 1.4: SKILL.md should be read-only (same pattern as story-classifier and adaptive-depth-selector)
  test('[P0] SKILL.md should declare read-only context (never writes files)', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/read.only|never.*write|does not write|no.*write/i);
  });
});

// ============================================================================
// AC1: Dispatch Rules Data File
// ============================================================================

describe('AC1: Dispatch Rules Data File', () => {
  // Test 1.5: dispatch-rules.yaml should exist
  test('[P0] data/dispatch-rules.yaml should exist', () => {
    expect(existsSync(DISPATCH_RULES)).toBe(true);
  });

  // Test 1.6: dispatch-rules.yaml should define default agent set
  test('[P0] dispatch-rules.yaml should define default agent set [architect, developer, qa]', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/default/i);
    expect(content).toMatch(/architect/i);
    expect(content).toMatch(/developer/i);
    expect(content).toMatch(/qa/i);
  });

  // Test 1.7: dispatch-rules.yaml should define type-based override rules
  test('[P0] dispatch-rules.yaml should define type-based override rules', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    // Should have a section for type-based rules
    expect(content).toMatch(/type.*based|type.*override|type.*rules/i);
  });

  // Test 1.8: dispatch-rules.yaml infrastructure type should map to [architect, developer]
  test('[P0] dispatch-rules.yaml infrastructure type should override to [architect, developer] (skip QA)', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    // Infrastructure type should have architect and developer but skip QA
    expect(content).toMatch(/infrastructure/i);
    // The infrastructure section should reference architect and developer
    const infraSection = content.slice(content.search(/infrastructure/i));
    expect(infraSection).toMatch(/architect/i);
    expect(infraSection).toMatch(/developer/i);
  });

  // Test 1.9: dispatch-rules.yaml should define risk-based addition rules
  test('[P0] dispatch-rules.yaml should define risk-based addition rules', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/risk.*based|risk.*addition|risk.*rules/i);
  });

  // Test 1.10: dispatch-rules.yaml should define domain-tag-based addition rules
  test('[P0] dispatch-rules.yaml should define domain-tag-based addition rules', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    expect(content).toMatch(/domain.*tag|tag.*based|tag.*addition/i);
  });

  // Test 1.11: dispatch-rules.yaml should have inline YAML comments documenting rules
  test('[P1] dispatch-rules.yaml should have inline YAML comments documenting each rule', () => {
    const content = readFileSync(DISPATCH_RULES, 'utf8');
    // YAML comments start with #
    const commentLines = content.split('\n').filter(line => line.trim().startsWith('#'));
    expect(commentLines.length).toBeGreaterThanOrEqual(3);
  });
});

// ============================================================================
// AC1: Dispatch Algorithm in SKILL.md
// ============================================================================

describe('AC1: Dispatch Algorithm Definition', () => {
  // Test 1.12: SKILL.md should define the dispatch algorithm steps
  test('[P0] SKILL.md should define the dispatch algorithm with ordered steps', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    // Should reference a multi-step algorithm
    expect(content).toMatch(/step\s*1|step\s*2|algorithm/i);
  });

  // Test 1.13: SKILL.md should read story type from frontmatter
  test('[P0] SKILL.md should describe reading story type from frontmatter', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/read.*type.*frontmatter|type.*from.*frontmatter|story.*type/i);
  });

  // Test 1.14: SKILL.md should read risk_level from frontmatter
  test('[P0] SKILL.md should describe reading risk_level from frontmatter', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/read.*risk_level.*frontmatter|risk_level.*from.*frontmatter|story.*risk_level/i);
  });

  // Test 1.15: SKILL.md should read domain_tags from frontmatter
  test('[P0] SKILL.md should describe reading domain_tags from frontmatter', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/read.*domain_tags.*frontmatter|domain_tags.*from.*frontmatter|story.*domain_tags/i);
  });

  // Test 1.16: SKILL.md should read depth from frontmatter
  test('[P0] SKILL.md should describe reading depth from frontmatter', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/read.*depth.*frontmatter|depth.*from.*frontmatter|story.*depth/i);
  });

  // Test 1.17: SKILL.md should reference dispatch-rules.yaml as the rules source
  test('[P0] SKILL.md should reference dispatch-rules.yaml data file', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/dispatch-rules\.yaml|dispatch-rules/i);
  });

  // Test 1.18: SKILL.md type-based rules should REPLACE default set
  test('[P0] SKILL.md should specify type-based rules REPLACE the default set', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/replace|override/i);
  });

  // Test 1.19: SKILL.md should define deduplication step
  test('[P1] SKILL.md should define deduplication of the agent list', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/dedup|deduplic|unique|duplicate/i);
  });
});

// ============================================================================
// AC1: Dispatcher Output Format
// ============================================================================

describe('AC1: Dispatcher Output Format', () => {
  // Test 1.20: SKILL.md should define structured output with agents array
  test('[P0] SKILL.md should define output format with agents array', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/agents:/);
  });

  // Test 1.21: SKILL.md should define output with dispatch_rationale
  test('[P0] SKILL.md should define output format with dispatch_rationale', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/dispatch_rationale/i);
  });

  // Test 1.22: SKILL.md should define output with skipped_agents array
  test('[P0] SKILL.md should define output format with skipped_agents array', () => {
    const content = readFileSync(DISPATCHER_SKILL, 'utf8');
    expect(content).toMatch(/skipped_agents/i);
  });
});

// ============================================================================
// AC1: refine-ticket.md Integration
// ============================================================================

describe('AC1: refine-ticket.md Integrates Agent Dispatcher', () => {
  // Test 1.23: refine-ticket.md should reference agent-dispatcher skill
  test('[P0] refine-ticket.md should reference agent-dispatcher skill', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/agent-dispatcher|agent dispatcher/i);
  });

  // Test 1.24: refine-ticket.md should have an "Agent Dispatch" section
  test('[P0] refine-ticket.md should have an "Agent Dispatch" section', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/agent.*dispatch/i);
  });

  // Test 1.25: refine-ticket.md Agent Dispatch should appear after depth detection
  test('[P0] refine-ticket.md Agent Dispatch should appear after depth detection', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    const depthIndex = content.search(/depth.*detect|depth.*determin/i);
    const dispatchIndex = content.search(/agent.*dispatch/i);
    expect(depthIndex).toBeGreaterThan(-1);
    expect(dispatchIndex).toBeGreaterThan(-1);
    expect(dispatchIndex).toBeGreaterThan(depthIndex);
  });

  // Test 1.26: refine-ticket.md spawns_agents should be dynamic (not hardcoded list)
  test('[P1] refine-ticket.md spawns_agents should indicate dynamic agent selection', () => {
    const content = readFileSync(REFINE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/dynamic|determined.*by.*dispatcher|agent-dispatcher/i);
  });
});

// ============================================================================
// AC1: Config.yaml Dispatch Flag
// ============================================================================

describe('AC1: Config.yaml Agent Dispatch Flag', () => {
  // Test 1.27: config.yaml should have agent_dispatch_enabled flag
  test('[P0] config.yaml should have agent_dispatch_enabled flag', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    expect(content).toMatch(/agent_dispatch_enabled/i);
  });

  // Test 1.28: agent_dispatch_enabled should default to true
  test('[P0] agent_dispatch_enabled should be set to true', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    expect(content).toMatch(/agent_dispatch_enabled:\s*true/i);
  });
});
