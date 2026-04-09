/**
 * Story 8.5: Implement Delivery Health Command
 *
 * Utility functions for aggregating delivery health data from:
 * - Audit trails (policy violations from Story 8.2)
 * - Risk notes (open risks from _scrum-output/memory/risks/)
 * - Story statuses (pending approvals = stories in approved status)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

/**
 * Validates ticket ID format
 * @param {string} ticketId - Ticket ID to validate
 * @returns {boolean} True if valid
 */
export function isValidTicketId(ticketId) {
  return /^SW-\d{3}$/.test(ticketId);
}

/**
 * Reads and parses a JSON audit entry file
 * @param {string} filePath - Path to audit JSON file
 * @returns {Object|null} Parsed entry or null if error
 */
export function readAuditEntry(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Scans audit directory for policy violation entries
 * @param {string} projectRoot - Project root directory
 * @returns {Array} Array of policy violation entries (deduplicated by ticket + violationType)
 */
export function scanPolicyViolations(projectRoot) {
  const auditDir = join(projectRoot, '_scrum-output', 'audit');
  const violations = [];
  const seen = new Set(); // For deduplication by ticket + violationType

  if (!existsSync(auditDir)) {
    return violations;
  }

  let entries;
  try {
    entries = readdirSync(auditDir);
  } catch {
    return violations;
  }

  for (const entry of entries) {
    // Look for policy violation files:
    // - SW-XXX-policy-violations.md (from Story 8.2 policy-check command)
    // - SW-XXX-audit.md files containing policy-violation entries
    const isPolicyViolationFile = entry.match(/^SW-\d{3}-policy-violations\.md$/);
    const isAuditFileWithViolation = entry.match(/^SW-\d{3}-audit\.md$/);

    if (isPolicyViolationFile || isAuditFileWithViolation) {
      const filePath = join(auditDir, entry);
      const content = readFileSync(filePath, 'utf8');

      // Check if this is a policy violation entry
      if (content.includes('policy-violation') || isPolicyViolationFile) {
        // Try to parse YAML frontmatter for structured data
        const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
        if (frontmatterMatch) {
          try {
            const frontmatter = yaml.load(frontmatterMatch[1]);
            // Handle array of violations in frontmatter
            const violationList = Array.isArray(frontmatter.violations)
              ? frontmatter.violations
              : [frontmatter];

            for (const v of violationList) {
              const ticket = v.ticket || frontmatter.ticket || entry.match(/^SW-\d{3}/)?.[0];
              const violationType = v.violationType || v.type || 'unknown';
              const deduplicationKey = `${ticket}:${violationType}`;

              if (!seen.has(deduplicationKey)) {
                seen.add(deduplicationKey);
                violations.push({
                  severity: (v.severity || frontmatter.severity || 'unknown').toLowerCase(),
                  ticket: ticket,
                  violationType: violationType,
                  recommendedAction: v.recommendedAction || v.action || 'Fix violation',
                  source: entry
                });
              }
            }
          } catch {
            // Fall back to regex parsing if YAML parsing fails
            parseViolationsFromRegex(content, entry, violations, seen);
          }
        } else {
          // Fall back to regex parsing for non-YAML files
          parseViolationsFromRegex(content, entry, violations, seen);
        }
      }
    }
  }

  return violations;
}

/**
 * Fallback regex-based violation parsing for files without YAML frontmatter
 * @param {string} content - File content
 * @param {string} entry - File name
 * @param {Array} violations - Array to push violations to
 * @param {Set} seen - Set for deduplication
 */
function parseViolationsFromRegex(content, entry, violations, seen) {
  // Extract violation details from markdown tables using regex
  const severityMatch = content.match(/\*\*Severity\*\*\s*\|\s*(\w+)/i);
  const ticketMatch = content.match(/\*\*Ticket\*\*\s*\|\s*(SW-\d{3})/i);
  const typeMatch = content.match(/\*\*Violation Type\*\*\s*\|\s*(\w+[-\w]*)/i);
  const actionMatch = content.match(/\*\*Recommended Action\*\*\s*\|\s*(.+?)(?:\s*\|[\s]*)?$/im);

  if (severityMatch && ticketMatch) {
    const ticket = ticketMatch[1];
    const violationType = typeMatch ? typeMatch[1] : 'unknown';
    const deduplicationKey = `${ticket}:${violationType}`;

    if (!seen.has(deduplicationKey)) {
      seen.add(deduplicationKey);
      violations.push({
        severity: severityMatch[1].toLowerCase(),
        ticket: ticket,
        violationType: violationType,
        recommendedAction: actionMatch ? actionMatch[1].trim() : 'Fix violation',
        source: entry
      });
    }
  }
}

/**
 * Reads and parses a risk note file
 * @param {string} filePath - Path to risk note MD file
 * @returns {Object|null} Parsed risk note or null if error
 */
export function readRiskNote(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    const content = readFileSync(filePath, 'utf8');

    // Extract YAML frontmatter using regex
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }

    // Parse YAML properly using js-yaml
    const frontmatter = yaml.load(frontmatterMatch[1]);

    return {
      severity: frontmatter.severity || 'unknown',
      affectedArea: frontmatter.affected_area || 'Unknown area',
      mitigation: frontmatter.mitigation || 'No mitigation specified',
      status: frontmatter.status || 'unknown',
      ticket: frontmatter.ticket || null
    };
  } catch {
    return null;
  }
}

/**
 * Scans risks directory for open risk notes
 * @param {string} projectRoot - Project root directory
 * @returns {Array} Array of open risk note objects
 */
export function scanOpenRisks(projectRoot) {
  const risksDir = join(projectRoot, '_scrum-output', 'memory', 'risks');
  const risks = [];

  if (!existsSync(risksDir)) {
    return risks;
  }

  let entries;
  try {
    entries = readdirSync(risksDir);
  } catch {
    return risks;
  }

  for (const entry of entries) {
    // Look for risk note files (RN-XXX.md format)
    if (entry.match(/^RN-\d{3}\.md$/)) {
      const filePath = join(risksDir, entry);
      const riskNote = readRiskNote(filePath);

      if (riskNote && riskNote.status === 'open') {
        risks.push({
          id: entry.replace('.md', ''),
          severity: riskNote.severity.toLowerCase(),
          affectedArea: riskNote.affectedArea,
          mitigation: riskNote.mitigation,
          ticket: riskNote.ticket
        });
      }
    }
  }

  return risks;
}

/**
 * Parses story metadata from a story.md YAML frontmatter
 * @param {string} filePath - Path to story.md file
 * @returns {Object|null} Parsed metadata or null if error
 */
export function parseStoryMetadata(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf8');

    // Extract YAML frontmatter using regex
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }

    // Parse YAML properly using js-yaml
    const frontmatter = yaml.load(frontmatterMatch[1]);

    return {
      ticket: frontmatter.ticket || null,
      title: frontmatter.title || null,
      status: frontmatter.status || null,
      created: frontmatter.created || null,
      updated: frontmatter.updated || null,
      epic: frontmatter.epic || null
    };
  } catch {
    return null;
  }
}

/**
 * Scans sprints directory for stories in approved status
 * @param {string} projectRoot - Project root directory
 * @returns {Array} Array of approved story objects
 */
export function scanApprovedStories(projectRoot) {
  const sprintsDir = join(projectRoot, '_scrum-output', 'sprints');
  const approvedStories = [];

  if (!existsSync(sprintsDir)) {
    return approvedStories;
  }

  let entries;
  try {
    entries = readdirSync(sprintsDir);
  } catch {
    return approvedStories;
  }

  for (const entry of entries) {
    // Check if it's a story directory (SW-XXX format)
    if (!/^SW-\d{3}$/.test(entry)) {
      continue;
    }

    const storyDir = join(sprintsDir, entry);
    const storyFile = join(storyDir, 'story.md');

    if (!existsSync(storyFile)) {
      continue;
    }

    const metadata = parseStoryMetadata(storyFile);
    if (!metadata || !metadata.ticket) {
      continue;
    }

    // Filter for approved status only
    if (metadata.status === 'approved') {
      approvedStories.push({
        ticket: metadata.ticket,
        title: metadata.title,
        status: metadata.status,
        created: metadata.created
      });
    }
  }

  return approvedStories;
}

/**
 * Aggregates all health data from governance sources
 * @param {string} projectRoot - Project root directory
 * @returns {Object} Aggregated health data
 */
export function aggregateHealthData(projectRoot) {
  try {
    const violations = scanPolicyViolations(projectRoot);
    const risks = scanOpenRisks(projectRoot);
    const pendingApprovals = scanApprovedStories(projectRoot);

    return {
      policyViolations: violations,
      openRisks: risks,
      pendingApprovals: pendingApprovals,
      summary: {
        violationCount: violations.length,
        riskCount: risks.length,
        pendingApprovalCount: pendingApprovals.length
      }
    };
  } catch (error) {
    // Return empty data on error to allow graceful degradation
    return {
      policyViolations: [],
      openRisks: [],
      pendingApprovals: [],
      summary: {
        violationCount: 0,
        riskCount: 0,
        pendingApprovalCount: 0
      },
      error: error.message
    };
  }
}

/**
 * Checks if delivery is in a healthy state
 * @param {Object} healthData - Aggregated health data
 * @returns {boolean} True if all categories are empty
 */
export function isHealthy(healthData) {
  return (
    healthData.policyViolations.length === 0 &&
    healthData.openRisks.length === 0 &&
    healthData.pendingApprovals.length === 0
  );
}

/**
 * Formats severity for display with color code
 * @param {string} severity - Severity level
 * @returns {string} Formatted severity string
 */
export function formatSeverity(severity) {
  const normalized = severity.toLowerCase();
  switch (normalized) {
    case 'critical':
      return '❌ critical';
    case 'major':
      return '⚠ major';
    case 'minor':
      return 'ℹ minor';
    default:
      return `ℹ ${severity}`;
  }
}

/**
 * Formats health report as table string
 * @param {Object} healthData - Aggregated health data
 * @returns {string} Formatted health report
 */
export function formatHealthReportTable(healthData) {
  const { policyViolations, openRisks, pendingApprovals, summary } = healthData;

  let report = '# Delivery Health Report\n\n';

  // Summary section
  report += '## Summary\n';
  report += '| Category | Count |\n';
  report += '|----------|-------|\n';
  report += `| Policy Violations | ${summary.violationCount} |\n`;
  report += `| Open Risks | ${summary.riskCount} |\n`;
  report += `| Pending Approvals | ${summary.pendingApprovalCount} |\n`;
  report += '\n';

  // Policy violations section
  if (policyViolations.length > 0) {
    report += '## Policy Violations\n';
    report += '| Severity | Story | Recommended Action |\n';
    report += '|----------|-------|---------------------|\n';
    for (const v of policyViolations) {
      const normalizedSeverity = v.severity.toLowerCase();
      const emoji = normalizedSeverity === 'critical' ? '❌' : normalizedSeverity === 'major' ? '⚠' : 'ℹ';
      report += `| ${emoji} ${normalizedSeverity} | ${v.ticket} | ${v.recommendedAction} |\n`;
    }
    report += '\n';
  }

  // Open risks section
  if (openRisks.length > 0) {
    report += '## Open Risks\n';
    report += '| Severity | Affected Area | Mitigation Status |\n';
    report += '|----------|--------------|-------------------|\n';
    for (const r of openRisks) {
      const normalizedSeverity = r.severity.toLowerCase();
      const emoji = normalizedSeverity === 'critical' ? '❌' : normalizedSeverity === 'major' ? '⚠' : 'ℹ';
      report += `| ${emoji} ${normalizedSeverity} | ${r.affectedArea} | ${r.mitigation} |\n`;
    }
    report += '\n';
  }

  // Pending approvals section
  if (pendingApprovals.length > 0) {
    report += '## Pending Approvals\n';
    report += '| Story ID | Title |\n';
    report += '|----------|-------|\n';
    for (const s of pendingApprovals) {
      report += `| ${s.ticket} | ${s.title} |\n`;
    }
    report += '\n';
  }

  // Healthy state message
  if (isHealthy(healthData)) {
    report += '✓ All systems healthy - no governance issues detected.\n';
  } else {
    report += '**Next Step:** Address policy violations and risks, then run /scrum-approve for pending stories.\n';
  }

  return report;
}

/**
 * Formats health report as JSON string
 * @param {Object} healthData - Aggregated health data
 * @returns {string} JSON formatted health report
 */
export function formatHealthReportJson(healthData) {
  const output = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    healthy: isHealthy(healthData),
    summary: healthData.summary,
    policyViolations: healthData.policyViolations.map(v => ({
      severity: v.severity,
      ticket: v.ticket,
      violationType: v.violationType,
      recommendedAction: v.recommendedAction
    })),
    openRisks: healthData.openRisks.map(r => ({
      severity: r.severity,
      affectedArea: r.affectedArea,
      mitigation: r.mitigation,
      ticket: r.ticket
    })),
    pendingApprovals: healthData.pendingApprovals.map(s => ({
      ticket: s.ticket,
      title: s.title
    }))
  };

  return JSON.stringify(output, null, 2);
}

/**
 * Main execution function for delivery-health
 * @param {Object} options - Execution options
 * @param {string} [options.projectRoot] - Project root directory (default: process.cwd())
 * @param {string} [options.format] - Output format: 'table' or 'json' (default: 'table')
 * @returns {Object} Execution result
 */
export function executeDeliveryHealth(options = {}) {
  const {
    projectRoot = process.cwd(),
    format = 'table'
  } = options;

  const healthData = aggregateHealthData(projectRoot);

  if (format === 'json') {
    return {
      success: true,
      output: formatHealthReportJson(healthData),
      healthy: isHealthy(healthData),
      data: healthData
    };
  }

  return {
    success: true,
    output: formatHealthReportTable(healthData),
    healthy: isHealthy(healthData),
    data: healthData
  };
}

// Re-export constants for external use
export const SEVERITY_COLORS = {
  critical: 'red',
  major: 'yellow',
  minor: 'cyan'
};

export const HEALTHY_EMOJI = '✓';
export const VIOLATION_EMOJI = '❌';
export const RISK_EMOJI = '⚠';
export const PENDING_EMOJI = 'ℹ';