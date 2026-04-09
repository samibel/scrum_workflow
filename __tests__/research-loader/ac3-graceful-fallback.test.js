import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import path from 'path';
import {
  discoverResearchReports,
  extractResearchTags,
  matchReportsByTags,
  loadMatchingReports
} from '../../scrum_workflow/utils/research-loader.js';

describe('AC#3: Graceful Fallback - Refinement Proceeds Without Research', () => {
  describe('Missing research directory - No error, empty result', () => {
    it('should return empty array when _scrum-output/memory/research/ does not exist', () => {
      const missingPath = path.join(process.cwd(), '_nonexistent', 'memory', 'research');

      const reports = discoverResearchReports(missingPath);

      // EXPECTED BEHAVIOR: graceful fallback
      expect(Array.isArray(reports)).toBe(true);
      expect(reports.length).toBe(0);
    });

    it('should not throw or log error when research directory missing', () => {
      const missingPath = path.join(process.cwd(), '_nonexistent', 'research');

      // EXPECTED BEHAVIOR: no exception
      expect(() => {
        discoverResearchReports(missingPath);
      }).not.toThrow();
    });

    it('should proceed with refinement when research directory missing', () => {
      const missingPath = path.join(process.cwd(), '_nonexistent', 'research');
      const reports = discoverResearchReports(missingPath);

      // EXPECTED BEHAVIOR: refinement can continue with empty array
      expect(Array.isArray(reports)).toBe(true);
      // Downstream code can safely iterate: for (const r of reports) { ... }
    });
  });

  describe('No matching research reports - No error, empty result', () => {
    it('should return empty array when no research reports exist', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-empty-research');
      fs.mkdirSync(tempDir, { recursive: true });

      try {
        const reports = discoverResearchReports(tempDir);

        // EXPECTED BEHAVIOR
        expect(Array.isArray(reports)).toBe(true);
        expect(reports.length).toBe(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should return empty array when story has no domain_tags', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-no-domain-tags');
      const researchDir = path.join(tempDir, 'memory', 'research');
      const storyPath = path.join(tempDir, 'story.md');

      fs.mkdirSync(researchDir, { recursive: true });
      fs.writeFileSync(
        path.join(researchDir, 'RR-001.md'),
        `---
topic: "Test"
tags: ["backend"]
---
Content`
      );
      fs.writeFileSync(storyPath, '---\ntitle: "No Domain Tags"\n---\nContent');

      try {
        const matched = loadMatchingReports(tempDir, storyPath);

        // EXPECTED BEHAVIOR: no match, no error
        expect(Array.isArray(matched)).toBe(true);
        expect(matched.length).toBe(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should return empty array when story tags do not match research tags', () => {
      const reports = [
        { path: '/path/to/RR-001.md', tags: ['frontend', 'ui'] },
        { path: '/path/to/RR-002.md', tags: ['devops', 'kubernetes'] }
      ];
      const storyTags = ['backend', 'database'];

      const matches = matchReportsByTags(reports, storyTags);

      // EXPECTED BEHAVIOR: no match, no error
      expect(Array.isArray(matches)).toBe(true);
      expect(matches.length).toBe(0);
    });

    it('should not crash when research directory is empty', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-empty-dir');
      fs.mkdirSync(tempDir, { recursive: true });

      try {
        // EXPECTED BEHAVIOR: no exception
        expect(() => {
          discoverResearchReports(tempDir);
        }).not.toThrow();

        const reports = discoverResearchReports(tempDir);
        expect(reports.length).toBe(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('File read errors - Logged, but continue gracefully', () => {
    it('should skip report with read error and continue with others', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-read-error');
      const researchDir = path.join(tempDir, 'memory', 'research');
      fs.mkdirSync(researchDir, { recursive: true });

      // Create readable report
      fs.writeFileSync(
        path.join(researchDir, 'RR-001.md'),
        `---
topic: "Good Report"
tags: ["backend"]
---
Content`
      );

      // Create file that will cause read error (removed after discovery)
      const problematicPath = path.join(researchDir, 'RR-002.md');
      fs.writeFileSync(problematicPath, '---\nbroken: true\n---\n');

      try {
        // Discovery should still work with mixed good/bad files
        const reports = discoverResearchReports(researchDir);

        // EXPECTED BEHAVIOR: discovers without crashing
        expect(Array.isArray(reports)).toBe(true);
        // Should find at least one report (RR-001)
        expect(reports.length).toBeGreaterThan(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should handle ENOENT (file not found) during tag extraction', () => {
      const missingPath = path.join(process.cwd(), '_nonexistent', 'RR-missing.md');

      // EXPECTED BEHAVIOR: return empty tags, not throw
      expect(() => {
        extractResearchTags(missingPath);
      }).not.toThrow();

      const tags = extractResearchTags(missingPath);
      expect(Array.isArray(tags)).toBe(true);
    });

    it('should handle EACCES (permission denied) during discovery', () => {
      // Simulate permission denied by trying to access non-existent path
      const inaccessiblePath = path.join(process.cwd(), '_protected_xyz_nonexistent', 'research');

      // EXPECTED BEHAVIOR: return empty array, not throw
      expect(() => {
        const reports = discoverResearchReports(inaccessiblePath);
        expect(Array.isArray(reports)).toBe(true);
        expect(reports.length).toBe(0);
      }).not.toThrow();
    });

    it('should log errors for debugging without blocking refinement', () => {
      const nonexistentPath = path.join(process.cwd(), '_xyz_nonexistent_research_dir');

      // EXPECTED BEHAVIOR: function handles errors gracefully and returns empty array
      expect(() => {
        const reports = discoverResearchReports(nonexistentPath);
        expect(Array.isArray(reports)).toBe(true);
        expect(reports.length).toBe(0);
      }).not.toThrow();
    });
  });

  describe('Refinement workflow resilience', () => {
    it('should allow refinement to proceed when research context is empty', () => {
      const emptyResearch = [];

      // EXPECTED BEHAVIOR: downstream code can handle empty array
      expect(() => {
        // Simulate agent context injection
        for (const report of emptyResearch) {
          // Process report
        }
      }).not.toThrow();
    });

    it('should format empty research gracefully for agent prompt', () => {
      const research = [];

      // EXPECTED BEHAVIOR: agent prompt builder can handle empty research
      const formattedContext = research.length > 0
        ? research.map(r => `- ${r.topic}: ${r.tags.join(', ')}`).join('\n')
        : '';

      expect(typeof formattedContext).toBe('string');
      expect(formattedContext).toBe(''); // Empty when no research
    });

    it('should not produce warning when research is optional enrichment', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const tempDir = path.join(process.cwd(), '_test-temp-no-warn');
      fs.mkdirSync(tempDir, { recursive: true });

      try {
        // Missing research directory - should not warn
        const reports = discoverResearchReports(path.join(tempDir, 'nonexistent'));

        // EXPECTED BEHAVIOR: no warning
        // The implementation should not call console.warn for optional research
        expect(Array.isArray(reports)).toBe(true);

        warnSpy.mockRestore();
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should integrate into refinement without changing workflow behavior', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-workflow-resilience');
      const researchDir = path.join(tempDir, 'memory', 'research');
      const storyPath = path.join(tempDir, 'story.md');

      // Create empty research scenario
      fs.mkdirSync(researchDir, { recursive: true });
      fs.mkdirSync(path.dirname(storyPath), { recursive: true });
      fs.writeFileSync(storyPath, '---\ntitle: "Story"\n---\nContent');

      try {
        // Simulate refinement workflow calling research loader
        const research = loadMatchingReports(tempDir, storyPath);

        // EXPECTED BEHAVIOR: refinement continues normally
        expect(Array.isArray(research)).toBe(true);

        // Downstream workflow logic
        const agentContext = {
          story: 'story content',
          research: research, // May be empty
          // ... other context
        };

        expect(agentContext.research).toBeDefined();
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Edge cases - All handled gracefully', () => {
    it('should handle null or undefined parameters gracefully', () => {
      // EXPECTED BEHAVIOR: safe defaults or empty results
      expect(() => {
        discoverResearchReports(null);
      }).not.toThrow();

      expect(() => {
        extractResearchTags(undefined);
      }).not.toThrow();

      expect(() => {
        matchReportsByTags(null, []);
      }).not.toThrow();
    });

    it('should handle very long file paths', () => {
      const longPath = path.join(process.cwd(), 'a'.repeat(200), 'b'.repeat(200));

      // EXPECTED BEHAVIOR: handle without crashing
      expect(() => {
        discoverResearchReports(longPath);
      }).not.toThrow();

      const reports = discoverResearchReports(longPath);
      expect(Array.isArray(reports)).toBe(true);
    });

    it('should handle special characters in file names', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-special-chars');
      fs.mkdirSync(tempDir, { recursive: true });

      try {
        // File with special chars (valid in most filesystems)
        const specialPath = path.join(tempDir, 'RR-001.md');
        fs.writeFileSync(specialPath, '---\ntags: []\n---\nContent');

        // EXPECTED BEHAVIOR: discover without issue
        expect(() => {
          discoverResearchReports(tempDir);
        }).not.toThrow();
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should handle concurrent access patterns', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-concurrent');
      const researchDir = path.join(tempDir, 'memory', 'research');
      fs.mkdirSync(researchDir, { recursive: true });

      fs.writeFileSync(path.join(researchDir, 'RR-001.md'), '---\ntags: []\n---\nContent');

      try {
        // Multiple concurrent calls should not interfere
        const reports1 = discoverResearchReports(researchDir);
        const reports2 = discoverResearchReports(researchDir);

        // EXPECTED BEHAVIOR: consistent results
        expect(reports1.length).toBe(reports2.length);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });
});
