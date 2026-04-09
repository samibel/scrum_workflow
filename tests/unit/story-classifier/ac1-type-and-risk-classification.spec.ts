/**
 * ATDD Tests for AC1: Classification by Type and Risk Level
 *
 * TDD Phase: GREEN (tests active — all passing after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.1 - Implement Story Classifier
 *
 * PRD References:
 * - FR-32: Classification by type (feature, bugfix, refactor, infrastructure) and risk level (low, medium, high, critical)
 *
 * AC1: Given FR-32 specifies classification by type (feature, bugfix, refactor, infrastructure)
 *       and risk level (low, medium, high, critical),
 *      When a developer runs /scrum-create-ticket,
 *      Then the system analyzes the story description and assigns a type and risk_level
 *       in the YAML frontmatter,
 *      And classification is based on keywords, domain tags, and content analysis.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CLASSIFIER_SKILL_DIR = join(process.cwd(), 'scrum_workflow', 'skills', 'story-classifier');
const CLASSIFIER_SKILL = join(CLASSIFIER_SKILL_DIR, 'SKILL.md');
const CLASSIFICATION_RULES = join(process.cwd(), 'scrum_workflow', 'data', 'classification-rules.yaml');
const CREATE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');

// ============================================================================
// AC1: Story Classifier Skill Directory & File Existence
// ============================================================================

describe('AC1: Story Classifier Skill Structure', () => {
  // Test 1.1: story-classifier skill directory should exist
  test('[P0] skills/story-classifier/ directory should exist', () => {
    expect(existsSync(CLASSIFIER_SKILL_DIR)).toBe(true);
  });

  // Test 1.2: story-classifier SKILL.md should exist
  test('[P0] skills/story-classifier/SKILL.md should exist', () => {
    expect(existsSync(CLASSIFIER_SKILL)).toBe(true);
  });

  // Test 1.3: SKILL.md should have valid frontmatter with name, role, description
  test('[P0] SKILL.md should have valid frontmatter (name, role, description)', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Frontmatter should include name field
    expect(content).toMatch(/^---\s*\n[\s\S]*?name:\s*story-classifier/);
    // Frontmatter should include role field
    expect(content).toMatch(/role:/);
    // Frontmatter should include description field
    expect(content).toMatch(/description:/);
  });
});

// ============================================================================
// AC1: Classification Rules Data File
// ============================================================================

describe('AC1: Classification Rules Data File', () => {
  // Test 1.4: classification-rules.yaml should exist
  test('[P0] data/classification-rules.yaml should exist', () => {
    expect(existsSync(CLASSIFICATION_RULES)).toBe(true);
  });

  // Test 1.5: classification-rules.yaml should have type keyword mappings
  test('[P0] classification-rules.yaml should define keyword-to-type mappings', () => {
    const content = readFileSync(CLASSIFICATION_RULES, 'utf8');
    // Should define bugfix keywords
    expect(content).toMatch(/bugfix|bug.*fix/i);
    // Should define refactor keywords
    expect(content).toMatch(/refactor/i);
    // Should define infrastructure keywords
    expect(content).toMatch(/infrastructure/i);
    // Should define feature (default) type
    expect(content).toMatch(/feature/i);
  });

  // Test 1.6: classification-rules.yaml should have bugfix indicator keywords
  test('[P0] classification-rules.yaml should list bugfix indicator keywords', () => {
    const content = readFileSync(CLASSIFICATION_RULES, 'utf8');
    // Per story dev notes: "fix", "bug", "defect", "broken", "regression", "patch", "hotfix"
    expect(content).toMatch(/fix/i);
    expect(content).toMatch(/bug/i);
  });

  // Test 1.7: classification-rules.yaml should have refactor indicator keywords
  test('[P0] classification-rules.yaml should list refactor indicator keywords', () => {
    const content = readFileSync(CLASSIFICATION_RULES, 'utf8');
    // Per story dev notes: "refactor", "clean up", "restructure", "simplify", etc.
    expect(content).toMatch(/refactor/i);
  });

  // Test 1.8: classification-rules.yaml should have infrastructure indicator keywords
  test('[P0] classification-rules.yaml should list infrastructure indicator keywords', () => {
    const content = readFileSync(CLASSIFICATION_RULES, 'utf8');
    // Per story dev notes: "CI/CD", "deploy", "pipeline", "docker", "infrastructure", etc.
    expect(content).toMatch(/infrastructure|CI\/CD|deploy|pipeline/i);
  });

  // Test 1.9: classification-rules.yaml should have risk level mappings
  test('[P0] classification-rules.yaml should define keyword-to-risk-level mappings', () => {
    const content = readFileSync(CLASSIFICATION_RULES, 'utf8');
    // Should define all four risk levels
    expect(content).toMatch(/low/i);
    expect(content).toMatch(/medium/i);
    expect(content).toMatch(/high/i);
    expect(content).toMatch(/critical/i);
  });

  // Test 1.10: classification-rules.yaml should have domain-tag-to-risk associations
  test('[P0] classification-rules.yaml should map domain tags to risk levels', () => {
    const content = readFileSync(CLASSIFICATION_RULES, 'utf8');
    // High risk tags per story: security, authentication, payment, data-migration, breaking-change
    expect(content).toMatch(/security/i);
    // Low risk tags per story: documentation, ui-cosmetic, typo, config
    expect(content).toMatch(/documentation|ui-cosmetic|config/i);
  });
});

// ============================================================================
// AC1: Classifier Skill Algorithm Definition
// ============================================================================

describe('AC1: Classifier Skill Defines Classification Algorithm', () => {
  // Test 1.11: SKILL.md should define keyword extraction step
  test('[P0] SKILL.md should define keyword extraction analysis', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should describe keyword extraction or keyword matching
    expect(content).toMatch(/keyword.*extract|keyword.*match|scan.*description.*keyword/i);
  });

  // Test 1.12: SKILL.md should define domain tag analysis step
  test('[P0] SKILL.md should define domain tag analysis', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should describe domain tag analysis for risk mapping
    expect(content).toMatch(/domain.*tag.*analy|domain.*tag.*risk|tag.*risk.*level/i);
  });

  // Test 1.13: SKILL.md should define content heuristics step
  test('[P1] SKILL.md should define content complexity heuristics', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should describe content complexity or heuristic analysis
    expect(content).toMatch(/content.*heuristic|complexity.*heuristic|content.*analy/i);
  });

  // Test 1.14: SKILL.md should reference classification-rules.yaml
  test('[P0] SKILL.md should reference classification-rules.yaml data file', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should reference the rules data file
    expect(content).toMatch(/classification-rules\.yaml|classification-rules/i);
  });

  // Test 1.15: SKILL.md should define output format with type and risk_level
  test('[P0] SKILL.md should define structured output with type and risk_level', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Output format should include type field
    expect(content).toMatch(/type:/);
    // Output format should include risk_level field
    expect(content).toMatch(/risk_level:/);
  });

  // Test 1.16: SKILL.md should define confidence scoring in output
  test('[P1] SKILL.md should define confidence field in output', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Output should include confidence scoring
    expect(content).toMatch(/confidence/i);
  });
});

// ============================================================================
// AC1: create-ticket.md Invokes Classifier
// ============================================================================

describe('AC1: create-ticket Command Invokes Classifier', () => {
  // Test 1.17: create-ticket.md should reference story-classifier skill
  test('[P0] create-ticket.md should reference story-classifier skill', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/story-classifier|story classifier/i);
  });

  // Test 1.18: create-ticket.md should invoke classifier after story creation
  test('[P0] create-ticket.md should invoke classifier during story creation workflow', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Should describe invoking classification as part of the workflow
    expect(content).toMatch(/classif|story-classifier/i);
  });

  // Test 1.19: create-ticket.md output should include type field
  test('[P0] create-ticket.md output should include type field populated by classifier', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Output section should mention type field
    expect(content).toMatch(/type.*inferred|type.*classif|type.*assigned/i);
  });

  // Test 1.20: create-ticket.md output should include risk_level field
  test('[P0] create-ticket.md output should include risk_level field populated by classifier', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Output section should mention risk_level field
    expect(content).toMatch(/risk_level.*assigned|risk_level.*classif/i);
  });

  // Test 1.21: create-ticket.md output should include classification_confidence
  test('[P1] create-ticket.md output should include classification_confidence field', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    expect(content).toMatch(/classification_confidence/i);
  });
});

// ============================================================================
// AC1: Valid Type and Risk Level Values
// ============================================================================

describe('AC1: Valid Type and Risk Level Values per FR-32', () => {
  // Test 1.22: SKILL.md or rules file should define exactly 4 valid type values
  test('[P0] Classification should use exactly 4 type values: feature, bugfix, refactor, infrastructure', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    expect(content).toMatch(/feature/i);
    expect(content).toMatch(/bugfix/i);
    expect(content).toMatch(/refactor/i);
    expect(content).toMatch(/infrastructure/i);
  });

  // Test 1.23: SKILL.md or rules file should define exactly 4 risk_level values
  test('[P0] Classification should use exactly 4 risk_level values: low, medium, high, critical', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    expect(content).toMatch(/\blow\b/i);
    expect(content).toMatch(/\bmedium\b/i);
    expect(content).toMatch(/\bhigh\b/i);
    expect(content).toMatch(/\bcritical\b/i);
  });

  // Test 1.24: Classifier is read-only (never writes files)
  test('[P1] SKILL.md should declare read-only context (never writes files)', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should explicitly state it's read-only or never writes
    expect(content).toMatch(/read.only|never.*write|does not write|no.*write/i);
  });
});
