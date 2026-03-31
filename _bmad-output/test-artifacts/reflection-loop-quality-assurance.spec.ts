/**
 * ATDD Test Suite for Story 9-5: Reflection Loop for Quality Assurance
 *
 * These tests verify that the researcher agent implements the Reflection Loop pattern
 * for self-critique and iterative improvement with max 2 iterations.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework) + Content Validation
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because reflection loop is not fully implemented yet)
 *
 * Coverage: 39 test scenarios across 7 acceptance criteria
 * - AC1: Reflection step after initial research synthesis (5 tests)
 * - AC2: Five quality checks performed (6 tests)
 * - AC3: Agent critiques own output (5 tests)
 * - AC4: Targeted improvement when threshold not met (6 tests)
 * - AC5: Maximum 2 iterations to prevent infinite loops (5 tests)
 * - AC6: research_confidence field in frontmatter (6 tests)
 * - AC7: Low confidence output includes reasons and suggestions (6 tests)
 *
 * Knowledge Fragments Applied:
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: Unit-level file system and content validation
 * - test-priorities-matrix.md: P0-P3 priority assignment
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 * - data-factories.md: N/A (workflow validation, no data factories needed)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

// Project paths - aligned with existing test convention
const PROJECT_ROOT = resolve(__dirname, '..', '..');
const FRAMEWORK_ROOT = join(PROJECT_ROOT, 'scrum_workflow');
const WORKFLOWS_DIR = join(FRAMEWORK_ROOT, 'workflows');
const AGENTS_DIR = join(FRAMEWORK_ROOT, 'agents');
const TEMPLATES_DIR = join(FRAMEWORK_ROOT, 'templates');
const DOCS_DIR = join(PROJECT_ROOT, 'docs', 'research');

// Files under test
const WORKFLOW_FILE = join(WORKFLOWS_DIR, 'research-technical.md');
const RESEARCHER_AGENT = join(AGENTS_DIR, 'researcher.md');
const TEMPLATE_FILE = join(TEMPLATES_DIR, 'technical-research.md');

// Reference files
const RESEARCH_PATTERNS_FILE = join(DOCS_DIR, 'technical-research-agent-patterns-2026-03-30.md');

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

// Helper: extract a specific section by ## heading from markdown body
function extractSection(body: string, sectionName: string): string | null {
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = body.split('\n');
  let capturing = false;
  let content: string[] = [];

  for (const line of lines) {
    if (/^##\s+[^#]/.test(line)) {
      if (capturing) {
        break;
      }
      if (new RegExp(`^##\\s+${escapedName}\\s*$`).test(line)) {
        capturing = true;
        continue;
      }
    } else if (capturing) {
      content.push(line);
    }
  }

  return capturing ? content.join('\n').trim() : null;
}

// Helper: extract subsection by ### heading within a section
function extractSubsection(section: string, subsectionName: string): string | null {
  const escapedName = subsectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = section.split('\n');
  let capturing = false;
  let content: string[] = [];

  for (const line of lines) {
    if (/^###\s+[^#]/.test(line)) {
      if (capturing) {
        break;
      }
      if (new RegExp(`^###\\s+${escapedName}\\s*$`).test(line)) {
        capturing = true;
        continue;
      }
    } else if (capturing) {
      content.push(line);
    }
  }

  return capturing ? content.join('\n').trim() : null;
}

// Helper: check if frontmatter has a specific field
function frontmatterHasField(frontmatter: string, fieldName: string): boolean {
  const regex = new RegExp(`^${fieldName}\\s*:`, 'm');
  return regex.test(frontmatter);
}

// Helper: get frontmatter field value
function getFrontmatterValue(frontmatter: string, fieldName: string): string | null {
  const regex = new RegExp(`^${fieldName}\\s*:\\s*(.+)$`, 'm');
  const match = frontmatter.match(regex);
  return match ? match[1].trim() : null;
}

describe('Story 9-5: Reflection Loop for Quality Assurance', () => {
  describe('AC1: Reflection Step After Initial Research Synthesis', () => {
    describe('File System Validation', () => {
      it('AC1-001: Workflow file exists', () => {
        expect(existsSync(WORKFLOW_FILE)).toBe(true);
      });

      it('AC1-002: Researcher agent file exists', () => {
        expect(existsSync(RESEARCHER_AGENT)).toBe(true);
      });
    });

    describe('Content Validation', () => {
      let workflowContent: string;
      let workflowBody: string;

      beforeAll(() => {
        workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');
        workflowBody = extractBody(workflowContent) || '';
      });

      it('AC1-003: Workflow contains Phase 5 - Reflection Loop step', () => {
        const reflectionSection = extractSection(workflowBody, 'Step 8: Phase 5 -- Reflection Loop');
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toContain('Reflection Loop');
      });

      it('AC1-004: Reflection step is positioned after Phase 4 (Verification)', () => {
        const verificationIndex = workflowBody.indexOf('## Step 7: Phase 4 -- Verification');
        const reflectionIndex = workflowBody.indexOf('## Step 8: Phase 5 -- Reflection Loop');
        expect(verificationIndex).toBeGreaterThan(-1);
        expect(reflectionIndex).toBeGreaterThan(-1);
        expect(reflectionIndex).toBeGreaterThan(verificationIndex);
      });

      it('AC1-005: Reflection step is positioned before Phase 6 (Synthesis)', () => {
        const reflectionIndex = workflowBody.indexOf('## Step 8: Phase 5 -- Reflection Loop');
        const synthesisIndex = workflowBody.indexOf('## Step 9: Phase 6 -- Synthesis');
        expect(reflectionIndex).toBeGreaterThan(-1);
        expect(synthesisIndex).toBeGreaterThan(-1);
        expect(synthesisIndex).toBeGreaterThan(reflectionIndex);
      });
    });
  });

  describe('AC2: Five Quality Checks Performed', () => {
    describe('Content Validation', () => {
      let workflowContent: string;
      let workflowBody: string;
      let reflectionSection: string | null;

      beforeAll(() => {
        workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');
        workflowBody = extractBody(workflowContent) || '';
        reflectionSection = extractSection(workflowBody, 'Step 8: Phase 5 -- Reflection Loop');
      });

      it('AC2-001: Completeness check evaluates all research aspects covered', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/completeness|coverage/i);
      });

      it('AC2-002: Citation validation verifies all claims properly sourced', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/citation|source|reference/i);
      });

      it('AC2-003: Structure consistency checks output format compliance', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/structure|format|consistency/i);
      });

      it('AC2-004: Clarity assessment evaluates writing quality', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/clarity|writing|readability/i);
      });

      it('AC2-005: Gap identification finds missing information', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/gap|missing|incomplete/i);
      });

      it('AC2-006: Quality criteria are defined for threshold evaluation', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/threshold|quality|criteria/i);
      });
    });
  });

  describe('AC3: Agent Critiques Own Output Against Quality Criteria', () => {
    describe('Content Validation', () => {
      let researcherContent: string;
      let researcherBody: string;

      beforeAll(() => {
        researcherContent = readFileSync(RESEARCHER_AGENT, 'utf8');
        researcherBody = extractBody(researcherContent) || '';
      });

      it('AC3-001: Researcher agent references quality criteria', () => {
        expect(researcherBody).toMatch(/quality|criteria|evaluation/i);
      });

      it('AC3-002: Researcher agent includes self-critique methodology', () => {
        expect(researcherBody).toMatch(/self.?critique|reflection|review/i);
      });

      it('AC3-003: Quality criteria from research patterns document referenced', () => {
        // Check if researcher references the patterns document or reflection pattern
        expect(researcherBody).toMatch(/reflection|iterative|improvement/i);
      });

      it('AC3-004: Evaluation criteria are measurable', () => {
        // Check for measurable criteria (completeness, confidence, etc.)
        expect(researcherBody).toMatch(/completeness|confidence|threshold/i);
      });

      it('AC3-005: Critique process is structured', () => {
        expect(researcherBody).toMatch(/step|phase|process/i);
      });
    });
  });

  describe('AC4: Targeted Improvement When Threshold Not Met', () => {
    describe('Content Validation', () => {
      let workflowContent: string;
      let workflowBody: string;
      let reflectionSection: string | null;

      beforeAll(() => {
        workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');
        workflowBody = extractBody(workflowContent) || '';
        reflectionSection = extractSection(workflowBody, 'Step 8: Phase 5 -- Reflection Loop');
      });

      it('AC4-001: Missing information triggers targeted WebSearch', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/missing|targeted|additional research/i);
      });

      it('AC4-002: Unclear sections flagged for refinement', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/unclear|refine|clarify/i);
      });

      it('AC4-003: Weak claims identified for strengthening', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/weak|strengthen|claim/i);
      });

      it('AC4-004: Additional sources can be added', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/source|additional|more/i);
      });

      it('AC4-005: Improvement actions are documented', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/improvement|action|document/i);
      });

      it('AC4-006: Improvement targets specific gaps not full re-research', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/specific|targeted|gap/i);
      });
    });
  });

  describe('AC5: Maximum 2 Iterations to Prevent Infinite Loops', () => {
    describe('Content Validation', () => {
      let workflowContent: string;
      let workflowBody: string;
      let reflectionSection: string | null;

      beforeAll(() => {
        workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');
        workflowBody = extractBody(workflowContent) || '';
        reflectionSection = extractSection(workflowBody, 'Step 8: Phase 5 -- Reflection Loop');
      });

      it('AC5-001: Loop counter or iteration limit mentioned', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/iteration|loop|max|limit/i);
      });

      it('AC5-002: Maximum 2 iterations specified', () => {
        expect(reflectionSection).not.toBeNull();
        // Check for max 2 iterations (per spec AC5)
        expect(reflectionSection).toMatch(/max.*2|2.*iteration|up to 2/i);
      });

      it('AC5-003: Early exit when quality threshold met', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/early exit|threshold.*met|when.*met/i);
      });

      it('AC5-004: Iteration limit documented', () => {
        expect(reflectionSection).not.toBeNull();
        // Should explicitly state the limit
        expect(reflectionSection).toMatch(/2 iterations|maximum.*iteration|max.*2/i);
      });

      it('AC5-005: No infinite loop possible', () => {
        expect(reflectionSection).not.toBeNull();
        // Should have safeguard against infinite loops
        expect(reflectionSection).toMatch(/prevent|avoid|infinite|stop/i);
      });
    });
  });

  describe('AC6: research_confidence Field in Frontmatter', () => {
    describe('Template Validation', () => {
      let templateContent: string;
      let templateFrontmatter: string | null;

      beforeAll(() => {
        if (existsSync(TEMPLATE_FILE)) {
          templateContent = readFileSync(TEMPLATE_FILE, 'utf8');
          templateFrontmatter = extractFrontmatter(templateContent);
        }
      });

      it('AC6-001: Template file exists', () => {
        expect(existsSync(TEMPLATE_FILE)).toBe(true);
      });

      it('AC6-002: Template has YAML frontmatter', () => {
        expect(templateFrontmatter).not.toBeNull();
      });

      it('AC6-003: Frontmatter includes research_confidence field', () => {
        expect(templateFrontmatter).not.toBeNull();
        expect(frontmatterHasField(templateFrontmatter!, 'research_confidence')).toBe(true);
      });

      it('AC6-004: research_confidence accepts valid values (high/medium/low)', () => {
        expect(templateFrontmatter).not.toBeNull();
        const value = getFrontmatterValue(templateFrontmatter!, 'research_confidence');
        expect(['high', 'medium', 'low', 'high | medium | low']).toContain(
          value?.replace(/['"]/g, '').toLowerCase()
        );
      });

      it('AC6-005: Workflow specifies research_confidence in output schema', () => {
        const workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');
        const synthesisSection = extractSection(extractBody(workflowContent) || '', 'Step 9: Phase 6 -- Synthesis');
        expect(synthesisSection).toMatch(/research_confidence|confidence/i);
      });

      it('AC6-006: Confidence values are documented in workflow', () => {
        const workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');
        expect(workflowContent).toMatch(/high.*medium.*low|confidence.*level/i);
      });
    });
  });

  describe('AC7: Low Confidence Output Includes Reasons and Suggestions', () => {
    describe('Template and Workflow Validation', () => {
      let workflowContent: string;
      let workflowBody: string;
      let reflectionSection: string | null;

      beforeAll(() => {
        workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');
        workflowBody = extractBody(workflowContent) || '';
        reflectionSection = extractSection(workflowBody, 'Step 8: Phase 5 -- Reflection Loop');
      });

      it('AC7-001: Low confidence triggers specific reasons output', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/low.*confidence|reason|why/i);
      });

      it('AC7-002: Reasons for low confidence are documented', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/reason|specific|gap|issue/i);
      });

      it('AC7-003: Suggestions for further research included', () => {
        expect(reflectionSection).not.toBeNull();
        expect(reflectionSection).toMatch(/suggest|further.*research|next.*step|recommend/i);
      });

      it('AC7-004: Template supports low confidence documentation', () => {
        if (existsSync(TEMPLATE_FILE)) {
          const templateContent = readFileSync(TEMPLATE_FILE, 'utf8');
          // Template should have a section for limitations or suggestions
          expect(templateContent).toMatch(/limitation|gap|suggestion|further|recommendation/i);
        }
      });

      it('AC7-005: Workflow specifies low confidence output format', () => {
        const synthesisSection = extractSection(workflowBody, 'Step 9: Phase 6 -- Synthesis');
        expect(synthesisSection).toMatch(/confidence|low|reason|suggest/i);
      });

      it('AC7-006: Quality threshold for high/medium/low defined', () => {
        expect(reflectionSection).not.toBeNull();
        // Should define what constitutes each confidence level
        expect(reflectionSection).toMatch(/high|medium|low|threshold|criteria/i);
      });
    });
  });

  describe('Integration Tests', () => {
    describe('End-to-End Workflow Validation', () => {
      let workflowContent: string;
      let workflowBody: string;

      beforeAll(() => {
        workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');
        workflowBody = extractBody(workflowContent) || '';
      });

      it('INT-001: All six phases are present in correct order', () => {
        const phases = [
          'Step 3: Phase 1',
          'Step 5: Phase 2',
          'Step 6: Phase 3',
          'Step 7: Phase 4',
          'Step 8: Phase 5',
          'Step 9: Phase 6'
        ];

        const indices = phases.map(phase => workflowBody.indexOf(phase));

        // All phases should exist
        indices.forEach(index => {
          expect(index).toBeGreaterThan(-1);
        });

        // Phases should be in order
        for (let i = 0; i < indices.length - 1; i++) {
          expect(indices[i]).toBeLessThan(indices[i + 1]);
        }
      });

      it('INT-002: Reflection Loop references research patterns document', () => {
        const reflectionSection = extractSection(workflowBody, 'Step 8: Phase 5 -- Reflection Loop');
        // Should reference the agentic patterns or research methodology
        expect(reflectionSection).toMatch(/pattern|reflection|methodology|self.?critique/i);
      });

      it('INT-003: Progress tracking includes Phase 5 status', () => {
        // Find progress tracking format in workflow
        expect(workflowBody).toMatch(/\[Phase 5|Phase 5.*\]|Reflection Loop.*Pending|Reflection Loop.*Complete/i);
      });

      it('INT-004: Synthesis step references confidence from reflection', () => {
        const synthesisSection = extractSection(workflowBody, 'Step 9: Phase 6 -- Synthesis');
        expect(synthesisSection).toMatch(/confidence|research_confidence/i);
      });
    });
  });
});
