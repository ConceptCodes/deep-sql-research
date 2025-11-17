import { Command } from "@langchain/langgraph";

import { Nodes } from "@shared/constants";
import type { TaskStateAnnotation } from "@/agent/state";
import { DBError, executeQuery } from "@/helpers/db";

export const executeQueryNode = async (
  state: typeof TaskStateAnnotation.State
) => {
  const { query, params } = state;
  const results = await executeQuery(query, params);

  if (results instanceof DBError) {
    return new Command({
      goto: Nodes.GENERATE_QUERY,
      update: {
        error: results.message,
      },
    });
  }

  return {
    results,
    error: "",
  };
};
