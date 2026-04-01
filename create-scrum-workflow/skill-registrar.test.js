import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerSkills } from './src/core/skill-registrar.js';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import fse from 'fs-extra';

// Mock fs modules
vi.mock('node:fs');
vi.mock('fs-extra');

describe('Story 8-2: Installer Pipeline Update for New Skills', () => {
  describe('Skill Registrar - Auto-Discovery (AC1)', () => {
    const mockTemplateDir = '/mock/templates/skill-registrations';
    const mockPlatformDir = '/mock/.claude/skills';
    const mockConfig = {
      platforms: ['claude-code'],
      frameworkPath: 'scrum_workflow'
    };
    const mockPaths = {
      skillTemplateDir: mockTemplateDir,
      platformDirs: new Map([['claude-code', mockPlatformDir]])
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test.skip('[P0] should auto-discover all 6 skill template directories via readdirSync', () => {
      // THIS TEST WILL FAIL - Need to verify readdirSync discovers all templates
      const sixSkillNames = [
        'scrum-create-project-context',
        'scrum-create-ticket',
        'scrum-refine-ticket',
        'scrum-dev-story',
        'scrum-create-project-docs',
        'scrum-create-architecture-docs'
      ];

      readdirSync.mockReturnValue(sixSkillNames);
      statSync.mockReturnValue({ isDirectory: () => true });
      fse.writeFileSync.mockImplementation(() => {});
      fse.ensureDirSync.mockImplementation(() => {});

      const result = registerSkills(mockPaths, mockConfig);

      expect(result.skillCount).toBe(6);
      expect(readdirSync).toHaveBeenCalledWith(mockTemplateDir);
    });

    test.skip('[P0] should discover skills without hardcoded list', () => {
      // THIS TEST WILL FAIL - Verify no hardcoded skill limit exists
      const dynamicSkillNames = [
        'scrum-create-project-context',
        'scrum-create-ticket',
        'scrum-refine-ticket',
        'scrum-dev-story',
        'scrum-create-project-docs',
        'scrum-create-architecture-docs',
        'future-skill-not-yet-created'
      ];

      readdirSync.mockReturnValue(dynamicSkillNames);
      statSync.mockReturnValue({ isDirectory: () => true });
      fse.writeFileSync.mockImplementation(() => {});
      fse.ensureDirSync.mockImplementation(() => {});

      const result = registerSkills(mockPaths, mockConfig);

      expect(result.skillCount).toBe(7); // All skills discovered
      expect(result.skillCount).toBeGreaterThan(6); // Proves dynamic discovery
    });
  });

  describe('Skill Registrar - Framework Path Substitution (AC3, AC4)', () => {
    const mockTemplateContent = '---\nname: {{framework_path}}/commands/create-project-docs\ndescription: Test\n---\nSome content with {{framework_path}} reference';
    const mockTemplateDir = '/mock/templates/skill-registrations';
    const mockPlatformDir = '/mock/.claude/skills';
    const mockConfig = {
      platforms: ['claude-code'],
      frameworkPath: 'scrum_workflow'
    };
    const mockPaths = {
      skillTemplateDir: mockTemplateDir,
      platformDirs: new Map([['claude-code', mockPlatformDir]])
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test.skip('[P0] should substitute {{framework_path}} placeholder in all 6 skills', () => {
      // THIS TEST WILL FAIL - Need to verify substitution works
      readdirSync.mockReturnValue(['scrum-create-project-docs']);
      statSync.mockReturnValue({ isDirectory: () => true });
      readFileSync.mockReturnValue(mockTemplateContent);
      fse.ensureDirSync.mockImplementation(() => {});
      
      let writtenContent;
      fse.writeFileSync.mockImplementation((path, content) => {
        writtenContent = content;
      });

      registerSkills(mockPaths, mockConfig);

      expect(writtenContent).toContain('scrum_workflow');
      expect(writtenContent).not.toContain('{{framework_path}}');
    });

    test.skip('[P0] should generate valid YAML frontmatter for all skills', () => {
      // THIS TEST WILL FAIL - Need to verify YAML validity
      const validYAMLTemplate = '---\nname: scrum-create-project-docs\ndescription: Create project documentation\n---\nContent';
      
      readdirSync.mockReturnValue(['scrum-create-project-docs']);
      statSync.mockReturnValue({ isDirectory: () => true });
      readFileSync.mockReturnValue(validYAMLTemplate);
      fse.ensureDirSync.mockImplementation(() => {});
      fse.writeFileSync.mockImplementation(() => {});

      registerSkills(mockPaths, mockConfig);

      // Verify YAML frontmatter exists and is valid
      const calls = fse.writeFileSync.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      
      const content = calls[0][1];
      expect(content).toMatch(/^---\nname:/); // Valid YAML frontmatter
      expect(content).not.toContain('display_name:'); // Should not have deprecated field
      expect(content).not.toContain('active_in:'); // Should not have deprecated field
    });

    test.skip('[P1] should match name field to directory name', () => {
      // THIS TEST WILL FAIL - Need to verify name matches directory
      readdirSync.mockReturnValue(['scrum-create-project-docs']);
      statSync.mockReturnValue({ isDirectory: () => true });
      readFileSync.mockReturnValue(mockTemplateContent);
      fse.ensureDirSync.mockImplementation(() => {});
      fse.writeFileSync.mockImplementation(() => {});

      registerSkills(mockPaths, mockConfig);

      const calls = fse.writeFileSync.mock.calls;
      const content = calls[0][1];
      // Extract name from YAML frontmatter
      const nameMatch = content.match(/^---\nname: (.+?)\n/);
      expect(nameMatch).toBeTruthy();
      expect(nameMatch[1]).toBe('scrum-create-project-docs');
    });
  });

  describe('Installer - Multi-Platform Support (AC2)', () => {
    test.skip('[P0] should copy all 6 skills to multiple platform directories', () => {
      // THIS TEST WILL FAIL - Need to verify multi-platform copy
      const mockPaths = {
        skillTemplateDir: '/mock/templates',
        platformDirs: new Map([
          ['claude-code', '/mock/.claude/skills'],
          ['cursor', '/mock/.cursor/skills']
        ])
      };
      const mockConfig = {
        platforms: ['claude-code', 'cursor'],
        frameworkPath: 'scrum_workflow'
      };

      readdirSync.mockReturnValue([
        'scrum-create-project-context',
        'scrum-create-ticket',
        'scrum-refine-ticket',
        'scrum-dev-story',
        'scrum-create-project-docs',
        'scrum-create-architecture-docs'
      ]);
      statSync.mockReturnValue({ isDirectory: () => true });
      readFileSync.mockReturnValue('content');
      fse.ensureDirSync.mockImplementation(() => {});
      fse.writeFileSync.mockImplementation(() => {});

      const result = registerSkills(mockPaths, mockConfig);

      // Should copy 6 skills to 2 platforms = 12 writes
      expect(fse.writeFileSync).toHaveBeenCalledTimes(12);
      expect(result.platformCount).toBe(2);
      expect(result.skillCount).toBe(6);
    });
  });

  describe('Lock File Generation (AC5)', () => {
    test.skip('[P0] should include all 6 skill files in lock file', async () => {
      // THIS TEST WILL FAIL - Need to verify lock file completeness
      const { Installer } = await import('./src/core/installer.js');
      
      // Mock hashDirectory to return hashes
      vi.mock('../src/integrity/hash-tracker.js', () => ({
        hashDirectory: vi.fn(() => ({
          'scrum-create-project-context/SKILL.md': 'abc123',
          'scrum-create-ticket/SKILL.md': 'def456',
          'scrum-refine-ticket/SKILL.md': 'ghi789',
          'scrum-dev-story/SKILL.md': 'jkl012',
          'scrum-create-project-docs/SKILL.md': 'mno345',
          'scrum-create-architecture-docs/SKILL.md': 'pqr678'
        }))
      }));

      const installer = new Installer({
        directory: '/mock/target',
        platforms: ['claude-code'],
        frameworkPath: 'scrum_workflow'
      });

      await installer.generateLockFile();

      // Verify lock file contains all 6 skills
      // This will fail until lock file generation is complete
      const lockFileData = await installer.getLockFileData();
      expect(Object.keys(lockFileData.files)).toContain('scrum-create-project-docs/SKILL.md');
      expect(Object.keys(lockFileData.files)).toContain('scrum-create-architecture-docs/SKILL.md');
    });
  });

  describe('Install Summary (AC6)', () => {
    test.skip('[P0] should display summary with correct skill count (6)', async () => {
      // THIS TEST WILL FAIL - Need to verify summary output
      const { Installer } = await import('./src/core/installer.js');
      
      const mockConsole = {
        log: vi.fn()
      };
      global.console = mockConsole;

      const installer = new Installer({
        directory: '/mock/target',
        platforms: ['claude-code'],
        frameworkPath: 'scrum_workflow'
      });

      // Mock registerSkills to return 6 skills
      vi.spyOn(installer, 'registerSkills').mockReturnValue({
        skillCount: 6,
        platformCount: 1
      });

      installer.printSummary();

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('6 skills')
      );
    });
  });
});