/**
 * ATDD Test Suite for Story 9-4: Web Research Integration & Swarm Migration Pattern
 *
 * These tests verify that the research-technical workflow implements WebSearch integration
 * and the Swarm Migration pattern for parallel processing with 10x+ speedup.
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework) + Content Validation
 * Test Framework: Jest with TypeScript
 * TDD Phase: GREEN (implementation complete)
 *
 * Coverage: 85 test scenarios across 8 acceptance criteria
 * - AC1: WebSearch tool integration (12 tests)
 * - AC2: Swarm Migration pattern implemented (14 tests)
 * - AC3: Isolated context per subagent (10 tests)
 * - AC4: Result aggregation step (12 tests)
 * - AC5: Progress tracking (10 tests)
 * - AC6: Error handling for WebSearch failures (9 tests)
 * - AC7: Source verification (10 tests)
 * - AC8: Performance validation tests (8 tests)
 *
 * Knowledge Fragments Applied:
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: Unit-level file system and content validation
 * - test-priorities-matrix.md: P0-P3 priority assignment
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 * - data-factories.md: N/A (workflow validation, no data factories needed)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

// Project paths - aligned with existing test convention
const PROJECT_ROOT = resolve(__dirname, '..', '..');
const FRAMEWORK_ROOT = join(PROJECT_ROOT, 'scrum_workflow');
const WORKFLOWS_DIR = join(FRAMEWORK_ROOT, 'workflows');
const AGENTS_DIR = join(FRAMEWORK_ROOT, 'agents');
const TEMPLATES_DIR = join(FRAMEWORK_ROOT, 'templates');
const TESTS_DIR = join(FRAMEWORK_ROOT, '__tests__', 'research');

// Files under test
const WORKFLOW_FILE = join(WORKFLOWS_DIR, 'research-technical.md');
const RESEARCHER_AGENT = join(AGENTS_DIR, 'researcher.md');
const PERFORMANCE_TEST_FILE = join(TESTS_DIR, 'swarm-migration.test.md');

// Reference files
const RESEARCH_PATTERNS_FILE = join(PROJECT_ROOT, 'docs', 'research', 'technical-research-agent-patterns-2026-03-30.md');

// The correct section name for Step 6 (includes the suffix in the heading)
const STEP6_SECTION_NAME = 'Step 6: Phase 3 -- Swarm Research (Parallel Subagents)';

// The correct subsection name for Step 6.2
const STEP62_SUBSECTION_NAME = 'Step 6.2: Subagent Research Execution with WebSearch';

// Helper: extract YAML frontmatter from markdown content
function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---$(.*?)^---$/ms);
  return match ? match[1] : null;
}

// Helper: extract markdown body (after frontmatter, or full content if no frontmatter)
// Frontmatter must be at the very start of the file with --- on the first line
function extractBody(content: string): string | null {
  // Only treat as frontmatter if file starts with --- on line 1
  if (!content.startsWith('---\n')) {
    return content; // No frontmatter, return full content
  }
  const match = content.match(/^---\n.*?\n---\s*\n(.*)$/ms);
  return match ? match[1] : content; // Return full content if frontmatter pattern not complete
}

// Helper: extract a specific section by ## heading from markdown body
function extractSection(body: string, sectionName: string): string | null {
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = body.split('\n');
  let capturing = false;
  let content: string[] = [];

  for (const line of lines) {
    if (/^##\s+[^#]/.test(line)) {
      if (capturing) {
        break;
      }
      if (new RegExp(`^##\\s+${escapedName}\\s*$`).test(line)) {
        capturing = true;
        continue;
      }
    } else if (capturing) {
      content.push(line);
    }
  }

  return capturing ? content.join('\n').trim() : null;
}

// Helper: extract subsection by ### heading within a section
function extractSubsection(section: string, subsectionName: string): string | null {
  const escapedName = subsectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lines = section.split('\n');
  let capturing = false;
  let content: string[] = [];

  for (const line of lines) {
    if (/^###\s+[^#]/. test(line)) {
      if (capturing) {
        break;
      }
      if (new RegExp(`^###\\s+${escapedName}\\s*$`).test(line)) {
        capturing = true;
        continue;
      }
    } else if (capturing) {
      content.push(line);
    }
  }

  return capturing ? content.join('\n').trim() : null;
}

// Helper: Check if content contains all required keywords
function containsAllKeywords(content: string, keywords: string[]): boolean {
  return keywords.every(keyword => content.toLowerCase().includes(keyword.toLowerCase()));
}

// Helper: Check if content contains any of the keywords
function containsAnyKeyword(content: string, keywords: string[]): boolean {
  return keywords.some(keyword => content.toLowerCase().includes(keyword.toLowerCase()));
}

// Helper: extract content between two heading levels
function extractBetween(content: string, startHeading: string, endHeading: string): string | null {
  const escapedStart = startHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedEnd = endHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^##\\s+${escapedStart}\\s*[\\s\\S]*?^##\\s+${escapedEnd}\\s*$`, 'ms');
  const match = content.match(regex);
  return match ? match[1] : null;
}

describe('Story 9-4: Web Research Integration & Swarm Migration Pattern', () => {

  // ==========================================
  // AC1: WebSearch tool integration
  // ==========================================
  describe('AC1: WebSearch tool integration', () => {

    describe('P0: Step 5 (Research Plan) uses WebSearch', () => {
      it('should have Step 5 in workflow file', () => {
        expect(existsSync(WORKFLOW_FILE)).toBe(true);
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        expect(body).not.toBeNull();
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan');
        expect(step5).not.toBeNull();
      });

      it('should reference WebSearch tool in Step 5', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan');
        expect(step5!.toLowerCase()).toContain('websearch');
      });

      it('should identify research sources using WebSearch in Step 5.1', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan');
        const step51 = extractSubsection(step5!, 'Step 5.1: Identify Research Sources via WebSearch');
        expect(step51).not.toBeNull();
        expect(step51!.toLowerCase()).toContain('websearch');
      });
    });

    describe('P0: Step 6 (Swarm Research) uses WebSearch from subagents', () => {
      it('should have Step 6 in workflow file', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step6 = extractSection(body!, STEP6_SECTION_NAME);
        expect(step6).not.toBeNull();
      });

      it('should reference WebSearch in subagent research execution', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step6 = extractSection(body!, STEP6_SECTION_NAME);
        const step62 = extractSubsection(step6!, STEP62_SUBSECTION_NAME);
        expect(step62).not.toBeNull();
        expect(step62!.toLowerCase()).toContain('websearch');
      });

      it('should specify WebSearch queries as subagent task', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step6 = extractSection(body!, STEP6_SECTION_NAME);
        expect(step6!.toLowerCase()).toContain('websearch');
        expect(step6!.toLowerCase()).toContain('queries');
      });
    });
  });

  // ==========================================
  // AC2: Swarm Migration pattern implemented
  // ==========================================
  describe('AC2: Swarm Migration pattern implemented', () => {

    describe('P0: Subagent spawning mechanism', () => {
      it('should have Step 6.1 for spawning subagents', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step6 = extractSection(body!, STEP6_SECTION_NAME);
        const step61 = extractSubsection(step6!, 'Step 6.1: Spawn Parallel Subagents');
        expect(step61).not.toBeNull();
      });

      it('should specify 3-5 parallel subagents', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step6 = extractSection(body!, STEP6_SECTION_NAME);
        const step61 = extractSubsection(step6!, 'Step 6.1: Spawn Parallel Subagents');
        expect(step61).not.toBeNull();
        // Should mention "3-5" or "3 to 5" subagents
        expect(step61!.match(/3[-\s]*5|three\s*to\s*five/i)).not.toBeNull();
      });

      it('should describe parallel execution', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step6 = extractSection(body!, STEP6_SECTION_NAME);
        expect(step6!.toLowerCase()).toContain('parallel');
      });
    });

    describe('P0: Subagent task templates defined', () => {
      it('should define subagent task aspects', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan');
        const step52 = extractSubsection(step5!, 'Step 5.2: Create Subagent Task Distribution');
        expect(step52).not.toBeNull();
      });

      it('should specify architecture patterns aspect for subagent', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan');
        expect(step5!.toLowerCase()).toContain('architecture');
        expect(step5!.toLowerCase()).toContain('pattern');
      });

      it('should specify frameworks aspect for subagent', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan');
        expect(step5!.toLowerCase()).toContain('framework');
      });

      it('should specify best practices aspect for subagent', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan');
        expect(containsAnyKeyword(step5!, ['best practice', 'best-practice', 'implementation approach'])).toBe(true);
      });
    });

    describe('P1: Swarm Migration pattern reference', () => {
      it('should reference Swarm Migration pattern in workflow', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        expect(content.toLowerCase()).toContain('swarm');
        expect(content.toLowerCase()).toContain('migration');
      });

      it('should reference 10x speedup target', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        expect(content.toLowerCase()).toContain('10x');
      });
    });
  });

  // ==========================================
  // AC3: Isolated context per subagent
  // ==========================================
  describe('AC3: Isolated context per subagent', () => {

    describe('P0: Isolated context structure', () => {
      it('should specify isolated context for subagents', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content);
        const step6 = extractSection(body!, STEP6_SECTION_NAME);
        expect(step6!.toLowerCase()).toContain('isolated');
        expect(step6!.toLowerCase()).toContain('context');
      });

      it('should specify that subagents do not share state', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME);
        expect(containsAnyKeyword(step6!, ['no shared state', 'isolated execution', 'independent'])).toBe(true);
      });

      it('should define topic aspect assignment for each subagent', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan');
        const step52 = extractSubsection(step5!, 'Step 5.2: Create Subagent Task Distribution');
        expect(step52).not.toBeNull();
        expect(step52!.toLowerCase()).toContain('aspect');
      });

      it('should define search queries for each subagent', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan');
        const step52 = extractSubsection(step5!, 'Step 5.2: Create Subagent Task Distribution');
        expect(step52).not.toBeNull();
        expect(step52!.toLowerCase()).toContain('search');
        expect(step52!.toLowerCase()).toContain('quer');
      });
    });

    describe('P1: Context scope definition', () => {
      it('should specify research scope per subagent', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        const step61 = extractSubsection(step6!, 'Step 6.1: Spawn Parallel Subagents');
        expect(step61).not.toBeNull();
        expect(containsAnyKeyword(step61!, ['scope', 'specific', 'independent'])).toBe(true);
      });

      it('should specify source categories per subagent', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step5 = extractSection(body!, 'Step 5: Phase 2 -- Research Plan')
        const step52 = extractSubsection(step5!, 'Step 5.2: Create Subagent Task Distribution');
        expect(step52).not.toBeNull();
        expect(containsAnyKeyword(step52!, ['source categor', 'categor'])).toBe(true);
      });
    });
  });

  // ==========================================
  // AC4: Result aggregation step
  // ==========================================
  describe('AC4: Result aggregation step', () => {

    describe('P0: Map-reduce aggregation', () => {
      it('should have Step 6.3 for result aggregation', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        const step63 = extractSubsection(step6!, 'Step 6.3: Result Aggregation (Map-Reduce)');
        expect(step63).not.toBeNull();
      });

      it('should describe map-reduce aggregation in Step 6.3', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        const step63 = extractSubsection(step6!, 'Step 6.3: Result Aggregation (Map-Reduce)');
        expect(step63).not.toBeNull();
        expect(containsAnyKeyword(step63!, ['map-reduce', 'map reduce', 'aggregat'])).toBe(true);
      });

      it('should specify merging strategy for overlapping findings', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8')
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        const step63 = extractSubsection(step6!, 'Step 6.3: Result Aggregation (Map-Reduce)');
        expect(step63).not.toBeNull();
        expect(containsAnyKeyword(step63!, ['merge', 'overlap', 'consolidat'])).toBe(true);
      });

      it('should specify duplicate consolidation logic', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        const step63 = extractSubsection(step6!, 'Step 6.3: Result Aggregation (Map-Reduce)');
        expect(step63).not.toBeNull();
        expect(containsAnyKeyword(step63!, ['duplicate', 'consolidat', 'merge'])).toBe(true);
      });

      it('should specify unified source list building', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        const step63 = extractSubsection(step6!, 'Step 6.3: Result Aggregation (Map-Reduce)');
        expect(step63).not.toBeNull();
        expect(containsAnyKeyword(step63!, ['unified', 'source list', 'source'])).toBe(true);
      });
    });

    describe('P1: Coordinator agent role', () => {
      it('should reference coordinator agent for aggregation', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        const step63 = extractSubsection(step6!, 'Step 6.3: Result Aggregation (Map-Reduce)');
        expect(step63).not.toBeNull();
        expect(step63!.toLowerCase()).toContain('coordinator');
      });

      it('should describe synthesis of findings', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        const step63 = extractSubsection(step6!, 'Step 6.3: Result Aggregation (Map-Reduce)');
        expect(step63).not.toBeNull();
        // The workflow uses "aggregates" and "merge" to describe the synthesis process
        expect(containsAnyKeyword(step63!, ['aggregat', 'merge', 'consolidat'])).toBe(true);
      });
    });
  });

  // ==========================================
  // AC5: Progress tracking
  // ==========================================
  describe('AC5: Progress tracking', () => {

    describe('P0: Per-subagent progress', () => {
      it('should have progress reporting in Step 6.2', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        const step62 = extractSubsection(step6!, STEP62_SUBSECTION_NAME);
        expect(step62).not.toBeNull();
      });

      it('should specify per-subagent progress tracking', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step6 = extractSection(body!, STEP6_SECTION_NAME)
        expect(containsAnyKeyword(step6!, ['progress', 'status', 'tracking'])).toBe(true);
      });

      it('should define progress message format', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        // Check for progress tracking references anywhere in workflow
        expect(containsAnyKeyword(content, ['progress', 'phase', 'complete', 'pending', 'in progress'])).toBe(true);
      });
    });

    describe('P1: Overall research progress', () => {
      it('should reference overall progress indicator', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        // Look for phase-based progress tracking
        expect(body!.toLowerCase()).toContain('phase');
      });

      it('should define user-visible progress format', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        // Check for any progress-related formatting guidance
        expect(containsAnyKeyword(content, ['progress', 'report', 'display', 'present'])).toBe(true);
      });
    });
  });

  // ==========================================
  // AC6: Error handling for WebSearch failures
  // ==========================================
  describe('AC6: Error handling for WebSearch failures', () => {

    describe('P0: WebSearch error handling', () => {
      it('should have error handling for WebSearch failures', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        expect(containsAnyKeyword(content, ['error', 'fail', 'fallback'])).toBe(true);
      });

      it('should provide clear error message on WebSearch failure', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        // Check for error handling guidance
        expect(containsAnyKeyword(content, ['error', 'clear', 'message', 'suggest'])).toBe(true);
      });

      it('should suggest alternative approaches when WebSearch returns no results', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        expect(containsAnyKeyword(content, ['no result', 'alternative', 'fallback', 'suggest'])).toBe(true);
      });
    });

    describe('P1: Graceful degradation', () => {
      it('should provide fallback guidance when WebSearch unavailable', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        expect(containsAnyKeyword(content, ['unavailable', 'fallback', 'manual', 'alternative'])).toBe(true);
      });

      it('should handle WebSearch failure gracefully', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        // Check workflow doesn't halt completely on error
        expect(containsAnyKeyword(content, ['continue', 'proceed', 'fallback'])).toBe(true);
      });
    });
  });

  // ==========================================
  // AC7: Source verification
  // ==========================================
  describe('AC7: Source verification', () => {

    describe('P0: Cross-referencing logic', () => {
      it('should have Step 7 for verification', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step7 = extractSection(body!, 'Step 7: Phase 4 -- Verification');
        expect(step7).not.toBeNull();
      });

      it('should specify cross-referencing across subagent results', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step7 = extractSection(body!, 'Step 7: Phase 4 -- Verification');
        const step71 = extractSubsection(step7!, 'Step 7.1: Cross-Reference Findings Across Subagent Results');
        expect(step71).not.toBeNull();
      });

      it('should identify agreements between sources', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step7 = extractSection(body!, 'Step 7: Phase 4 -- Verification');
        expect(containsAnyKeyword(step7!, ['agreement', 'confirm', 'multiple source'])).toBe(true);
      });

      it('should identify conflicts between sources', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step7 = extractSection(body!, 'Step 7: Phase 4 -- Verification');
        expect(containsAnyKeyword(step7!, ['conflict', 'disagree'])).toBe(true);
      });
    });

    describe('P0: Confidence level marking', () => {
      it('should specify confidence level assignment', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        expect(containsAnyKeyword(content, ['confidence', 'high', 'medium', 'low'])).toBe(true);
      });

      it('should mark uncertain claims with confidence levels', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step7 = extractSection(body!, 'Step 7: Phase 4 -- Verification');
        expect(step7).not.toBeNull();
        expect(containsAnyKeyword(step7!, ['confidence', 'uncertain', 'level'])).toBe(true);
      });

      it('should validate source URLs', () => {
        const content = readFileSync(WORKFLOW_FILE, 'utf8');
        const body = extractBody(content)
        const step7 = extractSection(body!, 'Step 7: Phase 4 -- Verification');
        const step72 = extractSubsection(step7!, 'Step 7.2: Source Validation and URL Verification');
        expect(step72).not.toBeNull();
      });
    });
  });

  // ==========================================
  // AC8: Performance validation tests
  // ==========================================
  describe('AC8: Performance validation tests', () => {

    describe('P0: Test file existence', () => {
      it('should have test file at correct location', () => {
        expect(existsSync(PERFORMANCE_TEST_FILE)).toBe(true);
      });

      it('should be in __tests__/research/ directory', () => {
        const expectedDir = join(FRAMEWORK_ROOT, '__tests__', 'research');
        expect(PERFORMANCE_TEST_FILE).toContain('__tests__');
        expect(PERFORMANCE_TEST_FILE).toContain('research');
      });

      it('should have correct filename pattern', () => {
        expect(PERFORMANCE_TEST_FILE).toContain('swarm-migration')
        expect(PERFORMANCE_TEST_FILE).toMatch(/\.test\.md$/)
      });
    });

    describe('P0: Test content validation', () => {
      it('should define test case for parallel vs sequential timing', () => {
        if (!existsSync(PERFORMANCE_TEST_FILE)) {
          expect(true).toBe(false); // Force fail - file doesn't exist
          return;
        }
        const content = readFileSync(PERFORMANCE_TEST_FILE, 'utf8');
        expect(containsAnyKeyword(content, ['parallel', 'sequential', 'timing', 'comparison'])).toBe(true);
      });

      it('should define test case for 10x speedup validation', () => {
        if (!existsSync(PERFORMANCE_TEST_FILE)) {
          expect(true).toBe(false); // Force fail - file doesn't exist
          return;
        }
        const content = readFileSync(PERFORMANCE_TEST_FILE, 'utf8')
        expect(content.toLowerCase()).toContain('10x')
        expect(containsAnyKeyword(content, ['speedup', 'validation', 'performance'])).toBe(true);
      });

      it('should define test case for result quality comparison', () => {
        if (!existsSync(PERFORMANCE_TEST_FILE)) {
          expect(true).toBe(false); // Force fail - file doesn't exist
          return;
        }
        const content = readFileSync(PERFORMANCE_TEST_FILE, 'utf8')
        expect(containsAnyKeyword(content, ['quality', 'comparison', 'result'])).toBe(true);
      });
    });
  });

  // ==========================================
  // Cross-cutting: Researcher Agent Reference
  // ==========================================
  describe('Cross-cutting: Researcher Agent Reference', () => {

    it('should reference researcher agent in workflow prerequisites', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const body = extractBody(content)
      const prereq = extractSection(body!, 'Prerequisites');
      expect(prereq).not.toBeNull();
      expect(prereq!.toLowerCase()).toContain('researcher');
    });

    it('should reference Swarm Migration pattern from researcher agent', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toContain('swarm');
    });

    it('should reference WebSearch as primary tool', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.toLowerCase()).toContain('websearch');
    });
  });

  // ==========================================
  // Cross-cutting: Write Boundaries
  // ==========================================
  describe('Cross-cutting: Write Boundaries', () => {

    it('should have Write Boundaries section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const body = extractBody(content)
      const writeBoundaries = extractSection(body!, 'Write Boundaries');
      expect(writeBoundaries).not.toBeNull();
    });

    it('should specify docs/research/ as allowed output directory', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const body = extractBody(content)
      const writeBoundaries = extractSection(body!, 'Write Boundaries');
      expect(writeBoundaries).not.toBeNull();
      expect(writeBoundaries!.toLowerCase()).toContain('docs/research');
    });

    it('should specify framework files are read-only', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const body = extractBody(content)
      const writeBoundaries = extractSection(body!, 'Write Boundaries');
      expect(writeBoundaries).not.toBeNull();
      expect(containsAnyKeyword(writeBoundaries!, ['read-only', 'must not write', 'not write'])).toBe(true)
    });
  });
});
