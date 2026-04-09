/**
 * Story 8.3: Implement Central Audit Trail
 *
 * Utility functions for recording and querying audit trail entries.
 * Audit trail records all transitions, agent actions, and artifact creation events
 * for complete traceability from draft to done.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';

// Valid event types
const EVENT_TYPES = ['transition', 'action', 'artifact'];

// Valid actor values
const VALID_ACTORS = [
  'human',
  'architect-agent',
  'dev-agent',
  'system',
  'refine-ticket',
  'refine-story',
  'verify-skill',
  'review-story',
  'approve'
];

/**
 * Validates ticket ID format
 * @param {string} ticketId - Ticket ID to validate
 * @returns {boolean} True if valid
 */
export function isValidTicketId(ticketId) {
  return /^SW-\d{3}$/.test(ticketId);
}

/**
 * Generates ISO 8601 UTC timestamp
 * @returns {string} ISO 8601 UTC timestamp
 */
export function generateTimestamp() {
  return new Date().toISOString();
}

/**
 * Validates an audit entry
 * @param {Object} entry - Entry to validate
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
export function validateEntry(entry) {
  if (!entry.timestamp) {
    return { valid: false, error: 'Missing timestamp' };
  }

  // Validate ISO 8601 format
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  if (!isoRegex.test(entry.timestamp)) {
    return { valid: false, error: 'Invalid timestamp format. Expected ISO 8601 UTC.' };
  }

  if (!EVENT_TYPES.includes(entry.event_type)) {
    return { valid: false, error: `Invalid event_type. Expected one of: ${EVENT_TYPES.join(', ')}` };
  }

  if (!VALID_ACTORS.includes(entry.actor)) {
    // Allow any actor for flexibility, but log warning
    console.warn(`Unknown actor: ${entry.actor}. Consider adding to VALID_ACTORS.`);
  }

  if (!entry.details || typeof entry.details !== 'string') {
    return { valid: false, error: 'Missing or invalid details field' };
  }

  return { valid: true };
}

/**
 * Gets the audit trail file path for a ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} projectRoot - Project root directory
 * @returns {string} Full path to audit trail file
 */
export function getAuditFilePath(ticketId, projectRoot = process.cwd()) {
  return join(projectRoot, '_scrum-output', 'audit', `${ticketId}-audit.md`);
}

/**
 * Ensures the audit directory exists
 * @param {string} projectRoot - Project root directory
 */
export function ensureAuditDirectory(projectRoot = process.cwd()) {
  const auditDir = join(projectRoot, '_scrum-output', 'audit');
  if (!existsSync(auditDir)) {
    mkdirSync(auditDir, { recursive: true });
  }
  return auditDir;
}

/**
 * Creates a new audit trail file with initial structure
 * @param {string} ticketId - Ticket ID
 * @param {string} projectRoot - Project root directory
 * @returns {string} Path to created audit file
 */
export function createAuditTrailFile(ticketId, projectRoot = process.cwd()) {
  const timestamp = generateTimestamp();
  const auditDir = ensureAuditDirectory(projectRoot);
  const auditFile = getAuditFilePath(ticketId, projectRoot);

  const content = `---
schema_version: 1
ticket: ${ticketId}
generated: ${timestamp}
last_updated: ${timestamp}
entry_count: 0
---

# Audit Trail: ${ticketId}

**Total Events:** 0

No events recorded yet.

`;

  // Atomic write: write to temp file then rename
  const tempFile = auditFile + '.tmp.' + Date.now();
  writeFileSync(tempFile, content, 'utf8');
  renameSync(tempFile, auditFile);

  return auditFile;
}

/**
 * Formats an audit entry as Markdown
 * @param {Object} entry - Entry to format
 * @param {number} entryNum - Entry number
 * @returns {string} Formatted entry as Markdown
 */
export function formatEntryAsMarkdown(entry, entryNum) {
  let markdown = `### Entry ${entryNum}: ${entry.timestamp}\n\n`;
  markdown += `| Field | Value |\n`;
  markdown += `|-------|-------|\n`;
  markdown += `| **Event Type** | ${entry.event_type} |\n`;
  markdown += `| **Actor** | ${entry.actor} |\n`;
  markdown += `| **Details** | ${entry.details} |\n`;

  if (entry.event_type === 'transition') {
    markdown += `| **From** | ${entry.from_status || 'N/A'} |\n`;
    markdown += `| **To** | ${entry.to_status || 'N/A'} |\n`;
  }

  if (entry.event_type === 'artifact' && entry.source_artifact) {
    markdown += `| **Source Artifact** | ${entry.source_artifact} |\n`;
  }

  markdown += `\n---\n\n`;

  return markdown;
}

/**
 * Reads existing audit trail file
 * @param {string} ticketId - Ticket ID
 * @param {string} projectRoot - Project root directory
 * @returns {string|null} File content or null if doesn't exist
 */
export function readAuditTrail(ticketId, projectRoot = process.cwd()) {
  const auditFile = getAuditFilePath(ticketId, projectRoot);
  if (!existsSync(auditFile)) {
    return null;
  }
  return readFileSync(auditFile, 'utf8');
}

/**
 * Appends a new entry to the audit trail file (append-only)
 * @param {Object} params - Entry parameters
 * @param {string} params.ticketId - Ticket ID
 * @param {string} params.eventType - Event type (transition/action/artifact)
 * @param {string} params.actor - Actor (human/architect-agent/system/etc.)
 * @param {string} params.details - Description of what happened
 * @param {string} [params.fromStatus] - From status (for transitions)
 * @param {string} [params.toStatus] - To status (for transitions)
 * @param {string} [params.sourceArtifact] - Source artifact name (for artifacts)
 * @param {string} [params.projectRoot] - Project root directory
 * @returns {{ success: boolean, auditFile?: string, error?: string }}
 */
export function appendEntry({
  ticketId,
  eventType,
  actor,
  details,
  fromStatus = null,
  toStatus = null,
  sourceArtifact = null,
  projectRoot = process.cwd()
}) {
  // Validate ticket ID format to prevent path traversal
  if (!isValidTicketId(ticketId)) {
    return {
      success: false,
      error: `Invalid ticket ID format '${ticketId}'. Expected SW-XXX.`
    };
  }

  const entry = {
    timestamp: generateTimestamp(),
    event_type: eventType,
    actor: actor,
    details: details
  };

  // Add optional fields
  if (eventType === 'transition') {
    entry.from_status = fromStatus;
    entry.to_status = toStatus;
  }

  if (eventType === 'artifact' && sourceArtifact) {
    entry.source_artifact = sourceArtifact;
  }

  // Validate entry
  const validation = validateEntry(entry);
  if (!validation.valid) {
    return {
      success: false,
      error: `Invalid audit entry: ${validation.error}`
    };
  }

  // Ensure audit directory exists
  ensureAuditDirectory(projectRoot);

  const auditFile = getAuditFilePath(ticketId, projectRoot);
  const entryNum = getCurrentEntryCount(auditFile) + 1;
  const entryMarkdown = formatEntryAsMarkdown(entry, entryNum);

  // Read existing content or create new
  let existingContent = '';
  if (existsSync(auditFile)) {
    existingContent = readFileSync(auditFile, 'utf8');
  } else {
    // Create new audit trail file
    const timestamp = generateTimestamp();
    existingContent = `---
schema_version: 1
ticket: ${ticketId}
generated: ${timestamp}
last_updated: ${timestamp}
entry_count: 0
---

# Audit Trail: ${ticketId}

**Total Events:** 0

`;
  }

  // Update frontmatter
  const newEntryCount = entryNum;
  const newLastUpdated = entry.timestamp;

  // Atomic write: write to temp file then rename
  const tempFile = auditFile + '.tmp.' + Date.now();

  try {
    // Build new content by inserting entry before the closing note
    let newContent = existingContent;

    // Update entry count in frontmatter
    newContent = newContent.replace(
      /^entry_count: \d+$/m,
      `entry_count: ${newEntryCount}`
    );

    // Update last_updated in frontmatter
    newContent = newContent.replace(
      /^last_updated: .+$/m,
      `last_updated: ${newLastUpdated}`
    );

    // Update "Total Events" in body
    newContent = newContent.replace(
      /^\*\*Total Events:\*\* \d+$/m,
      `**Total Events:** ${newEntryCount}`
    );

    // Remove "No events recorded yet." if present
    newContent = newContent.replace(
      /\n\nNo events recorded yet\.\n\n$/,
      '\n'
    );

    // Remove trailing "*---\n\n*" if present and append entry
    newContent = newContent.replace(/\n\n\*---\n\n\*$/, '\n\n');
    newContent = newContent.replace(/\n\*---\n\n\*$/, '\n\n');

    // Remove trailing "*Audit trail is append-only*" footer if present
    newContent = newContent.replace(
      /\n\n\*Audit trail is append-only.*$/s,
      ''
    );

    // Remove "*Generated by*" footer if present
    newContent = newContent.replace(
      /\n\n\*Generated by.*$/s,
      ''
    );

    // Append the new entry
    newContent += entryMarkdown;

    // Re-add footer
    newContent += `*Audit trail is append-only. Entries are never modified or deleted.*\n`;
    newContent += `*Generated by /scrum-audit-trail command.*\n`;

    writeFileSync(tempFile, newContent, 'utf8');
    renameSync(tempFile, auditFile);

    return {
      success: true,
      auditFile,
      entry
    };
  } catch (err) {
    // Clean up temp file if it exists
    try {
      if (existsSync(tempFile)) {
        writeFileSync(tempFile, '', 'utf8'); // Truncate
        renameSync(tempFile, auditFile + '.failed');
      }
    } catch (cleanupErr) {
      // Ignore cleanup errors
    }

    return {
      success: false,
      error: `Failed to write audit entry: ${err.message}`
    };
  }
}

/**
 * Gets the current entry count from an audit file
 * @param {string} auditFile - Path to audit file
 * @returns {number} Current entry count
 */
function getCurrentEntryCount(auditFile) {
  if (!existsSync(auditFile)) {
    return 0;
  }

  const content = readFileSync(auditFile, 'utf8');
  const match = content.match(/entry_count:\s*(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Parses an audit trail file and returns chronological entries
 * Entries are returned in chronological order (by timestamp, oldest first)
 * @param {string} ticketId - Ticket ID
 * @param {string} projectRoot - Project root directory
 * @returns {{ entries: Array, summary: Object, error?: string }}
 */
export function getAuditTrail(ticketId, projectRoot = process.cwd()) {
  if (!isValidTicketId(ticketId)) {
    return {
      entries: [],
      summary: {},
      error: `Invalid ticket ID format '${ticketId}'. Expected SW-XXX.`
    };
  }

  const auditFile = getAuditFilePath(ticketId, projectRoot);

  if (!existsSync(auditFile)) {
    return {
      entries: [],
      summary: {
        ticket: ticketId,
        storyStatus: null,
        totalEvents: 0,
        byEventType: { transition: 0, action: 0, artifact: 0 },
        byActor: {},
        firstEvent: null,
        lastEvent: null
      }
    };
  }

  const content = readFileSync(auditFile, 'utf8');

  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  let frontmatter = {};
  if (frontmatterMatch) {
    try {
      // Simple YAML parsing for our known fields
      const lines = frontmatterMatch[1].split('\n');
      for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          if (!isNaN(parseInt(value, 10))) {
            frontmatter[key.trim()] = parseInt(value, 10);
          } else {
            frontmatter[key.trim()] = value;
          }
        }
      }
    } catch (err) {
      // Continue without frontmatter parsing
    }
  }

  // Parse entries from Markdown
  const entries = [];
  const entryBlocks = content.split(/### Entry \d+:/);

  for (const block of entryBlocks) {
    if (!block.trim() || block.trim() === 'Audit Trail') continue;

    const lines = block.trim().split('\n');
    const entry = {};

    // First line is timestamp
    if (lines[0]) {
      entry.timestamp = lines[0].trim();
    }

    // Parse table rows
    for (const line of lines) {
      const fieldMatch = line.match(/\*\*(\w+)\*\*\s*\|\s*(.+)/);
      if (fieldMatch) {
        const [, field, value] = fieldMatch;
        const fieldName = field.toLowerCase().replace(/\s+/g, '_');

        if (fieldName === 'event_type') {
          entry.event_type = value.trim();
        } else if (fieldName === 'actor') {
          entry.actor = value.trim();
        } else if (fieldName === 'details') {
          entry.details = value.trim();
        } else if (fieldName === 'from') {
          entry.from_status = value.trim();
        } else if (fieldName === 'to') {
          entry.to_status = value.trim();
        } else if (fieldName === 'source_artifact') {
          entry.source_artifact = value.trim();
        }
      }
    }

    if (entry.timestamp && entry.event_type) {
      entries.push(entry);
    }
  }

  // Generate summary
  const summary = {
    ticket: ticketId,
    storyStatus: frontmatter.status || null,
    totalEvents: entries.length,
    byEventType: { transition: 0, action: 0, artifact: 0 },
    byActor: {},
    firstEvent: entries.length > 0 ? entries[0].timestamp : null,
    lastEvent: entries.length > 0 ? entries[entries.length - 1].timestamp : null
  };

  for (const entry of entries) {
    if (summary.byEventType[entry.event_type] !== undefined) {
      summary.byEventType[entry.event_type]++;
    }
    summary.byActor[entry.actor] = (summary.byActor[entry.actor] || 0) + 1;
  }

  return { entries, summary };
}

/**
 * Generates audit trail summary for sprint observability
 * @param {string} ticketId - Ticket ID
 * @param {Object} options - Options
 * @param {string} [options.eventType] - Filter by event type
 * @param {string} [options.actor] - Filter by actor
 * @param {string} [options.startDate] - Filter by start date (ISO 8601 UTC, inclusive)
 * @param {string} [options.endDate] - Filter by end date (ISO 8601 UTC, inclusive)
 * @param {string} [projectRoot] - Project root directory
 * @returns {Object} Summary object
 */
export function getAuditSummary(ticketId, options = {}, projectRoot = process.cwd()) {
  const { entries, summary } = getAuditTrail(ticketId, projectRoot);

  // Apply filters
  let filteredEntries = entries;

  if (options.eventType) {
    filteredEntries = filteredEntries.filter(e => e.event_type === options.eventType);
  }

  if (options.actor) {
    filteredEntries = filteredEntries.filter(e => e.actor === options.actor);
  }

  // Date range filter
  if (options.startDate || options.endDate) {
    filteredEntries = filteredEntries.filter(e => {
      const entryTime = e.timestamp;
      if (options.startDate && entryTime < options.startDate) return false;
      if (options.endDate && entryTime > options.endDate) return false;
      return true;
    });
  }

  // Recalculate summary with filters
  const filteredSummary = {
    ...summary,
    totalEvents: filteredEntries.length,
    byEventType: { transition: 0, action: 0, artifact: 0 },
    byActor: {},
    firstEvent: filteredEntries.length > 0 ? filteredEntries[0].timestamp : null,
    lastEvent: filteredEntries.length > 0 ? filteredEntries[filteredEntries.length - 1].timestamp : null
  };

  for (const entry of filteredEntries) {
    if (filteredSummary.byEventType[entry.event_type] !== undefined) {
      filteredSummary.byEventType[entry.event_type]++;
    }
    filteredSummary.byActor[entry.actor] = (filteredSummary.byActor[entry.actor] || 0) + 1;
  }

  return {
    entries: filteredEntries,
    summary: filteredSummary,
    filters: options
  };
}

/**
 * Integrates status_history entries with audit trail
 * Copies transition events from status_history to audit trail
 * @param {Object} story - Story object with frontmatter
 * @param {Object} statusHistoryEntry - Status history entry
 * @param {string} projectRoot - Project root directory
 * @returns {{ success: boolean, error?: string }}
 */
export function syncStatusHistoryToAudit(story, statusHistoryEntry, projectRoot = process.cwd()) {
  const ticketId = story.frontmatter?.ticket;

  if (!ticketId) {
    return { success: false, error: 'Story missing ticket ID' };
  }

  if (!isValidTicketId(ticketId)) {
    return { success: false, error: `Invalid ticket ID: ${ticketId}` };
  }

  // statusHistoryEntry format: { from, to, timestamp, trigger, actor }
  return appendEntry({
    ticketId,
    eventType: 'transition',
    actor: statusHistoryEntry.actor || 'system',
    details: `Status changed from ${statusHistoryEntry.from} to ${statusHistoryEntry.to}`,
    fromStatus: statusHistoryEntry.from,
    toStatus: statusHistoryEntry.to,
    projectRoot
  });
}

/**
 * Records an artifact creation event
 * @param {Object} params - Parameters
 * @param {string} params.ticketId - Ticket ID
 * @param {string} params.artifactName - Name of the artifact created
 * @param {string} params.actor - Actor that created the artifact
 * @param {string} [params.projectRoot] - Project root directory
 * @returns {{ success: boolean, error?: string }}
 */
export function recordArtifactCreation({
  ticketId,
  artifactName,
  actor,
  projectRoot = process.cwd()
}) {
  return appendEntry({
    ticketId,
    eventType: 'artifact',
    actor,
    details: `${artifactName} created`,
    sourceArtifact: artifactName,
    projectRoot
  });
}

// Re-export constants for external use
export { EVENT_TYPES, VALID_ACTORS };

// Backward compatibility alias
export const appendAuditEntry = appendEntry;
