# Context Index

Domain context discovery index for the scrum_workflow framework. This index maps domain keywords to relevant context files and skill directories, enabling automatic context loading during story implementation.

## Purpose

The context index enables the development workflow to automatically load relevant domain-specific context based on story keywords and requirements. This ensures that implementations follow domain-specific patterns, conventions, and best practices.

## Domain Contexts

### Available Domain Contexts

| Domain | Context File | Skills Directory | Keywords |
|--------|--------------|------------------|----------|
| standards | context/standards.md | - | coding, conventions, naming, formatting |
| architecture | context/architecture-guidelines.md | - | architecture, design, patterns, structure |
| platform | context/platform-adapter-contract.md | - | adapter, platform, integration, contract |
| readiness-check | - | skills/readiness-check/ | validation, completeness, gate, readiness |
| synthesis | - | skills/synthesis/ | perspective, synthesis, refinement, combine |
| feedback-collection | - | skills/feedback-collection/ | feedback, review, quality, perspective |

### Context File Descriptions

**standards.md**: Coding standards, naming conventions (kebab-case for files, snake_case for YAML), status value conventions, and Markdown formatting standards.

**architecture-guidelines.md**: System architecture patterns, design principles, structural guidelines, and architectural decision records.

**platform-adapter-contract**: Adapter layer contract definitions, platform integration patterns, and adapter-specific implementation guidelines.

### Skill Directories

**readiness-check/**: Story completeness validation skill. Validates description, acceptance criteria, estimation, and subtasks before implementation.

**synthesis/**: Perspective synthesis skill. Combines multiple agent perspectives into a coherent story refinement with source attribution.

**feedback-collection/**: Lightweight feedback collection skill. Gathers feedback from multiple agent perspectives with quality tracking.

### Adding New Domain Contexts

To add a new domain context:

1. Create context file: `scrum_workflow/context/{domain}.md`
2. (Optional) Create skill directory: `scrum_workflow/skills/{domain}/SKILL.md`
3. Add entry to this index with:
   - Domain name (kebab-case)
   - Context file path
   - Skills directory path (if applicable)
   - Relevant keywords for automatic discovery

## Keyword Matching Rules

When loading context for a story:
1. Analyze story title and description for keywords
2. Match keywords against domain keyword lists
3. Load all matching domain context files
4. Load all matching domain skills
5. Combine general context (standards.md) with domain-specific context

**Matching Rules:**
- Case-insensitive keyword matching
- Word boundary detection enabled (e.g., "cat" matches "category" but NOT "architecture")
- Partial word matching within word boundaries supported (e.g., "convention" matches "conventions")
- Multiple keywords can match the same domain
- All matching domains are loaded (no domain deduplication needed)
- Regex special characters in keywords are escaped before matching

## Error Handling

- If context/index.md does not exist, development workflow uses general context only
- If specified domain context file does not exist, log warning and continue
- If specified domain skill does not exist, log warning and continue
- Missing domain context is not a fatal error (general context applies)

## Usage in Development Workflow

The development workflow (Step 3: Load Project Context) uses this index to:
1. Discover available domain contexts
2. Match story keywords to domains
3. Load relevant context files before implementation
4. Load relevant skills for domain-specific patterns

This ensures that story implementations are informed by domain knowledge and follow established conventions.
