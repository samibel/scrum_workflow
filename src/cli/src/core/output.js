/**
 * Centralized CLI output formatting module.
 *
 * Provides unified semantic output functions with consistent color coding
 * (via picocolors) and emoji prefixes for all CLI commands.
 *
 * Architecture compliance:
 * - UX-DR6: Semantic colors (Success=Green, Warning=Yellow, Error=Red, Info=Cyan)
 * - UX-DR7: Emoji prefixes (success, warning, error, info)
 * - UX-DR9: Single line per message
 * - UX-DR13: Consistent color coding across all outputs
 * - UX-DR15: Consistent emoji prefixes (status indicator first, then message)
 * - UX-DR16: 4.5:1 contrast ratio — magenta used for warning (yellow fails WCAG on dark terminals)
 * - UX-DR18: Screen reader compatible — emoji + text provides redundant indication
 * - UX-DR19: Monospace font — terminal default, no custom fonts
 * - UX-DR20: Single column layout — no hardcoded widths, minimal padding, logical grouping
 *
 * Accessibility:
 * - picocolors natively respects NO_COLOR and TERM=dumb via pc.isColorSupported
 * - Emoji prefixes are ALWAYS shown (plain text, not terminal-dependent)
 * - Single column layout ensures screen reader compatibility
 */

import pc from 'picocolors'

/**
 * Format and print a success message (green + checkmark prefix).
 * @param {string} msg - Message text
 */
export function success(msg) {
  console.log(`✓ ${pc.green(msg)}`)
}

/**
 * Format and print a warning message (magenta + warning prefix).
 * Uses magenta for 4.5:1+ contrast ratio on dark terminals (yellow fails WCAG).
 * @param {string} msg - Message text
 */
export function warning(msg) {
  console.log(`⚠ ${pc.magenta(msg)}`)
}

/**
 * Format and print an error message (red + cross prefix).
 * @param {string} msg - Message text
 */
export function error(msg) {
  console.log(`❌ ${pc.red(msg)}`)
}

/**
 * Format and print an info message (cyan + info prefix).
 * @param {string} msg - Message text
 */
export function info(msg) {
  console.log(`ℹ ${pc.cyan(msg)}`)
}

/**
 * Format and print a step/sub-step message (dim bullet for sub-steps).
 * @param {string} msg - Message text
 */
export function step(msg) {
  console.log(`  ${pc.dim('-')} ${pc.dim(msg)}`)
}

/**
 * Format and print a header message (bold, for section headers).
 * @param {string} msg - Message text
 */
export function header(msg) {
  console.log(pc.bold(msg))
}

/**
 * Format a platform name as a colored inline badge.
 * @param {string} name - Platform code (e.g. 'claude-code')
 * @returns {string} Colored badge string
 */
export function badge(name) {
  return pc.bold(pc.cyan(name))
}

/**
 * Format a skill command name with bold cyan highlighting.
 * @param {string} name - Skill name (e.g. 'scrum-create-ticket')
 * @returns {string} Highlighted string
 */
export function highlight(name) {
  return pc.bold(pc.cyan(`/${name}`))
}

/**
 * Format a file path in blue.
 * @param {string} p - Path string
 * @returns {string} Colored path string
 */
export function filepath(p) {
  return pc.blue(p)
}

/**
 * Format an ISO date string as a human-readable date with a relative "N days ago" suffix.
 * Examples: "2026-03-29  (12 days ago)", "2026-04-10  (today)"
 *
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Formatted date string
 */
export function formatDate(isoString) {
  const date = new Date(isoString)
  const dateStr = date.toISOString().slice(0, 10)
  const diffMs = Date.now() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  let relative
  if (diffDays === 0) relative = 'today'
  else if (diffDays === 1) relative = '1 day ago'
  else relative = `${diffDays} days ago`

  return `${dateStr}  ${pc.dim(`(${relative})`)}`
}

/**
 * Named export object for convenient destructuring.
 * Usage: import { output } from './output.js'
 */
export const output = { success, warning, error, info, step, header, badge, highlight, filepath, formatDate }
