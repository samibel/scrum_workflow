/**
 * ATDD Tests for AC3: Directory Structure Verification
 *
 * TDD Phase: RED (tests will fail until feature is verified)
 * Test Level: Unit (File System Structure Validation)
 * Test Framework: Vitest with TypeScript
 * Story: 1.7 - Verify & Align Runtime Extension Model
 *
 * PRD References:
 * - FR-44: Framework extends through files
 * - Architecture Spec: scrum_workflow/{commands,workflows,skills,agents}/{name}/
 *
 * AC3: Given the Architecture specifies framework directory structure
 *      When the extension model is verified
 *      Then the directory structure matches: scrum_workflow/{commands,workflows,skills,agents}/{name}/
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// ============================================================================
// AC3: Directory Structure — Required directories and file conventions
// ============================================================================

describe('AC3: Framework Directory Structure', () => {
  const frameworkRoot = join(process.cwd(), 'scrum_workflow');

  // Test 3.1: Required extension directories exist
  test.skip('[P0] All four required extension directories should exist', () => {
    const requiredDirs = ['commands', 'workflows', 'skills', 'agents'];

    for (const dir of requiredDirs) {
      const dirPath = join(frameworkRoot, dir);
      expect(existsSync(dirPath)).toBe(true);
      expect(statSync(dirPath).isDirectory()).toBe(true);
    }
  });

  // Test 3.2: Skills directory follows {name}/SKILL.md subdirectory convention
  test.skip('[P0] Skills directory should follow {skill-name}/SKILL.md convention', () => {
    const skillsDir = join(frameworkRoot, 'skills');
    expect(existsSync(skillsDir)).toBe(true);

    const entries = readdirSync(skillsDir);
    const skillDirs = entries.filter((e) => {
      const fullPath = join(skillsDir, e);
      return statSync(fullPath).isDirectory() && !e.startsWith('.');
    });

    // Must have at least one skill
    expect(skillDirs.length).toBeGreaterThan(0);

    for (const skillDir of skillDirs) {
      // Each skill must have SKILL.md (uppercase) inside its directory
      const skillFilePath = join(skillsDir, skillDir, 'SKILL.md');
      expect(existsSync(skillFilePath)).toBe(true);
    }

    // No flat .md files at skills root (except README.md)
    const flatMdFiles = entries.filter((e) => e.endsWith('.md') && e !== 'README.md');
    expect(flatMdFiles).toHaveLength(0);
  });

  // Test 3.3: Skills contain known capabilities (at least readiness-check skill)
  test.skip('[P0] Skills directory should contain at least one known skill (readiness-check)', () => {
    const readinessSkillPath = join(frameworkRoot, 'skills', 'readiness-check', 'SKILL.md');
    expect(existsSync(readinessSkillPath)).toBe(true);
  });

  // Test 3.4: Workflows directory exists and contains workflow specifications
  test.skip('[P0] Workflows directory should exist and contain workflow specifications', () => {
    const workflowsDir = join(frameworkRoot, 'workflows');
    expect(existsSync(workflowsDir)).toBe(true);

    const entries = readdirSync(workflowsDir);
    const mdFiles = entries.filter((e) => e.endsWith('.md') && e !== 'README.md');

    // Must have at least one workflow definition
    expect(mdFiles.length).toBeGreaterThan(0);
  });

  // Test 3.5: Agents directory exists and contains agent specifications
  test.skip('[P0] Agents directory should exist and contain agent specifications', () => {
    const agentsDir = join(frameworkRoot, 'agents');
    expect(existsSync(agentsDir)).toBe(true);

    const entries = readdirSync(agentsDir);
    const mdFiles = entries.filter((e) => e.endsWith('.md') && e !== 'README.md');

    // Must have at least the three core agents
    expect(mdFiles.length).toBeGreaterThanOrEqual(3);
  });

  // Test 3.6: Commands directory exists and contains command specifications
  test.skip('[P0] Commands directory should exist and contain command specifications', () => {
    const commandsDir = join(frameworkRoot, 'commands');
    expect(existsSync(commandsDir)).toBe(true);

    const entries = readdirSync(commandsDir);
    const mdFiles = entries.filter((e) => e.endsWith('.md') && e !== 'README.md');

    // Must have at least one command
    expect(mdFiles.length).toBeGreaterThan(0);
  });

  // Test 3.7: Core agents exist (architect, developer, qa)
  test.skip('[P0] Core agents (architect, developer, qa) should exist', () => {
    const agentsDir = join(frameworkRoot, 'agents');
    const coreAgents = ['architect.md', 'developer.md', 'qa.md'];

    for (const agentFile of coreAgents) {
      const agentPath = join(agentsDir, agentFile);
      expect(existsSync(agentPath)).toBe(true);
    }
  });

  // Test 3.8: Core skills exist (readiness-check, story-validation, synthesis)
  test.skip('[P0] Core skills should exist with proper SKILL.md structure', () => {
    const skillsDir = join(frameworkRoot, 'skills');
    const coreSkills = ['readiness-check', 'story-validation', 'synthesis'];

    for (const skillDir of coreSkills) {
      const skillPath = join(skillsDir, skillDir, 'SKILL.md');
      expect(existsSync(skillPath)).toBe(true);
    }
  });

  // Test 3.9: Structural delta from Architecture spec is documented (flat files accepted)
  test.skip('[P1] Structural variance (flat files vs subdirectories) should be documented in story', () => {
    const storyPath = join(
      process.cwd(),
      '_bmad-output',
      'implementation-artifacts',
      '1-7-verify-align-runtime-extension-model.md',
    );
    expect(existsSync(storyPath)).toBe(true);

    const storyContent = readFileSync(storyPath, 'utf8');
    // Delta between spec (subdirectory) and implementation (flat) must be documented
    expect(storyContent).toMatch(/flat.*file|flat.*structure/i);
    // Decision to accept variance must be documented
    expect(storyContent).toMatch(/DECISION|Resolution Decision/i);
  });
});
