/**
 * ATDD Test Suite for Story 7-1: architect-doc Agent Definition
 *
 * These tests verify that the architect-doc agent definition file is properly
 * structured in SKILL.md format with correct YAML frontmatter and Markdown body,
 * following the established convention from architect.md, developer.md, and qa.md.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because architect-doc.md does not exist yet)
 *
 * Coverage: 62 test scenarios across 9 acceptance criteria
 * - AC1: Agent file exists at correct location (3 tests)
 * - AC2: YAML frontmatter follows established convention (7 tests)
 * - AC3: Identity section defines agent persona (5 tests)
 * - AC4: Instructions section specifies analysis methodology (8 tests)
 * - AC5: Instructions section includes grep pattern reference (5 tests)
 * - AC6: Output Format section defines five document types (8 tests)
 * - AC7: Context Rules section specifies context loading order (5 tests)
 * - AC8: File follows exact structure convention (7 tests)
 * - AC9: Scope differentiation from documentarian agent (14 tests)
 *
 * Knowledge Fragments Applied:
 * - data-factories.md: N/A (file validation, no data factories needed)
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: Unit-level file system validation
 * - test-priorities-matrix.md: P0-P3 priority assignment
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// Project paths - aligned with existing test convention from agent-definitions-validation.spec.ts
const PROJECT_ROOT = join(__dirname, '..', '..');
const AGENTS_DIR = join(PROJECT_ROOT, 'scrum_workflow', 'agents');
const ARCHITECT_DOC_PATH = join(AGENTS_DIR, 'architect-doc.md');

// Reference agents for structural comparison
const ARCHITECT_PATH = join(PROJECT_ROOT, 'scrum_workflow', 'agents', 'architect.md');
const DOCUMENTARIAN_PATH = join(PROJECT_ROOT, 'scrum_workflow', 'agents', 'documentarian.md');

// Required YAML frontmatter fields in exact order (per SKILL.md convention)
const REQUIRED_FIELDS = ['name', 'display_name', 'role', 'active_in', 'model', 'max_tokens'];

// Required Markdown sections in exact order (per SKILL.md convention)
const REQUIRED_SECTIONS = ['Identity', 'Instructions', 'Output Format', 'Context Rules'];

// Expected frontmatter values from AC2
const EXPECTED_FRONTMATTER = {
  name: 'architect-doc',
  display_name: 'Architecture Documentarian',
  active_in: 'create-architecture-docs',
  model: 'claude-sonnet-4',
  max_tokens: 4000,
};

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

// Helper: extract a specific section from markdown body
function extractSection(body: string, sectionName: string): string | null {
  // Split body by top-level headings (# Heading) and find the matching section
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = body.split('\n');
  let capturing = false;
  let content: string[] = [];

  for (const line of lines) {
    // Check if this is a top-level heading (# but not ## or ###)
    if (/^#\s+[^#]/.test(line)) {
      if (capturing) {
        // We hit the next top-level section, stop capturing
        break;
      }
      if (new RegExp(`^#\\s+${escapedName}\\s*$`).test(line)) {
        capturing = true;
        continue;
      }
    } else if (capturing) {
      content.push(line);
    }
  }

  return content.length > 0 ? content.join('\n').trim() : null;
}

describe('Story 7-1: architect-doc Agent Definition', () => {
  // ===================================================================
  // AC1: Agent file exists at correct location
  // ===================================================================
  describe('AC1: Agent file exists at correct location', () => {
    test('P0: architect-doc.md exists in agents directory', () => {
      expect(existsSync(ARCHITECT_DOC_PATH)).toBe(true);
    });

    test('P0: architect-doc.md is alongside architect.md, developer.md, qa.md, documentarian.md', () => {
      const files = readdirSync(AGENTS_DIR);
      const agentFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');

      expect(agentFiles).toContain('architect-doc.md');
      expect(agentFiles).toContain('architect.md');
      expect(agentFiles).toContain('developer.md');
      expect(agentFiles).toContain('qa.md');
      expect(agentFiles).toContain('documentarian.md');
    });

    test('P2: architect-doc.md uses kebab-case naming convention', () => {
      expect(existsSync(ARCHITECT_DOC_PATH)).toBe(true);
      // Filename itself is kebab-case (lowercase, hyphens, no underscores, no spaces)
      expect('architect-doc.md').toMatch(/^[a-z]+(-[a-z]+)*\.md$/);
    });
  });

  // ===================================================================
  // AC2: YAML frontmatter follows established convention
  // ===================================================================
  describe('AC2: YAML frontmatter follows established convention', () => {
    test('P0: file has valid YAML frontmatter delimiters', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      expect(content).toMatch(/^---\s*\n/); // Starts with YAML delimiter
      expect(content).toMatch(/\n---\s*\n/); // Has closing YAML delimiter
    });

    test('P0: frontmatter contains all required fields', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      REQUIRED_FIELDS.forEach(field => {
        expect(frontmatter).toMatch(new RegExp(`^${field}:`, 'm'));
      });
    });

    test('P0: name field is "architect-doc"', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      expect(content).toMatch(/^name:\s*architect-doc$/m);
    });

    test('P0: display_name field is "Architecture Documentarian"', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      expect(content).toMatch(/^display_name:\s*Architecture Documentarian$/m);
    });

    test('P0: active_in field contains "create-architecture-docs"', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      // YAML array format: active_in:\n  - create-architecture-docs
      expect(content).toMatch(/^active_in:\s*$/m);
      expect(content).toMatch(/^\s*-\s*create-architecture-docs$/m);
    });

    test('P0: model field is "claude-sonnet-4"', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      expect(content).toMatch(/^model:\s*claude-sonnet-4$/m);
    });

    test('P0: max_tokens field is 4000', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      expect(content).toMatch(/^max_tokens:\s*4000$/m);
    });
  });

  // ===================================================================
  // AC3: Identity section defines agent persona
  // ===================================================================
  describe('AC3: Identity section defines agent persona', () => {
    test('P0: Identity section exists', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Identity/m);
    });

    test('P0: Identity describes architecture analysis focus', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      // Should mention architecture/structure focus
      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/architecture/);
    });

    test('P0: Identity mentions Mermaid diagrams', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      expect(identitySection!.toLowerCase()).toMatch(/mermaid/);
    });

    test('P1: Identity mentions codebase reading/analysis', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/(codebas|reading|analyz|scanning)/);
    });

    test('P1: Identity does NOT focus on business logic', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      // Should not be primarily about business logic (that's documentarian's domain)
      // The word "business" should not appear as a primary focus topic
      const businessFocusPattern = /\b(focused?\s+on|specializ\w+\s+in)\b.*\b(business\s*logic|domain)\b/;
      expect(identitySection!.toLowerCase()).not.toMatch(businessFocusPattern);
    });
  });

  // ===================================================================
  // AC4: Instructions section specifies analysis methodology
  // ===================================================================
  describe('AC4: Instructions section specifies analysis methodology', () => {
    test('P0: Instructions section exists', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Instructions/m);
    });

    test('P0: Instructions include numbered methodology steps', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should have numbered steps (1., 2., 3., etc.)
      const numberedSteps = instructionsSection!.match(/^\d+\./gm);
      expect(numberedSteps).toBeTruthy();
      expect(numberedSteps!.length).toBeGreaterThanOrEqual(5);
    });

    test('P0: Instructions mention Glob and Grep for codebase scanning', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      expect(instructionsSection).toMatch(/\bGlob\b/);
      expect(instructionsSection).toMatch(/\bGrep\b/);
    });

    test('P0: Instructions cover backend component identification', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/backend/);
    });

    test('P0: Instructions cover frontend structure identification', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/frontend/);
    });

    test('P0: Instructions cover DevOps infrastructure identification', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/devops/);
    });

    test('P1: Instructions cover local dev environment identification', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/local.*dev/);
    });

    test('P1: Instructions cover testing architecture identification', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/test(ing)?\s*architecture/);
    });
  });

  // ===================================================================
  // AC5: Instructions section includes grep pattern reference
  // ===================================================================
  describe('AC5: Instructions section includes grep pattern reference', () => {
    test('P0: Instructions include grep patterns for backend', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like @Get, @Post, router.get, EventEmitter
      const backendPatterns = ['@Get', '@Post', 'router', 'EventEmitter'];
      const foundPatterns = backendPatterns.filter(pattern =>
        instructionsSection!.includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(2);
    });

    test('P0: Instructions include grep patterns for frontend', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like Component, .tsx, .vue, store, reducer
      const frontendPatterns = ['Component', '.tsx', '.vue', 'store'];
      const foundPatterns = frontendPatterns.filter(pattern =>
        instructionsSection!.includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(2);
    });

    test('P0: Instructions include grep patterns for DevOps', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like Dockerfile, docker-compose, .github/workflows/
      const devopsPatterns = ['Dockerfile', 'docker-compose', '.github/workflows'];
      const foundPatterns = devopsPatterns.filter(pattern =>
        instructionsSection!.includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(2);
    });

    test('P1: Instructions include grep patterns for local dev', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like wiremock, .env, seed, fixtures, factory
      const localDevPatterns = ['wiremock', '.env', 'seed', 'fixtures'];
      const foundPatterns = localDevPatterns.filter(pattern =>
        instructionsSection!.includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(2);
    });

    test('P1: Instructions include grep patterns for testing', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like jest.config, pytest.ini, vitest.config
      const testingPatterns = ['jest.config', 'pytest', 'vitest.config', 'playwright.config'];
      const foundPatterns = testingPatterns.filter(pattern =>
        instructionsSection!.includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ===================================================================
  // AC6: Output Format section defines five document types
  // ===================================================================
  describe('AC6: Output Format section defines five document types', () => {
    test('P0: Output Format section exists', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Output Format/m);
    });

    test('P0: Output Format defines backend-architecture.md document type', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/backend-architecture\.md/);
    });

    test('P0: Output Format defines frontend-architecture.md document type', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/frontend-architecture\.md/);
    });

    test('P0: Output Format defines devops-architecture.md document type', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/devops-architecture\.md/);
    });

    test('P0: Output Format defines local-dev-environment.md document type', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/local-dev-environment\.md/);
    });

    test('P0: Output Format defines testing-architecture.md document type', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/testing-architecture\.md/);
    });

    test('P1: Output Format specifies Mermaid diagram types for each document', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      // Should mention Mermaid diagram types
      const mermaidTypes = ['graph TD', 'flowchart LR', 'sequenceDiagram'];
      const mentionedTypes = mermaidTypes.filter(type =>
        outputSection!.includes(type)
      );
      expect(mentionedTypes.length).toBeGreaterThanOrEqual(2);
    });

    test('P2: Output Format does NOT use the table-based perspective format from architect.md', () => {
      // The architect-doc uses document-template output structures,
      // NOT the Findings/Recommendations/AC table format used by refinement agents
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      // Should NOT have the table structure from architect/developer/qa agents
      expect(outputSection).not.toMatch(/\|\s*#\s*\|\s*Finding\s*\|\s*Severity\s*\|\s*Category\s*\|/);
    });
  });

  // ===================================================================
  // AC7: Context Rules section specifies context loading order
  // ===================================================================
  describe('AC7: Context Rules section specifies context loading order', () => {
    test('P0: Context Rules section exists', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Context Rules/m);
    });

    test('P0: Context Rules list context/index.md', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      expect(contextSection).toMatch(/context\/index\.md/);
    });

    test('P1: Context Rules list relevant domain context files', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      // Should mention domain context files (backend.md, frontend.md, etc.)
      expect(contextSection!.toLowerCase()).toMatch(/context\/(backend|frontend)/);
    });

    test('P1: Context Rules list config.yaml', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      expect(contextSection).toMatch(/config\.yaml/);
    });

    test('P1: Context Rules mention source code discovery via Glob/Grep', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      const lowerContext = contextSection!.toLowerCase();
      expect(lowerContext).toMatch(/(glob|grep)/);
      expect(lowerContext).toMatch(/(source\s*code|discover)/);
    });
  });

  // ===================================================================
  // AC8: File follows exact structure convention
  // ===================================================================
  describe('AC8: File follows exact structure convention', () => {
    test('P0: sections appear in correct order: Identity -> Instructions -> Output Format -> Context Rules', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      const sectionPattern = /^#\s+(.+)$/gm;
      const foundSections: string[] = [];
      let match;

      while ((match = sectionPattern.exec(body!)) !== null) {
        foundSections.push(match[1].trim());
      }

      // Check that required sections appear in order
      let lastIndex = -1;
      REQUIRED_SECTIONS.forEach(section => {
        const index = foundSections.indexOf(section);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeGreaterThan(lastIndex);
        lastIndex = index;
      });
    });

    test('P0: file has exactly four main sections (no extra, no missing)', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Count top-level sections (# headings, not ## or ###)
      const topLevelSections = body!.match(/^#\s+[^#]/gm);
      expect(topLevelSections).toBeTruthy();
      expect(topLevelSections!.length).toBe(4);
    });

    test('P0: all sections have non-empty content', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      REQUIRED_SECTIONS.forEach(section => {
        const sectionContent = extractSection(body!, section);
        expect(sectionContent).toBeTruthy();
        expect(sectionContent!.length).toBeGreaterThan(50); // Meaningful content
      });
    });

    test('P1: frontmatter fields are in correct order matching architect.md convention', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      const lines = frontmatter!
        .split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('-'));

      const foundFields = lines.map(line => line.split(':')[0].trim());
      expect(foundFields).toEqual(REQUIRED_FIELDS);
    });

    test('P1: role field contains concise description focused on architecture documentation', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const roleMatch = content.match(/^role:\s*(.+)$/m);
      expect(roleMatch).toBeTruthy();

      const role = roleMatch![1].trim();
      // Role should be concise (one line)
      expect(role.length).toBeGreaterThan(10);
      expect(role.length).toBeLessThan(200);

      // Role should mention architecture or documentation
      const lowerRole = role.toLowerCase();
      expect(lowerRole).toMatch(/(architecture|documentation|document)/);
    });

    test('P1: structure matches architect.md section convention', () => {
      // Verify the structural pattern matches the reference agent
      const architectContent = readFileSync(ARCHITECT_PATH, 'utf8');
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');

      // Both should have YAML frontmatter
      expect(extractFrontmatter(architectContent)).toBeTruthy();
      expect(extractFrontmatter(architectDocContent)).toBeTruthy();

      // Both should have the same section structure
      const architectBody = extractBody(architectContent)!;
      const architectDocBody = extractBody(architectDocContent)!;

      const architectSections = architectBody.match(/^#\s+(.+)$/gm)!.map(s => s.replace(/^#\s+/, ''));
      const architectDocSections = architectDocBody.match(/^#\s+(.+)$/gm)!.map(s => s.replace(/^#\s+/, ''));

      expect(architectDocSections).toEqual(architectSections);
    });

    test('P2: file content is valid UTF-8 markdown with reasonable length', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      expect(content).toBeTruthy();

      // Should be reasonably sized (more than a stub, less than a novel)
      expect(content.length).toBeGreaterThan(500);
      expect(content.length).toBeLessThan(10000);
    });
  });

  // ===================================================================
  // AC9: Scope differentiation from documentarian agent
  // ===================================================================
  describe('AC9: Scope differentiation from documentarian agent', () => {
    test('P0: architect-doc focuses on structure, documentarian on behavior', () => {
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');

      // architect-doc should mention "structure" more than "business"
      const architectLower = architectDocContent.toLowerCase();
      const structureCount = (architectLower.match(/structure/g) || []).length;
      const businessCount = (architectLower.match(/business/g) || []).length;

      // architect-doc focuses on structure (may mention business only to exclude it)
      expect(structureCount).toBeGreaterThan(0);

      // documentarian should focus on business logic
      const documentarianLower = documentarianContent.toLowerCase();
      const docBusinessCount = (documentarianLower.match(/business/g) || []).length;
      expect(docBusinessCount).toBeGreaterThan(0);
    });

    test('P0: architect-doc outputs different document types than documentarian', () => {
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');

      // architect-doc outputs: backend-architecture, frontend-architecture, devops-architecture, local-dev-environment, testing-architecture
      expect(architectDocContent).toMatch(/backend-architecture\.md/);
      expect(architectDocContent).toMatch(/frontend-architecture\.md/);
      expect(architectDocContent).toMatch(/devops-architecture\.md/);

      // documentarian outputs: business-logic, workflows, domain-model
      expect(documentarianContent).toMatch(/business-logic\.md/);
      expect(documentarianContent).toMatch(/workflows\.md/);
      expect(documentarianContent).toMatch(/domain-model\.md/);

      // architect-doc should NOT output business-logic, workflows, domain-model
      expect(architectDocContent).not.toMatch(/business-logic\.md/);
      expect(architectDocContent).not.toMatch(/workflows\.md/);
      expect(architectDocContent).not.toMatch(/domain-model\.md/);

      // documentarian should NOT output architecture docs
      expect(documentarianContent).not.toMatch(/backend-architecture\.md/);
      expect(documentarianContent).not.toMatch(/devops-architecture\.md/);
    });

    test('P1: architect-doc grep patterns target different dimensions than documentarian', () => {
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');

      // architect-doc grep patterns: backend (@Get, @Post), frontend (Component), DevOps (Dockerfile), testing (jest.config)
      expect(architectDocContent).toMatch(/(@Get|@Post|router\.get)/);
      expect(architectDocContent).toMatch(/Component/);
      expect(architectDocContent).toMatch(/Dockerfile/);
      expect(architectDocContent).toMatch(/jest\.config/);

      // documentarian grep patterns: business rules (validate*, check*), workflows (status, state)
      expect(documentarianContent).toMatch(/validate/);
      expect(documentarianContent).toMatch(/check/);
      expect(documentarianContent).toMatch(/status/);
      expect(documentarianContent).toMatch(/state/);
    });

    test('P2: architect-doc and documentarian have clear boundary statements', () => {
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');

      // Both agents should clarify their scope boundaries
      // architect-doc should clarify it focuses on structure, not business logic
      const architectLower = architectDocContent.toLowerCase();

      // documentarian should clarify it focuses on business logic, not architecture
      const documentarianLower = documentarianContent.toLowerCase();

      // At least one should explicitly mention the boundary
      const hasBoundaryClarification =
        architectLower.includes('not business') ||
        architectLower.includes('separate from') ||
        architectLower.includes('distinct from') ||
        documentarianLower.includes('not architecture') ||
        documentarianLower.includes('separate from') ||
        documentarianLower.includes('distinct from');

      expect(hasBoundaryClarification).toBe(true);
    });

    // Additional tests for AC9 to ensure complete coverage
    test('P1: architect-doc active_in is create-architecture-docs, not create-project-docs', () => {
      const content = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      expect(content).toMatch(/active_in:[\s\S]*create-architecture-docs/);
      expect(content).not.toMatch(/active_in:[\s\S]*create-project-docs/);
    });

    test('P1: documentarian active_in is create-project-docs, not create-architecture-docs', () => {
      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      expect(content).toMatch(/active_in:[\s\S]*create-project-docs/);
      expect(content).not.toMatch(/active_in:[\s\S]*create-architecture-docs/);
    });

    test('P1: architect-doc includes DevOps and testing grep patterns not in documentarian', () => {
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');

      // architect-doc should include DevOps patterns
      expect(architectDocContent).toMatch(/docker-compose/);
      expect(architectDocContent).toMatch(/\.github\/workflows/);

      // documentarian should NOT focus on DevOps patterns
      const docHasDocker = documentarianContent.toLowerCase().includes('docker');
      if (docHasDocker) {
        // If mentioned, it should be minimal (e.g., just as an example)
        const dockerCount = (documentarianContent.match(/docker/gi) || []).length;
        expect(dockerCount).toBeLessThan(3);
      }
    });

    test('P2: architect-doc and documentarian have different output section lengths', () => {
      // architect-doc defines 5 document types, documentarian defines 3
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');

      const architectOutput = extractSection(architectDocContent, 'Output Format');
      const docOutput = extractSection(documentarianContent, 'Output Format');

      expect(architectOutput).toBeTruthy();
      expect(docOutput).toBeTruthy();

      // architect-doc Output Format should be longer (5 docs vs 3)
      expect(architectOutput!.length).toBeGreaterThan(docOutput!.length);
    });

    test('P2: architect-doc Mermaid types emphasize structure diagrams', () => {
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');

      // architect-doc should use graph TD for service/component dependencies
      expect(architectDocContent).toMatch(/graph TD/);

      // Should use flowchart LR for pipelines (CI/CD, middleware)
      expect(architectDocContent).toMatch(/flowchart LR/);
    });

    test('P2: documentarian Mermaid types emphasize behavior diagrams', () => {
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');

      // documentarian should use stateDiagram-v2 for state machines
      expect(documentarianContent).toMatch(/stateDiagram-v2/);

      // Should use classDiagram and erDiagram for domain models
      expect(documentarianContent).toMatch(/classDiagram/);
      expect(documentarianContent).toMatch(/erDiagram/);
    });

    test('P1: architect-doc Identity mentions system structure', () => {
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');
      const identitySection = extractSection(architectDocContent, 'Identity');
      expect(identitySection).toBeTruthy();

      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/system.*structure/);
    });

    test('P1: documentarian Identity mentions business logic or rules', () => {
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const identitySection = extractSection(documentarianContent, 'Identity');
      expect(identitySection).toBeTruthy();

      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/business.*(logic|rule)/);
    });
  });
});
