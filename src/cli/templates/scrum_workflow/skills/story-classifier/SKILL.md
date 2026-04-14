---
name: story-classifier
role: "story-type-and-risk-classifier"
description: "Analyzes story description, domain tags, and keywords to automatically classify stories by type (feature, bugfix, refactor, infrastructure) and risk level (low, medium, high, critical) during /scrum-create-ticket"
---

# Identity

The story-classifier skill is a read-only classifier that analyzes a story's description, domain tags, and keywords to determine the story's `type` and `risk_level`. It is invoked internally by the `/scrum-create-ticket` command after the story description is generated but before the story file is finalized. The classifier returns a structured result; it never writes files directly. The calling workflow (create-ticket) is responsible for writing the classification results into the story's YAML frontmatter.

This skill implements FR-32: automatic classification of stories by type (feature, bugfix, refactor, infrastructure) and risk level (low, medium, high, critical).

**Valid type values:** `feature`, `bugfix`, `refactor`, `infrastructure`
**Valid risk_level values:** `low`, `medium`, `high`, `critical`

# Instructions

## Classification Algorithm

The classifier uses a layered approach with four phases: keyword extraction, domain tag analysis, content complexity heuristics, and confidence scoring. Classification rules are defined in `scrum_workflow/data/classification-rules.yaml`.

### Phase 1: Keyword Extraction and Matching

Scan the story description for type-indicator keywords defined in `classification-rules.yaml`:

- **bugfix** indicators: "fix", "bug", "defect", "broken", "regression", "patch", "hotfix", "error", "crash", "issue"
- **refactor** indicators: "refactor", "clean up", "restructure", "simplify", "migrate", "extract", "consolidate", "reorganize", "decouple", "modernize"
- **infrastructure** indicators: "CI/CD", "deploy", "deployment", "pipeline", "docker", "build", "infrastructure", "monitoring", "environment", "devops", "terraform", "kubernetes", "helm"
- **feature** indicators: "implement", "add", "create", "new", "enable", "support", "introduce" (also the default type)

**Matching rules:**
1. Count keyword hits for each type category
2. The type with the most keyword hits wins
3. If there is a tie, prefer the more specific type (bugfix > refactor > infrastructure > feature)
4. If no keywords match any category, the type defaults to `feature` (safe default)

### Phase 2: Domain Tag Analysis for Risk Level

Read the `domain_tags` array from the story frontmatter and map tags to risk levels using `classification-rules.yaml`:

- **critical** risk tags: `payment-processing`, `financial-data`, `compliance`
- **high** risk tags: `security`, `authentication`, `payment`, `data-migration`, `breaking-change`, `authorization`, `encryption`, `pii`
- **low** risk tags: `documentation`, `ui-cosmetic`, `typo`, `config`, `logging`, `readme`, `comment`
- **medium** risk: default for unrecognized tags (safe default)

**Mapping rules:**
1. Check each domain tag against the risk level mappings
2. The highest risk level among all matched tags wins (critical > high > medium > low)
3. If no domain tags are provided or none match, risk_level defaults to `medium` (safe default)

### Phase 3: Content Complexity Heuristics

Apply content analysis heuristics to adjust the classification:

1. **Multiple domain tags increase risk:** If the story has 3 or more domain tags, increase the risk level by one tier (low -> medium, medium -> high, high -> critical, critical stays critical)
2. **Security/auth pattern detection:** If the story description mentions auth or security patterns (keywords like "security", "authentication", "authorization", "encrypt", "password", "token", "credential", "vulnerability"), force a minimum `risk_level: high` regardless of other signals
3. **Under-specified description detection:** If the story description length is less than 50 characters, flag it as potentially under-specified and add a note to the classification_note field

### Phase 4: Confidence Scoring

Assign a confidence level to the classification based on signal strength:

- **High confidence:** Clear keyword match for type AND domain tag alignment for risk level. Both signal sources agree on the classification.
- **Medium confidence:** Keyword match only OR domain tag only. Only one signal source provides classification information.
- **Low confidence:** No clear signals detected. Neither keywords nor domain tags provide classification information. Apply safe defaults (`type: feature`, `risk_level: medium`) and add a review note.

## Safe Defaults (Ambiguous Cases)

When the classifier cannot determine a clear type or risk level (ambiguous or no clear signals):

- **Default type:** `feature` — the most common story type and the least dangerous if wrong
- **Default risk_level:** `medium` — a balanced starting point that neither under- nor over-estimates risk

These safe defaults are applied when confidence is low. When defaults are applied, the `classification_note` field is populated with: "Classification auto-assigned with low confidence. Please review type and risk_level."

## Manual Override

Developers can manually override the `type` and `risk_level` fields by directly editing the YAML frontmatter in the story.md file. Since the scrum_workflow uses the Markdown-as-Code paradigm, manual edits to frontmatter fields are inherently supported — no special mechanism is needed. The developer simply edits the YAML directly.

Downstream commands (including Story 9.2 adaptive workflow depth selection) respect the frontmatter values regardless of whether they were set by the classifier or manually edited by the developer. The frontmatter is the authoritative source for type and risk_level.

# Output Format

Return a structured YAML result to the calling workflow:

```yaml
type: feature          # One of: feature, bugfix, refactor, infrastructure
risk_level: medium     # One of: low, medium, high, critical
confidence: high       # One of: high, medium, low
classification_confidence: high  # Same as confidence, for frontmatter population
classification_note: null        # Review note (populated when confidence is low)
```

**Field descriptions:**
- `type:` The classified story type based on keyword extraction and content analysis
- `risk_level:` The classified risk level based on domain tag analysis and content heuristics
- `confidence:` Overall confidence in the classification (high, medium, low)
- `classification_confidence:` Same as confidence — used to populate the story frontmatter field
- `classification_note:` A human-readable note. Set to "Classification auto-assigned with low confidence. Please review type and risk_level." when confidence is low. Otherwise null.

# Context Rules

## Reads

- Story description text (provided by the calling workflow)
- Story `domain_tags` array from the story frontmatter (provided by the calling workflow)
- Classification rules: `scrum_workflow/data/classification-rules.yaml`
- This skill is a read-only classifier. It does not write files. It returns structured results to the calling workflow.

## Writes

This skill never writes files. It is a read-only classification capability that returns structured results to the orchestrating workflow (`/scrum-create-ticket`). The calling workflow is responsible for writing the `type`, `risk_level`, `classification_confidence`, and any `classification_note` into the story file's YAML frontmatter.
