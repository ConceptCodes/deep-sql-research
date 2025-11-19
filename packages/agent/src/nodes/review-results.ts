import { z } from "zod";

import type { TaskStateAnnotation } from "@/agent/state";
import { generateSchemaObject } from "@/helpers/llm";

const outputSchema = z.object({
  followUpQuestions: z
    .array(z.string())
    .describe("The follow up questions to ask the user"),
});

export const reviewResultsNode = async (
  state: typeof TaskStateAnnotation.State
) => {
  const { results, query, currentTask } = state;
  
  const result = await generateSchemaObject({
    schema: outputSchema,
    prompt: `Based on the following SQL query results, generate follow-up questions for the user.

Task: ${currentTask.description}
Query: ${query}
Results: ${JSON.stringify(results, null, 2)}`,
    temperature: 0,
  });

  return { followUpQuestions: result.followUpQuestions };
};
