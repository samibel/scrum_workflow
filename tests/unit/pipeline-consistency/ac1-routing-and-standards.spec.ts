import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const PROJECT_ROOT = process.cwd();

const FRAMEWORKS = [
  {
    label: 'core',
    routingPath: join(PROJECT_ROOT, 'src', 'core', 'data', 'pipeline-routing.yaml'),
    standardsPath: join(PROJECT_ROOT, 'src', 'core', 'context', 'standards.md'),
  },
  {
    label: 'template mirror',
    routingPath: join(
      PROJECT_ROOT,
      'src',
      'cli',
      'templates',
      'scrum_workflow',
      'data',
      'pipeline-routing.yaml',
    ),
    standardsPath: join(
      PROJECT_ROOT,
      'src',
      'cli',
      'templates',
      'scrum_workflow',
      'context',
      'standards.md',
    ),
  },
];

type RoutingEntry = {
  current_status: string;
  next_command: string | null;
  target_status: string | null;
  action: string;
};

type StandardsTransition = {
  from: string;
  to: string;
  trigger: string;
};

function loadRoutingMatrix(routingPath: string): RoutingEntry[] {
  const doc = yaml.load(readFileSync(routingPath, 'utf8')) as { routing_matrix: RoutingEntry[] };
  return doc.routing_matrix;
}

function parseStandardsTransitions(standardsPath: string): StandardsTransition[] {
  const content = readFileSync(standardsPath, 'utf8');
  const section = content.match(/### Valid Transitions[\s\S]*?(?=\n### |\n## |$)/);
  expect(section, `${standardsPath} must contain a Valid Transitions section`).not.toBeNull();

  return section![0]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('| `'))
    .map((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim().replace(/^`|`$/g, ''));
      return { from: cells[0], to: cells[1], trigger: cells[2] };
    });
}

describe.each(FRAMEWORKS)('$label pipeline routing consistency', ({ routingPath, standardsPath }) => {
  test('does not route in-progress stories directly to review via /scrum-dev-story', () => {
    const routingMatrix = loadRoutingMatrix(routingPath);

    expect(routingMatrix).not.toContainEqual(
      expect.objectContaining({
        current_status: 'in-progress',
        target_status: 'review',
        next_command: '/scrum-dev-story',
      }),
    );
  });

  test('routes in-progress stories through /scrum-verify before review', () => {
    const routingMatrix = loadRoutingMatrix(routingPath);

    expect(routingMatrix).toContainEqual(
      expect.objectContaining({
        current_status: 'in-progress',
        target_status: 'review',
        next_command: '/scrum-verify',
        action: 'route',
      }),
    );
  });

  test('route entries in pipeline-routing.yaml match the standards.md Valid Transitions table', () => {
    const routingMatrix = loadRoutingMatrix(routingPath);
    const standardsTransitions = parseStandardsTransitions(standardsPath);

    const standardTransitionKeys = new Set(
      standardsTransitions.map(({ from, to, trigger }) => `${from}|${to}|${trigger}`),
    );

    const routeTransitions = routingMatrix.filter(
      (entry) =>
        entry.action === 'route' &&
        entry.current_status !== '_not_found' &&
        entry.target_status !== null &&
        entry.next_command !== null,
    );

    const hasMatchingStandardsPath = (entry: RoutingEntry) => {
      const directKey = `${entry.current_status}|${entry.target_status}|${entry.next_command}`;
      if (standardTransitionKeys.has(directKey)) return true;

      // Some pipeline routes intentionally model the externally visible command outcome,
      // while standards.md also records an implementation-internal sub-state for the
      // same command (for example draft -> refinement -> refined).
      return standardsTransitions.some(
        (first) =>
          first.from === entry.current_status &&
          first.trigger === entry.next_command &&
          standardsTransitions.some(
            (second) =>
              second.from === first.to &&
              second.to === entry.target_status &&
              second.trigger === entry.next_command,
          ),
      );
    };

    for (const entry of routeTransitions) {
      expect(hasMatchingStandardsPath(entry)).toBe(true);
    }

    expect(standardTransitionKeys).toContain('in-progress|review|/scrum-verify');
    expect(standardTransitionKeys).not.toContain('in-progress|review|/scrum-dev-story');
  });
});
