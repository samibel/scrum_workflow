/**
 * ATDD Tests for AC1: --depth Flag Parsing and Storage
 *
 * TDD Phase: RED (tests written before implementation — will be activated after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 5.1 - Implement Manual Workflow Depth Override
 *
 * PRD References:
 * - FR-3: Manual workflow depth override via --depth light/standard
 *
 * AC1: Given FR-3 specifies manual workflow depth override via --depth light/standard
 *      When a developer runs /scrum-create-ticket with --depth light or --depth standard
 *      Then the depth value is stored in the story.md YAML frontmatter as a depth field
 *      And if no --depth flag is provided, the default is standard
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const CREATE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');
const STORY_FILE = join(process.cwd(), '_bmad-output', 'implementation-artifacts', '5-1-implement-manual-workflow-depth-override.md');

// ============================================================================
// AC1: --depth flag parsing in create-ticket command
// ============================================================================

describe('AC1: --depth Flag Parsing in create-ticket Command', () => {
  // Test 1.1: create-ticket.md should mention --depth flag
  test('[P0] create-ticket.md should mention --depth flag in Input section', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Should mention the depth flag
    expect(content).toMatch(/--depth|depth.*flag/i);
  });

  // Test 1.2: create-ticket.md should accept --depth light
  test('[P0] create-ticket.md should accept --depth light value', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Should mention light value
    expect(content).toMatch(/light/i);
  });

  // Test 1.3: create-ticket.md should accept --depth standard
  test('[P0] create-ticket.md should accept --depth standard value', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Should mention standard value
    expect(content).toMatch(/standard/i);
  });

  // Test 1.4: depth value should be stored in YAML frontmatter
  test('[P0] depth value should be stored in story.md YAML frontmatter', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Should mention storing depth in frontmatter
    expect(content).toMatch(/depth.*frontmatter|frontmatter.*depth|depth.*yaml|yaml.*depth/i);
  });

  // Test 1.5: Default should be standard when no --depth flag provided
  test('[P0] Default depth should be standard when no --depth flag provided', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Should mention default is standard
    expect(content).toMatch(/default.*standard|standard.*default/i);
  });
});

// ============================================================================
// AC1: depth field in Output specification
// ============================================================================

describe('AC1: depth Field in Output Specification', () => {
  // Test 1.6: Output section should include depth field
  test('[P1] Output section should include depth field in frontmatter', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Output section should list depth as a frontmatter field
    const outputMatch = content.match(/## Output[\s\S]*?(?=##|\n---|$)/i);
    expect(outputMatch).not.toBeNull();
    expect(outputMatch![0]).toMatch(/depth/i);
  });

  // Test 1.7: depth field should be documented with possible values
  test('[P1] depth field should be documented with light/standard values', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // depth field with possible values
    expect(content).toMatch(/depth.*light.*standard|depth.*standard.*light/i);
  });
});

// ============================================================================
// AC1: Story file references --depth flag
// ============================================================================

describe('AC1: Story File References --depth Flag', () => {
  // Test 1.8: Story file should mention --depth flag
  test('[P1] Story 5.1 should mention --depth flag', () => {
    const content = readFileSync(STORY_FILE, 'utf8');
    expect(content).toMatch(/--depth|depth.*flag/i);
  });
});
