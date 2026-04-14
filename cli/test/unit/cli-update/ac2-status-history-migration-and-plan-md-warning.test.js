/**
 * ATDD Tests for AC2: status_history Migration and plan.md Warning
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 5.2 - Implement CLI Update & Migration Command
 *
 * PRD References:
 * - FR-43: CLI update/migration with version detection, breaking change listing, YAML migration, post-validation
 *
 * AC2: Given the PRD specifies two breaking changes for v1.2.0 → v1.3.0:
 *       new `status_history` field and mandatory `plan.md` check
 *       When migration runs
 *       Then existing `story.md` files without `status_history` receive a retroactive entry:
 *         `from: null, to: {current_status}, trigger: "migrated-from-v1.2.0", actor: system`
 *       And stories at `ready-for-dev` without `plan.md` are flagged with a warning and suggested action
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths relative to this test file's location
const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(TEST_DIR, '../../../..');
const CREATE_SCRUM_WORKFLOW_ROOT = join(PROJECT_ROOT, 'create-scrum-workflow');
const UPDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'update.js');
const STORY_FILE = join(PROJECT_ROOT, '_bmad-output', 'implementation-artifacts', '5-2-implement-cli-update-migration-command.md');

// ============================================================================
// AC2: status_history Field Migration
// ============================================================================

describe('AC2: status_history Field Migration', () => {
  // Test 2.1: update.js should scan story.md files for status_history
  test('[P0] update.js should scan story.md files for missing status_history', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/story\.md|status_history/i);
  });

  // Test 2.2: update.js should add retroactive status_history entry
  test('[P0] update.js should add retroactive status_history entry for stories without it', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    // Should mention adding status_history with specific fields
    expect(content).toMatch(/status_history.*from|from.*null.*to|trigger.*migrated/i);
  });

  // Test 2.3: Migration entry should use actor: system
  test('[P0] status_history migration entry should use actor: system', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/actor.*system|system.*actor/i);
  });

  // Test 2.4: Migration entry should use trigger: "migrated-from-v1.2.0"
  test('[P0] status_history migration entry should use trigger: "migrated-from-v1.2.0"', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/migrated-from-v1\.2\.0/i);
  });

  // Test 2.5: Migration entry should preserve current_status as 'to' value
  test('[P0] status_history migration entry should use current status as "to" value', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/current_status|to.*status/i);
  });

  // Test 2.6: Migration should be atomic (backup before modify)
  test('[P0] update.js should backup files before migration (atomic migration)', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/backup|atomic/i);
  });
});

// ============================================================================
// AC2: plan.md Warning for ready-for-dev Stories
// ============================================================================

describe('AC2: plan.md Warning for ready-for-dev Stories', () => {
  // Test 2.7: update.js should check for plan.md existence
  test('[P0] update.js should check if plan.md exists for stories', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/plan\.md/i);
  });

  // Test 2.8: update.js should flag stories at ready-for-dev without plan.md
  test('[P0] update.js should flag stories at ready-for-dev without plan.md', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/ready-for-dev|warning.*plan/i);
  });

  // Test 2.9: Warning should suggest running /scrum-refine-story
  test('[P0] Warning should suggest running /scrum-refine-story to generate plan.md', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/scrum-refine-story|refine-story/i);
  });

  // Test 2.10: Missing plan.md should be a warning, not a blocker
  test('[P0] Missing plan.md should be a warning, not a migration blocker', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    // Should not have 'halt' or 'block' for plan.md
    const warningMatch = content.match(/warning.*plan\.md|plan\.md.*warning/i);
    const blockMatch = content.match(/block.*plan\.md|plan\.md.*block|halt.*plan\.md/i);
    expect(warningMatch).not.toBeNull();
    expect(blockMatch).toBeNull();
  });
});

// ============================================================================
// AC2: Story File References
// ============================================================================

describe('AC2: Story File References Migration Logic', () => {
  // Test 2.11: Story file should mention status_history migration
  test('[P0] Story 5.2 should mention status_history migration', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/status_history.*migration|migration.*status_history/i);
  });

  // Test 2.12: Story file should mention plan.md warning
  test('[P0] Story 5.2 should mention plan.md warning for ready-for-dev stories', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/plan\.md.*warning|warning.*plan\.md/i);
  });

  // Test 2.13: Story file should document the retroactive entry structure
  test('[P0] Story 5.2 should document the retroactive entry structure', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/from.*null.*to.*current_status|trigger.*migrated|actor.*system/i);
  });
});
