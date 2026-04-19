/**
 * ATDD Tests for AC3: FR-45 Phase 1 Full Compliance
 *
 * TDD Phase: RED (tests will fail until feature is verified)
 * Test Level: Integration (End-to-End Compliance Check)
 * Test Framework: Vitest with TypeScript
 * Story: 1.8 - Verify & Align Research Commands
 *
 * PRD References:
 * - FR-45: Developer can conduct technical or general research. Research produces a
 *   persistent Research Report artifact (RR-XXX.md) in `_scrum-output/memory/research/`
 *   with YAML frontmatter (topic, tags, date). Phase 1 scope only.
 * - FR-46: Artifact contract — `/scrum-research-*` → `RR-XXX.md` in `_scrum-output/memory/research/`
 *
 * AC3: Given all deltas have been resolved
 *      When the implementation is reviewed
 *      Then research commands fully match the current PRD specification (Phase 1 scope)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// AC3: FR-45 Phase 1 Compliance — Full implementation review
// ============================================================================

describe('AC3: FR-45 Phase 1 Compliance — All Components', () => {
  const projectRoot = process.cwd();

  // Test 3.1: Both research command files exist
  test.skip('[P0] Both research command files should exist', () => {
    const techCmd = join(projectRoot, 'scrum_workflow', 'commands', 'research-technical.md');
    const genCmd = join(projectRoot, 'scrum_workflow', 'commands', 'research-general.md');
    expect(existsSync(techCmd)).toBe(true);
    expect(existsSync(genCmd)).toBe(true);
  });

  // Test 3.2: research-technical command specifies RR-XXX.md as output
  test.skip('[P0] research-technical command should specify RR-XXX.md output format', () => {
    const techCmd = join(projectRoot, 'scrum_workflow', 'commands', 'research-technical.md');
    const content = readFileSync(techCmd, 'utf8');
    // Output section must reference RR-XXX.md naming
    expect(content).toMatch(/RR-XXX\.md|RR-\d{3}\.md/);
    // Output section must reference correct directory
    expect(content).toMatch(/_scrum-output\/memory\/research/);
  });

  // Test 3.3: research-general command specifies RR-XXX.md as output
  test.skip('[P0] research-general command should specify RR-XXX.md output format', () => {
    const genCmd = join(projectRoot, 'scrum_workflow', 'commands', 'research-general.md');
    const content = readFileSync(genCmd, 'utf8');
    expect(content).toMatch(/RR-XXX\.md|RR-\d{3}\.md/);
    expect(content).toMatch(/_scrum-output\/memory\/research/);
  });

  // Test 3.4: research-technical workflow references updated output location
  test.skip('[P0] research-technical workflow should reference _scrum-output/memory/research/ throughout', () => {
    const techWorkflow = join(projectRoot, 'scrum_workflow', 'workflows', 'research-technical.md');
    expect(existsSync(techWorkflow)).toBe(true);
    const content = readFileSync(techWorkflow, 'utf8');
    expect(content).toMatch(/_scrum-output\/memory\/research/);
    // Old path must not be the active default
    expect(content).not.toMatch(/Default.*docs\/research/i);
  });

  // Test 3.5: Researcher agent references correct path
  test.skip('[P0] Researcher agent should reference updated output path', () => {
    const agentFile = join(projectRoot, 'scrum_workflow', 'agents', 'researcher.md');
    expect(existsSync(agentFile)).toBe(true);
    const content = readFileSync(agentFile, 'utf8');
    expect(content).toMatch(/_scrum-output.*research|research.*_scrum-output/);
  });

  // Test 3.6: Story status reflects completion
  test.skip('[P0] Story 1.8 implementation record should document FR-45 compliance', () => {
    const storyFile = join(
      projectRoot,
      '_scrum-output',
      'implementation-artifacts',
      '1-8-verify-align-research-commands.md',
    );
    expect(existsSync(storyFile)).toBe(true);
    const content = readFileSync(storyFile, 'utf8');
    // Must reference FR-45 compliance
    expect(content).toMatch(/FR-45/);
    // Must show compliance is verified
    expect(content).toMatch(/FR-45.*Phase 1 Compliance|Phase 1.*Compliance/i);
  });

  // Test 3.7: Story documents all 6 FR-45 Phase 1 requirements
  test.skip('[P0] Story should document all 6 FR-45 Phase 1 requirements', () => {
    const storyFile = join(
      projectRoot,
      '_scrum-output',
      'implementation-artifacts',
      '1-8-verify-align-research-commands.md',
    );
    const content = readFileSync(storyFile, 'utf8');
    // Must reference all 6 Phase 1 requirements:
    // 1. Persistent artifacts
    expect(content).toMatch(/persistent.*artifact|artifact.*persistent/i);
    // 2. RR-XXX.md naming convention
    expect(content).toMatch(/RR-XXX\.md|naming.*convention/i);
    // 3. YAML frontmatter with topic, tags, date
    expect(content).toMatch(/frontmatter/i);
    // 4. Output location
    expect(content).toMatch(/_scrum-output\/memory\/research/);
    // 5. Session survival (file-based persistence)
    expect(content).toMatch(/session|persist/i);
    // 6. Discoverability
    expect(content).toMatch(/discover|searchable/i);
  });
});

describe('AC3: FR-45 Phase 2 Features Correctly Deferred', () => {
  const projectRoot = process.cwd();

  // Test 3.8: Story explicitly defers Phase 2 features to Epic 7
  test.skip('[P0] Story should explicitly defer Phase 2 features to Epic 7', () => {
    const storyFile = join(
      projectRoot,
      '_scrum-output',
      'implementation-artifacts',
      '1-8-verify-align-research-commands.md',
    );
    const content = readFileSync(storyFile, 'utf8');
    // Phase 2 features must be explicitly deferred
    expect(content).toMatch(/Epic 7|Phase 2/i);
    expect(content).toMatch(/deferred|defer/i);
  });

  // Test 3.9: referenced-by field is NOT in sample artifact
  test.skip('[P1] Sample research artifact should NOT contain `referenced-by` Phase 2 field', () => {
    const outputDir = join(projectRoot, '_scrum-output', 'memory', 'research');
    if (!existsSync(outputDir)) return;

    const files = readdirSync(outputDir).filter((f) => /^RR-\d{3}\.md$/.test(f));
    for (const file of files) {
      const content = readFileSync(join(outputDir, file), 'utf8');
      // referenced-by is a Phase 2 feature, must NOT be present in Phase 1
      expect(content).not.toMatch(/^referenced-by:/m);
    }
  });

  // Test 3.10: Commands do NOT implement automatic loading (Phase 2 feature)
  test.skip('[P1] Research commands should NOT implement automatic loading by refinement agents', () => {
    const techCmd = join(projectRoot, 'scrum_workflow', 'commands', 'research-technical.md');
    const content = readFileSync(techCmd, 'utf8');
    // No automatic loading instructions
    expect(content).not.toMatch(/automatically.*load|auto.*load.*agent/i);
  });

  // Test 3.11: Commands do NOT implement ticket referencing (Phase 2 feature)
  test.skip('[P1] Research commands should NOT implement ticket referencing integration', () => {
    const techCmd = join(projectRoot, 'scrum_workflow', 'commands', 'research-technical.md');
    const genCmd = join(projectRoot, 'scrum_workflow', 'commands', 'research-general.md');
    const techContent = readFileSync(techCmd, 'utf8');
    const genContent = readFileSync(genCmd, 'utf8');

    // Ticket referencing is Phase 2 — not yet implemented
    expect(techContent).not.toMatch(/create-ticket.*reference.*RR|RR.*ticket.*link/i);
    expect(genContent).not.toMatch(/create-ticket.*reference.*RR|RR.*ticket.*link/i);
  });
});

describe('AC3: FR-46 Artifact Contract Compliance', () => {
  const projectRoot = process.cwd();

  // Test 3.12: FR-46 artifact contract is documented in story or PRD
  test.skip('[P0] FR-46 artifact contract should be documented', () => {
    const prdFile = join(projectRoot, '_scrum-output', 'planning-artifacts', 'prd.md');
    expect(existsSync(prdFile)).toBe(true);
    const content = readFileSync(prdFile, 'utf8');
    // FR-46 artifact contract must be present
    expect(content).toMatch(/FR-46/);
    // Must show the artifact mapping
    expect(content).toMatch(/scrum-research.*RR-XXX\.md|RR-XXX\.md.*scrum-output/);
  });

  // Test 3.13: Story 1.8 is aligned with FR-46 artifact contract
  test.skip('[P0] Story 1.8 should reference FR-46 artifact contract', () => {
    const storyFile = join(
      projectRoot,
      '_scrum-output',
      'implementation-artifacts',
      '1-8-verify-align-research-commands.md',
    );
    const content = readFileSync(storyFile, 'utf8');
    expect(content).toMatch(/FR-46/);
  });

  // Test 3.14: Story status shows implementation is complete
  test.skip('[P0] Story 1.8 should have implementation completion notes', () => {
    const storyFile = join(
      projectRoot,
      '_scrum-output',
      'implementation-artifacts',
      '1-8-verify-align-research-commands.md',
    );
    const content = readFileSync(storyFile, 'utf8');
    // Story must have completion notes
    expect(content).toMatch(/Completion Notes|Implementation.*Complete|completed.*Story/i);
  });
});
