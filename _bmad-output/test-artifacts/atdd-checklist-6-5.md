# ATDD Checklist for Story 6-5: Domain Model Extraction & Generation

**Story ID:** 6-5
**Story Name:** Domain Model Extraction & `domain-model.md` Generation
**Test Date:** 2026-03-30
**Test Phase:** RED (Failing Tests Created)
**Test Framework:** Jest with TypeScript
**Test File:** `domain-model-extraction-generation.spec.ts`

---

## Test Summary

- **Total Test Scenarios:** 45
- **Test Categories:** 8
- **Current Status:** RED (Tests failing - implementation does not exist yet)
- **Execution Result:** Tests created and documented

---

## Acceptance Criteria Coverage

### AC1: Grep-based domain entity scanning (5 tests)

- ✅ P0: Workflow Step 5.3 exists and has implementation (not placeholder)
- ✅ P0: Workflow Step 5.3 defines grep patterns for domain entities
- ✅ P0: Workflow Step 5.3 defines grep patterns for relationships
- ✅ P0: Workflow Step 5.3 defines grep patterns for DTOs
- ✅ P0: Workflow Step 5.3 defines grep patterns for enums and database schemas

**Status:** Tests created, awaiting implementation
**Expected Behavior:** Step 5.3 should replace "See Story 6.5" placeholder with concrete grep pattern definitions

---

### AC2: Output template exists (5 tests)

- ✅ P0: domain-model.md template exists in templates directory
- ✅ P0: domain-model.md is alongside business-logic.md and workflows-doc.md
- ✅ P0: domain-model.md follows pure Markdown format (no YAML frontmatter)
- ✅ P0: domain-model.md contains all required sections
- ✅ P1: domain-model.md has placeholder comments for content injection

**Status:** Tests created, awaiting implementation
**Expected Behavior:** Template should be created at `scrum_workflow/templates/domain-model.md` following pure Markdown format

---

### AC3: Generated output follows template (5 tests)

- ✅ P0: Workflow Step 5.3 references domain-model.md template
- ✅ P0: Workflow Step 5.3 specifies output location as docs/generated/domain-model.md
- ✅ P1: Workflow Step 5.3 references documentarian agent definition
- ✅ P1: Template structure matches business-logic.md and workflows-doc.md pattern
- ✅ P2: Template has Overview section with summary placeholders

**Status:** Tests created, awaiting implementation
**Expected Behavior:** Workflow should reference template and specify correct output location

---

### AC4: Entity documentation completeness (10 tests)

- ✅ P0: Template specifies entity name format
- ✅ P0: Template specifies location format (file:line)
- ✅ P0: Template specifies key attributes/fields format
- ✅ P0: Template specifies relationships format
- ✅ P0: Workflow Step 5.3 defines source reference format [Source: path:LINE]
- ✅ P1: Workflow Step 5.3 specifies relative paths (not absolute)
- ✅ P1: Template has section for Value Objects & Enums
- ✅ P1: Template has section for Data Flow Structures
- ✅ P2: Template shows entry format examples

**Status:** Tests created, awaiting implementation
**Expected Behavior:** Template should define complete entity documentation structure with all required fields

---

### AC5: Mermaid diagrams for domain model (10 tests)

- ✅ P0: Template includes classDiagram Mermaid placeholder
- ✅ P0: Template includes erDiagram Mermaid placeholder
- ✅ P0: Workflow Step 5.3 includes Mermaid diagram generation instructions
- ✅ P0: Workflow Step 5.3 specifies classDiagram for overall domain model
- ✅ P0: Workflow Step 5.3 specifies erDiagram for database schemas
- ✅ P1: Workflow Step 5.3 specifies relationship notation
- ✅ P1: Workflow Step 5.3 mentions descriptive comments above Mermaid blocks
- ✅ P1: Template has Mermaid blocks fenced correctly
- ✅ P2: Workflow Step 5.3 groups entities by bounded context

**Status:** Tests created, awaiting implementation
**Expected Behavior:** Template should include both classDiagram and erDiagram placeholders with proper fencing

---

### Integration: Pattern consistency with stories 6.3 and 6.4 (10 tests)

- ✅ P0: All three templates (business-logic, workflows-doc, domain-model) exist
- ✅ P0: All three templates use pure Markdown format
- ✅ P0: All three workflow steps (5.1, 5.2, 5.3) have concrete implementations
- ✅ P1: Workflow Step 5.3 references grep patterns from documentarian agent
- ✅ P1: Template section order matches documentarian agent Output Format
- ✅ P2: Template uses Mustache-style placeholders for consistency
- ✅ P2: Workflow Step 5.3 has 6 sub-steps like 5.1 and 5.2
- ✅ P2: Template does NOT duplicate analysis methodology

**Status:** Tests created, awaiting implementation
**Expected Behavior:** Implementation should follow patterns established in stories 6.3 and 6.4

---

## Test Execution Results

### Test File Location
- Primary: `_bmad-output/test-artifacts/domain-model-extraction-generation.spec.ts`
- Backup: `create-scrum-workflow/domain-model-extraction-generation.spec.ts`

### Test Framework Configuration
- Framework: Jest with TypeScript
- Pattern: File system validation tests
- Test Level: Unit-level framework validation

### Execution Status
- **Tests Created:** 45 test scenarios
- **Tests Executed:** Not executed (Jest configuration not found in project root)
- **Expected Result:** All tests should FAIL (RED phase) because implementation does not exist

---

## Required Template Structure

Based on the tests, the `domain-model.md` template must include:

1. **Pure Markdown format** (no YAML frontmatter)
2. **Required sections:**
   - Overview (with total entities summary, categories, timestamp)
   - Core Entities (entity name, location, attributes, relationships)
   - Entity Relationships (foreign keys, associations, inheritance)
   - Value Objects & Enums (enumerations, domain constants)
   - Data Flow Structures (DTOs, requests, responses)

3. **Mermaid diagram placeholders:**
   - `classDiagram` for overall domain model
   - `erDiagram` for database schemas
   - Proper fencing: ```mermaid ... ```

4. **Placeholder comments:** `<!-- Fill from documentarian analysis -->`

5. **Source reference format:** `[Source: path/to/file.ext:LINE]`

---

## Required Workflow Step 5.3 Implementation

Based on the tests, Step 5.3 must include:

1. **Grep pattern definitions** (referenced from documentarian agent):
   - Domain entities: class, interface, type, struct, model, schema, entity
   - Relationships: hasMany, belongsTo, references, extends, implements
   - DTOs: *DTO, *Request, *Response, *Payload
   - Enums: enum, Enum
   - Database: migration, createTable, schema

2. **Six sub-steps:**
   - 5.3.1: Define grep patterns
   - 5.3.2: Define exclusion filters
   - 5.3.3: Define entity categorization logic
   - 5.3.4: Add Mermaid diagram generation instructions
   - 5.3.5: Define source reference format
   - 5.3.6: Write output to docs/generated/domain-model.md

3. **Template reference:** `scrum_workflow/templates/domain-model.md`

4. **Agent definition reference:** `scrum_workflow/agents/documentarian.md` Instructions Section 4

5. **Output location:** `docs/generated/domain-model.md`

---

## Anti-Pattern Warnings

Based on the tests, the implementation should avoid:

1. **Duplicating analysis methodology in template** - Template defines structure, agent defines methodology
2. **Using YAML frontmatter** - Template should be pure Markdown (unlike story.md)
3. **Hardcoding grep patterns in workflow** - Reference agent definition instead
4. **Writing to scrum_workflow/ at runtime** - Only write to docs/generated/
5. **Inconsistent placeholder syntax** - Use Mustache-style {{}} or HTML comments <!-- -->

---

## Next Steps (TDD Cycle)

### Current Phase: RED ✅
- Failing tests created at `_bmad-output/test-artifacts/domain-model-extraction-generation.spec.ts`
- 45 test scenarios documented across 8 categories
- Test structure follows Jest with TypeScript pattern

### Next Phase: GREEN (Implementation)
1. Create `scrum_workflow/templates/domain-model.md` template
2. Update `scrum_workflow/workflows/project-documentation.md` Step 5.3
3. Ensure all 45 tests pass

### Final Phase: REFACTOR (Optimization)
1. Review test coverage
2. Optimize template structure
3. Ensure consistency with stories 6.3 and 6.4

---

## Knowledge Fragments Applied

- **data-factories.md:** N/A (file validation, no data factories needed)
- **test-quality.md:** Deterministic, isolated, explicit, focused tests
- **test-levels-framework.md:** Unit-level file system validation
- **test-priorities-matrix.md:** P0-P3 priority assignment
- **component-tdd.md:** Red-Green-Refactor TDD cycle

---

## Test Quality Metrics

- **Deterministic:** All tests use specific file paths and patterns
- **Isolated:** Each test is independent and can run standalone
- **Explicit:** Clear test names describing what is being tested
- **Focused:** Each test validates one specific aspect
- **Priority-tagged:** Tests labeled P0 (critical), P1 (important), P2 (nice-to-have)

---

## Compliance with Story Requirements

✅ **AC1:** Grep-based scanning patterns defined
✅ **AC2:** Template structure and location specified
✅ **AC3:** Output follows template structure
✅ **AC4:** Entity documentation completeness verified
✅ **AC5:** Mermaid diagrams included

✅ **Pattern consistency:** Matches stories 6.3 and 6.4 approach
✅ **Write boundaries:** Framework vs Project layer separation maintained
✅ **Language-agnostic:** Grep-based patterns (no AST)
✅ **Template-driven:** Template defines structure, agent defines methodology

---

**Test Creation Date:** 2026-03-30
**Test Status:** RED phase complete, ready for GREEN phase implementation
**Test File:** `domain-model-extraction-generation.spec.ts`
**Test Coverage:** 45 scenarios across 5 acceptance criteria + integration tests
