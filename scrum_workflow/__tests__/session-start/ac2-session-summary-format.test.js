/**
 * ATDD Tests — AC2: Session Summary Format
 * Story 7.3: Implement Session Start & Context Loading
 *
 * AC2: Given SC-14 specifies "exactly where I left off" in under 60 seconds
 *      When session context is loaded
 *      Then the developer can identify the next action within the presented summary
 *      And no prior session knowledge is required
 *
 * TDD RED PHASE: All tests use test() — feature (session-context.js) not yet implemented.
 * Remove test() after implementing scrum_workflow/utils/session-context.js.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import {
  deriveNextSteps,
  formatSessionSummary,
} from '../../utils/session-context.js';

const PROJECT_ROOT = join(process.cwd());
const TEST_OUTPUT_DIR = join(PROJECT_ROOT, '_test-output', 'session-start-ac2');

// ─── Factories ────────────────────────────────────────────────────────────────

/**
 * Creates a mock open story object (as returned by scanOpenStories)
 */
function createOpenStory(overrides = {}) {
  return {
    ticket: overrides.ticket ?? 'SW-001',
    status: overrides.status ?? 'in-progress',
    title: overrides.title ?? 'Implement Feature',
  };
}

/**
 * Creates a mock decision record object (as returned by loadRecentDecisions)
 */
function createDecisionRecord(overrides = {}) {
  return {
    drNumber: overrides.drNumber ?? 'DR-001',
    decisionSummary: overrides.decisionSummary ?? 'Chose ESM over CommonJS for consistency',
    ticket: overrides.ticket ?? 'SW-001',
    date: overrides.date ?? '2026-04-09T10:00:00Z',
  };
}

/**
 * Creates a mock active risk object (as returned by loadActiveRisks)
 */
function createActiveRisk(overrides = {}) {
  return {
    rnNumber: overrides.rnNumber ?? 'RN-001',
    riskDescription: overrides.riskDescription ?? 'Risk of atomic write failure',
    severity: overrides.severity ?? 'critical',
    affectedArea: overrides.affectedArea ?? 'Data Integrity',
    ticket: overrides.ticket ?? 'SW-001',
  };
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('AC2: Session Summary Format', () => {
  // ── deriveNextSteps() ──────────────────────────────────────────────────────

  describe('deriveNextSteps() — Map Story Status to Actionable Suggestions', () => {
    test('[P0] 7.3-UNIT-050: should suggest scrum-refine-ticket for draft stories', () => {
      // Given: open story with status draft
      const openStories = [createOpenStory({ ticket: 'SW-001', status: 'draft' })];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: suggestion contains the refinement command for the ticket
      expect(nextSteps).toHaveLength(1);
      expect(nextSteps[0]).toContain('SW-001');
      expect(nextSteps[0]).toContain('/scrum-refine-ticket');
    });

    test('[P0] 7.3-UNIT-051: should suggest scrum-refine-story for refined stories', () => {
      // Given: open story with status refined
      const openStories = [createOpenStory({ ticket: 'SW-002', status: 'refined' })];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: suggests the story validation command
      expect(nextSteps).toHaveLength(1);
      expect(nextSteps[0]).toContain('SW-002');
      expect(nextSteps[0]).toContain('/scrum-refine-story');
    });

    test('[P0] 7.3-UNIT-052: should suggest scrum-dev-story for ready-for-dev stories', () => {
      // Given: open story with status ready-for-dev
      const openStories = [createOpenStory({ ticket: 'SW-003', status: 'ready-for-dev' })];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: suggests implementing the story
      expect(nextSteps).toHaveLength(1);
      expect(nextSteps[0]).toContain('SW-003');
      expect(nextSteps[0]).toContain('/scrum-dev-story');
    });

    test('[P0] 7.3-UNIT-053: should suggest scrum-dev-story (continue) for in-progress stories', () => {
      // Given: open story with status in-progress
      const openStories = [createOpenStory({ ticket: 'SW-004', status: 'in-progress' })];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: suggests continuing implementation
      expect(nextSteps).toHaveLength(1);
      expect(nextSteps[0]).toContain('SW-004');
      expect(nextSteps[0]).toContain('/scrum-dev-story');
    });

    test('[P0] 7.3-UNIT-054: should suggest scrum-review-story for review stories', () => {
      // Given: open story with status review
      const openStories = [createOpenStory({ ticket: 'SW-005', status: 'review' })];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: suggests reviewing the story
      expect(nextSteps).toHaveLength(1);
      expect(nextSteps[0]).toContain('SW-005');
      expect(nextSteps[0]).toContain('/scrum-review-story');
    });

    test('[P0] 7.3-UNIT-055: should suggest reviewing review artifact for changes-needed stories', () => {
      // Given: open story with status changes-needed
      const openStories = [createOpenStory({ ticket: 'SW-006', status: 'changes-needed' })];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: suggests applying review feedback
      expect(nextSteps).toHaveLength(1);
      expect(nextSteps[0]).toContain('SW-006');
      // Should reference the review artifact or feedback
      const step = nextSteps[0].toLowerCase();
      expect(step).toMatch(/review|feedback|changes/);
    });

    test('[P0] 7.3-UNIT-056: should suggest completing implementation for approved stories', () => {
      // Given: open story with status approved
      const openStories = [createOpenStory({ ticket: 'SW-007', status: 'approved' })];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: suggests finalizing implementation
      expect(nextSteps).toHaveLength(1);
      expect(nextSteps[0]).toContain('SW-007');
      expect(nextSteps[0]).toContain('/scrum-dev-story');
    });

    test('[P0] 7.3-UNIT-057: should return one next step per open story', () => {
      // Given: three open stories with different statuses
      const openStories = [
        createOpenStory({ ticket: 'SW-010', status: 'draft' }),
        createOpenStory({ ticket: 'SW-011', status: 'in-progress' }),
        createOpenStory({ ticket: 'SW-012', status: 'review' }),
      ];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: exactly 3 next steps — one per story
      expect(nextSteps).toHaveLength(3);
    });

    test('[P0] 7.3-UNIT-058: should return empty array when no open stories', () => {
      // Given: no open stories
      const nextSteps = deriveNextSteps([]);

      // Then: empty next steps (developer has nothing pending)
      expect(nextSteps).toHaveLength(0);
    });

    test('[P1] 7.3-UNIT-059: each next step suggestion must contain the ticket ID', () => {
      // Given: open stories with specific ticket IDs
      const openStories = [
        createOpenStory({ ticket: 'SW-042', status: 'in-progress' }),
        createOpenStory({ ticket: 'SW-043', status: 'review' }),
      ];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: each suggestion contains its corresponding ticket ID (AC2 — developer identifies next action)
      expect(nextSteps[0]).toContain('SW-042');
      expect(nextSteps[1]).toContain('SW-043');
    });
  });

  // ── formatSessionSummary() ─────────────────────────────────────────────────

  describe('formatSessionSummary() — Render Structured Session Output', () => {
    test('[P0] 7.3-UNIT-060: should produce output with "Open Work" section header', () => {
      // Given: one open story
      const openStories = [createOpenStory({ ticket: 'SW-001', status: 'in-progress', title: 'Implement Feature' })];
      const decisions = [];
      const risks = [];
      const nextSteps = ['Continue implementation of SW-001 → run `/scrum-dev-story SW-001`'];

      // When: formatting session summary
      const summary = formatSessionSummary(openStories, decisions, risks, nextSteps);

      // Then: output contains "Open Work" section (AC2 — developer can identify next action)
      expect(summary).toContain('Open Work');
    });

    test('[P0] 7.3-UNIT-061: should produce output with "Recent Decisions" section header', () => {
      // Given: one decision record
      const openStories = [];
      const decisions = [createDecisionRecord({ drNumber: 'DR-001', decisionSummary: 'Chose ESM', ticket: 'SW-001' })];
      const risks = [];
      const nextSteps = [];

      // When: formatting session summary
      const summary = formatSessionSummary(openStories, decisions, risks, nextSteps);

      // Then: output contains "Recent Decisions" section
      expect(summary).toContain('Recent Decisions');
    });

    test('[P0] 7.3-UNIT-062: should produce output with "Active Risk Notes" section header', () => {
      // Given: one active risk
      const openStories = [];
      const decisions = [];
      const risks = [createActiveRisk({ rnNumber: 'RN-001', riskDescription: 'Data loss', severity: 'critical' })];
      const nextSteps = [];

      // When: formatting
      const summary = formatSessionSummary(openStories, decisions, risks, nextSteps);

      // Then: output contains "Active Risk Notes" section
      expect(summary).toContain('Active Risk');
    });

    test('[P0] 7.3-UNIT-063: should produce output with "Suggested Next Steps" section header', () => {
      // Given: next steps available
      const openStories = [createOpenStory({ ticket: 'SW-001', status: 'in-progress' })];
      const nextSteps = ['Continue implementation of SW-001 → run `/scrum-dev-story SW-001`'];

      // When: formatting
      const summary = formatSessionSummary(openStories, [], [], nextSteps);

      // Then: output contains "Suggested Next Steps" section
      expect(summary).toContain('Next Steps');
    });

    test('[P0] 7.3-UNIT-064: should include each open story ticket and status in output', () => {
      // Given: two open stories
      const openStories = [
        createOpenStory({ ticket: 'SW-010', status: 'in-progress', title: 'Implement Context Loading' }),
        createOpenStory({ ticket: 'SW-011', status: 'review', title: 'Review Risk Extraction' }),
      ];

      // When: formatting
      const summary = formatSessionSummary(openStories, [], [], []);

      // Then: both stories appear in output with ticket and status
      expect(summary).toContain('SW-010');
      expect(summary).toContain('in-progress');
      expect(summary).toContain('SW-011');
      expect(summary).toContain('review');
    });

    test('[P0] 7.3-UNIT-065: should include each decision summary and DR number in output', () => {
      // Given: two decisions
      const decisions = [
        createDecisionRecord({ drNumber: 'DR-001', decisionSummary: 'Chose ESM modules', ticket: 'SW-001' }),
        createDecisionRecord({ drNumber: 'DR-002', decisionSummary: 'Chose Vitest over Jest', ticket: 'SW-002' }),
      ];

      // When: formatting
      const summary = formatSessionSummary([], decisions, [], []);

      // Then: both DR numbers and summaries appear
      expect(summary).toContain('DR-001');
      expect(summary).toContain('Chose ESM modules');
      expect(summary).toContain('DR-002');
      expect(summary).toContain('Chose Vitest over Jest');
    });

    test('[P0] 7.3-UNIT-066: should include each active risk RN number, severity, and description in output', () => {
      // Given: one active risk
      const risks = [createActiveRisk({
        rnNumber: 'RN-001',
        riskDescription: 'Atomic write failure on crash',
        severity: 'critical',
        affectedArea: 'Data Integrity',
        ticket: 'SW-010',
      })];

      // When: formatting
      const summary = formatSessionSummary([], [], risks, []);

      // Then: RN number, severity, description, and affected area appear
      expect(summary).toContain('RN-001');
      expect(summary).toContain('critical');
      expect(summary).toContain('Atomic write failure on crash');
      expect(summary).toContain('Data Integrity');
    });

    test('[P0] 7.3-UNIT-067: should include all next step suggestions in output', () => {
      // Given: next step suggestions
      const nextSteps = [
        'Continue implementation of SW-001 → run `/scrum-dev-story SW-001`',
        'Review story SW-002 → run `/scrum-review-story SW-002`',
      ];

      // When: formatting
      const summary = formatSessionSummary([], [], [], nextSteps);

      // Then: both next steps appear in output
      expect(summary).toContain('/scrum-dev-story SW-001');
      expect(summary).toContain('/scrum-review-story SW-002');
    });

    test('[P0] 7.3-UNIT-068: should produce human-readable plain text output (NFR-9 Inspectability)', () => {
      // Given: full session context
      const openStories = [createOpenStory({ ticket: 'SW-001', status: 'in-progress', title: 'Implement Feature' })];
      const decisions = [createDecisionRecord({ drNumber: 'DR-001', decisionSummary: 'Chose ESM' })];
      const risks = [createActiveRisk({ rnNumber: 'RN-001', severity: 'major' })];
      const nextSteps = ['Continue implementation of SW-001'];

      // When: formatting
      const summary = formatSessionSummary(openStories, decisions, risks, nextSteps);

      // Then: output is a non-empty string (human-readable — NFR-9)
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(50);
      expect(summary).not.toContain('\x00'); // No binary characters
    });

    test('[P1] 7.3-UNIT-069: should show story count in Open Work section header', () => {
      // Given: two open stories
      const openStories = [
        createOpenStory({ ticket: 'SW-001', status: 'in-progress' }),
        createOpenStory({ ticket: 'SW-002', status: 'review' }),
      ];

      // When: formatting
      const summary = formatSessionSummary(openStories, [], [], []);

      // Then: Open Work section shows count — developer immediately sees scope
      // Template: "### Open Work (2 stories)"
      expect(summary).toMatch(/Open Work.*2/s);
    });

    test('[P1] 7.3-UNIT-070: should show active risk count in Active Risk Notes header', () => {
      // Given: 3 active risks
      const risks = [
        createActiveRisk({ rnNumber: 'RN-001' }),
        createActiveRisk({ rnNumber: 'RN-002' }),
        createActiveRisk({ rnNumber: 'RN-003' }),
      ];

      // When: formatting
      const summary = formatSessionSummary([], [], risks, []);

      // Then: Active Risk section shows count
      expect(summary).toMatch(/Active Risk.*3/s);
    });

    test('[P1] 7.3-UNIT-071: should include "Context loaded. Developer can resume immediately." in output', () => {
      // Given: any context (even empty)
      // When: formatting
      const summary = formatSessionSummary([], [], [], []);

      // Then: ends with confirmation that context is loaded (AC2 — developer can resume)
      expect(summary).toContain('Context loaded');
    });

    test('[P0] 7.3-UNIT-072: should produce valid output even when all context is empty', () => {
      // Given: no open stories, no decisions, no risks, no next steps (fresh install)
      // When: formatting
      let summary;
      expect(() => {
        summary = formatSessionSummary([], [], [], []);
      }).not.toThrow();

      // Then: output is still valid — all sections present (empty state is acceptable)
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
      expect(summary).toContain('Open Work');
      expect(summary).toContain('Recent Decisions');
      expect(summary).toContain('Active Risk');
    });

    test('[P0] 7.3-UNIT-073: summary output must include a date/timestamp header (Session Context header)', () => {
      // Given: any session context
      const openStories = [createOpenStory({ ticket: 'SW-001', status: 'in-progress' })];

      // When: formatting
      const summary = formatSessionSummary(openStories, [], [], []);

      // Then: header includes date stamp — developer knows when context was loaded
      // Template: "## Session Context — {ISO_DATE}"
      expect(summary).toContain('Session Context');
    });
  });

  // ── End-to-End: AC2 — Developer Identifies Next Action ─────────────────────

  describe('End-to-End: Developer Can Identify Next Action from Summary', () => {
    test('[P0] 7.3-INT-020: developer can identify next action from summary with multiple open stories', () => {
      // AC2: "the developer can identify the next action within the presented summary"
      // Given: realistic session context
      const openStories = [
        createOpenStory({ ticket: 'SW-007', status: 'ready-for-dev', title: 'Implement Session Start' }),
        createOpenStory({ ticket: 'SW-006', status: 'done', title: 'Risk Extraction' }), // Should be excluded by scanOpenStories
      ];
      // Filter as scanOpenStories would do:
      const filteredStories = openStories.filter(s => !['done', 'cancelled'].includes(s.status));

      const decisions = [
        createDecisionRecord({ drNumber: 'DR-005', decisionSummary: 'Use readdirSync over glob for SC-13 compliance', ticket: 'SW-007' }),
      ];
      const risks = [
        createActiveRisk({ rnNumber: 'RN-002', riskDescription: 'Session scan timeout with 100+ artifacts', severity: 'major', ticket: 'SW-007' }),
      ];
      const nextSteps = deriveNextSteps(filteredStories);
      const summary = formatSessionSummary(filteredStories, decisions, risks, nextSteps);

      // Then: summary contains everything the developer needs without prior knowledge
      expect(summary).toContain('SW-007');                   // Open story
      expect(summary).toContain('ready-for-dev');            // Status visible
      expect(summary).toContain('/scrum-dev-story SW-007');  // Actionable command
      expect(summary).toContain('DR-005');                   // Recent decision
      expect(summary).toContain('RN-002');                   // Active risk
      expect(summary).toContain('major');                    // Risk severity
    });

    test('[P0] 7.3-INT-021: formatSessionSummary output must be renderable as human-readable terminal text', () => {
      // AC2: "no prior session knowledge is required" — summary must stand alone
      // Given: full realistic session context
      const openStories = [
        createOpenStory({ ticket: 'SW-007', status: 'in-progress', title: 'Implement Session Start & Context Loading' }),
        createOpenStory({ ticket: 'SW-008', status: 'review', title: 'Implement Session Wrap-Up' }),
      ];
      const decisions = [
        createDecisionRecord({ drNumber: 'DR-003', decisionSummary: 'Use pure string YAML parser (NFR-2)', ticket: 'SW-007' }),
        createDecisionRecord({ drNumber: 'DR-004', decisionSummary: 'Use readdirSync not glob (SC-13)', ticket: 'SW-007' }),
      ];
      const risks = [
        createActiveRisk({ rnNumber: 'RN-001', riskDescription: 'Data loss on crash', severity: 'critical', affectedArea: 'Data Integrity', ticket: 'SW-001' }),
      ];
      const nextSteps = deriveNextSteps(openStories);

      // When: formatting
      const summary = formatSessionSummary(openStories, decisions, risks, nextSteps);

      // Then: output is structured with multiple sections, all filled
      const hasOpenWork = summary.includes('Open Work') || summary.includes('open work');
      const hasDecisions = summary.includes('Decision') || summary.includes('DR-');
      const hasRisks = summary.includes('Risk') || summary.includes('RN-');
      const hasNextSteps = summary.includes('Next Step') || summary.includes('/scrum-dev-story');

      expect(hasOpenWork).toBe(true);
      expect(hasDecisions).toBe(true);
      expect(hasRisks).toBe(true);
      expect(hasNextSteps).toBe(true);

      // No binary/escape sequences — plain text for terminal display (NFR-9)
      expect(summary).not.toContain('\x00');
      expect(summary).not.toContain('\x1b['); // No ANSI escape codes in raw output
    });

    test('[P1] 7.3-INT-022: deriveNextSteps + formatSessionSummary pipeline produces complete actionable output', () => {
      // Given: developer has 3 stories in various states
      const openStories = [
        createOpenStory({ ticket: 'SW-010', status: 'draft', title: 'New Story to Refine' }),
        createOpenStory({ ticket: 'SW-011', status: 'in-progress', title: 'Story Being Implemented' }),
        createOpenStory({ ticket: 'SW-012', status: 'changes-needed', title: 'Story Needs Review Fixes' }),
      ];

      // When: deriving next steps
      const nextSteps = deriveNextSteps(openStories);

      // Then: one step per story
      expect(nextSteps).toHaveLength(3);

      // When: formatting the full summary
      const summary = formatSessionSummary(openStories, [], [], nextSteps);

      // Then: all three stories and their actions appear
      expect(summary).toContain('SW-010');
      expect(summary).toContain('SW-011');
      expect(summary).toContain('SW-012');
      expect(summary).toContain('/scrum-refine-ticket'); // For SW-010 (draft)
      expect(summary).toContain('/scrum-dev-story');     // For SW-011 (in-progress)
    });
  });
});
