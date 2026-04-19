/**
 * ATDD Tests for AC4: Post-Migration Validation
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 5.2 - Implement CLI Update & Migration Command
 *
 * PRD References:
 * - FR-43: CLI update/migration with version detection, breaking change listing, YAML migration, post-validation
 *
 * AC4: Given the migration is complete
 *       When post-migration validation runs
 *       Then all YAML frontmatter is parseable
 *       And all `status_history` arrays are consistent
 *       And the validation report confirms success or lists remaining issues with actionable guidance
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths relative to this test file's location
const TEST_DIR = dirname(fileURLToPath(import.meta.url));
// TEST_DIR sits at src/cli/test/unit/cli-update; five levels up = repo root.
const PROJECT_ROOT = join(TEST_DIR, '../../../../..');
const CREATE_SCRUM_WORKFLOW_ROOT = join(PROJECT_ROOT, 'src', 'cli');
const UPDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'update.js');
const STORY_FILE = join(PROJECT_ROOT, '_scrum-output', 'implementation-artifacts', '5-2-implement-cli-update-migration-command.md');

// ============================================================================
// AC4: YAML Frontmatter Validation
// ============================================================================

describe('AC4: YAML Frontmatter Validation', () => {
  // Test 4.1: update.js should validate YAML frontmatter parseability
  test('[P0] update.js should validate YAML frontmatter is parseable', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/yaml|frontmatter|parse/i);
  });

  // Test 4.2: update.js should report YAML parsing failures
  test('[P0] update.js should report YAML parsing failures', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/yaml.*error|parse.*error|error.*yaml/i);
  });
});

// ============================================================================
// AC4: status_history Array Consistency Validation
// ============================================================================

describe('AC4: status_history Array Consistency Validation', () => {
  // Test 4.3: update.js should validate status_history array consistency
  test('[P0] update.js should validate status_history array consistency', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/status_history.*consisten|consisten.*status_history/i);
  });

  // Test 4.4: status_history entries should have required fields
  test('[P0] status_history entries should have required fields (from, to, trigger, actor)', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/status_history.*from|from.*status_history/);
    expect(content).toMatch(/status_history.*to|to.*status_history/);
    expect(content).toMatch(/status_history.*trigger|trigger.*status_history/);
    expect(content).toMatch(/status_history.*actor|actor.*status_history/);
  });

  // Test 4.5: update.js should check each status_history entry has required fields
  test('[P0] update.js should check each status_history entry has required fields', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/required.*field|field.*required|entry.*has/i);
  });
});

// ============================================================================
// AC4: Validation Report
// ============================================================================

describe('AC4: Validation Report', () => {
  // Test 4.6: update.js should generate a validation report
  test('[P0] update.js should generate a validation report', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/validation.*report|report.*validation|validation.*result/i);
  });

  // Test 4.7: Validation report should confirm success
  test('[P0] Validation report should confirm success when validation passes', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/validation.*success|success.*validation|validation.*pass/i);
  });

  // Test 4.8: Validation report should list remaining issues
  test('[P0] Validation report should list remaining issues when validation fails', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/validation.*fail|fail.*validation|issue.*found|remaining.*issue/i);
  });

  // Test 4.9: Validation report should provide actionable guidance
  test('[P0] Validation report should provide actionable guidance for issues', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/actionable|guidance|next.*step|fix.*suggest/i);
  });
});

// ============================================================================
// AC4: Story File References Post-Migration Validation
// ============================================================================

describe('AC4: Story File References Post-Migration Validation', () => {
  // Test 4.10: Story file should mention post-migration validation
  test('[P0] Story 5.2 should mention post-migration validation', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/post.*migration.*validation|validation.*post.*migration/i);
  });

  // Test 4.11: Story file should mention YAML frontmatter validation
  test('[P0] Story 5.2 should mention YAML frontmatter validation', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/yaml.*frontmatter.*validation|frontmatter.*parseable|validate.*yaml/i);
  });

  // Test 4.12: Story file should mention status_history consistency validation
  test('[P0] Story 5.2 should mention status_history consistency validation', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/status_history.*consisten|consisten.*status_history/i);
  });

  // Test 4.13: Story file should mention validation report with actionable guidance
  test('[P0] Story 5.2 should mention validation report with actionable guidance', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/actionable.*guidance|guidance.*actionable|validation.*report.*action/i);
  });
});
