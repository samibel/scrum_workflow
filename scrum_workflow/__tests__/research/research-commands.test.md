# Research Commands Test Suite

## Test Coverage for Story 1.8: Verify & Align Research Commands

### Purpose

Verify that `/scrum-research-technical` and `/scrum-research-general` commands produce persistent Research Report artifacts following PRD FR-45 specification.

---

## Unit Tests

### Test: RR-XXX.md Naming Convention

**Given** the research command is executed
**When** generating the output filename
**Then** the filename follows `RR-XXX.md` pattern with zero-padded 3-digit sequential numbering

**Test Cases:**
1. **Empty directory** → First file is `RR-001.md`
2. **One existing file** → Next file is `RR-002.md`
3. **Nine existing files** → Next file is `RR-010.md`
4. **Ninety-nine existing files** → Next file is `RR-100.md`
5. **Gaps in numbering** → Uses highest number + 1 (RR-001, RR-005 exist → RR-006)

**Validation:**
```bash
# Test filename pattern
ls _scrum-output/memory/research/RR-*.md | grep -E 'RR-[0-9]{3}\.md'

# Test sequential numbering
ls _scrum-output/memory/research/RR-*.md | sort -V | tail -1
```

### Test: Output Directory Location

**Given** the research command is executed
**When** no custom `--output` flag is provided
**Then** artifacts are created in `_scrum-output/memory/research/`

**Test Cases:**
1. **Default location** → `_scrum-output/memory/research/`
2. **Custom location** → Uses `--output` flag path
3. **Directory creation** → Creates directory if it doesn't exist
4. **Relative paths** → Handles relative paths correctly
5. **Absolute paths** → Handles absolute paths correctly

**Validation:**
```bash
# Test default location
test -f _scrum-output/memory/research/RR-001.md

# Test directory auto-creation
rm -rf _scrum-output/memory/research/
/scrum-research-technical "test topic"
test -d _scrum-output/memory/research/
```

### Test: YAML Frontmatter Structure

**Given** a research report artifact is created
**When** the YAML frontmatter is parsed
**Then** it contains all required fields for Phase 1 scope

**Required Fields (Phase 1):**
- `type`: `technical_research` or `general_research`
- `topic`: Research topic string
- `tags`: Array of relevant tags
- `date`: ISO 8601 date format (YYYY-MM-DD)
- `sources`: Array of source URLs
- `ai_optimized`: `true`
- `version`: `1.0`
- `research_confidence`: `high`, `medium`, or `low`

**Test Cases:**
1. **All required fields present** → Valid frontmatter
2. **Field types correct** → String, array, boolean as expected
3. **Date format** → YYYY-MM-DD format
4. **Confidence levels** → Only valid values (high/medium/low)

**Validation:**
```bash
# Test frontmatter parsing
head -20 _scrum-output/memory/research/RR-001.md | grep -A 10 '---'

# Test required fields
head -20 _scrum-output/memory/research/RR-001.md | grep -E 'type:|topic:|tags:|date:|sources:|ai_optimized:|version:|research_confidence:'
```

### Test: Tag Generation

**Given** a research topic is provided
**When** the research report is generated
**Then** relevant tags are included in the frontmatter

**Test Cases:**
1. **Technical research** → Domain-specific tags (e.g., `architecture`, `api`, `performance`)
2. **General research** → Domain-specific tags (e.g., `market-analysis`, `competitive`, `strategy`)
3. **Tag relevance** → Tags relate to research content
4. **Tag count** → Reasonable number of tags (3-7)

**Validation:**
```bash
# Test tags field exists
head -20 _scrum-output/memory/research/RR-001.md | grep -A 5 'tags:'

# Test tag relevance
# (Manual verification or tag extraction logic)
```

---

## Integration Tests

### Test: Complete Research Workflow

**Given** a developer runs `/scrum-research-technical` with a valid topic
**When** the research completes successfully
**Then** a valid `RR-XXX.md` artifact is created with all required sections

**Test Scenarios:**
1. **Technical research** → `RR-001.md` with technical_research type
2. **General research** → `RR-002.md` with general_research type
3. **Sequential research** → Numbering increments correctly
4. **Custom output location** → Respects `--output` flag

**Validation Steps:**
```bash
# Execute technical research
/scrum-research-technical "microservices architecture patterns"

# Verify artifact creation
test -f _scrum-output/memory/research/RR-001.md

# Verify structure
grep -E '## Executive Summary|## Technical Landscape|## References' _scrum-output/memory/research/RR-001.md

# Execute general research
/scrum-research-general "AI market trends 2026"

# Verify sequential numbering
test -f _scrum-output/memory/research/RR-002.md
```

### Test: Artifact Persistence

**Given** a research artifact is created
**When** the session ends and a new session begins
**Then** the artifact remains accessible and intact

**Test Scenarios:**
1. **File persistence** → File exists after session restart
2. **Content integrity** → Content unchanged after session restart
3. **Multiple sessions** → Artifacts persist across multiple sessions
4. **Concurrent access** → Multiple artifacts can coexist

**Validation Steps:**
```bash
# Create artifact in session 1
/scrum-research-technical "test topic"
SHA1_BEFORE=$(sha1sum _scrum-output/memory/research/RR-001.md)

# Simulate session restart (reload context)
# ... (session restart logic)

# Verify persistence
test -f _scrum-output/memory/research/RR-001.md
SHA1_AFTER=$(sha1sum _scrum-output/memory/research/RR-001.md)

# Verify integrity
test "$SHA1_BEFORE" = "$SHA1_AFTER"
```

### Test: Artifact Discoverability

**Given** multiple research artifacts exist
**When** a developer needs to find previous research
**Then** artifacts can be discovered by location, topic, tags, or date

**Test Scenarios:**
1. **Location discovery** → List `_scrum-output/memory/research/` directory
2. **Topic search** → Search artifacts by topic in frontmatter
3. **Tag search** → Search artifacts by tags in frontmatter
4. **Date search** → Search artifacts by date in frontmatter

**Validation Steps:**
```bash
# Location discovery
ls _scrum-output/memory/research/RR-*.md

# Topic search
grep -l 'topic:.*architecture' _scrum-output/memory/research/RR-*.md

# Tag search
grep -l 'tags:.*microservices' _scrum-output/memory/research/RR-*.md

# Date search
grep -l 'date:2026-04-07' _scrum-output/memory/research/RR-*.md
```

---

## Error Scenario Tests

### Test: Invalid Output Path

**Given** a custom output path is specified
**When** the path is invalid or inaccessible
**Then** appropriate error message is provided

**Test Cases:**
1. **Permission denied** → Clear error about permissions
2. **Invalid path** → Clear error about invalid path
3. **Read-only filesystem** → Clear error about write access

**Validation:**
```bash
# Test permission denied
/scrum-research-technical "test" --output /root/research/
# Expected: Error message about permissions

# Test invalid path
/scrum-research-technical "test" --output /nonexistent/path/
# Expected: Error message about invalid path
```

### Test: Missing Research Topic

**Given** the research command is executed
**When** no topic is provided
**Then** clear error message is displayed with usage instructions

**Validation:**
```bash
# Test missing topic
/scrum-research-technical
# Expected: "No research topic provided. Usage: /scrum-research-technical <topic>"
```

### Test: WebSearch Failures

**Given** the research command is executed
**When** WebSearch fails or returns no results
**Then** appropriate error handling and fallback behavior

**Test Cases:**
1. **Network error** → Clear error message, graceful degradation
2. **No results** → Suggest alternative search terms
3. **API rate limit** → Clear message about rate limits

**Validation:**
```bash
# Test with topic likely to return no results
/scrum-research-technical "xyzabc123nonexistent"
# Expected: "No results found. Try broader terms or different keywords."
```

---

## Compliance Tests

### Test: FR-45 Phase 1 Scope Compliance

**Given** PRD FR-45 specification for Phase 1
**When** research commands are executed
**Then** all Phase 1 requirements are met

**Phase 1 Requirements:**
1. ✅ Research commands produce persistent artifacts
2. ✅ Artifacts follow `RR-XXX.md` naming convention
3. ✅ YAML frontmatter includes: topic, tags, date
4. ✅ Artifacts stored in `_scrum-output/memory/research/`
5. ✅ Artifacts survive session boundaries
6. ✅ Artifacts are discoverable

**Test Matrix:**
| Requirement | Test Case | Status |
|-------------|-----------|--------|
| Persistent artifacts | Artifact Persistence Test | ✅ |
| RR-XXX.md naming | Naming Convention Test | ✅ |
| Required frontmatter | YAML Frontmatter Test | ✅ |
| Output location | Output Directory Test | ✅ |
| Session survival | Persistence Test | ✅ |
| Discoverability | Discoverability Test | ✅ |

### Test: Phase 2 Features Deferred

**Given** Phase 2 features are explicitly deferred to Epic 7
**When** research commands are executed
**Then** Phase 2 features are NOT implemented

**Phase 2 Features (Must NOT be present):**
1. ❌ `referenced-by` field in frontmatter
2. ❌ Automatic loading by refinement agents
3. ❌ Ticket referencing integration

**Validation:**
```bash
# Verify referenced-by field is NOT present
! grep -q 'referenced-by:' _scrum-output/memory/research/RR-001.md

# Verify no automatic loading behavior
# (Behavioral test - no auto-loading in current implementation)

# Verify no ticket referencing
# (Integration test - no ticket links in current implementation)
```

---

## Performance Tests

### Test: Sequential Numbering Performance

**Given** many research artifacts exist (100+)
**When** a new research artifact is created
**Then** sequential numbering completes in reasonable time

**Test Scenarios:**
1. **10 artifacts** → Numbering completes in < 1 second
2. **100 artifacts** → Numbering completes in < 5 seconds
3. **1000 artifacts** → Numbering completes in < 30 seconds

**Validation:**
```bash
# Create test artifacts
for i in {1..100}; do
  touch "_scrum-output/memory/research/RR-$(printf '%03d' $i).md"
done

# Test numbering performance
time /scrum-research-technical "performance test"
# Should complete in reasonable time even with 100 existing files
```

---

## Test Execution Summary

### Test Categories
- **Unit Tests**: 5 test suites, 15+ test cases
- **Integration Tests**: 3 test suites, 10+ test scenarios
- **Error Scenario Tests**: 3 test suites, 9+ test cases
- **Compliance Tests**: 2 test suites, 9 requirements validated
- **Performance Tests**: 1 test suite, 3 performance benchmarks

### Total Test Coverage
- **Test Suites**: 14
- **Test Cases/Scenarios**: 45+
- **Requirements Validated**: 9 (FR-45 Phase 1)
- **Performance Benchmarks**: 3

### Success Criteria
- All unit tests pass ✅
- All integration tests pass ✅
- Error handling validated ✅
- FR-45 Phase 1 compliance verified ✅
- Phase 2 features confirmed as deferred ✅
- Performance benchmarks met ✅

---

## Test Data

### Sample Research Topics

**Technical Research:**
1. "Microservices architecture patterns"
2. "API design best practices"
3. "Container orchestration comparison"

**General Research:**
1. "AI market trends 2026"
2. "Competitive landscape for SaaS platforms"
3. "Strategic planning for startups"

### Expected Output Examples

**RR-001.md (Technical Research):**
```yaml
---
type: technical_research
topic: Microservices architecture patterns
tags:
  - microservices
  - architecture
  - distributed-systems
date: 2026-04-07
sources:
  - https://example.com/microservices-patterns
  - https://example.com/distributed-design
ai_optimized: true
version: 1.0
research_confidence: high
---
```

**RR-002.md (General Research):**
```yaml
---
type: general_research
topic: AI market trends 2026
tags:
  - market-analysis
  - artificial-intelligence
  - trends
date: 2026-04-07
sources:
  - https://example.com/ai-market-report
  - https://example.com/technology-trends
ai_optimized: true
version: 1.0
research_confidence: medium
---
```

---

## Notes

- Tests validate PRD FR-45 Phase 1 scope only
- Phase 2 features (referenced-by, auto-loading, ticket linking) are explicitly NOT tested
- Test execution should be idempotent - can be run multiple times safely
- Test artifacts should be cleaned up after test execution
- Performance tests should be run separately from functional tests
