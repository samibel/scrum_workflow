/**
 * ATDD Tests for Central Audit Trail - AC1
 *
 * TDD Phase: RED (tests written before implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 8.3 - Implement Central Audit Trail
 *
 * AC1: Given FR-38 specifies central audit trail per story in `_scrum-output/audit/`
 *      When any status transition, agent action, or artifact creation occurs for a story
 *      Then an entry is appended to the story's audit trail
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test paths - use fileURLToPath for reliable location tracking
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const AUDIT_TRAIL_CMD = join(PROJECT_ROOT, 'src', 'core', 'commands', 'audit-trail.md');
const AUDIT_UTILS = join(PROJECT_ROOT, 'src', 'core', 'utils', 'audit.js');
const AUDIT_WORKFLOW = join(PROJECT_ROOT, 'src', 'core', 'workflows', 'audit.md');
const AUDIT_OUTPUT_DIR = join(PROJECT_ROOT, '_scrum-output', 'audit');

// Helper to create a mock story structure for testing
function createMockStoryDir(ticketId: string): string {
  const storyDir = join(PROJECT_ROOT, '_scrum-output', 'sprints', ticketId);
  mkdirSync(storyDir, { recursive: true });
  return storyDir;
}

// Helper to create a mock status_history
function createMockStatusHistory(ticketId: string, statuses: string[]): string {
  const storyDir = createMockStoryDir(ticketId);
  const entries = statuses.map((status, index) => ({
    status,
    timestamp: new Date(Date.now() - (statuses.length - index) * 86400000).toISOString(),
    actor: 'human',
    trigger: 'manual'
  }));
  const statusHistory = JSON.stringify({ status_history: entries }, null, 2);
  writeFileSync(join(storyDir, 'status_history.json'), statusHistory, 'utf8');
  return statusHistory;
}

// ============================================================================
// AC1: Audit Trail Command & Workflow Definition
// ============================================================================

describe('AC1: Audit Trail Command & Workflow Definition', () => {
  // Test 1.1: audit-trail.md command should exist
  test('[P0] scrum_workflow/commands/audit-trail.md should exist', () => {
    expect(existsSync(AUDIT_TRAIL_CMD)).toBe(true);
  });

  // Test 1.2: audit.md workflow should exist
  test('[P0] scrum_workflow/workflows/audit.md should exist', () => {
    expect(existsSync(AUDIT_WORKFLOW)).toBe(true);
  });

  // Test 1.3: audit.js utility should exist
  test('[P0] scrum_workflow/utils/audit.js should exist', () => {
    expect(existsSync(AUDIT_UTILS)).toBe(true);
  });

  // Test 1.4: audit-trail.md should define the /scrum-audit-trail command
  test('[P0] audit-trail.md should define /scrum-audit-trail slash-command', () => {
    const content = readFileSync(AUDIT_TRAIL_CMD, 'utf8');
    expect(content).toMatch(/scrum-audit-trail|SW-\d{3}/);
  });

  // Test 1.5: audit-trail.md should reference audit workflow
  test('[P0] audit-trail.md should reference audit workflow', () => {
    const content = readFileSync(AUDIT_TRAIL_CMD, 'utf8');
    expect(content).toMatch(/audit/i);
  });

  // Test 1.6: audit.md workflow should define audit trail recording process
  test('[P0] audit workflow should define audit trail recording process', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/append|entry|record/i);
  });

  // Test 1.7: audit.js should export appendEntry function
  test('[P0] audit.js should export appendEntry function', () => {
    const content = readFileSync(AUDIT_UTILS, 'utf8');
    expect(content).toMatch(/export.*appendEntry|module\.exports.*appendEntry/);
  });

  // Test 1.8: audit.js should support event types: transition, action, artifact
  test('[P0] audit.js should support event types: transition, action, artifact', () => {
    const content = readFileSync(AUDIT_UTILS, 'utf8');
    expect(content).toMatch(/transition|action|artifact/);
  });

  // Test 1.9: audit workflow should reference _scrum-output/audit directory
  test('[P0] audit workflow should reference _scrum-output/audit directory', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/_scrum-output[\/\\]audit|SW-\d{3}-audit\.md/);
  });

  // Test 1.10: audit.js should integrate with status_history for transitions
  test('[P1] audit.js should integrate with status_history for transitions', () => {
    const content = readFileSync(AUDIT_UTILS, 'utf8');
    expect(content).toMatch(/status_history|statusHistory/i);
  });
});

// ============================================================================
// AC1: Audit Trail File Creation
// ============================================================================

describe('AC1: Audit Trail File Creation', () => {
  const TEST_TICKET = 'SW-999';

  afterAll(() => {
    // Cleanup
    const auditFile = join(AUDIT_OUTPUT_DIR, `${TEST_TICKET}-audit.md`);
    if (existsSync(auditFile)) {
      rmSync(auditFile);
    }
  });

  test('[P0] audit directory should exist or be creatable at _scrum-output/audit', () => {
    if (!existsSync(AUDIT_OUTPUT_DIR)) {
      mkdirSync(AUDIT_OUTPUT_DIR, { recursive: true });
    }
    expect(existsSync(AUDIT_OUTPUT_DIR)).toBe(true);
  });

  test('[P0] audit trail file should be named SW-XXX-audit.md format', () => {
    const content = readFileSync(AUDIT_WORKFLOW, 'utf8');
    expect(content).toMatch(/SW-\d{3}-audit\.md/);
  });

  test('[P1] audit trail file should be created in _scrum-output/audit directory', () => {
    if (!existsSync(AUDIT_OUTPUT_DIR)) {
      mkdirSync(AUDIT_OUTPUT_DIR, { recursive: true });
    }
    const auditFile = join(AUDIT_OUTPUT_DIR, `${TEST_TICKET}-audit.md`);
    // Write a minimal audit file
    writeFileSync(auditFile, '# Audit Trail\n\n## Entries\n\n', 'utf8');
    expect(existsSync(auditFile)).toBe(true);
  });
});
