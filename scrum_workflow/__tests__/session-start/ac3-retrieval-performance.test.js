/**
 * ATDD Tests — AC3: Retrieval Performance with 100+ Artifacts
 * Story 7.3: Implement Session Start & Context Loading
 *
 * AC3: Given SC-13 specifies retrieval performance with 100+ artifacts
 *      When session start searches for context across a large _scrum-output/ directory
 *      Then the search completes in under 10 seconds
 *
 * Implementation note (from Dev Notes):
 * "Create 100+ mock artifact files in _test-output/ using beforeEach, run
 * scanOpenStories(), loadRecentDecisions(), and loadActiveRisks() with performance
 * timing — assert completion within 5000ms (2x safety margin over 10s requirement
 * since test env may be slower)."
 *
 * TDD RED PHASE: All tests use test() — feature (session-context.js) not yet implemented.
 * Remove test() after implementing scrum_workflow/utils/session-context.js.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import {
  scanOpenStories,
  loadRecentDecisions,
  loadActiveRisks,
} from '../../utils/session-context.js';

const PROJECT_ROOT = join(process.cwd());
const TEST_OUTPUT_DIR = join(PROJECT_ROOT, '_test-output', 'session-start-ac3');
const TEST_SPRINTS_DIR = join(TEST_OUTPUT_DIR, 'sprints');
const TEST_DECISIONS_DIR = join(TEST_OUTPUT_DIR, 'memory', 'decisions');
const TEST_RISKS_DIR = join(TEST_OUTPUT_DIR, 'memory', 'risks');

// Performance budget: 5000ms (2x safety margin over SC-13's 10 second requirement)
// Dev Notes: "assert completion within 5000ms (2x safety margin over 10s requirement
// since test env may be slower)"
const PERFORMANCE_BUDGET_MS = 5000;

// ─── Factories ────────────────────────────────────────────────────────────────

/**
 * Creates a story.md file content with the given parameters.
 */
function createStoryContent(ticket, status = 'in-progress') {
  return `---
schema_version: 1.0.0
ticket: ${ticket}
status: ${status}
title: "Story ${ticket}"
created: "2026-04-01T10:00:00Z"
updated: "2026-04-09T10:00:00Z"
---

# Story: ${ticket}

## Story

As a developer, I want to implement ${ticket}.

## Acceptance Criteria

1. Feature works correctly.
`;
}

/**
 * Creates a DR-XXX.md file content.
 */
function createDRContent(drNumber, ticket) {
  return `---
schema_version: 1.0.0
ticket: "${ticket}"
decision_summary: "Decision for ${drNumber}: chose implementation approach"
status: active
created: "2026-04-01T10:00:00Z"
updated: "2026-04-09T10:00:00Z"
---

# Decision Record: ${drNumber}

**Ticket:** ${ticket}
**Summary:** Decision for ${drNumber}: chose implementation approach
`;
}

/**
 * Creates an RN-XXX.md file content.
 */
function createRNContent(rnNumber, ticket, status = 'active') {
  return `---
schema_version: 1.0.0
ticket: "${ticket}"
risk_description: "Risk ${rnNumber}: performance degradation under load"
severity: "minor"
affected_area: "Performance"
mitigation_suggestion: "Optimize file scanning algorithm"
status: ${status}
domain_tags:
  - "performance"
source_file: "_scrum-output/sprints/${ticket}/refinement.md"
created: "2026-04-01T10:00:00Z"
updated: "2026-04-09T10:00:00Z"
---

# Risk Note: ${rnNumber}

**Ticket:** ${ticket}
**Severity:** minor
**Status:** ${status}
**Affected Area:** Performance
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

/**
 * Creates N sprint directories, each with a story.md.
 * Mix of open and done statuses to simulate realistic state.
 *
 * @param {number} count - Number of sprint dirs to create
 * @returns {number} count of open (non-terminal) stories created
 */
function createMassStoryFiles(count) {
  let openCount = 0;
  for (let i = 1; i <= count; i++) {
    const ticketNum = String(i).padStart(3, '0');
    const ticket = `SW-${ticketNum}`;
    // Alternate between open and done to simulate realistic directory
    const status = i % 4 === 0 ? 'done' : (i % 5 === 0 ? 'cancelled' : 'in-progress');
    if (!['done', 'cancelled'].includes(status)) {
      openCount++;
    }
    const sprintDir = join(TEST_SPRINTS_DIR, ticket);
    mkdirSync(sprintDir, { recursive: true });
    writeFileSync(join(sprintDir, 'story.md'), createStoryContent(ticket, status), 'utf8');
  }
  return openCount;
}

/**
 * Creates N DR-XXX.md files in the decisions directory.
 *
 * @param {number} count - Number of DR files to create
 */
function createMassDRFiles(count) {
  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(3, '0');
    const drNumber = `DR-${num}`;
    const ticket = `SW-${num}`;
    writeFileSync(join(TEST_DECISIONS_DIR, `${drNumber}.md`), createDRContent(drNumber, ticket), 'utf8');
  }
}

/**
 * Creates N RN-XXX.md files in the risks directory.
 * Mix of active and resolved to simulate realistic accumulation.
 *
 * @param {number} count - Number of RN files to create
 * @returns {number} count of active RNs created
 */
function createMassRNFiles(count) {
  let activeCount = 0;
  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(3, '0');
    const rnNumber = `RN-${num}`;
    const ticket = `SW-${String(Math.ceil(i / 2)).padStart(3, '0')}`;
    // Some resolved (older risks), some active (recent)
    const status = i <= Math.floor(count * 0.6) ? 'resolved' : 'active';
    if (status === 'active') activeCount++;
    writeFileSync(join(TEST_RISKS_DIR, `${rnNumber}.md`), createRNContent(rnNumber, ticket, status), 'utf8');
  }
  return activeCount;
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('AC3: Retrieval Performance with 100+ Artifacts', () => {
  beforeEach(() => {
    setupTestDirs();
  });

  afterEach(() => {
    cleanupTestDirs();
  });

  // ── scanOpenStories() Performance ──────────────────────────────────────────

  describe('scanOpenStories() — Performance with 100+ Sprint Directories', () => {
    test('[P0] 7.3-PERF-001: should scan 100 sprint directories in under 5000ms (SC-13 compliance)', () => {
      // Given: 100 sprint directories (realistic large project scale)
      createMassStoryFiles(100);

      // When: scanning with performance timing
      const start = performance.now();
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);
      const elapsed = performance.now() - start;

      // Then: completes within budget (SC-13: under 10s — test uses 5s safety margin)
      expect(elapsed).toBeLessThan(PERFORMANCE_BUDGET_MS);
      // Sanity check: stories were actually scanned
      expect(openStories.length).toBeGreaterThan(0);
    });

    test('[P0] 7.3-PERF-002: should scan 150 sprint directories in under 5000ms', () => {
      // Given: 150 sprint dirs (stress test — beyond minimum requirement)
      createMassStoryFiles(150);

      // When: scanning with timing
      const start = performance.now();
      scanOpenStories(TEST_SPRINTS_DIR);
      const elapsed = performance.now() - start;

      // Then: still completes within budget despite larger directory
      expect(elapsed).toBeLessThan(PERFORMANCE_BUDGET_MS);
    });

    test('[P1] 7.3-PERF-003: should return correct open story count from 100 mixed-status stories', () => {
      // Given: 100 sprint dirs with realistic mix of open and terminal statuses
      const expectedOpenCount = createMassStoryFiles(100);

      // When: scanning
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: correct count of open stories returned (done/cancelled correctly excluded)
      expect(openStories.length).toBe(expectedOpenCount);
    });

    test('[P1] 7.3-PERF-004: each returned story from large scan must have required fields', () => {
      // Given: 100 sprint dirs
      createMassStoryFiles(100);

      // When: scanning
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);

      // Then: every returned story has required fields (ticket, status — data quality under load)
      expect(openStories.length).toBeGreaterThan(0);
      for (const story of openStories) {
        expect(story.ticket).toBeDefined();
        expect(typeof story.ticket).toBe('string');
        expect(story.ticket).toMatch(/^SW-\d{3}$/);
        expect(story.status).toBeDefined();
        expect(typeof story.status).toBe('string');
        expect(['in-progress', 'draft', 'refined', 'ready-for-dev', 'review', 'changes-needed', 'approved'])
          .toContain(story.status);
      }
    });
  });

  // ── loadRecentDecisions() Performance ─────────────────────────────────────

  describe('loadRecentDecisions() — Performance with 100+ DR Files', () => {
    test('[P0] 7.3-PERF-010: should load recent decisions from 100 DR files in under 5000ms', () => {
      // Given: 100 DR files (large accumulation over time)
      createMassDRFiles(100);

      // When: loading with performance timing
      const start = performance.now();
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);
      const elapsed = performance.now() - start;

      // Then: completes within budget
      expect(elapsed).toBeLessThan(PERFORMANCE_BUDGET_MS);
      // Sanity: decisions returned (top 5 by default)
      expect(decisions.length).toBeGreaterThan(0);
    });

    test('[P0] 7.3-PERF-011: should NOT read all 100 DR files — only reads top 5 (efficiency requirement)', () => {
      // Given: 100 DR files exist
      createMassDRFiles(100);

      // When: loading with default limit=5
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);

      // Then: EXACTLY 5 returned — not 100 (SC-13 performance: "read only top 5 by number")
      // If all 100 were read, performance would degrade. Only the top 5 should be read.
      expect(decisions).toHaveLength(5);
    });

    test('[P0] 7.3-PERF-012: should return the 5 most recent DRs from 100 files (highest numbers)', () => {
      // Given: 100 DR files (DR-001 through DR-100)
      createMassDRFiles(100);

      // When: loading
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);

      // Then: returns DR-100, DR-099, DR-098, DR-097, DR-096 (highest 5)
      const drNumbers = decisions.map(d => d.drNumber);
      expect(drNumbers).toContain('DR-100');
      expect(drNumbers).toContain('DR-099');
      expect(drNumbers).toContain('DR-098');
      expect(drNumbers).not.toContain('DR-001'); // Old record — not in top 5
    });

    test('[P1] 7.3-PERF-013: should load decisions from 200 DR files within budget', () => {
      // Given: 200 DR files (high accumulation stress test)
      createMassDRFiles(200);

      // When: loading with timing
      const start = performance.now();
      const decisions = loadRecentDecisions(TEST_DECISIONS_DIR);
      const elapsed = performance.now() - start;

      // Then: still within budget AND correct limit applied
      expect(elapsed).toBeLessThan(PERFORMANCE_BUDGET_MS);
      expect(decisions).toHaveLength(5); // Still only 5 — limit applied
    });
  });

  // ── loadActiveRisks() Performance ─────────────────────────────────────────

  describe('loadActiveRisks() — Performance with 100+ RN Files', () => {
    test('[P0] 7.3-PERF-020: should scan 100 RN files in under 5000ms (SC-13 compliance)', () => {
      // Given: 100 RN files (mix of active and resolved)
      createMassRNFiles(100);

      // When: loading with performance timing
      const start = performance.now();
      const activeRisks = loadActiveRisks(TEST_RISKS_DIR);
      const elapsed = performance.now() - start;

      // Then: completes within budget
      expect(elapsed).toBeLessThan(PERFORMANCE_BUDGET_MS);
      // Sanity: some active risks found
      expect(activeRisks.length).toBeGreaterThan(0);
    });

    test('[P0] 7.3-PERF-021: should return correct active-only risks from 100 files', () => {
      // Given: 100 RN files (60% resolved, 40% active)
      const expectedActiveCount = createMassRNFiles(100);

      // When: loading
      const activeRisks = loadActiveRisks(TEST_RISKS_DIR);

      // Then: exactly the active ones returned (resolved correctly excluded)
      expect(activeRisks.length).toBe(expectedActiveCount);
    });

    test('[P0] 7.3-PERF-022: should scan 150 RN files in under 5000ms', () => {
      // Given: 150 RN files (stress test)
      createMassRNFiles(150);

      // When: loading with timing
      const start = performance.now();
      loadActiveRisks(TEST_RISKS_DIR);
      const elapsed = performance.now() - start;

      // Then: completes within budget
      expect(elapsed).toBeLessThan(PERFORMANCE_BUDGET_MS);
    });

    test('[P1] 7.3-PERF-023: each returned risk from large scan must have required fields', () => {
      // Given: 100 RN files
      createMassRNFiles(100);

      // When: loading
      const activeRisks = loadActiveRisks(TEST_RISKS_DIR);

      // Then: every returned risk has all required fields (data quality under load)
      expect(activeRisks.length).toBeGreaterThan(0);
      for (const risk of activeRisks) {
        expect(risk.rnNumber).toBeDefined();
        expect(typeof risk.rnNumber).toBe('string');
        expect(risk.rnNumber).toMatch(/^RN-\d{3}$/);
        expect(risk.riskDescription).toBeDefined();
        expect(risk.severity).toBeDefined();
        expect(risk.affectedArea).toBeDefined();
        expect(risk.ticket).toBeDefined();
      }
    });
  });

  // ── Full Session Load Performance ──────────────────────────────────────────

  describe('Full Session Context Load — Combined Performance Test', () => {
    test('[P0] 7.3-PERF-030: full session context load (stories + decisions + risks) completes under 5000ms with 100+ artifacts each', () => {
      // Given: the full scale scenario from Dev Notes
      // "Create 100+ mock artifact files in _test-output/ using beforeEach,
      //  run scanOpenStories(), loadRecentDecisions(), and loadActiveRisks()
      //  with performance timing — assert completion within 5000ms"
      createMassStoryFiles(100);
      createMassDRFiles(100);
      createMassRNFiles(100);

      // When: full session context load with timing
      const start = performance.now();
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);
      const recentDecisions = loadRecentDecisions(TEST_DECISIONS_DIR);
      const activeRisks = loadActiveRisks(TEST_RISKS_DIR);
      const elapsed = performance.now() - start;

      // Then: entire session context load within 5000ms (SC-13: 10s, test uses 5s margin)
      expect(elapsed).toBeLessThan(PERFORMANCE_BUDGET_MS);

      // Verify correctness alongside performance
      expect(openStories.length).toBeGreaterThan(0);
      expect(recentDecisions.length).toBe(5);     // Limited to top 5
      expect(activeRisks.length).toBeGreaterThan(0); // All active ones
    });

    test('[P0] 7.3-PERF-031: full session load with 150 stories, 150 DRs, 150 RNs completes within budget', () => {
      // Given: above-minimum scale (stress test scenario)
      createMassStoryFiles(150);
      createMassDRFiles(150);
      createMassRNFiles(150);

      // When: full load
      const start = performance.now();
      scanOpenStories(TEST_SPRINTS_DIR);
      loadRecentDecisions(TEST_DECISIONS_DIR);
      loadActiveRisks(TEST_RISKS_DIR);
      const elapsed = performance.now() - start;

      // Then: still within budget at 150+ artifacts
      expect(elapsed).toBeLessThan(PERFORMANCE_BUDGET_MS);
    });

    test('[P1] 7.3-PERF-032: should NOT use recursive glob for scanning — only flat readdirSync (SC-13 architecture)', () => {
      // SC-13 compliance: "Use readdirSync NOT glob() — no recursive filesystem traversal"
      // This is primarily verified through code review, but this test validates
      // the observable consequence: performance is O(N) not O(N*M) for nested dirs.

      // Given: 100 sprint dirs, each with multiple extra files (realistic scenario)
      for (let i = 1; i <= 100; i++) {
        const num = String(i).padStart(3, '0');
        const ticket = `SW-${num}`;
        const sprintDir = join(TEST_SPRINTS_DIR, ticket);
        mkdirSync(sprintDir, { recursive: true });
        // Write story.md plus extra artifacts (refinement, plan, review)
        writeFileSync(join(sprintDir, 'story.md'), createStoryContent(ticket, 'in-progress'), 'utf8');
        writeFileSync(join(sprintDir, 'refinement.md'), '# Refinement', 'utf8');
        writeFileSync(join(sprintDir, 'plan.md'), '# Plan', 'utf8');
      }

      // When: scanning (should only read story.md from each dir, not recurse deeper)
      const start = performance.now();
      const openStories = scanOpenStories(TEST_SPRINTS_DIR);
      const elapsed = performance.now() - start;

      // Then: still fast because only story.md is read per dir (not recursive glob)
      expect(elapsed).toBeLessThan(PERFORMANCE_BUDGET_MS);
      expect(openStories).toHaveLength(100); // All 100 in-progress stories found
    });

    test('[P1] 7.3-PERF-033: repeated session loads should perform consistently (no state leak between calls)', () => {
      // Given: 50 sprint dirs + 50 DRs + 50 RNs
      createMassStoryFiles(50);
      createMassDRFiles(50);
      createMassRNFiles(50);

      // When: calling each function twice (verify no slow state accumulation)
      const times = [];
      for (let run = 0; run < 2; run++) {
        const start = performance.now();
        scanOpenStories(TEST_SPRINTS_DIR);
        loadRecentDecisions(TEST_DECISIONS_DIR);
        loadActiveRisks(TEST_RISKS_DIR);
        times.push(performance.now() - start);
      }

      // Then: both runs within budget (no state leak causing slowdown)
      expect(times[0]).toBeLessThan(PERFORMANCE_BUDGET_MS);
      expect(times[1]).toBeLessThan(PERFORMANCE_BUDGET_MS);
    });
  });

  // ── Edge Cases Under Load ──────────────────────────────────────────────────

  describe('Edge Cases Under Load', () => {
    test('[P1] 7.3-PERF-040: should handle empty sprints dir alongside large decisions and risks dirs', () => {
      // Given: sprints dir empty, but large decisions and risks dirs
      createMassDRFiles(100);
      createMassRNFiles(100);

      // When: scanning all three
      let openStories, decisions, risks;
      expect(() => {
        openStories = scanOpenStories(TEST_SPRINTS_DIR);  // Empty dir
        decisions = loadRecentDecisions(TEST_DECISIONS_DIR); // 100 DRs
        risks = loadActiveRisks(TEST_RISKS_DIR);           // 100 RNs
      }).not.toThrow();

      // Then: graceful results — empty stories, correct decisions and risks
      expect(openStories).toHaveLength(0);
      expect(decisions).toHaveLength(5);     // Top 5 from 100
      expect(risks.length).toBeGreaterThan(0);
    });

    test('[P1] 7.3-PERF-041: should complete full load even when some story.md files have invalid frontmatter', () => {
      // Given: 100 sprint dirs — 10 with invalid/empty story.md files (corrupt artifacts)
      for (let i = 1; i <= 100; i++) {
        const num = String(i).padStart(3, '0');
        const ticket = `SW-${num}`;
        const sprintDir = join(TEST_SPRINTS_DIR, ticket);
        mkdirSync(sprintDir, { recursive: true });

        if (i % 10 === 0) {
          // Corrupt story.md (no frontmatter)
          writeFileSync(join(sprintDir, 'story.md'), '# Story without frontmatter\n\nContent only.', 'utf8');
        } else {
          writeFileSync(join(sprintDir, 'story.md'), createStoryContent(ticket, 'in-progress'), 'utf8');
        }
      }

      // When: scanning (corrupt files skipped gracefully per Dev Notes)
      let openStories;
      expect(() => {
        openStories = scanOpenStories(TEST_SPRINTS_DIR);
      }).not.toThrow();

      // Then: valid stories loaded, corrupt ones skipped — no crash (graceful degradation)
      // 90 valid stories (100 total - 10 corrupt)
      expect(openStories.length).toBeLessThanOrEqual(90);
      expect(openStories.length).toBeGreaterThan(0);
    });
  });
});
