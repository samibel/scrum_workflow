# Status History Integration Guide

## Overview

Story 2.1 implements the `status_history` tracking mechanism that provides an append-only audit trail for all story status transitions. This guide explains how to integrate the status history functionality into existing workflows and commands.

## Core Functionality

The status history tracking is implemented in `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/src/core/status-history.js` with the following functions:

### Available Functions

1. **`generateTimestamp()`** - Generates ISO 8601 UTC timestamp
2. **`validateActorFormat(actor)`** - Validates actor identity patterns
3. **`ensureStatusHistoryExists(story)`** - Ensures status_history array exists (legacy support)
4. **`appendStatusHistory(story, from, to, trigger, actor)`** - Appends a new status history entry
5. **`detectManualEdit(story)`** - Detects manual status field edits

## Integration Pattern

### Basic Usage Pattern

```javascript
import {
  ensureStatusHistoryExists,
  appendStatusHistory,
  validateActorFormat
} from '../../src/core/status-history.js';

// 1. Load the story file
const story = loadStoryFile(ticketId);

// 2. Ensure status_history exists (for legacy stories)
const storyWithHistory = ensureStatusHistoryExists(story);

// 3. Get current and new status
const currentStatus = storyWithHistory.frontmatter.status;
const newStatus = 'refined'; // Example: transitioning to 'refined'
const trigger = '/scrum-refine-ticket'; // The command causing the transition
const actor = 'architect-agent'; // Who/what initiated the transition

// 4. Validate actor format (optional but recommended)
if (!validateActorFormat(actor)) {
  throw new Error(`Invalid actor format: ${actor}`);
}

// 5. Append status history entry
const updatedStory = appendStatusHistory(
  storyWithHistory,
  currentStatus,
  newStatus,
  trigger,
  actor
);

// 6. Update the status field
updatedStory.frontmatter.status = newStatus;
updatedStory.frontmatter.updated = generateTimestamp();

// 7. Write the updated story file atomically
writeStoryFile(ticketId, updatedStory);
```

## Actor Identity Patterns

According to the architecture specification, valid actor formats are:

- **`human`** - User actions (direct CLI commands)
- **`system`** - CLI/migration actions (automated processes)
- **`{name}-agent`** - Agent actions (e.g., `architect-agent`, `developer-agent`, `qa-agent`)
- **`{name}-skill`** - Skill actions (e.g., `readiness-check-skill`, `validation-skill`)

## Workflow Integration Points

### Commands That Modify Story Status

The following commands should integrate status_history tracking:

1. **`/scrum-create-ticket`** - Initial creation (already handled in template)
2. **`/scrum-refine-ticket`** - Refinement process
3. **`/scrum-refine-story`** - Story validation
4. **`/scrum-dev-story`** - Development start
5. **`/scrum-review-story`** - Code review
6. **`/scrum-approve`** - Approval process

### Example: /scrum-refine-ticket Integration

```markdown
## Step 5: Update Story Status

After refinement is complete, update the story status and append status history:

1. Load current story file from `_scrum-output/sprints/SW-XXX/story.md`
2. Parse YAML frontmatter to get current status
3. Call `appendStatusHistory()` with:
   - `from`: current status (e.g., 'draft')
   - `to`: new status (e.g., 'refined')
   - `trigger`: '/scrum-refine-ticket'
   - `actor`: 'architect-agent' (or appropriate agent)
4. Update `status` field in frontmatter
5. Update `updated` field with current timestamp
6. Write story file atomically
```

## Status Transition Valid States

According to the architecture specification, valid status transitions follow the 9-state lifecycle:

```
draft → refined → ready-for-dev → in-progress → review → approved → done
                                    ↓
                                 changes-needed → in-progress
```

Valid states: `draft`, `refined`, `ready-for-dev`, `in-progress`, `review`, `approved`, `done`, `changes-needed`, `cancelled`

## Manual Edit Detection

The `detectManualEdit()` function can be used to identify when the `status` field has been manually edited outside of the normal workflow:

```javascript
import { detectManualEdit } from '../../src/core/status-history.js';

const story = loadStoryFile(ticketId);
const detection = detectManualEdit(story);

if (detection.hasManualEdit) {
  console.warn(`Manual edit detected: ${detection.discrepancyMessage}`);
  console.warn(`Expected: ${detection.expectedStatus}, Actual: ${detection.actualStatus}`);
  // Handle the discrepancy appropriately
}
```

## Legacy Story Support

For stories created before v1.2.0 that may lack the `status_history` field:

```javascript
import { ensureStatusHistoryExists } from '../../src/core/status-history.js';

const story = loadStoryFile(ticketId);

// This will create the status_history array if it doesn't exist
const storyWithHistory = ensureStatusHistoryExists(story);

// Now safe to use appendStatusHistory
const updatedStory = appendStatusHistory(
  storyWithHistory,
  storyWithHistory.frontmatter.status,
  newStatus,
  trigger,
  actor
);
```

## Testing

All status_history functionality is tested in:

**Test File**: `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/create-scrum-workflow/test/atdd/story-2-1-status-history-tracking.test.js`

**Test Coverage**:
- 16 tests covering all acceptance criteria
- 100% AC coverage (AC1: Append mechanism, AC2: Actor patterns, AC3: Legacy handling, AC4: Manual edit detection)
- Tests run with: `npm test -- story-2-1`

**All tests currently passing**: ✅ 16/16 tests passing

## Error Handling

The status_history functions include error handling for common issues:

```javascript
// Invalid actor format
try {
  appendStatusHistory(story, 'draft', 'refined', '/scrum-refine-ticket', 'invalid-actor');
} catch (error) {
  console.error(error.message); // "Invalid actor format: "invalid-actor"..."
}

// Missing story object
try {
  appendStatusHistory(null, 'draft', 'refined', '/scrum-refine-ticket', 'architect-agent');
} catch (error) {
  console.error(error.message); // "Invalid story object: missing frontmatter"
}
```

## File Structure

```
create-scrum-workflow/
├── src/
│   └── core/
│       └── status-history.js        # Core implementation
├── test/
│   └── atdd/
│       └── story-2-1-status-history-tracking.test.js  # ATDD tests
└── scrum_workflow/
    └── templates/
        └── story.md                 # Story template with status_history
```

## Compliance with Architecture

This implementation complies with:

- **FR-7**: Append-only status_history array with timestamp, trigger command, and actor identity
- **FR-10**: Detection of manual status field edits
- **NFR1**: Atomic write operations (file integrity)
- **9-State Lifecycle**: Supports all valid status transitions
- **YAML Frontmatter Standard**: Compatible with story file schema v1.0.0

## Next Steps for Implementation

1. **Update workflow files** to use the status_history functions
2. **Add status_history tracking** to all commands that modify story status
3. **Update skill documentation** to include status_history operations
4. **Add integration tests** for end-to-end workflows with status_history
5. **Update documentation** to reflect the status_history audit trail capability

## Status

- ✅ Core status_history functions implemented and tested
- ✅ ATDD tests passing (16/16)
- ✅ Story template updated with status_history field
- 🔄 Workflow integration in progress
- 🔄 Skill integration pending

---

**Implementation Date**: 2026-04-08
**Story**: 2.1 - Implement Status History Tracking
**Status**: Core functionality complete, integration in progress
