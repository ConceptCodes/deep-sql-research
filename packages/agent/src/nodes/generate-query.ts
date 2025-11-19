import { z } from "zod";

import {
  generateQuerySystemPrompt,
  generateSqlQueryPrompt,
} from "@/agent/prompts";
import type { TaskStateAnnotation } from "@/agent/state";
import { generateSchemaObject } from "@/helpers/llm";
import { listTableSchemas } from "@/helpers/db";

const outputSchema = z.object({
  query: z
    .string()
    .describe("The generated SQL query based on user request"),
  params: z
    .array(z.string())
    .describe("The parameters for the SQL query, if any"),
});

export const generateQueryNode = async (
  state: typeof TaskStateAnnotation.State
): Promise<typeof TaskStateAnnotation.Update> => {
  const { currentTask, error } = state;

  const prompt = generateSqlQueryPrompt(currentTask.description, error);
  const dbSchema = await listTableSchemas();
  const systemMessagePrompt = generateQuerySystemPrompt(dbSchema);

  const result = await generateSchemaObject({
    schema: outputSchema,
    prompt: `${systemMessagePrompt}\n\n${prompt}`,
    temperature: 0,
  });

  const { query, params } = result;
  return { query, params };
};
