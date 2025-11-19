import { Command } from "@langchain/langgraph";

import { Nodes } from "@shared/constants";
import type { TaskStateAnnotation } from "@/agent/state";
import { executeQuery } from "@/helpers/db";

export const executeQueryNode = async (
  state: typeof TaskStateAnnotation.State
) => {
  const { query, params } = state;
  try {
    const results = await executeQuery(query, params);
    return {
      results,
      error: "",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Command({
      goto: Nodes.GENERATE_QUERY,
      update: {
        error: errorMessage,
      },
    });
  }
};
