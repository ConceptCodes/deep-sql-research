import { Command } from "@langchain/langgraph";

import { reviewPlanSystemPrompt } from "@/agent/prompts";
import type { AgentStateAnnotation } from "@/agent/state";
import { generateSchemaObject } from "@/helpers/llm";
import { reviewSchema } from "@shared/types";
import { Nodes } from "@shared/constants";

export const reviewPlanNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { tasks } = state;
  const plan = tasks.map((task) => task.description).join("\n");

  const prompt =
    "Please review the following plan and provide feedback.\n" +
    JSON.stringify(plan, null, 2);

  const result = await generateSchemaObject({
    schema: reviewSchema,
    prompt: `${reviewPlanSystemPrompt}\n\n${prompt}`,
    temperature: 0,
  });

  const { grade, feedback } = result;

  switch (grade) {
    case "pass":
      return new Command({
        goto: Nodes.ASSIGN_TASK,
        update: {
          feedback: null,
        },
      });
    case "fail":
      return new Command({
        goto: Nodes.GENERATE_RESEARCH_PLAN,
        update: { feedback },
      });
  }
};
