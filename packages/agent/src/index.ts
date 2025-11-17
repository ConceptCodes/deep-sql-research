import path from "path";
import fs from "fs";

import { graph } from "./agent/graph";
import type { TemplateJson } from "@shared/types";

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
  
  try {
    const result = await graph.invoke({ goal, dbUrl });
    
    if (result.templateJson) {
      console.log("✅ Template generated successfully!");
      console.log(`📊 Generated ${result.insights.length} insights`);
      console.log(`🎬 Created ${result.templateJson.timeline.scenes.length} scenes`);
      console.log(`🎴 Designed ${result.templateJson.cards.length} cards`);
      
      // Output the template JSON to stdout for piping
      console.log("\n--- TEMPLATE JSON ---");
      console.log(JSON.stringify(result.templateJson, null, 2));
    } else {
      console.error("❌ Failed to generate template");
      console.log("Insights generated:", result.insights.length);
    }
  } catch (error) {
    console.error("❌ Error running research agent:", error);
    process.exit(1);
  }
};

// Export for programmatic usage
export { graph, run };

// Run if called directly
if (require.main === module) {
  run().catch((error) => {
    console.error("Error running the research agent:", error);
    process.exit(1);
  });
}
