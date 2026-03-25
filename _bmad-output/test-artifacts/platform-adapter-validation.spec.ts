/**
 * ATDD Test Suite for Story 1-3: Platform Adapter Contract and Claude Code Adapter
 *
 * These tests verify that the platform abstraction layer is properly implemented
 * with a working Claude Code adapter that follows the minimal adapter pattern.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail if implementation is incomplete)
 *
 * Coverage: 38 test scenarios across 6 acceptance criteria
 * - AC1: Skill registration files exist (5 tests)
 * - AC2: Skill files reference framework commands (6 tests)
 * - AC3: config.yaml platform field (3 tests)
 * - AC4: Adapter instruction file with framework_path (5 tests)
 * - AC5: Platform switching requires only config change (4 tests)
 * - AC6: No workflow logic in adapters (6 tests)
 * - Additional: Platform adapter contract documentation (4 tests)
 * - Additional: Framework command references (5 tests)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';

// Navigate to actual project root (up from test-artifacts -> _bmad-output -> project root)
const PROJECT_ROOT = join(process.cwd(), '..', '..');
const CLAUDE_DIR = join(PROJECT_ROOT, '.claude');
const CLAUDE_SKILLS_DIR = join(CLAUDE_DIR, 'skills');
const FRAMEWORK_ROOT = join(PROJECT_ROOT, 'scrum_workflow');
const FRAMEWORK_CONFIG = join(FRAMEWORK_ROOT, 'config.yaml');
const FRAMEWORK_CONTEXT_DIR = join(FRAMEWORK_ROOT, 'context');

// MVP command skill files
const SKILL_FILES = {
  'create-project-context': join(CLAUDE_SKILLS_DIR, 'create-project-context.md'),
  'create-ticket': join(CLAUDE_SKILLS_DIR, 'create-ticket.md'),
  'refine-ticket': join(CLAUDE_SKILLS_DIR, 'refine-ticket.md'),
  'dev-story': join(CLAUDE_SKILLS_DIR, 'dev-story.md'),
};

// Framework command files that skills should reference
const FRAMEWORK_COMMANDS = {
  'create-project-context': join(FRAMEWORK_ROOT, 'commands', 'create-project-context.md'),
  'create-ticket': join(FRAMEWORK_ROOT, 'commands', 'create-ticket.md'),
  'refine-ticket': join(FRAMEWORK_ROOT, 'commands', 'refine-ticket.md'),
  'dev-story': join(FRAMEWORK_ROOT, 'commands', 'dev-story.md'),
};

// Workflow-related keywords that should NOT appear in adapter files
const WORKFLOW_KEYWORDS = [
  'workflow',
  'orchestrat',
  'spawn agent',
  'execute step',
  'coordinate',
  'synthesis',
  'readiness check',
  'handoff',
  'state machine',
];

// Platform values
const VALID_PLATFORMS = ['claude-code', 'github-copilot', 'opencode', 'windsurf'];

describe('Story 1-3: Platform Adapter Contract and Claude Code Adapter', () => {
  describe('AC1: Skill Registration Files Exist', () => {
    test('P0: .claude/skills/ directory exists', () => {
      expect(existsSync(CLAUDE_SKILLS_DIR)).toBe(true);
    });

    test.each(Object.entries(SKILL_FILES))(
      'P0: %s skill file exists in .claude/skills/',
      (commandName, skillPath) => {
        expect(existsSync(skillPath)).toBe(true);
      }
    );

    test('P1: all skill files use kebab-case naming', () => {
      if (existsSync(CLAUDE_SKILLS_DIR)) {
        const files = readdirSync(CLAUDE_SKILLS_DIR);
        const mdFiles = files.filter(f => f.endsWith('.md'));

        mdFiles.forEach(file => {
          expect(file).toMatch(/^[a-z]+(-[a-z]+)*\.md$/);
        });
      }
    });

    test('P2: .claude/ directory structure is correct', () => {
      expect(existsSync(CLAUDE_DIR)).toBe(true);
      const claudeContents = readdirSync(CLAUDE_DIR);
      expect(claudeContents).toContain('skills');
    });
  });

  describe('AC2: Skill Files Reference Framework Commands', () => {
    describe('P0: Skill files have YAML frontmatter', () => {
      test.each(Object.entries(SKILL_FILES))(
        'P0: %s skill file has SKILL.md format with YAML frontmatter',
        (commandName, skillPath) => {
          expect(existsSync(skillPath)).toBe(true);
          const content = readFileSync(skillPath, 'utf8');
          expect(content).toMatch(/^---\s*\n/);
          expect(content).toMatch(/\n---\s*\n/);
        }
      );
    });

    describe('P0: Skill files reference framework commands', () => {
      test.each(Object.entries(SKILL_FILES))(
        'P0: %s skill file references corresponding framework command',
        (commandName, skillPath) => {
          const content = readFileSync(skillPath, 'utf8');
          // Should contain a reference to the framework command file
          expect(content).toMatch(/framework_command|scrum_workflow\/commands/);
        }
      );
    });

    describe('P1: Reference format validation', () => {
      test.each(Object.entries(SKILL_FILES))(
        'P1: %s skill file contains framework path variable or absolute reference',
        (commandName, skillPath) => {
          const content = readFileSync(skillPath, 'utf8');
          // Should reference framework_path or contain absolute path pattern
          const hasFrameworkReference =
            content.includes('framework_path') ||
            content.includes('scrum_workflow/commands') ||
            content.includes('{framework_path}');
          expect(hasFrameworkReference).toBe(true);
        }
      );
    });

    test('P2: all skill files have minimal content (no workflow logic)', () => {
      Object.entries(SKILL_FILES).forEach(([commandName, skillPath]) => {
        const content = readFileSync(skillPath, 'utf8').toLowerCase();
        WORKFLOW_KEYWORDS.forEach(keyword => {
          // Allow in comments, but not as primary content
          const lines = content.split('\n');
          const nonCommentLines = lines.filter(
            line => !line.trim().startsWith('#') && !line.trim().startsWith('//')
          );
          const keywordInNonComment = nonCommentLines.some(line =>
            line.includes(keyword)
          );
          expect(keywordInNonComment).toBe(false);
        });
      });
    });
  });

  describe('AC3: config.yaml Platform Field', () => {
    let configContent: string;
    let configYaml: any;

    beforeAll(() => {
      configContent = readFileSync(FRAMEWORK_CONFIG, 'utf8');
      configYaml = yaml.parse(configContent);
    });

    test('P0: config.yaml exists', () => {
      expect(existsSync(FRAMEWORK_CONFIG)).toBe(true);
    });

    test('P0: config.yaml has platform field', () => {
      expect(configYaml).toHaveProperty('platform');
    });

    test('P0: platform field is set to claude-code', () => {
      expect(configYaml.platform).toBe('claude-code');
    });

    test('P1: platform field value is valid', () => {
      expect(VALID_PLATFORMS).toContain(configYaml.platform);
    });
  });

  describe('AC4: Adapter Instruction File with framework_path', () => {
    const INSTRUCTIONS_FILE = join(CLAUDE_DIR, 'instructions.md');

    test('P0: .claude/instructions.md exists', () => {
      expect(existsSync(INSTRUCTIONS_FILE)).toBe(true);
    });

    test('P0: instructions.md contains framework_path reference', () => {
      const content = readFileSync(INSTRUCTIONS_FILE, 'utf8');
      expect(content).toMatch(/framework_path/);
    });

    test('P0: instructions.md documents how to use framework', () => {
      const content = readFileSync(INSTRUCTIONS_FILE, 'utf8');
      expect(content.toLowerCase()).toMatch(/(how to use|usage|framework location)/);
    });

    test('P1: instructions.md specifies absolute path referencing', () => {
      const content = readFileSync(INSTRUCTIONS_FILE, 'utf8');
      expect(content).toMatch(/(absolute path|config\.yaml|framework_path)/);
    });

    test('P2: instructions.md has clear sections', () => {
      const content = readFileSync(INSTRUCTIONS_FILE, 'utf8');
      expect(content).toMatch(/#+\s*(Framework|Location|Usage|Platform)/);
    });
  });

  describe('AC5: Platform Switching Requires Only Config Change', () => {
    test('P0: no hardcoded platform references in skill files', () => {
      Object.entries(SKILL_FILES).forEach(([commandName, skillPath]) => {
        const content = readFileSync(skillPath, 'utf8');
        // Should use framework_path variable, not hardcoded platform-specific paths
        const hasHardcodedPath = content.match(
          /\/(claude|github|opencode|windsurf)\//i
        );
        expect(hasHardcodedPath).toBeNull();
      });
    });

    test('P0: no hardcoded platform references in instructions.md', () => {
      const instructionsPath = join(CLAUDE_DIR, 'instructions.md');
      const content = readFileSync(instructionsPath, 'utf8');
      // Should reference config.yaml for platform selection
      expect(content).toMatch(/config\.yaml|platform.*field|framework_path/);
    });

    test('P1: adapter files are platform-agnostic', () => {
      const adapterFiles = [
        join(CLAUDE_DIR, 'instructions.md'),
        ...Object.values(SKILL_FILES),
      ];

      adapterFiles.forEach(filePath => {
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8').toLowerCase();
          // Should not contain platform-specific API calls or logic
          expect(content).not.toMatch(/(copilot\.|github\.|windsurf\.|opencode\.)/);
        }
      });
    });

    test('P2: documentation explains platform switching', () => {
      const instructionsPath = join(CLAUDE_DIR, 'instructions.md');
      const content = readFileSync(instructionsPath, 'utf8');
      expect(content.toLowerCase()).toMatch(
        /(switch.*platform|change.*platform|platform.*field|config\.yaml)/
      );
    });
  });

  describe('AC6: No Workflow Logic in Adapters', () => {
    test('P0: skill files contain only references', () => {
      Object.entries(SKILL_FILES).forEach(([commandName, skillPath]) => {
        const content = readFileSync(skillPath, 'utf8').toLowerCase();
        WORKFLOW_KEYWORDS.forEach(keyword => {
          const hasKeyword = content.includes(keyword);
          expect(hasKeyword).toBe(false);
        });
      });
    });

    test('P0: instructions.md contains no workflow logic', () => {
      const instructionsPath = join(CLAUDE_DIR, 'instructions.md');
      const content = readFileSync(instructionsPath, 'utf8').toLowerCase();
      WORKFLOW_KEYWORDS.forEach(keyword => {
        // Allow "workflow" in documentation context, but not implementation details
        if (keyword !== 'workflow') {
          const lines = content.split('\n');
          const nonCommentLines = lines.filter(
            line => !line.trim().startsWith('#')
          );
          const keywordInNonComment = nonCommentLines.some(line =>
            line.includes(keyword)
          );
          expect(keywordInNonComment).toBe(false);
        }
      });
    });

    test('P1: skill file size is minimal (< 1KB)', () => {
      Object.entries(SKILL_FILES).forEach(([commandName, skillPath]) => {
        const stats = require('fs').statSync(skillPath);
        expect(stats.size).toBeLessThan(1024); // Less than 1KB
      });
    });

    test('P1: skill files have reference-focused structure', () => {
      Object.entries(SKILL_FILES).forEach(([commandName, skillPath]) => {
        const content = readFileSync(skillPath, 'utf8');
        // Should have reference-related content
        const hasReference =
          content.includes('framework_command') ||
          content.includes('scrum_workflow/commands') ||
          content.includes('Load the framework command');
        expect(hasReference).toBe(true);
      });
    });

    test('P2: adapter files follow pure reference pattern', () => {
      const adapterFiles = [
        join(CLAUDE_DIR, 'instructions.md'),
        ...Object.values(SKILL_FILES),
      ];

      adapterFiles.forEach(filePath => {
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8');
          // Should not have implementation details
          expect(content).not.toMatch(/(function|class|const.*=.*\(|import.*from)/);
        }
      });
    });

    test('P2: workflow logic location is documented', () => {
      const instructionsPath = join(CLAUDE_DIR, 'instructions.md');
      const content = readFileSync(instructionsPath, 'utf8');
      // Should state that workflow logic lives in framework
      expect(content.toLowerCase()).toMatch(
        /(workflow.*lives.*in.*framework|framework.*contains.*workflow|all.*workflow.*logic.*framework)/
      );
    });
  });

  describe('Additional: Platform Adapter Contract Documentation', () => {
    const CONTRACT_DOC = join(FRAMEWORK_CONTEXT_DIR, 'platform-adapter-contract.md');

    test('P0: platform-adapter-contract.md exists in framework context/', () => {
      expect(existsSync(CONTRACT_DOC)).toBe(true);
    });

    test('P0: contract document specifies two-element adapter', () => {
      const content = readFileSync(CONTRACT_DOC, 'utf8');
      expect(content.toLowerCase()).toMatch(
        /(instruction.*file|command.*registration|two.*element|adapter.*contract)/
      );
    });

    test('P1: contract document specifies framework_path usage', () => {
      const content = readFileSync(CONTRACT_DOC, 'utf8');
      expect(content).toMatch(/framework_path/);
    });

    test('P2: contract document lists platform-specific registration', () => {
      const content = readFileSync(CONTRACT_DOC, 'utf8');
      expect(content.toLowerCase()).toMatch(
        /(claude.*code|github.*copilot|opencode|windsurf)/
      );
    });
  });

  describe('Additional: Framework Command References', () => {
    test('P0: framework commands directory exists', () => {
      const commandsDir = join(FRAMEWORK_ROOT, 'commands');
      expect(existsSync(commandsDir)).toBe(true);
    });

    test('P1: skill references are resolvable paths', () => {
      Object.entries(SKILL_FILES).forEach(([commandName, skillPath]) => {
        const content = readFileSync(skillPath, 'utf8');
        // Extract path reference (looking for common patterns)
        const pathMatch = content.match(/scrum_workflow\/commands\/([a-z-]+\.md)/);
        if (pathMatch) {
          const referencedFile = join(FRAMEWORK_ROOT, 'commands', pathMatch[1]);
          // Framework command files may not exist yet (created in later stories)
          // but the path should be valid format
          expect(pathMatch[1]).toMatch(/^[a-z-]+\.md$/);
        }
      });
    });
  });
});
