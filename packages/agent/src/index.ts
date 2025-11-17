import path from "path";
import fs from "fs";

import { graph } from "./agent/graph";

const drawResearchGraph = async () => {
  // TODO: Implement graph drawing if needed
  console.log("Graph drawing not implemented");
};

const run = async () => {
  // await drawResearchGraph()

  const goal = prompt("Enter the goal of the research: ");
  const dbUrl = prompt("Enter the SQLite database file path: ") || "netflixdb.sqlite";
  
  if (!goal) {
    console.error("Goal is required");
    return;
  }

  console.log(`Starting research with goal: "${goal}"`);
  console.log(`Using database: "${dbUrl}"`);
  
  // TODO: Invoke the graph with goal and dbUrl
  // const result = await graph.invoke({ goal, dbUrl });
  // console.log("Research completed:", result.finalReport);
};

run().catch((error) => {
  console.error("Error running the research agent:", error);
});
