import { z } from "zod";
import { generateObject } from 'ai';

import type { TaskStateAnnotation, AgentStateAnnotation } from "@/agent/state";
import type { Insight } from "@shared/types";
import { llm } from "@/helpers/llm";

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

export const synthesizeInsightsNode = async (
  state: typeof TaskStateAnnotation.State & typeof AgentStateAnnotation.State
) => {
  const { results, query, currentTask, goal, insights: existingInsights = [] } = state;

  if (!results || results.length === 0) {
    return { insights: existingInsights };
  }

  const prompt = `Based on the following SQL query results, synthesize structured insights that would be useful for a data-driven video presentation.

Goal: ${goal}
Current Task: ${currentTask.description}
Query: ${query}
Results: ${JSON.stringify(results, null, 2)}

Generate insights following these guidelines:
1. Each insight should have a clear, descriptive title
2. The summary should explain what the data means in simple terms
3. Assign a confidence score (0-1) based on data quality and clarity
4. Choose the most appropriate type for each insight
5. Include the relevant data that supports the insight
6. Add metadata if relevant (e.g., units, context, limitations)

Types:
- statistic: A single key metric or fact
- trend: Data showing change over time
- comparison: Comparing different categories or groups
- ranking: Ordered list from highest to lowest
- distribution: How data is spread across categories

Return 1-3 of the most important insights from these results.`;

  try {
    const result = await generateObject({
      model: llm,
      schema: insightSchema,
      prompt,
      temperature: 0.3,
    });

    const newInsights = result.object.insights;
    const allInsights = [...existingInsights, ...newInsights];

    return { insights: allInsights };
  } catch (error) {
    console.error('Error synthesizing insights:', error);
    return { insights: existingInsights };
  }
};