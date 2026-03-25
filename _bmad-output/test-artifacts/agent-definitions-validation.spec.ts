/**
 * ATDD Test Suite for Story 1-2: Agent Definitions in SKILL.md Format
 *
 * These tests verify that the three MVP agent definition files (Architect, Developer, QA)
 * are properly structured in SKILL.md format with correct YAML frontmatter and Markdown body.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail if implementation is incomplete)
 *
 * Coverage: 42 test scenarios across 7 acceptance criteria
 * - AC1: Agent definition files exist (5 tests)
 * - AC2: YAML frontmatter validation (10 tests)
 * - AC3: Markdown body structure (7 tests)
 * - AC4: Architect Output Format (6 tests)
 * - AC5: Developer Output Format (6 tests)
 * - AC6: QA Output Format (6 tests)
 * - AC7: Extensibility (2 tests)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const FRAMEWORK_ROOT = join(process.cwd(), 'scrum_workflow');
const AGENTS_DIR = join(FRAMEWORK_ROOT, 'agents');

// Agent file paths
const AGENT_FILES = {
  architect: join(AGENTS_DIR, 'architect.md'),
  developer: join(AGENTS_DIR, 'developer.md'),
  qa: join(AGENTS_DIR, 'qa.md'),
};

// Required YAML frontmatter fields in exact order
const REQUIRED_FIELDS = ['name', 'display_name', 'role', 'active_in', 'model', 'max_tokens'];

// Required Markdown sections in exact order
const REQUIRED_SECTIONS = ['Identity', 'Instructions', 'Output Format', 'Context Rules'];

describe('Story 1-2: Agent Definitions in SKILL.md Format', () => {
  describe('AC1: Agent Definition Files Exist', () => {
    test('P0: architect.md exists in agents directory', () => {
      expect(existsSync(AGENT_FILES.architect)).toBe(true);
    });

    test('P0: developer.md exists in agents directory', () => {
      expect(existsSync(AGENT_FILES.developer)).toBe(true);
    });

    test('P0: qa.md exists in agents directory', () => {
      expect(existsSync(AGENT_FILES.qa)).toBe(true);
    });

    test('P1: all agent files are valid Markdown format', () => {
      Object.values(AGENT_FILES).forEach(filePath => {
        expect(existsSync(filePath)).toBe(true);
        const content = readFileSync(filePath, 'utf8');
        expect(content).toBeTruthy();
        expect(content.length).toBeGreaterThan(0);
      });
    });

    test('P2: all agent files use kebab-case naming', () => {
      const files = readdirSync(AGENTS_DIR);
      const mdFiles = files.filter(f => f.endsWith('.md'));

      mdFiles.forEach(file => {
        // Check that filename is kebab-case (lowercase with hyphens, no underscores or spaces)
        expect(file).toMatch(/^[a-z]+(-[a-z]+)*\.md$/);
      });
    });
  });

  describe('AC2: YAML Frontmatter Validation', () => {
    describe('P0: YAML frontmatter structure', () => {
      test.each(Object.entries(AGENT_FILES))(
        'P0: %s file has YAML frontmatter delimiter',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          expect(content).toMatch(/^---\s*\n/); // Starts with YAML delimiter
          expect(content).toMatch(/\n---\s*\n/); // Has closing YAML delimiter
        }
      );

      test.each(Object.entries(AGENT_FILES))(
        'P0: %s file has all required YAML fields',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          const frontmatterMatch = content.match(/^---$(.*?)^---$/ms);
          expect(frontmatterMatch).toBeTruthy();

          const frontmatter = frontmatterMatch[1];

          REQUIRED_FIELDS.forEach(field => {
            expect(frontmatter).toMatch(new RegExp(`^${field}:`, 'm'));
          });
        }
      );

      test.each(Object.entries(AGENT_FILES))(
        'P0: %s file YAML fields are in correct order',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          const frontmatterMatch = content.match(/^---$(.*?)^---$/ms);
          expect(frontmatterMatch).toBeTruthy();

          const frontmatter = frontmatterMatch[1];
          const lines = frontmatter
            .split('\n')
            .filter(line => line.trim() && !line.trim().startsWith('#'));

          const foundFields = lines.map(line => line.split(':')[0].trim());
          expect(foundFields).toEqual(REQUIRED_FIELDS);
        }
      );
    });

    describe('P1: YAML field validation', () => {
      test.each(Object.entries(AGENT_FILES))(
        'P1: %s name field matches filename',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          const expectedName = agentName; // architect, developer, or qa
          expect(content).toMatch(new RegExp(`^name:\\s*${expectedName}$`, 'm'));
        }
      );

      test.each(Object.entries(AGENT_FILES))(
        'P1: %s display_name is human-readable',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          const displayNameMatch = content.match(/^display_name:\s*(.+)$/m);
          expect(displayNameMatch).toBeTruthy();

          const displayName = displayNameMatch[1];
          expect(displayName).toBeTruthy();
          expect(displayName.length).toBeGreaterThan(0);
          // Should be title case or similar readable format
          expect(displayName).toMatch(/^[A-Z][a-zA-Z\s]*$/);
        }
      );

      test.each(Object.entries(AGENT_FILES))(
        'P1: %s active_in field is an array',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          // YAML array format starts with dash
          expect(content).toMatch(/^active_in:\s*$/m);
          expect(content).toMatch(/^\s*-\s*\w+/m);
        }
      );

      test.each(Object.entries(AGENT_FILES))(
        'P1: %s model field is valid model identifier',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          const modelMatch = content.match(/^model:\s*(.+)$/m);
          expect(modelMatch).toBeTruthy();

          const model = modelMatch[1].trim();
          expect(model).toMatch(/^claude-(opus|sonnet)-\d+$/);
        }
      );

      test.each(Object.entries(AGENT_FILES))(
        'P1: %s max_tokens is positive integer',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          const maxTokensMatch = content.match(/^max_tokens:\s*(\d+)$/m);
          expect(maxTokensMatch).toBeTruthy();

          const maxTokens = parseInt(maxTokensMatch[1], 10);
          expect(maxTokens).toBeGreaterThan(0);
        }
      );
    });
  });

  describe('AC3: Markdown Body Structure', () => {
    describe('P0: Required sections exist', () => {
      test.each(Object.entries(AGENT_FILES))(
        'P0: %s file has all required Markdown sections',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          // Extract content after frontmatter
          const bodyMatch = content.match(/^---.*?^---\s*\n(.*)$/ms);
          expect(bodyMatch).toBeTruthy();

          const body = bodyMatch[1];
          expect(body).toBeTruthy();

          REQUIRED_SECTIONS.forEach(section => {
            expect(body).toMatch(new RegExp(`^##\\s*${section}`, 'm'));
          });
        }
      );

      test.each(Object.entries(AGENT_FILES))(
        'P0: %s file sections are in correct order',
        (agentName, filePath) => {
          const content = readFileSync(filePath, 'utf8');
          const bodyMatch = content.match(/^---.*?^---\s*\n(.*)$/ms);
          expect(bodyMatch).toBeTruthy();

          const body = bodyMatch[1];
          const sectionPattern = /^##\s*(.+)$/gm;
          const foundSections = [];
          let match;

          while ((match = sectionPattern.exec(body)) !== null) {
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
        }
      );
    });

    test('P1: all sections have content', () => {
      Object.entries(AGENT_FILES).forEach(([agentName, filePath]) => {
        const content = readFileSync(filePath, 'utf8');
        const bodyMatch = content.match(/^---.*?^---\s*\n(.*)$/ms);
        expect(bodyMatch).toBeTruthy();

        const body = bodyMatch[1];

        REQUIRED_SECTIONS.forEach(section => {
          const sectionPattern = new RegExp(
            `^##\\s*${section}\\s*\\n([\\s\\S]*?)(?=^##|\\Z)`,
            'm'
          );
          const sectionMatch = body.match(sectionPattern);
          expect(sectionMatch).toBeTruthy();

          const sectionContent = sectionMatch[1].trim();
          expect(sectionContent.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('AC4: Architect Output Format', () => {
    const architectPath = AGENT_FILES.architect;
    let architectContent: string;

    beforeAll(() => {
      architectContent = readFileSync(architectPath, 'utf8');
    });

    test('P0: Output Format contains table specification', () => {
      const outputFormatMatch = architectContent.match(
        /##\s*Output Format\s*\n([\s\S]*?)(?=##|\Z)/
      );
      expect(outputFormatMatch).toBeTruthy();

      const outputFormat = outputFormatMatch[1];
      expect(outputFormat).toMatch(/\|.*\|.*\|.*\|.*\|/); // Table format
    });

    test('P0: Findings table has correct columns', () => {
      expect(architectContent).toMatch(/\|#\s*\|\s*Finding\s*\|\s*Severity\s*\|\s*Category\s*\|/);
    });

    test('P0: Recommendations section exists', () => {
      expect(architectContent).toMatch(/###\s*Recommendations/);
    });

    test('P0: Proposed Acceptance Criteria section exists', () => {
      expect(architectContent).toMatch(/###\s*Proposed Acceptance Criteria/);
    });

    test('P1: Architect-specific focus on architectural risks', () => {
      const outputFormatMatch = architectContent.match(
        /##\s*Output Format\s*\n([\s\S]*?)(?=##|\Z)/
      );
      expect(outputFormatMatch).toBeTruthy();

      const outputFormat = outputFormatMatch[1];
      // Should mention architectural concepts
      expect(outputFormat.toLowerCase()).toMatch(/(architectural|design|scalability|maintainability)/);
    });

    test('P2: table format matches specification', () => {
      // Verify table structure with proper formatting
      expect(architectContent).toMatch(/\|---\|---\|---\|---\|/); // Table header separator
    });
  });

  describe('AC5: Developer Output Format', () => {
    const developerPath = AGENT_FILES.developer;
    let developerContent: string;

    beforeAll(() => {
      developerContent = readFileSync(developerPath, 'utf8');
    });

    test('P0: Output Format contains table specification', () => {
      const outputFormatMatch = developerContent.match(
        /##\s*Output Format\s*\n([\s\S]*?)(?=##|\Z)/
      );
      expect(outputFormatMatch).toBeTruthy();

      const outputFormat = outputFormatMatch[1];
      expect(outputFormat).toMatch(/\|.*\|.*\|.*\|.*\|/); // Table format
    });

    test('P0: Findings table has correct columns', () => {
      expect(developerContent).toMatch(/\|#\s*\|\s*Finding\s*\|\s*Severity\s*\|\s*Category\s*\|/);
    });

    test('P0: Recommendations section exists', () => {
      expect(developerContent).toMatch(/###\s*Recommendations/);
    });

    test('P0: Proposed Acceptance Criteria section exists', () => {
      expect(developerContent).toMatch(/###\s*Proposed Acceptance Criteria/);
    });

    test('P1: Developer-specific focus on technical implementation', () => {
      const outputFormatMatch = developerContent.match(
        /##\s*Output Format\s*\n([\s\S]*?)(?=##|\Z)/
      );
      expect(outputFormatMatch).toBeTruthy();

      const outputFormat = outputFormatMatch[1];
      // Should mention technical concepts
      expect(outputFormat.toLowerCase()).toMatch(/(technical|implementation|feasibility|dependency)/);
    });

    test('P2: table format matches specification', () => {
      expect(developerContent).toMatch(/\|---\|---\|---\|---\|/); // Table header separator
    });
  });

  describe('AC6: QA Output Format', () => {
    const qaPath = AGENT_FILES.qa;
    let qaContent: string;

    beforeAll(() => {
      qaContent = readFileSync(qaPath, 'utf8');
    });

    test('P0: Output Format contains table specification', () => {
      const outputFormatMatch = qaContent.match(
        /##\s*Output Format\s*\n([\s\S]*?)(?=##|\Z)/
      );
      expect(outputFormatMatch).toBeTruthy();

      const outputFormat = outputFormatMatch[1];
      expect(outputFormat).toMatch(/\|.*\|.*\|.*\|.*\|/); // Table format
    });

    test('P0: Findings table has correct columns', () => {
      expect(qaContent).toMatch(/\|#\s*\|\s*Finding\s*\|\s*Severity\s*\|\s*Category\s*\|/);
    });

    test('P0: Recommendations section exists', () => {
      expect(qaContent).toMatch(/###\s*Recommendations/);
    });

    test('P0: Proposed Acceptance Criteria section exists', () => {
      expect(qaContent).toMatch(/###\s*Proposed Acceptance Criteria/);
    });

    test('P1: QA-specific focus on acceptance criteria and edge cases', () => {
      const outputFormatMatch = qaContent.match(
        /##\s*Output Format\s*\n([\s\S]*?)(?=##|\Z)/
      );
      expect(outputFormatMatch).toBeTruthy();

      const outputFormat = outputFormatMatch[1];
      // Should mention testing concepts
      expect(outputFormat.toLowerCase()).toMatch(/(test|acceptance criteria|edge case|testability)/);
    });

    test('P2: table format matches specification', () => {
      expect(qaContent).toMatch(/\|---\|---\|---\|---\|/); // Table header separator
    });
  });

  describe('AC7: Extensibility (NFR4)', () => {
    test('P0: no hardcoded agent references in framework files', () => {
      // Check that framework files don't have hardcoded agent lists
      const frameworkFiles = [
        join(FRAMEWORK_ROOT, 'context', 'standards.md'),
      ];

      frameworkFiles.forEach(filePath => {
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8');
          // Should not have hardcoded lists of specific agent names
          // (allowing mentions of the three MVP agents in documentation)
          const hardCodedListPattern = /(architect.*developer.*qa|agents.*=.*\[.*\])/i;
          expect(content).not.toMatch(hardCodedListPattern);
        }
      });
    });

    test('P1: config.yaml active_agents array is extensible', () => {
      const configPath = join(FRAMEWORK_ROOT, 'config.yaml');

      if (existsSync(configPath)) {
        const content = readFileSync(configPath, 'utf8');
        // Should have active_agents configuration
        expect(content).toMatch(/active_agents:/);

        // Parse YAML array (basic check)
        const arrayMatch = content.match(/active_agents:\s*\n((?:\s*-\s*\w+\n?)+)/);
        expect(arrayMatch).toBeTruthy();

        const agentsList = arrayMatch[1]
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/-\s*/, '').trim());

        // Should include the three MVP agents
        expect(agentsList).toContain('architect');
        expect(agentsList).toContain('developer');
        expect(agentsList).toContain('qa');

        // Array format allows adding more agents
        expect(agentsList.length).toBeGreaterThanOrEqual(3);
      }
    });
  });
});
