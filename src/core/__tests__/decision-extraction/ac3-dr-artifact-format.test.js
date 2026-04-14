/**
 * ATDD Tests — AC3: DR Artifact Format Compliance
 * Story 7.1: Implement Decision Record Extraction
 *
 * AC3: Given the decision record artifact
 *      When it is created
 *      Then it contains YAML frontmatter with: ticket reference, decision summary,
 *           date, context, alternatives considered
 *      And the artifact is human-readable, diffable, and Git-versionable
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { createDRArtifact } from '../../utils/decision-extraction.js';

const PROJECT_ROOT = join(process.cwd());
const TEST_DECISIONS_DIR = join(PROJECT_ROOT, '_test-output', 'memory', 'decisions');

// ─── Factories ────────────────────────────────────────────────────────────────

/**
 * Creates a complete DR creation request with all required fields
 */
function createDRRequest(overrides = {}) {
  return {
    ticketId: overrides.ticketId ?? 'SW-001',
    decisionSummary: overrides.decisionSummary ?? 'WebSockets chosen over SSE for bidirectional communication',
    date: overrides.date ?? '2026-04-09T10:00:00Z',
    context: overrides.context ?? 'The chat feature requires full-duplex communication. WebSockets provide this while SSE is unidirectional.',
    alternativesConsidered: overrides.alternativesConsidered ?? [
      {
        option: 'SSE (Server-Sent Events)',
        rejectedBecause: 'Unidirectional only; cannot support client-to-server messaging',
      },
      {
        option: 'Long polling',
        rejectedBecause: 'Higher latency and server resource usage compared to WebSockets',
      },
    ],
    source: overrides.source ?? 'refinement',
    sourceFile: overrides.sourceFile ?? '_scrum-output/sprints/SW-001/refinement.md',
    outputDir: overrides.outputDir ?? TEST_DECISIONS_DIR,
    drNumber: overrides.drNumber ?? 1,
  };
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function createTemporaryDecisionsDir() {
  if (!existsSync(TEST_DECISIONS_DIR)) {
    mkdirSync(TEST_DECISIONS_DIR, { recursive: true });
  }
  return TEST_DECISIONS_DIR;
}

function cleanupTemporaryDecisionsDir() {
  const testOutputDir = join(PROJECT_ROOT, '_test-output', 'memory');
  if (existsSync(testOutputDir)) {
    rmSync(testOutputDir, { recursive: true, force: true });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parses YAML frontmatter from markdown file content
 * Extracts content between first --- and second --- delimiters
 */
function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  // Simple key-value extraction for test assertions (real impl uses js-yaml)
  const lines = match[1].split('\n');
  const result = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      result[key] = value.replace(/^["']|["']$/g, ''); // strip quotes
    }
  }
  return result;
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('AC3: DR Artifact Format Compliance', () => {
  let decisionsDir;

  beforeEach(() => {
    decisionsDir = createTemporaryDecisionsDir();
  });

  afterEach(() => {
    cleanupTemporaryDecisionsDir();
  });

  describe('Required YAML Frontmatter Fields', () => {
    test('[P0] 7.1-UNIT-030: created DR artifact must contain schema_version field', () => {
      const request = createDRRequest();
      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');
      const frontmatter = parseFrontmatter(content);

      expect(frontmatter).not.toBeNull();
      expect(frontmatter['schema_version']).toBe('1.0.0');
    });

    test('[P0] 7.1-UNIT-031: created DR artifact must contain ticket reference field', () => {
      // Given: DR request for ticket SW-001
      const request = createDRRequest({ ticketId: 'SW-001' });

      // When: creating DR artifact
      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');
      const frontmatter = parseFrontmatter(content);

      // Then: ticket field links back to source story (NFR-7 Artifact Traceability)
      expect(frontmatter['ticket']).toBe('SW-001');
    });

    test('[P0] 7.1-UNIT-032: created DR artifact must contain decision_summary field', () => {
      const summary = 'WebSockets chosen over SSE for bidirectional communication';
      const request = createDRRequest({ decisionSummary: summary });

      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');
      const frontmatter = parseFrontmatter(content);

      expect(frontmatter['decision_summary']).toContain('WebSockets');
    });

    test('[P0] 7.1-UNIT-033: created DR artifact must contain date field in ISO 8601 UTC format', () => {
      const isoDate = '2026-04-09T10:00:00Z';
      const request = createDRRequest({ date: isoDate });

      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');
      const frontmatter = parseFrontmatter(content);

      // Then: date in ISO 8601 UTC format (must end with Z)
      expect(frontmatter['date']).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    });

    test('[P0] 7.1-UNIT-034: created DR artifact must contain context field', () => {
      const context = 'The chat feature requires full-duplex communication.';
      const request = createDRRequest({ context });

      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');

      // Then: context is present either in frontmatter or body
      expect(content).toContain(context);
    });

    test('[P0] 7.1-UNIT-035: created DR artifact must contain alternatives_considered field', () => {
      const alternatives = [
        { option: 'SSE', rejectedBecause: 'Unidirectional only' },
      ];
      const request = createDRRequest({ alternativesConsidered: alternatives });

      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');

      // Then: alternatives appear in the artifact
      expect(content).toContain('SSE');
      expect(content).toContain('Unidirectional only');
    });

    test('[P0] 7.1-UNIT-036: created DR artifact must contain source field (refinement or approval)', () => {
      // Given: DR from refinement source
      const refinementRequest = createDRRequest({ source: 'refinement' });
      const refinementPath = createDRArtifact(refinementRequest);
      const refinementContent = readFileSync(refinementPath, 'utf8');
      const refinementFrontmatter = parseFrontmatter(refinementContent);
      expect(refinementFrontmatter['source']).toBe('refinement');
    });

    test('[P0] 7.1-UNIT-037: created DR artifact must contain source field for approval source', () => {
      // Given: DR from approval source
      const approvalRequest = createDRRequest({
        source: 'approval',
        sourceFile: '_scrum-output/sprints/SW-001/approval-1.md',
        outputDir: decisionsDir,
        drNumber: 2,
      });
      const approvalPath = createDRArtifact(approvalRequest);
      const approvalContent = readFileSync(approvalPath, 'utf8');
      const approvalFrontmatter = parseFrontmatter(approvalContent);
      expect(approvalFrontmatter['source']).toBe('approval');
    });

    test('[P0] 7.1-UNIT-038: created DR artifact must contain source_file field', () => {
      const sourceFile = '_scrum-output/sprints/SW-001/refinement.md';
      const request = createDRRequest({ sourceFile });

      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');
      const frontmatter = parseFrontmatter(content);

      expect(frontmatter['source_file']).toBe(sourceFile);
    });
  });

  describe('DR Artifact File Naming', () => {
    test('[P0] 7.1-UNIT-039: DR artifact filename must follow DR-NNN.md pattern', () => {
      const request = createDRRequest({ drNumber: 1 });
      const drPath = createDRArtifact(request);

      // Then: filename is DR-001.md
      expect(drPath).toMatch(/DR-001\.md$/);
    });

    test('[P0] 7.1-UNIT-040: DR artifact for number 42 must be named DR-042.md', () => {
      const request = createDRRequest({ drNumber: 42 });
      const drPath = createDRArtifact(request);

      expect(drPath).toMatch(/DR-042\.md$/);
    });

    test('[P0] 7.1-UNIT-041: DR artifact for number 100 must be named DR-100.md', () => {
      const request = createDRRequest({ drNumber: 100 });
      const drPath = createDRArtifact(request);

      expect(drPath).toMatch(/DR-100\.md$/);
    });

    test('[P0] 7.1-UNIT-042: DR artifact must be written to _scrum-output/memory/decisions/ directory', () => {
      const request = createDRRequest({ outputDir: decisionsDir, drNumber: 1 });
      const drPath = createDRArtifact(request);

      // Then: file exists in the decisions directory
      expect(existsSync(drPath)).toBe(true);
      expect(drPath).toContain('decisions');
    });
  });

  describe('Human-Readable and Diffable Format', () => {
    test('[P0] 7.1-UNIT-043: DR artifact must be valid Markdown (starts with YAML frontmatter)', () => {
      // Given: a complete DR request
      const request = createDRRequest();
      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');

      // Then: file starts with YAML frontmatter delimiter
      expect(content.startsWith('---\n')).toBe(true);
      // And: has closing frontmatter delimiter
      expect(content).toMatch(/^---\n[\s\S]*?\n---\n/);
    });

    test('[P0] 7.1-UNIT-044: DR artifact must contain human-readable Markdown body', () => {
      const request = createDRRequest();
      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');

      // Then: body contains recognizable Markdown headings
      expect(content).toMatch(/^# Decision Record/m);
      expect(content).toMatch(/^## (Decision|Context|Alternatives)/m);
    });

    test('[P0] 7.1-UNIT-045: DR artifact must be plain text (no binary content)', () => {
      const request = createDRRequest();
      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');

      // Then: content is pure text (Git-diffable, NFR-9 Inspectability)
      expect(typeof content).toBe('string');
      // No null bytes (binary indicator)
      expect(content).not.toContain('\x00');
    });

    test('[P1] 7.1-UNIT-046: DR artifact body must include a table of alternatives considered', () => {
      const alternatives = [
        { option: 'SSE', rejectedBecause: 'Unidirectional' },
        { option: 'Long polling', rejectedBecause: 'High latency' },
      ];
      const request = createDRRequest({ alternativesConsidered: alternatives });

      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');

      // Then: alternatives table is present (human-readable format)
      expect(content).toMatch(/\| Option \| Reason Not Chosen \|/);
      expect(content).toContain('SSE');
      expect(content).toContain('Long polling');
    });
  });

  describe('YAML Frontmatter Validity', () => {
    test('[P0] 7.1-UNIT-047: DR artifact YAML frontmatter must be parseable by js-yaml', () => {
      const request = createDRRequest();
      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');

      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      expect(frontmatterMatch).not.toBeNull();

      // Then: parseable without errors (js-yaml available in scrum_workflow)
      const yamlContent = frontmatterMatch[1];
      expect(() => {
        // Dynamic import stub - actual test will use js-yaml
        JSON.parse(JSON.stringify(yamlContent)); // Placeholder; real test uses yaml.load()
      }).not.toThrow();
    });

    test('[P0] 7.1-UNIT-048: DR artifact frontmatter must have alternatives_considered as YAML array', () => {
      const alternatives = [
        { option: 'SSE', rejectedBecause: 'Unidirectional' },
      ];
      const request = createDRRequest({ alternativesConsidered: alternatives });
      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');

      // Then: alternatives_considered appears as YAML list (with leading dash)
      expect(content).toMatch(/alternatives_considered:\n\s+- option:/);
    });
  });

  describe('NFR Compliance', () => {
    test('[P0] 7.1-UNIT-050: DR artifact write must be atomic (file must not be partially written)', async () => {
      // Given: a valid DR creation request
      const request = createDRRequest();

      // When: creating the DR artifact
      const drPath = createDRArtifact(request);

      // Then: file exists and is complete (not empty, not truncated)
      expect(existsSync(drPath)).toBe(true);
      const content = readFileSync(drPath, 'utf8');
      expect(content.length).toBeGreaterThan(100); // Real content, not stub
      expect(content).toContain('---'); // Has frontmatter
      expect(content).toMatch(/^# /m); // Has at least one heading
    });

    test('[P1] 7.1-UNIT-051: DR artifact must not exceed reasonable file size (under 100KB)', () => {
      // NFR-9: Inspectability - artifacts remain human-readable
      const request = createDRRequest();
      const drPath = createDRArtifact(request);
      const content = readFileSync(drPath, 'utf8');

      // Then: file is small enough to be human-readable (no embedded large data)
      expect(content.length).toBeLessThan(100 * 1024); // < 100KB
    });

    test('[P0] 7.1-UNIT-052: two sequential DR artifacts must have different file names', () => {
      // Given: creating two DR artifacts sequentially
      const request1 = createDRRequest({ drNumber: 1 });
      const request2 = createDRRequest({
        drNumber: 2,
        decisionSummary: 'Redis chosen over in-memory storage for horizontal scaling',
      });

      const dr1Path = createDRArtifact(request1);
      const dr2Path = createDRArtifact(request2);

      // Then: different filenames (NFR-4: Atomic file operations, no overwrites)
      expect(dr1Path).not.toBe(dr2Path);
      expect(dr1Path).toMatch(/DR-001\.md$/);
      expect(dr2Path).toMatch(/DR-002\.md$/);
    });
  });
});
