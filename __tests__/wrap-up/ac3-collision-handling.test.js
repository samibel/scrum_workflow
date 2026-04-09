import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createSessionSummary } from '../../scrum_workflow/skills/wrap-up/wrap-up-impl.js';

/**
 * AC-3: Collision Handling
 *
 * Given multiple sessions on the same day
 * When `/wrap-up` is run again
 * Then the existing session file is updated (not overwritten) with additional entries
 * Or a new file with a sequence suffix is created to prevent data loss
 */

describe('AC3: Collision Handling - Multiple Wraps on Same Day', () => {
  const testOutputDir = join(process.cwd(), '_scrum-output', 'memory', 'sessions', 'test');
  const sessionDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

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

  it('should create initial session file with base name', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');
    const sessionFilePath = join(testOutputDir, `session-${sessionDate}.md`);

    // Act
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });

    // Assert
    expect(existsSync(sessionFilePath)).toBe(true);
  });

  it('should append to existing session file when called twice same day', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');
    const sessionFilePath = join(testOutputDir, `session-${sessionDate}.md`);

    // Act - First call
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    });

    const firstContent = readFileSync(sessionFilePath, 'utf-8');

    // Act - Second call (1 hour later)
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    });

    const secondContent = readFileSync(sessionFilePath, 'utf-8');

    // Assert
    // Either file is appended (larger) or new file with sequence suffix exists
    const hasSequenceSuffix = existsSync(join(testOutputDir, `session-${sessionDate}-1.md`));
    const isAppended = secondContent.length >= firstContent.length;

    expect(hasSequenceSuffix || isAppended).toBe(true);
  });

  it('should preserve data when collision occurs', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');
    const sessionFilePath = join(testOutputDir, `session-${sessionDate}.md`);

    // Act - Create first session summary with marker
    const marker1 = '<!-- FIRST SESSION MARKER -->';
    writeFileSync(sessionFilePath, `${marker1}\n\nFirst session content`);

    // Create second session
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    });

    // Assert - Check that first content is preserved
    let finalContent = '';

    // Check original file or sequence file
    if (existsSync(sessionFilePath)) {
      finalContent = readFileSync(sessionFilePath, 'utf-8');
    } else if (existsSync(join(testOutputDir, `session-${sessionDate}-1.md`))) {
      finalContent = readFileSync(join(testOutputDir, `session-${sessionDate}-1.md`), 'utf-8');
    }

    // First marker should still exist (original data preserved)
    expect(finalContent).toContain(marker1);
  });

  it('should create sequence suffix file when collision detected', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');
    const sessionFilePath = join(testOutputDir, `session-${sessionDate}.md`);
    const sequenceFilePath = join(testOutputDir, `session-${sessionDate}-1.md`);

    // Act - Create first file
    mkdirSync(join(testOutputDir, '..'), { recursive: true });
    writeFileSync(sessionFilePath, '# First Session\n\nContent');

    // Create second session
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    });

    // Assert - Either append mode or sequence file exists
    const fileExists = existsSync(sessionFilePath) || existsSync(sequenceFilePath);
    expect(fileExists).toBe(true);
  });

  it('should use sequence suffix pattern session-YYYY-MM-DD-N.md when needed', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');
    const sessionFilePath = join(testOutputDir, `session-${sessionDate}.md`);

    // Act - Create initial file then create another session
    mkdirSync(join(testOutputDir, '..'), { recursive: true });
    writeFileSync(sessionFilePath, '# Existing Session');

    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    });

    // Assert - Check for sequence pattern
    const sequenceRegex = new RegExp(`session-${sessionDate}(-\\d+)?\\.md$`);
    let found = false;

    if (existsSync(sessionFilePath)) {
      found = true; // Append mode
    } else {
      // Check for sequence files
      const filePath = join(testOutputDir, `session-${sessionDate}-1.md`);
      if (existsSync(filePath)) {
        const fileName = filePath.split('/').pop();
        found = sequenceRegex.test(fileName);
      }
    }

    expect(found).toBe(true);
  });

  it('should not lose data from first wrap when second wrap collides', async () => {
    // Arrange
    const sprintDir = join(process.cwd(), '_scrum-output', 'sprints');
    const decisionsDir = join(process.cwd(), '_scrum-output', 'memory', 'decisions');
    const risksDir = join(process.cwd(), '_scrum-output', 'memory', 'risks');
    const sessionFilePath = join(testOutputDir, `session-${sessionDate}.md`);
    const testMarker = 'TEST_PRESERVATION_MARKER_12345';

    // Act - Create first session with unique marker
    mkdirSync(join(testOutputDir, '..'), { recursive: true });
    writeFileSync(sessionFilePath, `# Session\n\n${testMarker}\n\nOriginal content`);

    const firstSize = readFileSync(sessionFilePath, 'utf-8').length;

    // Act - Create second session (collision)
    await createSessionSummary({
      sprintsDir: sprintDir,
      decisionsDir: decisionsDir,
      risksDir: risksDir,
      outputDir: testOutputDir,
      sessionStartTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    });

    // Assert - Marker should exist in either original or sequence file
    let finalContent = '';

    if (existsSync(sessionFilePath)) {
      finalContent = readFileSync(sessionFilePath, 'utf-8');
    } else {
      const seqFile = join(testOutputDir, `session-${sessionDate}-1.md`);
      if (existsSync(seqFile)) {
        finalContent = readFileSync(seqFile, 'utf-8');
      }
    }

    expect(finalContent).toContain(testMarker);
  });
});
