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

  if (!currentStatus) {
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
      errorMessage: `Status Guard Violation: Story has status '${currentStatus}'\n\n**Details:** The story must be in 'approved' status (post-review) before it can be marked as done.\n\n**Next Step:** Run /scrum-review-story to complete the review process first.`
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
    return match ? parseInt(match[1], 10) : 0;
  });

  return Math.max(...numbers) + 1;
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

  const approvalNumber = getNextApprovalNumber(outputDir);
  const approvalFile = join(outputDir, `approval-${approvalNumber}.md`);
  const approvalDate = new Date().toISOString();

  // Extract review round number from review reference (e.g., "review-2.md" -> 2)
  const reviewRoundMatch = reviewReference.match(/review-(\d+)\.md/);
  const basedOnReview = reviewRoundMatch ? parseInt(reviewRoundMatch[1], 10) : 1;

  const content = `---
schema_version: 1
ticket: ${ticketId}
title: "${storyTitle}"
approval_date: ${approvalDate}
approver: ${approver}
decision: ${decision}
review_reference: ${reviewReference}
review_date: ${reviewDate}
based_on_review: ${basedOnReview}
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
**Review Round:** ${basedOnReview}

## Approval Decision

**Decision:** ${decision}

### Rationale

${reasoning || 'No additional rationale provided.'}

## Audit Trail

**Approval Timestamp:** ${approvalDate}
**Ticket ID:** ${ticketId}
**Review Round Reference:** ${basedOnReview}

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
  const timestamp = new Date().toISOString();

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

/**
 * Executes the /scrum-approve command
 * @param {string} ticketId - The story ticket ID (e.g., 'SW-001')
 * @param {Object} options - Approval options
 * @param {string} options.approver - Name of the human approver
 * @param {string} options.reasoning - Approval reasoning/notes
 * @param {string} options.reviewReference - Reference to the review file
 * @param {string} options.storyPath - Path to the story file (optional, will be inferred)
 * @param {string} options.projectRoot - Project root directory (optional)
 * @returns {Object} Result of the approval operation
 */
export function executeScrumApprove(ticketId, options) {
  const {
    approver,
    reasoning,
    reviewReference,
    storyPath,
    projectRoot = process.cwd()
  } = options;

  // Infer story path if not provided
  const actualStoryPath = storyPath || join(projectRoot, '_scrum-output', 'sprints', ticketId, 'story.md');

  // Check if story file exists
  if (!existsSync(actualStoryPath)) {
    return {
      success: false,
      error: `Story file '${actualStoryPath}' not found\n\nFix: Ensure story exists before triggering approval`
    };
  }

  // Read story file
  const storyContent = readFileSync(actualStoryPath, 'utf8');

  // Parse story (basic YAML frontmatter parsing)
  const frontmatterMatch = storyContent.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) {
    return {
      success: false,
      error: 'Story file has missing or invalid YAML frontmatter\n\nFix: Ensure story.md has valid YAML frontmatter with status field'
    };
  }

  // Parse frontmatter (basic key-value parsing)
  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      // Parse status_history as array if present
      if (key === 'status_history') {
        frontmatter[key] = [];
      } else {
        frontmatter[key] = value.replace(/^"|"$/g, '');
      }
    }
  }

  const story = {
    frontmatter,
    content: storyContent
  };

  // Validate status
  const statusCheck = validateApprovalStatus(story);
  if (!statusCheck.valid) {
    return {
      success: false,
      error: statusCheck.errorMessage,
      currentStatus: statusCheck.currentStatus
    };
  }

  // Check if review file exists
  const reviewFilePath = join(projectRoot, '_scrum-output', 'sprints', ticketId, reviewReference || 'review-1.md');
  if (!existsSync(reviewFilePath)) {
    return {
      success: false,
      error: `No review file found for ${ticketId}\n\nFix: Run code review first: '/scrum-review-story ${ticketId}'`
    };
  }

  // Read review file to get review date
  const reviewContent = readFileSync(reviewFilePath, 'utf8');
  const reviewDateMatch = reviewContent.match(/review_date:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/);
  const reviewDate = reviewDateMatch ? reviewDateMatch[1] : new Date().toISOString();

  // Create approval artifact
  const outputDir = join(projectRoot, '_scrum-output', 'sprints', ticketId);
  const artifactPath = createApprovalArtifact(ticketId, {
    storyTitle: frontmatter.title || 'Unknown Story',
    approver,
    decision: 'approved',
    reviewReference: reviewReference || 'review-1.md',
    reviewDate,
    reasoning,
    outputDir
  });

  // Transition to done
  const updatedStory = transitionToDone(story, ticketId, approver);

  // Verify write boundary compliance
  const modifiedFiles = [artifactPath, actualStoryPath];
  const complianceCheck = verifyWriteBoundaryCompliance(ticketId, modifiedFiles);

  if (!complianceCheck.compliant) {
    return {
      success: false,
      error: `Write boundary violations detected:\n${complianceCheck.violations.join('\n')}`
    };
  }

  // Update story file with new status
  const updatedFrontmatter = { ...frontmatter };
  updatedFrontmatter.status = 'done';
  updatedFrontmatter.updated = new Date().toISOString();

  // Reconstruct story file with updated frontmatter
  const newStoryContent = storyContent.replace(
    /^---\n([\s\S]+?)\n---/,
    `---\n${Object.entries(updatedFrontmatter)
      .map(([k, v]) => `${k}: ${typeof v === 'string' ? `"${v}"` : v}`)
      .join('\n')}\n---`
  );

  writeFileSync(actualStoryPath, newStoryContent, 'utf8');

  return {
    success: true,
    ticketId,
    artifactPath,
    story: updatedStory,
    modifiedFiles
  };
}
