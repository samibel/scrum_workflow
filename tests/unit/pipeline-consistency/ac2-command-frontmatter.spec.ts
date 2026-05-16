import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const PROJECT_ROOT = process.cwd();

const COMMAND_SETS = [
  {
    label: 'core',
    devStoryPath: join(PROJECT_ROOT, 'src', 'core', 'commands', 'dev-story.md'),
    verifyPath: join(PROJECT_ROOT, 'src', 'core', 'commands', 'verify.md'),
  },
  {
    label: 'template mirror',
    devStoryPath: join(
      PROJECT_ROOT,
      'src',
      'cli',
      'templates',
      'scrum_workflow',
      'commands',
      'dev-story.md',
    ),
    verifyPath: join(
      PROJECT_ROOT,
      'src',
      'cli',
      'templates',
      'scrum_workflow',
      'commands',
      'verify.md',
    ),
  },
];

function loadFrontmatter(filePath: string): Record<string, unknown> {
  const content = readFileSync(filePath, 'utf8');
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  expect(match, `${filePath} must have YAML frontmatter`).not.toBeNull();
  return yaml.load(match![1]) as Record<string, unknown>;
}

describe.each(COMMAND_SETS)('$label command frontmatter status contract', ({ devStoryPath, verifyPath }) => {
  test('dev-story.md does not set review', () => {
    const frontmatter = loadFrontmatter(devStoryPath);

    expect(frontmatter.sets_status).toBe('in-progress');
    expect(frontmatter.sets_status).not.toBe('review');
  });

  test('verify.md requires in-progress and sets review', () => {
    const frontmatter = loadFrontmatter(verifyPath);

    expect(frontmatter.requires_status).toBe('in-progress');
    expect(frontmatter.sets_status).toBe('review');
  });
});
