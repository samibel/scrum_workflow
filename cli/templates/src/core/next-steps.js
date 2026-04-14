/**
 * Centralized next-step guidance module.
 *
 * Provides consistent, actionable next-step messages for every CLI command
 * that completes successfully.
 *
 * Architecture compliance:
 * - UX-DR2: One-line success with first command hint after installation
 * - UX-DR14: Actionable next step in all success messages
 * - UX-DR9: Single line per message
 * - UX-DR13: Consistent color coding
 * - UX-DR15: Consistent emoji prefixes
 * - NFR-13: Zero-knowledge onboarding -- developer knows exactly what to do next
 */

const DEFAULT_NEXT_STEP = 'Next: run create-scrum-workflow --help for available commands'

const STEPS = {
  install: 'Installation complete! Try: /scrum-create-ticket "your feature description"',

  update: (context = {}) =>
    context.hasFlaggedStories
      ? 'Update complete! Next: address flagged stories above, then run /scrum-dev-story'
      : 'Update complete! Next: /scrum-create-ticket "your feature description"',

  validate: (context = {}) =>
    context.hasErrors
      ? 'Validation complete with errors. Next: fix the errors above and re-run validate'
      : 'Validation passed! Ready to use: /scrum-create-ticket "your feature description"',

  status: (context = {}) =>
    context.hasIssues
      ? 'Status checked! Next: run create-scrum-workflow validate for details'
      : 'Status OK! Next: /scrum-create-ticket "your feature description"'
}

/**
 * Return an actionable next-step message for a given command.
 *
 * @param {string} command - Command name (install, update, validate, status)
 * @param {object} [context={}] - Optional context for conditional messages
 * @param {boolean} [context.hasFlaggedStories] - Whether update found flagged stories
 * @param {boolean} [context.hasErrors] - Whether validate found errors
 * @param {boolean} [context.hasIssues] - Whether status found issues
 * @returns {string} Actionable next-step message (single line)
 */
export function getNextStep(command, context = {}) {
  const step = STEPS[command]
  if (!step) return DEFAULT_NEXT_STEP
  return typeof step === 'function' ? step(context) : step
}
