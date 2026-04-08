/**
 * ATDD Tests for AC2: Research Artifact Output Compliance
 *
 * TDD Phase: RED (tests will fail until feature is verified)
 * Test Level: Unit + Integration (File System Validation + Artifact Structure)
 * Test Framework: Vitest with TypeScript
 * Story: 1.8 - Verify & Align Research Commands
 *
 * PRD References:
 * - FR-45: Research produces a persistent Research Report artifact (RR-XXX.md)
 *   in `_scrum-output/memory/research/` with YAML frontmatter (topic, tags, date)
 * - FR-46: Artifact contract — `/scrum-research-*` → `RR-XXX.md` in `_scrum-output/memory/research/`
 *
 * AC2: Given FR-45 specifies research commands producing persistent RR-XXX.md artifacts
 *      When a developer runs `/scrum-research-technical` or `/scrum-research-general`
 *      Then a Research Report artifact is created in `_scrum-output/memory/research/`
 *      And the artifact follows the `RR-XXX.md` naming convention
 *      And YAML frontmatter includes: topic, tags, date
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// AC2: Artifact Output — Location, naming, and frontmatter compliance
// ============================================================================

describe('AC2: Research Artifact Output Location', () => {
  const outputDir = join(process.cwd(), '_scrum-output', 'memory', 'research');
  const technicalCommandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'research-technical.md');
  const generalCommandFile = join(process.cwd(), 'scrum_workflow', 'commands', 'research-general.md');
  const technicalWorkflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'research-technical.md');

  // Test 2.1: Output directory exists
  test.skip('[P0] Research output directory should exist at _scrum-output/memory/research/', () => {
    expect(existsSync(outputDir)).toBe(true);
  });

  // Test 2.2: Command specifies correct default output location
  test.skip('[P0] research-technical command should specify _scrum-output/memory/research/ as default output', () => {
    expect(existsSync(technicalCommandFile)).toBe(true);
    const content = readFileSync(technicalCommandFile, 'utf8');
    // Default output must be _scrum-output/memory/research/ (not docs/research/)
    expect(content).toMatch(/_scrum-output\/memory\/research/);
    // Old docs/research/ default must NOT be the specified default
    expect(content).not.toMatch(/Default.*docs\/research/i);
  });

  // Test 2.3: Command specifies correct default output location (general)
  test.skip('[P0] research-general command should specify _scrum-output/memory/research/ as default output', () => {
    expect(existsSync(generalCommandFile)).toBe(true);
    const content = readFileSync(generalCommandFile, 'utf8');
    expect(content).toMatch(/_scrum-output\/memory\/research/);
    expect(content).not.toMatch(/Default.*docs\/research/i);
  });

  // Test 2.4: Workflow specifies correct output path
  test.skip('[P0] research-technical workflow should reference _scrum-output/memory/research/ output path', () => {
    expect(existsSync(technicalWorkflowFile)).toBe(true);
    const content = readFileSync(technicalWorkflowFile, 'utf8');
    expect(content).toMatch(/_scrum-output\/memory\/research/);
  });

  // Test 2.5: Output directory contains at least one RR-XXX.md artifact
  test.skip('[P0] Output directory should contain at least one RR-XXX.md artifact (sample)', () => {
    expect(existsSync(outputDir)).toBe(true);
    const files = readdirSync(outputDir);
    const rrFiles = files.filter((f) => /^RR-\d{3}\.md$/.test(f));
    expect(rrFiles.length).toBeGreaterThan(0);
  });
});

describe('AC2: Research Artifact Naming Convention', () => {
  const outputDir = join(process.cwd(), '_scrum-output', 'memory', 'research');

  // Test 2.6: All artifacts follow RR-XXX.md naming convention
  test.skip('[P0] All research artifacts should follow RR-XXX.md naming convention', () => {
    expect(existsSync(outputDir)).toBe(true);
    const files = readdirSync(outputDir);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    expect(mdFiles.length).toBeGreaterThan(0);
    for (const file of mdFiles) {
      // Must match RR-XXX.md with 3-digit zero-padded number
      expect(file).toMatch(/^RR-\d{3}\.md$/);
    }
  });

  // Test 2.7: Naming starts from RR-001.md (sequential from 001)
  test.skip('[P0] Research artifacts should use zero-padded 3-digit sequential numbering', () => {
    expect(existsSync(outputDir)).toBe(true);
    const files = readdirSync(outputDir);
    const rrFiles = files.filter((f) => /^RR-\d{3}\.md$/.test(f)).sort();

    expect(rrFiles.length).toBeGreaterThan(0);
    // First file must be RR-001.md
    expect(rrFiles[0]).toBe('RR-001.md');
  });

  // Test 2.8: Workflow implements sequential ID generation logic
  test.skip('[P0] Research workflow should include sequential ID generation logic', () => {
    const workflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'research-technical.md');
    expect(existsSync(workflowFile)).toBe(true);
    const content = readFileSync(workflowFile, 'utf8');
    // Workflow must describe how to determine the next sequential number
    expect(content).toMatch(/RR-\d{3}|sequential.*ID|next.*number|sequential.*number/i);
  });

  // Test 2.9: Workflow generates filename following RR-XXX.md pattern
  test.skip('[P0] Research workflow should generate RR-XXX.md filename', () => {
    const workflowFile = join(process.cwd(), 'scrum_workflow', 'workflows', 'research-technical.md');
    const content = readFileSync(workflowFile, 'utf8');
    // Filename generation step must reference RR-XXX.md pattern
    expect(content).toMatch(/RR-XXX\.md|RR-\d{3}\.md/);
    // Must NOT generate the old filename format (topic-date)
    expect(content).not.toMatch(/technical-research-{topic}/);
  });
});

describe('AC2: Research Artifact YAML Frontmatter', () => {
  const outputDir = join(process.cwd(), '_scrum-output', 'memory', 'research');
  const sampleArtifactPath = join(outputDir, 'RR-001.md');

  // Test 2.10: Sample artifact has required YAML frontmatter
  test.skip('[P0] Sample research artifact should have YAML frontmatter', () => {
    expect(existsSync(sampleArtifactPath)).toBe(true);
    const content = readFileSync(sampleArtifactPath, 'utf8');
    // Must start with YAML frontmatter delimiter
    expect(content.trim()).toMatch(/^---/);
    // Must have closing delimiter
    expect(content).toMatch(/---\n/);
  });

  // Test 2.11: Frontmatter contains required `topic` field
  test.skip('[P0] Research artifact frontmatter should contain `topic` field', () => {
    expect(existsSync(sampleArtifactPath)).toBe(true);
    const content = readFileSync(sampleArtifactPath, 'utf8');
    expect(content).toMatch(/^topic:/m);
  });

  // Test 2.12: Frontmatter contains required `tags` field
  test.skip('[P0] Research artifact frontmatter should contain `tags` field', () => {
    expect(existsSync(sampleArtifactPath)).toBe(true);
    const content = readFileSync(sampleArtifactPath, 'utf8');
    expect(content).toMatch(/^tags:/m);
  });

  // Test 2.13: Frontmatter contains required `date` field
  test.skip('[P0] Research artifact frontmatter should contain `date` field', () => {
    expect(existsSync(sampleArtifactPath)).toBe(true);
    const content = readFileSync(sampleArtifactPath, 'utf8');
    expect(content).toMatch(/^date:/m);
  });

  // Test 2.14: Frontmatter `date` field follows ISO 8601 format (YYYY-MM-DD)
  test.skip('[P0] Research artifact frontmatter `date` should be in YYYY-MM-DD format', () => {
    expect(existsSync(sampleArtifactPath)).toBe(true);
    const content = readFileSync(sampleArtifactPath, 'utf8');
    // Date must be in YYYY-MM-DD format
    expect(content).toMatch(/^date: \d{4}-\d{2}-\d{2}$/m);
  });

  // Test 2.15: Frontmatter contains `type` field with valid value
  test.skip('[P0] Research artifact frontmatter should contain valid `type` field', () => {
    expect(existsSync(sampleArtifactPath)).toBe(true);
    const content = readFileSync(sampleArtifactPath, 'utf8');
    expect(content).toMatch(/^type: (technical_research|general_research)$/m);
  });

  // Test 2.16: Frontmatter contains `sources` field
  test.skip('[P1] Research artifact frontmatter should contain `sources` field', () => {
    expect(existsSync(sampleArtifactPath)).toBe(true);
    const content = readFileSync(sampleArtifactPath, 'utf8');
    expect(content).toMatch(/^sources:/m);
  });

  // Test 2.17: Researcher agent references correct output path
  test.skip('[P0] Researcher agent should reference _scrum-output/memory/research/ state file location', () => {
    const agentFile = join(process.cwd(), 'scrum_workflow', 'agents', 'researcher.md');
    expect(existsSync(agentFile)).toBe(true);
    const content = readFileSync(agentFile, 'utf8');
    // State file must reference correct path (not old docs/research/ path)
    expect(content).toMatch(/_scrum-output\/memory\/research|_scrum-output.*research/);
  });
});

describe('AC2: Research Artifact Persistence', () => {
  const outputDir = join(process.cwd(), '_scrum-output', 'memory', 'research');
  const sampleArtifactPath = join(outputDir, 'RR-001.md');

  // Test 2.18: Artifact file exists and is readable (proves persistence)
  test.skip('[P0] Research artifact should be persistent and readable', () => {
    expect(existsSync(sampleArtifactPath)).toBe(true);
    const content = readFileSync(sampleArtifactPath, 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });

  // Test 2.19: Output directory is inside _scrum-output (persists with project)
  test.skip('[P0] Research artifacts should be stored inside _scrum-output/ (project-persistent location)', () => {
    expect(existsSync(outputDir)).toBe(true);
    // Path must contain _scrum-output
    expect(outputDir).toMatch(/_scrum-output/);
  });

  // Test 2.20: Research artifacts can be discovered by listing directory
  test.skip('[P0] Research artifacts should be discoverable by listing the output directory', () => {
    expect(existsSync(outputDir)).toBe(true);
    const files = readdirSync(outputDir);
    const rrFiles = files.filter((f) => /^RR-\d{3}\.md$/.test(f));
    expect(rrFiles.length).toBeGreaterThan(0);
  });
});
