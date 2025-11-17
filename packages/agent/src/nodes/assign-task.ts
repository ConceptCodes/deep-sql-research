import { Send } from "@langchain/langgraph";
import type { AgentStateAnnotation } from "@/agent/state";
import { Nodes } from "@shared/constants";

export const assignTaskNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { tasks } = state;

  return tasks.map((task) => {
    return new Send(Nodes.SEARCH, { currentTask: task });
  });
};
