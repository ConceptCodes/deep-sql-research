import { Send } from "@langchain/langgraph";
import type { AgentStateAnnotation } from "@/agent/state";
import { Nodes } from "@shared/constants";

// Use the END constant directly
const END_NODE = "__end__";

export const assignTaskNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { tasks } = state;

  // Return empty object - the routing will be handled by conditional edge
  return { reasoning: `Preparing to execute ${tasks.length} tasks in parallel` };
};

// Routing function to create Send objects for parallel execution
export const routeTasks = (state: typeof AgentStateAnnotation.State) => {
  const { tasks } = state;
  
  if (tasks.length === 0) {
    return "__end__"; // No tasks, end the workflow
  }
  
  // Create Send objects for each task to be executed in parallel
  return tasks.map((task) => {
    return new Send(Nodes.SEARCH, { currentTask: task });
  });
};
