/**
 * ATDD Tests for AC4: Full FR-44 Compliance Verification
 *
 * TDD Phase: RED (tests will fail until feature is verified)
 * Test Level: Integration (Cross-Component Compliance)
 * Test Framework: Vitest with TypeScript
 * Story: 1.7 - Verify & Align Runtime Extension Model
 *
 * PRD References:
 * - FR-44: Framework extends through files — full specification compliance
 *
 * AC4: Given all deltas have been resolved
 *      When the implementation is reviewed
 *      Then the runtime extension model fully matches the current PRD and Architecture specifications
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// ============================================================================
// AC4: Full FR-44 Compliance — Extension model matches PRD and Architecture
// ============================================================================

describe('AC4: Runtime Extension Model Matches PRD and Architecture Specifications', () => {
  const frameworkRoot = join(process.cwd(), 'scrum_workflow');
  const storyFile = join(process.cwd(), '_scrum-output', 'implementation-artifacts', '1-7-verify-align-runtime-extension-model.md');
  const architectureFile = join(process.cwd(), '_scrum-output', 'planning-artifacts', 'architecture.md');

  // Test 4.1: All four extension types support file-based discovery
  test.skip('[P0] All four extension types (skills, workflows, agents, commands) should use file-based specifications', () => {
    const extensionDirs = ['skills', 'workflows', 'agents', 'commands'];

    for (const dir of extensionDirs) {
      const dirPath = join(frameworkRoot, dir);
      expect(existsSync(dirPath)).toBe(true);

      const entries = readdirSync(dirPath, { recursive: true }) as string[];
      const mdFiles = entries.filter((e) => typeof e === 'string' && e.endsWith('.md') && !e.includes('README'));

      // Each extension type must have at least one .md specification
      expect(mdFiles.length).toBeGreaterThan(0);
    }
  });

  // Test 4.2: Skills follow FR-44 zero-config extensibility (add file = new capability)
  test.skip('[P0] Skills directory should enforce zero-config extensibility (FR-44, NFR-11)', () => {
    const skillsDir = join(frameworkRoot, 'skills');
    const entries = readdirSync(skillsDir);
    const skillDirs = entries.filter((e) => {
      const fullPath = join(skillsDir, e);
      return statSync(fullPath).isDirectory() && !e.startsWith('.');
    });

    // Each skill directory must have SKILL.md (uppercase — naming convention enforced)
    for (const skillDir of skillDirs) {
      const skillPath = join(skillsDir, skillDir, 'SKILL.md');
      expect(existsSync(skillPath)).toBe(true);

      // Skill file must be readable as plain text (no compilation required)
      const content = readFileSync(skillPath, 'utf8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  // Test 4.3: Framework files are Markdown-as-Code (pure Markdown/YAML, no compilation)
  test.skip('[P0] All framework specification files should be readable as plain Markdown/YAML', () => {
    const extensionDirs = ['skills', 'workflows', 'agents', 'commands'];

    for (const dir of extensionDirs) {
      const dirPath = join(frameworkRoot, dir);
      if (!existsSync(dirPath)) continue;

      const entries = readdirSync(dirPath, { recursive: true }) as string[];
      const mdFiles = entries.filter((e) => typeof e === 'string' && e.endsWith('.md') && !e.includes('README'));

      for (const mdFile of mdFiles) {
        const fullPath = join(dirPath, mdFile);
        // Each file must be readable as plain text
        const content = readFileSync(fullPath, 'utf8');
        expect(content).toBeTruthy();
        // Content must contain at minimum a Markdown header or YAML frontmatter
        expect(content).toMatch(/---\n|^#/m);
      }
    }
  });

  // Test 4.4: Architecture documentation reflects actual implementation
  test.skip('[P0] Architecture documentation should accurately describe the extension model', () => {
    expect(existsSync(architectureFile)).toBe(true);

    const archContent = readFileSync(architectureFile, 'utf8');
    // Architecture must document framework structure
    expect(archContent).toMatch(/scrum_workflow/);
    // Must reference at least skills and workflows
    expect(archContent).toMatch(/skills/);
    expect(archContent).toMatch(/workflows/);
  });

  // Test 4.5: Story documents complete FR-44 compliance verification
  test.skip('[P0] Story should document complete FR-44 compliance verification with all five requirements', () => {
    expect(existsSync(storyFile)).toBe(true);

    const storyContent = readFileSync(storyFile, 'utf8');

    // All five FR-44 requirements must be verified
    expect(storyContent).toMatch(/File-based extension|file.based extension/i);
    expect(storyContent).toMatch(/No configuration change|no config/i);
    expect(storyContent).toMatch(/No build step|no build/i);
    expect(storyContent).toMatch(/No service restart|no.*restart/i);
    expect(storyContent).toMatch(/Runtime discovery|runtime.*discover/i);
  });

  // Test 4.6: All five FR-44 requirements are marked COMPLIANT in story
  test.skip('[P0] All FR-44 requirements should be marked as COMPLIANT in the story', () => {
    const storyContent = readFileSync(storyFile, 'utf8');

    // Must explicitly mark compliance
    const compliantMatches = storyContent.match(/COMPLIANT/g);
    expect(compliantMatches).not.toBeNull();
    expect(compliantMatches!.length).toBeGreaterThanOrEqual(5);
  });

  // Test 4.7: Story status is marked as done (AC4 completion gate)
  test.skip('[P0] Story status should be "done" after all deltas resolved', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    expect(storyContent).toMatch(/Status: done/i);
  });

  // Test 4.8: Installer behavior is documented as separate from runtime extension
  test.skip('[P1] CLI installer behavior should be documented as separate from FR-44 runtime extension', () => {
    const storyContent = readFileSync(storyFile, 'utf8');
    // Must clarify the distinction between installation and runtime extension
    expect(storyContent).toMatch(/installer|Installer/);
    expect(storyContent).toMatch(/separate.*concern|distribution.*separate|installer.*distribut/i);
  });

  // Test 4.9: Three synchronized copies are confirmed
  test.skip('[P1] Three synchronized copies of framework should exist', () => {
    const primaryFramework = join(process.cwd(), 'scrum_workflow', 'skills', 'readiness-check', 'SKILL.md');
    const copy1 = join(process.cwd(), 'create-scrum-workflow', 'scrum_workflow', 'skills', 'readiness-check', 'SKILL.md');
    const copy2 = join(
      process.cwd(),
      'create-scrum-workflow',
      'templates',
      'scrum_workflow',
      'skills',
      'readiness-check',
      'SKILL.md',
    );

    expect(existsSync(primaryFramework)).toBe(true);
    expect(existsSync(copy1)).toBe(true);
    expect(existsSync(copy2)).toBe(true);
  });
});
