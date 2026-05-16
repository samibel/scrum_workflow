import { join } from 'node:path';

const PROJECT_ROOT = process.cwd();

const STATUS_HISTORY_UTILS = [
  {
    label: 'core',
    modulePath: join(PROJECT_ROOT, 'src', 'core', 'utils', 'status_history.js'),
  },
  {
    label: 'template mirror',
    modulePath: join(
      PROJECT_ROOT,
      'src',
      'cli',
      'templates',
      'scrum_workflow',
      'utils',
      'status_history.js',
    ),
  },
];

describe.each(STATUS_HISTORY_UTILS)('$label review audit trail', ({ modulePath }) => {
  test('status_history entry for review records /scrum-verify and references verification-report.md', async () => {
    const { appendStatusHistory } = await import(`${modulePath}?t=${Date.now()}`);
    const story = {
      frontmatter: {
        ticket: 'SW-900',
        status: 'in-progress',
        status_history: [],
      },
      content: '# Story',
    };

    const updatedStory = appendStatusHistory(story, '/scrum-verify', 'review', {
      actor: 'verification-skill',
      artifact: 'verification-report.md',
    });
    const reviewEntry = updatedStory.frontmatter.status_history.at(-1);

    expect(reviewEntry).toMatchObject({
      from: 'in-progress',
      to: 'review',
      trigger: '/scrum-verify',
      artifact: 'verification-report.md',
    });
  });
});
