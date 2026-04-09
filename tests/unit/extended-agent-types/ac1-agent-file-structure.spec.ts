/**
 * ATDD Tests for AC1: Agent File Structure and Frontmatter Schema
 *
 * TDD Phase: GREEN (tests active — implementation complete)
 * Test Level: Unit (File Content Verification)
 * Test Framework: Vitest with TypeScript
 * Story: 9.4 - Implement Extended Agent Types
 *
 * PRD References:
 * - FR-35: Extended agent types: Security Reviewer, UX Reviewer, Contract Validator
 * - AD-001: Markdown-as-Code paradigm
 *
 * AC1: Given FR-35 specifies extended agent types: Security Reviewer, UX Reviewer,
 *      Contract Validator,
 *      When the agent definitions are created,
 *      Then three new agent specifications exist in scrum_workflow/agents/:
 *        - security-reviewer.md
 *        - ux-reviewer.md
 *        - contract-validator.md
 *      And each agent file follows the established frontmatter schema
 *        (name, display_name, role, active_in, model, max_tokens) and body structure
 *        (Identity, Instructions, Output Format, Context Rules).
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const AGENTS_DIR = join(process.cwd(), 'scrum_workflow', 'agents');
const SECURITY_REVIEWER = join(AGENTS_DIR, 'security-reviewer.md');
const UX_REVIEWER = join(AGENTS_DIR, 'ux-reviewer.md');
const CONTRACT_VALIDATOR = join(AGENTS_DIR, 'contract-validator.md');

// Reference: existing agent for pattern comparison
const ARCHITECT_AGENT = join(AGENTS_DIR, 'architect.md');

// ============================================================================
// AC1: Agent File Existence
// ============================================================================

describe('AC1: Extended Agent Files Exist', () => {
  // Test 1.1: security-reviewer.md should exist
  test('[P0] security-reviewer.md should exist in scrum_workflow/agents/', () => {
    expect(existsSync(SECURITY_REVIEWER)).toBe(true);
  });

  // Test 1.2: ux-reviewer.md should exist
  test('[P0] ux-reviewer.md should exist in scrum_workflow/agents/', () => {
    expect(existsSync(UX_REVIEWER)).toBe(true);
  });

  // Test 1.3: contract-validator.md should exist
  test('[P0] contract-validator.md should exist in scrum_workflow/agents/', () => {
    expect(existsSync(CONTRACT_VALIDATOR)).toBe(true);
  });
});

// ============================================================================
// AC1: Security Reviewer Frontmatter Schema
// ============================================================================

describe('AC1: Security Reviewer Frontmatter', () => {
  // Test 1.4: security-reviewer.md should have YAML frontmatter with name field
  test('[P0] security-reviewer.md should have frontmatter with name: security-reviewer', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/^---\s*\n[\s\S]*?name:\s*security-reviewer/);
  });

  // Test 1.5: security-reviewer.md should have display_name field
  test('[P0] security-reviewer.md should have display_name: Security Reviewer', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/display_name:\s*Security Reviewer/);
  });

  // Test 1.6: security-reviewer.md should have role field
  test('[P0] security-reviewer.md should have role field describing security focus', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/role:.*security/i);
  });

  // Test 1.7: security-reviewer.md should have active_in including refine-ticket
  test('[P0] security-reviewer.md should have active_in: [refine-ticket]', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/active_in:\s*\n\s*-\s*refine-ticket/);
  });

  // Test 1.8: security-reviewer.md should have model: claude-sonnet-4
  test('[P0] security-reviewer.md should have model: claude-sonnet-4', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/model:\s*claude-sonnet-4/);
  });

  // Test 1.9: security-reviewer.md should have max_tokens: 2000
  test('[P0] security-reviewer.md should have max_tokens: 2000', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/max_tokens:\s*2000/);
  });
});

// ============================================================================
// AC1: UX Reviewer Frontmatter Schema
// ============================================================================

describe('AC1: UX Reviewer Frontmatter', () => {
  // Test 1.10: ux-reviewer.md should have YAML frontmatter with name field
  test('[P0] ux-reviewer.md should have frontmatter with name: ux-reviewer', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).toMatch(/^---\s*\n[\s\S]*?name:\s*ux-reviewer/);
  });

  // Test 1.11: ux-reviewer.md should have display_name field
  test('[P0] ux-reviewer.md should have display_name: UX Reviewer', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).toMatch(/display_name:\s*UX Reviewer/);
  });

  // Test 1.12: ux-reviewer.md should have role field
  test('[P0] ux-reviewer.md should have role field describing UX focus', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).toMatch(/role:.*ux|role:.*usability|role:.*accessibility/i);
  });

  // Test 1.13: ux-reviewer.md should have active_in including refine-ticket
  test('[P0] ux-reviewer.md should have active_in: [refine-ticket]', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).toMatch(/active_in:\s*\n\s*-\s*refine-ticket/);
  });

  // Test 1.14: ux-reviewer.md should have model: claude-sonnet-4
  test('[P0] ux-reviewer.md should have model: claude-sonnet-4', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).toMatch(/model:\s*claude-sonnet-4/);
  });

  // Test 1.15: ux-reviewer.md should have max_tokens: 2000
  test('[P0] ux-reviewer.md should have max_tokens: 2000', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).toMatch(/max_tokens:\s*2000/);
  });
});

// ============================================================================
// AC1: Contract Validator Frontmatter Schema
// ============================================================================

describe('AC1: Contract Validator Frontmatter', () => {
  // Test 1.16: contract-validator.md should have YAML frontmatter with name field
  test('[P0] contract-validator.md should have frontmatter with name: contract-validator', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).toMatch(/^---\s*\n[\s\S]*?name:\s*contract-validator/);
  });

  // Test 1.17: contract-validator.md should have display_name field
  test('[P0] contract-validator.md should have display_name: Contract Validator', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).toMatch(/display_name:\s*Contract Validator/);
  });

  // Test 1.18: contract-validator.md should have role field
  test('[P0] contract-validator.md should have role field describing contract validation focus', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).toMatch(/role:.*contract|role:.*verif|role:.*implementation.*match/i);
  });

  // Test 1.19: contract-validator.md should have active_in including refine-ticket
  test('[P0] contract-validator.md should have active_in: [refine-ticket]', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).toMatch(/active_in:\s*\n\s*-\s*refine-ticket/);
  });

  // Test 1.20: contract-validator.md should have model: claude-sonnet-4
  test('[P0] contract-validator.md should have model: claude-sonnet-4', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).toMatch(/model:\s*claude-sonnet-4/);
  });

  // Test 1.21: contract-validator.md should have max_tokens: 2000
  test('[P0] contract-validator.md should have max_tokens: 2000', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).toMatch(/max_tokens:\s*2000/);
  });
});

// ============================================================================
// AC1: Security Reviewer Body Sections
// ============================================================================

describe('AC1: Security Reviewer Body Sections', () => {
  // Test 1.22: security-reviewer.md should have Identity section
  test('[P0] security-reviewer.md should have # Identity section', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/^# Identity/m);
  });

  // Test 1.23: security-reviewer.md should have Instructions section
  test('[P0] security-reviewer.md should have # Instructions section', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/^# Instructions/m);
  });

  // Test 1.24: security-reviewer.md should have Output Format section
  test('[P0] security-reviewer.md should have # Output Format section', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/^# Output Format/m);
  });

  // Test 1.25: security-reviewer.md should have Context Rules section
  test('[P0] security-reviewer.md should have # Context Rules section', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/^# Context Rules/m);
  });

  // Test 1.26: Identity section should mention security analysis focus
  test('[P1] security-reviewer.md Identity should describe security analysis focus', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    const identitySection = content.split(/^# Instructions/m)[0];
    expect(identitySection).toMatch(/security|vulnerabilit|authentication|data exposure/i);
  });

  // Test 1.27: Instructions should contain numbered analysis checklist
  test('[P1] security-reviewer.md Instructions should have numbered analysis items', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    const instructionsMatch = content.match(/# Instructions[\s\S]*?(?=# Output Format)/);
    expect(instructionsMatch).not.toBeNull();
    const instructions = instructionsMatch![0];
    // Should have numbered items (at least 1-8)
    expect(instructions).toMatch(/1\.\s+\*\*/);
    expect(instructions).toMatch(/8\.\s+\*\*/);
  });

  // Test 1.28: Output Format should have "Security Reviewer Perspective" heading
  test('[P0] security-reviewer.md Output Format should have "Security Reviewer Perspective" heading', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/## Security Reviewer Perspective/);
  });

  // Test 1.29: Output Format should contain Findings table
  test('[P0] security-reviewer.md Output Format should contain Findings table', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/### Findings/);
    expect(content).toMatch(/\|\s*#\s*\|\s*Finding\s*\|\s*Severity\s*\|\s*Category\s*\|/);
  });

  // Test 1.30: Output Format should contain Recommendations section
  test('[P0] security-reviewer.md Output Format should contain Recommendations section', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/### Recommendations/);
  });

  // Test 1.31: Output Format should contain Proposed Acceptance Criteria
  test('[P0] security-reviewer.md Output Format should contain Proposed Acceptance Criteria', () => {
    const content = readFileSync(SECURITY_REVIEWER, 'utf8');
    expect(content).toMatch(/### Proposed Acceptance Criteria/);
  });
});

// ============================================================================
// AC1: UX Reviewer Body Sections
// ============================================================================

describe('AC1: UX Reviewer Body Sections', () => {
  // Test 1.32: ux-reviewer.md should have all 4 required body sections
  test('[P0] ux-reviewer.md should have Identity, Instructions, Output Format, Context Rules sections', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).toMatch(/^# Identity/m);
    expect(content).toMatch(/^# Instructions/m);
    expect(content).toMatch(/^# Output Format/m);
    expect(content).toMatch(/^# Context Rules/m);
  });

  // Test 1.33: Identity should describe UX/usability/accessibility focus
  test('[P1] ux-reviewer.md Identity should describe UX and accessibility focus', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    const identitySection = content.split(/^# Instructions/m)[0];
    expect(identitySection).toMatch(/usability|accessibility|design consistency|user experience/i);
  });

  // Test 1.34: Instructions should reference WCAG and accessibility standards
  test('[P1] ux-reviewer.md Instructions should reference accessibility (WCAG)', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    const instructionsMatch = content.match(/# Instructions[\s\S]*?(?=# Output Format)/);
    expect(instructionsMatch).not.toBeNull();
    expect(instructionsMatch![0]).toMatch(/WCAG|accessibility|contrast.*4\.5|keyboard.*nav|screen.*reader/i);
  });

  // Test 1.35: Output Format should have "UX Reviewer Perspective" heading
  test('[P0] ux-reviewer.md Output Format should have "UX Reviewer Perspective" heading', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).toMatch(/## UX Reviewer Perspective/);
  });

  // Test 1.36: Output Format should contain Findings table, Recommendations, Proposed AC
  test('[P0] ux-reviewer.md Output Format should have Findings, Recommendations, Proposed AC', () => {
    const content = readFileSync(UX_REVIEWER, 'utf8');
    expect(content).toMatch(/### Findings/);
    expect(content).toMatch(/\|\s*#\s*\|\s*Finding\s*\|\s*Severity\s*\|\s*Category\s*\|/);
    expect(content).toMatch(/### Recommendations/);
    expect(content).toMatch(/### Proposed Acceptance Criteria/);
  });
});

// ============================================================================
// AC1: Contract Validator Body Sections
// ============================================================================

describe('AC1: Contract Validator Body Sections', () => {
  // Test 1.37: contract-validator.md should have all 4 required body sections
  test('[P0] contract-validator.md should have Identity, Instructions, Output Format, Context Rules sections', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).toMatch(/^# Identity/m);
    expect(content).toMatch(/^# Instructions/m);
    expect(content).toMatch(/^# Output Format/m);
    expect(content).toMatch(/^# Context Rules/m);
  });

  // Test 1.38: Identity should describe spec compliance / contract validation focus
  test('[P1] contract-validator.md Identity should describe spec-compliance and contract validation', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    const identitySection = content.split(/^# Instructions/m)[0];
    expect(identitySection).toMatch(/contract|spec.*compliance|implementation.*match|verif/i);
  });

  // Test 1.39: Instructions should reference acceptance criteria coverage and API contracts
  test('[P1] contract-validator.md Instructions should reference AC coverage and API contracts', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    const instructionsMatch = content.match(/# Instructions[\s\S]*?(?=# Output Format)/);
    expect(instructionsMatch).not.toBeNull();
    expect(instructionsMatch![0]).toMatch(/acceptance criteria|traceability|api.*contract|schema/i);
  });

  // Test 1.40: Output Format should have "Contract Validator Perspective" heading
  test('[P0] contract-validator.md Output Format should have "Contract Validator Perspective" heading', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).toMatch(/## Contract Validator Perspective/);
  });

  // Test 1.41: Output Format should contain Findings table, Recommendations, Proposed AC
  test('[P0] contract-validator.md Output Format should have Findings, Recommendations, Proposed AC', () => {
    const content = readFileSync(CONTRACT_VALIDATOR, 'utf8');
    expect(content).toMatch(/### Findings/);
    expect(content).toMatch(/\|\s*#\s*\|\s*Finding\s*\|\s*Severity\s*\|\s*Category\s*\|/);
    expect(content).toMatch(/### Recommendations/);
    expect(content).toMatch(/### Proposed Acceptance Criteria/);
  });
});

// ============================================================================
// AC1: Frontmatter Schema Consistency with Existing Agents
// ============================================================================

describe('AC1: Frontmatter Schema Consistency with Existing Agents', () => {
  // Test 1.42: All 3 extended agents should have same frontmatter field set as architect.md
  test('[P1] Extended agents should have same frontmatter fields as existing architect.md', () => {
    const architectContent = readFileSync(ARCHITECT_AGENT, 'utf8');
    const architectFrontmatter = architectContent.match(/^---\s*\n([\s\S]*?)\n---/);
    expect(architectFrontmatter).not.toBeNull();

    // Verify architect has the expected fields (baseline check)
    expect(architectFrontmatter![1]).toMatch(/name:/);
    expect(architectFrontmatter![1]).toMatch(/display_name:/);
    expect(architectFrontmatter![1]).toMatch(/role:/);
    expect(architectFrontmatter![1]).toMatch(/active_in:/);
    expect(architectFrontmatter![1]).toMatch(/model:/);
    expect(architectFrontmatter![1]).toMatch(/max_tokens:/);

    // All 3 extended agents should match the same field set
    for (const agentPath of [SECURITY_REVIEWER, UX_REVIEWER, CONTRACT_VALIDATOR]) {
      const content = readFileSync(agentPath, 'utf8');
      const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/);
      expect(frontmatter).not.toBeNull();
      expect(frontmatter![1]).toMatch(/name:/);
      expect(frontmatter![1]).toMatch(/display_name:/);
      expect(frontmatter![1]).toMatch(/role:/);
      expect(frontmatter![1]).toMatch(/active_in:/);
      expect(frontmatter![1]).toMatch(/model:/);
      expect(frontmatter![1]).toMatch(/max_tokens:/);
    }
  });

  // Test 1.43: All 3 extended agents use same model as existing agents
  test('[P0] All extended agents should use model: claude-sonnet-4 (same as existing agents)', () => {
    for (const agentPath of [SECURITY_REVIEWER, UX_REVIEWER, CONTRACT_VALIDATOR]) {
      const content = readFileSync(agentPath, 'utf8');
      expect(content).toMatch(/model:\s*claude-sonnet-4/);
    }
  });

  // Test 1.44: All 3 extended agents use same max_tokens as existing agents
  test('[P0] All extended agents should use max_tokens: 2000 (same as existing agents)', () => {
    for (const agentPath of [SECURITY_REVIEWER, UX_REVIEWER, CONTRACT_VALIDATOR]) {
      const content = readFileSync(agentPath, 'utf8');
      expect(content).toMatch(/max_tokens:\s*2000/);
    }
  });
});
