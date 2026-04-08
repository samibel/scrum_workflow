import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Fixture for managing temporary sprint directories for testing
 */

export function createTemporarySprintDir(ticketId: string): string {
  const sprintDir = join(process.cwd(), '_test-output', 'sprints', ticketId);
  
  if (!existsSync(sprintDir)) {
    mkdirSync(sprintDir, { recursive: true });
  }
  
  return sprintDir;
}

export function cleanupTemporarySprintDir(ticketId: string): void {
  const sprintDir = join(process.cwd(), '_test-output', 'sprints', ticketId);
  
  if (existsSync(sprintDir)) {
    rmSync(sprintDir, { recursive: true, force: true });
  }
}
