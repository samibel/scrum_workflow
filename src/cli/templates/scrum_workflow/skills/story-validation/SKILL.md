---
name: story-validation
role: "story-file-integrity-validator"
description: "Validates story file YAML frontmatter integrity, required fields, and status values before processing"
---

# Identity

The story-validation skill is a read-only integrity checker that ensures story files are well-formed before any workflow processes them. It validates YAML frontmatter structure, confirms all required fields are present with valid values, and returns actionable error messages when validation fails. This prevents corrupted or malformed story files from causing downstream problems in workflows.

# Instructions

## YAML Frontmatter Validation

Validate that the story file has valid YAML frontmatter structure:

1. **Frontmatter Boundaries**: File must start with `---` and have a closing `---` delimiter
2. **YAML Parseability**: The frontmatter block must be valid YAML that can be parsed without errors
3. **Field Separation**: Frontmatter must be properly separated from Markdown body

**On missing or invalid frontmatter**, return an error:

```
Error: Invalid frontmatter in story.md: frontmatter block not found or malformed
Fix: Ensure the file starts with '---' and has a closing '---' delimiter with valid YAML content
```

## Required Field Validation

Validate that all required fields are present in the YAML frontmatter:

**Required fields for schema_version 1:**

| Field | Type | Validation Rule |
|---|---|---|
| `schema_version` | Integer | Must be present and equal to `1` |
| `ticket` | String | Must match pattern `SW-XXX` where XXX is zero-padded 3-digit number |
| `title` | String | Must be non-empty (length > 0) |
| `status` | String | Must be a valid state (see Status Value Validation) |
| `created` | String | Must be valid ISO 8601 date (YYYY-MM-DD format) |
| `updated` | String | Must be valid ISO 8601 date (YYYY-MM-DD format) |

**On missing required field**, return an error for each missing field:

```
Error: Invalid frontmatter in story.md: field 'field_name' missing
Fix: Add the required field 'field_name' to the YAML frontmatter
```

## Ticket Format Validation

Validate that the `ticket` field follows the correct format:

1. **Prefix**: Must start with `SW-`
2. **Number**: Must be exactly 3 digits with leading zeros (e.g., `001`, `042`, `103`)
3. **Range**: Valid range is `SW-001` through `SW-999`

**On invalid ticket format**, return an error:

```
Error: Invalid frontmatter in story.md: field 'ticket' has invalid value 'SW-1' (expected format: SW-XXX with zero-padded 3-digit number)
Fix: Update the ticket field to match the SW-XXX format (e.g., SW-001, SW-042, SW-103)
```

## Status Value Validation

Validate that the `status` field contains a valid state value:

**Valid status values for story files:**

| Status | Meaning |
|---|---|
| `draft` | Story created, not yet refined |
| `refinement` | Multi-agent refinement in progress |
| `refined` | Refinement complete, awaiting validation |
| `ready-for-dev` | Validated and ready for implementation |
| `in-progress` | Implementation in progress |
| `review` | Code review requested |
| `approved` | Review passed, awaiting human sign-off |
| `changes-needed` | Review found issues, changes required |
| `done` | Story completed and approved |

**On invalid status value**, return an error:

```
Error: Invalid frontmatter in story.md: field 'status' has invalid value 'invalid_status' (valid values: draft, refinement, refined, ready-for-dev, in-progress, review, approved, changes-needed, done)
Fix: Update the status field to one of the valid state values
```

## Date Field Validation

Validate that `created` and `updated` fields contain valid ISO 8601 dates:

1. **Presence**: Field must not be empty, null, or missing
2. **Format**: Must be `YYYY-MM-DD` format
3. **Validity**: Date must represent a valid calendar date
4. **Logical Consistency**: `updated` date must be on or after `created` date

**On empty or missing date field**, return an error:

```
Error: Invalid frontmatter in story.md: field 'created' is empty or missing
Fix: Add the required date field in ISO 8601 format (YYYY-MM-DD)
```

**On invalid date format**, return an error:

```
Error: Invalid frontmatter in story.md: field 'created' has invalid date format '2024/01/15' (expected format: YYYY-MM-DD)
Fix: Update the date field to use ISO 8601 format (YYYY-MM-DD)
```

## Optional Field Handling

The `estimation` field is optional. If present, validate that it is a positive number or `null`. Do not return an error if this field is absent.

# Output Format

Return a structured validation result:

```yaml
valid: true/false
errors:
  - field: "field_name"
    message: "Human-readable error description"
    fix: "Actionable fix instruction"
warnings:
  - field: "field_name"
    message: "Warning message for non-critical issues"
```

**When `valid: true`**: No errors array or empty errors array. Story file passed all validation checks.

**When `valid: false`**: Include all validation errors in the errors array. Each error must specify the field, what's wrong, and how to fix it. Workflow must halt on validation failure and not proceed with processing.

# Context Rules

## Reads

- Story file to validate (typically `_scrum-output/sprints/SW-XXX/story.md`)
- Story template schema reference: `scrum_workflow/templates/story.md`
- State machine status values: `scrum_workflow/context/standards.md`

## Writes

This skill never writes files. It is a read-only validation capability that returns structured results to the orchestrating workflow. Workflows calling this skill are responsible for halting on validation failure and presenting error messages to the user.
