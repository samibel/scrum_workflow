/**
 * Centralized interactive prompt module.
 *
 * Provides wrapper functions for @clack/prompts interactive functions with
 * consistent cancel handling and safe defaults.
 *
 * Architecture compliance:
 * - UX-DR10: Confirmation dialogs for destructive actions with safe default (No)
 * - UX-DR11: Input prompts with defaults in parentheses
 * - UX-DR12: Selection prompts for multiple options with numbered display
 * - UX-DR6: Semantic colors -- @clack/prompts applies its own color styling
 * - UX-DR13: Consistent color coding -- all prompts go through @clack/prompts
 * - UX-DR17: Keyboard navigation -- @clack/prompts natively supports this
 * - UX-DR18: Screen reader compatible -- @clack/prompts renders text-based UI
 *
 * Design:
 * - Each function wraps a @clack/prompts interactive function
 * - Cancel handling is centralized: every function checks isCancel() and calls
 *   cancel() then exits the process with code 0
 * - confirmAction() defaults to false (safe default per UX-DR10)
 * - intro() and outro() are NOT wrapped -- they are boundary UX elements
 */

import { confirm, text, select, multiselect, isCancel, cancel } from '@clack/prompts'

/**
 * Display a confirmation prompt with safe default (No).
 *
 * Wraps @clack/prompts confirm(). Defaults to false for destructive action
 * safety per UX-DR10.
 *
 * @param {string} message - Prompt message (e.g., "This will overwrite existing files. Continue?")
 * @param {object} [options] - Options
 * @param {boolean} [options.defaultValue=false] - Default value (false = safe default)
 * @returns {Promise<boolean>} User's confirmation choice
 */
export async function confirmAction(message, { defaultValue = false } = {}) {
  const result = await confirm({ message, initialValue: defaultValue })
  if (isCancel(result)) {
    cancel('Operation cancelled')
    process.exit(0)
  }
  return result
}

/**
 * Display a text input prompt with optional default value.
 *
 * Wraps @clack/prompts text(). Shows default in parentheses per UX-DR11.
 *
 * @param {string} message - Prompt message (e.g., "Project name")
 * @param {object} [options] - Options
 * @param {string} [options.defaultValue] - Default value shown in parentheses
 * @param {string} [options.placeholder] - Placeholder text
 * @param {Function} [options.validate] - Validation function
 * @returns {Promise<string>} User's text input
 */
export async function inputText(message, { defaultValue, placeholder, validate } = {}) {
  const result = await text({ message, defaultValue, placeholder, validate })
  if (isCancel(result)) {
    cancel('Operation cancelled')
    process.exit(0)
  }
  return result
}

/**
 * Display a single-selection prompt with numbered options.
 *
 * Wraps @clack/prompts select(). Renders options as navigable list with
 * arrow keys, satisfying UX-DR12's numbered selection pattern.
 *
 * @param {string} message - Prompt message (e.g., "Select platform")
 * @param {Array<{value: string, label: string, hint?: string}>} options - Available options
 * @returns {Promise<string>} Selected option value
 */
export async function selectOption(message, options) {
  const result = await select({ message, options })
  if (isCancel(result)) {
    cancel('Operation cancelled')
    process.exit(0)
  }
  return result
}

/**
 * Display a multi-selection prompt with optional initial values.
 *
 * Wraps @clack/prompts multiselect(). Always requires at least one selection.
 *
 * @param {string} message - Prompt message (e.g., "Select target platforms")
 * @param {Array<{value: string, label: string, hint?: string}>} options - Available options
 * @param {object} [opts] - Options
 * @param {string[]} [opts.initialValues] - Pre-selected values
 * @returns {Promise<string[]>} Array of selected option values
 */
export async function multiSelectOptions(message, options, { initialValues } = {}) {
  const result = await multiselect({ message, options, initialValues, required: true })
  if (isCancel(result)) {
    cancel('Operation cancelled')
    process.exit(0)
  }
  return result
}
