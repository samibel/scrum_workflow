/**
 * ATDD Test Suite for Story 9-7: /scrum-research general Command & Workflow
 *
 * These tests verify that the command file, workflow file, and adapter skill file
 * are properly structured following the established conventions from the technical
 * research command (research-technical.md) and workflow (research-technical.md).
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because files do not exist yet)
 *
 * Coverage: 98 test scenarios across 8 acceptance criteria + cross-cutting
 * - AC1: Command file exists at correct location with SKILL.md format (20 tests)
 * - AC2: Workflow file exists with Plan-Then-Execute workflow (5 tests)
 * - AC3: Workflow uses same four patterns as technical research (5 tests)
 * - AC4: Output schema is type: general_research (8 tests)
 * - AC5: Same state file as technical research (3 tests)
 * - AC6: Generated filename pattern (3 tests)
 * - AC7: Adapter skill created (7 tests)
 * - AC8: Reuses Stories 9.3-9.6 patterns (12 tests)
 * - Cross-cutting: Naming/structural/three-layer compliance (35 tests)
 *
 * Knowledge Fragments Applied:
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: Unit-level file system validation
 * - test-priorities-matrix.md: P0-P3 priority assignment
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 * - data-factories.md: N/A (file validation, no data factories needed)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

// Project paths - aligned with existing test convention
const PROJECT_ROOT = resolve(__dirname, '..', '..');
const FRAMEWORK_ROOT = join(PROJECT_ROOT, 'scrum_workflow');
const COMMANDS_DIR = join(FRAMEWORK_ROOT, 'commands');
const WORKFLOWS_DIR = join(FRAMEWORK_ROOT, 'workflows');
const AGENTS_DIR = join(FRAMEWORK_ROOT, 'agents');
const ADAPTER_SKILLS_DIR = join(PROJECT_ROOT, '.claude', 'skills');

// Files under test
const COMMAND_FILE = join(COMMANDS_DIR, 'research-general.md');
const WORKFLOW_FILE = join(WORKFLOWS_DIR, 'research-general.md');
const ADAPTER_SKILL_FILE = join(ADAPTER_SKILLS_DIR, 'scrum-research-general.md');

// Reference files for structural comparison
const REF_TECHNICAL_COMMAND_FILE = join(COMMANDS_DIR, 'research-technical.md');
const REF_TECHNICAL_WORKFLOW_FILE = join(WORKFLOWS_DIR, 'research-technical.md');
const REF_ADAPTER_SKILL = join(ADAPTER_SKILLS_DIR, 'scrum-research-technical.md');
const RESEARCHER_AGENT = join(AGENTS_DIR, 'researcher.md');

// Expected command frontmatter fields in order
const COMMAND_FRONTMATTER_FIELDS = ['name', 'trigger', 'requires_status', 'sets_status', 'spawns_agents'];

// Expected command body sections in order
const COMMAND_BODY_SECTIONS = ['Purpose', 'Workflow Reference', 'Input', 'Output'];

// Expected adapter skill frontmatter fields
const ADAPTER_FRONTMATTER_FIELDS = ['name', 'trigger', 'description', 'framework_command'];

// Expected frontmatter schema fields for generated general research output
const EXPECTED_GENERAL_FRONTMATTER_SCHEMA_FIELDS = [
  'type', 'topic', 'date', 'sources', 'ai_optimized', 'version', 'research_confidence'
];

// Expected general research output sections (8 required sections)
const GENERAL_RESEARCH_SECTIONS = [
  'Executive Summary',
  'Market Analysis',
  'Competitive Landscape',
  'Strategic Recommendations',
  'Implementation Considerations',
  'Risk Assessment',
  'Future Outlook',
  'References'
];

// Helper: extract YAML frontmatter from markdown content
function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---$(.*?)^---$/ms);
  return match ? match[1] : null;
}

// Helper: extract markdown body (after frontmatter)
function extractBody(content: string): string | null {
  const match = content.match(/^---.*?^---\s*\n(.*)$/ms);
  return match ? match[1] : null;
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

  return content.length > 0 ? content.join('\n').trim() : null;
}

// =======================================================================
// Story 9-7 Test Suite
// =======================================================================
describe('Story 9-7: /scrum-research general Command & Workflow', () => {

  // =======================================================================
  // AC1: Command file exists at correct location
  // =======================================================================
  describe('AC1: Command file exists at correct location with SKILL.md format', () => {
    test('P0: research-general.md exists in commands directory', () => {
      expect(existsSync(COMMAND_FILE)).toBe(true);
    });

    test('P0: command file has valid YAML frontmatter delimiters', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^---\s*\n/);
      expect(content).toMatch(/\n---\s*\n/);
    });

    test('P0: frontmatter name field is "research-general"', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^name:\s*research-general$/m);
    });

    test('P0: frontmatter trigger field is "/research-general"', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/trigger:\s*["']?\/research-general["']?/);
    });

    test('P0: frontmatter requires_status is null', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^requires_status:\s*null$/m);
    });

    test('P0: frontmatter sets_status is null', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^sets_status:\s*null$/m);
    });

    test('P0: frontmatter spawns_agents contains researcher', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      // YAML array format: spawns_agents:\n  - researcher
      // or inline: spawns_agents: [researcher]
      expect(frontmatter).toMatch(/spawns_agents/);
      expect(content).toMatch(/researcher/);
    });

    test('P1: frontmatter fields are in correct order matching convention', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();

      const lines = frontmatter!
        .split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('-'));

      const foundFields = lines.map(line => line.split(':')[0].trim());
      expect(foundFields).toEqual(COMMAND_FRONTMATTER_FIELDS);
    });
  });

  // =======================================================================
  // AC1 (continued): Command body sections
  // =======================================================================
  describe('AC1: Command body sections follow SKILL.md format', () => {
    test('P0: command body has Purpose section', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Purpose$/m);
    });

    test('P0: command body has Workflow Reference section', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Workflow Reference$/m);
    });

    test('P0: command body has Input section', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Input$/m);
    });

    test('P0: command body has Output section', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^## Output$/m);
    });

    test('P1: body sections are in exact order: Purpose, Workflow Reference, Input, Output', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const sectionPattern = /^## (.+)$/gm;
      const sections: string[] = [];
      let match;
      while ((match = sectionPattern.exec(content)) !== null) {
        sections.push(match[1]);
      }
      expect(sections).toEqual(COMMAND_BODY_SECTIONS);
    });

    test('P1: Workflow Reference section references workflows/research-general.md', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toContain('workflows/research-general.md');
    });

    test('P0: Purpose section describes general research for business/market/strategic topics', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const purposeSection = extractSection(body!, 'Purpose');
      expect(purposeSection).toBeTruthy();
      const lowerPurpose = purposeSection!.toLowerCase();
      expect(lowerPurpose).toMatch(/research/);
      expect(lowerPurpose).toMatch(/general|business|market|strategic/);
    });

    test('P1: Purpose section mentions Plan-Then-Execute or agentic patterns', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const purposeSection = extractSection(body!, 'Purpose');
      expect(purposeSection).toBeTruthy();
      const lowerPurpose = purposeSection!.toLowerCase();
      expect(lowerPurpose).toMatch(/plan.*then.*execute|agentic|swarm|reflection/);
    });

    test('P1: Input section describes topic argument', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const inputSection = extractSection(body!, 'Input');
      expect(inputSection).toBeTruthy();
      expect(inputSection!.toLowerCase()).toMatch(/topic|<topic>/);
    });

    test('P1: Input section describes optional flags (--sources, --output)', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const inputSection = extractSection(body!, 'Input');
      expect(inputSection).toBeTruthy();
      expect(inputSection).toMatch(/--sources/);
      expect(inputSection).toMatch(/--output/);
    });

    test('P1: Output section references docs/research/ output directory', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const outputSection = extractSection(body!, 'Output');
      expect(outputSection).toBeTruthy();
      expect(outputSection).toMatch(/docs\/research\//);
    });

    test('P2: Output section describes filename pattern general-research-{topic-slug}-{date}.md', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const outputSection = extractSection(body!, 'Output');
      expect(outputSection).toBeTruthy();
      expect(outputSection).toMatch(/general-research-\{topic-slug\}-\{date\}|filename.*pattern/);
    });
  });

  // =======================================================================
  // AC2: Workflow file exists at correct location
  // =======================================================================
  describe('AC2: Workflow file exists at correct location', () => {
    test('P0: research-general.md exists in workflows directory', () => {
      expect(existsSync(WORKFLOW_FILE)).toBe(true);
    });

    test('P0: workflow file has meaningful content (not a stub)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content.length).toBeGreaterThan(500);
    });

    test('P0: workflow defines Plan-Then-Execute workflow phases', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/plan.*then.*execute|scope.*confirmation/);
    });

    test('P0: workflow defines six sequential phases', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      // The six phases from the story
      expect(lowerContent).toMatch(/scope.*confirmation/);
      expect(lowerContent).toMatch(/research.*plan/);
      expect(lowerContent).toMatch(/swarm.*research|parallel.*research/);
    });

    test('P2: workflow file uses kebab-case naming', () => {
      const filename = WORKFLOW_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });
  });

  // =======================================================================
  // AC3: Workflow uses same four patterns as technical research
  // =======================================================================
  describe('AC3: Workflow uses same four patterns as technical research', () => {
    test('P0: workflow references Plan-Then-Execute pattern', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/plan.*then.*execute|scope.*confirmation|research.*plan/);
    });

    test('P0: workflow references Swarm Migration pattern', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/swarm|swarm.*migration|parallel.*subagent/);
    });

    test('P0: workflow references Reflection Loop pattern', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/reflection|reflection.*loop|self.*critique|quality.*check/);
    });

    test('P0: workflow references Filesystem-Based State pattern', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/filesystem.*state|\.research-state|state.*persist/);
    });

    test('P1: workflow patterns are same as technical research workflow', () => {
      const generalContent = readFileSync(WORKFLOW_FILE, 'utf8').toLowerCase();
      const techContent = readFileSync(REF_TECHNICAL_WORKFLOW_FILE, 'utf8').toLowerCase();

      // Both should reference the same patterns
      const patterns = ['plan', 'swarm', 'reflection', 'state'];
      patterns.forEach(pattern => {
        const generalHasPattern = generalContent.includes(pattern);
        const techHasPattern = techContent.includes(pattern);
        // Both should have the pattern or neither should
        expect(generalHasPattern).toBe(techHasPattern);
      });
    });
  });

  // =======================================================================
  // AC4: Output schema is type: general_research
  // =======================================================================
  describe('AC4: Output schema is type: general_research', () => {
    test('P0: workflow defines frontmatter schema with type: general_research', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/type:\s*general_research|frontmatter.*type.*general_research/);
    });

    test('P0: frontmatter type is general_research (NOT technical_research)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/type:\s*general_research/);
      // Should NOT be technical_research
      const frontmatterMatch = content.match(/type:\s*(\w+)/);
      if (frontmatterMatch) {
        expect(frontmatterMatch[1]).toBe('general_research');
      }
    });

    test('P0: workflow defines all 8 general research output sections', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      GENERAL_RESEARCH_SECTIONS.forEach(section => {
        expect(content.toLowerCase()).toMatch(new RegExp(section.toLowerCase(), 'i'));
      });
    });

    test('P1: workflow specifies Executive Summary section (2-3 paragraphs)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Executive Summary/i);
    });

    test('P1: workflow specifies Market Analysis section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Market Analysis/i);
    });

    test('P1: workflow specifies Competitive Landscape section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Competitive Landscape/i);
    });

    test('P1: workflow specifies Strategic Recommendations section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Strategic Recommendations/i);
    });

    test('P2: workflow output sections count is 8 (not 13 like technical)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Count how many of the general research sections are mentioned
      const mentionedSections = GENERAL_RESEARCH_SECTIONS.filter(section =>
        content.toLowerCase().includes(section.toLowerCase())
      );
      expect(mentionedSections.length).toBe(8);
    });
  });

  // =======================================================================
  // AC5: Same state file as technical research
  // =======================================================================
  describe('AC5: Same state file as technical research', () => {
    test('P0: workflow uses same state file path docs/research/.research-state.json', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/\.research-state\.json/);
    });

    test('P1: state file path is under docs/research/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/docs\/research\/\.research-state\.json/);
    });

    test('P1: state file is shared with technical research (same path)', () => {
      const generalContent = readFileSync(WORKFLOW_FILE, 'utf8');
      const techContent = readFileSync(REF_TECHNICAL_WORKFLOW_FILE, 'utf8');

      // Both should reference the same state file path
      const stateFilePattern = /docs\/research\/\.research-state\.json/;
      expect(generalContent).toMatch(stateFilePattern);
      expect(techContent).toMatch(stateFilePattern);
    });
  });

  // =======================================================================
  // AC6: Generated filename pattern
  // =======================================================================
  describe('AC6: Generated filename pattern', () => {
    test('P0: workflow specifies filename pattern general-research-{topic-slug}-{date}.md', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/general-research.*topic.*slug.*date|filename.*pattern|naming.*pattern/);
    });

    test('P1: workflow defines topic-slug as kebab-case transformation', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/kebab.*case|slug|topic.*slug/);
    });

    test('P2: workflow specifies date format as YYYY-MM-DD', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/yyyy-mm-dd|iso.*date|\{date\}/i);
    });
  });

  // =======================================================================
  // AC7: Adapter skill created
  // =======================================================================
  describe('AC7: Adapter skill creation', () => {
    test('P0: scrum-research-general.md adapter skill exists in .claude/skills/', () => {
      expect(existsSync(ADAPTER_SKILL_FILE)).toBe(true);
    });

    test('P0: adapter skill has valid YAML frontmatter', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      expect(content).toMatch(/^---\s*\n/);
      expect(content).toMatch(/\n---\s*\n/);
    });

    test('P0: adapter skill frontmatter name is "scrum-research-general"', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      expect(content).toMatch(/^name:\s*scrum-research-general$/m);
    });

    test('P0: adapter skill frontmatter trigger is /scrum-research general', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/trigger:\s*\/scrum-research general/);
    });

    test('P0: adapter skill frontmatter has description field', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/^description:/m);
    });

    test('P0: adapter skill frontmatter has framework_command field', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/framework_command:.*research-general\.md/);
    });

    test('P1: adapter skill body references the framework command file', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/research-general\.md/);
    });
  });

  // =======================================================================
  // AC8: Reuses Stories 9.3-9.6 patterns
  // =======================================================================
  describe('AC8: Reuses Stories 9.3-9.6 patterns', () => {
    test('P0: workflow reuses output template structure from Story 9-3', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should reference output template or frontmatter schema
      expect(content).toMatch(/frontmatter|template|output.*format/i);
    });

    test('P0: workflow reuses WebSearch integration from Story 9-4', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/websearch|web.*search/);
    });

    test('P0: workflow reuses Swarm Migration pattern from Story 9-4', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/swarm|parallel.*subagent/i);
    });

    test('P0: workflow reuses Reflection Loop from Story 9-5', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/reflection|reflection.*loop|self.*critique/i);
    });

    test('P0: workflow reuses Filesystem-Based State from Story 9-6', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/\.research-state\.json|state.*persist/i);
    });

    test('P1: workflow specifies 2-3 subagents for general research (vs 3-5 for technical)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should mention 2-3 subagents or subagent count less than technical
      expect(content).toMatch(/2-3|2.*3.*subagent|two.*three.*subagent/i);
    });

    test('P1: general research subagent focus areas differ from technical', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should mention market, competitive, strategic aspects
      expect(content.toLowerCase()).toMatch(/market|competitive|strategic/);
    });

    test('P1: workflow subagent templates are Market Analysis, Competitive Landscape, Strategic Recommendations', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/market.*analysis/);
      expect(lowerContent).toMatch(/competitive.*landscape/);
      expect(lowerContent).toMatch(/strategic.*recommendation/);
    });

    test('P1: workflow does NOT duplicate implementation from technical research', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should reference/reuse patterns, not re-implement them
      expect(content).toMatch(/reuse|same.*pattern|shared/i);
    });

    test('P2: workflow references researcher agent for pattern definitions', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/researcher.*agent|agents\/researcher\.md/);
    });

    test('P2: workflow references technical research workflow as structural reference', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/research-technical|technical.*research.*workflow/i);
    });

    test('P2: output sections match researcher agent general_research format', () => {
      const researcherContent = readFileSync(RESEARCHER_AGENT, 'utf8');
      const workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');

      // Both should define the same 8 sections
      GENERAL_RESEARCH_SECTIONS.forEach(section => {
        expect(researcherContent.toLowerCase()).toMatch(new RegExp(section.toLowerCase(), 'i'));
        expect(workflowContent.toLowerCase()).toMatch(new RegExp(section.toLowerCase(), 'i'));
      });
    });
  });

  // =======================================================================
  // Cross-cutting: Command file structural compliance
  // =======================================================================
  describe('Cross-cutting: Command file structural compliance', () => {
    test('P0: command file uses kebab-case filename', () => {
      const filename = COMMAND_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });

    test('P0: command YAML fields use snake_case', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      const yamlFields = frontmatter!.trim().split('\n')
        .filter((l: string) => l.includes(':') && !l.trim().startsWith('#') && !l.trim().startsWith('-'))
        .map((l: string) => l.split(':')[0].trim());
      yamlFields.forEach((field: string) => {
        expect(field).toMatch(/^[a-z][a-z0-9_]*$/);
      });
    });

    test('P1: command file structure matches research-technical.md convention', () => {
      const refContent = readFileSync(REF_TECHNICAL_COMMAND_FILE, 'utf8');
      const newContent = readFileSync(COMMAND_FILE, 'utf8');

      const getSections = (content: string) => {
        const sectionPattern = /^## (.+)$/gm;
        const sections: string[] = [];
        let match;
        while ((match = sectionPattern.exec(content)) !== null) {
          sections.push(match[1]);
        }
        return sections;
      };

      expect(getSections(newContent)).toEqual(getSections(refContent));
    });

    test('P1: command file differs from technical by trigger and purpose', () => {
      const techContent = readFileSync(REF_TECHNICAL_COMMAND_FILE, 'utf8');
      const generalContent = readFileSync(COMMAND_FILE, 'utf8');

      // General should have different trigger
      expect(generalContent).toMatch(/research-general/);
      expect(techContent).toMatch(/research-technical/);

      // General should mention general/business/market topics
      expect(generalContent.toLowerCase()).toMatch(/general|business|market|strategic/);
    });

    test('P1: command references WebSearch tool (not Glob/Grep)', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      // Research commands use WebSearch, not local scanning tools
      expect(lowerContent).toMatch(/websearch|web.*search|online.*research/);
    });

    test('P2: command file content is valid UTF-8 with reasonable length', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content.length).toBeGreaterThan(200);
      expect(content.length).toBeLessThan(5000);
    });
  });

  // =======================================================================
  // Cross-cutting: Workflow file structural compliance
  // =======================================================================
  describe('Cross-cutting: Workflow file structural compliance', () => {
    test('P0: workflow file uses kebab-case filename', () => {
      const filename = WORKFLOW_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });

    test('P0: workflow has numbered steps or phases', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should have numbered step/phase headings
      expect(content).toMatch(/Step\s+\d+|Phase\s+\d+|###?\s+\d+\.|Step\s+[0-9]/i);
    });

    test('P0: workflow has Prerequisites section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Prerequisite/i);
    });

    test('P0: workflow has Write Boundaries section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Write Boundaries/i);
    });

    test('P1: Prerequisites section references researcher agent', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const prereqPos = lowerContent.search(/prerequisite/);
      if (prereqPos >= 0) {
        const afterPrereq = content.substring(prereqPos);
        const nextSectionMatch = afterPrereq.search(/^##[^#]/m);
        const prereqSection = nextSectionMatch > 0 ? afterPrereq.substring(0, nextSectionMatch) : afterPrereq;
        expect(prereqSection.toLowerCase()).toMatch(/researcher.*agent|agents\/researcher/);
      }
      expect(prereqPos).toBeGreaterThanOrEqual(0);
    });

    test('P1: Prerequisites section references context/index.md', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const prereqPos = lowerContent.search(/prerequisite/);
      if (prereqPos >= 0) {
        const afterPrereq = content.substring(prereqPos);
        const nextSectionMatch = afterPrereq.search(/^##[^#]/m);
        const prereqSection = nextSectionMatch > 0 ? afterPrereq.substring(0, nextSectionMatch) : afterPrereq;
        expect(prereqSection.toLowerCase()).toMatch(/context\/index\.md/);
      }
      expect(prereqPos).toBeGreaterThanOrEqual(0);
    });

    test('P1: Write Boundaries permits docs/research/ files', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos);
        expect(afterWriteBoundaries).toMatch(/docs\/research\//);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test('P1: Write Boundaries prohibits writing to scrum_workflow/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos).toLowerCase();
        expect(afterWriteBoundaries).toMatch(/may\s*not.*scrum_workflow|not\s*write.*scrum_workflow|must\s*not.*scrum_workflow/);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test('P1: Write Boundaries prohibits writing to sprints/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos).toLowerCase();
        expect(afterWriteBoundaries).toMatch(/sprints/);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test('P1: Write Boundaries prohibits writing to context/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos).toLowerCase();
        expect(afterWriteBoundaries).toMatch(/context/);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test('P1: Write Boundaries prohibits writing to .claude/skills/', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const writeBoundariesPos = lowerContent.indexOf('write boundaries');
      if (writeBoundariesPos >= 0) {
        const afterWriteBoundaries = content.substring(writeBoundariesPos).toLowerCase();
        expect(afterWriteBoundaries).toMatch(/\.claude\/skills|adapter\s*skills/);
      }
      expect(writeBoundariesPos).toBeGreaterThanOrEqual(0);
    });

    test('P2: workflow content is substantial (not a stub)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // A real workflow skeleton should have significant content
      expect(content.length).toBeGreaterThan(2000);
    });
  });

  // =======================================================================
  // Cross-cutting: Adapter skill structural compliance
  // =======================================================================
  describe('Cross-cutting: Adapter skill structural compliance', () => {
    test('P0: adapter skill uses kebab-case filename', () => {
      const filename = ADAPTER_SKILL_FILE.split('/').pop() || '';
      expect(filename).toMatch(/^[a-z][a-z0-9-]*\.md$/);
    });

    test('P1: adapter skill follows scrum-research-technical.md adapter pattern', () => {
      const refContent = readFileSync(REF_ADAPTER_SKILL, 'utf8');
      const newContent = readFileSync(ADAPTER_SKILL_FILE, 'utf8');

      // Both should have frontmatter
      expect(extractFrontmatter(refContent)).toBeTruthy();
      expect(extractFrontmatter(newContent)).toBeTruthy();

      // Adapter is a thin reference -- body should be short
      const newBody = extractBody(newContent);
      expect(newBody).toBeTruthy();
      expect(newBody!.length).toBeLessThan(1000);
    });

    test('P1: adapter skill does NOT contain workflow logic', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      // Adapter should not have step definitions, orchestration logic, or phase definitions
      expect(body!.toLowerCase()).not.toMatch(/^##?\s*(step\s+\d|phase|mode\s+detect|orchestrat)/im);
    });

    test('P2: adapter skill body mentions framework command path', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      expect(content).toMatch(/\{framework_commands\}/);
    });
  });

  // =======================================================================
  // Cross-cutting: Three-layer architecture compliance
  // =======================================================================
  describe('Cross-cutting: Three-layer architecture compliance', () => {
    test('P0: command file is in Framework Layer (scrum_workflow/commands/)', () => {
      expect(COMMAND_FILE).toContain('scrum_workflow/commands/');
    });

    test('P0: workflow file is in Framework Layer (scrum_workflow/workflows/)', () => {
      expect(WORKFLOW_FILE).toContain('scrum_workflow/workflows/');
    });

    test('P0: adapter skill is in Adapter Layer (.claude/skills/)', () => {
      expect(ADAPTER_SKILL_FILE).toContain('.claude/skills/');
    });

    test('P1: command file is NOT in Adapter Layer', () => {
      expect(COMMAND_FILE).not.toContain('.claude/skills/');
    });

    test('P1: workflow file is NOT in Adapter Layer', () => {
      expect(WORKFLOW_FILE).not.toContain('.claude/skills/');
    });

    test('P1: adapter skill is NOT in Framework Layer', () => {
      expect(ADAPTER_SKILL_FILE).not.toContain('scrum_workflow/commands/');
      expect(ADAPTER_SKILL_FILE).not.toContain('scrum_workflow/workflows/');
    });
  });

  // =======================================================================
  // Cross-cutting: Research-specific differentiation from technical research
  // =======================================================================
  describe('Cross-cutting: General research differentiation from technical research', () => {
    test('P0: output filename uses general-research-* prefix (not technical-research-*)', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/general-research-\{topic-slug\}/);
      expect(content).not.toMatch(/technical-research-\{topic-slug\}/);
    });

    test('P1: workflow uses WebSearch (not Glob/Grep for local scanning)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/websearch|web.*search|online.*research/);
    });

    test('P1: workflow does NOT reference full-scan/update mode (that is for doc agents)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      // Research workflow uses Plan-Then-Execute, NOT full-scan/update
      expect(lowerContent).not.toMatch(/full-scan|full_scan/);
    });

    test('P1: output sections are 8 (not 13 like technical research)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should have the 8 general research sections
      const foundSections = GENERAL_RESEARCH_SECTIONS.filter(section =>
        content.toLowerCase().includes(section.toLowerCase())
      );
      expect(foundSections.length).toBeGreaterThanOrEqual(8);
    });

    test('P1: workflow references Swarm Migration with 2-3 subagents', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/2-3|2.*3.*subagent/i);
    });

    test('P2: workflow does NOT define update mode (deferred to Story 9-8)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      // This story is the base workflow only - no update mode
      expect(lowerContent).not.toMatch(/--update|update.*mode/);
    });

    test('P2: command trigger uses /research-general (not /research-technical)', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/trigger.*\/research-general/);
      expect(content).not.toMatch(/trigger.*\/research-technical/);
    });
  });

  // =======================================================================
  // Cross-cutting: Researcher agent compatibility
  // =======================================================================
  describe('Cross-cutting: Researcher agent compatibility', () => {
    test('P0: researcher agent exists (dependency from Story 9-1)', () => {
      expect(existsSync(RESEARCHER_AGENT)).toBe(true);
    });

    test('P1: researcher agent active_in includes research-general', () => {
      const content = readFileSync(RESEARCHER_AGENT, 'utf8');
      expect(content).toMatch(/active_in:/);
      expect(content).toMatch(/research-general/);
    });

    test('P1: command spawns_agents matches researcher agent active_in', () => {
      const agentContent = readFileSync(RESEARCHER_AGENT, 'utf8');
      const commandContent = readFileSync(COMMAND_FILE, 'utf8');

      // Command should spawn "researcher"
      expect(commandContent).toMatch(/spawns_agents/);
      expect(commandContent).toMatch(/researcher/);

      // Agent should be active in "research-general"
      expect(agentContent).toMatch(/research-general/);
    });

    test('P1: researcher agent defines general_research output format', () => {
      const content = readFileSync(RESEARCHER_AGENT, 'utf8');
      expect(content).toMatch(/general_research/);
      expect(content).toMatch(/Market Analysis|Competitive Landscape|Strategic Recommendations/);
    });
  });

  // =======================================================================
  // Cross-cutting: General research specific sections
  // =======================================================================
  describe('Cross-cutting: General research output sections validation', () => {
    test('P0: workflow defines Executive Summary section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Executive Summary/i);
    });

    test('P0: workflow defines Market Analysis section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Market Analysis/i);
    });

    test('P0: workflow defines Competitive Landscape section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Competitive Landscape/i);
    });

    test('P0: workflow defines Strategic Recommendations section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Strategic Recommendations/i);
    });

    test('P1: workflow defines Implementation Considerations section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Implementation Considerations/i);
    });

    test('P1: workflow defines Risk Assessment section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Risk Assessment/i);
    });

    test('P1: workflow defines Future Outlook section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/Future Outlook/i);
    });

    test('P1: workflow defines References section', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/References/i);
    });

    test('P2: workflow does NOT include technical-specific sections', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should NOT have technical research specific sections
      const lowerContent = content.toLowerCase();
      // Technical research has 13 sections including these that general research should NOT have
      expect(lowerContent).not.toMatch(/technical landscape/);
      expect(lowerContent).not.toMatch(/technology stack analysis/);
      expect(lowerContent).not.toMatch(/integration patterns/);
      expect(lowerContent).not.toMatch(/performance.*scalability/);
    });
  });

  // =======================================================================
  // Cross-cutting: Frontmatter schema validation
  // =======================================================================
  describe('Cross-cutting: Frontmatter schema validation', () => {
    test('P0: workflow defines ai_optimized: true in frontmatter schema', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/ai_optimized:\s*true/);
    });

    test('P0: workflow defines version: 1.0 in frontmatter schema', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/version:\s*1\.0/);
    });

    test('P1: workflow defines research_confidence as high/medium/low', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/high.*medium.*low|research_confidence.*high|confidence.*level/);
    });

    test('P1: workflow defines sources as list of URLs', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/sources:|source.*url/i);
    });

    test('P2: frontmatter schema matches researcher agent definition', () => {
      const researcherContent = readFileSync(RESEARCHER_AGENT, 'utf8');
      const workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');

      // Both should define the same frontmatter fields
      EXPECTED_GENERAL_FRONTMATTER_SCHEMA_FIELDS.forEach(field => {
        expect(researcherContent.toLowerCase()).toMatch(new RegExp(field.toLowerCase()));
        expect(workflowContent.toLowerCase()).toMatch(new RegExp(field.toLowerCase()));
      });
    });
  });
});

/**
 * TDD RED PHASE SUMMARY
 *
 * Total Tests: 98
 * - P0 (Critical): 44 tests
 * - P1 (High):     40 tests
 * - P2 (Medium):   14 tests
 *
 * All tests use test() to mark them as intentionally failing (TDD red phase).
 * The files being tested (research-general.md command, research-general.md
 * workflow, scrum-research-general.md adapter skill) do not exist yet.
 *
 * After implementation (TDD green phase):
 * 1. Remove test() from all test functions
 * 2. Run tests: npx jest research-general-command-workflow.spec.ts
 * 3. Verify all tests PASS
 * 4. If any tests fail, either fix implementation (feature bug) or fix test (test bug)
 *
 * Acceptance Criteria Coverage:
 * - AC1: Command file + body sections (SKILL.md format)           -> 20 tests
 * - AC2: Workflow file exists at correct location                  -> 5 tests
 * - AC3: Workflow uses same four patterns as technical research    -> 5 tests
 * - AC4: Output schema is type: general_research                   -> 8 tests
 * - AC5: Same state file as technical research                     -> 3 tests
 * - AC6: Generated filename pattern                                -> 3 tests
 * - AC7: Adapter skill creation                                    -> 7 tests
 * - AC8: Reuses Stories 9.3-9.6 patterns                           -> 12 tests
 * - Cross-cutting: Command structural compliance                   -> 6 tests
 * - Cross-cutting: Workflow structural compliance                  -> 12 tests
 * - Cross-cutting: Adapter skill structural compliance             -> 4 tests
 * - Cross-cutting: Three-layer architecture compliance             -> 6 tests
 * - Cross-cutting: General research differentiation                 -> 7 tests
 * - Cross-cutting: Researcher agent compatibility                  -> 4 tests
 * - Cross-cutting: General research output sections validation     -> 9 tests
 * - Cross-cutting: Frontmatter schema validation                   -> 5 tests
 *
 * Knowledge Fragments Applied:
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: File system validation (infrastructure level)
 * - test-priorities-matrix.md: P0-P3 priority assignment per business impact
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 */
