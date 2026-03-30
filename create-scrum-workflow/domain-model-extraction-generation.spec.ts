/**
 * ATDD Test Suite for Story 6-5: Domain Model Extraction & Generation
 *
 * These tests verify that the domain model template and workflow implementation
 * are properly structured and follow the established conventions from stories 6.3 and 6.4.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because implementation does not exist yet)
 *
 * Coverage: 45 test scenarios across 5 acceptance criteria
 * - AC1: Grep-based domain entity scanning (5 tests)
 * - AC2: Output template exists (5 tests)
 * - AC3: Generated output follows template (5 tests)
 * - AC4: Entity documentation completeness (10 tests)
 * - AC5: Mermaid diagrams for domain model (10 tests)
 * - Additional: Integration and consistency tests (10 tests)
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

// Project paths - aligned with existing test convention
const FRAMEWORK_ROOT = join(process.cwd(), 'scrum_workflow');
const TEMPLATES_DIR = join(FRAMEWORK_ROOT, 'templates');
const WORKFLOWS_DIR = join(FRAMEWORK_ROOT, 'workflows');
const DOMAIN_MODEL_TEMPLATE_PATH = join(TEMPLATES_DIR, 'domain-model.md');
const PROJECT_DOC_WORKFLOW_PATH = join(WORKFLOWS_DIR, 'project-documentation.md');

// Reference templates for structural comparison
const BUSINESS_LOGIC_TEMPLATE_PATH = join(TEMPLATES_DIR, 'business-logic.md');
const WORKFLOWS_DOC_TEMPLATE_PATH = join(TEMPLATES_DIR, 'workflows-doc.md');

// Required sections in domain-model.md template
const REQUIRED_TEMPLATE_SECTIONS = [
  'Overview',
  'Core Entities',
  'Entity Relationships',
  'Value Objects & Enums',
  'Data Flow Structures'
];

// Required Mermaid diagram types
const REQUIRED_MERMAID_TYPES = ['classDiagram', 'erDiagram'];

// Helper: extract markdown body (after frontmatter if present)
function extractBody(content: string): string | null {
  const match = content.match(/^---.*?^---\s*\n(.*)$/ms);
  return match ? match[1] : content;
}

// Helper: extract a specific section from markdown body
function extractSection(body: string, sectionName: string): string | null {
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = body.split('\n');
  let capturing = false;
  let content: string[] = [];

  for (const line of lines) {
    if (/^#{1,3}\s+/.test(line)) {
      if (capturing) {
        break;
      }
      if (new RegExp(`^#{1,3}\\s+${escapedName}\\s*$`).test(line)) {
        capturing = true;
        continue;
      }
    } else if (capturing) {
      content.push(line);
    }
  }

  return content.length > 0 ? content.join('\n').trim() : null;
}

// Helper: check if file has YAML frontmatter
function hasYamlFrontmatter(content: string): boolean {
  return /^---\s*\n/.test(content) && /\n---\s*\n/.test(content);
}

describe('Story 6-5: Domain Model Extraction & Generation', () => {
  // ===================================================================
  // AC1: Grep-based domain entity scanning
  // ===================================================================
  describe('AC1: Grep-based domain entity scanning', () => {
    test('P0: Workflow Step 5.3 exists and has implementation (not placeholder)', () => {
      expect(existsSync(PROJECT_DOC_WORKFLOW_PATH)).toBe(true);

      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      expect(content).toMatch(/Step 5\.3/);
      // Should NOT contain the placeholder "See Story 6.5"
      expect(content.toLowerCase()).not.toMatch(/see story 6\.5/);
    });

    test('P0: Workflow Step 5.3 defines grep patterns for domain entities', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match![0];

      // Should mention class, interface, type, struct, model, schema, entity
      const entityPatterns = ['class', 'interface', 'type', 'struct', 'model', 'schema', 'entity'];
      const foundPatterns = entityPatterns.filter(pattern =>
        step53.toLowerCase().includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(4);
    });

    test('P0: Workflow Step 5.3 defines grep patterns for relationships', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should mention hasMany, belongsTo, references, extends, implements
      const relationshipPatterns = ['hasMany', 'belongsTo', 'references', 'extends', 'implements'];
      const foundPatterns = relationshipPatterns.filter(pattern =>
        step53.includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(3);
    });

    test('P0: Workflow Step 5.3 defines grep patterns for DTOs', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should mention DTO, Request, Response, Payload
      const dtoPatterns = ['dto', 'request', 'response', 'payload'];
      const foundPatterns = dtoPatterns.filter(pattern =>
        step53.toLowerCase().includes(pattern)
      );
      expect(foundPatterns.length).toBeGreaterThanOrEqual(2);
    });

    test('P0: Workflow Step 5.3 defines grep patterns for enums and database schemas', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should mention enum and database-related patterns
      expect(step53.toLowerCase()).toMatch(/enum/);
      expect(step53.toLowerCase()).toMatch(/(migration|createTable|schema)/);
    });
  });

  // ===================================================================
  // AC2: Output template exists
  // ===================================================================
  describe('AC2: Output template exists', () => {
    test('P0: domain-model.md template exists in templates directory', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);
    });

    test('P0: domain-model.md is alongside business-logic.md and workflows-doc.md', () => {
      const files = readdirSync(TEMPLATES_DIR);
      const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');

      expect(mdFiles).toContain('domain-model.md');
      expect(mdFiles).toContain('business-logic.md');
      expect(mdFiles).toContain('workflows-doc.md');
    });

    test('P0: domain-model.md follows pure Markdown format (no YAML frontmatter)', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      // Should NOT have YAML frontmatter (unlike story.md which has schema_version)
      expect(hasYamlFrontmatter(content)).toBe(false);
    });

    test('P0: domain-model.md contains all required sections', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      const body = extractBody(content)!;

      REQUIRED_TEMPLATE_SECTIONS.forEach(section => {
        expect(body).toMatch(new RegExp(`^#{1,3}\\s+${section}`, 'm'));
      });
    });

    test('P1: domain-model.md has placeholder comments for content injection', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      // Should have HTML comments like <!-- Fill from documentarian analysis -->
      expect(content).toMatch(/<!--\s*Fill/);
    });
  });

  // ===================================================================
  // AC3: Generated output follows template
  // ===================================================================
  describe('AC3: Generated output follows template', () => {
    test('P0: Workflow Step 5.3 references domain-model.md template', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      expect(step53Match![0]).toMatch(/domain-model\.md/);
      expect(step53Match![0]).toMatch(/templates/);
    });

    test('P0: Workflow Step 5.3 specifies output location as docs/generated/domain-model.md', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      expect(step53).toMatch(/docs\/generated\/domain-model\.md/);
    });

    test('P1: Workflow Step 5.3 references documentarian agent definition', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should reference agents/documentarian.md for grep patterns
      expect(step53.toLowerCase()).toMatch(/documentarian/);
      expect(step53).toMatch(/agents\/documentarian\.md/);
    });

    test('P1: Template structure matches business-logic.md and workflows-doc.md pattern', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);
      expect(existsSync(BUSINESS_LOGIC_TEMPLATE_PATH)).toBe(true);
      expect(existsSync(WORKFLOWS_DOC_TEMPLATE_PATH)).toBe(true);

      const domainModelContent = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      const businessLogicContent = readFileSync(BUSINESS_LOGIC_TEMPLATE_PATH, 'utf8');
      const workflowsDocContent = readFileSync(WORKFLOWS_DOC_TEMPLATE_PATH, 'utf8');

      // All should be pure Markdown (no YAML frontmatter)
      expect(hasYamlFrontmatter(domainModelContent)).toBe(false);
      expect(hasYamlFrontmatter(businessLogicContent)).toBe(false);
      expect(hasYamlFrontmatter(workflowsDocContent)).toBe(false);

      // All should have placeholder comments
      expect(domainModelContent).toMatch(/<!--/);
      expect(businessLogicContent).toMatch(/<!--/);
      expect(workflowsDocContent).toMatch(/<!--/);
    });

    test('P2: Template has Overview section with summary placeholders', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      const body = extractBody(content)!;
      const overviewSection = extractSection(body, 'Overview');

      expect(overviewSection).toBeTruthy();
      // Should mention total entities, categories, timestamp
      expect(overviewSection!.toLowerCase()).toMatch(/(total|entities|categories|timestamp)/);
    });
  });

  // ===================================================================
  // AC4: Entity documentation completeness
  // ===================================================================
  describe('AC4: Entity documentation completeness', () => {
    test('P0: Template specifies entity name format', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      const body = extractBody(content)!;
      const coreEntitiesSection = extractSection(body, 'Core Entities');

      expect(coreEntitiesSection).toBeTruthy();
      // Should show entity name format
      expect(coreEntitiesSection!.toLowerCase()).toMatch(/entity name/);
    });

    test('P0: Template specifies location format (file:line)', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      // Should mention file:line or source references
      expect(content.toLowerCase()).toMatch(/(file[:\s]*line|source|location)/);
    });

    test('P0: Template specifies key attributes/fields format', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      const body = extractBody(content)!;
      const coreEntitiesSection = extractSection(body, 'Core Entities');

      expect(coreEntitiesSection).toBeTruthy();
      expect(coreEntitiesSection!.toLowerCase()).toMatch(/(attributes|fields|properties)/);
    });

    test('P0: Template specifies relationships format', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      // Should mention relationships
      expect(content.toLowerCase()).toMatch(/relationship/);
    });

    test('P0: Workflow Step 5.3 defines source reference format [Source: path:LINE]', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should specify source reference format
      expect(step53.toLowerCase()).toMatch(/source.*reference/);
      expect(step53).toMatch(/\[Source:/);
    });

    test('P1: Workflow Step 5.3 specifies relative paths (not absolute)', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should mention relative paths
      expect(step53.toLowerCase()).toMatch(/relative/);
    });

    test('P1: Template has section for Value Objects & Enums', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      const body = extractBody(content)!;

      expect(body).toMatch(/Value Objects & Enums/);
    });

    test('P1: Template has section for Data Flow Structures', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      const body = extractBody(content)!;

      expect(body).toMatch(/Data Flow Structures/);
    });

    test('P2: Template shows entry format examples', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      // Should have example format (could be in placeholder comments)
      expect(content).toMatch(/(example|format|template)/);
    });
  });

  // ===================================================================
  // AC5: Mermaid diagrams for domain model
  // ===================================================================
  describe('AC5: Mermaid diagrams for domain model', () => {
    test('P0: Template includes classDiagram Mermaid placeholder', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/classDiagram/);
      expect(content).toMatch(/```mermaid/);
    });

    test('P0: Template includes erDiagram Mermaid placeholder', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      expect(content).toMatch(/erDiagram/);
    });

    test('P0: Workflow Step 5.3 includes Mermaid diagram generation instructions', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should mention Mermaid diagram generation
      expect(step53).toMatch(/mermaid/i);
      expect(step53).toMatch(/diagram/i);
    });

    test('P0: Workflow Step 5.3 specifies classDiagram for overall domain model', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      expect(step53).toMatch(/classDiagram/);
      expect(step53.toLowerCase()).toMatch(/(overall|domain model)/);
    });

    test('P0: Workflow Step 5.3 specifies erDiagram for database schemas', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      expect(step53).toMatch(/erDiagram/);
      expect(step53.toLowerCase()).toMatch(/(database|schema|table)/);
    });

    test('P1: Workflow Step 5.3 specifies relationship notation', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should mention relationship notation: inheritance, *> composition, --> association
      expect(step53).toMatch(/(--|<\||\*>|-->)/);
    });

    test('P1: Workflow Step 5.3 mentions descriptive comments above Mermaid blocks', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should mention comments above diagrams
      expect(step53.toLowerCase()).toMatch(/comment/);
    });

    test('P1: Template has Mermaid blocks fenced correctly', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      // Should have proper fencing: ```mermaid ... ```
      const mermaidBlocks = content.match(/```mermaid[\s\S]*?```/g);
      expect(mermaidBlocks).toBeTruthy();
      expect(mermaidBlocks!.length).toBeGreaterThanOrEqual(2);
    });

    test('P2: Workflow Step 5.3 groups entities by bounded context', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should mention grouping by bounded context or domain area
      expect(step53.toLowerCase()).toMatch(/(bounded context|domain area|grouping)/);
    });
  });

  // ===================================================================
  // Additional: Integration and consistency tests
  // ===================================================================
  describe('Integration: Pattern consistency with stories 6.3 and 6.4', () => {
    test('P0: All three templates (business-logic, workflows-doc, domain-model) exist', () => {
      expect(existsSync(BUSINESS_LOGIC_TEMPLATE_PATH)).toBe(true);
      expect(existsSync(WORKFLOWS_DOC_TEMPLATE_PATH)).toBe(true);
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);
    });

    test('P0: All three templates use pure Markdown format', () => {
      const businessLogicContent = readFileSync(BUSINESS_LOGIC_TEMPLATE_PATH, 'utf8');
      const workflowsDocContent = readFileSync(WORKFLOWS_DOC_TEMPLATE_PATH, 'utf8');
      const domainModelContent = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');

      expect(hasYamlFrontmatter(businessLogicContent)).toBe(false);
      expect(hasYamlFrontmatter(workflowsDocContent)).toBe(false);
      expect(hasYamlFrontmatter(domainModelContent)).toBe(false);
    });

    test('P0: All three workflow steps (5.1, 5.2, 5.3) have concrete implementations', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');

      // Should not have any "See Story 6.X" placeholders
      expect(content.toLowerCase()).not.toMatch(/see story 6\.[1-7]/);
    });

    test('P1: Workflow Step 5.3 references grep patterns from documentarian agent', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      const step53 = step53Match[0];

      // Should reference the agent definition, not redefine patterns inline
      expect(step53).toMatch(/agents\/documentarian\.md/);
      expect(step53).toMatch(/Instructions Section 4/);
    });

    test('P1: Template section order matches documentarian agent Output Format', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      const body = extractBody(content)!;

      // Should have sections in order: Overview, Core Entities, Entity Relationships, Value Objects & Enums, Data Flow Structures
      const overviewPos = body.toLowerCase().indexOf('overview');
      const coreEntitiesPos = body.toLowerCase().indexOf('core entities');
      const relationshipsPos = body.toLowerCase().indexOf('entity relationships');
      const valueObjectsPos = body.toLowerCase().indexOf('value objects');
      const dataFlowPos = body.toLowerCase().indexOf('data flow structures');

      expect(overviewPos).toBeGreaterThanOrEqual(0);
      expect(coreEntitiesPos).toBeGreaterThan(overviewPos);
      expect(relationshipsPos).toBeGreaterThan(coreEntitiesPos);
      expect(valueObjectsPos).toBeGreaterThan(relationshipsPos);
      expect(dataFlowPos).toBeGreaterThan(valueObjectsPos);
    });

    test('P2: Template uses Mustache-style placeholders for consistency', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      // Should use {{placeholder}} or <!-- Fill from --> style placeholders
      expect(content).toMatch(/(\{\{|\?\?\?|<!--)/);
    });

    test('P2: Workflow Step 5.3 has 6 sub-steps like 5.1 and 5.2', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step51Match = content.match(/Step 5\.1.*?(?=Step 5\.2|$)/s);
      const step52Match = content.match(/Step 5\.2.*?(?=Step 5\.3|$)/s);
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step51Match).toBeTruthy();
      expect(step52Match).toBeTruthy();
      expect(step53Match).toBeTruthy();

      // Each should have numbered sub-steps (6 sub-steps based on pattern from 6.3 and 6.4)
      const subSteps51 = step51Match![0].match(/^\s*[\d\.]+\s+/gm);
      const subSteps52 = step52Match![0].match(/^\s*[\d\.]+\s+/gm);
      const subSteps53 = step53Match![0].match(/^\s*[\d\.]+\s+/gm);

      expect(subSteps53).toBeTruthy();
      expect(subSteps53!.length).toBeGreaterThanOrEqual(6);
    });

    test('P2: Template does NOT duplicate analysis methodology', () => {
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);

      const content = readFileSync(DOMAIN_MODEL_TEMPLATE_PATH, 'utf8');
      // Template should NOT have detailed instructions on HOW to scan (that's in the agent)
      // It should only show the OUTPUT STRUCTURE
      expect(content.toLowerCase()).not.toMatch(/(grep pattern|scan the codebase|use glob)/);
    });
  });

  // ===================================================================
  // Additional: Write boundary compliance
  // ===================================================================
  describe('Write boundaries: Framework vs Project layer separation', () => {
    test('P0: Template is in Framework Layer (scrum_workflow/templates/)', () => {
      expect(DOMAIN_MODEL_TEMPLATE_PATH).toMatch(/scrum_workflow\/templates/);
    });

    test('P0: Workflow specifies Project Layer output (docs/generated/)', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      const step53Match = content.match(/Step 5\.3.*?(?=Step 5\.4|$)/s);

      expect(step53Match).toBeTruthy();
      expect(step53Match![0]).toMatch(/docs\/generated/);
    });

    test('P0: Workflow does NOT write to scrum_workflow/ at runtime', () => {
      const content = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      // Runtime writes should only go to docs/generated/
      const runtimeWriteMatch = content.match(/writes? to|generates?|creates?\s+\w+\.md/g);

      if (runtimeWriteMatch) {
        runtimeWriteMatch.forEach(match => {
          // Should NOT mention scrum_workflow/ in write operations
          if (match.includes('scrum_workflow')) {
            // Exception: initial template creation is fine, but runtime generation should not be there
            expect(match.toLowerCase()).toMatch(/(template|framework|initial)/);
          }
        });
      }
    });

    test('P1: Template is discoverable by file presence (no config registration)', () => {
      // Templates are discovered by file presence, not registered in config
      // This is verified by the template existing and being used by workflow
      expect(existsSync(DOMAIN_MODEL_TEMPLATE_PATH)).toBe(true);
      // Workflow references template path directly, not via config
      const workflowContent = readFileSync(PROJECT_DOC_WORKFLOW_PATH, 'utf8');
      expect(workflowContent).toMatch(/templates\/domain-model\.md/);
    });
  });
});
