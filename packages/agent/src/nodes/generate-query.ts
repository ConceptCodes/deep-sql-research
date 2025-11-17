import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import {
  generateQuerySystemPrompt,
  generateSqlQueryPrompt,
} from "@/agent/prompts";
import type { TaskStateAnnotation } from "@/agent/state";
import { llm } from "@/helpers/llm";
import { listTableSchemas } from "@/helpers/db";

const outputSchema = z.object({
  query: z
    .string()
    .describe("The generated SQL query based on the user request"),
  params: z
    .array(z.string())
    .describe("The parameters for the SQL query, if any"),
});

export const generateQueryNode = async (
  state: typeof TaskStateAnnotation.State
): Promise<typeof TaskStateAnnotation.Update> => {
  const { currentTask, error } = state;

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = generateSqlQueryPrompt(currentTask.description, error);

  const dbSchema = await listTableSchemas();
  const systemMessagePrompt = generateQuerySystemPrompt(dbSchema);

  const { query, params } = await structuredLLM.invoke([
    new SystemMessage({ content: systemMessagePrompt }),
    new HumanMessage({ content: prompt }),
  ]);

  return { query, params };
};
