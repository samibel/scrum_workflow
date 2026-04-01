# Story 11.2: scrum-dev-story — Simplified Implementation Agent (Inversion of Control)

2
Status: in-progress
4 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
5
6    ## Story
7
8    As a developer,
9    I want a focused implementation agent that only executes code without self-review or planning overhead,
10    so that I can choose a different model for implementation and maximizing agent efficiency.
11        and
12        ## Context
13
14        This is a **refined** story that has already passed refinement and validation.
15        The **plan.md** exists ( created by the validation agent in Story 11.1)
16        The **ready-for-dev** status is on set by `ready-for-dev` to via `scrum-refine-story`)
17        - The **Inversion of Control** pattern eliminates self-planning from self-validation, self-review loops
 the simplifying the workflow focuses purely on: **Execute → Write results (no planning, no review, no loops)
18        - User can choose a different model for implementation vs. validation
19        - Enables per-step model selection (e.g., use Opus for coordination, Sonnet for sub-agents)
20        - Clean separation: planning/implementation/review are separate steps run in isolated context windows
21        - Pre-synthesising agent (readiness check) already did the plan
 so no redundant planning
22        - Status updates are atomic (NFR1 compliance)
23        - Plan.md is passed directly as input (no rewriting)
24        - Output goes directly to code files and not story.md
25
 - **Fail fast on**: Fail fast if validation fails, return to `refined` status with documented failure reasons
26
 - No self-modification of story content (cannot modify acceptance criteria, tasks, or dev notes)
27
 - Maint `plan.md` as read-only reference (for implementation guidance)
28        - Status transitions: `refined` → `ready-for-dev` (via /scrum-refine-story) and `ready-for-dev` → `in-dev` (via /scrum-dev-story) or `in-dev` → `done` (via /scrum-review-story after approval)
29
30 ## Acceptance Criteria
31
32
        ### AC1: Command File Created
33        **Given** a story file exists with `status: ready-for-dev`
        **When** the user runs `/scrum-dev-story SW-XXX`
        **Then** `scrum_workflow/commands/dev-story.md` exists in SKILL.md command format with:
34        - `trigger: /scrum-dev-story`
35        - `requires_status: ready-for-dev`
36        - `sets_status: in-dev`
37        - `spawns_agents: []` (no agent spawning - implementation is only)
38
39        ### AC2: Workflow File Created
40        **Given** the command file exists
41        **When** the workflow is created
42        **Then** `scrum_workflow/workflows/dev-story.md` exists with simplified implementation workflow containing:
43        - Load story with `status: ready-for-dev`
44        - Load plan.md (created by validation agent)
45        - Execute implementation following plan only
46        - Write code files
47        - Update status to `in-dev`
48        - Output progress to user after completion
49        - (Optional) Run tests if ` `tests`` flag is true in story.md
50
51        ### AC3: Inversion of Control Pattern Applied
52        **Given** the workflow runs
53        **When** the agent executes
54        **Then** the agent follows the Inversion of Control pattern:
55        - Load plan.md and execute steps sequentially
56        - Execute each step: make code changes
57        - Write to files using standard project conventions
58        - **NO self-validation, no review loops, no planning**
59        - Output goes directly to code files
60        - User can review separately via `/scrum-review-story`
61        - Status updates to `in-dev` during execution,62        - **Atomic status update** on completion (NFR1)
63
64        ### AC4: Atomic Writes (NFR1)
65        **Given** any file write operation
66        **When** writing files
67        **Then** files are written atomically (complete write or no partial writes)
68        - Story.md: status updated in single atomic operation
69        - Code files: written with atomic write operations
70        - No partial writes that could corrupt the file
71
72        ### AC5: Plan.md as Input Only
73        **Given** the workflow loads plan.md
74        **When** the plan is read
75        **Then** the workflow reads the plan.md file (created by Story 11.1) AS read-only reference
76        - The workflow does NOT modify, plan.md
77        - The workflow does not rewrite, regenerate the or create its new plan.md
78        - The workflow validates plan.md exists before execution
79        - The plan provides execution guidance only (not implementation details)
80
81        ### AC6: Implementation from Plan
82        **Given** the plan.md contains subtasks
83        **When** executing implementation
84        **Then** the agent implements each subtask from the plan.md
85        - Follows the execution plan exactly as specified
86        - Writes code following project conventions (architecture.md, standards.md)
87        - No deviation from plan steps
88
89        ### AC7: Status Update to Completion
90        **Given** implementation completes
91        **When** the agent finishes
92        **Then** `story.md` status is updated to `in-dev`
93        - `updated` field is set to current date (ISO 8601)
94        - User is notified of completion
95
96        ### AC8: Optional Test Generation
97        **Given** the story has tests enabled
98        **When** implementation completes
99        **Then** the agent may generate tests if `tests` flag is true
 in story.md
100        - Run tests follow standard testing patterns (context/testing.md)
101        - Test output written to appropriate locations
102
103        ### AC9: Write Boundaries
104        **Given** the workflow
105        **When** writing files
106        **Then** the workflow may write only:
107        - Code files (following plan.md)
108        - `story.md` (status update only)
109        - `plan.md` (read-only, created by Story 11.1)
110        - `refinement.md` (read-only, created by Story 11.1)
111        - `review-*.md` (managed by `/scrum-review-story`)
112        - `approval.md` (managed by approval workflow)
113
114        ## Tasks / Subtasks
115
116        - [ ] Task 1: Create command file `scrum_workflow/commands/dev-story.md` (AC: 1)
117          - [ ] 1.1 Create SKILL.md format file with YAML frontmatter
118          - [ ] 1.2 Define trigger as `/scrum-dev-story`
119          - [ ] 1.3 Set `requires_status: ready-for-dev`
120          - [ ] 1.4 Set `sets_status: in-dev`
121          - [ ] 1.5 Set `spawns_agents: []` (no agent spawning)
122          - [ ] 1.6 Add purpose description emphasizing lean execution-only workflow
123
124        - [ ] Task 2: Create workflow file `scrum_workflow/workflows/dev-story.md` (AC: 2, 5-9)
125          - [ ] 2.1 Define simplified workflow steps: Load → Execute → Update Status
126          - [ ] 2.2 Implement story loading with status validation
127          - [ ] 2.3 Implement plan.md loading step
128          - [ ] 2.4 Implement code execution step
129          - [ ] 2.5 Implement atomic status update
130          - [ ] 2.6 Implement completion notification
131          - [ ] 2.7 Implement optional test generation
132
133        - [ ] Task 3: Implement Inversion of Control execution (AC: 3, 4)
134          - [ ] 3.1 Read plan.md subtasks sequentially
135          - [ ] 3.2 Execute each subtask following project conventions
136          - [ ] 3.3 Write code files using atomic write operations
137          - [ ] 3.4 No self-validation or self-review, no planning
138          - [ ] 3.5 Pass results directly to user (no synthesis)
139
140        - [ ] Task 4: Implement write boundaries (AC: 8)
141          - [ ] 4.1 Define allowed writes: code files, story.md (status only)
142          - [ ] 4.2 Define read-only files: plan.md, refinement.md, context files
143          - [ ] 4.3 Implement atomic write operations (NFR1)
144
145        ## Dev Notes
146
147        ### Agentic Pattern: Inversion of Control
148
149        **Pattern Source:** [Inversion of Control](https://www.agentic-patterns.com/patterns/inversion-of-control)
149
150        **Key Principles:**
151        1. **Agent as Executor:** The agent receives a plan and just executes it, making code changes as directed
152        2. **No Self-Validation:** Agent does not validate its own work (separate review agent)
153        3. **No Self-Review:** Agent does not review its own code (separate review workflow)
154        4. **No Planning:** Agent does not create plans (plan.md is pre-built)
155        5. **Direct Output:** Implementation results go directly to code files and not synthesized reports
156
157        **How this applies:**
158        - User runs `/scrum-refine-story SW-XXX` to get validated story and plan.md
159        - User runs `/scrum-dev-story SW-XXX` to execute implementation
160        - The agent reads plan.md (created by validation agent)
161        - The agent executes steps sequentially
162        - The agent writes code files following project conventions
163        - The agent updates story.md status to `in-dev`
164        - User runs `/scrum-review-story SW-XXX` to review implementation
165
166        ### Relationship to Existing Commands
167
168        | Command | Purpose | Status Transition | Pattern |
169        |---------|---------|---------------------|---------|
170        | `/scrum-refine-ticket` | Multi-agent refinement | `draft` → `refinement` | Sub-Agent Spawning |
171        | `/scrum-refine-story` | Validation-only agent | `refinement` → `ready-for-dev` | Feature List as Immutable Contract |
172        | `/scrum-dev-story` | Implementation-only agent | `ready-for-dev` → `in-dev` | Inversion of Control |
173        | `/scrum-review-story` | Review-only agent | `in-dev` → `done` | AI-Assisted Code Review |
174
175        ### Project Structure Notes
176
177        **Files to create:**
178        ```
179        scrum_workflow/
180        ├── commands/
181        │   └── dev-story.md         # New: simplified implementation command
182        └── workflows/
183            └── dev-story.md         # New: simplified implementation workflow
184        ```
185
186        **Existing Files to Reference:**
187        - `scrum_workflow/commands/refine-story.md` - Validation command (Story 11.1)
188        - `scrum_workflow/workflows/refine-story.md` - Validation workflow (Story 11.1)
189        - `scrum_workflow/workflows/refinement.md` - Existing refinement workflow (for reference)
190        - `scrum_workflow/context/standards.md` - Project standards (for conventions)
191        - `scrum_workflow/context/architecture-guidelines.md` - Architecture guidelines (for patterns)
192
193        ### Write Boundary Rules
194
195        This workflow may write:
196        - `story.md` - Status field only (`status: in-dev`, `updated: <date>`)
197        - Code files - Following plan.md execution guidance

198        This workflow may NOT write:
199        - `plan.md` - Read-only (created by validation agent)
200        - `refinement.md` - Read-only (created by refinement workflow)
201        - `review-*.md` - Managed by `/scrum-review-story`
201        - `approval.md` - Managed by approval workflow
202        - `scrum_workflow/` - Framework files are read-only during execution
203        - `_scrum-output/context/` - Context files are read-only during execution
204
205        ### References
206
207        - [Agentic Patterns: Inversion of Control](https://www.agentic-patterns.com/patterns/inversion-of-control) [Source: Epic 11 story definition]
208        - [Architecture: Story File Schema](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/planning-artifacts/architecture.md) [Source: architecture.md L87-94]
209        - [Story 11.1: Validation Agent](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/_bmad-output/implementation-artifacts/11-1-refine-story-validation-agent-feature-list-as-immutable-contract.md) [Source: previous story]
210        - [scrum_workflow/commands/refine-ticket.md](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/commands/refine-ticket.md) [Source: existing implementation]
211        - [scrum_workflow/workflows/refinement.md](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/workflows/refinement.md) [Source: existing workflow]
212        - [scrum_workflow/context/standards.md](/Users/SBELAKH/Desktop/dev/mars/scrum_workflow/scrum_workflow/context/standards.md) [Source: project standards]
213
214        ## Dev Agent Record
215
216        ### Agent Model Used
217
218        {{agent_model_name_version}}
219
220        ### Debug Log References
221
222        None required - implementation will be straightforward.
223
224        ### Completion Notes List
225
226        - Created `scrum_workflow/commands/dev-story.md` with SKILL.md format
227        - Created `scrum_workflow/workflows/dev-story.md` with simplified workflow
228        - Implemented Inversion of Control pattern (execute-only, no validation, no review)
229        - Removed planning phase from dev-story (moved to refine-story)
230        - Implemented atomic write operations (NFR1)
231        - Defined clear write boundaries (code files + story.md status only)
232
233        ### File List
234
235        - scrum_workflow/commands/dev-story.md (NEW)
236        - scrum_workflow/workflows/dev-story.md (NEW)
237
