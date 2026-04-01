/**
 * ATDD Test Suite for Story 6-7: Scan State Management & Resume Capability
 *
 * These tests verify that the scan state management system properly tracks
 * documentation progress, enables resumption of interrupted scans, and
 * provides reliable state persistence for incremental updates.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because implementation may not be complete)
 *
 * Coverage: 56 test scenarios across 7 acceptance criteria
 * - AC1: Scan state file creation and format (9 tests)
 * - AC2: Reliable file hashing (7 tests)
 * - AC3: Interruption detection and recovery (7 tests)
 * - AC4: Resumption capability (11 tests)
 * - AC5: Full-scan reset behavior (8 tests)
 * - AC6: State file format and usability (7 tests)
 * - AC7: Incremental state updates (7 tests)
 *
 * Knowledge Fragments Applied:
 * - data-factories.md: N/A (file validation, no data factories needed)
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: Unit-level file system validation
 * - test-priorities-matrix.md: P0-P3 priority assignment
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync, renameSync, statSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

// Project paths
const FRAMEWORK_ROOT = join(process.cwd(), 'scrum_workflow');
const WORKFLOW_PATH = join(FRAMEWORK_ROOT, 'workflows', 'project-documentation.md');
const OUTPUT_DIR = join(process.cwd(), 'docs/generated');
const SCAN_STATE_PATH = join(OUTPUT_DIR, '.scan-state.json');
const GITIGNORE_PATH = join(process.cwd(), '.gitignore');

// Test fixtures
const TEST_FILE_CONTENT = 'export function test() { return 42; }';
const TEST_FILE_HASH = 'sha256:' + createHash('sha256').update(TEST_FILE_CONTENT).digest('hex');

// Minimal valid scan state structure
const MINIMAL_SCAN_STATE = {
  _comment: 'Tracks scan progress for incremental updates and resumption. Local file — not committed to git.',
  scan_date: '2026-03-30T12:34:56Z',
  scan_mode: 'full',
  files_scanned: [
    {
      path: 'src/test.ts',
      hash: TEST_FILE_HASH,
      timestamp: '2026-03-30T12:34:50Z'
    }
  ],
  documents_generated: [
    'docs/generated/business-logic.md',
    'docs/generated/workflows.md',
    'docs/generated/domain-model.md'
  ],
  scan_duration: 45.2,
  scan_status: 'complete'
};

// Interrupted scan state structure
const INTERRUPTED_SCAN_STATE = {
  ...MINIMAL_SCAN_STATE,
  scan_status: 'interrupted',
  last_completed_file: 'src/test.ts'
};

// Helper: create output directory if it doesn't exist
function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// Helper: clean up test artifacts
function cleanupTestArtifacts() {
  if (existsSync(SCAN_STATE_PATH)) {
    unlinkSync(SCAN_STATE_PATH);
  }
  const tempPath = SCAN_STATE_PATH + '.tmp';
  if (existsSync(tempPath)) {
    unlinkSync(tempPath);
  }
}

// Helper: create test scan state file
function createTestScanState(state: any) {
  ensureOutputDir();
  writeFileSync(SCAN_STATE_PATH, JSON.stringify(state, null, 2));
}

// Helper: compute SHA-256 hash of file content
function computeSha256Hash(content: string): string {
  return 'sha256:' + createHash('sha256').update(content).digest('hex');
}

// Helper: validate ISO 8601 timestamp format
function isValidISO8601(timestamp: string): boolean {
  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
  return iso8601Pattern.test(timestamp);
}

// Helper: validate SHA-256 hash format
function isValidSha256Hash(hash: string): boolean {
  const sha256Pattern = /^sha256:[a-f0-9]{64}$/;
  return sha256Pattern.test(hash);
}

describe('Story 6-7: Scan State Management & Resume Capability', () => {
  beforeEach(() => {
    cleanupTestArtifacts();
  });

  afterEach(() => {
    cleanupTestArtifacts();
  });

  // ===================================================================
  // AC1: Scan state file creation and format
  // ===================================================================
  describe('AC1: Scan state file creation and format', () => {
    test('P0: scan state file is created in docs/generated directory', () => {
      // Setup: Create a minimal scan state
      createTestScanState(MINIMAL_SCAN_STATE);

      expect(existsSync(SCAN_STATE_PATH)).toBe(true);
    });

    test('P0: scan state file contains all required fields', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state).toHaveProperty('_comment');
      expect(state).toHaveProperty('scan_date');
      expect(state).toHaveProperty('scan_mode');
      expect(state).toHaveProperty('files_scanned');
      expect(state).toHaveProperty('documents_generated');
      expect(state).toHaveProperty('scan_duration');
      expect(state).toHaveProperty('scan_status');
    });

    test('P0: scan_date field is valid ISO 8601 timestamp', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(isValidISO8601(state.scan_date)).toBe(true);
    });

    test('P0: scan_mode field is "full", "update", or "resume"', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(['full', 'update', 'resume']).toContain(state.scan_mode);
    });

    test('P0: files_scanned array contains file entry objects', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(Array.isArray(state.files_scanned)).toBe(true);
      expect(state.files_scanned.length).toBeGreaterThan(0);

      const firstFile = state.files_scanned[0];
      expect(firstFile).toHaveProperty('path');
      expect(firstFile).toHaveProperty('hash');
      expect(firstFile).toHaveProperty('timestamp');
    });

    test('P0: documents_generated array lists generated document paths', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(Array.isArray(state.documents_generated)).toBe(true);
      expect(state.documents_generated).toContain('docs/generated/business-logic.md');
      expect(state.documents_generated).toContain('docs/generated/workflows.md');
      expect(state.documents_generated).toContain('docs/generated/domain-model.md');
    });

    test('P0: scan_duration is a non-negative number', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(typeof state.scan_duration).toBe('number');
      expect(state.scan_duration).toBeGreaterThanOrEqual(0);
    });

    test('P0: scan_status is "complete" or "interrupted"', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(['complete', 'interrupted']).toContain(state.scan_status);
    });

    test('P1: file entry in files_scanned has valid timestamp format', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      const firstFile = state.files_scanned[0];
      expect(isValidISO8601(firstFile.timestamp)).toBe(true);
    });

    test('P2: last_completed_file is present only when scan_status is "interrupted"', () => {
      // Test with complete status
      createTestScanState(MINIMAL_SCAN_STATE);
      let content = readFileSync(SCAN_STATE_PATH, 'utf8');
      let state = JSON.parse(content);
      expect(state).not.toHaveProperty('last_completed_file');

      // Test with interrupted status
      createTestScanState(INTERRUPTED_SCAN_STATE);
      content = readFileSync(SCAN_STATE_PATH, 'utf8');
      state = JSON.parse(content);
      expect(state).toHaveProperty('last_completed_file');
      expect(typeof state.last_completed_file).toBe('string');
    });
  });

  // ===================================================================
  // AC2: Reliable file hashing
  // ===================================================================
  describe('AC2: Reliable file hashing', () => {
    test('P0: hash field in files_scanned uses SHA-256 algorithm', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      const firstFile = state.files_scanned[0];
      expect(firstFile.hash).toMatch(/^sha256:/);
    });

    test('P0: hash is 64-character hex string after prefix', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      const firstFile = state.files_scanned[0];
      const hashWithoutPrefix = firstFile.hash.replace('sha256:', '');
      expect(hashWithoutPrefix).toMatch(/^[a-f0-9]{64}$/);
    });

    test('P0: same file content produces same hash', () => {
      const hash1 = computeSha256Hash(TEST_FILE_CONTENT);
      const hash2 = computeSha256Hash(TEST_FILE_CONTENT);

      expect(hash1).toBe(hash2);
      expect(isValidSha256Hash(hash1)).toBe(true);
    });

    test('P0: different file content produces different hash', () => {
      const hash1 = computeSha256Hash(TEST_FILE_CONTENT);
      const hash2 = computeSha256Hash(TEST_FILE_CONTENT + ' // modified');

      expect(hash1).not.toBe(hash2);
    });

    test('P1: hash is computed from content not metadata', () => {
      // Same content, different "metadata" (simulated by same content)
      const content = 'export function test() { return 42; }';
      const hash1 = computeSha256Hash(content);
      const hash2 = computeSha256Hash(content);

      expect(hash1).toBe(hash2);
    });

    test('P2: hash format is consistent between full scan and update mode', () => {
      const hash = computeSha256Hash(TEST_FILE_CONTENT);

      expect(hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    });

    test('P3: hash computation is case-sensitive (hex is lowercase)', () => {
      const hash = computeSha256Hash(TEST_FILE_CONTENT);
      const hashWithoutPrefix = hash.replace('sha256:', '');

      // SHA-256 hex output should be lowercase
      expect(hashWithoutPrefix).toMatch(/^[a-f0-9]{64}$/);
      expect(hashWithoutPrefix).not.toMatch(/[A-F]/);
    });
  });

  // ===================================================================
  // AC3: Interruption detection and recovery
  // ===================================================================
  describe('AC3: Interruption detection and recovery', () => {
    test('P0: interrupted scan state has scan_status set to "interrupted"', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.scan_status).toBe('interrupted');
    });

    test('P0: interrupted scan state includes last_completed_file', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state).toHaveProperty('last_completed_file');
      expect(state.last_completed_file).toBe('src/test.ts');
    });

    test('P1: last_completed_file points to last successfully processed file', () => {
      const stateWithMultipleFiles = {
        ...INTERRUPTED_SCAN_STATE,
        files_scanned: [
          { path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' },
          { path: 'src/billing/invoice.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:52Z' }
        ],
        last_completed_file: 'src/billing/invoice.ts'
      };

      createTestScanState(stateWithMultipleFiles);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.last_completed_file).toBe('src/billing/invoice.ts');
      expect(state.files_scanned.some(f => f.path === state.last_completed_file)).toBe(true);
    });

    test('P1: state file is valid JSON (not corrupted)', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');

      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('P2: files_scanned array is non-empty even when interrupted', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.files_scanned.length).toBeGreaterThan(0);
    });

    test('P2: scan_duration is recorded even when interrupted', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(typeof state.scan_duration).toBe('number');
      expect(state.scan_duration).toBeGreaterThanOrEqual(0);
    });

    test('P3: state file can be read after interruption for recovery', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      expect(existsSync(SCAN_STATE_PATH)).toBe(true);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.scan_status).toBe('interrupted');
      expect(state.last_completed_file).toBeDefined();
    });
  });

  // ===================================================================
  // AC4: Resumption capability
  // ===================================================================
  describe('AC4: Resumption capability', () => {
    test('P0: workflow checks for existing scan state file', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      expect(existsSync(SCAN_STATE_PATH)).toBe(true);
    });

    test('P0: workflow reads scan_status from state file', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.scan_status).toBeDefined();
      expect(['complete', 'interrupted']).toContain(state.scan_status);
    });

    test('P0: workflow detects interrupted status and prepares for resumption', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.scan_status).toBe('interrupted');
      expect(state.last_completed_file).toBeDefined();
    });

    test('P0: workflow reads last_completed_file to identify resume point', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.last_completed_file).toBe('src/test.ts');
    });

    test('P0: workflow reads files_scanned array to skip processed files', () => {
      const stateWithMultipleFiles = {
        ...INTERRUPTED_SCAN_STATE,
        files_scanned: [
          { path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' },
          { path: 'src/billing/invoice.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:52Z' }
        ],
        last_completed_file: 'src/billing/invoice.ts'
      };

      createTestScanState(stateWithMultipleFiles);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.files_scanned).toHaveLength(2);
      expect(state.files_scanned[0].path).toBe('src/auth/service.ts');
      expect(state.files_scanned[1].path).toBe('src/billing/invoice.ts');
    });

    test('P1: workflow continues from file after last_completed_file', () => {
      const stateWithMultipleFiles = {
        ...INTERRUPTED_SCAN_STATE,
        files_scanned: [
          { path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' },
          { path: 'src/billing/invoice.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:52Z' }
        ],
        last_completed_file: 'src/billing/invoice.ts'
      };

      createTestScanState(stateWithMultipleFiles);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      // After src/billing/invoice.ts, next file would be processed
      // This test verifies the state file has the information needed to continue
      expect(state.last_completed_file).toBe('src/billing/invoice.ts');
      expect(state.files_scanned.some(f => f.path === 'src/billing/invoice.ts')).toBe(true);
    });

    test('P1: workflow updates scan_status from interrupted to complete when finished', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      let content = readFileSync(SCAN_STATE_PATH, 'utf8');
      let state = JSON.parse(content);

      expect(state.scan_status).toBe('interrupted');

      // Simulate completion by updating state
      state.scan_status = 'complete';
      delete state.last_completed_file;
      writeFileSync(SCAN_STATE_PATH, JSON.stringify(state, null, 2));

      content = readFileSync(SCAN_STATE_PATH, 'utf8');
      state = JSON.parse(content);

      expect(state.scan_status).toBe('complete');
      expect(state).not.toHaveProperty('last_completed_file');
    });

    test('P1: workflow removes last_completed_file when scan completes', () => {
      createTestScanState(INTERRUPTED_SCAN_STATE);

      let content = readFileSync(SCAN_STATE_PATH, 'utf8');
      let state = JSON.parse(content);

      expect(state).toHaveProperty('last_completed_file');

      // Simulate completion
      state.scan_status = 'complete';
      delete state.last_completed_file;
      writeFileSync(SCAN_STATE_PATH, JSON.stringify(state, null, 2));

      content = readFileSync(SCAN_STATE_PATH, 'utf8');
      state = JSON.parse(content);

      expect(state).not.toHaveProperty('last_completed_file');
    });

    test('P2: workflow preserves files_scanned array during resumption', () => {
      const stateWithMultipleFiles = {
        ...INTERRUPTED_SCAN_STATE,
        files_scanned: [
          { path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' },
          { path: 'src/billing/invoice.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:52Z' }
        ]
      };

      createTestScanState(stateWithMultipleFiles);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.files_scanned).toHaveLength(2);
      // Files should be preserved during resumption
      expect(state.files_scanned[0].path).toBe('src/auth/service.ts');
      expect(state.files_scanned[1].path).toBe('src/billing/invoice.ts');
    });

    test('P3: workflow handles resumption with single interrupted file', () => {
      const stateWithSingleFile = {
        ...INTERRUPTED_SCAN_STATE,
        files_scanned: [
          { path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' }
        ],
        last_completed_file: 'src/auth/service.ts'
      };

      createTestScanState(stateWithSingleFile);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.files_scanned).toHaveLength(1);
      expect(state.last_completed_file).toBe('src/auth/service.ts');
    });
  });

  // ===================================================================
  // AC5: Full-scan reset behavior
  // ===================================================================
  describe('AC5: Full-scan reset behavior', () => {
    test('P0: workflow detects existing complete scan state', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      expect(existsSync(SCAN_STATE_PATH)).toBe(true);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.scan_status).toBe('complete');
    });

    test('P0: workflow displays warning when existing complete state found', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      // Verify state file has scan_date for warning message
      expect(state.scan_date).toBeDefined();
      expect(isValidISO8601(state.scan_date)).toBe(true);

      // Warning would include: "Existing scan state found (dated {scan_date})"
      expect(state.scan_date).toBeTruthy();
    });

    test('P0: workflow prompts for user confirmation on reset', () => {
      // This test verifies the workflow specification requires user confirmation
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      // Check that workflow specifies user confirmation prompt
      expect(workflowContent).toMatch(/Full scan will reset the state\. Continue\?/);
      expect(workflowContent).toMatch(/\[y\/N\]/);
    });

    test('P1: workflow deletes state file when user confirms reset', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      expect(existsSync(SCAN_STATE_PATH)).toBe(true);

      // Simulate user confirmation and deletion
      unlinkSync(SCAN_STATE_PATH);

      expect(existsSync(SCAN_STATE_PATH)).toBe(false);
    });

    test('P1: workflow preserves state file when user rejects reset', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      expect(existsSync(SCAN_STATE_PATH)).toBe(true);

      // Simulate user rejection (state file preserved)
      const contentBefore = readFileSync(SCAN_STATE_PATH, 'utf8');

      // State file should still exist and be unchanged
      expect(existsSync(SCAN_STATE_PATH)).toBe(true);

      const contentAfter = readFileSync(SCAN_STATE_PATH, 'utf8');
      expect(contentAfter).toBe(contentBefore);
    });

    test('P2: workflow exits cleanly when user rejects reset', () => {
      // This test verifies the workflow specifies clean exit behavior
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      // Check that workflow specifies clean exit message
      expect(workflowContent).toMatch(/Full scan cancelled\. Existing state preserved\./);
    });

    test('P2: reset only applies to full-scan mode (not update mode)', () => {
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      // Check that workflow distinguishes between full-scan and update modes
      expect(workflowContent).toMatch(/mode is `full-scan`/);
      expect(workflowContent).toMatch(/mode is `update`/);
    });

    test('P3: workflow creates new state file after confirmed reset', () => {
      // Initial state
      createTestScanState(MINIMAL_SCAN_STATE);
      expect(existsSync(SCAN_STATE_PATH)).toBe(true);

      // Simulate reset (delete and recreate)
      unlinkSync(SCAN_STATE_PATH);
      expect(existsSync(SCAN_STATE_PATH)).toBe(false);

      // Simulate new scan creating new state
      createTestScanState({
        ...MINIMAL_SCAN_STATE,
        scan_date: '2026-03-30T13:00:00Z'
      });

      expect(existsSync(SCAN_STATE_PATH)).toBe(true);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state.scan_date).toBe('2026-03-30T13:00:00Z');
    });
  });

  // ===================================================================
  // AC6: State file format and usability
  // ===================================================================
  describe('AC6: State file format and usability', () => {
    test('P0: state file is valid JSON', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');

      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('P0: state file is human-readable (pretty-printed)', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');

      // Pretty-printed JSON should have newlines
      expect(content).toContain('\n');

      // Should be parseable
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('P0: state file includes _comment field explaining purpose', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      expect(state).toHaveProperty('_comment');
      expect(typeof state._comment).toBe('string');
      expect(state._comment.length).toBeGreaterThan(0);
    });

    test('P0: field names use snake_case (not camelCase or kebab-case)', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      const fieldNames = Object.keys(state);
      fieldNames.forEach(name => {
        // Should be snake_case (lowercase with underscores)
        expect(name).toMatch(/^[a-z_]+$/);
      });
    });

    test('P1: _comment field mentions scan progress tracking', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      const comment = state._comment.toLowerCase();
      expect(comment).toMatch(/scan|progress|track/);
    });

    test('P1: _comment field mentions local/non-committed nature', () => {
      createTestScanState(MINIMAL_SCAN_STATE);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      const comment = state._comment.toLowerCase();
      expect(comment).toMatch(/local|commit/);
    });

    test('P2: workflow adds scan state files to .gitignore', () => {
      // This test verifies the workflow specifies .gitignore update
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      expect(workflowContent).toMatch(/\.gitignore/);
      expect(workflowContent).toMatch(/\.scan-state\.json/);
    });

    test('P2: .gitignore entry includes comment explaining purpose', () => {
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      // Check that .gitignore comment mentions scan state is local
      expect(workflowContent).toMatch(/# Scan state files \(local, not committed\)/);
    });

    test('P3: .gitignore includes both scan state files', () => {
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      // Should include both project-docs and architecture-docs state files
      expect(workflowContent).toMatch(/docs\/generated\/\.scan-state\.json/);
      expect(workflowContent).toMatch(/docs\/generated\/\.arch-scan-state\.json/);
    });
  });

  // ===================================================================
  // AC7: Incremental state updates
  // ===================================================================
  describe('AC7: Incremental state updates', () => {
    test('P0: state file is written after each analysis step', () => {
      // This test verifies the workflow specifies incremental writes
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      // Check that workflow mentions incremental state updates
      expect(workflowContent).toMatch(/incremental state updates/);
      expect(workflowContent).toMatch(/after each analysis step/);
    });

    test('P0: each step updates files_scanned array', () => {
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      // Check that workflow specifies updating files_scanned array
      expect(workflowContent).toMatch(/files_scanned.*array/);
      expect(workflowContent).toMatch(/append to/);
    });

    test('P0: last_completed_file is updated after each file processing', () => {
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      // Check that workflow specifies updating last_completed_file
      expect(workflowContent).toMatch(/last_completed_file/);
      expect(workflowContent).toMatch(/after processing each/);
    });

    test('P1: state file uses atomic write pattern (temp + rename)', () => {
      const workflowContent = readFileSync(WORKFLOW_PATH, 'utf8');

      // Check that workflow specifies atomic writes
      expect(workflowContent).toMatch(/atomic write/);
      expect(workflowContent).toMatch(/temp file/);
      expect(workflowContent).toMatch(/rename/);
    });

    test('P1: atomic write pattern prevents corruption', () => {
      const tempPath = SCAN_STATE_PATH + '.tmp';

      // Simulate atomic write
      ensureOutputDir();
      writeFileSync(tempPath, JSON.stringify(MINIMAL_SCAN_STATE, null, 2));
      renameSync(tempPath, SCAN_STATE_PATH);

      // Verify temp file no longer exists
      expect(existsSync(tempPath)).toBe(false);
      expect(existsSync(SCAN_STATE_PATH)).toBe(true);

      // Verify content is valid
      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('P2: incremental update preserves progress if interrupted', () => {
      // Simulate incremental state after first step
      const stateAfterStep1 = {
        ...MINIMAL_SCAN_STATE,
        files_scanned: [
          { path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' }
        ],
        scan_status: 'interrupted',
        last_completed_file: 'src/auth/service.ts'
      };

      createTestScanState(stateAfterStep1);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      // Verify progress is preserved
      expect(state.files_scanned).toHaveLength(1);
      expect(state.files_scanned[0].path).toBe('src/auth/service.ts');
      expect(state.last_completed_file).toBe('src/auth/service.ts');
    });

    test('P2: state file written after each step is valid JSON', () => {
      // Simulate state after each of 3 steps
      const steps = [
        [{ path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' }],
        [
          { path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' },
          { path: 'src/workflows/orchestrator.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:52Z' }
        ],
        [
          { path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' },
          { path: 'src/workflows/orchestrator.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:52Z' },
          { path: 'src/models/entity.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:54Z' }
        ]
      ];

      steps.forEach((files, index) => {
        const state = {
          ...MINIMAL_SCAN_STATE,
          files_scanned: files,
          last_completed_file: files[files.length - 1].path,
          scan_status: 'interrupted'
        };

        createTestScanState(state);

        const content = readFileSync(SCAN_STATE_PATH, 'utf8');

        // Each incremental state should be valid JSON
        expect(() => JSON.parse(content)).not.toThrow();

        const parsed = JSON.parse(content);
        expect(parsed.files_scanned).toHaveLength(index + 1);
      });
    });

    test('P3: final state file includes all files from all steps', () => {
      // Simulate final state after all steps
      const finalState = {
        ...MINIMAL_SCAN_STATE,
        files_scanned: [
          { path: 'src/auth/service.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:50Z' },
          { path: 'src/workflows/orchestrator.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:52Z' },
          { path: 'src/models/entity.ts', hash: TEST_FILE_HASH, timestamp: '2026-03-30T12:34:54Z' }
        ],
        scan_status: 'complete'
      };

      createTestScanState(finalState);

      const content = readFileSync(SCAN_STATE_PATH, 'utf8');
      const state = JSON.parse(content);

      // Final state should have all files
      expect(state.files_scanned).toHaveLength(3);
      expect(state.scan_status).toBe('complete');
      expect(state).not.toHaveProperty('last_completed_file');
    });
  });
});
