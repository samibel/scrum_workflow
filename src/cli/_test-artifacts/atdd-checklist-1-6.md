---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-04c-aggregate
  - step-05-validate-and-complete
lastStep: step-05-validate-and-complete
lastSaved: '2026-04-07T20:04:00Z'
inputDocuments:
  - _scrum-output/implementation-artifacts/1-6-verify-align-installation-onboarding.md
  - _scrum-output/planning-artifacts/prd.md
  - test/atdd/story-1-6-installation-onboarding.test.js
---

# ATDD Checklist: Story 1.6 - Installation & Onboarding

## TDD Red Phase (Current)

**Status: RED** - All tests use `test.skip()` and will FAIL until implementation meets PRD specs.

### Test Summary

| Test Level | Count | Status |
|------------|-------|--------|
| Unit Tests | 0 | N/A (CLI installer uses integration-style tests) |
| Integration Tests | 22 | RED (all skipped) |
| E2E Tests | 0 | N/A (no browser testing needed) |
| **Total** | **22** | **All RED** |

---

## Acceptance Criteria Coverage

### AC1: Delta Analysis

| Criterion | Test Coverage | Status |
|-----------|---------------|--------|
| Delta analysis documents matches | Integration: Full flow test | RED |
| Delta analysis documents divergences | Integration: Full flow test | RED |
| Delta analysis documents missing features | Integration: Full flow test | RED |

### AC2: FR-41 Compliance (Installation Timing)

| Criterion | Test Coverage | Status |
|-----------|---------------|--------|
| Installation completes in under 5 minutes | `test.skip('[P0] should complete installation in under 5 minutes')` | RED |
| CLI auto-detects AI platform | `test.skip('[P0] should auto-detect Claude Code platform')` | RED |
| All framework files copied correctly | `test.skip('[P0] should copy all framework directories to target')` | RED |
| All framework directories created | `test.skip('[P0] should copy all required framework files')` | RED |

### AC3: FR-42 Compliance (First Ticket Guidance)

| Criterion | Test Coverage | Status |
|-----------|---------------|--------|
| Success message includes actionable next-step | `test.skip('[P0] should include actionable next-step command in success message')` | RED |
| Next-step command is copy-pasteable | `test.skip('[P0] should provide copy-pasteable next-step command')` | RED |
| Developer can run /scrum-create-ticket without docs | `test.skip('[P0] should enable first ticket creation without documentation')` | RED |

### SC-9: First Ticket Within 30 Minutes

| Criterion | Test Coverage | Status |
|-----------|---------------|--------|
| Time-to-first-value capability | `test.skip('[P2] should measure time-to-first-value capability')` | RED |

### SC-10: Zero-Knowledge Onboarding

| Criterion | Test Coverage | Status |
|-----------|---------------|--------|
| Create ticket without documentation | `test.skip('[P0] should enable first ticket creation without documentation')` | RED |
| Refine ticket without documentation | `test.skip('[P0] should enable first ticket refinement without documentation')` | RED |
| Guidance eliminates need for docs | `test.skip('[P1] should provide guidance that eliminates need for documentation')` | RED |

---

## Test Priorities

### P0 Tests (Critical - Must Pass for MVP)

1. `[P0] should complete installation in under 5 minutes`
2. `[P0] should auto-detect Claude Code platform`
3. `[P0] should copy all framework directories to target`
4. `[P0] should copy all required framework files`
5. `[P0] should include actionable next-step command in success message`
6. `[P0] should provide copy-pasteable next-step command`
7. `[P0] should enable first ticket creation without documentation`
8. `[P0] should enable first ticket refinement without documentation`
9. `[P0] should complete full installation flow successfully`
10. `[P0] should pass post-install verification`

### P1 Tests (Major - Important for Quality)

1. `[P1] should track installation timing metrics`
2. `[P1] should auto-detect Cursor platform`
3. `[P1] should auto-detect Windsurf platform`
4. `[P1] should provide clear feedback when platform detected`
5. `[P1] should verify file permissions are correct`
6. `[P1] should follow UX-DR2 one-line success with command hint`
7. `[P1] should suggest next-step command works immediately`
8. `[P1] should provide guidance that eliminates need for documentation`
9. `[P1] should provide actionable error for permission issues`
10. `[P1] should provide actionable error for disk space issues`

### P2 Tests (Minor - Polish & Edge Cases)

1. `[P2] should handle unknown platform gracefully`
2. `[P2] should handle existing files gracefully`
3. `[P2] should measure time-to-first-value capability`
4. `[P2] should provide recovery steps for common failures`

---

## Implementation Guidance

### Feature Endpoints/Functions to Verify

Based on the ATDD tests, the following implementation areas need verification:

1. **Installation Timing (FR-41)**
   - `Installer.run()` should complete in under 5 minutes
   - Consider adding `timingMetrics` property to track step durations

2. **Platform Auto-Detection (FR-41)**
   - `buildConfig()` should auto-detect environment
   - Check for: `CLAUDE_CODE`, `CURSOR_TRACE_ID`, `WINDSURF_SESSION` env vars
   - Provide clear feedback on detected platform

3. **Framework File Installation (FR-41)**
   - Verify all directories in `scrum_workflow/` are copied
   - Verify all required files are present
   - Verify file permissions are correct

4. **Success Message (FR-42)**
   - Update `outro()` message to include actionable next-step
   - Include copy-pasteable command: `/scrum-create-ticket`
   - Follow UX-DR2: one-line success with command hint

5. **Zero-Knowledge Onboarding (SC-9, SC-10)**
   - Verify `/scrum-create-ticket` skill is installed
   - Verify `/scrum-refine-ticket` skill is installed
   - Consider adding `onboardingMetrics` to track capabilities

6. **Error Handling**
   - Provide actionable error messages for common failures
   - Include recovery steps (numbered list)
   - Avoid documentation references in errors

---

## Next Steps (TDD Green Phase)

After implementing the verification fixes:

1. Remove `test.skip()` from all test files
2. Run tests: `npm test`
3. Verify tests PASS (green phase)
4. If any tests fail:
   - Either fix implementation (feature bug)
   - Or fix test (test bug)
5. Commit passing tests

---

## Files Generated

| File | Type | Description |
|------|------|-------------|
| `test/atdd/story-1-6-installation-onboarding.test.js` | Test | ATDD failing tests for Story 1.6 |
| `_test-artifacts/atdd-checklist-1-6.md` | Checklist | This document |

---

## Quality Metrics

- **Acceptance Criteria Coverage**: 100% (all 3 ACs covered)
- **PRD Requirements Coverage**: 100% (FR-41, FR-42, SC-9, SC-10)
- **Test Count**: 22 tests
- **P0 Tests**: 10 tests
- **P1 Tests**: 10 tests
- **P2 Tests**: 4 tests

---

## Notes

1. **Story 1.6 Status**: The story shows as "review" status, indicating implementation is complete. These ATDD tests are being generated to validate the implementation against PRD specs.

2. **Implementation Already Done**: Based on the story file, the following fixes were already made:
   - Success message updated in `install.js`
   - Next-step guidance added in `installer.js`

3. **Test Strategy**: Tests focus on integration-level verification since the installer is a CLI tool with file system interactions.

4. **YOLO Mode**: All tests generated with `test.skip()` for TDD red phase compliance.
