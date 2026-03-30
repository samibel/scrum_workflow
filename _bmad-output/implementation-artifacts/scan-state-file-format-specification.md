# Scan State File Format Specification

**Version:** 1.0
**Status:** Final (as of Story 6.7 completion)
**Purpose:** Define the complete format of `.scan-state.json` for incremental updates and resumption

## Overview

The scan state file (`docs/generated/.scan-state.json`) is a critical artifact that enables incremental documentation updates and resumption of interrupted scans. It tracks all files that have been analyzed, their content hashes, timestamps, and metadata about the scan execution. This file is **local only** and should not be committed to version control.

## File Location

- **Path:** `docs/generated/.scan-state.json` (relative to project root)
- **Git Status:** Excluded via `.gitignore` (scan state is local, not committed)
- **Filesystem:** Local development artifact, regenerated on each scan

## JSON Schema

### Complete Structure

```json
{
  "_comment": "Tracks scan progress for incremental updates and resumption. Local file — not committed to git.",
  "scan_date": "2026-03-30T12:34:56Z",
  "scan_mode": "full",
  "files_scanned": [
    {
      "path": "src/auth/service.ts",
      "hash": "sha256:a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd",
      "timestamp": "2026-03-30T12:34:50Z"
    },
    {
      "path": "src/billing/invoice.ts",
      "hash": "sha256:9f8e7d6c5b4a3210fedcba9876543210fedcba9876543210fedcba9876543210",
      "timestamp": "2026-03-30T12:34:52Z"
    }
  ],
  "documents_generated": [
    "docs/generated/business-logic.md",
    "docs/generated/workflows.md",
    "docs/generated/domain-model.md"
  ],
  "scan_duration": 45.2,
  "scan_status": "complete",
  "last_completed_file": "src/billing/invoice.ts"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| `_comment` | string | Yes | Human-readable explanation of the file's purpose. Always: "Tracks scan progress for incremental updates and resumption. Local file — not committed to git." |
| `scan_date` | string (ISO 8601) | Yes | Timestamp when the scan completed. Format: `YYYY-MM-DDTHH:MM:SSZ` (UTC timezone) |
| `scan_mode` | string (enum) | Yes | Execution mode. Values: `"full"`, `"update"`, `"resume"` |
| `files_scanned` | array of objects | Yes | Array of file entries, one per file analyzed during the scan |
| `documents_generated` | array of strings | Yes | Array of document file paths that were created/updated during the scan |
| `scan_duration` | number (float) | Yes | Time taken for the scan in seconds (non-negative, can be decimal for sub-second precision) |
| `scan_status` | string (enum) | Yes | Status of the scan. Values: `"complete"`, `"interrupted"` |
| `last_completed_file` | string (path) | Conditional | Last file successfully processed before interruption. **ONLY present when `scan_status` is `"interrupted"`. Omitted when `scan_status` is `"complete"`. |

### File Entry Schema

Each entry in the `files_scanned` array has the following structure:

```json
{
  "path": "src/auth/service.ts",
  "hash": "sha256:a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd",
  "timestamp": "2026-03-30T12:34:50Z"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `path` | string (path) | Yes | Relative path from project root to the source file. Always uses forward slashes (`/`) regardless of OS |
| `hash` | string | Yes | SHA-256 hash of the file content. Format: `sha256:` followed by 64-character hex string. Hash is computed from file content only (not metadata like mtime, permissions, or size) |
| `timestamp` | string (ISO 8601) | Yes | Timestamp when this file was processed during the scan. Format: `YYYY-MM-DDTHH:MM:SSZ` (UTC timezone) |

## Hash Computation Specification

### Algorithm

1. **Read file content**: Read the entire file as text using UTF-8 encoding
2. **Encode to bytes**: Convert the text content to bytes using UTF-8 encoding
3. **Compute SHA-256**: Calculate the SHA-256 hash of the bytes
4. **Format as hex**: Convert the 32-byte hash to a 64-character hexadecimal string
5. **Add prefix**: Prefix the hex string with `sha256:` for clarity

### Pseudocode

```python
import hashlib

def compute_file_hash(file_path: str) -> str:
    """
    Compute SHA-256 hash of file content.
    Hash is computed from content only, not metadata.
    Returns hash in format: sha256:<64-char-hex-string>
    """
    with open(file_path, 'rb') as f:
        content_bytes = f.read()
    hash_bytes = hashlib.sha256(content_bytes).digest()
    hash_hex = hash_bytes.hex()
    return f"sha256:{hash_hex}"
```

### Critical Requirements

- **Consistency**: The same file MUST produce the same hash across different scan modes (full, update, resume)
- **Content-only**: Hash is computed from file content ONLY, not from metadata like mtime, permissions, or file size
- **Encoding**: File content is read as UTF-8 text before hashing (ensures consistency across different line ending conventions)
- **Error handling**: If file cannot be read (permission denied, file not found), log warning and skip the file

### Hash Format Validation

Valid hash format: `sha256:<64-character-hex-string>`

Examples:
- Valid: `sha256:a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd`
- Invalid: `a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd` (missing `sha256:` prefix)
- Invalid: `sha256:a1b2c3` (not 64 hex characters)

## Scan Modes

### Full Scan (`scan_mode: "full"`)

- **Purpose:** Analyze the entire codebase and generate complete documentation from scratch
- **Behavior:** All source files are analyzed, all documentation is regenerated
- **Scan State:** Creates new scan state file or overwrites existing state (with user confirmation)
- **Duration:** Longer execution time (scales with codebase size)

**Example State:**
```json
{
  "scan_mode": "full",
  "files_scanned": [
    // All files in the codebase
  ],
  "scan_status": "complete"
}
```

### Update Scan (`scan_mode: "update"`)

- **Purpose:** Incrementally update existing documentation based on files that changed since the last scan
- **Behavior:** Only changed files are re-analyzed, only affected documentation sections are updated
- **Scan State:** Updates existing scan state with new hashes for changed files
- **Duration:** Shorter execution time (scales with number of changed files)

**Example State:**
```json
{
  "scan_mode": "update",
  "files_scanned": [
    // Unchanged files (preserved from old state) + changed files (new hash)
  ],
  "scan_status": "complete"
}
```

### Resume Scan (`scan_mode: "resume"`)

- **Purpose:** Resume a scan that was interrupted before completion
- **Behavior:** Skips files already processed, continues from `last_completed_file`
- **Scan State:** Updates existing scan state, changes `scan_status` from `"interrupted"` to `"complete"`
- **Duration:** Duration equals remaining work after interruption point

**Example State (Interrupted):**
```json
{
  "scan_mode": "resume",
  "files_scanned": [
    // Files processed before interruption
  ],
  "scan_status": "interrupted",
  "last_completed_file": "src/billing/invoice.ts"
}
```

**Example State (Resumed and Completed):**
```json
{
  "scan_mode": "resume",
  "files_scanned": [
    // All files (pre-interruption + post-resumption)
  ],
  "scan_status": "complete"
  // last_completed_file removed
}
```

## Scan Status Values

### Complete (`scan_status: "complete"`)

- **Meaning:** Scan finished successfully, all analysis steps completed
- **Field Presence:** `last_completed_file` is **omitted** (only needed for interrupted scans)
- **Next Actions:** Can run update mode (`--update` flag) or new full scan

### Interrupted (`scan_status: "interrupted"`)

- **Meaning:** Scan was stopped before completion (user cancellation, context limit, error, system crash)
- **Field Presence:** `last_completed_file` is **required** (indicates resume point)
- **Next Actions:** Next run automatically resumes from `last_completed_file`

**Interruption Scenarios:**

| Scenario | Detection | Recovery |
|---|---|---|
| User cancellation (Ctrl+C) | SIGINT signal caught | Set status to "interrupted", write state file |
| Context window limit | Token count exceeds limit | Set status to "interrupted", write state file |
| Unexpected error | Exception during analysis | Set status to "interrupted", write state file |
| System crash | No detection (crash is immediate) | State file has last incremental write |

## Incremental State Updates

### Update Frequency

The scan state file is updated **incrementally during the scan**, not only at the end:

1. **After business logic analysis:** Update `files_scanned` with files from Step 5.1
2. **After workflow analysis:** Update `files_scanned` with files from Step 5.2
3. **After domain model analysis:** Update `files_scanned` with files from Step 5.3
4. **After each file processing:** Update `last_completed_file` (for resumption)

### Incremental Write Pattern

Each incremental update uses atomic writes to prevent corruption:

```python
def incremental_state_update(scan_state: ScanState, new_files: List[FileEntry]) -> None:
    # Append new files to files_scanned array
    scan_state.files_scanned.extend(new_files)

    # Update last_completed_file
    scan_state.last_completed_file = new_files[-1].path

    # Write state atomically
    temp_path = "docs/generated/.scan-state.json.tmp"
    target_path = "docs/generated/.scan-state.json"

    write_file(temp_path, json.dumps(scan_state, indent=2))
    rename_file(temp_path, target_path)
```

### Benefits of Incremental Updates

- **Progress Preservation:** If scan is interrupted, progress up to last incremental write is preserved
- **Resume Capability:** `last_completed_file` indicates exactly where to resume
- **Data Integrity:** Atomic writes ensure state file is never corrupted

## Lifecycle Management

### Creation

- **Trigger:** First full scan execution (`/scrum-create-project-docs`)
- **Location:** `docs/generated/.scan-state.json`
- **Initial Status:** `"complete"` or `"interrupted"` (if scan fails)

### Updates

- **Full Scan:** Overwrites existing state (with user confirmation if previous state exists)
- **Update Scan:** Updates existing state with new hashes for changed files
- **Resume Scan:** Continues from `last_completed_file`, changes status to `"complete"`

### Deletion

- **Trigger:** User runs full scan with existing state and confirms reset
- **Action:** Delete existing state file, create new state file
- **Confirmation:** User must confirm: "Existing scan state found. Full scan will reset the state. Continue? [y/N]"

### Regeneration

- **Trigger:** State file is deleted or corrupted
- **Action:** Run full scan (`/scrum-create-project-docs` without `--update` flag)
- **Result:** New state file created from scratch

## Validation Rules

### JSON Validation

- State file must be valid JSON
- All required fields must be present
- Field types must match schema
- Enum values must be valid (`scan_mode`, `scan_status`)

### Hash Validation

- All hashes must be in format `sha256:<64-char-hex>`
- Hash must be 70 characters total (6 for prefix + 64 for hex)
- Hex characters must be lowercase (a-f, 0-9)

### Path Validation

- All paths must be relative to project root
- All paths must use forward slashes (`/`) regardless of OS
- All paths must point to existing files (at time of scan)

### Timestamp Validation

- All timestamps must be ISO 8601 format
- All timestamps must be UTC timezone (Z suffix)
- All timestamps must be chronologically consistent (file timestamps <= scan_date)

### Duration Validation

- `scan_duration` must be non-negative
- `scan_duration` can be decimal (sub-second precision)
- `scan_duration` should be reasonable (not negative, not extremely large)

## Error Handling

### Corrupted State File

If state file exists but is corrupted (invalid JSON):

```
Error: Scan state file is corrupted or invalid.
Run '/scrum-create-project-docs' (without --update) first to perform a full scan and regenerate scan state.
```

**Recovery:** Delete corrupted state file, run full scan

### Missing State File (Update Mode)

If state file does not exist in update mode:

```
Warning: No previous scan state found at 'docs/generated/.scan-state.json'. Running full scan.
```

**Recovery:** Fallback to full scan mode

### Hash Computation Failure

If file cannot be hashed (permission denied, file not found):

```
Warning: Cannot compute hash for file 'path/to/file': PERMISSION_DENIED. Skipping file.
```

**Recovery:** Log warning, skip file, continue with remaining files

## Integration with Git

### .gitignore Entry

State file is excluded from version control:

```
# Scan state files (local, not committed)
docs/generated/.scan-state.json
docs/generated/.arch-scan-state.json
```

### Rationale for Exclusion

- **File hashes change constantly:** Every code change changes hashes, causing constant merge conflicts
- **Local development artifact:** State is specific to local development environment
- **Regenerable:** State can be regenerated by running a full scan
- **Not source code:** State is derived metadata, not source code

### First Run Setup

On first scan, if `.gitignore` exists:

1. Check if scan state entries are present
2. If entries are NOT present, append them to `.gitignore`
3. Print message: "Added scan state files to .gitignore (scan state is local, not committed to git)"

## References

- **Story 6.6:** Incremental Update Mode (uses scan state for change detection)
- **Story 6.7:** Scan State Management & Resume Capability (defines and implements scan state)
- **Workflow File:** `scrum_workflow/workflows/project-documentation.md` (Step 7: Scan State Persistence)
- **Command File:** `scrum_workflow/commands/create-project-docs.md` (triggered by `/scrum-create-project-docs`)
