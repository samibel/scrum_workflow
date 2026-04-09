/**
 * ATDD Tests — AC3: Active-Only Risk Note Filtering
 * Story 7.2: Implement Risk Note Extraction & Auto-Loading
 *
 * AC3: Given risk notes accumulate over time
 *      When risk notes are loaded
 *      Then only active (unresolved) risk notes are included
 *      And resolved risks are not loaded as context
 *
 * TDD RED PHASE: All tests use test() — feature (risk-extraction.js) not yet implemented.
 * Remove test() after implementing scrum_workflow/utils/risk-extraction.js.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import {
  loadActiveRiskNotesForStory,
  matchRiskNotesToStory,
  filterActiveRiskNotes,
  parseRNFrontmatter,
} from '../../utils/risk-extraction.js';

const PROJECT_ROOT = join(process.cwd());
const TEST_RISKS_DIR = join(PROJECT_ROOT, '_test-output', 'memory', 'risks');

// ─── Factories ────────────────────────────────────────────────────────────────

/**
 * Creates an RN artifact file content with the given status.
 * Mirrors the risk-note.md template structure exactly.
 */
function createRNContent(overrides = {}) {
  const ticket = overrides.ticket ?? 'SW-010';
  const status = overrides.status ?? 'active';
  const domainTags = overrides.domain_tags ?? ['storage', 'risk-extraction'];
  const affectedArea = overrides.affected_area ?? 'Data Integrity';
  const riskDescription = overrides.risk_description ?? 'Risk note write not guaranteed to be atomic';
  const mitigationSuggestion = overrides.mitigation_suggestion ?? 'Use atomic write pattern (temp file → rename)';
  const severity = overrides.severity ?? 'critical';
  const created = overrides.created ?? '2026-04-01T10:00:00Z';
  const updated = overrides.updated ?? '2026-04-09T10:00:00Z';
  const sourceFile = overrides.source_file ?? `_scrum-output/sprints/${ticket}/refinement.md`;

  const domainTagsYaml = domainTags.map(t => `  - "${t}"`).join('\n');

  return `---
schema_version: 1.0.0
ticket: "${ticket}"
risk_description: "${riskDescription}"
severity: "${severity}"
affected_area: "${affectedArea}"
mitigation_suggestion: "${mitigationSuggestion}"
status: ${status}
domain_tags:
${domainTagsYaml}
source_file: "${sourceFile}"
created: "${created}"
updated: "${updated}"
---

# Risk Note: ${riskDescription}

**Ticket:** ${ticket}
**Severity:** ${severity}
**Status:** ${status}
**Affected Area:** ${affectedArea}
**Created:** ${created}
**Source:** ${sourceFile}

## Risk Description

${riskDescription}

## Mitigation Suggestion

${mitigationSuggestion}

## Domain Tags

${domainTags.join(', ')}
`;
}

/**
 * Creates a story context for domain matching
 */
function createStoryContext(overrides = {}) {
  return {
    ticketId: overrides.ticketId ?? 'SW-050',
    title: overrides.title ?? 'Implement Story Feature',
    acceptanceCriteria: overrides.acceptanceCriteria ?? [
      'Feature works correctly',
    ],
    domainKeywords: overrides.domainKeywords ?? ['storage', 'risk-extraction', 'data-integrity'],
  };
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function createTemporaryRisksDir() {
  if (!existsSync(TEST_RISKS_DIR)) {
    mkdirSync(TEST_RISKS_DIR, { recursive: true });
  }
  return TEST_RISKS_DIR;
}

function writeRNFile(risksDir, filename, content) {
  writeFileSync(join(risksDir, filename), content, 'utf8');
}

function cleanupTemporaryRisksDir() {
  const testOutputDir = join(PROJECT_ROOT, '_test-output', 'memory');
  if (existsSync(testOutputDir)) {
    rmSync(testOutputDir, { recursive: true, force: true });
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('AC3: Active-Only Risk Note Filtering', () => {
  let risksDir;

  beforeEach(() => {
    risksDir = createTemporaryRisksDir();
  });

  afterEach(() => {
    cleanupTemporaryRisksDir();
  });

  // ── YAML Frontmatter Parsing ────────────────────────────────────────────────

  describe('RN Frontmatter Parsing', () => {
    test('[P0] 7.2-UNIT-080: should parse status field from RN YAML frontmatter', () => {
      // Given: RN content with status: active
      const content = createRNContent({ status: 'active' });

      // When: parsing frontmatter
      const frontmatter = parseRNFrontmatter(content);

      // Then: status is correctly parsed
      expect(frontmatter.status).toBe('active');
    });

    test('[P0] 7.2-UNIT-081: should parse status: resolved from RN YAML frontmatter', () => {
      // Given: RN content with status: resolved
      const content = createRNContent({ status: 'resolved' });

      // When: parsing frontmatter
      const frontmatter = parseRNFrontmatter(content);

      // Then: status is resolved
      expect(frontmatter.status).toBe('resolved');
    });

    test('[P0] 7.2-UNIT-082: should parse domain_tags array from YAML frontmatter', () => {
      // Given: RN content with domain_tags
      const content = createRNContent({
        domain_tags: ['storage', 'data-integrity'],
      });

      // When: parsing frontmatter
      const frontmatter = parseRNFrontmatter(content);

      // Then: domain_tags is a JavaScript array
      expect(Array.isArray(frontmatter.domain_tags)).toBe(true);
      expect(frontmatter.domain_tags).toContain('storage');
      expect(frontmatter.domain_tags).toContain('data-integrity');
    });

    test('[P0] 7.2-UNIT-083: should parse affected_area from YAML frontmatter', () => {
      // Given: RN with affected_area
      const content = createRNContent({ affected_area: 'Search Accuracy' });

      // When: parsing
      const frontmatter = parseRNFrontmatter(content);

      // Then: affected_area correctly parsed
      expect(frontmatter.affected_area).toBe('Search Accuracy');
    });

    test('[P0] 7.2-UNIT-084: should parse ticket field from YAML frontmatter', () => {
      // Given: RN with ticket SW-010
      const content = createRNContent({ ticket: 'SW-010' });

      // When: parsing
      const frontmatter = parseRNFrontmatter(content);

      // Then: ticket is correctly parsed (NFR-7 Artifact Traceability)
      expect(frontmatter.ticket).toBe('SW-010');
    });

    test('[P1] 7.2-UNIT-085: should return null or throw for content without YAML frontmatter', () => {
      // Given: content without frontmatter delimiters
      const content = '# Risk Note\n\nSome content without frontmatter.';

      // When/Then: parsing returns null or throws gracefully
      let result;
      try {
        result = parseRNFrontmatter(content);
      } catch (e) {
        // Acceptable — implementation may throw
        result = null;
      }

      // Either null or an object without status (indicates missing frontmatter)
      const isInvalid = result === null || result === undefined || result.status === undefined;
      expect(isInvalid).toBe(true);
    });
  });

  // ── Status Filtering ───────────────────────────────────────────────────────

  describe('Active-Only Status Filtering', () => {
    test('[P0] 7.2-UNIT-090: should include RN with status active when filtering', () => {
      // Given: risks dir with one active RN
      writeRNFile(risksDir, 'RN-001.md', createRNContent({ status: 'active' }));

      // When: filtering for active-only
      const activeRNs = filterActiveRiskNotes(risksDir);

      // Then: RN-001.md included
      expect(activeRNs.length).toBe(1);
      expect(activeRNs[0]).toContain('RN-001.md');
    });

    test('[P0] 7.2-UNIT-091: should EXCLUDE RN with status resolved when filtering', () => {
      // Given: risks dir with one resolved RN
      writeRNFile(risksDir, 'RN-001.md', createRNContent({ status: 'resolved' }));

      // When: filtering for active-only
      const activeRNs = filterActiveRiskNotes(risksDir);

      // Then: no RNs included (resolved risk notes are never loaded — AC3)
      expect(activeRNs).toHaveLength(0);
    });

    test('[P0] 7.2-UNIT-092: should include only active RNs when mixed active and resolved exist', () => {
      // Given: risks dir with 2 active and 2 resolved RNs
      writeRNFile(risksDir, 'RN-001.md', createRNContent({ status: 'active', ticket: 'SW-001' }));
      writeRNFile(risksDir, 'RN-002.md', createRNContent({ status: 'resolved', ticket: 'SW-002' }));
      writeRNFile(risksDir, 'RN-003.md', createRNContent({ status: 'active', ticket: 'SW-003' }));
      writeRNFile(risksDir, 'RN-004.md', createRNContent({ status: 'resolved', ticket: 'SW-004' }));

      // When: filtering
      const activeRNs = filterActiveRiskNotes(risksDir);

      // Then: only the 2 active RNs included
      expect(activeRNs).toHaveLength(2);
      const filenames = activeRNs.map(p => p.split('/').pop());
      expect(filenames).toContain('RN-001.md');
      expect(filenames).toContain('RN-003.md');
      expect(filenames).not.toContain('RN-002.md');
      expect(filenames).not.toContain('RN-004.md');
    });

    test('[P0] 7.2-UNIT-093: should return empty array when all RNs are resolved', () => {
      // Given: risks dir with only resolved RNs
      writeRNFile(risksDir, 'RN-001.md', createRNContent({ status: 'resolved' }));
      writeRNFile(risksDir, 'RN-002.md', createRNContent({ status: 'resolved' }));
      writeRNFile(risksDir, 'RN-003.md', createRNContent({ status: 'resolved' }));

      // When: filtering
      const activeRNs = filterActiveRiskNotes(risksDir);

      // Then: empty result — all resolved, none loaded
      expect(activeRNs).toHaveLength(0);
    });

    test('[P0] 7.2-UNIT-094: should return empty array when risks dir is empty', () => {
      // Given: empty risks directory
      // When: filtering
      const activeRNs = filterActiveRiskNotes(risksDir);

      // Then: graceful empty result
      expect(activeRNs).toHaveLength(0);
    });

    test('[P1] 7.2-UNIT-095: should handle risks dir that does not exist gracefully', () => {
      // Given: non-existent risks directory
      const nonExistentDir = join(PROJECT_ROOT, '_test-output', 'memory', 'risks-absent');

      // When: filtering
      let activeRNs;
      try {
        activeRNs = filterActiveRiskNotes(nonExistentDir);
      } catch (e) {
        activeRNs = [];
      }

      // Then: graceful empty result (no crash — review must always complete)
      expect(activeRNs).toHaveLength(0);
    });

    test('[P1] 7.2-UNIT-096: should skip README.md and non-RN files when filtering', () => {
      // Given: risks dir with README.md, a .tmp file, and one active RN
      writeFileSync(join(risksDir, 'README.md'), '# Risks Directory', 'utf8');
      writeFileSync(join(risksDir, '.keep'), '', 'utf8');
      writeRNFile(risksDir, 'RN-001.md', createRNContent({ status: 'active' }));

      // When: filtering
      const activeRNs = filterActiveRiskNotes(risksDir);

      // Then: only RN-001.md processed (README.md and .keep ignored)
      expect(activeRNs).toHaveLength(1);
    });
  });

  // ── End-to-End: Active-Only Filtering in Review Context ───────────────────

  describe('End-to-End: Active-Only Filtering During Review', () => {
    test('[P0] 7.2-INT-030: resolved risks must never be loaded as review context', async () => {
      // Given: accumulation of risk notes over time
      // 3 from an old sprint — now resolved
      writeRNFile(risksDir, 'RN-001.md', createRNContent({
        status: 'resolved',
        domain_tags: ['storage'],
        ticket: 'SW-001',
        created: '2026-01-01T10:00:00Z',
      }));
      writeRNFile(risksDir, 'RN-002.md', createRNContent({
        status: 'resolved',
        domain_tags: ['storage', 'performance'],
        ticket: 'SW-002',
        created: '2026-01-15T10:00:00Z',
      }));
      writeRNFile(risksDir, 'RN-003.md', createRNContent({
        status: 'resolved',
        domain_tags: ['storage'],
        ticket: 'SW-003',
        created: '2026-02-01T10:00:00Z',
      }));
      // 1 new active risk in same domain
      writeRNFile(risksDir, 'RN-004.md', createRNContent({
        status: 'active',
        domain_tags: ['storage', 'risk-extraction'],
        ticket: 'SW-010',
        created: '2026-04-09T10:00:00Z',
      }));

      const storyContext = createStoryContext({
        domainKeywords: ['storage', 'risk-extraction'],
      });

      // When: loading active risk notes for review
      const loaded = await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: ONLY RN-004.md loaded (resolved ones NEVER loaded — AC3 hard requirement)
      expect(loaded.matchedRNs).toHaveLength(1);
      expect(loaded.matchedRNs[0].filename).toContain('RN-004.md');

      // Explicitly verify resolved ones are absent
      const loadedFilenames = loaded.matchedRNs.map(rn => rn.filename);
      expect(loadedFilenames).not.toContain('RN-001.md');
      expect(loadedFilenames).not.toContain('RN-002.md');
      expect(loadedFilenames).not.toContain('RN-003.md');
    });

    test('[P0] 7.2-INT-031: should load zero RNs when all matching domain RNs are resolved', async () => {
      // Given: all domain-matching RNs are resolved
      writeRNFile(risksDir, 'RN-001.md', createRNContent({
        status: 'resolved',
        domain_tags: ['storage'],
        ticket: 'SW-010',
      }));
      writeRNFile(risksDir, 'RN-002.md', createRNContent({
        status: 'resolved',
        domain_tags: ['storage', 'risk-extraction'],
        ticket: 'SW-011',
      }));

      const storyContext = createStoryContext({
        domainKeywords: ['storage', 'risk-extraction'],
      });

      // When: loading
      const loaded = await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: no context loaded (all relevant risks are resolved)
      expect(loaded.matchedRNs).toHaveLength(0);
      expect(loaded.noMatchingRisks).toBe(true);
    });

    test('[P1] 7.2-INT-032: should work correctly as risk notes accumulate over multiple sprints', async () => {
      // Given: risk notes from 5 different sprints, accumulating over time
      // 2 resolved (old sprints), 3 active (recent sprints)
      writeRNFile(risksDir, 'RN-001.md', createRNContent({
        status: 'resolved', domain_tags: ['storage'], ticket: 'SW-001',
      }));
      writeRNFile(risksDir, 'RN-002.md', createRNContent({
        status: 'active', domain_tags: ['storage', 'memory'], ticket: 'SW-005',
      }));
      writeRNFile(risksDir, 'RN-003.md', createRNContent({
        status: 'resolved', domain_tags: ['performance'], ticket: 'SW-006',
      }));
      writeRNFile(risksDir, 'RN-004.md', createRNContent({
        status: 'active', domain_tags: ['storage', 'risk-extraction'], ticket: 'SW-008',
      }));
      writeRNFile(risksDir, 'RN-005.md', createRNContent({
        status: 'active', domain_tags: ['memory', 'persistence'], ticket: 'SW-009',
      }));

      const storyContext = createStoryContext({
        domainKeywords: ['storage', 'memory', 'risk-extraction'],
      });

      // When: loading active risk notes for review
      const loaded = await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: only active matching RNs are loaded (RN-002, RN-004, RN-005)
      // RN-001 excluded (resolved), RN-003 excluded (resolved + no domain match)
      const loadedFilenames = loaded.matchedRNs.map(rn => rn.filename);
      expect(loadedFilenames).not.toContain('RN-001.md'); // resolved
      expect(loadedFilenames).not.toContain('RN-003.md'); // resolved + no domain match
      expect(loaded.matchedRNs.length).toBeGreaterThanOrEqual(2); // at least RN-002 and RN-004
    });

    test('[P0] 7.2-INT-033: status field is the ONLY filtering mechanism — no date or number filtering', async () => {
      // Given: an old active RN (created months ago) and a new resolved RN (created today)
      writeRNFile(risksDir, 'RN-001.md', createRNContent({
        status: 'active',
        domain_tags: ['storage'],
        ticket: 'SW-001',
        created: '2026-01-01T10:00:00Z',  // Old — but still active
      }));
      writeRNFile(risksDir, 'RN-002.md', createRNContent({
        status: 'resolved',
        domain_tags: ['storage'],
        ticket: 'SW-010',
        created: '2026-04-09T10:00:00Z',  // New — but resolved
      }));

      const storyContext = createStoryContext({
        domainKeywords: ['storage'],
      });

      // When: loading
      const loaded = await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: old active RN loaded, new resolved RN excluded
      // Status is the ONLY filter — age does not matter
      expect(loaded.matchedRNs).toHaveLength(1);
      expect(loaded.matchedRNs[0].filename).toContain('RN-001.md');
    });
  });

  // ── NFR Compliance for Filtering ──────────────────────────────────────────

  describe('NFR Compliance for Active-Only Filtering', () => {
    test('[P0] 7.2-UNIT-100: filterActiveRiskNotes must not write any files (read-only operation)', async () => {
      // Given: risks dir with active RNs
      writeRNFile(risksDir, 'RN-001.md', createRNContent({ status: 'active' }));
      writeRNFile(risksDir, 'RN-002.md', createRNContent({ status: 'resolved' }));

      // Snapshot file list before filtering — use static import (ESM module)
      const { readdirSync } = await import('node:fs');
      const filesBefore = readdirSync(risksDir);

      // When: filtering
      filterActiveRiskNotes(risksDir);

      // Then: no new files written (read-only operation — NFR-3 offline, no side effects)
      const filesAfter = readdirSync(risksDir);
      expect(filesAfter.sort()).toEqual(filesBefore.sort());
    });

    test('[P0] 7.2-UNIT-101: filterActiveRiskNotes must not modify any files (read-only operation)', async () => {
      // Given: active RN with known content
      const originalContent = createRNContent({ status: 'active', domain_tags: ['storage'] });
      writeRNFile(risksDir, 'RN-001.md', originalContent);

      // When: filtering active risk notes
      filterActiveRiskNotes(risksDir);

      // Then: file content unchanged
      const { readFileSync } = await import('node:fs');
      const afterContent = readFileSync(join(risksDir, 'RN-001.md'), 'utf8');
      expect(afterContent).toBe(originalContent);
    });

    test('[P1] 7.2-UNIT-102: filtering must complete without errors even with 100+ RN files', () => {
      // Given: risks dir with 100 RN files (50 active, 50 resolved) — scalability test
      for (let i = 1; i <= 50; i++) {
        const num = String(i).padStart(3, '0');
        writeRNFile(risksDir, `RN-${num}.md`, createRNContent({
          status: 'active',
          domain_tags: ['storage'],
          ticket: `SW-${num}`,
        }));
      }
      for (let i = 51; i <= 100; i++) {
        const num = String(i).padStart(3, '0');
        writeRNFile(risksDir, `RN-${num}.md`, createRNContent({
          status: 'resolved',
          domain_tags: ['storage'],
          ticket: `SW-${num}`,
        }));
      }

      // When: filtering
      let activeRNs;
      expect(() => {
        activeRNs = filterActiveRiskNotes(risksDir);
      }).not.toThrow();

      // Then: only the 50 active ones returned
      expect(activeRNs).toHaveLength(50);
    });
  });
});
