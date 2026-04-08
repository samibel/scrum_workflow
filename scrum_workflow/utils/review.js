import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Story 2.4: Multi-Round Review Tracking Implementation
 *
 * This module provides utility functions for multi-round review tracking
 * with incremental artifact numbering.
 */

/**
 * Generates the next sequential review number for a story
 * @param {string} outputDir - The output directory for the story
 * @returns {number} The next review number (1, 2, 3, etc.)
 */
export function getNextReviewNumber(outputDir) {
  if (!existsSync(outputDir)) {
    return 1;
  }

  const files = readdirSync(outputDir);
  const reviewFiles = files.filter(f => f.match(/^review-\d+\.md$/));

  if (reviewFiles.length === 0) {
    return 1;
  }

  const numbers = reviewFiles.map(f => {
    const match = f.match(/^review-(\d+)\.md$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  return Math.max(...numbers) + 1;
}

/**
 * Creates the review artifact file with incremental numbering
 * @param {Object} reviewData - Review metadata
 * @param {string} reviewData.ticketId - The story ticket ID
 * @param {string} reviewData.storyTitle - The story title
 * @param {string} reviewData.reviewDate - The review date (ISO 8601)
 * @param {string} reviewData.verdict - The review verdict (approved/changes-needed)
 * @param {Array} reviewData.findings - Array of findings
 * @param {string} reviewData.outputDir - The output directory
 * @param {Object} reviewData.previousReviewContext - Previous review context (optional)
 * @returns {string} Path to the created review file
 */
export function createReviewArtifact(reviewData) {
  const {
    ticketId,
    storyTitle,
    reviewDate,
    verdict,
    findings = [],
    outputDir,
    previousReviewContext = null
  } = reviewData;

  const reviewNumber = getNextReviewNumber(outputDir);
  const reviewFile = join(outputDir, `review-${reviewNumber}.md`);

  // Count findings by severity
  const criticalCount = findings.filter(f => f.severity === 'Critical').length;
  const majorCount = findings.filter(f => f.severity === 'Major').length;
  const minorCount = findings.filter(f => f.severity === 'Minor').length;
  const totalCount = findings.length;

  // Generate findings table rows
  const findingsRows = findings.map((finding, index) => {
    const acRef = finding.acReference || 'N/A';
    const fix = finding.suggestedFix || 'No specific fix suggested';
    return `| ${index + 1} | ${finding.description} | ${finding.severity} | ${acRef} | ${fix} |`;
  }).join('\n');

  // Generate critical findings detail
  const criticalFindings = findings.filter(f => f.severity === 'Critical');
  const criticalDetail = criticalFindings.length > 0
    ? criticalFindings.map(f => `#### ${f.description}\n\n**Severity:** Critical\n**AC Reference:** ${f.acReference || 'N/A'}\n\n**Suggested Fix:** ${f.suggestedFix || 'None provided'}\n`).join('\n')
    : '*No critical findings.*';

  // Generate major findings detail
  const majorFindings = findings.filter(f => f.severity === 'Major');
  const majorDetail = majorFindings.length > 0
    ? majorFindings.map(f => `#### ${f.description}\n\n**Severity:** Major\n**AC Reference:** ${f.acReference || 'N/A'}\n\n**Suggested Fix:** ${f.suggestedFix || 'None provided'}\n`).join('\n')
    : '*No major findings.*';

  // Generate minor findings detail
  const minorFindings = findings.filter(f => f.severity === 'Minor');
  const minorDetail = minorFindings.length > 0
    ? minorFindings.map(f => `#### ${f.description}\n\n**Severity:** Minor\n**AC Reference:** ${f.acReference || 'N/A'}\n\n**Suggested Fix:** ${f.suggestedFix || 'None provided'}\n`).join('\n')
    : '*No minor findings.*';

  // Generate previous findings section if context exists
  let previousFindingsSection = '';
  if (previousReviewContext && previousReviewContext.exists) {
    const prevFindings = previousReviewContext.findings || [];
    const prevFindingsRows = prevFindings.map((finding, index) => {
      const status = finding.status || 'unresolved';
      return `| ${finding.description} | ${status} | Re-verify in current review |`;
    }).join('\n');

    previousFindingsSection = `
## Previous Findings Resolution

**Previous Review:** review-${previousReviewContext.reviewNumber} (${previousReviewContext.reviewDate || 'N/A'})

| Previous Finding | Status | Notes |
|-----------------|---------|-------|
${prevFindingsRows || '| None | - | - |'}

**Summary:**
- Total previous findings: ${prevFindings.length}
- Resolved: ${prevFindings.filter(f => f.status === 'resolved').length}
- Unresolved: ${prevFindings.filter(f => f.status !== 'resolved').length}
- New findings: ${totalCount}
`;
  } else {
    previousFindingsSection = `
*This is the first review for this story.*
`;
  }

  const content = `---
schema_version: 1
ticket: ${ticketId}
title: "${storyTitle}"
review_date: ${reviewDate}
review_round: ${reviewNumber}
reviewer: "[AI Code Reviewer]"
verdict: "${verdict}"
---

# Code Review: ${storyTitle}

**Ticket:** ${ticketId}
**Status:** In Review
**Review Date:** ${reviewDate}
**Review Number:** ${reviewNumber}
**Verdict:** ${verdict}

## Summary

| Total | Critical | Major | Minor |
|-------|----------|-------|-------|
| ${totalCount} | ${criticalCount} | ${majorCount} | ${minorCount} |

## Review Scope

**Files Reviewed:**
See story file list for complete inventory of changes.

**Changes Analyzed:**
Implementation completed per story specification.

## Findings

| # | Finding | Severity | AC Reference | Suggested Fix |
|---|---------|----------|--------------|--------------|
${findingsRows || '| No findings | - | - | - |'}

## Detailed Analysis

### Critical Findings (${criticalCount})

${criticalDetail}

### Major Findings (${majorCount})

${majorDetail}

### Minor Findings (${minorCount})

${minorDetail}

${previousFindingsSection}

## Approval Assessment

**Overall Assessment:** ${verdict === 'approved' ? 'PASS' : 'FAIL - BLOCKING'}

**Ready for Approval:**
- [ ] All Critical findings addressed
- [ ] All Major findings addressed or documented as acceptable risk
- [ ] Minor findings documented for future work

**Next Steps:**
${verdict === 'approved'
  ? 'Story approved. Proceed to /scrum-approve for final approval gate.'
  : 'Address findings and re-submit for review.'}
`;

  // Ensure directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(reviewFile, content, 'utf8');

  return reviewFile;
}

/**
 * Loads context from the most recent previous review
 * @param {string} outputDir - The output directory for the story
 * @returns {Object} Previous review context { exists: boolean, reviewNumber: number, content: string, findings: Array, reviewDate: string }
 */
export function loadPreviousReviewContext(outputDir) {
  if (!existsSync(outputDir)) {
    return {
      exists: false,
      reviewNumber: 0,
      content: null,
      findings: [],
      reviewDate: null
    };
  }

  const files = readdirSync(outputDir);
  const reviewFiles = files.filter(f => f.match(/^review-\d+\.md$/));

  if (reviewFiles.length === 0) {
    return {
      exists: false,
      reviewNumber: 0,
      content: null,
      findings: [],
      reviewDate: null
    };
  }

  // Find the highest review number
  const numbers = reviewFiles.map(f => {
    const match = f.match(/^review-(\d+)\.md$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  const highestReviewNumber = Math.max(...numbers);
  const mostRecentReviewFile = join(outputDir, `review-${highestReviewNumber}.md`);
  const reviewContent = readFileSync(mostRecentReviewFile, 'utf8');

  // Extract review date
  const reviewDateMatch = reviewContent.match(/review_date:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/);
  const reviewDate = reviewDateMatch ? reviewDateMatch[1] : null;

  // Extract findings from the review content
  const findings = [];

  // Find the findings table section
  const findingsSectionMatch = reviewContent.match(/## Findings\n([\s\S]*?)\n##/);
  if (findingsSectionMatch) {
    const lines = findingsSectionMatch[1].split('\n');
    let inTable = false;

    for (const line of lines) {
      // Skip header and separator lines
      if (line.includes('| Finding |') || line.match(/^\|[\s-]+\|[\s-]+\|[\s-]+\|[\s-]+\|[\s-]+\|/)) {
        inTable = true;
        continue;
      }

      // Parse table rows
      if (inTable && line.startsWith('|')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);

        // Skip if not a data row (must have at least Finding, Severity columns)
        if (parts.length >= 2 && parts[1] !== 'Finding' && parts[1] !== 'No findings' && parts[1] !== '#') {
          findings.push({
            number: parts[0] || 'N/A',
            description: parts[1] || 'N/A',
            severity: parts[2] || 'Minor',
            acReference: parts[3] || 'N/A',
            suggestedFix: parts[4] || 'None',
            status: 'unresolved' // Will be updated when verified
          });
        }
      }
    }
  }

  return {
    exists: true,
    reviewNumber: highestReviewNumber,
    content: reviewContent,
    findings,
    reviewDate
  };
}

/**
 * Updates the review template to include the review round number
 * @param {string} templatePath - Path to the review template
 * @param {number} reviewNumber - The review round number
 * @returns {string} Updated template content
 */
export function updateReviewTemplateWithRoundNumber(templatePath, reviewNumber) {
  if (!existsSync(templatePath)) {
    throw new Error(`Review template not found: ${templatePath}`);
  }

  const templateContent = readFileSync(templatePath, 'utf8');

  // Replace review_number placeholder if it exists
  const updatedContent = templateContent.replace(
    /review_number:\s*"?\{\{review_number\}\}"?/,
    `review_number: ${reviewNumber}`
  );

  return updatedContent;
}

/**
 * Updates the approval template to include the review round reference
 * @param {string} templatePath - Path to the approval template
 * @param {string} reviewReference - The review file reference (e.g., "review-2.md")
 * @returns {string} Updated template content
 */
export function updateApprovalTemplateWithReviewRound(templatePath, reviewReference) {
  if (!existsSync(templatePath)) {
    throw new Error(`Approval template not found: ${templatePath}`);
  }

  const templateContent = readFileSync(templatePath, 'utf8');

  // Extract review round number from reference (e.g., "review-2.md" -> 2)
  const reviewRoundMatch = reviewReference.match(/review-(\d+)\.md/);
  const reviewRound = reviewRoundMatch ? reviewRoundMatch[1] : '1';

  // Replace review_reference placeholder if it exists
  const updatedContent = templateContent.replace(
    /review_reference:\s*"?\{\{review_file\}\}"?/,
    `review_reference: ${reviewReference}`
  );

  return updatedContent;
}

/**
 * Verifies write boundary compliance for review operations
 * @param {string} ticketId - The story ticket ID
 * @param {string[]} modifiedFiles - List of files that were modified
 * @returns {Object} { compliant: boolean, violations: string[] }
 */
export function verifyReviewWriteBoundaryCompliance(ticketId, modifiedFiles) {
  const allowedPatterns = [
    new RegExp(`_scrum-output/sprints/${ticketId}/review-\\d+\\.md$`),
    new RegExp(`_scrum-output/sprints/${ticketId}/story\\.md$`)
  ];

  const prohibitedPatterns = [
    /refinement\.md$/,
    /plan\.md$/,
    /approval-\d+\.md$/,
    /^scrum_workflow\// // Framework files
  ];

  const violations = [];

  for (const file of modifiedFiles) {
    // Check if file is explicitly prohibited
    for (const pattern of prohibitedPatterns) {
      if (pattern.test(file)) {
        violations.push(`Write boundary violation: ${file} is prohibited from modification during review`);
      }
    }

    // Check if file is allowed
    const isAllowed = allowedPatterns.some(pattern => pattern.test(file));

    if (!isAllowed && !violations.some(v => v.includes(file))) {
      violations.push(`Write boundary violation: ${file} is not an allowed file for review`);
    }
  }

  return {
    compliant: violations.length === 0,
    violations
  };
}
