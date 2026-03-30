/**
 * ATDD Failing Tests for Story 8-1: Skill Registration Templates for Epic 6 & 7
 *
 * TDD RED PHASE: These tests are intentionally designed to FAIL
 * They will pass only after implementing the story requirements
 *
 * Theme: YOLO (You Only Live Once) - straightforward, efficient implementation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const TEMPLATE_DIR = join(process.cwd(), 'create-scrum-workflow/templates/skill-registrations');
const PROJECT_DOCS_TEMPLATE = join(TEMPLATE_DIR, 'scrum-create-project-docs/SKILL.md');
const ARCHITECTURE_DOCS_TEMPLATE = join(TEMPLATE_DIR, 'scrum-create-architecture-docs/SKILL.md');

describe('Story 8-1: Skill Registration Templates for Epic 6 & 7', () => {
  describe('AC1: Template File Creation', () => {
    it('Test 1.1: should create scrum-create-project-docs/SKILL.md file', () => {
      // RED: This will fail until template is created
      expect(existsSync(PROJECT_DOCS_TEMPLATE)).toBe(true);
    });

    it('Test 1.2: should create scrum-create-architecture-docs/SKILL.md file', () => {
      // RED: This will fail until template is created
      expect(existsSync(ARCHITECTURE_DOCS_TEMPLATE)).toBe(true);
    });

    it('Test 1.3: should create files in correct directory structure', () => {
      // RED: This will fail until templates are created
      const registrations = readdirSync(TEMPLATE_DIR);
      expect(registrations).toContain('scrum-create-project-docs');
      expect(registrations).toContain('scrum-create-architecture-docs');
    });
  });

  describe('AC2: Template Format Consistency', () => {
    let projectDocsContent: string;
    let architectureDocsContent: string;

    beforeEach(() => {
      // RED: These will fail until templates exist
      projectDocsContent = readFileSync(PROJECT_DOCS_TEMPLATE, 'utf-8');
      architectureDocsContent = readFileSync(ARCHITECTURE_DOCS_TEMPLATE, 'utf-8');
    });

    it('Test 2.1: should have name field in kebab-case matching directory name', () => {
      // RED: This will fail until templates are created with correct format
      const extractName = (content: string) => {
        const match = content.match(/^name:\s*(.+)$/m);
        return match ? match[1].trim() : null;
      };

      expect(extractName(projectDocsContent)).toBe('scrum-create-project-docs');
      expect(extractName(architectureDocsContent)).toBe('scrum-create-architecture-docs');
    });

    it('Test 2.2: should have description field in frontmatter', () => {
      // RED: This will fail until templates are created with description
      const extractDescription = (content: string) => {
        const match = content.match(/^description:\s*"(.+)"$/m);
        return match ? match[1] : null;
      };

      expect(extractDescription(projectDocsContent)).not.toBeNull();
      expect(extractDescription(architectureDocsContent)).not.toBeNull();
    });

    it('Test 2.3: should NOT have display_name field', () => {
      // RED: This will fail if display_name is present
      expect(projectDocsContent).not.toMatch(/^display_name:/m);
      expect(architectureDocsContent).not.toMatch(/^display_name:/m);
    });

    it('Test 2.4: should NOT have active_in field', () => {
      // RED: This will fail if active_in is present
      expect(projectDocsContent).not.toMatch(/^active_in:/m);
      expect(architectureDocsContent).not.toMatch(/^active_in:/m);
    });

    it('Test 2.5: should follow load-and-execute pattern in body', () => {
      // RED: This will fail until body is correct
      expect(projectDocsContent).toContain('Load and execute the framework command');
      expect(architectureDocsContent).toContain('Load and execute the framework command');
    });
  });

  describe('AC3: Placeholder Syntax', () => {
    let projectDocsContent: string;
    let architectureDocsContent: string;

    beforeEach(() => {
      // RED: These will fail until templates exist
      projectDocsContent = readFileSync(PROJECT_DOCS_TEMPLATE, 'utf-8');
      architectureDocsContent = readFileSync(ARCHITECTURE_DOCS_TEMPLATE, 'utf-8');
    });

    it('Test 3.1: should use {{framework_path}} placeholder', () => {
      // RED: This will fail until placeholder is used
      expect(projectDocsContent).toContain('{{framework_path}}');
      expect(architectureDocsContent).toContain('{{framework_path}}');
    });

    it('Test 3.2: should not use other placeholders', () => {
      // RED: This will fail if other placeholders exist
      const placeholderRegex = /\{\{[^}]+\}\}/g;
      const projectDocsPlaceholders = projectDocsContent.match(placeholderRegex) || [];
      const architectureDocsPlaceholders = architectureDocsContent.match(placeholderRegex) || [];

      expect(projectDocsPlaceholders).toEqual(['{{framework_path}}']);
      expect(architectureDocsPlaceholders).toEqual(['{{framework_path}}']);
    });
  });

  describe('AC4: Command References', () => {
    let projectDocsContent: string;
    let architectureDocsContent: string;

    beforeEach(() => {
      // RED: These will fail until templates exist
      projectDocsContent = readFileSync(PROJECT_DOCS_TEMPLATE, 'utf-8');
      architectureDocsContent = readFileSync(ARCHITECTURE_DOCS_TEMPLATE, 'utf-8');
    });

    it('Test 4.1: should reference correct path for project-docs', () => {
      // RED: This will fail until command reference is correct
      expect(projectDocsContent).toContain('{{framework_path}}/commands/create-project-docs.md');
    });

    it('Test 4.2: should reference correct path for architecture-docs', () => {
      // RED: This will fail until command reference is correct
      expect(architectureDocsContent).toContain('{{framework_path}}/commands/create-architecture-docs.md');
    });
  });

  describe('AC5: Description Quality', () => {
    let projectDocsDescription: string;
    let architectureDocsDescription: string;

    beforeEach(() => {
      // RED: These will fail until templates exist
      const projectDocsContent = readFileSync(PROJECT_DOCS_TEMPLATE, 'utf-8');
      const architectureDocsContent = readFileSync(ARCHITECTURE_DOCS_TEMPLATE, 'utf-8');

      const extractDescription = (content: string) => {
        const match = content.match(/^description:\s*"(.+)"$/m);
        return match ? match[1] : '';
      };

      projectDocsDescription = extractDescription(projectDocsContent);
      architectureDocsDescription = extractDescription(architectureDocsContent);
    });

    it('Test 5.1: should mention trigger phrases in description', () => {
      // RED: This will fail until description includes trigger phrases
      expect(projectDocsDescription.toLowerCase()).toContain('/scrum-create-project-docs');
      expect(architectureDocsDescription.toLowerCase()).toContain('/scrum-create-architecture-docs');
    });

    it('Test 5.2: should reference workflow orchestration', () => {
      // RED: This will fail until description mentions workflow
      expect(projectDocsDescription.toLowerCase()).toMatch(/workflow|orchestrat/);
      expect(architectureDocsDescription.toLowerCase()).toMatch(/workflow|orchestrat/);
    });

    it('Test 5.3: should be clear and actionable', () => {
      // RED: This will fail until description is clear
      expect(projectDocsDescription.length).toBeGreaterThan(20);
      expect(architectureDocsDescription.length).toBeGreaterThan(20);

      expect(projectDocsDescription).not.toBe('');
      expect(architectureDocsDescription).not.toBe('');
    });
  });
});
