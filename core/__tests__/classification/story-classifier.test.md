# Story Classifier ATDD Test Scenarios

## Story Reference
- **Story:** 9.1 - Implement Story Classifier
- **FR:** FR-32 - Classification by type and risk level
- **Test Level:** BDD-style acceptance test scenarios

---

## Scenario 1: Bugfix Type Classification (AC #1)

**Given** a story description containing "fix bug in login flow"
**And** domain_tags: ["authentication"]
**When** the story-classifier skill analyzes the description
**Then** the classification result should be:
  - `type: bugfix` (keywords "fix" and "bug" match bugfix indicators)
  - `risk_level: high` (domain tag "authentication" maps to high risk)
  - `confidence: high` (keyword match + domain tag alignment)

---

## Scenario 2: Refactor Type Classification (AC #1)

**Given** a story description containing "refactor the data access layer to simplify queries"
**And** domain_tags: []
**When** the story-classifier skill analyzes the description
**Then** the classification result should be:
  - `type: refactor` (keywords "refactor" and "simplify" match refactor indicators)
  - `risk_level: medium` (no domain tags -> medium default)
  - `confidence: medium` (keyword match only, no domain tag signal)

---

## Scenario 3: Infrastructure Type Classification (AC #1)

**Given** a story description containing "set up CI/CD pipeline for automated deployment"
**And** domain_tags: ["devops"]
**When** the story-classifier skill analyzes the description
**Then** the classification result should be:
  - `type: infrastructure` (keywords "CI/CD", "pipeline", "deployment" match infrastructure indicators)
  - `risk_level: medium` (domain tag "devops" not in high/low lists -> medium)
  - `confidence: medium` (keyword match only)

---

## Scenario 4: Feature Type Classification (AC #1)

**Given** a story description containing "implement user dashboard with real-time notifications"
**And** domain_tags: ["ui"]
**When** the story-classifier skill analyzes the description
**Then** the classification result should be:
  - `type: feature` (keyword "implement" matches feature, and default for new functionality)
  - `risk_level: medium` (domain tag "ui" not in high/low lists -> medium)
  - `confidence: medium` (keyword match only)

---

## Scenario 5: Ambiguous Description - Safe Defaults (AC #3)

**Given** a story description containing "update the thing"
**And** domain_tags: []
**When** the story-classifier skill analyzes the description
**Then** the classification result should be:
  - `type: feature` (safe default - no clear type signal)
  - `risk_level: medium` (safe default - no domain tags)
  - `confidence: low` (no clear signals)
  - `classification_note: "Classification auto-assigned with low confidence. Please review type and risk_level."`

---

## Scenario 6: Security Domain Tag -> High Risk (AC #1)

**Given** a story description containing "add password reset functionality"
**And** domain_tags: ["security", "authentication"]
**When** the story-classifier skill analyzes the description
**Then** the classification result should be:
  - `type: feature` (keyword "add" matches feature)
  - `risk_level: high` (domain tags "security" and "authentication" both map to high risk)
  - `confidence: high` (keyword match + domain tag alignment)

---

## Scenario 7: Frontmatter Population After /scrum-create-ticket (AC #1, #2)

**Given** a developer runs `/scrum-create-ticket SW-042 "fix broken authentication flow"`
**When** the create-ticket command completes
**Then** the generated story.md file should contain:
  - `type: bugfix` in YAML frontmatter
  - `risk_level: high` in YAML frontmatter (if domain_tags include security/auth)
  - `classification_confidence: high` in YAML frontmatter
  - Type and risk_level are visible and directly editable by the developer (AC #2)

---

## Scenario 8: Manual Override (AC #2)

**Given** a story was created with classifier-assigned `type: feature` and `risk_level: medium`
**When** the developer manually edits the YAML frontmatter to `type: bugfix` and `risk_level: high`
**Then** the manually edited values persist in the story file
**And** downstream commands (e.g., adaptive workflow depth) use the manually edited values
**And** no re-classification occurs automatically

---

## Scenario 9: Low Confidence Review Note (AC #3)

**Given** a story description with no clear type or risk signals
**When** the classifier returns `confidence: low`
**Then** the create-ticket command adds a note in the story body:
  > "Classification auto-assigned with low confidence. Please review type and risk_level."
**And** the developer is alerted to review the classification

---

## Scenario 10: Multiple Domain Tags Increase Risk (AC #1)

**Given** a story with domain_tags: ["api", "database", "caching", "performance"]
**When** the story-classifier applies content heuristics
**Then** the risk level is increased by one tier due to having 3+ domain tags
**And** if base risk was "medium", it becomes "high"
