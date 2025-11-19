import { z } from "zod";

import type { AgentStateAnnotation } from "@/agent/state";
import { generatePlanSystemPrompt } from "@/agent/prompts";
import { taskSchema } from "@shared/types";
import { generateStructuredOutput } from "@/helpers/llm";
import { connectToDatabase, listTableSchemas } from "@/helpers/db";

export const outputSchema = z.object({
  tasks: z.array(taskSchema),
});

export const plannerNode = async (state: typeof AgentStateAnnotation.State) => {
  const { goal, feedback, dbUrl, insights } = state;

  let prompt = `Generate a plan for the following goal: ${goal}.`;
  
  if (insights && insights.length > 0) {
    // Summarize existing insights to avoid redundancy
    const insightsSummary = insights
      .slice(0, 20) // Limit to top 20 to save tokens
      .map(i => `- ${i.title}`)
      .join('\n');
    prompt += `\n\nWe have already gathered the following insights:\n${insightsSummary}\n\n(Do NOT generate tasks that duplicate these findings.)`;
  }

  if (feedback && feedback.trim() !== "") {
    prompt += `\n\nFeedback/Missing Info from previous run: ${feedback}`;
    prompt += `\n\nIMPORTANT: If previous tasks failed (returned empty/low quality), SIMPLIFY your approach.
    - Avoid complex JOINs if they are failing.
    - Try querying single tables (e.g., 'SELECT * FROM table LIMIT 5') to verify data content and join keys.
    - Break down complex questions into smaller, simpler queries.`;
  }

  // Ensure database is connected for this node
  await connectToDatabase(dbUrl);
  const schema = await listTableSchemas();
  const systemPrompt = generatePlanSystemPrompt(schema);

  const result = await generateStructuredOutput(
    outputSchema,
    prompt,
    systemPrompt
  );

  return { tasks: result.tasks };
};
