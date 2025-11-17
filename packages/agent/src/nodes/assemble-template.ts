import type { AgentStateAnnotation } from "@/agent/state";
import type { TemplateJson } from "@shared/types";

export const assembleTemplateNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { goal, insights, narrative, scenes, cards, timeline } = state;

  const templateJson: TemplateJson = {
    version: "1.0.0",
    compositionId: `video_${Date.now()}`,
    meta: {
      title: `Data Insights: ${goal}`,
      description: `AI-generated video presentation about: ${goal}`,
      generatedAt: new Date().toISOString(),
      dataSource: "SQL Database Analysis",
    },
    dataBindings: {
      insights,
    },
    narrative,
    scenes,
    timeline,
    cards,
    theme: {
      primary: "#3b82f6",
      secondary: "#64748b", 
      accent: "#f59e0b",
      background: "#0f172a",
      surface: "#1e293b",
    },
    animationProfile: {
      speed: "normal",
      style: "cinematic",
    },
  };

  console.log(`Assembled template JSON with ${scenes.length} scenes and ${cards.length} cards`);

  return { templateJson };
};