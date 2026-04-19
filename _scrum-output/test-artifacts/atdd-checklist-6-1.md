---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-04c-aggregate
  - step-05-validate-and-complete
lastStep: step-05-validate-and-complete
lastSaved: '2026-04-08'
inputDocuments:
  - _scrum-output/implementation-artifacts/6-1-implement-cli-output-color-emoji-system.md
  - create-scrum-workflow/package.json
  - create-scrum-workflow/vitest.config.js
  - create-scrum-workflow/src/commands/validate.js
  - create-scrum-workflow/src/commands/status.js
  - create-scrum-workflow/test/unit/cli-update/ac1-version-detection-and-breaking-changes.test.js
  - create-scrum-workflow/test/atdd/story-1-6-installation-onboarding.test.js
---

# ATDD Checklist: Story 6.1 - Implement CLI Output Color & Emoji System

## TDD Red Phase (Current)

**Status:** RED -- All tests use test.skip() and will fail until implementation is complete.

- **Total Tests:** 48 (all skipped via test.skip())
- **Test Files:** 4
- **Test Level:** Unit
- **Test Framework:** Vitest ^3.0.0
- **Stack:** Backend (Node.js CLI)

## Acceptance Criteria Coverage

### AC1: Semantic Colors (UX-DR6)

- **File:** `create-scrum-workflow/test/unit/output/ac1-semantic-colors.test.js`
- **Tests:** 10 (all P0/P1)
- **Coverage:**
  - output.success() applies green color
  - output.warning() applies yellow color
  - output.error() applies red color
  - output.info() applies cyan color
  - Each function uses ONLY its designated color (no cross-contamination)
  - Module imports picocolors
  - Module references isColorSupported/NO_COLOR/TERM=dumb

### AC2: Emoji Prefixes (UX-DR7)

- **File:** `create-scrum-workflow/test/unit/output/ac2-emoji-prefixes.test.js`
- **Tests:** 9 (all P0/P1)
- **Coverage:**
  - output.success() prefixes with checkmark (checkmark)
  - output.warning() prefixes with warning (warning)
  - output.error() prefixes with cross (cross)
  - output.info() prefixes with info (info)
  - Each function uses ONLY its designated emoji (no cross-contamination)
  - Emoji appears before message text (position verification)

### AC3: Consistent Color & Emoji Across All Outputs (UX-DR13, UX-DR15)

- **File:** `create-scrum-workflow/test/unit/output/ac3-consistency.test.js`
- **Tests:** 14 (P0/P1/P2)
- **Coverage:**
  - Module exports all four functions
  - All functions produce output when called
  - All functions follow same format: emoji + colored message
  - validate.js imports and uses output module
  - status.js imports and uses output module
  - No raw pc.green/pc.red/pc.yellow for status messages (post-migration)
  - No hardcoded ANSI escape codes
  - Output module exists in both src/core/ and templates/src/core/

### AC4: Single Line Per Message (UX-DR9)

- **File:** `create-scrum-workflow/test/unit/output/ac4-single-line-format.test.js`
- **Tests:** 15 (P0/P1)
- **Coverage:**
  - Each function produces exactly one console.log call
  - No embedded newlines in output
  - Output format: emoji + space + colored message
  - NO_COLOR env variable is respected
  - Emoji preserved when colors are disabled
  - Sequential calls produce consistent format
  - All output goes through console.log (not console.error/warn)

## Priority Distribution

| Priority | Count |
|----------|-------|
| P0       | 22    |
| P1       | 23    |
| P2       | 3     |
| **Total**| **48**|

## Test Run Results (RED Phase Verification)

```
RUN  v3.2.4

test/unit/output/ac1-semantic-colors.test.js (10 tests | 10 skipped)
test/unit/output/ac4-single-line-format.test.js (15 tests | 15 skipped)
test/unit/output/ac2-emoji-prefixes.test.js (9 tests | 9 skipped)
test/unit/output/ac3-consistency.test.js (14 tests | 14 skipped)

Test Files  4 skipped (4)
     Tests  48 skipped (48)
  Duration  412ms
```

All tests correctly in RED phase (skipped via test.skip()).

## Next Steps (TDD Green Phase)

After implementing the feature:

1. Remove `test.skip()` from all test files (or replace with `test()`)
2. Run tests: `cd create-scrum-workflow && npx vitest run test/unit/output/`
3. Verify tests PASS (green phase)
4. If any tests fail:
   - Either fix implementation (feature bug)
   - Or fix test (test bug)
5. Commit passing tests

## Implementation Guidance

### Feature to implement:

Create `create-scrum-workflow/src/core/output.js`:

```
output.success(msg)  -> checkmark + green message
output.warning(msg)  -> warning + yellow message
output.error(msg)    -> cross + red message
output.info(msg)     -> info + cyan message
```

### Key design decisions:
- Use picocolors (already installed) for color application
- Emoji prefixes are ALWAYS shown (plain text, not terminal-dependent)
- picocolors natively handles NO_COLOR via pc.isColorSupported
- All output goes through console.log
- Single line per message: emoji + space + colored text

### Files to modify after creating output.js:
- `src/commands/validate.js` -- migrate to output module
- `src/commands/status.js` -- migrate to output module
- `src/commands/install.js` -- migrate static messages
- `src/commands/update.js` -- migrate static messages
- `src/core/installer.js` -- migrate static messages
- `src/core/config-builder.js` -- migrate static messages
- Sync copies to `templates/` directory
