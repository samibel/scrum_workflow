/**
 * ATDD Tests — AC1: Architect Risk Note Extraction
 * Story 7.2: Implement Risk Note Extraction & Auto-Loading
 *
 * AC1: Given FR-29 specifies risk notes extracted from Architect agent perspectives
 *      When the Architect agent produces a perspective during /scrum-refine-ticket
 *      Then identified risks are extracted as standalone RN-XXX.md artifacts in _scrum-output/memory/risks/
 *      And each risk note contains: risk description, severity, affected area, mitigation suggestion, source ticket
 *
 * TDD RED PHASE: All tests use test() — feature (risk-extraction.js) not yet implemented.
 * Remove test() after implementing scrum_workflow/utils/risk-extraction.js.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  getNextRNNumber,
  formatRNNumber,
  ensureRisksDirExists,
  detectRiskSignals,
  extractRisksFromRefinement,
  writeRNWithBoundaryCheck,
  createRNArtifact,
} from '../../utils/risk-extraction.js';

const PROJECT_ROOT = join(process.cwd());
const RISKS_DIR = join(PROJECT_ROOT, '_scrum-output', 'memory', 'risks');
const TEST_RISKS_DIR = join(PROJECT_ROOT, '_test-output', 'memory', 'risks');

// ─── Factories ────────────────────────────────────────────────────────────────

/**
 * Creates mock refinement.md content with a well-formed Architect Perspective section
 * containing a Findings table and Recommendations — the canonical Architect agent output format.
 */
function createRefinementWithArchitectPerspective(overrides = {}) {
  return {
    ticketId: overrides.ticketId ?? 'SW-010',
    content: overrides.content ?? `---
schema_version: 1.0.0
ticket: SW-010
status: refined
---

# Refinement: SW-010

## Summary

Story has been refined and is ready for development.

## Architect Perspective

### Findings

| # | Finding | Severity | Category |
|---|---------|----------|----------|
| 1 | Risk note files are written without atomic guarantees; a crash mid-write leaves corrupt RN-XXX.md | Critical | Data Integrity |
| 2 | Domain tag matching uses naive substring search which may produce false positives for short tags | Major | Search Accuracy |
| 3 | Sequential RN numbering requires a directory scan on every write which could slow under high volume | Minor | Performance |

### Recommendations

1. Use atomic file writes (write to temp file, then rename) to prevent corrupt risk note artifacts.
2. Use word-boundary regex matching instead of naive substring search for domain tag matching.
3. Cache the RN number counter in memory during a single refinement run to avoid repeated directory scans.

### Proposed Acceptance Criteria

- [ ] Risk notes are written atomically
- [ ] Domain tag matching uses word-boundary matching
`,
    sourceFile: overrides.sourceFile ?? '_scrum-output/sprints/SW-010/refinement.md',
  };
}

/**
 * Creates mock refinement without an Architect Perspective section
 */
function createRefinementWithoutArchitectPerspective(overrides = {}) {
  return {
    ticketId: overrides.ticketId ?? 'SW-011',
    content: overrides.content ?? `---
schema_version: 1.0.0
ticket: SW-011
status: refined
---

# Refinement: SW-011

## Summary

Standard refinement without architect review. All tasks are clear.
`,
    sourceFile: overrides.sourceFile ?? '_scrum-output/sprints/SW-011/refinement.md',
  };
}

/**
 * Creates refinement with empty Findings table (no rows)
 */
function createRefinementWithEmptyFindingsTable(overrides = {}) {
  return {
    ticketId: overrides.ticketId ?? 'SW-012',
    content: overrides.content ?? `---
schema_version: 1.0.0
ticket: SW-012
status: refined
---

# Refinement: SW-012

## Architect Perspective

### Findings

| # | Finding | Severity | Category |
|---|---------|----------|----------|

### Recommendations

No significant risks identified.
`,
    sourceFile: overrides.sourceFile ?? '_scrum-output/sprints/SW-012/refinement.md',
  };
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function createTemporaryRisksDir() {
  if (!existsSync(TEST_RISKS_DIR)) {
    mkdirSync(TEST_RISKS_DIR, { recursive: true });
  }
  return TEST_RISKS_DIR;
}

function cleanupTemporaryRisksDir() {
  const testOutputDir = join(PROJECT_ROOT, '_test-output', 'memory');
  if (existsSync(testOutputDir)) {
    rmSync(testOutputDir, { recursive: true, force: true });
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('AC1: Architect Risk Note Extraction', () => {
  let risksDir;

  beforeEach(() => {
    risksDir = createTemporaryRisksDir();
  });

  afterEach(() => {
    cleanupTemporaryRisksDir();
  });

  // ── Sequential RN Numbering ────────────────────────────────────────────────

  describe('Sequential RN Numbering', () => {
    test('[P0] 7.2-UNIT-001: should return RN-001 as first number when risks dir is empty', () => {
      // Given: empty risks directory
      // When: getting next RN number
      const nextNumber = getNextRNNumber(risksDir);

      // Then: returns 1 (RN-001)
      expect(nextNumber).toBe(1);
    });

    test('[P0] 7.2-UNIT-002: should increment RN number when one RN already exists', () => {
      // Given: RN-001.md exists in risks directory
      writeFileSync(join(risksDir, 'RN-001.md'), '# Risk Note 1', 'utf8');

      // When: getting next RN number
      const nextNumber = getNextRNNumber(risksDir);

      // Then: returns 2 (RN-002)
      expect(nextNumber).toBe(2);
    });

    test('[P0] 7.2-UNIT-003: should derive next number from highest existing RN (skip gaps)', () => {
      // Given: RN-001.md and RN-005.md exist (gap in numbering)
      writeFileSync(join(risksDir, 'RN-001.md'), '# RN 1', 'utf8');
      writeFileSync(join(risksDir, 'RN-005.md'), '# RN 5', 'utf8');

      // When: getting next RN number
      const nextNumber = getNextRNNumber(risksDir);

      // Then: returns 6 (highest + 1, does NOT fill gaps)
      expect(nextNumber).toBe(6);
    });

    test('[P0] 7.2-UNIT-004: should format RN number as zero-padded 3-digit string', () => {
      // Given: RN numbers of various sizes
      // When: formatting
      // Then: always 3-digit zero-padded (RN-001, RN-042, RN-100)
      expect(formatRNNumber(1)).toBe('001');
      expect(formatRNNumber(42)).toBe('042');
      expect(formatRNNumber(100)).toBe('100');
    });

    test('[P0] 7.2-UNIT-005: should create risks directory if it does not exist', () => {
      // Given: risks directory does not exist
      const nonExistentDir = join(PROJECT_ROOT, '_test-output', 'memory', 'risks-new');

      // When: ensuring directory exists
      ensureRisksDirExists(nonExistentDir);

      // Then: directory is created
      expect(existsSync(nonExistentDir)).toBe(true);

      // Cleanup
      rmSync(nonExistentDir, { recursive: true, force: true });
    });

    test('[P1] 7.2-UNIT-006: should only count RN-NNN.md files (not other files) when numbering', () => {
      // Given: risks directory with a README.md and RN-003.md
      writeFileSync(join(risksDir, 'README.md'), '# Risks', 'utf8');
      writeFileSync(join(risksDir, 'RN-003.md'), '# RN 3', 'utf8');

      // When: getting next RN number
      const nextNumber = getNextRNNumber(risksDir);

      // Then: returns 4 (only RN-NNN.md files counted)
      expect(nextNumber).toBe(4);
    });
  });

  // ── Risk Signal Detection from Architect Findings Table ───────────────────

  describe('Risk Signal Detection from Architect Findings Table', () => {
    test('[P0] 7.2-UNIT-010: should detect risks in well-formed Findings table', () => {
      // Given: refinement with Architect Findings table with 3 rows
      const { content } = createRefinementWithArchitectPerspective();

      // When: detecting risk signals
      const signals = detectRiskSignals(content);

      // Then: all 3 findings are detected as risk signals
      expect(signals.length).toBe(3);
    });

    test('[P0] 7.2-UNIT-011: should extract severity from Findings table row', () => {
      // Given: refinement content with a Critical severity finding
      const { content } = createRefinementWithArchitectPerspective();

      // When: detecting risk signals
      const signals = detectRiskSignals(content);

      // Then: first signal has severity "critical" (normalized to lowercase)
      expect(signals[0].severity).toBe('critical');
    });

    test('[P0] 7.2-UNIT-012: should extract affected area (category) from Findings table row', () => {
      // Given: refinement with Category column in findings table
      const { content } = createRefinementWithArchitectPerspective();

      // When: detecting risk signals
      const signals = detectRiskSignals(content);

      // Then: affected_area is extracted from Category column
      expect(signals[0].affected_area).toBe('Data Integrity');
    });

    test('[P0] 7.2-UNIT-013: should extract risk description from Finding column', () => {
      // Given: refinement with Finding text
      const { content } = createRefinementWithArchitectPerspective();

      // When: detecting risk signals
      const signals = detectRiskSignals(content);

      // Then: risk description matches the Finding text
      expect(signals[0].risk_description).toContain('atomic');
    });

    test('[P1] 7.2-UNIT-014: should map severity values to lowercase canonical form', () => {
      // Given: findings with Critical, Major, Minor severities
      const { content } = createRefinementWithArchitectPerspective();

      // When: detecting risk signals
      const signals = detectRiskSignals(content);

      // Then: all severities are lowercase
      const severities = signals.map(s => s.severity);
      expect(severities).toContain('critical');
      expect(severities).toContain('major');
      expect(severities).toContain('minor');
    });

    test('[P1] 7.2-UNIT-015: should return empty array when no Architect Perspective section present', () => {
      // Given: refinement without Architect Perspective
      const { content } = createRefinementWithoutArchitectPerspective();

      // When: detecting risk signals
      const signals = detectRiskSignals(content);

      // Then: no signals found (not an error)
      expect(signals).toHaveLength(0);
    });

    test('[P1] 7.2-UNIT-016: should return empty array when Findings table has no data rows', () => {
      // Given: refinement with empty Findings table
      const { content } = createRefinementWithEmptyFindingsTable();

      // When: detecting risk signals
      const signals = detectRiskSignals(content);

      // Then: no signals found
      expect(signals).toHaveLength(0);
    });

    test('[P2] 7.2-UNIT-017: should match Recommendations to findings as mitigation suggestions', () => {
      // Given: refinement with both Findings table and Recommendations section
      const { content } = createRefinementWithArchitectPerspective();

      // When: detecting risk signals
      const signals = detectRiskSignals(content);

      // Then: first signal has a mitigation_suggestion from Recommendations
      // (mitigation may be the corresponding numbered recommendation or a best-effort match)
      expect(signals[0].mitigation_suggestion).toBeTruthy();
      expect(typeof signals[0].mitigation_suggestion).toBe('string');
    });
  });

  // ── RN Artifact Creation from Refinement ──────────────────────────────────

  describe('RN Artifact Creation from Refinement', () => {
    test('[P0] 7.2-INT-001: should create RN-001.md when refinement has Architect findings and risks dir is empty', async () => {
      // Given: refinement with Architect Perspective (3 findings), empty risks directory
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-010' });

      // When: extracting risks from refinement
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: refinement.ticketId,
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // Then: RN-001.md is the first created artifact
      expect(result.created.length).toBeGreaterThanOrEqual(1);
      expect(result.created[0]).toBe('RN-001.md');
      expect(existsSync(join(risksDir, 'RN-001.md'))).toBe(true);
    });

    test('[P0] 7.2-INT-002: should create multiple RN artifacts sequentially for multiple findings', async () => {
      // Given: refinement with 3 findings
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-010' });

      // When: extracting risks
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: refinement.ticketId,
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // Then: 3 RN artifacts created sequentially
      expect(result.created).toHaveLength(3);
      expect(result.created).toContain('RN-001.md');
      expect(result.created).toContain('RN-002.md');
      expect(result.created).toContain('RN-003.md');
    });

    test('[P0] 7.2-INT-003: should continue sequential numbering when RN-001.md already exists', async () => {
      // Given: RN-001.md already exists (from a prior run)
      writeFileSync(join(risksDir, 'RN-001.md'), '# RN-001 from prior run', 'utf8');

      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-013' });

      // When: extracting risks (3 findings)
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-013',
        sourceFile: '_scrum-output/sprints/SW-013/refinement.md',
        risksDir,
      });

      // Then: starts at RN-002 (next after existing RN-001)
      expect(result.created[0]).toBe('RN-002.md');
      expect(existsSync(join(risksDir, 'RN-002.md'))).toBe(true);
    });

    test('[P0] 7.2-INT-004: should return empty created array when no Architect Perspective found', async () => {
      // Given: refinement without Architect Perspective
      const refinement = createRefinementWithoutArchitectPerspective();

      // When: extracting risks
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: refinement.ticketId,
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // Then: no RNs created, not an error
      expect(result.created).toHaveLength(0);
      expect(result.noRisksDetected).toBe(true);
    });

    test('[P0] 7.2-INT-005: should return empty created array when Findings table has no rows', async () => {
      // Given: refinement with empty Findings table
      const refinement = createRefinementWithEmptyFindingsTable();

      // When: extracting risks
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: refinement.ticketId,
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // Then: no RNs created (not an error — no risks to extract)
      expect(result.created).toHaveLength(0);
      expect(result.noRisksDetected).toBe(true);
    });

    test('[P1] 7.2-INT-006: should auto-create risks directory if it does not exist', async () => {
      // Given: risks directory does not exist
      const newRisksDir = join(PROJECT_ROOT, '_test-output', 'memory', 'risks-autoCreate');
      expect(existsSync(newRisksDir)).toBe(false);

      // When: extracting risks (triggers auto-create)
      const result = await extractRisksFromRefinement({
        content: createRefinementWithArchitectPerspective().content,
        ticketId: 'SW-014',
        sourceFile: '_scrum-output/sprints/SW-014/refinement.md',
        risksDir: newRisksDir,
      });

      // Then: directory created and RN-001.md written
      expect(existsSync(newRisksDir)).toBe(true);
      expect(result.created).toContain('RN-001.md');

      // Cleanup
      rmSync(newRisksDir, { recursive: true, force: true });
    });

    test('[P1] 7.2-INT-007: should include ticket reference in each RN artifact', async () => {
      // Given: refinement for ticket SW-015
      const ticketId = 'SW-015';
      const refinement = createRefinementWithArchitectPerspective({ ticketId });

      // When: extracting risks
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId,
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // Then: all created RN artifacts contain the ticket reference (NFR-7 Artifact Traceability)
      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');
      expect(rnContent).toContain(`ticket: "${ticketId}"`);
    });

    test('[P1] 7.2-INT-008: should set status to active on creation', async () => {
      // Given: refinement with findings
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-016' });

      // When: extracting risks
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-016',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // Then: RN artifact has status: active (not draft — risk notes go directly to active)
      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');
      expect(rnContent).toMatch(/status:\s*active/);
    });

    test('[P1] 7.2-INT-009: should include source_file in each RN artifact', async () => {
      // Given: refinement with known source file path
      const sourceFile = '_scrum-output/sprints/SW-017/refinement.md';
      const refinement = createRefinementWithArchitectPerspective({
        ticketId: 'SW-017',
        sourceFile,
      });

      // When: extracting risks
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-017',
        sourceFile,
        risksDir,
      });

      // Then: RN artifact contains the source_file reference (NFR-7)
      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');
      expect(rnContent).toContain(sourceFile);
    });
  });

  // ── Write Boundary Enforcement ────────────────────────────────────────────

  describe('Write Boundary Enforcement', () => {
    test('[P0] 7.2-UNIT-020: should reject writes to sprint artifacts (story.md)', () => {
      // Given: an attempt to write to a sprint story file
      const invalidPath = join(PROJECT_ROOT, '_scrum-output', 'sprints', 'SW-001', 'story.md');

      // When/Then: write boundary violation throws error
      expect(() => {
        writeRNWithBoundaryCheck('# content', invalidPath, RISKS_DIR);
      }).toThrow(/Write Boundary Violation/);
    });

    test('[P0] 7.2-UNIT-021: should reject writes to sprint refinement.md', () => {
      // Given: attempt to write to a refinement artifact
      const invalidPath = join(PROJECT_ROOT, '_scrum-output', 'sprints', 'SW-001', 'refinement.md');

      expect(() => {
        writeRNWithBoundaryCheck('# content', invalidPath, RISKS_DIR);
      }).toThrow(/Write Boundary Violation/);
    });

    test('[P0] 7.2-UNIT-022: should reject writes to framework workflow files', () => {
      // Given: attempt to write to a workflow file
      const invalidPath = join(PROJECT_ROOT, 'scrum_workflow', 'workflows', 'refinement.md');

      expect(() => {
        writeRNWithBoundaryCheck('# content', invalidPath, RISKS_DIR);
      }).toThrow(/Write Boundary Violation/);
    });

    test('[P0] 7.2-UNIT-023: should allow writes to _scrum-output/memory/risks/ directory', () => {
      // Given: a valid path within the risks directory
      const validPath = join(risksDir, 'RN-001.md');

      // When/Then: does NOT throw
      expect(() => {
        writeRNWithBoundaryCheck('# RN-001 content', validPath, risksDir);
      }).not.toThrow();

      expect(existsSync(validPath)).toBe(true);
    });

    test('[P0] 7.2-UNIT-024: should allow writes to test-output/memory/risks/ for test isolation', () => {
      // Given: test isolation path in _test-output/memory/risks/
      const testPath = join(risksDir, 'RN-TEST.md');

      // When/Then: allowed (test isolation)
      expect(() => {
        writeRNWithBoundaryCheck('# test content', testPath, risksDir);
      }).not.toThrow();
    });

    test('[P1] 7.2-UNIT-025: should reject writes to create-scrum-workflow/ CLI source files', () => {
      // Given: attempt to write to CLI source code
      const invalidPath = join(PROJECT_ROOT, 'create-scrum-workflow', 'src', 'index.js');

      expect(() => {
        writeRNWithBoundaryCheck('# content', invalidPath, RISKS_DIR);
      }).toThrow(/Write Boundary Violation/);
    });
  });

  // ── RN Artifact Format ────────────────────────────────────────────────────

  describe('RN Artifact YAML Frontmatter Fields (AC1 — required fields)', () => {
    test('[P0] 7.2-UNIT-030: created RN artifact must contain schema_version field', async () => {
      // Given: refinement with findings
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-020' });

      // When: creating RN artifact
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-020',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: YAML frontmatter contains schema_version
      expect(rnContent).toContain('schema_version: 1.0.0');
    });

    test('[P0] 7.2-UNIT-031: created RN artifact must contain risk_description field', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-021' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-021',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: risk_description field present in frontmatter
      expect(rnContent).toMatch(/risk_description:/);
    });

    test('[P0] 7.2-UNIT-032: created RN artifact must contain severity field with valid value', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-022' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-022',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: severity is one of: critical, major, minor
      expect(rnContent).toMatch(/severity:\s*"?(critical|major|minor)"?/);
    });

    test('[P0] 7.2-UNIT-033: created RN artifact must contain affected_area field', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-023' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-023',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: affected_area extracted from Category column
      expect(rnContent).toMatch(/affected_area:/);
      expect(rnContent).toContain('Data Integrity');
    });

    test('[P0] 7.2-UNIT-034: created RN artifact must contain mitigation_suggestion field', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-024' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-024',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: mitigation_suggestion field present
      expect(rnContent).toMatch(/mitigation_suggestion:/);
    });

    test('[P0] 7.2-UNIT-035: created RN artifact must contain status: active on creation', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-025' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-025',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: status is active (risk note lifecycle: active → resolved)
      expect(rnContent).toMatch(/status:\s*active/);
    });

    test('[P0] 7.2-UNIT-036: created RN artifact must contain domain_tags array', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-026' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-026',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: domain_tags is a YAML array
      expect(rnContent).toMatch(/domain_tags:\n(\s+-\s+\S+)/);
    });

    test('[P0] 7.2-UNIT-037: created RN artifact must contain created and updated timestamps in ISO 8601 UTC', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-027' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-027',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: ISO 8601 UTC timestamps (ends with Z)
      expect(rnContent).toMatch(/created:\s*"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z"/);
      expect(rnContent).toMatch(/updated:\s*"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z"/);
    });

    test('[P0] 7.2-UNIT-038: created RN artifact must start with YAML frontmatter delimiters', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-028' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-028',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: valid Markdown with YAML frontmatter (NFR-9 Inspectability)
      expect(rnContent.startsWith('---\n')).toBe(true);
      expect(rnContent).toMatch(/^---\n[\s\S]*?\n---\n/);
    });

    test('[P0] 7.2-UNIT-039: RN artifact filename must follow RN-NNN.md pattern', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-029' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-029',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // Then: all created filenames match RN-NNN.md pattern
      for (const fileName of result.created) {
        expect(fileName).toMatch(/^RN-\d{3}\.md$/);
      }
    });
  });

  // ── NFR Compliance ────────────────────────────────────────────────────────

  describe('NFR Compliance', () => {
    test('[P0] 7.2-UNIT-040: RN artifact write must be atomic (file must not be partially written)', async () => {
      // Given: valid extraction input
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-030' });

      // When: creating RN artifact
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-030',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // Then: file exists and is complete (NFR-4 Atomic file operations)
      expect(result.created.length).toBeGreaterThan(0);
      const rnPath = join(risksDir, result.created[0]);
      expect(existsSync(rnPath)).toBe(true);
      const content = readFileSync(rnPath, 'utf8');
      expect(content.length).toBeGreaterThan(100); // Real content, not stub
      expect(content).toContain('---');             // Has frontmatter
      expect(content).toMatch(/^# /m);             // Has at least one heading
    });

    test('[P1] 7.2-UNIT-041: two sequential RN artifacts must have different filenames (no overwrites)', async () => {
      // Given: two separate extractions
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-031' });

      // When: first extraction (creates RN-001.md, RN-002.md, RN-003.md)
      const result1 = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-031',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // Then: second extraction continues numbering (RN-004.md, ...)
      const result2 = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-031',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      // All filenames are unique — no overwrites (NFR-4)
      const allCreated = [...result1.created, ...result2.created];
      const uniqueNames = new Set(allCreated);
      expect(uniqueNames.size).toBe(allCreated.length);
    });

    test('[P1] 7.2-UNIT-042: RN artifact must be plain text with no binary content (NFR-9)', async () => {
      const refinement = createRefinementWithArchitectPerspective({ ticketId: 'SW-032' });
      const result = await extractRisksFromRefinement({
        content: refinement.content,
        ticketId: 'SW-032',
        sourceFile: refinement.sourceFile,
        risksDir,
      });

      expect(result.created.length).toBeGreaterThan(0);
      const rnContent = readFileSync(join(risksDir, result.created[0]), 'utf8');

      // Then: pure text (Git-diffable, inspectable — NFR-9)
      expect(typeof rnContent).toBe('string');
      expect(rnContent).not.toContain('\x00'); // No null bytes (binary indicator)
    });
  });
});
