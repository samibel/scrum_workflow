/**
 * ATDD Tests for AC3: User Modification Preservation via Lock File
 *
 * TDD Phase: RED (tests written written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 5.2 - Implement CLI Update & Migration Command
 *
 * PRD References:
 * - NFR-16: Update safety — user modifications preserved via lock file
 *
 * AC3: Given NFR-16 specifies update safety: user modifications are never overwritten
 *       When migration updates framework files
 *       Then custom skills, agents, and workflows are preserved
 *       And the lock file tracks user-modified files and skips them during update
 *       And an update report lists all preserved files, migrated files, and any manual actions required
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths relative to this test file's location
const TEST_DIR = dirname(fileURLToPath(import.meta.url));
// TEST_DIR sits at src/cli/test/unit/cli-update; five levels up = repo root.
const PROJECT_ROOT = join(TEST_DIR, '../../../../..');
const CREATE_SCRUM_WORKFLOW_ROOT = join(PROJECT_ROOT, 'src', 'cli');
const UPDATE_CMD_PATH = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'commands', 'update.js');
const LOCK_FILE_MODULE = join(CREATE_SCRUM_WORKFLOW_ROOT, 'src', 'integrity', 'lock-file.js');
const STORY_FILE = join(PROJECT_ROOT, '_bmad-output', 'implementation-artifacts', '5-2-implement-cli-update-migration-command.md');

// ============================================================================
// AC3: Lock File Mechanism
// ============================================================================

describe('AC3: Lock File Mechanism for User Modification Tracking', () => {
  // Test 3.1: Lock file module should exist
  test('[P0] Lock file module should exist at src/integrity/lock-file.js', () => {
    expect(existsSync(LOCK_FILE_MODULE)).toBe(true);
  });

  // Test 3.2: update.js should import lock-file module
  test('[P0] update.js should import lock-file module', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/lock-file|readLockFile|writeLockFile/i);
  });

  // Test 3.3: Lock file should track file hashes
  test('[P0] Lock file should track file hashes for integrity checking', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/hash|sha256|checksum/i);
  });

  // Test 3.4: update.js should compare current hashes with stored hashes
  test('[P0] update.js should compare current file hashes with stored hashes', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/hashFile|hash.*current|current.*hash/i);
  });

  // Test 3.5: User-modified files should be identified by hash mismatch
  test('[P0] update.js should identify user-modified files by hash mismatch', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/userModified|user.?modified|modified.*files/i);
  });
});

// ============================================================================
// AC3: User Modification Preservation During Update
// ============================================================================

describe('AC3: User Modification Preservation During Update', () => {
  // Test 3.6: update.js should backup user-modified files before overwriting
  test('[P0] update.js should backup user-modified files before overwriting', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/backup|copySync.*backup/i);
  });

  // Test 3.7: update.js should restore user-modified files after framework update
  test('[P0] update.js should restore user-modified files after framework update', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/restore|restore.*user|user.*restore/i);
  });

  // Test 3.8: Custom skills should be preserved
  test('[P0] update.js should preserve custom skills', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/skills|skills.*preserve|preserve.*skills/i);
  });

  // Test 3.9: Custom agents should be preserved
  test('[P0] update.js should preserve custom agents', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/agents|agent.*preserve|preserve.*agent/i);
  });

  // Test 3.10: Custom workflows should be preserved
  test('[P0] update.js should preserve custom workflows', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/workflow|workflow.*preserve|preserve.*workflow/i);
  });

  // Test 3.11: update.js should skip user-modified files during framework overwrite
  test('[P0] update.js should skip user-modified files during framework overwrite', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/skip.*user|user.*skip|preserve.*files/i);
  });
});

// ============================================================================
// AC3: Update Report
// ============================================================================

describe('AC3: Update Report with Preserved and Migrated Files', () => {
  // Test 3.12: update.js should generate an update report
  test('[P0] update.js should generate an update report', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/report|summary|log\.info.*update/i);
  });

  // Test 3.13: Update report should list preserved files
  test('[P0] Update report should list preserved (user-modified) files', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/preserved.*files|files.*preserved/i);
  });

  // Test 3.14: Update report should list migrated/updated files
  test('[P0] Update report should list migrated/updated files', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/updated.*files|files.*updated|migrated.*files/i);
  });

  // Test 3.15: Update report should list manual actions required
  test('[P0] Update report should list any manual actions required', () => {
    const content = readFileSync(UPDATE_CMD_PATH, 'utf8');
    expect(content).toMatch(/manual.*action|action.*required|manual/i);
  });
});

// ============================================================================
// AC3: NFR-16 Compliance
// ============================================================================

describe('AC3: NFR-16 Update Safety Compliance', () => {
  // Test 3.16: Story file should reference NFR-16
  test('[P0] Story 5.2 should reference NFR-16 update safety requirement', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/NFR-16/i);
  });

  // Test 3.17: Story file should document lock file mechanism
  test('[P0] Story 5.2 should document lock file mechanism for update safety', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/lock.*file|lock.*mechanism/i);
  });

  // Test 3.18: Story file should document user modification preservation
  test('[P0] Story 5.2 should document user modification preservation', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/user.*modification|modification.*preserved|preserved.*modification/i);
  });
});
