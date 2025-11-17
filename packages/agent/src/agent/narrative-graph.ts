import { START, END, StateGraph } from "@langchain/langgraph";

import { AgentStateAnnotation } from "./state";
import { Nodes } from "@shared/constants";
import { generateNarrativeNode } from "@/nodes/generate-narrative";
import { planScenesNode } from "@/nodes/plan-scenes";
import { designCardsNode } from "@/nodes/design-cards";
import { buildTimelineNode } from "@/nodes/build-timeline";
import { assembleTemplateNode } from "@/nodes/assemble-template";

// Create narrative subgraph that processes insights into a complete video template
export const narrativeSubGraph = new StateGraph(AgentStateAnnotation)
  .addNode(Nodes.GENERATE_NARRATIVE, generateNarrativeNode)
  .addNode(Nodes.PLAN_SCENES, planScenesNode)
  .addNode(Nodes.DESIGN_CARDS, designCardsNode)
  .addNode(Nodes.BUILD_TIMELINE, buildTimelineNode)
  .addNode(Nodes.ASSEMBLE_TEMPLATE, assembleTemplateNode)

  .addEdge(START, Nodes.GENERATE_NARRATIVE)
  .addEdge(Nodes.GENERATE_NARRATIVE, Nodes.PLAN_SCENES)
  .addEdge(Nodes.PLAN_SCENES, Nodes.DESIGN_CARDS)
  .addEdge(Nodes.DESIGN_CARDS, Nodes.BUILD_TIMELINE)
  .addEdge(Nodes.BUILD_TIMELINE, Nodes.ASSEMBLE_TEMPLATE)
  .addEdge(Nodes.ASSEMBLE_TEMPLATE, END)
  .compile();