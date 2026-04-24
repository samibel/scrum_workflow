import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('AC1: /scrum-create-concept specification artifacts', () => {
  const coreCommand = join(process.cwd(), 'commands/create-concept.md');
  const coreWorkflow = join(process.cwd(), 'workflows/concept-creation.md');
  const coreTemplate = join(process.cwd(), 'templates/concept.md');

  test('[P0] create-concept command spec should exist', () => {
    expect(existsSync(coreCommand)).toBe(true);
  });

  test('[P0] concept-creation workflow spec should exist', () => {
    expect(existsSync(coreWorkflow)).toBe(true);
  });

  test('[P0] concept template should exist', () => {
    expect(existsSync(coreTemplate)).toBe(true);
  });

  test('[P0] command should enforce analysis-only behavior and no direct ticket creation', () => {
    const content = readFileSync(coreCommand, 'utf8');
    expect(content).toMatch(/does not implement code/i);
    expect(content).toMatch(/does not create a Scrum ticket directly/i);
  });

  test('[P0] command should require analysis graph, options, recommendation, and test strategy', () => {
    const content = readFileSync(coreCommand, 'utf8');
    expect(content).toMatch(/Analysis Graph/i);
    expect(content).toMatch(/at least two solution options/i);
    expect(content).toMatch(/Recommend(ed|ation)/i);
    expect(content).toMatch(/test strategy/i);
  });

  test('[P0] command should define concept output path in _scrum-output/concepts/', () => {
    const content = readFileSync(coreCommand, 'utf8');
    expect(content).toMatch(/_scrum-output\/concepts\/<slug>\/concept\.md/);
  });

  test('[P0] workflow should include all required graph-based phases', () => {
    const content = readFileSync(coreWorkflow, 'utf8');
    expect(content).toMatch(/Phase 3: Analysis Graph Construction/);
    expect(content).toMatch(/Phase 4: Solution Exploration/);
    expect(content).toMatch(/Phase 6: Implementation Plan/);
    expect(content).toMatch(/Phase 7: Test Strategy/);
    expect(content).toMatch(/Phase 8: Concept File Creation/);
  });

  test('[P0] template should include required concept sections and analysis graph', () => {
    const content = readFileSync(coreTemplate, 'utf8');
    expect(content).toMatch(/kind:\s*"concept"/);
    expect(content).toMatch(/## 3\. Analysis Graph/);
    expect(content).toMatch(/```mermaid/);
    expect(content).toMatch(/## 10\. Recommended Solution/);
    expect(content).toMatch(/## 12\. Test Strategy/);
    expect(content).toMatch(/## 13\. Risks/);
    expect(content).toMatch(/## 14\. Open Questions/);
  });
});
