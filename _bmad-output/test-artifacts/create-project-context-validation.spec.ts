/**
 * ATDD Tests for Story 1-5: /create-project-context Command & Workflow
 *
 * Purpose: Verify command definition and workflow files are created correctly
 * with proper SKILL.md format, two-phase workflow structure, and all
 * required sections.
 *
 * Test Level: File System Validation Tests (Infrastructure tests)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Test constants - resolve relative to project root (2 levels up from test-artifacts)
const PROJECT_ROOT = resolve(__dirname, '..', '..');
const FRAMEWORK_ROOT = resolve(PROJECT_ROOT, 'scrum_workflow');
const COMMAND_FILE = resolve(FRAMEWORK_ROOT, 'commands', 'create-project-context.md');
const WORKFLOW_FILE = resolve(FRAMEWORK_ROOT, 'workflows', 'project-context.md');

// Template files that should be referenced by the workflow
const CONTEXT_TEMPLATES = [
  'context-index.md',
  'context-frontend.md',
  'context-backend.md',
  'context-testing.md',
  'context-devops.md',
  'context-architecture.md',
];

const SKILL_TEMPLATES = [
  'skill-backend.md',
  'skill-frontend.md',
  'skill-testing.md',
  'skill-devops.md',
  'skill-project-architect.md',
];

// Dependency files the workflow should detect
const DEPENDENCY_FILES = [
  'package.json',
  'requirements.txt',
  'go.mod',
  'Cargo.toml',
  'pom.xml',
  'build.gradle',
  'Gemfile',
  'composer.json',
];

// Infrastructure files the workflow should detect
const INFRASTRUCTURE_FILES = [
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
];

// CI/CD patterns the workflow should detect
const CI_PATTERNS = [
  '.github/workflows',
  '.gitlab-ci.yml',
  'Jenkinsfile',
  '.circleci/config.yml',
];

// Test patterns the workflow should detect
const TEST_PATTERNS = [
  '*.test.*',
  '*.spec.*',
  'test_*.py',
  '*_test.go',
];

// Domains that can be detected
const DETECTABLE_DOMAINS = [
  'frontend',
  'backend',
  'testing',
  'devops',
  'architecture',
];

describe('Story 1-5: /create-project-context Command & Workflow', () => {
  describe('AC1: Command Definition File', () => {
    test('P0: command file exists at correct path', () => {
      expect(existsSync(COMMAND_FILE)).toBe(true);
    });

    test('P0: command file has YAML frontmatter', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content.startsWith('---\n')).toBe(true);
      const parts = content.split('---');
      expect(parts.length).toBeGreaterThanOrEqual(3);
    });

    test('P0: frontmatter has name field with value create-project-context', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = content.split('---')[1];
      expect(frontmatter).toContain('name: create-project-context');
    });

    test('P0: frontmatter has trigger field with value /create-project-context', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = content.split('---')[1];
      expect(frontmatter).toMatch(/trigger:\s*["']?\/create-project-context["']?/);
    });

    test('P0: frontmatter has requires_status field with null value', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = content.split('---')[1];
      expect(frontmatter).toContain('requires_status: null');
    });

    test('P0: frontmatter has sets_status field with null value', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = content.split('---')[1];
      expect(frontmatter).toContain('sets_status: null');
    });

    test('P0: frontmatter has spawns_agents field with empty array', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = content.split('---')[1];
      expect(frontmatter).toContain('spawns_agents: []');
    });

    test('P1: frontmatter fields are in exact order: name, trigger, requires_status, sets_status, spawns_agents', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = content.split('---')[1];
      const lines = frontmatter.trim().split('\n').filter((l: string) => l.trim() && !l.trim().startsWith('#'));
      const fieldOrder = lines.map((l: string) => l.split(':')[0].trim());
      expect(fieldOrder).toEqual(['name', 'trigger', 'requires_status', 'sets_status', 'spawns_agents']);
    });

    test('P0: command body has Purpose section', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Purpose$/m);
    });

    test('P0: command body has Workflow Reference section', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Workflow Reference$/m);
    });

    test('P0: command body has Input section', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Input$/m);
    });

    test('P0: command body has Output section', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Output$/m);
    });

    test('P1: body sections are in exact order: Purpose, Workflow Reference, Input, Output', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const sectionPattern = /^## (.+)$/gm;
      const sections: string[] = [];
      let match;
      while ((match = sectionPattern.exec(content)) !== null) {
        sections.push(match[1]);
      }
      expect(sections).toEqual(['Purpose', 'Workflow Reference', 'Input', 'Output']);
    });

    test('P1: Workflow Reference section references workflows/project-context.md', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toContain('workflows/project-context.md');
    });

    test('P1: Purpose section describes codebase analysis and context generation', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const purposeSection = content.split('## Purpose')[1].split('## ')[0];
      expect(purposeSection.toLowerCase()).toMatch(/analy[sz]e/);
      expect(purposeSection.toLowerCase()).toMatch(/context|skill/);
    });

    test('P1: Output section mentions context/*.md and skills/*/SKILL.md', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const outputSection = content.split('## Output')[1] || '';
      expect(outputSection).toContain('context/');
      expect(outputSection).toContain('skills/');
    });

    test('P2: file uses kebab-case naming', () => {
      const filename = COMMAND_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });
  });

  describe('AC2: Workflow File Structure', () => {
    test('P0: workflow file exists at correct path', () => {
      expect(existsSync(WORKFLOW_FILE)).toBe(true);
    });

    test('P0: workflow has Phase A (Analysis) section', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Phase A/i);
      expect(content.toLowerCase()).toContain('analysis');
    });

    test('P0: workflow has Phase B (Generation) section', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Phase B/i);
      expect(content.toLowerCase()).toContain('generation');
    });

    test('P2: workflow file uses kebab-case naming', () => {
      const filename = WORKFLOW_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });
  });

  describe('AC3: Phase A - Fact Collection via Shell Commands', () => {
    test('P0: workflow specifies directory structure analysis', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/directory structure|ls|glob/i);
    });

    test('P0: workflow specifies dependency file detection', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should mention at least some dependency files
      const mentionedDeps = DEPENDENCY_FILES.filter(f => content.includes(f));
      expect(mentionedDeps.length).toBeGreaterThanOrEqual(3);
    });

    test('P0: workflow specifies Docker/CI config detection', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Dockerfile|docker-compose/i);
    });

    test('P0: workflow specifies CI/CD recognition', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const mentionedCI = CI_PATTERNS.filter(p => content.includes(p));
      expect(mentionedCI.length).toBeGreaterThanOrEqual(1);
    });

    test('P0: workflow specifies test pattern detection', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const mentionedTests = TEST_PATTERNS.filter(p => content.includes(p));
      expect(mentionedTests.length).toBeGreaterThanOrEqual(2);
    });

    test('P1: workflow specifies framework detection from dependencies', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toMatch(/framework detection|detect.*framework|infer.*from.*dependenc/i);
    });

    test('P1: workflow specifies domain classification', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toMatch(/domain.*classif|classify.*domain|determine.*domain|domain.*detect/i);
    });
  });

  describe('AC4: Phase B - Template-Based Generation', () => {
    test('P0: workflow references context templates', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should reference the template directory/pattern
      expect(content).toMatch(/templates\/context-/);
    });

    test('P0: workflow specifies writing to context/ directory', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/context\//);
    });

    test('P0: workflow references skill templates', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/templates\/skill-/);
    });

    test('P0: workflow specifies writing skills to skills/*/SKILL.md', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/skills\/.*SKILL\.md/);
    });
  });

  describe('AC5: Index Generation with Agent Loading Map', () => {
    test('P0: workflow specifies generating context/index.md', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toContain('context/index.md');
    });

    test('P1: workflow mentions agent loading map', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toMatch(/agent.*loading.*map|loading.*map/i);
    });
  });

  describe('AC6: Domain Skill File Generation', () => {
    test('P0: workflow specifies generating skills per detected domain', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toMatch(/skill.*domain|domain.*skill/i);
    });
  });

  describe('AC7: Only Detected Domains', () => {
    test('P0: workflow specifies conditional generation (only detected domains)', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toMatch(/only.*detect|skip.*not.*detect|no.*empty.*file|conditional/i);
    });
  });

  describe('AC8: Valid YAML Frontmatter', () => {
    test('P0: workflow specifies YAML frontmatter validation', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toMatch(/yaml.*frontmatter|frontmatter.*valid/i);
    });

    test('P1: workflow specifies domain and generated fields in frontmatter', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/domain/);
      expect(content).toMatch(/generated/);
    });
  });

  describe('AC9: Cross-Reference Validation', () => {
    test('P0: workflow specifies index.md references all generated sub-files', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toMatch(/cross-reference|index.*reference|reference.*all.*generated|validate.*references/i);
    });
  });

  describe('AC10: Idempotency', () => {
    test('P0: workflow specifies overwrite behavior for re-runs', () => {
      if (!existsSync(WORKFLOW_FILE)) return;
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toMatch(/idempoten|overwrite|re-run|rerun|clean.*overwrite/i);
    });
  });

  describe('Naming Convention Compliance', () => {
    test('P0: command filename uses kebab-case', () => {
      expect(COMMAND_FILE).toMatch(/create-project-context\.md$/);
    });

    test('P0: workflow filename uses kebab-case', () => {
      expect(WORKFLOW_FILE).toMatch(/project-context\.md$/);
    });

    test('P0: command YAML fields use snake_case', () => {
      if (!existsSync(COMMAND_FILE)) return;
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = content.split('---')[1];
      const yamlFields = frontmatter.trim().split('\n')
        .filter((l: string) => l.includes(':'))
        .map((l: string) => l.split(':')[0].trim());
      yamlFields.forEach((field: string) => {
        expect(field).toMatch(/^[a-z][a-z0-9_]*$/);
      });
    });
  });
});
