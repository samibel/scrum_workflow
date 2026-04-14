# Delivery Health Workflow

Step-by-step workflow for the `/delivery-health` command. Aggregates governance data from multiple sources to provide a comprehensive delivery health report.

## Agentic Pattern: Governance Dashboard

**Pattern Source:** Sprint Observability (FR-40)

**Key Principles:**
1. **Aggregated Visibility:** Single view across policy violations, risks, and approvals
2. **Read-Only Operation:** No writes, only reads and aggregation
3. **Color-Coded Severity:** Immediate visual priority identification
4. **Actionable Summary:** Clear next steps for governance remediation

## Data Sources

The delivery health command aggregates from three sources:

1. **Policy Violations** - `_scrum-output/audit/` (from Stories 8.2 and 8.3)
2. **Open Risks** - `_scrum-output/memory/risks/*.md` (from Story 7.2)
3. **Pending Approvals** - `_scrum-output/sprints/SW-XXX/story.md` with `status: approved`

## Step 1: Initialize Health Data Collection

### Step 1.1: Scan Audit Directory for Policy Violations

Read all files from `_scrum-output/audit/`.

**For each file:**
1. Check if filename matches `SW-XXX-*` pattern (audit entry files)
2. Read file content and check for `policy-violation` keyword
3. If found, extract:
   - Severity (from `**Severity** | value`)
   - Ticket ID (from `**Ticket** | value`)
   - Violation type (from `**Violation Type** | value`)
   - Recommended action (from `**Recommended Action** | value`)

### Step 1.2: Scan Risks Directory for Open Risks

Read all files from `_scrum-output/memory/risks/` matching `RN-*.md` pattern.

**For each file:**
1. Extract YAML frontmatter
2. Check if `status: open`
3. If open, extract:
   - Severity (from `severity:`)
   - Affected area (from `affected_area:`)
   - Mitigation (from `mitigation:`)
   - Ticket (from `ticket:`)

### Step 1.3: Scan Sprints Directory for Approved Stories

Read all directories from `_scrum-output/sprints/` matching `SW-XXX` pattern.

**For each directory:**
1. Read `story.md` file
2. Extract `status` from YAML frontmatter
3. If `status: approved`, extract:
   - Ticket ID
   - Title

## Step 2: Aggregate and Deduplicate Findings

### Step 2.1: Combine Policy Violations

Create a deduplicated list of policy violations from audit entries.

**Deduplication strategy:** Use ticket ID + violation type as key to avoid duplicates.

### Step 2.2: Filter Open Risks

Filter risk notes to only include those with `status: open`. Resolved risks are excluded.

### Step 2.3: Count Pending Approvals

Count stories in `approved` status and list them for display.

## Step 3: Generate Health Report

### Step 3.1: Build Summary Header

```
## Summary
| Category | Count |
|----------|-------|
| Policy Violations | N |
| Open Risks | N |
| Pending Approvals | N |
```

### Step 3.2: Format Policy Violations Section

```
## Policy Violations
| Severity | Story | Recommended Action |
|----------|-------|---------------------|
| ❌ critical | SW-001 | Create plan.md before proceeding |
| ⚠ major | SW-002 | Run /scrum-verify to generate report |
```

### Step 3.3: Format Open Risks Section

```
## Open Risks
| Severity | Affected Area | Mitigation Status |
|----------|--------------|-------------------|
| ⚠ major | Database performance | Add indexing |
| ℹ minor | API latency | Add caching |
```

### Step 3.4: Format Pending Approvals Section

```
## Pending Approvals
| Story ID | Title |
|----------|-------|
| SW-003 | User authentication |
| SW-004 | API integration |
```

### Step 3.5: Add Footer Message

**If healthy (all zero):**
```
✓ All systems healthy - no governance issues detected.
```

**If issues found:**
```
**Next Step:** Address policy violations and risks, then run /scrum-approve for pending stories.
```

## Step 4: Output Format Handling

### Step 4.1: Table Format (Default)

Display the formatted Markdown table as shown above.

### Step 4.2: JSON Format

If `--format json` is specified, output:

```json
{
  "timestamp": "<ISO-8601>",
  "healthy": false,
  "summary": {
    "violationCount": 2,
    "riskCount": 1,
    "pendingApprovalCount": 3
  },
  "policyViolations": [...],
  "openRisks": [...],
  "pendingApprovals": [...]
}
```

## Write Boundary Rules

### Allowed Read Operations
- `_scrum-output/audit/*.md` - Audit trail entries
- `_scrum-output/memory/risks/*.md` - Risk notes
- `_scrum-output/sprints/SW-XXX/story.md` - Story metadata

### Prohibited Operations
- **NO writes** - This command is completely read-only
- No modification of any files
- No creation of temporary files

## Color Coding Compliance

Per UX-DR6:
- **Policy Violations**: Red (❌ for critical, ⚠ for major, ℹ for minor)
- **Open Risks**: Yellow (⚠)
- **Pending Approvals**: Cyan (ℹ)
- **Healthy State**: Green (✓)

## Emoji Prefix Compliance

Per UX-DR7:
- ❌ for errors/violations
- ⚠ for warnings/risks
- ℹ for info/pending
- ✓ for success/healthy

## Error Handling

| Error Condition | Response |
|----------------|----------|
| Audit directory missing | Return empty violations list |
| Risks directory missing | Return empty risks list |
| Sprints directory missing | Return empty pending approvals list |
| Invalid file format | Skip file and continue |
| No issues found | Show healthy state message |