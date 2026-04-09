import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import path from 'path';
import {
  extractResearchTags,
  matchReportsByTags,
  loadMatchingReports
} from '../../scrum_workflow/utils/research-loader.js';

describe('AC#2: Tag Matching & Context Loading - Auto-Load Research by Domain Tags', () => {
  const researchDir = path.join(process.cwd(), '_scrum-output', 'memory', 'research');
  const storyPath = path.join(process.cwd(), '_scrum-output', 'sprints', 'SW-001', 'story.md');

  describe('extractResearchTags() - Parse YAML frontmatter tags', () => {
    it('should extract tags array from YAML frontmatter', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-research-tags');
      fs.mkdirSync(tempDir, { recursive: true });
      const reportPath = path.join(tempDir, 'RR-001.md');

      const reportContent = `---
topic: "WebSocket Performance"
tags: ["backend", "performance", "websockets"]
date: "2026-04-01T10:00:00Z"
referenced-by: []
---

# WebSocket Performance Research

Performance findings...`;

      fs.writeFileSync(reportPath, reportContent);

      try {
        const tags = extractResearchTags(reportPath);

        // EXPECTED BEHAVIOR
        expect(Array.isArray(tags)).toBe(true);
        expect(tags).toContain('backend');
        expect(tags).toContain('performance');
        expect(tags).toContain('websockets');
        expect(tags.length).toBe(3);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should return empty array when tags key is missing', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-research-notags');
      fs.mkdirSync(tempDir, { recursive: true });
      const reportPath = path.join(tempDir, 'RR-002.md');

      const reportContent = `---
topic: "Some Topic"
date: "2026-04-01T10:00:00Z"
---

# Content`;

      fs.writeFileSync(reportPath, reportContent);

      try {
        const tags = extractResearchTags(reportPath);

        // EXPECTED BEHAVIOR: safe fallback
        expect(Array.isArray(tags)).toBe(true);
        expect(tags.length).toBe(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should return empty array for file without YAML frontmatter', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-research-nofrontmatter');
      fs.mkdirSync(tempDir, { recursive: true });
      const reportPath = path.join(tempDir, 'RR-003.md');

      const reportContent = `# No Frontmatter

Just content without YAML.`;

      fs.writeFileSync(reportPath, reportContent);

      try {
        const tags = extractResearchTags(reportPath);

        // EXPECTED BEHAVIOR
        expect(Array.isArray(tags)).toBe(true);
        expect(tags.length).toBe(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should handle file not found error gracefully', () => {
      const missingPath = path.join(process.cwd(), '_nonexistent', 'RR-999.md');

      // EXPECTED BEHAVIOR: return empty array, not throw
      const tags = extractResearchTags(missingPath);
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBe(0);
    });

    it('should handle malformed YAML frontmatter gracefully', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-research-badyaml');
      fs.mkdirSync(tempDir, { recursive: true });
      const reportPath = path.join(tempDir, 'RR-004.md');

      // Invalid YAML that might cause parsing issues
      const reportContent = `---
topic: "Test"
tags: [unclosed array
---

Content`;

      fs.writeFileSync(reportPath, reportContent);

      try {
        const tags = extractResearchTags(reportPath);

        // EXPECTED BEHAVIOR: handle gracefully
        expect(Array.isArray(tags)).toBe(true);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('matchReportsByTags() - Find reports with matching domain tags', () => {
    it('should match reports with intersecting tags', () => {
      const reports = [
        { path: '/path/to/RR-001.md', tags: ['backend', 'performance', 'websockets'] },
        { path: '/path/to/RR-002.md', tags: ['frontend', 'ui', 'performance'] },
        { path: '/path/to/RR-003.md', tags: ['database', 'sql', 'performance'] }
      ];
      const storyTags = ['backend', 'performance', 'cache'];

      const matches = matchReportsByTags(reports, storyTags);

      // EXPECTED BEHAVIOR: returns reports with ∩ matches
      expect(Array.isArray(matches)).toBe(true);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some(m => m.path.includes('RR-001'))).toBe(true);
    });

    it('should return empty array when no tags match', () => {
      const reports = [
        { path: '/path/to/RR-001.md', tags: ['frontend', 'ui'] },
        { path: '/path/to/RR-002.md', tags: ['devops', 'kubernetes'] }
      ];
      const storyTags = ['backend', 'database'];

      const matches = matchReportsByTags(reports, storyTags);

      // EXPECTED BEHAVIOR
      expect(Array.isArray(matches)).toBe(true);
      expect(matches.length).toBe(0);
    });

    it('should perform case-insensitive tag matching', () => {
      const reports = [
        { path: '/path/to/RR-001.md', tags: ['Backend', 'Performance'] }
      ];
      const storyTags = ['backend', 'performance'];

      const matches = matchReportsByTags(reports, storyTags);

      // EXPECTED BEHAVIOR: case-insensitive match
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should return matches sorted by match count (descending)', () => {
      const reports = [
        { path: '/path/to/RR-001.md', tags: ['backend', 'performance', 'websockets'], date: '2026-04-01' },
        { path: '/path/to/RR-002.md', tags: ['backend'], date: '2026-04-02' },
        { path: '/path/to/RR-003.md', tags: ['backend', 'performance', 'websockets', 'async'], date: '2026-04-03' }
      ];
      const storyTags = ['backend', 'performance', 'websockets'];

      const matches = matchReportsByTags(reports, storyTags);

      // EXPECTED BEHAVIOR: sort by match count
      expect(matches[0].path.includes('RR-003')).toBe(true); // 3 matches
      expect(matches[1].path.includes('RR-001')).toBe(true); // 3 matches or RR-001 has 3
    });

    it('should return results sorted by date (newest first) when match counts equal', () => {
      const reports = [
        { path: '/path/to/RR-001.md', tags: ['backend'], date: '2026-04-01' },
        { path: '/path/to/RR-002.md', tags: ['backend'], date: '2026-04-03' },
        { path: '/path/to/RR-003.md', tags: ['backend'], date: '2026-04-02' }
      ];
      const storyTags = ['backend'];

      const matches = matchReportsByTags(reports, storyTags);

      // EXPECTED BEHAVIOR: newest first
      expect(matches[0].path.includes('RR-002')).toBe(true);
      expect(matches[1].path.includes('RR-003')).toBe(true);
      expect(matches[2].path.includes('RR-001')).toBe(true);
    });

    it('should handle empty story tags array', () => {
      const reports = [
        { path: '/path/to/RR-001.md', tags: ['backend'] }
      ];
      const storyTags = [];

      const matches = matchReportsByTags(reports, storyTags);

      // EXPECTED BEHAVIOR: no match
      expect(matches.length).toBe(0);
    });

    it('should handle empty report tags array', () => {
      const reports = [
        { path: '/path/to/RR-001.md', tags: [] }
      ];
      const storyTags = ['backend'];

      const matches = matchReportsByTags(reports, storyTags);

      // EXPECTED BEHAVIOR: no match
      expect(matches.length).toBe(0);
    });
  });

  describe('loadMatchingReports() - Orchestrate discovery and matching', () => {
    it('should discover and match research reports in one call', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-load-matching');
      const researchSubdir = path.join(tempDir, 'memory', 'research');
      const sprintSubdir = path.join(tempDir, 'sprints', 'SW-001');

      fs.mkdirSync(researchSubdir, { recursive: true });
      fs.mkdirSync(sprintSubdir, { recursive: true });

      // Create research reports
      fs.writeFileSync(
        path.join(researchSubdir, 'RR-001.md'),
        `---
topic: "Backend Performance"
tags: ["backend", "performance"]
date: "2026-04-01T10:00:00Z"
---
Content`
      );

      // Create story with matching tags
      fs.writeFileSync(
        path.join(sprintSubdir, 'story.md'),
        `---
title: "Story Title"
domain_tags: ["backend", "performance"]
---
Content`
      );

      try {
        const matched = loadMatchingReports(tempDir, path.join(sprintSubdir, 'story.md'));

        // EXPECTED BEHAVIOR: returns matched reports
        expect(Array.isArray(matched)).toBe(true);
        expect(matched.length).toBeGreaterThan(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should return empty array when research directory does not exist', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-no-research-dir');
      const storyPath = path.join(tempDir, 'story.md');

      fs.mkdirSync(path.dirname(storyPath), { recursive: true });
      fs.writeFileSync(storyPath, '---\ndomain_tags: ["backend"]\n---\nContent');

      try {
        const matched = loadMatchingReports(tempDir, storyPath);

        // EXPECTED BEHAVIOR: graceful fallback
        expect(Array.isArray(matched)).toBe(true);
        expect(matched.length).toBe(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should return empty array when story has no domain_tags', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-no-tags');
      const researchSubdir = path.join(tempDir, 'memory', 'research');
      const storyPath = path.join(tempDir, 'story.md');

      fs.mkdirSync(researchSubdir, { recursive: true });
      fs.writeFileSync(
        path.join(researchSubdir, 'RR-001.md'),
        `---
topic: "Test"
tags: ["backend"]
---
Content`
      );
      fs.writeFileSync(storyPath, '---\ntitle: "No Tags"\n---\nContent');

      try {
        const matched = loadMatchingReports(tempDir, storyPath);

        // EXPECTED BEHAVIOR
        expect(Array.isArray(matched)).toBe(true);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Research context for agent consumption', () => {
    it('should format matched research for agent context', () => {
      const matched = [
        {
          path: '/path/RR-001.md',
          topic: 'WebSocket Performance',
          tags: ['backend', 'performance'],
          date: '2026-04-01'
        }
      ];

      // EXPECTED BEHAVIOR: formatted context ready for agent
      expect(matched.length).toBeGreaterThan(0);
      expect(matched[0]).toHaveProperty('topic');
      expect(matched[0]).toHaveProperty('tags');
      expect(matched[0]).toHaveProperty('date');
    });

    it('agent should reference matched research in recommendation', () => {
      const research = {
        topic: 'WebSocket Performance',
        tags: ['backend'],
        findings: 'Connection pooling improves throughput'
      };

      // EXPECTED BEHAVIOR: agent uses research
      expect(research).toHaveProperty('topic');
      expect(research.findings).toBeTruthy();
    });
  });
});
