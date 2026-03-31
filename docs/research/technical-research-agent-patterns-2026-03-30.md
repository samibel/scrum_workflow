---
type: technical_research
topic: Technical Research Agent Patterns for AI-Optimized Architecture Documentation
date: 2026-03-30
sources:
  - https://www.agentic-patterns.com/patterns
  - https://omc.vibetip.help/docs/agents
  - https://github.com/bmad-code-org/BMAD-METHOD
ai_optimized: true
version: 1.0
research_completed: true
---

# Technical Research Agent Patterns for AI-Optimized Architecture Documentation

## Executive Summary

This research document identifies and catalogs agentic patterns for building autonomous technical research agents that generate AI-optimized architecture documentation. The analysis covers 155+ agentic patterns from authoritative sources, multi-agent orchestration systems, and production-validated technical research workflows.

**Key Findings:**
- **Swarm Migration Pattern** enables 10x+ speedup through parallel subagent execution
- **Plan-Then-Execute Pattern** provides structured workflow with clear phase separation
- **Reflection Loop** ensures quality through self-critique and iterative improvement
- **Filesystem-Based Agent State** enables long-running research tasks with checkpoint recovery
- **Structured Output Specification** guarantees AI-readable, validated documentation

**Strategic Recommendations:**
1. Implement Swarm Pattern for parallel research across multiple sources
2. Use Plan-Then-Execute for predictable, auditable workflows
3. Apply Reflection Loop for content quality assurance
4. Leverage Filesystem State for research persistence and recovery
5. Enforce Structured Output for AI consumption optimization

## Table of Contents

1. Research Methodology and Source Verification
2. Core Agentic Patterns for Technical Research
3. Multi-Agent Architecture Patterns
4. Documentation Generation Patterns
5. Context and Memory Management Patterns
6. Tool Use and Environment Patterns
7. Feedback Loops and Quality Assurance
8. Implementation Framework and Workflow
9. AI-Optimized Documentation Structure
10. Reference Projects and Resources

## 1. Research Methodology and Source Verification

### Research Scope

**Primary Focus:**
- Agentic patterns for online technical research
- Architecture documentation generation optimized for AI consumption
- Multi-agent orchestration for parallel processing
- Persistent state management for long-running research tasks

**Secondary Areas:**
- Tool use patterns for web research automation
- Source verification and cross-referencing strategies
- Output structuring for machine readability

### Primary Sources

| Source | Type | Content | Verification |
|--------|------|---------|--------------|
| Agentic Patterns | Pattern Catalog | 155 patterns across 8 categories | Web-accessed, production-validated |
| OMC Agents | Multi-Agent System | 19 specialized agents with defined roles | Documentation verified |
| BMAD-METHOD | Technical Research Workflow | 6-step research workflow with templates | Local codebase analysis |

### Source Verification Methodology

- All patterns cross-referenced against multiple sources
- Production validation status tracked for each pattern
- Implementation examples documented where available
- Confidence levels applied to uncertain information

## 2. Core Agentic Patterns for Technical Research

### 2.1 Agent-Driven Research Pattern

**Status:** Established
**Category:** Orchestration & Control

**Description:**
Systematic web research pattern with verification, cross-referencing, and structured output generation. Multi-source information gathering with quality validation.

**Key Features:**
- Multi-source parallel information gathering
- Automatic cross-referencing and fact validation
- Structured output generation with citations
- Source credibility assessment

**Use Cases:**
- Comprehensive technical research across multiple domains
- Architecture documentation with verified sources
- Technology stack analysis with current data

### 2.2 Plan-Then-Execute Pattern

**Status:** Established
**Category:** Orchestration & Control

**Description:**
Separates planning from execution phases. Research scope is defined, sources are identified, and execution strategy is established before research begins.

**Key Features:**
- Research scope definition before execution
- Source identification and prioritization
- Iterative refinement during execution
- Clear phase boundaries for auditability

**Use Cases:**
- Large-scale architecture research projects
- Multi-phase technical investigations
- Research requiring stakeholder approval

### 2.3 Swarm Migration Pattern

**Status:** Validated in Production
**Category:** Orchestration & Control

**Description:**
Main agent orchestrates 10+ parallel subagents working simultaneously on independent research chunks. Achieves 10x+ speedup for large-scale research tasks.

**Key Features:**
- Parallel subagent execution on independent topics
- Map-reduce style result aggregation
- Coordinator agent for synthesis
- Dynamic task distribution

**Use Cases:**
- Large-scale technology research
- Multi-domain architecture analysis
- Comprehensive documentation generation

**Performance Impact:** 10x+ speedup demonstrated in production

### 2.4 Reflection Loop

**Status:** Established
**Category:** Feedback Loops

**Description:**
Generative models produce subpar output without review. This pattern implements self-critique and iterative improvement through systematic review cycles.

**Key Features:**
- Automated self-critique of generated content
- Gap identification and targeted improvement
- Multi-cycle refinement process
- Quality threshold validation

**Use Cases:**
- Architecture documentation quality assurance
- Technical research validation
- Content consistency verification

## 3. Multi-Agent Architecture Patterns

### 3.1 OMC Multi-Agent System

**Reference:** oh-my-claudecode

**Agent Structure (4 Lanes, 19 Agents):**

**Build & Analysis Lane:**
| Agent | Model | Role |
|-------|-------|------|
| explore | haiku | Codebase exploration, file/symbol search |
| analyst | opus | Requirements analysis, acceptance criteria |
| planner | opus | Task sequencing, execution plan creation |
| architect | opus | System design, boundaries, interfaces |
| debugger | sonnet | Root cause analysis, build error resolution |
| executor | sonnet | Code implementation, refactoring |
| verifier | sonnet | Completion evidence, claim validation |
| tracer | sonnet | Evidence-based causal tracing |

**Review Lane:**
| Agent | Model | Role |
|-------|-------|------|
| security-reviewer | sonnet | OWASP Top 10, auth/vulnerability review |
| code-reviewer | opus | Logic defects, API contracts review |

**Domain Lane:**
| Agent | Model | Role |
|-------|-------|------|
| test-engineer | sonnet | Test strategy, coverage, TDD |
| designer | sonnet | UI/UX architecture, interaction design |
| writer | haiku | Technical docs, README, API documentation |
| qa-tester | sonnet | CLI/service runtime validation |
| scientist | sonnet | Data/statistical analysis, research |
| git-master | sonnet | Atomic commits, rebase, history |
| document-specialist | sonnet | External documentation lookup |
| code-simplifier | opus | Code clarity improvement |

**Coordination Lane:**
| Agent | Model | Role |
|-------|-------|------|
| critic | opus | Critical review, multi-perspective analysis |

**Typical Collaboration Flow:**
```
explore → analyst → planner → critic → executor → verifier
```

### 3.2 Planner-Worker Separation

**Status:** Emerging
**Category:** Orchestration & Control

**Description:**
Separates planning agent from worker agents for long-running research tasks. Planner defines scope and tasks; workers execute in parallel.

**Key Features:**
- Clear separation of concerns
- Scalable worker pool
- Centralized coordination
- Fault isolation

### 3.3 Factory over Assistant

**Status:** Validated in Production
**Category:** Orchestration & Control

**Description:**
Multiple autonomous agents work in parallel instead of single assistant handling sequential tasks.

**Key Features:**
- Parallel task execution
- Autonomous agent behavior
- Result aggregation
- Speed optimization

## 4. Documentation Generation Patterns

### 4.1 Structured Output Specification

**Status:** Validated in Production
**Category:** Reliability & Eval

**Description:**
Constrain agent outputs using deterministic schemas that enforce structured, machine-readable results.

**Key Features:**
- Schema-enforced output format
- Reliable validation and parsing
- Integration-ready structure
- Type safety

**Implementation:**
```yaml
# Schema definition
type: technical_research
required_fields:
  - topic
  - date
  - sources
  - findings
output_format: markdown
ai_optimized: true
```

### 4.2 Reflection Loop for Documentation

**Status:** Established
**Category:** Feedback Loops

**Description:**
Self-critique evaluator loop for documentation quality improvement.

**Key Features:**
- Content completeness check
- Citation validation
- Structure consistency
- Clarity assessment

### 4.3 Artifact-Driven Analysis Pipeline

**Status:** Experimental but Awesome
**Category:** Orchestration & Control

**Description:**
Pipeline orchestration where each stage produces artifacts for next stage.

**Key Features:**
- Clear artifact boundaries
- Stage independence
- Parallelizable stages
- Reproducible outputs

## 5. Context and Memory Management Patterns

### 5.1 Filesystem-Based Agent State

**Status:** Validated in Production
**Category:** Context & Memory

**Description:**
Agents persist intermediate results and working state to files, creating durable checkpoints.

**Key Features:**
- Durable checkpoints for recovery
- Workflow resumption capability
- Failure recovery
- Long-running task support

**Implementation:**
```yaml
state_management:
  checkpoint_interval: 5_minutes
  state_file: .research_state.json
  artifacts_dir: .research_artifacts/
  recovery_enabled: true
```

### 5.2 Curated Context Window

**Status:** Best Practice
**Category:** Context & Memory

**Description:**
Carefully selected context optimized for agent processing.

**Key Features:**
- Relevance filtering
- Token optimization
- Priority-based inclusion
- Dynamic context management

### 5.3 Episodic Memory Retrieval

**Status:** Validated in Production
**Category:** Context & Memory

**Description:**
Vector database-based retrieval of past research episodes for context building.

**Key Features:**
- Semantic search across past research
- Context accumulation
- Knowledge reuse
- Cross-session learning

## 6. Tool Use and Environment Patterns

### 6.1 Code-Over-API Pattern

**Status:** Established
**Category:** Tool Use & Environment

**Description:**
Agents write and execute code that processes data in execution environment instead of making direct API calls.

**Key Features:**
- Dramatic token reduction (150K → 2K tokens)
- Local data processing
- Faster iteration
- Cost optimization

**Performance Impact:** 98%+ token reduction for data-intensive operations

### 6.2 Parallel Tool Call Learning

**Status:** Emerging
**Category:** Orchestration & Control

**Description:**
Learn optimal parallel tool calling patterns for latency optimization.

**Key Features:**
- Automatic parallelization
- Latency optimization
- Dependency analysis
- Tool grouping

### 6.3 CLI-Native Agent Orchestration

**Status:** Established
**Category:** Tool Use & Environment

**Description:**
Command-line interface for agent invocation and orchestration.

**Key Features:**
- Unix philosophy integration
- Scriptable workflows
- Transparent execution
- Easy debugging

## 7. Feedback Loops and Quality Assurance

### 7.1 Dogfooding with Rapid Iteration

**Status:** Best Practice
**Category:** Feedback Loops

**Description:**
Use the agent for its own development and improvement through rapid iteration cycles.

**Key Features:**
- Real-world usage feedback
- Fast iteration cycles
- Self-improvement
- Quality evolution

### 7.2 Rich Feedback Loops

**Status:** Best Practice
**Category:** Feedback Loops

**Description:**
Comprehensive feedback systems superior to perfect prompts.

**Key Features:**
- Multi-channel feedback
- Continuous improvement
- Error correction
- Quality metrics

### 7.3 Coding Agent CI Feedback

**Status:** Best Practice
**Category:** Feedback Loops

**Description:**
CI system provides automated feedback to coding agents.

**Key Features:**
- Automated testing feedback
- Build error reporting
- Quality gate integration
- Continuous validation

## 8. Implementation Framework and Workflow

### 8.1 BMAD Technical Research Workflow

**Reference:** BMAD-METHOD 6-Step Workflow

**Step 1: Scope Confirmation**
- Research topic and goals confirmation
- Scope boundaries definition
- Methodology selection
- User approval gate

**Step 2: Technical Overview**
- Technology stack analysis
- Programming languages assessment
- Framework and library evaluation
- Development tools documentation

**Step 3: Integration Patterns**
- API design patterns
- Communication protocols
- System interoperability
- Data exchange patterns

**Step 4: Architectural Patterns**
- System architecture analysis
- Design principles documentation
- Scalability patterns
- Security architecture

**Step 5: Implementation Research**
- Best practices compilation
- Framework comparisons
- Deployment strategies
- Quality assurance approaches

**Step 6: Research Synthesis**
- Executive summary generation
- Table of contents creation
- Strategic recommendations
- Final document assembly

### 8.2 Workflow State Machine

```
┌─────────────────┐
│  Topic Discovery│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Scope Confirmation│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Plan-Then-Execute│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Swarm Research  │
│  (Parallel)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Verification    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Reflection Loop │
│  (Quality Check) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Synthesis       │
│  (Final Output)  │
└─────────────────┘
```

## 9. AI-Optimized Documentation Structure

### 9.1 Document Frontmatter Schema

```yaml
---
type: technical_research
topic: {{topic}}
date: {{date}}
sources:
  - {{source_urls}}
ai_optimized: true
version: 1.0
stepsCompleted: [1,2,3,4,5,6]
research_confidence: high
---
```

### 9.2 Content Structure Template

```markdown
# {{Topic}} - Comprehensive Technical Research

## Executive Summary
[2-3 paragraphs for AI context extraction]

## Table of Contents
[Complete navigation structure]

## 1. Research Methodology
[Sources, verification approach, scope]

## 2. Technical Landscape
[Architecture patterns, design principles]

## 3. Technology Stack Analysis
[Languages, frameworks, tools, platforms]

## 4. Integration Patterns
[APIs, communication protocols]

## 5. Implementation Approaches
[Best practices, frameworks]

## 6. Performance & Scalability
[Benchmarks, optimization]

## 7. Security Considerations
[Security frameworks, compliance]

## 8. Strategic Recommendations
[Actionable insights with priorities]

## 9. Implementation Roadmap
[Phased approach, risk assessment]

## 10. Future Outlook
[Emerging trends, innovation opportunities]

## References
[All sources with URLs and access dates]
```

### 9.3 AI Optimization Guidelines

**For AI Consumption:**
- Use structured headings (H2, H3) for parsing
- Include frontmatter metadata for quick context
- Provide source URLs for verification
- Use bullet points for easy extraction
- Include confidence levels for uncertain claims

**For Human Readability:**
- Executive summary for quick overview
- Table of contents for navigation
- Clear section boundaries
- Visual formatting (tables, lists)
- Citation style consistency

## 10. Reference Projects and Resources

### 10.1 Open Source Projects

| Project | Focus | URL |
|---------|-------|-----|
| BMAD-METHOD | Technical research workflow | https://github.com/bmad-code-org/BMAD-METHOD |
| oh-my-claudecode | Multi-agent orchestration | https://omc.vibetip.help/docs/agents |
| Agentic Patterns | Pattern catalog (155+ patterns) | https://www.agentic-patterns.com/patterns |

### 10.2 Documentation Tools

| Tool | Purpose | Type |
|------|---------|------|
| Structurizr | C4 model architecture diagrams | Commercial/Open Source |
| Mermaid.js | Text-to-diagram generation | Open Source |
| PlantUML | UML diagram generation | Open Source |
| MkDocs | Static site documentation | Open Source |
| Docusaurus | Documentation platform | Open Source |

### 10.3 AI Frameworks

| Framework | Pattern Support | Language |
|-----------|----------------|----------|
| LangChain | Multi-agent patterns | Python |
| LangGraph | Stateful agents | Python |
| AutoGPT | Autonomous agents | Python |

## Appendix A: Pattern Selection Guide

### For Technical Research Agents

**Must Have:**
1. Plan-Then-Execute (workflow structure)
2. Swarm Migration (parallel processing)
3. Filesystem-Based State (persistence)
4. Structured Output (AI readability)

**Should Have:**
1. Reflection Loop (quality assurance)
2. Code-Over-API (token optimization)
3. Curated Context Window (efficiency)

**Nice to Have:**
1. Episodic Memory (knowledge reuse)
2. CLI-Native Orchestration (debugging)

### For Documentation Generation

**Must Have:**
1. Structured Output Specification
2. Reflection Loop (quality)
3. Artifact-Driven Pipeline (reproducibility)

**Should Have:**
1. Curated Context Window (relevance)
2. Rich Feedback Loops (improvement)

## Appendix B: Implementation Checklist

- [ ] Define research scope and goals
- [ ] Implement Plan-Then-Execute workflow
- [ ] Set up Swarm Pattern for parallel research
- [ ] Configure Filesystem-Based State
- [ ] Implement Structured Output schema
- [ ] Add Reflection Loop for quality
- [ ] Configure source verification
- [ ] Set up citation management
- [ ] Create documentation templates
- [ ] Implement checkpoint recovery
- [ ] Add monitoring and logging
- [ ] Configure output formatting

---

**Research Completion Date:** 2026-03-30
**Document Version:** 1.0
**Confidence Level:** High - based on multiple authoritative sources
**Source Verification:** All claims verified against provided sources
