import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createSessionSummary } from '../../scrum_workflow/skills/wrap-up/wrap-up-impl.js';

/**
 * AC-2: Frontmatter and Content Structure
 *
 * Given the session summary artifact
 * When it is created
 * Then it contains YAML frontmatter with: date, stories touched, session duration context
 * And the content is structured for easy scanning by `/session-start`
 */

describe('AC2: Frontmatter and Content Structure', () => {
  const testOutputDir = join(process.cwd(), '_scrum-output', 'memory', 'sessions', 'test');
  const sessionDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const sessionFilePath = join(testOutputDir, `session-${sessionDate}.md`);

  beforeEach(() => {
    mkdirSync(testOutputDir, { recursive: true });
  });

  afterEach(() => {
    try {
      if (existsSync(testOutputDir)) {
        rmSync(testOutputDir, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  it('should contain YAML frontmatter', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');

    // Act
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });

    // Assert
    const content = readFileSync(sessionFilePath, 'utf-8');
    expect(content).toMatch(/^---\n/);
    expect(content).toMatch(/\n---\n/);
  });

  it('should have date field in frontmatter', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');

    // Act
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });

    // Assert
    const content = readFileSync(sessionFilePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    expect(frontmatterMatch).toBeTruthy();

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      expect(frontmatter).toMatch(/date:\s*/i);
    }
  });

  it('should have stories_touched field in frontmatter', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');

    // Act
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });

    // Assert
    const content = readFileSync(sessionFilePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    expect(frontmatterMatch).toBeTruthy();

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      expect(frontmatter).toMatch(/stories_touched:\s*/i);
    }
  });

  it('should have session_duration field in frontmatter', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');

    // Act
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });

    // Assert
    const content = readFileSync(sessionFilePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    expect(frontmatterMatch).toBeTruthy();

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      expect(frontmatter).toMatch(/session_duration:\s*/i);
    }
  });

  it('should have schema_version in frontmatter', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');

    // Act
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });

    // Assert
    const content = readFileSync(sessionFilePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    expect(frontmatterMatch).toBeTruthy();

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      expect(frontmatter).toMatch(/schema_version:\s*/i);
    }
  });

  it('should structure content with clear section headers', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');

    // Act
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });

    // Assert
    const content = readFileSync(sessionFilePath, 'utf-8');
    expect(content).toMatch(/##\s+/); // Markdown level 2 headers
    expect(content).toMatch(/Stories Worked On|Status Changes|Decisions Made|Risks Identified|Pending Actions/);
  });

  it('should be scannable by session-start with clear structure', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');

    // Act
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });

    // Assert
    const content = readFileSync(sessionFilePath, 'utf-8');

    // Verify structure is present for easy parsing
    expect(content).toMatch(/^---\n[\s\S]*?\n---\n/); // Has frontmatter
    expect(content).toMatch(/##\s+\w+/); // Has section headers

    // Verify no binary or malformed content
    expect(() => JSON.parse(content)).toThrow(); // Content is markdown, not JSON
    expect(content.length).toBeGreaterThan(100); // Has meaningful content
  });
});
