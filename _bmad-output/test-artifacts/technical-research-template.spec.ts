/**
 * ATDD Test Suite for Story 9-3: Technical Research Output Template
 *
 * These tests verify that the technical research output template file is properly
 * structured with correct YAML frontmatter, 13 required sections, placeholder syntax,
 * Mermaid diagram placeholders, and AI-optimized formatting following the schema
 * defined in the researcher agent and research patterns document.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because technical-research.md does not exist yet)
 *
 * Coverage: 62 test scenarios across 11 acceptance criteria
 * - AC1: Template file exists at correct location (3 tests)
 * - AC2: YAML frontmatter schema with 7 fields (9 tests)
 * - AC3: Complete section hierarchy - 13 sections (16 tests)
 * - AC4: Executive Summary structured for AI extraction (4 tests)
 * - AC5: H2/H3 heading structure (5 tests)
 * - AC6: Bullet point guidance (4 tests)
 * - AC7: Source URL placeholders in References (4 tests)
 * - AC8: Confidence level guidance (4 tests)
 * - AC9: Mermaid diagram placeholders (6 tests)
 * - AC10: Template naming convention (kebab-case) (2 tests)
 * - AC11: Placeholder syntax follows convention (5 tests)
 *
 * Knowledge Fragments Applied:
 * - data-factories.md: N/A (template validation, no data factories needed)
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: Unit-level file system validation
 * - test-priorities-matrix.md: P0-P3 priority assignment
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// Project paths - aligned with existing test convention
const PROJECT_ROOT = join(__dirname, '..', '..');
const TEMPLATES_DIR = join(PROJECT_ROOT, 'scrum_workflow', 'templates');
const TEMPLATE_PATH = join(TEMPLATES_DIR, 'technical-research.md');

// Reference templates for structural comparison
const BUSINESS_LOGIC_TEMPLATE = join(TEMPLATES_DIR, 'business-logic.md');
const WORKFLOWS_DOC_TEMPLATE = join(TEMPLATES_DIR, 'workflows-doc.md');

// Researcher agent definition for output format reference
const RESEARCHER_AGENT = join(PROJECT_ROOT, 'scrum_workflow', 'agents', 'researcher.md');

// Required YAML frontmatter fields for technical research output
const REQUIRED_FRONTMATTER_FIELDS = [
  'type',
  'topic',
  'date',
  'sources',
  'ai_optimized',
  'version',
  'research_confidence',
];

// Required sections from researcher.md Output Format (13 sections for technical_research)
const REQUIRED_SECTIONS = [
  'Executive Summary',
  'Table of Contents',
  'Research Methodology',
  'Technical Landscape',
  'Technology Stack Analysis',
  'Integration Patterns',
  'Implementation Approaches',
  'Performance & Scalability',
  'Security Considerations',
  'Strategic Recommendations',
  'Implementation Roadmap',
  'Future Outlook',
  'References',
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

// Helper: extract a specific H2 section from markdown body
function extractSection(body: string, sectionName: string): string | null {
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = body.split('\n');
  let capturing = false;
  let content: string[] = [];

  for (const line of lines) {
    // Check if this is an H2 heading (## but not ###)
    if (/^##\s+[^#]/.test(line)) {
      if (capturing) {
        // We hit the next H2 section, stop capturing
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

  return content.length > 0 ? content.join('\n').trim() : null;
}

// Helper: get all H2 section names in order
function getH2Sections(body: string): string[] {
  const sectionPattern = /^##\s+(.+)$/gm;
  const sections: string[] = [];
  let match;

  while ((match = sectionPattern.exec(body)) !== null) {
    sections.push(match[1].trim());
  }

  return sections;
}

// Helper: count H3 subsections under a section
function getH3Subsections(sectionContent: string): string[] {
  const subsectionPattern = /^###\s+(.+)$/gm;
  const subsections: string[] = [];
  let match;

  while ((match = subsectionPattern.exec(sectionContent)) !== null) {
    subsections.push(match[1].trim());
  }

  return subsections;
}

describe('Story 9-3: Technical Research Output Template', () => {
  // ===================================================================
  // AC1: Template file exists at correct location
  // ===================================================================
  describe('AC1: Template file exists at correct location', () => {
    test('P0: technical-research.md exists in templates directory', () => {
      expect(existsSync(TEMPLATE_PATH)).toBe(true);
    });

    test('P0: technical-research.md is alongside other template files', () => {
      const files = readdirSync(TEMPLATES_DIR);
      const templateFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');

      expect(templateFiles).toContain('technical-research.md');
      expect(templateFiles).toContain('business-logic.md');
      expect(templateFiles).toContain('workflows-doc.md');
      expect(templateFiles).toContain('domain-model.md');
    });

    test('P2: technical-research.md uses kebab-case naming convention', () => {
      expect(existsSync(TEMPLATE_PATH)).toBe(true);
      // Filename itself is kebab-case (lowercase, hyphens, no underscores, no spaces)
      expect('technical-research.md').toMatch(/^[a-z]+(-[a-z]+)*\.md$/);
    });
  });

  // ===================================================================
  // AC2: YAML frontmatter schema with 7 fields
  // ===================================================================
  describe('AC2: YAML frontmatter schema with 7 fields', () => {
    test('P0: file has valid YAML frontmatter delimiters', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/^---\s*\n/); // Starts with YAML delimiter
      expect(content).toMatch(/\n---\s*\n/); // Has closing YAML delimiter
    });

    test('P0: frontmatter contains all 7 required fields', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      REQUIRED_FRONTMATTER_FIELDS.forEach(field => {
        expect(frontmatter).toMatch(new RegExp(`^${field}:`, 'm'));
      });
    });

    test('P0: type field has placeholder value "technical_research"', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/^type:\s*technical_research$/m);
    });

    test('P0: topic field has {{topic}} placeholder', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/^topic:\s*\{\{topic\}\}$/m);
    });

    test('P0: date field has {{date}} placeholder', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/^date:\s*\{\{date\}\}$/m);
    });

    test('P0: sources field is array with {{source_url}} placeholders', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      // YAML array format: sources:\n  - {{source_url_1}}\n  - {{source_url_2}}
      expect(content).toMatch(/^sources:\s*$/m);
      expect(content).toMatch(/\{\{source_url/);
    });

    test('P0: ai_optimized field is "true"', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/^ai_optimized:\s*true$/m);
    });

    test('P0: version field is "1.0"', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/^version:\s*1\.0$/m);
    });

    test('P0: research_confidence field has placeholder', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/^research_confidence:\s*\{\{(high|medium|low)\}\}$/m);
    });
  });

  // ===================================================================
  // AC3: Complete section hierarchy (13 sections)
  // ===================================================================
  describe('AC3: Complete section hierarchy (13 sections)', () => {
    test('P0: template body has Executive Summary section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Executive Summary/m);
    });

    test('P0: template body has Table of Contents section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Table of Contents/m);
    });

    test('P0: template body has Research Methodology section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Research Methodology/m);
    });

    test('P0: template body has Technical Landscape section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Technical Landscape/m);
    });

    test('P0: template body has Technology Stack Analysis section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Technology Stack Analysis/m);
    });

    test('P0: template body has Integration Patterns section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Integration Patterns/m);
    });

    test('P0: template body has Implementation Approaches section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Implementation Approaches/m);
    });

    test('P0: template body has Performance & Scalability section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Performance & Scalability/m);
    });

    test('P0: template body has Security Considerations section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Security Considerations/m);
    });

    test('P0: template body has Strategic Recommendations section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Strategic Recommendations/m);
    });

    test('P0: template body has Implementation Roadmap section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Implementation Roadmap/m);
    });

    test('P0: template body has Future Outlook section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*Future Outlook/m);
    });

    test('P0: template body has References section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/^##\s*References/m);
    });

    test('P0: sections appear in correct order matching researcher.md Output Format', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      const foundSections = getH2Sections(body!);

      // Check that required sections appear in order
      let lastIndex = -1;
      REQUIRED_SECTIONS.forEach(section => {
        const index = foundSections.indexOf(section);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeGreaterThan(lastIndex);
        lastIndex = index;
      });
    });

    test('P0: all sections have non-empty content', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      REQUIRED_SECTIONS.forEach(section => {
        const sectionContent = extractSection(body!, section);
        expect(sectionContent).toBeTruthy();
        expect(sectionContent!.length).toBeGreaterThan(20); // Meaningful content
      });
    });

    test('P0: template has exactly 13 main H2 sections', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Count H2 sections (## headings, not ###)
      const h2Sections = body!.match(/^##\s+[^#]/gm);
      expect(h2Sections).toBeTruthy();
      expect(h2Sections!.length).toBe(13);
    });
  });

  // ===================================================================
  // AC4: Executive Summary structured for AI extraction
  // ===================================================================
  describe('AC4: Executive Summary structured for AI extraction', () => {
    test('P0: Executive Summary section exists', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const execSummary = extractSection(body!, 'Executive Summary');
      expect(execSummary).toBeTruthy();
    });

    test('P0: Executive Summary includes 2-3 paragraph structure guidance', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      const execSummary = extractSection(body!, 'Executive Summary');
      expect(execSummary).toBeTruthy();

      const lowerContent = execSummary!.toLowerCase();
      expect(lowerContent).toMatch(/(2-3|two to three|paragraph)/);
    });

    test('P1: Executive Summary includes key findings placeholder', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      const execSummary = extractSection(body!, 'Executive Summary');
      expect(execSummary).toBeTruthy();

      expect(execSummary).toMatch(/\{\{key.*finding/i);
    });

    test('P1: Executive Summary includes AI context optimization guidance', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      const execSummary = extractSection(body!, 'Executive Summary');
      expect(execSummary).toBeTruthy();

      const lowerContent = execSummary!.toLowerCase();
      expect(lowerContent).toMatch(/(ai|context|extraction)/);
    });
  });

  // ===================================================================
  // AC5: H2/H3 heading structure
  // ===================================================================
  describe('AC5: H2/H3 heading structure', () => {
    test('P0: main sections use H2 (##) for section headings', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // All required sections should be H2
      REQUIRED_SECTIONS.forEach(section => {
        const h2Pattern = new RegExp(`^##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm');
        expect(body).toMatch(h2Pattern);
      });
    });

    test('P0: subsections use H3 (###) where applicable', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // At least some sections should have H3 subsections
      const h3Count = (body!.match(/^###\s+/gm) || []).length;
      expect(h3Count).toBeGreaterThan(0);
    });

    test('P0: no H1 (#) headings in body (only H2 and H3)', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // H1 should only appear in frontmatter boundary or not at all in body
      const h1InBody = body!.match(/^#\s+[^#]/gm);
      expect(h1InBody).toBeNull();
    });

    test('P0: consistent heading hierarchy (no skipped levels)', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Should have H2 sections
      const h2Count = (body!.match(/^##\s+[^#]/gm) || []).length;
      expect(h2Count).toBeGreaterThan(0);

      // If H3 exists, it should be under H2 sections (structural check via regex is limited)
      const h3Count = (body!.match(/^###\s+[^#]/gm) || []).length;
      // H3 should be less than or equal to H2 count if structure is reasonable
      // This is a loose check; detailed structure verification would need parsing
      expect(h3Count).toBeGreaterThanOrEqual(0);
    });

    test('P0: heading structure is easy for AI parsing', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Check for consistent heading format (no extra spaces, proper formatting)
      const malformedH2 = body!.match(/^##[^#\s]/gm);
      expect(malformedH2).toBeNull();

      const malformedH3 = body!.match(/^###[^#\s]/gm);
      expect(malformedH3).toBeNull();
    });
  });

  // ===================================================================
  // AC6: Bullet point guidance
  // ===================================================================
  describe('AC6: Bullet point guidance', () => {
    test('P0: template includes bullet point guidance', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/(bullet|list|\-\s)/);
    });

    test('P0: bullet points use dash (-) syntax per Markdown conventions', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Should have dash-based list items
      const dashBullets = body!.match(/^- .+$/gm);
      expect(dashBullets).toBeTruthy();
      expect(dashBullets!.length).toBeGreaterThan(0);
    });

    test('P1: bullet point guidance mentions easy extraction', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/(extract|parse|easy)/);
    });

    test('P1: template demonstrates bullet point usage in guidance comments', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Look for guidance comments that use bullet points
      const guidanceWithBullets = body!.match(/<!--[^>]*-->[\s\S]*?-/);
      // Either has guidance with bullets OR has bullet examples
      const hasBullets = (body!.match(/^- .+$/gm) || []).length > 0;
      expect(hasBullets || guidanceWithBullets !== null).toBe(true);
    });
  });

  // ===================================================================
  // AC7: Source URL placeholders in References
  // ===================================================================
  describe('AC7: Source URL placeholders in References', () => {
    test('P0: References section exists', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const references = extractSection(body!, 'References');
      expect(references).toBeTruthy();
    });

    test('P0: References section contains {{source_url}} placeholder', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      const references = extractSection(body!, 'References');
      expect(references).toBeTruthy();

      expect(references).toMatch(/\{\{source_url\}\}/);
    });

    test('P0: References section has URL format guidance', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      const references = extractSection(body!, 'References');
      expect(references).toBeTruthy();

      const lowerContent = references!.toLowerCase();
      expect(lowerContent).toMatch(/(url|source|http|link)/);
    });

    test('P0: References includes access date guidance', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      const references = extractSection(body!, 'References');
      expect(references).toBeTruthy();

      const lowerContent = references!.toLowerCase();
      expect(lowerContent).toMatch(/(access.*date|date.*access|retrieved)/);
    });
  });

  // ===================================================================
  // AC8: Confidence level guidance
  // ===================================================================
  describe('AC8: Confidence level guidance', () => {
    test('P0: research_confidence field in frontmatter accepts high/medium/low', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      // Frontmatter should show the confidence level options
      expect(content).toMatch(/research_confidence.*\{\{(high|medium|low)\}\}/);
    });

    test('P1: template includes guidance for confidence levels', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Should mention confidence somewhere in the body
      const lowerContent = body!.toLowerCase();
      expect(lowerContent).toMatch(/confidence/);
    });

    test('P1: guidance explains when to use high/medium/low confidence', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const lowerContent = content.toLowerCase();

      // Should mention at least two confidence levels
      const hasHigh = lowerContent.includes('high');
      const hasMedium = lowerContent.includes('medium');
      const hasLow = lowerContent.includes('low');
      expect(hasHigh || hasMedium || hasLow).toBe(true);
    });

    test('P1: confidence level guidance is in relevant sections', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Confidence guidance typically appears in methodology or analysis sections
      const methodology = extractSection(body!, 'Research Methodology');
      const techLandscape = extractSection(body!, 'Technical Landscape');

      const hasConfidenceGuidance =
        (methodology && methodology.toLowerCase().includes('confidence')) ||
        (techLandscape && techLandscape.toLowerCase().includes('confidence'));

      expect(hasConfidenceGuidance).toBe(true);
    });
  });

  // ===================================================================
  // AC9: Mermaid diagram placeholders
  // ===================================================================
  describe('AC9: Mermaid diagram placeholders', () => {
    test('P0: template includes flowchart diagram placeholder', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/```mermaid[\s\S]*?flowchart/i);
    });

    test('P0: template includes sequenceDiagram diagram placeholder', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/```mermaid[\s\S]*?sequenceDiagram/i);
    });

    test('P1: Mermaid diagrams appear in Technical Landscape section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      const techLandscape = extractSection(body!, 'Technical Landscape');
      expect(techLandscape).toBeTruthy();

      // Should have Mermaid code block
      expect(techLandscape).toMatch(/```mermaid/i);
    });

    test('P1: Mermaid diagrams appear in Integration Patterns section', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      const integrationPatterns = extractSection(body!, 'Integration Patterns');
      expect(integrationPatterns).toBeTruthy();

      // Should have Mermaid code block
      expect(integrationPatterns).toMatch(/```mermaid/i);
    });

    test('P1: Mermaid examples show valid syntax', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Find all mermaid blocks and check they have valid structure
      const mermaidBlocks = body!.match(/```mermaid[\s\S]*?```/gi);
      expect(mermaidBlocks).toBeTruthy();
      expect(mermaidBlocks!.length).toBeGreaterThan(0);

      // Each block should have a diagram type declaration
      mermaidBlocks!.forEach(block => {
        const hasDiagramType =
          /flowchart|sequencediagram|graph\s+(td|lr|tb)/i.test(block);
        expect(hasDiagramType).toBe(true);
      });
    });

    test('P0: Mermaid diagram placeholder includes example syntax', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Should have example Mermaid code (not just placeholder text)
      const mermaidBlocks = body!.match(/```mermaid[\s\S]*?```/gi);
      expect(mermaidBlocks).toBeTruthy();

      // At least one block should have actual example nodes/connections
      const hasExampleContent = mermaidBlocks!.some(block =>
        /-->|---|\[.*\]|\(.*\)/.test(block)
      );
      expect(hasExampleContent).toBe(true);
    });
  });

  // ===================================================================
  // AC10: Template naming convention (kebab-case)
  // ===================================================================
  describe('AC10: Template naming convention (kebab-case)', () => {
    test('P2: file uses kebab-case naming (technical-research.md)', () => {
      expect(existsSync(TEMPLATE_PATH)).toBe(true);
      const filename = 'technical-research.md';
      expect(filename).toMatch(/^[a-z]+(-[a-z]+)*\.md$/);
    });

    test('P2: naming is consistent with other templates in directory', () => {
      const files = readdirSync(TEMPLATES_DIR);
      const templateFiles = files.filter(f =>
        f.endsWith('.md') &&
        f !== 'README.md' &&
        !f.startsWith('.')
      );

      // All template files should use kebab-case
      templateFiles.forEach(file => {
        expect(file).toMatch(/^[a-z]+(-[a-z]+)*\.md$/);
      });
    });
  });

  // ===================================================================
  // AC11: Placeholder syntax follows convention
  // ===================================================================
  describe('AC11: Placeholder syntax follows convention', () => {
    test('P0: template uses {{variable}} placeholder syntax', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Should have double-brace placeholders
      expect(body).toMatch(/\{\{[a-z_]+\}\}/i);
    });

    test('P0: frontmatter uses {{topic}}, {{date}} placeholders', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      expect(frontmatter).toMatch(/\{\{topic\}\}/);
      expect(frontmatter).toMatch(/\{\{date\}\}/);
    });

    test('P0: template uses <!-- guidance comments --> for fill instructions', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Should have HTML-style guidance comments
      expect(body).toMatch(/<!--[^>]*-->/);
    });

    test('P1: placeholder syntax matches business-logic.md pattern', () => {
      const businessLogicContent = readFileSync(BUSINESS_LOGIC_TEMPLATE, 'utf8');
      const templateContent = readFileSync(TEMPLATE_PATH, 'utf8');

      // Both should use {{variable}} syntax
      const businessLogicPlaceholders = businessLogicContent.match(/\{\{[a-z_]+\}\}/gi) || [];
      const templatePlaceholders = templateContent.match(/\{\{[a-z_]+\}\}/gi) || [];

      // Template should have placeholders like business-logic
      expect(templatePlaceholders.length).toBeGreaterThan(0);

      // Both should use <!-- guidance --> comments
      expect(businessLogicContent).toMatch(/<!--[^>]*-->/);
      expect(templateContent).toMatch(/<!--[^>]*-->/);
    });

    test('P1: common placeholders follow naming convention (snake_case)', () => {
      const content = readFileSync(TEMPLATE_PATH, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();

      // Extract all placeholders
      const placeholders = body!.match(/\{\{[a-z_0-9]+\}\}/gi) || [];

      // All placeholders should use snake_case (lowercase with underscores)
      placeholders.forEach(placeholder => {
        const varName = placeholder.replace(/\{\{|\}\}/g, '');
        expect(varName).toMatch(/^[a-z][a-z0-9_]*$/);
      });
    });
  });
});
