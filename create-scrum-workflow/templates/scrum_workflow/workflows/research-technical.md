# Technical Research Workflow

Workflow for the `/scrum-research technical` command that orchestrates the researcher agent.
Uses WebSearch for external online investigation (not Glob/Grep for local codebase scanning).
Implements structured agentic methodology with six sequential phases.
Implements Filesystem-Based State Pattern for checkpoint recovery and long-running research tasks.

## Prerequisites

- **Required**: `scrum_workflow/agents/researcher.md` -- Researcher agent definition (must exist)
- **Optional**: `context/index.md` -- Project context for domain and tech stack understanding (warn if missing, do not halt)
- **Agent Active-In**: The researcher agent has `active_in: [research-technical, research-general]` matching this command name

## Step 0: Input Parsing

Parse command input to extract topic, flags, and determine execution parameters.

### Step 0.1: Extract Topic Argument

Parse the `<topic>` argument from the command invocation:

- Example: `/research-technical "agentic patterns for documentation"` extracts topic as "agentic patterns for documentation"
- Example: `/scrum-research technical "container orchestration"` extracts topic as "container orchestration"
- Topic may be quoted or unquoted

**If no topic is provided**: **HALT** with error: "No research topic provided. Usage: /research-technical <topic>"

### Step 0.2: Parse Optional Flags

- `--sources <urls...>`: Space-separated list of source URLs to prioritize in research
- `--output <path>`: Custom output directory path (default: `docs/research/`)
- `--update`: Incremental update mode flag (updates existing research with new findings)

Store parsed values for use in subsequent steps.

### Step 0.4: Detect Update Mode

Check if `--update` flag was provided:

**If `--update` flag is present:**
1. Set `execution_mode = "update"`
2. Proceed to **Update Mode** steps (Step U1) instead of full research
3. Skip Steps 1-9 (full research flow)

**If `--update` flag is NOT present:**
1. Set `execution_mode = "full"`
2. Proceed with normal research flow (Steps 1-9)

### Step 0.3: Determine Output Path

Set output directory:
- Default: `docs/research/` relative to project root
- If `--output` flag provided: use the specified path

## Step 1: Validation

### Step 1.1: Confirm Researcher Agent Exists

Check that `scrum_workflow/agents/researcher.md` exists:

```bash
test -f scrum_workflow/agents/researcher.md
```

If file does not exist:
- **HALT** with error: "researcher agent not found at 'scrum_workflow/agents/researcher.md'. Please run Story 9-1 first."

### Step 1.2: Check Project Context

Check if `context/index.md` exists:

```bash
test -f context/index.md
```

- If exists: Load for project domain and tech stack understanding
- If missing: **WARN** "No project context found (context/index.md). Research will proceed without domain-specific context awareness." and continue -- do not halt

### Step 1.3: Check for Existing Research State (Resume Detection)

Before starting new research, check if there is an interrupted research session that can be resumed.

**Check for existing state file:**

```bash
test -f docs/research/.research-state.json
```

**If state file exists:**

1. Read the existing state file:
   ```yaml
   existing_state = read_file("docs/research/.research-state.json")
   ```

2. Parse the JSON content

3. Check if `status` is `interrupted`

4. If status is `interrupted`:
   - Compare `topic` in state file with new research topic
   - If topics match: Present resume prompt to user
   - If topics do not match: Offer to overwrite or cancel options

**Resume Prompt Format:**
```
Previous research found:
- Topic: {topic}
- Status: interrupted
- Last completed step: {last_completed_step}
- Sources consulted: {count}
- Findings accumulated: {count}

Resume from last checkpoint? [Y/n/fresh]
```

**User Response Handling:**

| Response | Action |
|----------|--------|
| Y / yes / empty | Resume from `last_completed_step` - load findings and sources |
| N / no | Cancel operation, exit workflow |
| fresh | Start fresh research, backup existing state |

**Fresh Start Process:**
1. Backup existing state to `docs/research/.research-state.backup.json`
2. Create new state file (proceed to Step 1.4)

**Resume Process:**
1. Load `findings` and `sources_consulted` from state file
2. Determine resume step from `last_completed_step` using jump map
3. Set `resume_metadata` in state file
4. Jump to appropriate workflow step

**Resume Jump Map:**

| last_completed_step | Resume At Step |
|--------------------|----------------|
| scope_confirmation | Step 5 (Research Plan) |
| research_plan | Step 6 (Swarm Research) |
| swarm_research | Step 7 (Verification) |
| verification | Step 8 (Reflection Loop) |
| reflection_loop | Step 9 (Synthesis) |
| synthesis | N/A - already complete |

### Step 1.4: Create New Research State File (Fresh Start)

If no state file exists OR user chose "fresh" start:

**Generate Research ID:**
```yaml
research_id: research-{topic-slug}-{timestamp}
# Example: research-agentic-patterns-20260331-143022
```

Where:
- `topic-slug`: kebab-case transformation of research topic
- `timestamp`: YYYYMMDD-HHMMSS format

**Initialize State File:**

Write to `docs/research/.research-state.json`:

```json
{
  "schema_version": "1.0",
  "research_id": "research-{topic-slug}-{timestamp}",
  "topic": "{research_topic}",
  "start_time": "{ISO 8601 timestamp}",
  "last_updated": "{ISO 8601 timestamp}",
  "status": "planning",
  "completed_steps": [],
  "last_completed_step": null,
  "findings": {},
  "sources_consulted": [],
  "resume_metadata": null,
  "interruption_metadata": null
}
```

**State File Schema Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schema_version` | string | Schema version for future compatibility |
| `research_id` | string | Unique identifier for this research session |
| `topic` | string | The research topic being investigated |
| `start_time` | string | ISO 8601 timestamp when research started |
| `last_updated` | string | ISO 8601 timestamp of last state update |
| `status` | enum | Current status: planning, researching, reflecting, synthesizing, complete, interrupted |
| `completed_steps` | array | List of completed workflow steps |
| `last_completed_step` | string | Most recently completed step |
| `findings` | object | Intermediate research results |
| `sources_consulted` | array | List of consulted sources with metadata |
| `resume_metadata` | object | Resume information if research was resumed |
| `interruption_metadata` | object | Interruption details if research was interrupted |

## Step 2: Agent & Context Loading

### Step 2.1: Load Researcher Agent

Load the researcher agent definition from `scrum_workflow/agents/researcher.md`:
- Read agent's Identity, Instructions, Output Format, and Context Rules sections
- Extract WebSearch tool usage methodology
- Extract agentic workflow methodology and orchestration patterns from agent Instructions
- Extract output template structures for `technical_research` mode

### Step 2.2: Load Project Context (if available)

If `context/index.md` exists:
- Load to understand project domain and technology stack
- Extract tech stack information (languages, frameworks, tools)
- Use context to make research context-aware (e.g., prioritize technologies used by the project)
- Extract project domain for targeted research focus

If `context/index.md` is missing, proceed without project-specific context as warned in Step 1.2.

### Step 2.3: Load Research Patterns Reference

Load `docs/research/technical-research-agent-patterns-2026-03-30.md` (if exists) for detailed pattern implementation guidance:
- Sequential phase definitions and execution strategy
- Orchestration strategy for distributed task execution
- Iterative quality thresholds and evaluation criteria
- Output structure specifications

If reference document is missing, proceed using pattern descriptions from the researcher agent definition.

## Step 3: Phase 1 -- Scope Confirmation

Define the research topic, goals, scope boundaries, and obtain user approval before proceeding.

### Step 3.1: Present Research Scope

Display the parsed research topic and proposed scope to the user:

```
Research Topic: {topic}
Project Context: {domain} / {tech_stack} (or "No project context available")
Proposed Scope:
  - Primary focus: {inferred focus areas}
  - Source type: {online research via WebSearch}
  - Output: technical-research-{topic-slug}-{date}.md
```

### Step 3.2: User Approval Gate

Prompt user to confirm or adjust the research scope:

```
Proceed with this research scope? [Y/n/cancel]
```

- If user confirms (Y/y/empty): Proceed to Output Directory Creation (Step 4)
- If user declines or requests changes: Adjust scope based on user feedback and re-present
- If user types "cancel" or "exit": **EXIT** with message "Research cancelled by user." and halt

**The scope confirmation gate is mandatory** -- research does not proceed without user approval.

### Step 3.3: Update Research State (Scope Confirmed)

After user confirms scope, update the research state file:

**State Update:**
```json
{
  "status": "planning",
  "completed_steps": ["scope_confirmation"],
  "last_completed_step": "scope_confirmation",
  "last_updated": "{current_ISO_8601_timestamp}"
}
```

**Atomic Write Process:**
1. Write state to temporary file: `docs/research/.research-state.tmp.json`
2. Validate JSON is valid
3. Rename to actual file: `docs/research/.research-state.json`

## Step 4: Output Directory Creation

Before proceeding to research phases, ensure the output directory exists.

Check if `docs/research/` directory exists (or custom output path from `--output` flag).

If directory does not exist, create it:

```bash
mkdir -p docs/research
```

If directory creation fails:
- **HALT** with error: "Cannot create output directory 'docs/research/'. Check permissions."

All research output files are written to this directory.

## Step 5: Phase 2 -- Research Plan

Create a structured research plan with source identification and subagent task distribution.

### Step 5.1: Identify Research Sources via WebSearch

Use the WebSearch tool to identify relevant online sources for the research topic:

**WebSearch Tool Usage:**
```
WebSearch(query="{topic} architecture patterns best practices", allowed_domains=[])
```

**Source Identification Process:**
1. Execute initial WebSearch query with the research topic
2. Analyze search results for relevance and credibility
3. If `--sources` flag provided, prioritize those URLs in the research plan
4. Categorize sources by type:
   - Official documentation (vendor/authoritative sources)
   - Community resources (blogs, forums, Stack Overflow)
   - Academic papers (research publications)
   - Case studies (real-world implementations)

**Error Handling for WebSearch Failures:**
- If WebSearch fails (network error, timeout, API error):
  - Log the error with details
  - Provide clear error message: "WebSearch failed: {error_details}. Possible causes: network connectivity, API rate limits, service unavailable."
  - Suggest alternative approaches: manual research, cached sources, local documentation
- If WebSearch returns no results:
  - Log the query that returned no results
  - Suggest alternative search terms: "No results found for '{query}'. Try broader terms or different keywords."
  - Suggest alternative sources: project documentation, internal knowledge base

### Step 5.2: Create Subagent Task Distribution

Plan the distribution of research across 3-5 parallel subagents following the Swarm Migration pattern:

**Subagent Task Templates:**

| Subagent | Research Aspect | Search Query Pattern | Source Categories |
|----------|-----------------|---------------------|-------------------|
| Subagent 1 | Architecture Patterns | "{topic} architecture patterns design principles" | Official docs, academic papers |
| Subagent 2 | Frameworks & Tools | "{topic} frameworks libraries tools comparison" | Official docs, community resources |
| Subagent 3 | Best Practices | "{topic} best practices implementation guide" | Community resources, case studies |
| Subagent 4 | Performance | "{topic} performance benchmarks optimization" | Benchmarks, case studies |
| Subagent 5 | Security | "{topic} security vulnerabilities compliance" | Security docs, vulnerability databases |

**Isolated Context Structure for Each Subagent:**
```yaml
subagent_context:
  subagent_id: "{id}"
  research_aspect: "{aspect}"
  search_queries:
    - "{query_1}"
    - "{query_2}"
  source_categories:
    - "{category_1}"
    - "{category_2}"
  output_format:
    findings: []
    sources: []
    confidence: "high|medium|low"
```

**Isolation Requirements:**
- Each subagent receives ONLY its assigned aspect and queries
- Subagents do NOT share state during research
- Subagents do NOT see other subagent results until aggregation
- Each subagent maintains its own source list

### Step 5.3: Display Research Plan

Present the research plan to the user with progress tracking format:

```
Research Plan for: {topic}
========================================

[Phase 1/6] Scope Confirmation - Complete
[Phase 2/6] Research Plan - In Progress
  - Sources identified: {source_count}
  - Subagents planned: {subagent_count}

Subagent Task Distribution:
  1. Architecture Patterns: "{query_1}"
     - Source types: Official docs, Academic papers
  2. Frameworks & Tools: "{query_2}"
     - Source types: Official docs, Community resources
  3. Best Practices: "{query_3}"
     - Source types: Community resources, Case studies
  4. Performance: "{query_4}"
     - Source types: Benchmarks, Case studies
  5. Security: "{query_5}"
     - Source types: Security docs, Vulnerability databases

[Phase 3/6] Swarm Research - Pending
[Phase 4/6] Verification - Pending
[Phase 5/6] Reflection Loop - Pending
[Phase 6/6] Synthesis - Pending
```

### Step 5.4: Update Research State (Research Plan Complete)

After research plan is created, update the research state file:

**State Update:**
```json
{
  "status": "planning",
  "completed_steps": ["scope_confirmation", "research_plan"],
  "last_completed_step": "research_plan",
  "last_updated": "{current_ISO_8601_timestamp}",
  "findings": {
    "subagent_tasks": "{subagent_task_distribution_from_step_5.2}"
  }
}
```

**Atomic Write:** Use the same atomic write process as defined in Step 3.3.

## Step 6: Phase 3 -- Swarm Research (Parallel Subagents)

Execute parallel subagent research using the Swarm Migration pattern for 10x+ speedup.

**Performance Target:** Achieve approximately 10x speedup compared to sequential research by executing 3-5 subagents in parallel.

### Step 6.1: Spawn Parallel Subagents

Spawn 3-5 parallel subagents based on the research plan from Phase 2:

**Subagent Spawning Mechanism:**

For each subagent (1 through N, where N = 3-5):

```yaml
spawn_subagent:
  subagent_id: "researcher-subagent-{N}"
  isolated_context:
    topic: "{research_topic}"
    aspect: "{assigned_aspect}"
    search_queries: ["{query_1}", "{query_2}", "{query_3}"]
    source_categories: ["{category_1}", "{category_2}"]
    output_requirements:
      - key_findings (list)
      - source_urls (list with titles)
      - confidence_level (high|medium|low)
  isolation_rules:
    - No access to other subagent contexts
    - No shared state during execution
    - Independent WebSearch execution
    - Independent result formatting
```

**Isolated Context per Subagent:**

| Field | Description | Example |
|-------|-------------|---------|
| `subagent_id` | Unique identifier | `researcher-subagent-1` |
| `aspect` | Research focus area | `Architecture Patterns` |
| `search_queries` | Specific WebSearch queries | `["microservices architecture patterns", "event-driven design"]` |
| `source_categories` | Expected source types | `["official docs", "academic papers"]` |
| `output_requirements` | Required output fields | `findings, sources, confidence` |

**Subagent Execution:**
- Each subagent executes INDEPENDENTLY with isolated context
- Subagents do NOT share state or results during research
- Each subagent performs its own WebSearch queries
- Each subagent structures findings independently

### Step 6.2: Subagent Research Execution with WebSearch

Each subagent performs research using WebSearch:

**WebSearch Integration per Subagent:**

```
For each search query in subagent context:
  1. Execute WebSearch(query="{query}", allowed_domains=[])
  2. Analyze search results for relevance
  3. Extract key findings, data points, and source URLs
  4. Apply confidence level based on source verification
  5. Structure findings according to output requirements
```

**Subagent Research Process:**

1. **Execute WebSearch Queries:**
   ```
   WebSearch(query="{aspect-specific query}", allowed_domains=[])
   ```

2. **Extract Findings:**
   - Key facts and data points
   - Technical specifications
   - Best practices and recommendations
   - Source URLs and titles

3. **Apply Confidence Levels:**
   - **High**: Multiple sources agree, official documentation, recent data
   - **Medium**: Single source, community resource, some age
   - **Low**: Conflicting information, outdated, uncertain claims

4. **Handle WebSearch Errors:**
   - If WebSearch fails: Log error, continue with available results
   - If no results: Mark aspect as requiring manual research
   - If partial results: Proceed with available data, note gaps

5. **Return Structured Results:**
   ```yaml
   subagent_result:
     subagent_id: "{id}"
     aspect: "{aspect}"
     findings:
       - finding: "{key_finding}"
         confidence: "high|medium|low"
         sources: ["{url_1}", "{url_2}"]
     sources:
       - url: "{source_url}"
         title: "{source_title}"
         type: "{source_type}"
     gaps: ["{missing_aspect}"]
     confidence: "high|medium|low"
   ```

**Progress Tracking During Research:**

```
Research Progress:
========================================
[Phase 1/6] Scope Confirmation - Complete
[Phase 2/6] Research Plan - Complete ({source_count} sources identified)
[Phase 3/6] Swarm Research - In Progress
  - Subagent 1 (Architecture): Complete (3 sources)
  - Subagent 2 (Frameworks): Complete (4 sources)
  - Subagent 3 (Best Practices): In Progress...
  - Subagent 4 (Performance): Pending
  - Subagent 5 (Security): Pending
[Phase 4/6] Verification - Pending
[Phase 5/6] Reflection Loop - Pending (Story 9-5)
[Phase 6/6] Synthesis - Pending
```

### Step 6.3: Result Aggregation (Map-Reduce)

The coordinator agent aggregates subagent results using map-reduce style aggregation:

**Aggregation Process:**

1. **Collect Subagent Results:**
   - Wait for all subagents to complete
   - Collect structured results from each subagent
   - Handle partial results (if any subagent failed)

2. **Merge Findings (Map Phase):**
   ```
   For each subagent result:
     For each finding:
       Add to merged_findings list
       Track source aspect (which subagent)
       Track confidence level
   ```

3. **Identify Overlapping Information:**
   - Compare findings across subagents
   - Identify agreements (same finding from multiple sources)
   - Identify conflicts (contradictory findings)
   - Identify unique findings (single source)

4. **Consolidate Duplicate Findings:**
   ```
   For each unique finding topic:
     If found in multiple subagents:
       Merge into single finding
       Increase confidence level
       Combine source lists
     If found in single subagent:
       Keep as-is with original confidence
   ```

5. **Build Unified Source List:**
   ```
   unified_sources = []
   For each subagent:
     For each source:
       If source.url not in unified_sources:
         Add to unified_sources
   ```

6. **Generate Aggregation Summary:**
   ```yaml
   aggregation_result:
     total_findings: {count}
     merged_findings: {count}
     conflicts_identified: {count}
     unified_sources: {count}
     confidence_distribution:
       high: {count}
       medium: {count}
       low: {count}
   ```

**Aggregation Output:**

```
Result Aggregation Complete:
========================================
- Total findings: {count}
- Merged findings (cross-referenced): {count}
- Conflicts identified: {count}
- Unified sources: {count}
- Confidence distribution:
  - High: {count}
  - Medium: {count}
  - Low: {count}
```

### Step 6.4: Update Research State (Swarm Research Complete)

After swarm research aggregation completes, update the research state file:

**State Update:**
```json
{
  "status": "researching",
  "completed_steps": ["scope_confirmation", "research_plan", "swarm_research"],
  "last_completed_step": "swarm_research",
  "last_updated": "{current_ISO_8601_timestamp}",
  "findings": {
    "subagent_tasks": "{subagent_task_distribution_from_step_5.2}",
    "subagent_results": "{aggregated_subagent_results_from_step_6.3}"
  },
  "sources_consulted": "{unified_sources_from_step_6.3}"
}
```

**Atomic Write:** Use the same atomic write process as defined in Step 3.3.

## Step 7: Phase 4 -- Verification

Cross-reference findings, validate sources, and identify conflicts or gaps.

### Step 7.1: Cross-Reference Findings Across Subagent Results

Compare results across all subagents to identify agreements, conflicts, and gaps:

**Cross-Reference Analysis:**

```
For each finding from aggregation:
  1. Check if finding appears in multiple subagent results
  2. Compare details across subagents
  3. Classify as: agreement, conflict, or unique
```

**Classification Criteria:**

| Category | Definition | Action |
|----------|------------|--------|
| **Agreement** | Multiple subagents report same finding | Increase confidence to HIGH |
| **Conflict** | Subagents report contradictory information | Flag for resolution, mark confidence LOW |
| **Unique** | Finding appears in only one subagent | Keep original confidence, note single source |

**Cross-Reference Output:**

```yaml
cross_reference_result:
  agreements:
    - finding: "{finding_text}"
      subagents: ["subagent-1", "subagent-3"]
      confidence: "high"
  conflicts:
    - topic: "{conflicting_topic}"
      subagent_1_claim: "{claim_1}"
      subagent_2_claim: "{claim_2}"
      resolution: "needs_manual_review"
  unique_findings:
    - finding: "{finding_text}"
      subagent: "subagent-2"
      confidence: "medium"
```

### Step 7.2: Source Validation and URL Verification

Validate each source for accessibility, relevance, and credibility:

**Source Validation Process:**

1. **URL Validation:**
   ```
   For each source URL:
     - Check URL format is valid
     - Verify domain is accessible
     - Note source type (official, community, academic)
   ```

2. **Cross-Reference Claims Across Sources:**
   ```
   For each claim:
     - Identify all sources supporting the claim
     - Check for consensus across sources
     - Flag claims with single source support
   ```

3. **Confidence Level Assignment:**
   | Confidence | Criteria |
   |------------|----------|
   | **High** | Multiple sources agree, official documentation, recent (< 1 year) |
   | **Medium** | Single reliable source, community resource, moderate age (1-2 years) |
   | **Low** | Single unverified source, conflicting information, outdated (> 2 years) |

4. **Flag Unverifiable Claims:**
   ```yaml
   unverifiable_claims:
     - claim: "{claim_text}"
       reason: "single_source" | "conflicting_sources" | "outdated"
       recommendation: "manual_verification_needed"
   ```

### Step 7.3: Gap Analysis

Identify any critical gaps in research coverage:

**Gap Detection:**

1. **Check Original Research Plan:**
   - Compare planned aspects vs. covered aspects
   - Identify missing research areas

2. **Analyze Coverage Depth:**
   - Evaluate depth of coverage for each aspect
   - Flag areas with insufficient detail

3. **Identify Missing Perspectives:**
   - Check if all source categories were utilized
   - Note areas lacking diversity of sources

**Gap Analysis Output:**

```yaml
gap_analysis:
  missing_aspects:
    - "{aspect_not_covered}"
  insufficient_depth:
    - aspect: "{aspect}"
      finding_count: {count}
      recommendation: "needs_more_research"
  missing_source_types:
    - aspect: "{aspect}"
      missing_types: ["academic", "case_study"]
```

**Gap Resolution:**

If critical gaps are found:
- Option A: Spawn targeted supplementary research subagents for specific gaps
- Option B: Document gaps in final output for manual follow-up
- Option C: Proceed with available information and note limitations

### Step 7.4: Conflict Resolution

Resolve conflicts identified during cross-referencing:

**Conflict Resolution Strategy:**

1. **Identify Conflict Severity:**
   - **High**: Contradictory facts that affect recommendations
   - **Medium**: Different perspectives on same topic
   - **Low**: Minor discrepancies in details

2. **Resolution Approaches:**
   | Severity | Resolution Approach |
   |----------|---------------------|
   | High | Manual review required, flag in output |
   | Medium | Present both perspectives with confidence levels |
   | Low | Note discrepancy, use most recent/source with higher credibility |

3. **Document Resolved Conflicts:**
   ```yaml
   resolved_conflicts:
     - topic: "{topic}"
       conflict: "{description}"
       resolution: "{approach}"
       final_confidence: "{level}"
   ```

**Verification Summary:**

```
Verification Complete:
========================================
[Phase 4/6] Verification - Complete
  - Agreements identified: {count}
  - Conflicts identified: {count}
  - Conflicts resolved: {count}
  - Gaps identified: {count}
  - Unverifiable claims: {count}
  - Overall confidence: {high|medium|low}

Research Progress:
========================================
[Phase 1/6] Scope Confirmation - Complete
[Phase 2/6] Research Plan - Complete
[Phase 3/6] Swarm Research - Complete
[Phase 4/6] Verification - Complete
[Phase 5/6] Reflection Loop - Pending
[Phase 6/6] Synthesis - Pending
```

### Step 7.5: Update Research State (Verification Complete)

After verification phase completes, update the research state file:

**State Update:**
```json
{
  "status": "researching",
  "completed_steps": ["scope_confirmation", "research_plan", "swarm_research", "verification"],
  "last_completed_step": "verification",
  "last_updated": "{current_ISO_8601_timestamp}",
  "findings": {
    "cross_reference_result": "{cross_reference_result_from_step_7.1}",
    "gap_analysis": "{gap_analysis_from_step_7.3}"
  }
}
```

**Atomic Write:** Use the same atomic write process as defined in Step 3.3.

## Step 8: Phase 5 -- Reflection Loop

Self-critique and quality assurance with up to 2 iterations maximum.
**Reference**: Quality criteria and thresholds are defined in `docs/research/technical-research-agent-patterns-2026-03-30.md` Section 2.4.

### Step 8.0: Entry Conditions

Before executing the Reflection Loop, verify:
- [ ] Step 7 (Verification) has completed successfully
- [ ] `cross_reference_result` is available (agreements, conflicts, unique findings)
- [ ] `gap_analysis` is available (missing aspects, insufficient depth)
- [ ] `overall_confidence` from verification is available

If any entry condition is not met:
- **HALT** with error: "Cannot execute Reflection Loop without completed Verification phase. Return to Step 7."

### Step 8.1: Five-Point Quality Check

Execute five quality checks against the synthesized research content:

#### Step 8.1.1: Content Completeness Check

Verify all planned aspects are covered with sufficient depth:

```yaml
completeness_check:
  input: research_plan_aspects (from Step 5)
  input: synthesized_findings (from aggregation)
  evaluation:
    - For each planned aspect:
        - Is aspect covered in findings? [yes|no|partial]
        - Depth of coverage: [comprehensive|adequate|superficial]
  scoring:
    - aspect_covered: 1.0 point
    - aspect_partial: 0.5 point
    - aspect_missing: 0.0 point
  threshold: >= 80% of aspects covered with adequate+ depth
```

**Completeness Check Process:**
1. Load research plan from Step 5 (planned aspects list)
2. Load synthesized findings from aggregation
3. For each planned aspect:
   - Check if findings address this aspect
   - Rate depth: comprehensive (fully addressed), adequate (partially addressed), superficial (barely mentioned)
4. Calculate coverage percentage: (covered + 0.5*partial) / total_aspects

#### Step 8.1.2: Citation Validation

Verify all claims have source URLs and URLs are accessible.

```yaml
citation_check:
  input: all_claims_in_content
  input: source_url_list
  evaluation:
    - For each claim:
        - Does claim have source citation? [yes|no]
        - Is source URL valid format? [yes|no]
        - Is source in references section? [yes|no]
  scoring:
    - claim_fully_cited: 1.0 point (has URL + in references)
    - claim_partially_cited: 0.5 point (has URL but not in references)
    - claim_uncited: 0.0 point (no citation)
  threshold: >= 90% of claims cited
```

**Citation Validation Process:**
1. Extract all factual claims from synthesized content
2. For each claim:
   - Verify claim has a source URL citation
   - Verify URL format is valid
   - Verify source is listed in References section
3. Calculate citation percentage: cited_claims / total_claims

#### Step 8.1.3: Structure Consistency Check

Verify output follows the technical_research template schema.

```yaml
structure_check:
  required_sections:
    - Executive Summary
    - Table of Contents
    - Research Methodology
    - Technical Landscape
    - Technology Stack Analysis
    - Integration Patterns
    - Implementation Approaches
    - Performance & Scalability
    - Security Considerations
    - Strategic Recommendations
    - Implementation Roadmap
    - Future Outlook
    - References
  required_frontmatter:
    - type
    - topic
    - date
    - sources
    - ai_optimized
    - version
    - research_confidence
  evaluation:
    - For each required section: [present|missing|incomplete]
    - For each frontmatter field: [present|missing]
  threshold: All required sections present AND all frontmatter fields present
```

**Structure Consistency Process:**
1. Load template structure from `scrum_workflow/templates/technical-research.md`
2. Check each required section exists in synthesized content
3. Check each required frontmatter field exists
4. Pass if all required sections and fields are present

#### Step 8.1.4: Clarity Assessment

Verify writing is clear, actionable, and free of ambiguity.

```yaml
clarity_check:
  evaluation_criteria:
    - Technical_terms_defined: Are specialized terms explained or contextualized?
    - Actionable_recommendations: Do recommendations include specific actions?
    - Ambiguity_flags: Are there vague or unclear statements?
    - Example_availability: Are abstract concepts illustrated with examples?
  scoring:
    - clear: 1.0 point (no ambiguity, actionable)
    - minor_issues: 0.75 point (some unclear sections)
    - needs_improvement: 0.5 point (significant ambiguity)
  threshold: No flagged unclear sections (score >= 0.75)
```

**Clarity Assessment Process:**
1. Review synthesized content for:
   - Technical terms that need context/definition
   - Recommendations that lack specific action items
   - Vague statements that could be interpreted multiple ways
   - Missing examples for abstract concepts
2. Flag sections needing clarification
3. Calculate clarity score based on flagged issues

#### Step 8.1.5: Gap Identification

Compare research plan vs actual coverage, identify missing areas.

```yaml
gap_check:
  input: research_plan_aspects (from Step 5)
  input: actual_coverage (from synthesized findings)
  input: verification_gap_analysis (from Step 7)
  evaluation:
    - For each planned aspect:
        - Coverage status: [fully_covered|partially_covered|not_covered]
    - Gap severity: [critical|minor|none]
    - Gap reason: [missing_sources|insufficient_depth|conflicting_info]
  threshold: <= 2 minor gaps, 0 critical gaps
```

**Gap Identification Process:**
1. Load research plan aspects from Step 5
2. Load actual coverage from synthesized findings
3. Load gap analysis from Step 7 Verification
4. Identify gaps:
   - Not covered: Aspect completely missing from findings
   - Partially covered: Aspect mentioned but lacks depth
   - Conflicting: Different sources provide contradictory information
5. Classify gaps as critical (blocks recommendations) or minor (nice-to-have)

### Step 8.2: Quality Scoring

Calculate overall quality score from five quality checks.

**Quality Score Calculation:**

```yaml
quality_score_calculation:
  weights:
    completeness: 0.25
    citations: 0.25
    structure: 0.20
    clarity: 0.15
    gaps: 0.15
  formula: sum(criterion_score * weight)
  output_range: 0.0 to 1.0
```

**Scoring Example:**
| Criterion | Score | Weight | Weighted Score |
|-----------|-------|--------|----------------|
| Completeness | 0.85 | 0.25 | 0.2125 |
| Citations | 0.92 | 0.25 | 0.2300 |
| Structure | 1.00 | 0.20 | 0.2000 |
| Clarity | 0.80 | 0.15 | 0.1200 |
| Gaps | 0.90 | 0.15 | 0.1350 |
| **Total** | | | **0.8975** |

### Step 8.3: Confidence Level Mapping

Map quality score to confidence level for frontmatter.

```yaml
confidence_mapping:
  thresholds:
    - score: ">= 0.80"
      confidence: high
      description: "All criteria met, multiple sources per claim, comprehensive coverage"
    - score: "0.50 - 0.79"
      confidence: medium
      description: "Most criteria met, some gaps or fewer sources"
    - score: "< 0.50"
      confidence: low
      description: "Significant gaps, few sources, or structural issues"
```

**Set `research_confidence` field based on quality score:**
- Quality score >= 0.80: `research_confidence: high`
- Quality score 0.50-0.79: `research_confidence: medium`
- Quality score < 0.50: `research_confidence: low`

### Step 8.4: Targeted Improvement Loop

If quality score < 0.80, execute targeted improvements.

#### Step 8.4.1: Improvement Action Selection

Select improvement actions based on identified issues:

```yaml
improvement_actions:
  - issue: "missing_information"
    action: "spawn_targeted_research"
    parameters:
      topic: "{gap_topic}"
      scope: "targeted"
      sources: 2-3
      description: "Spawn focused research subagent for specific missing aspect"

  - issue: "unclear_sections"
    action: "rewrite_section"
    parameters:
      section: "{section_name}"
      focus: "clarity_and_specificity"
      description: "Rewrite flagged sections with more specific language and examples"

  - issue: "weak_claims"
    action: "strengthen_claim"
    parameters:
      claim: "{claim_text}"
      options: ["add_sources", "adjust_confidence", "remove_claim"]
      description: "Add supporting sources, adjust confidence level, or remove unsubstantiated claims"

  - issue: "missing_sources"
    action: "search_additional_sources"
    parameters:
      topic: "{claim_topic}"
      min_sources: 2
      description: "Search for additional authoritative references for uncited claims"
```

#### Step 8.4.2: Improvement Execution

Execute selected improvement actions.

**Improvement Execution Process:**
1. Identify which quality checks failed
2. Select appropriate improvement action for each failure
3. Execute improvements:
   - For missing information: Spawn targeted WebSearch for gap topic
   - For unclear sections: Rewrite with specific language and examples
   - For weak claims: Add sources via additional WebSearch
   - For missing sources: Search for authoritative references
4. Update synthesized content with improvements
5. Document changes in improvement log

```yaml
improvement_log_entry:
  iteration: {N}
  timestamp: {ISO timestamp}
  issue: "{issue_type}"
  action_taken: "{action_description}"
  before_score: {score}
  after_score: {score}
```

#### Step 8.4.3: Re-evaluation After Improvement

Re-run quality checks on improved content.

**Re-evaluation Process:**
1. Apply all five quality checks to improved content
2. Calculate new quality score
3. Compare with previous score
4. Determine if quality threshold (0.80) is now met
5. If met: Exit improvement loop
6. If not met and iterations remaining: Continue to next iteration
7. If not met and max iterations reached: Exit with current confidence level

### Step 8.5: Iteration Control

Manage reflection loop iterations to prevent infinite loops.

```yaml
iteration_control:
  max_iterations: 2
  early_exit: true  # Exit if quality threshold met
  quality_threshold: 0.80

  iteration_tracking:
    - iteration: 1
      initial_score: {score}
      improvements: [{list_of_improvements}]
      final_score: {score}
      quality_checks_failed: [{list}]
    - iteration: 2  # Only executed if iteration 1 score < 0.80
      initial_score: {score}
      improvements: [{list_of_improvements}]
      final_score: {score}
      quality_checks_failed: [{list}]
```

**Iteration Rules:**
1. Start with iteration 1
2. After each iteration:
   - If quality score >= 0.80: Early exit with HIGH confidence
   - If quality score < 0.80 and iterations < 2: Continue to next iteration
   - If quality score < 0.80 and iterations= 2: Exit with current confidence level
3. Log each iteration's results for auditability

### Step 8.6: Low Confidence Handling

If final confidence is LOW, generate detailed explanation.

```yaml
low_confidence_output:
  frontmatter:
    research_confidence: low
  document_additions:
    quality_notes_section:
      title: "Quality Notes"
      content:
        - reason: "{specific_reason_1}"
        - reason: "{specific_reason_2}"
        - recommendation: "{area_for_further_research_1}"
        - recommendation: "{area_for_further_research_2}"
  user_notification:
    level: "warning"
    message: "Research confidence is LOW. Review Quality Notes section for details."
```

**Low Confidence Reasons Format:**
```markdown
## Quality Notes

This research output has been rated as **low confidence** due to:

### Identified Issues
1. {specific_issue_1}: {detailed_explanation}
2. {specific_issue_2}: {detailed_explanation}

### Recommended Further Research
1. {area_1}: {why_this_needs_more_research}
2. {area_2}: {why_this_needs_more_research}
```

### Step 8.7: Reflection Summary Output

After reflection loop completes, generate summary.

```
Reflection Loop Complete:
========================================
[Phase 5/6] Reflection Loop - Complete

Quality Check Results:
  - Completeness: {score} ({pass|fail})
  - Citations: {score} ({pass|fail})
  - Structure: {score} ({pass|fail})
  - Clarity: {score} ({pass|fail})
  - Gaps: {score} ({pass|fail})

Overall Quality Score: {score}
Research Confidence: {high|medium|low}
Iterations Executed: {count}

{If iterations > 0:}
Improvement Log:
  - Iteration 1: {improvements_made}
{End if}

{If confidence is low:}
Warning: Research confidence is LOW. Quality Notes section added to output.
{End if}

Research Progress:
========================================
[Phase 1/6] Scope Confirmation - Complete
[Phase 2/6] Research Plan - Complete
[Phase 3/6] Swarm Research - Complete
[Phase 4/6] Verification - Complete
[Phase 5/6] Reflection Loop - Complete
[Phase 6/6] Synthesis - Pending
```

### Step 8.8: Exit Conditions

Before proceeding to Synthesis (Step 9), verify:
- [ ] Five-point quality check has been executed
- [ ] Quality score has been calculated
- [ ] `research_confidence` level has been determined
- [ ] If confidence is LOW, Quality Notes section has been prepared
- [ ] Iteration count logged (0-2)

If all exit conditions are met:
- Proceed to **Step 9: Phase 6 -- Synthesis**

If any exit condition is not met:
- **HALT** with error: "Reflection Loop incomplete. Cannot proceed to Synthesis."

### Step 8.9: Update Research State (Reflection Loop Complete)

After reflection loop completes, update the research state file:

**State Update:**
```json
{
  "status": "reflecting",
  "completed_steps": ["scope_confirmation", "research_plan", "swarm_research", "verification", "reflection_loop"],
  "last_completed_step": "reflection_loop",
  "last_updated": "{current_ISO_8601_timestamp}",
  "findings": {
    "quality_score": "{quality_score_from_step_8.2}",
    "research_confidence": "{confidence_level_from_step_8.3}"
  }
}
```

**Atomic Write:** Use the same atomic write process as defined in Step 3.3.

## Step 9: Phase 6 -- Synthesis

Final document assembly with structured output, executive summary, and strategic recommendations.

### Step 9.1: Generate Output Document

Assemble the final research document with:
- YAML frontmatter (see schema below)
- Executive Summary (2-3 paragraphs for AI context extraction)
- Table of Contents
- Research Methodology
- Technical Landscape analysis
- Technology Stack Analysis
- Integration Patterns
- Implementation Approaches
- Performance & Scalability findings
- Security Considerations
- Strategic Recommendations with priority levels
- Implementation Roadmap with phased approach
- Future Outlook
- References with source URLs and access dates

### Step 9.2: Apply Frontmatter Schema

Generate YAML frontmatter for the output document:

```yaml
---
type: technical_research
topic: {topic}
date: {date}
sources:
  - {source_url_1}
  - {source_url_2}
  - ...
ai_optimized: true
version: 1.0
research_confidence: high  # or medium | low
---
```

Frontmatter field definitions:
- `type`: Must be `technical_research`
- `topic`: Research topic as a concise string
- `date`: Research completion date (YYYY-MM-DD format)
- `sources`: List of source URLs referenced in the research
- `ai_optimized`: Must be `true` -- indicates output structured for AI consumption
- `version`: Schema version (`1.0`)
- `research_confidence`: Confidence level (`high`, `medium`, or `low`)

### Step 9.3: Filename and Output

Generate output filename following the pattern: `technical-research-{topic-slug}-{date}.md`

- Topic slug: kebab-case transformation of the research topic (e.g., "Agentic Patterns for Documentation" becomes "agentic-patterns-for-documentation")
- Date: YYYY-MM-DD format (e.g., "2026-03-30")
- Example: `docs/research/technical-research-agentic-patterns-for-documentation-2026-03-30.md`

Write the assembled document to the output directory (`docs/research/` or custom `--output` path).

### Step 9.4: Update Research State (Synthesis Complete)

After synthesis completes, update the research state file to mark research as complete:

**State Update:**
```json
{
  "status": "complete",
  "completed_steps": ["scope_confirmation", "research_plan", "swarm_research", "verification", "reflection_loop", "synthesis"],
  "last_completed_step": "synthesis",
  "last_updated": "{current_ISO_8601_timestamp}"
  "findings": {
    "quality_score": "{quality_score_from_step_8}",
    "research_confidence": "{confidence_level_from_step_8}"
  }
}
```

**Atomic Write:** Use the same atomic write process as defined in Step 3.3.

## Interruption Handling

This workflow supports graceful handling of interruptions (user cancellation, context limits, errors) with state preservation for recovery.

### Interruption Detection

Interruptions can occur in the following scenarios:
- **User cancellation**: User explicitly cancels the research task
- **Context limit**: Conversation context window is exhausted
- **Error**: Unexpected error during workflow execution
- **Timeout**: Long-running operation exceeds time limits

### Interruption Handler

When an interruption is detected, the workflow:

1. **Capture Current State**:
   ```yaml
   current_step: "{step_being_executed_when_interrupted}"
   current_phase: "{phase_name}"
   accumulated_findings: "{findings_so_far}"
   accumulated_sources: "{sources_so_far}"
   ```

2. **Update State File with Interruption Metadata**:
   ```json
   {
     "status": "interrupted",
     "last_completed_step": "{most_recent_completed_step}",
     "last_updated": "{current_ISO_8601_timestamp}",
     "interruption_metadata": {
       "interruption_time": "{current_ISO_8601_timestamp}",
       "interruption_reason": "user_cancel | context_limit | error | unknown",
       "error_details": "{error_message_if_applicable}",
       "step_in_progress": "{step_being_executed_when_interrupted}"
     }
   }
   ```

3. **Preserve All Accumulated Data**:
   - Keep all existing `completed_steps`
   - Keep all existing `findings`
   - Keep all existing `sources_consulted`

4. **Atomic Write**: Use the same atomic write process to ensure state file is not corrupted.

### User Notification on Interruption

When interruption occurs, notify the user:

```
Research Interrupted
========================================
Reason: {interruption_reason}
Last completed step: {last_completed_step}
Progress preserved in: docs/research/.research-state.json

To resume: Run /scrum-research technical "{topic}" again
```

### Error Handler Wrapper

The main workflow phases (Steps 3-9) should be wrapped with error handling:

```yaml
error_handler:
  phases_to_wrap:
    - step_3_scope_confirmation
    - step_5_research_plan
    - step_6_swarm_research
    - step_7_verification
    - step_8_reflection_loop
    - step_9_synthesis
  on_error:
    - log_error_details
    - update_state_to_interrupted
    - preserve_accumulated_data
    - exit_gracefully
```

## Write Boundaries

**This workflow MAY write:**
- All files under `docs/research/` directory (or custom `--output` path)
- The output research document file
- The research state file: `docs/research/.research-state.json`
- The backup state file: `docs/research/.research-state.backup.json`
- The temporary state file: `docs/research/.research-state.tmp.json`

**This workflow MUST NOT write:**
- Any files outside `docs/research/` (or custom `--output` path)
- This workflow may NOT write to `scrum_workflow/` directory (framework files are read-only during execution)
- Any project source files
- Any configuration files
- Any files in `_scrum-output/sprints/` directory
- Any files in `_scrum-output/docs/` directory (documentation agent output, not research output)
- Any files in `context/` directory
- Any files in `.claude/skills/` (adapter skills are static)

## Gitignore Recommendation

The state files (`.research-state.json`, `.research-state.backup.json`, and `.research-state.tmp.json`) should be added to `.gitignore` as they are local working files not intended for version control. Add these lines to your `.gitignore`:

```
# Research state - checkpoint recovery for long-running research tasks
docs/research/.research-state.json
docs/research/.research-state.backup.json
docs/research/.research-state.tmp.json
```

---

## UPDATE MODE

The following steps are executed when `--update` flag is provided. Update mode enables incremental research updates without regenerating the entire document.

### Step U1: Load Research State

Load the existing research state file to determine when research was last conducted.

**Check for state file:**
```bash
test -f docs/research/.research-state.json
```

**If state file exists:**
1. Read the state file: `read_file("docs/research/.research-state.json")`
2. Parse JSON content
3. Find the research session matching the current topic (by `topic` or `topic_slug` field)
4. Extract:
   - `last_updated`: Date of last research
   - `sources`: List of sources consulted
   - `output_file`: Path to existing research document
   - `research_confidence`: Previous confidence level

**If state file does NOT exist or topic not found:**
- Print warning: "No previous research state found for topic '{topic}'. Running full research."
- Set `execution_mode = "full"`
- Proceed to Step 1 (full research flow)

### Step U2: Load Existing Research Document

Load the existing research document for comparison.

**Locate existing document:**
1. Use `output_file` path from state file, OR
2. Search for document matching pattern: `docs/research/technical-research-{topic-slug}-*.md`

**Read existing document:**
```yaml
existing_document:
  frontmatter: {extracted YAML frontmatter}
  sections: {extracted markdown sections}
  sources: {source URLs from frontmatter}
  date: {research date from frontmatter}
```

**If document not found:**
- Print warning: "Existing research document not found for topic '{topic}'. Running full research."
- Set `execution_mode = "full"`
- Proceed to Step 1 (full research flow)

### Step U3: Targeted Web Research for New Information

Perform targeted WebSearch queries with date filters to find new information since last research.

**Calculate date filter:**
```yaml
last_research_date: {last_updated from state file}
date_filter: "after:{last_research_date}"
```

**Execute date-filtered WebSearch queries:**

```
For each research aspect:
  WebSearch(query="{topic} {aspect} updates {date_filter}", allowed_domains=[])
  WebSearch(query="{topic} {aspect} changes after:{last_research_date}", allowed_domains=[])
```

**Focus areas for update research:**
- New versions or releases
- Updated best practices
- Deprecated approaches
- Security advisories
- Performance improvements
- New tools or frameworks

**Collect new findings:**
```yaml
new_findings:
  - finding: "{new_information}"
    category: "new|updated|deprecated"
    source: "{source_url}"
    date: "{publication_date}"
    relevance: "high|medium|low"
```

### Step U4: Diff Comparison

Compare new findings against existing document content.

**Comparison Process:**

1. **Identify New Information:**
   - Findings not present in existing document
   - New sources not in existing `sources` list
   - New developments since last research date

2. **Identify Changed Information:**
   - Updated recommendations that contradict existing content
   - Version changes (e.g., "v2.0 now recommends X instead of Y")
   - Modified best practices

3. **Identify Deprecated Information:**
   - Approaches marked as deprecated in new findings
   - Security vulnerabilities in previously recommended tools
   - Outdated practices superseded by new developments

**Diff Result Structure:**
```yaml
diff_result:
  new:
    - finding: "{new_finding}"
      section: "{target_section}"
      source: "{source_url}"
  modified:
    - existing_content: "{old_content}"
      new_content: "{updated_content}"
      section: "{section_name}"
      reason: "{why_changed}"
  deprecated:
    - content: "{deprecated_content}"
      section: "{section_name}"
      reason: "{why_deprecated}"
      replacement: "{alternative_approach}"
```

### Step U5: Diff Summary and User Confirmation

Present diff summary to user and obtain confirmation before making changes.

**Generate Diff Summary:**

```
Research Update Available for: {topic}
========================================
Last researched: {last_date}
Time elapsed: {days} days

New Findings Detected:
  +{N} new sources since last research
  ~{M} sections with updated information
  -{O} deprecated/outdated sections

Changed Areas:
  - {section_1}: {brief description of change}
  - {section_2}: {brief description of change}
  ...

Review the changes above. You will be asked to confirm before any files are modified.
```

**User Confirmation Prompt:**

```
Apply these changes? [y/N]
```

**Response Handling:**

| Response | Action |
|----------|--------|
| y / Y | Proceed to Step U6 (Apply Updates) |
| n / N / empty / any other | Exit cleanly, no documents modified |

**If user rejects:**
- Print: "Update cancelled. No documents were modified."
- Exit workflow cleanly

### Step U6: Apply Incremental Updates

Update the research document with new findings while preserving unchanged content.

**Update Process:**

1. **Update Frontmatter:**
   ```yaml
   # Before
   date: {old_date}
   sources:
     - {existing_source_1}
     - {existing_source_2}

   # After
   date: {current_date}
   sources:
     - {existing_source_1}
     - {existing_source_2}
     - {new_source_1}
     - {new_source_2}
   research_confidence: {updated_confidence_if_changed}
   ```

2. **Update Sections with New Findings:**
   - Add new findings to appropriate sections
   - Update changed information with clear notation
   - Mark deprecated information: "~~{deprecated_content}~~ *(deprecated as of {date})*"
   - Preserve all unchanged content exactly as-is

3. **Add Update Notes Section (optional):**
   ```markdown
   ## Update Notes

   This document was updated on {date} with the following changes:
   - {change_1}
   - {change_2}
   ```

**Atomic Write:**
1. Write updated document to temporary file
2. Validate document structure
3. Rename to actual file path

### Step U7: Update Research State

After successful document update, update the research state file.

**State Update:**
```json
{
  "last_updated": "{current_ISO_8601_timestamp}",
  "sources_consulted": "{merged_sources_list}",
  "research_confidence": "{updated_confidence}",
  "update_history": [
    {
      "date": "{update_date}",
      "changes": "{summary_of_changes}",
      "sources_added": {count}
    }
  ]
}
```

**Atomic Write:** Use the same atomic write process as defined in Step 3.3.

**Completion Message:**
```
Research Update Complete
========================================
Document: {output_file}
Sources added: +{count}
Sections updated: ~{count}
Deprecated sections marked: -{count}

Research state updated: docs/research/.research-state.json
```

### Step U8: No New Findings Handling

If Step U4 diff comparison finds no significant changes:

**Detection Criteria:**
- No new sources found with date filters
- No changes to existing recommendations
- No deprecated information identified

**Handling:**
```
No New Information Found
========================================
Last researched: {last_date}
Time elapsed: {days} days

No new information found since last research.
The existing document remains current.

No documents were modified.
Research state was not updated (no changes to record).
```

**Exit cleanly without modifying any files.**
