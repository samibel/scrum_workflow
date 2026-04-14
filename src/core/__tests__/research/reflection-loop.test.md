# Reflection Loop Test Cases

This document defines test cases for the Reflection Loop pattern implementation in the technical research workflow.

## Test Case 1: Five-Point Quality Check Execution

**Description:** Verify all five quality checks are executed during the reflection loop.

**Test Steps:**
1. Execute content completeness check on synthesized research
2. Execute citation validation on all claims
3. Execute structure consistency check against template schema
4. Execute clarity assessment on content readability
5. Execute gap identification comparing plan vs coverage

**Expected Result:**
- All five quality checks execute and produce scores
- Completeness score calculated
- Citations score calculated
- Structure score calculated
- Clarity score calculated
- Gaps score calculated

## Test Case 2: Iteration Limit Enforcement
**Description:** Verify reflection loop enforces maximum 2 iterations.

**Test Steps:**
1. Run reflection loop with quality score < 0.80
2. Verify improvement actions are executed
3. Run iteration 2 with quality score still < 0.80
4. Verify loop exits after 2 iterations (forced exit)
5. Verify iteration count is logged

**Expected Result:**
- No more than 2 iterations executed
- Quality score and iteration history logged
- Early exit triggered when threshold met

## Test Case 3: Confidence Field Generation
**Description:** Verify confidence field is correctly generated based on quality score.

**Test Steps:**
1. Calculate quality score from five check results
2. Map score to confidence level:
   - >= 0.80 -> HIGH
   - 0.50-0..79 -> MEDIUM
   - < 0.50 -> LOW
3. Set `research_confidence` field in output frontmatter

**Expected Result:**
- Confidence field present in frontmatter
- Value matches quality score mapping

## Test Case 4: Low Confidence Handling
**Description:** Verify low confidence scenario is handled correctly.

**Test Steps:**
1. Set quality score to 0.40 (below threshold)
2. Verify Quality Notes section is added to document
3. Verify specific reasons are generated
4. Verify recommendations for further research are generated
5. Verify warning is logged

**Expected Result:**
- Quality Notes section present in output
- Specific reasons listed
- Recommendations for further research provided
- Warning message logged

## Test Case 5: Integration with Verification Phase
**Description:** Verify reflection loop uses verification phase results as input.

**Test Steps:**
1. Run reflection loop with verification results from Step 7
2. Verify conflicts and gaps are properly used
3. Verify improvements target verification findings
4. Verify confidence level is consistent with verification results

**Expected Result:**
- Reflection loop uses verification results as input
- No duplication of verification logic
- Quality score reflects verification findings

