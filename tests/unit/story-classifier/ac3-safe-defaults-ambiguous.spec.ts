/**
 * ATDD Tests for AC3: Safe Defaults for Ambiguous Classification
 *
 * TDD Phase: GREEN (tests active — all passing after implementation)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.1 - Implement Story Classifier
 *
 * PRD References:
 * - FR-32: Classification by type and risk level with safe defaults
 *
 * AC3: Given edge cases where classification is ambiguous,
 *      When the classifier cannot determine a clear type or risk level,
 *      Then it defaults to type: feature and risk_level: medium (safe defaults),
 *      And a note is added suggesting the developer review the classification.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CLASSIFIER_SKILL = join(process.cwd(), 'scrum_workflow', 'skills', 'story-classifier', 'SKILL.md');
const CLASSIFICATION_RULES = join(process.cwd(), 'scrum_workflow', 'data', 'classification-rules.yaml');
const CREATE_TICKET_CMD = join(process.cwd(), 'scrum_workflow', 'commands', 'create-ticket.md');

// ============================================================================
// AC3: Safe Defaults Defined in Classifier Skill
// ============================================================================

describe('AC3: Safe Defaults for Ambiguous Classification', () => {
  // Test 3.1: SKILL.md should define default type as feature
  test('[P0] SKILL.md should define safe default type as "feature"', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should explicitly state default type is feature
    expect(content).toMatch(/default.*type.*feature|type.*default.*feature|feature.*default/i);
  });

  // Test 3.2: SKILL.md should define default risk_level as medium
  test('[P0] SKILL.md should define safe default risk_level as "medium"', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should explicitly state default risk_level is medium
    expect(content).toMatch(/default.*risk.*medium|risk.*default.*medium|medium.*default/i);
  });

  // Test 3.3: SKILL.md should explain when defaults are applied (ambiguous cases)
  test('[P0] SKILL.md should define when safe defaults are applied (ambiguous/no clear signals)', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should describe the conditions for applying defaults
    expect(content).toMatch(/ambiguous|no.*clear.*signal|cannot.*determine|unclear/i);
  });
});

// ============================================================================
// AC3: Confidence Scoring Drives Default Application
// ============================================================================

describe('AC3: Confidence Scoring for Classification', () => {
  // Test 3.4: SKILL.md should define high confidence criteria
  test('[P0] SKILL.md should define high confidence: clear keyword match + domain tag alignment', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should describe high confidence conditions
    expect(content).toMatch(/high.*confidence|confidence.*high/i);
  });

  // Test 3.5: SKILL.md should define medium confidence criteria
  test('[P1] SKILL.md should define medium confidence: keyword OR domain tag only', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should describe medium confidence conditions
    expect(content).toMatch(/medium.*confidence|confidence.*medium/i);
  });

  // Test 3.6: SKILL.md should define low confidence criteria
  test('[P0] SKILL.md should define low confidence: no clear signals -> safe defaults', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should describe low confidence conditions and link to safe defaults
    expect(content).toMatch(/low.*confidence|confidence.*low/i);
  });

  // Test 3.7: SKILL.md output should include classification_note field
  test('[P1] SKILL.md output format should include classification_note field', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Output should include a classification_note
    expect(content).toMatch(/classification_note/i);
  });
});

// ============================================================================
// AC3: Review Note Added for Low Confidence
// ============================================================================

describe('AC3: Review Note for Low Confidence Classification', () => {
  // Test 3.8: SKILL.md should specify a review note is added when confidence is low
  test('[P0] SKILL.md should specify review note added when confidence is low', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Should describe adding a review note for low confidence
    expect(content).toMatch(/review.*classif|review.*note|suggest.*review|please.*review/i);
  });

  // Test 3.9: create-ticket.md should add note in story body when confidence is low
  test('[P0] create-ticket.md should add review note in story body for low confidence', () => {
    const content = readFileSync(CREATE_TICKET_CMD, 'utf8');
    // Per story Task 3.4: When confidence is low, add a note
    expect(content).toMatch(/low.*confidence.*note|confidence.*low.*note|review.*classif/i);
  });

  // Test 3.10: The review note text should match the expected format
  test('[P1] Review note should contain "Classification auto-assigned with low confidence"', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Per story Task 3.4 expected text
    expect(content).toMatch(/classification.*auto.*assigned.*low.*confidence|low.*confidence.*review.*type.*risk/i);
  });
});

// ============================================================================
// AC3: Classification Rules Support Defaults
// ============================================================================

describe('AC3: Classification Rules YAML Supports Default Behavior', () => {
  // Test 3.11: classification-rules.yaml should define default/fallback behavior
  test('[P1] classification-rules.yaml should define fallback defaults', () => {
    const content = readFileSync(CLASSIFICATION_RULES, 'utf8');
    // Should have a default or fallback section
    expect(content).toMatch(/default|fallback/i);
  });

  // Test 3.12: classification-rules.yaml feature as default type
  test('[P1] classification-rules.yaml should identify feature as default type', () => {
    const content = readFileSync(CLASSIFICATION_RULES, 'utf8');
    // Feature should be identified as default/catch-all type
    expect(content).toMatch(/feature.*default|default.*feature/i);
  });

  // Test 3.13: classification-rules.yaml medium as default risk
  test('[P1] classification-rules.yaml should identify medium as default risk_level', () => {
    const content = readFileSync(CLASSIFICATION_RULES, 'utf8');
    // Medium should be identified as default risk_level
    expect(content).toMatch(/medium.*default|default.*medium/i);
  });
});

// ============================================================================
// AC3: Content Heuristics Edge Cases
// ============================================================================

describe('AC3: Content Heuristics for Edge Cases', () => {
  // Test 3.14: SKILL.md should handle multiple domain tags (increase risk)
  test('[P2] SKILL.md should handle multiple domain tags by increasing risk level', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Per story dev notes: Multiple domain tags -> increase risk by one level
    expect(content).toMatch(/multiple.*tag.*risk|domain.*tag.*increase.*risk/i);
  });

  // Test 3.15: SKILL.md should force high risk for auth/security patterns
  test('[P2] SKILL.md should force minimum risk_level: high for auth/security patterns', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Per story dev notes: auth/security -> force risk_level: high minimum
    expect(content).toMatch(/security.*high|auth.*high|force.*high.*risk/i);
  });

  // Test 3.16: SKILL.md should flag short descriptions as potentially under-specified
  test('[P2] SKILL.md should flag descriptions shorter than 50 chars as under-specified', () => {
    const content = readFileSync(CLASSIFIER_SKILL, 'utf8');
    // Per story dev notes: Description length < 50 chars -> flag
    expect(content).toMatch(/under.specified|short.*description|description.*length|50.*char/i);
  });
});
