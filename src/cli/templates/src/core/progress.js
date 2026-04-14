/**
 * Centralized progress indicator module.
 *
 * Provides a unified progress tracking mechanism that wraps @clack/prompts spinner
 * and integrates with the output.js module for consistent status display.
 *
 * Architecture compliance:
 * - UX-DR8: Spinner for running, checkmark for complete, X mark for failed
 * - UX-DR6: Semantic colors on resolved messages (green success, red failure) — via output.js
 * - UX-DR7: Emoji prefixes on resolved messages — via output.js
 * - UX-DR9: Single line per resolved message — via output.js
 * - UX-DR13: Consistent color coding — all progress goes through output.js
 * - UX-DR15: Consistent emoji prefixes — all progress goes through output.js
 *
 * Design:
 * - @clack/prompts spinner() handles the animation display (spinning character)
 * - s.stop('') clears the spinner animation without printing a message
 * - output.success() / output.error() handles the final status line with formatting
 */

import { spinner } from '@clack/prompts'
import * as output from './output.js'

const s = spinner()

/**
 * Start a spinner with a descriptive message.
 * @param {string} msg - Descriptive message for the running operation
 */
export function start(msg) {
  s.start(msg)
}

/**
 * Stop the spinner and display a success message with checkmark.
 * @param {string} msg - Success message (e.g., "Framework files copied complete")
 */
export function succeed(msg) {
  s.stop('')
  output.success(msg)
}

/**
 * Stop the spinner and display a failure message with X mark.
 * Works even without a prior start() call (graceful no-spinner case).
 * @param {string} msg - Failure message (e.g., "Framework copy failed")
 */
export function fail(msg) {
  s.stop('')
  output.error(msg)
}
