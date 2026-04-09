/**
 * ATDD Tests for Story 8.4: Implement Sprint Status Command
 *
 * TDD Phase: RED (tests written before implementation)
 * Test Level: Unit
 * Test Framework: Vitest
 * Story: 8.4 - Implement Sprint Status Command
 *
 * PRD References:
 * - FR-39: Sprint observability via /sprint-status
 * - UX-DR6: Semantic color system
 * - UX-DR7: Emoji prefixes
 * - UX-DR9: Single line per message
 *
 * Acceptance Criteria:
 * - AC1: Scan _scrum-output/sprints/ for stories and display summary table
 * - AC2: Stories sorted by status priority, stories requiring action highlighted
 * - AC3: Empty state message when no stories found
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Import the utility functions to test
import {
  isValidTicketId,
  calculateAgeInDays,
  getStatusPriority,
  getPendingAction,
  requiresAction,
  getStatusColor,
  parseStoryMetadata,
  scanSprintStories,
  sortStoriesByPriority,
  formatStoryRow,
  formatEmptyState,
  STATUS_PRIORITY,
  PENDING_ACTION_MAP
} from '../../../scrum_workflow/utils/sprint-status.js';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const TEST_PROJECT_ROOT = join(TEST_DIR, 'test-fixtures', 'sprint-status-project');

// Helper: Create test story file
function createTestStoryFile(ticket, metadata, projectRoot = TEST_PROJECT_ROOT) {
  const storyDir = join(projectRoot, '_scrum-output', 'sprints', ticket);
  if (!existsSync(storyDir)) {
    mkdirSync(storyDir, { recursive: true });
  }

  const storyFile = join(storyDir, 'story.md');
  const frontmatter = `---
ticket: ${metadata.ticket || ticket}
title: ${metadata.title || 'Test Story'}
status: ${metadata.status || 'draft'}
created: ${metadata.created || '2026-04-01T10:00:00Z'}
updated: ${metadata.updated || '2026-04-01T10:00:00Z'}
epic: ${metadata.epic || '8'}
---`;

  writeFileSync(storyFile, frontmatter + '\n\n# Story Content\n\n', 'utf8');
  return storyFile;
}

// Cleanup: Remove test fixtures
function cleanupTestFixtures() {
  try {
    const { rmSync } = require('node:fs');
    const testFixturesDir = join(TEST_DIR, 'test-fixtures');
    if (existsSync(testFixturesDir)) {
      rmSync(testFixturesDir, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup errors
  }
}

beforeEach(() => {
  cleanupTestFixtures();
});

afterEach(() => {
  cleanupTestFixtures();
});

// ============================================================================
// AC1: Story Scanning and Metadata Extraction
// ============================================================================

describe('Story 8.4: Sprint Status - AC1: Story Scanning', () => {
  test('[P0] isValidTicketId should validate correct SW-XXX format', () => {
    expect(isValidTicketId('SW-001')).toBe(true);
    expect(isValidTicketId('SW-042')).toBe(true);
    expect(isValidTicketId('SW-123')).toBe(true);
  });

  test('[P0] isValidTicketId should reject invalid formats', () => {
    expect(isValidTicketId('SW-1')).toBe(false);
    expect(isValidTicketId('SW-01')).toBe(false);
    expect(isValidTicketId('INVALID')).toBe(false);
    expect(isValidTicketId('')).toBe(false);
    expect(isValidTicketId(null)).toBe(false);
  });

  test('[P0] parseStoryMetadata should extract YAML frontmatter', () => {
    const projectRoot = TEST_PROJECT_ROOT;
    createTestStoryFile('SW-001', {
      ticket: 'SW-001',
      title: 'Test Story',
      status: 'in-progress',
      created: '2026-04-01T10:00:00Z'
    }, projectRoot);

    const metadata = parseStoryMetadata(join(projectRoot, '_scrum-output', 'sprints', 'SW-001', 'story.md'));

    expect(metadata).not.toBeNull();
    expect(metadata.ticket).toBe('SW-001');
    expect(metadata.title).toBe('Test Story');
    expect(metadata.status).toBe('in-progress');
    expect(metadata.created).toBe('2026-04-01T10:00:00Z');
  });

  test('[P0] parseStoryMetadata should return null for missing file', () => {
    const metadata = parseStoryMetadata('/non/existent/path/story.md');
    expect(metadata).toBeNull();
  });

  test('[P0] calculateAgeInDays should calculate days from timestamp', () => {
    // Use a fixed date for testing (e.g., 10 days ago)
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const timestamp = tenDaysAgo.toISOString();

    const age = calculateAgeInDays(timestamp);
    expect(age).toBeGreaterThanOrEqual(10);
    expect(age).toBeLessThan(11);
  });

  test('[P0] calculateAgeInDays should return null for invalid timestamp', () => {
    expect(calculateAgeInDays(null)).toBeNull();
    expect(calculateAgeInDays('invalid')).toBeNull();
    expect(calculateAgeInDays('')).toBeNull();
  });

  test('[P1] scanSprintStories should scan all story directories', () => {
    const projectRoot = TEST_PROJECT_ROOT;

    // Create test stories
    createTestStoryFile('SW-001', { status: 'draft' }, projectRoot);
    createTestStoryFile('SW-002', { status: 'in-progress' }, projectRoot);
    createTestStoryFile('SW-003', { status: 'done' }, projectRoot);

    const stories = scanSprintStories(projectRoot);

    expect(stories).toHaveLength(3);
    expect(stories.map(s => s.ticket).sort()).toEqual(['SW-001', 'SW-002', 'SW-003']);
  });

  test('[P1] scanSprintStories should filter by epic when specified', () => {
    const projectRoot = TEST_PROJECT_ROOT;

    // Create test stories with different epics
    createTestStoryFile('SW-001', { epic: '8', status: 'draft' }, projectRoot);
    createTestStoryFile('SW-002', { epic: '8', status: 'in-progress' }, projectRoot);
    createTestStoryFile('SW-003', { epic: '9', status: 'draft' }, projectRoot);

    const storiesEpic8 = scanSprintStories(projectRoot, 8);
    const storiesEpic9 = scanSprintStories(projectRoot, 9);

    expect(storiesEpic8).toHaveLength(2);
    expect(storiesEpic9).toHaveLength(1);
  });

  test('[P2] scanSprintStories should return empty array when no sprints dir', () => {
    const stories = scanSprintStories('/non/existent/path');
    expect(stories).toHaveLength(0);
  });
});

// ============================================================================
// AC2: Status Priority Sorting
// ============================================================================

describe('Story 8.4: Sprint Status - AC2: Status Priority Sorting', () => {
  test('[P0] STATUS_PRIORITY should define correct order', () => {
    expect(STATUS_PRIORITY['changes-needed']).toBeLessThan(STATUS_PRIORITY['in-progress']);
    expect(STATUS_PRIORITY['in-progress']).toBeLessThan(STATUS_PRIORITY['review']);
    expect(STATUS_PRIORITY['review']).toBeLessThan(STATUS_PRIORITY['done']);
  });

  test('[P0] getStatusPriority should return correct priority', () => {
    expect(getStatusPriority('changes-needed')).toBe(1);
    expect(getStatusPriority('in-progress')).toBe(3);
    expect(getStatusPriority('done')).toBe(9);
    expect(getStatusPriority('unknown')).toBe(999);
  });

  test('[P0] sortStoriesByPriority should sort highest priority first', () => {
    const stories = [
      { ticket: 'SW-001', status: 'done', priority: 9 },
      { ticket: 'SW-002', status: 'changes-needed', priority: 1 },
      { ticket: 'SW-003', status: 'in-progress', priority: 3 }
    ];

    const sorted = sortStoriesByPriority(stories);

    expect(sorted[0].ticket).toBe('SW-002'); // changes-needed (priority 1)
    expect(sorted[1].ticket).toBe('SW-003'); // in-progress (priority 3)
    expect(sorted[2].ticket).toBe('SW-001'); // done (priority 9)
  });

  test('[P1] sortStoriesByPriority should be stable (secondary sort by ticket)', () => {
    const stories = [
      { ticket: 'SW-003', status: 'in-progress', priority: 3 },
      { ticket: 'SW-001', status: 'in-progress', priority: 3 },
      { ticket: 'SW-002', status: 'in-progress', priority: 3 }
    ];

    const sorted = sortStoriesByPriority(stories);

    expect(sorted[0].ticket).toBe('SW-001');
    expect(sorted[1].ticket).toBe('SW-002');
    expect(sorted[2].ticket).toBe('SW-003');
  });

  test('[P0] requiresAction should identify action-needed statuses', () => {
    expect(requiresAction('changes-needed')).toBe(true);
    expect(requiresAction('in-progress')).toBe(true);
    expect(requiresAction('review')).toBe(true);
    expect(requiresAction('approved')).toBe(true);
    expect(requiresAction('done')).toBe(false);
    expect(requiresAction('draft')).toBe(false);
  });

  test('[P0] getStatusColor should return correct color names', () => {
    expect(getStatusColor('changes-needed')).toBe('red');
    expect(getStatusColor('in-progress')).toBe('yellow');
    expect(getStatusColor('review')).toBe('cyan');
    expect(getStatusColor('approved')).toBe('green');
    expect(getStatusColor('done')).toBe('green');
    expect(getStatusColor('draft')).toBe('default');
  });
});

// ============================================================================
// AC2: Pending Action Mapping
// ============================================================================

describe('Story 8.4: Sprint Status - AC2: Pending Action Mapping', () => {
  test('[P0] PENDING_ACTION_MAP should define all status mappings', () => {
    expect(PENDING_ACTION_MAP['draft']).toBe('/scrum-refine-ticket');
    expect(PENDING_ACTION_MAP['refined']).toBe('/scrum-refine-story');
    expect(PENDING_ACTION_MAP['ready-for-dev']).toBe('/scrum-dev-story');
    expect(PENDING_ACTION_MAP['in-progress']).toBe('/scrum-verify');
    expect(PENDING_ACTION_MAP['review']).toBe('/scrum-approve');
    expect(PENDING_ACTION_MAP['changes-needed']).toBe('/scrum-dev-story');
    expect(PENDING_ACTION_MAP['done']).toBe('N/A');
    expect(PENDING_ACTION_MAP['cancelled']).toBe('N/A');
  });

  test('[P0] getPendingAction should return correct action', () => {
    expect(getPendingAction('draft')).toBe('/scrum-refine-ticket');
    expect(getPendingAction('in-progress')).toBe('/scrum-verify');
    expect(getPendingAction('review')).toBe('/scrum-approve');
    expect(getPendingAction('done')).toBe('N/A');
  });
});

// ============================================================================
// AC3: Empty State Handling
// ============================================================================

describe('Story 8.4: Sprint Status - AC3: Empty State', () => {
  test('[P0] formatEmptyState should return helpful message', () => {
    const message = formatEmptyState();
    expect(message).toContain('No stories found');
    expect(message).toContain('/scrum-create-ticket');
  });

  test('[P0] scanSprintStories should return empty array for non-existent directory', () => {
    const stories = scanSprintStories('/completely/non/existent/path');
    expect(stories).toHaveLength(0);
  });
});

// ============================================================================
// Output Formatting
// ============================================================================

describe('Story 8.4: Sprint Status - Output Formatting', () => {
  test('[P0] formatStoryRow should format story data', () => {
    const story = {
      ticket: 'SW-001',
      title: 'Test Story Title',
      status: 'in-progress',
      age: 5,
      pendingAction: '/scrum-verify'
    };

    const row = formatStoryRow(story);

    expect(row).toContain('SW-001');
    expect(row).toContain('Test Story Title');
    expect(row).toContain('in-progress');
    expect(row).toContain('5d');
    expect(row).toContain('/scrum-verify');
  });

  test('[P1] formatStoryRow should truncate long titles', () => {
    const longTitle = 'A'.repeat(50);
    const story = {
      ticket: 'SW-001',
      title: longTitle,
      status: 'draft',
      age: 1,
      pendingAction: '/scrum-refine-ticket'
    };

    const row = formatStoryRow(story);
    expect(row).toContain('...');
    expect(row.length).toBeLessThan(longTitle.length + 50);
  });

  test('[P1] formatStoryRow should handle missing age', () => {
    const story = {
      ticket: 'SW-001',
      title: 'Test',
      status: 'draft',
      age: null,
      pendingAction: '/scrum-refine-ticket'
    };

    const row = formatStoryRow(story);
    expect(row).toContain('?');
  });
});
