/**
 * ATDD Tests for AC1: Version Detection and Breaking Changes Listing
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 5.2 - Implement CLI Update & Migration Command
 *
 * PRD References:
 * - FR-43: CLI update/migration with version detection, breaking change listing, YAML migration, post-validation
 *
 * AC1: Given FR-43 specifies CLI update with version detection, breaking change listing,
 *      YAML migration, and post-validation When a developer runs `npx cli@latest update`
 *      Then the CLI detects the current installed version
 *      And lists all breaking changes between the installed version and the target version
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths relative to this test file's location
const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(TEST_DIR, '../../../..');
const CREATE_SCRUM_WORKFLOW_ROOT = join(PROJECT_ROOT, 'cli');
const UPDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'update.js');
const STORY_FILE = join(PROJECT_ROOT, '_bmad-output', 'implementation-artifacts', '5-2-implement-cli-update-migration-command.md');
const BREAKING_CHANGES_DOC = join(CREATE_SCRUM_WORKFLOW_ROOT, 'breaking-changes.md');

// ============================================================================
// AC1: Version Detection Implementation
// ============================================================================

describe('AC1: Version Detection in Update Command', () => {
  // Test 1.1: update.js should import package.json for version detection
  test('[P0] update.js should import package.json for version detection', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/require.*package\.json|import.*package\.json.*from/i);
  });

  // Test 1.2: update.js should have a version detection mechanism
  test('[P0] update.js should detect installed version from lock file or package.json', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/version|installed.*version/i);
  });

  // Test 1.3: Story file should mention version detection
  test('[P0] Story 5.2 should mention version detection', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/version.*detect|detect.*version/i);
  });
});

// ============================================================================
// AC1: Breaking Changes Documentation
// ============================================================================

describe('AC1: Breaking Changes Documentation', () => {
  // Test 1.4: breaking-changes.md should exist for v1.2.0 → v1.3.0
  test('[P0] breaking-changes.md should exist', () => {
    expect(existsSync(BREAKING_CHANGES_DOC)).toBe(true);
  });

  // Test 1.5: breaking-changes.md should document status_history field addition
  test('[P0] breaking-changes.md should document status_history field as breaking change', () => {
    const content = readFileSync(BREAKING_CHANGES_DOC, 'utf8');
    expect(content).toMatch(/status_history/i);
  });

  // Test 1.6: breaking-changes.md should document plan.md check requirement
  test('[P0] breaking-changes.md should document plan.md check as breaking change', () => {
    const content = readFileSync(BREAKING_CHANGES_DOC, 'utf8');
    expect(content).toMatch(/plan\.md/i);
  });

  // Test 1.7: Breaking changes should mention v1.2.0 → v1.3.0 migration
  test('[P0] breaking-changes.md should mention version migration path', () => {
    const content = readFileSync(BREAKING_CHANGES_DOC, 'utf8');
    expect(content).toMatch(/v1\.2\.0.*v1\.3\.0|v1\.3\.0.*v1\.2\.0|1\.2\.0.*1\.3\.0/i);
  });
});

// ============================================================================
// AC1: --dry-run Mode for Preview
// ============================================================================

describe('AC1: --dry-run Mode for Preview', () => {
  // Test 1.8: update.js should support --dry-run option
  test('[P0] update.js should support --dry-run option to preview changes', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/dry.?run|dryRun|--dry-run/i);
  });

  // Test 1.9: Story file should mention --dry-run mode
  test('[P0] Story 5.2 should mention --dry-run mode', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/--dry-run|dry.?run/i);
  });
});

// ============================================================================
// AC1: Story File Implementation References
// ============================================================================

describe('AC1: Story File References Update Command', () => {
  // Test 1.10: Story file should reference the update.js command
  test('[P1] Story 5.2 should reference update command implementation', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/update\.js|update.*command/i);
  });

  // Test 1.11: Story file should reference breaking-changes.md
  test('[P1] Story 5.2 should reference breaking-changes documentation', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/breaking.?changes|breaking.?change.?md/i);
  });
});
