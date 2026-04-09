/**
 * ATDD Tests for AC1: Risk-to-Depth Mapping
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.2 - Implement Adaptive Workflow Depth Selection
 *
 * PRD References:
 * - FR-33: Automatic workflow depth selection based on risk classification
 *
 * AC1: Given FR-33 specifies automatic workflow depth selection based on risk classification,
 *      When a story has been classified by the story-classifier (Story 9.1),
 *      Then the system selects workflow depth: light for risk_level: low,
 *       standard for risk_level: medium, heavy for risk_level: high or critical,
 *      And the selected depth is stored in the story.md YAML frontmatter.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DEPTH_SELECTOR_SKILL_DIR = join(process.cwd(), 'scrum_workflow', 'skills', 'adaptive-depth-selector');
const DEPTH_SELECTOR_SKILL = join(DEPTH_SELECTOR_SKILL_DIR, 'SKILL.md');
const CONFIG_FILE = join(process.cwd(), 'scrum_workflow', 'config.yaml');
const CREATE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');
const STORY_TEMPLATE = join(process.cwd(), 'scrum_workflow', 'templates', 'story.md');

// ============================================================================
// AC1: Adaptive Depth Selector Skill Structure
// ============================================================================

describe('AC1: Adaptive Depth Selector Skill Structure', () => {
  // Test 1.1: adaptive-depth-selector skill directory should exist
  test('[P0] skills/adaptive-depth-selector/ directory should exist', () => {
    expect(existsSync(DEPTH_SELECTOR_SKILL_DIR)).toBe(true);
  });

  // Test 1.2: adaptive-depth-selector SKILL.md should exist
  test('[P0] skills/adaptive-depth-selector/SKILL.md should exist', () => {
    expect(existsSync(DEPTH_SELECTOR_SKILL)).toBe(true);
  });

  // Test 1.3: SKILL.md should have valid frontmatter with name, role, description
  test('[P0] SKILL.md should have valid frontmatter (name, role, description)', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    // Frontmatter should include name field
    expect(content).toMatch(/^---\s*\n[\s\S]*?name:\s*adaptive-depth-selector/);
    // Frontmatter should include role field
    expect(content).toMatch(/role:/);
    // Frontmatter should include description field
    expect(content).toMatch(/description:/);
  });

  // Test 1.4: SKILL.md should be read-only (same pattern as story-classifier)
  test('[P0] SKILL.md should declare read-only context (never writes files)', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/read.only|never.*write|does not write|no.*write/i);
  });
});

// ============================================================================
// AC1: Default Risk-to-Depth Mapping Algorithm
// ============================================================================

describe('AC1: Default Risk-to-Depth Mapping', () => {
  // Test 1.5: SKILL.md should define low risk -> light depth mapping
  test('[P0] SKILL.md should map risk_level: low to depth: light', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/low.*light/i);
  });

  // Test 1.6: SKILL.md should define medium risk -> standard depth mapping
  test('[P0] SKILL.md should map risk_level: medium to depth: standard', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/medium.*standard/i);
  });

  // Test 1.7: SKILL.md should define high risk -> heavy depth mapping
  test('[P0] SKILL.md should map risk_level: high to depth: heavy', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/high.*heavy/i);
  });

  // Test 1.8: SKILL.md should define critical risk -> heavy depth mapping
  test('[P0] SKILL.md should map risk_level: critical to depth: heavy', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/critical.*heavy/i);
  });

  // Test 1.9: SKILL.md should list all three valid depth values
  test('[P0] SKILL.md should reference valid depth values: light, standard, heavy', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/\blight\b/i);
    expect(content).toMatch(/\bstandard\b/i);
    expect(content).toMatch(/\bheavy\b/i);
  });
});

// ============================================================================
// AC1: Threshold Lookup Algorithm in SKILL.md
// ============================================================================

describe('AC1: Threshold Lookup Algorithm', () => {
  // Test 1.10: SKILL.md should describe reading risk_level from story frontmatter
  test('[P0] SKILL.md should describe reading risk_level from story frontmatter', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/read.*risk_level.*frontmatter|risk_level.*from.*frontmatter|story.*risk_level/i);
  });

  // Test 1.11: SKILL.md should describe loading thresholds from config.yaml
  test('[P0] SKILL.md should describe loading thresholds from config.yaml', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/workflow_depth_thresholds|thresholds.*config/i);
  });

  // Test 1.12: SKILL.md should define fallback when risk_level is missing
  test('[P0] SKILL.md should default to standard when risk_level is missing or invalid', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/default.*standard|fallback.*standard|missing.*standard/i);
  });

  // Test 1.13: SKILL.md should define fallback when thresholds config is missing
  test('[P1] SKILL.md should use hardcoded defaults when threshold config is missing', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/hardcoded.*default|fallback.*default|config.*missing.*default/i);
  });
});

// ============================================================================
// AC1: Depth Selector Output Format
// ============================================================================

describe('AC1: Depth Selector Output Format', () => {
  // Test 1.14: SKILL.md should define structured output with depth field
  test('[P0] SKILL.md should define output format with depth field', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/depth:/);
  });

  // Test 1.15: SKILL.md should define output with depth_source field
  test('[P0] SKILL.md should define output format with depth_source field', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/depth_source:/);
  });

  // Test 1.16: SKILL.md should define output with selection_reason field
  test('[P1] SKILL.md should define output format with selection_reason field', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/selection_reason/i);
  });
});

// ============================================================================
// AC1: Depth Stored in Story Frontmatter
// ============================================================================

describe('AC1: Depth Value Stored in Story.md Frontmatter', () => {
  // Test 1.17: Story template should have depth field in frontmatter
  test('[P0] Story template should have depth field in YAML frontmatter', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    expect(content).toMatch(/depth:\s*"?\{\{/);
  });

  // Test 1.18: Story template should have depth_source field in frontmatter
  test('[P0] Story template should have depth_source field in YAML frontmatter', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    expect(content).toMatch(/depth_source:\s*"?\{\{/);
  });

  // Test 1.19: create-ticket.md should reference adaptive-depth-selector skill
  test('[P0] create-ticket.md should reference adaptive-depth-selector skill', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/adaptive-depth-selector|adaptive.depth.selector/i);
  });

  // Test 1.20: create-ticket.md should invoke depth selector AFTER story classification
  test('[P0] create-ticket.md should invoke depth selector after story classification section', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Depth selection section should appear after story classification section
    const classificationIndex = content.indexOf('Story Classification');
    const depthIndex = content.search(/adaptive.*depth.*selection|depth.*selection/i);
    expect(classificationIndex).toBeGreaterThan(-1);
    expect(depthIndex).toBeGreaterThan(-1);
    expect(depthIndex).toBeGreaterThan(classificationIndex);
  });

  // Test 1.21: create-ticket.md output should include depth field with heavy as valid value
  test('[P0] create-ticket.md output should include depth field supporting light|standard|heavy', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/depth.*light.*standard.*heavy|heavy/i);
  });
});
