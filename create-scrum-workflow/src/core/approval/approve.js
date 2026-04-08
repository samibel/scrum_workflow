import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Story 2.2: /scrum-approve Command Implementation
 *
 * This module provides utility functions for the approval workflow.
 */

/**
 * Validates story status for approval
 * @param {Object} story - The story object with frontmatter
 * @returns {Object} { valid: boolean, currentStatus: string, requiredStatus: string, errorMessage?: string }
 */
export function validateApprovalStatus(story) {
  if (!story || !story.frontmatter) {
    return {
      valid: false,
      currentStatus: 'unknown',
      requiredStatus: 'approved',
      errorMessage: 'Story frontmatter is missing or invalid'
    };
  }

  const currentStatus = story.frontmatter.status;
  const ticketId = story.frontmatter.ticket || 'Unknown';

  // Path traversal security check
  if (ticketId.includes('..') || ticketId.includes('/') || ticketId.includes('\\')) {
    return {
      valid: false,
      currentStatus: 'unknown',
      requiredStatus: 'approved',
      errorMessage: `Security Violation: Invalid ticket ID format '${ticketId}'. Ticket IDs must be in SW-XXX format.`
    };
  }

  if (!currentStatus || currentStatus.trim() === '') {
    return {
      valid: false,
      currentStatus: 'unknown',
      requiredStatus: 'approved',
      errorMessage: 'Status field is empty in story.md'
    };
  }

  if (currentStatus !== 'approved') {
    return {
      valid: false,
      currentStatus,
      requiredStatus: 'approved',
      errorMessage: `Status Guard Violation: Story ${ticketId} has status '${currentStatus}'\n\n**Details:** The story must be in 'approved' status (post-review) before it can be marked as done.\n\n**Next Step:** Run /scrum-review-story to complete the review process first.`
    };
  }

  return {
    valid: true,
    currentStatus,
    requiredStatus: 'approved'
  };
}

/**
 * Generates the next sequential approval number for a story
 * @param {string} outputDir - The output directory for the story
 * @returns {number} The next approval number (1, 2, 3, etc.)
 */
export function getNextApprovalNumber(outputDir) {
  try {
    if (!existsSync(outputDir)) {
      return 1;
    }

    const files = readdirSync(outputDir);
    const approvalFiles = files.filter(f => f.match(/^approval-\d+\.md$/));

    if (approvalFiles.length === 0) {
      return 1;
    }

    const numbers = approvalFiles.map(f => {
      const match = f.match(/^approval-(\d+)\.md$/);
      const num = match ? parseInt(match[1], 10) : NaN;
      return isNaN(num) ? 0 : num;
    });

    return Math.max(...numbers) + 1;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return 1;
    }
    throw error;
  }
}

/**
 * Creates the approval artifact file
 * @param {string} ticketId - The story ticket ID
 * @param {Object} approvalData - Approval metadata
 * @returns {string} Path to the created approval file
 */
export function createApprovalArtifact(ticketId, approvalData) {
  const {
    storyTitle,
    approver,
    decision,
    reviewReference,
    reviewDate,
    reasoning,
    outputDir
  } = approvalData;

  // Input validation
  if (!approver || approver.trim().length === 0 || approver.length > 100) {
    throw new Error('Invalid approver name: must be 1-100 characters');
  }
  if (reasoning && reasoning.length > 10240) {
    throw new Error('Reasoning exceeds maximum length of 10KB');
  }

  const approvalNumber = getNextApprovalNumber(outputDir);
  const approvalFile = join(outputDir, `approval-${approvalNumber}.md`);
  const approvalDate = new Date().toISOString();

  const content = `---
schema_version: 1
ticket: ${ticketId}
title: "${storyTitle}"
approval_date: ${approvalDate}
approver: ${approver}
decision: ${decision}
review_reference: ${reviewReference}
review_date: ${reviewDate}
---

# Approval Record for ${storyTitle}

**Ticket:** ${ticketId}
**Approver:** ${approver}
**Decision:** ${decision}
**Date:** ${approvalDate}
**Review Reference:** ${reviewReference}

## Review Summary

**Review File:** ${reviewReference}
**Review Date:** ${reviewDate}

## Approval Decision

**Decision:** ${decision}

### Rationale

${reasoning || 'No additional rationale provided.'}

## Audit Trail

**Approval Timestamp:** ${approvalDate}
**Ticket ID:** ${ticketId}

## Next Steps

${decision === 'approved' ? 'Story marked as DONE' : 'Additional work required before approval'}

---

*This approval record is part of the permanent audit trail for story ${ticketId}.*
`;

  // Ensure directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(approvalFile, content, 'utf8');

  return approvalFile;
}

/**
 * Transitions story status to done
 * @param {Object} story - The story object
 * @param {string} ticketId - The story ticket ID
 * @param {string} approver - The approver identity
 * @returns {Object} Updated story object
 */
export function transitionToDone(story, ticketId, approver) {
  // Initialize status_history if missing
  if (!story.frontmatter.status_history) {
    story.frontmatter.status_history = [];
  }

  // Generate ISO 8601 UTC timestamp without milliseconds
  const now = new Date();
  const timestamp = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  )).toISOString();

  const updatedStory = {
    ...story,
    frontmatter: {
      ...story.frontmatter,
      status: 'done',
      updated: timestamp,
      status_history: [
        ...(story.frontmatter.status_history || []),
        {
          from: 'approved',
          to: 'done',
          timestamp,
          trigger: '/scrum-approve',
          actor: 'human'
        }
      ]
    }
  };

  return updatedStory;
}

/**
 * Checks if a status transition to 'done' is allowed
 * @param {string} fromStatus - Current status
 * @param {string} trigger - The command attempting the transition
 * @returns {Object} { allowed: boolean, reason?: string }
 */
export function canTransitionToDone(fromStatus, trigger) {
  // Only /scrum-approve can transition to done
  if (trigger !== '/scrum-approve') {
    return {
      allowed: false,
      reason: `Gate Violation: Only /scrum-approve can transition a story to 'done' status. Attempted trigger: ${trigger}`
    };
  }

  // Can only transition from 'approved' status
  if (fromStatus !== 'approved') {
    return {
      allowed: false,
      reason: `Status Guard Violation: Cannot transition from '${fromStatus}' to 'done'. Required status: 'approved'`
    };
  }

  return {
    allowed: true
  };
}

/**
 * Verifies write boundary compliance
 * @param {string} ticketId - The story ticket ID
 * @param {string[]} modifiedFiles - List of files that were modified
 * @returns {Object} { compliant: boolean, violations: string[] }
 */
export function verifyWriteBoundaryCompliance(ticketId, modifiedFiles) {
  const allowedPatterns = [
    new RegExp(`_scrum-output/sprints/${ticketId}/approval-\\d+\\.md$`),
    new RegExp(`_scrum-output/sprints/${ticketId}/story\\.md$`)
  ];

  const prohibitedPatterns = [
    /refinement\.md$/,
    /plan\.md$/,
    /review-\d+\.md$/,
    /^scrum_workflow\// // Framework files
  ];

  const violations = [];

  for (const file of modifiedFiles) {
    // Check if file is explicitly prohibited
    for (const pattern of prohibitedPatterns) {
      if (pattern.test(file)) {
        violations.push(`Write boundary violation: ${file} is prohibited from modification`);
      }
    }

    // Check if file is allowed
    const isAllowed = allowedPatterns.some(pattern => pattern.test(file));

    if (!isAllowed && !violations.some(v => v.includes(file))) {
      violations.push(`Write boundary violation: ${file} is not an allowed file for approval`);
    }
  }

  return {
    compliant: violations.length === 0,
    violations
  };
}
