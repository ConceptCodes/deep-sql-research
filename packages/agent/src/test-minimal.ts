import { graph } from "./agent/graph";

async function testMinimal() {
  try {
    const result = await graph.invoke({ 
      goal: "List all tables", 
      dbUrl: "netflixdb.sqlite" 
    });
    console.log("SUCCESS:", result);
  } catch (error) {
    console.error("ERROR:", error);
  }
}

testMinimal();