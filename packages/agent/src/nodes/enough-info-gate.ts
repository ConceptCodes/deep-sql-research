import { z } from "zod";

import type { AgentStateAnnotation } from "@/agent/state";
import { generateSchemaObject } from "@/helpers/llm";
import { connectToDatabase, listTableSchemas } from "@/helpers/db";

const decisionSchema = z.object({
  hasEnoughInfo: z.boolean().describe("Whether we have enough insights to answer the user's goal"),
  reasoning: z.string().describe("Reasoning for the decision"),
  missingInfo: z.array(z.string()).optional().describe("What information is still missing, if any"),
});

export const enoughInfoGateNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { goal, insights, tasks, dbUrl } = state;

  // 1. Load Schema to determine what is actually possible
  await connectToDatabase(dbUrl);
  const schema = await listTableSchemas();

  const prompt = `Evaluate whether we have gathered sufficient insights to comprehensively address the user's goal, GIVEN THE CONSTRAINTS of the database schema.

Goal: ${goal}
Tasks completed: ${tasks.length}
Insights gathered: ${insights.length}

DATABASE SCHEMA (The ONLY data available):
${schema}

Current insights:
${insights.map(i => `- ${i.title}: ${i.summary} (${i.type})`).join('\n')}

CRITICAL DECISION LOGIC:
1. Compare the "Goal" against the "Database Schema".
2. Identify what information is missing.
3. **CRITICAL**: check if the missing information *actually exists* in the provided schema.
   - If the missing info requires tables/columns that DO NOT EXIST, you MUST consider the research "complete" regarding that aspect. Do not ask for data that cannot be queried.
   - Example: If the goal asks for "User Demographics" but the schema only has "Movies" and "Views", you cannot get demographics. Mark as done.
4. If we have > 3 solid insights derived from the available tables, that is usually ENOUGH.
5. Safety Valve: If tasks completed > 5, default to 'true' unless we have ZERO insights.

Return your decision about whether we have enough information.`;

  try {
    const result = await generateSchemaObject({
      schema: decisionSchema,
      prompt,
      temperature: 0.1,
    });

    const { hasEnoughInfo, reasoning, missingInfo } = result;

    // Safety Valve: Force exit if we've done too many tasks, even if results are poor.
    // This prevents infinite loops when data is just not there.
    if (tasks.length > 8) {
      console.log(`⚠️ FORCE EXIT: Task limit (8) reached. Proceeding with available info.`);
      return {
        hasEnoughInfo: true,
        feedback: "",
        reasoning: "Force exit due to task limit.",
      };
    }

    console.log(`Enough Info Gate: ${hasEnoughInfo ? 'YES' : 'NO'}`);
    console.log(`Reasoning: ${reasoning}`);
    if (missingInfo) {
      console.log(`Missing info: ${missingInfo.join(', ')}`);
    }

    const feedback = hasEnoughInfo 
      ? "" 
      : `We need more information. Reasoning: ${reasoning}. Missing specific data: ${missingInfo?.join(', ') || 'None specified'}. Existing insights found: ${insights.length}. Please generate new tasks to fill these gaps.`;

    return {
      hasEnoughInfo,
      feedback,
    };
  } catch (error) {
    console.error('Error in enough info gate:', error);
    // Default to continuing if we can't decide
    return { hasEnoughInfo: false, reasoning: 'Error in decision making, continuing', feedback: "Error in gate, please retry." };
  }
};
