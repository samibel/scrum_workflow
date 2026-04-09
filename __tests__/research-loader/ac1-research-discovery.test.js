import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';
import path from 'path';
import { discoverResearchReports } from '../../scrum_workflow/utils/research-loader.js';

describe('AC#1: Research Discovery - Discover Research Reports by Tag Matching', () => {
  const researchDir = path.join(process.cwd(), '_scrum-output', 'memory', 'research');

  describe('discoverResearchReports() - Find all RR-XXX.md files', () => {
    it('should discover all RR-*.md files in research directory', () => {
      const reports = discoverResearchReports(researchDir);

      // EXPECTED BEHAVIOR (will fail until implemented)
      expect(reports).toBeInstanceOf(Array);
      expect(reports.length).toBeGreaterThan(0);
      expect(reports.every(r => /^RR-\d{3}\.md$/.test(path.basename(r)))).toBe(true);
    });

    it('should return array of absolute file paths', () => {
      const reports = discoverResearchReports(researchDir);

      // EXPECTED BEHAVIOR
      expect(Array.isArray(reports)).toBe(true);
      expect(reports.every(r => path.isAbsolute(r))).toBe(true);
    });

    it('should return empty array when research directory does not exist', () => {
      const missingDir = path.join(process.cwd(), '_nonexistent', 'research');
      const reports = discoverResearchReports(missingDir);

      // EXPECTED BEHAVIOR (graceful fallback)
      expect(reports).toEqual([]);
    });

    it('should return empty array when research directory is empty', () => {
      // Setup: Create temp directory without files
      const tempDir = path.join(process.cwd(), '_test-temp-research-empty');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      try {
        const reports = discoverResearchReports(tempDir);

        // EXPECTED BEHAVIOR
        expect(reports).toEqual([]);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should filter out non-RR-*.md files', () => {
      // Setup: Create temp directory with mixed files
      const tempDir = path.join(process.cwd(), '_test-temp-research-mixed');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Create files with various names
      fs.writeFileSync(path.join(tempDir, 'RR-001.md'), '# Research Report');
      fs.writeFileSync(path.join(tempDir, 'RR-002.md'), '# Research Report');
      fs.writeFileSync(path.join(tempDir, 'other-file.md'), '# Not research');
      fs.writeFileSync(path.join(tempDir, '.gitkeep'), '');
      fs.mkdirSync(path.join(tempDir, 'subdir'), { recursive: true });

      try {
        const reports = discoverResearchReports(tempDir);

        // EXPECTED BEHAVIOR: only RR-*.md files
        expect(reports.length).toBe(2);
        const basenames = reports.map(r => path.basename(r));
        expect(basenames).toContain('RR-001.md');
        expect(basenames).toContain('RR-002.md');
        expect(basenames.some(b => b === 'other-file.md')).toBe(false);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should handle file read errors gracefully without throwing', () => {
      // Setup: Use non-existent path to simulate error scenario
      const nonexistentPath = path.join(process.cwd(), '_nonexistent_xyz_abc');

      // EXPECTED BEHAVIOR: return empty array instead of throwing
      expect(() => {
        const reports = discoverResearchReports(nonexistentPath);
        expect(reports).toEqual([]);
      }).not.toThrow();
    });

    it('should return consistent results on multiple calls', () => {
      const reports1 = discoverResearchReports(researchDir);
      const reports2 = discoverResearchReports(researchDir);

      // EXPECTED BEHAVIOR: deterministic output
      expect(reports1).toEqual(reports2);
    });
  });

  describe('Research discovery integration with workflow', () => {
    it('should discover research from canonical _scrum-output/memory/research/ path', () => {
      const canonicalPath = path.join(process.cwd(), '_scrum-output', 'memory', 'research');
      const reports = discoverResearchReports(canonicalPath);

      // EXPECTED BEHAVIOR: works with canonical path
      expect(Array.isArray(reports)).toBe(true);
      // May be empty if no reports exist yet, but should not error
    });

    it('should work with symlinked research directory', () => {
      const originalPath = path.join(process.cwd(), '_test-temp-research-orig');
      const symlinkPath = path.join(process.cwd(), '_test-temp-research-symlink');

      fs.mkdirSync(originalPath, { recursive: true });
      fs.writeFileSync(path.join(originalPath, 'RR-001.md'), '# Report');

      try {
        // Try to create symlink (may fail on Windows)
        try {
          fs.symlinkSync(originalPath, symlinkPath, 'dir');

          const reports = discoverResearchReports(symlinkPath);

          // EXPECTED BEHAVIOR: discover through symlink
          expect(reports.length).toBe(1);
        } catch (e) {
          // Symlinks may not be supported; skip this test
          if (e.code !== 'EEXIST') {
            throw e;
          }
        }
      } finally {
        fs.rmSync(originalPath, { recursive: true, force: true });
        try {
          fs.rmSync(symlinkPath, { recursive: true, force: true });
        } catch (e) {
          // Ignore if symlink doesn't exist
        }
      }
    });
  });
});
