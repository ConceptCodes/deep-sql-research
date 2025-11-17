import { z } from "zod";
import { generateObject } from 'ai';

import type { AgentStateAnnotation } from "@/agent/state";
import { generatePlanSystemPrompt } from "@/agent/prompts";
import { taskSchema } from "@shared/types";
import { llm } from "@/helpers/llm";
import { listTableSchemas } from "@/helpers/db";

export const outputSchema = z.object({
  tasks: z.array(taskSchema),
});

export const plannerNode = async (state: typeof AgentStateAnnotation.State) => {
  const { goal, feedback } = state;

  let prompt = `Generate a plan for the following goal: ${goal}.`;
  if (feedback && feedback.trim() !== "") {
    prompt += `\nHere is some feedback on your earlier attempt: ${feedback}`;
  }

  const schema = await listTableSchemas();
  const systemPrompt = generatePlanSystemPrompt(schema);

  const result = await generateObject({
    model: llm,
    schema: outputSchema,
    prompt: `${systemPrompt}\n\n${prompt}`,
    temperature: 0,
  });

  return { tasks: result.object.tasks };
};
