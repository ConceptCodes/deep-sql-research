import { END, START, StateGraph, Send } from "@langchain/langgraph";

import {
  AgentStateAnnotation,
  InputStateAnnotation,
  OutputStateAnnotation,
  TaskStateAnnotation,
} from "@/agent/state";
import { Nodes } from "@shared/constants";
import { plannerNode } from "@/nodes/planner";
import { reviewPlanNode } from "@/nodes/review-plan";
import { generateQueryNode } from "@/nodes/generate-query";
import { executeQueryNode } from "@/nodes/execute-query";
import { assignTaskNode } from "@/nodes/assign-task";
import { initializeDatabaseNode } from "@/nodes/initialize-database";
import { analyzeResultsNode } from "@/nodes/analyze-results";
import { synthesizeInsightsNode } from "@/nodes/synthesize-insights";
import { enoughInfoGateNode } from "@/nodes/enough-info-gate";
import { narrativeSubGraph } from "./narrative-graph";

const searchSubGraph = new StateGraph(TaskStateAnnotation)
  .addNode(Nodes.GENERATE_QUERY, generateQueryNode)
  .addNode(Nodes.EXECUTE_QUERY, executeQueryNode)
  .addNode(Nodes.ANALYZE_RESULTS, analyzeResultsNode)

  .addEdge(START, Nodes.GENERATE_QUERY)
  .addEdge(Nodes.GENERATE_QUERY, Nodes.EXECUTE_QUERY)
  .addEdge(Nodes.EXECUTE_QUERY, Nodes.ANALYZE_RESULTS)
  .addEdge(Nodes.ANALYZE_RESULTS, END)
  .compile();

const workflow = new StateGraph({
  input: InputStateAnnotation,
  stateSchema: AgentStateAnnotation,
  output: OutputStateAnnotation,
})
  .addNode(Nodes.INITIALIZE_DATABASE, initializeDatabaseNode)
  .addNode(Nodes.GENERATE_RESEARCH_PLAN, plannerNode)
  .addNode(Nodes.REVIEW_PLAN, reviewPlanNode, {
    ends: [Nodes.GENERATE_RESEARCH_PLAN, Nodes.ASSIGN_TASK],
  })
  .addNode(Nodes.ASSIGN_TASK, assignTaskNode)
  .addNode(Nodes.SEARCH, searchSubGraph)
  .addNode(Nodes.SYNTHESIZE_INSIGHTS, synthesizeInsightsNode)
  .addNode(Nodes.ENOUGH_INFO_GATE, enoughInfoGateNode)
  .addNode(Nodes.NARRATIVE_GRAPH, narrativeSubGraph);

workflow.addEdge(START, Nodes.INITIALIZE_DATABASE);
workflow.addEdge(Nodes.INITIALIZE_DATABASE, Nodes.GENERATE_RESEARCH_PLAN);
workflow.addEdge(Nodes.GENERATE_RESEARCH_PLAN, Nodes.REVIEW_PLAN);
workflow.addEdge(Nodes.REVIEW_PLAN, Nodes.ASSIGN_TASK);

// Create routing function for parallel task execution
const routeTasks = (state: typeof AgentStateAnnotation.State) => {
  const { tasks } = state;
  return tasks.map((task) => new Send(Nodes.SEARCH, { currentTask: task }));
};

workflow.addConditionalEdges(Nodes.ASSIGN_TASK, routeTasks);
workflow.addEdge(Nodes.SEARCH, Nodes.SYNTHESIZE_INSIGHTS);
workflow.addEdge(Nodes.SYNTHESIZE_INSIGHTS, Nodes.ENOUGH_INFO_GATE);

// Conditional routing from the gate
workflow.addConditionalEdges(
  Nodes.ENOUGH_INFO_GATE,
  (state) => state.hasEnoughInfo ? "enough" : "continue",
  {
    enough: Nodes.NARRATIVE_GRAPH,
    continue: Nodes.GENERATE_RESEARCH_PLAN,
  }
);

export const graph = workflow.compile({
  name: "Deep SQL Research Agent",
});
