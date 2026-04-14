/**
 * ATDD Tests — AC2: Review Risk Note Auto-Loading
 * Story 7.2: Implement Risk Note Extraction & Auto-Loading
 *
 * AC2: Given FR-30 specifies auto-loading of active risk notes during /scrum-review-story
 *      When a developer runs /scrum-review-story SW-XXX
 *      Then the review agent receives active risk notes relevant to the story's domain as additional context
 *      And relevance is determined by matching domain tags and affected areas
 *
 * TDD RED PHASE: All tests use test() — feature (risk-extraction.js) not yet implemented.
 * Remove test() after implementing scrum_workflow/utils/risk-extraction.js.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import {
  loadActiveRiskNotesForStory,
  matchRiskNotesToStory,
  formatRiskNotesAsContext,
} from '../../utils/risk-extraction.js';

const PROJECT_ROOT = join(process.cwd());
const TEST_RISKS_DIR = join(PROJECT_ROOT, '_test-output', 'memory', 'risks');

// ─── Factories ────────────────────────────────────────────────────────────────

/**
 * Creates a mock RN-XXX.md artifact file content with given properties.
 * Mirrors the canonical template in scrum_workflow/templates/risk-note.md.
 */
function createRNArtifactContent(overrides = {}) {
  const ticket = overrides.ticket ?? 'SW-010';
  const riskDescription = overrides.risk_description ?? 'Atomic write not guaranteed for risk note files';
  const severity = overrides.severity ?? 'critical';
  const affectedArea = overrides.affected_area ?? 'Data Integrity';
  const mitigationSuggestion = overrides.mitigation_suggestion ?? 'Use atomic file writes (write to temp, then rename)';
  const status = overrides.status ?? 'active';
  const domainTags = overrides.domain_tags ?? ['storage', 'data-integrity'];
  const sourceFile = overrides.source_file ?? `_scrum-output/sprints/${ticket}/refinement.md`;
  const created = overrides.created ?? '2026-04-09T10:00:00Z';
  const updated = overrides.updated ?? '2026-04-09T10:00:00Z';

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
 * Creates a mock story context for domain matching
 */
function createStoryContext(overrides = {}) {
  return {
    ticketId: overrides.ticketId ?? 'SW-020',
    title: overrides.title ?? 'Implement Risk Note Extraction & Auto-Loading',
    acceptanceCriteria: overrides.acceptanceCriteria ?? [
      'Risk notes are extracted from Architect findings',
      'Active risk notes are loaded during review',
      'Domain matching uses tags and affected area',
    ],
    domainKeywords: overrides.domainKeywords ?? ['risk', 'storage', 'extraction', 'data-integrity'],
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

describe('AC2: Review Risk Note Auto-Loading', () => {
  let risksDir;

  beforeEach(() => {
    risksDir = createTemporaryRisksDir();
  });

  afterEach(() => {
    cleanupTemporaryRisksDir();
  });

  // ── Domain Tag Matching ────────────────────────────────────────────────────

  describe('Domain Tag Matching Algorithm', () => {
    test('[P0] 7.2-UNIT-050: should match active RN when its domain_tags overlap with story keywords', () => {
      // Given: an active RN with domain_tags ["storage", "data-integrity"]
      const rnContent = createRNArtifactContent({
        status: 'active',
        domain_tags: ['storage', 'data-integrity'],
        ticket: 'SW-010',
      });
      writeRNFile(risksDir, 'RN-001.md', rnContent);

      // And: a story with keywords including "storage"
      const storyContext = createStoryContext({
        domainKeywords: ['risk', 'storage', 'memory'],
      });

      // When: matching risk notes to story
      const matched = matchRiskNotesToStory({
        risksDir,
        storyContext,
      });

      // Then: RN-001.md is matched (domain tag "storage" found in story keywords)
      expect(matched).toHaveLength(1);
      expect(matched[0]).toContain('RN-001.md');
    });

    test('[P0] 7.2-UNIT-051: should match active RN when its affected_area appears in story keywords', () => {
      // Given: an active RN with affected_area "Data Integrity"
      const rnContent = createRNArtifactContent({
        status: 'active',
        affected_area: 'Data Integrity',
        domain_tags: ['security'],
        ticket: 'SW-010',
      });
      writeRNFile(risksDir, 'RN-001.md', rnContent);

      // And: a story with keywords including "data-integrity" (normalized form)
      const storyContext = createStoryContext({
        domainKeywords: ['data-integrity', 'writes', 'atomicity'],
      });

      // When: matching
      const matched = matchRiskNotesToStory({ risksDir, storyContext });

      // Then: RN-001.md matched (affected_area normalized to "data-integrity" found in keywords)
      expect(matched.length).toBeGreaterThanOrEqual(1);
    });

    test('[P0] 7.2-UNIT-052: should NOT match active RN when no domain_tags or affected_area overlap', () => {
      // Given: an active RN about "authentication" domain
      const rnContent = createRNArtifactContent({
        status: 'active',
        domain_tags: ['authentication', 'session'],
        affected_area: 'Security',
        ticket: 'SW-010',
      });
      writeRNFile(risksDir, 'RN-001.md', rnContent);

      // And: a story about "payments" with no auth keywords
      const storyContext = createStoryContext({
        title: 'Implement Payment Processing',
        domainKeywords: ['payments', 'billing', 'stripe', 'invoices'],
      });

      // When: matching
      const matched = matchRiskNotesToStory({ risksDir, storyContext });

      // Then: no match (domains don't overlap)
      expect(matched).toHaveLength(0);
    });

    test('[P0] 7.2-UNIT-053: should match multiple active RNs when multiple domain tags overlap', () => {
      // Given: two active RNs with overlapping domains
      writeRNFile(risksDir, 'RN-001.md', createRNArtifactContent({
        status: 'active',
        domain_tags: ['storage', 'risk-extraction'],
        ticket: 'SW-010',
      }));
      writeRNFile(risksDir, 'RN-002.md', createRNArtifactContent({
        status: 'active',
        domain_tags: ['search', 'storage'],
        ticket: 'SW-011',
      }));

      // And: a story with "storage" in keywords
      const storyContext = createStoryContext({
        domainKeywords: ['storage', 'memory', 'persistence'],
      });

      // When: matching
      const matched = matchRiskNotesToStory({ risksDir, storyContext });

      // Then: both RNs matched
      expect(matched).toHaveLength(2);
    });

    test('[P1] 7.2-UNIT-054: should return empty array when no active risk notes exist in risks dir', () => {
      // Given: risks directory is empty
      const storyContext = createStoryContext();

      // When: matching
      const matched = matchRiskNotesToStory({ risksDir, storyContext });

      // Then: no matches (graceful — not an error)
      expect(matched).toHaveLength(0);
    });

    test('[P1] 7.2-UNIT-055: should return empty array when risks dir does not exist', () => {
      // Given: risks directory does not exist
      const nonExistentDir = join(PROJECT_ROOT, '_test-output', 'memory', 'risks-missing');
      const storyContext = createStoryContext();

      // When: matching against non-existent dir
      const matched = matchRiskNotesToStory({ risksDir: nonExistentDir, storyContext });

      // Then: graceful empty result (no error thrown)
      expect(matched).toHaveLength(0);
    });
  });

  // ── Active-Only Loading ────────────────────────────────────────────────────

  describe('Active Risk Notes Loading for Review', () => {
    test('[P0] 7.2-INT-020: should load active risk notes relevant to the story domain', async () => {
      // Given: one active RN matching the story domain
      writeRNFile(risksDir, 'RN-001.md', createRNArtifactContent({
        status: 'active',
        domain_tags: ['storage', 'risk-extraction'],
        ticket: 'SW-010',
      }));

      const storyContext = createStoryContext({
        domainKeywords: ['storage', 'risk'],
      });

      // When: loading active risk notes for story review
      const loaded = await loadActiveRiskNotesForStory({
        risksDir,
        storyContext,
      });

      // Then: RN-001.md is loaded
      expect(loaded.matchedRNs).toHaveLength(1);
      expect(loaded.matchedRNs[0].filename).toContain('RN-001.md');
      expect(loaded.matchedRNs[0].content).toBeTruthy();
    });

    test('[P0] 7.2-INT-021: should load only active risk notes (not resolved ones)', async () => {
      // Given: one active and one resolved RN in the same domain
      writeRNFile(risksDir, 'RN-001.md', createRNArtifactContent({
        status: 'active',
        domain_tags: ['storage'],
        ticket: 'SW-010',
      }));
      writeRNFile(risksDir, 'RN-002.md', createRNArtifactContent({
        status: 'resolved',
        domain_tags: ['storage'],
        ticket: 'SW-010',
      }));

      const storyContext = createStoryContext({
        domainKeywords: ['storage'],
      });

      // When: loading active risk notes
      const loaded = await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: only RN-001.md loaded (RN-002.md is resolved — AC3 compliance)
      expect(loaded.matchedRNs).toHaveLength(1);
      expect(loaded.matchedRNs[0].filename).toContain('RN-001.md');
    });

    test('[P0] 7.2-INT-022: should return no matched RNs when domain does not match any active RNs', async () => {
      // Given: active RN in unrelated domain
      writeRNFile(risksDir, 'RN-001.md', createRNArtifactContent({
        status: 'active',
        domain_tags: ['authentication', 'session'],
        ticket: 'SW-010',
      }));

      const storyContext = createStoryContext({
        domainKeywords: ['payments', 'billing'],
      });

      // When: loading
      const loaded = await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: no matches — graceful, not an error
      expect(loaded.matchedRNs).toHaveLength(0);
      expect(loaded.noMatchingRisks).toBe(true);
    });

    test('[P1] 7.2-INT-023: should include full content of matched RN for context injection', async () => {
      // Given: active RN with known content
      const rnContent = createRNArtifactContent({
        status: 'active',
        domain_tags: ['storage'],
        risk_description: 'Atomic write not guaranteed',
        ticket: 'SW-010',
      });
      writeRNFile(risksDir, 'RN-001.md', rnContent);

      const storyContext = createStoryContext({
        domainKeywords: ['storage'],
      });

      // When: loading
      const loaded = await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: full content available for injection (review agent needs full context)
      expect(loaded.matchedRNs[0].content).toContain('Atomic write not guaranteed');
    });

    test('[P1] 7.2-INT-024: should load RNs from multiple tickets when all match domain', async () => {
      // Given: active RNs from different tickets, all matching story domain
      writeRNFile(risksDir, 'RN-001.md', createRNArtifactContent({
        status: 'active',
        domain_tags: ['storage'],
        ticket: 'SW-010',
      }));
      writeRNFile(risksDir, 'RN-002.md', createRNArtifactContent({
        status: 'active',
        domain_tags: ['storage', 'performance'],
        ticket: 'SW-011',
      }));

      const storyContext = createStoryContext({
        domainKeywords: ['storage'],
      });

      // When: loading
      const loaded = await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: both matched (cross-ticket risk awareness)
      expect(loaded.matchedRNs).toHaveLength(2);
    });
  });

  // ── Context Formatting for Review Agent ───────────────────────────────────

  describe('Context Formatting for Review Agent Injection', () => {
    test('[P0] 7.2-UNIT-060: should format matched RNs as human-readable context block', () => {
      // Given: two matched RN contents
      const matchedRNs = [
        {
          filename: 'RN-001.md',
          content: createRNArtifactContent({
            status: 'active',
            risk_description: 'Atomic write not guaranteed',
            domain_tags: ['storage'],
            ticket: 'SW-010',
          }),
        },
        {
          filename: 'RN-002.md',
          content: createRNArtifactContent({
            status: 'active',
            risk_description: 'Domain tag matching false positives',
            domain_tags: ['search'],
            ticket: 'SW-010',
          }),
        },
      ];

      // When: formatting as context
      const contextBlock = formatRiskNotesAsContext(matchedRNs);

      // Then: formatted as labeled context block
      expect(contextBlock).toContain('Active Risk Notes');
      expect(contextBlock).toContain('RN-001.md');
      expect(contextBlock).toContain('Atomic write not guaranteed');
    });

    test('[P0] 7.2-UNIT-061: should return "no active risk notes" message when matched list is empty', () => {
      // Given: no matched RNs
      const matchedRNs = [];

      // When: formatting empty list
      const contextBlock = formatRiskNotesAsContext(matchedRNs);

      // Then: diagnostic message (not empty string — allows review workflow to log this)
      expect(contextBlock).toBeTruthy();
      expect(contextBlock.toLowerCase()).toMatch(/no active risk notes|no matching/);
    });

    test('[P1] 7.2-UNIT-062: should separate multiple RNs clearly in the context block', () => {
      // Given: two matched RNs
      const matchedRNs = [
        {
          filename: 'RN-001.md',
          content: createRNArtifactContent({ status: 'active', ticket: 'SW-010' }),
        },
        {
          filename: 'RN-002.md',
          content: createRNArtifactContent({ status: 'active', ticket: 'SW-011' }),
        },
      ];

      // When: formatting
      const contextBlock = formatRiskNotesAsContext(matchedRNs);

      // Then: both RNs visible and clearly separated in context block
      expect(contextBlock).toContain('RN-001.md');
      expect(contextBlock).toContain('RN-002.md');
    });
  });

  // ── Review Workflow Read-Only Compliance ──────────────────────────────────

  describe('Review Workflow Read-Only Compliance', () => {
    test('[P0] 7.2-UNIT-070: loadActiveRiskNotesForStory must not write or modify any RN files', async () => {
      // Given: one active RN
      const rnContent = createRNArtifactContent({
        status: 'active',
        domain_tags: ['storage'],
        ticket: 'SW-010',
      });
      writeRNFile(risksDir, 'RN-001.md', rnContent);
      const rnPath = join(risksDir, 'RN-001.md');

      // Capture original content
      const originalContent = readFileSync(rnPath, 'utf8');
      const originalStat = JSON.stringify({ size: originalContent.length });

      const storyContext = createStoryContext({ domainKeywords: ['storage'] });

      // When: loading active risk notes
      await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: RN file is unchanged (review is READ-ONLY for risk notes per architecture)
      const afterContent = readFileSync(rnPath, 'utf8');
      expect(afterContent).toBe(originalContent);
    });

    test('[P1] 7.2-UNIT-071: should scan only RN-NNN.md files in risks dir (ignore README.md)', async () => {
      // Given: risks dir with README.md and one active RN
      writeFileSync(join(risksDir, 'README.md'), '# Risk Notes Directory', 'utf8');
      writeRNFile(risksDir, 'RN-001.md', createRNArtifactContent({
        status: 'active',
        domain_tags: ['storage'],
        ticket: 'SW-010',
      }));

      const storyContext = createStoryContext({ domainKeywords: ['storage'] });

      // When: loading
      const loaded = await loadActiveRiskNotesForStory({ risksDir, storyContext });

      // Then: only RN-001.md processed (README.md ignored)
      expect(loaded.matchedRNs).toHaveLength(1);
      expect(loaded.matchedRNs[0].filename).toContain('RN-001.md');
    });
  });
});
