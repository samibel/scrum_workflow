import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PROJECT_ROOT = process.cwd();

const VERIFY_UTILS = [
  {
    label: 'core',
    modulePath: join(PROJECT_ROOT, 'src', 'core', 'utils', 'verify.js'),
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
      'verify.js',
    ),
  },
];

describe.each(VERIFY_UTILS)('$label review transition guard', ({ modulePath }) => {
  let storyDir: string;

  beforeEach(() => {
    storyDir = join(tmpdir(), `scrum-review-guard-${process.pid}-${Date.now()}`);
    mkdirSync(storyDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(storyDir, { recursive: true, force: true });
  });

  test('in-progress story without verification-report.md must not move to review', async () => {
    const { validateReviewTransitionGuard } = await import(`${modulePath}?t=${Date.now()}`);
    const story = { frontmatter: { ticket: 'SW-900', status: 'in-progress' } };

    expect(validateReviewTransitionGuard(story, storyDir)).toMatchObject({
      allowed: false,
      reason: expect.stringMatching(/verification-report\.md.*not found/i),
    });
  });

  test('in-progress story with failed verification-report.md must not move to review', async () => {
    const { validateReviewTransitionGuard } = await import(`${modulePath}?t=${Date.now()}`);
    writeFileSync(
      join(storyDir, 'verification-report.md'),
      '---\nstatus: failed\nverdict: FAIL\n---\n# Verification Report\n',
      'utf8',
    );
    const story = { frontmatter: { ticket: 'SW-900', status: 'in-progress' } };

    expect(validateReviewTransitionGuard(story, storyDir)).toMatchObject({
      allowed: false,
      reason: expect.stringMatching(/failed|not passed/i),
    });
  });

  test('in-progress story with passed verification-report.md may move to review', async () => {
    const { validateReviewTransitionGuard } = await import(`${modulePath}?t=${Date.now()}`);
    writeFileSync(
      join(storyDir, 'verification-report.md'),
      '---\nstatus: passed\nverdict: PASS\n---\n# Verification Report\n',
      'utf8',
    );
    const story = { frontmatter: { ticket: 'SW-900', status: 'in-progress' } };

    expect(validateReviewTransitionGuard(story, storyDir)).toMatchObject({
      allowed: true,
    });
  });
});
