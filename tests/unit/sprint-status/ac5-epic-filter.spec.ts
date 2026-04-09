/**
 * ATDD Tests for Sprint Status Command - AC5 (Epic Filter)
 *
 * TDD Phase: RED (tests written before implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 8.4 - Implement Sprint Status Command
 *
 * Task 4.4: Add `--epic` filter to show only stories from specific epic
 *          (e.g., `--epic 8` shows epic 8 stories only)
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync, rmSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test paths
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const SPRINT_STATUS_CMD = join(PROJECT_ROOT, 'scrum_workflow', 'commands', 'sprint-status.md');
const SPRINT_STATUS_WORKFLOW = join(PROJECT_ROOT, 'scrum_workflow', 'workflows', 'sprint-status.md');
const SPRINTS_OUTPUT_DIR = join(PROJECT_ROOT, '_scrum-output', 'sprints');

// Helper to create a mock story structure for testing
function createMockStoryDir(ticketId: string, title: string, status: string, createdDaysAgo: number, epic?: string): string {
  const storyDir = join(SPRINTS_OUTPUT_DIR, ticketId);
  mkdirSync(storyDir, { recursive: true });

  const storyMdContent = `---
ticket: ${ticketId}
title: ${title}
status: ${status}
epic: ${epic || ticketId.split('-')[0].replace('SW', 'epic-')}
created: ${new Date(Date.now() - createdDaysAgo * 86400000).toISOString()}
updated: ${new Date().toISOString()}
---

# ${title}

Story content here.
`;

  writeFileSync(join(storyDir, 'story.md'), storyMdContent, 'utf8');
  return storyDir;
}

// Helper to cleanup test stories
function cleanupTestStories() {
  if (existsSync(SPRINTS_OUTPUT_DIR)) {
    const dirs = readdirSync(SPRINTS_OUTPUT_DIR);
    dirs.forEach(dir => {
      const fullPath = join(SPRINTS_OUTPUT_DIR, dir);
      if (statSync(fullPath).isDirectory()) {
        rmSync(fullPath, { recursive: true, force: true });
      }
    });
  }
}

// ============================================================================
// AC5: --epic Filter Command Interface
// ============================================================================

describe('AC5: --epic Filter Command Interface', () => {

  afterAll(() => {
    cleanupTestStories();
  });

  test.skip('[P0] sprint-status command should accept --epic flag', () => {
    const content = readFileSync(SPRINT_STATUS_CMD, 'utf8');
    expect(content).toMatch(/--epic|epic.*flag/i);
  });

  test.skip('[P0] --epic flag should be optional', () => {
    const content = readFileSync(SPRINT_STATUS_CMD, 'utf8');
    // Should indicate the flag is optional (not required)
    expect(content).toMatch(/optional|\[--epic\]|\[--epic <N>\]/i);
  });

  test.skip('[P0] --epic flag should accept epic number as value', () => {
    const content = readFileSync(SPRINT_STATUS_CMD, 'utf8');
    // Should show --epic takes a number argument
    expect(content).toMatch(/--epic.*\d|epic.*\d/i);
  });

  test.skip('[P0] example usage: --epic 8 should show only epic 8 stories', () => {
    const content = readFileSync(SPRINT_STATUS_CMD, 'utf8');
    // Should have an example
    expect(content).toMatch(/--epic\s+8|epic\s+8/i);
  });
});

// ============================================================================
// AC5: --epic Filter Functionality
// ============================================================================

describe('AC5: --epic Filter Functionality', () => {
  const TEST_TICKETS = [
    { id: 'SW-801', title: 'Epic 8 Story 1', status: 'in-progress', daysAgo: 3, epic: 'epic-8' },
    { id: 'SW-802', title: 'Epic 8 Story 2', status: 'done', daysAgo: 7, epic: 'epic-8' },
    { id: 'SW-101', title: 'Epic 1 Story 1', status: 'draft', daysAgo: 1, epic: 'epic-1' },
  ];

  afterAll(() => {
    cleanupTestStories();
  });

  test.skip('[P0] --epic filter should show only stories from specified epic', () => {
    // Create test stories from different epics
    TEST_TICKETS.forEach(t => {
      createMockStoryDir(t.id, t.title, t.status, t.daysAgo, t.epic);
    });

    // When --epic 8 is used, only SW-801 and SW-802 should appear
    // This verifies the filtering logic exists
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    expect(content).toMatch(/filter.*epic|epic.*filter/i);
  });

  test.skip('[P0] --epic 8 should show only epic 8 stories (SW-801, SW-802)', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should mention filtering by epic number
    expect(content).toMatch(/epic.*8|8.*stories/i);
  });

  test.skip('[P1] --epic filter should exclude stories from other epics', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should mention exclusion or filtering behavior
    expect(content).toMatch(/exclude|filter/i);
  });

  test.skip('[P1] without --epic flag, all stories should be shown', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should show all stories when no filter is specified
    expect(content).toMatch(/all.*stories|show.*all/i);
  });
});

// ============================================================================
// AC5: Edge Cases
// ============================================================================

describe('AC5: Edge Cases', () => {

  afterAll(() => {
    cleanupTestStories();
  });

  test.skip('[P1] --epic filter should handle non-existent epic gracefully', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should handle case when no stories match the epic
    expect(content).toMatch(/no.*stories|empty.*result/i);
  });

  test.skip('[P2] --epic filter should validate epic number format', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should validate the epic number
    expect(content).toMatch(/validat/i);
  });

  test.skip('[P2] --epic with invalid value should show error or ignore', () => {
    const content = readFileSync(SPRINT_STATUS_WORKFLOW, 'utf8');
    // Should handle invalid epic values
  });
});
