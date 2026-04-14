/**
 * Wrap-Up Skill Implementation
 * Story 7.4: Implement Session Wrap-Up
 *
 * Main implementation module for the `/wrap-up` command.
 * Creates session summary artifacts capturing what was accomplished
 * during a developer session.
 *
 * Exports:
 * - createSessionSummary(options): Main function for tests and external callers
 */

import { createSessionSummary as createSessionSummaryCore } from '../../utils/session-summary.js';

/**
 * Creates a session summary artifact.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.sprintsDir - Path to sprints directory
 * @param {string} options.decisionsDir - Path to decisions directory
 * @param {string} options.risksDir - Path to risks directory
 * @param {string} options.outputDir - Path to output sessions directory
 * @param {Date} options.sessionStartTime - Session start timestamp
 * @returns {Promise<string>} Path to created/updated session file
 */
export async function createSessionSummary(options) {
  return createSessionSummaryCore(options);
}
