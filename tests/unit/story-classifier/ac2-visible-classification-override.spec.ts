/**
 * ATDD Tests for AC2: Visible Classification and Manual Override
 *
 * TDD Phase: GREEN (tests active — all passing after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.1 - Implement Story Classifier
 *
 * PRD References:
 * - FR-32: Classification by type and risk level
 * - FR-2: Story artifact includes type, risk_level, domain_tags in frontmatter
 *
 * AC2: Given the classification is automatic,
 *      When the developer reviews the created story,
 *      Then the assigned type and risk_level are visible in the frontmatter,
 *      And the developer can override the classification manually
 *       if the system's assessment is incorrect.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CLASSIFIER_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'story-classifier', 'SKILL.md');
const CREATE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');
const STORY_TEMPLATE = join(process.cwd(), 'scrum_workflow', 'templates', 'story.md');

// ============================================================================
// AC2: Type and Risk Level Visible in Story Frontmatter
// ============================================================================

describe('AC2: Classification Results Visible in Story Frontmatter', () => {
  // Test 2.1: Story template already has type field in frontmatter
  test('[P0] Story template should have type field in YAML frontmatter', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    expect(content).toMatch(/type:/);
  });

  // Test 2.2: Story template already has risk_level field in frontmatter
  test('[P0] Story template should have risk_level field in YAML frontmatter', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    expect(content).toMatch(/risk_level:/);
  });

  // Test 2.3: Story template already has domain_tags field in frontmatter
  test('[P0] Story template should have domain_tags field in YAML frontmatter', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    expect(content).toMatch(/domain_tags:/);
  });

  // Test 2.4: create-ticket.md output specification includes type
  test('[P0] create-ticket.md output should specify type is populated by classifier', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // The output section should clearly document the type field comes from classifier
    const outputSection = content.match(/## Output[\s\S]*?(?=##|\n---|$)/i);
    expect(outputSection).not.toBeNull();
    expect(outputSection![0]).toMatch(/type.*classif|type.*inferred|type.*assigned/i);
  });

  // Test 2.5: create-ticket.md output specification includes risk_level
  test('[P0] create-ticket.md output should specify risk_level is populated by classifier', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // The output section should clearly document risk_level comes from classifier
    const outputSection = content.match(/## Output[\s\S]*?(?=##|\n---|$)/i);
    expect(outputSection).not.toBeNull();
    expect(outputSection![0]).toMatch(/risk_level.*classif|risk_level.*assigned/i);
  });

  // Test 2.6: create-ticket.md output should include classification_confidence
  test('[P1] create-ticket.md output should include classification_confidence field', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/classification_confidence/i);
  });
});

// ============================================================================
// AC2: Manual Override Support
// ============================================================================

describe('AC2: Manual Override of Classification', () => {
  // Test 2.7: SKILL.md should document that developers can manually override type
  test('[P0] SKILL.md should document manual override capability for type', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should mention manual override or manual edit capability
    expect(content).toMatch(/manual.*override|manual.*edit|developer.*override|developer.*edit/i);
  });

  // Test 2.8: SKILL.md should document that developers can manually override risk_level
  test('[P0] SKILL.md should document manual override capability for risk_level', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should mention the ability to change risk_level
    expect(content).toMatch(/override.*risk|edit.*risk|change.*risk/i);
  });

  // Test 2.9: Manual override works because YAML frontmatter is directly editable (Markdown-as-Code)
  test('[P1] Story template type field should use placeholder indicating it will be populated', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    // type field exists with a template placeholder — developer can edit it directly
    expect(content).toMatch(/type:\s*"?\{\{/);
  });

  // Test 2.10: Manual override works because risk_level is in editable frontmatter
  test('[P1] Story template risk_level field should use placeholder indicating it will be populated', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    // risk_level field exists with a template placeholder — developer can edit it directly
    expect(content).toMatch(/risk_level:\s*"?\{\{/);
  });

  // Test 2.11: Downstream commands respect frontmatter values regardless of source
  test('[P1] SKILL.md should note downstream commands respect frontmatter values regardless of source', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should indicate that the frontmatter values are authoritative regardless of how they were set
    expect(content).toMatch(/downstream|regardless.*source|frontmatter.*authori|respect.*value/i);
  });
});

// ============================================================================
// AC2: No Duplicate Fields in Template
// ============================================================================

describe('AC2: No Duplicate Type/Risk_Level Fields', () => {
  // Test 2.12: Story template should have exactly one type field
  test('[P0] Story template should have exactly one type field (no duplicates)', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    const typeMatches = content.match(/^type:/gm);
    expect(typeMatches).not.toBeNull();
    expect(typeMatches!.length).toBe(1);
  });

  // Test 2.13: Story template should have exactly one risk_level field
  test('[P0] Story template should have exactly one risk_level field (no duplicates)', () => {
    const content = readFileSync(STORY_TEMPLATE, 'utf8');
    const riskMatches = content.match(/^risk_level:/gm);
    expect(riskMatches).not.toBeNull();
    expect(riskMatches!.length).toBe(1);
  });
});
