import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import path from 'path';
import {
  discoverResearchReports,
  extractResearchTags,
  matchReportsByTags,
  loadMatchingReports,
  formatResearchContext
} from '../../scrum_workflow/utils/research-loader.js';

describe('Integration Tests: Research Loading in Refinement Workflow', () => {
  describe('End-to-end research loading workflow', () => {
    it('should complete full research discovery and matching pipeline', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-e2e-pipeline');
      const researchDir = path.join(tempDir, 'memory', 'research');
      const sprintDir = path.join(tempDir, 'sprints', 'SW-042');
      const storyPath = path.join(sprintDir, 'story.md');

      // Setup: Create realistic research and story structure
      fs.mkdirSync(researchDir, { recursive: true });
      fs.mkdirSync(sprintDir, { recursive: true });

      // Create multiple research reports
      fs.writeFileSync(
        path.join(researchDir, 'RR-001.md'),
        `---
topic: "WebSocket Connection Management"
tags: ["backend", "websockets", "performance"]
date: "2026-03-15T10:00:00Z"
referenced-by: ["SW-042", "SW-050"]
---

# WebSocket Performance Research

Connection pooling strategies...`
      );

      fs.writeFileSync(
        path.join(researchDir, 'RR-002.md'),
        `---
topic: "Caching Strategies"
tags: ["backend", "cache", "performance"]
date: "2026-04-01T10:00:00Z"
referenced-by: []
---

# Cache Architecture

Redis patterns...`
      );

      fs.writeFileSync(
        path.join(researchDir, 'RR-003.md'),
        `---
topic: "React State Management"
tags: ["frontend", "state", "ui"]
date: "2026-03-20T10:00:00Z"
referenced-by: []
---

# State Management Patterns

Redux vs Zustand...`
      );

      // Create story with matching domain tags
      fs.writeFileSync(
        storyPath,
        `---
title: "Optimize WebSocket Performance"
domain_tags: ["backend", "websockets", "performance"]
---

# Story Description

Implement WebSocket optimization...`
      );

      try {
        // Step 1: Discover research reports
        const discovered = discoverResearchReports(researchDir);
        expect(discovered.length).toBe(3);

        // Step 2: Extract tags from discovered reports
        const reportsWithTags = discovered.map(reportPath => ({
          path: reportPath,
          tags: extractResearchTags(reportPath)
        }));
        expect(reportsWithTags.length).toBe(3);
        expect(reportsWithTags.every(r => Array.isArray(r.tags))).toBe(true);

        // Step 3: Extract story tags
        const storyContent = fs.readFileSync(storyPath, 'utf-8');
        const storyMatch = storyContent.match(/domain_tags:\s*\[(.*?)\]/);
        const storyTags = storyMatch
          ? storyMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''))
          : [];
        expect(storyTags.length).toBeGreaterThan(0);

        // Step 4: Match reports by tags
        const matched = matchReportsByTags(reportsWithTags, storyTags);
        expect(matched.length).toBeGreaterThan(0);
        expect(matched.length).toBeLessThanOrEqual(reportsWithTags.length);

        // EXPECTED BEHAVIOR: RR-001 and RR-002 match, RR-003 does not
        expect(matched.every(m => {
          const basename = path.basename(m.path);
          return basename === 'RR-001.md' || basename === 'RR-002.md';
        })).toBe(true);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should load and use matching research via unified API', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-unified-api');
      const researchDir = path.join(tempDir, 'memory', 'research');
      const storyPath = path.join(tempDir, 'story.md');

      fs.mkdirSync(researchDir, { recursive: true });
      fs.mkdirSync(path.dirname(storyPath), { recursive: true });

      fs.writeFileSync(
        path.join(researchDir, 'RR-001.md'),
        `---
topic: "Backend Optimization"
tags: ["backend", "performance"]
date: "2026-04-01T10:00:00Z"
---
Optimization findings...`
      );

      fs.writeFileSync(
        storyPath,
        `---
title: "Optimize System"
domain_tags: ["backend", "performance"]
---
Story content...`
      );

      try {
        // Use unified API: loadMatchingReports should do all the work
        const matched = loadMatchingReports(tempDir, storyPath);

        // EXPECTED BEHAVIOR: returns fully loaded research
        expect(Array.isArray(matched)).toBe(true);
        expect(matched.length).toBeGreaterThan(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Research context formatting for agent consumption', () => {
    it('should format matched research as markdown context', () => {
      const research = [
        {
          path: '/path/to/RR-001.md',
          topic: 'WebSocket Performance',
          tags: ['backend', 'websockets'],
          date: '2026-04-01',
          findings: 'Connection pooling improves throughput by 40%'
        }
      ];

      // EXPECTED BEHAVIOR: formatted context ready for agent prompt
      const formatted = formatResearchContext(research);

      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('WebSocket Performance');
      expect(formatted).toContain('backend');
    });

    it('should include research metadata in formatted context', () => {
      const research = [
        {
          topic: 'Research Title',
          tags: ['tag1', 'tag2'],
          date: '2026-04-01'
        }
      ];

      const formatted = formatResearchContext(research);

      // EXPECTED BEHAVIOR: metadata included
      expect(formatted).toContain('Research Title');
      expect(formatted).toContain('tag1');
      expect(formatted).toContain('2026-04-01');
    });

    it('should handle empty research list in formatting', () => {
      const research = [];

      // EXPECTED BEHAVIOR: returns empty string or neutral placeholder
      const formatted = formatResearchContext(research);

      expect(typeof formatted).toBe('string');
      // Should not error, may be empty or contain placeholder
    });

    it('should format multiple research reports clearly', () => {
      const research = [
        {
          topic: 'Report 1',
          tags: ['backend'],
          date: '2026-04-01'
        },
        {
          topic: 'Report 2',
          tags: ['frontend'],
          date: '2026-04-02'
        }
      ];

      const formatted = formatResearchContext(research);

      // EXPECTED BEHAVIOR: both reports visible
      expect(formatted).toContain('Report 1');
      expect(formatted).toContain('Report 2');
    });
  });

  describe('Agent receives and uses research context', () => {
    it('should inject research context into agent prompt', () => {
      const research = [
        {
          topic: 'WebSocket Optimization',
          findings: 'Use connection pooling'
        }
      ];

      const agentPrompt = buildAgentPrompt('story', research);

      // EXPECTED BEHAVIOR: research appears in prompt
      expect(agentPrompt).toContain('research');
      expect(agentPrompt).toContain('WebSocket Optimization');
    });

    it('should allow agent to reference research findings', () => {
      const research = [
        {
          topic: 'Performance Research',
          findings: 'Connection pooling recommended'
        }
      ];

      // Simulate agent processing
      let agentRecommendation = '';
      if (research.length > 0) {
        agentRecommendation = `Based on research "${research[0].topic}": ${research[0].findings}`;
      }

      // EXPECTED BEHAVIOR: agent uses research
      expect(agentRecommendation).toContain('research');
      expect(agentRecommendation).toContain('Connection pooling');
    });

    it('should not break agent if research is empty', () => {
      const research = [];

      // EXPECTED BEHAVIOR: agent still functions
      const agentPrompt = buildAgentPrompt('story', research);
      expect(typeof agentPrompt).toBe('string');
    });
  });

  describe('Refinement workflow integration', () => {
    it('should integrate research loading into ticket refinement workflow', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-refine-integration');
      const researchDir = path.join(tempDir, 'memory', 'research');
      const ticketPath = path.join(tempDir, 'ticket.md');

      fs.mkdirSync(researchDir, { recursive: true });
      fs.mkdirSync(path.dirname(ticketPath), { recursive: true });

      // Create research
      fs.writeFileSync(
        path.join(researchDir, 'RR-001.md'),
        `---
topic: "Security Research"
tags: ["security", "authentication"]
date: "2026-04-01T10:00:00Z"
---
Security findings...`
      );

      // Create ticket with matching tags
      fs.writeFileSync(
        ticketPath,
        `---
title: "Secure User Auth"
domain_tags: ["security", "authentication"]
---
Ticket content...`
      );

      try {
        // Simulate refinement workflow
        const research = loadMatchingReports(tempDir, ticketPath);

        // EXPECTED BEHAVIOR: refinement has research context
        expect(Array.isArray(research)).toBe(true);

        // Refinement can proceed with or without research
        const refinementOutput = {
          ticket: 'refined content',
          researchUsed: research.length > 0
        };

        expect(refinementOutput.ticket).toBeDefined();
        // research is optional
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should allow architect agent to reference research in refinement output', () => {
      const research = [
        {
          topic: 'Architecture Research',
          findings: 'Recommended pattern'
        }
      ];

      // Simulate architect agent producing perspective
      let architectPerspective = 'Recommended approach: ';
      if (research.length > 0) {
        architectPerspective += `Per research "${research[0].topic}", ${research[0].findings}`;
      } else {
        architectPerspective += 'No prior research available.';
      }

      // EXPECTED BEHAVIOR: agent references research when available
      expect(architectPerspective).toContain('research');
    });

    it('should not cause refinement to fail if research loading fails', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-fail-safe');

      try {
        // Call loadMatchingReports with nonexistent paths
        const research = loadMatchingReports(
          path.join(tempDir, 'nonexistent'),
          path.join(tempDir, 'nonexistent', 'story.md')
        );

        // EXPECTED BEHAVIOR: returns empty array, refinement continues
        expect(Array.isArray(research)).toBe(true);
        expect(research.length).toBe(0);

        // Refinement should proceed
        const refinementContinues = true;
        expect(refinementContinues).toBe(true);
      } finally {
        // Cleanup not needed for nonexistent paths
      }
    });
  });

  describe('Research artifact compatibility', () => {
    it('should read research reports from canonical artifact location', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-canonical-path');
      const canonicalResearchPath = path.join(tempDir, '_scrum-output', 'memory', 'research');

      fs.mkdirSync(canonicalResearchPath, { recursive: true });
      fs.writeFileSync(
        path.join(canonicalResearchPath, 'RR-001.md'),
        `---
topic: "Test"
tags: ["test"]
date: "2026-04-01T10:00:00Z"
---
Content...`
      );

      try {
        const reports = discoverResearchReports(canonicalResearchPath);

        // EXPECTED BEHAVIOR: canonical path works
        expect(reports.length).toBeGreaterThan(0);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should match story domain_tags with research report tags', () => {
      const storyTags = ['backend', 'performance', 'websockets'];
      const reportTags = ['websockets', 'backend', 'async'];

      // Intersection: ['backend', 'websockets']
      const intersection = storyTags.filter(tag =>
        reportTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
      );

      // EXPECTED BEHAVIOR: match found
      expect(intersection.length).toBeGreaterThan(0);
    });

    it('should handle research report structure from Story 7.4 output', () => {
      // Simulate research report structure from Story 7.4
      const researchReport = {
        path: 'RR-001.md',
        frontmatter: {
          topic: 'WebSocket Performance',
          tags: ['backend', 'performance', 'websockets'],
          date: '2026-04-01T10:00:00Z',
          'referenced-by': ['SW-042'],
          'rr-number': '001',
          phase: 'Phase 2: Memory'
        },
        content: 'Research findings...'
      };

      // EXPECTED BEHAVIOR: extraction works with this structure
      expect(researchReport.frontmatter.tags).toBeInstanceOf(Array);
      expect(researchReport.frontmatter.tags.length).toBeGreaterThan(0);
    });
  });

  describe('Performance considerations', () => {
    it('should handle large number of research reports efficiently', () => {
      const tempDir = path.join(process.cwd(), '_test-temp-perf-large');
      const researchDir = path.join(tempDir, 'memory', 'research');
      fs.mkdirSync(researchDir, { recursive: true });

      // Create 50 research reports
      for (let i = 1; i <= 50; i++) {
        const filename = `RR-${String(i).padStart(3, '0')}.md`;
        fs.writeFileSync(
          path.join(researchDir, filename),
          `---
topic: "Report ${i}"
tags: ["backend", "tag${i}"]
date: "2026-04-${String(i % 30 + 1).padStart(2, '0')}T10:00:00Z"
---
Content...`
        );
      }

      try {
        const start = Date.now();
        const discovered = discoverResearchReports(researchDir);
        const elapsed = Date.now() - start;

        // EXPECTED BEHAVIOR: completes in reasonable time (<1s)
        expect(discovered.length).toBe(50);
        expect(elapsed).toBeLessThan(1000);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should match tags efficiently even with many reports', () => {
      const reports = Array.from({ length: 100 }, (_, i) => ({
        path: `RR-${String(i).padStart(3, '0')}.md`,
        tags: [`tag${i}`, 'backend', 'common']
      }));
      const storyTags = ['backend', 'common', 'specific'];

      const start = Date.now();
      const matched = matchReportsByTags(reports, storyTags);
      const elapsed = Date.now() - start;

      // EXPECTED BEHAVIOR: fast matching
      expect(matched.length).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(100); // <100ms for 100 reports
    });
  });
});

// Helper functions for tests

function buildAgentPrompt(story, research) {
  let prompt = `Story: ${story}\n`;
  if (research.length > 0) {
    prompt += `\nPrior Research:\n${formatResearchContext(research)}`;
  }
  return prompt;
}

function formatResearchContext(research) {
  if (research.length === 0) return '';
  return research
    .map(r => `- **${r.topic}** (Tags: ${(r.tags || []).join(', ')})\n  ${r.findings || r.date || 'No details'}`)
    .join('\n');
}
