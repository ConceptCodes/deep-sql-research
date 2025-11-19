import { z } from "zod";

import type { TaskStateAnnotation, AgentStateAnnotation } from "@/agent/state";
import type { Insight } from "@shared/types";
import { generateSchemaObject } from "@/helpers/llm";

const insightSchema = z.object({
  insights: z.array(z.object({
    id: z.string(),
    type: z.enum(['statistic', 'trend', 'comparison', 'ranking', 'distribution']),
    title: z.string(),
    summary: z.string(),
    data: z.any(),
    confidence: z.number().min(0).max(1),
    metadata: z.record(z.any()).optional(),
  })),
});

/**
 * Helper to summarize data for the LLM to prevent context window overflow.
 */
const summarizeData = (data: any[]): string => {
  if (!Array.isArray(data)) return JSON.stringify(data, null, 2);
  
  const totalRows = data.length;
  const MAX_ROWS = 50;
  
  if (totalRows === 0) return "No results found.";

  // Get keys from the first object
  const keys = Object.keys(data[0] || {}).join(", ");
  
  let summary = `Total Rows: ${totalRows}\nColumns: ${keys}\n`;

  if (totalRows > MAX_ROWS) {
    summary += `Showing first ${MAX_ROWS} rows (truncated):\n`;
    summary += JSON.stringify(data.slice(0, MAX_ROWS), null, 2);
    summary += `\n...(and ${totalRows - MAX_ROWS} more rows)`;
  } else {
    summary += JSON.stringify(data, null, 2);
  }

  return summary;
};

export const synthesizeInsightsNode = async (
  state: typeof TaskStateAnnotation.State & typeof AgentStateAnnotation.State
) => {
  const { results, query, currentTask, goal, insights: existingInsights = [], analysis } = state;

  if (!results || results.length === 0) {
    return { insights: existingInsights };
  }

  const dataSummary = summarizeData(results);

  const prompt = `Based on the following SQL query results, synthesize structured insights that would be useful for a data-driven video presentation.

Goal: ${goal}
Current Task: ${currentTask.description}
Query: ${query}
Results Summary:
${dataSummary}

${analysis ? `\nAnalysis of Results:\n- Relevance: ${analysis.isRelevant}\n- Quality: ${analysis.dataQuality}\n- Patterns: ${analysis.keyPatterns?.join(", ") || "None"}\n` : ""}

Generate insights following these guidelines:
1. Each insight should have a clear, descriptive title
2. The summary should explain what the data means in simple terms
3. Assign a confidence score (0-1) based on data quality and clarity
4. Choose the most appropriate type for each insight
5. Include the relevant data that supports the insight (if data is truncated, focus on visible patterns or aggregates)
6. Add metadata if relevant (e.g., units, context, limitations)

Types:
- statistic: A single key metric or fact
- trend: Data showing change over time
- comparison: Comparing different categories or groups
- ranking: Ordered list from highest to lowest
- distribution: How data is spread across categories

Return 1-3 of the most important insights from these results.`;

  try {
    const result = await generateSchemaObject({
      schema: insightSchema,
      prompt,
      temperature: 0.3,
    });

    const newInsights = result.insights;
    const allInsights = [...existingInsights, ...newInsights];

    return { insights: allInsights };
  } catch (error) {
    console.error('Error synthesizing insights:', error);
    return { insights: existingInsights };
  }
};
