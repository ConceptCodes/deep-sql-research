import { z } from "zod";
import { generateSchemaObject } from "@/helpers/llm";
import type { TaskStateAnnotation } from "@/agent/state";
import { Nodes } from "@shared/constants";
import { Command } from "@langchain/langgraph";

const analysisSchema = z.object({
  isRelevant: z.boolean().describe("Does this data actually answer the user's specific question?"),
  dataQuality: z.enum(["high", "medium", "low", "empty"]).describe("Assessment of the returned data quality"),
  keyPatterns: z.array(z.string()).describe("List of 1-3 key patterns or anomalies visible in the data"),
  suggestedRefinement: z.string().optional().describe("If data is poor/irrelevant, how should the query be fixed?"),
});

/**
 * Helper to summarize data for the LLM (reused from synthesize-insights to ensure consistency)
 */
const summarizeData = (data: any[]): string => {
  if (!Array.isArray(data)) return JSON.stringify(data, null, 2);
  
  const totalRows = data.length;
  const MAX_ROWS = 20; // Smaller sample for quick analysis
  
  if (totalRows === 0) return "No results found.";

  const keys = Object.keys(data[0] || {}).join(", ");
  
  let summary = `Total Rows: ${totalRows}\nColumns: ${keys}\n`;
  summary += JSON.stringify(data.slice(0, MAX_ROWS), null, 2);
  
  return summary;
};

export const analyzeResultsNode = async (
  state: typeof TaskStateAnnotation.State
) => {
  const { results, query, currentTask } = state;

  const dataSummary = summarizeData(results);

  const prompt = `Analyze the following SQL query results for relevance and quality.

Task: ${currentTask.description}
Query Executed: ${query}
Data Summary:
${dataSummary}

Your Job:
1. Check if the results actually answer the Task.
2. Check if the data is empty or garbage.
3. Identify key patterns.

If the data is completely irrelevant or empty (and shouldn't be), suggest a refinement.
`;

  try {
    const analysis = await generateSchemaObject({
      schema: analysisSchema,
      prompt,
      temperature: 0,
    });

    console.log(`\n🔍 Analysis for "${currentTask.description}":`);
    console.log(`- Relevant: ${analysis.isRelevant}`);
    console.log(`- Quality: ${analysis.dataQuality}`);
    if (analysis.suggestedRefinement) {
      console.log(`- Refinement: ${analysis.suggestedRefinement}`);
    }

    // If data is critically bad, we might want to loop back (optional advanced flow)
    // For now, we just attach this analysis to the state to help the synthesizer.
    
    // Note: In a more complex agent, we would return a Command to loop back to GENERATE_QUERY
    // if analysis.isRelevant is false. For now, we pass it forward.

    return {
      // We can store this analysis in a temporary field or just log it.
      // To make it useful, we should probably append it to the 'currentTask' or a new state field.
      // For this refactor, let's append it to the task description or a simplified 'analysis' field if we added one.
      // Since we didn't modify state schema yet, let's just return it as part of the context for the next node
      // by mutating the task description slightly? No, that's hacky.
      
      // Let's assume we pass it to the synthesizer via a new state field 'lastAnalysis'
      // But first we need to update the State definition. 
      // For now, I will just log it and return it, assuming the synthesizer can read 'analysis' if we add it to the state.
      analysis: analysis // We will need to add this to TaskStateAnnotation
    };
  } catch (error) {
    console.error("Error analyzing results:", error);
    return { analysis: null };
  }
};
