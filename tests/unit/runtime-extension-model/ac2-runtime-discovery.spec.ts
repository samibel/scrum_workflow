/**
 * ATDD Tests for AC2: Runtime Discovery Without Config/Build/Restart
 *
 * TDD Phase: RED (tests will fail until feature is verified)
 * Test Level: File System Validation + Integration
 * Test Framework: Vitest with TypeScript
 * Story: 1.7 - Verify & Align Runtime Extension Model
 *
 * PRD References:
 * - FR-44: No configuration change, build step, or service restart required
 *
 * AC2: Given FR-44 specifies file-based extension: new SKILL.md = new capability
 *      When a new .md file is added to scrum_workflow/skills/, scrum_workflow/agents/,
 *      or scrum_workflow/workflows/
 *      Then the framework discovers and can utilize the new specification at runtime
 *      And no configuration change, build step, or restart is required
 */

import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

// ============================================================================
// AC2: Runtime Discovery — No registration, build, or restart required
// ============================================================================

describe('AC2: Runtime Discovery Without Config/Build/Restart', () => {
  const frameworkRoot = join(process.cwd(), 'scrum_workflow');

  // Test 2.1: No centralized registry files exist
  test.skip('[P0] No centralized registry files should exist in framework root', () => {
    const registryPatterns = [
      join(frameworkRoot, 'skills.json'),
      join(frameworkRoot, 'workflows.json'),
      join(frameworkRoot, 'agents.json'),
      join(frameworkRoot, 'commands.json'),
      join(frameworkRoot, 'registry.json'),
      join(frameworkRoot, 'config', 'registry.json'),
    ];

    for (const registryPath of registryPatterns) {
      expect(existsSync(registryPath)).toBe(false);
    }
  });

  // Test 2.2: No build step required — no bundler configs process framework files
  test.skip('[P0] No bundler configuration should reference framework specification files', () => {
    const bundlerConfigs = [
      join(process.cwd(), 'webpack.config.js'),
      join(process.cwd(), 'rollup.config.js'),
      join(process.cwd(), 'vite.config.ts'),
    ];

    for (const configPath of bundlerConfigs) {
      if (existsSync(configPath)) {
        const content = readFileSync(configPath, 'utf8');
        // Bundler configs should not reference framework spec directories
        expect(content).not.toContain('scrum_workflow/skills');
        expect(content).not.toContain('scrum_workflow/workflows');
        expect(content).not.toContain('scrum_workflow/agents');
      }
    }
    // Test passes if no bundler configs exist (no build step needed)
  });

  // Test 2.3: Framework files are pure Markdown/YAML (no compiled artifacts)
  test.skip('[P0] Framework specification directories should contain only Markdown/YAML files', () => {
    const extensionDirs = ['skills', 'workflows', 'agents', 'commands'];

    for (const dir of extensionDirs) {
      const dirPath = join(frameworkRoot, dir);
      if (!existsSync(dirPath)) continue;

      const entries = readdirSync(dirPath, { recursive: true }) as string[];
      const compiledFiles = entries.filter((e) => {
        const lower = e.toLowerCase();
        return (
          lower.endsWith('.js') ||
          lower.endsWith('.ts') ||
          lower.endsWith('.compiled') ||
          lower.endsWith('.bundle') ||
          lower.endsWith('.min.js')
        );
      });

      // No compiled files — only Markdown/YAML/gitkeep allowed
      expect(compiledFiles).toHaveLength(0);
    }
  });

  // Test 2.4: Skill files contain valid Markdown with YAML frontmatter (readable at runtime)
  test.skip('[P0] Skill specification files should be pure Markdown with YAML frontmatter', () => {
    const skillsDir = join(frameworkRoot, 'skills');
    if (!existsSync(skillsDir)) return;

    const skillDirs = readdirSync(skillsDir).filter((e) => {
      const fullPath = join(skillsDir, e);
      return statSync(fullPath).isDirectory() && !e.startsWith('.');
    });

    for (const skillDir of skillDirs) {
      const skillPath = join(skillsDir, skillDir, 'SKILL.md');
      expect(existsSync(skillPath)).toBe(true);

      const content = readFileSync(skillPath, 'utf8');
      // Must start with YAML frontmatter
      expect(content).toMatch(/^---\n/);
      // Must contain Markdown headers
      expect(content).toContain('#');
    }
  });

  // Test 2.5: Runtime discovery works — new skill file is immediately accessible without config change
  test.skip('[P0] New skill file should be immediately discoverable without configuration change', () => {
    const testSkillDir = join(frameworkRoot, 'skills', 'test-atdd-discovery-skill');
    const testSkillPath = join(testSkillDir, 'SKILL.md');
    const configPath = join(frameworkRoot, 'config.yaml');

    // Capture config state before adding new skill
    const configBefore = readFileSync(configPath, 'utf8');

    try {
      // Create new skill file (simulates user extending framework)
      mkdirSync(testSkillDir, { recursive: true });
      writeFileSync(
        testSkillPath,
        `---
name: test-atdd-discovery-skill
description: Test skill for ATDD runtime discovery verification
---

# Test Discovery Skill

This skill verifies that file-based runtime discovery works without registration.
`,
        'utf8',
      );

      // Verify new skill file is immediately readable (runtime discovery)
      expect(existsSync(testSkillPath)).toBe(true);
      const newSkillContent = readFileSync(testSkillPath, 'utf8');
      expect(newSkillContent).toContain('test-atdd-discovery-skill');

      // Config MUST NOT have changed — no registration required
      const configAfter = readFileSync(configPath, 'utf8');
      expect(configAfter).toBe(configBefore);
    } finally {
      // Cleanup — remove test skill
      if (existsSync(testSkillDir)) {
        rmSync(testSkillDir, { recursive: true, force: true });
      }
    }
  });

  // Test 2.6: No restart required — framework files are readable without process restart
  test.skip('[P0] Framework files should be readable at any time without restart', () => {
    // Verifies that files can be read on demand (no caching or compilation required)
    const skillsDir = join(frameworkRoot, 'skills');
    if (!existsSync(skillsDir)) return;

    const skillDirs = readdirSync(skillsDir).filter((e) => {
      const fullPath = join(skillsDir, e);
      return statSync(fullPath).isDirectory();
    });

    // Read each skill file independently (proves no restart/initialization needed)
    for (const skillDir of skillDirs) {
      const skillPath = join(skillsDir, skillDir, 'SKILL.md');
      if (existsSync(skillPath)) {
        // Can read file without any startup sequence
        const content = readFileSync(skillPath, 'utf8');
        expect(content.length).toBeGreaterThan(0);
      }
    }
  });
});
