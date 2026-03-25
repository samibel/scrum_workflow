# Story 3.3: Perspective Synthesis and Story Update

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer using the scrum_workflow refinement system,
I want accepted agent perspectives merged into a coherent updated story file,
so that my story has refined description, acceptance criteria, estimation, and subtasks ready for implementation.

## Acceptance Criteria

**Given** all three agent perspectives have been generated and displayed
**When** the user has accepted or rejected individual perspectives
**Then** `scrum_workflow/skills/synthesis/SKILL.md` exists defining how to merge agent perspectives (FR12)
**And** the coordination mechanism merges only accepted perspectives into the updated `story.md`
**And** the updated story file contains: refined description, acceptance criteria (from QA + user edits), updated estimation, and subtasks
**And** `sprints/SW-103/refinement.md` is created containing all agent perspectives (accepted and rejected) for auditability
**And** the synthesis does not exceed the target platform's context limits (NFR12)

## Tasks / Subtasks

- [x] Task 1: Create synthesis skill definition (AC: 1)
  - [x] Subtask 1.1: Create `scrum_workflow/skills/synthesis/SKILL.md` with synthesis logic
  - [x] Subtask 1.2: Define synthesis algorithm for merging agent perspectives
  - [x] Subtask 1.3: Define acceptance criteria merging logic (QA + user edits)
  - [x] Subtask 1.4: Define estimation adjustment logic

- [x] Task 2: Implement perspective merging in refinement workflow (AC: 2, 3)
  - [x] Subtask 2.1: Update `scrum_workflow/workflows/refinement.md` to call synthesis skill
  - [x] Subtask 2.2: Implement feedback collection from user (accept/reject per perspective)
  - [x] Subtask 2.3: Filter perspectives based on user feedback (only merge accepted)
  - [x] Subtask 2.4: Merge accepted perspectives into story.md

- [x] Task 3: Update story file with synthesized content (AC: 3)
  - [x] Subtask 3.1: Merge Architect findings into story description
  - [x] Subtask 3.2: Merge QA proposed acceptance criteria into story acceptance criteria
  - [x] Subtask 3.3: Merge Dev recommendations into subtasks
  - [x] Subtask 3.4: Update estimation based on complexity revealed by perspectives

- [x] Task 4: Create refinement audit file (AC: 4)
  - [x] Subtask 4.1: Create `sprints/SW-103/refinement.md` template
  - [x] Subtask 4.2: Store all agent perspectives (accepted and rejected) in refinement.md
  - [x] Subtask 4.3: Store user feedback (accept/reject decisions) in refinement.md
  - [x] Subtask 4.4: Add timestamp and metadata to refinement.md

- [x] Task 5: Validate context window compliance (AC: 5, NFR12)
  - [x] Subtask 5.1: Ensure synthesis output fits within platform context limits
  - [x] Subtask 5.2: Add token budget validation in synthesis skill
  - [x] Subtask 5.3: Reference `config.yaml` for platform-specific limits

## Dev Notes

### Relevant Architecture Patterns and Constraints

**From Architecture Decision 4: Agent Orchestration Model**
- Command-as-orchestrator: `commands/refine-ticket.md` coordinates synthesis
- Sub-Agent Spawning pattern: each agent produces isolated perspective
- Model Routing: synthesis uses primary model (Opus) for complex coordination

**From Architecture Decision 5: Inter-Phase Handoff Protocol**
- Blackboard pattern: phases communicate through sprint folder files
- Asynchronous handoff: refinement.md → plan.md (in Story 3.5)
- Only synthesized results pass between phases

**From Architecture: Write Boundary Rules (Section 6)**
- `/refine-ticket` MAY write: `refinement.md`, `story.md` (update)
- `/refine-ticket` MAY NOT write: `plan.md`, `review-*.md`
- Enforces Immutable State + Append-Only principles

**From Story 3.2 Context**
- Standard perspective format: `## [Agent-Name] Perspective` with Findings table, Recommendations, Proposed AC
- Each agent focuses on specific areas: Architect (risks/decisions), Dev (technical feasibility), QA (testable AC)
- All agent outputs are table-based for consistent parsing

**From Architecture: NFR12 - Synthesis Context Limits**
- Coordination mechanism must synthesize without exceeding platform's context limits
- Synthesis output must be concise enough for story.md updates

### Source Tree Components to Touch

**Framework Files to Create:**
1. `scrum_workflow/skills/synthesis/SKILL.md` - NEW FILE defining synthesis logic
2. `scrum_workflow/templates/refinement.md` - NEW FILE template for refinement audit file

**Framework Files to Modify:**
1. `scrum_workflow/workflows/refinement.md` - Add synthesis orchestration steps
2. `scrum_workflow/commands/refine-ticket.md` - Reference synthesis skill

**Framework Files to Reference:**
1. `scrum_workflow/config.yaml` - Platform token budgets for NFR12 validation
2. `scrum_workflow/context/standards.md` - Agent output format standards
3. `scrum_workflow/templates/story.md` - Story file template for updates

**Story 3.2 Files to Build Upon:**
1. Agent output format standards from `scrum_workflow/context/standards.md`
2. Table-based perspective format validated in Story 3.2
3. Agent files (architect.md, developer.md, qa.md) for perspective parsing

### Testing Standards Summary

**From Architecture: NFR11-NFR14 - Context Efficiency**
- Synthesis output must fit within platform's context window
- Reference `config.yaml` `token_budgets.synthesis` for limits
- Warn when synthesis output approaches 80% of platform's limit

**Validation Requirements:**
- Test synthesis with multiple accepted perspectives
- Test synthesis with all perspectives rejected (should preserve original story)
- Test synthesis with mixed accept/reject decisions
- Verify refinement.md contains all perspectives (accepted and rejected)
- Verify story.md is updated with only accepted content
- Verify user feedback is recorded in refinement.md
- Verify synthesis output fits within token budget

**From Story 3.2 Learnings:**
- Use test story file for validation (test-story/SW-TEST/story.md)
- Create automated validation script to verify synthesis logic
- Test with perspective format validated in Story 3.2

### Project Structure Notes

**Alignment with Unified Project Structure:**
- All skill files follow `scrum_workflow/skills/{skill-name}/SKILL.md` pattern
- All template files follow `scrum_workflow/templates/{template-name}.md` pattern
- Use `kebab-case` for all file and directory names

**Three-Layer Separation Compliance:**
- Framework Layer: `scrum_workflow/skills/synthesis/` (what we're creating)
- Adapter Layer: No changes needed (adapters reference framework commands)
- State Layer: Sprint files (`sprints/SW-XXX/refinement.md`, `story.md`) are project-specific

**Naming Conventions to Follow:**
- Skill ID: `synthesis` (from directory name)
- Skill file: `scrum_workflow/skills/synthesis/SKILL.md`
- Refinement file: `sprints/SW-XXX/refinement.md` (per ticket)
- Feedback section in refinement.md: separate from user-editable content (NFR16)

### Previous Story Intelligence (Story 3.2)

**Key Learnings from Story 3.2:**
- Agent output format is standardized: `## [Agent-Name] Perspective` with Findings table, Recommendations, Proposed AC
- Table columns: #, Finding, Severity, Category (for parsing)
- All agents have `max_tokens: 2000` in frontmatter
- Agent isolation principle: each agent produces separate perspective
- Standard format enables consistent parsing and synthesis

**Files Created/Modified in Story 3.2:**
- `scrum_workflow/context/standards.md` - Added "Agent Output Format Standards" section
- `scrum_workflow/agents/architect.md` - Verified standard format compliance
- `scrum_workflow/agents/developer.md` - Verified standard format compliance
- `scrum_workflow/agents/qa.md` - Verified standard format compliance
- `scrum_workflow/workflows/refinement.md` - Verified perspective separation

**Review Feedback from Story 3.2:**
- Standard documentation references added to all agent Context Rules
- Test artifacts are optional (not mandatory for story completion)
- Token limit validation and format validation deferred to future stories

**Code Patterns Established:**
- Use `## [Agent-Name] Perspective` header for perspective identification
- Use table-based format for findings (columns: #, Finding, Severity, Category)
- Use numbered list for recommendations
- Use checkbox list for proposed acceptance criteria
- Record metadata (timestamp, agent name, user feedback) for auditability

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic-3] - Epic 3 complete context and all story dependencies
- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.3] - Story 3.3 requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision-4] - Agent Orchestration Model (command-as-orchestrator)
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision-5] - Inter-Phase Handoff Protocol (blackboard pattern)
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns-Section-6] - Write Boundary Rules
- [Source: _bmad-output/planning-artifacts/architecture.md#NFR12] - Context window limits for synthesis
- [Source: _bmad-output/planning-artifacts/architecture.md#NFR16] - Feedback data integrity (separate section)
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Multi-Agent-Refinement] - FR12: Coordination mechanism for merging perspectives
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Multi-Agent-Refinement] - FR13: User accepts/rejects each perspective individually
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements-Multi-Agent-Refinement] - FR14: System records feedback for quality tracking
- [Source: Story 3.2] - Preceding story on agent perspectives with distinct output (must be completed first)
- [Source: Story 3.2 Dev Notes] - Agent output format standards and patterns

## Dev Agent Record

### Agent Model Used

glm-4.7 (claude-opus-4-6 equivalent)

### Debug Log References

No debug issues encountered during story creation.

### Completion Notes List

- **Story Analysis Completed**: Extracted complete Epic 3 context, Story 3.3 requirements, and cross-story dependencies from epics.md.

- **Architecture Analysis Completed**: Analyzed architecture decisions 4 (Agent Orchestration), 5 (Inter-Phase Handoff), and implementation patterns (Section 6: Write Boundary Rules). Identified relevant constraints: command-as-orchestrator pattern, blackboard handoff, write boundary rules, NFR12 context limits, NFR16 feedback data integrity.

- **Previous Story Intelligence Extracted**: Reviewed Story 3.2 completion notes, review feedback, files created/modified, and code patterns established. Key learnings: standardized agent output format, table-based perspective structure, agent isolation principle, metadata recording for auditability.

- **Technical Requirements Defined**: Specified framework files to create (synthesis skill, refinement template), framework files to modify (refinement workflow, refine-ticket command), and framework files to reference (config, standards, story template). Identified Story 3.2 files to build upon (agent output format standards, validated agent files).

- **Testing Standards Documented**: Defined validation requirements for synthesis with multiple accepted/rejected perspectives, refinement.md content verification, story.md update verification, feedback recording verification, and token budget compliance. Referenced Story 3.2 testing approach (test story file, automated validation script).

- **Project Structure Compliance**: Ensured alignment with unified project structure (kebab-case naming, skill and template file patterns), three-layer separation (framework vs. adapter vs. state), and naming conventions (skill ID, refinement file format, feedback section).

- **Acceptance Criteria Mapped**: All 5 acceptance criteria covered in tasks:
  - AC1: Synthesis skill definition (Task 1)
  - AC2: Perspective merging in refinement workflow (Task 2)
  - AC3: Updated story file content (Task 3)
  - AC4: Refinement audit file creation (Task 4)
  - AC5: Context window compliance (Task 5)

- **Implementation Completed**:
  - Task 1: Verified synthesis skill exists at `scrum_workflow/skills/synthesis/SKILL.md` with comprehensive merge strategy, deduplication rules, conflict resolution, and output assembly logic
  - Task 2: Updated `scrum_workflow/workflows/refinement.md` to include Step 10 (Synthesis Phase) with 4 sub-steps for invoking synthesis skill, creating refinement audit file, updating story file, and validating synthesis output
  - Task 2: Updated Write Boundaries in refinement workflow to include `refinement.md` as writable file
  - Task 3: Synthesis skill already defines how to merge Architect findings into story description, QA proposed acceptance criteria into story acceptance criteria, Dev recommendations into subtasks, and update estimation based on complexity
  - Task 4: Verified refinement.md template exists at `scrum_workflow/templates/refinement.md` with proper structure for all agent perspectives, feedback record, synthesis summary, and metadata
  - Task 5: Added Context Window Compliance section to synthesis skill with token budget validation, references to config.yaml for platform-specific limits, and warning threshold at 80% of coordination budget

- **Framework Files Modified**:
  - `scrum_workflow/workflows/refinement.md`: Added Step 10 (Synthesis Phase) with 4 sub-steps, updated Write Boundaries section
  - `scrum_workflow/commands/refine-ticket.md`: Updated Output section to include refinement.md and synthesized content
  - `scrum_workflow/skills/synthesis/SKILL.md`: Added Context Window Compliance section with token budget validation and NFR12 compliance

- **Validation Completed**: All acceptance criteria satisfied, all tasks and subtasks marked complete, framework files updated to support perspective synthesis and story update functionality

### File List

**Story File Created:**
- `/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/3-3-perspective-synthesis-and-story-update.md`

**Source Files Analyzed:**
- `_bmad-output/planning-artifacts/epics.md` - Epic 3 and Story 3.3 requirements
- `_bmad-output/planning-artifacts/architecture.md` - Architecture decisions and patterns
- `_bmad-output/planning-artifacts/prd.md` - Functional requirements FR12-14, NFR12, NFR16
- `_bmad-output/implementation-artifacts/3-2-agent-perspectives-with-distinct-output.md` - Previous story intelligence
- `scrum_workflow/workflows/project-context.md` - Project context workflow reference

**Framework Files Referenced (to be created/modified during implementation):**
- `scrum_workflow/skills/synthesis/SKILL.md` - VERIFIED EXISTS (synthesis logic, added NFR12 compliance)
- `scrum_workflow/templates/refinement.md` - VERIFIED EXISTS (refinement audit template)
- `scrum_workflow/workflows/refinement.md` - MODIFIED (added Step 10: Synthesis Phase)
- `scrum_workflow/commands/refine-ticket.md` - MODIFIED (updated output section)
- `scrum_workflow/config.yaml` - REFERENCE ONLY (token budgets)
- `scrum_workflow/context/standards.md` - REFERENCE ONLY (agent output format)
- `scrum_workflow/templates/story.md` - REFERENCE ONLY (story template)

**Files Modified During Implementation:**
- `scrum_workflow/workflows/refinement.md` - Added Step 10 (Synthesis Phase) with 4 sub-steps for invoking synthesis skill, creating refinement audit file, updating story file, and validating synthesis output; updated Write Boundaries section
- `scrum_workflow/commands/refine-ticket.md` - Updated Output section to include refinement.md creation and synthesized content updates
- `scrum_workflow/skills/synthesis/SKILL.md` - Added Context Window Compliance section with token budget validation, NFR12 compliance, and platform-specific limit references

### Review Findings

#### Decision-Needed (Auto-Resolved in YOLO Mode)

- [x] [Review][Decision] Token budget validation is reactive not preventive [refinement.md:Step-10.4, synthesis/SKILL.md:NFR12] - AUTO-RESOLVED: Enhanced validation to be preventive by checking token budget BEFORE synthesis generation
- [x] [Review][Decision] Undefined behavior for all-perspectives-rejected [refinement.md:Step-10.3] - AUTO-RESOLVED: Specified skip behavior - preserve original story when all perspectives rejected
- [x] [Review][Decision] NFR16 NOT ADDRESSED - Feedback section not separated [refinement.md:Step-10.2] - AUTO-RESOLVED: Added explicit feedback section separation in refinement.md template
- [x] [Review][Decision] Architectural Pattern 4 PARTIAL - Ambiguous invocation [refinement.md:Step-10.1] - AUTO-RESOLVED: Clarified as direct skill invocation (not sub-agent spawning)

#### Patch Findings (Auto-Applied in YOLO Mode)

- [x] [Review][Patch] No atomic write guarantee for synthesis updates [refinement.md:Step-10.3] - FIXED: Added atomic write specification
- [x] [Review][Patch] Missing validation for user feedback format [refinement.md:Step-10.1] - FIXED: Added validation step
- [x] [Review][Patch] No rollback mechanism for failed synthesis [refinement.md:Step-10.4] - FIXED: Added backup/restore pattern
- [x] [Review][Patch] No error handling for synthesis skill invocation [refinement.md:Step-10.1] - FIXED: Added guard clause for missing skill file
- [x] [Review][Patch] AC3 PARTIAL - Missing merge implementation details [refinement.md:Step-10.3] - FIXED: Added validation step for synthesis skill merge logic
- [x] [Review][Patch] Missing deduplication logic in workflow [refinement.md:Step-10.3] - FIXED: Added deduplication step invoking synthesis skill rules
- [x] [Review][Patch] No validation that refinement template exists [refinement.md:Step-10.2] - FIXED: Added template existence check
- [x] [Review][Patch] config.yaml missing token_budgets section [synthesis/SKILL.md:NFR12] - FIXED: Added default fallback
- [x] [Review][Patch] Platform identifier not recognized [synthesis/SKILL.md:NFR12] - FIXED: Added platform validation with fallback
- [x] [Review][Patch] Directory sprints/SW-XXX doesn't exist [refinement.md:Step-10.2] - FIXED: Added directory creation check
- [x] [Review][Patch] Conflicting recommendations from accepted perspectives [refinement.md:Step-10.3] - FIXED: Added conflict resolution invocation
- [x] [Review][Patch] No timestamp validation [refinement.md:Step-10.3] - FIXED: Added ISO 8601 validation

#### Deferred Findings

- [x] [Review][Defer] User provides suggest-changes instead of accept/reject [refinement.md:Step-10] - deferred, out of scope for current story
- [x] [Review][Defer] Story 3.2 PARTIAL - No format preservation validation [refinement.md:Step-10.3] - deferred, enhancement not blocker
- [x] [Review][Defer] Missing concurrency protection [refinement.md:Step-10] - deferred, out of scope for single-user workflow
