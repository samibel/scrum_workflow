import { describe, test, expect, vi, beforeEach } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  appendStatusHistory,
  validateActorFormat,
  ensureStatusHistoryExists,
  detectManualEdit,
  generateTimestamp
} from '../../src/core/status-history.js';

/**
 * Story 2.1: Implement Status History Tracking
 *
 * ATDD GREEN PHASE: Tests are now active and should PASS with the implementation
 *
 * Acceptance Criteria:
 * - AC1: Status history append mechanism - Every status transition appends status_history array
 * - AC2: Actor identity patterns - human, {name}-agent, {name}-skill, system
 * - AC3: Legacy story handling - Missing status_history handled gracefully
 * - AC4: Manual edit detection - Detect discrepancies between status field and last status_history entry
 */

// ============================================================================
// AC1: STATUS HISTORY APPEND MECHANISM
// ============================================================================

describe('Story 2.1: Status History Tracking - AC1: Append Mechanism', () => {
  let mockStory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStory = {
      frontmatter: {
        schema_version: '1.0.0',
        ticket: 'SW-001',
        status: 'draft',
        created: '2026-04-01T10:00:00Z',
        updated: '2026-04-01T10:00:00Z',
        status_history: []
      },
      content: '# Story Title\n\nStory content here.'
    };
  });

  /**
   * P0: Append entry to empty status_history
   *
   * Given a story with an empty status_history array
   * When appendStatusHistory is called
   * Then a new entry is added with all required fields
   */
  test('[P0] should append entry to empty status_history', () => {
    const result = appendStatusHistory(
      mockStory,
      null,
      'draft',
      '/scrum-create-ticket',
      'human'
    );

    expect(result.frontmatter.status_history).toHaveLength(1);
    expect(result.frontmatter.status_history[0]).toEqual({
      from: null,
      to: 'draft',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/),
      trigger: '/scrum-create-ticket',
      actor: 'human'
    });
  });

  /**
   * P0: Append entry to existing status_history
   *
   * Given a story with existing status_history entries
   * When appendStatusHistory is called
   * Then a new entry is appended without modifying existing entries
   */
  test('[P0] should append entry to existing status_history', () => {
    // Setup: story with existing history
    mockStory.frontmatter.status_history = [
      { from: null, to: 'draft', timestamp: '2026-04-01T10:00:00Z', trigger: '/scrum-create-ticket', actor: 'human' },
      { from: 'draft', to: 'refined', timestamp: '2026-04-01T11:00:00Z', trigger: '/scrum-refine-ticket', actor: 'architect-agent' }
    ];
    const originalHistoryLength = mockStory.frontmatter.status_history.length;
    const originalFirstEntry = { ...mockStory.frontmatter.status_history[0] };

    const result = appendStatusHistory(
      mockStory,
      'refined',
      'ready-for-dev',
      '/scrum-dev-story',
      'developer-agent'
    );

    expect(result.frontmatter.status_history).toHaveLength(originalHistoryLength + 1);
    // Verify original entries unchanged (append-only behavior)
    expect(result.frontmatter.status_history[0]).toEqual(originalFirstEntry);
    // Verify new entry
    expect(result.frontmatter.status_history[2]).toEqual({
      from: 'refined',
      to: 'ready-for-dev',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/),
      trigger: '/scrum-dev-story',
      actor: 'developer-agent'
    });
  });

  /**
   * P0: Validate entry fields structure
   *
   * Given a status history entry
   * Then it contains all required fields: from, to, timestamp, trigger, actor
   */
  test('[P0] should validate entry fields structure', () => {
    const result = appendStatusHistory(
      mockStory,
      'draft',
      'refined',
      '/scrum-refine-ticket',
      'qa-agent'
    );

    const entry = result.frontmatter.status_history[0];

    // Verify all required fields present
    expect(entry).toHaveProperty('from');
    expect(entry).toHaveProperty('to');
    expect(entry).toHaveProperty('timestamp');
    expect(entry).toHaveProperty('trigger');
    expect(entry).toHaveProperty('actor');

    // Verify field types
    expect(typeof entry.from).toBe('string');
    expect(typeof entry.to).toBe('string');
    expect(typeof entry.timestamp).toBe('string');
    expect(typeof entry.trigger).toBe('string');
    expect(typeof entry.actor).toBe('string');
  });

  /**
   * P0: Verify ISO 8601 UTC timestamp format
   *
   * Given a generated timestamp
   * Then it follows ISO 8601 UTC format (YYYY-MM-DDTHH:MM:SSZ)
   */
  test('[P0] should generate ISO 8601 UTC timestamp', () => {
    const timestamp = generateTimestamp();

    // ISO 8601 UTC format with optional milliseconds: 2026-04-08T12:30:45.123Z
    const iso8601UtcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    expect(timestamp).toMatch(iso8601UtcRegex);

    // Verify it represents a valid date
    const date = new Date(timestamp);
    expect(date.toISOString()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  /**
   * P0: Verify append-only behavior
   *
   * Given a story with status_history
   * When a new entry is appended
   * Then existing entries are never modified or deleted
   */
  test('[P0] should maintain append-only behavior', () => {
    const originalEntry = {
      from: null,
      to: 'draft',
      timestamp: '2026-04-01T10:00:00Z',
      trigger: '/scrum-create-ticket',
      actor: 'human'
    };
    mockStory.frontmatter.status_history = [{ ...originalEntry }];

    // Multiple appends
    appendStatusHistory(mockStory, 'draft', 'refined', '/scrum-refine-ticket', 'architect-agent');
    const afterFirst = JSON.parse(JSON.stringify(mockStory.frontmatter.status_history[0]));

    appendStatusHistory(mockStory, 'refined', 'ready-for-dev', '/scrum-dev-story', 'developer-agent');
    const afterSecond = JSON.parse(JSON.stringify(mockStory.frontmatter.status_history[0]));

    // Original entry must remain unchanged
    expect(afterFirst).toEqual(originalEntry);
    expect(afterSecond).toEqual(originalEntry);
  });
});

// ============================================================================
// AC2: ACTOR IDENTITY PATTERNS
// ============================================================================

describe('Story 2.1: Status History Tracking - AC2: Actor Patterns', () => {
  /**
   * P0: Validate human actor format
   *
   * Given an actor value of "human"
   * When validated
   * Then it is accepted as valid
   */
  test('[P0] should accept human actor format', () => {
    expect(validateActorFormat('human')).toBe(true);
  });

  /**
   * P0: Validate {name}-agent format
   *
   * Given an actor value matching "{name}-agent"
   * When validated
   * Then it is accepted as valid
   */
  test('[P0] should accept {name}-agent format', () => {
    const validAgents = [
      'architect-agent',
      'developer-agent',
      'qa-agent',
      'scrum-master-agent',
      'product-owner-agent'
    ];

    validAgents.forEach(actor => {
      expect(validateActorFormat(actor)).toBe(true);
    });
  });

  /**
   * P0: Validate {name}-skill format
   *
   * Given an actor value matching "{name}-skill"
   * When validated
   * Then it is accepted as valid
   */
  test('[P0] should accept {name}-skill format', () => {
    const validSkills = [
      'readiness-check-skill',
      'validation-skill',
      'refinement-skill',
      'estimation-skill'
    ];

    validSkills.forEach(actor => {
      expect(validateActorFormat(actor)).toBe(true);
    });
  });

  /**
   * P0: Validate system actor format
   *
   * Given an actor value of "system"
   * When validated
   * Then it is accepted as valid
   */
  test('[P0] should accept system actor format', () => {
    expect(validateActorFormat('system')).toBe(true);
  });

  /**
   * P1: Reject invalid actor formats
   *
   * Given an invalid actor value
   * When validated
   * Then it is rejected
   */
  test('[P1] should reject invalid actor formats', () => {
    const invalidActors = [
      'Human',           // Wrong case
      'admin',           // Missing suffix
      'user123',         // Invalid format
      'bot',             // Missing suffix
      '',               // Empty string
      null,             // Null
      undefined,        // Undefined
      'agent',           // Missing name prefix
    ];

    invalidActors.forEach(actor => {
      expect(validateActorFormat(actor)).toBe(false);
    });
  });
});

// ============================================================================
// AC3: LEGACY STORY HANDLING
// ============================================================================

describe('Story 2.1: Status History Tracking - AC3: Legacy Handling', () => {
  let legacyStory;

  beforeEach(() => {
    vi.clearAllMocks();
    // Story without status_history field (legacy format)
    legacyStory = {
      frontmatter: {
        schema_version: '1.0.0',
        ticket: 'SW-LEGACY',
        status: 'draft',
        created: '2026-03-01T10:00:00Z',
        updated: '2026-03-01T10:00:00Z'
        // Note: no status_history field
      },
      content: '# Legacy Story\n\nThis is a legacy story from v1.2.0.'
    };
  });

  /**
   * P0: Missing status_history does not cause errors
   *
   * Given a legacy story without status_history
 * When ensureStatusHistoryExists is called
   * Then it does not throw an errors
   */
  test('[P0] should handle missing status_history gracefully', () => {
    // Should not throw error
    expect(() => ensureStatusHistoryExists(legacyStory)).not.toThrow();

    // Should return the story object
    const result = ensureStatusHistoryExists(legacyStory);
    expect(result).toBeDefined();
    expect(result.frontmatter).toBeDefined();
  });

  /**
   * P0: First transition creates status_history array
   *
   * Given a legacy story without status_history
 * When appendStatusHistory is called
   * Then status_history array is created with the new entry
   */
  test('[P0] should create status_history on first transition', () => {
    const ensuredStory = ensureStatusHistoryExists(legacyStory);

    const result = appendStatusHistory(
      ensuredStory,
      null,
      'draft',
      '/scrum-create-ticket',
      'human'
    );

    // Verify status_history was created
    expect(result.frontmatter.status_history).toBeDefined();
    expect(Array.isArray(result.frontmatter.status_history)).toBe(true);
    expect(result.frontmatter.status_history).toHaveLength(1);

    // Verify the entry
    expect(result.frontmatter.status_history[0]).toEqual({
      from: null,
      to: 'draft',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/),
      trigger: '/scrum-create-ticket',
      actor: 'human'
    });
  });
});

// ============================================================================
// AC4: MANUAL EDIT DETECTION
// ============================================================================

describe('Story 2.1: Status History Tracking - AC4: Manual Edit Detection', () => {
  let storyWithHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    storyWithHistory = {
      frontmatter: {
        schema_version: '1.0.0',
        ticket: 'SW-002',
        status: 'ready-for-dev',  // Manually edited from 'refined'
        created: '2026-04-01T10:00:00Z',
        updated: '2026-04-08T15:00:00Z',
        status_history: [
          { from: null, to: 'draft', timestamp: '2026-04-01T10:00:00Z', trigger: '/scrum-create-ticket', actor: 'human' },
          { from: 'draft', to: 'refined', timestamp: '2026-04-01T11:00:00Z', trigger: '/scrum-refine-ticket', actor: 'architect-agent' }
        ]
      },
      content: '# Test Story\n\nManual status edit test.'
    };
  });

  /**
   * P0: Detect status field mismatch
   *
   * Given a story where status field doesn't match last status_history entry
   * When detectManualEdit is called
   * Then the discrepancy is detected
   */
  test('[P0] should detect status field mismatch', () => {
    // Status is 'ready-for-dev' but last history says 'refined' - MISMATCH!
    const result = detectManualEdit(storyWithHistory);

    expect(result.hasManualEdit).toBe(true);
    expect(result.expectedStatus).toBe('refined');
    expect(result.actualStatus).toBe('ready-for-dev');
    expect(result.discrepancyMessage).toBeDefined();
  });

  /**
   * P0: No discrepancy when status matches history
   *
   * Given a story where status field matches last status_history entry
   * When detectManualEdit is called
   * Then no discrepancy is detected
   */
  test('[P0] should return no discrepancy when status matches', () => {
    // Update status to match history
    storyWithHistory.frontmatter.status = 'refined';
    const result = detectManualEdit(storyWithHistory);

    expect(result.hasManualEdit).toBe(false);
    expect(result.expectedStatus).toBe('refined');
    expect(result.actualStatus).toBe('refined');
  });

  /**
   * P1: Manual edit creates special entry with trigger
 manual-edit
   *
   * Given a manual edit is detected
   * When the status is recorded
   * Then a special entry with trigger: 'manual-edit' convention is visible
   */
  test('[P1] should identify manual-edit trigger convention', () => {
    const result = detectManualEdit(storyWithHistory);

    // The convention check - trigger should be 'manual-edit' for manual edits
    // This is a documentation/visibility requirement, not implementation requirement
    expect(result.discrepancyMessage).toMatch(/manual edit detected| trigger: manual-edit/);
    expect(result.discrepancyMessage).toContain('ready-for-dev');
  });
});

// ============================================================================
// INTEGRATION TESTS: END-TO-END WORKFLOWS
// ============================================================================

describe('Story 2.1: Status History Tracking - Integration', () => {
  /**
   * P1: Complete status transition flow
   *
   * Given a story going through multiple status transitions
   * When each transition is processed
   * Then status_history contains accurate record of all transitions
   */
  test('[P1] should record complete status transition flow', () => {
    let story = {
      frontmatter: {
        schema_version: '1.0.0',
        ticket: 'SW-003',
        status: 'draft',
        created: '2026-04-01T10:00:00Z',
        updated: '2026-04-01T10:00:00Z',
        status_history: []
      },
      content: '# Integration Test Story'
    };

    // Transition 1: draft -> refined
    story = ensureStatusHistoryExists(story);
    story = appendStatusHistory(story, 'draft', 'refined', '/scrum-refine-ticket', 'architect-agent');
    story.frontmatter.status = 'refined';

    expect(story.frontmatter.status).toBe('refined');
    expect(story.frontmatter.status_history).toHaveLength(1);

    // Transition 2: refined -> ready-for-dev
    story = appendStatusHistory(story, 'refined', 'ready-for-dev', '/scrum-dev-story', 'developer-agent');
    story.frontmatter.status = 'ready-for-dev';

    expect(story.frontmatter.status).toBe('ready-for-dev');
    expect(story.frontmatter.status_history).toHaveLength(2);

    // Transition 3: ready-for-dev -> in-progress
    story = appendStatusHistory(story, 'ready-for-dev', 'in-progress', '/scrum-dev-story', 'human');
    story.frontmatter.status = 'in-progress';

    expect(story.frontmatter.status_history).toHaveLength(3);

    // Verify the transitions (not the initial state since we started with empty history)
    expect(story.frontmatter.status_history[0]).toEqual({
      from: 'draft',
      to: 'refined',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/),
      trigger: '/scrum-refine-ticket',
      actor: 'architect-agent'
    });

    expect(story.frontmatter.status_history[1]).toEqual({
      from: 'refined',
      to: 'ready-for-dev',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/),
      trigger: '/scrum-dev-story',
      actor: 'developer-agent'
    });

    expect(story.frontmatter.status_history[2]).toEqual({
      from: 'ready-for-dev',
      to: 'in-progress',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/),
      trigger: '/scrum-dev-story',
      actor: 'human'
    });
  });
});
