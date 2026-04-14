import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Factory for creating mock review and approval artifacts
 */

export interface ReviewArtifactData {
  ticketId?: string;
  storyTitle?: string;
  reviewDate?: string;
  reviewNumber?: number;
  reviewer?: string;
  verdict?: string;
  findings?: any[];
  outputDir: string;
}

export function createReviewArtifact(data: ReviewArtifactData): string {
  const {
    ticketId = 'SW-001',
    storyTitle = 'Test Story',
    reviewDate = new Date().toISOString(),
    reviewNumber = 1,
    reviewer = '[AI Code Reviewer]',
    verdict = 'approved',
    findings = [],
    outputDir
  } = data;

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const filePath = join(outputDir, `review-${reviewNumber}.md`);
  
  const findingsRows = findings.map((f, i) => 
    `| ${i + 1} | ${f.description} | ${f.severity} | ${f.acReference || 'N/A'} | ${f.suggestedFix || 'None'} |`
  ).join('\n');

  const content = `---
schema_version: 1
ticket: ${ticketId}
title: "${storyTitle}"
review_date: ${reviewDate}
review_round: ${reviewNumber}
reviewer: "${reviewer}"
verdict: "${verdict}"
---

# Code Review: ${storyTitle}

## Findings

| # | Finding | Severity | AC Reference | Suggested Fix |
|---|---------|----------|--------------|--------------|
${findingsRows || '| No findings | - | - | - |'}
`;

  writeFileSync(filePath, content, 'utf8');
  return filePath;
}

export interface ApprovalArtifactData {
  ticketId?: string;
  storyTitle?: string;
  approvalDate?: string;
  approver?: string;
  decision?: string;
  reviewReference?: string;
  reviewDate?: string;
  basedOnReview?: number;
  outputDir: string;
}

export function createApprovalArtifact(data: ApprovalArtifactData): string {
  const {
    ticketId = 'SW-001',
    storyTitle = 'Test Story',
    approvalDate = new Date().toISOString(),
    approver = 'Sami',
    decision = 'approved',
    reviewReference = 'review-1.md',
    reviewDate = new Date().toISOString(),
    basedOnReview = 1,
    outputDir
  } = data;

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const approvalNumber = 1; // Simplification for factory
  const filePath = join(outputDir, `approval-${approvalNumber}.md`);

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
`;

  writeFileSync(filePath, content, 'utf8');
  return filePath;
}
