import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";

import { reviewPlanSystemPrompt } from "@/agent/prompts";
import type { AgentStateAnnotation } from "@/agent/state";
import { llm } from "@/helpers/llm";
import { reviewSchema } from "@/helpers/types";
import { Nodes } from "@/helpers/constants";

export const reviewPlanNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { tasks } = state;
  const plan = tasks.map((task) => task.description).join("\n");

  const prompt =
    "Please review the following plan and provide feedback.\n" +
    JSON.stringify(plan, null, 2);

  const structuredLLM = llm.withStructuredOutput(reviewSchema);

  const { grade, feedback } = await structuredLLM.invoke([
    new SystemMessage(reviewPlanSystemPrompt),
    new HumanMessage(prompt),
  ]);

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
