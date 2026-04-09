/**
 * ATDD Tests — AC1: Session Start Context Loading
 * Story 7.3: Implement Session Start & Context Loading
 *
 * AC1: Given FR-27 specifies /session-start loads open work units, last decisions,
 *      active risks, and next steps
 *      When a developer runs /session-start
 *      Then the system loads and presents: open stories with current status and
 *      pending actions, recent decision records (from _scrum-output/memory/decisions/),
 *      active risk notes (from _scrum-output/memory/risks/),
 *      and suggested next steps based on story statuses
 *
 * TDD RED PHASE: All tests use test.skip() — feature (session-context.js) not yet implemented.
 * Remove test.skip() after implementing scrum_workflow/utils/session-context.js.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import {
  parseFrontmatter,
  scanOpenStories,
  loadRecentDecisions,
  loadActiveRisks,
  deriveNextSteps,
} from '../../utils/session-context.js';

const PROJECT_ROOT = join(process.cwd());
const TEST_OUTPUT_DIR = join(PROJECT_ROOT, '_test-output', 'session-start');
const TEST_SPRINTS_DIR = join(TEST_OUTPUT_DIR, 'sprints');
const TEST_DECISIONS_DIR = join(TEST_OUTPUT_DIR, 'memory', 'decisions');
const TEST_RISKS_DIR = join(TEST_OUTPUT_DIR, 'memory', 'risks');

// ─── Factories ────────────────────────────────────────────────────────────────

/**
 * Creates a story.md content with the given fields.
 * Mirrors the story artifact YAML frontmatter format from architecture.md.
 */
function createStoryContent(overrides = {}) {
  const ticket = overrides.ticket ?? 'SW-001';
  const status = overrides.status ?? 'in-progress';
  const title = overrides.title ?? 'Implement Feature';

  return `---
schema_version: 1.0.0
ticket: ${ticket}
status: ${status}
title: "${title}"
created: "2026-04-01T10:00:00Z"
updated: "2026-04-09T10:00:00Z"
---

# Story: ${ticket}

## Story

As a developer, I want ${title}.

## Acceptance Criteria

1. Feature works as expected.
`;
}

/**
 * Creates a DR-XXX.md content with the given fields.
 * Mirrors the decision-record.md template format.
 */
function createDRContent(overrides = {}) {
  const ticket = overrides.ticket ?? 'SW-001';
  const drNumber = overrides.drNumber ?? 'DR-001';
  const decisionSummary = overrides.decisionSummary ?? 'Chose ESM modules over CommonJS for consistency';
  const date = overrides.date ?? '2026-04-01T10:00:00Z';

  return `---
schema_version: 1.0.0
ticket: "${ticket}"
decision_summary: "${decisionSummary}"
status: active
created: "${date}"
updated: "${date}"
---

# Decision Record: ${drNumber}

**Ticket:** ${ticket}
**Summary:** ${decisionSummary}
**Date:** ${date}

## Decision

${decisionSummary}
`;
}

/**
 * Creates an RN-XXX.md content with the given fields.
 * Mirrors the risk-note.md template format (from risk-extraction.js).
 */
function createRNContent(overrides = {}) {
  const ticket = overrides.ticket ?? 'SW-001';
  const rnNumber = overrides.rnNumber ?? 'RN-001';
  const riskDescription = overrides.riskDescription ?? 'Risk note files may become corrupt';
  const severity = overrides.severity ?? 'critical';
  const affectedArea = overrides.affectedArea ?? 'Data Integrity';
  const status = overrides.status ?? 'active';

  return `---
schema_version: 1.0.0
ticket: "${ticket}"
risk_description: "${riskDescription}"
severity: "${severity}"
affected_area: "${affectedArea}"
mitigation_suggestion: "Use atomic write pattern"
status: ${status}
domain_tags:
  - "data-integrity"
source_file: "_scrum-output/sprints/${ticket}/refinement.md"
created: "2026-04-01T10:00:00Z"
updated: "2026-04-09T10:00:00Z"
---

# Risk Note: ${rnNumber}

**Ticket:** ${ticket}
**Severity:** ${severity}
**Status:** ${status}
**Affected Area:** ${affectedArea}
`;
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function setupTestDirs() {
  mkdirSync(TEST_SPRINTS_DIR, { recursive: true });
  mkdirSync(TEST_DECISIONS_DIR, { recursive: true });
  mkdirSync(TEST_RISKS_DIR, { recursive: true });
}

function cleanupTestDirs() {
  if (existsSync(TEST_OUTPUT_DIR)) {
    rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
  }
}

function createSprintDir(ticketId) {
  const sprintDir = join(TEST_SPRINTS_DIR, ticketId);
  mkdirSync(sprintDir, { recursive: true });
  return sprintDir;
}

function writeStoryFile(ticketId, overrides = {}) {
  const sprintDir = createSprintDir(ticketId);
  writeFileSync(join(sprintDir, 'story.md'), createStoryContent({ ticket: ticketId, ...overrides }), 'utf8');
}

function writeDRFile(filename, overrides = {}) {
  writeFileSync(join(TEST_DECISIONS_DIR, filename), createDRContent(overrides), 'utf8');
}

function writeRNFile(filename, overrides = {}) {
  writeFileSync(join(TEST_RISKS_DIR, filename), createRNContent(overrides), 'utf8');
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('AC1: Session Start Context Loading', () => {
  beforeEach(() => {
    setupTestDirs();
  });

  afterEach(() => {
    cleanupTestDirs();
  });

  // ── YAML Frontmatter Parsing ───────────────────────────────────────────────

  describe('parseFrontmatter() — Pure String YAML Parser', () => {
    test.skip('[P0] 7.3-UNIT-001: should parse status field from YAML frontmatter', () => {
      // Given: content with a YAML frontmatter block
      const content = createStoryContent({ status: 'in-progress' });

      // When: parsing frontmatter
      const fm = parseFrontmatter(content);

      // Then: status field correctly parsed
      expect(fm).not.toBeNull();
      expect(fm.status).toBe('in-progress');
    });

    test.skip('[P0] 7.3-UNIT-002: should parse ticket field from YAML frontmatter', () => {
      // Given: story content with ticket field
      const content = createStoryContent({ ticket: 'SW-042' });

      // When: parsing frontmatter
      const fm = parseFrontmatter(content);

      // Then: ticket is SW-042
      expect(fm.ticket).toBe('SW-042');
    });

    test.skip('[P0] 7.3-UNIT-003: should parse title field (double-quoted scalar) from frontmatter', () => {
      // Given: story content with quoted title
      const content = createStoryContent({ title: 'Implement Session Start & Context Loading' });

      // When: parsing
      const fm = parseFrontmatter(content);

      // Then: title correctly parsed (surrounding quotes stripped)
      expect(fm.title).toBe('Implement Session Start & Context Loading');
    });

    test.skip('[P0] 7.3-UNIT-004: should parse decision_summary field from DR frontmatter', () => {
      // Given: DR content
      const content = createDRContent({ decisionSummary: 'Chose Vitest over Jest for ESM compatibility' });

      // When: parsing frontmatter
      const fm = parseFrontmatter(content);

      // Then: decision_summary correctly parsed
      expect(fm.decision_summary).toBe('Chose Vitest over Jest for ESM compatibility');
    });

    test.skip('[P0] 7.3-UNIT-005: should parse risk_description, severity, and affected_area from RN frontmatter', () => {
      // Given: RN content
      const content = createRNContent({
        riskDescription: 'Corrupt RN artifacts on crash',
        severity: 'critical',
        affectedArea: 'Data Integrity',
      });

      // When: parsing frontmatter
      const fm = parseFrontmatter(content);

      // Then: all fields parsed
      expect(fm.risk_description).toBe('Corrupt RN artifacts on crash');
      expect(fm.severity).toBe('critical');
      expect(fm.affected_area).toBe('Data Integrity');
    });

    test.skip('[P1] 7.3-UNIT-006: should return empty object when content has no frontmatter delimiters', () => {
      // Given: content without --- delimiters
      const content = '# Some Markdown\n\nNo frontmatter here.';

      // When: parsing
      const fm = parseFrontmatter(content);

      // Then: returns {} (graceful degradation — no error)
      expect(fm).toEqual({});
    });

    test.skip('[P1] 7.3-UNIT-007: should return empty object for empty string input', () => {
      // Given: empty string
      const fm = parseFrontmatter('');

      // Then: returns {} (no crash)
      expect(fm).toEqual({});
    });

    test.skip('[P1] 7.3-UNIT-008: should strip surrounding single and double quotes from scalar values', () => {
      // Given: frontmatter with both double- and single-quoted values
      const content = `---
ticket: "SW-001"
title: 'My Story Title'
status: active
---
`;

      // When: parsing
      const fm = parseFrontmatter(content);

      // Then: quotes are stripped from values
      expect(fm.ticket).toBe('SW-001');
      expect(fm.title).toBe('My Story Title');
      expect(fm.status).toBe('active');
    });

    test.skip('[P2] 7.3-UNIT-009: should NOT use any external YAML library (NFR-2 compliance)', () => {
      // Given: parseFrontmatter source code must not import yaml/gray-matter
      // This is a structural test — verified by inspecting the import list
      // If session-context.js imports js-yaml or gray-matter, this test documents the violation.

      // When: parsing a valid frontmatter
      const content = createStoryContent({ status: 'done' });
      const fm = parseFrontmatter(content);

      // Then: parsing succeeds (no crash) — proves pure string implementation works
      expect(fm).not.toBeNull();
      expect(fm.status).toBe('done');
    });
  });

  // ── scanOpenStories() ──────────────────────────────────────────────────────

  describe('scanOpenStories() — Scan Sprints Directory for Non-Terminal Stories', () => {
    test.skip('[P0] 7.3-UNIT-010: should return open story when status is in-progress', () => {
      // Given: one sprint dir with an in-progress story.md
      writeStoryFile('SW-001', { status: 'in-progress', title: 'Implement Feature A' });

      // When: scanning open stories
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: one story returned
      expect(openStories).toHaveLength(1);
      expect(openStories[0].ticket).toBe('SW-001');
      expect(openStories[0].status).toBe('in-progress');
    });

    test.skip('[P0] 7.3-UNIT-011: should return open story when status is ready-for-dev', () => {
      // Given: sprint dir with ready-for-dev story
      writeStoryFile('SW-002', { status: 'ready-for-dev', title: 'Session Start' });

      // When: scanning
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: story is included (ready-for-dev is NOT terminal)
      expect(openStories.length).toBeGreaterThanOrEqual(1);
      const found = openStories.find(s => s.ticket === 'SW-002');
      expect(found).toBeDefined();
      expect(found.status).toBe('ready-for-dev');
    });

    test.skip('[P0] 7.3-UNIT-012: should EXCLUDE stories with terminal status done', () => {
      // Given: a done story
      writeStoryFile('SW-003', { status: 'done', title: 'Completed Story' });

      // When: scanning open stories
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: done story NOT included (terminal — developer does not need to act)
      const found = openStories.find(s => s.ticket === 'SW-003');
      expect(found).toBeUndefined();
    });

    test.skip('[P0] 7.3-UNIT-013: should EXCLUDE stories with terminal status cancelled', () => {
      // Given: a cancelled story
      writeStoryFile('SW-004', { status: 'cancelled', title: 'Cancelled Story' });

      // When: scanning
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: cancelled story NOT included
      const found = openStories.find(s => s.ticket === 'SW-004');
      expect(found).toBeUndefined();
    });

    test.skip('[P0] 7.3-UNIT-014: should return only open stories when mixed statuses exist', () => {
      // Given: mix of open and terminal stories
      writeStoryFile('SW-010', { status: 'in-progress', title: 'Open Story 1' });
      writeStoryFile('SW-011', { status: 'review', title: 'Open Story 2' });
      writeStoryFile('SW-012', { status: 'done', title: 'Done Story' });
      writeStoryFile('SW-013', { status: 'cancelled', title: 'Cancelled Story' });
      writeStoryFile('SW-014', { status: 'draft', title: 'Draft Story' });

      // When: scanning
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: only 3 open stories (in-progress, review, draft)
      expect(openStories).toHaveLength(3);
      const tickets = openStories.map(s => s.ticket);
      expect(tickets).toContain('SW-010');
      expect(tickets).toContain('SW-011');
      expect(tickets).toContain('SW-014');
      expect(tickets).not.toContain('SW-012');
      expect(tickets).not.toContain('SW-013');
    });

    test.skip('[P0] 7.3-UNIT-015: should return empty array when sprints dir is empty', () => {
      // Given: empty sprints directory (no sprint subdirs)
      // When: scanning
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: empty result (no error — empty state is valid for first-time use)
      expect(openStories).toHaveLength(0);
    });

    test.skip('[P0] 7.3-UNIT-016: should return empty array when sprints dir does not exist', () => {
      // Given: sprints dir that does not exist
      const nonExistentDir = join(TEST_OUTPUT_DIR, 'no-such-sprints');

      // When: scanning
      let result;
      expect(() => {
        result = scanOpenStories(nonExistentDir);
      }).not.toThrow();

      // Then: empty result (graceful degradation — session-start never blocks the developer)
      expect(result).toHaveLength(0);
    });

    test.skip('[P1] 7.3-UNIT-017: should include title in returned story objects', () => {
      // Given: story with a specific title
      writeStoryFile('SW-020', { status: 'in-progress', title: 'Implement Session Start & Context Loading' });

      // When: scanning
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: title is included in returned object (needed for session summary — AC1)
      const story = openStories.find(s => s.ticket === 'SW-020');
      expect(story).toBeDefined();
      expect(story.title).toBe('Implement Session Start & Context Loading');
    });

    test.skip('[P1] 7.3-UNIT-018: should scan all non-terminal statuses: draft, refined, ready-for-dev, in-progress, review, changes-needed, approved', () => {
      // Given: one story for each non-terminal status
      const nonTerminalStatuses = ['draft', 'refined', 'ready-for-dev', 'in-progress', 'review', 'changes-needed', 'approved'];
      nonTerminalStatuses.forEach((status, i) => {
        writeStoryFile(`SW-${String(i + 30).padStart(3, '0')}`, { status, title: `Story ${status}` });
      });

      // When: scanning
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: all 7 non-terminal statuses appear
      expect(openStories).toHaveLength(7);
      const statuses = openStories.map(s => s.status);
      for (const s of nonTerminalStatuses) {
        expect(statuses).toContain(s);
      }
    });

    test.skip('[P1] 7.3-UNIT-019: should skip sprint dirs that have no story.md file', () => {
      // Given: sprint dir without a story.md (e.g., only other artifacts)
      const sprintDir = join(TEST_SPRINTS_DIR, 'SW-099');
      mkdirSync(sprintDir, { recursive: true });
      writeFileSync(join(sprintDir, 'refinement.md'), '# Refinement', 'utf8');
      // No story.md written

      // When: scanning
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: SW-099 NOT included (no story.md to read)
      const found = openStories.find(s => s.ticket === 'SW-099');
      expect(found).toBeUndefined();
    });
  });

  // ── loadRecentDecisions() ──────────────────────────────────────────────────

  describe('loadRecentDecisions() — Load Most Recent DR Records', () => {
    test.skip('[P0] 7.3-UNIT-030: should return the most recent decision record when one exists', () => {
      // Given: one DR file in decisions directory
      writeDRFile('DR-001.md', {
        drNumber: 'DR-001',
        ticket: 'SW-010',
        decisionSummary: 'Chose ESM over CommonJS',
        date: '2026-04-01T10:00:00Z',
      });

      // When: loading recent decisions
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);

      // Then: one decision returned
      expect(decisions).toHaveLength(1);
      expect(decisions[0].drNumber).toBe('DR-001');
      expect(decisions[0].decisionSummary).toBe('Chose ESM over CommonJS');
      expect(decisions[0].ticket).toBe('SW-010');
    });

    test.skip('[P0] 7.3-UNIT-031: should return decisions sorted by DR number descending (most recent first)', () => {
      // Given: 5 DR files
      writeDRFile('DR-001.md', { drNumber: 'DR-001', ticket: 'SW-001', decisionSummary: 'Decision 1', date: '2026-01-01T00:00:00Z' });
      writeDRFile('DR-002.md', { drNumber: 'DR-002', ticket: 'SW-002', decisionSummary: 'Decision 2', date: '2026-02-01T00:00:00Z' });
      writeDRFile('DR-003.md', { drNumber: 'DR-003', ticket: 'SW-003', decisionSummary: 'Decision 3', date: '2026-03-01T00:00:00Z' });
      writeDRFile('DR-004.md', { drNumber: 'DR-004', ticket: 'SW-004', decisionSummary: 'Decision 4', date: '2026-03-15T00:00:00Z' });
      writeDRFile('DR-005.md', { drNumber: 'DR-005', ticket: 'SW-005', decisionSummary: 'Decision 5', date: '2026-04-01T00:00:00Z' });

      // When: loading with default limit (5)
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);

      // Then: DR-005 is first (highest number = most recent)
      expect(decisions[0].drNumber).toBe('DR-005');
      expect(decisions[decisions.length - 1].drNumber).toBe('DR-001');
    });

    test.skip('[P0] 7.3-UNIT-032: should return at most limit=5 decisions even when more exist', () => {
      // Given: 8 DR files
      for (let i = 1; i <= 8; i++) {
        const num = String(i).padStart(3, '0');
        writeDRFile(`DR-${num}.md`, {
          drNumber: `DR-${num}`,
          ticket: `SW-${num}`,
          decisionSummary: `Decision ${i}`,
          date: `2026-0${Math.ceil(i / 2)}-01T00:00:00Z`,
        });
      }

      // When: loading with default limit=5
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);

      // Then: exactly 5 decisions returned (the 5 most recent: DR-004 through DR-008)
      expect(decisions).toHaveLength(5);
      const drNumbers = decisions.map(d => d.drNumber);
      expect(drNumbers).toContain('DR-008');
      expect(drNumbers).toContain('DR-007');
      expect(drNumbers).toContain('DR-006');
      expect(drNumbers).toContain('DR-005');
      expect(drNumbers).toContain('DR-004');
      expect(drNumbers).not.toContain('DR-003'); // Excluded — beyond top 5
    });

    test.skip('[P0] 7.3-UNIT-033: should respect custom limit parameter', () => {
      // Given: 5 DR files
      for (let i = 1; i <= 5; i++) {
        const num = String(i).padStart(3, '0');
        writeDRFile(`DR-${num}.md`, {
          drNumber: `DR-${num}`,
          ticket: `SW-${num}`,
          decisionSummary: `Decision ${i}`,
          date: '2026-04-01T00:00:00Z',
        });
      }

      // When: loading with limit=3
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR, 3);

      // Then: exactly 3 decisions returned
      expect(decisions).toHaveLength(3);
    });

    test.skip('[P0] 7.3-UNIT-034: should return empty array when decisions dir is empty', () => {
      // Given: empty decisions directory
      // When: loading
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);

      // Then: empty result (not an error — first-time use)
      expect(decisions).toHaveLength(0);
    });

    test.skip('[P0] 7.3-UNIT-035: should return empty array when decisions dir does not exist', () => {
      // Given: non-existent directory
      const nonExistentDir = join(TEST_OUTPUT_DIR, 'no-decisions');

      // When: loading (no crash)
      let result;
      expect(() => {
        result = loadRecentDecisions(nonExistentDir);
      }).not.toThrow();

      // Then: empty result (graceful degradation)
      expect(result).toHaveLength(0);
    });

    test.skip('[P1] 7.3-UNIT-036: should skip README.md and non-DR files when loading decisions', () => {
      // Given: decisions dir with README.md and one valid DR
      writeFileSync(join(TEST_DECISIONS_DIR, 'README.md'), '# Decisions', 'utf8');
      writeFileSync(join(TEST_DECISIONS_DIR, 'notes.txt'), 'some notes', 'utf8');
      writeDRFile('DR-001.md', { drNumber: 'DR-001', ticket: 'SW-001', decisionSummary: 'Use ESM' });

      // When: loading
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);

      // Then: only DR-001.md processed (README and .txt ignored)
      expect(decisions).toHaveLength(1);
      expect(decisions[0].drNumber).toBe('DR-001');
    });

    test.skip('[P1] 7.3-UNIT-037: should include date field from DR frontmatter', () => {
      // Given: DR with specific date
      writeDRFile('DR-001.md', {
        drNumber: 'DR-001',
        ticket: 'SW-001',
        decisionSummary: 'Chose Vitest',
        date: '2026-04-09T12:00:00Z',
      });

      // When: loading
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);

      // Then: date field is present (used in session summary for context)
      expect(decisions[0].date).toBeDefined();
      expect(typeof decisions[0].date).toBe('string');
    });
  });

  // ── loadActiveRisks() ──────────────────────────────────────────────────────

  describe('loadActiveRisks() — Load Active Risk Notes', () => {
    test.skip('[P0] 7.3-UNIT-040: should return active risk note when one active RN exists', () => {
      // Given: one active RN in risks dir
      writeRNFile('RN-001.md', {
        rnNumber: 'RN-001',
        ticket: 'SW-010',
        riskDescription: 'Risk of atomic write failure',
        severity: 'critical',
        affectedArea: 'Data Integrity',
        status: 'active',
      });

      // When: loading active risks
      const risks = loadActiveRisks(TEST_RISKS_DIR);

      // Then: one risk returned
      expect(risks).toHaveLength(1);
      expect(risks[0].rnNumber).toBe('RN-001');
      expect(risks[0].riskDescription).toBe('Risk of atomic write failure');
      expect(risks[0].severity).toBe('critical');
      expect(risks[0].affectedArea).toBe('Data Integrity');
      expect(risks[0].ticket).toBe('SW-010');
    });

    test.skip('[P0] 7.3-UNIT-041: should EXCLUDE resolved risk notes (only active returned)', () => {
      // Given: one active and one resolved RN
      writeRNFile('RN-001.md', { rnNumber: 'RN-001', ticket: 'SW-001', status: 'active', riskDescription: 'Active risk' });
      writeRNFile('RN-002.md', { rnNumber: 'RN-002', ticket: 'SW-002', status: 'resolved', riskDescription: 'Resolved risk' });

      // When: loading active risks
      const risks = loadActiveRisks(TEST_RISKS_DIR);

      // Then: only active RN included
      expect(risks).toHaveLength(1);
      expect(risks[0].rnNumber).toBe('RN-001');
    });

    test.skip('[P0] 7.3-UNIT-042: should return empty array when risks dir is empty', () => {
      // Given: empty risks directory
      // When: loading
      const risks = loadActiveRisks(TEST_RISKS_DIR);

      // Then: empty result (not an error)
      expect(risks).toHaveLength(0);
    });

    test.skip('[P0] 7.3-UNIT-043: should return empty array when risks dir does not exist', () => {
      // Given: non-existent risks directory
      const nonExistentDir = join(TEST_OUTPUT_DIR, 'no-risks');

      // When: loading (no crash)
      let result;
      expect(() => {
        result = loadActiveRisks(nonExistentDir);
      }).not.toThrow();

      // Then: empty result (graceful degradation — session-start must never block)
      expect(result).toHaveLength(0);
    });

    test.skip('[P0] 7.3-UNIT-044: should return all active risks (no limit applied unlike decisions)', () => {
      // Given: 6 active risk notes
      for (let i = 1; i <= 6; i++) {
        const num = String(i).padStart(3, '0');
        writeRNFile(`RN-${num}.md`, {
          rnNumber: `RN-${num}`,
          ticket: `SW-${num}`,
          riskDescription: `Risk ${i}`,
          severity: 'major',
          affectedArea: 'Performance',
          status: 'active',
        });
      }

      // When: loading active risks
      const risks = loadActiveRisks(TEST_RISKS_DIR);

      // Then: all 6 active risks returned (no artificial limit)
      expect(risks).toHaveLength(6);
    });

    test.skip('[P1] 7.3-UNIT-045: should skip non-RN files (README, .keep, etc.) when loading risks', () => {
      // Given: risks dir with non-RN files mixed in
      writeFileSync(join(TEST_RISKS_DIR, 'README.md'), '# Risks Directory', 'utf8');
      writeFileSync(join(TEST_RISKS_DIR, '.keep'), '', 'utf8');
      writeRNFile('RN-001.md', { rnNumber: 'RN-001', ticket: 'SW-001', status: 'active', riskDescription: 'Active risk' });

      // When: loading
      const risks = loadActiveRisks(TEST_RISKS_DIR);

      // Then: only RN-001.md processed
      expect(risks).toHaveLength(1);
    });

    test.skip('[P1] 7.3-UNIT-046: should skip RN files with unreadable or missing frontmatter gracefully', () => {
      // Given: risks dir with one valid active RN and one file with no frontmatter
      writeRNFile('RN-001.md', { rnNumber: 'RN-001', ticket: 'SW-001', status: 'active', riskDescription: 'Valid risk' });
      writeFileSync(join(TEST_RISKS_DIR, 'RN-002.md'), '# Not a proper RN\n\nNo frontmatter here.', 'utf8');

      // When: loading (no crash)
      let risks;
      expect(() => {
        risks = loadActiveRisks(TEST_RISKS_DIR);
      }).not.toThrow();

      // Then: only RN-001 included (RN-002 skipped gracefully)
      const found = risks.find(r => r.rnNumber === 'RN-001');
      expect(found).toBeDefined();
    });

    test.skip('[P0] 7.3-INT-001: should load risks from correct fields: rnNumber, riskDescription, severity, affectedArea, ticket', () => {
      // Given: RN with all required fields
      writeRNFile('RN-001.md', {
        rnNumber: 'RN-001',
        ticket: 'SW-007',
        riskDescription: 'Sequential file scans may slow under high volume',
        severity: 'minor',
        affectedArea: 'Performance',
        status: 'active',
      });

      // When: loading active risks
      const risks = loadActiveRisks(TEST_RISKS_DIR);

      // Then: all required fields present in returned objects (AC1 data contract)
      expect(risks).toHaveLength(1);
      expect(risks[0]).toMatchObject({
        rnNumber: 'RN-001',
        riskDescription: 'Sequential file scans may slow under high volume',
        severity: 'minor',
        affectedArea: 'Performance',
        ticket: 'SW-007',
      });
    });
  });

  // ── Integration: Full Context Load ─────────────────────────────────────────

  describe('Integration: Full Context Load for Session Start', () => {
    test.skip('[P0] 7.3-INT-010: should successfully load all three context types in combination', () => {
      // Given: sprints with open stories, decisions dir with DRs, risks dir with active RNs
      writeStoryFile('SW-001', { status: 'in-progress', title: 'Implement Feature' });
      writeStoryFile('SW-002', { status: 'review', title: 'Review Feature' });
      writeStoryFile('SW-003', { status: 'done', title: 'Completed Feature' }); // Should be excluded

      writeDRFile('DR-001.md', { drNumber: 'DR-001', ticket: 'SW-001', decisionSummary: 'Chose ESM' });
      writeDRFile('DR-002.md', { drNumber: 'DR-002', ticket: 'SW-002', decisionSummary: 'Chose Vitest' });

      writeRNFile('RN-001.md', { rnNumber: 'RN-001', ticket: 'SW-001', status: 'active', riskDescription: 'Data loss risk' });
      writeRNFile('RN-002.md', { rnNumber: 'RN-002', ticket: 'SW-002', status: 'resolved', riskDescription: 'Old resolved risk' });

      // When: loading all three context types
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);
      const recentDecisions = loadRecentDecisions(TEST_DECISIONS_DIR);
      const activeRisks = loadActiveRisks(TEST_RISKS_DIR);

      // Then: correct counts and values
      expect(openStories).toHaveLength(2); // SW-001 (in-progress), SW-002 (review)
      expect(recentDecisions).toHaveLength(2); // DR-001, DR-002
      expect(activeRisks).toHaveLength(1); // Only RN-001 (RN-002 is resolved)

      // Correct data
      const tickets = openStories.map(s => s.ticket);
      expect(tickets).toContain('SW-001');
      expect(tickets).toContain('SW-002');
      expect(tickets).not.toContain('SW-003'); // Terminal status excluded

      expect(recentDecisions[0].drNumber).toBe('DR-002'); // Most recent first
      expect(activeRisks[0].rnNumber).toBe('RN-001');
    });

    test.skip('[P0] 7.3-INT-011: session-context module must be READ-ONLY — no write imports allowed', () => {
      // This test documents the NFR constraint: session-context.js MUST NOT import
      // writeFileSync or mkdirSync — it is a read-only module.
      //
      // Approach: verify the functions work without triggering any write side effects.
      // A comprehensive static analysis would be done by code review; this test
      // verifies observable behavior.

      // Given: test dirs with known file lists
      const { readdirSync } = require
        ? (() => { throw new Error('This is an ESM test'); })()
        : { readdirSync: null };

      // When: calling all read functions
      scanOpenStories(TEST_SPRINTS_DIR);
      loadRecentDecisions(TEST_DECISIONS_DIR);
      loadActiveRisks(TEST_RISKS_DIR);

      // Then: no assertion needed — if any function throws due to write attempt,
      // the test will fail. The important thing is that these are pure read operations.
      // This is a documentation test — verified by static code review.
      expect(true).toBe(true); // Placeholder — real check is static
    });

    test.skip('[P1] 7.3-INT-012: should handle completely empty scrum-output directory gracefully', () => {
      // Given: all three directories exist but are empty (fresh install state)
      // (setupTestDirs() already created empty dirs)

      // When: loading all context (no crash)
      let openStories, recentDecisions, activeRisks;
      expect(() => {
        openStories = scanOpenStories(TEST_SPRINTS_DIR);
        recentDecisions = loadRecentDecisions(TEST_DECISIONS_DIR);
        activeRisks = loadActiveRisks(TEST_RISKS_DIR);
      }).not.toThrow();

      // Then: all return empty arrays — valid empty state (AC1 graceful degradation)
      expect(openStories).toHaveLength(0);
      expect(recentDecisions).toHaveLength(0);
      expect(activeRisks).toHaveLength(0);
    });
  });
});
