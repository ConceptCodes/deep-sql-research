import { END, START, StateGraph } from "@langchain/langgraph";

import {
  AgentStateAnnotation,
  InputStateAnnotation,
  OutputStateAnnotation,
  TaskStateAnnotation,
} from "@/agent/state";
import { Nodes } from "@/helpers/constants";
import { plannerNode } from "@/nodes/planner";
import { reviewPlanNode } from "@/nodes/review-plan";
import { connectToDatabase } from "@/helpers/db";
import { generateQueryNode } from "@/nodes/generate-query";
import { executeQueryNode } from "@/nodes/execute-query";
import { assignTaskNode } from "@/nodes/assign-task";

await connectToDatabase("netflixdb.sqlite");

const subGraph = new StateGraph(TaskStateAnnotation)
  .addNode(Nodes.GENERATE_QUERY, generateQueryNode)
  .addNode(Nodes.EXECUTE_QUERY, executeQueryNode)

  .addEdge(START, Nodes.GENERATE_QUERY)
  .addEdge(Nodes.GENERATE_QUERY, Nodes.EXECUTE_QUERY)
  .addEdge(Nodes.EXECUTE_QUERY, END)
  .compile();

const workflow = new StateGraph({
  input: InputStateAnnotation,
  stateSchema: AgentStateAnnotation,
  output: OutputStateAnnotation,
})
  .addNode(Nodes.GENERATE_RESEARCH_PLAN, plannerNode)
  .addNode(Nodes.REVIEW_PLAN, reviewPlanNode, {
    ends: [Nodes.GENERATE_RESEARCH_PLAN, Nodes.ASSIGN_TASK],
  })
  .addNode(Nodes.ASSIGN_TASK, assignTaskNode)
  .addNode(Nodes.SEARCH, subGraph);

workflow.addEdge(START, Nodes.GENERATE_RESEARCH_PLAN);
workflow.addEdge(Nodes.GENERATE_RESEARCH_PLAN, Nodes.REVIEW_PLAN);
workflow.addEdge(Nodes.ASSIGN_TASK, Nodes.SEARCH);

export const graph = workflow.compile({
  name: "Deep SQL Research Agent",
});
