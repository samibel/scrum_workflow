/**
 * ATDD Test Suite for Story 6-1: Documentarian Agent Definition
 *
 * These tests verify that the Documentarian agent definition file is properly
 * structured in SKILL.md format with correct YAML frontmatter and Markdown body,
 * following the established convention from architect.md, developer.md, and qa.md.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because documentarian.md does not exist yet)
 *
 * Coverage: 48 test scenarios across 8 acceptance criteria
 * - AC1: Agent file exists at correct location (3 tests)
 * - AC2: YAML frontmatter follows established convention (7 tests)
 * - AC3: Identity section defines agent persona (5 tests)
 * - AC4: Instructions section specifies analysis methodology (7 tests)
 * - AC5: Instructions section includes grep pattern reference (6 tests)
 * - AC6: Output Format section defines three document types (8 tests)
 * - AC7: Context Rules section specifies context loading order (5 tests)
 * - AC8: File follows exact structure convention (7 tests)
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
const FRAMEWORK_ROOT = join(process.cwd(), 'scrum_workflow');
const AGENTS_DIR = join(FRAMEWORK_ROOT, 'agents');
const DOCUMENTARIAN_PATH = join(AGENTS_DIR, 'documentarian.md');

// Reference agent for structural comparison
const ARCHITECT_PATH = join(AGENTS_DIR, 'architect.md');

// Required YAML frontmatter fields in exact order (per SKILL.md convention)
const REQUIRED_FIELDS = ['name', 'display_name', 'role', 'active_in', 'model', 'max_tokens'];

// Required Markdown sections in exact order (per SKILL.md convention)
const REQUIRED_SECTIONS = ['Identity', 'Instructions', 'Output Format', 'Context Rules'];

// Expected frontmatter values from AC2
const EXPECTED_FRONTMATTER = {
  name: 'documentarian',
  display_name: 'Documentarian',
  active_in: 'create-project-docs',
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

describe('Story 6-1: Documentarian Agent Definition', () => {
  // ===================================================================
  // AC1: Agent file exists at correct location
  // ===================================================================
  describe('AC1: Agent file exists at correct location', () => {
    test('P0: documentarian.md exists in agents directory', () => {
      expect(existsSync(DOCUMENTARIAN_PATH)).toBe(true);
    });

    test('P0: documentarian.md is alongside architect.md, developer.md, qa.md', () => {
      const files = readdirSync(AGENTS_DIR);
      const agentFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');

      expect(agentFiles).toContain('documentarian.md');
      expect(agentFiles).toContain('architect.md');
      expect(agentFiles).toContain('developer.md');
      expect(agentFiles).toContain('qa.md');
    });

    test('P2: documentarian.md uses kebab-case naming convention', () => {
      expect(existsSync(DOCUMENTARIAN_PATH)).toBe(true);
      // Filename itself is kebab-case (lowercase, no underscores, no spaces)
      expect('documentarian.md').toMatch(/^[a-z]+(-[a-z]+)*\.md$/);
    });
  });

  // ===================================================================
  // AC2: YAML frontmatter follows established convention
  // ===================================================================
  describe('AC2: YAML frontmatter follows established convention', () => {
    test('P0: file has valid YAML frontmatter delimiters', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      expect(content).toMatch(/^---\s*\n/); // Starts with YAML delimiter
      expect(content).toMatch(/\n---\s*\n/); // Has closing YAML delimiter
    });

    test('P0: frontmatter contains all required fields', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      REQUIRED_FIELDS.forEach(field => {
        expect(frontmatter).toMatch(new RegExp(`^${field}:`, 'm'));
      });
    });

    test('P0: name field is "documentarian"', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      expect(content).toMatch(/^name:\s*documentarian$/m);
    });

    test('P0: display_name field is "Documentarian"', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      expect(content).toMatch(/^display_name:\s*Documentarian$/m);
    });

    test('P0: active_in field contains "create-project-docs"', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      // YAML array format: active_in:\n  - create-project-docs
      expect(content).toMatch(/^active_in:\s*$/m);
      expect(content).toMatch(/^\s*-\s*create-project-docs$/m);
    });

    test('P0: model field is "claude-sonnet-4"', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      expect(content).toMatch(/^model:\s*claude-sonnet-4$/m);
    });

    test('P0: max_tokens field is 4000', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      expect(content).toMatch(/^max_tokens:\s*4000$/m);
    });
  });

  // ===================================================================
  // AC3: Identity section defines agent persona
  // ===================================================================
  describe('AC3: Identity section defines agent persona', () => {
    test('P0: Identity section exists', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Identity/m);
    });

    test('P0: Identity describes business logic analysis focus', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      // Should mention business logic/rules focus
      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/business\s*(logic|rules?)/);
    });

    test('P0: Identity mentions Mermaid diagrams', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      expect(identitySection!.toLowerCase()).toMatch(/mermaid/);
    });

    test('P1: Identity mentions codebase reading/analysis', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/(codebas|reading|analyz|scanning)/);
    });

    test('P1: Identity does NOT focus on architecture or infrastructure', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      // Should not be primarily about architecture or infrastructure
      // (minor mentions are OK, but it should not be the focus)
      const lowerIdentity = identitySection!.toLowerCase();
      // The word "architecture" should not appear as a primary focus topic
      const architectureFocusPattern = /\b(focused?\s+on|specializ\w+\s+in)\b.*\b(architecture|infrastructure)\b/;
      expect(lowerIdentity).not.toMatch(architectureFocusPattern);
    });
  });

  // ===================================================================
  // AC4: Instructions section specifies analysis methodology
  // ===================================================================
  describe('AC4: Instructions section specifies analysis methodology', () => {
    test('P0: Instructions section exists', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Instructions/m);
    });

    test('P0: Instructions include numbered methodology steps', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should have numbered steps (1., 2., 3., etc.)
      const numberedSteps = instructionsSection!.match(/^\d+\./gm);
      expect(numberedSteps).toBeTruthy();
      expect(numberedSteps!.length).toBeGreaterThanOrEqual(4);
    });

    test('P0: Instructions mention Glob and Grep for codebase scanning', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      expect(instructionsSection).toMatch(/\bGlob\b/);
      expect(instructionsSection).toMatch(/\bGrep\b/);
    });

    test('P0: Instructions cover business rule identification', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/business\s*rule/);
    });

    test('P0: Instructions cover workflow tracing', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/workflow/);
    });

    test('P1: Instructions cover domain entity extraction', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/domain\s*(entit|model)/);
    });

    test('P1: Instructions mention Mermaid diagram generation with specific types', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should mention specific Mermaid diagram types
      const mermaidTypes = ['flowchart', 'stateDiagram', 'sequenceDiagram', 'classDiagram', 'erDiagram'];
      const mentionedTypes = mermaidTypes.filter(type =>
        instructionsSection!.includes(type)
      );
      expect(mentionedTypes.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ===================================================================
  // AC5: Instructions section includes grep pattern reference
  // ===================================================================
  describe('AC5: Instructions section includes grep pattern reference', () => {
    test('P0: Instructions include grep patterns for business rules', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like validate*, check*, ensure*, *Policy, *Rule
      const businessRulePatterns = ['validate', 'check', 'ensure'];
      const foundPatterns = businessRulePatterns.filter(pattern =>
        instructionsSection!.toLowerCase().includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(2);
    });

    test('P0: Instructions include grep patterns for guard clauses', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like throw, reject, deny, forbidden
      const guardPatterns = ['throw', 'reject', 'deny', 'forbidden'];
      const foundPatterns = guardPatterns.filter(pattern =>
        instructionsSection!.toLowerCase().includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(2);
    });

    test('P0: Instructions include grep patterns for workflows', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like status, state, transition, handle*, emit, dispatch
      const workflowPatterns = ['status', 'state', 'transition'];
      const foundPatterns = workflowPatterns.filter(pattern =>
        instructionsSection!.toLowerCase().includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(2);
    });

    test('P1: Instructions include grep patterns for domain entities', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like class, interface, type, struct, model, schema, entity
      const entityPatterns = ['class', 'interface', 'type', 'model', 'schema'];
      const foundPatterns = entityPatterns.filter(pattern =>
        instructionsSection!.toLowerCase().includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(3);
    });

    test('P1: Instructions include grep patterns for relationships', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should include patterns like hasMany, belongsTo, references, extends, implements
      const relationshipPatterns = ['hasMany', 'belongsTo', 'references', 'extends', 'implements'];
      const foundPatterns = relationshipPatterns.filter(pattern =>
        instructionsSection!.includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(3);
    });

    test('P1: Instructions mention source reference inclusion (file:line)', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should mention file:line references
      expect(instructionsSection!.toLowerCase()).toMatch(/file[:\s]*line/);
    });
  });

  // ===================================================================
  // AC6: Output Format section defines three document types
  // ===================================================================
  describe('AC6: Output Format section defines three document types', () => {
    test('P0: Output Format section exists', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Output Format/m);
    });

    test('P0: Output Format defines business-logic.md document type', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/business-logic\.md/);
    });

    test('P0: Output Format defines workflows.md document type', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/workflows\.md/);
    });

    test('P0: Output Format defines domain-model.md document type', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/domain-model\.md/);
    });

    test('P1: business-logic.md specifies flowchart Mermaid type', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      // flowchart should be mentioned in the context of business-logic.md
      // We check that both business-logic and flowchart are present in the section
      expect(outputSection).toMatch(/business-logic/);
      expect(outputSection).toMatch(/flowchart/);
    });

    test('P1: workflows.md specifies stateDiagram-v2 and sequenceDiagram Mermaid types', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/stateDiagram-v2/);
      expect(outputSection).toMatch(/sequenceDiagram/);
    });

    test('P1: domain-model.md specifies classDiagram and erDiagram Mermaid types', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/classDiagram/);
      expect(outputSection).toMatch(/erDiagram/);
    });

    test('P2: Output Format does NOT use the table-based perspective format from architect.md', () => {

      // The documentarian uses document-template output structures,
      // NOT the Findings/Recommendations/AC table format used by refinement agents
      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
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

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Context Rules/m);
    });

    test('P0: Context Rules list context/index.md', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      expect(contextSection).toMatch(/context\/index\.md/);
    });

    test('P1: Context Rules list relevant domain context files', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      // Should mention domain context files (backend.md, frontend.md, etc.)
      expect(contextSection!.toLowerCase()).toMatch(/context\/(backend|frontend)/);
    });

    test('P1: Context Rules list config.yaml', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      expect(contextSection).toMatch(/config\.yaml/);
    });

    test('P1: Context Rules mention source code discovery via Glob/Grep', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
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

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
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

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Count top-level sections (# headings, not ## or ###)
      const topLevelSections = body!.match(/^#\s+[^#]/gm);
      expect(topLevelSections).toBeTruthy();
      expect(topLevelSections!.length).toBe(4);
    });

    test('P0: all sections have non-empty content', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      REQUIRED_SECTIONS.forEach(section => {
        const sectionContent = extractSection(body!, section);
        expect(sectionContent).toBeTruthy();
        expect(sectionContent!.length).toBeGreaterThan(50); // Meaningful content, not just a placeholder
      });
    });

    test('P1: frontmatter fields are in correct order matching architect.md convention', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      const lines = frontmatter!
        .split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('-'));

      const foundFields = lines.map(line => line.split(':')[0].trim());
      expect(foundFields).toEqual(REQUIRED_FIELDS);
    });

    test('P1: role field contains concise description focused on business logic documentation', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const roleMatch = content.match(/^role:\s*(.+)$/m);
      expect(roleMatch).toBeTruthy();

      const role = roleMatch![1].trim();
      // Role should be concise (one line)
      expect(role.length).toBeGreaterThan(10);
      expect(role.length).toBeLessThan(200);

      // Role should mention business logic or documentation
      const lowerRole = role.toLowerCase();
      expect(lowerRole).toMatch(/(business\s*logic|documentation|document)/);
    });

    test('P1: structure matches architect.md section convention', () => {

      // Verify the structural pattern matches the reference agent
      const architectContent = readFileSync(ARCHITECT_PATH, 'utf8');
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');

      // Both should have YAML frontmatter
      expect(extractFrontmatter(architectContent)).toBeTruthy();
      expect(extractFrontmatter(documentarianContent)).toBeTruthy();

      // Both should have the same section structure
      const architectBody = extractBody(architectContent)!;
      const documentarianBody = extractBody(documentarianContent)!;

      const architectSections = architectBody.match(/^#\s+(.+)$/gm)!.map(s => s.replace(/^#\s+/, ''));
      const documentarianSections = documentarianBody.match(/^#\s+(.+)$/gm)!.map(s => s.replace(/^#\s+/, ''));

      expect(documentarianSections).toEqual(architectSections);
    });

    test('P2: file content is valid UTF-8 markdown with reasonable length', () => {

      const content = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      expect(content).toBeTruthy();

      // Should be reasonably sized (more than a stub, less than a novel)
      expect(content.length).toBeGreaterThan(500);
      expect(content.length).toBeLessThan(10000);
    });
  });
});
