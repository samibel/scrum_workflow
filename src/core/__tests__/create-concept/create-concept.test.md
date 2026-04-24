# `/scrum-create-concept` — ATDD Acceptance Test Scenarios

**Test Type**: ATDD Acceptance Tests
**Command**: `/scrum-create-concept`
**Related Files**:
- `scrum_workflow/commands/create-concept.md`
- `scrum_workflow/workflows/concept-creation.md`
- `scrum_workflow/templates/concept.md`
**Status**: Specification (TDD Red Phase — implement against these scenarios)

---

## Test Objective

Validate that the `/scrum-create-concept` command:

1. Parses the problem statement and flags correctly
2. Rejects invalid or empty input with actionable errors
3. Produces a concept file at the correct output path
4. Populates all required sections in the concept document
5. Contains at least two solution options and exactly one recommendation
6. Never writes source code, never creates a story file
7. Respects the "no overwrite" guard on existing concept files

---

## AC1: Command and Workflow Files Exist

**Scenario 1.1 — Command definition file exists**

**Given** the framework is installed  
**When** the agent looks up `scrum_workflow/commands/create-concept.md`  
**Then** the file exists and is readable  
**And** the YAML frontmatter contains `name: create-concept`  
**And** the YAML frontmatter contains `trigger: "/scrum-create-concept"`  

**Scenario 1.2 — Workflow definition file exists**

**Given** the framework is installed  
**When** the agent looks up `scrum_workflow/workflows/concept-creation.md`  
**Then** the file exists and is readable  

**Scenario 1.3 — Template file exists**

**Given** the framework is installed  
**When** the agent looks up `scrum_workflow/templates/concept.md`  
**Then** the file exists and is readable  
**And** the YAML frontmatter contains `schema_version: "1.0.0"`  
**And** the YAML frontmatter contains `kind: "concept"`  

---

## AC2: Empty Problem Statement is Rejected

**Scenario 2.1 — No arguments provided**

**Given** the user invokes `/scrum-create-concept` with no arguments  
**When** the command processes the input  
**Then** no concept file is written  
**And** the agent reports:
```
❌ Missing Problem Statement: /scrum-create-concept requires a problem statement
```

**Scenario 2.2 — Whitespace-only problem statement**

**Given** the user invokes `/scrum-create-concept "   "`  
**When** the command processes the input  
**Then** no concept file is written  
**And** the agent reports a missing problem statement error  

---

## AC3: Valid Input Produces Concept File

**Scenario 3.1 — Freeform Mode A invocation**

**Given** the user invokes `/scrum-create-concept "How can we add caching to MasterDataServiceImp?"`  
**And** the framework is installed  
**When** the command completes  
**Then** a file is created at `_scrum-output/concepts/add-caching-to-masterdataserviceimp/concept.md`  
**And** the file has valid YAML frontmatter with `schema_version: "1.0.0"`, `kind: "concept"`, `status: "draft"`  
**And** the file body contains all 15 required sections (Problem Summary through Suggested Follow-up Ticket)  

**Scenario 3.2 — Mode B invocation with ticket ID**

**Given** the user invokes `/scrum-create-concept SW-042 "How can we add caching to MasterDataServiceImp?"`  
**When** the command completes  
**Then** a file is created at `_scrum-output/concepts/sw-042-add-caching-to-masterdataserviceimp/concept.md`  
**And** the frontmatter field `ticket` is set to `SW-042`  

---

## AC4: Concept Template Contains All Required Sections

**Scenario 4.1 — Required sections present**

**Given** a concept file has been generated  
**When** its Markdown body is inspected  
**Then** it contains each of the following section headings in order:
- `## 1. Problem Summary`
- `## 2. Context`
- `## 3. Analysis Graph`
- `## 4. Relevant Files and Modules`
- `## 5. Current Project Behavior`
- `## 6. Existing Patterns Found`
- `## 7. Constraints`
- `## 8. Solution Options`
- `## 9. Trade-off Analysis`
- `## 10. Recommended Solution`
- `## 11. Implementation Plan`
- `## 12. Test Strategy`
- `## 13. Risks`
- `## 14. Open Questions`
- `## 15. Suggested Follow-up Ticket`

**Scenario 4.2 — Mermaid analysis graph present**

**Given** a concept file has been generated  
**When** section 3 is inspected  
**Then** it contains a fenced `mermaid` code block with a `flowchart TD` diagram  
**And** the diagram includes nodes for `Problem Statement`, `Recommended Solution`, and `Risks`  

---

## AC5: At Least Two Solution Options Are Present

**Scenario 5.1 — Standard depth produces at least two options**

**Given** the user invokes `/scrum-create-concept "Analyze how to add OAuth2 to the auth service" --depth standard`  
**When** the command completes  
**Then** the concept file section `## 8. Solution Options` contains at least two subsections (`### Option A` and `### Option B`)  
**And** each option subsection contains Pros, Cons, Complexity, and Risk entries  

**Scenario 5.2 — Standard depth produces three options when possible**

**Given** the problem has multiple viable approaches  
**When** the command completes at `standard` depth  
**Then** the concept file contains `### Option A`, `### Option B`, and `### Option C`  

---

## AC6: Exactly One Recommendation Is Present

**Scenario 6.1 — Recommended Solution section is populated**

**Given** a concept file has been generated  
**When** section `## 10. Recommended Solution` is inspected  
**Then** it contains a non-empty recommendation body  
**And** it identifies a single recommended option by name  
**And** it explains why the other options were not selected  

---

## AC7: No Implementation or Ticket Creation

**Scenario 7.1 — No source code is written**

**Given** the command runs to completion  
**When** the file system is inspected  
**Then** no files outside `_scrum-output/concepts/` have been created or modified  
**And** no files with extensions `.java`, `.ts`, `.js`, `.py`, `.go`, `.rb`, `.kt` have been created  

**Scenario 7.2 — No story file is created**

**Given** the command runs to completion  
**When** `_scrum-output/sprints/` is inspected  
**Then** no new `story.md` files have been created  

---

## AC8: No Overwrite of Existing Concept File

**Scenario 8.1 — Guard on pre-existing concept**

**Given** a concept file already exists at `_scrum-output/concepts/add-caching-to-masterdataserviceimp/concept.md`  
**When** the user invokes `/scrum-create-concept "How can we add caching to MasterDataServiceImp?"` again  
**Then** the existing file is NOT overwritten  
**And** the agent reports:
```
⚠️  Concept Already Exists: '_scrum-output/concepts/add-caching-to-masterdataserviceimp/concept.md' already exists
```

---

## AC9: --dry-run Does Not Write Files

**Scenario 9.1 — Dry-run prints plan but creates no files**

**Given** the user invokes `/scrum-create-concept "Analyze migration from Maven to Gradle" --dry-run`  
**When** the command completes  
**Then** no files are written to `_scrum-output/concepts/`  
**And** the agent prints the planned output path and analysis graph nodes to stdout  

---

## AC10: Invalid --depth Value Is Rejected

**Scenario 10.1 — Invalid depth halts with error**

**Given** the user invokes `/scrum-create-concept "Improve CSV import" --depth extreme`  
**When** the command processes the input  
**Then** no concept file is written  
**And** the agent reports:
```
❌ Invalid Depth Value: '--depth extreme' is not valid
```

---

## AC11: Command Documentation States Correct Constraints

**Scenario 11.1 — Command spec explicitly forbids implementation**

**Given** `scrum_workflow/commands/create-concept.md` is read  
**When** the Write Boundary Rules section is inspected  
**Then** it contains a statement forbidding writes to source code files  
**And** it contains a statement forbidding creation of `story.md` files  

**Scenario 11.2 — Command spec requires project analysis**

**Given** `scrum_workflow/commands/create-concept.md` is read  
**When** the Required Behavior section is inspected  
**Then** it contains a step for inspecting the existing project  
**And** it contains a step for identifying existing project patterns  

**Scenario 11.3 — Command spec requires solution options and recommendation**

**Given** `scrum_workflow/commands/create-concept.md` is read  
**When** the Required Behavior section is inspected  
**Then** it contains a step for generating at least two solution options  
**And** it contains a step for recommending one solution  

---

## AC12: Concept is Grounded in Existing Codebase

**Scenario 12.1 — Relevant files section is populated**

**Given** a concept file has been generated for a problem that names a specific class or module  
**When** section `## 4. Relevant Files and Modules` is inspected  
**Then** it contains at least one file path reference  
**And** each entry includes a relevance reason  

**Scenario 12.2 — Existing patterns section is populated**

**Given** a concept file has been generated  
**When** section `## 6. Existing Patterns Found` is inspected  
**Then** it contains at least one pattern observation  
**And** each pattern includes a reference to the file or module where it was observed  
