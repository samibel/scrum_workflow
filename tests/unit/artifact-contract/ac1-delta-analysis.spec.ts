/**
 * ATDD Tests for AC1: Delta Analysis against FR-46 Artifact Contract
 *
 * TDD Phase: RED (tests will fail until feature is verified)
 * Test Level: Unit + Integration (File System Validation + Cross-Artifact Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 1.9 - Verify & Align Artifact Contract
 *
 * PRD References:
 * - FR-46: Every slash-command that produces an artifact must generate it in a predictable
 *   location with consistent naming convention.
 *
 * AC1: Given the existing artifact output behavior across all commands
 *      When compared against the FR-46 artifact contract specification
 *      Then a delta analysis documents: which commands produce artifacts at correct locations,
 *           which diverge, and which are missing
 *      And all identified deltas are resolved to match the current PRD spec
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ============================================================================
// AC1: Delta Analysis — Story documents all matches, divergences, and missing items
// ============================================================================

describe('AC1: Delta Analysis — Story implementation documents required analysis', () => {
  const storyFile = join(
    process.cwd(),
    '_bmad-output',
    'implementation-artifacts',
    '1-9-verify-align-artifact-contract.md',
  );
  const prdFile = join(process.cwd(), '_bmad-output', 'planning-artifacts', 'prd.md');

  // Test 1.1: Story implementation file exists
  test('[P0] Story 1.9 implementation file should exist', () => {
    expect(existsSync(storyFile)).toBe(true);
  });

  // Test 1.2: PRD file exists and contains FR-46 specification
  test('[P0] PRD file should exist and contain FR-46 specification', () => {
    expect(existsSync(prdFile)).toBe(true);
    const prdContent = readFileSync(prdFile, 'utf8');
    expect(prdContent).toMatch(/FR-46/);
    // FR-46 must reference artifact contract concept
    expect(prdContent).toMatch(/artifact.*contract|Artifact.*Contract/i);
  });

  // Test 1.3: Story documents which commands produce artifacts at correct locations
  test('[P0] Story should document which commands produce artifacts at correct locations', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    // Must have a compliance table or section covering command-to-artifact mapping
    expect(storyContent).toMatch(/Command.*Artifact|command.*artifact/i);
    // Must reference at least some commands from FR-46
    expect(storyContent).toMatch(/scrum-create-ticket|scrum-refine-ticket|scrum-dev-story/i);
  });

  // Test 1.4: Story documents which commands/outputs DIVERGE from FR-46
  test('[P0] Story should document which commands diverge from FR-46 specification', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    // Must explicitly document divergences
    expect(storyContent).toMatch(/DIVERGE|diverge|delta|Delta/i);
  });

  // Test 1.5: Story documents what is MISSING relative to FR-46 specification
  test('[P0] Story should document what is MISSING vs FR-46 specification', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    // Must document missing items (e.g., /scrum-approve, /wrap-up, /session-start)
    expect(storyContent).toMatch(/missing|MISSING|not.*implemented|NOT IMPLEMENTED|deferred|DEFERRED/i);
  });

  // Test 1.6: Story documents resolution for all identified deltas
  test('[P0] Story should document resolution for all identified deltas', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    // Must document resolutions
    expect(storyContent).toMatch(/resolve|RESOLUTION|resolved|Decision|ACCEPTABLE VARIANCE/i);
    // Must reference FR-46
    expect(storyContent).toMatch(/FR-46/);
  });

  // Test 1.7: Story contains a compliance table mapping commands to artifacts
  test('[P0] Story should include a compliance verification table', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    // Must have a markdown table
    expect(storyContent).toMatch(/\|.*Command.*\|.*Artifact.*\|/i);
    // Table must include status column
    expect(storyContent).toMatch(/\|.*Status.*\||\|.*COMPLIANCE.*\|/i);
  });

  // Test 1.8: Delta analysis covers all FR-46 commands
  test('[P0] Delta analysis should cover all 9 commands listed in FR-46', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    // All 9 FR-46 commands must be referenced
    expect(storyContent).toMatch(/scrum-create-ticket/);
    expect(storyContent).toMatch(/scrum-refine-ticket/);
    expect(storyContent).toMatch(/scrum-refine-story/);
    expect(storyContent).toMatch(/scrum-dev-story/);
    expect(storyContent).toMatch(/scrum-review-story/);
    expect(storyContent).toMatch(/scrum-approve/);
    expect(storyContent).toMatch(/scrum-research/);
    expect(storyContent).toMatch(/wrap-up/);
    expect(storyContent).toMatch(/session-start/);
  });

  // Test 1.9: Story documents the critical directory structure delta
  test('[P0] Story should document the critical _scrum-output vs _bmad-output directory delta', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    // Must document the directory naming difference
    expect(storyContent).toMatch(/_scrum-output/);
    expect(storyContent).toMatch(/_bmad-output/);
  });

  // Test 1.10: All tasks in story are completed (all checkboxes checked)
  test('[P0] All story tasks should be completed (checkboxes checked)', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    // Count unchecked boxes — should be zero
    const uncheckedBoxes = (storyContent.match(/- \[ \]/g) || []).length;
    expect(uncheckedBoxes).toBe(0);
  });
});

// ============================================================================
// AC1: Delta Analysis — PRD FR-46 specification correctness
// ============================================================================

describe('AC1: PRD FR-46 Specification Content', () => {
  const prdFile = join(process.cwd(), '_bmad-output', 'planning-artifacts', 'prd.md');

  // Test 1.11: FR-46 specifies predictable artifact locations
  test('[P0] FR-46 should specify predictable artifact locations for commands', () => {
    expect(existsSync(prdFile)).toBe(true);
    const prdContent = readFileSync(prdFile, 'utf8');
    // FR-46 artifact contract section
    expect(prdContent).toMatch(/FR-46/);
    // Must specify output paths
    expect(prdContent).toMatch(/_scrum-output/);
  });

  // Test 1.12: FR-46 specifies the /scrum-create-ticket artifact
  test('[P0] FR-46 should specify story.md output for /scrum-create-ticket', () => {
    const prdContent = readFileSync(prdFile, 'utf8');
    expect(prdContent).toMatch(/story\.md/);
  });

  // Test 1.13: FR-46 references the research artifact RR-XXX.md
  test('[P0] FR-46 should specify RR-XXX.md output for /scrum-research-* commands', () => {
    const prdContent = readFileSync(prdFile, 'utf8');
    expect(prdContent).toMatch(/RR-XXX\.md|RR-\d{3}\.md/);
  });

  // Test 1.14: FR-46 mentions consistent naming convention principle
  test('[P1] FR-46 should state the consistent naming convention principle', () => {
    const prdContent = readFileSync(prdFile, 'utf8');
    // Principle: predictable location, consistent naming
    expect(prdContent).toMatch(/consistent.*naming|naming.*convention|predictable.*location/i);
  });
});
