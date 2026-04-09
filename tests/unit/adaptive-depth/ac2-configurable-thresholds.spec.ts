/**
 * ATDD Tests for AC2: Configurable Thresholds in config.yaml
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.2 - Implement Adaptive Workflow Depth Selection
 *
 * PRD References:
 * - FR-36: Configurable risk thresholds in config.yaml
 *
 * AC2: Given FR-36 specifies configurable risk thresholds in config.yaml,
 *      When the depth selection runs,
 *      Then the risk-to-depth mapping thresholds are read from config.yaml
 *       under a workflow_depth_thresholds section,
 *      And the thresholds can be customized by the developer
 *       (e.g., mapping medium risk to light depth for teams preferring faster cycles).
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONFIG_FILE = join(process.cwd(), 'scrum_workflow', 'config.yaml');
const DEPTH_SELECTOR_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'adaptive-depth-selector', 'SKILL.md');

// ============================================================================
// AC2: workflow_depth_thresholds Section in config.yaml
// ============================================================================

describe('AC2: Configurable Thresholds Section in config.yaml', () => {
  // Test 2.1: config.yaml should have workflow_depth_thresholds section
  test('[P0] config.yaml should contain workflow_depth_thresholds section', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    expect(content).toMatch(/workflow_depth_thresholds:/);
  });

  // Test 2.2: config.yaml should have low -> light mapping
  test('[P0] config.yaml workflow_depth_thresholds should map low to light', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    // Extract the thresholds section and verify low: light
    const thresholdsSection = content.match(/workflow_depth_thresholds:[\s\S]*?(?=\n[a-z_]|\n#[^#]|$)/);
    expect(thresholdsSection).not.toBeNull();
    expect(thresholdsSection![0]).toMatch(/low:\s*light/);
  });

  // Test 2.3: config.yaml should have medium -> standard mapping
  test('[P0] config.yaml workflow_depth_thresholds should map medium to standard', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    const thresholdsSection = content.match(/workflow_depth_thresholds:[\s\S]*?(?=\n[a-z_]|\n#[^#]|$)/);
    expect(thresholdsSection).not.toBeNull();
    expect(thresholdsSection![0]).toMatch(/medium:\s*standard/);
  });

  // Test 2.4: config.yaml should have high -> heavy mapping
  test('[P0] config.yaml workflow_depth_thresholds should map high to heavy', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    const thresholdsSection = content.match(/workflow_depth_thresholds:[\s\S]*?(?=\n[a-z_]|\n#[^#]|$)/);
    expect(thresholdsSection).not.toBeNull();
    expect(thresholdsSection![0]).toMatch(/high:\s*heavy/);
  });

  // Test 2.5: config.yaml should have critical -> heavy mapping
  test('[P0] config.yaml workflow_depth_thresholds should map critical to heavy', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    const thresholdsSection = content.match(/workflow_depth_thresholds:[\s\S]*?(?=\n[a-z_]|\n#[^#]|$)/);
    expect(thresholdsSection).not.toBeNull();
    expect(thresholdsSection![0]).toMatch(/critical:\s*heavy/);
  });
});

// ============================================================================
// AC2: Config Documentation and Customization Comments
// ============================================================================

describe('AC2: Configuration Documentation', () => {
  // Test 2.6: config.yaml thresholds section should have inline YAML comments
  test('[P1] config.yaml should have inline comments documenting each threshold', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    const thresholdsSection = content.match(/workflow_depth_thresholds:[\s\S]*?(?=\n[a-z_]|\n#[^#]|$)/);
    expect(thresholdsSection).not.toBeNull();
    // Should have comment on at least one line
    expect(thresholdsSection![0]).toMatch(/#/);
  });

  // Test 2.7: config.yaml should reference FR-33 and FR-36 in comments
  test('[P1] config.yaml threshold comments should reference FR-33 or FR-36', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    expect(content).toMatch(/FR-33|FR-36/);
  });

  // Test 2.8: config.yaml should document valid depth values in comments
  test('[P2] config.yaml should document valid depth values: light, standard, heavy', () => {
    const content = readFileSync(CONFIG_FILE, 'utf8');
    // Should have a comment listing valid values
    expect(content).toMatch(/[Vv]alid.*depth.*light.*standard.*heavy|light.*standard.*heavy/);
  });
});

// ============================================================================
// AC2: Skill Reads Thresholds from Config
// ============================================================================

describe('AC2: Depth Selector Reads Thresholds from Config', () => {
  // Test 2.9: SKILL.md should reference workflow_depth_thresholds from config.yaml
  test('[P0] SKILL.md should reference workflow_depth_thresholds from config.yaml', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/workflow_depth_thresholds/);
  });

  // Test 2.10: SKILL.md should describe reading config.yaml for thresholds
  test('[P0] SKILL.md should describe reading thresholds from config.yaml', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/config\.yaml|config/i);
  });

  // Test 2.11: SKILL.md should support customizable mappings (e.g., medium -> light)
  test('[P1] SKILL.md should describe that developers can customize mappings', () => {
    const content = readFileSync(DEPTH_SELECTOR_SKILL, 'utf8');
    expect(content).toMatch(/customiz|configur.*threshold|remap|override.*threshold/i);
  });
});

// ============================================================================
// AC2: Config Sync to create-scrum-workflow Copies
// ============================================================================

describe('AC2: Config Artifact Contract Sync', () => {
  const SYNC_TARGET_1 = join(process.cwd(), 'create-scrum-workflow', 'scrum_workflow', 'config.yaml');
  const SYNC_TARGET_2 = join(process.cwd(), 'create-scrum-workflow', 'templates', 'scrum_workflow', 'config.yaml');

  // Test 2.12: create-scrum-workflow/scrum_workflow/config.yaml should have thresholds
  test('[P0] create-scrum-workflow/scrum_workflow/config.yaml should have workflow_depth_thresholds', () => {
    const content = readFileSync(SYNC_TARGET_1, 'utf8');
    expect(content).toMatch(/workflow_depth_thresholds:/);
  });

  // Test 2.13: create-scrum-workflow/templates/scrum_workflow/config.yaml should have thresholds
  test('[P0] create-scrum-workflow/templates/scrum_workflow/config.yaml should have workflow_depth_thresholds', () => {
    const content = readFileSync(SYNC_TARGET_2, 'utf8');
    expect(content).toMatch(/workflow_depth_thresholds:/);
  });
});
