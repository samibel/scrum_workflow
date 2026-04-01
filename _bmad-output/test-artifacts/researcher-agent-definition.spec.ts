/**
 * ATDD Test Suite for Story 9-1: researcher Agent Definition
 *
 * These tests verify that the researcher agent definition file is properly
 * structured in SKILL.md format with correct YAML frontmatter and Markdown body,
 * following the established convention from architect.md, developer.md, and qa.md.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because researcher.md does not exist yet)
 *
 * Coverage: 65 test scenarios across 10 acceptance criteria
 * - AC1: Agent file exists at correct location (3 tests)
 * - AC2: YAML frontmatter follows established convention (8 tests)
 * - AC3: Identity section defines agent persona (5 tests)
 * - AC4: Instructions section references research patterns document (4 tests)
 * - AC5: Instructions section specifies WebSearch tool usage (5 tests)
 * - AC6: Instructions section includes four core patterns (8 tests)
 * - AC7: Output Format section defines two output schemas (8 tests)
 * - AC8: Output Format section specifies frontmatter schema (7 tests)
 * - AC9: Context Rules section specifies context loading (5 tests)
 * - AC10: File follows exact structure convention (12 tests)
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
const RESEARCHER_PATH = join(AGENTS_DIR, 'researcher.md');

// Reference agents for structural comparison
const ARCHITECT_PATH = join(PROJECT_ROOT, 'scrum_workflow', 'agents', 'architect.md');
const DOCUMENTARIAN_PATH = join(PROJECT_ROOT, 'scrum_workflow', 'agents', 'documentarian.md');
const ARCHITECT_DOC_PATH = join(PROJECT_ROOT, 'scrum_workflow', 'agents', 'architect-doc.md');

// Required YAML frontmatter fields in exact order (per SKILL.md convention)
const REQUIRED_FIELDS = ['name', 'display_name', 'role', 'active_in', 'model', 'max_tokens'];

// Required Markdown sections in exact order (per SKILL.md convention)
const REQUIRED_SECTIONS = ['Identity', 'Instructions', 'Output Format', 'Context Rules'];

// Expected frontmatter values from AC2
const EXPECTED_FRONTMATTER = {
  name: 'researcher',
  display_name: 'Researcher',
  active_in: ['research-technical', 'research-general'],
  model: 'claude-sonnet-4',
  max_tokens: 4000,
};

// Expected frontmatter schema fields for output (AC8)
const EXPECTED_OUTPUT_FRONTMATTER_FIELDS = [
  'type',
  'topic',
  'date',
  'sources',
  'ai_optimized',
  'version',
  'research_confidence',
];

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

describe('Story 9-1: researcher Agent Definition', () => {
  // ===================================================================
  // AC1: Agent file exists at correct location
  // ===================================================================
  describe('AC1: Agent file exists at correct location', () => {
    test('P0: researcher.md exists in agents directory', () => {
      expect(existsSync(RESEARCHER_PATH)).toBe(true);
    });

    test('P0: researcher.md is alongside architect.md, developer.md, qa.md, documentarian.md, architect-doc.md', () => {
      const files = readdirSync(AGENTS_DIR);
      const agentFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');

      expect(agentFiles).toContain('researcher.md');
      expect(agentFiles).toContain('architect.md');
      expect(agentFiles).toContain('developer.md');
      expect(agentFiles).toContain('qa.md');
      expect(agentFiles).toContain('documentarian.md');
      expect(agentFiles).toContain('architect-doc.md');
    });

    test('P2: researcher.md uses kebab-case naming convention', () => {
      expect(existsSync(RESEARCHER_PATH)).toBe(true);
      // Filename itself is kebab-case (lowercase, hyphens, no underscores, no spaces)
      expect('researcher.md').toMatch(/^[a-z]+(-[a-z]+)*\.md$/);
    });
  });

  // ===================================================================
  // AC2: YAML frontmatter follows established convention
  // ===================================================================
  describe('AC2: YAML frontmatter follows established convention', () => {
    test('P0: file has valid YAML frontmatter delimiters', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      expect(content).toMatch(/^---\s*\n/); // Starts with YAML delimiter
      expect(content).toMatch(/\n---\s*\n/); // Has closing YAML delimiter
    });

    test('P0: frontmatter contains all required fields', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      REQUIRED_FIELDS.forEach(field => {
        expect(frontmatter).toMatch(new RegExp(`^${field}:`, 'm'));
      });
    });

    test('P0: name field is "researcher"', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      expect(content).toMatch(/^name:\s*researcher$/m);
    });

    test('P0: display_name field is "Researcher"', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      expect(content).toMatch(/^display_name:\s*Researcher$/m);
    });

    test('P0: active_in field contains both "research-technical" and "research-general"', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      // YAML array format: active_in:\n  - research-technical\n  - research-general
      expect(content).toMatch(/^active_in:\s*$/m);
      expect(content).toMatch(/^\s*-\s*research-technical$/m);
      expect(content).toMatch(/^\s*-\s*research-general$/m);
    });

    test('P0: model field is "claude-sonnet-4"', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      expect(content).toMatch(/^model:\s*claude-sonnet-4$/m);
    });

    test('P0: max_tokens field is 4000', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      expect(content).toMatch(/^max_tokens:\s*4000$/m);
    });

    test('P0: role field describes technical research specialist', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const roleMatch = content.match(/^role:\s*(.+)$/m);
      expect(roleMatch).toBeTruthy();

      const role = roleMatch![1].trim();
      const lowerRole = role.toLowerCase();
      expect(lowerRole).toMatch(/(research|technical)/);
    });
  });

  // ===================================================================
  // AC3: Identity section defines agent persona
  // ===================================================================
  describe('AC3: Identity section defines agent persona', () => {
    test('P0: Identity section exists', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Identity/m);
    });

    test('P0: Identity describes agent as research analyst', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/research/);
    });

    test('P0: Identity mentions web research capability', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/(web\s*research|online\s*research|internet)/);
    });

    test('P0: Identity mentions agentic patterns', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/agentic\s*pattern/);
    });

    test('P0: Identity mentions AI-optimized documentation generation', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const identitySection = extractSection(body!, 'Identity');
      expect(identitySection).toBeTruthy();

      const lowerIdentity = identitySection!.toLowerCase();
      expect(lowerIdentity).toMatch(/ai.*/);
      expect(lowerIdentity).toMatch(/(document|output)/);
    });
  });

  // ===================================================================
  // AC4: Instructions section references research patterns document
  // ===================================================================
  describe('AC4: Instructions section references research patterns document', () => {
    test('P0: Instructions section exists', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Instructions/m);
    });

    test('P0: Instructions reference the research patterns document path', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Must explicitly reference the patterns document
      expect(instructionsSection).toMatch(/docs\/research\/technical-research-agent-patterns-2026-03-30\.md/);
    });

    test('P1: Instructions reference the document for implementation guidance', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/(implementation\s*guidance|pattern|reference)/);
    });

    test('P1: Instructions reference the document for pattern definitions', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/(pattern|agentic)/);
    });
  });

  // ===================================================================
  // AC5: Instructions section specifies WebSearch tool usage
  // ===================================================================
  describe('AC5: Instructions section specifies WebSearch tool usage', () => {
    test('P0: Instructions mention WebSearch tool', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      expect(instructionsSection).toMatch(/WebSearch/);
    });

    test('P0: Instructions specify WebSearch for online research', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/(online|web|internet)/);
      expect(lowerInstructions).toMatch(/research/);
    });

    test('P0: Instructions support both technical and general research modes', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/technical/);
      expect(lowerInstructions).toMatch(/general/);
    });

    test('P1: Instructions do NOT mention Glob or Grep as primary tools', () => {
      // Researcher uses WebSearch for EXTERNAL research, not Glob/Grep for LOCAL analysis
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // WebSearch should be the PRIMARY tool, not Glob/Grep
      const webSearchCount = (instructionsSection!.match(/WebSearch/g) || []).length;
      const globCount = (instructionsSection!.match(/\bGlob\b/g) || []).length;
      const grepCount = (instructionsSection!.match(/\bGrep\b/g) || []).length;

      // WebSearch should appear more prominently than Glob/Grep
      expect(webSearchCount).toBeGreaterThan(0);
      expect(webSearchCount).toBeGreaterThan(globCount);
      expect(webSearchCount).toBeGreaterThan(grepCount);
    });

    test('P2: Instructions differentiate from documentarian/architect-doc tools', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should explicitly mention external research vs. local code scanning
      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/(external|online|web)/);
    });
  });

  // ===================================================================
  // AC6: Instructions section includes four core patterns
  // ===================================================================
  describe('AC6: Instructions section includes four core patterns', () => {
    test('P0: Instructions include Plan-Then-Execute pattern', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/plan.*/);
      expect(lowerInstructions).toMatch(/execute/);
    });

    test('P0: Instructions include Swarm Migration pattern', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/swarm/);
    });

    test('P0: Instructions include Reflection Loop pattern', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/reflection/);
    });

    test('P0: Instructions include Filesystem-Based State pattern', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/(filesystem|state|checkpoint)/);
    });

    test('P0: Plan-Then-Execute pattern describes workflow structure', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should describe separation of planning from execution
      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/(scope|planning|workflow|phase)/);
    });

    test('P0: Swarm Migration pattern describes parallel subagent research', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should describe parallel execution with subagents
      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/(parallel|subagent)/);
    });

    test('P1: Reflection Loop pattern describes quality assurance', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should describe quality assurance / self-critique
      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/(quality|critique|review|self)/);
    });

    test('P1: Filesystem-Based State pattern describes checkpoint recovery', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const instructionsSection = extractSection(body!, 'Instructions');
      expect(instructionsSection).toBeTruthy();

      // Should describe checkpoint/recovery mechanism
      const lowerInstructions = instructionsSection!.toLowerCase();
      expect(lowerInstructions).toMatch(/(checkpoint|recovery|persist|state)/);
    });
  });

  // ===================================================================
  // AC7: Output Format section defines two output schemas
  // ===================================================================
  describe('AC7: Output Format section defines two output schemas', () => {
    test('P0: Output Format section exists', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Output Format/m);
    });

    test('P0: Output Format defines technical_research output schema', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/technical_research/);
    });

    test('P0: Output Format defines general_research output schema', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/general_research/);
    });

    test('P0: technical_research schema includes code patterns/API references', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      const lowerOutput = outputSection!.toLowerCase();
      // Should mention technical content types
      expect(lowerOutput).toMatch(/(code\s*pattern|api|architecture\s*diagram|technical\s*landscape)/);
    });

    test('P0: general_research schema includes executive summary/market analysis', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      const lowerOutput = outputSection!.toLowerCase();
      expect(lowerOutput).toMatch(/executive\s*summary/);
      expect(lowerOutput).toMatch(/market\s*analysis/);
    });

    test('P0: general_research schema includes strategic recommendations', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      const lowerOutput = outputSection!.toLowerCase();
      expect(lowerOutput).toMatch(/strategic\s*recommendation/);
    });

    test('P1: Output Format does NOT use the table-based perspective format', () => {
      // The researcher generates full research documents with structured frontmatter,
      // NOT the Findings/Recommendations/AC table format used by refinement agents
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      // Should NOT have the table structure from architect/developer/qa agents
      expect(outputSection).not.toMatch(/\|\s*#\s*\|\s*Finding\s*\|\s*Severity\s*\|\s*Category\s*\|/);
    });

    test('P1: Output Format specifies Mermaid diagrams where applicable', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      // Per dev notes, should include Mermaid diagrams for research workflow
      const lowerOutput = outputSection!.toLowerCase();
      expect(lowerOutput).toMatch(/mermaid/);
    });
  });

  // ===================================================================
  // AC8: Output Format section specifies frontmatter schema
  // ===================================================================
  describe('AC8: Output Format section specifies frontmatter schema', () => {
    test('P0: Output Format specifies "type" field', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      // Should define type field in frontmatter schema
      expect(outputSection).toMatch(/\btype\b/);
    });

    test('P0: Output Format specifies "topic" field', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/\btopic\b/);
    });

    test('P0: Output Format specifies "date" field', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/\bdate\b/);
    });

    test('P0: Output Format specifies "sources" field', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/\bsources\b/);
    });

    test('P0: Output Format specifies "ai_optimized: true" field', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/ai_optimized.*true/);
    });

    test('P0: Output Format specifies "version: 1.0" field', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/version.*1\.0/);
    });

    test('P0: Output Format specifies "research_confidence" field', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const outputSection = extractSection(body!, 'Output Format');
      expect(outputSection).toBeTruthy();

      expect(outputSection).toMatch(/research_confidence/);
    });
  });

  // ===================================================================
  // AC9: Context Rules section specifies context loading
  // ===================================================================
  describe('AC9: Context Rules section specifies context loading', () => {
    test('P0: Context Rules section exists', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##?\s*Context Rules/m);
    });

    test('P0: Context Rules specify loading context/index.md', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      expect(contextSection).toMatch(/context\/index\.md/);
    });

    test('P1: Context Rules mention understanding project context before research', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      const lowerContext = contextSection!.toLowerCase();
      expect(lowerContext).toMatch(/(project\s*context|understand)/);
    });

    test('P1: Context Rules specify loading order', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      // Should have numbered items or ordered list for loading priority
      const numberedItems = contextSection!.match(/^\d+\./gm);
      expect(numberedItems).toBeTruthy();
      expect(numberedItems!.length).toBeGreaterThanOrEqual(1);
    });

    test('P2: Context Rules mention the research patterns document', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      const contextSection = extractSection(body!, 'Context Rules');
      expect(contextSection).toBeTruthy();

      // Should reference the research patterns doc for context
      expect(contextSection).toMatch(/technical-research-agent-patterns|research.*pattern/i);
    });
  });

  // ===================================================================
  // AC10: File follows exact structure convention
  // ===================================================================
  describe('AC10: File follows exact structure convention', () => {
    test('P0: sections appear in correct order: Identity -> Instructions -> Output Format -> Context Rules', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
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
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Count top-level sections (# headings, not ## or ###)
      const topLevelSections = body!.match(/^#\s+[^#]/gm);
      expect(topLevelSections).toBeTruthy();
      expect(topLevelSections!.length).toBe(4);
    });

    test('P0: all sections have non-empty content', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      REQUIRED_SECTIONS.forEach(section => {
        const sectionContent = extractSection(body!, section);
        expect(sectionContent).toBeTruthy();
        expect(sectionContent!.length).toBeGreaterThan(50); // Meaningful content
      });
    });

    test('P0: frontmatter fields are in correct order matching architect.md convention', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      const lines = frontmatter!
        .split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('-'));

      const foundFields = lines.map(line => line.split(':')[0].trim());
      expect(foundFields).toEqual(REQUIRED_FIELDS);
    });

    test('P1: structure matches architect.md section convention', () => {
      // Verify the structural pattern matches the reference agent
      const architectContent = readFileSync(ARCHITECT_PATH, 'utf8');
      const researcherContent = readFileSync(RESEARCHER_PATH, 'utf8');

      // Both should have YAML frontmatter
      expect(extractFrontmatter(architectContent)).toBeTruthy();
      expect(extractFrontmatter(researcherContent)).toBeTruthy();

      // Both should have the same section structure
      const architectBody = extractBody(architectContent)!;
      const researcherBody = extractBody(researcherContent)!;

      const architectSections = architectBody.match(/^#\s+(.+)$/gm)!.map(s => s.replace(/^#\s+/, ''));
      const researcherSections = researcherBody.match(/^#\s+(.+)$/gm)!.map(s => s.replace(/^#\s+/, ''));

      expect(researcherSections).toEqual(architectSections);
    });

    test('P1: role field contains concise description', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const roleMatch = content.match(/^role:\s*(.+)$/m);
      expect(roleMatch).toBeTruthy();

      const role = roleMatch![1].trim();
      // Role should be concise (one line)
      expect(role.length).toBeGreaterThan(10);
      expect(role.length).toBeLessThan(200);

      // Role should mention research focus
      const lowerRole = role.toLowerCase();
      expect(lowerRole).toMatch(/(research|technical)/);
    });

    test('P0: active_in has exactly two values (research-technical, research-general)', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      // Extract active_in values
      const activeInMatch = frontmatter!.match(/active_in:\s*\n((\s+-\s+.+\n?)+)/);
      expect(activeInMatch).toBeTruthy();

      const activeInValues = activeInMatch![1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('- '))
        .map(line => line.replace(/^-\s*/, ''));

      expect(activeInValues.length).toBe(2);
      expect(activeInValues).toContain('research-technical');
      expect(activeInValues).toContain('research-general');
    });

    test('P2: file content is valid UTF-8 markdown with reasonable length', () => {
      const content = readFileSync(RESEARCHER_PATH, 'utf8');
      expect(content).toBeTruthy();

      // Should be reasonably sized (more than a stub, less than a novel)
      expect(content.length).toBeGreaterThan(500);
      expect(content.length).toBeLessThan(15000);
    });

    test('P1: researcher agent differentiates from documentarian by tool usage', () => {
      const researcherContent = readFileSync(RESEARCHER_PATH, 'utf8');
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');

      // Researcher should mention WebSearch (external research)
      expect(researcherContent).toMatch(/WebSearch/);

      // Documentarian should mention Glob/Grep (local code scanning)
      expect(documentarianContent).toMatch(/\bGlob\b/);
      expect(documentarianContent).toMatch(/\bGrep\b/);
    });

    test('P1: researcher agent differentiates from architect-doc by tool usage', () => {
      const researcherContent = readFileSync(RESEARCHER_PATH, 'utf8');
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');

      // Researcher should mention WebSearch (external research)
      expect(researcherContent).toMatch(/WebSearch/);

      // architect-doc should mention Glob/Grep (local code scanning)
      expect(architectDocContent).toMatch(/\bGlob\b/);
      expect(architectDocContent).toMatch(/\bGrep\b/);
    });

    test('P1: researcher output types differ from documentarian/architect-doc output types', () => {
      const researcherContent = readFileSync(RESEARCHER_PATH, 'utf8');
      const documentarianContent = readFileSync(DOCUMENTARIAN_PATH, 'utf8');
      const architectDocContent = readFileSync(ARCHITECT_DOC_PATH, 'utf8');

      // Researcher outputs: technical_research, general_research
      expect(researcherContent).toMatch(/technical_research/);
      expect(researcherContent).toMatch(/general_research/);

      // Researcher should NOT output documentarian types
      expect(researcherContent).not.toMatch(/business-logic\.md/);
      expect(researcherContent).not.toMatch(/workflows\.md/);
      expect(researcherContent).not.toMatch(/domain-model\.md/);

      // Researcher should NOT output architect-doc types
      expect(researcherContent).not.toMatch(/backend-architecture\.md/);
      expect(researcherContent).not.toMatch(/frontend-architecture\.md/);
      expect(researcherContent).not.toMatch(/devops-architecture\.md/);

      // Documentarian should NOT output research types
      expect(documentarianContent).not.toMatch(/technical_research/);
      expect(documentarianContent).not.toMatch(/general_research/);
    });
  });
});
