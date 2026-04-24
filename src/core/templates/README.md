# Output Templates

This directory contains templates for all workflow phase outputs.

## Purpose

Templates ensure consistent formatting and structure across all generated artifacts in the scrum_workflow framework.

## Structure

Templates are organized by output type:

```
templates/
├── context-*.md          # Project context file templates
├── skill-*.md            # Project skill definition templates
├── story.md              # Story file template
├── concept.md            # Technical concept template
├── refinement.md         # Refinement output template
├── plan.md               # Execution plan template
├── review.md             # Review findings template
└── approval.md           # Approval record template
```

## Template Categories

### Context Templates
- `context-index.md`: Main context index structure
- `context-frontend.md`: Frontend-specific context
- `context-backend.md`: Backend-specific context
- `context-testing.md`: Testing strategy context
- `context-devops.md`: DevOps/CI/CD context
- `context-architecture.md`: Architecture overview context

### Skill Templates
- `skill-backend.md`: Backend development skill
- `skill-frontend.md`: Frontend development skill
- `skill-testing.md`: Testing skill
- `skill-devops.md`: DevOps skill
- `skill-project-architect.md`: Architecture skill

### Workflow Templates
- `story.md`: Story file with YAML frontmatter
- `concept.md`: Technical concept document with analysis graph and solution options
- `refinement.md`: Agent refinement output
- `plan.md`: Implementation plan
- `review.md`: Code review findings
- `approval.md`: Human approval record

### Greenfield Templates
- `brief.md`: Product brief (frontmatter: `brief_id`, `status: captured|interview|complete|decomposed`, `personas`, `goals`, `non_goals`, `open_questions`, `interview_rounds`)
- `epic.md`: Individual epic (frontmatter: `epic_id`, `parent_brief`, `status: planned|drafting|drafted|in-progress`, `epic_index`, `story_count_estimate`, `domain_tags`)
- `epic-index.md`: Epic index with Mermaid dependency graph (frontmatter: `parent_brief`, `epic_count`, `epics[]`)
- `draft-stories.md`: Aggregated draft candidates for one epic (frontmatter: `parent_epic`, `drafts[]` with index/title/sw_id_suggestion/type/risk_level/domain_tags)

## Usage

Workflows use templates to generate consistent output files, ensuring all artifacts follow the same structure and formatting conventions.
