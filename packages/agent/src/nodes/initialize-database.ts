import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { AgentStateAnnotation } from "@/agent/state";
import { connectToDatabase } from "@/helpers/db";
import { llm } from "@/helpers/llm";

export const initializeDatabaseNode = async (state: typeof AgentStateAnnotation.State) => {
  const { dbUrl } = state;

  if (!dbUrl || dbUrl.trim() === "") {
    throw new Error("Database URL is required");
  }

  try {
    await connectToDatabase(dbUrl);
    return { 
      dbUrl,
      feedback: `Successfully connected to database: ${dbUrl}`
    };
  } catch (error) {
    const errorMessage = `Failed to connect to database: ${error}`;
    return { 
      dbUrl,
      feedback: errorMessage
    };
  }
};