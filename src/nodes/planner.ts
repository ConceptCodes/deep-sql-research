import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { AgentStateAnnotation } from "@/agent/state";
import { generatePlanSystemPrompt } from "@/agent/prompts";
import { taskSchema } from "@/helpers/types";
import { llm } from "@/helpers/llm";
import { listTableSchemas } from "@/helpers/db";

export const outputSchema = z.object({
  tasks: z.array(taskSchema),
});

export const plannerNode = async (state: typeof AgentStateAnnotation.State) => {
  const { goal, feedback } = state;

  const structuredLLM = llm.withStructuredOutput(outputSchema);

  let prompt = `Generate a plan for the following goal: ${goal}.`;
  if (feedback && feedback.trim() !== "") {
    prompt += `\nHere is some feedback on your earlier attempt: ${feedback}`;
  }

  const schema = await listTableSchemas();
  const systemPrompt = generatePlanSystemPrompt(schema);

  const { tasks } = await structuredLLM.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  return { tasks };
};
