/**
 * Status History Tracking Utilities
 *
 * Implements FR-7: Append-only status_history array with timestamp, trigger command, and actor identity
 * Implements FR-10: Detection of manual status field edits
 *
 * @module status-history
 */

/**
 * Generates ISO 8601 UTC timestamp with millisecond precision
 * @returns {string} Current timestamp in ISO 8601 UTC format (e.g., "2026-04-08T12:30:45.123Z")
 */
function generateTimestamp() {
  // Generate ISO 8601 UTC timestamp with millisecond precision for proper event ordering
  const date = new Date();
  return date.toISOString();
}

/**
 * Validates actor identity format according to architecture patterns
 * @param {string} actor - The actor string to validate
 * @returns {boolean} True if valid format (human, {name}-agent, {name}-skill, or system)
 */
function validateActorFormat(actor) {
  if (!actor || typeof actor !== 'string') {
    return false;
  }

  // Valid actor patterns from architecture.md
  // Expects semantic names like: architect-agent, developer-agent, readiness-check-skill
  const patterns = [
    /^human$/,                    // User actions
    /^system$/,                   // CLI/migration actions
    /^[a-z][a-z0-9-]*-agent$/,    // Agent actions (must start with letter, e.g., architect-agent)
    /^[a-z][a-z0-9-]*-skill$/     // Skill actions (must start with letter, e.g., readiness-check-skill)
  ];

  return patterns.some(pattern => pattern.test(actor));
}

/**
 * Ensures status_history array exists on a story object
 * Handles legacy stories from v1.2.0 that may lack status_history field
 * @param {Object} story - The story object with frontmatter
 * @returns {Object} Story with initialized status_history if needed
 */
function ensureStatusHistoryExists(story) {
  if (!story || !story.frontmatter) {
    throw new Error('Invalid story object: missing frontmatter');
  }

  // Initialize status_history if it doesn't exist (legacy support)
  if (!story.frontmatter.status_history) {
    story.frontmatter.status_history = [];
  }

  return story;
}

/**
 * Appends a status history entry to a story object
 * Implements append-only behavior - existing entries are never modified or deleted
 * NOTE: File operations must be atomic to prevent race conditions during concurrent modifications
 * @param {Object} story - The story object with frontmatter
 * @param {string} from - Previous status (null for initial transition)
 * @param {string} to - New status
 * @param {string} trigger - The command that caused the transition (e.g., "/scrum-create-ticket")
 * @param {string} actor - Who/what initiated the transition (human, {name}-agent, {name}-skill, or system)
 * @returns {Object} Updated story object with new status_history entry
 * @throws {Error} If actor format is invalid
 */
function appendStatusHistory(story, from, to, trigger, actor) {
  if (!story || !story.frontmatter) {
    throw new Error('Invalid story object: missing frontmatter');
  }

  // Validate actor format
  if (!validateActorFormat(actor)) {
    throw new Error(`Invalid actor format: "${actor}". Must be one of: human, system, {name}-agent, {name}-skill`);
  }

  // Ensure status_history array exists
  const storyWithHistory = ensureStatusHistoryExists(story);

  // Create new status history entry
  const newEntry = {
    from: from,
    to: to,
    timestamp: generateTimestamp(),
    trigger: trigger,
    actor: actor
  };

  // Append to status_history (append-only behavior)
  // WARNING: Not thread-safe - use atomic file operations in calling code
  storyWithHistory.frontmatter.status_history.push(newEntry);

  return storyWithHistory;
}

/**
 * Detects manual edits to status field
 * Compares the current status field against the last entry in status_history
 * @param {Object} story - The story object with frontmatter
 * @returns {Object} Detection result with hasManualEdit, expectedStatus, actualStatus, and discrepancyMessage
 */
function detectManualEdit(story) {
  if (!story || !story.frontmatter) {
    throw new Error('Invalid story object: missing frontmatter');
  }

  const result = {
    hasManualEdit: false,
    expectedStatus: null,
    actualStatus: story.frontmatter.status || null,
    discrepancyMessage: null
  };

  // If no status_history exists, we can't detect manual edits
  if (!story.frontmatter.status_history || story.frontmatter.status_history.length === 0) {
    return result;
  }

  // Get the last entry from status_history
  const lastEntry = story.frontmatter.status_history[story.frontmatter.status_history.length - 1];
  result.expectedStatus = lastEntry.to;

  // Check if current status matches the last history entry
  if (result.actualStatus !== result.expectedStatus) {
    result.hasManualEdit = true;
    result.discrepancyMessage = `Manual edit detected: Status field is "${result.actualStatus}" but last status_history entry indicates "${result.expectedStatus}". This discrepancy should be visible to all participants via trigger: manual-edit convention.`;
  }

  return result;
}

module.exports = {
  generateTimestamp,
  validateActorFormat,
  ensureStatusHistoryExists,
  appendStatusHistory,
  detectManualEdit
};
