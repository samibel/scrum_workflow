/**
 * Story 8.2: Implement Policy Violation Detection
 *
 * This module provides utility functions for the /scrum-policy-check command,
 * detecting policy violations in story lifecycle governance.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

/**
 * Valid state transitions based on 9-state lifecycle (Story 3.1)
 */
const VALID_TRANSITIONS = {
  'draft': ['refined'],
  'refined': ['ready-for-dev'],
  'ready-for-dev': ['in-progress'],
  'in-progress': ['review', 'changes-needed'],
  'review': ['approved', 'changes-needed'],
  'changes-needed': ['in-progress'],
  'approved': ['done'],
  'done': [],
  'cancelled': []
};

/**
 * Lifecycle states where violations can be detected (in-progress+)
 */
const APPLICABLE_STATUSES = ['in-progress', 'review', 'approved', 'done', 'changes-needed'];

/**
 * Statuses where plan.md must exist
 */
const PLAN_REQUIRED_STATUSES = ['in-progress', 'review', 'approved', 'done', 'changes-needed'];

/**
 * Statuses where verification-report.md must exist
 */
const VERIFICATION_REQUIRED_STATUSES = ['review', 'approved', 'done', 'changes-needed'];

/**
 * Remediation guidance for each violation type
 */
const REMEDIATION_GUIDANCE = {
  'No Plan': "Create plan.md using '/scrum-refine-story SW-XXX' before proceeding with implementation.",
  'No Verification': "Run '/scrum-verify SW-XXX' to generate the verification report.",
  'Skipped Phase': "Review the story status history and ensure all lifecycle phases are followed properly."
};

/**
 * Checks if a state transition is valid
 * @param {string} from - Source status
 * @param {string} to - Target status
 * @returns {boolean} True if transition is valid
 */
function isValidTransition(from, to) {
  if (!VALID_TRANSITIONS[from]) return false;
  return VALID_TRANSITIONS[from].includes(to);
}

/**
 * Detects all policy violations for a story
 * @param {Object} story - Story object with frontmatter and content
 * @returns {Array} Array of detected violations
 */
export function detectViolations(story) {
  const violations = [];
  const status = story.frontmatter?.status;
  const statusHistory = story.frontmatter?.status_history || [];

  // Detect No Plan violation
  if (PLAN_REQUIRED_STATUSES.includes(status)) {
    const planPath = join('_scrum-output', 'sprints', story.frontmatter.ticket, 'plan.md');
    if (!existsSync(planPath)) {
      violations.push({
        type: 'No Plan',
        detected_at: new Date().toISOString(),
        story_status: status,
        message: `Story ${story.frontmatter.ticket} is in '${status}' status but plan.md does not exist.`
      });
    }
  }

  // Detect No Verification violation
  if (VERIFICATION_REQUIRED_STATUSES.includes(status)) {
    const verifyPath = join('_scrum-output', 'sprints', story.frontmatter.ticket, 'verification-report.md');
    if (!existsSync(verifyPath)) {
      violations.push({
        type: 'No Verification',
        detected_at: new Date().toISOString(),
        story_status: status,
        message: `Story ${story.frontmatter.ticket} has reached '${status}' status but verification-report.md does not exist.`
      });
    }
  }

  // Detect Skipped Phase violation
  for (const entry of statusHistory) {
    if (entry.from && entry.to && !isValidTransition(entry.from, entry.to)) {
      violations.push({
        type: 'Skipped Phase',
        detected_at: new Date().toISOString(),
        story_status: status,
        from_status: entry.from,
        to_status: entry.to,
        message: `Story ${story.frontmatter.ticket} transitioned from '${entry.from}' to '${entry.to}' without the required intermediate state.`
      });
    }
  }

  return violations;
}

/**
 * Creates the policy violation report
 * @param {Object} reportData - Report metadata and violations
 * @returns {string} Path to the created report file
 */
export function createViolationReport(reportData) {
  const {
    ticketId,
    storyStatus,
    outputDir,
    violations
  } = reportData;

  const timestamp = new Date().toISOString();

  let reportContent = `---
schema_version: 1
ticket: ${ticketId}
generated: ${timestamp}
violations_count: ${violations.length}
---

# Policy Violation Report: ${ticketId}

**Generated:** ${timestamp}
**Story Status:** ${storyStatus}
**Violations Found:** ${violations.length}

## Violations

`;

  violations.forEach((violation, index) => {
    const violationNum = index + 1;
    const guidance = REMEDIATION_GUIDANCE[violation.type] || 'No remediation guidance available.';

    reportContent += `### ${violationNum}. ${violation.type}

**Detected:** ${violation.detected_at}
**Story Status:** ${violation.story_status}

❌ Policy Violation: ${violation.type}

**Details:** ${violation.message}

**Next Step:** ${guidance}

`;
  });

  reportContent += `---

## Summary

| Violation Type | Status |
|----------------|--------|
`;

  violations.forEach((violation) => {
    reportContent += `| ${violation.type} | DETECTED |\n`;
  });

  reportContent += `
## Remediation Guidance

| Violation Type | Remediation |
|----------------|-------------|
| No Plan | Create plan.md using '/scrum-refine-story SW-XXX' |
| No Verification | Run '/scrum-verify SW-XXX' to generate verification report |
| Skipped Phase | Review story status_history and ensure proper transitions |

---

*This report was generated by /scrum-policy-check for governance compliance tracking.*
`;

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const reportFile = join(outputDir, `${ticketId}-policy-violations.md`);

  // Atomic write: write to temp file then rename
  const tempFile = reportFile + '.tmp.' + Date.now();
  writeFileSync(tempFile, reportContent, 'utf8');
  renameSync(tempFile, reportFile);

  return reportFile;
}

/**
 * Executes the /scrum-policy-check command
 * @param {string} ticketId - Ticket ID (e.g., 'SW-001')
 * @param {Object} options - Options
 * @returns {Object} { success: boolean, violations: Array, reportFile: string, message: string }
 */
export function executePolicyCheck(ticketId, options = {}) {
  const {
    projectRoot = process.cwd()
  } = options;

  // Validate ticketId format to prevent path traversal
  if (!/^SW-\d{3}$/.test(ticketId)) {
    return {
      success: false,
      error: `Invalid ticket ID format '${ticketId}'. Expected SW-XXX.`
    };
  }

  const storyPath = join(projectRoot, '_scrum-output', 'sprints', ticketId, 'story.md');

  // Check story file exists
  if (!existsSync(storyPath)) {
    return {
      success: false,
      error: `Story file not found: _scrum-output/sprints/${ticketId}/story.md`
    };
  }

  // Read story file
  let storyContent;
  try {
    storyContent = readFileSync(storyPath, 'utf8');
  } catch (err) {
    return {
      success: false,
      error: `Failed to read story file: ${err.message}`
    };
  }

  // Parse frontmatter
  const frontmatterMatch = storyContent.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) {
    return {
      success: false,
      error: 'Invalid story frontmatter'
    };
  }

  let frontmatter;
  try {
    frontmatter = yaml.load(frontmatterMatch[1]);
  } catch (err) {
    return {
      success: false,
      error: `YAML Parsing Error: ${err.message}`
    };
  }

  // Status guard: check if story is in applicable status
  if (!APPLICABLE_STATUSES.includes(frontmatter.status)) {
    return {
      success: false,
      error: `Status Guard Violation: Story ${ticketId} is in '${frontmatter.status}' - policy check only applies to in-progress+ stories`
    };
  }

  const story = { frontmatter, content: storyContent };
  const violations = detectViolations(story);

  // Generate audit log directory
  const auditDir = join(projectRoot, '_scrum-output', 'audit');

  if (violations.length > 0) {
    const reportFile = createViolationReport({
      ticketId,
      storyStatus: frontmatter.status,
      outputDir: auditDir,
      violations
    });

    return {
      success: true,
      violations,
      reportFile,
      message: `⚠️ Policy Violations Detected for ${ticketId}\n\n${violations.map(v => `❌ ${v.type} - ${v.message}`).join('\n')}\n\nReport: ${reportFile}`
    };
  } else {
    return {
      success: true,
      violations: [],
      reportFile: null,
      message: `✅ No Policy Violations Detected for ${ticketId}\n\nAll governance checks passed. Story is compliant with lifecycle requirements.`
    };
  }
}