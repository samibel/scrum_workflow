import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  parsePlatformRegistry,
  extractTargetDirs,
  verifySkillFormatConsistency,
  parseFallbackScanConfig,
  identifyPlatformsFallbackScan,
  validateSkillList,
  detectMissingSkills,
  verifyFallbackDirectoriesExist
} from '../../src/validation/validation-utils.js';

// Mock fs modules
vi.mock('node:fs');
vi.mock('js-yaml', () => ({
  load: vi.fn((content) => {
    // Simple YAML parser for testing
    const lines = content.split('\n');
    const result = { platforms: {} };
    let currentPlatform = null;
    let inFallback = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.endsWith(':') && !trimmed.startsWith('-')) {
        currentPlatform = trimmed.slice(0, -1);
        result.platforms[currentPlatform] = {};
        inFallback = false;
      } else if (trimmed === 'fallback_scan:') {
        inFallback = true;
        result.platforms[currentPlatform].fallback_scan = [];
      } else if (inFallback && trimmed.startsWith('- ')) {
        result.platforms[currentPlatform].fallback_scan.push(trimmed.slice(2));
      } else if (trimmed.includes(':')) {
        const [key, value] = trimmed.split(':').map(s => s.trim());
        if (currentPlatform && key !== 'fallback_scan') {
          result.platforms[currentPlatform][key] = value;
        }
      }
    }

    return result;
  })
}));

/**
 * Story 8-4: Platform Registry Validation for New Skills
 * Unit Tests for Platform Configuration Parsing
 *
 * TDD RED PHASE: All tests use test() and will FAIL until implementation is complete.
 */

describe('Story 8-4: Platform Configuration Parsing (Unit Tests)', () => {
  /**
   * AC1: Cross-Platform Skill Creation Verification
   */

  describe('AC1: Platform Registry Parsing', () => {
    test('[P1] should parse platform-registry.yaml correctly', async () => {
      // THIS TEST WILL FAIL - Registry parsing not implemented yet
      const mockRegistryContent = `
claude-code:
  display_name: Claude Code
  category: ide
  target_dir: .claude/skills
  skill_format: skill-md

cursor:
  display_name: Cursor
  category: ide
  target_dir: .cursor/skills
  skill_format: skill-md
  fallback_scan:
    - .claude/skills
    - .agents/skills

windsurf:
  display_name: Windsurf
  category: ide
  target_dir: .windsurf/skills
  skill_format: skill-md
  fallback_scan:
    - .claude/skills
    - .agents/skills
      `;

      vi.mocked(readFileSync).mockReturnValue(mockRegistryContent);

      // This will fail until parsePlatformRegistry is implemented
      const registry = parsePlatformRegistry('/mock/path/platform-registry.yaml');

      // Verify registry structure
      expect(registry).toBeDefined();
      expect(registry['claude-code']).toBeDefined();
      expect(registry['cursor']).toBeDefined();
      expect(registry['windsurf']).toBeDefined();

      // Verify platform properties
      expect(registry['claude-code'].display_name).toBe('Claude Code');
      expect(registry['claude-code'].target_dir).toBe('.claude/skills');
      expect(registry['claude-code'].skill_format).toBe('skill-md');
    });

    test('[P1] should extract target_dir for all platforms', async () => {
      // THIS TEST WILL FAIL - target_dir extraction not implemented yet
      const mockRegistry = {
        'claude-code': { target_dir: '.claude/skills' },
        'cursor': { target_dir: '.cursor/skills' },
        'windsurf': { target_dir: '.windsurf/skills' },
        'github-copilot': { target_dir: '.github/skills' },
        'cline': { target_dir: '.cline/skills' },
        'agents-universal': { target_dir: '.agents/skills' }
      };

      // This will fail until extractTargetDirs is implemented
      const targetDirs = extractTargetDirs(mockRegistry);

      // Verify all target directories are extracted
      expect(targetDirs).toEqual({
        'claude-code': '.claude/skills',
        'cursor': '.cursor/skills',
        'windsurf': '.windsurf/skills',
        'github-copilot': '.github/skills',
        'cline': '.cline/skills',
        'agents-universal': '.agents/skills'
      });
    });

    test('[P2] should verify skill format consistency across platforms', async () => {
      // THIS TEST WILL FAIL - Format verification not implemented yet
      const mockRegistry = {
        'claude-code': { skill_format: 'skill-md' },
        'cursor': { skill_format: 'skill-md' },
        'windsurf': { skill_format: 'skill-md' },
        'github-copilot': { skill_format: 'skill-md' },
        'cline': { skill_format: 'skill-md' },
        'agents-universal': { skill_format: 'skill-md' }
      };

      // This will fail until verifySkillFormatConsistency is implemented
      const isConsistent = verifySkillFormatConsistency(mockRegistry);

      // Verify all platforms use skill-md format
      expect(isConsistent).toBe(true);
    });
  });

  /**
   * AC2: Fallback Scan Configuration
   */

  describe('AC2: Fallback Scan Configuration Parsing', () => {
    test('[P1] should parse fallback_scan configuration for platforms that have it', async () => {
      // THIS TEST WILL FAIL - Fallback scan parsing not implemented yet
      const mockRegistry = {
        'cursor': {
          target_dir: '.cursor/skills',
          fallback_scan: ['.claude/skills', '.agents/skills']
        },
        'windsurf': {
          target_dir: '.windsurf/skills',
          fallback_scan: ['.claude/skills', '.agents/skills']
        },
        'cline': {
          target_dir: '.cline/skills',
          fallback_scan: ['.claude/skills']
        },
        'claude-code': {
          target_dir: '.claude/skills'
        }
      };

      // This will fail until parseFallbackScanConfig is implemented
      const fallbackConfigs = parseFallbackScanConfig(mockRegistry);

      // Verify platforms with fallback_scan
      expect(fallbackConfigs['cursor']).toEqual(['.claude/skills', '.agents/skills']);
      expect(fallbackConfigs['windsurf']).toEqual(['.claude/skills', '.agents/skills']);
      expect(fallbackConfigs['cline']).toEqual(['.claude/skills']);

      // Verify platforms without fallback_scan return empty array or null
      expect(fallbackConfigs['claude-code']).toBeUndefined();
    });

    test('[P2] should identify platforms with fallback scan capability', async () => {
      // THIS TEST WILL FAIL - Platform identification not implemented yet
      const mockRegistry = {
        'cursor': { fallback_scan: ['.claude/skills'] },
        'windsurf': { fallback_scan: ['.claude/skills'] },
        'cline': { fallback_scan: ['.claude/skills'] },
        'claude-code': {},
        'github-copilot': {},
        'agents-universal': {}
      };

      // This will fail until identifyPlatformsFallbackScan is implemented
      const platformsWithFallback = identifyPlatformsFallbackScan(mockRegistry);

      // Verify only platforms with fallback_scan are identified
      expect(platformsWithFallback).toEqual(['cursor', 'windsurf', 'cline']);
    });

    test('[P2] should verify fallback directories exist in target directories', async () => {
      // THIS TEST WILL FAIL - Directory verification not implemented yet
      const mockInstalledDirs = ['.claude/skills', '.cursor/skills', '.agents/skills'];
      const fallbackConfig = {
        'cursor': ['.claude/skills', '.agents/skills']
      };

      // This will fail until verifyFallbackDirectoriesExist is implemented
      const verificationResult = verifyFallbackDirectoriesExist(fallbackConfig, mockInstalledDirs);

      // Verify fallback directories exist
      expect(verificationResult['cursor']['.claude/skills']).toBe(true);
      expect(verificationResult['cursor']['.agents/skills']).toBe(true);
    });
  });

  /**
   * Skill List Validation
   */

  describe('Skill List Validation', () => {
    test('[P0] should verify all 6 skills are in the skill list', async () => {
      // THIS TEST WILL FAIL - Skill list validation not implemented yet
      const expectedSkills = [
        'scrum-create-project-context',
        'scrum-create-ticket',
        'scrum-refine-ticket',
        'scrum-dev-story',
        'scrum-create-project-docs',
        'scrum-create-architecture-docs'
      ];

      const actualSkills = [
        'scrum-create-project-context',
        'scrum-create-ticket',
        'scrum-refine-ticket',
        'scrum-dev-story',
        'scrum-create-project-docs',
        'scrum-create-architecture-docs'
      ];

      // This will fail until validateSkillList is implemented
      const validation = validateSkillList(expectedSkills, actualSkills);

      // Verify all skills are present
      expect(validation.allPresent).toBe(true);
      expect(validation.missing).toEqual([]);
    });

    test('[P1] should detect missing skills', async () => {
      // THIS TEST WILL FAIL - Missing skill detection not implemented yet
      const expectedSkills = [
        'scrum-create-project-context',
        'scrum-create-ticket',
        'scrum-refine-ticket',
        'scrum-dev-story',
        'scrum-create-project-docs',
        'scrum-create-architecture-docs'
      ];

      const actualSkills = [
        'scrum-create-project-context',
        'scrum-create-ticket',
        'scrum-refine-ticket',
        'scrum-dev-story'
        // Missing: scrum-create-project-docs, scrum-create-architecture-docs
      ];

      // This will fail until detectMissingSkills is implemented
      const missing = detectMissingSkills(expectedSkills, actualSkills);

      // Verify missing skills are detected
      expect(missing).toEqual([
        'scrum-create-project-docs',
        'scrum-create-architecture-docs'
      ]);
    });
  });
});
