import { z } from "zod";
import { generateObject } from 'ai';

import type { AgentStateAnnotation } from "@/agent/state";
import { Nodes } from "@shared/constants";
import { llm } from "@/helpers/llm";

const decisionSchema = z.object({
  hasEnoughInfo: z.boolean().describe("Whether we have enough insights to answer the user's goal"),
  reasoning: z.string().describe("Reasoning for the decision"),
  missingInfo: z.array(z.string()).optional().describe("What information is still missing, if any"),
});

export const enoughInfoGateNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { goal, insights, tasks } = state;

  const prompt = `Evaluate whether we have gathered sufficient insights to comprehensively address the user's goal.

Goal: ${goal}
Tasks completed: ${tasks.length}
Insights gathered: ${insights.length}

Current insights:
${insights.map(i => `- ${i.title}: ${i.summary} (${i.type})`).join('\n')}

Consider:
1. Do the insights cover the main aspects of the goal?
2. Is there enough variety in insight types?
3. Are there obvious gaps in the information?
4. Would additional queries provide significantly more value?

Return your decision about whether we have enough information.`;

  try {
    const result = await generateObject({
      model: llm,
      schema: decisionSchema,
      prompt,
      temperature: 0.1,
    });

    const { hasEnoughInfo, reasoning, missingInfo } = result.object;

    console.log(`Enough Info Gate: ${hasEnoughInfo ? 'YES' : 'NO'}`);
    console.log(`Reasoning: ${reasoning}`);
    if (missingInfo) {
      console.log(`Missing info: ${missingInfo.join(', ')}`);
    }

    // If we don't have enough info, we need to continue with more tasks
    // If we do have enough info, we can proceed to the next phase (narrative generation)
    
    return {
      hasEnoughInfo,
      reasoning,
      missingInfo,
    };
  } catch (error) {
    console.error('Error in enough info gate:', error);
    // Default to continuing if we can't decide
    return { hasEnoughInfo: false, reasoning: 'Error in decision making, continuing' };
  }
};