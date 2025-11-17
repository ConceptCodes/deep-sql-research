import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";


import type { TaskStateAnnotation } from "@/agent/state";
import { llm } from "@/helpers/llm";

const outputSchema = z.object({
  followUpQuestions: z
    .array(z.string())
    .describe("The follow up questions to ask the user"),
});

export const reviewResultsNode = async (
  state: typeof TaskStateAnnotation.State
) => {
  const { results, query, currentTask } = state;
  const structuredLLM = llm.withStructuredOutput(outputSchema);
};
