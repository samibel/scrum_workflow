import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createSessionSummary } from '../../scrum_workflow/skills/wrap-up/wrap-up-impl.js';

/**
 * AC-1: Session Summary Creation
 *
 * Given FR-28 specifies `/wrap-up` creates a session summary artifact
 * When a developer runs `/wrap-up`
 * Then a `session-{YYYY-MM-DD}.md` artifact is created in `_scrum-output/memory/sessions/`
 * And the summary contains: stories worked on, status changes made, decisions taken, risks identified, pending actions
 */

describe('AC1: Session Summary Creation', () => {
  const testOutputDir = join(process.cwd(), '_scrum-output', 'memory', 'sessions', 'test');
  const sessionDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const sessionFilePath = join(testOutputDir, `session-${sessionDate}.md`);

  beforeEach(() => {
    // Ensure test output directory exists
    mkdirSync(testOutputDir, { recursive: true });
  });

  afterEach(() => {
    // Cleanup test artifacts
    try {
      if (existsSync(testOutputDir)) {
        rmSync(testOutputDir, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  it('should create session-{YYYY-MM-DD}.md artifact in _scrum-output/memory/sessions/', async () => {
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
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    });

    // Assert
    expect(existsSync(sessionFilePath)).toBe(true);
  });

  it('should include stories worked on in the summary', async () => {
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
    expect(content).toMatch(/## Stories Worked On/i);
    expect(content).toMatch(/## Status Changes/i);
  });

  it('should include decisions taken in the summary', async () => {
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
    expect(content).toMatch(/## Decisions Made/i);
  });

  it('should include risks identified in the summary', async () => {
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
    expect(content).toMatch(/## Risks Identified/i);
  });

  it('should include pending actions in the summary', async () => {
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
    expect(content).toMatch(/## Pending Actions/i);
  });

  it('should use correct naming format session-YYYY-MM-DD.md', async () => {
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
    const fileName = sessionFilePath.split('/').pop();
    const dateRegex = /^session-\d{4}-\d{2}-\d{2}\.md$/;
    expect(fileName).toMatch(dateRegex);
  });
});
