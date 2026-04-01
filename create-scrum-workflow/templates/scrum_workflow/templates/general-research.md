---
type: general_research
topic: {{topic}}
date: {{date}}
sources:
  - {{source_url_1}}
  - {{source_url_2}}
ai_optimized: true
version: 1.0
research_confidence: {{research_confidence}}
---

<!-- GUIDANCE: This template generates AI-optimized general research documents.
     Fill all {{placeholder}} values with actual research content.
     Keep the frontmatter fields synchronized with the document content.

     research_confidence: Set dynamically based on Reflection Loop (Step 8) quality score.
     - high: Quality score >= 0.80 (all criteria met, multiple sources, comprehensive coverage)
     - medium: Quality score 0.50-0.79 (most criteria met, some gaps or fewer sources)
     - low: Quality score < 0.50 (significant gaps, few sources, or structural issues)

     If confidence is LOW, a "Quality Notes" section will be added to the document explaining issues and recommendations.
-->

## Executive Summary

<!-- GUIDANCE: Write 2-3 paragraphs structured for AI context extraction.
     Paragraph 1: What was researched and why (research scope and motivation)
     Paragraph 2: Key findings with specific, verifiable facts
     Paragraph 3: Strategic recommendations and confidence level
     Use bullet points for key findings to enable easy extraction.
-->

{{executive_summary_paragraph_1}}

**Key Findings:**
- {{key_finding_1}}
- {{key_finding_2}}
- {{key_finding_3}}

{{executive_summary_paragraph_2}}

**Strategic Recommendations:**
1. {{recommendation_1}}
2. {{recommendation_2}}
3. {{recommendation_3}}

{{executive_summary_paragraph_3_with_confidence_statement}}

## Market Analysis

<!-- GUIDANCE: Document market size, growth trends, and segment analysis.
     Include quantitative data where available with confidence levels.
-->

### Market Size

| Metric | Value | Source | Confidence |
|--------|-------|--------|------------|
| {{metric_1}} | {{value}} | {{source}} | {{confidence}} |
| {{metric_2}} | {{value}} | {{source}} | {{confidence}} |

### Growth Trends

- **{{trend_1}}**: {{trend_description_and_data}}
- **{{trend_2}}**: {{trend_description_and_data}}

### Market Segments

| Segment | Size | Growth | Key Players |
|---------|------|--------|-------------|
| {{segment_1}} | {{size}} | {{growth_rate}} | {{key_players}} |
| {{segment_2}} | {{size}} | {{growth_rate}} | {{key_players}} |

## Competitive Landscape

<!-- GUIDANCE: Document key players, positioning, strengths/weaknesses.
     Include competitive comparison matrix.
-->

### Key Players

| Company | Market Position | Strengths | Weaknesses |
|---------|-----------------|-----------|------------|
| {{company_1}} | {{position}} | {{strengths}} | {{weaknesses}} |
| {{company_2}} | {{position}} | {{strengths}} | {{weaknesses}} |
| {{company_3}} | {{position}} | {{strengths}} | {{weaknesses}} |

### Competitive Positioning

```mermaid
quadrantChart
    title Competitive Positioning Matrix
    x-axis Low Market Share --> High Market Share
    y-axis Low Growth --> High Growth
    quadrant-1 Leaders
    quadrant-2 Challengers
    quadrant-3 Niche
    quadrant-4 Question Marks
    {{company_1}}: [{{x_1}}, {{y_1}}]
    {{company_2}}: [{{x_2}}, {{y_2}}]
    {{company_3}}: [{{x_3}}, {{y_3}}]
```

## Strategic Recommendations

<!-- GUIDANCE: Provide actionable insights with rationale and priority.
     Enable decision-makers to act on research findings.
-->

### Priority Matrix

| Priority | Recommendation | Impact | Timeline |
|----------|----------------|--------|----------|
| P1 (Critical) | {{recommendation}} | {{impact}} | {{timeline}} |
| P2 (High) | {{recommendation}} | {{impact}} | {{timeline}} |
| P3 (Medium) | {{recommendation}} | {{impact}} | {{timeline}} |

### Actionable Insights

1. **{{insight_title}}**
   - Rationale: {{why_this_matters}}
   - Implementation: {{how_to_implement}}
   - Expected Outcome: {{measurable_result}}

2. **{{insight_title}}**
   - Rationale: {{why_this_matters}}
   - Implementation: {{how_to_implement}}
   - Expected Outcome: {{measurable_result}}

## Implementation Considerations

<!-- GUIDANCE: Document resource requirements, timeline, and dependencies.
     Help teams plan execution of strategic recommendations.
-->

### Resource Requirements

| Resource | Type | Quantity | Cost Estimate |
|----------|------|----------|---------------|
| {{resource_1}} | {{type}} | {{quantity}} | {{cost}} |
| {{resource_2}} | {{type}} | {{quantity}} | {{cost}} |

### Timeline

**Phase 1: {{phase_name}} ({{duration}})**
- {{task_1}}
- {{task_2}}
- Milestone: {{milestone}}

**Phase 2: {{phase_name}} ({{duration}})**
- {{task_1}}
- {{task_2}}
- Milestone: {{milestone}}

### Dependencies

- **{{dependency_1}}**: {{description_and_mitigation}}
- **{{dependency_2}}**: {{description_and_mitigation}}

## Risk Assessment

<!-- GUIDANCE: Identify risks with probability and impact evaluation.
     Provide mitigation strategies for each risk.
-->

### Risk Matrix

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| {{risk_1}} | {{probability}} | {{impact}} | {{mitigation}} | {{owner}} |
| {{risk_2}} | {{probability}} | {{impact}} | {{mitigation}} | {{owner}} |
| {{risk_3}} | {{probability}} | {{impact}} | {{mitigation}} | {{owner}} |

### Critical Risks

1. **{{risk_title}}**
   - Description: {{detailed_description}}
   - Early Warning Signs: {{indicators}}
   - Response Plan: {{actions}}

## Future Outlook

<!-- GUIDANCE: Document trends, projections, and strategic opportunities.
     Help teams anticipate future developments.
-->

### Emerging Trends

- **{{trend_1}}**: {{trend_description_and_implications}}
- **{{trend_2}}**: {{trend_description_and_implications}}

### Projections

| Timeframe | Projection | Confidence |
|-----------|------------|------------|
| Short-term (1 year) | {{projection}} | {{confidence}} |
| Medium-term (2-3 years) | {{projection}} | {{confidence}} |
| Long-term (5+ years) | {{projection}} | {{confidence}} |

### Strategic Opportunities

1. {{opportunity_1}}
2. {{opportunity_2}}
3. {{opportunity_3}}

## References

<!-- GUIDANCE: List all sources with URLs and access dates.
     Use the {{source_url}} placeholder for URLs and include access dates for verification.
-->

| # | Source | URL | Access Date |
|---|--------|-----|-------------|
| 1 | {{source_name_1}} | {{source_url_1}} | {{access_date_1}} |
| 2 | {{source_name_2}} | {{source_url_2}} | {{access_date_2}} |
| 3 | {{source_name_3}} | {{source_url_3}} | {{access_date_3}} |

<!-- GUIDANCE: Add additional source rows as needed.
     Ensure all sources cited in the document are listed here.
     Access dates help track source freshness and enable re-verification.
-->

---

**Research Completion Date:** {{date}}
**Document Version:** 1.0
**Confidence Level:** {{research_confidence}}
