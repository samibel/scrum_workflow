/**
 * ATDD Tests for AC3: Developer Notification and Override
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.2 - Implement Adaptive Workflow Depth Selection
 *
 * PRD References:
 * - SC-12: Process bypass rate = 0 (adaptive workflow depth works)
 * - FR-3: Manual depth override (--depth flag)
 *
 * AC3: Given SC-12 specifies process bypass rate = 0,
 *      When depth is automatically selected,
 *      Then the developer is informed of the selected depth via a console message,
 *      And the developer can override it via --depth flag,
 *      And the depth_source field in frontmatter records whether selection
 *       was automatic (classifier) or manual (adaptive-workflow-override).
 *
 * AC4: Given the developer wants to override the automatic classification,
 *      When the developer provides a --depth light|standard|heavy flag,
 *      Then the manual override takes precedence over automatic classification,
 *      And depth_source: adaptive-workflow-override is set,
 *      And the override mechanism accepts: --depth light, --depth standard,
 *       or --depth heavy.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CREATE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');
const DEPTH_SELECTOR_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'adaptive-depth-selector', 'SKILL.md');
const STORY_TEMPLATE = join(process.cwd(), 'scrum_workflow', 'templates', 'story.md');

// ============================================================================
// AC3: Console Notification of Auto-Selected Depth
// ============================================================================

describe('AC3: Developer Notification of Auto-Selected Depth', () => {
  // Test 3.1: create-ticket.md should document console output for auto-selected depth
  test('[P0] create-ticket.md should specify console message for auto-selected depth', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Per AC3: "Depth auto-selected: heavy (risk: high)" format
    expect(content).toMatch(/[Dd]epth auto-selected|depth.*auto.*select|inform.*developer.*depth/i);
  });

  // Test 3.2: Console message should include the selected depth value
  test('[P1] Console message should include the selected depth value', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/[Dd]epth.*auto.*selected.*:.*\(risk.*:/i);
  });

  // Test 3.3: Console message should include the risk level that triggered the selection
  test('[P1] Console message should include the risk level', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/risk.*:.*low|risk.*:.*medium|risk.*:.*high|risk.*:.*critical/i);
  });
});

// ============================================================================
// AC3: depth_source Field Tracking
// ============================================================================

describe('AC3: depth_source Field Records Selection Source', () => {
  // Test 3.4: create-ticket.md output should include depth_source field
  test('[P0] create-ticket.md output should include depth_source field', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/depth_source/);
  });

  // Test 3.5: depth_source should be "classifier" for automatic selection
  test('[P0] depth_source should be "classifier" for automatic depth selection', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/depth_source.*classifier|classifier.*depth_source/i);
  });

  // Test 3.6: depth_source should be "adaptive-workflow-override" for manual override
  test('[P0] depth_source should be "adaptive-workflow-override" for manual --depth flag', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/adaptive-workflow-override/);
  });

  // Test 3.7: Story template should have depth_source field with placeholder
  test('[P0] Story template should have depth_source field with template placeholder', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    expect(content).toMatch(/depth_source:\s*"?\{\{/);
  });
});

// ============================================================================
// AC4: Manual --depth Override Takes Precedence
// ============================================================================

describe('AC4: Manual --depth Override Precedence', () => {
  // Test 3.8: create-ticket.md should document --depth flag accepts light, standard, heavy
  test('[P0] create-ticket.md input should accept --depth light|standard|heavy', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Input section should mention all three valid depth values
    expect(content).toMatch(/--depth\s+(light\|standard\|heavy|light.*standard.*heavy)/i);
  });

  // Test 3.9: create-ticket.md should specify manual override skips depth selector
  test('[P0] create-ticket.md should specify --depth flag skips automatic depth selection', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/--depth.*skip.*selector|override.*skip.*depth.*select|--depth.*flag.*precedence/i);
  });

  // Test 3.10: Override precedence documented: --depth flag > depth selector > default
  test('[P0] create-ticket.md should document override precedence order', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Should express precedence: flag > selector > default
    expect(content).toMatch(/precedence|priority|override.*order|flag.*>.*selector|flag.*>.*auto/i);
  });

  // Test 3.11: create-ticket.md error handling should accept heavy as valid depth
  test('[P0] create-ticket.md error handling should accept heavy as valid depth value', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Error section should list heavy as valid alongside light and standard
    const errorSection = content.match(/[Ii]nvalid [Dd]epth[\s\S]*?(?=###|$)/);
    expect(errorSection).not.toBeNull();
    expect(errorSection![0]).toMatch(/heavy/i);
  });

  // Test 3.12: create-ticket.md invalid depth error should list all three valid values
  test('[P1] create-ticket.md invalid depth error should list light, standard, and heavy', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    const errorSection = content.match(/[Ii]nvalid [Dd]epth[\s\S]*?(?=###|$)/);
    expect(errorSection).not.toBeNull();
    expect(errorSection![0]).toMatch(/light/i);
    expect(errorSection![0]).toMatch(/standard/i);
    expect(errorSection![0]).toMatch(/heavy/i);
  });
});

// ============================================================================
// AC4: Integration Flow: Classifier -> Depth Selector
// ============================================================================

describe('AC4: Integration Flow in create-ticket', () => {
  // Test 3.13: create-ticket.md should describe flow: classifier runs first, then depth selector
  test('[P0] create-ticket.md should describe classifier -> depth selector flow', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Should describe that classifier runs first, populates risk_level, then depth selector reads it
    expect(content).toMatch(/classif.*risk_level.*depth|risk_level.*depth.*select/i);
  });

  // Test 3.14: create-ticket.md Adaptive Depth Selection section should exist
  test('[P0] create-ticket.md should have an Adaptive Depth Selection section', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/##.*[Aa]daptive [Dd]epth [Ss]election/);
  });

  // Test 3.15: If no --depth flag AND no classifier, fallback to standard depth
  test('[P1] create-ticket.md should specify default depth as standard when no flag and no classifier', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/default.*standard|standard.*default/i);
  });
});

// ============================================================================
// AC3/AC4: Sync to create-scrum-workflow Copies
// ============================================================================

describe('AC3/AC4: create-ticket.md Artifact Contract Sync', () => {
  const SYNC_TARGET_1 = join(process.cwd(), 'create-scrum-workflow', 'scrum_workflow', 'commands', 'create-ticket.md');
  const SYNC_TARGET_2 = join(process.cwd(), 'create-scrum-workflow', 'templates', 'scrum_workflow', 'commands', 'create-ticket.md');

  // Test 3.16: create-scrum-workflow/.../create-ticket.md should have depth selection section
  test('[P0] create-scrum-workflow/scrum_workflow/commands/create-ticket.md should have depth selection', () => {
    const content = readFileSync(SYNC_TARGET_1, 'utf8');
    expect(content).toMatch(/adaptive-depth-selector|[Aa]daptive [Dd]epth [Ss]election/i);
  });

  // Test 3.17: create-scrum-workflow/templates/.../create-ticket.md should have depth selection section
  test('[P0] create-scrum-workflow/templates/.../create-ticket.md should have depth selection', () => {
    const content = readFileSync(SYNC_TARGET_2, 'utf8');
    expect(content).toMatch(/adaptive-depth-selector|[Aa]daptive [Dd]epth [Ss]election/i);
  });
});
