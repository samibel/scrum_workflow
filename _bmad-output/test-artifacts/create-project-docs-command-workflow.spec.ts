/**
 * ATDD Test Suite for Story 6-2: /scrum-create-project-docs Command & Workflow Skeleton
 *
 * These tests verify that the command file, workflow file, and adapter skill file
 * are properly structured following the established conventions from existing
 * commands (create-project-context.md, create-ticket.md, dev-story.md) and
 * workflows (project-context.md, ticket-creation.md).
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because files do not exist yet)
 *
 * Coverage: 81 test scenarios across 10 acceptance criteria
 * - AC1:  Command file exists at correct location (8 + 10 body section tests)
 * - AC2:  Workflow file exists at correct location (5 tests)
 * - AC3:  Documentation output directory definition (3 tests)
 * - AC4:  Agent and context loading (5 tests)
 * - AC5:  Full-scan mode orchestration (7 tests)
 * - AC6:  Update mode orchestration (7 tests)
 * - AC7:  Project context reading (3 tests)
 * - AC8:  Directory creation (2 tests)
 * - AC9:  Overwrite warning (3 tests)
 * - AC10: Adapter skill creation (7 tests)
 * - Cross-cutting: Naming/structural/three-layer compliance (21 tests)
 *
 * Knowledge Fragments Applied:
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: Unit-level file system validation
 * - test-priorities-matrix.md: P0-P3 priority assignment
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 * - data-factories.md: N/A (file validation, no data factories needed)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

// Project paths - aligned with existing test convention
const PROJECT_ROOT = resolve(__dirname, '..', '..');
const FRAMEWORK_ROOT = join(PROJECT_ROOT, 'scrum_workflow');
const COMMANDS_DIR = join(FRAMEWORK_ROOT, 'commands');
const WORKFLOWS_DIR = join(FRAMEWORK_ROOT, 'workflows');
const AGENTS_DIR = join(FRAMEWORK_ROOT, 'agents');
const ADAPTER_SKILLS_DIR = join(PROJECT_ROOT, '.claude', 'skills');

// Files under test
const COMMAND_FILE = join(COMMANDS_DIR, 'create-project-docs.md');
const WORKFLOW_FILE = join(WORKFLOWS_DIR, 'project-documentation.md');
const ADAPTER_SKILL_FILE = join(ADAPTER_SKILLS_DIR, 'create-project-docs.md');

// Reference files for structural comparison
const REF_COMMAND_FILE = join(COMMANDS_DIR, 'create-project-context.md');
const REF_WORKFLOW_FILE = join(WORKFLOWS_DIR, 'project-context.md');
const REF_ADAPTER_SKILL = join(ADAPTER_SKILLS_DIR, 'create-project-context.md');
const DOCUMENTARIAN_AGENT = join(AGENTS_DIR, 'documentarian.md');

// Expected command frontmatter fields in order
const COMMAND_FRONTMATTER_FIELDS = ['name', 'trigger', 'requires_status', 'sets_status', 'spawns_agents'];

// Expected command body sections in order
const COMMAND_BODY_SECTIONS = ['Purpose', 'Workflow Reference', 'Input', 'Output'];

// Expected adapter skill frontmatter fields
const ADAPTER_FRONTMATTER_FIELDS = ['name', 'trigger', 'description', 'framework_command'];

// Output files the workflow must define
const EXPECTED_OUTPUT_FILES = [
  'business-logic.md',
  'workflows.md',
  'domain-model.md',
  '.scan-state.json',
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

  return content.length > 0 ? content.join('\n').trim() : null;
}

// =======================================================================
// AC1: Command file exists at correct location
// =======================================================================
describe('Story 6-2: /scrum-create-project-docs Command & Workflow Skeleton', () => {
  describe('AC1: Command file exists at correct location', () => {
    test.skip('P0: create-project-docs.md exists in commands directory', () => {
      expect(existsSync(COMMAND_FILE)).toBe(true);
    });

    test.skip('P0: command file has valid YAML frontmatter delimiters', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^---\s*\n/);
      expect(content).toMatch(/\n---\s*\n/);
    });

    test.skip('P0: frontmatter name field is "create-project-docs"', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^name:\s*create-project-docs$/m);
    });

    test.skip('P0: frontmatter trigger field is "/scrum-create-project-docs"', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/trigger:\s*["']?\/scrum-create-project-docs["']?/);
    });

    test.skip('P0: frontmatter requires_status is null', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^requires_status:\s*null$/m);
    });

    test.skip('P0: frontmatter sets_status is null', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^sets_status:\s*null$/m);
    });

    test.skip('P0: frontmatter spawns_agents contains documentarian', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      // YAML array format: spawns_agents:\n  - documentarian
      // or inline: spawns_agents: [documentarian]
      expect(frontmatter).toMatch(/spawns_agents/);
      expect(content).toMatch(/documentarian/);
    });

    test.skip('P1: frontmatter fields are in correct order matching convention', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      const lines = frontmatter!
        .split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('-'));

      const foundFields = lines.map(line => line.split(':')[0].trim());
      expect(foundFields).toEqual(COMMAND_FRONTMATTER_FIELDS);
    });
  });

  // =======================================================================
  // AC1 (continued): Command body sections
  // =======================================================================
  describe('AC1: Command body sections follow SKILL.md format', () => {
    test.skip('P0: command body has Purpose section', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Purpose$/m);
    });

    test.skip('P0: command body has Workflow Reference section', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Workflow Reference$/m);
    });

    test.skip('P0: command body has Input section', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Input$/m);
    });

    test.skip('P0: command body has Output section', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Output$/m);
    });

    test.skip('P1: body sections are in exact order: Purpose, Workflow Reference, Input, Output', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const sectionPattern = /^## (.+)$/gm;
      const sections: string[] = [];
      let match;
      while ((match = sectionPattern.exec(content)) !== null) {
        sections.push(match[1]);
      }
      expect(sections).toEqual(COMMAND_BODY_SECTIONS);
    });

    test.skip('P1: Workflow Reference section references workflows/project-documentation.md', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toContain('workflows/project-documentation.md');
    });

    test.skip('P1: Purpose section describes business logic documentation generation', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const purposeSection = extractSection(body!, 'Purpose');
      expect(purposeSection).toBeTruthy();
      const lowerPurpose = purposeSection!.toLowerCase();
      expect(lowerPurpose).toMatch(/(documentation|document)/);
      expect(lowerPurpose).toMatch(/(business\s*logic|codebase|generat)/);
    });

    test.skip('P1: Input section describes both full-scan and --update modes', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const inputSection = extractSection(body!, 'Input');
      expect(inputSection).toBeTruthy();
      expect(inputSection).toMatch(/--update/);
    });

    test.skip('P1: Output section lists the three generated files', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const outputSection = extractSection(body!, 'Output');
      expect(outputSection).toBeTruthy();
      expect(outputSection).toMatch(/business-logic\.md/);
      expect(outputSection).toMatch(/workflows\.md/);
      expect(outputSection).toMatch(/domain-model\.md/);
    });

    test.skip('P2: Output section mentions .scan-state.json', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const outputSection = extractSection(body!, 'Output');
      expect(outputSection).toBeTruthy();
      expect(outputSection).toMatch(/\.scan-state\.json/);
    });
  });

  // =======================================================================
  // AC2: Workflow file exists at correct location
  // =======================================================================
  describe('AC2: Workflow file exists at correct location', () => {
    test.skip('P0: project-documentation.md exists in workflows directory', () => {
      expect(existsSync(WORKFLOW_FILE)).toBe(true);
    });

    test.skip('P0: workflow file has meaningful content (not a stub)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.length).toBeGreaterThan(500);
    });

    test.skip('P0: workflow defines full-scan mode', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/full-scan|full scan/);
    });

    test.skip('P0: workflow defines update mode', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/update.*mode|--update/);
    });

    test.skip('P2: workflow file uses kebab-case naming', () => {
      const filename = WORKFLOW_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });
  });

  // =======================================================================
  // AC3: Documentation output directory
  // =======================================================================
  describe('AC3: Documentation output directory defined as docs/generated/', () => {
    test.skip('P0: workflow references docs/generated/ as output directory', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/docs\/generated\//);
    });

    test.skip('P1: workflow mentions docs/generated/ relative to project root', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      // Should describe docs/generated/ as relative to project root, not inside scrum_workflow/
      expect(lowerContent).toMatch(/project\s*root|relative/);
      expect(content).toMatch(/docs\/generated\//);
    });

    test.skip('P2: output directory is NOT inside scrum_workflow/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should not reference scrum_workflow/docs/generated/
      expect(content).not.toMatch(/scrum_workflow\/docs\/generated/);
    });
  });

  // =======================================================================
  // AC4: Agent and context loading
  // =======================================================================
  describe('AC4: Agent and context loading', () => {
    test.skip('P0: workflow references documentarian agent definition', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/documentarian/);
      expect(content).toMatch(/agents\/documentarian\.md/);
    });

    test.skip('P0: workflow references project context loading', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/context\/index\.md/);
    });

    test.skip('P1: workflow loads agent definition before starting analysis', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Agent loading should appear before analysis/scanning steps
      const agentLoadPos = content.indexOf('agents/documentarian');
      const analysisPos = content.search(/business\s*logic\s*analysis|project\s*structure\s*scan/i);
      if (agentLoadPos >= 0 && analysisPos >= 0) {
        expect(agentLoadPos).toBeLessThan(analysisPos);
      }
      expect(agentLoadPos).toBeGreaterThanOrEqual(0);
    });

    test.skip('P1: workflow loads project context before starting analysis', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const contextLoadPos = content.indexOf('context/index.md');
      const analysisPos = content.search(/business\s*logic\s*analysis|project\s*structure\s*scan/i);
      if (contextLoadPos >= 0 && analysisPos >= 0) {
        expect(contextLoadPos).toBeLessThan(analysisPos);
      }
      expect(contextLoadPos).toBeGreaterThanOrEqual(0);
    });

    test.skip('P2: workflow warns but continues if context files do not exist', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/warn|warning|optional/);
    });
  });

  // =======================================================================
  // AC5: Full-scan mode orchestration
  // =======================================================================
  describe('AC5: Full-scan mode orchestration', () => {
    test.skip('P0: workflow orchestrates project structure scan', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/project\s*structure\s*scan|structure\s*scan/);
    });

    test.skip('P0: workflow orchestrates business logic analysis producing business-logic.md', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/business-logic\.md/);
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/business\s*logic\s*analysis/);
    });

    test.skip('P0: workflow orchestrates workflow analysis producing workflows.md', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/workflows\.md/);
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/workflow\s*analysis/);
    });

    test.skip('P0: workflow orchestrates domain model analysis producing domain-model.md', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/domain-model\.md/);
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/domain\s*model\s*analysis/);
    });

    test.skip('P0: workflow orchestrates scan state persistence producing .scan-state.json', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/\.scan-state\.json/);
    });

    test.skip('P1: full-scan mode steps are in correct order (scan, analyze, persist)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const scanPos = lowerContent.indexOf('project structure scan');
      const businessPos = lowerContent.indexOf('business logic analysis');
      const scanStatePos = lowerContent.indexOf('.scan-state.json');

      // Scan should come before analysis, analysis before state persistence
      if (scanPos >= 0 && businessPos >= 0) {
        expect(scanPos).toBeLessThan(businessPos);
      }
      if (businessPos >= 0 && scanStatePos >= 0) {
        expect(businessPos).toBeLessThan(scanStatePos);
      }
    });

    test.skip('P2: full-scan is the default mode', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/full-scan.*default|default.*full-scan/);
    });
  });

  // =======================================================================
  // AC6: Update mode orchestration
  // =======================================================================
  describe('AC6: Update mode orchestration', () => {
    test.skip('P0: update mode loads existing .scan-state.json', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      // In context of update mode, should mention loading scan state
      expect(lowerContent).toMatch(/load.*\.scan-state|\.scan-state.*load/);
    });

    test.skip('P0: update mode identifies changed files', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/changed\s*files|identify.*chang/);
    });

    test.skip('P0: update mode re-analyzes changed areas', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/re-analy|re.analy|analy.*changed/);
    });

    test.skip('P1: update mode shows diff summary to user', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/diff\s*summary|show.*diff|summary.*change/);
    });

    test.skip('P1: update mode requests user confirmation before updating docs', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/confirm|user\s*confirm|approval/);
    });

    test.skip('P1: update mode is triggered by --update flag', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/--update/);
    });

    test.skip('P2: update mode references Story 6.6 or 6.7 for full implementation', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/6\.[67]|story\s*6/i);
    });
  });

  // =======================================================================
  // AC7: Project context reading
  // =======================================================================
  describe('AC7: Project context reading', () => {
    test.skip('P0: command or workflow reads context/index.md', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/context\/index\.md/);
    });

    test.skip('P1: context reading determines project domain', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/domain|tech\s*stack/);
    });

    test.skip('P1: context reading determines tech stack', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/tech\s*stack|technology|framework/);
    });
  });

  // =======================================================================
  // AC8: Directory creation
  // =======================================================================
  describe('AC8: Directory creation', () => {
    test.skip('P0: workflow creates docs/generated/ if it does not exist', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/creat.*docs\/generated|docs\/generated.*creat|mkdir|directory.*creat/);
    });

    test.skip('P1: directory creation happens before writing any files', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const createDirPos = lowerContent.search(/creat.*director|mkdir|docs\/generated.*not exist/);
      const writeFilePos = lowerContent.search(/writ.*business-logic|business-logic\.md/);

      if (createDirPos >= 0 && writeFilePos >= 0) {
        expect(createDirPos).toBeLessThan(writeFilePos);
      }
      expect(createDirPos).toBeGreaterThanOrEqual(0);
    });
  });

  // =======================================================================
  // AC9: Overwrite warning
  // =======================================================================
  describe('AC9: Overwrite warning', () => {
    test.skip('P0: workflow warns when docs/generated/ already exists in full-scan mode', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/overwrite|existing\s*docs|already\s*exist/);
    });

    test.skip('P1: overwrite warning includes confirmation prompt', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/continue.*\[y\/n\]|confirm|y\/n/i);
    });

    test.skip('P2: overwrite warning only applies to full-scan mode, not update mode', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      // Overwrite warning should be in the context of full-scan
      expect(lowerContent).toMatch(/full-scan.*overwrite|overwrite.*full-scan/);
    });
  });

  // =======================================================================
  // AC10: Adapter skill creation
  // =======================================================================
  describe('AC10: Adapter skill creation', () => {
    test.skip('P0: create-project-docs.md adapter skill exists in .claude/skills/', () => {
      expect(existsSync(ADAPTER_SKILL_FILE)).toBe(true);
    });

    test.skip('P0: adapter skill has valid YAML frontmatter', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      expect(content).toMatch(/^---\s*\n/);
      expect(content).toMatch(/\n---\s*\n/);
    });

    test.skip('P0: adapter skill frontmatter name is "create-project-docs"', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      expect(content).toMatch(/^name:\s*create-project-docs$/m);
    });

    test.skip('P0: adapter skill frontmatter trigger is /create-project-docs', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/trigger:\s*\/create-project-docs/);
    });

    test.skip('P0: adapter skill frontmatter has description field', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/^description:/m);
    });

    test.skip('P0: adapter skill frontmatter has framework_command field', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/framework_command:.*create-project-docs\.md/);
    });

    test.skip('P1: adapter skill body references the framework command file', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/create-project-docs\.md/);
    });
  });

  // =======================================================================
  // Cross-cutting: Structural compliance and naming conventions
  // =======================================================================
  describe('Cross-cutting: Command file structural compliance', () => {
    test.skip('P0: command file uses kebab-case filename', () => {
      const filename = COMMAND_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });

    test.skip('P0: command YAML fields use snake_case', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      const yamlFields = frontmatter!.trim().split('\n')
        .filter((l: string) => l.includes(':') && !l.trim().startsWith('#') && !l.trim().startsWith('-'))
        .map((l: string) => l.split(':')[0].trim());
      yamlFields.forEach((field: string) => {
        expect(field).toMatch(/^[a-z][a-z0-9_]*$/);
      });
    });

    test.skip('P1: command file structure matches create-project-context.md convention', () => {
      // Both should have same section structure
      const refContent = readFileSync(REF_COMMAND_FILE, 'utf8');
      const newContent = readFileSync(COMMAND_FILE, 'utf8');

      const getSections = (content: string) => {
        const sectionPattern = /^## (.+)$/gm;
        const sections: string[] = [];
        let match;
        while ((match = sectionPattern.exec(content)) !== null) {
          sections.push(match[1]);
        }
        return sections;
      };

      expect(getSections(newContent)).toEqual(getSections(refContent));
    });

    test.skip('P2: command file content is valid UTF-8 with reasonable length', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content.length).toBeGreaterThan(200);
      expect(content.length).toBeLessThan(5000);
    });
  });

  describe('Cross-cutting: Workflow file structural compliance', () => {
    test.skip('P0: workflow file uses kebab-case filename', () => {
      const filename = WORKFLOW_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });

    test.skip('P0: workflow has numbered steps', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should have numbered step headings (Step 0, Step 1, etc. or numbered markdown headings)
      expect(content).toMatch(/Step\s+\d+|###?\s+\d+\./);
    });

    test.skip('P0: workflow has Prerequisites section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Prerequisite/i);
    });

    test.skip('P0: workflow has Write Boundaries section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Write Boundaries/i);
    });

    test.skip('P1: Write Boundaries permits docs/generated/ files', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos);
        expect(afterWriteBoundaries).toMatch(/docs\/generated\/business-logic\.md/);
        expect(afterWriteBoundaries).toMatch(/docs\/generated\/workflows\.md/);
        expect(afterWriteBoundaries).toMatch(/docs\/generated\/domain-model\.md/);
        expect(afterWriteBoundaries).toMatch(/docs\/generated\/\.scan-state\.json/);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test.skip('P1: Write Boundaries prohibits writing to scrum_workflow/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos).toLowerCase();
        expect(afterWriteBoundaries).toMatch(/may\s*not.*scrum_workflow|not\s*write.*scrum_workflow/);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test.skip('P1: Write Boundaries prohibits writing to sprints/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos).toLowerCase();
        expect(afterWriteBoundaries).toMatch(/sprints/);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test.skip('P1: Write Boundaries prohibits writing to context/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos).toLowerCase();
        expect(afterWriteBoundaries).toMatch(/context/);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test.skip('P1: Write Boundaries prohibits writing to .claude/skills/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos).toLowerCase();
        expect(afterWriteBoundaries).toMatch(/\.claude\/skills|adapter\s*skills/);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test.skip('P2: workflow content is substantial (not a stub)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // A real workflow skeleton should have significant content
      expect(content.length).toBeGreaterThan(2000);
    });
  });

  describe('Cross-cutting: Adapter skill structural compliance', () => {
    test.skip('P0: adapter skill uses kebab-case filename', () => {
      const filename = ADAPTER_SKILL_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });

    test.skip('P1: adapter skill follows create-project-context.md adapter pattern', () => {
      const refContent = readFileSync(REF_ADAPTER_SKILL, 'utf8');
      const newContent = readFileSync(ADAPTER_SKILL_FILE, 'utf8');

      // Both should have frontmatter
      expect(extractFrontmatter(refContent)).toBeTruthy();
      expect(extractFrontmatter(newContent)).toBeTruthy();

      // Adapter is a thin reference -- body should be short
      const newBody = extractBody(newContent);
      expect(newBody).toBeTruthy();
      expect(newBody!.length).toBeLessThan(1000);
    });

    test.skip('P1: adapter skill does NOT contain workflow logic', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      // Adapter should not have step definitions, orchestration logic, or mode switching
      expect(body!.toLowerCase()).not.toMatch(/^##?\s*(step\s+\d|phase|mode\s+detect|orchestrat)/im);
    });

    test.skip('P2: adapter skill body mentions framework command path', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      expect(content).toMatch(/\{framework_commands\}/);
    });
  });

  // =======================================================================
  // Cross-cutting: Three-layer separation validation
  // =======================================================================
  describe('Cross-cutting: Three-layer architecture compliance', () => {
    test.skip('P0: command file is in Framework Layer (scrum_workflow/commands/)', () => {
      expect(COMMAND_FILE).toContain('scrum_workflow/commands/');
    });

    test.skip('P0: workflow file is in Framework Layer (scrum_workflow/workflows/)', () => {
      expect(WORKFLOW_FILE).toContain('scrum_workflow/workflows/');
    });

    test.skip('P0: adapter skill is in Adapter Layer (.claude/skills/)', () => {
      expect(ADAPTER_SKILL_FILE).toContain('.claude/skills/');
    });
  });
});

/**
 * TDD RED PHASE SUMMARY
 *
 * Total Tests: 81
 * - P0 (Critical): 39 tests
 * - P1 (High):     29 tests
 * - P2 (Medium):   13 tests
 *
 * All tests use test.skip() to mark them as intentionally failing (TDD red phase).
 * The files being tested (create-project-docs.md command, project-documentation.md
 * workflow, create-project-docs.md adapter skill) do not exist yet.
 *
 * After implementation (TDD green phase):
 * 1. Remove test.skip() from all test functions
 * 2. Run tests: npx jest create-project-docs-command-workflow.spec.ts
 * 3. Verify all tests PASS
 * 4. If any tests fail, either fix implementation (feature bug) or fix test (test bug)
 *
 * Acceptance Criteria Coverage:
 * - AC1:  Command file + body sections                       -> 18 tests
 * - AC2:  Workflow file exists at correct location            -> 5 tests
 * - AC3:  Documentation output directory                     -> 3 tests
 * - AC4:  Agent and context loading                          -> 5 tests
 * - AC5:  Full-scan mode orchestration                       -> 7 tests
 * - AC6:  Update mode orchestration                          -> 7 tests
 * - AC7:  Project context reading                            -> 3 tests
 * - AC8:  Directory creation                                 -> 2 tests
 * - AC9:  Overwrite warning                                  -> 3 tests
 * - AC10: Adapter skill creation                             -> 7 tests
 * - Cross-cutting: Naming/structural/three-layer compliance  -> 21 tests
 *
 * Knowledge Fragments Applied:
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: File system validation (infrastructure level)
 * - test-priorities-matrix.md: P0-P3 priority assignment per business impact
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 */
