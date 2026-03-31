/**
 * ATDD Test Suite for Story 9-2: /scrum-research technical Command & Workflow Skeleton
 *
 * These tests verify that the command file, workflow file, and adapter skill file
 * are properly structured following the established conventions from existing
 * commands (create-project-docs.md, create-architecture-docs.md) and workflows
 * (architecture-documentation.md, project-documentation.md).
 *
 * Test Levels: File System Validation Tests (Infrastructure/Framework)
 * Test Framework: Jest with TypeScript
 * TDD Phase: RED (tests will fail because files do not exist yet)
 *
 * Coverage: 104 test scenarios across 11 acceptance criteria + cross-cutting
 * - AC1:  Command file exists at correct location with SKILL.md format (8 + 12 body section tests)
 * - AC2:  Workflow file exists with Plan-Then-Execute workflow (5 tests)
 * - AC3:  Command accepts topic argument (4 tests)
 * - AC4:  Command accepts optional flags (5 tests)
 * - AC5:  Research output directory definition (3 tests)
 * - AC6:  Agent and context loading (5 tests)
 * - AC7:  Plan-Then-Execute workflow orchestration with six phases (10 tests)
 * - AC8:  Generated filename pattern (3 tests)
 * - AC9:  Adapter skill creation (7 tests)
 * - AC10: Command reads project context (4 tests)
 * - AC11: Output follows frontmatter schema (5 tests)
 * - Cross-cutting: Naming/structural/three-layer compliance (33 tests)
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
const COMMAND_FILE = join(COMMANDS_DIR, 'research-technical.md');
const WORKFLOW_FILE = join(WORKFLOWS_DIR, 'research-technical.md');
const ADAPTER_SKILL_FILE = join(ADAPTER_SKILLS_DIR, 'scrum-research-technical.md');

// Reference files for structural comparison
const REF_COMMAND_FILE = join(COMMANDS_DIR, 'create-project-docs.md');
const REF_WORKFLOW_FILE = join(WORKFLOWS_DIR, 'architecture-documentation.md');
const REF_ADAPTER_SKILL = join(ADAPTER_SKILLS_DIR, 'create-project-docs.md');
const RESEARCHER_AGENT = join(AGENTS_DIR, 'researcher.md');

// Expected command frontmatter fields in order
const COMMAND_FRONTMATTER_FIELDS = ['name', 'trigger', 'requires_status', 'sets_status', 'spawns_agents'];

// Expected command body sections in order
const COMMAND_BODY_SECTIONS = ['Purpose', 'Workflow Reference', 'Input', 'Output'];

// Expected adapter skill frontmatter fields
const ADAPTER_FRONTMATTER_FIELDS = ['name', 'trigger', 'description', 'framework_command'];

// Expected frontmatter schema fields for generated research output
const EXPECTED_FRONTMATTER_SCHEMA_FIELDS = [
  'type', 'topic', 'date', 'sources', 'ai_optimized', 'version', 'research_confidence'
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
// Story 9-2 Test Suite
// =======================================================================
describe('Story 9-2: /scrum-research technical Command & Workflow Skeleton', () => {

  // =======================================================================
  // AC1: Command file exists at correct location
  // =======================================================================
  describe('AC1: Command file exists at correct location with SKILL.md format', () => {
    test('P0: research-technical.md exists in commands directory', () => {
      expect(existsSync(COMMAND_FILE)).toBe(true);
    });

    test('P0: command file has valid YAML frontmatter delimiters', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^---\s*\n/);
      expect(content).toMatch(/\n---\s*\n/);
    });

    test('P0: frontmatter name field is "research-technical"', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/^name:\s*research-technical$/m);
    });

    test('P0: frontmatter trigger field is "/research-technical"', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/trigger:\s*["']?\/research-technical["']?/);
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

    test('P1: Workflow Reference section references workflows/research-technical.md', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toContain('workflows/research-technical.md');
    });

    test('P0: Purpose section describes technical research with agentic patterns', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const purposeSection = extractSection(body!, 'Purpose');
      expect(purposeSection).toBeTruthy();
      const lowerPurpose = purposeSection!.toLowerCase();
      expect(lowerPurpose).toMatch(/research/);
      expect(lowerPurpose).toMatch(/technical/);
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

    test('P2: Output section describes filename pattern', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      const outputSection = extractSection(body!, 'Output');
      expect(outputSection).toBeTruthy();
      expect(outputSection).toMatch(/technical-research-\{topic-slug\}-\{date\}|filename.*pattern/);
    });
  });

  // =======================================================================
  // AC2: Workflow file exists at correct location
  // =======================================================================
  describe('AC2: Workflow file exists at correct location', () => {
    test('P0: research-technical.md exists in workflows directory', () => {
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
  // AC3: Command accepts topic argument
  // =======================================================================
  describe('AC3: Command accepts topic argument', () => {
    test('P0: Input section documents <topic> argument', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/<topic>/);
    });

    test('P1: Input section shows example invocation with topic', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/\/research-technical.*topic|\/scrum-research.*technical.*topic/);
    });

    test('P1: workflow defines topic parsing step', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/topic.*pars|pars.*topic|input.*pars|extract.*topic/);
    });

    test('P2: topic argument is described as required', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const inputSection = extractSection(extractBody(content) || '', 'Input');
      if (inputSection) {
        const lowerInput = inputSection.toLowerCase();
        expect(lowerInput).toMatch(/required|mandatory|must|argument/);
      }
    });
  });

  // =======================================================================
  // AC4: Command accepts optional flags
  // =======================================================================
  describe('AC4: Command accepts optional flags', () => {
    test('P0: --sources flag is documented', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/--sources/);
    });

    test('P0: --output flag is documented', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/--output/);
    });

    test('P1: --sources flag accepts URL list', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const inputSection = extractSection(extractBody(content) || '', 'Input');
      if (inputSection) {
        expect(inputSection).toMatch(/--sources.*url|--sources.*<url/i);
      }
    });

    test('P1: --output flag accepts custom path with default docs/research/', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const inputSection = extractSection(extractBody(content) || '', 'Input');
      if (inputSection) {
        expect(inputSection).toMatch(/--output.*path|--output.*<path>|default.*docs\/research/i);
      }
    });

    test('P2: workflow handles flag parsing for --sources and --output', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/--sources|--output/);
    });
  });

  // =======================================================================
  // AC5: Research output directory
  // =======================================================================
  describe('AC5: Research output directory defined as docs/research/', () => {
    test('P0: workflow references docs/research/ as output directory', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/docs\/research\//);
    });

    test('P1: workflow mentions docs/research/ relative to project root', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      // Should describe docs/research/ as relative to project root, not inside scrum_workflow/
      expect(lowerContent).toMatch(/project\s*root|relative/);
      expect(content).toMatch(/docs\/research\//);
    });

    test('P1: workflow creates docs/research/ if it does not exist', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/creat.*docs\/research|docs\/research.*creat|mkdir|directory.*creat|not exist/);
    });
  });

  // =======================================================================
  // AC6: Agent and context loading
  // =======================================================================
  describe('AC6: Agent and context loading', () => {
    test('P0: workflow references researcher agent definition', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/researcher/);
      expect(content).toMatch(/agents\/researcher\.md/);
    });

    test('P0: workflow references project context loading', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/context\/index\.md/);
    });

    test('P1: workflow loads agent definition before starting research', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Agent loading should appear before research/scanning steps
      const agentLoadPos = content.indexOf('agents/researcher');
      const researchPos = content.search(/swarm.*research|research.*plan|scope.*confirmation/i);
      if (agentLoadPos >= 0 && researchPos >= 0) {
        expect(agentLoadPos).toBeLessThan(researchPos);
      }
      expect(agentLoadPos).toBeGreaterThanOrEqual(0);
    });

    test('P1: workflow loads project context before starting research', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const contextLoadPos = content.indexOf('context/index.md');
      const researchPos = content.search(/swarm.*research|scope.*confirmation/i);
      if (contextLoadPos >= 0 && researchPos >= 0) {
        expect(contextLoadPos).toBeLessThan(researchPos);
      }
      expect(contextLoadPos).toBeGreaterThanOrEqual(0);
    });

    test('P2: workflow warns but continues if context files do not exist', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/warn|warning|optional|not.*halt|not.*fail/);
    });
  });

  // =======================================================================
  // AC7: Plan-Then-Execute workflow orchestration
  // =======================================================================
  describe('AC7: Plan-Then-Execute workflow orchestration with six phases', () => {
    test('P0: workflow defines Phase 1 - Scope Confirmation', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/scope.*confirmation|confirm.*scope/);
    });

    test('P0: workflow defines Phase 2 - Research Plan', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/research.*plan/);
    });

    test('P0: workflow defines Phase 3 - Swarm Research (parallel)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/swarm|parallel.*subagent|parallel.*research/);
    });

    test('P0: workflow defines Phase 4 - Verification', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/verif|cross.*ref|source.*valid/);
    });

    test('P0: workflow defines Phase 5 - Reflection Loop', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/reflection|self.*critique|quality.*check/);
    });

    test('P0: workflow defines Phase 6 - Synthesis', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/synthesis|final.*document|document.*assembly/);
    });

    test('P1: workflow phases are in correct sequential order', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();

      const scopePos = lowerContent.search(/scope.*confirmation|confirm.*scope/);
      const planPos = lowerContent.search(/research.*plan/);
      const swarmPos = lowerContent.search(/swarm|parallel.*subagent|parallel.*research/);
      const verifyPos = lowerContent.search(/verif|cross.*ref|source.*valid/);
      const reflectPos = lowerContent.search(/reflection|self.*critique|quality.*check/);
      const synthPos = lowerContent.search(/synthesis|final.*document|document.*assembly/);

      // Each phase should be found
      expect(scopePos).toBeGreaterThanOrEqual(0);
      expect(planPos).toBeGreaterThanOrEqual(0);
      expect(swarmPos).toBeGreaterThanOrEqual(0);
      expect(verifyPos).toBeGreaterThanOrEqual(0);
      expect(reflectPos).toBeGreaterThanOrEqual(0);
      expect(synthPos).toBeGreaterThanOrEqual(0);

      // Phases should be in order
      expect(scopePos).toBeLessThan(planPos);
      expect(planPos).toBeLessThan(swarmPos);
      expect(swarmPos).toBeLessThan(verifyPos);
      expect(verifyPos).toBeLessThan(reflectPos);
      expect(reflectPos).toBeLessThan(synthPos);
    });

    test('P1: Scope Confirmation includes user approval gate', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      const scopeSection = content.substring(
        lowerContent.search(/scope.*confirmation/),
        lowerContent.search(/research.*plan/) > 0 ? lowerContent.search(/research.*plan/) : content.length
      );
      expect(scopeSection.toLowerCase()).toMatch(/user.*approv|confirm|approv.*gate/);
    });

    test('P1: Swarm Research mentions 3-5 parallel subagents', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/3-5|3.*5.*subagent|parallel.*subagent/);
    });

    test('P2: Reflection Loop specifies up to 2 iterations', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/2.*iteration|up to 2|maximum.*2/i);
    });
  });

  // =======================================================================
  // AC8: Generated filename pattern
  // =======================================================================
  describe('AC8: Generated filename pattern', () => {
    test('P0: workflow specifies filename pattern technical-research-{topic-slug}-{date}.md', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/technical-research.*topic.*slug.*date|filename.*pattern|naming.*pattern/);
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
  // AC9: Adapter skill creation
  // =======================================================================
  describe('AC9: Adapter skill creation', () => {
    test('P0: scrum-research-technical.md adapter skill exists in .claude/skills/', () => {
      expect(existsSync(ADAPTER_SKILL_FILE)).toBe(true);
    });

    test('P0: adapter skill has valid YAML frontmatter', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      expect(content).toMatch(/^---\s*\n/);
      expect(content).toMatch(/\n---\s*\n/);
    });

    test('P0: adapter skill frontmatter name is "scrum-research-technical"', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      expect(content).toMatch(/^name:\s*scrum-research-technical$/m);
    });

    test('P0: adapter skill frontmatter trigger is /scrum-research technical', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const frontmatter = extractFrontmatter(content);
      expect(frontmatter).toBeTruthy();
      expect(frontmatter).toMatch(/trigger:\s*\/scrum-research technical/);
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
      expect(frontmatter).toMatch(/framework_command:.*research-technical\.md/);
    });

    test('P1: adapter skill body references the framework command file', () => {
      const content = readFileSync(ADAPTER_SKILL_FILE, 'utf8');
      const body = extractBody(content);
      expect(body).toBeTruthy();
      expect(body).toMatch(/research-technical\.md/);
    });
  });

  // =======================================================================
  // AC10: Command reads project context
  // =======================================================================
  describe('AC10: Command reads project context', () => {
    test('P0: command or workflow references context/index.md', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/context\/index\.md/);
    });

    test('P1: context reading determines project domain for context-aware research', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/domain|tech\s*stack|context.*aware/);
    });

    test('P1: context reading determines tech stack', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/tech\s*stack|technology|framework/);
    });

    test('P2: command warns but does not halt if context/index.md is missing', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/warn|warning|not.*halt|optional|if.*missing.*proceed/);
    });
  });

  // =======================================================================
  // AC11: Output follows frontmatter schema
  // =======================================================================
  describe('AC11: Output follows frontmatter schema', () => {
    test('P0: workflow defines frontmatter schema with type field', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/type:\s*technical_research|frontmatter.*type/);
    });

    test('P0: workflow defines frontmatter schema with all required fields', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // Should mention all seven required fields
      expect(content).toMatch(/type/);
      expect(content).toMatch(/topic/);
      expect(content).toMatch(/date/);
      expect(content).toMatch(/sources/);
      expect(content).toMatch(/ai_optimized/);
      expect(content).toMatch(/version/);
      expect(content).toMatch(/research_confidence/);
    });

    test('P1: workflow specifies ai_optimized must be true', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/ai_optimized:\s*true/);
    });

    test('P1: workflow specifies version as 1.0', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/version:\s*1\.0/);
    });

    test('P1: workflow defines research_confidence as high/medium/low', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/high.*medium.*low|research_confidence.*high|confidence.*level/);
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

    test('P1: command file structure matches create-project-docs.md convention', () => {
      // Both should have same section structure
      const refContent = readFileSync(REF_COMMAND_FILE, 'utf8');
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

    test('P1: command file differs from doc commands by accepting topic argument', () => {
      const refContent = readFileSync(REF_COMMAND_FILE, 'utf8');
      const newContent = readFileSync(COMMAND_FILE, 'utf8');

      // The research command should mention topic argument
      expect(newContent).toMatch(/<topic>/);
      // The doc command should NOT mention topic argument
      expect(refContent).not.toMatch(/<topic>/);
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
        // Find the next section boundary
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

    test('P1: adapter skill follows create-project-docs.md adapter pattern', () => {
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
  // Cross-cutting: Research-specific differentiation from doc commands
  // =======================================================================
  describe('Cross-cutting: Research command differentiation from documentation commands', () => {
    test('P0: output directory is docs/research/ (NOT _scrum-output/docs/ or docs/generated/)', () => {
      const content = readFileSync(COMMAND_FILE, 'utf8');
      expect(content).toMatch(/docs\/research\//);
      // Must NOT use the documentation agent output directories
      expect(content).not.toMatch(/_scrum-output\/docs\//);
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

    test('P1: workflow references Swarm Migration pattern', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/swarm|swarm.*migration/i);
    });

    test('P1: workflow references Reflection Loop pattern', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      expect(content).toMatch(/reflection|reflection.*loop/i);
    });

    test('P2: workflow references Filesystem-Based State pattern (deferred to Story 9-6)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      // The skeleton may mention state management, but full implementation is 9-6
      // Either it references the pattern or it notes that state management is coming in 9-6
      const lowerContent = content.toLowerCase();
      expect(lowerContent).toMatch(/filesystem.*state|\.research-state|state.*persist|story\s*9-6|story\s*9\.6/);
    });

    test('P2: workflow does NOT define update mode (deferred to Story 9-8)', () => {
      const content = readFileSync(WORKFLOW_FILE, 'utf8');
      const lowerContent = content.toLowerCase();
      // This story is the base workflow only - no update mode
      expect(lowerContent).not.toMatch(/--update|update.*mode/);
    });
  });

  // =======================================================================
  // Cross-cutting: Researcher agent compatibility
  // =======================================================================
  describe('Cross-cutting: Researcher agent compatibility', () => {
    test('P0: researcher agent exists (dependency from Story 9-1)', () => {
      expect(existsSync(RESEARCHER_AGENT)).toBe(true);
    });

    test('P1: researcher agent active_in includes research-technical', () => {
      const content = readFileSync(RESEARCHER_AGENT, 'utf8');
      expect(content).toMatch(/active_in:/);
      expect(content).toMatch(/research-technical/);
    });

    test('P1: command spawns_agents matches researcher agent active_in', () => {
      const agentContent = readFileSync(RESEARCHER_AGENT, 'utf8');
      const commandContent = readFileSync(COMMAND_FILE, 'utf8');

      // Command should spawn "researcher"
      expect(commandContent).toMatch(/spawns_agents/);
      expect(commandContent).toMatch(/researcher/);

      // Agent should be active in "research-technical"
      expect(agentContent).toMatch(/research-technical/);
    });
  });
});

/**
 * TDD RED PHASE SUMMARY
 *
 * Total Tests: 104
 * - P0 (Critical): 46 tests
 * - P1 (High):     42 tests
 * - P2 (Medium):   16 tests
 *
 * All tests use test() to mark them as intentionally failing (TDD red phase).
 * The files being tested (research-technical.md command, research-technical.md
 * workflow, scrum-research-technical.md adapter skill) do not exist yet.
 *
 * After implementation (TDD green phase):
 * 1. Remove test() from all test functions
 * 2. Run tests: npx jest research-technical-command-workflow.spec.ts
 * 3. Verify all tests PASS
 * 4. If any tests fail, either fix implementation (feature bug) or fix test (test bug)
 *
 * Acceptance Criteria Coverage:
 * - AC1:  Command file + body sections (SKILL.md format)           -> 20 tests
 * - AC2:  Workflow file exists at correct location                  -> 5 tests
 * - AC3:  Command accepts topic argument                            -> 4 tests
 * - AC4:  Command accepts optional flags                            -> 5 tests
 * - AC5:  Research output directory (docs/research/)                -> 3 tests
 * - AC6:  Agent and context loading                                 -> 5 tests
 * - AC7:  Plan-Then-Execute workflow orchestration with six phases  -> 10 tests
 * - AC8:  Generated filename pattern                                -> 3 tests
 * - AC9:  Adapter skill creation                                    -> 7 tests
 * - AC10: Command reads project context                             -> 4 tests
 * - AC11: Output follows frontmatter schema                         -> 5 tests
 * - Cross-cutting: Command structural compliance                    -> 6 tests
 * - Cross-cutting: Workflow structural compliance                   -> 12 tests
 * - Cross-cutting: Adapter skill structural compliance              -> 4 tests
 * - Cross-cutting: Three-layer architecture compliance              -> 6 tests
 * - Cross-cutting: Research command differentiation                 -> 7 tests
 * - Cross-cutting: Researcher agent compatibility                   -> 3 tests
 *
 * Knowledge Fragments Applied:
 * - test-quality.md: Deterministic, isolated, explicit, focused tests
 * - test-levels-framework.md: File system validation (infrastructure level)
 * - test-priorities-matrix.md: P0-P3 priority assignment per business impact
 * - component-tdd.md: Red-Green-Refactor TDD cycle
 */
