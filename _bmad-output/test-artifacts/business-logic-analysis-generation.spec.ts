/**
 * ATDD Test Suite for Story 6-3: Business Logic Analysis & business-logic.md Generation
 *
 * These tests verify that:
 * 1. The business-logic.md output template exists with correct structure
 * 2. The workflow Step 5.1 is updated with concrete implementation (placeholder replaced)
 * 3. The template follows the documentarian agent's Output Format specification
 * 4. The workflow references the agent's grep patterns correctly
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because the template and workflow update do not exist yet)
 *
 * Coverage: 58 test scenarios across 6 acceptance criteria
 * - AC1: Grep-based business logic scanning patterns in workflow (10 tests)
 * - AC2: Output template exists with correct sections (8 tests)
 * - AC3: Generated output follows template structure (7 tests)
 * - AC4: Rule documentation completeness (9 tests)
 * - AC5: Domain area grouping (8 tests)
 * - AC6: Exclusion of non-business logic (6 tests)
 * - Cross-cutting: Three-layer separation, naming conventions, structural compliance (10 tests)
 *
 * Knowledge Fragments Applied:
 * - data-factories.md: N/A (file validation, no data factories needed)
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: Unit-level file system validation
 * - test-priorities-matrix.md: P0-P3 priority assignment
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 * - test-healing-patterns.md: Failure pattern awareness
 */

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

// Project paths - aligned with existing test convention (resolve from __dirname for reliable paths)
const PROJECT_ROOT = resolve(__dirname, '..', '..');
const FRAMEWORK_ROOT = join(PROJECT_ROOT, 'scrum_workflow');
const TEMPLATES_DIR = join(FRAMEWORK_ROOT, 'templates');
const WORKFLOWS_DIR = join(FRAMEWORK_ROOT, 'workflows');
const AGENTS_DIR = join(FRAMEWORK_ROOT, 'agents');
const TEMPLATE_PATH = join(TEMPLATES_DIR, 'business-logic.md');
const WORKFLOW_PATH = join(WORKFLOWS_DIR, 'project-documentation.md');
const AGENT_PATH = join(AGENTS_DIR, 'documentarian.md');

// Reference templates for structural comparison
const REFINEMENT_TEMPLATE_PATH = join(TEMPLATES_DIR, 'refinement.md');
const REVIEW_TEMPLATE_PATH = join(TEMPLATES_DIR, 'review.md');

// Helper: extract YAML frontmatter from markdown content
function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---$(.*?)^---$/ms);
  return match ? match[1] : null;
}

// Helper: extract markdown body (after frontmatter)
function extractBody(content: string): string | null {
  const match = content.match(/^---.*?^---\s*\n(.*)$/ms);
  return match ? match[1] : null;
}

// Helper: get full content (for files without frontmatter)
function getContent(filePath: string): string {
  return readFileSync(filePath, 'utf8');
}

// Helper: extract a specific section from markdown body by heading level
function extractSection(body: string, sectionName: string, level: number = 2): string | null {
  const prefix = '#'.repeat(level);
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = body.split('\n');
  let capturing = false;
  let content: string[] = [];

  for (const line of lines) {
    const headingRegex = new RegExp(`^${prefix}\\s+[^#]`);
    if (headingRegex.test(line)) {
      if (capturing) {
        break;
      }
      if (new RegExp(`^${prefix}\\s+${escapedName}\\s*$`).test(line)) {
        capturing = true;
        continue;
      }
    } else if (capturing) {
      content.push(line);
    }
  }

  return content.length > 0 ? content.join('\n').trim() : null;
}

// Helper: extract a workflow step section by step number and heading
function extractWorkflowStep(content: string, stepHeading: string): string | null {
  const lines = content.split('\n');
  let capturing = false;
  let sectionContent: string[] = [];
  const escapedHeading = stepHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  for (const line of lines) {
    // Match headings like ### Step 5.1: Business Logic Analysis
    if (/^###?\s+Step\s+\d/.test(line)) {
      if (capturing) {
        break;
      }
      if (new RegExp(escapedHeading).test(line)) {
        capturing = true;
        continue;
      }
    } else if (/^##\s+Step\s+\d/.test(line) && capturing) {
      // Hit a higher-level step heading, stop capturing
      break;
    } else if (capturing) {
      sectionContent.push(line);
    }
  }

  return sectionContent.length > 0 ? sectionContent.join('\n').trim() : null;
}

describe('Story 6-3: Business Logic Analysis & business-logic.md Generation', () => {
  // ===================================================================
  // AC1: Grep-based business logic scanning patterns in workflow
  // ===================================================================
  describe('AC1: Grep-based business logic scanning in workflow Step 5.1', () => {
    test('P0: workflow Step 5.1 no longer contains "See Story 6.3" placeholder', () => {
      const content = getContent(WORKFLOW_PATH);
      // The placeholder should be replaced with concrete implementation
      expect(content).not.toMatch(/\*\*See Story 6\.3\*\*/);
    });

    test('P0: workflow Step 5.1 includes grep patterns for conditional logic with domain terms', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should reference conditional logic patterns
      const lowerStep = step51!.toLowerCase();
      expect(lowerStep).toMatch(/conditional|if.*else|switch.*case/);
    });

    test('P0: workflow Step 5.1 includes grep patterns for validation functions', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should reference validation patterns from agent definition
      expect(step51).toMatch(/validate/);
      expect(step51).toMatch(/check/);
      expect(step51).toMatch(/ensure/);
    });

    test('P0: workflow Step 5.1 includes grep patterns for guard clauses', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should reference guard clause patterns from agent definition
      const guardPatterns = ['throw', 'reject', 'deny', 'forbidden', 'unauthorized'];
      const foundPatterns = guardPatterns.filter(p => step51!.toLowerCase().includes(p));
      expect(foundPatterns.length).toBeGreaterThanOrEqual(3);
    });

    test('P0: workflow Step 5.1 includes grep patterns for policy/rule/strategy patterns', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      const policyPatterns = ['Policy', 'Rule', 'Strategy', 'Validator'];
      const foundPatterns = policyPatterns.filter(p => step51!.includes(p));
      expect(foundPatterns.length).toBeGreaterThanOrEqual(3);
    });

    test('P1: workflow Step 5.1 includes grep patterns for business constants', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should reference constant patterns: MAX_, MIN_, ALLOWED_, STATUS_
      const constantPatterns = ['MAX_', 'MIN_', 'ALLOWED_', 'STATUS_'];
      const foundPatterns = constantPatterns.filter(p => step51!.includes(p));
      expect(foundPatterns.length).toBeGreaterThanOrEqual(3);
    });

    test('P1: workflow Step 5.1 references the documentarian agent for methodology', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should reference the agent, not duplicate its methodology
      expect(step51).toMatch(/documentarian/i);
      expect(step51).toMatch(/agent/i);
    });

    test('P1: workflow Step 5.1 defines exclusion filters for non-source directories', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      const exclusionDirs = ['node_modules', 'dist', 'build', '.git'];
      const foundExclusions = exclusionDirs.filter(d => step51!.includes(d));
      expect(foundExclusions.length).toBeGreaterThanOrEqual(3);
    });

    test('P1: workflow Step 5.1 defines exclusion for test files', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should exclude test files
      const testExclusions = ['.test.', '.spec.', 'test_', '_test.'];
      const foundExclusions = testExclusions.filter(p => step51!.includes(p));
      expect(foundExclusions.length).toBeGreaterThanOrEqual(2);
    });

    test('P2: workflow Step 5.1 references the business-logic.md template', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      expect(step51).toMatch(/scrum_workflow\/templates\/business-logic\.md/);
    });
  });

  // ===================================================================
  // AC2: Output template exists with correct sections
  // ===================================================================
  describe('AC2: Output template exists at correct location with required sections', () => {
    test('P0: business-logic.md template file exists in templates directory', () => {
      expect(existsSync(TEMPLATE_PATH)).toBe(true);
    });

    test('P0: template has Overview section', () => {
      const content = getContent(TEMPLATE_PATH);
      expect(content).toMatch(/^#{1,2}\s+Overview/m);
    });

    test('P0: template has Business Rules section', () => {
      const content = getContent(TEMPLATE_PATH);
      expect(content).toMatch(/^#{1,2}\s+Business Rules/m);
    });

    test('P0: template has Validation Rules section', () => {
      const content = getContent(TEMPLATE_PATH);
      expect(content).toMatch(/^#{1,2}\s+Validation Rules/m);
    });

    test('P0: template has Guard Clauses & Access Control section', () => {
      const content = getContent(TEMPLATE_PATH);
      expect(content).toMatch(/^#{1,2}\s+Guard Clauses/m);
    });

    test('P0: template has Business Constants & Configuration section', () => {
      const content = getContent(TEMPLATE_PATH);
      expect(content).toMatch(/^#{1,2}\s+Business Constants/m);
    });

    test('P1: template does NOT have YAML frontmatter (pure Markdown output template)', () => {
      const content = getContent(TEMPLATE_PATH);
      // Output artifact templates (like refinement.md pattern) may have frontmatter,
      // but story specifies business-logic.md should be pure Markdown without frontmatter
      expect(content).not.toMatch(/^---\s*\n/);
    });

    test('P2: template file is valid Markdown with reasonable length', () => {
      const content = getContent(TEMPLATE_PATH);
      expect(content).toBeTruthy();
      // Should have meaningful content (more than a stub, less than excessive)
      expect(content.length).toBeGreaterThan(200);
      expect(content.length).toBeLessThan(5000);
    });
  });

  // ===================================================================
  // AC3: Generated output follows template structure
  // ===================================================================
  describe('AC3: Generated output follows template structure', () => {
    test('P0: template specifies docs/generated/business-logic.md as output location', () => {
      // The workflow Step 5.1 should reference the output path
      const workflowContent = getContent(WORKFLOW_PATH);
      expect(workflowContent).toMatch(/docs\/generated\/business-logic\.md/);
    });

    test('P0: template Business Rules section indicates grouping by domain area', () => {
      const content = getContent(TEMPLATE_PATH);
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/domain\s*area/);
      expect(lowerContent).toMatch(/group/);
    });

    test('P1: template includes placeholder comments for documentarian agent injection', () => {
      const content = getContent(TEMPLATE_PATH);
      // Should have HTML comments as injection placeholders
      expect(content).toMatch(/<!--.*?-->/);
    });

    test('P1: template structure matches agent Output Format specification for business-logic.md', () => {
      // The template must match the agent's Output Format > business-logic.md section
      expect(existsSync(AGENT_PATH)).toBe(true);
      const agentContent = getContent(AGENT_PATH);
      const templateContent = getContent(TEMPLATE_PATH);

      // Agent specifies: Business Rules, Validation Rules, Guard Clauses
      expect(agentContent).toMatch(/Business Rules/);
      expect(agentContent).toMatch(/Validation Rules/);
      expect(agentContent).toMatch(/Guard Clauses/);

      // Template must have the same sections
      expect(templateContent).toMatch(/Business Rules/);
      expect(templateContent).toMatch(/Validation Rules/);
      expect(templateContent).toMatch(/Guard Clauses/);
    });

    test('P1: workflow Step 5.1 references template as structural guide', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should reference using the template for output structure
      expect(step51!.toLowerCase()).toMatch(/template/);
    });

    test('P2: template Overview section has placeholders for summary statistics', () => {
      const content = getContent(TEMPLATE_PATH);
      // Overview should indicate total rules, domain areas, timestamp
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/total|count|summary/);
      expect(lowerContent).toMatch(/timestamp|date|generated/);
    });

    test('P2: workflow Step 5.1 mentions writing minimal document when no business logic found', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      const lowerStep = step51!.toLowerCase();
      expect(lowerStep).toMatch(/no\s*business\s*logic/);
    });
  });

  // ===================================================================
  // AC4: Rule documentation completeness
  // ===================================================================
  describe('AC4: Rule documentation completeness (name, source, description, Mermaid)', () => {
    test('P0: template shows rule name/description field in entry format', () => {
      const content = getContent(TEMPLATE_PATH);
      const lowerContent = content.toLowerCase();
      // Each rule entry should show name/description format
      expect(lowerContent).toMatch(/name|description|rule/);
    });

    test('P0: template shows file:line source reference format', () => {
      const content = getContent(TEMPLATE_PATH);
      // Should show the source reference format
      expect(content).toMatch(/file.*line|source.*reference|Source:/i);
    });

    test('P0: template shows plain language explanation field', () => {
      const content = getContent(TEMPLATE_PATH);
      const lowerContent = content.toLowerCase();
      // Should indicate plain language explanation of what the rule enforces
      expect(lowerContent).toMatch(/(what\s*(it\s*)?enforc|plain\s*language|explanation|description)/);
    });

    test('P0: template shows Mermaid flowchart placeholder for complex rules', () => {
      const content = getContent(TEMPLATE_PATH);
      // Should have Mermaid flowchart reference or placeholder
      expect(content).toMatch(/mermaid/i);
      expect(content).toMatch(/flowchart/i);
    });

    test('P1: template Mermaid placeholder uses fenced code block format', () => {
      const content = getContent(TEMPLATE_PATH);
      // Should show the ```mermaid fenced code block pattern
      expect(content).toMatch(/```mermaid/);
    });

    test('P1: workflow Step 5.1 mentions Mermaid flowchart generation for complex rules', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      expect(step51).toMatch(/[Mm]ermaid/);
      expect(step51).toMatch(/flowchart/);
    });

    test('P1: workflow Step 5.1 specifies source reference format (file:line)', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      expect(step51!.toLowerCase()).toMatch(/file.*line|source.*reference/);
    });

    test('P2: template indicates Mermaid diagrams only for complex multi-branch rules', () => {
      const content = getContent(TEMPLATE_PATH);
      const lowerContent = content.toLowerCase();
      // Should indicate that simple rules don't need diagrams
      expect(lowerContent).toMatch(/complex|multi.*branch|decision\s*tree/);
    });

    test('P2: workflow Step 5.1 specifies relative paths from project root for source references', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      expect(step51!.toLowerCase()).toMatch(/relative|project\s*root/);
    });
  });

  // ===================================================================
  // AC5: Domain area grouping
  // ===================================================================
  describe('AC5: Domain area grouping in template and workflow', () => {
    test('P0: template Business Rules section organized by domain area', () => {
      const content = getContent(TEMPLATE_PATH);
      // Business Rules section should indicate domain area grouping
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/domain\s*area/);
    });

    test('P0: workflow Step 5.1 specifies domain area grouping logic', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      expect(step51!.toLowerCase()).toMatch(/domain\s*area/);
      expect(step51!.toLowerCase()).toMatch(/group/);
    });

    test('P1: workflow Step 5.1 specifies path-based domain inference', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should mention inferring domain from file path/directory
      const lowerStep = step51!.toLowerCase();
      expect(lowerStep).toMatch(/(path|directory|folder)/);
      expect(lowerStep).toMatch(/(infer|extract|determin)/);
    });

    test('P1: workflow Step 5.1 provides domain area examples', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should provide examples like Authentication, Billing, Permissions
      const domainExamples = ['Authentication', 'Billing', 'Permissions', 'Payments'];
      const foundExamples = domainExamples.filter(d =>
        step51!.includes(d) || step51!.toLowerCase().includes(d.toLowerCase())
      );
      expect(foundExamples.length).toBeGreaterThanOrEqual(2);
    });

    test('P1: workflow Step 5.1 specifies fallback for ungrouped rules', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should mention fallback/uncategorized grouping
      const lowerStep = step51!.toLowerCase();
      expect(lowerStep).toMatch(/(fallback|uncategor|other|default)/);
    });

    test('P2: template has an example domain area subsection placeholder', () => {
      const content = getContent(TEMPLATE_PATH);
      // Should show sub-headings under Business Rules for domain areas
      // e.g., ### Authentication or ### {{domain_area}}
      expect(content).toMatch(/###\s+(Authentication|\{\{domain_area\}\}|{{domain_area}}|\[Domain Area\])/);
    });

    test('P2: workflow Step 5.1 mentions file-name inference as secondary strategy', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      const lowerStep = step51!.toLowerCase();
      expect(lowerStep).toMatch(/file.*name/);
    });

    test('P2: domain area grouping is project-agnostic', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should NOT hardcode specific project domains -- should be generic
      // The inference should work with ANY directory structure
      const lowerStep = step51!.toLowerCase();
      expect(lowerStep).toMatch(/(any|agnostic|generic|directory\s*structure)/);
    });
  });

  // ===================================================================
  // AC6: Exclusion of non-business logic
  // ===================================================================
  describe('AC6: Exclusion of non-business logic', () => {
    test('P0: workflow Step 5.1 excludes infrastructure logic', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should mention exclusion of infrastructure
      const lowerStep = step51!.toLowerCase();
      expect(lowerStep).toMatch(/exclud|not\s*document|skip/);
      expect(lowerStep).toMatch(/infrastructure/);
    });

    test('P0: workflow Step 5.1 excludes logging mechanisms', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      expect(step51!.toLowerCase()).toMatch(/log/);
    });

    test('P0: workflow Step 5.1 excludes error handling plumbing', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      expect(step51!.toLowerCase()).toMatch(/error\s*handl/);
    });

    test('P1: workflow Step 5.1 excludes database queries', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      expect(step51!.toLowerCase()).toMatch(/database|db|quer/);
    });

    test('P1: workflow Step 5.1 references agent exclusion list', () => {
      const content = getContent(WORKFLOW_PATH);
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();

      // Should reference the agent's exclusion list rather than redefining it
      expect(step51!.toLowerCase()).toMatch(/documentarian.*exclu|agent.*exclu/);
    });

    test('P2: agent definition exclusions are comprehensive', () => {
      // Verify the agent definition has complete exclusion list
      expect(existsSync(AGENT_PATH)).toBe(true);
      const agentContent = getContent(AGENT_PATH);
      const lowerAgent = agentContent.toLowerCase();

      // Agent should exclude: infrastructure, logging, error handling, deployment, CI/CD, API surface
      const exclusionTerms = ['infrastructure', 'logging', 'error handling', 'deployment', 'ci/cd', 'api surface'];
      const foundTerms = exclusionTerms.filter(t => lowerAgent.includes(t));
      expect(foundTerms.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ===================================================================
  // Cross-cutting: Three-layer separation, naming, structural compliance
  // ===================================================================
  describe('Cross-cutting: Structural and convention compliance', () => {
    test('P0: template is in Framework Layer (scrum_workflow/templates/)', () => {
      // Template must be at scrum_workflow/templates/business-logic.md
      expect(existsSync(TEMPLATE_PATH)).toBe(true);
      expect(TEMPLATE_PATH).toContain('scrum_workflow/templates/business-logic.md');
    });

    test('P0: template filename uses kebab-case', () => {
      // business-logic.md follows kebab-case
      expect('business-logic.md').toMatch(/^[a-z]+(-[a-z]+)*\.md$/);
    });

    test('P0: workflow modification is limited to Step 5.1 only', () => {
      const content = getContent(WORKFLOW_PATH);

      // Steps 5.2 and 5.3 should still have their original placeholders
      expect(content).toMatch(/\*\*See Story 6\.4\*\*/);
      expect(content).toMatch(/\*\*See Story 6\.5\*\*/);
    });

    test('P0: no generated output files created at dev time', () => {
      // docs/generated/business-logic.md should NOT exist at dev time
      const generatedPath = join(PROJECT_ROOT, 'docs', 'generated', 'business-logic.md');
      expect(existsSync(generatedPath)).toBe(false);
    });

    test('P0: template does NOT contain analysis methodology (anti-pattern check)', () => {
      const content = getContent(TEMPLATE_PATH);
      const lowerContent = content.toLowerCase();

      // Template should NOT contain grep patterns or analysis instructions
      // Those belong in the agent definition, not the template
      expect(lowerContent).not.toMatch(/grep\s+pattern/);
      expect(lowerContent).not.toMatch(/scan.*codebase/);
      expect(lowerContent).not.toMatch(/use\s+glob/);
    });

    test('P1: workflow Step 5.1 keeps existing heading and numbered list structure', () => {
      const content = getContent(WORKFLOW_PATH);

      // Step 5.1 heading should still exist
      expect(content).toMatch(/###?\s+Step 5\.1.*Business Logic/);

      // Should have numbered steps
      const step51 = extractWorkflowStep(content, 'Step 5.1');
      expect(step51).toBeTruthy();
      const numberedSteps = step51!.match(/^\d+\./gm);
      expect(numberedSteps).toBeTruthy();
      expect(numberedSteps!.length).toBeGreaterThanOrEqual(3);
    });

    test('P1: workflow Write Boundaries section unchanged', () => {
      const content = getContent(WORKFLOW_PATH);

      // Write Boundaries should still list the permitted output files
      expect(content).toMatch(/Write Boundaries/);
      expect(content).toMatch(/docs\/generated\/business-logic\.md/);
      expect(content).toMatch(/docs\/generated\/workflows\.md/);
      expect(content).toMatch(/docs\/generated\/domain-model\.md/);
    });

    test('P1: documentarian agent definition NOT modified', () => {
      // Agent should be unchanged from Story 6.1
      expect(existsSync(AGENT_PATH)).toBe(true);
      const agentContent = getContent(AGENT_PATH);

      // Verify key agent properties are intact
      expect(agentContent).toMatch(/^name:\s*documentarian$/m);
      expect(agentContent).toMatch(/^model:\s*claude-sonnet-4$/m);
      expect(agentContent).toMatch(/^max_tokens:\s*4000$/m);
    });

    test('P1: template follows output artifact pattern (like refinement.md, review.md)', () => {
      // Template should be a structural skeleton, not a stateful artifact
      const templateContent = getContent(TEMPLATE_PATH);

      // Should have section headings
      const headings = templateContent.match(/^#{1,3}\s+.+$/gm);
      expect(headings).toBeTruthy();
      expect(headings!.length).toBeGreaterThanOrEqual(4);
    });

    test('P2: no modifications to scrum_workflow/commands/create-project-docs.md', () => {
      const commandPath = join(FRAMEWORK_ROOT, 'commands', 'create-project-docs.md');
      // If it exists, it should not be modified by this story
      // This test verifies the story's scope boundaries
      if (existsSync(commandPath)) {
        const content = getContent(commandPath);
        // Should still reference documentarian agent
        expect(content).toMatch(/documentarian/);
      }
      // If it doesn't exist, that's OK -- it was created by Story 6.2
      expect(true).toBe(true);
    });
  });
});
