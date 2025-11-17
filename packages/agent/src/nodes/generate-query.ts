import { z } from "zod";
import { generateObject } from 'ai';

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

  const result = await generateObject({
    model: llm,
    schema: outputSchema,
    prompt: `${systemMessagePrompt}\n\n${prompt}`,
    temperature: 0,
  });

  const { query, params } = result.object;
  return { query, params };
};
