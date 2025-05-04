import { Command, END } from "@langchain/langgraph";
import type { AgentStateAnnotation } from "@/agent/state";
import { Nodes } from "@/helpers/constants";

export const assignTaskNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { tasks, feedback } = state;
  const currentTasks = [...tasks];

  const todo = currentTasks.at(0);

  if (todo) {
    if (feedback && feedback.trim() !== "") {
      return new Command({
        goto: Nodes.SEARCH,
        update: {
          tasks: currentTasks,
          currentTask: {
            description: todo.description,
            success: todo.successCase,
            feedback,
          },
        },
      });
    }

    return new Command({
      goto: Nodes.SEARCH,
      update: {
        tasks: currentTasks,
        currentTask: {
          description: todo.description,
          success: todo.successCase,
        },
      },
    });
  } else {
    return new Command({
      goto: END,
      update: {
        tasks: [],
        currentTask: null,
      },
    });
  }
};
